/**
 * Bộ kiểm NỘI DUNG khoá học kiểu sách (05/10/2026) — chạy trước khi nhận một bài mới.
 *
 *   node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts jp [số bài…]
 *   node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts ch
 *
 * Kiểm những lỗi `tsc` không thấy: id trùng (tiến độ lưu theo id), mcq trỏ đáp án ngoài
 * danh sách, ghép câu có mảnh đáp án không nằm trong chips, cú pháp {chữ|đọc} hở ngoặc,
 * câu tiếng Nhật/Trung thiếu romaji/pinyin (`ro`), giọng đọc lệch thứ tiếng, khối
 * luyện phát âm thiếu phiên âm, bài thiếu mục tiêu/thời lượng.
 */
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type B = Record<string, any>;
type L = { id: string; kind: string; title: string; goal: string; minutes: number; blocks?: B[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const khoa = process.argv[2];
// `dekiru` chỉ để tự kiểm bộ kiểm này trên nội dung đã có (giọng/romaji cùng luật với jp).
if (khoa !== 'jp' && khoa !== 'ch' && khoa !== 'dekiru') { console.error('Dùng: kiem-khoa-sach.mts jp|ch [số bài…]'); process.exit(2); }
const chiBai = process.argv.slice(3).map(Number);
const dir = join(ROOT, `src/app/language/[code]/${khoa}/bai`);
const so = readdirSync(dir).map((f) => /^bai(\d+)\.ts$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b)
  .filter((n) => !chiBai.length || chiBai.includes(n));

const KIND = new Set(['intro', 'grammar', 'vocab', 'listening', 'reading', 'writing', 'speaking', 'homework', 'conversation', 'kanji', 'kana', 'review']);
const GIONG = khoa !== 'ch' ? new Set(['ja-nu', 'ja-nam']) : new Set(['zh-nu', 'zh-nam']);
const CHU_NGOAI = khoa !== 'ch' ? /[\u3040-\u30ff\u4e00-\u9fff]/ : /[\u4e00-\u9fff]/;
const loi: string[] = [];
const idBai = new Set<string>();
const idBt = new Set<string>();
let demTu = 0, demBt = 0, kb = 0;

function markup(s: unknown, o: string) {
  if (typeof s !== 'string') return;
  const mo = (s.match(/\{/g) ?? []).length, dong = (s.match(/\}/g) ?? []).length;
  const dung = (s.match(/\{[^{}|]+\|[^{}|]+\}/g) ?? []).length;
  if (mo !== dong || mo !== dung) loi.push(`${o}: ngoặc {chữ|đọc} sai: "${s.slice(0, 80)}"`);
  if (((s.match(/\*\*/g) ?? []).length) % 2) loi.push(`${o}: ** lẻ: "${s.slice(0, 80)}"`);
}
function canRo(text: unknown, ro: unknown, o: string) {
  if (typeof text === 'string' && CHU_NGOAI.test(text) && !(typeof ro === 'string' && ro.trim())) loi.push(`${o}: câu ngoại ngữ thiếu ro: "${text.slice(0, 60)}"`);
}
function quetChu(x: unknown, o: string) {
  if (typeof x === 'string') return markup(x, o);
  if (Array.isArray(x)) x.forEach((y, i) => quetChu(y, `${o}[${i}]`));
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) quetChu(v, `${o}.${k}`);
}
const bt = (id: unknown, o: string) => {
  if (typeof id !== 'string' || !id) return loi.push(`${o}: bài tập thiếu id`);
  if (idBt.has(id)) loi.push(`${o}: id bài tập TRÙNG "${id}"`);
  idBt.add(id); demBt++;
};

for (const n of so) {
  const m = await import(pathToFileURL(join(dir, `bai${n}.ts`)).href);
  const ls: L[] = m[`BAI_${n}`];
  if (!Array.isArray(ls) || !ls.length) { loi.push(`bai${n}.ts: không export BAI_${n} (mảng bài)`); continue; }
  kb += JSON.stringify(ls).length / 1024;
  for (const l of ls) {
    const o = `bai${n}/${l.id}`;
    if (!l.id?.startsWith(`b${n}-`)) loi.push(`${o}: id bài phải bắt đầu bằng "b${n}-"`);
    if (idBai.has(l.id)) loi.push(`${o}: id bài TRÙNG`);
    idBai.add(l.id);
    if (!KIND.has(l.kind)) loi.push(`${o}: kind lạ "${l.kind}"`);
    if (!l.title || !l.goal) loi.push(`${o}: thiếu title/goal`);
    if (!(l.minutes > 0)) loi.push(`${o}: minutes phải > 0`);
    if (!l.blocks?.length) { loi.push(`${o}: không có blocks`); continue; }
    l.blocks.forEach((b, i) => {
      const ob = `${o}#${i}(${b.t})`;
      quetChu(b, ob);
      switch (b.t) {
        case 'vocab':
          for (const v of b.items) {
            demTu++;
            for (const k of ['w', 'pos', 'ipa', 'vi', 'ex', 'exVi']) if (!v[k]) loi.push(`${ob}: từ "${v.w}" thiếu ${k}`);
            if (!v.exRo) loi.push(`${ob}: từ "${v.w}" thiếu exRo`);
          }
          break;
        case 'examples': for (const e of b.items) canRo(e.en, e.ro, ob); break;
        case 'patterns': for (const r of b.rows) for (const e of r.examples) canRo(e.en, e.ro, ob); break;
        case 'dialogue': for (const x of b.lines) { canRo(x.text, x.ro, ob); if (!x.vi) loi.push(`${ob}: lời thoại thiếu vi`); } break;
        case 'listen':
          bt(b.id, ob);
          for (const x of b.lines) { canRo(x.text, x.ro, ob); if (x.voice && !GIONG.has(x.voice)) loi.push(`${ob}: giọng ${x.voice} lệch thứ tiếng`); }
          break;
        case 'mcq':
          bt(b.id, ob);
          for (const q of b.items) {
            if (!(q.options?.length >= 2)) loi.push(`${ob}: câu "${q.q}" ít hơn 2 lựa chọn`);
            if (!(q.correct >= 0 && q.correct < q.options.length)) loi.push(`${ob}: câu "${q.q}" correct ngoài danh sách`);
            if (new Set(q.options).size !== q.options.length) loi.push(`${ob}: câu "${q.q}" có lựa chọn trùng`);
            if (!q.why) loi.push(`${ob}: câu "${q.q}" thiếu why`);
          }
          break;
        case 'quiz':
          bt(b.id, ob);
          for (const q of b.items) if (!q.answers?.length || q.answers.some((a: string) => !a?.trim())) loi.push(`${ob}: câu "${q.q}" thiếu đáp án`);
          break;
        case 'build':
          bt(b.id, ob);
          for (const q of b.items) {
            const chips = [...q.chips];
            for (const a of q.answer) { const k = chips.indexOf(a); if (k < 0) loi.push(`${ob}: "${q.vi}" mảnh "${a}" không có trong chips`); else chips.splice(k, 1); }
            for (const alt of q.alt ?? []) { const c2 = [...q.chips]; for (const a of alt) { const k = c2.indexOf(a); if (k < 0) loi.push(`${ob}: "${q.vi}" alt có mảnh "${a}" ngoài chips`); else c2.splice(k, 1); } }
            if (CHU_NGOAI.test(q.answer.join('')) && !q.ro) loi.push(`${ob}: "${q.vi}" thiếu ro`);
          }
          break;
        case 'phatam':
          bt(b.id, ob);
          for (const x of b.items) if (!x.text || !x.ipa) loi.push(`${ob}: câu phát âm thiếu text/ipa`);
          break;
        case 'readkanji': bt(b.id, ob); for (const x of b.items) if (!x.ro || !x.vi) loi.push(`${ob}: thiếu ro/vi`); break;
        case 'speak': case 'write': case 'dictation': case 'essay': bt(b.id, ob); break;
        case 'alphabet': for (const g of b.groups) for (const x of g.letters) if (!x.l || !x.ipa) loi.push(`${ob}: chữ thiếu l/ipa`); break;
        case 'hanlop': case 'chia': if (khoa !== 'dekiru') loi.push(`${ob}: khối ${b.t} chỉ dùng cho khoá Dekiru`); break;
      }
    });
  }
}

console.log(`${khoa.toUpperCase()}: ${so.length} bài · ${idBai.size} mục · ${demTu} từ · ${demBt} bài tập · ${kb.toFixed(0)} KB`);
if (loi.length) { console.error(`✗ ${loi.length} lỗi:\n` + loi.slice(0, 80).map((x) => '  - ' + x).join('\n')); process.exit(1); }
console.log('✓ không thấy lỗi');
