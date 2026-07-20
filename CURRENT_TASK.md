# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler

## Objective

Convert every mission in `docs/50-content/501_CAMPAIGN_01.md` (currently campaign-level mission *summaries*, not full mission implementations, per that document's own "Design Note") into independent, `504_JSON_SCHEMA.md`-conformant JSON files under `portal/campaigns/campaign01/src/missions/`, replacing the current single hand-authored placeholder (`mission01.json`) with 21 real (if still narratively summary-level) missions.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` Part 3–5 (Missions 1–21: Story Summary, Learning Focus, Story Outcome, Core/Extension/Rabbit Hole Activities for each)
- `docs/40-campaigns/402_MISSION_TEMPLATE.md`
- `docs/50-content/504_JSON_SCHEMA.md` (Mission, Mission Beat, Activity, Reward schemas — plus this session's extension notes)
- `portal/js/mission-engine.js` (existing validation the compiler's output must satisfy: all required Mission fields, all 8 Mission Beat types, all required Activity/Reward fields per mission)
- `portal/campaigns/campaign01/src/campaign.json` (already lists all 21 mission ID references this compiler needs to produce)

## Relevant Documentation

- `prompts/MISSION_COMPILER.md` (a compiler prompt already exists — read this first, same as the Campaign Compiler prompt was read before that milestone; may have its own doc-vs-implementation gaps worth checking before starting, given the pattern established by every milestone so far)

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission01.json` through `mission21.json` (or a compatible ID-based naming scheme — worth confirming against how `/mission/:id` currently resolves filenames)
- Possibly `portal/js/router.js` if mission ID routing conventions need adjusting for 21 real missions instead of one hand-picked slug

## Implementation Plan

Not started — needs `prompts/MISSION_COMPILER.md` read first, and likely its own scoping conversation given the volume (21 missions × required beats/activities/rewards/reflection each) and the real risk of a similar doc-vs-implementation schema conflict to the one found in the Campaign Compiler milestone.

## Out of Scope

TBD — depends on what `prompts/MISSION_COMPILER.md` specifies.

## Success Criteria

- Every mission validates (per `mission-engine.js`'s existing, unmodified validation).
- References resolve (mission IDs match what `campaign.json`'s `missions[]` array already declares).
- Scheduler metadata exists (every activity has a valid `schedulerCategory`).

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

TBD.

## Completion Notes

Not yet started.

---

# Previous Milestone — Campaign Compiler — COMPLETE (Phase 3 now complete)

## Completion Summary

Compiled `portal/campaigns/campaign01/src/campaign.json` from `docs/50-content/501_CAMPAIGN_01.md`, replacing the schema-valid-but-empty placeholder with real (if still summary-level) campaign metadata.

A significant, architecture-level conflict was found and resolved with the user before compiling anything:

- **`prompts/CAMPAIGN_COMPILER.md` explicitly instructed "Follow 503_DATA_MODEL.md exactly"** — but 503's Campaign entity is chapter-based (`Campaign` requires `Chapter IDs`; `Chapter` requires `Mission IDs`), a fundamentally different, mandatory-hierarchy shape than the flat structure (`missions[]` directly on `Campaign`, no required chapter layer) that `campaign-loader.js` and every platform milestone since have been built and tested against. Following the prompt literally would have produced a `campaign.json` the already-working platform couldn't load.
- **Decided with the user on the actual deciding criterion** — which schema better serves "new campaigns require no platform code changes" (the project's own stated Definition of Done) — not just "which is already built." Reasoning: 504's flat model makes no *mandatory* assumption about narrative grouping; chapters/phases stay optional, campaign-authored metadata the platform never has to traverse. 503's required chapter layer bakes in a structural assumption that could eventually force a schema/validation change for some future campaign shape that doesn't want chapters. 504 was chosen on that basis, with platform-compatibility as a secondary, reinforcing (not deciding) factor.
- **`prompts/CAMPAIGN_COMPILER.md` was corrected** to say "Follow 504_JSON_SCHEMA.md exactly," with a note explaining the reasoning and pointing back to this decision — the same reconciliation pattern used for every doc-drift found in earlier milestones.

Field-by-field sourcing (for auditability, since compiling prose into schema fields necessarily involves some editorial judgment):

- `title`: copied verbatim from 501's own Campaign Metadata table ("Campaign Name": "Campaign 01 – Explorer Academy").
- `theme`: copied verbatim from 501's "Themes" field (comma-separated, unchanged).
- `recommendedAge`, `estimatedDuration`: derived directly from 501's "Audience" and "Estimated Duration" fields, reformatted to match this schema's existing style (e.g. ASCII hyphen).
- `difficulty`: derived from 501's "Beginner Campaign" → `"beginner"`.
- `completionCriteria`: compiled from 501's explicit "Campaign Completion Criteria" section (5 bullet points) into one descriptive sentence — no criteria invented, all five carried through.
- `subtitle`: the one field requiring real synthesis — 501 has no subtitle field. Written from facts explicitly stated in the Campaign Overview (Outpost Echo, the probationary-Explorer premise), not fabricated. Flagged as the field most worth a second look.
- `author`, `status`, `worldBibleId`: left unchanged from the original placeholder (`status: "draft"` happens to already match 501's own stated Status; no real author is given anywhere in 501; `worldBibleId` stays present-but-unresolved, consistent with the same treatment already given to `storyChapter` in the Mission Engine milestone — no `world-bible.json` was generated, per the compiler prompt's "generate only campaign.json").
- `missions[]`: all 21 mission ID references (`MISSION-0001`–`MISSION-0021`), matching 501's Mission Map table by position — ID references only, no mission content duplicated here, per the compiler prompt's "do not generate missions" / "replace duplicated values with references."

## Manual Testing Performed

- Confirmed the compiled JSON parses and its `missions` array has exactly 21 entries.
- Served `portal/` locally and drove it with Playwright: `/campaigns` and `/campaign/campaign01` both render the real compiled metadata (title, subtitle, theme, age, duration, mission count) through `campaign-loader.js` and `router.js` **completely unmodified** — direct evidence that the "no platform code changes for new campaign data" goal holds in practice, not just in theory.
- Full 9-route regression pass — all routes still correct, zero `pageerror`s.

## Verification

- Valid JSON. ✅
- Schema compliant (loads and validates through the existing, unmodified Campaign Loader). ✅
- No duplicated information (missions referenced by ID only, no inlined mission content; world bible referenced by ID only, not generated this milestone). ✅
