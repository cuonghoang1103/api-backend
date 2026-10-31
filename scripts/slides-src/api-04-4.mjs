/**
 * api-04-4 — API Design · Chapter 4 · Lesson 4.4 "Mobile and desktop clients that never update" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s04-phien-ban.mjs › api-4-4-app-di-dong. Output = chạy thật LabFlow Ch4 + app.mjs (VERSION=1.2.0 / 1.4.0).
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 4 — Versioning and evolution', bai: '4.4' };

export const deck = { key: 'api-04-4', code: 'API 4.4', title: 'Clients that never update', sub: 'Version header, remote config, guards, hidden enum values' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Mobile and desktop clients<br>that never update', sub: 'Several app versions are always live at once.<br>Four tools for the server.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why apps update late — or never</li>
<li>Tool 1: every request says <b>which build</b> it is</li>
<li>Tool 2: a <b>config endpoint</b> read at start-up</li>
<li>Tool 3: a <b>guard</b> only for truly broken builds</li>
<li>Tool 4: old clients <b>never see new enum values</b></li>
</ul>` },

  { t: 'The world your API lives in', to: true, giua: true, body: two(`
<ul>
<li>Web: updates on reload</li>
<li>Mobile: when the user taps “Update” — store review takes days, auto-update is often off</li>
<li>Desktop (Electron): only with its own auto-updater</li>
<li>Some students keep an old build because it “still works”</li>
</ul>`, box('So', 'At any moment LabFlow serves <b>several app versions</b>, some a year old. Breaking them means support tickets you cannot fix by deploying.', 'do2') +
  box('Tool 1', 'Every request: <code class="i">LabFlow-Client: android/1.4.0</code>. One header buys the usage report (4.3), the guard, and the version distribution.', 'xanh'), 'r46') },

  { t: 'Tool 2 — remote config at start-up', body: two(sql(`// appVersion.js
export const APP_CONFIG = {
  minVersion: { android: '1.3.0', ios: '1.3.0' },  // below: must update
  latestVersion: { android: '1.5.0', ios: '1.5.0' },  // below: suggest
  updateUrl: { android: 'https://play…', ios: 'https://apps…' },
  features: { checkIn: true },        // switch without a release
};

// app.js — BEFORE the guard: old apps must read it
app.get('/app-config', (req, res) =>
  res.set('Cache-Control', 'public, max-age=300').json(APP_CONFIG));
app.use(appVersionGuard);`, { lang: 'javascript', sm: true, hl: [3, 6, 10, 12] }), http(`$ curl -si http://localhost:4000/app-config | grep -E '^(HTTP|Cache-Control)'
HTTP/1.1 200 OK
Cache-Control: public, max-age=300

$ curl -s http://localhost:4000/app-config | jq -c '{minVersion, latestVersion, features}'
{"minVersion":{"android":"1.3.0","ios":"1.3.0"},
 "latestVersion":{"android":"1.5.0","ios":"1.5.0"},
 "features":{"checkIn":true}}`, { sm: true, wrap: true }) + box('No release needed', 'Change a value on the server ⇒ effective at the next app start.', 'xanh'), 'r46') },

  { t: 'Tool 3 — a guard for truly broken builds', body: two(sql(`export function appVersionGuard(req, res, next) {
  const c = parseClient(req.get('LabFlow-Client'));  // android/1.2.0
  if (!c || c.platform === 'web') return next();     // not blocked
  const min = APP_CONFIG.minVersion[c.platform];
  if (compareVersions(c.version, min.split('.').map(Number)) < 0)
    throw new HttpError(400, 'APP_VERSION_UNSUPPORTED',
      { version: c.version.join('.'), min },
      { minVersion: min, updateUrl: APP_CONFIG.updateUrl[c.platform] });
  next();
}`, { lang: 'javascript', sm: true, hl: [3, 6] }) + box('Why 400, not 426 or 403', '426 = switch <b>protocol</b>, needs an <code class="i">Upgrade</code> header. 403 = the <b>user</b> may not. Here the <b>build</b> is broken ⇒ a specific code.', 'lam'), http(`$ curl -s '…/v2/bookings?limit=1' -H 'Authorization: Bearer tok_lan' -H 'LabFlow-Client: android/1.2.0'
{
  "type": "https://labflow.example/problems/app-version-unsupported",
  "title": "Phiên bản app đã quá cũ",
  "status": 400,
  "detail": "App 1.2.0 không còn được hỗ trợ; hãy cập nhật lên 1.3.0 trở lên",
  "code": "APP_VERSION_UNSUPPORTED",
  "minVersion": "1.3.0",
  "updateUrl": "https://play.google.com/store/apps/details?id=example.labflow"
}
$ … -H 'LabFlow-Client: android/1.3.0'    ⇒ 200
$ … (no LabFlow-Client header)            ⇒ 200`, { sm: true, wrap: true }), 'r46') },

  { t: 'Tool 4 — old clients never see new values', body: two(sql(`// views.js — v1 is older than check-in
const V1_STATUS = {
  PENDING: 'PENDING', CANCELLED: 'CANCELLED',
  CHECKED_IN: 'PENDING' };
export const v1Status = (s) => V1_STATUS[s] ?? 'PENDING';
// v1: status: v1Status(b.status)
// v2: status: b.status,
//     checkedInAt: b.checkedInAt ?? null

// routes/bookings.js — check-in exists only in v2
const v2Only = (req, res, next) =>
  (req.apiVersion === 2 ? next() : next('router'));
bookingsRouter.route('/:id/check-in')
  .post(v2Only, checkIn)  // ⇒ CHECKED_IN
  .all(v2Only, onlyAllow('POST'));`, { lang: 'javascript', sm: true, hl: [4, 11] }), http(`$ curl -s -X POST …/v2/bookings/bk_8/check-in -H 'Authorization: Bearer tok_lan' | jq -c '{id, status, checkedInAt}'
{"id":"bk_8","status":"CHECKED_IN","checkedInAt":"2026-10-31T20:05:03.456Z"}

$ curl -s …/v1/bookings/bk_8 -H 'Authorization: Bearer tok_lan' | jq -c '{id, status}'
{"id":"bk_8","status":"PENDING"}

$ curl -s -X POST …/v1/bookings/bk_8/check-in -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'
{"status":404,"code":"ROUTE_NOT_FOUND"}`, { sm: true, wrap: true }) + box('The 4.1 crash, avoided', 'v1 sees the nearest old meaning; its <code class="i">?status=PENDING</code> filter uses the same mapping.', 'xanh'), 'r46') },

  { t: 'Three apps, one server', body: two(sql(`// app.mjs — VERSION=1.2.0 node app.mjs
// 1) config first
const cfg = await (await fetch(\`\${BASE}/app-config\`)).json();
const { minVersion: min, latestVersion: last } = cfg;
if (older(VERSION, min.android)) console.log('[màn hình chặn] …');
else if (older(VERSION, last.android)) console.log('[gợi ý] …');

// 2) the API, as usual
const res = await fetch(\`\${BASE}/v2/bookings?limit=3\`,
  { headers: H });
// written BEFORE check-in — a tolerant reader:
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
const show = (s) => LABEL[s] ?? \`Trạng thái khác (\${s})\`;
for (const b of body.data) console.log(\`\${b.id}  \${show(b.status)}\`);`, { lang: 'javascript', sm: true, hl: [3, 13] }) + box('Simplified', 'The full file is in the lesson; names shortened here to fit.', 'lam'), http(`$ VERSION=1.2.0 node app.mjs
[màn hình chặn] Cần cập nhật lên 1.3.0: https://play.google.com/…
server từ chối: 400 APP_VERSION_UNSUPPORTED — App 1.2.0 không còn được hỗ trợ; …

$ VERSION=1.4.0 node app.mjs
[gợi ý] Đã có bản 1.5.0
bk_8  Trạng thái khác (CHECKED_IN)
bk_7  Đã huỷ
bk_6  Chờ duyệt

$ node client-v1.mjs
bk_8  AL-305  11:00–13:00  Chờ duyệt
…
đặt được bk_9`, { sm: true, wrap: true }) + box('Nobody broken', 'Three generations of clients, one server.', 'xanh'), 'r46') },

  { t: 'Rules for teams that ship apps', to: true, giua: true, body: cards([
    ['Tolerant readers from day one', 'Ignore unknown members; give unknown enum values a fallback label.'],
    ['Additive by default', 'When a new value would confuse old clients, map it in the old version’s view.'],
    ['Feature switches in config', '<code class="i">features.checkIn</code> turns a button off without a store release.'],
    ['Raise minVersion rarely', 'Only for real bugs, after checking the version distribution — every raise sends users to the store.'],
  ], 2) },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ The config behind the guard', '<code class="i">app.use(appVersionGuard)</code> before <code class="i">/app-config</code>: an old app can never learn that it must update. ✓ The config is the door that is always open.'],
    ['✗ Blocking unknown clients', 'Requiring <code class="i">LabFlow-Client</code> everywhere breaks curl, scripts and the web for no gain. ✓ Block only known-bad builds.'],
    ['✗ New enum values for everyone', 'The 4.1 crash, again — on phones you cannot update. ✓ Map them in the old view; show them only in the new version.'],
    ['✗ Raising minVersion casually', 'Every raise sends users to the store and some never come back. ✓ Only for real bugs, after checking the distribution.'],
  ], 2) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Evolving an API used by mobile apps?”', 'Assume many versions live at once: a client version header, remote config with min/latest versions and feature switches, additive changes, new enum values hidden from old versions, forced updates only for broken builds.'],
    ['“Which status for a too-old app?”', 'A specific problem code (LabFlow: 400 APP_VERSION_UNSUPPORTED with minVersion and updateUrl) — 426 means switching protocols and needs an Upgrade header.'],
    ['“When can you drop an old app version?”', 'From data: requests per LabFlow-Client version. Drop it when the share is small and those users were warned in the app.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Apps update late or never: several versions are always live</li>
<li>Identify the build with a header; serve <code class="i">/app-config</code> before any guard</li>
<li>Block only known-bad builds: 400 <code class="i">APP_VERSION_UNSUPPORTED</code> + update URL</li>
<li>New enum values only in new versions; old views map them</li>
<li>Measured: 1.2.0 refused with a path, 1.4.0 working as a tolerant reader</li>
</ul>
${box('Next', 'Lab 4 — devices, version 2: rename without breaking, with a contract test.', 'xanh')}` },
]);
