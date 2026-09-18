# navi

Reference implementation of the **navi UI kit** — a themeable admin/console
design system. `dashboard/` is a zero-dependency demo console that exercises
every component in the kit.

## Frontend

This project uses navi. Before writing or changing any frontend code — markup,
styles, components, pages — invoke the `navi-ui` skill and follow it. Do not
introduce other CSS frameworks, component libraries, raw hex colours or ad-hoc
spacing values. The palette is recorded in `.navi.json`; do not change it
without being asked.

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

## This repo is the source of truth for the kit

`dashboard/assets/styles.css` is the kit. The skill at
`~/.claude/skills/navi-ui/assets/navi.css` is a copy. **After changing the
stylesheet here, copy it back:**

```bash
cp dashboard/assets/styles.css ~/.claude/skills/navi-ui/assets/navi.css
```

The same applies to `icons.js` and `charts.js`. If you add a component, also add
it to `~/.claude/skills/navi-ui/reference/COMPONENTS.md`.

## Running it

```bash
python3 -m http.server 4173 --directory dashboard
```

Then open http://localhost:4173. ES modules need a server; `file://` will not
work.

## Auditing

`dashboard/assets/audit.js` is a copy of the skill's readability audit. In the
browser console:

```js
const s = await fetch('assets/audit.js').then(r => r.text()); (0, eval)(s);
await naviAudit({ allPalettes: true });
```

Zero failures is the bar, on every page, in both themes, across all six
palettes. Run it before calling any UI change done.
