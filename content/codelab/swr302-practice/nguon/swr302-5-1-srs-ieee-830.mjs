/**
 * SWR302 · 5.1 — The SRS: purpose, audiences and the template (Wiegers Ch.10; IEEE 830 / ISO 29148).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'SRS 1 — the top-level sections of the template',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers’ SRS template (Figure 10-2, derived from IEEE 830): Introduction · Overall description · System features · Data requirements · External interface requirements · Quality attributes · Internationalization and localization requirements · Other requirements, then the appendices Glossary and Analysis models. Put the sections in order.</p>', vi: '<p>Template SRS của Wiegers (Hình 10-2, dựa trên IEEE 830). Sắp các mục cho đúng thứ tự.</p>' },
  cau: [{ en: 'Order the sections', vi: 'Sắp các mục', dung: ['1 Introduction', '2 Overall description', '3 System features', '4 Data requirements', '5 External interface requirements', '6 Quality attributes', '7 Internationalization and localization requirements', '8 Other requirements', 'Appendix A: Glossary', 'Appendix B: Analysis models'], hien: [5, 2, 9, 0, 7, 3, 1, 8, 4, 6], giai: ['Context first (1–2), then functions (3), data (4), interfaces (5), quality (6), i18n (7), other (8), appendices.', 'Bối cảnh trước (1–2), rồi chức năng (3), dữ liệu (4), giao diện (5), chất lượng (6), i18n (7), khác (8), phụ lục.'] }],
  goiY: ['Bối cảnh (giới thiệu, mô tả tổng quan) luôn đứng đầu.', 'Chức năng (system features) đứng ngay sau bối cảnh, trước dữ liệu và giao diện.'],
  loiHayGap: ['Đặt quality attributes trước system features.', 'Quên phụ lục Glossary.'],
  giaiThich: '<p>1 Introduction → 2 Overall description → 3 System features → 4 Data requirements → 5 External interface requirements → 6 Quality attributes → 7 Internationalization → 8 Other requirements → Appendix A Glossary → Appendix B Analysis models.</p>',
  thuatNgu: tn('srs'),
  khaiNiem: ['SRS template'],
});

const MUC = ['1.1 Purpose', '1.3 Project scope', '2.1 Product perspective', '2.2 User classes and characteristics', '2.3 Operating environment', '2.4 Design and implementation constraints', '2.5 Assumptions and dependencies', '3 System features', '4 Data requirements', '5.1 User interfaces', '5.2 Software interfaces', '6 Quality attributes'];
const E2 = phanLoai({
  tieuDe: 'SRS 2 — which section of the SRS?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Statements from the SRS of a university e-library. Choose the section of the Wiegers template.</p>', vi: '<p>Các phát biểu trong SRS của thư viện điện tử. Chọn mục của template Wiegers.</p>' },
  cot: 'Section', luaChon: MUC,
  hang: [
    ['This SRS specifies release 1.0 of the e-library for readers, librarians and IT.', '1.1 Purpose'],
    ['The e-library replaces the desktop catalogue and adds e-book lending; printed-book acquisition stays outside it.', '2.1 Product perspective'],
    ['Readers are students and lecturers; most use phones; some lecturers rarely use computers.', '2.2 User classes and characteristics'],
    ['The system runs in the university data centre on Ubuntu servers; clients use any current browser.', '2.3 Operating environment'],
    ['E-books must be protected with the publisher’s DRM library.', '2.4 Design and implementation constraints'],
    ['We assume the publishers’ APIs stay available during the project.', '2.5 Assumptions and dependencies'],
    ['The system shall let a reader borrow an e-book for 14 days.', '3 System features'],
    ['A loan consists of reader ID, e-book ID, start date and due date.', '4 Data requirements'],
    ['The e-library shall obtain e-book licences from the publisher through its REST API.', '5.2 Software interfaces'],
    ['Search shall return the first page of results within 2 seconds for 95% of queries.', '6 Quality attributes'],
  ],
  giaiThich: '<p>Section 2 frames the product (where it fits, who uses it, where it runs, what limits it, what we assume); section 3 holds functions; 4 data; 5 interfaces by kind; 6 quality attributes.</p>',
  goiY: ['Phần 2 là bối cảnh sản phẩm; phần 3 là chức năng.', 'Giao diện với phần mềm khác ⇒ 5.2.'],
  loiHayGap: ['Đặt "dùng thư viện DRM" vào quality attributes — đó là ràng buộc (2.4).', 'Đặt giả định vào rủi ro.'],
  thuatNgu: tn('srs', 'constraint'),
  khaiNiem: ['SRS template sections'],
});

const E3 = tracNghiem({
  tieuDe: 'SRS 3 — purpose and audiences',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The SRS is read by many audiences: customers and marketing (what they will get), project managers (estimates and plans), developers (what to build), testers (what to verify), maintainers, documentation writers and legal staff. It describes WHAT the system does, not HOW it is designed.</p>', vi: '<p>SRS có nhiều đối tượng đọc: khách hàng và marketing (sẽ nhận được gì), quản lý dự án (ước lượng, kế hoạch), dev (xây gì), tester (kiểm gì), người bảo trì, người viết tài liệu, pháp chế. Nó mô tả hệ thống LÀM GÌ, không phải thiết kế THẾ NÀO.</p>' },
  cau: [
    { en: 'Which audience uses the SRS to write test cases?', vi: 'Đối tượng nào dùng SRS để viết test case?', lc: [['a', 'Testers'], ['b', 'Marketing'], ['c', 'Legal staff'], ['d', 'The sponsor only']], dap: 'a', giai: ['Every requirement must be verifiable for them.', 'Mỗi yêu cầu phải kiểm chứng được với họ.'] },
    { en: 'Should the SRS describe the database tables?', vi: 'SRS có nên mô tả các bảng CSDL không?', lc: [['a', 'Yes, always'], ['b', 'No — it states what data is needed (data requirements), not how it is stored'], ['c', 'Only the primary keys'], ['d', 'Only for agile projects']], dap: 'b', giai: ['Design belongs to the design documents.', 'Thiết kế thuộc tài liệu thiết kế.'] },
    { en: 'One SRS or several?', vi: 'Một SRS hay nhiều?', lc: [['a', 'Always exactly one'], ['b', 'It depends: a large system may have one SRS per subsystem or release, plus a vision document'], ['c', 'Never more than one page'], ['d', 'One per developer']], dap: 'b', giai: ['Wiegers: organise by what the project needs.', 'Wiegers: tổ chức theo nhu cầu dự án.'] },
  ],
  goiY: ['SRS nói LÀM GÌ, không nói thiết kế THẾ NÀO.', 'Nhiều đối tượng đọc ⇒ viết rõ cho tất cả.'],
  loiHayGap: ['Đưa thiết kế CSDL vào SRS.', 'Viết SRS chỉ cho dev đọc.'],
  giaiThich: '<p>Answers: a · b · b.</p>',
  thuatNgu: tn('srs'),
  khaiNiem: ['SRS audiences'],
});

const E4 = phanLoai({
  tieuDe: 'SRS 4 — product requirement in the SRS, or elsewhere?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Not everything the team writes belongs in the SRS. Decide where each item goes: <b>SRS</b>, <b>Vision and scope</b>, <b>Project plan</b> or <b>Design document</b>.</p>', vi: '<p>Không phải mọi thứ đội viết đều thuộc SRS. Xác định mỗi mục vào đâu: <b>SRS</b>, <b>Vision and scope</b>, <b>Project plan</b> hay <b>Design document</b>.</p>' },
  cot: 'Document', luaChon: ['SRS', 'Vision and scope', 'Project plan', 'Design document'],
  hang: [
    ['Reduce printed-book purchases by 30% in three years.', 'Vision and scope'],
    ['The system shall notify a reader when a reserved e-book becomes available.', 'SRS'],
    ['Two developers will be assigned to the payment module in May.', 'Project plan'],
    ['The loans service publishes events on a Kafka topic.', 'Design document'],
    ['The e-library shall support 2,000 concurrent readers.', 'SRS'],
    ['Train the librarians in June.', 'Project plan'],
  ],
  giaiThich: '<p>Business objectives go to the vision and scope document; product requirements (functional and nonfunctional) to the SRS; resources and schedule to the project plan; architecture choices to the design document.</p>',
  goiY: ['Mục tiêu nghiệp vụ ⇒ Vision & Scope.', 'Ai làm gì khi nào ⇒ kế hoạch dự án; công nghệ nội bộ ⇒ thiết kế.'],
  loiHayGap: ['Đưa lựa chọn Kafka vào SRS.', 'Đưa lịch đào tạo vào SRS.'],
  thuatNgu: tn('srs', 'visionScope'),
  khaiNiem: ['SRS content'],
});

export default moDun({
  slug: 'swr302-5-1-srs-ieee-830',
  ten: '5.1 The SRS: template, sections and audiences',
  moTaModule: 'Thứ tự các mục của template SRS Wiegers (từ IEEE 830), đặt phát biểu vào đúng mục, đối tượng đọc SRS, cái gì vào SRS và cái gì vào tài liệu khác.',
  de: [E1, E3, E2, E4],
});
