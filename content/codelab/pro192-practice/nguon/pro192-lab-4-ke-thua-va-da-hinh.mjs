/** PRO192 · Lab 4 — CT Library: kế thừa và đa hình (LibraryItem → Book, Magazine, Dvd; @Override; phí trễ không instanceof). Nguồn: gen/lab/lab4. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab4', {
  tieuDe: { en: 'Lab 4 — CT Library: inheritance and polymorphism', vi: 'Lab 4 — CT Library: kế thừa và đa hình' },
  phut: 180,
  khaiNiem: ['LibraryItem → Book / Magazine / Dvd', '@Override', 'late fee by polymorphism (no instanceof)', 'duplicate key per type'],
  moTa: {
    en: `<p><b>Ticket CTL-4.</b> The club now lends magazines and DVDs too. <code>LibraryItem</code> becomes the parent of <code>Book</code>, <code>Magazine</code> (issue number) and <code>Dvd</code> (minutes); each type overrides its loan period, its late fee per day, its detail column and its duplicate key. Menu 9 computes the late fee of an item kept N days — <b>without</b> <code>instanceof</code>: the object knows its own rule.</p>
<p>Your TODOs are listed below; the walkthrough is lesson <b>Lab 4</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-4.</b> CLB cho mượn thêm tạp chí và DVD. <code>LibraryItem</code> thành lớp cha của <code>Book</code>, <code>Magazine</code> (số kỳ) và <code>Dvd</code> (số phút); mỗi loại ghi đè hạn mượn, phí trễ mỗi ngày, cột chi tiết và khoá chống trùng của nó. Menu 9 tính phí trễ của một tài liệu giữ N ngày — <b>không</b> dùng <code>instanceof</code>: đối tượng tự biết luật của nó.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn là bài <b>Lab 4</b> của khoá.</p>`,
  },
  thay: [['tech   weekly', 'java   monthly'], ['tech weekly', 'java monthly'], ['the imitation game', 'interstellar'], ['\n20\n', '\n31\n'], ['\nthe\n', '\njava\n']],
  menuRac: '2',
  quyTac: [{ id: 'R1', en: 'no instanceof in the late-fee code (polymorphism decides)', vi: 'không instanceof trong phần tính phí trễ (đa hình tự quyết)', re: String.raw`\binstanceof\b` }],
  goiY: [
    { en: 'Put the common part (id, title, year, copies, the late-fee formula) in LibraryItem; each subclass overrides only what differs (loan days, fee per day, detail, key).', vi: 'Phần chung (mã, tên, năm, số bản, công thức phí trễ) đặt ở LibraryItem; mỗi lớp con chỉ ghi đè chỗ khác (số ngày mượn, phí mỗi ngày, chi tiết, khoá).' },
    { en: 'The controller asks item.lateFee(days) on a LibraryItem reference — Java runs Book’s, Magazine’s or Dvd’s rule.', vi: 'Controller gọi item.lateFee(days) trên tham chiếu LibraryItem — Java chạy luật của Book, Magazine hay Dvd.' },
    { en: 'Each subclass constructor passes the shared values up with super(...) as its first statement.', vi: 'Constructor mỗi lớp con đẩy các giá trị chung lên bằng super(...) ở câu đầu tiên.' },
  ],
  loiHayGap: [
    { en: 'if (item instanceof Book) … else if (item instanceof Dvd) … for the fee — rule R1 fails, and a new item type means editing the controller.', vi: 'if (item instanceof Book) … else if (item instanceof Dvd) … để tính phí — luật R1 trượt, và thêm loại mới là phải sửa controller.' },
    { en: 'Overriding with a slightly different signature (lateFee(long)) — without @Override it compiles as an overload and the parent rule runs.', vi: 'Ghi đè với chữ ký hơi khác (lateFee(long)) — thiếu @Override thì nó biên dịch thành nạp chồng và luật của cha chạy.' },
    { en: 'Forgetting super(...) in a subclass constructor, or calling it after another statement — compile error.', vi: 'Quên super(...) trong constructor lớp con, hoặc gọi sau câu lệnh khác — lỗi biên dịch.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 4 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule). The hierarchy keeps the shared data and algorithm in LibraryItem and the variations in three overriding subclasses; the controller never asks for the concrete type.</p>', vi: '<p>Lời giải là đáp án Lab 4 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10). Cây kế thừa giữ dữ liệu và thuật toán chung ở LibraryItem, phần khác nhau ở ba lớp con ghi đè; controller không bao giờ hỏi kiểu cụ thể.</p>' },
});

export default moDun({ slug: 'pro192-lab-4-ke-thua-va-da-hinh', ten: '4.4 Lab 4 — CT Library: inheritance and polymorphism', de: [de] });
