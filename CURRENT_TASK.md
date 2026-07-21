# CURRENT_TASK

## Phase

6 – Mission Polish

## Milestone

Not yet defined — awaiting direction on which mission(s) to polish next

## Objective

Missions 1–4 have reached production quality (see completed milestones below). TODO.md's Phase 6 checklist calls for repeating this for the remaining missions, but per CLAUDE.md's workflow, do not begin polishing another mission until the user chooses one.

## Inputs

N/A — awaiting user direction.

## Relevant Documentation

`docs/40-campaigns/402_MISSION_TEMPLATE.md` (Mission Quality Checklist), `docs/00-foundation/007_AI_CONTRIBUTING_GUIDE.md`, `TODO.md`'s Phase 6 section.

## Files Expected to Change

N/A — awaiting user direction.

## Implementation Plan

N/A — awaiting user direction.

## Out of Scope

N/A.

## Success Criteria

N/A.

## Manual Verification

N/A.

## Deliverables

N/A.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Polish: Missions 2–4 reach production quality — COMPLETE

## Completion Summary

Applied the same approach established for Mission 1 to Missions 2 ("Arrival at Outpost Echo"), 3 ("Explorer's Toolkit") and 4 ("The Silent Logs"), editing `portal/campaigns/campaign01/src/missions/mission02–04.json` directly:

- **Beats**: rewrote all 8 `narrativeText` values per mission for stronger story flow and curiosity, grounded in each mission's canonical Story Summary in `501_CAMPAIGN_01.md` (re-read before editing) — no new plot facts invented. Mission 4 got the most careful treatment, since its Breakthrough beat is the first appearance of Dr. Elara Quinn's name — the narrative hinge the rest of the campaign builds on.
- **Core activities**: rewrote `storyContext`/`instructions` for every Core activity in all three missions to read as vivid, second-person challenges rather than dry instructions (e.g. Mission 3's estimate-then-measure activity now explicitly instructs writing the estimate down *before* measuring, matching the exact misconception already flagged in `generated/parent/enrichment/mission03.json` — "children sometimes measure first and then quietly adjust their estimate").
- **Extension/Rabbit Hole activities**: reviewed but left unchanged in all three missions — already open-ended and evocative by design (their whole job is unprompted curiosity), so rewriting them for the sake of symmetry with Core activities would have been padding, not polish.
- **Reflection prompts**: lightly sharpened for stronger metacognition (e.g. Mission 4's now explicitly asks for an assumption "even if it feels likely," again matching that mission's own flagged misconception) — kept to one prompt per mission, preserving the one-prompt convention already established campaign-wide.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, and `parentGuide` core fields, for the same reasons as Mission 1 (no unrendered optional fields added; no duplication of the already-separate `generated/parent/enrichment/` content).

## Manual Verification

- Validated all three files against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — all pass.
- Grepped `generated/` for each mission's superseded reflection-prompt text — no stale references found in any of the three.
- Served the app locally and drove it with headless Chromium: loaded `#/mission/mission02`, `mission03` and `mission04` in turn, confirmed each renders its correct title and updated content (waited on the actual heading text rather than element presence, after an initial test run surfaced a race condition in the *test script* itself, not the app), and confirmed `parentGuide` content never appears in the rendered DOM for any of the three (ADR-006 holds).

## Verification

Missions 2–4 now satisfy the same Mission Quality Checklist bar as Mission 1, with Mission 4 specifically carrying the extra narrative weight of introducing Dr. Quinn — the campaign's first four missions are now consistently production quality. ✅

---

# Previous Milestone — Mission Polish: Mission 1 ("The Invitation") reaches production quality — COMPLETE

## Completion Summary

Worked through `402_MISSION_TEMPLATE.md`'s Mission Quality Checklist against `portal/campaigns/campaign01/src/missions/mission01.json` directly (this is content-authoring work on the compiled mission JSON itself, distinct from Phase 5's generated-assets-only scope).

**Important finding, checked before editing anything:** read `activity-engine.js` and `router.js` to confirm what the platform actually renders today. Only a mission's title, estimated time, difficulty, activity cards (title/type/category/duration/difficulty/storyContext/instructions/output), and reflection prompts are rendered. The 8 `beats` are validated for structural completeness (`mission-engine.js`) but **never rendered to the learner anywhere in the current UI** — confirmed by grepping all of `portal/js/` for `beats`/`narrativeText` usage outside the validator. `activity-engine.js` also explicitly documents that only required Activity fields are rendered, and that the schema's optional Activity fields (`hints`, `resources`, `parentNotes`) have no renderer at all.

This shaped the scope of the polish:

- **Beats**: rewrote all 8 `narrativeText` values with richer sensory/emotional detail and stronger connective tissue between beats (e.g. the HOOK now specifies the package is addressed to the learner by name and unusually heavy; the MYSTERY beat now poses an explicit unanswered question). Stayed strictly within `501_CAMPAIGN_01.md`'s canonical Story Summary for Mission 1 — no new plot facts, characters or locations invented, only deeper texture on what the source document already establishes. Polished even though currently inert in the UI, since the beat structure is clearly load-bearing in `402_MISSION_TEMPLATE.md`'s design and this is authored content worth having ready.
- **Activities**: rewrote `storyContext`/`instructions` for all 7 activities (4 Core, 2 Extension, 1 Rabbit Hole) to read as a vivid, second-person "exciting challenge" per the Mission Brief guidance, rather than dry instructional prose — e.g. Activity-0004's instructions now explicitly acknowledge that the first couple of observations are easy and the real challenge is pushing past them. Deliberately did **not** add `hints`, `resources`, or `parentNotes` — confirmed unrendered fields, so populating them now would be the same "idle, unusable content" trap avoided throughout Phase 5.
- **Reflection**: polished the single prompt for stronger metacognitive framing (now explicitly asks what makes the learner curious, not just what they expect), keeping to one prompt to stay consistent with the one-prompt-per-mission convention already established across all 21 missions.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, `parentGuide`'s core fields (already solid; deliberately did not add the schema's optional `misconceptions`/`extensions`/`printables` fields to `parentGuide` either, since that content already exists as a single source of truth in `generated/parent/enrichment/mission01.json` — adding it to `parentGuide` too would duplicate state, which CLAUDE.md explicitly prohibits), and all structural/functional fields (`type`, `category`, `duration`, `difficulty`, `schedulerCategory`).

## Manual Verification

- Validated `mission01.json` against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field checks via a Python script mirroring its logic — all pass, all 8 beat types present.
- Grepped `generated/` for the superseded reflection prompt text — no stale references found; the generated workbook page and parent enrichment file for Mission 1 don't quote mission JSON text verbatim (by design, per the Asset Compiler's own "enrich, never duplicate" rule), so neither needed updating.
- Started the app with `python3 -m http.server` and drove it with headless Chromium (Playwright): loaded `#/mission/mission01`, confirmed the heading renders as "The Invitation," confirmed the new activity instructions and reflection prompt text appear in the rendered page, and confirmed `parentGuide` content (e.g. its `assessment` text) does **not** appear anywhere in the rendered DOM — ADR-006 (Hidden Parent Mode) holds. The one console 404 observed was `favicon.ico`, a pre-existing, unrelated gap, not something this change introduced.

## Verification

Mission 1 now satisfies every item on `402_MISSION_TEMPLATE.md`'s Mission Quality Checklist that the current platform can actually surface to a learner, with no schema changes, no new unrendered fields, and no duplicated parent-guidance content. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 4 (Missions 16–21, final batch) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 16–21, completing Phase 5 across all 21 missions:

- **Notebook instructions** for all 6 missions (`generated/workbook/pages/mission16.md`–`mission21.md`).
- **Fourth experiment — Mission 17, handled as a framework rather than a fixed experiment**: Mission 17 has two `type: "experiment"` activities (`ACTIVITY-0102` Core "Plan a Fair Test", `ACTIVITY-0106` Extension "Repeat With a Changed Variable"), but the mission's own narrative explicitly gives the learner no fixed topic ("no detailed instructions survive... the design is up to the learner"). Rather than inventing a specific topic that would contradict this design intent, the `experiments.json` entry is a general fair-test framework (define question → prediction → identify the one variable → hold everything else constant → collect evidence → analyse → repeat with one change) that the learner applies to their own self-chosen investigation, with a `note` field explaining why this entry differs in shape from the other three.
- **Two further printables**: Mission 21's Explorer Certificate template (`printables/mission21-explorer-certificate.md`) — a ceremonial keepsake genuinely suited to printing, offered as an alternative to designing one in the journal, not the only path. Missions 16–20 were assessed and needed none; Mission 17 and 20 specifically got none because a fixed printable would contradict their deliberately open-ended, learner-defined design.
- **Parent enrichment** (`mission16.json`–`mission21.json`), `curriculumRefs` grounded in actual activity types as in every prior batch.
- **Vocabulary**: embedded for Missions 16 ("strata"), 17 ("fair test"), 19 ("archive"). Missions 18, 20, 21 got none — their own text reuses vocabulary already established in earlier missions rather than introducing new terms.
- **Image specifications** (IMAGE-0018–0024): key-scene spec per mission, plus two further exemplar diagram specs matching the established Mission 2/16 sketch-output pattern — Mission 16's field sketch (per `ASSET_COMPILER.md`'s own Campaign 01 example) and Mission 18's investigation board (its Extension activity's output is explicitly "a visual investigation board"). Mission 17's and Mission 20's specs are deliberately generic/topic-agnostic scenes, since both missions are learner-defined with no fixed subject. Mission 19's spec shows the archive room itself rather than Dr. Quinn, since no physical description of her exists anywhere in the World Bible. Mission 21's spec (IMAGE-0024) is deliberately composed to echo IMAGE-0001 (Mission 1's Director Orion briefing scene), bookending the campaign per Director Orion's own World Bible entry noting he "welcomes the learner at the start of the campaign (Mission 1) and again at Graduation (Mission 21)."

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- **Full-campaign consistency check** (this being the final batch): confirmed `workbook.json` lists exactly `MISSION-0001`–`MISSION-0021` in order; confirmed 21 parent enrichment files exist (one per mission); confirmed all 21 missions have at least one image specification; confirmed `experiments.json` contains exactly Missions 7, 10, 15 and 17 — the complete, correct set of missions with a `type: "experiment"` activity across the whole campaign, verified by scanning every mission's compiled JSON directly rather than relying on `505_RESOURCES.md`'s or `ASSET_COMPILER.md`'s own worked examples (which turned out to be imprecise about Mission 11, correctly excluded back in Batch 3).

## Verification

Phase 5 is complete: every one of the 21 compiled missions now has notebook instructions, parent enrichment, and at least one image specification under `generated/`, with printables and experiments produced only where each mission's own content genuinely justified one — no padding, no orphaned assets, and no `src/` files touched across all four batches. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 3 (Missions 11–15) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 11–15, extending the established pattern:

- **Notebook instructions** (`generated/workbook/pages/mission11.md`–`mission15.md`).
- **Confirmed Mission 11 has no experiment-type activity** despite `505_RESOURCES.md`'s PhET/circuits reference — its "Solve Circuit Challenges" activity is typed `science`, not `experiment` (scanned directly from `mission11.json`, not assumed from the resources document). Correctly produced no experiment for it.
- **Third experiment produced**: Mission 15 (`ACTIVITY-0090`, "Test and Refine Solutions") — a household light/torch analogy ("Signal Path Troubleshooting") testing misalignment, obstruction and distance against a fixed target, since the mission's own multi-fault Signal Tower repair has no single obvious physical prototype the way Missions 7 and 10 did. Grounded in the same "signal needs a clear, aligned path" principle real communication towers rely on.
- **Two further printables**: Mission 12's star chart (`printables/mission12-star-chart.md`, IMAGE-0014) — justified because the Core "Measure Angles" activity needs a precisely plotted chart to measure accurately with a protractor, matching `ASSET_COMPILER.md`'s own Campaign 01 example calling out Mission 12 for a star-chart spec. Missions 11, 13, 14, 15 were assessed and needed none.
- **Parent enrichment** (`generated/parent/enrichment/mission11.json`–`mission15.json`), `curriculumRefs` grounded in each mission's actual activity `type` fields as in prior batches.
- **Vocabulary**: embedded for Missions 11 ("circuit"), 12 ("constellation"), 13 ("trend"), 14 ("inference" — deliberately distinguished from Mission 4's "assumption" as a more advanced, evidence-supported form of the same idea), 15 ("diagnose").
- **Image specifications** (IMAGE-0013–0017): one key-scene spec per mission, including a star-chart reference diagram for Mission 12 (matching `ASSET_COMPILER.md`'s own worked example) and a "Connections Board" scene for Mission 13's more abstract data-pattern Breakthrough beat. Mission 14's spec again avoids depicting Dr. Elara Quinn.

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- Confirmed Mission 15's experiment references an actual `type: "experiment"` activity, and that Mission 11 was correctly excluded after checking its JSON directly rather than assuming from `505_RESOURCES.md`.

## Verification

Batch 3 extends the same pattern to Missions 11–15, and specifically validates that the experiment-scoping rule holds even when a mission's resources document seems to imply an experiment (Mission 11) that its own compiled JSON doesn't actually contain. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 2 (Missions 6–10) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 6–10, extending the Batch 1 pattern:

- **Notebook instructions** (`generated/workbook/pages/mission06.md`–`mission10.md`), written the same way as Batch 1 — concrete notebook steps rather than restated mission JSON `instructions`.
- **First experiments produced** (`generated/resources/experiments.json`, new file): scanned each mission's `activities[]` directly rather than assuming from `505_RESOURCES.md`'s scoping — confirmed Mission 7 (`ACTIVITY-0041`, "Test and Refine") and Mission 10 (`ACTIVITY-0058`, "Conduct Simple Experiments") are the only two of this batch with a `type: "experiment"` activity; Missions 6, 8, 9 correctly got none. Both experiments (a bridge load test, a tube-blockage water-flow test) use only common household items, consistent with the bridge materials (card/straws/tape) and Scottish Water/PhET references already present in `505_RESOURCES.md` for these two missions.
- **One further printable**: Mission 10's water-system diagram (`printables/mission10-water-system-diagram.md`) — justified because the mission's own Core activities ("Trace Water Flow", "Interpret Diagrams") explicitly require following an existing pipework diagram, meeting PHILOSOPHY's "a diagram to trace" bar. Missions 6, 7, 8, 9 were assessed and needed none — reasons recorded per-mission in `workbook.json`.
- **Parent enrichment** (`generated/parent/enrichment/mission06.json`–`mission10.json`): same shape as Batch 1, `curriculumRefs` grounded in each mission's actual activity `type` fields (e.g. Mission 7's `experiment`-typed activity mapped to `CURRICULUM-0004` "Working Scientifically", alongside `CURRICULUM-0005` Engineering & Design).
- **Vocabulary**: embedded in notebook pages for Missions 6 ("meteorologist"), 8 ("transmission"), 9 ("classify"), 10 ("malfunction"). Mission 7 got none — its own text introduces no vocabulary beyond common engineering words already familiar at this level.
- **Image specifications**: one key-scene spec per mission (IMAGE-0007–0011), plus one additional diagram spec for Mission 10 (IMAGE-0012, the station water system schematic) — justified because, unlike the Mission 2 sketch-map pattern (activity *output* is a diagram), Mission 10's Core activities require an *existing* diagram as input to interpret, so the mission cannot function without one. Mission 8's spec deliberately shows the communications console's waveform display rather than Dr. Quinn, for the same reason established in Mission 4's spec — she remains unseen, known only through records, at this point in the story.

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- Confirmed both experiments reference a mission that actually has a `type: "experiment"` activity, checked directly against each mission's compiled JSON (not assumed from the resources document or prior batches).

## Verification

Batch 2 extends the same notebook-first, minimal-spec, evidence-grounded pattern from Batch 1 to Missions 6–10, and establishes the first working `experiments.json`, validating that the experiment-scoping rule in `ASSET_COMPILER.md` ("scan the compiled mission JSON directly") produces correct, non-hardcoded results. ✅

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
