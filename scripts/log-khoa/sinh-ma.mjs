#!/usr/bin/env node
/** sinh-ma.mjs — gom lệnh mẫu + output chạy thật của khoá log-tu-a-den-z vào content/courses/log-tu-a-den-z/_ma.mjs
 *   CODE['s02/grep.sh'] = nội dung tệp lệnh · OUT['s02/grep'] = nội dung grep.out.txt · CODE['tao-goi-log.py'] = bộ sinh log
 * Chạy qua scripts/log-khoa/chay-demo.sh. KHÔNG sửa _ma.mjs bằng tay. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEMO = path.join(GOC, 'content/courses/log-tu-a-den-z/_demo');
const CODE = {}, OUT = {};
const walk = (dir, rel = '') => {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f), r = rel ? `${rel}/${f}` : f;
    if (fs.statSync(p).isDirectory()) { walk(p, r); continue; }
    const s = fs.readFileSync(p, 'utf8');
    if (f.endsWith('.out.txt')) OUT[r.replace(/\.out\.txt$/, '')] = s.replace(/\n+$/, '');
    else CODE[r] = s.replace(/\n+$/, '');
  }
};
walk(DEMO);
const out = `/* SINH TỰ ĐỘNG bởi scripts/log-khoa/sinh-ma.mjs — KHÔNG sửa tay. Sửa _demo/ rồi chạy bash scripts/log-khoa/chay-demo.sh. */\n` +
  `export const CODE = ${JSON.stringify(CODE, null, 1)};\nexport const OUT = ${JSON.stringify(OUT, null, 1)};\n`;
fs.writeFileSync(path.join(GOC, 'content/courses/log-tu-a-den-z/_ma.mjs'), out);
console.log(`_ma.mjs: ${Object.keys(CODE).length} mã, ${Object.keys(OUT).length} output`);
