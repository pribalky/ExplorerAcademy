Read:

504_JSON_SCHEMA.md
501_CAMPAIGN_01.md
portal/campaigns/campaign01/src/campaign.json
portal/campaigns/campaign01/src/missions/mission01.json–mission21.json

Generate:

portal/campaigns/campaign01/src/world/world-bible.json
portal/campaigns/campaign01/src/world/characters.json
portal/campaigns/campaign01/src/world/locations.json
portal/campaigns/campaign01/src/world/timeline.json
portal/campaigns/campaign01/src/parent/curriculum-mapping.json
portal/campaigns/campaign01/src/parent/orientation.json

Requirements:

- Follow 504_JSON_SCHEMA.md exactly, matching the shape/embedding conventions already established by the Campaign and Mission Compilers.
- Do not invent fields.
- Validate all IDs, and keep them globally unique against every ID already used in `campaign.json` and all 21 mission files.
- Do not invent new plot facts, characters, locations or curriculum content beyond what `501_CAMPAIGN_01.md` states or what can be directly extracted from the already-compiled missions.
- Do not modify `campaign.json` or any `missionXX.json` file.
- Output valid, formatted JSON only, one logical entity collection per file (per 504's own File Organisation principle).

> **Why this compiler exists separately from Asset Compiler:** `prompts/ASSET_COMPILER.md` explicitly forbids writing to `src/` ("Never modify anything inside src/. Only generate or update files inside generated/"). Populating `src/world/` and `src/parent/` is source compilation, not derived-asset generation — the same kind of work Campaign Compiler and Mission Compiler already do, just for the World Bible and campaign-level parent content neither of those two ever covered (Campaign Compiler was explicitly scoped to "generate only campaign.json"; Mission Compiler to "generate only missionXX.json").
>
> `src/resources/` and `src/workbook/` are deliberately **out of scope** for this compiler: 501 gives no concrete external URLs to compile (only generic provider preferences, which belong in Asset Compiler's own generation step), and Workbook References need page numbers that don't exist until workbook pages are generated — a chicken-and-egg problem better resolved by letting the page index live inside `generated/workbook/workbook.json` itself rather than pre-populating `src/workbook/`.

## World Bible

One `World Bible` object (`id, campaignId, characters, locations, timeline, glossary, technology, organisations`, all required per 504).

- `id` must be `WORLDBIBLE-0001` — this is the exact value `campaign.json`'s `worldBibleId` field already references (present-but-unresolved since the Campaign Loader milestone). Do not invent a different ID; the point is to resolve the existing reference, not create a new dangling one.
- `characters`, `locations`, `timeline` are ID references into the other three generated files, not embedded objects — these genuinely are shared/reusable campaign-level entities (unlike Activities/Beats/Rewards/Parent Guide, which stayed embedded per-mission because they're 1:1 owned).
- `glossary`: campaign terminology as it's actually used across the compiled missions (Explorer Journal, Discovery Log, Rabbit Hole, Mission Control, Outpost Echo, Explorer Academy, etc.) — definitions grounded in how 501 and the missions already describe them, not invented.
- `technology`: 501's own World Bible → Technology list (Explorer Journal, Field Scanner, Sample Kits, Measuring Equipment, Maps, Communication Logs, Observation Tools) — copy directly.
- `organisations`: Explorer Academy and the Expedition Network, from 501's World Bible section.

## Characters

501's Main Characters section names four: Director Orion, Atlas, Dr. Elara Quinn, and the Original Expedition Team. **The Learner is deliberately not compiled as a Character** — 501 states "No predefined appearance, gender or personality is imposed."

Each Character requires `id, name, role, description, image` (optional: `personality, knowledge, relationships, voice`) per 504.

- `image` should hold a placeholder reference string (e.g. `"CHARACTER-0001-portrait"`), not an invented visual description — Asset Compiler's later image-specification generation is the right place to produce the actual spec matching this placeholder, keeping the two compilers' responsibilities separate.
- IDs: `CHARACTER-0001` (Orion), `CHARACTER-0002` (Atlas), `CHARACTER-0003` (Dr. Quinn), `CHARACTER-0004` (Original Expedition Team, described collectively).

## Locations

501 doesn't have a dedicated "Locations" section the way it has "Main Characters" — compile these by **cross-referencing every mission's `storyContext` field** for places actually mentioned: Outpost Echo itself, the laboratory, the observatory, the Signal Tower, the storage facility, the underground geological survey area, the weather station, the communications terminal/array. Each requires `id, name, description` (optional: `image, coordinates, connections`) per 504. Descriptions should be grounded in what the missions actually say about each place, not invented detail.

IDs: `LOCATION-0001` onward, in the order each location first appears across missions 1–21.

## Timeline

Derive from 501 Part 1's "Story Arc" section (Act I – Arrival, Act II – Investigation, Act III – Reconstruction, Act IV – Graduation) rather than inventing new plot beats. Each Timeline Event requires `id, title, description, sequence` per 504.

IDs: `EVENT-0001` onward, sequenced by Act.

## Curriculum Mapping

501 Part 6's "Curriculum Mapping" section is already structured this way in prose — compile it directly, don't re-derive it. One entity per subject (Reading, Writing, Mathematics, Science, Engineering & Design, Cross-Curricular Skills) — six entities. Required per 504: `id, country, curriculum, subject, strand, outcomes`.

- `country`/`curriculum`: 501 states the campaign is designed to "bridge curriculum differences between England and Scotland" without giving country-differentiated content — default to one entity per subject rather than duplicating identical content across `england` and `scotland` rows, since nothing in 501 actually differs between them. Note this simplification in a comment if the generated file supports one, so it isn't mistaken for an oversight later.
- `outcomes`: 501's own "Coverage includes" bullet list for that subject. Its "Primary mission emphasis: Missions X, Y, Z" line has no dedicated field in 504 — fold it into `outcomes` as a descriptive string (e.g. `"Emphasised in Missions 1, 4, 8, 12, 14, 19"`) rather than inventing a new field for mission references.

IDs: `CURRICULUM-0001` onward, one per subject.

## Orientation (campaign-level parent content)

Distinct from the per-mission `parentGuide` already embedded in each mission file (learning objectives, discussion points, preparation, assessment — mission-specific). This is the **campaign-wide** parent-facing content 501 Part 6 provides once, not per mission: "Welcome to Explorer Academy," "Your Role: Mission Control," the session-length table (30/45/60/90 minutes → what's included), materials lists (Essential/Useful/Occasionally Used), "Supporting Your Child" do's/don'ts, and Assessment Philosophy. 504 has no dedicated schema entity for this — structure it as plain descriptive JSON grounded in 501's own text, matching the shape 501 already uses (don't invent a formal schema where 504 doesn't define one).

## Verification

Before considering this compiler done: confirm every new file is valid JSON; confirm no ID collides with any ID already used in `campaign.json` or `mission01.json`–`mission21.json` (same global-uniqueness check used throughout Mission Compiler); confirm `campaign.json`'s `worldBibleId` now resolves to a real object with a matching ID; confirm `campaign-loader.js`/`mission-engine.js` still load and validate everything with **no code changes** (this is source compilation only — nothing here should require touching platform code, the same proof point established by every Campaign/Mission Compiler batch so far).
