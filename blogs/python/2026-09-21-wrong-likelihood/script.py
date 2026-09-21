"""
Poisson demand experiment, then a pricing decision.

  y | price  ~ Poisson(exp(a + b * price)),   b < 0
  profit(price) = E[y | price] * (price - cost)

Two models share the log-linear mean and the priors on a, b:

  - wrong:    y ~ Normal(exp(a + b * price), sigma)
  - correct:  y ~ Poisson(exp(a + b * price))

Each posterior picks a price that maximizes expected profit. Evaluated
on the true demand curve, the Normal price leaves money on the table.

Plots are matplotlib only (no ArviZ plots, no notebooks).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pymc as pm
from matplotlib.ticker import FuncFormatter
from scipy.stats import gaussian_kde

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import theme

HERE = Path(__file__).resolve().parent
SITE_ASSETS = HERE.parents[2] / "personal-website" / "public" / "assets" / "blog"
ARTIFACTS = Path("/opt/cursor/artifacts")

PRICE_MIN = 10.0
PRICE_MAX = 22.0
COST = 8.0
N = 40
SEED = 12
STORES = 25
DAYS = 365
SCALE = STORES * DAYS  # roll the chosen price out for a year across stores

# λ(10)=8, λ(22)=0.8 so counts stay small (Poisson ≠ Normal) and p* is interior.
TRUE_B = (np.log(0.8) - np.log(8.0)) / (PRICE_MAX - PRICE_MIN)
TRUE_A = np.log(8.0) - TRUE_B * PRICE_MIN


def mean_fn(a, b, price):
    return np.exp(a + b * price)


def true_optimal_price() -> float:
    return float(COST - 1.0 / TRUE_B)


def simulate(seed: int = SEED) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    price = np.sort(rng.uniform(PRICE_MIN, PRICE_MAX, N))
    y = rng.poisson(mean_fn(TRUE_A, TRUE_B, price))
    return price, y


def fit(price: np.ndarray, y: np.ndarray, family: str, seed: int = SEED):
    coords = {"obs": np.arange(len(price))}
    with pm.Model(coords=coords) as model:
        a = pm.Normal("a", 0.0, 5.0)
        b = pm.Normal("b", 0.0, 1.0)
        mu = pm.math.exp(a + b * price)
        if family == "normal":
            sigma = pm.HalfNormal("sigma", 2.0)
            pm.Normal("y", mu=mu, sigma=sigma, observed=y, dims="obs")
        elif family == "poisson":
            pm.Poisson("y", mu=mu, observed=y, dims="obs")
        else:
            raise ValueError(family)
        idata = pm.sample(
            draws=1000,
            tune=1000,
            chains=4,
            cores=4,
            target_accept=0.9,
            random_seed=seed,
            progressbar=False,
        )
    return model, idata


def draws(idata, name: str) -> np.ndarray:
    return np.asarray(idata.posterior[name]).ravel()


def summarize(draws_a: np.ndarray, draws_b: np.ndarray) -> dict:
    def stats(arr: np.ndarray) -> dict:
        return {
            "mean": float(arr.mean()),
            "q025": float(np.quantile(arr, 0.025)),
            "q975": float(np.quantile(arr, 0.975)),
        }

    return {"a": stats(draws_a), "b": stats(draws_b)}


def expected_profit_curve(
    a_draws: np.ndarray, b_draws: np.ndarray, prices: np.ndarray
) -> np.ndarray:
    """Bayesian expected daily profit: mean over posterior of λ(p)*(p-c)."""
    lam = np.exp(a_draws[:, None] + b_draws[:, None] * prices[None, :])
    return (lam * (prices[None, :] - COST)).mean(axis=0)


def true_profit(prices: np.ndarray) -> np.ndarray:
    return mean_fn(TRUE_A, TRUE_B, prices) * (prices - COST)


def choose_price(a_draws: np.ndarray, b_draws: np.ndarray, grid: np.ndarray) -> float:
    curve = expected_profit_curve(a_draws, b_draws, grid)
    return float(grid[int(np.argmax(curve))])


def plot_parameter_posteriors(
    wrong: dict[str, np.ndarray],
    correct: dict[str, np.ndarray],
    path: Path,
) -> Path:
    theme.apply("sand")
    fig, axes = plt.subplots(1, 2, figsize=(theme.SPACE.content_width_in, 3.6))
    specs = (
        ("a", TRUE_A, "Intercept a"),
        ("b", TRUE_B, "Price slope b"),
    )
    for ax, (name, truth, title) in zip(axes, specs):
        w = wrong[name]
        c = correct[name]
        lo = min(w.min(), c.min(), truth) - 0.08
        hi = max(w.max(), c.max(), truth) + 0.08
        xs = np.linspace(lo, hi, 400)
        kde_w = gaussian_kde(w)
        kde_c = gaussian_kde(c)
        ax.fill_between(xs, kde_w(xs), color=theme.COLORS.clay, alpha=0.45, linewidth=0)
        ax.plot(xs, kde_w(xs), color=theme.COLORS.clay, label="Normal likelihood")
        ax.fill_between(xs, kde_c(xs), color=theme.COLORS.pine, alpha=0.28, linewidth=0)
        ax.plot(xs, kde_c(xs), color=theme.COLORS.pine, label="Poisson likelihood")
        ax.axvline(
            truth,
            color=theme.COLORS.ink,
            linestyle=(0, (1.15, 2.2)),
            linewidth=1.35,
            label="Truth",
        )
        ax.set_xlabel(name)
        ax.set_ylabel("Posterior density")
        theme.set_title(ax, title)

    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(
        handles,
        labels,
        loc="upper center",
        ncol=3,
        bbox_to_anchor=(0.5, 1.04),
        frameon=False,
    )
    fig.tight_layout()
    return theme.savefig(fig, path)


def plot_data(price: np.ndarray, y: np.ndarray, wrong: dict, correct: dict, path: Path) -> Path:
    theme.apply("sand")
    fig, ax = plt.subplots()
    grid = np.linspace(PRICE_MIN, PRICE_MAX, 200)
    ax.scatter(price, y, s=22, color=theme.COLORS.ink, alpha=0.55, label="Units sold", zorder=3)
    ax.plot(grid, mean_fn(TRUE_A, TRUE_B, grid), color=theme.COLORS.ink, linestyle=(0, (1.15, 2.2)), label="True demand")
    ax.plot(
        grid,
        mean_fn(wrong["a"].mean(), wrong["b"].mean(), grid),
        color=theme.COLORS.clay,
        label="Normal demand",
    )
    ax.plot(
        grid,
        mean_fn(correct["a"].mean(), correct["b"].mean(), grid),
        color=theme.COLORS.pine,
        label="Poisson demand",
    )
    ax.set_xlabel("Price ($)")
    ax.set_ylabel("Units sold")
    theme.set_title(ax, "Demand: purchases vs price")
    ax.legend(loc="upper right", frameon=False)
    fig.tight_layout()
    return theme.savefig(fig, path)


def plot_profit(
    wrong: dict,
    correct: dict,
    price_wrong: float,
    price_correct: float,
    path: Path,
) -> Path:
    theme.apply("sand")
    fig, ax = plt.subplots()
    grid = np.linspace(PRICE_MIN, PRICE_MAX, 400)
    true_pi = true_profit(grid) * SCALE
    wrong_pi = expected_profit_curve(wrong["a"], wrong["b"], grid) * SCALE
    correct_pi = expected_profit_curve(correct["a"], correct["b"], grid) * SCALE
    p_true = true_optimal_price()

    ax.plot(grid, true_pi, color=theme.COLORS.ink, linestyle=(0, (1.15, 2.2)), label="True profit")
    ax.plot(grid, wrong_pi, color=theme.COLORS.clay, label="Normal expected profit")
    ax.plot(grid, correct_pi, color=theme.COLORS.pine, label="Poisson expected profit")

    def marker(p, color, label):
        yv = float(true_profit(np.array([p]))[0] * SCALE)
        ax.axvline(p, color=color, linewidth=1.1, alpha=0.85)
        ax.scatter([p], [yv], color=color, s=28, zorder=4, label=label)

    marker(p_true, theme.COLORS.ink, f"True p* ${p_true:.2f}")
    marker(price_correct, theme.COLORS.pine, f"Poisson p* ${price_correct:.2f}")
    marker(price_wrong, theme.COLORS.clay, f"Normal p* ${price_wrong:.2f}")

    ax.set_xlabel("Price ($)")
    ax.set_ylabel("Annual profit")
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v / 1000:.0f}k"))
    theme.set_title(ax, "Profit = expected units × (price − cost)")
    ax.legend(loc="upper right", frameon=False, fontsize=8)
    fig.tight_layout()
    return theme.savefig(fig, path)


def write_copies(src: Path, *dests: Path) -> None:
    data = src.read_bytes()
    for dest in dests:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)


def main() -> None:
    price, y = simulate()
    np.savetxt(
        HERE / "data.csv",
        np.column_stack([price, y]),
        delimiter=",",
        header="price,units",
        comments="",
    )

    _, idata_wrong = fit(price, y, "normal")
    _, idata_correct = fit(price, y, "poisson")

    wrong = {"a": draws(idata_wrong, "a"), "b": draws(idata_wrong, "b")}
    correct = {"a": draws(idata_correct, "a"), "b": draws(idata_correct, "b")}

    grid = np.linspace(PRICE_MIN, PRICE_MAX, 501)
    p_true = true_optimal_price()
    p_wrong = choose_price(wrong["a"], wrong["b"], grid)
    p_correct = choose_price(correct["a"], correct["b"], grid)

    pi_true = float(true_profit(np.array([p_true]))[0])
    pi_wrong = float(true_profit(np.array([p_wrong]))[0])
    pi_correct = float(true_profit(np.array([p_correct]))[0])
    believed_wrong = float(expected_profit_curve(wrong["a"], wrong["b"], np.array([p_wrong]))[0])
    believed_correct = float(
        expected_profit_curve(correct["a"], correct["b"], np.array([p_correct]))[0]
    )

    summary = {
        "truth": {
            "a": TRUE_A,
            "b": TRUE_B,
            "n": N,
            "seed": SEED,
            "cost": COST,
            "price_min": PRICE_MIN,
            "price_max": PRICE_MAX,
            "stores": STORES,
            "days": DAYS,
            "scale": SCALE,
            "optimal_price": p_true,
            "daily_profit": pi_true,
            "annual_profit": pi_true * SCALE,
        },
        "normal": {
            **summarize(wrong["a"], wrong["b"]),
            "chosen_price": p_wrong,
            "believed_annual_profit": believed_wrong * SCALE,
            "true_daily_profit": pi_wrong,
            "true_annual_profit": pi_wrong * SCALE,
        },
        "poisson": {
            **summarize(correct["a"], correct["b"]),
            "chosen_price": p_correct,
            "believed_annual_profit": believed_correct * SCALE,
            "true_daily_profit": pi_correct,
            "true_annual_profit": pi_correct * SCALE,
        },
        "gap": {
            "price_normal_minus_poisson": p_wrong - p_correct,
            "annual_profit_poisson_minus_normal": (pi_correct - pi_wrong) * SCALE,
            "pct_of_optimal": 100.0 * (pi_true - pi_wrong) / pi_true,
        },
    }
    (HERE / "summary.json").write_text(json.dumps(summary, indent=2))

    SITE_ASSETS.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)

    posteriors = plot_parameter_posteriors(
        wrong, correct, HERE / "wrong-likelihood-parameter-posteriors.png"
    )
    data_plot = plot_data(price, y, wrong, correct, HERE / "wrong-likelihood-data.png")
    profit_plot = plot_profit(
        wrong, correct, p_wrong, p_correct, HERE / "wrong-likelihood-profit.png"
    )

    write_copies(
        posteriors,
        SITE_ASSETS / posteriors.name,
        ARTIFACTS / "parameter_posteriors.png",
    )
    write_copies(
        data_plot,
        SITE_ASSETS / data_plot.name,
        ARTIFACTS / "simulated_regression_data.png",
    )
    write_copies(
        profit_plot,
        SITE_ASSETS / profit_plot.name,
        ARTIFACTS / "profit_maximization.png",
    )

    print(json.dumps(summary, indent=2))
    print(f"wrote {posteriors}")
    print(f"wrote {profit_plot}")


if __name__ == "__main__":
    main()
