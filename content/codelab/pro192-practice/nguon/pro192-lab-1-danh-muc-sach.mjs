/** PRO192 · Lab 1 — CT Library: danh mục sách đầu tiên (chuỗi, ISBN-13, Comparator — đúng tầng LAB211). Nguồn: gen/lab/lab1. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab1', {
  tieuDe: { en: 'Lab 1 — CT Library: the first book catalogue', vi: 'Lab 1 — CT Library: danh mục sách đầu tiên' },
  phut: 180,
  khaiNiem: ['trim / split / StringBuilder', 'ISBN-13 check digit', 'Collections.sort + Comparator', 'LAB211 layers'],
  moTa: {
    en: `<p><b>Ticket CTL-1.</b> The CuongThai reading club keeps its books in a spreadsheet: titles typed any way, ISBNs with a digit missing, the same book twice. Build the first console catalogue: a menu (1 add, 2 list sorted by title, 3 search by title, 0 exit) that cleans what people type and refuses what is wrong — and never crashes.</p>
<p>The classes are given, already split into the LAB211 packages; your job is the logic of five methods: normalise a title (trim, one space between words, Title Case, max 60 characters), validate an ISBN-13 (only digits, "-" and spaces; 13 digits; prefix 978/979; the check digit with weights 1,3,1,3…), refuse a duplicate ISBN in the repository, search titles case-insensitively, and sort a copy of the list by title (then ISBN) with a Comparator. The full walkthrough is lesson <b>Lab 1</b> of the course (button 📺 above).</p>`,
    vi: `<p><b>Ticket CTL-1.</b> CLB đọc sách CuongThai giữ sách trong bảng tính: tên gõ đủ kiểu, ISBN thiếu chữ số, một sách nhập hai lần. Dựng danh mục console đầu tiên: menu (1 thêm, 2 liệt kê theo tên, 3 tìm theo tên, 0 thoát) làm sạch thứ người dùng gõ và từ chối thứ sai — và không bao giờ sập.</p>
<p>Các lớp cho sẵn, đã chia đúng các package LAB211; việc của bạn là logic của năm hàm: chuẩn hoá tên sách (trim, một dấu cách giữa các từ, Title Case, tối đa 60 ký tự), kiểm ISBN-13 (chỉ chữ số, "-" và dấu cách; 13 chữ số; đầu 978/979; chữ số kiểm tra trọng số 1,3,1,3…), chặn ISBN trùng trong repository, tìm theo tên không phân biệt hoa thường, và sắp một bản sao danh sách theo tên (rồi ISBN) bằng Comparator. Hướng dẫn từng bước: bài <b>Lab 1</b> của khoá (nút 📺 phía trên).</p>`,
  },
  ca: [
    {
      ten: { en: 'normalised titles, separators in ISBNs, a duplicate, a title tie sorted by ISBN', vi: 'chuẩn hoá tên, ISBN có dấu phân cách, trùng ISBN, trùng tên sắp theo ISBN' },
      vao: '1\n  the   art of   COMPUTER programming \n9780201633610\n1\ndesign patterns\n978-0-201-63361-0\n1\nthe c programming language\n978 0 13 110362 7\n1\nThe Art Of Computer Programming\n9791000000008\n2\n3\nPROGRAMMING\n3\nzzz\n0\n',
      an: true,
    },
    {
      ten: { en: 'only wrong menu choices, then exit', vi: 'chỉ chọn menu sai, rồi thoát' },
      vao: '\n-1\n9\nx1\n 2 \n0\n',
      an: true,
    },
    {
      ten: { en: 'every ISBN error in a row', vi: 'đủ mọi lỗi ISBN liên tiếp' },
      vao: '1\nclean architecture\n97801234567890\n978012345678X\n123-4567890123\n9780000000001\n9780000000002\n2\n0\n',
      an: true,
    },
  ],
  goiY: [
    { en: 'Title: trim → split("\\\\s+") → for each word substring(0, 1).toUpperCase() + substring(1).toLowerCase() → join with one space in a StringBuilder; check empty and the 60-character limit with the messages in Message.', vi: 'Tên: trim → split("\\\\s+") → mỗi từ substring(0, 1).toUpperCase() + substring(1).toLowerCase() → nối bằng một dấu cách trong StringBuilder; kiểm rỗng và giới hạn 60 ký tự bằng câu trong Message.' },
    { en: 'ISBN: first loop collects digits (skip "-" and spaces, reject anything else with its 1-based position); then length 13, prefix 978/979, and the check digit (10 − sum % 10) % 10 with weights 1, 3, 1, 3…', vi: 'ISBN: vòng đầu gom chữ số (bỏ "-" và dấu cách, từ chối ký tự khác kèm vị trí đếm từ 1); rồi độ dài 13, đầu 978/979, và chữ số kiểm tra (10 − tổng % 10) % 10 với trọng số 1, 3, 1, 3…' },
    { en: 'Sort a COPY: new ArrayList<>(list), then Collections.sort with a Comparator — compareToIgnoreCase on the title, then the ISBN; number the rows 1, 2, 3… after sorting.', vi: 'Sắp một BẢN SAO: new ArrayList<>(list), rồi Collections.sort với Comparator — compareToIgnoreCase trên tên, rồi ISBN; đánh số 1, 2, 3… sau khi sắp.' },
  ],
  loiHayGap: [
    { en: 'Computing the check digit as 10 − sum % 10 without the outer % 10 — when the remainder is 0 you get 10 instead of 0.', vi: 'Tính chữ số kiểm tra là 10 − tổng % 10 mà thiếu % 10 bên ngoài — khi dư 0 thì ra 10 thay vì 0.' },
    { en: 'Building the title with += in a loop and leaving a trailing space — the title then fails the comparison (and LAB211 checklist 3.8).', vi: 'Dựng tên bằng += trong vòng lặp và để thừa dấu cách cuối — tên sai khi so (và vi phạm checklist LAB211 3.8).' },
    { en: 'Checking the duplicate ISBN in Validation or Main — only the repository holds the list, so the check belongs in BookRepository.addBook.', vi: 'Kiểm ISBN trùng ở Validation hay Main — chỉ repository giữ danh sách, nên phép kiểm thuộc về BookRepository.addBook.' },
  ],
  giaiThich: {
    en: '<p>The reference solution is the course’s Lab 1 solution: it passes the reviewer’s lint.py (0 violations), compiles with <code>javac --release 8</code> and produces the same output on a real JDK 8. Validation cleans and checks input with static helpers that throw an Exception carrying the user-facing message; the repository is the only owner of the list (duplicate check + case-insensitive search returning DTO copies); the service sorts a copy with a two-key Comparator; Main loops until 0 and calls the controller once per choice.</p>',
    vi: '<p>Lời giải là đáp án Lab 1 của khoá: qua lint.py của thầy (0 vi phạm), biên dịch với <code>javac --release 8</code> và chạy trên JDK 8 thật ra cùng output. Validation làm sạch và kiểm input bằng hàm static, ném Exception mang câu báo lỗi cho người dùng; repository là nơi DUY NHẤT giữ danh sách (chặn trùng + tìm không phân biệt hoa thường, trả bản sao DTO); service sắp một bản sao bằng Comparator hai khoá; Main lặp tới khi chọn 0 và gọi controller đúng một lần mỗi lựa chọn.</p>',
  },
});

export default moDun({ slug: 'pro192-lab-1-danh-muc-sach', ten: '1.4 Lab 1 — CT Library: the first book catalogue', de: [de] });
