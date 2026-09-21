# personal-website

Mason's site and blog notes in one repo.

| Path | What it is | Deployed? |
| --- | --- | --- |
| `personal-website/` | Next.js site (Markdown posts, pages) | Yes — Vercel, Root Directory = `personal-website` |
| `blogs/R/` | R / Stan working files for posts | No |
| `blogs/python/` | Shared [uv](https://docs.astral.sh/uv/) env and Python working files | No |

Python setup:

```bash
cd blogs/python
uv sync
uv run jupyter lab
```

Published posts still go in `personal-website/_posts/` as Markdown. Vercel only builds the Next.js app; it does not run uv, Jupyter, or R.
