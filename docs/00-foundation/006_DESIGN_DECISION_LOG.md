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

# ADR-012

## Hidden Parent Mode Is a Separate Static Page, Not a Hash Route

**Status**

Accepted

### Context

ADR-006 established that Parent Mode must stay invisible to the learner, but did not specify the implementation mechanism.

### Decision

Parent Mode is implemented as its own static HTML entry point (`portal/parent/index.html`), loaded by direct URL only. It is never one of the learner shell's hash routes (`router.js`) and is never linked from any learner-facing navigation.

### Alternatives Considered

A hidden hash route (e.g. `/parent`) gated by a client-side check.

### Rationale

A route that exists in the same single-page app as the learner shell is one navigation mistake away from being reachable — a stray link, a browser-history entry, a shared bookmark. A physically separate page has no code path connecting it to the learner shell at all.

### Consequences

Parent Mode reuses the same validated loaders (`campaign-loader.js`, `mission-engine.js`) as the learner shell rather than duplicating them, but renders through its own module (`parent-mode.js`) and mounts into its own page. Being one directory deeper than `portal/index.html`, it needs its own relative-path handling (see the `<base href="../">` fix applied when this was built).

### Affected Documents

601_HTML_ARCHITECTURE.md (Parent Mode section)

---

# ADR-013

## Parent Access Is a Session-Only Confirmation, Not a PIN

**Status**

Superseded by ADR-024

### Context

601_HTML_ARCHITECTURE.md's Parent Mode Manager responsibility says the platform must "verify parent access." No PIN, password or access-code field exists anywhere in 504_JSON_SCHEMA.md's Save Game shape.

### Decision

"Verify parent access" is implemented as a one-time, session-only confirmation click on entering Parent Mode, not a PIN or credential check.

### Alternatives Considered

Adding a PIN field to the Save Game schema and a real credential gate.

### Rationale

A real PIN is a storage-schema change with its own consequences (recovery if forgotten, where it's set, whether it syncs across devices) that goes beyond what any current document specifies. Being a separate, unlinked static page (ADR-012) is the actual access control today; the confirmation click is a deliberate-intent check for whoever already found the page, not a security boundary.

### Consequences

This is explicitly a placeholder, not a real gate. A future milestone can add genuine PIN protection to the Save Game schema without changing anything else about how Parent Mode is reached.

### Affected Documents

504_JSON_SCHEMA.md (Save Game), 601_HTML_ARCHITECTURE.md (Parent Mode Manager)

---

# ADR-014

## Reward Unlock Trigger: Mission Reflection Completion

**Status**

Accepted

### Context

504_JSON_SCHEMA.md's Reward entity requires only `id`, `type` and `value` — there is no `unlockCondition` field to drive a finer-grained trigger for when a mission's rewards are actually earned.

### Decision

A mission's full `rewards[]` unlocks the first time any of its reflection prompts is saved to the Discovery Log. `evaluateMissionRewards()` is idempotent on repeat calls.

### Rationale

"Reflection completed" is the simplest signal already available in the data that reliably means a mission session is done, without inventing a new schema field this milestone didn't call for.

### Consequences

All of a mission's rewards are granted together, not per-activity. Per ADR-007, this is acknowledgement of a completed session, not scoring — there is no partial-credit or points logic anywhere in the Reward Engine.

### Affected Documents

504_JSON_SCHEMA.md (Reward)

---

# ADR-015

## Discovery Log Entry Schema Extended With learnerNotes, timestamp, campaignId, missionId

**Status**

Accepted

### Context

504_JSON_SCHEMA.md's Discovery Log Entry only requires `id`, `prompt` and `entryType` — no field for the learner's actual written response. 601_HTML_ARCHITECTURE.md's Discovery Log Entry component and 503_DATA_MODEL.md's conceptual model each describe a different, non-overlapping field set; none of the three documents agree.

### Decision

The implementation extends the required list with `learnerNotes` (the response text), `timestamp`, `campaignId` and `missionId`, additively.

### Rationale

Without `learnerNotes` the Discovery Log couldn't store what a child actually wrote — the entire point of the feature. `campaignId`/`missionId` support 601_HTML_ARCHITECTURE.md's own statement that "the Discovery Log spans all campaigns," which requires knowing which campaign/mission an entry came from.

### Consequences

Only `entryType: "reflection"` is produced today — the platform has no UI yet for drawing, prediction, observation or diagram entries, despite the schema listing them as valid types.

### Affected Documents

504_JSON_SCHEMA.md (Discovery Log Entry)

---

# ADR-016

## Mission's Parent Guide Is Required and Embedded, Not Referenced

**Status**

Accepted

### Context

504_JSON_SCHEMA.md's Mission required-fields list omitted `parentGuide`, even though the same document separately defines a full Parent Guide schema and 503_DATA_MODEL.md explicitly says Parent Guide is "Referenced by Missions."

### Decision

`parentGuide` is required on every Mission object and embedded directly (not referenced by ID), for the same reason `activities`, `rewards` and `beats` are embedded: it is 1:1 owned by its mission, never shared or reused across missions.

### Rationale

Embedding is lossless here and needs no new reference-resolution machinery. `mission-engine.js` validates its presence.

### Consequences

`parentGuide` must never be rendered to the learner (ADR-006). `activity-engine.js`/`router.js` confirm it isn't.

### Affected Documents

504_JSON_SCHEMA.md (Mission, Parent Guide)

---

# ADR-017

## Adaptive Scheduler Uses Duration Bands, Not Weighted Session Configuration Fields

**Status**

Accepted

### Context

504_JSON_SCHEMA.md's Session Configuration defines `coreWeight`, `extensionWeight` and `rabbitHoleWeight`, but no document defines the formula they participate in.

### Decision

The Adaptive Scheduler implements the simpler duration-band model from 601_HTML_ARCHITECTURE.md's Adaptive Scheduler section instead: Core activities are always included, Extension activities are added while the remaining time budget allows, and Rabbit Hole activities are included only at the 90-minute band.

### Alternatives Considered

Implementing a weighted-scoring model using the three reserved fields.

### Rationale

601_HTML_ARCHITECTURE.md already specifies a complete, unambiguous band model with worked examples for all four durations (30/45/60/90 minutes). The weighted fields have no such specification anywhere.

### Consequences

`coreWeight`/`extensionWeight`/`rabbitHoleWeight` remain reserved, unimplemented fields. A future milestone could define and implement a weighted model without breaking the band model's existing behaviour, since the fields are simply unread today.

### Affected Documents

504_JSON_SCHEMA.md (Session Configuration)

---

# ADR-018

## Campaign-Authoring Prompts Separate Reusable Rules From Campaign 1's Specific Answers

**Status**

Accepted

### Context

The five compiler prompts (`CAMPAIGN_COMPILER.md`, `MISSION_COMPILER.md`, `WORLD_BIBLE_COMPILER.md`, `MISSION_RESOURCE_CURATOR.md`, `ASSET_COMPILER.md`) had Campaign 01's specific answers written as if they were universal rules — e.g. naming Orion/Atlas/Quinn directly in general Characters instructions, or hardcoding which mission numbers have experiment activities.

### Decision

Every compiler prompt now opens with an explicit Campaign Parameters block (`<source-document>`, `<campaign-slug>`, `<mission-count>`, `<resources-document>`), and any Campaign-1-specific answer is rewritten as the underlying computable rule (e.g. "scan the compiled mission JSON directly for `type: "experiment"` activities") with Campaign 1's actual numbers moved into a clearly labelled "Campaign 01 example" callout.

### Rationale

Re-running these prompts against a future campaign's own content would otherwise silently produce wrong output — not just need a find-and-replace — since several passages stated Campaign 1's specific answers as if they were general rules.

### Consequences

A future Campaign 2 can point these same five prompts at its own source document and mission count without inheriting Campaign 1's character names, curriculum breakdown or mission numbers.

### Affected Documents

`prompts/CAMPAIGN_COMPILER.md`, `prompts/MISSION_COMPILER.md`, `prompts/WORLD_BIBLE_COMPILER.md`, `prompts/MISSION_RESOURCE_CURATOR.md`, `prompts/ASSET_COMPILER.md`

---

# ADR-019

## Flat-Vector SVG as a Placeholder for "Painterly Illustration" Image Specs

**Status**

Accepted

### Context

Phase 5's image specifications describe most scene images as "warm, painterly illustration." No image-generation tool is available in this environment, so genuine illustrations matching that description could not be produced.

### Decision

All 24 image specifications plus 10 reward icons were generated as flat-vector SVG in one consistent style (documented in `generated/images/STYLE_GUIDE.md`), rather than leaving the scene specs unfulfilled.

### Alternatives Considered

Skipping the 19 painterly-style scene specs entirely and producing only diagrams/badges/icons.

### Rationale

Presented to the user as an explicit capability gap via `AskUserQuestion`; the user chose consistent flat-vector SVG over leaving scenes unfulfilled or attempting a mismatched fidelity level.

### Consequences

`STYLE_GUIDE.md` explicitly frames this as a disposable placeholder layer to replace wholesale if a real image-generation capability becomes available later — not a permanent design decision. Character portraits were deliberately not attempted, since they would need genuine illustration rather than a diagram-style stand-in.

### Affected Documents

`generated/images/STYLE_GUIDE.md`, `generated/image-specifications/images.json`, `generated/image-specifications/badges.json`

---

# ADR-020

## Workbook Answer Guide Is a Response-Quality Checklist, Not a Traditional Answer Key

**Status**

Accepted

### Context

TODO.md names "Answer guide" as a Phase 7 deliverable, but no other document defines what it should contain, and almost every mission activity is genuinely open-ended (observations of whatever's in front of the child, reasoned arguments, personal reflections) — in direct tension with `src/parent/orientation.json`'s own Assessment Philosophy ("Explorer Academy does not rely on traditional tests").

### Decision

`generated/workbook/answer-guide.json` is a "what a strong response looks like" checklist per mission — 2–3 checkable points expanding each mission's existing `parentGuide.assessment` — rather than fixed correct answers. Only the three household-experiment missions (7, 10, 15) state a genuinely fixed physical outcome, quoted from `generated/resources/experiments.json`.

### Alternatives Considered

A traditional right-answer key, as the deliverable name might suggest at face value.

### Rationale

A fixed-answer key would contradict the campaign's own stated pedagogy. Missions 5, 17 and 20 are confirmed (by re-reading `501_CAMPAIGN_01.md` and the mission JSON itself) to have no single fixed outcome by design.

### Consequences

Missions 5, 17 and 20's answer-guide entries explicitly say there is no fixed answer, and instruct judging reasoning/process instead.

### Affected Documents

`generated/workbook/answer-guide.json`

---

# ADR-021

## Workbook PDF Is Built by a Checked-In Compile Script, Not Produced by Hand

**Status**

Accepted

### Context

The Phase 7 workbook PDF was first produced by a one-off, unversioned scratchpad script (Markdown assembly → HTML via the `markdown` package → PDF via headless Chromium's `page.pdf()`, since no pandoc/weasyprint/reportlab was available in this environment). This left no reproducible way to regenerate the PDF if any source content changed.

### Decision

The pipeline is now `scripts/build_workbook.py`, a single checked-in script accepting a campaign slug, that reads only already-committed `src/`/`generated/` files and reproducibly writes the compiled Markdown and PDF.

### Rationale

CLAUDE.md's own Repository Layout names a top-level `scripts/` directory for exactly this kind of build tooling. A shipped deliverable (the PDF) with no way to regenerate it is a real maintenance risk.

### Consequences

The script's two pip dependencies (`markdown`, `playwright`) are build-tooling only — they do not run in the shipped browser application and do not violate the "no external runtime dependencies" Technology Constraint, which governs the learner-facing platform, not authoring tools. Re-running the script against the same inputs was verified to reproduce byte-identical Markdown and a PDF with the same page count and content.

### Affected Documents

`portal/campaigns/campaign01/generated/workbook/workbook.json` (compiledWorkbook.note)

---

# ADR-022

## Knowledge Core and Explorer Rank Rewards Reference Catalog Entities via Optional IDs

**Status**

Accepted

### Context

503_DATA_MODEL.md and 504_JSON_SCHEMA.md both define Knowledge Core and Explorer Rank as entities with their own `description`/`icon` (or `requiredKnowledge`), referenced by ID so campaigns don't duplicate them. The implementation instead carried these as bare `{id, type, value}` strings in mission rewards, with no catalog behind them anywhere in `src/`.

### Decision

Added `portal/campaigns/campaign01/src/world/knowledge-cores.json` and `ranks.json` as the missing catalogs, and an optional `coreId`/`rankId` field on the relevant reward objects that resolves against them via `reward-engine.js`'s `resolveRewardDetails()`.

### Alternatives Considered

Repurposing the existing `value` field to hold an ID instead of a display string.

### Rationale

Changing `value`'s semantics would have been a breaking change to every place already rendering it directly. Adding a new optional field is purely additive, per 503_DATA_MODEL.md's own Forward Compatibility Strategy ("future readers should safely ignore unknown optional fields").

### Consequences

Explorer Profile and Parent Mode now show a resolved icon and description for these rewards where available, falling back to the plain `value` string for reward types with no catalog (badge, unlock, story, collectible) or when a reference doesn't resolve.

### Affected Documents

504_JSON_SCHEMA.md (Reward, Knowledge Core, Explorer Rank)

---

# ADR-023

## Parent-Selectable Session Duration via a Settings Manager

**Status**

Accepted

### Context

ADR-009 established that parents choose a session duration and the Scheduler adapts to it, but no Settings Manager existed — `settings.js` was an empty placeholder and `router.js` always scheduled a hardcoded 60-minute default regardless of any preference.

### Decision

`settings.js` is now a real Settings Manager (`getSessionDuration()`/`setSessionDuration()`, validated against the four Supported Durations), backed by a new `settings` field in `storage.js`'s save shape. The learner shell's existing `/settings` route (previously a generic placeholder) is the control surface.

### Rationale

601_HTML_ARCHITECTURE.md's own Settings page responsibilities already name "preferred session duration" as belonging there; no new route or Parent Mode page was needed.

### Consequences

`scheduleActivities()` is now called with the stored preference instead of a hardcoded constant everywhere it's used. Explorer profile, accessibility, audio and offline preferences remain unimplemented in `settings.js`.

> **Note (added during the post-Milestone-11 audit):** "Explorer profile... preferences remain unimplemented" above is now out of date — ADR-024 made every setting in `settings.js`, including this session duration, implicitly per-child (`storage.js`'s save-keying scopes to whichever Explorer Profile is active). This ADR's own Decision/Consequences text otherwise remains accurate; only the "unimplemented" framing needed updating.

### Affected Documents

504_JSON_SCHEMA.md (Session Configuration)

---

# ADR-024

## Multi-Child Explorer Profiles, Each With Their Own PIN

**Status**

Accepted

### Context

The platform had exactly one implicit, anonymous save per device (ADR-013's context). The user wants multiple named children to share one device, each with independent progress, and wants a parent to be able to check a specific child's Parent Mode dashboard without seeing another child's data. ADR-013 accepted a session-only confirmation specifically because "no PIN field exists... adding one would be a storage-schema change beyond this milestone" — that constraint no longer applies once this milestone is explicitly about adding one.

### Decision

Explorer Profile becomes a real, multi-instance, top-level entity (`explorerAcademy.profiles` in `localStorage`: id, displayName, avatar, pinHash, createdAt, lastPlayedAt, streak) instead of a single field nested in one Save Game. Each profile's PIN is per-child, not shared across children. Save Game becomes keyed per Explorer Profile ID (`explorerAcademy.save.<childId>`) instead of a single implicit save. Until a profile is created and made active, the platform falls back to the original single save key unchanged, so existing behaviour isn't disturbed mid-migration.

### Alternatives Considered

One shared family PIN protecting Parent Mode for every child (rejected by the user — per-child was explicitly requested, matching "ask for the PIN based on child name").

### Rationale

A per-child PIN matches how the feature was actually requested and lets different children's data stay genuinely separate, not just cosmetically labelled. Falling back to the legacy key when no profile is active keeps every commit in this milestone runnable without needing an atomic cutover.

### Consequences

`storage.js`'s save-reading/writing functions all gained an optional trailing `childId` parameter. A new `explorer-profiles.js` module owns profile CRUD and PIN logic; `storage.js` remains the only module touching `localStorage` directly. Supersedes ADR-013.

### Affected Documents

503_DATA_MODEL.md (Explorer Profile, Save Game), 504_JSON_SCHEMA.md (Explorer Profile, Save Game)

---

# ADR-025

## Parent PIN Is a Client-Side-Hashed Deterrent, Not Real Security

**Status**

Accepted

### Context

ADR-024 adds a PIN per child. This is a fully static, backend-less application (Design Constraints, Technology Constraints) — there is no server to hold a secret away from the device the PIN is meant to gate.

### Decision

PINs are hashed with the browser's built-in Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`) before being stored, and only ever compared as hashes. No new dependency is introduced. There is deliberately no PIN-recovery flow.

### Alternatives Considered

Storing the PIN as plain text (rejected — trivially visible in `localStorage`/devtools for zero effort). A "forgot PIN" recovery flow (rejected — impossible to build honestly without a backend of some kind; any client-side-only "recovery" would just be a second bypass mechanism).

### Rationale

Hashing prevents the PIN from being casually visible in storage, but this is explicitly communicated as a deterrent, not access control: the child necessarily has access to the same browser/device the hash lives in, and could still clear `localStorage` (losing that profile's PIN, not bypassing it) or, with enough technical curiosity, defeat any client-only scheme. Setting the right expectation with the user mattered more than pretending otherwise.

### Consequences

Forgetting a PIN means resetting that child's profile — there is no recovery path. PIN changes can only happen from inside Parent Mode itself (after entering the current PIN), never from the child-facing Settings page, so a child cannot lock a parent out by changing it.

### Affected Documents

504_JSON_SCHEMA.md (Explorer Profile)

---

# ADR-026

## Explorer Profiles Are Local Device Profiles, Not the Excluded "User Accounts"

**Status**

Accepted

### Context

301_PLATFORM_ARCHITECTURE.md's Out of Scope section explicitly excludes "user accounts" alongside cloud sync, multiplayer, online leaderboards, advertisements, in-app purchases and mandatory internet connectivity. ADR-024 (Milestone 11) then introduced Explorer Profiles with names and PINs — a post-implementation audit raised whether this crosses the line that exclusion was meant to draw.

### Decision

It does not. Explorer Profiles are a purely local, device-bound save-slot mechanism — closer to "which save file" in a single-player video game than to a user account. There is no server, no login session, no credential that works across devices, no identity that persists anywhere but the one browser's `localStorage`, and no feature (sync, purchases, social) from the rest of that excluded list is implied or enabled by having a name and a PIN.

### Rationale

Reading the Out of Scope list as a whole, every other item on it (cloud sync, multiplayer, leaderboards, ads, purchases, mandatory connectivity) is about avoiding network/commercial complexity and pressure. "User accounts" in that context reads as shorthand for *that* kind of account — sign-up flows, server-side identity, cross-device continuity — not "two siblings sharing a tablet with separate local save files," which several other documents (503_DATA_MODEL.md's Explorer Profile entity, 601_HTML_ARCHITECTURE.md's Explorer Profile page) already assumed would exist in some form.

### Consequences

Future features must keep respecting the boundary this ADR draws: anything that would make a profile mean something *outside* the single device it was created on (recovery via email, cross-device sync, a server-verified PIN) would cross into the excluded territory and need its own new ADR and explicit approval, not be added quietly under the Explorer Profile umbrella.

### Affected Documents

301_PLATFORM_ARCHITECTURE.md (Out of Scope)

---

# ADR-027

## Genuine Offline Caching via a Manifest-Driven Service Worker

**Status**

Accepted

### Context

Phase 11 testing found that "offline after initial loading" (ADR-004) wasn't actually true beyond whatever pages a browser's ordinary HTTP cache happened to retain — a mission never visited before losing connectivity failed to load, confirmed directly rather than assumed. There was no service worker or cache manifest anywhere in the platform.

### Decision

Added `portal/sw.js`, a service worker that precaches the entire platform shell (hand-maintained list — JS/CSS/components/index.html, short and stable) plus every known campaign's complete `src/`+`generated/` content on install, using a cache-first fetch strategy with a network fallback. The campaign file list is generated by a new script (`scripts/generate_offline_manifest.py`, mirroring `scripts/build_workbook.py`'s existing pattern) into each campaign's own `generated/offline-manifest.json`, rather than hand-maintaining a list of 100+ files. Both the learner shell (`app.js`) and Parent Mode's separate static page (`parent-mode.js`) register the same worker, since either could be the first page loaded on a device.

### Alternatives Considered

Caching only what gets visited at runtime (rejected — this is what ordinary HTTP caching already does today, and is exactly the behaviour Phase 11 found insufficient). A build-time bundler-driven manifest (rejected — contradicts the "no build tools" Technology Constraint; a checked-in script producing a plain JSON file, following the workbook script's own precedent, achieves the same result by hand).

### Rationale

Campaign 01's entire `src`+`generated` tree measured under 1MB total — small enough that precaching everything is simpler and more robust than trying to judge which assets are "essential" per mission. A cache-first strategy suits static educational content that changes rarely and shouldn't need a network round trip once cached.

### Consequences

`CACHE_VERSION` in `sw.js` must be bumped by hand whenever shipped platform or campaign files change, for returning devices to pick up the new content — there is no build tool to do this automatically. Verified: a version bump correctly discards the old cache on the next load (tested directly, not assumed). Service workers require a secure context (`https://` or `localhost`) and cannot run under `file://` at all — this does not create a new regression, since `file://` deployment never worked offline anyway (ES modules are blocked there regardless, per the correction already recorded in 601_HTML_ARCHITECTURE.md's Static Site Architecture section); registration simply fails silently there, same as any unsupported browser.

### Affected Documents

601_HTML_ARCHITECTURE.md (Offline-First Architecture, Offline Strategy)

---

# ADR-028

## Save Export/Import as a Manual Downloadable File, Not Cross-Device Sync

**Status**

Accepted

### Context

A parent asked for a way to move one Explorer to another device "smoothly." ADR-026 already excludes automatic cross-device sync from this architecture (no backend to sync through, and syncing would make a profile mean something beyond the single device it was created on). The request needed a concrete answer for what *is* in scope: a manual file the parent downloads on one device and imports on another, entirely under the parent's control, with no network transport involved.

### Decision

Added `exportProfile(childId)`/`importProfile(exportedData)` to `explorer-profiles.js`, built on new thin `exportSave(childId)`/`importSave(childId, save)` wrappers in `storage.js`. Export bundles the profile's identity fields (name, avatar, PIN hash, streak) and that child's full save into one versioned (`exportFormatVersion`) JSON object; Settings offers it as a browser download (`Blob` + `<a download>`, no server round trip). Import, reachable from the "Who's Exploring Today?" screen, reads the chosen file, validates its shape, and creates a **new** local profile from it — it never overwrites or merges into an existing profile, and always mints a fresh local id rather than reusing the one in the file, so two devices can never collide on the same id. A display name already in use on the importing device is rejected with a clear message rather than silently merged.

Only the PIN's hash travels in the file, never the plaintext PIN — the same PIN keeps working after import (the hash still matches), without ever writing the actual PIN to disk.

### Alternatives Considered

Automatic cross-device sync (rejected outright — this is precisely what ADR-026 excludes; would require a backend this platform doesn't have). Exporting the plaintext PIN for convenience (rejected — no reason to ever put the actual PIN in a file that might be emailed, uploaded, or left in a Downloads folder, when shipping the hash achieves the same "same PIN works after import" outcome without that exposure). Overwriting/merging into an existing same-named local profile on import (rejected — silently clobbering local progress on a name collision is a worse failure mode than asking the parent to rename or remove the existing Explorer first).

### Rationale

This stays firmly on the "local device profile" side of the line ADR-026 draws: the file is inert data the parent manually carries between devices (via USB, email attachment, cloud drive, however they like), not a live channel between the platform and any server. Reusing `exportSave()`/`readSave()` and `isNameTaken()` rather than duplicating logic keeps the save shape and name-collision rule owned in exactly one place each.

### Consequences

Importing the same backup file twice produces two independent local profiles, not one kept in sync — this is expected given the "new profile, fresh id" design, and matches how a parent would expect a backup restore to behave (never silently overwrite). If `storage.js`'s save shape ever needs a real migration path (`STORAGE_VERSION` bump), `exportFormatVersion` and `STORAGE_VERSION` are separate numbers and may need to evolve together — noted here so a future change doesn't miss it.

### Affected Documents

None beyond this entry — no existing architecture document described save portability one way or the other.

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