/**
 * swd-cs5.mjs — SWD392 ⭐ Chuyên sâu CS.5: SWD392 TRONG ĐỒ ÁN SEP490 & PHỎNG VẤN (deck tự dựng, 14/10/2026).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/swd-cs5.mjs --out <dir>
 * Đề cương: flm-nguon/_repo/SWD392/CHUYEN-SAU.md mục 5. Khuôn: _cs-chung.mjs.
 * Mục lục Report 3/4 + Assignment 01–03 chép đúng từ flm-nguon/_repo/SWD392/tai-lieu/raw_03.Templates__*.txt.
 * Ví dụ LabFlow: api-backend/scripts/labflow-seed/out-huong-dan/03-Report3-SRS.md, 04-Report4-SDS.md, docs/LABFLOW_MAPPING.md §8.
 * Output/log trên slide = output CHẠY THẬT của gen/java/cs5/{CourtBookingFlow,TxRollbackRules,SingletonStateBug}.java;
 * SQL slide 18 chạy thật trên PostgreSQL 16 (container dbi202-pg).
 * Spring đã đối chiếu docs.spring.io (14/10/2026): rollback mặc định RuntimeException + Error; propagation REQUIRED,
 * isolation DEFAULT; self-invocation không qua proxy; JDK proxy khi có interface, CGLIB khi không (Spring Boot mặc định CGLIB);
 * scope singleton/prototype/request/session/application/websocket; constructor injection được khuyên; vòng phụ thuộc
 * ⇒ BeanCurrentlyInCreationException; join point của Spring AOP luôn là method execution.
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs5', code: 'CS5', title: 'SWD392 trong đồ án SEP490 & phỏng vấn', sub: 'SWD392 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:8px 12px;font:14.5px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const lnk = (t) => `<span style="display:inline-block;background:#fff4e6;border:1.5px solid #e8a15a;border-radius:6px;padding:0 7px;font-size:15px;color:#b85a2b;font-weight:700;white-space:nowrap">${t}</span>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hop = (t, y, mau = '#e08a1e', nen = '#fff7ef', st = '') => `<div style="flex:1;border:2px solid ${mau};border-radius:10px;background:${nen};padding:7px 8px;text-align:center;${st}">
<div style="font-size:18px;font-weight:700;color:#262626;line-height:1.2">${t}</div><div style="font-size:14.5px;color:#555;margin-top:3px;line-height:1.3">${y}</div></div>`;
const mui = `<div style="align-self:center;font-size:24px;color:#e08a1e">➜</div>`;
const ck = (items, fs = 20) => `<ul style="list-style:none;padding-left:0;gap:5px;margin-bottom:10px">${items.map((x) => `<li style="font-size:${fs}px;line-height:1.32">☐ ${x}</li>`).join('')}</ul>`;
const nhan = (t, mau = '#b85a2b') => `<div style="font-size:21px;font-weight:700;color:${mau};margin-bottom:2px">${t}</div>`;

/* ───────────── sequence diagram bằng SVG (rút gọn từ swd-cs3.mjs) ───────────── */
function seq({ parts, rows, w = 1110, x0 = 70, x1, rh = 30, top = 58, fs = 14.5 }) {
  const n = parts.length, xr = x1 ?? w - 70, X = {};
  parts.forEach((p, i) => { X[p.id] = x0 + ((xr - x0) * i) / (n - 1); });
  const ys = []; let acc = top + 22;
  rows.forEach((r, i) => { ys[i] = acc; acc += rh * (r.k === 'close' ? 0.5 : r.k === 'sep' ? 1.1 : 1); });
  const Y = (i) => (i < rows.length ? ys[i] : acc);
  const H = acc + 4, L = '#595959', T = '#262626';
  let s = `<defs><marker id="dac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${L}"/></marker>
<marker id="mo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="${L}" stroke-width="1.6"/></marker></defs>`;
  const head = (p, y) => {
    if (p.actor) {
      const x = X[p.id];
      return `<g stroke="${L}" stroke-width="2" fill="none"><circle cx="${x}" cy="${y + 6}" r="7"/><line x1="${x}" y1="${y + 13}" x2="${x}" y2="${y + 28}"/><line x1="${x - 10}" y1="${y + 18}" x2="${x + 10}" y2="${y + 18}"/><line x1="${x}" y1="${y + 28}" x2="${x - 8}" y2="${y + 39}"/><line x1="${x}" y1="${y + 28}" x2="${x + 8}" y2="${y + 39}"/></g><text x="${x}" y="${y + 54}" text-anchor="middle" font-size="${fs}" fill="${T}">${p.t}</text>`;
    }
    const lines = p.t.split('|'), wd = Math.max(...lines.map((l) => l.length)) * (fs * 0.56) + 18, hh = 14 + lines.length * (fs + 3);
    return `<rect x="${X[p.id] - wd / 2}" y="${y}" width="${wd}" height="${hh}" rx="6" fill="#fff7ef" stroke="#b85a2b" stroke-width="1.8"/>` +
      lines.map((l, j) => `<text x="${X[p.id]}" y="${y + 7 + (j + 1) * (fs + 3) - 2}" text-anchor="middle" font-size="${fs}" fill="${T}">${l}</text>`).join('');
  };
  const st = [];
  rows.forEach((r, i) => {
    if (r.k === 'open') st.push({ ...r, i, els: [] });
    else if (r.k === 'else') st[st.length - 1].els.push({ i, g: r.g });
    else if (r.k === 'close') {
      const f = st.pop(), d = st.length;
      const xa = X[f.p1] - 46 + d * 8, xb = X[f.p2] + 46 - d * 8, ya = Y(f.i) - 15, yb = Y(i) - 8;
      s += `<rect x="${xa}" y="${ya}" width="${xb - xa}" height="${yb - ya}" fill="none" stroke="#8a6d55" stroke-width="1.6" rx="3"/>`;
      const ow = f.op.length * 9 + 18;
      s += `<path d="M${xa},${ya} h${ow} v13 l-7,7 h${-ow + 7} z" fill="#fbe9dc" stroke="#8a6d55" stroke-width="1.4"/>`;
      s += `<text x="${xa + 6}" y="${ya + 15}" font-size="14" font-weight="700" fill="#262626">${f.op}</text>`;
      if (f.g) s += `<text x="${xa + ow + 8}" y="${ya + 15}" font-size="14" font-weight="700" fill="#7a3d12">[${esc(f.g)}]</text>`;
      f.els.forEach((e) => {
        const ye = Y(e.i) - 10;
        s += `<line x1="${xa}" y1="${ye}" x2="${xb}" y2="${ye}" stroke="#8a6d55" stroke-width="1.3" stroke-dasharray="6 4"/>`;
        s += `<text x="${xa + 8}" y="${ye + 15}" font-size="14" font-weight="700" fill="#7a3d12">[${esc(e.g)}]</text>`;
      });
    }
  });
  parts.forEach((p) => {
    s += head(p, 4);
    const yl = 4 + (p.actor ? 60 : 14 + p.t.split('|').length * (fs + 3));
    s += `<line x1="${X[p.id]}" y1="${yl}" x2="${X[p.id]}" y2="${H - 4}" stroke="#a6a6a6" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  });
  rows.forEach((r, i) => {
    const y = Y(i);
    if (r.k === 'self') {
      const x = X[r.f];
      s += `<path d="M${x},${y - 6} h34 v14 h-32" fill="none" stroke="${L}" stroke-width="1.8" marker-end="url(#dac)"/>`;
      s += `<text x="${x + 40}" y="${y + 4}" font-size="${fs}" fill="${T}">${esc(r.l)}</text>`;
    } else if (['s', 'r', 'a'].includes(r.k)) {
      const xa = X[r.f], xb = X[r.t];
      const dash = r.k === 'r' ? ' stroke-dasharray="7 4"' : '';
      const mk = r.k === 's' ? 'dac' : 'mo';
      s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${L}" stroke-width="1.8"${dash} marker-end="url(#${mk})"/>`;
      s += `<text x="${Math.min(xa, xb) + 8}" y="${y - 6}" font-size="${fs}" fill="${T}">${esc(r.l)}</text>`;
    } else if (r.k === 'sep') {
      s += `<line x1="10" y1="${y - 4}" x2="${w - 10}" y2="${y - 4}" stroke="#8a6d55" stroke-width="1.4" stroke-dasharray="3 3"/>`;
      const tw = r.l.length * 8 + 20;
      s += `<rect x="${w / 2 - tw / 2}" y="${y - 16}" width="${tw}" height="22" rx="5" fill="#fff" stroke="#8a6d55"/><text x="${w / 2}" y="${y}" text-anchor="middle" font-size="14" font-weight="700" fill="#7a3d12">${esc(r.l)}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${H}" width="100%" style="max-height:${H}px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── use case diagram đặt sân (SVG) ───────────── */
const actorSvg = (x, y, t) => `<g stroke="#595959" stroke-width="2" fill="none"><circle cx="${x}" cy="${y}" r="8"/><line x1="${x}" y1="${y + 8}" x2="${x}" y2="${y + 26}"/><line x1="${x - 12}" y1="${y + 14}" x2="${x + 12}" y2="${y + 14}"/><line x1="${x}" y1="${y + 26}" x2="${x - 9}" y2="${y + 38}"/><line x1="${x}" y1="${y + 26}" x2="${x + 9}" y2="${y + 38}"/></g><text x="${x}" y="${y + 54}" text-anchor="middle" font-size="14.5" fill="#262626">${t}</text>`;
const ovalSvg = (x, y, t, w = 190) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="18" fill="#fff7ef" stroke="#b85a2b" stroke-width="1.8"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14.5" fill="#262626">${t}</text>`;
const ln = (x1, y1, x2, y2, dash = false, mk = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#595959" stroke-width="1.6"${dash ? ' stroke-dasharray="7 4"' : ''}${mk ? ` marker-end="url(#${mk})"` : ''}/>`;

function ucDatSan() {
  let s = `<defs><marker id="uc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#595959" stroke-width="1.6"/></marker></defs>`;
  s += `<rect x="170" y="8" width="470" height="412" rx="10" fill="#fffdf9" stroke="#8a6d55" stroke-width="1.8"/><text x="405" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#262626">Court Booking System</text>`;
  const U = [['Search Free Courts', 300, 62], ['Book Court', 300, 112], ['Pay Booking', 535, 112, 150], ['Cancel Booking', 300, 162], ['Check In Customer', 300, 222],
    ['Manage Courts and Prices', 300, 282, 220], ['View Revenue Report', 300, 332], ['Expire Unpaid Holds', 300, 392]];
  U.forEach(([t, x, y, w]) => { s += ovalSvg(x, y, t, w || 190); });
  s += actorSvg(70, 80, 'Customer') + actorSvg(70, 200, 'Venue Staff') + actorSvg(70, 285, 'Venue Owner') + actorSvg(70, 368, 'Timer') + actorSvg(735, 150, 'Payment Gateway');
  s += ln(88, 100, 205, 62) + ln(88, 104, 205, 112) + ln(88, 108, 205, 162);
  s += ln(88, 222, 205, 222) + ln(88, 305, 190, 282) + ln(88, 310, 205, 332) + ln(88, 390, 205, 392);
  s += ln(395, 112, 458, 112, true, 'uc') + `<text x="426" y="104" text-anchor="middle" font-size="12.5" fill="#262626">«include»</text>`;
  s += ln(610, 120, 718, 165) + ln(395, 162, 718, 172);
  return `<svg viewBox="0 0 800 425" width="100%" style="max-height:470px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── class diagram đặt sân (SVG) ───────────── */
function lop(x, y, w, ten, ds) {
  const h = 30 + ds.length * 18 + 8;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="#b85a2b" stroke-width="1.8"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="28" rx="4" fill="#fbe9dc" stroke="#b85a2b" stroke-width="1.8"/>`;
  s += `<text x="${x + w / 2}" y="${y + 19}" text-anchor="middle" font-size="15" font-weight="700" fill="#262626">${ten}</text>`;
  ds.forEach((d, i) => { s += `<text x="${x + 8}" y="${y + 46 + i * 18}" font-size="13.5" fill="#404040">${d}</text>`; });
  return s;
}
const nhanSo = (x, y, t, a = 'start') => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="13.5" font-weight="700" fill="#7a3d12">${t}</text>`;
const nhanLk = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" font-style="italic" fill="#404040">${t}</text>`;
function classDatSan() {
  let s = '';
  s += lop(10, 10, 150, 'Venue', ['name', 'openTime', 'closeTime']);
  s += lop(250, 10, 150, 'Court', ['code', 'sport']);
  s += lop(490, 10, 170, 'PriceRule', ['dayType', 'from – to', 'pricePerHour']);
  s += lop(250, 210, 150, 'Booking', ['start, end', 'status', 'holdUntil', 'amount']);
  s += lop(10, 210, 150, 'Customer', ['fullName', 'phone']);
  s += lop(490, 210, 170, 'Payment', ['amount', 'providerRef', 'status']);
  // Venue ◆— Court
  s += `<path d="M160,40 l12,-7 l12,7 l-12,7 z" fill="#404040"/>` + ln(184, 40, 250, 40) + nhanSo(165, 30, '1') + nhanSo(246, 30, '1..*', 'end') + nhanLk(214, 60, 'has');
  s += ln(400, 40, 490, 40) + nhanSo(404, 30, '1') + nhanSo(486, 30, '0..*', 'end') + nhanLk(445, 60, 'priced by');
  s += ln(325, 86, 325, 210) + nhanSo(331, 102, '1') + nhanSo(331, 204, '0..*') + nhanLk(375, 150, 'booked in');
  s += ln(160, 245, 250, 245) + nhanSo(164, 237, '1') + nhanSo(246, 237, '0..*', 'end') + nhanLk(205, 265, 'makes');
  s += ln(400, 245, 490, 245) + nhanSo(404, 237, '1') + nhanSo(486, 237, '0..*', 'end') + nhanLk(445, 265, 'paid by');
  return `<svg viewBox="0 0 670 320" width="100%" style="max-height:440px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── state machine Booking (SVG) ───────────── */
const stBox = (x, y, w, t, hl = false) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="12" fill="${hl ? '#fdf0ee' : '#fff7ef'}" stroke="${hl ? '#c0392b' : '#b85a2b'}" stroke-width="2"/><text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="14.5" font-weight="700" fill="#262626">${t}</text>`;
const arS = (d, lbl, lx, ly, a = 'start') => `<path d="${d}" fill="none" stroke="#595959" stroke-width="1.7" marker-end="url(#sm5)"/>` +
  lbl.split('|').map((l, i) => `<text x="${lx}" y="${ly + i * 14}" text-anchor="${a}" font-size="12.5" fill="#262626">${esc(l)}</text>`).join('');
function stateBooking() {
  let s = `<defs><marker id="sm5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#595959"/></marker></defs>`;
  s += `<circle cx="40" cy="50" r="9" fill="#262626"/>`;
  s += stBox(110, 33, 120, 'HELD', true) + stBox(110, 160, 120, 'CONFIRMED', true);
  s += stBox(330, 33, 120, 'EXPIRED') + stBox(330, 160, 120, 'CANCELLED') + stBox(110, 282, 120, 'COMPLETED');
  s += arS('M49,50 L108,50', 'hold', 62, 42);
  s += arS('M230,50 L328,50', 'holdTimeout|/ release slot', 238, 26);
  s += arS('M170,67 L170,158', 'payment|Succeeded', 164, 108, 'end');
  s += arS('M230,62 L340,158', 'cancel', 292, 104);
  s += arS('M230,177 L328,177', 'cancel [≥ 24h]|/ refund', 238, 196);
  s += arS('M170,194 L170,280', 'end reached', 176, 242);
  s += `<text x="300" y="275" font-size="12.5" fill="#c0392b" font-weight="700">đỏ = đang chiếm slot</text>`;
  return `<svg viewBox="0 0 460 322" width="100%" style="max-height:322px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ═════════════════════════════ SLIDES ═════════════════════════════ */
export const slides = lamDeck('SWD392 TRONG ĐỒ ÁN &amp; PHỎNG VẤN', [
  /* 1 */
  { cover: true, t: 'SWD392 trong đồ án SEP490<br>&amp; phỏng vấn', sub: 'Sơ đồ nào nằm ở mục nào của Report 3/4 · checklist từng sơ đồ<br>thiết kế một hệ thống trong 15 phút · 36 câu phỏng vấn fresher Java' },

  /* 2 */
  { t: 'Deck này gồm ba phần', body: `${bang([
    ['<b>A.</b> Sơ đồ trong hồ sơ đồ án', '3–11', 'đặt đúng mỗi sơ đồ vào <b>đúng mục</b> Report 3 (SRS) / Report 4 (SDD); soát bằng checklist; truy vết một UC tới code và test'],
    ['<b>B.</b> Thiết kế trong 15 phút', '12–18', 'làm trọn một đề (<b>đặt sân thể thao</b>) qua 6 bước: yêu cầu → actor/UC → entity → kiến trúc → sequence → trạng thái &amp; đánh đổi'],
    ['<b>C.</b> Phỏng vấn fresher Java', '19–24', '<b>36 câu</b>: UML, GoF, SOLID, kiến trúc, Spring IoC/DI/AOP/transaction — đáp án mẫu + câu đào sâu'],
  ], ['Phần', 'Slide', 'Học xong làm được'], 'font-size:19px')}
${o(`<b>Không dạy lại</b>, chỉ dẫn chiếu: ${lnk('⭐ CS.1')} lịch sử, C4, ADR · ${lnk('⭐ CS.2')} class ↔ Java ↔ JPA ↔ CSDL · ${lnk('⭐ CS.3')} sequence/state → code → test · ${lnk('⭐ CS.4')} COMET → Spring, DI, coupling · ${lnk('Chương 4')} GoF + SOLID`)}
${o('⭐ Phần <b>tự thêm</b>, không có trong giáo trình trường — <b>không thi</b>. Dùng cho: đồ án SEP490 (LabFlow), buổi bảo vệ, phỏng vấn thực tập/fresher.', 'xanh')}` },

  /* 3 */
  { t: 'Bộ hồ sơ SEP490 và chỗ của SWD392', body: `${bang([
    ['Report 1', 'Project Introduction', 'bối cảnh, phạm vi, danh sách tính năng (FE-xx)', ''],
    ['Report 2', 'Project Management Plan', 'WBS, ước lượng, rủi ro, theo dõi tiến độ', ''],
    ['<b>Report 3</b>', '<b>Software Requirement Specification</b>', 'context, workflow, actor, <b>use case</b>, màn hình, <b>ERD</b>, đặc tả UC, BR, message', '<span class="do">★★ SWD392 Ch.2</span>'],
    ['<b>Report 4</b>', '<b>Software Design Document</b>', '<b>kiến trúc</b>, <b>package</b>, <b>CSDL</b>, <b>class + sequence</b> từng tính năng', '<span class="do">★★ SWD392 Ch.2–4</span>'],
    ['Report 5', 'Test Documentation', 'unit / integration / system test — test case rút từ UC và sequence', '★'],
    ['Report 6', 'Software User Guides', 'hướng dẫn dùng theo vai trò', ''],
    ['Report 7', 'Final Project Report', 'gom Report 1–6 thành báo cáo cuối', '★'],
  ], ['', 'Tên', 'Có gì', 'Dùng SWD392'], 'font-size:17.5px')}
<p class="nho">Tên theo bộ mẫu SEP490 mà hồ sơ LabFlow dùng. Mục lục chi tiết ở hai slide sau chép đúng file mẫu <b>Report3_Software_Requirement_Specification</b> và <b>Report4_Software_Design_Document</b> (bộ Report_Templates-20250104 của môn).</p>` },

  /* 4 */
  { t: 'Report 3 (SRS): sơ đồ nằm ở mục nào', body: `${bang([
    ['<b>1.1 Context Diagram</b>', 'sơ đồ ngữ cảnh: hệ thống = <b>một khối</b>, thực thể ngoài, luồng dữ liệu', lnk('2.G')],
    ['<b>1.2 Main Workflows</b>', '<b>swim-lane diagram</b> (activity theo làn), mỗi quy trình một mục 1.2.x', lnk('2.C')],
    ['<b>1.3.2 Use Cases</b>', '<b>UC diagram</b>, mỗi actor/workflow một hình: 1.3.2.1 UCs for Guest…', lnk('2.A–2.C')],
    ['<b>1.4.1 Screens Flow</b>', 'sơ đồ luồng màn hình', '—'],
    ['1.3.1 Actors · 1.4.2 · 1.4.3', '<b>bảng</b>, không phải sơ đồ (actor; quyền màn hình; job/API)', lnk('2.B')],
    ['<b>1.5 Entity Relationship Diagram</b>', '<b>ERD</b> + bảng mô tả thực thể', lnk('2.H · 5.1')],
    ['2. Use Case Specifications', 'bảng đặc tả: Actors · Description · Pre/Postconditions · Normal/Alternative Flows', lnk('2.A')],
    ['3 · 4 · 5', 'mockup màn hình · NFR · Business Rules, System Messages', '—'],
  ], ['Mục (tên đúng trong mẫu)', 'Bạn đặt vào', 'Bài'], 'font-size:16.5px')}
<p class="nho" style="font-size:17px">Mẫu ghi nhầm: mục con của “4. Non-Functional Requirements” đánh số <b>3.1 / 3.2</b> — hãy đánh 4.1, 4.2.</p>` },

  /* 5 */
  { t: 'Report 4 (SDD): sơ đồ nằm ở mục nào', body: `${bang([
    ['1. System Design → <b>1.1 System Architecture</b>', 'sơ đồ tổng thể: <b>sub-system</b>, hệ ngoài, kết nối + giải thích từng khối', lnk('3.B–3.E') + ' ' + lnk('⭐ CS.1')],
    ['<b>1.2 Package Diagram</b>', 'package diagram mỗi sub-system + bảng <b>Package descriptions</b> (No · Package · Description) + quy ước đặt tên', lnk('⭐ CS.4')],
    ['<b>2. Database Design</b>', 'sơ đồ quan hệ bảng + <b>Table Descriptions</b> (Primary keys, Foreign keys)', lnk('3.I') + ' ' + lnk('⭐ CS.2')],
    ['3. Detailed Design → <b>3.1 &lt;Feature/Function Name1&gt;</b>', '<b>3.1.1 Class Diagram</b> · <b>3.1.2 &lt;Sequence Diagram Name1&gt;</b> · 3.1.3 … (mỗi tính năng)', lnk('2.N–2.O') + ' ' + lnk('⭐ CS.3')],
  ], ['Mục (tên đúng trong mẫu)', 'Bạn đặt vào', 'Bài'], 'font-size:17.5px')}
${o('Câu của chính mẫu: tính năng nào <b>cùng cấu trúc</b> class &amp; sequence thì <b>vẽ một lần</b>, các tính năng kia <b>tham chiếu</b> tới — không chép lại hình.')}
<p class="nho">Bộ mẫu SEP490 mới hơn (hồ sơ LabFlow) đánh số khác: 1. High Level Design (1.1 Software Architecture · 1.2 Package Diagram · 1.3 Database Design) · 2. Detailed Design · 3. Class Specifications · 4. Other Design Specifications. <b>Luôn theo đúng bản mẫu giảng viên phát kỳ của bạn.</b></p>` },

  /* 6 */
  { t: 'Assignment 01–03 là bản tập của Report 3/4', body: `${bang([
    ['<b>Assignment01-UC-Model</b><br><span style="font-size:14px;color:#666">User Requirement Document</span>', '1 Context Diagram · 2.1 Actors · 2.2 UC Diagrams · <b>2.3 Activity Diagrams</b> (mỗi UC) · 3 Use Case Specifications · 4 Non-Functional Requirements', 'Report 3: 1.1 · 1.3 · 2 · 4'],
    ['<b>Assignment02-Analysis-Model</b><br><span style="font-size:14px;color:#666">Analysis Modelling Document</span>', 'II.1 Context Modeling · II.2 Entity Classes · III Object &amp; Class Structuring (class + Class Description) · IV Dynamic Interaction (<b>communication + sequence</b>) · <b>V Finite State Machine</b> (≥ 3 state chart)', 'Report 3: 1.5 (ERD từ entity class) · Report 4: 3.x'],
    ['<b>Assignment03-Design-Model</b><br><span style="font-size:14px;color:#666">Design Modelling Document</span>', 'II User Interface Design · III High-Level Design (1 Software Architecture · 2 Package Diagram · 3 Database Design) · IV Detailed Design (class + sequence mỗi tính năng)', 'Report 3: 3 · Report 4: 1–3 (gần như <b>1-1</b>)'],
  ], ['Assignment (tên file mẫu)', 'Mục chứa sơ đồ', 'Sang hồ sơ SEP490'], 'font-size:17px')}
${o('Làm kỹ ba Assignment trong SWD392 = đã có <b>bản nháp</b> Report 3/4 của đồ án. Viết bằng chính đề tài đồ án nếu giảng viên cho phép.', 'xanh')}` },

  /* 7 */
  { t: 'Sơ đồ SWD392 không có mục riêng: đặt ở đâu?', body: `${bang([
    ['<b>State machine</b>', 'Assignment02 <b>V</b> (≥ 3: User, Product, Order) · Course Project Report III.2', 'Report 4: mục con của tính năng, vd <b>3.1.4 Reservation State Diagram</b>'],
    ['Communication', 'Assignment02 IV (kèm sequence)', 'Report 4 thường chỉ cần sequence'],
    ['Activity cho từng UC', 'Assignment01 2.3', 'Report 3: swim-lane ở 1.2; activity UC khó đặt cạnh đặc tả UC'],
    ['Component · Deployment', 'đề Course Project AI-assisted (Evaluation 2)', 'Report 4: <b>1.1 System Architecture</b>'],
    ['Context <b>class</b> diagram (stereotype)', 'Assignment02 II.1', '<span class="do">≠</span> Context Diagram của Report 3 §1.1'],
  ], ['Sơ đồ', 'Mẫu nào có chỗ', 'Gợi ý trong hồ sơ SEP490'], 'font-size:18px')}
${o('Report 3/4 <b>không có mục state machine</b>, nhưng vòng đời Reservation/Booking là câu hội đồng hay hỏi ⇒ thêm làm <b>mục con</b> trong tính năng, không thêm mục cấp 2 mới. Hỏi giảng viên hướng dẫn trước khi đổi khung.')}` },

  /* 8 */
  { t: 'Checklist: sơ đồ yêu cầu (Report 3)', body: `<div class="hai" style="gap:26px">
<div>${nhan('1.1 Context Diagram')}${ck(['hệ thống là <b>một khối</b>, không vẽ chức năng bên trong', 'đủ actor người + <b>hệ ngoài</b> (email, thanh toán, thiết bị)', 'mỗi mũi tên ghi <b>dữ liệu</b>, không ghi chức năng'])}
${nhan('1.2 Main Workflows (swim-lane)')}${ck(['có <b>làn của hệ thống</b>', 'mỗi quy trình một hình, có điểm kết thúc', 'nhánh lỗi chính có mặt (hết chỗ, bị từ chối)'])}</div>
<div>${nhan('1.3.2 UC diagram')}${ck(['khung ghi <b>tên hệ thống</b>', 'tên UC = <b>động từ + tân ngữ</b>, trùng bảng UC/WBS', '<b>secondary actor được nối</b> tới UC dùng nó', 'include = luôn chạy; extend = có điều kiện, mũi tên <b>từ</b> UC mở rộng <b>về</b> UC gốc', 'Login là <b>tiền điều kiện</b>, không include khắp nơi'])}
${nhan('2. Use Case Specifications')}${ck(['đủ dòng của mẫu; bước đánh số', 'Alternative Flows tham chiếu <b>đúng số bước</b>', 'Postconditions chỉ tả <b>trạng thái dữ liệu</b>', 'luật/thông báo có mã <b>BR-xx / MSGxx</b>'])}</div></div>
${o('Mẹo soát: đọc to từng đường nối thành một câu — “Student <i>tạo</i> Create Reservation”, “Create Reservation <i>gửi</i> Email Service”. Câu nào nghe sai là sơ đồ sai.', 'xanh')}` },

  /* 9 */
  { t: 'Checklist: sơ đồ thiết kế (Report 4)', body: `<div class="hai" style="gap:26px">
<div>${nhan('1.1 Architecture · 1.2 Package')}${ck(['đủ khối: client, backend, CSDL, hệ ngoài; <b>nhãn giao thức</b>', 'package diagram <b>khớp thư mục thật</b> + bảng mô tả', 'chiều phụ thuộc đúng luật tầng ' + lnk('⭐ CS.4')])}
${nhan('2. Database Design')}${ck(['tên bảng/cột <b>khớp migration</b> và ERD Report 3', 'không tách bảng chỉ vì <b>khác vai trò</b> (User/Staff)', 'n–n có bảng trung gian; PK/FK ghi rõ ' + lnk('⭐ CS.2')])}</div>
<div>${nhan('3.x.1 Class Diagram')}${ck(['tên lớp, hàm <b>khớp code</b>', 'bội số hai đầu; không vẽ getter/setter', 'aggregation/composition đúng vòng đời'])}
${nhan('3.x.2 Sequence · State')}${ck(['tên lifeline = tên lớp trong class diagram', 'có <b>nhánh lỗi</b> (alt 403 / 404 / 409)', 'thấy ranh giới <b>transaction</b> và kiểm quyền', 'mỗi chức năng đã code có một sequence', 'state: sự kiện, guard, action, trạng thái kết thúc ' + lnk('⭐ CS.3')])}</div></div>
${o('Soát chéo trước khi nộp: lifeline nào cũng có lớp trong class diagram · entity nào cũng có bảng · bảng nào cũng có migration · chức năng nào cũng có sequence.', 'xanh')}` },

  /* 10 */
  { t: 'Lỗi hay gặp khi nộp và khi bảo vệ', body: `<div class="hai" style="gap:24px">
<div>${nhan('Trên báo cáo (kinh nghiệm chung)', '#c0392b')}<ul style="font-size:20.5px;gap:7px">
<li>sơ đồ vẽ theo ý tưởng đầu kỳ, <b>code đã khác</b></li>
<li>sequence chỉ có luồng thành công</li>
<li>tên UC ≠ tên màn ≠ tên test case</li>
<li>ERD Report 3 ≠ Database Design Report 4</li>
<li>secondary actor đứng lơ lửng; include/extend ngược chiều</li>
<li>vẽ bù cả bộ sơ đồ vào tuần cuối</li></ul></div>
<div>${nhan('Câu hội đồng hay hỏi về thiết kế')}<ul style="font-size:20.5px;gap:7px">
<li>UC nào phức tạp nhất? luồng thay thế ra sao?</li>
<li>Hai người đặt <b>cùng một slot</b> cùng lúc thì sao?</li>
<li>Vì sao chọn kiến trúc này, không microservice?</li>
<li>Lớp/bảng này nằm ở đâu trong code?</li>
<li>Vòng đời của Reservation? chuyển sai bị chặn ở đâu?</li></ul>
${o('<b>Khuôn trả lời:</b> 1 câu khẳng định → lý do → “em xin mở cho thầy/cô xem” (sơ đồ, code, test).', 'xanh')}</div></div>
<p class="nho">Tổng hợp từ hướng dẫn viết hồ sơ LabFlow và kinh nghiệm chung khi bảo vệ — không phải trích lời một giảng viên cụ thể.</p>` },

  /* 11 */
  { t: 'Truy vết: một use case xuyên suốt hồ sơ', body: `<div style="display:flex;gap:5px">
${hop('Report 3 · 1.3.2', 'UC-12<br>Create Reservation')}${mui}
${hop('Report 3 · 2.x', 'đặc tả UC-12<br>BR-05, MSG07')}${mui}
${hop('Report 4 · 3.1', 'class diagram<br>+ sequence')}${mui}
${hop('Report 4 · 2', 'bảng reservation<br>+ EXCLUDE')}${mui}
${hop('Code', 'ReservationService<br>.create()', '#2f7d4f', '#f1f9f4')}${mui}
${hop('Report 5', 'TC-UC12-01…<br>409 khi trùng', '#2f7d4f', '#f1f9f4')}
</div>
${bang([
    ['UC-12 Create Reservation', 'Create Reservation', '3.1.2 Create Reservation', 'ReservationService.create', 'TC-UC12-01…08', 'Passed'],
    ['UC-15 Join Waitlist', 'My Waitlist', '3.2.2 Join Waitlist', 'WaitlistService.join', 'TC-UC15-01…05', 'Passed'],
  ], ['Use case', 'Màn hình', 'Sequence (R4)', 'Code', 'Test case (R5)', 'Kết quả'], 'font-size:16px')}
<ul style="font-size:21px;gap:6px">
<li><b>Một tên</b> ở mọi chỗ: bảng UC, WBS, màn hình, sequence, test case — đổi một chỗ thì đổi tất.</li>
<li>Bảng truy vết yêu cầu (<b>RTM</b>, như bảng trên) là thứ hội đồng dùng để hỏi “UC này test ở đâu?”.</li>
<li>Sơ đồ lưu dạng <b>PlantUML</b> trong repo ⇒ sửa code thì sửa sơ đồ <b>trong cùng commit</b>.</li>
</ul>
${o(`Đi sâu từng mắt xích: class → JPA → bảng ${lnk('⭐ CS.2')} · sequence → code → test ${lnk('⭐ CS.3')} · lát cắt UC → package → code ${lnk('⭐ CS.4')}`)}` },

  /* 12 */
  { t: 'Thiết kế một hệ thống trong 15 phút', body: `<div style="display:flex;gap:4px">
${hop('① Yêu cầu', '2 phút<br>làm rõ, chốt phạm vi')}${mui}
${hop('② Actor · UC', '2 phút<br>UC diagram 5–8 UC')}${mui}
${hop('③ Entity', '3 phút<br>class + bội số')}${mui}
${hop('④ Kiến trúc', '3 phút<br>tầng, module, CSDL')}${mui}
${hop('⑤ Sequence', '3 phút<br>luồng chính + 1 lỗi')}${mui}
${hop('⑥ Đánh đổi', '2 phút<br>state + 2–3 quyết định', '#2f7d4f', '#f1f9f4')}
</div>
<ul>
<li>Gặp ở: <b>câu 4–5 đề PE</b> (chọn kiến trúc, chọn pattern), <b>vòng phỏng vấn thiết kế</b>, buổi đầu chốt đề tài đồ án.</li>
<li><b>Nói to</b> từng quyết định; vẽ <b>ít mà đúng</b> — một sơ đồ trả lời một câu hỏi.</li>
<li>Thứ tự là <span class="do">từ ngoài vào trong</span>: ai dùng → làm gì → dữ liệu gì → đặt ở đâu → chạy ra sao → điểm khó.</li>
</ul>
${o('Đề mẫu cho 6 slide tới: <b>hệ thống đặt sân thể thao</b> (cầu lông, bóng đá mini) — khách đặt theo giờ, trả tiền online, chủ sân quản lý.')}` },

  /* 13 */
  { t: 'Bước ①: làm rõ yêu cầu — đề đặt sân', body: `<div class="hai" style="grid-template-columns:1fr 1.15fr;gap:22px">
<div>${nhan('Hỏi lại trước khi vẽ')}<ul style="font-size:18.5px;gap:5px">
<li>Một chủ có <b>nhiều cụm sân</b> không?</li>
<li>Đặt theo <b>khung giờ cố định</b> hay tự chọn?</li>
<li>Trả tiền <b>trước</b> hay tại sân? hoàn tiền khi huỷ?</li>
<li>Bao nhiêu sân, giờ cao điểm bao nhiêu lượt?</li>
<li>Có đặt <b>định kỳ</b> (mỗi tối thứ 3) không?</li></ul></div>
<div>${bang([
    ['Chức năng', 'tìm sân trống · đặt + giữ chỗ · thanh toán online · huỷ · check-in tại sân · chủ sân quản lý sân, giá, doanh thu'],
    ['Phi chức năng', '<b>không đặt trùng</b> (tuyệt đối) · tìm sân &lt; 1 giây · giữ chỗ chưa trả tiền <b>10 phút</b>'],
    ['Giả định', 'khung 1 giờ; huỷ trước 24 giờ được hoàn tiền; một chủ, nhiều cụm sân'],
    ['<span class="do">Ngoài phạm vi</span>', 'đặt định kỳ · ghép đội · thuê dụng cụ'],
  ], ['Chốt', 'Nội dung'], 'font-size:17px')}</div></div>
${o('Ghi <b>giả định</b> ra giấy rồi nói: người chấm cho điểm cách bạn thu hẹp đề, không chỉ cái hình cuối cùng.', 'xanh')}` },

  /* 14 */
  { t: 'Bước ②: actor và use case', body: `<div class="hai" style="grid-template-columns:1.9fr 1fr;gap:16px;align-items:center">
<div>${ucDatSan()}</div>
<div><ul style="font-size:19.5px;gap:8px">
<li><b>4 actor chính</b>: Customer, Venue Staff, Venue Owner, <b>Timer</b> (job hết hạn giữ chỗ).</li>
<li><b>Payment Gateway</b> là secondary actor — <b>được nối</b> tới Pay Booking và Cancel Booking (hoàn tiền).</li>
<li>Book Court <b>«include»</b> Pay Booking: đặt sân <b>luôn</b> kèm thanh toán.</li>
<li>Tên UC = động từ + tân ngữ.</li>
</ul></div></div>` },

  /* 15 */
  { t: 'Bước ③: thực thể và quan hệ', body: `<div class="hai" style="grid-template-columns:1.75fr 1fr;gap:16px;align-items:center">
<div>${classDatSan()}</div>
<div><ul style="font-size:18.5px;gap:7px">
<li>Venue <b>◆</b> Court: sân không tồn tại ngoài cụm sân (<b>composition</b>).</li>
<li><b>PriceRule</b> tách riêng: giờ cao điểm/ngày lễ giá khác.</li>
<li><b>Booking.amount</b> chốt giá lúc đặt ⇒ đổi bảng giá không làm sai lượt cũ.</li>
<li>Booking 1 — 0..* Payment: trả lỗi rồi trả lại; hoàn tiền là một Payment âm.</li>
<li>Rút danh từ từ UC; <span class="do">không</span> tách lớp Staff/Owner thành bảng riêng nếu chỉ khác vai trò.</li>
</ul></div></div>` },

  /* 16 */
  { t: 'Bước ④: kiến trúc', body: `<div style="display:flex;align-items:center;gap:8px">
${hop('Web / mobile app', 'React hoặc app di động', '#595959', '#fff')}${mui}
<div style="flex:2.6;border:2px dashed #b85a2b;border-radius:12px;padding:20px 8px 8px;position:relative;display:flex;gap:6px">
<span style="position:absolute;top:2px;left:10px;font-size:14px;font-weight:700;color:#b85a2b">Spring Boot — modular monolith</span>
${hop('booking', 'giữ chỗ, huỷ, trạng thái', '#2f7d4f', '#f1f9f4')}${hop('court', 'sân, giá, lịch', '#2f7d4f', '#f1f9f4')}${hop('payment', 'checkout, webhook', '#2f7d4f', '#f1f9f4')}${hop('notification', 'SMS / email', '#2f7d4f', '#f1f9f4')}</div>${mui}
${hop('PostgreSQL', 'một CSDL<br>+ EXCLUDE constraint', '#c0392b', '#fdf0ee')}
</div>
<div style="display:flex;gap:10px;justify-content:center;font-size:16px;color:#555;margin-top:-4px">payment ⇄ <b>Payment Gateway</b> (HTTPS + webhook) · notification → <b>nhà cung cấp SMS/email</b></div>
${bang([
    ['Một khối, chia <b>module theo tính năng</b>', 'đội nhỏ, một lần deploy; ranh giới module giữ bằng interface ' + lnk('swarch 3.2')],
    ['<b>Một CSDL</b>, transaction cục bộ', 'chống đặt trùng phải nguyên tử — dễ nhất khi cùng một CSDL'],
    ['Thanh toán qua <b>webhook</b>', 'cổng thanh toán báo kết quả <b>bất đồng bộ</b>; giữ chỗ chờ tối đa 10 phút'],
    ['Phân quyền theo vai trò', 'Customer / Venue Staff / Venue Owner — một bảng user, cột role'],
  ], ['Quyết định', 'Lý do'], 'font-size:19px')}` },

  /* 17 */
  { t: 'Bước ⑤: sequence luồng chính — Book Court', body: seq({
    parts: [{ id: 'C', t: 'Customer', actor: true }, { id: 'K', t: 'Booking|Controller' }, { id: 'S', t: 'Booking|Service' }, { id: 'R', t: 'Booking|Repository' }, { id: 'P', t: 'Payment|Service' }, { id: 'G', t: 'Payment|Gateway' }],
    top: 64, rh: 27.5, fs: 15,
    rows: [
      { k: 's', f: 'C', t: 'K', l: 'POST /bookings (court, start, end)' },
      { k: 's', f: 'K', t: 'S', l: 'hold(courtId, slot, customer)' },
      { k: 's', f: 'S', t: 'R', l: 'existsActiveOverlap(courtId, slot)' },
      { k: 'open', op: 'alt', g: 'slot taken', p1: 'C', p2: 'R' },
      { k: 'r', f: 'S', t: 'K', l: 'SlotTakenException' },
      { k: 'r', f: 'K', t: 'C', l: '409 Conflict' },
      { k: 'else', g: 'free' },
      { k: 's', f: 'S', t: 'R', l: 'insert(HELD, holdUntil = now + 10 min)' },
      { k: 's', f: 'S', t: 'P', l: 'createPayment(booking)' },
      { k: 's', f: 'P', t: 'G', l: 'create checkout' },
      { k: 'r', f: 'K', t: 'C', l: '201 Created + checkoutUrl' },
      { k: 'close' },
      { k: 'sep', l: 'sau đó, bất đồng bộ' },
      { k: 'a', f: 'G', t: 'P', l: 'webhook paid' },
      { k: 's', f: 'P', t: 'S', l: 'paymentSucceeded(id)' },
      { k: 's', f: 'S', t: 'R', l: 'HELD → CONFIRMED' },
    ],
  }) },

  /* 18 */
  { t: 'Bước ⑥: trạng thái và đánh đổi', body: `<div class="hai" style="grid-template-columns:0.95fr 1.25fr;gap:16px;align-items:start">
<div>${stateBooking()}
${code(`EXCLUDE USING gist (court_id WITH =,
  slot WITH &&)
  WHERE (status IN ('HELD','CONFIRMED'))`, 'sql')}</div>
<div>${bang([
    ['Chống đặt trùng', '<b>ràng buộc CSDL</b> + transaction, bên thua nhận 409', 'chỉ kiểm rồi insert ⇒ <span class="do">race</span>; khoá Redis lệch với CSDL'],
    ['Giữ chỗ chờ trả tiền', 'HELD <b>10 phút</b>, job huỷ khi hết hạn', 'trả tiền muộn ⇒ phải <b>hoàn tiền</b>'],
    ['Khung giờ', 'nửa mở <b>[start, end)</b>', '18–19 và 19–20 không trùng'],
    ['Kiến trúc', 'modular monolith', 'chưa scale riêng từng phần — tách sau khi có số đo'],
    ['Thông báo', 'sự kiện, gửi sau commit', 'chậm vài giây, phải thử lại'],
  ], ['Điểm khó', 'Chọn', 'Cái giá'], 'font-size:16px')}
${out(`[10:14] HoldExpiryJob runs
      Booking #2: HELD -> EXPIRED
[10:15] webhook: booking #2 paid (too late)
  <- ignored: #2 is EXPIRED (refund)`, 'font-size:13.5px;margin-top:8px')}</div></div>` },

  /* 19 */
  { t: 'Phỏng vấn ①: UML và phân tích – thiết kế', body: bang([
    ['1', 'Aggregation khác composition?', 'composition: bộ phận <b>chết theo</b> toàn thể, thuộc đúng một toàn thể'],
    ['2', 'Include khác extend?', 'include luôn chạy; extend có điều kiện, mũi tên từ UC mở rộng về UC gốc'],
    ['3', 'Sequence hay communication?', 'cùng nội dung; sequence nhấn <b>thứ tự thời gian</b>'],
    ['4', 'Khi nào cần vẽ state machine?', 'đối tượng có <b>vòng đời</b>, cùng sự kiện mà phản ứng khác theo trạng thái'],
    ['5', 'Analysis class khác design class?', 'khái niệm nghiệp vụ (B/C/E) vs lớp thật trong code có kiểu, interface'],
    ['6', 'Boundary/Control/Entity vào Spring ra sao?', '@RestController / @Service / @Entity + Repository — không khớp 1-1'],
    ['7', 'Use case khác user story?', 'UC đủ luồng chính/phụ; story là một mẩu nhỏ cho backlog'],
  ], ['#', 'Câu hỏi', 'Ý chính của đáp án (đầy đủ + câu đào sâu: trong bài giảng)'], 'font-size:19.5px') },

  /* 20 */
  { t: 'Phỏng vấn ②: GoF và SOLID', body: bang([
    ['8', 'Kể 3 pattern Spring dùng', 'Proxy (@Transactional), Observer (ApplicationEvent), Factory (BeanFactory)'],
    ['9', 'Strategy khác State?', 'cùng cấu trúc; Strategy do <b>client chọn</b>, State do <b>đối tượng tự chuyển</b>'],
    ['10', 'Singleton GoF có vấn đề gì?', 'trạng thái toàn cục, khó thay khi test; bean singleton ≠ getInstance()'],
    ['11', 'Factory Method vs Abstract Factory?', 'một sản phẩm, lớp con quyết định vs <b>một họ</b> sản phẩm'],
    ['12', 'Decorator vs Proxy?', 'cùng bọc interface; Decorator <b>thêm</b> hành vi, Proxy <b>kiểm soát</b> truy cập'],
    ['13', 'SRP — ví dụ thật?', 'một lớp một <b>lý do thay đổi</b>: tách gửi thông báo khỏi đặt chỗ'],
    ['14', 'OCP — ví dụ thật?', 'thêm cách tính giá bằng <b>lớp mới</b>, không sửa if-else cũ'],
    ['15', 'DIP khác DI khác IoC?', 'nguyên tắc (phụ thuộc trừu tượng) · kỹ thuật (tiêm vào) · nguyên lý (container điều khiển)'],
  ], ['#', 'Câu hỏi', 'Ý chính của đáp án'], 'font-size:18.5px') },

  /* 21 */
  { t: 'Phỏng vấn ③: kiến trúc', body: `${bang([
    ['16', 'Kiến trúc phân tầng: tầng nào, luật gì?', 'trình bày → nghiệp vụ → truy cập dữ liệu; chỉ gọi xuống'],
    ['17', 'Monolith hay microservices cho đồ án?', '<b>modular monolith</b>: một deploy, transaction đơn giản; tách khi có lý do đo được'],
    ['18', 'MVC là gì? Với REST thì View ở đâu?', 'pattern tầng trình bày; View = JSON trả về / app React ở client'],
    ['19', 'Đánh đổi thuộc tính chất lượng — ví dụ?', 'cache: nhanh hơn nhưng dữ liệu có thể cũ'],
    ['20', 'Chống hai người đặt cùng slot?', '<b>ràng buộc CSDL</b> + transaction, bên thua 409; không “kiểm rồi insert”'],
    ['21', 'Thiết kế API đặt sân?', 'danh từ số nhiều, POST /bookings → 201, trùng → 409; idempotency key'],
    ['22', 'Khi nào gọi bất đồng bộ?', 'việc phụ, chậm, thử lại được (email); giá: nhất quán sau, khó gỡ lỗi'],
  ], ['#', 'Câu hỏi', 'Ý chính của đáp án'], 'font-size:19px')}
<p class="nho">Câu kiến trúc khó hơn + vòng “architecture kata”: khoá software-architecture ${lnk('13.3')} ${lnk('13.4')}</p>` },

  /* 22 */
  { t: 'Phỏng vấn ④: Spring IoC, DI và bean', body: `${bang([
    ['23', 'IoC và DI là gì?', 'container tạo + lắp đối tượng; DI là dạng cụ thể: tiêm qua constructor/setter'],
    ['24', 'Constructor, setter hay field injection?', '<b>constructor</b> cho phụ thuộc bắt buộc (đội Spring khuyên); setter cho tuỳ chọn'],
    ['25', 'Các scope của bean?', 'singleton (mặc định) · prototype · request · session · application · websocket'],
    ['26', 'Bean singleton có thread-safe không?', '<span class="do">không tự động</span> — đừng giữ trạng thái theo request trong field'],
    ['27', '@Component, @Service, @Repository khác gì?', 'đều được quét; @Repository dịch exception sang DataAccessException'],
    ['28', 'Hai bean cùng kiểu thì sao?', 'NoUniqueBeanDefinitionException ⇒ @Primary, @Qualifier, tiêm List'],
    ['29', 'A cần B, B cần A qua constructor?', 'BeanCurrentlyInCreationException ⇒ sửa thiết kế, đừng lách'],
  ], ['#', 'Câu hỏi', 'Ý chính của đáp án'], 'font-size:17.5px')}
${out(`thread 1: Court A booked for Binh     ← bean singleton nhớ khách trong field: SAI
thread 2: Court B booked for Binh
fixed 1:  Court A booked for An       ← không trạng thái, truyền qua tham số`, 'font-size:15px;margin-top:4px')}` },

  /* 23 */
  { t: 'Phỏng vấn ⑤: Spring AOP và transaction', body: `${bang([
    ['30', 'AOP là gì? aspect, advice, pointcut?', 'tách việc cắt ngang (log, transaction); join point của Spring AOP luôn là <b>gọi phương thức</b>'],
    ['31', 'Spring AOP chạy bằng gì?', '<b>proxy</b>: JDK nếu có interface, CGLIB nếu không (Spring Boot mặc định CGLIB)'],
    ['32', 'Gọi this.method() có @Transactional?', '<b>không qua proxy</b> ⇒ không có transaction ' + lnk('⭐ CS.3')],
    ['33', 'Mặc định rollback khi nào?', 'RuntimeException và Error; <span class="do">checked thì commit</span> — trừ rollbackFor'],
    ['34', 'REQUIRED khác REQUIRES_NEW?', 'tham gia transaction đang có vs luôn mở transaction <b>độc lập</b>'],
    ['35', 'Isolation mặc định?', 'DEFAULT = theo CSDL (PostgreSQL: read committed)'],
    ['36', 'Đặt @Transactional ở tầng nào?', '<b>service</b> — ranh giới một use case; readOnly chỉ là gợi ý'],
  ], ['#', 'Câu hỏi', 'Ý chính của đáp án'], 'font-size:17.5px')}
${out(`  confirmSlotTaken: ROLLBACK on SlotTakenException
  confirmDeclined: COMMIT despite PaymentDeclinedException
  confirmDeclinedWithRule: ROLLBACK on PaymentDeclinedException`, 'font-size:15px;margin-top:4px')}` },

  /* 24 */
  { t: 'Cách trả lời và lộ trình học tiếp', body: `<div class="hai" style="grid-template-columns:1fr 1fr;gap:22px">
<div>${nhan('Khuôn 3 nhịp cho mọi câu')}
<ol style="font-size:21px;gap:8px">
<li><b>Định nghĩa</b> một câu, đúng thuật ngữ.</li>
<li><b>Ví dụ</b> từ dự án của chính bạn (LabFlow).</li>
<li><b>Đánh đổi / giới hạn</b>: khi nào không dùng.</li></ol>
${o('Không biết thì nói thật + cách sẽ tìm ra (đọc tài liệu chính thức, viết thử). Bịa là mất điểm nhanh nhất.', 'do2')}
${nhan('Mang theo khi đi phỏng vấn')}<ul style="font-size:20px;gap:6px"><li>1 sơ đồ kiến trúc + 1 sequence khó nhất của đồ án</li><li>1 quyết định có lý do (ADR) ${lnk('⭐ CS.1')}</li></ul></div>
<div>${bang([
    ['Khoá <b>spring-boot</b>', 'code đồ án: IoC, JPA, REST, bảo mật'],
    ['software-architecture <b>13.3</b>', 'câu phỏng vấn kiến trúc kèm lập luận'],
    ['software-architecture <b>13.4</b>', 'vòng phỏng vấn architecture kata'],
    ['software-architecture <b>14.5</b>', 'bảo vệ kiến trúc trước hội đồng'],
    ['Khoá <b>system-design</b>', 'thiết kế cho nhiều người dùng'],
  ], ['Học tiếp', 'Để làm gì'], 'font-size:19px')}
<p class="nho" style="margin-top:8px">Ôn lại trong môn: ${lnk('6.1')} checklist project + câu vấn đáp · ${lnk('Luyện PE')} đề mô phỏng 85 phút</p></div></div>` },
]);
