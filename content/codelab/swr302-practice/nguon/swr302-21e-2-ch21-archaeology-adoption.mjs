/**
 * SWR302 · 21E.2 — Software archaeology, which requirements to specify, adoption and transition requirements (Wiegers Ch.21 slides 9–14).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Archaeology 1 — when old requirements don’t exist',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Most older systems have no accurate documented requirements. Teams reverse-engineer what the system does from its UI, code and database — "software archaeology" — and record what they learn to stop the knowledge drain. It is rarely worth reconstructing a complete requirement set: document the area you are changing and the areas it touches (Figure 21-2), and grow the documentation over time.</p>', vi: '<p>"Khảo cổ phần mềm" và nên ghi lại bao nhiêu yêu cầu.</p>' },
  cau: [
    { en: 'You must add a feature to region A of an undocumented legacy system. What do you document?', vi: 'Bạn phải thêm tính năng vào vùng A của hệ thống cũ không tài liệu. Ghi lại cái gì?', lc: [['a', 'The new requirements, plus what you learn about the existing functionality that region A touches'], ['b', 'The entire system, perfectly, before starting'], ['c', 'Nothing'], ['d', 'Only the code comments']], dap: 'a', giai: ['Document where you work; grow it over time.', 'Ghi phần đang làm; mở rộng dần.'] },
    { en: 'Why record what archaeology reveals?', vi: 'Vì sao ghi lại điều khảo cổ tìm được?', lc: [['a', 'To stop the knowledge drain so future maintainers understand the system'], ['b', 'For decoration'], ['c', 'It is required by Scrum'], ['d', 'It is not useful']], dap: 'a', giai: ['Knowledge drain.', 'Thất thoát tri thức.'] },
  ],
  goiY: ['Ghi phần mình đụng tới.', 'Không cần tái dựng toàn bộ.'],
  loiHayGap: ['Đòi tài liệu hoá toàn bộ hệ thống trước.', 'Không ghi gì.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'software archaeology', vi: 'khảo cổ phần mềm — suy ngược chức năng từ hệ thống cũ' }],
  khaiNiem: ['software archaeology'],
});

const E2 = phanLoai({
  tieuDe: 'Archaeology 2 — where to look in a running system',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Even without documents you have a running system. Which source reveals each kind of requirement?</p>', vi: '<p>Nguồn nào trong hệ thống đang chạy lộ ra từng loại yêu cầu?</p>' },
  cot: 'Source', luaChon: ['User interface', 'Code', 'Database', 'Interfaces to other systems', 'Usage logs and reports'],
  hang: [
    ['The fields and validation messages on the registration screen.', 'User interface'],
    ['The discount rule hidden in a stored procedure.', 'Code'],
    ['The tables and columns kept for every prescription.', 'Database'],
    ['The nightly file sent to the accounting system.', 'Interfaces to other systems'],
    ['Which functions are used every day and which never.', 'Usage logs and reports'],
  ],
  giaiThich: '<p>Each source answers a different question; together they reconstruct what the system does and what still matters.</p>',
  goiY: ['Luật tính toán ẩn ⇒ code.', 'Dùng hay không dùng ⇒ log sử dụng.'],
  loiHayGap: ['Chỉ xem giao diện.', 'Bỏ qua giao diện với hệ thống khác.'],
  thuatNgu: tn('externalInterface'),
  khaiNiem: ['discovering existing requirements'],
});

const E3 = phanLoai({
  tieuDe: 'Archaeology 3 — transition requirements',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p><b>Transition requirements</b> describe capabilities the whole solution — not only the software — needs to move from the old system to the new: data conversion, user training, organisational and business-process changes, running old and new systems in parallel for a time. Is each item a transition requirement or an ordinary (lasting) requirement?</p>', vi: '<p>Yêu cầu chuyển đổi (chỉ cần trong thời gian chuyển từ cũ sang mới) hay yêu cầu thường?</p>' },
  cot: 'Kind', luaChon: ['Transition requirement', 'Ordinary requirement'],
  hang: [
    ['Convert 12 years of patient records from the old database.', 'Transition requirement'],
    ['Run the old and new billing systems in parallel for one month.', 'Transition requirement'],
    ['The system shall send an SMS reminder 24 hours before each appointment.', 'Ordinary requirement'],
    ['Train all receptionists before the switch-over weekend.', 'Transition requirement'],
    ['The system shall show free slots within 2 seconds.', 'Ordinary requirement'],
  ],
  giaiThich: '<p>Transition requirements are temporary but critical: a perfect new system fails if the data, people and processes are not moved over.</p>',
  goiY: ['Chỉ cần trong thời gian chuyển ⇒ chuyển đổi.', 'Hành vi lâu dài của hệ thống ⇒ thường.'],
  loiHayGap: ['Quên chuyển đổi dữ liệu.', 'Coi đào tạo không phải yêu cầu.'],
  thuatNgu: [{ en: 'transition requirement', vi: 'yêu cầu chuyển đổi' }],
  khaiNiem: ['transition requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Archaeology 4 — encouraging adoption',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>People resist changing a stable, well-understood system; some fear losing their jobs if tasks are automated. Understand the business objectives and user requirements, involve users early, explain what they gain, and plan training and support.</p>', vi: '<p>Người dùng kháng cự thay đổi; cần hiểu, mời tham gia sớm, giải thích lợi ích, đào tạo.</p>' },
  cau: [
    { en: 'Clerks fear the new system will replace them. Best response?', vi: 'Nhân viên sợ hệ thống mới thay thế họ. Cách phản hồi tốt nhất?', lc: [['a', 'Involve them early, explain how their work changes and what they gain, and plan training'], ['b', 'Ignore their fear'], ['c', 'Delay telling them until go-live'], ['d', 'Cancel the project']], dap: 'a', giai: ['Anticipate and plan for resistance.', 'Lường trước và lên kế hoạch.'] },
  ],
  goiY: ['Mời tham gia sớm.', 'Giải thích lợi ích, đào tạo.'],
  loiHayGap: ['Giấu kế hoạch đến ngày chạy.', 'Coi kháng cự là chuyện riêng của họ.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('userClass'),
  khaiNiem: ['adoption'],
});

export default moDun({
  slug: 'swr302-21e-2-ch21-archaeology-adoption',
  ten: '12.2 Software archaeology, transition and adoption',
  moTaModule: 'Khi không có yêu cầu cũ: khảo cổ phần mềm, ghi phần nào; nguồn nào trong hệ thống đang chạy; yêu cầu chuyển đổi (dữ liệu, đào tạo, chạy song song); khuyến khích người dùng chấp nhận hệ thống mới.',
  de: [E1, E2, E3, E4],
});
