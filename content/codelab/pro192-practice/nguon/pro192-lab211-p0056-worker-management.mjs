/** PRO192 · L.3 🎓 LAB211 J1.S.P0056 Worker Management (70 LOC) — in NGÀY HÔM NAY ⇒ máy chấm che ngày (homNay). Nguồn: gen/lab/l211-p0056. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0056', {
  tieuDe: { en: 'L.3 — LAB211 J1.S.P0056: Worker Management (salary history with today’s date)', vi: 'L.3 — LAB211 J1.S.P0056: Quản lý công nhân (lịch sử lương kèm ngày hôm nay)' },
  phut: 120,
  khaiNiem: ['unique code', 'age 18–50, salary > 0', 'salary history with status UP/DOWN and LocalDate.now()', 'table sorted by code', 'money printed 1100 / 999.5 on every machine'],
  homNay: 'dd/MM/yyyy',
  moTa: {
    en: `<p><b>J1.S.P0056 (70 LOC).</b> Menu: 1 Add Worker · 2 Up salary · 3 Down salary · 4 Display Information salary · 5 Exit. A worker has a code, a name, an age, a salary and a work location. <b>Add</b>: the code is not blank and not already used, the age is a whole number from 18 to 50, the salary is greater than 0, the location is not blank — each field is asked again until valid; a duplicated code is reported after the last field. <b>Up/Down</b>: the code must exist (case-sensitive), the amount greater than 0; a decrease must stay below the current salary. Every change is stored in the history with its status (${c('UP')}/${c('DOWN')}) and <b>today’s date</b> (${c('dd/MM/yyyy')}). <b>Display</b>: every change as a row ${c('Code Name Age Salary Status Date')}, sorted by code. Copy the prompts character for character (${c('Enter Salary: ')} with a space when adding, ${c('Enter Salary:')} without one when changing).</p>
<p><b>About the date:</b> your program prints the real date of the day you run it. The grader replaces today’s date in your output with the text ${c('dd/MM/yyyy')} before comparing — that is what the expected output shows. Print any other date (yesterday, the date the worker was added…) and the line differs. Layering: ${c('WorkerController')} holds ${c('WorkerRepository')} (add/find/list), ${c('WorkerService')} changes the salary and builds the rows (it holds no repository), ${c('WorkerView')} prints.</p>`,
    vi: `<p><b>J1.S.P0056 (70 LOC).</b> Menu: 1 Add Worker · 2 Up salary · 3 Down salary · 4 Display Information salary · 5 Exit. Công nhân có mã, tên, tuổi, lương và nơi làm việc. <b>Add</b>: mã không trống và chưa ai dùng, tuổi là số nguyên từ 18 tới 50, lương lớn hơn 0, nơi làm việc không trống — ô nào sai hỏi lại ô đó; mã trùng được báo sau ô cuối. <b>Up/Down</b>: mã phải có (phân biệt hoa thường), số tiền lớn hơn 0; giảm thì phải nhỏ hơn lương hiện tại. Mỗi lần đổi lưu vào lịch sử kèm trạng thái (${c('UP')}/${c('DOWN')}) và <b>ngày hôm nay</b> (${c('dd/MM/yyyy')}). <b>Display</b>: mỗi lần đổi một dòng ${c('Code Name Age Salary Status Date')}, sắp theo mã. Chép đúng từng ký tự lời nhắc (${c('Enter Salary: ')} có dấu cách khi thêm, ${c('Enter Salary:')} không có khi đổi lương).</p>
<p><b>Về ngày:</b> chương trình của bạn in ngày thật của hôm bạn chạy. Máy chấm thay ngày hôm nay trong output của bạn bằng chữ ${c('dd/MM/yyyy')} rồi mới so — output mong đợi hiện đúng chữ đó. In ngày khác (hôm qua, ngày thêm công nhân…) là lệch dòng. Chia tầng: ${c('WorkerController')} giữ ${c('WorkerRepository')} (thêm/tìm/lấy danh sách), ${c('WorkerService')} đổi lương và dựng dòng bảng (không giữ repository), ${c('WorkerView')} in.</p>`,
  },
  thay: [['Lien', 'Hoa'], ['Nghia', 'Tuan'], ['Danang', 'Hue'], ['Hanoi', 'Haiphong'], ['W 3', 'W 7']],
  menuRac: '4', menuThoat: '5',
  ca: [
    { ten: { en: 'ages 50 and 18, a salary of 0.5, decreasing to exactly 0 is refused, codes sorted (A1 before B2), a1 ≠ A1', vi: 'tuổi 50 và 18, lương 0.5, giảm về đúng 0 bị từ chối, mã sắp xếp (A1 trước B2), a1 ≠ A1' }, vao: '1\nB2\nMai\n50\n0.5\nHue\n1\nA1\nKhoa\n18\n2000\nHanoi\n3\nB2\n0.5\n2\nB2\n99.5\n3\nA1\n500.25\n2\na1\n10\n4\n5\n', an: true },
  ],
  goiY: [
    { en: 'LocalDate.now().format(DateTimeFormatter.ofPattern(Constants.DATE_FORMAT)) — keep the pattern "dd/MM/yyyy" in Constants.', vi: 'LocalDate.now().format(DateTimeFormatter.ofPattern(Constants.DATE_FORMAT)) — giữ mẫu "dd/MM/yyyy" trong Constants.' },
    { en: 'Money: new DecimalFormat("0.##", new DecimalFormatSymbols(Locale.US)) prints 1100 and 999.5 even on a Vietnamese Windows.', vi: 'Tiền: new DecimalFormat("0.##", new DecimalFormatSymbols(Locale.US)) in 1100 và 999.5 kể cả trên Windows tiếng Việt.' },
    { en: 'Sort a copy of the worker list by code (Comparator on getCode()), then add one row per history entry of each worker.', vi: 'Sắp một bản sao danh sách công nhân theo mã (Comparator trên getCode()), rồi thêm mỗi lần đổi lương của từng người một dòng.' },
  ],
  loiHayGap: [
    { en: 'Printing 1100.0 (double.toString) — the expected output shows 1100.', vi: 'In 1100.0 (double.toString) — output mong đợi là 1100.' },
    { en: 'Checking the duplicate code right after the code is typed — the reference asks every field first, then the repository refuses the duplicate.', vi: 'Kiểm mã trùng ngay sau khi gõ mã — đáp án hỏi đủ các ô trước, rồi repository mới từ chối mã trùng.' },
    { en: 'Testing your program with a hard-coded date because "the grader wants dd/MM/yyyy" — it wants the REAL date; it masks it itself.', vi: 'Viết cứng ngày vì "máy chấm muốn dd/MM/yyyy" — nó muốn ngày THẬT; nó tự che.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0056 rewritten to the checklist from a classmate’s passed version (controller holds the repository, the service none; lint.py clean; javac --release 8). The date is the only output that depends on the day, so it is the only thing the grader masks.</p>', vi: '<p>Lời giải là P0056 của khoá, viết lại theo tờ checklist từ bản bạn cùng lớp đã pass (controller giữ repository, service không giữ; sạch lint.py; javac --release 8). Ngày là output duy nhất phụ thuộc hôm chạy, nên là thứ duy nhất máy chấm che.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0056-worker-management', ten: 'L.3 🎓 LAB211 J1.S.P0056 — Worker Management', de: [de] });
