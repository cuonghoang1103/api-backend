/**
 * _cs-chung.mjs — khuôn slide "⭐ Chuyên sâu" cho phần TỰ THÊM ngoài giáo trình (DBI202, CSD201, … — 30/09/2026).
 *
 * Người dùng dặn: phần tự thêm phải có slide "giống trường" và phải ĐÁNH DẤU là chuyên sâu. Nên bố cục chép
 * dáng slide FU (nền trắng, tiêu đề xám đậm căn giữa, gạch mảnh, dải chân cam–nâu có tên chủ đề + số trang)
 * nhưng KHÔNG dùng logo FPT (không mạo danh trường): góc trái trên là nhãn "⭐ Chuyên sâu · cuongthai.com".
 *
 * ⚠️ Không sửa `_render-slides.mjs` (dùng chung mọi môn). Khuôn này là một lớp phủ `position:fixed` nhúng
 * trong body của từng slide, che khung xanh mặc định của bộ render. Mỗi slide của deck: { t: '', body: cs(...) }.
 *
 *   import { lamDeck, code } from './_cs-chung.mjs';
 *   export const deck = { key: 'cs1', code: 'CS1', title: '…', sub: '…' };
 *   export const slides = lamDeck('LỊCH SỬ & HỆ SINH THÁI CSDL', [
 *     { cover: true, t: 'Lịch sử các hệ CSDL', sub: 'Từ tủ hồ sơ tới PostgreSQL' },
 *     { t: 'Trước năm 1970: dữ liệu nằm trong file', body: `<ul><li>…</li></ul>` },
 *   ]);
 */
import { code as codeWf } from './_wf-chung.mjs';

export const CSS = `<style>
.cs{position:fixed;inset:0;z-index:50;background:#fff;font-family:Arial,"Helvetica Neue","Arial Unicode MS",sans-serif;
  color:#404040;display:flex;flex-direction:column}
.cs .tag{position:absolute;top:12px;left:18px;background:#fff4e6;color:#b85a2b;border:1.5px solid #e8a15a;
  border-radius:20px;padding:4px 12px;font-size:15px;font-weight:700;letter-spacing:.3px}
.cs h2{margin:52px 90px 0;font-size:42px;line-height:1.15;font-weight:700;color:#404040;text-align:center}
.cs hr{border:0;border-top:1.5px solid #bfbfbf;margin:14px 70px 0}
.cs .nd{flex:1;padding:0 84px 10px;font-size:25px;line-height:1.45;display:flex;flex-direction:column;
  justify-content:flex-start;gap:14px;overflow:hidden;padding-top:26px}
.cs .nd ul,.cs .nd ol{padding-left:30px;display:flex;flex-direction:column;gap:8px}
.cs .nd li::marker{color:#e08a1e}
.cs .nd b,.cs .nd strong{color:#262626}
.cs .nd .do{color:#e02020;font-weight:700}
.cs .nd .nho{font-size:20px;color:#666}
.cs .nd table{border-collapse:collapse;font-size:20px;width:100%}
.cs .nd th,.cs .nd td{border:1.5px solid #bfbfbf;padding:7px 10px;text-align:left}
.cs .nd th{background:#e08a1e;color:#fff}
.cs .nd tr:nth-child(even) td{background:#fbe9dc}
.cs .nd .hai{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
.cs .nd .o{border-left:6px solid #e08a1e;background:#fff7ef;padding:10px 16px;border-radius:0 8px 8px 0;font-size:22px}
.cs .nd .o.xanh{border-color:#2f7d4f;background:#f1f9f4}
.cs .nd .o.do2{border-color:#c0392b;background:#fdf0ee}
.cs .nd pre.vs{font-size:17px}
.cs .chan{height:62px;background:#b85a2b;border-top:9px solid #e08a1e;display:flex;align-items:center;
  justify-content:center;position:relative;color:#fff;font-size:14px;letter-spacing:.6px;text-transform:uppercase}
.cs .chan .so{position:absolute;right:40px;font-size:16px;letter-spacing:0}
.cs.bia{justify-content:center;align-items:center;text-align:center}
.cs.bia h2{font-size:56px;margin:0 90px}
.cs.bia .phu{font-size:28px;color:#666;margin-top:18px}
.cs.bia .dai{position:absolute;bottom:0;left:0;right:0;height:62px;background:#b85a2b;border-top:9px solid #e08a1e}
</style>`;

/** Khối mã tô màu kiểu VS Code (dùng lại của Web Foundations). lang: sql | java | javascript | bash … */
export const code = (src, lang = 'sql', cls = '') => codeWf(src, lang, cls);

/** Một slide ⭐ Chuyên sâu. */
export function cs({ t, body = '', topic, page, total, cover = false, sub = '' }) {
  if (cover) {
    return `${CSS}<div class="cs bia"><span class="tag">⭐ Chuyên sâu · cuongthai.com</span>` +
      `<h2>${t}</h2>${sub ? `<div class="phu">${sub}</div>` : ''}<div class="dai"></div></div>`;
  }
  return `${CSS}<div class="cs"><span class="tag">⭐ Chuyên sâu · cuongthai.com</span><h2>${t}</h2><hr>` +
    `<div class="nd">${body}</div><div class="chan">${topic}<span class="so">${page}</span></div></div>`;
}

/** Dựng mảng slides cho `_render-slides.mjs`, tự đánh số trang. */
export function lamDeck(topic, items) {
  return items.map((it, i) => ({ t: '', kind: undefined, body: cs({ ...it, topic, page: i + 1, total: items.length }) }));
}
