# Vendored AI Unified Process scripts

Copied unchanged from aiup-core 3.15.0 (commit 70fe873 of the AI Unified Process marketplace) so the `spec-lint` CI
job of ADR-011 runs without the plugin. Apache-2.0, see `LICENSE` and `NOTICE` in this folder.

The folder names match the skill names, because `spec_lint.py` finds its sibling scripts by folder name. To update,
copy the `scripts/` folders of the same four skills from a newer aiup-core and change the version above.

Run locally: `python3 tools/aiup/spec-review/scripts/spec_lint.py --docs docs --strict`
