# Đề cương 4 chương MỚI — khoá GitHub Actions (bổ sung 09/2026)

Đọc `_HOP-DONG.md` trước. Chương mới không có bản cũ ⇒ chạy bộ kiểm với `--moi`. Mục tiêu: khoá cũ (Ch1–10) dạy rất sâu
qua lăng kính "đo trên chính repo này", nhưng còn thiếu mảng người đi làm CẦN để lên mức chuyên gia: tái sử dụng ở quy mô
tổ chức, runner riêng, hệ sinh thái chất lượng/bảo mật/phát hành, và một pipeline hoàn chỉnh tự tay dựng từ số 0.
Chương 11 trở thành "Ôn tổng giữa khoá"; thi cuối khoá nằm ở Ch15.

Mỗi chương: N.0 slide (DOCUMENT) · 4 bài `type: 'VIDEO'` (giống bài cũ; khối VI mỗi bài 12–16k ký tự chữ, EN tương
đương, cùng khung: eyebrow/h2/lead/h3…, 4–6 slide nhúng, `.pitfall co-tieu-de` ≥1, "Chạy thử từng bước", bảng khoá/tham
số, ≥1 callout "Câu hỏi phỏng vấn hay gặp", 🧪/🗂/📌, link-card nguồn chính thức GET 200) · N.5 quiz 10 câu.
File `export default { title, description, lessons }`, `isFreePreview: true`. Mọi log là run THẬT trên sân tập
`cuonghoang1103/ga-san-tap` (nhánh `chNN-…`, workflow `chNN-*.yml`) — dẫn link run trong bài.
Khoá liên quan để trỏ sang: `/courses/git`, `/courses/docker`, `/courses/deploy-vps`.

## Chương 12 — Tái sử dụng ở quy mô đội (`s12-tai-su-dung.mjs`, deck `ga-12`)
Title: `Chapter 12 — Reuse at team scale: reusable workflows, composite & custom actions|||Chương 12 — Tái sử dụng ở quy mô đội: workflow dùng lại, composite action & action tự viết`
(Nối tiếp 4.5 — đọc h3 của nó trước, KHÔNG lặp; 4.5 mới chạm "ba cách thôi chép".)
- 12.1 `ga-12-1-reusable-workflow` — `workflow_call` đầy đủ: `inputs`/`secrets`/`secrets: inherit`/`outputs`, gọi từ repo khác,
  ghim `@sha`, giới hạn lồng/số lượng (KIỂM docs), matrix gọi reusable, permissions đi xuống ra sao.
- 12.2 `ga-12-2-composite-action` — composite action có inputs/outputs, `shell` bắt buộc, `${{ github.action_path }}`, vì sao
  không có `if` ở mức step cũ (đã có? KIỂM), khi nào composite vs reusable (bảng).
- 12.3 `ga-12-3-action-js-docker` — viết action JavaScript (`@actions/core`, `@actions/github`, `ncc` đóng gói `dist/`) và
  Docker action; `runs.using: node24/node20` (KIỂM hiện hành); test action bằng workflow trong chính repo; phát hành
  bằng tag `v1` di động + release; Marketplace (điều kiện).
- 12.4 `ga-12-4-mau-cho-to-chuc` — workflow templates (`.github` repo của org), starter workflows, quản lý phiên bản action
  nội bộ bằng Dependabot `package-ecosystem: github-actions`, quy ước đặt tên/thư mục; bài học chi phí bảo trì.
- 12.5 `ga-12-5-kiem-tra`.

## Chương 13 — Runner của riêng bạn (`s13-runner.mjs`, deck `ga-13`)
Title: `Chapter 13 — Your own runners: self-hosted, containers & scaling|||Chương 13 — Runner của riêng bạn: self-hosted, container & mở rộng`
- 13.1 `ga-13-1-runner-hoat-dong` — runner làm việc thế nào (long-poll tới GitHub, nhận job, thư mục `_work`), GitHub-hosted
  vs self-hosted (bảng giá/tốc độ/bảo mật — KIỂM giá phút + larger runners 09/2026), nhãn `runs-on`, runner groups.
- 13.2 `ga-13-2-tu-dung-runner` — dựng một runner **ephemeral** (`--ephemeral`) TRONG container Docker trên Mac, đăng ký vào
  sân tập, chạy ĐÚNG MỘT job `workflow_dispatch` nhãn riêng, rồi gỡ runner ngay (`config.sh remove` / API) — ghi lại toàn bộ.
  ⛔ Không để runner sống lâu; không workflow `pull_request` nào được `runs-on` nhãn đó.
- 13.3 `ga-13-3-bao-mat-self-hosted` — vì sao KHÔNG dùng self-hosted cho repo public (PR từ fork chạy mã lạ trên máy bạn),
  cài đặt "require approval for fork PRs", môi trường bẩn giữa các job, secret còn trên đĩa, ephemeral + container job
  (`container:`), service containers (`services:` Postgres cho test — chạy thật trên GitHub-hosted).
- 13.4 `ga-13-4-mo-rong` — Actions Runner Controller (ARC) trên Kubernetes (khái niệm + sơ đồ, không cần chạy cụm), autoscaling,
  runner tự dựng trên VPS/máy nhà cho build nặng (đúng bối cảnh "máy nhà build" của người học), khi nào đáng.
- 13.5 `ga-13-5-kiem-tra`.

## Chương 14 — Chất lượng, bảo mật & phát hành (`s14-chat-luong-phat-hanh.mjs`, deck `ga-14`)
Title: `Chapter 14 — Quality gates, supply-chain security & releases|||Chương 14 — Cổng chất lượng, bảo mật chuỗi cung ứng & phát hành`
- 14.1 `ga-14-1-cong-chat-luong` — required status checks + branch protection/rulesets (bật thật trên sân tập), merge queue
  (khái niệm, KIỂM điều kiện gói), PR checks nhanh vs checks đêm, `paths`/`paths-ignore` và bẫy check bắt buộc bị "skip".
- 14.2 `ga-14-2-bao-mat-chuoi-cung-ung` — `pull_request_target` + script injection qua `${{ github.event.* }}` (dựng lại an toàn
  trên sân tập với dữ liệu giả), Dependabot (version + security updates), CodeQL code scanning, secret scanning/push
  protection, zizmor/actionlint làm kiểm tĩnh workflow, ghim SHA + vụ tj-actions/changed-files 03/2025 (KIỂM advisory).
- 14.3 `ga-14-3-phat-hanh` — tag + GitHub Release tự động (`gh release create`, release notes tự sinh), Conventional Commits +
  release-please hoặc semantic-release (chọn một, chạy thật), publish gói npm lên GitHub Packages / ảnh lên GHCR bằng
  `GITHUB_TOKEN` (chạy thật với ảnh nhỏ), artifact attestations / provenance (`actions/attest-build-provenance`, `gh attestation verify`).
- 14.4 `ga-14-4-monorepo` — CI cho monorepo (đúng cấu trúc api-backend: backend + frontend + desktop): `paths` filter theo thư mục,
  `dorny/paths-filter` vs tự làm bằng `git diff`, job "affected", matrix động từ JSON (`fromJSON`), gom kết quả thành một check bắt buộc.
- 14.5 `ga-14-5-kiem-tra`.

## Chương 15 — Dự án cuối khoá (`s15-du-an-cuoi-khoa.mjs`, deck `ga-15`)
Title: `Chapter 15 — Capstone: a complete CI/CD pipeline from zero|||Chương 15 — Dự án cuối khoá: một pipeline CI/CD hoàn chỉnh từ số 0`
Bối cảnh: app "Đặt lịch phòng khám" (Node/Express + Postgres, frontend tĩnh nhỏ) — dựng mã tối giản trong nhánh `ch15-capstone`
của sân tập; mọi run là run thật.
- 15.1 `ga-15-1-ci-cho-pr` — workflow PR: lint + typecheck + test với Postgres service container, cache npm, matrix Node 22/24,
  concurrency hủy run cũ của cùng PR, một check tổng hợp bắt buộc; đo thời gian trước/sau cache.
- 15.2 `ga-15-2-build-anh` — build ảnh Docker multi-stage đa nền tảng bằng buildx + cache `type=gha`, tag theo SHA + semver, đẩy
  GHCR, attestation; trỏ `/courses/docker`.
- 15.3 `ga-15-3-deploy-an-toan` — environment `production` có người duyệt + secrets theo environment, deploy qua SSH (MÔ PHỎNG:
  target là một container SSH trong chính job — không SSH ra máy thật), `concurrency` chặn hai deploy đua nhau (sự cố 06/07 của
  repo người học), smoke test, tự quay lui về tag trước; so sánh với cách repo thật đang làm (deploy bằng script chạy tay).
- 15.4 `ga-15-4-van-hanh-pipeline` — giữ pipeline khoẻ: CI đỏ đọc từ đâu, flaky test, chi phí phút, dọn artifact/cache, badge,
  thông báo, checklist "pipeline sẵn sàng production" + 10 câu phỏng vấn CI/CD hay gặp kèm ý trả lời.
- 15.5 `ga-15-5-thi-cuoi-khoa` — **Bài thi cuối khoá 20 câu** trải Mục 0 → Ch15 (tình huống), đáp án 5/5/5/5, explanation mỗi câu,
  `timeLimitSeconds: 1800`; content = lời dặn + checklist năng lực cả khoá (bộ kiểm tự đòi 20 câu cho slug có `cuoi-khoa`).
