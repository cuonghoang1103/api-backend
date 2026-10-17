// Dựng 3 gói:
//  • dist/extension.js — extension (Node, CommonJS, `vscode` là external)
//  • dist/loi.js       — LÕI ĐỘC LẬP: AI Code của app desktop chạy không cần app (packages/cuongmini-core, dùng chung với CuongMini CLI)
//  • dist/webview.js   — giao diện khung chat (trình duyệt, IIFE)
import { build, context } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cauHinhLoi } from '../cuongmini-core/esbuildLoi.mjs';

const goc = path.dirname(fileURLToPath(import.meta.url));
const xem = process.argv.includes('--watch');
const chung = { bundle: true, minify: !xem, sourcemap: xem, logLevel: 'info' };
const ds = [
  { ...chung, entryPoints: ['src/extension.ts'], outfile: 'dist/extension.js', platform: 'node', format: 'cjs', target: 'node20', external: ['vscode', './loi.js'] },
  cauHinhLoi({ outfile: 'dist/loi.js', minify: !xem, sourcemap: xem }),
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
