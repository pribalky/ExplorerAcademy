# test_save_export_import.py — Save Export/Import (ADR-028): export
# round-trips into a fresh browser context standing in for a separate
# device, the original PIN keeps working (only its hash travels), a
# name collision is rejected, and a malformed/foreign file is rejected
# gracefully. Ported from that milestone's verification.

import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from playwright.sync_api import sync_playwright

from helpers import local_server, launch_browser, report


def run():
    ok = True
    with local_server() as base, sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
        browser = launch_browser(p)
        backup_path = os.path.join(tmp, "backup.json")

        # Context A: create an Explorer and export a backup file.
        ctx_a = browser.new_context()
        page_a = ctx_a.new_page()
        page_a.goto(f"{base}/index.html#/")
        page_a.wait_for_timeout(300)
        page_a.click("summary:has-text('+ New Explorer')")
        page_a.fill("input[type=text]", "Ada")
        page_a.fill("input[inputmode=numeric]", "1234")
        page_a.click("button:has-text('Create Explorer')")
        page_a.wait_for_timeout(400)

        page_a.goto(f"{base}/index.html#/settings")
        page_a.wait_for_timeout(300)
        with page_a.expect_download() as dl_info:
            page_a.click("button:has-text('Download Backup File')")
        dl_info.value.save_as(backup_path)
        with open(backup_path) as f:
            exported = json.load(f)
        ok = report("export produces the expected shape", "profile" in exported and "save" in exported) and ok
        ok = report("exported file carries a PIN hash, not the plaintext PIN", "pinHash" in exported["profile"]) and ok
        ctx_a.close()

        # Context B: fresh "device", import the backup.
        ctx_b = browser.new_context()
        page_b = ctx_b.new_page()
        page_b.goto(f"{base}/index.html#/")
        page_b.wait_for_timeout(300)
        page_b.click("summary:has-text('+ Import Explorer')")
        page_b.set_input_files("input[type=file]", backup_path)
        page_b.click("button:has-text('Import')")
        page_b.wait_for_timeout(400)
        ok = report("import activates a new Ada profile on the fresh device", "Ada" in page_b.content()) and ok

        profiles_b = page_b.evaluate("JSON.parse(localStorage.getItem('explorerAcademy.profiles'))")
        ok = report("imported profile keeps the same PIN hash", profiles_b[0]["pinHash"] == exported["profile"]["pinHash"]) and ok
        ok = report("imported profile gets a fresh local id", profiles_b[0]["id"] != exported.get("profile", {}).get("id")) and ok
        ctx_b.close()

        # Context C: a local same-name profile should reject the import.
        ctx_c = browser.new_context()
        page_c = ctx_c.new_page()
        page_c.goto(f"{base}/index.html#/")
        page_c.wait_for_timeout(300)
        page_c.click("summary:has-text('+ New Explorer')")
        page_c.fill("input[type=text]", "Ada")
        page_c.fill("input[inputmode=numeric]", "5678")
        page_c.click("button:has-text('Create Explorer')")
        page_c.wait_for_timeout(400)
        page_c.click("[data-switch-explorer]")
        page_c.wait_for_timeout(300)
        page_c.click("summary:has-text('+ Import Explorer')")
        page_c.set_input_files("input[type=file]", backup_path)
        page_c.click("button:has-text('Import')")
        page_c.wait_for_timeout(300)
        feedback = page_c.inner_text("details:has(input[type=file]) p[role=status]")
        ok = report("name collision on import is rejected with a clear message", "already exists" in feedback.lower()) and ok
        ctx_c.close()

        # Context D: malformed/foreign files are rejected gracefully.
        ctx_d = browser.new_context()
        page_d = ctx_d.new_page()
        page_d.goto(f"{base}/index.html#/")
        page_d.wait_for_timeout(300)

        bad_path = os.path.join(tmp, "bad.json")
        with open(bad_path, "w") as f:
            f.write("{not valid json")
        page_d.click("summary:has-text('+ Import Explorer')")
        page_d.set_input_files("input[type=file]", bad_path)
        page_d.click("button:has-text('Import')")
        page_d.wait_for_timeout(300)
        feedback_bad = page_d.inner_text("details:has(input[type=file]) p[role=status]")
        ok = report("malformed JSON is rejected gracefully", "not valid json" in feedback_bad.lower()) and ok

        foreign_path = os.path.join(tmp, "foreign.json")
        with open(foreign_path, "w") as f:
            json.dump({"hello": "world"}, f)
        page_d.set_input_files("input[type=file]", foreign_path)
        page_d.click("button:has-text('Import')")
        page_d.wait_for_timeout(300)
        feedback_foreign = page_d.inner_text("details:has(input[type=file]) p[role=status]")
        ok = report("foreign JSON is rejected gracefully", "not a recognised" in feedback_foreign.lower()) and ok
        ctx_d.close()

        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if run() else 1)
