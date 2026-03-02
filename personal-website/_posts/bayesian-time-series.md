---
title: "Bayesian Time Series with Missing Telemetry"
excerpt: "How hierarchical state-space models and variational inference kept 140+ sensors trustworthy despite chronic data gaps."
date: "2025-02-05T12:00:00.000Z"
author:
  name: Mason Veilleux
  picture: "/assets/blog/authors/mason.jpg"
tags:
  - Bayesian modeling
  - Time series
  - Monitoring
---

## Modeling Spring Thaw with Bayesian State Space Models

### Motivation

The goal was to understand spring thaw dynamics across a network of ground-temperature sensors in Alaska. Each probe recorded hourly ground and air temperatures but suffered from outages, drift, and wildly different terrain exposure. We needed a model that would:

- handle missing data gracefully,
- capture temporal dynamics,
- borrow strength across locations, and
- produce full probabilistic forecasts for operations teams.

### Available Data

For every sensor we collected:

- metadata (sensor id, install date, maintenance notes),
- elevation plus latitude/longitude,
- hourly ground temperature (with gaps), and
- hourly air temperature (also with gaps).

### Modeling Nuances

- **Sensor-specific behavior**: soil composition and maintenance history subtly change drift.
- **Elevation and location**: air-ground coupling depends on exposure.
- **Missingness**: both air and ground feeds had dropouts, including multi-hour outages.
- **Non-stationary variance**: melt season radically changes the process noise.

### Strategy: Bayesian Dynamic Time Series

We used a hierarchical state-space model with explicit missing-data treatment. Key components:

1. **Latent ground temperature state** \(\mu_t\).
2. **Sensor effects** \(\alpha_{s(t)}\) to capture idiosyncratic drift.
3. **Elevation pooling** via \(\beta_{e(t)}\) so sparse elevations still behaved.
4. **Seasonality term** \(\gamma_{m(t),h(t)}\) for month × hour effects.

#### Latent State Evolution

\[
\mu_t \sim \mathcal{N}\left( \mu_{t-1} + \alpha_{s(t)} + \beta_{e(t)} (a_t - \mu_{t-1}), \; \sigma_{\text{drift}} \right)
\]

- \(a_t\) is the observed air temperature.
- \(\alpha_s\) handles sensor-specific drift.
- \(\beta_e\) couples air and ground temps with elevation-aware partial pooling.

#### Observation Model

\[
y_t \sim \mathcal{N}(\mu_t + \gamma_{m(t),h(t)}, \sigma_{\text{obs}})
\]

We only evaluate the likelihood where ground readings exist; missing values are implicitly imputed by the latent state.

#### Hierarchical Priors

\[
\beta_e \sim \mathcal{N}(\bar{\beta}, \tau_\beta) \qquad \alpha_s \sim \mathcal{N}(0, \tau_\alpha)
\]

Partial pooling stabilized sparse elevations and shared information across sensors while preventing overfitting.

### Missing Data Handling

Missing air and ground temperatures were treated as parameters. The posterior automatically imputes them, conditioned on adjacent observations and the latent dynamics. This let us estimate uncertainty during outages instead of dropping rows or patching with ad hoc interpolation.

### Simulation Setup

To validate the approach we simulated:

- 150 sensors on an hourly grid \(t = 1,\dots,T\),
- oscillatory air temperature signals feeding the latent dynamics,
- random missingness (20% air + 20% ground), and
- non-stationary variance during thaw.

### Posterior Predictions & Forecasting

For each sensor we produced:

- posterior means of \(\mu_t\),
- 90% credible intervals,
- reconstructed values during gaps, and
- 24-hour to multi-day probabilistic forecasts.

Because the model lives in a Bayesian framework, we can report the variance of \(t+h\) forecast errors and feed that into downstream risk calculations.

### Extensions

- Inject air-temperature forecasts or precipitation expectations.
- Replace simple interpolation with Gaussian processes for air data.
- Incorporate a physics-inspired layer that respects co-integrated air/ground dynamics.

The upshot: a physically interpretable model that survives missing telemetry, keeps operators confident during spring thaw, and gives planners the uncertainty bounds they need.
