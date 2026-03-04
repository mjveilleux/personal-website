
library(cmdstanr)
library(tidyr)
library(dplyr)
library(ggplot2)


# ---- Simulate data ----
set.seed(100)

# horizon and sensors
T <- 365
S <- 5
sensor_ids <- paste0("S", 1:S)

# hyperparameters (partial pooling targets)
# slower error correction and muted short-run sensitivity to create lagged/sluggish ground
mu_alpha  <- -0.20   # error-correction speed (negative: pulls toward equilibrium)
sd_alpha  <- 0.08
mu_gamma  <- 0.40    # sensitivity to changes in air (lagged)
sd_gamma  <- 0.12
beta      <- 0.60    # cointegrating slope < 1 so ground varies less than air
sd_eps    <- 0.25    # ground innovation sd (lower than air)
mu_c      <- 0.0     # sensor intercepts
sd_c      <- 1.0

## air process: per-sensor integrated AR(1) increments + mild seasonality
## introduce small heterogeneity in AR and variance per sensor
phi_base        <- 0.6
sd_eta_base     <- 1.2
season_amp_base <- 10

A_mat  <- matrix(0, nrow = T, ncol = S)
dA_mat <- matrix(0, nrow = T, ncol = S)
for (i in 1:S) {
  phi_i    <- pmin(0.9, pmax(0.3, rnorm(1, phi_base, 0.05)))
  sd_eta_i <- pmax(0.6, rnorm(1, sd_eta_base, 0.2))
  amp_i    <- pmax(5, rnorm(1, season_amp_base, 2))

  dA_i <- numeric(T)
  A_i  <- numeric(T)
  A_i[1] <- rnorm(1, 0, 1)
  dA_i[1] <- rnorm(1, 0, sd_eta_i)
  for (t in 2:T) {
    dA_i[t] <- phi_i * dA_i[t - 1] + rnorm(1, 0, sd_eta_i)
    A_i[t]  <- A_i[t - 1] + dA_i[t]
  }
  A_i <- A_i + amp_i * sin(2 * pi * (1:T) / 365)
  A_mat[, i]  <- A_i
  dA_mat[, i] <- dA_i
}

# introduce a lag so ground responds to prior changes in air (per sensor)
lag_L <- 7
dA_lag_mat <- rbind(matrix(0, nrow = lag_L, ncol = S), dA_mat[1:(T - lag_L), ])

# sensor parameters (partial pooling draw)
alpha <- rnorm(S, mu_alpha, sd_alpha)
gamma <- rnorm(S, mu_gamma, sd_gamma)
c_i   <- rnorm(S, mu_c, sd_c)

# simulate ground per sensor via lagged VECM:
# ΔG_t = α_i (G_{t-1} - β A_{t-1} - c_i) + γ_i ΔA_{t-L} + ε_t
G <- matrix(NA_real_, nrow = T, ncol = S)
# realistic starting temps: vary below 0°C
start_temp <- runif(S, -10, -1)
G[1, ] <- start_temp
for (t in 2:T) {
  for (i in 1:S) {
    z_lag <- G[t - 1, i] - beta * A_mat[t - 1, i] - c_i[i]
    dG_t  <- alpha[i] * z_lag + gamma[i] * dA_lag_mat[t, i] + rnorm(1, 0, sd_eps)
    G[t, i] <- G[t - 1, i] + dG_t
  }
}

# tidy data
sim <- bind_rows(lapply(1:S, function(i) {
  tibble(
    t = 1:T,
    sensor = sensor_ids[i],
    air = A_mat[, i],
    dA = dA_mat[, i],
    ground_true = G[, i]
  )
}))

# sensor-specific missingness in ground logs
miss_rates <- setNames(c(0.05, 0.10, 0.30, 0.50, 0.80), sensor_ids)

sim <- sim %>%
  group_by(sensor) %>%
  mutate(
    miss_p = miss_rates[sensor],
    is_miss = as.logical(rbinom(n(), 1, miss_p)),
    ground_obs = if_else(is_miss, NA_real_, ground_true)
  ) %>%
  ungroup() %>%
  select(t, sensor, air, dA, ground_true, ground_obs)

# add block gaps for worst sensors to mimic logger failures
add_gaps <- function(df, n_gaps = 3, gap_len = 10) {
  Tloc <- nrow(df)
  if (Tloc <= gap_len + 2) return(df)
  starts <- sample(2:(Tloc - gap_len), n_gaps, replace = FALSE)
  for (s in starts) df$ground_obs[s:(s + gap_len - 1)] <- NA_real_
  df
}

sim <- sim %>%
  group_by(sensor) %>%
  group_modify(~ if (.y$sensor %in% c("S4", "S5")) add_gaps(.x) else .x) %>%
  ungroup()

# ---- Plots ----
p <- sim %>%
  select(t, sensor, air, ground_obs) %>%
  pivot_longer(c(air, ground_obs), names_to = "series", values_to = "value") %>%
  mutate(series = dplyr::recode(series, air = "Air", ground_obs = "Ground (obs)")) %>%
  ggplot(aes(t, value, color = series)) +
  geom_line(na.rm = TRUE, linewidth = 0.5) +
  scale_color_manual(values = c("Air" = "#1f77b4", "Ground (obs)" = "#d62728")) +
  facet_wrap(~ sensor, ncol = 1, scales = "free_y") +
  labs(title = "Simulated Air vs Ground (lagged response; missing ground)",
       x = "Time", y = "Temperature", color = NULL) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "top")

# ---- Export ----
# Save plot and data to website assets path used by post
output_dir <- file.path("..", "..", "personal-website", "public", "assets", "blog")
if (!dir.exists(output_dir)) dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

ggsave(filename = file.path(output_dir, "spring-thaw-simulated-ground-air.png"), plot = p, width = 8, height = 10, dpi = 120)
utils::write.csv(sim, file.path(output_dir, "spring-thaw-sim.csv"), row.names = FALSE)

# run stan model (intentionally left blank)

# prep stan data (intentionally left blank)

# export complete
