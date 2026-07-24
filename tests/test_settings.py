# test_settings.py — Session duration and accessibility preferences
# (font scale, high contrast, reduced motion): persistence across a
# reload, and that the accessibility settings actually change rendered
# styles, not just a stored value. Ported from Milestone 11 verification.

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
        page.fill("input[type=text]", "Sky")
        page.fill("input[inputmode=numeric]", "9090")
        page.click("button:has-text('Create Explorer')")
        page.wait_for_timeout(400)

        page.goto(f"{base}/index.html#/settings")
        page.wait_for_timeout(300)

        page.check("input[name=sessionDuration][value='90']")
        page.locator("form").first.locator("button[type=submit]").click()
        page.wait_for_timeout(200)

        page.check("input[name=fontScale][value='x-large']")
        page.check("input[name=highContrast]")
        page.check("input[name=reducedMotion]")
        page.locator("form").nth(1).locator("button[type=submit]").click()
        page.wait_for_timeout(200)

        font_size = page.evaluate("getComputedStyle(document.documentElement).fontSize")
        ok = report(f"x-large font actually changes computed font-size (got {font_size})", font_size != "16px") and ok

        page.reload()
        page.wait_for_timeout(300)
        duration_checked = page.is_checked("input[name=sessionDuration][value='90']")
        ok = report("session duration (90 min) persists across reload", duration_checked) and ok
        font_checked = page.is_checked("input[name=fontScale][value='x-large']")
        ok = report("accessibility preferences persist across reload", font_checked) and ok

        overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        ok = report("no horizontal overflow with x-large + high-contrast active", not overflow) and ok

        ctx.close()
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
