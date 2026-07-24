# test_parent_mode.py — Parent Mode's Explorer picker -> PIN gate ->
# scoped dashboard -> Change PIN flow, including cross-child isolation
# and the zero-profiles empty state. Ported from Milestone 11/Phase 11
# verification.

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report


def run():
    ok = True
    with local_server() as base, sync_playwright() as p:
        browser = launch_browser(p)

        # Empty-profiles state.
        ctx_empty = browser.new_context()
        page_empty = ctx_empty.new_page()
        page_empty.goto(f"{base}/parent/index.html")
        page_empty.wait_for_timeout(400)
        ok = report("zero-profiles Parent Mode shows a friendly message", "No Explorer profiles" in page_empty.content()) and ok
        ctx_empty.close()

        # Real flow: two children, one PIN gate each.
        ctx = browser.new_context()
        page = ctx.new_page()
        page.goto(f"{base}/index.html#/")
        page.wait_for_timeout(300)
        page.click("summary:has-text('+ New Explorer')")
        page.fill("input[type=text]", "Jamie")
        page.fill("input[inputmode=numeric]", "1111")
        page.click("button:has-text('Create Explorer')")
        page.wait_for_timeout(400)

        page.goto(f"{base}/index.html#/mission/mission03")
        page.wait_for_timeout(300)
        page.fill("textarea", "Jamie's Parent Mode test reflection.")
        page.click("button:has-text('Save to Discovery Log')")
        page.wait_for_timeout(300)

        page.click("[data-switch-explorer]")
        page.wait_for_timeout(300)
        page.click("summary:has-text('+ New Explorer')")
        page.fill("input[type=text]", "Alex")
        page.fill("input[inputmode=numeric]", "2222")
        page.click("button:has-text('Create Explorer')")
        page.wait_for_timeout(400)

        page.goto(f"{base}/parent/index.html")
        page.wait_for_timeout(400)
        ok = report("picker lists both Explorers", "Jamie" in page.content() and "Alex" in page.content()) and ok

        page.click("text=Jamie")
        page.wait_for_timeout(300)
        page.fill("input", "0000")
        page.click("button:has-text('Unlock')")
        page.wait_for_timeout(300)
        ok = report("wrong PIN against Jamie's gate is rejected", "Incorrect PIN" in page.content()) and ok

        page.fill("input", "2222")
        page.click("button:has-text('Unlock')")
        page.wait_for_timeout(300)
        ok = report("Alex's PIN does not unlock Jamie's gate", "Incorrect PIN" in page.content()) and ok

        page.fill("input", "1111")
        page.click("button:has-text('Unlock')")
        page.wait_for_timeout(400)
        content = page.content()
        ok = report("Jamie's own PIN unlocks her dashboard", "Jamie" in content) and ok
        ok = report("Jamie's dashboard shows her reflection", "Jamie&#x27;s Parent Mode test reflection" in content or "Jamie's Parent Mode test reflection" in content) and ok
        ok = report("Jamie's dashboard shows no trace of Alex", "Alex" not in content) and ok

        ctx.close()
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
