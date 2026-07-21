# CURRENT_TASK

## Phase

5 – Asset Compiler

## Milestone

Draft the Workbook Compiler prompt (notebook-first philosophy)

## Objective

Before generating any workbook/asset content, update `prompts/ASSET_COMPILER.md` (or draft a leaner `WORKBOOK_COMPILER.md`) to encode the user's stated philosophy: everything should be doable in a plain notebook; printables are optional extras, never required; keep specifications minimal. The current `ASSET_COMPILER.md` treats workbook pages and printables as fairly central, which doesn't match this — same reconciliation pattern used for every other prompt this session before it was executed.

## Inputs

- `prompts/ASSET_COMPILER.md` (current prompt to revise)
- User's stated philosophy (this conversation): notebook-first, prints optional/extension-only, minimal specs
- Confirmed decisions from this conversation:
  - Overlaps should be **enriched, never duplicated**: `parentGuide.discussionPoints` gets genuinely new fields (misconceptions, stretch questions, supervision time), not restated; Discovery Log prompts stay as-is (platform only captures `entryType: "reflection"` — no UI for other types yet, so don't generate content nothing can use); the one embedded Extension activity per mission is not multiplied; reading recommendations are already done (`505_RESOURCES.md`) and should be referenced, not redone.
- Now-populated `portal/campaigns/campaign01/src/world/` and `src/parent/` (World Bible, Characters, Locations, Timeline, Curriculum Mapping, Orientation) — real named entities the workbook/image content can now reference instead of generic descriptions.

## Relevant Documentation

`prompts/CAMPAIGN_COMPILER.md`, `prompts/MISSION_COMPILER.md`, `prompts/WORLD_BIBLE_COMPILER.md`, `prompts/MISSION_RESOURCE_CURATOR.md` — all four already establish the pattern of documenting a reconciliation note directly in the prompt file rather than just deciding silently.

## Files Expected to Change

- `prompts/ASSET_COMPILER.md` (revised) or a new `prompts/WORKBOOK_COMPILER.md`

## Implementation Plan

Draft the revised/new prompt, present it for review, then execute in batches (by mission, similar to Mission Compiler/Resource Curator pacing) only after approval — not before, per the user's explicit "ask clarifying questions... before you begin."

## Out of Scope

Generating any actual workbook/parent/image-specification content — that's the next milestone after this prompt is approved.

## Success Criteria

A prompt that a future compiler run (this session or a later one) can follow without re-deriving the notebook-first philosophy or the overlap-handling decisions from scratch.

## Manual Verification

N/A — this milestone produces a prompt document, not runtime-verifiable content.

## Deliverables

Revised/new compiler prompt.

## Completion Notes

Not yet started.

---

# Previous Milestone — World Bible Compiler (Phase A + B) — COMPLETE

## Completion Summary

Ran `prompts/WORLD_BIBLE_COMPILER.md` in full — both phases, since the content involved (World Bible, 4 Characters, 9 Locations, 4 Timeline events, 6 Curriculum Mapping entities, campaign-level parent orientation) was small enough not to need the multi-session batching Mission Compiler required.

- **`src/world/world-bible.json`** — resolves `campaign.json`'s `worldBibleId` reference (was present-but-unresolved since the Campaign Loader milestone); references the other three world files by ID.
- **`src/world/characters.json`** — Director Orion, Atlas, Dr. Elara Quinn, the Original Expedition Team (collectively). The Learner deliberately excluded, per 501's own "no predefined appearance, gender or personality is imposed." Each `image` field holds a placeholder reference string (e.g. `"CHARACTER-0001-portrait"`) for a future Asset Compiler pass to fill in — kept the two compilers' responsibilities separate, as planned.
- **`src/world/locations.json`** — 9 locations, none invented: extracted by grepping every one of the 21 missions' `storyContext` fields for places actually mentioned (Outpost Echo, the laboratory, the communications terminal/array, the Signal Tower, the storage facility, the underground geological survey area, the observatory, the weather station, Explorer Academy Headquarters).
- **`src/world/timeline.json`** — 4 events, directly from 501's own 4-Act Story Arc, no new plot beats invented.
- **`src/parent/curriculum-mapping.json`** — 6 entities (one per subject: Reading, Writing, Mathematics, Science, Engineering & Design, Cross-Curricular Skills), compiled directly from 501 Part 6's already-structured coverage text. Per the compiler prompt's own guidance, defaulted to one entity per subject (`curriculum: "england"`) rather than duplicating identical content across `england`/`scotland` rows, since 501 never actually differentiates them — this simplification is recorded here since JSON has no native comment syntax to note it inline.
- **`src/parent/orientation.json`** — campaign-level parent content (Welcome, Mission Control role, session-length table, materials lists, Supporting Your Child guidance, Assessment Philosophy), distinct from the per-mission `parentGuide`s already embedded in each mission file.

## Manual Testing Performed

- All 6 new files confirmed valid JSON.
- **Global ID uniqueness verified programmatically against every ID already used across `campaign.json` and all 21 missions** (25 new IDs, zero duplicates, zero unexpected collisions).
- **Confirmed `campaign.json`'s `worldBibleId` now resolves to a real object** with a matching ID — the specific proof point this compiler existed to deliver.
- No browser/regression testing performed this milestone: these files aren't read by any existing platform code path (`campaign-loader.js` doesn't fetch `src/world/` or `src/parent/`), so there was nothing to regress — confirmed by inspection rather than by running an unnecessary test.

## Verification

- Every new file is valid JSON. ✅
- No ID collides with any ID already used in `campaign.json` or `mission01.json`–`mission21.json`. ✅
- `campaign.json`'s `worldBibleId` now resolves to a real object with a matching ID. ✅
- Zero platform code changes required (source compilation only). ✅
