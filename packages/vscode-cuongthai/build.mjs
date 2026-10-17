// Dựng 3 gói:
//  • dist/extension.js — extension (Node, CommonJS, `vscode` là external)
//  • dist/loi.js       — LÕI ĐỘC LẬP: AI Code của app desktop chạy không cần app (xem src/doclap/loi.ts)
//  • dist/webview.js   — giao diện khung chat (trình duyệt, IIFE)
import { build, context } from 'esbuild';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.dirname(fileURLToPath(import.meta.url));
const desktop = path.resolve(goc, '../../desktop/src/main');
const doclap = path.join(goc, 'src/doclap');

/**
 * Module "vỏ app" của desktop ⇒ bản thay. Chỉ đúng mấy cái này: phần còn lại
 * (vòng lặp, tool, skill, MCP, quyền…) đi NGUYÊN mã của app.
 */
const THAY = new Map([
  [path.join(desktop, 'ipc/index.ts'), path.join(doclap, 'ipcThay.ts')],
  [path.join(desktop, 'ipc/auth.ts'), path.join(doclap, 'authThay.ts')],
  [path.join(desktop, 'window.ts'), path.join(doclap, 'cuaSoThay.ts')],
  [path.join(desktop, 'aiCucBo/quanLy.ts'), path.join(doclap, 'aiCucBoThay.ts')],
]);

const thayVoApp = {
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

const xem = process.argv.includes('--watch');
const chung = { bundle: true, minify: !xem, sourcemap: xem, logLevel: 'info' };
const ds = [
  { ...chung, entryPoints: ['src/extension.ts'], outfile: 'dist/extension.js', platform: 'node', format: 'cjs', target: 'node20', external: ['vscode', './loi.js'] },
  {
    ...chung, entryPoints: ['src/doclap/loi.ts'], outfile: 'dist/loi.js', platform: 'node', format: 'cjs', target: 'node20',
    alias: { electron: path.join(doclap, 'electron.ts') }, plugins: [thayVoApp],
  },
  {
    ...chung, entryPoints: ['webview/main.ts'], outfile: 'dist/webview.js', platform: 'browser', format: 'iife', target: 'es2022',
    // Lệnh `/` dùng CHUNG một bản với app desktop (phần thuần, không React).
    alias: { 'ct-lenh': path.resolve(goc, '../../desktop/src/renderer/features/chat/lenhGach.ts') },
  },
];
// `--meta`: in ra lõi gói những gì (soi xem có kéo nhầm module vỏ app nào không).
const meta = process.argv.includes('--meta');
if (meta) ds[1].metafile = true;
if (xem) for (const c of ds) await (await context(c)).watch();
else {
  const kq = await Promise.all(ds.map((c) => build(c)));
  if (meta) {
    const goi = new Map();
    const tep = [];
    for (const [k, v] of Object.entries(kq[1].metafile.inputs)) {
      const m = /node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(k);
      if (m) goi.set(m[1], (goi.get(m[1]) ?? 0) + v.bytes);
      else tep.push(k.replace(/.*desktop\/src\//, 'desktop/').replace(/.*vscode-cuongthai\//, ''));
    }
    console.log('Gói npm:', [...goi].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(v / 1024) | 0}k`).join(', '));
    console.log(`${tep.length} file mã:`, tep.filter((x) => !x.startsWith('desktop/main/agent/') && !x.endsWith('.md')).join(' '));
  }
}
