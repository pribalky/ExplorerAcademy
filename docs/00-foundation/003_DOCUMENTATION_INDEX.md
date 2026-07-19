# 003_DOCUMENTATION_INDEX.md

> **Document:** Documentation Index
>
> **Document ID:** 003
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

The Documentation Index is the central registry for every document in the Explorer Academy repository.

Unlike a traditional table of contents, this document serves as a documentation catalogue and navigation system.

Every project document must be registered here.

This document answers:

- What documents exist?
- Why do they exist?
- Which documents should be read first?
- Which documents depend on others?
- What stage is each document in?
- Who is the intended audience?
- Which documents are authoritative?

---

# How to Use This Document

### Humans

Use this document to understand the documentation structure and locate information.

### AI Contributors

Before generating any new document:

1. Confirm whether it already exists.
2. Determine where it belongs.
3. Identify prerequisite documents.
4. Verify dependencies.
5. Register the document after creation.

---

# Document Lifecycle

Every document follows the same lifecycle.

```
Draft
    │
Review
    │
Approved
    │
Frozen
    │
Deprecated
```

Only Draft and Review documents should be modified freely.

Frozen documents require an approved Architecture Decision Record (ADR) before changes.

---

# Reading Order

The recommended reading order is:

```
000 Project Manifest
        │
001 README
        │
002 Project Context
        │
006 Design Decision Log
        │
003 Documentation Index
        │
004 Dependency Graph
        │
005 Generation Roadmap
        │
────────────
Vision
────────────
Education
────────────
Architecture
────────────
Campaigns
────────────
Implementation
```

---

# Foundation Documents

| ID | Document | Purpose | Audience | Status | Dependencies |
|----|----------|---------|----------|--------|--------------|
|000|PROJECT_MANIFEST.md|Repository entry point|Human + AI|Draft|None|
|001|README.md|Repository overview|Human|Draft|Manifest|
|002|PROJECT_CONTEXT.md|Project philosophy and architecture baseline|Human + AI|Draft|Manifest|
|003|DOCUMENTATION_INDEX.md|Documentation registry|Human + AI|Draft|Manifest|
|004|DOCUMENT_DEPENDENCY_GRAPH.md|Visual dependency graph|Human + AI|Planned|Manifest|
|005|GENERATION_ROADMAP.md|Document generation order|Human + AI|Planned|Dependency Graph|
|006|DESIGN_DECISION_LOG.md|Architectural decisions (ADR)|Human + AI|Draft|Project Context|
|007|AI_CONTRIBUTING_GUIDE.md|AI collaboration rules|AI|Planned|Project Context|
|008|PROJECT_KICKOFF_PROMPT.md|Reusable onboarding prompt|AI|Planned|AI Guide|

---

# Vision Documents

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|101|PROJECT_VISION.md|Long-term product vision|Planned|
|102|GUIDING_PRINCIPLES.md|Core design principles|Planned|
|103|NORTH_STAR.md|Single guiding philosophy|Planned|
|104|SUCCESS_CRITERIA.md|Measures of project success|Planned|

---

# Educational Design

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|201|EDUCATIONAL_PHILOSOPHY.md|Learning philosophy|Planned|
|202|LEARNING_FRAMEWORK.md|Learning model|Planned|
|203|CURRICULUM_MAPPING.md|Hidden curriculum mapping|Planned|
|204|SKILL_FRAMEWORK.md|Skills progression|Planned|
|205|ASSESSMENT_STRATEGY.md|Invisible assessment|Planned|
|206|EXPLORER_DEVELOPMENT_MODEL.md|Long-term learner growth|Planned|

---

# Platform Architecture

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|301|PLATFORM_ARCHITECTURE.md|Overall technical design|Planned|
|302|UX_GUIDELINES.md|Child experience guidelines|Planned|
|303|MISSION_SPECIFICATION.md|Mission architecture|Planned|
|304|REWARD_SYSTEM.md|Knowledge Cores and Explorer Ranks|Planned|
|305|PROGRESS_SYSTEM.md|State management|Planned|
|306|PARENT_MODE.md|Mission Control design|Planned|

---

# Campaign Framework

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|401|CAMPAIGN_TEMPLATE.md|Reusable campaign blueprint|Planned|
|402|MISSION_TEMPLATE.md|Mission authoring template|Planned|
|403|WORKBOOK_TEMPLATE.md|Printable workbook template|Planned|
|404|RABBIT_HOLE_LIBRARY.md|Curiosity extension library|Planned|

---

# Campaigns

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|501|CAMPAIGN_01.md|England–Scotland Bridging Campaign|Planned|
|502|CAMPAIGN_02.md|Future Campaign|Placeholder|
|503|CAMPAIGN_03.md|Future Campaign|Placeholder|

---

# Engineering

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|601|HTML_ARCHITECTURE.md|Portal structure|Planned|
|602|CSS_GUIDELINES.md|Visual system|Planned|
|603|JAVASCRIPT_ARCHITECTURE.md|Client logic|Planned|
|604|STATE_MANAGEMENT.md|Persistence model|Planned|
|605|TESTING_STRATEGY.md|Testing approach|Planned|
|606|DEPLOYMENT_GUIDE.md|Deployment process|Planned|

---

# Process

| ID | Document | Purpose | Status |
|----|----------|--------|--------|
|701|CHANGELOG.md|Project history|Planned|
|702|RELEASE_NOTES.md|Version summaries|Planned|
|703|BACKLOG.md|Future work|Planned|
|704|IDEAS.md|Captured ideas|Planned|
|705|KNOWN_LIMITATIONS.md|Current limitations|Planned|

---

# Audience Legend

| Audience | Meaning |
|----------|---------|
| Human | Parents, educators, developers |
| AI | AI contributors |
| Human + AI | Required reading for both |

---

# Status Legend

| Status | Meaning |
|--------|---------|
| Planned | Not yet created |
| Draft | In development |
| Review | Awaiting review |
| Approved | Approved baseline |
| Frozen | Stable and protected |
| Deprecated | Retained for historical reference |

---

# Naming Convention

All documentation follows the format:

```
NNN_DOCUMENT_NAME.md
```

Example:

```
301_PLATFORM_ARCHITECTURE.md
```

Document IDs are permanent.

They should never be renumbered.

---

# Registration Rules

Every new document must include:

- Unique document ID
- Version
- Status
- Owner
- Purpose
- Dependencies
- Intended audience
- Cross references

Every new document must also be registered here immediately after creation.

---

# Future Expansion

Explorer Academy is expected to grow significantly over time.

New document categories should be introduced only when an existing category can no longer reasonably contain the content.

Avoid creating duplicate sources of truth.

---

# Guiding Principle

A contributor should be able to locate any information in the repository within two minutes using only this document.