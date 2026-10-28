/**
 * SWR302 · 5.8 — Constraints, implementing quality requirements, and quality requirements in agile (Wiegers Ch.14 end).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Constraints 1 — constraint, quality attribute or functional?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A <b>constraint</b> restricts the options available to developers (a language, a platform, a standard, a component that must be used). A <b>quality attribute</b> says how well the system does something. A <b>functional requirement</b> says what the system does.</p>', vi: '<p><b>Ràng buộc</b> giới hạn lựa chọn của dev (ngôn ngữ, nền tảng, chuẩn, thành phần bắt buộc dùng). <b>Thuộc tính chất lượng</b> nói hệ thống làm TỐT tới mức nào. <b>Yêu cầu chức năng</b> nói hệ thống LÀM gì.</p>' },
  cot: 'Kind', luaChon: ['Constraint', 'Quality attribute', 'Functional requirement'],
  hang: [
    ['The system shall be written in Java 21 to match the hospital’s other systems.', 'Constraint'],
    ['The system shall store data only in servers located in Vietnam (Decree 13).', 'Constraint'],
    ['The system shall let a patient cancel an appointment up to 2 hours before it starts.', 'Functional requirement'],
    ['The system shall restore service within 30 minutes after a server failure.', 'Quality attribute'],
    ['Reports shall use the Ministry of Health’s Form 01 layout.', 'Constraint'],
    ['The system shall send a reminder SMS 24 hours before an appointment.', 'Functional requirement'],
    ['95% of new receptionists shall complete a booking without errors after a 1-hour training.', 'Quality attribute'],
  ],
  giaiThich: '<p>Constraints come from technology, standards, laws, the organisation or existing systems; they limit design choices. Quality attributes are measurable "how well"; functional requirements are behaviours.</p>',
  goiY: ['Bắt dùng một công nghệ/chuẩn/luật ⇒ ràng buộc.', 'Có thước đo "tốt tới đâu" ⇒ thuộc tính chất lượng.'],
  loiHayGap: ['Xếp "viết bằng Java" vào chất lượng.', 'Xếp mẫu báo cáo bắt buộc vào chức năng.'],
  thuatNgu: tn('constraint', 'qualityAttr', 'functionalReq'),
  khaiNiem: ['constraints'],
});

const E2 = tracNghiem({
  tieuDe: 'Constraints 2 — translating quality attributes into design and code',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers ("Translating quality attributes into technical specifications"): quality requirements usually become architecture and design decisions, and sometimes <b>derived functional requirements</b>. Example: a security requirement "lock after 5 failed attempts" needs a lock function, an unlock function and an admin screen.</p>', vi: '<p>Wiegers: yêu cầu chất lượng thường trở thành quyết định kiến trúc/thiết kế, đôi khi sinh ra <b>yêu cầu chức năng phái sinh</b>. Ví dụ: yêu cầu bảo mật "khoá sau 5 lần sai" cần chức năng khoá, mở khoá và màn hình quản trị.</p>' },
  cau: [
    { en: 'A reliability requirement "no lost bookings after a crash" most likely leads to…', vi: 'Yêu cầu tin cậy "không mất lịch hẹn sau sự cố" dẫn tới…', lc: [['a', 'transaction logging and recovery design'], ['b', 'a new colour scheme'], ['c', 'removing backups'], ['d', 'nothing']], dap: 'a', giai: ['Reliability ⇒ architecture choices.', 'Tin cậy ⇒ lựa chọn kiến trúc.'] },
    { en: 'An availability goal of 99.9% usually requires…', vi: 'Mục tiêu sẵn sàng 99,9% thường đòi hỏi…', lc: [['a', 'redundant servers and failover'], ['b', 'a longer SRS'], ['c', 'a single server'], ['d', 'more test cases only']], dap: 'a', giai: ['High availability is a structural decision.', 'Sẵn sàng cao là quyết định cấu trúc.'] },
    { en: 'Which is a derived functional requirement of "accounts lock after 5 failed logins"?', vi: 'Yêu cầu chức năng phái sinh của "khoá tài khoản sau 5 lần đăng nhập sai"?', lc: [['a', 'The system shall let an administrator unlock a locked account.'], ['b', 'The login page shall be blue.'], ['c', 'Use PostgreSQL.'], ['d', 'Train the users.']], dap: 'a', giai: ['Someone must be able to undo the lock.', 'Phải có cách mở khoá.'] },
  ],
  goiY: ['Thuộc tính chất lượng ⇒ kiến trúc + đôi khi yêu cầu chức năng phái sinh.', 'Khoá thì phải có mở khoá.'],
  loiHayGap: ['Cho rằng yêu cầu chất lượng chỉ cần test là xong.', 'Quên chức năng mở khoá.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('qualityAttr', 'constraint'),
  khaiNiem: ['implementing quality requirements'],
});

const E3 = tracNghiem({
  tieuDe: 'Constraints 3 — quality requirements in agile projects',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>In agile projects, quality requirements are often captured as <b>acceptance criteria</b> on user stories, as <b>constraint stories</b>, or in the <b>Definition of Done</b> when they apply to every story. Some (performance, scalability, security) must be considered early, because they shape the architecture and are expensive to add later.</p>', vi: '<p>Trong dự án agile, yêu cầu chất lượng thường được ghi thành <b>tiêu chí chấp nhận</b> của user story, <b>constraint story</b>, hoặc trong <b>Definition of Done</b> khi áp cho mọi story. Một số (hiệu năng, mở rộng, bảo mật) phải tính sớm vì chúng định hình kiến trúc và thêm sau rất tốn kém.</p>' },
  cau: [
    { en: '"Every screen must meet WCAG 2.2 AA." Where does it belong best?', vi: '"Mọi màn hình phải đạt WCAG 2.2 AA." Đặt ở đâu tốt nhất?', lc: [['a', 'In the Definition of Done'], ['b', 'In one user story only'], ['c', 'Nowhere'], ['d', 'In the retrospective notes']], dap: 'a', giai: ['It applies to every story.', 'Nó áp cho mọi story.'] },
    { en: '"Search returns in 1 s" for the search story belongs…', vi: '"Tìm kiếm trả về trong 1 giây" của story tìm kiếm thuộc…', lc: [['a', 'in the acceptance criteria of that story'], ['b', 'only in the final release notes'], ['c', 'in the sprint goal'], ['d', 'in the vision statement']], dap: 'a', giai: ['Specific to one story ⇒ its acceptance criteria.', 'Riêng một story ⇒ tiêu chí chấp nhận của story đó.'] },
    { en: 'Why must scalability be discussed in the first iterations?', vi: 'Vì sao phải bàn khả năng mở rộng từ những vòng đầu?', lc: [['a', 'It shapes the architecture; adding it later costs much more'], ['b', 'Because agile forbids it later'], ['c', 'Only to please the PO'], ['d', 'It does not matter']], dap: 'a', giai: ['Architecture-shaping attributes need early attention.', 'Thuộc tính định hình kiến trúc cần chú ý sớm.'] },
  ],
  goiY: ['Áp cho mọi story ⇒ DoD.', 'Riêng một story ⇒ acceptance criteria.'],
  loiHayGap: ['Để yêu cầu chất lượng tới cuối dự án.', 'Nhét WCAG vào một story duy nhất.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('acceptanceCriteria', 'userStory'),
  khaiNiem: ['quality requirements in agile'],
});

const E4 = phanLoai({
  tieuDe: 'Constraints 4 — where does the constraint come from?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Constraints restrict the developers’ options. They come from: <b>technology</b> (mandated languages, platforms, components), <b>standards and regulations</b>, the <b>organisation</b> (company policies, existing systems), or the <b>business</b> (budget, interoperability with partners, delivery dates). Classify the source.</p>', vi: '<p>Ràng buộc đến từ công nghệ, chuẩn/quy định, tổ chức, hoặc nghiệp vụ.</p>' },
  cot: 'Source', luaChon: ['Technology', 'Standards and regulations', 'Organisation', 'Business'],
  hang: [
    ['Must be written in Java 21 to reuse the company’s libraries.', 'Technology'],
    ['Health data must follow the Ministry of Health’s HL7 FHIR profile.', 'Standards and regulations'],
    ['All apps must use the corporate single sign-on.', 'Organisation'],
    ['The partner pharmacy chain only accepts orders through its existing EDI format.', 'Business'],
    ['Personal data must stay on servers in Vietnam (Decree 13).', 'Standards and regulations'],
  ],
  giaiThich: '<p>Knowing the source tells you who can relax a constraint — often nobody, if it is a law.</p>',
  goiY: ['Luật/nghị định/chuẩn ngành ⇒ standards and regulations.', 'Chính sách công ty ⇒ tổ chức.'],
  loiHayGap: ['Coi luật là ràng buộc công nghệ.', 'Coi chính sách SSO là quality attribute.'],
  thuatNgu: tn('constraint'),
  khaiNiem: ['constraints'],
});

export default moDun({
  slug: 'swr302-5-9-ch14-constraints-agile',
  ten: '5.9 Constraints and quality requirements in agile',
  moTaModule: 'Phân biệt ràng buộc / thuộc tính chất lượng / yêu cầu chức năng, yêu cầu chất lượng biến thành kiến trúc và yêu cầu chức năng phái sinh, đặt yêu cầu chất lượng vào DoD hay tiêu chí chấp nhận trong agile.',
  de: [E1, E2, E3, E4],
});
