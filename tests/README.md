# Explorer Academy — Smoke-Test Suite

A checked-in, reusable Playwright suite covering the platform's golden
paths, so future changes get real regression coverage instead of a
one-off script written in `/tmp` and thrown away at the end of a
session (which is how every milestone through Save Export/Import and
the Tablet/Mobile touch-target CSS fix was actually verified).

## What's covered

- `test_broken_links.py` — every learner-shell route, all 21 missions,
  and Parent Mode load without console/page errors.
- `test_explorer_profiles.py` — multi-child creation, selection,
  "Switch Explorer", and save isolation between profiles.
- `test_missions.py` — mission loading, saving a reflection to the
  Discovery Log, and Save State surviving a full reload.
- `test_settings.py` — session duration and accessibility preferences
  (font scale, high contrast, reduced motion) persist and actually
  change rendered styles, not just a stored value.
- `test_save_export_import.py` — export/import round-trip across
  separate browser contexts (standing in for separate devices), PIN
  preserved via hash only, name-collision and malformed/foreign file
  rejection.
- `test_offline.py` — a mission never visited during the session still
  loads after going offline (the service worker precache, ADR-027).
- `test_parent_mode.py` — picker -> PIN gate -> scoped dashboard ->
  cross-child isolation, plus the zero-profiles empty state.
- `test_touch_targets.py` — every interactive control measures at
  least 44px tall at Tablet/Mobile/Desktop viewports, with zero
  horizontal overflow.

## Running the suite

Nothing new to install in this environment — Playwright and a
pre-installed Chromium are already present. Each test file spins up
its own `python3 -m http.server` against `portal/` on a free port and
tears it down afterward, so nothing needs to be running beforehand.

Run everything:

```
python3 tests/run_all.py
```

Run one file directly (useful while debugging a single failure):

```
python3 tests/test_missions.py
```

Each test file prints `PASS`/`FAIL` per assertion and exits non-zero on
any failure, so `run_all.py`'s exit code reflects the whole suite.

## Design notes

- **No pytest.** Playwright is already an established engineering
  dependency (`scripts/build_workbook.py` uses it for PDF rendering),
  but pytest is not used anywhere in this repo, and this suite is
  simple enough not to need a framework — each test file is a plain
  script with a `run() -> bool`.
- **Chromium only.** Matches every manual verification already
  performed across this project's history; no Firefox/WebKit matrix.
- **Not wired into CI.** Running the suite is a manual step for now —
  automating *when* it runs (a pre-commit hook, GitHub Actions, etc.)
  is a separate decision, not assumed here.
- If `/opt/pw-browsers/chromium` isn't the right path in your
  environment, set `EXPLORER_ACADEMY_CHROMIUM` to the correct
  executable path before running.
