# Python blogs

Shared [uv](https://docs.astral.sh/uv/) environment for Python blog work. Same idea as `blogs/R/`: analysis lives here, published posts are Markdown in `personal-website/_posts/`.

This folder is **not** deployed. The Vercel app is the Next.js site in `personal-website/`.

## Setup

Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then:

```bash
cd blogs/python
uv sync
```

That creates `.venv` from `uv.lock` (Python 3.12).

## Daily use

```bash
uv run python script.py
uv add pymc          # add a package and update the lockfile
```

Plots use `theme.py`, which copies the website tokens (sand, pine, clay, Fraunces, Work Sans):

```python
import theme

theme.apply()        # light, matches the site
theme.apply("pine")  # dark complementary theme

fig, ax = theme.subplots()
theme.set_title(ax, "Posterior of b")
theme.savefig(fig, "plot.png")
```

Each post gets a dated folder, matching the R blogs:

```text
blogs/python/2026-09-21-short-slug/
```

When the piece is ready, put the Markdown in `personal-website/_posts/`.

## Stack

numpy, pandas, matplotlib, scipy, PyMC, plus a website-matched matplotlib theme.
