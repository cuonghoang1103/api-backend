/**
 * pro-l211-p0056 — PRO192 · 🎓 LAB211 thực chiến · L.3 "J1.S.P0056 Worker Management" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0056 (bản viết lại trên khuôn bài
 * bạn đã pass, theo checklist: lint.py ✓ sạch, JDK 8 thật trùng máy, 25 mục 0 vi phạm; cột ngày = chữ dd/MM/yyyy thay ngày chạy;
 * bay/ban-pass = bài đã pass, ẩn tên: javac --release 8 lỗi text block THẬT, lint 115 vi phạm THẬT).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0056.mjs --out <dir>   ⇒ <dir>/l211-p0056/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, tangLab, boc, PG, NAU, XANH, CAM, TIM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0056', code: 'PRO192 · LAB211 P0056', title: 'LAB211 · J1.S.P0056 — Worker Management', sub: 'A passed solution through the checklist · salary history · sort by code · JDK 8' };

const S = 'l211-p0056/solution/src';
const j = (src, o = {}) => sql(boc(src, o.max || 60), { lang: 'java', sm: true, ...o });
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const NHAC = /^(?:Enter your choice:|Enter Code:|Enter Name:|Enter Age:|Enter Salary: ?|Enter work location:)+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).join('\n');
const R = (a, b) => boNhac(ra('l211-p0056/solution:run', [a, b]));

/* Hình: ví dụ của đề — lương theo thời gian + 3 dòng lịch sử */
function hinhViDu() {
  const W = 1110, h = 270;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 19}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace" xml:space="preserve" style="white-space:pre"' : ''} text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial">`;
  const buoc = [['Add W 1', '1000', '—', '#8a8a8a'], ['Add W 3', '1400', '—', '#8a8a8a'], ['Up W 1 +100', '1100', 'W 1 1100 UP', XANH], ['Up W 1 +400', '1500', 'W 1 1500 UP', XANH], ['Down W 3 −100', '1300', 'W 3 1300 DOWN', DO]];
  buoc.forEach(([a, l, r, m], i) => {
    const x = i * 222;
    s += `<rect x="${x + 4}" y="10" width="210" height="120" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>` +
      t(x + 109, 46, a, { b: true, a: 'middle', m }) + t(x + 109, 84, `salary ${l}`, { mono: true, a: 'middle', fs: 18 }) + t(x + 109, 114, r === '—' ? 'no history row' : 'history +1', { a: 'middle', fs: 16, m: '#555' });
  });
  s += `<rect x="4" y="146" width="1102" height="118" rx="10" fill="#f6f8fb" stroke="#c9d3df"/>`;
  s += t(20, 172, 'Code    Name    Age   Salary  Status  Date', { mono: true, fs: 17, m: '#555' });
  s += t(20, 198, 'W 1     Nghia   20    1100    UP      ← copied when it happened', { mono: true, fs: 17 });
  s += t(20, 224, 'W 1     Nghia   20    1500    UP', { mono: true, fs: 17 });
  s += t(20, 250, 'W 3     Lien    20    1300    DOWN    (W 3 added first — sorted by code)', { mono: true, fs: 17 });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.3 · P0056' }, [
  /* 1 */
  { cover: true, t: 'J1.S.P0056 —<br>Worker Management', sub: 'Short assignment · 70 LOC · a classmate\'s passed solution, put through the lecturer\'s tools — and rebuilt clean on the same skeleton' },

  /* 2 */
  { t: 'The brief', body: two(
    col(tbl(['Menu', ''], [['1 Add Worker', 'Code · Name · Age · Salary · work location'], ['2 Up salary', 'Code + amount'], ['3 Down salary', 'Code + amount'], ['4 Display Information salary', 'the history, <b>sorted by code</b>'], ['5 Exit', '']]),
      box('Rules', `<p style="margin:0">code not empty, <b>not duplicated</b> · age <b>18–50</b> · salary <b>&gt; 0</b> · Up/Down: the code must exist, amount &gt; 0, each change stored with UP/DOWN and the date.</p>`, 'lam')),
    P(boNhac(ra('l211-p0056/solution:run', [1, 8])).replace('--------------------', '-----'), { title: 'the screen (real)', sm: true }), 'r64'), giua: true },

  /* 3 */
  { t: 'The brief\'s example, by hand', body: hinhViDu() + two(
    box('Add writes no history', `<p style="margin:0">The example shows exactly <b>three</b> rows — the three changes. The passed version also wrote an "UP" row on Add.</p>`, 'do2'),
    box('A row is a photo', `<p style="margin:0">${c('SalaryHistory')} <b>copies</b> the salary of that moment. Reading the worker's current salary would print 1500 twice.</p>`, 'ok')) },

  /* 4 */
  { t: 'What the tools say about the passed version', body: two(
    P(ra('l211-p0056/bay/ban-pass:javac'), { title: '$ javac --release 8 … (the passed version — real)', sm: true }) +
    P(ra('l211-p0056/bay/ban-pass:lint', [1, 1]) + '\n' + ['   79  COMMENT  (no Javadoc, no comment per block)', '   11  FORMAT   (if(, ){, lines over 100)', '   10  COLLECTION (List, Map)', '    6  HARDCODE  ·  6 MAGIC  ·  2 JAVABEAN  ·  1 SWITCH'].join('\n'), { title: 'python3 lint.py — counted by rule (real)', sm: true }),
    col(box('What no tool sees', `<p style="margin:0">${c('WorkerService')} <b>holds</b> ${c('WorkerRepository')} · history <b>not sorted</b> by code · an extra row on Add · ${c('"Invalid number!"')}.</p>`, 'do2'),
      box('Passed — on that day', `<p style="margin:0">A lenient review is <b>not a template</b>: the same points were rejected in other labs.</p>`, 'lam')), 'r64') },

  /* 5 */
  { t: 'The clean design', body: tangLab({ h: 400, ten: { controller: 'WorkerController', repository: 'WorkerRepository', service: 'WorkerService', view: 'WorkerView', model: 'Worker · SalaryHistory', utils: 'Validation · FormatUtils', dto: 'WorkerRequestDTO · SalaryHistoryResponseDTO', constants: 'Message · Constants · enum SalaryStatus' } }) +
    `<div class="nho" style="text-align:center">The same classes as the passed version — the controller now holds the repository, the service holds nothing.</div>` },

  /* 6 */
  { t: 'Model: the history copies the salary', body: two(
    j(['public class Worker {', '    private String code;', '    private String name;', '    private int age;', '    private double salary;', '    private String workLocation;', '    private ArrayList<SalaryHistory> salaryHistoryList;', '    public Worker() { … }   // JavaBean', '    …', boChuThich(ham(`${S}/model/Worker.java`, 'addSalaryHistory')).split('\n').map((l) => '    ' + l).join('\n'), '}'].join('\n')),
    j(['public class SalaryHistory {', '    private double salary;   // AFTER the change', '    private SalaryStatus status;   // UP or DOWN', '    private LocalDate date;', '    public SalaryHistory() { }', '    …', '}', '', 'public enum SalaryStatus {', '    UP,', '    DOWN', '}'].join('\n'))) +
    box('JavaBeans, no rules', `<p style="margin:0">private fields, a public empty constructor, get/set (V10). The model adds a row; it does not decide "a salary must stay positive" — the service does.</p>`, 'ok') },

  /* 7 */
  { t: 'Repository: duplicate and missing codes', body: two(
    j(boChuThich(ham(`${S}/repository/WorkerRepository.java`, 'addWorker')) + '\n\n' + boChuThich(ham(`${S}/repository/WorkerRepository.java`, 'findWorker')), { max: 68 }),
    col(P(R(41, 41) + '\n' + R(49, 49), { title: 'real', sm: true }),
      box('Existence lives with the data', `<p style="margin:0">"Is W 1 taken?" is a question about what is stored — the lecturer moved this very check into ${c('TaskRepository')} in P0071.</p>`, 'ok'),
      box('Names', `<p style="margin:0">${c('HashMap<String, Worker> workerMap')} — concrete type, name ending in ${c('Map')}.</p>`, 'lam')), 'r64') },

  /* 8 */
  { t: 'Service: change a salary', body: two(
    j(boChuThich(ham(`${S}/service/WorkerService.java`, 'changeSalary')), { max: 70 }),
    col(P(R(75, 75) + '\n' + R(57, 57) + '\n' + R(83, 83), { title: 'real', sm: true }),
      box('Given, not fetched', `<p style="margin:0">the ${c('Worker')} comes from the controller · 2 parameters: the brief's ${c('changeSalary(status, code, amount)')} keeps its name, takes the DTO (V4).</p>`, 'ok')), 'r64') },

  /* 9 */
  { t: 'Service: the history, sorted by code', body: two(
    j(boChuThich(ham(`${S}/service/WorkerService.java`, 'getInfomationSalary')), { hl: [5, 6, 7, 8, 9, 10, 11, 12] }),
    col(P(R(91, 94).split('\n').map((l) => l.replace(/ {3,}/g, '  ')).join('\n'), { title: 'option 4 — real (date of the run → dd/MM/yyyy)', sm: true }),
      box('Sort workers, not rows', `<p style="margin:0">each worker's rows stay in time order — W 1 1100 before W 1 1500 — with one key. The name keeps the brief's spelling: ${c('getInfomationSalary')}.</p>`, 'lam')), 'r64') },

  /* 10 */
  { t: 'Controller and view', body: two(
    j(boChuThich(ham(`${S}/controller/WorkerController.java`, 'changeSalary')) + '\n\n' + boChuThich(ham(`${S}/controller/WorkerController.java`, 'displaySalaryHistory')), { max: 72 }),
    j(boChuThich(ham(`${S}/view/WorkerView.java`, 'display')).replace(/System\.out\.println\(String\.format\(Constants\.HEADER_FORMAT[\s\S]*?LABEL_DATE\)\);/, 'System.out.println(String.format(\n            Constants.HEADER_FORMAT, …labels…));'), { max: 50 }), 'r64') },

  /* 11 */
  { t: 'Main and Validation: ask again, field by field', body: two(
    j(boChuThich(ham(`${S}/main/Main.java`, 'inputWorker')) + '\n\n' + boChuThich(ham(`${S}/main/Main.java`, 'inputAge'))),
    col(P(R(33, 40), { title: 'Add — every field re-asked (real)', sm: true }),
      box('Why six small helpers', `<p style="margin:0">one ${c('inputText(sc, prompt, error)')} has <b>3 parameters</b> — the rule V4. Each case of the switch then calls the controller <b>once</b>.</p>`, 'lam')), 'r64') },

  /* 12 */
  { t: 'The real run, lint and JDK 8', body: two(
    P(R(15, 18) + '\n' + R(56, 57) + '\n' + R(64, 67) + '\n' + R(90, 94), { title: 'test keys — real output (prompts hidden)', sm: true }),
    col(psql(ra('l211-p0056/solution:lint'), { title: 'python3 lint.py' }),
      box('JDK 8 · paper', `<p style="margin:0">a real JDK 8 prints the same 101 lines · the 25 paper items: <b>0 violations</b>.</p>`, 'ok'),
      box('No auto-grader here', `<p style="margin:0">the date changes every day: type ${c('harness/input.txt')}, compare with ${c('man-hinh-mong-doi.txt')}.</p>`, 'lam')), 'r64') },

  /* 13 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['workerService, not service?', 'a variable is named after its class — the rename he asked for in this lab'],
    ['Why does the history copy the salary?', 'a row is a photo of one moment: 1100 then 1500, not 1500 twice'],
    ['Why a service in 70 LOC?', 'raise/lower, refuse ≤ 0, a sorted history — beyond CRUD; it gets the worker from the controller'],
    ['Where is "sort by id"?', `${c('getInfomationSalary')}: Collections.sort + Comparator on the code`],
    ['Decrease more than the salary?', 'computed first; ≤ 0 ⇒ the exception, nothing changes'],
    ['Why does changeSalary return String?', 'the controller only needs words for its message'],
  ]), giua: true },
]);
