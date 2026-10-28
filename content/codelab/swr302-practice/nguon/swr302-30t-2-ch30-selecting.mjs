/**
 * SWR302 · 30T.2 — Selecting and implementing a requirements tool (Wiegers Ch.30 slides 12–16).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Tool selection 1 — the selection process',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>A BA should lead tool selection. Order the steps.</p>', vi: '<p>BA nên dẫn dắt việc chọn công cụ. Sắp các bước.</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Identify your tool requirements as evaluation criteria', 'Prioritise and weight the criteria', 'Set up demos or trials of candidate tools', 'Score each candidate against the criteria', 'Select the tool and plan a pilot'], hien: [3, 0, 4, 2, 1], giai: ['Same weighted approach as COTS selection.', 'Cùng cách có trọng số như chọn gói COTS.'] }],
  goiY: ['Tiêu chí trước, demo sau.', 'Chọn xong ⇒ thí điểm.'],
  loiHayGap: ['Xem demo trước khi có tiêu chí.', 'Triển khai toàn công ty ngay.'],
  giaiThich: '<p>Criteria → weights → demos → scores → selection and pilot.</p>',
  thuatNgu: [{ en: 'pilot', vi: 'thí điểm' }],
  khaiNiem: ['tool selection'],
});

const E2 = phanLoai({
  tieuDe: 'Tool selection 2 — setup and adoption: good or risky?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Setting up a tool takes effort: installing, loading requirements, defining attributes and trace links, access groups, adapting processes. Assign an experienced BA to own the setup; get an organisation-wide commitment; train users; pilot on a low-risk project; find a champion who advocates the tool. Judge each practice.</p>', vi: '<p>Thiết lập và đưa công cụ vào dùng: tốt hay rủi ro?</p>' },
  cot: 'Practice', luaChon: ['Good practice', 'Risky'],
  hang: [
    ['An experienced BA owns the tool setup and defines the attribute conventions.', 'Good practice'],
    ['The tool is rolled out to all 30 projects on the same day, without training.', 'Risky'],
    ['A low-risk project pilots the tool and the lessons are written down.', 'Good practice'],
    ['Everyone keeps editing Word files "for now" while the tool is "being tried".', 'Risky'],
    ['A respected BA acts as the tool’s advocate and helps colleagues.', 'Good practice'],
  ],
  giaiThich: '<p>Buying a tool is easy; changing culture and habits to use it is the hard part.</p>',
  goiY: ['Có người phụ trách, thí điểm, đào tạo ⇒ tốt.', 'Tung ra ồ ạt, chạy song song mãi ⇒ rủi ro.'],
  loiHayGap: ['Mua xong là xong.', 'Không đào tạo.'],
  thuatNgu: [{ en: 'tool adoption', vi: 'đưa công cụ vào sử dụng' }],
  khaiNiem: ['tool adoption'],
});

const E3 = tracNghiem({
  tieuDe: 'Tool selection 3 — the learning curve',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Some people prefer not to share an imperfect requirement set, yet the database is open to all; people resist leaving familiar documents. Eventually the tool takes no more time — but users must first climb the learning curve.</p>', vi: '<p>Người dùng phải vượt qua đường cong học tập.</p>' },
  cau: [
    { en: 'Two months after adoption the BAs say the tool slows them down. Best interpretation?', vi: 'Hai tháng sau khi dùng, BA nói công cụ làm họ chậm lại. Cách hiểu tốt nhất?', lc: [['a', 'Expected learning-curve dip — support and coach them, measure again later'], ['b', 'Abandon the tool immediately'], ['c', 'Blame the BAs'], ['d', 'Buy a second tool']], dap: 'a', giai: ['Learning curve.', 'Đường cong học tập.'] },
  ],
  goiY: ['Năng suất giảm tạm thời là bình thường.', 'Hỗ trợ, đo lại sau.'],
  loiHayGap: ['Bỏ cuộc giữa chừng.', 'Đổi công cụ liên tục.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'learning curve', vi: 'đường cong học tập' }],
  khaiNiem: ['tool adoption'],
});

const E4 = tracNghiem({
  tieuDe: 'Tool selection 4 — who leads the selection?',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Select on the combination of features, platform and price that fits your environment and culture; a BA should lead the definition of criteria and the assessment.</p>', vi: '<p>BA nên dẫn dắt việc chọn công cụ.</p>' },
  cau: [
    { en: 'Who should lead the selection of a requirements tool?', vi: 'Ai nên dẫn dắt việc chọn công cụ yêu cầu?', lc: [['a', 'A business analyst, with criteria from the people who will use it'], ['b', 'The vendor’s salesperson'], ['c', 'Whoever has budget left'], ['d', 'An intern alone']], dap: 'a', giai: ['The BA knows the needs.', 'BA hiểu nhu cầu.'] },
  ],
  goiY: ['BA dẫn dắt.', 'Tiêu chí từ người dùng công cụ.'],
  loiHayGap: ['Để nhà cung cấp quyết.', 'Chọn theo ngân sách còn lại.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'evaluation criteria', vi: 'tiêu chí đánh giá' }],
  khaiNiem: ['tool selection'],
});

export default moDun({
  slug: 'swr302-30t-2-ch30-selecting',
  ten: '12.6 Selecting and implementing a requirements tool',
  moTaModule: 'Quy trình chọn công cụ (tiêu chí, trọng số, demo, chấm, thí điểm), thiết lập và đưa vào dùng (người phụ trách, đào tạo, thí điểm), đường cong học tập, ai dẫn dắt.',
  de: [E1, E2, E3, E4],
});
