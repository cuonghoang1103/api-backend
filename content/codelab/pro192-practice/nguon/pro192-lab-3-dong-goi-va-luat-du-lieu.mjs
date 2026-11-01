/** PRO192 · Lab 3 — CT Library: đóng gói và luật dữ liệu (access modifier, static, xoá, thống kê, review code). Nguồn: gen/lab/lab3. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab3', {
  tieuDe: { en: 'Lab 3 — CT Library: encapsulation and data rules', vi: 'Lab 3 — CT Library: đóng gói và luật dữ liệu' },
  phut: 180,
  khaiNiem: ['private + validated setters', 'static counters and constants', 'delete without reusing ids', 'statistics'],
  moTa: {
    en: `<p><b>Ticket CTL-3.</b> Tighten the data rules and pass the encapsulation review: a publication year can be neither before 1450 nor in the future; an email must have a valid shape and must not belong to another member; a book can be deleted (and its id is never handed out again); menu 8 prints library statistics. Every field is private, every number and sentence lives in <code>Constants</code>/<code>Message</code>, and lint.py reports 0 violations.</p>
<p>Your TODOs are listed below; the walkthrough (with the reviewer’s questions) is lesson <b>Lab 3</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-3.</b> Siết luật dữ liệu và qua vòng review đóng gói: năm xuất bản không trước 1450 và không ở tương lai; email phải đúng dạng và không thuộc thành viên khác; sách xoá được (và mã của nó không bao giờ cấp lại); menu 8 in thống kê thư viện. Mọi trường private, mọi con số và câu chữ nằm trong <code>Constants</code>/<code>Message</code>, lint.py báo 0 vi phạm.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn (kèm câu thầy hay hỏi) là bài <b>Lab 3</b> của khoá.</p>`,
  },
  thay: [['refactoring', 'domain driven design'], ['9780134757599', '9781234567897'], ['martin fowler', 'eric   evans'], ['effective java', 'effective java third edition'], ['design patterns', 'the c programming language'], ['9780201633610', '9780131103627'], ['erich gamma', 'brian kernighan'], ['le van cuong', 'tran thi mai'], ['cuong.le@ctlib.vn', 'mai.tran@ctlib.vn']],
  menuRac: '7',
  goiY: [
    { en: 'A rule that needs the list (email already used, id exists) belongs in the repository; a rule about one value (year range, email shape) belongs in Validation.', vi: 'Luật cần tới danh sách (email đã dùng, mã đã có) thuộc repository; luật về một giá trị (khoảng năm, dạng email) thuộc Validation.' },
    { en: 'The upper bound of the year is "this year": take it from the clock once (e.g. java.time.Year.now().getValue() or Calendar) — never a hard-coded 2026.', vi: 'Cận trên của năm là "năm nay": lấy từ đồng hồ một lần (vd java.time.Year.now().getValue() hoặc Calendar) — không viết cứng 2026.' },
    { en: 'Deleting a book removes it from the list but does not decrease the id counter, so B004 is never reused.', vi: 'Xoá sách là bỏ khỏi danh sách nhưng không giảm bộ đếm mã, nên B004 không bao giờ bị cấp lại.' },
  ],
  loiHayGap: [
    { en: 'Removing from the list inside a for-each loop over the same list — ConcurrentModificationException. Find first, then remove.', vi: 'Xoá khỏi danh sách trong vòng for-each trên chính danh sách đó — ConcurrentModificationException. Tìm trước, xoá sau.' },
    { en: 'Comparing emails case-sensitively — AN.NGUYEN@ctlib.vn and an.nguyen@ctlib.vn are the same mailbox.', vi: 'So email phân biệt hoa thường — AN.NGUYEN@ctlib.vn và an.nguyen@ctlib.vn là cùng một hộp thư.' },
    { en: 'A public field "just for the statistics" — the review (and rule L5) rejects it; add a getter or let the repository count.', vi: 'Một trường public "chỉ để thống kê" — review (và luật L5) từ chối; thêm getter hoặc để repository đếm.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 3 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule). Validation checks single values and throws with the user-facing message, repositories enforce uniqueness and own the id counters, the service computes the statistics from data the controller passes in.</p>', vi: '<p>Lời giải là đáp án Lab 3 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10). Validation kiểm từng giá trị và ném câu báo lỗi cho người dùng, repository giữ tính duy nhất và bộ đếm mã, service tính thống kê từ dữ liệu controller đưa vào.</p>' },
});

export default moDun({ slug: 'pro192-lab-3-dong-goi-va-luat-du-lieu', ten: '3.3 Lab 3 — CT Library: encapsulation and data rules', de: [de] });
