## Campaign Parameters (fill in before running)

- `<source-document>` — the campaign's markdown source, e.g. `docs/50-content/501_CAMPAIGN_01.md`
- `<campaign-slug>` — the folder name under `portal/campaigns/`, e.g. `campaign01`
- `<mission-count>` — total missions the campaign document defines, e.g. `21`

> Campaign 01 example: `<source-document>` = `docs/50-content/501_CAMPAIGN_01.md`, `<campaign-slug>` = `campaign01`, `<mission-count>` = `21`.

--------------------------------------------------

Read:

504_JSON_SCHEMA.md
`<source-document>`
portal/campaigns/`<campaign-slug>`/src/campaign.json
portal/campaigns/`<campaign-slug>`/src/missions/ (all `<mission-count>` compiled mission files)

Generate:

portal/campaigns/`<campaign-slug>`/src/world/world-bible.json
portal/campaigns/`<campaign-slug>`/src/world/characters.json
portal/campaigns/`<campaign-slug>`/src/world/locations.json
portal/campaigns/`<campaign-slug>`/src/world/timeline.json
portal/campaigns/`<campaign-slug>`/src/parent/curriculum-mapping.json
portal/campaigns/`<campaign-slug>`/src/parent/orientation.json

Requirements:

- Follow 504_JSON_SCHEMA.md exactly, matching the shape/embedding conventions already established by the Campaign and Mission Compilers.
- Do not invent fields.
- Validate all IDs, and keep them globally unique against every ID already used in `campaign.json` and all `<mission-count>` mission files.
- Do not invent new plot facts, characters, locations or curriculum content beyond what `<source-document>` states or what can be directly extracted from the already-compiled missions.
- Do not modify `campaign.json` or any `missionXX.json` file.
- Output valid, formatted JSON only, one logical entity collection per file (per 504's own File Organisation principle).

> **Why this compiler exists separately from Asset Compiler (generic, applies to every campaign):** `prompts/ASSET_COMPILER.md` explicitly forbids writing to `src/` ("Never modify anything inside src/. Only generate or update files inside generated/"). Populating `src/world/` and `src/parent/` is source compilation, not derived-asset generation — the same kind of work Campaign Compiler and Mission Compiler already do, just for the World Bible and campaign-level parent content neither of those two ever covered (Campaign Compiler is explicitly scoped to "generate only campaign.json"; Mission Compiler to "generate only missionXX.json").
>
> `src/resources/` and `src/workbook/` are deliberately **out of scope** for this compiler: a campaign document rarely gives concrete external URLs to compile directly (only generic provider preferences, which belong in Asset Compiler's own generation step), and Workbook References need page numbers that don't exist until workbook pages are generated — a chicken-and-egg problem better resolved by letting the page index live inside `generated/workbook/workbook.json` itself rather than pre-populating `src/workbook/`.

## World Bible

One `World Bible` object (`id, campaignId, characters, locations, timeline, glossary, technology, organisations`, all required per 504).

- `id` must exactly match the value `campaign.json`'s `worldBibleId` field already references (present-but-unresolved since the Campaign Loader milestone, e.g. `WORLDBIBLE-0001` for Campaign 01). Do not invent a different ID; the point is to resolve the existing reference, not create a new dangling one.
- `characters`, `locations`, `timeline` are ID references into the other three generated files, not embedded objects — these genuinely are shared/reusable campaign-level entities (unlike Activities/Beats/Rewards/Parent Guide, which stayed embedded per-mission because they're 1:1 owned).
- `glossary`: campaign terminology as it's actually used across the compiled missions — whatever recurring in-world nouns the campaign document and missions use (a personal notebook concept, an in-world organisation name, an optional-investigation concept, etc.), definitions grounded in how the source document and missions already describe them, not invented. (Campaign 01 example: Explorer Journal, Discovery Log, Rabbit Hole, Mission Control, Outpost Echo, Explorer Academy.)
- `technology`: whatever equipment/tools list the campaign document's World Bible section provides — copy directly, don't invent additions. (Campaign 01 example: Explorer Journal, Field Scanner, Sample Kits, Measuring Equipment, Maps, Communication Logs, Observation Tools.)
- `organisations`: whatever named organisation(s) the campaign document's World Bible section describes. (Campaign 01 example: Explorer Academy, The Expedition Network.)

## Characters

Extract every character listed in `<source-document>`'s Main Characters section (or equivalent) — however many there are, whatever their names. Do not compile a fixed number; compile exactly what the source document names. If the document explicitly states a character (e.g. the protagonist/learner) is deliberately undefined ("no predefined appearance/personality"), do not compile that one as a Character entity — leave it open, matching the document's own intent.

> Campaign 01 example: 501's Main Characters section names four — Director Orion, Atlas, Dr. Elara Quinn, and the Original Expedition Team (described collectively) — with the Learner explicitly excluded per 501's "no predefined appearance, gender or personality is imposed."

Each Character requires `id, name, role, description, image` (optional: `personality, knowledge, relationships, voice`) per 504.

- `image` should hold a placeholder reference string (e.g. `"CHARACTER-0001-portrait"`), not an invented visual description — Asset Compiler's later image-specification generation is the right place to produce the actual spec matching this placeholder, keeping the two compilers' responsibilities separate.
- IDs: `CHARACTER-0001` onward, in the order the source document introduces them.

## Locations

Most campaign documents won't have a dedicated "Locations" section the way they have "Main Characters" — compile these by **cross-referencing every mission's `storyContext` field** for places actually mentioned. Each requires `id, name, description` (optional: `image, coordinates, connections`) per 504. Descriptions should be grounded in what the missions actually say about each place, not invented detail.

> Campaign 01 example: 9 locations were found this way — Outpost Echo itself, the laboratory, the observatory, the Signal Tower, the storage facility, the underground geological survey area, the weather station, the communications terminal/array, and Explorer Academy Headquarters.

IDs: `LOCATION-0001` onward, in the order each location first appears across the compiled missions.

## Timeline

Derive from whatever narrative-arc structure `<source-document>`'s own overview/story-arc section defines (acts, phases, chapters — use the document's own terminology and count), rather than inventing new plot beats. Each Timeline Event requires `id, title, description, sequence` per 504.

> Campaign 01 example: 501 Part 1 defines a 4-Act Story Arc (Act I – Arrival, Act II – Investigation, Act III – Reconstruction, Act IV – Graduation), compiled as 4 Timeline Events.

IDs: `EVENT-0001` onward, sequenced in the document's own order.

## Curriculum Mapping

Most campaign documents will have a Curriculum Mapping (or equivalent) section already structured by subject in prose — compile it directly, don't re-derive it. One entity per subject **as the source document itself breaks curriculum down** — however many subjects it lists and whatever they're called; do not assume any fixed subject list or count. Required per 504: `id, country, curriculum, subject, strand, outcomes`.

> Campaign 01 example: 501 Part 6 breaks curriculum into 6 subjects (Reading, Writing, Mathematics, Science, Engineering & Design, Cross-Curricular Skills), compiled as 6 entities.

- `country`/`curriculum`: if the source document states it bridges multiple national curricula (e.g. England/Scotland) without giving country-differentiated content, default to one entity per subject rather than duplicating identical content across multiple country rows. Note this simplification in the completion notes so it isn't mistaken for an oversight later (JSON has no native comment syntax).
- `outcomes`: the source document's own "coverage includes" list for that subject. Any "primary mission emphasis" line has no dedicated field in 504 — fold it into `outcomes` as a descriptive string (e.g. `"Emphasised in Missions 1, 4, 8"`) rather than inventing a new field for mission references.

IDs: `CURRICULUM-0001` onward, one per subject.

## Orientation (campaign-level parent content)

Distinct from the per-mission `parentGuide` already embedded in each mission file (learning objectives, discussion points, preparation, assessment — mission-specific). This is whatever **campaign-wide** parent-facing content the source document provides once, not per mission — typically a welcome/introduction to the platform's role for parents, the parent's role during the campaign, a session-length guide, materials lists, do's/don'ts guidance, and an assessment philosophy, if the source document covers these. 504 has no dedicated schema entity for this — structure it as plain descriptive JSON grounded in the source document's own text and section headings, not a formal schema invented here.

> Campaign 01 example: 501 Part 6 provides "Welcome to Explorer Academy," "Your Role: Mission Control," a session-length table (30/45/60/90 minutes), materials lists (Essential/Useful/Occasionally Used), "Supporting Your Child" do's/don'ts, and an Assessment Philosophy — compiled as those same sections.

## Verification

Before considering this compiler done: confirm every new file is valid JSON; confirm no ID collides with any ID already used in `campaign.json` or any mission file (same global-uniqueness check used throughout Mission Compiler); confirm `campaign.json`'s `worldBibleId` now resolves to a real object with a matching ID; confirm `campaign-loader.js`/`mission-engine.js` still load and validate everything with **no code changes** (this is source compilation only — nothing here should require touching platform code, the same proof point established by every Campaign/Mission Compiler batch so far).
