// Dựng 2 gói: extension (Node, CommonJS, `vscode` là external) + giao diện webview (trình duyệt, IIFE).
import { build, context } from 'esbuild';

const xem = process.argv.includes('--watch');
const chung = { bundle: true, minify: !xem, sourcemap: xem, logLevel: 'info' };
const ds = [
  { ...chung, entryPoints: ['src/extension.ts'], outfile: 'dist/extension.js', platform: 'node', format: 'cjs', target: 'node20', external: ['vscode'] },
  { ...chung, entryPoints: ['webview/main.ts'], outfile: 'dist/webview.js', platform: 'browser', format: 'iife', target: 'es2022' },
];
if (xem) for (const c of ds) await (await context(c)).watch();
else await Promise.all(ds.map((c) => build(c)));
