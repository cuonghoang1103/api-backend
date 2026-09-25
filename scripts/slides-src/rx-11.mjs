/**
 * React · Deck rx-11 — Chương 11: React bên trong.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch11
 * (react 19.3.0 · react-dom 19.3.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 · react-router 8.4.0 · jsdom 30.1.1):
 *   npx vitest run src/vi-du --reporter=verbose   (bai1 · bai2 · bai3 · bai4 — 30 test)
 *   npx vitest run src/features … (🛠: trước khi sửa 7 failed; sau khi sửa 14 passed)
 *   npx tsc -b (lỗi cố ý TS2554 useRef<number>() · TS2322 ref callback trả về giá trị)
 *   chup.mjs (Playwright + Chromium thật): vite preview của app, vi-du.html (dev) — đo khung hình tooltip, log StrictMode
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-11/*.jpg
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, renderFlow, anh, bars, diagram, steps, vs,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-11', code: 'REACT · CHƯƠNG 11', title: 'React bên trong', sub: 'React · Chương 11' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });
const chu = (s, c = D.mu) => `<div style="text-align:center;color:${c};font-size:16px;font-weight:700;margin-top:6px">${s}</div>`;

/* ───────── Slide 5 — 7 component render lại, 1 nút chữ đổi ───────── */
const cayBangDem = () => compTree({
  w: 1120, h: 210, bw: 140, bh: 60, root: { n: 'BangDem', w: 240, s: '● soLuot 0 → 1', st: true, r: true, kids: [
    { n: 'p', w: 110, s: 'đổi chữ 0→1', c: 'grn' },
    { n: 'TheNho', w: 140, r: true, s: 'bs-1' }, { n: 'TheNho', w: 140, r: true, s: 'bs-2' }, { n: 'TheNho', w: 140, r: true, s: 'bs-3' },
    { n: 'TheNho', w: 140, r: true, s: 'bs-4' }, { n: 'TheNho', w: 140, r: true, s: 'bs-5' }, { n: 'TheNho', w: 140, r: true, s: 'bs-6' },
  ] },
});

/* ───────── Slide 6 — khác loại thẻ ⇒ vứt nhánh ───────── */
const soCay = (cha, giu) => {
  let s = '';
  s += R(20, 20, 200, 56, { c: 'rx' }) + T(120, 55, '<div>', { fs: 18, mono: true, a: 'middle', b: true });
  s += R(20, 120, 200, 56, { c: 'rx' }) + T(120, 155, '<ONhap />', { fs: 18, mono: true, a: 'middle', b: true });
  s += R(20, 220, 200, 56, { c: 'rx' }) + T(120, 255, '<input> "đau đầu"', { fs: 15, mono: true, a: 'middle' });
  s += A(120, 78, 120, 116, { c: 'mu', sw: 2 }) + A(120, 178, 120, 216, { c: 'mu', sw: 2 });
  s += A(236, 148, 300, 148, { c: giu ? 'grn' : 'red' });
  const c2 = giu ? 'grn' : 'red';
  s += R(316, 20, 214, 56, { c: c2 }) + T(423, 55, cha, { fs: 16, mono: true, a: 'middle', b: true });
  s += R(316, 120, 214, 56, { c: c2, dash: !giu }) + T(423, 155, '<ONhap />', { fs: 18, mono: true, a: 'middle', b: true });
  s += R(316, 220, 214, 56, { c: c2, dash: !giu }) + T(423, 255, giu ? '<input> "đau đầu"' : '<input> ""', { fs: 15, mono: true, a: 'middle' });
  s += A(423, 78, 423, 116, { c: 'mu', sw: 2 }) + A(423, 178, 423, 216, { c: 'mu', sw: 2 });
  return sv(550, 290, s);
};

/* ───────── Slide 7 — fiber: child / sibling / return + cặp current/WIP ───────── */
const cayFiber = () => {
  let s = '';
  const hop = (x, y, ten, c = 'rx', w = 190) => R(x, y, w, 44, { c, r: 10 }) + T(x + w / 2, y + 28, ten, { fs: 15, mono: true, a: 'middle', b: true });
  s += hop(20, 8, 'HostRoot (tag 3)', 'dim');
  s += hop(20, 84, '<BangDem>', 'grn');
  s += hop(20, 160, '<section>');
  s += hop(20, 236, '<ul>');
  s += hop(20, 312, '<TheNho> bs-1', 'amb');
  s += hop(250, 312, '<TheNho> bs-2', 'rx', 170);
  s += hop(450, 312, '… bs-6', 'rx', 110);
  s += hop(20, 388, '<li>', 'amb');
  [[115, 52, 115, 82], [115, 128, 115, 158], [115, 204, 115, 234], [115, 280, 115, 310], [115, 356, 115, 386]].forEach(([a, b, c, d]) => { s += A(a, b, c, d, { c: 'tea', sw: 2.2 }); });
  s += A(212, 334, 248, 334, { c: 'vio', sw: 2.2 }) + A(422, 334, 448, 334, { c: 'vio', sw: 2.2 });
  s += `<path d="M335 312 C 335 262, 280 258, 214 258" stroke="${D.ora}" stroke-width="2.2" fill="none" stroke-dasharray="6 5" marker-end="url(#m-ora)"/>`;
  s += T(345, 272, '.return (về cha)', { fs: 14, c: 'ora', mono: true });
  s += T(150, 72, '.child ↓', { fs: 14, c: 'tea', mono: true });
  s += T(226, 376, '.sibling →', { fs: 14, c: 'vio', mono: true });
  return sv(570, 440, s);
};

/* ───────── Slide 9 — state gắn với vị trí ───────── */
const cayViTri = (coKey) => compTree({
  w: 520, h: 250, bw: 230, root: { n: 'ChonBacSi', s: '● id: bs-1 → bs-5', st: true, kids: [
    { n: coKey ? 'GhiChu key=bs-5' : 'GhiChu', w: 250, st: true, r: coKey, c: coKey ? 'grn' : 'red', s: coKey ? '● chu: "" (MỚI)' : '● chu: "Hay quên…" (CŨ)' },
  ] },
});

/* ───────── Slide 12 — key=index vs key=id ───────── */
const hangKey = (tieuDe, dong, c) => {
  let s = T(10, 24, tieuDe, { fs: 17, b: true, c });
  dong.forEach(([k, ten, chuO, hl], i) => {
    const y = 42 + i * 52;
    s += R(10, y, 520, 42, { c: hl ? 'red' : 'rx', r: 8, sw: 2 });
    s += T(24, y + 27, k, { fs: 14, mono: true, c: 'mu' }) + T(150, y + 27, ten, { fs: 15.5 }) + T(390, y + 27, chuO, { fs: 15, mono: true, c: hl ? 'red' : 'grn' });
  });
  return sv(540, 42 + dong.length * 52, s);
};

/* ───────── Slide 14 — reset bằng effect: một khung hình sai ───────── */
const dongThoiGian = () => {
  let s = '';
  const o = (x, y, w, txt, c) => R(x, y, w, 50, { c, r: 10 }) + T(x + w / 2, y + 31, txt, { fs: 15.5, a: 'middle', mono: true });
  s += T(10, 28, 'useEffect(() => setChu(""), [id])', { fs: 16, b: true, mono: true, c: 'red' });
  s += o(10, 44, 260, 'render: bs-5 "ab"', 'red') + A(276, 69, 312, 69, { c: 'mu', sw: 2 }) + o(318, 44, 150, 'commit', 'dim') + A(474, 69, 510, 69, { c: 'mu', sw: 2 }) + o(516, 44, 150, 'effect', 'vio') + A(672, 69, 708, 69, { c: 'mu', sw: 2 }) + o(714, 44, 250, 'render: bs-5 ""', 'grn');
  s += T(10, 146, '<GhiChuThuong key={bacSi.id} />', { fs: 16, b: true, mono: true, c: 'grn' });
  s += o(10, 162, 260, 'render: bs-5 ""', 'grn') + A(276, 187, 312, 187, { c: 'mu', sw: 2 }) + o(318, 162, 150, 'commit', 'dim');
  s += T(520, 194, 'một lần, đúng ngay', { fs: 16, c: 'grn', b: true });
  return sv(980, 230, s);
};

/* ───────── Slide 19 — useEffect vs useLayoutEffect: khung hình nào được vẽ ───────── */
const khungHinh = () => {
  let s = '';
  const o = (x, y, w, txt, c, sub) => R(x, y, w, 58, { c, r: 10, fill: c === 'red' ? '#2a1016' : '#0f182a' }) + T(x + w / 2, y + (sub ? 25 : 35), txt, { fs: 15, a: 'middle', b: true }) + (sub ? T(x + w / 2, y + 46, sub, { fs: 13, a: 'middle', c: 'mu' }) : '');
  s += T(10, 24, 'useEffect', { fs: 18, b: true, mono: true, c: 'red' });
  s += o(10, 36, 170, 'render (100ms)', 'rx', 'top chưa đo') + o(196, 36, 110, 'commit', 'dim') + o(322, 36, 170, 'VẼ', 'red', 'hộp ở top: 0 ✗') + o(508, 36, 150, 'effect: đo', 'vio') + o(674, 36, 170, 'render', 'rx', 'top = 117') + o(860, 36, 150, 'VẼ', 'grn', 'đúng chỗ');
  s += T(10, 136, 'useLayoutEffect', { fs: 18, b: true, mono: true, c: 'grn' });
  s += o(10, 148, 170, 'render (100ms)', 'rx', 'top chưa đo') + o(196, 148, 110, 'commit', 'dim') + o(322, 148, 170, 'layout effect: đo', 'vio') + o(508, 148, 150, 'render', 'rx', 'top = 117') + o(674, 148, 170, 'VẼ', 'grn', 'đúng chỗ');
  s += T(890, 184, 'không có khung sai', { fs: 15, c: 'grn', b: true });
  return sv(1030, 215, s);
};

/* ───────── Slide 21 — portal: cây DOM vs cây React ───────── */
const haiCay = () => {
  let s = '';
  const h = (x, y, txt, c = 'rx', w = 210) => R(x, y, w, 42, { c, r: 9 }) + T(x + w / 2, y + 27, txt, { fs: 14.5, mono: true, a: 'middle', b: true });
  s += T(115, 20, 'Cây REACT', { fs: 17, b: true, a: 'middle', c: 'rx' });
  s += h(10, 34, '<div onClick>', 'amb') + h(10, 110, '<button> Mở hộp') + h(10, 186, 'createPortal(…)', 'vio') + h(10, 262, '<button> OK', 'grn');
  s += A(115, 78, 115, 106, { c: 'mu', sw: 2 }) + A(115, 154, 115, 182, { c: 'mu', sw: 2 }) + A(115, 230, 115, 258, { c: 'mu', sw: 2 });
  s += `<path d="M224 284 C 280 270, 280 70, 224 56" stroke="${D.amb}" stroke-width="3" fill="none" marker-end="url(#m-amb)"/>`;
  s += T(284, 176, 'nổi bọt', { fs: 14, c: 'amb', b: true });
  s += T(480, 20, 'Cây DOM', { fs: 17, b: true, a: 'middle', c: 'tea' });
  s += h(400, 34, '<body>', 'tea', 160) + h(330, 110, '<div id=root>', 'tea', 150) + h(330, 186, '<div> thẻ', 'tea', 150) + h(496, 110, '<div dialog>', 'vio', 150) + h(496, 186, '<button> OK', 'grn', 150);
  s += A(450, 78, 410, 106, { c: 'mu', sw: 2 }) + A(510, 78, 565, 106, { c: 'mu', sw: 2 }) + A(405, 154, 405, 182, { c: 'mu', sw: 2 }) + A(571, 154, 571, 182, { c: 'mu', sw: 2 });
  s += T(488, 262, 'hộp là con của <body>,', { fs: 14, a: 'middle', c: 'mu' }) + T(488, 284, 'không phải con của thẻ', { fs: 14, a: 'middle', c: 'mu' });
  return sv(656, 310, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 11 — React bên trong', sub: 'Render · reconciliation · fiber · key · StrictMode · ref · portal · error boundary', chap: 'CHƯƠNG 11' }),

  /* 2 */ { t: 'Bản đồ chương: hiểu React làm gì giữa setState và màn hình', body: mindmap('React bên trong', 'đo thật, không đoán', [
    { t: '11.1 Render & reconciliation', d: 'element · 4 pha · so cây · fiber · batching', c: 'rx' },
    { t: '11.2 key & danh tính', d: 'state theo vị trí · reset bằng key · index · Activity', c: 'vio' },
    { t: '11.3 StrictMode & ref', d: 'chạy hai lần · useRef · focus · useLayoutEffect', c: 'grn' },
    { t: '11.4 Portal & ranh giới lỗi', d: 'createPortal · nổi bọt · error boundary', c: 'amb' },
    { t: '🛠 Dự án', d: 'key form · focus · hộp huỷ · ranh giới · tooltip', c: 'tea' },
  ]) },

  /* ───── 11.1 ───── */
  /* 3 */ { t: 'JSX chỉ tạo ra một object mô tả — chưa có DOM nào', body: two(
    `${yaml([
      ['const el = <TheNho bacSi={bs2} />;', 'chỉ là một object'],
      ['', ''],
      ['// Babel/esbuild dịch thành:', ''],
      ['const el = jsx(TheNho, { bacSi: bs2 });', ''],
      ['', ''],
      ['el.type   // hàm TheNho (CHƯA gọi)', ''],
      ['el.props  // { bacSi: … }', ''],
      ['el.key    // null', ''],
    ], { fs: 15 })}
     ${box('info', 'Element là <strong>bản mô tả</strong> “ở đây cần một TheNho với props này”. React mới là bên quyết định khi nào gọi <code>TheNho</code> và sửa DOM ra sao.')}`,
    t(['$ npx vitest run src/vi-du/bai1.test.tsx', '[element] kiểu: object | khoá: $$typeof, type,', '          key, props, _owner, _store', '[element] type là hàm: TheNho | props.bacSi.id = bs-2', '+ [element] TheNho đã chạy chưa? 0 lần'], 'đo thật · react 19.3.0', 14.5)) },

  /* 4 */ { t: 'Mỗi lần cập nhật đi qua bốn pha — chỉ pha ③ đụng DOM', body: `${renderFlow({ hl: 1 })}
    ${two(
      box('tip', '<strong>Render ≠ vẽ lên màn hình.</strong> Render là React <em>gọi hàm component</em> để lấy JSX mới. Nó có thể chạy nhiều lần mà DOM không đổi gì.'),
      box('info', '<strong>Reconciliation</strong> (đối chiếu): so cây element mới với cây lần trước để tính ra <em>ít thay đổi DOM nhất</em>. Cái người ta hay gọi là “virtual DOM” chính là bước này.'))}` },

  /* 5 */ { t: 'Bảy component render lại, DOM chỉ đổi đúng một nút chữ', body: `${cayBangDem()}
    ${two(
      t(['[render] BangDem: 1 | TheNho: 6', '[DOM] số thay đổi: 1', '+   characterData: "0" → "1"', '[DOM] thẻ <li> đầu tiên vẫn là NÚT CŨ? true'], 'bấm “+1 lượt xem” · MutationObserver đếm thay đổi DOM', 14.5),
      `${box('good', 'Sáu thẻ <code>&lt;li&gt;</code> ra JSX y hệt lần trước ⇒ React không đụng tới chúng. Chỉ chữ <code>0</code> thành <code>1</code>.')}
       ${box('warn', 'Render “thừa” không miễn phí (hàm vẫn chạy), nhưng rẻ hơn nhiều so với sửa DOM. Đo trước khi tối ưu — Chương 8.')}`)}` },

  /* 6 */ { t: 'Khác loại thẻ ở cùng chỗ: React vứt cả nhánh, state mất theo', body: two(
    `${soCay('<section>', false)}${chu('div → section: ô nhập bị TẠO LẠI, chữ mất', D.red)}`,
    `${soCay('<div className=…>', true)}${chu('chỉ đổi className: GIỮ nút DOM và state', D.grn)}
     ${t(['[khac loai] sau khi tick: "" | cùng nút DOM? false', '[cung loai] sau khi tick: "đau đầu" | cùng nút DOM? true'], 'vitest · bai1.test.tsx', 13.5)}`) },

  /* 7 */ { t: 'Fiber: mỗi component một nút, nối bằng child, sibling, return', body: two(
    cayFiber(),
    `${t(['[fiber] thuộc tính React gắn lên <li>:', '  __reactFiber$…, __reactProps$…', '[fiber] đi ngược .return: <li> → <TheNho>', '  key=bs-1 → <ul> → <section> → <BangDem>', '  → (tag 3)', '[fiber] <BangDem>.memoizedState = 0', '+ sau 1 lần bấm: cặp fiber giữ soLuot = 0 và 1'], 'CHI TIẾT NỘI BỘ — chỉ để học', 13)}
     ${box('info', '<strong>Cặp fiber:</strong> bản đang trên màn hình (<em>current</em>) và bản đang dựng (<em>work-in-progress</em>, qua <code>.alternate</code>). Commit xong thì hai bản đổi vai.')}
     ${box('warn', 'Đừng đọc <code>__reactFiber$</code> trong app: tên và cấu trúc đổi theo phiên bản.')}`) },

  /* 8 */ { t: 'Batching: ba lần set trong một sự kiện chỉ ra một lần render', body: two(
    `${yaml([
      ['function baLanSet() {', ''],
      ['  setA(a + 1);', 'chưa render'],
      ['  setB(b + 1);', 'chưa render'],
      ['  setC(c + 1);', 'chưa render'],
      ['}', 'render MỘT lần ở đây'],
      ['', ''],
      ['onClick={baLanSet}', ''],
      ['onClick={() => setTimeout(baLanSet, 0)}', 'React 18+: vẫn gom'],
    ], { fs: 15 })}
     ${t(['[batching] trong onClick: 1 lần render → a=1 b=1 c=1', '[batching] trong setTimeout: 1 lần render → a=2 b=2 c=2'], 'vitest · bai1.test.tsx', 13.5)}`,
    table(['Ở đâu gọi set', 'React 17', 'React 18/19'], [
      ['Trong onClick, onChange…', 'gom', '+gom'],
      ['Trong setTimeout, Promise, fetch', '-mỗi set một render', '+gom (automatic batching)'],
      ['Muốn KHÔNG gom', '—', '!flushSync(() => …)'],
    ])) },

  /* ───── 11.2 ───── */
  /* 9 */ { t: 'State gắn với VỊ TRÍ trong cây, không gắn với dữ liệu bạn truyền', body: two(
    `${cayViTri(false)}${chu('Không key: cùng loại, cùng chỗ ⇒ React GIỮ state cũ', D.red)}`,
    `${cayViTri(true)}${chu('key={bacSi.id}: key đổi ⇒ component MỚI, state trắng', D.grn)}`) },

  /* 10 */ { t: 'key không chỉ cho danh sách: đổi key là gỡ cũ, dựng mới', body: two(
    `${yaml([
      ['{/* ✗ cùng loại, cùng chỗ: state ở lại */}', ''],
      ['<GhiChu bacSi={bacSi} />', ''],
      ['', ''],
      ['{/* ✓ bác sĩ khác = component khác */}', ''],
      ['<GhiChu key={bacSi.id} bacSi={bacSi} />', ''],
    ], { fs: 15.5 })}
     ${box('tip', '<code>key</code> đặt trên <strong>component có state cần reset</strong>, bằng thứ định danh dữ liệu (id), không phải index hay <code>Math.random()</code>.')}`,
    t(['[khong key] ô của Huy chứa: "Hay quên uống thuốc"', '[khong key] nhật ký: mount (tạo cho bs-1)', '', '[co key] ô của Huy: "" | quay lại An: ""', '[co key] nhật ký: mount (tạo cho bs-1)', '  · unmount (tạo cho bs-1) · mount (tạo cho bs-5)', '  · unmount (tạo cho bs-5) · mount (tạo cho bs-1)'], 'vitest · bai2.test.tsx', 13.5)) },

  /* 11 */ { t: 'Bug thật trong app: trang BS. Huy báo “đã gửi” dù chưa đặt gì', body: two(
    anh('rx-11', 'truoc-key.jpg', { w: 560, url: 'localhost:5211/bac-si/bs-5 · TRƯỚC Ch11', cap: '<strong style="color:#ff5c6c">Trước:</strong> đặt với BS. An → bấm “BS. Hoàng Đức Huy”' }),
    `${anh('rx-11', 'sau-key.jpg', { w: 560, h: 250, url: 'localhost:5211/bac-si/bs-5 · SAU: key={bacSi.id}', cap: '<strong style="color:#3fb950">Sau:</strong> form trắng, focus ở tiêu đề' })}
     ${t(['! [sau khi dat] trang Huy báo: Đã gửi yêu cầu đặt lịch…', '! [gio cu] máy chủ trả lời: Không có khung giờ này', '+ sau khi thêm key: src/features 8 passed'], 'vitest · TrangChiTietBacSi.test.tsx', 13)}`) },

  /* 12 */ { t: 'key = index: xoá dòng đầu, ghi chú trượt sang bác sĩ khác', body: two(
    `${hangKey('key = index — sau khi xoá An', [['key=0', 'BS. Trần Thu Hà', '"tái khám"', true], ['key=1', 'BS. Lê Quốc Bảo', '"bé sốt"', true]], D.red)}
     ${hangKey('key = bs.id — sau khi xoá An', [['key=bs-2', 'BS. Trần Thu Hà', '"bé sốt"'], ['key=bs-3', 'BS. Lê Quốc Bảo', '""']], D.grn)}`,
    `${box('info', 'Trước khi xoá: An = <code>"tái khám"</code>, Hà = <code>"bé sốt"</code>.')}
     ${box('bad', 'Với index, React thấy “dòng key 0 còn, dòng key 2 mất” ⇒ gỡ dòng <strong>cuối</strong>, giữ state của dòng đầu, rồi đổi props. State đi theo key, props đi theo dữ liệu ⇒ lệch nhau.')}
     ${box('good', 'Index chỉ an toàn khi danh sách <strong>không bao giờ</strong> thêm/xoá/sắp xếp và dòng không có state.')}`) },

  /* 13 */ { t: 'Component khai trong component: mỗi phím một lần mount', body: two(
    yaml([
      ['function OTimLongNhau() {', ''],
      ["  const [tuKhoa, setTuKhoa] = useState('');", ''],
      ['  function OTim() {', '✗ hàm MỚI mỗi lần render'],
      ['    return <input value={tuKhoa} … />;', ''],
      ['  }', ''],
      ['  return <OTim />;', 'React: “loại khác” ⇒ gỡ, dựng'],
      ['}', ''],
      ['', ''],
      ['function OTimNgoai({ tuKhoa, onDoi }) {…}', '✓ khai MỘT lần ở cấp module'],
    ], { fs: 14.5 }),
    `${t(['$ gõ "huy" vào ô tìm', '! [long nhau] ô chứa: "h" | số lần mount: 2', '!   | focus đang ở: BODY', '+ [tach rieng] ô chứa: "huy" | số lần mount: 1', '+   | focus đang ở: INPUT'], 'vitest · bai2.test.tsx', 14)}
     ${box('warn', 'Chữ “h” vào được, rồi ô bị thay bằng ô mới ⇒ focus rơi về <code>&lt;body&gt;</code>, “u” và “y” đi lạc.')}`) },

  /* 14 */ { t: 'Reset bằng key đúng ngay; bằng useEffect thì sai một nhịp', body: `${dongThoiGian()}
    ${two(
      t(['[reset effect] các lần render sau khi đổi:', '!   bs-5:"ab" → bs-5:""', '[reset key]    các lần render sau khi đổi:', '+   bs-5:""'], 'vitest · bai2.test.tsx', 14),
      `${t(['[dieu-kien] lúc ẩn: ô KHÔNG còn trong DOM | quay lại: ""', '[activity]  lúc ẩn: ô VẪN trong DOM', '            | quay lại: "hỏi về thuốc"'], 'muốn ẩn mà GIỮ state: <Activity>', 13)}
       ${box('info', '<code>&lt;Activity mode="hidden"&gt;</code> (React 19.2+) ẩn bằng <code>display: none</code>, giữ state, gỡ effect.')}`)}` },

  /* ───── 11.3 ───── */
  /* 15 */ { t: 'StrictMode: render hai lần, effect chạy → dọn → chạy (chỉ ở dev)', body: two(
    t(['# vitest, có <StrictMode>:', 'render → khởi tạo state → khởi tạo state → render', '  → effect: chạy → effect: dọn → effect: chạy', '', '# Chromium, vite dev:', '[DemLuotXem] render | render | effect chạy', '  | effect dọn | effect chạy', '', '# Chromium, vite build + preview:', '+ [DemLuotXem] render | effect chạy'], 'đo thật — cùng component', 13.5),
    `${list([
      'Gọi hai lần: <strong>thân component</strong>, hàm khởi tạo của <code>useState</code>/<code>useReducer</code>, updater, <code>useMemo</code>.',
      'Chạy thêm một vòng <strong>dọn → chạy</strong> cho effect và ref callback lúc mount.',
      'Bản build production: <strong>một lần</strong>. StrictMode không làm app thật chậm đi.',
    ])}
     ${box('tip', 'Thấy log in hai lần ở dev ⇒ <strong>đừng gỡ StrictMode</strong>. Hỏi: code của mình có chịu được chạy hai lần không?')}`) },

  /* 16 */ { t: 'StrictMode bắt effect quên dọn: listener sống cả sau khi gỡ', body: two(
    `${yaml([
      ['useEffect(() => {', ''],
      ['  const xuLy = () => onPhim();', ''],
      ["  window.addEventListener('keydown', xuLy);", ''],
      ['  return () =>', '✓ thiếu dòng này là rò'],
      ["    window.removeEventListener('keydown', xuLy);", ''],
      ['}, [onPhim]);', ''],
    ], { fs: 15 })}
     ${t(['[khong thuan] không Strict: Số người chờ: 1', '!             có Strict:   Số người chờ: 2'], 'render sửa biến ngoài — StrictMode làm lộ', 13.5)}`,
    `${t(['! [quen don] 1 phím khi đang mở ⇒ 2 lần', '!   1 phím SAU KHI GỠ ⇒ thêm 2 lần', '+ [co don] 1 phím khi đang mở ⇒ 1 lần', '+   1 phím sau khi gỡ ⇒ thêm 0 lần'], 'vitest · bai3.test.tsx (StrictMode)', 14)}
     ${box('bad', 'Không có StrictMode, bug này chỉ lộ khi người dùng mở/đóng màn hình vài lần — và mỗi lần là thêm một listener.')}`) },

  /* 17 */ { t: 'useRef: một chiếc hộp để nhớ — đổi nó không render lại', body: two(
    `${bars([
      { l: 'useRef — bấm 3 lần', sub: 'màn hình vẫn “Đã bấm (ref): 0”', v: 1, txt: '1 render', c: 'grn' },
      { l: 'useState — bấm 3 lần', sub: 'màn hình “Đã bấm (state): 3”', v: 4, txt: '4 render', c: 'amb' },
    ], { lw: 260, max: 4 })}<div style="height:14px"></div>
     ${table(['', 'useState', 'useRef'], [
      ['Đổi giá trị', 'setX(…) ⇒ render lại', '+ref.current = … (không render)'],
      ['Đọc trong lúc render', '+được', '-đừng (không đồng bộ màn hình)'],
      ['Dùng cho', 'thứ HIỆN lên màn hình', 'id hẹn giờ, nút DOM, cờ “đang gửi”'],
    ], { sm: true })}`,
    `${yaml([
      ['const soLan = useRef(0);', '{ current: 0 }'],
      ['', ''],
      ['<button onClick={() =>', ''],
      ['  (soLan.current += 1)}>', 'đổi hộp, React không biết'],
      ['<p>Đã bấm (ref): {soLan.current}</p>', 'vẫn 0'],
    ], { fs: 15 })}
     ${t(['$ npx tsc -b   # useRef<number>() — thiếu đối số', '! error TS2554: Expected 1 arguments, but got 0.'], 'React 19: useRef BẮT BUỘC có giá trị đầu', 13.5)}`) },

  /* 18 */ { t: 'ref tới DOM: đưa focus lên tiêu đề khi sang bác sĩ khác', body: two(
    yaml([
      ['const tieuDeRef = useRef<HTMLHeadingElement>(null);', ''],
      ['', ''],
      ['useEffect(() => {', 'sau commit: nút DOM đã có'],
      ['  tieuDeRef.current?.focus();', ''],
      ['}, [bacSi?.id]);', 'mỗi lần đổi bác sĩ'],
      ['', ''],
      ['<h2 ref={tieuDeRef} tabIndex={-1}>', 'focus được bằng code,'],
      ['  {bacSi.ten}', 'không nằm trong vòng Tab'],
      ['</h2>', ''],
      ['', ''],
      ['// React 19: ref là prop thường', ''],
      ['function ONhapSo({ nhan, ref }) {…}', 'không cần forwardRef'],
    ], { fs: 14 }),
    `${t(['! trước: [focus] đang ở: BODY', '+ sau:   [focus] đang ở: H2 "BS. Hoàng Đức Huy"'], 'vitest · TrangChiTietBacSi.test.tsx', 14)}
     ${box('info', 'SPA đổi trang mà không tải lại ⇒ trình đọc màn hình không biết có trang mới. Đưa focus lên tiêu đề là cách báo “bạn đang ở trang này”.')}
     ${t(["$ npx tsc -b   # ref={(n) => (nutDaGan = n)}", "! TS2322: Type '(n: HTMLDivElement | null) =>", "!   HTMLDivElement | null' is not assignable…"], 'ref callback không được trả về giá trị', 13)}`) },

  /* 19 */ { t: 'useLayoutEffect: đo và đặt lại chỗ TRƯỚC khi trình duyệt vẽ', body: `${khungHinh()}
    ${two(
      bars([
        { l: 'useEffect, render chậm 100ms', sub: 'khung hình đầu tiên được vẽ', v: 20, txt: '20/20 — top = 0', c: 'red' },
        { l: 'useLayoutEffect, chậm 100ms', sub: 'khung hình đầu tiên được vẽ', v: 0.3, txt: '0/20', c: 'grn' },
        { l: 'Cả hai, render nhanh', sub: 'Chromium thật, rê chuột', v: 0.3, txt: '0/20 (máy nhanh)', c: 'amb' },
      ], { lw: 290, max: 20 }),
      anh('rx-11', 'tooltip.jpg', { w: 430, url: 'localhost:5211/bac-si/bs-2', cap: 'ChuThich trong app: đo xong mới vẽ' }))}` },

  /* ───── 11.4 ───── */
  /* 20 */ { t: 'Portal: hộp thoát khỏi overflow: hidden của thẻ cha', body: two(
    anh('rx-11', 'portal-cat.jpg', { w: 560, url: 'localhost:5212/vi-du.html?bai=portal · Chromium', cap: 'Trái: hộp render ngay trong thẻ ⇒ bị cắt. Phải: createPortal(hộp, document.body)' }),
    `${yaml([
      ["import { createPortal } from 'react-dom';", ''],
      ['', ''],
      ['{mo && createPortal(', ''],
      ['  <Hop>…</Hop>,', 'vẽ cái gì'],
      ['  document.body,', 'vẽ VÀO ĐÂU'],
      [')}', ''],
    ], { fs: 15 })}
     ${t(['[vi tri] không portal: cha của hộp = the-bi-cat', '+ qua portal: cha của hộp = BODY'], 'vitest · bai4.test.tsx', 13.5)}`) },

  /* 21 */ { t: 'DOM nằm trong body, nhưng sự kiện nổi bọt theo cây React', body: two(
    haiCay(),
    `${t(['[noi bot] không chặn: hộp: bấm OK', '!   · thẻ: onClick (chọn thẻ)', '+ [noi bot] có chặn: hộp: bấm OK', '[context] hộp trong <body> đọc được:', '+   Cancel this appointment?'], 'vitest · bai4.test.tsx', 13.5)}
     ${box('warn', 'Bấm trong hộp mà thẻ bên dưới bị “chọn” ⇒ chặn ở gốc hộp: <code>onClick={(e) =&gt; e.stopPropagation()}</code>.')}`, 'l') },

  /* 22 */ { t: 'Hộp xác nhận huỷ lịch: portal, focus vào nút an toàn, Escape', body: two(
    anh('rx-11', 'hop-huy.jpg', { w: 600, url: 'localhost:5211/lich-hen · vite preview', cap: 'Chromium thật: focus ở “Không, giữ lại”' }),
    `${list([
      '<code>role="dialog"</code> + <code>aria-modal</code> + <code>aria-labelledby</code> ⇒ trình đọc màn hình đọc đúng tên hộp.',
      'Mở ⇒ <code>useRef</code> + <code>focus()</code> vào nút <strong>không phá gì</strong>.',
      'Escape hoặc bấm nền ⇒ đóng. Đóng ⇒ focus <strong>về nút Huỷ</strong> đã mở hộp.',
      '<code>onDong</code> phải ổn định (<code>useCallback</code>), không thì effect chạy lại mỗi render.',
    ])}
     ${t(['hop-huy: cha của lớp nền = BODY', 'sau Escape: focus về Huỷ lịch lh-1'], 'Playwright · Chromium', 13.5)}`, 'l') },

  /* 23 */ { t: 'Không có ranh giới lỗi: một lỗi lúc render xoá trắng cả app', body: two(
    `${anh('rx-11', 'khong-ranh-gioi.jpg', { w: 540, h: 240, url: 'vi-du.html?bai=khong-ranh-gioi', cap: 'Bấm “Mở giới thiệu (lỗi)”: #root rỗng — mất cả tiêu đề' })}
     ${t(['khong-ranh-gioi: body = ""', "! [pageerror] Cannot read properties of null", "!   (reading 'toUpperCase')"], 'Chromium', 13.5)}`,
    `${anh('rx-11', 'co-ranh-gioi.jpg', { w: 540, h: 240, url: 'vi-du.html?bai=co-ranh-gioi', cap: 'Cùng lỗi, bọc &lt;RanhGioiLoi&gt;: chỉ phần đó thành hộp báo' })}
     ${box('info', 'Từ React 16: lỗi không ai bắt ⇒ React <strong>gỡ cả cây</strong>. Hiện một giao diện hỏng còn nguy hiểm hơn không hiện gì.')}`) },

  /* 24 */ { t: 'Ranh giới lỗi chỉ bắt lỗi lúc render — không bắt onClick', body: two(
    `${table(['Lỗi ném ra ở…', 'Bắt được?'], [
      ['Thân component, lúc render', '+có'],
      ['Effect, ref callback, lifecycle', '+có'],
      ['onClick, onChange…', '-không — tự try/catch'],
      ['setTimeout, Promise, fetch', '-không (trừ startTransition)'],
      ['Chính ranh giới đó', '-không — ranh giới cha bắt'],
      ['useQuery + throwOnError', '+có (TanStack ném lúc render)'],
    ], { sm: true })}
     ${t(['[handler] có hộp lỗi? false', '# bắt trong onClick → setLoi(e) → throw lúc render:', '+ [chuyen loi] hộp: Phần này gặp sự cố.', '+   Lỗi trong onClick · Tải lại phần này'], 'vitest · bai4.test.tsx', 13.5)}`,
    `${anh('rx-11', 'ranh-gioi.jpg', { w: 520, h: 300, url: 'localhost:5211/bac-si/bs-1?loi=chi-tiet', cap: 'API chi tiết trả 500 (3 lần thử lại, ~8,5 s): đầu trang và menu vẫn chạy' })}
     ${box('tip', 'Vẫn là <strong>class component</strong> (React 19.3 chưa có hook cho việc này) — hoặc gói <code>react-error-boundary</code>.')}`) },

  /* 25 */ { t: 'Sai lầm hay gặp ở Chương 11', body: cards([
    { ic: '🔑', t: 'key = index / Math.random()', d: 'index: state trượt khi xoá, thêm, sắp xếp. Math.random(): mount lại mỗi render.', c: 'red' },
    { ic: '🪆', t: 'Khai component trong component', d: 'mỗi render một “loại” mới ⇒ mất focus, mất state. Khai ở cấp module.', c: 'amb' },
    { ic: '♻️', t: 'Reset state bằng useEffect', d: 'một nhịp hiện dữ liệu sai. Dùng key trên component cần reset.', c: 'vio' },
    { ic: '🧹', t: 'Gỡ StrictMode cho “hết chạy hai lần”', d: 'bug vẫn ở đó. Viết cleanup, giữ render thuần.', c: 'pnk' },
    { ic: '📏', t: 'Đo layout trong useEffect', d: 'máy chậm là thấy nháy. Đo rồi đặt lại chỗ: useLayoutEffect.', c: 'ora' },
    { ic: '🧯', t: 'Tưởng ranh giới lỗi bắt mọi thứ', d: 'onClick và async đi thẳng ra window. Bắt rồi setState để ném lại.', c: 'blu' },
  ], 3) },

  /* 26 */ { t: 'Bảng tra nhanh Chương 11', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Biết React làm gì sau setState', 'Trigger → Render → Commit → Paint', 'render ≠ sửa DOM'],
    ['Giữ state khi cha render lại', 'cùng loại + cùng vị trí (+ cùng key)', 'đổi thẻ bọc là mất state'],
    ['Reset state khi đổi dữ liệu', '<code>key={id}</code> trên component đó', 'không dùng effect để reset'],
    ['Ẩn tạm mà giữ state', '<code>&lt;Activity mode="hidden"&gt;</code>', 'React 19.2+, effect bị gỡ'],
    ['Nhớ giá trị không vẽ ra', '<code>useRef(giaTriDau)</code>', 'đổi .current không render'],
    ['Focus, đo, cuộn một nút DOM', '<code>ref</code> + <code>useEffect</code> / <code>useLayoutEffect</code>', 'ref là prop thường (19)'],
    ['Vẽ ra ngoài thẻ cha', '<code>createPortal(jsx, document.body)</code>', 'sự kiện theo cây React'],
    ['Không để lỗi xoá trắng app', 'class có <code>getDerivedStateFromError</code>', 'chỉ lỗi lúc render'],
  ], { sm: true }) },

  /* 27 */ { t: 'Tự gõ tiếp dự án: năm việc, mười bốn test phải xanh', body: two(
    steps([
      ['<code>key={bacSi.id}</code> cho <code>DatLichVoiBacSi</code>', 'đổi bác sĩ ⇒ giờ, form, “đã gửi” về trắng'],
      ['<code>useRef</code> + <code>focus()</code> tiêu đề', 'sang bác sĩ khác ⇒ focus ở &lt;h2&gt;'],
      ['<code>HopXacNhan</code> bằng <code>createPortal</code>', 'huỷ lịch phải xác nhận; Escape; trả focus'],
      ['<code>RanhGioiLoi</code> có <code>resetKeys</code>', '500 ⇒ hộp báo; đổi trang ⇒ hết'],
      ['<code>ChuThich</code> với <code>useLayoutEffect</code>', 'không đủ chỗ phía trên ⇒ lật xuống'],
    ]),
    `${t(['$ npx vitest run src/features --reporter=verbose', '# điểm xuất phát (sau Chương 10):', '!  Tests  7 failed | 1 passed (8)', '# sau khi làm xong 5 việc:', '$ npx vitest run src/features src/components/…', '+  Test Files  4 passed (4)', '+       Tests  14 passed (14)', '$ npx tsc -b && npx vite build', '+ ✓ built in 1.20s'], 'tiêu chí đạt', 13.5)}`) },
]);
