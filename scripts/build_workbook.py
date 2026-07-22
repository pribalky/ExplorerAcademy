#!/usr/bin/env python3
"""Build a campaign's compiled workbook Markdown and printable PDF.

Reads only already-committed src/ and generated/ files for the given
campaign (never invents content) and writes:

  portal/campaigns/<campaign_slug>/generated/workbook/Campaign-NN-Workbook-Compiled.md
  portal/campaigns/<campaign_slug>/generated/workbook/Campaign-NN-Workbook.pdf

Usage:
    python3 scripts/build_workbook.py [campaign_slug]

campaign_slug defaults to "campaign01".

Dependencies (pip, not part of the shipped runtime — build tooling only):
    markdown
    playwright (with a Chromium browser installed)

By default this looks for Chromium at the path this repo's dev
environment provides; override with the PLAYWRIGHT_CHROMIUM_PATH
environment variable if yours differs.
"""
import json
import os
import re
import sys

import markdown
from playwright.sync_api import sync_playwright

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CHROMIUM_PATH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"


def build_markdown(campaign_dir, out_path):
    src = os.path.join(campaign_dir, "src")
    gen = os.path.join(campaign_dir, "generated")

    campaign = json.load(open(os.path.join(src, "campaign.json")))
    orientation = json.load(open(os.path.join(src, "parent", "orientation.json")))
    curriculum = json.load(open(os.path.join(src, "parent", "curriculum-mapping.json")))
    workbook_index = json.load(open(os.path.join(gen, "workbook", "workbook.json")))
    answer_guide = json.load(open(os.path.join(gen, "workbook", "answer-guide.json")))
    answer_by_mission = {m["missionId"]: m for m in answer_guide["missions"]}
    workbook_by_mission = {m["missionId"]: m for m in workbook_index["missions"]}

    out = []

    def h(level, text):
        out.append(f"{'#' * level} {text}\n")

    def p(text):
        out.append(f"{text}\n")

    def bullets(items):
        for item in items:
            out.append(f"- {item}")
        out.append("")

    # Title page
    h(1, "Explorer Academy")
    h(2, campaign["title"])
    p(f"*{campaign['subtitle']}*\n")
    p(f"**Theme:** {campaign['theme']}  ")
    p(f"**Recommended age:** {campaign['recommendedAge']}  ")
    p(f"**Estimated duration:** {campaign['estimatedDuration']}\n")
    p(
        "This workbook is a printable companion to Explorer Academy. Every "
        "mission remains fully completable with nothing but a blank "
        "notebook — nothing here is required to progress. Sections marked "
        "*optional* are exactly that.\n"
    )
    out.append("\\newpage\n")

    # Welcome & Mission Control
    h(2, "Welcome to Explorer Academy")
    p(orientation["welcome"] + "\n")
    h(3, "Your Role: Mission Control")
    p(orientation["missionControlRole"]["summary"])
    bullets(orientation["missionControlRole"]["responsibilities"])
    p(orientation["missionControlRole"]["guidance"] + "\n")
    h(4, "Questions that help without giving answers")
    bullets(orientation["missionControlRole"]["exampleQuestions"])

    # Session length & materials
    h(2, "Session Length & Materials")
    h(3, "Session length guide")
    out.append("| Available time | What the Explorer experiences |")
    out.append("|---|---|")
    for row in orientation["sessionLength"]:
        out.append(f"| {row['availableTime']} | {row['experience']} |")
    out.append("")

    h(3, "Materials")
    h(4, "Essential")
    bullets(orientation["materials"]["essential"])
    h(4, "Useful")
    bullets(orientation["materials"]["useful"])
    h(4, "Occasionally used")
    bullets(orientation["materials"]["occasionallyUsed"])

    h(3, "Supporting Your Child")
    h(4, "Helpful")
    bullets(orientation["supportingYourChild"]["helpful"])
    h(4, "Avoid")
    bullets(orientation["supportingYourChild"]["avoid"])

    h(3, "Assessment Philosophy")
    p(orientation["assessmentPhilosophy"] + "\n")
    out.append("\\newpage\n")

    # Curriculum mapping
    h(2, "Curriculum Mapping")
    p(
        "Kept out of the Explorer's own experience by design — this "
        "section is for parents and guardians only.\n"
    )
    for entry in curriculum:
        h(3, entry["subject"])
        p(f"*{entry['curriculum'].title()} ({entry['country']})* — {entry['strand']}")
        bullets(entry["outcomes"])
    out.append("\\newpage\n")

    # Per-mission sections
    h(2, "Mission-by-Mission Workbook")

    for n in range(1, len(campaign["missions"]) + 1):
        mission_id = campaign["missions"][n - 1]
        slug = f"mission{n:02d}"
        mission = json.load(open(os.path.join(src, "missions", f"{slug}.json")))

        h(2, f"Mission {n}: {mission['title']}")

        page_path = os.path.join(gen, "workbook", "pages", f"{slug}.md")
        with open(page_path) as f:
            page_lines = f.read().splitlines()
        for line in page_lines:
            if line.startswith("# "):
                continue  # the "Mission N" heading above already covers this
            elif line.startswith("## "):
                out.append("###" + line[2:])
            elif line.startswith("### "):
                out.append("####" + line[3:])
            else:
                out.append(line)
        out.append("")

        wb_entry = workbook_by_mission.get(mission_id)
        if wb_entry and wb_entry.get("printable"):
            printable_path = os.path.join(
                gen, "workbook", "printables", os.path.basename(wb_entry["printable"])
            )
            h(3, "Optional Printable")
            p(f"*{wb_entry['printableReason']}*\n")
            with open(printable_path) as pf:
                printable_lines = pf.read().splitlines()
            for line in printable_lines:
                if line.startswith("# "):
                    out.append("####" + line[1:])
                elif line.startswith("## "):
                    out.append("#####" + line[2:])
                else:
                    out.append(line)
            out.append("")

        ag_entry = answer_by_mission.get(mission_id)
        if ag_entry:
            h(3, "Answer Guide — what a strong response looks like")
            bullets(ag_entry["whatAGoodResponseIncludes"])
            if ag_entry.get("expectedOutcome"):
                p(f"**Expected outcome:** {ag_entry['expectedOutcome']}\n")
            if ag_entry.get("note"):
                p(f"*Note: {ag_entry['note']}*\n")

        out.append("\\newpage\n")

    # Closing
    h(2, "A Closing Note")
    p(
        "This workbook is optional from start to finish. A blank notebook, "
        "a pencil and a ruler are all any mission actually requires. "
        "Everything here exists to make that easier — never to replace it.\n"
    )

    with open(out_path, "w") as f:
        f.write("\n".join(out))


def markdown_to_html(md_path, title):
    with open(md_path) as f:
        md_text = f.read()

    # Swap literal \newpage markers for a placeholder before markdown
    # processing (so markdown doesn't mangle the backslash), then swap
    # in a real page-break div afterwards.
    md_text = md_text.replace("\\newpage", "<!--PAGEBREAK-->")
    html_body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])
    html_body = html_body.replace("<!--PAGEBREAK-->", '<div class="pagebreak"></div>')
    html_body = re.sub(r"<p>\s*</p>", "", html_body)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>
  @page {{ size: A4; margin: 20mm 18mm; }}
  body {{
    font-family: 'Georgia', 'Times New Roman', serif;
    color: #2C3E50;
    line-height: 1.5;
    font-size: 11.5pt;
  }}
  h1 {{ font-size: 26pt; color: #C97C3D; border-bottom: 3px solid #C97C3D; padding-bottom: 6px; }}
  h2 {{ font-size: 18pt; color: #2C3E50; margin-top: 28px; border-bottom: 1px solid #C9BCA3; padding-bottom: 4px; }}
  h3 {{ font-size: 14pt; color: #4A5A63; margin-top: 20px; }}
  h4 {{ font-size: 12pt; color: #4FB3B3; margin-top: 14px; }}
  em {{ color: #5E4B3C; }}
  table {{ border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10.5pt; }}
  th, td {{ border: 1px solid #C9BCA3; padding: 6px 10px; text-align: left; }}
  th {{ background: #F4E4C1; }}
  code {{ background: #FBF8F2; padding: 1px 5px; border-radius: 3px; font-family: monospace; }}
  pre {{ background: #FBF8F2; padding: 10px; border-radius: 4px; border: 1px solid #C9BCA3; white-space: pre-wrap; }}
  ul, ol {{ margin: 6px 0; padding-left: 24px; }}
  li {{ margin: 3px 0; }}
  hr {{ border: none; border-top: 1px solid #C9BCA3; margin: 16px 0; }}
  .pagebreak {{ page-break-before: always; }}
  h1, h2 {{ page-break-after: avoid; }}
  h3, h4 {{ page-break-after: avoid; }}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""


def render_pdf(html_path, pdf_path, chromium_executable):
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chromium_executable)
        page = browser.new_page()
        page.goto(f"file://{html_path}", wait_until="networkidle")
        page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "20mm", "bottom": "20mm", "left": "18mm", "right": "18mm"},
        )
        browser.close()


def main():
    campaign_slug = sys.argv[1] if len(sys.argv) > 1 else "campaign01"
    campaign_dir = os.path.join(REPO_ROOT, "portal", "campaigns", campaign_slug)
    workbook_dir = os.path.join(campaign_dir, "generated", "workbook")

    match = re.match(r"campaign(\d+)", campaign_slug)
    campaign_number = match.group(1) if match else campaign_slug
    base_name = f"Campaign-{campaign_number}-Workbook"

    md_path = os.path.join(workbook_dir, f"{base_name}-Compiled.md")
    html_path = os.path.join(workbook_dir, ".build-tmp.html")
    pdf_path = os.path.join(workbook_dir, f"{base_name}.pdf")

    print(f"Building compiled Markdown for {campaign_slug}...")
    build_markdown(campaign_dir, md_path)
    print(f"Wrote {md_path}")

    print("Converting to HTML...")
    html = markdown_to_html(md_path, f"Explorer Academy — {base_name}")
    with open(html_path, "w") as f:
        f.write(html)

    chromium_executable = os.environ.get("PLAYWRIGHT_CHROMIUM_PATH", DEFAULT_CHROMIUM_PATH)
    print(f"Rendering PDF via {chromium_executable}...")
    render_pdf(html_path, pdf_path, chromium_executable)
    os.remove(html_path)
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    main()
