#!/usr/bin/env node
/**
 * codelab-ts-vendor.mjs — dựng TÀI SẢN TỰ LƯU của máy chấm Code Lab loại `ts` (01/11/2026).
 *
 *   node scripts/codelab-ts-vendor.mjs          # tải 3 gói từ npm (ghim phiên bản + băm sha512), ghi vào frontend/public/vendor/
 *   node scripts/codelab-ts-vendor.mjs --kiem   # chỉ kiểm: tệp đã ghi khớp đúng gói ghim (thoát 1 nếu lệch)
 *
 * Ra (đường dẫn có số phiên bản ⇒ nginx cache vĩnh viễn được, đổi bản = đổi thư mục):
 *   frontend/public/vendor/typescript-6.0.3/typescript.js   lib/typescript.js NGUYÊN VĂN của typescript@6.0.3
 *   frontend/public/vendor/typescript-6.0.3/lib-ts.json     { "<đường ảo>": "<nội dung .d.ts>" } — đúng những gì
 *       `tsc -p` với tsconfig chuẩn của khoá TypeScript nạp: lib.es2024.full.d.ts + mọi lib nó tham chiếu (có dom),
 *       @types/node 22.20.5 (types: ["node"]) + undici-types 6.21.0 (phụ thuộc của @types/node) — cùng phiên bản
 *       content/courses/typescript/_labflow-ts/package-lock.json ghim.
 *
 * Vì sao TypeScript 6.0.3 chứ không 7.0.2 (bản khoá dùng): 7 là binary Go, không có JS API, không chạy trong trình
 * duyệt. Lệch 6 ↔ 7 trên bộ đề đo bằng scripts/ts/kiem-de-ts.mjs (KIEM_TSC=<tsc 6.0.3>): xem content/codelab/README.md mục `ts`.
 * Không phụ thuộc CDN ngoài: trang và app tải từ chính cuongthai.com.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TS_PHIEN_BAN = '6.0.3';
const GOI = [
  { ten: 'typescript', ban: TS_PHIEN_BAN, bam: 'sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==' },
  { ten: '@types/node', ban: '22.20.5', bam: 'sha512-U2+DNr+wSjpsTS/wZGYHq7GcwfuSmKiKvoPvK22zwTlRhU91yOniN4qRR5KhIjvif7ysw/dz/hKmfDH0Ris4aA==' },
  { ten: 'undici-types', ban: '6.21.0', bam: 'sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==' },
];
const RA = path.join(GOC, 'frontend/public/vendor', `typescript-${TS_PHIEN_BAN}`);
const CHI_KIEM = process.argv.includes('--kiem');

const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-ts-vendor-'));
try {
  const thuMuc = {};
  for (const g of GOI) {
    const ten = execFileSync('npm', ['pack', `${g.ten}@${g.ban}`, '--pack-destination', tam, '--silent'], { encoding: 'utf8' }).trim().split('\n').pop();
    const tgz = path.join(tam, ten);
    const bam = `sha512-${crypto.createHash('sha512').update(fs.readFileSync(tgz)).digest('base64')}`;
    if (bam !== g.bam) throw new Error(`${g.ten}@${g.ban}: băm ${bam} ≠ ghim ${g.bam}`);
    const d = path.join(tam, g.ten.replace('/', '__'));
    fs.mkdirSync(d);
    execFileSync('tar', ['xzf', tgz, '-C', d]);
    thuMuc[g.ten] = path.join(d, fs.readdirSync(d)[0]); // thư mục gốc trong tgz: 'package' (npm) hoặc 'node' (@types)
  }

  // Bỏ chú thích tài liệu /** … */ của tệp .d.ts (bộ quét CỦA CHÍNH TypeScript ⇒ không đụng chuỗi/template): chú thích không đổi
  // chẩn đoán nào (tệp .ts/.d.ts không đọc kiểu từ JSDoc; @deprecated chỉ là "gợi ý", không vào getPreEmitDiagnostics) — đo lại bằng
  // scripts/codelab-ts-doi-chieu.mjs. Lợi: lib-ts.json nhỏ đi nhiều, và hết các VÍ DỤ trong tài liệu @types/node (vd chuỗi ghim khoá
  // công khai pin-sha256 trong https.d.ts) mà gitleaks đoán nhầm là bí mật. GIỮ `///` (tham chiếu lib/path) và `/*! … */` (giấy phép).
  const tsApi = createRequire(import.meta.url)(path.join(thuMuc.typescript, 'lib/typescript.js'));
  const boChuThich = (src) => {
    const sc = tsApi.createScanner(tsApi.ScriptTarget.Latest, false, tsApi.LanguageVariant.Standard, src);
    let out = '', k;
    while ((k = sc.scan()) !== tsApi.SyntaxKind.EndOfFileToken) {
      const t = sc.getTokenText();
      if (k === tsApi.SyntaxKind.MultiLineCommentTrivia && !t.startsWith('/*!')) { out += t.includes('\n') ? '\n'.repeat(t.split('\n').length - 1) : ' '; continue; }
      out += t;
    }
    return out;
  };
  // 1) lib của TypeScript: lib.es2024.full.d.ts + mọi `/// <reference lib="…" />` bắc cầu (+ es2020 mà @types/node gọi)
  const libDir = path.join(thuMuc.typescript, 'lib');
  const lib = {};
  const hang = ['es2024.full', 'es2020'];
  while (hang.length) {
    const ten = hang.shift();
    const f = `lib.${ten}.d.ts`;
    if (lib[`/lib/${f}`] != null) continue;
    const s = fs.readFileSync(path.join(libDir, f), 'utf8');
    lib[`/lib/${f}`] = boChuThich(s);
    for (const m of s.matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"/g)) hang.push(m[1].toLowerCase());
  }
  // 2) @types/node + undici-types — mọi .d.ts + package.json (trừ ts5.6/: chỉ dành cho TS ≤ 5.6)
  const themGoi = (goc, ao) => {
    const di = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        const rel = path.relative(goc, p).split(path.sep).join('/');
        if (e.isDirectory()) { if (!/^ts\d/.test(rel)) di(p); continue; }
        if (/\.d\.ts$/.test(e.name)) lib[`${ao}/${rel}`] = boChuThich(fs.readFileSync(p, 'utf8'));
        else if (rel === 'package.json' || rel === 'LICENSE') lib[`${ao}/${rel}`] = fs.readFileSync(p, 'utf8');
      }
    };
    di(goc);
  };
  themGoi(thuMuc['@types/node'], '/p/node_modules/@types/node');
  themGoi(thuMuc['undici-types'], '/p/node_modules/undici-types');

  const tsJs = fs.readFileSync(path.join(libDir, 'typescript.js'));
  const libJson = Buffer.from(`${JSON.stringify(lib)}\n`);
  const ra = { 'typescript.js': tsJs, 'lib-ts.json': libJson };
  let lech = 0;
  if (!CHI_KIEM) fs.mkdirSync(RA, { recursive: true });
  for (const [f, buf] of Object.entries(ra)) {
    const p = path.join(RA, f);
    const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
    const nen = (await import('node:zlib')).gzipSync(buf, { level: 9 }).length;
    if (CHI_KIEM) {
      const ok = fs.existsSync(p) && fs.readFileSync(p).equals(buf);
      if (!ok) lech++;
      console.log(`${ok ? '✓' : '✗ LỆCH'} ${path.relative(GOC, p)} (${kb(buf.length)}, gzip ${kb(nen)})`);
    } else {
      fs.writeFileSync(p, buf);
      console.log(`✓ ghi ${path.relative(GOC, p)} — ${kb(buf.length)} (gzip -9 ${kb(nen)})`);
    }
  }
  console.log(`  ${Object.keys(lib).length} tệp khai báo trong lib-ts.json (${Object.keys(lib).filter((k) => k.startsWith('/lib/')).length} lib của TypeScript)`);
  if (lech) process.exitCode = 1;
} finally {
  fs.rmSync(tam, { recursive: true, force: true });
}
