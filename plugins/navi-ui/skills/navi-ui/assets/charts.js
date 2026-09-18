/* Hand-rolled SVG charts — no dependencies, fully themeable via CSS vars.
   Every chart returns an HTML string. Hover behaviour is delegated in app.js
   through [data-tip-html] hit areas. */

const niceMax = v => {
  const mag = Math.pow(10, Math.floor(Math.log10(v || 1)));
  return Math.ceil(v / mag * 2) / 2 * mag;
};

const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

// Catmull-Rom → cubic bezier for gently smoothed lines
const smooth = pts => {
  if (pts.length < 3) return path(pts);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/* ---- area / line chart ---- */
export function areaChart({ labels, series, height = 230, fmt = v => v, area = true, curve = true }) {
  const W = 760, H = height, pad = { t: 14, r: 12, b: 26, l: 40 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const max = niceMax(Math.max(...series.flatMap(s => s.points)) * 1.12);
  const x = i => pad.l + (labels.length === 1 ? iw / 2 : i * iw / (labels.length - 1));
  const y = v => pad.t + ih - (v / max) * ih;
  const ticks = 4;
  const uid = 'c' + Math.random().toString(36).slice(2, 8);

  let svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img"><defs>`;
  series.forEach((s, i) => {
    svg += `<linearGradient id="${uid}g${i}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${s.color}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`;
  });
  svg += `</defs>`;

  for (let t = 0; t <= ticks; t++) {
    const v = max * t / ticks, yy = y(v);
    svg += `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/>
      <text class="axis-text" x="${pad.l - 8}" y="${yy + 3}" text-anchor="end">${fmt(v)}</text>`;
  }
  labels.forEach((l, i) => {
    svg += `<text class="axis-text" x="${x(i)}" y="${H - 8}" text-anchor="middle">${l}</text>`;
  });

  series.forEach((s, si) => {
    const pts = s.points.map((v, i) => [x(i), y(v)]);
    const d = curve ? smooth(pts) : path(pts);
    if (area) {
      svg += `<path d="${d} L${x(pts.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z" fill="url(#${uid}g${si})" class="animate-fade" style="animation-delay:${300 + si * 90}ms"/>`;
    }
    svg += `<path class="series-line animate-draw" style="--len:2400;animation-delay:${si * 120}ms" d="${d}" stroke="${s.color}"/>`;
    pts.forEach((p, i) => {
      svg += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--surface)" stroke="${s.color}" stroke-width="2"
        class="pt animate-fade" data-i="${i}" style="animation-delay:${500 + i * 30}ms;opacity:0"/>`;
    });
  });

  labels.forEach((l, i) => {
    const tip = `<b>${l}</b>` + series.map(s =>
      `<div><span class="k">${s.name}</span> <span class="v">${fmt(s.points[i])}</span></div>`).join('');
    const w = iw / labels.length;
    svg += `<rect class="hit" x="${x(i) - w / 2}" y="${pad.t}" width="${w}" height="${ih}" fill="transparent"
      data-i="${i}" data-tip-html="${encodeURIComponent(tip)}"/>`;
  });
  svg += `<line class="hover-line" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" style="opacity:0"/>`;
  svg += `</svg>`;
  return `<div class="chart-host" data-xs="${labels.map((_, i) => x(i)).join(',')}">${svg}</div>`;
}

/* ---- vertical bars (grouped or stacked) ---- */
export function barChart({ labels, series, height = 230, fmt = v => v, stacked = false }) {
  const W = 760, H = height, pad = { t: 14, r: 12, b: 26, l: 40 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const totals = labels.map((_, i) => series.reduce((a, s) => a + s.points[i], 0));
  const max = niceMax((stacked ? Math.max(...totals) : Math.max(...series.flatMap(s => s.points))) * 1.12);
  const y = v => pad.t + ih - (v / max) * ih;
  const slot = iw / labels.length;
  const bw = stacked ? Math.min(34, slot * .5) : Math.min(16, slot * .5 / series.length);

  let svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">`;
  for (let t = 0; t <= 4; t++) {
    const yy = y(max * t / 4);
    svg += `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/>
      <text class="axis-text" x="${pad.l - 8}" y="${yy + 3}" text-anchor="end">${fmt(max * t / 4)}</text>`;
  }
  labels.forEach((l, i) => {
    const cx = pad.l + slot * i + slot / 2;
    svg += `<text class="axis-text" x="${cx}" y="${H - 8}" text-anchor="middle">${l}</text>`;
    let acc = 0;
    series.forEach((s, si) => {
      const v = s.points[i];
      const h = Math.max(2, (v / max) * ih);
      const bx = stacked ? cx - bw / 2
        : cx - (series.length * bw + (series.length - 1) * 3) / 2 + si * (bw + 3);
      const by = stacked ? y(acc + v) : y(v);
      svg += `<rect class="bar animate-rise" x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw}" height="${h.toFixed(1)}"
        rx="3" fill="${s.color}" style="animation-delay:${i * 45 + si * 20}ms"/>`;
      acc += v;
    });
    const tip = `<b>${l}</b>` + series.map(s =>
      `<div><span class="k">${s.name}</span> <span class="v">${fmt(s.points[i])}</span></div>`).join('');
    svg += `<rect class="hit" x="${pad.l + slot * i}" y="${pad.t}" width="${slot}" height="${ih}" fill="transparent"
      data-tip-html="${encodeURIComponent(tip)}"/>`;
  });
  svg += `</svg>`;
  return `<div class="chart-host">${svg}</div>`;
}

/* ---- donut ---- */
export function donutChart({ items, height = 210, centerLabel = '', centerValue = '' }) {
  const S = height, cx = S / 2, cy = S / 2, r = S * .38, sw = S * .13;
  const total = items.reduce((a, d) => a + d.value, 0);
  const C = 2 * Math.PI * r;
  let off = 0;
  let svg = `<svg class="chart" viewBox="0 0 ${S} ${S}" style="max-height:${height}px;margin:0 auto" role="img">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line-soft)" stroke-width="${sw}"/>`;
  items.forEach((d, i) => {
    const frac = d.value / total, len = frac * C;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${sw}"
      stroke-dasharray="${len - 2} ${C - len + 2}" stroke-dashoffset="${-off}" stroke-linecap="butt"
      transform="rotate(-90 ${cx} ${cy})" class="seg-arc animate-fade" style="animation-delay:${i * 90}ms"
      data-tip-html="${encodeURIComponent(`<b>${d.label}</b><div><span class="v">${d.value.toLocaleString()}</span> <span class="k">· ${(frac * 100).toFixed(1)}%</span></div>`)}"/>`;
    off += len;
  });
  svg += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" style="font-family:var(--font-mono);font-size:${S * .13}px;fill:var(--ink);letter-spacing:-.03em">${centerValue}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" style="font-size:10px;fill:var(--faint);letter-spacing:.1em;text-transform:uppercase">${centerLabel}</text></svg>`;
  return `<div class="chart-host">${svg}</div>`;
}

/* ---- sparkline ---- */
export function sparkline(points, color = 'var(--chart-1)', w = 132, h = 44, fluid = false) {
  const min = Math.min(...points), max = Math.max(...points);
  const x = i => i * w / (points.length - 1);
  const y = v => h - 3 - ((v - min) / ((max - min) || 1)) * (h - 8);
  const pts = points.map((v, i) => [x(i), y(v)]);
  const uid = 's' + Math.random().toString(36).slice(2, 7);
  const size = fluid
    ? `width="100%" height="100%" preserveAspectRatio="none" style="display:block"`
    : `width="${w}" height="${h}"`;
  return `<svg ${size} viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <defs><linearGradient id="${uid}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity=".20"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${smooth(pts)} L${w} ${h} L0 ${h} Z" fill="url(#${uid})"/>
    <path d="${smooth(pts)}" fill="none" stroke="${color}" stroke-width="1.6"
      stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  </svg>`;
}

/* ---- horizontal ranked bars ---- */
export function rankBars(items, { fmt = v => v + '%', color = 'var(--chart-2)' } = {}) {
  const max = Math.max(...items.map(i => i.value));
  return `<div class="stack gap4">` + items.map((d, i) => `
    <div class="stack gap2">
      <div class="row spread" style="font-size:var(--text-sm)">
        <span>${d.label}</span>
        <span class="num muted">${fmt(d.value)}</span>
      </div>
      <div class="meter"><i style="width:${(d.value / max * 100).toFixed(1)}%;background:${color};animation-delay:${i * 60}ms"></i></div>
    </div>`).join('') + `</div>`;
}
