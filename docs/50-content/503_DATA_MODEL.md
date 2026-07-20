# 503_DATA_MODEL.md

> **Document:** Data Model
> **Document ID:** 503
> **Version:** 1.0.0 (Draft)
> **Status:** Draft
> **Owner:** Platform Architect
> **Audience:** Platform Architects, Campaign Authors, Developers, AI Contributors
> **Dependencies:** 000 Project Manifest, 002 Project Context, 006 Design Decision Log, 007 AI Contributing Guide, 502 Campaign Content Specification
> **Purpose:** Define the canonical, implementation-independent data model for Explorer Academy. This specification is the single source of truth for all future campaign serialization formats (including JSON).

---

# Purpose

Explorer Academy separates **platform**, **campaign**, and **learner state** into distinct domains.

This document defines every data entity, its ownership, relationships, constraints, identifiers, and lifecycle.

The model is intentionally independent of storage technology, programming language, and user interface while remaining directly serializable.

---

# Design Principles

The data model must satisfy the project's architectural principles:

* Platform is reusable.
* Campaigns are modular.
* Learner progress is isolated from campaign definitions.
* Curriculum remains hidden from learner-facing content.
* Shared content is authored once.
* References are stable.
* All entities are versioned.
* Data is portable and offline-friendly.  

---

# Data Domains

```
Platform
│
├── Shared Objects
├── Explorer Profiles
├── Session Configuration
├── Save Games
├── Achievements
└── Explorer Ranks

Campaign
│
├── Campaign Metadata
├── World Bible
├── Locations
├── Characters
├── Chapters
├── Missions
├── Activities
├── Discovery Logs
├── Rabbit Holes
├── Rewards
├── Parent Guides
├── Workbook References
├── Curriculum Mapping
└── External Resources

Shared Resources
│
├── Knowledge Cores
├── Activity Resources
└── Asset Library
```

---

# Entity Ownership

## Platform-Owned

* Explorer Profile
* Save Game
* Explorer Rank
* Achievement
* Session Configuration
* Shared Assets
* Shared Knowledge Cores

These exist independently of campaigns.

---

## Campaign-Owned

* Campaign
* Campaign Metadata
* World Bible
* Story Chapters
* Missions
* Mission Beats
* Activities
* Discovery Logs
* Rabbit Holes
* Rewards
* Parent Guides
* Workbook References
* Curriculum Mapping
* External Resources

These are packaged with a campaign.

---

# Global Object Requirements

Every entity contains:

### Required

* ID
* Object Type
* Version
* Status

### Optional

* Tags
* Notes
* Metadata

---

# ID Conventions

IDs are immutable.

IDs are never recycled.

Examples:

```
Campaign
C01

Chapter
CH03

Mission
M12

Beat
MB05

Activity
ACT021

Location
LOC014

Character
CHR008

Reward
RWD002

Rabbit Hole
RH011

Knowledge Core
KC005

Explorer Rank
RANK03

Achievement
ACH017
```

IDs must be globally unique within their entity type.

---

# Versioning Strategy

Every object follows Semantic Versioning.

Major

* structural changes

Minor

* new compatible content

Patch

* editorial corrections

Object versions are independent.

Campaign version ≠ platform version.

---

# Forward Compatibility Strategy

Future readers should safely ignore unknown optional fields.

Required fields may only expand through major versions.

Deprecated fields remain readable for at least one major version.

No entity should assume fixed campaign size, mission count, or curriculum.

---

# Extension Strategy

Extensions must add entities or optional fields.

They must never alter existing semantics.

Future campaigns may introduce:

* new activity types
* additional curriculum systems
* localization
* multiplayer
* accessibility metadata
* analytics
* adaptive learning

without changing existing entities.

---

# Entity Specifications

---

# 1. Campaign

## Purpose

Represents an adventure package.

### Required Fields

* Campaign ID
* Metadata ID
* World Bible ID
* Chapter IDs
* Version

### Optional Fields

* Shared Asset IDs
* Default Configuration

### Relationships

References:

* Campaign Metadata
* World Bible
* Chapters

### Validation

Must contain at least one chapter.

### Example (Pseudo-Object)

```
Campaign
 id
 metadata
 worldBible
 chapters[]
```

---

# 2. Campaign Metadata

## Purpose

Defines descriptive campaign information.

### Required Fields

* Title
* Subtitle
* Theme
* Summary
* Recommended Age
* Estimated Duration

### Optional

* Difficulty
* Authors
* Release Date
* Localization

### Relationships

Referenced by Campaign.

---

# 3. World Bible

## Purpose

Defines world rules.

### Required

* Setting
* Premise
* Tone
* World Rules

### Optional

* Organizations
* Technology
* Glossary

### Relationships

Referenced by Chapters and Missions.

---

# 4. Location

## Purpose

Defines reusable places.

### Required

* ID
* Name
* Description

### Optional

* Illustration
* Facts
* Hazards

### Relationships

Referenced by:

* Chapters
* Missions
* Characters

---

# 5. Character

## Purpose

Defines recurring individuals.

### Required

* Name
* Role
* Personality
* Narrative Purpose

### Optional

* Portrait
* Biography
* Relationships

### Relationships

Referenced by Missions.

---

# 6. Story Chapter

## Purpose

Narrative grouping.

### Required

* Title
* Mission IDs

### Optional

* Intro
* Outro
* Cliffhanger

### Relationships

Contains Missions.

---

# 7. Mission

## Purpose

Primary gameplay unit.

### Required

* Title
* Objective
* Beat IDs
* Activity IDs
* Completion Criteria

### Optional

* Equipment
* Safety Notes

### Relationships

Belongs to Chapter.

References:

* Activities
* Rewards
* Parent Guide

---

# 8. Mission Beat

## Purpose

Represents a narrative step within a mission.

### Required

* Sequence
* Narrative Text
* Trigger

### Optional

* Character References
* Location References

### Relationships

Belongs to Mission.

---

# 9. Activity

## Purpose

Single learner task.

### Required

* Title
* Activity Type
* Classification
* Instructions

Classification:

* Core
* Extension
* Rabbit Hole

### Optional

* Time
* Materials
* Hints

### Relationships

References:

* Resources
* Discovery Log
* Workbook
* Curriculum

---

# 10. Activity Resource

## Purpose

Reusable instructional asset.

### Required

* Resource Type
* Resource ID

### Optional

* Download Reference
* Asset Reference

### Relationships

Referenced by Activities.

---

# 11. Reward

## Purpose

Narrative progression reward.

### Required

* Name
* Unlock Condition

### Optional

* Badge
* Artifact
* Story Item

### Relationships

Referenced by Missions.

---

# 12. Explorer Rank

## Purpose

Long-term progression.

### Required

* Rank Name
* Requirements

### Optional

* Insignia
* Unlocks

### Relationships

Platform-owned.

Referenced by Explorer Profile.

---

# 13. Knowledge Core

## Purpose

Reusable educational concept.

### Required

* Title
* Description

### Optional

* Subjects
* Prerequisites
* Related Knowledge

### Relationships

Referenced by Activities.

Platform-owned.

---

# 14. Discovery Log Entry

## Purpose

Reflection prompt.

### Required

* Prompt
* Reflection Goal

### Optional

* Drawing Prompt
* Example

### Relationships

Referenced by Activities.

---

# 15. Rabbit Hole

## Purpose

Optional exploration.

### Required

* Title
* Investigation Prompt

### Optional

* Resource References
* Experiments

### Relationships

Attached to Activities.

Never required.

---

# 16. Parent Guide

## Purpose

Parent-only guidance.

### Required

* Preparation
* Facilitation

### Optional

* Safety
* Conversation Prompts

### Relationships

Referenced by Missions.

Never exposed to learners.

---

# 17. Workbook Reference

## Purpose

Optional printable linkage.

### Required

* Workbook ID
* Page

### Optional

* Printable Variant

### Relationships

Referenced by Activities.

---

# 18. Curriculum Mapping

## Purpose

Educational traceability.

### Required

* Subject
* Learning Outcome
* Standard Reference

### Optional

* Notes
* Evidence

### Relationships

Referenced by Activities.

Hidden from learner-facing interfaces.

---

# 19. External Resource

## Purpose

Optional enrichment.

### Required

* Resource Name
* Resource Type

### Optional

* URL
* Estimated Time

### Relationships

Referenced by Rabbit Holes or Parent Guides.

Must never be required for mission completion.

---

# 20. Achievement

## Purpose

Platform-wide accomplishment.

### Required

* Name
* Unlock Condition

### Optional

* Icon
* Description

### Relationships

Platform-owned.

Referenced by Explorer Profile.

---

# 21. Session Configuration

## Purpose

Controls adaptive session planning.

### Required

* Preferred Session Duration

### Optional

* Accessibility Preferences
* Printing Preference
* Audio Preference

### Relationships

Referenced by scheduler and Explorer Profile.

Supports adaptive duration. 

---

# 22. Explorer Profile

## Purpose

Represents an individual learner.

### Required

* Explorer ID
* Display Name
* Active Campaign

### Optional

* Rank
* Achievements
* Preferences

### Relationships

References:

* Save Games
* Explorer Rank
* Achievements
* Session Configuration

Platform-owned.

---

# 23. Save Game

## Purpose

Stores learner progress.

### Required

* Save ID
* Explorer ID
* Campaign ID
* Mission Progress

### Optional

* Discovery Entries
* Reward State
* Timestamp

### Relationships

References:

* Explorer Profile
* Campaign
* Missions

Platform-owned.

---

# Entity Relationships

```
Campaign
 ├── Campaign Metadata
 ├── World Bible
 ├── Chapters
 │      └── Missions
 │              ├── Mission Beats
 │              ├── Activities
 │              │       ├── Activity Resources
 │              │       ├── Discovery Logs
 │              │       ├── Rabbit Holes
 │              │       ├── Workbook References
 │              │       ├── Curriculum Mapping
 │              │       └── Knowledge Cores
 │              ├── Rewards
 │              └── Parent Guides
 │
 ├── Locations
 └── Characters

Explorer Profile
 ├── Session Configuration
 ├── Save Games
 ├── Explorer Rank
 └── Achievements
```

---

# Reference Rules

Entities reference one another **only by ID**.

Allowed references include:

* Campaign → Metadata
* Campaign → World Bible
* Campaign → Chapters
* Chapter → Missions
* Mission → Mission Beats
* Mission → Activities
* Mission → Rewards
* Mission → Parent Guide
* Activity → Resources
* Activity → Discovery Log
* Activity → Rabbit Hole
* Activity → Workbook Reference
* Activity → Curriculum Mapping
* Activity → Knowledge Core
* Save Game → Campaign
* Save Game → Mission
* Explorer Profile → Save Game
* Explorer Profile → Achievement
* Explorer Profile → Explorer Rank

Nested duplication of full objects is prohibited.

---

# Validation Rules

Every entity must satisfy:

* Immutable ID
* Valid semantic version
* Required fields present
* References resolve to existing IDs
* No circular ownership
* No duplicate IDs within an entity type
* Campaigns remain self-contained except for platform-owned shared objects
* Learner state is stored separately from authored campaign content

---

# Canonical Principles

1. Separate authored content from learner state.
2. Prefer ID references over embedded duplication.
3. Make campaigns portable and self-contained.
4. Keep platform-owned objects reusable across campaigns.
5. Preserve backward compatibility through semantic versioning.
6. Ensure all entities are serializable without requiring implementation-specific behavior.

---

# Final Principle

The Explorer Academy Data Model is the canonical structural specification for all authored campaign data. Every implementation format—including JSON, databases, APIs, and offline packages—must conform to this model. It provides a stable, extensible foundation that enables reusable campaigns, independent learner progress, hidden curriculum mapping, and long-term platform evolution without requiring architectural changes.
