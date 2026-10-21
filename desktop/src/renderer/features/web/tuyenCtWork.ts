/**
 * Tuyến của cây CT Work (`frontend/src/app/work`) cho app desktop — TÁCH khỏi
 * `dinhTuyenWeb.ts` ngày 13/10/2026 để app CT Work RIÊNG (biến thể `ctwork`) chỉ
 * gói đúng phần này. App CuongThai vẫn nhận đủ: `TUYEN_WEB` = các cây khác + mảng này.
 *
 * ⚠️ THÊM TRANG MỚI DƯỚI `app/work` ⇒ thêm tuyến Ở ĐÂY (tĩnh TRƯỚC động — mọi
 * cảnh báo thứ tự ngay bên dưới vẫn nguyên giá trị). Thiếu là app báo "Không tìm thấy".
 */
import type { TuyenWeb } from './dinhTuyenWeb';

export const TUYEN_CTWORK: readonly TuyenWeb[] = [
  /* ── CT Work (kiểu Jira) — 23/09/2026 ──
     Đối chiếu bằng `find frontend/src/app/work -name page.tsx` ⇒ 40 trang (06/10/2026, sau Resources).
     Khung chung (`app/work/layout.tsx`: thanh bên, bảng lệnh ⌘K, AI, `#work-portal`,
     `work.css`) do `CtWorkPage` dựng — xem tệp đó.

     ⚠️ TĨNH TRƯỚC ĐỘNG, BA chỗ: `/work/invite/:token`, `/work/share/:token` cùng
     hình dạng với `/work/:ws/:key`, còn `/work/developer` và `/work/search` cùng hình dạng với
     `/work/:ws`. Đảo thứ tự là "developer" bị đọc thành slug không gian làm việc
     và trang hiện "workspace not found" — hỏng CÂM.
     Tương tự `/work/:ws/settings` phải đứng trước `/work/:ws/:key` (không thì
     "settings" thành mã dự án), và `/work/:ws/:key/tests/cycles/:cycleId` dài 6
     đoạn nên không đụng `/work/:ws/:key/tests/:num` (5 đoạn). */
  { mau: '/work', nap: () => import('@/app/work/page') },
  { mau: '/work/developer', nap: () => import('@/app/work/developer/page') },
  /* CTW đợt 7c (11/10/2026): 2FA cho thành viên — tĩnh, phải đứng TRƯỚC `/work/:ws` (không thì "security" thành slug). */
  { mau: '/work/security', nap: () => import('@/app/work/security/page') },
  /* CTW đợt 8a (12/10/2026): kết nối Microsoft 365 / Google của tôi — tĩnh, TRƯỚC `/work/:ws`. */
  { mau: '/work/connections', nap: () => import('@/app/work/connections/page') },
  /* Tìm thẻ mọi dự án (24/09) — tĩnh, phải đứng TRƯỚC `/work/:ws`. */
  { mau: '/work/search', nap: () => import('@/app/work/search/page') },
  /* CTW đợt 5 (10/10/2026): hub giảng viên + lớp học — tĩnh, phải đứng TRƯỚC `/work/:ws` (không thì "teaching" thành slug). */
  { mau: '/work/teaching', nap: () => import('@/app/work/teaching/page') },
  { mau: '/work/classes', nap: () => import('@/app/work/classes/page') },
  { mau: '/work/invite/:token', nap: () => import('@/app/work/invite/[token]/page') },
  { mau: '/work/share/:token', nap: () => import('@/app/work/share/[token]/page') },
  { mau: '/work/survey/:token', nap: () => import('@/app/work/survey/[token]/page') }, // 6b: khảo sát công khai
  { mau: '/work/form/:token', nap: () => import('@/app/work/form/[token]/page') }, // 7b: điền biểu mẫu (tĩnh, trước /:ws/:key)
  { mau: '/work/mockup-review/:token', nap: () => import('@/app/work/mockup-review/[token]/page') }, // 6b: khách duyệt prototype
  { mau: '/work/:ws', nap: () => import('@/app/work/[ws]/page') },
  { mau: '/work/:ws/settings', nap: () => import('@/app/work/[ws]/settings/page') },
  /* Lớp studio Đợt S1 (04/10/2026): bộ phận — tĩnh "teams" phải đứng TRƯỚC
     `/work/:ws/:key`, và `/teams/:teamId` (4 đoạn) trước `/:key/board`. */
  { mau: '/work/:ws/teams', nap: () => import('@/app/work/[ws]/teams/page') },
  { mau: '/work/:ws/teams/:teamId', nap: () => import('@/app/work/[ws]/teams/[teamId]/page') },
  /* Đợt S3a (04/10/2026): danh mục dự án + khối lượng việc — tĩnh, phải đứng TRƯỚC `/work/:ws/:key`. */
  { mau: '/work/:ws/portfolio', nap: () => import('@/app/work/[ws]/portfolio/page') },
  { mau: '/work/:ws/workload', nap: () => import('@/app/work/[ws]/workload/page') },
  { mau: '/work/:ws/okrs', nap: () => import('@/app/work/[ws]/okrs/page') }, // CTW đợt 7a: OKR không gian (tĩnh, trước /:key)
  /* CTW-28 A14 (09/10/2026): AI agent thành viên — tĩnh, phải đứng TRƯỚC `/work/:ws/:key`; `/agents/:id` (4 đoạn) cũng
     trước `/:key/board` (cùng 4 đoạn — "agents" không bao giờ là mã dự án vì mã VIẾT HOA). */
  { mau: '/work/:ws/agents', nap: () => import('@/app/work/[ws]/agents/page') },
  { mau: '/work/:ws/agents/:id', nap: () => import('@/app/work/[ws]/agents/[id]/page') },
  { mau: '/work/:ws/ai-usage', nap: () => import('@/app/work/[ws]/ai-usage/page') }, // CTW đợt 8B: AI trong không gian (tĩnh, trước /:key)
  { mau: '/work/:ws/setup', nap: () => import('@/app/work/[ws]/setup/page') }, // 20/10/2026: Create with CuongMini (tĩnh, trước /:key)
  { mau: '/work/:ws/feed', nap: () => import('@/app/work/[ws]/feed/page') }, // 21/10/2026: Bảng tin của không gian (tĩnh, trước /:key)
  { mau: '/work/:ws/:key', nap: () => import('@/app/work/[ws]/[key]/page') },
  { mau: '/work/:ws/:key/board', nap: () => import('@/app/work/[ws]/[key]/board/page') },
  { mau: '/work/:ws/:key/backlog', nap: () => import('@/app/work/[ws]/[key]/backlog/page') },
  { mau: '/work/:ws/:key/list', nap: () => import('@/app/work/[ws]/[key]/list/page') },
  { mau: '/work/:ws/:key/timeline', nap: () => import('@/app/work/[ws]/[key]/timeline/page') },
  { mau: '/work/:ws/:key/releases', nap: () => import('@/app/work/[ws]/[key]/releases/page') },
  { mau: '/work/:ws/:key/reports', nap: () => import('@/app/work/[ws]/[key]/reports/page') },
  /* CTW đợt 8b (12/10/2026): Reports → Builder (?tab=builder|plans|log) + Notion & Slack (?tab=notion|slack). */
  { mau: '/work/:ws/:key/reports/builder', nap: () => import('@/app/work/[ws]/[key]/reports/builder/page') },
  { mau: '/work/:ws/:key/connect', nap: () => import('@/app/work/[ws]/[key]/connect/page') },
  { mau: '/work/:ws/:key/dashboards', nap: () => import('@/app/work/[ws]/[key]/dashboards/page') },
  { mau: '/work/:ws/:key/tests', nap: () => import('@/app/work/[ws]/[key]/tests/page') },
  /* CTW đợt 3B (09/10/2026): báo cáo Excel nộp trường (WBS, Project Tracking, Weekly Report, AI Usage). */
  { mau: '/work/:ws/:key/school', nap: () => import('@/app/work/[ws]/[key]/school/page') },
  { mau: '/work/:ws/:key/team', nap: () => import('@/app/work/[ws]/[key]/team/page') }, // UX-C: Team overview
  { mau: '/work/:ws/:key/submit', nap: () => import('@/app/work/[ws]/[key]/submit/page') }, // CTW cổng nộp bài
  { mau: '/work/:ws/:key/settings', nap: () => import('@/app/work/[ws]/[key]/settings/page') },
  // Lớp studio Đợt S1: giai đoạn & cổng, phê duyệt có chữ ký.
  { mau: '/work/:ws/:key/stages', nap: () => import('@/app/work/[ws]/[key]/stages/page') },
  { mau: '/work/:ws/:key/approvals', nap: () => import('@/app/work/[ws]/[key]/approvals/page') },
  // Đợt S2a: tài liệu dự án kiểu Confluence (mô-đun docs).
  { mau: '/work/:ws/:key/docs', nap: () => import('@/app/work/[ws]/[key]/docs/page') },
  { mau: '/work/:ws/:key/docs/:num', nap: () => import('@/app/work/[ws]/[key]/docs/[num]/page') },
  // Đợt S2b: cổng khách (mô-đun clientPortal) + biên bản nghiệm thu in được.
  { mau: '/work/:ws/:key/portal', nap: () => import('@/app/work/[ws]/[key]/portal/page') },
  { mau: '/work/:ws/:key/portal/uat/:aid', nap: () => import('@/app/work/[ws]/[key]/portal/uat/[aid]/page') },
  // Đợt S3b (04/10/2026): họp · yêu cầu thay đổi · sổ RAID.
  { mau: '/work/:ws/:key/meetings', nap: () => import('@/app/work/[ws]/[key]/meetings/page') },
  { mau: '/work/:ws/:key/meetings/:num', nap: () => import('@/app/work/[ws]/[key]/meetings/[num]/page') },
  { mau: '/work/:ws/:key/changes', nap: () => import('@/app/work/[ws]/[key]/changes/page') },
  { mau: '/work/:ws/:key/changes/:num', nap: () => import('@/app/work/[ws]/[key]/changes/[num]/page') },
  { mau: '/work/:ws/:key/raid', nap: () => import('@/app/work/[ws]/[key]/raid/page') },
  // Đợt S4 (04/10/2026): tài chính dự án · chế độ thuyết trình.
  { mau: '/work/:ws/:key/finance', nap: () => import('@/app/work/[ws]/[key]/finance/page') },
  { mau: '/work/:ws/:key/present', nap: () => import('@/app/work/[ws]/[key]/present/page') },
  // Đợt S5a (04/10/2026): service desk & SLA.
  { mau: '/work/:ws/:key/desk', nap: () => import('@/app/work/[ws]/[key]/desk/page') },
  /* Đợt S6 (05/10/2026): Spec quality — chấm Spec Fidelity tập thẻ yêu cầu + lịch sử. */
  { mau: '/work/:ws/:key/spec', nap: () => import('@/app/work/[ws]/[key]/spec/page') },
  /* CTW đợt 4 (09/10/2026): Requirements — SRS có cấu trúc (UC/actor/BR/màn/phân quyền) + RTM. */
  { mau: '/work/:ws/:key/requirements', nap: () => import('@/app/work/[ws]/[key]/requirements/page') },
  /* Resources (06/10/2026): thư viện link của dự án. */
  { mau: '/work/:ws/:key/resources', nap: () => import('@/app/work/[ws]/[key]/resources/page') },
  /* CTW K-3 (10/10/2026): kênh chat dự án (?c= kênh, ?m= tin, ?t= luồng). */
  { mau: '/work/:ws/:key/chat', nap: () => import('@/app/work/[ws]/[key]/chat/page') },
  { mau: '/work/:ws/:key/feed', nap: () => import('@/app/work/[ws]/[key]/feed/page') }, // 21/10/2026: Bảng tin của dự án
  /* CTW Diagram (10/10/2026): Diagram Studio (?d= mở một sơ đồ). */
  { mau: '/work/:ws/:key/diagrams', nap: () => import('@/app/work/[ws]/[key]/diagrams/page') },
  /* CTW đợt 4b (10/10/2026): hồ sơ SWR302 theo Wiegers (?tab= overview|features|requirements|priority|glossary|dictionary|six-links). */
  { mau: '/work/:ws/:key/wiegers', nap: () => import('@/app/work/[ws]/[key]/wiegers/page') },
  { mau: '/work/:ws/:key/reviews', nap: () => import('@/app/work/[ws]/[key]/reviews/page') }, // CTW đợt 6: review/inspection + baseline
  { mau: '/work/:ws/:key/code', nap: () => import('@/app/work/[ws]/[key]/code/page') }, // CTW Code (18/10/2026): hoạt động Git, nhánh, PR, mã nguồn
  { mau: '/work/:ws/:key/assets', nap: () => import('@/app/work/[ws]/[key]/assets/page') }, // CTW đợt 7c: sổ tài sản & giấy phép
  /* CTW đợt 7b (11/10/2026): biểu mẫu → thẻ · kênh ngoài → đề xuất (?tab=inbox|channels) · nhập Trello/Asana/Jira/CSV · knowledge base. */
  { mau: '/work/:ws/:key/forms', nap: () => import('@/app/work/[ws]/[key]/forms/page') },
  { mau: '/work/:ws/:key/intake', nap: () => import('@/app/work/[ws]/[key]/intake/page') },
  { mau: '/work/:ws/:key/import', nap: () => import('@/app/work/[ws]/[key]/import/page') },
  { mau: '/work/:ws/:key/kb', nap: () => import('@/app/work/[ws]/[key]/kb/page') },
  /* CTW đợt 7a (11/10/2026): OKR dự án · planning poker (?s= phòng) · retro board (?r= bảng). */
  { mau: '/work/:ws/:key/okrs', nap: () => import('@/app/work/[ws]/[key]/okrs/page') },
  { mau: '/work/:ws/:key/poker', nap: () => import('@/app/work/[ws]/[key]/poker/page') },
  { mau: '/work/:ws/:key/retros', nap: () => import('@/app/work/[ws]/[key]/retros/page') },
  { mau: '/work/:ws/:key/tests/:num', nap: () => import('@/app/work/[ws]/[key]/tests/[num]/page') },
  { mau: '/work/:ws/:key/issue/:num', nap: () => import('@/app/work/[ws]/[key]/issue/[num]/page') },
  { mau: '/work/:ws/:key/tests/cycles/:cycleId', nap: () => import('@/app/work/[ws]/[key]/tests/cycles/[cycleId]/page') },
];
