# 401_CAMPAIGN_TEMPLATE.md

> **Document:** Campaign Template
>
> **Document ID:** 401
>
> **Version:** 1.0.0
>
> **Status:** Draft
>
> **Owner:** Project Architect
>
> **Audience:** Campaign Authors, Human + AI Contributors
>
> **Last Updated:** 2026-07-19

---

# Purpose

This document defines the structure of an Explorer Academy campaign.

A campaign is a self-contained educational adventure that can be loaded by the Explorer Academy platform.

Campaigns contain educational content only.

They must never introduce new platform behaviour.

---

# Design Principles

Every campaign should be:

- Story-driven
- Curiosity-led
- Self-contained
- Offline-friendly
- Child-first
- Curriculum-aware (hidden from learners)
- Adaptable to different session durations
- Replayable where practical

---

# Campaign Definition

A campaign is composed of:

```
Campaign
    ↓
World
    ↓
Story
    ↓
Missions
    ↓
Activities
    ↓
Resources
    ↓
Rewards
    ↓
Rabbit Holes
```

The platform provides the engine.

The campaign provides the experience.

---

# Campaign Metadata

Every campaign begins with metadata.

Required fields:

- Campaign ID
- Campaign Name
- Version
- Author
- Status
- Recommended Age
- Estimated Duration
- Number of Missions
- Theme
- Difficulty
- Prerequisites
- Completion Criteria

Example

```
Campaign ID

CAMPAIGN-001

Theme

Space Exploration

Duration

3 Weeks

Difficulty

Explorer

Recommended Age

9–10
```

---

# Campaign Overview

Every campaign should include:

## Campaign Word Bible

Campaign
    ↓
World Bible
    ↓
Locations
Characters
Organisations
Technology
Timeline
Glossary
Lore

## Premise

Why does this adventure exist?

---

## Story Summary

A spoiler-free overview.

---

## Learning Intent

Hidden from the learner.

Describes:

- skills developed
- curriculum covered
- habits of mind encouraged

---

## Explorer Role

Who is the learner?

Examples

- Junior Astronaut
- Time Traveller
- Marine Biologist
- Detective
- Inventor

---

## Mission Control Role

Defines the parent's role during the campaign.

Examples:

- Quartermaster
- Science Officer
- Expedition Leader

---

# Campaign Structure

A campaign consists of sequential missions.

```
Campaign

Mission 1

Mission 2

Mission 3

...

Mission N
```

The platform determines progress.

The campaign supplies content.

---

# Mission Requirements

Every mission must include:

- Story progression
- Learning objective(s)
- Core activities
- Reflection
- Completion condition

Optional:

- Rabbit Holes
- Bonus discoveries
- Outdoor challenges
- Experiments
- Creative extensions

---

# Educational Coverage

Campaigns should balance multiple disciplines.

Possible categories:

- Reading
- Writing
- Mathematics
- Science
- Engineering
- Geography
- History
- Computing
- Observation
- Drawing
- Communication
- Research

The learner should experience these naturally through the story.

---

# Story Requirements

The story should:

- create genuine curiosity
- provide meaningful context
- motivate investigation
- evolve through missions
- reward observation

Avoid:

- unnecessary exposition
- artificial educational dialogue
- obvious curriculum language

---

# Activity Design

Activities should feel authentic.

Examples

Instead of

> Complete these fractions questions.

Prefer

> Repair the damaged navigation computer by calculating the missing fuel ratios.

The educational objective remains hidden.

---

# Difficulty Model

Every campaign should contain:

Core Activities

Required.

Extension Activities

Stretch learning.

Rabbit Holes

Pure curiosity.

The platform schedules these dynamically.

---

# Adaptive Duration

Campaigns must support multiple daily session lengths.

Recommended bands:

- 30 minutes
- 45 minutes
- 60 minutes
- 90 minutes

Every mission should remain coherent regardless of the selected duration.

---

# Resources

Resources may include:

- Images
- Maps
- Videos (optional)
- Printable pages
- Worksheets
- Experiment guides
- External links

All external resources must have an offline alternative.

---

# Workbook Integration

Workbook pages are optional enhancements.

Every workbook activity must have an equivalent notebook version.

Printing is never required.

---

# Reward Integration

Campaigns define rewards.

Examples

- Knowledge Cores
- Explorer Rank Progress
- Story Unlocks
- New Locations
- Discovery Entries

The platform determines how rewards are displayed.

---

# Discovery Log

Campaigns may request Discovery Log entries.

Examples:

- Draw a creature.
- Record observations.
- Predict an outcome.
- Sketch a machine.
- Explain a hypothesis.

The Discovery Log belongs to the Explorer across all campaigns.

---

# Parent Guidance

Hidden from learners.

May include:

- curriculum mapping
- extension ideas
- discussion prompts
- preparation notes
- expected misconceptions
- assessment observations

---

# Campaign Completion

A campaign is complete when:

- all mandatory missions are completed
- required learning outcomes are achieved
- final story resolution is reached

Rabbit Holes are optional.

---

# Future Expansion

Campaigns should be extensible.

Possible additions:

- bonus missions
- seasonal events
- alternative endings
- advanced missions
- challenge packs

These should not require platform modifications.

---

# Validation Checklist

Before publishing a campaign:

- [ ] Story is complete.
- [ ] Missions follow the template.
- [ ] Activities are correctly categorised.
- [ ] Rabbit Holes are optional.
- [ ] Workbook alternatives exist.
- [ ] Offline alternatives exist.
- [ ] Parent guidance is complete.
- [ ] Curriculum mapping is hidden from learners.
- [ ] Rewards are defined.
- [ ] Completion criteria are achievable.

---

# Relationship to Other Documents

Depends on:

- 301_PLATFORM_ARCHITECTURE.md
- 002_PROJECT_CONTEXT.md
- 006_DESIGN_DECISION_LOG.md

Produces:

- 402_MISSION_TEMPLATE.md
- 501_CAMPAIGN_01.md

---

# Guiding Principle

A campaign should feel like an adventure that naturally develops knowledge, skills and curiosity.

If the learner finishes believing they have completed a story rather than a course, the campaign has succeeded.