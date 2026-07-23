# 601_HTML_ARCHITECTURE.md

> **Document:** HTML Architecture
>
> **Document ID:** 601
>
> **Version:** 1.0.0
>
> **Status:** Draft
>
> **Owner:** Platform Architect
>
> **Audience:** Developers, AI Contributors
>
> **Last Updated:** 2026-07-19

---

# Purpose

This document defines the implementation architecture of the Explorer Academy web portal.

Unlike the Platform Architecture document, which describes *what* the platform should do, this document describes *how the browser application should be organised* to deliver that experience.

It is intended to act as the implementation blueprint for the entire learner portal while remaining independent of any specific JavaScript framework or build system.

A developer or AI contributor should be able to implement the complete platform using only:

- `301_PLATFORM_ARCHITECTURE.md`
- `401_CAMPAIGN_TEMPLATE.md`
- `402_MISSION_TEMPLATE.md`
- `501_CAMPAIGN_01.md`
- `601_HTML_ARCHITECTURE.md`

---

# Scope

This document defines:

- Portal architecture
- Repository structure
- HTML page responsibilities
- Component hierarchy
- Platform modules
- Data contracts
- Rendering pipeline
- Local storage
- Navigation
- Accessibility
- Performance expectations
- Extensibility

It deliberately avoids implementation code.

---

# Dependencies

This document assumes familiarity with:

- Project Manifest
- Project Context
- Design Decision Log
- Platform Architecture
- Campaign Template
- Mission Template

Where conflicts occur, higher-level architecture documents take precedence.

---

# Overall Architecture

## Architectural Philosophy

Explorer Academy is designed as a **content-driven application**.

The software platform should remain largely unchanged while campaigns, missions and educational content evolve independently.

The portal is therefore divided into two major concerns:

**Platform**

Responsible for:

- navigation
- rendering
- scheduling
- persistence
- rewards
- learner profile
- parent mode
- settings

**Campaign Content**

Responsible for:

- story
- missions
- activities
- assets
- educational resources
- workbook references
- parent guidance

The platform understands **how** to present a campaign.

The campaign defines **what** is presented.

This separation ensures future campaigns can be added without modifying platform behaviour.

---

## Application Philosophy

Explorer Academy follows several architectural principles established in the project foundation.

### Documentation First

Implementation follows documentation.

Architecture should never be inferred solely from code.

### Adventure Before Education

The interface presents missions and discoveries rather than lessons and worksheets.

Curriculum terminology remains hidden from learners.

### Data Drives Behaviour

The application should render its interface from campaign data rather than hard-coded pages.

Campaign authors should be able to introduce new adventures without changing platform logic.

### Progressive Disclosure

Children should only see information required for their current mission.

Additional guidance appears only when required.

Parent information remains isolated from the learner experience.

### Offline First

Internet connectivity should enhance the experience rather than enable it.

After initial loading, a complete campaign should remain usable without network access, consistent with ADR-004. :contentReference[oaicite:0]{index=0}

---

# Static Site Architecture

Explorer Academy should be deployable as a static website.

No server-side processing is required for normal learner operation.

Core responsibilities include:

- Loading campaign data
- Rendering mission pages
- Managing navigation
- Persisting learner progress locally
- Loading assets
- Displaying printable resources
- Managing settings

All learner state is stored locally within the browser.

This architecture enables deployment to:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Local filesystem
- USB distribution
- School intranets

No backend dependency should exist for core functionality.

> **Correction (found during the post-Milestone-11 audit):** "Local filesystem" and "USB distribution" — opening `portal/index.html` directly via a `file://` URL, with no web server at all — have never actually worked, verified back to Phase 1: `app.js` and every module it imports use native ES `import`/`export` (`<script type="module">`), and browsers (confirmed in Chromium) block ES module loading under `file://` with a CORS error, before a single line of application code runs. This is a pre-existing gap, not something any later milestone introduced. GitHub Pages, Netlify, Cloudflare Pages and school intranets are unaffected since they all serve over `http(s)://`, a real origin. Genuinely supporting `file://` would mean dropping ES modules platform-wide (e.g. bundling into a single non-module script, or using dynamic `import()` behind a loader with its own workarounds) — an architecture-level change requiring its own ADR and explicit approval, not a quiet fix.

---

# Offline-First Architecture

Offline capability is a fundamental architectural requirement rather than an enhancement. This reflects the project's commitment that internet access should enhance, but never enable, the learner experience. :contentReference[oaicite:1]{index=1}

The portal should therefore assume the following lifecycle:

1. Initial application load
2. Campaign assets downloaded
3. Campaign data cached
4. Static resources cached
5. Application operates entirely from local storage

During normal mission play the platform should never require an active internet connection.

External resources, such as recommended videos or websites, should always be optional "Rabbit Hole" enhancements and clearly identified as requiring connectivity.

---

# Data-Driven Architecture

Explorer Academy should behave as a rendering engine rather than a collection of handcrafted pages.

Every learner experience should be generated from structured campaign data.

The rendering flow follows a consistent hierarchy:

```
Campaign
    ↓
Mission
    ↓
Activity
    ↓
Component
    ↓
Rendered HTML
```

The platform should never contain campaign-specific logic.

Instead it interprets structured content supplied by campaign files.

This allows:

- unlimited campaigns
- reusable rendering logic
- simplified testing
- easier localisation
- independent campaign authoring
- future AI-generated campaigns

The application engine therefore becomes stable while content continues to evolve.

---

# Separation of Platform and Campaign Content

Maintaining a strict separation between platform behaviour and campaign content is essential to the long-term maintainability of Explorer Academy.

## Platform Responsibilities

The platform owns:

- application shell
- navigation
- routing
- rendering engine
- storage
- scheduler
- accessibility
- progress tracking
- settings
- parent mode
- reward presentation
- discovery log management

Platform code should never reference individual campaigns by name.

---

## Campaign Responsibilities

Each campaign owns:

- narrative
- mission definitions
- activity sequences
- educational content
- illustrations
- downloadable resources
- printable workbook pages
- optional rabbit holes
- parent notes
- campaign rewards

Campaigns should behave as self-contained content packages.

---

## Platform–Campaign Contract

Communication between the platform and campaign content should occur exclusively through defined data structures.

The platform requests:

```
Campaign Data
```

The campaign returns:

```
Campaign
    Missions
        Activities
            Assets
            Rewards
            Parent Notes
```

The platform renders the experience without understanding the educational subject matter.

This architectural boundary ensures that Campaign 20 should require no modification to the rendering engine beyond the introduction of genuinely new activity types.

---

# Repository Structure

The repository should be organised so that platform code, campaign content and supporting resources remain independent.

```text
portal/
│
├── index.html
├── campaigns/
│   ├── campaign01/
│   │   ├── src/
│   │   │   ├── campaign.json
│   │   │   ├── missions/
│   │   │   ├── world/
│   │   │   ├── resources/
│   │   │   ├── workbook/
│   │   │   └── parent/
│   │   └── generated/
│   │       ├── workbook/
│   │       ├── parent/
│   │       ├── resources/
│   │       └── image-specifications/
│   └── ...
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── audio/
│
├── components/
│   ├── story/
│   ├── activities/
│   ├── navigation/
│   ├── rewards/
│   └── ui/
│
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── themes.css
│
├── js/
│   ├── app.js
│   ├── router.js
│   ├── scheduler.js
│   ├── storage.js
│   ├── campaign-loader.js
│   ├── mission-engine.js
│   ├── activity-engine.js
│   ├── reward-engine.js
│   ├── discovery-log.js
│   ├── parent-mode.js
│   ├── settings.js
│   └── utils.js
│
├── data/
│   └── schemas/
│
└── parent/
    └── index.html
```

> **Correction (added during the pre-Phase-10 audit):** the sentence below contradicted the Repository Structure tree directly above it, which already correctly shows `generated/workbook/` nested under each campaign. Printable workbook resources live at `portal/campaigns/<campaign>/generated/workbook/`, alongside that campaign's other generated assets — not in a repository-root `workbook/` directory. A root `workbook/` directory was scaffolded early on but was never used and has been removed from the documented structure; this keeps workbook content correctly owned by its campaign rather than shared platform-wide, consistent with this document's own Platform/Campaign separation.

This structure ensures:

- clear ownership boundaries
- scalable campaign growth
- reusable UI components
- isolated platform logic
- independent content authoring
- minimal code changes when adding future campaigns

The addition of a new campaign should primarily involve creating a new campaign directory and associated content files, without requiring modifications to the platform architecture itself.

# HTML Structure

The Explorer Academy portal is organised as a collection of logical application pages rather than individual campaign-specific pages.

Every page exists to support the platform experience.

Campaign data determines the content displayed within these pages.

No page should be duplicated for individual campaigns.

---

# Page Architecture

The portal consists of the following primary pages.

```
Home
    ↓
Campaign Select
    ↓
Campaign Overview
    ↓
Mission
        ↓
Activities
        ↓
Reflection
        ↓
Mission Complete
    ↓
Discovery Log
    ↓
Explorer Profile

Parent Mode

Settings
```

Every page shares a common application shell consisting of:

```
+---------------------------------------------------+
| Explorer Header                                   |
+---------------------------------------------------+
|                                                   |
| Main Content Area                                 |
|                                                   |
|                                                   |
+---------------------------------------------------+
| Context Navigation                                |
+---------------------------------------------------+
```

The application shell should remain consistent throughout the platform while only the main content changes.

---

# Home Page

## Purpose

The Home page serves as the learner's entry point into Explorer Academy.

It should immediately reinforce the feeling that the learner is entering an adventure rather than an educational application.

Its responsibilities are to:

- welcome the explorer
- restore previous progress
- provide access to campaigns
- display recent discoveries
- surface earned achievements
- allow continuation of the current mission

The Home page should avoid overwhelming the learner with information.

Only the most relevant actions should be immediately visible.

---

## Primary Actions

- Continue Current Mission
- Choose Campaign
- View Explorer Profile
- Open Discovery Log
- Open Settings

Parent Mode should never be visible from the main learner interface.

---

## Typical Layout

```
Explorer Academy

Welcome Back

Continue Mission

Recent Discovery

Achievements

Campaign Selection

Footer Navigation
```

---

# Campaign Select Page

## Purpose

Displays every installed campaign available on the device.

Campaigns should behave as independent content packages.

Selecting a campaign should not immediately begin a mission.

Instead, it should open the Campaign Overview.

---

## Responsibilities

- display campaign artwork
- display campaign title
- show completion progress
- indicate campaign availability
- restore current campaign
- support future campaign expansion

Campaign cards should be generated dynamically from campaign metadata.

No campaign should be hardcoded into the interface.

---

# Campaign Overview Page

## Purpose

Introduces the selected campaign before play begins.

This page establishes context while allowing the learner to understand their progress.

---

## Responsibilities

Display:

- campaign title
- campaign synopsis
- explorer briefing
- campaign progress
- completed missions
- available mission
- rewards earned
- estimated completion

Primary action:

```
Begin Mission
```

Secondary actions:

```
Discovery Log

Explorer Profile

Return Home
```

---

# Mission Page

## Purpose

The Mission page is the core experience of Explorer Academy.

Nearly all learner interaction occurs here.

The Mission page should act as a container rather than a static document.

It dynamically renders the current mission based on campaign data.

---

## Responsibilities

Display:

- mission title
- mission objective
- story introduction
- estimated duration
- current progress
- activity list

The Mission page should never contain hardcoded activities.

Activities are rendered dynamically.

---

## Mission Layout

```
Mission Header

Story Introduction

Current Objective

Activity Sequence

Mission Progress

Navigation
```

Only one activity should normally receive primary focus.

Future activities remain collapsed until appropriate.

---

# Activity View

Activities are rendered inside the Mission page.

Each activity type should share a common lifecycle while allowing specialised presentation.

Generic lifecycle:

```
Introduction

↓

Instructions

↓

Learner Interaction

↓

Reflection

↓

Completion
```

Examples include:

- Reading
- Investigation
- Mathematics
- Experiment
- Engineering Challenge
- Creative Task
- Discussion
- Reflection

Each activity renderer is responsible only for presenting one activity.

---

# Reflection Page

## Purpose

Encourages learners to think about what they discovered rather than simply confirming completion.

Reflection reinforces the project's educational philosophy of curiosity before curriculum.

---

## Responsibilities

Display prompts such as:

- What surprised you?
- What questions do you still have?
- What would you investigate next?
- What evidence supports your conclusion?

Responses may optionally be stored in the Discovery Log.

---

# Mission Complete Page

## Purpose

Provides narrative closure for the completed mission.

The focus is celebration and anticipation rather than scoring.

---

## Responsibilities

Display:

- mission summary
- discoveries unlocked
- rewards earned
- next mission preview
- rabbit hole recommendations
- updated campaign progress

Primary action:

```
Continue Adventure
```

---

# Discovery Log

## Purpose

The Discovery Log acts as the learner's field notebook.

Rather than functioning as a grading record, it becomes a growing collection of observations, sketches and discoveries.

---

## Responsibilities

Display:

- completed discoveries
- learner reflections
- unlocked facts
- saved questions
- achievements
- collected artefacts

Entries should be searchable and organised chronologically.

Future campaigns should contribute to the same Discovery Log.

---

# Explorer Profile

## Purpose

Represents the learner rather than an account.

It records long-term exploration across every campaign.

---

## Responsibilities

Display:

- explorer name
- avatar
- completed campaigns
- missions completed
- discoveries recorded
- achievements
- favourite campaign
- exploration statistics

This page should celebrate progress without encouraging unhealthy competition.

No public leaderboards should exist.

---

# Parent Mode

## Purpose

Parent Mode provides access to educational information while remaining completely separate from the learner experience, consistent with ADR-006 (Hidden Parent Mode). :contentReference[oaicite:0]{index=0}

This page should never appear during normal learner navigation.

---

## Responsibilities

Display:

- campaign overview
- curriculum mapping
- mission preparation
- required materials
- printable resources
- completed learning outcomes
- session duration settings
- progress reports

Parents should be able to understand *what* the learner is doing without exposing curriculum terminology to the learner.

---

# Settings

## Purpose

Allows configuration of platform-wide behaviour.

Settings should be intentionally minimal to avoid distracting from the adventure.

---

## Responsibilities

Manage:

- explorer profile
- preferred session duration
- accessibility options
- audio preferences
- reset progress
- import/export saves
- offline resource management

Settings should apply globally rather than per campaign.

---

# Shared Layout Regions

Every page should be composed from consistent layout regions.

```
+--------------------------------------------------+
| Header                                           |
+--------------------------------------------------+
| Hero / Context                                   |
+--------------------------------------------------+
| Main Content                                     |
|                                                  |
|                                                  |
+--------------------------------------------------+
| Context Actions                                  |
+--------------------------------------------------+
| Footer Navigation                                |
+--------------------------------------------------+
```

Maintaining a consistent layout allows reusable components, predictable navigation and improved accessibility.

---

# Navigation Principles

Navigation should follow several core principles.

## Story First

Navigation should always reinforce the feeling of progressing through an adventure.

## Progressive Disclosure

Only show information needed for the learner's current stage.

Avoid exposing future missions prematurely.

## Context Awareness

Navigation options should change depending on:

- campaign state
- mission progress
- completed activities
- learner role (Explorer or Parent)

## Safe Recovery

Learners should always be able to leave a page and return without losing progress.

All mission state should be recoverable from local storage.

---

# Responsive Behaviour

The HTML structure should support a responsive layout without requiring different page implementations.

Target layouts include:

- Desktop
- Laptop
- Tablet
- Large mobile devices

Navigation should adapt while preserving the same information architecture.

No content should become inaccessible due to screen size.

The platform should prioritise readability, generous spacing and touch-friendly controls over dense information displays.

# Component Architecture

Explorer Academy is built from reusable interface components.

Components are responsible for presenting information and handling user interaction.

They should not contain campaign-specific knowledge or educational logic.

Instead, components receive structured data from the rendering engine and display it consistently.

This architecture allows new campaigns to reuse the same components without modification.

---

# Component Design Principles

Every component should follow these principles.

## Single Responsibility

Each component should perform one clearly defined role.

Examples:

- display a mission
- present a story
- collect learner input
- show progress

Components should never perform multiple unrelated tasks.

---

## Data Driven

Components receive data.

They do not generate it.

They should never hardcode campaign content.

---

## Stateless Where Possible

Reusable presentation components should avoid storing application state.

Persistent state belongs to the platform engine.

---

## Composable

Complex pages should be assembled from smaller reusable components.

For example:

```
Mission Page

↓

Mission Header

↓

Story Panel

↓

Activity Cards

↓

Progress Tracker

↓

Navigation
```

---

# Component Hierarchy

```
Application Shell
│
├── Header
├── Navigation
├── Notification Layer
├── Modal Layer
│
├── Page Components
│
│   ├── Home
│   ├── Campaign
│   ├── Mission
│   ├── Discovery Log
│   ├── Parent Mode
│   └── Settings
│
└── Shared Components
```

The Application Shell owns global layout while individual pages assemble reusable components.

---

# Mission Card

## Purpose

Represents a single mission within a campaign.

Used throughout:

- Campaign Overview
- Mission Selection
- Progress Screens

---

## Inputs

- Mission metadata
- Completion status
- Unlock state
- Estimated duration
- Reward summary

---

## Outputs

- Selected Mission
- Continue Mission
- Locked notification

---

## Responsibilities

Display:

- mission title
- mission number
- summary
- completion indicator
- estimated time
- unlock status

The Mission Card should not render mission activities.

---

# Story Panel

## Purpose

Displays narrative content.

The Story Panel is responsible for maintaining immersion throughout the campaign.

---

## Inputs

- title
- narrative text
- illustration
- optional dialogue
- optional audio

---

## Outputs

None.

It is purely presentational.

---

## Responsibilities

- render story
- support illustrations
- support embedded callouts
- support optional narration

---

# Activity Card

## Purpose

Represents one learner activity.

Every activity type should inherit the same basic presentation pattern.

---

## Inputs

- activity definition
- activity type
- completion state
- required materials
- estimated duration

---

## Outputs

- activity started
- activity completed
- learner response
- optional evidence

---

## Responsibilities

Present:

- objective
- instructions
- interaction area
- completion control

The Activity Card delegates specialist rendering to activity-specific components.

---

# Activity Renderer

## Purpose

Provides specialised rendering for each activity type.

Examples include:

- Reading
- Investigation
- Experiment
- Mathematics
- Engineering
- Reflection
- Creative Challenge

Each renderer shares a common lifecycle while allowing different presentation.

---

## Inputs

- activity data
- learner progress
- configuration

---

## Outputs

- completion
- learner responses
- generated discoveries

---

## Responsibilities

Render only one activity.

Business logic remains within the platform engine.

---

# Progress Tracker

## Purpose

Shows learner progression through the current mission.

Progress should emphasise exploration rather than percentage completion.

---

## Inputs

- completed activities
- remaining activities
- optional rabbit holes

---

## Outputs

None.

---

## Responsibilities

Display:

- current stage
- mission progress
- optional discoveries
- remaining objectives

Rabbit Hole activities should appear separately from mandatory progression.

---

# Navigation Component

## Purpose

Provides consistent navigation throughout the application.

---

## Inputs

- current page
- current campaign
- current mission
- available actions

---

## Outputs

- navigation requests

---

## Responsibilities

Present only contextually relevant navigation.

Avoid overwhelming the learner with unnecessary options.

---

# Story Timeline

## Purpose

Visualises campaign progression.

Acts as a narrative roadmap rather than a checklist.

---

## Inputs

- completed missions
- unlocked missions
- current mission

---

## Outputs

- mission selection

---

## Responsibilities

Help learners understand where they are within the story.

---

# Discovery Log Entry

## Purpose

Represents a single discovery.

---

## Inputs

- discovery title
- category
- learner notes
- timestamp
- illustration
- campaign reference

---

## Outputs

None.

---

## Responsibilities

Display discoveries consistently regardless of campaign.

---

# Reward Popup

## Purpose

Celebrates meaningful milestones.

Rewards reinforce curiosity rather than completion.

---

## Inputs

- reward
- achievement
- unlocked content

---

## Outputs

- dismissed

---

## Responsibilities

Display:

- badge
- narrative reward
- discovery
- celebration message

Rewards should avoid excessive animation or interruption.

---

# Hint Panel

## Purpose

Provides optional learner support.

Hints should encourage thinking rather than reveal answers immediately.

---

## Inputs

- hint sequence
- learner progress

---

## Outputs

- hint requested

---

## Responsibilities

Reveal hints progressively.

Example:

Hint 1

↓

Hint 2

↓

Hint 3

↓

Complete explanation

Learners should remain in control of requesting assistance.

---

# Timer Component

## Purpose

Supports optional time-aware activities.

The timer should never pressure learners.

---

## Inputs

- recommended duration
- elapsed time

---

## Outputs

- timer complete

---

## Responsibilities

Provide gentle pacing.

The timer is advisory rather than mandatory.

---

# Materials Panel

## Purpose

Displays materials required for an activity.

---

## Inputs

- required materials
- optional materials

---

## Outputs

None.

---

## Responsibilities

Clearly distinguish:

- Required
- Optional
- Household alternatives

This supports the project's low-preparation philosophy.

---

# Reflection Panel

## Purpose

Captures learner thinking following an activity or mission.

---

## Inputs

- reflection prompts
- previous responses

---

## Outputs

- learner reflection

---

## Responsibilities

Support:

- text responses
- sketches (if implemented)
- saved questions
- observations

Responses may optionally populate the Discovery Log.

---

# Rabbit Hole Card

## Purpose

Represents optional enrichment activities.

Rabbit Holes should never block mission completion.

---

## Inputs

- rabbit hole title
- estimated duration
- external resources
- curiosity prompts

---

## Outputs

- rabbit hole started
- rabbit hole completed

---

## Responsibilities

Encourage further exploration while clearly identifying activities as optional.

---

# Explorer Badge

## Purpose

Displays earned achievements and campaign milestones.

---

## Inputs

- badge metadata
- earned date
- associated campaign

---

## Outputs

None.

---

## Responsibilities

Provide a consistent visual representation of achievements across the platform.

---

# Modal Component

## Purpose

Handles temporary interactions requiring learner attention.

Examples include:

- confirmation dialogs
- achievement notifications
- mission briefings
- warnings
- onboarding

---

## Inputs

- modal content
- action buttons

---

## Outputs

- confirm
- cancel
- dismiss

---

## Responsibilities

Provide a consistent overlay system without duplicating dialog behaviour.

---

# Notification Component

## Purpose

Displays lightweight, non-blocking feedback.

Examples:

- Progress saved
- Discovery recorded
- Workbook available
- Offline mode enabled

---

## Inputs

- notification type
- message
- priority

---

## Outputs

None.

---

## Responsibilities

Communicate platform events without interrupting the learner's flow.

---

# Component Relationships

The component hierarchy should follow a clear composition model.

```
Application Shell
│
├── Header
├── Navigation
│
├── Page
│   │
│   ├── Hero
│   ├── Mission Card
│   ├── Story Panel
│   ├── Progress Tracker
│   ├── Activity Card
│   │      │
│   │      ├── Reading Renderer
│   │      ├── Investigation Renderer
│   │      ├── Experiment Renderer
│   │      ├── Mathematics Renderer
│   │      ├── Reflection Renderer
│   │      └── Creative Renderer
│   │
│   ├── Reward Popup
│   ├── Discovery Entry
│   └── Navigation
│
└── Global Components
    ├── Notifications
    ├── Modal Layer
    └── Settings
```

This composition ensures that new activity types, rewards and campaigns can be introduced by extending the component library rather than altering the overall application architecture.

# JavaScript Module Architecture

Explorer Academy should be implemented as a collection of independent modules with clearly defined responsibilities.

The platform engine should coordinate these modules while campaign content remains entirely data-driven.

No module should contain campaign-specific behaviour.

The architecture should favour composition over tightly coupled dependencies, allowing modules to evolve independently and making future activity types or campaigns easy to add.

---

# Module Overview

```
Application

│

├── Router
├── Campaign Loader
├── Rendering Engine
├── Mission Engine
├── Scheduler
├── Storage Manager
├── Reward Engine
├── Discovery Log
├── Workbook Manager
├── Parent Mode
├── Settings Manager
├── Asset Manager
├── Accessibility Manager
└── Event Bus
```

The Application coordinates modules but should contain very little business logic.

---

# Application Controller

## Purpose

The Application Controller acts as the entry point for the entire portal.

It coordinates startup, initialisation and module communication.

---

## Responsibilities

- initialise platform
- restore learner state
- load settings
- load campaign
- initialise routing
- initialise storage
- prepare rendering engine
- display initial page

It should not perform rendering directly.

---

# Router

## Purpose

Manages navigation between logical application pages.

Explorer Academy behaves as a single-page application, with the Router determining which page component is currently active.

---

## Responsibilities

- page navigation
- browser history
- deep linking
- route validation
- unknown route recovery

---

## Inputs

- navigation requests
- browser history
- bookmarked routes

---

## Outputs

- page change events

---

## Supported Routes

```
/

Home

/campaigns

/campaign/:id

/mission/:id

/discovery

/profile

/settings

/parent
```

Routes should identify application state rather than individual HTML files.

---

# Campaign Loader

## Purpose

Loads campaign packages from the repository.

The Campaign Loader forms the boundary between platform code and campaign content.

---

## Responsibilities

- locate campaign
- validate campaign data
- load mission definitions
- load assets
- expose campaign metadata

---

## Inputs

- campaign identifier

---

## Outputs

- campaign object

---

## Validation

The Campaign Loader should verify:

- required files exist
- campaign version
- schema compatibility
- asset availability

Invalid campaigns should fail gracefully without affecting other installed campaigns.

---

# Rendering Engine

## Purpose

Transforms structured campaign data into the Explorer Academy experience.

The Rendering Engine contains no educational knowledge.

It simply converts data into components.

---

## Responsibilities

- render pages
- render missions
- render activities
- update progress
- refresh navigation
- manage component lifecycle

---

## Inputs

- campaign
- mission
- activity
- learner state

---

## Outputs

Rendered interface.

---

# Mission Engine

## Purpose

Controls learner progression through a mission.

It is responsible for sequencing activities while respecting the adaptive schedule selected by the parent.

---

## Responsibilities

- initialise mission
- advance activities
- validate completion
- unlock rewards
- trigger reflection
- complete mission

---

## Inputs

- mission definition
- scheduler output
- learner actions

---

## Outputs

- mission events
- progress updates
- completion events

---

# Adaptive Scheduler

## Purpose

Constructs a playable session from the full mission definition.

Rather than editing campaign content, the scheduler selects activities appropriate for the chosen session duration.

---

## Responsibilities

- classify activities
- estimate duration
- assemble session
- preserve mandatory learning outcomes
- schedule Rabbit Holes

---

## Activity Categories

```
Core

↓

Extension

↓

Rabbit Hole
```

Core activities are always included.

Extension activities are included when time permits.

Rabbit Holes remain optional and may be offered after mission completion or deferred to a later session.

The Scheduler never changes campaign data.

It only selects which activities are presented during the current play session.

---

# Storage Manager

## Purpose

Provides a single interface for all persistent learner data.

No other module should access browser storage directly.

---

## Responsibilities

- save progress
- restore progress
- export data
- import data
- validate saves
- recover corrupted saves

---

## Stored Information

- explorer profile
- settings
- campaign progress
- mission state
- discoveries
- achievements
- current session

Storage implementation details remain hidden behind this module.

---

# Reward Engine

## Purpose

Manages learner achievements and narrative rewards.

Rewards should reinforce exploration rather than encourage repetitive behaviour.

---

## Responsibilities

- unlock rewards
- evaluate achievements
- trigger celebrations
- update profile
- notify Discovery Log

---

## Reward Types

Examples include:

- badges
- discoveries
- story unlocks
- explorer milestones
- campaign completion

The Reward Engine should not calculate educational assessment.

---

# Discovery Log Manager

## Purpose

Maintains the learner's permanent record of exploration.

---

## Responsibilities

- add discoveries
- save reflections
- categorise entries
- search entries
- retrieve entries

---

## Entry Sources

- mission completion
- learner reflection
- rewards
- rabbit holes
- parent-approved notes

The Discovery Log spans all campaigns.

---

# Workbook Manager

## Purpose

Coordinates printable workbook resources.

The Workbook Manager should treat printable materials as optional enhancements rather than mandatory mission components, reflecting ADR-005. :contentReference[oaicite:0]{index=0}

---

## Responsibilities

- locate workbook pages
- provide downloads
- track optional worksheet usage
- link workbook references to activities

The platform should remain fully functional without workbook resources.

---

# Parent Mode Manager

## Purpose

Controls access to Parent Mode.

This module enforces the separation between learner-facing content and curriculum information.

---

## Responsibilities

- verify parent access
- load curriculum mappings
- expose parent guidance
- manage preparation resources
- display learning outcomes

The Parent Mode Manager should never expose curriculum terminology to learner pages.

---

# Settings Manager

## Purpose

Maintains platform-wide preferences.

---

## Responsibilities

Manage:

- explorer profile
- session duration
- accessibility
- audio
- appearance
- save management
- offline preferences

Changes should propagate throughout the platform using application events.

---

# Asset Manager

## Purpose

Provides a unified interface for campaign assets.

---

## Responsibilities

- load images
- load icons
- load audio
- manage caching
- verify availability
- provide placeholders

Missing assets should never cause application failure.

---

# Accessibility Manager

## Purpose

Applies platform-wide accessibility behaviour.

---

## Responsibilities

- keyboard navigation
- focus management
- ARIA updates
- reduced motion
- font scaling
- contrast settings

Accessibility behaviour should remain consistent across every campaign.

---

# Event Bus

## Purpose

Provides loose coupling between modules.

Instead of modules calling each other directly, they communicate through application events.

---

## Example Events

```
Campaign Loaded

Mission Started

Activity Completed

Reward Unlocked

Mission Completed

Discovery Added

Settings Changed

Progress Saved

Campaign Changed
```

This reduces dependencies and improves maintainability.

---

# Module Interaction

Typical mission flow:

```
Application

↓

Campaign Loader

↓

Router

↓

Rendering Engine

↓

Mission Engine

↓

Scheduler

↓

Activity Renderer

↓

Reward Engine

↓

Discovery Log

↓

Storage Manager
```

Each module performs one responsibility before passing control to the next.

---

# Rendering Pipeline

The rendering pipeline converts campaign data into the learner experience.

```
Campaign JSON

↓

Campaign Loader

↓

Schema Validation

↓

Mission Selection

↓

Adaptive Scheduler

↓

Mission Engine

↓

Rendering Engine

↓

Component Assembly

↓

HTML Generation

↓

User Interaction

↓

Progress Update

↓

Storage Manager
```

Only structured data enters the pipeline.

Only rendered components leave it.

This ensures the platform remains campaign-agnostic.

---

# Module Dependency Rules

To preserve maintainability, dependencies should follow these principles.

## Allowed

```
Application
        ↓
Modules
        ↓
Components
```

## Avoid

```
Component

↓

Storage

↓

Campaign Loader
```

Components should never communicate directly with storage or campaign data sources.

---

# Extending the Platform

Adding new platform capabilities should involve extending existing modules rather than modifying unrelated code.

Examples:

New activity type

→ Register a new Activity Renderer

New reward type

→ Extend the Reward Engine

New campaign

→ Add campaign package only

New workbook

→ Add workbook resources

New achievement

→ Register achievement definition

The platform should remain closed for modification but open for extension.

This design ensures that Campaign 20 should use the same platform engine as Campaign 1, requiring only new content and, where genuinely necessary, additional renderer modules for entirely new activity types.

# Campaign Data Architecture

Explorer Academy is entirely data-driven.

The platform should not contain campaign-specific logic.

Instead, campaigns are delivered as structured content packages that conform to a well-defined schema.

The rendering engine interprets this data to generate the learner experience.

All campaign data should be human-readable, versioned and independently testable.

---

# Data Hierarchy

Every campaign follows the same hierarchy.

```
Campaign
│
├── Metadata
├── Rewards
├── Missions
│      │
│      ├── Story
│      ├── Activities
│      ├── Rabbit Holes
│      ├── Reflection
│      └── Parent Notes
│
└── Assets
```

No platform code should assume knowledge of a specific campaign.

---

# Campaign Schema

Each campaign should expose a root object describing the adventure.

## Required Fields

```
Campaign
```

Contains:

- unique identifier
- version
- title
- subtitle
- campaign description
- age range
- estimated duration
- cover artwork
- campaign icon
- campaign colour theme
- number of missions
- reward definitions
- required assets
- workbook references

---

## Example Structure

```
Campaign

Metadata

Theme

Settings

Mission List

Reward Definitions

Asset References

Parent Resources
```

Campaign metadata should be sufficient to render the Campaign Overview page without loading every mission.

---

# Mission Schema

Every mission follows the same structure regardless of subject matter.

## Required Sections

```
Mission

Story

Objectives

Activities

Reflection

Rewards

Rabbit Holes

Parent Notes
```

---

## Mission Metadata

Each mission should include:

- mission identifier
- mission number
- title
- summary
- estimated duration
- difficulty
- unlock requirements
- completion requirements
- prerequisite missions

---

## Story Block

Contains:

- briefing
- narrative
- illustrations
- optional dialogue
- optional audio
- mission objective

The Story Block should never include educational metadata.

---

## Activity Collection

Activities define the learner experience.

Each activity should be self-contained.

Every activity should include:

- activity identifier
- title
- activity type
- category
- estimated duration
- required materials
- instructions
- learner interaction
- completion criteria
- optional hints
- workbook reference

---

# Activity Categories

Every activity belongs to one scheduling category.

```
Core

Extension

Rabbit Hole
```

These categories are consumed by the Scheduler.

The campaign author should never manually assemble 30, 45 or 60 minute versions of a mission.

---

# Activity Types

The platform should recognise activity types rather than individual activities.

Examples include:

```
Story

Reading

Writing

Mathematics

Investigation

Experiment

Engineering

Creative

Discussion

Reflection

Observation

Video

Audio

Quiz

Journal
```

New activity types should be introduced by registering a new renderer rather than changing existing platform logic.

---

# Reflection Schema

Reflection concludes every mission.

Reflection data may contain:

- prompts
- learner notes
- follow-up questions
- discussion suggestions
- optional Discovery Log entry

Reflection responses become part of the learner's permanent record if saved.

---

# Reward Schema

Rewards describe what becomes available when milestones are reached.

Reward definitions should remain separate from learner progress.

---

## Reward Metadata

Each reward may contain:

- identifier
- title
- description
- icon
- badge artwork
- unlock condition
- reward type
- optional narrative

---

## Reward Types

Examples:

```
Achievement

Badge

Discovery

Story Unlock

Campaign Milestone

Explorer Rank
```

The Reward Engine interprets these definitions.

---

# Rabbit Hole Schema

Rabbit Holes represent optional investigations.

They should never be required for mission completion.

Each Rabbit Hole should include:

- identifier
- title
- description
- estimated duration
- external resources
- optional downloads
- curiosity prompts
- parent guidance

Rabbit Holes may remain available after campaign completion.

---

# Discovery Log Schema

Discoveries are generated throughout gameplay.

Each Discovery Log entry should contain:

- identifier
- campaign reference
- mission reference
- discovery title
- category
- summary
- learner notes
- timestamp
- optional illustration
- optional attachment

The Discovery Log is global across all campaigns.

---

# Parent Notes Schema

Parent Notes exist only within Parent Mode.

They should never be loaded into learner-facing components.

Each Parent Note may contain:

- preparation guidance
- required materials
- optional materials
- learning outcomes
- curriculum references
- discussion ideas
- extension opportunities

This separation supports the project's "Hidden Parent Mode" principle.

---

# Asset Manifest

Every campaign should include an asset manifest.

The Asset Manager uses this to locate resources without hardcoded paths.

Assets may include:

```
Images

Illustrations

Icons

Audio

Video

Workbook PDFs

Printable Resources

Maps

Documents
```

Assets should be referenced rather than embedded.

---

# Workbook References

Activities may optionally reference printable resources.

Workbook metadata should include:

- workbook identifier
- page reference
- printable filename
- optional pages
- related activity

The Workbook Manager resolves these references.

---

# Platform Data Contracts

Every platform module should consume structured contracts rather than arbitrary objects.

Examples include:

```
Campaign Contract

Mission Contract

Activity Contract

Reward Contract

Discovery Contract

Settings Contract

Explorer Contract
```

Stable contracts reduce coupling between modules.

---

# Local Storage Architecture

All learner progress should persist locally.

The Storage Manager provides the only interface to browser storage.

Platform modules should never write directly to browser storage.

---

# Stored Data Overview

```
Explorer

Settings

Campaign Progress

Mission Progress

Current Session

Discovery Log

Achievements

Workbook State
```

Each area should be independently recoverable.

---

# Explorer Profile

Stores long-term learner identity.

Fields include:

- explorer name
- avatar
- explorer identifier
- creation date
- last active
- preferred campaign
- completed campaigns
- earned achievements

Explorer data is shared across every campaign.

---

# Campaign Progress

Stores campaign-level progress.

Each campaign should track:

- campaign identifier
- unlocked missions
- completed missions
- completion percentage
- earned rewards
- campaign discoveries

Campaign data should remain isolated from other campaigns.

---

# Mission Progress

Tracks the learner's position within a mission.

Fields include:

- mission identifier
- current activity
- completed activities
- skipped extension activities
- completed rabbit holes
- mission completion state
- reflection status

Mission state should allow seamless continuation after closing the browser.

---

# Current Session

Stores temporary runtime information.

Examples:

- active campaign
- active mission
- current activity
- selected duration
- elapsed time

This enables session restoration after unexpected interruption.

---

# Discovery Log Storage

The Discovery Log should persist:

- discoveries
- learner reflections
- saved questions
- observations
- timestamps
- campaign references

Entries should never be lost when a campaign is removed.

---

# Settings Storage

Global platform settings include:

- preferred session duration
- accessibility preferences
- audio settings
- reduced motion
- font scaling
- high contrast mode
- parent mode preferences

Settings apply across every campaign.

---

# Achievement Storage

Achievement records should contain:

- achievement identifier
- unlocked date
- campaign source
- reward reference
- completion notes

Achievements remain visible permanently.

---

# Save Versioning

Every save should include version metadata.

Example information:

- storage version
- platform version
- campaign version
- save timestamp

This supports future migration if schemas evolve.

---

# Import / Export Support

The Storage Manager should support complete learner profile export.

Exported data should contain:

- explorer profile
- settings
- campaign progress
- discovery log
- achievements
- workbook state

Campaign assets themselves should not be included.

---

# Data Validation

Before data is accepted by the platform it should be validated.

Validation should ensure:

- required fields exist
- identifiers are unique
- references resolve correctly
- activity types are recognised
- mission ordering is valid
- asset references exist
- schema version is supported

Invalid content should generate descriptive errors rather than silent failures.

---

# Data Evolution

Future campaigns should remain compatible with older platform versions whenever possible.

Schema evolution should follow these principles:

- additive changes preferred
- avoid breaking field names
- preserve backward compatibility
- include schema version numbers
- validate before rendering
- provide migration paths for save data

A campaign should be treated as a plug-in content package that can be added, updated or removed without requiring changes to the platform engine.

# Platform Behaviour

This section defines how the Explorer Academy platform behaves at runtime.

It describes the learner journey, adaptive scheduling, error handling, accessibility, performance expectations, long-term extensibility and the recommended implementation roadmap.

These behaviours are platform-wide and should remain independent of any individual campaign.

---

# Navigation Flow

Explorer Academy should guide learners through a predictable, recoverable journey.

Navigation should always reinforce the feeling of progressing through an adventure.

---

## Primary Learner Flow

```
Home
    │
    ▼
Campaign Select
    │
    ▼
Campaign Overview
    │
    ▼
Mission Briefing
    │
    ▼
Story Introduction
    │
    ▼
Activity Sequence
    │
    ▼
Reflection
    │
    ▼
Mission Complete
    │
    ▼
Campaign Progress
    │
    ▼
Next Mission
```

Learners should be able to safely exit at any point and resume exactly where they left off.

---

## Mission State Flow

```
Mission Locked

↓

Mission Available

↓

Mission Started

↓

Activity In Progress

↓

Reflection

↓

Mission Complete

↓

Reward Granted

↓

Next Mission Unlocked
```

State transitions should be controlled exclusively by the Mission Engine.

---

## Activity Lifecycle

Every activity should follow the same lifecycle.

```
Loaded

↓

Displayed

↓

Learner Interaction

↓

Validation

↓

Completed

↓

Progress Saved

↓

Next Activity
```

Specialised activity renderers should extend this lifecycle rather than replacing it.

---

## Parent Mode Flow

```
Home

↓

Parent Verification

↓

Parent Dashboard

↓

Campaign

↓

Mission

↓

Curriculum Mapping

↓

Resources

↓

Settings

↓

Exit Parent Mode
```

Returning from Parent Mode should restore the learner's previous page.

---

# Adaptive Scheduler

Explorer Academy supports variable daily session lengths without requiring multiple versions of the same mission.

Campaign authors define activities.

The Scheduler assembles an appropriate session.

---

## Activity Priorities

Every activity belongs to one category.

```
Core

↓

Extension

↓

Rabbit Hole
```

Core activities preserve essential narrative and learning progression.

Extension activities deepen understanding.

Rabbit Holes reward curiosity without affecting completion.

---

## Session Assembly

### 30 Minute Session

```
Mission Story

↓

Core Activities

↓

Reflection

↓

Mission Complete
```

Only mandatory activities are included.

---

### 45 Minute Session

```
Mission Story

↓

Core Activities

↓

Selected Extension Activity

↓

Reflection

↓

Mission Complete
```

One or more extension activities may be included if time allows.

---

### 60 Minute Session

```
Mission Story

↓

Core Activities

↓

Extension Activities

↓

Reflection

↓

Mission Complete

↓

Suggested Rabbit Hole
```

This represents the project's recommended default experience.

---

### 90 Minute Session

```
Mission Story

↓

Core Activities

↓

All Extension Activities

↓

Rabbit Hole Exploration

↓

Extended Reflection

↓

Mission Complete
```

Longer sessions encourage deeper exploration without changing the mission's learning outcomes.

---

## Scheduler Rules

The Scheduler should always:

- preserve story continuity
- preserve mandatory progression
- preserve required discoveries
- preserve mission completion integrity

The Scheduler should never:

- rewrite campaign data
- alter activity order unless explicitly permitted
- remove required activities
- expose future mission content

---

# Rendering Pipeline

The platform transforms structured campaign data into the learner experience using a consistent rendering pipeline.

```
Campaign Package

↓

Campaign Loader

↓

Schema Validation

↓

Campaign Metadata

↓

Mission Selection

↓

Scheduler

↓

Mission Engine

↓

Rendering Engine

↓

UI Components

↓

Explorer Interface
```

Every learner interaction updates application state, which is then persisted through the Storage Manager.

---

## Runtime Rendering Cycle

```
User Action

↓

Application Event

↓

State Update

↓

Component Refresh

↓

Storage Save

↓

Ready
```

Only affected components should be re-rendered where possible.

---

# Error Handling

The platform should fail gracefully.

Errors should never result in learner progress being lost unnecessarily.

---

## Missing Resources

Examples:

- missing image
- missing workbook
- missing audio

Recovery:

- display placeholder
- continue mission
- log warning
- notify parent if appropriate

A missing illustration should never prevent mission completion.

---

## Missing Campaign

If a requested campaign cannot be found:

```
Return to Campaign Select

↓

Display Error

↓

Offer Installed Campaigns
```

The application should remain usable.

---

## Invalid Campaign Data

Examples:

- invalid schema
- missing mission
- duplicate identifiers

Recovery:

- reject campaign
- report validation errors
- continue loading other campaigns

The platform should never partially load corrupted campaign content.

---

## Unknown Activity Type

If an activity renderer is unavailable:

```
Unknown Activity

↓

Fallback Renderer

↓

Inform Parent

↓

Continue Mission
```

This allows newer campaigns to degrade gracefully on older platform versions.

---

## Corrupted Save Data

If learner progress cannot be restored:

```
Attempt Validation

↓

Attempt Recovery

↓

Restore Backup

↓

Offer Reset
```

Explorer identity should be preserved whenever possible.

---

## Storage Failure

If browser storage becomes unavailable:

- continue current session
- warn learner
- disable persistence
- allow manual export where possible

The platform should fail safely rather than crashing.

---

# Accessibility

Explorer Academy should be usable by the widest practical range of learners.

Accessibility is a platform responsibility rather than a campaign responsibility.

---

## Keyboard Navigation

Every interactive element should support keyboard access.

Required capabilities include:

- logical tab order
- visible focus indicators
- keyboard activation
- modal navigation
- escape shortcuts

---

## Responsive Design

Target devices include:

- desktop
- laptop
- tablet
- large mobile devices

Layouts should adapt without removing functionality.

---

## Typography

Text should prioritise readability.

Guidelines include:

- generous spacing
- scalable fonts
- appropriate line length
- clear visual hierarchy

Story content should remain comfortable for sustained reading.

---

## Colour and Contrast

Support:

- high contrast mode
- colour-independent indicators
- sufficient text contrast
- accessible status colours

Information should never rely solely on colour.

---

## Motion

Animations should:

- support reduced motion preferences
- remain optional
- never delay interaction
- reinforce the narrative rather than distract

---

# Performance

Explorer Academy should remain lightweight enough to operate comfortably on modest hardware.

---

## Initial Load

Load only:

- application shell
- selected campaign metadata
- required assets

Mission content should load on demand.

---

## Lazy Loading

Lazy loading should be applied to:

- campaign assets
- illustrations
- workbook resources
- optional media
- Rabbit Hole resources

---

## Caching

Cache:

- campaign data
- images
- icons
- fonts
- workbook files

Offline operation should occur entirely from cached resources after the initial download.

---

## JavaScript

The platform should favour:

- modular architecture
- minimal dependencies
- reusable components
- efficient rendering

Avoid unnecessary frameworks where native browser capabilities are sufficient.

---

## Asset Optimisation

Recommendations include:

- compressed images
- modern image formats where appropriate
- deferred optional assets
- shared resources across campaigns

Campaigns should avoid duplicating common assets.

---

# Future Extensibility

Explorer Academy is expected to support many campaigns over its lifetime.

The platform should therefore remain stable while content evolves.

---

## Adding a Campaign

Should require:

- campaign folder
- campaign metadata
- mission data
- assets
- workbook resources

No platform code should require modification.

---

## Adding a Mission

Should require only updating campaign data.

The rendering engine should automatically recognise the new mission.

---

## Adding an Activity Type

Requires:

- new activity renderer
- renderer registration
- optional validation update

Existing campaigns should continue functioning unchanged.

---

## Adding Rewards

Should require:

- reward definition
- optional presentation assets

The Reward Engine should interpret new reward definitions without architectural changes.

---

## Localisation

Future localisation should primarily involve:

- translated campaign content
- translated interface strings

Platform behaviour should remain unchanged.

---

## Theme Support

Campaigns may define:

- colour palette
- artwork
- typography preferences
- decorative styling

The application shell should adapt without changing layout or behaviour.

---

# Development Roadmap

The recommended implementation sequence prioritises establishing a stable platform before introducing campaign content.

Each stage should be independently testable before progressing.

---

# Build Order

## Milestone 1 — Repository Foundation

✓ Folder structure

✓ Project organisation

✓ Static application shell

✓ Asset directories

✓ Build configuration

**Validation**

Application loads with no campaign content.

---

## Milestone 2 — Core Application

✓ Application controller

✓ Router

✓ Navigation framework

✓ Global layout

✓ Error page

**Validation**

Navigation between pages functions correctly.

---

## Milestone 3 — Campaign Loader

✓ Campaign discovery

✓ Metadata loading

✓ Schema validation

✓ Asset manifest loading

**Validation**

Campaign Overview renders from data alone.

---

## Milestone 4 — Rendering Engine

✓ Component registration

✓ Dynamic page rendering

✓ Mission rendering

✓ Activity rendering pipeline

**Validation**

A complete mission renders without hardcoded HTML.

---

## Milestone 5 — Activity Engine

✓ Activity lifecycle

✓ Core activity renderers

✓ Reflection handling

✓ Mission completion

**Validation**

A learner can complete an entire mission.

---

## Milestone 6 — Adaptive Scheduler

✓ Activity classification

✓ Session duration selection

✓ Core/Extension/Rabbit Hole scheduling

✓ Mission sequencing

**Validation**

30, 45, 60 and 90 minute sessions produce correct activity sets.

---

## Milestone 7 — Persistence

✓ Storage Manager

✓ Explorer profile

✓ Progress saving

✓ Session restoration

✓ Import/export

**Validation**

Progress survives browser refresh and restart.

---

## Milestone 8 — Explorer Features

✓ Discovery Log

✓ Reward Engine

✓ Explorer Profile

✓ Achievement tracking

**Validation**

Discoveries and rewards persist across missions and campaigns.

---

## Milestone 9 — Parent Experience

✓ Parent verification

✓ Parent dashboard

✓ Curriculum mapping

✓ Workbook integration

✓ Session settings

**Validation**

Parent Mode remains isolated from learner-facing pages.

---

## Milestone 10 — Platform Polish

✓ Accessibility

✓ Responsive layouts

✓ Offline caching

✓ Lazy loading

✓ Performance optimisation

✓ Error recovery

✓ Cross-browser testing

**Validation**

Platform meets performance, accessibility and offline-first objectives.

---

# Implementation Success Criteria

The platform implementation can be considered complete when:

- New campaigns can be added without changing platform code.
- Every mission renders entirely from structured data.
- Learner progress is recoverable after interruption.
- Parent Mode remains isolated from the learner experience.
- The application functions offline after initial loading.
- Accessibility and responsive design requirements are met.
- Each milestone passes its validation criteria independently.

At that point, the Explorer Academy platform becomes a reusable engine capable of supporting Campaign 1 through Campaign 20 and beyond with minimal architectural change.

