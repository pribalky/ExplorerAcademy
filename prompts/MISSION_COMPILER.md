## Campaign Parameters (fill in before running)

- `<source-document>` — the campaign's markdown source, e.g. `docs/50-content/501_CAMPAIGN_01.md`
- `<campaign-slug>` — the folder name under `portal/campaigns/`, e.g. `campaign01`
- `<mission-count>` — total missions the campaign document defines, e.g. `21`

> Campaign 01 example: `<source-document>` = `docs/50-content/501_CAMPAIGN_01.md`, `<campaign-slug>` = `campaign01`, `<mission-count>` = `21`.

--------------------------------------------------

Read:

504_JSON_SCHEMA.md
`<source-document>`
portal/campaigns/`<campaign-slug>`/src/missions/ (any already-compiled mission — read one as a reference pattern for shape/conventions before compiling more)

Generate:

portal/campaigns/`<campaign-slug>`/src/missions/missionXX.json (one file per mission, e.g. mission02.json)

Requirements:

- Follow 504_JSON_SCHEMA.md exactly.
- Include all mission metadata (id, campaignId, missionNumber, title, storyChapter, estimatedTime, difficulty, completionCriteria).
- Include mission beats: all 8 canonical types (HOOK, MYSTERY, INVESTIGATION, DISCOVERY, CHALLENGE, BREAKTHROUGH, REFLECTION, CLIFFHANGER), each with sequence/narrativeText/trigger, restructured from the mission's own Story Summary/Core Activities/Story Outcome — never inventing new plot facts beyond what `<source-document>` states.
- Include all activities (Core, Extension, Rabbit Hole from `<source-document>`'s own lists for that mission) as full embedded objects, not ID references.
- Include scheduling categories (`schedulerCategory`: core/extension/rabbitHole) and a numeric `duration` (minutes) on every activity — see Duration Tuning below.
- Include one reward, grounded in that mission's actual Story Outcome where possible.
- Include one reflection prompt, grounded in that mission's Learning Focus/Core Activities.
- Include a parentGuide (id, learningObjectives, discussionPoints, preparation, assessment) — learningObjectives drawn from `<source-document>`'s own Learning Focus list.
- Validate all IDs, and keep them globally unique across the whole campaign (see ID Numbering below).
- Reference shared campaign entities by ID (`storyChapter`, `campaignId`) rather than duplicating their content.
- Output valid, formatted JSON only.

> **Note (added during the Mission Compiler milestone, generic — applies to every campaign):** this originally said "Follow 503_DATA_MODEL.md exactly" and "Reference shared campaign entities by ID" without qualifying which entities count as "shared." 503's Mission requires `Beat IDs`/`Activity IDs` — references to separate entities — which conflicts with 504's embedded-object Mission schema that `mission-engine.js`/`activity-engine.js`/`scheduler.js`/`reward-engine.js` already consume.
>
> Decided with the user, re-verifying rather than assuming the Campaign Compiler decision carries over: Activities/Beats/Rewards/Parent Guide are always 1:1 mission-owned in both 503 and actual campaign content — never shared or reused across missions — so embedding them (504's approach) isn't a structural trade-off, just the natural shape. This holds for any campaign, not just this one. "Reference shared campaign entities by ID" now means genuinely campaign-level entities only: `storyChapter` and `campaignId`. Nothing else on a Mission should be a bare ID reference.
>
> **`parentGuide` was missing from 504's own Mission field list** despite 504 defining a full Parent Guide schema elsewhere and 503 saying it's "Referenced by Missions" — added as a required embedded field; `mission-engine.js`'s validation was extended to match. It must never be rendered to the learner (ADR-006, Hidden Parent Mode) — verify this by searching the rendered Mission page's text for parentGuide content, not just by inspecting the code.

## ID Numbering

IDs are sequential and global across the whole campaign, not restarted per mission. Continue from the highest ID already used in previously compiled missions:

- `MISSION-####` — one per mission, matching `campaign.json`'s `missions[]` order.
- `ACTIVITY-####` — continue sequentially across every mission's activities (check the last compiled mission file for the next available number).
- `REWARD-####`, `PARENTGUIDE-####` — one each per mission, same continue-the-sequence rule.

> Campaign 01 example: Mission 1 used `ACTIVITY-0001`–`0007`; Mission 2 continued from `ACTIVITY-0008`. This is an illustration of the pattern, not a fixed starting point for other campaigns — always check the actual last-used number.

## Duration Tuning

Not arbitrary — durations should make the Scheduler's four bands (30/45/60/90 minutes) behave meaningfully for every mission:

- Core activities should sum to ~30 minutes, so the 30-minute band is genuinely self-contained (not just "core regardless of overrun").
- Extension activities should be sized (~15 minutes each) so the 45-minute band includes roughly one and the 60-minute band includes all of them.
- Rabbit Hole activities (~10 minutes) should only clear the budget at the 90-minute band.

This convention is campaign-agnostic — it follows from `scheduler.js`'s actual band logic, not from any one campaign's specific activity counts.

## Activity Type

`type` and `category` must be drawn from 504_JSON_SCHEMA.md's fixed Activity Type enum — `reading, writing, mathematics, science, engineering, drawing, observation, experiment, research, discussion, reflection, creative, outdoor` — not invented. `category` currently mirrors `type` (no separate enum is defined for it in 504 — see 504's own note on this).

## Verification

Before considering a mission done: confirm it loads and validates via `mission-engine.js` (no code changes required), confirm the Scheduler produces the intended Core/Extension/Rabbit Hole split at each duration band, and confirm no `parentGuide` content appears in the rendered Mission page. Once all `<mission-count>` missions are compiled, confirm every ID used across the whole campaign is globally unique and that every one of `campaign.json`'s `missions[]` entries resolves to a real file.
