# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler (Missions 19–21, Phase 5 — Graduation) — final batch

## Objective

Compile the final batch — Missions 19–21 (Recover the Archive, Explorer Assessment, Graduation Day), which 501's own Narrative Progression groups as "Phase 5 — Graduation" — completing all 21 missions and Phase 4 of the overall roadmap.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` (Missions 19–21 source content — already read in full this session)
- `portal/campaigns/campaign01/src/missions/mission01.json`–`mission18.json` (pattern + next available IDs: activities continue from `ACTIVITY-0115`, rewards from `REWARD-0019`, parent guides from `PARENTGUIDE-0019`)
- `prompts/MISSION_COMPILER.md`

## Relevant Documentation

Same as prior mission-compiling milestones. `storyChapter` for Missions 19–21 should be `CHAPTER-0005` ("Phase 5 — Graduation"), `difficulty` should be `"explorer"`, completing the 1:1 phase-to-stage mapping (all 5 phases now covered).

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission19.json`–`mission21.json`

## Implementation Plan

Same process as every batch so far. Mission 21 (Graduation Day) is the campaign's finale — its Story Summary explicitly references "Atlas reveals that numerous other expeditions remain active... A final transmission arrives from another research station, quietly introducing the next campaign," which is scene-setting for Campaign 2, not Campaign 1 content — worth being careful not to over-invent anything for a campaign that doesn't exist yet. Its reward is also a natural candidate for `"rank"` (full Explorer status, matching Mission 17's precedent) rather than a mission-specific badge.

## Out of Scope

Same as previous mission-compiling milestones. Nothing about Campaign 2 should be invented, even though Mission 21 gestures toward it.

## Success Criteria

Same as previous mission-compiling milestones, applied to Missions 19–21. Once complete: all 21 `campaign.json` `missions[]` references resolve to real, compiled files — closing out Phase 4 entirely.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

`mission19.json`–`mission21.json`.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Missions 14–18) — COMPLETE

## Completion Summary

Compiled `mission14.json` (The Missing Notebook), `mission15.json` (The Signal Tower), `mission16.json` (Secrets Underground), `mission17.json` (The Final Experiment) and `mission18.json` (Connecting the Evidence) from `501_CAMPAIGN_01.md`, completing Phase 4 — "Solving the Mystery" (`storyChapter: "CHAPTER-0004"`, `difficulty: "confident"`).

This batch had the two largest Core-activity sets compiled so far, both flagged in advance and handled with the established tuning convention rather than improvised:

- **Mission 15 (The Signal Tower)**: 5 Core activities (6 minutes each = 30), the campaign's second engineering mission after Mission 7.
- **Mission 17 (The Final Experiment)**: 6 Core activities (5 minutes each = 30) — the largest Core set yet, and structurally distinct from every other mission: 501 describes it as having no detailed instructions, so its 6 Core activities directly *are* the steps of the scientific method (define → predict → plan → collect → analyse → reflect) rather than mission-specific tasks. This didn't require any schema change, just recognising the activities themselves as more procedurally-generic than usual.

**First use of the `"rank"` Reward Type** (Mission 17, `"Independent Investigator"`) — 501's own Rewards section lists "Explorer Rank Progress" as a category, and this is the first mission whose Story Outcome is explicitly about the learner's own capability shifting ("confidence shifts from following procedures to designing them") rather than unlocking a place, object or fact — the most rank-appropriate moment so far, not a default choice.

## Manual Testing Performed

- Confirmed all 5 new mission files parse as valid JSON.
- **Global ID uniqueness verified programmatically across all 18 compiled missions to date** (168 total IDs — zero duplicates).
- **Verified Mission 15's and Mission 17's Core activity counts and duration sums programmatically** (5×6=30 and 6×5=30 respectively), not just by eye.
- Served `portal/` locally and drove all five new missions with Playwright: each renders its real title/content; at the default 60-minute session, Missions 14/16/18 each show 5 cards (4 Core + 1 Extension), Mission 15 shows 6 (5 Core + 1 Extension), and Mission 17 shows 7 (6 Core + 1 Extension) — Rabbit Hole correctly excluded in every case, confirming the tuning convention scales to larger Core sets without adjustment.
- Parent Guide leakage check repeated for all five — none found.
- Full regression pass across all 26 routes (21 from before plus the 5 new missions) — all correct, zero `pageerror`s.

## Verification

- Every mission validates. ✅
- References resolve. ✅ (`MISSION-0001`–`0018` all match `campaign.json`'s `missions[]` entries)
- Scheduler metadata exists and behaves correctly, including the two largest Core sets compiled so far. ✅
