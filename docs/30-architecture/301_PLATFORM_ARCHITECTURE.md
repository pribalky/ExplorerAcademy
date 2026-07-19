# 301_PLATFORM_ARCHITECTURE.md

> **Document:** Platform Architecture
>
> **Document ID:** 301
>
> **Version:** 1.0.0
>
> **Status:** Draft
>
> **Owner:** Project Architect
>
> **Audience:** Human + AI Contributors
>
> **Last Updated:** 2026-07-19

---

# Purpose

This document defines the architecture of the Explorer Academy platform.

It describes the major platform components, their responsibilities and how they interact.

This document intentionally avoids implementation details.

Technology choices may evolve.

The architecture should remain stable.

---

# Platform Vision

Explorer Academy is a reusable learning platform.

The platform is a reusable learning engine that renders educational experiences from structured campaign data. 

Campaigns are portable content packages that can be created, versioned and shared independently of the platform implementation.

The objective is that new campaigns can be created without modifying platform code.

---

# Design Principles

The platform must be:

- Adventure-first
- Offline-first
- Child-first
- Parent-light
- Content-driven
- Extensible
- Accessible
- Fast
- Self-contained

---

# Primary Users

## Explorer

The child completing missions.

Visible experience only.

Never exposed to curriculum.

---

## Mission Control

Parent mode.

Planning.

Progress.

Curriculum.

Printing.

Settings.

Invisible to Explorer.

---

## Campaign Author

Creates campaigns using reusable templates.

Never modifies platform behaviour.

---

# Platform Layers

```
Explorer Academy

        │

Presentation Layer

        │

Application Layer

        │

Content Layer

        │

Persistence Layer

```

---

# Presentation Layer

Responsible for everything the learner sees.

Includes

- Home
- Missions
- Story
- Discovery Log
- Rewards
- Campaign Map
- Settings

Contains no curriculum knowledge.

---

# Application Layer

Responsible for behaviour.

Examples

- Mission progression
- Unlocking
- Save state
- Scheduling
- Reward calculation
- Time adaptation
- Navigation

No campaign-specific logic should exist here.

---

# Content Layer

Contains campaign data only.

Examples

Campaign

↓

Mission

↓

Activity

↓

Resources

↓

Rabbit Holes

↓

Curriculum Mapping

Campaigns should be data files.

The engine renders them.

---
---

# Data-Driven Architecture

Explorer Academy follows a **data-driven architecture**.

The platform contains generic rendering and orchestration logic.

Educational content is defined as structured data.

The platform interprets this data rather than containing campaign-specific behaviour.

This separation enables new campaigns to be created without modifying platform code.

---

## Platform vs Content

The platform owns behaviour.

Campaigns own content.

### Platform Responsibilities

- Navigation
- Rendering
- Scheduling
- Progress tracking
- Save/load
- Reward calculation
- Time adaptation
- Parent Mode
- Discovery Log

### Campaign Responsibilities

- Story
- Characters
- Missions
- Activities
- Resources
- Rabbit Holes
- Learning objectives
- Curriculum mapping
- Workbook pages

The platform should never contain campaign-specific logic.

---

## Everything Is Data

The following should be represented as structured data rather than hardcoded behaviour wherever practical.

- Campaign metadata
- Story chapters
- Mission definitions
- Activity definitions
- Activity sequencing
- Rewards
- Explorer ranks
- Knowledge Cores
- Rabbit Holes
- Curriculum mappings
- Parent guidance
- Printable resources
- Daily scheduling rules
- Progress requirements

This allows new educational experiences to be authored with minimal engineering effort.

---

## Rendering Model

The platform behaves as a rendering engine.

```
Campaign Data
        ↓
Mission Data
        ↓
Activity Data
        ↓
Platform Engine
        ↓
Explorer Experience
```

The learner interacts only with the rendered experience.

They never interact directly with curriculum or internal data structures.

---

## Benefits

A data-driven approach provides several advantages.

- New campaigns become content projects rather than software projects.
- Story changes rarely require code changes.
- Educational content can evolve independently of the platform.
- Campaign authors can focus on learning design.
- Platform code remains small, generic and maintainable.
- Future AI contributors can generate campaigns without modifying the engine.

---

## Future Considerations

The initial implementation may use JSON files for simplicity.

The architecture should remain compatible with future storage formats, such as YAML, Markdown with front matter, databases or APIs, without changing the overall platform design.

---

# Persistence Layer

Responsible for saving progress.

Stores

- Completed missions
- Explorer rank
- Knowledge cores
- Discovery log
- Notes
- Parent settings
- Time preference
- Workbook progress

Implementation should support Local Storage initially.

---

# Platform Modules

## Home

Landing page.

Responsibilities

- Resume adventure
- Select campaign
- Continue mission
- View explorer rank

---

## Campaign Manager

Responsible for

- loading campaigns
- validating campaign files
- campaign metadata
- campaign progress

---

## Mission Engine

Loads a mission.

Schedules activities.

Tracks completion.

Calculates rewards.

Determines next mission.

This is the heart of Explorer Academy.

---

## Story Engine

Displays

- narrative
- dialogue
- discoveries
- clues
- images

Should support future branching stories.

---

## Activity Engine

Responsible for rendering activities.

Examples

- Reading
- Writing
- Maths
- Science
- Observation
- Experiment
- Sketching
- Reflection

New activity types should require configuration rather than engine changes.

---

## Scheduler

One of the most important modules.

Input

```
Available Time

↓

Mandatory Activities

↓

Optional Activities

↓

Rabbit Holes
```

Output

A personalised mission for today.

Mission learning objectives must always remain intact.

---

## Reward Engine

Responsible for

- Explorer Rank
- Knowledge Cores
- Discoveries
- Unlockables

Should remain independent of campaign content.

---

## Discovery Log

Explorer journal.

Stores

- sketches
- notes
- observations
- hypotheses
- reflections

Should remain available across campaigns.

---

## Parent Mode

Hidden area.

Contains

- curriculum mapping
- campaign overview
- progress
- printing
- settings
- time selection
- learning analytics

Never visible during learner experience.

---

# Campaign Structure

Every campaign contains

```
Campaign

    Story

        Missions

            Activities

                Resources

                Rewards

                Rabbit Holes
```

---

# Mission Structure

Every mission consists of

- Introduction
- Story
- Objectives
- Core Activities
- Extension Activities
- Rabbit Holes
- Reflection
- Mission Complete

---

# Activity Types

Supported activity categories

- Reading
- Writing
- Mathematics
- Science
- Engineering
- Observation
- Investigation
- Drawing
- Discussion
- Reflection
- Outdoor Challenge
- Experiment
- Build Challenge

New activity types should be plug-in additions.

---

# Adaptive Time Model

Every activity is classified as

Core

Extension

Rabbit Hole

Daily schedule

```
Available Time

↓

Select Core

↓

Add Extension

↓

Offer Rabbit Hole

↓

Mission Complete
```

Core activities are never removed.

Rabbit Holes are never required.

---

# Progression Model

Progress is tracked independently at multiple levels.

```
Campaign

↓

Mission

↓

Activity

↓

Explorer

```

This enables replay and future campaign support.

---

# Navigation Model

Explorer

```
Home

↓

Campaign

↓

Mission

↓

Activity

↓

Reflection

↓

Mission Complete

↓

Home
```

Parent

```
Mission Control

↓

Campaign

↓

Curriculum

↓

Reports

↓

Print

↓

Settings
```

Explorer and Parent navigation remain completely separate.

---

# State Model

The platform stores

Explorer Profile

Campaign Progress

Mission Progress

Activity Completion

Explorer Rank

Knowledge Cores

Discovery Log

Parent Preferences

Session Duration

Workbook Status

---

# Offline Strategy

Platform should operate without internet after initial loading.

Internet resources become optional enhancements.

Every mission must remain completable offline.

---

# Printing Strategy

Printing is optional.

Every printable asset has a digital equivalent.

Every digital activity has a notebook fallback.

No mission depends on printing.

---

# Accessibility

Platform should support

- keyboard navigation
- readable typography
- high contrast
- colour-independent communication
- responsive layout

Accessibility is a core requirement rather than a later enhancement.

---

# Extension Philosophy

Future campaigns should require:

- new stories
- new missions
- new activities
- new resources

They should not require platform changes.

Platform features should be generic.

Campaigns should be declarative.

---

# Out of Scope

The platform intentionally excludes

- user accounts
- cloud sync
- multiplayer
- online leaderboards
- advertisements
- in-app purchases
- mandatory internet connectivity

These may be reconsidered in future versions through documented design decisions.

---

# Success Criteria

The architecture succeeds when:

- A child can independently complete a mission.
- A parent spends less than five minutes preparing a day's activities.
- A new campaign can be authored without changing platform code.
- The platform supports multiple campaigns with a consistent experience.
- The educational experience remains hidden behind meaningful exploration.

---

# Relationship to Other Documents

Depends on:

- 002_PROJECT_CONTEXT.md
- 006_DESIGN_DECISION_LOG.md

Produces:

- 401_CAMPAIGN_TEMPLATE.md
- 402_MISSION_TEMPLATE.md
- 501_CAMPAIGN_01.md
- 601_HTML_ARCHITECTURE.md

---

# Guiding Principle

**The platform is permanent.**

**Campaigns are replaceable.**

Everything in the architecture should reinforce this separation.