import { icon } from '../../skills/navi-ui/assets/icons.js';
import * as D from './data.js';
import { areaChart, barChart, donutChart, sparkline, rankBars } from '../../skills/navi-ui/assets/charts.js';
import { reorder } from '../../skills/navi-ui/assets/reorder.js';

const { initials, money, compact, statusMeta, columnMeta } = D;

/* ---------- shared fragments ---------- */
const head = (title, sub, actions = '') => `
  <header class="page-head row spread wrap gap4">
    <div>
      <h1 class="page-title">${title}</h1>
      ${sub ? `<p class="page-sub">${sub}</p>` : ''}
    </div>
    <div class="row gap2 wrap">${actions}</div>
  </header>`;

const stat = ({ label, value, unit = '', delta, note, spark, color = 'var(--chart-1)' }) => {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const arrow = dir === 'up' ? icon('arrowUp') : dir === 'down' ? icon('arrowDn') : '';
  return `<article class="card stat">
    <div class="stat-label eyebrow">${label}</div>
    <div class="stat-value">${value}${unit ? `<small> ${unit}</small>` : ''}</div>
    <div class="stat-foot">
      <span class="delta ${dir}">${arrow}${delta > 0 ? '+' : ''}${delta}%</span>
      <span class="muted" style="font-size:var(--text-xs)">${note}</span>
    </div>
    ${spark ? `<div class="stat-spark">${sparkline(spark, color, 160, 44, true)}</div>` : ''}
  </article>`;
};

const legend = series => `<div class="legend">${series.map(s =>
  `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`;

/* ============================================================
   OVERVIEW
   ============================================================ */
export const overview = {
  title: 'Overview',
  render: () => `
    ${head('Good afternoon, Danny', 'Here is what moved across the workspace in the last 30 days.', `
      <div class="seg" data-seg="range">
        <button>7d</button><button class="on">30d</button><button>90d</button><button>YTD</button>
      </div>
      <button class="btn btn-default" data-action="toast" data-variant="ok" data-msg="Export queued">
        ${icon('download')} Export
      </button>
      <button class="btn btn-primary" data-action="modal">${icon('plus')} New report</button>
    `)}

    <section class="grid g4" style="margin-bottom:var(--s5)">
      ${stat({ label: 'Net revenue', value: '$466k', delta: 12.4, note: 'vs. $414k prior', spark: [182,196,211,204,238,262,271,295,318] })}
      ${stat({ label: 'Active accounts', value: '2,530', delta: 6.1, note: '+146 this month', spark: [2180,2240,2265,2310,2358,2402,2451,2498,2530], color: 'var(--chart-2)' })}
      ${stat({ label: 'Net retention', value: '114', unit: '%', delta: 2.2, note: 'expansion led', spark: [104,106,105,109,110,112,111,113,114], color: 'var(--chart-3)' })}
      ${stat({ label: 'Churn risk', value: '38', unit: 'accts', delta: -9.5, note: '12 flagged today', spark: [58,54,51,49,47,44,42,40,38], color: 'var(--chart-4)' })}
    </section>

    <section class="grid g-2-1" style="margin-bottom:var(--s5)">
      <article class="card">
        <div class="card-head">
          <div><h3>Revenue composition</h3><p>Monthly recurring, in thousands</p></div>
          ${legend(D.revenueSeries.series)}
        </div>
        <div class="card-body">${areaChart({ ...D.revenueSeries, fmt: v => '$' + Math.round(v) + 'k' })}</div>
        <div class="card-foot">
          <span>Updated 4 minutes ago</span>
          <a class="row gap1" href="#/analytics" style="color:var(--accent);font-weight:500">Open analytics ${icon('arrowR', 'ico14')}</a>
        </div>
      </article>

      <article class="card">
        <div class="card-head"><div><h3>Plan mix</h3><p>Accounts by tier</p></div></div>
        <div class="card-body stack gap5">
          ${donutChart({ items: D.planMix, centerValue: '2,530', centerLabel: 'accounts' })}
          <div class="stack gap3">
            ${D.planMix.map(p => `
              <div class="row spread" style="font-size:var(--text-sm)">
                <span class="row gap2"><i class="dot" style="background:${p.color}"></i>${p.label}</span>
                <span class="num muted">${p.value.toLocaleString()}</span>
              </div>`).join('')}
          </div>
        </div>
      </article>
    </section>

    <section class="grid g-2-1">
      <article class="card">
        <div class="card-head">
          <div><h3>Top accounts</h3><p>Ranked by monthly recurring revenue</p></div>
          <a class="btn btn-ghost btn-sm" href="#/customers">View all</a>
        </div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr>
              <th>Account</th><th>Plan</th><th>Status</th><th class="r">Seats</th><th class="r">MRR</th>
            </tr></thead>
            <tbody>
              ${[...D.customers].sort((a, b) => b.mrr - a.mrr).slice(0, 6).map(c => `
                <tr>
                  <td>
                    <div class="row gap3">
                      <span class="avatar sm">${initials(c.name)}</span>
                      <div><div class="cell-primary">${c.company}</div><div class="cell-sub">${c.name}</div></div>
                    </div>
                  </td>
                  <td><span class="badge outline">${c.plan}</span></td>
                  <td><span class="badge ${statusMeta[c.status].cls}"><i class="dot"></i>${statusMeta[c.status].label}</span></td>
                  <td class="r num">${c.seats}</td>
                  <td class="r num cell-primary">${money(c.mrr)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </article>

      <div class="stack gap5">
        <article class="card">
          <div class="card-head"><div><h3>Activity</h3></div><span class="badge ok"><i class="dot pulse"></i>Live</span></div>
          <div class="card-body">
            <div class="timeline">
              ${D.activity.map(a => `
                <div class="tl-item ${a.accent ? 'accent' : ''}">
                  <div class="tl-time">${a.when}</div>
                  <div style="font-size:var(--text-sm);margin-top:2px">
                    <b style="font-weight:600">${a.who}</b> ${a.what}
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </article>

        <article class="card card-pad stack gap3">
          <div class="callout warn">
            ${icon('alert')}
            <div class="body"><b>3 invoices past due</b>Totalling $8,420 across Halcyon Foods, Stonepath and Pike &amp; Rowe.</div>
          </div>
          <button class="btn btn-default" data-action="drawer" data-id="${D.customers[3].id}">Review accounts</button>
        </article>
      </div>
    </section>`,
};

/* ============================================================
   ANALYTICS
   ============================================================ */
export const analytics = {
  title: 'Analytics',
  render: () => `
    ${head('Analytics', 'Acquisition, revenue and platform health in one view.', `
      <select class="select" style="width:auto">
        <option>All workspaces</option><option>Production</option><option>Sandbox</option>
      </select>
      <button class="btn btn-default">${icon('filter')} Filters</button>
      <button class="btn btn-default" data-action="toast" data-msg="Snapshot saved to reports">${icon('download')} Save snapshot</button>
    `)}

    <div class="tabs" data-tabs="analytics" style="margin-bottom:var(--s6)">
      <button class="on" data-tab="acq">Acquisition</button>
      <button data-tab="rev">Revenue</button>
      <button data-tab="perf">Performance</button>
    </div>

    <div data-panel="acq">
      <section class="grid g4" style="margin-bottom:var(--s5)">
        ${stat({ label: 'Trials started', value: '348', delta: 18.9, note: 'last 7 days', spark: [42,58,51,73,66,31,27] })}
        ${stat({ label: 'Trial → paid', value: '31.6', unit: '%', delta: 4.2, note: '110 conversions', spark: [12,19,14,26,22,9,8], color: 'var(--chart-3)' })}
        ${stat({ label: 'CAC', value: '$412', delta: -6.8, note: 'blended', spark: [488,470,461,448,439,424,412], color: 'var(--chart-2)' })}
        ${stat({ label: 'Payback', value: '9.4', unit: 'mo', delta: -2.1, note: 'target 12mo', spark: [12,11.6,11,10.4,10,9.7,9.4], color: 'var(--chart-4)' })}
      </section>
      <section class="grid g-2-1">
        <article class="card">
          <div class="card-head">
            <div><h3>Signups vs. conversions</h3><p>Last 7 days</p></div>
            ${legend(D.signupSeries.series)}
          </div>
          <div class="card-body">${barChart(D.signupSeries)}</div>
        </article>
        <article class="card">
          <div class="card-head"><div><h3>Channels</h3><p>Share of new accounts</p></div></div>
          <div class="card-body">${rankBars(D.channels, { color: 'var(--chart-2)' })}</div>
        </article>
      </section>
    </div>

    <div data-panel="rev" hidden>
      <section class="grid g-2-1" style="margin-bottom:var(--s5)">
        <article class="card">
          <div class="card-head">
            <div><h3>Recurring revenue</h3><p>Subscriptions and usage, in thousands</p></div>
            ${legend(D.revenueSeries.series)}
          </div>
          <div class="card-body">${barChart({ ...D.revenueSeries, stacked: true, fmt: v => '$' + Math.round(v) + 'k' })}</div>
        </article>
        <article class="card">
          <div class="card-head"><div><h3>Plan mix</h3></div></div>
          <div class="card-body">${donutChart({ items: D.planMix, centerValue: '$466k', centerLabel: 'mrr' })}</div>
        </article>
      </section>
      <article class="card">
        <div class="card-head"><div><h3>By region</h3><p>Accounts and growth</p></div></div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Region</th><th>Share</th><th class="r">Accounts</th><th class="r">Growth</th></tr></thead>
            <tbody>${D.regions.map(r => {
              const max = Math.max(...D.regions.map(x => x.value));
              return `<tr>
                <td class="cell-primary">${r.label}</td>
                <td style="width:40%"><div class="meter"><i style="width:${(r.value / max * 100).toFixed(0)}%"></i></div></td>
                <td class="r num">${r.value.toLocaleString()}</td>
                <td class="r"><span class="delta ${r.delta > 0 ? 'up' : 'down'}">${r.delta > 0 ? '+' : ''}${r.delta}%</span></td>
              </tr>`;
            }).join('')}</tbody>
          </table>
        </div>
      </article>
    </div>

    <div data-panel="perf" hidden>
      <section class="grid g3" style="margin-bottom:var(--s5)">
        ${stat({ label: 'Uptime (30d)', value: '99.98', unit: '%', delta: 0, note: 'SLO 99.9%', spark: [99.9,99.99,100,99.97,99.98,100,99.98], color: 'var(--chart-3)' })}
        ${stat({ label: 'p95 latency', value: '142', unit: 'ms', delta: -11.2, note: 'API gateway', spark: [188,176,168,159,152,147,142], color: 'var(--chart-2)' })}
        ${stat({ label: 'Error rate', value: '0.14', unit: '%', delta: 3.1, note: '5xx responses', spark: [.09,.1,.11,.1,.12,.13,.14], color: 'var(--chart-4)' })}
      </section>
      <article class="card" style="margin-bottom:var(--s5)">
        <div class="card-head"><div><h3>Latency by hour</h3><p>p95, milliseconds, UTC</p></div></div>
        <div class="card-body">${areaChart({ ...D.latency, fmt: v => Math.round(v) })}</div>
      </article>
      <div class="grid g2">
        <div class="callout ok">${icon('check')}<div class="body"><b>All systems operational</b>No incidents in the last 14 days.</div></div>
        <div class="callout info">${icon('info')}<div class="body"><b>Scheduled maintenance</b>Sep 24, 02:00–03:00 UTC. Read replicas unaffected.</div></div>
      </div>
    </div>`,
};

/* ============================================================
   CUSTOMERS — sortable / filterable / selectable data table
   ============================================================ */
const PAGE_SIZE = 10;
const tableState = { q: '', plan: 'all', status: 'all', sort: 'mrr', dir: -1, page: 1, sel: new Set() };

function filtered() {
  const q = tableState.q.toLowerCase();
  return D.customers
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.includes(q))
    .filter(c => tableState.plan === 'all' || c.plan === tableState.plan)
    .filter(c => tableState.status === 'all' || c.status === tableState.status)
    .sort((a, b) => {
      const k = tableState.sort;
      const av = a[k], bv = b[k];
      return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * tableState.dir;
    });
}

function tableBody() {
  const rows = filtered();
  const start = (tableState.page - 1) * PAGE_SIZE;
  const view = rows.slice(start, start + PAGE_SIZE);
  if (!view.length) return `<tr><td colspan="8">
    <div class="empty">
      <div class="empty-art">${icon('search')}</div>
      <div class="stack gap2"><h3>No matching accounts</h3><p>Try a different search term or clear the filters.</p></div>
      <button class="btn btn-default btn-sm" data-action="clear-filters">Clear filters</button>
    </div></td></tr>`;
  return view.map(c => `
    <tr data-id="${c.id}" class="${tableState.sel.has(c.id) ? 'selected' : ''}">
      <td style="width:36px">
        <label class="check" onclick="event.stopPropagation()">
          <input type="checkbox" data-action="select-row" data-id="${c.id}" ${tableState.sel.has(c.id) ? 'checked' : ''}>
          <span class="box">${icon('check')}</span>
        </label>
      </td>
      <td>
        <div class="row gap3">
          <span class="avatar sm">${initials(c.name)}</span>
          <div><div class="cell-primary">${c.name}</div><div class="cell-sub">${c.email}</div></div>
        </div>
      </td>
      <td class="nowrap">${c.company}</td>
      <td><span class="badge outline">${c.plan}</span></td>
      <td><span class="badge ${statusMeta[c.status].cls}"><i class="dot"></i>${statusMeta[c.status].label}</span></td>
      <td class="r num">${money(c.mrr)}</td>
      <td style="width:120px">
        <div class="row gap2">
          <div class="meter grow"><i style="width:${c.usage}%;background:${c.usage > 85 ? 'var(--bad)' : 'var(--accent)'}"></i></div>
          <span class="num cell-sub">${c.usage}%</span>
        </div>
      </td>
      <td class="cell-sub nowrap">${c.lastSeen}</td>
      <td class="r" style="width:40px">
        <button class="icon-btn" data-action="row-menu" data-id="${c.id}" aria-label="Actions for ${c.name}" onclick="event.stopPropagation()">${icon('dots')}</button>
      </td>
    </tr>`).join('');
}

function tableFoot() {
  const total = filtered().length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const p = tableState.page;
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === pages || Math.abs(n - p) <= 1);
  let out = '', last = 0;
  nums.forEach(n => {
    if (last && n - last > 1) out += `<span class="muted num" style="padding:0 4px">…</span>`;
    out += `<button class="${n === p ? 'on' : ''}" data-action="page" data-page="${n}" aria-label="Page ${n}"${n === p ? ' aria-current="page"' : ''}>${n}</button>`;
    last = n;
  });
  return `
    <span class="num">${total ? (p - 1) * PAGE_SIZE + 1 : 0}–${Math.min(p * PAGE_SIZE, total)} of ${total}</span>
    <div class="pagination">
      <button data-action="page" data-page="${p - 1}" aria-label="Previous page" ${p === 1 ? 'disabled' : ''}>‹</button>
      ${out}
      <button data-action="page" data-page="${p + 1}" aria-label="Next page" ${p === pages ? 'disabled' : ''}>›</button>
    </div>`;
}

function bulkBar() {
  const n = tableState.sel.size;
  if (!n) return '';
  return `<div class="bulkbar">
    <span class="num">${n}</span> selected
    <div class="row gap2" style="margin-left:auto">
      <button class="btn btn-sm btn-ghost" data-action="toast" data-msg="${n} accounts emailed">${icon('mail')} Email</button>
      <button class="btn btn-sm btn-ghost" data-action="toast" data-msg="Exported ${n} accounts">${icon('download')} Export</button>
      <button class="btn btn-sm btn-ghost" data-action="confirm-delete">${icon('trash')} Delete</button>
      <button class="btn btn-sm btn-ghost" data-action="clear-sel">${icon('x')}</button>
    </div>
  </div>`;
}

const sortIcon = key => tableState.sort !== key ? '<span class="sort">↕</span>'
  : `<span class="sort">${tableState.dir === 1 ? '↑' : '↓'}</span>`;

export const customers = {
  title: 'Customers',
  render: () => `
    ${head('Customers', `${D.customers.length} accounts across 4 plans. Click any row for the full profile.`, `
      <button class="btn btn-default">${icon('download')} Export CSV</button>
      <button class="btn btn-primary" data-action="modal">${icon('plus')} Add customer</button>
    `)}
    <article class="card">
      <div class="toolbar">
        <div class="input-group" style="width:260px">
          ${icon('search')}
          <input class="input" placeholder="Search name, company or email…" data-action="search" value="${tableState.q}">
        </div>
        <select class="select" style="width:auto" data-action="filter-plan">
          ${['all','Starter','Growth','Scale','Enterprise'].map(p =>
            `<option value="${p}" ${tableState.plan === p ? 'selected' : ''}>${p === 'all' ? 'All plans' : p}</option>`).join('')}
        </select>
        <div class="seg" data-action="filter-status">
          ${[['all','All'],['active','Active'],['trial','Trial'],['past_due','Past due'],['churned','Churned']].map(([v, l]) =>
            `<button data-status="${v}" class="${tableState.status === v ? 'on' : ''}">${l}</button>`).join('')}
        </div>
        <div class="grow"></div>
        <button class="btn btn-default btn-sm">${icon('filter')} More filters</button>
      </div>
      <div data-slot="bulk">${bulkBar()}</div>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr>
            <th style="width:36px">
              <label class="check"><input type="checkbox" data-action="select-all"><span class="box">${icon('check')}</span></label>
            </th>
            <th class="sortable ${tableState.sort === 'name' ? 'sorted' : ''}" data-sort="name">Customer ${sortIcon('name')}</th>
            <th class="sortable" data-sort="company">Company ${sortIcon('company')}</th>
            <th class="sortable" data-sort="plan">Plan ${sortIcon('plan')}</th>
            <th>Status</th>
            <th class="r sortable ${tableState.sort === 'mrr' ? 'sorted' : ''}" data-sort="mrr">MRR ${sortIcon('mrr')}</th>
            <th class="sortable" data-sort="usage">Usage ${sortIcon('usage')}</th>
            <th>Last seen</th>
            <th></th>
          </tr></thead>
          <tbody data-slot="rows">${tableBody()}</tbody>
        </table>
      </div>
      <div class="card-foot" data-slot="foot">${tableFoot()}</div>
    </article>`,
  state: tableState,
  redraw(root) {
    root.querySelector('[data-slot="rows"]').innerHTML = tableBody();
    root.querySelector('[data-slot="foot"]').innerHTML = tableFoot();
    root.querySelector('[data-slot="bulk"]').innerHTML = bulkBar();
    root.querySelectorAll('th.sortable').forEach(th => {
      const k = th.dataset.sort;
      const active = tableState.sort === k;
      th.querySelector('.sort').textContent = active ? (tableState.dir === 1 ? '↑' : '↓') : '↕';
      th.classList.toggle('sorted', active);
      th.setAttribute('aria-sort', active ? (tableState.dir === 1 ? 'ascending' : 'descending') : 'none');
    });
  },
  filtered,
};

/* ============================================================
   TASKS — drag-and-drop board
   ============================================================ */
const priMeta = { high: ['bad','High'], med: ['warn','Medium'], low: ['outline','Low'] };

const taskCard = t => `
  <div class="board-card" draggable="true" data-task="${t.id}">
    <div class="row spread gap2" style="margin-bottom:var(--s2)">
      <span class="num" style="font-size:var(--text-2xs);color:var(--faint)">${t.id}</span>
      <span class="badge ${priMeta[t.pri][0]}">${priMeta[t.pri][1]}</span>
    </div>
    <h4>${t.title}</h4>
    <div class="row spread gap2" style="margin-top:var(--s3)">
      <span class="badge">${t.tag}</span>
      <div class="row gap2">
        <span class="cell-sub num">${t.due}</span>
        <span class="avatar sm">${t.who}</span>
      </div>
    </div>
  </div>`;

export const tasks = {
  title: 'Tasks',
  render: () => `
    ${head('Tasks', 'Drag cards between columns. Ten items across four stages.', `
      <div class="seg"><button class="on">Board</button><button data-action="toast" data-msg="List view is a mockup stub">List</button></div>
      <button class="btn btn-primary" data-action="modal">${icon('plus')} New task</button>
    `)}
    <div class="board">
      ${Object.entries(D.tasks).map(([key, items]) => `
        <section class="board-col" data-col="${key}">
          <div class="board-col-head">
            <i class="dot" style="background:${columnMeta[key].color}"></i>
            <b style="font-size:var(--text-sm)">${columnMeta[key].title}</b>
            <span class="count">${items.length}</span>
            <button class="icon-btn" style="margin-left:auto;width:24px;height:24px" aria-label="Add task to ${columnMeta[key].title}" data-action="modal">${icon('plus')}</button>
          </div>
          <div class="board-drop" data-drop="${key}">${items.map(taskCard).join('')}</div>
        </section>`).join('')}
    </div>`,
  mount(root) {
    let dragged = null;
    root.addEventListener('dragstart', e => {
      const card = e.target.closest('.board-card'); if (!card) return;
      dragged = card; card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    root.addEventListener('dragend', () => {
      dragged?.classList.remove('dragging');
      root.querySelectorAll('.board-col').forEach(c => c.classList.remove('drop-target'));
      dragged = null;
    });
    root.addEventListener('dragover', e => {
      const col = e.target.closest('.board-col'); if (!col || !dragged) return;
      e.preventDefault();
      root.querySelectorAll('.board-col').forEach(c => c.classList.toggle('drop-target', c === col));
    });
    root.addEventListener('drop', e => {
      const col = e.target.closest('.board-col'); if (!col || !dragged) return;
      e.preventDefault();
      col.querySelector('.board-drop').appendChild(dragged);
      root.querySelectorAll('.board-col').forEach(c => {
        c.querySelector('.count').textContent = c.querySelectorAll('.board-card').length;
        c.classList.remove('drop-target');
      });
      window.__toast?.({ title: 'Task moved', msg: `${dragged.dataset.task} → ${columnMeta[col.dataset.col].title}` });
    });
  },
};

/* ============================================================
   COMPONENTS — element gallery
   ============================================================ */
const demo = (label, body, note = '') => `
  <section class="card" style="margin-bottom:var(--s5)">
    <div class="card-head"><div><h3>${label}</h3>${note ? `<p>${note}</p>` : ''}</div></div>
    <div class="card-body"><div class="row wrap gap3" style="align-items:flex-start">${body}</div></div>
  </section>`;

export const components = {
  title: 'Components',
  mount(root) { automations.mount(root); },
  render: () => `
    ${head('Components', 'Every element in the system, on one page. Use it as the reference when building new screens.')}


    <section class="card" style="margin-bottom:var(--s5)">
      <div class="card-head">
        <div><h3>Palettes</h3><p>Six presets. Every colour below is mixed from two seeds, so swapping one restyles the whole console.</p></div>
        <span class="badge outline">live — click to apply</span>
      </div>
      <div class="card-body">
        <div class="palette-grid">
          ${[['harbor', 'Cool grey, deep teal accent'],
             ['ember', 'Warm paper, persimmon accent'],
             ['indigo', 'Slate neutrals, indigo accent'],
             ['moss', 'Sage neutrals, forest accent'],
             ['plum', 'Mauve neutrals, plum accent'],
             ['graphite', 'Monochrome, ink accent']]
            .map(([id, desc]) => `
            <button class="palette-card" data-action="set-palette" data-palette="${id}">
              <span class="ramp" data-ramp="${id}">
                <i></i><i></i><i></i><i></i><i></i>
              </span>
              <div class="name">${id}${id === 'harbor' ? ' <span class="badge outline" style="text-transform:none;font-weight:500">default</span>' : ''}</div>
              <div class="desc">${desc}</div>
              <code>data-palette="${id}"</code>
            </button>`).join('')}
        </div>
        <div class="callout info" style="margin-top:var(--s4)">
          ${icon('info')}
          <div class="body">Ask an agent for one by name — <b>"use the ember palette"</b> — or set
          <code class="code inline">data-palette</code> on <code class="code inline">&lt;html&gt;</code>.
          Light and dark are independent: every palette ships both.</div>
        </div>
      </div>
    </section>

    ${demo('Buttons', `
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-default">Default</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-danger">Danger</button>
      <button class="btn btn-primary btn-sm">${icon('plus')} Small</button>
      <button class="btn btn-default btn-lg">Large</button>
      <button class="btn btn-default btn-icon" data-tip="Icon only">${icon('cog')}</button>
      <button class="btn btn-default" disabled>Disabled</button>
      <div class="seg"><button class="on">Day</button><button>Week</button><button>Month</button></div>
    `, 'Four weights, three sizes. One primary action per view.')}

    ${demo('Badges & status', `
      <span class="badge">Neutral</span>
      <span class="badge ok"><i class="dot"></i>Active</span>
      <span class="badge info"><i class="dot"></i>Trial</span>
      <span class="badge warn"><i class="dot"></i>Past due</span>
      <span class="badge bad"><i class="dot"></i>Churned</span>
      <span class="badge accent">Beta</span>
      <span class="badge outline">Enterprise</span>
      <span class="badge ok"><i class="dot pulse"></i>Live</span>
      <span class="delta up">${icon('arrowUp')}+12.4%</span>
      <span class="delta down">${icon('arrowDn')}-3.1%</span>
    `)}

    ${demo('Avatars', `
      <span class="avatar sm">MO</span><span class="avatar">KD</span><span class="avatar lg">YT</span>
      <div class="avatar-stack">
        ${['MO','KD','YT','DF','+7'].map(i => `<span class="avatar sm">${i}</span>`).join('')}
      </div>
    `)}

    <section class="grid g2" style="margin-bottom:var(--s5)">
      <article class="card">
        <div class="card-head"><div><h3>Form controls</h3><p>Labels above, hints below, 34px control height</p></div></div>
        <div class="card-body stack gap5">
          <div class="field">
            <label>Workspace name</label>
            <input class="input" value="navi Production" aria-label="Workspace name">
            <span class="hint">Lowercase letters, numbers and dashes.</span>
          </div>
          <div class="field">
            <label>Domain</label>
            <div class="input-affix"><span>https://</span><input class="input" value="navi.app" aria-label="Domain"></div>
          </div>
          <div class="field">
            <label>Search</label>
            <div class="input-group">${icon('search')}<input class="input" placeholder="Find anything…"></div>
          </div>
          <div class="field">
            <label>Region</label>
            <select class="select"><option>us-east-1</option><option>eu-west-2</option><option>ap-southeast-1</option></select>
          </div>
          <div class="field">
            <label>Billing email</label>
            <input class="input invalid" value="not-an-email" aria-label="Billing email" aria-invalid="true">
            <span class="err">Enter a valid email address.</span>
          </div>
          <div class="field">
            <label>Notes</label>
            <textarea class="textarea" placeholder="Internal context for this account…"></textarea>
          </div>
        </div>
      </article>

      <div class="stack gap5">
        <article class="card">
          <div class="card-head"><div><h3>Selection</h3></div></div>
          <div class="card-body stack gap4">
            <label class="check"><input type="checkbox" checked><span class="box">${icon('check')}</span>
              <span>Email me weekly digests</span></label>
            <label class="check"><input type="checkbox"><span class="box">${icon('check')}</span>
              <span>Notify on failed payments<br><span class="hint">Sent to billing contacts only.</span></span></label>
            <hr style="border:0;border-top:1px solid var(--line-soft)">
            <label class="check radio"><input type="radio" name="rr" checked><span class="box"></span><span>Monthly billing</span></label>
            <label class="check radio"><input type="radio" name="rr"><span class="box"></span><span>Annual billing — save 18%</span></label>
            <hr style="border:0;border-top:1px solid var(--line-soft)">
            <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span>Two-factor authentication</span></label>
            <label class="switch"><input type="checkbox"><span class="track"><span class="thumb"></span></span>
              <span>Public status page</span></label>
            <label class="switch sm"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span style="font-size:var(--text-sm)">Small — for dense rows</span></label>
            <label class="switch"><input type="checkbox" checked disabled><span class="track"><span class="thumb"></span></span>
              <span>Disabled (locked by policy)</span></label>
          </div>
        </article>

        <article class="card">
          <div class="card-head"><div><h3>Overlays</h3></div></div>
          <div class="card-body row wrap gap3">
            <button class="btn btn-default" data-action="modal">Open modal</button>
            <button class="btn btn-default" data-action="drawer" data-id="${D.customers[0].id}">Open drawer</button>
            <button class="btn btn-default" data-action="cmdk">Command palette</button>
            <button class="btn btn-default" data-action="toast" data-variant="ok" data-msg="Changes saved">Success toast</button>
            <button class="btn btn-default" data-action="toast" data-variant="bad" data-msg="Could not reach the billing service">Error toast</button>
            <button class="btn btn-default" data-tip="Tooltips sit above">Hover me</button>
          </div>
        </article>
      </div>
    </section>

    ${demo('Callouts', `
      <div class="callout" style="flex:1 1 320px">${icon('info')}<div class="body"><b>Neutral</b>Default surface, for passive context.</div></div>
      <div class="callout info" style="flex:1 1 320px">${icon('info')}<div class="body"><b>Informational</b>Maintenance window on Sep 24.</div></div>
      <div class="callout ok" style="flex:1 1 320px">${icon('check')}<div class="body"><b>Success</b>Invoice reconciled automatically.</div></div>
      <div class="callout warn" style="flex:1 1 320px">${icon('alert')}<div class="body"><b>Warning</b>Usage at 92% of plan limit.</div></div>
      <div class="callout bad" style="flex:1 1 320px">${icon('alert')}<div class="body"><b>Error</b>Card declined — update payment method.</div></div>
    `)}

    <section class="grid g3" style="margin-bottom:var(--s5)">
      <article class="card">
        <div class="card-head"><div><h3>Empty state</h3></div></div>
        <div class="empty">
          <div class="empty-art">${icon('inbox')}</div>
          <div class="stack gap2"><h3>No invoices yet</h3><p>Invoices appear here once the first billing cycle closes.</p></div>
          <button class="btn btn-primary btn-sm">${icon('plus')} Create invoice</button>
        </div>
      </article>
      <article class="card">
        <div class="card-head"><div><h3>Loading</h3></div></div>
        <div class="card-body stack gap3">
          <div class="row gap3">
            <div class="skeleton" style="width:30px;height:30px;border-radius:99px"></div>
            <div class="stack gap2 grow">
              <div class="skeleton" style="height:10px;width:55%"></div>
              <div class="skeleton" style="height:9px;width:35%"></div>
            </div>
          </div>
          <div class="skeleton" style="height:9px"></div>
          <div class="skeleton" style="height:9px;width:82%"></div>
          <div class="skeleton" style="height:9px;width:64%"></div>
          <div class="skeleton" style="height:80px;border-radius:var(--radius)"></div>
        </div>
      </article>
      <article class="card">
        <div class="card-head"><div><h3>Meters</h3></div></div>
        <div class="card-body">${rankBars(
          [{ label: 'API requests', value: 92 }, { label: 'Storage', value: 61 }, { label: 'Seats used', value: 38 }, { label: 'Webhooks', value: 12 }],
          { color: 'var(--accent)' })}</div>
      </article>
    </section>


    ${demo('Banners', `
      <div class="stack gap3" style="width:100%">
        <div class="banner">${icon('info')}<div><b>Master dry run is off.</b> Workflows write for real.</div>
          <button class="btn btn-default btn-sm">Enable dry run</button></div>
        <div class="banner warn">${icon('alert')}<div><b>Restart required.</b> Configuration changes take effect after a restart.</div>
          <button class="btn btn-default btn-sm">Restart now</button></div>
        <div class="banner bad">${icon('alert')}<div><b>Payment past due.</b> Access is limited in 4 days.</div></div>
      </div>
    `, 'Full-width, page-level. Use a callout for anything scoped to one card.')}

    ${demo('Code &amp; previews', `
      <div class="stack gap3" style="flex:1;min-width:280px">
        <pre class="code"><span class="tok-field">usage_pct</span> <span class="tok-op">&gt;</span> <span class="tok-val">90</span>
<span class="tok-join">and</span> <span class="tok-field">plan</span> <span class="tok-op">in</span> <span class="tok-val">('Growth', 'Scale')</span></pre>
        <p style="font-size:var(--text-sm)">Inline code reads as <code class="code inline">usage_pct</code> inside a sentence.</p>
      </div>
      <div class="stack gap3" style="flex:1;min-width:280px">
        <div class="note"><div class="note-author">Marta Okonkwo · internal</div>
          <div class="note-text">Confirmed the maintenance window with the customer. Handing off to the platform team.</div></div>
        <span class="cond-result ok">✓ matches 31 of 2,530 accounts</span>
        <span class="cond-result err">✕ unknown field account/tier</span>
      </div>
    `)}

    ${demo('Query rows &amp; chips', `
      <div class="cond" style="width:100%">
        <div class="cond-tabs"><button class="on">Builder</button><button>Advanced</button>
          <span class="grow"></span><span class="cell-sub">2 conditions</span></div>
        <div class="cond-rows">
          <div class="cond-row">
            <span class="cond-join-spacer"></span>
            <select class="select" style="min-width:150px"><option>Account status</option></select>
            <select class="select" style="min-width:130px"><option>is</option></select>
            <input class="input" style="min-width:180px" value="Past due" aria-label="Value">
          </div>
          <div class="cond-row">
            <select class="cond-join"><option>and</option><option>or</option></select>
            <select class="select" style="min-width:150px"><option>Plan</option></select>
            <select class="select" style="min-width:130px"><option>is one of</option></select>
            <div class="chips typeahead">
              <span class="chip">Growth<button class="chip-x hit-expand" data-action="chip-remove" aria-label="Remove Growth">${icon('x')}</button></span>
              <span class="chip">Scale<button class="chip-x hit-expand" data-action="chip-remove" aria-label="Remove Scale">${icon('x')}</button></span>
              <button class="chip-add" data-action="typeahead">+ value</button>
            </div>
          </div>
        </div>
      </div>
    `, 'Field → operator → value. The + opens a typeahead; chips are removable.')}

    ${demo('Ordered cards', `
      <article class="rule-card" style="flex:1 1 340px">
        <div class="rule-head">
          <div class="order-btns"><button disabled aria-label="Move up">${icon('chevUp')}</button><button aria-label="Move down">${icon('chevDn')}</button></div>
          <span class="rule-index">1</span>
          <input class="rule-name" value="Warn owners at 90% of plan limit" aria-label="Rule name">
          <span class="badge outline">stops chain</span>
          <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span></label>
        </div>
        <div class="rule-body"><span class="cell-sub">Card body — conditions, actions, whatever the row needs.</span></div>
      </article>
      <article class="rule-card is-disabled" style="flex:1 1 340px">
        <div class="rule-head">
          <div class="order-btns"><button aria-label="Move up">${icon('chevUp')}</button><button disabled aria-label="Move down">${icon('chevDn')}</button></div>
          <span class="rule-index">2</span>
          <input class="rule-name" value="Skip internal and sandbox accounts" aria-label="Rule name">
          <label class="switch"><input type="checkbox"><span class="track"><span class="thumb"></span></span></label>
        </div>
        <div class="rule-body"><span class="cell-sub">Disabled cards dim rather than disappear.</span></div>
      </article>
    `, 'Reorderable, individually toggleable, numbered by evaluation order.')}

    <section class="grid g3" style="margin-bottom:var(--s5)">
      <article class="card">
        <div class="card-head"><div><h3>Log rows</h3></div></div>
        <div class="log-list" style="max-height:none">
          <div class="log-row"><span class="log-time">14:02:00</span><span class="log-level">INFO</span>
            <span class="log-msg">api: request completed<span class="log-attr"><b>status</b>=200</span></span></div>
          <div class="log-row warn"><span class="log-time">14:03:23</span><span class="log-level">WARN</span>
            <span class="log-msg">mailer: no address on file</span></div>
          <div class="log-row error"><span class="log-time">14:05:12</span><span class="log-level">ERROR</span>
            <span class="log-msg">billing: charge failed<span class="log-attr"><b>status</b>=402</span></span></div>
          <div class="log-row debug"><span class="log-time">14:06:41</span><span class="log-level">DEBUG</span>
            <span class="log-msg">config: reloaded<span class="log-attr"><b>keys</b>=9</span></span></div>
        </div>
      </article>
      <article class="card">
        <div class="card-head"><div><h3>Field diff</h3></div></div>
        <div class="card-body">${diffTable([['Plan', 'Growth', 'Scale'], ['Seats', '11', '15'], ['Status', 'trial', 'active']])}</div>
      </article>
      <article class="card">
        <div class="card-head"><div><h3>Record meta</h3></div></div>
        <div class="card-body">
          <div class="meta-grid">
            ${[['MRR', '$3,593'], ['Seats', '15'], ['Usage', '51%'], ['Plan', 'Scale']]
              .map(([k, v]) => `<div><div class="eyebrow">${k}</div><div class="val num">${v}</div></div>`).join('')}
          </div>
        </div>
      </article>
    </section>

    <section class="grid g2" style="margin-bottom:var(--s5)">
      <article class="card">
        <div class="card-head"><div><h3>Secrets &amp; recovery codes</h3><p>Shown once, never again</p></div></div>
        <div class="card-body stack gap4">
          <div class="field"><label>API key</label>
            <div class="secret reveal">sk_live_9f2b7c1d4e8a6035bd17
              <button class="icon-btn" style="margin-left:auto;width:26px;height:26px" aria-label="Copy API key" data-action="toast" data-msg="Copied to clipboard">${icon('copy')}</button>
            </div>
            <span class="hint">Copy it now — it will not be shown again.</span>
          </div>
          <div class="field"><label>Stored key</label>
            <div class="secret">sk_live_••••••••••••7f2a
              <span class="cell-sub" style="margin-left:auto">used 4 min ago</span></div>
          </div>
          <div class="field"><label>Recovery codes</label>
            <div class="recovery-codes">
              ${['4f2a-90bd', '7c11-e3a8', 'b204-71fd', '9ae6-2c40', '01d7-8b3e', 'cc58-6f19']
                .map(c => `<span>${c}</span>`).join('')}
            </div>
          </div>
        </div>
      </article>
      <article class="card">
        <div class="card-head"><div><h3>Two-factor enrolment</h3></div></div>
        <div class="card-body row gap5 wrap">
          <div class="qr">
            <svg viewBox="0 0 21 21" width="100%" height="100%" shape-rendering="crispEdges" aria-label="QR placeholder">
              <rect width="21" height="21" fill="#fff"/>
              ${Array.from({ length: 21 * 21 }, (_, i) => {
                const x = i % 21, y = (i / 21) | 0;
                const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
                const ring = finder && (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5 && x % 6 !== 0));
                const on = finder ? ring : ((x * 7 + y * 13 + x * y) % 3 === 0);
                return on ? `<rect x="${x}" y="${y}" width="1" height="1" fill="#17160F"/>` : '';
              }).join('')}
            </svg>
          </div>
          <div class="stack gap3" style="flex:1;min-width:180px">
            <p style="font-size:var(--text-sm);color:var(--muted)">Scan with an authenticator app, or enter the secret manually.</p>
            <div class="secret" style="font-size:var(--text-xs)">JBSW Y3DP EHPK 3PXP</div>
            <input class="input otp-input" maxlength="6" placeholder="000000">
            <button class="btn btn-primary" data-action="toast" data-variant="ok" data-msg="Two-factor enabled">Verify &amp; enable</button>
          </div>
        </div>
      </article>
    </section>

    ${demo('State indicators', `
      <div class="row gap3 wrap" style="align-items:center">
        <span class="row gap2"><span class="dirty-dot"></span><span style="font-size:var(--text-sm)">Unsaved changes</span></span>
        <span class="badge ok"><i class="dot pulse"></i>Streaming</span>
        <span class="badge warn"><i class="dot"></i>Idle</span>
        <a class="back-link" href="#/components">${icon('arrowL', 'ico14')}Back to list</a>
        <div class="order-btns"><button aria-label="Move up">${icon('chevUp')}</button><button disabled aria-label="Move down">${icon('chevDn')}</button></div>
        <div class="pwd-reqs">
          <span class="pwd-req ok">${icon('check')}At least 12 characters</span>
          <span class="pwd-req">${icon('check')}One symbol</span>
        </div>
      </div>
    `)}

    ${demo('Typography', `
      <div class="stack gap4" style="flex:1">
        <div><span class="eyebrow">Eyebrow · Instrument Sans 600</span></div>
        <h1 class="page-title" style="font-size:var(--text-2xl)">Display face</h1>
        <p style="max-width:62ch;color:var(--ink-2)">Body copy is Instrument Sans at 14px with a 1.5 line height. Long-form text is capped at 62 characters per line so paragraphs stay comfortable to scan in a dense console.</p>
        <p class="num" style="font-size:var(--text-xl)">1,284,905.42 — JetBrains Mono, tabular</p>
        <div class="row gap3 wrap">
          <span class="kbd">⌘</span><span class="kbd">K</span><span class="kbd">ESC</span><span class="kbd">⇧</span>
        </div>
      </div>
    `, 'One display face, sans for interface, mono for every number.')}

    ${demo('Color tokens', `
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:var(--s3);width:100%">
        ${[['--accent','Accent'],['--ink','Ink'],['--muted','Muted'],['--line','Line'],['--surface','Surface'],['--bg','Background'],
           ['--ok','Success'],['--warn','Warning'],['--bad','Danger'],['--info','Info'],
           ['--chart-1','Chart 1'],['--chart-2','Chart 2'],['--chart-3','Chart 3'],['--chart-4','Chart 4'],['--chart-5','Chart 5'],['--chart-6','Chart 6']]
          .map(([v, n]) => `
          <div class="stack gap2">
            <div style="height:44px;border-radius:var(--radius-sm);background:var(${v});border:1px solid var(--line)"></div>
            <div><div style="font-size:var(--text-xs);font-weight:500">${n}</div>
            <div class="num" style="font-size:10px;color:var(--faint)">var(${v})</div></div>
          </div>`).join('')}
      </div>
    `)}`,
};

/* ============================================================
   SETTINGS
   ============================================================ */
export const settings = {
  title: 'Settings',
  render: () => `
    ${head('Settings', 'Workspace configuration, billing and access control.')}
    <div class="tabs" data-tabs="settings" style="margin-bottom:var(--s6)">
      <button class="on" data-tab="general">General</button>
      <button data-tab="billing">Billing</button>
      <button data-tab="team">Team</button>
      <button data-tab="security">Security</button>
    </div>

    <div data-panel="general">
      <article class="card card-pad">
        <div class="form-row">
          <div><h4>Workspace</h4><p class="desc">Shown in the sidebar and on invoices.</p></div>
          <div class="stack gap4" style="max-width:420px">
            <div class="field"><label>Name</label><input class="input" value="navi Production" aria-label="Workspace name"></div>
            <div class="field"><label>Slug</label>
              <div class="input-affix"><span>navi.app/</span><input class="input" value="production" aria-label="Workspace slug"></div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div><h4>Branding</h4><p class="desc">Applied to the console and customer-facing pages.</p></div>
          <div class="row gap4">
            <div class="avatar lg" style="border-radius:var(--radius);background:var(--ink);color:var(--bg);font-family:var(--font-display);font-weight:var(--display-weight);font-size:20px">n</div>
            <div class="stack gap2">
              <div class="row gap2">
                <button class="btn btn-default btn-sm">Upload logo</button>
                <button class="btn btn-ghost btn-sm">Remove</button>
              </div>
              <span class="hint">SVG or PNG, at least 256×256.</span>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div><h4>Locale</h4><p class="desc">Affects dates, numbers and currency.</p></div>
          <div class="grid g2" style="max-width:420px;gap:var(--s3)">
            <div class="field"><label>Timezone</label>
              <select class="select"><option>UTC−06:00 Central</option><option>UTC+00:00 London</option><option>UTC+09:00 Tokyo</option></select></div>
            <div class="field"><label>Currency</label>
              <select class="select"><option>USD $</option><option>EUR €</option><option>GBP £</option></select></div>
          </div>
        </div>
        <div class="form-row">
          <div><h4>Notifications</h4><p class="desc">Where the workspace sends alerts.</p></div>
          <div class="stack gap4">
            <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span>Failed payments<br><span class="hint">Immediate email to billing contacts.</span></span></label>
            <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span>Weekly digest<br><span class="hint">Monday 08:00 in workspace timezone.</span></span></label>
            <label class="switch"><input type="checkbox"><span class="track"><span class="thumb"></span></span>
              <span>Product announcements</span></label>
          </div>
        </div>
      </article>
      <div class="row gap2" style="justify-content:flex-end;margin-top:var(--s5)">
        <button class="btn btn-ghost">Discard</button>
        <button class="btn btn-primary" data-action="toast" data-variant="ok" data-msg="Workspace settings saved">Save changes</button>
      </div>
    </div>

    <div data-panel="billing" hidden>
      <div class="grid g-2-1">
        <article class="card">
          <div class="card-head"><div><h3>Current plan</h3><p>Renews Oct 1, 2026</p></div>
            <span class="badge accent">Scale</span></div>
          <div class="card-body stack gap5">
            <div class="row spread wrap gap4">
              <div class="stat-value" style="margin:0">$749<small> / month</small></div>
              <button class="btn btn-default">Change plan</button>
            </div>
            ${rankBars([{ label: 'API requests — 4.6M of 5M', value: 92 }, { label: 'Storage — 122GB of 200GB', value: 61 }, { label: 'Seats — 15 of 40', value: 38 }], { color: 'var(--accent)', fmt: v => v + '%' })}
            <div class="callout warn">${icon('alert')}<div class="body"><b>Approaching request limit</b>Overage is billed at $0.40 per 1,000 requests.</div></div>
          </div>
        </article>
        <article class="card">
          <div class="card-head"><div><h3>Payment method</h3></div></div>
          <div class="card-body stack gap4">
            <div class="row gap3" style="padding:var(--s3);border:1px solid var(--line);border-radius:var(--radius)">
              ${icon('card', 'ico20')}
              <div class="grow"><div class="cell-primary num">•••• 4242</div><div class="cell-sub">Visa · expires 04/28</div></div>
              <span class="badge ok">Default</span>
            </div>
            <button class="btn btn-default">${icon('plus')} Add payment method</button>
          </div>
        </article>
      </div>
      <article class="card" style="margin-top:var(--s5)">
        <div class="card-head"><div><h3>Invoices</h3></div>
          <button class="btn btn-ghost btn-sm">${icon('download')} Download all</button></div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Invoice</th><th>Date</th><th>Period</th><th class="r">Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${[['INV-2026-0912','Sep 1, 2026','Sep 2026',812.40,'ok','Paid'],
                 ['INV-2026-0811','Aug 1, 2026','Aug 2026',749.00,'ok','Paid'],
                 ['INV-2026-0710','Jul 1, 2026','Jul 2026',749.00,'ok','Paid'],
                 ['INV-2026-0609','Jun 1, 2026','Jun 2026',680.25,'warn','Refunded']]
                .map(([id, date, period, amt, cls, label]) => `
                <tr><td class="num cell-primary">${id}</td><td class="nowrap">${date}</td><td class="muted">${period}</td>
                  <td class="r num">$${amt.toFixed(2)}</td>
                  <td><span class="badge ${cls}"><i class="dot"></i>${label}</span></td>
                  <td class="r"><button class="icon-btn" aria-label="Download invoice ${id}" data-action="toast" data-msg="Invoice downloaded">${icon('download')}</button></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div data-panel="team" hidden>
      <article class="card">
        <div class="card-head"><div><h3>Members</h3><p>15 of 40 seats used</p></div>
          <button class="btn btn-primary btn-sm" data-action="modal">${icon('plus')} Invite</button></div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Member</th><th>Role</th><th>Last active</th><th>2FA</th><th></th></tr></thead>
            <tbody>
              ${[['Danny Reyes','danny@navi.app','Owner','2 min ago',true],
                 ['Marta Okonkwo','marta@navi.app','Admin','1 hr ago',true],
                 ['Kwame Diallo','kwame@navi.app','Developer','Today',true],
                 ['Yuki Tanaka','yuki@navi.app','Developer','Yesterday',false],
                 ['Priya Raman','priya@navi.app','Billing','3 days ago',true]]
                .map(([name, email, role, seen, mfa]) => `
                <tr>
                  <td><div class="row gap3"><span class="avatar sm">${initials(name)}</span>
                    <div><div class="cell-primary">${name}</div><div class="cell-sub">${email}</div></div></div></td>
                  <td><select class="select" style="width:130px;height:28px"><option>${role}</option><option>Admin</option><option>Developer</option><option>Viewer</option></select></td>
                  <td class="cell-sub">${seen}</td>
                  <td>${mfa ? '<span class="badge ok"><i class="dot"></i>On</span>' : '<span class="badge warn"><i class="dot"></i>Off</span>'}</td>
                  <td class="r"><button class="icon-btn" data-action="row-menu" aria-label="Member actions">${icon('dots')}</button></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div data-panel="security" hidden>
      <article class="card card-pad" style="margin-bottom:var(--s5)">
        <div class="form-row">
          <div><h4>Authentication</h4><p class="desc">Applies to every member of the workspace.</p></div>
          <div class="stack gap4">
            <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span>Require two-factor authentication</span></label>
            <label class="switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span>
              <span>SAML single sign-on<br><span class="hint">Connected to Okta since Mar 2026.</span></span></label>
            <label class="switch"><input type="checkbox"><span class="track"><span class="thumb"></span></span>
              <span>SCIM user provisioning</span></label>
          </div>
        </div>
        <div class="form-row">
          <div><h4>API keys</h4><p class="desc">Server-side keys carry full workspace scope.</p></div>
          <div class="stack gap3" style="max-width:520px">
            ${[['Production','sk_live_••••••••••••7f2a','Used 4 min ago'],['CI pipeline','sk_live_••••••••••••b10c','Used 2 days ago']]
              .map(([n, k, u]) => `
              <div class="row gap3" style="padding:var(--s3);border:1px solid var(--line);border-radius:var(--radius)">
                ${icon('key', 'ico16')}
                <div class="grow"><div class="cell-primary">${n}</div><div class="cell-sub num">${k}</div></div>
                <span class="cell-sub nowrap">${u}</span>
                <button class="icon-btn" aria-label="Copy ${n} key" data-action="toast" data-msg="Key copied to clipboard">${icon('copy')}</button>
              </div>`).join('')}
            <button class="btn btn-default btn-sm" style="align-self:flex-start">${icon('plus')} Create key</button>
          </div>
        </div>
        <div class="form-row">
          <div><h4>Session policy</h4><p class="desc">Idle timeout for console sessions.</p></div>
          <div style="max-width:220px"><select class="select"><option>8 hours</option><option>24 hours</option><option>7 days</option></select></div>
        </div>
      </article>

      <article class="card" style="border-color:var(--accent-line)">
        <div class="card-head"><div><h3 style="color:var(--bad)">Danger zone</h3><p>These actions cannot be undone.</p></div></div>
        <div class="card-body stack gap3">
          <div class="row spread gap4 wrap">
            <div><div class="cell-primary">Transfer ownership</div><div class="cell-sub">Move this workspace to another member.</div></div>
            <button class="btn btn-default btn-sm">Transfer</button>
          </div>
          <hr style="border:0;border-top:1px solid var(--line-soft)">
          <div class="row spread gap4 wrap">
            <div><div class="cell-primary">Delete workspace</div><div class="cell-sub">Permanently removes 2,530 accounts and all history.</div></div>
            <button class="btn btn-danger btn-sm" data-action="confirm-delete">Delete workspace</button>
          </div>
        </div>
      </article>
    </div>`,
};


/* ============================================================
   AUTOMATIONS — rule + condition builder (master → detail)
   ============================================================ */
const opsFor = f => (D.conditionOps[f?.type] || D.conditionOps.string)
  .concat(f?.list ? [['in_list', 'is in list'], ['not_in_list', 'is not in list']] : []);

const fieldByPath = p => D.conditionFields.find(f => f.path === p);

const condText = rule => rule.conditions.map((c, i) => {
  const val = c.values ? `(${c.values.map(v => `'${v}'`).join(', ')})`
    : c.op === 'in_list' || c.op === 'not_in_list' ? `list '${c.value}'`
    : ['empty', 'not_empty', 'true', 'false'].includes(c.op) ? '' : `'${c.value}'`;
  const op = { eq: '=', ne: '!=', gt: '>', lt: '<', contains: 'contains', starts: 'startsWith',
    in: 'in', not_in: 'not in', in_list: 'in', not_in_list: 'not in', empty: 'is null',
    not_empty: 'is not null', true: '= true', false: '= false' }[c.op] || c.op;
  return `${i ? `<span class="tok-join">${rule.join}</span> ` : ''}<span class="tok-field">${c.path}</span> <span class="tok-op">${op}</span>${val ? ` <span class="tok-val">${val}</span>` : ''}`;
}).join('\n');

const condRow = (c, ri, ci, join) => {
  const f = fieldByPath(c.path);
  const noValue = ['empty', 'not_empty', 'true', 'false'].includes(c.op);
  return `<div class="cond-row">
    ${ci === 0
      ? `<span class="cond-join-spacer"></span>`
      : ci === 1
        ? `<select class="cond-join" data-join="${ri}"><option ${join === 'and' ? 'selected' : ''}>and</option><option ${join === 'or' ? 'selected' : ''}>or</option></select>`
        : `<span class="cond-join">${join}</span>`}
    <select class="select" style="min-width:150px" aria-label="Field">
      ${D.conditionFields.map(o => `<option value="${o.path}" ${o.path === c.path ? 'selected' : ''}>${o.label}</option>`).join('')}
    </select>
    <select class="select" style="min-width:130px" aria-label="Operator">
      ${opsFor(f).map(([v, l]) => `<option value="${v}" ${v === c.op ? 'selected' : ''}>${l}</option>`).join('')}
    </select>
    ${noValue ? '<span class="cell-sub">no value needed</span>'
      : c.values
        ? `<div class="chips typeahead">
             ${c.values.map(v => `<span class="chip">${v}<button class="chip-x hit-expand" data-action="chip-remove" aria-label="Remove ${v}">${icon('x')}</button></span>`).join('')}
             <button class="chip-add" data-action="typeahead">+ value</button>
           </div>`
        : `<input class="input" style="min-width:180px" value="${c.value}" aria-label="Value">`}
    <button class="icon-btn" style="width:26px;height:26px;margin-left:auto" aria-label="Remove condition"
      data-action="toast" data-msg="Condition removed">${icon('trash')}</button>
  </div>`;
};

const conditionBuilder = (rule, ri) => `
  <div class="field">
    <label>Condition</label>
    <div class="cond">
      <div class="cond-tabs" data-tabs="cond-${ri}">
        <button class="on" data-tab="builder-${ri}">Builder</button>
        <button data-tab="advanced-${ri}">Advanced</button>
        <span class="grow"></span>
        <span class="cell-sub">${rule.conditions.length} condition${rule.conditions.length === 1 ? '' : 's'}</span>
      </div>
      <div data-panel="builder-${ri}">
        <div class="cond-rows">
          ${rule.conditions.map((c, ci) => condRow(c, ri, ci, rule.join)).join('')}
          <div><button class="btn btn-ghost btn-sm" data-action="toast" data-msg="Condition added">${icon('plus')} Add condition</button></div>
        </div>
      </div>
      <div data-panel="advanced-${ri}" hidden>
        <div class="cond-rows">
          <pre class="code" contenteditable="true" spellcheck="false">${condText(rule) || 'true'}</pre>
          <span class="hint">Edited here, the rule stays in advanced mode until the text parses back into rows.</span>
        </div>
      </div>
      <div class="cond-foot">
        <pre class="code" style="flex:1;border:0;background:none;padding:0">${condText(rule) || 'true'}</pre>
        <button class="btn btn-default btn-sm" data-action="cond-test">${icon('play')} Test</button>
        <span class="cond-result ok" data-slot="cond-result"></span>
      </div>
    </div>
  </div>`;

const actionRow = (a, enabledCount) => `
  <div class="action-row ${a.enabled ? '' : 'is-disabled'}">
    <div class="order-btns">
      <button ${enabledCount ? '' : 'disabled'} aria-label="Move action up">${icon('chevUp')}</button>
      <button aria-label="Move action down">${icon('chevDn')}</button>
    </div>
    <select class="select" style="width:auto;height:30px" aria-label="Action type">
      ${D.actionKinds.map(([v, l]) => `<option value="${v}" ${v === a.kind ? 'selected' : ''}>${l}</option>`).join('')}
    </select>
    <input class="input" style="width:auto;height:30px;min-width:200px" value="${a.target}" aria-label="Action target">
    <label class="switch" style="margin-left:auto"><input type="checkbox" ${a.enabled ? 'checked' : ''}><span class="track"><span class="thumb"></span></span></label>
    <button class="icon-btn" style="width:26px;height:26px" aria-label="Delete action" data-action="confirm-delete">${icon('trash')}</button>
    ${a.flags.length || a.kind === 'note' ? `<div class="action-detail"><div class="action-flags">
      ${['discussion', 'internal', 'resolution'].map(f => `
        <label class="check"><input type="checkbox" ${a.flags.includes(f) ? 'checked' : ''}><span class="box">${icon('check')}</span>
        <span style="font-size:var(--text-xs);text-transform:capitalize">${f}</span></label>`).join('')}
    </div></div>` : ''}
  </div>`;

/* A rule is collapsed to its head unless it carries .is-open: the summary is
   what the reader scans, the body is what they open to edit. */
const ruleSummary = r => [
  D.triggers.find(([v]) => v === r.trigger)?.[1] || r.trigger,
  `${r.conditions.length || 'no'} condition${r.conditions.length === 1 ? '' : 's'}`,
  `${r.actions.length} action${r.actions.length === 1 ? '' : 's'}`,
].join(' · ');

const ruleCard = (r, i, total) => `
  <article class="rule-card ${r.enabled ? '' : 'is-disabled'} ${r.open ? 'is-open' : ''}">
    <div class="rule-head">
      <button class="rule-grip" aria-label="Drag to reorder rule ${i + 1}">${icon('grip')}</button>
      <div class="order-btns">
        <button ${i === 0 ? 'disabled' : ''} aria-label="Move rule up">${icon('chevUp')}</button>
        <button ${i === total - 1 ? 'disabled' : ''} aria-label="Move rule down">${icon('chevDn')}</button>
      </div>
      <span class="rule-index">${i + 1}</span>
      <input class="rule-name" value="${r.name}" aria-label="Rule name">
      ${r.stop ? '<span class="badge outline">stops chain</span>' : ''}
      <span class="rule-sum cell-sub">${ruleSummary(r)}</span>
      <label class="switch" data-tip="Rule enabled"><input type="checkbox" ${r.enabled ? 'checked' : ''} data-action="toggle-rule"><span class="track"><span class="thumb"></span></span></label>
      <button class="btn btn-ghost btn-sm" data-action="confirm-delete">Delete</button>
      <button class="rule-toggle icon-btn" data-action="toggle-rule-body" aria-expanded="${r.open ? 'true' : 'false'}" aria-label="${r.open ? 'Collapse' : 'Expand'} rule ${i + 1}">${icon('chevDn')}</button>
    </div>
    <div class="rule-body">
      <div class="grid g2" style="gap:var(--s4)">
        <div class="field">
          <label>Run for</label>
          <select class="select">${D.triggers.map(([v, l]) => `<option value="${v}" ${v === r.trigger ? 'selected' : ''}>${l}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label>After this rule matches</label>
          <label class="check" style="height:34px;align-items:center">
            <input type="checkbox" ${r.stop ? 'checked' : ''}><span class="box">${icon('check')}</span>
            <span>Stop processing further rules</span>
          </label>
        </div>
      </div>
      ${conditionBuilder(r, i)}
      <div class="field">
        <label>Actions</label>
        ${r.actions.length
          ? r.actions.map((a, j) => actionRow(a, j)).join('')
          : `<div class="callout">${icon('info')}<div class="body">No actions — this rule only affects the chain because "stop processing" is set.</div></div>`}
        <div style="margin-top:var(--s2)"><button class="btn btn-ghost btn-sm" data-action="toast" data-msg="Action added">${icon('plus')} Add action</button></div>
      </div>
    </div>
  </article>`;

let currentWf = null;

export const automations = {
  title: 'Automations',
  render(id) {
    const wf = D.workflows.find(w => w.id === id);
    currentWf = wf || null;
    /* first rule open, the rest collapsed — the state a reader lands on */
    wf?.rules.forEach((r, i) => { if (r.open === undefined) r.open = i === 0; });
    return wf ? this.detail(wf) : this.index();
  },

  index: () => `
    ${head('Automations', 'Rules that run against every account change, top to bottom.', `
      <button class="btn btn-default">${icon('download')} Export rules</button>
      <button class="btn btn-primary" data-action="modal">${icon('plus')} New automation</button>
    `)}
    <div class="banner" style="margin-bottom:var(--s5)">
      ${icon('info')}
      <div><b>Dry run is off globally.</b> Automations write records and send messages for real.</div>
      <button class="btn btn-default btn-sm" data-action="toast" data-msg="Master dry run enabled">Enable dry run</button>
    </div>
    <article class="card">
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr>
            <th>Automation</th><th>Scope</th><th>Status</th>
            <th class="r">Rules</th><th class="r">Runs 24h</th><th class="r">Matched</th><th>Last run</th><th></th>
          </tr></thead>
          <tbody>
            ${D.workflows.map(w => `
              <tr data-href="#/automations/${w.id}">
                <td>
                  <div class="cell-primary">${w.name}</div>
                  <div class="cell-sub num">${w.id}</div>
                </td>
                <td>${w.scope}</td>
                <td>
                  <div class="row gap2">
                    ${w.enabled ? '<span class="badge ok"><i class="dot"></i>Enabled</span>' : '<span class="badge"><i class="dot"></i>Disabled</span>'}
                    ${w.dryRun ? '<span class="badge warn">Dry run</span>' : ''}
                  </div>
                </td>
                <td class="r num">${w.rules.length}</td>
                <td class="r num">${w.runs24h}</td>
                <td class="r num">${w.matched24h}</td>
                <td class="cell-sub nowrap">${w.lastRun}</td>
                <td class="r"><button class="icon-btn" data-action="row-menu" aria-label="Actions for ${w.name}" onclick="event.stopPropagation()">${icon('dots')}</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </article>`,

  detail: wf => `
    <div class="back-row">
      <a class="back-link" href="#/automations">${icon('arrowL', 'ico14')}Back to automations</a>
      <span class="muted">/</span>
      <span class="cell-sub num">${wf.id}</span>
    </div>
    <header class="page-head row spread wrap gap4">
      <div class="row gap3">
        <h1 class="page-title" style="font-size:var(--text-2xl)">${wf.name}</h1>
        <span class="dirty-dot" data-tip="Unsaved changes"></span>
      </div>
      <div class="row gap2">
        <button class="btn btn-ghost">Discard</button>
        <button class="btn btn-primary" data-action="toast" data-variant="ok" data-msg="Workflow saved">Save changes</button>
      </div>
    </header>

    ${wf.dryRun ? `<div class="banner warn" style="margin-bottom:var(--s5)">${icon('alert')}
      <div><b>Dry run is on.</b> Runs are recorded, but nothing is written and no messages are sent.</div></div>` : ''}

    <article class="card card-pad" style="margin-bottom:var(--s5)">
      <div class="form-row" style="padding-top:0">
        <div><h4>Name</h4><p class="desc">Shown on every record this automation touches.</p></div>
        <div style="max-width:420px"><input class="input" value="${wf.name}" aria-label="Automation name"></div>
      </div>
      <div class="form-row">
        <div><h4>Enabled</h4><p class="desc">Run against ${wf.scope.toLowerCase()}.</p></div>
        <label class="switch"><input type="checkbox" ${wf.enabled ? 'checked' : ''}><span class="track"><span class="thumb"></span></span><span>Active</span></label>
      </div>
      <div class="form-row" style="padding-bottom:0">
        <div><h4>Dry run</h4><p class="desc">Record what would happen; no writes, no messages.</p></div>
        <label class="switch"><input type="checkbox" ${wf.dryRun ? 'checked' : ''}><span class="track"><span class="thumb"></span></span><span>Simulate only</span></label>
      </div>
    </article>

    <article class="card card-pad" style="margin-bottom:var(--s5)">
      <div class="row gap3 wrap">
        <b style="font-size:var(--text-sm)">Simulate</b>
        <input class="input" style="width:150px" placeholder="Account ID" value="CUS-4821">
        <select class="select" style="width:auto"><option>as an update</option><option>as a new account</option></select>
        <button class="btn btn-default btn-sm" data-action="simulate">${icon('play')} Run</button>
        <span class="hint" style="flex:1;min-width:220px">Runs the rules as shown — saved or not — against a stored record. Nothing is sent or written.</span>
      </div>
      <div data-slot="sim"></div>
    </article>

    <div class="section-head">
      <h3>Rules</h3>
      <p>Evaluated top to bottom on every matching change</p>
    </div>
    ${wf.rules.length
      ? `<div class="rule-list">${wf.rules.map((r, i) => ruleCard(r, i, wf.rules.length)).join('')}</div>`
      : `<div class="card"><div class="empty">
          <div class="empty-art">${icon('bolt')}</div>
          <div class="stack gap2"><h3>No rules yet</h3><p>Add a rule to describe which records this automation should act on.</p></div>
        </div></div>`}
    <button class="btn btn-ghost btn-sm" style="margin-top:var(--s3)" data-action="toast" data-msg="Rule added">${icon('plus')} Add rule</button>`,

  mount(root) {
    /* collapse / expand a rule */
    root.addEventListener('click', e => {
      const t = e.target.closest('[data-action="toggle-rule-body"]');
      if (!t) return;
      const card = t.closest('.rule-card');
      const open = card.classList.toggle('is-open');
      const n = card.querySelector('.rule-index')?.textContent || '';
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} rule ${n}`);
      const r = currentWf?.rules[Number(n) - 1];
      if (r) r.open = open;
    });

    /* drag a rule to a new position: the helper reports the move, the page
       reorders its own data and redraws the list. */
    const list = root.querySelector('.rule-list');
    if (list && currentWf) {
      reorder(list, {
        item: '.rule-card',
        handle: '.rule-grip',
        onMove: (from, to) => {
          const rs = currentWf.rules;
          rs.splice(to, 0, rs.splice(from, 1)[0]);
          list.innerHTML = rs.map((r, i) => ruleCard(r, i, rs.length)).join('');
        },
      });
    }

    /* typeahead popup for chip values */
    root.addEventListener('click', e => {
      const add = e.target.closest('[data-action="typeahead"]');
      root.querySelectorAll('.typeahead-pop').forEach(p => p.remove());
      if (!add) return;
      const pop = document.createElement('div');
      pop.className = 'typeahead-pop';
      pop.innerHTML = `<div style="padding:var(--s2)"><input class="input" style="height:28px" placeholder="Search values…" autofocus></div>` +
        ['Starter', 'Growth', 'Scale', 'Enterprise'].map(b =>
          `<button data-val="${b}">${b}<span class="cell-sub">plan</span></button>`).join('');
      add.parentElement.appendChild(pop);
      pop.querySelector('input')?.focus();
      pop.addEventListener('click', ev => {
        const b = ev.target.closest('[data-val]'); if (!b) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `${b.dataset.val}<button class="chip-x hit-expand" data-action="chip-remove" aria-label="Remove ${b.dataset.val}">${icon('x')}</button>`;
        add.parentElement.insertBefore(chip, add);
        pop.remove();
      });
    });
    root.addEventListener('click', e => {
      const x = e.target.closest('[data-action="chip-remove"]');
      if (x) x.parentElement.remove();
    });
    /* dim a rule card live when its toggle flips */
    root.addEventListener('change', e => {
      const t = e.target.closest('[data-action="toggle-rule"]');
      if (t) t.closest('.rule-card').classList.toggle('is-disabled', !t.checked);
    });
  },
};

/* ============================================================
   LOGS — live stream with filters
   ============================================================ */
const logRow = e => {
  const lvl = e.level.toLowerCase();
  const cls = lvl === 'error' ? 'error' : lvl === 'warn' ? 'warn' : lvl === 'debug' ? 'debug' : '';
  const attrs = Object.entries(e.attrs)
    .map(([k, v]) => `<span class="log-attr"><b>${k}</b>=${typeof v === 'string' ? v : String(v)}</span>`).join('');
  return `<div class="log-row ${cls}" data-level="${lvl}" data-text="${(e.msg + ' ' + JSON.stringify(e.attrs)).toLowerCase().replace(/"/g, '')}">
    <span class="log-time">${e.time.toTimeString().slice(0, 8)}</span>
    <span class="log-level">${e.level}</span>
    <span class="log-msg">${e.msg}${attrs}</span>
  </div>`;
};

export const logs = {
  title: 'Logs',
  render: () => `
    ${head('Logs', 'Everything the services emit, newest first. Filters apply to the buffered window.', `
      <button class="btn btn-default" data-action="freeze">${icon('clock')} Freeze</button>
      <button class="btn btn-default" data-action="toast" data-msg="Log buffer refreshed">${icon('bolt')} Refresh</button>
    `)}
    <article class="card">
      <div class="filter-bar">
        <select class="select" data-action="log-level" aria-label="Filter by level">
          ${['All levels', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(l => `<option>${l}</option>`).join('')}
        </select>
        <select class="select" style="min-width:170px" aria-label="Filter by source">
          <option>All sources</option><option>API</option><option>Automations</option>
          <option>Billing</option><option>Workers</option><option>Auth</option>
        </select>
        <div class="input-group" style="width:230px">${icon('search')}
          <input class="input" placeholder="Search messages and attributes…" data-action="log-search">
        </div>
        <button class="btn btn-ghost btn-sm" data-action="log-options">Options</button>
        <div class="grow"></div>
        <span class="badge ok"><i class="dot pulse"></i>Streaming</span>
        <span class="cell-sub num" data-slot="log-count">${D.logEntries.length} lines</span>
      </div>
      <div class="log-list" data-slot="log-list">
        ${D.logEntries.map(logRow).join('')}
        <div class="empty" hidden data-slot="log-empty">
          <div class="empty-art">${icon('search')}</div>
          <div class="stack gap2"><h3>No matching lines</h3><p>Nothing in the buffered window matches these filters.</p></div>
        </div>
      </div>
      <div class="card-foot">
        <span>Buffer holds the last 2,000 lines · retention 30 days</span>
        <a href="#/settings" style="color:var(--accent);font-weight:500">Logging settings</a>
      </div>
    </article>`,

  mount(root) {
    const list = root.querySelector('[data-slot="log-list"]');
    const empty = root.querySelector('[data-slot="log-empty"]');
    const count = root.querySelector('[data-slot="log-count"]');
    let level = 'all', q = '';
    const apply = () => {
      let n = 0;
      list.querySelectorAll('.log-row').forEach(r => {
        const hit = (level === 'all' || r.dataset.level === level) && (!q || r.dataset.text.includes(q));
        r.hidden = !hit; if (hit) n++;
      });
      empty.hidden = n > 0;
      count.textContent = `${n} line${n === 1 ? '' : 's'}`;
    };
    root.addEventListener('change', e => {
      if (e.target.closest('[data-action="log-level"]')) {
        const v = e.target.value;
        level = v.startsWith('All') ? 'all' : v.toLowerCase();
        apply();
      }
    });
    root.addEventListener('input', e => {
      if (e.target.closest('[data-action="log-search"]')) { q = e.target.value.toLowerCase(); apply(); }
    });
    root.addEventListener('click', e => {
      const f = e.target.closest('[data-action="freeze"]');
      if (f) {
        const on = f.classList.toggle('btn-primary');
        f.classList.toggle('btn-default', !on);
        f.lastChild.textContent = on ? ' Frozen' : ' Freeze';
        window.__toast?.({ title: on ? 'Stream frozen' : 'Stream resumed' });
      }
    });
  },
};

/* ============================================================
   CUSTOMER DETAIL — master → detail with typed event history
   ============================================================ */
const diffTable = rows => `
  <table class="diff-table">
    <thead><tr><th>Field</th><th>Was</th><th>Now</th></tr></thead>
    <tbody>${rows.map(([f, a, b]) => `<tr>
      <td class="field">${f}</td><td><span class="diff-old">${a}</span></td><td><span class="diff-new">${b}</span></td>
    </tr>`).join('')}</tbody>
  </table>`;

const eventCard = e => `
  <div class="event ${e.tone}" ${e.noop ? 'data-noop="1"' : ''}>
    <div class="event-card">
      <div class="event-head">
        <span class="title">${e.title}</span>
        <span class="src">${e.source}</span>
        <span class="time">${e.time}</span>
      </div>
      ${e.detail ? `<div class="event-body">${e.detail}</div>` : ''}
      ${e.diff ? `<div class="event-body">${diffTable(e.diff)}</div>` : ''}
      ${e.note ? `<div class="note"><div class="note-author">${e.note.author}</div><div class="note-text">${e.note.text}</div></div>` : ''}
      ${e.error ? `<pre class="code" style="margin-top:var(--s2)">${e.error}</pre>` : ''}
    </div>
  </div>`;

export const customerDetail = {
  title: 'Customer',
  render(id) {
    const c = D.customers.find(x => x.id === id) || D.customers[0];
    const sm = statusMeta[c.status];
    return `
    <div class="back-row">
      <a class="back-link" href="#/customers">${icon('arrowL', 'ico14')}Back to customers</a>
      <span class="muted">/</span>
      <span class="cell-sub num">${c.id}</span>
    </div>
    <header class="page-head row spread wrap gap4">
      <div class="row gap4">
        <span class="avatar lg">${initials(c.name)}</span>
        <div>
          <h1 class="page-title" style="font-size:var(--text-2xl)">${c.name}</h1>
          <div class="row gap2 wrap" style="margin-top:6px">
            <span class="badge ${sm.cls}"><i class="dot"></i>${sm.label}</span>
            <span class="badge outline">${c.plan}</span>
            <span class="cell-sub">${c.company} · ${c.email}</span>
          </div>
        </div>
      </div>
      <div class="row gap2">
        <button class="btn btn-default">${icon('mail')} Email</button>
        <button class="btn btn-default" data-action="drawer" data-id="${c.id}">Quick view</button>
        <button class="btn btn-primary">Edit account</button>
      </div>
    </header>

    ${c.status === 'past_due' ? `<div class="banner bad" style="margin-bottom:var(--s5)">${icon('alert')}
      <div><b>Payment past due.</b> The last invoice failed twice; access is limited in 4 days.</div>
      <button class="btn btn-danger btn-sm">Retry charge</button></div>` : ''}

    <div class="meta-grid" style="margin-bottom:var(--s6)">
      ${[['MRR', money(c.mrr)], ['Seats', c.seats], ['Usage', c.usage + '%'], ['Plan', c.plan],
         ['Joined', c.joined.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
         ['Last seen', c.lastSeen]]
        .map(([k, v]) => `<div><div class="eyebrow">${k}</div><div class="val num">${v}</div></div>`).join('')}
    </div>

    <div class="tabs" data-tabs="cust" style="margin-bottom:var(--s5)">
      <button class="on" data-tab="history">History</button>
      <button data-tab="usage">Usage</button>
      <button data-tab="raw">Raw record</button>
    </div>

    <div data-panel="history">
      <div class="row spread wrap gap3" style="margin-bottom:var(--s4)">
        <span class="cell-sub">${D.accountEvents.length} events in the last 30 days</span>
        <label class="check">
          <input type="checkbox" data-action="show-noops"><span class="box">${icon('check')}</span>
          <span style="font-size:var(--text-sm)">Show runs where nothing happened</span>
        </label>
      </div>
      <div class="events" data-slot="events">
        ${D.accountEvents.map(eventCard).join('')}
      </div>
    </div>

    <div data-panel="usage" hidden>
      <article class="card">
        <div class="card-head"><div><h3>Consumption</h3><p>API requests per month</p></div></div>
        <div class="card-body">${areaChart({
          labels: D.months,
          series: [{ name: 'Requests', color: 'var(--chart-2)', points: [32, 41, 38, 52, 61, 58, 72, 80, c.usage] }],
          fmt: v => Math.round(v) + 'k',
        })}</div>
      </article>
    </div>

    <div data-panel="raw" hidden>
      <article class="card card-pad">
        <pre class="code">${JSON.stringify({
          id: c.id, name: c.name, email: c.email, company: c.company,
          plan: c.plan, status: c.status, mrr: c.mrr, seats: c.seats,
          usage_pct: c.usage, joined: c.joined.toISOString().slice(0, 10),
        }, null, 2)}</pre>
      </article>
    </div>`;
  },
  mount(root) {
    const sync = () => {
      const show = root.querySelector('[data-action="show-noops"]')?.checked;
      root.querySelectorAll('[data-noop]').forEach(e => e.hidden = !show);
    };
    root.addEventListener('change', e => { if (e.target.closest('[data-action="show-noops"]')) sync(); });
    sync();
  },
};

/* ============================================================
   SIGN-IN — the pre-console screens
   ============================================================ */
export const signin = {
  title: 'Sign in',
  render: () => `
    <div class="auth">
      <div class="stack gap5" style="width:100%;max-width:372px">
        <div class="seg" style="align-self:center" data-tabs="auth">
          <button class="on" data-tab="login">Sign in</button>
          <button data-tab="totp">Two-factor</button>
          <button data-tab="reset">New password</button>
        </div>

        <div data-panel="login">
          <div class="auth-card">
            <div class="auth-brand">
              <div class="brand-mark">n</div><div class="brand-name">navi</div>
            </div>
            <div>
              <h1>Sign in</h1>
              <p>Enter your credentials to continue.</p>
            </div>
            <div class="field"><label>Email</label><input class="input" type="email" placeholder="you@company.com"></div>
            <div class="field">
              <label>Password</label>
              <input class="input" type="password" placeholder="••••••••••">
            </div>
            <label class="check"><input type="checkbox"><span class="box">${icon('check')}</span><span style="font-size:var(--text-sm)">Keep me signed in</span></label>
            <button class="btn btn-primary btn-lg" data-action="toast" data-variant="ok" data-msg="Signed in">Continue</button>
            <div class="callout bad">${icon('alert')}<div class="body">Incorrect email or password. 3 attempts remaining.</div></div>
            <div class="auth-foot">Trouble signing in? <a href="#/signin" style="color:var(--accent)">Contact an admin</a></div>
          </div>
        </div>

        <div data-panel="totp" hidden>
          <div class="auth-card">
            <div class="auth-brand"><div class="brand-mark">n</div><div class="brand-name">navi</div></div>
            <div>
              <h1>Two-factor auth</h1>
              <p>Enter the 6-digit code from your authenticator app.</p>
            </div>
            <input class="input otp-input" inputmode="numeric" maxlength="6" placeholder="000000">
            <button class="btn btn-primary btn-lg" data-action="toast" data-variant="ok" data-msg="Code accepted">Verify</button>
            <div class="auth-foot">Lost your device? <a href="#/signin" style="color:var(--accent)">Use a recovery code</a></div>
          </div>
        </div>

        <div data-panel="reset" hidden>
          <div class="auth-card">
            <div class="auth-brand"><div class="brand-mark">n</div><div class="brand-name">navi</div></div>
            <div>
              <h1>Change password</h1>
              <p>Your password must be changed before continuing.</p>
            </div>
            <div class="field"><label>Current password</label><input class="input" type="password" placeholder="••••••••••"></div>
            <div class="field">
              <label>New password</label>
              <input class="input" type="password" placeholder="••••••••••" data-action="pwd">
              <div class="pwd-reqs" data-slot="reqs">
                ${[['len', 'At least 12 characters'], ['upper', 'One uppercase letter'],
                   ['num', 'One number'], ['sym', 'One symbol']]
                  .map(([k, l]) => `<span class="pwd-req" data-req="${k}">${icon('check')}${l}</span>`).join('')}
              </div>
            </div>
            <div class="field"><label>Confirm new password</label><input class="input" type="password" placeholder="••••••••••"></div>
            <button class="btn btn-primary btn-lg" data-action="toast" data-variant="ok" data-msg="Password changed">Change password</button>
          </div>
        </div>

        <div class="auth-foot"><a class="back-link" href="#/overview">${icon('arrowL', 'ico14')}Back to the console</a></div>
      </div>
    </div>`,
  mount(root) {
    const input = root.querySelector('[data-action="pwd"]');
    input?.addEventListener('input', e => {
      const v = e.target.value;
      const tests = { len: v.length >= 12, upper: /[A-Z]/.test(v), num: /\d/.test(v), sym: /[^A-Za-z0-9]/.test(v) };
      root.querySelectorAll('[data-req]').forEach(el => el.classList.toggle('ok', tests[el.dataset.req]));
    });
  },
};

export const registry = { overview, analytics, customers, customerDetail, automations, tasks, logs, components, settings, signin };
