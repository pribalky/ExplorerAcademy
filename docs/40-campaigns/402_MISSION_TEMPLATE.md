# 402_MISSION_TEMPLATE.md

> **Document:** Mission Template
>
> **Document ID:** 402
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

This document defines the structure of an individual mission within an Explorer Academy campaign.

A mission is the smallest self-contained unit of meaningful progression.

It combines story, exploration and learning into a single adventure.

The learner should perceive a mission as an exciting challenge rather than a lesson.

---

# Mission Design Principles

Every mission should:

- Advance the story.
- Develop curiosity.
- Build confidence.
- Feel achievable.
- Encourage independent thinking.
- End with a meaningful sense of progress.
- Naturally integrate learning.

---

# Mission Structure

```
Mission

↓

Mission Brief

↓

Story

↓

Objectives

↓

Core Activities

↓

Extension Activities

↓

Rabbit Holes

↓

Reflection

↓

Mission Complete

↓

Unlock Next Mission
```

---

# Mission Beats

Hook
    ↓
Mystery
    ↓
Investigation
    ↓
Discovery
    ↓
Challenge
    ↓
Breakthrough
    ↓
Reflection
    ↓
Cliffhanger

---

# Mission Metadata

Every mission begins with metadata.

Required fields:

- Mission ID
- Mission Name
- Campaign ID
- Mission Number
- Estimated Duration
- Difficulty
- Story Chapter
- Required Previous Mission
- Completion Criteria

Example

```
Mission ID

MISSION-003

Mission Name

The Silent Satellite

Estimated Duration

60 minutes
```

---

# Mission Brief

A short introduction written directly to the Explorer.

Should answer:

- What happened?
- Why does it matter?
- What must be investigated?
- Why are you the right Explorer?

Length:

50–150 words.

Avoid educational terminology.

---

# Story Segment

Continues the campaign narrative.

Purpose:

- Raise curiosity.
- Introduce tension.
- Reveal clues.
- Build immersion.

The story should never pause simply to teach.

Learning exists to solve story problems.

---

# Mission Objectives

Objectives are written for the Explorer.

Examples:

- Restore communications.
- Decode the strange message.
- Identify the unknown mineral.
- Locate the missing rover.

Objectives describe outcomes.

They never describe curriculum.

---

# Hidden Learning Objectives

Visible only in Parent Mode.

May include:

- Reading inference
- Paragraph writing
- Multiplication fluency
- Fractions
- Scientific observation
- Prediction
- Evidence gathering

The learner never sees these.

---

# Activity Sequence

Every mission contains three categories.

## Core Activities

Required.

These guarantee progression.

---

## Extension Activities

Optional.

Provide additional challenge.

May be skipped automatically by the scheduler if time is limited.

---

## Rabbit Holes

Pure curiosity.

Not required.

Designed to encourage exploration beyond the mission.

Examples:

- Watch a NASA video.
- Build a paper glider.
- Research a real spacecraft.
- Observe the Moon tonight.

---

# Activity Template

Each activity contains:

- Activity ID
- Title
- Type
- Estimated Time
- Story Context
- Explorer Instructions
- Resources
- Expected Output
- Optional Hints
- Parent Notes
- Hidden Curriculum Tags

The platform renders activities generically.

---

# Supported Activity Types

Activities should use one of the standard platform types.

Examples:

- Reading
- Writing
- Mathematics
- Science
- Engineering
- Investigation
- Observation
- Drawing
- Discussion
- Experiment
- Outdoor Exploration
- Creative Build
- Reflection

Future activity types should be added without modifying existing missions.

---

# Adaptive Scheduling

Each activity must be classified as:

Core

Extension

Rabbit Hole

The scheduler uses this information to personalise the day's mission.

Core activities must always remain intact.

---

# Resources

Resources may include:

- Images
- Maps
- Diagrams
- Story cards
- Printable sheets
- Household materials
- External websites

All required resources must have offline alternatives.

---

# Workbook Integration

Every printable activity must have a notebook equivalent.

Example

Workbook:

Complete the mission worksheet.

Notebook alternative:

Draw your own version and complete it.

No mission should require printing.

---

# Discovery Log

Most missions should produce at least one Discovery Log entry.

Possible entries:

- Sketch
- Diagram
- Observation
- Question
- Prediction
- Reflection
- Experiment result
- Personal theory

The Discovery Log belongs to the Explorer throughout every campaign.

---

# Rewards

Each mission defines:

- Knowledge Cores
- Explorer Rank Progress
- Story Unlocks
- Collectibles (optional)
- New Locations (optional)

Rewards should reinforce exploration rather than competition.

---

# Reflection

Every mission ends with reflection.

Examples:

- What surprised you today?
- What would you investigate next?
- Which clue was most important?
- Did your prediction change?

Reflection encourages metacognition rather than assessment.

---

# Mission Completion

A mission is complete when:

- all Core Activities are finished
- mandatory story progression is achieved
- required Discovery Log entries are completed

Extension activities and Rabbit Holes never block progression.

---

# Parent Mode

Hidden from the Explorer.

Contains:

- Curriculum mapping
- Suggested discussion
- Common misconceptions
- Extension ideas
- Assessment observations
- Preparation notes
- Printable resources

---

# Mission Data Model

Conceptually, every mission consists of:

```
Mission

├── Metadata
├── Story
├── Objectives
├── Activities
│      ├── Core
│      ├── Extension
│      └── Rabbit Holes
├── Rewards
├── Discovery Log Prompts
├── Reflection
└── Parent Guide
```

The platform renders this structure without requiring mission-specific code.

---

# Mission Quality Checklist

Before publishing a mission:

- [ ] Story advances.
- [ ] Objectives are meaningful.
- [ ] Core activities are complete.
- [ ] Activities support adaptive scheduling.
- [ ] Rabbit Holes are optional.
- [ ] Workbook alternatives exist.
- [ ] Discovery Log prompt included.
- [ ] Reflection included.
- [ ] Parent guidance complete.
- [ ] Curriculum remains hidden from the learner.

---

# Relationship to Other Documents

Depends on:

- 301_PLATFORM_ARCHITECTURE.md
- 401_CAMPAIGN_TEMPLATE.md
- 002_PROJECT_CONTEXT.md

Produces:

- 501_CAMPAIGN_01.md

---

# Guiding Principle

A successful mission leaves the Explorer asking:

**"What happens next?"**

rather than

**"What's the next lesson?"**