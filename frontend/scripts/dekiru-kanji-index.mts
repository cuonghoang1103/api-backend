/**
 * Sinh chỉ mục chữ Hán của khoá Dekiru — bai/kanjiIndex.ts (TỆP SINH, đừng sửa tay).
 *
 * Quét TOÀN BỘ nội dung 16 bài (cùng luật ghép như bộ nạp: bài soạn + Theo sách
 * + "Chữ Hán của lớp"), lập:
 *   - chữ → mọi từ vựng chứa chữ đó (kèm "Bài N")  → mục "Từ đi chung" của thẻ chữ Hán;
 *   - chữ → vài câu ví dụ có romaji/nghĩa (từ câu ví dụ của từ vựng + câu đọc không furigana);
 *   - chữ → Hán Việt / On / Kun / nghĩa lấy từ các bảng chữ Hán sẵn có của từng bài.
 * Tệp sinh ra chỉ được TẢI CHẬM (khi mở thẻ chữ Hán), không vào gói của trang.
 *
 *   npm run dekiru:kanji          # ghi lại (cũng chạy ở `prebuild`)
 *   npm run dekiru:kanji -- --check  # không ghi; lệch thì exit 1
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Block = { t: string; [k: string]: unknown };
type Lesson = { id: string; blocks?: Block[] };
type Vocab = { w: string; ipa: string; vi: string; ex: string; exRo?: string; exVi: string };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src/app/language/[code]/dekiru/bai');
const OUT = join(DIR, 'kanjiIndex.ts');
const load = (p: string) => import(pathToFileURL(p).href);

const KJ = /[一-鿿㐀-䶿]/;
const bare = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
const plain = (t: string) => bare(t).replace(/\*\*|==|~~/g, '');
const kanjiOf = (t: string) => [...new Set([...plain(t)].filter((c) => KJ.test(c)))];

const sach = { ...(await load(join(DIR, 'sach.ts'))).SACH, ...(await load(join(DIR, 'sach2.ts'))).SACH_2 };
const { chenHanLop } = await load(join(DIR, 'hanLop.ts'));
const nums = readdirSync(DIR).map((f) => /^bai(\d+)\.ts$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);

const words: [string, string, string, number][] = [];
const wordAt = new Map<string, number>();
const tu: Record<string, number[]> = {};
const exs: [string, string, string, number][] = [];
const exAt = new Map<string, number>();
const vd: Record<string, number[]> = {};
const bang: Record<string, [string, string, string, string, number]> = {};

const addEx = (text: string, ro: string | undefined, vi: string, n: number) => {
  if (!ro || !vi || plain(text).length > 60) return;
  const key = plain(text);
  let i = exAt.get(key);
  for (const c of kanjiOf(text)) {
    const list = (vd[c] ??= []);
    // Tối đa 6 câu mỗi chữ, và không quá 2 câu cùng một bài — trải đều các bài.
    if (list.length >= 6 || list.filter((k) => exs[k][3] === n).length >= 2) continue;
    if (i === undefined) { i = exs.length; exs.push([text, ro, vi, n]); exAt.set(key, i); }
    if (!list.includes(i)) list.push(i);
  }
};

for (const n of nums) {
  const m = await load(join(DIR, `bai${n}.ts`));
  const extra = m[`SACH_${n}`] ?? sach[n];
  const lessons: Lesson[] = chenHanLop(n, extra ? [...m[`BAI_${n}`], extra] : m[`BAI_${n}`]);
  for (const l of lessons) {
    for (const b of l.blocks ?? []) {
      if (b.t === 'vocab') {
        for (const v of b.items as Vocab[]) {
          const ks = kanjiOf(v.w);
          if (!ks.length) continue;
          const key = plain(v.w);
          let i = wordAt.get(key);
          if (i === undefined) { i = words.length; words.push([v.w, v.ipa, v.vi, n]); wordAt.set(key, i); }
          for (const c of ks) if (!(tu[c] ??= []).includes(i)) tu[c].push(i);
          addEx(v.ex, v.exRo, v.exVi, n);
        }
      }
      if (b.t === 'readkanji') for (const x of b.items as { text: string; ro: string; vi: string }[]) addEx(x.text, x.ro, x.vi, n);
      if (b.t === 'table') {
        const head = (b.head as string[]).map((h) => h.toLowerCase());
        const ci = head.indexOf('chữ');
        const hv = head.indexOf('hán việt');
        if (ci < 0 || hv < 0) continue;
        const on = head.findIndex((h) => h.startsWith('âm on'));
        const kun = head.findIndex((h) => h.startsWith('âm kun'));
        const ng = head.indexOf('nghĩa');
        for (const r of b.rows as string[][]) {
          const c = plain(r[ci] ?? '').trim();
          if ([...c].length !== 1 || !KJ.test(c) || bang[c]) continue;
          const cell = (k: number) => (k >= 0 ? plain(r[k] ?? '').trim().replace(/^—$/, '') : '');
          bang[c] = [cell(hv), cell(on), cell(kun), cell(ng), n];
        }
      }
    }
  }
}

const j = (x: unknown) => JSON.stringify(x);
const src = [
  '/**',
  ' * TỆP SINH TỰ ĐỘNG — đừng sửa tay. Nguồn: mọi bài baiN.ts + sach*.ts + hanLop.ts.',
  ' * Sinh lại: `npm run dekiru:kanji` (tự chạy trước `next build`).',
  ' *',
  ' * Chỉ mục chữ Hán cho thẻ chi tiết (KanjiSheet): chữ → từ vựng chứa nó, câu ví dụ,',
  ' * âm từ bảng chữ Hán của bài. Tải CHẬM — không import tĩnh tệp này.',
  ' */',
  "import type { KanjiIndex } from '@/components/sach-hoc/kanji';",
  '',
  '/** [từ, romaji, nghĩa, bài] */',
  `const W: [string, string, string, number][] = [\n${words.map((w) => `  ${j(w)},`).join('\n')}\n];`,
  '/** [câu, romaji, nghĩa, bài] */',
  `const E: [string, string, string, number][] = [\n${exs.map((w) => `  ${j(w)},`).join('\n')}\n];`,
  `const TU: Record<string, number[]> = ${j(tu)};`,
  `const VD: Record<string, number[]> = ${j(vd)};`,
  '/** chữ → [Hán Việt, On, Kun, nghĩa, bài] */',
  `const BANG: Record<string, [string, string, string, string, number]> = {\n${Object.entries(bang).map(([k, v]) => `  ${j(k)}: ${j(v)},`).join('\n')}\n};`,
  '',
  'const map = <T, U>(o: Record<string, T>, f: (v: T) => U) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));',
  'export const KANJI_INDEX: KanjiIndex = {',
  '  tu: map(TU, (ix) => ix.map((i) => ({ w: W[i][0], ro: W[i][1], vi: W[i][2], n: W[i][3] }))),',
  '  vd: map(VD, (ix) => ix.map((i) => ({ text: E[i][0], ro: E[i][1], vi: E[i][2], n: E[i][3] }))),',
  '  bang: map(BANG, ([hv, on, kun, nghia, n]) => ({ hv, on, kun, nghia, n })),',
  '};',
  '',
].join('\n');

const rel = relative(ROOT, OUT);
let cur = '';
try { cur = readFileSync(OUT, 'utf8'); } catch { /* chưa có */ }
const stat = `${Object.keys(tu).length} chữ, ${words.length} từ, ${exs.length} câu, ${Object.keys(bang).length} chữ có âm — ${(src.length / 1024).toFixed(0)} KB`;
if (cur === src) console.log(`✓ ${rel} khớp (${stat})`);
else if (process.argv.includes('--check')) { console.error(`✗ ${rel} LỖI THỜI — chạy: npm run dekiru:kanji`); process.exit(1); }
else { writeFileSync(OUT, src); console.log(`✎ đã ghi ${rel} (${stat})`); }
