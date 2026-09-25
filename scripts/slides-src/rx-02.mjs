/**
 * React · Deck rx-02 — Chương 2: State và sự kiện.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử
 * SCRATCH/rx/du-an/ch02 (react 19.3.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 · oxlint 1.85.0 · immer 11.1.18):
 *   npx vitest run src/vi-du --reporter=verbose   (bai1 · bai2 · bai3 · bai3-ui · bai4 — 30 test)
 *   npx tsc -b (hai lỗi cố ý: TS2345 useState(null), TS2322 onClick={tang()})
 *   npx oxlint vi-du-sai/ (rules-of-hooks)
 *   node form-reload.mjs (Playwright, Chromium thật: form không preventDefault ⇒ tải lại trang)
 * Ảnh chụp giao diện: node scripts/rx-chup.mjs … ⇒ scripts/slides-src/rx-anh/rx-02/*.jpg
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, renderFlow, anh, kpis,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-02', code: 'REACT · CHƯƠNG 2', title: 'State và sự kiện', sub: 'React · Chương 2' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 6 — snapshot: ba lần set(soLuot + 1) vs ba lần set(n => n + 1) ───────── */
const snapshot = () => {
  let s = '';
  const col = (x, title, c, rows, kq, kqc) => {
    s += R(x, 0, 540, 420, { c, fill: '#0f182a' }) + T(x + 24, 38, title, { fs: 20, b: true, c });
    rows.forEach(([a, b], i) => {
      const y = 70 + i * 74;
      s += R(x + 20, y, 300, 56, { c: 'dim', fill: '#0b1322', r: 10 }) + T(x + 36, y + 35, a, { fs: 17, mono: true });
      s += A(x + 326, y + 28, x + 368, y + 28, { c: 'mu', sw: 2.5 });
      s += T(x + 378, y + 35, b, { fs: 17, mono: true, c: 'amb' });
    });
    s += R(x + 20, 312, 500, 88, { c: kqc, fill: kqc === 'red' ? 'rgba(255,92,108,.08)' : 'rgba(63,185,80,.08)' });
    s += T(x + 40, 348, kq[0], { fs: 19, b: true, c: kqc }) + T(x + 40, 380, kq[1], { fs: 15.5, c: 'mu' });
  };
  col(0, 'setSoLuot(soLuot + 1) × 3', 'red',
    [['setSoLuot(0 + 1)', 'đặt = 1'], ['setSoLuot(0 + 1)', 'đặt = 1'], ['setSoLuot(0 + 1)', 'đặt = 1']],
    ['Kết quả: 1', 'soLuot là HẰNG = 0 suốt lần render này'], 'red');
  col(600, 'setSoLuot(n => n + 1) × 3', 'grn',
    [['n => n + 1', '0 → 1'], ['n => n + 1', '1 → 2'], ['n => n + 1', '2 → 3']],
    ['Kết quả: 3', 'React xếp hàng các HÀM, chạy lần lượt'], 'grn');
  return sv(1140, 420, s);
};

/* ───────── Slide 11 — sự kiện nổi bọt ───────── */
const noiBot = () => {
  let s = '';
  s += R(40, 30, 480, 300, { c: 'rx', fill: '#0f182a' }) + T(64, 66, '<article onClick={moChiTiet}>', { fs: 17, mono: true, c: 'rx', b: true });
  s += T(64, 100, 'BS. Phạm Ngọc Lan', { fs: 20, b: true });
  s += R(90, 150, 330, 120, { c: 'amb', fill: '#221c0c' }) + T(112, 186, '<button onClick={themYeuThich}>', { fs: 16, mono: true, c: 'amb', b: true });
  s += T(112, 226, '♡  ← bấm ở đây', { fs: 20, b: true, c: 'amb' });
  s += `<path d="M255 150 C255 120 300 110 300 82" stroke="${D.amb}" stroke-width="3" fill="none" stroke-dasharray="7 6" marker-end="url(#m-amb)"/>`;
  s += T(310, 130, 'nổi bọt lên cha', { fs: 15, c: 'amb' });
  const out = (y, h, title, c, lines) => {
    s += R(580, y, 540, h, { c, fill: '#070c16', r: 12 }) + T(600, y + 32, title, { fs: 17, b: true, c });
    lines.forEach((ln, i) => { s += T(600, y + 66 + i * 28, ln, { fs: 16, mono: true, c: i === lines.length - 1 && c === 'red' ? 'red' : '#e6edf3' }); });
  };
  out(20, 150, 'Không chặn — nhật ký thật:', 'red', ["[ 'nút: thêm yêu thích',", "  'thẻ: mở chi tiết' ]"]);
  out(190, 150, 'e.stopPropagation() trong nút:', 'grn', ["[ 'nút: thêm yêu thích' ]"]);
  s += T(40, 380, 'Mọi sự kiện React đều nổi bọt, trừ onScroll. Muốn bắt trước con: onClickCapture.', { fs: 16, c: 'mu' });
  return sv(1140, 400, s);
};

/* ───────── Slide 16 — spread từng tầng: cái mới, cái cũ, cái dùng chung ───────── */
const spreadTang = () => {
  let s = '';
  const box2 = (x, y, w, h, title, lines, c) => {
    s += R(x, y, w, h, { c, fill: '#0f182a' }) + T(x + 18, y + 32, title, { fs: 18, b: true, c });
    lines.forEach((ln, i) => { s += T(x + 18, y + 62 + i * 26, ln, { fs: 15, mono: true, c: 'mu' }); });
  };
  box2(20, 20, 330, 140, 'lh (cũ)', ["id: 'lh-1'", "lyDo: 'Bé ho 3 ngày'", 'benhNhan: ●'], 'dim');
  box2(20, 250, 330, 140, 'lh.benhNhan (cũ)', ["hoTen: 'Nguyễn Văn A'", "soDienThoai: '0901…567'"], 'dim');
  box2(780, 20, 340, 140, 'moi = { ...lh, … }', ["id, lyDo: CHÉP sang", 'benhNhan: ● (object MỚI)'], 'grn');
  box2(780, 250, 340, 140, '{ ...lh.benhNhan, … }', ['hoTen: CHÉP sang', "soDienThoai: '0987…321'"], 'grn');
  s += A(250, 140, 250, 246, { c: 'dim' }) + A(1000, 140, 1000, 246, { c: 'grn' });
  s += R(420, 110, 290, 170, { c: 'amb', fill: 'rgba(255,194,51,.06)' });
  s += T(565, 146, 'kết quả đo thật', { fs: 16, c: 'amb', a: 'middle', b: true });
  s += T(565, 182, 'moi === cu  → false', { fs: 16, mono: true, a: 'middle' });
  s += T(565, 212, 'moi.benhNhan === cu.benhNhan', { fs: 14.5, mono: true, a: 'middle' });
  s += T(565, 236, '→ false', { fs: 16, mono: true, a: 'middle' });
  s += T(565, 264, "cu: '0901234567' nguyên", { fs: 14.5, mono: true, a: 'middle', c: 'grn' });
  return sv(1140, 410, s);
};

/* ───────── Slide 20/21 — cây component ───────── */
const cayTruoc = () => compTree({
  w: 540, h: 300, bw: 200, root: { n: 'KhuBacSi', kids: [
    { n: 'ThanhLoc', s: '● ck = "nhi"', st: true },
    { n: 'DanhSach', s: '● ck = "tat-ca"', st: true },
  ] },
});
const caySau = () => compTree({
  w: 540, h: 300, bw: 200, root: { n: 'KhuBacSi', s: '● ck', st: true, kids: [
    { n: 'ThanhLoc', s: 'props: ck, onDoi' },
    { n: 'DanhSach', s: 'props: danhSach' },
  ] },
});
const cayKhu = () => compTree({
  w: 1100, h: 400, bw: 200, legend: true, root: { n: 'App', kids: [
    { n: 'Header', s: 'không đổi' },
    { n: 'KhuBacSi', w: 250, s: '● 4 state · gõ phím', st: true, r: true, kids: [
      { n: 'ChipChuyenKhoa', w: 196, r: true, s: 'giaTri, onDoi' },
      { n: 'OTimBacSi', w: 196, r: true, s: 'tuKhoa, onDoi' },
      { n: 'DanhSachBacSi', w: 196, r: true, s: 'danhSach (đã lọc)' },
      { n: 'ChiTietBacSi', w: 196, r: true, s: 'bacSi | null' },
    ] },
  ] },
});

export const slides = S([
  /* 1 */ cover({ t: 'Chương 2 — State và sự kiện', sub: 'useState & render lại · xử lý sự kiện · cập nhật bất biến · state nên ở đâu', chap: 'CHƯƠNG 2' }),

  /* 2 */ { t: 'Bản đồ chương: dữ liệu đổi thì React vẽ lại — và chỉ khi bạn báo', body: mindmap('State', 'bộ nhớ của component — đổi nó bằng set…, React tự vẽ lại', [
    { t: '2.1 useState & render lại', d: 'snapshot · cập nhật theo hàm · batching · luật hook', c: 'rx' },
    { t: '2.2 Sự kiện', d: 'onClick nhận hàm · nổi bọt · preventDefault · kiểu TS', c: 'tea' },
    { t: '2.3 Object & mảng bất biến', d: 'Object.is · spread · toSorted · Immer · StrictMode', c: 'vio' },
    { t: '2.4 State nên ở đâu', d: 'nâng state · một nguồn sự thật · state dẫn xuất', c: 'amb' },
    { t: '2.5 🛠 Màn hình bác sĩ', d: 'lọc · tìm không dấu · chi tiết · yêu thích · 24 test', c: 'grn' },
  ]) },

  /* ───── 2.1 ───── */
  /* 3 */ { t: 'Biến thường không làm màn hình đổi — state thì có', body: two(
    anh('rx-02', 'vd-bien-thuong.jpg', { w: 640, h: 230, url: 'localhost:5173/vi-du/', cap: 'Ảnh chụp thật: bấm mỗi nút <strong>3 lần</strong>' }),
    list([
      'Console vẫn in <code>soLuot = 1</code>, <code>2</code>, <code>3</code> — biến CÓ đổi, nhưng React không hề biết.',
      'Lần render sau (nếu có), dòng <code>let soLuot = 0</code> chạy lại từ đầu ⇒ lại về 0.',
      '<code>useState</code> giải cả hai việc: <strong>nhớ</strong> giá trị giữa các lần render, và <strong>báo</strong> React vẽ lại khi bạn gọi <code>setSoLuot</code>.',
    ])) },

  /* 4 */ { t: 'useState trả về MỘT cặp: giá trị hiện tại và hàm để đặt giá trị mới', body: two(
    yaml([
      ["import { useState } from 'react';", ''],
      ['', ''],
      ['function BoDem() {', ''],
      ['  const [soLuot, setSoLuot] = useState(0);', '[giá trị, hàm đặt] = useState(ban đầu)'],
      ['  return (', ''],
      ['    <button onClick={() => setSoLuot(soLuot + 1)}>', ''],
      ['      Đã đặt {soLuot} lượt', ''],
      ['    </button>', ''],
      ['  );', ''],
      ['}', ''],
    ], { fs: 15.5 }),
    `${box('info', '<strong>JS nhắc nhanh — destructuring mảng:</strong> <code>const [a, b] = [1, 2]</code> đặt <code>a = 1</code>, <code>b = 2</code>. <code>useState</code> trả về mảng 2 phần tử, nên bạn tự đặt tên cho cả hai.')}
     ${table(['Viết', 'TypeScript suy ra'], [
      ['<code>useState(0)</code>', '<code>number</code>'],
      ["<code>useState('')</code>", '<code>string</code>'],
      ['<code>useState&lt;string | null&gt;(null)</code>', '<code>string | null</code> — phải ghi'],
      ['<code>useState(null)</code> rồi đặt một BacSi', '-TS2345: … not assignable to … SetStateAction&lt;null&gt;'],
    ], { sm: true })}`) },

  /* 5 */ { t: 'Mỗi lần set… là một vòng: Trigger → Render → Commit → Paint', body: `${renderFlow({ hl: 1, h: 290 })}
    ${box('tip', '<strong>Render</strong> = React <em>gọi lại hàm component của bạn</em> để lấy JSX mới. Nó chưa đụng DOM. Chỉ ở bước <strong>Commit</strong> React mới sửa đúng những nút DOM khác đi. Vì vậy thân component phải <strong>thuần</strong>: chỉ tính toán rồi trả JSX — không gọi API, không sửa biến ngoài.')}` },

  /* 6 */ { t: 'State là ảnh chụp: trong một lần render, soLuot là hằng số', body: `${snapshot()}
    ${t(["[snapshot] sau nut sai: Số lượt: 1 | console: [ 'ngay sau ba lần set, soLuot = 0' ]", '[snapshot] sau nut theo ham: Số lượt: 4'], 'npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose', 14.5)}` },

  /* 7 */ { t: 'Batching: nhiều set trong một sự kiện = MỘT lần render', body: two(
    t(['$ npx vitest run bai1 --reporter=verbose', '[batching] commits: mount,update,update,update', '  mount+dongbo = 2', '  +timeout = 3', '  +set gia tri cu (lan 1) = 4', '  +2 lan nua = 4', '+ ✓ batching: hai set trong một sự kiện', '[lazy] useState(tao()) goi 4 lan', '       useState(tao)   goi 1 lan'], 'Profiler · commit — đo thật', 14.5),
    table(['Việc', 'Số lần commit đo được'], [
      ['<code>setA(a + 1); setB(b + 1)</code> trong một click', '+1'],
      ['Hai set trong <code>setTimeout</code>', '+1 (tự gộp từ React 18)'],
      ['<code>setA(a)</code> — cùng giá trị, lần đầu', '!1 — React vẫn gọi component rồi mới bỏ'],
      ['<code>setA(a)</code> hai lần nữa', '+0 — bỏ qua hẳn'],
      ['<code>useState(tao())</code>, 3 lần bấm', '-tao() chạy 4 lần'],
      ['<code>useState(tao)</code>, 3 lần bấm', '+tao chạy 1 lần'],
    ], { sm: true })) },

  /* 8 */ { t: 'Luật hook: gọi ở đầu component, cùng thứ tự mọi lần render', body: two(
    yaml([
      ['function TheBacSi({ coChiTiet }) {', ''],
      ['  const [daXem, setDaXem] = useState(false);', 'hook #1'],
      ['  if (coChiTiet) {', ''],
      ['    const [moRong, setMoRong] = useState(false);', 'hook #2 — trong if'],
      ['    return …;', ''],
      ['  }', ''],
      ['  return …;', ''],
      ['}', ''],
    ], { fs: 15 }),
    `${t(['$ npx oxlint vi-du-sai/', '! HookTrongIf.tsx:6:33: error react-hooks(rules-of-hooks):', '!   React Hook "useState" is called conditionally.', '# chạy thật trong test: render false → true', '! Rendered more hooks than during the previous render.'], 'oxlint 1.85.0 · React 19.3.0', 14)}
     ${box('warn', 'React nhận ra state nào là của ai <strong>theo thứ tự gọi hook</strong>, không theo tên biến. Hook chỉ được gọi ở cấp cao nhất của component hoặc custom hook — không trong <code>if</code>, vòng lặp, hàm lồng.')}`) },

  /* ───── 2.2 ───── */
  /* 9 */ { t: 'onClick nhận MỘT HÀM — không nhận kết quả của việc gọi hàm', body: two(
    yaml([
      ['<button onClick={tang}>', '✓ đưa hàm cho React'],
      ['<button onClick={() => tang()}>', '✓ hàm bọc'],
      ['<button onClick={tang()}>', '✗ GỌI NGAY lúc render'],
    ], { fs: 17 }),
    `${t(['$ npx tsc -b', '! src/vi-du/loi-tsc.tsx(12,18): error TS2322:', "!   Type 'void' is not assignable to type", "!   'MouseEventHandler<HTMLButtonElement> | undefined'.", '# bỏ qua TS (ts-expect-error), chạy thật:', '! Too many re-renders. React limits the number of', '!   renders to prevent an infinite loop.'], 'tsc 6.0.3 · vitest', 14.5)}
     ${box('bad', '<code>tang()</code> chạy trong lúc render ⇒ gọi <code>setDem</code> ⇒ render lại ⇒ lại gọi <code>tang()</code>… React dừng vòng lặp bằng lỗi trên.')}`) },

  /* 10 */ { t: 'Truyền tham số cho handler: bọc trong một arrow function', body: two(
    yaml([
      ['function TheBacSi({ bacSi, onXemChiTiet }: Props) {', ''],
      ['  return (', ''],
      ['    <button onClick={() => onXemChiTiet(bacSi.id)}>', 'mỗi thẻ một id'],
      ['      …', ''],
      ['    </button>', ''],
      ['  );', ''],
      ['}', ''],
      ['// ở cha:', ''],
      ['<TheBacSi onXemChiTiet={setBacSiDangChonId} … />', 'đưa thẳng hàm set'],
    ], { fs: 15 }),
    list([
      '<strong>Prop</strong> tên <code>onXxx</code> (<code>onXemChiTiet</code>, <code>onDoi</code>) — đó là quy ước cho “hàm cha đưa xuống”.',
      '<strong>Hàm xử lý</strong> trong component tên <code>handleXxx</code> — trong khoá này viết <code>xuLyXxx</code>.',
      '<code>() =&gt; f(x)</code> tạo một hàm MỚI mỗi lần render. Bình thường là rẻ; Chương 8 mới đo khi nào nó đáng lo.',
      'Handler được phép có tác dụng phụ (đặt state, gọi API, ghi log). Chỉ thân component phải thuần.',
    ])) },

  /* 11 */ { t: 'Sự kiện nổi bọt từ nút lên thẻ cha — stopPropagation chặn lại', body: noiBot() },

  /* 12 */ { t: 'Submit mặc định tải lại trang — preventDefault chặn', body: two(
    t(['$ node form-reload.mjs ch02   # Chromium', 'truoc khi Tim: Đếm: 3', '  URL = …/vi-du/?bai=form | so lan tai trang = 1', '[console] onSubmit chạy', 'sau khi Tim:', '! URL = …/vi-du/?tu=lan | so lan tai trang = 2', '  h2 dau tien = ❌ Biến thường   # trang tải lại từ đầu'], 'Playwright · form KHÔNG preventDefault', 14.5),
    `${yaml([
      ['function xuLyGui(e: SubmitEvent<HTMLFormElement>) {', ''],
      ['  e.preventDefault();', 'chặn tải lại trang'],
      ['  onTim(tu);', ''],
      ['}', ''],
      ['<form onSubmit={xuLyGui}> … </form>', 'bắt Enter lẫn nút'],
    ], { fs: 14.5 })}
     ${table(['', 'Làm gì'], [
      ['<code>e.preventDefault()</code>', 'bỏ hành vi MẶC ĐỊNH của trình duyệt (gửi form, theo link)'],
      ['<code>e.stopPropagation()</code>', 'không cho sự kiện nổi lên cha'],
    ], { sm: true })}`) },

  /* 13 */ { t: 'Kiểu sự kiện trong TypeScript: gõ đúng thì e.target có kiểu', body: two(
    table(['Sự kiện', 'Kiểu (React 19.3 types)'], [
      ['<code>onClick</code>', '<code>MouseEvent&lt;HTMLButtonElement&gt;</code>'],
      ['<code>onChange</code> của input', '<code>ChangeEvent&lt;HTMLInputElement&gt;</code>'],
      ['<code>onKeyDown</code>', '<code>KeyboardEvent&lt;HTMLInputElement&gt;</code> — <code>e.key === \'Escape\'</code>'],
      ['<code>onSubmit</code>', '+<code>SubmitEvent&lt;HTMLFormElement&gt;</code>'],
      ['<code>FormEvent</code> (tài liệu cũ hay dùng)', '-@deprecated: “FormEvent doesn’t actually exist”'],
    ], { sm: true }),
    `${t(['# target vs currentTarget — đo thật', "[target] [ 'target=STRONG currentTarget=DIV' ]", '# onChange chạy theo TỪNG PHÍM, không đợi blur', `[onChange] [ 'onChange: "H"', 'onChange: "Hà"' ]`], 'vitest · src/vi-du/bai2.test.tsx', 14.5)}
     ${box('tip', 'Viết handler <strong>ngay trong JSX</strong> thì TypeScript tự suy kiểu <code>e</code> — không cần ghi. Chỉ ghi kiểu khi tách handler ra thành hàm riêng.')}`) },

  /* ───── 2.3 ───── */
  /* 14 */ { t: 'Sửa thẳng object: Object.is thấy “không đổi”', body: two(
    anh('rx-02', 'vd-sua-thang.jpg', { w: 640, h: 250, url: 'localhost:5173/vi-du/?bai=3', cap: 'Ảnh chụp thật: bấm cả hai nút <strong>một lần</strong>' }),
    list([
      '<code>bn.hoTen = …</code> sửa object <strong>đang nằm trong state</strong>. Rồi <code>setBn(bn)</code> đưa lại <em>chính object đó</em>.',
      '<code>Object.is(cũ, mới)</code> là <code>true</code> ⇒ React kết luận “không đổi” ⇒ không render.',
      '<code>{ ...bn, hoTen }</code> là object MỚI ⇒ <code>Object.is</code> trả <code>false</code> ⇒ render lại.',
      'Quy tắc: coi mọi thứ trong state là <strong>chỉ đọc</strong>.',
    ])) },

  /* 15 */ { t: 'Bug ma: sửa thẳng, rồi một state KHÁC làm giá trị sai hiện ra', body: two(
    t(['$ npx vitest run bai3-ui --reporter=verbose', '[sua truc tiep] sau khi bam Doi ten:', '+   Họ tên: Nguyễn Văn A', '  sau khi bam Viec khac:', '!   Họ tên: Trần Thị B', '[push] 1 yêu thích   # bấm Thêm (push) 2 lần'], 'đo thật', 14.5),
    list([
      'Bấm “Đổi tên (sai)”: màn hình đứng yên — dữ liệu trong bộ nhớ ĐÃ đổi.',
      'Bấm một nút chẳng liên quan (“Việc khác”): component render lại vì state khác, và tên mới <strong>bỗng hiện ra</strong>.',
      'Đó là lý do bug đột biến khó tìm: <strong>triệu chứng xuất hiện ở chỗ khác, lúc khác</strong>.',
      'Với mảng: <code>ds.push(x); setDs(ds)</code> — cùng một bệnh.',
    ])) },

  /* 16 */ { t: 'Object lồng nhau: spread TỪNG TẦNG tới chỗ cần đổi', body: `${spreadTang()}
    ${yaml([['return { ...lh, benhNhan: { ...lh.benhNhan, soDienThoai: so } };', 'hai tầng ⇒ hai lần spread']], { fs: 15.5 })}` },

  /* 17 */ { t: 'Mảng: dùng phương thức trả mảng MỚI, tránh sửa gốc', body: two(
    table(['Muốn', '✗ Sửa gốc', '✓ Trả mảng mới'], [
      ['Thêm', '<code>push</code>, <code>unshift</code>', '<code>[...ds, x]</code>'],
      ['Bỏ', '<code>splice</code>, <code>pop</code>', '<code>ds.filter(…)</code>'],
      ['Sửa một phần tử', '<code>ds[i] = x</code>', '<code>ds.map(…)</code>'],
      ['Chèn', '<code>splice</code>', '<code>[...slice, x, ...slice]</code>'],
      ['Sắp xếp / đảo', '<code>sort</code>, <code>reverse</code>', '<code>toSorted</code>, <code>toReversed</code>'],
    ], { sm: true }),
    t(["[sort] goc: '12,8,5,15,3,20'", "  sort tra ve chinh a: true", "! a sau sort: '20,15,12,8,5,3'", "  toSorted tra ve mang moi: true", "+ b sau toSorted: '12,8,5,15,3,20'", "[mang] chen: [ 'bs-1', 'bs-5', 'bs-2', 'bs-3' ]", "  ds van nguyen: [ 'bs-1', 'bs-2', 'bs-3' ]"], 'vitest · src/vi-du/bai3.test.ts', 14.5)) },

  /* 18 */ { t: 'StrictMode gọi updater hai lần ở chế độ dev — để lộ đột biến', body: two(
    `${yaml([
      ['// ✗ updater sửa mảng cũ', ''],
      ["setDs((cu) => { cu.push('bs-4'); return [...cu]; });", ''],
      ['// ✓ updater không sửa gì', ''],
      ["setDs((cu) => [...cu, 'bs-4']);", ''],
    ], { fs: 14.5 })}
     ${t(['[strict] updater dot bien: 1 → 3 → 5 → 7', '[strict] updater thuan:     1 → 2 → 3 → 4', '[khong strict] dot bien:    1 → 2 → 3 → 4'], 'độ dài mảng sau từng click — đo thật', 15)}`,
    list([
      'Không có StrictMode, bản sai <strong>trông như chạy đúng</strong> — bug nằm im tới ngày nó cắn.',
      'Có StrictMode: từ lần bấm thứ hai mỗi lần thêm HAI. Lần đầu chỉ thêm một (React tính trước giá trị khi hàng đợi trống).',
      'Chỉ ở dev. Bản build production gọi updater một lần.',
      '<code>main.tsx</code> của Vite bọc <code>&lt;StrictMode&gt;</code> sẵn — đừng gỡ nó.',
    ])) },

  /* 19 */ { t: 'Immer: viết như đang sửa thẳng, nhận về một bản mới', body: two(
    yaml([
      ["import { produce } from 'immer';", 'immer 11.1.18'],
      ['', ''],
      ['const moi = produce(lh, (nhap) => {', 'nhap = bản nháp'],
      ['  nhap.benhNhan.soDienThoai = so;', 'viết như sửa thẳng'],
      ['});', ''],
      ['', ''],
      ['// trong component:', ''],
      ['setLh(produce((nhap) => {', 'produce trả về updater'],
      ['  nhap.benhNhan.soDienThoai = so;', ''],
      ['}));', ''],
    ], { fs: 15 }),
    list([
      'Test “Immer cho cùng kết quả” (so <code>toEqual</code> với bản spread): <strong>xanh</strong>.',
      'Đáng dùng khi dữ liệu lồng 3–4 tầng. Hai tầng như <code>LichHen</code>: spread vẫn đọc dễ hơn.',
      'Redux Toolkit dùng Immer bên trong — nên trong <code>createSlice</code> bạn “sửa thẳng” được.',
      'Thêm một thư viện là thêm thứ đồng đội phải học. Dự án này KHÔNG cài Immer — chỉ dùng để minh hoạ.',
    ])) },

  /* ───── 2.4 ───── */
  /* 20 */ { t: 'Anh em cần chung dữ liệu ⇒ nâng state lên cha', body: `${two(
    `${cayTruoc()}<div style="text-align:center;color:${D.red};font-size:16px;font-weight:700">✗ Mỗi con một state — chip “Nhi” sáng, danh sách vẫn 6</div>`,
    `${caySau()}<div style="text-align:center;color:${D.grn};font-size:16px;font-weight:700">✓ Cha giữ, con nhận qua props — bấm Nhi ⇒ 2</div>`)}
    ${t(["[rieng] chip Nhi aria-pressed = true | Đang hiện 6 bác sĩ"], 'vitest · src/vi-du/bai4.test.tsx', 14.5)}` },

  /* 21 */ { t: 'KhuBacSi giữ bốn mẩu state; mọi con chỉ nhận props', body: cayKhu() },

  /* 22 */ { t: 'Đừng cất thứ tính được — cất vào state là bị chậm một phím', body: two(
    yaml([
      ['// ✗ state thừa + tính trong handler', ''],
      ['function xuLyDoi(moi: string) {', ''],
      ['  setTuKhoa(moi);', ''],
      ["  setKetQua(locBacSi(ds, 'tat-ca', tuKhoa));", 'tuKhoa CŨ (snapshot)'],
      ['}', ''],
      ['', ''],
      ['// ✓ tính ngay trong render', ''],
      ["const ketQua = locBacSi(ds, 'tat-ca', tuKhoa);", 'luôn khớp'],
    ], { fs: 14.5 }),
    `${t(['[luu ket qua] go "huy" ⇒', '! Kết quả: BS. Trần Thu Hà, BS. Hoàng Đức Huy', '[tinh trong render] go "huy" ⇒', '+ Kết quả: BS. Hoàng Đức Huy'], 'vitest · đo thật', 15)}
     ${box('tip', 'Hỏi: “giá trị này có tính được từ props/state khác không?” — có ⇒ <strong>tính trong render</strong>, không tạo state. Lọc 6 (hay 600) phần tử mỗi lần render là rẻ; Chương 8 mới đo khi nào cần <code>useMemo</code>.')}`) },

  /* 23 */ { t: 'State đặt càng thấp, càng ít component phải render lại', body: two(
    `${kpis([{ v: '4', l: 'lần Header render — state ở App', c: 'red' }, { v: '1', l: 'lần Header render — state ở KhuTim', c: 'grn' }])}
     ${t(['[cao/thap] Header render khi go 3 phim', '  state o App:    mount,update,update,update', '  state o KhuTim: mount'], 'Profiler · vitest', 15)}`,
    list([
      'Khi state đổi, React render lại <strong>component giữ state và mọi con của nó</strong> — không render cha, không render anh em.',
      'Nâng state lên <strong>vừa đủ cao</strong> để mọi component cần nó cùng thấy — không cao hơn.',
      'Render lại không có nghĩa là DOM bị sửa: Commit chỉ đụng chỗ khác. Đừng tối ưu mò — đo trước (Chương 8).',
      'Khi nhiều nhánh xa nhau cần cùng state: Context, Zustand, URL — Chương 5.',
    ])) },

  /* 24 */ { t: 'Năm nguyên tắc cấu trúc state + một nguồn sự thật', body: cards([
    { ic: '🧩', t: 'Gộp thứ đi cùng nhau', d: 'Luôn đổi cùng lúc (x và y của một điểm) ⇒ một object.', c: 'blu' },
    { ic: '⚖️', t: 'Tránh mâu thuẫn', d: '<code>dangGui</code> + <code>daGui</code> cùng true được? Dùng một biến trạng thái.', c: 'amb' },
    { ic: '🧮', t: 'Tránh state thừa', d: 'Tính được từ state khác ⇒ tính trong render (<code>danhSachLoc</code>).', c: 'grn' },
    { ic: '🪞', t: 'Tránh trùng lặp', d: 'Lưu <code>bacSiDangChonId</code>, không lưu bản chép object bác sĩ.', c: 'vio' },
    { ic: '🪆', t: 'Tránh lồng sâu', d: 'Dữ liệu cây sâu ⇒ làm phẳng theo id.', c: 'pnk' },
    { ic: '🎯', t: 'Một nguồn sự thật', d: 'Mỗi mẩu state có đúng MỘT chủ; mọi nơi khác đọc qua props.', c: 'tea' },
  ]) },

  /* 25 */ { t: 'Kết quả chương: lọc, tìm không dấu, xem chi tiết, yêu thích', body: two(
    anh('rx-02', 'ch02-chi-tiet.jpg', { w: 680, h: 425, url: 'localhost:4173', cap: 'Ảnh chụp thật: “Xem chi tiết” BS. Hà, ♡ BS. Hà, ♡ BS. Lan' }),
    `${anh('rx-02', 'ch02-tim-lan.jpg', { w: 420, h: 150, url: 'localhost:4173', cap: 'Gõ “lan” — không dấu vẫn ra (1/6)' })}
     <div style="height:10px"></div>
     ${anh('rx-02', 'ch02-rong.jpg', { w: 420, h: 150, url: 'localhost:4173', cap: 'Da liễu + “vy” ⇒ trạng thái rỗng' })}`) },

  /* 26 */ { t: 'Sai lầm hay gặp ở Chương 2', body: cards([
    { ic: '📸', t: 'Đọc state ngay sau set', d: 'Vẫn là giá trị CŨ (snapshot). Cần giá trị mới ⇒ tính vào biến trước.', c: 'red' },
    { ic: '➕', t: 'set(x + 1) nhiều lần', d: 'Chỉ +1. Dựa trên giá trị trước ⇒ <code>set(n =&gt; n + 1)</code>.', c: 'amb' },
    { ic: '📞', t: '<code>onClick={f()}</code>', d: 'Gọi ngay lúc render ⇒ “Too many re-renders”. Viết <code>onClick={f}</code>.', c: 'ora' },
    { ic: '🔁', t: 'Quên preventDefault', d: 'Form tải lại trang, state mất sạch.', c: 'vio' },
    { ic: '✏️', t: 'push / sửa thẳng object', d: 'Không render — rồi “bug ma” hiện ra ở chỗ khác.', c: 'pnk' },
    { ic: '🧮', t: 'Cất thứ tính được', d: 'State thừa lệch nhau — chậm một phím. Tính trong render.', c: 'blu' },
  ]) },

  /* 27 */ { t: 'Bảng tra nhanh Chương 2', body: table(['Muốn', 'Viết'], [
    ['Tạo state', '<code>const [x, setX] = useState(giaTriDau)</code> · kiểu: <code>useState&lt;T | null&gt;(null)</code>'],
    ['Dựa trên giá trị trước', '<code>setX((cu) =&gt; cu + 1)</code>'],
    ['Khởi tạo tốn kém', '<code>useState(taoBanDau)</code> — truyền HÀM, không gọi'],
    ['Handler có tham số', '<code>onClick={() =&gt; chon(bs.id)}</code>'],
    ['Chặn tải lại / nổi bọt', '<code>e.preventDefault()</code> · <code>e.stopPropagation()</code>'],
    ['Sửa field của object', '<code>setX({ ...x, ten })</code> · lồng: spread từng tầng'],
    ['Thêm / bỏ / sửa / sắp', '<code>[...ds, a]</code> · <code>filter</code> · <code>map</code> · <code>toSorted</code>'],
    ['Hai component cần cùng state', 'Nâng lên cha chung, truyền <code>giaTri</code> + <code>onDoi</code>'],
    ['Giá trị tính được', 'Tính trong render — không <code>useState</code>'],
  ], { sm: true }) },

  /* 28 */ { t: 'Tự gõ tiếp dự án: từ danh sách tĩnh tới danh sách biết nghe', body: two(
    `${anh('rx-02', 'ch01-xong.jpg', { w: 540, h: 260, url: 'localhost:4173 · sau Chương 1', cap: 'Điểm xuất phát — sau Chương 1: danh sách tĩnh' })}`,
    `${list([
      '<code>logic/loc-bac-si.ts</code> — <code>boDau</code>, <code>locBacSi</code> (hàm thuần, 6 test)',
      '<code>logic/yeu-thich.ts</code> — <code>doiYeuThich</code> bất biến (2 test)',
      '<code>ChipChuyenKhoa</code>, <code>OTimBacSi</code> — nhận giá trị + <code>onDoi</code>',
      '<code>TheBacSi</code>: 4 prop MỚI, đều không bắt buộc · <code>ChiTietBacSi</code> mới',
      '<code>KhuBacSi</code> giữ 4 state, tính <code>danhSachLoc</code> trong render',
    ])}
     ${t(['$ npx tsc -b && npx vitest run', '+  Test Files  6 passed (6)', '+       Tests  24 passed (24)', '# 8 test của Chương 1 + 16 test mới'], 'Đạt khi', 15)}`) },
]);
