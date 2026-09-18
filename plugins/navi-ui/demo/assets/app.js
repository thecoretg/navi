import { icon } from '../../skills/navi-ui/assets/icons.js';
import * as D from './data.js';
import { registry } from './pages.js';
import { sparkline } from '../../skills/navi-ui/assets/charts.js';

const qs = new URLSearchParams(location.search);

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- navigation model ---------- */
const NAV = [
  { label: 'Analyse', items: [
    { id: 'overview',  name: 'Overview',  icon: 'gauge' },
    { id: 'analytics', name: 'Analytics', icon: 'chart' },
  ]},
  { label: 'Operate', items: [
    { id: 'customers',   name: 'Customers',   icon: 'users', pill: '64' },
    { id: 'automations', name: 'Automations', icon: 'bolt' },
    { id: 'tasks',       name: 'Tasks',       icon: 'board', pill: '10' },
    { id: 'logs',        name: 'Logs',        icon: 'inbox' },
  ]},
  { label: 'System', items: [
    { id: 'components', name: 'Components', icon: 'blocks' },
    { id: 'settings',   name: 'Settings',   icon: 'cog' },
  ]},
];
const flatNav = NAV.flatMap(g => g.items);

/* ---------- boot ---------- */
const app = $('#app');

function buildSidebar() {
  $('#nav').innerHTML = NAV.map(g => `
    <div class="nav-group">
      <div class="nav-label eyebrow">${g.label}</div>
      ${g.items.map(i => `
        <a class="nav-item" href="#/${i.id}" data-nav="${i.id}">
          ${icon(i.icon)}<span class="label">${i.name}</span>
          ${i.pill ? `<span class="pill num">${i.pill}</span>` : ''}
        </a>`).join('')}
    </div>`).join('');
}

/* ---------- router ---------- */
/* a page id plus an optional record id: #/customers/CUS-4821 */
const DETAIL = { customers: 'customerDetail' };

let currentPage = null;
function route() {
  const [seg, param] = location.hash.replace('#/', '').split('/');
  const base = registry[seg] ? seg : 'overview';
  const key = param && DETAIL[base] ? DETAIL[base] : base;
  currentPage = registry[key];

  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === base));
  app.classList.toggle('auth-mode', base === 'signin');
  $('#crumb-here').textContent = param ? param : currentPage.title;
  $('#crumb-parent').innerHTML = param || key !== base
    ? `<a href="#/${base}">${registry[base].title}</a><span class="sep">/</span>`
    : '';
  document.title = `${currentPage.title} · navi`;

  const view = $('#view');
  const paint = () => {
    view.innerHTML = currentPage.render(param);
    view.scrollTop = 0;
    window.scrollTo({ top: 0 });
    currentPage.mount?.(view);
  };

  /* ?rerender=on reproduces what a data-backed app does: draw a loading
     skeleton, then replace it when the response lands. It is the pattern that
     exposes an entry animation as too long or too movement-heavy. */
  if (qs.get('rerender') === 'on') {
    view.innerHTML = `<div class="card card-pad stack gap3">
      <div class="skeleton" style="height:14px;width:34%"></div>
      <div class="skeleton" style="height:9px"></div>
      <div class="skeleton" style="height:9px;width:76%"></div>
    </div>`;
    setTimeout(paint, 70);
  } else {
    paint();
  }
  app.classList.remove('nav-open');
  closeScrim();
}
addEventListener('hashchange', route);

/* ---------- keyboard hints ----------
   A shortcut is only useful if the reader can name the keys. Apple keyboards
   get the glyph they are printed with; everyone else gets the word. */
const IS_APPLE = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || '');
const KEY_LABEL = {
  mod:   IS_APPLE ? '⌘'   : 'Ctrl',
  shift: IS_APPLE ? '⇧'   : 'Shift',
  alt:   IS_APPLE ? '⌥'   : 'Alt',
  enter: IS_APPLE ? '↵'   : 'Enter',
};
const KEY_SPOKEN = { mod: IS_APPLE ? 'Command' : 'Control', shift: 'Shift', alt: IS_APPLE ? 'Option' : 'Alt', enter: 'Enter' };

/* keys('mod+K') → two keycaps; .spoken gives the screen-reader phrasing */
function keys(combo) {
  const parts = combo.split('+');
  return parts.map(k => `<span class="kbd">${KEY_LABEL[k] || k.toUpperCase()}</span>`).join('<span class="sep">+</span>');
}
function keysSpoken(combo) {
  return combo.split('+').map(k => KEY_SPOKEN[k] || k.toUpperCase()).join(' ');
}

/* ---------- palettes ---------- */
export const PALETTES = [
  { id: 'harbor',   name: 'Harbor',   desc: 'Cool grey, deep teal accent',   seed: '#0E6F80' },
  { id: 'ember',    name: 'Ember',    desc: 'Warm paper, persimmon accent',  seed: '#C64A26' },
  { id: 'indigo',   name: 'Indigo',   desc: 'Slate neutrals, indigo accent', seed: '#3D45A8' },
  { id: 'moss',     name: 'Moss',     desc: 'Sage neutrals, forest accent',  seed: '#3E6B43' },
  { id: 'plum',     name: 'Plum',     desc: 'Mauve neutrals, plum accent',   seed: '#8E3A63' },
  { id: 'graphite', name: 'Graphite', desc: 'Monochrome, ink accent',        seed: '#26251F' },
];
const PALETTE_KEY = 'navi-palette';
window.__palettes = PALETTES;

function setPalette(id) {
  document.documentElement.dataset.palette = id;
  localStorage.setItem(PALETTE_KEY, id);
  $$('.palette-card').forEach(c => c.classList.toggle('on', c.dataset.palette === id));
}
window.__setPalette = setPalette;
setPalette(localStorage.getItem(PALETTE_KEY) || 'harbor');

function openPaletteMenu(anchor) {
  const cur = document.documentElement.dataset.palette;
  openMenu(anchor, PALETTES.map(p => ({
    label: p.name, swatch: p.seed, current: p.id === cur, run: () => {
      setPalette(p.id);
      toast({ title: `${p.name} palette`, msg: p.desc });
    },
  })));
}

/* ---------- theme ---------- */
const THEME_KEY = 'navi-theme';
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem(THEME_KEY, t);
  $('#theme-btn').innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
}
setTheme(localStorage.getItem(THEME_KEY) ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

/* ---------- overlays ---------- */
const scrim = $('#scrim');
function openScrim(cb) { scrim.classList.add('on'); scrim._cb = cb; }
function closeScrim() {
  scrim.classList.remove('on');
  $('#modal').classList.remove('on');
  $('#drawer').classList.remove('on');
  $('#cmdk').classList.remove('on');
  app.classList.remove('nav-open');
  closeMenu();
}
scrim.addEventListener('click', closeScrim);
addEventListener('keydown', e => {
  if (e.key === 'Escape') closeScrim();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
});

function openModal({ title, body, confirm = 'Confirm', variant = 'primary', onConfirm }) {
  $('#modal').innerHTML = `
    <div class="modal-head"><h3>${title}</h3></div>
    <div class="modal-body">${body}</div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close>Cancel</button>
      <button class="btn btn-${variant}" data-confirm>${confirm}</button>
    </div>`;
  $('#modal').classList.add('on');
  openScrim();
  $('#modal [data-close]').onclick = closeScrim;
  $('#modal [data-confirm]').onclick = () => { closeScrim(); onConfirm?.(); };
  setTimeout(() => $('#modal input')?.focus(), 60);
}

function openDrawer(id) {
  const c = D.customers.find(x => x.id === id) || D.customers[0];
  const sm = D.statusMeta[c.status];
  $('#drawer').innerHTML = `
    <div class="drawer-head">
      <div class="row gap3">
        <span class="avatar lg">${D.initials(c.name)}</span>
        <div>
          <h3 style="font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-tracking);font-size:var(--text-xl);line-height:1.2">${c.name}</h3>
          <div class="cell-sub">${c.email}</div>
          <div class="row gap2" style="margin-top:6px">
            <span class="badge ${sm.cls}"><i class="dot"></i>${sm.label}</span>
            <span class="badge outline">${c.plan}</span>
          </div>
        </div>
      </div>
      <button class="icon-btn" data-close aria-label="Close panel">${icon('x')}</button>
    </div>
    <div class="drawer-body stack gap6">
      <div class="grid g2" style="gap:var(--s3)">
        ${[['MRR', D.money(c.mrr)], ['Seats', c.seats], ['Usage', c.usage + '%'], ['Account', c.id]]
          .map(([k, v]) => `<div class="card card-pad" style="padding:var(--s3) var(--s4)">
            <div class="eyebrow">${k}</div>
            <div class="num" style="font-size:var(--text-lg);margin-top:4px">${v}</div></div>`).join('')}
      </div>
      <div class="stack gap3">
        <div class="eyebrow">Consumption — last 9 months</div>
        ${sparkline([32,41,38,52,61,58,72,80,c.usage], 'var(--accent)', 400, 96)}
      </div>
      <div class="stack gap3">
        <div class="eyebrow">Details</div>
        ${[['Company', c.company], ['Joined', c.joined.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
           ['Last seen', c.lastSeen], ['Owner', 'Marta Okonkwo']]
          .map(([k, v]) => `<div class="row spread" style="font-size:var(--text-sm);padding-bottom:var(--s2);border-bottom:1px solid var(--line-soft)">
            <span class="muted">${k}</span><span>${v}</span></div>`).join('')}
      </div>
      <div class="stack gap3">
        <div class="eyebrow">Recent events</div>
        <div class="timeline">
          ${[['12:04','Signed in from Lisbon, PT'], ['Yesterday','Invoice INV-2026-0912 paid'], ['Sep 9','Added 4 seats'], ['Aug 28','Upgraded to ' + c.plan]]
            .map(([t, e], i) => `<div class="tl-item ${i === 0 ? 'accent' : ''}">
              <div class="tl-time">${t}</div>
              <div style="font-size:var(--text-sm);margin-top:2px">${e}</div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-ghost" data-close>Close</button>
      <button class="btn btn-default">${icon('mail')} Email</button>
      <a class="btn btn-primary" href="#/customers/${c.id}" data-close>Open full record</a>
    </div>`;
  $('#drawer').classList.add('on');
  openScrim();
  $$('#drawer [data-close]').forEach(b => b.onclick = closeScrim);
}

/* ---------- toasts ---------- */
let toastId = 0;
function toast({ title = 'Done', msg = '', variant = '' }) {
  const el = document.createElement('div');
  el.className = `toast ${variant}`;
  el.innerHTML = `${icon(variant === 'bad' ? 'alert' : variant === 'ok' ? 'check' : 'info')}
    <div><b>${title}</b>${msg ? `<p>${msg}</p>` : ''}</div>`;
  el.id = 't' + toastId++;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 200); }, 3200);
}
window.__toast = toast;

/* ---------- command palette ---------- */
const CMDS = [
  ...flatNav.map(n => ({ label: 'Go to ' + n.name, icon: n.icon, run: () => location.hash = '#/' + n.id })),
  { label: 'Toggle light / dark theme', icon: 'moon', run: () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark') },
  { label: 'Collapse sidebar', icon: 'panel', run: () => app.classList.toggle('collapsed') },
  { label: 'New customer', icon: 'plus', run: () => newCustomerModal() },
  { label: 'Export data', icon: 'download', run: () => toast({ title: 'Export started', msg: 'A CSV will land in your inbox.', variant: 'ok' }) },
  { label: 'Read the docs', icon: 'book', run: () => toast({ title: 'Docs', msg: 'Mockup — no destination wired.' }) },
  { label: 'Open a customer record', icon: 'users', run: () => location.hash = '#/customers/' + D.customers[0].id },
  { label: 'Open a workflow', icon: 'bolt', run: () => location.hash = '#/automations/WF-01' },
  { label: 'View sign-in screens', icon: 'key', run: () => location.hash = '#/signin' },
  ...PALETTES.map(p => ({ label: `Palette: ${p.name}`, icon: 'blocks', run: () => {
    setPalette(p.id); toast({ title: `${p.name} palette`, msg: p.desc });
  } })),
];
let cmdCursor = 0;

function renderCmds(q = '') {
  const list = CMDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  cmdCursor = Math.min(cmdCursor, Math.max(0, list.length - 1));
  $('#cmdk-list').innerHTML = list.length
    ? list.map((c, i) => `<button class="cmdk-item ${i === cmdCursor ? 'cursor' : ''}" data-cmd="${CMDS.indexOf(c)}">
        ${icon(c.icon)}<span>${c.label}</span>${c.kbd ? `<span class="keys">${keys(c.kbd)}</span>` : ''}</button>`).join('')
    : `<div class="cmdk-empty">No commands match that search.</div>`;
  return list;
}
function openCmdk() {
  $('#cmdk').classList.add('on'); openScrim();
  const input = $('#cmdk-input'); input.value = ''; cmdCursor = 0; renderCmds();
  setTimeout(() => input.focus(), 40);
}
$('#cmdk-input').addEventListener('input', e => { cmdCursor = 0; renderCmds(e.target.value); });
$('#cmdk-input').addEventListener('keydown', e => {
  const list = renderCmds($('#cmdk-input').value);
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdCursor = (cmdCursor + 1) % list.length; renderCmds($('#cmdk-input').value); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); cmdCursor = (cmdCursor - 1 + list.length) % list.length; renderCmds($('#cmdk-input').value); }
  if (e.key === 'Enter')     { e.preventDefault(); const c = list[cmdCursor]; if (c) { closeScrim(); c.run(); } }
});
$('#cmdk-list').addEventListener('click', e => {
  const b = e.target.closest('[data-cmd]'); if (!b) return;
  closeScrim(); CMDS[+b.dataset.cmd].run();
});

/* ---------- popover menu ---------- */
let menuEl = null;
function closeMenu() { menuEl?.remove(); menuEl = null; }
function openMenu(anchor, items) {
  closeMenu();
  menuEl = document.createElement('div');
  menuEl.className = 'menu';
  menuEl.innerHTML = items.map(i => i === '-' ? '<hr>' :
    `<button class="${i.danger ? 'danger' : ''}" data-mi="${i.label}">
       ${i.swatch ? `<span class="swatch" style="background:${i.swatch}"></span>` : icon(i.icon)}
       ${i.label}
       ${i.current ? '<span class="check-mark">●</span>' : ''}
     </button>`).join('');
  document.body.appendChild(menuEl);
  const r = anchor.getBoundingClientRect();
  menuEl.style.top = `${window.scrollY + r.bottom + 6}px`;
  menuEl.style.left = `${Math.min(r.right - menuEl.offsetWidth, innerWidth - menuEl.offsetWidth - 12)}px`;
  menuEl.addEventListener('click', e => {
    const b = e.target.closest('[data-mi]'); if (!b) return;
    const item = items.find(i => i !== '-' && i.label === b.dataset.mi);
    closeMenu(); item.run?.();
  });
}
document.addEventListener('click', e => { if (menuEl && !menuEl.contains(e.target)) closeMenu(); }, true);

/* ---------- modals ---------- */
function newCustomerModal() {
  openModal({
    title: 'Add customer',
    body: `<div class="stack gap4">
      <div class="field"><label>Full name</label><input class="input" placeholder="Ada Lovelace"></div>
      <div class="field"><label>Work email</label><input class="input" placeholder="ada@company.com"></div>
      <div class="grid g2" style="gap:var(--s3)">
        <div class="field"><label>Company</label><input class="input" placeholder="Analytical Engines"></div>
        <div class="field"><label>Plan</label><select class="select"><option>Starter</option><option selected>Growth</option><option>Scale</option><option>Enterprise</option></select></div>
      </div>
      <label class="check"><input type="checkbox" checked><span class="box">${icon('check')}</span>
        <span>Send a welcome email<br><span class="hint">Includes onboarding checklist and API keys.</span></span></label>
    </div>`,
    confirm: 'Create customer',
    onConfirm: () => toast({ title: 'Customer created', msg: 'Welcome email queued.', variant: 'ok' }),
  });
}

function confirmDelete() {
  openModal({
    title: 'Delete permanently?',
    body: `<div class="callout bad">${icon('alert')}<div class="body">
      <b>This cannot be undone</b>All associated invoices, events and API keys are removed immediately.</div></div>`,
    confirm: 'Yes, delete',
    variant: 'danger',
    onConfirm: () => toast({ title: 'Deleted', msg: 'The records were removed.', variant: 'bad' }),
  });
}

/* ---------- delegated actions ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]');

  /* table rows: data-href navigates, data-id opens the quick-view drawer */
  const linkRow = e.target.closest('tbody tr[data-href]');
  if (linkRow && !t) { location.hash = linkRow.dataset.href; return; }
  const row = e.target.closest('tbody tr[data-id]');
  if (row && !t) { openDrawer(row.dataset.id); return; }

  if (!t) return;
  const a = t.dataset.action;

  if (a === 'toast')  toast({ title: t.dataset.msg || 'Done', variant: t.dataset.variant || '' });
  if (a === 'modal')  newCustomerModal();
  if (a === 'confirm-delete') confirmDelete();
  if (a === 'drawer') openDrawer(t.dataset.id);
  if (a === 'cmdk')    openCmdk();
  if (a === 'palette') openPaletteMenu(t);
  if (a === 'set-palette') {
    setPalette(t.dataset.palette);
    toast({ title: `${t.dataset.palette} palette`, msg: 'Applied across every page.' });
  }
  if (a === 'theme')  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  if (a === 'collapse') { app.classList.toggle('collapsed'); localStorage.setItem('navi-collapsed', app.classList.contains('collapsed')); }
  if (a === 'mobile-nav') { app.classList.add('nav-open'); openScrim(); }
  if (a === 'notifications') toast({ title: '3 unread notifications', msg: 'Billing, deploys and one mention.' });

  if (a === 'cond-test') {
    const out = t.parentElement.querySelector('[data-slot="cond-result"]');
    out.className = 'cond-result ok';
    out.textContent = '✓ matches ticket #48213';
  }

  if (a === 'simulate') {
    const slot = $('[data-slot="sim"]');
    slot.innerHTML = `
      <div class="callout ok" style="margin-top:var(--s4)">${icon('check')}<div class="body">
        <b>Rule 1 matched — “Warn owners at 90% of plan limit”</b>
        2 actions would run. Chain stopped after this rule.</div></div>
      <div class="stack gap3" style="margin-top:var(--s3)">
        <div class="row gap2 wrap"><span class="eyebrow">Recipients</span>
          ${['#account-alerts', 'Marta Okonkwo', 'owners@navi.app'].map(r => `<span class="chip">${r}</span>`).join('')}
        </div>
        <div><div class="eyebrow" style="margin-bottom:var(--s2)">Message preview</div>
          <pre class="code">Usage warning · CUS-4821 — Northwind Labs
Plan:    Scale (5M requests / month)
Current: 4.6M requests — 92% of limit
Owner:   Marta Okonkwo</pre></div>
      </div>`;
    toast({ title: 'Simulation complete', msg: '1 of 3 rules matched.', variant: 'ok' });
  }

  if (a === 'log-options') {
    openMenu(t, [
      { label: 'Hide request logs', icon: 'check', run: () => toast({ title: 'Request logs hidden' }) },
      { label: 'Wrap long lines',   icon: 'check', run: () => toast({ title: 'Line wrap on' }) },
      { label: 'Download buffer',   icon: 'download', run: () => toast({ title: 'Buffer downloaded', variant: 'ok' }) },
    ]);
  }

  if (a === 'row-menu') {
    openMenu(t, [
      { label: 'View profile', icon: 'users', run: () => openDrawer(t.dataset.id) },
      { label: 'Send email',   icon: 'mail',  run: () => toast({ title: 'Draft opened' }) },
      { label: 'Copy ID',      icon: 'copy',  run: () => toast({ title: 'Copied', msg: t.dataset.id || '—', variant: 'ok' }) },
      '-',
      { label: 'Delete', icon: 'trash', danger: true, run: confirmDelete },
    ]);
  }

  /* ---- customers table ---- */
  const view = $('#view');
  const cust = registry.customers;
  if (a === 'page')     { cust.state.page = +t.dataset.page; cust.redraw(view); }
  if (a === 'clear-sel'){ cust.state.sel.clear(); cust.redraw(view); }
  if (a === 'clear-filters') {
    Object.assign(cust.state, { q: '', plan: 'all', status: 'all', page: 1 });
    route();
  }
  if (a === 'select-row') {
    const id = t.dataset.id;
    t.checked ? cust.state.sel.add(id) : cust.state.sel.delete(id);
    cust.redraw(view);
  }
  if (a === 'select-all') {
    const rows = cust.filtered().slice((cust.state.page - 1) * 10, cust.state.page * 10);
    t.checked ? rows.forEach(r => cust.state.sel.add(r.id)) : cust.state.sel.clear();
    cust.redraw(view);
  }

  /* segmented status filter */
  const segStatus = e.target.closest('[data-action="filter-status"] button');
  if (segStatus) {
    cust.state.status = segStatus.dataset.status; cust.state.page = 1;
    $$('[data-action="filter-status"] button').forEach(b => b.classList.toggle('on', b === segStatus));
    cust.redraw(view);
  }

  /* generic segmented controls */
  const seg = e.target.closest('.seg button');
  if (seg && !seg.closest('[data-action="filter-status"]')) {
    [...seg.parentElement.children].forEach(b => b.classList.toggle('on', b === seg));
  }

  /* sortable headers */
  const th = e.target.closest('th.sortable');
  if (th) {
    const k = th.dataset.sort;
    if (cust.state.sort === k) cust.state.dir *= -1;
    else { cust.state.sort = k; cust.state.dir = 1; }
    cust.state.page = 1;
    cust.redraw(view);
  }

  /* tabs */
  const tab = e.target.closest('[data-tabs] button');
  if (tab) {
    const bar = tab.closest('[data-tabs]');
    $$('button', bar).forEach(b => b.classList.toggle('on', b === tab));
    $$(`[data-panel]`, bar.parentElement).forEach(p => p.hidden = p.dataset.panel !== tab.dataset.tab);
  }
});

document.addEventListener('input', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const cust = registry.customers, view = $('#view');
  if (t.dataset.action === 'search')      { cust.state.q = t.value; cust.state.page = 1; cust.redraw(view); }
  if (t.dataset.action === 'filter-plan') { cust.state.plan = t.value; cust.state.page = 1; cust.redraw(view); }
});

/* ---------- chart tooltips ---------- */
const tip = $('#chart-tip');
document.addEventListener('mousemove', e => {
  const hit = e.target.closest('[data-tip-html]');
  if (!hit) { tip.classList.remove('on'); return; }
  tip.innerHTML = decodeURIComponent(hit.dataset.tipHtml);
  tip.classList.add('on');
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(e.clientX + 14, innerWidth - w - 10) + 'px';
  tip.style.top  = Math.max(8, e.clientY - h - 12) + 'px';

  const host = hit.closest('.chart-host');
  const line = host?.querySelector('.hover-line');
  if (line && hit.dataset.i !== undefined) {
    const xs = host.dataset.xs?.split(',').map(Number);
    if (xs) {
      line.setAttribute('x1', xs[+hit.dataset.i]);
      line.setAttribute('x2', xs[+hit.dataset.i]);
      line.style.opacity = .8;
    }
    host.querySelectorAll('.pt').forEach(p => p.style.opacity = p.dataset.i === hit.dataset.i ? 1 : 0);
  }
});
document.addEventListener('mouseout', e => {
  if (!e.relatedTarget?.closest?.('.chart-host')) {
    $$('.hover-line').forEach(l => l.style.opacity = 0);
    $$('.pt').forEach(p => p.style.opacity = 0);
  }
});

/* ---------- init ----------
   ?theme= and ?palette= force a look without touching saved preferences,
   so screenshots and visual checks are reproducible.
   ?chrome=off freezes animation; ?rerender=on simulates a slow API. */
if (qs.has('palette')) document.documentElement.dataset.palette = qs.get('palette');
if (qs.has('theme')) {
  document.documentElement.dataset.theme = qs.get('theme');
  $('#theme-btn').innerHTML = icon(qs.get('theme') === 'dark' ? 'sun' : 'moon');
}
if (qs.get('chrome') === 'off') document.body.classList.add('no-motion');

/* ---------- init ---------- */
$('#search-keys').innerHTML = keys('mod+K');
$('#search-btn').setAttribute('aria-label', `Search or jump to — press ${keysSpoken('mod+K')}`);
$('#search-btn').setAttribute('data-tip', `Search — ${KEY_LABEL.mod} K`);
buildSidebar();
if (localStorage.getItem('navi-collapsed') === 'true') app.classList.add('collapsed');
route();
