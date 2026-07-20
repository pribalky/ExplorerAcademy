# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Activity Renderer

## Objective

Render the activities embedded in a loaded mission's `activities[]` array on the Mission page — the first content the learner actually sees rendered from structured data, rather than just metadata rows in a `<dl>`.

## Inputs

- `portal/js/mission-engine.js` (already loads and validates `activities[]`)
- `portal/campaigns/campaign01/src/missions/mission01.json` (has one placeholder activity)
- `docs/50-content/504_JSON_SCHEMA.md` (Activity, Activity Type, Scheduler Category)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Activity View, Activity Card, Activity Renderer, Activity Lifecycle sections)
- `docs/40-campaigns/402_MISSION_TEMPLATE.md` (Activity Template, Supported Activity Types)

## Files Expected to Change

- `portal/js/activity-engine.js` (currently an empty placeholder)
- `portal/js/router.js` (Mission view extended to render the activity list, not just counts)
- Possibly `portal/components/activities/`

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Learner interaction / activity completion state (no Storage Manager yet)
- Scheduler (Core/Extension/Rabbit Hole selection — every activity renders for now)
- Reward Engine, Discovery Log, Parent Mode, Workbook generation
- Per-activity-type specialised rendering (Reading vs. Experiment vs. Mathematics) — a single generic Activity Card covering the common fields is likely enough for this milestone; specialised renderers can follow later if needed

## Success Criteria

- The Mission page lists each activity in `activities[]` with at least title, type and instructions.
- A mission with zero activities (a valid, if unusual, case) renders without error.
- No campaign-specific or activity-specific logic leaks into the platform — rendering stays generic per `601_HTML_ARCHITECTURE.md`'s Activity Card principles.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working generic Activity renderer
- Mission page shows real activity content instead of just an activity count

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Engine — COMPLETE

## Completion Summary

Built `portal/js/mission-engine.js` (loader + validator, matching `campaign-loader.js`'s pattern) and the first placeholder mission, `campaign01/src/missions/mission01.json`. Wired it into the router's `/mission/:id` route so it renders real mission metadata instead of a static placeholder.

Two scope decisions were made with the user before starting, given real gaps found in the docs:

- **`storyChapter` is validated as present but not resolved** to an actual chapter file, since no World Bible/Chapter content or Chapter Loader exists yet — same treatment `campaign-loader.js` already gives `worldBibleId`.
- **The placeholder mission is a full schema-conformant stub**, not a thin one: all 8 canonical Mission Beat types (`504_JSON_SCHEMA.md`: "each mission should contain all beats"), one fully-fielded placeholder Activity (11 required fields), one placeholder Reward, and a minimal `reflection` object (504 lists `reflection` as required but never defines its own field table — a real documentation gap — so its shape was inferred from `503_DATA_MODEL.md`'s conceptual Reflection Schema description as `{ prompts: [...] }`).

Other decisions:

- **Mission loading/validation lives in `mission-engine.js`**, not a new `mission-loader.js` file, since the module list fixed back in Milestone 1.1 (`portal/ARCHITECTURE.md`) only names `mission-engine.js` — this also gives the eventual lifecycle behaviour (advancing activities, completion) a natural home in the same file later.
- **Mission routes stay campaign-unscoped for now** (`/mission/:id`, not `/campaign/:id/mission/:id`) — `renderMission` hardcodes the `campaign01` folder slug when calling the loader, the same simplification `KNOWN_CAMPAIGN_IDS` already makes for Campaign Select. Worth revisiting once a second campaign exists.
- **Validation checks field presence only, not enum values** — e.g. `difficulty: "explorer"` or `schedulerCategory: "core"` aren't checked against their documented enums. This matches the precedent set by `campaign-loader.js` (which doesn't enum-check `status` or `difficulty` either) and keeps validation scope from ballooning into a full schema validator.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright:

- `#/mission/mission01` renders the mission's title as the heading/`<title>`, plus estimated time, difficulty and activity count.
- `#/mission/does-not-exist` shows the graceful "No mission could be loaded" fallback with a specific not-found message.
- Temporarily replaced `mission01.json` with data missing 10 of 12 required fields — the page listed every missing field individually, no crash; file was restored afterward and `diff` confirmed no residual changes.
- Regression pass on `/campaigns` and `/campaign/campaign01` (from the Router extension milestone) — both still correct.
- Zero `pageerror`s across every case.

## Verification

- A placeholder mission loads and validates against `504_JSON_SCHEMA.md`'s required Mission fields. ✅
- `/mission/:id` renders the mission's title/objective for a valid ID, and fails gracefully for an unknown one, mirroring the Campaign Loader's error handling. ✅
