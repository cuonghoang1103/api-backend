/** PRO192 · L.6 🎓 LAB211 J1.S.P0073 Handy Expense (100 LOC) — lưu data/expenses.txt, hai lần chạy cùng thư mục. Nguồn: gen/lab/l211-p0073. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0073', {
  tieuDe: { en: 'L.6 — LAB211 J1.S.P0073: Handy Expense (saved to a file)', vi: 'L.6 — LAB211 J1.S.P0073: Quản lý chi tiêu (lưu ra tệp)' },
  phut: 150,
  khaiNiem: ['date dd-MMM-yyyy that really exists (Locale.US month names)', 'ID = largest ID + 1', 'table + Total', 'data/expenses.txt read at start, rewritten after add/delete', 'broken lines skipped'],
  moTa: {
    en: `<p><b>J1.S.P0073 (100 LOC).</b> Menu 1 Add an expense · 2 Display all expenses · 3 Delete an expense · 4 Quit. An expense: ID, Date (${c('dd-MMM-yyyy')}, a real day — ${c('31-Feb-2009')} is refused, ${c('11-apr-2009')} is accepted and shown as ${c('11-Apr-2009')}), Amount (> 0; ${c('100')} and ${c('50.5')} print like that), Content (not blank). <b>Add</b>: ID = the largest ID + 1 (the first is 1), then ${c('Add an expense successful (ID n)')}. <b>Display</b>: ${c('ID Date Amount Content')} and ${c('Total: …')}, or a sentence when there is nothing. <b>Delete</b>: an ID (a whole number) → ${c('Delete an expense successful')} or ${c('Delete an expense fail')} (the brief’s sentences).</p>
<p><b>The data lives in ${c('data/expenses.txt')}</b>, one expense per line ${c('id|date|amount|content')}: Main reads it when the program starts (a missing file = an empty list, a broken line is skipped), and every add/delete rewrites it. The grader runs your program <b>twice in the same folder</b> (case 1 = ${c('harness/input.txt')}, then ${c('input-2.txt')} after a restart) — what the first run saved must be there in the second. A hidden case starts from a file that already has expenses and one broken line. The brief’s ${c('addExpense / displayAll / deleteExpense')} keep their names, but printing stays in the view and the service only computes (new ID, rows, total).</p>`,
    vi: `<p><b>J1.S.P0073 (100 LOC).</b> Menu 1 Add an expense · 2 Display all expenses · 3 Delete an expense · 4 Quit. Một khoản chi: ID, Date (${c('dd-MMM-yyyy')}, ngày có thật — ${c('31-Feb-2009')} bị từ chối, ${c('11-apr-2009')} được nhận và hiện thành ${c('11-Apr-2009')}), Amount (> 0; ${c('100')} và ${c('50.5')} in đúng như vậy), Content (không trống). <b>Add</b>: ID = ID lớn nhất + 1 (cái đầu là 1), rồi ${c('Add an expense successful (ID n)')}. <b>Display</b>: ${c('ID Date Amount Content')} và ${c('Total: …')}, hoặc một câu khi chưa có gì. <b>Delete</b>: một ID (số nguyên) → ${c('Delete an expense successful')} hoặc ${c('Delete an expense fail')} (câu của đề).</p>
<p><b>Dữ liệu nằm trong ${c('data/expenses.txt')}</b>, mỗi khoản một dòng ${c('id|date|amount|content')}: Main đọc khi chương trình mở (không có tệp = danh sách rỗng, dòng hỏng bị bỏ qua), mỗi lần thêm/xoá ghi lại cả tệp. Máy chấm chạy chương trình <b>hai lần trong cùng thư mục</b> (ca 1 = ${c('harness/input.txt')}, rồi ${c('input-2.txt')} sau khi mở lại) — thứ lần đầu lưu phải còn ở lần sau. Một ca ẩn bắt đầu từ tệp đã có sẵn khoản chi và một dòng hỏng. ${c('addExpense / displayAll / deleteExpense')} của đề giữ tên, nhưng việc in nằm ở view còn service chỉ tính (ID mới, dòng bảng, tổng tiền).</p>`,
  },
  thay: [['Tuition fee', 'Hoc phi ky 5'], ['Rent house', 'Tien nha thang 4'], ['Food', 'An uong'], ['250', '99.5'], ['Bus ticket', 'Ve xe buyt'], ['50.5', '12.25']],
  menuRac: '2', menuThoat: '4',
  ca: [
    {
      ten: { en: 'a data file with expenses 5 and 7 and a broken line: new ID 8, delete 5, restart keeps it', vi: 'tệp dữ liệu có khoản 5, 7 và một dòng hỏng: ID mới 8, xoá 5, mở lại vẫn còn' },
      phien: ['2\n1\n03-Mar-2010\n10\nGui xe\n3\n5\n2\n4\n', '2\n3\n8\n1\n04-mar-2010\n7.75\nCom trua\n2\n4\n'],
      tepCa: { 'data/expenses.txt': '5|02-Jan-2010|300|Sach PRO192\nabc\n7|15-Feb-2010|45.5|Cafe\n' },
      an: true,
    },
  ],
  goiY: [
    { en: 'Date: new SimpleDateFormat("dd-MMM-yyyy", Locale.US) with setLenient(false); print it back with the same format to get "11-Apr-2009".', vi: 'Ngày: new SimpleDateFormat("dd-MMM-yyyy", Locale.US) với setLenient(false); in lại bằng cùng định dạng để ra "11-Apr-2009".' },
    { en: 'Line format: split("\\\\|") — a plain split("|") splits between every character (the "split-gach" trap of the course).', vi: 'Định dạng dòng: split("\\\\|") — split("|") trần tách giữa mọi ký tự (bẫy "split-gach" của khoá).' },
    { en: 'Money: DecimalFormat("0.##") with Locale.US symbols ⇒ 100, 50.5, 350.5.', vi: 'Tiền: DecimalFormat("0.##") với ký hiệu Locale.US ⇒ 100, 50.5, 350.5.' },
  ],
  loiHayGap: [
    { en: 'split("|") without escaping — | is "or" in a regex, every line becomes broken and the second run starts empty.', vi: 'split("|") không thoát ký tự — | là "hoặc" trong regex, mọi dòng thành hỏng và lần chạy hai bắt đầu rỗng.' },
    { en: 'ID = size() + 1 — with expenses 5 and 7 in the file the next one must be 8.', vi: 'ID = size() + 1 — tệp có khoản 5 và 7 thì khoản kế tiếp phải là 8.' },
    { en: 'Writing the file only when the program quits — the brief and the grader expect it rewritten after every change.', vi: 'Chỉ ghi tệp khi thoát — đề và máy chấm mong tệp được ghi lại sau mỗi lần đổi.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0073 (lint.py clean, checklist 0 violations, real JDK 8): FileUtils reads/writes lines, the repository turns them into expenses and saves after each change, the service computes the new ID, the rows and the total, the view prints.</p>', vi: '<p>Lời giải là P0073 của khoá (sạch lint.py, tờ checklist 0 vi phạm, JDK 8 thật): FileUtils đọc/ghi dòng, repository đổi dòng thành khoản chi và lưu sau mỗi lần đổi, service tính ID mới, dòng bảng và tổng tiền, view in.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0073-handy-expense', ten: 'L.6 🎓 LAB211 J1.S.P0073 — Handy Expense', de: [de] });
