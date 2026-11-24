// Kiểm nhanh tệp ngày của khoá IELTS Tập 3–5 (không cần tsc toàn bộ). Chạy từ thư mục frontend:
//   node --experimental-strip-types --no-warnings scripts/ielts-kiem-ngay.mts <tập> [N…]     (vd: … 5 1 2)
//   Khoá Tiếng Anh giao tiếp: <tập> = gt  (khuôn: listening · speaking · reading lẻ / writing chẵn · homework (+ review); id `gtdN-`).
// Kiểm: export NGAY_N là mảng; thứ tự kind theo khuôn (lẻ grammar·reading, chẵn vocab·writing; bài 3 nghe khi N mod 4 ∈ {0,1},
// nói khi ∈ {2,3}; + homework; + review ở ngày 6/12/18/24/30); mọi id tiền tố `t<tập>dN-`, không trùng giữa các ngày; đúng 1
// khối phatam; homework ≥ 30 câu; bài có recap đầu (trừ review), goal, minutes; không *nghiêng* một sao; voice hợp lệ; mcq có
// đáp án trong khoảng + why.
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [tapS, ...ngayS] = process.argv.slice(2);
const GT = tapS === 'gt';
const tap = GT ? 0 : Number(tapS);
if (!GT && ![3, 4, 5].includes(tap)) { console.error('Dùng: ielts-kiem-ngay.mts <3|4|5|gt> [N…]'); process.exit(2); }
const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/app/language/[code]');
const DIR = GT ? join(GOC, 'giao-tiep', 'ngay') : join(GOC, 'ielts', `tap-${tap}`, 'ngay');
const tienTo = (n: number) => (GT ? `gtd${n}-` : `t${tap}d${n}-`);
const CHANG = new Set([6, 12, 18, 24, 30]);
const VOICES = new Set(['uk-nu', 'uk-nam', 'us-nu', 'us-nam', 'au-nu', 'au-nam', 'ca-nu', 'ca-nam', 'nz-nu', 'nz-nam', 'ie-nu', 'ie-nam', 'dan']);
const bai3 = (n: number) => ([0, 1].includes(n % 4) ? 'listening' : 'speaking');
const khuon = (n: number) => GT
  ? ['listening', 'speaking', n % 2 ? 'reading' : 'writing', 'homework', ...(CHANG.has(n) ? ['review'] : [])]
  : [n % 2 ? 'grammar' : 'vocab', n % 2 ? 'reading' : 'writing', bai3(n), 'homework', ...(CHANG.has(n) ? ['review'] : [])];
const dsNgay = ngayS.map(Number).filter(Boolean);
const tatCa = readdirSync(DIR).map((f) => /^ngay(\d+)\.ts$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);
const idToanBo = new Map<string, number>();
let loi = 0;
const bao = (n: number, s: string) => { loi++; console.error(`✗ N${n}: ${s}`); };
function duyet(x: unknown, cb: (o: Record<string, unknown>) => void) {
  if (Array.isArray(x)) for (const y of x) duyet(y, cb);
  else if (x && typeof x === 'object') { cb(x as Record<string, unknown>); for (const v of Object.values(x)) duyet(v, cb); }
}
for (const n of tatCa) {
  const kiemKy = dsNgay.length === 0 || dsNgay.includes(n);
  let ls: any[];
  try { ls = (await import(pathToFileURL(join(DIR, `ngay${n}.ts`)).href))[`NGAY_${n}`]; }
  catch (e) { if (kiemKy) bao(n, `không nạp được: ${(e as Error).message.split('\n')[0]}`); continue; }
  if (!Array.isArray(ls)) { if (kiemKy) bao(n, `không export NGAY_${n}`); continue; }
  const ids: string[] = [];
  duyet(ls, (o) => { if (typeof o.id === 'string') ids.push(o.id); });
  for (const id of ids) {
    if (kiemKy && !id.startsWith(tienTo(n))) bao(n, `id sai tiền tố: ${id}`);
    if (idToanBo.has(id)) bao(n, `id trùng: ${id} (đã có ở N${idToanBo.get(id)})`); else idToanBo.set(id, n);
  }
  if (!kiemKy) continue;
  const kinds = ls.map((l) => l.kind);
  if (JSON.stringify(kinds) !== JSON.stringify(khuon(n))) bao(n, `thứ tự kind ${kinds.join(',')} ≠ ${khuon(n).join(',')}`);
  if (CHANG.has(n) && !ls.some((l) => l.id === `${tienTo(n)}kiem-tra`)) bao(n, `thiếu bài kiểm tra chặng ${tienTo(n)}kiem-tra`);
  let phatam = 0, sao = 0;
  duyet(ls, (o) => {
    if (o.t === 'phatam') phatam++;
    if (typeof o.voice === 'string' && !VOICES.has(o.voice)) bao(n, `voice lạ: ${o.voice}`);
    if (o.t === 'mcq' && Array.isArray(o.items)) for (const q of o.items as any[]) {
      if (!Array.isArray(q.options) || typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) bao(n, `mcq ${String(o.id)}: đáp án ngoài khoảng`);
      if (!q.why) bao(n, `mcq ${String(o.id)}: thiếu why`);
    }
    for (const v of Object.values(o)) if (typeof v === 'string' && /(^|[^*\w])\*[^*\s][^*]*[^*\s]\*(?!\*)/.test(v)) sao++;
  });
  if (phatam !== 1) bao(n, `có ${phatam} khối phatam (cần đúng 1)`);
  if (sao) bao(n, `${sao} chuỗi dùng *nghiêng* một sao (dùng **đậm**)`);
  for (const l of ls) {
    if (!l.goal || !l.minutes) bao(n, `${l.id}: thiếu goal/minutes`);
    if (l.kind !== 'review' && l.blocks?.[0]?.t !== 'recap') bao(n, `${l.id}: khối đầu không phải recap`);
  }
  let cau = 0;
  duyet(ls.find((l) => l.kind === 'homework'), (o) => { if (['quiz', 'mcq', 'dictation', 'build'].includes(o.t as string) && Array.isArray(o.items)) cau += (o.items as unknown[]).length; });
  if (cau < 30) bao(n, `homework mới ${cau} câu (cần ≥ 30)`);
  console.log(`${loi ? '…' : '✓'} N${n}: ${ls.length} bài · ${ids.length} id · homework ${cau} câu · ~${Math.round(JSON.stringify(ls).length / 1024)} KB`);
}
process.exit(loi ? 1 : 0);
