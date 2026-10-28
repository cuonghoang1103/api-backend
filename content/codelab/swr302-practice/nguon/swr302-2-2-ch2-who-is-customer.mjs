/**
 * SWR302 · 2.2 — The expectation gap and who the customer is (Wiegers Ch.2 slides 1–7).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Customer 1 — stakeholder, customer or user?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers Figure 2-1: <b>users</b> are a subset of <b>customers</b>, and customers are a subset of <b>stakeholders</b>. A customer derives direct or indirect benefit from the product (requests, pays for, selects, specifies, uses or receives its output). <b>Direct users</b> operate the product; <b>indirect users</b> receive its outputs without touching it. Some stakeholders are not customers at all. Place each party of a hospital pharmacy system in its smallest set.</p>', vi: '<p>Hình 2-1: người dùng ⊂ khách hàng ⊂ bên liên quan. Người dùng trực tiếp thao tác sản phẩm; người dùng gián tiếp nhận đầu ra mà không chạm vào nó. Xếp mỗi bên vào tập nhỏ nhất của nó.</p>' },
  cot: 'Smallest set', luaChon: ['Direct user', 'Indirect user', 'Customer (not a user)', 'Stakeholder (not a customer)'],
  hang: [
    ['Pharmacist who dispenses medicines with the system', 'Direct user'],
    ['Head of pharmacy who only reads the weekly stock report e-mailed to her', 'Indirect user'],
    ['Hospital director who sponsors and pays for the project', 'Customer (not a user)'],
    ['External auditor who checks compliance with drug regulations', 'Stakeholder (not a customer)'],
    ['Nurse who records doses given on the ward tablet', 'Direct user'],
    ['Medicine supplier whose delivery schedule is affected', 'Stakeholder (not a customer)'],
    ['Procurement officer who selects the software vendor', 'Customer (not a user)'],
  ],
  giaiThich: '<p>Users supply user requirements; customers such as sponsors supply business requirements; other stakeholders bring constraints (regulations, contracts) but do not benefit from the product directly.</p>',
  goiY: ['Có chạm vào hệ thống không? Có ⇒ người dùng trực tiếp.', 'Không hưởng lợi từ sản phẩm (kiểm toán, nhà cung cấp) ⇒ chỉ là bên liên quan.'],
  loiHayGap: ['Coi nhà tài trợ là người dùng.', 'Bỏ sót người dùng gián tiếp nhận báo cáo.'],
  thuatNgu: tn('stakeholder', 'userClass'),
  khaiNiem: ['stakeholders, customers and users'],
});

const E2 = tracNghiem({
  tieuDe: 'Customer 2 — the expectation gap',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The <b>expectation gap</b>: what the customer expects and what the team delivers diverge because needs were never fully shared or understood. Every practice of Chapter 2 exists to close it — through participation, clear communication and explicit agreement, not mind-reading.</p>', vi: '<p><b>Khoảng cách kỳ vọng</b>: điều khách mong đợi và điều đội giao lệch nhau vì nhu cầu chưa từng được chia sẻ/hiểu đầy đủ.</p>' },
  cau: [
    { en: 'What closes the expectation gap best?', vi: 'Điều gì thu hẹp khoảng cách kỳ vọng tốt nhất?', lc: [['a', 'Frequent customer participation and explicit agreement on requirements'], ['b', 'A longer contract'], ['c', 'Hiring faster developers'], ['d', 'Delivering everything at the end']], dap: 'a', giai: ['Participation + communication + agreement.', 'Tham gia + giao tiếp + thống nhất.'] },
    { en: 'Who typically provides the business requirements?', vi: 'Ai thường cung cấp yêu cầu nghiệp vụ?', lc: [['a', 'Customers such as the executive sponsor'], ['b', 'Direct users only'], ['c', 'Developers'], ['d', 'Testers']], dap: 'a', giai: ['Sponsors set the framework; users fill in the user requirements.', 'Nhà tài trợ đặt khung; người dùng bổ sung yêu cầu người dùng.'] },
    { en: 'A manager offers to describe what the clerks need so you don’t "waste their time". Best response?', vi: 'Một quản lý đề nghị tự mô tả nhu cầu của nhân viên để "khỏi phí thời gian của họ". Trả lời tốt nhất?', lc: [['a', 'Thank them, and still talk to the real clerks — managers rarely know the details of the daily tasks'], ['b', 'Accept — managers know best'], ['c', 'Skip the clerks entirely'], ['d', 'Ask developers to guess']], dap: 'a', giai: ['Reach the real users.', 'Tiếp cận người dùng thật.'] },
  ],
  goiY: ['Khoảng cách kỳ vọng đóng lại nhờ tham gia và thống nhất, không nhờ đoán.', 'Quản lý không phải người dùng thật.'],
  loiHayGap: ['Chỉ nói chuyện với quản lý.', 'Cho rằng hợp đồng chi tiết thay được sự tham gia.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('stakeholder', 'businessReq', 'userReq'),
  khaiNiem: ['expectation gap'],
});

const E3 = phanLoai({
  tieuDe: 'Customer 3 — which kind of requirement does each party supply?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Different parties supply different levels of requirements: sponsors and other customers set <b>business requirements</b>; users describe <b>user requirements</b> (tasks, outputs, quality expectations); regulators, legal staff and other non-customer stakeholders impose <b>constraints and business rules</b>.</p>', vi: '<p>Mỗi bên cung cấp một cấp yêu cầu khác nhau.</p>' },
  cot: 'Mainly supplies', luaChon: ['Business requirements', 'User requirements', 'Constraints and business rules'],
  hang: [
    ['Hospital director: "Cut medicine waste by 20% this year."', 'Business requirements'],
    ['Pharmacist: "I need to see which prescriptions are waiting, oldest first."', 'User requirements'],
    ['Ministry of Health: "Controlled drugs must be logged with two signatures."', 'Constraints and business rules'],
    ['Nurse: "I record doses at the bedside, often with gloves on."', 'User requirements'],
    ['Legal department: "Patient data must stay on servers in Vietnam."', 'Constraints and business rules'],
  ],
  giaiThich: '<p>Knowing who supplies what tells you whom to ask about each kind of requirement and who decides.</p>',
  goiY: ['Mục tiêu kinh doanh ⇒ yêu cầu nghiệp vụ.', 'Luật, quy định ⇒ ràng buộc / luật nghiệp vụ.'],
  loiHayGap: ['Coi quy định của Bộ là yêu cầu người dùng.', 'Coi mục tiêu cắt giảm lãng phí là yêu cầu chức năng.'],
  thuatNgu: tn('businessReq', 'userReq', 'businessRule', 'constraint'),
  khaiNiem: ['sources of requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Customer 4 — direct and indirect users',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Direct users operate the product hands-on; indirect users receive its outputs (reports, notifications, labels) without touching it. Both are users with needs: what an indirect user needs from the output is a user requirement too.</p>', vi: '<p>Người dùng trực tiếp và gián tiếp đều có nhu cầu cần khai thác.</p>' },
  cau: [
    { en: 'A warehouse manager never logs in but receives a daily activity report by e-mail. She is…', vi: 'Quản lý kho không đăng nhập nhưng nhận báo cáo hằng ngày qua e-mail. Cô ấy là…', lc: [['a', 'an indirect user whose needs for the report must be elicited'], ['b', 'not relevant'], ['c', 'a direct user'], ['d', 'the sponsor']], dap: 'a', giai: ['Indirect users depend on outputs.', 'Người dùng gián tiếp phụ thuộc vào đầu ra.'] },
    { en: 'What can users usually describe well?', vi: 'Người dùng thường mô tả tốt điều gì?', lc: [['a', 'Their tasks, the outputs they need, and the quality characteristics they expect'], ['b', 'The database design'], ['c', 'The project budget'], ['d', 'The architecture']], dap: 'a', giai: ['Ask users about tasks, not designs.', 'Hỏi người dùng về công việc, không về thiết kế.'] },
  ],
  goiY: ['Không chạm vào nhưng dùng đầu ra ⇒ gián tiếp.', 'Hỏi người dùng về công việc của họ.'],
  loiHayGap: ['Bỏ qua người dùng gián tiếp.', 'Hỏi người dùng về kiến trúc.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('userClass', 'userReq'),
  khaiNiem: ['direct and indirect users'],
});

export default moDun({
  slug: 'swr302-2-2-ch2-who-is-customer',
  ten: '2.2 The expectation gap and who the customer is',
  moTaModule: 'Tập lồng nhau người dùng ⊂ khách hàng ⊂ bên liên quan, người dùng trực tiếp/gián tiếp, khoảng cách kỳ vọng, bên nào cung cấp cấp yêu cầu nào.',
  de: [E1, E2, E3, E4],
});
