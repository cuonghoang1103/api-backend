/**
 * pro-l211-review — PRO192 · 🎓 LAB211 thực chiến · L.0 "How to pass the LAB211 review" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-review (khung chung Note
 * Management: lint.py ✓ sạch, check PASS 81/81, JDK 8 thật trùng máy; bay/loi-thuong-gap = lint 8 vi phạm THẬT;
 * bay/service-giu-repo = lint ✓ mà sai luật P0011; bay/java-moi = lỗi javac --release 8 THẬT). Không mã sinh viên.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-review.mjs --out <dir>   ⇒ <dir>/l211-review/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, tangLab, PG, NAU, XANH, CAM, TIM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-review', code: 'PRO192 · LAB211', title: 'LAB211 in practice — how to pass the review', sub: 'Five gates · the skeleton · the 25-item checklist · lint.py · JDK 8 · the questions' };

const S = 'l211-review/solution/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const de = (src) => { const l = src.split('\n'); const n = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length)); return l.map((x) => x.slice(n)).join('\n'); };
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');

/* Hình: năm cửa nối tiếp */
function hinhNamCua() {
  const W = 1110, h = 210;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  const cua = [['1', 'Structure', 'packages of the Guide', PG], ['2', 'Convention', 'names · Alt+Shift+F', TIM], ['3', 'Comments', 'every method & block', CAM], ['4', 'Debug', 'breakpoint · F7 / F8', NAU], ['5', 'Test', 'every key, every message', XANH]];
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mnc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>`;
  const bw = 190, gap = 40;
  cua.forEach(([n, ten, phu, m], i) => {
    const x = i * (bw + gap);
    s += `<rect x="${x}" y="20" width="${bw}" height="130" rx="14" fill="${m}14" stroke="${m}" stroke-width="3"/>` +
      `<circle cx="${x + 30}" cy="22" r="18" fill="${m}"/>` + t(x + 30, 29, n, { b: true, m: '#fff', fs: 19 }) +
      t(x + bw / 2, 82, ten, { b: true, fs: 24, m }) + t(x + bw / 2, 116, phu, { fs: 16 });
    if (i < 4) s += `<line x1="${x + bw + 4}" y1="85" x2="${x + bw + gap - 4}" y2="85" stroke="#555" stroke-width="3" marker-end="url(#mnc)"/>`;
  });
  s += t(555, 190, 'fail a gate ⇒ the review stops there · all five passed ⇒ the oral questions', { b: true, fs: 19, m: DO });
  return s + '</svg>';
}

/* Hình: ai kiểm cái gì */
function hinhAiKiem() {
  return tbl(['Kind of check', 'Example', 'Who', 'How it fails'], [
    ['FORMAT — what was typed', '"abc" for a number · blank · 9 at a 1–4 menu', `Main → ${c('Validation')}`, `${c('throw new Exception(Message.X)')}`],
    ['EXISTENCE — the stored data', 'delete note 9 · code W 1 already used', c('NoteRepository'), 'throw from the repository'],
    ['BUSINESS RULE — the domain', 'salary must stay above 0 · semester not twice', c('…Service'), 'throw from the service'],
    ['SHOWING the error', 'one line, then ask again', c('Main'), `${c('catch')} → ${c('println(e.getMessage())')}`],
  ]);
}

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.0' }, [
  /* 1 */
  { cover: true, t: 'LAB211 in practice —<br>how to pass the review', sub: 'Five gates · one skeleton for every lab · the 25-item paper checklist · lint.py · JDK 8 · the questions the lecturer asks' },

  /* 2 */
  { t: 'LAB211 is PRO192 done for real', body: two(
    tbl(['', 'Rule'], [
      ['To pass', '<b>750 LOC</b> of accepted labs · 10 weeks'],
      ['One lab', 'P0056 70 · P0011 100 · P0071 150 · P0021 <b>350</b>'],
      ['One slot', 'at most <b>3 reviews</b> · not in the last 30 min'],
      ['PTS', '<b>Save draft</b> first · SUBMIT only after "đạt"'],
      ['Copying', 'allowed <b>if you understand every line</b>'],
    ]),
    col(box('Same skills, chapter by chapter', `<p style="margin:0">JavaBeans (Ch2–3) · interfaces with ${c('I')} (Ch5) · exceptions thrown by Validation, caught in Main (Ch6) · ${c('ArrayList')} of objects (Ch7) · ${c('HashMap')} + ${c('Comparator')} (Ch8) · files (Ch9).</p>`, 'lam'),
      box('Why people fail', `<p style="margin:0">Not the algorithm — the <b>layer</b>, a missing <b>comment</b>, a variable called ${c('service')}, an error that says <b>"Invalid!"</b>.</p>`, 'do2')), 'r46'), giua: true },

  /* 3 */
  { t: 'Five gates, in order', body: hinhNamCua() + two(
    box('Before gate 1', `<p style="margin:0">Project ${c('MSSV_J1SP0011_ChangeBaseNumber')} (your code), packages in lower case, <b>repository</b> present — even in an algorithm lab.</p>`, 'lam'),
    box('Gate 5 is literal', `<p style="margin:0">The lecturer types the brief's keys: every happy case, <b>every validation message</b>. Prepare the list of keys yourself.</p>`, 'ok')), giua: true },

  /* 4 */
  { t: 'The skeleton: nine packages, one direction', body: tangLab({ h: 400, ten: { controller: 'NoteController', repository: 'NoteRepository', service: '(service)', view: 'NoteView', model: 'Note', dto: 'NoteRequestDTO · NoteResponseDTO' } }) +
    `<div class="nho" style="text-align:center">Note Management needs no service: it has no rule beyond add · delete · list. A service appears with a business rule — and gets its data from the controller.</div>` },

  /* 5 */
  { t: 'Who checks what', body: hinhAiKiem() + box('One rule, one place', `<p style="margin:0">The lecturer changes a rule in the room ⇒ you change <b>one</b> file. Validation never reads the keyboard and never prints: line in, clean value out — or an exception.</p>`, 'ok'), giua: true },

  /* 6 */
  { t: 'Main: the keyboard lives here, one call per case', body: two(
    j(de(boChuThich(tep(`${S}/main/Main.java`, [23, 56])))),
    col(box('Main', `<p style="margin:0">${c('final')} + private constructor (3.4) · ${c('Scanner')} is <b>local</b>, passed to static helpers · no static field · a ${c('running')} flag, never ${c('System.exit')}.</p>`, 'lam'),
      box('Each case', `<p style="margin:0">build a DTO with the helpers → call the controller <b>once</b> → anything thrown below is printed by the ${c('catch')}.</p>`, 'ok')), 'r64') },

  /* 7 */
  { t: 'Controller and view: render once per flow', body: two(
    j(boChuThich(ham(`${S}/controller/NoteController.java`, 'addNote')).replace('responseDTO.setMessage(String.format(Message.ADD_SUCCESS, noteId));', 'responseDTO.setMessage(\n        String.format(Message.ADD_SUCCESS, noteId));')),
    j(boChuThich(ham(`${S}/view/NoteView.java`, 'setResponseDTO')) + '\n\n' + boChuThich(ham(`${S}/view/NoteView.java`, 'display')).split('\n').slice(0, 7).join('\n') + '\n    …\n}')) +
    box('The lecturer\'s own sample', `<p style="margin:0">${c('doctorView.setDoctorMap(result); doctorView.display();')} — data through an <b>attribute</b>, ${c('display()')} without parameters, <b>no print</b> in the controller (lint: PRINT).</p>`, 'ok') },

  /* 8 */
  { t: 'Three real rejections — and the fix', body: tbl(['Lab', 'The lecturer said', 'The fix'], [
    ['P0011', '"CRUD must not be in the service — take the repository calls out"', `controller holds ${c('BaseNumberRepository')}; service only converts`],
    ['P0056', `rename ${c('service')} → ${c('workerService')}, ${c('view')} → ${c('workerView')}`, 'Refactor → Rename (Ctrl+R): a variable is named after its class'],
    ['P0071', 'the error message must say <b>what is wrong</b> and <b>what to type</b>', `${c('"Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 4."')}`],
  ]) + box('He reads by imports', `<p style="margin:0">The lecturer opens each class and looks at the first lines: who imports whom. Then ${c('Message.java')} — every sentence of the program in one file.</p>`, 'lam'), giua: true },

  /* 9 */
  { t: 'The paper checklist: the lines people miss', body: two(
    tbl(['Row', 'The rule'], [
      ['2.6 · 3.7', `declare at the <b>top</b> of the block and initialise: ${c('String line = "";')}`],
      ['2.8', 'a <b>blank line</b> before every comment, after the declarations'],
      ['3.3', `${c('if ((a < min) || (a > max))')} — parentheses per comparison`],
      ['3.4', 'static-only class ⇒ <b>final</b> + private constructor'],
      ['3.8', `${c('StringBuilder')}, never ${c('String +=')} in a loop`],
      ['1.5', `${c('noteList')}, ${c('workerMap')}, ${c('getId')} (not ID)`],
      ['1.3', `${c('ISortStrategy')}, ${c('StorageException')}`],
    ]),
    col(box('How it is used', `<p style="margin:0">25 rows, 3 columns of dates. You fill <b>"O"</b> on every row yourself; one "X" left ⇒ not ready to ask.</p>`, 'lam'),
      box('Alt+Shift+F is not enough', `<p style="margin:0">It fixes indentation and braces. It does <b>not</b> add the blank lines of 2.8, move declarations (2.6) or add parentheses (3.3).</p>`, 'do2')), 'r64'), giua: true },

  /* 10 */
  { t: 'The rules said in class', body: tbl(['Rule', 'Write', 'Not'], [
    ['V5 concrete types', c('ArrayList<Note> noteList'), c('List<Note> noteList')],
    ['V4 ≤ 2 parameters', `${c('addWorker(WorkerRequestDTO dto)')} (utils: 3)`, c('addWorker(code, name, age)')],
    ['V10 JavaBean', 'private fields · public empty constructor · get/set', 'a model with only a full constructor'],
    ['V2 static', 'static methods in utils, constants, Main', c('private static Scanner sc')],
    ['exit', `a ${c('boolean running')} flag or ${c('return')}`, c('System.exit(0)')],
    ['2.10 · 2.11', `${c('Constants.MENU_EXIT')} · ${c('Message.GOODBYE')}`, `${c('4')} · ${c('"Goodbye."')} in the code`],
  ]) + box('Why List looks bad here', `<p style="margin:0">The lecturer: ${c('List')}/${c('Map')} in a first-year lab is the sign of copied or AI code. Keep the interface only where the brief dictates it — with ${c('// brief:')}.</p>`, 'lam'), giua: true },

  /* 11 */
  { t: 'lint.py red: eight real violations', body: P(ra('l211-review/bay/loi-thuong-gap:lint').replace(' — dùng kiểu cụ thể ArrayList/HashMap/LinkedHashMap (thầy: List/Map là dấu hiệu AI) — chỉ giữ List/Map khi đề bắt, kèm comment \'// brief: ...\'', ' — dùng kiểu cụ thể ArrayList/HashMap…'), { title: '$ python3 lint.py MSSV_KHUNG_NoteManagement   (bay/loi-thuong-gap — real)' }) + two(
    box('Seven one-line mistakes', `<p style="margin:0">controller prints · ${c('List')} · static ${c('Scanner')} · ${c('System.exit')} · ${c('4')} · an ${c('if')} without comment.</p>`, 'do2'),
    box('Then', `<p style="margin:0">Fix line by line, run again until <b>"✓ … — sạch"</b>. The clean skeleton: ${c(ra('l211-review/solution:lint'))}</p>`, 'ok')) },

  /* 12 */
  { t: 'Green lint is not a pass', body: two(
    j([tep('l211-review/bay/service-giu-repo/src/service/NoteService.java', [1, 5]), '', '// (Javadoc hidden)', boChuThich(tep('l211-review/bay/service-giu-repo/src/service/NoteService.java', [12, 25])), '    // deleteNote, getDataNotes: the same', '}'].join('\n'), { hl: [5, 9, 11] }),
    col(P(ra('l211-review/bay/service-giu-repo:lint'), { title: 'python3 lint.py — real' }),
      P('$ grep -n "^import repository" src/service/*.java\nsrc/service/NoteService.java:5:import repository.NoteRepository;', { title: 'what the lecturer sees', sm: true }),
      box('P0011, 26/10', `<p style="margin:0">Compiles, runs, same 81 lines, lint silent — <b>rejected</b>: the service holds the repository. The grep must print <b>nothing</b>.</p>`, 'do2'))) },

  /* 13 */
  { t: 'The lab room runs JDK 8', body: two(
    P(ra('l211-review/bay/java-moi:javac'), { title: '$ javac --release 8 … (bay/java-moi — real)', sm: true }),
    col(tbl(['Newer than Java 8', 'Since'], [[c('var'), '10'], [c('List.of'), '9'], ['text block """', '15'], [c('String.repeat'), '11'], [c('case X ->'), '14']]),
      box('Before you go', `<p style="margin:0">Compile with ${c('--release 8')}: it checks the language <b>and</b> the API of Java 8. NetBeans: Source/Binary Format = JDK 8.</p>`, 'ok')), 'r64') },

  /* 14 */
  { t: 'The oral questions', body: tbl(['They ask', 'Point at / answer'], [
    ['Encapsulation', `the private fields of ${c('Note')} + getters/setters`],
    ['Polymorphism', `${c('@Override toString()')} — ${c('println(note)')} runs Note's version`],
    ['Abstraction', `Main calls ${c('noteController.addNote(dto)')} — no idea where notes live`],
    ['Why static?', 'belongs to the class; the result depends only on the input'],
    ['Remove static?', '"non-static method … cannot be referenced from a static context"'],
    ['ArrayList vs List?', 'List = the contract (interface), ArrayList = the class'],
    ['Why void?', 'the view prints the result; errors travel by throw'],
    ['Overloading vs overriding?', 'same class, other parameters / subclass, same signature'],
  ]), giua: true },

  /* 15 */
  { t: 'Before you raise your hand', body: two(
    steps([
      `${c('javac --release 8')} — no error`,
      'type every test key, read every message',
      `${c('lint.py')} → ✓ sạch · read your <b>imports</b>`,
      'paper checklist: "O" on all 25 rows',
      'debug once · answer 5 questions aloud',
      '<b>Save draft</b> · raise your hand before the last 30 min',
    ]),
    tbl(['Minutes', 'A 90-minute slot'], [
      ['0–5', 'reread the brief, underline names and messages'],
      ['5–15', 'project + packages · <b>model first</b>'],
      ['15–50', 'type, run every 2–3 files'],
      ['50–65', 'Alt+Shift+F · comments · test keys'],
      ['65–75', 'Save draft (zip under 10 MB)'],
      ['75–90', 'raise your hand'],
    ]), 'r46'), giua: true },
]);
