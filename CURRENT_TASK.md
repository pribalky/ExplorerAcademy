# CURRENT_TASK

## Phase

5 – Asset Compiler

## Milestone

Asset Compiler execution — Batch 2 (Missions 6–10)

## Objective

Continue the Asset Compiler run for the next batch of missions, following the same pattern established in Batch 1: notebook instructions, parent enrichment (misconceptions/stretch questions/supervision, with `curriculumRefs` grounded in each mission's actual activity `type` fields), vocabulary embedded in the notebook page where a mission's own text introduces new terms, and image specifications for key scenes — generating only what each mission's content actually calls for.

## Inputs

- `prompts/ASSET_COMPILER.md`
- `portal/campaigns/campaign01/src/missions/mission06.json`–`mission10.json`
- `portal/campaigns/campaign01/src/world/*.json`, `src/parent/curriculum-mapping.json` (for grounding/references)
- `portal/campaigns/campaign01/generated/workbook/pages/mission01.md`–`mission05.md` and `generated/parent/enrichment/mission01.json`–`mission05.json` as the established pattern to follow

## Relevant Documentation

`prompts/ASSET_COMPILER.md` itself — all decisions are encoded there.

## Files Expected to Change

- `portal/campaigns/campaign01/generated/workbook/workbook.json` (extend index), `pages/mission06.md`–`mission10.md` (+ printables only where justified)
- `portal/campaigns/campaign01/generated/parent/enrichment/mission06.json`–`mission10.json`
- `portal/campaigns/campaign01/generated/image-specifications/images.json` (extend with entries for missions 6–10)
- `portal/campaigns/campaign01/generated/resources/experiments.json` (new — Mission 7 and Mission 10 are experiment-driven per `505_RESOURCES.md`'s scoping, so this batch is the first to produce it)

## Implementation Plan

Same as Batch 1. Additionally: for Missions 7 and 10, scan their compiled JSON for the `type: "experiment"` activity and produce full experiment instructions (Objective/Materials/Steps/Safety notes/Expected observations/Scientific explanation) in `generated/resources/experiments.json`, using only common household items.

## Out of Scope

Missions 1–5 (done), 11–21 (later batches). Anything already covered (Discovery Log prompts beyond the existing reflection prompt, additional Extension activities, reading/resource recommendations already in `505_RESOURCES.md`).

## Success Criteria

Same as Batch 1, plus: every experiment references a mission that actually has an experiment-type activity (verified against the mission JSON, not assumed).

## Manual Verification

JSON/Markdown validity; spot-check no duplication of existing mission fields; confirm no `src/` files touched.

## Deliverables

Batch 2 generated assets for Missions 6–10.

## Completion Notes

Not yet started.

---

# Previous Milestone — Asset Compiler execution — Batch 1 (Missions 1–5) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 1–5, producing:

- **Notebook instructions** (`generated/workbook/pages/mission01.md`–`mission05.md`): direct second-person guidance rewriting each mission's Core/Extension/Rabbit Hole activities into concrete notebook steps (e.g. "draw a table with three columns headed Object, Estimate, Actual" rather than restating the mission JSON's `instructions` field verbatim).
- **One printable** (`generated/workbook/printables/mission02-map-symbols-card.md`): a map-symbols reference card for Mission 2's Extension activity — the only mission in this batch judged to meet the PHILOSOPHY bar ("a map that's faster to follow printed than hand-copied"). All other missions in this batch (1, 3, 4, 5) were assessed and found to need no printable — reasons recorded per-mission in `workbook.json`.
- **`generated/workbook/workbook.json`**: index of all 5 missions with `printable: null` + a one-line `printableReason` for the 4 that got none, and the justification for Mission 2's.
- **Vocabulary**: embedded as a "Words worth knowing" section directly in the relevant notebook pages (no dedicated file path exists for vocabulary in `ASSET_COMPILER.md`'s OUTPUT LOCATION tree, so it was kept alongside the content it supports rather than inventing an undefined location) — Mission 1 ("probationary"), Mission 3 ("estimate"), Mission 4 ("chronological", "assumption"), Mission 5 ("eliminate"). Mission 2 got none — its own text introduces no new vocabulary beyond common words.
- **Parent enrichment** (`generated/parent/enrichment/mission01.json`–`mission05.json`): `expectedMisconceptions`, `stretchQuestions`, `estimatedSupervision` per mission — none restating `parentGuide`'s existing `discussionPoints`/`preparation`/`assessment`. Added a `curriculumRefs` field (array of `CURRICULUM-####` IDs) grounded directly in each mission's actual activity `type` fields (e.g. an activity typed `"mathematics"` → `CURRICULUM-0003`), rather than the curriculum document's non-exhaustive "primary emphasis" list, so every reference is independently verifiable against the mission JSON itself.
- **Image specifications** (`generated/image-specifications/images.json`): one key-scene spec per mission (5 total) plus one additional exemplar spec for Mission 2's sketch map, per the pattern `ASSET_COMPILER.md` documents for missions whose Core activity output is a diagram/map. Each names real World Bible characters/locations (Director Orion, Explorer Academy Headquarters, Outpost Echo) where the scene calls for them, and Mission 4's spec explicitly avoids depicting Dr. Elara Quinn (per her World Bible entry: "known only through journals, recordings... during most of the campaign").
- No experiments produced — correctly out of scope, since none of Missions 1–5 have a `type: "experiment"` activity (confirmed by scanning each mission's `activities[]`).

## Manual Verification

- Validated all generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only new files under `generated/` were created; nothing under `src/` was touched.
- Spot-checked each notebook page and enrichment file against its mission's `parentGuide`/`reflection.prompts`/embedded Extension activity — no restated content found.

## Verification

Batch 1 produces genuinely completable-with-a-blank-notebook content for Missions 1–5, with the one printable clearly framed as optional and justified, and every generated asset traceable to a real mission ID. ✅

---

# Previous Milestone — Make all 5 compiler prompts campaign-agnostic — COMPLETE

## Completion Summary

The user asked directly: "Can all of these prompts work without needing any changes — for a future campaign?" Audited all five (`CAMPAIGN_COMPILER.md`, `MISSION_COMPILER.md`, `WORLD_BIBLE_COMPILER.md`, `MISSION_RESOURCE_CURATOR.md`, `ASSET_COMPILER.md`) and found the answer was no, for two different reasons:

- **Bucket 1 (harmless, expected)**: `501_CAMPAIGN_01.md`, `campaign01`, and mission counts appeared as inline prose throughout — fine in principle (every campaign needs *something* pointing at its own source), but risky as unmarked prose since a future run could miss a swap point.
- **Bucket 2 (the real problem)**: several prompts had Campaign 01's *specific answers* written as if they were general rules — `WORLD_BIBLE_COMPILER.md` named Orion/Atlas/Quinn directly in the Characters instructions and hardcoded "six subjects" in Curriculum Mapping; `ASSET_COMPILER.md` hardcoded "Missions 7, 10, 11, 17" for experiments and specific mission numbers for image examples. Re-running these against a different campaign's content would have produced wrong output, not just needed a find-and-replace.

Fixed by, in every file:

- Adding an explicit **Campaign Parameters** block at the top (`<source-document>`, `<campaign-slug>`, `<mission-count>`, `<resources-document>` where relevant) with a labelled Campaign 01 worked example beneath it, so swap points are obvious rather than buried in prose.
- Rewriting Bucket-2 passages to state the **underlying computable rule** instead of Campaign 01's specific answer — e.g. `ASSET_COMPILER.md`'s Experiments section now says "determine which missions have a `type: "experiment"` activity by scanning the compiled mission JSON directly," with the actual Campaign 01 numbers (7, 10, 11, 17) moved into a clearly labelled "Campaign 01 example" callout instead of being the rule itself.
- Leaving every genuinely reusable piece untouched: the 504-over-503 schema-authority decision, embed-vs-reference conventions, ID numbering, duration tuning, the Activity Type enum constraint, the notebook-first PHILOSOPHY section (which needed zero changes — it was already fully generic), enrich-not-duplicate rules, and "verify resources are real."

## Manual Verification

Grepped all five files for `campaign01`, `501_CAMPAIGN_01`, and the specific Campaign 01 mission-number lists — confirmed every remaining occurrence now sits inside a labelled `<campaign-slug>`/`<source-document>` parameter placeholder or an explicit "Campaign 01 example:" callout, not unmarked instructional prose.

## Verification

Prompts can now be pointed at a new campaign's own source document and mission count without inheriting Campaign 01's specific character names, curriculum subject breakdown, or mission numbers as if they were universal rules. ✅

---

# Previous Milestone — Draft the Workbook Compiler prompt — COMPLETE

## Completion Summary

Revised `prompts/ASSET_COMPILER.md` in place (chose this over forking a new `WORKBOOK_COMPILER.md`, since the original already covers workbook + parent + resources + image-specs in one prompt, and maintaining two overlapping compiler prompts seemed worse than revising one) to encode:

- **Notebook-first philosophy**: a new PHILOSOPHY section stating a blank notebook is the primary format; printables are the exception, justified only when a notebook genuinely can't do the job (a diagram to trace, a reference/extension card), and even then framed as optional.
- **Minimalism**: generate only what each mission's content actually calls for, not the full category list for every mission uniformly — thin honest coverage over padded uniform coverage.
- **Enrich, never duplicate**: explicit per-category instructions tying back to what's already embedded in each mission (`parentGuide`, `reflection.prompts`, the one Extension activity) — parent content adds only genuinely new fields (misconceptions, stretch questions, supervision estimate); Discovery Log prompt generation is explicitly held back (the platform only captures `entryType: "reflection"` today, so generating unused prompt types would be idle content); reading/resource recommendations point to the already-completed `505_RESOURCES.md` pass instead of regenerating.
- **World Bible grounding**: instructs using real named characters/locations from the now-populated `src/world/` instead of generic descriptions.
- **Experiments scoped to Missions 7, 10, 11, 17 only**, matching `505_RESOURCES.md`'s own scoping, instead of all 21.
- Fixed the same stale `docs/40-campaigns/503|504` path issue found in `CLAUDE.md` at the very start of this session (correct path is `docs/50-content/`).
- Output structure simplified to match: `generated/workbook/pages/` (Markdown notebook instructions, primary) + `printables/` (rare, justified only); `generated/parent/enrichment/`; `generated/image-specifications/images.json` (one flat list, not four separate category files).

## Manual Verification

N/A — this milestone produced a prompt document, not runtime-verifiable content.

## Verification

A prompt that this session (or a later one) can execute without re-deriving the notebook-first philosophy or overlap-handling decisions from scratch. ✅
