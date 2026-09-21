---
title: "Wrong Likelihood, Different a and b"
date: 2026-09-21
tags: [bayes, pymc, poisson, likelihood]
excerpt: "Counts from a Poisson regression, fit as if they were Normal. The posteriors of a and b are not the same parameters."
katex: true
---

A regression is not just $\mu = a + bx$. The likelihood is the model. If we write down the wrong one, the posteriors of $a$ and $b$ move.

# The data

Simulate $n=80$ counts from a Poisson regression. The mean is log-linear in $x$:

$$
y_i \sim \operatorname{Poisson}(\lambda_i), \qquad \lambda_i = \exp(a + b x_i)
$$

with $a=1$ and $b=0.8$. Variance equals the mean, so the cloud fans out as $\lambda$ grows. There are zeros on the left and counts up to 13 on the right.

![Simulated Poisson counts with log-linear mean](/assets/blog/wrong-likelihood-data.png)

# Two models, same mean, same priors

Both models use $\lambda_i = \exp(a + b x_i)$ and the same weakly informative priors on $a$ and $b$. The only change is the sampling statement.

Wrong likelihood (treat counts as Gaussian):

$$
y_i \sim \operatorname{Normal}(\lambda_i, \sigma)
$$

Correct likelihood (the DGP):

$$
y_i \sim \operatorname{Poisson}(\lambda_i)
$$

# Posteriors of $a$ and $b$

![Posterior densities of intercept a and slope b](/assets/blog/wrong-likelihood-parameter-posteriors.png)

| Parameter | Truth | Normal mean (95% CrI) | Poisson mean (95% CrI) |
|-----------|-------|------------------------|------------------------|
| $a$ | 1.00 | 0.81 (0.53, 1.04) | 1.00 (0.85, 1.14) |
| $b$ | 0.80 | 1.28 (0.96, 1.66) | 0.88 (0.70, 1.07) |

The Normal model uses a constant $\sigma$, so the high-$\lambda$ points on the right dominate the fit and pull $b$ up. The 95% interval for $b$ does not even contain the truth. Poisson knows $\operatorname{Var}(y)=\lambda$, down-weights those noisy counts, and puts $a$ and $b$ on the DGP.

That is the whole point of writing the correct likelihood: $a$ and $b$ are only the intercept and slope of *that* sampling model. Change the likelihood and you are estimating different parameters, even when the mean function looks identical.

# Code

PyMC and matplotlib, no notebooks. Full script is in `blogs/python/2026-09-21-wrong-likelihood/`.

```python
import pymc as pm

with pm.Model():
    a = pm.Normal("a", 0, 5)
    b = pm.Normal("b", 0, 5)
    lam = pm.math.exp(a + b * x)

    # wrong
    sigma = pm.HalfNormal("sigma", 2)
    pm.Normal("y", mu=lam, sigma=sigma, observed=y)

    # correct
    # pm.Poisson("y", mu=lam, observed=y)
```
