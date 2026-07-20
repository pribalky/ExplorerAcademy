# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler (Missions 2–21)

## Objective

Compile the remaining 20 missions from `docs/50-content/501_CAMPAIGN_01.md` into `mission02.json`–`mission21.json`, following the exact pattern, schema and field-mapping conventions established by Mission 1's compilation.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` Parts 3–5 (Missions 2–21 source content — already read in full this session)
- `portal/campaigns/campaign01/src/missions/mission01.json` (the now-validated template/pattern to replicate)
- `portal/js/mission-engine.js` (validation, now including `parentGuide`)

## Relevant Documentation

- Same as the Mission 1 milestone — no new documentation gaps expected, since Mission 1 already surfaced and resolved the real ones (503-vs-504 embedding, missing `parentGuide` field).

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission02.json` through `mission21.json`
- Possibly `portal/campaigns/README.md` or similar if a pattern/authoring note would help future compilation passes

## Implementation Plan

Not started. Given the volume (20 missions × 8 beats × several activities × a reward × a parent guide each), likely worth doing in a few batches rather than one enormous pass, checking in periodically rather than only at the very end — but this is a process question, not an architectural one, so it doesn't need to block starting.

## Out of Scope

- Wiring `storyChapter` values to real Chapter entities (still present-but-unresolved, per the established pattern — Phase 1–5 chapter groupings from 501's Narrative Progression section can inform the *values* used, without requiring actual Chapter files to exist)
- Any platform code changes — the explicit point of Mission 1's proof was that none should be needed for additional missions

## Success Criteria

- Every mission validates against `mission-engine.js`'s existing, unmodified-since-Mission-1 validation.
- `campaign.json`'s `missions[]` references (`MISSION-0002`–`MISSION-0021`) all resolve to real files.
- Scheduler metadata (`schedulerCategory`, numeric `duration`) present and sensible on every activity, following Mission 1's duration-tuning approach (Core sums to ≤30 min so the 30-minute band is genuinely self-contained; Extension sized so 45 min includes roughly one item and 60 min includes all of them; Rabbit Hole only surfaces at 90).

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

TBD — likely mission02–mission21 in some batched order.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Mission 1) — COMPLETE

## Completion Summary

Compiled `portal/campaigns/campaign01/src/missions/mission01.json` from `501_CAMPAIGN_01.md`'s "Mission 1 — The Invitation" section, replacing the schema-valid-but-placeholder content with real mission data, as a validated template/pattern before attempting all 21 missions.

Two things were verified/found before compiling, both confirmed with the user:

- **The same 503-vs-504 conflict found in the Campaign Compiler milestone recurs for Mission**: `prompts/MISSION_COMPILER.md` says "follow the canonical data model exactly" (503), and 503's Mission requires `Beat IDs`/`Activity IDs` (separate referenced entities), conflicting with `504`'s embedded-object Mission schema that `mission-engine.js`/`activity-engine.js`/`scheduler.js`/`reward-engine.js` already consume. **The "no platform code changes" principle was explicitly re-verified rather than assumed**: for Campaign, embedding avoided a *mandatory* structural assumption (chapters) some future campaign might not want; for Mission's Activities/Beats/Rewards, there's no analogous risk since these are always 1:1 mission-owned, never shared/reused, in both the schema and the actual campaign content — so embedding is simply the natural, lossless shape, not a structural trade-off. 504 was reconfirmed as the target schema on that basis.
- **A genuine gap, distinct from the 503-vs-504 conflict**: the compiler prompt requires "Include parent notes," but 504's own Mission required/optional field list had no field for it at all, despite 504 separately defining a full Parent Guide schema and 503 saying Parent Guide is "Referenced by Missions." Resolved by adding `parentGuide` as a required, embedded Mission field (same reasoning as Activities/Rewards/Beats), extending `mission-engine.js`'s validation to match, and confirming — by direct string-search of the rendered page's text — that it never reaches the learner-facing view, per ADR-006 (Hidden Parent Mode).

Compilation/authoring notes (for auditability — unlike Campaign Compiler, most of Mission 1's content required synthesis, not verbatim copying, since 501 gives narrative summaries and activity bullet lists rather than ready-to-copy structured fields):

- The 8 canonical beats (`HOOK` through `CLIFFHANGER`) were derived by restructuring 501's own Story Summary/Core Activities/Story Outcome prose into the schema's dramatic shape — no new plot facts invented beyond what 501 states.
- All 7 activities (4 Core, 2 Extension, 1 Rabbit Hole) map directly to 501's own Core Activities/Extension/Rabbit Hole bullet lists for Mission 1; `storyContext`/`instructions`/`output` were written to match, `type`/`schedulerCategory` assigned from 504's enums.
- **Activity durations were deliberately tuned**, not arbitrary: Core sums to exactly 30 minutes (so the 30-minute session band is genuinely self-contained, not just "core regardless of overrun"); the two 15-minute Extension activities are sized so 45 minutes fits exactly one and 60 minutes fits both; the 10-minute Rabbit Hole only clears the 90-minute threshold. Verified this produces the intended Core/Core+one-Extension/Core+all-Extension/everything progression across all four session-duration bands.
- `reflection.prompts` and the one `reward` (`"Explorer Recruit"`, type `badge`) required real synthesis — 501 doesn't specify per-mission reward values or reflection prompts. Flagged here the same way `campaign.json`'s `subtitle` was flagged, as the fields most worth a second look.
- `storyChapter` stays `"CHAPTER-0001"` (present-but-unresolved, same treatment as `worldBibleId`) — corresponds to 501's own "Phase 1 — Recruitment & Orientation" (Missions 1–4), informing what the remaining Phase 1 missions (2–4) should use once compiled.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright:

- `/mission/mission01` renders real content throughout (title, activities, reflection prompt) with zero code changes to `router.js`/`activity-engine.js` beyond what Mission Engine/Activity Renderer/Scheduler milestones already built.
- **Scheduler correctness re-verified against real data**: at the default 60-minute session, exactly 6 of 7 activities render (4 Core + both Extension), Rabbit Hole correctly excluded — confirms the duration-tuning worked as designed.
- **Parent Guide leakage check**: searched the full rendered page text for `learningObjectives`, `discussionPoints`, the actual discussion-point text, and `PARENTGUIDE` — none present. `parentGuide` data loads and validates but is never rendered.
- Reflection → reward flow re-tested end-to-end with the real content (not just placeholder text): submission saves to the Discovery Log and correctly shows "Reward earned: Explorer Recruit."
- Full 9-route regression pass — all routes still correct, zero `pageerror`s.

## Verification

- Every mission validates (Mission 1 does, against `mission-engine.js`'s existing, now slightly-extended-for-`parentGuide` validation). ✅
- References resolve (`MISSION-0001` matches `campaign.json`'s first `missions[]` entry). ✅
- Scheduler metadata exists and behaves correctly at all four duration bands. ✅
