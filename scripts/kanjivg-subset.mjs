#!/usr/bin/env node
/**
 * Dựng frontend/public/kanjivg/strokes.json — thứ tự nét của mọi chữ khoá
 * tiếng Nhật cần: đủ hiragana + katakana (cả âm đục, chữ nhỏ) + mọi chữ Hán
 * xuất hiện trong frontend/src/app/language/[code]/dekiru/**.
 *
 *   node scripts/kanjivg-subset.mjs
 *
 * Nguồn: KanjiVG (https://kanjivg.tagaini.net) — © Ulrich Apel, CC BY-SA 3.0.
 * Trang hiển thị PHẢI kèm dòng ghi công (khối `write` trong Blocks2 có sẵn).
 *
 * Kết quả: { "あ": ["M…", "M…", "M…"], … } — mỗi chữ là mảng `d` của từng nét
 * THEO ĐÚNG THỨ TỰ VIẾT (kvg:…-s1, -s2, …), toạ độ trong khung 109×109.
 * Chạy lại khi thêm bài có chữ Hán mới; chữ nào KanjiVG không có thì bỏ qua
 * (giao diện lùi về chữ in, không có hoạt hoạ).
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'frontend/src/app/language/[code]/dekiru');
const OUT = join(ROOT, 'frontend/public/kanjivg/strokes.json');
const BASE = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx|md)$/.test(f) ? [p] : [];
  });
}

const chars = new Set();
// Hiragana ぁ…ゖ, katakana ァ…ヺ, và ー.
for (let c = 0x3041; c <= 0x3096; c++) chars.add(String.fromCodePoint(c));
for (let c = 0x30a1; c <= 0x30fa; c++) chars.add(String.fromCodePoint(c));
chars.add('ー');
let kanji = 0;
for (const f of walk(SRC)) {
  for (const ch of readFileSync(f, 'utf8')) {
    const cp = ch.codePointAt(0);
    if ((cp >= 0x4e00 && cp <= 0x9fff) || (cp >= 0x3400 && cp <= 0x4dbf) || ch === '々') {
      if (!chars.has(ch)) kanji++;
      chars.add(ch);
    }
  }
}
console.log(`${chars.size} chữ cần (${kanji} chữ Hán)`);

/** Lấy `d` của các nét, sắp theo số nét trong id (kvg:05b57-s12). */
function parse(svg) {
  const out = [];
  const re = /<path\b[^>]*>/g;
  let m;
  while ((m = re.exec(svg))) {
    const tag = m[0];
    const id = /id="[^"]*-s(\d+)"/.exec(tag);
    const d = /\sd="([^"]+)"/.exec(tag);
    if (id && d) out.push([Number(id[1]), d[1].replace(/\s+/g, ' ').trim()]);
  }
  return out.sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}

const result = {};
const missing = [];
const list = [...chars];
let i = 0;
async function worker() {
  while (i < list.length) {
    const ch = list[i++];
    const hex = ch.codePointAt(0).toString(16).padStart(5, '0');
    for (let lan = 0; lan < 3; lan++) {
      try {
        const r = await fetch(`${BASE}${hex}.svg`);
        if (r.status === 404) { missing.push(ch); break; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const strokes = parse(await r.text());
        if (strokes.length) result[ch] = strokes; else missing.push(ch);
        break;
      } catch (e) {
        if (lan === 2) { missing.push(ch); console.warn(`  lỗi ${ch}: ${e.message}`); }
      }
    }
  }
}
await Promise.all(Array.from({ length: 12 }, worker));

// Sắp theo mã để diff giữa hai lần chạy ổn định.
const sorted = Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(sorted));
console.log(`Ghi ${Object.keys(sorted).length} chữ → ${OUT} (${(JSON.stringify(sorted).length / 1024).toFixed(0)} KB)`);
if (missing.length) console.log(`KanjiVG không có ${missing.length} chữ: ${missing.join('')}`);
