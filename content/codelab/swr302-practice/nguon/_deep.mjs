/**
 * Bộ dựng kiểm cho Deep Lab SWR302 (đề "động cơ" — người học viết hàm, chấm trên dữ liệu mẫu + dữ liệu ẩn).
 *
 *   chay(giai, bieuThuc)          — chạy LỜI GIẢI tham chiếu (chuỗi mã) trong vm cô lập lúc dựng đề, trả kết quả (JSON)
 *   kiemCa(giai, ca)              — mỗi ca { moTa, goi, mong?, nhom, an, sua? } ⇒ một kiểm 'js':
 *                                   so JSON.stringify(goi) của bài nộp với `mong` (mặc định = chay(giai, goi)).
 *   Ca nào ghi `mong` tay thì đó là chốt chặn độc lập: nếu lời giải tham chiếu lệch, dựng đề sẽ NÉM LỖI.
 */
import vm from 'node:vm';
import { kiemTuy } from './_chung.mjs';

export function chay(giai, bieuThuc) {
  const ctx = vm.createContext({});
  vm.runInContext(`${giai}\n;globalThis.__kq = JSON.stringify(${bieuThuc});`, ctx, { timeout: 2000 });
  return ctx.__kq === undefined ? undefined : JSON.parse(ctx.__kq);
}

const catNgan = (s) => (s.length > 220 ? `${s.slice(0, 220)}…` : s);

export function kiemCa(giai, ca) {
  return ca.map((c) => {
    const tinh = chay(giai, c.goi);
    if ('mong' in c && JSON.stringify(c.mong) !== JSON.stringify(tinh)) {
      throw new Error(`Deep lab: lời giải tham chiếu lệch ca "${c.moTa.en}": mong ${JSON.stringify(c.mong)} — tính ra ${JSON.stringify(tinh)}`);
    }
    const mong = JSON.stringify(tinh);
    const than = `var __r; try { __r = (${c.goi}); } catch (e) { return (e && e.name === 'ReferenceError' ? 'missing: ' : 'error: ') + (e && e.message); }
var a = JSON.stringify(__r === undefined ? null : __r), b = ${JSON.stringify(mong)};
if (a === b) return 'OK';
return ${JSON.stringify(c.goiY ? `${c.goiY} — ` : '')} + ${c.an ? `'got ' + (a.length > 220 ? a.slice(0, 220) + '…' : a)` : `'expected ' + ${JSON.stringify(catNgan(mong))} + ', got ' + (a.length > 220 ? a.slice(0, 220) + '…' : a)`};`;
    return kiemTuy(c.moTa, new Function(than), { ...(c.nhom ? { nhom: c.nhom } : {}), ...(c.an ? { an: true } : {}) });
  });
}

/** In dữ liệu mẫu gọn: mỗi phần tử của mảng (hoặc mảng con trong object) một dòng. */
function gonJson(v, thut = '') {
  const j = (x) => JSON.stringify(x).replace(/,"/g, ', "').replace(/":/g, '": ');
  if (Array.isArray(v)) return v.length && v.some((x) => x && typeof x === 'object') ? `[\n${v.map((x) => `${thut}  ${j(x)}`).join(',\n')}\n${thut}]` : j(v);
  if (v && typeof v === 'object') return `{\n${Object.entries(v).map(([k, x]) => `${thut}  ${k}: ${gonJson(x, `${thut}  `)}`).join(',\n')}\n${thut}}`;
  return j(v);
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const preJson = (ten, v) => `<pre><code>${esc(`const ${ten} = ${gonJson(v)};`)}</code></pre>`;
