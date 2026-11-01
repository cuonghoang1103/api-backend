/** PRO192 · Lab 5 — CT Library: lớp trừu tượng và interface (LibraryItem abstract, IBookRepository, IFeePolicy). Nguồn: gen/lab/lab5. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab5', {
  tieuDe: { en: 'Lab 5 — CT Library: abstract classes and interfaces', vi: 'Lab 5 — CT Library: lớp trừu tượng và interface' },
  phut: 180,
  khaiNiem: ['abstract LibraryItem', 'IBookRepository + InMemoryBookRepository', 'IFeePolicy strategy', 'program to an interface'],
  moTa: {
    en: `<p><b>Ticket CTL-5.</b> Prepare CT Library for change. <code>LibraryItem</code> becomes <b>abstract</b> (nobody borrows "an item"); the repository is split into the interface <code>IBookRepository</code> and the class <code>InMemoryBookRepository</code>, and the controller knows only the interface — so Lab 9 can plug in a file repository by changing one line. Late fees depend on a fee policy (<code>IFeePolicy</code>: student or staff), chosen at run time.</p>
<p>Your TODOs are listed below; the walkthrough is lesson <b>Lab 5</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-5.</b> Chuẩn bị CT Library cho thay đổi. <code>LibraryItem</code> thành <b>abstract</b> (không ai mượn "một tài liệu" chung chung); repository tách thành interface <code>IBookRepository</code> và lớp <code>InMemoryBookRepository</code>, controller chỉ biết interface — để Lab 9 cắm kho tệp vào bằng cách đổi một dòng. Phí trễ theo chính sách phí (<code>IFeePolicy</code>: sinh viên hay cán bộ), chọn lúc chạy.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn là bài <b>Lab 5</b> của khoá.</p>`,
  },
  thay: [['\nthe imitation game\n', '\ninterstellar\n'], ['\n20\n', '\n27\n']],
  menuRac: '2',
  goiY: [
    { en: 'An abstract method has no body and ends with ";" — every concrete subclass must implement it, or the compiler refuses.', vi: 'Phương thức trừu tượng không có thân và kết thúc bằng ";" — mọi lớp con cụ thể phải cài nó, không thì trình biên dịch từ chối.' },
    { en: 'Declare the controller’s field with the interface type (IBookRepository) and create the implementation in one place only.', vi: 'Khai báo trường của controller bằng kiểu interface (IBookRepository) và chỉ tạo lớp cài đặt ở đúng một chỗ.' },
    { en: 'The fee policy is a strategy object: the service asks policy.feePerDay(item) (or similar) instead of testing the member type.', vi: 'Chính sách phí là đối tượng chiến lược: service hỏi policy (vd phí mỗi ngày của tài liệu) thay vì kiểm loại thành viên.' },
  ],
  loiHayGap: [
    { en: 'Declaring constants in an interface without realising they are public static final — then "changing" them per class is impossible.', vi: 'Khai báo hằng trong interface mà không biết chúng là public static final — "đổi" theo từng lớp là không thể.' },
    { en: 'new LibraryItem(...) somewhere left over from Lab 4 — it no longer compiles once the class is abstract.', vi: 'Còn sót new LibraryItem(...) từ Lab 4 — không biên dịch được khi lớp đã abstract.' },
    { en: 'The controller declaring InMemoryBookRepository as its field type — Lab 9 then has to edit every method that uses it.', vi: 'Controller khai báo trường kiểu InMemoryBookRepository — Lab 9 phải sửa mọi phương thức dùng nó.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 5 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule). Abstraction is used twice: an abstract class for the item family and interfaces for the two things that will change (storage and fee policy).</p>', vi: '<p>Lời giải là đáp án Lab 5 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10). Trừu tượng dùng hai lần: lớp trừu tượng cho họ tài liệu và interface cho hai thứ sẽ đổi (nơi lưu và chính sách phí).</p>' },
});

export default moDun({ slug: 'pro192-lab-5-truu-tuong-va-interface', ten: '5.3 Lab 5 — CT Library: abstract classes and interfaces', de: [de] });
