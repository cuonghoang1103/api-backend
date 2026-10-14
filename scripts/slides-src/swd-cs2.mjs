/**
 * swd-cs2.mjs — SWD392 ⭐ Chuyên sâu 2: CLASS DIAGRAM ↔ JAVA ↔ JPA ↔ CSDL (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/swd-cs2.mjs --out <dir>
 *
 * Mọi output trên slide lấy từ kết quả CHẠY THẬT:
 *   Java  — flm-nguon/_repo/SWD392/gen/java/cs2/*.java (javac --release 17, annotation JPA là bản giả khai trong file);
 *   SQL   — PostgreSQL 16 (container dbi202-pg, schema swd_cs2, đã dọn); Flyway OSS 10.22 chạy thật V1/V2.
 * Quy tắc JPA trích Jakarta Persistence 3.1 (§2.10, §2.11.5.1, §2.13, §3.2.4, §11.1) và Hibernate ORM 6.6 User Guide.
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs2', code: 'CS2', title: 'Class diagram ↔ Java ↔ JPA ↔ CSDL', sub: 'SWD392 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const pre = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:8px 12px;font:14.5px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const loi = (txt) => `<span style="font:15px/1.35 Menlo,Consolas,monospace;color:#c0392b">${txt}</span>`;
const nhan = (t, mau = '#b85a2b') => `<div style="font-size:15px;font-weight:700;color:${mau};letter-spacing:.5px;text-transform:uppercase;margin-bottom:4px">${t}</div>`;
const cot4 = (a, b, c, d, st = '') => `<div style="display:grid;grid-template-columns:${st || '1fr 1fr'};gap:14px">${[a, b, c, d].filter(Boolean).map((x) => `<div style="min-width:0">${x}</div>`).join('')}</div>`;
const java = (s) => code(s, 'java', 'sm');
const sql = (s) => code(s, 'sql', 'sm');

/* ───────────── SVG UML tí hon ───────────── */
const C = '#334155';
function lop(x, y, w, ten, thuoc = [], { st = '', ops = [], nghieng = false, hl = false } = {}) {
  const hd = st ? 44 : 30, lh = 19;
  const h = hd + Math.max(1, thuoc.length) * lh + 8 + (ops.length ? ops.length * lh + 8 : 0);
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#f8fafc" stroke="${hl ? '#c0392b' : C}" stroke-width="${hl ? 2.5 : 1.6}"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${hd}" rx="7" fill="#e0e7ff" stroke="${hl ? '#c0392b' : C}" stroke-width="${hl ? 2.5 : 1.6}"/>`;
  if (st) s += `<text x="${x + w / 2}" y="${y + 16}" text-anchor="middle" font-size="12.5" font-style="italic" fill="#4338ca">«${st}»</text>`;
  s += `<text x="${x + w / 2}" y="${y + hd - 9}" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a"${nghieng ? ' font-style="italic"' : ''}>${ten}</text>`;
  thuoc.forEach((t, i) => { s += `<text x="${x + 8}" y="${y + hd + 16 + i * lh}" font-size="13.5" fill="#0f172a">${t}</text>`; });
  if (ops.length) {
    const yo = y + hd + Math.max(1, thuoc.length) * lh + 8;
    s += `<line x1="${x}" y1="${yo}" x2="${x + w}" y2="${yo}" stroke="${C}" stroke-width="1.2"/>`;
    ops.forEach((t, i) => { s += `<text x="${x + 8}" y="${yo + 16 + i * lh}" font-size="13.5" fill="#0f172a">${t}</text>`; });
  }
  return { s, h, x, y, w };
}
function dau(kieu, x, y, goc) {
  const t = `transform="translate(${x},${y}) rotate(${goc})"`;
  if (kieu === 'mui') return `<polyline points="-14,-7 0,0 -14,7" fill="none" stroke="${C}" stroke-width="1.8" ${t}/>`;
  if (kieu === 'tamgiac') return `<polygon points="0,0 -17,-10 -17,10" fill="#fff" stroke="${C}" stroke-width="1.6" ${t}/>`;
  if (kieu === 'thoiDac') return `<polygon points="0,0 -12,-7 -24,0 -12,7" fill="${C}" stroke="${C}" stroke-width="1.4" ${t}/>`;
  if (kieu === 'thoiRong') return `<polygon points="0,0 -12,-7 -24,0 -12,7" fill="#fff" stroke="${C}" stroke-width="1.6" ${t}/>`;
  return '';
}
/** Đường nối (x1,y1)→(x2,y2); dauCuoi ở (x2,y2), dauDau ở (x1,y1). */
function noi(x1, y1, x2, y2, { cuoi = '', dau1 = '', net = false } = {}) {
  const g = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C}" stroke-width="1.7"${net ? ' stroke-dasharray="7 5"' : ''}/>` +
    dau(cuoi, x2, y2, g) + dau(dau1, x1, y1, g + 180);
}
const chu = (x, y, t, { a = 'middle', c = '#334155', z = 13.5, b = false } = {}) => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="${z}" fill="${c}"${b ? ' font-weight="700"' : ''}>${t}</text>`;
const svg = (w, h, inner, st = '') => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-height:${h}px;${st}" font-family="Arial, sans-serif">${inner}</svg>`;

/* bảng (ERD) tí hon cho slide kế thừa / bảng nối */
function bangDb(x, y, w, ten, cot, mau = '#e08a1e') {
  const h = 30 + cot.length * 20 + 8;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="#b85a2b" stroke-width="1.6"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="28" rx="6" fill="${mau}"/><rect x="${x}" y="${y + 18}" width="${w}" height="10" fill="${mau}"/>`;
  s += `<text x="${x + w / 2}" y="${y + 19}" text-anchor="middle" font-size="14.5" font-weight="700" fill="#fff">${ten}</text>`;
  cot.forEach((c, i) => { s += `<text x="${x + 8}" y="${y + 45 + i * 20}" font-size="13" fill="#262626">${c}</text>`; });
  return { s, h };
}

/* ───────────── các sơ đồ ───────────── */
function soDoTongQuan() {
  let s = '';
  const u = lop(10, 10, 150, 'AppUser', ['email'], { st: 'entity' });
  const res = lop(250, 10, 190, 'Reservation', ['start, end, status'], { st: 'entity' });
  const it = lop(530, 10, 170, 'ReservationItem', ['quantity'], { st: 'entity' });
  const eq = lop(790, 10, 150, 'Equipment', ['assetTag'], { st: 'entity' });
  const b = lop(10, 170, 150, 'Building', ['name'], { st: 'entity' });
  const lab = lop(250, 170, 190, 'Lab', ['roomCode, capacity'], { st: 'entity' });
  const pol = lop(530, 170, 170, 'CancellationPolicy', ['allows()'], { st: 'interface', nghieng: true });
  const mt = lop(790, 170, 150, 'MaintenanceTicket', ['status'], { st: 'entity', nghieng: true });
  s += u.s + res.s + it.s + eq.s + lab.s + b.s + mt.s + pol.s;
  s += noi(250, 45, 160, 45, { cuoi: 'mui' }) + chu(205, 38, '① có hướng', { z: 12 });
  s += noi(530, 45, 440, 45, { cuoi: 'thoiDac' }) + chu(486, 38, '④ hợp thành', { z: 12 });
  s += noi(700, 45, 790, 45, { cuoi: 'mui' });
  s += noi(345, 81, 345, 170) + chu(352, 130, '② hai chiều', { a: 'start', z: 12 });
  s += noi(160, 205, 250, 205, { dau1: 'thoiDac' }) + chu(205, 196, '⑨ [roomCode]', { z: 12 });
  s += noi(420, 81, 575, 170, { cuoi: 'mui', net: true }) + chu(512, 118, '⑤ «use»', { a: 'start', z: 12 });
  s += noi(865, 170, 865, 81, { cuoi: 'mui' });
  s += `<polyline points="345,265 345,280 965,280 965,45 940,45" fill="none" stroke="${C}" stroke-width="1.7"/>` + dau('thoiRong', 345, 241, -90);
  s += chu(655, 274, '③ kết tập Lab ◇— Equipment', { z: 12 });
  s += chu(470, 312, '⑥ MaintenanceTicket ◁— Corrective / Preventive · ⑦ Bookable ◁┈ Lab, Equipment · ⑧ User–Role, Competency, WaitlistEntry', { z: 13, c: '#7f7f7f' });
  return svg(975, 320, s);
}

function soDoHuong() {
  let s = '';
  const r = lop(10, 20, 200, 'Reservation', ['- start : LocalDateTime', '- end : LocalDateTime'], { st: 'entity' });
  const l = lop(370, 20, 150, 'Lab', ['- code : String'], { st: 'entity' });
  s += r.s + l.s + noi(210, 60, 370, 60, { cuoi: 'mui' });
  s += chu(225, 52, '0..*', { a: 'start' }) + chu(355, 52, 'lab', { a: 'end' }) + chu(355, 78, '1', { a: 'end' });
  return svg(530, 120, s);
}

function soDoHaiChieu() {
  let s = '';
  const l = lop(10, 10, 210, 'Lab', ['- code : String'], { st: 'entity', ops: ['+ addReservation(r)', '+ removeReservation(r)'] });
  const r = lop(400, 10, 180, 'Reservation', ['- start : LocalDateTime'], { st: 'entity' });
  s += l.s + r.s + noi(220, 60, 400, 60);
  s += chu(232, 52, 'lab', { a: 'start' }) + chu(232, 78, '1', { a: 'start' }) + chu(390, 52, 'reservations', { a: 'end' }) + chu(390, 78, '0..*', { a: 'end' });
  return svg(590, 150, s);
}

function soDoAgg() {
  let s = '';
  const l = lop(10, 10, 140, 'Lab', ['- code'], { st: 'entity' });
  const e = lop(290, 10, 160, 'Equipment', ['- assetTag'], { st: 'entity' });
  s += l.s + e.s + noi(150, 50, 290, 50, { dau1: 'thoiRong' });
  s += chu(180, 42, '0..1', { a: 'start' }) + chu(282, 42, '0..*', { a: 'end' });
  return svg(460, 100, s);
}
function soDoComp() {
  let s = '';
  const r = lop(10, 10, 150, 'Reservation', ['- code'], { st: 'entity' });
  const i = lop(270, 10, 170, 'ReservationItem', ['- quantity'], { st: 'entity' });
  const e = lop(550, 10, 140, 'Equipment', ['- assetTag'], { st: 'entity' });
  s += r.s + i.s + e.s + noi(160, 50, 270, 50, { dau1: 'thoiDac' }) + noi(440, 50, 550, 50, { cuoi: 'mui' });
  s += chu(192, 42, '1', { a: 'start' }) + chu(262, 42, '0..*', { a: 'end' }) + chu(448, 42, '0..*', { a: 'start' }) + chu(542, 42, '1', { a: 'end' });
  return svg(700, 100, s);
}
function soDoDep() {
  let s = '';
  const r = lop(10, 10, 330, 'Reservation', ['- start : LocalDateTime'], { st: 'entity', ops: ['+ cancel(policy : CancellationPolicy, now)'] });
  const p = lop(440, 10, 230, 'CancellationPolicy', [], { st: 'interface', nghieng: true, ops: ['+ allows(start, now) : boolean'] });
  const t = lop(470, 150, 170, 'TwoHourRule', [], { ops: ['+ allows(start, now)'] });
  s += r.s + p.s + t.s + noi(340, 55, 440, 55, { cuoi: 'mui', net: true }) + chu(390, 47, '«use»') + noi(555, 150, 555, p.h + 10, { cuoi: 'tamgiac', net: true });
  return svg(680, 245, s);
}
function soDoGen() {
  let s = '';
  const m = lop(170, 5, 230, 'MaintenanceTicket', ['# status'], { st: 'entity', nghieng: true, ops: ['+ dueAt() {abstract}'] });
  const c = lop(10, 175, 210, 'CorrectiveTicket', ['- severity'], { st: 'entity', ops: ['+ dueAt()'] });
  const p = lop(320, 175, 230, 'PreventiveTicket', ['- intervalDays', '- plannedFor'], { st: 'entity', ops: ['+ dueAt()'] });
  s += m.s + c.s + p.s;
  s += `<polyline points="115,175 115,150 435,150 435,175" fill="none" stroke="${C}" stroke-width="1.7"/>` + noi(285, 150, 285, 5 + m.h, { cuoi: 'tamgiac' });
  return svg(560, 300, s);
}
function soDoReal() {
  let s = '';
  const b = lop(130, 5, 200, 'Bookable', [], { st: 'interface', nghieng: true, ops: ['+ bookingKey()', '+ maxHours()'] });
  const l = lop(20, 160, 150, 'Lab', ['- code'], { st: 'entity' });
  const e = lop(290, 160, 150, 'Equipment', ['- assetTag'], { st: 'entity' });
  s += b.s + l.s + e.s;
  s += `<polyline points="95,160 95,135 365,135 365,160" fill="none" stroke="${C}" stroke-width="1.7" stroke-dasharray="7 5"/>` + noi(230, 135, 230, 5 + b.h, { cuoi: 'tamgiac', net: true });
  return svg(450, 250, s);
}
function soDoQual() {
  let s = '';
  const b = lop(10, 10, 160, 'Building', ['- name'], { st: 'entity' });
  s += b.s + `<rect x="170" y="40" width="100" height="26" fill="#fff" stroke="${C}" stroke-width="1.6"/>` + chu(220, 58, 'roomCode', { z: 14 });
  const l = lop(420, 10, 160, 'Lab', ['- roomCode', '- name'], { st: 'entity' });
  s += l.s + noi(270, 53, 420, 53, { dau1: 'thoiDac' }) + chu(300, 45, '1', { a: 'start' }) + chu(412, 45, '0..1', { a: 'end' });
  return svg(590, 110, s);
}
function soDoNN() {
  let s = '';
  const u = lop(10, 10, 140, 'AppUser', ['- email'], { st: 'entity' });
  const m = lop(330, 10, 170, 'SafetyModule', ['- title'], { st: 'entity' });
  const c = lop(175, 110, 180, 'Competency', ['- score', '- validUntil'], { st: 'entity', hl: true });
  s += u.s + m.s + c.s + noi(150, 45, 330, 45) + noi(265, 45, 265, 110, { net: true });
  s += chu(160, 38, '0..*', { a: 'start' }) + chu(322, 38, '0..*', { a: 'end' });
  return svg(510, 210, s);
}

/* ───────────── slides ───────────── */
export const slides = lamDeck('CLASS DIAGRAM ↔ JAVA ↔ JPA ↔ CSDL', [
  /* 1 */
  { cover: true, t: 'Class diagram ↔ Java ↔ JPA ↔ CSDL', sub: 'Mỗi quan hệ UML đi trọn bốn tầng: sơ đồ → Java chạy thật → annotation JPA → bảng PostgreSQL + Flyway<br>Ví dụ xuyên suốt: LabFlow — Lab, Equipment, Reservation, Waitlist, User, MaintenanceTicket' },

  /* 2 */
  { t: 'Một mô hình, bốn tầng', body: `${soDoTongQuan()}
${bang([
    ['① có hướng · bội số · ② hai chiều', '4–9', '◇ ◆ · cascade · orphanRemoval', '10–13'],
    ['⑤ phụ thuộc · ⑥ tổng quát hoá · @Inheritance', '14–17', '⑦ hiện thực hoá · ⑧ n-n · ⑨ qualifier', '18–20'],
  ], ['Quan hệ', 'Slide', 'Quan hệ', 'Slide'], 'font-size:18px')}
<p class="nho">Ký hiệu đã học ở bài 2.D–2.H, ánh xạ sang bảng kiểu Gomaa ở bài 3.I. Deck này đi tiếp: <b>hành vi trong Java</b>, <b>annotation JPA</b>, <b>bảng chạy thật</b> và <b>migration</b>.</p>` },

  /* 3 */
  { t: 'Analysis class · design class · entity · DTO', body: `${bang([
    ['Analysis class', 'Report 3, Assignment 02', 'tên + thuộc tính (chưa cần kiểu)', 'kiểu, thao tác, id, khoá ngoại'],
    ['Design class', 'Report 4 class diagram', 'kiểu, phạm vi (+ − #), thao tác có nghĩa', 'getter/setter, cột khoá ngoại'],
    ['Entity JPA', 'code: <code>@Entity</code>', 'id, <code>@ManyToOne</code>, <code>@Version</code>, hành vi', 'dữ liệu của màn hình cụ thể'],
    ['DTO (record)', 'code: API vào/ra', 'đúng trường client cần', 'mật khẩu băm, quan hệ lười'],
  ], ['Dạng', 'Nằm ở', 'Có', 'Không có'], 'font-size:19px')}
<div class="hai">${o('Cùng một <b>Reservation</b> đi qua bốn dạng: <i>phân tích → thiết kế → lưu trữ → hợp đồng API</i>. Mỗi dạng trả lời một câu hỏi khác nhau.')}
${o('Trả thẳng entity ra API ⇒ lộ <code>passwordHash</code>, JSON lặp vô hạn ở quan hệ hai chiều, lỗi lazy loading. <b>Luôn map sang DTO.</b>', 'do2')}</div>` },

  /* 4 */
  { t: 'Liên kết có hướng (directed association)', body: `${soDoHuong()}
${cot4(
    nhan('Java') + java(`class Reservation {
    private final Lab lab;   // giữ trường
}
class Lab { /* không biết Reservation */ }`),
    nhan('JPA (dáng)') + java(`@ManyToOne(optional = false,
            fetch = FetchType.LAZY)
@JoinColumn(name = "lab_id")
private Lab lab;`),
    nhan('SQL — PostgreSQL') + sql(`lab_id bigint NOT NULL
       REFERENCES lab (id)`),
    nhan('Ý nghĩa') + `<ul style="font-size:19px"><li>Mũi tên = lớp nào <b>giữ trường</b></li><li>Bảng <code>lab</code> không có cột nào cho Reservation</li><li><code>@ManyToOne</code> mặc định <span class="do">EAGER</span> (JPA 3.1) ⇒ thường ghi <code>LAZY</code></li></ul>`,
    '1.15fr 1fr')}` },

  /* 5 */
  { t: 'Bội số (multiplicity) → code → ràng buộc', body: `${bang([
    ['<b>1</b>', '<code>final</code>, <code>requireNonNull</code>', '<code>optional = false</code>', '<code>NOT NULL</code> + FK'],
    ['<b>0..1</b>', 'trả <code>Optional&lt;AppUser&gt;</code>', '<code>@ManyToOne</code> (mặc định optional)', 'FK cho phép <code>NULL</code>'],
    ['<b>0..*</b>', '<code>List</code> khởi tạo sẵn, không null', '<code>@OneToMany(mappedBy)</code>', 'không có cột ở bảng cha'],
    ['<b>1..*</b>', 'kiểm trong constructor / service', 'không có annotation riêng', '<span class="do">không tự giữ được</span>'],
    ['<b>0..5</b>', '<code>if (size == 5) throw</code>', '<code>@Size(max = 5)</code> (Bean Validation)', 'trigger hoặc kiểm ở service'],
  ], ['Bội số', 'Java', 'JPA', 'SQL'], 'font-size:19px')}
<div class="hai"><div>${pre(`add EQ-6      : rejected -> at most 5 items (multiplicity 0..5)
no lab         : rejected -> lab is required (multiplicity 1)
clear() outside: rejected (read-only view)`, 'font-size:13.5px')}</div>
<div>${pre(`INSERT INTO reservation_equipment VALUES (1, 6);
${loi('ERROR:  reservation 1 already has 5 items (0..5)')}
INSERT … (lab_id) VALUES (NULL, …);
${loi('ERROR:  null value in column "lab_id" … not-null')}`, 'font-size:13.5px')}</div></div>` },

  /* 6 */
  { t: 'Liên kết hai chiều: owning side &amp; mappedBy', body: `<div class="hai"><div>${soDoHaiChieu()}
${java(`// phía làm chủ (owning side) — có cột lab_id
@ManyToOne(optional = false)
private Lab lab;

// phía nghịch (inverse side) — KHÔNG có cột
@OneToMany(mappedBy = "lab")
private List<Reservation> reservations = new ArrayList<>();`)}</div>
<div>${bang([
    ['1 — *', 'phía <b>nhiều</b> (<code>@ManyToOne</code>) — bắt buộc'],
    ['1 — 1', 'phía <b>có khoá ngoại</b>'],
    ['* — *', 'bên nào cũng được'],
  ], ['Kiểu', 'Owning side là'], 'font-size:19px')}
${o('<code>mappedBy = "lab"</code> nghĩa là: “quan hệ này đã được trường <code>lab</code> bên kia làm chủ — đừng tạo cột cho tôi”.')}
${o('<code>@ManyToOne</code> <span class="do">không có</span> thuộc tính <code>mappedBy</code> — phía nhiều luôn làm chủ (JPA 3.1 §2.10).', 'do2')}</div></div>` },

  /* 7 */
  { t: 'Hai chiều: ứng dụng phải tự giữ đồng bộ', body: `<div class="hai"><div>${java(`void addReservation(Reservation r) {
    if (r.getLab() != null)            // rời lab cũ
        r.getLab().reservations.remove(r);
    reservations.add(r);               // phía nghịch
    r.setLabInternal(this);            // phía làm chủ
}
List<Reservation> getReservations() {
    return Collections.unmodifiableList(reservations);
}`)}</div>
<div>${pre(`A. naive setters
  R1.lab = B201, B201.reservations = []  <- out of sync
  B305.reservations = [R1], but R1.lab = B201  <- two labs claim R1?
B. helper methods on the 'one' side
  B201 = [R1, R2], R1.lab = B201
  move R1 -> B201 = [R2], B305 = [R1], R1.lab = B305
  remove R2 -> B201 = [], R2.lab = null
  getReservations().add(...) -> rejected, use addReservation()`, 'font-size:11.5px')}</div></div>
${o('JPA 3.1 §2.10: <i>“it is the application that bears responsibility for maintaining the consistency of runtime relationships”</i> — Hibernate <b>không</b> tự sửa phía còn lại. Mọi thay đổi đi qua <b>một</b> hàm helper.', 'do2')}` },

  /* 8 */
  { t: 'Chỉ phía làm chủ được ghi xuống CSDL', body: `${bang([
    ['chỉ <code>lab.getReservations().add(r)</code>', '<span class="do">NULL</span> (mất!)', 'có r'],
    ['chỉ <code>r.setLab(lab)</code>', '1', '<span class="do">thiếu r</span> tới khi tải lại'],
    ['cả hai (hàm helper)', '1', 'có r'],
  ], ['Code đã làm', 'reservation.lab_id sau flush', 'lab.reservations trong bộ nhớ'], 'font-size:20px')}
<div class="hai"><div>${pre(`1. only lab.reservations.add(r) -> reservation.lab_id = [null]
2. only r.lab = lab            -> reservation.lab_id = [1]
   but in memory b201.reservations contains r2? false
3. both sides                  -> reservation.lab_id = [1]
   in memory b201.reservations contains r3? true`, 'font-size:13px')}</div>
${o('Chương trình <b>mô phỏng</b> đúng quy tắc JPA 3.1 §3.2.4: <i>“persisted based on references held by the owning side”</i>. Phía <code>mappedBy</code> chỉ để <b>đọc cho tiện</b>.')}</div>
${o('Vì vậy hàm helper đặt ở phía “một” (Lab), nhưng dòng <b>quan trọng nhất</b> trong nó là <code>r.setLabInternal(this)</code> — dòng sửa phía làm chủ. Quên dòng đó: không lỗi, không cảnh báo, chỉ có <code>lab_id = NULL</code> (hoặc lỗi NOT NULL nếu cột bắt buộc).', 'do2')}` },

  /* 9 */
  { t: '@OneToMany một chiều ⇒ thêm một bảng nối', body: `<div class="hai"><div>${nhan('A. chỉ Lab có List&lt;Reservation&gt;')}${svg(560, 112, bangDb(10, 5, 160, 'lab', ['id PK', 'code']).s + bangDb(200, 5, 200, 'lab_reservations', ['lab_id FK', 'reservations_id FK UNIQUE'], '#c0392b').s + bangDb(430, 5, 125, 'reservation', ['id PK', 'start_at']).s + noi(170, 50, 200, 50) + noi(400, 50, 430, 50))}
${pre(`INSERT INTO lab_reservations VALUES (2, 101);
${loi('ERROR:  duplicate key value violates unique constraint')}
${loi('       "lab_reservations_reservations_id_key"')}`, 'font-size:13px')}</div>
<div>${nhan('B. Reservation có @ManyToOne lab', '#2f7d4f')}${svg(400, 112, bangDb(10, 5, 150, 'lab', ['id PK', 'code'], '#2f7d4f').s + bangDb(220, 5, 170, 'reservation', ['id PK', 'lab_id FK', 'start_at'], '#2f7d4f').s + noi(160, 50, 220, 50))}
${o('JPA 3.1 §2.11.5.1: một chiều ⇒ bảng nối mặc định <code>Lab_Reservation</code> (Spring Boot đặt <code>lab_reservations</code>). Hibernate 6: bản hai chiều <i>“much more efficient”</i>.', 'xanh')}</div></div>
<p class="nho">Quy tắc thực chiến: quan hệ 1–* luôn có <code>@ManyToOne</code> ở phía nhiều; thêm <code>@OneToMany(mappedBy)</code> chỉ khi thật sự cần đi ngược.</p>` },

  /* 10 */
  { t: 'Kết tập (aggregation) ◇ — bộ phận sống tiếp', body: `<div class="hai" style="align-items:center"><div>${soDoAgg()}</div>${o('Câu hỏi vòng đời: <b>xoá Lab thì thiết bị còn không?</b> Còn — chuyển phòng hoặc nằm kho ⇒ ◇.')}</div>
${cot4(
    nhan('Java') + java(`void deleteLab(Lab lab) {
  for (Equipment e : lab.equipment)
      e.lab = null;   // về kho
  labs.remove(lab.code);
}`),
    nhan('JPA (dáng)') + java(`@OneToMany(mappedBy = "lab")
// KHÔNG cascade REMOVE
List<Equipment> equipment;

@ManyToOne        // 0..1
Lab lab;`),
    nhan('SQL') + sql(`lab_id bigint
  REFERENCES lab (id)
  ON DELETE SET NULL`),
    nhan('Output Java thật') + pre(`delete lab B201 ->
 labs=0 equipment=3
 [OSC-01@storage,
  OSC-02@storage,
  PI-07@storage]`, 'font-size:13px'),
    '1fr 1fr')}` },

  /* 11 */
  { t: 'Hợp thành (composition) ◆ — bộ phận chết theo', body: `${soDoComp()}
${cot4(
    nhan('JPA (dáng)') + java(`@OneToMany(mappedBy = "reservation",
           cascade = CascadeType.ALL,
           orphanRemoval = true)
private List<ReservationItem> items
        = new ArrayList<>();`),
    nhan('SQL') + sql(`reservation_id bigint NOT NULL
  REFERENCES reservation (id)
  ON DELETE CASCADE`),
    nhan('Output Java thật') + pre(`delete reservation R ->
 reservations=0 items=0
 equipment=3 (equipment untouched)`, 'font-size:13px'),
    null, '1.25fr 1fr 1fr')}
<ul style="font-size:21px"><li>◆ đặt ở <b>toàn thể</b> (Reservation); bộ phận thuộc <b>đúng một</b> toàn thể ⇒ FK <code>NOT NULL</code></li>
<li>ReservationItem vẫn chỉ <b>tham chiếu</b> Equipment (liên kết thường) — xoá item <span class="do">không</span> xoá thiết bị</li></ul>` },

  /* 12 */
  { t: 'cascade REMOVE hay orphanRemoval?', body: `${bang([
    ['không cascade', 'dòng I1 <b>vẫn còn</b>, vẫn trỏ R1', loi('ERROR: FK … still references R1')],
    ['<code>cascade = REMOVE</code>', 'dòng I1 <b>vẫn còn</b> (tải lại là “sống lại”)', 'xoá R1 + mọi item'],
    ['<code>orphanRemoval = true</code>', 'I1 bị <b>DELETE</b> lúc flush', 'xoá R1 + mọi item'],
  ], ['Cấu hình Reservation.items', '<code>items.remove(I1)</code>', '<code>em.remove(R1)</code>'], 'font-size:19px')}
<div class="hai">${o('JPA 3.1 §2.10: <code>orphanRemoval</code> chỉ cho <code>@OneToOne</code>/<code>@OneToMany</code>, dành cho thực thể <b>“privately owned”</b> — đúng nghĩa ◆. Có orphanRemoval thì xoá cha tự lan xuống con.', 'xanh')}
${o('<span class="do">Đừng</span> <code>cascade = REMOVE</code> trên <code>@ManyToMany</code>/<code>@ManyToOne</code>: JPA ghi là không portable; Hibernate: lan ra <b>ngoài bảng nối</b> — xoá cả dữ liệu dùng chung.', 'do2')}</div>
<p class="nho">Bảng trên là output của chương trình mô phỏng OrphanRemoval.java (theo §2.10, §3.2.3, §3.2.4) — không phải Hibernate thật.</p>` },

  /* 13 */
  { t: 'Chạy thật trên PostgreSQL: ◇ và ◆', body: `<div class="hai"><div>${sql(`CREATE TABLE equipment (            -- ◇
  id bigint PRIMARY KEY,
  lab_id bigint REFERENCES lab (id) ON DELETE SET NULL);
CREATE TABLE reservation_item (     -- ◆
  id bigint PRIMARY KEY,
  reservation_id bigint NOT NULL
    REFERENCES reservation (id) ON DELETE CASCADE,
  equipment_id bigint NOT NULL
    REFERENCES equipment (id) ON DELETE RESTRICT);`)}</div>
<div>${pre(`DELETE FROM lab WHERE id = 1;
 asset_tag | lab_id
 OSC-01    |
 OSC-02    |
 PI-07     |      2
DELETE FROM equipment WHERE id = 10;
${loi('ERROR: … violates foreign key constraint')}
${loi('  "reservation_item_equipment_id_fkey"')}
DELETE FROM reservation WHERE id = 100;
 items_left = 0 · equipment_left = 3`, 'font-size:13.5px')}</div></div>
${o('Hai lớp khác nhau: <b>cascade JPA</b> = Hibernate tự phát lệnh DELETE cho từng con; <b>ON DELETE CASCADE</b> = CSDL tự xoá. Hibernate có <code>@OnDelete(action = OnDeleteAction.CASCADE)</code> để sinh dòng SQL thứ hai.')}` },

  /* 14 */
  { t: 'Phụ thuộc (dependency) — mũi tên nét đứt', body: `<div class="hai"><div>${soDoDep()}</div>
<div>${java(`void cancel(CancellationPolicy policy,
            LocalDateTime now) {
    if (!policy.allows(start, now))
        throw new IllegalStateException(
            code + ": too late to cancel");
    status = "CANCELLED";
}`)}</div></div>
${pre(`R-2 cancelled at 07:00 -> R-2: too late to cancel
Reservation fields: [code:String, start:LocalDateTime, status:String]  <- no CancellationPolicy field`, 'font-size:13.5px')}
${bang([['là <b>trường</b> (field) của lớp', 'liên kết ⇒ có thể thành khoá ngoại'], ['chỉ là <b>tham số</b>, biến cục bộ, kiểu trả về, gọi static', 'phụ thuộc ⇒ <span class="do">không</span> cột, không annotation']], ['Lớp kia xuất hiện ở đâu', 'Vẽ thành'], 'font-size:19px')}` },

  /* 15 */
  { t: 'Tổng quát hoá (generalization) → extends', body: `<div class="hai"><div>${soDoGen()}</div>
<div>${java(`for (MaintenanceTicket t : queue)  // đa hình
    System.out.printf("#%d %-17s due %s%n",
        t.id, t.getClass().getSimpleName(),
        t.dueAt());`)}
${pre(`#1 CorrectiveTicket  OSC-01   due 2026-10-14T13:00
#2 CorrectiveTicket  OSC-01   due 2026-10-17T09:00
#3 PreventiveTicket  HOOD-02  due 2026-11-01T08:00
#4 PreventiveTicket  HOOD-02  due 2026-12-01T08:00`, 'font-size:12.5px;margin-top:8px')}</div></div>
${bang([['<code>@Entity</code> lớp cha (có thể abstract)', 'có bảng/dòng, truy vấn đa hình được, quan hệ trỏ tới lớp cha được'], ['<code>@MappedSuperclass</code> (vd BaseEntity: id, createdAt)', '<span class="do">không</span> phải entity: chỉ chép cột xuống lớp con']], ['Lớp cha là', 'Hệ quả'], 'font-size:18px')}` },

  /* 16 */
  { t: '@Inheritance: ba chiến lược', body: `${bang([
    ['<code>SINGLE_TABLE</code> <b>(mặc định)</b>', '1 bảng + cột phân loại (mặc định <code>DTYPE</code>)', 'nhanh, truy vấn đa hình dễ', 'cột riêng của lớp con <span class="do">phải cho NULL</span>'],
    ['<code>JOINED</code>', 'bảng gốc + 1 bảng/lớp con, PK = FK', 'chuẩn hoá, NOT NULL được', 'mỗi lần đọc phải JOIN'],
    ['<code>TABLE_PER_CLASS</code>', '1 bảng đầy đủ/lớp cụ thể', 'mỗi bảng tự đủ', 'truy vấn đa hình = <code>UNION</code>; <span class="do">tuỳ chọn</span> trong JPA ⇒ không portable'],
  ], ['Chiến lược', 'Bảng', 'Được', 'Mất'], 'font-size:18px')}
${java(`@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)   // bỏ trống cũng là SINGLE_TABLE
@DiscriminatorColumn(name = "ticket_type")              // mặc định "DTYPE", kiểu STRING
abstract class MaintenanceTicket extends BaseEntity { … }
@Entity @DiscriminatorValue("CORRECTIVE") class CorrectiveTicket extends MaintenanceTicket { … }`)}
<p class="nho">Nguồn: Jakarta Persistence 3.1 §2.13 + §11.1 (giá trị mặc định); Hibernate ORM 6.6 User Guide §3.14 (TABLE_PER_CLASS dùng UNION ALL).</p>` },

  /* 17 */
  { t: 'Ba chiến lược chạy thật trên PostgreSQL', body: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
<div>${nhan('SINGLE_TABLE')}${pre(` id | ticket_type | severity | interval_days
  1 | CORRECTIVE  | HIGH     |
  2 | CORRECTIVE  | LOW      |
  3 | PREVENTIVE  |          |  30`, 'font-size:11.5px')}
<p style="font-size:16px;margin-top:6px">Lớp con thiếu cột bắt buộc ⇒ chỉ CHECK mới chặn:</p>${pre(loi('ERROR: new row … violates\n check constraint "ck_ticket_shape"'), 'font-size:11.5px')}</div>
<div>${nhan('JOINED')}${sql(`SELECT t.id, c.severity,
       p.interval_days
FROM maintenance_ticket t
LEFT JOIN corrective_ticket c
       ON c.id = t.id
LEFT JOIN preventive_ticket p
       ON p.id = t.id;`)}<p style="font-size:16px;margin-top:6px">Kết quả giống hệt bên trái, nhưng cần <b>2 JOIN</b>.</p></div>
<div>${nhan('TABLE_PER_CLASS')}${sql(`SELECT id FROM corrective_ticket
UNION ALL
SELECT id FROM preventive_ticket;`)}
<p style="font-size:16px;margin:6px 0">Hai bảng không có ràng buộc chung ⇒ id <b>trùng</b>:</p>${pre(` id | count
  1 |     2`, 'font-size:11.5px')}<p style="font-size:16px">⇒ dùng <b>một sequence chung</b> cho cả cây.</p></div></div>
${o('LabFlow: 2 loại phiếu, ít cột riêng ⇒ <b>SINGLE_TABLE + CHECK</b>. Lớp con nhiều cột bắt buộc ⇒ JOINED.', 'xanh')}` },

  /* 18 */
  { t: 'Hiện thực hoá (realization) — interface', body: `<div class="hai"><div>${soDoReal()}
${o('Interface <b>không bao giờ thành bảng</b>. Lab và Equipment vẫn là hai entity riêng; <code>Bookable</code> chỉ là hợp đồng hành vi.')}</div>
<div>${java(`interface ReservationRepository
        extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStatus(String status);
}   // không có class "implements" nào do bạn viết`)}
${pre(`count() = 3
findByStatus(CONFIRMED) =
  [Reservation[code=R1, …], Reservation[code=R3, …]]
repo is a generated proxy class: true
it implements ReservationRepository: true`, 'font-size:13.5px;margin-top:8px')}
<p class="nho" style="margin-top:6px">Output của RealizationDemo.java: tự dựng proxy bằng <code>java.lang.reflect.Proxy</code> — cùng ý tưởng Spring Data dùng để hiện thực repository lúc khởi động.</p></div></div>` },

  /* 19 */
  { t: 'Nhiều–nhiều: ba cách đúng', body: `<div class="hai"><div>${soDoNN()}</div>
<div>${bang([
    ['User — Role', 'link không dữ liệu', '<code>@ManyToMany</code> + <code>@JoinTable</code>'],
    ['Competency', '1 link/cặp, có điểm, hạn', 'association class ⇒ entity + <code>UNIQUE(user_id, module_id)</code>'],
    ['WaitlistEntry', 'cùng cặp lặp nhiều lần (khác khung giờ)', 'entity riêng, id riêng, <code>UNIQUE(user, lab, slot)</code>'],
  ], ['Ví dụ', 'Đặc điểm', 'Ánh xạ'], 'font-size:17px')}</div></div>
<div class="hai"><div>${pre(`INSERT INTO competency … (1, 1, 91, …);
${loi('ERROR: duplicate key … "uk_competency_user_module"')}
… ON CONFLICT … DO UPDATE  ->  score 91, 2027-10-01`, 'font-size:13px')}</div>
<div>${pre(`waitlist rows for (cuong, B201): 2
queue B201 Mon 08:00: [lan@…, cuong@…]`, 'font-size:13px')}</div></div>
${o('Có thuộc tính trên link ⇒ <span class="do">không dùng</span> <code>@ManyToMany</code> (bảng nối của nó không chứa được cột riêng).', 'do2')}` },

  /* 20 */
  { t: 'Liên kết có định danh (qualifier)', body: `${soDoQual()}
${cot4(
    nhan('Java') + java(`Map<String, Lab> labs;   // khoá = roomCode
Optional<Lab> lab(String roomCode) {
    return Optional.ofNullable(labs.get(roomCode));
}`),
    nhan('JPA (dáng)') + java(`@OneToMany(mappedBy = "building")
@MapKey(name = "roomCode")
private Map<String, Lab> labs;`),
    nhan('SQL') + sql(`CONSTRAINT uk_lab_building_room
  UNIQUE (building_id, room_code)`),
    nhan('Output thật') + pre(`Alpha[201] = IoT Lab
Beta[201]  = Chemistry Lab
Alpha[999] = (no lab: the 0 of 0..1)
${loi('ERROR: duplicate key … "uk_lab_building_room"')}`, 'font-size:12.5px'),
    '1.1fr 1fr')}
<p class="nho">Qualifier biến “1 toà – nhiều phòng” thành “1 toà + số phòng – <b>tối đa 1</b> phòng”: khác toà thì trùng số phòng vẫn được.</p>` },

  /* 21 */
  { t: 'Migration Flyway: V1__labflow_core.sql', body: `<div class="hai"><div>${bang([
    ['Tên file', '<code>V&lt;số&gt;__&lt;mô tả&gt;.sql</code> (hai dấu _)'],
    ['Thư mục mặc định', '<code>classpath:db/migration</code>'],
    ['Hibernate', '<code>ddl-auto=validate</code>: chỉ so, không sửa bảng'],
    ['Đã chạy rồi', '<span class="do">không sửa</span> — viết V2 tiến lên'],
  ], ['Quy ước', 'Giá trị'], 'font-size:18px')}
${sql(`-- V2__lab_capacity_limit.sql
ALTER TABLE lab DROP CONSTRAINT lab_capacity_check;
ALTER TABLE lab ADD CONSTRAINT ck_lab_capacity
  CHECK (capacity BETWEEN 1 AND 200);`)}</div>
<div>${pre(`Migrating schema "swd_cs2" to version "1 - labflow core"
Successfully applied 1 migration to schema
 "swd_cs2", now at version v1

<b>— sửa một dòng trong V1 rồi chạy lại —</b>
${loi('ERROR: Validate failed: Migrations have failed validation')}
${loi('Migration checksum mismatch for migration version 1')}
${loi('-> Applied to database : 116843951')}
${loi('-> Resolved locally    : 1119840071')}

<b>— thêm V2 —</b>
Successfully applied 1 migration to schema
 "swd_cs2", now at version v2`, 'font-size:12.5px')}
<p class="nho" style="margin-top:6px">Flyway OSS 10.22 chạy thật trên PostgreSQL 16.</p></div></div>` },

  /* 22 */
  { t: 'Vẽ ngược: từ code ra class diagram', body: `<div class="hai"><div>
<ul style="font-size:20px"><li><b>IntelliJ IDEA</b>: chuột phải package → <b>Diagrams → Show Diagram</b> (<code>Ctrl+Alt+Shift+U</code>) → <i>Java Class Diagram</i></li>
<li><b>PlantUML</b>: sinh văn bản từ code (plugin, hoặc tự viết bằng reflection như bên phải) rồi dựng ảnh</li></ul>
${bang([
    ['trường <code>@ManyToOne</code> + <code>@OneToMany(mappedBy)</code>', 'đường liền, hai chiều'],
    ['chỉ <code>@ManyToOne</code>', 'mũi tên một chiều'],
    ['<code>orphanRemoval = true</code>', '◆'],
    ['<code>optional = false</code> / mặc định', '1 / 0..1'],
  ], ['Code nói gì', 'Sơ đồ vẽ gì'], 'font-size:17px')}</div>
<div>${pre(`Lab "0..1" -- "0..*" Equipment
Reservation "0..*" --> "1" AppUser
Reservation "0..*" --> "1" Lab
Reservation "1" *-- "0..*" ReservationItem
ReservationItem "0..*" --> "1" Equipment`, 'font-size:13px')}
${o('Code <b>không nói</b> được: ◇ hay liên kết thường (Lab–Equipment ra đường trơn), tên liên kết, ý đồ nghiệp vụ. Vẽ ngược xong <b>phải sửa tay</b> rồi mới đưa vào Report 4.', 'do2')}</div></div>` },

  /* 23 */
  { t: 'Lỗi hay gặp trong class diagram Report 4', body: `${bang([
    ['1', 'Vẽ đủ getter/setter', 'chỉ thao tác có nghĩa nghiệp vụ: <code>cancel()</code>, <code>addItem()</code>'],
    ['2', 'Khoá ngoại thành thuộc tính: <code>labId : int</code>', 'vẽ <b>liên kết</b> tới Lab; cột chỉ có ở Database Design'],
    ['3', 'Kiểu sai: <code>start : String</code>', '<code>LocalDateTime</code>, enum cho trạng thái'],
    ['4', 'Nhầm ◇/◆ (Reservation ◇ Item)', 'hỏi vòng đời: xoá cha, con còn không?'],
    ['5', 'Bội số sai/thiếu: Lab 1 — 1 Reservation', 'đọc thành câu: “một lab có <b>nhiều</b> lượt đặt”'],
    ['6', 'Không hướng, không tên đầu mút', 'mũi tên theo trường thật trong code; role name = tên trường'],
    ['7', '<code>@ManyToMany</code> mà link có <code>quantity</code>', 'tách entity trung gian (ReservationItem)'],
  ], ['#', 'Lỗi', 'Sửa'], 'font-size:18px')}
${o('Kiểm chéo: sơ đồ Report 4 ⇔ code entity ⇔ bảng ở mục Database Design ⇔ file migration. Hội đồng hỏi một quan hệ thì cả bốn phải nói cùng một điều.', 'xanh')}` },

  /* 24 */
  { t: 'Bảng tra một trang', body: `${bang([
    ['Có hướng *→1', 'trường <code>Lab lab</code>', '<code>@ManyToOne</code> (EAGER mặc định)', 'FK ở bảng “nhiều”'],
    ['Hai chiều 1—*', '+ <code>List</code> + helper', '<code>@OneToMany(mappedBy)</code> (LAZY)', 'vẫn một FK'],
    ['◇ kết tập', 'gỡ tham chiếu khi xoá', 'không cascade REMOVE', 'FK NULL, <code>SET NULL</code>'],
    ['◆ hợp thành', 'cha tạo/xoá con', '<code>cascade = ALL, orphanRemoval</code>', 'FK NOT NULL, <code>CASCADE</code>'],
    ['Phụ thuộc', 'tham số / biến cục bộ', '—', '—'],
    ['Tổng quát hoá', '<code>extends</code>, đa hình', '<code>@Inheritance</code> (SINGLE_TABLE)', '1 / 2+ / n bảng'],
    ['Hiện thực hoá', '<code>implements</code>', '— (repository: proxy)', '—'],
    ['N–N / association class', 'Set / entity trung gian', '<code>@ManyToMany</code> / 2 × <code>@ManyToOne</code>', 'bảng nối / + UNIQUE'],
    ['Qualifier', '<code>Map&lt;K, V&gt;</code>', '<code>@MapKey</code>', 'UNIQUE (cha, khoá)'],
  ], ['UML', 'Java', 'JPA', 'PostgreSQL'], 'font-size:17px')}
<p class="nho">Học tiếp: bài 2.D–2.H (ký hiệu), 3.I (ánh xạ Gomaa), khoá Software Architecture 7.2 (aggregate) + 7.5 (bẫy JPA, khoá lạc quan).</p>` },
]);
