## Campaign Parameters (fill in before running)

- `<source-document>` — the campaign's markdown source, e.g. `docs/50-content/501_CAMPAIGN_01.md`
- `<campaign-slug>` — the folder name under `portal/campaigns/`, e.g. `campaign01`
- `<mission-count>` — total missions the campaign document defines, e.g. `21`
- `<resources-document>` — the campaign's resource catalogue, e.g. `docs/50-content/505_RESOURCES.md`

> Campaign 01 example: `<source-document>` = `docs/50-content/501_CAMPAIGN_01.md`, `<campaign-slug>` = `campaign01`, `<mission-count>` = `21`, `<resources-document>` = `docs/50-content/505_RESOURCES.md`.

--------------------------------------------------

Read:

`<resources-document>` (existing campaign-wide resources, and any mission that already has mission-specific entries, as the pattern to replicate)
`<source-document>` (Learning Focus, Story Summary per mission)
portal/campaigns/`<campaign-slug>`/src/missions/ (all `<mission-count>` compiled missions — Core/Extension/Rabbit Hole activities and `storyContext`; ground resource picks in what each mission's activities actually ask the learner to do, not just its title)

Generate:

An updated `<resources-document>` — one new mission-specific subsection per mission not yet covered, added under the relevant existing category (Reading / Videos / Interactive Websites).

Task:

For each mission without mission-specific resources yet, identify 1–3 real, verifiable resources that match that specific mission's Learning Focus and Core Activities — not generic campaign-wide defaults.

Requirements:

- **Every resource must be real and independently verifiable** — an organisation, page, article or video that actually exists and can be checked, never a plausible-sounding invented title or URL. This is the single most important rule: a fabricated resource in a children's education catalogue is worse than no resource at all.
- Follow the External Resource Validation criteria already in `<resources-document>`: free, educational, age-appropriate for the campaign's stated audience, stable/long-term available, no account required (preferred).
- Prefer providers already listed in `<resources-document>` before introducing a new provider — keeps the catalogue from sprawling. A new provider is fine if nothing existing genuinely fits, but must meet the same validation bar.
- Ground each pick in the mission's actual Core Activities and `storyContext`, not just its title.

  > Campaign 01 example: Mission 11 (The Energy Problem) needed something about how electricity is distributed and prioritised, matching its actual activity content — not just "something about electricity."

- Scope each resource explicitly to the mission(s) it fits. Most should be single-mission, not blanket "all missions" claims — that blanket scope belongs at the campaign-wide level and shouldn't be repeated per mission.
- Follow the resources document's existing per-resource template exactly (fields will vary by document, but typically: ID, Title, Author/Provider, Purpose, Used In, Core/Extension/Rabbit Hole classification, Offline Alternative).
- Every Rabbit Hole resource must map to that mission's already-defined Rabbit Hole activity (the `activities[]` entry with `schedulerCategory: "rabbitHole"` in the mission JSON) — enrich that specific activity's real-world connection; don't invent a new curiosity angle unrelated to it.
- Do not modify entries for missions that already have mission-specific resources from a prior pass.
- Do not touch anything in `src/` or `generated/` — this only extends `<resources-document>` itself.

Output:

For each mission, a short list (1–3) of real, verified resources in the resources document's established format, ready to append, plus a one-line note per resource confirming why it satisfies the validation criteria (e.g. "free, no login, stable government-run site").

> **Note (generic — applies to every campaign):** identifying real resources requires actually looking them up — via web search/fetch, or a human researcher — not generating plausible text from a language model alone. Whoever/whatever runs this prompt must verify each resource exists before adding it, the same way every other compiler in this project verifies its output (JSON validity, ID uniqueness, rendering) before considering a batch done.
>
> Campaign 01 example: this pass identified real, verified resources for all 20 remaining missions (Mission 12 already had astronomy-specific resources — NASA Space Place, Stellarium Web, NASA Eyes — from an earlier ad hoc pass that established the pattern this prompt replicates). One resource (Woodland Trust's old "Nature Detectives" URL) was found to be defunct during verification and replaced with its live successor — a concrete example of why verification, not recall, is the hard requirement above.
