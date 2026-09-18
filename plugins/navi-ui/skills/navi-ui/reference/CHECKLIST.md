# Before reporting frontend work done

Run through this. It takes a minute and catches the things that make a UI feel
unfinished.

## Tokens
- [ ] No literal hex colours, `rgb()`, `px` spacing or font sizes in new CSS.
- [ ] Any new colour is a `var(--*)` token, so it follows the palette.

## Readability
- [ ] Ran `scripts/contrast-audit.js` — **zero** contrast failures.
- [ ] Checked in light **and** dark.
- [ ] Checked under at least `harbor` (default) and `graphite`.
- [ ] No text dimmed with `opacity`; lighter text uses `--muted` / `--faint`.
- [ ] Nothing under 11px; body text is 14px.
- [ ] Symbols and shortcuts are spelled out for someone who doesn't already
      know them.
- [ ] Numbers use `class="num"`.

## States
- [ ] Hover, `:focus-visible`, active, disabled all visible.
- [ ] Empty state exists and offers the action that fills it.
- [ ] Error state says what failed and what to do.
- [ ] Loading state uses `.skeleton`, not a spinner on a blank page.

## Operability
- [ ] Icon-only buttons have `aria-label`.
- [ ] Inputs and selects have a label or `aria-label`.
- [ ] Sortable headers have `aria-sort`; current page has `aria-current`.
- [ ] Hit targets ≥24×24px.
- [ ] Tooltips near the top of the viewport use `data-tip-pos="bottom"`;
      near a side edge, `data-tip-align`.
- [ ] Keyboard: Tab order sane, Escape closes overlays.

## Layout
- [ ] Works at 380px wide — no horizontal page scroll.
- [ ] Tables are inside `.table-wrap`.
- [ ] Nothing important is hidden at narrow widths.

## Restraint
- [ ] Exactly one `btn-primary` per view.
- [ ] No new component that an existing class already covers.
- [ ] Any genuinely new component is documented in `COMPONENTS.md`.
