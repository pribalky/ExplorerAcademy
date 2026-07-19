# 006_DESIGN_DECISION_LOG.md

> **Document:** Design Decision Log
>
> **Document ID:** 006
>
> **Version:** 1.0.0
>
> **Status:** Living Document
>
> **Owner:** Project Architect
>
> **Last Updated:** 2026-07-18

---

# Purpose

This document records every significant architectural, educational and product decision made during the development of Explorer Academy.

Unlike the Changelog, which records **what changed**, this document explains **why decisions were made**.

Every decision recorded here becomes part of the project's architectural history.

Future contributors should consult this document before proposing changes to any foundational behaviour.

---

# Decision Record Format

Every Architecture Decision Record (ADR) follows the same template.

```
ADR-XXX

Title

Status

Context

Decision

Alternatives Considered

Rationale

Consequences

Affected Documents

Review Date
```

---

# Decision Status

Each ADR must have one status.

| Status | Meaning |
|----------|---------|
| Proposed | Under discussion |
| Accepted | Approved and implemented |
| Superseded | Replaced by another ADR |
| Deprecated | No longer applicable |

---

# ADR-001

## Documentation First

**Status**

Accepted

### Context

Many software projects evolve faster than their documentation, causing inconsistencies and architectural drift.

### Decision

Explorer Academy will define its architecture in documentation before implementation begins.

### Alternatives Considered

Implementation-first.

Prototype-first.

### Rationale

Documentation provides a stable source of truth across multiple AI conversations and contributors.

### Consequences

Implementation may appear slower initially but becomes significantly easier to maintain.

### Affected Documents

Entire repository.

---

# ADR-002

## Adventure Is The Product

**Status**

Accepted

### Context

Traditional educational software exposes lessons and disguises them with superficial gamification.

### Decision

Explorer Academy presents authentic adventures.

Curriculum remains invisible.

### Rationale

Children should engage because the experience is compelling—not because it resembles school.

### Consequences

Every campaign must justify educational content through the story.

---

# ADR-003

## Parent As Mission Control

**Status**

Accepted

### Context

Many educational platforms require constant parental teaching.

### Decision

Parents facilitate logistics rather than deliver instruction.

### Rationale

Reducing parental workload improves long-term sustainability.

### Consequences

Instructions must be child-friendly and self-guided.

---

# ADR-004

## Offline First

**Status**

Accepted

### Context

Families should not depend on internet connectivity during missions.

### Decision

The learner experience should function offline after initial loading.

### Consequences

Resources should be optional rather than mandatory.

---

# ADR-005

## Workbook Optional

**Status**

Accepted

### Context

Parents may not always print workbook pages before a mission.

### Decision

Every mission must remain fully completable using:

- blank paper
- sketchbook
- notebook

Printable worksheets enhance but never gate progress.

### Consequences

Mission design cannot depend upon printed resources.

---

# ADR-006

## Hidden Parent Mode

**Status**

Accepted

### Context

Parents require curriculum visibility.

Children should not.

### Decision

The learner portal must never expose curriculum mappings.

Parent Mode remains separate and invisible to learners.

### Consequences

Portal architecture requires role separation.

---

# ADR-007

## Curiosity Before Completion

**Status**

Accepted

### Context

Most learning platforms optimise for completion rates.

### Decision

Explorer Academy optimises for curiosity.

Rabbit holes and optional investigations are first-class features.

### Consequences

Completion percentage is not the primary success metric.

---

# ADR-008

## Campaign-Based Architecture

**Status**

Accepted

### Context

Future educational themes should not require rebuilding the platform.

### Decision

Campaigns become modular content packages.

The platform remains largely unchanged.

### Consequences

Mission templates and campaign templates become reusable assets.

---

# ADR-009

## Adjustable Daily Duration

**Status**

Accepted

### Context

Families have varying amounts of available time each day.

### Decision

Parents choose an available session duration (for example, 30, 45, 60 or 90 minutes).

The platform dynamically adjusts each day's mission by selecting mandatory and optional activities while preserving learning outcomes.

### Rationale

Consistency matters more than session length.

The platform should adapt to the family's schedule rather than forcing a fixed timetable.

### Consequences

Every mission must classify activities as:

- Core
- Extension
- Rabbit Hole

The scheduler may defer extension activities without breaking progression.

---

# ADR-010

## Invisible Curriculum Mapping

**Status**

Accepted

### Context

Campaign 1 is designed to bridge England and Scotland curricula without making the learner feel they are catching up.

### Decision

Curriculum mapping exists only in documentation and Parent Mode.

Learners interact exclusively with story, challenges and exploration.

### Consequences

Curriculum documents become implementation references rather than learner-facing artefacts.

---

# ADR-011

## Documentation as Source of Truth

**Status**

Accepted

### Context

Future development will span multiple AI conversations and possibly multiple AI systems.

### Decision

Repository documentation always overrides chat history.

### Consequences

Every architectural change must first be reflected in documentation.

---

# Decision Review Process

Before proposing a new ADR:

1. Review existing ADRs.
2. Determine whether an existing decision already applies.
3. Assess downstream impacts.
4. Discuss alternatives.
5. Obtain approval.
6. Record the decision.

Only then should implementation proceed.

---

# Creating New ADRs

Assign the next available identifier.

Example:

```
ADR-012
```

Never renumber existing decisions.

Superseded decisions remain in the log with updated status.

---

# Relationship to Other Documents

| Document | Purpose |
|-----------|---------|
| Project Manifest | Repository governance |
| Project Context | Project philosophy |
| Changelog | Historical evolution |
| Dependency Graph | Structural relationships |

Together, these documents define the architecture, history and governance of Explorer Academy.

---

# Guiding Principle

Every significant decision should be understandable years later without requiring access to historical conversations.

If a contributor asks, "Why does the platform work this way?", the answer should exist in this document.