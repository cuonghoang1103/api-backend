/**
 * pg-16-hinh.mjs — hình dùng chung cho Chương 16 — PostgreSQL trên production & capstone (deck pg-16-1…4). Không phải deck. (agent c16, 26/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng tw(). Phần tử video cần chú thích có data-k.
 * Mọi con số chép từ video-bai-giang/src/khung/pg/that/pg-16-*.out.txt + that/c16/* (chạy thật: Prisma 5.22.0 · PostgreSQL 17.11 trên
 * pgcourse17 · PostgreSQL 16.15 + pgvector 0.8.6 + PostGIS 3.4.3 trong container nháp pgc16tmp dựng từ ảnh giống production).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a', VANG = '#d4a017';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs>` + [['', NAU], ['x', XANH], ['d', DO], ['b', PG], ['t', TIM], ['c', CAM], ['g', XAM]].map(([k, c]) => `<marker id="${id}${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('') + `</defs>`;
const T = (x, y, s, { fs = 20, fw = 400, fill = '#333', anchor = 'start', mono = false, k = '', it = false } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}${it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, { fill = '#fff', st = PG, sw = 2.5, rx = 10, k = '', dash = '' } = {}) =>
  `<rect${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const L = (x1, y1, x2, y2, { st = NAU, sw = 3, m = '', dash = '', k = '' } = {}) =>
  `<line${k ? ` data-k="${k}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}"${m ? ` marker-end="url(#${m})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const E = (x, y, s, fs = 34) => `<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle">${s}</text>`;

/* ═══════════════════════════ 16.1 ═══════════════════════════ */

/** Đời thường: bản vẽ nhà hiện tại · sổ sửa nhà đánh số · sổ đóng dấu của từng căn nhà. */
export function blueprintPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'bp');
  const col = [
    ['bp-plan', PG, '#eef4fa', '📐', 'schema.prisma', 'today’s floor plan', ['what the house should', 'look like NOW']],
    ['bp-log', CAM, '#fff7ef', '📒', 'prisma/migrations/', 'the renovation log', ['numbered steps, kept forever:', '001 build · 002 add a room…']],
    ['bp-stamp', XANH, '#f1f9f4', '🏠', '_prisma_migrations', 'each house’s stamp book', ['which steps THIS house', 'already received (dev, prod…)']],
  ];
  const cw = 340, gap = (w - 3 * cw) / 2;
  col.forEach(([k, m, bg, e, t, sub, ds], i) => {
    const x = i * (cw + gap);
    s += R(x, 0, cw, h - 54, { fill: bg, st: m, k });
    s += E(x + cw / 2, 58, e, 46);
    s += T(x + cw / 2, 104, t, { fs: 21, fw: 800, fill: m, anchor: 'middle', mono: true });
    s += T(x + cw / 2, 136, sub, { fs: 20, fw: 700, fill: '#333', anchor: 'middle' });
    ds.forEach((d, j) => { s += T(x + cw / 2, 176 + j * 28, d, { fs: 18, fill: '#555', anchor: 'middle' }); });
    if (i < 2) s += L(x + cw + 6, (h - 54) / 2, x + cw + gap - 8, (h - 54) / 2, { st: NAU, sw: 3, m: 'bp' });
  });
  s += T(w / 2, h - 14, 'You never repaint an old log page — you add a new step.', { fs: 21, fw: 700, fill: NAU, anchor: 'middle', it: true });
  return s + '</svg>';
}

/** Vòng đời một migration: dev → git → CI → production. */
export function lifecyclePic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'lc');
  const st = [
    ['lc-dev', PG, '💻 laptop (dev)', ['edit schema.prisma', 'migrate dev --name x', '→ migration.sql', '+ shadow DB check']],
    ['lc-git', TIM, '🗂️ git', ['commit the file', 'review the SQL', '(never edit it later)', '']],
    ['lc-ci', CAM, '🧪 CI / staging', ['migrate deploy on a', 'fresh copy', 'production-sized data', 'tsc + seed check']],
    ['lc-prod', XANH, '🚀 production', ['migrate deploy', 'applies pending only', 'records a row in', '_prisma_migrations']],
  ];
  const bw = 246, gap = (w - 4 * bw) / 3;
  st.forEach(([k, m, t, ds], i) => {
    const x = i * (bw + gap);
    s += R(x, 10, bw, 220, { fill: '#fff', st: m, sw: 3, k });
    s += R(x, 10, bw, 48, { fill: m, st: m, sw: 3 });
    s += T(x + bw / 2, 42, t, { fs: 20, fw: 800, fill: '#fff', anchor: 'middle' });
    ds.forEach((d, j) => { s += T(x + 14, 92 + j * 34, d, { fs: 17, fill: '#333', mono: d.startsWith('migrate') }); });
    if (i < 3) s += L(x + bw + 4, 120, x + bw + gap - 6, 120, { st: NAU, sw: 3, m: 'lc' });
  });
  s += R(0, 248, w, 46, { fill: '#fff7ef', st: CAM, sw: 2, k: 'lc-rule' });
  s += T(w / 2, 278, 'The SAME migration.sql travels unchanged — the database applies it, Prisma only records it.', { fs: 18, fw: 700, fill: NAU, anchor: 'middle' });
  return s + '</svg>';
}

/** Phát lại 236 migration thật vào một DB rỗng (PG 16.15): 25 ✓, #26 ✗ (P3018 · 42P07), 210 không bao giờ chạy. */
export function replayPic({ w = 1110, cw = 17, ch = 24 } = {}) {
  const n = 236, gx = 2, gy = 5;
  const per = Math.floor((w + gx) / (cw + gx)), rows = Math.ceil(n / per);
  const gh = rows * (ch + gy);
  const leg = [['#cfe9d8', XANH, '25 applied', XANH], [DO, DO, '#26 add_music_and_profile ⇒ P3018 · 42P07', DO], ['#eee', '#ccc', '210 never reached', '#777']];
  const motDong = w >= 1000;
  const h = gh + (motDong ? 40 : 3 * 30 + 10);
  let s = head(w, h, 'rp');
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), q = i % per, x = q * (cw + gx), y = r * (ch + gy);
    const ok = i < 25, bad = i === 25;
    s += R(x, y, cw, ch, { fill: ok ? '#cfe9d8' : bad ? DO : '#eee', st: ok ? XANH : bad ? DO : '#ccc', sw: 1.4, rx: 3, k: ok ? 'rp-ok' : bad ? 'rp-bad' : 'rp-skip' });
  }
  let lx = 0;
  leg.forEach(([f, st, t, c], i) => {
    const y = motDong ? gh + 26 : gh + 26 + i * 30;
    const x = motDong ? lx : 0;
    s += R(x, y - 16, 18, 18, { fill: f, st, sw: 1.4, rx: 3 }) + T(x + 26, y, t, { fs: 18, fw: 700, fill: c, k: `rp-l${i}` });
    lx += tw(t, 18) * 0.92 + 70;
  });
  return s + '</svg>';
}

/** Expand → backfill → contract: thêm cột phone bắt buộc cho bảng đã có dữ liệu, không làm chết trang. */
export function expandPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'ex');
  const st = [
    ['ex-1', PG, '1 · EXPAND', 'migration A', ['ADD COLUMN phone TEXT', '(nullable — instant)'], 'old code: ignores phone', 'new code: writes phone'],
    ['ex-2', CAM, '2 · BACKFILL', 'script, in batches', ['UPDATE … SET phone = …', 'WHERE phone IS NULL'], 'all rows get a value', 'app keeps writing it'],
    ['ex-3', XANH, '3 · CONTRACT', 'migration B (later deploy)', ['CHECK … NOT VALID', 'VALIDATE · SET NOT NULL'], 'now phone is required', 'schema: phone String'],
  ];
  const bw = 340, gap = (w - 3 * bw) / 2;
  st.forEach(([k, m, t, sub, sq, a, b], i) => {
    const x = i * (bw + gap);
    s += R(x, 0, bw, h - 4, { fill: '#fff', st: m, sw: 3, k });
    s += R(x, 0, bw, 50, { fill: m, st: m, sw: 3 });
    s += T(x + bw / 2, 34, t, { fs: 22, fw: 800, fill: '#fff', anchor: 'middle' });
    s += T(x + bw / 2, 82, sub, { fs: 18, fw: 700, fill: m, anchor: 'middle' });
    s += R(x + 14, 98, bw - 28, 74, { fill: '#1e1e1e', st: '#1e1e1e', rx: 8 });
    sq.forEach((q, j) => { s += T(x + 26, 128 + j * 28, q, { fs: 16, fill: '#d4d4d4', mono: true }); });
    s += T(x + 18, 214, '• ' + a, { fs: 18, fill: '#333' });
    s += T(x + 18, 246, '• ' + b, { fs: 18, fill: '#333' });
    if (i < 2) s += L(x + bw + 3, 140, x + bw + gap - 4, 140, { st: NAU, sw: 3, m: 'ex' });
  });
  s += T(w / 2, h + 0, '', { fs: 2 });
  return s + '</svg>';
}

/** Hàng đợi khoá: phiên app giữ giao dịch → migration chờ ACCESS EXCLUSIVE → mọi SELECT sau xếp hàng sau migration. Số thật khoa/cho-*.txt. */
export function lockQueuePic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'lq');
  const x0 = 210, sc = 100; // 1 s = 100 px
  const lane = [
    ['ss-app', PG, 'app: BEGIN; SELECT …;', 0, 8.01, 'holds ACCESS SHARE 8 s (open transaction)'],
    ['ss-migration', CAM, 'migration: ALTER TABLE', 1, 8.01, 'waits for ACCESS EXCLUSIVE — 7.0 s'],
    ['ss-user', DO, 'user: SELECT 1 row', 2, 8.0, 'queued BEHIND the migration — 6.0 s'],
  ];
  lane.forEach(([k, m, t, a, b, note], i) => {
    const y = 14 + i * 64;
    s += T(0, y + 30, t, { fs: 16, fw: 700, fill: m, mono: false });
    s += R(x0 + a * sc, y + 6, (b - a) * sc, 36, { fill: i ? `${m}33` : `${m}22`, st: m, sw: 2, rx: 6, k: `lq-${i}` });
    s += T(x0 + a * sc + 10, y + 30, note, { fs: 15, fw: 700, fill: '#333' });
  });
  for (let t = 0; t <= 8; t++) s += L(x0 + t * sc, 206, x0 + t * sc, 214, { st: '#999', sw: 2 }) + T(x0 + t * sc, 234, `${t} s`, { fs: 14, fill: '#777', anchor: 'middle', mono: true });
  s += L(x0, 210, x0 + 8.3 * sc, 210, { st: '#999', sw: 2 });
  return s + '</svg>';
}

/* ═══════════════════════════ 16.2 ═══════════════════════════ */

/** Đời thường: bản đồ thành phố — đừng đọc danh bạ từ A tới Z; bắt đầu từ MỘT địa điểm rồi đi theo đường. */
export function mapPic({ w = 1110, h = 290 } = {}) {
  let s = head(w, h, 'mp');
  s += R(0, 0, 420, h - 6, { fill: '#fdf0ee', st: DO, k: 'mp-l' });
  s += T(20, 36, '✗ Reading the phone book A → Z', { fs: 21, fw: 800, fill: DO });
  ['Aaron St. … 17,382 lines', 'Abbey Rd. …', 'Acacia Ave. …', '… 602 tables later …', 'Zurich Way'].forEach((t, i) => { s += T(30, 82 + i * 38, t, { fs: 19, fill: '#7a2a1d', mono: true }); });
  s += T(20, 270, 'you learn nothing about the city', { fs: 18, fw: 700, fill: DO, it: true });
  s += R(450, 0, w - 450, h - 6, { fill: '#f1f9f4', st: XANH, k: 'mp-r' });
  s += T(470, 36, '✓ Start from ONE place, follow the roads', { fs: 21, fw: 800, fill: XANH });
  const nut = [['📍 Feed', 545, 150, CAM, 'mp-start'], ['social_posts', 730, 150, PG, 'mp-n'], ['users', 990, 80, PG, 'mp-n'], ['post_music', 990, 150, PG, 'mp-n'], ['social_comments', 970, 220, PG, 'mp-n']];
  s += L(590, 150, 642, 150, { st: NAU, sw: 3, m: 'mp' });
  s += L(820, 140, 940, 86, { st: XAM, sw: 2.5, m: 'mpg' }) + L(820, 150, 920, 150, { st: XAM, sw: 2.5, m: 'mpg' }) + L(820, 160, 880, 212, { st: XAM, sw: 2.5, m: 'mpg' });
  nut.forEach(([t, x, y, m, k]) => { s += R(x - tw(t, 17) / 2 - 12, y - 22, tw(t, 17) + 24, 36, { fill: '#fff', st: m, sw: 2, rx: 8, k }) + T(x, y + 2, t, { fs: 17, fw: 700, fill: m, anchor: 'middle', mono: true }); });
  s += T(470, 270, '1 hop = its tables · 2 hops = the whole feature', { fs: 18, fw: 700, fill: XANH, it: true });
  return s + '</svg>';
}

/** Lược đồ lớn dần (git log của prisma/schema.prisma + số migration theo tháng). */
export function growthPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'gr');
  const d = [['1 Jul', 122, 3485], ['1 Aug', 248, 6980], ['1 Sep', 278, 8193], ['1 Oct', 365, 10754], ['26 Oct', 602, 17382]];
  const bw = 120, gap = 46, x0 = 30, base = 240, sc = 200 / 602;
  s += T(0, 22, 'models in schema.prisma (git history)', { fs: 18, fw: 800, fill: PG });
  d.forEach(([t, m, l], i) => {
    const x = x0 + i * (bw + gap), hh = m * sc;
    s += R(x, base - hh, bw, hh, { fill: i === 4 ? PG : '#c9dbec', st: PG, sw: 2, rx: 6, k: 'gr-b' });
    s += T(x + bw / 2, base - hh - 10, String(m), { fs: 22, fw: 800, fill: PG, anchor: 'middle', mono: true });
    s += T(x + bw / 2, base + 26, t, { fs: 17, fill: '#444', anchor: 'middle' });
    s += T(x + bw / 2, base + 50, `${l.toLocaleString('en-US')} lines`, { fs: 14, fill: '#777', anchor: 'middle', mono: true });
  });
  const mx = 880, mig = [['Jun', 16], ['Jul', 38], ['Aug', 69], ['Sep', 45], ['Oct', 68]];
  s += T(mx - 20, 22, 'migrations / month', { fs: 18, fw: 800, fill: CAM });
  mig.forEach(([t, n], i) => {
    const y = 44 + i * 44;
    s += T(mx - 20, y + 22, t, { fs: 16, fill: '#444' });
    s += R(mx + 22, y + 4, n * 2.6, 26, { fill: '#fde3c5', st: CAM, sw: 2, rx: 5, k: 'gr-m' }) + T(mx + 30 + n * 2.6, y + 24, String(n), { fs: 16, fw: 800, fill: NAU, mono: true });
  });
  return s + '</svg>';
}

/** ERD Crow's Foot một mảng THẬT: feed (users · social_posts · social_comments tự tham chiếu · post_music · songs). */
export function erdFeedPic({ w = 1110, h = 400 } = {}) {
  let s = head(w, h, 'ef');
  const bang = (k, x, y, ten, cot, m = PG) => {
    const bw = 236, rh = 26;
    let t = R(x, y, bw, 36 + cot.length * rh + 8, { fill: '#fff', st: m, sw: 2.5, rx: 8, k }) + R(x, y, bw, 36, { fill: m, st: m, sw: 2.5, rx: 8 });
    t += T(x + 12, y + 25, ten, { fs: 18, fw: 800, fill: '#fff', mono: true });
    cot.forEach(([c, tag], i) => { t += T(x + 12, y + 60 + i * rh, `${tag ? tag + ' ' : '   '}${c}`, { fs: 15, fill: tag === 'PK' ? NAU : tag ? PG : '#333', fw: tag ? 700 : 400, mono: true }); });
    return t;
  };
  s += bang('ef-users', 0, 120, 'users', [['id', 'PK'], ['username', ''], ['email', ''], ['… 287 fields', '']], TIM);
  s += bang('ef-posts', 330, 0, 'social_posts', [['id', 'PK'], ['author_id', 'FK'], ['content', ''], ['type, status…', '']]);
  s += bang('ef-cmt', 330, 210, 'social_comments', [['id', 'PK'], ['post_id', 'FK'], ['user_id', 'FK'], ['parent_id', 'FK'], ['root_id', 'FK']]);
  s += bang('ef-pm', 660, 0, 'post_music', [['id', 'PK'], ['post_id', 'UQ'], ['song_id', 'FK']]);
  s += bang('ef-songs', 660, 210, 'songs', [['id', 'PK'], ['uploaded_by_id', 'FK'], ['title, artist…', '']]);
  // nối (1 — N)
  const crow = (x, y, dir) => { const d = dir * 14; return `<path d="M${x},${y} L${x + d},${y - 9} M${x},${y} L${x + d},${y + 9} M${x},${y} L${x + d},${y}" stroke="${NAU}" stroke-width="2.5" fill="none"/>`; };
  s += L(236, 170, 330, 60, { st: NAU, sw: 2.5 }) + crow(330, 60, -1);
  s += L(236, 200, 330, 300, { st: NAU, sw: 2.5 }) + crow(330, 300, -1);
  s += L(448, 128, 448, 210, { st: NAU, sw: 2.5 }) + crow(448, 210, -1).replace(/M448,210 L434,201 M448,210 L434,219/, 'M448,210 L439,196 M448,210 L457,196');
  s += L(566, 60, 660, 60, { st: NAU, sw: 2.5 }) + T(612, 52, '1 : 0..1', { fs: 14, fw: 700, fill: NAU, anchor: 'middle' });
  s += L(778, 128 - 8, 778, 210, { st: NAU, sw: 2.5 });
  s += `<path data-k="ef-self" d="M566,330 C640,330 640,380 566,380" stroke="${TIM}" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/>` + T(650, 360, 'parent / root', { fs: 14, fw: 700, fill: TIM });
  s += L(896, 260, 930, 260, { st: NAU, sw: 2 }) + T(940, 256, '→ users', { fs: 15, fill: NAU, mono: true });
  s += R(910, 10, 200, 120, { fill: '#fff7ef', st: CAM, sw: 2, rx: 8, k: 'ef-note' }) + T(920, 38, 'real names from', { fs: 15, fill: '#555' }) + T(920, 62, 'the replica built', { fs: 15, fill: '#555' }) + T(920, 86, 'from schema.prisma', { fs: 15, fill: '#555' }) + T(920, 112, '(PostgreSQL 16)', { fs: 15, fill: '#555' });
  return s + '</svg>';
}

/** Lược đồ thật ↔ các chương đã học. */
export function chapterMapPic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'cm');
  const it = [
    ['@id · @unique · @relation', '873 FOREIGN KEY, 1,751 indexes', 'Ch 3 keys', PG],
    ['@@index([authorId, createdAt(sort: Desc)])', '“newest posts of one author”', 'Ch 9–10 indexes', CAM],
    ['$transaction · 241 FKs into users', 'locks, lost updates, retries', 'Ch 11 transactions', TIM],
    ['metadata Json @db.JsonB · content_trgm', 'JSONB + GIN, trigram search', 'Ch 13 search', XANH],
    ['Unsupported("vector(384)") + HNSW', 'nearest-neighbour search (pgvector)', 'Ch 9 + 13 + this lesson', NAU],
    ['one PrismaClient per container', 'connection_limit × containers', 'Ch 14 pool', DO],
  ];
  it.forEach(([a, b, c, m], i) => {
    const y = i * 54;
    s += R(0, y, 470, 44, { fill: '#fff', st: m, sw: 2, rx: 8, k: 'cm-a' }) + T(12, y + 29, a, { fs: 16, fw: 700, fill: m, mono: true });
    s += L(474, y + 22, 520, y + 22, { st: m, sw: 2.5, m: 'cm' });
    s += T(530, y + 29, b, { fs: 17, fill: '#333' });
    s += R(890, y, 220, 44, { fill: m, st: m, sw: 2, rx: 8, k: 'cm-c' }) + T(1000, y + 29, c, { fs: 16, fw: 800, fill: '#fff', anchor: 'middle' });
  });
  return s + '</svg>';
}

/* ═══════════════════════════ 16.3 ═══════════════════════════ */

/** Đời thường: bảng kiểm trước khi cất cánh — mỗi dòng là một vụ tai nạn đã xảy ra. */
export function pilotPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'pl');
  s += R(0, 0, 470, h - 6, { fill: '#fffaf5', st: CAM, k: 'pl-l' });
  s += T(20, 36, '✈️ Pre-flight checklist', { fs: 22, fw: 800, fill: NAU });
  ['☑ fuel quantity checked', '☑ flaps set for take-off', '☑ flight controls free', '☑ doors armed'].forEach((t, i) => { s += T(30, 82 + i * 38, t, { fs: 20, fill: '#333', mono: true }); });
  s += T(20, 250, 'read aloud EVERY flight — even by 30-year pilots', { fs: 16, fw: 700, fill: NAU, it: true });
  s += L(480, h / 2, 540, h / 2, { st: NAU, sw: 3, m: 'pl' });
  s += R(550, 0, w - 550, h - 6, { fill: '#eef4fa', st: PG, k: 'pl-r' });
  s += T(570, 36, '🐘 Database before real users arrive', { fs: 22, fw: 800, fill: PG });
  ['☐ a restore you actually tested', '☐ connections × pools < max', '☐ timeouts on every app role', '☐ stats + slow-query log ON'].forEach((t, i) => { s += T(580, 82 + i * 38, t, { fs: 20, fill: '#333', mono: true }); });
  s += T(570, 250, 'each line = a failure that is invisible until it is total', { fs: 16, fw: 700, fill: PG, it: true });
  return s + '</svg>';
}

/** Checklist không phải làm một lần: mỗi mục "phân rã" theo thời gian. */
export function decayPic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'dc');
  const x0 = 20, x1 = w - 20, y = 70;
  s += L(x0, y, x1, y, { st: '#999', sw: 3, m: 'dcg' });
  const ev = [[0.03, '✓ all checks pass', XANH, 'launch'], [0.25, '+1 worker container', DO, 'pool math breaks'], [0.45, 'backup key rotated', DO, 'dump silently fails'], [0.65, 'table grows 10×', DO, 'autovacuum falls behind'], [0.85, 'new extension', DO, 'restore drill now fails']];
  ev.forEach(([p, t, m, b], i) => {
    const x = x0 + p * (x1 - x0);
    s += `<circle data-k="dc-e" cx="${x}" cy="${y}" r="10" fill="${m}"/>`;
    s += T(x, y - 22, t, { fs: 16, fw: 700, fill: m, anchor: i === 0 ? 'start' : 'middle' });
    s += T(x, y + 36, b, { fs: 15, fill: '#555', anchor: i === 0 ? 'start' : 'middle', it: true });
  });
  s += R(0, 140, w, 80, { fill: '#f1f9f4', st: XANH, sw: 2, k: 'dc-fix' });
  s += T(w / 2, 172, 'Put the whole list on a calendar (quarterly) — and AUTOMATE the restore drill,', { fs: 19, fw: 700, fill: XANH, anchor: 'middle' });
  s += T(w / 2, 202, 'so it stops being something a person has to remember.', { fs: 19, fw: 700, fill: XANH, anchor: 'middle' });
  return s + '</svg>';
}

/* ═══════════════════════════ 16.4 ═══════════════════════════ */

/** Đời thường: bác sĩ — đo sinh hiệu trước khi chữa; triệu chứng ở chỗ này, nguyên nhân ở chỗ khác. */
export function doctorPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'dr');
  const st = [['🩺', 'take the vitals', 'pulse, pressure, temperature — before anything', PG, 'dr-1'], ['🔎', 'symptom ≠ cause', 'a headache from the eyes, chest pain from the stomach', CAM, 'dr-2'], ['💊', 'then treat', 'and write down what you saw', XANH, 'dr-3']];
  const bw = 350, gap = (w - 3 * bw) / 2;
  st.forEach(([e, t, d, m, k], i) => {
    const x = i * (bw + gap);
    s += R(x, 0, bw, h - 50, { fill: '#fff', st: m, sw: 3, k });
    s += E(x + bw / 2, 60, e, 46) + T(x + bw / 2, 112, t, { fs: 23, fw: 800, fill: m, anchor: 'middle' });
    const words = d.split(' '); let line = '', ly = 148;
    words.forEach((wd) => { if (tw(line + ' ' + wd, 17) > bw - 40) { s += T(x + bw / 2, ly, line.trim(), { fs: 17, fill: '#555', anchor: 'middle' }); ly += 26; line = ''; } line += ' ' + wd; });
    s += T(x + bw / 2, ly, line.trim(), { fs: 17, fill: '#555', anchor: 'middle' });
    if (i < 2) s += L(x + bw + 4, (h - 50) / 2, x + bw + gap - 6, (h - 50) / 2, { st: NAU, sw: 3, m: 'dr' });
  });
  s += T(w / 2, h - 14, 'A restart is a strong painkiller: the patient feels better and the cause is never found.', { fs: 19, fw: 700, fill: DO, anchor: 'middle', it: true });
  return s + '</svg>';
}

/** Kiến trúc Lab 9: N tiến trình Node + Prisma (pool) → PostgreSQL CT Shop; migrate deploy bằng role riêng; báo cáo bằng $queryRaw. */
export function lab9Pic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'l9');
  for (let i = 0; i < 3; i++) {
    const y = 10 + i * 100;
    s += R(0, y, 300, 82, { fill: '#eef4fa', st: PG, k: 'l9-app' }) + T(16, y + 32, `Node.js app #${i + 1}`, { fs: 19, fw: 800, fill: PG }) + T(16, y + 60, 'PrismaClient · pool 5', { fs: 16, fill: '#555', mono: true });
    s += L(302, y + 41, 470, 160, { st: PG, sw: 2.5, m: 'l9b' });
  }
  s += R(474, 70, 300, 180, { fill: '#fff', st: NAU, sw: 3, k: 'l9-db' }) + E(624, 128, '🐘', 46) + T(624, 172, 'PostgreSQL · CT Shop', { fs: 19, fw: 800, fill: NAU, anchor: 'middle' }) + T(624, 200, 'schema shop · 8 tables', { fs: 16, fill: '#555', anchor: 'middle', mono: true }) + T(624, 226, 'ctshop_app (rows only)', { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  s += R(850, 10, 260, 90, { fill: '#fff7ef', st: CAM, k: 'l9-mig' }) + T(866, 42, 'CI / deploy', { fs: 18, fw: 800, fill: NAU }) + T(866, 70, 'migrate deploy', { fs: 16, fill: '#333', mono: true }) + T(866, 92, 'as migrator role', { fs: 15, fill: '#666' });
  s += L(848, 70, 778, 120, { st: CAM, sw: 2.5, m: 'l9c' });
  s += R(850, 130, 260, 90, { fill: '#f1f9f4', st: XANH, k: 'l9-rep' }) + T(866, 162, 'report endpoint', { fs: 18, fw: 800, fill: XANH }) + T(866, 190, '$queryRaw + date_trunc', { fs: 16, fill: '#333', mono: true });
  s += L(848, 175, 778, 165, { st: XANH, sw: 2.5, m: 'l9x' });
  s += R(850, 240, 260, 80, { fill: '#f6f1fb', st: TIM, k: 'l9-ck' }) + T(866, 272, 'kiem-tra.sql', { fs: 18, fw: 800, fill: TIM, mono: true }) + T(866, 300, 'every quarter', { fs: 16, fill: '#666' });
  s += L(848, 280, 778, 220, { st: TIM, sw: 2.5, m: 'l9t' });
  s += T(474, 300, '3 × 5 = 15 connections ≪ 97', { fs: 18, fw: 800, fill: PG, mono: true });
  return s + '</svg>';
}

/** Cả khoá theo triệu chứng: triệu chứng → chương trả lời. */
export function courseMapPic({ w = 1110, h = 360 } = {}) {
  let s = head(w, h, 'km');
  const it = [
    ['“wrong data, no error”', 'Ch 11 transactions · lost update', TIM], ['“slow for one query”', 'Ch 9–10 indexes · EXPLAIN', CAM],
    ['“slow everywhere, slowly”', 'Ch 14 VACUUM · idle in transaction', NAU], ['“too many clients”', 'Ch 14 pools · PgBouncer', DO],
    ['“data looks old”', 'Ch 15 replication lag', PG], ['“we lost the database”', 'Ch 15 dump · WAL · PITR', DO],
    ['“search is slow / fuzzy”', 'Ch 13 JSONB · FTS · trigram', XANH], ['“deploy broke the site”', 'Ch 16 migrations · locks', CAM],
  ];
  it.forEach(([a, b, m], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = col * 565, y = row * 88;
    s += R(x, y, 545, 76, { fill: '#fff', st: m, sw: 2.5, rx: 10, k: 'km-i' });
    s += T(x + 16, y + 32, a, { fs: 19, fw: 800, fill: m });
    s += T(x + 16, y + 60, '→ ' + b, { fs: 17, fill: '#333' });
  });
  return s + '</svg>';
}
