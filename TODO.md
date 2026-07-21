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
IN PROGRESS — Missions 1-12 reach production quality (all of Chapters 1-3); 9 missions remain
```

Goal

Improve each mission.

Checklist (per mission)

- [x] Story flow — Missions 1–12
- [ ] Story flow — Missions 13–21

- [x] Curiosity — Missions 1–12
- [ ] Curiosity — Missions 13–21

- [x] Difficulty — Missions 1–12
- [ ] Difficulty — Missions 13–21

- [x] Discovery Log — Missions 1–12
- [ ] Discovery Log — Missions 13–21

- [x] Rabbit Holes — Missions 1–12
- [ ] Rabbit Holes — Missions 13–21

- [x] Reflection — Missions 1–12
- [ ] Reflection — Missions 13–21

- [x] Rewards — Missions 1–12
- [ ] Rewards — Missions 13–21

Deliverable

One mission reaches production quality. ✅ (Missions 1–12)

Repeat for remaining missions.

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

Goal

Complete hidden parent experience.

Features

- Curriculum mapping

- Progress dashboard

- Assessment evidence

- Suggested interventions

- Extension ideas

---

# Phase 9 — Visual Assets

Goal

Generate visuals.

Includes

- Maps

- Character art

- Icons

- Diagrams

- Story scenes

- Badges

- Rank graphics

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

**Phase 5 (Asset Compiler) is complete for all 21 missions.** Phase 6 (Mission Polish) is now underway: **Missions 1–12 have reached production quality**, covering all of Chapters 1–3. Beats, Core activity storyContext/instructions, and reflection prompts were rewritten for stronger story flow and curiosity, grounded in each mission's canonical Story Summary, with no new plot facts invented — Mission 4 (Dr. Quinn's name first appears), Mission 8 (her first recorded voice) and Mission 11 (the Cliffhanger now echoes Mission 8's "deliberately" language) got particular narrative care. Two missions required protecting already-published generated assets from contradiction: Mission 10's experiment activity (`ACTIVITY-0058`) was left byte-for-byte untouched to match `generated/resources/experiments.json`'s "Finding the Blockage" entry, and Mission 12's "Measure Angles" activity was kept consistent with its existing star-chart image spec and printable. Extension/Rabbit Hole activities were reviewed but left unchanged where already appropriately open-ended. All twelve missions verified against `mission-engine.js`'s actual validation rules and rendered end-to-end in a headless browser with no console errors and no Parent Guide leakage (ADR-006). The platform still doesn't render `beats` to the learner yet (confirmed by reading `activity-engine.js`/`router.js`) — polished anyway since load-bearing in the mission template design, but no unrendered optional Activity fields (`hints`, `resources`, `parentNotes`) were added. Awaiting user direction on which mission(s) to polish next.