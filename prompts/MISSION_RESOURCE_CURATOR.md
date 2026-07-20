Read:

docs/50-content/505_RESOURCES.md (existing campaign-wide resources, and Mission 12's entries as the pattern to replicate)
docs/50-content/501_CAMPAIGN_01.md (Learning Focus, Story Summary per mission)
portal/campaigns/campaign01/src/missions/mission01.json–mission21.json (Core/Extension/Rabbit Hole activities and storyContext — ground resource picks in what each mission's activities actually ask the learner to do, not just its title)

Generate:

An updated docs/50-content/505_RESOURCES.md — one new mission-specific subsection per mission not yet covered (all except Mission 12, which already has NASA Space Place / Stellarium Web / NASA Eyes as the template), added under the relevant existing category (Reading / Videos / Interactive Websites).

Task:

For each of the 20 remaining missions, identify 1–3 real, verifiable resources that match that specific mission's Learning Focus and Core Activities — the same way Mission 12 got astronomy-specific resources instead of generic campaign-wide ones.

Requirements:

- **Every resource must be real and independently verifiable** — an organisation, page, article or video that actually exists and can be checked, never a plausible-sounding invented title or URL. This is the single most important rule: a fabricated resource in a children's education catalogue is worse than no resource at all.
- Follow the External Resource Validation criteria already in 505_RESOURCES.md: free, educational, child-appropriate (age 9–10 / Primary 5), stable/long-term available, no account required (preferred).
- Prefer providers already listed in 505_RESOURCES.md (BBC Bitesize, Oak National Academy, The Royal Institution, DK Find Out!, National Geographic Kids, Met Office, British Geological Survey, PhET, GeoGebra, Scratch) before introducing a new provider — keeps the catalogue from sprawling. A new provider is fine if nothing existing genuinely fits, but must meet the same validation bar.
- Ground each pick in the mission's actual Core Activities and `storyContext`, not just its title. Example: Mission 11 (The Energy Problem) needs something about how electricity is distributed and prioritised, matching `ACTIVITY-0063`–`0066`'s actual content — not just "something about electricity."
- Scope each resource explicitly to the mission(s) it fits. Most should be single-mission, like Mission 12's, not blanket "Missions 1–21" claims — that blanket scope is already used at the campaign-wide level (BBC Bitesize, Oak National Academy) and shouldn't be repeated per mission.
- Follow the existing per-resource template exactly: ID, Title, Author/Provider, Purpose, Used In (mission number), Core/Extension/Rabbit Hole classification, Offline Alternative.
- Every Rabbit Hole resource must map to that mission's already-defined Rabbit Hole activity (the `activities[]` entry with `schedulerCategory: "rabbitHole"` in the mission JSON) — enrich that specific activity's real-world connection; don't invent a new curiosity angle unrelated to it.
- Do not modify Mission 12's existing entries.
- Do not touch anything in `src/` or `generated/` — this only extends `505_RESOURCES.md` itself.

Output:

For each mission, a short list (1–3) of real, verified resources in the established format, ready to append to `505_RESOURCES.md`, plus a one-line note per resource confirming why it satisfies the validation criteria (e.g. "free, no login, stable UK government site").

> **Note:** identifying real resources requires actually looking them up — via web search/fetch, or a human researcher — not generating plausible text from a language model alone. Whoever/whatever runs this prompt must verify each resource exists before adding it, the same way every other compiler in this project verifies its output (JSON validity, ID uniqueness, rendering) before considering a batch done.
