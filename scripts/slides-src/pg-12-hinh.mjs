/**
 * pg-12-hinh.mjs — hình dùng chung cho Chương 12 — Hàm, trigger, view, materialized view (deck pg-12-1…4). Không phải deck. (agent c12, 26/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng tw(). Phần tử video cần chú thích có data-k.
 * Số liệu trong hình chép từ video-bai-giang/src/khung/pg/that/pg-12-*.out.txt (PostgreSQL 17.11, schema ch12).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a', VANG = '#d4a017';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs>` + [['', NAU], ['x', XANH], ['d', DO], ['b', PG], ['t', TIM]].map(([k, c]) => `<marker id="${id}${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('') + `</defs>`;
export const T = (x, y, s, { fs = 20, fw = 400, fill = '#333', anchor = 'start', mono = false, k = '', it = false } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}${it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
export const R = (x, y, w, h, { fill = '#fff', st = PG, sw = 2.5, rx = 10, k = '', dash = '' } = {}) =>
  `<rect${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
export const L = (x1, y1, x2, y2, { st = NAU, sw = 3, m = '', dash = '', k = '' } = {}) =>
  `<line${k ? ` data-k="${k}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}"${m ? ` marker-end="url(#${m})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
export const C = (cx, cy, r, { fill = '#fff', st = PG, sw = 2.5, k = '' } = {}) => `<circle${k ? ` data-k="${k}"` : ''} cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`;
export const head12 = head;

/* ═══════════ 12.1 ═══════════ */

/** Hàm = máy bán hàng tự động: tham số vào → hộp → kết quả ra; dưới: 1 chuyến thay vì N chuyến. */
export function hamHopPic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'hh');
  s += T(0, 24, 'A function is a machine: arguments in, one result out', { fs: 21, fw: 800, fill: PG, k: 'hh-t' });
  s += R(0, 44, 230, 90, { fill: '#eef4fa', st: PG, k: 'hh-in' }) + T(115, 80, 'arguments', { fs: 18, fw: 700, fill: PG, anchor: 'middle' }) + T(115, 112, 'uid = 1', { fs: 26, fw: 800, anchor: 'middle', mono: true });
  s += L(236, 89, 330, 89, { m: 'hh', sw: 4 });
  s += R(336, 30, 430, 118, { fill: '#fffaf5', st: CAM, sw: 3.5, k: 'hh-box' }) + T(551, 66, 'note_count(uid)', { fs: 28, fw: 800, fill: NAU, anchor: 'middle', mono: true }) + T(551, 98, 'SELECT count(*) FROM notes', { fs: 17, anchor: 'middle', mono: true, fill: '#555' }) + T(551, 124, 'WHERE user_id = uid', { fs: 17, anchor: 'middle', mono: true, fill: '#555' });
  s += L(772, 89, 866, 89, { m: 'hh', sw: 4 });
  s += R(872, 44, 238, 90, { fill: '#f1f9f4', st: XANH, k: 'hh-out' }) + T(991, 80, 'result', { fs: 18, fw: 700, fill: XANH, anchor: 'middle' }) + T(991, 114, '25', { fs: 34, fw: 800, anchor: 'middle', mono: true, fill: XANH });
  // dưới: vòng đi-về
  s += T(0, 190, 'Why put it in the database?', { fs: 21, fw: 800, fill: PG, k: 'hh-t2' });
  s += R(0, 204, 520, 112, { fill: '#fdf0ee', st: DO, k: 'hh-app' });
  s += T(14, 232, 'App loops: 20 users ⇒ 20 round trips', { fs: 19, fw: 800, fill: DO });
  for (let i = 0; i < 10; i++) s += L(24 + i * 24, 262, 24 + i * 24 + 14, 262, { st: DO, sw: 3, m: '' }) + `<path d="M${24 + i * 24} 252 q8 -12 16 0" fill="none" stroke="${DO}" stroke-width="2"/>`;
  s += T(14, 296, 'App ⇄ network ⇄ DB, again and again', { fs: 17, fill: '#7a2a1d' });
  s += R(590, 204, 520, 112, { fill: '#f1f9f4', st: XANH, k: 'hh-db' });
  s += T(604, 232, 'One query calls the function inside', { fs: 19, fw: 800, fill: XANH });
  s += L(610, 262, 800, 262, { st: XANH, sw: 4, m: 'hhx' }) + L(800, 276, 610, 276, { st: XANH, sw: 4, m: 'hhx' });
  s += T(820, 270, '1 trip', { fs: 22, fw: 800, fill: XANH });
  s += T(604, 302, 'the logic runs where the data already is', { fs: 17, fill: '#1f6b40' });
  return s + '</svg>';
}

/** Ba nhãn volatility: ba cột màu. */
export function volPic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'vp');
  const col = (x, k, ten, mau, dong, nho) => {
    let r = R(x, 8, 350, 314, { fill: mau + '12', st: mau, sw: 3, k }) + T(x + 175, 48, ten, { fs: 29, fw: 800, fill: mau, anchor: 'middle', mono: true });
    dong.forEach(([a, b], i) => { r += T(x + 18, 92 + i * 52, a, { fs: 17, fw: 700, fill: '#444' }) + T(x + 18, 114 + i * 52, b, { fs: 19, fw: 800, fill: mau }); });
    return r + T(x + 175, 308, nho, { fs: 16, fill: '#555', anchor: 'middle', it: true });
  };
  s += col(0, 'vp-i', 'IMMUTABLE', XANH, [['Same arguments ⇒ result?', 'always, forever'], ['Reads tables?', 'never'], ['Planner may…', 'fold to a constant'], ['In an index expression?', 'the ONLY level allowed']], 'lower(text), pure arithmetic');
  s += col(380, 'vp-s', 'STABLE', CAM, [['Same arguments ⇒ result?', 'within ONE statement'], ['Reads tables?', 'yes (read-only)'], ['Planner may…', 'evaluate once for an estimate'], ['In an index expression?', 'no']], 'anything with a SELECT, now()');
  s += col(760, 'vp-v', 'VOLATILE', DO, [['Same arguments ⇒ result?', 'not promised'], ['Reads / writes?', 'both, may change data'], ['Planner may…', 'nothing: call per row'], ['In an index expression?', 'no (the default!)']], 'random(), nextval(), any INSERT');
  return s + '</svg>';
}

/** Đếm số lần gọi: 5 dòng, mỗi nhãn gọi bao nhiêu lần (số thật từ RAISE NOTICE). */
export function callsPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'cp');
  s += T(0, 22, 'WHERE id > f(0)  over 5 rows  — how many NOTICEs?', { fs: 20, fw: 800, fill: PG, k: 'cp-t' });
  const row = (y, ten, mau, plan, rows, k, n) => {
    let r = T(0, y + 34, ten, { fs: 22, fw: 800, fill: mau, mono: true });
    r += R(200, y + 6, 70, 44, { fill: plan ? mau + '22' : '#fff', st: plan ? mau : '#ccc', rx: 8, sw: plan ? 2.5 : 1.5, dash: plan ? '' : '5 5', k: k + '-p' }) + T(235, y + 36, plan ? '1×' : '—', { fs: 20, fw: 800, fill: plan ? mau : '#aaa', anchor: 'middle' });
    for (let i = 0; i < 5; i++) r += R(300 + i * 74, y + 6, 62, 44, { fill: rows ? mau + '22' : '#fff', st: rows ? mau : '#ccc', rx: 8, sw: rows ? 2.5 : 1.5, dash: rows ? '' : '5 5', k: k + '-r' }) + T(331 + i * 74, y + 36, rows ? '1×' : '—', { fs: 20, fw: 800, fill: rows ? mau : '#aaa', anchor: 'middle' });
    r += T(700, y + 38, '= ' + n + (n === 1 ? ' NOTICE' : ' NOTICEs'), { fs: 30, fw: 800, fill: mau, k: k + '-n' });
    return r;
  };
  s += T(200, 56, 'planner', { fs: 16, fill: '#777', fw: 700 }) + T(300, 56, 'row 1', { fs: 16, fill: '#777', fw: 700 }) + T(374, 56, 'row 2', { fs: 16, fill: '#777', fw: 700 }) + T(448, 56, 'row 3', { fs: 16, fill: '#777', fw: 700 }) + T(522, 56, 'row 4', { fs: 16, fill: '#777', fw: 700 }) + T(596, 56, 'row 5', { fs: 16, fill: '#777', fw: 700 });
  s += row(66, 'VOLATILE', DO, false, true, 'cp-v', 5);
  s += row(130, 'STABLE', CAM, true, true, 'cp-s', 6);
  s += row(194, 'IMMUTABLE', XANH, true, false, 'cp-i', 1);
  s += T(0, 286, 'IMMUTABLE: the planner calls it ONCE and folds the answer into a constant. STABLE: once to estimate, then per row.', { fs: 16, fill: '#555' });
  return s + '</svg>';
}

/** Chỉ mục nói dối: bảng users đổi email nhưng chỉ mục vẫn giữ giá trị cũ. */
export function lePic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'le');
  s += R(0, 8, 330, 150, { fill: '#fffaf5', st: CAM, k: 'le-users' }) + T(165, 38, 'table users', { fs: 20, fw: 800, fill: NAU, anchor: 'middle' });
  s += T(14, 72, 'id 1', { fs: 19, mono: true }) + T(80, 72, 'user1@example.com', { fs: 19, mono: true, fill: '#999', k: 'le-old' });
  s += L(80, 66, 232, 66, { st: DO, sw: 2.5 }) + T(80, 104, 'moi@example.com', { fs: 19, mono: true, fill: XANH, fw: 700, k: 'le-new' });
  s += T(14, 138, 'UPDATE users SET email = …', { fs: 16, fill: '#666', it: true });
  s += R(390, 8, 330, 150, { fill: '#eef4fa', st: PG, k: 'le-idx' }) + T(555, 38, 'index on email_cua(user_id)', { fs: 18, fw: 800, fill: PG, anchor: 'middle' });
  s += T(404, 76, "'user1@example.com'  → rows of user 1", { fs: 15, mono: true, fill: DO, k: 'le-frozen' }) + T(404, 104, 'built once — never re-computed', { fs: 17, it: true, fill: '#666' }) + T(404, 134, '(IMMUTABLE promised: no need)', { fs: 17, it: true, fill: '#666' });
  s += L(335, 80, 385, 80, { st: XAM, dash: '6 6' });
  s += R(780, 8, 330, 150, { fill: '#fdf0ee', st: DO, k: 'le-res' }) + T(945, 40, "WHERE email_cua(user_id)", { fs: 16, fw: 700, anchor: 'middle', mono: true }) + T(945, 62, "= 'moi@example.com'", { fs: 16, fw: 700, anchor: 'middle', mono: true });
  s += T(860, 108, 'index', { fs: 19, fill: '#555' }) + T(945, 108, '0 rows', { fs: 30, fw: 800, fill: DO, k: 'le-r0' });
  s += T(860, 146, 'scan', { fs: 19, fill: '#555' }) + T(945, 146, '25 rows', { fs: 30, fw: 800, fill: XANH, k: 'le-r25' });
  s += L(722, 80, 776, 80, { m: 'led', st: DO });
  s += T(0, 200, 'PostgreSQL never checks the promise. A lying IMMUTABLE function gives a wrong answer with no error —', { fs: 19, fw: 700, fill: '#444' });
  s += T(0, 228, 'and the index stays wrong until you REINDEX.', { fs: 19, fw: 700, fill: DO });
  s += T(0, 270, 'Rule of thumb: unsure ⇒ choose the LESS strict label (STABLE). Cost of caution = a little speed; cost of optimism = wrong data.', { fs: 17, fill: '#555' });
  return s + '</svg>';
}

/** Thanh đo thời gian ngang. items: [[nhãn, ms, màu, k]] */
export function thanhPic(items, { w = 1110, unit = 'ms', max, titleTxt = '' } = {}) {
  const M = max || Math.max(...items.map((i) => i[1]));
  const h = 60 + items.length * 62;
  let s = head(w, h, 'tp');
  if (titleTxt) s += T(0, 24, titleTxt, { fs: 20, fw: 800, fill: PG, k: 'tp-t' });
  items.forEach(([n, v, m, k], i) => {
    const y = 40 + i * 62, bw = Math.max(8, (w - 470) * v / M);
    s += T(0, y + 32, n, { fs: 19, fw: 700, fill: '#333', mono: true });
    s += R(300, y + 4, bw, 40, { fill: m + '22', st: m, rx: 6, k: k || `tp-b${i}` }) + T(300 + bw + 12, y + 34, `${v} ${unit}`, { fs: 24, fw: 800, fill: m });
  });
  return s + '</svg>';
}

/** SECURITY DEFINER: người gọi (không có quyền bảng) → hàm chạy với quyền CHỦ → bảng. */
export function definerPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'df');
  s += R(0, 40, 250, 120, { fill: '#eef4fa', st: PG, k: 'df-caller' }) + T(125, 78, 'ch12_reader', { fs: 22, fw: 800, fill: PG, anchor: 'middle', mono: true }) + T(125, 108, 'no right on', { fs: 17, anchor: 'middle', fill: '#555' }) + T(125, 132, 'table users', { fs: 17, anchor: 'middle', fill: '#555' });
  s += R(330, 20, 400, 160, { fill: '#fffaf5', st: CAM, sw: 3.5, k: 'df-fn' }) + T(530, 56, 'dem_user_an_toan()', { fs: 24, fw: 800, fill: NAU, anchor: 'middle', mono: true });
  s += T(530, 90, 'SECURITY DEFINER', { fs: 20, fw: 800, fill: DO, anchor: 'middle' }) + T(530, 120, 'runs with the OWNER’s rights', { fs: 18, anchor: 'middle', fill: '#444' }) + T(530, 150, 'SET search_path = ch12, pg_temp', { fs: 15, anchor: 'middle', mono: true, fill: XANH, k: 'df-sp' });
  s += R(810, 40, 300, 120, { fill: '#f1f9f4', st: XANH, k: 'df-tbl' }) + T(960, 84, 'table users', { fs: 22, fw: 800, fill: XANH, anchor: 'middle' }) + T(960, 118, '20 rows', { fs: 19, anchor: 'middle', fill: '#444' });
  s += L(256, 100, 326, 100, { m: 'df', sw: 4 }) + T(291, 90, 'CALL', { fs: 14, anchor: 'middle', fill: NAU, fw: 700 });
  s += L(736, 100, 806, 100, { m: 'dfx', st: XANH, sw: 4 });
  s += `<text x="125" y="196" font-size="30" text-anchor="middle">🚫</text>` + T(125, 224, 'SELECT * FROM users', { fs: 14, anchor: 'middle', mono: true, fill: DO }) + T(125, 244, '⇒ permission denied', { fs: 15, anchor: 'middle', fill: DO, fw: 700 });
  s += T(530, 232, 'A controlled doorway: the caller gets ONE answer (a count),', { fs: 17, anchor: 'middle', fill: '#444' }) + T(530, 256, 'never the table.', { fs: 17, anchor: 'middle', fill: '#444' });
  return s + '</svg>';
}

/** Bẫy search_path: danh sách tìm tên → schema của kẻ xấu đứng trước. */
export function spPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'sp');
  s += T(0, 24, 'Caller sets: SET search_path = ch12_xau, ch12;', { fs: 19, fw: 700, mono: true, fill: DO, k: 'sp-set' });
  s += R(0, 44, 360, 100, { fill: '#fdf0ee', st: DO, k: 'sp-bad' }) + T(180, 76, '1st: ch12_xau', { fs: 21, fw: 800, anchor: 'middle', mono: true, fill: DO }) + T(180, 106, 'users  = 3 fake rows', { fs: 18, anchor: 'middle', fill: '#7a2a1d' }) + T(180, 130, '(attacker made it)', { fs: 16, anchor: 'middle', fill: '#7a2a1d', it: true });
  s += R(0, 156, 360, 80, { fill: '#f1f9f4', st: XANH, dash: '8 5' }) + T(180, 188, '2nd: ch12', { fs: 21, fw: 800, anchor: 'middle', mono: true, fill: XANH }) + T(180, 216, 'users = 20 real rows', { fs: 18, anchor: 'middle', fill: '#1f6b40' });
  s += L(366, 94, 460, 94, { m: 'spd', st: DO, sw: 4 }) + T(413, 82, 'first match wins', { fs: 14, anchor: 'middle', fill: DO, fw: 700 });
  s += R(466, 44, 644, 100, { fill: '#fffaf5', st: CAM, sw: 3, k: 'sp-fn' }) + T(488, 80, 'dem_user_lo()  SECURITY DEFINER', { fs: 20, fw: 800, mono: true, fill: NAU }) + T(488, 108, 'SELECT count(*) FROM users   -- unqualified', { fs: 17, mono: true, fill: '#444' }) + T(488, 132, 'returns 3 — the attacker’s table, with owner rights', { fs: 17, fill: DO, fw: 700, k: 'sp-3' });
  s += R(466, 156, 644, 80, { fill: '#f1f9f4', st: XANH, sw: 3, k: 'sp-fix' }) + T(488, 190, 'SET search_path = ch12, pg_temp   (pinned on the function)', { fs: 17, mono: true, fill: XANH, fw: 700 }) + T(488, 220, 'returns 20 whatever the caller set', { fs: 17, fill: '#1f6b40', fw: 700 });
  s += T(0, 276, 'Rule: every SECURITY DEFINER function pins its own search_path and REVOKEs EXECUTE from PUBLIC.', { fs: 18, fw: 700, fill: '#444' });
  return s + '</svg>';
}

/* ═══════════ 12.2 — trigger ═══════════ */

/** Chuông cửa: sự kiện → chuông (trigger) → hàm chạy → bảng phụ đổi. */
export function chuongPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'cu');
  s += T(0, 24, 'A trigger is a doorbell: whoever pushes it, it rings', { fs: 21, fw: 800, fill: PG, k: 'cu-t' });
  s += R(0, 46, 250, 110, { fill: '#eef4fa', st: PG, k: 'cu-ev' }) + T(125, 84, '⚡ event', { fs: 20, fw: 800, fill: PG, anchor: 'middle' }) + T(125, 116, 'INSERT / UPDATE', { fs: 17, anchor: 'middle', mono: true }) + T(125, 140, '/ DELETE on notes', { fs: 17, anchor: 'middle', mono: true });
  s += L(256, 100, 330, 100, { m: 'cu', sw: 4 });
  s += `<text data-k="cu-bell" x="360" y="116" font-size="64">🔔</text>` + T(360, 142, 'trigger', { fs: 18, fw: 800, fill: NAU });
  s += L(446, 100, 520, 100, { m: 'cu', sw: 4 });
  s += R(526, 46, 270, 110, { fill: '#fffaf5', st: CAM, sw: 3.5, k: 'cu-fn' }) + T(661, 84, 'trigger function', { fs: 19, fw: 800, fill: NAU, anchor: 'middle' }) + T(661, 112, 'runs automatically', { fs: 17, anchor: 'middle', fill: '#555' }) + T(661, 138, 'RETURNS trigger', { fs: 17, anchor: 'middle', mono: true, fill: '#555' });
  s += L(802, 100, 876, 100, { m: 'cu', sw: 4 });
  s += R(882, 46, 228, 52, { fill: '#f1f9f4', st: XANH, k: 'cu-r1' }) + T(996, 79, 'updated_at = now()', { fs: 17, mono: true, anchor: 'middle', fill: XANH, fw: 700 });
  s += R(882, 104, 228, 52, { fill: '#f1f9f4', st: XANH, k: 'cu-r2' }) + T(996, 137, 'row in note_audit', { fs: 17, mono: true, anchor: 'middle', fill: XANH, fw: 700 });
  s += R(0, 196, 530, 90, { fill: '#fdf0ee', st: DO }) + T(14, 224, 'App-side: only code that REMEMBERS to do it', { fs: 18, fw: 800, fill: DO }) + T(14, 252, 'psql fix · migration script · admin tool · another service', { fs: 16, fill: '#7a2a1d' }) + T(14, 274, '⇒ they all forget', { fs: 17, fw: 700, fill: DO });
  s += R(580, 196, 530, 90, { fill: '#f1f9f4', st: XANH }) + T(594, 224, 'Trigger: sits BELOW every client', { fs: 18, fw: 800, fill: XANH }) + T(594, 252, 'one place, runs for all writers', { fs: 16, fill: '#1f6b40' }) + T(594, 274, '⇒ nobody can skip it', { fs: 17, fw: 700, fill: XANH });
  return s + '</svg>';
}

/** Giải phẫu CREATE TRIGGER: các mảnh màu + chú thích. */
export function giaiPhauPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'gp');
  const parts = [
    ['CREATE TRIGGER notes_audit', PG, 'name', 0], ['AFTER', XANH, 'WHEN to run', 1], ['UPDATE OR DELETE', CAM, 'which event(s)', 2], ['ON notes', PG, 'which table', 3],
    ['FOR EACH ROW', TIM, 'per row or per statement', 4], ['WHEN (…)', NAU, 'optional filter', 5], ['EXECUTE FUNCTION audit_notes();', DO, 'the function to run', 6]];
  const fs = 17; let x = 0, y = 54; const gap = 10;
  const rows = [[0, 1, 2], [3, 4, 5], [6]];
  rows.forEach((r, ri) => {
    x = 0;
    r.forEach((idx) => {
      const [t, m, cap] = parts[idx]; const wd = tw(t, fs) + 28;
      s += R(x, y + ri * 82, wd, 42, { fill: m + '14', st: m, rx: 9, k: `gp-${idx}` }) + T(x + wd / 2, y + ri * 82 + 28, t, { fs, fw: 800, fill: m, anchor: 'middle', mono: true });
      s += T(x + wd / 2, y + ri * 82 + 66, cap, { fs: 15, anchor: 'middle', fill: '#555', it: true });
      x += wd + gap;
    });
  });
  s += T(0, 24, 'Two objects: ① a function that RETURNS trigger   ② CREATE TRIGGER that attaches it', { fs: 19, fw: 800, fill: PG, k: 'gp-t' });
  s += R(640, 54, 470, 224, { fill: '#fffaf5', st: CAM, k: 'gp-fn' }) + T(654, 82, 'CREATE FUNCTION audit_notes()', { fs: 17, fw: 800, mono: true, fill: NAU }) + T(654, 108, 'RETURNS trigger …', { fs: 17, mono: true, fill: NAU, fw: 800 }) + T(654, 140, 'inside you may use:', { fs: 16, fill: '#555' }) + T(654, 166, 'NEW   OLD   TG_OP   TG_TABLE_NAME', { fs: 17, mono: true, fw: 700, fill: PG }) + T(654, 200, 'and must end with RETURN …', { fs: 16, fill: '#555' }) + T(654, 226, 'NEW · OLD · NULL', { fs: 18, mono: true, fw: 800, fill: DO }) + T(654, 258, '(next slides: what each means)', { fs: 15, it: true, fill: '#777' });
  return s + '</svg>';
}

/** NEW / OLD theo sự kiện. */
export function newOldPic({ w = 1110, h = 280 } = {}) {
  let s = head(w, h, 'no');
  const col = (x, ten, mau, newOk, oldOk, ghi, k) => {
    let r = R(x, 6, 350, 268, { fill: mau + '10', st: mau, sw: 3, k }) + T(x + 175, 44, ten, { fs: 27, fw: 800, fill: mau, anchor: 'middle', mono: true });
    r += R(x + 20, 66, 310, 56, { fill: newOk ? '#f1f9f4' : '#f4f4f4', st: newOk ? XANH : '#bbb', sw: newOk ? 3 : 1.5, rx: 10, dash: newOk ? '' : '6 5' }) + T(x + 175, 102, newOk ? 'NEW  = the row to be' : 'NEW  = NULL', { fs: 20, fw: 800, fill: newOk ? XANH : '#aaa', anchor: 'middle', mono: true });
    r += R(x + 20, 134, 310, 56, { fill: oldOk ? '#fdf0ee' : '#f4f4f4', st: oldOk ? DO : '#bbb', sw: oldOk ? 3 : 1.5, rx: 10, dash: oldOk ? '' : '6 5' }) + T(x + 175, 170, oldOk ? 'OLD  = the row that was' : 'OLD  = NULL', { fs: 20, fw: 800, fill: oldOk ? DO : '#aaa', anchor: 'middle', mono: true });
    r += T(x + 175, 232, ghi[0], { fs: 16, anchor: 'middle', fill: '#555' }) + T(x + 175, 254, ghi[1], { fs: 16, anchor: 'middle', fill: '#555' });
    return r;
  };
  s += col(0, 'INSERT', XANH, true, false, ['nothing existed before', 'RETURN NEW to keep it'], 'no-i');
  s += col(380, 'UPDATE', CAM, true, true, ['compare OLD.x with NEW.x', 'IS DISTINCT FROM …'], 'no-u');
  s += col(760, 'DELETE', DO, false, true, ['the row is going away', 'RETURN OLD in BEFORE'], 'no-d');
  return s + '</svg>';
}

/** Thứ tự bắn trigger với UPDATE 2 dòng. */
export function thuTuPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'tt');
  s += T(0, 22, 'UPDATE thu SET v = v + 1 WHERE id <= 2     (2 rows)', { fs: 19, fw: 800, mono: true, fill: PG, k: 'tt-t' });
  const step = (x, wd, lab, sub, m, k) => R(x, 44, wd, 108, { fill: m + '14', st: m, sw: 3, k }) + T(x + wd / 2, 80, lab, { fs: 20, fw: 800, fill: m, anchor: 'middle' }) + T(x + wd / 2, 108, sub, { fs: 16, anchor: 'middle', fill: '#555' });
  s += step(0, 190, '① BEFORE', 'STATEMENT · once', TIM, 'tt-1');
  s += step(210, 250, '② BEFORE ROW', 'row 1 · row 2', CAM, 'tt-2');
  s += step(480, 190, '(rows written)', 'both rows', XAM, 'tt-w');
  s += step(690, 230, '③ AFTER ROW', 'row 1 · row 2', XANH, 'tt-3');
  s += step(940, 170, '④ AFTER', 'STATEMENT · once', PG, 'tt-4');
  [[190, 210], [460, 480], [670, 690], [920, 940]].forEach(([a, b]) => { s += L(a + 2, 98, b - 4, 98, { m: 'tt', sw: 3 }); });
  s += T(0, 196, 'Surprise: the AFTER ROW triggers do NOT run right after each row.', { fs: 18, fw: 700, fill: '#444' });
  s += T(0, 224, 'They are queued and fire at the END of the statement — after every BEFORE ROW trigger and write.', { fs: 18, fw: 700, fill: NAU });
  return s + '</svg>';
}

/** Đệ quy: UPDATE → trigger → UPDATE … vòng tròn. */
export function dequyPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'dq');
  s += T(0, 20, 'A trigger that updates its OWN table …', { fs: 20, fw: 800, fill: DO, k: 'dq-t' });
  s += R(0, 76, 250, 70, { fill: '#eef4fa', st: PG }) + T(125, 118, 'UPDATE dem', { fs: 22, fw: 800, mono: true, fill: PG, anchor: 'middle' });
  s += L(256, 111, 330, 111, { m: 'dq', sw: 4 }) + R(336, 76, 260, 70, { fill: '#fffaf5', st: CAM, k: 'dq-fn' }) + T(466, 118, 'AFTER UPDATE ⇒', { fs: 20, fw: 800, anchor: 'middle', fill: NAU });
  s += L(602, 111, 676, 111, { m: 'dq', sw: 4 }) + R(682, 76, 270, 70, { fill: '#fdf0ee', st: DO }) + T(817, 118, 'UPDATE dem again', { fs: 20, fw: 800, anchor: 'middle', fill: DO, mono: true });
  s += `<path d="M817 76 C817 36 125 36 125 70" fill="none" stroke="${DO}" stroke-width="3.5" stroke-dasharray="9 6" marker-end="url(#dqd)"/>`;
  s += T(560, 30, '… fires the trigger again … and again …', { fs: 16, anchor: 'middle', fill: DO, fw: 700 });
  s += R(0, 170, 530, 100, { fill: '#fdf0ee', st: DO, k: 'dq-err' }) + T(14, 202, 'ERROR: stack depth limit exceeded', { fs: 20, fw: 800, fill: DO, mono: true }) + T(14, 232, 'PostgreSQL recurses until the stack runs out', { fs: 17, fill: '#7a2a1d' }) + T(14, 254, '— and the statement fails, nothing is saved', { fs: 17, fill: '#7a2a1d' });
  s += R(580, 170, 530, 100, { fill: '#f1f9f4', st: XANH, k: 'dq-fix' }) + T(594, 202, 'Fix: BEFORE trigger + assign to NEW', { fs: 19, fw: 800, fill: XANH }) + T(594, 232, 'NEW.n := NEW.n + 1;  RETURN NEW;', { fs: 17, mono: true, fill: '#1f6b40', fw: 700 }) + T(594, 256, 'an assignment fires nothing again', { fs: 17, fill: '#1f6b40' });
  return s + '</svg>';
}

/** Trừ kho trong cùng giao dịch: đơn 100 thành công, đơn 101 hỏng ⇒ mọi thứ lùi. */
export function khoPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'kp');
  s += R(0, 8, 520, 130, { fill: '#f1f9f4', st: XANH, sw: 3, k: 'kp-ok' }) + T(14, 38, 'Order 100: INSERT order_item (4 × A5, 2 × pen)', { fs: 17, fw: 800, fill: XANH });
  s += T(14, 66, '⚡ trigger per row ⇒ stock −4, −2', { fs: 17, mono: true, fill: '#333' }) + T(14, 92, '+ 2 rows in stock_movement', { fs: 17, mono: true, fill: '#333' }) + T(14, 122, 'COMMIT ⇒ stock A5 = 6, pen = 1', { fs: 18, fw: 800, fill: XANH });
  s += R(590, 8, 520, 130, { fill: '#fdf0ee', st: DO, sw: 3, k: 'kp-bad' }) + T(604, 38, 'Order 101: INSERT … (3 × A5, 5 × pen)', { fs: 17, fw: 800, fill: DO });
  s += T(604, 66, 'row 1: stock A5 6 → 3 ✓', { fs: 17, mono: true, fill: '#333' }) + T(604, 92, 'row 2: pen 1 → −4 ✗ CHECK stock >= 0', { fs: 17, mono: true, fill: DO, fw: 700 }) + T(604, 122, 'ERROR ⇒ the WHOLE INSERT undone', { fs: 18, fw: 800, fill: DO });
  s += T(0, 178, 'The trigger runs INSIDE the statement’s transaction:', { fs: 19, fw: 800, fill: '#444' });
  s += R(0, 196, 340, 80, { fill: '#fff', st: PG, k: 'kp-s' }) + T(170, 228, 'stock', { fs: 18, fw: 800, fill: PG, anchor: 'middle' }) + T(170, 256, 'A5 = 6 · pen = 1', { fs: 18, mono: true, anchor: 'middle' });
  s += R(385, 196, 340, 80, { fill: '#fff', st: PG, k: 'kp-m' }) + T(555, 228, 'stock_movement', { fs: 18, fw: 800, fill: PG, anchor: 'middle' }) + T(555, 256, '2 rows (order 100 only)', { fs: 18, mono: true, anchor: 'middle' });
  s += R(770, 196, 340, 80, { fill: '#fff', st: PG, k: 'kp-o' }) + T(940, 228, 'order_item of 101', { fs: 18, fw: 800, fill: PG, anchor: 'middle' }) + T(940, 256, '0 rows', { fs: 18, mono: true, anchor: 'middle' });
  return s + '</svg>';
}

/* ═══════════ 12.3 — view ═══════════ */

/** View = cửa sổ nhìn vào bảng: bảng thật phía sau, khung kính chỉ lộ vài dòng/cột. */
export function cuaSoPic({ w = 1110, h = 320 } = {}) {
  let s = head(w, h, 'cs');
  s += T(0, 24, 'A view is a window: it shows part of a table — it holds nothing itself', { fs: 21, fw: 800, fill: PG, k: 'cs-t' });
  // bảng thật
  s += R(0, 44, 560, 262, { fill: '#fffaf5', st: CAM, sw: 3, k: 'cs-tbl' }) + T(14, 72, 'table notes  (500 rows, all columns)', { fs: 18, fw: 800, fill: NAU });
  const cols = ['id', 'user_id', 'title', 'body', 'views'], cx = [14, 70, 150, 270, 440];
  cols.forEach((c, i) => { s += T(cx[i], 104, c, { fs: 16, fw: 800, fill: '#666', mono: true }); });
  const rows = [[1, 2, 'Note 1', 'Body of…', 37], [2, 3, 'Note 2', 'Body of…', 74], [3, 1, 'Note 3', 'Body of…', 10], [4, 1, 'Note 4', 'Body of…', 47], [5, 6, 'Note 5', 'Body of…', 84], [6, 1, 'Note 6', 'Body of…', 21]];
  rows.forEach((r, k) => r.forEach((v, i) => { s += T(cx[i], 134 + k * 28, String(v), { fs: 16, mono: true, fill: r[1] === 1 ? '#222' : '#aaa' }); }));
  // khung kính
  s += `<rect data-k="cs-glass" x="52" y="170" width="480" height="140" rx="14" fill="${PG}" fill-opacity="0.10" stroke="${PG}" stroke-width="4"/>`;
  s += T(62, 303, '🪟 view note_cua_user1  —  WHERE user_id = 1', { fs: 15, fw: 800, fill: PG });
  // kết quả bên phải
  s += L(570, 200, 650, 200, { m: 'csb', st: PG, sw: 4 });
  s += R(660, 44, 450, 262, { fill: '#eef4fa', st: PG, sw: 3, k: 'cs-out' }) + T(676, 72, 'what the user of the view sees', { fs: 18, fw: 800, fill: PG });
  ['id', 'user_id', 'title', 'views'].forEach((c, i) => { s += T(676 + i * 104, 104, c, { fs: 16, fw: 800, fill: '#666', mono: true }); });
  [[3, 1, 'Note 3', 10], [4, 1, 'Note 4', 47], [6, 1, 'Note 6', 21]].forEach((r, k) => r.forEach((v, i) => { s += T(676 + i * 104, 134 + k * 28, String(v), { fs: 16, mono: true }); }));
  s += T(676, 250, 'only user_id = 1 · no body column', { fs: 16, it: true, fill: '#555' }) + T(676, 276, 'the rest of the table is invisible', { fs: 16, it: true, fill: '#555' });
  return s + '</svg>';
}

/** Planner mở view ra: truy vấn + thân view ⇒ một plan duy nhất. */
export function moViewPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'mv');
  s += R(0, 8, 520, 70, { fill: '#eef4fa', st: PG, k: 'mv-q' }) + T(14, 36, 'SELECT title FROM note_cua_user1', { fs: 18, mono: true, fw: 700 }) + T(14, 62, 'WHERE views > 90;', { fs: 18, mono: true, fw: 700 });
  s += R(0, 98, 520, 70, { fill: '#fffaf5', st: CAM, k: 'mv-v' }) + T(14, 126, 'view body: SELECT … FROM notes', { fs: 18, mono: true, fill: NAU, fw: 700 }) + T(14, 152, 'WHERE user_id = 1', { fs: 18, mono: true, fill: NAU, fw: 700 });
  s += L(262, 80, 262, 96, { st: NAU, sw: 3 });
  s += L(530, 88, 590, 88, { m: 'mv', sw: 4 }) + T(560, 76, 'merged', { fs: 15, anchor: 'middle', fill: NAU, fw: 700 });
  s += R(600, 8, 510, 160, { fill: '#f1f9f4', st: XANH, sw: 3, k: 'mv-p' }) + T(616, 40, 'ONE plan — no “view” node:', { fs: 19, fw: 800, fill: XANH }) + T(616, 76, 'Seq Scan on notes', { fs: 20, mono: true, fw: 800, fill: '#222' }) + T(616, 108, 'Filter: ((views > 90) AND', { fs: 18, mono: true, fill: '#333' }) + T(616, 134, '         (user_id = 1))', { fs: 18, mono: true, fill: '#333' });
  s += T(0, 208, 'The view is a macro: PostgreSQL pastes its definition into your query, then plans the whole thing.', { fs: 19, fw: 700, fill: '#444' });
  s += T(0, 238, 'Same plan as writing the query by hand — so a view costs nothing extra to read.', { fs: 19, fw: 700, fill: XANH });
  return s + '</svg>';
}

/** Quyền: chủ sở hữu view vs người gọi. */
export function quyenViewPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'qv');
  s += R(0, 40, 230, 110, { fill: '#eef4fa', st: PG, k: 'qv-r' }) + T(115, 78, 'ch12_reader', { fs: 21, fw: 800, mono: true, fill: PG, anchor: 'middle' }) + T(115, 108, 'SELECT only on', { fs: 16, anchor: 'middle', fill: '#555' }) + T(115, 130, 'the view', { fs: 16, anchor: 'middle', fill: '#555' });
  s += L(236, 95, 326, 95, { m: 'qv', sw: 4 });
  s += R(332, 24, 330, 142, { fill: '#fffaf5', st: CAM, sw: 3.5, k: 'qv-v' }) + T(497, 58, 'view users_public', { fs: 21, fw: 800, mono: true, fill: NAU, anchor: 'middle' }) + T(497, 90, 'SELECT id, email', { fs: 18, mono: true, anchor: 'middle', fill: '#333' }) + T(497, 114, 'FROM users', { fs: 18, mono: true, anchor: 'middle', fill: '#333' }) + T(497, 146, 'runs with the OWNER’s rights', { fs: 16, anchor: 'middle', fill: DO, fw: 700, k: 'qv-own' });
  s += L(668, 95, 758, 95, { m: 'qvx', st: XANH, sw: 4 });
  s += R(764, 24, 346, 142, { fill: '#f1f9f4', st: XANH, sw: 3, k: 'qv-t' }) + T(937, 58, 'table users', { fs: 21, fw: 800, anchor: 'middle', fill: XANH }) + T(790, 92, 'id  email', { fs: 17, mono: true, fill: '#333' }) + T(790, 118, 'password_hash', { fs: 17, mono: true, fill: '#c0392b', fw: 800 }) + T(790, 146, '↑ never exposed', { fs: 15, it: true, fill: DO });
  s += T(0, 206, 'Give the role SELECT on the view and nothing on the table:', { fs: 19, fw: 800, fill: '#444' });
  s += T(0, 236, '• it sees the rows and columns the view offers — no more', { fs: 18, fill: '#333' }) + T(0, 262, '• security_invoker = true flips it: the view uses the CALLER’s rights (PostgreSQL 15+)', { fs: 18, fill: '#333' });
  return s + '</svg>';
}

/** Rò rỉ qua hàm: không barrier ⇒ hàm thấy cả dòng ẩn. */
export function barrierPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'bp');
  const rows = [['1', 'me', 'tien an', true], ['2', 'sep', 'luong 5000', false], ['3', 'me', 'tien tro', true], ['4', 'sep', 'danh sach cat giam', false]];
  const col = (x, ten, mau, thay, k) => {
    let r = R(x, 8, 540, 284, { fill: mau + '0d', st: mau, sw: 3, k }) + T(x + 14, 38, ten, { fs: 20, fw: 800, fill: mau });
    r += T(x + 14, 66, 'view: WHERE chu = \'me\'      query: WHERE ro_ri(ghi_chu)', { fs: 14, mono: true, fill: '#555' });
    rows.forEach((rw, i) => {
      const y = 90 + i * 46, ok = rw[3], seen = thay[i];
      r += R(x + 14, y, 512, 38, { fill: ok ? '#fff' : '#fdf0ee', st: ok ? '#bbb' : DO, sw: ok ? 1.5 : 2.5, rx: 8 });
      r += T(x + 26, y + 26, `${rw[0]}  ${rw[1].padEnd(4)} ${rw[2]}`, { fs: 17, mono: true, fill: ok ? '#222' : '#7a2a1d' });
      r += T(x + 506, y + 26, seen ? '👁 function saw it' : '—', { fs: 15, anchor: 'end', fill: seen ? (ok ? XANH : DO) : '#bbb', fw: 800 });
    });
    r += T(x + 14, 282, thay.filter(Boolean).length + ' NOTICE lines', { fs: 18, fw: 800, fill: mau });
    return r;
  };
  s += col(0, 'No barrier — the leak', DO, [true, true, true, true], 'bp-l');
  s += col(570, 'security_barrier = true', XANH, [true, false, true, false], 'bp-r');
  return s + '</svg>';
}

/* ═══════════ 12.4 — materialized view ═══════════ */

/** Máy ảnh: bảng sống thay đổi, ảnh chụp giữ nguyên cho tới lần chụp sau. */
export function mayAnhPic({ w = 1110, h = 320 } = {}) {
  let s = head(w, h, 'ma');
  s += T(0, 24, 'A materialized view is a photograph of a query’s answer', { fs: 21, fw: 800, fill: PG, k: 'ma-t' });
  s += R(0, 44, 330, 190, { fill: '#fffaf5', st: CAM, sw: 3, k: 'ma-live' }) + T(14, 74, 'live tables', { fs: 19, fw: 800, fill: NAU }) + T(14, 108, 'user 1  ·  26 notes', { fs: 18, mono: true }) + T(14, 138, 'views  3433', { fs: 24, mono: true, fw: 800, fill: XANH }) + T(14, 172, 'changes with every write', { fs: 17, it: true, fill: '#666' }) + T(14, 204, '(this is what a VIEW shows)', { fs: 16, fill: '#888' });
  s += `<text data-k="ma-cam" x="395" y="150" font-size="72">📸</text>` + T(425, 188, 'REFRESH', { fs: 18, fw: 800, fill: NAU, anchor: 'middle', mono: true });
  s += L(340, 120, 385, 120, { m: 'ma', sw: 4 }) + L(470, 120, 560, 120, { m: 'ma', sw: 4 });
  s += R(566, 44, 330, 190, { fill: '#eef4fa', st: PG, sw: 3, k: 'ma-photo' }) + T(580, 74, 'the photo (stored rows)', { fs: 19, fw: 800, fill: PG }) + T(580, 108, 'user 1  ·  25 notes', { fs: 18, mono: true, fill: '#555' }) + T(580, 138, 'views  1433', { fs: 24, mono: true, fw: 800, fill: DO }) + T(580, 172, 'taken before the INSERT', { fs: 17, it: true, fill: '#666' }) + T(580, 204, 'fast to read — and OLD', { fs: 16, fill: DO, fw: 700 });
  s += R(930, 44, 180, 190, { fill: '#fdf0ee', st: DO, k: 'ma-age' }) + T(1020, 80, '⏳ age', { fs: 20, fw: 800, fill: DO, anchor: 'middle' }) + T(1020, 120, 'grows until', { fs: 17, anchor: 'middle', fill: '#7a2a1d' }) + T(1020, 144, 'someone runs', { fs: 17, anchor: 'middle', fill: '#7a2a1d' }) + T(1020, 172, 'REFRESH', { fs: 19, anchor: 'middle', mono: true, fw: 800, fill: DO });
  s += T(0, 276, 'View = look through the window now.   Materialized view = look at yesterday’s photo — instantly.', { fs: 19, fw: 700, fill: '#444' });
  s += T(0, 304, 'The trade: speed for freshness. You decide how old is acceptable, and WHEN to take the next photo.', { fs: 18, fill: '#555' });
  return s + '</svg>';
}

/** Hai kiểu REFRESH: khoá và người đọc. */
export function khoaPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'kh');
  const col = (x, ten, mau, lock, ghi, k, rd) => {
    let r = R(x, 8, 540, 284, { fill: mau + '0d', st: mau, sw: 3, k }) + T(x + 14, 40, ten, { fs: 19, fw: 800, fill: mau, mono: true });
    r += R(x + 14, 58, 512, 54, { fill: '#fff', st: mau, rx: 10 }) + T(x + 28, 92, 'lock: ' + lock, { fs: 20, fw: 800, mono: true, fill: mau });
    r += T(x + 14, 142, 'a reader (SELECT) arrives…', { fs: 18, fw: 700, fill: '#444' });
    r += R(x + 14, 158, 512, 56, { fill: rd ? '#fdf0ee' : '#f1f9f4', st: rd ? DO : XANH, rx: 10, k: k + '-r' }) + T(x + 28, 194, rd ? '⏳ waits until the refresh ends' : '✓ reads the old photo, no waiting', { fs: 19, fw: 800, fill: rd ? DO : XANH });
    r += T(x + 14, 242, ghi[0], { fs: 16, fill: '#555' }) + T(x + 14, 266, ghi[1], { fs: 16, fill: '#555' });
    return r;
  };
  s += col(0, 'REFRESH MATERIALIZED VIEW mv', DO, 'AccessExclusiveLock', ['blocks EVERYTHING, even SELECT', 'a refresh at peak hour = an outage'], 'kh-a', true);
  s += col(570, 'REFRESH … CONCURRENTLY mv', XANH, 'ExclusiveLock', ['blocks only writers of the MV (nobody writes it)', 'readers keep reading; needs a UNIQUE index'], 'kh-b', false);
  return s + '</svg>';
}

/** Dòng thời gian độ tươi: các lần REFRESH và độ cũ tăng dần. */
export function tuoiPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'tu');
  s += T(0, 22, 'How stale is the number on the dashboard?', { fs: 20, fw: 800, fill: PG, k: 'tu-t' });
  s += L(0, 120, 1090, 120, { st: '#999', sw: 3, m: 'tu' });
  const ticks = [[40, 'REFRESH'], [380, 'REFRESH'], [720, 'REFRESH']];
  ticks.forEach(([x, t]) => { s += L(x, 96, x, 144, { st: XANH, sw: 4 }) + T(x, 84, '📸', { fs: 26, anchor: 'middle' }) + T(x, 168, t, { fs: 15, anchor: 'middle', mono: true, fill: XANH, fw: 800 }); });
  // thanh độ cũ
  [[40, 380], [380, 720]].forEach(([a, b], i) => { s += R(a + 6, 188, b - a - 12, 24, { fill: CAM + '33', st: CAM, rx: 6, sw: 2, k: 'tu-age' + i }); s += `<path d="M${a + 6} 212 L${b - 6} 188" stroke="${DO}" stroke-width="3" fill="none"/>`; });
  s += T(210, 232, 'age grows …', { fs: 16, anchor: 'middle', fill: '#7a5a1d', it: true }) + T(550, 232, '… then resets', { fs: 16, anchor: 'middle', fill: '#7a5a1d', it: true });
  s += R(760, 188, 330, 70, { fill: '#fdf0ee', st: DO, k: 'tu-never' }) + T(775, 216, 'Never scheduled?', { fs: 19, fw: 800, fill: DO }) + T(775, 244, 'the age grows for MONTHS', { fs: 17, fill: '#7a2a1d', fw: 700 });
  s += T(740, 120, '…', { fs: 40, fill: '#bbb' });
  return s + '</svg>';
}
