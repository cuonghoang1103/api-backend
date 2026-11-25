# Kế hoạch soạn khoá `nestjs` — NestJS: backend Node.js có cấu trúc

Khung dựng 24/11/2026 (agent `nst`, máy nhà): `content/courses/nestjs.mjs` (prefix bài `nst-`, 13 phần = Mục 0 + 12 chương, 94 bài).
Ảnh bìa `course-covers/nestjs.png` — **chưa có** (điều phối làm bìa khi deploy). Category `backend`, level `INTERMEDIATE`.
Nguồn yêu cầu: bảng soát khoảng trống P1 20/11 ("NestJS ~10 ch"). shortDescription gộp EN|||VI = 415 ký tự (≤ 500).

**Người học:** SV SE FPT kỳ 6 (Node.js chính + Spring Boot), mục tiêu OJT FPT Software SU27, học một mình bằng chính bài này.
**Trục khoá:** CHỈ phần RIÊNG của Nest; nền (JS/Express/REST/Prisma/JWT/test) liên kết chéo đúng bài.
**Quy trình soạn:** như `debug-co-phuong-phap` (khung + `_chung.mjs` ghep + `sNN-*.mjs` + mỗi bài một tệp trong `sNN/`), song ngữ
`ml-en`/`ml-vi`, 🧪 thực hành có `<details>` che đáp án, 🗂 thuật ngữ, 📌 tóm tắt, thẻ liên kết chéo + thẻ nguồn. Mỗi chương: lab chạy thật,
bài tập, 3–5 câu phỏng vấn, góc hacker bằng sự cố THẬT có nguồn, liên hệ đời thường, tình huống đi làm, mốc dự án `nst-N-M-moc-du-an`.

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (lời giao) | Bài |
|---|---|
| Mở đầu đủ 6 ý | `nst-0-8-bat-dau-tai-day` (1 lịch sử · 2 so Express/Fastify/Hono/Spring · 3 nền · 4 học xong · 5 công ty có nguồn · 6 học kèm) |
| Sự cố thật + cách học | `nst-0-9-bat-dau-khi-khong-co` (GitHub 2012 mass assignment, CVE-2025-54782) |
| Module/DI container, so Spring IoC | `nst-1-1` (metadata), `nst-2-1` … `nst-2-6-so-spring` |
| Controller/provider | `nst-1-3-controller`, `nst-2-2-provider` |
| Pipe/guard/interceptor/filter | `nst-3-1` … `nst-3-6-thu-tu`, `nst-1-4-vong-doi` |
| Validation (class-validator) | `nst-4-1-dto-validation`, `nst-4-2-whitelist-transform`, `nst-4-3-mapped-types-serialization` |
| Config | `nst-5-1-config`, `nst-5-2-bi-mat` |
| Prisma/TypeORM | `nst-6-1-prisma`, `nst-6-2-transaction`, `nst-6-3-typeorm`, `nst-6-4`, `nst-6-5-chong-dat-trung` |
| Auth JWT + RBAC | `nst-7-1-jwt-guard` … `nst-7-5-throttler-helmet` |
| Testing (Jest + e2e) | `nst-8-1` … `nst-8-4-jest-du-an-cu` (Jest trên Nest 11 CJS) |
| OpenAPI | `nst-4-4-openapi` |
| Microservices/queue (BullMQ) | `nst-9-1-bullmq`, `nst-9-2-schedule`, `nst-9-3-events`, `nst-10-3-microservice`, `nst-10-4-khi-nao-tach` |
| WebSocket gateway | `nst-10-1-gateway`, `nst-10-2-ws-auth-scale` |
| Docker + CI | `nst-11-1-docker`, `nst-11-2-health`, `nst-11-3-ci`, `nst-11-4-hieu-nang-bao-mat` |
| Dự án cuối: API đặt lịch phòng lab | `nst-0-2-du-an` (đề + rubric), `nst-12-1` … `nst-12-6-bao-ve` |
| Câu phỏng vấn | mỗi chương 3–5 câu + `nst-12-7-phong-van` |

## 2. Liên kết chéo (gọi sang, KHÔNG dạy lại)

| Ở bài | Dẫn sang | Lý do |
|---|---|---|
| Mục 0, `nst-1-x` | `nodejs` 0.x, 5.1 (Express), 18.2 | Nền Express, tổ chức mã |
| `nst-1-1` | `typescript-14-4-decorators` | Cú pháp decorator |
| Mục 0, `nst-2-6` | `spring-boot` (sb-0-8, chương IoC) | So sánh IoC |
| Mục 0 | Academy SDN302 `sdn302-8-1-nestjs-hono` | Môn trường giới thiệu Nest 1 buổi (CLO2) |
| `nst-4-x` | `typescript` ch13 (Zod), `api-design` ch2 | Kiểm dữ liệu, định dạng lỗi |
| `nst-6-x` | `prisma-orm` (cả khoá), `api-design` ch3 | Prisma sâu, phân trang |
| `nst-7-x` | `authentication` ch2, ch4, ch5, ch9 | Mật khẩu, JWT, refresh, mô hình quyền |
| `nst-8-x` | `testing` ch1–5 | Tư duy test |
| `nst-9-1` | `nodejs` ch13 (BullMQ bên trong) | Hàng đợi |
| `nst-10-1` | `nodejs` ch11 (WebSocket nền) | Realtime |
| `nst-10-4` | `nodejs` 18.4, `system-design` | Khi nào tách dịch vụ |
| `nst-11-x` | `docker`, `github-actions`, `log-tu-a-den-z` | Đóng gói, CI, log |
| `nst-12-x` | `debug-co-phuong-phap` ch12 (cùng miền đặt lịch phòng lab) | Học xong sang săn lỗi |

Khi khoá này có bài thật: thêm dòng "→ NestJS" ở SDN302 8.1 (Academy — kiểm "FILE SINH TỰ ĐỘNG" trước), nodejs 18.6, spring-boot IoC.

## 3. Nguồn chính thống (đã GET 24/11/2026)

docs.nestjs.com (Introduction/Philosophy, First steps) • github.com/nestjs/nest releases v12.0.0 (27/08/2026) • GitHub API nestjs/nest
(tạo 2017-02-04, 77.131 sao, MIT) • npm registry @nestjs/core (thời điểm phát hành từng bản) + npm downloads 16–22/11/2026 •
nestjs.com dải logo "Trusted by…" (IBM, Adidas, Sanofi, Mercedes, BMW, Capgemini, GitLab, Decathlon, Roche, Société Générale) •
GitHub Blog 04/03/2012 (mass-assignment) • GHSA-85cg-cmq5-qjm7 / CVE-2025-54782 • OWASP API Security Top 10 2023 (API3) •
Jest docs ECMAScript Modules (require(esm) cần Node 24.9+). Chương 10 (đã kiểm 24/11): docs Nest Gateways/Exception filters (WS)/Adapters/Microservices basics/Hybrid application/Execution context; Socket.IO server options (allowRequest, cors); Snyk Security Labs 27/02/2023 Gitpod CSWSH (CVE-2023-0957; báo 13/02, vá SaaS 14/02/2023); Twilio Segment "Goodbye Microservices" 10/07/2018 (>140 dịch vụ ⇒ 1); Shopify Engineering "Deconstructing the Monolith" 21/02/2019. Bài Prime Video 2023 KHÔNG mở được (chuyển hướng) ⇒ không dùng. Chương 9 (đã kiểm 24/11): docs Nest Queues/Task scheduling/Events/Conditional module; BullMQ Job Schedulers, Stalled, Retrying; HBO Max 17/06/2021 (BleepingComputer 18/06/2021); Azure 29/02/2012 (blog Azure, khôi phục phần lớn 05:23 PST). Chương 8 (đã kiểm 24/11): CrowdStrike Channel File 291 RCA 06/08/2024 + PIR sơ bộ 24/07/2024 + TechTarget; docs Nest Testing (overriding globally registered enhancers); Vitest projects/parallelism/fake timers; Jest ESM + CLI. Chương 7 (đã kiểm 24/11): First American 2019 (Krebs 24/05/2019 + 18/06/2021), CVE-2015-9235 + Auth0 31/03/2015, Okta 10/2023 (RCA Okta + Cloudflare), Cash App 12/2021 (TechCrunch 05/04/2022), 23andMe 2023 (Axios 04/12/2023), OWASP API1:2023. Chương 11 (đã kiểm 24/11): NVD CVE-2019-5736; GHSA-mrrh-fwg8-r2c3 (tj-actions, CVE-2025-30066); GHSA-7589-6fvf-x4pw (effect, 19/11/2026);
GHSA-85cg-cmq5-qjm7; docs terminus / lifecycle events; nginx upstream resolve, proxy_next_upstream; HAProxy httpchk. Steam 25/12/2015 (Wayback 429) — KHÔNG dùng.

## 4. Môi trường lab & quyết định phiên bản (đo thật 24/11)

- **Dự án chính: Nest 12 ESM + Vitest** trên Node 22 (mặc định của Nest 12; chạy xanh). Import tương đối phải có `.js`.
- **Jest:** Nest 12 CJS + Jest 30 trên Node 22 HỎNG ("Must use import to load ES Module … Use Node v24.9+"); transformIgnorePatterns
  không cứu. ⇒ Chương 8 bài `nst-8-4-jest-du-an-cu` dạy Jest trên dự án **Nest 11 CommonJS** (dạng công ty đang chạy) — chưa thử, phải chạy thật.
- **npm 10.9.7 (đi kèm Node 22) cài dự án ESM mới hỏng** (`edgesOut`, arborist) ⇒ dùng `npx -y npm@11 install` / dạy `npm i -g npm@11`.
- **Bẫy ValidationPipe (phát hiện lúc soạn 0.9):** có tuỳ chọn validator mà không transform ⇒ `classToPlain(entity)` ⇒ trường DTO không gửi
  = `undefined` (target ES2023 khai báo field) ⇒ `Object.assign` xoá dữ liệu. Sửa `transformOptions.exposeUnsetFields: false`. Dạy kỹ ở 4.2.
- Chạy ví dụ: `scratchpad/nst/chay.sh <thư mục> '<lệnh>'` = container `nst-run-*` ảnh `nst-node:22` (node:22-alpine + curl/bash/jq),
  `--network none`, cổng 3000 nội bộ (cổng máy nhà 41501… đã có dịch vụ khác). Dự án: `scratchpad/nst/lab/{nst-esm,nst-dau(cjs),m0,m09}`.
- `node_modules` cài trên Fedora (glibc) KHÔNG chạy Vitest trong alpine (rolldown "Cannot find native binding") ⇒ test chạy trên máy nhà;
  để dành làm ví dụ thật cho `nst-11-1-docker` (cài trong image).
- SWC: đã cài `@swc/cli` 0.8.2 + `@swc/core` 1.16.22 vào `nst-esm` — chỉ có binding glibc ⇒ `-b swc` chạy trên máy nhà, không trong alpine.
  npm 11 cảnh báo `install-scripts` (chặn postinstall mặc định) — swc vẫn chạy được.
- Ch1 đo thật: tsc build ~1,7 s, swc ~0,9 s (biên dịch 70 ms); swc exit 0 với lỗi kiểu, `--type-check` exit 1. path-to-regexp 0.1.7/0.1.10
  ~88 ms với URL 16 KB route `/:a-:b`, 0.1.12 và 8.4.2 ~0 ms (CVE-2024-45296 + CVE-2024-52798, đã kiểm GHSA + npm registry).
- PostgreSQL: `postgres:16` (16.16) container `nst-pg` — tạo khi cần, xoá khi xong. Redis `redis:7-alpine` (7.4) container `nst-redis` 127.0.0.1:41901 (ch9–10).
- Ch11 đã cài vào lab nst-esm: @nestjs/terminus 12.2.0, @nestjs/cache-manager 12.0.5, cache-manager 7.2.9, @keyv/redis 5.1.6 (6.x lệch keyv), autocannon 9.0.0. Ảnh: nginx:1.29-alpine, haproxy:3.2-alpine, lab-booking:local (giữ lại).
- Ch10 đã cài vào lab nst-esm: @nestjs/websockets, platform-socket.io, platform-ws, microservices 12.6.0; socket.io(-client) 4.8.4, ws 8.23.0, @socket.io/redis-adapter 8.3.0.

## 5. Tiến độ

| Ngày | Phần | Trạng thái |
|---|---|---|
| 24/11 | Khung 13 phần / 94 bài | xong |
| 24/11 | Mục 0 pha A (0.8, 0.9, 0.1, 0.2) | xong — WEB-SAN-SANG |
| — | Mục 0 pha B (video nst-0-*) | chưa |
| 24/11 | Chương 1 pha A (1.1–1.7) | xong — WEB-SAN-SANG (phiên 2) |
| — | Chương 1 pha B (video nst-1-*) | chưa |
| 24/11 | Chương 2 pha A (2.1–2.9) | xong — WEB-SAN-SANG (phiên 3) |
| 24/11 | Chương 3 pha A (3.1–3.9) | xong — WEB-SAN-SANG (phiên 4) |
| 24/11 | Chương 4 pha A (4.1–4.7) | xong — WEB-SAN-SANG (phiên 5) |
| 24/11 | Chương 5 pha A (5.1–5.7) | xong — WEB-SAN-SANG (phiên 6) |
| 24/11 | Chương 6 pha A (6.1–6.8) | xong — WEB-SAN-SANG (phiên 7) |
| 24/11 | Chương 7 pha A (7.1–7.8) | xong — WEB-SAN-SANG (phiên 8) |
| 24/11 | Chương 8 pha A (8.1–8.7) | xong — WEB-SAN-SANG (phiên 9) |
| 24/11 | Chương 9 pha A (9.1–9.6) | xong — WEB-SAN-SANG (phiên 10) |
| 24/11 | Chương 10 pha A (10.1–10.7) | xong — WEB-SAN-SANG (phiên 11) |
| 24/11 | Chương 11 pha A (11.1–11.7) | xong — WEB-SAN-SANG (phiên 12) |
| — | Pha B mọi chương | chưa |
| 24/11 | Chương 12 pha A (12.1–12.8) | xong — WEB-SAN-SANG (phiên 13) — PHA A CẢ KHOÁ XONG (94/94) |

**Bàn giao phiên sau (cập nhật phiên 13, 24/11 ~12:30):** PHA A XONG CẢ KHOÁ — Mục 0 + Chương 1–12, 94/94 bài. Việc kế duy nhất: pha B
(video) — tạo `tsconfig.nst.json` + `src/khung/nst/` kế thừa tst, làm nst-0-8 trước (ánh xạ tập ↔ bài: `~/vbg-dp/KE-HOACH-NESTJS.md`).
Lab Ch12 ở `scratchpad/nst/lab/c12` (máy nhà): moc11-goc/ = bản mốc 11 nguyên (để đo "trước"); moc12/ = lab-booking mốc 12 (70 test; README tiếng
Anh, docs/adr/001–006, openapi.json, cham/cham.mjs bộ chấm 15 mục + cham/demo.sh + cham/ep.mjs, scripts/so-do-module.mjs, xuat-openapi.mjs,
thu-serializable.mjs). Chạy: `./ha-tang.sh up` (nst-pg 41601 tmpfs, nst-redis 41901; tạo DB moc12_test) rồi `./o12db.sh <tên>`; bộ chấm trên app
thật `./chay-cham.sh <moc12|moc11-goc> <tên> [cổng]`; demo `./chay-demo.sh moc12 <tên> <cổng>`; Redis chết `./redis-chet.sh`; CI `ci-cuc-bo.py
kiem|e2e|anh` (TREN_MAY=1 cho anh; thay `git diff` bằng `git diff --no-index` vì lab không phải kho git). Ghép: `web-tool/c12/gen.mjs` rồi
`web-tool/c12/ghep.sh NNN slug` (12.7, 12.8 không có output nên cNNN.txt rỗng).
Phát hiện Ch12 đáng giữ: bộ chấm tự viết sai 2 lần (toISOString có mili giây; khung chồng nhau) — L4 "đạt vì lý do sai"; mốc 11 đạt 11/15;
đếm-rồi-ghi lọt 8/10 ⇒ pg_advisory_xact_lock(1,userId) đúng 3, 200 request 0×5xx; SERIALIZABLE + adapter-pg: 40001 đến cả dạng P2034 LẪN
DriverAdapterError (cause.originalCode) ⇒ phải bắt cả hai; AT TIME ZONE '+07' (chuỗi POSIX) = UTC−7; plugin swagger chỉ đọc .dto.ts/.entity.ts ⇒
BookingResponse rỗng từ mốc 4 (sửa dtoFileNameSuffix); @Global bị Nest gắn vào imports của MỌI module (đồ thị thô 55 cạnh); `${VAR:?}` ở dịch vụ
thuộc profile làm hỏng cả `compose up`; Redis chết ⇒ MỌI request 500 (throttler) ⇒ default fail-open, login-email fail-closed 503 (ADR-006);
câu hỏi mở còn để ngỏ: /health/ready vẫn tính Redis. Sự cố đã dùng ở bài khác KHÔNG kể lại: Starbucks 2015 (6.5), Azure 29/02/2012 (9.2).

## 6. Mục lục khung (tự sinh từ tệp khoá)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Mục 0 — Vì sao học NestJS** | | |
| | `nst-0-8-bat-dau-tai-day` | Bắt đầu tại đây (1/2) — NestJS là gì, từ đâu ra, và khoá này cho bạn điều gì |
| | `nst-0-9-bat-dau-khi-khong-co` | Bắt đầu tại đây (2/2) — Express không khuôn khổ lớn lên thành gì, và cách học khoá này |
| | `nst-0-1-moi-truong-lab` | 0.1 — Dựng môi trường: Node 22, Nest CLI 12, ESM hay CommonJS, chạy và test lần đầu |
| | `nst-0-2-du-an` | 0.2 — Dự án xuyên suốt: chọn đề tài, và đề cuối khoá đặt lịch phòng lab |
| **Chương 1 — Nest bên dưới: decorator, metadata và controller đầu tiên** | | |
| | `nst-1-1-decorator-metadata` | 1.1 — Decorator và reflect-metadata: tự viết router @Get 40 dòng |
| | `nst-1-2-nest-new` | 1.2 — Giải phẫu ứng dụng Nest: main.ts, NestFactory, AppModule, build và watch |
| | `nst-1-3-controller` | 1.3 — Controller: route, tham số, query, body, mã trạng thái và header |
| | `nst-1-4-vong-doi` | 1.4 — Vòng đời request: middleware → guard → interceptor → pipe → handler → filter |
| | `nst-1-5-lab` | 1.5 — Lab: Notes API bằng Nest, đặt cạnh bản Express |
| | `nst-1-6-moc-du-an` | 1.6 — Mốc dự án 1: khung và tài nguyên đầu tiên của đề tài |
| | `nst-1-7-quiz` | 1.7 — Kiểm tra Chương 1 |
| **Chương 2 — Module và DI container (so với Spring IoC)** | | |
| | `nst-2-1-di-la-gi` | 2.1 — Đảo ngược điều khiển từ số 0: tự viết DI container 60 dòng |
| | `nst-2-2-provider` | 2.2 — Provider chuyên sâu: useClass, useValue, useFactory, useExisting, token và @Inject |
| | `nst-2-3-module` | 2.3 — Module: imports, exports, đóng gói, module global và phụ thuộc vòng |
| | `nst-2-4-scope-lifecycle` | 2.4 — Scope và lifecycle hook: singleton, request, transient, khởi động và tắt |
| | `nst-2-5-dynamic-module` | 2.5 — Dynamic module: forRoot, forFeature, register và ConfigurableModuleBuilder |
| | `nst-2-6-so-spring` | 2.6 — Nest và Spring IoC: bảng dịch cho người biết Java |
| | `nst-2-7-lab` | 2.7 — Lab: Đổi nhà cung cấp thanh toán mà không sửa service |
| | `nst-2-8-moc-du-an` | 2.8 — Mốc dự án 2: tách đề tài thành module tính năng |
| | `nst-2-9-quiz` | 2.9 — Kiểm tra Chương 2 |
| **Chương 3 — Dây chuyền request: middleware, filter, pipe, guard, interceptor** | | |
| | `nst-3-1-middleware` | 3.1 — Middleware: dạng hàm và dạng class, consumer.apply, dùng lại middleware Express |
| | `nst-3-2-exception-filter` | 3.2 — Ngoại lệ và filter: HttpException, lỗi dựng sẵn, filter trả problem+json |
| | `nst-3-3-pipe` | 3.3 — Pipe: ParseIntPipe, ParseUUIDPipe, giá trị mặc định và pipe tự viết |
| | `nst-3-4-guard` | 3.4 — Guard: CanActivate, ExecutionContext, Reflector và decorator metadata tự viết |
| | `nst-3-5-interceptor` | 3.5 — Interceptor: RxJS vừa đủ, đo thời gian, đổi dạng phản hồi, timeout và cache |
| | `nst-3-6-thu-tu` | 3.6 — Phạm vi gắn và thứ tự chạy: toàn cục, controller, route — thí nghiệm đầy đủ |
| | `nst-3-7-lab` | 3.7 — Lab: Nhật ký kiểm toán — request id, đo thời gian, kiểm vai trò, lỗi thống nhất |
| | `nst-3-8-moc-du-an` | 3.8 — Mốc dự án 3: lỗi, log và guard đầu tiên trong dự án |
| | `nst-3-9-quiz` | 3.9 — Kiểm tra Chương 3 |
| **Chương 4 — DTO, kiểm dữ liệu, tuần tự hoá và OpenAPI** | | |
| | `nst-4-1-dto-validation` | 4.1 — DTO với class-validator và ValidationPipe — và Standard Schema (Zod) ở Nest 12 |
| | `nst-4-2-whitelist-transform` | 4.2 — whitelist, forbidNonWhitelisted, transform, object lồng và mảng |
| | `nst-4-3-mapped-types-serialization` | 4.3 — Mapped types và tuần tự hoá phản hồi: PartialType, @Exclude, DTO trả về |
| | `nst-4-4-openapi` | 4.4 — OpenAPI với @nestjs/swagger: plugin CLI, decorator, xác thực, versioning |
| | `nst-4-5-lab` | 4.5 — Lab: Biểu mẫu đặt lịch không thể lạm dụng |
| | `nst-4-6-moc-du-an` | 4.6 — Mốc dự án 4: DTO, kiểm dữ liệu và tài liệu API cho đề tài |
| | `nst-4-7-quiz` | 4.7 — Kiểm tra Chương 4 |
| **Chương 5 — Cấu hình, log và cấu trúc dự án** | | |
| | `nst-5-1-config` | 5.1 — @nestjs/config: .env, kiểm biến môi trường, namespace và truy cập có kiểu |
| | `nst-5-2-bi-mat` | 5.2 — Bí mật và môi trường: thứ không bao giờ vào git, và các vụ lộ thật |
| | `nst-5-3-logger` | 5.3 — Log trong Nest: Logger, log JSON, tham số có cấu trúc và pino |
| | `nst-5-4-cau-truc` | 5.4 — Cấu trúc dự án lớn lên được: thư mục theo tính năng, module dùng chung, thư viện monorepo |
| | `nst-5-5-lab` | 5.5 — Lab: Một bản build, ba môi trường |
| | `nst-5-6-moc-du-an` | 5.6 — Mốc dự án 5: cấu hình, log và cấu trúc dự án |
| | `nst-5-7-quiz` | 5.7 — Kiểm tra Chương 5 |
| **Chương 6 — Cơ sở dữ liệu trong Nest: Prisma, TypeORM và transaction** | | |
| | `nst-6-1-prisma` | 6.1 — Prisma trong Nest: PrismaService, vòng đời và tầng repository |
| | `nst-6-2-transaction` | 6.2 — Transaction xuyên service: $transaction, interactive transaction và CLS |
| | `nst-6-3-typeorm` | 6.3 — TypeORM trong Nest: entity, repository, quan hệ và migration (lựa chọn giống JPA) |
| | `nst-6-4-loi-db-phan-trang` | 6.4 — Lỗi cơ sở dữ liệu và danh sách: trùng → 409, không thấy → 404, phân trang |
| | `nst-6-5-chong-dat-trung` | 6.5 — Không đặt trùng: ràng buộc, exclusion constraint và optimistic locking |
| | `nst-6-6-lab` | 6.6 — Lab: Lưu đặt phòng chịu được request đồng thời |
| | `nst-6-7-moc-du-an` | 6.7 — Mốc dự án 6: cơ sở dữ liệu thật cho dự án |
| | `nst-6-8-quiz` | 6.8 — Kiểm tra Chương 6 |
| **Chương 7 — Xác thực và phân quyền: guard JWT và RBAC** | | |
| | `nst-7-1-jwt-guard` | 7.1 — JWT trong Nest: @nestjs/jwt, AuthGuard tự viết, và khi nào Passport có ích |
| | `nst-7-2-dang-nhap` | 7.2 — Đăng ký và đăng nhập: băm mật khẩu, access + refresh token, đăng xuất |
| | `nst-7-3-rbac` | 7.3 — Xác thực toàn cục với @Public(), vai trò với @Roles() và RolesGuard |
| | `nst-7-4-so-huu` | 7.4 — Quyền theo chủ sở hữu: chặn IDOR, và CASL cho luật chi tiết |
| | `nst-7-5-throttler-helmet` | 7.5 — Gia cố: @nestjs/throttler, helmet, CORS và chống dò mật khẩu |
| | `nst-7-6-lab` | 7.6 — Lab: Sinh viên, giảng viên, admin — ai được làm gì |
| | `nst-7-7-moc-du-an` | 7.7 — Mốc dự án 7: tài khoản, vai trò và quyền sở hữu trong dự án |
| | `nst-7-8-quiz` | 7.8 — Kiểm tra Chương 7 |
| **Chương 8 — Test ứng dụng Nest: đơn vị, tích hợp và e2e (Vitest và Jest)** | | |
| | `nst-8-1-unit` | 8.1 — Test đơn vị với Test.createTestingModule, overrideProvider và mock |
| | `nst-8-2-thanh-phan` | 8.2 — Test riêng guard, pipe, interceptor và filter |
| | `nst-8-3-e2e` | 8.3 — Test e2e: supertest, cùng cấu hình toàn cục như main.ts, PostgreSQL thật |
| | `nst-8-4-jest-du-an-cu` | 8.4 — Jest trên dự án Nest 10/11 đang chạy, và chuyển qua lại Jest–Vitest |
| | `nst-8-5-lab` | 8.5 — Lab: Phủ test module đặt lịch — đơn vị, guard và e2e |
| | `nst-8-6-moc-du-an` | 8.6 — Mốc dự án 8: test bắt được lỗi thật của dự án |
| | `nst-8-7-quiz` | 8.7 — Kiểm tra Chương 8 |
| **Chương 9 — Việc ngoài request: hàng đợi, lịch hẹn giờ và sự kiện** | | |
| | `nst-9-1-bullmq` | 9.1 — Hàng đợi với @nestjs/bullmq: producer, processor, thử lại và idempotency |
| | `nst-9-2-schedule` | 9.2 — Hẹn giờ với @nestjs/schedule: cron, interval, và chạy đúng một lần khi có nhiều bản |
| | `nst-9-3-events` | 9.3 — Sự kiện với @nestjs/event-emitter: tách module trong một ứng dụng |
| | `nst-9-4-lab` | 9.4 — Lab: Duyệt lịch và email nhắc qua hàng đợi |
| | `nst-9-5-moc-du-an` | 9.5 — Mốc dự án 9: dời việc chậm của dự án sang hàng đợi |
| | `nst-9-6-quiz` | 9.6 — Kiểm tra Chương 9 |
| **Chương 10 — Thời gian thực và microservice: WebSocket gateway và transport** | | |
| | `nst-10-1-gateway` | 10.1 — WebSocket gateway: @WebSocketGateway, @SubscribeMessage, adapter Socket.IO và ws |
| | `nst-10-2-ws-auth-scale` | 10.2 — Xác thực socket, phòng theo tài nguyên, và mở rộng bằng Redis adapter |
| | `nst-10-3-microservice` | 10.3 — Microservice trong Nest: transport, @MessagePattern và @EventPattern, ứng dụng lai |
| | `nst-10-4-khi-nao-tach` | 10.4 — Khi nào chưa nên tách: khối nguyên theo module trước |
| | `nst-10-5-lab` | 10.5 — Lab: Bảng tình trạng phòng cập nhật trực tiếp |
| | `nst-10-6-moc-du-an` | 10.6 — Mốc dự án 10: một tính năng thời gian thực trong dự án |
| | `nst-10-7-quiz` | 10.7 — Kiểm tra Chương 10 |
| **Chương 11 — Production: Docker, health check, CI và vận hành** | | |
| | `nst-11-1-docker` | 11.1 — Dockerfile production cho Nest: nhiều tầng, không chạy root, ảnh nhỏ |
| | `nst-11-2-health` | 11.2 — Health check với @nestjs/terminus, tắt êm và sẵn sàng nhận request |
| | `nst-11-3-ci` | 11.3 — CI với GitHub Actions: lint, test đơn vị, e2e với dịch vụ Postgres, build image |
| | `nst-11-4-hieu-nang-bao-mat` | 11.4 — Hiệu năng và bảo trì: Fastify adapter, cache, npm audit và nâng cấp Nest |
| | `nst-11-5-lab` | 11.5 — Lab: Đưa lên — stack compose, CI xanh, khởi động lại không rớt request |
| | `nst-11-6-moc-du-an` | 11.6 — Mốc dự án 11: dự án của bạn trong Docker và CI |
| | `nst-11-7-quiz` | 11.7 — Kiểm tra Chương 11 |
| **Chương 12 — Dự án cuối khoá: API đặt lịch phòng lab** | | |
| | `nst-12-1-de-bai` | 12.1 — Đề bài: user story, ràng buộc, thời hạn và rubric |
| | `nst-12-2-kien-truc` | 12.2 — Kiến trúc: module, mô hình dữ liệu và hợp đồng API trước |
| | `nst-12-3-dat-lich` | 12.3 — Lõi: đặt lịch không trùng, luồng duyệt và quyền sở hữu |
| | `nst-12-4-hang-doi-realtime` | 12.4 — Hàng đợi và thời gian thực: thông báo duyệt và bảng trực tiếp |
| | `nst-12-5-kiem-thu-trien-khai` | 12.5 — Test, Docker và CI cho dự án cuối |
| | `nst-12-6-bao-ve` | 12.6 — Bảo vệ dự án: kịch bản demo và câu hỏi của hội đồng |
| | `nst-12-7-phong-van` | 12.7 — Câu hỏi phỏng vấn NestJS (kèm gợi ý trả lời) |
| | `nst-12-8-tong-ket` | 12.8 — Kiểm tra tổng kết và checklist |
