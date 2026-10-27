/**
 * pro-l211-p0021 — PRO192 · 🎓 LAB211 thực chiến · L.2 "J1.L.P0021 Student Management" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0021 (bản sửa theo thầy + soát
 * checklist 0 vi phạm: lint.py ✓ sạch, check PASS 181/181, JDK 8 thật trùng máy). Không mã sinh viên.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0021.mjs --out <dir>   ⇒ <dir>/l211-p0021/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, soDoLop, boc, PG, NAU, XANH, CAM, TIM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0021', code: 'PRO192 · LAB211 P0021', title: 'LAB211 · J1.L.P0021 — Student Management', sub: 'Long assignment · Comparator · report · update/delete · a service without repository' };

const S = 'l211-p0021/solution/src';
const j = (src, o = {}) => sql(boc(src, o.max || 60), { lang: 'java', sm: true, ...o });
const gon = (t) => t.split('\n').map((l) => l.replace(/ {3,}/g, '  ')).join('\n');
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const NHAC = /^(?:Your choice: |Student Name: |Enter id: |Enter Semester: |Enter your choice: |Do you want to continue \(Y\/N\)\? |Select record number \(No\.\) to modify: |Do you want to update \(U\) or delete \(D\) student: |Enter new Semester: |Only three courses:)+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(NHAC, '')).filter((x) => !/^[123]\. (Java|\.Net|C\/C\+\+)$/.test(x) && x.trim()).join('\n');
const R = (a, b) => boNhac(ra('l211-p0021/solution:run', [a, b]));

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.2 · P0021' }, [
  /* 1 */
  { cover: true, t: 'J1.L.P0021 —<br>Student Management', sub: 'Long assignment · 350 LOC, graded by % done · Comparator · a grouped report · update/delete · the lecturer\'s layering all the way' },

  /* 2 */
  { t: 'The brief', body: two(
    tbl(['Menu', 'What it does'], [
      ['1 Create', 'at least <b>10</b> students; from the 10th: <b>Y/N</b>'],
      ['2 Find and Sort', 'name or part of a name · <b>sorted by name</b>'],
      ['3 Update/Delete', 'by ID · <b>U</b> update or <b>D</b> delete'],
      ['4 Report', '"Name | Course | Total"'],
      ['5 Exit', ''],
    ]),
    col(box('A student', `<p style="margin:0">ID · Student Name · Semester · Course Name — and only three courses: <b>Java</b>, <b>.Net</b>, <b>C/C++</b>.</p>`, 'lam'),
      box('Graded by percentage', `<p style="margin:0">A Long Assignment: each function counts. The first version earned about half — the deviations of the next slide were the missing half.</p>`, 'do2')), 'r46'), giua: true },

  /* 3 */
  { t: 'What the brief imposes', body: tbl(['The brief', 'Where', 'First version'], [
    [`${c('Collections.sort()')} + overwrite ${c('compare()')} of ${c('Comparator')}`, `anonymous ${c('Comparator')} in ${c('sortByName')}`, `✗ ${c('Comparable')}`],
    [`an ${c('ArrayList')} of students`, c('StudentRepository.studentList'), '✓'],
    ['"Do you want to continue (Y/N)?"', c('Message.INPUT_YN'), '✗ own text'],
    ['"Do you want to update (U) or delete (D) student"', c('Message.INPUT_UD'), '✗ "(U) Update or (D) Delete?"'],
    ['Java · .Net · C/C++', c('enum ProgrammingLanguage'), `✗ ${c('JAVA')}, ${c('.NET')}`],
    ['"Nguyen Van A | Java | 2"', c('REPORT_FORMAT = "%s | %s | %d"'), '✗ a table, random order'],
  ]) + box('Fix the brief first', `<p style="margin:0">Seven deviations were visible with the keyboard alone — the lecturer types keys at gate 5. Then the paper checklist.</p>`, 'lam'), giua: true },

  /* 4 */
  { t: 'Why Student holds a list of Enrollment', body: soDoLop([
    { id: 'S', ten: 'Student', x: 20, y: 20, w: 470, mau: XANH, tr: ['- id : String', '- studentName : String', '- enrollmentList : ArrayList<Enrollment>'], pt: ['+ addEnrollment(e : Enrollment)', '+ isDuplicated(e, ignoreIndex) : boolean'] },
    { id: 'E', ten: 'Enrollment', x: 600, y: 20, w: 420, mau: XANH, tr: ['- semester : String', '- course : ProgrammingLanguage'] },
    { id: 'P', ten: 'ProgrammingLanguage', kieu: 'enumeration', x: 600, y: 170, w: 420, mau: TIM, tr: ['JAVA("Java")', 'DOT_NET(".Net")', 'C_CPP("C/C++")'] },
  ], [{ tu: 'S', den: 'E', kieu: 'dung', nhan: '1..*', dy: -12, dx: -10 }, { tu: 'E', den: 'P', kieu: 'dung', nhan: 'course' }], { h: 340 }) + two(
    box('What it buys', `<p style="margin:0">the name is stored <b>once</b> · "same semester + course twice" is checked <b>inside</b> one student · the report counts enrollments per course.</p>`, 'ok'),
    box('Be ready to defend it', `<p style="margin:0">The brief lists four fields on Student. If the lecturer wants the flat class, <b>ask before changing</b> — the service changes too.</p>`, 'lam')) },

  /* 5 */
  { t: 'The layers: who calls whom', body: luong([
    ['Main', 'inputStudent\n→ 1 call', PG],
    ['StudentRepository', 'findById(id)\nnull if new', XANH],
    ['StudentService', 'addEnrollment\n(student, dto)', CAM],
    ['StudentRepository', 'save(student)', XANH],
    ['StudentView', 'display()\nonce', PG],
  ], { h: 190, fs: 15 }) + two(
    j(boChuThich(ham(`${S}/controller/StudentController.java`, 'saveEnrollment')).replace('studentRepository.save(studentService.addEnrollment(\n            studentRepository.findById(studentDTO.getId()), studentDTO));', 'studentRepository.save(\n        studentService.addEnrollment(\n            studentRepository.findById(studentDTO.getId()),\n            studentDTO));')),
    box('Three layers, no model in the controller', `<p style="margin:0">The controller chains the calls: the ${c('Student')} goes from the repository into the service and back, and the controller never names its type — no ${c('import model.*')}.</p>`, 'ok')) },

  /* 6 */
  { t: 'Model: one rule lives in Student', body: two(
    j(boChuThich(ham(`${S}/model/Student.java`, 'isDuplicated')).replace('public boolean isDuplicated(Enrollment newEnrollment, int ignoreIndex) {', 'public boolean isDuplicated(Enrollment newEnrollment,\n        int ignoreIndex) {').replace(/\(enrollment\.getSemester\(\)\.equalsIgnoreCase\(newEnrollment\.getSemester\(\)\)\) &&/, '(enrollment.getSemester()\n                    .equalsIgnoreCase(newEnrollment.getSemester())) &&').replace('(enrollment.getCourse().equals(newEnrollment.getCourse()))) {', '(enrollment.getCourse()\n                    .equals(newEnrollment.getCourse()))) {')),
    col(box('ignoreIndex', `<p style="margin:0">When updating record 2, record 2 itself must not count as a duplicate: skip position ${c('ignoreIndex')}. Adding uses ${c('-1')} (skip nothing).</p>`, 'lam'),
      box('3.5 — objects with equals', `<p style="margin:0">semester: ${c('equalsIgnoreCase')} ("fall2022" = "Fall2022") · course: ${c('equals')} on the enum · parentheses around each test (3.3).</p>`, 'ok')), 'r64') },

  /* 7 */
  { t: 'Repository: the list and its CRUD', body: two(
    j(boChuThich(ham(`${S}/repository/StudentRepository.java`, 'findByName')).replace('if (student.getStudentName().toLowerCase().contains(name.toLowerCase())) {', 'if (student.getStudentName().toLowerCase()\n            .contains(name.toLowerCase())) {') + '\n\n' + boChuThich(ham(`${S}/repository/StudentRepository.java`, 'save')) + '\n\n' + boChuThich(ham(`${S}/repository/StudentRepository.java`, 'deleteStudent'))),
    col(tbl(['Method', 'Returns'], [[c('findById(id)'), 'Student or null'], [c('findByName(name)'), c('ArrayList<Student>')], [c('save(student)'), 'adds if new'], [c('deleteStudent(s)'), '—'], [c('getAllStudents()'), 'the list']]),
      box('Before', `<p style="margin:0">the service removed students with ${c('getAllStudents().remove(s)')} — editing the repository's list from outside.</p>`, 'do2')), 'r64') },

  /* 8 */
  { t: 'Service: add an enrollment', body: two(
    j(boChuThich(ham(`${S}/service/StudentService.java`, 'addEnrollment')).replace('public Student addEnrollment(Student student, StudentDTO studentDTO) throws Exception {', 'public Student addEnrollment(Student student,\n        StudentDTO studentDTO) throws Exception {').replace('} else if (!student.getStudentName().equalsIgnoreCase(studentDTO.getStudentName())) {', '} else if (!student.getStudentName()\n        .equalsIgnoreCase(studentDTO.getStudentName())) {')),
    col(P(R(74, 83), { title: 'real: s1 typed with another name, then a duplicate', sm: true }),
      box('Data in, decision out', `<p style="margin:0">The service decides on the ${c('Student')} the controller brought — it never fetches it. It returns the student so the controller can save a new one.</p>`, 'ok')), 'r64') },

  /* 9 */
  { t: 'Service: sort with a Comparator, then renumber', body: two(
    j(boChuThich(ham(`${S}/service/StudentService.java`, 'sortByName')).replace('public ArrayList<ResponseDTO> sortByName(ArrayList<Student> studentList) {', 'public ArrayList<ResponseDTO> sortByName(\n        ArrayList<Student> studentList) {').replace('return first.getStudentName().compareTo(second.getStudentName());', 'return first.getStudentName()\n                    .compareTo(second.getStudentName());'), { hl: [8, 9, 10, 11, 12, 13, 14] }),
    col(P(gon(R(28, 39)), { title: 'option 2, "a" — real (spaces shortened)', sm: true }),
      box('After, not before', `<p style="margin:0">The first version numbered the rows <b>before</b> sorting: No. came out 11, 10, … Number them after ${c('Collections.sort')}.</p>`, 'do2')), 'r64') },

  /* 10 */
  { t: 'Service: the report with a LinkedHashMap', body: two(
    j(boChuThich(ham(`${S}/service/StudentService.java`, 'buildReport')).split('\n').slice(0, 13).join('\n') + '\n\n    // then one ResponseDTO per entry: name | course | total\n    …\n    return reportList;\n}', { max: 70 }),
    col(P(R(8, 20), { title: 'option 4 — real', sm: true }),
      box('Why LinkedHashMap', `<p style="margin:0">keeps the order of first insertion: the same report every run. A ${c('HashMap')} printed it in an order that moved with the data.</p>`, 'ok')), 'r64') },

  /* 11 */
  { t: 'View: one display() per flow', body: two(
    j(boChuThich(ham(`${S}/view/StudentView.java`, 'display')).replace('System.out.println(Message.TITLE_REPORT);', 'System.out.println(\n            Message.TITLE_REPORT);').replace('System.out.println(String.format(Constants.TABLE_FORMAT, Message.COLUMN_NO,\n                    Message.COLUMN_NAME, Message.COLUMN_SEMESTER, Message.COLUMN_COURSE));', 'System.out.println(String.format(\n            Constants.TABLE_FORMAT, Message.COLUMN_NO,\n            Message.COLUMN_NAME, Message.COLUMN_SEMESTER,\n            Message.COLUMN_COURSE));'), { max: 44 }),
    col(vsd(j(['if (empty) {', '    view.setMessage(…);', '    view.printMessage();', '} else {', '    view.setData(rows);', '    view.printStudents();', '}'].join('\n')),
      j(['if (empty) {', '    view.setMessage(…);', '} else {', '    view.setResponseList(rows);', '}', '', 'view.display();'].join('\n')), '✗ 2 renders', '✓ 1 render'),
      box('soat_checklist 1.1', `<p style="margin:0">"rendering chỉ được gọi 1 lần cho 1 luồng" — three controller methods were flagged; now each ends with one ${c('display()')}.</p>`, 'lam')), 'r46') },

  /* 12 */
  { t: 'Main: one controller call per flow', body: two(
    j(boChuThich(ham(`${S}/main/Main.java`, 'processAdd')).replace('private static void processAdd(Scanner sc, StudentController studentController) {', 'private static void processAdd(Scanner sc,\n        StudentController studentController) {')),
    col(box('Create — before: 3 calls', `<p style="margin:0">${c('findStudentName')}, ${c('addStudent')}, ${c('countStudents')}. Now ${c('addStudent')} <b>returns the count</b>: one call, and Main knows when to ask Y/N.</p>`, 'do2'),
      box('Update/Delete', `<p style="margin:0">one pre-check ${c('showRecords')} prints the records — you cannot pick a number without seeing them — then the action U/D goes into the DTO and <b>one</b> ${c('updateOrDeleteStudent(dto)')}.</p>`, 'ok')), 'r64'), giua: true },

  /* 13 */
  { t: 'The real run, lint and JDK 8', body: two(
    P(R(115, 125) + '\n' + R(141, 141) + '\n' + R(151, 151), { title: 'option 3 — out of range, wrong letter, duplicate, then update and delete (real)', sm: true }),
    col(psql(ra('l211-p0021/solution:lint'), { title: 'python3 lint.py' }), psql(ra('l211-p0021/solution:check'), { title: './check.sh — 54 keys' }),
      box('JDK 8 · paper', `<p style="margin:0">a real JDK 8 prints the same 181 lines · the 25 paper items: <b>0 violations</b>.</p>`, 'ok')), 'r64') },

  /* 14 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['Comparator vs Comparable?', 'Comparable: the class compares itself, one fixed rule · Comparator: a rule you pass in (Strategy)'],
    ['Why Enrollment?', 'one student, many (semester, course) · name once · duplicates checked inside'],
    ['Why a service?', 'duplicates, sorting, a grouped report — business work beyond CRUD'],
    ['How is the report counted?', `key "name#course", ${c('getOrDefault(key, 0) + 1')}, LinkedHashMap keeps order`],
    ['Two prints in Update/Delete?', 'a pre-check to choose a record, then the result · one display() per method'],
    ['Why does addStudent return int?', 'Main needs the count for Y/N — one call instead of two'],
  ]), giua: true },
]);
