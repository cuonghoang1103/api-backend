/**
 * pr-08-5 — Prisma ORM · Chapter 8 · Lesson 8.5 "Big schemas and a slow editor" (deck video, 12/11/2026). Bài web: pr-8-5-luoc-do-lon.
 * Số đo THẬT, 12/11/2026, Apple M1 Max, tsc 5.9.3, Prisma 6.19.3 (`lab/p8/85/do3.sh` giữ khoá nặng, trung vị 3 lần; sinh lược đồ 20/100/300 model, mỗi model 2 quan hệ đi + 2 về):
 * skipLibCheck true ⇒ Instantiations KHÔNG đổi theo số model (9.653 viết tại chỗ / 7.268 đặt tên), Check ~0,07–0,09 s, Total 0,31 → 1,40 s (đọc index.d.ts 1,3 → 19,5 MB) ·
 * skipLibCheck false ⇒ 132.027 → 569.387 → 1.662.787 instantiations, Check 0,80 → 2,51 → 5,89 s · đặt tên include sâu (8 chỗ dùng) ⇒ −25 % instantiations, thời gian trong
 * nhiễu · "generateTrace": false trong tsconfig ⇒ TS5024, exit 2 · cờ CLI --generateTrace ⇒ trace.json + types.json.
 * Repo CuongThai thật (đọc): 612 model · 57 enum · 17.699 dòng lược đồ · index.d.ts 70 MB · tsc: 3.454 tệp, 6.861.338 instantiations, Check 37,8 s / Total 44,7 s, 4,9 GB.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p8-5/do.txt": "== 12/11/2026 09:07 · macOS 27.2 · Apple M1 Max · tsc Version 5.9.3\n-- 20 model · index.d.ts 1313 KB ·    40220 dong\ninline · skipLibCheck true        · loi 0 · Instantiations: 9653 · Memory 113111K · Check 0.07s · Total(trung vi 3) 0.31s\nnamed · skipLibCheck true         · loi 0 · Instantiations: 7268 · Memory 105953K · Check 0.07s · Total(trung vi 3) 0.34s\ninline · skipLibCheck false       · loi 0 · Instantiations: 132027 · Memory 192474K · Check 0.80s · Total(trung vi 3) 1.08s\n-- 100 model · index.d.ts 6460 KB ·   196460 dong\ninline · skipLibCheck true        · loi 0 · Instantiations: 9653 · Memory 221548K · Check 0.08s · Total(trung vi 3) 0.64s\nnamed · skipLibCheck true         · loi 0 · Instantiations: 7268 · Memory 229265K · Check 0.08s · Total(trung vi 3) 0.60s\ninline · skipLibCheck false       · loi 0 · Instantiations: 569387 · Memory 486744K · Check 2.51s · Total(trung vi 3) 2.94s\n-- 300 model · index.d.ts 19519 KB ·   587060 dong\ninline · skipLibCheck true        · loi 0 · Instantiations: 9653 · Memory 549870K · Check 0.09s · Total(trung vi 3) 1.40s\nnamed · skipLibCheck true         · loi 0 · Instantiations: 7268 · Memory 541203K · Check 0.08s · Total(trung vi 3) 1.35s\ninline · skipLibCheck false       · loi 0 · Instantiations: 1662787 · Memory 1248902K · Check 5.89s · Total(trung vi 3) 7.35s\n-- 300 model · incremental\nlan 1 (lanh): Instantiations: 9653 · Total 1.39s · \nlan 2 (khong doi gi): Instantiations: 0 · Total 1.32s · \nlan 3 (sua 1 tep): Instantiations: 16726 · Total 1.39s · \nXONG\n",
 "demo/out/p8-5/cuongthai.txt": "$ npx tsc --noEmit -p tsconfig.json --extendedDiagnostics   # repo CuongThai, 12/11/2026, Apple M1 Max\nFiles:                         3454\nLines of Library:             50140\nLines of Definitions:       1732150\nLines of TypeScript:         368792\nTypes:                      1703073\nInstantiations:             6861338\nMemory used:               4933922K\nParse time:                   3.13s\nBind time:                    2.43s\nCheck time:                  37.82s\nTotal time:                  44.69s\n",
 "demo/out/p8-5/cuongthai-luoc-do.txt": "$ grep -c \"^model \" prisma/schema.prisma; grep -c \"^enum \" prisma/schema.prisma; wc -l < prisma/schema.prisma; wc -c < node_modules/.prisma/client/index.d.ts\n612\n57\n17699\n70092515\n",
 "demo/out/p8-5/incr.txt": "$ npx tsc --noEmit -p tsconfig.json --incremental --tsBuildInfoFile <ngoai repo> --extendedDiagnostics   # lan 1 (lanh)\nInstantiations:             6861338\nMemory used:               4976690K\nCheck time:                  35.04s\nTotal time:                  41.60s\n$ # chay lai, khong doi tep nao (lan 2)\nInstantiations:                   0\nMemory used:               2379628K\nTotal time:                   6.22s\n",
 "demo/out/p8-5/trace.txt": "$ npx tsc -p p8/85/tsconfig.trace.json      # \"generateTrace\": false trong tsconfig\ntsconfig.trace.json(1,169): error TS5024: Compiler option 'generateTrace' requires a value of type string.\n[exit 2]\n$ npx tsc --noEmit --strict … inline300.ts --generateTrace trace && ls trace\ntrace.json\ntypes.json\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-08-5', code: 'PR 8.5', title: 'Big schemas and a slow editor', sub: 'Chapter 8 · Lesson 8.5' };

const DEMO = 'demo';
const OUT = (t, ch = 'p8-5') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const DO = OUT('do').split('\n');
const so = (s) => Number(s).toLocaleString('en-US');
/** Hàng bảng từ do.txt: n model, biến thể, skipLibCheck. */
function hang(n, bien, skip) {
  const i = DO.findIndex((l) => l.startsWith(`-- ${n} model`));
  const kb = (DO[i].match(/index\.d\.ts (\d+) KB/) || [])[1];
  const l = DO.slice(i + 1).find((x) => x.startsWith(`${bien} · skipLibCheck ${skip}`));
  const inst = l.match(/Instantiations: (\d+)/)[1], chk = l.match(/Check (\S+)s/)[1], tot = l.match(/Total\(trung vi 3\) (\S+)s/)[1];
  return { kb, inst, chk, tot };
}
const MAY = DO[0].replace(/^== /, '');

export const slides = lamDeck({ chuong: 'Chapter 8 — The generated type system', bai: '8.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 8 · Lesson 8.5', t: 'Big schemas and a slow editor', sub: 'Measure first — then the one setting that moved the number, and the advice that did not' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Reading <code>tsc --extendedDiagnostics</code> on a real 612-model schema</li>
    <li>What schema size costs — and what it does not</li>
    <li>The setting that changed the number most</li>
    <li>Naming deep includes, and <code>incremental</code>, measured</li>
    <li>A tsconfig line that breaks the build</li></ul>` },
  /* 3 */ { t: 'Measure first: a real 612-model schema', body: two(tp(OUT('cuongthai').replace(/   # repo CuongThai.*$/m, ''), { wrap: 66, fs: 13, title: 'terminal — CuongThai backend, M1 Max, tsc 5.9.3' }),
      tp(OUT('cuongthai-luoc-do').split('\n').slice(1).map((v, i) => ['models', 'enums', 'schema lines', 'index.d.ts bytes'][i].padEnd(18) + so(v)).join('\n'), { fs: 15, title: 'the schema behind it' }), '') +
      cards([
        ['Instantiations', 'How many times a generic type was evaluated. Deterministic: the same code gives the same number, so it is the one to compare.'],
        ['Check vs Parse + Bind', 'Check is 38 of 45 seconds here: type complexity, not file size, is the cost.'],
        ['Write it down', 'Measure before and after every change. Times are noisy; instantiations are not.'],
      ], 3) },
  /* 4 */ { t: 'What schema size alone costs', body: tbl(['Models', 'index.d.ts', 'Instantiations', 'Check', 'Total (median of 3)'], [20, 100, 300].map((n) => {
      const h = hang(n, 'inline', 'true');
      return [String(n), (h.kb / 1024).toFixed(1) + ' MB', so(h.inst), h.chk + ' s', h.tot + ' s'];
    }), { hl: [2] }) + tp(MAY, { fs: 12, title: 'measured on' }) +
      box('The same code, fifteen times the schema: instantiations did not move', 'With skipLibCheck on, the checker only evaluates the types your code touches. A bigger schema costs reading a bigger file — total time rose, check time did not.', 'lam') },
  /* 5 */ { t: 'The lever that moved it: skipLibCheck', body: tbl(['Models', 'skipLibCheck', 'Instantiations', 'Check', 'Total'], [20, 100, 300].flatMap((n) => {
      const a = hang(n, 'inline', 'true'), b = hang(n, 'inline', 'false');
      return [[String(n), 'true', so(a.inst), a.chk + ' s', a.tot + ' s'], ['', c('false'), so(b.inst), b.chk + ' s', b.tot + ' s']];
    }), { hl: [5] }) +
      box('Off, the checker re-verifies the whole generated client', '1.66 million instantiations for 300 models — all of it in a file the generator wrote and nobody edits. skipLibCheck skips declaration files, never your code.', 'xanh') },
  /* 6 */ { t: 'Naming a deep include, measured', body: ts(`const kem = {
  r1: { include: { r1: { include: { r2: { include: { back1: true } } } }, back2: { include: { r1: true } } } },
  r2: { include: { back1: { include: { r2: true } } } },
} satisfies Prisma.M0Include;
export type Day = Prisma.M0GetPayload<{ include: typeof kem }>;
// 8 functions: prisma.m0.findUnique({ where: { id }, include: kem }) → Promise<Day | null>
// baseline: the same include object written inline in each of the 8 functions`, { sm: true }) +
      tbl(['300 models, skipLibCheck true', 'Instantiations', 'Check', 'Total (median of 3)'], ['inline', 'named'].map((v) => { const h = hang(300, v, 'true'); return [v === 'inline' ? 'written inline ×8' : 'named once', so(h.inst), h.chk + ' s', h.tot + ' s']; })) +
      box('−25 % instantiations; the clock did not notice', 'Naming the shape is still right — Lesson 8.2&#39;s reasons are correctness. On a hot path with many call sites, measure it on your code before promising a speed-up.', 'lam') },
  /* 7 */ { t: 'incremental: the second run', body: tp(OUT('incr'), { wrap: 120, fs: 14, title: 'terminal — CuongThai backend, --incremental, tsbuildinfo outside the repo' }) +
      cards([
        ['The second run reuses the first', 'A saved .tsbuildinfo lets tsc skip files that did not change. Point it at a cached, gitignored path.'],
        ['Cold runs gain nothing', 'CI without a cached tsbuildinfo, or the editor&#39;s first load, pay full price.'],
      ], 2) },
  /* 8 */ { t: 'Find the expensive line: --generateTrace', body: tp(OUT('trace'), { wrap: 120, fs: 13 }) +
      ts(`{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.cache/tsbuildinfo",
    "skipLibCheck": true
  }
}`, { sm: true }) +
      box('--generateTrace is a command-line flag — put false in tsconfig and the build stops', 'It expects a directory string; "generateTrace": false is error TS5024 and tsc exits 2. Load trace.json in ui.perfetto.dev: the wide bars name the file and line.', 'do2') },
  /* 9 */ { t: 'What does not help — and the editor', body: tbl(['Advice', 'Effect'], [
      ['Import types one by one instead of ' + c('Prisma'), 'none — the whole declaration file loads either way'],
      [c('import type') + ' everywhere', 'helps emit and bundling, not checking'],
      ['Turn off ' + c('strict'), 'marginal speed, and every check this chapter relied on is gone'],
      ['Type a slow result as ' + c('any'), 'instant relief, and the check is gone — a regression, not a fix'],
    ]) + box('Editor shows a stale field after prisma generate?', 'It still holds the old index.d.ts in memory. "TypeScript: Restart TS Server" — the answer to most "this field exists but the editor says it does not".', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run ${c('tsc --extendedDiagnostics')}; write down Instantiations`,
      `Flip ${c('skipLibCheck')}; run again`,
      `Run twice with ${c('--incremental')}`,
      `Trace once with ${c('--generateTrace')}; open the widest bar`,
    ]), box('Keep these', `<ul><li>Compare instantiations, not seconds</li><li>skipLibCheck: true</li><li>incremental with a cached tsbuildinfo</li><li>generateTrace on the command line only</li></ul>`, 'lam'), '') },
]);
