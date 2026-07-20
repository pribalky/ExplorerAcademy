# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler (Missions 9–13, Phase 3 — Building Scientific Confidence)

## Objective

Compile the next batch — Missions 9–13 (Mystery Samples, Water Under Pressure, The Energy Problem, Star Maps, Hidden Patterns), which 501's own Narrative Progression groups as "Phase 3 — Building Scientific Confidence" — following the pattern codified in `prompts/MISSION_COMPILER.md`.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` (Missions 9–13 source content — already read in full this session)
- `portal/campaigns/campaign01/src/missions/mission01.json`–`mission08.json` (pattern + next available IDs: activities continue from `ACTIVITY-0051`, rewards from `REWARD-0009`, parent guides from `PARENTGUIDE-0009`)
- `prompts/MISSION_COMPILER.md`

## Relevant Documentation

Same as prior mission-compiling milestones. `storyChapter` for Missions 9–13 should be `CHAPTER-0003` ("Phase 3 — Building Scientific Confidence"), and `difficulty` should be `"independent"` — continuing the 1:1 mapping between 501's 5 narrative phases and its 5-stage Learning Progression table (Guided→Phase 1, Supported→Phase 2, Independent→Phase 3, Confident→Phase 4, Explorer→Phase 5) established for Missions 5–8.

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission09.json`–`mission13.json`

## Implementation Plan

Same process as every batch so far. Mission 11 (The Energy Problem) is explicitly a mathematics/electricity-circuits mission — like Mission 7's engineering focus, worth a slightly closer look for activity-type fit, but not expected to need any schema change.

## Out of Scope

Same as previous mission-compiling milestones.

## Success Criteria

Same as previous mission-compiling milestones, applied to Missions 9–13.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

`mission09.json`–`mission13.json`.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Missions 5–8) — COMPLETE

## Completion Summary

Compiled `mission05.json` (Strange Footprints), `mission06.json` (Weather Watch), `mission07.json` (The Broken Bridge) and `mission08.json` (Message in the Static) from `501_CAMPAIGN_01.md`, completing Phase 2 — "Learning to Investigate" (`storyChapter: "CHAPTER-0002"`).

New decision made this batch, following the pattern already established (make a considered choice, don't just guess): **`difficulty` for Missions 5–8 is `"supported"`**, not `"guided"` — derived by mapping 501's 5 narrative phases (Recruitment & Orientation / Learning to Investigate / Building Scientific Confidence / Solving the Mystery / Graduation) onto its 5-stage Learning Progression table (Guided / Supported / Independent / Confident / Explorer) 1:1. Both are 501's own structures; this is the first batch where they had to be reconciled, since Missions 1–4 all fell within Phase 1 = the first stage and never required distinguishing them. This mapping will carry forward to remaining batches (Phase 3 → "independent", Phase 4 → "confident", Phase 5 → "explorer").

Mission 7 (The Broken Bridge) has **5 Core activities**, not 4 like every mission so far (501 itself lists 5: analyse, plan, build, test-and-refine, record). Duration tuning adapted accordingly — 5 × 6 minutes = 30, preserving the same "Core sums to 30" convention with a different activity count. Verified this produces the same correct Core+Extension/no-Rabbit-Hole behavior at the default 60-minute session as every 4-activity mission has.

Reward types continued diversifying based on what actually fits each mission's Story Outcome, not defaulting to `"badge"`: Mission 6 and Mission 7 both use `"unlock"` (weather station access; storage facility access) since their Story Outcomes are literally about gaining access to something, not earning a badge object. Mission 8 continues the `"story"` pattern from Mission 4 (both mark direct narrative contact with Dr. Quinn).

## Manual Testing Performed

- Confirmed all 4 new mission files parse as valid JSON.
- **Global ID uniqueness verified programmatically across all 8 compiled missions to date** (74 total IDs — mission/activity/reward/parentGuide — zero duplicates), not just carried forward by assumption.
- Confirmed Mission 7's 5-activity Core set sums to exactly 30 minutes programmatically.
- Served `portal/` locally and drove all four new missions with Playwright: each renders its real title/content; at the default 60-minute session, Missions 5/6/8 each show exactly 5 activity cards (4 Core + 1 Extension) and Mission 7 shows exactly 6 (5 Core + 1 Extension) — Rabbit Hole correctly excluded in every case.
- Parent Guide leakage check repeated for all four — none found.
- Full regression pass across all 16 routes (12 from before plus the 4 new missions) — all correct, zero `pageerror`s.

## Verification

- Every mission validates. ✅
- References resolve. ✅ (`MISSION-0001`–`0008` all match `campaign.json`'s `missions[]` entries)
- Scheduler metadata exists and behaves correctly, including the first 5-Core-activity mission. ✅
