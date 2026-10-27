# CT Work — GitHub App "CT Work by CuongThai" (27/10/2026)

Đường CHÍNH để một dự án CT Work nối GitHub. PAT chỉ đọc + webhook dán tay (Cài đặt dự án → GitHub, phần dưới) giữ làm
dự phòng; GitLab giữ nguyên. Mã: `src/services/work/githubApp.service.ts` (+ thuần `githubAppRules.ts`), tuyến
`src/routes/work.githubApp.routes.ts`, giao diện `frontend/src/components/admin/GithubAppAdmin.tsx`,
`frontend/src/components/work/settings/GithubAppCard.tsx`, `frontend/src/app/work/github-app/done/page.tsx`.

## 1. Chủ site tạo app — MỘT LẦN

1. Đăng nhập tài khoản ADMIN site ⇒ **/admin/ctwork-github** (menu Admin → GitHub App CT Work).
2. (Tuỳ chọn) gõ tên tổ chức GitHub để app thuộc tổ chức; để trống ⇒ thuộc tài khoản cá nhân của người bấm.
3. Bấm **Tạo GitHub App CT Work** ⇒ trình duyệt POST manifest sang GitHub ⇒ bấm **Create GitHub App** ⇒ GitHub chuyển về
   `/api/v1/work/github-app/manifest/callback?code&state` ⇒ backend kiểm state (HMAC, 30 phút, người bấm phải còn là ADMIN
   site) ⇒ `POST /app-manifests/{code}/conversions` ⇒ lưu app id, slug, client id/secret, webhook secret, private key
   **mã hoá** (`sealToken`, AAD `github-app`) vào `app_settings.ctw.github_app`. Không trả về client, không ghi log.
4. Trùng tên app trên GitHub ⇒ GitHub báo ngay ở trang xác nhận; đổi tên ở đó (manifest chỉ là gợi ý).

Manifest (`appManifest`): public, webhook `https://cuongthai.com/api/v1/work/github/webhook/app`, callback/setup
`/api/v1/work/github-app/setup`, `request_oauth_on_install: true` (để xác minh người cài).
Quyền: Contents **read** · Metadata **read** · Pull requests **write** (đăng review dạng bình luận) · Checks **read** ·
Commit statuses **read**. Sự kiện: push, create, delete, pull_request, pull_request_review, pull_request_review_comment,
check_run, check_suite (installation / installation_repositories luôn tới).

**Env thắng CSDL** khi đặt đủ `GITHUB_APP_ID`, `GITHUB_APP_SLUG`, `GITHUB_APP_PRIVATE_KEY` (PEM, dán một dòng với `\n`
cũng được), `GITHUB_APP_WEBHOOK_SECRET` (+ `GITHUB_APP_CLIENT_ID` / `GITHUB_APP_CLIENT_SECRET` cho bước xác minh người cài).
Không đặt gì ⇒ dùng app tạo bằng nút. Không có app ⇒ thẻ App ở Cài đặt dự án báo "chưa tạo", PAT/webhook vẫn chạy.

## 2. Nhóm cài theo dự án

1. ADMIN dự án ⇒ Cài đặt dự án → GitHub ⇒ **Cài GitHub App** (link `github.com/apps/<slug>/installations/new?state=…`,
   state ký HMAC: dự án + người + hạn 30 phút).
2. Chọn tài khoản/tổ chức + repo trên GitHub ⇒ GitHub hỏi quyền đăng nhập (OAuth khi cài) ⇒ về `/github-app/setup`.
3. Backend: kiểm state, người bấm còn là ADMIN dự án, đổi `code` lấy user token ⇒ `GET /user/installations` phải có đúng
   `installation_id` (chặn người dán installation id của người khác) ⇒ **bỏ user token** ⇒ vé chọn repo (HMAC 30 phút) ⇒
   trang `/work/github-app/done` liệt kê repo của bản cài ⇒ chọn ⇒ `POST /projects/:pid/github-app/link` lưu
   `app_installation_id`, `app_repo_id`, `repo_full_name` vào `work_github_connections`.
4. Gỡ: nút **Ngắt app** (giữ PAT/webhook nếu có). Gỡ cài / tạm dừng trên GitHub ⇒ webhook `installation deleted|suspend`
   ⇒ dự án mất liên kết / đánh dấu treo ⇒ đọc mã lùi về PAT ⇒ ẩn danh. Bỏ repo khỏi bản cài ⇒ `installation_repositories`.

## 3. Token + webhook

- JWT RS256 (iss = App ID, ≤ 10 phút) ⇒ `POST /app/installations/{id}/access_tokens` giới hạn `repository_ids = [repo]`
  ⇒ đệm tới 5 phút trước hết hạn. `code.service target()` ưu tiên token app ⇒ PAT chỉ đọc ⇒ ẩn danh.
- Webhook chung `POST /api/v1/work/github/webhook/app`: kiểm `X-Hub-Signature-256` bằng webhook secret của app ⇒ định
  tuyến theo `repository.id` (+ installation id) ⇒ mọi dự án nối repo đó ⇒ `processGithubEvent` (chung với webhook dán tay):
  dòng thời gian Git, panel Development, tự chuyển trạng thái theo PR, thông báo. Thêm: `check_suite`/`check_run` ⇒
  `work_git_pulls.ci_state/ci_url/head_sha`; `pull_request_review(_comment)` ⇒ người review của PR.
- CuongMini review code thấy "CI checks: FAILURE" trong ngữ cảnh PR.

## 4. Đăng review lên PR

Review AI (`POST /projects/:pid/code/review`, mặc định `postToGithub: true`) trên dự án dùng app ⇒
`POST /repos/{o}/{r}/pulls/{n}/reviews` với **event COMMENT** (không bao giờ APPROVE / REQUEST_CHANGES, không merge),
`commit_id` = head sha, bình luận inline CHỈ trên dòng nằm trong hunk của diff (≤ 30; còn lại vào thân review). Link review
GitHub được ghi vào bình luận CT Work.

## 5. Xử lý sự cố

| Triệu chứng | Kiểm |
|---|---|
| Thẻ App báo "chưa tạo" | /admin/ctwork-github; env `GITHUB_APP_*` đặt thiếu (cần đủ 4 biến) thì không dùng env |
| Sau khi cài về trang lỗi `error=oauth` | app thiếu client id/secret (tạo lại bằng nút, hoặc đặt `GITHUB_APP_CLIENT_ID/SECRET`) |
| `error=not_yours` | tài khoản đang đăng nhập GitHub không thấy bản cài đó — đăng nhập đúng tài khoản rồi cài lại |
| `error=state` | link cài quá 30 phút / bấm từ tab cũ — bấm lại "Cài GitHub App" |
| Webhook 401 | webhook secret của app lệch (tạo lại app hoặc sửa env); xem Recent Deliveries của app trên GitHub |
| Không đăng được review lên PR | app thiếu quyền Pull requests: write (sửa quyền app ⇒ nhóm chấp nhận quyền mới) |

Test: `npx tsx --test src/services/work/githubApp.test.ts` · `WORK_DB_TEST=1 npx tsx --test src/routes/work.githubApp.db.test.ts`.
