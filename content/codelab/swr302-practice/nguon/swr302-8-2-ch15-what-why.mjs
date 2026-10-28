/**
 * SWR302 · 8.2 — Prototyping: what and why, mock-ups (horizontal) vs proofs of concept (vertical) (Wiegers Ch.15 · 1–8).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Prototyping 1 — which purpose?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: a software prototype is a partial, possible or preliminary implementation of a proposed product, used to <b>clarify, complete and validate requirements</b>, to <b>explore design alternatives</b>, or to <b>create a subset that grows into the ultimate product</b>. Name the purpose of each prototype.</p>', vi: '<p>Wiegers: prototype dùng để <b>làm rõ, bổ sung, thẩm định yêu cầu</b>, <b>khám phá phương án thiết kế</b>, hoặc <b>tạo một tập con lớn dần thành sản phẩm</b>. Gọi tên mục đích.</p>' },
  cot: 'Purpose', luaChon: ['Clarify and validate requirements', 'Explore design alternatives', 'Grow into the product'],
  hang: [
    ['Show pharmacists a sketch of the stock screen to find what they forgot to tell us.', 'Clarify and validate requirements'],
    ['Compare a wizard and a single-page form for booking to see which users finish faster.', 'Explore design alternatives'],
    ['Build release 0.1 of the booking core with production-quality code, then add features each sprint.', 'Grow into the product'],
    ['Let nurses click through the triage flow to confirm the steps are complete.', 'Clarify and validate requirements'],
    ['Try two navigation structures for the mobile app with five users each.', 'Explore design alternatives'],
  ],
  giaiThich: '<p>Requirements prototypes find errors and omissions cheaply; design prototypes compare alternatives; evolutionary prototypes become the product.</p>',
  goiY: ['Tìm yêu cầu bị bỏ sót ⇒ làm rõ yêu cầu.', 'So sánh hai cách ⇒ khám phá thiết kế.'],
  loiHayGap: ['Coi mọi prototype là để làm sản phẩm.', 'Nhầm so sánh phương án với làm rõ yêu cầu.'],
  thuatNgu: tn('prototype'),
  khaiNiem: ['purposes of prototyping'],
});

const E2 = phanLoai({
  tieuDe: 'Prototyping 2 — mock-up or proof of concept?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Scope choice: a <b>mock-up</b> (horizontal prototype) shows part of the user interface without diving into the architectural layers — it asks "is this the right experience and set of requirements?". A <b>proof of concept</b> (vertical prototype, "spike") implements a slice of functionality from the UI down through all technical layers — it asks "can we build this, and how fast is it?".</p>', vi: '<p><b>Mock-up</b> (ngang): một phần giao diện, không xuống các tầng kiến trúc — hỏi "trải nghiệm và yêu cầu đã đúng chưa?". <b>Proof of concept</b> (dọc, "spike"): một lát chức năng xuyên mọi tầng — hỏi "làm được không, nhanh tới đâu?".</p>' },
  cot: 'Scope', luaChon: ['Mock-up (horizontal)', 'Proof of concept (vertical)'],
  hang: [
    ['Clickable screens of the online checkout with fake data.', 'Mock-up (horizontal)'],
    ['Check that the new payment gateway SDK works with our backend and returns in under 2 seconds.', 'Proof of concept (vertical)'],
    ['Paper sketches of the dashboard to discuss which charts managers need.', 'Mock-up (horizontal)'],
    ['A spike: send one real prescription to the national e-health API end to end.', 'Proof of concept (vertical)'],
    ['A wireframe of the search results page.', 'Mock-up (horizontal)'],
    ['Measure whether the chosen database can store 10 million readings per day.', 'Proof of concept (vertical)'],
  ],
  giaiThich: '<p>Broad and shallow (UI only) ⇒ mock-up; narrow and deep (through every layer, technical feasibility or performance) ⇒ proof of concept.</p>',
  goiY: ['Câu hỏi về kỹ thuật/hiệu năng ⇒ proof of concept.', 'Chỉ màn hình, dữ liệu giả ⇒ mock-up.'],
  loiHayGap: ['Gọi wireframe là proof of concept.', 'Nghĩ PoC phải có đủ giao diện đẹp.'],
  thuatNgu: [...tn('prototype', 'wireframe'), { en: 'proof of concept', vi: 'proof of concept — prototype dọc, kiểm tính khả thi kỹ thuật' }],
  khaiNiem: ['mock-ups and proofs of concept'],
});

const E3 = tracNghiem({
  tieuDe: 'Prototyping 3 — the three attribute classes',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Every prototype is a combination of three attribute choices: <b>scope</b> (mock-up or proof of concept), <b>future use</b> (throwaway or evolutionary), and <b>form</b> (paper or electronic).</p>', vi: '<p>Mỗi prototype là tổ hợp ba lựa chọn: <b>phạm vi</b> (mock-up / PoC), <b>tương lai</b> (throwaway / evolutionary), <b>hình thức</b> (giấy / điện tử).</p>' },
  cau: [
    { en: 'Early in elicitation, you want feedback on the flow of a new booking app within one afternoon. Best combination?', vi: 'Đầu giai đoạn khai thác, muốn phản hồi về luồng đặt lịch trong một buổi chiều. Tổ hợp tốt nhất?', lc: [['a', 'Throwaway paper mock-up'], ['b', 'Evolutionary electronic proof of concept'], ['c', 'Throwaway proof of concept'], ['d', 'No prototype']], dap: 'a', giai: ['Fast, cheap, about the UI.', 'Nhanh, rẻ, về giao diện.'] },
    { en: 'The team doubts that the chosen architecture can handle the load. Best?', vi: 'Đội nghi kiến trúc đã chọn chịu được tải. Tốt nhất?', lc: [['a', 'An electronic proof of concept'], ['b', 'A paper mock-up'], ['c', 'A longer meeting'], ['d', 'A colour study']], dap: 'a', giai: ['Only running code through the layers answers it.', 'Chỉ mã chạy xuyên tầng mới trả lời được.'] },
    { en: 'How many attribute classes describe a prototype?', vi: 'Có mấy lớp thuộc tính mô tả một prototype?', lc: [['a', 'Three: scope, future use, form'], ['b', 'Two'], ['c', 'Five'], ['d', 'One: fidelity']], dap: 'a', giai: ['Each with two alternatives.', 'Mỗi lớp có hai lựa chọn.'] },
  ],
  goiY: ['Câu hỏi về UI + cần nhanh ⇒ giấy, throwaway, mock-up.', 'Câu hỏi về kiến trúc ⇒ PoC điện tử.'],
  loiHayGap: ['Dùng mock-up giấy để kiểm hiệu năng.', 'Dựng PoC đầy đủ chỉ để hỏi về bố cục.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('prototype'),
  khaiNiem: ['prototype attributes'],
});

const E4 = tracNghiem({
  tieuDe: 'Prototyping 4 — as a requirements tool',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>As a requirements tool, a prototype helps obtain agreement, find errors and omissions, and assess the accuracy and quality of requirements — especially for poorly understood, risky or complex parts — so they can be fixed cheaply before construction.</p>', vi: '<p>Là công cụ yêu cầu, prototype giúp thống nhất, tìm lỗi và thiếu sót, đánh giá độ chính xác — nhất là phần mơ hồ, rủi ro, phức tạp — để sửa rẻ trước khi xây dựng.</p>' },
  cau: [
    { en: 'Which part of the system benefits most from a requirements prototype?', vi: 'Phần nào được lợi nhất từ prototype yêu cầu?', lc: [['a', 'Poorly understood, risky or complex parts'], ['b', 'The login page everyone knows'], ['c', 'The database backups'], ['d', 'Every part equally']], dap: 'a', giai: ['Prototype where uncertainty is highest.', 'Làm prototype nơi bất định cao nhất.'] },
    { en: 'After users evaluate a prototype, the BA should…', vi: 'Sau khi người dùng đánh giá prototype, BA nên…', lc: [['a', 'update the written requirements with what was learned'], ['b', 'treat the prototype as the requirements'], ['c', 'discard the feedback'], ['d', 'hand the prototype to developers as the spec']], dap: 'a', giai: ['A prototype does not replace written requirements.', 'Prototype không thay yêu cầu viết.'] },
  ],
  goiY: ['Prototype bổ trợ, không thay thế yêu cầu viết.', 'Nhắm vào phần bất định.'],
  loiHayGap: ['Coi prototype là đặc tả.', 'Prototype cả phần ai cũng hiểu.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('prototype', 'validation'),
  khaiNiem: ['prototype as a requirements tool'],
});

export default moDun({
  slug: 'swr302-8-2-ch15-what-why',
  ten: '8.2 Prototyping: what, why, mock-ups and proofs of concept',
  moTaModule: 'Ba mục đích của prototype, mock-up (ngang) vs proof of concept (dọc/spike), ba lớp thuộc tính (phạm vi, tương lai, hình thức) và chọn tổ hợp phù hợp, prototype như công cụ yêu cầu.',
  de: [E1, E2, E3, E4],
});
