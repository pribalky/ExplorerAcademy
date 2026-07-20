# CURRENT_TASK

## Phase

1 – Platform Bootstrap

## Milestone

1.2 – Application Shell

## Objective

Build the static application shell: the Application Controller, Router and global navigation/layout, so the portal can navigate between logical pages (Home, Campaign Select, etc.) while still rendering no real campaign content.

## Inputs

- `docs/30-architecture/301_PLATFORM_ARCHITECTURE.md`
- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Page Architecture, Router, Application Controller, Component Hierarchy sections)
- `portal/ARCHITECTURE.md`
- Existing placeholder structure from Milestone 1.1

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md`
- `docs/30-architecture/301_PLATFORM_ARCHITECTURE.md`
- `docs/00-foundation/006_DESIGN_DECISION_LOG.md`

## Files Expected to Change

- `portal/js/app.js` (Application Controller bootstrap)
- `portal/js/router.js` (route table, navigation)
- `portal/index.html` (shell markup: header, nav, main content region)
- `portal/css/layout.css`, `portal/css/base.css`
- `portal/components/navigation/`

## Implementation Plan

To be defined at the start of Milestone 1.2. Not yet started.

## Out of Scope

- Campaign loading
- Mission/activity rendering
- LocalStorage / persistence
- Scheduler
- Rewards
- Parent Mode
- Workbook generation

## Success Criteria

- Navigation between logical pages (Home, Campaign Select, Discovery Log, Profile, Settings placeholders) works via the Router.
- No page reload occurs during in-app navigation.
- No JavaScript errors in the console.
- Application shell renders consistently across pages.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working Router
- Application Controller bootstrap
- Global navigation shell
- Placeholder page views wired to routes

## Completion Notes

Not yet started. Awaiting user approval to begin.

---

# Previous Milestone — 1.1 Repository Bootstrap — COMPLETE

## Completion Summary

Created the full repository/placeholder structure defined in the Milestone 1.1 scope, using `portal/ARCHITECTURE.md` + this file as the authoritative structure (in preference to the now-corrected `docs/60-engineering/601_HTML_ARCHITECTURE.md`, whose Repository Structure section previously conflicted: `styles/`/`scripts/` vs `css/`/`js/`, hyphenated `campaign-01` vs `campaign01`, and a `portal/workbook/` folder that duplicated the repo-root `workbook/`). That document's Repository Structure section was updated to match.

Files/folders created:

- `portal/index.html` — semantic HTML5 shell (header/main/footer), no logic, links to the four placeholder stylesheets and `js/app.js` as a module.
- `portal/parent/index.html` — placeholder parent-mode shell, isolated from the learner shell.
- `portal/css/{base,layout,components,themes}.css` — empty placeholders (single descriptive comment each, no rules).
- `portal/js/{app,router,scheduler,storage,campaign-loader,mission-engine,activity-engine,reward-engine,discovery-log,parent-mode,settings,utils}.js` — empty placeholder modules (single descriptive comment each, no logic).
- `portal/components/{story,activities,navigation,rewards,ui}/` — empty component group folders (`.gitkeep`).
- `portal/data/schemas/` — empty (`.gitkeep`).
- `portal/assets/{images,icons,audio}/` — empty (`.gitkeep`).
- `portal/campaigns/campaign01/src/{campaign.json, missions/, world/, resources/, workbook/, parent/}` — campaign source skeleton; `campaign.json` is an empty `{}` placeholder.
- `portal/campaigns/campaign01/generated/{workbook,parent,resources,image-specifications}/` — empty generated-artefact folders.
- READMEs added where useful: `portal/campaigns/README.md`, `portal/campaigns/campaign01/README.md`, `portal/components/README.md`.
- Removed now-redundant `.gitkeep` files from folders that gained real content (`portal/campaigns/`, `portal/css/`, `portal/js/`, `portal/components/`, `portal/data/`, `portal/parent/`, `portal/assets/`).
- Updated `docs/60-engineering/601_HTML_ARCHITECTURE.md` Repository Structure section to match this structure and noted that printable workbook resources live in the repo-root `workbook/`, not under `portal/`.

## Manual Testing Performed

Served `portal/` with `python3 -m http.server` and requested `index.html`, all four stylesheets, `js/app.js`, and `parent/index.html` — all returned HTTP 200 (no dead links, no missing assets). No JavaScript executes yet (placeholder modules only), so there is nothing to throw a console error.

## Verification

- Repository structure matches the corrected `601_HTML_ARCHITECTURE.md` / `portal/ARCHITECTURE.md`. ✅
- All placeholder files exist. ✅
- Folder hierarchy is complete. ✅
- No dead links. ✅
- Application opens successfully (served and returns 200 with no missing references). ✅
- No JavaScript errors (no logic present to error). ✅
- Ready for Milestone 1.2. ✅
