##
## Simulate from a Gamma distribution, compute sufficient statistics,
## then estimate parameters in Stan and compare truth vs estimates.
##
## R’s rgamma(n, shape, rate) parameterization:
## shape = alpha (controls skewness)
## rate = 1/scale (controls scale)
## mean = shape / rate = shape * scale
## var = shape / rate^2

library(cmdstanr)
library(posterior)
library(ggplot2)
library(dplyr)

set.seed(100)

# ==============================================================
# 1. TRUE PARAMETERS
# ==============================================================

true_shape <- 3.0 
true_rate <- 25 # rate = 1/scale
true_scale <- 1 / true_rate # 40
true_mean <- true_shape / true_rate # 120
true_var <- true_shape / true_rate^2

# ==============================================================
# 2. SIMULATE DATA
# ==============================================================

n <- 100
y <- rgamma(n, shape = true_shape, rate = true_rate)

hist(y)
# ==============================================================
# 3. COMPUTE SUFFICIENT STATISTICS
# ==============================================================

t1 <- sum(log(y)) # sufficient for shape
t2 <- sum(y) # sufficient for rate/mean

ybar <- t2 / n
geom_mean <- exp(t1 / n)
log_d <- log(ybar) - t1 / n # log offset: always >= 0

# ==============================================================
# 4. MOMENT-BASED MLE (for quick comparison before Stan)
# ==============================================================

# Solve log(alpha) - digamma(alpha) = d numerically

mle_shape <- tryCatch({
  uniroot(function(a) log(a) - digamma(a) - log_d,
          interval = c(1e-6, 1e4))$root
}, error = function(e) NA)

mle_rate <- mle_shape / ybar
mle_scale <- 1 / mle_rate
mle_mean <- ybar

cat("=== MOMENT MLE (closed-form approximation) ===\n")
cat(sprintf(" shape : %.4f (true: %.4f)\n", mle_shape, true_shape))
cat(sprintf(" rate : %.4f (true: %.4f)\n", mle_rate, true_rate))
cat(sprintf(" scale : %.4f (true: %.4f)\n", mle_scale, true_scale))
cat(sprintf(" mean : %.4f (true: %.4f)\n", mle_mean, true_mean))

# ==============================================================
# 5. STAN DATA LIST
# ==============================================================

# Weakly informative priors:
# shape ~ Gamma(2, 0.5) => mean=4, sd~2.8 (shape usually 1-10)
# rate ~ Gamma(2, 40) => mean=0.05 (rate ~ 1/mean ~ 1/100 for this example)

stan_data <- list(
  n = n,
  t1 = t1,
  t2 = t2
  # prior_alpha_shape = 2.0,
  # prior_alpha_rate = 0.5,
  # prior_rate_shape = 2.0,
  # prior_rate_rate = 40.0
)

# ==============================================================
# 6. FIT STAN MODEL
# ==============================================================

mod <- cmdstan_model("model.stan")

fit <- mod$sample(
  data = stan_data,
  seed = 100,
  chains = 4,
  parallel_chains = 4,
  iter_warmup = 1000,
  iter_sampling = 2000
)

# ==============================================================
# 7. RESULTS: TRUTH vs POSTERIOR ESTIMATES
# ==============================================================

vars_of_interest <- c("shape", "rate", "scale", "mu",
                       "variance_param", "cv", "log_d")

summ <- fit$summary(variables = vars_of_interest,
                    mean, median, sd,
                    ~quantile(.x, probs = c(0.025, 0.975)))

cat("=== POSTERIOR SUMMARY ===\n")
print(summ, digits = 4)
  cat("\n")

# Extract posteriors for clean comparison table

draws_df <- fit$draws(
  variables = c("shape", "rate", "scale", "mu"),
  format = "data.frame"
)

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
      labels[i],
      truths[i],
      post_means[params[i]],
      post_q025[params[i]],
      post_q975[params[i]]))
}
cat("\n")

