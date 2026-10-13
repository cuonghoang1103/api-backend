/**
 * Sinh dữ liệu cho mục "Ôn tập bằng thẻ" của khoá Dekiru — bai/onTheData.ts (TỆP SINH, đừng sửa tay).
 *
 * Quét TOÀN BỘ nội dung 15 bài (cùng luật ghép như bộ nạp: bài soạn + Theo sách +
 * "Chữ Hán của lớp") và rút ra bốn kho, không chép tay lại chữ nào:
 *   - TU   từ vựng: mọi khối `vocab` (bỏ "câu mẫu"), nhóm = tiêu đề `h` đứng trước khối;
 *          một từ xuất hiện ở nhiều bài thì giữ ở bài GẶP ĐẦU TIÊN.
 *   - HAN  chữ Hán của lớp: danh sách hanLop.ts × chi tiết hanTu.ts (Hán Việt, On, Kun, nghĩa).
 *   - NP   ngữ pháp: mỗi dòng khối `patterns` trong bài ngữ pháp (công thức → nghĩa + 1 ví dụ),
 *          kèm tên ポイント lấy từ tiêu đề `h`.
 *   - CAU  câu trắc nghiệm sẵn có (khối `mcq`) của bài ngữ pháp / chữ Hán / bài tập / từ vựng —
 *          bỏ bài nghe và hội thoại vì câu hỏi ở đó dựa vào băng.
 * Tệp sinh ra chỉ được TẢI CHẬM (component OnTapThe), không vào gói của trang.
 *
 *   npm run dekiru:onthe            # ghi lại (cũng chạy ở `prebuild`)
 *   npm run dekiru:onthe -- --check # không ghi; lệch thì exit 1
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Block = { t: string; [k: string]: unknown };
type Lesson = { id: string; kind: string; blocks?: Block[] };
type Vocab = { w: string; pos: string; ipa: string; vi: string; ex?: string; exRo?: string; exVi?: string };
type Row = { formula: string; vi: string; examples: { en: string; ro?: string; vi: string }[] };
type Mcq = { q: string; options: string[]; correct: number; why: string };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src/app/language/[code]/dekiru/bai');
const OUT = join(DIR, 'onTheData.ts');
const load = (p: string) => import(pathToFileURL(p).href);

const bare = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
const plain = (t: string) => bare(t).replace(/\*\*|==|~~/g, '').trim();
/** "1. Phương hướng, vị trí (ポイント 29)" → "Phương hướng, vị trí" */
const nhomTen = (h: string) => plain(h).replace(/^\d+[.)]\s*/, '').replace(/\s*[（(]ポイント[^)）]*[)）]\s*$/, '').trim();

const sach = { ...(await load(join(DIR, 'sach.ts'))).SACH, ...(await load(join(DIR, 'sach2.ts'))).SACH_2 };
const { chenHanLop, HAN_LOP } = await load(join(DIR, 'hanLop.ts'));
const { HAN_TU } = await load(join(DIR, 'hanTu.ts'));
const nums = readdirSync(DIR).map((f) => /^bai(\d+)\.ts$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);

/** [bài, chỉ số nhóm, từ (markup), loại từ, romaji, nghĩa] */
const TU: [number, number, string, string, string, string][] = [];
const NHOM: Record<number, string[]> = {};
const seenTu = new Set<string>();
/** [bài, ポイント, công thức, nghĩa, ví dụ, romaji ví dụ, nghĩa ví dụ] */
const NP: [number, string, string, string, string, string, string][] = [];
/** [bài, mã (id khối:số câu), loại 'np' | 'han', đề, đáp án, đúng, giải thích, tên bài tập] */
const CAU: [number, string, 'np' | 'han', string, string[], number, string, string][] = [];
const seenCau = new Set<string>();
/** [chữ, bài, Hán Việt, nghĩa, On, Kun, slide?] */
const HAN: [string, number, string, string, string, string, 0 | 1][] = [];

const CAU_KINDS = new Set(['grammar', 'homework', 'kanji', 'vocab']);

for (const n of nums) {
  if (n === 0) continue; // Bài 0 = bảng chữ cái, không có từ vựng/ngữ pháp
  const m = await load(join(DIR, `bai${n}.ts`));
  const extra = m[`SACH_${n}`] ?? sach[n];
  const lessons: Lesson[] = chenHanLop(n, extra ? [...m[`BAI_${n}`], extra] : m[`BAI_${n}`]);
  const nhom = (NHOM[n] = [] as string[]);
  const nhomIdx = (ten: string) => { let i = nhom.indexOf(ten); if (i < 0) { i = nhom.length; nhom.push(ten); } return i; };

  for (const l of lessons) {
    let h = '';
    for (const b of l.blocks ?? []) {
      if (b.t === 'h') { h = String(b.text); continue; }
      if (b.t === 'vocab') {
        const g = nhomIdx(nhomTen(h) || (l.kind === 'kanji' ? 'Từ cô chép thêm' : 'Từ vựng'));
        for (const v of b.items as Vocab[]) {
          if (v.pos === 'câu mẫu' || plain(v.w).length > 24) continue;
          const key = plain(v.w);
          if (seenTu.has(key)) continue;
          seenTu.add(key);
          TU.push([n, g, v.w, v.pos, v.ipa, v.vi]);
        }
      }
      if (b.t === 'patterns' && l.kind === 'grammar') {
        const p = plain(h);
        for (const r of b.rows as Row[]) {
          const e = r.examples?.[0];
          NP.push([n, p, r.formula, r.vi, e?.en ?? '', e?.ro ?? '', e?.vi ?? '']);
        }
      }
      if (b.t === 'mcq' && CAU_KINDS.has(l.kind)) {
        const loai = l.kind === 'kanji' ? 'han' : 'np';
        (b.items as Mcq[]).forEach((x, i) => {
          const k = plain(x.q) + '|' + x.options.join('|');
          if (seenCau.has(k) || x.options.length < 2) return;
          seenCau.add(k);
          CAU.push([n, `${String(b.id)}:${i}`, loai, x.q, x.options, x.correct, x.why ?? '', String(b.title ?? '')]);
        });
      }
    }
  }

  const lop = HAN_LOP[n] as { chars: string; nguon: string } | undefined;
  for (const c of lop ? [...lop.chars] : []) {
    const d = HAN_TU[c] as { hv: string; nghia: string; on: string[]; kun: string[] } | undefined;
    if (!d || HAN.some((x) => x[0] === c)) continue;
    HAN.push([c, n, d.hv, d.nghia, d.on.join('・'), d.kun.join('、'), lop!.nguon === 'slide' ? 1 : 0]);
  }
}

const j = (x: unknown) => JSON.stringify(x);
const rows = (a: unknown[]) => a.map((r) => `  ${j(r)},`).join('\n');
const src = [
  '/**',
  ' * TỆP SINH TỰ ĐỘNG — đừng sửa tay. Nguồn: mọi bài baiN.ts + sach*.ts + hanLop.ts + hanTu.ts.',
  ' * Sinh lại: `npm run dekiru:onthe` (tự chạy trước `next build`).',
  ' *',
  ' * Dữ liệu cho mục "Ôn tập bằng thẻ" (components/sach-hoc/nhat/OnTapThe.tsx).',
  ' * Tải CHẬM — không import tĩnh tệp này từ trang.',
  ' */',
  '',
  '/** bài → tên các nhóm từ (chỉ số trong TU) */',
  `export const NHOM: Record<number, string[]> = ${j(NHOM)};`,
  '/** [bài, nhóm, từ (markup furigana), loại từ, romaji, nghĩa] */',
  `export const TU: [number, number, string, string, string, string][] = [\n${rows(TU)}\n];`,
  '/** [chữ, bài, Hán Việt, nghĩa, On, Kun, 1 = đúng slide của cô] */',
  `export const HAN: [string, number, string, string, string, string, 0 | 1][] = [\n${rows(HAN)}\n];`,
  '/** [bài, ポイント, công thức, nghĩa, ví dụ, romaji ví dụ, nghĩa ví dụ] */',
  `export const NP: [number, string, string, string, string, string, string][] = [\n${rows(NP)}\n];`,
  '/** [bài, mã, loại, đề, đáp án, chỉ số đúng, giải thích, tên bài tập] */',
  `export const CAU: [number, string, 'np' | 'han', string, string[], number, string, string][] = [\n${rows(CAU)}\n];`,
  '',
].join('\n');

const rel = relative(ROOT, OUT);
let cur = '';
try { cur = readFileSync(OUT, 'utf8'); } catch { /* chưa có */ }
const per = (a: { 0: unknown }[], k = 0) => {
  const c: Record<string, number> = {};
  for (const r of a) c[String((r as unknown[])[k])] = (c[String((r as unknown[])[k])] ?? 0) + 1;
  return Object.entries(c).map(([b, x]) => `B${b}:${x}`).join(' ');
};
const stat = `${TU.length} từ, ${HAN.length} chữ Hán, ${NP.length} mẫu ngữ pháp, ${CAU.length} câu trắc nghiệm — ${(src.length / 1024).toFixed(0)} KB`;
if (process.argv.includes('--chi-tiet')) {
  console.log('Từ   ', per(TU));
  console.log('Hán  ', per(HAN, 1));
  console.log('NP   ', per(NP));
  console.log('Câu  ', per(CAU));
}
if (cur === src) console.log(`✓ ${rel} khớp (${stat})`);
else if (process.argv.includes('--check')) { console.error(`✗ ${rel} LỖI THỜI — chạy: npm run dekiru:onthe`); process.exit(1); }
else { writeFileSync(OUT, src); console.log(`✎ đã ghi ${rel} (${stat})`); }
