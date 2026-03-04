data {
  int<lower=1> T;
  int<lower=1> S;
  matrix[T, S] A;        // air level per sensor
  matrix[T, S] dA;       // air change per sensor
  int<lower=0> N_obs;    // number of observed ground points
  array[N_obs] int<lower=1, upper=T> obs_t;
  array[N_obs] int<lower=1, upper=S> obs_i;
  vector[N_obs] y_obs;   // observed ground

  // missing entries (sliced missing-data interface per Stan recommendations)
  int<lower=0> N_mis;
  array[N_mis] int<lower=1, upper=T> mis_t;
  array[N_mis] int<lower=1, upper=S> mis_i;
}

parameters {
  // sensor-level random effects
  vector[S] alpha;  // error-correction speed (neg)
  vector[S] gamma;  // short-run effect of dA
  vector[S] c;      // intercept in cointegration

  // cointegrating slope: partially pooled per sensor
  real beta0;                 // global mean slope
  vector[S] beta_dev;         // sensor deviations
  real<lower=0> sigma_beta;   // deviation scale

  // hyperparameters
  real mu_alpha;
  real mu_gamma;
  real mu_c;
  real<lower=0> sigma_alpha;
  real<lower=0> sigma_gamma;
  real<lower=0> sigma_c;

  // state and noise
  matrix[T, S] G;           // latent ground temperature
  vector[S] G1_mean;        // initial means by sensor
  real<lower=0> sigma_init; // initial state sd
  real<lower=0> sigma_eps;  // evolution noise
  real<lower=0> sigma_obs;  // obs noise

  // missing observed ground values as parameters (y_mis)
  vector[N_mis] y_mis;
}

model {
  target += normal_lpdf(mu_alpha | -0.3, 0.3);
  target += normal_lpdf(mu_gamma | 0.6, 0.3);
  target += normal_lpdf(mu_c | 0, 2);
  target += normal_lpdf(beta0 | 0.8, 0.2);

  target += exponential_lpdf(sigma_alpha | 1);
  target += exponential_lpdf(sigma_gamma | 1);
  target += exponential_lpdf(sigma_c | 1);
  target += exponential_lpdf(sigma_init | 1);
  target += exponential_lpdf(sigma_eps | 1);
  target += exponential_lpdf(sigma_obs | 1);
  target += exponential_lpdf(sigma_beta | 1);

  target += normal_lpdf(alpha | mu_alpha, sigma_alpha);
  target += normal_lpdf(gamma | mu_gamma, sigma_gamma);
  target += normal_lpdf(c | mu_c, sigma_c);
  target += normal_lpdf(beta_dev | 0, sigma_beta);

  // initial state prior: centered below 0C
  target += normal_lpdf(G1_mean | -5, 3);
  for (i in 1:S)
    target += normal_lpdf(G[1, i] | G1_mean[i], sigma_init);

  // state evolution
  for (t in 2:T) {
    for (i in 1:S) {
      real beta_i = beta0 + beta_dev[i];
      real z_lag = G[t - 1, i] - beta_i * A[t - 1, i] - c[i];
      target += normal_lpdf(G[t, i] | G[t - 1, i] + alpha[i] * z_lag + gamma[i] * dA[t, i], sigma_eps);
    }
  }

  // observations: split observed and missing, following Stan missing-data guidance
  {
    vector[N_obs] mu_obs;
    for (n in 1:N_obs)
      mu_obs[n] = G[obs_t[n], obs_i[n]];
    target += normal_lpdf(y_obs | mu_obs, sigma_obs);
  }
  {
    vector[N_mis] mu_mis;
    for (n in 1:N_mis)
      mu_mis[n] = G[mis_t[n], mis_i[n]];
    target += normal_lpdf(y_mis | mu_mis, sigma_obs);
  }
}
