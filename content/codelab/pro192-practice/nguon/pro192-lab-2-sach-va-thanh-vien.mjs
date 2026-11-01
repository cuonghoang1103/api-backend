/** PRO192 · Lab 2 — CT Library: lớp Book và Member thật (constructor, this, mã tự cấp, tham chiếu hay bản sao). Nguồn: gen/lab/lab2. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab2', {
  tieuDe: { en: 'Lab 2 — CT Library: real Book and Member classes', vi: 'Lab 2 — CT Library: lớp Book và Member thật' },
  phut: 180,
  khaiNiem: ['constructors + this(...)', 'auto-generated ids (B001, M001)', 'reference vs copy', 'validation of year/copies/email'],
  moTa: {
    en: `<p><b>Ticket CTL-2.</b> The catalogue becomes real objects: ${'<code>Book</code>'} gets an id, ISBN, title, author, year and number of copies; ${'<code>Member</code>'} (id, full name, email) joins the app. The repositories hand out ids B001, B002… and M001, M002…; menu 4 changes the number of copies of the <b>real</b> book in the list (not a copy of it — the bug this lab is about); menu 5–6 add and list members.</p>
<p>Your TODOs: the empty constructors via <code>this(...)</code>, the id generators, updating copies through the reference returned by <code>findBookById</code>, sorting members by name, and the validations (year and copies ranges, ids in upper case, emails in lower case with a valid shape). Walkthrough: lesson <b>Lab 2</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-2.</b> Danh mục thành đối tượng thật: <code>Book</code> có mã, ISBN, tên, tác giả, năm và số bản; <code>Member</code> (mã, họ tên, email) vào app. Repository cấp mã B001, B002… và M001, M002…; menu 4 sửa số bản của cuốn sách <b>thật</b> trong danh sách (không phải bản sao của nó — lỗi mà lab này nhắm tới); menu 5–6 thêm và liệt kê thành viên.</p>
<p>Các TODO: constructor rỗng bằng <code>this(...)</code>, bộ cấp mã, sửa số bản qua tham chiếu mà <code>findBookById</code> trả về, sắp thành viên theo tên, và các phép kiểm (khoảng năm và số bản, mã viết hoa, email viết thường đúng dạng). Hướng dẫn: bài <b>Lab 2</b> của khoá.</p>`,
  },
  thay: [['clean code', 'the mythical man month'], ['9780132350884', '9780201633610'], ['robert   c  MARTIN', 'frederick   p  BROOKS'], ['2008', '1975'], ['le   van cuong', 'tran   thi   mai'], ['Cuong.Le@CTLib.vn', 'Mai.Tran@CTLib.vn'], ['java', 'man']],
  menuRac: '6',
  goiY: [
    { en: 'An empty constructor that calls this("", "", "", "", 0, 0) keeps every field initialised by the one full constructor — no field is forgotten.', vi: 'Constructor rỗng gọi this("", "", "", "", 0, 0) để mọi trường được khởi tạo bởi đúng một constructor đầy đủ — không trường nào bị quên.' },
    { en: 'Id generator: a counter field in the repository + String.format(Constants.BOOK_ID_FORMAT, ++nextNumber). Ids are never reused.', vi: 'Bộ cấp mã: một trường đếm trong repository + String.format(Constants.BOOK_ID_FORMAT, ++nextNumber). Mã không bao giờ cấp lại.' },
    { en: 'Update copies: Book book = findBookById(id); book.setCopies(n); — book IS the object in the list, so the list changes. Building a new Book and setting it changes nothing.', vi: 'Sửa số bản: Book book = findBookById(id); book.setCopies(n); — book CHÍNH LÀ đối tượng trong danh sách, nên danh sách đổi. Tạo Book mới rồi sửa nó thì không đổi gì.' },
  ],
  loiHayGap: [
    { en: 'Updating a DTO or a copy of the book instead of the book found in the list — the list still shows the old number of copies.', vi: 'Sửa DTO hay bản sao của sách thay vì cuốn tìm được trong danh sách — danh sách vẫn hiện số bản cũ.' },
    { en: 'Comparing the id with == instead of equals — "B002" typed by the user is never found.', vi: 'So mã bằng == thay vì equals — "B002" người dùng gõ không bao giờ tìm thấy.' },
    { en: 'Upper-casing the email (or lower-casing the id) — the rules are the other way round.', vi: 'Viết hoa email (hoặc viết thường mã) — luật ngược lại.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 2 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule). Repositories own the lists and the id counters; findBookById returns the real object so the controller can change it in place; services sort copies; Validation normalises ids and emails before they reach the repository.</p>', vi: '<p>Lời giải là đáp án Lab 2 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10). Repository giữ danh sách và bộ đếm mã; findBookById trả về đối tượng thật để controller sửa tại chỗ; service sắp bản sao; Validation chuẩn hoá mã và email trước khi tới repository.</p>' },
});

export default moDun({ slug: 'pro192-lab-2-sach-va-thanh-vien', ten: '2.3 Lab 2 — CT Library: real Book and Member classes', de: [de] });
