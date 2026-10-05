/**
 * Dữ liệu mục "Làm dự án với AI" (AI-native delivery) trên /about/quy-trinh
 * và ghi chú vai trò trên /about/quy-trinh/to-chuc.
 *
 * ─── LUẬT (giống data.ts) ────────────────────────────────────────────────────
 *   · KHÔNG số liệu bịa. Báo cáo SDAD có nhiều con số minh hoạ do tác giả tự
 *     ước lượng — KHÔNG lấy con số nào của bài lên trang. Chỉ mượn KHÁI NIỆM
 *     (4 bước, Spec Fidelity 4 chiều, tách quyền tổng hợp / quyền phát hành,
 *     provenance, vai trò đổi, ước lượng có hiệu chỉnh).
 *   · Ngưỡng Spec Fidelity KHÔNG có số mặc định — "ngưỡng thoả thuận" với khách.
 *   · Nguồn đã kiểm (05/10/2026):
 *       - arXiv:2608.20341 — "SDAD: Spec-Driven Agentic Development for the
 *         AI-Native SDLC", Vu Hung Nguyen & Thanh Nguyen. Tóm tắt tự gọi là
 *         "this report"; bản arXiv, chưa bình duyệt. Mục 7.2 định nghĩa Spec
 *         Fidelity + 4 chiều; mục 8.3 nói quyền merge/phát hành ở lại với người.
 *       - ISO/IEC/IEEE 29148:2018 (ấn bản 2, thay bản 2011) — đặc tính của
 *         một yêu cầu tốt (unambiguous, complete, verifiable…) và của bộ yêu
 *         cầu (complete, consistent…).
 *   · Công cụ: chỉ nêu thứ có thật trong repo — CT Work (/work) và AI Code
 *     (app desktop, desktop/src/main/agent: hiện diff để duyệt, chế độ quyền
 *     từ "chỉ lập kế hoạch" tới "hỏi trước"). Tính năng kiểm Spec Fidelity /
 *     nhãn AI-assisted của CT Work đang xây (đợt S6) — câu chữ mô tả việc
 *     studio LÀM bằng CT Work, link chỉ trỏ /work chung, không trỏ trang con.
 */
import type { Bi, DeptKey, PhaseKey } from './data';

export const SDAD_URL = 'https://arxiv.org/abs/2608.20341';

/** Năm nguyên tắc dùng AI có kiểm soát. */
export const AI_PRINCIPLES: { id: string; title: Bi; body: Bi; href?: string; hrefLabel?: Bi }[] = [
  {
    id: 'dac-ta-truoc',
    title: ['Đặc tả rõ trước, rồi mới để AI viết', 'A clear spec first, then AI writes'],
    body: [
      'AI làm đúng theo những gì được viết ra — kể cả chỗ viết thiếu hay viết mơ hồ. Vì vậy yêu cầu phải qua cổng Spec Fidelity (đủ, nhất quán, một nghĩa, kiểm chứng được) trước khi được dùng để sinh mã hay sinh test.',
      'AI does exactly what is written — including the gaps and the vague parts. So requirements pass the Spec Fidelity gate (complete, consistent, unambiguous, verifiable) before they are used to generate code or tests.',
    ],
  },
  {
    id: 'tach-quyen',
    title: ['AI viết — người khác duyệt', 'AI writes — someone else approves'],
    body: [
      'Thứ AI tổng hợp không được tự duyệt phát hành. Một người khác (hoặc một bước kiểm độc lập như CI, test do người viết) xem lại trước khi merge. Người chịu trách nhiệm về thay đổi là người bấm duyệt, không phải công cụ.',
      'Whatever AI synthesises never approves its own release. Another person (or an independent check such as CI or human-written tests) reviews it before merge. The person who approves is accountable for the change — not the tool.',
    ],
  },
  {
    id: 'gan-nhan',
    title: ['Gắn nhãn và truy vết được', 'Labelled and traceable'],
    body: [
      'Mọi thay đổi có AI hỗ trợ được gắn nhãn "AI-assisted" và nối được: thay đổi ↔ phiên bản đặc tả đã dùng ↔ công cụ/model ↔ kết quả cổng kiểm (review, CI). Khi có lỗi, biết ngay nó đến từ đâu.',
      'Every AI-assisted change is labelled "AI-assisted" and linked: change ↔ spec version used ↔ tool/model ↔ gate results (review, CI). When something breaks, its origin is known.',
    ],
  },
  {
    id: 'du-lieu-khach',
    title: ['Dữ liệu của khách không vào AI khi chưa được đồng ý', 'Client data stays out of AI without consent'],
    body: [
      'Tài liệu nội bộ, mã nguồn và dữ liệu cá nhân của khách chỉ được đưa vào công cụ AI khi khách đồng ý bằng văn bản, với nhà cung cấp đã chốt trong DPA. Cần chặt hơn thì dùng tài khoản AI của chính khách hoặc chạy mô hình cục bộ.',
      'Client internal documents, source code and personal data go into an AI tool only with the client’s written consent, through a provider named in the DPA. Where stricter control is needed, the client’s own AI account or a local model is used.',
    ],
    href: '/about/bao-mat#ai',
    hrefLabel: ['Bảo mật: AI & dữ liệu', 'Security: AI & data'],
  },
  {
    id: 'uoc-luong',
    title: ['Báo giá theo ước lượng đã hiệu chỉnh', 'Quotes from calibrated estimates'],
    body: [
      'Tốc độ AI thay đổi theo từng loại việc, nên không có hệ số "nhanh hơn X%" chung. Với dự án lớn, studio làm thử một phần nhỏ trước (một lát chức năng đầu-cuối), đo công thật, rồi mới chốt ước lượng cho phần còn lại.',
      'AI speed varies by kind of work, so there is no blanket "X% faster" factor. On larger projects the studio first builds a small slice end-to-end, measures the real effort, and only then commits to an estimate for the rest.',
    ],
  },
];

/** AI làm gì / người duyệt gì — theo 7 pha của data.ts. */
export const AI_BY_PHASE: { phase: PhaseKey; ai: Bi; human: Bi }[] = [
  {
    phase: 'discover',
    ai: ['Tóm tắt ghi chú buổi trao đổi, gợi ý câu hỏi khảo sát còn thiếu.', 'Summarise meeting notes, suggest missing discovery questions.'],
    human: ['BA đối chiếu với lời khách nói thật; tài liệu của khách chưa vào AI khi chưa có NDA và sự đồng ý.', 'BA checks against what the client actually said; client documents stay out of AI until the NDA and consent are in place.'],
  },
  {
    phase: 'define',
    ai: ['Soạn nháp user story và Given/When/Then; chỉ ra từ mơ hồ, chỗ mâu thuẫn, trường hợp biên còn thiếu.', 'Draft user stories and Given/When/Then; flag vague words, contradictions and missing edge cases.'],
    human: ['BA chốt nội dung; người khác người viết chấm Spec Fidelity; khách ký SRS. Ước lượng chỉ chốt sau khi làm thử một lát nhỏ.', 'BA finalises; someone other than the author scores Spec Fidelity; the client signs the SRS. Estimates are committed only after a small calibration slice.'],
  },
  {
    phase: 'design',
    ai: ['Đưa phương án kiến trúc thay thế, soạn nháp ADR, dựng prototype nhanh để thử ý.', 'Propose alternative architectures, draft ADRs, build quick prototypes to test ideas.'],
    human: ['Kiến trúc chọn phương án và ghi lý do; UX kiểm với người dùng thật, không với ý kiến của AI.', 'Architecture picks the option and records why; UX validates with real users, not with the AI’s opinion.'],
  },
  {
    phase: 'build',
    ai: ['Sinh mã theo story đã có tiêu chí chấp nhận, viết unit test, refactor.', 'Generate code from stories with acceptance criteria, write unit tests, refactor.'],
    human: ['Dev khác review PR có nhãn AI-assisted; CI xanh trên bản cuối; không merge thứ chưa ai đọc.', 'Another developer reviews the AI-assisted PR; CI green on the final version; nothing unread is merged.'],
  },
  {
    phase: 'verify',
    ai: ['Gợi ý test case biên, sinh dữ liệu thử giả, đọc log để khoanh vùng lỗi.', 'Suggest edge-case tests, generate synthetic test data, read logs to narrow down defects.'],
    human: ['QA quyết đạt / chưa đạt; AppSec review phần nhạy cảm; test do AI sửa thì AI không tự kết luận "đạt".', 'QA decides pass / fail; AppSec reviews sensitive parts; when AI repaired a test, AI does not declare the pass.'],
  },
  {
    phase: 'ship',
    ai: ['Soạn nháp release notes từ lịch sử thay đổi và hướng dẫn sử dụng.', 'Draft release notes from the change history, and user guides.'],
    human: ['PM và khách duyệt nội dung; quyết định go-live và biên bản nghiệm thu luôn do người ký.', 'PM and client approve the wording; go-live decisions and acceptance records are always signed by people.'],
  },
  {
    phase: 'run',
    ai: ['Tóm tắt log sự cố, phân loại ticket, soạn nháp postmortem.', 'Summarise incident logs, triage tickets, draft postmortems.'],
    human: ['Người trực quyết định khôi phục; agent AI không có quyền ghi trên production; nguyên nhân gốc do người xác nhận.', 'The on-call person decides on recovery; AI agents get no write access to production; root cause is confirmed by a person.'],
  },
];

/** Bốn chiều Spec Fidelity + ví dụ viết xấu / viết tốt (bối cảnh minh hoạ: hệ thống đặt lịch phòng lab). */
export const SPEC_FIDELITY: { key: string; name: Bi; plain: Bi; bad: Bi; good: Bi }[] = [
  {
    key: 'completeness',
    name: ['Đầy đủ', 'Completeness'],
    plain: ['Có cả trường hợp biên và lúc hỏng, không chỉ đường thuận.', 'Edge cases and failure modes are written down, not just the happy path.'],
    bad: ['Sinh viên đặt lịch dùng phòng lab.', 'Students book a lab room.'],
    good: [
      'Sinh viên đặt lịch phòng còn trống. Nếu khung giờ đã kín, hệ thống từ chối và hiện thông báo MSG-07. Nếu mất kết nối giữa chừng, không tạo lịch dở dang.',
      'Students book a free room. If the slot is taken, the system refuses and shows message MSG-07. If the connection drops mid-way, no half-made booking is created.',
    ],
  },
  {
    key: 'consistency',
    name: ['Nhất quán', 'Consistency'],
    plain: ['Các yêu cầu không cãi nhau.', 'Requirements do not contradict each other.'],
    bad: [
      'BR-03: Sinh viên được huỷ lịch bất cứ lúc nào. · BR-11: Không được huỷ lịch trong 24 giờ trước giờ dùng.',
      'BR-03: Students may cancel at any time. · BR-11: Bookings cannot be cancelled within 24 hours of the slot.',
    ],
    good: [
      'BR-03: Sinh viên được huỷ lịch đến 24 giờ trước giờ dùng; sau mốc đó chỉ quản lý lab huỷ được (xem BR-11).',
      'BR-03: Students may cancel up to 24 hours before the slot; after that only the lab manager can cancel (see BR-11).',
    ],
  },
  {
    key: 'unambiguity',
    name: ['Một nghĩa', 'Unambiguity'],
    plain: ['Hai người đọc hiểu giống nhau, đọc lại tuần sau vẫn hiểu như cũ.', 'Two readers understand it the same way, and still do next week.'],
    bad: ['Trang danh sách thiết bị phải tải nhanh.', 'The equipment list page must load fast.'],
    good: [
      'Trang danh sách thiết bị (500 thiết bị) hiển thị nội dung chính (LCP) dưới 2,5 giây ở phân vị 75, trên mạng 4G.',
      'The equipment list page (500 items) shows its main content (LCP) in under 2.5 s at the 75th percentile on 4G.',
    ],
  },
  {
    key: 'verifiability',
    name: ['Kiểm chứng được', 'Verifiability'],
    plain: ['Viết được phép kiểm đạt / không đạt khách quan, tốt nhất là tự động.', 'An objective pass / fail check can be written — ideally automated.'],
    bad: ['Hệ thống thân thiện với người dùng.', 'The system is user-friendly.'],
    good: [
      'Given sinh viên đã đăng nhập, When đặt một phòng còn trống, Then lịch hiện trong "Lịch của tôi" và email xác nhận được gửi trong vòng 1 phút.',
      'Given a signed-in student, When they book a free room, Then the booking appears in "My bookings" and a confirmation email is sent within 1 minute.',
    ],
  },
];

/** Công cụ studio dùng — chỉ thứ có thật. */
export const AI_TOOLS: { name: string; body: Bi; href: string; cta: Bi }[] = [
  {
    name: 'CT Work',
    body: [
      'Nơi quản lý việc của dự án. CT Work kiểm chất lượng đặc tả theo bốn chiều Spec Fidelity trước khi việc được giao, và gắn nhãn AI-assisted cho thay đổi có AI hỗ trợ để nối về yêu cầu, phiên bản đặc tả và kết quả review.',
      'Where project work is managed. CT Work checks specification quality on the four Spec Fidelity dimensions before work is handed out, and labels AI-assisted changes so they link back to the requirement, the spec version and the review result.',
    ],
    href: '/work',
    cta: ['Mở CT Work', 'Open CT Work'],
  },
  {
    name: 'AI Code',
    body: [
      'Agent lập trình trong app desktop của studio: đọc và sửa mã ngay trên máy. Mỗi lần sửa file hiện diff để người duyệt trước khi ghi; có chế độ chỉ lập kế hoạch (không sửa gì). Trên mã của khách, studio dùng chế độ hỏi trước mỗi lần sửa hoặc chạy lệnh.',
      'The coding agent in the studio’s desktop app: reads and edits code on the machine. Every file edit shows a diff for approval before it is written; a plan-only mode changes nothing. On client code the studio uses the ask-before-every-edit-or-command mode.',
    ],
    href: '/download',
    cta: ['Tải app desktop', 'Get the desktop app'],
  },
];

/** Vai trò đổi khi làm với AI — dùng trên trang tổ chức. */
export const AI_ROLE_SHIFTS: { dept: DeptKey; shift: Bi }[] = [
  {
    dept: 'ba',
    shift: [
      'Từ "viết tài liệu" sang "viết đặc tả máy làm theo được": tiêu chí chấp nhận chặt, có trường hợp biên, qua được cổng Spec Fidelity.',
      'From "writing documents" to "writing specs a machine can follow": tight acceptance criteria, edge cases included, passing the Spec Fidelity gate.',
    ],
  },
  {
    dept: 'dev',
    shift: [
      'Viết ít dòng hơn, đọc nhiều hơn: chia việc cho AI theo story, review kỹ thứ AI sinh, và chịu trách nhiệm về mọi thứ mình duyệt.',
      'Write fewer lines, read more: hand AI work per story, review what it generates carefully, and own everything you approve.',
    ],
  },
  {
    dept: 'qa',
    shift: [
      'Từ chạy test sang đặt chính sách đánh giá: tiêu chí đạt / không đạt, bộ eval, và giữ quyền kết luận tách khỏi công cụ đã viết hay sửa test.',
      'From running tests to owning the evaluation policy: pass / fail criteria, eval sets, and keeping the verdict separate from the tool that wrote or repaired the tests.',
    ],
  },
  {
    dept: 'devops',
    shift: [
      'Đặt giới hạn quyền cho agent AI: được đọc gì, ghi ở đâu, chạy lệnh nào; không quyền ghi trên production; lưu vết để truy lại.',
      'Set the limits for AI agents: what they may read, where they may write, which commands they may run; no production write access; an audit trail to trace back.',
    ],
  },
];
