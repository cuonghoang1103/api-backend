// Dựng CuongMini CLI thành 2 file, KHÔNG cần node_modules lúc chạy:
//  • dist/cuongmini.mjs — giao diện (Ink + React), ESM vì yoga-layout của Ink có
//    top-level await; dòng đầu là shebang để chạy thẳng.
//  • dist/loi.cjs       — LÕI AI Code (packages/cuongmini-core), CommonJS RIÊNG:
//    lõi móc `Module._load` so `__filename` của chính nó — gói chung vào bản ESM là
//    móc trượt (xem `src/ketNoi.ts`).
import { build } from 'esbuild';
import { chmodSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cauHinhLoi } from '../cuongmini-core/esbuildLoi.mjs';

const goc = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(goc, 'package.json'), 'utf8'));
const nen = !process.argv.includes('--khong-nen');

// `react-devtools-core` là phụ thuộc TUỲ CHỌN của Ink (chỉ nạp khi DEV=true) — thay bằng module rỗng
// để bản ESM không có `import` tĩnh tới một gói không tồn tại.
const boDevtools = {
  name: 'bo-devtools',
  setup(b) {
    b.onResolve({ filter: /^react-devtools-core$/ }, () => ({ path: 'react-devtools-core', namespace: 'rong' }));
    b.onLoad({ filter: /.*/, namespace: 'rong' }, () => ({ contents: 'export default { connectToDevTools() {} };', loader: 'js' }));
  },
};

await Promise.all([
  build({
    entryPoints: [path.join(goc, 'src/main.tsx')],
    outfile: path.join(goc, 'dist/cuongmini.mjs'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    jsx: 'automatic',
    minify: nen,
    legalComments: 'none',
    logLevel: 'info',
    // Gói CommonJS bên trong (signal-exit…) gọi `require` — ESM không có sẵn, phải dựng lại.
    banner: { js: '#!/usr/bin/env node\nimport { createRequire as __taoRequire } from "node:module"; const require = __taoRequire(import.meta.url);' },
    define: { __PHIEN_BAN__: JSON.stringify(pkg.version), 'process.env.DEV': '"false"' },
    // Lệnh `/` dùng CHUNG một bản với app desktop (phần thuần, không React).
    alias: { 'ct-lenh': path.resolve(goc, '../../desktop/src/renderer/features/chat/lenhGach.ts') },
    plugins: [boDevtools],
  }),
  // CI không cài cả `desktop/` (Electron, gói native) chỉ để lấy zod + unpdf cho lõi: cài riêng hai gói
  // đó rồi trỏ `CUONGMINI_NODE_PATHS` vào — esbuild tìm ở đây khi không thấy trong cây thư mục.
  build({ ...cauHinhLoi({ outfile: path.join(goc, 'dist/loi.cjs'), minify: nen }), nodePaths: (process.env.CUONGMINI_NODE_PATHS ?? '').split(path.delimiter).filter(Boolean) }),
]);
chmodSync(path.join(goc, 'dist/cuongmini.mjs'), 0o755);
