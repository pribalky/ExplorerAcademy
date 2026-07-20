# 502_CAMPAIGN_CONTENT_SPECIFICATION.md

> **Document:** Campaign Content Specification
> **Document ID:** 502
> **Version:** 1.0.0 (Draft)
> **Status:** Draft
> **Owner:** Curriculum Architect / Campaign Designer
> **Audience:** Campaign Authors, Curriculum Architects, Platform Architects, AI Contributors
> **Dependencies:** 000 Project Manifest, 002 Project Context, 006 Design Decision Log, 007 AI Contributing Guide
> **Purpose:** Define the canonical content model for Explorer Academy campaigns prior to implementation.

---

# Purpose

This document defines the complete authoring model for Explorer Academy campaigns.

It is intentionally implementation-independent.

Campaigns are authored using this specification before any JSON, database schema or platform-specific format is generated.

The objective is to ensure that every future campaign follows the same architectural structure while allowing unlimited thematic variation.

---

# Scope

This specification governs:

* campaign structure
* narrative structure
* educational structure
* progression
* reusable assets
* curriculum metadata
* parent-facing content
* learner-facing content
* validation requirements

It does **not** define:

* UI
* HTML
* CSS
* JavaScript
* JSON schema
* storage format

---

# Core Content Hierarchy

```
Campaign
│
├── World Bible
│
├── Locations
│
├── Characters
│
├── Timeline
│
├── Chapters
│
│     └── Missions
│             │
│             ├── Activities
│             ├── Discovery Log Prompts
│             ├── Rabbit Holes
│             ├── Rewards
│             ├── Parent Notes
│             ├── Workbook References
│             ├── External Resources
│             ├── Curriculum Mapping
│             └── Completion Criteria
│
└── Explorer Progress
```

---

# General Content Rules

Every content object must include:

* ID
* Name
* Purpose
* Description
* Version
* Status

Every content object should be independently reusable wherever possible.

---

# Naming Conventions

Document IDs

```
502_CAMPAIGN_CONTENT_SPECIFICATION.md
```

Campaign IDs

```
C01
C02
C03
```

Chapter IDs

```
CH01
CH02
```

Mission IDs

```
M01
M02
```

Activity IDs

```
ACT001
ACT002
```

Character IDs

```
CHR001
```

Location IDs

```
LOC001
```

Reward IDs

```
RWD001
```

Rabbit Hole IDs

```
RH001
```

Discovery Prompt IDs

```
LOG001
```

Workbook IDs

```
WB001
```

Curriculum IDs

```
CUR001
```

IDs must remain stable across versions.

IDs must never be recycled.

---

# Cross-Reference Rules

Content may reference another object only by ID.

Examples:

Mission

→ Characters

→ Locations

→ Rewards

Activities

→ Workbook Pages

→ Discovery Prompts

→ Curriculum Outcomes

This prevents duplicated content.

---

# Versioning Strategy

Every content object maintains:

Major

* structural change

Minor

* approved content additions

Patch

* wording fixes

Campaign versions are independent from platform versions.

---

# Reusable Content

Reusable content should be authored once.

Examples:

* scientific explanations
* glossary entries
* recurring explorer tools
* reward definitions
* common activity templates
* safety instructions

Campaigns reference shared assets rather than copying them.

---

# Shared Assets

Shared assets include:

* illustrations
* icons
* printable templates
* experiment instructions
* explorer equipment
* maps
* audio
* reusable worksheets

Assets belong to the platform library whenever possible.

---

# 1. Campaign

## Purpose

Defines the complete adventure.

## Required Fields

* Campaign ID
* Title
* Subtitle
* Theme
* Recommended Age
* Estimated Duration
* Learning Vision
* Campaign Summary
* Starting Situation
* Ending Situation

## Optional Fields

* Difficulty
* Seasonal Variant
* Companion Materials

## Relationships

Contains:

* World Bible
* Chapters
* Characters
* Timeline
* Progression

## Validation

Must contain at least one chapter.

Must define learner progression.

Must define campaign completion.

## Authoring Guidelines

Campaigns should feel like genuine adventures.

Curriculum must remain invisible.

## Example

Campaign 1

Journey through the Solar System to restore the Explorer Network while investigating scientific mysteries.

---

# 2. World Bible

## Purpose

Defines the internal rules of the campaign world.

## Required Fields

* Setting
* Tone
* Technology Level
* Core Premise
* World Rules

## Optional Fields

* Glossary
* Lore
* Organisations

## Relationships

Referenced by every chapter.

## Validation

World rules must remain internally consistent.

## Authoring Guidelines

Avoid contradictions.

Establish recurring terminology.

---

# 3. Locations

## Purpose

Describe places visited.

## Required Fields

* Location ID
* Name
* Description
* Importance

## Optional Fields

* Illustration
* Hazards
* Interesting Facts

## Relationships

Referenced by:

* chapters
* missions
* timeline

## Validation

Each location must support the story.

---

# 4. Characters

## Purpose

Define recurring individuals.

## Required Fields

* Character ID
* Name
* Role
* Personality
* Narrative Purpose

## Optional Fields

* Portrait
* Catchphrase
* Relationships
* Growth Arc

## Relationships

Referenced by missions and chapters.

## Validation

Each recurring character must contribute to the campaign.

---

# 5. Timeline

## Purpose

Define story progression.

## Required Fields

* Event
* Sequence
* Trigger

## Optional Fields

* Dependencies
* Flashbacks

## Relationships

Connects chapters.

## Validation

No chronological conflicts.

---

# 6. Story Chapters

## Purpose

Group missions into narrative acts.

## Required Fields

* Chapter ID
* Title
* Summary
* Opening
* Closing

## Optional Fields

* Cliffhanger
* Chapter Reward

## Relationships

Contains missions.

## Validation

Must progress the narrative.

---

# 7. Missions

## Purpose

Primary learner experience.

## Required Fields

* Mission ID
* Title
* Story Introduction
* Objective
* Success Criteria
* Estimated Duration

## Optional Fields

* Equipment
* Safety Notes
* Extension Mission

## Relationships

Contains:

* Activities
* Rewards
* Discovery Logs

## Validation

Must include at least one Core Activity.

Must support adaptive scheduling.

## Authoring Guidelines

Every mission advances both:

* story
* learner capability

---

# 8. Activities

## Purpose

Individual learner tasks.

## Required Fields

* Activity ID
* Type
* Classification
* Instructions
* Expected Output

Classification must be:

* Core
* Extension
* Rabbit Hole

## Optional Fields

* Hints
* Time Estimate
* Materials
* Difficulty

## Relationships

Belongs to one mission.

Maps to curriculum.

## Validation

Core activities must satisfy essential outcomes.

---

# 9. Discovery Log Prompts

## Purpose

Encourage observation and reflection.

## Required Fields

* Prompt
* Reflection Goal

## Optional Fields

* Example Response
* Drawing Prompt

## Relationships

Attached to activities or missions.

## Validation

Must promote reasoning rather than recall.

---

# 10. Rabbit Holes

## Purpose

Reward curiosity.

## Required Fields

* Title
* Investigation Prompt
* Learning Opportunity

## Optional Fields

* Videos
* Articles
* Experiments

## Relationships

Linked to activities.

## Validation

Never required for completion.

Supports ADR-007 (Curiosity Before Completion).

---

# 11. Rewards

## Purpose

Recognise progress.

## Required Fields

* Reward ID
* Name
* Unlock Condition

## Optional Fields

* Badge
* Story Artifact
* Journal Entry

## Relationships

Unlocked by missions.

## Validation

Rewards celebrate exploration rather than scores.

---

# 12. Explorer Rank Progress

## Purpose

Track campaign advancement.

## Required Fields

* Rank Name
* Requirements

## Optional Fields

* Insignia
* Narrative Unlock

## Relationships

Connected to mission completion.

## Validation

Ranks must reward sustained engagement.

---

# 13. Parent Notes

## Purpose

Support parents without interrupting learner independence.

## Required Fields

* Preparation
* Facilitation Guidance

## Optional Fields

* Conversation Starters
* Safety Notes
* Differentiation Suggestions

## Relationships

Hidden from learner.

## Validation

Must align with ADR-003 (Parent as Mission Control).

---

# 14. Workbook References

## Purpose

Link optional printable resources.

## Required Fields

* Workbook ID
* Page Reference

## Optional Fields

* Printable Alternative

## Relationships

Referenced by activities.

## Validation

Workbook usage must remain optional.

Supports ADR-005.

---

# 15. External Resources

## Purpose

Provide optional enrichment.

## Required Fields

* Resource Name
* Resource Type
* Educational Purpose

## Optional Fields

* URL
* Estimated Time

## Relationships

Linked to Rabbit Holes or Parent Notes.

## Validation

Campaign must remain fully playable without internet access.

Supports ADR-004.

---

# 16. Curriculum Mapping

## Purpose

Map learning outcomes to educational standards.

## Required Fields

* Subject
* Learning Outcome
* Curriculum Reference

## Optional Fields

* Notes
* Evidence

## Relationships

Maps activities to standards.

## Validation

Never exposed to learners.

Supports ADR-006 and ADR-010.

---

# 17. Completion Criteria

## Purpose

Define successful completion.

## Required Fields

* Mandatory Missions
* Required Core Activities
* Final Story Condition

## Optional Fields

* Bonus Completion
* Completion Certificate

## Relationships

References campaign progression.

## Validation

Completion must depend only on Core Activities.

Extension and Rabbit Hole content cannot block completion.

---

# Authoring Principles

All campaign authors must ensure that content:

* prioritises curiosity over instruction
* embeds learning within narrative
* supports independent learners
* minimises parental workload
* remains reusable
* avoids duplication
* separates learner-facing and parent-facing content
* supports adaptive session duration
* preserves hidden curriculum mapping

---

# Canonical Validation Checklist

Before a campaign is approved:

* Campaign metadata complete
* World Bible internally consistent
* Locations uniquely identified
* Characters fully defined
* Timeline validated
* Chapters sequenced
* Every mission contains Core Activities
* Every activity classified
* Discovery Log prompts included
* Rabbit Holes optional
* Rewards mapped
* Explorer Rank progression complete
* Parent Notes authored
* Workbook references optional
* External resources optional
* Curriculum mappings complete and hidden
* Completion criteria validated
* IDs unique and stable
* Cross-references valid
* Shared assets referenced rather than duplicated
* Semantic versions assigned to all content objects

---

# Final Principle

The Campaign Content Specification is the canonical authoring model for Explorer Academy. All campaigns must be authored against this specification before conversion into implementation formats. It ensures that campaigns remain modular, reusable, educationally rigorous, and architecturally consistent while preserving the platform philosophy that adventure is the visible product and learning is the hidden implementation.
