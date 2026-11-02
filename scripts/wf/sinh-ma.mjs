#!/usr/bin/env node
/**
 * sinh-ma.mjs — gom mã ví dụ + output chạy thật của khoá Web Foundations vào content/courses/web-foundations/_ma.mjs
 *   CODE['11-1/dem.js'] = nội dung tệp · OUT['11-1/dem'] = nội dung dem.out.txt
 * Chạy sau scripts/wf/chay-demo.mjs. Ảnh *.png không vào đây (deck đọc thẳng từ _demo/).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEMO = path.join(GOC, 'content/courses/web-foundations/_demo');
const CODE = {}, OUT = {};
const walk = (dir, rel = '') => {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f), r = rel ? `${rel}/${f}` : f;
    if (fs.statSync(p).isDirectory()) { if (f !== 'node_modules' && f !== '.git') walk(p, r); continue; }
    if (/\.png$|\.webp$|\.webm$/.test(f)) continue;
    const s = fs.readFileSync(p, 'utf8');
    if (f.endsWith('.out.txt')) OUT[r.replace(/\.out\.txt$/, '')] = s.replace(/\n+$/, '');
    else CODE[r] = s.replace(/^\/\/ chay: tay.*\n/, '').replace(/^<!-- chay: tay.*-->\n/, '');
  }
};
walk(DEMO);
const out = `/* SINH TỰ ĐỘNG bởi scripts/wf/sinh-ma.mjs — KHÔNG sửa tay. Sửa _demo/ rồi chạy chay-demo.mjs + sinh-ma.mjs. */\n` +
  `export const CODE = ${JSON.stringify(CODE, null, 1)};\nexport const OUT = ${JSON.stringify(OUT, null, 1)};\n`;
fs.writeFileSync(path.join(GOC, 'content/courses/web-foundations/_ma.mjs'), out);
console.log(`_ma.mjs: ${Object.keys(CODE).length} mã, ${Object.keys(OUT).length} output`);
