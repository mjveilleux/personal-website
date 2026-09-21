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
uv run jupyter lab
uv add pymc          # add a package and update the lockfile
```

Each post gets a dated folder, matching the R blogs:

```text
blogs/python/2026-09-21-short-slug/
```

When the piece is ready, put the Markdown in `personal-website/_posts/`.

## Stack

numpy, pandas, matplotlib, scipy, Jupyter. Add heavier tools (PyMC, CmdStanPy, etc.) per post with `uv add` when you need them.
