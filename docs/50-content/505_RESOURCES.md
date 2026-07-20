# 505_RESOURCES.md

> **Document:** Campaign 01 Resource Catalogue
>
> **Campaign:** Campaign 01 — Outpost Echo (Explorer Academy)
>
> **Version:** 1.0
>
> **Audience:** Campaign Authors, Asset Compiler, Parent Guide Compiler

---

# Purpose

This document defines every reusable learning resource used throughout Campaign 01.

It is the canonical source for:

- Websites
- Videos
- Books
- Experiments
- Printable references
- Rabbit Holes
- Vocabulary
- Offline alternatives

The Asset Compiler consumes this document to generate:

- resources.json
- bibliography.json
- experiments.json
- links.json

No implementation details belong here.

---

# Resource Design Principles

Resources should:

- Create curiosity before explanation.
- Be free whenever possible.
- Remain available long-term.
- Require minimal parental support.
- Encourage exploration rather than passive consumption.
- Provide an offline alternative whenever practical.

---

# Resource Categories

## Reading

For each resource specify:

- ID
- Title
- Author/Provider
- Reading Level
- Estimated Time
- Purpose
- Mission(s)
- Core/Extension/Rabbit Hole
- Offline Alternative

### Initial Reading List

#### BBC Bitesize Science

Purpose

Curriculum reinforcement across investigation, engineering, materials and Earth science — the campaign's primary curriculum-bridging resource (England and Scotland).

Used In

Missions 1–21

---

#### Oak National Academy

Purpose

Free, curriculum-aligned lessons and resources supporting the scientific method, engineering design and data-handling skills used throughout the campaign.

Used In

Missions 1–21

---

#### The Royal Institution

Purpose

Investigation-led science content matching the campaign's "evidence before conclusions" philosophy — strong fit for the experiment-heavy missions.

Used In

Missions 7, 10, 11, 17

---

#### DK Find Out!

Purpose

General science reference reading — classification, materials, Earth science, electricity.

Used In

Missions 5, 9, 11, 16

---

#### National Geographic Kids

Purpose

Curiosity and visuals across natural science and exploration topics.

Used In

Missions 5, 9, 16

---

#### Met Office (Weather education resources)

Purpose

Real-world weather data and forecasting explained for children — direct tie-in to the weather-observation mission.

Used In

Mission 6

---

#### British Geological Survey (Discovering Geology)

Purpose

Child-accessible rock and landscape reference material.

Used In

Mission 16

---

#### NASA Space Place

Purpose

Child-friendly astronomy articles — scoped to the campaign's one astronomy mission, not a campaign-wide resource.

Used In

Mission 12 only

---

## Videos

Preferred sources:

- BBC
- The Royal Institution
- SciShow Kids
- Oak National Academy

NASA/ESA video content may be used specifically for Mission 12 (astronomy), not as a default source.

Maximum duration:

15 minutes

---

## Interactive Websites

Preferred:

- PhET (simulations — circuits for Mission 11, forces for Mission 7)
- GeoGebra (geometry/angles — Mission 3, Mission 12)
- Scratch (creative/coding Rabbit Holes)

Scoped to Mission 12 only:

- Stellarium Web
- NASA Eyes

---

## Books

### Fiction

Include:

- **Explorer Academy: The Nebula Secret** (Trudi Trueit, National Geographic Kids) — a real published series sharing the campaign's own "Explorer Academy" concept; a natural, well-fitting tie-in.
- **Max Einstein: The Genius Experiment** (Albert Einstein Foundation / James Patterson) — a science club solving real-world problems through evidence and invention.
- **The London Eye Mystery** (Siobhan Dowd) — investigation and logical deduction from evidence, matching the campaign's mystery-solving core.
- **The Explorer** (Katherine Rundell) — survival, observation and resourcefulness in an unfamiliar environment.
- **The Wild Robot** (Peter Brown) — a resourceful, learning AI protagonist, echoing Atlas's role in the campaign.

---

### Non-fiction

Include:

- DK "How It Works: Science"
- Usborne "See Inside Science"
- National Geographic Kids Almanac

---

## Experiments

Every experiment must include:

- Objective
- Household Materials
- Preparation Time
- Difficulty
- Supervision Level
- Scientific Explanation
- Linked Missions

Only use common household items.

Primary experiment-driven missions: 7 (The Broken Bridge), 10 (Water Under Pressure), 11 (The Energy Problem), 17 (The Final Experiment).

---

## Vocabulary

Each mission should introduce:

5–10 words.

For each:

- Definition
- Child-friendly explanation
- Example
- Related Missions

---

## Rabbit Holes

Each Rabbit Hole should include:

- Curiosity Question
- Suggested Reading
- Suggested Video
- Real-world Connection
- Estimated Exploration Time

Rabbit Holes must never block mission completion.

Every mission already defines one Rabbit Hole activity (`src/missions/mission01.json`–`mission21.json`) — this catalogue should enrich those, not duplicate or contradict them.

---

## Printable Resources

Track all optional printables.

For each:

- Purpose
- Mission
- Alternative using blank sketchbook

Printing must never be mandatory.

---

## Image References

List every image required.

Include:

- Mission
- Description
- Purpose
- Suggested Style

Actual image generation is handled separately. Character and location imagery should be grounded in `src/world/characters.json` and `src/world/locations.json` once compiled (Director Orion, Atlas, Dr. Elara Quinn, Outpost Echo and its named areas), not generic or space-themed imagery.

---

## External Resource Validation

Every external resource should satisfy:

- Free
- Educational
- Child Appropriate
- Stable
- No account required (preferred)

---

## Maintenance

Review links annually.

Replace unavailable resources.

Keep alternatives available.

---

# Canonical Principle

Resources enrich learning.

They should never become mandatory for completing a mission.
