# TODO.md

# Explorer Academy — Implementation Roadmap

**Status:** Active

This document tracks the implementation of Explorer Academy from architecture through production.

It is the authoritative implementation checklist for both humans and AI contributors.

---

# Current Project Status

## Foundation

- [x] Project Manifest
- [x] README
- [x] Project Context
- [x] Documentation Index
- [x] Dependency Graph
- [x] Generation Roadmap
- [x] Design Decision Log
- [x] AI Contributing Guide
- [x] Kickoff Prompt
- [x] Changelog

---

## Architecture

- [x] Platform Architecture
- [x] Campaign Template
- [x] Mission Template
- [x] Campaign 01
- [x] HTML Architecture
- [x] Campaign Content Specification
- [x] Data Model
- [x] JSON Schema

---

# Phase 1 — Platform Bootstrap

Status

```
COMPLETE
```

Goal

Create the complete browser application skeleton.

Expected Output

```
Working repository structure

HTML shell

CSS architecture

JavaScript architecture

Placeholder pages

Empty campaign loader

No application logic
```

Milestones

- [x] Repository structure

- [x] HTML shell

- [x] CSS structure

- [x] JavaScript modules

- [x] Empty campaign folders

- [x] JSON placeholders

Deliverable

```
The application opens successfully.

Navigation exists.

No functionality yet.
```

---

# Phase 2 — Core Platform

Status

```
COMPLETE
```

Goal

Build the Explorer Academy engine.

Milestones

- [x] Router

- [x] Campaign Loader

- [x] Mission Engine

- [x] Activity Renderer

- [x] Scheduler

- [x] Save State

- [x] Discovery Log

- [x] Reward Engine

Deliverable

```
Platform can load and render placeholder missions.
```

---

# Phase 3 — Campaign Compiler

Status

```
COMPLETE
```

Goal

Convert Campaign 01 documentation into structured JSON.

Compiler

```
Campaign Compiler
```

Input

```
501_CAMPAIGN_01.md

503_DATA_MODEL.md

504_JSON_SCHEMA.md
```

Output

```
portal/

campaigns/

campaign01/

src/

campaign.json
```

Success Criteria

- Valid JSON

- Schema compliant

- No duplicated information

---

# Phase 4 — Mission Compiler

Status

```
COMPLETE — all 21 missions compiled
```

Goal

Convert every mission into independent JSON.

Compiler

```
Mission Compiler
```

Input

```
Campaign document

Mission specification

Data model
```

Output

```
portal/

campaigns/

campaign01/

src/

missions/

mission01.json

...

mission21.json
```

Success Criteria

- Every mission validates

- References resolve

- Scheduler metadata exists

---

# Phase 5 — Asset Compiler

Status

```
COMPLETE — World Bible Compiler (src/world/ + src/parent/) and Asset Compiler (all 4 batches, Missions 1–21: workbook pages, parent enrichment, image specifications, experiments.json) both fully populated across the whole campaign
```

Goal

Generate supporting assets.

Compiler

```
Asset Compiler
```

Input

```
Campaign JSON

Mission JSON
```

Output

```
generated/

workbook/

parent/

resources/

image-specifications/
```

Produces

- Workbook pages

- Parent guides

- Experiments

- Reflection prompts

- Reading lists

- Image specifications

- Vocabulary

- Discussion prompts

---

# Phase 6 — Mission Polish

Status

```
COMPLETE — all 21 missions reach production quality
```

Goal

Improve each mission.

Checklist (per mission)

- [x] Story flow — Missions 1–21

- [x] Curiosity — Missions 1–21

- [x] Difficulty — Missions 1–21

- [x] Discovery Log — Missions 1–21

- [x] Rabbit Holes — Missions 1–21

- [x] Reflection — Missions 1–21

- [x] Rewards — Missions 1–21

Deliverable

One mission reaches production quality. ✅

Repeat for remaining missions. ✅ (all 21 complete)

---

# Phase 7 — Workbook

Status

```
COMPLETE — printable PDF compiled and rendered; answer guide authored as a "what a strong response looks like" checklist; notebook alternatives and parent guide were already complete from Phases 5/8 and are now bound into the single compiled document
```

Goal

Produce printable workbook.

Deliverables

- [x] Printable PDF — `generated/workbook/Campaign-01-Workbook.pdf` (47 pages), built from `Campaign-01-Workbook-Compiled.md`

- [x] Notebook alternatives — all 21 `generated/workbook/pages/missionNN.md` notebook pages (from Phase 5), now embedded in the compiled workbook

- [x] Answer guide — `generated/workbook/answer-guide.json`, a "what a strong response looks like" checklist per mission (not a traditional answer key — see note field), with real physical-science outcomes quoted from `experiments.json` for Missions 7/10/15 only

- [x] Parent guide — welcome, session length & materials, and curriculum mapping content (from `src/parent/`) compiled into the same PDF ahead of the mission sections

---

# Phase 8 — Parent Mode

Status

```
COMPLETE — portal/js/parent-mode.js implements all five features below, wired to portal/parent/index.html as a standalone page never linked from the learner shell
```

Goal

Complete hidden parent experience.

Features

- [x] Curriculum mapping — rendered from src/parent/curriculum-mapping.json

- [x] Progress dashboard — derived from earned rewards + Discovery Log entries (no new storage field needed)

- [x] Assessment evidence — each mission's parentGuide.assessment paired with the Explorer's own recorded Discovery Log entries for that mission

- [x] Suggested interventions — generated/parent/enrichment's expectedMisconceptions, where available

- [x] Extension ideas — enrichment's stretchQuestions plus each mission's embedded Extension activity

---

# Phase 9 — Visual Assets

Status

```
COMPLETE (as flat-vector SVG placeholder art) — all 24 images.json specs and all 10 badge/rank/knowledgeCore reward icons have a generated SVG; see generated/images/STYLE_GUIDE.md for the documented limitation and swap-out path if real illustration becomes available later
```

Goal

Generate visuals.

Includes

- [x] Maps — the 5 diagram specs (sketch map, water system, star chart, geological sketch, investigation board)

- [ ] Character art — not attempted; would need real illustration, not a diagram-style stand-in (see STYLE_GUIDE.md)

- [x] Icons — 10 badge/rank/knowledgeCore reward icons

- [x] Diagrams — same 5 as Maps above

- [x] Story scenes — 19 scenes, as flat-vector SVG stand-ins (no image-generation tool available in this environment)

- [x] Badges — 3 badge icons

- [x] Rank graphics — 3 escalating rank-tier icons

---

# Phase 10 — Explorer Profiles & Multi-Child Support

Status

```
COMPLETE — all 11 implementation-plan steps delivered and verified; see CURRENT_TASK.md's "Previous Milestone — Milestone 11" for full detail
```

Goal

Turn the single implicit, anonymous save into multiple named child profiles, each with their own persisted state, selected explicitly on Home, with Parent Mode gated per-child by a PIN.

Checklist

- [x] Storage foundation: profiles index, per-child save keying, active-child pointer, PIN hashing (Web Crypto SHA-256)

- [x] Migration path for the pre-existing single-key save (wired into Home's "+ New Explorer" form)

- [x] Profile CRUD (create/list/verify PIN/update/change PIN/delete/touch last-played)

- [x] Home page: "Who's Exploring Today?" selector + inline "+ New Explorer" form

- [x] "Switch Explorer" navigation affordance on every learner-shell route

- [x] Per-child accessibility settings (font scale, high contrast, reduced motion)

- [x] Explorer Profile stats: Explorer-since, last-played, streak, missions completed

- [x] Parent Mode: per-child name + PIN gate, scoped dashboard, in-Parent-Mode "Change PIN"

- [x] Streak/last-played tracking (Home selection and reflection completion, idempotent same-day)

- [x] Documentation: 503_DATA_MODEL.md/504_JSON_SCHEMA.md updated for multi-instance Explorer Profile + per-profile Save Game; ADR-024/ADR-025 added, ADR-013 marked Superseded

Deliverable

Two or more children can share one device with fully independent progress, and a parent can view any specific child's Parent Mode dashboard only after that child's own PIN.

---

# Phase 11 — Testing

Status

```
COMPLETE — every checklist item verified with an actual test run and an evidenced verdict; two genuine gaps found (one fixed live, one flagged as real implementation work for a future milestone). See CURRENT_TASK.md's "Previous Milestone — Phase 11: Testing" for full detail.
```

Checklist

- [x] Desktop — pass. 1440×900: no overflow, all flows (Home selector, missions, Settings, Discovery Log, Explorer Profile) function correctly.

- [x] Tablet — pass functionally (768×1024: no overflow, no broken flows), but with a real finding: buttons measure ~21px tall against the ~44px touch-target guideline 601_HTML_ARCHITECTURE.md calls for ("touch-friendly controls"). Root cause is `layout.css`/`components.css` still being empty Milestone-1.1 placeholders — not a regression, but real design/CSS work to genuinely close, out of scope for this testing pass.

- [x] Mobile — same verdict as Tablet (375×667): functionally fine, same touch-target gap.

- [x] Offline — **fully fixed post-Phase-11.** A service worker (`portal/sw.js`, ADR-027) now precaches the entire platform shell and every known campaign's complete `src`/`generated` content on first load. Verified directly: a mission never visited during the current session now loads correctly after going offline (the exact case that failed during Phase 11 testing), Parent Mode works fully offline including as the very first page visited on a device, and a cache-version bump correctly discards stale content on the next load. ADR-004/601's "a complete campaign should remain usable without network access" after initial loading is now genuinely true, not just true for whatever pages happened to already be visited.

- [x] Accessibility — pass, with one real gap found and fixed during testing: OS-level `prefers-reduced-motion` wasn't honoured automatically, only the explicit in-app Settings toggle — added a 2-line `@media (prefers-reduced-motion: reduce)` rule to `base.css`, verified working via Playwright's reduced-motion emulation. Also verified: keyboard tab order is logical, native focus outline is never suppressed anywhere in the CSS, all landmarks present (`header`/`main[aria-live]`/`nav[aria-label]`/`footer`), and every form control (radios, checkboxes, text/PIN inputs) has a verified accessible name via real label association, not just visual proximity.

- [x] Broken links — pass. Crawled all 27 learner-shell routes (5 static + 1 campaign overview + 21 missions) plus Parent Mode: zero 4xx/5xx responses, zero console page errors.

- [x] Save State — pass. Profile, active session and Discovery Log all survive a full page reload; confirmed correct storage isolation (a different browser context sees zero data, as expected for `localStorage`).

- [x] Parent Mode — pass. Zero-profiles empty state shows the correct friendly message; full picker → PIN → dashboard cycle works correctly end-to-end.

- [x] Multi-child profile isolation — pass. Three simultaneous profiles created and cross-checked in both directions: each Explorer's Discovery Log shows only their own entries, with zero leakage.

---

# Phase 12 — Campaign Release

Checklist

- [ ] Campaign complete

- [ ] Workbook complete

- [ ] Parent Mode complete

- [ ] Assets complete

- [ ] Documentation updated

---

# AI Workflow

Every implementation task should follow:

```
Read Documentation

↓

Analyse

↓

Plan

↓

Identify Files

↓

Implement

↓

Verify

↓

Summarise

↓

Stop
```

Never implement multiple milestones simultaneously.

---

# Compiler Workflow

```
Campaign 01.md

↓

Campaign Compiler

↓

campaign.json

↓

Mission Compiler

↓

mission01.json

↓

...

↓

mission21.json

↓

Asset Compiler

↓

Workbook

↓

Parent Guides

↓

Resources

↓

Image Specifications
```

Every compiler must validate against

```
503_DATA_MODEL.md

504_JSON_SCHEMA.md
```

before producing output.

---

# Definition of Done

The project is complete when:

- The platform runs entirely offline.
- Campaigns are data-driven.
- New campaigns require no platform code changes.
- Curriculum remains hidden from the learner.
- Parent Mode provides full traceability.
- Workbook is optional.
- A child can independently complete a campaign with minimal adult assistance.

---

# Current Next Action

**Phases 5, 6, 7, 8 and 9 are all complete.** Phase 8 (Parent Mode) replaced `parent-mode.js`'s empty placeholder with a real implementation, wired up to the already-existing `portal/parent/index.html` static entry point (never linked from the learner shell, per `router.js`'s own documented architecture and ADR-006). It covers all five TODO.md features by reusing content already generated in Phases 4/5 — no new content authored. The standout feature is Assessment Evidence: each mission's parent guidance is paired with the Explorer's own actual recorded Discovery Log entries, verified end-to-end (completed a reflection in the learner shell, confirmed it appeared in Parent Mode). "Verify parent access" is a session-only confirmation click rather than a PIN, since no such field exists in the save schema — documented as an explicit, revisitable choice. Found and fixed a real path-resolution bug along the way (`portal/parent/index.html` sits one directory deeper than the learner shell assumes) via a single `<base href="../">` tag rather than touching shared loader modules. Phase 9 (Visual Assets) generated a real, renderable SVG asset for all 24 `images.json` specs plus 10 badge/rank/knowledgeCore reward icons — but only after flagging to the user that no image-generation tool is available in this environment, so the 19 specs written as "warm, painterly illustration" can't be produced as genuine illustrations. The user chose flat-vector SVG for everything, in one consistent style (`generated/images/STYLE_GUIDE.md`), over skipping the scene specs entirely. Mission 1's and Mission 21's scene SVGs deliberately mirror each other's composition. Unlock and story rewards were deliberately left without bespoke icons (they're access/narrative flags, not collectible badges). All 34 SVGs validated as well-formed XML and spot-checked visually via headless-Chromium screenshots. Noted but did not fix: no compiled Knowledge Core catalog exists in `src/` despite 504_JSON_SCHEMA.md requiring `description`/`icon` fields on that entity — a data-model gap, not a visual-asset one.

Phase 7 (Workbook) authored `generated/workbook/answer-guide.json` (a "what a strong response looks like" checklist per mission, deliberately not a traditional answer key, consistent with `orientation.json`'s own Assessment Philosophy — real physical outcomes only quoted where a genuine one exists, i.e. Missions 7/10/15's household experiments), then assembled a new `Campaign-01-Workbook-Compiled.md` (welcome/materials/curriculum-mapping content + all 21 notebook pages + all 4 existing printables + the answer guide, in one document) and rendered it to `Campaign-01-Workbook.pdf` (47 pages) via a Markdown→HTML→Chromium-print pipeline built in-session (no pandoc/weasyprint available in this environment). Verified via PyMuPDF (page count, expected-content checks) and visual inspection of 3 sample pages. `workbook.json` now points to both new files. Per ADR-005, the PDF remains entirely optional — every mission is still fully completable with a blank notebook.

**Before starting Phase 10**, the user asked for a full audit of the foundation documents against the actual implementation — ambiguity, architecture/implementation clashes, open questions, philosophy drift. Read all ten priority docs plus 502/505/the Changelog and cross-checked against the running code. Found 8 issues; the user chose to fix the two functional ones now and defer the rest:

- **Fixed: Session Duration control.** ADR-009's "parents choose a session duration" had no actual UI — `settings.js` was an empty placeholder and `router.js` always scheduled a hardcoded 60 minutes regardless of any setting. `settings.js` is now a real Settings Manager; `storage.js` gained a `settings` field; the `/settings` route is a working form; both the mission page's duration display and the real `scheduleActivities()` call now use the stored preference. Verified in-browser: setting 90 minutes actually changes what's scheduled and survives a reload.
- **Fixed: Knowledge Core / Explorer Rank catalog.** 503/504 define these as entities with their own description/icon, but every mission reward was just a bare string. Added `portal/campaigns/campaign01/src/world/knowledge-cores.json` and `ranks.json` (seeded from Phase 9's badge icons), an optional `coreId`/`rankId` reference on the 7 relevant mission rewards, and a `resolveRewardDetails()` resolver wired into both Explorer Profile and Parent Mode's reward displays. Verified in-browser: earning a reward now shows its real icon and description in both places. Documented both fixes inline in `504_JSON_SCHEMA.md`.
The user then asked to clear the remaining six deferred items, all now done except the last (deliberately left as a proposed plan):

- **Fixed: workbook directory placement.** `601_HTML_ARCHITECTURE.md`'s own Repository Structure tree already correctly showed `generated/workbook/` nested under each campaign — only a single contradicting prose sentence claimed a repository-root `workbook/` directory. Corrected that sentence in place and removed the unused, empty root `workbook/` directory (and its listing in CLAUDE.md's Repository Layout) — it was never actually used.
- **Fixed: Design Decision Log.** Added ADR-012 through ADR-023 to `006_DESIGN_DECISION_LOG.md`, covering every concrete architectural/product decision made while implementing the platform so far: Parent Mode as a separate static page, session-only parent access, the reward-unlock trigger, the Discovery Log schema extension, embedded/required `parentGuide`, the Scheduler's duration-band model, the campaign-agnostic compiler-prompt rewrite, flat-vector SVG placeholder art, the workbook Answer Guide's checklist framing, the checked-in workbook build script, the Knowledge Core/Rank catalogs, and Session Duration.
- **Fixed: Changelog.** Added a `v0.5.0` entry to `009_CHANGELOG.md` summarizing everything Phases 1–9 delivered, with an explanatory note on why it's versioned as v0.5.0 rather than the originally-planned v1.0.0/v2.0.0 (those track Foundation-*document*-approval status, which remains Draft, not code delivery).
- **Fixed: uncommitted build script.** The workbook PDF's Markdown→HTML→Chromium-print pipeline is now `scripts/build_workbook.py`, a real, reusable, checked-in script (takes a campaign slug argument). Re-ran it and confirmed it reproduces byte-identical compiled Markdown and a PDF with the same page count and content as what was already committed — regenerated PDF committed alongside it.
- **Fixed: CLAUDE.md doc-path typo.** `docs/40-campaigns/503_DATA_MODEL.md`/`504_JSON_SCHEMA.md` corrected to their real location, `docs/50-content/`.
- **Planned, not started: Home/Explorer Profile parity.** Rather than implementing this without a check-in, wrote a full proposed milestone plan into `CURRENT_TASK.md` (objective, files, step-by-step implementation plan, explicit scope boundaries, success criteria) and left it awaiting approval, per CLAUDE.md's Milestone Lifecycle.

**That plan has since grown substantially.** The user wants multiple named children able to share one device, each with fully independent saved state, selected explicitly on Home, with Parent Mode gated per-child by a PIN the parent sets when creating that child's profile. A clarifying round resolved the real ambiguities: PIN is per-child (not shared), hashed client-side via the Web Crypto API but explicitly acknowledged as a deterrent only (no backend, no recovery flow — losing a PIN means resetting that profile), new-child creation happens inline on Home ("+ New Explorer"), Home always shows a "Who's Exploring Today?" selector rather than auto-resuming (plus a persistent "Switch Explorer" link everywhere), and selecting a child loads only their own state (no per-child content restrictions). Also confirmed in scope: per-child session duration and accessibility settings, plus Home-screen stats (Explorer-since date, last-played date, streak count, total missions completed). This is now written up as **Phase 10 — Explorer Profiles & Multi-Child Support** above and "Milestone 11" in `CURRENT_TASK.md`, with a full implementation plan (storage redesign, migration path, profile CRUD, Home/Settings/Explorer-Profile/Parent-Mode changes, new ADR(s) superseding ADR-013) — not started, awaiting explicit approval to begin.

Testing (now Phase 11, renumbered to make room for Phase 10 above) and Campaign Release (now Phase 12) remain the phases after this.

**Phase 10 is now underway.** The user asked to start with storage foundation and profile CRUD (implementation-plan steps 1-3). Done and verified: `storage.js` gained a profiles registry, per-child save keying (`explorerAcademy.save.<childId>`), an active-child pointer, and PIN hashing — every existing save function now takes an optional child ID and falls back to the original single-save key when no profile is active, so nothing else in the app changed behaviour yet. New `explorer-profiles.js` implements full CRUD (create/list/verify PIN/update/change PIN/delete/touch-last-played), with case-insensitive name-uniqueness checks, 4-8 digit PIN validation, and per-profile PIN isolation, all verified via headless Chromium against the real modules. The pre-existing single anonymous save isn't lost: `hasUnmigratedLegacySave()`/`createProfileFromLegacySave()` can move it into a first profile, verified against a seeded legacy save. Two new ADRs (024, 025) record the multi-child-profile decision and the explicit "PIN is a deterrent, not real security" stance; ADR-013 is marked Superseded rather than deleted. `503_DATA_MODEL.md`/`504_JSON_SCHEMA.md` updated to describe Explorer Profile as a real multi-instance entity and Save Game as keyed per profile.

**Home page rework and Switch Explorer are now done too.** `router.js`'s Home route checks for an active Explorer: if none, it shows "Who's Exploring Today?" (existing profiles with avatar/Explorer-since/last-played/streak/missions-with-progress, plus a collapsed "+ New Explorer" form); if one is active, it shows the normal dashboard (Continue Mission / Choose Campaign) scoped to them. Creating or selecting a profile activates it immediately and calls `touchLastPlayed()`. A profile created while an unmigrated legacy save exists adopts it automatically via `createProfileFromLegacySave()`, surfaced with an explanatory notice in the form. "Switch Explorer" is a persistent link in the footer nav (`components/navigation/nav.js`) with its own click handler in `router.js` that clears the active child before returning to Home — a deliberate design choice made during implementation: once a child is active, Home shows their dashboard directly (not the picker) so a single-child household isn't reprompted on every visit, and "Switch Explorer" is what makes changing identity an explicit, never-silent action. Verified end-to-end: two independently-created profiles never leaked mission progress, rewards, or Discovery Log entries into each other; the legacy-save migration works through the real UI, not just as a pure function; and a full regression pass (all 21 missions, Settings, Parent Mode) confirmed the legacy-key fallback still works perfectly when no profile has ever been created.

**Parent Mode's PIN gate is now done too**, at the user's explicit request to tackle it next. `parent-mode.js`'s old one-click "I'm a parent" gate is replaced with a three-step flow: pick which Explorer by name (`renderExplorerPicker` — names alone aren't sensitive), enter that Explorer's own PIN (`renderPinGate`, hash-verified via `explorer-profiles.js`'s `verifyProfilePin()`, retryable with no lockout since a PIN here is a deterrent per ADR-025, not real security with a backend to reset against), then a dashboard scoped to exactly that child's save. `reward-engine.js`/`discovery-log.js`'s getters gained an optional `childId` parameter so Parent Mode can read a specific (not necessarily learner-shell-active) child's data. A "Change PIN" control lives at the bottom of the dashboard — requiring the current PIN — and is deliberately the *only* place a PIN can change, since a child managing their own play session must never be able to lock a parent out. Verified end-to-end: a wrong PIN and a different child's correct PIN are both rejected against the wrong gate; a correct PIN shows only that child's data (rewards, Discovery Log entries) with zero leakage from a sibling profile in either direction; changing a PIN immediately invalidates the old one; and the zero-profiles case shows a friendly message instead of a broken picker. Full regression (21 missions, Home, Settings, Parent Mode) confirms the legacy-key fallback is untouched.

**Milestone 11 is now fully complete.** The last two pieces: Settings gained an Accessibility section (text-size radios, high-contrast and reduced-motion checkboxes) backed by new `getAccessibilityPreferences()`/`setAccessibilityPreferences()`/`applyAccessibilityPreferences()` in `settings.js` — the last of these toggles CSS classes on `<html>`, styled by genuinely new rules in `base.css`/`themes.css` (the first real content either file has had since the Milestone 1.1 placeholder). It's called at app bootstrap, whenever a profile is activated or cleared, and immediately after saving new preferences, so two children's accessibility settings never bleed into each other and a reload never flashes unstyled content — verified via `getComputedStyle` actually changing (16px → 24px font, black/white high-contrast colors), not just a stored value with nothing rendering it. Explorer Profile page gained a stats block (Explorer-since, last-played, streak, missions-with-progress count) reusing Home's exact same counting helper so the two views can never disagree. Also completed while in the area: `touchLastPlayed()` now fires on reflection completion too, not just Home selection (confirmed idempotent — no double-counting on the same day).

All 11 implementation-plan steps are done and verified across four incremental, individually-tested commits. The platform now genuinely supports multiple named children sharing one device: independent saves, independent PIN-gated Parent Mode views, independent accessibility/duration preferences, independent progress stats — with the original single anonymous save preserved via migration, not discarded. Phase 11 (Testing) is the only phase left on the roadmap.

**Post-Milestone-11, the user asked for a full re-verification of every ADR/vision-doc principle plus a differentiator-feature brainstorm for README.** Re-checked all 26 ADRs against running code (not assumed): found and fixed a stale claim in ADR-023 (per-child settings, made true by ADR-024, weren't reflected in ADR-023's own text), and found a real, previously-unverified gap predating this whole session — `601_HTML_ARCHITECTURE.md`'s claimed "Local filesystem"/"USB distribution" (`file://`) deployment targets have never worked, since browsers block ES module loading under `file://` with a CORS error (confirmed directly, not assumed) — documented in place as a correction, not silently fixed, since a real fix means dropping ES modules platform-wide. Added **ADR-026** resolving a genuine scope-boundary question raised by Milestone 11: Explorer Profiles are local, device-bound save-slot switching, not the "user accounts" 301_PLATFORM_ARCHITECTURE.md's Out of Scope section excludes. Surfaced (not silently resolved) one real philosophy tension for the user's own call: Milestone 11's streak counter and progress stats on Home's first screen sit close to — without technically violating — ADR-007's "completion is not the primary metric" and the Non-Goal of becoming "a reward-driven educational app." Also found and fixed `README.md`'s multi-phase staleness (it still said "no implementation has started") and added a new "🌱 Future Possibilities" section: six true differentiators (Cross-Campaign Continuity, a Habits-of-Mind Portfolio, Real-World-Synced Investigations, an Explorer's Field Journal built from the child's own Discovery Log, cooperative Joint Expedition Missions, Confidence Calibration) plus a shorter list of smaller worthwhile ideas, each tied explicitly back to the project's own founding philosophy.

**Phase 11 (Testing) is now complete** — every checklist item was verified with an actual test run, not assumed. Six items pass cleanly (Desktop, Broken links, Save State, Parent Mode, multi-child isolation, and Accessibility). Accessibility surfaced one real gap that was fixed on the spot: OS-level `prefers-reduced-motion` wasn't honoured automatically, only the explicit in-app toggle — a 2-line CSS media-query addition closed it, verified via Playwright's reduced-motion emulation. Two items pass functionally but surfaced genuine, pre-existing gaps worth a future milestone rather than a quiet patch: Tablet/Mobile have no overflow or broken flows, but buttons measure ~21px tall against the ~44px touch-target guideline, since `layout.css`/`components.css` remain empty placeholders; and Offline turns out to mean "offline for routes you've already visited" (via ordinary browser HTTP caching), not "the whole campaign, offline, after one initial load" as ADR-004/601 promise, since no service worker or cache manifest exists. Both are real, now-documented implementation gaps, not regressions from anything built this session.

**The user asked to fix offline caching next, before Phase 12.** Added `portal/sw.js`, a service worker that precaches the entire platform shell plus every known campaign's complete `src`/`generated` content on first load (124 campaign files + 20 shell files, generated by a new `scripts/generate_offline_manifest.py` mirroring the workbook script's own pattern), using a cache-first strategy with a network fallback. Both `app.js` and `parent-mode.js` register it via a shared `registerServiceWorker()` helper, since either page could be the first one loaded on a device. Verified directly against the exact Phase 11 failure case: after one online load, two missions never fetched during the session both loaded correctly offline; Parent Mode works fully offline too; a `CACHE_VERSION` bump correctly discards stale content on the next load; and a full regression pass confirms zero interference with any existing flow. ADR-027 records the decision. Phase 11's Offline checklist item is updated to reflect the fix — ADR-004's "complete campaign usable without network access" promise is now genuinely true, not just true for whatever happened to already be visited.

Only Phase 12 (Campaign Release) remains on the roadmap, alongside the Tablet/Mobile touch-target CSS gap from Phase 11 and Milestone 11's/README's own deferred ideas as candidates for what comes next. Awaiting user direction.