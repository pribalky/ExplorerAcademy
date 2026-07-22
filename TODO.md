# TODO.md

# Explorer Academy — Implementation Roadmap

**Status:** Active

This document tracks the implementation of Explorer Academy from architecture through production.

It is the authoritative implementation checklist for both humans and AI contributors.

---

# Current Project Status

## Foundation

- [x] Project Manifest
- [x] README
- [x] Project Context
- [x] Documentation Index
- [x] Dependency Graph
- [x] Generation Roadmap
- [x] Design Decision Log
- [x] AI Contributing Guide
- [x] Kickoff Prompt
- [x] Changelog

---

## Architecture

- [x] Platform Architecture
- [x] Campaign Template
- [x] Mission Template
- [x] Campaign 01
- [x] HTML Architecture
- [x] Campaign Content Specification
- [x] Data Model
- [x] JSON Schema

---

# Phase 1 — Platform Bootstrap

Status

```
COMPLETE
```

Goal

Create the complete browser application skeleton.

Expected Output

```
Working repository structure

HTML shell

CSS architecture

JavaScript architecture

Placeholder pages

Empty campaign loader

No application logic
```

Milestones

- [x] Repository structure

- [x] HTML shell

- [x] CSS structure

- [x] JavaScript modules

- [x] Empty campaign folders

- [x] JSON placeholders

Deliverable

```
The application opens successfully.

Navigation exists.

No functionality yet.
```

---

# Phase 2 — Core Platform

Status

```
COMPLETE
```

Goal

Build the Explorer Academy engine.

Milestones

- [x] Router

- [x] Campaign Loader

- [x] Mission Engine

- [x] Activity Renderer

- [x] Scheduler

- [x] Save State

- [x] Discovery Log

- [x] Reward Engine

Deliverable

```
Platform can load and render placeholder missions.
```

---

# Phase 3 — Campaign Compiler

Status

```
COMPLETE
```

Goal

Convert Campaign 01 documentation into structured JSON.

Compiler

```
Campaign Compiler
```

Input

```
501_CAMPAIGN_01.md

503_DATA_MODEL.md

504_JSON_SCHEMA.md
```

Output

```
portal/

campaigns/

campaign01/

src/

campaign.json
```

Success Criteria

- Valid JSON

- Schema compliant

- No duplicated information

---

# Phase 4 — Mission Compiler

Status

```
COMPLETE — all 21 missions compiled
```

Goal

Convert every mission into independent JSON.

Compiler

```
Mission Compiler
```

Input

```
Campaign document

Mission specification

Data model
```

Output

```
portal/

campaigns/

campaign01/

src/

missions/

mission01.json

...

mission21.json
```

Success Criteria

- Every mission validates

- References resolve

- Scheduler metadata exists

---

# Phase 5 — Asset Compiler

Status

```
COMPLETE — World Bible Compiler (src/world/ + src/parent/) and Asset Compiler (all 4 batches, Missions 1–21: workbook pages, parent enrichment, image specifications, experiments.json) both fully populated across the whole campaign
```

Goal

Generate supporting assets.

Compiler

```
Asset Compiler
```

Input

```
Campaign JSON

Mission JSON
```

Output

```
generated/

workbook/

parent/

resources/

image-specifications/
```

Produces

- Workbook pages

- Parent guides

- Experiments

- Reflection prompts

- Reading lists

- Image specifications

- Vocabulary

- Discussion prompts

---

# Phase 6 — Mission Polish

Status

```
COMPLETE — all 21 missions reach production quality
```

Goal

Improve each mission.

Checklist (per mission)

- [x] Story flow — Missions 1–21

- [x] Curiosity — Missions 1–21

- [x] Difficulty — Missions 1–21

- [x] Discovery Log — Missions 1–21

- [x] Rabbit Holes — Missions 1–21

- [x] Reflection — Missions 1–21

- [x] Rewards — Missions 1–21

Deliverable

One mission reaches production quality. ✅

Repeat for remaining missions. ✅ (all 21 complete)

---

# Phase 7 — Workbook

Goal

Produce printable workbook.

Deliverables

- Printable PDF

- Notebook alternatives

- Answer guide

- Parent guide

---

# Phase 8 — Parent Mode

Status

```
COMPLETE — portal/js/parent-mode.js implements all five features below, wired to portal/parent/index.html as a standalone page never linked from the learner shell
```

Goal

Complete hidden parent experience.

Features

- [x] Curriculum mapping — rendered from src/parent/curriculum-mapping.json

- [x] Progress dashboard — derived from earned rewards + Discovery Log entries (no new storage field needed)

- [x] Assessment evidence — each mission's parentGuide.assessment paired with the Explorer's own recorded Discovery Log entries for that mission

- [x] Suggested interventions — generated/parent/enrichment's expectedMisconceptions, where available

- [x] Extension ideas — enrichment's stretchQuestions plus each mission's embedded Extension activity

---

# Phase 9 — Visual Assets

Status

```
COMPLETE (as flat-vector SVG placeholder art) — all 24 images.json specs and all 10 badge/rank/knowledgeCore reward icons have a generated SVG; see generated/images/STYLE_GUIDE.md for the documented limitation and swap-out path if real illustration becomes available later
```

Goal

Generate visuals.

Includes

- [x] Maps — the 5 diagram specs (sketch map, water system, star chart, geological sketch, investigation board)

- [ ] Character art — not attempted; would need real illustration, not a diagram-style stand-in (see STYLE_GUIDE.md)

- [x] Icons — 10 badge/rank/knowledgeCore reward icons

- [x] Diagrams — same 5 as Maps above

- [x] Story scenes — 19 scenes, as flat-vector SVG stand-ins (no image-generation tool available in this environment)

- [x] Badges — 3 badge icons

- [x] Rank graphics — 3 escalating rank-tier icons

---

# Phase 10 — Testing

Checklist

- [ ] Desktop

- [ ] Tablet

- [ ] Mobile

- [ ] Offline

- [ ] Accessibility

- [ ] Broken links

- [ ] Save State

- [ ] Parent Mode

---

# Phase 11 — Campaign Release

Checklist

- [ ] Campaign complete

- [ ] Workbook complete

- [ ] Parent Mode complete

- [ ] Assets complete

- [ ] Documentation updated

---

# AI Workflow

Every implementation task should follow:

```
Read Documentation

↓

Analyse

↓

Plan

↓

Identify Files

↓

Implement

↓

Verify

↓

Summarise

↓

Stop
```

Never implement multiple milestones simultaneously.

---

# Compiler Workflow

```
Campaign 01.md

↓

Campaign Compiler

↓

campaign.json

↓

Mission Compiler

↓

mission01.json

↓

...

↓

mission21.json

↓

Asset Compiler

↓

Workbook

↓

Parent Guides

↓

Resources

↓

Image Specifications
```

Every compiler must validate against

```
503_DATA_MODEL.md

504_JSON_SCHEMA.md
```

before producing output.

---

# Definition of Done

The project is complete when:

- The platform runs entirely offline.
- Campaigns are data-driven.
- New campaigns require no platform code changes.
- Curriculum remains hidden from the learner.
- Parent Mode provides full traceability.
- Workbook is optional.
- A child can independently complete a campaign with minimal adult assistance.

---

# Current Next Action

**Phases 5, 6, 8 and 9 are all complete.** Phase 8 (Parent Mode) replaced `parent-mode.js`'s empty placeholder with a real implementation, wired up to the already-existing `portal/parent/index.html` static entry point (never linked from the learner shell, per `router.js`'s own documented architecture and ADR-006). It covers all five TODO.md features by reusing content already generated in Phases 4/5 — no new content authored. The standout feature is Assessment Evidence: each mission's parent guidance is paired with the Explorer's own actual recorded Discovery Log entries, verified end-to-end (completed a reflection in the learner shell, confirmed it appeared in Parent Mode). "Verify parent access" is a session-only confirmation click rather than a PIN, since no such field exists in the save schema — documented as an explicit, revisitable choice. Found and fixed a real path-resolution bug along the way (`portal/parent/index.html` sits one directory deeper than the learner shell assumes) via a single `<base href="../">` tag rather than touching shared loader modules. Phase 9 (Visual Assets) generated a real, renderable SVG asset for all 24 `images.json` specs plus 10 badge/rank/knowledgeCore reward icons — but only after flagging to the user that no image-generation tool is available in this environment, so the 19 specs written as "warm, painterly illustration" can't be produced as genuine illustrations. The user chose flat-vector SVG for everything, in one consistent style (`generated/images/STYLE_GUIDE.md`), over skipping the scene specs entirely. Mission 1's and Mission 21's scene SVGs deliberately mirror each other's composition. Unlock and story rewards were deliberately left without bespoke icons (they're access/narrative flags, not collectible badges). All 34 SVGs validated as well-formed XML and spot-checked visually via headless-Chromium screenshots. Noted but did not fix: no compiled Knowledge Core catalog exists in `src/` despite 504_JSON_SCHEMA.md requiring `description`/`icon` fields on that entity — a data-model gap, not a visual-asset one. Awaiting user direction on the next phase — candidates are Phase 7 (Workbook) or Phase 10 (Testing).