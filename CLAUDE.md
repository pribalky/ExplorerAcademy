# CLAUDE.md

# Explorer Academy AI Contributor Guide

This repository contains the Explorer Academy educational platform.

Read this file before making any changes.

---

# Mission

Build a lightweight, offline-first educational adventure platform that separates:

- Platform
- Campaign Content

The platform is permanent.

Campaigns are replaceable.

Never mix the two.

---

# Source of Truth

Always read documentation before coding.

Priority order:

1. docs/00-foundation/000_PROJECT_MANIFEST.md
2. docs/00-foundation/002_PROJECT_CONTEXT.md
3. docs/00-foundation/006_DESIGN_DECISION_LOG.md
4. docs/00-foundation/007_AI_CONTRIBUTING_GUIDE.md
5. docs/30-architecture/301_PLATFORM_ARCHITECTURE.md
6. docs/40-campaigns/401_CAMPAIGN_TEMPLATE.md
7. docs/40-campaigns/402_MISSION_TEMPLATE.md
8. docs/50-content/503_DATA_MODEL.md
9. docs/50-content/504_JSON_SCHEMA.md
10. docs/60-engineering/601_HTML_ARCHITECTURE.md

Repository documentation overrides conversation history.

---

# Core Principles

Always prefer:

- Data-driven architecture
- Small commits
- Small pull requests
- Modular JavaScript
- Generic rendering
- Reusable components
- Composition over duplication
- Readability over cleverness

Never hardcode campaign behaviour.

---

# Technology Constraints

Use only:

- HTML5
- CSS3
- Vanilla JavaScript

No frameworks.

No npm.

No build tools.

No transpilers.

No external runtime dependencies unless explicitly approved.

The application should run from a lightweight local web server.

---

# Repository Layout

```
docs/
portal/
assets/
scripts/
tests/
```

Workbook content is not a top-level directory — it lives under each campaign's own `portal/campaigns/campaignXX/generated/workbook/`, alongside that campaign's other generated assets (see Campaign Structure below).

Within `portal/`:

```
campaigns/
components/
css/
js/
parent/
assets/
data/
```

---

# Campaign Structure

Campaign source content lives in:

```
portal/
└── campaigns/
    └── campaignXX/
        └── src/
```

Generated assets belong in:

```
portal/
└── campaigns/
    └── campaignXX/
        └── generated/
```

Never overwrite source content.

Only generate derived artefacts inside `generated/`.

---

# Platform Rules

The platform owns:

- Navigation
- Rendering
- Scheduler
- Save State
- Rewards
- Discovery Log
- Parent Mode

Campaigns own:

- Story
- Missions
- Activities
- Characters
- Locations
- Workbook Content
- Parent Notes

Maintain this separation.

---

# Development Workflow

Before making changes:

1. Read relevant documentation.
2. Explain the intended change.
3. Identify affected files.
4. Assess risks.
5. Implement.
6. Verify.
7. Summarise.

Avoid architectural changes unless explicitly requested.

---

# Coding Standards

Prefer:

- Pure functions
- Small modules
- Descriptive names
- Early returns
- Single responsibility
- Configuration over hardcoding

Avoid:

- Global variables
- Circular dependencies
- Duplicated logic
- Deep nesting
- Magic numbers

---

# State Management

Persistent state belongs only in the storage layer.

Do not duplicate state.

Do not keep unnecessary global state.

---

# Data Model

Campaign JSON must follow:

```
503_DATA_MODEL.md
504_JSON_SCHEMA.md
```

Never invent fields.

Never silently rename fields.

Maintain backwards compatibility whenever practical.

---

# Accessibility

Every feature should support:

- Keyboard navigation
- Responsive layout
- Semantic HTML
- Readable typography
- High contrast

Accessibility is a requirement.

---

# Performance

Optimise for simplicity.

Prefer:

- Lazy loading
- Minimal DOM updates
- Small JavaScript modules
- Efficient rendering

Avoid premature optimisation.

---

# Error Handling

Fail gracefully.

Missing data should not crash the application.

Provide sensible fallbacks.

Log useful diagnostic information.

---

# Commit Philosophy

One logical change per commit.

Each commit should leave the application in a runnable state.

Avoid partially implemented features.

---

# Definition of Done

A task is complete when:

- Code is readable.
- Documentation remains accurate.
- Existing behaviour is preserved.
- New behaviour is tested manually.
- No campaign-specific logic exists in the platform.

---

# Guiding Principle

> Build a reusable learning engine that can power unlimited educational adventures without changing its core architecture.

---

# Repository Workflow

Before starting any work:

1. Read `CURRENT_TASK.md` and `CLAUDE.MD`.
2. Read only the documentation relevant to the current task.
3. Produce a short implementation plan.
4. Identify the files that will change.
5. Wait for confirmation only if the requested change alters architecture or public data contracts.
6. Otherwise, implement the current milestone.
7. Verify the application still runs.
8. Update `CURRENT_TASK.md` when the milestone is complete.
9. Update `TODO.md` by marking completed items.
10. If architecture, data model, or JSON schema changes, update the appropriate documentation before finishing.

Never begin the next milestone automatically.

Always stop after completing the current milestone and provide:

- Summary
- Files changed
- Manual testing performed
- Suggested next milestone

# Milestone Lifecycle

At the completion of every milestone:

1. Verify the implementation.
2. Update CURRENT_TASK.md:
   - Mark the milestone as COMPLETE.
   - Add a completion summary.
3. Read TODO.md.
4. Determine the next unchecked milestone.
5. Rewrite CURRENT_TASK.md to describe only that next milestone.
6. Update TODO.md to mark the completed milestone.
7. Stop.

Never begin implementing the newly generated CURRENT_TASK.md.

Always wait for user approval before starting the next milestone.

When generating CURRENT_TASK.md, always use this structure:

# CURRENT_TASK

Phase

Milestone

Objective

Inputs

Relevant Documentation

Files Expected to Change

Implementation Plan

Out of Scope

Success Criteria

Manual Verification

Deliverables

Completion Notes