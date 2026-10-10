# CT Work đợt 7c — Bảo mật & quản trị + công cụ test tự động (11/10/2026)

Nguồn mục: `docs/ctw-ra-soat-thieu-09-10.md` (C17, C25/CTW-21, C3, C13, B10) và `docs/ctw-ra-soat-swr-swt-hop-09-10.md` (TST-2: B10, T11; T3/T4/T10 CHƯA làm — xem cuối).
Migration: `20261011110000_ctw7c_security_assets_autotests` (chỉ thêm 5 bảng, không sửa bảng cũ).

## 1. Ép 2FA theo không gian (C17)

- Cài đặt không gian → **Security** (OWNER/ADMIN, chỉ qua phiên web): bật "Require two-factor authentication" + ân hạn 0–30 ngày.
  Người bật phải tự bật 2FA trước (409 `WORK_2FA_SELF_FIRST`). Mọi lần bật/tắt/đổi ân hạn/nhắc ⇒ audit `workspace.security.*`.
- Đạt = tài khoản đã bật 2FA **và** phiên có claim `mfaAt` còn hạn (`ADMIN_MFA_TTL_HOURS`, mặc định 12 giờ) — cùng luật step-up của admin site.
- Hết ân hạn mà chưa đạt ⇒ chặn MỌI đường vào không gian đó:
  - REST `/api/v1/work/**`: middleware `workTwoFactorGate` (AsyncLocalStorage) + hai cửa đọc quyền `loadProjectAccess` / `loadWorkspaceAccess`
    (`services/work/twoFactor.ts`). Người lạ vẫn 404. My work / tìm kiếm xuyên dự án loại không gian bị chặn.
  - Socket phòng dự án + kênh chat (`socket/work.socket.ts`).
  - Chưa bật ⇒ 403 `WORK_2FA_SETUP_REQUIRED` ⇒ giao diện đưa tới **`/work/security?next=…`** (trang 2FA cho thành viên, dùng API `/auth/mfa/*` sẵn có).
    Đã bật nhưng phiên chưa xác minh ⇒ 403 `MFA_REQUIRED` ⇒ hộp nhập mã toàn cục có sẵn tự mở rồi thử lại.
- `/auth/mfa/setup|enable` trước chỉ cho admin site; nay cho thêm **người là thành viên ít nhất một không gian CT Work** (agent không). Người ngoài vẫn 403.
- Băng nhắc vàng (ân hạn) / đỏ (bị chặn) ở đầu vùng nội dung CT Work; danh sách ai chưa bật + nút "Nhắc" (trần 1 lần/giờ).

### KHÔNG bị ảnh hưởng (có chủ ý — ghi cả ở trang Developer và Settings → Security)
- **Token API cá nhân `ctw_…` và token AI agent** — máy không nhập được mã; bảo vệ bằng phạm vi, hạn dùng, thu hồi.
  Để token không thành lối vòng: người đang bị chặn KHÔNG tạo được token / link lịch mới (cùng lỗi của cổng).
- Link lịch `.ics`, link chia sẻ công khai chỉ đọc, khảo sát/mockup công khai.
- Việc nền: luật tự động, cron, agent BUILTIN.
- Phiên đồng soạn thảo Docs đang mở: token collab chỉ cấp qua REST (đã qua cổng); kiểm lại định kỳ của collab không xét 2FA.

## 2. Sổ tài sản & giấy phép (C25 / CTW-21)

Trang `/work/<ws>/<KEY>/assets` (đội dự án + giảng viên; khách cổng 403; agent chỉ đọc). Trường: loại (phần mềm, license, tài khoản dịch vụ,
thiết bị, font, ảnh, âm thanh, video, 3D, thư viện, dataset), giấy phép (MIT/Apache/GPL/CC0/CC BY…/OFL/thương mại/subscription…), nguồn,
người phụ trách, hạn, nhắc trước N ngày, chi phí + kỳ, số chỗ, ghi công bắt buộc + dòng ghi công, liên kết thẻ/trang Docs.
Chặn dán bí mật (`WORK_ASSET_SECRET`). Nhắc hạn: cron 08:10 VN, mỗi hạn đúng một lần (`reminded_for`). Xuất `THIRD_PARTY_LICENSES.md|txt`,
`CREDITS.txt` (chỉ mục bắt buộc ghi công), CSV.

## 3. Kết quả test tự động (TST-2: B10, T11)

`POST /api/v1/work/projects/:pid/tests/automation/import` — token scope mới **`tests:write`** (chỉ mở đúng tuyến này) hoặc phiên web.
- Định dạng: JUnit XML (thân thô `Content-Type: application/xml` + `?format=junit&build=…`), Playwright JSON, Jest/Vitest JSON (thân JSON `{report, …}`).
- Độ phủ: lcov, JaCoCo XML, Cobertura XML, Istanbul `coverage-summary.json` (`coverage.report`).
- Khớp test theo `suite::tên` ⇒ test case Xray loại AUTOMATED (tự tạo, trần 1.000/lần) ⇒ cycle `CI · <build>` (gửi `cycle=` để nhiều job gộp một cycle) ⇒ run.
- Bug cho lỗi MỚI, chống trùng: bug cũ còn mở của test ⇒ gắn vào; cùng chữ ký lỗi (suite + dòng lỗi chuẩn hoá) ⇒ gắn vào; test flaky ⇒ không mở; trần 20 bug/lần.
- Flaky: lịch sử P/F/S/R (R = đạt sau chạy lại), đỏ/xanh xen kẽ ⇒ cờ flaky + điểm. Nút "Mark fixed" xoá lịch sử.
- Trang **Tests → Automation (CI)**: KPI, đoạn `ctwork-report` cho GitHub Actions + `curl`, tải báo cáo tay, lịch sử lần nhập, bảng test.

## 4. Automation thêm (C13)

Trigger: `issue.due_soon` (lịch hằng ngày, mỗi hạn một lần), `test.failed` (CI + chạy tay), `pr.merged` (GitHub/GitLab), `sla.breached`
(service desk, mỗi mốc một lần), `baseline.changed` (chụp / duyệt / từ chối). Tín hiệu đi qua `automationSignals.ts` (không qua socket).
Action: `post_chat` (kênh theo tên, mặc định #general), `webhook` (https công khai, ký HMAC, chung chốt SSRF với webhook agent; bí mật không trả về client;
payload có `text` + `content` ⇒ Slack/Discord incoming webhook dùng thẳng), `assign_round_robin`, `create_subtasks` (mẫu dod/bugfix/release/report/usecase
hoặc danh sách riêng; chạy lại không nhân đôi). Mẫu chữ `{{issue.key}} {{event.test}}…`. Thư viện "Cho đồ án sinh viên" (8 mẫu) trong Settings → Automation.

## 5. Widget (C3)

`test_pass_rate`, `defects_by_severity`, `license_expiring`, `my_timer` (đồng hồ đợt 7a + giờ đã ghi), `okr` (API OKR đợt 7a).

## Kiểm

- `npx tsx --test src/services/work/ctw7c.test.ts` (thuần) · `WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw7c.db.test.ts` (HTTP + DB) — cả hai trong `npm test`.
- Tệp mẫu: `src/services/work/__fixtures__/ctw7c/` (junit.xml có DOCTYPE thử XXE, playwright.json, jest.json, lcov.info, jacoco.xml).

## Chưa làm (để đợt sau)
- T3 nhập phân tích tĩnh SARIF/SonarQube, T4 white-box V(G) + checklist, T10 phiên bản test case trên run, B11 đã có ở đợt 6.
- Recheck 2FA trong phiên đồng soạn thảo đang mở (hiện chỉ kiểm lúc cấp token collab).
