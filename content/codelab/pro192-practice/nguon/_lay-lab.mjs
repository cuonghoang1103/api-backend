#!/usr/bin/env node
/**
 * Chép (vendor) một Lab CT Library / bài LAB211 từ nguồn bài học PRO192 vào repo web:
 *   node content/codelab/pro192-practice/nguon/_lay-lab.mjs lab1 lab2 … l211-p0011 …
 * Nguồn: ~/Documents/FLM-nguon/_repo/PRO192/gen/lab/<lab>/{solution,starter}/{src,harness} (đáp án đã qua lint.py LAB211,
 * javac --release 8 và JDK 8 thật — chay-lab.mjs). Ra: nguon/_lab/<lab>.json =
 *   { ten, ticket, slug, giai: { 'pkg/X.java': … }, khoi: { tệp starter KHÁC đáp án, null = starter không có tệp đó },
 *     vao, vao2?, data?: { 'books.csv': … } }
 * Chỉ lưu phần starter khác đáp án ⇒ tệp gọn; bộ dựng (_chung.mjs › deLab) ghép lại.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NGUON = path.join(os.homedir(), 'Documents/FLM-nguon/_repo/PRO192/gen/lab');
const RA = path.join(path.dirname(fileURLToPath(import.meta.url)), '_lab');
fs.mkdirSync(RA, { recursive: true });

function doc(dir) {
  const out = {};
  const walk = (d, rel) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else out[r] = fs.readFileSync(p, 'utf8');
    }
  };
  walk(dir, '');
  return out;
}

/**
 * Luật thầy LAB211 29/10/2026 (memory feedback_lab211_loi_thay_da_bat #6, lint.py COLLECTION): KHAI BÁO bằng interface
 * List/Map/Set ở MỌI nơi, chỉ `new ArrayList<>()` dùng lớp cụ thể. Đáp án lab của khoá dựng TRƯỚC luật này (lint.py hôm nay
 * báo COLLECTION) ⇒ khi chép sang Code Lab đổi khai báo sang interface (biên dịch + output kiểm lại ở _dung.mjs).
 */
const DOI = [[/(?<!\bnew\s+)(?<!\bextends\s+)\b(?:ArrayList|LinkedList)\s*</g, 'List<', 'List'],
  [/(?<!\bnew\s+)(?<!\bextends\s+)\b(?:HashMap|LinkedHashMap|TreeMap)\s*</g, 'Map<', 'Map'],
  [/(?<!\bnew\s+)(?<!\bextends\s+)\b(?:HashSet|LinkedHashSet|TreeSet)\s*</g, 'Set<', 'Set']];
function theoInterface(src) {
  if (src == null) return src;
  let out = src.split('\n').map((l) => (/^\s*import\b/.test(l) ? l : DOI.reduce((x, [re, to]) => x.replace(re, to), l))).join('\n');
  for (const [, , ten] of DOI) {
    if (new RegExp(`\\b${ten}<`).test(out) && !new RegExp(`import java\\.util\\.(${ten}|\\*);`).test(out)) {
      const m = [...out.matchAll(/^import java\.util\.[\w.]+;$/gm)];
      if (m.length) { const last = m[m.length - 1]; out = out.slice(0, last.index + last[0].length) + `\nimport java.util.${ten};` + out.slice(last.index + last[0].length); }
      else out = out.replace(/^(package [\w.]+;\n)/m, `$1\nimport java.util.${ten};\n`);
    }
  }
  for (const k of ['ArrayList', 'LinkedList', 'HashMap', 'LinkedHashMap', 'TreeMap', 'HashSet', 'LinkedHashSet', 'TreeSet']) {
    const dung = out.split('\n').filter((l) => !/^\s*import\b/.test(l)).some((l) => new RegExp(`\\b${k}\\b`).test(l));
    if (!dung) out = out.replace(new RegExp(`^import java\\.util\\.${k};\\n`, 'm'), '');
  }
  // giữ import theo thứ tự chữ cái như NetBeans "Fix Imports"
  out = out.replace(/((?:^import [\w.]+;\n)+)/m, (blk) => blk.split('\n').filter(Boolean).sort().join('\n') + '\n');
  return out;
}
const map = (o, f) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, k.endsWith('.java') ? f(v) : v]));

for (const lab of process.argv.slice(2)) {
  const base = path.join(NGUON, lab);
  const meta = JSON.parse(fs.readFileSync(path.join(base, 'lab.json'), 'utf8'));
  const giai = map(doc(path.join(base, 'solution/src')), theoInterface);
  const khoiDu = fs.existsSync(path.join(base, 'starter/src')) ? map(doc(path.join(base, 'starter/src')), theoInterface) : null;
  const khoi = {};
  if (khoiDu) {
    for (const [f, t] of Object.entries(khoiDu)) if (giai[f] !== t) khoi[f] = t;
    for (const f of Object.keys(giai)) if (!(f in khoiDu)) khoi[f] = null;
  }
  const h = path.join(base, 'solution/harness');
  const ra = {
    ten: meta.ten, ticket: meta.ticket, slug: meta.slug, coStarter: !!khoiDu,
    giai, khoi,
    vao: fs.readFileSync(path.join(h, 'input.txt'), 'utf8'),
    ra: fs.readFileSync(path.join(h, 'expected.txt'), 'utf8'),
    ...(fs.existsSync(path.join(h, 'input-2.txt')) ? { vao2: fs.readFileSync(path.join(h, 'input-2.txt'), 'utf8') } : {}),
    ...(fs.existsSync(path.join(h, 'data')) ? { data: doc(path.join(h, 'data')) } : {}),
  };
  fs.writeFileSync(path.join(RA, `${lab}.json`), JSON.stringify(ra, null, 1) + '\n');
  console.log(`✓ ${lab}: ${Object.keys(giai).length} tệp đáp án · starter khác ${Object.keys(khoi).length} tệp · ${(fs.statSync(path.join(RA, `${lab}.json`)).size / 1024).toFixed(0)} KB`);
}
