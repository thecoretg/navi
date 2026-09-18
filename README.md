# navi

A themeable design system for admin consoles and internal tools. Plain CSS,
no framework, no build step.

- **Dense, quiet, readable.** Hairline borders over heavy shadows, one accent
  used sparingly, monospace numerals, 14px body text.
- **Six palettes**, switched with one attribute: `harbor` (default), `ember`,
  `indigo`, `moss`, `plum`, `graphite`. Each ships light and dark.
- **Contrast-checked.** Every text/background pair clears WCAG AA in all
  twelve palette/theme combinations, verified by a script in the repo.

```html
<html data-theme="dark" data-palette="ember">
```

## What's here

| Path | |
|---|---|
| `dashboard/assets/styles.css` | the design system — tokens and every component |
| `dashboard/assets/icons.js` | 40-icon inline stroke set |
| `dashboard/assets/charts.js` | SVG charts that inherit the palette |
| `dashboard/assets/audit.js` | readability audit (contrast, tooltips, labels, targets) |
| `dashboard/` | a demo console exercising the whole kit |

## The demo

Ten screens, chosen to cover the element types an internal tool actually needs:

**Overview** · stat tiles, area chart, donut, activity timeline
**Analytics** · tabs, stacked bars, ranked meters
**Customers** · data table with search, filters, sort, bulk select, pagination, drawer
**Customer detail** · master→detail, meta grid, typed event history, field diffs
**Automations** · rule builder, condition builder, dry-run banner, simulate preview
**Tasks** · drag-and-drop board
**Logs** · live stream with filters, severity tints, key=value attributes
**Components** · every element on one page, plus the palette chooser
**Settings** · tabbed forms, switches, invoices, danger zone
**Sign in** · login, two-factor, forced password change

Run it:

```bash
python3 -m http.server 4173 --directory dashboard
```

## Using it in another project

Invoke the `navi-ui` skill and ask it to adopt navi. It will ask which
palette you want, copy the stylesheet in, wire the fonts and theme attributes,
and add the rule to that project's `CLAUDE.md` so later changes stay consistent.
