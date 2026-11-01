/**
 * PRO192 · 🏁 Dự án cuối khoá CT Library 1.0 — một đề lớn nhiều phần: 8 "TODO DA" của starter khoá (đóng lượt + phạt theo chính sách
 * thẻ, nộp phạt, trả tài liệu qua 3 kho, nạp/lưu thành viên CSV, 3 báo cáo) trên dữ liệu mẫu tất định 200 / 300 / 2000 dòng, hai lần
 * chạy cùng thư mục. Nguồn: gen/lab/da (starter + solution + harness). Ngày làm việc là INPUT (không bao giờ Enter = hôm nay trong ca).
 */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('da', {
  id: 'pro192-da',
  tieuDe: { en: 'Final project — CT Library 1.0 (8 parts on 200 items, 300 members, 2,000 loans)', vi: 'Dự án cuối khoá — CT Library 1.0 (8 phần trên 200 tài liệu, 300 thành viên, 2.000 lượt mượn)' },
  doKho: 'HARD', phut: 480, dangBai: 'project',
  khaiNiem: ['fee policy per card type (Strategy in a HashMap) × fee per day of the item (polymorphism)', 'checked exception family caught once in the controller', 'three CSV repositories behind interfaces, saved after every change', 'reports with HashMap / TreeMap<YearMonth, …> and deterministic tie-breaks', 'broken lines skipped and reported'],
  moTa: {
    en: `<p><b>The final project of the course.</b> A reading club runs its library on three CSV files — ${c('data/books.csv')} (200 items: books, magazines, DVDs), ${c('data/members.csv')} (300 members: students and staff), ${c('data/loans.csv')} (2,000 loans, Jan–Oct 2026) — each with one deliberately broken line that the loader skips and reports. The program asks for the <b>working date</b> first, then offers 11 functions: search, add an item, a member card, add a member, borrow, return, pay a fine, three reports (top 10 borrowed, overdue loans, fine revenue by month) and change the working date. Data is saved after every change, so a second run in the same folder sees everything the first one did.</p>
<p><b>Rules</b> (each lives in ONE place): a card is <b>locked</b> while its debt is above 50,000đ; a student may hold 3 items, staff 5; loan periods 14 / 7 / 3 days and fees per day 2,000 / 1,000 / 5,000đ for book / magazine / DVD; a student pays 50% of the fine, staff get the first 2 late days free (${c('IFeePolicy')}: ${c('StudentFeePolicy')}, ${c('StaffFeePolicy')}); a borrow is refused for the FIRST broken rule in this order: locked card, limit reached, no copy left.</p>
<p>The given project (lesson <b>Final project</b> of the course) already contains the models, DTOs, views, the exception family, the two other file repositories, ${c('LoanService.createLoan')} and ${c('LoanController.borrowItem')} as worked samples. Your part is the <b>8 TODO DA</b> listed below — the graded core. The grader runs the program twice in the same folder on the club’s data (case 1 = the course’s ${c('harness/input.txt')} then ${c('input-2.txt')}, 557 lines compared), then hidden runs on other working dates and other actions.</p>`,
    vi: `<p><b>Dự án cuối khoá.</b> Một câu lạc bộ đọc sách quản lý thư viện trên ba tệp CSV — ${c('data/books.csv')} (200 tài liệu: sách, tạp chí, DVD), ${c('data/members.csv')} (300 thành viên: sinh viên và cán bộ), ${c('data/loans.csv')} (2.000 lượt mượn, tháng 1–10/2026) — mỗi tệp cố ý có một dòng hỏng mà bộ nạp bỏ qua và báo lại. Chương trình hỏi <b>ngày làm việc</b> trước, rồi có 11 chức năng: tìm, thêm tài liệu, thẻ thành viên, thêm thành viên, mượn, trả, nộp phạt, ba báo cáo (top 10 mượn nhiều, lượt quá hạn, doanh thu phạt theo tháng) và đổi ngày làm việc. Dữ liệu được lưu sau mỗi thay đổi, nên lần chạy thứ hai trong cùng thư mục thấy mọi thứ lần đầu đã làm.</p>
<p><b>Luật</b> (mỗi luật nằm ở MỘT chỗ): thẻ <b>bị khoá</b> khi nợ trên 50.000đ; sinh viên giữ tối đa 3 tài liệu, cán bộ 5; hạn mượn 14 / 7 / 3 ngày và phí mỗi ngày 2.000 / 1.000 / 5.000đ cho sách / tạp chí / DVD; sinh viên trả 50% tiền phạt, cán bộ được miễn 2 ngày trễ đầu (${c('IFeePolicy')}: ${c('StudentFeePolicy')}, ${c('StaffFeePolicy')}); mượn bị từ chối theo luật hỏng ĐẦU TIÊN theo thứ tự: thẻ khoá, hết hạn mức, hết bản trên kệ.</p>
<p>Dự án cho sẵn (bài <b>Dự án cuối khoá</b> của khoá) đã có model, DTO, view, họ ngoại lệ, hai kho tệp còn lại, ${c('LoanService.createLoan')} và ${c('LoanController.borrowItem')} làm mẫu. Phần của bạn là <b>8 TODO DA</b> liệt kê bên dưới — phần lõi được chấm. Máy chấm chạy chương trình hai lần trong cùng thư mục trên dữ liệu của câu lạc bộ (ca 1 = ${c('harness/input.txt')} rồi ${c('input-2.txt')} của khoá, so 557 dòng), rồi các lần chạy ẩn ở ngày làm việc khác với thao tác khác.</p>`,
  },
  yeuCau: {
    en: ['Finish the 8 TODO DA without changing the given classes’ public methods; keep each rule in one place (no if on the card type — ask the policy map).', 'Every change is saved at once (members.csv included); the second run must see it.', 'Case 1 replays the course’s harness; hidden runs use other working dates and other members/items. The LAB211 review rules L1–L7 are checked too.'],
    vi: ['Làm xong 8 TODO DA, không đổi các hàm public cho sẵn; mỗi luật ở một chỗ (không if theo loại thẻ — hỏi map chính sách).', 'Mọi thay đổi được lưu ngay (kể cả members.csv); lần chạy thứ hai phải thấy.', 'Ca 1 chạy lại harness của khoá; các lần chạy ẩn dùng ngày làm việc khác và thành viên/tài liệu khác. Máy chấm soát cả luật review LAB211 L1–L7.'],
  },
  dauVao: { en: 'The working date (dd/MM/yyyy), then menu choices and their fields, one per line — see tests/1.in and tests/1-session2.in; the data files are in tests/1/data/.', vi: 'Ngày làm việc (dd/MM/yyyy), rồi các lựa chọn menu và các ô của chúng, mỗi dòng một giá trị — xem tests/1.in và tests/1-session2.in; tệp dữ liệu ở tests/1/data/.' },
  dauRa: { en: 'Exactly the screens of the reference solution, both runs (the second after "===== RESTART …").', vi: 'Đúng từng màn hình của đáp án, cả hai lần chạy (lần hai sau "===== RESTART …").' },
  thay: [['15/10/2026', '22/10/2026']],
  timeoutMs: 30000,
  ca: [
    {
      ten: { en: 'another working date (after a wrong one), the three reports first, return + pay for an overdue member, a new staff member who borrows, then a restart', vi: 'ngày làm việc khác (sau một ngày sai), ba báo cáo trước, trả + nộp phạt cho người quá hạn, cán bộ mới mượn, rồi mở lại' },
      phien: [
        '18/13/2026\n18/10/2026\n9\n8\n10\n3\nM060\n6\nM060\nB001\n7\nM060\n1000\n7\nM060\nabc\n2000\n5\nM060\nB019\n4\n2\n  nguyen   thi   lan \nlan.nguyen@ctlibrary.example\n3\nM301\n5\nM301\nD185\n5\nM301\nB019\n0\n',
        '18/10/2026\n3\nM060\n3\nM301\n9\n0\n',
      ],
      an: true,
    },
    {
      ten: { en: 'wrong menu choices of every kind, an unknown member, a wrong item code then an item with no copy left, a return that does not exist, the date moved to the end of the year', vi: 'chọn menu sai đủ kiểu, thành viên không tồn tại, mã tài liệu sai rồi tài liệu hết bản, trả một lượt không có, dời ngày tới cuối năm' },
      phien: ['15/10/2026\nabc\n-3\n99\n\n 1x\n5\nM999\nB001\n5\nM001\nX123\nB150\n6\nM014\nB002\n11\n31/12/2026\n9\n10\n0\n'],
      an: true,
    },
  ],
  goiY: [
    { en: 'Read the worked samples first: LoanService.createLoan shows the order of the checks and the exceptions; FileLoanRepository.loadRow / saveToFile are the pattern for DA.4 / DA.5.', vi: 'Đọc các mẫu cho sẵn trước: LoanService.createLoan cho thấy thứ tự kiểm và các ngoại lệ; FileLoanRepository.loadRow / saveToFile là khuôn cho DA.4 / DA.5.' },
    { en: 'Fine = findPolicy(card type).calculateFee(daysLate, lateFeePerDay of the loan) — no if on the card type.', vi: 'Phạt = findPolicy(loại thẻ).calculateFee(số ngày trễ, phí mỗi ngày của lượt) — không if theo loại thẻ.' },
    { en: 'Reports: break ties by id (top: more loans first, then smaller item id; overdue: more days late first, then loan id) — the grader compares character by character.', vi: 'Báo cáo: phá thế hoà bằng mã (top: nhiều lượt trước, rồi mã tài liệu nhỏ; quá hạn: trễ nhiều trước, rồi mã lượt) — máy chấm so từng ký tự.' },
    { en: 'Revenue by month: a TreeMap<YearMonth, …> keyed by the RETURN date gives the months already in order.', vi: 'Doanh thu theo tháng: TreeMap<YearMonth, …> theo NGÀY TRẢ cho sẵn các tháng đúng thứ tự.' },
  ],
  loiHayGap: [
    { en: 'Forgetting to save members.csv after a payment or a new member — the second run shows the old debt and "301 members" becomes 300.', vi: 'Quên lưu members.csv sau khi nộp phạt hay thêm thành viên — lần chạy hai hiện nợ cũ và "301 thành viên" thành 300.' },
    { en: 'Counting the overdue loans among the RETURNED ones too — only open loans can be overdue.', vi: 'Đếm cả lượt ĐÃ TRẢ vào báo cáo quá hạn — chỉ lượt đang mở mới quá hạn được.' },
    { en: 'A broken line in members.csv (bad email) crashing the loader instead of being skipped and listed.', vi: 'Dòng hỏng trong members.csv (email sai) làm sập bộ nạp thay vì bị bỏ qua và liệt kê.' },
    { en: 'Grouping the revenue by the BORROW date — the fine exists only once the item is returned.', vi: 'Gom doanh thu theo ngày MƯỢN — tiền phạt chỉ có khi tài liệu đã được trả.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s CT Library 1.0 solution (lint.py clean, javac --release 8, same 557 lines on JDK 8; declarations switched to List/Map per the 29/10 LAB211 rule). Two independent hierarchies meet in one line — the item says how much per day (polymorphism), the card picks the fee policy (Strategy) — so a new card type is one class, and a rule change is one constant.</p>', vi: '<p>Lời giải là đáp án CT Library 1.0 của khoá (sạch lint.py, javac --release 8, cùng 557 dòng trên JDK 8; khai báo đổi sang List/Map theo luật LAB211 29/10). Hai cây kế thừa độc lập gặp nhau ở một dòng — tài liệu nói phí mỗi ngày (đa hình), thẻ chọn chính sách phạt (Strategy) — nên thêm loại thẻ là thêm một lớp, đổi luật là đổi một hằng.</p>' },
});

export default moDun({ slug: 'pro192-du-an-ct-library', ten: '12.1 🏁 Final project — CT Library 1.0', de: [de] });
