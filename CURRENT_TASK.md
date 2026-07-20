# CURRENT_TASK

## Phase

3 – Campaign Compiler

## Milestone

Campaign Compiler

## Objective

Convert `docs/50-content/501_CAMPAIGN_01.md` (the authored Campaign 1 narrative/design document) into the structured `campaign.json` that `campaign-loader.js` already knows how to load and validate — replacing the current schema-valid-but-placeholder `campaign.json` with real, authored campaign metadata.

## Inputs

- `docs/50-content/501_CAMPAIGN_01.md` (source content — not yet read this session)
- `docs/50-content/503_DATA_MODEL.md`, `docs/50-content/504_JSON_SCHEMA.md` (target schema, including this session's extension notes)
- `portal/campaigns/campaign01/src/campaign.json` (current placeholder to replace)
- `portal/js/campaign-loader.js` (existing validation the compiler's output must satisfy)

## Relevant Documentation

- `docs/00-foundation/007_AI_CONTRIBUTING_GUIDE.md`
- `prompts/CAMPAIGN_COMPILER.md` (a compiler prompt already exists in the repo — read this first, it may define the intended process before any code/prompt-running approach is chosen)

## Files Expected to Change

- `portal/campaigns/campaign01/src/campaign.json` (replaced with compiled, authored content)
- Possibly a compiler script/tool, depending on what `prompts/CAMPAIGN_COMPILER.md` turns out to specify

## Implementation Plan

Not started — needs `501_CAMPAIGN_01.md` and `prompts/CAMPAIGN_COMPILER.md` read first; this is a different kind of milestone from Phase 2 (content compilation, not platform engineering) and may need its own scoping conversation before implementation starts.

## Out of Scope

TBD — depends on what Phase 3 turns out to require after reading the compiler prompt and source content.

## Success Criteria

- Valid JSON (per `campaign-loader.js`'s existing validation)
- Schema compliant
- No duplicated information (per TODO.md's stated Phase 3 success criteria)

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

TBD.

## Completion Notes

Not yet started.

---

# Previous Milestone — Reward Engine — COMPLETE (Phase 2 now fully complete)

## Completion Summary

Built `portal/js/reward-engine.js` and extended `storage.js`'s save shape with an `earnedRewards` array (additive, no version bump — same pattern as `discoveryLog`). Wired reward evaluation into the reflection-save flow already built in the Discovery Log milestone, and gave `/profile` real content (an Achievements list) instead of its placeholder.

Key decisions:

- **Rewards are evaluated once per mission, not once per reflection submission.** `evaluateMissionRewards()` checks `earnedRewards` for an existing entry with the same `missionId` before persisting anything — confirmed by test: submitting a second reflection for the same mission did not duplicate the reward. This matters because a mission can have multiple reflection prompts (only one exists today), and rewards shouldn't multiply per-prompt.
- **No `unlockCondition` field exists anywhere in the Reward schema** (`504_JSON_SCHEMA.md` only requires `id`/`type`/`value`) to drive a finer-grained trigger, so "a reflection was just completed for this mission" is used as the simplest data-consistent signal that the mission session is done. This is a real simplification, called out explicitly in the code comment rather than left implicit — a future milestone might need a real per-reward unlock condition once campaign content gets more sophisticated than one reflection prompt.
- **This is acknowledgement, not scoring** — per ADR-007 (Curiosity Before Completion), there's no points/ranking logic, just a "Reward earned: ..." message and a persisted record.
- **`/profile` only shows earned rewards (Achievements)** — everything else `601_HTML_ARCHITECTURE.md`'s Explorer Profile page describes (name, avatar, completed campaigns, exploration statistics) has no backing module yet (no Explorer Profile entity/module exists), so it isn't rendered rather than being faked.

This closes out **every milestone in Phase 2 — Core Platform**. TODO.md's own Phase 2 deliverable — "Platform can load and render placeholder missions" — is met: the platform now loads a campaign, schedules and renders a mission's activities, captures learner reflections, and evaluates/persists rewards, all backed by real (if placeholder) data and surviving a page reload.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright, including a real `page.reload()`:

1. **Fresh `/profile`** — correct empty-state message.
2. **Complete a reflection** — feedback shows both "Saved to your Discovery Log." and "Reward earned: ..."; `localStorage` inspected directly shows the full `earnedRewards` entry with `campaignId`/`missionId`/`earnedAt`.
3. **Submit a second reflection for the same mission** — `earnedRewards.length` stays at 1 (no duplicate).
4. **Reload, then `/profile`** — the earned reward renders under "Achievements" with its value, type and a formatted earned-at timestamp.
5. **Full 9-route regression pass** — all routes still correct.

Zero `pageerror`s across every case.

## Verification

- Completing a mission's reflection evaluates its rewards and persists earned ones via the Storage Manager. ✅
- Earned rewards survive a page reload. ✅
- No campaign-specific reward logic leaks into the platform — the Reward Engine interprets reward definitions generically. ✅
