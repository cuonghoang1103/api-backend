# Kế hoạch soạn khoá `debug-co-phuong-phap` — Debug có phương pháp

Khung dựng 20/11/2026: `content/courses/debug-co-phuong-phap.mjs` (prefix bài `dbg-`, 13 phần = Mục 0 + 12 chương, 76 bài).
Ảnh bìa: `scripts/covers/debug-co-phuong-phap.png` (logo tự vẽ `scripts/icons/bug.svg`, mục trong `scripts/course-cover-offline.mjs`) — **chưa đẩy R2**.
Category `backend`, level `INTERMEDIATE`. Nguồn yêu cầu: bảng soát khoảng trống P0-1 (`video-bai-giang/scratchpad/soat-kho/bang-khoang-trong.md`).

**Người học:** SV SE FPT năm 3, chuyên Node.js (+ Spring Boot, React, PostgreSQL), mục tiêu OJT FPT Software SP27, chưa tự gõ code nhiều,
muốn học làm thật. Gỡ lỗi là việc chiếm nhiều giờ nhất của intern ⇒ khoá dạy PHƯƠNG PHÁP + làm chủ debugger, không dạy mẹo rời.

**Quy trình soạn:** theo `content/courses/docker/_HOP-DONG.md` (slide, đào sâu, 🧪/🗂/📌, quiz 10 câu có giải thích, EN song song) +
chuẩn chung: liên tưởng đời thường, tình huống thật khi đi làm, góc hacker + cách phòng (cổng inspector 9229, JDWP 5005, log lộ token, HAR
lộ cookie), lab chạy trên máy thật, mỗi chương có lab + quiz. Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật
`debug-co-phuong-phap/sNN-*.mjs`, **GIỮ NGUYÊN slug bài và title chương**.

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (yêu cầu) | Bài (slug) |
|---|---|
| Tư duy: tái hiện → khoanh vùng → giả thuyết → kiểm | `dbg-1-1-quy-trinh`, `dbg-1-2-tai-hien`, `dbg-1-3-khoanh-vung`, `dbg-1-4-gia-thuyet` |
| Đọc stack trace Java / JS / Python | `dbg-2-1-giai-phau`, `dbg-2-2-java`, `dbg-2-3-javascript`, `dbg-2-4-python`, `dbg-2-5-tra-cuu` |
| Debugger VS Code (Node, trình duyệt) | `dbg-3-1-launch-json` … `dbg-3-5-trinh-duyet` |
| Breakpoint điều kiện, watch, evaluate, step | `dbg-3-2-breakpoint`, `dbg-3-3-buoc-va-quan-sat`, `dbg-4-1-co-ban`, `dbg-4-2-breakpoint-nang-cao` |
| Attach tiến trình đang chạy | `dbg-3-4-attach` (Node `--inspect`), `dbg-4-5-remote-jvm` |
| IntelliJ (Java/Spring) chuyên sâu, remote debug | `dbg-4-1` … `dbg-4-5-remote-jvm` |
| Front-end DevTools | `dbg-5-1-console` … `dbg-5-4-storage-react` |
| API/HTTP | `dbg-6-1-phan-tang` … `dbg-6-4-tuong-quan` |
| DB: truy vấn sai, chậm, khoá | `dbg-7-1-sql-that` … `dbg-7-4-khoa` |
| Đồng thời/race, thời gian, cache | `dbg-8-1-race`, `dbg-8-2-thoi-gian`, `dbg-8-3-cache` |
| Rò rỉ bộ nhớ (mức nhận biết) | `dbg-8-4-bo-nho` |
| git bisect, "máy em chạy" | `dbg-9-1-bisect-run`, `dbg-9-2-moi-truong`, `dbg-9-3-phu-thuoc` |
| Debug production an toàn (log, feature flag) | `dbg-10-1-nguyen-tac` … `dbg-10-4-tu-canh-bao` |
| Bug report + postmortem nhỏ | `dbg-11-1-bug-report`, `dbg-11-2-ghi-lai-ban-sua`, `dbg-11-3-postmortem-nho` |
| Dự án: 10 lỗi cài sẵn | `dbg-12-1-de-bai` … `dbg-12-4-bao-cao` |
| Câu phỏng vấn | `dbg-12-5-phong-van` |
| Lab + quiz mỗi chương | `dbg-N-*-lab`, `dbg-N-*-quiz` (N = 1…11), tổng kết `dbg-12-6-tong-ket` |

## 2. Liên kết chéo (gọi sang, KHÔNG dạy lại)

| Ở bài | Dẫn sang | Lý do |
|---|---|---|
| `dbg-2-1`, `dbg-10-2` | `log-tu-a-den-z` (ch1–2 đọc log, ch10 log ứng dụng) | Đọc log đã dạy sâu |
| `dbg-10-4`, `dbg-6-4` | `observability-monitoring` ch11 (từ cảnh báo tới nguyên nhân), ch3 (correlation) | Quy trình chẩn đoán bằng số đo |
| Mục 0, `dbg-1-1` | `web-foundations` 10.2 | Nhập môn gỡ lỗi — khoá này là bản chuyên sâu |
| `dbg-10-4` | `kubernetes` ch9 | Gỡ lỗi trong cluster |
| `dbg-9-1` | `git` 2.4 (git bisect) | Lệnh đã dạy, ở đây áp dụng `bisect run` |
| `dbg-3-4` | `docker` 13.2 | Debugger trong container |
| `dbg-8-4` | `performance-load-testing` ch6, `operating-systems-for-developers` | Profiling, bộ nhớ chuyên sâu |
| `dbg-11-3`, `dbg-10-1` | `incident-response` ch10, ch6 | Postmortem đầy đủ, khôi phục |
| `dbg-7-3` | `postgresql` (chương tối ưu truy vấn) | EXPLAIN chuyên sâu |
| `dbg-11-1` | `tieng-anh-ky-thuat-di-lam` ch2 | Viết bug report tiếng Anh |
| Mục 0 | `ide-va-do-nghe-dev` | Phím tắt/điều hướng IDE là nền |

Khi khoá này có bài thật: thêm dòng "→ gỡ lỗi có phương pháp" ở web-foundations 10.2, PRF192 N1, linux-bash 7.4, kubernetes ch9 (mục 3.1 bảng soát).

## 3. Nguồn chính thống

VS Code Docs — Debugging, Node.js debugging, Browser debugging • JetBrains IntelliJ IDEA Docs — Debug code, Breakpoints, Remote debug •
Chrome DevTools docs (developer.chrome.com/docs/devtools) • Node.js Docs — Debugging guide, Inspector security • Oracle JPDA/JDWP •
JEP 358 (Helpful NullPointerExceptions) • git-scm.com/docs/git-bisect • PostgreSQL Docs — pg_locks, pg_stat_activity, EXPLAIN, explicit locking •
Hibernate/Spring Boot logging docs • Prisma Docs — logging • Sách: Zeller "Why Programs Fail", Agans "Debugging: The 9 Indispensable Rules",
Google SRE Book ch12 "Effective Troubleshooting". Sự cố dẫn: Cloudflare blog 12/07/2019 (regex outage), SEC report Knight Capital 2013.

## 4. Môi trường lab

- Repo mẫu `dbg-lab` (soạn cùng chương 0): Spring Boot 3 + Node/Express + React (Vite) + PostgreSQL 16, `docker compose up`; mỗi lỗi là một
  nhánh/cờ bật được (`BUG_07=1`) để lab và capstone dùng chung. Tái dùng dữ liệu LabFlow (đặt lịch phòng lab).
- Máy: Mac M1 (zsh) + Windows/WSL2 — ghi khác biệt khi có (đường dẫn, CRLF, cổng). Công cụ: VS Code, IntelliJ IDEA Community, Chrome,
  curl, Postman/Bruno, psql/DBeaver, k6 hoặc autocannon, VisualVM.
- An toàn: cổng 9229/5005 chỉ bind 127.0.0.1; không có dữ liệu thật; log mẫu đã che token.

## 5. Mục lục khung (tự sinh từ tệp khoá)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Mục 0 — Gỡ lỗi chính là công việc** | | |
| | `dbg-0-8-bat-dau-tai-day` | Bắt đầu tại đây (1/2) — Vì sao gỡ lỗi là phần lớn công việc, và khoá này cho bạn điều gì |
| | `dbg-0-9-bat-dau-khi-khong-co` | Bắt đầu tại đây (2/2) — Gỡ lỗi không phương pháp: console.log hàng giờ, sửa bừa |
| | `dbg-0-1-moi-truong-lab` | 0.1 — Dựng môi trường lab: ứng dụng mẫu nhiều lỗi trong Docker Compose |
| **Chương 1 — Tư duy gỡ lỗi: phương pháp khoa học trên code** | | |
| | `dbg-1-1-quy-trinh` | 1.1 — Vòng lặp: tái hiện, khoanh vùng, giả thuyết, kiểm, sửa, chặn tái phát |
| | `dbg-1-2-tai-hien` | 1.2 — Tái hiện chắc chắn và bản tái hiện tối giản |
| | `dbg-1-3-khoanh-vung` | 1.3 — Khoanh vùng: chia đôi theo tầng, theo code, theo dữ liệu |
| | `dbg-1-4-gia-thuyet` | 1.4 — Giả thuyết, đọc kỹ thông báo lỗi trước, và biết lúc nào nên hỏi |
| | `dbg-1-5-lab` | 1.5 — Lab: Năm lỗi nhỏ, mỗi lỗi một nhật ký gỡ lỗi |
| | `dbg-1-6-quiz` | 1.6 — Kiểm tra Chương 1 |
| **Chương 2 — Đọc thông báo lỗi và stack trace: Java, JavaScript, Python** | | |
| | `dbg-2-1-giai-phau` | 2.1 — Giải phẫu stack trace: frame, thứ tự đọc, dòng nào là code của bạn |
| | `dbg-2-2-java` | 2.2 — Java: NullPointerException, chuỗi "Caused by" và bức tường chữ của Spring |
| | `dbg-2-3-javascript` | 2.3 — JavaScript và Node: trace bất đồng bộ, promise bị từ chối, source map |
| | `dbg-2-4-python` | 2.4 — Python: traceback đọc từ dưới lên, ngoại lệ lồng nhau |
| | `dbg-2-5-tra-cuu` | 2.5 — Tra cứu lỗi cho đúng: docs, issue, Stack Overflow, AI |
| | `dbg-2-6-lab` | 2.6 — Lab: Mười stack trace thật, mười dòng gốc |
| | `dbg-2-7-quiz` | 2.7 — Kiểm tra Chương 2 |
| **Chương 3 — Debugger VS Code cho Node.js và trình duyệt** | | |
| | `dbg-3-1-launch-json` | 3.1 — Launch hay attach, launch.json, auto attach và JavaScript Debug Terminal |
| | `dbg-3-2-breakpoint` | 3.2 — Breakpoint chuyên sâu: điều kiện, đếm lượt, logpoint, ngoại lệ, hàm |
| | `dbg-3-3-buoc-va-quan-sat` | 3.3 — Đi từng bước và quan sát: step into/over/out, watch, debug console |
| | `dbg-3-4-attach` | 3.4 — Gắn vào tiến trình đang chạy: --inspect, --inspect-brk và Docker |
| | `dbg-3-5-trinh-duyet` | 3.5 — Gỡ lỗi front-end từ VS Code: React và Next.js (server + client) |
| | `dbg-3-6-lab` | 3.6 — Lab: Bốn lỗi Node.js chỉ bằng debugger (cấm console.log) |
| | `dbg-3-7-quiz` | 3.7 — Kiểm tra Chương 3 |
| **Chương 4 — Debugger IntelliJ IDEA cho Java và Spring Boot** | | |
| | `dbg-4-1-co-ban` | 4.1 — Cấu hình chạy debug, frame, biến, Evaluate Expression và watch |
| | `dbg-4-2-breakpoint-nang-cao` | 4.2 — Breakpoint nâng cao: điều kiện, suspend, chỉ ghi log, ngoại lệ, watchpoint |
| | `dbg-4-3-stream-hotswap` | 4.3 — Stream, lambda, Drop Frame, Force Return và HotSwap |
| | `dbg-4-4-spring` | 4.4 — Gỡ lỗi chính Spring: bean nào, controller nào, truy vấn nào |
| | `dbg-4-5-remote-jvm` | 4.5 — Debug JVM từ xa qua JDWP: container Docker và máy test |
| | `dbg-4-6-lab` | 4.6 — Lab: Săn lỗi Spring Boot với bốn kỹ thuật IntelliJ |
| | `dbg-4-7-quiz` | 4.7 — Kiểm tra Chương 4 |
| **Chương 5 — Gỡ lỗi giao diện bằng DevTools của trình duyệt** | | |
| | `dbg-5-1-console` | 5.1 — Console hơn cả console.log: mức log, $0, giữ log khi chuyển trang, dừng ở ngoại lệ |
| | `dbg-5-2-network` | 5.2 — Network: mã trạng thái, header, lỗi CORS, cache, mạng chậm, HAR |
| | `dbg-5-3-sources` | 5.3 — Sources: breakpoint, breakpoint DOM, fetch/XHR, event listener, local overrides |
| | `dbg-5-4-storage-react` | 5.4 — Tab Application và React DevTools: cookie, storage, service worker |
| | `dbg-5-5-lab` | 5.5 — Lab: Năm lỗi giao diện trong ứng dụng React mẫu |
| | `dbg-5-6-quiz` | 5.6 — Kiểm tra Chương 5 |
| **Chương 6 — Gỡ lỗi API và HTTP** | | |
| | `dbg-6-1-phan-tang` | 6.1 — Tầng nào sai: DNS, TLS, proxy, ứng dụng — và mỗi mã trạng thái thật sự nói gì |
| | `dbg-6-2-curl-postman` | 6.2 — Tái hiện request: curl -v, môi trường Postman/Bruno, Copy as cURL |
| | `dbg-6-3-du-lieu` | 6.3 — Lỗi dữ liệu gửi nhận: JSON, mã hoá ký tự, ngày giờ và múi giờ, số lớn |
| | `dbg-6-4-tuong-quan` | 6.4 — Lần theo một request qua nhiều dịch vụ bằng correlation ID |
| | `dbg-6-5-lab` | 6.5 — Lab: Một API chỉ lỗi khi gọi từ giao diện |
| | `dbg-6-6-quiz` | 6.6 — Kiểm tra Chương 6 |
| **Chương 7 — Gỡ lỗi cơ sở dữ liệu: kết quả sai, truy vấn chậm, khoá** | | |
| | `dbg-7-1-sql-that` | 7.1 — Nhìn thấy SQL thật: log truy vấn Prisma, Hibernate, pg_stat_statements |
| | `dbg-7-2-ket-qua-sai` | 7.2 — Kết quả sai: logic NULL, JOIN nhân dòng, GROUP BY, collation, timestamptz |
| | `dbg-7-3-cham` | 7.3 — Truy vấn chậm: đọc EXPLAIN ANALYZE vừa đủ để tìm nguyên nhân |
| | `dbg-7-4-khoa` | 7.4 — Khoá và deadlock: pg_locks, pg_stat_activity, "idle in transaction" |
| | `dbg-7-5-lab` | 7.5 — Lab: Ba lỗi cơ sở dữ liệu trong ứng dụng đặt lịch |
| | `dbg-7-6-quiz` | 7.6 — Kiểm tra Chương 7 |
| **Chương 8 — Lỗi bất định: đồng thời, thời gian, cache và bộ nhớ** | | |
| | `dbg-8-1-race` | 8.1 — Race condition: đặt trùng, mất cập nhật, kiểm-rồi-làm |
| | `dbg-8-2-thoi-gian` | 8.2 — Lỗi thời gian: múi giờ, giờ mùa hè, tháng bắt đầu từ 0, lệch đồng hồ |
| | `dbg-8-3-cache` | 8.3 — Trạng thái cũ: "sửa rồi mà vẫn lỗi" — trình duyệt, CDN, Redis, bản build cũ |
| | `dbg-8-4-bo-nho` | 8.4 — Rò rỉ bộ nhớ ở mức nhận biết: heap tăng mãi, heap snapshot, OOMKilled |
| | `dbg-8-5-lab` | 8.5 — Lab: Một race, một lỗi thời gian và một rò rỉ |
| | `dbg-8-6-quiz` | 8.6 — Kiểm tra Chương 8 |
| **Chương 9 — "Hôm qua còn chạy": chia đôi lịch sử và môi trường** | | |
| | `dbg-9-1-bisect-run` | 9.1 — git bisect run với script kiểm tự động |
| | `dbg-9-2-moi-truong` | 9.2 — "Máy em chạy mà": so phiên bản, biến môi trường, lockfile, hệ điều hành và dữ liệu |
| | `dbg-9-3-phu-thuoc` | 9.3 — Lỗi hồi quy do thư viện: diff lockfile, npm ls, mvn dependency:tree |
| | `dbg-9-4-lab` | 9.4 — Lab: Tìm commit gây lỗi và thư viện gây lỗi |
| | `dbg-9-5-quiz` | 9.5 — Kiểm tra Chương 9 |
| **Chương 10 — Gỡ lỗi trên production an toàn** | | |
| | `dbg-10-1-nguyen-tac` | 10.1 — Luật vàng: chỉ đọc trước, không dừng production, không sửa tay dữ liệu |
| | `dbg-10-2-log-de-debug` | 10.2 — Log làm debugger: log có cấu trúc tạm thời, không ghi dữ liệu cá nhân |
| | `dbg-10-3-feature-flag` | 10.3 — Feature flag, công tắc ngắt, canary và rollback |
| | `dbg-10-4-tu-canh-bao` | 10.4 — Từ cảnh báo tới nguyên nhân trên một hệ thống thật — học tiếp ở đâu |
| | `dbg-10-5-lab` | 10.5 — Lab: Chẩn đoán một sự cố "production" chỉ bằng log và số đo |
| | `dbg-10-6-quiz` | 10.6 — Kiểm tra Chương 10 |
| **Chương 11 — Bug report, ghi lại bản sửa và postmortem nhỏ** | | |
| | `dbg-11-1-bug-report` | 11.1 — Bug report người khác làm được ngay |
| | `dbg-11-2-ghi-lai-ban-sua` | 11.2 — Ghi lại bản sửa: nguyên nhân gốc, thay đổi, test chặn tái phát |
| | `dbg-11-3-postmortem-nho` | 11.3 — Postmortem nhỏ: dòng thời gian, 5 Whys, hành động, không đổ lỗi |
| | `dbg-11-4-lab` | 11.4 — Lab: Báo cáo, ghi bản sửa và postmortem cho một lỗi ở Lab 8 |
| | `dbg-11-5-quiz` | 11.5 — Kiểm tra Chương 11 |
| **Chương 12 — Dự án cuối khoá: săn 10 lỗi cài sẵn** | | |
| | `dbg-12-1-de-bai` | 12.1 — Đề bài: ứng dụng, 10 bug report, luật chơi và cách chấm |
| | `dbg-12-2-loi-1-5` | 12.2 — Lỗi 1–5: NPE trong Spring, phân trang lệch một, CORS, múi giờ, N+1 |
| | `dbg-12-3-loi-6-10` | 12.3 — Lỗi 6–10: race đặt trùng, deadlock, rò rỉ bộ nhớ, cache cũ, lỗi hồi quy |
| | `dbg-12-4-bao-cao` | 12.4 — Báo cáo cuối và postmortem cho lỗi khó nhất |
| | `dbg-12-5-phong-van` | 12.5 — Câu hỏi phỏng vấn về gỡ lỗi (kèm gợi ý trả lời) |
| | `dbg-12-6-tong-ket` | 12.6 — Kiểm tra tổng kết và checklist |
