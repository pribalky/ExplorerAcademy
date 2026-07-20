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

> **Verification note (mission-specific resources added from Mission 1 onward):** every resource below was confirmed to be real via live web search — not generated from language-model recall alone, per this document's own External Resource Validation criteria. Direct page-content fetching was unavailable in the compiling session (blocked by network egress policy for external sites), so verification relies on search-engine-confirmed, indexed URLs from well-established, long-running institutional providers rather than fetched page inspection. Per the Maintenance section below, links should still be spot-checked before print/publish and reviewed annually.

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

### Mission-Specific Reading

#### Recording Observations: Journals and Field Notes (Reading Rockets)

Purpose

Practical guidance on keeping an observation journal and writing field notes — directly supports creating the Explorer Journal and completing the first observation challenge.

Used In

Mission 1 (The Invitation) — Core

Offline Alternative

Print the guidance once; the practice itself (a notebook and a pencil) needs no device or connection.

---

#### Scottish Book Trust — Home Activities Hub

Purpose

Reading comprehension and inference-building support from Scotland's national reading charity, reinforcing the campaign's England/Scotland curriculum-bridging goal (`501_CAMPAIGN_01.md` Curriculum Mapping) — matches distinguishing confirmed facts from reasonable inference.

Used In

Mission 4 (The Silent Logs) — Core

Offline Alternative

The reasoning skill itself (arranging evidence, separating fact from inference) is fully practisable with the printed/notebook mission materials alone.

---

#### Identify Tracks (The Wildlife Trusts)

Purpose

Official UK conservation charity's animal-track identification guide — matches measuring and comparing footprints to determine what made them.

Used In

Mission 5 (Strange Footprints) — Core

Offline Alternative

A printed or hand-drawn track comparison chart achieves the same classification skill.

---

#### Learning Resources (Bletchley Park)

Purpose

Downloadable, printable codebreaking activities from the UK's official WWII codebreaking heritage site — direct match for decoding a damaged transmission using patterns and context clues.

Used In

Mission 8 (Message in the Static) — Core

Offline Alternative

The printable activities are themselves the offline alternative — no device required once downloaded.

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

### Mission-Specific Interactive Websites

#### Ordnance Survey Mapzone

Purpose

Official UK national mapping agency's map-skills resource — matches exploring the station map and producing a sketch map.

Used In

Mission 2 (Arrival at Outpost Echo) — Core

Offline Alternative

The mission's own sketch-map activity is paper-based; Mapzone only enriches understanding of map symbols/conventions beforehand.

---

#### Estimation180.com

Purpose

Free daily estimation challenges (teacher-created, running since 2012) — direct match for estimating an object's size before measuring it.

Used In

Mission 3 (Explorer's Toolkit) — Core

Offline Alternative

Estimating and then measuring household objects achieves the same skill without the website.

---

#### PBS KIDS Design Squad — Build a Bridge

Purpose

Free bridge-design-and-test activity from PBS's engineering series for children — direct match for planning, building and refining a bridge prototype.

Used In

Mission 7 (The Broken Bridge) — Core

Offline Alternative

The mission's own prototype-building activity (card, straws, tape) is already the hands-on/offline version; the site only adds an additional worked example.

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
