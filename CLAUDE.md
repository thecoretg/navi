# navi

navi is a themeable admin/console design system, shipped as a Claude Code
plugin. This repo is both the **marketplace** and the **plugin source**.

```
.claude-plugin/marketplace.json     the marketplace (lists the plugin)
plugins/navi-ui/
  .claude-plugin/plugin.json        the plugin manifest
  skills/navi-ui/                   the skill Claude loads
    SKILL.md                        adoption flow + rules
    assets/navi.css                 THE KIT — single source of truth
    assets/{icons,charts}.js        optional dependency-free helpers
    reference/*.md                  principles, components, palettes, checklist
    scripts/contrast-audit.js       readability audit
  demo/                             reference console using every component
```

There is no second copy of anything. `assets/navi.css` is the kit; the demo
links to it directly.

## Frontend

This project uses navi. Before writing or changing any frontend code — markup,
styles, components, pages — invoke the `navi-ui` skill and follow it. Do not
introduce other CSS frameworks, component libraries, raw hex colours or ad-hoc
spacing values. The palette is recorded in `.navi.json`; do not change it
without being asked.

## Changing the kit

1. Edit `plugins/navi-ui/skills/navi-ui/assets/navi.css`.
2. If you add a component, document it in `reference/COMPONENTS.md`.
3. Run the audit on the demo — zero failures, both themes, all six palettes.
4. **Bump `version` in both manifests** (`plugin.json` and
   `marketplace.json`) — they must match. Installed copies only update when
   that string changes, so an unbumped change ships to nobody.

## Commits

- **Conventional Commits**, with a scope: `feat(logs): …`, `fix(table): …`,
  `docs(readme): …`, `style(tokens): …`, `refactor(charts): …`, `chore: …`.
- **Subject line only.** No body, no bullet list, no "why" paragraph. If a
  change needs explaining at length, it should be more than one commit.
- Short but descriptive — say what changed, not that something changed.
  Imperative mood, lowercase after the colon, no trailing period. Aim for
  under ~70 characters.
- The Claude attribution trailer is the one thing that may follow the subject;
  a trailer is not a description.

```
feat(palettes): add harbor, indigo, moss, plum and graphite
fix(switch): give the thumb a box so the toggle actually slides
docs(skill): document the first-run palette prompt
```

Not this:

```
Update stuff
fix: fixed a bug
feat(logs): add filters

Adds level and source filters to the log stream because the buffer was
getting hard to read...
```

## Running the demo

```bash
python3 -m http.server 4173 --directory plugins/navi-ui
```

Then open http://localhost:4173/demo/. ES modules need a server; `file://`
will not work.

## Auditing

In the browser console on any demo page:

```js
const s = await fetch('../skills/navi-ui/scripts/contrast-audit.js').then(r => r.text());
(0, eval)(s);
await naviAudit({ allPalettes: true });
```

Zero failures is the bar, on every page, in both themes, across all six
palettes. Run it before calling any UI change done.

## Validating the plugin

```bash
claude plugin validate ./plugins/navi-ui   # plugin manifest
claude plugin validate .                   # marketplace manifest
```

Both must pass before committing a manifest change.
