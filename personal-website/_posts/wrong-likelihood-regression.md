---
title: "Wrong Likelihood, Wrong Price"
date: 2026-09-21
tags: [bayes, pymc, poisson, likelihood, pricing, decision]
excerpt: "Poisson demand, a Gaussian likelihood, and a price that costs about a fifth of the profit."
katex: true
---

A demand curve is not just “sales go down when price goes up.” The likelihood is the model. If we write down the wrong one, we do not just get different $a$ and $b$ — we pick the wrong price, and the company feels it.

# The experiment

A shop randomizes shelf price on a SKU for $n=40$ days. $x$ is price. $y$ is units sold that day — the count of purchases. Unit cost is $c=8$.

If $T$ people walk past the shelf and each buys with probability $\pi(p)$, then $\operatorname{E}[y \mid p] = T\,\pi(p)$. Expected profit is that times net revenue:

$$
\pi(p) = \operatorname{E}[y \mid p]\,(p - c) = e^{a + bp}\,(p - c)
$$

We never need $\pi$ itself. The count is enough. After the test we lock one price for a year across 25 stores.

The DGP is Poisson demand with a log-linear price response, $a \approx 4.00$, $b \approx -0.19$:

$$
y_i \sim \operatorname{Poisson}\!\left(e^{a + b p_i}\right)
$$

For this mean, the true optimal price is $p^\star = c - 1/b \approx 13.21$.

![Units sold vs randomized price](/assets/blog/wrong-likelihood-data.png)

# Two models, same mean, same priors

Both models use $\lambda_i = \exp(a + b p_i)$ and the same priors on $a$ and $b$. The only change is the sampling statement.

Wrong (treat counts as Gaussian):

$$
y_i \sim \operatorname{Normal}(\lambda_i, \sigma)
$$

Correct (the DGP):

$$
y_i \sim \operatorname{Poisson}(\lambda_i)
$$

Each posterior then chooses a price by maximizing expected profit, averaging over the draws of $a$ and $b$:

$$
p^\star(\text{model}) = \arg\max_p\; \operatorname{E}\!\left[e^{a + bp}\,(p - c) \mid \text{data}\right]
$$

That is the decision. The posterior is not the end of the analysis — it is the input to the argmax.

# Posteriors of $a$ and $b$

![Posterior densities of intercept a and price slope b](/assets/blog/wrong-likelihood-parameter-posteriors.png)

| Parameter | Truth | Normal mean (95% CrI) | Poisson mean (95% CrI) |
|-----------|-------|------------------------|------------------------|
| $a$ | 4.00 | 6.32 (4.87, 8.12) | 4.46 (3.60, 5.22) |
| $b$ | −0.19 | −0.39 (−0.55, −0.26) | −0.23 (−0.29, −0.17) |

The Normal model uses a constant $\sigma$, so the high-volume cheap days dominate the fit. It concludes demand is much more elastic than it is. Poisson knows $\operatorname{Var}(y)=\lambda$ and keeps $b$ on the DGP.

# The pricing decision

![True profit versus each model's expected profit](/assets/blog/wrong-likelihood-profit.png)

Figures in USD. “Model expects” is posterior expected annual profit at the price that model chose. “True profit” is what that price actually earns on the DGP, rolled out to 25 stores for 365 days.

| Policy | Chosen price | Model expects | True profit |
|--------|--------------|---------------|-------------|
| Truth | 13.21 | 205,000 | 205,000 |
| Poisson likelihood | 12.35 | 202,000 | 202,000 |
| Normal likelihood | 10.55 | 219,000 | 168,000 |

The Normal model is not just a little off on $b$. It *believes* profit peaks near 10.55 and that the peak is 219,000. On the true demand curve that price earns 168,000 — about 35,000 less per year than the Poisson price, and 51,000 less than the Normal model promised. Roughly a fifth of optimal profit, left on the table because it underprices to chase volume that is not actually that price-sensitive.

That is the company cost of the wrong likelihood. $a$ and $b$ are only the intercept and slope of *that* sampling model. Maximize profit under the wrong posterior and you choose the wrong $p$.

# Code

PyMC and matplotlib, no notebooks. Full script is in `blogs/python/2026-09-21-wrong-likelihood/`.

```python
import pymc as pm
import numpy as np

with pm.Model():
    a = pm.Normal("a", 0, 5)
    b = pm.Normal("b", 0, 1)
    lam = pm.math.exp(a + b * price)

    # wrong
    sigma = pm.HalfNormal("sigma", 2)
    pm.Normal("y", mu=lam, sigma=sigma, observed=y)

    # correct
    # pm.Poisson("y", mu=lam, observed=y)

# posterior expected profit, then argmax
profit = np.exp(a_draws[:, None] + b_draws[:, None] * grid) * (grid - cost)
p_star = grid[np.argmax(profit.mean(axis=0))]
```
