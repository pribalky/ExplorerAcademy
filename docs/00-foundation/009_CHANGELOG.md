# 009_CHANGELOG.md

> **Document:** Changelog
>
> **Document ID:** 009
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

This document records the significant evolution of Explorer Academy.

Unlike the Design Decision Log, which explains *why* decisions were made, the Changelog records *what* changed and *when*.

Only notable milestones should be recorded here.

Minor editorial changes do not require changelog entries.

---

# Versioning Policy

Explorer Academy follows Semantic Versioning.

- Major → Architectural milestone
- Minor → New capabilities
- Patch → Editorial or non-breaking improvements

---

# Repository Timeline

## v0.1.0

### Initial Project Concept

Created initial vision for an engaging educational platform bridging the England and Scotland primary curricula.

Key ideas:

- Hidden curriculum
- Story-driven learning
- Independent learner experience
- Printable workbook
- Browser-based portal

---

## v0.2.0

### Expanded Educational Vision

Introduced:

- Explorer identity
- Mission Control parent role
- Knowledge Cores
- Explorer Ranks
- Rabbit Holes
- Campaign-based architecture

---

## v0.3.0

### Documentation-First Architecture

Major change.

Project shifted from implementation-first to documentation-first.

Added:

- Project Manifest
- Repository architecture
- Documentation hierarchy
- AI collaboration workflow

---

## v0.4.0

### Foundation Documentation

Created:

- README
- Project Context
- Documentation Index
- Dependency Graph
- Generation Roadmap
- AI Contributing Guide
- Project Kickoff Prompt
- Design Decision Log

Repository foundation substantially complete.

---

## v0.5.0

### Portal and Campaign 1 Implementation

> **Note on versioning:** this entry documents implementation delivered well ahead of the Foundation-document-approval milestones below (v1.0.0/v1.1.0), which track document *status* (Draft → Approved → Frozen per 000_PROJECT_MANIFEST.md's Document Lifecycle) rather than code. Foundation documents remain formally Draft, so this is versioned as a v0.x continuation rather than claiming v1.0.0/v2.0.0's doc-approval milestones prematurely.

### Added

- Full platform engine: Router, Campaign Loader, Mission Engine, Activity Engine, Adaptive Scheduler, Storage Manager, Reward Engine, Discovery Log, Settings Manager.
- Campaign 1 ("Outpost Echo"), all 21 missions, compiled from `501_CAMPAIGN_01.md` and polished to the Mission Quality Checklist bar.
- Asset Compiler output for every mission: notebook pages, parent enrichment, image specifications, experiments, printables where genuinely justified.
- Parent Mode: curriculum mapping, progress dashboard, per-mission assessment evidence backed by real Discovery Log entries, suggested interventions, extension ideas.
- Visual assets: flat-vector SVG for all 24 image specs and 10 reward icons (documented placeholder pending real illustration capability — see ADR-019).
- Printable workbook: compiled 47-page PDF, answer guide, notebook alternatives, parent guide — all optional per ADR-005.
- Knowledge Core / Explorer Rank catalogs, resolved into Explorer Profile and Parent Mode reward displays.
- Parent-selectable session duration, wired into the Adaptive Scheduler.

### Changed

- `504_JSON_SCHEMA.md` extended additively in several places where implementation found real gaps against the original spec (Discovery Log Entry fields, Mission's required `parentGuide`, Reward's optional `coreId`/`rankId`) — see ADR-014 through ADR-023 for the individual decisions.

### Notes

See `006_DESIGN_DECISION_LOG.md`'s ADR-012 through ADR-023 for the individual architectural decisions made while building this milestone.

---

## Future Releases

### v1.0.0

Planned

Foundation frozen.

Vision documents approved.

Educational philosophy established.

Architecture baseline complete.

---

### v1.1.0

Planned

Platform architecture complete.

Campaign framework complete.

---

### v2.0.0

Delivered ahead of schedule as v0.5.0 above, pending only the Foundation-document-approval status this entry originally described. Once Foundation documents formally move from Draft to Approved (v1.0.0/v1.1.0 above), this version number can be assigned retroactively.

---

### v3.0.0

Planned

Explorer Academy Beta.

Multi-campaign support.

Reusable campaign authoring workflow.

---

# Changelog Entry Template

Every future entry should include:

## Version

Release date

Summary

### Added

-

### Changed

-

### Removed

-

### Deprecated

-

### Fixed

-

### Notes

---

# Recording Rules

Record only changes that:

- alter architecture
- introduce new capabilities
- change educational philosophy
- affect contributor workflows
- change project direction

Do not record:

- spelling fixes
- formatting changes
- editorial rewrites
- document reordering
- cosmetic improvements

---

# Relationship to Other Documents

| Document | Purpose |
|-----------|---------|
| Design Decision Log | Why decisions were made |
| Changelog | What changed |
| Project Manifest | Current project state |
| Generation Roadmap | What comes next |

Together these documents provide:

- historical context
- current status
- future direction

---

# Guiding Principle

A contributor should be able to understand how Explorer Academy evolved over time by reading this document alone, without needing access to previous conversations or commit history.