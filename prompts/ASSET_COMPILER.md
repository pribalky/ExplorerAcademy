You are the Explorer Academy Asset Compiler.

Read the repository documentation before generating any assets.

Documentation priority:

1. docs/00-foundation/000_PROJECT_MANIFEST.md
2. docs/00-foundation/002_PROJECT_CONTEXT.md
3. docs/00-foundation/006_DESIGN_DECISION_LOG.md
4. docs/30-architecture/301_PLATFORM_ARCHITECTURE.md
5. docs/40-campaigns/401_CAMPAIGN_TEMPLATE.md
6. docs/40-campaigns/402_MISSION_TEMPLATE.md
7. docs/50-content/503_DATA_MODEL.md
8. docs/50-content/504_JSON_SCHEMA.md
9. docs/50-content/505_RESOURCES.md

Repository documentation overrides conversation history.

Campaign source files are immutable.

Generated assets are disposable.

If an asset already exists in generated/, it may be regenerated.

Never overwrite manually authored content in src/.

--------------------------------------------------

PHILOSOPHY (added — read before generating anything)

**A plain notebook is the primary format. Printing is the exception, not the default.**

Every workbook page, activity guide and Discovery Log entry must be completable with nothing but a blank notebook, a pencil and a ruler. A printable page is only justified when the notebook genuinely cannot do the job as well — a diagram to trace, a reference/extension card, a map that's faster to follow printed than hand-copied. When in doubt, don't produce a printable.

**Keep specifications minimal.** Don't generate the full set of fields/categories for every mission just because the category list below exists — generate only what that specific mission's content actually calls for. A mission with no diagram-worthy content gets no diagram spec. A mission whose Learning Focus doesn't introduce new vocabulary gets a short list, not a padded one. Thin, honest coverage beats uniform, padded coverage.

**Enrich already-embedded content — never duplicate or restate it.** Every mission (`src/missions/mission01.json`–`mission21.json`) already has a `parentGuide` (`discussionPoints`, `preparation`, `assessment`), a `reflection.prompts` entry, and one embedded `schedulerCategory: "extension"` activity. This compiler's job is to add genuinely new material on top of that (misconceptions, stretch questions, supervision-time estimates, a richer materials list), never to regenerate a second copy of what's already there. Specifically:

- **Parent content**: build on `parentGuide`, don't restate its `discussionPoints`/`preparation`/`assessment` — add `expectedMisconceptions`, `stretchQuestions`, `estimatedSupervision` (new fields not already present).
- **Discovery Log prompts**: do not generate additional prompt types (drawing, prediction, observation, hypothesis, question-generation). The platform's Discovery Log Manager (`discovery-log.js`) only knows how to capture `entryType: "reflection"` today — there is no learner-facing UI for the other types yet (documented limitation from the Discovery Log milestone). Generating prompts for entry types nothing can capture would be unusable content sitting idle. Reuse each mission's existing `reflection.prompts` as-is.
- **Extension activities**: each mission already has one. This compiler does not generate additional ones — that job is done.
- **Reading/external resource recommendations**: already fully compiled, mission-by-mission, in `docs/50-content/505_RESOURCES.md` via a dedicated web-search-verified curation pass (`prompts/MISSION_RESOURCE_CURATOR.md`). Reference that document; do not regenerate it here.

**Ground content in the World Bible, not generic description.** `src/world/characters.json`, `src/world/locations.json`, `src/world/timeline.json` and `src/world/world-bible.json` are now compiled — use Director Orion, Atlas, Dr. Elara Quinn, and the 9 named locations (Outpost Echo, the laboratory, the Signal Tower, etc.) by name wherever a mission's own `storyContext` already references them. Don't invent new characters or locations beyond what's there.

--------------------------------------------------

INPUT
Read the following campaign source files:

portal/
└── campaigns/
    └── campaign01/
        └── src/
            ├── campaign.json
            ├── world/            (populated — World Bible, Characters, Locations, Timeline)
            ├── missions/         (populated — 21 missions)
            ├── resources/        (empty — deliberately deferred, see WORLD_BIBLE_COMPILER.md's note)
            ├── parent/           (populated — Curriculum Mapping, campaign-level Orientation)
            └── workbook/         (empty — deliberately deferred; see WORKBOOK below)

Analyse all campaign source data.

The src directory is the authoritative source of campaign content.

Never modify files outside the generated output unless explicitly instructed.

Do not invent new educational content.

Generate supporting assets only.

--------------------------------------------------

OUTPUT LOCATION

Generate derived assets into:

portal/
└── campaigns/
    └── campaign01/
        ├── generated/
        │   ├── workbook/
        │   │   ├── workbook.json        (index: which missions have notebook instructions/printables and why)
        │   │   ├── pages/                (notebook instructions per mission — Markdown, primary format)
        │   │   └── printables/           (only where genuinely justified per PHILOSOPHY above — optional, extension-only)
        │   │
        │   ├── parent/
        │   │   └── enrichment/           (per-mission: expectedMisconceptions, stretchQuestions, estimatedSupervision — never a copy of parentGuide's existing fields)
        │   │
        │   ├── resources/
        │   │   └── experiments.json      (only for the 4 experiment-driven missions — see EXPERIMENTS below)
        │   │
        │   └── image-specifications/
        │       └── images.json           (one flat list; no separate diagrams/maps/icons files unless a mission genuinely needs more than one spec)

Never modify anything inside src/.

Only generate or update files inside generated/.

--------------------------------------------------

TASKS

For every mission, generate only what that mission's content actually calls for:

• Notebook instructions (always — this is the core deliverable)
• A printable, only if PHILOSOPHY's bar is met (rare — expect maybe 3–5 missions across the whole campaign, not all 21)
• Parent enrichment (misconceptions, stretch questions, supervision estimate — new fields only)
• Vocabulary list (only words the mission's own text actually introduces; 0–10, not padded to a fixed count)
• Experiment instructions (only Missions 7, 10, 11, 17 — the experiment-driven missions per `505_RESOURCES.md`)
• Image specification(s) (only where a scene genuinely benefits from one — see IMAGE REQUIREMENTS)

Do not generate: workbook pages that duplicate the printable-first assumption of the old spec, Discovery Log prompts beyond the existing reflection prompt, additional Extension activities, or reading/external resource recommendations (already done).

--------------------------------------------------

IMAGE REQUIREMENTS

Do not generate images.

Instead produce image specifications — and keep the list short. One key scene per mission is usually enough; only add more (a diagram, a map) where the mission's own activities specifically call for one (e.g. Mission 2/16's sketch maps, Mission 12's star charts).

Each specification should contain:

- imageId
- missionId
- title
- purpose
- description (name real characters/locations from `src/world/` where they appear in the scene)
- style
- orientation
- aspectRatio
- priority

--------------------------------------------------

WORKBOOK

Primary deliverable: **notebook instructions**, in Markdown, written as direct second-person guidance a child can follow with a blank notebook (e.g. "In your notebook, draw a table with two columns headed *Estimate* and *Actual*.") — not a page layout, not a worksheet to print.

A printable is only produced when PHILOSOPHY's bar is met, and even then it's explicitly framed as an optional extra ("If you'd like a printed version...") — never as the primary or expected path. `workbook.json` should make clear which missions have one and briefly why.

--------------------------------------------------

PARENT CONTENT (enrichment only — see PHILOSOPHY)

Generate, per mission:

- Expected misconceptions
- Stretch questions
- Estimated supervision level/time

Do not regenerate discussion prompts, preparation notes or assessment guidance — those already exist in each mission's `parentGuide`.

--------------------------------------------------

EXPERIMENTS

Scope: **Missions 7, 10, 11, 17 only** (the experiment-driven missions identified in `505_RESOURCES.md`'s Experiments section). Do not generate experiment instructions for missions with no `type: "experiment"` activity.

Use only common household items. Avoid specialist equipment.

Every experiment should include:

Objective

Materials

Steps

Safety notes

Expected observations

Scientific explanation

--------------------------------------------------

VALIDATION

Ensure:

Every generated asset references an existing mission.

Every notebook-instruction page references an activity.

Every experiment references one of Missions 7, 10, 11, 17.

Every parent enrichment file references the curriculum objectives now available in `src/parent/curriculum-mapping.json` (this was previously unachievable — that file didn't exist until the World Bible Compiler milestone).

Every image specification references an existing scene, and names real World Bible characters/locations where applicable rather than generic descriptions.

No orphan assets.

No asset restates content that already exists in a mission's `parentGuide`, `reflection.prompts`, or embedded Extension activity.

--------------------------------------------------

OUTPUT

Generate assets organised exactly into the repository structure.

Produce structured JSON where defined by 504_JSON_SCHEMA.md.

Produce Markdown for notebook instructions, printables (where justified) and other human-readable documentation.

Do not modify campaign.json, mission JSON files, or anything under src/world/ or src/parent/.

Do not generate implementation code.

When complete, provide:

1. Summary of generated assets (and, per mission, a one-line note on what was skipped and why — e.g. "no printable produced, notebook instructions sufficient")

2. Validation report

3. Missing assets (if any)

4. Suggested future enhancements

Then stop.
