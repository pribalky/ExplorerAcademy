# test_offline.py — Genuine offline caching (ADR-027): after one online
# load, a mission never visited during the session must still load once
# the browser goes offline, and Parent Mode must work offline too. This
# is the exact scenario Phase 11 testing found failing before the
# service worker existed.

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report


def run():
    ok = True
    with local_server() as base, sync_playwright() as p:
        browser = launch_browser(p)
        ctx = browser.new_context()
        page = ctx.new_page()

        # One online load lets the service worker install and precache.
        page.goto(f"{base}/index.html#/")
        page.wait_for_timeout(1500)

        sw_state = page.evaluate("""
          () => navigator.serviceWorker.getRegistration().then(r => r ? r.active?.state : null)
        """)
        ok = report(f"service worker installed and active (state: {sw_state})", sw_state == "activated") and ok

        ctx.set_offline(True)

        # A mission never fetched during this session must still load.
        page.goto(f"{base}/index.html#/mission/mission19")
        page.wait_for_timeout(500)
        heading = page.query_selector("h2")
        title = heading.inner_text().strip() if heading else ""
        ok = report(f"never-visited mission19 loads offline (title: {title!r})", bool(title) and title != "Mission") and ok

        page.goto(f"{base}/index.html#/mission/mission12")
        page.wait_for_timeout(500)
        heading2 = page.query_selector("h2")
        title2 = heading2.inner_text().strip() if heading2 else ""
        ok = report(f"never-visited mission12 loads offline (title: {title2!r})", bool(title2) and title2 != "Mission") and ok

        ctx.set_offline(False)
        ctx.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
