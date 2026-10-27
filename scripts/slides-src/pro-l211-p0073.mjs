/**
 * pro-l211-p0073 — PRO192 · 🎓 LAB211 thực chiến · L.6 "J1.S.P0073 Handy Expense" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 đợt 2, 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0073 (bài MỚI 26/10 theo khuôn
 * Worker đã pass, đã soát thêm: Main đọc tệp (tờ giấy 1.1), View in kết quả; lint.py ✓ sạch, 25 mục 0 vi phạm, JDK 8 thật trùng,
 * PASS 112/112 qua 2 lần chạy; bay/split-gach: split("|") thay "\\|" ⇒ mở lại bảng nát, Total: 6 THẬT).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0073.mjs --out <dir>   ⇒ <dir>/l211-p0073/NNN.webp
 */
import { lamDeck, sql, psql, two, box, tbl, c, vsd } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, boc, PG, XANH, CAM, DO, TIM } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0073', code: 'PRO192 · LAB211 P0073', title: 'LAB211 · J1.S.P0073 — Handy Expense', sub: 'A file that survives a restart · ID = max + 1 · the service only computes' };

const S = 'l211-p0073/solution/src';
const j = (src, o = {}) => sql(boc(src, o.max || 60), { lang: 'java', sm: true, ...o });
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const R = (a, b) => ra('l211-p0073/solution:run', [a, b]);
const NHAC = /^(?:Your choice: |Enter Date: |Enter Amount: |Enter Content: |Enter ID: )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');

/* Hình: ID = lớn nhất + 1, chạy tay */
function hinhId() {
  const W = 1110, h = 190;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 19}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" text-anchor="${o.a || 'middle'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''}>${s}</text>`;
  const buoc = [['add ×3', '1 · 2 · 3', 'max 0 → 1, 2, 3', XANH], ['quit · reopen', '1 · 2 · 3', 'read back from the file', PG], ['delete 2', '1 · 3', 'Delete an expense successful', DO], ['add', '1 · 3 · 4', 'max 3 + 1 = 4', CAM]];
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial">`;
  buoc.forEach(([a, ids, n, m], i) => {
    const x = i * 278;
    s += `<rect x="${x + 4}" y="10" width="262" height="150" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>` +
      t(x + 135, 46, a, { b: true, m }) + t(x + 135, 96, ids, { mono: true, fs: 30, b: true }) + t(x + 135, 136, n, { fs: 16, m: '#555' });
    if (i < 3) s += `<text x="${x + 271}" y="92" font-size="26" fill="#888">›</text>`;
  });
  return s + t(555, 184, 'computed from the list every time — no counter to save, still right after a restart', { fs: 16, m: '#555' }) + '</svg>';
}

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.6 · P0073' }, [
  /* 1 */
  { cover: true, t: 'J1.S.P0073 —<br>Handy Expense', sub: 'Short assignment · 100 LOC · new, on the skeleton of the passed Worker lab — with a file that must survive a restart' },

  /* 2 */
  { t: 'The brief', body: two(
    col(tbl(['Menu', ''], [['1 Add an expense', 'Date · Amount · Content; <b>ID = last + 1</b>, first 1'], ['2 Display all expenses', 'ID Date Amount Content + <b>Total</b>'], ['3 Delete an expense', '<b>"Delete an expense fail"</b> / <b>"… successful"</b>'], ['4 Quit', '']]),
      box('Methods the brief names', `<p style="margin:0">${c('addExpense(List, Date, double, String)')} · ${c('displayAll(List)')} · ${c('deleteExpense(List, Expense)')} — kept by name, not by signature: 4 parameters break the rule ≤ 2 (V4).</p>`, 'lam')),
    P(boNhac(R(40, 45)), { title: 'the brief\'s example, real (Total: 550)', sm: true }), 'r64'), giua: true },

  /* 3 */
  { t: 'ID = max + 1, by hand', body: hinhId() + two(
    box('Why not a counter', `<p style="margin:0">a ${c('lastId')} field would be lost when the program stops — the file has no counter. The largest ID in the list is always there.</p>`, 'ok'),
    box('Compare with P0071', `<p style="margin:0">P0071 keeps ${c('lastId')} in memory (nothing is saved). Same brief rule "last + 1", different storage, different answer.</p>`, 'lam')) },

  /* 4 */
  { t: 'Who touches the file', body: luong([
    ['Main', 'FileUtils.readLines\nonce, at start', PG],
    ['Controller', 'loadExpenses(dto)\nthe lines', CAM],
    ['Repository', 'split each line\n→ Expense', XANH],
    ['Repository', 'after add / delete:\nwriteLines', XANH],
  ], { h: 170, fs: 16 }) + two(
    box('Paper 1.1, word for word', `<p style="margin:0"><i>"Toàn bộ việc nhập dữ liệu / Validate / <b>đọc từ file</b> / mã hoá thực hiện ở Main."</i> The Guide lists FileUtils among Main's tools. So <b>Main reads</b>, the repository parses.</p>`, 'lam'),
    box('Writing', `<p style="margin:0">the paper says nothing about writing: the repository saves after each change, through ${c('FileUtils')} (utils, static). Lab 9 let the repository read too — that is the trade's habit; for the lecturer, follow the paper.</p>`, 'ok')) },

  /* 5 */
  { t: 'One line per expense', body: two(
    j(boChuThich(ham(`${S}/repository/ExpenseRepository.java`, 'loadExpenses')), { max: 66 }),
    col(P(ra('l211-p0073/solution:data'), { title: 'data/expenses.txt after both runs (real)', sm: true }),
      tbl(['Choice', 'Why'], [[c('|') + ' not ' + c(','), 'content may hold a comma'], [c('split("\\\\|", 4)'), 'the rest is the content'], ['rewrite the file', 'the only way to drop a line'], ['UTF-8, always', 'not the default code page']])), 'r64') },

  /* 6 */
  { t: 'The trap: split("|")', body: two(
    col(P(boNhac(ra('l211-p0073/bay/split-gach:run', [58, 63])), { title: 'the trap, reopened (real) — no error, just wrong', sm: true }),
      box('Run 1 looks perfect', `<p style="margin:0">nothing is read in run 1 — the bug only shows when the program is <b>opened again</b>. Test keys must include a restart.</p>`, 'lam')),
    col(vsd(j('split("|", 4)', { max: 30 }), j('split("\\\\|", 4)', { max: 30 })),
      box('| means "or" in a regex', `<p style="margin:0">${c('"|"')} is "empty OR empty": it matches <b>between every two characters</b>. ${c('"1|11-Apr…"')} becomes ${c('"1"')}, ${c('"|"')}, ${c('"1"')}, ${c('"1-Apr-2009|100.0|…"')}.</p>`, 'do2')), 'r64') },

  /* 7 */
  { t: 'Dates like 11-Apr-2009', body: two(
    j(boChuThich(ham(`${S}/utils/Validation.java`, 'getDate')), { max: 64 }),
    col(tbl(['Typed', 'Result'], [[c('31-Feb-2009'), '✗ not a real date'], [c('11-apr-2009'), '✓ stored as 11-Apr-2009'], [c('2009-04-11'), '✗ shape'], [c('11-Apr-2009abc'), '✗ shape']]),
      box('Three traps', `<p style="margin:0">${c('MMM')} follows the machine's language ⇒ ${c('Locale.ENGLISH')} · lenient turns 31-Feb into 3-Mar ⇒ ${c('setLenient(false)')} · parse reads the start only ⇒ the regex first.</p>`, 'ok')), 'r64') },

  /* 8 */
  { t: 'The clean design', body: luong([
    ['Main', 'read file · input\none call per case', PG],
    ['ExpenseController', 'holds the three', CAM],
    ['ExpenseRepository', 'list · CRUD\nsave the file', XANH],
    ['ExpenseService', 'next ID · rows\ntotal', TIM],
    ['ExpenseView', 'display()\nonce', PG],
  ], { h: 170, fs: 15 }) + two(
    box('The service holds nothing', `<p style="margin:0">it receives the list from the controller and returns numbers and rows — it never sees ${c('ExpenseRepository')}. That is the rule the lecturer enforced in P0011 and P0021.</p>`, 'ok'),
    box('What changed from the 26/10 version', `<p style="margin:0">Main printed "Add an expense successful" itself ⇒ now the view · the repository read the file ⇒ Main reads · ${c('int choice')} declared mid-block · 34 paper violations ⇒ 0.</p>`, 'lam')) },

  /* 9 */
  { t: 'Repository: add, delete, save', body: two(
    col(j(boChuThich(ham(`${S}/repository/ExpenseRepository.java`, 'deleteExpense')), { max: 66 }),
      P(boNhac(R(70, 71)) + '\n' + boNhac(R(78, 78)), { title: 'real — delete abc, 9, then 2', sm: true }),
      box('false, not an exception', `<p style="margin:0">a missing ID is a normal answer the brief prints: ${c('"Delete an expense fail"'.replace(/"/g, ''))}. A write failure is the exception.</p>`, 'ok')),
    j(boChuThich(ham(`${S}/repository/ExpenseRepository.java`, 'saveToFile')).replace(/\n\s*\} catch[\s\S]*$/, '\n    } catch (Exception e) { … WRITE_FAIL … }\n}'), { max: 46 }), 'r64') },

  /* 10 */
  { t: 'Service: only computing', body: two(
    j(boChuThich(ham(`${S}/service/ExpenseService.java`, 'generateNextId')) + '\n\n' + boChuThich(ham(`${S}/service/ExpenseService.java`, 'calculateTotal')), { max: 64 }),
    col(j(boChuThich(ham(`${S}/service/ExpenseService.java`, 'formatMoney')), { max: 46 }),
      box('100, not 100.0', `<p style="margin:0">${c('"0.##"')} drops a useless ${c('.0')} like the brief's table; ${c('Locale.US')} keeps a dot on a Vietnamese Windows (${c('50.5')}, not ${c('50,5')}).</p>`, 'ok')), 'r64') },

  /* 11 */
  { t: 'Controller and view', body: two(
    col(j(boChuThich(ham(`${S}/controller/ExpenseController.java`, 'addExpense')), { max: 66 }),
      j(boChuThich(ham(`${S}/controller/ExpenseController.java`, 'deleteExpense')), { max: 66 })),
    col(j(boChuThich(ham(`${S}/view/ExpenseView.java`, 'display')).replace(/System\.out\.println\(String\.format\(Constants\.HEADER_FORMAT[\s\S]*?HEADER_CONTENT\)\);/, 'System.out.println(String.format(\n        Constants.HEADER_FORMAT, …labels…));'), { max: 46 }),
      box('The brief\'s sentences', `<p style="margin:0">copied exactly: ${c('Delete an expense fail')} — no "failed", no full stop.</p>`, 'lam')), 'r64') },

  /* 12 */
  { t: 'Main and FileUtils', body: two(
    col(j(boChuThich(ham(`${S}/main/Main.java`, 'readExpenseFile')), { max: 66 }),
      j(boChuThich(ham(`${S}/utils/FileUtils.java`, 'writeLines')).replace(/\n    try \(PrintWriter[\s\S]*$/, '\n    try (PrintWriter writer = … UTF-8 …) {\n        … println each line …\n        if (writer.checkError()) { throw … }\n    }\n}'), { max: 66 })),
    col(j(boChuThich(ham(`${S}/main/Main.java`, 'inputExpense')), { max: 46 }),
      box('Three small guards', `<p style="margin:0">create ${c('data/')} on the first run · ${c('UTF-8')} both ways · ${c('checkError()')} because PrintWriter swallows errors.</p>`, 'ok')), 'r64') },

  /* 13 */
  { t: 'Two runs, lint, JDK 8, PASS', body: two(
    P(boNhac(R(16, 20)) + '\n…\n' + R(52, 52) + '\n…\n' + boNhac(R(101, 106)), { title: 'test keys — run 1, then the program reopened (real)', sm: true }),
    col(psql(ra('l211-p0073/solution:lint'), { title: 'python3 lint.py' }),
      psql(ra('l211-p0073/solution:check'), { title: './check.sh (2 runs)' }),
      box('JDK 8 · paper', `<p style="margin:0">a real JDK 8 prints the same 112 lines · the 25 paper items: <b>0 violations</b>.</p>`, 'ok')), 'r64') },

  /* 14 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['Who reads the file, who writes it?', 'Main reads (paper 1.1), the repository parses and saves after each change, FileUtils does the I/O'],
    ['Why does the service not call the repository?', 'it only computes on what the controller gives; storage can change without touching it'],
    ['How is the ID made?', 'largest ID + 1 from the list — still right after a restart; delete 2 then add ⇒ 4'],
    ['Why split("\\\\|") and not split("|")?', '| is the regex "or": unescaped it splits between every character'],
    ['Why Locale.ENGLISH for the date, Locale.US for money?', 'month names in English on any machine; a dot, never a comma'],
    ['Why does deleteExpense return boolean?', 'a missing ID is an expected answer, printed as the brief\'s "fail"'],
  ]), giua: true },
]);
