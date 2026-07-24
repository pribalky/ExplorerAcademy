# test_touch_targets.py — Every interactive control meets the ~44px
# touch-target guideline at Tablet/Mobile/Desktop viewports, with zero
# horizontal overflow. Ported from the Tablet/Mobile Touch-Target CSS
# Gap milestone's verification.

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report

VIEWPORTS = {
    "Tablet (768x1024)": {"width": 768, "height": 1024},
    "Mobile (375x667)": {"width": 375, "height": 667},
    "Desktop (1440x900)": {"width": 1440, "height": 900},
}

MEASURE_JS = """
() => {
  const els = [...document.querySelectorAll('button, a, summary, label, input[type=text], input[type=file]')];
  return els.filter(el => el.getClientRects().length > 0).map(el => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, h: Math.round(r.height) };
  });
}
"""


def run():
    ok = True
    with local_server() as base, sync_playwright() as p:
        browser = launch_browser(p)

        for label, viewport in VIEWPORTS.items():
            ctx = browser.new_context(viewport=viewport)
            page = ctx.new_page()

            page.goto(f"{base}/index.html#/")
            page.wait_for_timeout(300)
            page.click("summary:has-text('+ New Explorer')")
            page.fill("input[type=text]", "Zed")
            page.fill("input[inputmode=numeric]", "3456")
            page.click("button:has-text('Create Explorer')")
            page.wait_for_timeout(400)

            for path in ["#/", "#/campaigns", "#/mission/mission01", "#/settings"]:
                page.goto(f"{base}/index.html{path}")
                page.wait_for_timeout(300)
                sizes = page.evaluate(MEASURE_JS)
                under = [s for s in sizes if s["h"] > 0 and s["h"] < 44]
                ok = report(f"[{label}] {path}: all {len(sizes)} controls >= 44px tall", len(under) == 0) and ok
                if under:
                    print("   under 44px:", under)
                overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
                ok = report(f"[{label}] {path}: no horizontal overflow", not overflow) and ok

            ctx.close()

        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
