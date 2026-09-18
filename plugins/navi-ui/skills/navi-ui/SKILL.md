---
name: navi-ui
description: navi is a themeable admin/console UI kit — design tokens, component classes and six colour palettes. Use it whenever building or changing any frontend in a project that has adopted navi, and when the user asks to adopt/apply/install navi, "use the navi theme", "apply our design system", or asks for a dashboard, console, admin panel, settings page, data table, log viewer, rule builder or auth screen in such a project. Once a project adopts navi, every subsequent UI change must go through this skill.
---

# navi UI

A design system for dense, readable admin consoles. It is a **stylesheet plus a
vocabulary of classes** — no framework, no build step, no dependencies. It works
with plain HTML, Go templates, React, Vue, Svelte or anything else that emits
class names.

## The rule that matters

**Never hand-write new component CSS.** navi already has a class for it.
Compose existing classes; if genuinely nothing fits, add the new component to
`navi.css` using existing tokens, and document it. Raw hex colours, ad-hoc
`px` spacing and one-off font sizes are defects, not shortcuts.

---

## 1. Decide what this invocation is

Run this check first, every time:

```bash
cat .navi.json 2>/dev/null || echo "NOT ADOPTED"
```

- **`NOT ADOPTED`** → go to §2 (first-time adoption). Ask about the palette.
- **File exists** → go to §3 (ordinary work). Do **not** ask about the palette
  again; read it from the file.

---

## 2. First-time adoption in a project

### 2a. Ask which palette — always, on first adoption

Unless the user already named one in their request, ask with `AskUserQuestion`
before writing any files. Offer exactly these, Ember first:

| Option label | Description to show |
|---|---|
| **Harbor (recommended default)** | Cool grey neutrals, deep teal accent. The house default. |
| **Ember** | Warm paper neutrals, persimmon accent. |
| **Indigo** | Slate neutrals, indigo accent. |
| **Moss** | Sage neutrals, forest green accent. |
| **Plum** | Mauve neutrals, plum accent. |
| **Graphite** | Monochrome — near-black accent in light, near-white in dark. |

If the user declines to choose or says "whatever you think", use **harbor**.
Never silently pick a non-default palette.

### 2b. Install

1. Copy `assets/navi.css` from this skill's directory into the project's
   stylesheet directory (`static/`, `public/`, `src/styles/` — match what the
   project already does). The skill's base directory is given to you when the
   skill loads; everything below is relative to it.
2. Link it, and load the two fonts. In the document `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/static/navi.css">
```

3. Set both attributes on `<html>` — **the kit renders wrong without them**:

```html
<html lang="en" data-theme="light" data-palette="harbor">
```

4. Restore the reader's theme before first paint, so there is no flash:

```html
<script>
  const t = localStorage.getItem('theme')
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.palette = localStorage.getItem('palette') || 'harbor';
</script>
```

5. Write `.navi.json` at the project root:

```json
{ "palette": "harbor", "css": "static/navi.css", "adopted": "2026-09-17" }
```

6. Append this to the project's `CLAUDE.md` (create it if absent), so every
   future session is bound by it:

```markdown
## Frontend

This project uses the **navi UI kit**. Before writing or changing any
frontend code — markup, styles, components, pages — invoke the `navi-ui`
skill and follow it. Do not introduce other CSS frameworks, component
libraries, raw hex colours or ad-hoc spacing values. The palette is recorded
in `.navi.json`; do not change it without being asked.
```

7. Tell the user, in one line, which palette is active and how to change it
   (`data-palette` on `<html>`, or ask for a different one).

### 2c. Retrofitting an existing UI

Adopt incrementally, never in one sweep: convert one screen at a time, mapping
the old markup onto navi classes, and delete the old rules for that screen
as you go. Keep the app working after every step. Do not leave two systems
styling the same element.

---

## 3. Ordinary work in an adopted project

1. Read `.navi.json` for the palette. Never re-ask.
2. Read `reference/PRINCIPLES.md`. These are requirements, not suggestions.
3. Find the component you need in `reference/COMPONENTS.md` and copy its markup.
4. Build. Compose existing classes.
5. Run the checklist in `reference/CHECKLIST.md` before you report done.

### When the user asks for something that has no component

Say so, then pick the closest existing pattern and adapt it with tokens. Adding
a new component to `navi.css` is allowed but must:

- use only existing `var(--*)` tokens — no literal colours, no literal spacing;
- work in light and dark, and in all six palettes;
- clear 4.5:1 text contrast (3:1 for ≥24px or ≥18.66px bold);
- get an entry in `reference/COMPONENTS.md`.

---

## 4. Palettes

Six presets, each two seed colours plus a five-colour chart ramp. Switch with
one attribute — nothing else changes:

```html
<html data-palette="ember">
```

`harbor` (default) · `ember` · `indigo` · `moss` · `plum` · `graphite`

Full values and the recipe for adding a seventh: `reference/PALETTES.md`.

Light and dark are independent of the palette: `data-theme="light|dark"`.
Every palette ships both, and every combination is contrast-checked.

---

## 5. Files in this skill

| Path | What it is |
|---|---|
| `assets/navi.css` | The design system. Copy into the project. |
| `assets/icons.js` | 40-icon inline stroke set (optional, dependency-free). |
| `assets/charts.js` | SVG chart generators that inherit the palette (optional). |
| `reference/PRINCIPLES.md` | The rules. Read before building. |
| `reference/COMPONENTS.md` | Markup for every component in the kit. |
| `reference/PALETTES.md` | Palette values; how to add one. |
| `reference/CHECKLIST.md` | Run before reporting work done. |
| `scripts/contrast-audit.js` | Paste into the browser console; lists every contrast, tooltip, hit-target and accessible-name failure on the page. |
| `../../demo/` | A full reference console using every component, if you want to see one assembled. |


---

## 6. Keeping the kit itself up to date

navi ships as a Claude Code plugin from the `thecoretg` marketplace
(`github.com/thecoretg/navi`). The copy of `navi.css` in a consuming project is
a **snapshot**, not a live link — updating the plugin does not restyle projects
that already adopted it.

To pull a newer kit into a project:

1. `/plugin marketplace update` then `/plugin update navi-ui`.
2. Diff the plugin's `assets/navi.css` against the project's copy.
3. Apply the changes, then run `scripts/contrast-audit.js` on the project's own
   pages before calling it done.

Never edit a project's copy of `navi.css` to add a one-off rule. Either the
change belongs in the kit — contribute it upstream — or it belongs in the
project's own stylesheet as a clearly separate layer.
