# ARCHITECTURE.md

> **Explorer Academy – Codebase Architecture**
>
> Version: 1.0
>
> This document describes the implementation architecture of the Explorer Academy codebase.
>
> Design decisions belong in `/docs`.
>
> This document describes how the software is organised.

---

# Philosophy

Explorer Academy is a lightweight, offline-first, data-driven educational platform.

The platform contains generic rendering logic.

Campaigns contain educational content.

The platform must never contain campaign-specific behaviour.

The codebase should remain understandable without build tools or frameworks.

---

# Core Principles

- HTML, CSS and JavaScript only
- No external frameworks
- Offline-first
- Progressive enhancement
- Component-based architecture
- Data-driven rendering
- Configuration over hardcoding
- One responsibility per module
- Small, readable files
- Campaign-agnostic platform

---

# Repository Structure

```
ExplorerAcademy/

docs/               → Architecture and documentation

portal/
│
├── index.html
├── assets/
├── campaigns/
├── components/
├── css/
├── js/
├── parent/
└── data/

workbook/

scripts/
```

---

# Portal Structure

```
portal/

assets/
    images/
    icons/
    audio/

campaigns/
    campaign01/
    campaign02/
    shared/

components/
    story/
    activities/
    navigation/
    rewards/
    ui/

css/
    base.css
    layout.css
    components.css
    themes.css

js/
    app.js
    router.js
    scheduler.js
    storage.js
    campaign-loader.js
    mission-engine.js
    activity-engine.js
    reward-engine.js
    discovery-log.js
    parent-mode.js
    settings.js
    utils.js

parent/
    index.html

data/
    schemas/
```

---

# Architectural Layers

```
Explorer Experience

↓

UI Components

↓

Application Modules

↓

Campaign Data

↓

Local Storage
```

Each layer communicates only with the layer immediately below it.

---

# Responsibilities

## HTML

Responsible for:

- semantic structure
- accessibility
- placeholders

Contains no business logic.

---

## CSS

Responsible for:

- layout
- typography
- responsive design
- themes
- animations

Contains no application behaviour.

---

## JavaScript

Responsible for:

- rendering
- navigation
- scheduling
- persistence
- state
- interaction

---

## Campaign Data

Responsible for:

- story
- missions
- activities
- rewards
- parent notes

Contains no executable code.

---

# Module Responsibilities

| Module | Responsibility |
|---------|----------------|
| app.js | Application bootstrap |
| router.js | Page navigation |
| campaign-loader.js | Loads campaign data |
| mission-engine.js | Renders missions |
| activity-engine.js | Renders activities |
| scheduler.js | Builds today's mission |
| reward-engine.js | Progress & rewards |
| storage.js | Local persistence |
| discovery-log.js | Explorer notebook |
| parent-mode.js | Parent interface |
| settings.js | User preferences |
| utils.js | Shared helper functions |

Modules should communicate through clearly defined public interfaces.

Avoid circular dependencies.

---

# Coding Standards

Prefer:

- small files
- descriptive names
- pure functions
- early returns
- composition over inheritance
- immutable data where practical

Avoid:

- global variables
- duplicated logic
- hardcoded values
- deeply nested conditionals
- campaign-specific code

---

# Naming Conventions

Folders

```
kebab-case
```

Files

```
kebab-case.js
```

Variables

```
camelCase
```

Classes

```
PascalCase
```

Constants

```
UPPER_SNAKE_CASE
```

JSON keys

```
camelCase
```

---

# State Management

The application maintains a single logical state.

Examples:

- active campaign
- current mission
- completed activities
- explorer profile
- rewards
- discovery log
- settings

Persistent state is managed through `storage.js`.

---

# Data Flow

```
Campaign JSON

↓

Campaign Loader

↓

Mission Engine

↓

Activity Engine

↓

UI Components

↓

Explorer
```

The UI never directly reads campaign files.

---

# Error Handling

Every module should fail gracefully.

Examples:

- missing campaign
- invalid JSON
- missing activity
- corrupt save

Errors should never crash the application.

Fallback behaviour should always exist.

---

# Performance Guidelines

Optimise for simplicity before optimisation.

Guidelines:

- Lazy load campaign data.
- Cache frequently used assets.
- Minimise DOM updates.
- Avoid unnecessary re-rendering.
- Keep JavaScript dependency-free.

---

# Accessibility

Every feature should support:

- keyboard navigation
- readable typography
- high contrast
- responsive layout
- meaningful HTML semantics

Accessibility is a requirement, not a future enhancement.

---

# AI Contributor Guidelines

When modifying the codebase:

- Read relevant documentation first.
- Preserve the platform/content separation.
- Do not introduce campaign-specific logic.
- Keep changes modular.
- Update documentation if architecture changes.
- Prefer extending existing modules over creating new ones.

---

# Build Philosophy

Every commit should leave the application in a runnable state.

Implement one milestone at a time.

Avoid partially completed features.

The goal is continuous progress through small, testable increments.

---

# Definition of Done

A feature is complete when:

- Code is readable.
- No existing functionality is broken.
- Documentation remains accurate.
- The application runs successfully.
- The implementation follows the platform architecture.

---

# Guiding Principle

> **Build a platform that can tell unlimited stories without changing its engine.**