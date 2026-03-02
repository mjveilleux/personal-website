---
title: "Bayesian Time Series with Missing Telemetry"
excerpt: "Missing data in remote sensors creates uncertainty in making real-time decisions to start and shut down ice roads in the Arctic. Probabilistic modeling can help overcome these challenges"
date: "2025-02-05T12:00:00.000Z"
author:
  name: Mason Veilleux
tags:
  - Bayesian modeling
  - Time series
  - Monitoring
---

## Modeling Spring Thaw with Bayesian Time Series Analysis


### The Challenge

In the Alaskan winter, ice roads connect communitiies across the tundra. Ice road travelers rely on remote sensor data to know the current and future air and ground temperatures. This data informs them to know when to start building ice roads and when to shut down. Knowing when the ice road is going to shutdown days or weeks in advance is incredibly important for businesses transporting goods and inter-community relationships.

The key challenge is two-fold:
(1) Predicting when the ice road is unsafe for travel
(2) Overcoming missing data due to missed logs (a common occurrence)

In order to overcome this challenge, we need to first impute missing data from a known joint distribution -- number 2. Once we infer this relationship, then we can make our predictions on the risk of Spring thaw t+h days away.

### The Data

Let's take a simple case where we have 5 sensors. Each sensor tracks the ground temperature and the air temperature. The sensors intend to send data each hour. We can always swap out historical missing air temp from other sensors -- usually this is known in the community. So the only case of missing data can be from our sensors not sending data for ground temperatures. So in all, we will have an hourly time series of the five sensors that could look like this:


(above the simulated data code)

Further, we have t+h air temperature forecasts from reliable sources, (which we will use in the future). We will assume these forecasts are perfect but in reality we could add uncertainty in these forecasts across each sensor.


### Modeling Nuances

There are some modeling nuances that will consider. We will need to account for scenarios where:

- sensors are in different locations with different soil compositions. This could affect the relationship of the air and ground temperatures.
- some loggers are worse than others at logging data. This could affect our certainty around the locations true relationship.

Because we are taking a Bayesian approach, we can use partial-pooling to use all the data available. [explain partial-pooling]. 

We could go further and use the geographic distance as another way to "share" information, but we will just assume each sensor is equally distributed by distance.

### The Model

Okay, let's get to the meat of it all.

We have S sensors that may or may not be transmitting data every t hours. Air temperature and ground temperature have a co-integrated relationship. We define this relationship as:







I'll write this in R and Stan.


### The Code

-- defining what is missing data
-- The co-integrated relationship
-- partial-pooling
-- generated quantities

### The Stan model




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
