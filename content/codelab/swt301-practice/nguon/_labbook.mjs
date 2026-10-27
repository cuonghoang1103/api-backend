/**
 * LabBook — HỆ THỐNG ĐƯỢC KIỂM THỬ xuyên suốt bộ luyện SWT301 (dự án chạy qua các chương + Lab 3/Lab 4).
 * ═════════════════════════════════════════════════════════════════════════════════════════════
 * Hệ thống đặt phòng lab giống LabFlow Demo của nhóm (API kiểu REST, chạy trong bộ nhớ, đồng hồ cố định):
 *   POST /api/auth/login · GET /api/labs · POST /api/bookings · GET /api/bookings/me · DELETE /api/bookings/:code
 *   PATCH /api/labs/:code (MANAGER) · POST /api/admin/users/:email/lock|unlock (ADMIN)
 *   + "test hook" của môi trường test: GET /test/db/bookings (nhìn thẳng CSDL) · GET /test/outbox (thư đã gửi)
 * taoLabBook(M): M = null ⇒ bản đúng; M = 'I1'…'I9' lỗi TÍCH HỢP (Lab 3) · 'S1'…'S8' lỗi HỆ THỐNG (Lab 4).
 * Hàm viết thật trong tệp này (chạy/kiểm được bằng Node) rồi nhúng vào bộ kiểm bằng .toString().
 *
 * Kịch bản người học (Report 5.2 / 5.3 dạng chạy được):
 *   { id, description, precondition, steps: [{ as:'student1', call:'POST /api/bookings', body:{…}, expect:{ status:201, body:{ status:'CONFIRMED' } } }] }
 *   - as: student1 | student2 | student3 | manager | admin | guest (máy chấm tự đăng nhập bằng tài khoản mẫu)
 *   - expect so KHỚP MỘT PHẦN: mọi khoá có trong expect phải bằng giá trị thật (mảng: so theo chỉ số / length)
 *   - mỗi ca chạy trên một hệ thống MỚI (dữ liệu mẫu, đồng hồ 2026-11-02 08:00) ⇒ mã booking đầu tiên là BK0001.
 */

import { gon } from './_chung.mjs';

export function taoLabBook(M) {
  const TODAY_MS = Date.UTC(2026, 10, 2);
  const NOW_HOUR = 8;
  const WINDOW = 14;
  const ngay = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s == null ? '' : s));
    if (!m) return null;
    const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    if (new Date(t).getUTCMonth() !== +m[2] - 1) return null;
    return Math.round((t - TODAY_MS) / 86400000);
  };
  const db = {
    users: [
      { email: 'an@fpt.edu.vn', password: 'An@12345', role: 'STUDENT', locked: false, fails: 0 },
      { email: 'binh@fpt.edu.vn', password: 'Binh@123', role: 'STUDENT', locked: false, fails: 0 },
      { email: 'chi@fpt.edu.vn', password: 'Chi@1234', role: 'STUDENT', locked: false, fails: 0 },
      { email: 'manager@fpt.edu.vn', password: 'Mgr@1234', role: 'MANAGER', locked: false, fails: 0 },
      { email: 'admin@fpt.edu.vn', password: 'Adm@1234', role: 'ADMIN', locked: false, fails: 0 },
    ],
    labs: [
      { code: 'LAB01', name: 'Software Lab', seats: 2, status: 'OPEN' },
      { code: 'LAB02', name: 'Network Lab', seats: 1, status: 'OPEN' },
      { code: 'LAB03', name: 'IoT Lab', seats: 3, status: 'CLOSED' },
    ],
    bookings: [],
    outbox: [],
    audit: [],
  };
  const tokens = {};
  let soTok = 0, soBk = 0;
  const loi = (status, error, extra) => ({ status, body: Object.assign({ error }, extra || {}) });
  const ok = (status, body) => ({ status, body });
  const copy = (b) => ({ code: b.code, email: b.email, labCode: b.labCode, date: b.date, startHour: b.startHour, duration: b.duration, status: b.status });
  const thu = (to, subject, ref) => { db.outbox.push({ to, subject, ref }); };
  const nguoi = (tok) => {
    const e = tok && tokens[tok];
    const u = e && db.users.find((x) => x.email === e);
    if (!u) return null;
    if (u.locked && M !== 'S1') return null;
    return u;
  };

  function login(b) {
    const u = db.users.find((x) => x.email === String(b.email || '').trim().toLowerCase());
    if (!u) return loi(401, 'AUTH_INVALID');
    if (u.locked) return loi(423, 'ACCOUNT_LOCKED');
    if (u.password !== b.password) {
      u.fails++;
      if (u.fails >= 3) { u.locked = true; db.audit.push('LOCK ' + u.email); }
      return loi(401, 'AUTH_INVALID');
    }
    if (M !== 'I9') u.fails = 0;
    const tok = 'tok-' + (++soTok);
    tokens[tok] = u.email;
    return ok(200, { token: tok, role: u.role });
  }
  function coCho(lab, date, start, dur) {
    for (let h = start; h < start + dur; h++) {
      const n = db.bookings.filter((x) => x.labCode === lab.code && x.date === date
        && (x.status === 'CONFIRMED' || (M === 'S2' && x.status === 'PENDING'))
        && x.startHour <= h && h < x.startHour + x.duration).length;
      if (n >= lab.seats) return false;
    }
    return true;
  }
  function datCho(u, b) {
    if (!b.labCode) return loi(400, 'VALIDATION', { field: 'labCode' });
    const d = ngay(b.date);
    if (d === null) return loi(400, 'VALIDATION', { field: 'date' });
    if (!Number.isInteger(b.startHour) || b.startHour < 7 || b.startHour > 20) return loi(400, 'VALIDATION', { field: 'startHour' });
    if (!Number.isInteger(b.duration) || b.duration < 1 || b.duration > 3) return loi(400, 'VALIDATION', { field: 'duration' });
    const lab = db.labs.find((l) => l.code === b.labCode);
    if (!lab) return loi(404, 'LAB_NOT_FOUND');
    if (lab.status !== 'OPEN' && M !== 'S4') return loi(409, 'LAB_CLOSED');
    if (d < 0 || d > (M === 'S6' ? WINDOW + 1 : WINDOW)) return loi(422, 'OUT_OF_WINDOW');
    if (d === 0 && b.startHour < NOW_HOUR + 1) return loi(422, 'TOO_SOON');
    if (b.startHour + b.duration > 21) return loi(422, 'AFTER_CLOSING');
    const chong = (x) => x.date === b.date && x.startHour < b.startHour + b.duration && b.startHour < x.startHour + x.duration;
    if (db.bookings.some((x) => x.email === u.email && x.status !== 'CANCELLED' && chong(x) && (M !== 'I8' || x.labCode === b.labCode))) return loi(409, 'OVERLAP');
    const tuan = Math.floor(d / 7);
    const daDat = db.bookings.filter((x) => x.email === u.email && (x.status !== 'CANCELLED' || M === 'S3') && Math.floor(ngay(x.date) / 7) === tuan)
      .reduce((s, x) => s + x.duration, 0);
    if (daDat + b.duration > 6) return M === 'I1' ? loi(500, 'INTERNAL_ERROR') : loi(422, 'WEEKLY_LIMIT');
    const conCho = coCho(lab, b.date, b.startHour, b.duration);
    const bk = { code: 'BK' + String(++soBk).padStart(4, '0'), so: soBk, email: u.email, labCode: lab.code, date: b.date, startHour: b.startHour, duration: b.duration, status: conCho ? 'CONFIRMED' : 'PENDING' };
    if (M !== 'I2') db.bookings.push(bk);
    thu(u.email, conCho ? 'Booking confirmed' : 'Added to waitlist', bk.code);
    return ok(201, copy(bk));
  }
  function thangHang(bk) {
    const lab = db.labs.find((l) => l.code === bk.labCode);
    const cho = db.bookings.filter((x) => x.status === 'PENDING' && x.labCode === bk.labCode && x.date === bk.date)
      .sort((a, b) => (M === 'S7' ? b.so - a.so : a.so - b.so));
    for (const p of cho) {
      if (coCho(lab, p.date, p.startHour, p.duration)) {
        p.status = 'CONFIRMED';
        db.audit.push('PROMOTE ' + p.code);
        if (M !== 'I4') thu(p.email, 'Booking confirmed', p.code);
      }
    }
  }
  function huy(u, code) {
    const bk = db.bookings.find((x) => x.code === code);
    if (!bk) return loi(404, 'BOOKING_NOT_FOUND');
    if (bk.email !== u.email) return loi(403, 'NOT_OWNER');
    if (bk.status === 'CANCELLED') return loi(409, 'ALREADY_CANCELLED');
    if (M !== 'S5' && ngay(bk.date) === 0 && bk.startHour - NOW_HOUR < 2) return loi(409, 'TOO_LATE');
    if (M === 'I6') return ok(200, Object.assign(copy(bk), { status: 'CANCELLED' }));
    const truoc = bk.status;
    bk.status = 'CANCELLED';
    if (truoc === 'CONFIRMED') thangHang(bk);
    return ok(200, copy(bk));
  }
  function doiLab(code, b) {
    const lab = db.labs.find((l) => l.code === code);
    if (!lab) return loi(404, 'LAB_NOT_FOUND');
    if (b.status !== 'OPEN' && b.status !== 'CLOSED') return loi(400, 'VALIDATION', { field: 'status' });
    lab.status = M === 'S8' && b.status === 'OPEN' ? 'Open' : b.status;
    let n = 0;
    if (b.status === 'CLOSED') {
      for (const x of db.bookings) {
        if (x.labCode === code && ngay(x.date) >= 0 && (x.status === 'CONFIRMED' || (x.status === 'PENDING' && M !== 'I5'))) {
          x.status = 'CANCELLED'; n++;
          db.audit.push('CASCADE ' + x.code);
          thu(x.email, 'Lab closed - booking cancelled', x.code);
        }
      }
    }
    return ok(200, { code: lab.code, status: b.status, cancelled: n });
  }
  function handle(method, path, opts) {
    opts = opts || {};
    const body = opts.body && typeof opts.body === 'object' ? opts.body : {};
    if (method === 'POST' && path === '/api/auth/login') return login(body);
    if (method === 'GET' && path === '/api/labs') return ok(200, db.labs.map((l) => ({ code: l.code, name: l.name, seats: l.seats, status: l.status === 'Open' ? 'OPEN' : l.status })));
    if (method === 'GET' && path === '/test/db/bookings') return ok(200, db.bookings.map(copy));
    if (method === 'GET' && path === '/test/outbox') return ok(200, db.outbox.map((x) => Object.assign({}, x)));
    const u = nguoi(opts.token);
    if (!u) return loi(401, 'UNAUTHENTICATED');
    if (method === 'POST' && path === '/api/bookings') return u.role === 'STUDENT' ? datCho(u, body) : loi(403, 'FORBIDDEN');
    if (method === 'GET' && path === '/api/bookings/me') return ok(200, db.bookings.filter((x) => M === 'I7' || x.email === u.email).map(copy));
    let m = /^\/api\/bookings\/([A-Za-z0-9-]+)$/.exec(path);
    if (method === 'DELETE' && m) return huy(u, m[1]);
    m = /^\/api\/labs\/([A-Za-z0-9]+)$/.exec(path);
    if (method === 'PATCH' && m) return u.role === 'MANAGER' || M === 'I3' ? doiLab(m[1], body) : loi(403, 'FORBIDDEN');
    m = /^\/api\/admin\/users\/([^/]+)\/(lock|unlock)$/.exec(path);
    if (method === 'POST' && m) {
      if (u.role !== 'ADMIN') return loi(403, 'FORBIDDEN');
      const t = db.users.find((x) => x.email === decodeURIComponent(m[1]).toLowerCase());
      if (!t) return loi(404, 'USER_NOT_FOUND');
      if (m[2] === 'lock') { t.locked = true; db.audit.push('LOCK ' + t.email); } else { t.locked = false; t.fails = 0; }
      return ok(200, { email: t.email, locked: t.locked });
    }
    return loi(404, 'NOT_FOUND');
  }
  return { handle, db };
}

/** Chạy MỘT kịch bản trên một hệ thống mới. Trả { pass, loi, tags }. */
export function chayKichBan(tao, ca, M) {
  const app = tao(M);
  const TK = {
    student1: ['an@fpt.edu.vn', 'An@12345'], student2: ['binh@fpt.edu.vn', 'Binh@123'], student3: ['chi@fpt.edu.vn', 'Chi@1234'],
    manager: ['manager@fpt.edu.vn', 'Mgr@1234'], admin: ['admin@fpt.edu.vn', 'Adm@1234'],
  };
  const tok = {};
  const layTok = (as) => {
    if (!as || as === 'guest') return undefined;
    if (!TK[as]) throw new Error('unknown actor "' + as + '" — use student1, student2, student3, manager, admin or guest');
    if (!(as in tok)) { const r = app.handle('POST', '/api/auth/login', { body: { email: TK[as][0], password: TK[as][1] } }); tok[as] = r.body && r.body.token; }
    return tok[as];
  };
  const khop = (mong, thuc) => {
    if (mong === null || typeof mong !== 'object') return mong === thuc;
    if (thuc === null || typeof thuc !== 'object') return false;
    return Object.keys(mong).every((k) => khop(mong[k], thuc[k]));
  };
  const mau = (p) => p.replace(/^(\/api\/bookings\/)(?!me$)[^/]+$/, '$1:code').replace(/^(\/api\/labs\/)[^/]+$/, '$1:lab').replace(/^(\/api\/admin\/users\/)[^/]+/, '$1:email');
  const tags = [];
  const suKien = [];
  const chuyen = [];
  let loi = null, coKiem = 0;
  const steps = Array.isArray(ca.steps) ? ca.steps : [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i] || {};
    const mm = /^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)$/.exec(String(s.call || '').trim());
    if (!mm) { loi = 'step ' + (i + 1) + ': call must look like "POST /api/bookings"'; break; }
    const truocAudit = app.db.audit.length;
    const truocTT = {}; app.db.bookings.forEach((x) => { truocTT[x.code] = x.status; });
    let r;
    try { r = app.handle(mm[1], mm[2], { token: layTok(s.as), body: s.body }); } catch (e) { loi = 'step ' + (i + 1) + ': ' + e.message; break; }
    app.db.audit.slice(truocAudit).forEach((a) => suKien.push({ buoc: i, ten: 'EVENT ' + a.split(' ')[0] }));
    // chuyển trạng thái của booking do bước này gây ra (NONE = vừa tạo) — tính khi bước này hoặc bước sau có expect
    app.db.bookings.forEach((x) => { const cu = truocTT[x.code] || 'NONE'; if (cu !== x.status) chuyen.push({ buoc: i, ten: 'TRANS ' + cu + '->' + x.status }); });
    if (s.expect !== undefined) {
      coKiem++;
      const tag = mm[1] + ' ' + mau(mm[2]) + ' ' + r.status + (r.body && r.body.error ? ' ' + r.body.error : (r.body && r.body.status && !Array.isArray(r.body) ? ' ' + r.body.status : ''));
      if (!khop(s.expect, r)) { loi = 'step ' + (i + 1) + ' (' + s.call + '): expected ' + JSON.stringify(s.expect) + ' — got ' + JSON.stringify(r).slice(0, 220); break; }
      tags.push(tag);
      if (mm[1] === 'POST' && mm[2] === '/api/bookings' && s.body && typeof s.body === 'object') {
        const bd = s.body;
        tags.push('IN startHour=' + bd.startHour, 'IN duration=' + bd.duration);
        if (Number.isInteger(bd.startHour) && Number.isInteger(bd.duration)) tags.push('IN end=' + (bd.startHour + bd.duration));
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(bd.date || ''));
        if (m) tags.push('IN day=' + Math.round((Date.UTC(+m[1], +m[2] - 1, +m[3]) - Date.UTC(2026, 10, 2)) / 86400000));
      }
      suKien.filter((e) => e.buoc < i).forEach((e) => { if (tags.indexOf(e.ten) < 0) tags.push(e.ten); });
      chuyen.filter((e) => e.buoc <= i).forEach((e) => { if (tags.indexOf(e.ten) < 0) tags.push(e.ten); });
    }
  }
  if (!loi && !coKiem) loi = 'no step has an "expect" — a test case must check something';
  return { pass: !loi, loi, tags };
}

/**
 * Bộ kiểm cho một bộ kịch bản (Report 5.2 / 5.3 chạy được).
 * o = { bien:'TEST_CASES', minCa, can:[{ma,ten}], dotBien:[{ma, moTa:{en,vi}, an?}], nhomCauTruc, nhomPhu, nhomDotBien, anPhu?:[ma] }
 */
export function kiemKichBan(o) {
  const { bien = 'TEST_CASES', minCa = 8 } = o;
  const dau = `const __tao = ${gon(taoLabBook)};
const __chay = ${gon(chayKichBan)};
const __T = (typeof ${bien} !== 'undefined' && Array.isArray(${bien})) ? ${bien} : null;
const __KQ = (function () {
  if (!__T) return '${bien} is missing — declare: const ${bien} = [ { id, description, precondition, steps: [ { as, call, body, expect } ] }, … ]';
  if (!__T.length) return '${bien} is empty';
  var goc = __T.map(function (c) { try { return __chay(__tao, c, null); } catch (e) { return { pass: false, loi: 'crashed: ' + e.message, tags: [] }; } });
  var phu = {}; goc.forEach(function (r, i) { if (r.pass) r.tags.forEach(function (t) { phu[t] = (phu[t] || []).concat([__T[i].id || '#' + (i + 1)]); }); });
  function viec() {
`;
  const cuoi = `
  }
  return viec;
})();
`;
  const kiem = [];
  const them = (moTa, than, ex = {}) => kiem.push({ moTa, chuanBi: `${dau}${than}${cuoi}`, goi: `typeof __KQ === 'string' ? __KQ : __KQ()`, mongDoi: 'OK', ...ex });
  them({ en: `Every test case is complete (unique id, description, precondition, steps with "as" + "call") — at least ${minCa} cases`, vi: `Mọi ca đủ trường (id duy nhất, mô tả, tiền điều kiện, các bước có "as" + "call") — ít nhất ${minCa} ca` }, `
    var thay = {}, loi = [];
    __T.forEach(function (c, i) {
      var ten = c.id || ('#' + (i + 1));
      if (!c.id) loi.push('#' + (i + 1) + ': no id'); else if (thay[c.id]) loi.push('duplicate id ' + c.id); thay[c.id] = 1;
      if (!String(c.description || '').trim()) loi.push(ten + ': empty description');
      if (!String(c.precondition || '').trim()) loi.push(ten + ': empty precondition');
      if (!Array.isArray(c.steps) || !c.steps.length) loi.push(ten + ': steps must be a non-empty array');
    });
    if (__T.length < ${minCa}) loi.push('only ' + __T.length + ' case(s) — write at least ${minCa}');
    return loi.length ? loi.slice(0, 4).join(' | ') : 'OK';`, o.nhomCauTruc ? { nhom: o.nhomCauTruc } : {});
  them({ en: 'Every test case PASSES on the correct system (each expected result is right)', vi: 'Mọi ca ĐẠT trên hệ thống đúng (mọi kết quả mong đợi đều đúng)' }, `
    var sai = []; goc.forEach(function (r, i) { if (!r.pass) sai.push((__T[i].id || '#' + (i + 1)) + ': ' + r.loi); });
    return sai.length ? sai.slice(0, 2).join(' | ') : 'OK';`, o.nhomCauTruc ? { nhom: o.nhomCauTruc } : {});
  for (const c of o.can || []) {
    them({ en: `Covers: ${c.ten}`, vi: `Phủ: ${c.tenVi || c.ten}` }, `
    return phu[${JSON.stringify(c.ma)}] ? 'OK' : 'not covered yet — no passing case checks a step that ends in "${c.ma.replace(/"/g, '\\"')}"';`, { ...((c.nhom || o.nhomPhu) ? { nhom: c.nhom || o.nhomPhu } : {}), ...((o.anPhu || []).includes(c.ma) || c.an ? { an: true } : {}) });
  }
  for (const m of o.dotBien || []) {
    them(m.an ? { en: `Hidden faulty build ${m.ma} is detected`, vi: `Bản lỗi ẩn ${m.ma} bị phát hiện` } : { en: `Detects faulty build ${m.ma}: ${m.moTa.en}`, vi: `Phát hiện bản lỗi ${m.ma}: ${m.moTa.vi}` }, `
    var dat = goc.map(function (r) { return r.pass; });
    if (!dat.some(Boolean)) return 'no case passes on the correct system yet';
    var giet = __T.some(function (c, i) { if (!dat[i]) return false; try { return !__chay(__tao, c, ${JSON.stringify(m.ma)}).pass; } catch (e) { return true; } });
    return giet ? 'KILLED' : 'SURVIVED — every passing case also passes on this faulty build';`, { mongDoi: 'KILLED', ...(o.nhomDotBien ? { nhom: o.nhomDotBien } : {}), ...(m.an ? { an: true } : {}) });
    kiem[kiem.length - 1].mongDoi = 'KILLED';
  }
  return kiem;
}

/** Tài liệu API (HTML) dùng chung trong các đề dùng LabBook. */
export const LABBOOK_API = {
  en: `<p><b>LabBook</b> lets FPT students book seats in university labs. The test environment starts every test case from the same seed data, with the clock fixed at <b>Monday 2026-11-02 08:00</b>.</p>
<table><thead><tr><th>Seed</th><th>Data</th></tr></thead><tbody>
<tr><td>Accounts (actor → email / password)</td><td><code>student1</code> an@fpt.edu.vn / An@12345 · <code>student2</code> binh@fpt.edu.vn / Binh@123 · <code>student3</code> chi@fpt.edu.vn / Chi@1234 · <code>manager</code> manager@fpt.edu.vn / Mgr@1234 · <code>admin</code> admin@fpt.edu.vn / Adm@1234 · <code>guest</code> = no token</td></tr>
<tr><td>Labs</td><td><code>LAB01</code> Software Lab, 2 seats, OPEN · <code>LAB02</code> Network Lab, 1 seat, OPEN · <code>LAB03</code> IoT Lab, 3 seats, CLOSED</td></tr>
<tr><td>Bookings</td><td>none — booking codes are issued in order: BK0001, BK0002, …</td></tr></tbody></table>
<table><thead><tr><th>Endpoint</th><th>Who</th><th>Behaviour (status · body)</th></tr></thead><tbody>
<tr><td><code>POST /api/auth/login</code> {email, password}</td><td>anyone</td><td>200 {token, role} · 401 AUTH_INVALID (unknown email / wrong password; the 3rd consecutive wrong password locks the account) · 423 ACCOUNT_LOCKED</td></tr>
<tr><td><code>GET /api/labs</code></td><td>anyone</td><td>200 [ {code, name, seats, status} ]</td></tr>
<tr><td><code>POST /api/bookings</code> {labCode, date, startHour, duration}</td><td>STUDENT</td><td>201 {code, status: CONFIRMED | PENDING} · 400 VALIDATION {field} (checked in the order labCode, date, startHour 7–20, duration 1–3) · 404 LAB_NOT_FOUND · 409 LAB_CLOSED · 422 OUT_OF_WINDOW (date before today or more than 14 days ahead) · 422 TOO_SOON (today, starting less than 1 hour from now) · 422 AFTER_CLOSING (ends after 21:00) · 409 OVERLAP (the student already has a booking at that time, any lab) · 422 WEEKLY_LIMIT (more than 6 booked hours in the same week, cancelled bookings excluded). A booking is CONFIRMED when a seat is free during every booked hour, otherwise PENDING (waitlist). An e-mail "Booking confirmed" or "Added to waitlist" is sent.</td></tr>
<tr><td><code>GET /api/bookings/me</code></td><td>logged in</td><td>200 [own bookings]</td></tr>
<tr><td><code>DELETE /api/bookings/:code</code></td><td>owner</td><td>200 {status: CANCELLED} · 404 BOOKING_NOT_FOUND · 403 NOT_OWNER · 409 ALREADY_CANCELLED · 409 TOO_LATE (less than 2 hours before the start). Cancelling a CONFIRMED booking promotes the waitlist of that lab and day <b>first come, first served</b>; each promoted student receives "Booking confirmed".</td></tr>
<tr><td><code>PATCH /api/labs/:code</code> {status: OPEN | CLOSED}</td><td>MANAGER</td><td>200 {code, status, cancelled} · 400 VALIDATION · 404 LAB_NOT_FOUND. Closing cancels every future CONFIRMED <b>and PENDING</b> booking of the lab and e-mails "Lab closed - booking cancelled".</td></tr>
<tr><td><code>POST /api/admin/users/:email/lock</code> · <code>/unlock</code></td><td>ADMIN</td><td>200 {email, locked}. A locked account cannot log in (423) and its existing tokens are rejected (401). Unlock resets the failure counter.</td></tr>
<tr><td>any protected endpoint</td><td>—</td><td>401 UNAUTHENTICATED without a valid token · 403 FORBIDDEN for the wrong role</td></tr>
<tr><td><code>GET /test/db/bookings</code> · <code>GET /test/outbox</code></td><td>test hook</td><td>200 every row of the bookings table / every e-mail sent {to, subject, ref} — lets a test check the database and the mail server directly</td></tr>
</tbody></table>`,
  vi: `<p><b>LabBook</b> cho sinh viên FPT đặt chỗ phòng lab. Môi trường test khởi động mọi ca từ cùng dữ liệu mẫu, đồng hồ cố định <b>thứ Hai 2026-11-02 08:00</b>.</p>
<table><thead><tr><th>Dữ liệu mẫu</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>Tài khoản (actor → email / mật khẩu)</td><td><code>student1</code> an@fpt.edu.vn / An@12345 · <code>student2</code> binh@fpt.edu.vn / Binh@123 · <code>student3</code> chi@fpt.edu.vn / Chi@1234 · <code>manager</code> manager@fpt.edu.vn / Mgr@1234 · <code>admin</code> admin@fpt.edu.vn / Adm@1234 · <code>guest</code> = không có token</td></tr>
<tr><td>Phòng lab</td><td><code>LAB01</code> Software Lab, 2 chỗ, OPEN · <code>LAB02</code> Network Lab, 1 chỗ, OPEN · <code>LAB03</code> IoT Lab, 3 chỗ, CLOSED</td></tr>
<tr><td>Booking</td><td>chưa có — mã cấp theo thứ tự: BK0001, BK0002, …</td></tr></tbody></table>
<table><thead><tr><th>Endpoint</th><th>Ai</th><th>Hành vi (status · body)</th></tr></thead><tbody>
<tr><td><code>POST /api/auth/login</code> {email, password}</td><td>ai cũng được</td><td>200 {token, role} · 401 AUTH_INVALID (email lạ / sai mật khẩu; sai lần thứ 3 liên tiếp thì khoá tài khoản) · 423 ACCOUNT_LOCKED</td></tr>
<tr><td><code>GET /api/labs</code></td><td>ai cũng được</td><td>200 [ {code, name, seats, status} ]</td></tr>
<tr><td><code>POST /api/bookings</code> {labCode, date, startHour, duration}</td><td>STUDENT</td><td>201 {code, status: CONFIRMED | PENDING} · 400 VALIDATION {field} (kiểm theo thứ tự labCode, date, startHour 7–20, duration 1–3) · 404 LAB_NOT_FOUND · 409 LAB_CLOSED · 422 OUT_OF_WINDOW (ngày trước hôm nay hoặc quá 14 ngày tới) · 422 TOO_SOON (hôm nay, bắt đầu chưa tới 1 giờ nữa) · 422 AFTER_CLOSING (kết thúc sau 21:00) · 409 OVERLAP (sinh viên đã có booking trùng giờ, phòng nào cũng tính) · 422 WEEKLY_LIMIT (quá 6 giờ trong cùng tuần, không tính booking đã huỷ). Booking CONFIRMED khi mọi giờ đặt đều còn chỗ, ngược lại PENDING (danh sách chờ). Gửi thư "Booking confirmed" hoặc "Added to waitlist".</td></tr>
<tr><td><code>GET /api/bookings/me</code></td><td>đã đăng nhập</td><td>200 [booking của chính mình]</td></tr>
<tr><td><code>DELETE /api/bookings/:code</code></td><td>chủ booking</td><td>200 {status: CANCELLED} · 404 BOOKING_NOT_FOUND · 403 NOT_OWNER · 409 ALREADY_CANCELLED · 409 TOO_LATE (còn chưa tới 2 giờ là bắt đầu). Huỷ một booking CONFIRMED thì nâng hạng danh sách chờ của phòng và ngày đó theo <b>ai đến trước được trước</b>; mỗi sinh viên được nâng nhận thư "Booking confirmed".</td></tr>
<tr><td><code>PATCH /api/labs/:code</code> {status: OPEN | CLOSED}</td><td>MANAGER</td><td>200 {code, status, cancelled} · 400 VALIDATION · 404 LAB_NOT_FOUND. Đóng phòng huỷ mọi booking tương lai CONFIRMED <b>và PENDING</b> của phòng và gửi thư "Lab closed - booking cancelled".</td></tr>
<tr><td><code>POST /api/admin/users/:email/lock</code> · <code>/unlock</code></td><td>ADMIN</td><td>200 {email, locked}. Tài khoản bị khoá không đăng nhập được (423) và token cũ bị từ chối (401). Mở khoá đặt lại bộ đếm sai.</td></tr>
<tr><td>mọi endpoint cần đăng nhập</td><td>—</td><td>401 UNAUTHENTICATED khi không có token hợp lệ · 403 FORBIDDEN khi sai vai trò</td></tr>
<tr><td><code>GET /test/db/bookings</code> · <code>GET /test/outbox</code></td><td>test hook</td><td>200 mọi dòng bảng bookings / mọi thư đã gửi {to, subject, ref} — để test nhìn thẳng CSDL và máy chủ thư</td></tr>
</tbody></table>`,
};

export const DOT_BIEN_TICH_HOP = [
  { ma: 'I1', moTa: { en: 'the API maps the service’s weekly-limit error to 500 instead of 422', vi: 'API đổi lỗi giới hạn tuần của service thành 500 thay vì 422' } },
  { ma: 'I2', moTa: { en: 'the service answers 201 but never saves the booking to the repository', vi: 'service trả 201 nhưng không lưu booking vào repository' } },
  { ma: 'I3', moTa: { en: 'the security configuration lets any logged-in role call PATCH /api/labs/:code', vi: 'cấu hình bảo mật cho mọi vai trò đã đăng nhập gọi PATCH /api/labs/:code' } },
  { ma: 'I4', moTa: { en: 'promotion from the waitlist updates the database but never notifies the mail service', vi: 'nâng hạng từ danh sách chờ cập nhật CSDL nhưng không gọi dịch vụ thư' } },
  { ma: 'I5', moTa: { en: 'closing a lab cancels CONFIRMED bookings but leaves PENDING ones', vi: 'đóng phòng huỷ booking CONFIRMED nhưng bỏ sót PENDING' } },
  { ma: 'I6', moTa: { en: 'cancel answers 200 CANCELLED but updates a copy — the database row keeps its old status', vi: 'huỷ trả 200 CANCELLED nhưng chỉ sửa bản sao — dòng trong CSDL giữ trạng thái cũ' } },
  { ma: 'I7', moTa: { en: 'GET /api/bookings/me forgets the owner filter in the repository query', vi: 'GET /api/bookings/me quên lọc theo chủ trong câu truy vấn repository' } },
  { ma: 'I8', moTa: { en: 'the overlap check only looks at bookings of the same lab', vi: 'kiểm trùng giờ chỉ xét booking cùng phòng' } },
  { ma: 'I9', moTa: { en: 'a successful login does not reset the failure counter', vi: 'đăng nhập đúng không đặt lại bộ đếm sai' } },
];
export const DOT_BIEN_HE_THONG = [
  { ma: 'S1', moTa: { en: 'a locked account can keep working with a token issued before the lock', vi: 'tài khoản bị khoá vẫn dùng được token cấp trước khi khoá' } },
  { ma: 'S2', moTa: { en: 'waitlisted (PENDING) bookings take seats when capacity is computed', vi: 'booking chờ (PENDING) bị tính vào số chỗ đã dùng' } },
  { ma: 'S3', moTa: { en: 'cancelled bookings still count toward the weekly 6-hour limit', vi: 'booking đã huỷ vẫn bị tính vào giới hạn 6 giờ/tuần' } },
  { ma: 'S4', moTa: { en: 'a CLOSED lab still accepts new bookings', vi: 'phòng đã ĐÓNG vẫn nhận booking mới' } },
  { ma: 'S5', moTa: { en: 'a booking can be cancelled less than 2 hours before it starts', vi: 'vẫn huỷ được khi còn chưa tới 2 giờ là bắt đầu' } },
  { ma: 'S6', moTa: { en: 'the booking window accepts a date 15 days ahead', vi: 'cửa sổ đặt chỗ nhận ngày cách 15 ngày' } },
  { ma: 'S7', moTa: { en: 'the waitlist is promoted last-come-first-served', vi: 'danh sách chờ được nâng theo người đến SAU trước' } },
  { ma: 'S8', moTa: { en: 'a lab re-opened by the manager still rejects bookings', vi: 'phòng được quản lý mở lại vẫn từ chối booking' } },
];
