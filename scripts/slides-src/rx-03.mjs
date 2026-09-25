/**
 * React · Deck rx-03 — Chương 3: Form.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch03
 * (react 19.3.0 · react-hook-form 7.88.0 · zod 4.6.5 · @hookform/resolvers 5.9.1 · vite 8.3.1 · vitest 5.0.1 ·
 *  typescript 6.0.3 · @testing-library/react 16.3.3 · user-event 14.6.7 · Chromium 141 của Playwright):
 *   npx vitest run --reporter=verbose        (bai1 · bai2 · bai3 · bai4 · schema · FormDatLich · KhuBacSi — 55 test)
 *   npx tsc -b                               (lỗi cố ý: TS2345 tên trường gõ sai, TS2339 trường không có)
 *   node do-trinh-duyet.mjs anh              (Playwright + Chromium thật: đếm commit, bấm đúp, requestSubmit ×2,
 *                                             bộ gõ MÔ PHỎNG bằng CDP Input.imeSetComposition, ảnh chụp form)
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-03/*.jpg
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, anh, kpis, steps,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-03', code: 'REACT · CHƯƠNG 3', title: 'Form', sub: 'React · Chương 3' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 3 — hai cách giữ giá trị của một ô ───────── */
const haiCach = () => {
  let s = '';
  // trái: không kiểm soát
  s += R(0, 0, 545, 400, { c: 'tea', fill: '#0f182a' }) + T(24, 38, 'KHÔNG kiểm soát (uncontrolled)', { fs: 20, b: true, c: 'tea' });
  s += R(40, 80, 465, 110, { c: 'dim', fill: '#0b1322' }) + T(62, 114, 'DOM', { fs: 15, c: 'mu', b: true });
  s += R(62, 128, 250, 44, { c: 'tea', fill: '#08101e', r: 8 }) + T(78, 157, 'Trần Thu Hà', { fs: 18 });
  s += T(328, 157, '← giá trị ở đây', { fs: 15, c: 'tea' });
  s += A(187, 250, 187, 178, { c: 'tea' });
  s += R(40, 250, 465, 60, { c: 'tea', fill: '#0b1a1c', r: 10 }) + T(62, 287, 'oTen.current.value  (đọc lúc bấm Gửi)', { fs: 16, mono: true });
  s += T(24, 350, 'defaultValue = chỉ giá trị BAN ĐẦU', { fs: 16, c: 'mu' });
  s += T(24, 378, 'React không vẽ lại khi bạn gõ', { fs: 16, c: 'mu' });
  // phải: kiểm soát
  const x = 595;
  s += R(x, 0, 545, 400, { c: 'rx', fill: '#0f182a' }) + T(x + 24, 38, 'KIỂM SOÁT (controlled)', { fs: 20, b: true, c: 'rx' });
  s += R(x + 30, 66, 215, 58, { c: 'grn', fill: '#0c1a12', r: 10 }) + T(x + 46, 101, "state: ten = 'Hà'", { fs: 15.5, mono: true });
  s += R(x + 300, 66, 215, 58, { c: 'amb', fill: '#221c0c', r: 10 }) + T(x + 316, 101, 'setTen(giá trị)', { fs: 15.5, mono: true });
  s += A(x + 296, 95, x + 250, 95, { c: 'amb' }) + T(x + 272, 146, 'render lại', { fs: 14, c: 'amb', a: 'middle' });
  s += R(x + 30, 222, 485, 76, { c: 'dim', fill: '#0b1322' }) + T(x + 48, 248, 'DOM', { fs: 15, c: 'mu', b: true });
  s += R(x + 110, 236, 250, 44, { c: 'rx', fill: '#08101e', r: 8 }) + T(x + 126, 265, 'Hà', { fs: 18 });
  s += A(x + 110, 128, x + 110, 230, { c: 'grn' }) + T(x + 122, 186, 'value={ten}', { fs: 15, mono: true, c: 'grn' });
  s += A(x + 420, 230, x + 420, 128, { c: 'amb' }) + T(x + 432, 186, 'onChange', { fs: 15, mono: true, c: 'amb' });
  s += T(x + 24, 340, 'State là nguồn sự thật; ô chỉ HIỆN state.', { fs: 16, c: 'mu' });
  s += T(x + 24, 372, 'Mỗi phím = một vòng Trigger → Render → Commit', { fs: 16, c: 'mu' });
  return sv(1140, 400, s);
};

/* ───────── Slide 18 — dòng thời gian: hai submit trong cùng một tác vụ ───────── */
const dongThoiGian = () => {
  let s = '';
  s += T(0, 16, 'Một tác vụ JS: form.requestSubmit(); form.requestSubmit();', { fs: 16, mono: true, c: 'mu' });
  s += A(20, 72, 1120, 72, { c: 'mu', sw: 2 }) + T(1120, 98, 'thời gian', { fs: 14, c: 'mu', a: 'end' });
  const moc = (x, nhan, c) => { s += `<circle cx="${x}" cy="72" r="9" fill="${D[c]}"/>` + T(x, 52, nhan, { fs: 15, a: 'middle', b: true, c }); };
  s += R(560, 62, 290, 20, { c: 'grn', fill: 'rgba(63,185,80,.12)', r: 6, sw: 1.5 });
  moc(130, 'submit #1', 'amb'); moc(330, 'submit #2', 'amb'); moc(700, 'React render lại', 'grn');
  const hang = (y, ten, c, o1, o2, kq, kqc) => {
    s += R(0, y, 1140, 92, { c: 'dim', fill: '#0f182a', r: 12 }) + T(20, y + 36, ten, { fs: 18, b: true, c });
    s += R(80, y + 48, 200, 34, { c: 'dim', fill: '#0b1322', r: 8 }) + T(180, y + 71, o1, { fs: 15, a: 'middle', mono: true });
    s += R(280, y + 48, 200, 34, { c: o2[1], fill: '#0b1322', r: 8 }) + T(380, y + 71, o2[0], { fs: 15, a: 'middle', mono: true, c: o2[1] });
    s += T(900, y + 58, kq, { fs: 20, b: true, c: kqc, a: 'middle' });
  };
  hang(110, 'Chặn bằng STATE (dangGui)', 'amb', 'false → gửi', ['còn false → gửi', 'red'], '2 lần gửi', 'red');
  hang(220, 'isSubmitting của RHF (có await)', 'amb', 'false → gửi', ['còn false → gửi', 'red'], '2 lần gửi', 'red');
  hang(330, 'Chặn bằng REF (dangGui.current)', 'grn', 'false → true, gửi', ['true → return', 'grn'], '1 lần gửi', 'grn');
  s += T(0, 450, 'State và isSubmitting chỉ đổi ở LẦN RENDER SAU. Ref là một hộp JS thường — gán xong là thấy ngay.', { fs: 16, c: 'mu' });
  return sv(1140, 460, s);
};

/* ───────── Slide 21 — sự kiện bộ gõ, đo thật ───────── */
const suKienIme = () => {
  let s = '';
  const buoc = [
    ['compositionstart', '', 'tea'], ['update "c"', 'input', 'rx'], ['update "ca"', 'input', 'rx'], ['update "cam"', 'input', 'rx'],
    ['update "cam3"', 'input', 'rx'], ['update "cảm"', 'input', 'rx'], ['keydown Enter', 'isComposing=true', 'amb'], ['compositionend', 'data="cảm"', 'grn'],
  ];
  const w = 132, gap = 10;
  buoc.forEach(([a, b, c], i) => {
    const x = i * (w + gap);
    s += R(x, 40, w, 96, { c, fill: '#0f182a', r: 10 }) + T(x + w / 2, 80, a, { fs: 14.5, a: 'middle', b: true, c });
    if (b) s += T(x + w / 2, 110, b, { fs: 13, a: 'middle', c: 'mu' });
    if (i < buoc.length - 1) s += A(x + w + 1, 88, x + w + gap - 1, 88, { c: 'mu', sw: 2 });
  });
  s += T(0, 24, 'Gõ “cảm” bằng VNI (c-a-m-3) — Chromium 141, bộ gõ MÔ PHỎNG bằng CDP Input.imeSetComposition', { fs: 15, c: 'mu' });
  s += R(0, 160, 1130, 120, { c: 'dim', fill: '#0b1322', r: 12 });
  s += T(20, 194, 'Trong suốt lúc soạn: ô đã hiện chữ, onChange của React đã chạy — nhưng chữ CHƯA chốt.', { fs: 17 });
  s += T(20, 226, 'Enter lúc này là để bộ gõ chốt chữ. Nếu bạn “gửi” ở đây, bạn gửi một chữ chưa xong.', { fs: 17 });
  s += T(20, 258, 'Tín hiệu để biết: e.nativeEvent.isComposing === true (hoặc keyCode 229 ở vài trình duyệt).', { fs: 17, c: 'amb' });
  return sv(1140, 290, s);
};

/* ───────── Slide 24 — NFC vs NFD ───────── */
const nfcNfd = () => {
  let s = '';
  const hang = (y, ten, o, c) => {
    s += T(0, y + 34, ten, { fs: 18, b: true, c });
    let x = 170;
    o.forEach(([chu, ma, rong]) => {
      const w = rong || 104;
      s += R(x, y, w, 72, { c, fill: '#0f182a', r: 9 }) + T(x + w / 2, y + 32, chu, { fs: 22, a: 'middle', b: true }) + T(x + w / 2, y + 58, ma, { fs: 12.5, a: 'middle', c: 'mu' });
      x += w + 8;
    });
  };
  hang(10, 'NFC · 6', [['N', 'U+004E'], ['g', 'U+0067'], ['u', 'U+0075'], ['y', 'U+0079'], ['ễ', 'U+1EC5'], ['n', 'U+006E']], 'grn');
  hang(110, 'NFD · 8', [['N', 'U+004E'], ['g', 'U+0067'], ['u', 'U+0075'], ['y', 'U+0079'], ['e', 'U+0065'], ['◌̂', 'U+0302'], ['◌̃', 'U+0303'], ['n', 'U+006E']], 'amb');
  s += T(0, 222, 'Nhìn giống hệt nhau trên màn hình. Với JavaScript: hai chuỗi KHÁC nhau.', { fs: 17, c: 'mu' });
  return sv(1140, 232, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 3 — Form', sub: 'Kiểm soát & không kiểm soát · React Hook Form + Zod · lỗi, đang gửi, chặn gửi hai lần · gõ tiếng Việt và bộ gõ (IME)', chap: 'CHƯƠNG 3' }),

  /* 2 */ { t: 'Bản đồ chương: một form đặt lịch, làm cho đúng từ gốc', body: mindmap('Form', 'nơi người dùng gõ dữ liệu — và nơi bug trốn kỹ nhất', [
    { t: '3.1 Kiểm soát & không kiểm soát', d: 'value/onChange · defaultValue · useRef · FormData', c: 'rx' },
    { t: '3.2 React Hook Form + Zod', d: 'register · schema · z.input/z.output · mode', c: 'tea' },
    { t: '3.3 Lỗi, đang gửi, gửi hai lần', d: 'aria · isSubmitting · ref chặn · lỗi máy chủ', c: 'vio' },
    { t: '3.4 Tiếng Việt & bộ gõ', d: 'composition · isComposing · NFC/NFD · regex tên', c: 'amb' },
  ]) },

  /* ───── 3.1 ───── */
  /* 3 */ { t: 'Ô input tự có bộ nhớ — bạn chọn ai là nguồn sự thật', body: haiCach() },

  /* 4 */ { t: 'Ô kiểm soát: value + onChange, mỗi phím đi hết một vòng render', body: two(
    yaml([
      ['function OTenKiemSoat() {', ''],
      ["  const [ten, setTen] = useState('Nguyễn Văn A');", 'nguồn sự thật'],
      ['  return (', ''],
      ['    <input', ''],
      ['      value={ten}', 'ô CHỈ hiện state'],
      ['      onChange={(e) => setTen(e.target.value)}', 'mỗi phím'],
      ['    />', ''],
      ['  );', ''],
      ['}', ''],
    ], { fs: 15 }),
    steps([
      ['Gõ “L”', 'trình duyệt định đổi chữ trong ô'],
      ['<code>onChange</code> chạy', 'React gọi theo TỪNG phím (khác sự kiện change của DOM)'],
      ['<code>setTen(e.target.value)</code>', 'xin một lần render mới'],
      ['React render lại', '<code>value</code> mới = chữ bạn vừa gõ'],
      ['Commit', 'ô hiện đúng thứ state đang giữ'],
    ])) },

  /* 5 */ { t: 'Đo thật: ô kiểm soát commit 12 lần, ô không kiểm soát 0 lần', body: two(
    anh('rx-03', 'kiem-soat.jpg', { w: 660, h: 330, url: 'localhost:5131/vi-du/?bai=1', cap: 'Ảnh chụp thật: xoá rồi gõ “Trần Thu Hà” (11 ký tự) vào hai ô' }),
    `${kpis([{ v: '12', l: 'commit — ô kiểm soát', c: 'amb' }, { v: '0', l: 'commit — ô không kiểm soát', c: 'grn' }])}
     ${list([
      'Ô kiểm soát: 1 lần xoá + 11 phím = <strong>12 lần</strong> React render lại cả component.',
      'Đổi lại, nó làm được điều ô kia không làm được: gõ <code>09a01.23456789</code> ⇒ ô hiện <code>0901 234 567</code>.',
      'Form nhỏ: 12 lần render là rẻ, đừng lo. Form 30 ô trong một cây lớn: đó là lý do React Hook Form ra đời (Bài 3.2).',
    ])}`) },

  /* 6 */ { t: 'Hai cảnh báo kinh điển của React về ô kiểm soát', body: `${t([
    '# 1) <input value={ten} /> — có value, KHÔNG có onChange',
    '! You provided a `value` prop to a form field without an `onChange`',
    '!   handler. This will render a read-only field. ...',
    '# 2) useState<string>() — lần đầu value={undefined}, gõ vào thành chuỗi',
    '! A component is changing an uncontrolled input to be controlled.',
    '!   This is likely caused by the value changing from undefined to',
    '!   a defined value, which should not happen. ...',
  ], 'vitest · src/vi-du/bai1.test.tsx (console.error thật)', 15)}
    ${table(['Triệu chứng', 'Sửa'], [
      ['Gõ không ăn, ô đứng im', '+Thêm <code>onChange</code> — hoặc dùng <code>defaultValue</code> nếu không cần state — hoặc <code>readOnly</code>'],
      ['Cảnh báo uncontrolled → controlled', "+Luôn có giá trị đầu là chuỗi: <code>useState('')</code>, không để <code>undefined</code>/<code>null</code>"],
    ], { sm: true })}` },

  /* 7 */ { t: 'Mỗi loại ô đọc và ghi giá trị ở một chỗ khác nhau', body: two(
    table(['Ô', 'Prop kiểm soát', 'Đọc trong onChange'], [
      ['<code>&lt;input&gt;</code> chữ', '<code>value</code>', '<code>e.target.value</code> (chuỗi)'],
      ['<code>type="number"</code>', '<code>value</code>', '!vẫn là CHUỖI — <code>valueAsNumber</code> nếu cần số'],
      ['<code>type="checkbox"</code>', '<code>checked</code>', '<code>e.target.checked</code>'],
      ['<code>&lt;select&gt;</code>', '<code>value</code> (trên select)', '<code>e.target.value</code>'],
      ['<code>&lt;textarea&gt;</code>', '<code>value</code>', 'không dùng con (children)'],
      ['<code>type="file"</code>', '-không kiểm soát được', 'đọc <code>e.target.files</code>'],
    ], { sm: true }),
    `${yaml([
      ['function xuLyDoi(e) {', ''],
      ['  const { name, value } = e.target;', 'destructuring'],
      ["  const giaTri = … checkbox ? e.target.checked : value;", ''],
      ['  setBn((cu) => ({ ...cu, [name]: giaTri }));', 'tên field lấy từ biến'],
      ['}', ''],
    ], { fs: 14 })}
     ${t(['[gui] {"hoTen":"Vũ Thảo Vy","soDienThoai":"",', '       "gioiTinh":"nu","daKhamTruocDay":true,', '       "lyDo":"Tái khám"}'], 'một object state, một handler — đo thật', 14.5)}`) },

  /* 8 */ { t: 'useRef: hộp nhớ không gây render, hợp để đưa focus', body: two(
    yaml([
      ['const oTim = useRef<HTMLInputElement>(null);', 'hộp { current }'],
      ['', ''],
      ['<input ref={oTim} value={tu} … />', 'React gắn ô vào hộp'],
      ['<button onClick={() => {', ''],
      ["  setTu('');", ''],
      ['  oTim.current?.focus();', '?. : ô chưa gắn thì bỏ qua'],
      ['}}>Xoá</button>', ''],
    ], { fs: 15 }),
    table(['Công cụ', 'Đổi nó có render lại?', 'Hợp để'], [
      ['<code>useState</code>', '+có', 'thứ hiện lên màn hình'],
      ['<code>useRef</code>', '-không', 'focus, đo DOM, cờ “đang gửi”'],
      ['<code>new FormData(form)</code>', 'không có gì để đổi', 'đọc mọi ô có <code>name</code> một lần lúc gửi'],
      ['<code>&lt;form action={fn}&gt;</code>', '—', 'React 19: nhận FormData, tự reset ô (Ch12)'],
    ], { sm: true })) },

  /* ───── 3.2 ───── */
  /* 9 */ { t: 'React Hook Form: register nối ô vào form bằng ref', body: `${yaml([
    ["const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });", ''],
    ['', ''],
    ["<input {...register('hoTen')} />", 'spread 4 thứ vào ô'],
    ["// register('hoTen') trả về { name: 'hoTen', onChange, onBlur, ref }", ''],
    ['', ''],
    ['<form onSubmit={handleSubmit(onGui)}>', 'kiểm xong mới gọi onGui'],
  ], { fs: 15 })}
    ${two(
    kpis([{ v: '0', l: 'lần form render lại khi gõ 12 ký tự (đo thật)', c: 'grn' }, { v: '12', l: 'lần — cùng form viết bằng useState', c: 'amb' }]),
    list([
      'Giá trị sống trong DOM (ô không kiểm soát); RHF đọc qua <code>ref</code> khi cần.',
      'Chỉ render lại khi thứ bạn ĐỌC trong <code>formState</code> đổi — ví dụ khi có lỗi mới.',
      '<code>...</code> (spread): trải mọi thuộc tính của object thành props của ô.',
    ]))}` },

  /* 10 */ { t: 'Zod: MỘT schema viết luật, sinh kiểu TypeScript, sinh câu báo lỗi', body: two(
    yaml([
      ["import { z } from 'zod';", 'zod 4.6.5'],
      ['export const benhNhanSchema = z.object({', ''],
      ['  hoTen: z.string().trim().normalize("NFC")', 'làm sạch trước'],
      ['    .min(2, "Họ tên cần ít nhất 2 ký tự")', 'rồi mới kiểm'],
      ['    .regex(CHU_TEN, "Họ tên chỉ gồm chữ cái…"),', ''],
      ['  soDienThoai: z.string().trim()', ''],
      ['    .transform((s) => bỏ dấu cách, +84 → 0)', 'đổi hình dạng'],
      ['    .pipe(z.string().regex(SDT_VIET_NAM, "…")),', 'kiểm SAU khi đổi'],
      ['  ngaySinh: z.iso.date({ error: "Chọn ngày sinh", abort: true })', ''],
      ['    .refine(không ở tương lai), …', ''],
      ['});', ''],
      ['type DatLich = z.output<typeof datLichSchema>;', 'kiểu tự sinh'],
    ], { fs: 13.5 }),
    `${table(['Trước (tự viết)', 'Sau (Zod)'], [
      ['Luật rải trong <code>if</code> ở handler', '+Luật nằm ở MỘT file'],
      ['Kiểu <code>interface</code> viết tay, dễ lệch', '+<code>z.infer</code> / <code>z.output</code> sinh từ luật'],
      ['Máy chủ viết lại luật lần hai', '+Máy chủ <code>import</code> đúng schema đó'],
    ], { sm: true })}
     ${box('info', '<code>zodResolver(schema)</code> (gói <code>@hookform/resolvers</code> 5.9.1) là cầu nối: RHF đưa dữ liệu thô cho Zod, Zod trả lỗi theo đường dẫn trường.')}`) },

  /* 11 */ { t: 'z.input khác z.output: người dùng gõ bẩn, form gửi đi sạch', body: `${sv(1140, 170, (() => {
    let s = '';
    s += R(0, 10, 360, 150, { c: 'amb', fill: '#221c0c' }) + T(20, 44, 'z.input — thứ người dùng GÕ', { fs: 17, b: true, c: 'amb' });
    s += T(20, 80, "hoTen: '\u00a0\u00a0Nguyễn Thị Ánh\u00a0\u00a0'", { fs: 15, mono: true }) + T(20, 108, "soDienThoai: '+84 901.234.567'", { fs: 15, mono: true }) + T(20, 136, "ngaySinh: '1995-03-14'", { fs: 15, mono: true });
    s += A(370, 85, 440, 85, { c: 'mu' });
    s += R(450, 30, 240, 110, { c: 'rx', fill: '#0f182a' }) + T(570, 64, 'datLichSchema', { fs: 17, b: true, a: 'middle', mono: true, c: 'rx' }) + T(570, 94, 'trim · NFC · transform', { fs: 14.5, a: 'middle', c: 'mu' }) + T(570, 118, '→ rồi mới kiểm luật', { fs: 14.5, a: 'middle', c: 'mu' });
    s += A(700, 85, 770, 85, { c: 'grn' });
    s += R(780, 10, 360, 150, { c: 'grn', fill: '#0c1a12' }) + T(800, 44, 'z.output — thứ onGui NHẬN', { fs: 17, b: true, c: 'grn' });
    s += T(800, 80, "hoTen: 'Nguyễn Thị Ánh'", { fs: 15, mono: true }) + T(800, 108, "soDienThoai: '0901234567'", { fs: 15, mono: true }) + T(800, 136, "ngaySinh: '1995-03-14'", { fs: 15, mono: true });
    return s;
  })())}
    ${two(
    t(['$ npx vitest run src/schema --reporter=verbose', '[lam sach] {"benhNhan":{"hoTen":"Nguyễn Thị Ánh",', '  "soDienThoai":"0901234567","ngaySinh":"1995-03-14"},', '  "lyDo":"Ho khan 3 ngày"}', '+ ✓ dữ liệu hợp lệ ⇒ được làm sạch'], 'đo thật', 14),
    list([
      '<code>useForm({ resolver: zodResolver(datLichSchema) })</code> tự hiểu cả hai kiểu — không cần ghi generic.',
      '<code>defaultValues</code> theo <code>z.input</code>; hàm trong <code>handleSubmit</code> nhận <code>z.output</code>.',
    ]))}` },

  /* 12 */ { t: 'Gõ sai tên trường: TypeScript bắt trước khi bạn chạy thử', body: `${yaml([
    ["<input {...register('benhNhan.hoTn')} />", 'thiếu chữ e'],
    ['handleSubmit((du) => console.log(du.ghiChu))', 'trường không có trong schema'],
  ], { fs: 16 })}
    ${t([
      '$ npx tsc -b',
      "! loi-tsc.tsx(7,30): error TS2345: Argument of type '\"benhNhan.hoTn\"'",
      "!   is not assignable to parameter of type '\"benhNhan\" | \"lyDo\" |",
      "!   \"benhNhan.hoTen\" | \"benhNhan.soDienThoai\" | \"benhNhan.ngaySinh\"'.",
      "! loi-tsc.tsx(12,117): error TS2339: Property 'ghiChu' does not exist on type",
      "!   '{ benhNhan: { hoTen: string; soDienThoai: string; ngaySinh: string; };",
      "!   lyDo: string; }'.",
    ], 'tsc 6.0.3 — output thật', 14.5)}
    ${box('tip', 'Đây là thứ form tự viết bằng chuỗi (<code>e.target.name</code>) không cho được: gõ sai tên thì chạy vẫn “được”, chỉ là dữ liệu không bao giờ tới. Ở đây trình soạn thảo gạch đỏ ngay.')}` },

  /* 13 */ { t: 'mode quyết định LÚC NÀO lỗi hiện ra — đo thật', body: two(
    table(['mode', 'Gõ “A” vào Họ tên', 'Rồi Tab sang ô sau', 'Cảm giác'], [
      ["<code>'onSubmit'</code> (mặc định)", '0 lỗi', '0 lỗi', 'chỉ báo khi bấm Gửi'],
      ["<code>'onBlur'</code>", '0 lỗi', '!1 lỗi', 'báo khi rời ô'],
      ["<code>'onTouched'</code>", '0 lỗi', '!1 lỗi', '+rời ô lần đầu, sau đó theo từng phím'],
      ["<code>'onChange'</code>", '!1 lỗi', '!1 lỗi', 'mắng ngay phím đầu tiên'],
    ], { sm: true }),
    `${t(['[mode] {', '  onSubmit: { sauKhiGo: 0, sauKhiRoiO: 0 },', '  onBlur: { sauKhiGo: 0, sauKhiRoiO: 1 },', '  onTouched: { sauKhiGo: 0, sauKhiRoiO: 1 },', '  onChange: { sauKhiGo: 1, sauKhiRoiO: 1 }', '}'], 'vitest · src/vi-du/bai2.test.tsx', 14.5)}
     ${box('good', 'Dự án dùng <code>onTouched</code>: không mắng người đang gõ dở, nhưng sửa xong là lỗi biến mất ngay.')}`) },

  /* 14 */ { t: 'watch() ở gốc vẽ lại cả form; useWatch() chỉ vẽ lại con cần nó', body: `${two(
    `${compTree({ w: 540, h: 200, bw: 210, root: { n: 'FormCoWatch', s: "watch('lyDo') · 15 lần ↻", r: true, kids: [
      { n: 'input hoTen', s: 'không kiểm soát' }, { n: 'p đếm', s: 'nằm trong form' },
    ] } })}<div style="text-align:center;color:${D.red};font-size:16px;font-weight:700">✗ gõ 15 ký tự ⇒ cả form render 15 lần</div>`,
    `${compTree({ w: 540, h: 200, bw: 210, root: { n: 'FormCoUseWatch', s: '0 lần', kids: [
      { n: 'input hoTen', s: 'không kiểm soát' }, { n: 'DemKyTu', s: 'useWatch · 15 lần ↻', r: true },
    ] } })}<div style="text-align:center;color:${D.grn};font-size:16px;font-weight:700">✓ chỉ bộ đếm render 15 lần</div>`)}
    ${t(['[go 15 ky tu vao Ly do] render them: { watchForm: 15, useWatchForm: 0, useWatchCon: 15 }'], 'vitest · đo thật', 15)}` },

  /* ───── 3.3 ───── */
  /* 15 */ { t: 'Lỗi nằm dưới ô, đọc được bằng trình đọc màn hình', body: two(
    anh('rx-03', 'form-loi-o.jpg', { w: 300, h: 450, url: 'localhost:5131', cap: 'Ảnh chụp thật: bấm Gửi khi form trống' }),
    `${yaml([
      ['<input', ''],
      ['  id="hoTen"', ''],
      ['  aria-invalid={e?.hoTen ? true : undefined}', 'viền đỏ + đọc “invalid”'],
      ["  aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined}", ''],
      ["  {...register('benhNhan.hoTen')}", ''],
      ['/>', ''],
      ['{e?.hoTen && <p id="hoTen-loi">{e.hoTen.message}</p>}', 'ngay dưới ô'],
    ], { fs: 13.5 })}
     ${t(['[app] focus sau khi gửi trống: hoTen', '# RHF tự focus ô lỗi đầu tiên (shouldFocusError mặc định true)'], 'Chromium 141 · đo thật', 14)}
     ${box('info', '<code>e?.hoTen</code>: <strong>optional chaining</strong> — <code>e</code> là <code>undefined</code> khi nhóm bệnh nhân chưa có lỗi, <code>?.</code> trả <code>undefined</code> thay vì ném lỗi.')}`) },

  /* 16 */ { t: 'Bốn trạng thái của một lần gửi — ảnh chụp thật', body: `<div style="display:flex;gap:22px;justify-content:center;align-items:flex-start">
    ${[['form-trong.jpg', '① nhập', 'Nhập'], ['form-dang-gui.jpg', '② đang gửi', '<code>isSubmitting</code> — nút khoá'], ['form-loi-may-chu.jpg', '③ lỗi máy chủ', '<code>errors.root.server</code>'], ['form-xong.jpg', '④ xong', '<code>isSubmitSuccessful</code>']]
    .map(([f, u, c]) => `<div style="width:262px">${anh('rx-03', f, { w: 262, h: 420, url: u, cap: c })}</div>`).join('')}
  </div>` },

  /* 17 */ { t: 'Bấm đúp thật trong Chromium: hai cách viết gửi hai lần', body: two(
    anh('rx-03', 'bam-dup.jpg', { w: 640, h: 300, url: 'localhost:5131/vi-du/?bai=3', cap: 'Ảnh chụp thật, 0,3 giây sau cú bấm đúp (máy chủ giả chậm 800 ms)' }),
    table(['Cách viết', 'Bấm đúp', 'requestSubmit ×2'], [
      ['1 Không chặn', '!2', '!2'],
      ['2 Chặn bằng state', '+1', '!2'],
      ['3 Chặn bằng ref', '+1', '+1'],
      ['4 RHF quên <code>await</code>', '!2', '!2'],
      ['5 RHF có <code>await</code>', '+1', '!2'],
      ['FormDatLich (dự án)', '+1', '+1'],
    ], { sm: true, center: [1, 2] })) },

  /* 18 */ { t: 'isSubmitting khoá nút SAU một lần render — ref khoá NGAY', body: dongThoiGian() },

  /* 19 */ { t: 'Chốt ref đặt sai chỗ: form báo “đã gửi” khi lần đầu còn treo', body: two(
    `${yaml([
      ['// ✗ ref TRONG hàm onValid', ''],
      ['async function guiDi(du) {', ''],
      ['  if (dangGui.current) return;', 'lần 2: return sớm'],
      ['  …', ''],
      ['}', ''],
      ['// ⇒ RHF coi lần 2 là “gửi thành công”', ''],
      ['', ''],
      ['// ✓ ref TRƯỚC handleSubmit', ''],
      ['function xuLySubmit(ev) {', ''],
      ['  ev.preventDefault();', ''],
      ['  if (dangGui.current) return;', 'chặn ở cửa'],
      ['  dangGui.current = true;', ''],
      ['  guiForm(ev).finally(() => { dangGui.current = false; });', ''],
      ['}', ''],
    ], { fs: 13.5 })}`,
    `${t(['! × hai lần submit trong CÙNG một nhịp ⇒ vẫn chỉ MỘT lần', '!   Unable to find an accessible element with the role…', '# DOM lúc đó: <p role="status">Đã gửi yêu cầu…</p>', '#   trong khi lời gọi onGui ĐẦU TIÊN vẫn còn treo', '$ # sau khi dời ref ra trước handleSubmit:', '+ [cung nhip] so lan goi onGui: 1 | nut: Đang gửi… (khoa)'], 'vitest · đo thật', 13.5)}
     ${box('warn', '<code>finally</code> chạy dù gửi thành công, lỗi, hay form không hợp lệ — nên cờ luôn được hạ.')}`) },

  /* 20 */ { t: 'Máy chủ vẫn phải kiểm — lỗi nó trả về gắn vào đúng ô', body: `${sv(1140, 150, (() => {
    let s = '';
    const hop = (x, w, a, b, c) => { s += R(x, 20, w, 110, { c, fill: '#0f182a' }) + T(x + w / 2, 60, a, { fs: 17, b: true, a: 'middle', c }) + T(x + w / 2, 92, b, { fs: 14.5, a: 'middle', c: 'mu' }); };
    hop(0, 230, 'Form (trình duyệt)', 'Zod kiểm lần 1', 'rx');
    hop(300, 250, 'POST /api/lich-hen', 'ai cũng gọi thẳng được', 'dim');
    hop(620, 230, 'Máy chủ', 'CÙNG datLichSchema', 'grn');
    hop(920, 220, 'setError(truong)', 'đỏ đúng ô + focus', 'amb');
    s += A(234, 75, 296, 75, { c: 'mu' }) + A(554, 75, 616, 75, { c: 'mu' }) + A(854, 75, 916, 75, { c: 'amb' });
    s += T(885, 146, '400 [{ truong, loi }]', { fs: 14, a: 'middle', mono: true, c: 'amb' });
    return s;
  })())}
    ${two(
    t(['[may chu] 400 [', ' { "truong": "benhNhan.hoTen",', '   "loi": "Họ tên chỉ gồm chữ cái và khoảng trắng" },', ' { "truong": "benhNhan.soDienThoai", "loi": "Số di động…" },', ' { "truong": "benhNhan.ngaySinh", "loi": "Chọn ngày sinh" } ]'], 'vitest · phía máy chủ dùng chung schema', 13.5),
    list([
      'Kiểm ở trình duyệt để <strong>người dùng</strong> sửa nhanh; kiểm ở máy chủ để <strong>dữ liệu</strong> an toàn. Cần cả hai.',
      'Một schema, hai nơi dùng: monorepo đặt nó trong gói chung (vd <code>packages/schema</code>).',
      'Bẫy: <code>z.flattenError</code> chỉ làm phẳng MỘT tầng — lỗi <code>benhNhan.*</code> dồn hết vào khoá <code>benhNhan</code>.',
    ]))}` },

  /* ───── 3.4 ───── */
  /* 21 */ { t: 'Bộ gõ “soạn” chữ trước khi chốt — ba sự kiện composition', body: suKienIme() },

  /* 22 */ { t: 'Enter lúc đang soạn là của bộ gõ — kiểm isComposing', body: two(
    anh('rx-03', 'go-dau.jpg', { w: 600, h: 215, url: 'localhost:5131/vi-du/?bai=4', cap: 'Ảnh chụp thật: cùng một chuỗi sự kiện vào hai ô' }),
    `${yaml([
      ['function dangGoDau(e: KeyboardEvent) {', ''],
      ['  return e.nativeEvent.isComposing', 'chuẩn'],
      ['    || e.keyCode === 229;', 'trình duyệt cũ'],
      ['}', ''],
      ['onKeyDown={(e) => {', ''],
      ["  if (e.key !== 'Enter' || dangGoDau(e)) return;", ''],
      ['  gửi(noiDung.trim().normalize("NFC"));', ''],
      ['}}', ''],
    ], { fs: 13.5 })}
     ${t(['[3.4] sai:  gửi "cảm" — rồi ô còn nguyên "cảm"', '[3.4] dung: (chưa gửi gì) — ô còn "cảm", đợi Enter kế'], 'Chromium 141 · bộ gõ mô phỏng', 13.5)}`) },

  /* 23 */ { t: 'Sửa value giữa lúc soạn: “nguyễn” thành “Nnguyễn”', body: two(
    yaml([
      ['// ✗ viết hoa NGAY trong onChange', ''],
      ['onChange={(e) => setTen(vietHoaDauTu(e.target.value))}', ''],
      ['', ''],
      ['// ✓ để bộ gõ soạn xong rồi mới sửa', ''],
      ['onCompositionStart={() => { dangSoan.current = true; }}', ''],
      ['onCompositionEnd={(e) => {', ''],
      ['  dangSoan.current = false;', ''],
      ['  setTen(vietHoaDauTu(e.currentTarget.value));', ''],
      ['}}', ''],
      ['onChange={(e) => setTen(dangSoan.current', ''],
      ['  ? e.target.value : vietHoaDauTu(e.target.value))}', ''],
    ], { fs: 13.5 }),
    `${t(['# soạn 8 bước: n, ng, … nguyên, nguyễn — rồi chốt', '! [3.4] Họ tên (viết hoa ngay): "Nnguyễn"', '+ [3.4] Họ tên (viết hoa khi xong): "Nguyễn"'], 'Chromium 141 · bộ gõ mô phỏng', 14.5)}
     ${list([
      'Đổi <code>value</code> khi bộ gõ đang soạn = giật mất chữ bộ gõ đang giữ. Bộ gõ chốt chữ vào chỗ cũ ⇒ lặp chữ.',
      'Việc “làm đẹp” (viết hoa, bỏ khoảng trắng, định dạng) ⇒ làm ở <code>compositionend</code>, <code>onBlur</code>, hoặc để Zod làm lúc gửi.',
      'React Hook Form dùng ô KHÔNG kiểm soát ⇒ không đụng <code>value</code> lúc bạn gõ — tránh được loại bug này.',
    ])}`) },

  /* 24 */ { t: 'Cùng chữ “Nguyễn”, hai chuỗi: NFC 6 đơn vị, NFD 8 đơn vị', body: `${nfcNfd()}
    ${two(
    t(['[nfc/nfd] {', "  'nfc.length': 6,  'nfd.length': 8,", "  'nfc === nfd': false,", '  "\'Nguyễn Minh An\'.includes(nfd)": false,', "  'nfc === nfd.normalize(NFC)': true }"], 'vitest · src/vi-du/bai4.test.tsx', 14),
    list([
      'Bộ gõ, hệ điều hành, dữ liệu dán từ Word… có thể đưa bạn chuỗi dạng <strong>tổ hợp</strong> (NFD).',
      'Hậu quả: tìm không ra, so sánh sai, đếm 500 ký tự sai, trùng khoá trong CSDL.',
      'Cách chữa: <code>.normalize(\'NFC\')</code> ở MỘT chỗ — schema Zod của dự án làm việc đó.',
    ]))}` },

  /* 25 */ { t: 'Regex tên: [a-zA-Z] loại người Việt, À-ỹ nhận cả chữ Hy Lạp', body: two(
    table(['Regex', '“Nguyễn Thị Ánh” NFC', 'NFD', 'Ghi chú'], [
      ['<code>/^[a-zA-Z\\s]+$/</code>', '-trượt', '-trượt', 'loại gần như mọi tên Việt'],
      ['<code>/^[a-zA-ZÀ-ỹ\\s]+$/</code>', '+qua', '+qua', '!dải U+00C0–U+1EF9 gồm cả Ωμέγα, Жуков'],
      ['<code>/^[\\p{L}\\p{M}\\s\'.-]+$/u</code>', '+qua', '+qua', 'mọi chữ cái + dấu kết hợp'],
    ], { sm: true }),
    `${t(['[regex ten] {', '  TEN_ASCII: { nfc: false, nfd: false },', '  TEN_KHOANG_DAU: { nfc: true, nfd: true },', '  TEN_UNICODE: { nfc: true, nfd: true } }', "[TEN_KHOANG_DAU nhan ca] { 'Ωμέγα': true, 'Жуков': true }"], 'vitest · đo thật', 14)}
     ${box('warn', 'Tên người là thứ khó kiểm nhất. Đừng cố “đúng tuyệt đối”: chặn cái rõ ràng sai (số, ký hiệu), chấp nhận chữ của mọi ngôn ngữ. Có bệnh nhân tên nước ngoài.')}`) },

  /* 26 */ { t: 'Mô phỏng được gì — và phải thử bằng bộ gõ THẬT cái gì', body: two(
    `<div style="font-size:20px;font-weight:800;color:${D.grn};margin-bottom:10px">✓ Máy dựng bài đã chạy (mô phỏng)</div>
     ${list([
      'jsdom + Testing Library: <code>fireEvent.compositionStart</code>, <code>keyDown</code> với <code>isComposing: true</code>',
      'Chromium 141 + CDP <code>Input.imeSetComposition</code>: trình duyệt TỰ phát compositionstart / update / end',
      'Tái hiện được: Enter khi đang soạn, viết hoa lặp chữ, NFC/NFD',
    ])}`,
    `<div style="font-size:20px;font-weight:800;color:${D.amb};margin-bottom:10px">⏳ Chưa chạy thật — cần thử tay</div>
     ${list([
      'Unikey trên Windows (Telex, VNI): thường sửa chữ bằng cách xoá rồi gõ lại, không qua composition — phải thử',
      'Bộ gõ tiếng Việt của macOS + Safari: thứ tự keydown Enter / compositionend có thể khác Chrome',
      'Điện thoại: Gboard, Laban Key — ô <code>type="tel"</code>, gợi ý từ, tự sửa chính tả',
    ])}`) },

  /* 27 */ { t: 'Kết quả chương: FormDatLich chạy thật trong ứng dụng', body: two(
    anh('rx-03', 'app-loi.jpg', { w: 700, h: 430, url: 'localhost:5131 · sau Chương 3', cap: 'Ảnh chụp thật: chọn BS. Trần Thu Hà, bấm Gửi khi trống' }),
    `${list([
      '<code>schema/dat-lich.ts</code> — luật + làm sạch + kiểu (4 test)',
      '<code>FormDatLich</code> — RHF + Zod, lỗi đúng chỗ, <code>aria-*</code>, chặn gửi hai lần (6 test)',
      '<code>logic/gui-dat-lich.ts</code> — máy chủ GIẢ chậm 800 ms (tới Ch6 thay bằng MSW)',
      '<code>KhuBacSi</code> — chọn bác sĩ ⇒ hiện form đặt lịch (1 test mới)',
    ])}
     ${t(['$ npx tsc -b && npx vitest run', '+  Test Files  6 passed (6)', '+       Tests  27 passed (27)', '$ npx vite build', '  index-….js   342.25 kB │ gzip: 106.88 kB', '# trước chương: 224.94 kB │ gzip: 70.75 kB'], 'đo thật', 14)}`) },

  /* 28 */ { t: 'Sai lầm hay gặp ở Chương 3', body: cards([
    { ic: '🔒', t: '<code>value</code> thiếu <code>onChange</code>', d: 'Ô đứng im, React cảnh báo “read-only field”.', c: 'red' },
    { ic: '🔀', t: '<code>useState()</code> không giá trị đầu', d: '<code>undefined</code> → chuỗi: “uncontrolled to controlled”. Dùng <code>useState(\'\')</code>.', c: 'amb' },
    { ic: '⏱', t: 'Quên <code>await</code> trong onValid', d: '<code>isSubmitting</code> tắt ngay ⇒ bấm đúp gửi hai lần.', c: 'ora' },
    { ic: '🚪', t: 'Tin vào <code>disabled</code> một mình', d: 'Hai submit cùng nhịp vẫn lọt. Chặn bằng <code>ref</code> TRƯỚC <code>handleSubmit</code>.', c: 'vio' },
    { ic: '⌨️', t: 'Enter = gửi, quên bộ gõ', d: 'Gửi chữ chưa chốt, ô còn nguyên chữ. Kiểm <code>isComposing</code>.', c: 'pnk' },
    { ic: '🔤', t: 'Không chuẩn hoá Unicode', d: 'NFD lọt vào: tìm không ra, đếm sai độ dài. <code>normalize(\'NFC\')</code> trong schema.', c: 'blu' },
  ]) },

  /* 29 */ { t: 'Bảng tra nhanh Chương 3', body: table(['Muốn', 'Viết'], [
    ['Ô kiểm soát', "<code>value={x}</code> + <code>onChange={(e) =&gt; setX(e.target.value)}</code> · giá trị đầu <code>''</code>"],
    ['Ô không kiểm soát', '<code>defaultValue</code> + <code>ref</code> — hoặc <code>new FormData(e.currentTarget)</code>'],
    ['Checkbox', '<code>checked</code> + <code>e.target.checked</code>'],
    ['Form RHF + Zod', '<code>useForm({ resolver: zodResolver(schema), defaultValues, mode: \'onTouched\' })</code>'],
    ['Nối ô', "<code>&lt;input {...register('benhNhan.hoTen')} /&gt;</code>"],
    ['Kiểu từ schema', '<code>z.input&lt;typeof s&gt;</code> (gõ vào) · <code>z.output&lt;typeof s&gt;</code> (gửi đi)'],
    ['Lỗi máy chủ', "<code>setError('root.server', { message })</code> · <code>setError('truong', …, { shouldFocus: true })</code>"],
    ['Chặn gửi hai lần', '<code>disabled={isSubmitting}</code> + <code>await</code> + <code>ref</code> trước <code>handleSubmit</code>'],
    ['Enter khi gõ dấu', '<code>if (e.nativeEvent.isComposing || e.keyCode === 229) return;</code>'],
    ['Chuẩn hoá chữ', "<code>z.string().trim().normalize('NFC')</code>"],
  ], { sm: true }) },

  /* 30 */ { t: 'Tự gõ tiếp dự án: FormDatLich bằng React Hook Form + Zod', body: two(
    `${steps([
      ['<code>src/schema/dat-lich.ts</code>', 'họ tên · SĐT Việt Nam · ngày sinh · lý do ≤ 500 · NFC'],
      ['<code>src/components/FormDatLich.tsx</code>', 'RHF + zodResolver · mode onTouched · lỗi dưới từng ô'],
      ['Đang gửi + lỗi máy chủ', '<code>isSubmitting</code> · <code>root.server</code> · ref chặn cửa'],
      ['Ghép vào <code>KhuBacSi</code>', '<code>key={bacSi.id}</code> · máy chủ giả 800 ms'],
    ])}`,
    `${t(['$ npx tsc -b && npx vitest run', ' RUN  v5.0.1 ~/phong-kham', '+  Test Files  6 passed (6)', '+       Tests  27 passed (27)', '# 16 test cũ + 11 mới:', '#   schema 4 · FormDatLich 6 · KhuBacSi 1'], 'Đạt khi — test cho sẵn trong bài', 14.5)}
     ${box('tip', 'Test là đề bài: chép các file test trong bài vào dự án TRƯỚC, chạy thấy đỏ, rồi viết mã cho tới khi xanh.')}`) },
]);
