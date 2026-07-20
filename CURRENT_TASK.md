# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Campaign Loader

## Objective

Build the module that forms the boundary between platform code and campaign content: locate a campaign package, validate it against the data model/schema, and expose campaign metadata to the rest of the platform — without yet rendering any mission or activity content.

## Inputs

- `docs/50-content/503_DATA_MODEL.md`
- `docs/50-content/504_JSON_SCHEMA.md`
- `docs/40-campaigns/401_CAMPAIGN_TEMPLATE.md`
- `portal/campaigns/campaign01/src/campaign.json` (currently an empty `{}` placeholder — will need real placeholder metadata fields to load against)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Campaign Loader, Campaign Data Architecture, Rendering Pipeline, Error Handling → Missing/Invalid Campaign sections)
- `docs/30-architecture/301_PLATFORM_ARCHITECTURE.md`

## Files Expected to Change

- `portal/js/campaign-loader.js`
- `portal/campaigns/campaign01/src/campaign.json` (placeholder metadata)
- Possibly `portal/js/router.js` (to add a `/campaigns` route that displays loaded campaign metadata instead of static placeholder text)

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Mission/activity rendering
- Scheduler
- LocalStorage / persistence
- Reward engine
- Discovery log
- Parent Mode
- Workbook generation
- Dynamic `/campaign/:id` and `/mission/:id` routes (deferred until there is real campaign data to route to)

## Success Criteria

- Campaign Loader can locate and load `campaign01`'s metadata.
- Invalid or missing campaign data fails gracefully (no crash, descriptive console warning, learner-facing fallback).
- Campaign metadata is validated against the required fields in `503_DATA_MODEL.md` before being exposed.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working Campaign Loader module
- Placeholder `campaign01` metadata sufficient to load and validate
- Graceful failure path for invalid/missing campaigns

## Completion Notes

Not yet started. Note: TODO.md's Phase 2 list also has "Router" ahead of "Campaign Loader," but the router work already delivered in Milestone 1.2 (static top-level navigation) covers everything the router can do until campaign data exists to route to — extending it with dynamic `/campaign/:id` / `/mission/:id` routes only makes sense once the Campaign Loader exists. Proposing Campaign Loader as the next milestone for that reason; flag if a different order is preferred before work begins.

---

# Previous Milestone — 1.2 Application Shell — COMPLETE

## Completion Summary

Built the static application shell: an Application Controller (`app.js`), a Router (`router.js`), and a data-driven primary navigation component (`components/navigation/nav.js`), wired into `portal/index.html`.

Key decisions:

- **Hash-based routing**, not the History API. This project targets local-filesystem/USB/offline deployment (`601_HTML_ARCHITECTURE.md` Static Site Architecture) where `pushState` deep links would 404 on a plain static server with no rewrite rules. Hash routes (`#/campaigns`) work identically from `file://`, any static host, and `python3 -m http.server`, with zero server configuration.
- **Route table lives in `router.js` and is imported by `nav.js`** — the nav component builds its links from `ROUTES` rather than duplicating a hardcoded list in HTML, so adding a route only requires one edit.
- **Parent Mode was deliberately not added as a router route.** `portal/parent/index.html` remains a separate static entry point, per ADR-006 (Hidden Parent Mode) — it must stay invisible to/unreachable from the learner shell, so it isn't part of the learner-facing route table.
- Unknown routes render a "Page Not Found" fallback with a link home, satisfying the Router's "route validation / unknown route recovery" responsibility from `601_HTML_ARCHITECTURE.md`.
- The route outlet (`#app`) is `aria-live="polite"` and focused after each render, so screen-reader and keyboard users get feedback on navigation, per the project's accessibility requirement.
- Visual/CSS layout was intentionally left untouched (still empty placeholders) — this milestone's validation target was "navigation between pages functions correctly," not visual design, so styling work was deferred rather than bundled in.

Routes implemented: `/`, `/campaigns`, `/discovery`, `/profile`, `/settings`. Each currently renders placeholder text only — no campaign, mission or activity content, per this milestone's scope.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright (headless Chromium):

- Nav renders all 5 route links from the route table.
- Clicking a nav link updates the outlet content, the `<title>`, and sets `aria-current="page"` on the active link without a full page reload.
- Browser back button correctly restores the previous route/content.
- Deep-linking directly to `index.html#/settings` renders the Settings placeholder immediately (no reload required, no 404).
- Navigating to an unknown hash (`#/does-not-exist`) renders the "Page Not Found" fallback.
- No `pageerror` or console errors were raised (the only network 404 logged was the browser's automatic `favicon.ico` request, unrelated to the app).

## Verification

- Navigation between logical pages works via the Router. ✅
- No page reload occurs during in-app navigation. ✅
- No JavaScript errors in the console. ✅
- Application shell renders consistently across pages. ✅
