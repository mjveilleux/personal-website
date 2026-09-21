"""
Simulate y ~ Poisson(exp(a + b x)), then fit two Bayesian regressions
that share the same mean function and the same priors on a and b:

  - wrong likelihood:    y ~ Normal(exp(a + b x), sigma)
  - correct likelihood:  y ~ Poisson(exp(a + b x))

The Normal model ignores that counts have variance equal to the mean,
so the posteriors of a and b shift. The Poisson model recovers the DGP.

Plots are matplotlib only (no ArviZ plots, no notebooks).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pymc as pm
from scipy.stats import gaussian_kde

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import theme

HERE = Path(__file__).resolve().parent
SITE_ASSETS = HERE.parents[2] / "personal-website" / "public" / "assets" / "blog"
ARTIFACTS = Path("/opt/cursor/artifacts")

TRUE_A = 1.0
TRUE_B = 0.8
N = 80
SEED = 16


def mean_fn(a, b, x):
    return np.exp(a + b * x)


def simulate(seed: int = SEED) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    x = np.sort(rng.uniform(-2.0, 1.0, N))
    y = rng.poisson(mean_fn(TRUE_A, TRUE_B, x))
    return x, y


def fit(x: np.ndarray, y: np.ndarray, family: str, seed: int = SEED):
    coords = {"obs": np.arange(len(x))}
    with pm.Model(coords=coords) as model:
        a = pm.Normal("a", 0.0, 5.0)
        b = pm.Normal("b", 0.0, 5.0)
        mu = pm.math.exp(a + b * x)
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


def plot_parameter_posteriors(
    wrong: dict[str, np.ndarray],
    correct: dict[str, np.ndarray],
    path: Path,
) -> Path:
    theme.apply("sand")
    fig, axes = plt.subplots(1, 2, figsize=(theme.SPACE.content_width_in, 3.6))

    specs = (
        ("a", TRUE_A, "Intercept a"),
        ("b", TRUE_B, "Slope b"),
    )
    for ax, (name, truth, title) in zip(axes, specs):
        w = wrong[name]
        c = correct[name]
        lo = min(w.min(), c.min(), truth) - 0.15
        hi = max(w.max(), c.max(), truth) + 0.15
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


def plot_data(x: np.ndarray, y: np.ndarray, wrong: dict, correct: dict, path: Path) -> Path:
    theme.apply("sand")
    fig, ax = plt.subplots()
    xs = np.linspace(x.min(), x.max(), 200)
    ax.scatter(x, y, s=22, color=theme.COLORS.ink, alpha=0.55, label="Simulated y", zorder=3)
    ax.plot(xs, mean_fn(TRUE_A, TRUE_B, xs), color=theme.COLORS.ink, linestyle=(0, (1.15, 2.2)), label="Truth")
    ax.plot(
        xs,
        mean_fn(wrong["a"].mean(), wrong["b"].mean(), xs),
        color=theme.COLORS.clay,
        label="Normal posterior mean",
    )
    ax.plot(
        xs,
        mean_fn(correct["a"].mean(), correct["b"].mean(), xs),
        color=theme.COLORS.pine,
        label="Poisson posterior mean",
    )
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    theme.set_title(ax, "y ~ Poisson(exp(a + b x))")
    ax.legend(loc="upper left", frameon=False)
    fig.tight_layout()
    return theme.savefig(fig, path)


def main() -> None:
    x, y = simulate()
    np.savetxt(
        HERE / "data.csv",
        np.column_stack([x, y]),
        delimiter=",",
        header="x,y",
        comments="",
    )

    _, idata_wrong = fit(x, y, "normal")
    _, idata_correct = fit(x, y, "poisson")

    wrong = {"a": draws(idata_wrong, "a"), "b": draws(idata_wrong, "b")}
    correct = {"a": draws(idata_correct, "a"), "b": draws(idata_correct, "b")}

    summary = {
        "truth": {"a": TRUE_A, "b": TRUE_B, "n": N, "seed": SEED, "family": "poisson"},
        "normal": summarize(wrong["a"], wrong["b"]),
        "poisson": summarize(correct["a"], correct["b"]),
    }
    (HERE / "summary.json").write_text(json.dumps(summary, indent=2))

    SITE_ASSETS.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)

    posterior_name = "wrong-likelihood-parameter-posteriors.png"
    data_name = "wrong-likelihood-data.png"
    paths = [
        HERE / posterior_name,
        SITE_ASSETS / posterior_name,
        ARTIFACTS / "parameter_posteriors.png",
    ]
    plot = plot_parameter_posteriors(wrong, correct, paths[0])
    for dest in paths[1:]:
        dest.write_bytes(plot.read_bytes())

    data_plot = plot_data(x, y, wrong, correct, HERE / data_name)
    (SITE_ASSETS / data_name).write_bytes(data_plot.read_bytes())
    (ARTIFACTS / "simulated_regression_data.png").write_bytes(data_plot.read_bytes())

    print(json.dumps(summary, indent=2))
    print(f"wrote {plot}")


if __name__ == "__main__":
    main()
