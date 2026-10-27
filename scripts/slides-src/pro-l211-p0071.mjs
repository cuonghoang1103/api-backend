/**
 * pro-l211-p0071 — PRO192 · 🎓 LAB211 thực chiến · L.5 "J1.S.P0071 Task Management" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 đợt 2, 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0071 (bản ĐÃ SỬA theo thầy:
 * KHÔNG service, kiểm ID ở TaskRepository, câu lỗi tiếng Việt; lint.py ✓ sạch, 25 mục 0 vi phạm, JDK 8 thật trùng, PASS 99/99;
 * bay/truoc-khi-sua = bản thầy review, ẩn tên: lint 343 vi phạm + crash "date must not be null" THẬT).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0071.mjs --out <dir>   ⇒ <dir>/l211-p0071/NNN.webp
 */
import { lamDeck, sql, psql, two, box, tbl, c, vsd } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, boc, PG, XANH, CAM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0071', code: 'PRO192 · LAB211 P0071', title: 'LAB211 · J1.S.P0071 — Task Management', sub: 'No service · the repository checks the ID · every message says what to type' };

const S = 'l211-p0071/solution/src';
const B = 'l211-p0071/bay/truoc-khi-sua/src';
const j = (src, o = {}) => sql(boc(src, o.max || 60), { lang: 'java', sm: true, ...o });
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const R = (a, b) => ra('l211-p0071/solution:run', [a, b]);
const gon = (t) => t.split('\n').map((l) => l.replace(/ {3,}/g, '  ')).join('\n');

/* Hình: trục giờ 8.0 … 17.5, bước 0.5 — From tối đa 17.0, To ≥ From + 0.5 */
function hinhGio() {
  const W = 1110, h = 200, x0 = 40, x1 = 1070;
  const X = (g) => x0 + ((g - 8) / 9.5) * (x1 - x0);
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial">`;
  s += `<line x1="${x0}" y1="90" x2="${x1}" y2="90" stroke="#555" stroke-width="3"/>`;
  for (let g = 8; g <= 17.5; g += 0.5) {
    const tron = g % 1 === 0;
    s += `<line x1="${X(g)}" y1="${tron ? 76 : 82}" x2="${X(g)}" y2="${tron ? 104 : 98}" stroke="#555" stroke-width="${tron ? 2.5 : 1.5}"/>`;
    if (tron || g === 17.5) s += `<text x="${X(g)}" y="128" font-size="17" text-anchor="middle" font-family="Menlo,monospace">${g.toFixed(1)}</text>`;
  }
  s += `<rect x="${X(8) - 6}" y="30" width="${X(17) - X(8) + 12}" height="28" rx="8" fill="${PG}22" stroke="${PG}" stroke-width="2"/>` +
    `<text x="${(X(8) + X(17)) / 2}" y="50" font-size="17" text-anchor="middle" fill="${PG}" font-weight="700">From: 8.0 … 17.0 (leave room for To)</text>`;
  s += `<rect x="${X(9.5) - 6}" y="146" width="${X(17.5) - X(9.5) + 12}" height="28" rx="8" fill="${CAM}22" stroke="${CAM}" stroke-width="2"/>` +
    `<text x="${(X(9.5) + X(17.5)) / 2}" y="166" font-size="17" text-anchor="middle" fill="${CAM}" font-weight="700">To after From = 9.0: 9.5 … 17.5</text>`;
  s += `<circle cx="${X(9)}" cy="90" r="9" fill="${XANH}"/><text x="${X(9)}" y="194" font-size="16" text-anchor="middle" fill="${XANH}" font-weight="700">9.7 ✗ (not .0/.5)</text>`;
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.5 · P0071' }, [
  /* 1 */
  { cover: true, t: 'J1.S.P0071 —<br>Task Management', sub: 'Short assignment · 150 LOC · the version the lecturer reviewed: "every error in Vietnamese, say what to type" and "no service"' },

  /* 2 */
  { t: 'The brief', body: two(
    col(tbl(['Field', 'Rule'], [['Requirement Name', 'not empty'], ['Task Type', '1 Code · 2 Test · 3 Design · 4 Review'], ['Date', '<b>dd-MM-yyyy</b>, a real date'], ['From / To', '<b>8.0 … 17.5</b>, step 0.5, From &lt; To'], ['Assignee / Reviewer', 'a name'], ['ID', '<b>last ID + 1</b>']]),
      box('Methods the brief names', `<p style="margin:0">${c('addTask')} (returns the id) · ${c('deleteTask')} (the ID must exist) · ${c('getDataTasks')} (ascending by ID).</p>`, 'lam')),
    P(R(1, 6), { title: 'the screen (real) — 3 on an empty list', sm: true }), 'r64'), giua: true },

  /* 3 */
  { t: 'Plan time, by hand', body: hinhGio() + two(
    box('From depends on nothing, To depends on From', `<p style="margin:0">From is asked in [8.0, 17.0]; To in [From + 0.5, 17.5]. The second range is computed <b>from the first answer</b> — so Main passes ${c('planFrom')} to ${c('getPlanTo')}.</p>`, 'lam'),
    box('Time = To − From', `<p style="margin:0">8.0 → 16.0 gives <b>8.0</b>; 8 → 9 gives <b>1.0</b>. Computed when the table row is built — a number, not stored.</p>`, 'ok')) },

  /* 4 */
  { t: 'What the lecturer said in review', body: two(
    col(box('(a) Every error message in Vietnamese', `<p style="margin:0">say <b>what</b> is wrong and <b>what to type</b> — not ${c('"Invalid!"')}, not ${c('"Please input number in a range…"')}.</p>`, 'do2'),
      box('(b) No service', `<p style="margin:0">the lab had no package ${c('service')} — but the controller still did a service's job: it called ${c('findById')}, got a <b>model</b> ${c('Task')} back, and decided.</p>`, 'do2'),
      P(ra('l211-p0071/bay/truoc-khi-sua:lint', [1, 1]) + '\n  195 COMMENT · 48 HARDCODE · 30 STATIC · 26 FIELD\n$ python3 soat_checklist.py …\n== 31 VI PHAM', { title: 'the reviewed version (names hidden) — real', sm: true })),
    j(boChuThich(ham(`${B}/controller/Controller.java`, 'deleteTask')), { max: 44 }), 'r64') },

  /* 5 */
  { t: 'A real crash: Enter on Date', body: two(
    j(boChuThich(ham(`${B}/utils/Validation.java`, 'getDate')), { max: 58 }),
    col(P(ra('l211-p0071/bay/truoc-khi-sua:run', [30, 31]).replace(/ {3,}/g, '  '), { title: 'reviewed version: Add with an empty Date, then 3 (real)', sm: true }),
      box('null slips through', `<p style="margin:0">${c('input.isEmpty()')} returns ${c('null')} — no error, the task is added. The crash comes later, in a different flow: ${c('format(null)')} while printing the table.</p>`, 'do2'),
      box('Fixed', `<p style="margin:0">an empty line is a <b>wrong date</b>: ${c('parse("")')} throws, Main asks again.</p>`, 'ok')), 'r64') },

  /* 6 */
  { t: 'What the test keys found', body: tbl(['Typed', 'Reviewed version', 'Fixed'], [
    [c('26-06-2015abc') + ' · ' + c('1-2-2015'), 'accepted (parse reads the start only)', 'refused: format it back, compare with the text'],
    [c('"   "') + ' as Assignee', 'accepted (regex has \\s)', 'trim first, then the regex'],
    [c('" 1"') + ' as Task Type', c('Invalid!'), 'accepted: ' + c('trim()')],
    ['a long name', 'columns glued, an empty line between rows', 'one ' + c('TABLE_FORMAT') + ' for header and rows, no ' + c('\\n')],
    ['To on a Vietnamese Windows', c('10,0 -> 17,5'), c('%s') + ' prints ' + c('10.0')],
    ['every error', c('Invalid!') + ', ' + c('Must be x.0 or x.5'), 'a Vietnamese sentence in ' + c('Message')],
  ], { hl: [0] }), giua: true },

  /* 7 */
  { t: 'The clean design: no service', body: luong([
    ['Main', 'input + Validation\none call per case', PG],
    ['TaskController', 'DTO in,\nmessage out', CAM],
    ['TaskRepository', 'add · delete\n(ID exists?) · getDataTasks', XANH],
    ['TaskView', 'display()\nonce', PG],
  ], { h: 170, fs: 16 }) + two(
    box('Existence lives with the data', `<p style="margin:0">"is there a task with ID 99?" is answered by the repository, which throws. The controller never touches ${c('Task')} — no ${c('import model.*')}.</p>`, 'ok'),
    box('Names after the class', `<p style="margin:0">${c('Controller')} → ${c('TaskController')}, ${c('control')} → ${c('taskController')}, ${c('getAllTasks')} → ${c('getDataTasks')} (the brief's name).</p>`, 'lam')) },

  /* 8 */
  { t: 'Model and the enum TaskType', body: two(
    j(['public class Task {', '    private int id;', '    private TaskType taskType;', '    private String requirementName;', '    private Date date;', '    private double planFrom;', '    private double planTo;', '    private String assign;', '    private String reviewer;', '    public Task() { }   // JavaBean', '    … get / set …', '}'].join('\n')),
    col(j(boChuThich(ham(`${S}/constants/TaskType.java`, 'getTaskTypeById')), { max: 44 }),
      box('A loop, not a switch on 1..4', `<p style="margin:0">the old ${c('switch')} had four magic numbers. The loop compares each constant's ${c('getId()')} — a fifth type would need one line in the enum.</p>`, 'ok')), 'r64') },

  /* 9 */
  { t: 'Repository: add, delete, the table', body: two(
    col(j(boChuThich(ham(`${S}/repository/TaskRepository.java`, 'addTask')), { max: 64 }),
      j(boChuThich(ham(`${S}/repository/TaskRepository.java`, 'deleteTask')), { max: 70 })),
    col(P(R(74, 76), { title: 'real — Delete: abc, 0, 99', sm: true }),
      box('findById is private', `<p style="margin:0">only the repository looks a task up. Outside, ${c('deleteTask')} either works or throws the sentence the view will print.</p>`, 'ok'),
      box('ID = last + 1', `<p style="margin:0">${c('lastId')} keeps growing: delete 2, add again ⇒ 3, never 2 twice.</p>`, 'lam')), 'r64') },

  /* 10 */
  { t: 'Validation: a real date, a half hour', body: two(
    col(j(boChuThich(ham(`${S}/utils/Validation.java`, 'getDate')), { max: 64 }),
      box('Format it back', `<p style="margin:0">${c('setLenient(false)')} refuses 31-02; comparing ${c('format(date)')} with the text refuses ${c('1-2-2015')} and ${c('26-06-2015abc')}.</p>`, 'ok')),
    j(boChuThich(ham(`${S}/utils/Validation.java`, 'getDouble')), { max: 52 }), 'r64') },

  /* 11 */
  { t: 'Controller and view: print once', body: two(
    col(j(boChuThich(ham(`${S}/controller/TaskController.java`, 'deleteTask')), { max: 64 }),
      j(boChuThich(ham(`${S}/controller/TaskController.java`, 'displayTasks')), { max: 64 })),
    col(j(boChuThich(ham(`${S}/view/TaskView.java`, 'display')).replace(/System\.out\.println\(String\.format\(Constants\.TABLE_FORMAT[\s\S]*?COLUMN_REVIEWER\)\);/, 'System.out.println(String.format(\n        Constants.TABLE_FORMAT, …labels…));'), { max: 46 }),
      box('One display()', `<p style="margin:0">the old controller called ${c('printMessage')} OR ${c('printTask')} — two render methods. Now: a message, or the table, by the same ${c('display()')}.</p>`, 'lam')), 'r64') },

  /* 12 */
  { t: 'Main: one call per case', body: two(
    col(j(boChuThich(ham(`${S}/main/Main.java`, 'inputTaskData')), { max: 66 }),
      box('No static Scanner, no System.exit', `<p style="margin:0">${c('Scanner scanner')} is local to ${c('main')} and passed to each helper; option 4 sets ${c('isRunning = false')}. Every helper ≤ 2 parameters.</p>`, 'ok')),
    j(boChuThich(ham(`${S}/main/Main.java`, 'getPlanTo')), { max: 44 }), 'r64') },

  /* 13 */
  { t: 'The real run, lint, JDK 8, PASS', body: two(
    P(R(13, 13) + '\n' + R(34, 35).split('\n').slice(0, 1).join('\n') + '\n' + R(38, 39) + '\n' + R(42, 42) + '\n…\n' + gon(R(64, 67)), { title: 'test keys — real output', sm: true }),
    col(psql(ra('l211-p0071/solution:lint'), { title: 'python3 lint.py' }),
      psql(ra('l211-p0071/solution:check'), { title: './check.sh' }),
      box('JDK 8 · paper', `<p style="margin:0">a real JDK 8 prints the same 99 lines · the 25 paper items: <b>0 violations</b>.</p>`, 'ok')), 'r64') },

  /* 14 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['No service — where is "the ID exists"?', `${c('TaskRepository.deleteTask')}: only the store knows what it holds; the controller never touches a model`],
    ['Why is 26-06-2015abc refused?', `parse reads the start only; ${c('format(date).equals(text)')} catches the rest`],
    ['Why %s and not %.1f in the hour message?', `${c('%.1f')} follows the machine's language (10,0); a double through ${c('%s')} is always 10.0`],
    ['Why does the view not take the message as a parameter?', 'the paper: the view receives through attributes, prints once per flow'],
    ['Why is the Scanner not static?', 'the Guide forbids static variables; a local Scanner passed to the helpers'],
    ['Why getDataTasks?', 'the brief names it — keep the brief\'s names'],
  ]), giua: true },
]);
