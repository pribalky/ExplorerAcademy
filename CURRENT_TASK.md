# CURRENT_TASK

## Phase

2 – Core Platform

## Milestone

Router (extension)

## Objective

Extend the Router built in Milestone 1.2 so it becomes campaign-aware: add dynamic `/campaign/:id` and `/mission/:id` routes now that the Campaign Loader exists, and let the Campaign Select page link to a specific campaign by ID instead of hardcoding `campaign01`.

## Inputs

- `portal/js/router.js` (Milestone 1.2 static routes)
- `portal/js/campaign-loader.js` (Milestone: Campaign Loader)
- `portal/campaigns/campaign01/src/campaign.json`

## Relevant Documentation

- `docs/60-engineering/601_HTML_ARCHITECTURE.md` (Router → Supported Routes; Campaign Overview Page; Mission Page)
- `docs/00-foundation/006_DESIGN_DECISION_LOG.md` (ADR-006 — Parent Mode stays out of this router)

## Files Expected to Change

- `portal/js/router.js`

## Implementation Plan

To be defined at the start of this milestone. Not yet started.

## Out of Scope

- Mission/activity rendering (Mission Engine — a later milestone)
- Scheduler, LocalStorage/persistence, Reward Engine, Discovery Log, Parent Mode, Workbook generation
- Loading any campaign other than `campaign01` (no second campaign exists yet)

## Success Criteria

- `/campaign/:id` resolves the ID, calls the Campaign Loader, and renders the same metadata view Milestone "Campaign Loader" already built (or its graceful failure fallback for an unknown ID).
- The existing static `/campaigns` route can link to `/campaign/campaign01` rather than the view hardcoding the ID itself.
- Unknown campaign IDs fail gracefully, reusing the Campaign Loader's existing error path.

## Manual Verification

Not yet performed — milestone not started.

## Deliverables

- Dynamic route matching in `router.js` (e.g. `/campaign/:id`)
- Campaign Select → Campaign Overview navigation via a real link

## Completion Notes

Not yet started.

---

# Previous Milestone — Campaign Loader — COMPLETE

## Completion Summary

Built `portal/js/campaign-loader.js`, the sole boundary between platform code and campaign content, and wired it into the existing `/campaigns` route in `router.js` so it has a real consumer to exercise it end-to-end.

Key decisions:

- **Validation follows `504_JSON_SCHEMA.md`'s Campaign field list** (`id`, `version`, `title`, `subtitle`, `theme`, `recommendedAge`, `estimatedDuration`, `difficulty`, `author`, `status`, `worldBibleId`, `missions`, `completionCriteria`), since that document is the canonical, "Stable" JSON contract — `503_DATA_MODEL.md`'s conceptual model (which talks about Chapters rather than a flat `missions` array) is implementation-independent and secondary for this purpose.
- **`loadCampaign(campaignId)` returns `{ ok: true, campaign }` or `{ ok: false, errors }`** rather than throwing, so a missing file, a network failure, invalid JSON, and missing required fields all funnel through one caller-friendly, non-throwing shape — satisfying `601_HTML_ARCHITECTURE.md`'s "Invalid campaigns should fail gracefully" and "never crash the application" requirements.
- **`campaign01/src/campaign.json` was filled in with placeholder-but-schema-valid metadata** (status `"draft"`, empty `missions` array) so the Loader has something real to load and validate against, since actual campaign content doesn't exist until the Phase 3 Campaign Compiler runs. No fields were invented beyond what `504_JSON_SCHEMA.md` defines.
- **The `/campaigns` route renders the loaded metadata using `textContent`/DOM construction, never `innerHTML` string interpolation of campaign data** — campaign JSON is authored content (potentially third-party or AI-generated per the project's long-term vision), not trusted markup, so this avoids an XSS vector even though today's content is self-authored.
- **Mission loading, asset loading and world-bible resolution are explicitly deferred.** The Loader validates that `worldBibleId` is present but does not yet resolve it to a file (no `world/` content exists yet), and it does not fetch individual mission JSON (Mission Engine's job, a later milestone).

## Manual Testing Performed

Served `portal/` locally and drove `#/campaigns` with Playwright (headless Chromium) through three cases:

1. **Happy path** — valid `campaign01/src/campaign.json` loads; the page renders title, subtitle, theme, recommended age, estimated duration and mission count. No console/page errors (the only network 404 was the browser's automatic `favicon.ico` request).
2. **Missing file** — temporarily renamed `campaign.json`; the page rendered "No campaign could be loaded right now." plus a specific "Campaign \"campaign01\" was not found." message, with zero page errors.
3. **Invalid data** — temporarily replaced the file with JSON missing 11 of 13 required fields; the page listed every missing field individually, with zero page errors.

All three restored the original file afterward; `git diff` confirmed no unintended changes remained.

## Verification

- Campaign Loader locates and loads `campaign01`'s metadata. ✅
- Invalid or missing campaign data fails gracefully (no crash, console warning, learner-facing fallback). ✅
- Campaign metadata is validated against the required fields in `504_JSON_SCHEMA.md` before being exposed. ✅

## Known Limitation

`fetch()` of a local JSON file may be blocked by some browsers' CORS rules when the page is opened directly via `file://` rather than served over `http://`. This is a browser platform limitation, not a bug in this code — noting it here since `601_HTML_ARCHITECTURE.md` lists "local filesystem" as a target deployment. Worth revisiting if direct `file://` use turns out to matter in practice.
