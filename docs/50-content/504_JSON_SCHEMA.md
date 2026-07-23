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
parentGuide
completionCriteria
```

Optional

```text
introImage
backgroundMusic
```

> **Note (added during the Mission Compiler milestone):** `parentGuide` was missing from this required list even though this document separately defines a full Parent Guide schema (below) and `503_DATA_MODEL.md` explicitly says Parent Guide is "Referenced by Missions." Added here as required, embedded directly on the Mission object (not referenced by ID) — same reasoning as `activities`/`rewards`/`beats`: Parent Guide is 1:1 owned by its mission, never shared/reused, so embedding is lossless and requires no new reference-resolution machinery. `mission-engine.js` now validates it. It must never be rendered to the learner (ADR-006, Hidden Parent Mode).

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

> **Note (added during the Settings/Progression milestone):** rewards of type `knowledgeCore`/`rank` now carry an optional `coreId`/`rankId` field referencing the campaign's `src/world/knowledge-cores.json`/`ranks.json` catalog (see below) — additive, per this document's own Forward Compatibility rules. `value` remains the authoritative display string and is unchanged; `coreId`/`rankId` let the platform additionally resolve a description and icon. Older rewards without this field still render exactly as before.

---

# Knowledge Core

Required

```text
id
name
description
icon
```

> **Note (added during the Settings/Progression milestone):** previously an unimplemented gap — mission rewards of type `knowledgeCore` carried only an inline `value` string with no entity behind it, contradicting this section and 503_DATA_MODEL.md's description of Knowledge Core as a reusable, described, iconed entity. `portal/campaigns/campaign01/src/world/knowledge-cores.json` now provides this catalog for Campaign 1; rewards reference it via the optional `coreId` field above.

---

# Explorer Rank

Required

```text
id
title
requiredKnowledge
```

> **Note (added during the Settings/Progression milestone):** same gap and same fix as Knowledge Core above — `portal/campaigns/campaign01/src/world/ranks.json` now provides this catalog, with `requiredKnowledge` populated as the Knowledge Core IDs earned by the point each rank is awarded. Rewards reference it via the optional `rankId` field on Reward.

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

> **Note (added during the Discovery Log milestone):** this list has no field for the learner's actual written response, and `601_HTML_ARCHITECTURE.md`'s Discovery Log Entry component and `503_DATA_MODEL.md`'s conceptual model each describe a different, non-overlapping field set — none of the three documents agree. The implementation extends this required list with `learnerNotes` (the response text), `timestamp`, `campaignId` and `missionId` (cross-campaign traceability, since "the Discovery Log spans all campaigns" per `601_HTML_ARCHITECTURE.md`'s Discovery Log section). Only `entryType: "reflection"` is produced today — the platform has no UI yet for drawing, prediction, observation or diagram entries.

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
>
> **Note (added during the Settings/Progression milestone):** `duration` ("Preferred Session Duration") is now implemented — `portal/js/settings.js` persists a parent-chosen value from the four Supported Durations via `storage.js`'s `settings` field, and the learner shell's `/settings` page (`router.js`) is the control surface. `scheduler.js`'s `scheduleActivities()` is called with this stored value instead of a hardcoded default. `coreWeight`/`extensionWeight`/`rabbitHoleWeight` remain unimplemented as above.

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

> **Note (added during Milestone 11 — Multi-Child Explorer Profiles):** implemented as `portal/js/explorer-profiles.js`'s profile object, stored in a registry (`explorerAcademy.profiles`) separate from any single Save Game — a device can hold several profiles. The actual required fields turned out to be `id`, `displayName` (this document's `explorerName`), `avatar`, `pinHash`, `createdAt`, `lastPlayedAt`, `streak: { count, lastPlayedDate }`. `currentCampaign`/`currentMission`/`rank`/`knowledgeCores`/`settings` are not duplicated on the profile — they live on that profile's own Save Game (`currentSession`, `earnedRewards`, `settings`) to avoid the same fact existing in two places. `pinHash` gates that profile's Parent Mode dashboard: hashed client-side via the Web Crypto API, deliberately a deterrent rather than real security (see ADR-025) since this platform has no backend to keep a secret away from the device the child uses.

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

> **Note (added during Milestone 11):** a Save Game is now identified by which Explorer Profile ID it's keyed under (`explorerAcademy.save.<profileId>` in `localStorage`) rather than embedding an `explorerProfile` field — see 503_DATA_MODEL.md's equivalent note. `completedMissions`/`completedActivities` remain unimplemented, same as before this milestone (reward-engine.js/discovery-log.js's own entries are still the closest available signal of mission completion). Until a profile exists and is made active, saves fall back to a single legacy, unkeyed save for backward compatibility with pre-Milestone-11 data — `storage.js`'s `hasLegacySave()`/`migrateLegacySaveTo()`/`clearLegacySave()` support a one-time move into a newly created profile.

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