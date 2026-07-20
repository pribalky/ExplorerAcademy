# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Reward Engine

## Objective

Build the Reward Engine: evaluate a mission's `rewards[]` (already loaded and validated by `mission-engine.js`, currently unused) when a mission's reflection is completed, and give the learner some visible acknowledgement — completing Phase 2's final unchecked milestone.

## Inputs

- `portal/campaigns/campaign01/src/missions/mission01.json` (`rewards[]` — one placeholder badge reward, currently loaded but never surfaced anywhere)
- `portal/js/storage.js` (save shape will likely need a third field — earned rewards — alongside `currentSession` and `discoveryLog`)
- `docs/50-content/504_JSON_SCHEMA.md` (Reward required fields, Reward Type enum)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Reward Engine, Reward Popup, Explorer Profile sections)
- `docs/00-foundation/006_DESIGN_DECISION_LOG.md` (ADR-007 — Curiosity Before Completion: rewards reinforce exploration, not completion rate)

## Files Expected to Change

- `portal/js/reward-engine.js` (currently an empty placeholder)
- `portal/js/storage.js` (extend save shape with earned rewards)
- `portal/js/router.js` (trigger reward evaluation after a reflection is saved; some visible acknowledgement on the Mission page)

## Implementation Plan

To be defined at the start of this milestone. Not yet started. Worth checking for cross-references before starting, given the pattern in every milestone so far (Mission's `reflection`, Session Configuration's weights, Discovery Log Entry) — the Reward schema itself may have similar gaps (e.g. `value`'s type/shape is unspecified in 504).

## Out of Scope

- Explorer Rank / long-term progression (a distinct entity from Reward, per `503_DATA_MODEL.md`)
- Parent Mode, Workbook generation
- Any reward types beyond what a placeholder can exercise (likely just `badge`)

## Success Criteria

- Completing a mission's reflection evaluates its rewards and persists earned ones via the Storage Manager.
- Earned rewards survive a page reload.
- No campaign-specific reward logic leaks into the platform — the Reward Engine interprets reward *definitions*, per `601_HTML_ARCHITECTURE.md`.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working Reward Engine
- Some visible learner-facing acknowledgement of an earned reward

## Completion Notes

Not yet started.

---

# Previous Milestone — Discovery Log — COMPLETE

## Completion Summary

Built `portal/js/discovery-log.js` (the Discovery Log Manager), extended `storage.js`'s save shape with a `discoveryLog` array, and added the platform's **first learner-input control**: a reflection prompt + free-text response box on the Mission page, wired to save entries via `recordReflection()`. `/discovery` now lists real saved entries instead of a static placeholder.

A real schema gap was found and resolved with the user before implementing:

- **None of the three docs (`504_JSON_SCHEMA.md`, `503_DATA_MODEL.md`, `601_HTML_ARCHITECTURE.md`) agree on Discovery Log Entry's fields, and none of them include a field for the learner's actual written response** — the whole point of the feature. Confirmed with the user: extended 504's minimal `id`/`prompt`/`entryType` with `learnerNotes` (the response text), `timestamp`, `campaignId` and `missionId` (cross-campaign traceability, per 601's "the Discovery Log spans all campaigns"). `504_JSON_SCHEMA.md` now carries a note documenting the extension and the three-way disagreement it resolves — same reconciliation pattern used for the Repository Structure, Session Configuration and `storyChapter` gaps in earlier milestones.

Other decisions:

- **`discoveryLog` is an additive field on the existing save shape**, not a version bump — `readSave()`'s `{ ...defaultSave(), ...data }` merge means a save written before this milestone (Milestone: Save State, `version: 1`) still loads correctly, with `discoveryLog` defaulting to `[]`. Matches the project's stated "additive changes preferred" versioning philosophy.
- **`storage.js` owns persistence only** (`appendDiscoveryLogEntry`, `loadDiscoveryLog`); `discovery-log.js` owns entry creation, ID generation and validation (rejecting an empty response before it ever reaches storage) — keeping the "only `storage.js` touches `localStorage`" rule intact rather than letting `discovery-log.js` bypass it.
- **Only `entryType: "reflection"` is produced** — the other documented entry types (drawing, prediction, observation, diagram) have no authoring UI yet, called out explicitly in both the code comment and the doc note so it isn't mistaken for an oversight.
- **The reflection form is a real `<form>`/`<textarea>`/`<button type="submit">`**, not a plain click handler — `event.preventDefault()` on submit, `role="status"` on the feedback message so screen readers announce save/error feedback, matching the project's accessibility requirement. An empty submission is rejected with visible feedback rather than silently failing or saving a blank entry.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright, including a real `page.reload()`:

1. **Fresh `/discovery`** — correct empty-state message.
2. **Mission page** — the placeholder reflection prompt renders with its own form.
3. **Empty submission** — rejected with visible feedback, no crash, nothing saved.
4. **Valid submission** — feedback confirms the save, textarea clears, `localStorage` inspected directly and contains the full entry with all expected fields.
5. **Reload, then `/discovery`** — the saved entry renders with its prompt, response text, mission ID and a formatted timestamp.
6. **Full 9-route regression pass** — all routes still correct.

Zero `pageerror`s across every case.

## Verification

- A learner-recorded reflection persists via the Storage Manager and survives a page reload. ✅
- `/discovery` renders real entries when present, and a sensible empty state when not. ✅
- Discovery Log storage failures degrade gracefully (inherits `storage.js`'s existing non-throwing guarantees — not re-tested independently this milestone, since the failure-mode behavior itself didn't change). ✅
