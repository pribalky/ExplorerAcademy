# helpers.py — Shared infrastructure for Explorer Academy's smoke-test suite.
#
# Each test_*.py file is a standalone script, not a pytest test — Playwright
# is already an established engineering dependency (scripts/build_workbook.py
# uses it for PDF rendering), but pytest is not used anywhere in this repo,
# and this suite is simple enough not to need a framework. Every test file
# defines its own run() -> bool, printing its own PASS/FAIL lines; run_all.py
# discovers and aggregates them.
#
# executable_path points at this environment's pre-installed Chromium
# (see the project's own environment notes) rather than relying on
# `playwright install`, which is not expected to be run here.

import contextlib
import http.client
import os
import socket
import subprocess
import sys
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTAL_DIR = os.path.join(REPO_ROOT, "portal")
CHROMIUM_PATH = os.environ.get("EXPLORER_ACADEMY_CHROMIUM", "/opt/pw-browsers/chromium")


def _find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def _wait_for_server(port, timeout=10):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            conn = http.client.HTTPConnection("localhost", port, timeout=1)
            conn.request("GET", "/index.html")
            response = conn.getresponse()
            if response.status == 200:
                return
        except (ConnectionRefusedError, OSError):
            pass
        time.sleep(0.2)
    raise RuntimeError(f"Local server on port {port} did not respond within {timeout}s.")


@contextlib.contextmanager
def local_server():
    """Serves portal/ over HTTP for the duration of the `with` block, yielding its base URL."""
    port = _find_free_port()
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--directory", PORTAL_DIR],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        _wait_for_server(port)
        yield f"http://localhost:{port}"
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()


def launch_browser(playwright):
    return playwright.chromium.launch(executable_path=CHROMIUM_PATH)


def report(label, condition):
    """Prints a PASS/FAIL line and returns the condition, so callers can
    accumulate `ok = report(...) and ok` without a separate branch."""
    print(("PASS: " if condition else "FAIL: ") + label)
    return condition
