#!/usr/bin/env python3
"""Generate a campaign's offline-caching manifest for sw.js.

Walks a campaign's src/ and generated/ directories and writes the full
list of files (as paths relative to portal/, the service worker's own
scope) to that campaign's own generated/offline-manifest.json. sw.js
fetches this list at install time so the entire campaign -- not just
whatever pages happen to have been visited -- is available offline
after one initial load (ADR-004, Offline First).

Usage:
    python3 scripts/generate_offline_manifest.py [campaign_slug]

campaign_slug defaults to "campaign01". Re-run this whenever a
campaign's files change and bump sw.js's CACHE_VERSION so the new
manifest actually gets picked up by returning visitors.
"""
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def list_campaign_files(campaign_dir, portal_root):
    paths = []
    for subdir in ("src", "generated"):
        base = os.path.join(campaign_dir, subdir)
        if not os.path.isdir(base):
            continue
        for root, _dirs, files in os.walk(base):
            for name in files:
                if name == "offline-manifest.json":
                    continue  # never ask the manifest to cache itself mid-write
                full_path = os.path.join(root, name)
                relative_to_portal = os.path.relpath(full_path, portal_root)
                # Web-style forward slashes regardless of OS
                paths.append(relative_to_portal.replace(os.sep, "/"))
    return sorted(paths)


def main():
    campaign_slug = sys.argv[1] if len(sys.argv) > 1 else "campaign01"
    portal_root = os.path.join(REPO_ROOT, "portal")
    campaign_dir = os.path.join(portal_root, "campaigns", campaign_slug)

    if not os.path.isdir(campaign_dir):
        raise SystemExit(f"No such campaign directory: {campaign_dir}")

    files = list_campaign_files(campaign_dir, portal_root)

    out_path = os.path.join(campaign_dir, "generated", "offline-manifest.json")
    with open(out_path, "w") as f:
        json.dump({"campaignId": campaign_slug, "files": files}, f, indent=2)
        f.write("\n")

    print(f"Wrote {len(files)} file paths to {out_path}")


if __name__ == "__main__":
    main()
