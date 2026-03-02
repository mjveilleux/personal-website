/**
* Gamma distribution inference via sufficient statistics
*
* R's rgamma(n, shape=shape, rate=r) parameterization:
* - shape = shape (also called beta in Fraser et al.)
* - rate = shape / mu => mu = shape / rate
* - scale = 1/rate => mu = shape * scale
*
* Minimal sufficient statistics:
* t1 = sum(log(y_i)) 
* t2 = sum(y_i)
*
* Log-likelihood (equation 4 from Fraser, Reid & Wong 1997):
* l(shape, mu) = -n*lgamma(shape) + n*shape*log(shape)
* - n*shape*log(mu)
* + (shape - 1)*t1
* - (shape / mu)*t2
*
* Equivalently in shape/rate terms (mu = shape/rate):
* l(shape, rate) = -n*lgamma(shape) + n*shape*log(rate)
* + (shape - 1)*t1
* - rate*t2
*
* This second form is cleanest: rate enters only linearly via -rate*t2,
* confirming t2 is the natural sufficient stat for the rate parameter.
* shape enters via lgamma and the log(rate) term, with t1 as its natural
* sufficient statistic.
*/

data {
int<lower=1> n;   // sample size
real t1;          // sum(log(y_i))
real<lower=0> t2; // sum(y_i)

// Weakly informative prior hyperparameters
//real<lower=0> prior_shape_shape; // Gamma prior on shape
//real<lower=0> prior_shape_rate;
//real<lower=0> prior_rate_shape; // Gamma prior on rate
//real<lower=0> prior_rate_rate;
}

parameters {
real<lower=0> shape; 
real<lower=0> rate; // rate (= shape/mu = 1/scale in R's rgamma)
}

model {
// --- Priors ---
// shape ~ gamma(prior_shape_shape, prior_shape_rate);
// rate ~ gamma(prior_rate_shape, prior_rate_rate);

// --- Sufficient statistic log-likelihood in (shape, rate) form ---
// Derived from the Gamma exponential family:
// canonical parameters: phi1 = (shape-1), phi2 = -rate
// sufficient stats: t1 = sum log(y), t2 = sum(y)
// log-partition: n * [lgamma(shape) - shape*log(rate)]
//
// Full log-likelihood:
target += -n * lgamma(shape) + n * shape * log(rate) + (shape - 1.0) * t1 - rate * t2;
}

generated quantities {
// ---------------------------------------------------------------
// All parameterizations
// ---------------------------------------------------------------

// Core: shape and rate (R's rgamma parameterization)

// Derived: scale and mean
real scale = 1.0 / rate; // scale = 1/rate
real mu = shape / rate; // mean = shape / rate = shape * scale

// Derived: variance and CV
real variance_param = shape / (rate * rate); // Var = shape / rate^2
real cv = 1.0 / sqrt(shape); // CV = 1/sqrt(shape)

// For reference: MLE of log-offset d (should match log(beta) - digamma(beta))
real ybar = t2 / n;
real log_d = log(ybar) - t1 / n; // d = log(arith mean) - log(geom mean)
}
