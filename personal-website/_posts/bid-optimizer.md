---
title: "Designing a Bid Optimizer for Public Works"
excerpt: "Blending auction theory, streaming materials data, and risk envelopes so estimators can submit confident bids in minutes."
coverImage: "/assets/blog/bid-optimizer/cover.jpg"
date: "2025-01-15T12:00:00.000Z"
author:
  name: Mason Veilleux
  picture: "/assets/blog/authors/mason.jpg"
ogImage:
  url: "/assets/blog/bid-optimizer/cover.jpg"
tags:
  - Auction theory
  - Public works
  - Real-time analytics
---

### Overview

This is a placeholder deep dive that will eventually document the full stack behind the public works bid optimizer. The real story covers how we ingested historical bids, streaming vendor feeds, and weather data to evaluate pricing pressure in minutes.

### Stack outline

- Event-driven ingestion with Debezium + Kafka to capture cost shifts.
- Rust services computed constraints while a TypeScript API served recommendations.
- A probabilistic model translated risk envelopes into plain language for estimators.

More detail coming soon.
