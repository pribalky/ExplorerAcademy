# test_missions.py — Mission loading, reflection saving to the Discovery
# Log, and Save State surviving a full page reload. Ported from Phase 11
# testing's Save State checks.

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

        page.goto(f"{base}/index.html#/")
        page.wait_for_timeout(300)
        page.click("summary:has-text('+ New Explorer')")
        page.fill("input[type=text]", "River")
        page.fill("input[inputmode=numeric]", "4321")
        page.click("button:has-text('Create Explorer')")
        page.wait_for_timeout(400)

        page.goto(f"{base}/index.html#/mission/mission01")
        page.wait_for_timeout(300)
        ok = report("mission01 loads its title", page.query_selector("h2").inner_text().strip() != "") and ok

        page.fill("textarea", "A recorded reflection for regression testing.")
        page.click("button:has-text('Save to Discovery Log')")
        page.wait_for_timeout(300)
        feedback = page.inner_text("p[role=status]")
        ok = report("reflection save shows confirmation", "Discovery Log" in feedback or "Saved" in feedback or feedback.strip() != "") and ok

        page.reload()
        page.wait_for_timeout(300)
        page.goto(f"{base}/index.html#/")
        page.wait_for_timeout(300)
        ok = report("active Explorer survives a full reload", "River" in page.content()) and ok

        page.goto(f"{base}/index.html#/discovery")
        page.wait_for_timeout(300)
        ok = report("Discovery Log shows the saved reflection after reload", "A recorded reflection for regression testing." in page.content()) and ok

        ctx.close()
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
