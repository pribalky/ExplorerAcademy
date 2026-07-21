# Campaign 01 Visual Asset Style Guide

## Why this exists

`generated/image-specifications/images.json` describes 24 assets as "warm, painterly illustration" or "simple line-art diagram." No image-generation tool is available in this environment, so the 19 scene specs and the campaign's 3 badge + 4 knowledge-core + 3 rank rewards are instead produced as hand-authored flat-vector SVG — a deliberate, lower-fidelity stand-in agreed with the user, not an attempt to fake painterly illustration. This guide keeps all 34 assets consistent with each other, since they were authored individually rather than by a single model/artist.

Everything here is inline SVG (no external fonts, images, or scripts) — consistent with the platform's "no external runtime dependencies" constraint.

## Canvas sizes (canonical viewBox per images.json orientation/aspectRatio)

| orientation | aspectRatio | viewBox |
|---|---|---|
| landscape | 16:9 | `0 0 800 450` |
| landscape | 4:3 | `0 0 800 600` |
| portrait | 3:4 | `0 0 600 800` |

## Palette

**Scenes (warm/painterly stand-in)**

- Sky/daylight gradient: `#F4E4C1` → `#E8A87C`
- Interior/dusk gradient: `#3B4B5C` → `#22303D`
- Station structure (weathered): `#8B7355` (walls), `#5E4B3C` (shadow/trim)
- Metal/technology: `#9AA5AC` (panels), `#4A5A63` (shadow)
- Accent teal (Atlas, communications, technology glow): `#4FB3B3`
- Warning/mystery amber: `#E8A73E`
- Character silhouettes: `#3D2E22` (warm dark brown), flat fill, no facial detail
- Ground/foreground: `#6B7A5E` (moss/scrub) or `#A9946B` (dry ground), depending on scene

**Diagrams (line-art stand-in)**

- Background: `#FBF8F2` (paper)
- Line/stroke: `#2C3E50`, 2–3px stroke width, no fill except labels
- Label text: `#2C3E50`, sans-serif, small caps where noted

**Badges/ranks/knowledge cores**

- Badge ring: `#C97C3D` (bronze/terracotta)
- Knowledge Core ring: `#4FB3B3` (teal)
- Rank ring: `#E8A73E` (amber), escalating fill proportion by rank tier (Independent Investigator → Explorer Academy Candidate → Certified Explorer)
- Icon glyphs: `#2C3E50` on a pale `#FBF8F2` disc

## Shape language

- Characters are reduced to simple geometric silhouettes (circle head, rounded-trapezoid body) — never a detailed face, consistent with the World Bible's own choice not to over-specify appearance, and consistent with Dr. Elara Quinn never being depicted at all in missions where she's "known only through records."
- Station structures are simple rectangular/trapezoidal forms with a limited window/panel grid — legible silhouettes, not architectural detail.
- Every scene keeps a flat horizon band (sky gradient over a solid ground band) unless the scene is fully interior, in which case the gradient reads top-to-bottom as ceiling-to-floor light falloff.
- Diagrams use only straight lines, circles and simple polygons, labelled directly — matching each spec's own "plain and legible... something a learner could realistically produce themselves" requirement.

## File locations

```
generated/images/
├── scenes/IMAGE-####.svg      (19 files — warm/painterly stand-in)
├── diagrams/IMAGE-####.svg    (5 files — line-art)
└── badges/REWARD-####.svg     (10 files — badge/knowledgeCore/rank rewards only)
```

`generated/image-specifications/images.json` gains a `file` field per entry pointing at the matching SVG. A new `generated/image-specifications/badges.json` catalogs the 10 reward icons (unlock/story rewards are deliberately out of scope — they're access/narrative flags, not collectible visual badges, per 504_JSON_SCHEMA.md's Reward Type distinctions).

## Known limitation

This is a placeholder visual layer, not a replacement for real illustration. If an image-generation tool becomes available later, `images.json`'s existing `description` fields remain the authoritative prompts to use — this style guide and its SVGs should be treated as disposable once real artwork exists, the same way `generated/` assets are already treated as disposable relative to `src/`.
