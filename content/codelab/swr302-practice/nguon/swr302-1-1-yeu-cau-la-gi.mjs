/**
 * SWR302 · 1.1 — What is a requirement? Functional vs nonfunctional (Wiegers Ch.1 slides 1–5, 14).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'What is a requirement 1 — the definitions',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Two classic definitions open the course. Lawrence (1997): a requirement is <i>"anything that drives design choices"</i>. Sommerville &amp; Sawyer (1997): requirements are <i>"a specification of what should be implemented — descriptions of how the system should behave, or of a system property or attribute, or a constraint on the development process"</i>. Five questions on what counts as a requirement.</p>', vi: '<p>Hai định nghĩa kinh điển mở đầu môn học. Lawrence (1997): requirement là <i>"bất cứ điều gì chi phối lựa chọn thiết kế"</i>. Sommerville &amp; Sawyer (1997): requirement là <i>"đặc tả điều cần hiện thực — mô tả hệ thống phải hành xử thế nào, hoặc một thuộc tính của hệ thống, hoặc một ràng buộc lên quá trình phát triển"</i>. Năm câu về cái gì được tính là requirement.</p>' },
  cau: [
    { en: 'According to Sommerville & Sawyer, which of these can be a requirement?', vi: 'Theo Sommerville & Sawyer, cái nào có thể là một requirement?', lc: [['a', 'Only descriptions of system behaviour'], ['b', 'Behaviour, system properties and constraints on the development process'], ['c', 'Only what the customer writes in the contract'], ['d', 'Only the user interface']], dap: 'b', giai: ['Behaviour, properties (quality attributes) AND constraints all count.', 'Hành vi, thuộc tính (chất lượng) VÀ ràng buộc đều được tính.'] },
    { en: '"The app must be written in Kotlin because the company only has Kotlin developers." Is this a requirement?', vi: '"App phải viết bằng Kotlin vì công ty chỉ có lập trình viên Kotlin." Đây có phải requirement không?', lc: [['a', 'No — it is a design decision of the developers'], ['b', 'Yes — a constraint that drives design choices'], ['c', 'No — requirements never mention technology'], ['d', 'Yes — a functional requirement']], dap: 'b', giai: ['It limits the design choices, so by both definitions it is a requirement — a constraint.', 'Nó giới hạn lựa chọn thiết kế, nên theo cả hai định nghĩa đó là requirement — loại ràng buộc.'] },
    { en: 'Which statement describes WHAT the system does rather than HOW WELL it does it?', vi: 'Phát biểu nào mô tả hệ thống LÀM GÌ chứ không phải làm TỐT tới đâu?', lc: [['a', 'Search results appear within 2 seconds.'], ['b', 'The system shall let a reader renew a loan.'], ['c', 'The system is available 99.5% of the time.'], ['d', 'Passwords are stored hashed.']], dap: 'b', giai: ['Renewing a loan is a behaviour (functional); the others are properties (nonfunctional).', 'Gia hạn là một hành vi (chức năng); các câu khác là thuộc tính (phi chức năng).'] },
    { en: 'Nonfunctional requirements are…', vi: 'Yêu cầu phi chức năng là…', lc: [['a', 'less important than functional ones and can be added at the end'], ['b', 'quality attributes, external interfaces and constraints — as important as functions'], ['c', 'only performance requirements'], ['d', 'requirements that are not implemented']], dap: 'b', giai: ['Wiegers: the SRS holds quality attributes, external interfaces and constraints next to functions; they shape the architecture.', 'Wiegers: SRS chứa thuộc tính chất lượng, giao diện ngoài và ràng buộc bên cạnh chức năng; chúng định hình kiến trúc.'] },
    { en: 'Why do requirements matter so much? Studies quoted in the course say about…', vi: 'Vì sao requirement quan trọng? Nghiên cứu được trích trong môn nói khoảng…', lc: [['a', '5% of defects come from requirements'], ['b', '50% of defects originate in requirements, and they are the most expensive to fix when found late'], ['c', 'requirements defects are cheap because they are only text'], ['d', 'most defects come from the compiler']], dap: 'b', giai: ['Martin & Leffingwell: about half of the defects start in requirements, and fixing them late costs many times more.', 'Martin & Leffingwell: khoảng một nửa lỗi bắt nguồn từ yêu cầu, và sửa muộn tốn gấp nhiều lần.'] },
  ],
  goiY: ['Requirement không chỉ là "chức năng": còn thuộc tính chất lượng và ràng buộc.', 'Hỏi: câu này nói hệ thống LÀM GÌ (chức năng) hay làm TỐT tới đâu / bị GIỚI HẠN gì (phi chức năng)?'],
  loiHayGap: ['Cho rằng ràng buộc công nghệ không phải requirement.', 'Coi yêu cầu phi chức năng là "phụ", để cuối dự án mới tính.'],
  giaiThich: '<p>Answers: b · b · b · b · b — a requirement is anything that drives design choices: behaviour, properties and constraints.</p>',
  thuatNgu: tn('requirement', 'functionalReq', 'nfr', 'constraint'),
  khaiNiem: ['requirement definition', 'functional vs nonfunctional'],
});

const LOAI3 = ['Functional', 'Quality attribute', 'Constraint'];
const E2 = phanLoai({
  tieuDe: 'What is a requirement 2 — functional, quality attribute or constraint?',
  doKho: 'EASY', phut: 8,
  moTa: { en: '<p><b>LibraryLite</b> is a small library app for a high school. Classify each requirement: <b>Functional</b> (a behaviour of the system), <b>Quality attribute</b> (how well — speed, availability, security, usability…) or <b>Constraint</b> (a limit on the design or implementation choices).</p>', vi: '<p><b>LibraryLite</b> là app thư viện nhỏ của một trường THPT. Phân loại từng yêu cầu: <b>Functional</b> (hành vi của hệ thống), <b>Quality attribute</b> (làm tốt tới đâu — tốc độ, sẵn sàng, bảo mật, dễ dùng…) hay <b>Constraint</b> (giới hạn lựa chọn thiết kế/hiện thực).</p>' },
  cot: 'Kind', luaChon: LOAI3,
  hang: [
    ['The system shall let a librarian register a new book by scanning its ISBN.', 'Functional', 'Cho thủ thư đăng ký sách mới bằng quét ISBN.'],
    ['Catalogue searches shall return results within 1 second for 95% of queries.', 'Quality attribute', 'Tìm kiếm trả kết quả trong 1 giây với 95% truy vấn.'],
    ['The app must run on the school’s existing Windows 10 PCs.', 'Constraint', 'App phải chạy trên máy Windows 10 sẵn có của trường.'],
    ['The system shall e-mail a reminder 2 days before a loan is due.', 'Functional', 'E-mail nhắc 2 ngày trước hạn trả.'],
    ['A new student shall borrow a first book without help within 3 minutes.', 'Quality attribute', 'Học sinh mới mượn cuốn đầu tiên không cần trợ giúp trong 3 phút.'],
    ['The data must be stored in the MySQL server the school already licenses.', 'Constraint', 'Dữ liệu phải lưu trên máy chủ MySQL trường đã mua bản quyền.'],
    ['The system shall calculate the overdue fine when a book is returned late.', 'Functional', 'Tính tiền phạt khi trả sách trễ.'],
    ['Only librarians shall be able to delete a book record.', 'Quality attribute', 'Chỉ thủ thư được xoá hồ sơ sách (bảo mật).'],
    ['The system shall be available from 07:00 to 17:00 on school days with 99% uptime.', 'Quality attribute', 'Sẵn sàng 07:00–17:00 ngày học với 99% thời gian.'],
    ['The user interface must follow the school’s colour guidelines.', 'Constraint', 'Giao diện phải theo quy chuẩn màu của trường.'],
  ],
  giaiThich: '<p>A behaviour the system performs ⇒ functional. How fast, how available, how secure, how easy ⇒ quality attribute. A limit imposed on the developers’ choices (platform, database, standards) ⇒ constraint.</p>',
  goiY: ['Có động từ hành động của hệ thống (register, e-mail, calculate)? ⇒ Functional.', 'Có thước đo "tốt tới đâu" hoặc nói ai được làm gì (bảo mật)? ⇒ Quality attribute. Bị áp đặt nền tảng/chuẩn? ⇒ Constraint.'],
  loiHayGap: ['Xếp "chỉ thủ thư được xoá" là Functional — đó là thuộc tính bảo mật (security).', 'Xếp "phải chạy trên Windows 10 sẵn có" là Quality attribute — đó là ràng buộc nền tảng.'],
  thuatNgu: tn('functionalReq', 'qualityAttr', 'constraint'),
  khaiNiem: ['functional requirement', 'quality attribute', 'constraint'],
});

const E3 = phanLoai({
  tieuDe: 'What is a requirement 3 — product or project requirement?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers separates <b>product requirements</b> (properties of the software to build — they go into the SRS) from <b>project requirements</b> (other work the project needs: hardware, training, user documentation, support, licences, beta tests, SLAs…, written in the project plan). Classify each item of the LibraryLite project.</p>', vi: '<p>Wiegers tách <b>yêu cầu sản phẩm</b> (thuộc tính của phần mềm cần xây — vào SRS) với <b>yêu cầu dự án</b> (việc khác dự án cần: phần cứng, đào tạo, tài liệu người dùng, hỗ trợ, bản quyền, beta test, SLA…, ghi trong kế hoạch dự án). Phân loại từng mục của dự án LibraryLite.</p>' },
  cot: 'Kind', luaChon: ['Product', 'Project'],
  hang: [
    ['Buy two barcode scanners for the library desk.', 'Project'],
    ['The system shall print a borrowing receipt.', 'Product'],
    ['Train the two librarians for half a day.', 'Project'],
    ['Write a one-page quick guide for students.', 'Project'],
    ['The system shall show which copies of a book are on loan.', 'Product'],
    ['Run a two-week beta test with one class.', 'Project'],
    ['Buy a licence of the barcode-reading library.', 'Project'],
    ['The system shall keep loan history for 3 years.', 'Product'],
  ],
  giaiThich: '<p>Only properties and behaviour of the software are product requirements. Equipment, training, documentation, beta testing and licences are project requirements: real needs, but they belong in the project plan, not in the SRS.</p>',
  goiY: ['Hỏi: mục này mô tả PHẦN MỀM, hay một VIỆC/VẬT dự án phải lo?', 'Tài liệu hướng dẫn và đào tạo là sản phẩm phụ của dự án, không phải hành vi phần mềm.'],
  loiHayGap: ['Đưa đào tạo, mua thiết bị vào SRS.', 'Coi "viết hướng dẫn sử dụng" là yêu cầu sản phẩm vì nó nói về phần mềm.'],
  thuatNgu: [{ en: 'product requirement', vi: 'yêu cầu sản phẩm — thuộc tính/hành vi của phần mềm' }, { en: 'project requirement', vi: 'yêu cầu dự án — việc khác dự án cần (thiết bị, đào tạo, tài liệu, SLA…)' }],
  khaiNiem: ['product vs project requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'What is a requirement 4 — find the requirement inside the talk',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Stakeholders rarely speak in requirements. For each sentence from a LibraryLite meeting, choose the best reading of what it really asks for.</p>', vi: '<p>Bên liên quan hiếm khi nói bằng yêu cầu. Với mỗi câu trong buổi họp LibraryLite, chọn cách hiểu đúng nhất điều họ thật sự yêu cầu.</p>' },
  cau: [
    { en: 'Librarian: "Students keep losing track of when their books are due."', vi: 'Thủ thư: "Học sinh hay quên hạn trả sách."', lc: [['a', 'A constraint on the database'], ['b', 'A need that can lead to a functional requirement such as due-date reminders'], ['c', 'A quality attribute about speed'], ['d', 'Not a requirement at all']], dap: 'b', giai: ['A problem statement points to a user need; reminders are one functional answer.', 'Một câu nêu vấn đề chỉ ra nhu cầu người dùng; nhắc hạn là một đáp án chức năng.'] },
    { en: 'Principal: "Parents must never see other students’ loans."', vi: 'Hiệu trưởng: "Phụ huynh không bao giờ được thấy lượt mượn của học sinh khác."', lc: [['a', 'Security quality attribute (privacy)'], ['b', 'User interface design'], ['c', 'Project requirement'], ['d', 'Performance']], dap: 'a', giai: ['Who may see what is a security/privacy quality attribute.', 'Ai được xem gì là thuộc tính chất lượng bảo mật/quyền riêng tư.'] },
    { en: 'IT teacher: "Use React for the front end, it is modern."', vi: 'GV tin học: "Dùng React cho giao diện, nó hiện đại."', lc: [['a', 'A requirement the BA must write as given'], ['b', 'A solution idea: ask whether there is a real constraint behind it (skills, policy) before treating it as a requirement'], ['c', 'A business requirement'], ['d', 'A user requirement']], dap: 'b', giai: ['A preferred technology is a solution idea unless a real constraint (policy, staff skills) makes it mandatory.', 'Một công nghệ ưa thích là ý tưởng giải pháp, trừ khi có ràng buộc thật (chính sách, kỹ năng nhân sự) bắt buộc nó.'] },
    { en: 'Librarian: "It has to be fast."', vi: 'Thủ thư: "Phải nhanh."', lc: [['a', 'A complete performance requirement'], ['b', 'The seed of a performance requirement that needs a number: which action, how fast, under what load'], ['c', 'A functional requirement'], ['d', 'A constraint']], dap: 'b', giai: ['"Fast" is a quality expectation; the BA must turn it into something measurable.', '"Nhanh" là kỳ vọng chất lượng; BA phải biến nó thành thứ đo được.'] },
  ],
  goiY: ['Câu của bên liên quan thường là nhu cầu, vấn đề hoặc giải pháp — BA dịch nó thành yêu cầu.', 'Một công nghệ được nêu tên chưa chắc là ràng buộc — hỏi "vì sao?".'],
  loiHayGap: ['Chép nguyên câu nói làm yêu cầu ("It has to be fast").', 'Biến mọi ý tưởng công nghệ thành ràng buộc.'],
  giaiThich: '<p>Answers: b · a · b · b.</p>',
  thuatNgu: [...tn('qualityAttr'), { en: 'solution idea', vi: 'ý tưởng giải pháp — người nói đề xuất CÁCH làm' }],
  khaiNiem: ['needs vs requirements', 'solution ideas'],
});

export default moDun({
  slug: 'swr302-1-1-yeu-cau-la-gi',
  ten: '1.1 What is a requirement? Functional vs nonfunctional',
  moTaModule: 'Hai định nghĩa kinh điển của requirement, phân biệt yêu cầu chức năng / thuộc tính chất lượng / ràng buộc, yêu cầu sản phẩm vs dự án, tìm yêu cầu thật trong lời bên liên quan.',
  de: [E1, E2, E3, E4],
});
