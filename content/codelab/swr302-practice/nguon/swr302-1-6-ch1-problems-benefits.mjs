/**
 * SWR302 · 1.4 — When bad requirements happen to good people: six problems and the payoff (Wiegers Ch.1 slides 21–28).
 */
import { tn, kiemKhoa } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const VD = ['Insufficient user involvement', 'Inaccurate planning', 'Creeping user requirements', 'Ambiguous requirements', 'Gold plating', 'Overlooked stakeholders'];
const E1 = phanLoai({
  tieuDe: 'Requirements problems 1 — name the problem',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Wiegers lists six classic requirements problems. Name the problem behind each story from real student projects.</p>', vi: '<p>Wiegers liệt kê sáu vấn đề yêu cầu kinh điển. Gọi tên vấn đề sau mỗi câu chuyện từ các dự án sinh viên.</p>' },
  cot: 'Problem', luaChon: VD,
  hang: [
    ['The team built the canteen app from the manager’s ideas; no student was ever asked.', 'Insufficient user involvement', 'Đội xây app căng-tin theo ý quản lý; chưa hỏi sinh viên nào.'],
    ['"The system shall support many payment methods" — the team built one, the client expected four.', 'Ambiguous requirements', '"Hỗ trợ nhiều phương thức thanh toán" — đội làm một, khách mong bốn.'],
    ['Each weekly meeting added "just one more small screen"; the release slipped by six weeks.', 'Creeping user requirements', 'Mỗi tuần thêm "một màn hình nhỏ nữa"; bản phát hành trễ sáu tuần.'],
    ['A developer added a dark-mode theme nobody asked for and missed the deadline of a real feature.', 'Gold plating', 'Dev thêm giao diện tối không ai yêu cầu, trễ hạn một tính năng thật.'],
    ['The accounting office, which must approve refunds, discovered the system one week before go-live.', 'Overlooked stakeholders', 'Phòng kế toán (phải duyệt hoàn tiền) biết tới hệ thống một tuần trước khi chạy.'],
    ['The deadline was promised before anyone understood the requirements; the estimate was half the real effort.', 'Inaccurate planning', 'Hạn chót được hứa trước khi hiểu yêu cầu; ước lượng chỉ bằng nửa công thật.'],
  ],
  giaiThich: '<p>Each story maps to one problem; note the difference between creeping requirements (the customer keeps adding) and gold plating (the team adds what nobody asked for).</p>',
  goiY: ['Khách liên tục thêm ⇒ creeping; đội tự thêm ⇒ gold plating.', 'Một bên quan trọng bị quên ⇒ overlooked stakeholders; người dùng không được hỏi ⇒ insufficient user involvement.'],
  loiHayGap: ['Nhầm creeping requirements với gold plating.', 'Nhầm overlooked stakeholders với insufficient user involvement (bên bị quên không nhất thiết là người dùng).'],
  thuatNgu: tn('scopeCreep', 'goldPlating', 'ambiguous', 'stakeholder'),
  khaiNiem: ['requirements problems'],
});

const E2 = tracNghiem({
  tieuDe: 'Requirements problems 2 — the cost of late defects',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>The "money slide" of Chapter 1: about half of all defects originate in requirements, and a requirements defect found late (in testing or in production) costs many times what it costs to fix during requirements work.</p>', vi: '<p>"Slide tiền bạc" của Chương 1: khoảng một nửa số lỗi bắt nguồn từ yêu cầu, và lỗi yêu cầu bị phát hiện muộn (lúc test hay khi đã chạy thật) tốn gấp nhiều lần so với sửa ngay lúc làm yêu cầu.</p>' },
  cau: [
    { en: 'Why are requirements defects so expensive?', vi: 'Vì sao lỗi yêu cầu đắt như vậy?', lc: [['a', 'Because documents are expensive to print'], ['b', 'Because they surface late, after design, code and tests were built on the wrong requirement'], ['c', 'Because BAs are paid more than developers'], ['d', 'They are not expensive']], dap: 'b', giai: ['Everything built on the wrong requirement must be reworked.', 'Mọi thứ xây trên yêu cầu sai đều phải làm lại.'] },
    { en: 'Which practice gives the cheapest defect removal?', vi: 'Thực hành nào gỡ lỗi rẻ nhất?', lc: [['a', 'Finding defects in system testing'], ['b', 'Reviewing requirements with stakeholders before design starts'], ['c', 'Letting users report them in production'], ['d', 'Fixing them in maintenance']], dap: 'b', giai: ['A defect removed in the requirements phase costs a fraction of one removed later.', 'Lỗi gỡ ở giai đoạn yêu cầu chỉ tốn một phần nhỏ so với gỡ muộn.'] },
    { en: 'Which is NOT a benefit of a high-quality requirements process?', vi: 'Điều nào KHÔNG phải lợi ích của quy trình yêu cầu chất lượng cao?', lc: [['a', 'Fewer requirements defects'], ['b', 'Less rework'], ['c', 'Faster development and more satisfied customers'], ['d', 'No change requests will ever happen']], dap: 'd', giai: ['Changes still happen; a good process controls them instead of preventing them.', 'Thay đổi vẫn xảy ra; quy trình tốt kiểm soát chúng chứ không ngăn được.'] },
  ],
  goiY: ['Nghĩ tới chi phí làm lại thiết kế, mã, test đã xây trên yêu cầu sai.', 'Quy trình tốt giảm lỗi và làm lại, không xoá được thay đổi.'],
  loiHayGap: ['Cho rằng tìm lỗi lúc test là rẻ nhất.', 'Hứa "làm yêu cầu kỹ thì sẽ không có thay đổi".'],
  giaiThich: '<p>Answers: b · b · d.</p>',
  thuatNgu: [{ en: 'rework', vi: 'làm lại — sửa thiết kế, mã, test đã làm xong vì yêu cầu sai' }],
  khaiNiem: ['cost of defects', 'benefits of good requirements'],
});

const E4 = phanLoai({
  tieuDe: 'Requirements problems 4 — the practice that prevents each problem',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Each classic problem has a practice from later chapters that prevents it. Match them.</p>', vi: '<p>Mỗi vấn đề kinh điển có một thực hành ở các chương sau giúp ngăn nó. Ghép chúng.</p>' },
  cotCau: 'Problem', cot: 'Practice',
  luaChon: ['Identify user classes and work with product champions', 'Baseline the requirements and run change control', 'Review requirements and write them precisely', 'Trace every requirement to a business objective', 'Do a stakeholder analysis at the start', 'Estimate from the size of the requirements and add contingency'],
  hang: [
    ['Insufficient user involvement', 'Identify user classes and work with product champions'],
    ['Creeping user requirements', 'Baseline the requirements and run change control'],
    ['Ambiguous requirements', 'Review requirements and write them precisely'],
    ['Gold plating', 'Trace every requirement to a business objective'],
    ['Overlooked stakeholders', 'Do a stakeholder analysis at the start'],
    ['Inaccurate planning', 'Estimate from the size of the requirements and add contingency'],
  ],
  giaiThich: '<p>User classes and product champions (Ch.6) fight missing user input; baselines and change control (Ch.28) tame creeping requirements; reviews and writing guidelines (Ch.11, 17) remove ambiguity; tracing to business objectives exposes gold plating; stakeholder analysis (Ch.2) finds forgotten parties; requirement-based estimation improves plans (Ch.19).</p>',
  goiY: ['Mỗi vấn đề có đúng một thực hành phù hợp nhất.', 'Gold plating lộ ra khi một yêu cầu không truy về mục tiêu nghiệp vụ nào.'],
  loiHayGap: ['Ghép creeping requirements với "review requirements" — review không ngăn khách thêm yêu cầu; change control mới làm được.', 'Ghép overlooked stakeholders với product champion — champion đại diện người dùng, không tìm ra các bên khác.'],
  thuatNgu: tn('productChampion', 'baseline', 'scopeCreep', 'goldPlating'),
  khaiNiem: ['requirements good practices'],
});

const E3 = baiJs({
  tieuDe: 'Requirements problems 3 — compute the cost of finding requirement defects late',
  doKho: 'HARD', phut: 12,
  moTa: { en: `<p>A project found <b>40 requirements defects</b>. Fixing one costs <b>1 unit</b> if it is found during requirements, <b>5 units</b> in design/coding, <b>10 units</b> in system testing and <b>50 units</b> after release. Without reviews, the defects were found like this: 4 during requirements, 12 in design/coding, 16 in system testing, 8 after release. With requirements reviews, the team expects 24 during requirements, 10 in design/coding, 5 in system testing, 1 after release.</p>
<p>Compute in <code>COST</code>: <code>withoutReviews</code>, <code>withReviews</code> (units), <code>saving</code> (units) and <code>savingPct</code> (saving ÷ withoutReviews × 100, 1 decimal).</p>`, vi: '<p>Một dự án có <b>40 lỗi yêu cầu</b>. Sửa một lỗi tốn <b>1 đơn vị</b> nếu tìm thấy lúc làm yêu cầu, <b>5</b> lúc thiết kế/code, <b>10</b> lúc system test và <b>50</b> sau phát hành. Không review: 4 lỗi tìm lúc yêu cầu, 12 lúc thiết kế/code, 16 lúc system test, 8 sau phát hành. Có review yêu cầu: dự kiến 24, 10, 5, 1. Tính <code>COST</code>: withoutReviews, withReviews, saving, savingPct.</p>' },
  yeuCau: [{ en: 'Numbers, not strings. savingPct rounded to 1 decimal.', vi: 'Là số, không phải chuỗi. savingPct làm tròn 1 chữ số.' }],
  viDu: [{ input: '4 defects found during requirements × 1 unit', output: '4 units', explanation: 'Add the four phases.|||Cộng bốn giai đoạn.' }],
  tep: { 'answer.js': ["const COST = { withoutReviews: 0, withReviews: 0, saving: 0, savingPct: 0 };\n", "// without: 4·1 + 12·5 + 16·10 + 8·50 = 4 + 60 + 160 + 400 = 624\n// with:    24·1 + 10·5 + 5·10 + 1·50 = 24 + 50 + 50 + 50 = 174\n// saving = 450 units = 72.1% of 624\nconst COST = { withoutReviews: 624, withReviews: 174, saving: 450, savingPct: 72.1 };\n"] },
  kiem: kiemKhoa([
    { moTa: { en: 'cost without reviews', vi: 'chi phí khi không review' }, bieuThuc: 'COST.withoutReviews', chap: [624], kieu: 'so', saiSo: 0 },
    { moTa: { en: 'cost with reviews', vi: 'chi phí khi có review' }, bieuThuc: 'COST.withReviews', chap: [174], kieu: 'so', saiSo: 0 },
    { moTa: { en: 'saving in units', vi: 'tiết kiệm (đơn vị)' }, bieuThuc: 'COST.saving', chap: [450], kieu: 'so', saiSo: 0 },
    { moTa: { en: 'saving in percent', vi: 'tiết kiệm (%)' }, bieuThuc: 'COST.savingPct', chap: [72.1], kieu: 'so', saiSo: 0.06 },
  ]),
  goiY: ['Nhân số lỗi của mỗi giai đoạn với chi phí giai đoạn đó, rồi cộng.', 'savingPct = saving ÷ withoutReviews × 100.'],
  loiHayGap: ['Chia cho withReviews thay vì withoutReviews.', 'Quên rằng lỗi sau phát hành tốn 50 đơn vị — chính nó tạo phần lớn chi phí.'],
  giaiThich: '<p>624 − 174 = 450 units saved (72.1%). Eight defects found after release cost more (400) than all the other phases together — that is why requirements reviews pay for themselves.</p>',
  thuatNgu: [{ en: 'defect removal cost', vi: 'chi phí gỡ lỗi — tăng theo giai đoạn phát hiện' }],
  khaiNiem: ['cost of defects'],
});

export default moDun({
  slug: 'swr302-1-6-ch1-problems-benefits',
  ten: '1.4 Requirements problems and the cost of bad requirements',
  moTaModule: 'Sáu vấn đề yêu cầu kinh điển (thiếu người dùng tham gia, lập kế hoạch sai, yêu cầu phình, mơ hồ, mạ vàng, bỏ sót bên liên quan), vì sao lỗi yêu cầu phát hiện muộn rất đắt, tính chi phí gỡ lỗi có và không có review.',
  de: [E1, E2, E4, E3],
});
