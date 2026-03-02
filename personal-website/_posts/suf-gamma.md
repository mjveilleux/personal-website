---
title: "Sufficient Statistics for the Gamma in Stan"
date: 2026-03-02
tags: [stan, bayes, sufficient-statistics]
summary: Working sufficient statistics for the gamma distribution in Stan
katex: true
---

I needed to optimize some Stan code at work which required sufficient statistics for the revenue distribution. I came across [this paper](https://utstat.utoronto.ca/dfraser/documents/146-cjs.pdf) and wanted to test it out. Below is the Stan implementation and a high-level overview of the approach the paper makes.

# The Approach

The gamma distribution is i.i.d. $y_1,\ldots,y_n \sim \operatorname{Gamma}(\text{shape}, \text{rate})$,. The mean and variance are defined by:

$$
\text{mean} = \frac{\text{shape}}{\text{rate}}, \qquad
\text{var} = \frac{\text{shape}}{\text{rate}^2}.
$$

There are two steps.

### Step 1: Get the arithmetic and Geometric means

If we do some simple algebra there are two minimal sufficient statistics: the mean ($t_2$ in the paper) and the shape ($t_1$). 

$t_2$ is the arithmetic sum which we will use to derive the arithmetic mean:

$$
t_2 = \sum_{i=1}^n y_i
$$

$$
\hat{\mu_A} = \frac{t_2}{n}
$$

$t_1$ is the sum of log values which we will use to derive the geometric mean:

$$
t_1 = \sum_{i=1}^n \log y_i
$$

$$
\hat{\mu_G} = e^{\frac{t_1}{n}}
$$

### Step 2: Derive the skewness of the distribution from the means

If we want to know how skewed the distribution is we take some distance of the arithmetic and the geometric means: 

$$
d = log(\hat{\mu_A}) - \hat{\mu_G}
$$

(remember that arithmetic mean ≥ geometric mean, always -- so $d$ is always positive)

The larger $d$ is the more skewed our data can be.

### Step 3: Estimate the shape parameter from $d$


The authors then estimate the shape parameter by: 

$$
d = log(shape) - \phi(shape)
$$

where $\phi$ is a digamma function (the derivative of log-Gamma)



So let's put it al together:

### Why does this work? The "two means" intuition

For a Gamma distribution with shape $\beta$ and arithmetic mean $\mu_A$, we get a geometric mean: $ \mu_G =  \phi{\beta} - log(\beta) + log(\mu)$.

When you subtract them, the $\mu_A$ cancels out entirely:

$$
d = log(\mu_A) - \phi(\beta) - log(\beta) + log(\mu) = log(\beta) - \phi(\beta)
$$

so $d$ is a function of the shape parameter alone. This means we can solve the shape parameter independently of $\mu_A$.

We can then let the sampler work it's magic to get posteriors on the shape parameter and then we can recover the true parameters of the distribution.


### The likelihood function (equation 4)


All of this to get the likelihood function we will write out in Stan:

$$
\ell(\text{shape}, \text{rate}) = -n\,\log\Gamma(\text{shape})
\\ + \; n\,\text{shape}\,\log\text{rate}
\\ + \; (\text{shape}-1)\,t_1
\\ - \; \text{rate}\,t_2
$$

This exposes $t_2$ as the natural stat for `rate` (linear term $-\,\text{rate}\,t_2$) and $t_1$ for `shape`.

# The Stan Implementation

So here is all we need to estimate a gamma distribution from sufficient statistics.

This is the data we need:

```stan
data {
  int<lower=1> n;   // sample size
  real t1;          // sum(log(y_i))
  real<lower=0> t2; // sum(y_i)
}
```

We then state the parameters we'll be estimating:

```stan
parameters {
  real<lower=0> shape; 
  real<lower=0> rate; // rate (= shape/mu = 1/scale)
}
```

Then we write the likelihood function in the model block:

```stan

model {
  // Sufficient-statistics log-likelihood in (shape, rate) form
  // l(shape, rate) = f(.)


target += -n*lgamma(shape) +
          + n*shape*log(rate)
          + (shape - 1.0)*t1
          - rate*t2;
}
```

And then we get posteriors on any of the quantities of interest from what we just estimated in the model block:

```stan
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



# Putting it altogether

Here are the results from the simulated R code below:

### Truth vs Stan Posterior

| Parameter | Truth  | Post.Mean | 95% CrI            |
|-----------|--------|-----------|--------------------|
| shape     | 3.0000 | 3.0008    | ( 2.756,  3.264)   |
| rate      | 25.0000| 25.2527   | (23.012, 27.659)   |
| scale     | 0.0400 | 0.0397    | ( 0.036,  0.043)   |
| mean (mu) | 0.1200 | 0.1189    | ( 0.115,  0.123)   |

### Posterior summary (selected variables)

| variable          | mean   | median | sd      | 2.5%   | 97.5%  |
|-------------------|--------|--------|---------|--------|--------|
| shape             | 3.000  | 3.000  | 0.131   | 2.760  | 3.260  |
| rate              | 25.300 | 25.200 | 1.200   | 23.000 | 27.700 |
| scale             | 0.0397 | 0.0397 | 0.00188 | 0.0362 | 0.0435 |
| mu                | 0.119  | 0.119  | 0.00220 | 0.115  | 0.123  |



# Code

You can check out the code on GitHub, below is an excerpt.

```r
library(cmdstanr); 
library(posterior); 
library(dplyr)

set.seed(100)

# True parameters
true_shape <- 3.0; 
true_rate <- 25; 
true_scale <- 1/true_rate; 
true_mean <- true_shape/true_rate;

# Simulate data and sufficient stats
n <- 1000; 
y <- rgamma(n, shape=true_shape, rate=true_rate)
t1 <- sum(log(y));
t2 <- sum(y); 
ybar <- t2/n; 
log_d <- log(ybar) - t1/n


# Stan data and sampling
stan_data <- list(
                  n=n, 
                  t1=t1, 
                  t2=t2
)

model <- cmdstan_model("model.stan")

fit <- model$sample(data=stan_data, 
                  seed=100,
                  chains=4,
                  parallel_chains=4,
                  iter_warmup=1000, 
                  iter_sampling=2000
)

# Posterior summary (selected variables)
vars <- c("shape","rate","scale","mu","variance_param","cv","log_d")
summ <- fit$summary(variables=vars,mean, median, sd,
                    ~quantile(.x, probs=c(0.025, 0.975)))


print(summ, digits=4)

# Comparison table: truth vs posterior

draws_df <- fit$draws(variables=c("shape","rate","scale","mu"), format="data.frame")
post_means <- colMeans(draws_df[, c("shape","rate","scale","mu")])
post_q025 <- apply(draws_df[, c("shape","rate","scale","mu")], 2, quantile, 0.025)
post_q975 <- apply(draws_df[, c("shape","rate","scale","mu")], 2, quantile, 0.975)


cat("=== COMPARISON TABLE: Truth vs Stan Posterior ===\n")
cat(sprintf("%-12s %8s %8s %16s\n", "Parameter", "Truth", "Post.Mean", "95% CrI"))
params <- c("shape","rate","scale","mu")
truths <- c(true_shape, true_rate, true_scale, true_mean)
labels <- c("shape", "rate", "scale", "mean (mu)")
for (i in seq_along(params)) {
  cat(sprintf("%-12s %8.4f %8.4f (%6.3f, %6.3f)\n",
              labels[i], truths[i], post_means[params[i]], post_q025[params[i]], post_q975[params[i]]))
}
```
