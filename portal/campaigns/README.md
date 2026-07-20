# campaigns/

Each subfolder is one self-contained campaign package (e.g. `campaign01/`).

- `src/` — campaign source content (story, missions, world, resources, workbook, parent notes). Never overwrite source content directly.
- `generated/` — derived artefacts produced by the compilers (workbook pages, parent guides, resources, image specifications). Safe to regenerate.

See `docs/40-campaigns/401_CAMPAIGN_TEMPLATE.md` and `docs/50-content/503_DATA_MODEL.md` for the campaign data contract.
