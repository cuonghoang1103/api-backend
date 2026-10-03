/**
 * Nội dung trang /about/bao-mat — "Bảo mật & Tuân thủ" (trust center).
 *
 * ⛔ QUY TẮC CỦA FILE NÀY: mỗi khẳng định kỹ thuật phải kiểm được trong repo
 * (mã, workflow, script, CLAUDE.md). Không hứa thứ chưa có. Không ghi IP, cổng
 * SSH cụ thể, tên máy chủ, đường dẫn trên máy chủ, tên biến môi trường/secret,
 * chi tiết tường lửa — chỉ mô tả ở mức nguyên tắc.
 *
 * Nguồn kiểm (04/10/2026):
 *  - SSH chỉ khoá, tắt mật khẩu ............ CLAUDE.md mục "SSH đã siết 18/09/2026"
 *  - .env không vào git ...................... .gitignore, frontend/.gitignore
 *  - Proxy khoá bên thứ ba ................... src/routes/gifs.routes.ts (mẫu), CLAUDE.md "Third-party API keys must NOT be NEXT_PUBLIC_*"
 *  - TLS 1.2/1.3, HSTS, 80→443 ............... nginx/nginx.conf
 *  - Cloudflare phía trước ................... src/index.ts (trust proxy)
 *  - Rate limit chung/đăng nhập/tải lên ...... src/index.ts (express-rate-limit)
 *  - Helmet .................................. src/index.ts
 *  - bcrypt .................................. src/services/auth.service.ts
 *  - Phân quyền kiểm lại vai trò từ CSDL ..... src/middleware/auth.ts (requireRole/requireAdmin)
 *  - Sao lưu CSDL hằng ngày, giữ 30 ngày ..... scripts/backup-cron.sh, .github/workflows/backend-vps.yml (crontab)
 *  - Bản sao ngoài máy chủ (khi cấu hình) .... scripts/backup-cron.sh + scripts/backup-r2-upload.mjs
 *  - Thử khôi phục bản sao ................... scripts/restore-test.sh
 *  - Dọn đĩa hằng tuần ....................... .github/workflows/vps-cleanup-weekly.yml
 *  - Kiểm thử + smoke-test + nginx -t ........ deploy-nha.sh
 *  - Sentry lọc dữ liệu cá nhân .............. src/services/sentry.service.ts (sendDefaultPii: false, beforeSend)
 *  - Bên xử lý phụ ........................... src/services/email.service.ts (Resend), src/config/payos.ts,
 *                                              src/routes/payment.routes.ts (VNPay), src/services/llm/gateway.ts,
 *                                              src/services/ai.service.ts (Groq), src/config/env.ts (R2)
 *  - Việc AI chạy nền mặc định tắt ........... CLAUDE.md mục "BA chốt chặn chi phí"
 *  - AI cục bộ (llama.cpp) ................... desktop/src/main/aiCucBo/, .github/workflows/desktop-ai-ngoai-tuyen.yml
 *  - Pháp lý BVDLCN .......................... frontend/src/app/about/quy-trinh/data.ts (91/2025/QH15, NĐ 356/2025 thay NĐ 13/2023)
 */

export type Bi = readonly [string, string];

export const MAU = (f: string) => `/quy-trinh/mau/${f}`;
export const FILE_TRA_LOI = MAU('tra-loi-danh-gia-nha-cung-cap.md');

// ─── 1. Xử lý dữ liệu khách trong dự án ───────────────────────────────────
export const HANDLING: { title: Bi; body: Bi; link?: { href: string; label: Bi } }[] = [
  {
    title: ['Ký NDA và DPA trước khi nhận dữ liệu', 'NDA and DPA signed before any data changes hands'],
    body: [
      'Trước khi khách gửi tài liệu nội bộ hay dữ liệu thật, hai bên ký thoả thuận bảo mật (NDA). Nếu dự án có xử lý dữ liệu cá nhân, ký thêm thoả thuận xử lý dữ liệu (DPA) phân rõ vai trò: khách là Bên Kiểm soát, studio là Bên Xử lý.',
      'Before the client shares internal documents or real data, both sides sign a non-disclosure agreement. If the project touches personal data, a data processing agreement (DPA) is signed too, setting roles: the client is the Controller, the studio the Processor.',
    ],
    link: { href: MAU('nda.md'), label: ['Mẫu NDA', 'NDA template'] },
  },
  {
    title: ['Tối thiểu dữ liệu', 'Data minimisation'],
    body: [
      'Phát triển và kiểm thử bằng dữ liệu giả hoặc đã ẩn danh. Chỉ dùng dữ liệu thật khi thật sự cần (chuyển dữ liệu, điều tra lỗi chỉ tái hiện được trên dữ liệu thật) và chỉ phần cần thiết, có khách đồng ý bằng văn bản.',
      'Development and testing use synthetic or anonymised data. Real data is used only when genuinely needed (migration, a bug that only reproduces on real data), only the necessary subset, and with the client’s written consent.',
    ],
    link: { href: MAU('dpa.md'), label: ['Mẫu DPA', 'DPA template'] },
  },
  {
    title: ['Ai được truy cập', 'Who has access'],
    body: [
      'Studio có một kỹ sư chính. Mặc định chỉ người đó truy cập dữ liệu và hệ thống của dự án. Mọi người thứ hai (cộng tác viên) phải được khách chấp thuận trước, ký NDA riêng và chỉ nhận quyền đúng phần việc; quyền được thu hồi khi xong việc.',
      'The studio has one principal engineer. By default only that person accesses project data and systems. Any additional person (a contractor) needs prior client approval, signs their own NDA and gets access scoped to their task only; access is revoked when the task ends.',
    ],
  },
  {
    title: ['Trả và xoá dữ liệu khi kết thúc', 'Return and deletion at the end'],
    body: [
      'Khi hợp đồng kết thúc: bàn giao/trả lại dữ liệu theo định dạng thoả thuận, xoá bản sao phía studio (kể cả bản sao lưu), thu hồi khoá và tài khoản, rồi lập biên bản xoá dữ liệu cho khách ký. Phần nào luật buộc phải lưu giữ thì ghi rõ trong biên bản.',
      'At contract end: data is handed back in the agreed format, the studio’s copies are deleted (backups included), keys and accounts are revoked, and a data-deletion record is signed with the client. Anything the law requires to be retained is listed explicitly in that record.',
    ],
    link: { href: MAU('ke-hoach-ngung-he-thong.md'), label: ['Mẫu kế hoạch ngừng hệ thống & biên bản xoá', 'Decommissioning & deletion record template'] },
  },
];

export const LAWS: { name: Bi; note: Bi }[] = [
  {
    name: ['Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15', 'Law on Personal Data Protection No. 91/2025/QH15'],
    note: [
      'Hiệu lực 01/01/2026. Phân vai Bên Kiểm soát / Bên Xử lý; quyền của chủ thể dữ liệu, trong đó có quyền yêu cầu xoá.',
      'In force 1 Jan 2026. Controller / Processor roles; data-subject rights, including the right to deletion.',
    ],
  },
  {
    name: ['Nghị định 356/2025/NĐ-CP', 'Decree 356/2025/ND-CP'],
    note: [
      'Quy định chi tiết Luật BVDLCN, hiệu lực 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP. Yêu cầu xoá hợp lệ: phản hồi trong 2 ngày làm việc, hoàn tất trong 20 ngày.',
      'Implements the PDP Law, in force 1 Jan 2026, replacing Decree 13/2023/ND-CP. A valid deletion request: respond within 2 working days, complete within 20 days.',
    ],
  },
  {
    name: ['Luật An ninh mạng 2018 (24/2018/QH14) và văn bản hướng dẫn/thay thế hiện hành', 'Cybersecurity Law 2018 (24/2018/QH14) and current implementing or superseding instruments'],
    note: [
      'Áp dụng cho nghĩa vụ lưu trữ, cung cấp thông tin và bảo vệ hệ thống thông tin — phạm vi cụ thể phụ thuộc loại hệ thống của khách.',
      'Relevant to data-retention, information-provision and system-protection duties — the exact scope depends on the client’s type of system.',
    ],
  },
];

export const LEGAL_DISCLAIMER: Bi = [
  'Trang này mô tả cách studio làm việc, KHÔNG phải tư vấn pháp lý. Nghĩa vụ pháp lý cụ thể của từng dự án cần được luật sư của khách xác nhận.',
  'This page describes how the studio works. It is NOT legal advice. The specific legal obligations of each project should be confirmed by the client’s counsel.',
];

// ─── 2. Thực hành kỹ thuật đang áp dụng ───────────────────────────────────
export const PRACTICES: { group: Bi; items: { t: Bi; d: Bi }[] }[] = [
  {
    group: ['Truy cập & bí mật', 'Access & secrets'],
    items: [
      {
        t: ['SSH chỉ bằng khoá', 'Key-only SSH'],
        d: [
          'Đăng nhập mật khẩu và đăng nhập tương tác đã tắt trên máy chủ; quản trị chỉ vào bằng khoá. Thay đổi được nghiệm thu bằng cấu hình đang hiệu lực, không chỉ bằng file đã ghi.',
          'Password and keyboard-interactive login are disabled on the server; admin access is key-only. The change was verified against the effective configuration, not just the file written.',
        ],
      },
      {
        t: ['Bí mật không vào mã nguồn', 'No secrets in source control'],
        d: [
          'File môi trường bị loại khỏi git; bí mật lúc chạy nằm trên máy chủ, ngoài kho mã. Khoá API bên thứ ba không bao giờ đóng vào gói JavaScript của trình duyệt — trình duyệt gọi qua một route proxy có xác thực ở backend.',
          'Environment files are git-ignored; runtime secrets live on the server, outside the repository. Third-party API keys are never baked into the browser bundle — the browser goes through an authenticated backend proxy route.',
        ],
      },
      {
        t: ['Phân quyền kiểm ở máy chủ', 'Server-side authorisation'],
        d: [
          'Route quản trị đi qua middleware phân quyền theo vai trò; vai trò được đọc lại từ CSDL ở mỗi yêu cầu (không tin vai trò trong token cũ), có số phiên bản vai trò để vô hiệu phiên khi đổi quyền. Mật khẩu băm bằng bcrypt.',
          'Admin routes go through role-based middleware; the role is re-read from the database on each request (a stale token’s role is not trusted), with a role version to invalidate sessions when permissions change. Passwords are hashed with bcrypt.',
        ],
      },
    ],
  },
  {
    group: ['Mạng & đường truyền', 'Network & transport'],
    items: [
      {
        t: ['HTTPS bắt buộc', 'HTTPS enforced'],
        d: [
          'Lưu lượng đi qua Cloudflare rồi tới reverse proxy. HTTP chuyển hướng sang HTTPS; chỉ cho TLS 1.2 và 1.3; có HSTS. Backend dùng Helmet cho các header bảo mật.',
          'Traffic passes through Cloudflare, then a reverse proxy. HTTP redirects to HTTPS; only TLS 1.2 and 1.3 are allowed; HSTS is set. The backend uses Helmet for security headers.',
        ],
      },
      {
        t: ['Giới hạn tần suất', 'Rate limiting'],
        d: [
          'Giới hạn chung cho API, giới hạn chặt hơn cho đăng nhập và tải file. Khoá giới hạn lấy theo IP thật sau chuỗi proxy tin cậy, nên không lách được bằng header giả.',
          'A general API limit, tighter limits on sign-in and uploads. The limiter keys on the real client IP behind a trusted proxy chain, so spoofed forwarding headers do not bypass it.',
        ],
      },
    ],
  },
  {
    group: ['Dữ liệu & vận hành', 'Data & operations'],
    items: [
      {
        t: ['Sao lưu CSDL hằng ngày', 'Daily database backups'],
        d: [
          'Bản sao lưu nén chạy tự động mỗi đêm, giữ 30 ngày. Có mã gửi một bản sao sang kho lưu trữ riêng tư ngoài máy chủ bằng khoá riêng chỉ dành cho sao lưu (backend thường trực không giữ khoá này), và một script khôi phục thử vào CSDL tạm để chứng minh bản sao dùng được.',
          'A compressed backup runs automatically every night and is kept for 30 days. Code exists to ship an off-server copy to private object storage with separate backup-only credentials (the always-on backend does not hold them), plus a script that restores into a throwaway database to prove the backup is usable.',
        ],
      },
      {
        t: ['Dọn đĩa định kỳ', 'Scheduled disk cleanup'],
        d: [
          'Một job hằng tuần dọn ảnh và cache build cũ trên máy chủ — biện pháp sau một sự cố đầy đĩa từng ảnh hưởng tới CSDL.',
          'A weekly job prunes old images and build cache on the server — put in place after a disk-full incident once affected the database.',
        ],
      },
      {
        t: ['Theo dõi lỗi không mang dữ liệu cá nhân', 'Error tracking without personal data'],
        d: [
          'Mã có tích hợp Sentry (bật khi được cấu hình). Trước khi gửi, sự kiện bị lọc cookie, header xác thực và thân yêu cầu; không gửi thông tin định danh mặc định.',
          'The code integrates Sentry (active when configured). Before sending, events are stripped of cookies, auth headers and request bodies; default PII is not sent.',
        ],
      },
    ],
  },
  {
    group: ['Phát hành & sự cố', 'Release & incidents'],
    items: [
      {
        t: ['Triển khai có cổng kiểm', 'Gated deployments'],
        d: [
          'Đẩy code lên nhánh chính KHÔNG tự triển khai. Ảnh được dựng (kèm biên dịch, kiểm kiểu) ở môi trường build riêng và phải khởi động được trước khi đẩy đi; máy chủ chỉ kéo về và tráo. Sau khi tráo có smoke-test các route lõi; cấu hình proxy được kiểm cú pháp trước khi nạp và tự trả bản cũ nếu hỏng; bộ kiểm thử bắt buộc của CI phải xanh thì mã mới lên nhánh chính. Lùi phiên bản bằng revert hoặc ảnh trước đó — không bao giờ ghi đè lịch sử.',
          'Pushing to the main branch does NOT deploy. Images are built (compiled and type-checked) in a separate build environment and must boot before they are shipped; the server only pulls and swaps them. A smoke-test of core routes runs after the swap; proxy config is syntax-checked before reload and rolled back automatically if it fails; the required CI test suite must pass before code lands on the main branch. Rollback is by revert or the previous image — history is never force-overwritten.',
        ],
      },
      {
        t: ['Checklist bảo mật theo OWASP ASVS', 'OWASP ASVS security checklist'],
        d: [
          'Trước mỗi bản phát hành lớn của dự án khách: kiểm theo checklist rút gọn từ OWASP ASVS 5.0, OWASP Top 10, NIST SSDF — mỗi dòng phải có bằng chứng.',
          'Before each major release of a client project: a checklist condensed from OWASP ASVS 5.0, OWASP Top 10 and NIST SSDF — every line needs evidence.',
        ],
      },
      {
        t: ['Postmortem không đổ lỗi', 'Blameless postmortems'],
        d: [
          'Sự cố nghiêm trọng có báo cáo postmortem gửi khách: dòng thời gian, nguyên nhân gốc, việc sửa hệ thống. Bản thân repo của studio giữ một nhật ký sự cố đã gặp và bài học rút ra.',
          'Serious incidents get a postmortem shared with the client: timeline, root cause, systemic fixes. The studio’s own repository keeps a log of past incidents and lessons learned.',
        ],
      },
    ],
  },
];

export const PRACTICE_LINKS: { href: string; label: Bi }[] = [
  { href: MAU('checklist-bao-mat.md'), label: ['Checklist bảo mật trước phát hành', 'Pre-release security checklist'] },
  { href: MAU('bao-cao-su-co-postmortem.md'), label: ['Mẫu báo cáo sự cố (postmortem)', 'Postmortem template'] },
  { href: MAU('runbook-trien-khai.md'), label: ['Runbook triển khai', 'Deployment runbook'] },
];

// ─── 3. Bên xử lý phụ ─────────────────────────────────────────────────────
export const SUBPROCESSORS: { name: string; use: Bi; data: Bi }[] = [
  {
    name: 'VPS (máy chủ thuê) / Rented VPS',
    use: ['Chạy ứng dụng, CSDL PostgreSQL, bản sao lưu cục bộ', 'Runs the application, PostgreSQL database, local backups'],
    data: ['Toàn bộ dữ liệu ứng dụng', 'All application data'],
  },
  {
    name: 'Cloudflare',
    use: ['DNS, proxy/CDN phía trước site; R2 lưu file tải lên và bản sao lưu ngoài máy chủ', 'DNS, proxy/CDN in front of the site; R2 for uploaded files and off-server backups'],
    data: ['Lưu lượng HTTPS đi qua; file người dùng tải lên', 'HTTPS traffic in transit; user-uploaded files'],
  },
  {
    name: 'GitHub',
    use: ['Lưu mã nguồn, chạy CI và các job vận hành', 'Source code hosting, CI and operational jobs'],
    data: ['Mã nguồn; không chứa dữ liệu người dùng', 'Source code; no user data'],
  },
  {
    name: 'modelapi.vn',
    use: ['Cổng mô hình ngôn ngữ (LLM) chính cho các tính năng AI', 'Primary LLM gateway for AI features'],
    data: ['Nội dung người dùng gửi vào tính năng AI (câu hỏi, file đính kèm đã rút chữ)', 'Content users send to AI features (prompts, extracted text of attachments)'],
  },
  {
    name: 'rambo.ai.vn',
    use: ['Cổng LLM thứ hai, cho trợ lý lập trình và một số việc AI tương tác', 'Secondary LLM gateway, for the coding assistant and some interactive AI tasks'],
    data: ['Nội dung gửi vào các tính năng đó', 'Content sent to those features'],
  },
  {
    name: 'Groq',
    use: ['Một số tính năng giọng nói/AI phụ', 'Some voice / auxiliary AI features'],
    data: ['Âm thanh hoặc văn bản gửi vào tính năng đó', 'Audio or text sent to that feature'],
  },
  {
    name: 'Resend',
    use: ['Gửi email giao dịch (xác minh, đặt lại mật khẩu, thông báo)', 'Transactional email (verification, password reset, notices)'],
    data: ['Địa chỉ email, nội dung thư', 'Email address, message content'],
  },
  {
    name: 'PayOS · VNPay',
    use: ['Cổng thanh toán', 'Payment gateways'],
    data: ['Mã đơn, số tiền; studio không lưu số thẻ', 'Order ID, amount; the studio stores no card numbers'],
  },
  {
    name: 'Sentry',
    use: ['Theo dõi lỗi (khi được bật)', 'Error tracking (when enabled)'],
    data: ['Dấu vết lỗi đã lọc cookie, header xác thực, thân yêu cầu', 'Error traces stripped of cookies, auth headers and bodies'],
  },
];

export const SUBPROCESSOR_NOTE: Bi = [
  'Đây là các bên mà sản phẩm của chính studio (cuongthai.com) đang dùng. Với dự án của khách, danh sách bên xử lý phụ được chốt riêng trong hợp đồng/DPA — khách duyệt từng bên, và có thể yêu cầu chỉ dùng hạ tầng của khách.',
  'These are the providers the studio’s own product (cuongthai.com) uses. For a client project the sub-processor list is agreed separately in the contract/DPA — the client approves each one and may require the client’s own infrastructure only.',
];

// ─── 4. AI & dữ liệu ──────────────────────────────────────────────────────
export const AI_POINTS: { t: Bi; d: Bi }[] = [
  {
    t: ['Dữ liệu chỉ đi qua LLM khi tính năng cần', 'Data reaches an LLM only when a feature needs it'],
    d: [
      'Trong sản phẩm của khách, chỉ những tính năng AI được ghi trong đặc tả mới gửi dữ liệu tới mô hình, và chỉ phần dữ liệu tính năng đó cần. Dự án không có AI thì không có dữ liệu nào đi qua LLM.',
      'In a client product only the AI features written into the spec send data to a model, and only the data that feature needs. A project without AI sends nothing to an LLM.',
    ],
  },
  {
    t: ['Có công tắc tắt', 'There is an off switch'],
    d: [
      'Tính năng AI được thiết kế để tắt bằng cấu hình mà không cần sửa mã. Trên site của studio, mọi việc AI chạy nền mặc định TẮT, có trần token theo người và trần chi phí theo ngày.',
      'AI features are built to be switched off by configuration, without code changes. On the studio’s own site all background AI jobs are OFF by default, with per-user token caps and a daily spend cap.',
    ],
  },
  {
    t: ['Huấn luyện mô hình: phụ thuộc nhà cung cấp', 'Model training: depends on the provider'],
    d: [
      'Studio không dùng dữ liệu của khách để huấn luyện mô hình nào. Nhưng việc nhà cung cấp cổng LLM có giữ lại hay dùng dữ liệu hay không phụ thuộc chính sách của họ — studio không bảo đảm thay họ được. Vì vậy với dữ liệu nhạy cảm, nhà cung cấp LLM được chọn theo DPA, hoặc dùng tài khoản/hạ tầng AI của chính khách.',
      'The studio does not use client data to train any model. Whether an LLM gateway provider retains or uses data depends on that provider’s policy — the studio cannot guarantee it on their behalf. So for sensitive data, the LLM provider is chosen in the DPA, or the client’s own AI account/infrastructure is used.',
    ],
  },
  {
    t: ['Chạy AI cục bộ, ngoại tuyến', 'Local, offline AI'],
    d: [
      'Khi dữ liệu không được rời khỏi máy hay mạng nội bộ: có thể chạy mô hình mở trên máy của khách bằng llama.cpp. Studio đã làm điều này thật trong app desktop của mình (chế độ AI ngoại tuyến) — đổi lại là mô hình nhỏ hơn, chất lượng thấp hơn mô hình đám mây.',
      'When data must not leave the machine or internal network: open models can run on the client’s hardware with llama.cpp. The studio already ships this in its own desktop app (offline AI mode) — the trade-off is a smaller model with lower quality than cloud models.',
    ],
  },
];

// ─── 5. Thứ CHƯA có ───────────────────────────────────────────────────────
export const GAPS: { gap: Bi; offset: Bi }[] = [
  {
    gap: ['Chưa có chứng nhận ISO/IEC 27001 hay báo cáo SOC 2', 'No ISO/IEC 27001 certification or SOC 2 report'],
    offset: [
      'Chấp nhận khách hoặc bên thứ ba do khách chỉ định đánh giá/audit; trả lời bảng câu hỏi bảo mật của khách; mẫu tài liệu tham chiếu các kiểm soát của ISO 27001 Annex A.',
      'Accept audits by the client or a third party it appoints; answer the client’s own security questionnaire; templates reference ISO 27001 Annex A controls.',
    ],
  },
  {
    gap: ['Chưa có bảo hiểm trách nhiệm nghề nghiệp', 'No professional liability insurance'],
    offset: [
      'Giới hạn trách nhiệm, bảo hành và nghiệm thu ghi rõ trong hợp đồng; thanh toán theo mốc nghiệm thu để rủi ro của khách không dồn về cuối.',
      'Liability limits, warranty and acceptance are spelled out in the contract; payments follow acceptance milestones so the client’s risk is not back-loaded.',
    ],
  },
  {
    gap: ['Quy mô một kỹ sư chính', 'One principal engineer'],
    offset: [
      'Mã nguồn, tài liệu, runbook và quyền truy cập hạ tầng thuộc về khách và được bàn giao đầy đủ, để đội khác tiếp quản được — không phụ thuộc một người.',
      'Source code, documentation, runbooks and infrastructure access belong to the client and are handed over in full, so another team can take over — no single-person dependency.',
    ],
  },
  {
    gap: ['Chưa có MFA cho tài khoản quản trị trên site của studio', 'No MFA on admin accounts of the studio’s own site'],
    offset: [
      'Sản phẩm của khách có MFA cho quản trị khi yêu cầu (dòng 1.5 trong checklist bảo mật). Có thể làm việc hoàn toàn trên hạ tầng và tài khoản do khách quản lý (SSO, MFA của khách).',
      'Client products get admin MFA when required (item 1.5 in the security checklist). Work can happen entirely on infrastructure and accounts the client manages (the client’s SSO and MFA).',
    ],
  },
];

// ─── 6. Câu hỏi đánh giá nhà cung cấp ─────────────────────────────────────
export const FAQ: { q: Bi; a: Bi }[] = [
  {
    q: ['Dữ liệu của dự án được lưu ở đâu?', 'Where is project data stored?'],
    a: [
      'Theo thoả thuận trong DPA. Mặc định: trên hạ tầng do khách sở hữu (tài khoản cloud/VPS của khách). Nếu khách muốn studio vận hành, vị trí và nhà cung cấp được ghi rõ trong DPA trước khi triển khai.',
      'As agreed in the DPA. By default on infrastructure the client owns (the client’s cloud/VPS account). If the client wants the studio to operate it, location and provider are written into the DPA before deployment.',
    ],
  },
  {
    q: ['Dữ liệu có được mã hoá không?', 'Is data encrypted?'],
    a: [
      'Khi truyền: có — HTTPS bắt buộc, TLS 1.2/1.3, HSTS. Mật khẩu: băm bcrypt. Khi lưu: lưu trữ đối tượng của Cloudflare R2 mã hoá khi lưu theo công bố của Cloudflare; mã hoá đĩa/CSDL khi lưu phụ thuộc hạ tầng được chọn và được chốt theo yêu cầu của khách — studio không khẳng định thay.',
      'In transit: yes — HTTPS enforced, TLS 1.2/1.3, HSTS. Passwords: bcrypt-hashed. At rest: Cloudflare R2 object storage is encrypted at rest per Cloudflare; disk/database encryption at rest depends on the chosen infrastructure and is set per the client’s requirements — the studio does not claim it by default.',
    ],
  },
  {
    q: ['Ai có quyền truy cập dữ liệu và hệ thống?', 'Who can access data and systems?'],
    a: [
      'Kỹ sư chính của studio, và chỉ những người khách chấp thuận bằng văn bản. Truy cập máy chủ bằng khoá SSH, không mật khẩu. Quyền thu hồi khi kết thúc phần việc hoặc hợp đồng.',
      'The studio’s principal engineer, and only people the client approves in writing. Server access is by SSH key, no passwords. Access is revoked when the task or contract ends.',
    ],
  },
  {
    q: ['Có sao lưu không? Đã thử khôi phục chưa?', 'Are there backups? Have restores been tested?'],
    a: [
      'Trên sản phẩm của studio: CSDL sao lưu tự động mỗi đêm, giữ 30 ngày, có cơ chế gửi bản sao ra ngoài máy chủ và script khôi phục thử vào CSDL tạm. Với dự án khách: tần suất, thời gian giữ, RPO/RTO chốt trong hợp đồng.',
      'On the studio’s product: the database is backed up automatically every night, kept 30 days, with an off-server copy mechanism and a script that test-restores into a throwaway database. For client projects: frequency, retention and RPO/RTO are set in the contract.',
    ],
  },
  {
    q: ['Phản hồi sự cố bảo mật trong bao lâu?', 'How fast do you respond to a security incident?'],
    a: [
      'Theo SLA trong hợp đồng/bảo trì. Nếu sự cố liên quan dữ liệu cá nhân, studio (Bên Xử lý) báo ngay cho khách (Bên Kiểm soát) để khách thực hiện nghĩa vụ thông báo theo luật. Sau sự cố có báo cáo postmortem.',
      'Per the SLA in the contract/maintenance agreement. If personal data is involved, the studio (Processor) notifies the client (Controller) promptly so the client can meet its legal notification duty. A postmortem follows.',
    ],
  },
  {
    q: ['Ai sở hữu mã nguồn?', 'Who owns the source code?'],
    a: [
      'Khách, sau khi thanh toán theo hợp đồng. Mã nằm trong kho do khách sở hữu hoặc được chuyển giao kèm tài liệu, runbook và quyền truy cập hạ tầng.',
      'The client, once paid per the contract. Code lives in a repository the client owns or is transferred with documentation, runbooks and infrastructure access.',
    ],
  },
  {
    q: ['Khi kết thúc hợp đồng, dữ liệu xử lý thế nào?', 'What happens to data at contract end?'],
    a: [
      'Trả lại theo định dạng thoả thuận, xoá mọi bản sao phía studio kể cả bản sao lưu, thu hồi khoá, lập biên bản xoá dữ liệu có chữ ký.',
      'Returned in the agreed format, all studio-side copies deleted including backups, keys revoked, and a signed data-deletion record produced.',
    ],
  },
  {
    q: ['Có dùng bên xử lý phụ (sub-processor) không?', 'Do you use sub-processors?'],
    a: [
      'Có thể, tuỳ dự án (hosting, email, thanh toán, LLM). Danh sách chốt trong DPA, khách duyệt từng bên; thêm bên mới phải báo trước để khách có quyền phản đối.',
      'Possibly, depending on the project (hosting, email, payments, LLM). The list is fixed in the DPA and approved by the client; adding one requires prior notice so the client can object.',
    ],
  },
  {
    q: ['Dữ liệu có bị dùng để huấn luyện AI không?', 'Is data used to train AI?'],
    a: [
      'Studio không dùng. Việc lưu giữ/dùng dữ liệu của nhà cung cấp LLM phụ thuộc chính sách của họ, nên nhà cung cấp được chọn theo DPA; có lựa chọn chạy mô hình cục bộ để dữ liệu không rời hạ tầng của khách.',
      'Not by the studio. LLM-provider retention/use depends on that provider’s policy, so the provider is chosen in the DPA; there is a local-model option so data never leaves the client’s infrastructure.',
    ],
  },
  {
    q: ['Phát triển bảo mật thế nào?', 'How is security built into development?'],
    a: [
      'Biên dịch và kiểm kiểu khi dựng ảnh; bộ kiểm thử bắt buộc trước khi mã lên nhánh chính; triển khai không tự động theo push; smoke-test sau triển khai; checklist theo OWASP ASVS trước phát hành lớn; khoá bên thứ ba ở backend.',
      'Compile and type-check when building images; the required test suite before code lands on main; no deploy-on-push; post-deploy smoke-test; an OWASP ASVS checklist before major releases; third-party keys kept server-side.',
    ],
  },
  {
    q: ['Có chứng nhận ISO 27001 / SOC 2 không?', 'Do you hold ISO 27001 / SOC 2?'],
    a: [
      'Chưa. Studio chấp nhận audit của khách hoặc bên thứ ba khách chỉ định, và có thể làm việc trên hạ tầng của khách để kế thừa các kiểm soát đã được chứng nhận của khách.',
      'No. The studio accepts audits by the client or a third party it appoints, and can work on the client’s infrastructure to inherit the client’s certified controls.',
    ],
  },
  {
    q: ['Tuân thủ pháp luật dữ liệu Việt Nam?', 'Vietnamese data-law compliance?'],
    a: [
      'Quy trình bám Luật BVDLCN 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (vai trò Bên Kiểm soát/Bên Xử lý, quyền xoá, thời hạn phản hồi). Không phải tư vấn pháp lý — nghĩa vụ cụ thể do luật sư của khách xác nhận.',
      'The process follows PDP Law 91/2025/QH15 and Decree 356/2025/ND-CP (Controller/Processor roles, right to deletion, response deadlines). Not legal advice — specific obligations are confirmed by the client’s counsel.',
    ],
  },
  {
    q: ['Báo lỗ hổng bảo mật ở đâu?', 'Where do I report a vulnerability?'],
    a: [
      'Gửi email theo kênh trong /.well-known/security.txt (mục "Báo lỗ hổng" bên dưới). Xin đừng công khai trước khi studio kịp sửa.',
      'Email the channel in /.well-known/security.txt (see "Report a vulnerability" below). Please don’t disclose publicly before the studio has had time to fix it.',
    ],
  },
];

// ─── 7. Báo lỗ hổng ──────────────────────────────────────────────────────
export const DISCLOSURE: Bi[] = [
  [
    'Mô tả lỗ hổng, URL hoặc thành phần bị ảnh hưởng, các bước tái hiện, và tác động bạn đánh giá.',
    'Describe the vulnerability, the affected URL or component, steps to reproduce, and the impact you assess.',
  ],
  [
    'Chỉ thử trên tài khoản của chính bạn. Không truy cập, sửa hay xoá dữ liệu của người khác; không tấn công từ chối dịch vụ, không spam, không lừa đảo kỹ thuật xã hội.',
    'Test only against your own account. Do not access, modify or delete other people’s data; no denial-of-service, spam or social engineering.',
  ],
  [
    'Cho studio thời gian hợp lý để sửa trước khi công bố. Studio chưa có chương trình thưởng tiền (bug bounty), nhưng sẽ ghi nhận người báo nếu bạn muốn.',
    'Give the studio reasonable time to fix before disclosure. There is no paid bug bounty yet, but reporters are credited if they wish.',
  ],
];
