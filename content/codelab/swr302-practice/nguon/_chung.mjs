/**
 * SWR302 practice — PHẦN DÙNG CHUNG (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua).
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * Định dạng đề: content/codelab/README.md · đề lớn "bản in": content/codelab/_chung/deLon.mjs.
 * Tái dùng bộ công cụ chung của track SWT301 (gon, tinh, kiemKhoa, svg…) — CHỈ import, không sửa track đó.
 *
 * Năm kiểu chấm của môn yêu cầu (đều chạy bằng máy chấm có sẵn — không thêm loại kiểm mới):
 *  1. choice / order / table (tinhDe) — phân loại yêu cầu, chọn kỹ thuật, sắp mục SRS, bảng MoSCoW/RACI/CRUD/bảng quyết định…
 *  2. SƠ ĐỒ BẰNG CHỮ (máy chấm 'js', _mohinh.mjs) — Mermaid flowchart (context/DFD), PlantUML use case, Mermaid erDiagram,
 *     stateDiagram-v2, PlantUML activity (swimlane). Kiểm THUỘC TÍNH lý thuyết + SỰ KIỆN của tình huống, nhận nhiều đáp án đúng.
 *  3. TÀI LIỆU CÓ CẤU TRÚC ('js') — bảng actor/use case, đặc tả use case, data dictionary, RTM, business rule, NFR/Planguage…
 *     người học khai object/mảng JS như từng dòng của template trường; kiểm cấu trúc + sự kiện chính của tình huống.
 *  4. SỐ ('js', kiemKhoa kieu 'so') — Wiegers value/cost/risk, độ phủ RTM, độ đo chất lượng…
 *  5. VIẾT HÀM (Deep Lab, 'js') — tự viết bộ máy phân tích (linter yêu cầu, bộ kiểm RTM, bộ xếp ưu tiên…), chấm bằng dữ liệu ẩn.
 */
import {
  gon, doiDau, hai, giai, lc, tinh, bangHtml, kiemKhoa, jsLit, svg, svgTuanTu, preMa,
} from '../../swt301-practice/nguon/_chung.mjs';

export { gon, doiDau, hai, giai, lc, tinh, bangHtml, kiemKhoa, jsLit, svg, svgTuanTu, preMa };

export const KHOA = 'software-requirements';

/** Bài tĩnh: q = { tieuDe, doKho, phut, moTa:{en,vi}, loai, cauHoi|bang, goiY, loiHayGap, giaiThich, thuatNgu? } */
export function tinhDe(q) {
  const d = tinh(q);
  return { the: ['swr302'], ...d, dangBai: 'practice', thuatNgu: q.thuatNgu || [], loiHayGap: q.loiHayGap || [] };
}

/** Một kiểm tuỳ ý: fn tự chứa, đọc biến người học, trả 'OK' hoặc lời giải thích. */
export function kiemTuy(moTa, fn, ex = {}) {
  return {
    moTa,
    chuanBi: `const __KQ = (function () { try { return (${gon(fn)})(); } catch (e) { return (e && e.name === 'ReferenceError' ? 'missing: ' : 'error: ') + (e && e.message ? e.message : String(e)); } })();`,
    goi: '__KQ', mongDoi: 'OK', ...ex,
  };
}

/**
 * Bài 'js' với các tệp trả lời: q = { …trường đề…, tep: { 'answers/x.js': [dau, giai] }, kiem: [...] }.
 * Tệp nạp theo thứ tự khai báo.
 */
export function jsDe(q) {
  const { tep, kiem, ...rest } = q;
  const khoiDau = {}, loiGiai = {};
  for (const [ten, [dau, g]] of Object.entries(tep)) { khoiDau[ten] = dau; loiGiai[ten] = g; }
  return {
    the: ['swr302'],
    ngonNgu: 'javascript',
    dangBai: 'practice',
    ...rest,
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(tep), kiem },
    khoiDau, loiGiai,
  };
}

/** Nộp bài chung cho đề lớn (Lab / Deep Lab / PE / dự án). */
export const NOP_BAI = {
  en: 'Write your answers in the files of <code>answers/</code> on the right. Diagrams are written as text in the syntax of a real tool (Mermaid or PlantUML — paste them into <a href="https://mermaid.live" target="_blank" rel="noopener">mermaid.live</a> or <a href="https://www.plantuml.com/plantuml" target="_blank" rel="noopener">plantuml.com</a> to SEE the picture); tables are JavaScript arrays, one object per row of the school template. Press <b>Run</b> for the visible checks and <b>Submit</b> for full grading, hidden checks included. Your mark per question appears in the rubric table.',
  vi: 'Viết câu trả lời vào các tệp trong <code>answers/</code> bên phải. Sơ đồ viết bằng chữ theo cú pháp của công cụ thật (Mermaid hoặc PlantUML — dán vào <a href="https://mermaid.live" target="_blank" rel="noopener">mermaid.live</a> hoặc <a href="https://www.plantuml.com/plantuml" target="_blank" rel="noopener">plantuml.com</a> để XEM hình); bảng là mảng JavaScript, mỗi object là một dòng của template trường. Bấm <b>Chạy thử</b> để chạy kiểm hiện, <b>Nộp</b> để chấm đủ (kể cả kiểm ẩn). Điểm từng câu hiện trong bảng thang điểm.',
};

/** Cú pháp sơ đồ — in trong đề (mục "Data model") để người học không phải đoán. */
export const CU_PHAP = {
  context: {
    en: '<b>Mermaid flowchart.</b> First line <code>flowchart LR</code>. The system is ONE circle <code>S((Name))</code>; each external entity is a rectangle <code>E1[Customer]</code>; each data flow is a labelled arrow <code>E1 -->|order details| S</code> (one arrow per direction, label = the DATA, a noun phrase).',
    vi: '<b>Mermaid flowchart.</b> Dòng đầu <code>flowchart LR</code>. Hệ thống là MỘT hình tròn <code>S((Tên))</code>; mỗi thực thể ngoài là một hình chữ nhật <code>E1[Customer]</code>; mỗi luồng dữ liệu là một mũi tên có nhãn <code>E1 -->|order details| S</code> (mỗi chiều một mũi tên, nhãn = DỮ LIỆU, cụm danh từ).',
  },
  dfd: {
    en: '<b>Mermaid flowchart.</b> Process = circle with a number and a verb phrase <code>P1((1.0 Book appointment))</code>; data store = cylinder <code>D1[(D1 Appointments)]</code>; external entity = rectangle <code>E1[Patient]</code>; flow = <code>E1 -->|appointment request| P1</code>.',
    vi: '<b>Mermaid flowchart.</b> Process = hình tròn có số và cụm động từ <code>P1((1.0 Book appointment))</code>; kho dữ liệu = hình trụ <code>D1[(D1 Appointments)]</code>; thực thể ngoài = hình chữ nhật <code>E1[Patient]</code>; luồng = <code>E1 -->|appointment request| P1</code>.',
  },
  usecase: {
    en: '<b>PlantUML.</b> <code>actor Patient</code> · <code>actor "Payment Gateway" as PG</code> · the system boundary <code>rectangle "ClinicCare" { … }</code> holding <code>usecase "Book Appointment" as UC1</code> · association <code>Patient --> UC1</code> · <code>UC1 ..> UC2 : &lt;&lt;include&gt;&gt;</code> (base → included) · <code>UC3 ..> UC1 : &lt;&lt;extend&gt;&gt;</code> (extension → base) · actor generalisation <code>Child --|> Parent</code>.',
    vi: '<b>PlantUML.</b> <code>actor Patient</code> · <code>actor "Payment Gateway" as PG</code> · biên hệ thống <code>rectangle "ClinicCare" { … }</code> chứa <code>usecase "Book Appointment" as UC1</code> · liên kết <code>Patient --> UC1</code> · <code>UC1 ..> UC2 : &lt;&lt;include&gt;&gt;</code> (gốc → được gộp) · <code>UC3 ..> UC1 : &lt;&lt;extend&gt;&gt;</code> (mở rộng → gốc) · tổng quát hoá actor <code>Con --|> Cha</code>.',
  },
  erd: {
    en: '<b>Mermaid erDiagram.</b> Relationship <code>PATIENT ||--o{ APPOINTMENT : books</code> — the marker next to an entity says how many of THAT entity take part (<code>||</code> exactly one · <code>|o</code>/<code>o|</code> zero or one · <code>}o</code>/<code>o{</code> zero or many · <code>}|</code>/<code>|{</code> one or many). Entity block <code>PATIENT { string patientId PK  string fullName }</code> — conceptual level: an identifier (PK) and a few key attributes, NO foreign keys (Mermaid needs a type word before each attribute; it is not graded).',
    vi: '<b>Mermaid erDiagram.</b> Quan hệ <code>PATIENT ||--o{ APPOINTMENT : books</code> — ký hiệu sát một thực thể cho biết bao nhiêu thể hiện CỦA thực thể đó tham gia (<code>||</code> đúng một · <code>|o</code>/<code>o|</code> không hoặc một · <code>}o</code>/<code>o{</code> không hoặc nhiều · <code>}|</code>/<code>|{</code> một hoặc nhiều). Khối thực thể <code>PATIENT { string patientId PK  string fullName }</code> — mức khái niệm: một định danh (PK) và vài thuộc tính chính, KHÔNG khoá ngoại (Mermaid cần một chữ kiểu trước mỗi thuộc tính; không chấm phần kiểu).',
  },
  state: {
    en: '<b>Mermaid stateDiagram-v2.</b> <code>[*] --> Requested</code> (initial) · <code>Requested --> Confirmed : confirm [slot still free] / send e-ticket</code> (event [guard] / action) · <code>Completed --> [*]</code> (final) · long names: <code>state "Under Review" as UnderReview</code>. States are CONDITIONS (adjective / past participle), not activities.',
    vi: '<b>Mermaid stateDiagram-v2.</b> <code>[*] --> Requested</code> (trạng thái đầu) · <code>Requested --> Confirmed : confirm [slot still free] / send e-ticket</code> (sự kiện [điều kiện] / hành động) · <code>Completed --> [*]</code> (kết thúc) · tên dài: <code>state "Under Review" as UnderReview</code>. Trạng thái là TÌNH TRẠNG (tính từ / quá khứ phân từ), không phải hoạt động.',
  },
  swimlane: {
    en: '<b>PlantUML activity.</b> <code>|Patient|</code> starts a lane · <code>start</code> · <code>:Submit booking request;</code> · <code>if (Slot free?) then (yes)</code> … <code>else (no)</code> … <code>endif</code> · <code>stop</code>. Lanes are ROLES; each action sits in the lane of whoever performs it.',
    vi: '<b>PlantUML activity.</b> <code>|Patient|</code> mở một lane · <code>start</code> · <code>:Submit booking request;</code> · <code>if (Slot free?) then (yes)</code> … <code>else (no)</code> … <code>endif</code> · <code>stop</code>. Lane là VAI TRÒ; mỗi hành động nằm trong lane của người thực hiện nó.',
  },
};

/* ═══════════════════════════════ THUẬT NGỮ (EN → VI) ═══════════════════════════════ */
export const TN = {
  requirement: { en: 'requirement', vi: 'yêu cầu — điều hệ thống phải làm/có, hoặc ràng buộc lên nó' },
  businessReq: { en: 'business requirement', vi: 'yêu cầu nghiệp vụ — VÌ SAO tổ chức làm hệ thống (mục tiêu, lợi ích); ghi trong Vision & Scope' },
  userReq: { en: 'user requirement', vi: 'yêu cầu người dùng — việc người dùng phải làm được (use case, user story)' },
  functionalReq: { en: 'functional requirement (FR)', vi: 'yêu cầu chức năng — hành vi hệ thống thể hiện trong điều kiện cụ thể ("The system shall…"); ghi trong SRS' },
  nfr: { en: 'nonfunctional requirement (NFR)', vi: 'yêu cầu phi chức năng — thuộc tính chất lượng, giao diện ngoài, ràng buộc' },
  qualityAttr: { en: 'quality attribute', vi: 'thuộc tính chất lượng — các "-ility": performance, usability, security, availability…' },
  constraint: { en: 'design / implementation constraint', vi: 'ràng buộc thiết kế/hiện thực — giới hạn lựa chọn của đội phát triển (ngôn ngữ, nền tảng, chuẩn)' },
  businessRule: { en: 'business rule', vi: 'quy tắc nghiệp vụ — chính sách, luật, chuẩn, công thức tồn tại NGOÀI phần mềm' },
  externalInterface: { en: 'external interface requirement', vi: 'yêu cầu giao diện ngoài — giữa hệ thống với người dùng, phần cứng, hệ thống khác' },
  stakeholder: { en: 'stakeholder', vi: 'bên liên quan — người/tổ chức bị ảnh hưởng hoặc ảnh hưởng tới dự án' },
  userClass: { en: 'user class', vi: 'lớp người dùng — nhóm người dùng có cách dùng/nhu cầu giống nhau' },
  productChampion: { en: 'product champion', vi: 'người đại diện chính của một lớp người dùng, nói thay họ với BA' },
  persona: { en: 'persona', vi: 'nhân vật giả định tiêu biểu cho một lớp người dùng' },
  elicitation: { en: 'elicitation', vi: 'khai thác yêu cầu — khám phá nhu cầu từ bên liên quan' },
  analysis: { en: 'analysis', vi: 'phân tích yêu cầu — làm rõ, mô hình hoá, phát hiện thiếu/xung đột' },
  specification: { en: 'specification', vi: 'đặc tả — ghi yêu cầu ra tài liệu có cấu trúc (SRS)' },
  validation: { en: 'validation', vi: 'thẩm định — xác nhận đúng THỨ cần làm (đúng nhu cầu)' },
  verification: { en: 'verification', vi: 'kiểm chứng — xác nhận làm ĐÚNG CÁCH (khớp đặc tả, chất lượng tài liệu)' },
  srs: { en: 'Software Requirements Specification (SRS)', vi: 'tài liệu đặc tả yêu cầu phần mềm' },
  visionScope: { en: 'vision and scope document', vi: 'tài liệu tầm nhìn & phạm vi — chứa business requirements' },
  scope: { en: 'scope', vi: 'phạm vi — phần nào của tầm nhìn dự án/phiên bản này sẽ làm' },
  contextDiagram: { en: 'context diagram', vi: 'sơ đồ ngữ cảnh — hệ thống là MỘT vòng tròn, các thực thể ngoài và luồng dữ liệu vào/ra' },
  externalEntity: { en: 'external entity (terminator)', vi: 'thực thể ngoài — người, tổ chức, hệ thống trao đổi dữ liệu với hệ thống nhưng không thuộc nó' },
  dataFlow: { en: 'data flow', vi: 'luồng dữ liệu — mũi tên có nhãn là DỮ LIỆU (cụm danh từ)' },
  dfd: { en: 'data flow diagram (DFD)', vi: 'sơ đồ luồng dữ liệu — process, kho dữ liệu, thực thể ngoài, luồng' },
  dataStore: { en: 'data store', vi: 'kho dữ liệu — nơi dữ liệu nằm lại (tên danh từ số nhiều)' },
  blackHole: { en: 'black hole / miracle', vi: 'process chỉ có vào không có ra / chỉ có ra không có vào — lỗi DFD' },
  balancing: { en: 'balancing (levelling)', vi: 'cân bằng giữa các mức DFD — luồng vào/ra của process cha phải khớp sơ đồ con' },
  useCase: { en: 'use case', vi: 'ca sử dụng — một mục tiêu actor đạt được nhờ hệ thống (tên: động từ + danh từ)' },
  actor: { en: 'actor', vi: 'tác nhân — vai trò (người hoặc hệ thống) bên ngoài tương tác với hệ thống' },
  primaryActor: { en: 'primary / secondary actor', vi: 'tác nhân chính (khởi động use case để đạt mục tiêu) / phụ (hệ thống cần nó giúp)' },
  include: { en: '«include»', vi: 'gộp — use case gốc LUÔN gọi use case được gộp; mũi tên gốc → được gộp' },
  extend: { en: '«extend»', vi: 'mở rộng — hành vi CÓ ĐIỀU KIỆN chèn vào use case gốc; mũi tên mở rộng → gốc' },
  generalization: { en: 'generalization', vi: 'tổng quát hoá — actor/use case con kế thừa cha (mũi tên tam giác rỗng tới cha)' },
  systemBoundary: { en: 'system boundary', vi: 'biên hệ thống — khung chữ nhật chứa mọi use case; actor ở ngoài' },
  normalFlow: { en: 'normal flow (main success scenario)', vi: 'luồng chính — chuỗi bước thành công điển hình' },
  altFlow: { en: 'alternative flow', vi: 'luồng thay thế — cách khác vẫn đạt mục tiêu' },
  exception: { en: 'exception', vi: 'ngoại lệ — điều kiện làm use case không đạt mục tiêu, và cách xử lý' },
  precondition: { en: 'precondition / postcondition', vi: 'tiền điều kiện (phải đúng trước khi bắt đầu) / hậu điều kiện (đúng sau khi xong)' },
  trigger: { en: 'trigger', vi: 'sự kiện kích hoạt use case' },
  erd: { en: 'entity-relationship diagram (ERD)', vi: 'sơ đồ thực thể – quan hệ' },
  cardinality: { en: 'cardinality', vi: 'bản số — một-một, một-nhiều, nhiều-nhiều (và tuỳ chọn 0 hay bắt buộc 1)' },
  associativeEntity: { en: 'associative entity', vi: 'thực thể kết hợp — tách quan hệ nhiều-nhiều khi mỗi lần liên kết có dữ liệu riêng' },
  dataDictionary: { en: 'data dictionary', vi: 'từ điển dữ liệu — định nghĩa mọi phần tử dữ liệu (thành phần, kiểu, độ dài, giá trị hợp lệ)' },
  crud: { en: 'CRUD matrix', vi: 'ma trận Create/Read/Update/Delete giữa use case (hoặc actor) và thực thể — tìm yêu cầu thiếu' },
  stateDiagram: { en: 'state-transition diagram', vi: 'sơ đồ chuyển trạng thái — đời sống của MỘT đối tượng' },
  guard: { en: 'guard condition', vi: 'điều kiện canh — [biểu thức] phải đúng thì chuyển trạng thái mới xảy ra' },
  swimlane: { en: 'swimlane (activity) diagram', vi: 'sơ đồ làn bơi — ai làm gì, theo thứ tự nào; lộ điểm bàn giao' },
  decisionTable: { en: 'decision table', vi: 'bảng quyết định — mọi tổ hợp điều kiện ⇒ hành động (n điều kiện ⇒ 2ⁿ cột)' },
  dialogMap: { en: 'dialog map', vi: 'sơ đồ hội thoại — trạng thái là màn hình, chuyển là hành động người dùng' },
  wireframe: { en: 'wireframe / mock-up', vi: 'khung giao diện / bản mô phỏng màn hình' },
  prototype: { en: 'prototype', vi: 'nguyên mẫu — bản thử để làm rõ yêu cầu (throwaway / evolutionary, mock-up / proof of concept)' },
  moscow: { en: 'MoSCoW', vi: 'Must / Should / Could / Won’t (this time) — thang ưu tiên' },
  valueCostRisk: { en: 'value / cost / risk prioritization', vi: 'xếp ưu tiên kiểu Wiegers: priority = value% ÷ (cost% × trọng số + risk% × trọng số)' },
  rtm: { en: 'requirements traceability matrix (RTM)', vi: 'ma trận truy vết yêu cầu — nối nguồn ↔ yêu cầu ↔ thiết kế ↔ mã ↔ test' },
  baseline: { en: 'baseline', vi: 'đường cơ sở — bộ yêu cầu đã thống nhất, từ đó mọi thay đổi phải qua kiểm soát' },
  ccb: { en: 'change control board (CCB)', vi: 'hội đồng kiểm soát thay đổi — người quyết định chấp nhận/từ chối thay đổi' },
  impactAnalysis: { en: 'impact analysis', vi: 'phân tích ảnh hưởng — thay đổi này chạm tới yêu cầu, thiết kế, mã, test nào, tốn bao nhiêu' },
  inspection: { en: 'inspection', vi: 'thanh tra — loại review hình thức nhất, có vai trò và quy trình' },
  acceptanceCriteria: { en: 'acceptance criteria', vi: 'tiêu chí chấp nhận — điều kiện để khách nhận một yêu cầu/story (Given/When/Then)' },
  userStory: { en: 'user story', vi: 'câu chuyện người dùng — "As a <role>, I want <goal> so that <benefit>"' },
  invest: { en: 'INVEST', vi: 'Independent · Negotiable · Valuable · Estimable · Small · Testable — tiêu chí story tốt' },
  epic: { en: 'epic', vi: 'story lớn, phải tách thành nhiều story' },
  backlog: { en: 'product backlog', vi: 'danh sách việc của sản phẩm, xếp theo ưu tiên' },
  planguage: { en: 'Planguage', vi: 'ngôn ngữ của Tom Gilb để viết yêu cầu chất lượng đo được (TAG, SCALE, METER, GOAL…)' },
  verifiable: { en: 'verifiable', vi: 'kiểm chứng được — có cách test/đo để biết đạt hay không' },
  ambiguous: { en: 'ambiguous', vi: 'mơ hồ — hiểu được nhiều cách' },
  tbd: { en: 'TBD (to be determined)', vi: 'chỗ chưa quyết, đánh dấu để theo dõi tới khi đóng' },
  goldPlating: { en: 'gold plating', vi: 'mạ vàng — dev tự thêm chức năng không ai yêu cầu' },
  scopeCreep: { en: 'scope creep (creeping requirements)', vi: 'phạm vi phình dần ngoài kiểm soát' },
  raci: { en: 'RACI', vi: 'Responsible (làm) · Accountable (chịu trách nhiệm cuối, đúng 1 người) · Consulted (được hỏi) · Informed (được báo)' },
};
export const tn = (...ten) => ten.map((t) => {
  if (!TN[t]) throw new Error(`thuật ngữ lạ ${t}`);
  return TN[t];
});

/** Bảng HTML có tiêu đề cột in đậm và ô ngắn (dùng trong đề). */
export const bang = bangHtml;
/** Khối mã (đã escape). */
export const ma = preMa;
