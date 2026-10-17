// Cấu hình esbuild dựng LÕI AI Code (src/loi.ts ⇒ một file CommonJS) — dùng chung cho
// extension VS Code và CuongMini CLI. Mã AI Code là CỦA APP (`desktop/src/main/**`):
// `electron` ⇒ `src/electron.ts`, vài module vỏ app ⇒ bản thay; phần còn lại đi nguyên.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.dirname(fileURLToPath(import.meta.url));
const desktop = path.resolve(goc, '../../desktop/src/main');
const src = path.join(goc, 'src');

/** Module "vỏ app" của desktop ⇒ bản thay. */
export const THAY = new Map([
  [path.join(desktop, 'ipc/index.ts'), path.join(src, 'ipcThay.ts')],
  [path.join(desktop, 'ipc/auth.ts'), path.join(src, 'authThay.ts')],
  [path.join(desktop, 'window.ts'), path.join(src, 'cuaSoThay.ts')],
  [path.join(desktop, 'aiCucBo/quanLy.ts'), path.join(src, 'aiCucBoThay.ts')],
  // Trình duyệt nhúng (WebContentsView) ⇒ trình duyệt THẬT có sẵn trên máy, lái bằng puppeteer-core.
  [path.join(desktop, 'browser.ts'), path.join(src, 'trinhDuyetThay.ts')],
  // Bộ vẽ sơ đồ (BrowserWindow ẩn) ⇒ Chrome/Edge headless qua puppeteer-core.
  [path.join(desktop, 'agent/boVeSoDo.ts'), path.join(src, 'boVeSoDoThay.ts')],
]);

export const thayVoApp = {
  name: 'thay-vo-app',
  setup(b) {
    b.onResolve({ filter: /^\.\.?\// }, (a) => {
      if (!a.importer.startsWith(desktop)) return undefined;
      const p = path.resolve(a.resolveDir, a.path);
      for (const thu of [p, `${p}.ts`, path.join(p, 'index.ts')]) {
        const t = THAY.get(thu);
        if (t) return { path: t };
        if (existsSync(thu) && thu.endsWith('.ts')) break;
      }
      return undefined;
    });
    // Skill dựng sẵn import `*.md?raw` (cú pháp Vite) ⇒ nạp thành chuỗi.
    b.onResolve({ filter: /\?raw$/ }, (a) => ({ path: path.resolve(a.resolveDir, a.path.replace(/\?raw$/, '')), namespace: 'raw' }));
    b.onLoad({ filter: /.*/, namespace: 'raw' }, (a) => ({ contents: readFileSync(a.path, 'utf8'), loader: 'text' }));
  },
};

/** Tuỳ chọn esbuild cho lõi. `outfile` = nơi ghi `loi.js`. */
export function cauHinhLoi({ outfile, minify = true, sourcemap = false }) {
  return {
    entryPoints: [path.join(src, 'loi.ts')], outfile, bundle: true, minify, sourcemap, logLevel: 'info',
    platform: 'node', format: 'cjs', target: 'node20',
    alias: { electron: path.join(src, 'electron.ts') }, plugins: [thayVoApp],
  };
}
