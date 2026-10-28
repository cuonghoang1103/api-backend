/**
 * SWR302 · 3G.3 — Analysis good practices (Wiegers Ch.3 slides 21–29).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Analysis practices 1 — which practice fits?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Choose the analysis practice that fits each situation.</p>', vi: '<p>Chọn thực hành phân tích phù hợp với từng tình huống.</p>' },
  cot: 'Practice', luaChon: NHOM_TH.Analysis,
  hang: [
    ['Nobody is sure how the new system connects to the hospital’s lab, billing and pharmacy systems.', 'Model the application environment'],
    ['Users cannot picture the new triage screen.', 'Create user interface and technical prototypes'],
    ['A customer wants real-time GPS for 10,000 buses on a tiny budget.', 'Analyze requirement feasibility'],
    ['There is more work than one release can hold.', 'Prioritize the requirements'],
    ['"Patient", "client" and "member" are used for the same thing in three departments.', 'Create a data dictionary'],
    ['Data must be exchanged with the national health portal in a defined format.', 'Analyze external interfaces'],
    ['A building access product has badges, door locks, cameras and guards.', 'Allocate requirements to subsystems'],
    ['A state diagram of an order reveals that cancelled orders can still be shipped.', 'Model the requirements'],
  ],
  giaiThich: '<p>Analysis turns raw input into a consistent, feasible, prioritised set — models, prototypes and the data dictionary are its tools.</p>',
  goiY: ['Nhiều hệ thống xung quanh ⇒ mô hình môi trường (context diagram, ecosystem map).', 'Phần cứng + phần mềm + con người ⇒ phân bổ cho phân hệ.'],
  loiHayGap: ['Gọi việc đặt tên thống nhất là glossary (Knowledge) thay vì data dictionary.', 'Nhầm external interfaces với environment model.'],
  thuatNgu: tn('analysis', 'dataDictionary', 'prototype'),
  khaiNiem: ['analysis practices'],
});

const E2 = phanLoai({
  tieuDe: 'Analysis practices 2 — allocate to subsystems',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>For a secure-building access product, allocate each requirement to the subsystem that will satisfy it: <b>software</b>, <b>hardware</b> or <b>people</b> (guards, operators).</p>', vi: '<p>Phân bổ mỗi yêu cầu của hệ thống kiểm soát ra vào cho phân hệ: <b>phần mềm</b>, <b>phần cứng</b> hay <b>con người</b>.</p>' },
  cot: 'Subsystem', luaChon: ['Software', 'Hardware', 'People'],
  hang: [
    ['Decide whether a badge is valid for this door at this time.', 'Software'],
    ['Read a badge from up to 10 cm away.', 'Hardware'],
    ['Check the identity of a visitor without a badge and escort them.', 'People'],
    ['Keep the door locked during a power cut (fail-secure lock).', 'Hardware'],
    ['Record every access attempt in the audit log.', 'Software'],
    ['Respond to an alarm within 3 minutes.', 'People'],
  ],
  giaiThich: '<p>Allocation makes each subsystem team responsible for a clear set of requirements, and shows interfaces between them.</p>',
  goiY: ['Quyết định theo luật ⇒ phần mềm.', 'Đọc, khoá vật lý ⇒ phần cứng; kiểm tra người, phản ứng báo động ⇒ con người.'],
  loiHayGap: ['Giao mọi thứ cho phần mềm.', 'Quên phân hệ con người.'],
  thuatNgu: [{ en: 'requirements allocation', vi: 'phân bổ yêu cầu cho phân hệ' }],
  khaiNiem: ['allocation to subsystems'],
});

const E3 = tracNghiem({
  tieuDe: 'Analysis practices 3 — feasibility and models',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Analyse feasibility with developers to surface risks, conflicts and dependencies early; infeasible or costly requirements can often be simplified while still meeting the business objectives. Analysis models can reveal incorrect, inconsistent, missing or superfluous requirements.</p>', vi: '<p>Phân tích khả thi cùng dev; mô hình lộ ra yêu cầu sai, mâu thuẫn, thiếu hoặc thừa.</p>' },
  cau: [
    { en: 'A requirement turns out to be very expensive. The analyst should first…', vi: 'Một yêu cầu hoá ra rất đắt. BA nên trước tiên…', lc: [['a', 'look for a simpler version that still meets the business objective'], ['b', 'delete it silently'], ['c', 'keep it unchanged'], ['d', 'ask testers']], dap: 'a', giai: ['Simplify while keeping the objective.', 'Đơn giản hoá mà giữ mục tiêu.'] },
    { en: 'Which defect can a model reveal that a text list hides?', vi: 'Model lộ ra lỗi nào mà danh sách văn bản che đi?', lc: [['a', 'A missing transition, e.g. no way to reopen a closed ticket'], ['b', 'A spelling mistake'], ['c', 'The font size'], ['d', 'The author’s name']], dap: 'a', giai: ['Models expose gaps and inconsistencies.', 'Mô hình lộ lỗ hổng và mâu thuẫn.'] },
  ],
  goiY: ['Đắt ⇒ tìm phương án đơn giản hơn đạt cùng mục tiêu.', 'Mô hình giúp thấy chỗ thiếu.'],
  loiHayGap: ['Giữ nguyên yêu cầu bất khả thi.', 'Coi mô hình chỉ để trang trí.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('analysis'),
  khaiNiem: ['feasibility', 'analysis models'],
});

const E4 = tracNghiem({
  tieuDe: 'Analysis practices 4 — environment and interfaces',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>A context diagram shows the boundary and the interfaces with users, devices and other systems; an ecosystem map shows the systems in the solution space and how they interconnect. Every system has external interfaces: user interfaces, data exchanges, hardware links, communication interfaces.</p>', vi: '<p>Context diagram và ecosystem map; mọi hệ thống đều có giao diện ngoài.</p>' },
  cau: [
    { en: 'Which model shows several systems and how they exchange data with each other, beyond your own system?', vi: 'Mô hình nào cho thấy nhiều hệ thống và cách chúng trao đổi dữ liệu với nhau, ngoài hệ thống của bạn?', lc: [['a', 'Ecosystem map'], ['b', 'Context diagram'], ['c', 'Use case specification'], ['d', 'Data dictionary']], dap: 'a', giai: ['The context diagram shows only your system’s direct neighbours.', 'Context diagram chỉ thấy hàng xóm trực tiếp.'] },
    { en: 'Why analyse external interfaces early?', vi: 'Vì sao phân tích giao diện ngoài sớm?', lc: [['a', 'So the application fits smoothly into its environment; interface changes are costly later'], ['b', 'Because they are easy'], ['c', 'Only for embedded systems'], ['d', 'They are not requirements']], dap: 'a', giai: ['Late interface surprises are expensive.', 'Bất ngờ về giao diện về sau rất đắt.'] },
  ],
  goiY: ['Nhiều hệ thống nối nhau ⇒ ecosystem map.', 'Giao diện ngoài phải xét sớm.'],
  loiHayGap: ['Nhầm ecosystem map với context diagram.', 'Coi giao diện ngoài là chuyện thiết kế.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('contextDiagram', 'externalInterface'),
  khaiNiem: ['environment models'],
});

export default moDun({
  slug: 'swr302-3g-3-ch3-analysis',
  ten: '2.8 Good practices: analysis',
  moTaModule: 'Tám thực hành phân tích: chọn thực hành cho 8 tình huống, phân bổ yêu cầu cho phần mềm/phần cứng/con người, khả thi và mô hình, context diagram vs ecosystem map.',
  de: [E1, E2, E3, E4],
});
