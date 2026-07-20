# CURRENT_TASK

## Phase

5 – Asset Compiler

## Milestone

Asset Compiler

## Objective

Generate supporting assets for Campaign 01 — workbook pages, parent guides, experiments, reflection prompts, reading lists, image specifications, vocabulary, discussion prompts — from the now-fully-compiled campaign and mission data.

## Inputs

- `portal/campaigns/campaign01/src/campaign.json`, `src/missions/mission01.json`–`mission21.json` (all real, compiled content)
- `docs/50-content/501_CAMPAIGN_01.md` Part 6 (Parent Guide, Curriculum Mapping, Optional Printable Resources, Digital Resources sections — not yet closely read for this purpose)
- `portal/campaigns/campaign01/generated/` (currently empty placeholder folders: `workbook/`, `parent/`, `resources/`, `image-specifications/` — created in Milestone 1.1, never populated)

## Relevant Documentation

Not yet identified — no Asset Compiler prompt exists yet in `prompts/` (unlike Campaign/Mission Compiler, which both had one to read first). Worth checking `docs/00-foundation/005_GENERATION_ROADMAP.md` and confirming whether one needs to be authored before this milestone can start, following the established pattern of reading the compiler prompt first.

## Files Expected to Change

- New files under `portal/campaigns/campaign01/generated/{workbook,parent,resources,image-specifications}/`

## Implementation Plan

Not started. This is a different kind of milestone from Mission Compiler (generating *derived* presentation artefacts from already-compiled source data, per `CLAUDE.md`'s "Never overwrite source content — only generate derived artefacts inside generated/" rule) rather than compiling narrative content — likely needs its own scoping conversation before implementation, same as Campaign Compiler and Mission Compiler both did.

## Out of Scope

TBD.

## Success Criteria

Not yet defined — Phase 5 in `TODO.md` lists the deliverable categories (workbook pages, parent guides, experiments, reflection prompts, reading lists, image specifications, vocabulary, discussion prompts) but no per-category success criteria yet.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

TBD.

## Completion Notes

Not yet started.

---

# Previous Milestone — Mission Compiler (Missions 19–21, final batch) — COMPLETE (Phase 4 now complete)

## Completion Summary

Compiled `mission19.json` (Recover the Archive), `mission20.json` (Explorer Assessment) and `mission21.json` (Graduation Day) from `501_CAMPAIGN_01.md`, completing Phase 5 — "Graduation" (`storyChapter: "CHAPTER-0005"`, `difficulty: "explorer"`) and **all 21 missions of Campaign 01**.

Mission 21 (Graduation Day) required care flagged in advance: its Story Summary explicitly gestures toward Campaign 2 ("Atlas reveals that numerous other expeditions remain active... A final transmission arrives from another research station, quietly introducing the next campaign"). Every beat/activity referencing this stayed strictly within what 501 actually states — no invented station name, campaign title, or mystery details for a campaign that doesn't exist yet.

Reward progression completed its arc across the three "rank"-type rewards: Mission 17 (`"Independent Investigator"`, mid-campaign capability shift) → Mission 20 (`"Explorer Academy Candidate"`, readiness demonstrated) → Mission 21 (`"Certified Explorer"`, the campaign's capstone reward, directly matching 501's own Story Outcome: "Learner becomes a fully recognised Explorer"). Mission 21's reflection prompt is a **direct quote** from 501's own Phase 5 narrative question ("What kind of Explorer have you become?") — the most maximally-grounded prompt in the whole campaign, since 501 states it verbatim rather than requiring synthesis.

## Manual Testing Performed

- Confirmed all 3 final mission files parse as valid JSON.
- **Global ID uniqueness verified programmatically across all 21 missions** (197 total IDs — zero duplicates).
- **Confirmed every one of `campaign.json`'s 21 `missions[]` entries now resolves to a real, compiled mission file** — the concrete, final proof that the whole 21-mission structure declared back in the Campaign Compiler milestone is now backed by real data.
- Served `portal/` locally and drove all three final missions with Playwright: each renders correctly; card counts match each mission's Core+Extension activity count at the default 60-minute session.
- **Ran the full reflection → reward flow on Mission 21 itself** (not just structural checks): submitted the finale's reflection, confirmed it saved to the Discovery Log and correctly earned "Certified Explorer" — the whole learner-facing pipeline (Campaign Loader → Mission Engine → Scheduler → Activity Renderer → Discovery Log → Reward Engine) working end-to-end on the campaign's actual final beat.
- Parent Guide leakage check repeated for all three — none found.
- **Full regression pass across all 29 routes** (6 static/campaign routes + all 21 missions + 2 error cases) — every route correct, zero `pageerror`s.

## Verification

- Every mission validates. ✅ (all 21)
- References resolve. ✅ (`campaign.json`'s `missions[]` — all 21 entries — verified programmatically against the compiled files, not just assumed)
- Scheduler metadata exists and behaves correctly across every mission compiled this phase. ✅

This completes **Phase 4 — Mission Compiler** in full: all 21 missions from `501_CAMPAIGN_01.md` are now real, schema-valid, scheduler-tuned, and rendering correctly through the platform with zero code changes beyond the `parentGuide` validation addition made during Mission 1.
