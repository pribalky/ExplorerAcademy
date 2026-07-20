# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Save State

## Objective

Build the Storage Manager: the single interface for all persistent learner data (localStorage-backed), starting with the minimum needed to make navigation durable — e.g. remembering the last-viewed mission/campaign across a browser refresh. No other module should touch browser storage directly once this exists.

## Inputs

- `portal/js/storage.js` (currently an empty placeholder)
- `portal/js/router.js` (candidate first consumer — could persist/restore the current route)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Storage Manager, Local Storage Architecture, Save Versioning, Corrupted Save Data sections)
- `docs/50-content/504_JSON_SCHEMA.md` (Save Game required fields)
- `docs/50-content/503_DATA_MODEL.md` (Save Game entity)

## Files Expected to Change

- `portal/js/storage.js`
- Possibly `portal/js/router.js` (if route persistence becomes the first real consumer)

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Explorer Profile creation/editing UI
- Reward Engine, Discovery Log, Parent Mode, Workbook generation
- Import/export
- Full Save Game schema (`completedMissions`, `completedActivities`, `discoveryLog` etc.) — likely just enough of the shape to prove persistence works, not a complete implementation of every field

## Success Criteria

- A save/load round-trip through `storage.js` survives a page reload.
- Corrupted or missing save data fails gracefully (returns a safe default, never throws) — matching the non-throwing pattern already used by `campaign-loader.js`/`mission-engine.js`.
- Saved data includes a version field, per `601_HTML_ARCHITECTURE.md`'s Save Versioning section.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working Storage Manager with a save/load API
- At least one real consumer (likely persisting the last-viewed route)

## Completion Notes

Not yet started.

---

# Previous Milestone — Scheduler — COMPLETE

## Completion Summary

Built `portal/js/scheduler.js` (the Adaptive Scheduler) and wired it into the Mission page in `router.js`, which now renders the scheduled subset of activities rather than every activity in `mission.activities` unconditionally.

Two things were surfaced and confirmed with the user before implementation:

- **A real, previously undiscussed spec conflict**: `504_JSON_SCHEMA.md`'s Session Configuration requires `coreWeight`/`extensionWeight`/`rabbitHoleWeight`, but those fields are never defined or explained anywhere in the docs (confirmed by grep — they appear nowhere else). `601_HTML_ARCHITECTURE.md`'s Adaptive Scheduler section, by contrast, fully describes a simpler duration-band model with no weights. **Decision: implement 601's duration-band model** (Core always included; Extension activities added while the remaining time budget allows; Rabbit Hole activities included only at the 90-minute band, merely "suggested" at 60) since it's the only one actually specified. `504_JSON_SCHEMA.md`'s Session Configuration section now carries a note marking the weight fields reserved/not-yet-implemented and pointing to 601 as the real behavior spec — the same reconciliation pattern used for the Repository Structure conflict fixed in Milestone 1.1.
- **A blocking data gap**: `mission01.json`'s activity `duration` (and the mission's `estimatedTime`) were placeholder strings (`"TBD"`), but the Scheduler needs to sum numeric minutes against a budget. Fixed by giving the existing Core activity a real numeric `duration: 15`, and adding one Extension (`duration: 20`) and one Rabbit Hole (`duration: 15`) placeholder activity so all three scheduler categories have something to exercise. `mission.estimatedTime` (mission-level descriptive metadata, not consumed by the Scheduler) was deliberately left as `"TBD"`.

Other decisions:

- **`scheduleActivities(activities, durationMinutes)` is a pure function** — filters/reduces build new arrays, the input is never mutated, satisfying `601`'s "The Scheduler never changes campaign data" rule.
- **Core activities are never budget-gated** — all Core activities are always included regardless of `durationMinutes`, matching `601`'s "Core activities must always remain intact" and `402_MISSION_TEMPLATE.md`'s same statement.
- **No Settings Manager exists yet to let a parent choose session duration**, so `DEFAULT_DURATION_MINUTES = 60` (601's own "recommended default experience") is used directly, with a comment marking it as a stand-in — the same kind of placeholder-constant pattern already used for `KNOWN_CAMPAIGN_IDS`.
- The chosen session duration is now shown on the Mission page itself (a "Session Duration" row), so the scheduling behavior is visible/verifiable, not just implicit.

## Manual Testing Performed

- **Pure-function boundary test** (Node, no browser): `scheduleActivities` against the three placeholder activities (15/20/15 min, core/extension/rabbitHole) at all four documented duration bands — 30→core only, 45→core+extension, 60→core+extension, 90→all three. Matches `601`'s Session Assembly table exactly. Confirmed the input array is untouched afterward.
- **Browser test** (Playwright) at the real default (60 min): Mission page renders exactly 2 activity cards (Core + Extension), Rabbit Hole correctly excluded, "Session Duration: 60 minutes" row visible, zero console errors.
- **Full regression pass** across all 9 routes (Home, Campaign Select, Campaign Overview, Discovery Log, Explorer Profile, Settings, valid mission, unknown mission, unknown route) — all still correct, zero `pageerror`s.

## Verification

- Given a mission and a duration, the Scheduler returns Core activities always, plus Extension/Rabbit Hole only when the budget allows. ✅
- The Scheduler never mutates the mission data it's given. ✅
- The Mission page activity list reflects the scheduled subset, not the raw `activities[]` array. ✅
