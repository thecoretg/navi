/* Mock data — deterministic so the mockup looks identical on every load. */

const rand = (seed => () => (seed = seed * 16807 % 2147483647) / 2147483647)(42);

export const money = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
export const compact = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M'
  : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(n);

export const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];

export const revenueSeries = {
  labels: months,
  series: [
    { name: 'Subscriptions', color: 'var(--chart-1)', points: [182,196,211,204,238,262,271,295,318] },
    { name: 'Usage',         color: 'var(--chart-2)', points: [ 74, 81, 79, 96,104,112,126,131,148] },
  ],
};

export const signupSeries = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  series: [
    { name: 'Trials',      color: 'var(--chart-1)', points: [42,58,51,73,66,31,27] },
    { name: 'Conversions', color: 'var(--chart-3)', points: [12,19,14,26,22, 9, 8] },
  ],
};

export const latency = {
  labels: ['00','03','06','09','12','15','18','21'],
  series: [{ name: 'p95 ms', color: 'var(--chart-2)', points: [118,104,96,142,188,204,176,131] }],
};

export const planMix = [
  { label: 'Scale',      value: 412, color: 'var(--chart-1)' },
  { label: 'Growth',     value: 786, color: 'var(--chart-2)' },
  { label: 'Starter',    value: 1194, color: 'var(--chart-3)' },
  { label: 'Enterprise', value: 138, color: 'var(--chart-4)' },
];

export const channels = [
  { label: 'Organic search', value: 38.4 },
  { label: 'Direct',         value: 24.1 },
  { label: 'Referral',       value: 17.6 },
  { label: 'Paid social',    value: 12.3 },
  { label: 'Email',          value: 7.6  },
];

export const regions = [
  { label: 'North America', value: 1420, delta:  8.2 },
  { label: 'Europe',        value:  968, delta: 12.4 },
  { label: 'APAC',          value:  611, delta: 21.7 },
  { label: 'LATAM',         value:  204, delta: -3.1 },
  { label: 'MEA',           value:   97, delta:  4.4 },
];

const firstNames = ['Marta','Kwame','Yuki','Diego','Priya','Noor','Otto','Lena','Ibrahim','Sasha','Wren','Tomas','Amara','Felix','Ines','Kai','Rosa','Jonas','Mei','Halima','Nils','Zara','Emil','Ravi','Clara','Theo','Nadia','Bruno','Iris','Omar','Greta','Luca','Ada','Samir','Vera','Hugo','Linnea','Pablo','Anwar','Juno'];
const lastNames = ['Okonkwo','Lindqvist','Tanaka','Ferreira','Raman','Haddad','Brandt','Novak','Diallo','Petrov','Ashby','Silva','Nwosu','Weiss','Moreau','Sato','Delgado','Berg','Chen','Toure','Sorensen','Malik','Kovac','Iyer','Bauer','Marchetti','Rahimi','Costa','Kelleher','Zaki','Hoffmann','Rossi','Lovelace','Chaudhry','Novotna','Almeida','Sundberg','Reyes','Farouk','Castellan'];
const companies = ['Northwind Labs','Halcyon Foods','Terrace Bio','Quill & Co','navi Freight','Stonepath','Lumen Optics','Ardent Tools','Fable Studio','Vector Kitchen','Pike & Rowe','Cobalt Rail','Juniper Health','Basalt Energy','Orchard Digital','Verity Press','Kestrel Sports','Mondo Textiles','Argus Security','Tidewater Co'];
const plans = ['Starter','Growth','Scale','Enterprise'];
const statuses = ['active','active','active','trial','past_due','churned'];

export const customers = Array.from({ length: 64 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last  = lastNames[(i * 7) % lastNames.length];
  const plan  = plans[Math.floor(rand() * plans.length)];
  const mrrBase = { Starter: 49, Growth: 199, Scale: 749, Enterprise: 2400 }[plan];
  return {
    id: 'CUS-' + String(4821 + i * 13),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.com`,
    company: companies[i % companies.length],
    plan,
    status: statuses[Math.floor(rand() * statuses.length)],
    mrr: Math.round(mrrBase * (0.8 + rand() * 0.8)),
    seats: 1 + Math.floor(rand() * 40),
    usage: Math.round(rand() * 100),
    joined: new Date(2024, Math.floor(rand() * 12), 1 + Math.floor(rand() * 28)),
    lastSeen: ['2 min ago','1 hr ago','Today','Yesterday','3 days ago','2 weeks ago'][Math.floor(rand() * 6)],
  };
});

export const activity = [
  { who: 'Marta Okonkwo', what: 'upgraded to <b>Scale</b>',              when: '12:04', accent: true },
  { who: 'System',        what: 'Nightly reconciliation completed',      when: '11:31' },
  { who: 'Kwame Diallo',  what: 'opened support request <b>#4821</b>',  when: '10:58' },
  { who: 'Yuki Tanaka',   what: 'invited 3 teammates',                   when: '10:12' },
  { who: 'System',        what: 'Payment failed for <b>Halcyon Foods</b>', when: '09:47', accent: true },
  { who: 'Diego Ferreira',what: 'exported the Q3 revenue report',        when: '09:03' },
  { who: 'Priya Raman',   what: 'changed workspace permissions',         when: '08:41' },
];

export const tasks = {
  backlog: [
    { id: 'T-104', title: 'Draft Q4 pricing experiment brief', tag: 'Growth', pri: 'low',  who: 'PR', due: 'Oct 2' },
    { id: 'T-108', title: 'Audit unused Postgres indexes',      tag: 'Infra',  pri: 'low',  who: 'OB', due: 'Oct 9' },
    { id: 'T-112', title: 'Refresh onboarding email sequence',  tag: 'Growth', pri: 'med',  who: 'YT', due: 'Oct 14' },
  ],
  progress: [
    { id: 'T-091', title: 'Migrate billing webhooks to v3',     tag: 'Billing',pri: 'high', who: 'MO', due: 'Sep 24' },
    { id: 'T-096', title: 'SSO: SCIM provisioning support',     tag: 'Auth',   pri: 'high', who: 'KD', due: 'Sep 30' },
  ],
  review: [
    { id: 'T-088', title: 'Rate limiting on public API',        tag: 'Infra',  pri: 'med',  who: 'DF', due: 'Sep 20' },
    { id: 'T-090', title: 'Usage-based invoice line items',     tag: 'Billing',pri: 'high', who: 'MO', due: 'Sep 21' },
  ],
  done: [
    { id: 'T-081', title: 'Dark mode across console',           tag: 'Design', pri: 'med',  who: 'YT', due: 'Sep 12' },
    { id: 'T-083', title: 'Retire legacy /v1 export endpoint',  tag: 'Infra',  pri: 'low',  who: 'OB', due: 'Sep 15' },
    { id: 'T-085', title: 'Churn survey on cancel flow',        tag: 'Growth', pri: 'med',  who: 'PR', due: 'Sep 16' },
  ],
};

export const columnMeta = {
  backlog:  { title: 'Backlog',     color: 'var(--faint)' },
  progress: { title: 'In progress', color: 'var(--chart-2)' },
  review:   { title: 'In review',   color: 'var(--chart-4)' },
  done:     { title: 'Shipped',     color: 'var(--chart-3)' },
};

export const statusMeta = {
  active:   { label: 'Active',    cls: 'ok'   },
  trial:    { label: 'Trial',     cls: 'info' },
  past_due: { label: 'Past due',  cls: 'warn' },
  churned:  { label: 'Churned',   cls: 'bad'  },
};

export const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

/* ============================================================
   Automations, log stream and typed account events.
   ============================================================ */

export const conditionFields = [
  { path: 'plan',           label: 'Plan',            type: 'ref' },
  { path: 'status',         label: 'Account status',  type: 'ref' },
  { path: 'region',         label: 'Region',          type: 'ref', list: true },
  { path: 'owner',          label: 'Account owner',   type: 'identifier', list: true },
  { path: 'company',        label: 'Company name',    type: 'string' },
  { path: 'mrr',            label: 'MRR',             type: 'number' },
  { path: 'seats',          label: 'Seats',           type: 'number' },
  { path: 'usage_pct',      label: 'Usage of limit',  type: 'number' },
  { path: 'days_inactive',  label: 'Days inactive',   type: 'number' },
  { path: 'is_trial',       label: 'On trial',        type: 'bool' },
];

export const conditionOps = {
  ref:        [['eq','is'],['ne','is not'],['in','is one of'],['not_in','is not one of'],['empty','is empty']],
  identifier: [['eq','is'],['ne','is not'],['in','is one of'],['in_list','is in list'],['not_in_list','is not in list']],
  string:     [['eq','is'],['contains','contains'],['starts','starts with'],['empty','is empty'],['not_empty','is not empty']],
  number:     [['eq','is'],['gt','is greater than'],['lt','is less than']],
  bool:       [['true','is true'],['false','is false']],
};

export const actionKinds = [
  ['email',    'Send email'],
  ['notify',   'Post to a channel'],
  ['task',     'Create a task'],
  ['assign',   'Assign an owner'],
  ['tag',      'Apply a tag'],
  ['webhook',  'Call a webhook'],
];

export const triggers = [
  ['any',      'Any account change'],
  ['created',  'New accounts only'],
  ['plan',     'Plan changed'],
  ['usage',    'Usage threshold crossed'],
  ['payment',  'Payment failed'],
];

export const workflows = [
  {
    id: 'AUT-01', name: 'Usage and churn watch', scope: 'All accounts',
    enabled: true, dryRun: false, lastRun: '4 min ago', runs24h: 182, matched24h: 31,
    rules: [
      {
        name: 'Warn owners at 90% of plan limit', enabled: true, trigger: 'usage', stop: true, join: 'and',
        conditions: [
          { path: 'usage_pct', op: 'gt', value: '90' },
          { path: 'plan', op: 'in', values: ['Growth', 'Scale'] },
        ],
        actions: [
          { kind: 'notify', target: '#account-alerts', enabled: true, flags: ['internal'] },
          { kind: 'assign', target: 'Account owner', enabled: true, flags: [] },
        ],
      },
      {
        name: 'Nudge dormant trials', enabled: true, trigger: 'any', stop: false, join: 'and',
        conditions: [
          { path: 'is_trial', op: 'true', value: '' },
          { path: 'days_inactive', op: 'gt', value: '7' },
        ],
        actions: [
          { kind: 'email', target: 'Re-engagement sequence', enabled: true, flags: [] },
        ],
      },
      {
        name: 'Skip internal and sandbox accounts', enabled: false, trigger: 'any', stop: true, join: 'or',
        conditions: [
          { path: 'owner', op: 'in_list', value: 'Internal owners' },
          { path: 'company', op: 'starts', value: '[TEST]' },
        ],
        actions: [],
      },
    ],
  },
  { id: 'AUT-02', name: 'Dunning follow-up',   scope: 'Past-due accounts', enabled: true,  dryRun: true,  lastRun: '2 hrs ago', runs24h: 44, matched24h: 6,  rules: [] },
  { id: 'AUT-03', name: 'Onboarding checklist', scope: 'New accounts',      enabled: true,  dryRun: false, lastRun: 'Yesterday',  runs24h: 12, matched24h: 12, rules: [] },
  { id: 'AUT-04', name: 'Weekend escalation',   scope: 'Enterprise',        enabled: false, dryRun: false, lastRun: '6 days ago', runs24h: 0,  matched24h: 0,  rules: [] },
];

const LOG_SEED = [
  ['INFO',  'api: request completed',         { route: 'GET /v2/accounts', status: 200, ms: 41 }],
  ['INFO',  'automation: rule matched',       { rule: 'Warn owners at 90%', account: 'CUS-4821' }],
  ['INFO',  'mailer: message delivered',      { template: 'usage-warning', to: 3, ms: 214 }],
  ['DEBUG', 'cache: warmed plan limits',      { keys: 412, ms: 88 }],
  ['WARN',  'mailer: no address on file',     { account: 'CUS-5107' }],
  ['INFO',  'worker: job finished',           { job: 'nightly-rollup', rows: 128394, ms: 9120 }],
  ['DEBUG', 'automation: condition false',    { rule: 'Nudge dormant trials', reason: 'days_inactive < 7' }],
  ['ERROR', 'billing: charge failed',         { status: 402, account: 'CUS-4938', code: 'card_declined' }],
  ['INFO',  'billing: retry succeeded',       { status: 200, account: 'CUS-4938', attempt: 3 }],
  ['INFO',  'search: index rebuilt',          { documents: 2530, ms: 1320 }],
  ['DEBUG', 'scheduler: tick',                { due: 4, skipped: 0 }],
  ['INFO',  'auth: login succeeded',          { user: 'danny@navi.app', ip: '198.51.100.24' }],
  ['WARN',  'auth: two-factor not enrolled',  { user: 'yuki@navi.app' }],
  ['ERROR', 'webhook: delivery failed',       { endpoint: 'hooks.acme.example', status: 429, retry_after: 30 }],
  ['INFO',  'automation: loop guard tripped', { account: 'CUS-4795', reason: 'self_update' }],
  ['DEBUG', 'config: reloaded',               { keys: 9 }],
  ['INFO',  'api: request completed',         { route: 'POST /v2/invoices', status: 201, ms: 122 }],
  ['INFO',  'automation: dry run — no writes',{ workflow: 'AUT-02', account: 'CUS-5220' }],
];

export const logEntries = LOG_SEED.map((e, i) => {
  const t = new Date(2026, 8, 17, 14, 2 + Math.floor(i * 1.7), (i * 23) % 60);
  return { time: t, level: e[0], msg: e[1], attrs: e[2] };
}).reverse();

export const accountEvents = [
  {
    kind: 'automation', tone: 'ok', title: 'Automation run — Usage and churn watch', source: 'AUT-01', time: '12:04:18',
    detail: 'Rule 1 matched · owner notified, follow-up assigned',
    note: { author: 'Automation', text: 'Usage at 92% of the Scale plan limit. Notified #account-alerts (3 recipients).' },
  },
  {
    kind: 'updated', tone: '', title: 'Account updated', source: 'console', time: '11:47:02',
    detail: 'by Marta Okonkwo',
    diff: [['Plan', 'Growth', 'Scale'], ['Seats', '11', '15'], ['Billing cycle', 'monthly', 'annual']],
  },
  {
    kind: 'notification', tone: 'warn', title: 'Email skipped', source: 'mailer', time: '10:58:41',
    detail: 'No verified address on file — fell back to the in-app inbox.',
  },
  {
    kind: 'error', tone: 'bad', title: 'Payment webhook failed', source: 'billing', time: '09:12:55',
    detail: 'Retried 3 times over 40 minutes.',
    error: 'POST /hooks/payments → 502 Bad Gateway (upstream timeout after 30s)',
  },
  {
    kind: 'noop', tone: '', title: 'Automation run — Dunning follow-up', source: 'AUT-02', time: '08:30:00',
    detail: 'No rules matched. Nothing happened.', noop: true,
  },
  {
    kind: 'created', tone: 'accent', title: 'Account created', source: 'signup', time: 'Mar 28, 2024',
    detail: 'Self-serve signup from the pricing page.',
  },
];
