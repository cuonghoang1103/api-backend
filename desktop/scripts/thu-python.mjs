/**
 * Chạy THẬT hộp cát Python trong app đã đóng gói.
 *
 *   npm run thu:python
 *
 * numpy/pandas có tính đúng số không, matplotlib có ra file PNG hợp lệ không,
 * quên `plt.show()` thì mất ảnh hay vẫn còn, import một gói không tồn tại thì
 * người dùng đọc được gì — không có cách nào đọc mã mà biết. Cả bốn thứ đó đều
 * phụ thuộc vào WASM, vào bộ vẽ AGG và vào wheel nằm đúng chỗ trong bản dựng.
 */
import { _electron as electron } from 'playwright';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const ud = fs.mkdtempSync(path.join(os.tmpdir(), 'py-'));
const kq = [];
const check = (t, ok, chi='') => { kq.push(ok); console.log(`  ${ok?'\x1b[32m✓\x1b[0m':'\x1b[31m✗\x1b[0m'} ${t}${chi?` — ${chi}`:''}`); };

const app = await electron.launch({
  args: [`--user-data-dir=${ud}`, path.join(root, 'dist/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'bundle' },
});
await app.firstWindow();
await new Promise(r => setTimeout(r, 2500));
let w = null;
for (let i = 0; i < 40 && !w; i++) {
  for (const p of app.windows()) if (await p.locator('#root').count().catch(()=>0)) { w = p; break; }
  if (!w) await new Promise(r => setTimeout(r, 250));
}
if (!w) throw new Error('không thấy cửa sổ chính');

/** Chạy mã Python đúng bằng worker của app, trả về {ra, loi, file}. */
// ⚠️ Tên file worker mang MÃ BĂM (`pythonWorker-CR2VQsUm.js`). Gõ cứng
// `/assets/pythonWorker.js` thì `new Worker` hỏng ÂM THẦM — không lỗi nào nổi
// lên, promise không bao giờ hoàn thành, và phép kiểm treo tới hết giờ. Tìm
// tên thật trên đĩa rồi truyền vào.
const tenWorker = fs.readdirSync(path.join(root, 'dist/renderer/assets'))
  .find((f) => f.startsWith('pythonWorker-') && f.endsWith('.js'));
if (!tenWorker) throw new Error('không thấy pythonWorker-*.js trong bản dựng');
console.log(`  (worker: ${tenWorker})`);

const chay = (ma) => w.evaluate(async ([src, ten]) => {
  const wk = new Worker(new URL(`/assets/${ten}`, location.origin), { type: 'module' });
  return await new Promise((xong) => {
    const het = setTimeout(() => { wk.terminate(); xong({ loi: 'QUÁ GIỜ 180s' }); }, 180000);
    wk.onmessage = (e) => {
      const d = e.data;
      if (d.loai === 'nap') return;
      clearTimeout(het);
      xong({ ra: d.ra, loi: d.loi, file: (d.file ?? []).map((f) => ({ ten: f.ten, n: f.dulieu.length, dau: Array.from(f.dulieu.slice(0, 8)) })) });
      wk.terminate();
    };
    wk.onerror = (ev) => { clearTimeout(het); xong({ loi: `worker hỏng: ${ev.message ?? ev.type}` }); };
    wk.postMessage({ id: 1, ma: src });
  });
}, [ma, tenWorker]);

console.log('\nHộp cát Python:');
const a = await chay('print("xin chào", 6*7)');
check('Python chạy được', a.ra?.includes('42'), (a.ra ?? a.loi ?? '').trim().slice(0, 60));

const b = await chay('import numpy as np\nprint(np.arange(5).sum(), np.__version__)');
check('numpy tính đúng', /^10 /.test((b.ra ?? '').trim()), (b.ra ?? b.loi ?? '').trim().slice(0, 60));

const c = await chay('import pandas as pd\ndf = pd.DataFrame({"a":[1,2,3],"b":[4,5,6]})\nprint(df["a"].sum(), df["b"].mean())');
check('pandas tính đúng', (c.ra ?? '').trim().startsWith('6 5.0'), (c.ra ?? c.loi ?? '').trim().slice(0, 60));

const d = await chay('import matplotlib.pyplot as plt\nplt.plot([1,2,3],[2,4,9])\nplt.title("thử")\nplt.show()');
const png = (d.file ?? []).find(f => f.ten.endsWith('.png'));
check('matplotlib ra file PNG', !!png, png ? `${png.ten} ${(png.n/1024).toFixed(0)}KB` : (d.loi ?? 'không có file'));
// 89 50 4E 47 = chữ ký PNG. File đủ byte mà sai chữ ký thì trình xem báo hỏng.
check('PNG có chữ ký hợp lệ', png ? png.dau[0]===137 && png.dau[1]===80 && png.dau[2]===78 && png.dau[3]===71 : false,
  png ? png.dau.slice(0,4).join(' ') : '');

const e = await chay('import matplotlib.pyplot as plt\nplt.plot([1,2],[3,4])');
check('QUÊN plt.show() vẫn ra ảnh', (e.file ?? []).some(f => f.ten.endsWith('.png')), `${(e.file ?? []).length} file`);

const f = await chay('import khong_ton_tai_dau');
check('gói không có ⇒ báo lỗi rõ, không treo', !!f.loi && /ModuleNotFound|No module/i.test(f.loi),
  JSON.stringify({ ra: f.ra, loi: f.loi }).slice(0, 160));

await app.close();
fs.rmSync(ud, { recursive: true, force: true });
const hong = kq.filter(x => !x).length;
console.log(hong ? `\n\x1b[31m${hong} phép kiểm HỎNG\x1b[0m` : `\n\x1b[32m${kq.length}/${kq.length} phép kiểm đạt\x1b[0m`);
process.exit(hong ? 1 : 0);
