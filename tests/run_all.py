# run_all.py — Discovers every test_*.py in this directory, runs its
# run() function, and prints an aggregate PASS/FAIL summary. See
# README.md for prerequisites and usage.

import glob
import importlib.util
import os
import sys
import time

TESTS_DIR = os.path.dirname(os.path.abspath(__file__))


def load_test_module(path):
    name = os.path.splitext(os.path.basename(path))[0]
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return name, module


def main():
    test_files = sorted(glob.glob(os.path.join(TESTS_DIR, "test_*.py")))
    results = []

    for path in test_files:
        name, module = load_test_module(path)
        print(f"\n=== {name} ===")
        start = time.time()
        try:
            passed = module.run()
        except Exception as exc:  # noqa: BLE001 - a crashed test is a failed test
            print(f"CRASHED: {exc}")
            passed = False
        elapsed = time.time() - start
        results.append((name, passed, elapsed))

    print("\n=== Summary ===")
    all_passed = True
    for name, passed, elapsed in results:
        status = "PASS" if passed else "FAIL"
        print(f"{status}  {name}  ({elapsed:.1f}s)")
        all_passed = all_passed and passed

    print(f"\n{len(results)} test files, {'all passing' if all_passed else 'FAILURES PRESENT'}.")
    return all_passed


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
