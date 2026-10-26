/**
 * pg-lab-9 — PostgreSQL · Lab 9 · CT Shop capstone "An API for the mobile app — Node 22 + Prisma 5.22 + Express 5" (slide EN, kiểu FU, agent lab9 26/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-9.mjs + lab/app9/{starter,solution}. Mọi output/mã trên slide lấy từ O / F mà lab-9.mjs export
 * (sinh tự động từ lượt chạy thật: postgres:17 (17.11) cổng 5444, DB ctlab9 + ctlab9_test, Node 22.23.3 — scratchpad lab9/mk9.mjs).
 * Dòng dài được bẻ (boc) và ghi "(wrapped)"/"(trimmed)" ở tiêu đề khung; sơ đồ ghi "schematic"; mọi CON SỐ trên sơ đồ lấy từ output thật.
 * Tập 1 (video pg-lab-9) = slide 1–16 (đề, C1–C4) · tập 2 (pg-lab-9-2) = slide 17–32 (C5–C9, tự kiểm, kết khoá).
 */
import { lamDeck, sql, psql, tbl, two, box, steps, cards, vsd, flow, hai_phien, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';
import { O, F } from '../../content/courses/postgresql/lab/lab-9.mjs';

export const deck = { key: 'pg-lab-9', code: 'PG Lab 9', title: 'Lab 9 — CT Shop capstone: an API for the mobile app', sub: 'roles · baseline · JSON · keyset · N+1 · expand/contract · checkout · pool · report · CONCURRENTLY · tests · checklist · restore' };

const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const nho = (h, fs = 13) => h.replace(/<pre>/g, `<pre style="font-size:${fs}px;line-height:1.34">`);
const ma = (h, fs = 13.5) => h.replace(/<pre class="vs sm">/g, `<pre class="vs sm" style="font-size:${fs}px;line-height:1.38">`);
const boc = (l, w) => { const r = []; let x = l; while (x.length > w) { let i = x.lastIndexOf(' ', w); if (i < w * 0.5) i = w; r.push(x.slice(0, i)); x = '   ' + x.slice(i).trimStart(); } r.push(x); return r; };
const B = (t, w = 96) => t.split('\n').flatMap((l) => boc(l, w)).join('\n');
const dong = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);
const T = (t, to = [], o = {}) => psql(t, { sm: true, title: 'terminal — real output', hl: dong(t, to), ...o });
const PQ = (t, to = [], o = {}) => psql(t, { sm: true, title: 'psql (17.11) — ctlab9 · real output', hl: dong(t, to), ...o });
const JS = (t, to = [], o = {}) => sql(t, { sm: true, lang: 'javascript', hl: dong(t, to), ...o });
const SQ = (t, to = [], o = {}) => sql(t, { sm: true, hl: dong(t, to), ...o });
const SH = (t, to = [], o = {}) => sql(t, { sm: true, lang: 'bash', hl: dong(t, to), ...o });
const c = (t) => `<code class="i">${esc(t)}</code>`;
const lines = (t, a, b) => t.split('\n').slice(a, b).join('\n');
const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');

/* ── hình (SVG, schematic; con số = output thật) ── */
const MONO = 'Menlo,Consolas,monospace';
const hop = (x, y, w, h, mau, t, s = '', fs = 20) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${mau}14" stroke="${mau}" stroke-width="2.5"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + (s ? -6 : 7)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${mau}">${t}</text>` +
  (s ? `<text x="${x + w / 2}" y="${y + h / 2 + 20}" text-anchor="middle" font-size="${fs - 5}" fill="#555">${s}</text>` : '');
const mt = (x1, y1, x2, y2, mau = NAU, nhan = '', dash = false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${mau}" stroke-width="3" ${dash ? 'stroke-dasharray="7 6"' : ''} marker-end="url(#m9)"/>` +
  (nhan ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 8}" text-anchor="middle" font-size="15" fill="${mau}" font-weight="700">${nhan}</text>` : '');
const DEFS = `<defs><marker id="m9" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;

// slide 3 — kiến trúc: app di động → 3 tiến trình Node (pool 5) → PostgreSQL; CI/deploy chạy migrate bằng owner
const kienTruc = () => {
  let s = `<svg viewBox="0 0 1112 330" width="1112" height="330" font-family="Arial">${DEFS}`;
  s += hop(0, 115, 170, 100, TIM, '📱 mobile app', 'JSON over HTTPS', 19);
  for (let i = 0; i < 3; i++) {
    const y = 10 + i * 108;
    s += `<g data-k="node-${i}">` + hop(260, y, 250, 92, PG, `Node API #${i + 1}`, 'Express 5 + PrismaClient', 19);
    for (let k = 0; k < 5; k++) s += `<rect x="${278 + k * 44}" y="${y + 70}" width="34" height="12" rx="3" fill="${XANH}"/>`;
    s += '</g>';
    s += mt(172, 165, 256, y + 46, '#888');
    s += mt(514, y + 46, 690, 165, XANH);
  }
  s += `<text x="604" y="22" text-anchor="middle" font-size="16" fill="${XANH}" font-weight="700">3 × pool 5 = 15</text>`;
  s += `<text x="604" y="320" text-anchor="middle" font-size="15" fill="#555">as ctshop_app · rows only</text>`;
  s += `<g data-k="pg">` + hop(695, 95, 220, 140, PG, '🐘 PostgreSQL 17', 'CT Shop · 302.000 orders', 20) + `</g>`;
  s += `<text x="805" y="258" text-anchor="middle" font-size="15" fill="#555">max_connections 100 − 3 reserved = 97</text>`;
  s += `<g data-k="ci">` + hop(960, 20, 152, 92, CAM, 'CI / deploy', 'migrate deploy', 18) + `</g>`;
  s += mt(1000, 114, 918, 128, CAM, '', true);
  s += `<text x="1036" y="138" text-anchor="middle" font-size="15" fill="${CAM}" font-weight="700">ctshop_owner</text>`;
  s += `<g data-k="ops">` + hop(960, 210, 152, 92, NAU, 'operations', 'kiem-tra.sql · dump', 18) + `</g>`;
  s += mt(958, 250, 920, 220, NAU, '', true);
  return s + `<text x="1110" y="326" text-anchor="end" font-size="13" fill="#999">schematic</text></svg>`;
};

// slide 14 — expand / contract trên dòng thời gian
const dongThoiGian = () => {
  const W = 1112;
  let s = `<svg viewBox="0 0 ${W} 300" width="${W}" height="300" font-family="Arial">${DEFS}`;
  const xs = [150, 370, 590, 810, 1030];
  const nhan = ['① expand', '② deploy v2', '③ stop v1', '④ contract', ''];
  s += `<line x1="120" y1="40" x2="1100" y2="40" stroke="#999" stroke-width="2"/>`;
  nhan.forEach((t, i) => { if (t) s += `<g data-k="moc-${i}"><circle cx="${xs[i]}" cy="40" r="9" fill="${i === 0 || i === 3 ? CAM : PG}"/><text x="${xs[i]}" y="24" text-anchor="middle" font-size="18" font-weight="700" fill="#333">${t}</text></g>`; });
  const lane = (y, ten, mau) => `<text x="10" y="${y + 24}" font-size="17" font-weight="700" fill="${mau}">${ten}</text>`;
  const bar = (x1, x2, y, mau, t, k) => `<g data-k="${k}"><rect x="${x1}" y="${y}" width="${x2 - x1}" height="36" rx="8" fill="${mau}22" stroke="${mau}" stroke-width="2"/><text x="${x1 + 10}" y="${y + 24}" font-size="16" fill="${mau}" font-weight="700">${t}</text></g>`;
  s += lane(70, 'column note', NAU) + bar(120, 810, 70, NAU, 'note', 'col-note');
  s += lane(120, 'delivery_note', XANH) + bar(150, 1100, 120, XANH, 'delivery_note (+ back-fill 37.500 rows)', 'col-dn');
  s += lane(170, 'sync trigger', CAM) + bar(150, 810, 170, CAM, 'orders_sync_note: copies every write both ways', 'trg');
  s += lane(220, 'app v1', PG) + bar(120, 590, 220, PG, 'v1 reads/writes note', 'v1');
  s += lane(260, 'app v2', TIM) + bar(370, 1100, 260, TIM, 'v2 reads/writes delivery_note', 'v2');
  s += `<rect data-k="vung" x="370" y="62" width="220" height="236" fill="none" stroke="${DO}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
  s += `<text x="480" y="296" text-anchor="middle" font-size="14" fill="${DO}" font-weight="700"></text>`;
  return s + `</svg>`;
};

// slide 21 — giữ kết nối vs giao dịch ngắn (một kết nối trên trục thời gian; 300 ms cổng thanh toán)
const giuKetNoi = () => {
  let s = `<svg viewBox="0 0 1112 210" width="1112" height="210" font-family="Arial">`;
  const seg = (x, w, y, mau, t, k = '') => `<g${k ? ` data-k="${k}"` : ''}><rect x="${x}" y="${y}" width="${w}" height="40" rx="6" fill="${mau}" opacity="0.85"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-size="16" fill="#fff" font-weight="700">${t}</text></g>`;
  s += `<text x="0" y="40" font-size="18" font-weight="700" fill="${DO}">✗ HOLD</text>`;
  s += seg(140, 60, 14, PG, 'BEGIN') + seg(200, 80, 14, PG, 'lock') + seg(280, 520, 14, DO, 'idle in transaction — waiting for the gateway 300 ms', 'hold') + seg(800, 130, 14, PG, 'write+COMMIT');
  s += `<text x="140" y="80" font-size="15" fill="#555">the connection (and the row lock) is busy for the whole bar</text>`;
  s += `<text x="0" y="135" font-size="18" font-weight="700" fill="${XANH}">✓ SHORT</text>`;
  s += seg(140, 70, 110, XANH, 'read') + `<rect x="210" y="110" width="520" height="40" rx="6" fill="none" stroke="#999" stroke-dasharray="6 5"/><text x="470" y="136" text-anchor="middle" font-size="16" fill="#777">gateway 300 ms — no connection held</text>` + seg(730, 200, 110, XANH, 'BEGIN · write · COMMIT', 'short');
  s += `<text x="140" y="176" font-size="15" fill="#555">the connection is free again after a few ms — 5 connections serve 400 payments</text>`;
  return s + `<text x="1110" y="205" text-anchor="end" font-size="13" fill="#999">schematic</text></svg>`;
};

/* ── vừa khung: bẻ dòng theo bề rộng cột (chữ đơn cách ≈ 0,602 × cỡ chữ) ── */
const fit = (t, px, fs) => B(t, Math.floor((px - 26) / (0.602 * fs)));
const W = { full: 1112, half: 546, r4: 437, r6: 655, r3: 328, r7: 764 };
const np = (t) => t.split('\n').filter((l) => !/^Pager usage is off\.$/.test(l)).join('\n');
// một dòng JSON thật, chỉ giữ vài khoá (ghi "trimmed" ở tiêu đề khung)
const J = (line, keys) => { const i = line.indexOf('{'); const o = JSON.parse(line.slice(i)); const tail = line.slice(line.lastIndexOf('}') + 1); return '{' + keys.map((k) => `${JSON.stringify(k)}:${JSON.stringify(o[k])}`).join(',') + (keys.length < Object.keys(o).length ? ',…' : '') + '}' + tail; };
const curlL = (t, re) => t.split('\n').find((l) => re.test(l));
const REPORT = JSON.parse(O.C7_REPORT.replace(/\n/g, ''));
const vnd = (x) => x == null ? '—' : Number(x).toLocaleString('de-DE', { maximumFractionDigits: 1 });
const KT = (t) => { const L = np(t).split('\n'); return [L[0], L[1], ...L.filter((l) => /^ (3|5|6|7|8) /.test(l))].join('\n'); };

export const slides = lamDeck({ chuong: 'Lab 9 · CT Shop · capstone', bai: '' }, [
  /* 1 */ { cover: true, t: 'Lab 9 — CT Shop capstone:<br>an API for the mobile app', sub: 'Node 22 · Prisma 5.22 · Express 5 ↔ PostgreSQL 17<br>roles · baseline · expand/contract · checkout · pool · report · restore' },

  /* 2 */ { t: 'The ticket', body: two(
    box('CT Shop needs…', `<ul style="margin:0">
<li>an <b>API</b> for the mobile app: products, “My orders”, order detail, checkout, payment, revenue</li>
<li>Prisma must <b>adopt</b> the live database (302.000 orders)</li>
<li>the app account must <b>not change the schema</b></li>
<li>rename <b>note → delivery_note</b>, no downtime</li>
<li><b>two buyers, one last unit</b> ⇒ one order</li>
<li>a gateway that answers in <b>~300 ms</b>, under load</li>
<li>a <b>checklist</b> and a <b>restore drill</b></li></ul>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      '<b>npm test</b>: 8 pass, 0 fail',
      '<b>migrate diff</b>: an empty migration',
      'migrations rebuild <b>11</b> CHECKs',
      'last unit: one <b>201</b>, one <b>409</b>',
      '400 payments, pool 5: <b>400 × 201</b>',
      'report <b>2.318 → 25</b> pages',
      'restored copy = row for row',
    ]))), giua: true },

  /* 3 */ { t: 'The shape of the system', body: `${kienTruc()}
${two(box('Two accounts', '<b>ctshop_app</b> — the running API, rows only. <b>ctshop_owner</b> — owns the schema, used only by <code class="i">prisma migrate</code> in the deploy.', 'lam'),
    box('The numbers of the brief (16.4)', '8 models · 11 CHECKs · <b>3 processes × pool 5 = 15</b> ≪ 97 · customer 42: 1841 · 1256 · 1238 · Jan–Apr 2026: 75 · 64 · 92 · 69 paid orders', ''))}`, giua: true },

  /* 4 */ { t: 'Files and setup', body: two(col(ma(SH(`docker exec -it pgdemo createdb -U postgres ctlab9
docker cp lab9-start.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 \\
        -f /tmp/lab9-start.sql
# unzip lab9-starter.zip, then in the folder:
npm ci
cp .env.example .env      # PowerShell: Copy-Item`, ['npm ci']), 14.5),
    nho(T(fit('categories | products | customers | orders | order_lines | payments | notes\n        12 |       48 |       300 | 302000 |      605000 |   277376 | 37500', W.r6, 12.5), ['302000'], { title: 'lab9-start.sql — check line (real)' }), 12.5),
    box('.env: two URLs, two accounts', '<code class="i">DATABASE_URL</code> → <b>ctshop_app</b>, <code class="i">connection_limit=5</code> — the running app · <code class="i">DIRECT_URL</code> → <b>ctshop_owner</b> — every Prisma CLI command (db pull, migrate …)', 'xanh')),
    col(box('lab9-start.sql', 'the standard shop + <b>2023–2024</b> from the old system: 300.000 orders, 600.000 lines, 275.713 payments. Deterministic, ~15 s. <b>No index on any foreign key</b> — on purpose.', 'lam'),
      box('lab9-starter.zip', 'Express 5 + Prisma 5.22, runs as is · TODOs <b>C1–C9</b> · scripts <code class="i">n1</code> <code class="i">race</code> <code class="i">load</code> · <b>8 tests</b> = the grader', ''),
      box('Needs', '<b>Node 22</b> · Docker PostgreSQL 17 on port <b>5444</b> · macOS, Linux, Windows', '')), 'r64'), giua: true },

  /* 5 */ { t: 'C1 · Two accounts: the owner and the app', body: two(ma(SQ(`CREATE ROLE ctshop_owner LOGIN PASSWORD 'owner-lab9';
ALTER SCHEMA shop OWNER TO ctshop_owner;  -- + the 8 tables
CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab9';
REVOKE ALL ON DATABASE ctlab9 FROM PUBLIC;
GRANT CONNECT ON DATABASE ctlab9 TO ctshop_owner, ctshop_app;
GRANT USAGE ON SCHEMA shop TO ctshop_app;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA shop TO ctshop_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shop
  TO ctshop_app;
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner
  IN SCHEMA shop
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app;
ALTER ROLE ctshop_app SET statement_timeout = '5s';
ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE ctshop_app SET lock_timeout = '3s';`, ['DEFAULT PRIVILEGES', 'statement_timeout', 'idle_in', 'lock_timeout']), 14),
    col(box('Why each value', '<b>5 s</b> — no app screen waits longer · <b>10 s</b> — case 1 of 16.4 cannot last an afternoon · <b>3 s</b> — a request stuck behind a migration fails fast. The owner: lock_timeout 5 s, <b>no</b> statement_timeout (index builds).', 'lam'),
      box('New: ALTER DEFAULT PRIVILEGES', 'grants applied <b>automatically</b> to every table the owner creates <b>later</b> — by future migrations.', 'xanh'),
      nho(PQ(O.C1_DP.split('\n').slice(1, 5).map((l) => l.slice(25, 62)).join('\n'), ['ctshop_app=arwd'], { title: '\\dp orders — real (one column)' }), 13)), 'r64'), giua: true },

  /* 6 */ { t: 'C1 · Before and after: what the app can do', body: `<div class="tcap">the starter, role lines still missing</div>
${nho(T(fit(pick(O.C1_42501, /health|"status"|products|INTERNAL|42501/), W.full, 12), ['42501', '"db":"ok"'], { title: 'terminal — real output (wrapped)' }), 12)}
<div class="tcap">after roles.sql</div>
${nho(PQ(lines(O.C1_ROLES, 17, 22), ['ctshop_app', 'ctshop_owner'], { title: 'roles.sql — check (real)' }), 13)}
${two(box('A health check that touches no table', '<code class="i">/health</code> said <b>ok</b> — <code class="i">SELECT current_user</code> reads nothing — while every real query failed: <b>42501</b>.', 'do2'),
    box('arwd vs arwdDxtm', 'the app: <b>a</b>ppend · <b>r</b>ead · <b>w</b>rite · <b>d</b>elete. The owner: everything, TRUNCATE and TRIGGER included.', 'lam'))}`, giua: true },

  /* 7 */ { t: 'C2 · db pull: Prisma reads CT Shop', body: two(nho(T(fit(O.C2_PULL.replace(/ Read more: https:\/\/pris\.ly\/d\/check-constraints/, ''), W.r6, 12), ['Introspected 8 models', 'not supported'], { title: 'npx prisma db pull — real output (wrapped)' }), 12),
    col(ma(sql(`model orders {      // written by db pull
  id          BigInt   @id
                @default(autoincrement())
  customer_id BigInt
  status      String   @default("pending")
  created_at  DateTime @default(now())
                @db.Timestamptz(6)
  note        String?
  order_item  order_item[]
  customer    customer @relation(…)
  payment     payment?
}`, { sm: true, lang: 'typescript', hl: [2, 8] }), 13),
      box('Read the warning', 'Prisma Client <b>cannot see</b> the 11 CHECKs of Chapter 3 — the database remains the guard.', 'do2'),
      nho(T(fit(lines(O.C2_STATUS0, 4, 6), W.r4, 12), ['not managed'], { title: 'npx prisma migrate status' }), 12)), 'r64'), giua: true },

  /* 8 */ { t: 'C2 · The baseline Prisma writes is not your schema', body: two(col(nho(T(fit(lines(O.C2_GEN, 0, 18), W.r4, 11.5), ['SERIAL'], { title: '0_init/migration.sql — generated (start)' }), 11.5)),
    col(`<div class="tcap">the generated file, applied to an empty database (real)</div>`, nho(PQ(O.C2_GEN_TEST, ['0', 'INSERT 0 1'], { title: 'psql — stock -5 and id 999 accepted' }), 12.5),
      box('Fix by hand', '7 × SERIAL ⇒ <b>GENERATED ALWAYS AS IDENTITY</b> · append the <b>11 CHECKs</b> (from <code class="i">pg_dump --schema-only</code>)', 'xanh'),
      nho(PQ(fit(lines(O.C2_REPLAY_CHECK, 0, 4) + '\n…\nERROR:  new row for relation "product" violates check constraint "product_stock_check"', W.r6, 12), ['11', 'violates'], { title: 'the fixed 0_init replayed on an empty DB (trimmed)' }), 12)), 'r46'), giua: true },

  /* 9 */ { t: 'C2 · resolve --applied: a fact, not a cover-up', body: two(nho(T(fit(`$ npx prisma migrate resolve --applied 0_init
${lines(O.C2_RESOLVE, 3)}
$ npx prisma migrate status
${lines(O.C2_STATUS1, 3)}
$ npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
${O.C2_DIFF}`, W.r4, 12.5), ['marked as applied', 'up to date', 'empty migration'], { title: 'terminal — real output (wrapped)' }), 12.5),
    col(vsd('A migration that <b>failed halfway</b> marked “applied”: a lie that hides a broken schema (16.1 — never automatic).', 'A <b>baseline</b> marked “applied”: <b>true</b> — 0_init exists; you compared it and replayed it on an empty DB.', '✗ to get past an error', '✓ to record a baseline'),
      box('What it does', 'writes one row into <code class="i">_prisma_migrations</code> — without running the SQL.', 'lam')), 'r46'), giua: true },

  /* 10 */ { t: 'C2 · Trap: the default privileges were too generous', body: two(col(ma(SQ(`SELECT has_table_privilege('ctshop_app',
       'shop._prisma_migrations', 'DELETE');
REVOKE ALL ON shop._prisma_migrations FROM ctshop_app;`, ['REVOKE']), 14),
    nho(PQ(np(O.C2_REVOKE), ['t', 'f'], { title: 'sql/sau-baseline.sql — real output' }), 14)),
    col(box('What happened', '<code class="i">migrate resolve</code> created <code class="i">_prisma_migrations</code> as <b>ctshop_owner</b> ⇒ step 3 of roles.sql gave the <b>app</b> SELECT, INSERT, UPDATE, <b>DELETE</b> on the migration history.', 'do2'),
      box('Why it matters', 'an app that can delete rows there can make the next deploy <b>skip a migration</b>. The test-database script revokes it too.', 'lam'))), giua: true, to: true },

  /* 11 */ { t: 'C3 · BigInt, Decimal and money in JSON', body: two(col(`<div class="tcap">starter: GET /products</div>`, nho(T(fit(O.C3_500, W.r4, 12), ['BigInt'], { title: 'terminal — real output (wrapped)' }), 12),
    ma(JS(`// every id is bigint: send it as a STRING
app.set('json replacer', (_k, v) =>
  (typeof v === 'bigint' ? v.toString() : v));`, ['json replacer']), 13.5),
    box('Why not Number?', '<code class="i">Number</code> “works” until 2<sup>53</sup>. The API sends <b>"1841"</b>.', 'lam')),
    col(`<div class="tcap">money: float vs Decimal (real)</div>`, nho(T(fit(O.C3_TIEN, W.r6, 12), ['63720.00000000001', 'equals 63720 ? true'], { title: 'node + psql — real output (wrapped)' }), 12),
      box('Rule', '<code class="i">numeric</code> in the database · <code class="i">Prisma.Decimal</code> in the app (<code class="i">.plus</code>, <code class="i">.times</code>) · a <b>string</b> on the wire · never <code class="i">Float</code> in schema.prisma.', 'xanh')), 'r46'), giua: true },

  /* 12 */ { t: 'C3 · OFFSET repeats a row, keyset does not', body: two(col(nho(T(O.C3_KEYSET, ['4 again', 'keyset'], { title: 'test database — real output' }), 14.5),
    box('Why OFFSET slips', 'newest first, a product arrives between two loads ⇒ everything shifts by one ⇒ product 4 shown twice (a delete would skip one).', 'do2'),
    ma(SQ(`SELECT … FROM product
-- before = the last id seen
WHERE is_active AND id < $1
ORDER BY id DESC
LIMIT 13;   -- 12 + 1 extra row`, ['id < $1']), 14)),
    col(ma(JS(F.PRODUCTS.split('\n').filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/\s+\/\/.*$/, '')).join('\n'), ['id: { lt: before }', 'take: limit + 1']), 12.5),
      box('curl (real)', '<code class="i">?limit=3</code> ⇒ ids 48, 47, 46 · <b>next "46"</b> → <code class="i">?before=46</code> ⇒ 45, 44, 43 · next "43"', 'lam')), 'r46'), giua: true },

  /* 13 */ { t: 'C3 · What Prisma sends — and the N+1 trap', body: `${nho(T(fit(O.C3_LOG.replace(/"shop"\./g, ''), W.full, 11.5), ['IN ($1)', 'IN ($1,$2)'], { title: 'LOG_SQL=1 — GET /orders/1841 — real log ("shop". removed, wrapped)' }), 11.5)}
${two(ma(JS(fit(F.N1_LOOP.split('\n').slice(1).join('\n'), W.half, 12), ['for (const']), 12),
    col(nho(T(fit(O.C3_N1, W.half, 11.5), ['68 SQL', '3 SQL', '1 SQL'], { title: 'npm run n1 — customer 42, 20 orders (real, wrapped)' }), 11.5),
      box('One query per relation level', 'nested <code class="i">select</code> ⇒ <code class="i">WHERE order_id IN (…)</code> — 3 statements whatever the page size.', 'xanh')))}`, giua: true },

  /* 14 */ { t: 'C4 · Rename without downtime: expand → contract', body: `${dongThoiGian()}
${two(box('Why not one RENAME?', 'during a rolling deploy <b>v1 is still running</b> and selects <code class="i">note</code>. Expand keeps <b>both versions</b> working; contract waits until v1 is gone.', 'lam'),
    col(nho(T(fit(pick(O.C4_DEV, /P3014|could not create|permission denied/), W.half, 12), ['permission denied'], { title: 'migrate dev --create-only as ctshop_owner (real)' }), 12),
      p('No shadow database for a least-privilege owner ⇒ generate with <b>migrate diff</b>, apply with <b>migrate deploy</b> (16.1).', 18)))}`, giua: true },

  /* 15 */ { t: 'C4 · Expand: new column, sync trigger, back-fill', body: two(ma(SQ(fit(F.EXPAND.split('\n').filter((l) => !/^-- (Lab 9|Generated|While|Back-fill)/.test(l)).map((l) => l.replace(/\s+-- .*$/, '')).join('\n'), W.r6, 12), ['ADD COLUMN', 'SET LOCAL', 'CREATE TRIGGER', 'UPDATE "orders"']), 12),
    col(nho(T(fit(`$ POST /orders  {…, "note": "Giao giờ hành chính"}     # v1
${J(lines(O.C4_V1, 3, 4), ['id', 'status'])}`, W.r4, 12), ['302001'], { title: 'v1, still running (real, trimmed)' }), 12),
      nho(PQ(lines(O.C4_V1, 4, 9).split('\n').map((l) => l.replace(/\s+$/, '')).join('\n'), ['302001'], { title: 'the trigger filled delivery_note' }), 11.5),
      nho(T(fit(`$ GET :3009/orders/302002   # v1 reads what v2 wrote
${J(lines(O.C4_V2, 3, 4), ['id', 'note'])}`, W.r4, 12), ['"note"'], { title: 'real, trimmed' }), 12)), 'r64'), giua: true },

  /* 16 */ { t: 'C4 · Contract — only after v1 is gone', body: two(col(ma(SQ(F.CONTRACT.split('\n').filter((l) => !/^-- Lab 9/.test(l)).join('\n'), ['DROP COLUMN']), 14.5),
    nho(T(lines(O.C4_CDEPLOY, 6), ['Applying'], { title: 'npx prisma migrate deploy (real)' }), 12.5)),
    col(`<div class="tcap">a v1 instance that was NOT stopped first</div>`, nho(T(fit(O.C4_P2022, W.r6, 12.5), ['P2022', 'does not exist'], { title: 'terminal — real output (wrapped)' }), 12.5),
      box('P2022', '“the column does not exist in the current database”. Contract is a <b>separate deploy</b>, after checking that nothing reads the old column.', 'do2')), 'r46'), giua: true },

  /* 17 */ { t: 'C5 · Checkout: one transaction, atomic lines', body: two(ma(JS(fit(lines(F.CHECKOUT, 7, 25).split('\n').map((l) => l.replace(/\s+\/\/ .*$/, '')).filter((l) => !/^\s*\/\//.test(l)).join('\n'), W.r6, 12), ['$transaction', 'updateMany', 'stock: { gte', 'decrement', 'count === 0']), 12),
    col(box('The rule of 16.4, case 2', 'never read the stock into JavaScript and write back <code class="i">stock - qty</code>. One statement: <b>take qty if at least qty is left</b> — it returns how many rows changed.', 'lam'),
      ma(SQ('UPDATE product SET stock = stock - $1\nWHERE id = $2 AND is_active\n  AND stock >= $3;\n-- 0 rows ⇒ throw ⇒ ROLLBACK', ['stock >= $3']), 14),
      nho(T(fit(`$ POST /orders  cart 30×1 · 4×2 · 4×1
${curlL(O.C5_CURL, /"status":"pending"/)}
$ POST /orders  cart 4×1 · 34×90
${curlL(O.C5_CURL, /OUT_OF_STOCK/)}`, W.r4, 12), ['"items":2', 'OUT_OF_STOCK'], { title: 'curl — real output (wrapped)' }), 12)), 'r64'), giua: true },

  /* 18 */ { t: 'C5 · Two buyers, one last unit', body: `${nho(T(fit(lines(O.C5_RACE, 0, 6), W.full, 13.5), ['✓ order 1', '✓ order 2', 'OUT_OF_STOCK'], { title: 'npm run race — cases 1 and 2 (real, test database)' }), 13.5)}
${two(tbl(['read-modify-write', 'buyer A', 'buyer B'], [
      ['1', 'reads stock 1', 'reads stock 1'],
      ['2', 'UPDATE stock = 0 · locks', 'UPDATE stock = 0 · waits'],
      ['3', 'COMMIT', '<b>writes its stale 0</b> · COMMIT'],
      ['⇒', '<b>2 orders</b>', '<b>1 unit</b> left the stock'],
    ], { o: [[2, 2], [3, 1], [3, 2]] }),
    tbl(['atomic UPDATE', 'buyer A', 'buyer B'], [
      ['1', 'UPDATE … WHERE stock >= 1', 'same UPDATE · waits'],
      ['2', 'COMMIT (stock 0)', ''],
      ['3', '', 're-checks WHERE on the new row: <b>0 rows</b>'],
      ['⇒', '<b>1 order</b>', '<b>409</b>, nothing written'],
    ], { o: [[3, 1], [3, 2]] }))}
${p('Lost update inside an ORM: no error anywhere. READ COMMITTED re-evaluates the <b>WHERE</b> of an UPDATE after a wait — that is why the atomic version is correct.', 20)}`, giua: true },

  /* 19 */ { t: 'C5 · Deadlock, sorting, and the retry that never retried', body: two(col(nho(T(fit(lines(O.C5_RACE, 6), W.r6, 12), ['40P01', 'retry 1/2', '842 ms'], { title: 'npm run race — cases 3a–3c (real, wrapped)' }), 12),
    nho(T(fit(O.C5_ERR, W.r6, 12), ['no code', 'code: undefined', 'P2034'], { title: 'what Prisma 5.22 throws (real, wrapped)' }), 12)),
    col(box('Two fixes, keep both', '<b>sort the cart by product_id</b> — the second buyer just waits ~0,8 s · <b>retry the whole transaction</b> on a collision', 'xanh'),
      box('The trap', 'a deadlock inside an interactive transaction is <b>not P2034</b>: an <b>UnknownRequestError with no code</b> — 40P01 only in the text. A retry on P2034 alone never retries it.', 'do2')), 'r64'), giua: true },

  /* 20 */ { t: 'C6 · The connection arithmetic', body: `${two(nho(PQ(O.C6_MAX.split('\n').filter((l) => !/^\(1 row\)$|^$/.test(l)).join('\n'), ['100', ' 3'], { title: 'psql — real output' }), 14.5),
    col(tbl(['', 'per process', '× 3 processes', 'of 97'], [
      ['CT Shop: <b>connection_limit=5</b>', '5', '<b>15</b>', '15 %'],
      ['Prisma default on 12 cores (2 × 12 + 1)', '25', '75', '77 %'],
      ['HOLD test “fixed” with a pool of 20', '20', '60', '62 %'],
    ], { hl: [0], mo: [1, 2] }),
      box('Headroom is for…', 'migrations (they connect <b>last</b> — case 3 of 16.4), psql, monitoring, a fourth process on a busy day.', 'lam')), 'r37')}
${giuKetNoi()}`, giua: true },

  /* 21 */ { t: 'C6 · Payment under load: HOLD vs SHORT', body: two(col(nho(T(fit(O.C6_HOLD, W.half, 11.5), ['idle in transaction=5', '503×120', '2160']), 11.5),
    nho(T(fit(O.C6_HOLD20, W.half, 11.5), ['idle in transaction=20', '201×400']), 11.5),
    nho(T(fit(O.C6_SHORT, W.half, 11.5), ['201×400', '327', '133.34']), 11.5)),
    col(box('HOLD — gateway inside the transaction', '5 connections <b>idle in transaction</b>, each with a row lock ⇒ ≈16 payments/s ⇒ the queue waits > 2 s ⇒ <b>P2024</b> / <b>P2028</b> ⇒ 120 × 503.', 'do2'),
      box('A bigger pool hides it', '20 per process, all idle in transaction: 60 of 97 for three processes.', ''),
      box('SHORT — the real fix', 'read → gateway (no connection) → one short transaction. Pool of 5: <b>400/400</b>, p50 327 ms, <b>6×</b> the throughput.', 'xanh'))), giua: true },

  /* 22 */ { t: 'C7 · Revenue report: $queryRaw + window functions', body: two(ma(SQ(fit(lines(F.REPORT, 6, 17).replace(/^\s{6}/gm, ''), W.half, 12), ['${tu}', '${den}', 'OVER (ORDER BY thang)', 'lag(']), 12),
    col(tbl(['month', 'orders', 'revenue (đ)', 'running total', 'growth %'], REPORT.months.slice(2, 7).map((m) => [`<span style="white-space:nowrap">${m.thang}</span>`, m.so_don, vnd(m.doanh_thu), vnd(m.luy_ke), m.tang_pct ?? '—']), { cap: 'GET /reports/revenue?from=2025-10&to=2026-09 — real (5 of 12 months)', hl: [1, 2, 3, 4] }),
      box('Tagged template = parameters', 'every <code class="i">${…}</code> is sent as <b>$1, $2</b> — never pasted into the SQL. Months are Vietnamese: <code class="i">AT TIME ZONE \'Asia/Ho_Chi_Minh\'</code>. Jan–Apr: <b>75 · 64 · 92 · 69</b> — the brief.', 'xanh'))), giua: true },

  /* 23 */ { t: 'C7 · Which query, then why: the log, then EXPLAIN', body: two(nho(T(fit(lines(O.C7_LOG, 0, 13), W.r4, 11), ['$1 AND paid_at < $2', 'UTC'], { title: 'LOG_SQL=1 — the report as sent (real)' }), 11),
    col(nho(PQ(fit(pick(O.C7_EXPLAIN_TRUOC, /Seq Scan|Rows Removed|Execution Time/).replace(/\(actual time=[^)]*\)/g, ''), W.r6, 13), ['Seq Scan'], { title: 'EXPLAIN (ANALYZE, BUFFERS) — before (lines selected, times trimmed)' }), 13),
      tbl(['screen', 'reads', 'keeps'], [['report (12 months)', '<b>2.312</b> pages of payment', '956 rows'], ['My orders, customer 42', '<b>2.854</b> pages of orders', '1.157 ⇒ sort ⇒ 11']], {}),
      box('16.4, in order', 'statistics say <b>which</b> query; only then EXPLAIN says <b>why</b>: no index on <code class="i">paid_at</code>, none on <code class="i">customer_id</code>.', 'lam')), 'r46'), giua: true },

  /* 24 */ { t: 'C7 · Trap: a plain CREATE INDEX blocks every write', body: two(nho(T(fit(O.C7_LOCK, W.r6, 11.5), ['RowExclusiveLock | f', 'LOCK_TIMEOUT', 'after 3.1']), 11.5),
    col(box('SHARE lock', 'reads go on; <b>writes wait</b> until the build ends.', 'do2'),
      box('lock_timeout saved it', 'after the role’s <b>3 s</b> the order got a clear <b>503</b> (55P03 — Prisma does not name it either).', 'lam'),
      box('So', '<b>CONCURRENTLY</b>, one statement per migration file (two ⇒ one block ⇒ 25001, 16.1).', 'xanh')), 'r64'), giua: true },

  /* 25 */ { t: 'C7 · Two CONCURRENTLY migrations — before / after', body: two(col(ma(SQ(fit([F.IDX1, F.IDX2].map((x) => x.split('\n').filter((l) => !/^--/.test(l)).join('\n')).join('\n'), W.r4, 12.5), ['CONCURRENTLY']), 12.5),
    ma(sql('// schema.prisma — so migrate diff stays empty\n@@index([customer_id,\n         created_at(sort: Desc),\n         id(sort: Desc)])     // orders\n@@index([paid_at])           // payment', { sm: true, lang: 'typescript' }), 12.5),
    nho(T(O.C7_DIFF_SAU, ['empty'], { title: 'migrate diff after deploy (real)' }), 13)),
    col(nho(PQ(fit(pick(O.C7_EXPLAIN_SAU, /Index Scan|Bitmap Heap|Execution Time/).replace(/\(actual time=[^)]*\)/g, ''), W.r6, 12.5), ['Index Scan using', 'Bitmap Index Scan'], { title: 'EXPLAIN — after (lines selected, times trimmed)' }), 12.5),
      tbl(['', 'before', 'after'], [['report — pages', '2.318', '<b>25</b>'], ['report — ms', '52,3', '<b>0,87</b>'], ['My orders — pages', '2.860', '<b>15</b>'], ['My orders — ms', '20,8', '<b>0,063</b>']], { hl: [0, 2] }),
      p('No Sort node: the index stores customer 42’s orders newest first; LIMIT stops after 11.', 18)), 'r46'), giua: true },

  /* 26 */ { t: 'C7 · Prisma’s cursor, and N+1 with the index', body: `${nho(T(fit(O.C7_CURSOR, W.full, 11.5), ['created_at" = (SELECT', 'OFFSET $6'], { title: 'LOG_SQL=1 — GET /customers/42/orders?limit=3&before=1238 (real, wrapped)' }), 11.5)}
${two(col(box('What it means', '<code class="i">cursor: { id }, skip: 1</code> ⇒ a row comparison through three subqueries on the cursor row, then <b>OFFSET 1</b>. By hand: <code class="i">WHERE (created_at, id) &lt; ($2, $3)</code>.', 'lam'),
    p('Page 1 of customer 42 (real): <b>302002 · 302001</b> (pending — placed in C4) · 1841 (shipped) · next "1841".', 18)),
    col(nho(T(fit(O.C7_N1_SAU, W.half, 11.5), ['3 SQL', '1 SQL'], { title: 'npm run n1 — with the index (real, wrapped)' }), 11.5), p('Same counts — the statements are just cheaper: loop 838 → 690 ms, nested 111 → 39 ms.', 18)))}`, giua: true },

  /* 27 */ { t: 'C8 · Tests on a database built from the migrations', body: two(ma(JS(`// 1 · drop + create ctlab9_test, owned by ctshop_owner
await chay(ADMIN_URL, [
  'DROP DATABASE IF EXISTS ctlab9_test WITH (FORCE)',
  'CREATE DATABASE ctlab9_test OWNER ctshop_owner']);
// … REVOKE/GRANT CONNECT, schema, default privileges
// 2 · the schema = YOUR migrations, as a deploy does
execFileSync('npx', ['prisma', 'migrate', 'deploy'],
  { env: { ...process.env, DIRECT_URL: testOwnerUrl } });
// 3 · revoke _prisma_migrations · a small fixture
//     written by the APP role`, ['migrate', 'deploy']), 13),
    col(nho(T(fit(pick(O.C8_TEST, /✓ ctlab9_test|^✔|^ℹ (tests|pass|fail)/).replace(/ \([\d.]+ms\)/g, ''), W.half, 11.5), ['8', 'pass 8', 'fail 0'], { title: 'npm test — real output (lines selected, times removed)' }), 11.5),
      box('Why from the migrations', 'it proves they rebuild the real schema — the faithful <b>0_init</b> of C2 pays off. <code class="i">node --test</code> is built into Node 22.', 'xanh'))), giua: true },

  /* 28 */ { t: 'C9 · The checklist, read line by line', body: `${nho(PQ(KT(O.C9_KT), ['| ✗'], { title: 'kiem-tra.sql — as postgres, before (the ✗ lines)' }), 12.5)}
${nho(PQ(KT(O.C9_KT_SAU), ['| ✓'], { title: 'after ALTER SYSTEM + restart' }), 12.5)}
${tbl(['line', 'who fixes it'], [
      ['3 · 4 timeouts', 'the <b>role</b> (C1): ✓ when run as ctshop_app; ✗ only for your own psql session'],
      ['5 · 6 · 7', 'the <b>server</b>: ALTER SYSTEM + reload / restart — no app, no migration can · <code class="i">pg_settings</code> shows the old values until then'],
      ['8 · 6 FKs, no index', 'a <b>decision</b>: C7 indexed the one a screen needs; the other five slow only rare deletes'],
    ])}`, giua: true },

  /* 29 */ { t: 'C9 · What did the API spend its time on?', body: `${nho(PQ(np(O.C9_TOP), ['WITH m AS'], { title: 'pg_stat_statements — ctshop_app, after a few hundred requests (real)' }), 13.5)}
${two(box('The slow burn', 'the report tops the list: <b>5</b> of its 25 calls asked for <b>2023–2024</b> — 275.713 of 277.376 payments, so the planner rightly reads all 2.312 pages (133 ms). No index helps when you want 99 % of a table.', 'do2'),
    box('Challenge 1', 'a monthly summary (materialized view refreshed nightly, Lab 6) for closed months.', 'xanh'))}`, giua: true, to: true },

  /* 30 */ { t: 'C9 · The restore drill — and what did not come back', body: two(col(nho(T(fit(O.C9_RESTORE, W.half, 11.5), ['8714443'], { title: 'terminal — real output (wrapped)' }), 11.5),
    nho(PQ(np(O.C9_DEM), ['302002', '_prisma_migrations'], { title: 'dem-dong.sql on the copy — diff with the original: nothing' }), 11)),
    col(nho(T(lines(O.C9_STATUS, 3), ['up to date'], { title: 'migrate status on ctlab9_restore' }), 12.5),
      nho(PQ(fit(O.C9_ACL, W.half, 11), ['ctlab9_restore'], { title: 'psql — real output (wrapped)' }), 11),
      box('Lost: the database-level grants', 'empty <code class="i">datacl</code> = PUBLIC may CONNECT again. <code class="i">pg_dump</code> without <code class="i">--create</code> does not dump them; roles need <code class="i">pg_dumpall --roles-only</code> (15.1).', 'do2'))), giua: true },

  /* 31 */ { t: 'Check yourself', body: `<ol>
<li>Why is <code class="i">migrate resolve --applied 0_init</code> right on ctlab9 — and what would it mean after a half-applied migration?</li>
<li>Both checkouts ran in a transaction. Why did only the read-modify-write one oversell?</li>
<li>A pool of 20 removed the P2024 errors of the HOLD test. Why is it still the wrong fix?</li>
</ol>
${box('Answers', '<b>1</b> A baseline records a fact (0_init exists — compared and replayed); after a failed migration “applied” is a lie that hides a broken schema. · <b>2</b> READ COMMITTED: both read 1, the second waited and wrote its stale 0; the atomic UPDATE re-checks <code class="i">stock &gt;= 1</code> on the newest row ⇒ 0 rows ⇒ 409. · <b>3</b> the cause is a connection held during a 300 ms external call; 20 per process = 60 of 97 idle in transaction with row locks. Moving the gateway out served 400/400 on 5.', 'xanh')}`, giua: true, to: true },

  /* 32 */ { t: 'You have finished the course', body: `${cards([
    ['Lab 1 → Lab 9', 'from <b>CREATE TABLE customer</b> to a tested API that adopts a live database, survives a rolling deploy, sells the last unit once and can be restored'],
    ['The method', 'statistics first (pg_stat_activity, pg_stat_statements) → EXPLAIN → a migration → measure again'],
    ['Exam room', '<b>PE1 · PE2</b> (timed SQL tasks on CT Shop) · <b>FE1 · FE2</b> (multiple choice over all chapters) — with worked solutions'],
    ['Chapter 17', 'PostgreSQL next to SQL Server, MySQL and MongoDB — the same CT Shop queries; “why PostgreSQL here?”'],
    ['Keep the app', 'TypeScript (the types are generated) · Docker next to PostgreSQL · deploy to a VPS with the checklist'],
    ['Extra challenges', 'monthly summary · CHECK tests · a fourth process · read-your-writes with the replica of Lab 8'],
  ], 3)}
${p('Next: Chapter 17 — four database systems, side by side · then the final exams at <b>cuongthai.com/exam</b>.', 22)}`, giua: true },
]);
