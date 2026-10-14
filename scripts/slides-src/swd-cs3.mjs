/**
 * swd-cs3.mjs — SWD392 ⭐ Chuyên sâu 3: SEQUENCE & STATE MACHINE → CODE → TEST (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/swd-cs3.mjs --out <dir>
 *
 * Mọi log/output trên slide lấy từ chương trình CHẠY THẬT (javac --release 17, không Spring/JUnit trên classpath):
 * flm-nguon/_repo/SWD392/gen/java/cs3/{ReserveFlowTrace,CheckInParallel,ApprovalEvents,SelfInvocation,QrTokenLifecycle,
 *   TraceToPlantUml,SequenceOrderTest,ReservationMachines}.java
 * Tra cứu chính thức (14/10/2026): Spring Framework reference — ApplicationContext events ("by default, event listeners receive
 * events synchronously… publishEvent() blocks until all listeners have finished"), Transaction-bound events (default phase
 * AFTER_COMMIT; no transaction ⇒ not invoked unless fallbackExecution = true), @Async (proxy mode: local calls cannot be
 * intercepted); Spring Boot: spring.task.execution.thread-name-prefix mặc định "task-", pool core 8; Spring Statemachine 4.0.1
 * reference (EnumStateMachineConfigurerAdapter, withStates().parent(), withExternal().guard().action(),
 * StateMachineEventResult.ResultType ACCEPTED/DENIED/DEFERRED); spring.io blog 21/04/2025 ("Spring Statemachine 4.0.x will be
 * the last open-source lines"); GitHub spring-projects/spring-statemachine: archived 05/07/2026, "no longer maintained".
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs3', code: 'CS3', title: 'Sequence & State machine → code → test', sub: 'SWD392 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:15px/1.42 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const ma = (src, st = '') => code(src, 'java', 'sm').replace('<pre class="vs', `<pre style="${st}" class="vs`);
const lnk = (t) => `<span style="display:inline-block;background:#fff4e6;border:1.5px solid #e8a15a;border-radius:6px;padding:1px 8px;font-size:17px;color:#b85a2b;font-weight:700">${t}</span>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ───────────── sequence diagram bằng SVG ─────────────
 * parts: [{id, t, actor?, born?: số hàng được tạo}]
 * rows : {k:'s'|'r'|'a'|'self'|'c'|'x', f, t, l}  (s = gọi đồng bộ, r = trả về, a = bất đồng bộ, c = <<create>>, x = huỷ)
 *        {k:'open', op, g, p1, p2} · {k:'else', g} · {k:'close'}  (khung kết hợp — lồng được)                      */
function seq({ parts, rows, w = 1110, x0 = 70, x1, rh = 31, top = 58, fs = 14.5, h0 }) {
  const n = parts.length, xr = x1 ?? w - 70, X = {};
  parts.forEach((p, i) => { X[p.id] = x0 + ((xr - x0) * i) / (n - 1); });
  const ys = []; let acc = top + 22;
  rows.forEach((r, i) => { ys[i] = acc; acc += rh * (r.k === 'close' ? 0.5 : 1); });
  const Y = (i) => (i < rows.length ? ys[i] : acc);
  const H = h0 ?? acc + 4;
  const L = '#595959', T = '#262626';
  let s = `<defs><marker id="dac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${L}"/></marker>
<marker id="mo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="${L}" stroke-width="1.6"/></marker></defs>`;
  const born = {}, dead = {};
  rows.forEach((r, i) => { if (r.k === 'c') born[r.t] = i; if (r.k === 'x') dead[r.f] = i; });
  const head = (p, y) => {
    if (p.actor) {
      const x = X[p.id];
      return `<g stroke="${L}" stroke-width="2" fill="none"><circle cx="${x}" cy="${y + 6}" r="7"/><line x1="${x}" y1="${y + 13}" x2="${x}" y2="${y + 28}"/><line x1="${x - 10}" y1="${y + 18}" x2="${x + 10}" y2="${y + 18}"/><line x1="${x}" y1="${y + 28}" x2="${x - 8}" y2="${y + 39}"/><line x1="${x}" y1="${y + 28}" x2="${x + 8}" y2="${y + 39}"/></g><text x="${x}" y="${y + 54}" text-anchor="middle" font-size="${fs}" fill="${T}">${p.t}</text>`;
    }
    const lines = p.t.split('|'), wd = Math.max(...lines.map((l) => l.length)) * (fs * 0.56) + 18, hh = 14 + lines.length * (fs + 3);
    return `<rect x="${X[p.id] - wd / 2}" y="${y}" width="${wd}" height="${hh}" rx="6" fill="#fff7ef" stroke="#b85a2b" stroke-width="1.8"/>` +
      lines.map((l, j) => `<text x="${X[p.id]}" y="${y + 7 + (j + 1) * (fs + 3) - 2}" text-anchor="middle" font-size="${fs}" fill="${T}">${l}</text>`).join('');
  };
  // khung
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
  // đầu + lifeline
  parts.forEach((p) => {
    const y0 = born[p.id] !== undefined ? Y(born[p.id]) - 14 : 4;
    s += head(p, y0);
    const yl = y0 + (p.actor ? 60 : 14 + p.t.split('|').length * (fs + 3));
    const ye = dead[p.id] !== undefined ? Y(dead[p.id]) : H - 4;
    s += `<line x1="${X[p.id]}" y1="${yl}" x2="${X[p.id]}" y2="${ye}" stroke="#a6a6a6" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if (dead[p.id] !== undefined) s += `<g stroke="#c0392b" stroke-width="3"><line x1="${X[p.id] - 10}" y1="${ye - 10}" x2="${X[p.id] + 10}" y2="${ye + 10}"/><line x1="${X[p.id] + 10}" y1="${ye - 10}" x2="${X[p.id] - 10}" y2="${ye + 10}"/></g>`;
  });
  // thông điệp
  rows.forEach((r, i) => {
    const y = Y(i);
    if (r.k === 'self') {
      const x = X[r.f];
      s += `<path d="M${x},${y - 6} h34 v14 h-32" fill="none" stroke="${L}" stroke-width="1.8" marker-end="url(#dac)"/>`;
      s += `<text x="${x + 40}" y="${y + 4}" font-size="${fs}" fill="${T}">${esc(r.l)}</text>`;
    } else if (['s', 'r', 'a', 'c', 'x'].includes(r.k)) {
      if (r.k === 'x' && !r.t) return;
      let xa = X[r.f], xb = X[r.t];
      if (r.k === 'c') xb = xb - (Math.max(...parts.find((p) => p.id === r.t).t.split('|').map((l) => l.length)) * (fs * 0.56) + 18) / 2 * Math.sign(xb - xa);
      const dash = r.k === 'r' || r.k === 'c' ? ' stroke-dasharray="7 4"' : '';
      const mk = r.k === 's' || r.k === 'x' ? 'dac' : 'mo';
      s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${L}" stroke-width="1.8"${dash} marker-end="url(#${mk})"/>`;
      const mx = (xa + xb) / 2;
      s += `<text x="${Math.min(xa, xb) + 8}" y="${y - 6}" font-size="${fs}" fill="${T}">${esc(r.l)}</text>`;
      void mx;
    } else if (r.k === 'note') {
      s += `<text x="${X[r.f] + 12}" y="${y + 4}" font-size="${fs - 0.5}" font-style="italic" fill="#b85a2b">${esc(r.l)}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${H}" width="100%" style="max-height:${H}px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── statechart Reservation (SVG) ───────────── */
function stateBox(x, y, w, h, ten, ds = [], hl = false) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${hl ? '#fdf0ee' : '#fff7ef'}" stroke="${hl ? '#c0392b' : '#b85a2b'}" stroke-width="2"/>`;
  s += `<text x="${x + w / 2}" y="${y + 21}" text-anchor="middle" font-size="15" font-weight="700" fill="#262626">${ten}</text>`;
  if (ds.length) s += `<line x1="${x}" y1="${y + 29}" x2="${x + w}" y2="${y + 29}" stroke="${hl ? '#c0392b' : '#b85a2b'}" stroke-width="1.2"/>`;
  ds.forEach((d, i) => { s += `<text x="${x + 8}" y="${y + 46 + i * 16}" font-size="13" fill="#404040">${d}</text>`; });
  return s;
}
const ar = (d, lbl = '', lx = 0, ly = 0, anchor = 'start') => `<path d="${d}" fill="none" stroke="#595959" stroke-width="1.8" marker-end="url(#sm)"/>` +
  (lbl ? lbl.split('|').map((l, i) => `<text x="${lx}" y="${ly + i * 15}" text-anchor="${anchor}" font-size="13" fill="#262626">${esc(l)}</text>`).join('') : '');

function statechart() {
  let s = `<defs><marker id="sm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#595959"/></marker></defs>`;
  // trạng thái cha
  s += `<rect x="300" y="40" width="390" height="410" rx="16" fill="#fffdf9" stroke="#b85a2b" stroke-width="2.2"/>`;
  s += `<text x="314" y="62" font-size="16" font-weight="700" fill="#b85a2b">Holding Slot</text><text x="314" y="80" font-size="13" fill="#404040">entry / Hold Slot · exit / Release Slot</text>`;
  s += `<rect x="322" y="92" width="346" height="214" rx="14" fill="#fff" stroke="#e08a1e" stroke-width="2" stroke-dasharray="7 4"/>`;
  s += `<text x="336" y="112" font-size="15" font-weight="700" fill="#e08a1e">Awaiting Use</text>`;
  s += stateBox(345, 124, 200, 54, 'PENDING_APPROVAL', ['entry / Notify Lab Managers']);
  s += stateBox(345, 228, 200, 70, 'CONFIRMED', ['entry / Issue QR Token', 'exit / Invalidate QR Token']);
  s += stateBox(345, 364, 210, 70, 'CHECKED_IN', ['entry / Start Usage Session', 'exit / End Usage Session']);
  // khởi tạo + choice
  s += `<circle cx="140" cy="60" r="9" fill="#262626"/><path d="M140,82 l12,12 l-12,12 l-12,-12 z" fill="#fff" stroke="#595959" stroke-width="1.8"/>`;
  s += ar('M140,69 L140,81');
  s += ar('M152,94 L343,146', '[approval required]', 175, 104);
  s += ar('M140,106 L140,262 L343,262', '[else]', 150, 255);
  // trong Awaiting Use
  s += ar('M445,178 L445,226', 'APPROVE [slot still free]|/ Record Approver', 455, 196);
  s += ar('M445,298 L445,362', 'SCAN_QR [within check-in window]', 455, 336);
  // ra ngoài
  s += stateBox(950, 60, 150, 34, 'REJECTED');
  s += stateBox(950, 128, 150, 34, 'EXPIRED ⭐', [], true);
  s += stateBox(950, 205, 150, 34, 'CANCELLED');
  s += stateBox(950, 300, 150, 34, 'NO_SHOW');
  s += stateBox(950, 392, 150, 52, 'COMPLETED', ['entry / Ask for Feedback']);
  s += ar('M545,132 L948,77', 'REJECT|/ Notify Requester, Promote Waitlist', 700, 52);
  s += ar('M545,162 L948,145', 'START_REACHED|/ Notify Requester, Promote Waitlist', 700, 121);
  s += ar('M668,222 L948,222', 'CANCEL [before start]|/ Promote Waitlist', 700, 199);
  s += ar('M545,282 L948,317', 'WINDOW_CLOSED / Promote Waitlist', 700, 286);
  s += ar('M555,410 L948,416', 'CHECK_OUT', 760, 404);
  // kết thúc
  s += `<circle cx="1135" cy="250" r="12" fill="#fff" stroke="#262626" stroke-width="2"/><circle cx="1135" cy="250" r="7" fill="#262626"/>`;
  for (const y of [77, 145, 222, 317, 418]) s += `<line x1="1100" y1="${y}" x2="1123" y2="${y < 250 ? 243 : 257}" stroke="#bfbfbf" stroke-width="1.4"/>`;
  return `<svg viewBox="100 30 1060 430" width="100%" style="max-height:430px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── ma trận 8 × 7 cặp (trạng thái, sự kiện) ───────────── */
function maTran() {
  const S = ['PENDING_APPROVAL', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW', 'EXPIRED'];
  const E = ['APPROVE', 'REJECT', 'CANCEL', 'SCAN_QR', 'WINDOW_|CLOSED', 'START_|REACHED', 'CHECK_OUT'];
  const ok = { 'PENDING_APPROVAL': [0, 1, 2, 5], 'CONFIRMED': [2, 3, 4], 'CHECKED_IN': [6] };
  const g = { 'PENDING_APPROVAL': [0, 2], 'CONFIRMED': [2, 3] };
  const cw = 66, chh = 27, lx = 150, top = 14;
  let s = '';
  E.forEach((e, j) => { e.split('|').forEach((l, k, all) => { s += `<text x="${lx + j * cw + cw / 2}" y="${(all.length === 1 ? 24 : 12 + k * 13)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#404040">${l}</text>`; }); });
  S.forEach((st, i) => {
    s += `<text x="${lx - 6}" y="${26 + top + i * chh + 18}" text-anchor="end" font-size="12" fill="#262626">${st}</text>`;
    E.forEach((e, j) => {
      const leg = (ok[st] || []).includes(j), gu = (g[st] || []).includes(j);
      s += `<rect x="${lx + j * cw + 2}" y="${26 + top + i * chh}" width="${cw - 4}" height="${chh - 4}" rx="4" fill="${leg ? '#2f7d4f' : '#fbe9dc'}" stroke="${leg ? '#2f7d4f' : '#e8c3a5'}"/>`;
      s += `<text x="${lx + j * cw + cw / 2}" y="${26 + top + i * chh + 17}" text-anchor="middle" font-size="12" font-weight="700" fill="${leg ? '#fff' : '#c0392b'}">${leg ? (gu ? '✓ + [g]' : '✓') : '✗'}</text>`;
    });
  });
  return `<svg viewBox="0 0 ${lx + 7 * cw + 4} ${26 + top + 8 * chh + 4}" width="100%" style="max-height:${26 + top + 8 * chh + 4}px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ═════════════════════════════ SLIDES ═════════════════════════════ */
export const slides = lamDeck('SEQUENCE & STATE MACHINE → CODE → TEST', [
  /* 1 */
  { cover: true, t: 'Sequence &amp; State machine → code → test', sub: 'Từ sơ đồ SWD392 tới Java/Spring Boot của LabFlow — và chứng minh code làm đúng sơ đồ' },

  /* 2 */
  { t: 'Deck này nối tiếp Chương 2 như thế nào', body: `${bang([
    ['Bài 2.N–2.O (Ch.9 trường)', 'Sequence/communication, đánh số, bốn bước, khung <b>alt/loop/break/opt/par/critical</b>, chuỗi Controller→Service→Repository', '<b>Không học lại</b> — ở đây mỗi khung thành <b>câu lệnh Java chạy thật</b>'],
    ['Bài 2.P–2.S (Ch.10)', 'Statechart: sự kiện, guard, action, entry/exit, trạng thái hợp, Reservation phác thảo', 'Cài <b>đủ ba cách</b> + <b>test mọi cặp</b> (trạng thái, sự kiện)'],
    ['Bài 2.T–2.U (Ch.11)', 'Tương tác phụ thuộc trạng thái, UC-20 duyệt lượt đặt', 'Thêm <b>sự kiện Spring</b>: đồng bộ, sau commit, @Async'],
    ['Bài 4.E (GoF)', 'State pattern dạng sách', 'State pattern <b>có trạng thái cha</b> + entry/exit'],
  ], ['Đã có ở', 'Đã học', 'Deck ⭐ này thêm'], 'font-size:18px')}
${o('⭐ Phần <b>tự thêm</b>, không có trong giáo trình trường — <b>không thi</b>. Dùng cho: Report 4 (SDS) của đồ án, code LabFlow, câu hỏi phỏng vấn Java/Spring "sơ đồ này code ra sao? test thế nào?".', 'xanh')}
<p class="nho">Mọi log/kết quả trên slide là output thật của chương trình Java trong <code>gen/java/cs3/</code> (Java 17, không cần Spring để chạy).</p>` },

  /* 3 */
  { t: 'Mỗi phần tử sequence là một thứ trong code', body: bang([
    ['Lifeline <code>:ReservationService</code>', 'một <b>đối tượng</b> (bean Spring, entity, DTO…)', 'tên lifeline = tên lớp trong class diagram'],
    ['Thông điệp đồng bộ <b>→</b> (đầu đặc)', 'gọi phương thức, bên gọi <b>chờ</b>', '<code>service.create(cmd)</code>'],
    ['Thông điệp trả về <b>⇠</b> (nét đứt)', 'giá trị <code>return</code> hoặc <b>ngoại lệ</b> ném ra', '<code>throw SlotTakenException</code> → 409'],
    ['Thanh kích hoạt (activation)', 'một khung trên <b>call stack</b>', 'thụt lề trong log = độ sâu stack'],
    ['Tự gọi (self message)', 'gọi hàm của chính mình', '⚠ <b>đi vòng proxy</b> ⇒ @Async/@Transactional mất tác dụng'],
    ['<code>«create»</code>', '<code>new</code> hoặc factory', '<code>new Reservation(lab, slot)</code>'],
    ['Huỷ (dấu <b>X</b>)', 'kết thúc vòng đời có chủ đích', '<code>close()</code> cuối <code>try-with-resources</code> — <span class="do">không phải</span> GC'],
    ['Thông điệp bất đồng bộ <b>⇾</b> (đầu mở)', 'giao việc cho <b>luồng/hệ khác</b>, không chờ', '<code>@Async</code>, executor, message broker'],
    ['Found message (từ chấm đen / actor)', 'điểm vào từ bên ngoài', 'HTTP request vào <code>@RestController</code>'],
  ], ['Trên sơ đồ', 'Trong Java/Spring', 'Ví dụ LabFlow'], 'font-size:17.5px') },

  /* 4 */
  { t: 'Sơ đồ mức thiết kế: Create Reservation', body: seq({
    parts: [{ id: 'C', t: 'Client', actor: true }, { id: 'K', t: 'Reservation|Controller' }, { id: 'S', t: 'Reservation|Service' }, { id: 'E', t: 'Equipment|Repository' }, { id: 'R', t: ':Reservation' }, { id: 'P', t: 'Reservation|Repository' }],
    top: 64, rh: 24, fs: 14.5,
    rows: [
      { k: 's', f: 'C', t: 'K', l: '1: POST /api/v1/reservations' },
      { k: 's', f: 'K', t: 'S', l: '1.1: create(cmd)' },
      { k: 'open', op: 'loop', g: 'for each item in cmd.items', p1: 'S', p2: 'E' },
      { k: 's', f: 'S', t: 'E', l: '1.2*: isFree(item, slot)' },
      { k: 'r', f: 'E', t: 'S', l: 'true / false' },
      { k: 'open', op: 'break', g: 'item is not free', p1: 'K', p2: 'S' },
      { k: 'r', f: 'S', t: 'K', l: 'throw SlotTakenException → 409' },
      { k: 'close' }, { k: 'close' },
      { k: 'c', f: 'S', t: 'R', l: '1.3: «create» new Reservation(lab, slot)' },
      { k: 'open', op: 'alt', g: 'capacity > 40 (BR-08)', p1: 'S', p2: 'R' },
      { k: 's', f: 'S', t: 'R', l: '1.4: markPendingApproval()' },
      { k: 'else', g: 'else' },
      { k: 's', f: 'S', t: 'R', l: '1.4A: confirm()' },
      { k: 'close' },
      { k: 'open', op: 'opt', g: 'note is not blank', p1: 'S', p2: 'R' },
      { k: 's', f: 'S', t: 'R', l: '1.5: attachNote(note)' },
      { k: 'close' },
      { k: 's', f: 'S', t: 'P', l: '1.6: save(r)' },
      { k: 'r', f: 'P', t: 'S', l: 'r (id)' },
    ],
  }) },

  /* 5 */
  { t: 'Code: mỗi khung là một câu lệnh', body: `<div class="hai" style="grid-template-columns:1.25fr 1fr"><div>${ma(`ReservationResponse create(CreateCmd cmd) {
  for (String item : cmd.items()) {             // loop
    if (!equipmentRepo.isFree(item, cmd.slot()))  // 1.2*
      throw new SlotTakenException(item);      // break
  }
  Reservation r = new Reservation(cmd.lab(),
                                  cmd.slot()); // 1.3 «create»
  if (cmd.capacity() > 40)                     // alt
    r.markPendingApproval();                   // 1.4
  else                                         // [else]
    r.confirm();                               // 1.4A
  if (!cmd.note().isBlank())                   // opt
    r.attachNote(cmd.note());                  // 1.5
  Reservation saved = reservationRepo.save(r); // 1.6
  return new ReservationResponse(saved.id, saved.status);
}`, 'font-size:15px')}</div>
<div>${bang([
    ['<b>loop</b> [điều kiện]', '<code>for</code> / <code>while</code>'],
    ['<b>break</b> [điều kiện]', '<code>throw</code> hoặc <code>return</code> sớm — bỏ <b>cả phần còn lại</b>'],
    ['<b>alt</b> [g1] / [else]', '<code>if … else if … else</code>, <code>switch</code>'],
    ['<b>opt</b> [g]', '<code>if</code> không có <code>else</code>'],
    ['<b>par</b>', 'các nhánh chạy song song, chờ hết (slide 7)'],
    ['<b>critical</b>', '<code>synchronized</code>, khoá, ràng buộc CSDL'],
    ['<b>ref</b>', 'gọi sang một sơ đồ khác (hàm khác)'],
  ], ['Khung', 'Java'], 'font-size:17px')}
${o('Guard trong <code>[ ]</code> = <b>đúng biểu thức</b> của <code>if</code>/<code>for</code>. Viết guard mơ hồ ("if ok") là code không viết được.', '')}</div></div>
<p class="nho">File thật <code>ReserveFlowTrace.java</code> có thêm một dòng <code>Seq.frag("…")</code> ở mỗi khung để in log; bỏ dòng đó đi là code service thật.</p>` },

  /* 6 */
  { t: 'Chạy thật: log khớp từng mũi tên', body: `<div style="display:flex;flex-direction:column;gap:4px;margin-top:-12px"><div><p style="font-size:17px"><b>B</b> — món thứ hai đã bị đặt ⇒ <b>break</b> (log thật của <code>ReserveFlowTrace.java</code>)</p>${out(`Client -> ReservationController : 1: POST /api/v1/reservations
  ReservationController -> ReservationService : 1.1: create(cmd)
    [loop for each item in cmd.items]
    ReservationService -> EquipmentRepository : 1.2*: isFree(OSC-1, Tue 09-11)
    ReservationService &lt;-- EquipmentRepository : true
    ReservationService -> EquipmentRepository : 1.2*: isFree(3D-PRN-1, Tue 09-11)
    ReservationService &lt;-- EquipmentRepository : false
    [break item is not free]
  ReservationController &lt;-- ReservationService : throw SlotTakenException(3D-PRN-1)
Client &lt;-- ReservationController : 409 Conflict (SM-12)`, 'font-size:12.6px;line-height:1.36;padding:6px 12px')}</div>
<div><p style="font-size:17px"><b>C</b> — lab 24 chỗ, không ghi chú ⇒ nhánh <b>else</b>, <b>opt</b> bị bỏ qua · thụt lề = thanh kích hoạt</p>${out(`Client -> ReservationController : 1: POST /api/v1/reservations
  ReservationController -> ReservationService : 1.1: create(cmd)
    [loop for each item in cmd.items]
    ReservationService -> EquipmentRepository : 1.2*: isFree(OSC-1, Wed 13-15)
    ReservationService &lt;-- EquipmentRepository : true
    ReservationService -> Reservation : 1.3: &lt;&lt;create&gt;&gt; new Reservation(LAB-2, Wed 13-15)
    [else]
    ReservationService -> Reservation : 1.4A: confirm()
    ReservationService -> ReservationRepository : 1.6: save(r)
    ReservationService &lt;-- ReservationRepository : r (id = 102)
  ReservationController &lt;-- ReservationService : ReservationResponse[id=102, status=CONFIRMED]
Client &lt;-- ReservationController : 201 Created`, 'font-size:12.6px;line-height:1.36;padding:6px 12px')}</div></div>
` },

  /* 7 */
  { t: 'par và critical: song song thật trong Java', body: `<div class="hai" style="grid-template-columns:1.2fr 1fr"><div>${ma(`// par: mở cửa lab VÀ mở phiên sử dụng cùng lúc
CompletableFuture<String> a = CompletableFuture
    .supplyAsync(() -> door.unlock("LAB-1"), pool);  // nhánh 1
CompletableFuture<String> b = CompletableFuture
    .supplyAsync(() -> usage.start(101), pool);      // nhánh 2
CompletableFuture.allOf(a, b).join();   // hết khung par`, 'font-size:15px')}
${out(`[par — both branches start now; their relative order is NOT fixed]
[branch 1]
CheckInService -> DoorGateway : 1.3a: unlock(LAB-1)   (thread par-1)
[branch 2]
CheckInService -> UsageSessionService : 1.3b: start(#101)   (thread par-2)
[end par — allOf(a, b).join() returned]`, 'font-size:13px;margin-top:10px')}</div>
<ul style="font-size:19px">
<li><b>par</b>: thứ tự <b>giữa</b> các nhánh <span class="do">không xác định</span>; trong một nhánh vẫn tuần tự</li>
<li>Đánh số nhánh: <b>1.3a / 1.3b</b> (cùng mức, khác nhánh)</li>
<li>Chương trình phải <b>gom log từng nhánh</b> rồi in sau <code>join()</code> — in thẳng thì mỗi lần chạy một thứ tự khác</li>
<li><b>critical</b>: một luồng một lúc. Với LabFlow, chống đặt trùng bằng <b>ràng buộc CSDL</b> chứ không bằng <code>synchronized</code> (nhiều máy chủ) — ${lnk('bài 2.O')}</li>
</ul></div>` },

  /* 8 */
  { t: 'Đồng bộ hay bất đồng bộ trong Spring?', body: `${bang([
    ['Gọi phương thức thường', 'đồng bộ', '<b>→</b> đầu đặc', 'cùng luồng, cùng giao dịch'],
    ['<code>publishEvent()</code> + <code>@EventListener</code>', '<b class="do">ĐỒNG BỘ</b> (mặc định)', '<b>→</b> đầu đặc', '<code>publishEvent</code> chờ mọi listener xong; listener <b>ở trong</b> giao dịch của bên phát'],
    ['<code>@TransactionalEventListener</code>', 'chạy <b>sau commit</b> (mặc định <code>AFTER_COMMIT</code>)', 'mũi tên <b>sau</b> ghi chú COMMIT', 'không có giao dịch ⇒ <b>không chạy</b> (trừ <code>fallbackExecution = true</code>)'],
    ['<code>@Async</code> (cần <code>@EnableAsync</code>)', 'bất đồng bộ', '<b>⇾</b> đầu mở', 'luồng <code>task-1</code>, <code>task-2</code>… (Spring Boot); trả <code>void</code>/<code>Future</code>/<code>CompletableFuture</code>'],
    ['Message broker (Kafka, RabbitMQ)', 'bất đồng bộ, khác tiến trình', '<b>⇾</b> đầu mở', 'cần outbox để không mất tin — ' + lnk('swarch 9.3')],
  ], ['Cơ chế', 'Kiểu', 'Vẽ', 'Hệ quả'], 'font-size:17px')}
${o('Bẫy hay gặp: vẽ <code>publishEvent</code> thành mũi tên <b>bất đồng bộ</b>. Tài liệu Spring: <i>"by default, event listeners receive events synchronously… <code>publishEvent()</code> blocks until all listeners have finished"</i>.', 'do2')}
<p class="nho">Nguồn: Spring Framework reference (ApplicationContext events · Transaction-bound events · @Async); Spring Boot properties: <code>spring.task.execution.thread-name-prefix</code> mặc định <code>task-</code>.</p>` },

  /* 9 */
  { t: 'Duyệt lượt đặt: sự kiện chạy ở đâu, lúc nào', body: `${seq({
    parts: [{ id: 'K', t: 'Controller' }, { id: 'S', t: 'Reservation|Service (proxy)' }, { id: 'P', t: 'EventPublisher' }, { id: 'A', t: 'Audit|Listener' }, { id: 'E', t: 'Email|Listener' }, { id: 'M', t: 'EmailService' }],
    top: 58, rh: 27, fs: 13.5, x0: 80, x1: 1040,
    rows: [
      { k: 's', f: 'K', t: 'S', l: '1.1: approve(7)' },
      { k: 'note', f: 'S', l: 'BEGIN transaction' },
      { k: 's', f: 'S', t: 'P', l: '1.4: publishEvent(ReservationApproved)' },
      { k: 's', f: 'P', t: 'A', l: '1.4.1: on(event) — cùng luồng, cùng TX' },
      { k: 'note', f: 'P', l: 'EmailListener: AFTER_COMMIT ⇒ chỉ đăng ký' },
      { k: 'r', f: 'P', t: 'S', l: 'trả về sau listener đồng bộ' },
      { k: 'note', f: 'S', l: '1.5: save(#7) … COMMIT' },
      { k: 'a', f: 'S', t: 'E', l: '2: on(event) — sau commit, @Async' },
      { k: 'r', f: 'S', t: 'K', l: 'done → 200 OK' },
      { k: 's', f: 'E', t: 'M', l: '2.1: send() [task-1]' },
    ],
  })}
${out(`[http-nio-8080-exec-1]   (proxy: COMMIT — INSERT audit_log, UPDATE reservation #7 = CONFIRMED)
[http-nio-8080-exec-1]   (after commit) ReservationService ->> EmailListener : 2: on(event)
[http-nio-8080-exec-1]      @Async -> handed to the task executor; the caller does not wait
[http-nio-8080-exec-1] Client &lt;-- ReservationController : 200 OK
[task-1] EmailListener -> EmailService : 2.1: send(an.nguyen, "#7 is confirmed")`, 'font-size:13px')}` },

  /* 10 */
  { t: 'Khi giao dịch rollback: ai đã lỡ làm?', body: `${bang([
    ['AuditListener — <code>@EventListener</code>, ghi CSDL', 'đã chạy, nhưng <b>INSERT bị huỷ</b> cùng giao dịch ✓', 'đã chạy, INSERT bị huỷ ✓'],
    ['Email — <code>@Async @TransactionalEventListener</code>', '<b>không bao giờ chạy</b> ✓', '—'],
    ['Email — <code>@EventListener</code> thường', '—', '<b class="do">email ĐÃ GỬI</b> cho lượt đặt không tồn tại ✗'],
  ], ['Listener', 'B: save lỗi ⇒ ROLLBACK (đúng)', 'C: cùng lỗi, listener ngây thơ'], 'font-size:18px')}
${out(`== C: the same rollback with a plain @EventListener sending the email
      ApplicationEventPublisher -> NaiveEmailListener : 1.4.2: on(event)   @EventListener: now, same thread, same transaction
         NaiveEmailListener -> EmailService : send(an.nguyen, "#7 is confirmed")  &lt;- sent NOW
    ReservationService -> ReservationRepository : 1.5: save(#7)
  (proxy: ROLLBACK because version changed (optimistic lock) — discarded: INSERT audit_log)
Client &lt;-- ReservationController : 409 Conflict (SM-18)`, 'font-size:12.5px;margin-top:4px')}
<div class="hai"><ul style="font-size:18px">
<li>Việc <b>trong CSDL</b> (audit, cập nhật bảng đọc) ⇒ <code>@EventListener</code>: đi cùng giao dịch</li>
<li>Việc <b>ra ngoài</b> (email, SMS, gọi API) ⇒ <code>@TransactionalEventListener</code> (+ <code>@Async</code>)</li>
</ul>
${o('Sau commit mà còn ghi CSDL: tài liệu Spring dặn dùng <code>REQUIRES_NEW</code>. Cần chắc chắn không mất tin ⇒ <b>outbox</b> ' + lnk('swarch 9.3'), 'xanh')}</div>` },

  /* 11 */
  { t: 'Bẫy tự gọi (self-invocation)', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${ma(`class ReminderServiceImpl implements ReminderService {
    @Async
    public void sendReminder(long id) { … }

    public void remindAll(List<Long> ids) {
        for (long id : ids)
            this.sendReminder(id);   // KHÔNG qua proxy
    }
}`, 'font-size:15px')}
${out(`-- 2. the controller calls remindAll([8, 9]); remindAll calls this.sendReminder()
[http-nio-8080-exec-1] proxy: remindAll is a normal method -> call the target directly
[http-nio-8080-exec-1] sendReminder(8) runs
[http-nio-8080-exec-1] sendReminder(9) runs
-- 3. fix: the @Async method lives in another bean
[task-1] send(8) runs
[task-1] send(9) runs`, 'font-size:12.5px;margin-top:10px')}</div>
<ul style="font-size:19px">
<li>Spring thực thi <code>@Async</code>, <code>@Transactional</code> bằng một <b>proxy</b> đứng trước bean</li>
<li>Gọi từ bean khác ⇒ đi qua proxy ✓; <code>this.x()</code> ⇒ <b>đi thẳng</b>, annotation <span class="do">vô hiệu</span></li>
<li>Tài liệu Spring: chế độ <code>proxy</code> mặc định <i>"local calls within the same class cannot get intercepted"</i></li>
<li>Sửa: tách hàm sang <b>bean khác</b> (thường gặp nhất), hoặc chế độ AspectJ</li>
<li>Trên sequence: vẽ <b>lifeline proxy</b> riêng thì thấy ngay mũi tên nào đi vòng</li>
</ul></div>` },

  /* 12 */
  { t: '«create» và huỷ đối tượng (X)', body: `<div class="hai" style="grid-template-columns:1fr 1fr">${seq({
    parts: [{ id: 'S', t: 'CheckInService' }, { id: 'Q', t: ':QrScan' }, { id: 'R', t: 'QrToken|Repository' }],
    w: 560, x0: 80, x1: 470, top: 40, rh: 42, fs: 15,
    rows: [
      { k: 'c', f: 'S', t: 'Q', l: '1.2: «create» open(qr)' },
      { k: 's', f: 'S', t: 'Q', l: '1.3: verifySignature()' },
      { k: 's', f: 'S', t: 'Q', l: '1.4: consume()' },
      { k: 's', f: 'Q', t: 'R', l: '1.4.1: markUsed' },
      { k: 'r', f: 'R', t: 'Q', l: '1 row / 0 rows' },
      { k: 'r', f: 'Q', t: 'S', l: '#101 / throw' },
      { k: 's', f: 'S', t: 'Q', l: '1.5: close()' },
      { k: 'x', f: 'Q' },
    ],
  })}
<div>${ma(`try (QrScan scan = QrScan.open(qr, repo)) { // «create»
    scan.verifySignature();
    long id = scan.consume();  // 0 rows ⇒ throw
    return "#" + id + " CHECKED_IN";
}   // close() = «destroy», cả khi có ngoại lệ`, 'font-size:14.5px')}
<ul style="font-size:18px;margin-top:8px">
<li>Lần quét thứ hai: <code>markUsed</code> → <b>0 rows</b> → ném lỗi → <code>close()</code> <b>vẫn chạy</b> → 409</li>
<li>Đối tượng do <b>repository trả về</b> (entity có sẵn) <span class="do">không</span> vẽ «create»</li>
<li>GC thu hồi lúc nào không biết ⇒ <b>không phải</b> «destroy»</li>
</ul></div></div>` },

  /* 13 */
  { t: 'Vẽ sequence TỪ code (dịch ngược)', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>${ma(`<T> T wrap(String name, Class<T> type, T target) {
  return (T) Proxy.newProxyInstance(…, (p, m, args) -> {
    String caller = stack.isEmpty() ? "Client" : stack.peek();
    lines.add(caller + " -> " + name + " : " + m.getName() + …);
    stack.push(name);
    Object result = m.invoke(target, args);
    lines.add(name + " --> " + caller + " : " + result);
    stack.pop();
    return result;
  });
}`, 'font-size:13.5px')}
<p style="font-size:17px;margin-top:8px">Bọc mỗi bean bằng một <b>proxy ghi chép</b> (đúng cơ chế Spring AOP), chạy <b>một</b> request thật, in ra PlantUML ⇒ dán vào <code>.puml</code> là có sơ đồ.</p></div>
<div>${out(`Client -> ReservationController : cancel(101)
ReservationController -> ReservationService : cancel(101)
ReservationService -> ReservationRepository : findStatus(101)
ReservationRepository --> ReservationService : CONFIRMED
ReservationService -> ReservationRepository : updateStatus(101, CANCELLED)
ReservationRepository --> ReservationService
ReservationService -> WaitlistService : promote(LAB-1, Tue 09-11)
WaitlistService --> ReservationService : offered to entry #12
ReservationController --> Client : 204 No Content`, 'font-size:12.5px')}
<p class="nho" style="margin-top:4px">Output thật, đã bỏ các dòng <code>activate/deactivate</code>; code bên trái rút gọn (bản đủ có <code>try/catch/finally</code>).</p>
<ul style="font-size:17.5px;margin-top:8px">
<li>Ra <b>dạng thể hiện</b> (một kịch bản): <b>không có</b> alt/loop — khung phải tự thêm</li>
<li>Hàm <code>private log()</code> gọi nội bộ <b>không hiện</b> — proxy không thấy</li>
<li>Ngoài đời: plugin IDE, hoặc <b>trace phân tán</b> (OpenTelemetry) cho cả hệ nhiều dịch vụ</li>
</ul></div></div>` },

  /* 14 */
  { t: 'Viết test TỪ sequence: kiểm thứ tự thông điệp', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${ma(`// expected = các mũi tên đi ra từ ReservationService, trên → dưới
check("B  second item taken -> break", make,
    new CreateCmd("LAB-2", 24, List.of("OSC-1", "3D-PRN-1", "PSU-2"), ""),
    List.of("3D-PRN-1"),                       // món đã bị đặt
    List.of("isFree(OSC-1)", "isFree(3D-PRN-1)",
            "throw SlotTakenException(3D-PRN-1)"));`, 'font-size:14px')}
${out(`ServiceV2 (follows the diagram)
  3 passed, 0 failed
ServiceV1 (the 'small refactor')
  FAIL B  second item taken -> break — message 3: expected throw
       SlotTakenException(3D-PRN-1), got isFree(PSU-2)
  2 passed, 1 failed`, 'font-size:13px;margin-top:10px')}</div>
<ul style="font-size:18.5px">
<li><b>Spy</b> (gián điệp) ghi mọi lời gọi đi ra vào <b>một danh sách chung</b> ⇒ so với sơ đồ</li>
<li>Cùng ý tưởng <code>InOrder</code> của Mockito, ở đây tự viết, không thư viện</li>
<li><code>new</code> không theo dõi được ⇒ tạo qua <b>factory</b></li>
<li>V1 "gom món bị chiếm rồi quyết ở cuối": kết quả vẫn 409, nhưng <b>hỏi thừa</b> PSU-2 ⇒ test bắt</li>
<li>⚠ Test thứ tự <b>giòn</b>: bắt cả thay đổi vô hại. Chỉ dùng cho thứ tự <b>có nghĩa nghiệp vụ</b> (kiểm chỗ trước khi lưu, trả ca trước khi mời người chờ)</li>
</ul></div>` },

  /* 15 */
  { t: 'Quy trình hai chiều sơ đồ ⇄ code', body: `${bang([
    ['1', 'Lấy <b>một luồng</b> của use case (chuỗi chính + nhánh) — bài 2.O', 'đặc tả UC-12/UC-20'],
    ['2', 'Đổi đối tượng phân tích → <b>lớp thiết kế</b> (Controller, Service, Repository, entity)', 'tên lifeline = tên lớp'],
    ['3', 'Mỗi mũi tên → <b>một chữ ký phương thức</b> (tên, tham số, kiểu trả về/ngoại lệ)', 'class diagram có đủ phương thức đó'],
    ['4', 'Mỗi khung → <code>if/for/throw</code>, guard → <b>biểu thức</b>', 'không còn guard mơ hồ'],
    ['5', 'Chạy, in <b>vết</b> (trace) — so với sơ đồ từng dòng', 'log / trace / test thứ tự'],
    ['6', 'Code đổi ⇒ <b>vẽ lại từ trace</b>, đừng để sơ đồ "chết"', 'sơ đồ sống trong repo (PlantUML)'],
  ], ['Bước', 'Làm gì', 'Kết quả kiểm được'], 'font-size:18px')}
<div class="hai">${o('<b>Report 4 (SDS)</b>: sequence <b>mức thiết kế</b> — lifeline là lớp thật, thông điệp là phương thức thật, có khung cho nhánh. Hội đồng hay hỏi: "phương thức này nằm ở class nào trong class diagram?"', 'xanh')}
${o('Nhất quán ba sơ đồ: mỗi thông điệp tới một entity có trạng thái thường là <b>một sự kiện</b> trên statechart của nó (<code>confirm()</code> ↔ sự kiện <code>APPROVE</code>) — phần sau', '')}</div>` },

  /* 16 */
  { t: 'Máy trạng thái Reservation đầy đủ', body: `${statechart()}
<p class="nho" style="margin-top:2px">Tên trạng thái theo SRS LabFlow (PENDING_APPROVAL…REJECTED). <b class="do">EXPIRED ⭐</b> là <b>đề xuất bổ sung</b> (yêu cầu chờ duyệt tới giờ bắt đầu mà chưa ai quyết) — SRS hiện chưa có; muốn dùng phải thêm BR + cột trạng thái.</p>` },

  /* 17 */
  { t: 'Thứ tự hành động: exit → effect → entry', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
<ol style="font-size:19px">
<li><b>exit</b> từ trạng thái <b>trong cùng</b> ra ngoài, dừng ở trạng thái cha <b>chung</b> của nguồn và đích</li>
<li><b>effect</b> của chuyển tiếp (<code>/ Promote Waitlist</code>)</li>
<li><b>entry</b> từ <b>ngoài</b> vào trong tới đích</li>
</ol>
${o('<b>Vì sao quan trọng ở LabFlow</b>: <code>Release Slot</code> (exit Holding Slot) chạy <b>trước</b> <code>Promote Waitlist</code> (effect) ⇒ khi mời người chờ thì ca <b>đã trống</b>. Đảo thứ tự = mời người vào một ca vẫn đang bị giữ.', 'do2')}
<p style="font-size:18px;margin-top:8px">APPROVE: nguồn và đích cùng trong <b>Awaiting Use</b> ⇒ <b>không</b> exit/entry Holding Slot.</p></div>
<div>${out(`CANCEL từ CONFIRMED
  exit CONFIRMED/Invalidate QR Token
  exit Holding Slot/Release Slot
  effect/Promote Waitlist

APPROVE từ PENDING_APPROVAL
  effect/Record Approver
  entry CONFIRMED/Issue QR Token

CHECK_OUT từ CHECKED_IN
  exit CHECKED_IN/End Usage Session
  exit Holding Slot/Release Slot
  entry COMPLETED/Ask for Feedback`, 'font-size:15px')}
<p class="nho" style="margin-top:6px">Output thật của <code>ReservationMachines.java</code>, giống hệt ở cả ba cách cài.</p></div></div>` },

  /* 18 */
  { t: 'Cách 1: enum + bảng chuyển (transition table)', body: `${ma(`record Row(Node source, Ev event, String guardText, Predicate<Facts> guard, List<String> effects, Node target) {}
static final List<Row> ROWS = List.of(
  new Row(PENDING_APPROVAL, APPROVE,  "slot still free", Facts::slotFree,    List.of("Record Approver"),  CONFIRMED),
  new Row(AWAITING_USE,     CANCEL,   "before start",    Facts::beforeStart, List.of("Promote Waitlist"), CANCELLED),
  new Row(CONFIRMED,        SCAN_QR,  "within check-in window", Facts::inCheckInWindow, List.of(),   CHECKED_IN), …);

public void fire(Ev e, Facts f) {
  for (Node n = current; n != null; n = n.parent)        // trạng thái trong cùng trước, rồi tới cha
    for (Row r : ROWS)
      if (r.source() == n && r.event() == e) {
        if (!r.guard().test(f)) throw new IllegalTransitionException(status(), e, "guard [" + r.guardText() + "] is false");
        take(r); return;                                  // exit… → effect → entry…
      }
  throw new IllegalTransitionException(status(), e, "no transition");
}`, 'font-size:13.5px')}
<div class="hai"><ul style="font-size:18px">
<li><code>enum Node</code> giữ <b>cha</b>, <b>entry</b>, <b>exit</b> của từng trạng thái</li>
<li>Bảng = <b>dữ liệu</b>: một dòng = một mũi tên trên statechart</li>
</ul><ul style="font-size:18px">
<li>Cùng bảng sinh được <b>sơ đồ PlantUML</b> và <b>ca kiểm thử</b> (bài tập 5)</li>
<li>Cột CSDL: <code>@Enumerated(EnumType.STRING)</code> — lưu tên, không lưu số thứ tự</li>
</ul></div>` },

  /* 19 */
  { t: 'Cách 2: State pattern có trạng thái cha', body: `<div class="hai" style="grid-template-columns:0.9fr 1.1fr"><div>
<svg viewBox="0 0 520 330" width="100%" font-family="Arial, sans-serif">
<defs><marker id="kt" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#fff" stroke="#595959" stroke-width="1.4"/></marker></defs>
${[[185, 8, 150, 'RState', 'mọi sự kiện: ném lỗi'], [60, 98, 170, 'HoldingSlot', 'exit / Release Slot'], [10, 188, 170, 'AwaitingUse', 'cancel()'], [270, 188, 150, 'CheckedIn', 'checkOut()'], [0, 268, 170, 'PendingApproval', 'approve() reject()…'], [200, 268, 150, 'Confirmed', 'scanQr() …'], [360, 98, 150, 'Completed …', '(lá, không cha)']]
    .map(([x, y, w, t, d]) => `<rect x="${x}" y="${y}" width="${w}" height="52" rx="6" fill="#fff7ef" stroke="#b85a2b" stroke-width="1.8"/><text x="${x + w / 2}" y="${y + 21}" text-anchor="middle" font-size="15" font-weight="700" font-style="${['RState', 'HoldingSlot', 'AwaitingUse'].includes(t) ? 'italic' : 'normal'}" fill="#262626">${t}</text><text x="${x + w / 2}" y="${y + 41}" text-anchor="middle" font-size="12.5" fill="#595959">${d}</text>`).join('')}
${[[145, 98, 230, 60], [95, 188, 130, 150], [345, 188, 165, 150], [85, 268, 85, 240], [275, 268, 110, 240], [435, 98, 300, 60]].map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#595959" stroke-width="1.6" marker-end="url(#kt)"/>`).join('')}
</svg>
<p class="nho">Trạng thái cha = <b>lớp cha trừu tượng</b>; chuyển tiếp gộp (<code>CANCEL</code>) viết <b>một lần</b> ở <code>AwaitingUse</code>.</p></div>
<div>${ma(`final class Confirmed extends AwaitingUse {
  void onEntry(StateMachineCtx m, int keep) {
    super.onEntry(m, keep);                    // NGOÀI trước
    m.log("entry CONFIRMED/Issue QR Token");
  }
  void onExit(StateMachineCtx m, int keep) {
    m.log("exit CONFIRMED/Invalidate QR Token");
    super.onExit(m, keep);                     // TRONG trước
  }
  RState scanQr(StateMachineCtx m, Facts f) {
    if (!f.inCheckInWindow())
      throw guardFalse(Ev.SCAN_QR, "within check-in window");
    return m.go(this, new CheckedIn());
  }
}`, 'font-size:14px')}
<p style="font-size:17px;margin-top:6px"><code>keep</code> = số tầng cha mà nguồn và đích <b>cùng nằm trong</b> — các tầng đó không exit/entry.</p></div></div>` },

  /* 20 */
  { t: 'Cách 3: Spring Statemachine (giới thiệu)', body: `<div class="hai" style="grid-template-columns:1.25fr 1fr"><div>${ma(`@Configuration @EnableStateMachine
class ReservationStateMachineConfig
    extends EnumStateMachineConfigurerAdapter<Node, Ev> {
  public void configure(StateMachineStateConfigurer<Node, Ev> states) {
    states.withStates().initial(HOLDING_SLOT)
          .state(HOLDING_SLOT, log("entry …Hold Slot"), log("exit …Release Slot"))
      .and().withStates().parent(HOLDING_SLOT).initial(AWAITING_USE) …
      .and().withStates().parent(AWAITING_USE).initial(PENDING_APPROVAL) …;
  }
  public void configure(StateMachineTransitionConfigurer<Node, Ev> t) {
    t.withExternal().source(PENDING_APPROVAL).target(CONFIRMED)
       .event(APPROVE).guard(fact(Facts::slotFree))
       .action(log("effect/Record Approver")).and()
     .withExternal().source(AWAITING_USE).target(CANCELLED)
       .event(CANCEL).guard(fact(Facts::beforeStart)) …;
  }
}`, 'font-size:13px')}</div>
<ul style="font-size:17.5px">
<li>Là <b>bảng chuyển viết bằng DSL</b>: <code>source/target/event/guard/action</code>; trạng thái lồng bằng <code>parent()</code></li>
<li>Sự kiện không được nhận: thư viện <b>không ném lỗi</b> — kết quả có <code>ResultType</code> <code>ACCEPTED / DENIED / DEFERRED</code> ⇒ service <b>tự đổi thành 409</b></li>
<li>Bản 4.x: <code>sendEvent</code> dạng <b>reactive</b>; hàm chặn đã deprecate từ 3.0</li>
<li><span class="do">Tình trạng</span>: blog Spring 21/04/2025 — <b>4.0.x là dòng mã nguồn mở cuối</b>; kho GitHub <b>lưu trữ (archived) 05/07/2026</b>, "no longer maintained"</li>
</ul></div>
<p class="nho">Code trên là <b>dáng API</b> — trong <code>ReservationMachines.java</code> các lớp này là bản giả tự viết để chạy được; tên thật nằm trong <code>org.springframework.statemachine.*</code>.</p>` },

  /* 21 */
  { t: 'So sánh ba cách cài', body: `${bang([
    ['Hình dạng', 'dữ liệu (bảng)', 'lớp + kế thừa', 'DSL cấu hình'],
    ['Đọc ↔ sơ đồ', '<b>1 dòng = 1 mũi tên</b>', 'phải mở nhiều lớp', '1 khối <code>withExternal</code> = 1 mũi tên'],
    ['Trạng thái cha, entry/exit', 'tự viết bộ máy (~40 dòng)', 'lớp cha + <code>super</code> đúng thứ tự', 'có sẵn'],
    ['Mỗi trạng thái nhiều logic riêng', 'lambda trong bảng', '<b>hợp nhất</b>', 'action/guard bean'],
    ['Lưu/khôi phục từ CSDL', 'cột enum → <code>Node.valueOf</code>', 'enum → <code>of(status)</code>', 'persister / reset máy'],
    ['Phụ thuộc', 'không', 'không', 'thư viện <b>đã ngừng bảo trì</b> bản mở'],
    ['Hợp với LabFlow', '<b class="do">chọn cái này</b> (8 trạng thái, 7 sự kiện)', 'khi logic từng trạng thái lớn', 'không khuyên cho dự án mới'],
  ], ['', 'enum + bảng', 'State pattern', 'Spring Statemachine'], 'font-size:16px')}
${o('Quy trình dài nhiều ngày, nhiều người duyệt, cần hẹn giờ bền ⇒ <b>workflow engine</b> (Temporal, Camunda) — ' + lnk('swarch 9.6'), 'xanh')}` },

  /* 22 */
  { t: 'Kiểm thử máy trạng thái: phải phủ những gì', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${maTran()}
<p class="nho">8 trạng thái × 7 sự kiện = <b>56 cặp</b>: 8 hợp lệ (xanh, 4 có guard) và <b class="do">48 cặp cấm</b>.</p></div>
${bang([
    ['Mọi trạng thái', 'mỗi trạng thái được đi vào ≥ 1 lần', 'yếu'],
    ['Mọi chuyển tiếp', '8 mũi tên + 2 nhánh khởi tạo', 'trung bình'],
    ['Mọi guard sai', '4 ca: ném lỗi, <b>không đổi gì</b>', 'bắt điều kiện bị quên'],
    ['Mọi cặp cấm (sneak path)', '48 ca: phải ném lỗi', '<b>mạnh nhất</b> — bắt "lối lẻn"'],
    ['Thứ tự hành động', 'so danh sách exit/effect/entry', 'bắt lỗi thứ tự'],
  ], ['Mức phủ', 'Ở Reservation', 'Bắt được'], 'font-size:16.5px')}</div>
${o('Kết quả mong đợi phải <b>viết tay từ statechart</b>. Nếu sinh nó từ chính bảng đang test thì bảng sai ⇒ kết quả mong đợi cũng sai ⇒ test vẫn xanh.', 'do2')}` },

  /* 23 */
  { t: 'Bộ test tự viết, chạy thật trên cả ba cách', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>${ma(`@Retention(RUNTIME) @Target(METHOD) @interface Test {}

@Test void t4_everyForbiddenPairThrows() {
  for (Status s : Status.values())
    for (Ev e : Ev.values()) {
      if (legal.contains(s + "/" + e)) continue;
      ReservationMachine m = restore.apply(s);
      Check.throwsIllegal(s + " + " + e,
          () -> m.fire(e, Facts.ok()));
    }
}
// Runner: getDeclaredMethods() → lọc @Test
// → sắp theo tên → invoke() → đếm pass/fail`, 'font-size:14px')}</div>
<div>${out(`== Contract test: one hand-written suite, three implementations
  enum + transition table        76 passed, 0 failed
  State pattern                  76 passed, 0 failed
  Spring-style DSL               76 passed, 0 failed
  checks per implementation: 2 creations x2 + 8 legal x2
    + 4 false guards x2 + 48 forbidden pairs = 76
== Seeded bug: the table engine runs the effect
   BEFORE the exit actions
  enum + table (bug)             71 passed, 5 failed
    FAIL PENDING_APPROVAL + REJECT actions:
      expected [exit Holding Slot/Release Slot, effect/…]
      got      [effect/Notify Requester, …, exit Holding Slot/…]
    ... and 3 more of the same kind`, 'font-size:13px')}
<p class="nho" style="margin-top:4px">Output thật; hai dòng dài được ngắt dòng, danh sách hành động rút gọn bằng "…".</p>
<ul style="font-size:17px;margin-top:6px"><li><b>Contract test</b>: một bộ test, nhiều bản cài — đổi cách cài không phải viết lại test</li>
<li>Dự án thật: JUnit 5 <code>@ParameterizedTest</code> + <code>@MethodSource</code> làm đúng việc vòng lặp này</li></ul></div></div>` },

  /* 24 */
  { t: 'Lỗi mất điểm & checklist trước khi nộp', body: `<div class="hai"><div><p style="font-size:20px"><b>Sequence</b></p><ul style="font-size:19px">
<li>Lifeline/phương thức <b>không có</b> trong class diagram</li>
<li>Actor gọi thẳng entity (bỏ qua boundary/controller)</li>
<li>Khung không có guard, guard không dịch được ra code</li>
<li>Thiếu mũi tên trả về khi giá trị <b>được dùng</b> ở bước sau</li>
<li><code>publishEvent</code> vẽ như bất đồng bộ; quên vẽ sau-commit</li>
<li>Đánh số lệch: con của 1.1 phải là 1.1.x</li>
</ul></div>
<div><p style="font-size:20px"><b>State machine</b></p><ul style="font-size:19px">
<li>Tên trạng thái là <b>động từ</b> ("Approve") — đó là sự kiện</li>
<li>Thiếu trạng thái đầu; trạng thái cuối lại có mũi tên đi ra</li>
<li>Guard không có <code>[ ]</code>, action không có <code>/</code></li>
<li>Cùng một exit lặp trên 4 mũi tên ⇒ dùng <b>trạng thái cha</b></li>
<li>Code cho phép chuyển mà sơ đồ cấm (<b>sneak path</b>)</li>
<li>Sự kiện trên statechart ≠ tên thông điệp trên sequence</li>
</ul></div></div>
${o('Đi tiếp: ' + lnk('2.O') + ' khung UML · ' + lnk('2.Q–2.R') + ' guard, entry/exit, phân cấp · ' + lnk('4.E') + ' State pattern GoF · ' + lnk('swarch 7.4') + ' domain event · ' + lnk('swarch 9.3') + ' outbox', 'xanh')}` },
]);
