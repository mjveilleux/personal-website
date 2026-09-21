---
title: "Wrong Likelihood, Different a and b"
date: 2026-09-21
tags: [bayes, pymc, likelihood, regression]
excerpt: "If the sampling model is wrong, the posteriors of a and b are not the a and b you think they are."
katex: true
---

A linear regression is not just $y \sim a + bx$. The likelihood is the model. If we write down the wrong one, the posteriors of $a$ and $b$ move.

# The data

Simulate $n=60$ points from a regression whose errors are Student-$t$ with $\nu = 3$, not Gaussian:

$$
y_i = a + b x_i + \sigma\,\varepsilon_i, \qquad \varepsilon_i \sim t_{3},
$$

with $a=1$, $b=2$, $\sigma=0.8$. Heavy tails are allowed. One draw lands around $y \approx -21$.

![Simulated regression with a heavy-tailed residual](/assets/blog/wrong-likelihood-data.png)

# Two models, same mean, same priors

Both models use $\mu_i = a + b x_i$ and the same weakly informative priors on $a$, $b$, and $\sigma$. The only change is the sampling statement.

Wrong likelihood (what we reach for by default):

$$
y_i \sim \operatorname{Normal}(\mu_i, \sigma)
$$

Correct likelihood (the DGP):

$$
y_i \sim t_{3}(\mu_i,\,\sigma)
$$

# Posteriors of $a$ and $b$

![Posterior densities of intercept a and slope b](/assets/blog/wrong-likelihood-parameter-posteriors.png)

| Parameter | Truth | Normal mean (95% CrI) | Student-$t$ mean (95% CrI) |
|-----------|-------|------------------------|----------------------------|
| $a$ | 1.00 | 0.57 (−0.16, 1.31) | 0.89 (0.60, 1.17) |
| $b$ | 2.00 | 2.14 (1.62, 2.65) | 2.02 (1.82, 2.21) |

The Normal model treats that tail point as a typical Gaussian residual, so it pays a quadratic penalty and drags $a$ down. The posterior is wide enough that $a=0$ is still plausible. The Student-$t$ likelihood expects occasional extremes, down-weights them, and puts the mass of $a$ and $b$ on the truth.

That is the whole point of writing the correct likelihood: $a$ and $b$ are only the intercept and slope of *that* sampling model. Change the likelihood and you are estimating different parameters, even when the mean function looks identical.

# Code

PyMC, no notebooks. Full script is in `blogs/python/2026-09-21-wrong-likelihood/`.

```python
import pymc as pm

with pm.Model():
    a = pm.Normal("a", 0, 5)
    b = pm.Normal("b", 0, 5)
    sigma = pm.HalfNormal("sigma", 2)
    mu = a + b * x

    # wrong
    pm.Normal("y", mu=mu, sigma=sigma, observed=y)

    # correct
    # pm.StudentT("y", nu=3, mu=mu, sigma=sigma, observed=y)
```
