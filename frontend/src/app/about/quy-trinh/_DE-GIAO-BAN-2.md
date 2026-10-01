# Đề giao — Quy trình nhận & làm dự án, BẢN 2 (01/10/2026)

User: *"quy trình dự án chuyên nghiệp … tôi cần nó trước để test quy trình và nhận khách hàng chuyên nghiệp ở 1 công ty lớn"*.
Kế hoạch đầy đủ (user duyệt 30/09): memory `project_trang_quy_trinh_du_an` — tóm tắt:
- Luồng trang: (1) **Giới thiệu** (studio + bản thân, CHỈ dữ liệu thật) → (2) **Nhận dự án** (dịch vụ, loại sản phẩm, form gửi yêu cầu + NĐ13)
  → (3) **Chuỗi trang quy trình** (tổng quan + trang con từng giai đoạn: bộ phận, RACI, cổng chất lượng, checklist, mẫu tài liệu).
- Admin duyệt yêu cầu → **1 nút tạo dự án CT Work** từ mẫu "Dự án khách hàng" (mỗi giai đoạn 1 epic + việc + checklist + cổng).
- **Chế độ nhập vai**: user tự gửi yêu cầu như khách rồi làm lần lượt các vai (Presales, BA, UX, Architect, PM, Dev, QA, AppSec,
  DevOps, Support…); khách theo dõi tiến độ qua link chia sẻ CT Work (`src/services/work/share.service.ts`).

## Luật chung
- ⛔ KHÔNG bịa: không số khách, không logo, không lời khen, không "N năm kinh nghiệm", không quy trình nội bộ của công ty có tên.
  Chuẩn tham chiếu phải có thật, đúng mã hiệu (PMBOK 7, Scrum Guide 2020, ITIL 4, ISO/IEC/IEEE 12207:2017, ISO/IEC 25010:2023,
  OWASP ASVS 4.0.3, CMMI ở mức khái niệm, SemVer 2.0.0, Nghị định 13/2023/NĐ-CP, Luật An ninh mạng 2018 …).
- Link học chỉ trỏ slug có thật (`content/academy/<MÃ>.mjs` → `/academy/courses/<slug>`, `content/courses/<slug>.mjs` → `/courses/<slug>`).
- Song ngữ `[vi, en]` như `data.ts` hiện có. Giữ NGUYÊN 15 slug giai đoạn đã công bố.
- Không commit, không deploy, không chạy `npm run build`/`next dev` (người điều phối làm). Không tự tách agent con.

## Gói ND — nội dung quy trình (chỉ `frontend/src/app/about/quy-trinh/*.ts` + `content/quy-trinh/**` + `frontend/public/quy-trinh/**`)
1. Mở rộng `data.ts` lên ~20 giai đoạn: giữ 15 cũ (slug cố định), thêm: tiền bán hàng & đánh giá phù hợp (qualification, go/no-go),
   pháp lý & tài chính (hợp đồng, sở hữu trí tuệ mã nguồn, thanh toán theo mốc, hoá đơn, giấy phép bên thứ ba), chuyển dữ liệu
   (migration), quản lý phát hành (SemVer, release notes, rollback, feature flag), đóng dự án (retrospective, lưu trữ, bàn giao quyền
   truy cập), ngừng/chuyển giao hệ thống (trả dữ liệu, xoá dữ liệu cá nhân đúng luật). Sắp đúng vị trí trong vòng đời, đánh số lại `n`.
2. MỖI giai đoạn điền đủ các trường bản 2 (đã khai sẵn kiểu trong `data.ts`): bộ phận & vai trò tham gia, **RACI** (vai × hoạt động
   chính), đầu vào → đầu ra, **entry/exit criteria**, checklist, **mẫu tài liệu** (`templates`), sai lầm hay gặp (`pitfalls`), ví dụ thật
   LabFlow/cuongthai.com (`example`), link học.
3. File mới `departments.ts`: ~13 bộ phận (Sales/Presales, BA, UX/UI, Solution Architect, PM/Scrum Master, Dev FE/BE/Mobile, QA/QC,
   AppSec, DevOps/SRE, Hạ tầng/Mạng, Data/AI, Support/CSM, Pháp lý/Tài chính, PMO): trách nhiệm, đầu ra, chuyển giao gì cho ai
   (luồng liên kết), kỹ năng + link học; **RACI tổng** (bộ phận × giai đoạn).
4. **Mẫu tài liệu tải về** ở `frontend/public/quy-trinh/mau/` (Markdown `.md`, mở được ngay; tiếng Việt kèm thuật ngữ Anh): phiếu
   tiếp nhận yêu cầu, checklist qualification, đề xuất giải pháp/báo giá (không giá cụ thể), hợp đồng khung (ghi rõ "mẫu tham khảo,
   cần luật sư rà soát"), SOW, biên bản họp kick-off, SRS, SDD, kế hoạch kiểm thử, test case, báo cáo kiểm thử, checklist bảo mật,
   runbook triển khai, release notes, biên bản nghiệm thu UAT, biên bản bàn giao, SLA bảo trì, retrospective, kế hoạch ngừng hệ thống.
   Tận dụng mẫu SEP490 có sẵn: `scripts/labflow-seed/docs/sep490/mau-trang/` (đọc trước). Mỗi mẫu: mục đích, ai điền, khi nào, khung đề mục.
5. **Mẫu dự án CT Work** `content/quy-trinh/client-project-template.json` — gói BE đọc file này: `{ version, roles:[{key,name}],
   stages:[{ slug, n, title, epic:{summary, description}, tasks:[{summary, role, checklist:[...], gate?:bool}] }] }` — mỗi giai đoạn
   một epic, 3–8 việc, mỗi việc gắn MỘT vai (key trong roles), checklist ≥ 3 mục, việc "Cổng chất lượng" cuối mỗi giai đoạn có
   `gate: true` với checklist = exit criteria. Đồng bộ đúng với data.ts.
Kiểm: `cd frontend && npx tsc --noEmit` sạch; `node -e` kiểm JSON hợp lệ + mọi slug trong JSON có trong data.ts; mọi href mẫu tài
liệu tồn tại trên đĩa; mọi link học trỏ slug có thật.

## Gói BE — tiếp nhận yêu cầu + tạo dự án CT Work (backend + trang admin)
1. Prisma model `ProjectRequest` (`@@map("project_requests")`): mã phiếu (vd `YC-2026-0001`), tên, email, SĐT (tuỳ chọn), tổ chức,
   vai trò người gửi, loại sản phẩm (web/app/tool/AI/khác — mảng), mô tả nhu cầu, mục tiêu kinh doanh, người dùng cuối, hệ thống
   hiện có, ngân sách dự kiến (khoảng, chuỗi), thời hạn mong muốn, mức bảo mật/dữ liệu nhạy cảm, file đính kèm (để sau — không làm),
   **đồng ý xử lý dữ liệu** (bool + thời điểm + phiên bản thông báo), nguồn, IP, user agent, trạng thái (`NEW → QUALIFYING →
   ACCEPTED/DECLINED → PROJECT_CREATED`), ghi chú nội bộ, `workProjectId` (nullable), `isRoleplay` (bool — phiếu tự tạo để nhập vai),
   thời điểm. Migration: **viết tay SQL** `prisma/migrations/<timestamp>_add_project_requests/migration.sql` rồi `npx prisma migrate
   deploy` trên CSDL local (CLAUDE.md giải thích vì sao không dùng `migrate dev`); `prisma format`, `prisma generate`, kiểm drift bằng
   `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`.
2. API: `POST /api/v1/project-requests` (công khai; validate zod; rate limit theo IP như các route công khai khác; honeypot; bắt
   buộc `consent=true`; trả mã phiếu) → thông báo admin bằng cơ chế thông báo/email admin có sẵn (tìm cách ContactSubmission hoặc
   support được báo). `GET/PATCH /api/v1/admin/project-requests[...]` (admin): danh sách lọc trạng thái, chi tiết, đổi trạng thái,
   ghi chú. `POST /api/v1/admin/project-requests/:id/create-work-project`: tạo dự án CT Work từ `content/quy-trinh/client-project-template.json`
   (đọc lúc chạy; nếu chưa có file thì dùng bản tối thiểu 3 giai đoạn để test) — dùng ĐÚNG service CT Work có sẵn (`projects.service`,
   `issues.service`, `templates.ts`; xem cách `scripts/labflow-seed/seed.mjs` tạo epic/việc/checklist/nhãn) : 1 epic/giai đoạn, việc
   con gắn nhãn vai `vai:<key>` (để nhập vai lọc theo vai), checklist, việc cổng chất lượng; thẻ đầu tiên = phiếu yêu cầu của khách
   (mô tả đầy đủ); bật link chia sẻ cho khách nếu share.service hỗ trợ; ghi `workProjectId`, trạng thái `PROJECT_CREATED`. Không tạo
   trùng nếu bấm hai lần (idempotent).
3. Frontend admin: trang `/admin/project-requests` (theo khuôn các trang admin có sẵn — tìm trang admin tương tự để bắt chước): bảng
   phiếu, lọc, xem chi tiết, đổi trạng thái, ghi chú, nút "Tạo dự án CT Work" (mở dự án vừa tạo), nút "Tạo phiếu nhập vai" (điền sẵn
   một khách hàng giả lập rõ nhãn NHẬP VAI để user tự luyện). API client trong `frontend/src/lib/api.ts`.
4. KHÔNG làm form công khai phía khách (gói UI làm) — nhưng viết sẵn hàm `projectRequestApi.submit()` trong api.ts + kiểu dữ liệu.
Kiểm: `npx tsc --noEmit` (gốc) + `npm run typecheck:seed` nếu đụng schema; `(cd frontend && npx tsc --noEmit)`; gọi thử API trên
backend local (đang chạy :3001 — nếu cần khởi động lại để nạp route mới thì báo người điều phối, đừng diệt tiến trình); test tạo dự án
CT Work thật trên CSDL local rồi đếm epic/việc.

## Gói UI — chờ user chọn phương án giao diện (A/B/C) rồi mới giao.

## Gói UI — user CHỌN PHƯƠNG ÁN A (01/10): "Studio doanh nghiệp" + vòng 3D của bản 1 làm phần đầu trang Quy trình
Phong cách: nền SÁNG trang trọng (navy/trắng, điểm nhấn một màu), chữ lớn, nhiều khoảng trắng, như trang dịch vụ của công ty tư vấn/
phần mềm lớn; theme tối vẫn phải đẹp (biến theme `var(--bg-*)`, `var(--text-*)`, `var(--border-color)`; theme tối = class `theme-dark`,
KHÔNG dùng `dark:` của Tailwind). framer-motion có sẵn, CSS 3D, không thêm thư viện. Responsive từ 360px, không tràn ngang, `min-w-0`,
`flex-wrap`. `useReducedMotion`. Không hook sau return sớm. Tiếng Việt mặc định + tiếng Anh theo `useTranslation` như /about.
Không đổi giao diện cũ của `/about` — chỉ chèn lối vào (banner đã có ở bản 1, cập nhật trỏ tới luồng mới).
**Luồng 3 trang (đúng thứ tự, có thanh bước 1→2→3 ở đầu mỗi trang + nút sang trang kế):**
1. `/about/studio` — **Giới thiệu**: studio/thương hiệu của Cường + bản thân + năng lực. CHỈ dữ liệu thật: số liệu đếm được bằng
   `useAboutStats()` và `codebaseStats.json` như `/about/page.tsx` (đọc luật đầu file đó), dự án thật (cuongthai.com, LabFlow AI, CT Work,
   app desktop, app iOS — mô tả từ chính repo/README, không phóng đại), năng lực kỹ thuật theo stack thật, cách làm việc (minh bạch,
   tài liệu, bàn giao). Không lời khen khách, không logo khách, không "N năm".
2. `/about/nhan-du-an` — **Nhận dự án**: dịch vụ (web, app, tool/tự động hoá, AI), loại sản phẩm, mô hình hợp tác (trọn gói theo phạm
   vi, theo mốc, thuê theo thời gian — KHÔNG ghi giá), những gì khách nhận được (tài liệu, mã nguồn, bàn giao, bảo trì), câu hỏi thường gặp,
   và **form "Gửi yêu cầu dự án"** dùng `projectRequestApi.submit()` (đọc kiểu trong `frontend/src/lib/api.ts` — đủ các trường backend
   nhận, ô bẫy bot `website` ẩn, chọn nhiều loại sản phẩm, mức bảo mật dữ liệu, ngân sách/thời hạn dạng khoảng chọn), **thông báo quyền
   riêng tư theo Nghị định 13/2023/NĐ-CP** (mục đích xử lý, loại dữ liệu, thời gian lưu, quyền của chủ thể dữ liệu: xem/sửa/xoá/rút đồng ý,
   cách liên hệ) + ô đồng ý bắt buộc; gửi xong hiện **mã phiếu** + các bước tiếp theo (đánh giá phù hợp → họp khám phá → đề xuất) +
   link xem quy trình. Xử lý lỗi 400/429 rõ ràng.
3. `/about/quy-trinh` — **Quy trình**: phần đầu = vòng 3D bản 1 (`ProcessRing`) đã SỬA lỗi thẻ hai bên chồng nhau (tăng bán kính/giảm cỡ
   thẻ/mờ thẻ xa — đo bằng hình), rồi **đường thời gian ngang chia 7 pha** (cuộn tới đâu giai đoạn hiện tới đó; mobile thành dọc), mỗi giai
   đoạn một thẻ → `/about/quy-trinh/[slug]`; khối "khung chuẩn tham chiếu"; lối sang trang tổ chức; CTA "Gửi yêu cầu dự án".
   `/about/quy-trinh/[slug]` — trang con kiểu TÀI LIỆU: cột mục lục dính bên trái (desktop), mục tiêu, đầu vào → đầu ra, bộ phận & vai trò,
   **bảng RACI**, entry/exit criteria (cổng chất lượng), hoạt động, checklist, **mẫu tài liệu tải về**, khách hàng tham gia gì, công cụ,
   chuẩn tham chiếu, sai lầm hay gặp, ví dụ LabFlow/cuongthai.com, link học; nút giai đoạn trước/sau; `generateStaticParams` + metadata
   riêng từng trang; bật lại `STAGE_PAGES_ENABLED`.
   `/about/quy-trinh/to-chuc` — **sơ đồ tổ chức & luồng liên kết bộ phận** (bộ phận nào chuyển gì cho ai — sơ đồ có mũi tên, bấm bộ phận xem
   chi tiết) + **RACI tổng** (bộ phận × giai đoạn, cuộn ngang trên mobile).
   Dữ liệu: `data.ts` + `departments.ts` (gói ND — đang soạn song song; kiểu đã khai sẵn trong data.ts. Nếu `departments.ts` chưa có khi
   bạn tới phần đó thì dựng trên kiểu dữ liệu và một mảng mẫu nhỏ, đánh dấu TODO — người điều phối sẽ nối). KHÔNG sửa nội dung data.ts.
Thêm vào sitemap (`frontend/src/app/sitemap.ts`) các route mới. Kiểm: `(cd frontend && npx tsc --noEmit)` sạch. Không build/dev/commit.
