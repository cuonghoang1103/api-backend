/**
 * FER202 · Chương 3 (JSX & Rendering) — LAB 3: Class Report Card.
 * Bám Exercise 4 (JSX & ES6 — array-method lab) nhưng sâu hơn: chỉ RENDER (chưa state) — biểu thức trong JSX,
 * danh sách + key, render có điều kiện (&&, ?:, hàm), Fragment có key, map/filter/reduce/sort trên bản sao,
 * style object + className động, JSX tự escape chuỗi (không dangerouslySetInnerHTML).
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// src/data/classData.js — đã cho (scores: 4 bài, null = vắng thi)
export const CLASS_INFO = { code: 'SE1801', subject: 'FER202', semester: 'Spring 2026', teacher: 'Ms. Hoa' };

const students = [
  { id: 1, name: 'Nguyen Van An', scores: [9, 9.5, 8.5, 10], note: '<b>Excellent</b> work' },
  { id: 2, name: 'Tran Thi Binh', scores: [7, 8, 6.5, 7.5], note: 'Good progress' },
  { id: 3, name: 'Le Hoang Cuong', scores: [5, 4.5, 6, 5.5], note: 'Needs more practice' },
  { id: 4, name: 'Pham Minh Duc', scores: null, note: 'Absent from the final' },
  { id: 5, name: 'Vo Thu Em', scores: [9.5, 9, 9, 9.5], note: 'Top of the class' },
  { id: 6, name: 'Do Gia Huy', scores: [3, 4, 2.5, 3.5], note: 'Must retake' },
  { id: 7, name: 'Bui Lan Khanh', scores: [8, 8.5, 9, 9], note: 'Very consistent' },
  { id: 8, name: 'Hoang Mai Linh', scores: [6, 7, 7.5, 6.5], note: 'Improving' },
];

export default students;
`;

const CSS = `/* src/index.css — đã cho */
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.report { max-width: 980px; margin: 0 auto; padding: 20px; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
.badge { display: inline-block; min-width: 24px; text-align: center; border-radius: 6px; padding: 2px 6px; color: #fff; font-weight: 700; }
.grade-A { background: #16a34a; } .grade-B { background: #2563eb; } .grade-C { background: #0891b2; }
.grade-D { background: #d97706; } .grade-F { background: #dc2626; }
.scholar { margin-left: 6px; font-size: 12px; color: #a16207; }
.panels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; margin: 0; }
dd { margin: 0; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const UTILS = `// src/utils/grades.js — hàm THUẦN tính toán (không JSX) ⇒ component chỉ lo hiển thị
export const average = (scores) => (scores ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null);

export function gradeOf(avg) {
  if (avg === null) return null;
  if (avg >= 8.5) return 'A';
  if (avg >= 7) return 'B';
  if (avg >= 5.5) return 'C';
  if (avg >= 4) return 'D';
  return 'F';
}

// thêm trường suy ra (avg, grade) — tạo object MỚI, không sửa dữ liệu gốc
export const withResults = (students) => students.map((s) => {
  const avg = average(s.scores);
  return { ...s, avg, grade: gradeOf(avg) };
});
`;

const BADGE = `// src/components/GradeBadge.js — component nhỏ nhận props
export default function GradeBadge({ grade }) {
  return <span className={´badge grade grade-@{grade}´}>{grade}</span>;
}
`;

const ROW = `// src/components/StudentRow.js — một hàng: render có điều kiện bằng ?:, && và style object
import GradeBadge from './GradeBadge';

const FAIL_STYLE = { color: 'rgb(220, 38, 38)', fontWeight: 700 }; // style là OBJECT camelCase, không phải chuỗi CSS

export default function StudentRow({ no, student }) {
  const { name, avg, grade, note } = student;
  const absent = avg === null;
  const fail = !absent && avg < 5;
  return (
    <tr className={´student-row@{fail ? ' fail' : ''}´}>
      <td>{no}</td>
      <td className="s-name">{name}</td>
      <td className="s-avg" style={fail ? FAIL_STYLE : undefined}>
        {absent ? <span className="absent">N/A</span> : avg.toFixed(1)}
      </td>
      <td>
        {absent ? '—' : <GradeBadge grade={grade} />}
        {!absent && avg >= 9 && <span className="scholar">★ Scholarship</span>}
      </td>
      {/* JSX TỰ escape chuỗi: "<b>…</b>" trong dữ liệu hiện ra đúng là chữ, không thành thẻ HTML */}
      <td className="note">{note}</td>
    </tr>
  );
}
`;

const SUMMARY = `// src/components/Summary.js — Fragment: trả về nhiều phần tử (dt + dd) mà KHÔNG bọc thêm thẻ nào
import { Fragment } from 'react';

export default function Summary({ items }) {
  return (
    <dl id="summary">
      {items.map(({ label, value }) => (
        // trong danh sách, Fragment cần key ⇒ viết <Fragment key>, không viết được <> key</>
        <Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
`;

const APP = `// src/App.js — tính mọi con số bằng map/filter/reduce/sort ngay khi render (chưa cần state)
import students from './data/classData';
import { CLASS_INFO } from './data/classData';
import { withResults } from './utils/grades';
import StudentRow from './components/StudentRow';
import Summary from './components/Summary';

const GRADES = ['A', 'B', 'C', 'D', 'F'];

export default function App() {
  const rows = withResults(students);
  const present = rows.filter((s) => s.avg !== null);
  const classAvg = present.reduce((sum, s) => sum + s.avg, 0) / present.length;
  const passRate = Math.round((present.filter((s) => s.avg >= 5).length / present.length) * 100);

  // sort trên BẢN SAO; bằng điểm ⇒ theo tên A → Z
  const top3 = [...present].sort((a, b) => b.avg - a.avg || a.name.localeCompare(b.name)).slice(0, 3);

  // reduce thành object đếm { A: 3, B: 1, ... }
  const dist = present.reduce((acc, s) => ({ ...acc, [s.grade]: (acc[s.grade] || 0) + 1 }), {});

  return (
    <main className="report">
      <h1 id="report-title">Report — {CLASS_INFO.code} ({CLASS_INFO.semester})</h1>
      <p id="report-sub">{CLASS_INFO.subject} · Teacher: {CLASS_INFO.teacher} · {rows.length} students</p>

      <table id="report-table">
        <thead>
          <tr><th>No</th><th>Student</th><th>Average</th><th>Grade</th><th>Note</th></tr>
        </thead>
        <tbody>
          {rows.map((s, i) => <StudentRow key={s.id} no={i + 1} student={s} />)}
        </tbody>
      </table>

      <div className="panels">
        <section>
          <h3>Top 3</h3>
          <ol id="top-3">{top3.map((s) => <li key={s.id}>{s.name} — {s.avg.toFixed(1)}</li>)}</ol>
        </section>
        <section>
          <h3>Summary</h3>
          <Summary
            items={[
              { label: 'Class average', value: classAvg.toFixed(1) },
              { label: 'Pass rate', value: ´@{passRate}%´ },
              { label: 'Absent', value: rows.length - present.length },
            ]}
          />
        </section>
        <section>
          <h3>Grades</h3>
          <p id="grade-dist">{GRADES.map((g) => ´@{g}: @{dist[g] || 0}´).join(' · ')}</p>
        </section>
      </div>
    </main>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_APP = `// src/App.js — STARTER: dữ liệu đã nạp, chưa hiển thị gì
import students, { CLASS_INFO } from './data/classData';

export default function App() {
  // TODO: #report-title, #report-table (StudentRow), #top-3, #summary (Fragment), #grade-dist
  return (
    <main className="report">
      <h1>Report</h1>
      <p>{students.length} students in {CLASS_INFO.code}</p>
    </main>
  );
}
`;
const S_UTILS = `// src/utils/grades.js — STARTER
export const average = (scores) => 0; // TODO: trung bình, null khi vắng
export const gradeOf = (avg) => 'F'; // TODO: A ≥ 8.5 · B ≥ 7 · C ≥ 5.5 · D ≥ 4 · F
export const withResults = (students) => students; // TODO: thêm avg + grade (object mới)
`;
const S_ROW = `// src/components/StudentRow.js — STARTER
export default function StudentRow({ no, student }) {
  // TODO: .student-row(.fail) · .s-name · .s-avg (1 chữ số, N/A khi vắng) · badge · ★ Scholarship · .note
  return null;
}
`;
const S_SUMMARY = `// src/components/Summary.js — STARTER
export default function Summary({ items }) {
  // TODO: <dl id="summary"> với cặp <dt>/<dd> — dùng Fragment, không bọc <div>
  return null;
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/classData.js': DATA, 'src/components/GradeBadge.js': BADGE };
const LOI_GIAI = { 'src/App.js': APP, 'src/utils/grades.js': UTILS, 'src/components/StudentRow.js': ROW, 'src/components/Summary.js': SUMMARY, ...CHUNG };
const KHOI_DAU = { 'src/App.js': S_APP, 'src/utils/grades.js': S_UTILS, 'src/components/StudentRow.js': S_ROW, 'src/components/Summary.js': S_SUMMARY, ...CHUNG };

const NAMES = ['Nguyen Van An', 'Tran Thi Binh', 'Le Hoang Cuong', 'Pham Minh Duc', 'Vo Thu Em', 'Do Gia Huy', 'Bui Lan Khanh', 'Hoang Mai Linh'];
const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'Title built from CLASS_INFO', kiem: 'text', selector: '#report-title', giaTri: 'Report — SE1801 (Spring 2026)' },
  { nhom: 'f1', moTa: 'Subtitle with subject, teacher and student count', kiem: 'text', selector: '#report-sub', giaTri: 'FER202 · Teacher: Ms. Hoa · 8 students' },
  // f2
  { nhom: 'f2', moTa: '8 .student-row rows in data order', kiem: 'danh-sach-text', selector: '.student-row .s-name', mongDoi: NAMES },
  { nhom: 'f2', moTa: 'Averages with 1 decimal', kiem: 'danh-sach-text', selector: '.s-avg', mongDoi: ['9.3', '7.3', '5.3', 'N/A', '9.3', '3.3', '8.6', '6.8'] },
  { nhom: 'f2', an: true, moTa: 'No column numbering from 1', kiem: 'text', selector: '.student-row:last-child td:first-child', giaTri: '8' },
  // f3
  { nhom: 'f3', moTa: 'Grade badges A/B/D/A/F/A/C (absent shows —)', kiem: 'danh-sach-text', selector: '.grade', mongDoi: ['A', 'B', 'D', 'A', 'F', 'A', 'C'] },
  { nhom: 'f3', moTa: 'Scholarship only for average ≥ 9', kiem: 'so-luong', selector: '.scholar', giaTri: 2 },
  { nhom: 'f3', moTa: 'Absent student shows .absent "N/A"', kiem: 'text', selector: '.absent', giaTri: 'N/A' },
  { nhom: 'f3', an: true, moTa: 'Badge class follows the grade (grade-F)', kiem: 'so-luong', selector: '.badge.grade-F', giaTri: 1 },
  // f4
  { nhom: 'f4', moTa: '#summary has 3 dt/dd pairs', kiem: 'danh-sach-text', selector: '#summary dt', mongDoi: ['Class average', 'Pass rate', 'Absent'] },
  { nhom: 'f4', moTa: 'No wrapper element inside <dl> (Fragment)', kiem: 'so-luong', selector: '#summary > :not(dt):not(dd)', giaTri: 0 },
  { nhom: 'f4', an: true, moTa: 'Fragment with a key is used', kiem: 'ma-nguon', tep: 'src/components/Summary.js', khop: 'Fragment\\s+key=' },
  // f5
  { nhom: 'f5', moTa: 'Top 3 by average (ties by name)', kiem: 'danh-sach-text', selector: '#top-3 li', mongDoi: ['Nguyen Van An — 9.3', 'Vo Thu Em — 9.3', 'Bui Lan Khanh — 8.6'] },
  { nhom: 'f5', moTa: 'Class average 7.1, pass rate 86%, 1 absent', kiem: 'danh-sach-text', selector: '#summary dd', mongDoi: ['7.1', '86%', '1'] },
  { nhom: 'f5', moTa: 'Grade distribution with reduce', kiem: 'text', selector: '#grade-dist', giaTri: 'A: 3 · B: 1 · C: 1 · D: 1 · F: 1' },
  { nhom: 'f5', an: true, moTa: 'Data is not mutated (no .sort on the original array)', kiem: 'ma-nguon', khop: '(students|rows|present)\\.sort\\(', phuDinh: true },
  // f6
  { nhom: 'f6', moTa: 'Failing row has class "fail"', kiem: 'so-luong', selector: '.student-row.fail', giaTri: 1 },
  { nhom: 'f6', moTa: 'Failing average is red (style object)', kiem: 'css', selector: '.student-row.fail .s-avg', thuocTinh: 'color', giaTri: 'rgb(220, 38, 38)' },
  { nhom: 'f6', an: true, moTa: 'Style written as an object (style={{…}} or a const)', kiem: 'ma-nguon', tep: 'src/components/StudentRow.js', khop: 'style=\\{' },
  // f7
  { nhom: 'f7', moTa: 'HTML in data is shown as text, not markup', kiem: 'text', selector: '.student-row:first-child .note', giaTri: '<b>Excellent</b> work' },
  { nhom: 'f7', moTa: 'No <b> element created from data', kiem: 'so-luong', selector: '.note b', giaTri: 0 },
  { nhom: 'f7', an: true, moTa: 'dangerouslySetInnerHTML is not used', kiem: 'ma-nguon', khop: 'dangerouslySetInnerHTML', phuDinh: true },
  // f8
  { nhom: 'f8', moTa: 'StudentRow component file is used with a key', kiem: 'ma-nguon', tep: 'src/App.js', khop: '<StudentRow\\s+key=' },
  { nhom: 'f8', moTa: 'Pure helpers in utils/grades.js', kiem: 'ma-nguon', tep: 'src/utils/grades.js', khop: 'export (const|function) gradeOf' },
  { nhom: 'f8', an: true, moTa: 'No React warnings / JS errors', kiem: 'khong-loi-js' },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 3: Class Report Card — rendering with JSX', vi: 'LAB 3: Bảng điểm lớp — render bằng JSX' },
  phu: { en: 'FER202 · Chapter 3 — JSX & Rendering · Suggested time: 80 minutes · Total: 10 marks', vi: 'FER202 · Chương 3 — JSX & Render · Thời gian gợi ý: 80 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Render a class report card from a JavaScript array — <b>no state yet</b>: everything on the page is computed from the data while rendering. Practise JSX expressions, lists with keys, conditional rendering (<code>&amp;&amp;</code>, <code>? :</code>, helper functions), Fragments, array methods (<code>map</code>, <code>filter</code>, <code>reduce</code>, <code>sort</code> on a copy) and inline style objects. JSX escapes strings automatically — keep it that way.</p>',
    vi: '<p>Hiển thị bảng điểm của một lớp từ một mảng JavaScript — <b>chưa dùng state</b>: mọi thứ trên trang được tính từ dữ liệu ngay khi render. Luyện biểu thức JSX, danh sách có key, render có điều kiện (<code>&amp;&amp;</code>, <code>? :</code>, hàm phụ), Fragment, hàm mảng (<code>map</code>, <code>filter</code>, <code>reduce</code>, <code>sort</code> trên bản sao) và style object. JSX tự escape chuỗi — hãy giữ như vậy.</p>',
  },
  chucNangChinh: [{ en: 'Report table, top 3, summary list and grade distribution.', vi: 'Bảng điểm, top 3, tổng hợp và phân bố xếp loại.' }],
  yeuCauChung: [
    { en: 'Function components; data from <code>src/data/classData.js</code> (do not change it).', vi: 'Function component; dữ liệu từ <code>src/data/classData.js</code> (không sửa).' },
    { en: 'Never mutate the data array (<code>sort</code> a copy).', vi: 'Không sửa mảng dữ liệu (<code>sort</code> trên bản sao).' },
    { en: 'Average = mean of the 4 scores; absent (<code>scores: null</code>) is excluded from every statistic.', vi: 'Điểm trung bình = trung bình 4 điểm; vắng (<code>scores: null</code>) không tính vào thống kê nào.' },
  ],
  cayThuMuc: `
src/
├── components/
│   ├── GradeBadge.js     # given
│   ├── StudentRow.js     # one <tr>
│   └── Summary.js        # <dl> built with Fragments
├── utils/
│   └── grades.js         # average · gradeOf · withResults
├── data/
│   └── classData.js      # given
├── App.js
└── index.js`,
  wireframe: `
+------------------------------------------------------------------------------+
| Report — SE1801 (Spring 2026)                                                |
| FER202 · Teacher: Ms. Hoa · 8 students                                       |
| No | Student         | Average | Grade              | Note                   |
| 1  | Nguyen Van An   | 9.3     | [A] ★ Scholarship  | <b>Excellent</b> work  |
| 4  | Pham Minh Duc   | N/A     | —                  | Absent from the final  |
| 6  | Do Gia Huy      | 3.3(red)| [F]                | Must retake            |
| Top 3                  | Summary                  | Grades                       |
| 1. Nguyen Van An — 9.3 | Class average  7.1       | A: 3 · B: 1 · C: 1 · D: 1 ·  |
| 2. Vo Thu Em — 9.3     | Pass rate      86%       | F: 1                         |
| 3. Bui Lan Khanh — 8.6 | Absent         1         |                              |
+------------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Student',
    truong: [
      ['id', 'number', ''],
      ['name', 'string', ''],
      ['scores', 'number[4] | null', { en: 'null = absent', vi: 'null = vắng thi' }],
      ['note', 'string', { en: 'may contain HTML-looking text — show it as text', vi: 'có thể chứa chữ giống HTML — hiện đúng là chữ' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Header expressions', vi: 'Biểu thức ở tiêu đề' }, diem: 1,
      yeuCau: [{ en: '<code>#report-title</code> <code>Report — SE1801 (Spring 2026)</code> and <code>#report-sub</code> <code>FER202 · Teacher: Ms. Hoa · 8 students</code>, built from <code>CLASS_INFO</code> and the array length.', vi: '<code>#report-title</code> <code>Report — SE1801 (Spring 2026)</code> và <code>#report-sub</code> <code>FER202 · Teacher: Ms. Hoa · 8 students</code>, dựng từ <code>CLASS_INFO</code> và độ dài mảng.' }],
    },
    {
      ten: { en: 'Rows with keys', vi: 'Hàng có key' }, diem: 1.5,
      yeuCau: [{ en: '<code>#report-table</code> body: one <code>tr.student-row</code> per student (data order) with No, <code>.s-name</code>, <code>.s-avg</code> (1 decimal), grade, <code>.note</code>.', vi: 'Thân <code>#report-table</code>: mỗi sinh viên một <code>tr.student-row</code> (thứ tự dữ liệu) gồm No, <code>.s-name</code>, <code>.s-avg</code> (1 chữ số thập phân), xếp loại, <code>.note</code>.' }],
      hook: ['map + key'],
    },
    {
      ten: { en: 'Conditional rendering', vi: 'Render có điều kiện' }, diem: 1.5,
      yeuCau: [
        { en: 'Grade badge <code>.badge.grade.grade-{X}</code>: A ≥ 8.5 · B ≥ 7 · C ≥ 5.5 · D ≥ 4 · F.', vi: 'Badge <code>.badge.grade.grade-{X}</code>: A ≥ 8.5 · B ≥ 7 · C ≥ 5.5 · D ≥ 4 · F.' },
        { en: 'Absent ⇒ <code>.absent</code> <code>N/A</code> and <code>—</code> instead of a badge; average ≥ 9 ⇒ <code>.scholar</code> <code>★ Scholarship</code>.', vi: 'Vắng ⇒ <code>.absent</code> <code>N/A</code> và <code>—</code> thay cho badge; trung bình ≥ 9 ⇒ <code>.scholar</code> <code>★ Scholarship</code>.' },
      ],
      hook: ['&&', '? :'],
    },
    {
      ten: { en: 'Fragments', vi: 'Fragment' }, diem: 1,
      yeuCau: [{ en: '<code>Summary</code> renders <code>&lt;dl id="summary"&gt;</code> whose direct children are only <code>dt</code>/<code>dd</code> pairs — use <code>&lt;Fragment key&gt;</code>.', vi: '<code>Summary</code> vẽ <code>&lt;dl id="summary"&gt;</code> mà con trực tiếp chỉ là các cặp <code>dt</code>/<code>dd</code> — dùng <code>&lt;Fragment key&gt;</code>.' }],
    },
    {
      ten: { en: 'Array methods', vi: 'Hàm mảng' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#top-3</code>: 3 best averages (ties by name), <code>Name — 9.3</code>.', vi: '<code>#top-3</code>: 3 điểm trung bình cao nhất (bằng nhau theo tên), <code>Tên — 9.3</code>.' },
        { en: 'Summary: class average (1 decimal), pass rate (average ≥ 5, rounded %), absent count; <code>#grade-dist</code> <code>A: n · B: n · C: n · D: n · F: n</code>.', vi: 'Tổng hợp: trung bình lớp (1 chữ số), tỉ lệ đạt (≥ 5, % làm tròn), số vắng; <code>#grade-dist</code> <code>A: n · B: n · C: n · D: n · F: n</code>.' },
      ],
      viDu: { en: 'Class average 7.1 · Pass rate 86% · Absent 1', vi: 'Class average 7.1 · Pass rate 86% · Absent 1' },
    },
    {
      ten: { en: 'Dynamic class & style object', vi: 'Class động & style object' }, diem: 1,
      yeuCau: [{ en: 'Average &lt; 5 ⇒ row gets class <code>fail</code> and the average is red <code>rgb(220, 38, 38)</code> via a <code>style</code> object.', vi: 'Trung bình &lt; 5 ⇒ hàng có class <code>fail</code> và điểm màu đỏ <code>rgb(220, 38, 38)</code> qua <code>style</code> object.' }],
    },
    {
      ten: { en: 'Safe text', vi: 'Hiển thị chữ an toàn' }, diem: 1,
      yeuCau: [{ en: 'The note <code>&lt;b&gt;Excellent&lt;/b&gt; work</code> must appear literally — no <code>dangerouslySetInnerHTML</code>.', vi: 'Ghi chú <code>&lt;b&gt;Excellent&lt;/b&gt; work</code> phải hiện nguyên văn — không dùng <code>dangerouslySetInnerHTML</code>.' }],
    },
    {
      ten: { en: 'Components & helpers', vi: 'Component & hàm phụ' }, diem: 1,
      yeuCau: [{ en: '<code>StudentRow</code> receives <code>no</code> + <code>student</code>; pure helpers <code>average</code>, <code>gradeOf</code>, <code>withResults</code> in <code>utils/grades.js</code>.', vi: '<code>StudentRow</code> nhận <code>no</code> + <code>student</code>; hàm thuần <code>average</code>, <code>gradeOf</code>, <code>withResults</code> trong <code>utils/grades.js</code>.' }],
    },
  ],
  idBatBuoc: [
    ['#report-title · #report-sub · #report-table', { en: 'header + table', vi: 'tiêu đề + bảng' }],
    ['.student-row(.fail) · .s-name · .s-avg · .absent · .grade · .scholar · .note', { en: 'row cells', vi: 'ô của hàng' }],
    ['#top-3 · #summary · #grade-dist', { en: 'panels', vi: 'khung tổng hợp' }],
  ],
  truDiem: [
    { en: '<code>students.sort(…)</code> for the top 3 — the table order changes too.', vi: '<code>students.sort(…)</code> để lấy top 3 — bảng cũng bị đảo thứ tự.' },
    { en: '<code>{count &amp;&amp; …}</code> when count is 0 — prints a stray "0"; the condition must be a boolean.', vi: '<code>{count &amp;&amp; …}</code> khi count = 0 — in ra số "0"; điều kiện phải là boolean.' },
    { en: 'Wrapping <code>dt</code>/<code>dd</code> in a <code>div</code> — invalid list markup.', vi: 'Bọc <code>dt</code>/<code>dd</code> trong <code>div</code> — sai cấu trúc danh sách.' },
    { en: 'Counting absent students as 0 in the averages.', vi: 'Tính học sinh vắng là 0 điểm vào trung bình.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-3-lab-report-card',
  ten: 'Lab 3 — Class Report Card (JSX rendering)',
  khoa: KHOA,
  baiHoc: 'fer202-3-1-jsx-basics',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 3 — Class Report Card (lists · keys · conditional rendering · Fragments)', vi: 'Lab 3 — Bảng điểm lớp (danh sách · key · render có điều kiện · Fragment)' },
      doKho: 'MEDIUM',
      phut: 80,
      diem: 100,
      khaiNiem: ['JSX expressions', 'list & key', 'conditional rendering', 'Fragment', 'map/filter/reduce/sort', 'style object', 'escaping'],
      tienQuyet: ['ES6: arrow, destructuring, spread', 'array methods'],
      the: ['fer202', 'lab', 'jsx'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'expression', vi: 'biểu thức (đặt trong { } của JSX)' },
        { en: 'conditional rendering', vi: 'render có điều kiện' },
        { en: 'Fragment', vi: 'nhóm phần tử không sinh thẻ HTML' },
        { en: 'escape', vi: 'thoát ký tự đặc biệt để hiện như chữ' },
        { en: 'distribution', vi: 'phân bố (đếm theo nhóm)' },
        { en: 'pass rate', vi: 'tỉ lệ đạt' },
        ...tn('component', 'props', 'key', 'mutate', 'derived', 'rubric'),
      ],
      goiY: [
        'Viết utils/grades.js trước: average (reduce), gradeOf (if/else theo ngưỡng), withResults (map ⇒ { ...s, avg, grade }).',
        'App: rows = withResults(students); present = rows.filter(s => s.avg !== null); mọi thống kê dùng present.',
        'Top 3: [...present].sort((a, b) => b.avg - a.avg || a.name.localeCompare(b.name)).slice(0, 3).',
        'Summary: items.map(({ label, value }) => <Fragment key={label}><dt>…</dt><dd>…</dd></Fragment>).',
      ],
      loiHayGap: [
        'Thiếu <code>key</code> (hoặc key = index) khi map ra hàng ⇒ cảnh báo của React.',
        '<code>present.sort()</code> sửa luôn mảng ⇒ thứ tự bảng đổi theo.',
        'Viết <code>style="color: red"</code> như HTML ⇒ React báo lỗi; style phải là object <code>{{ color: … }}</code>.',
        'Dùng <code>class=</code> thay vì <code>className=</code>.',
        'Hiện ghi chú bằng <code>dangerouslySetInnerHTML</code> ⇒ dữ liệu biến thành thẻ thật (lỗ hổng XSS).',
        'Gọi <code>avg.toFixed(1)</code> khi avg là <code>null</code> (sinh viên vắng) ⇒ lỗi trắng trang.',
      ],
      moTaNgan: 'Lab chương 3: bảng điểm lớp chỉ bằng render — biểu thức JSX, danh sách + key, điều kiện, Fragment, map/filter/reduce/sort, style object, chữ an toàn.',
      giaiThich: '<p>Mọi con số là giá trị <em>suy ra</em> khi render: <code>withResults</code> thêm <code>avg</code>/<code>grade</code> vào bản sao từng sinh viên; thống kê chỉ dùng danh sách <code>present</code>; top 3 sắp trên bản sao. <code>StudentRow</code> minh hoạ ba kiểu điều kiện (<code>? :</code> cho vắng/có điểm, <code>&amp;&amp;</code> cho học bổng, hàm <code>gradeOf</code>) và style object. <code>Summary</code> dùng <code>Fragment</code> có key để <code>&lt;dl&gt;</code> chỉ chứa <code>dt</code>/<code>dd</code>. Ghi chú được JSX tự escape nên chuỗi <code>&lt;b&gt;</code> hiện đúng là chữ.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/rendering-lists',
    },
  ],
});
