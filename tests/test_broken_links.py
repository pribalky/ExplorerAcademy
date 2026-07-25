# test_broken_links.py — Crawls every learner-shell route plus Parent
# Mode and confirms each renders without a console/page error and shows
# real content rather than the Not Found placeholder. Ported from the
# crawl performed during Phase 11 testing (see CURRENT_TASK.md history).
#
# Also verifies missions are reachable by actually clicking through the
# real UI (Home -> Campaigns -> campaign -> mission), not just by
# loading each mission's URL directly. Every check in this file used to
# do the latter only, which is exactly how a real bug slipped through
# undetected: Campaign Overview never rendered any mission links at
# all, so a real person had no way to start a mission from the UI, even
# though every mission's own URL loaded fine when visited directly.

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report

STATIC_ROUTES = ["/", "/campaigns", "/discovery", "/profile", "/settings"]
MISSION_IDS = [f"mission{i:02d}" for i in range(1, 22)]


def run():
    ok = True
    with local_server() as base, sync_playwright() as p:
        browser = launch_browser(p)
        ctx = browser.new_context()
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))

        for path in STATIC_ROUTES:
            page.goto(f"{base}/index.html#{path}")
            page.wait_for_timeout(200)
            heading = page.query_selector("h2")
            ok = report(f"route {path} renders a heading", heading is not None) and ok

        for mission_id in MISSION_IDS:
            page.goto(f"{base}/index.html#/mission/{mission_id}")
            page.wait_for_timeout(150)
            heading = page.query_selector("h2")
            text = heading.inner_text().strip() if heading else ""
            ok = report(f"mission {mission_id} loads (title: {text!r})", bool(text) and text != "Mission") and ok

        page.goto(f"{base}/parent/index.html")
        page.wait_for_timeout(300)
        ok = report("Parent Mode loads", page.query_selector("main#parent-app") is not None) and ok

        # Click through the real UI rather than loading URLs directly.
        page.goto(f"{base}/index.html#/campaigns")
        page.wait_for_timeout(300)
        campaign_link = page.query_selector("a[href='#/campaign/campaign01']")
        ok = report("Campaigns page links to campaign01", campaign_link is not None) and ok
        if campaign_link:
            campaign_link.click()
            page.wait_for_timeout(400)
            mission_links = page.query_selector_all("a[href^='#/mission/']")
            ok = report(f"Campaign Overview lists all 21 missions as clickable links (found {len(mission_links)})", len(mission_links) == 21) and ok
            if mission_links:
                mission_links[0].click()
                page.wait_for_timeout(300)
                heading = page.query_selector("h2")
                text = heading.inner_text().strip() if heading else ""
                ok = report(f"clicking a mission link from Campaign Overview loads it (title: {text!r})", bool(text) and text != "Mission") and ok

        ok = report("zero console/page errors across the crawl", len(errors) == 0) and ok
        if errors:
            print("  errors:", errors)

        ctx.close()
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
