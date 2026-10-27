/**
 * FER202 practice — phần DÙNG CHUNG cho mọi module (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua).
 * ════════════════════════════════════════════════════════════════════════════════════════
 * Định dạng đề: content/codelab/README.md. Đề lớn "bản in": content/codelab/_chung/deLon.mjs.
 * Dấu thay trong chuỗi code (doiDau): ´ ⇒ dấu huyền (backtick), @{ ⇒ ${.
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';

export { doiDau };
export const KHOA = 'front-end-web-development-with-react';

/** src/index.js chuẩn (CRA/Vite đều dùng được). opts: bootstrap, router, redux (đường dẫn store). */
export function index({ bootstrap = false, router = false, redux = null, strict = true } = {}) {
  const imp = [
    "import React from 'react';",
    "import ReactDOM from 'react-dom/client';",
    bootstrap ? "import 'bootstrap/dist/css/bootstrap.min.css';" : null,
    router ? "import { BrowserRouter } from 'react-router-dom';" : null,
    redux ? "import { Provider } from 'react-redux';" : null,
    redux ? `import { store } from '${redux}';` : null,
    "import App from './App';",
  ].filter(Boolean).join('\n');
  let el = '<App />';
  if (router) el = `<BrowserRouter>\n      ${el}\n    </BrowserRouter>`;
  if (redux) el = `<Provider store={store}>\n      ${el.replace(/\n/g, '\n  ')}\n    </Provider>`;
  if (strict) el = `<React.StrictMode>\n    ${el.replace(/\n/g, '\n  ')}\n  </React.StrictMode>`;
  return `// src/index.js — điểm vào của ứng dụng (đã cho sẵn, không cần sửa)
${imp}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  ${el}
);
`;
}

/** Thuật ngữ hay dùng — chọn bằng tên để không viết lại. */
export const TN = {
  component: { en: 'component', vi: 'thành phần giao diện (hàm trả về JSX)' },
  props: { en: 'props', vi: 'dữ liệu cha truyền xuống con (chỉ đọc)' },
  state: { en: 'state', vi: 'dữ liệu riêng của component, đổi ⇒ render lại' },
  render: { en: 'render', vi: 'vẽ (gọi component để ra giao diện)' },
  controlled: { en: 'controlled input', vi: 'ô nhập do state điều khiển (value + onChange)' },
  key: { en: 'key prop', vi: 'khoá định danh ổn định cho từng phần tử của danh sách' },
  mutate: { en: 'mutate', vi: 'sửa trực tiếp object/mảng (cấm với state)' },
  immutable: { en: 'immutable update', vi: 'cập nhật bằng cách tạo object/mảng MỚI' },
  derived: { en: 'derived value', vi: 'giá trị suy ra từ state/props — tính lại, không lưu state riêng' },
  sideEffect: { en: 'side effect', vi: 'tác dụng phụ (gọi API, hẹn giờ, đụng DOM…) — đặt trong useEffect' },
  deps: { en: 'dependency array', vi: 'mảng phụ thuộc của useEffect/useMemo — chạy lại khi phần tử đổi' },
  caseInsensitive: { en: 'case-insensitive', vi: 'không phân biệt chữ hoa/thường' },
  placeholder: { en: 'placeholder', vi: 'chữ gợi ý mờ trong ô nhập' },
  validate: { en: 'validate / validation', vi: 'kiểm tra dữ liệu hợp lệ' },
  endpoint: { en: 'endpoint', vi: 'địa chỉ API (method + URL)' },
  payload: { en: 'payload / request body', vi: 'dữ liệu gửi kèm request' },
  queryParam: { en: 'query parameter', vi: 'tham số sau dấu ? trên URL (vd ?status=ACTIVE)' },
  routeParam: { en: 'route parameter', vi: 'phần động của đường dẫn (vd :id trong /books/:id)' },
  redirect: { en: 'redirect / navigate', vi: 'chuyển sang trang khác bằng mã' },
  fallback: { en: 'fallback', vi: 'giao diện tạm hiện trong lúc chờ' },
  rubric: { en: 'rubric', vi: 'thang điểm theo tiêu chí' },
  persist: { en: 'persist', vi: 'lưu bền — còn sau khi tải lại trang' },
  badge: { en: 'badge', vi: 'nhãn nhỏ có màu (Bootstrap .badge)' },
  thumbnail: { en: 'thumbnail', vi: 'ảnh thu nhỏ' },
  confirm: { en: 'confirmation prompt', vi: 'hộp hỏi xác nhận (window.confirm)' },
  prefill: { en: 'pre-fill', vi: 'điền sẵn dữ liệu cũ vào form' },
};
export const tn = (...ten) => ten.map((t) => TN[t]);

/**
 * Bài nhỏ trắc nghiệm (choice) / sắp xếp (order) / điền bảng (table): tự sinh `answers.md` cho khoiDau
 * (đề) và loiGiai (đáp án + giải thích) — bộ xuất bắt buộc có hai tệp này; giao diện dùng khung trả lời.
 * q = { tieuDe, doKho, phut, moTa:{en,vi}, yeuCau?, cauHoi?: [...] | bang?: [...], loai:'choice'|'order'|'table', ... }
 */
export function tinh(q) {
  const loai = q.loai || 'choice';
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const chu = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const de = ds.map((c, i) => `${i + 1}. ${chu(c.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v[0] : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((c, i) => {
      const d = Array.isArray(c.dapAn) ? (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn) : [c.dapAn];
      const muc = c.luaChon || c.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((x) => x.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(c.de)}\n   Answer: ${ten}\n   ${chu(String(c.giaiThich || '').replace('|||', ' / '))}`;
    }).join('\n\n');
  }
  // giải thích từng câu: "EN|||VI" ⇒ hiện cả hai (khung trả lời hiển thị HTML thô, không tách ngôn ngữ)
  const haiNgu = (g) => {
    if (typeof g !== 'string' || !g.includes('|||')) return g;
    const [en, vi] = g.split('|||');
    return `<p>${en.trim()}</p><p><i>🇻🇳 ${vi.trim()}</i></p>`;
  };
  const tests = loai === 'table'
    ? { loai, bang: q.bang.map((b) => ({ ...b, giaiThich: haiNgu(b.giaiThich) })) }
    : { loai, cauHoi: q.cauHoi.map((c) => ({ ...c, giaiThich: haiNgu(c.giaiThich) })) };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  return {
    ngonNgu: 'text',
    yeuCau: q.yeuCau || [
      { en: 'Answer every question in the answer panel, then press <b>Submit</b>.', vi: 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.' },
      { en: 'All questions must be correct to get <b>Accepted</b>; the explanations appear after you submit.', vi: 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.' },
    ],
    viDu: q.viDu || [{ input: 'Question → choose an option', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question is one check.|||Mỗi câu là một kiểm.' }],
    ...rest,
    tests,
    khoiDau: { 'answers.md': `# ${typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en}\n\nAnswer in the panel on the left (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en} — answer key\n\n${dap}\n` },
  };
}

/** Lựa chọn nhanh: ['a', 'nội dung'] … ⇒ [{ma, noiDung}] */
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));

/** Nộp bài chung cho đề lớn. */
export const NOP_BAI = {
  en: 'Work directly in the editor (files on the right) or download the starter, run it locally with Vite/CRA (+ <code>npx json-server --watch database.json --port 9999</code> when the paper uses an API) and paste the files back. Press <b>Run</b> for the sample checks and <b>Submit</b> for full grading (hidden checks included).',
  vi: 'Làm thẳng trong editor (các tệp bên phải) hoặc tải starter, chạy trên máy bằng Vite/CRA (+ <code>npx json-server --watch database.json --port 9999</code> khi đề dùng API) rồi dán lại tệp. Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ (kể cả kiểm ẩn).',
};

/**
 * Bài nhỏ React: App.js là tệp chính (renderTu) — hoặc { index: {router…} } để có src/index.js (bài Router/Redux).
 * o = { giai, dau, them?: {tệp chung}, themGiai?: {...}, themDau?: {...}, thuVien?, url?, jsonServer?, fetchGia?,
 *       khoCucBo?, index?: { router, bootstrap, redux }, kiem, ...trường đề }
 */
export function reactNho(o) {
  const { giai, dau, them = {}, themGiai = {}, themDau = {}, thuVien = [], url, jsonServer, fetchGia, khoCucBo, index: ix, kiem, ...rest } = o;
  const coIndex = !!ix;
  const tepIndex = coIndex ? { 'src/index.js': index(ix) } : {};
  return {
    ...rest,
    tests: {
      loai: 'react', phienBan: 1,
      ...(coIndex ? { tepChinh: 'src/index.js' } : { renderTu: 'src/App.js' }),
      ...(thuVien.length ? { thuVien } : {}),
      ...(url ? { url } : {}), ...(jsonServer ? { jsonServer } : {}), ...(fetchGia ? { fetchGia } : {}), ...(khoCucBo ? { khoCucBo } : {}),
      kiem,
    },
    khoiDau: { 'src/App.js': dau, ...them, ...themDau, ...tepIndex },
    loiGiai: { 'src/App.js': giai, ...them, ...themGiai, ...tepIndex },
  };
}

/** Bài nhỏ JS (máy chấm gọi hàm): một tệp main.js (hoặc tep), nạp như script thường. */
export function jsNho(o) {
  const { giai, dau, tep = 'main.js', tepNap, them = {}, kiem, loai = 'js', ...rest } = o;
  return {
    ...rest,
    tests: { loai, phienBan: 1, tepChinh: tep, ...(tepNap ? { tepNap } : {}), kiem },
    khoiDau: { [tep]: dau, ...them },
    loiGiai: { [tep]: giai, ...them },
  };
}

/** Bài ES module (máy chấm 'module' — chỉ web; app desktop báo "bỏ qua"). */
export function moduleNho(o) {
  const { giai, dau, tep = 'main.js', kiem, ...rest } = o;
  return { ...rest, tests: { loai: 'module', phienBan: 1, tepChinh: tep, kiem }, khoiDau: dau, loiGiai: giai };
}

/** "Interview corner" của chương: trắc nghiệm, mỗi đáp án đúng kèm câu trả lời mẫu (giaiThich). */
export function phongVan({ chuong, chuDe, cauHoi, baiHoc, slug }) {
  return {
    slug,
    ten: `Interview corner — ${chuDe}`,
    khoa: KHOA,
    baiHoc,
    de: [tinh({
      tieuDe: `Interview corner — ${chuDe} (Chapter ${chuong})`,
      doKho: 'MEDIUM',
      phut: 15,
      khaiNiem: ['interview', chuDe],
      the: ['fer202', 'interview'],
      moTa: {
        en: `<p>Questions a junior React interviewer actually asks about <b>${chuDe}</b>. Pick the best answer; after you submit, each question shows a <b>model answer</b> you can say out loud in an interview (30–60 seconds).</p>`,
        vi: `<p>Câu hỏi phỏng vấn React junior thường gặp về <b>${chuDe}</b>. Chọn đáp án đúng nhất; sau khi nộp, mỗi câu hiện <b>câu trả lời mẫu</b> để bạn nói lại khi phỏng vấn (30–60 giây).</p>`,
      },
      goiY: ['Loại trừ đáp án nói "luôn luôn"/"không bao giờ" khi thực tế có ngoại lệ.', 'Đọc kỹ câu hỏi hỏi "vì sao" hay "khi nào" — đáp án đúng thường nêu được lý do.'],
      loiHayGap: ['Học thuộc định nghĩa mà không nói được VÍ DỤ — người phỏng vấn sẽ hỏi tiếp "cho ví dụ".', 'Trả lời quá dài, lan man; hãy nói ý chính trước rồi mới giải thích.'],
      giaiThich: { en: '<p>Each question has a model answer shown after submission. Practise saying them aloud.</p>', vi: '<p>Mỗi câu có câu trả lời mẫu hiện sau khi nộp. Hãy luyện nói thành tiếng.</p>' },
      thuatNgu: [{ en: 'model answer', vi: 'câu trả lời mẫu' }, { en: 'trade-off', vi: 'đánh đổi (được cái này, mất cái kia)' }],
      cauHoi,
    })],
  };
}
