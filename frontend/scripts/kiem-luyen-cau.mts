/**
 * Bộ kiểm "🔁 Luyện câu 2 chiều + ✍️ Tập viết" của khoá Dekiru (Bài 1–10, 28/11/2026).
 *
 *   node --experimental-strip-types --no-warnings scripts/kiem-luyen-cau.mts [số bài…]
 *
 * Kiểm những lỗi tsc không thấy:
 *  - cú pháp {chữ|đọc} hở ngoặc, ** lẻ; câu thiếu vi / ja / ro;
 *  - CHỮ HÁN NGOÀI DANH SÁCH của lớp đến bài đó (hanLop.ts) — quy ước: chỉ viết chữ Hán của lớp, còn lại kana
 *    (ngoại lệ có lý do khai ở NGOAI_LE); furigana phải là kana;
 *  - câu TRÙNG nhau trong bộ, và TRÙNG câu đã có ở các tệp bài khác của khoá (luyện thêm, bài tập…) — yêu cầu là câu MỚI;
 *  - số câu mỗi bài (Bài 1–7 ≥ 60, Bài 8–10 ≥ 40); id bài tập trùng; tên hình (giayViet/hinh) hợp lệ;
 *  - máy chấm nhận đúng đáp án của chính nó (kana, chữ Hán, romaji) — nếu không người học gõ đúng vẫn bị chấm sai.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'node:module';

register('data:text/javascript,' + encodeURIComponent(`
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function resolve(spec, ctx, next) {
  if ((spec.startsWith('./') || spec.startsWith('../')) && !/\\.[cm]?[jt]sx?$/.test(spec) && ctx.parentURL && ctx.parentURL.startsWith('file:')) {
    const u = new URL(spec + '.ts', ctx.parentURL);
    if (existsSync(fileURLToPath(u))) return next(u.href, ctx);
  }
  return next(spec, ctx);
}`));

type Cau = { vi: string; ja: string; ro: string; alt?: string[]; np?: string };
type B = Record<string, any>;
type L = { id: string; kind: string; title: string; goal: string; minutes: number; blocks?: B[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src/app/language/[code]/dekiru/bai');
const load = (f: string) => import(pathToFileURL(join(DIR, f)).href);
const chiBai = process.argv.slice(2).map(Number).filter(Boolean);

const { HAN_LOP } = await load('hanLop.ts');
const cham = await import(pathToFileURL(join(ROOT, 'src/components/sach-hoc/nhat/chamCau.ts')).href);
const { reading } = await import(pathToFileURL(join(ROOT, 'src/components/sach-hoc/nhat/chia.ts')).href);

/** Chữ Hán ngoài danh sách lớp được phép (đơn vị đếm / chữ không thay được) — theo bài, cộng dồn. */
const NGOAI_LE: Record<number, string> = {
  2: '階', // 3階・何階: tầng (đề đọc của cô viết 三階 có furigana)
};

const lc: Record<number, L[]> = {
  ...(await load('luyenCauB13.ts')).LUYEN_CAU,
  ...(await load('luyenCauB47.ts').catch(() => ({ LUYEN_CAU: {} }))).LUYEN_CAU,
  ...(await load('luyenCauB810.ts').catch(() => ({ LUYEN_CAU: {} }))).LUYEN_CAU,
};

// Câu đã có ở các tệp khác của khoá (mọi chuỗi có kana/kanji, bỏ furigana + dấu) ⇒ để bắt câu trùng.
const gon = (t: string) => cham.gon(t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'));
const daCo = new Map<string, string>();
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.ts') && !x.startsWith('luyenCau') && !['onTheData.ts', 'kanjiIndex.ts', 'manifest.ts'].includes(x))) {
  const src = readFileSync(join(DIR, f), 'utf8');
  for (const m of src.matchAll(/'((?:[^'\\\n]|\\.){4,200})'/g)) {
    const t = m[1];
    if (!/[\u3040-\u30ff]/.test(t)) continue;
    for (const part of t.split(/——|—|\s\/\s/)) {
      const k = gon(part);
      if ([...k].length >= 6 && !daCo.has(k)) daCo.set(k, f);
    }
  }
}

const loi: string[] = [];
const canh: string[] = [];
const idBt = new Set<string>();
let tong = 0;
const bang: string[] = [];

function markup(s: unknown, o: string) {
  if (typeof s !== 'string') return;
  const mo = (s.match(/\{/g) ?? []).length, dong = (s.match(/\}/g) ?? []).length;
  const dung = (s.match(/\{[^{}|]+\|[^{}|]+\}/g) ?? []).length;
  if (mo !== dong || mo !== dung) loi.push(`${o}: ngoặc {chữ|đọc} sai: "${s.slice(0, 80)}"`);
  if (((s.match(/\*\*/g) ?? []).length) % 2) loi.push(`${o}: ** lẻ: "${s.slice(0, 80)}"`);
  for (const x of s.matchAll(/\{([^|}]+)\|([^}]+)\}/g)) if (!/^[\u3040-\u309fー]+$/.test(x[2])) loi.push(`${o}: furigana không phải hiragana: {${x[1]}|${x[2]}}`);
}
function quet(x: unknown, o: string) {
  if (typeof x === 'string') return markup(x, o);
  if (Array.isArray(x)) x.forEach((y, i) => quet(y, `${o}[${i}]`));
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) quet(v, `${o}.${k}`);
}
const KJ = /[\u4e00-\u9fff\u3400-\u4dbf]/g;

for (const n of Object.keys(lc).map(Number).sort((a, b) => a - b)) {
  if (chiBai.length && !chiBai.includes(n)) continue;
  const ls = lc[n];
  const cho = new Set<string>();
  for (let k = 1; k <= n; k++) for (const ch of (HAN_LOP[k]?.chars ?? '') + (NGOAI_LE[k] ?? '')) cho.add(ch);
  let soCau = 0, trungCu = 0;
  for (const l of ls) {
    const o = `B${n}/${l.id}`;
    if (!l.id.startsWith(`b${n}-`)) loi.push(`${o}: id phải bắt đầu "b${n}-"`);
    if (!l.title || !l.goal || !(l.minutes > 0) || !l.blocks?.length) loi.push(`${o}: thiếu title/goal/minutes/blocks`);
    quet(l.blocks, o);
    for (const [bi, b] of (l.blocks ?? []).entries()) {
      const ob = `${o}#${bi}(${b.t})`;
      if (typeof b.id === 'string') { if (idBt.has(b.id)) loi.push(`${ob}: id bài tập TRÙNG "${b.id}"`); idBt.add(b.id); }
      if (b.t === 'mcq') for (const q of b.items) { if (!(q.correct >= 0 && q.correct < q.options.length)) loi.push(`${ob}: "${q.q}" correct ngoài`); if (new Set(q.options).size !== q.options.length) loi.push(`${ob}: "${q.q}" lựa chọn trùng`); if (!q.why) loi.push(`${ob}: "${q.q}" thiếu why`); }
      if (b.t === 'build') for (const q of b.items) { const ch = [...q.chips]; for (const a of q.answer) { const k = ch.indexOf(a); if (k < 0) loi.push(`${ob}: "${q.vi}" mảnh "${a}" ngoài chips`); else ch.splice(k, 1); } }
      if (b.t === 'quiz') for (const q of b.items) if (!q.answers?.length) loi.push(`${ob}: "${q.q}" thiếu đáp án`);
      if (b.t !== 'luyenCau') continue;
      const thay = new Map<string, number>();
      const td = cham.tuDien(b.cau.flatMap((c: Cau) => [c.ja, ...(c.alt ?? [])]), cham.CHU_QUEN);
      b.cau.forEach((c: Cau, i: number) => {
        const oc = `${ob} câu ${i + 1} "${c.vi.slice(0, 40)}"`;
        soCau++;
        if (!c.vi || !c.ja || !c.ro) loi.push(`${oc}: thiếu vi/ja/ro`);
        for (const x of [c.ja, ...(c.alt ?? [])]) {
          const base = x.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
          const la = [...new Set(base.match(KJ) ?? [])].filter((ch) => !cho.has(ch));
          if (la.length) loi.push(`${oc}: chữ Hán ngoài danh sách lớp đến Bài ${n}: ${la.join('')} — viết kana`);
          const tran = [...x.replace(/\{[^}]+\}/g, '').matchAll(KJ)].map((m) => m[0]);
          if (tran.length) loi.push(`${oc}: chữ Hán thiếu furigana: ${tran.join('')}`);
        }
        const k = gon(c.ja);
        if (thay.has(k)) loi.push(`${oc}: TRÙNG câu ${thay.get(k)! + 1} trong bộ`); else thay.set(k, i);
        if (daCo.has(k)) { trungCu++; canh.push(`${oc}: trùng câu đã có ở ${daCo.get(k)}: ${c.ja}`); }
        // Máy chấm phải nhận chính đáp án: chữ Hán, kana, romaji.
        for (const thu of [c.ja.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), reading(c.ja), c.ro]) {
          const r = cham.chamCau(thu, c.ja, c.alt ?? [], td);
          if (r.kq !== 'dung') loi.push(`${oc}: máy chấm KHÔNG nhận "${thu}" (${r.kq})`);
        }
      });
    }
  }
  const can = n <= 7 ? 60 : 40;
  if (soCau < can) loi.push(`Bài ${n}: chỉ ${soCau} câu (cần ≥ ${can})`);
  tong += soCau;
  bang.push(`Bài ${n}: ${soCau} câu · ${ls.length} mục · trùng câu cũ ${trungCu}`);
}

console.log(bang.join('\n'));
console.log(`Tổng: ${tong} câu`);
if (canh.length) console.warn(`⚠ ${canh.length} câu trùng câu đã có (nên đổi):\n` + canh.slice(0, 60).map((x) => '  - ' + x).join('\n'));
if (loi.length) { console.error(`✗ ${loi.length} lỗi:\n` + loi.slice(0, 120).map((x) => '  - ' + x).join('\n')); process.exit(1); }
console.log('✓ không thấy lỗi');
