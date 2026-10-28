/**
 * SWR302 · 2.1 — Stakeholders, customers, user classes and the product champion (Wiegers Ch.2, Ch.6).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Stakeholders 1 — stakeholder, customer, user',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: a <b>stakeholder</b> is a person, group or organisation that is actively involved in a project, is affected by its outcome or can influence it. <b>Customers</b> are the subset of stakeholders who derive a benefit from the product (they may pay for it, request it or use it). <b>Users</b> are customers who interact with the product — directly, or indirectly by receiving its outputs.</p>', vi: '<p>Wiegers: <b>bên liên quan</b> là người, nhóm hay tổ chức tham gia tích cực vào dự án, bị ảnh hưởng bởi kết quả, hoặc có thể tác động lên nó. <b>Khách hàng</b> là tập con của bên liên quan được hưởng lợi từ sản phẩm (trả tiền, yêu cầu hoặc dùng nó). <b>Người dùng</b> là khách hàng tương tác với sản phẩm — trực tiếp, hoặc gián tiếp bằng cách nhận đầu ra của nó.</p>' },
  cau: [
    { en: 'Which set is the largest?', vi: 'Tập nào lớn nhất?', lc: [['a', 'Users'], ['b', 'Customers'], ['c', 'Stakeholders'], ['d', 'They are the same set']], dap: 'c', giai: ['Users ⊂ customers ⊂ stakeholders.', 'Người dùng ⊂ khách hàng ⊂ bên liên quan.'] },
    { en: 'The government tax office that receives the monthly VAT file produced by a shop’s billing system is…', vi: 'Cơ quan thuế nhận tệp VAT hằng tháng do hệ thống bán hàng của cửa hàng sinh ra là…', lc: [['a', 'not a stakeholder'], ['b', 'a stakeholder (it can influence the requirements) — possibly an indirect user'], ['c', 'the product champion'], ['d', 'the sponsor']], dap: 'b', giai: ['It receives output and its regulations shape requirements.', 'Nó nhận đầu ra và quy định của nó định hình yêu cầu.'] },
    { en: 'A sales manager who reads the reports of a CRM but never logs in (the assistant prints them) is…', vi: 'Quản lý bán hàng đọc báo cáo CRM nhưng không bao giờ đăng nhập (thư ký in cho) là…', lc: [['a', 'a direct user'], ['b', 'an indirect user'], ['c', 'not a user'], ['d', 'a developer']], dap: 'b', giai: ['Indirect users receive the product’s outputs without touching it.', 'Người dùng gián tiếp nhận đầu ra mà không chạm vào sản phẩm.'] },
    { en: 'Why does the expectation gap appear between what customers expect and what developers build?', vi: 'Vì sao có "khoảng cách kỳ vọng" giữa điều khách mong và điều dev xây?', lc: [['a', 'Because developers are lazy'], ['b', 'Because communication about requirements is insufficient and needs change over time'], ['c', 'Because customers never know what they want'], ['d', 'It cannot be reduced']], dap: 'b', giai: ['Frequent customer engagement shrinks the gap (Ch.2 slide 4).', 'Tương tác thường xuyên với khách hàng thu hẹp khoảng cách (Ch.2 slide 4).'] },
  ],
  goiY: ['Người dùng ⊂ khách hàng ⊂ bên liên quan.', 'Người dùng gián tiếp nhận đầu ra mà không thao tác hệ thống.'],
  loiHayGap: ['Chỉ coi người trả tiền là khách hàng.', 'Bỏ sót người dùng gián tiếp và cơ quan quản lý.'],
  giaiThich: '<p>Answers: c · b · b · b.</p>',
  thuatNgu: tn('stakeholder', 'userClass'),
  khaiNiem: ['stakeholders', 'customers', 'users'],
});

const E2 = phanLoai({
  tieuDe: 'Stakeholders 2 — direct user, indirect user or other stakeholder?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p><b>MediBook</b> lets patients book appointments at a private clinic. Classify each party.</p>', vi: '<p><b>MediBook</b> cho bệnh nhân đặt lịch ở một phòng khám tư. Phân loại từng bên.</p>' },
  cot: 'Kind', luaChon: ['Direct user', 'Indirect user', 'Other stakeholder'],
  hang: [
    ['Patients who book an appointment in the app.', 'Direct user', 'Bệnh nhân đặt lịch trong app.'],
    ['Receptionists who confirm bookings on the clinic PC.', 'Direct user', 'Lễ tân xác nhận lịch trên máy của phòng khám.'],
    ['The clinic owner who reads a printed weekly occupancy report but never uses the app.', 'Indirect user', 'Chủ phòng khám đọc báo cáo in hằng tuần nhưng không dùng app.'],
    ['The Ministry of Health, whose rules on patient data the system must follow.', 'Other stakeholder', 'Bộ Y tế — hệ thống phải theo quy định về dữ liệu bệnh nhân.'],
    ['The software vendor’s developers.', 'Other stakeholder', 'Lập trình viên của nhà cung cấp phần mềm.'],
    ['Doctors who see their day schedule on a tablet.', 'Direct user', 'Bác sĩ xem lịch ngày trên máy tính bảng.'],
    ['The insurance company that receives monthly claim files exported by the system.', 'Indirect user', 'Công ty bảo hiểm nhận tệp yêu cầu bồi thường hằng tháng do hệ thống xuất.'],
  ],
  giaiThich: '<p>Direct users operate MediBook; indirect users only receive its outputs (reports, files); regulators and developers are stakeholders who influence the requirements without being users.</p>',
  goiY: ['Có thao tác hệ thống không? ⇒ direct user.', 'Chỉ nhận đầu ra (báo cáo, tệp)? ⇒ indirect user. Chỉ ảnh hưởng/bị ảnh hưởng? ⇒ other stakeholder.'],
  loiHayGap: ['Coi chủ phòng khám là direct user vì họ "dùng" báo cáo.', 'Bỏ Bộ Y tế ra khỏi danh sách bên liên quan.'],
  thuatNgu: tn('stakeholder'),
  khaiNiem: ['direct vs indirect users'],
});

const E3 = phanLoai({
  tieuDe: 'Stakeholders 3 — group the users into user classes',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>User classes group users by how they use the product: frequency, features used, privileges, experience. MediBook has four classes: <b>Patient</b> (books for self or family, occasional, mobile), <b>Front desk</b> (many bookings per day, can override rules), <b>Clinician</b> (sees own schedule, writes notes), <b>Administrator</b> (configures doctors, rooms, prices). Assign each person.</p>', vi: '<p>Lớp người dùng gom người dùng theo cách họ dùng sản phẩm: tần suất, tính năng dùng, quyền, kinh nghiệm. MediBook có bốn lớp: <b>Patient</b> (đặt cho mình/gia đình, thỉnh thoảng, dùng điện thoại), <b>Front desk</b> (nhiều lượt đặt mỗi ngày, được vượt luật), <b>Clinician</b> (xem lịch mình, ghi chú), <b>Administrator</b> (cấu hình bác sĩ, phòng, giá). Gán từng người.</p>' },
  cot: 'User class', luaChon: ['Patient', 'Front desk', 'Clinician', 'Administrator'],
  hang: [
    ['Ms Lan books her daughter’s vaccination twice a year.', 'Patient'],
    ['Mr Huy, receptionist, handles 120 phone bookings a day and sometimes books outside opening hours for VIPs.', 'Front desk'],
    ['Dr Minh checks his afternoon schedule and adds a note after each visit.', 'Clinician'],
    ['The IT staff member who adds a new dermatology room and its price list.', 'Administrator'],
    ['A nurse who records blood pressure in the visit note.', 'Clinician'],
    ['An elderly patient whose son books for him in the app.', 'Patient'],
  ],
  giaiThich: '<p>Classes are defined by usage, not by job title or age: the nurse writes visit notes like a clinician; the elderly man is represented by a patient-class user.</p>',
  goiY: ['Lớp người dùng định nghĩa theo CÁCH DÙNG (tính năng, tần suất, quyền), không theo chức danh.', 'Người được đặt hộ vẫn thuộc trải nghiệm lớp Patient.'],
  loiHayGap: ['Tạo lớp theo phòng ban thay vì theo cách dùng.', 'Gán y tá vào Front desk vì không phải bác sĩ.'],
  thuatNgu: tn('userClass'),
  khaiNiem: ['user classes'],
});

const E4 = tracNghiem({
  tieuDe: 'Stakeholders 4 — the product champion',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers recommends one <b>product champion</b> per major user class: a real member of that class who speaks for it to the BA, provides and reviews requirements, and makes decisions within the scope agreed.</p>', vi: '<p>Wiegers khuyên mỗi lớp người dùng chính có một <b>product champion</b>: một thành viên thật của lớp đó, nói thay lớp với BA, cung cấp và review yêu cầu, ra quyết định trong phạm vi đã thống nhất.</p>' },
  cau: [
    { en: 'Who is the best product champion for the Front desk class of MediBook?', vi: 'Ai là product champion tốt nhất cho lớp Front desk của MediBook?', lc: [['a', 'The clinic owner, because she pays'], ['b', 'An experienced receptionist respected by colleagues and given time to do it'], ['c', 'The project manager'], ['d', 'A developer who used to work at a reception desk']], dap: 'b', giai: ['A champion must be an actual member of the class, credible to peers, with time allocated.', 'Champion phải là thành viên thật của lớp, được đồng nghiệp tin, có thời gian.'] },
    { en: 'Which is NOT a typical activity of a product champion?', vi: 'Việc nào KHÔNG phải việc điển hình của product champion?', lc: [['a', 'Collect input from other members of the user class'], ['b', 'Review requirements and evaluate prototypes'], ['c', 'Write the production code of the features'], ['d', 'Help define acceptance criteria']], dap: 'c', giai: ['Champions provide and validate requirements; they do not build the product.', 'Champion cung cấp và thẩm định yêu cầu; họ không xây sản phẩm.'] },
    { en: 'Two user classes ask for conflicting requirements. Wiegers suggests the decision usually follows…', vi: 'Hai lớp người dùng đòi yêu cầu mâu thuẫn. Wiegers gợi ý quyết định thường dựa trên…', lc: [['a', 'whichever class shouts loudest'], ['b', 'the favored user class, i.e. the class most important to the business objectives'], ['c', 'the developers’ preference'], ['d', 'a coin toss']], dap: 'b', giai: ['Favored user classes get priority because they matter most to the business objectives.', 'Lớp người dùng ưu tiên được ưu tiên vì quan trọng nhất với mục tiêu nghiệp vụ.'] },
  ],
  goiY: ['Champion là NGƯỜI DÙNG THẬT của lớp, không phải người quản lý họ.', 'Xung đột giữa các lớp ⇒ xem lớp nào được ưu tiên theo mục tiêu nghiệp vụ.'],
  loiHayGap: ['Chọn sếp làm champion thay vì người dùng thật.', 'Để dev quyết định khi hai lớp người dùng mâu thuẫn.'],
  giaiThich: '<p>Answers: b · c · b.</p>',
  thuatNgu: tn('productChampion', 'userClass'),
  khaiNiem: ['product champion', 'favored user classes'],
});

export default moDun({
  slug: 'swr302-2-1-stakeholder-user-class',
  ten: '2.1 Stakeholders, user classes and the product champion',
  moTaModule: 'Bên liên quan ⊃ khách hàng ⊃ người dùng (trực tiếp/gián tiếp), gom người dùng thành lớp theo cách dùng, chọn product champion và giải quyết xung đột giữa các lớp.',
  de: [E1, E2, E3, E4],
});
