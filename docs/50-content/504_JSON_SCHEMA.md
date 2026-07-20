# 504_JSON_SCHEMA.md

> **Document:** Canonical JSON Schema Specification
>
> **Document ID:** 504
>
> **Version:** 1.0.0
>
> **Status:** Stable
>
> **Owner:** Platform Architecture
>
> **Audience:** Platform Engine, AI Contributors, Campaign Authors
>
> **Depends On:** 503_DATA_MODEL.md

---

# Purpose

This document defines the canonical JSON contract for Explorer Academy.

All campaign content must conform to this specification.

Platform behaviour depends on this contract remaining stable.

Unknown fields should be ignored by the platform unless explicitly supported.

---

# General Rules

## Encoding

- UTF-8

## Formatting

- Pretty printed
- 2-space indentation

## Naming Convention

All keys use:

```text
camelCase
```

IDs use:

```text
UPPERCASE_PREFIX-####

Examples

CAMPAIGN-0001
MISSION-0007
ACTIVITY-0012
LOCATION-0003
CHARACTER-0004
```

---

# Common Object

Every object contains:

| Field | Type | Required |
|--------|------|----------|
| id | string | ✓ |
| version | string | ✓ |
| name | string | ✓ |
| description | string | Optional |

---

# Campaign

Required

```text
id
version
title
subtitle
theme
recommendedAge
estimatedDuration
difficulty
author
status
worldBibleId
missions
completionCriteria
```

Optional

```text
coverImage
icon
tags
```

---

# World Bible

Required

```text
id
campaignId
characters
locations
timeline
glossary
technology
organisations
```

---

# Character

Required

```text
id
name
role
description
image
```

Optional

```text
personality
knowledge
relationships
voice
```

---

# Location

Required

```text
id
name
description
```

Optional

```text
image
coordinates
connections
```

---

# Timeline Event

Required

```text
id
title
description
sequence
```

---

# Story Chapter

Required

```text
id
title
summary
missions
```

---

# Mission

Required

```text
id
campaignId
missionNumber
title
storyChapter
estimatedTime
difficulty
beats
activities
rewards
reflection
completionCriteria
```

Optional

```text
introImage
backgroundMusic
```

---

# Mission Beat

Valid values

```text
HOOK

MYSTERY

INVESTIGATION

DISCOVERY

CHALLENGE

BREAKTHROUGH

REFLECTION

CLIFFHANGER
```

Each mission should contain all beats.

---

# Activity

Required

```text
id
missionId
title
type
category
duration
difficulty
storyContext
instructions
output
schedulerCategory
```

Optional

```text
resources
hints
parentNotes
extensions
```

---

# Activity Type

Valid values

```text
reading

writing

mathematics

science

engineering

drawing

observation

experiment

research

discussion

reflection

creative

outdoor
```

---

# Scheduler Category

Valid values

```text
core

extension

rabbitHole
```

---

# Resource

Required

```text
id
type
title
location
```

Type

```text
image

video

pdf

website

printable

experiment

worksheet
```

---

# Reward

Required

```text
id
type
value
```

Reward Type

```text
knowledgeCore

rank

unlock

badge

story

collectible
```

---

# Knowledge Core

Required

```text
id
name
description
icon
```

---

# Explorer Rank

Required

```text
id
title
requiredKnowledge
```

---

# Discovery Log Entry

Required

```text
id
prompt
entryType
```

Entry Types

```text
drawing

notes

prediction

reflection

observation

diagram
```

---

# Rabbit Hole

Required

```text
id
title
description
estimatedTime
resourceIds
```

Rabbit Holes never block mission completion.

---

# Parent Guide

Required

```text
id
learningObjectives
discussionPoints
preparation
assessment
```

Optional

```text
extensions

misconceptions

printables
```

---

# Workbook Reference

Required

```text
id
page
activityId
```

---

# Curriculum Mapping

Required

```text
id
country
curriculum
subject
strand
outcomes
```

Supported Curriculum

```text
england

scotland
```

---

# External Resource

Required

```text
id
title
url
provider
```

Optional

```text
offlineAlternative
```

---

# Achievement

Required

```text
id
title
description
condition
```

---

# Session Configuration

Required

```text
duration

coreWeight

extensionWeight

rabbitHoleWeight
```

Supported Durations

```text
30

45

60

90
```

> **Note (added during the Scheduler milestone):** `coreWeight`, `extensionWeight` and `rabbitHoleWeight` are reserved fields — no document defines the formula they participate in. The Adaptive Scheduler currently implements the simpler duration-band model described in `601_HTML_ARCHITECTURE.md`'s Adaptive Scheduler section (Core always included; Extension activities added while time allows; Rabbit Hole activities included only at the 90-minute band) and does not read these three fields. Treat them as not-yet-implemented until a future milestone defines and implements a weighted model.

---

# Explorer Profile

Required

```text
id
explorerName
currentCampaign
currentMission
rank
knowledgeCores
settings
```

---

# Save Game

Required

```text
version

timestamp

explorerProfile

completedMissions

completedActivities

discoveryLog

settings
```

---

# Relationships

```
Campaign

↓

World Bible

↓

Story Chapters

↓

Missions

↓

Activities

↓

Rewards
```

Activities reference

- resources
- parent guide
- workbook pages

Missions reference

- characters
- locations
- timeline events

---

# Validation Rules

Every ID must be globally unique.

All references must resolve.

Unknown references invalidate the object.

Unknown optional fields may be ignored.

Missing required fields invalidate the object.

---

# Forward Compatibility

Future versions may

- add optional fields
- add activity types
- add reward types
- add curricula
- add campaign metadata

Existing required fields should never be removed.

---

# Backward Compatibility

The platform should ignore unsupported optional fields.

Older campaigns should remain playable.

---

# File Organisation

```
campaign.json

missions/

world/

resources/

parent/

workbook/
```

Each file contains a single logical entity collection.

---

# Canonical Principle

The JSON files describe **what** exists.

The platform decides **how** it behaves.

Campaign data must never contain executable logic.