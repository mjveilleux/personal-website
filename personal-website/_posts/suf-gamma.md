---
title: "Gamma Inference from Sufficient Statistics"
date: 2026-03-02
tags: [stan, bayes, gamma, sufficient-statistics]
summary: Estimating Gamma shape and rate using only sum(log y) and sum(y), with a compact Stan model and an R workflow.
katex: true
---

The Gamma distribution with R's `rgamma(n, shape, rate)` parameterization:
- `shape = \alpha` (controls skewness)
- `rate = 1/\text{scale}`

Mean and variance:

$$
\text{mean} = \frac{\text{shape}}{\text{rate}}, \qquad
\text{var} = \frac{\text{shape}}{\text{rate}^2}.
$$

For i.i.d. $y_1,\ldots,y_n \sim \operatorname{Gamma}(\text{shape}, \text{rate})$, the minimal sufficient statistics are

$$
t_1 = \sum_{i=1}^n \log y_i, \qquad t_2 = \sum_{i=1}^n y_i.
$$

Writing the log-likelihood in $(\text{shape}, \text{rate})$:

$$
\ell(\text{shape}, \text{rate}) = -n\,\log\Gamma(\text{shape})
\; + \; n\,\text{shape}\,\log\text{rate}
\; + \; (\text{shape}-1)\,t_1
\; - \; \text{rate}\,t_2.
$$

This exposes $t_2$ as the natural stat for `rate` (linear term $-\,\text{rate}\,t_2$) and $t_1$ for `shape`.

Below is a compact Stan program that takes `(n, t1, t2)` and samples `shape, rate`, with derived quantities like `scale`, `mu`, variance, and CV. The R block simulates data, computes `t1,t2`, runs CmdStan, and summarizes results.

```stan
// model.stan
// Gamma distribution inference via sufficient statistics

data {
  int<lower=1> n;   // sample size
  real t1;          // sum(log(y_i))
  real<lower=0> t2; // sum(y_i)
}

parameters {
  real<lower=0> shape; 
  real<lower=0> rate; // rate (= shape/mu = 1/scale)
}

model {
  // Sufficient-statistics log-likelihood in (shape, rate) form
  // l(shape, rate) = -n*lgamma(shape) + n*shape*log(rate)
  //                   + (shape - 1)*t1 - rate*t2
  target += -n * lgamma(shape)
            + n * shape * log(rate)
            + (shape - 1.0) * t1
            - rate * t2;
}

generated quantities {
  // Derived parameterizations
  real scale = 1.0 / rate;        // scale = 1/rate
  real mu    = shape / rate;      // mean  = shape / rate = shape*scale
  real variance_param = shape / (rate * rate); // Var = shape / rate^2
  real cv = 1.0 / sqrt(shape);    // CV = 1/sqrt(shape)

  // Moment offset d = log(arith mean) - log(geom mean)
  real ybar  = t2 / n;
  real log_d = log(ybar) - t1 / n;
}
```

```r
# gamma-suff-stats.R (terse workflow)
library(cmdstanr); library(posterior); library(dplyr)
set.seed(100)

# True parameters
true_shape <- 3.0; true_rate <- 25; true_scale <- 1/true_rate; true_mean <- true_shape/true_rate

# Simulate data and sufficient stats
n <- 1000; y <- rgamma(n, shape=true_shape, rate=true_rate)
t1 <- sum(log(y)); t2 <- sum(y); ybar <- t2/n; log_d <- log(ybar) - t1/n

# Moment-based MLE (solve log(a) - digamma(a) = d)
mle_shape <- tryCatch(uniroot(function(a) log(a) - digamma(a) - log_d,
                              interval=c(1e-6, 1e4))$root, error=function(e) NA)
mle_rate <- mle_shape / ybar; mle_scale <- 1/mle_rate; mle_mean <- ybar
cat("=== MOMENT MLE (closed-form approximation) ===\n")
cat(sprintf(" shape : %.4f (true: %.4f)\n", mle_shape, true_shape))
cat(sprintf(" rate  : %.4f (true: %.4f)\n", mle_rate, true_rate))
cat(sprintf(" scale : %.4f (true: %.4f)\n", mle_scale, true_scale))
cat(sprintf(" mean  : %.4f (true: %.4f)\n", mle_mean, true_mean))

# Stan data and sampling
stan_data <- list(n=n, t1=t1, t2=t2)
mod <- cmdstan_model("model.stan")
fit <- mod$sample(data=stan_data, seed=100, chains=4, parallel_chains=4,
                  iter_warmup=1000, iter_sampling=2000)

# Posterior summary (selected variables)
vars <- c("shape","rate","scale","mu","variance_param","cv","log_d")
summ <- fit$summary(variables=vars, mean, median, sd,
                    ~quantile(.x, probs=c(0.025, 0.975)))
print(summ, digits=4)

# Comparison table: truth vs posterior
draws_df <- fit$draws(variables=c("shape","rate","scale","mu"), format="data.frame")
post_means <- colMeans(draws_df[, c("shape","rate","scale","mu")])
post_q025 <- apply(draws_df[, c("shape","rate","scale","mu")], 2, quantile, 0.025)
post_q975 <- apply(draws_df[, c("shape","rate","scale","mu")], 2, quantile, 0.975)
cat("=== COMPARISON TABLE: Truth vs Stan Posterior ===\n")
cat(sprintf("%-12s %8s %8s %16s\n", "Parameter", "Truth", "Post.Mean", "95% CrI"))
cat(strrep("-", 52), "\n")
params <- c("shape","rate","scale","mu")
truths <- c(true_shape, true_rate, true_scale, true_mean)
labels <- c("shape", "rate", "scale", "mean (mu)")
for (i in seq_along(params)) {
  cat(sprintf("%-12s %8.4f %8.4f (%6.3f, %6.3f)\n",
              labels[i], truths[i], post_means[params[i]], post_q025[params[i]], post_q975[params[i]]))
}
```

Results reproduced from the run:

```text
=== MOMENT MLE (closed-form approximation) ===
 shape : 2.9979 (true: 3.0000)
 rate  : 25.2253 (true: 25.0000)
 scale : 0.0396 (true: 0.0400)
 mean  : 0.1188 (true: 0.1200)
```

| Parameter | Truth  | Post.Mean | 95% CrI            |
|-----------|--------|-----------|--------------------|
| shape     | 3.0000 | 3.0008    | ( 2.756,  3.264)   |
| rate      | 25.0000| 25.2527   | (23.012, 27.659)   |
| scale     | 0.0400 | 0.0397    | ( 0.036,  0.043)   |
| mean (mu) | 0.1200 | 0.1189    | ( 0.115,  0.123)   |

Posterior summary (selected variables):

| variable          | mean   | median | sd      | 2.5%   | 97.5%  |
|-------------------|--------|--------|---------|--------|--------|
| shape             | 3.000  | 3.000  | 0.131   | 2.760  | 3.260  |
| rate              | 25.300 | 25.200 | 1.200   | 23.000 | 27.700 |
| scale             | 0.0397 | 0.0397 | 0.00188 | 0.0362 | 0.0435 |
| mu                | 0.119  | 0.119  | 0.00220 | 0.115  | 0.123  |
| variance_param    | 0.00472| 0.00471| 0.000270| 0.00421| 0.00526|
| cv                | 0.578  | 0.578  | 0.0125  | 0.554  | 0.602  |
| log_d             | 0.176  | 0.176  | 0.0000  | 0.176  | 0.176  |

Notes
- Stan targets the sufficient-statistics likelihood, so you never pass individual `y_i`; scalability is excellent.
- `shape` is learned via the `lgamma(shape)` and `log(rate)` coupling with `t1`; `rate` enters linearly through `-rate*t2`.
- The derived quantities (`scale`, `mu`, variance, CV) are computed in `generated quantities` for convenient reporting.

For moment-based comparisons, the log-offset used to solve for the MLE of `shape` is

$$
d = \log \bar y - \frac{t_1}{n}, \qquad \bar y = \frac{t_2}{n}.
$$
