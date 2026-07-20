# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Mission Engine

## Objective

Build the module that renders a single mission's story/objective from mission JSON, reusing the Campaign Loader's non-throwing load pattern. This gives the `/mission/:id` route (currently a static placeholder from the Router extension) something real to display, and requires creating the first placeholder mission JSON file since `campaign01` has none yet.

## Inputs

- `docs/50-content/504_JSON_SCHEMA.md` (Mission required fields)
- `docs/40-campaigns/402_MISSION_TEMPLATE.md`
- `portal/campaigns/campaign01/src/missions/` (currently empty)
- `portal/js/campaign-loader.js` (pattern to follow for a `mission-loader`-style module, or extend campaign-loader.js — to be decided at milestone start)

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Mission Engine, Mission Schema, Mission Page sections)
- `docs/50-content/503_DATA_MODEL.md` (Mission entity)

## Files Expected to Change

- A new mission-loading module (likely `portal/js/mission-engine.js`, already scaffolded as an empty placeholder)
- `portal/campaigns/campaign01/src/missions/` — first placeholder mission JSON
- `portal/js/router.js` (`/mission/:id` view swapped from static placeholder to real content)

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Activity rendering (Activity Renderer — a later milestone; a mission's `activities` field may just be validated as present, not rendered)
- Scheduler, LocalStorage/persistence, Reward Engine, Discovery Log, Parent Mode, Workbook generation
- Adding missions to `campaign.json`'s `missions` array / linking Campaign → Mission navigation (may follow naturally, but isn't the stated goal)

## Success Criteria

- A placeholder mission loads and validates against `504_JSON_SCHEMA.md`'s required Mission fields.
- `/mission/:id` renders the mission's title/objective for a valid ID, and fails gracefully for an unknown one — mirroring the Campaign Loader's error handling.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Working mission loader
- One placeholder mission JSON for `campaign01`
- `/mission/:id` rendering real (if placeholder) content

## Completion Notes

Not yet started.

---

# Previous Milestone — Router (extension) — COMPLETE

## Completion Summary

Extended `router.js` with dynamic route matching so it can resolve `/campaign/:id` and `/mission/:id` in addition to the five static routes from Milestone 1.2.

Key decisions:

- **`matchRoute(path)` tries static routes first, then a small `DYNAMIC_ROUTES` pattern list** (`/campaign/:id`, `/mission/:id`), returning a tagged `{ kind: 'static' | 'dynamic', ... }` result — keeping the existing static route table/nav generation in `nav.js` completely unchanged.
- **`/campaigns` (Campaign Select) was refactored into a list of cards linking to `/campaign/:id`**, rather than rendering one hardcoded campaign's full metadata itself. It now loops over a `KNOWN_CAMPAIGN_IDS` placeholder array (currently just `['campaign01']`) and calls the Campaign Loader once per ID — this is a deliberate stand-in for real campaign discovery, which doesn't exist yet (no manifest/Asset Manager), called out in a comment rather than silently assumed.
- **`/campaign/:id` (Campaign Overview) reuses `loadCampaign(id)` with the `:id` param directly** — this is the same rendering logic the old hardcoded `/campaigns` view had, just parameterized, so an unknown campaign ID fails through the Campaign Loader's existing graceful-error path with no new error handling needed.
- **`/mission/:id` renders a placeholder message** ("Mission Engine arrives in a later milestone") rather than 404ing, since the route should exist and be linkable even though no Mission Engine or mission JSON exists yet.
- Dynamic routes are intentionally excluded from nav highlighting (`updateActiveNavLink` only matches static nav links) — there's no "Campaigns" tab that should stay visually active while viewing a specific campaign's overview, since that's a drill-down page rather than a sibling top-level page.

## Manual Testing Performed

Served `portal/` locally and drove it with Playwright:

- `#/campaigns` renders a card for `campaign01` with a link to `#/campaign/campaign01`; clicking it navigates to the Campaign Overview and renders full metadata (title used as the page heading and `<title>`).
- Deep-linking directly to `#/campaign/campaign01` renders the same content without needing to click through.
- `#/campaign/does-not-exist` shows the graceful "No campaign could be loaded" fallback with the specific not-found message, no crash.
- `#/mission/M01` renders the Mission Engine placeholder message with the correct page title.
- Browser back button after a click-through correctly restores Campaign Select.
- Regression pass on all four pre-existing static routes (Home, Discovery Log, Explorer Profile, Settings) plus the unknown-route 404 fallback — nav links, `aria-current`, and content all still correct.
- Zero `pageerror`/console errors across every case.

## Verification

- `/campaign/:id` resolves the ID, calls the Campaign Loader, and renders metadata or the graceful failure fallback. ✅
- The static `/campaigns` route links to `/campaign/campaign01` rather than hardcoding metadata rendering itself. ✅
- Unknown campaign IDs fail gracefully, reusing the Campaign Loader's existing error path. ✅
