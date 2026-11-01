# Bàn giao khoá API & System Design (`api-design`) — 01/11/2026, sau Chương 9

Viết cho phiên/agent tiếp theo để làm Ch10–Ch12 **cùng chuẩn** với Ch5–9. Đọc cùng `_HOP-DONG.md` (luật nội dung, thoát ký tự, lộ trình mã).

## 1. Trạng thái từng chương

| Mục | Tệp | Bài (slug giữ nguyên + slug mới) | Commit |
|---|---|---|---|
| 0 | `s00-intro.mjs` | 6 bài | dd95fa51e (+ đợt chất lượng b8d76cf07) |
| 1–4 | `s01…s04` | 6 bài/chương (4 bài + lab + quiz) | dd95fa51e, f6ef9b569, de5fcb778, 7b6c72997, a671f3385 |
| 5–6 | `s05-tin-cay.mjs`, `s06-bao-mat.mjs` | 6 bài/chương | 6873cfb28, 1a4ddf418 (+ Code Lab 3da29048c) |
| 7 | `s07-hop-dong.mjs` | 7 bài (mới: `api-7-1-kiem-hop-dong`, `api-7-6-lab`, `api-7-7-quiz`) | a6c0c097a |
| 0–6 đợt chất lượng | sơ đồ 20→86, nguồn 56→134, mở đầu chương | — | b8d76cf07 |
| 8 | `s08-he-thong.mjs` | 8 bài (mới: `api-8-2-payload`, `api-8-4-suy-giam`, `api-8-7-lab`, `api-8-8-quiz`) | f3210f154 |
| 9 | `s09-du-lieu.mjs` | 7 bài (mới: `api-9-1-server-cache`, `api-9-6-lab`, `api-9-7-quiz`) | commit chứa tệp này |
| 10–12 | còn là **khung** trong `api-design.mjs` (`khung('api', …)`, hiện `.slice(10)`) | 4 bài giữ chỗ/chương | — |

Số liệu sau Ch9: 76 bài, 2,49 triệu ký tự, sơ đồ 144, nguồn 192 (course-depth-audit “đạt mọi sàn”), course-content-check 0 lỗi. Code Lab `api-design-practice`: 54 module, 166 đề, máy chấm 962/962.

## 2. Chương còn lại — nội dung dự kiến (theo khung trong manifest)

**GIỮ slug khung** (`api-10-1-hang-doi`, `api-10-2-su-kien`, `api-10-3-realtime`, `api-10-4-webhook`, `api-11-1-khung`, `api-11-2-rut-gon-link`, `api-11-3-feed-chat`, `api-11-4-dat-lich`, `api-12-1-thiet-ke`, `api-12-2-xay-dung`, `api-12-3-mo-rong`, `api-12-4-tong-ket`) — seed không xoá bài cũ (`scripts/course-seed.mjs` khoá theo slug; manifest có `syncOrder: true`). Bài tách thêm ⇒ slug MỚI chèn giữa, ghi trong `header` của spec.

- **Ch10 Async & realtime:** 10.1 POST trả 202 + Location `/jobs/{id}`, trạng thái/tiến độ/huỷ/thời hạn giữ kết quả (đo: request dài 30 s bị Cloudflare-kiểu cắt ⇒ chuyển 202; worker bằng hàng đợi — có Redis 8.2 ở :6390: BullMQ hoặc Redis Streams). 10.2 hợp đồng sự kiện: mỏng/dày, phiên bản, AsyncAPI, consumer idempotent (đo: giao trùng ⇒ xử lý hai lần nếu không có khoá), outbox → khoá software-architecture Ch9. 10.3 polling vs SSE vs WebSocket: đo cùng luồng ghi chú/lượt đặt (độ trễ, số request, nối lại + `Last-Event-ID`; **compression buffer SSE ⇒ phải `res.flush()`** — đã ghi ở 8.3). 10.4 webhook: ký HMAC + timestamp chống replay, thử lại lùi dần, thứ tự/trùng lặp, endpoint nhận trả 2xx nhanh. Lab 10: hàng đợi xuất báo cáo (Lab 8) thành job 202 + webhook báo xong. Liên kết chéo Academy: SDN302 (socket.io nếu có bài), SWD392 (kiến trúc hướng sự kiện, nguồn flm-nguon — xem mục 5); Courses: `/courses/socket-io`, `/courses/background-jobs` nếu tồn tại (kiểm `ls content/courses`).
- **Ch11 Phỏng vấn:** khung trả lời 45 phút cho câu hỏi thiết kế API (làm rõ → tài nguyên/endpoint → lỗi/phân trang → auth/rate limit/phiên bản → quy mô), rồi ba đề: rút gọn link, news feed + chat, đặt lịch (LabFlow chính là đề này — dùng số đo Ch5–9 làm “bằng chứng” khi trả lời). Mỗi bài có bản ghi một buổi phỏng vấn mẫu + thang chấm.
- **Ch12 Capstone:** đưa LabFlow từ RAM sang PostgreSQL thật (Ch8 8.4 và Ch9 đã hứa “dữ liệu chờ Chương 12”): migration, pool, idempotency + rate limit dùng chung, cache, hàng đợi thông báo, đo tải lại toàn bộ, OpenAPI cuối, checklist triển khai, kể dự án theo STAR. Gói zip cuối khoá.

Mỗi chương: mở đầu “Học xong Chương N bạn làm được / Vì sao đáng học” (bài đầu chương), mỗi bài 22–40k ký tự (**kể cả phần giảng slide**), ≥ 1 sơ đồ `lz-flow|lz-stack|lz-map`, ≥ 1–2 thẻ nguồn có “read 1 Nov 2026 / đọc ngày …”, 🧪 thực hành, 🗂 thuật ngữ, 📌 tóm tắt, mục phỏng vấn; Lab có thang chấm 10 điểm + lời giải đo thật + gói zip; quiz 10 câu (đáp án rải đều vị trí).

## 3. Thư mục làm việc ngoài repo, chạy LabFlow, PostgreSQL, Redis

Scratch: `/private/tmp/claude-501/-Users-admin-Downloads-api-backend/641f37e5-0c56-4501-9b67-2330c62e4b07/scratchpad/apid` (gọi tắt `apid/`). **Thư mục tạm của phiên — có thể mất.** Bản bền: gói zip trên R2 `https://media.cuongthai.com/files/academy/API/v1/labflow-api-chN.zip` (N = 7, 8, 9) — tải về, `npm install`, `npm test` (10 test).

- Dự án theo chương: `apid/labflow-ch7`, `labflow-ch8`, `labflow-ch9` (= cuối chương = lời giải lab), lab: `labflow-lab8`, `labflow-lab8-sol`, `labflow-lab9`.
- Node: `export PATH=$HOME/.nvm/versions/node/v22.23.3/bin:$PATH`. zsh không tách từ ⇒ vòng lặp/biến danh sách chạy trong `bash -c`.
- `apid/srv.sh <thư mục> [cổng] ["ENV=… ENV=…"]` khởi động lại server (giết đúng tiến trình LISTEN cổng đó), log `apid/srv.log`.
- `apid/chay.sh <tệp lệnh>`: mỗi dòng một lệnh bash, `## nhãn` mở một mục; output dán vào `apid/out2/*.txt`; renderer bỏ tiền tố `cd X && `.
- PostgreSQL 18 riêng: `pg_ctl -D apid/pgdata -l apid/pg.log -o "-p 55432 -c unix_socket_directories=''" start`, user/db `labflow`; bảng `bookings` 1.000.000 dòng (Ch3), `lab_notes` (Ch9, 200.003 dòng), `idempotency_keys` (8.4), schema `shard0/shard1`, bảng `id_seq/id_v4/id_v7`, `labs_r/devices_r/issues_r/labs_d` (Ch9).
- Replica: `pg_ctl -D apid/pgreplica -l apid/pgreplica.log -o "-p 55433 -c unix_socket_directories=''" start` (`recovery_min_apply_delay = '2s'`).
- Redis: `redis-server --port 6390 --save "" --appendonly no --dir apid/redisdata --daemonize yes`; dừng: `redis-cli -p 6390 shutdown nosave`.
- Biến LabFlow hay dùng: `SEED_BOOKINGS=n`, `LABFLOW_IP_LIMIT=1000000/60` (chỉ để test tải — bẫy 429 ở 8.2), `NODE_ENV=production LABFLOW_JWT_SECRET=…` (JSON gọn), `LABFLOW_PG=1` (route Ch9), `LABFLOW_CHAOS=1`, `LABFLOW_OUTAGE_MS`, `LABFLOW_LOGIN_MAX_INFLIGHT`, `LABFLOW_IDEMPOTENCY=pg`, `LABFLOW_INSTANCE`.
- Khi xong việc: tắt LabFlow (4000–4003), proxy 8080/8081/8090, Prism 4010/4011, PostgreSQL (cả replica), Redis; xoá token tạm `apid/*.jwt`, `lan.json`.

## 4. Soạn bài (generator)

- Mỗi chương một thư mục `apid/sNN/`: `gen.py` + `gen_lib.py` + `measure.py` (chép từ chương trước, sửa tên tệp đích trong `gen.py`), `spec.json` (header, imports giảng, title, description, lessons), `<slug>.en.html`, `<slug>.vi.html`, `<slug>.quiz.json`.
- Dấu lệnh trong html: `@@code lang … @@end`, `@@out … @@end`, `@@src out2/src-N/tệp [lang]`, `@@run out2/xx.txt "nhãn" [n=2,3]` (chỉ lấy lệnh thứ 2,3 của mục — dùng để bỏ dòng đăng nhập lặp lại).
- Đo độ dài: `echo <slug> | python3 measure.py` (EN+VI chưa gồm giảng); phần giảng + ảnh slide thêm ~4–5,5k ⇒ nhắm measure ≤ 35k. Sau `python3 gen.py`, đo thật bằng node: `content.length` của từng bài ≤ 40.000.
- Sau gen: thêm import vào `api-design.mjs`, đưa vào `sections`, tăng `.slice(N)` của khung. Chạy `node scripts/course-content-check.mjs ./content/courses/api-design.mjs` và `node scripts/course-depth-audit.mjs ./content/courses/api-design.mjs` (đường dẫn tệp, không phải tên khoá).
- Tệp `sNN-*.mjs` sinh một lần; từ đó sửa thẳng tệp trong repo (header ghi rõ).

## 5. Bẫy đã gặp (đừng lặp lại)

- **Tệp Academy SINH TỰ ĐỘNG:** trước khi sửa bất kỳ tệp `content/academy/**`, xem header có dòng “FILE SINH TỰ ĐỘNG” không. Có ⇒ sửa nguồn ở `~/Documents/FLM-nguon/_repo/<MÔN>/gen/…`, chạy gen của môn (`node PRJ301/gen/gen.mjs --only cs`, `node SWD392/gen/gen.mjs --only ch3`), so `cmp` với tệp repo; commit trong flm-nguon CHỈ tệp của mình (repo đó có thay đổi dở của phiên khác ở DBI202/, OSG202/), không push. `SDN302.mjs`, `SWR302.mjs`, `PRJ301.mjs` (bản gốc) KHÔNG sinh ⇒ sửa thẳng, nhưng kiểm `git status` ngay trước khi sửa (phiên khác hay sửa SDN302).
- **Code Lab chạy lời giải trong node:vm realm MỚI:** không có `URL`, `Buffer`, `fetch` ⇒ lời giải tham chiếu chỉ JS thuần (regex thay `new URL`). `goi(fn, undefined, …)` sinh mã hỏng (JSON.stringify(undefined)) ⇒ viết chuỗi gọi tay. `jsBai` cần ≥ 2 gợi ý, ≥ 2 lỗi hay gặp, ≥ 1 ca ẩn + 1 ca hiện, và code khởi đầu phải trượt ít nhất một ca. `qn()` (nhiều đáp án) chưa từng dùng — dùng `q()`. Kiểm nội dung báo ⚠ “đáp án dài hơn hẳn nhiễu” ⇒ kéo dài phương án nhiễu.
- **gitleaks** báo một khoá Idempotency-Key dạng UUID có sẵn ở `s05` là bí mật — dương tính giả, để nguyên. Quét theo tệp: chép đúng các tệp sắp commit vào thư mục tạm rồi `gitleaks detect --no-git --source <tmp>`.
- **Slide:** checker `node scripts/_api-kiem-slide.mjs scripts/slides-src/<deck>.mjs` phải ra 0 (TRÀN, lấn phải, trống < 70%, `pre ngang`, `div.term cắt dọc`). Cách sửa hay dùng: bỏ `'r64'`, đưa khối code ra toàn chiều ngang rồi `two(...)` bên dưới, `giua: true` cho slide trống, `{ wrap: 'any' }` cho `http()`, tách slide. Output trong slide phải là output THẬT (được rút gọn bằng “…”, không được sửa chữ).
- **Deck đã đẩy lên R2 thì không ghi đè:** dựng lại ⇒ đẩy sang `API/v2` và ghi `VER` trong `_slides.mjs` (đang có: api-01-3, api-02-3, api-04-2, api-05-1, api-08-3).
- **Đừng GET `media.cuongthai.com`** trước khi upload (CDN giữ 404).
- **Đo đạc trên máy đang bận** (các agent khác chạy song song, load average ~30): lặp lại phép đo, báo khoảng dao động (vd shedding 65,7 vs 120–126/s).
- **Số dự đoán ≠ số đo:** 8.3 từng viết “80 + 204 ≈ 319 ms” — sai số học; phải ghi “dự đoán 284 ms, đo 319 ms”. Kiểm mọi phép tính trước khi in slide.
- **Express:** `res.set('Vary', …)` ghi đè Vary của CORS ⇒ dùng `res.vary()`. 304 tự động của Express chỉ tiết kiệm byte (băm body sau khi đã dựng). PostgreSQL không có `max()` cho `uuid`.
- **Replica:** migration cũng trễ ⇒ đọc bảng mới từ replica quá sớm ra 500. Route dùng PostgreSQL phải gắn có điều kiện (`LABFLOW_PG=1`) để `npm test` chạy được không cần CSDL.
- **oasdiff:** tải binary bị bộ phân loại quyền từ chối — đừng thử lại; dùng `openapi/diff.mjs` tự viết (openapi-diff 0.24 không đọc OAS 3.1).
- **Commit:** index riêng — `bash -c 'export GIT_INDEX_FILE=$(mktemp -u); git read-tree HEAD; git add <tệp>; git commit -F msg; unset GIT_INDEX_FILE; git reset -q HEAD -- <tệp>'`. Không Co-Authored-By, không push, không deploy.

## 6. Slide, giảng, zip, Code Lab — các bước

1. **Slide** `scripts/slides-src/api-NN-M.mjs` (+ `api-lab-N.mjs`) dùng `_api-chung.mjs` (`lamDeck, sql, http, two, three, box, cards, flow`), tiếng Anh, không logo FPT. Kiểm: `_api-kiem-slide.mjs` = 0. Xem: `bash apid/xem2.sh <deck>` ⇒ `apid/render2/<deck>/ghep-*.png` (mở ra nhìn). KHÔNG sửa `_render-slides.mjs`, `_cs-chung.mjs`, `_pg-chung.mjs`.
2. **Upload slide:** chép `render2/<deck>/[0-9]*.webp` vào `apid/uploadNN/<deck>/` rồi `node --env-file=.env scripts/upload-academy-slides.mjs --dir apid/uploadNN --prefix API/v1`.
3. **Giảng** `content/courses/api-design/giang/api-NN-M.mjs`: `walkApi(deck, tenEn, tenVi, [[n, 'Tiêu đề', '<p>EN</p>', '<p>VI</p>'], …])` phủ đủ mọi slide; câu ngắn để bài không quá 40k.
4. **Zip dự án:** `rsync -a --exclude node_modules apid/labflow-chN/ apid/zipN/labflow-api/` + `README.txt` (lệnh theo bài) ⇒ `zip -qr labflow-api-chN.zip labflow-api` ⇒ giải nén thử + `npm test` ⇒ `node --env-file=.env scripts/upload-academy-file.mjs --file … --key API/v1/labflow-api-chN.zip`.
5. **Code Lab:** module `content/codelab/api-design-practice/nguon/<slug-bài>.mjs` (`cs`, `q`, `jsBai`, `nguon`, `goi`, `doiDau({ slug, ten, khoa: KHOA, baiHoc, de })`). Dựng: `node content/codelab/api-design-practice/nguon/_dung-track.mjs` → `node scripts/codelab-xuat-de.mjs --track api-design-practice` → `npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track api-design-practice` (mọi lời giải đạt, mọi code khởi đầu trượt) → `node scripts/codelab-kiem-noi-dung.mjs --track api-design-practice --chi-tiet` (0 lỗi, 0 ⚠). Thứ tự module lấy theo manifest khoá.
6. **Liên kết chéo:** thẻ `link-card lien-ket-cheo` hai chiều Academy↔Courses (EN “You met this in …” / VI “Bạn đã gặp điều này ở …”; phía Academy “Measure it in API & System Design …”), ghi vào `content/_LIEN-KET-CHEO/sdn302-api-design.md` (bảng + dòng “Không cặp (ChN)”). Courses↔Courses (redis, postgresql) dùng `link-card` thường.
7. **Ghi `_HOP-DONG.md`** (cấu trúc tệp, “Từ Chương N” mô tả mã), chạy content-check + depth-audit, gitleaks, commit một chương một commit, báo điều phối (SHA + số chính).
