/**
 * SWR302 · 4.12 — Why model, and which model answers which question (Wiegers Ch.12 slides 1–9 + LAB L.1).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const MH = ['Context diagram', 'Ecosystem map', 'Use case diagram', 'Swimlane diagram', 'Data flow diagram', 'Entity-relationship diagram', 'State-transition diagram', 'Decision table', 'Dialog map'];
const E1 = phanLoai({
  tieuDe: 'Choosing a model 1 — which model answers the question?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>LAB L.1: choose a model by the QUESTION you must answer, not by habit. For each question about a hotel booking system, choose the model.</p>', vi: '<p>LAB L.1: chọn mô hình theo CÂU HỎI cần trả lời, không theo thói quen. Với mỗi câu hỏi về hệ thống đặt phòng khách sạn, chọn mô hình.</p>' },
  cotCau: 'Question', cot: 'Model', luaChon: MH,
  hang: [
    ['What is inside the system, and who exchanges data with it?', 'Context diagram'],
    ['What goals can each kind of user achieve with the system?', 'Use case diagram'],
    ['Who does what, and where does the work pass from one person to another, during a group booking?', 'Swimlane diagram'],
    ['What states can a reservation be in, and what moves it from one to another?', 'State-transition diagram'],
    ['Which things does the hotel keep data about, and how are they related?', 'Entity-relationship diagram'],
    ['Where does each piece of data come from, and where is it stored?', 'Data flow diagram'],
    ['Which action applies for every combination of membership level, season and length of stay?', 'Decision table'],
    ['From which screen can a guest reach which other screen?', 'Dialog map'],
    ['How do the channel manager, the booking sites and the hotel’s accounting system exchange data, even without us?', 'Ecosystem map'],
  ],
  giaiThich: '<p>One question, one model. The first mark in a modelling exam is choosing the model that answers the question asked.</p>',
  goiY: ['Ai làm gì, khi nào ⇒ swimlane; dữ liệu đi đâu ⇒ DFD; đời sống một đối tượng ⇒ state.', 'Các hệ thống khác nói chuyện với nhau ⇒ ecosystem map.'],
  loiHayGap: ['Dùng DFD để trả lời "ai làm gì".', 'Dùng ERD để trả lời "đối tượng đi qua những trạng thái nào".'],
  thuatNgu: tn('contextDiagram', 'dfd', 'erd', 'stateDiagram', 'swimlane', 'decisionTable', 'dialogMap'),
  khaiNiem: ['choosing a model'],
});

const E2 = tracNghiem({
  tieuDe: 'Choosing a model 2 — why model at all?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers Ch.12: models represent requirements visually, at a different level of abstraction than text; drawing them reveals gaps, conflicts and errors that text hides. Models complement natural-language requirements — they do not replace them.</p>', vi: '<p>Wiegers Ch.12: mô hình biểu diễn yêu cầu bằng hình, ở mức trừu tượng khác văn bản; vẽ chúng làm lộ chỗ thiếu, mâu thuẫn, lỗi mà văn bản che giấu. Mô hình bổ sung cho yêu cầu viết bằng lời — không thay thế.</p>' },
  cau: [
    { en: 'The main benefit of drawing analysis models is…', vi: 'Lợi ích chính của vẽ mô hình phân tích là…', lc: [['a', 'nicer documents'], ['b', 'they reveal missing, conflicting and wrong requirements'], ['c', 'they replace the SRS'], ['d', 'the tool generates the code']], dap: 'b', giai: ['A diagram shows holes that text hides.', 'Sơ đồ lộ ra lỗ hổng mà văn bản giấu.'] },
    { en: 'Should you draw every model for every project?', vi: 'Có nên vẽ mọi mô hình cho mọi dự án?', lc: [['a', 'Yes, always'], ['b', 'No — choose the models that answer the questions your project has'], ['c', 'Only the ERD'], ['d', 'Never']], dap: 'b', giai: ['Select by need; a model nobody uses is waste.', 'Chọn theo nhu cầu; mô hình không ai dùng là lãng phí.'] },
    { en: 'A diagram contains a symbol you invented. What must you do?', vi: 'Sơ đồ có ký hiệu bạn tự chế. Phải làm gì?', lc: [['a', 'Nothing'], ['b', 'Add a legend'], ['c', 'Remove all labels'], ['d', 'Use colours only']], dap: 'b', giai: ['You may deviate from the notation, not silently.', 'Được lệch ký pháp, không được lệch trong im lặng.'] },
  ],
  goiY: ['Mô hình bổ sung văn bản, không thay thế.', 'Ký hiệu tự chế cần chú giải.'],
  loiHayGap: ['Vẽ đủ mọi mô hình cho đủ "bộ".', 'Bỏ văn bản vì đã có sơ đồ.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: [{ en: 'analysis model', vi: 'mô hình phân tích — biểu diễn yêu cầu bằng hình' }, { en: 'legend', vi: 'chú giải ký hiệu' }],
  khaiNiem: ['why model'],
});

const E3 = phanLoai({
  tieuDe: 'Choosing a model 3 — the five rules every diagram must follow',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>LAB L.1 gives five rules for every diagram in this course: (1) label everything; (2) keep one level of abstraction; (3) draw the boundary; (4) show the unhappy path; (5) add a legend when you invent a symbol. Which rule does each faulty diagram break?</p>', vi: '<p>LAB L.1 đưa năm luật cho mọi sơ đồ của môn: (1) ghi nhãn tất cả; (2) giữ một mức trừu tượng; (3) vẽ ranh giới; (4) vẽ đường không thuận; (5) có chú giải khi tự chế ký hiệu. Mỗi sơ đồ lỗi vi phạm luật nào?</p>' },
  cotCau: 'Faulty diagram', cot: 'Rule broken',
  luaChon: ['Label everything', 'One level of abstraction', 'Draw the boundary', 'Show the unhappy path', 'Legend for invented symbols'],
  hang: [
    ['A DFD with five arrows that carry no name.', 'Label everything'],
    ['A swimlane where "Process the order" sits next to "Click Save".', 'One level of abstraction'],
    ['A use case diagram with use cases floating without a system rectangle.', 'Draw the boundary'],
    ['A state diagram of an order that only goes Placed → Paid → Shipped → Delivered.', 'Show the unhappy path'],
    ['A context diagram where some entities are red triangles, with no explanation.', 'Legend for invented symbols'],
  ],
  giaiThich: '<p>All five are checked mechanically by graders — and by the auto-grader of this course.</p>',
  goiY: ['Chỉ có đường thành công ⇒ thiếu đường không thuận.', 'Hai hộp không cùng "cỡ" ⇒ trộn mức trừu tượng.'],
  loiHayGap: ['Cho rằng màu sắc tự giải thích được.', 'Nghĩ sơ đồ trạng thái không cần trạng thái huỷ/lỗi.'],
  thuatNgu: [{ en: 'level of abstraction', vi: 'mức trừu tượng — độ chi tiết của các phần tử trên cùng một sơ đồ' }, { en: 'unhappy path', vi: 'đường không thuận — hỏng, bị từ chối, ngoại lệ' }],
  khaiNiem: ['modelling rules'],
});

const E4 = tracNghiem({
  tieuDe: 'Choosing a model 4 — the swimlane / DFD trap',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Swimlanes and DFDs are both boxes joined by arrows, so students mix them up. A swimlane shows <b>who acts and when</b>; a DFD shows <b>what data moves and where it rests</b>. Mixing their symbols loses marks even when the picture looks right.</p>', vi: '<p>Swimlane và DFD đều là hộp nối mũi tên nên sinh viên hay lẫn. Swimlane cho thấy <b>ai hành động và khi nào</b>; DFD cho thấy <b>dữ liệu nào di chuyển và nằm lại ở đâu</b>. Trộn ký hiệu của chúng mất điểm dù hình trông đúng.</p>' },
  cau: [
    { en: 'A DFD has a lane called "Manager". What is wrong?', vi: 'Một DFD có lane tên "Manager". Sai ở đâu?', lc: [['a', 'Nothing'], ['b', 'Lanes and actors belong to swimlanes; in a DFD the manager is an external entity (if outside) and the work is a process'], ['c', 'The lane should be called "Managers"'], ['d', 'DFDs need two lanes']], dap: 'b', giai: ['Do not draw roles as lanes in a DFD.', 'Không vẽ vai trò thành lane trong DFD.'] },
    { en: 'A swimlane has a data store "Orders". What is wrong?', vi: 'Một swimlane có kho dữ liệu "Orders". Sai ở đâu?', lc: [['a', 'Nothing'], ['b', 'Data stores belong to DFDs; a swimlane shows actions in order'], ['c', 'The store should be in the first lane'], ['d', 'Stores must be named in singular']], dap: 'b', giai: ['Each model answers its own question.', 'Mỗi mô hình trả lời câu hỏi của riêng nó.'] },
    { en: 'You need to show how long approvals wait between the clerk and the manager. Which model?', vi: 'Cần thể hiện việc duyệt phải chờ bao lâu giữa nhân viên và quản lý. Mô hình nào?', lc: [['a', 'DFD'], ['b', 'Swimlane'], ['c', 'ERD'], ['d', 'Context diagram']], dap: 'b', giai: ['Hand-offs between roles are visible in a swimlane.', 'Bàn giao giữa các vai thấy rõ trong swimlane.'] },
  ],
  goiY: ['Swimlane = ai, khi nào; DFD = dữ liệu, ở đâu.', 'Kho dữ liệu chỉ có trong DFD.'],
  loiHayGap: ['Vẽ lane trong DFD.', 'Vẽ kho trong swimlane.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('swimlane', 'dfd'),
  khaiNiem: ['swimlane vs DFD'],
});

export default moDun({
  slug: 'swr302-4-7-ch12-why-model',
  ten: '4.12 Choosing a model: which model answers which question',
  moTaModule: 'Vì sao cần mô hình phân tích, chọn mô hình theo câu hỏi (context, ecosystem, use case, swimlane, DFD, ERD, state, bảng quyết định, dialog map) cho hệ thống đặt phòng khách sạn.',
  de: [E2, E1, E3, E4],
});
