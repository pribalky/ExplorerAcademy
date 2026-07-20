# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Scheduler

## Objective

Build the Adaptive Scheduler: given a mission's activities (each classified `core`/`extension`/`rabbitHole` via `schedulerCategory`) and a selected session duration, assemble the subset of activities to present — Core always included, Extension/Rabbit Hole included as time allows. Wire the Mission page to use the scheduled subset instead of rendering every activity unconditionally.

## Inputs

- `portal/campaigns/campaign01/src/missions/mission01.json` (one `core` activity today — may need 1-2 more placeholder activities across categories to exercise the scheduler meaningfully)
- `portal/js/activity-engine.js` (renders whatever list it's given — already duration/category-agnostic)
- `docs/50-content/504_JSON_SCHEMA.md` (Scheduler Category, Session Configuration)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Adaptive Scheduler, Session Assembly, Scheduler Rules sections)
- `docs/00-foundation/006_DESIGN_DECISION_LOG.md` (ADR-009 — Adjustable Daily Duration)

## Files Expected to Change

- `portal/js/scheduler.js` (currently an empty placeholder)
- `portal/js/router.js` (Mission view calls the scheduler before calling `renderActivities`)
- Possibly `portal/campaigns/campaign01/src/missions/mission01.json` (add an extension/rabbitHole activity to exercise all three categories)

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Any UI for the parent/learner to actually choose a session duration (Settings Manager doesn't exist yet — a fixed duration, e.g. passed as a constant or query-style default, is enough to prove the scheduling logic)
- LocalStorage/persistence, Reward Engine, Discovery Log, Parent Mode, Workbook generation
- Learner interaction/completion tracking

## Success Criteria

- Given a mission and a duration, the Scheduler returns Core activities always, plus Extension/Rabbit Hole activities only when the budget allows.
- The Scheduler never mutates the mission data it's given (`601_HTML_ARCHITECTURE.md`: "The Scheduler never changes campaign data").
- Mission page activity list reflects the scheduled subset, not the raw `activities[]` array.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working Scheduler module
- Mission page driven by scheduled activities

## Completion Notes

Not yet started.

---

# Previous Milestone — Activity Renderer — COMPLETE

## Completion Summary

Built `portal/js/activity-engine.js`: a single generic Activity Card renderer used for every activity type (no per-type specialised renderers yet, per this milestone's explicit scope), and wired it into the Mission page in `router.js` so `mission.activities` renders as real content instead of just a count.

Key decisions:

- **Only required Activity fields are rendered** (title, type, schedulerCategory, duration, difficulty, storyContext, instructions, output) — the optional fields (`resources`, `hints`, `extensions`) aren't rendered yet since there's no Asset Manager to resolve resource references and no clear value in a bare hint list without the progressive-reveal behaviour `601_HTML_ARCHITECTURE.md`'s Hint Panel describes; both are natural follow-ups, not silently dropped.
- **`parentNotes` is deliberately never rendered**, called out explicitly in a comment — Parent Guide content must stay hidden from the learner-facing interface per ADR-006, so this isn't an oversight to "complete later."
- **Text is set via `textContent`/DOM construction, never `innerHTML`** — same rule already applied in `campaign-loader.js`/`router.js`, since activity content is authored campaign data, not trusted markup.
- **Heading levels nest correctly**: mission title (`h2`) → "Activities" section heading (`h3`) → each Activity Card's own title (`h4`).

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright:

- `#/mission/mission01` renders one Activity Card with all expected fields (title, type, category, duration, difficulty, story context, instructions, expected output).
- Temporarily set `activities: []` in `mission01.json` — the Mission page rendered "No activities yet for this mission." with no error; file restored afterward and `diff` confirmed no residual changes.
- Full regression pass across all 8 routes (Home, Campaign Select, Campaign Overview, Discovery Log, Explorer Profile, Settings, unknown mission ID, unknown route) — all still correct.
- Zero `pageerror`s across every case.

## Verification

- The Mission page lists each activity in `activities[]` with at least title, type and instructions. ✅
- A mission with zero activities renders without error. ✅
- No campaign-specific or activity-specific logic leaks into the platform — rendering stayed generic. ✅
