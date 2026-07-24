# CURRENT_TASK

## Phase

Awaiting direction.

## Milestone

None currently active. Per CLAUDE.md's Milestone Lifecycle, do not begin new work until the user gives explicit direction. Every phase on the original roadmap (1 through 12) is now complete.

## Completion Notes

The previous milestone (Phase 12: Campaign Release) is complete — see "Previous Milestone" below.

---

# Previous Milestone — Phase 12: Campaign Release — COMPLETE

## Objective

TODO.md's Phase 12 checklist (Campaign complete / Workbook complete / Parent Mode complete / Assets complete / Documentation updated) had no supporting definition anywhere in `docs/` of what "complete" or "release" actually means for each item — the first genuinely undefined roadmap phase in the whole project. Given Phases 3-9 had already individually claimed completion for exactly these same areas, and this session's own established pattern is to verify claims rather than assume them, Phase 12 was treated as a genuine release-readiness audit — actually check each item against the real repository state, fix any real gaps found, and only then mark it done — not a request to author new content.

## Inputs

- TODO.md's Phase 12 checklist (the only definition of scope that existed).
- Every prior phase's own "COMPLETE" claim (Phase 3 Campaign Compiler, Phase 4 Mission Compiler, Phase 5 Asset Compiler, Phase 6 Mission Polish, Phase 7 Workbook, Phase 8 Parent Mode, Phase 9 Visual Assets) — each re-verified here rather than taken on faith.
- `tests/run_all.py` — reused for the functional/regression slice.

## Completion Summary

- **Campaign complete**: all 57 campaign JSON files parse as valid JSON; a dedicated script confirmed all 21 missions have complete required content (`missionNumber`/`title`/`activities`/`parentGuide`, every activity's `title`/`instructions`/`type`/`category`, every `parentGuide`'s four required fields, at least one reflection prompt) — nothing empty or missing. A repo-wide grep for `TODO`/`TBD`/`PLACEHOLDER`/`lorem ipsum`/`FIXME`/`XXX` across campaign content found exactly one hit, and it was `STYLE_GUIDE.md`'s own intentional, already-documented note that the SVG art is a disposable placeholder layer — not an actual content gap.
- **Workbook complete**: `Campaign-01-Workbook.pdf` confirmed present and still 47 pages (matching Phase 7's original claim); all 21 workbook notebook pages present.
- **Parent Mode complete**: all 21 mission enrichment files present; the full functional flow (picker → PIN gate → dashboard → Field Journal → Change PIN) is covered by `tests/test_parent_mode.py` and passes.
- **Assets complete**: all 24 `images.json` entries and all 10 `badges.json` entries verified to reference a real file that exists on disk — zero missing assets.
- **Documentation updated** — found and fixed a real, non-trivial gap: `portal/sw.js`'s hand-maintained `SHELL_FILES` precache list was never updated when the Field Journal milestone added `css/print.css` — it was still being served correctly online (the fetch handler's opportunistic runtime caching covers anything not in the precache list once fetched at least once), but wasn't *guaranteed* precached on first load the way every other shell file is. Fixed by adding it to `SHELL_FILES` and bumping `CACHE_VERSION` to `v2` (per ADR-027's own stated maintenance requirement). Also refreshed `README.md`'s Current Project Status (was still describing Testing as "the only phase remaining," missing offline caching/Save Export/Import/touch-target CSS/the test suite/the Field Journal entirely), Repository Structure (missing `tests/`), and Roadmap (Stage 6 "Beta Testing" still shown unchecked despite Phase 11 being complete, and Phase 12/Campaign Release had no Roadmap stage of its own at all).

## Out of Scope

Authoring a second campaign — Phase 12 was about campaign01's own release readiness, not proving multi-campaign scalability (a separate, larger undertaking). Any new feature work — this phase audited and closed out what already existed.

## Success Criteria

Every Phase 12 checklist item genuinely verified true against the real repository state, any real gaps found and fixed, zero regressions. — **Met**, verified below.

## Manual Verification

- All 57 campaign JSON files parsed successfully; all 21 missions confirmed to have complete required content via a dedicated field-by-field check, not a spot check.
- Repo-wide placeholder-marker grep across campaign `src/`/`generated/` returned exactly one hit, confirmed to be an intentional, already-documented note, not a real gap.
- Workbook PDF page count (47) and all 21 workbook/enrichment files confirmed present.
- All 34 asset-manifest entries (`images.json` + `badges.json`) confirmed to reference files that exist on disk.
- The offline manifest (`offline-manifest.json`, 124 files) was regenerated fresh via `scripts/generate_offline_manifest.py` and diffed byte-for-byte identical against the committed version — confirmed still current, not stale.
- **The `print.css` precache gap was verified as a real, functional bug, not just a static list-comparison finding**: before the fix, `print.css` was reachable only via runtime opportunistic caching; after the fix, a fresh online load followed by going fully offline and reloading Parent Mode showed `print.css` correctly applied (`document.styleSheets` confirmed it loaded), with the service worker's cache now holding 145 entries (was 144) including `css/print.css` explicitly confirmed present by URL.
- **Full regression pass**: `python3 tests/run_all.py` — all 8 test files pass after the `sw.js` fix, confirming the `CACHE_VERSION` bump didn't break anything.

## Deliverables

Fixed `portal/sw.js` (`SHELL_FILES` + `CACHE_VERSION`), refreshed `README.md` (Current Project Status, Repository Structure, Roadmap, Future Possibilities intro), updated `TODO.md`'s Phase 12 checklist with evidenced findings.

## Completion Notes

**Complete.** Every Phase 12 checklist item was genuinely verified against the real repository state rather than assumed from earlier phases' own completion claims — exactly the audit discipline this whole session has applied consistently. One real, functionally-verified gap (the offline-cache precache list missing a file added by a later milestone) was found and fixed, plus several stale README claims were corrected. Every phase on the original roadmap (1 through 12) is now complete. ✅

---

# Previous Milestone — Explorer's Field Journal — COMPLETE

## Objective

README's Future Possibilities framed this as "the workbook PDF pipeline, pointed at a child's own Discovery Log instead." That literal framing needed one real correction: `scripts/build_workbook.py` is a developer/build-time script run against files already in the repo — it has no access to a specific child's actual save data, which only exists in `localStorage` on that child's own device. Reusing it as written would mean asking a parent to run a Python script locally, a real usability regression. Resolved instead with a dedicated in-browser print view inside Parent Mode (which already reads a specific child's data via Milestone 11's `childId`-scoped getters), letting the parent use their own browser's native Print/Save-as-PDF — same end result, zero new dependencies, works fully offline.

## Inputs

- README.md's "The Explorer's Field Journal" entry (Future Possibilities / True Differentiators).
- `portal/js/parent-mode.js` — already had everything the Journal needed: `getDiscoveryLog(childId)`, `getEarnedRewards(childId)`, `resolveRewardDetails(reward, catalogs)`, mission data, the profile object, and the existing full-swap render pattern already used by the picker/gate/dashboard views.

## Completion Summary

- **`portal/js/parent-mode.js`** — new `renderFieldJournal()`: a cover (Explorer name, campaign title, "Explorer since" date, compiled-on date), one `<article>` per mission with at least one Discovery Log entry (mission title, each reflection's prompt + the child's own recorded answer + date, any rewards earned that mission resolved via `resolveRewardDetails()`), and a closing "Journey So Far" tally (missions with progress, total entries, streak). Missions with zero entries are omitted entirely. A new "View Field Journal" button on the dashboard opens it; "Print / Save as PDF" (`window.print()`) and "Back to Dashboard" sit at the top.
- **New `portal/css/print.css`**, linked only from `portal/parent/index.html` — every rule scoped inside `@media print`, so it has zero effect on any on-screen view. Hides the page's static "Parent Mode" header and the Journal's own action buttons from the printed output, and adds page-break-friendly section rules.
- **ADR-029** added, recording the browser-print-vs-build-script decision and why the literal README framing didn't survive contact with where the data actually lives.
- **`tests/test_parent_mode.py`** extended with Field Journal coverage: cover shows the right name, mission with a reflection appears with its exact recorded text, a mission with no reflection is correctly omitted, cross-child isolation holds inside the Journal too, the closing tally renders, `print.css` is actually linked, and Back returns to the full dashboard.
- **README.md accuracy fixes** made while in the area: the Field Journal entry now says shipped and points at ADR-029 instead of the (incorrect) build-script framing; Save Export/Import's entry — never updated when that milestone actually completed — now says shipped too; the "fuller design system" note, which still described `layout.css`/`components.css` as empty placeholders after the touch-target CSS milestone had already given them real content, is corrected.

## Out of Scope

Any client-side PDF-generation library (jsPDF etc.) — the browser's own Print/Save-as-PDF already does this with zero new dependencies. A learner-facing version of the Journal — this is parent-initiated print output, consistent with Parent Mode already being where curriculum/progress content lives (ADR-006). Selecting which reflections to include or any curation UI — the Journal is a straight, unfiltered compilation of what the child actually recorded.

## Success Criteria

From Parent Mode's dashboard for a real Explorer, "View Field Journal" produces a complete, correctly-populated keepsake that prints cleanly via the browser's own Print dialog, with no unrelated Parent Mode chrome appearing in the printed output. — **Met**, verified below.

## Manual Verification

All verified via headless Chromium against the real running app:

- Created an Explorer, completed reflections for two specific missions only, opened the Field Journal from Parent Mode: only those two missions appeared, each with its exact recorded reflection text and date; a third, untouched mission was correctly absent.
- A mission earning a reward (mission03's Knowledge Core) showed it in the Journal, resolved to its real title and description via the same `resolveRewardDetails()` Parent Mode's own Progress Dashboard already uses — confirmed visually via a full-page screenshot, not just a text-presence check.
- The closing "Journey So Far" tally rendered with the correct counts.
- Cross-child isolation holds inside the Journal: a second Explorer's name never appeared in the first Explorer's Journal.
- Back to Dashboard correctly returned to the full dashboard (`Progress Dashboard` heading present again).
- `print.css` confirmed linked from Parent Mode's `<head>` via `page.evaluate` (a headless browser can't drive the OS print dialog itself, so this is a structural check, not a rendered-PDF check).
- Zero JS console/page errors across every check.
- **Full regression pass**: `python3 tests/run_all.py` — all 8 test files pass, including the newly extended `test_parent_mode.py`. This is the first real feature built since the smoke-test suite existed, and it caught nothing wrong — a genuine, if unglamorous, proof that the suite is now doing its job.

## Deliverables

Updated `portal/js/parent-mode.js`, new `portal/css/print.css`, updated `portal/parent/index.html`, new ADR-029, README.md accuracy fixes (3 entries), extended `tests/test_parent_mode.py`, updated `TODO.md`.

## Completion Notes

**Complete.** Parents can now produce a genuinely personal, unfiltered keepsake from their child's own recorded observations and reflections — Explorer Academy's own differentiator thesis (curiosity and the child's own thinking matter more than templated content) made into a printable artefact, entirely in-browser, offline-compatible, with no new dependencies. ✅

---

# Previous Milestone — Automated Smoke-Test Suite — COMPLETE

## Objective

Every regression check performed across this entire session (Milestone 11, Phase 11 testing, offline caching, Save Export/Import, the touch-target CSS fix) was a throwaway script, re-derived from scratch each time. Nothing regression-tested the platform between sessions, so a future change could silently break an old flow until someone happened to re-test it by hand — this session itself hit a false-positive test bug purely by chance of re-running a check. A small, checked-in, dependency-light suite closes that gap before Phase 12 content changes start landing. The user identified this as the highest-value next step when asked for a genuinely-different-making recommendation, ahead of (and independent from) the Explorer's Field Journal feature.

## Inputs

- Every ad-hoc Playwright script written this session (Phase 11 testing, offline caching, Save Export/Import, touch-target CSS) — reused as the basis for each persisted test file.
- `scripts/build_workbook.py`/`generate_offline_manifest.py` — the established pattern for checked-in, reusable Python tooling (plain scripts, not a new framework), followed here rather than introducing pytest (not installed in this environment, and not otherwise used anywhere in the repo).

## Completion Summary

- **New `tests/helpers.py`** — `local_server()` context manager spins up `python3 -m http.server` against `portal/` on a free port per test file and tears it down afterward, so nothing needs to already be running; `launch_browser()` points at this environment's pre-installed Chromium (`/opt/pw-browsers/chromium`, overridable via `EXPLORER_ACADEMY_CHROMIUM`); `report()` prints a PASS/FAIL line and returns the condition for easy `ok = report(...) and ok` accumulation.
- **8 new `test_*.py` files**, one per golden path, ported from this session's own proven ad-hoc scripts: `test_broken_links.py` (all 5 static routes + 21 missions + Parent Mode, zero console/page errors), `test_explorer_profiles.py` (multi-child creation/switching/save isolation), `test_missions.py` (mission load, reflection save, Save State survives a reload), `test_settings.py` (session duration + accessibility preferences persist and actually change computed styles), `test_save_export_import.py` (export/import round-trip across separate contexts, PIN-hash-only preservation, name-collision and malformed/foreign-file rejection), `test_offline.py` (a never-visited mission loads after going offline, the exact ADR-027 guarantee), `test_parent_mode.py` (picker → PIN gate → dashboard → cross-child isolation, plus the zero-profiles state), `test_touch_targets.py` (every interactive control ≥44px at Tablet/Mobile/Desktop, zero overflow).
- **New `tests/run_all.py`** — discovers every `test_*.py`, runs each `run()`, catches exceptions as failures rather than crashing the whole run, prints an aggregate summary, exits non-zero on any failure.
- **New `tests/README.md`** — what's covered, how to run it (`python3 tests/run_all.py`, nothing new to install), and the design notes (no pytest, Chromium only, not wired into CI yet).
- **`CLAUDE.md`'s Repository Layout** now lists `tests/` alongside `docs/`/`portal/`/`assets/`/`scripts/`.

## Out of Scope

Pytest or any other test framework/dependency not already used in this repo. Browser matrix testing (Firefox/WebKit) — Chromium only. CI wiring (GitHub Actions etc.) — running the suite is a manual step for now; automating *when* it runs is a separate decision the user hasn't asked for.

## Success Criteria

`python3 tests/run_all.py` runs unattended against a fresh checkout and reports all golden paths passing, with no manual setup beyond what this environment already has. — **Met**, verified below.

## Manual Verification

- **Full suite run**: `python3 tests/run_all.py` — all 8 test files pass (55 individual assertions across them).
- **One real bug caught and fixed in the suite itself, not the app**: the first run of `test_missions.py` failed on "active Explorer survives a full reload," checking for the Explorer's display name on the mission page — but that page never shows it (only Home's dashboard does via "Exploring as: ..."). This is the same class of false-positive this session already hit once before (the `&`/`&amp;` escaping issue during Save Export/Import verification) — fixed by asserting against Home instead, confirmed the corrected test passes, then re-ran the whole suite clean.
- **Proved the suite has real teeth, not trivial passes**: deliberately renamed the "Create Explorer" button's text in `router.js` (`sed` edit), re-ran the full suite, and confirmed 6 of 8 test files correctly failed (every flow that creates an Explorer) while the 2 unaffected files (`test_broken_links`, `test_offline`) still passed — proving the suite actually exercises real app behavior rather than passing regardless. Reverted via `git checkout -- portal/js/router.js`, confirmed the diff was clean, and re-ran the suite to confirm all 8 pass again.

## Deliverables

`tests/` directory (`helpers.py`, `run_all.py`, `README.md`, 8 `test_*.py` files), updated `CLAUDE.md` (Repository Layout) and `TODO.md`.

## Completion Notes

**Complete.** The platform now has a persisted, reusable, dependency-light Playwright suite covering every golden path verified across this session, runnable with a single command and no new installs. It caught one genuine test-authoring mistake during its own first run and was proven (via a deliberately injected, then reverted, regression) to actually fail when the app breaks — not just pass by construction. ✅

---

# Previous Milestone — Tablet/Mobile Touch-Target CSS Gap — COMPLETE

## Objective

Phase 11 testing found buttons measuring ~21px tall against the ~44px touch-target guideline 601_HTML_ARCHITECTURE.md's Responsive Behaviour section calls for ("touch-friendly controls"), because `layout.css`/`components.css` had been empty Milestone-1.1 placeholders since Phase 1 — no responsive or touch-aware CSS existed anywhere in the platform. The user asked to close this next, since the platform is likely to be used on mobile/laptop devices.

## Inputs

- TODO.md's Phase 11 Tablet/Mobile findings (measured ~21px buttons, no overflow, no broken flows).
- `601_HTML_ARCHITECTURE.md`'s Responsive Behaviour section (Desktop/Laptop/Tablet/Large mobile as target layouts; "readability, generous spacing and touch-friendly controls").
- The actual DOM structure every interactive control is built from — surveyed `router.js`/`parent-mode.js`'s `createElement` calls (button, a, input, label, textarea, summary) to confirm every one is plain HTML with no shared class/component system, so plain-element CSS selectors would cover the whole platform with zero JavaScript changes.

## Relevant Documentation

`601_HTML_ARCHITECTURE.md` (Responsive Behaviour).

## Completion Summary

- **`portal/css/layout.css`** — added a `box-sizing: border-box` reset (needed so padding-driven touch-target sizing doesn't cause overflow), a flex-wrapping, gapped primary nav (so enlarged nav links wrap cleanly on narrow viewports instead of clipping or forcing horizontal scroll), and `li + li` spacing (previously zero spacing between list items anywhere — Explorer selector, campaign list, mission list).
- **`portal/css/components.css`** — every interactive control now gets a `min-height: 44px` touch target: buttons/submit inputs, text/file inputs, `<summary>` disclosure triggers (`+ New Explorer`/`+ Import Explorer`), and in-content links (nav links, Continue Mission, campaign cards). Radio/checkbox `<input>`s stay their native small size, but the `<label>` that always wraps them in this platform's markup (native label-for-input tap behaviour) gets the 44px treatment instead — confirmed this is the right target by checking that every radio/checkbox in `router.js` is genuinely always wrapped in a label, never bare.
- Deliberately targeted plain HTML element selectors (`button`, `a`, `label`, `summary`, `input[type=...]`) rather than introducing a new CSS class system — every interactive control across the codebase is built with plain DOM APIs, not a shared component function, so this closes the gap with zero JavaScript changes, matching the "no build tools, keep it simple" constraint.

## Out of Scope

A full design system/visual redesign (colors, typography scale beyond what accessibility already needed, card layouts) — this milestone closes specifically the touch-target/spacing gap Phase 11 flagged, not a general CSS overhaul. Per-breakpoint layout changes (e.g. a hamburger menu below some width) — not needed, since the nav already wraps cleanly and no overflow was found at any tested size.

## Success Criteria

Every interactive control across the learner shell and Parent Mode measures at least 44px tall at Tablet (768×1024) and Mobile (375×667) viewports, with zero horizontal overflow and no broken flows — met, verified below.

## Manual Verification

All verified via headless Chromium against the real running app, not assumed:

- **Touch-target sweep**: measured every `button`, `a`, `summary`, `label`, `input[type=text]`, `input[type=file]` across Home dashboard, Campaign Select, a mission page, Settings, and the Explorer selector (including the new Save-Export/Import "+ Import Explorer" form) at Tablet, Mobile and Desktop viewports — zero elements under 44px tall at any size (previously ~21px at all sizes, since no responsive CSS existed).
- **Horizontal overflow**: confirmed absent at Tablet and Mobile for every page above, including with `a11y-font-x-large` + `a11y-high-contrast` classes both applied simultaneously at mobile width (the most demanding realistic combination).
- **Parent Mode**: swept the Explorer picker, PIN gate and full scoped dashboard at Mobile width — zero elements under 44px (3 elements on the PIN gate, 25 on the dashboard, all passing).
- **Full mission crawl**: all 21 missions load with correct titles and zero console/page errors at Mobile viewport with the new CSS active.
- **Visual inspection**: screenshotted Home, the "+ New Explorer" form, Settings (including the Backup & Transfer section from the previous milestone), a mission's reflection form, and Parent Mode's PIN gate at Mobile width, plus Home/mission/profile at Desktop width — nav wraps cleanly into two rows on narrow viewports and sits on one row on desktop, spacing looks intentional and uncrowded, nothing renders broken or overlapping at any size.
- **Full regression pass**: multi-child profile isolation, Save Export/Import's Backup & Transfer button and Import Explorer form, and Discovery Log all continue to work correctly with the new CSS in place.
- One test-setup mistake caught mid-verification: an early Tablet/Mobile sweep used a stale mission URL pattern (`#/campaign/campaign01/mission/mission01`) that 404'd to the Not Found page, silently testing the wrong page. Caught by checking the actual route table in `router.js` (`#/mission/<id>`, not campaign-nested) and re-run correctly.

## Deliverables

Updated `portal/css/layout.css` and `portal/css/components.css` (first real content either file has had beyond the Milestone 11 accessibility rules already in `base.css`/`themes.css`); updated `TODO.md`'s Phase 11 Tablet/Mobile checklist items.

## Completion Notes

**Complete.** The genuine, pre-existing gap Phase 11 testing surfaced and deliberately did not silently patch — no responsive/touch-aware CSS existed anywhere in the platform — is now closed with a small, targeted, plain-CSS change: every interactive control across the learner shell and Parent Mode meets the ~44px touch-target guideline at Tablet, Mobile and Desktop sizes, with zero horizontal overflow and zero regressions to any existing flow. ✅

---

# Previous Milestone — Save Export/Import as a Manual Downloadable File — COMPLETE

## Objective

README.md's "Smaller, Still Worthwhile" list named this as the one practical way to back up or move a child's progress between devices without a backend. Per ADR-026's own stated consequence ("anything that would make a profile mean something outside the single device it was created on... would need its own new ADR"), this needed a new ADR, not a quiet addition.

## Inputs

- `README.md`'s Future Possibilities / Smaller Still Worthwhile list.
- ADR-024/025/026 (Explorer Profiles, PIN-as-deterrent, local-device boundary).
- `portal/js/explorer-profiles.js` (profile CRUD, `isNameTaken`/`generateProfileId` helpers reused), `portal/js/storage.js` (per-child save read/write).

## Relevant Documentation

`006_DESIGN_DECISION_LOG.md` (ADR-024, ADR-025, ADR-026 — this added ADR-028).

## Completion Summary

- **`portal/js/storage.js`** — added thin `exportSave(childId)`/`importSave(childId, save)` wrappers around the existing private `readSave`/`writeSave`, so the save shape/version stays owned in exactly one place.
- **`portal/js/explorer-profiles.js`** — added `EXPORT_FORMAT_VERSION` (1), `exportProfile(childId)` (bundles profile identity fields — name, avatar, PIN hash, timestamps, streak — plus that child's full save into one versioned object) and `importProfile(exportedData)` (validates the export format version and required fields, rejects a display-name collision with an existing local profile via the existing `isNameTaken` helper, always mints a fresh local `id` via `generateProfileId()` rather than reusing the file's id, writes both the new profile and its save).
- **`portal/js/router.js`** — Settings gained a "Backup & Transfer" section (`renderExportControl`, shown only when an Explorer is active) with a "Download Backup File" button that builds the JSON file via `Blob`/`URL.createObjectURL` and triggers it through a temporary `<a download>`. Home's "Who's Exploring Today?" screen gained a collapsed "+ Import Explorer" form (`renderImportExplorerForm`) — a file picker plus an Import button that reads the chosen file as JSON, calls `importProfile()`, and on success immediately activates the new profile exactly like creating one.
- **ADR-028** added to `006_DESIGN_DECISION_LOG.md`, explicitly distinguishing this manual, parent-initiated file transfer from the automatic cross-device sync ADR-026 excludes, and recording why only the PIN's hash (never the plaintext PIN) travels in the file.

## Out of Scope

Automatic or continuous cross-device sync (excluded architecture-wide, not just for this feature — ADR-026). Any transfer mechanism other than a manually-downloaded-and-re-uploaded file (e.g. QR code, direct device-to-device transfer) — not requested, adds real complexity for a niche benefit over a plain file.

## Success Criteria

A backup file downloaded from one browser context, then imported into a completely separate browser context, reproduces the same Explorer (name, avatar, PIN, streak, Discovery Log, earned rewards, session, settings) with zero manual re-entry. No regression to any existing flow. — **Met**, verified below.

## Manual Verification

All verified via headless Chromium against the real running app (not assumed from reading code):

- **Export → fresh-context import**: created "Ada" (PIN 1234) in one browser context, downloaded her backup file from Settings, imported it into a completely separate, empty browser context via Home's "+ Import Explorer" form. The import immediately activated a new "Ada" profile whose dashboard rendered correctly.
- **PIN preserved without ever traveling in plaintext**: confirmed the exported JSON's `profile.pinHash` field matches the imported profile's `pinHash` exactly (same hash, same PIN still works), while the plaintext PIN never appears anywhere in the downloaded file.
- **Fresh local id on import**: confirmed the imported profile's `id` differs from any id in the source data — import never reuses an id from the file, so two devices can never collide on the same profile id.
- **Name-collision rejection**: created a local "Ada" profile on a third context, then attempted to import the same "Ada" backup file — rejected with `"Ada" already exists on this device. Rename or remove the existing Explorer first.`, and confirmed no duplicate profile was created.
- **Malformed/foreign file rejection**: an invalid-JSON file was rejected with "That file is not valid JSON."; a well-formed but unrelated JSON file was rejected with "This file is not a recognised Explorer Academy export." — both graceful, no console errors.
- **Double-import independence**: re-importing the identical backup file a second time onto a device that already had that Explorer correctly hit the same name-collision rejection rather than silently creating a duplicate or overwriting the existing profile — confirmed the profile count stayed at 1 both times.
- **Full regression pass** with the new code present: created two independent Explorers, confirmed complete save/streak isolation between them; visited the campaign list and Mission 1 successfully; Settings' existing session-duration and Accessibility sections still render and function correctly alongside the new Backup & Transfer section; Discovery Log route still renders; Parent Mode's picker → PIN gate → scoped dashboard cycle still works correctly for an Explorer created via this session, with zero JS console/page errors (the one console message observed — a 404 for `favicon.ico` — is a pre-existing, unrelated gap, not a regression from this feature).
- One test-methodology red herring caught and resolved during verification: an early regression check searched raw `page.content()` for the literal string `"Backup & Transfer"`, which failed because `&` is HTML-entity-escaped (`&amp;`) in serialized `innerHTML`/`page.content()` output — confirmed via live-DOM inspection and Playwright's `get_by_text()` (which correctly handles entity decoding) that the feature was rendering correctly all along; this was a test artifact, not a product bug.

## Deliverables

Updated `portal/js/storage.js`, `portal/js/explorer-profiles.js`, `portal/js/router.js`; new ADR-028 in `006_DESIGN_DECISION_LOG.md`; updated `TODO.md`.

## Completion Notes

**Complete.** A parent can now back up or move one Explorer's complete data (profile identity + save) between devices via a manually downloaded and re-uploaded JSON file, without any backend or automatic sync — staying firmly on the local-device side of the boundary ADR-026 draws. Verified end-to-end across separate browser contexts standing in for separate devices, including the same-PIN-still-works property, collision handling, and malformed-file handling. Full regression pass shows zero impact on any existing flow. ✅

---

# Previous Milestone — Genuine Offline Caching via Service Worker — COMPLETE

## Objective

Phase 11 testing found that only previously-visited routes survived going offline, since nothing beyond default browser HTTP caching existed. Campaign 01's entire `src/`+`generated/` tree measured under 1MB total, so precaching all of it — not just visited pages — was the simple, robust fix, with no need to cherry-pick "essential" vs "optional" assets.

## Inputs

- Phase 11's Offline finding (this file's "Previous Milestone — Phase 11: Testing" below).
- ADR-004 (Offline First).
- `601_HTML_ARCHITECTURE.md`'s Offline-First Architecture, Offline Strategy and Caching sections.
- `router.js`'s `KNOWN_CAMPAIGN_IDS` placeholder list — mirrored in the service worker for the same reason it exists there: no real campaign-discovery manifest exists yet.

## Relevant Documentation

`601_HTML_ARCHITECTURE.md` (Offline-First Architecture, Offline Strategy, Caching — now updated with an inline note pointing at this implementation), `006_DESIGN_DECISION_LOG.md` (ADR-004, and new ADR-027).

## Completion Summary

- **New `portal/sw.js`** — a service worker that precaches the platform shell (a short, hand-maintained list of JS/CSS/components/index.html) plus every known campaign's complete `src`/`generated` content, fetched from a manifest at install time. Cache-first fetch strategy with a network fallback; a versioned `CACHE_NAME` so old content is discarded on the next load after a version bump.
- **New `scripts/generate_offline_manifest.py`** — walks a campaign's `src`/`generated` directories and writes the file list to that campaign's own `generated/offline-manifest.json`, mirroring `scripts/build_workbook.py`'s existing pattern rather than hand-maintaining a list of 100+ files. Run for `campaign01`: 124 files listed.
- **`app.js` and `parent-mode.js`** both register the same service worker via a new shared `registerServiceWorker()` helper in `utils.js` — necessary because either page could be the first one a device ever loads, and Parent Mode's own `<base href="../">` correction means a plain relative `'sw.js'` path resolves correctly to the portal root from both pages.
- **ADR-027** added, recording the cache-first/manifest-driven decision, the alternatives considered (runtime-only caching, a build-tool-generated manifest), and the manual `CACHE_VERSION`-bump maintenance requirement.

## Manual Verification

All verified via headless Chromium against the real running app, not assumed:
- First online load: service worker installs, activates, and takes control; cache contains exactly 144 entries (20 shell files + 124 campaign files) — an exact match with no missing or extra files.
- **The exact Phase 11 failure case, now fixed**: after one online load, went offline and loaded two missions *never fetched during the session* (mission19, mission12) — both loaded correctly, headings rendered, zero errors.
- Parent Mode: visited once online (registering its own service worker instance), then confirmed the full picker → PIN → dashboard cycle works completely offline.
- Cache versioning: bumped `CACHE_VERSION` on disk while a browser context stayed open with the old version installed, forced an update check, and confirmed the old cache (`explorer-academy-v1`) was fully replaced by the new one (`explorer-academy-v2`) — not left alongside it.
- Full regression pass with the service worker active: all 21 missions, reflection saving, Settings, Discovery Log, Explorer Profile, and Parent Mode all function identically to before — zero failed requests, zero console/page errors.

## Verification

Offline caching now genuinely delivers ADR-004's promise — a complete campaign, not just previously-visited pages, remains usable after one initial online load — verified directly against the exact scenario Phase 11 found failing, not assumed fixed. `TODO.md`'s Phase 11 Offline checklist item updated to record the fix. ✅

---

# Previous Milestone — Phase 11: Testing — COMPLETE

## Completion Summary

Worked through all 9 items on `TODO.md`'s Phase 11 checklist as a verification pass — confirming what works, finding and fixing what's genuinely broken, and flagging (not silently building) anything that would need real implementation to properly pass. Every verdict below is backed by an actual Playwright test run against the running app, not inferred from reading code.

**Pass, no findings:**
- **Broken links** — crawled all 27 learner-shell routes (5 static + campaign overview + 21 missions) plus Parent Mode: zero 4xx/5xx responses, zero console page errors.
- **Save State** — profile, active session and Discovery Log all survive a full page reload; a different browser context correctly sees zero data (proper `localStorage` isolation).
- **Parent Mode** — zero-profiles empty state shows the correct message; full picker → PIN → dashboard cycle works end-to-end.
- **Multi-child profile isolation** — three simultaneous profiles cross-checked in both directions: each Explorer's Discovery Log shows only their own entries.
- **Desktop** (1440×900) — no overflow, every flow tested works correctly.

**Pass, with one real gap found and fixed live:**
- **Accessibility** — keyboard tab order is logical, the native focus outline is never suppressed anywhere in the CSS, all landmarks are present (`header`/`main[aria-live]`/`nav[aria-label]`/`footer`), and every form control has a verified accessible name via real label association (checked with Playwright's `get_by_role`/`get_by_label`, not just visual inspection). One genuine gap found: OS-level `prefers-reduced-motion` wasn't being honoured automatically — only the explicit in-app Settings toggle applied it. Fixed with a 2-line `@media (prefers-reduced-motion: reduce)` rule in `base.css`, verified via Playwright's `reduced_motion='reduce'` context emulation before and after the fix.

**Pass functionally, but surfaced genuine pre-existing gaps (not regressions, not silently patched):**
- **Tablet / Mobile** (768×1024, 375×667) — no horizontal overflow, no broken flows at either size. But measured button heights at ~21px, well under the ~44px touch-target guideline 601_HTML_ARCHITECTURE.md calls for ("touch-friendly controls"). Root cause: `portal/css/layout.css` and `components.css` remain empty Milestone-1.1 placeholders — there is no responsive/touch-aware CSS at all yet, only the narrow accessibility rules Milestone 11 added to `base.css`/`themes.css`. Genuinely closing this needs real design/CSS work, which is exactly the kind of thing this testing pass should surface, not quietly patch with an inline style hack.
- **Offline** — nuanced, not a blanket pass or fail. Tested precisely: a route already visited while online survives a later offline reload (confirmed — ordinary browser HTTP caching, no service worker involved). A route never visited before going offline fails to load (also confirmed directly, not assumed). This is a narrower guarantee than ADR-004/601_HTML_ARCHITECTURE.md's "a complete campaign should remain usable without network access" after one initial load — it's offline-for-what-you've-already-seen, not offline-for-the-whole-campaign, since no service worker or cache manifest exists anywhere in the platform.

## Manual Verification

Every item above was verified with a dedicated Playwright script run against a locally-served instance of the app (headless Chromium), not inferred from source reading. Specific techniques used: response-status crawling for broken links; `localStorage` cross-context checks for Save State/isolation; `page.keyboard.press('Tab')` sequencing plus `getComputedStyle` for focus/outline for Accessibility; `context.set_offline(True)` for Offline; `browser.new_context(viewport=...)` for the three device sizes; `browser.new_context(reduced_motion='reduce')` before and after the `base.css` fix.

## Verification

Phase 11 (Testing) is complete: 5 of 9 checklist items pass with zero findings, 1 passed after a real gap was found and fixed on the spot, and 2 pass functionally while honestly surfacing genuine, pre-existing implementation gaps (touch-target sizing, offline caching scope) that are real future work, not something to have silently declared "done." ✅

---

# Previous Milestone — Post-Milestone-11 ADR/Vision Audit and README Refresh — COMPLETE

## Completion Summary

The user asked for a full re-verification that every ADR and vision-doc principle still holds after Milestone 11, plus a list of genuine differentiator features (not just nice-to-haves) added to README.md as "Future Possibilities."

Read all 26 ADRs (001–026) and cross-checked each against the running code rather than assuming. Findings:

- **Confirmed still true, unaffected by Milestone 11:** ADR-001–012, 014–022 — spot-checked the ones most plausibly at risk (ADR-006/010/012 Hidden Parent Mode — grepped `router.js`/`nav.js` for any curriculum leakage or accidental learner-facing link to Parent Mode; found none. ADR-022 Knowledge Core/Rank catalog resolution — confirmed still resolves correctly per-child in Parent Mode).
- **ADR-013:** correctly marked Superseded by ADR-024 already; no action needed.
- **ADR-023 needed a small correction:** its Consequences said "Explorer profile... preferences remain unimplemented," which ADR-024 made untrue (every setting is now implicitly per-child). Added an inline note rather than rewriting the ADR's own historical Decision/Rationale.
- **Found a genuine, previously-unverified architectural gap, predating this session:** 601_HTML_ARCHITECTURE.md's Static Site Architecture section claims "Local filesystem" and "USB distribution" (opening `index.html` via `file://`, no server) as valid deployment targets. Tested directly: browsers block ES module loading (`<script type="module">`, used by `app.js` and every module it imports) under `file://` with a CORS error before any application code runs — confirmed via console output, not assumed. This has never worked, since Phase 1, independent of anything built this session. Documented as an inline correction in `601_HTML_ARCHITECTURE.md` rather than silently fixed, since a real fix (dropping ES modules platform-wide) is an architecture-level change needing its own ADR and approval.
- **Raised, not silently resolved, a genuine philosophy question:** 301_PLATFORM_ARCHITECTURE.md's Out of Scope list excludes "user accounts" alongside cloud sync/multiplayer/leaderboards/ads/purchases/mandatory connectivity. Milestone 11's named, PIN-protected Explorer Profiles could plausibly be read as crossing that line. Added **ADR-026**, arguing (and recording the reasoning, not just the conclusion) that this is local device-bound save-slot switching — closer to "which save file" in a single-player game — not the server-backed, cross-device "user accounts" the rest of that Out-of-Scope list is clearly about, and drawing an explicit boundary for future features not to cross without a new ADR.
- **Raised, for the user's own judgement rather than resolved:** Milestone 11 added a numeric "missions with progress" count and a streak counter, prominently shown on Home's very first screen. ADR-007 says completion percentage is "not the primary success metric," and 002_PROJECT_CONTEXT.md's Non-Goals explicitly excludes becoming "a reward-driven educational app." Neither is technically violated (no percentage is shown, nothing is gated or rewarded by the streak, missing a day carries no narrative or reward consequence, unlike loss-aversion-driven streak mechanics elsewhere in consumer apps) — but streak counters are a well-documented engagement-design pattern, and the user's own explicit feature request introduced this tension without either of us naming it explicitly at the time. Surfaced directly to the user rather than justified away or silently adjusted.
- **Found, unprompted:** `README.md` had never been updated since the original foundation-only draft — it still said "No implementation has started. This is intentional," listed a stale root `workbook/` directory, and left the Roadmap's Stages 1–5 unchecked despite being complete. Corrected "Current Project Status," "Repository Structure" and "Roadmap" to reflect reality (verified actual `docs/` subdirectories via `ls` rather than assuming), consistent with the same standard applied to every other doc audited this session.

Added a "🌱 Future Possibilities" section to `README.md`, split into **True Differentiators** (Cross-Campaign Continuity, a Habits-of-Mind Portfolio replacing grade-like reporting, Real-World-Synced Investigations, an Explorer's Field Journal built from the child's own Discovery Log via the existing workbook pipeline, cooperative Joint Expedition Missions enabled by Milestone 11's multi-profile architecture, and Confidence Calibration) and a shorter **Smaller, Still Worthwhile** list (save export/import, broader avatars, audio narration, a fuller design system) — each Differentiator explicitly tied back to the project's own founding philosophy rather than presented as a generic feature wishlist.

## Manual Verification

- Tested the `file://` finding directly via headless Chromium (not assumed): confirmed the exact CORS console error and that zero application content renders.
- Grepped `router.js`/`nav.js` for curriculum/parentGuide leakage and for any accidental learner-facing link to Parent Mode — none found.
- Verified `docs/`'s actual subdirectory listing via `ls` before rewriting README's Repository Structure diagram, rather than trusting the old (already-known-stale) tree.

## Verification

Every ADR was individually re-checked against running code rather than assumed still valid; two real documentation gaps (ADR-023's stale consequence, the `file://` claim) were found and corrected; one genuine scope-boundary question (Explorer Profiles vs. "user accounts") was resolved and recorded as ADR-026; one genuine, unresolved philosophy tension (streak/progress visibility vs. anti-gamification Non-Goals) was surfaced to the user rather than silently decided either way; and README.md's multi-phase staleness was corrected alongside the requested new "Future Possibilities" section. ✅

---

# Previous Milestone — Milestone 11: Multi-Child Explorer Profiles, Per-Child Save Slots, and PIN-Gated Parent Mode — COMPLETE

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

1. ✅ **Storage foundation** — DONE. `storage.js` gained a profiles registry (`loadProfiles`/`saveProfiles`), an active-child pointer (`getActiveChildId`/`setActiveChildId`), and per-child save keying (`explorerAcademy.save.<childId>`). Every existing save function (`saveCurrentSession`, `loadCurrentSession`, `appendDiscoveryLogEntry`, `loadDiscoveryLog`, `appendEarnedRewards`, `loadEarnedRewards`, `saveSettings`, `loadSettings`) now takes an optional trailing `childId`, defaulting to the active child. With no active child set, every function falls back to the original single `explorerAcademy.save` key, so nothing else in the app needed to change yet.
2. ✅ **Migration** — DONE at the storage/logic layer. `storage.js` exposes `hasLegacySave()`/`migrateLegacySaveTo()`/`clearLegacySave()`; `explorer-profiles.js` exposes `hasUnmigratedLegacySave()`/`createProfileFromLegacySave({ displayName, avatar, pin })`, which creates a profile and moves the legacy save's `currentSession`/`discoveryLog`/`earnedRewards`/`settings` into it. **Not yet wired into any UI** — that's Home's job in step 4, once it exists to actually prompt for a name/PIN.
3. ✅ **Profile CRUD** — DONE. New `portal/js/explorer-profiles.js`: `listProfiles()`, `findProfile()`, `getActiveChild()`, `selectActiveChild()`, `createProfile({ displayName, avatar, pin })` (validates non-empty trimmed name, case-insensitive uniqueness, 4-8 digit PIN), `verifyProfilePin(childId, pin)`, `updateProfile(childId, { displayName, avatar })`, `changePin(childId, { currentPin, newPin })`, `deleteProfile(childId)`, `touchLastPlayed(childId)` (calendar-day streak tracking). PINs are hashed via `crypto.subtle.digest('SHA-256', ...)` and never stored or compared as plain text.
4. ✅ **Home page rework** — DONE. `renderHome()` now checks `getActiveChild()`: if set, shows the existing dashboard content (Continue Mission / Choose Campaign) scoped to that child; if not, shows `renderExplorerSelector()` — a "Who's Exploring Today?" list (avatar, name, Explorer-since, last-played, streak, missions-with-progress count per profile, the last computed the same way Parent Mode already derives it: union of that profile's earned-reward and Discovery-Log mission IDs) plus a collapsed "+ New Explorer" `<details>` form (name, a small fixed emoji avatar picker, 4-8 digit PIN). Submitting the form calls `createProfileFromLegacySave()` instead of `createProfile()` when this is the very first profile on a device with an unmigrated legacy save (surfaced with an explanatory notice), otherwise `createProfile()`. Either way, the new profile is immediately made active and `touchLastPlayed()` is called, matching "on home when a new child name is selected... available based on saved state." Selecting an existing profile does the same. The stale "placeholder" copy for the no-session dashboard state was replaced with a real "Choose Campaign" link while in this code.
5. ✅ **Switch Explorer** — DONE. Decided the exact interaction during implementation: once a child is active, Home shows their dashboard directly on every visit (not the picker) so a single-child household isn't reprompted constantly; the persistent "Switch Explorer" link added to the footer nav (`components/navigation/nav.js`, wired in `router.js`'s `init()`) is what explicitly clears the active child and returns to the picker — this makes it a genuinely necessary control rather than a redundant duplicate of the "Home" link, and still satisfies "ask who is playing" (nobody sees another child's dashboard without an explicit selection first; switching is always a deliberate action, never silent).
6. ✅ **Settings page** — DONE. `renderAccessibilityForm()` added to the Settings route: text-size radios (`normal`/`large`/`x-large`), a high-contrast checkbox, and a reduced-motion checkbox, backed by `settings.js`'s new `getAccessibilityPreferences()`/`setAccessibilityPreferences()`. No PIN control here, as planned — PINs remain changeable only from inside Parent Mode.
7. ✅ **Explorer Profile page** — DONE. `renderExplorerStats()` shows Explorer-since, last-played, streak and a missions-with-progress *count* (not an estimated-time figure — kept simple rather than parsing missions' free-text `estimatedTime` strings) for the active child, reusing the exact same `countMissionsWithProgress()` helper Home's selector already uses so the two numbers can never disagree. Gracefully shows nothing extra when no Explorer is active (legacy fallback).
8. ✅ **Parent Mode rework** — DONE. `parent-mode.js`'s old one-click `renderAccessGate` is replaced by `renderExplorerPicker()` (lists profile names — names alone aren't sensitive) → `renderPinGate(root, profile)` (that Explorer's own PIN, verified via `verifyProfilePin()`, retryable with no lockout, per ADR-025) → `renderDashboard(root, profile)`. `reward-engine.js`'s `getEarnedRewards()` and `discovery-log.js`'s `getDiscoveryLog()` both gained an optional `childId` param (defaulting to the active Explorer as before) so Parent Mode can read a *specific* child's data regardless of who's active in the learner shell. The dashboard shows a "Viewing: `<avatar>` `<name>` — Choose a different Explorer" bar, and a new `renderChangePinControl()` section at the end — the only place a PIN can be changed, requiring the current one, never reachable from the learner-facing Settings page.
9. ✅ **Streak/last-played tracking** — DONE. `touchLastPlayed()` is called both when a profile is selected/created on Home (`activateProfile()`) and on successful reflection completion (`buildReflectionSection()`'s submit handler) — confirmed idempotent same-day (doesn't double-count if both fire on the same calendar day).
10. ✅ **Accessibility application** — DONE. `settings.js`'s `applyAccessibilityPreferences()` toggles `a11y-font-large`/`a11y-font-x-large`/`a11y-high-contrast`/`a11y-reduced-motion` classes on `<html>`, styled by new rules in `base.css` (font scale, reduced motion) and `themes.css` (high contrast — the first real content either file has had since the Milestone 1.1 placeholder). Called at app bootstrap (`app.js`), whenever a profile is activated or Switch Explorer clears the active one (`router.js`), and immediately after saving new preferences in Settings — so two children's differing preferences never leak into each other and a page reload never flashes unstyled content.
11. ✅ **Documentation** — DONE (completed incrementally in steps 1-3's commit): `503_DATA_MODEL.md`/`504_JSON_SCHEMA.md` updated for the now-real, multi-instance, PIN-bearing Explorer Profile and per-profile Save Game; ADR-024/ADR-025 added to `006_DESIGN_DECISION_LOG.md` (ADR-013 marked Superseded); `TODO.md` Phase 10 entry created and kept current throughout.

**All 11 implementation-plan steps are now complete. Milestone 11 is done.**

## Out of Scope

Cross-device sync or any hosting/backend. Save export/import as a downloadable file (a good future idea, but not requested this round). PIN recovery (none is possible without a backend — losing a PIN means resetting that child's profile; this is stated plainly to the user rather than engineered around). Avatar image upload (fixed emoji set only). Separate parent-account logins or multiple PINs per child. Per-child content/mission restrictions (explicitly confirmed out of scope — every child sees the same campaign content, just their own progress through it).

## Success Criteria

- Two differently-named child profiles on the same device/browser have completely independent saves (mission progress, rewards, Discovery Log, session duration, accessibility settings) that never leak into each other.
- Home always requires an explicit selection before showing any child's content; "Switch Explorer" reliably returns to that selector from anywhere in the learner shell.
- Parent Mode requires picking the correct child's name and that child's specific PIN before showing any of that child's data; a wrong PIN shows an error and allows retry; a correct PIN never shows another child's data.
- PINs are never stored or displayed as plain text anywhere (hashed at rest).
- Migration path does not silently destroy pre-existing single-profile save data.

## Manual Verification

**Steps 1-3 (done now), via headless Chromium against the real modules (not a mock):**

- Created two profiles ("Jamie"/"Alex") with different PINs; confirmed a duplicate name (case-insensitive) is rejected, an invalid (non-4-8-digit) PIN is rejected, each profile's PIN only verifies against its own hash (Alex's PIN correctly fails against Jamie's profile), a rename correctly checks uniqueness against the other profile, `changePin` invalidates the old PIN immediately, `touchLastPlayed` increments a streak once and does not double-count a same-day repeat call, and `deleteProfile` removes exactly the targeted profile and clears the active-child pointer only if it was the one deleted.
- Confirmed the **legacy-key fallback**: with no profile ever created or made active, existing Settings/mission-reflection/reward-earning/Discovery-Log flows all behave exactly as before this milestone (regression-tested via the same flows used throughout Phases 2-9) — zero risk from the `storage.js` refactor to anyone not yet using profiles.
- Confirmed the **migration path**: seeded a legacy save (session/discoveryLog/settings) directly in `localStorage` the way a pre-Milestone-11 save would look, called `createProfileFromLegacySave()`, and confirmed the new profile's own keyed save contains the exact migrated data, the legacy key is cleared afterward, and `hasUnmigratedLegacySave()` correctly flips to `false`.
- All test runs produced zero console/page errors.

**Steps 4-5 (done now), via headless Chromium against the real running app (not mocked storage):**

- Fresh device (no profiles): confirmed Home shows "Who's Exploring Today?" with "No Explorers set up on this device yet." and the "+ New Explorer" form.
- Created "Jamie" (🦊, PIN 1234): immediately became active, dashboard showed "Exploring as: 🦊 Jamie" and "Choose Campaign" (no session yet). Visited a mission — loaded correctly and saved a session against Jamie's own keyed save.
- Clicked "Switch Explorer": returned to the picker, correctly showing Jamie's stats (Explorer since today, last played today, streak 1 day, missions with progress 0 — accurate, since Jamie visited a mission page but hadn't saved a reflection yet).
- Created a second Explorer "Alex" (🐸, PIN 5678): confirmed Alex's dashboard showed no session in progress (Jamie's mission visit did not leak across), and Alex's own Discovery Log / Explorer Profile (rewards) pages were both correctly empty despite Jamie's activity.
- Completed a reflection as Jamie (mission03, earning a Knowledge Core reward): confirmed the picker afterward showed Jamie's "Missions with progress" count update to 1 while Alex's stayed at 0, and that clicking Jamie's name in the picker (not just fresh creation) correctly re-activated her and showed her exact Discovery Log entry.
- Migration through the real UI: seeded a legacy save (`currentSession`/`settings`) directly in `localStorage` in a fresh browser context, opened Home, confirmed the "+ New Explorer" form showed the "we found existing progress" notice, created a profile from it, and confirmed the resulting dashboard correctly showed "Continue Mission" for the migrated session.
- Full regression: all 21 missions, Settings, and Parent Mode all still load and function correctly with **no profile ever created** (the legacy-key fallback path), and zero console/page errors across every run above.

**Step 8 (done now), via headless Chromium against the real running app, both learner shell and `portal/parent/index.html`:**

- Created "Jamie" and "Alex" via the learner shell (Jamie completed mission03's reflection, earning a reward). Opened Parent Mode: the picker correctly listed both names.
- Selected Jamie, entered a wrong PIN — rejected with "Incorrect PIN," retry allowed (no lockout). Entered **Alex's** correct PIN against Jamie's gate — also correctly rejected (PINs don't cross-unlock). Entered Jamie's correct PIN — dashboard loaded, showing "Viewing: 🦊 Jamie," her reflection present in the DOM (confirmed via `innerHTML`, since it renders inside a collapsed `<details>` mission card), and no trace of Alex anywhere in the page.
- Used "Change PIN" (current + new PIN form) to change Jamie's PIN; confirmed success message. Returned to the picker, selected Jamie again: her *old* PIN was correctly rejected, her *new* PIN was correctly accepted.
- Selected Alex separately (her own unchanged PIN): confirmed her dashboard shows zero rewards and no trace of Jamie's reflection — full isolation holds in both directions.
- Zero-profiles case: with no profiles created at all, Parent Mode shows "No Explorer profiles exist on this device yet. Create one from the Home page..." instead of a broken picker.
- Full regression: all 21 missions, Home's selector, and Parent Mode's empty state all still work correctly with **no profile ever created** (the legacy-key fallback path). Zero console/page errors across every run.

**Steps 6, 7, 9 (second trigger) and 10 (done now), via headless Chromium against the real running app:**

- Explorer Profile page: created "Jamie," completed a reflection, visited `/profile` — confirmed the stats block (Explorer since, last played, streak, missions with progress) renders correctly above the Achievements list, using the exact same progress-counting logic as Home's selector.
- Settings page: confirmed the new Accessibility section (text size radios, high-contrast checkbox, reduced-motion checkbox) renders alongside the existing session-duration control, with no PIN control present.
- Saved font size = x-large + high contrast + reduced motion for Jamie: confirmed via `getComputedStyle` that `<html>`'s `font-size` changed from 16px to 24px and `background-color`/`color` flipped to black/white — the CSS genuinely takes visible effect, not just a stored preference with no rendering behind it.
- Confirmed **full reload (bootstrap)** reapplies Jamie's saved preferences immediately (`app.js` calling `applyAccessibilityPreferences()` on `DOMContentLoaded`) — no flash of unstyled content.
- Confirmed **cross-child isolation**: clicking "Switch Explorer" clears all accessibility classes back to default; a freshly-created second Explorer ("Alex") starts with zero accessibility classes despite Jamie's preferences being saved; re-selecting Jamie afterward correctly reapplies exactly her classes again.
- Confirmed `touchLastPlayed()` firing from *both* trigger points (Home selection and reflection completion) doesn't double-count the streak on the same calendar day — completed a reflection immediately after creating a profile and confirmed the streak stayed at 1, not 2.
- Full regression: all 21 missions (both with and without an active profile), Home, Settings, and Parent Mode's empty state all still function correctly. Zero console/page errors across every run in this milestone.

## Deliverables

`portal/js/storage.js` (profiles registry, per-child save keying, legacy fallback/migration primitives), `portal/js/explorer-profiles.js` (new — profile CRUD, PIN hashing/verification, streak tracking), `portal/js/router.js` (Home page rework, Switch Explorer, Settings accessibility form, Explorer Profile stats, `touchLastPlayed()` on reflection completion), `portal/components/navigation/nav.js` (Switch Explorer link), `portal/js/parent-mode.js` (Explorer picker → PIN gate → scoped dashboard → Change PIN), `portal/js/reward-engine.js` and `portal/js/discovery-log.js` (optional `childId` param on their getters), `portal/js/settings.js` (accessibility get/set/apply), `portal/js/app.js` (bootstrap applies accessibility preferences), `portal/css/base.css` and `portal/css/themes.css` (first real content since the Milestone 1.1 placeholder — accessibility rules only, not a full design system), `docs/00-foundation/006_DESIGN_DECISION_LOG.md` (ADR-024, ADR-025; ADR-013 marked Superseded), `docs/50-content/503_DATA_MODEL.md` and `504_JSON_SCHEMA.md` (Explorer Profile / Save Game notes), `TODO.md` (Phase 10 checklist, fully ticked).

## Completion Notes

**Milestone 11 is complete.** All 11 implementation-plan steps delivered and verified across four incremental commits (storage + CRUD; Home + Switch Explorer; Parent Mode PIN gate; Settings + Profile stats + accessibility application), each left the app in a fully runnable, regression-tested state, matching CLAUDE.md's Commit Philosophy. The platform now supports multiple named children sharing one device, each with a completely independent save, own PIN-gated Parent Mode view, own accessibility/duration preferences, and own progress statistics — with the pre-existing single anonymous save preserved via migration rather than discarded. ✅

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
