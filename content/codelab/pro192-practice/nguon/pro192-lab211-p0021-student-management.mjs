/** PRO192 · L.2 🎓 LAB211 J1.L.P0021 Student Management (Long, 350 LOC) — Create ≥ 10 + Y/N, Find & Sort (Comparator), Update/Delete U/D, Report. Nguồn: gen/lab/l211-p0021. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0021', {
  tieuDe: { en: 'L.2 — LAB211 J1.L.P0021: Student Management (Long Assignment)', vi: 'L.2 — LAB211 J1.L.P0021: Quản lý sinh viên (Long Assignment)' },
  phut: 240,
  khaiNiem: ['one student, many enrollments (semester + course)', 'Comparator.compare + Collections.sort', 'Y/N and U/D questions asked again until valid', 'report: name | course | count', 'controller orchestrates repository + service'],
  moTa: {
    en: `<p><b>J1.L.P0021 (Long Assignment, 350 LOC).</b> A student has an ID (${c('S')} + digits, e.g. ${c('S12')}), a name, and enrollments: a semester (e.g. ${c('Fall2022')}) and one of three courses (1 Java, 2 .Net, 3 C/C++). The program starts with 9 sample students. Menu: <b>1 Create</b> — ID, name, semester, course; from the 10th student on it asks ${c('Do you want to continue (Y/N)?')} after each one. An existing ID must come with the same name, and the same student cannot take the same course twice in one semester. <b>2 Find and Sort</b> — a name or part of it (case-insensitive), the matching enrollments sorted by name with ${c('Comparator')}. <b>3 Update/Delete</b> — an ID, its enrollments numbered, a record number, then ${c('U')} (new semester + course, refused if it duplicates another record) or ${c('D')} (a student with no enrollment left disappears). <b>4 Report</b> — one line per student and course: ${c('Dao Van Tuan | Java | 2')} = how many times. <b>5 Exit</b>.</p>
<p>Each field is asked again until it is valid, and every message says what is wrong and what to type. The keyboard lives in ${c('Main')}; ${c('StudentController')} finds/saves through ${c('StudentRepository')} and asks ${c('StudentService')} for the rules (duplicates, sorting, report) — the service never holds the repository; ${c('StudentView')} prints once per flow.</p>`,
    vi: `<p><b>J1.L.P0021 (Long Assignment, 350 LOC).</b> Sinh viên có ID (${c('S')} + số, ví dụ ${c('S12')}), họ tên, và các lần học: học kỳ (ví dụ ${c('Fall2022')}) và một trong ba môn (1 Java, 2 .Net, 3 C/C++). Chương trình khởi động với 9 sinh viên mẫu. Menu: <b>1 Create</b> — ID, tên, học kỳ, môn; từ sinh viên thứ 10 trở đi hỏi ${c('Do you want to continue (Y/N)?')} sau mỗi lần nhập. ID đã có thì phải đi kèm đúng tên đó, và một sinh viên không học trùng một môn trong cùng một học kỳ. <b>2 Find and Sort</b> — tên hoặc một phần tên (không phân biệt hoa thường), các lần học khớp sắp theo tên bằng ${c('Comparator')}. <b>3 Update/Delete</b> — một ID, các lần học đánh số, chọn số bản ghi, rồi ${c('U')} (học kỳ + môn mới, trùng bản ghi khác thì từ chối) hoặc ${c('D')} (sinh viên hết lần học thì biến mất). <b>4 Report</b> — mỗi sinh viên mỗi môn một dòng: ${c('Dao Van Tuan | Java | 2')} = số lần học. <b>5 Exit</b>.</p>
<p>Mỗi ô hỏi lại tới khi hợp lệ, và mọi câu báo đều nói sai gì và phải nhập gì. Bàn phím nằm ở ${c('Main')}; ${c('StudentController')} tìm/lưu qua ${c('StudentRepository')} và nhờ ${c('StudentService')} các luật (trùng, sắp xếp, báo cáo) — service không giữ repository; ${c('StudentView')} in một lần mỗi luồng.</p>`,
  },
  thay: [['Tran Van B', 'Pham Thi Mai'], ['nguyen', 'huy'], ['Nguyen Van Thanh Hai Long Name', 'Hoang Minh Duc'], ['Fall2023', 'Spring2024'], ['Spring2023', 'Summer2023']],
  menuRac: '4', menuThoat: '5',
  ca: [
    { ten: { en: 'search in lower case, delete the only record of a student, an existing ID typed in lower case, the 10th student asks Y/N', vi: 'tìm bằng chữ thường, xoá bản ghi duy nhất của một sinh viên, ID đã có gõ chữ thường, sinh viên thứ 10 thì hỏi Y/N' }, vao: '2\nle\n3\nS3\n1\nD\n2\nle\n1\nS20\nPham Thi Mai\nSpring2024\n3\ns20\npham thi mai\nSummer2024\n1\nS21\nVu Van Nam\nFall2024\n2\nx\nY\nS22\nDo Thi Lan\nFall2024\n1\nN\n4\n5\n', an: true },
  ],
  goiY: [
    { en: 'Model: Student { id, name, List<Enrollment> } and Enrollment { semester, course } — the report counts enrollments per (student, course).', vi: 'Model: Student { id, name, List<Enrollment> } và Enrollment { semester, course } — báo cáo đếm số lần học theo (sinh viên, môn).' },
    { en: 'Sort with Collections.sort(list, new Comparator<…>() { @Override public int compare(…) }) — the lecturer asks to see compare().', vi: 'Sắp bằng Collections.sort(list, new Comparator<…>() { @Override public int compare(…) }) — thầy muốn thấy compare().' },
    { en: 'Compare IDs and names with equalsIgnoreCase / toLowerCase().contains — "s1" finds S1.', vi: 'So ID và tên bằng equalsIgnoreCase / toLowerCase().contains — "s1" tìm được S1.' },
  ],
  loiHayGap: [
    { en: 'Asking Y/N before the 10th student — the brief says "at least 10", the question starts from the 10th.', vi: 'Hỏi Y/N trước sinh viên thứ 10 — đề nói "ít nhất 10", câu hỏi bắt đầu từ sinh viên thứ 10.' },
    { en: 'Deleting the whole student when only one of his enrollments was chosen.', vi: 'Xoá cả sinh viên khi chỉ chọn một lần học của người đó.' },
    { en: 'A record number out of range or a letter typed for U/D crashing the program instead of asking again.', vi: 'Số bản ghi ngoài khoảng hoặc gõ chữ khác U/D làm sập chương trình thay vì hỏi lại.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0021 (lint.py clean, checklist 0 violations, real JDK 8). The controller is the only class that calls both the repository (find/save/delete a student) and the service (rules on enrollments), so each layer stays testable on its own.</p>', vi: '<p>Lời giải là P0021 của khoá (sạch lint.py, tờ checklist 0 vi phạm, JDK 8 thật). Controller là lớp duy nhất gọi cả repository (tìm/lưu/xoá sinh viên) lẫn service (luật trên các lần học), nên mỗi tầng đứng riêng được.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0021-student-management', ten: '10.2 🎓 L.2 LAB211 J1.L.P0021 — Student Management', de: [de] });
