# CURRENT_TASK

## Phase

4 – Mission Compiler

## Milestone

Mission Compiler (Missions 14–18, Phase 4 — Solving the Mystery)

## Objective

Compile the next batch — Missions 14–18 (The Missing Notebook, The Signal Tower, Secrets Underground, The Final Experiment, Connecting the Evidence), which 501's own Narrative Progression groups as "Phase 4 — Solving the Mystery" — following the pattern in `prompts/MISSION_COMPILER.md`.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` (Missions 14–18 source content — already read in full this session)
- `portal/campaigns/campaign01/src/missions/mission01.json`–`mission13.json` (pattern + next available IDs: activities continue from `ACTIVITY-0081`, rewards from `REWARD-0014`, parent guides from `PARENTGUIDE-0014`)
- `prompts/MISSION_COMPILER.md`

## Relevant Documentation

Same as prior mission-compiling milestones. `storyChapter` for Missions 14–18 should be `CHAPTER-0004` ("Phase 4 — Solving the Mystery"), `difficulty` should be `"confident"`, continuing the 1:1 phase-to-stage mapping.

## Files Expected to Change

- `portal/campaigns/campaign01/src/missions/mission14.json`–`mission18.json`

## Implementation Plan

Same process as every batch so far. Mission 17 (The Final Experiment) is explicitly described in 501 as having "no detailed instructions" and requiring the learner to design their own fair test — the first mission where the Core activities themselves *are* the scientific method (define/predict/plan/collect/analyse/reflect), worth a slightly closer look, though still expected to fit the existing schema without changes. Mission 15 (The Signal Tower) is the campaign's second engineering mission (like Mission 7) and may also have more than 4 Core activities.

## Out of Scope

Same as previous mission-compiling milestones.

## Success Criteria

Same as previous mission-compiling milestones, applied to Missions 14–18.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

`mission14.json`–`mission18.json`.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Missions 9–13) — COMPLETE

## Completion Summary

Compiled `mission09.json` (Mystery Samples), `mission10.json` (Water Under Pressure), `mission11.json` (The Energy Problem), `mission12.json` (Star Maps) and `mission13.json` (Hidden Patterns) from `501_CAMPAIGN_01.md`, completing Phase 3 — "Building Scientific Confidence" (`storyChapter: "CHAPTER-0003"`, `difficulty: "independent"`, continuing the phase-to-stage mapping established in the Missions 5–8 batch).

All 5 missions in this batch have exactly 4 Core activities (back to the standard shape after Mission 7's 5-activity outlier), so duration tuning followed the original convention unchanged.

Reward types continued to be chosen per-mission rather than defaulted: Missions 9–11 all use `"unlock"` since their Story Outcomes are literally about gaining access to something (laboratory records, additional laboratories, expedition archives) — the same reasoning already applied to Missions 6–7. Missions 12 and 13 are the first to use `"knowledgeCore"` since Mission 3, chosen because their Story Outcomes are about a conceptual/scientific-understanding breakthrough (discovering the expedition's wider objectives; recognising that separate investigations are connected) rather than unlocking a place or object.

## Manual Testing Performed

- Confirmed all 5 new mission files parse as valid JSON.
- **Global ID uniqueness verified programmatically across all 13 compiled missions to date** (119 total IDs — mission/activity/reward/parentGuide — zero duplicates).
- Served `portal/` locally and drove all five new missions with Playwright: each renders its real title/content; at the default 60-minute session, all five correctly show exactly 5 activity cards (4 Core + 1 Extension), Rabbit Hole excluded in every case.
- Parent Guide leakage check repeated for all five — none found.
- Full regression pass across all 21 routes (16 from before plus the 5 new missions) — all correct, zero `pageerror`s.

## Verification

- Every mission validates. ✅
- References resolve. ✅ (`MISSION-0001`–`0013` all match `campaign.json`'s `missions[]` entries)
- Scheduler metadata exists and behaves correctly. ✅
