# 602_LOCAL_DEVELOPMENT.md

> **Document:** Local Development Guide
>
> **Document ID:** 602
>
> **Version:** 1.0.0
>
> **Status:** Draft
>
> **Owner:** Platform Architect
>
> **Audience:** Developers, AI Contributors, Parents Running From Source
>
> **Last Updated:** 2026-07-24

---

# Purpose

Explorer Academy is vanilla HTML/CSS/JS with no build step — it just needs to be *served*, not opened directly. This document is the step-by-step guide for running it on your own machine, since none existed anywhere in the repository until now.

---

# 1. Prerequisites

- Python 3 (for the local server).
- A modern browser — Chrome, Firefox, Edge or Safari.

Nothing else installs. There is no `npm install` step: this is a deliberate platform constraint (see CLAUDE.md's Technology Constraints — no frameworks, no build tools), not something left unfinished.

```
python3 --version
# Python 3.9 or newer is plenty
```

---

# 2. Start a local server rooted at `portal/`

Every relative path in the app (`css/`, `js/`, `campaigns/`) assumes `portal/` is the web root, so serve *that* folder, not the repo root.

```
cd portal
python3 -m http.server 8000
```

Pick any free port in place of 8000. Leave this running in its own terminal tab for as long as you're using the app.

---

# 3. Open the learner shell

Visit `http://localhost:8000/index.html`. First visit, you'll land on "Who's Exploring Today?" — create an Explorer with a name, an avatar, and a 4–8 digit PIN (this PIN gates Parent Mode later, not the Explorer's own play).

**Do not open `index.html` directly from a file browser.** The app uses ES modules and a service worker, both of which browsers block under a bare `file://` address — it must load through `http://localhost`. This has never worked under `file://`, since Phase 1; see `601_HTML_ARCHITECTURE.md`'s Static Site Architecture section for the fuller correction.

---

# 4. Open Parent Mode separately

Parent Mode lives at its own address and is never linked from the learner shell — that separation is intentional (ADR-006/ADR-012), so a child never stumbles into it.

```
http://localhost:8000/parent/index.html
```

Pick the Explorer you created, enter their PIN, and you'll see curriculum mapping, the progress dashboard, and the Field Journal.

---

# 5. Try it offline (optional)

After one normal visit, a service worker (`portal/sw.js`, ADR-027) has cached the whole campaign. Open DevTools → Network → set Offline, then reload — missions you never even visited will still load.

Iterating on the platform's own code? The cache is cache-first, so edits can look like they didn't take. In DevTools → Application → Service Workers, click Unregister, then hard-reload.

---

# 6. Run the automated test suite (optional)

A checked-in Playwright suite (`tests/`) covers every core flow — profiles, missions, Settings, offline caching, Parent Mode, Save Export/Import, touch targets. It starts and stops its own server, so step 2 above isn't required first.

```
pip install playwright
playwright install chromium
python3 tests/run_all.py
```

Already have Playwright and a Chromium build? Skip straight to the last line. Point the `EXPLORER_ACADEMY_CHROMIUM` environment variable at a specific executable if the default install location isn't found. See `tests/README.md` for what each test file covers.

---

# 7. Regenerate derived campaign files (only if you edit content)

The workbook PDF and the offline-cache manifest are both generated from campaign source — re-run these after changing anything under a campaign's `src/`.

```
pip install markdown
python3 scripts/build_workbook.py campaign01
python3 scripts/generate_offline_manifest.py campaign01
```

Both default to `campaign01` if the argument is omitted. After regenerating the manifest, bump `CACHE_VERSION` in `portal/sw.js` so returning browsers actually pick up the change.

---

# Troubleshooting

**Page loads blank, or the console shows a CORS/module error.**
You're almost certainly opening the file directly instead of through the local server — recheck Section 2 and the address bar in Section 3.

**Missions, CSS, or campaign data 404.**
The server needs to be started *inside* `portal/`. If it was started from the repo root by mistake, stop it (Ctrl+C) and re-run Section 2 from the right folder.

**Changes made to the code aren't showing up.**
The service worker caches aggressively by design. Unregister it (Section 5) or do a hard reload (Shift+Reload / Cmd+Shift+R).

---

# Affected Documents

None — this is a new, standalone guide. See `601_HTML_ARCHITECTURE.md` for the architecture this setup runs, and `tests/README.md` for the test suite referenced in Section 6.
