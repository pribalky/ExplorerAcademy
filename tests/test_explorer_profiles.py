# test_explorer_profiles.py — Multi-child Explorer Profile creation,
# selection, "Switch Explorer", and cross-profile save isolation
# (Milestone 11). Ported from the verification performed during that
# milestone and re-run during Phase 11 testing.

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report


def create_explorer(page, name, pin):
    page.click("summary:has-text('+ New Explorer')")
    page.fill("input[type=text]", name)
    page.fill("input[inputmode=numeric]", pin)
    page.click("button:has-text('Create Explorer')")
    page.wait_for_timeout(400)


def run():
    ok = True
    with local_server() as base, sync_playwright() as p:
        browser = launch_browser(p)
        ctx = browser.new_context()
        page = ctx.new_page()

        page.goto(f"{base}/index.html#/")
        page.wait_for_timeout(300)
        ok = report("empty-device selector shows no Explorers yet", "No Explorers set up" in page.content()) and ok

        create_explorer(page, "Jamie", "1234")
        ok = report("creating Jamie activates her immediately", "Jamie" in page.content()) and ok

        page.goto(f"{base}/index.html#/mission/mission03")
        page.wait_for_timeout(300)
        page.fill("textarea", "Jamie's own reflection.")
        page.click("button:has-text('Save to Discovery Log')")
        page.wait_for_timeout(300)

        page.click("[data-switch-explorer]")
        page.wait_for_timeout(300)
        create_explorer(page, "Alex", "5678")
        ok = report("creating Alex activates her, not Jamie", "Alex" in page.content() and "Jamie" not in page.content()) and ok

        page.goto(f"{base}/index.html#/discovery")
        page.wait_for_timeout(300)
        ok = report("Alex's Discovery Log does not show Jamie's reflection", "Jamie's own reflection" not in page.content()) and ok

        page.click("[data-switch-explorer]")
        page.wait_for_timeout(300)
        page.click("text=Jamie")
        page.wait_for_timeout(300)
        page.goto(f"{base}/index.html#/discovery")
        page.wait_for_timeout(300)
        ok = report("re-selecting Jamie shows her own reflection", "Jamie's own reflection" in page.content()) and ok

        profiles = page.evaluate("JSON.parse(localStorage.getItem('explorerAcademy.profiles'))")
        ok = report("exactly two independent profiles exist", len(profiles) == 2) and ok

        ctx.close()
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
