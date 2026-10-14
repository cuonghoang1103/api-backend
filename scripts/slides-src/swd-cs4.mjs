/**
 * swd-cs4.mjs — SWD392 ⭐ Chuyên sâu 4: TỪ COMET TỚI SPRING BOOT (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/swd-cs4.mjs --out <dir>
 *
 * Mọi output/số đo trên slide lấy từ chương trình CHẠY THẬT:
 * flm-nguon/_repo/SWD392/gen/java/cs4/{DiByHand,MiniContainer,CouplingMetrics,LayerRules,ReservationSlice}.java (javac --release 17).
 * Nguồn công thức: Martin — Ca/Ce/I (OO Design Quality Metrics 1994; Agile Software Development 2002; Clean Architecture
 * Ch.14 gọi Fan-in/Fan-out); Chidamber & Kemerer — LCOM (IEEE TSE 1994); Henderson-Sellers — LCOM* (1996);
 * luật nối robustness — Jacobson (Objectory) + Rosenberg (ICONIX); Gomaa §8.3, §12.3.1, §15.5.2 (layers of abstraction).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs4', code: 'CS4', title: 'Từ COMET tới Spring Boot', sub: 'SWD392 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:15.5px/1.42 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const ma = (src, st = '') => code(src, 'java', st ? '' : 'sm').replace('<pre class="vs', `<pre style="${st}" class="vs`);
const lnk = (t) => `<span style="display:inline-block;background:#fff4e6;border:1.5px solid #e8a15a;border-radius:6px;padding:1px 8px;font-size:18px;color:#b85a2b;font-weight:700">${t}</span>`;

/* ───────────── ký hiệu robustness (SVG) ───────────── */
const C = { line: '#595959', fill: '#fff7ef', stroke: '#b85a2b' };
const actor = (x, y, t) => `<g stroke="${C.line}" stroke-width="2.2" fill="none"><circle cx="${x}" cy="${y - 26}" r="10"/><line x1="${x}" y1="${y - 16}" x2="${x}" y2="${y + 8}"/><line x1="${x - 15}" y1="${y - 6}" x2="${x + 15}" y2="${y - 6}"/><line x1="${x}" y1="${y + 8}" x2="${x - 12}" y2="${y + 26}"/><line x1="${x}" y1="${y + 8}" x2="${x + 12}" y2="${y + 26}"/></g><text x="${x}" y="${y + 46}" text-anchor="middle" font-size="15" fill="#262626">${t}</text>`;
const lab = (x, y, t) => t.split('|').map((s, i) => `<text x="${x}" y="${y + 40 + i * 17}" text-anchor="middle" font-size="15" fill="#262626">${s}</text>`).join('');
const boundary = (x, y, t) => `<g stroke="${C.stroke}" stroke-width="2.2" fill="${C.fill}"><line x1="${x - 30}" y1="${y - 20}" x2="${x - 30}" y2="${y + 20}"/><line x1="${x - 30}" y1="${y}" x2="${x - 20}" y2="${y}"/><circle cx="${x}" cy="${y}" r="20"/></g>${lab(x, y, t)}`;
const control = (x, y, t) => `<g stroke="${C.stroke}" stroke-width="2.2" fill="${C.fill}"><circle cx="${x}" cy="${y}" r="20"/><polyline points="${x + 4},${y - 27} ${x - 3},${y - 20} ${x + 4},${y - 13}" fill="none"/></g>${lab(x, y, t)}`;
const entity = (x, y, t) => `<g stroke="${C.stroke}" stroke-width="2.2" fill="${C.fill}"><circle cx="${x}" cy="${y}" r="20"/><line x1="${x - 20}" y1="${y + 22}" x2="${x + 20}" y2="${y + 22}"/></g>${lab(x, y + 4, t)}`;
const ln = (x1, y1, x2, y2, red = false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${red ? '#e02020' : C.line}" stroke-width="2"${red ? ' stroke-dasharray="7 5"' : ''}/>`;

function robustness() {
  const cong = (x1, y1, cx, cy, x2, y2) => `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${C.line}" stroke-width="2"/>`;
  let s = '';
  s += actor(60, 230, 'Student');
  s += boundary(220, 230, 'Reservation|Wizard (UI)');
  s += control(450, 120, 'Validate|Request');
  s += control(450, 250, 'Check|Availability');
  s += control(450, 380, 'Create|Reservation');
  s += entity(720, 120, 'Lab');
  s += entity(720, 315, 'Reservation');
  s += control(900, 380, 'Notify|Manager');
  s += boundary(1025, 380, 'Email|Proxy');
  s += actor(1092, 380, 'Mail server');
  s += ln(80, 226, 188, 230) + ln(242, 220, 430, 128) + ln(242, 230, 430, 250) + ln(242, 240, 430, 372);
  s += ln(470, 120, 700, 120) + ln(470, 256, 700, 310) + ln(470, 374, 700, 322);
  s += ln(470, 380, 880, 380) + ln(920, 380, 993, 380) + ln(1047, 380, 1075, 380);
  s += cong(468, 128, 525, 185, 468, 243) + cong(468, 258, 525, 315, 468, 373);
  // vi phạm minh hoạ: boundary nối thẳng entity (đi vòng dưới cho khỏi đè chữ)
  s += `<polyline points="190,250 175,262 175,455 800,455 800,330 743,318" fill="none" stroke="#e02020" stroke-width="2" stroke-dasharray="7 5"/>`;
  s += `<text x="240" y="478" font-size="15" fill="#e02020" font-weight="700">✗ Wizard → Reservation: boundary nối thẳng entity</text>`;
  return `<svg viewBox="0 75 1150 415" width="100%" style="max-height:415px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── package (SVG) ───────────── */
function pkg(x, y, w, h, ten, ds, mau = '#b85a2b', nen = '#fff') {
  let s = `<rect x="${x}" y="${y}" width="${Math.min(120, w * 0.55)}" height="20" fill="${nen}" stroke="${mau}" stroke-width="2"/>`;
  s += `<rect x="${x}" y="${y + 20}" width="${w}" height="${h}" fill="${nen}" stroke="${mau}" stroke-width="2"/>`;
  s += `<text x="${x + 8}" y="${y + 15}" font-size="14" font-weight="700" fill="${mau}">${ten}</text>`;
  ds.forEach((d, i) => { s += `<text x="${x + 10}" y="${y + 44 + i * 19}" font-size="14.5" fill="#262626">${d}</text>`; });
  return s;
}
const dep = (x1, y1, x2, y2, red = false) => {
  const m = red ? '#e02020' : '#595959';
  const ang = Math.atan2(y2 - y1, x2 - x1), a1 = ang + 0.42, a2 = ang - 0.42;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="2" stroke-dasharray="7 5"/>` +
    `<polyline points="${x2 - 13 * Math.cos(a1)},${y2 - 13 * Math.sin(a1)} ${x2},${y2} ${x2 - 13 * Math.cos(a2)},${y2 - 13 * Math.sin(a2)}" fill="none" stroke="${m}" stroke-width="2"/>`;
};

function goiTheoTang() {
  let s = '';
  s += pkg(10, 10, 230, 80, 'controller', ['ReservationController', 'WaitlistController', 'LabController']);
  s += pkg(10, 135, 230, 80, 'service', ['ReservationService', 'WaitlistService', 'LabService']);
  s += pkg(10, 260, 230, 80, 'repository', ['ReservationRepository', 'WaitlistRepository', 'LabRepository']);
  s += pkg(280, 135, 150, 80, 'entity', ['Reservation', 'WaitlistEntry', 'Lab']);
  s += dep(125, 112, 125, 133) + dep(125, 237, 125, 258) + dep(242, 175, 278, 175) + dep(242, 300, 330, 238);
  return `<svg viewBox="0 0 440 365" width="100%" style="max-height:330px" font-family="Arial, sans-serif">${s}</svg>`;
}
function goiTheoTinhNang() {
  let s = '';
  s += pkg(10, 10, 240, 125, 'reservation', ['ReservationController', 'ReservationService', 'ReservationRepository', 'Reservation', 'dto/ …']);
  s += pkg(285, 10, 220, 105, 'waitlist', ['WaitlistController', 'WaitlistService', 'WaitlistRepository', 'WaitlistEntry']);
  s += pkg(10, 200, 240, 105, 'catalog', ['LabController', 'LabService (public API)', 'LabRepository', 'Lab']);
  s += pkg(285, 200, 220, 70, 'common', ['TimeRange, ApiError', 'SecurityConfig']);
  s += dep(285, 80, 252, 80) + dep(130, 157, 130, 198) + dep(252, 250, 283, 245) + dep(395, 137, 395, 198);
  return `<svg viewBox="0 0 515 330" width="100%" style="max-height:330px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── đồ thị gói đo được (SVG) ───────────── */
function doThiGoi() {
  const n = (x, y, ten, sub, I) => `<rect x="${x}" y="${y}" width="170" height="62" rx="10" fill="#fff7ef" stroke="#b85a2b" stroke-width="2"/>` +
    `<text x="${x + 85}" y="${y + 25}" text-anchor="middle" font-size="18" font-weight="700" fill="#262626">${ten}</text>` +
    `<text x="${x + 85}" y="${y + 48}" text-anchor="middle" font-size="14.5" fill="#666">${sub} · I=${I}</text>`;
  let s = '';
  s += n(10, 10, 'waitlist', '4 lớp', '1.00');
  s += n(250, 10, 'reservation', '6 lớp', '0.80');
  s += n(10, 170, 'notification', '2 lớp', '0.00');
  s += n(250, 170, 'catalog', '4 lớp', '0.20');
  s += n(490, 170, 'common', '3 lớp', '0.00');
  s += dep(182, 41, 248, 41) + dep(95, 74, 95, 168) + dep(160, 74, 285, 168) + dep(300, 74, 160, 168);
  s += dep(335, 74, 335, 168) + dep(400, 74, 520, 168) + dep(422, 201, 488, 201) + dep(180, 66, 500, 168);
  s += `<text x="640" y="40" font-size="15" fill="#666">mũi tên nét đứt = phụ thuộc</text><text x="640" y="62" font-size="15" fill="#666">(gói ở đầu mũi tên được dùng)</text>`;
  return `<svg viewBox="0 0 860 240" width="100%" style="max-height:235px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── tầng (HTML) ───────────── */
const tang = (ten, y, mau = '#e08a1e', nen = '#fff7ef') => `<div style="border:2px solid ${mau};background:${nen};border-radius:9px;padding:6px 12px;text-align:center"><div style="font-size:20px;font-weight:700;color:#262626">${ten}</div><div style="font-size:16px;color:#666">${y}</div></div>`;
const xuong = `<div style="text-align:center;color:#e08a1e;font-size:20px;line-height:1">▼</div>`;

/* ───────────── sequence nhỏ (SVG) ───────────── */
function seqNho() {
  const L = [['Wizard', 50], ['Controller', 175], ['Service', 300], ['Reservation', 425], ['Repository', 555]];
  let s = '';
  L.forEach(([t, x]) => {
    s += `<rect x="${x - 52}" y="4" width="104" height="28" rx="5" fill="#fff7ef" stroke="#b85a2b" stroke-width="1.8"/><text x="${x}" y="23" text-anchor="middle" font-size="13.5" font-weight="700" fill="#262626">${t}</text>`;
    s += `<line x1="${x}" y1="32" x2="${x}" y2="312" stroke="#999" stroke-dasharray="4 4"/>`;
  });
  const msg = (x1, x2, y, t, ve = false) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#333" stroke-width="1.6"${ve ? ' stroke-dasharray="5 4"' : ''}/>` +
    `<polyline points="${x2 + (x2 > x1 ? -9 : 9)},${y - 5} ${x2},${y} ${x2 + (x2 > x1 ? -9 : 9)},${y + 5}" fill="none" stroke="#333" stroke-width="1.6"/>` +
    `<text x="${(x1 + x2) / 2}" y="${y - 6}" text-anchor="middle" font-size="12.5" fill="#262626">${t}</text>`;
  s += msg(50, 175, 60, 'POST /reservations');
  s += msg(175, 300, 88, 'create(lab, range)');
  s += msg(300, 555, 116, 'existsActiveOverlap');
  s += `<rect x="96" y="128" width="510" height="182" fill="none" stroke="#b85a2b" stroke-width="1.5"/><text x="102" y="143" font-size="12.5" font-weight="700" fill="#b85a2b">alt</text><text x="132" y="143" font-size="12.5" fill="#666">[no overlap]</text>`;
  s += msg(300, 425, 164, 'new + submit()');
  s += msg(300, 555, 188, 'save(r)');
  s += msg(300, 175, 212, 'Reservation', true);
  s += msg(175, 50, 236, '201 Created', true);
  s += `<line x1="96" y1="248" x2="606" y2="248" stroke="#b85a2b" stroke-width="1.3" stroke-dasharray="6 4"/><text x="102" y="262" font-size="12.5" fill="#666">[overlap]</text>`;
  s += msg(300, 175, 278, 'ConflictException', true);
  s += msg(175, 50, 302, '409 SM-12', true);
  return `<svg viewBox="0 0 610 316" width="100%" style="max-height:316px" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('TỪ COMET TỚI SPRING BOOT', [
  /* 1 */
  { cover: true, t: 'Từ COMET tới Spring Boot', sub: 'boundary · control · entity → @RestController · @Service · @Entity<br>robustness · phân tầng · package · DI tự viết tay<br>coupling &amp; cohesion đo bằng số · kiểm luật tầng tự động — mọi kết quả chạy thật' },

  /* 2 */
  { t: 'Deck này nối gì với gì', body: `<div style="display:flex;gap:10px;align-items:stretch">
${['Use case<br><span class="nho">Ch.2 (2.A–2.C)</span>', 'Lớp phân tích B/C/E<br><span class="nho">Ch.2 (2.I–2.M)</span>', 'Sequence · statechart<br><span class="nho">Ch.2 (2.N–2.U)</span>', 'Kiến trúc · subsystem<br><span class="nho">Ch.3</span>', '<b class="do">Code Spring Boot</b><br><span class="nho">deck này</span>'].map((t, i) => `<div style="flex:1;border:2px solid ${i === 4 ? '#c0392b' : '#e08a1e'};border-radius:10px;background:${i === 4 ? '#fdf0ee' : '#fff7ef'};padding:10px 8px;text-align:center;font-size:20px">${t}</div>`).join('<div style="align-self:center;color:#e08a1e;font-size:26px">➜</div>')}</div>
${bang([
    ['3–4', 'Bảng ánh xạ stereotype COMET → thành phần Spring, và chỗ <b>không</b> khớp 1-1'],
    ['5–10', 'Robustness analysis → phân tầng → luật phụ thuộc → package diagram'],
    ['11–14', 'IoC/DI: tự viết một container tí hon rồi so với Spring'],
    ['15–20', 'Đo coupling/cohesion bằng số (I, LCOM) + kiểm luật tầng tự động'],
    ['21–24', 'Lát cắt Reservation từ use case tới code · clean/hexagonal · tóm tắt'],
  ], ['Slide', 'Nội dung'], 'font-size:19px')}
${o(`<b>Không dạy lại</b>: SOLID &amp; GoF đã ở Chương 4 (bài 4.A–4.F) · clean/hexagonal, DDD ở khoá ${lnk('software-architecture')} Ch.5–7.`)}` },

  /* 3 */
  { t: 'Ánh xạ stereotype COMET → Spring Boot', body: `${bang([
    ['«boundary» user interaction', 'trang React (ngoài backend)', '<code>@RestController</code> + DTO = cửa vào HTTP của backend'],
    ['«boundary» proxy (hệ ngoài)', 'gửi mail, gọi AI', 'lớp client <code>@Component</code> bọc <code>RestClient</code>/SMTP'],
    ['«boundary» device I/O', 'cảm biến IoT qua MQTT', 'handler nhận tin MQTT (<code>@Component</code>)'],
    ['«control» coordinator', 'điều phối một use case', 'phương thức <code>@Service</code> + <code>@Transactional</code>'],
    ['«state dependent control»', 'vòng đời Reservation', 'enum + phương thức trong <code>@Entity</code> (hoặc lớp state machine, Gomaa §14.5)'],
    ['«control» timer', 'job quét no-show định kỳ', '<code>@Scheduled</code> (bật bằng <code>@EnableScheduling</code>)'],
    ['«business logic» / «algorithm»', 'luật đặt phòng BR-xx', 'lớp policy/validator, gọi từ service'],
    ['«entity»', 'Reservation, Lab', '<code>@Entity</code> (JPA) <b>+</b> <code>Repository</code> (≈ database wrapper, Gomaa §15.6)'],
  ], ['COMET (Gomaa §8.3)', 'Ví dụ LabFlow', 'Thành phần Spring Boot'], 'font-size:17.5px')}
<p class="nho">Bảng là <b>điểm xuất phát</b> hay dùng, không phải luật của Spring hay của Gomaa — slide 4 nói chỗ nó gãy.</p>` },

  /* 4 */
  { t: 'Chỗ KHÔNG khớp 1-1', body: `<ol style="font-size:21px;gap:9px">
<li><b>Boundary bị tách đôi</b>: UI thật nằm ở React; <code>@RestController</code> là boundary <i>của backend</i>, không phải màn hình.</li>
<li><b>Một control → hai lớp</b>: controller (đọc HTTP, kiểm DTO) + service (transaction, điều phối).</li>
<li><b>Entity → hai lớp</b>: <code>@Entity</code> giữ dữ liệu; <code>Repository</code> lo lưu/đọc — COMET phân tích không có ô cho nó.</li>
<li><b class="do">State dependent control mất trạng thái</b>: bean Spring là singleton dùng chung mọi request ⇒ phải <b>không trạng thái</b>; trạng thái nằm ở cột <code>status</code> trong CSDL.</li>
<li><b>Có lớp không stereotype nào</b>: DTO, mapper, cấu hình, <code>@RestControllerAdvice</code>, bộ lọc bảo mật.</li>
<li><b>Timer nhân bản</b>: chạy 2 bản ứng dụng ⇒ <code>@Scheduled</code> chạy 2 lần (cần khoá kiểu ShedLock).</li>
</ol>
${o('Trong Report 4: vẽ <b>class diagram thiết kế</b> theo tên lớp Spring thật, nhưng giữ stereotype COMET trong phần phân tích để hội đồng thấy đường đi từ UC tới code.', 'xanh')}` },

  /* 5 */
  { t: 'Robustness analysis: bốn luật nối', body: `<div class="hai"><div>${bang([
    ['Actor', '—', '✔', '—', '—'],
    ['Boundary', '✔', '—', '✔', '—'],
    ['Control', '—', '✔', '✔', '✔'],
    ['Entity', '—', '—', '✔', '—'],
  ], ['nối được với →', 'Actor', 'Boundary', 'Control', 'Entity'], 'font-size:20px;text-align:center')}
<p class="nho" style="margin-top:8px">Ma trận theo Rosenberg (ICONIX). Ý tưởng boundary/control/entity: Ivar Jacobson (Objectory → OOSE).</p></div>
<ul style="font-size:21px">
<li>Robustness diagram = <b>ảnh đối tượng của MỘT use case</b>, vẽ trước sequence.</li>
<li>Boundary, entity là <b>danh từ</b>; control là <b>động từ</b> ⇒ danh từ không nói thẳng với danh từ.</li>
<li>Không phải sơ đồ UML chuẩn — chỉ là communication diagram dùng ba stereotype.</li>
<li>Lợi ích: soát use case thiếu bước, và đã là <b class="do">bản nháp phân tầng</b>.</li>
</ul></div>
${o('Gomaa không dùng chữ "robustness", nhưng các bước Ch.8–9 (tìm đối tượng B/C/E từ use case rồi vẽ communication diagram) là cùng một việc.')}` },

  /* 6 */
  { t: 'Robustness diagram — use case Đặt phòng lab', body: `${robustness()}
<p style="font-size:20px">Đọc theo luật: Student chỉ chạm <b>Wizard</b>; mọi đường tới <b>Lab</b>, <b>Reservation</b> đi qua control; Mail server (hệ ngoài) chỉ chạm <b>Email Proxy</b>. Đường đỏ <span class="do">Wizard → Reservation</span> vi phạm: màn hình tự ghi CSDL.</p>` },

  /* 7 */
  { t: 'Từ robustness tới phân tầng', body: `<div class="hai"><div>
<p style="font-size:20px;margin-bottom:6px"><b>Gomaa §15.5.2</b> — Banking Service theo <i>layers of abstraction</i>:</p>
${tang('Coordinator (façade)', 'nhận yêu cầu của client')}${xuong}${tang('Business logic objects', 'luật nghiệp vụ')}${xuong}${tang('Database wrapper objects', 'che cách truy cập CSDL')}${xuong}${tang('Relational database', '', '#999', '#f5f5f5')}
</div><div>
<p style="font-size:20px;margin-bottom:6px"><b>Spring Boot</b> — cùng hình dáng:</p>
${tang('@RestController', 'boundary của backend', '#2f7d4f', '#f1f9f4')}${xuong}${tang('@Service (+ policy)', 'coordinator · business logic', '#2f7d4f', '#f1f9f4')}${xuong}${tang('Repository + @Entity', 'database wrapper · entity', '#2f7d4f', '#f1f9f4')}${xuong}${tang('PostgreSQL', '', '#999', '#f5f5f5')}
</div></div>
<p style="font-size:20px"><b>Strict</b> (chặt): tầng chỉ gọi tầng <b>ngay dưới</b>. <b>Flexible</b> (lỏng): được nhảy tầng (Gomaa §12.3.1). Dự án Spring thường chọn <span class="do">chặt giữa controller và repository</span>.</p>` },

  /* 8 */
  { t: 'Luật phụ thuộc giữa các tầng', body: `${bang([
    ['controller → service', '✔', 'đường chính'],
    ['service → repository, entity', '✔', 'service sở hữu transaction'],
    ['controller → repository', '<span class="do">✗</span>', 'bỏ qua luật nghiệp vụ, transaction, kiểm quyền'],
    ['service → controller / DTO web', '<span class="do">✗</span>', 'tầng dưới không biết tầng trên (đảo phụ thuộc)'],
    ['entity → service / repository', '<span class="do">✗</span>', 'entity phải chạy được không cần Spring'],
    ['module A → repository của module B', '<span class="do">✗</span>', 'chỉ gọi <b>service</b> công khai của B'],
    ['mọi tầng → common (TimeRange, lỗi)', '✔', 'gói ổn định, ít đổi'],
  ], ['Phụ thuộc', 'Được?', 'Vì sao'], 'font-size:19.5px')}
${o('Luật viết trên giấy sẽ bị phá vào tuần nộp bài. Slide 20: biến luật thành <b>bài kiểm tự động</b>, build đỏ khi có người vi phạm.', 'do2')}` },

  /* 9 */
  { t: 'Package-by-layer hay package-by-feature', body: `<div class="hai"><div style="text-align:center"><b style="font-size:21px">Theo tầng (by layer)</b>${goiTheoTang()}</div>
<div style="text-align:center"><b style="font-size:21px">Theo tính năng (by feature)</b>${goiTheoTinhNang()}</div></div>
<p style="font-size:20px">Mũi tên nét đứt = phụ thuộc (UML dependency). Bên trái: mọi tính năng trộn trong 4 gói. Bên phải: mỗi gói là một <b>module</b>, bên trong vẫn có controller/service/repository.</p>` },

  /* 10 */
  { t: 'Chia gói cho LabFlow', body: `${bang([
    ['Sửa một tính năng', 'chạm 4 gói', 'chạm 1 gói'],
    ['Ẩn lớp nội bộ', 'khó: lớp nào cũng phải <code>public</code>', 'được: lớp không public ở trong gói'],
    ['Dễ học lúc đầu', '<b>dễ</b> (giống mọi tutorial)', 'cần quy ước "API công khai"'],
    ['Tách thành service sau này', 'phải gom lại từ 4 gói', 'gói đã gần là một service'],
    ['Report 4 – package diagram', 'sơ đồ ít nói lên nghiệp vụ', 'sơ đồ = bản đồ tính năng'],
  ], ['Tiêu chí', 'By layer', 'By feature'], 'font-size:19.5px')}
<div class="hai">${o('<b>LabFlow</b> (SDS 1.2): <code>com.labflow.reservation</code>, <code>.waitlist</code>, <code>.catalog</code>, … — <b>by feature</b>; bên trong mỗi gói: controller · service · repository · entity · dto.', 'xanh')}
${o('Luật nối module: <code>waitlist</code> gọi <code>ReservationService</code>, <span class="do">không</span> gọi <code>ReservationRepository</code>. Đây chính là <i>modular monolith</i> (khoá kiến trúc 3.2).')}</div>` },

  /* 11 */
  { t: 'IoC và DI: ai gọi new?', body: `<div class="hai"><div>
<p style="font-size:19px;margin-bottom:4px"><b class="do">Trước</b> — service tự <code>new</code>:</p>
${ma(`class HardWiredReservationService {
  private final PostgresReservationRepository repo
      = new PostgresReservationRepository();
  String book(String lab) {
    LocalDateTime now = LocalDateTime.now();
    ...`)}
<p style="font-size:19px;margin:8px 0 4px"><b style="color:#2f7d4f">Sau</b> — nhận qua constructor:</p>
${ma(`ReservationService(ReservationRepository repo,
                   Clock clock) { ... }`)}</div>
<div>
<p style="font-size:19px;margin-bottom:4px">main = <b>composition root</b>, chạy thật:</p>
${out(`hard-wired: no database on this machine
booked LAB-A1 at 9h
rejected LAB-A1: lab closed at 23h
rows in repository: [LAB-A1 @ 9h]`)}
<ul style="font-size:19px;margin-top:10px">
<li><b>IoC</b>: lớp không tự đi tìm cộng sự, ai đó đưa vào.</li>
<li><b>DI</b> (Fowler, 01/2004): cách làm IoC bằng constructor/setter.</li>
<li>Đồng hồ giả 9h / 23h ⇒ test được luật giờ mở cửa.</li>
</ul></div></div>` },

  /* 12 */
  { t: 'Container tí hon: bốn việc phải làm', body: `<div class="hai"><div>
<ol style="font-size:20px;gap:7px">
<li><b>Tra bảng bind</b>: interface → lớp cài.</li>
<li><b>Singleton</b>: đã tạo rồi thì trả lại đúng đối tượng đó.</li>
<li><b>Phát hiện vòng</b>: lớp đang tạo dở mà lại được đòi ⇒ báo đường vòng.</li>
<li><b>Reflection</b>: đọc kiểu tham số của constructor duy nhất, giải đệ quy, gọi <code>newInstance</code>.</li>
</ol>
${o('Toàn bộ khoảng 50 dòng Java, không thư viện. Đủ để hiểu Spring đang làm gì lúc khởi động.', 'xanh')}</div>
${ma(`Object done = singletons.get(impl);
if (done != null) return type.cast(done);
if (creating.contains(impl))
  throw new IllegalStateException(
    "circular dependency: " + path(impl));
Constructor<?>[] ctors =
    impl.getDeclaredConstructors();
creating.add(impl);
Class<?>[] need = ctors[0].getParameterTypes();
Object[] args = new Object[need.length];
for (int i = 0; i < need.length; i++)
  args[i] = get(need[i]);       // đệ quy
Object obj = ctors[0].newInstance(args);
singletons.put(impl, obj);`, 'font-size:15.5px;line-height:1.42;padding:10px 14px')}</div>` },

  /* 13 */
  { t: 'Container tí hon chạy thật', body: `<div class="hai">${out(`1) wiring the LabFlow reservation module
  created JpaReservationRepository
  created ReservationPolicy
  created ReservationService <- ReservationRepository,
                                ReservationPolicy
  created ReservationController <- ReservationService
  created ReportController <- ReservationService
  same ReservationService in both controllers? true
2) forgetting a binding
  ERROR no implementation bound for ReservationRepository
3) a constructor cycle
  ERROR circular dependency:
        BookingService -> WaitlistService -> BookingService
4) cycle broken by extracting SlotAvailability
  created JpaReservationRepository
  created SlotAvailability <- ReservationRepository
  created WaitlistService2 <- SlotAvailability
  created BookingService2 <- WaitlistService2, ...`, 'font-size:14.5px')}
<ul style="font-size:19.5px">
<li>Tạo <b>từ lá lên gốc</b>: repository trước, controller sau.</li>
<li>Hai controller nhận <b>cùng một</b> service ⇒ singleton.</li>
<li>Quên bind ⇒ lỗi lúc <b>khởi động</b>, không phải lúc người dùng bấm.</li>
<li>Vòng constructor <b>không thể</b> tạo được — sửa bằng cách <b>tách lớp</b> (đúng thứ waitlist cần), không phải bằng mẹo.</li>
</ul></div>` },

  /* 14 */
  { t: 'Spring container làm gì thêm', body: `${bang([
    ['Tìm bean', 'tự <code>bind</code> bằng tay', 'quét <code>@Component</code>/<code>@Service</code>/<code>@Repository</code>/<code>@Controller</code>; <code>@Bean</code>'],
    ['Nhiều ứng viên', 'không xử lý', '<code>@Primary</code>, <code>@Qualifier</code>; inject <code>List&lt;T&gt;</code>'],
    ['Phạm vi', 'chỉ singleton', 'singleton (mặc định), prototype, request, session…'],
    ['Vòng đời', 'không', '<code>@PostConstruct</code>/<code>@PreDestroy</code>, <code>BeanPostProcessor</code>'],
    ['Proxy', 'không', 'AOP: <code>@Transactional</code>, <code>@Async</code> bọc bean bằng proxy'],
    ['Cấu hình', 'không', '<code>@Value</code>, <code>@ConfigurationProperties</code>; Boot auto-configuration'],
    ['Vòng phụ thuộc', 'báo lỗi', '<code>BeanCurrentlyInCreationException</code>; từ Boot 2.6 cấm vòng mặc định'],
    ['@Repository', '—', 'dịch exception của JPA sang <code>DataAccessException</code>'],
  ], ['Việc', 'Container tí hon', 'Spring'], 'font-size:17.5px')}
<p class="nho">Lớp chỉ có một constructor thì không cần <code>@Autowired</code> (tài liệu Spring). Tài liệu Spring khuyên dùng tiêm qua constructor cho phụ thuộc bắt buộc.</p>` },

  /* 15 */
  { t: 'Đo coupling: fan-in, fan-out, Ca, Ce, I', body: `<div class="hai"><div>
<p style="font-size:21px"><b>Mức lớp</b></p>
<ul style="font-size:20px"><li><b>fan-out</b> = số lớp khác mà lớp này dùng</li><li><b>fan-in</b> = số lớp dùng lớp này</li></ul>
<p class="nho">Gốc: Henry &amp; Kafura (1981), đo luồng thông tin giữa thủ tục.</p>
<p style="font-size:21px;margin-top:10px"><b>Mức gói</b> — Robert C. Martin (1994)</p>
<ul style="font-size:20px"><li><b>Ca</b> (afferent): số lớp <b>ngoài</b> gói phụ thuộc vào lớp trong gói</li><li><b>Ce</b> (efferent): số lớp <b>trong</b> gói phụ thuộc vào lớp ngoài gói</li></ul></div>
<div>
<div style="text-align:center;font-size:30px;background:#fff7ef;border:2px solid #e08a1e;border-radius:10px;padding:10px">I = Ce / (Ca + Ce)</div>
<ul style="font-size:20px;margin-top:10px">
<li>I = 0: ổn định nhất (nhiều người dựa vào, không dựa ai)</li>
<li>I = 1: bất ổn nhất (dựa nhiều, không ai dựa)</li>
<li><b>A</b> = lớp trừu tượng / tổng lớp; <b>D</b> = |A + I − 1|</li>
<li><b>SDP</b>: chỉ phụ thuộc vào gói có I <b>nhỏ hơn</b> mình</li>
</ul></div></div>
${o('Clean Architecture (2017, Ch.14) gọi Ca/Ce là fan-in/fan-out <b>của component</b>. Công cụ khác nhau có thể đếm khác (đếm lớp bị dùng thay vì lớp đi dùng) ⇒ ghi rõ cách đếm khi báo số.')}` },

  /* 16 */
  { t: 'Đo cohesion: LCOM của CK và Henderson-Sellers', body: `<div class="hai"><div>
<p style="font-size:21px"><b>Chidamber &amp; Kemerer (IEEE TSE, 1994)</b></p>
<ul style="font-size:19.5px"><li>Xét mọi <b>cặp</b> method</li><li><b>P</b> = số cặp không dùng chung trường nào</li><li><b>Q</b> = số cặp dùng chung ít nhất một trường</li></ul>
<div style="text-align:center;font-size:23px;background:#fff7ef;border:2px solid #e08a1e;border-radius:10px;padding:8px;margin-top:8px">LCOM = P − Q nếu P &gt; Q, ngược lại 0</div>
<p class="nho" style="margin-top:6px">Số nguyên, không có trần; 0 = "đủ kết dính".</p></div>
<div>
<p style="font-size:21px"><b>Henderson-Sellers (1996): LCOM*</b></p>
<ul style="font-size:19.5px"><li>m = số method, a = số trường</li><li>μ(A<sub>j</sub>) = số method dùng trường j</li></ul>
<div style="text-align:center;font-size:23px;background:#fff7ef;border:2px solid #e08a1e;border-radius:10px;padding:8px;margin-top:8px">LCOM* = (m − Σμ(A<sub>j</sub>)/a) / (m − 1)</div>
<p class="nho" style="margin-top:6px">0 = mọi method dùng mọi trường; 1 = mỗi trường chỉ một method dùng.</p></div></div>
${o('Ví dụ tay: 3 method <code>a{x}</code>, <code>b{x,y}</code>, <code>c{z}</code> ⇒ cặp (a,b) chung x: Q=1; (a,c),(b,c): P=2 ⇒ LCOM = 1. μ: x=2, y=1, z=1 ⇒ LCOM* = (3 − 4/3)/2 = <b>0.83</b>.')}` },

  /* 17 */
  { t: 'Mô hình LabFlow để đo', body: `${doThiGoi()}
<div class="hai">${ma(`c("reservation", "ReservationService", false,
  "ReservationRepository", "ReservationPolicy",
  "Reservation", "CatalogService", "Notifier",
  "Clock", "DomainException");
c("waitlist", "WaitlistService", false,
  "WaitlistRepository", "WaitlistEntry",
  "ReservationService", "Notifier", "Clock");`, 'font-size:14.5px;line-height:1.4;padding:9px 12px')}
<ul style="font-size:19px"><li>19 lớp, 5 gói, khai như một class diagram bằng dữ liệu</li><li>Tính fan-in/out, Ca, Ce, I, A, D rồi soát SDP từng mũi tên giữa gói</li><li>Thử một thay đổi: <code>CatalogService</code> gọi <code>ReservationService</code></li></ul></div>` },

  /* 18 */
  { t: 'Kết quả đo gói và nguyên tắc phụ thuộc ổn định', body: `<div class="hai"><div>
<p style="font-size:19px"><b>Trước</b> — đo thật:</p>
${out(`PACKAGE       Ca Ce   I     A     D
common         7  0  0.00  0.33  0.67
catalog        4  1  0.20  0.25  0.55
notification   2  0  0.00  0.50  0.50
reservation    1  4  0.80  0.17  0.03
waitlist       0  2  1.00  0.25  0.25`, 'font-size:14.5px')}
<p style="font-size:17px;margin-top:4px">8 mũi tên giữa gói: cả 8 đều "ok" (đi về phía I nhỏ hơn).</p>
<p style="font-size:19px;margin-top:8px"><b>Sau</b> khi catalog gọi reservation:</p>
${out(`reservation    2  4  0.67  0.17  0.17
catalog -> reservation  (0.20 -> 0.67)  VIOLATES SDP`, 'font-size:14.5px')}</div>
<ul style="font-size:19.5px">
<li><b>common</b> I = 0: ai cũng dựa ⇒ sửa nó là sửa cả hệ — giữ thật ít đổi.</li>
<li><b>waitlist</b> I = 1: không ai dựa ⇒ đổi thoải mái.</li>
<li><b>common</b> D = 0.67: ổn định mà cụ thể ("vùng đau" của Martin) — chấp nhận được vì <code>TimeRange</code> hầu như không đổi.</li>
<li>Thay đổi làm <span class="do">catalog (ổn định) dựa vào reservation (bất ổn)</span> và tạo <b>vòng</b> catalog ⇄ reservation ⇒ sửa: <b>đảo phụ thuộc</b> (catalog khai interface, reservation cài) hoặc trang lab gọi API reservation từ frontend.</li>
</ul></div>` },

  /* 19 */
  { t: 'Kết quả LCOM: ba lớp, ba câu chuyện', body: `${out(`Reservation         m=6 a=5  P= 6 Q= 9  LCOM(CK)= 0  LCOM*(HS)=0.80  groups=1
ReservationService  m=4 a=4  P= 0 Q= 6  LCOM(CK)= 0  LCOM*(HS)=0.50  groups=1
LabFlowManager      m=6 a=4  P=12 Q= 3  LCOM(CK)= 9  LCOM*(HS)=0.85  groups=3`, 'font-size:16px')}
${bang([
    ['Reservation (@Entity)', 'CK = 0 nhưng LCOM* = 0.80', 'nhiều trường chỉ một method dùng (<code>purpose</code>, <code>rejectReason</code>) đẩy LCOM* lên — <b>không</b> phải dấu hiệu tách lớp'],
    ['ReservationService', 'CK = 0, LCOM* = 0.50', 'mọi method dùng <code>repo</code> ⇒ một khối'],
    ['LabFlowManager', '<span class="do">CK = 9, 3 nhóm</span>', 'đặt phòng · cho mượn thiết bị · gửi mail ⇒ <b>ba lớp nấp trong một</b>'],
  ], ['Lớp', 'Số đo', 'Đọc thế nào'], 'font-size:18.5px')}
${o('"groups" = số nhóm method nối nhau qua trường chung (ý của LCOM4, Hitz &amp; Montazeri). Một con số đơn lẻ dễ lừa: đọc <b>CK + LCOM* + số nhóm</b> cùng lúc, rồi mới quyết định tách.', 'xanh')}` },

  /* 20 */
  { t: 'Kiểm luật tầng tự động — ArchUnit tí hon', body: `<div class="hai"><div>
${ma(`mustNotDepend("controllers must not depend on repositories",
    RestController.class, Repository.class),
onlyAccessedBy("repositories may only be accessed by services",
    Repository.class, Service.class),
mustNotDepend("entities must not depend on services",
    Entity.class, Service.class),
mustNotDepend("services must not depend on controllers",
    Service.class, RestController.class)`, 'font-size:14px;line-height:1.4;padding:9px 12px')}
<p style="font-size:18px;margin-top:8px">Phụ thuộc lấy bằng reflection: kiểu của trường, tham số constructor/method, kiểu trả về.</p></div>
<div>${out(`BEFORE the fix: imported 5 classes
  FAILED  controllers must not depend on repositories
          ReservationStatsController -> ReservationRepository
  FAILED  repositories may only be accessed by services
          ReservationStatsController -> ReservationRepository
  PASSED  entities must not depend on services
  PASSED  services must not depend on controllers
  => build RED (2 violations)
AFTER the fix: ...
  => build GREEN`, 'font-size:13.5px')}
<p style="font-size:18px;margin-top:8px">ArchUnit thật đọc <b>bytecode</b> nên thấy cả lời gọi trong thân method; bản tí hon này chỉ thấy chữ ký. Khoá kiến trúc 5.4 dùng ArchUnit thật.</p></div></div>` },

  /* 21 */
  { t: 'Lát cắt Reservation (1): UC → robustness → sequence', body: `<div style="display:grid;grid-template-columns:330px 1fr;gap:20px"><div>
<div style="border:2px solid #e08a1e;border-radius:10px;padding:8px 12px;font-size:17px;background:#fff7ef"><b>UC Reserve Lab</b> — actor: Student<br>1. chọn lab, khung giờ, mục đích<br>2. hệ thống kiểm luật BR-xx<br>3. hệ thống kiểm trùng giờ<br>4. tạo lượt đặt: CONFIRMED hoặc PENDING_APPROVAL<br><i>Alt 3a</i>: trùng ⇒ báo SM-12, mời vào waitlist</div>
<p style="font-size:17px;margin-top:8px"><b>Robustness</b> (slide 6) cho ra: Wizard · Validate · Check Availability · Create · Lab · Reservation.</p>
<p style="font-size:17px;margin-top:6px">Sequence đặt <b>tên lớp Spring</b> lên các vai đó.</p></div>
${seqNho()}</div>` },

  /* 22 */
  { t: 'Lát cắt Reservation (2): package → code', body: `<div class="hai"><div>${bang([
    ['Wizard (boundary UI)', 'React <code>CreateReservationWizard</code>'],
    ['boundary backend', '<code>ReservationController</code>'],
    ['Create Reservation (coordinator)', '<code>ReservationService.create</code>'],
    ['Validate (business logic)', '<code>ReservationPolicy</code>'],
    ['Check Availability', '<code>existsActiveOverlap</code> + ràng buộc EXCLUDE ở CSDL'],
    ['Reservation (entity + state)', '<code>@Entity Reservation</code>, enum status'],
    ['database wrapper', '<code>ReservationRepository</code>'],
  ], ['Vai từ phân tích', 'Lớp trong gói <code>com.labflow.reservation</code>'], 'font-size:17px')}</div>
<div>${out(`student A, LAB-A1 09-11 : HTTP 201 {id:1, status:PENDING_APPROVAL}
student B, LAB-A1 10-12 : HTTP 409 {error:"SM-12 slot already taken"}
student B, LAB-A1 11-13 : HTTP 201 {id:2, status:PENDING_APPROVAL}
student C, LAB-B2 09-10 : HTTP 201 {id:3, status:CONFIRMED}
manager approves #1     : HTTP 200 {id:1, status:CONFIRMED}
manager re-approves #1  : HTTP 409 {error:"cannot approve
                          a CONFIRMED reservation"}`, 'font-size:13px')}
<p style="font-size:17.5px;margin-top:8px">11:00 không trùng 09–11 vì khoảng <b>nửa mở</b> [start, end). Kiểm trùng trong Java chỉ là gợi ý: hai request đồng thời vẫn lọt — chốt cuối là <span class="do">ràng buộc EXCLUDE trong PostgreSQL</span> (SDS LabFlow).</p></div></div>` },

  /* 23 */
  { t: 'Clean / hexagonal: một slide rồi sang khoá kiến trúc', body: `<div class="hai"><div>
<ul style="font-size:20px">
<li><b>Hexagonal</b> (ports &amp; adapters) — Alistair Cockburn</li>
<li><b>Onion</b> — Jeffrey Palermo (2008)</li>
<li><b>Clean Architecture</b> — Robert C. Martin (2012)</li>
<li>Chung một ý: <b>phụ thuộc chỉ hướng vào trong</b> — lõi nghiệp vụ không biết Spring, JPA, HTTP</li>
<li>Khác phân tầng ở slide 7: repository trở thành <b>interface do lõi khai</b>, JPA chỉ là một adapter</li>
</ul></div>
<div>${o(`Học tiếp ở khoá ${lnk('software-architecture')}:<br>5.1 Ports and adapters · 5.2 Onion &amp; Clean<br>5.3 Hexagonal trong Spring Boot · 5.4 ArchUnit<br>5.5 Khi nào là quá tay`)}
${o('Với đồ án SEP490: phân tầng + package-by-feature + luật tầng tự động là <b>đủ và bảo vệ được</b>. Hexagonal chỉ đáng khi lõi nghiệp vụ dày.', 'xanh')}</div></div>` },

  /* 24 */
  { t: 'Tóm tắt và checklist cho Report 4', body: `<div class="hai"><ul style="font-size:19.5px">
<li>Stereotype COMET là <b>vai</b>; lớp Spring là <b>chỗ cài</b> — một vai có thể thành 2 lớp</li>
<li>Robustness: actor–boundary–control–entity, danh từ không nối danh từ</li>
<li>Phân tầng chặt: controller → service → repository; module chỉ gọi service của nhau</li>
<li>DI = constructor injection; container = bind + singleton + phát hiện vòng + reflection</li>
<li>I = Ce/(Ca+Ce); phụ thuộc về phía ổn định; LCOM đọc kèm số nhóm</li>
<li>Luật tầng phải là <b>bài kiểm chạy trong build</b></li>
</ul>
<div>${bang([
    ['☐', 'Package diagram BE khớp gói thật trong repo'],
    ['☐', 'Class diagram dùng tên lớp Spring thật'],
    ['☐', 'Sequence đi đúng controller → service → repository'],
    ['☐', 'Không vòng phụ thuộc giữa gói'],
    ['☐', 'Có test luật tầng (ArchUnit) trong CI'],
    ['☐', 'Trả lời được "vì sao by feature?"'],
  ], ['', 'Checklist trước khi nộp'], 'font-size:18px')}</div></div>` },
]);
