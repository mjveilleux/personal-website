export type FlagshipProject = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const flagshipProjects: FlagshipProject[] = [

  {
    slug: "gameplan-science",
    title: "Gameplan Science",
    summary:
      "Sports analytics should be more Bayesian. Gameplan science uses Bayesian methods to recover latent team-strength parameters for offense and defense",
    highlights: [
      "This is a bespoke model that extends traditional Bayesian methods of team strengths. Allowing for parameterization by season-week and a team's offense and defense",
      "It also is the first to return posterior conditional point distributions given the model parameters",
      "This approach allows us to compare organizations across seasons and weeks to find who really had the best team."
    ],
  },
  {
    slug: "bid-optimizer",
    title: "bid.optimizer",
    summary:
      "Combines auction theory with bayesian decision science so construction teams could price bids with confidence in minutes instead of days.",
    highlights: [
      "Models the probability of winning a bid through experimentation",
      "Provides uncertainty estimation according to change orders and expected estimate error",
      "Always allowing sales teams to price each job at the profit-maximizing level"
    ],
  },
];
