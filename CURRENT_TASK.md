# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler (Missions 5–8, Phase 2 — Learning to Investigate)

## Objective

Compile the next batch of missions from `docs/50-content/501_CAMPAIGN_01.md` — Missions 5–8 (Strange Footprints, Weather Watch, The Broken Bridge, Message in the Static), which 501's own Narrative Progression groups as "Phase 2 — Learning to Investigate" — following the now-twice-validated pattern from Missions 1–4, and the conventions now codified in `prompts/MISSION_COMPILER.md`.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` (Missions 5–8 source content — already read in full this session)
- `portal/campaigns/campaign01/src/missions/mission01.json`–`mission04.json` (validated pattern + next available ID numbers: activities continue from `ACTIVITY-0026`, rewards from `REWARD-0005`, parent guides from `PARENTGUIDE-0005`)
- `prompts/MISSION_COMPILER.md` (now codifies the schema decision, ID numbering, duration tuning and Activity Type enum conventions — should need no further re-discovery)

## Relevant Documentation

Same as prior mission-compiling milestones. `storyChapter` for Missions 5–8 should be a new value (e.g. `CHAPTER-0002`, corresponding to 501's "Phase 2 — Learning to Investigate") distinct from Missions 1–4's `CHAPTER-0001` ("Phase 1 — Recruitment & Orientation") — still present-but-unresolved, no Chapter file exists.

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission05.json`–`mission08.json`

## Implementation Plan

Follow the exact process used for Missions 2–4: derive 8 beats per mission from Story Summary/Core Activities/Story Outcome, map Core/Extension/Rabbit Hole activities from 501's own lists, tune durations (Core ≈30 min, Extension ≈15 min each, Rabbit Hole ≈10 min), assign one grounded reward and reflection prompt per mission, build a parentGuide from each mission's Learning Focus.

Mission 7 — The Broken Bridge is the campaign's first engineering-design mission (plan/build/test/refine an actual bridge prototype) — its activities will look different in kind from Missions 1–6's reading/observation-heavy activities, worth a slightly closer look when compiling it, though it doesn't appear to need any new schema field.

## Out of Scope

Same as previous mission-compiling milestones.

## Success Criteria

Same as previous mission-compiling milestones, applied to Missions 5–8.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

`mission05.json`–`mission08.json`.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Missions 2–4) — COMPLETE

## Completion Summary

Compiled `mission02.json` ("Arrival at Outpost Echo"), `mission03.json` ("Explorer's Toolkit") and `mission04.json` ("The Silent Logs") from `501_CAMPAIGN_01.md`, following Mission 1's validated pattern exactly — Phase 1 ("Recruitment & Orientation," `storyChapter: "CHAPTER-0001"`) is now fully compiled.

Also **codified the accepted format into both compiler prompts**, per the user's request, so future runs don't need to re-derive these decisions:

- `prompts/CAMPAIGN_COMPILER.md` already carried the 503→504 reconciliation note from the Campaign Compiler milestone.
- `prompts/MISSION_COMPILER.md` was substantially rewritten: points to 504 (not 503) as authoritative, explains embedding vs. ID-referencing (and narrows "reference shared campaign entities by ID" to mean only genuinely campaign-level entities — `storyChapter`/`campaignId` — not Activities/Beats/Rewards/Parent Guide), documents the `parentGuide` gap and fix, and adds three new sections that didn't exist before: **ID Numbering** (global sequence across missions, not restarted per file), **Duration Tuning** (the ~30/15/10-minute convention that makes the Scheduler's four bands behave meaningfully), and **Activity Type** (must come from 504's fixed enum, not invented).

Compilation notes:

- Each mission's reward is grounded in its own Story Outcome where 501 states one directly — e.g. Mission 4's reward (`type: "story"`, `value: "Discovery: Dr. Elara Quinn"`) mirrors 501's own text: "Learner discovers Dr. Elara Quinn." Mission 3's reward uses `type: "knowledgeCore"` rather than `"badge"` since its story is explicitly about learning a reusable method, not earning a badge object — the first mission where a non-badge Reward Type was actually the better fit.
- All 3 missions have only **one** Extension activity each (501 lists just one for each), not two like Mission 1 — activity counts were not padded to match Mission 1's shape; they follow whatever 501 actually lists per mission.
- Global ID uniqueness was verified programmatically across all 4 compiled missions (37 total IDs — mission/activity/reward/parentGuide — zero duplicates), not just assumed from careful counting.

## Manual Testing Performed

Served `portal/` locally and drove all three new missions with Playwright:

- `/mission/mission02`, `/mission/mission03`, `/mission/mission04` each render their real title and content.
- **Scheduler correctness verified for all three**: at the default 60-minute session, exactly 5 of 6 activities render (4 Core + the single Extension) for each mission — Rabbit Hole correctly excluded, confirming the duration-tuning convention (now documented in the prompt) works consistently across different missions, not just Mission 1's specific numbers.
- **Parent Guide leakage check repeated for all three** (not assumed to still hold from Mission 1) — searched each rendered page's full text for `learningObjectives`, `discussionPoints`, `PARENTGUIDE`: none present in any of them.
- Full regression pass across 12 routes (the original 9 plus the 3 new missions) — all correct, zero `pageerror`s.

## Verification

- Every mission validates. ✅ (all 4 compiled missions load through `mission-engine.js`'s unmodified-since-`parentGuide` validation)
- References resolve. ✅ (`MISSION-0001`–`0004` all match `campaign.json`'s `missions[]` entries)
- Scheduler metadata exists and behaves correctly. ✅ (re-verified per-mission, not assumed from Mission 1)
