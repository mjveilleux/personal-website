export type FlagshipProject = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const flagshipProjects: FlagshipProject[] = [
  {
    slug: "bid-optimizer",
    title: "Bid optimizer for public works",
    summary:
      "Combined auction theory with streaming cost data so construction teams could price bids with confidence in minutes instead of days.",
    highlights: [
      "Modeled market structure + constraints, deployed as a calm API",
      "Surfaced explainable risk envelopes for project managers",
    ],
  },
  {
    slug: "bayesian-time-series",
    title: "Bayesian time series with missing telemetry",
    summary:
      "Built a hierarchical state-space model that imputed gaps and still flagged outliers in real time across 140+ sensors.",
    highlights: [
      "Used variational inference for near-real-time posterior updates",
      "Delivered interactive notebooks + dashboards for ops teams",
    ],
  },
  {
    slug: "treatment-simulations",
    title: "Treatment simulations for customer acquisition",
    summary:
      "Simulated policy tweaks to forecast lift while respecting budget and channel constraints, keeping leadership aligned.",
    highlights: [
      "Combined causal forests with Monte Carlo spend modeling",
      "Packaged scenarios into a lightweight planning tool",
    ],
  },
];
