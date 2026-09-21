"""Matplotlib theme using the masonveilleux.com design tokens.

Tokens follow ``personal-website/src/app/globals.css`` and the live UI
(Fraunces display, Work Sans body, sand page, pine ink).

Usage::

    import theme
    theme.apply()          # website light theme ("sand")
    theme.apply("pine")    # complementary dark theme

    fig, ax = theme.subplots()
    theme.set_title(ax, "Posterior of b")
    theme.savefig(fig, "plot.png")
"""

from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator, Literal, Sequence

import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.figure import Figure
from matplotlib.font_manager import FontProperties

ThemeName = Literal["sand", "pine"]

ROOT = Path(__file__).resolve().parent
FONT_DIR = ROOT / "fonts"


# ---------------------------------------------------------------------------
# Design tokens — same names and hex values as the website
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Colors:
    """CSS custom properties from ``:root`` plus a few colors used in the UI."""

    sand: str = "#f4ede4"  # page background, themeColor
    mist: str = "#f9f5f0"  # lifted surface
    sea: str = "#dfe9e3"  # cool wash (venn / plumber)
    pine: str = "#1f403c"  # headings, links, brand
    ink: str = "#1a1f25"  # primary text
    clay: str = "#f2c6a0"  # accent
    moss: str = "#26443b"  # active nav
    hover: str = "#e9dfd3"  # nav hover
    lagoon: str = "#c8dae2"  # third venn circle
    deep: str = "#12211f"  # plumber dark
    foam: str = "#eef5f0"  # lighter sea
    white: str = "#ffffff"


@dataclass(frozen=True)
class Slate:
    """Tailwind slate scale used for muted type, rules, and borders."""

    s200: str = "#e2e8f0"
    s300: str = "#cbd5e1"
    s400: str = "#94a3b8"
    s500: str = "#64748b"
    s600: str = "#475569"
    s800: str = "#1e293b"
    s900: str = "#0f172a"


@dataclass(frozen=True)
class Type:
    """Type sizes and tracking, mapped from the site (body 1.6, display -0.02em)."""

    body: str = "Work Sans"
    display: str = "Fraunces"
    mono: str = "DejaVu Sans Mono"
    size: float = 11.0
    title_size: float = 16.0
    label_size: float = 11.0
    tick_size: float = 9.5
    line_height: float = 1.6
    display_tracking: float = -0.02
    label_tracking_em: float = 0.15


@dataclass(frozen=True)
class Space:
    """Layout: site copy is max-w-2xl (42rem / 672px)."""

    content_width_in: float = 6.72
    height_in: float = 4.2
    dpi: float = 144.0
    spine_width: float = 0.8
    grid_width: float = 0.7
    line_width: float = 2.0


COLORS = Colors()
SLATE = Slate()
TYPE = Type()
SPACE = Space()

# Named series for overlays (truth vs misspecified vs correct, etc.)
SERIES = {
    "pine": COLORS.pine,
    "clay": COLORS.clay,
    "lagoon": COLORS.lagoon,
    "moss": COLORS.moss,
    "ink": COLORS.ink,
    "sea": COLORS.sea,
}

# Pine-on-sand has contrast; pine-on-pine does not, so the dark theme starts at clay.
CYCLE_SAND = (
    COLORS.pine,
    COLORS.clay,
    COLORS.lagoon,
    COLORS.moss,
    COLORS.ink,
    "#7a9e90",
)
CYCLE_PINE = (
    COLORS.clay,
    COLORS.lagoon,
    COLORS.sea,
    COLORS.sand,
    "#7a9e90",
    COLORS.foam,
)
CYCLE = CYCLE_SAND


def _cmap(name: str, colors: Sequence[str]) -> LinearSegmentedColormap:
    cmap = LinearSegmentedColormap.from_list(name, list(colors), N=256)
    try:
        mpl.colormaps.register(cmap, force=True)
    except (ValueError, AttributeError):
        plt.cm.register_cmap(name=name, cmap=cmap)
    return cmap


PINE_CMAP = _cmap("veil_pine", (COLORS.mist, COLORS.sea, COLORS.pine))
CLAY_CMAP = _cmap("veil_clay", (COLORS.sand, COLORS.clay, COLORS.pine))
DIVERGING_CMAP = _cmap(
    "veil_diverging", (COLORS.lagoon, COLORS.mist, COLORS.clay)
)


# ---------------------------------------------------------------------------
# Fonts
# ---------------------------------------------------------------------------

_FONT_FILES = (
    "WorkSans-Regular.ttf",
    "WorkSans-Medium.ttf",
    "WorkSans-SemiBold.ttf",
    "Fraunces-Regular.ttf",
    "Fraunces-SemiBold.ttf",
    "Fraunces-Bold.ttf",
)

_fonts_registered = False


def register_fonts() -> None:
    """Load Work Sans and Fraunces from ``fonts/`` once per process."""
    global _fonts_registered
    if _fonts_registered:
        return
    for filename in _FONT_FILES:
        path = FONT_DIR / filename
        if path.exists():
            font_manager.fontManager.addfont(str(path))
    _fonts_registered = True


def _first_available(candidates: Iterable[str], fallback: str) -> str:
    available = {f.name for f in font_manager.fontManager.ttflist}
    for name in candidates:
        if name in available:
            return name
    return fallback


def _font_names() -> tuple[str, str]:
    register_fonts()
    body = _first_available(("Work Sans", "WorkSans"), "DejaVu Sans")
    display = _first_available(("Fraunces", "Fraunces SemiBold"), "DejaVu Serif")
    return body, display


def _font_file(filename: str) -> FontProperties | None:
    path = FONT_DIR / filename
    if path.exists():
        return FontProperties(fname=str(path))
    return None


def display_font() -> FontProperties:
    """Fraunces SemiBold via file path so weight does not fall back to Work Sans."""
    return _font_file("Fraunces-SemiBold.ttf") or FontProperties(
        family=_font_names()[1], weight="semibold"
    )


# ---------------------------------------------------------------------------
# Theme rcParams
# ---------------------------------------------------------------------------


def _rc(
    *,
    face: str,
    axes: str,
    text: str,
    muted: str,
    rule: str,
    grid: str,
    body: str,
    display: str,
    cycle: Sequence[str],
    patch: str,
) -> dict:
    return {
        "figure.facecolor": face,
        "figure.edgecolor": face,
        "figure.dpi": SPACE.dpi,
        "figure.figsize": (SPACE.content_width_in, SPACE.height_in),
        "figure.titlesize": TYPE.title_size,
        "figure.titleweight": "normal",
        "savefig.facecolor": face,
        "savefig.edgecolor": face,
        "savefig.dpi": SPACE.dpi,
        "savefig.bbox": "tight",
        "savefig.pad_inches": 0.22,
        "axes.facecolor": axes,
        "axes.edgecolor": rule,
        "axes.labelcolor": text,
        "axes.titlecolor": text,
        "axes.titlesize": TYPE.title_size,
        "axes.titleweight": "normal",
        "axes.titlelocation": "left",
        "axes.labelsize": TYPE.label_size,
        "axes.labelweight": "normal",
        "axes.linewidth": SPACE.spine_width,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.axisbelow": True,
        "axes.prop_cycle": mpl.cycler(color=list(cycle)),
        "axes.unicode_minus": False,
        "axes.grid": True,
        "axes.grid.which": "major",
        "grid.color": grid,
        "grid.linestyle": (0, (1.1, 2.4)),
        "grid.linewidth": SPACE.grid_width,
        "grid.alpha": 1.0,
        "xtick.color": muted,
        "ytick.color": muted,
        "xtick.labelcolor": muted,
        "ytick.labelcolor": muted,
        "xtick.labelsize": TYPE.tick_size,
        "ytick.labelsize": TYPE.tick_size,
        "xtick.direction": "out",
        "ytick.direction": "out",
        "xtick.major.width": SPACE.spine_width,
        "ytick.major.width": SPACE.spine_width,
        "xtick.minor.visible": False,
        "ytick.minor.visible": False,
        "lines.linewidth": SPACE.line_width,
        "lines.solid_capstyle": "round",
        "lines.solid_joinstyle": "round",
        "patch.linewidth": 0.0,
        "patch.facecolor": patch,
        "patch.edgecolor": text,
        "hist.bins": 32,
        "legend.frameon": False,
        "legend.fontsize": 10,
        "legend.title_fontsize": 10,
        "legend.labelcolor": muted,
        "legend.borderpad": 0.3,
        "legend.handlelength": 1.6,
        "text.color": text,
        "font.family": "sans-serif",
        "font.sans-serif": [body, "Work Sans", "DejaVu Sans"],
        "font.serif": [display, "Fraunces", "DejaVu Serif"],
        "font.monospace": [TYPE.mono, "DejaVu Sans Mono", "monospace"],
        "font.size": TYPE.size,
        "pdf.fonttype": 42,
        "ps.fonttype": 42,
        "svg.fonttype": "none",
        "image.cmap": "veil_pine",
        "scatter.edgecolors": "none",
    }


def _theme_rc(name: ThemeName, body: str, display: str) -> dict:
    if name == "sand":
        return _rc(
            face=COLORS.sand,
            axes=COLORS.mist,
            text=COLORS.ink,
            muted=SLATE.s500,
            rule=SLATE.s300,
            grid=SLATE.s300,
            body=body,
            display=display,
            cycle=CYCLE_SAND,
            patch=COLORS.pine,
        )
    if name == "pine":
        return _rc(
            face=COLORS.pine,
            axes=COLORS.deep,
            text=COLORS.sand,
            muted=COLORS.sea,
            rule=COLORS.moss,
            grid=COLORS.moss,
            body=body,
            display=display,
            cycle=CYCLE_PINE,
            patch=COLORS.clay,
        )
    raise ValueError(f"Unknown theme {name!r}; use 'sand' or 'pine'")


_active: ThemeName = "sand"


def apply(name: ThemeName = "sand") -> ThemeName:
    """Set Matplotlib rcParams to ``sand`` or ``pine``."""
    global _active
    body, display = _font_names()
    plt.rcParams.update(_theme_rc(name, body, display))
    _active = name
    return name


@contextmanager
def using(name: ThemeName = "sand") -> Iterator[ThemeName]:
    previous = dict(plt.rcParams)
    previous_name = _active
    try:
        yield apply(name)
    finally:
        plt.rcParams.clear()
        plt.rcParams.update(previous)
        globals()["_active"] = previous_name


def set_title(ax, text: str, **kwargs):
    """Left-aligned Fraunces title, matching site section headings."""
    kwargs.setdefault("loc", "left")
    kwargs.setdefault("pad", 12)
    kwargs.setdefault("fontproperties", display_font())
    return ax.set_title(text, **kwargs)


def subplots(*args, **kwargs):
    fig, ax = plt.subplots(*args, **kwargs)
    return fig, ax


def savefig(fig: Figure, path: str | Path, **kwargs) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    kwargs.setdefault("dpi", SPACE.dpi)
    kwargs.setdefault("bbox_inches", "tight")
    kwargs.setdefault("facecolor", fig.get_facecolor())
    fig.savefig(path, **kwargs)
    return path


apply("sand")
