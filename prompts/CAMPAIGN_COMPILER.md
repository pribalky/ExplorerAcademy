## Campaign Parameters (fill in before running)

- `<source-document>` — the campaign's markdown source, e.g. `docs/50-content/501_CAMPAIGN_01.md`
- `<campaign-slug>` — the folder name under `portal/campaigns/`, e.g. `campaign01`

> Campaign 01 example: `<source-document>` = `docs/50-content/501_CAMPAIGN_01.md`, `<campaign-slug>` = `campaign01`.

--------------------------------------------------

Read:

504_JSON_SCHEMA.md
`<source-document>`

Generate only:

portal/campaigns/`<campaign-slug>`/src/campaign.json

Requirements:

- Follow 504_JSON_SCHEMA.md exactly.
- Do not invent fields.
- Validate all IDs.
- Replace duplicated values with references.
- Do not generate missions.
- Output valid, formatted JSON only.

> **Note (added during the Campaign Compiler milestone, generic — applies to every campaign, not just Campaign 01):** this originally said "Follow 503_DATA_MODEL.md exactly." 503's Campaign entity is chapter-based (a Campaign requires Chapter IDs; Chapters require Mission IDs) and does not match the flat structure (`missions[]` directly on Campaign, no mandatory chapter layer) that `campaign-loader.js` and every platform milestone since have been built and tested against. Following 503 literally would produce a `campaign.json` the platform can't load.
>
> Decided with the user: 504's flat model is also the more generic choice for the platform's own goal of "new campaigns require no platform code changes" — it makes no mandatory assumption about narrative grouping (chapters/phases are optional, campaign-authored metadata, never a structure the platform is required to traverse), whereas 503's mandatory chapter requirement bakes in a structural assumption that could eventually force a schema/validation change for some future campaign shape. See `504_JSON_SCHEMA.md`'s own Session Configuration and Discovery Log Entry notes for the same reconciliation pattern applied elsewhere. This decision is platform architecture, not a Campaign 01 specific — it applies to every campaign compiled against this schema.
