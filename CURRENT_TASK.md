# CURRENT_TASK

## Phase

Unscheduled — Milestone 11: Multi-Child Explorer Profiles — PLANNED, NOT STARTED

## Milestone

**Milestone 11 — Multi-Child Explorer Profiles, Per-Child Save Slots, and PIN-Gated Parent Mode.** This supersedes the earlier, narrower "Home & Explorer Profile Parity" draft — that work is now folded into this milestone's scope. This is a full implementation plan only, per CLAUDE.md's Milestone Lifecycle — awaiting explicit user approval before any code is written.

## Objective

The platform today has exactly one implicit, anonymous save (`explorerAcademy.save` in `localStorage`) and Parent Mode is a single global, unauthenticated dashboard. The user wants multiple named children to share one device, each with their own persisted state (rank, completed missions, earned rewards, Discovery Log, settings, accessibility preferences), selected explicitly on Home, with Parent Mode gated per-child by a PIN that parent sets when creating that child's profile. This is a genuine data-model and architecture change (turns the single Save Game into N Save Games behind a new Explorer Profile registry), decided through a clarifying round with the user rather than assumed:

- **PIN is per-child**, not one shared family PIN.
- **PIN is hashed client-side** via the browser's built-in Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`) before storage — no new dependency, but explicitly acknowledged as a deterrent only, not real security: this app has no backend, so anyone with devtools access to the same browser/device (which the child necessarily has) could still inspect or clear it. There is no PIN-recovery flow for the same reason — forgetting a PIN means resetting that child's profile.
- **New-child creation happens inline on Home** ("+ New Explorer" opens a small name + PIN form right there), not a separate admin page.
- **Home always shows "Who's Exploring Today?" first** — it never silently auto-resumes the last-played child (protects siblings sharing a device) — but a persistent **"Switch Explorer"** link is available from every learner-shell page as a fast path back to that picker.
- Selecting an *existing* child loads their own state and drives what they see next (rank, unlocked/completed missions, earned rewards) — nothing more exotic than "each child's own save genuinely drives their own experience." No per-child content restriction concept is being introduced.
- Confirmed in scope: per-child session duration (a required consequence of adding profiles at all — the existing global duration setting becomes per-child), per-child accessibility preferences (font scale, high contrast, reduced motion), and Home-screen stats — Explorer-since date, last-played date, a simple streak count, and total missions completed (a count, or a clearly-labelled *estimated* time sum from missions' own `estimatedTime` fields — never presented as measured time, since no session timer exists; same honesty standard already applied in the Mission 6 answer-guide entry).
- Explicitly **not** requested and therefore **not** in scope unless the user asks: cross-device sync/hosting, save export/import as a file, avatar image upload (a small fixed emoji set only), separate parent-account logins.

## Inputs

- `docs/50-content/503_DATA_MODEL.md` — Explorer Profile entity (Explorer ID, Display Name, Active Campaign; optional Rank, Achievements, Preferences) and Save Game entity (Save ID, Explorer ID, Campaign ID, Mission Progress) — this milestone is largely *finally implementing* these two entities as real, multiple, selectable things, rather than contradicting the data model.
- `docs/50-content/504_JSON_SCHEMA.md` — Explorer Profile and Save Game required-field lists.
- `docs/60-engineering/601_HTML_ARCHITECTURE.md` — Home Page, Explorer Profile, Settings and Parent Mode sections; Storage Manager's already-documented (never implemented) Import/Export responsibility is explicitly *not* being picked up here.
- ADR-013 (Parent Access Is a Session-Only Confirmation, Not a PIN) — this milestone supersedes it with a new ADR; ADR-013 stays in the log with an updated status rather than being deleted, per the log's own "Superseded decisions remain in the log" rule.
- Existing `storage.js` (single-key save shape), `settings.js` (session duration), `reward-engine.js`, `discovery-log.js`, `parent-mode.js` (existing per-mission progress derivation, reused rather than duplicated).

## Relevant Documentation

`503_DATA_MODEL.md` (Explorer Profile, Save Game), `504_JSON_SCHEMA.md` (Explorer Profile, Save Game, Session Configuration), `601_HTML_ARCHITECTURE.md` (Home Page, Explorer Profile, Settings, Parent Mode, Storage Manager), `006_DESIGN_DECISION_LOG.md` (ADR-013, to be superseded).

## Files Expected to Change

- `portal/js/storage.js` — the biggest change. New: a profiles index (`explorerAcademy.profiles`), a per-child save keyed by child ID (`explorerAcademy.save.<childId>`, replacing the single `explorerAcademy.save` key), an active-child pointer (`explorerAcademy.activeChildId`), PIN hashing/verification, and a one-time migration path for the single pre-existing anonymous save. Every existing read/write function (`saveCurrentSession`, `loadCurrentSession`, `appendDiscoveryLogEntry`, `loadDiscoveryLog`, `appendEarnedRewards`, `loadEarnedRewards`, `saveSettings`, `loadSettings`) needs to become child-scoped: implicitly the active child for learner-shell callers, or an explicit child ID for Parent Mode callers checking a specific (not necessarily "active") child.
- `portal/js/settings.js` — extend with accessibility getters/setters (`getAccessibilityPreferences()`/`setAccessibilityPreferences()`); session duration functions become implicitly child-scoped via the `storage.js` refactor, no signature change needed at this layer.
- New `portal/js/explorer-profiles.js` (or fold into `storage.js` if it stays small) — `listProfiles()`, `createProfile({ displayName, avatar, pin })`, `verifyProfilePin(childId, pin)`, `updateProfile(childId, { displayName, avatar })`, `changePin(childId, { currentPin, newPin })`, `touchLastPlayed(childId)` (updates `lastPlayedAt` and the streak counter by calendar-day comparison).
- `portal/js/router.js` — Home becomes a two-state page: an Explorer selector ("Who's Exploring Today?" — existing profiles with avatar/Explorer-since/last-played/streak, plus "+ New Explorer") shown by default, and the existing Home content (Continue Mission, achievements, recent discovery) shown once a child is selected for this visit. A "Switch Explorer" link is added to the shared navigation, visible on every learner-shell route. Settings page gains accessibility controls. Explorer Profile page gains the stats block.
- `portal/js/parent-mode.js` — access gate becomes: pick a child by name (from the profiles index — names alone aren't sensitive) → enter that child's PIN (verified via hash comparison) → dashboard renders scoped to that child's save slot instead of the single global save. Add a "Change PIN" control inside Parent Mode itself (requires the current PIN) — deliberately the *only* place a PIN can be changed, since a child managing their own play session must never be able to lock a parent out.
- `portal/css/*.css` — accessibility classes (large-font, high-contrast, reduced-motion) applied at the shell level.
- `docs/50-content/503_DATA_MODEL.md` / `504_JSON_SCHEMA.md` — document Explorer Profile as a real multi-instance entity with a PIN field, and Save Game as keyed per Explorer Profile.
- `docs/00-foundation/006_DESIGN_DECISION_LOG.md` — new ADR(s) for multi-child profiles + per-child PIN (superseding ADR-013), and for the PIN-as-deterrent security model.

## Implementation Plan

1. **Storage foundation**: implement the profiles index, per-child save keying, active-child pointer, and `hashPin()` (Web Crypto SHA-256). Refactor every existing per-save function in `storage.js` to be child-scoped.
2. **Migration**: on first load after this ships, if the old single-key `explorerAcademy.save` exists and no profiles exist yet, prompt once to create a first profile (name + PIN) from that existing data, rather than silently discarding it.
3. **Profile CRUD**: `listProfiles()`, `createProfile()`, `verifyProfilePin()`, `updateProfile()`, `changePin()`, `touchLastPlayed()`.
4. **Home page rework**: default "Who's Exploring Today?" selector (avatar, name, Explorer-since, last-played, streak, missions-completed count per profile) + "+ New Explorer" inline form (name + PIN, both required). Selecting a profile sets the active child and reveals normal Home content scoped to them.
5. **Switch Explorer**: persistent nav-level link/button on every learner-shell route, returning to Home's selector without needing a full navigation detour.
6. **Settings page**: add accessibility controls (font scale, high contrast, reduced motion) for the active child, alongside the existing (now implicitly per-child) session duration control. No PIN control here.
7. **Explorer Profile page**: surface Explorer-since, last-played, streak, and total missions completed (a count; if a time figure is shown, explicitly labelled "estimated," summed from completed missions' own `estimatedTime` fields).
8. **Parent Mode rework**: name selector → PIN entry → hash-verified access → dashboard scoped to that child's save. Add "Change PIN" (requires current PIN) inside Parent Mode only.
9. **Streak/last-played tracking**: `touchLastPlayed()` called on Home's child selection and on reflection completion; streak increments on a new calendar day since last play, resets after a missed day.
10. **Accessibility application**: apply the active child's stored preferences (CSS classes on the shell) at app init and whenever Settings changes them.
11. **Documentation**: update `503_DATA_MODEL.md`/`504_JSON_SCHEMA.md` for the now-real, multi-instance, PIN-bearing Explorer Profile and per-profile Save Game; add new ADR(s) to `006_DESIGN_DECISION_LOG.md` (superseding ADR-013); add a new `TODO.md` phase entry for this milestone.

## Out of Scope

Cross-device sync or any hosting/backend. Save export/import as a downloadable file (a good future idea, but not requested this round). PIN recovery (none is possible without a backend — losing a PIN means resetting that child's profile; this is stated plainly to the user rather than engineered around). Avatar image upload (fixed emoji set only). Separate parent-account logins or multiple PINs per child. Per-child content/mission restrictions (explicitly confirmed out of scope — every child sees the same campaign content, just their own progress through it).

## Success Criteria

- Two differently-named child profiles on the same device/browser have completely independent saves (mission progress, rewards, Discovery Log, session duration, accessibility settings) that never leak into each other.
- Home always requires an explicit selection before showing any child's content; "Switch Explorer" reliably returns to that selector from anywhere in the learner shell.
- Parent Mode requires picking the correct child's name and that child's specific PIN before showing any of that child's data; a wrong PIN shows an error and allows retry; a correct PIN never shows another child's data.
- PINs are never stored or displayed as plain text anywhere (hashed at rest).
- Migration path does not silently destroy pre-existing single-profile save data.

## Manual Verification (planned)

Create two child profiles with different PINs; play a mission's reflection as each; confirm rewards/Discovery Log/settings never cross between them. Confirm Home's selector always appears on a fresh visit and after "Switch Explorer." Confirm Parent Mode rejects a wrong PIN and a PIN belonging to a different child, and only shows the correct child's dashboard on success. Confirm changing accessibility/duration settings under one child never affects the other. Confirm the migration path against a save created before this milestone.

## Deliverables

Updated `storage.js`, new profile-management module, updated `settings.js`/`router.js`/`parent-mode.js`, updated CSS for accessibility states, updated `503_DATA_MODEL.md`/`504_JSON_SCHEMA.md`/`006_DESIGN_DECISION_LOG.md`, a new `TODO.md` phase entry, and manual verification notes.

## Completion Notes

Not started — awaiting explicit user approval to begin implementation.

---

# Previous Milestone — Pre-Phase-10 audit: close Session Duration and Knowledge Core/Rank gaps — COMPLETE

## Completion Summary

Ran a full audit of all ten priority foundation documents (plus 502, 505 and the Changelog) against the actual codebase, at the user's request before starting Phase 10. Found 8 issues, presented them prioritized, and the user chose to fix the two functional gaps now (deferring the rest):

- **Session Duration had no working control.** ADR-009, 002_PROJECT_CONTEXT, 301_PLATFORM_ARCHITECTURE and 601_HTML_ARCHITECTURE all describe parents choosing a 30/45/60/90-minute session that the Scheduler adapts to — but `settings.js` was a one-line empty placeholder, the `/settings` route fell through to the generic placeholder, and `router.js` called `scheduleActivities()` with a hardcoded `DEFAULT_DURATION_MINUTES` (60). Fixed: `storage.js` gained a generic `settings` field (closing another gap its own header comment had flagged) with `saveSettings()`/`loadSettings()`; `settings.js` is now a real Settings Manager (`getSessionDuration()`/`setSessionDuration()`, validated against the schema's 4 supported durations); `router.js`'s `/settings` route now renders a real form (radio buttons, persisted on submit), and both the Campaign Overview's "Session Duration" display and the actual `scheduleActivities()` call now read the stored preference instead of the hardcoded constant.
- **Knowledge Core and Explorer Rank had no backing entities.** 503_DATA_MODEL.md and 504_JSON_SCHEMA.md both define these as entities with their own `id`/`description`/`icon` (Knowledge Core) or `id`/`title`/`requiredKnowledge` (Explorer Rank) — but every mission reward of these types was just an inline `{id, type, value}` string with nothing behind it. Fixed additively (no change to existing `value` semantics, so nothing that already rendered `reward.value` regressed): created `portal/campaigns/campaign01/src/world/knowledge-cores.json` (4 entries: KC-0001–0004, for missions 3/12/13/16) and `ranks.json` (3 entries: RANK-0001–0003, for missions 17/20/21), seeded from Phase 9's already-generated `badges.json` icons/rationale, with `requiredKnowledge` populated as the Knowledge Cores earned by the point each rank is awarded. Added an optional `coreId`/`rankId` field to each of the 7 relevant mission reward objects (surgical single-field insertions, not a full-file reformat — verified minimal diffs). Added `resolveRewardDetails()` to `reward-engine.js` (pure function, catalogs passed in, no fetching inside — keeps the module free of network concerns) and wired it into both `router.js`'s Explorer Profile (now shows an icon and description per resolved reward, a genuine improvement toward 601_HTML_ARCHITECTURE.md's Explorer Badge component spec) and `parent-mode.js`'s Progress Dashboard reward list (description appended when resolved).
- **Documented both fixes in `504_JSON_SCHEMA.md`** with inline "Note (added during the Settings/Progression milestone)" annotations, following the same pattern already established there for prior implementation-discovered gaps (parentGuide, Discovery Log fields, Session Configuration weights) — so a future contributor sees why these fields exist without needing this conversation.
- **Deliberately deferred** (documented to the user, not silently dropped): root `workbook/` vs `portal/.../generated/workbook/` placement clash with 601_HTML_ARCHITECTURE.md's explicit statement; 006_DESIGN_DECISION_LOG.md not reflecting several real decisions made across Phases 7–9 (SVG-placeholder reinterpretation, session-only parent gate, answer-guide-as-checklist); 009_CHANGELOG.md stalled at v0.4.0 despite Phases 1–9 being complete; the workbook PDF's build script existing only in scratchpad rather than the repo's own `scripts/` directory; CLAUDE.md's own doc-path list pointing at `docs/40-campaigns/` instead of the real `docs/50-content/`; Home/Explorer Profile pages still being thin relative to 601's documented responsibilities.

## Manual Verification

- Served the app locally (`python3 -m http.server` from `portal/`) and drove it with headless Chromium (Playwright):
  - Set session duration to 90 minutes via `/settings`, confirmed the save-confirmation message, reloaded the page and confirmed the radio button was still checked, then loaded a mission and confirmed "Session Duration" now reads "90 minutes" (previously always "60 minutes" regardless of any setting).
  - Completed Mission 3's reflection (same browser session) to earn its `knowledgeCore` reward, then loaded `#/profile` and confirmed the reward renders with the resolved icon (`<img>` pointing at the real `REWARD-0003.svg`) and description text, not just the bare `value` string.
  - Loaded Parent Mode in the same browser session (shared `localStorage`/origin) and confirmed the same reward's resolved description appears in the Progress Dashboard's "Earned rewards" list.
  - Confirmed all three test runs produced zero console/page errors.
  - Loaded all 21 missions in sequence and confirmed each renders its correct title with zero page errors, verifying the 7 surgical mission-JSON edits didn't break anything.
- Validated all 21 mission JSON files plus both new catalog files as JSON via `python3 -c "json.load(...)"`.
- Confirmed via `git diff --stat` that the 7 edited mission files show minimal, single-field diffs (3 lines changed each), not full-file reformats.

## Verification

Both functional gaps identified by the audit are closed and verified end-to-end in a real browser session: a parent can now actually select and persist a session duration that changes what the Scheduler assembles, and Knowledge Core/Explorer Rank rewards now resolve to real, described, iconed entities instead of bare strings — with the fix documented inline in `504_JSON_SCHEMA.md` for future contributors. ✅

---

# Previous Milestone — Phase 7: Workbook — COMPLETE

## Completion Summary

Produced all four TODO.md Phase 7 deliverables (Printable PDF, Notebook alternatives, Answer guide, Parent guide), completing every roadmap phase except Phase 10 (Testing).

- **Flagged a philosophy tension before building anything**: TODO.md names "Answer guide" as a deliverable, but no other document defines it, and it's in direct tension with `orientation.json`'s own Assessment Philosophy ("Explorer Academy does not rely on traditional tests... success is measured by growth in investigative thinking"). Almost every activity is genuinely open-ended (observations of whatever's in front of the child, reasoned arguments, personal reflections) — a traditional right-answer key would contradict the campaign's own stated pedagogy. Confirmed by checking `501_CAMPAIGN_01.md`: Mission 5's footprint mystery deliberately never states a specific cause, so even that mission has no fixed "answer" to give.
- **Resolution**: built `generated/workbook/answer-guide.json` as a "what a strong response looks like" checklist guide instead — one entry per mission, expanding the mission's existing `parentGuide.assessment` sentence into 2–3 checkable points, grounded in each mission's actual `completionCriteria` and Core activity outputs (queried directly from the mission JSON, not recalled from memory). The 3 household-experiment missions (7, 10, 15) additionally quote their already-documented, real physical outcomes from `generated/resources/experiments.json` — genuine science facts, not invented campaign narrative, so safe to state outright. Missions 5, 17 and 20 explicitly note they have no fixed outcome by design.
- **Compiled Printable PDF**: wrote a script (not checked in — see `workbook.json`'s own note on why) that assembles a single Markdown document from already-existing sources — `campaign.json`, `orientation.json`, `curriculum-mapping.json`, all 21 `generated/workbook/pages/*.md` notebook pages (with their heading levels demoted to nest correctly), all 4 existing printables (embedded in full, not just referenced), and the new `answer-guide.json` — then rendered it to PDF via headless Chromium's print-to-PDF (`page.pdf()`), since no pandoc/weasyprint/reportlab was available; `markdown` was pip-installed to do the Markdown→HTML conversion step. Output: `generated/workbook/Campaign-01-Workbook-Compiled.md` (48KB, the source) and `generated/workbook/Campaign-01-Workbook.pdf` (47 pages, 248KB).
- **Notebook alternatives**: already 100% complete from Phase 5 — every mission's notebook page is reproduced in full inside the compiled PDF, not just referenced.
- **Parent guide**: already 100% complete from Phases 4/5/8 — the PDF's front matter reproduces `orientation.json`'s welcome/Mission Control role/session length/materials/Supporting Your Child/Assessment Philosophy and all 6 curriculum mapping entries, giving parents a printable counterpart to Phase 8's on-screen Parent Mode. Progress-dashboard content (learner-specific, stored in `localStorage`) was deliberately excluded from the static PDF — it has no meaning outside a specific device's save data.
- **`workbook.json`** gained an `answerGuide` reference and a `compiledWorkbook` block (source + pdf paths, plus a note on how to regenerate) — same spec-plus-generated-output pattern used throughout Phases 5 and 9.

## Manual Verification

- Validated `answer-guide.json` and the updated `workbook.json` as JSON.
- Verified the compiled Markdown's heading nesting is correct by inspection (mission pages' own `#`/`##`/`###` levels demoted so they nest under each `## Mission N` section without skipping levels).
- Verified the PDF directly (via PyMuPDF, since `pypdf` had a broken `cffi`/`cryptography` dependency in this environment unrelated to this work): 47 pages, correct page count, title page and closing note both present, all 21 "Answer Guide" headings present (`full_text.count("Answer Guide") == 21`), all 4 printables' actual content embedded (water-system diagram arrows, certificate text), Mission 7's real bridge-folding physics fact present, and confirmed learner-specific Progress Dashboard content is correctly absent from this static document.
- Rendered 3 sample pages (title page, a mid-campaign mission page, an Answer Guide section) to PNG and visually inspected them — clean typography, correct heading hierarchy, no overlapping or malformed content.

## Verification

Phase 7 is complete: a genuine, working 47-page printable PDF exists, entirely optional per ADR-005, containing every mission's notebook instructions, every existing printable in full, a philosophy-consistent answer guide, and the full parent guide content — assembled from already-existing sources with no content invented or duplicated. ✅

---

# Previous Milestone — Phase 8: Parent Mode — COMPLETE

## Completion Summary

Implemented `portal/js/parent-mode.js`, replacing the empty placeholder (`// No logic yet`), covering all five TODO.md Phase 8 features (Curriculum mapping, Progress dashboard, Assessment evidence, Suggested interventions, Extension ideas) plus 601_HTML_ARCHITECTURE.md's Parent Mode Responsibilities list (campaign overview, curriculum mapping, mission preparation, required materials, completed learning outcomes).

- **Architecture already decided, just filled in**: `router.js`'s own header comment already stated Parent Mode is "a separate static entry point (`portal/parent/index.html`), kept invisible to the learner shell per ADR-006" — not a hash route. `portal/parent/index.html` already existed as a scaffold. Implemented against that existing decision rather than inventing a new one.
- **"Verify parent access"** (601's Parent Mode Manager responsibility) is implemented as a one-time, session-only confirmation click, not a PIN — no PIN/access-code field exists anywhere in 504_JSON_SCHEMA.md's Save Game shape, and adding one would be a storage-schema change beyond this milestone. Being a separate, unlinked page (never referenced from `router.js` or `portal/index.html`'s nav) is the actual access control; documented this choice explicitly in the module's own header comment so it isn't mistaken for a real security gate later.
- **Data sources, all already existing from Phases 4/5** — no new content authored, only wired up: `campaign.json`, `src/parent/orientation.json`, `src/parent/curriculum-mapping.json`, each mission's embedded `parentGuide`, each mission's `generated/parent/enrichment/missionNN.json`, and the mission's own embedded Extension activity.
- **Assessment evidence** (the most valuable feature, only possible because Discovery Log already stores `missionId`/`learnerNotes`/`timestamp`): each mission's card pairs its `parentGuide.assessment` guidance directly with the Explorer's own recorded Discovery Log entries for that mission — real evidence, not just a rubric.
- **Progress dashboard**: derived entirely from the existing save shape via `reward-engine.js`/`discovery-log.js`'s own public functions (`getEarnedRewards`/`getDiscoveryLog`) — the same modules `router.js` already goes through — rather than reading `storage.js` directly or adding a new `completedMissions` field. "Missions with recorded progress" is the union of missions with an earned reward and missions with at least one Discovery Log entry.
- **Suggested interventions** = enrichment's `expectedMisconceptions`; **Extension ideas** = enrichment's `stretchQuestions` plus the mission's own embedded Extension activity — both degrade gracefully to nothing shown if a mission's enrichment file is missing, since `generated/` content is disposable by design.
- **Added `portal/js/utils.js`'s first real content** (`fetchJson()`): factors out the fetch-then-parse pattern for the several campaign-namespaced files with no dedicated loader module (orientation, curriculum mapping, per-mission enrichment) — `campaign-loader.js`/`mission-engine.js` keep their own existing inline copies rather than being refactored mid-milestone.
- **One real bug found and fixed**: `portal/parent/index.html` sits one directory deeper than `portal/index.html`, so `campaign-loader.js`/`mission-engine.js`'s relative fetch paths (which assume being called from `portal/` root) resolved to `portal/parent/campaigns/...` and 404'd. Fixed with a single `<base href="../">` tag (and updated the two existing asset hrefs from `../css/...`/`../js/...` to `css/...`/`js/...` accordingly) rather than modifying the shared loader modules — scheme-agnostic, so it works under `file://` too.

## Manual Verification

- Served the app locally and drove it with headless Chromium: loaded `portal/parent/index.html`, clicked through the access gate, confirmed all sections render (campaign overview, welcome/Mission Control, session length & materials, curriculum mapping, progress dashboard, 21 mission `<details>` blocks) with real content, not placeholders.
- Confirmed the full learner-to-parent loop: completed Mission 1's reflection in the learner shell, then confirmed in Parent Mode (same browser context, same origin, same `localStorage`) that the exact recorded reflection text appears under Mission 1's "Assessment evidence," and the newly earned "Explorer Recruit" badge appears in the Progress Dashboard.
- Confirmed via `git diff --stat` that `router.js` and `portal/index.html` (the learner shell) are completely untouched — no navigation link was added anywhere the learner could reach Parent Mode from.
- No console errors beyond the pre-existing, unrelated missing favicon.

## Verification

Phase 8 is complete: Parent Mode is a real, working feature — reachable only by direct URL, never by the learner shell — that surfaces curriculum mapping, campaign-wide orientation content, a live progress dashboard, and mission-by-mission preparation/assessment/intervention/extension guidance, with assessment evidence genuinely backed by the Explorer's own recorded Discovery Log entries. ✅

---

# Previous Milestone — Phase 9: Visual Assets — COMPLETE

## Completion Summary

Generated visual assets for all 24 `images.json` specs plus 10 reward icons, closing out Phase 9. Before starting, flagged a real capability gap to the user: no image-generation tool is available in this environment, so the 19 specs written as "warm, painterly illustration" could not be produced as genuine illustrations. Asked the user how to proceed via `AskUserQuestion`; they chose the recommended option — simplified flat-vector SVG for everything, in one consistent visual language, rather than skipping the scene specs or attempting a mismatched fidelity level.

- **Style system** (`generated/images/STYLE_GUIDE.md`): defined a shared palette (warm/interior gradients for scenes, `#FBF8F2`/`#2C3E50` line-art for diagrams, category-coded rings for badge/rank/knowledgeCore icons), canonical viewBox sizes per `images.json`'s orientation/aspectRatio combinations, and a shape language (geometric silhouettes, never a detailed face — consistent with the World Bible's own choice not to over-specify character appearance, and with Dr. Elara Quinn never being depicted in missions where she's "known only through records").
- **19 scene SVGs** (`generated/images/scenes/`): one per painterly-style spec. Two deliberately mirror each other — IMAGE-0001 (Mission 1 briefing) and IMAGE-0024 (Mission 21 graduation) reuse the same room composition and character positions, matching the callback already written into IMAGE-0024's own spec text.
- **5 diagram SVGs** (`generated/images/diagrams/`): the sketch map, water system schematic, star chart, geological cross-section and investigation board, in plain line-art matching each spec's own "something a learner could realistically produce themselves" requirement.
- **10 badge/rank/knowledgeCore icons** (`generated/images/badges/`): covers the 3 badge, 4 knowledgeCore and 3 rank rewards found across all 21 missions' `rewards[]` arrays (inventoried directly from the mission JSON, not assumed). Deliberately scoped out the 6 `unlock` and 5 `story` reward types — they're access/narrative flags, not collectible visual badges, per 504_JSON_SCHEMA.md's own Reward Type distinctions. The 3 rank icons use an escalating chevron design (1 of 3 → 2 of 3 → 3 of 3, the last with an added laurel), visually reinforcing the reward-arc pattern already noted for Missions 17/20/21.
- **Manifests**: extended `images.json` with a `file` field per entry (via script, preserving existing formatting/content — verified after) and created `generated/image-specifications/badges.json` cataloguing the 10 reward icons with id/value/file/design rationale, following the same spec-plus-generated-output pattern established since the Asset Compiler phase.
- Noted as a genuine, undecided gap (not silently resolved): no compiled "Knowledge Core" catalog exists anywhere in `src/` (only embedded `{id, type, value}` per mission) even though 504_JSON_SCHEMA.md's Knowledge Core entity requires `description` and `icon` fields. Fixing that is a data-model compilation task, not a visual-asset task, so it was left as a flagged observation rather than folded into this milestone.

## Manual Verification

- Validated both `images.json` and the new `badges.json` as JSON via `python3 -c "json.load(...)"`.
- Validated all 34 SVG files as well-formed XML via `xml.etree.ElementTree` — all pass.
- Served the `generated/images/` directory locally and captured headless-Chromium screenshots of a representative sample across all three categories (2 scenes including the Mission 1/21 mirrored pair, 2 diagrams, 2 badge/rank icons) — all rendered legibly and matched their intended composition.

## Verification

Phase 9 now has a real, renderable visual layer for every mission scene, diagram and collectible reward — offline, dependency-free, and internally consistent — while being explicit in `STYLE_GUIDE.md` that this is a placeholder layer to replace wholesale if real illustration ever becomes available, not a permanent design decision. ✅

---

# Previous Milestone — Mission Polish: Mission 21 reaches production quality — PHASE 6 COMPLETE

## Completion Summary

Polished Mission 21 ("Graduation Day"), the campaign finale, editing `portal/campaigns/campaign01/src/missions/mission21.json` directly. This completes Phase 6 for all 21 missions.

- Re-read the "Final Campaign Checkpoint" section of `501_CAMPAIGN_01.md` before editing — it defines what the whole campaign was building toward (Think Like an Explorer / Work Independently / Apply Knowledge Authentically / Be Ready for Future Campaigns) and closes with the project's own stated philosophy: "success is measured not by collecting correct answers, but by developing the curiosity, discipline and resilience to pursue better questions." This directly shaped the beat rewrites.
- The HOOK and BREAKTHROUGH beats now explicitly bookend Mission 1 — the same briefing room, the same Director Orion, the probationary status opened by "a single letter in Mission 1" now formally closing — matching the deliberate visual callback already established in `generated/image-specifications/images.json`'s IMAGE-0024 (composed to echo IMAGE-0001).
- The DISCOVERY beat (the Academy celebrating *how* the learner investigated, not *what* they found) is the campaign's thesis statement and got the most careful rewrite in this milestone.
- The reflection prompt now explicitly invites comparing who the learner has become against "who you were when you opened that first invitation in Mission 1" — the same full-circle technique used for Mission 20, giving the campaign's two closing missions a matching sense of arc.
- `ACTIVITY-0132` ("Receive Explorer Status") was worded to keep the optional printable certificate genuinely optional ("in your journal, or using the optional printable certificate, whichever feels right"), consistent with `generated/workbook/pages/mission21.md`'s own framing and the notebook-first philosophy established back in Phase 5.
- Extension (`ACTIVITY-0133`) and Rabbit Hole (`ACTIVITY-0134`) left unchanged — already open-ended and fitting.
- Left unchanged: all IDs, `rewards`, `completionCriteria`, `parentGuide` core fields.

## Manual Verification

- Validated the file against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — passes.
- Grepped `generated/` for the superseded reflection-prompt text — no stale references found.
- Served the app locally and drove it with headless Chromium: loaded the mission, confirmed the correct title renders, confirmed updated activity/reflection text appears, and confirmed no `parentGuide` content leaks into the DOM (ADR-006 holds). No console errors.
- **Full-campaign consistency check**, since this is the final mission: re-validated all 21 missions (`mission01.json`–`mission21.json`) against the mission engine's required-field/beat-type/activity-field/reward-field/parentGuide rules in a single pass — all 21 pass cleanly.

## Verification

Phase 6 (Mission Polish) is now complete: all 21 missions satisfy the Mission Quality Checklist bar established with Mission 1, with the campaign's opening and closing missions deliberately mirroring each other in both story JSON and generated image specs. ✅

---

# Previous Milestone — Mission Polish: Missions 13–20 reach production quality — COMPLETE

## Completion Summary

Applied the same approach as Missions 1–12 to Missions 13 ("Hidden Patterns") through 20 ("Explorer Assessment"), editing `portal/campaigns/campaign01/src/missions/mission13–20.json` directly, grounded in each mission's canonical Story Summary in `501_CAMPAIGN_01.md`. This completes every mission except the finale (21).

- **Re-read two more narrative checkpoints** before starting: `501_CAMPAIGN_01.md`'s "Narrative Checkpoint (After Mission 14)" (transition into the campaign's final phase, learners increasingly self-directing) and the "Part 5 — Missions 15–21" design note (the campaign concludes by recognising the learner's development into an Explorer, not just task completion). Both shaped tone throughout this batch.
- **Mission 14**: the BREAKTHROUGH beat carries the campaign's central reveal — the expedition was protecting discoveries, not hiding them — and was rewritten with the most care in this batch, alongside the CHALLENGE beat's fact/inference distinction, echoing the misconception already documented in `generated/parent/enrichment/mission14.json` about inference being a harder line to draw than Mission 4's fact/assumption split.
- **Mission 15**: left `ACTIVITY-0090`'s ("Test and Refine Solutions") storyContext/instructions untouched, matching the same conservative practice as Mission 7's and Mission 10's experiment activities — confirmed first that neither text is quoted verbatim anywhere in `experiments.json`, but chose consistency over the marginal gain of editing it.
- **Mission 16**: added an explicit callback to Mission 9's sample-observation method in `ACTIVITY-0094`'s instructions, reinforcing the recurring "evidence, not appearance" thread.
- **Mission 17**: left `ACTIVITY-0102` ("Plan a Fair Test") and `ACTIVITY-0106` ("Repeat With a Changed Variable") untouched for the same reason as Mission 15 — confirmed via grep that neither is quoted verbatim in `experiments.json`'s "Design Your Own Fair Test" entry, but left them alone regardless.
- **Mission 18**: the biggest synthesis mission in the campaign — all 5 Core activities were polished, with the HOOK and REFLECTION beats explicitly naming the earlier missions (weather, water, power, geology, star charts) now converging into one story.
- **Mission 19**: the expedition mystery's actual resolution — the BREAKTHROUGH beat ("they suspended their own work... not because they vanished or failed") got the richest treatment in this batch, completing the "protect, not hide" arc Mission 14 opened.
- **Mission 20**: the REFLECTION beat and reflection prompt were rewritten to explicitly callback to Mission 1, mirroring Mission 21's own "since Mission 1" framing and giving the assessment mission a genuine full-circle moment ahead of graduation.
- **Extension/Rabbit Hole activities**: reviewed across all eight missions, left unchanged — already appropriately open-ended.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, `parentGuide` core fields, for the same reasons as every prior mission.

## Manual Verification

- Validated all eight files against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — all pass.
- Grepped `generated/` for each mission's superseded reflection-prompt text — no stale references found across all eight.
- Confirmed via grep that Mission 15's `ACTIVITY-0090` and Mission 17's `ACTIVITY-0102`/`ACTIVITY-0106` retain their exact original instructions text, unchanged.
- Served the app locally and drove it with headless Chromium: loaded all eight missions in turn, confirmed each renders its correct title, confirmed updated activity/reflection text appears in the rendered page, and confirmed no `parentGuide` content leaks into the DOM for any of the eight (ADR-006 holds). No console errors.

## Verification

Missions 13–20 now satisfy the same Mission Quality Checklist bar as every prior mission, leaving only Mission 21 ("Graduation Day") to complete full-campaign coverage of Phase 6. ✅

---

# Previous Milestone — Mission Polish: Missions 9–12 reach production quality — COMPLETE

## Completion Summary

Applied the same approach as Missions 1–8 to Missions 9 ("Mystery Samples"), 10 ("Water Under Pressure"), 11 ("The Energy Problem") and 12 ("Star Maps"), editing `portal/campaigns/campaign01/src/missions/mission09–12.json` directly, grounded in each mission's canonical Story Summary in `501_CAMPAIGN_01.md`. This batch covers all of Chapter 3.

- **Mission 9**: Atlas's "classify by evidence, not appearance" warning (originally a fairly flat MYSTERY beat) was rewritten as a genuine cautionary note the learner is set up to test against, and the reflection prompt now asks whether any sample surprised them by not belonging where it looked like it should.
- **Mission 10**: beats and non-experiment activities (`ACTIVITY-0057` Trace Water Flow, `ACTIVITY-0059` Interpret Diagrams, `ACTIVITY-0060` Recommend Repairs) were rewritten for stronger flow. **Deliberately left `ACTIVITY-0058`'s ("Conduct Simple Experiments") storyContext/instructions untouched** and verified byte-for-byte against `generated/resources/experiments.json`'s "Finding the Blockage" entry, which quotes this activity's exact original text — editing it would have silently invalidated that already-published experiment.
- **Mission 11**: the Cliffhanger was strengthened to explicitly echo Mission 8's "deliberately shut down" language (now "deliberately conserving power"), reinforcing the campaign's slow-building pattern of the expedition making intentional, unexplained choices rather than simply running into problems.
- **Mission 12**: beats and activities were rewritten while keeping `ACTIVITY-0071` ("Measure Angles") consistent with the already-published star-chart image spec (`IMAGE-0014`) and printable (`generated/workbook/printables/mission12-star-chart.md`) — the instructions now explicitly reference "using the star chart" rather than contradicting its existence.
- **Extension/Rabbit Hole activities**: reviewed across all four missions, left unchanged — already appropriately open-ended.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, `parentGuide` core fields, for the same reasons as every prior mission.

## Manual Verification

- Validated all four files against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — all pass.
- Grepped `generated/` for each mission's superseded reflection-prompt text — no stale references found.
- Confirmed Mission 10's `ACTIVITY-0058` storyContext/instructions match `generated/resources/experiments.json`'s Mission 10 entry exactly (`grep` on both exact strings).
- Served the app locally and drove it with headless Chromium: loaded all four missions in turn, confirmed each renders its correct title, confirmed updated activity/reflection text appears in the rendered page, and confirmed no `parentGuide` content leaks into the DOM for any of the four (ADR-006 holds). No console errors.

## Verification

Missions 9–12 now satisfy the same Mission Quality Checklist bar as Missions 1–8, completing all of Chapter 3 at production quality, with both already-published generated assets (Mission 10's experiment, Mission 12's star chart) confirmed still consistent with the polished source content. ✅

---

# Previous Milestone — Mission Polish: Missions 5–8 reach production quality — COMPLETE

## Completion Summary

Applied the same approach as Missions 1–4 to Missions 5 ("Strange Footprints"), 6 ("Weather Watch"), 7 ("The Broken Bridge") and 8 ("Message in the Static"), editing `portal/campaigns/campaign01/src/missions/mission05–08.json` directly, grounded in each mission's canonical Story Summary re-read from `501_CAMPAIGN_01.md` (including the "Narrative Checkpoint (After Mission 7)" section, which shaped how Mission 7's Cliffhanger was treated).

- **Mission 5**: this is the campaign's first fully independent "eliminate, don't guess" investigation — beats and Core activities now explicitly frame the task as ruling out explanations one at a time, and the Cliffhanger emphasises this being the learner's first *complete* investigation, start to finish.
- **Mission 6**: the weakest MYSTERY beat of the batch going in (fairly expository) was rewritten to pose a genuine question — why did the expedition track weather carefully enough to leave an archive worth comparing against — and the Breakthrough/reflection now explicitly tie today's ordinary weather reading to the expedition's own past decisions.
- **Mission 7**: identified as a structural checkpoint — `501_CAMPAIGN_01.md`'s own "Narrative Checkpoint (After Mission 7)" note says the learner should feel established as an Explorer and ready to move into more open-ended enquiry by Mission 8. The Cliffhanger was rewritten to carry that weight ("the learner has built something that stood between them and the answer — and won"), while the DISCOVERY beat (Atlas's iterative-design lesson) was reframed as reassurance rather than exposition, matching 402's "build confidence / feel achievable" design principles. Deliberately left `ACTIVITY-0041`'s ("Test and Refine") storyContext/instructions and the reflection prompt untouched, since both already read strongly and match the already-published `generated/resources/experiments.json` Bridge Load Test entry — editing them risked contradicting content already treated as final.
- **Mission 8**: the mission where Dr. Elara Quinn moves from "a name in old logs" (Mission 4) to an actual recorded voice — beats and activities were rewritten to make that escalation explicit ("a name from the logs, now an actual voice"), without inventing any plot detail beyond what 501 and the World Bible already establish.
- **Extension/Rabbit Hole activities**: reviewed across all four missions, left unchanged — already appropriately open-ended.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, `parentGuide` core fields, for the same reasons as every prior mission (no unrendered optional fields added; no duplication of `generated/parent/enrichment/` content).

## Manual Verification

- Validated all four files against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — all pass.
- Grepped `generated/` for each mission's superseded reflection-prompt text — no stale references found (Mission 7's prompt was intentionally left unchanged, confirmed still present verbatim).
- Confirmed Mission 7's `ACTIVITY-0041` storyContext still reads "The first prototype rarely works perfectly the first time," matching `generated/resources/experiments.json`'s Bridge Load Test entry exactly.
- Served the app locally and drove it with headless Chromium: loaded all four missions in turn, confirmed each renders its correct title, confirmed updated activity/reflection text appears in the rendered page (one initial check against beat-only text correctly returned false, re-confirming beats still aren't rendered — not a regression), and confirmed no `parentGuide` content leaks into the DOM for any of the four (ADR-006 holds). No console errors.

## Verification

Missions 5–8 now satisfy the same Mission Quality Checklist bar as Missions 1–4, completing the first eight missions (through the end of Part 3 / the Mission 7 narrative checkpoint) at production quality. ✅

---

# Previous Milestone — Mission Polish: Missions 2–4 reach production quality — COMPLETE

## Completion Summary

Applied the same approach established for Mission 1 to Missions 2 ("Arrival at Outpost Echo"), 3 ("Explorer's Toolkit") and 4 ("The Silent Logs"), editing `portal/campaigns/campaign01/src/missions/mission02–04.json` directly:

- **Beats**: rewrote all 8 `narrativeText` values per mission for stronger story flow and curiosity, grounded in each mission's canonical Story Summary in `501_CAMPAIGN_01.md` (re-read before editing) — no new plot facts invented. Mission 4 got the most careful treatment, since its Breakthrough beat is the first appearance of Dr. Elara Quinn's name — the narrative hinge the rest of the campaign builds on.
- **Core activities**: rewrote `storyContext`/`instructions` for every Core activity in all three missions to read as vivid, second-person challenges rather than dry instructions (e.g. Mission 3's estimate-then-measure activity now explicitly instructs writing the estimate down *before* measuring, matching the exact misconception already flagged in `generated/parent/enrichment/mission03.json` — "children sometimes measure first and then quietly adjust their estimate").
- **Extension/Rabbit Hole activities**: reviewed but left unchanged in all three missions — already open-ended and evocative by design (their whole job is unprompted curiosity), so rewriting them for the sake of symmetry with Core activities would have been padding, not polish.
- **Reflection prompts**: lightly sharpened for stronger metacognition (e.g. Mission 4's now explicitly asks for an assumption "even if it feels likely," again matching that mission's own flagged misconception) — kept to one prompt per mission, preserving the one-prompt convention already established campaign-wide.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, and `parentGuide` core fields, for the same reasons as Mission 1 (no unrendered optional fields added; no duplication of the already-separate `generated/parent/enrichment/` content).

## Manual Verification

- Validated all three files against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field/parentGuide checks via script — all pass.
- Grepped `generated/` for each mission's superseded reflection-prompt text — no stale references found in any of the three.
- Served the app locally and drove it with headless Chromium: loaded `#/mission/mission02`, `mission03` and `mission04` in turn, confirmed each renders its correct title and updated content (waited on the actual heading text rather than element presence, after an initial test run surfaced a race condition in the *test script* itself, not the app), and confirmed `parentGuide` content never appears in the rendered DOM for any of the three (ADR-006 holds).

## Verification

Missions 2–4 now satisfy the same Mission Quality Checklist bar as Mission 1, with Mission 4 specifically carrying the extra narrative weight of introducing Dr. Quinn — the campaign's first four missions are now consistently production quality. ✅

---

# Previous Milestone — Mission Polish: Mission 1 ("The Invitation") reaches production quality — COMPLETE

## Completion Summary

Worked through `402_MISSION_TEMPLATE.md`'s Mission Quality Checklist against `portal/campaigns/campaign01/src/missions/mission01.json` directly (this is content-authoring work on the compiled mission JSON itself, distinct from Phase 5's generated-assets-only scope).

**Important finding, checked before editing anything:** read `activity-engine.js` and `router.js` to confirm what the platform actually renders today. Only a mission's title, estimated time, difficulty, activity cards (title/type/category/duration/difficulty/storyContext/instructions/output), and reflection prompts are rendered. The 8 `beats` are validated for structural completeness (`mission-engine.js`) but **never rendered to the learner anywhere in the current UI** — confirmed by grepping all of `portal/js/` for `beats`/`narrativeText` usage outside the validator. `activity-engine.js` also explicitly documents that only required Activity fields are rendered, and that the schema's optional Activity fields (`hints`, `resources`, `parentNotes`) have no renderer at all.

This shaped the scope of the polish:

- **Beats**: rewrote all 8 `narrativeText` values with richer sensory/emotional detail and stronger connective tissue between beats (e.g. the HOOK now specifies the package is addressed to the learner by name and unusually heavy; the MYSTERY beat now poses an explicit unanswered question). Stayed strictly within `501_CAMPAIGN_01.md`'s canonical Story Summary for Mission 1 — no new plot facts, characters or locations invented, only deeper texture on what the source document already establishes. Polished even though currently inert in the UI, since the beat structure is clearly load-bearing in `402_MISSION_TEMPLATE.md`'s design and this is authored content worth having ready.
- **Activities**: rewrote `storyContext`/`instructions` for all 7 activities (4 Core, 2 Extension, 1 Rabbit Hole) to read as a vivid, second-person "exciting challenge" per the Mission Brief guidance, rather than dry instructional prose — e.g. Activity-0004's instructions now explicitly acknowledge that the first couple of observations are easy and the real challenge is pushing past them. Deliberately did **not** add `hints`, `resources`, or `parentNotes` — confirmed unrendered fields, so populating them now would be the same "idle, unusable content" trap avoided throughout Phase 5.
- **Reflection**: polished the single prompt for stronger metacognitive framing (now explicitly asks what makes the learner curious, not just what they expect), keeping to one prompt to stay consistent with the one-prompt-per-mission convention already established across all 21 missions.
- **Left unchanged**: all IDs, `rewards`, `completionCriteria`, `parentGuide`'s core fields (already solid; deliberately did not add the schema's optional `misconceptions`/`extensions`/`printables` fields to `parentGuide` either, since that content already exists as a single source of truth in `generated/parent/enrichment/mission01.json` — adding it to `parentGuide` too would duplicate state, which CLAUDE.md explicitly prohibits), and all structural/functional fields (`type`, `category`, `duration`, `difficulty`, `schedulerCategory`).

## Manual Verification

- Validated `mission01.json` against `mission-engine.js`'s actual required-field/beat-type/activity-field/reward-field checks via a Python script mirroring its logic — all pass, all 8 beat types present.
- Grepped `generated/` for the superseded reflection prompt text — no stale references found; the generated workbook page and parent enrichment file for Mission 1 don't quote mission JSON text verbatim (by design, per the Asset Compiler's own "enrich, never duplicate" rule), so neither needed updating.
- Started the app with `python3 -m http.server` and drove it with headless Chromium (Playwright): loaded `#/mission/mission01`, confirmed the heading renders as "The Invitation," confirmed the new activity instructions and reflection prompt text appear in the rendered page, and confirmed `parentGuide` content (e.g. its `assessment` text) does **not** appear anywhere in the rendered DOM — ADR-006 (Hidden Parent Mode) holds. The one console 404 observed was `favicon.ico`, a pre-existing, unrelated gap, not something this change introduced.

## Verification

Mission 1 now satisfies every item on `402_MISSION_TEMPLATE.md`'s Mission Quality Checklist that the current platform can actually surface to a learner, with no schema changes, no new unrendered fields, and no duplicated parent-guidance content. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 4 (Missions 16–21, final batch) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 16–21, completing Phase 5 across all 21 missions:

- **Notebook instructions** for all 6 missions (`generated/workbook/pages/mission16.md`–`mission21.md`).
- **Fourth experiment — Mission 17, handled as a framework rather than a fixed experiment**: Mission 17 has two `type: "experiment"` activities (`ACTIVITY-0102` Core "Plan a Fair Test", `ACTIVITY-0106` Extension "Repeat With a Changed Variable"), but the mission's own narrative explicitly gives the learner no fixed topic ("no detailed instructions survive... the design is up to the learner"). Rather than inventing a specific topic that would contradict this design intent, the `experiments.json` entry is a general fair-test framework (define question → prediction → identify the one variable → hold everything else constant → collect evidence → analyse → repeat with one change) that the learner applies to their own self-chosen investigation, with a `note` field explaining why this entry differs in shape from the other three.
- **Two further printables**: Mission 21's Explorer Certificate template (`printables/mission21-explorer-certificate.md`) — a ceremonial keepsake genuinely suited to printing, offered as an alternative to designing one in the journal, not the only path. Missions 16–20 were assessed and needed none; Mission 17 and 20 specifically got none because a fixed printable would contradict their deliberately open-ended, learner-defined design.
- **Parent enrichment** (`mission16.json`–`mission21.json`), `curriculumRefs` grounded in actual activity types as in every prior batch.
- **Vocabulary**: embedded for Missions 16 ("strata"), 17 ("fair test"), 19 ("archive"). Missions 18, 20, 21 got none — their own text reuses vocabulary already established in earlier missions rather than introducing new terms.
- **Image specifications** (IMAGE-0018–0024): key-scene spec per mission, plus two further exemplar diagram specs matching the established Mission 2/16 sketch-output pattern — Mission 16's field sketch (per `ASSET_COMPILER.md`'s own Campaign 01 example) and Mission 18's investigation board (its Extension activity's output is explicitly "a visual investigation board"). Mission 17's and Mission 20's specs are deliberately generic/topic-agnostic scenes, since both missions are learner-defined with no fixed subject. Mission 19's spec shows the archive room itself rather than Dr. Quinn, since no physical description of her exists anywhere in the World Bible. Mission 21's spec (IMAGE-0024) is deliberately composed to echo IMAGE-0001 (Mission 1's Director Orion briefing scene), bookending the campaign per Director Orion's own World Bible entry noting he "welcomes the learner at the start of the campaign (Mission 1) and again at Graduation (Mission 21)."

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- **Full-campaign consistency check** (this being the final batch): confirmed `workbook.json` lists exactly `MISSION-0001`–`MISSION-0021` in order; confirmed 21 parent enrichment files exist (one per mission); confirmed all 21 missions have at least one image specification; confirmed `experiments.json` contains exactly Missions 7, 10, 15 and 17 — the complete, correct set of missions with a `type: "experiment"` activity across the whole campaign, verified by scanning every mission's compiled JSON directly rather than relying on `505_RESOURCES.md`'s or `ASSET_COMPILER.md`'s own worked examples (which turned out to be imprecise about Mission 11, correctly excluded back in Batch 3).

## Verification

Phase 5 is complete: every one of the 21 compiled missions now has notebook instructions, parent enrichment, and at least one image specification under `generated/`, with printables and experiments produced only where each mission's own content genuinely justified one — no padding, no orphaned assets, and no `src/` files touched across all four batches. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 3 (Missions 11–15) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 11–15, extending the established pattern:

- **Notebook instructions** (`generated/workbook/pages/mission11.md`–`mission15.md`).
- **Confirmed Mission 11 has no experiment-type activity** despite `505_RESOURCES.md`'s PhET/circuits reference — its "Solve Circuit Challenges" activity is typed `science`, not `experiment` (scanned directly from `mission11.json`, not assumed from the resources document). Correctly produced no experiment for it.
- **Third experiment produced**: Mission 15 (`ACTIVITY-0090`, "Test and Refine Solutions") — a household light/torch analogy ("Signal Path Troubleshooting") testing misalignment, obstruction and distance against a fixed target, since the mission's own multi-fault Signal Tower repair has no single obvious physical prototype the way Missions 7 and 10 did. Grounded in the same "signal needs a clear, aligned path" principle real communication towers rely on.
- **Two further printables**: Mission 12's star chart (`printables/mission12-star-chart.md`, IMAGE-0014) — justified because the Core "Measure Angles" activity needs a precisely plotted chart to measure accurately with a protractor, matching `ASSET_COMPILER.md`'s own Campaign 01 example calling out Mission 12 for a star-chart spec. Missions 11, 13, 14, 15 were assessed and needed none.
- **Parent enrichment** (`generated/parent/enrichment/mission11.json`–`mission15.json`), `curriculumRefs` grounded in each mission's actual activity `type` fields as in prior batches.
- **Vocabulary**: embedded for Missions 11 ("circuit"), 12 ("constellation"), 13 ("trend"), 14 ("inference" — deliberately distinguished from Mission 4's "assumption" as a more advanced, evidence-supported form of the same idea), 15 ("diagnose").
- **Image specifications** (IMAGE-0013–0017): one key-scene spec per mission, including a star-chart reference diagram for Mission 12 (matching `ASSET_COMPILER.md`'s own worked example) and a "Connections Board" scene for Mission 13's more abstract data-pattern Breakthrough beat. Mission 14's spec again avoids depicting Dr. Elara Quinn.

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- Confirmed Mission 15's experiment references an actual `type: "experiment"` activity, and that Mission 11 was correctly excluded after checking its JSON directly rather than assuming from `505_RESOURCES.md`.

## Verification

Batch 3 extends the same pattern to Missions 11–15, and specifically validates that the experiment-scoping rule holds even when a mission's resources document seems to imply an experiment (Mission 11) that its own compiled JSON doesn't actually contain. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 2 (Missions 6–10) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 6–10, extending the Batch 1 pattern:

- **Notebook instructions** (`generated/workbook/pages/mission06.md`–`mission10.md`), written the same way as Batch 1 — concrete notebook steps rather than restated mission JSON `instructions`.
- **First experiments produced** (`generated/resources/experiments.json`, new file): scanned each mission's `activities[]` directly rather than assuming from `505_RESOURCES.md`'s scoping — confirmed Mission 7 (`ACTIVITY-0041`, "Test and Refine") and Mission 10 (`ACTIVITY-0058`, "Conduct Simple Experiments") are the only two of this batch with a `type: "experiment"` activity; Missions 6, 8, 9 correctly got none. Both experiments (a bridge load test, a tube-blockage water-flow test) use only common household items, consistent with the bridge materials (card/straws/tape) and Scottish Water/PhET references already present in `505_RESOURCES.md` for these two missions.
- **One further printable**: Mission 10's water-system diagram (`printables/mission10-water-system-diagram.md`) — justified because the mission's own Core activities ("Trace Water Flow", "Interpret Diagrams") explicitly require following an existing pipework diagram, meeting PHILOSOPHY's "a diagram to trace" bar. Missions 6, 7, 8, 9 were assessed and needed none — reasons recorded per-mission in `workbook.json`.
- **Parent enrichment** (`generated/parent/enrichment/mission06.json`–`mission10.json`): same shape as Batch 1, `curriculumRefs` grounded in each mission's actual activity `type` fields (e.g. Mission 7's `experiment`-typed activity mapped to `CURRICULUM-0004` "Working Scientifically", alongside `CURRICULUM-0005` Engineering & Design).
- **Vocabulary**: embedded in notebook pages for Missions 6 ("meteorologist"), 8 ("transmission"), 9 ("classify"), 10 ("malfunction"). Mission 7 got none — its own text introduces no vocabulary beyond common engineering words already familiar at this level.
- **Image specifications**: one key-scene spec per mission (IMAGE-0007–0011), plus one additional diagram spec for Mission 10 (IMAGE-0012, the station water system schematic) — justified because, unlike the Mission 2 sketch-map pattern (activity *output* is a diagram), Mission 10's Core activities require an *existing* diagram as input to interpret, so the mission cannot function without one. Mission 8's spec deliberately shows the communications console's waveform display rather than Dr. Quinn, for the same reason established in Mission 4's spec — she remains unseen, known only through records, at this point in the story.

## Manual Verification

- Validated all new/modified generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only files under `generated/` were touched; nothing under `src/`.
- Confirmed both experiments reference a mission that actually has a `type: "experiment"` activity, checked directly against each mission's compiled JSON (not assumed from the resources document or prior batches).

## Verification

Batch 2 extends the same notebook-first, minimal-spec, evidence-grounded pattern from Batch 1 to Missions 6–10, and establishes the first working `experiments.json`, validating that the experiment-scoping rule in `ASSET_COMPILER.md` ("scan the compiled mission JSON directly") produces correct, non-hardcoded results. ✅

---

# Previous Milestone — Asset Compiler execution — Batch 1 (Missions 1–5) — COMPLETE

## Completion Summary

Ran `prompts/ASSET_COMPILER.md` against Missions 1–5, producing:

- **Notebook instructions** (`generated/workbook/pages/mission01.md`–`mission05.md`): direct second-person guidance rewriting each mission's Core/Extension/Rabbit Hole activities into concrete notebook steps (e.g. "draw a table with three columns headed Object, Estimate, Actual" rather than restating the mission JSON's `instructions` field verbatim).
- **One printable** (`generated/workbook/printables/mission02-map-symbols-card.md`): a map-symbols reference card for Mission 2's Extension activity — the only mission in this batch judged to meet the PHILOSOPHY bar ("a map that's faster to follow printed than hand-copied"). All other missions in this batch (1, 3, 4, 5) were assessed and found to need no printable — reasons recorded per-mission in `workbook.json`.
- **`generated/workbook/workbook.json`**: index of all 5 missions with `printable: null` + a one-line `printableReason` for the 4 that got none, and the justification for Mission 2's.
- **Vocabulary**: embedded as a "Words worth knowing" section directly in the relevant notebook pages (no dedicated file path exists for vocabulary in `ASSET_COMPILER.md`'s OUTPUT LOCATION tree, so it was kept alongside the content it supports rather than inventing an undefined location) — Mission 1 ("probationary"), Mission 3 ("estimate"), Mission 4 ("chronological", "assumption"), Mission 5 ("eliminate"). Mission 2 got none — its own text introduces no new vocabulary beyond common words.
- **Parent enrichment** (`generated/parent/enrichment/mission01.json`–`mission05.json`): `expectedMisconceptions`, `stretchQuestions`, `estimatedSupervision` per mission — none restating `parentGuide`'s existing `discussionPoints`/`preparation`/`assessment`. Added a `curriculumRefs` field (array of `CURRICULUM-####` IDs) grounded directly in each mission's actual activity `type` fields (e.g. an activity typed `"mathematics"` → `CURRICULUM-0003`), rather than the curriculum document's non-exhaustive "primary emphasis" list, so every reference is independently verifiable against the mission JSON itself.
- **Image specifications** (`generated/image-specifications/images.json`): one key-scene spec per mission (5 total) plus one additional exemplar spec for Mission 2's sketch map, per the pattern `ASSET_COMPILER.md` documents for missions whose Core activity output is a diagram/map. Each names real World Bible characters/locations (Director Orion, Explorer Academy Headquarters, Outpost Echo) where the scene calls for them, and Mission 4's spec explicitly avoids depicting Dr. Elara Quinn (per her World Bible entry: "known only through journals, recordings... during most of the campaign").
- No experiments produced — correctly out of scope, since none of Missions 1–5 have a `type: "experiment"` activity (confirmed by scanning each mission's `activities[]`).

## Manual Verification

- Validated all generated JSON with `python3 -c "json.load(...)"` — all files parse.
- `git status --short` confirmed only new files under `generated/` were created; nothing under `src/` was touched.
- Spot-checked each notebook page and enrichment file against its mission's `parentGuide`/`reflection.prompts`/embedded Extension activity — no restated content found.

## Verification

Batch 1 produces genuinely completable-with-a-blank-notebook content for Missions 1–5, with the one printable clearly framed as optional and justified, and every generated asset traceable to a real mission ID. ✅

---

# Previous Milestone — Make all 5 compiler prompts campaign-agnostic — COMPLETE

## Completion Summary

The user asked directly: "Can all of these prompts work without needing any changes — for a future campaign?" Audited all five (`CAMPAIGN_COMPILER.md`, `MISSION_COMPILER.md`, `WORLD_BIBLE_COMPILER.md`, `MISSION_RESOURCE_CURATOR.md`, `ASSET_COMPILER.md`) and found the answer was no, for two different reasons:

- **Bucket 1 (harmless, expected)**: `501_CAMPAIGN_01.md`, `campaign01`, and mission counts appeared as inline prose throughout — fine in principle (every campaign needs *something* pointing at its own source), but risky as unmarked prose since a future run could miss a swap point.
- **Bucket 2 (the real problem)**: several prompts had Campaign 01's *specific answers* written as if they were general rules — `WORLD_BIBLE_COMPILER.md` named Orion/Atlas/Quinn directly in the Characters instructions and hardcoded "six subjects" in Curriculum Mapping; `ASSET_COMPILER.md` hardcoded "Missions 7, 10, 11, 17" for experiments and specific mission numbers for image examples. Re-running these against a different campaign's content would have produced wrong output, not just needed a find-and-replace.

Fixed by, in every file:

- Adding an explicit **Campaign Parameters** block at the top (`<source-document>`, `<campaign-slug>`, `<mission-count>`, `<resources-document>` where relevant) with a labelled Campaign 01 worked example beneath it, so swap points are obvious rather than buried in prose.
- Rewriting Bucket-2 passages to state the **underlying computable rule** instead of Campaign 01's specific answer — e.g. `ASSET_COMPILER.md`'s Experiments section now says "determine which missions have a `type: "experiment"` activity by scanning the compiled mission JSON directly," with the actual Campaign 01 numbers (7, 10, 11, 17) moved into a clearly labelled "Campaign 01 example" callout instead of being the rule itself.
- Leaving every genuinely reusable piece untouched: the 504-over-503 schema-authority decision, embed-vs-reference conventions, ID numbering, duration tuning, the Activity Type enum constraint, the notebook-first PHILOSOPHY section (which needed zero changes — it was already fully generic), enrich-not-duplicate rules, and "verify resources are real."

## Manual Verification

Grepped all five files for `campaign01`, `501_CAMPAIGN_01`, and the specific Campaign 01 mission-number lists — confirmed every remaining occurrence now sits inside a labelled `<campaign-slug>`/`<source-document>` parameter placeholder or an explicit "Campaign 01 example:" callout, not unmarked instructional prose.

## Verification

Prompts can now be pointed at a new campaign's own source document and mission count without inheriting Campaign 01's specific character names, curriculum subject breakdown, or mission numbers as if they were universal rules. ✅

---

# Previous Milestone — Draft the Workbook Compiler prompt — COMPLETE

## Completion Summary

Revised `prompts/ASSET_COMPILER.md` in place (chose this over forking a new `WORKBOOK_COMPILER.md`, since the original already covers workbook + parent + resources + image-specs in one prompt, and maintaining two overlapping compiler prompts seemed worse than revising one) to encode:

- **Notebook-first philosophy**: a new PHILOSOPHY section stating a blank notebook is the primary format; printables are the exception, justified only when a notebook genuinely can't do the job (a diagram to trace, a reference/extension card), and even then framed as optional.
- **Minimalism**: generate only what each mission's content actually calls for, not the full category list for every mission uniformly — thin honest coverage over padded uniform coverage.
- **Enrich, never duplicate**: explicit per-category instructions tying back to what's already embedded in each mission (`parentGuide`, `reflection.prompts`, the one Extension activity) — parent content adds only genuinely new fields (misconceptions, stretch questions, supervision estimate); Discovery Log prompt generation is explicitly held back (the platform only captures `entryType: "reflection"` today, so generating unused prompt types would be idle content); reading/resource recommendations point to the already-completed `505_RESOURCES.md` pass instead of regenerating.
- **World Bible grounding**: instructs using real named characters/locations from the now-populated `src/world/` instead of generic descriptions.
- **Experiments scoped to Missions 7, 10, 11, 17 only**, matching `505_RESOURCES.md`'s own scoping, instead of all 21.
- Fixed the same stale `docs/40-campaigns/503|504` path issue found in `CLAUDE.md` at the very start of this session (correct path is `docs/50-content/`).
- Output structure simplified to match: `generated/workbook/pages/` (Markdown notebook instructions, primary) + `printables/` (rare, justified only); `generated/parent/enrichment/`; `generated/image-specifications/images.json` (one flat list, not four separate category files).

## Manual Verification

N/A — this milestone produced a prompt document, not runtime-verifiable content.

## Verification

A prompt that this session (or a later one) can execute without re-deriving the notebook-first philosophy or overlap-handling decisions from scratch. ✅
