# 🚀 Explorer Academy

> **Adventure first. Education follows.**

Explorer Academy is a **documentation-first**, **offline-first** educational platform that transforms learning into immersive adventures.

Children don't complete lessons.

They become **Explorers**.

Parents don't become teachers.

They become **Mission Control**.

The curriculum is never the product.

The adventure is.

---

# 🌍 Project Vision

Explorer Academy aims to build a reusable educational platform where learning is hidden beneath authentic exploration.

Instead of presenting worksheets, lessons or tests, learners investigate mysteries, perform experiments, sketch observations, solve engineering problems and make discoveries.

Every campaign should feel like joining a new expedition—not starting another school term.

---

# ✨ Why Explorer Academy?

Most educational software asks:

> "How do we make learning more engaging?"

Explorer Academy asks a different question:

> "How do we create adventures so engaging that learning happens naturally?"

That single change drives every design decision.

---

# 🎯 Goals

Explorer Academy is designed to:

- Foster lifelong curiosity
- Encourage independent learning
- Reduce parental teaching burden
- Develop scientific thinking
- Build reasoning and communication skills
- Hide curriculum behind authentic adventures
- Create a platform that grows through reusable campaigns

---

# 🧭 Core Principles

Explorer Academy is built around a small number of non-negotiable principles.

- Curiosity before instruction
- Adventure before education
- Reasoning before memorisation
- Questions before answers
- Discovery before assessment
- Independence before intervention
- Documentation before implementation

---

# 🧒 Target Audience

Primary Learner

- Age: approximately 9–10
- Independent learner
- Curious
- STEM-oriented
- Comfortable reading independently
- Enjoys solving problems
- Enjoys drawing and experiments

Secondary Audience

- Parents
- Educators
- Developers
- AI collaborators

---

# 🚧 Current Project Status

**Phase:** Implementation — Platform and Campaign 1 complete; Testing is the only phase remaining before release.

Delivered so far:

- Full platform engine (Router, Campaign Loader, Mission Engine, Activity Engine, Adaptive Scheduler, Storage Manager, Reward Engine, Discovery Log, Settings Manager)
- Campaign 1 ("Outpost Echo"), all 21 missions, production-quality
- Parent Mode: curriculum mapping, progress dashboard, per-mission assessment evidence, per-Explorer PIN gate
- Multi-child Explorer Profiles — multiple named children can share one device, each with an independent save, PIN-gated Parent Mode view, and accessibility/session-duration preferences
- Printable workbook (compiled PDF, answer guide, notebook alternatives)
- Visual assets for every mission scene, diagram and reward (flat-vector SVG, documented as a placeholder pending real illustration)

Remaining before release: Phase 11 (Testing — desktop/tablet/mobile, offline, accessibility, save state) and Phase 12 (Campaign Release).

See `TODO.md` for the full phase-by-phase status and `CURRENT_TASK.md` for what's actively in progress.

---

# 📚 Repository Structure

```text
ExplorerAcademy/
│
├── README.md
│
├── docs/
│   │
│   ├── 00-foundation/
│   ├── 10-vision/
│   ├── 20-education/
│   ├── 30-architecture/
│   ├── 40-campaigns/
│   ├── 50-content/
│   ├── 60-engineering/
│   ├── 70-process/
│   └── 90-archive/
│
├── prompts/
│
├── portal/              # the actual platform: js/, css/, components/, and
│                         # campaigns/campaignXX/{src,generated}/ — each
│                         # campaign's own workbook lives inside its own
│                         # generated/workbook/, not a shared top-level folder
│
├── scripts/              # build tooling (e.g. the workbook PDF compiler)
│
└── assets/
```

---

# 📖 Where to Start

## Visitors

Start here:

1. README.md

2. 000_PROJECT_MANIFEST.md

3. 002_PROJECT_CONTEXT.md

---

## AI Contributors

Read in the following order.

1. 000_PROJECT_MANIFEST.md

2. 002_PROJECT_CONTEXT.md

3. 006_DESIGN_DECISION_LOG.md

4. 003_DOCUMENTATION_INDEX.md

5. 004_DOCUMENT_DEPENDENCY_GRAPH.md

6. 005_GENERATION_ROADMAP.md

Repository documentation is the authoritative source of truth.

Conversation history is not.

---

# 🏗 Documentation Philosophy

Explorer Academy follows a documentation-first approach.

Documentation is treated as production code.

Every significant architectural decision is documented.

Every document has:

- a purpose
- an owner
- dependencies
- version history
- review status
- acceptance criteria

Implementation follows documentation—not the other way around.

---

# 🧠 Educational Philosophy

Explorer Academy is not designed to teach more facts.

It is designed to develop Explorers.

Explorers:

- notice details
- ask better questions
- investigate uncertainty
- communicate clearly
- test ideas
- build models
- change their minds when evidence changes

Knowledge is important.

Thinking is essential.

---

# 🛣 Roadmap

## Stage 0

✅ Foundation Documentation

---

## Stage 1

✅ Vision, Guiding Principles, Educational Philosophy and Success Criteria — drafted and in active use, though formally still Draft status per `000_PROJECT_MANIFEST.md`'s own document-approval lifecycle (documentation approval and implementation have proceeded in parallel, not sequentially)

---

## Stage 2

✅ Platform Architecture

✅ Mission Framework

✅ Reward System

✅ Parent Mode (including per-Explorer PIN gating)

---

## Stage 3

✅ Campaign Framework

✅ Mission Template

✅ Workbook Template

---

## Stage 4

✅ Campaign 1 — all 21 missions, production quality

---

## Stage 5

✅ Portal MVP — including multi-child Explorer Profiles, accessibility settings and a compiled printable workbook

---

## Stage 6

⬜ Beta Testing (Phase 11 — desktop/tablet/mobile, offline, accessibility, save state)

---

## Stage 7

⬜ Future Campaigns

---

# 🤝 Contributing

Explorer Academy is intentionally designed for collaboration between humans and AI.

Before contributing:

- Read the Manifest.
- Read the Project Context.
- Review the Decision Log.
- Understand the dependency graph.
- Preserve architectural intent.

Never silently change architectural decisions.

When proposing significant changes:

- explain the reasoning
- describe trade-offs
- update affected documentation
- record a new Architectural Decision Record (ADR)

---

# 🛠 Technology Philosophy

The project is implementation agnostic.

The architecture should support multiple implementations including:

- HTML
- Progressive Web App
- Desktop App
- Tablet App
- Printed Workbook

Technology should enable the experience.

It should never define it.

---

# 📈 Long-Term Vision

Explorer Academy is intended to support years of learning through reusable campaigns.

Campaign 1 is only the beginning.

Future campaigns should require new content—not a new platform.

---

# 🌱 Future Possibilities

Beyond Phase 11 (Testing) and Phase 12 (Campaign Release), here is where Explorer Academy could go next — split by how much each idea would actually change what kind of platform this is, versus incremental polish.

## True Differentiators

These aren't "more content" or "a nicer interface." Each one would give Explorer Academy something almost no competing educational app has, while staying fully inside its own founding rules — no leaderboards, no accounts, no ads, curiosity over completion, offline-first.

**Cross-Campaign Continuity.** Future campaigns don't just reuse the platform — they remember the Explorer. A later campaign's dialogue can reference a specific thing *this* child discovered in Campaign 1 ("Atlas recalls the blockage principle you found at Outpost Echo"), built from the Discovery Log's own recorded entries rather than a generic "welcome back." Almost no consumer ed-tech treats a child's history as story material.

**A Habits-of-Mind Portfolio, not a grade.** Parent Mode already has every ingredient: which missions used elimination-based reasoning (Mission 5), fair testing (Mission 17), fact-vs-inference distinctions (Mission 4/14). Surface this as an automatically-built "how your Explorer thinks" summary — "used evidence-elimination reasoning 4 times this term" — instead of a percentage-correct score. This is the platform's own thesis (thinking matters more than facts) made visible to the one audience currently seeing only badges and reflections.

**Real-World-Synced Investigations.** Mission 6 already ties a Core activity to the weather actually outside the window. Extending that pattern platform-wide — a Rabbit Hole that only appears when tonight's real moon phase matches the mission, a season-aware activity variant set once by a parent with no ongoing tracking — would make "authentic investigation" literal rather than simulated, without requiring any account, location service, or ongoing connectivity.

**The Explorer's Field Journal.** The workbook PDF pipeline (`scripts/build_workbook.py`) currently compiles *authored* campaign content. Pointed at a child's own Discovery Log instead, the same pipeline could produce a genuinely personal keepsake — their actual observations, hypotheses and reflections from a whole campaign, bound as a printable journal. No other platform can produce this, because it isn't templated; it's built from what the child actually wrote.

**Joint Expedition Missions.** Milestone 11's multi-child Explorer Profiles currently exist for device-sharing convenience. An occasional mission explicitly designed for two siblings' *different* recorded data to combine into one answer — one child's weather log plus another's star-chart readings solving a shared puzzle — would turn that architecture into real cooperative (never competitive) play, something almost unheard of in single-player-or-leaderboard ed-tech.

**Confidence Calibration.** Before select Core activities, ask a one-tap "how sure are you?" prediction; afterward, ask whether the Explorer was right. Calibration between confidence and outcome is one of the most research-backed predictors of durable learning transfer, and it's almost never implemented in consumer educational software, which optimises for content mastery rather than knowing-what-you-know.

## Smaller, Still Worthwhile

Not differentiators on their own, but genuine quality-of-life improvements already scoped out during Milestone 11:

- Save export/import as a downloadable file — the one practical way to back up or move a child's progress between devices without a backend.
- A broader avatar/appearance system beyond the current fixed emoji set.
- Audio narration for pre-readers or read-along support.
- A fuller design system — Milestone 11 added only the minimal CSS needed to make accessibility settings visible; `base.css`/`components.css`/`layout.css` otherwise remain close to their original placeholders.

---

# 📜 License

License to be determined.

---

# 💬 Contact

Repository discussions and documentation reviews are the preferred method for architectural conversations.

---

# ⭐ North Star

> **Explorer Academy exists to help children become the kind of people who notice, wonder, investigate and create—not simply the kind who know more facts.**

---

> **If a child finishes today's mission wanting to explore tomorrow's, Explorer Academy has succeeded.**