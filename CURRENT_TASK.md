# CURRENT_TASK

## Phase

5 – Asset Compiler

## Milestone

Asset Compiler execution — Batch 1 (Missions 1–5)

## Objective

Run the revised `prompts/ASSET_COMPILER.md` for the first batch of missions: notebook instructions, parent enrichment (misconceptions/stretch questions/supervision), vocabulary, and image specifications — generating only what each mission's content actually calls for, per the notebook-first, minimal-spec philosophy now encoded in the prompt.

## Inputs

- `prompts/ASSET_COMPILER.md` (revised, committed, ready to execute)
- `portal/campaigns/campaign01/src/missions/mission01.json`–`mission05.json`
- `portal/campaigns/campaign01/src/world/*.json`, `src/parent/curriculum-mapping.json` (for grounding/references)

## Relevant Documentation

`prompts/ASSET_COMPILER.md` itself — all decisions are now encoded there.

## Files Expected to Change

- `portal/campaigns/campaign01/generated/workbook/workbook.json`, `pages/mission01.md`–`mission05.md` (+ printables only where justified)
- `portal/campaigns/campaign01/generated/parent/enrichment/mission01.json`–`mission05.json`
- `portal/campaigns/campaign01/generated/image-specifications/images.json` (entries for missions 1–5)
- Experiments: none expected in this batch (Missions 7/10/11/17 are experiment-driven, not 1–5)

## Implementation Plan

Follow `ASSET_COMPILER.md` exactly. For each mission: write notebook instructions in Markdown; decide per-mission whether a printable is genuinely justified (expect most missions in this batch — 1–5 are reading/observation/measuring/tracking-focused — need none); add parent enrichment only (new fields, no restating `parentGuide`); add vocabulary only where the mission's own text introduces new terms; add one image spec for a key scene, naming real World Bible characters/locations.

## Out of Scope

Missions 6–21 (later batches). Experiments (not relevant to this batch). Anything already covered (Discovery Log prompts beyond the existing reflection prompt, additional Extension activities, reading/resource recommendations).

## Success Criteria

- Every generated file references a real mission ID.
- No content restates what's already in a mission's `parentGuide`/`reflection.prompts`/embedded Extension activity.
- Notebook instructions are genuinely completable with a blank notebook alone.
- Any printable produced is clearly justified and framed as optional.

## Manual Verification

JSON/Markdown validity; spot-check that generated content doesn't duplicate existing mission fields; confirm no `src/` files were touched.

## Deliverables

Batch 1 generated assets for Missions 1–5.

## Completion Notes

Not yet started.

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
