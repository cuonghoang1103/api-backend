/** PRO192 · Lab 6 — CT Library: ngoại lệ nghiệp vụ, mượn và trả (checked exception, ném/bắt đúng tầng, try-with-resources). Nguồn: gen/lab/lab6. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab6', {
  tieuDe: { en: 'Lab 6 — CT Library: business exceptions, borrowing and returning', vi: 'Lab 6 — CT Library: ngoại lệ nghiệp vụ, mượn và trả' },
  phut: 180,
  khaiNiem: ['one checked exception class per business error', 'throw in repository/service, catch in controller', 'exception hierarchy (LibraryException)', 'menu that never crashes'],
  moTa: {
    en: `<p><b>Ticket CTL-6.</b> The club starts lending for real: menu 10 borrows, menu 11 returns. Every business error gets its own <b>checked</b> exception class under <code>LibraryException</code> — item not found, member not found, duplicate key, no copy left, more than 3 open loans, returning something that was not borrowed — thrown where the rule is checked (repository/service) and caught in the controller, which shows the message. The menu never crashes, whatever is typed.</p>
<p>Your TODOs are listed below; the walkthrough is lesson <b>Lab 6</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-6.</b> CLB cho mượn thật: menu 10 mượn, menu 11 trả. Mỗi lỗi nghiệp vụ có lớp ngoại lệ <b>checked</b> riêng dưới <code>LibraryException</code> — không thấy tài liệu, không thấy thành viên, trùng khoá, hết bản, quá 3 lượt đang mượn, trả thứ chưa mượn — ném ở nơi kiểm luật (repository/service) và bắt ở controller, nơi hiện câu báo. Menu không bao giờ sập, gõ gì cũng vậy.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn là bài <b>Lab 6</b> của khoá.</p>`,
  },
  thay: [['le van cuong', 'tran thi mai'], ['Joshua Bloch', 'joshua   BLOCH']],
  menuRac: '2',
  quyTac: [{ id: 'R1', en: 'no catch (Exception e) that swallows everything', vi: 'không catch (Exception e) nuốt mọi thứ', re: String.raw`catch\s*\(\s*(final\s+)?(Exception|Throwable)\s+\w+\s*\)` }],
  goiY: [
    { en: 'Each exception class is three lines: extends LibraryException (or Exception) and a constructor calling super(message).', vi: 'Mỗi lớp ngoại lệ ba dòng: extends LibraryException (hoặc Exception) và constructor gọi super(message).' },
    { en: 'The repository throws when it cannot find; the service throws when a business rule is broken; only the controller catches — and catches LibraryException once if the message format is the same.', vi: 'Repository ném khi không tìm thấy; service ném khi phạm luật nghiệp vụ; chỉ controller bắt — và bắt LibraryException một lần nếu định dạng câu báo như nhau.' },
    { en: 'Check every rule BEFORE changing any data: a borrow that fails half-way must not leave a loan without a copy taken (or the reverse).', vi: 'Kiểm mọi luật TRƯỚC khi đổi dữ liệu: một lượt mượn hỏng giữa chừng không được để lại phiếu mượn mà chưa trừ bản (hoặc ngược lại).' },
  ],
  loiHayGap: [
    { en: 'catch (Exception e) {} or printing e.toString() — the user sees "exceptions.LoanLimitException: …" or nothing at all (rule R1, rule L4).', vi: 'catch (Exception e) {} hoặc in e.toString() — người dùng thấy "exceptions.LoanLimitException: …" hoặc không thấy gì (luật R1, L4).' },
    { en: 'Catching in the repository and returning null — the controller cannot tell "not found" from other problems.', vi: 'Bắt ở repository rồi trả null — controller không phân biệt được "không thấy" với lỗi khác.' },
    { en: 'Closing a Scanner(System.in) in a finally/try-with-resources — the next menu read throws NoSuchElementException.', vi: 'Đóng Scanner(System.in) trong finally/try-with-resources — lần đọc menu sau ném NoSuchElementException.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 6 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule). A small hierarchy of checked exceptions turns every broken rule into a typed, documented outcome that travels up to the one place that shows messages.</p>', vi: '<p>Lời giải là đáp án Lab 6 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10). Một cây nhỏ ngoại lệ checked biến mỗi luật bị phạm thành kết quả có kiểu, có ghi rõ, đi lên tới nơi duy nhất hiện câu báo.</p>' },
});

export default moDun({ slug: 'pro192-lab-6-ngoai-le-muon-tra', ten: '6.3 Lab 6 — CT Library: business exceptions, borrowing and returning', de: [de] });
