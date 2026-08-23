# LabFlow Master Plan v1.0 — đánh giá và bổ sung

Đọc ngày 23/08/2026, đối chiếu với mã nguồn cuongthai.com đang chạy production.

---

## Tóm tắt

Kế hoạch này chắc hơn phần lớn đồ án: có gate go/no-go thật, có quy tắc cắt scope,
có risk register, và trang 28 xử lý liêm chính học thuật thẳng thắn thay vì né.

Ba chỗ phải sửa **trước Ngày 1**, mười hai chỗ cần chèn vào lịch, và một khối lượng
đáng kể thứ bạn **đã có sẵn** trong cuongthai.com mà kế hoạch đang lên lịch để học lại.

---

## Phần 0 — Số đo thực tế của cuongthai.com

| Hạng mục | Số đo |
|---|---|
| Prisma models | 277 |
| Migrations đã deploy | 118 |
| Backend TypeScript | ~115.000 dòng |
| Frontend TypeScript | ~335.000 dòng |
| Cổng thiết bị ESP32 | `src/socket/device.gateway.ts` — WebSocket thô, PCM nhị phân hai chiều |
| Firmware ESP32 thật | `firmware/mini-me-robot` |
| RAG + embedding | `embedQueue.service.ts`, `InterviewKnowledgeChunk`, `NoteEmbedding`, `DocumentChunk` |
| Cổng LLM + fallback | `src/services/llm/gateway.ts` |
| Trần chi phí AI mềm/cứng | `src/services/llm/budget.ts` |
| Bộ eval chống bịa | `eval/runEval.ts`, `makerlab/hallucination.test.ts` |
| Thanh toán thật | VNPay + IPN + `PaymentTransaction` |
| **Bảng audit log** | **KHÔNG CÓ** |
| **`FOR UPDATE` / `SERIALIZABLE` / advisory lock** | **KHÔNG CÓ dòng nào** |

Hai dòng cuối chính là điểm mạnh của kế hoạch: nó nhắm đúng vào hai thứ bạn chưa
từng làm. Phần còn lại thì không.

---

## Phần 1 — Ba quyết định phải chốt TRƯỚC Ngày 1

### Quyết định 1 — Java Spring Boot, hay stack bạn đã mạnh?

Kế hoạch dành Tuần 1–2 học Java/Spring. Thực tế với 450k dòng TS/Node/Prisma/Postgres
đang chạy production, Tuần 1–5 sẽ là **học lại bằng ngôn ngữ khác những thứ bạn đã biết**:
DI, migration, repository, validation, error envelope.

Ba đường:

- **A — Rubric bắt buộc Java/.NET.** Giữ Spring Boot, nhưng cắt LabFlow Core mạnh
  (bỏ analytics, bỏ PWA, tối giản UI). Tái dùng *thiết kế*, không tái dùng code.
- **B — Rubric tự do stack.** Build bằng Node/TS. Sáu tuần tiết kiệm được đổ vào
  đúng chỗ ăn điểm: concurrency, isolation, evaluation, tài liệu.
- **C — Lai (khuyến nghị).** Spring Boot cho core nghiệp vụ (RBAC, reservation,
  waitlist, loan, audit, reporting) + **sidecar Node cho AI và IoT**, tái dùng
  gateway/RAG/budget bạn đã viết.

Đường C không phải là lách. Chính kế hoạch đã viết: *"AI inference và MQTT có thể là
process/service riêng vì runtime khác."* Đó chính là đường cắt. Và nó biến ADR tách
service từ lý thuyết thành bằng chứng: **runtime khác + đã tồn tại + đã chạy production**.
Bạn vừa học được Spring thật, vừa không đốt 4 tuần viết lại RAG.

> **Hành động Ngày 0:** đọc rubric SWP391, hỏi giảng viên đúng một câu — *"Stack có bị
> ràng buộc không?"* Toàn bộ 20 tuần treo vào câu trả lời này. Đừng viết dòng code nào
> trước khi biết.

### Quyết định 2 — Bỏ tên "Cường 1–5"

Chân trang lặp lại 30 lần: *"Cường 1-5 là workstream mô phỏng, không phải danh tính Git giả."*
Khi một tài liệu phải nhắc 30 lần rằng nó không gian lận, người đọc sẽ bắt đầu hỏi vì sao
nó phải nhắc.

Cơ chế đúng, tên sai. Đổi thành lane:

```
lane:arch   lane:be   lane:fe   lane:qa   lane:aiot
```

- Commit theo Conventional Commits, scope = lane: `feat(be/reservation): thêm exclusion constraint`
- Một file `LANES.md`: *"một người, năm mối quan tâm, gắn nhãn để tự ép mình không bỏ quên QA và tài liệu."*
- Khi bảo vệ: mở GitHub, lọc nhãn, cho thấy phân bố công việc thật.

Không cần một câu xin lỗi nào, và không mất gì so với cách cũ.

### Quyết định 3 — Chốt nguồn dữ liệu Tuần 15–16 ngay, đừng đợi Ngày 99

Đây là chỗ dễ vỡ nhất của cả kế hoạch. 1–3 con ESP32 chạy 6 tuần sẽ cho bạn khoảng
**không** ca hỏng thiết bị thật. Mọi precision/recall/F1 trên tập đó là đo nhãn tự bịa.
Giám khảo nghiên cứu chỉ cần một câu: *"Tập của em có bao nhiêu ca hỏng thật?"*

Gói mạnh nhất, **không cần nhãn hỏng thật**:

1. **Rule baseline** — ngưỡng minh bạch, có evidence *(kế hoạch đã có, Ngày 102)*.
2. **Anomaly detection không giám sát** trên telemetry thật — đánh giá bằng *recall
   trên bất thường tiêm vào có chủ ý* + *false-positive rate trên cửa sổ sạch đã biết*.
   Không cần một nhãn hỏng nào.
3. **Một tập công khai có nhãn hỏng thật** cho phần có giám sát: AI4I 2020 (UCI, ~10k
   dòng, 5 kiểu hỏng) hoặc NASA C-MAPSS. Báo cáo kèm khoảng cách miền rõ ràng.
4. **Viết mục limitation TRƯỚC khi có kết quả**, không viết sau.

Và đổi tên mục tiêu: từ *"predictive maintenance"* thành **"anomaly detection trên
telemetry vận hành, kèm baseline dự báo hỏng trên tập công khai"**. Đúng hơn, và
không ai bắt bẻ được.

---

## Phần 2 — Mười hai chỗ cần chèn vào lịch

### T1 · Migration replay trên DB sạch, chạy trong CI

Chính repo này đang mang migration `20260706130000_add_music_and_profile` không replay
được (P3006) — `prisma migrate dev` hỏng vĩnh viễn vì nó. Bạn đã trả giá cho bài học
này rồi. Một job CI dựng DB rỗng rồi chạy toàn bộ migration, mỗi PR. **2 giờ ở Tuần 1,
cứu vài ngày ở Tuần 19** — và là một câu chuyện bảo vệ rất tốt.

### T1 · Observability tối thiểu

Request ID, structured log, `/health` + `/ready`. Kế hoạch để tới Ngày 129. Ở Tuần 1
là 2 giờ; ở Tuần 19 là 2 ngày retrofit vào hàng trăm endpoint.

### T2 · Spike concurrency phải so sánh BA cách, không một cách

Đây là câu hỏi trung tâm của SWP391. Đa số đồ án dùng `SELECT ... WHERE overlap` rồi
kiểm tra ở tầng ứng dụng — **sai dưới đồng thời**. Bạn nên có câu trả lời một dòng SQL:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE reservations ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status IN ('CONFIRMED', 'CHECKED_IN'));
```

- **(a) `EXCLUDE USING gist`** — DB từ chối. Không lock, không retry. Double-booking
  trở thành **bất khả thi về mặt cấu trúc**, kể cả khi code ứng dụng sai.
- **(b) `SELECT ... FOR UPDATE`** trên hàng resource — đúng, đơn giản, nhưng khoá nóng.
  Cần khi một reservation giữ nhiều thiết bị cùng lúc.
- **(c) `SERIALIZABLE` + retry** mã lỗi `40001` — đúng, nhưng phải xử lý retry ở tầng app.

Cài cả ba trong spike, đo p95 dưới 50 request tranh nhau, viết **ADR-002** so sánh.
Ngày 34 của kế hoạch ("vì sao Redis lock không phải nguồn thật") lúc đó tự trả lời.

### T3 · Audit là hạ tầng, không phải tính năng của Tuần 9

Kế hoạch đặt audit ở Ngày 58 — nghĩa là 6 tuần đường ghi viết xong rồi mới nhét audit vào.
Đặt ở Tuần 3, cùng RBAC:

- Một interceptor (Spring AOP `@Around`, hoặc Prisma middleware nếu đi Node)
- Bảng `audit_log` append-only: `actor, action, entity, entity_id, before, after, at, request_id`
- `request_id` nối thẳng vào structured log ở trên

Sau đó **mọi** tính năng tự động có audit. cuongthai.com hiện không có bảng audit nào —
đây là thứ thật sự mới với bạn, nên đừng để nó rơi vào tuần đông việc nhất.

### T3 → T11 · RLS làm lớp phòng thủ thứ hai cho multi-campus

Kế hoạch chặn tenant ở tầng ứng dụng ("tenant filter, permission resolver"). Thêm
Postgres Row-Level Security với `SET LOCAL app.campus_id` làm lớp thứ hai.

Demo giết người ở Tuần 11: **comment dòng filter trong service, chạy lại isolation
test, RLS vẫn chặn.** Câu "chứng minh campus A không đọc được campus B" biến từ lời
hứa thành một lệnh chạy trước mặt giám khảo.

### T4 · Seed/demo data là artifact hạng nhất

`make demo-reset` dựng lại tập dữ liệu biết trước trong dưới 30 giây, kèm ba kịch bản
đặt tên: `happy`, `conflict`, `degraded`.

CLAUDE.md của bạn đã có nguyên một chương về lần seed vỡ trên production (08/08/2026,
đổi enum `CODE` → `CODE_REVIEW`, qua sạch checklist rồi vẫn vỡ). Demo bảo vệ chết vì
dữ liệu nhiều hơn chết vì code.

### T4 · OpenAPI sinh tự động + diff trong CI

Ngày 27 nói "khóa API v1" nhưng không nói khoá **bằng gì**. Sinh spec từ code
(springdoc-openapi), commit vào repo, CI fail nếu diff không được ghi nhận có chủ ý.
Contract regression thành lỗi build thay vì thành bug tuần sau.

### T5 · Perf smoke từ tuần đầu có booking

Một kịch bản k6 hoặc Gatling: 50 VU đặt lịch, chạy nightly, ghi p50/p95. Mục tiêu
"p95 < 500ms" hiện chỉ được kiểm lần đầu ở Ngày 127 — tức 13 ngày trước khi kết thúc.
Regression cần lộ ra khi nó mới một commit tuổi.

### T6 · Job promotion — chốt cơ chế, không chỉ test nó

Ngày 40 test race nhưng không chốt cơ chế. Cụ thể:

- Lấy hàng đợi bằng `SELECT ... FOR UPDATE SKIP LOCKED LIMIT 1`
- Bọc scheduler trong `pg_try_advisory_lock` để chỉ một instance chạy
- Unique key `(reservation_id, waitlist_entry_id)` trên `promotion_attempt` → chạy lại không đôn trùng

`embedQueue.service.ts` của bạn đã ghi đúng vấn đề này trong comment: *"nếu process
chết giữa job, in-flight jobs bị mất."* Lần này giải nó ở tầng DB thay vì tầng process.

### T10 · Fresh-machine test

Clone → `docker compose up` → có dữ liệu → dùng được, **dưới 10 phút, trên máy chưa
từng thấy repo**. Quay màn hình.

CLAUDE.md của bạn đầy sự cố stale build / partial deploy (02/07/2026 route 404 vì
`dist` cũ; 18/08/2026 ảnh musl mang engine glibc, build xanh mà API chết 502 bảy phút).
Bạn hiểu vì sao cái này đáng giá hơn bất kỳ trang tài liệu nào.

### T13 · MQTT — giữ, nhưng tái dùng mô hình danh tính thiết bị bạn đã có

`MakerDevice` đã đúng: `deviceKey` public + `secretHash` bcrypt, plaintext hiện đúng
một lần. Bê nguyên sang LabFlow.

Cái MQTT cho thêm mà `device.gateway.ts` đang phải tự làm tay:

- **LWT (Last Will and Testament)** → online/offline miễn phí, thay vì heartbeat thủ công
- **QoS 1** → at-least-once, ghép với dedup theo sequence number
- **Retained message** → trạng thái cuối có ngay khi dashboard mở

Viết ADR: *"vì sao lần này chọn MQTT chứ không phải WS thô như dự án robot"* — bạn có
bằng chứng thật từ **cả hai** phía, điều gần như không đồ án nào có.

Test lạm dụng (Ngày 89) thêm một ca: **thiết bị A publish vào topic của thiết bị B**
(kiểm ACL của mosquitto).

### T17 · Chọn solver cụ thể ngay bây giờ

Sáu ngày viết constraint solver từ đầu là không đủ.

- Đi Java → **Timefold** (fork OptaPlanner, có Spring Boot starter). Xếp lịch
  phòng/thiết bị đúng sweet spot của nó.
- Đi Python sidecar → **OR-Tools CP-SAT**.

Baseline first-fit (Ngày 114) giữ nguyên — nó là thước đo. KPI so sánh: fulfillment
rate, hard-constraint violations (**phải = 0**), utilization, fairness (Gini hoặc
max-min), runtime theo scale.

---

## Phần 3 — Bản đồ tái dùng: bạn đã có sẵn những gì

| LabFlow cần | Bạn đã có | Trạng thái |
|---|---|---|
| Cổng thiết bị + xác thực | `device.gateway.ts`, `MakerDevice` | Bê mô hình, đổi transport |
| Firmware ESP32 (WiFi, reconnect, telemetry) | `firmware/mini-me-robot` | Bê khung |
| Telemetry time-series + index | `MakerTelemetry` | Bê nguyên |
| Lệnh xuống thiết bị + ACK | `MakerCommand` (PENDING / sentAt / ackedAt / error) | Bê nguyên |
| RAG có citation | `embedQueue.service.ts`, `InterviewKnowledgeChunk` | Tuần 18 rút còn ~2 ngày |
| Cổng LLM + fallback khi thiếu khoá | `llm/gateway.ts` (`modelGoiDuoc`) | Trả lời sẵn "GPU nhà chết thì sao" |
| Trần chi phí AI mềm/cứng | `llm/budget.ts` | **Điểm khác biệt hiếm** |
| Bộ eval chống bịa | `eval/runEval.ts`, `hallucination.test.ts` | Khung cho Ngày 124 |
| Hàng đợi nền idempotent | `embedQueue.service.ts` | Đã hiểu vấn đề |
| Thanh toán + IPN | VNPay, `PaymentTransaction` | Nếu cần đặt cọc / phí phạt |
| CI/CD, Docker, smoke test sau deploy | `deploy-nha.sh`, `ci-lint.yml` | Bê cả bài học |
| **Audit log** | *(chưa có)* | **Viết mới — Tuần 3** |
| **Khoá bi quan / exclusion constraint** | *(chưa có dòng nào)* | **Viết mới — Tuần 2** |

**Kết luận:** Tuần 13–14 và Tuần 18 đang được tính như đất mới. Chúng không phải.
Tiết kiệm được ~2 tuần ở đó — đổ vào Tuần 15–17 (dataset + optimizer), chỗ thật sự khó.

---

## Phần 4 — Lịch 140 ngày không có ngày đệm

20 tuần × 6 ngày = 120 ngày làm + 20 ngày review. **Slack = 0.** Chưa kể bạn đang vận
hành cuongthai.com với người dùng thật, thanh toán thật, và outage thật.

Ba sửa nhỏ:

1. **Lên kế hoạch 17 tuần nội dung trong 20 tuần.** Khai báo Tuần 9 và Tuần 17 là *đàn hồi*:
   đúng lịch thì làm P2, chậm thì hấp thụ.
2. **Mốc là khoảng, không phải điểm.** M1 "cuối T5" → "T5–T6". Milestone trượt là bình
   thường; milestone trượt mà **không được lên kế hoạch** mới là khủng hoảng.
3. **Bảng cắt scope có thứ tự.** Kế hoạch nói "AI Copilot bị cắt đầu tiên" — viết hẳn ra:

   | # | Cắt gì | Hạ xuống mức nào |
   |---|---|---|
   | 1 | AI Copilot | read-only → bỏ hẳn |
   | 2 | Optimizer | chỉ giữ first-fit baseline + phân tích |
   | 3 | ESP32 vật lý | chỉ simulator |
   | 4 | Executive dashboard | chỉ campus dashboard |
   | 5 | PWA / offline | bỏ |

   **Không cắt:** concurrency suite, isolation suite, audit, migration replay, evidence pack.

---

## Phần 5 — Bảo vệ

### Ba cơ chế

- **Quay video demo ở MỖI milestone**, không đợi Ngày 139. Demo trực tiếp chết là chuyện
  thường; video là bảo hiểm, và nó tốn 10 phút mỗi lần.
- **`make evidence` sinh lại toàn bộ evidence pack bằng một lệnh.** Mọi con số trong
  slide phải truy được về lệnh sinh ra nó. Giám khảo hỏi *"làm sao em biết"* — bạn chạy lệnh.
- **Một file `CONTRIBUTION-BOUNDARY.md` trong repo nhóm:** phần nào kế thừa từ prototype
  cá nhân, phần nào nhóm viết, ai viết. Trang 28 đã đúng tinh thần — biến nó thành file
  trong repo, không phải một lời nói lúc bảo vệ.

### 16 câu tự trả lời (bổ sung cho ngân hàng trang 29)

1. Chỉ đúng **một câu SQL**: cái gì khiến double-booking không thể xảy ra, kể cả khi code ứng dụng sai?
2. Nếu tôi xoá dòng kiểm tra quyền trong service, dữ liệu campus B có lộ không? Chứng minh tại chỗ.
3. Job promotion chạy trên hai instance cùng lúc thì sao? Chỉ đúng chỗ trong code chặn nó.
4. Khoảng thời gian của em là `[)` hay `[]`? Đặt 9:00–10:00 và 10:00–11:00 có xung đột không? Vì sao?
5. Client timeout rồi retry: idempotency key nằm ở đâu, TTL bao lâu, hết TTL thì sao?
6. QR bị chụp màn hình gửi cho người khác — cái gì chặn? Chặn ở tầng nào?
7. ESP32 mất điện giữa lúc gửi, bật lại đẩy lại 200 bản ghi cũ — DB có nhân đôi không?
8. Model tốt hơn threshold rule ở metric nào, trên **bao nhiêu ca hỏng thật**?
9. Nếu chỉ có 3 ca hỏng thật, F1 = 0.9 nói lên điều gì?
10. Optimizer chạy quá timeout thì hệ thống trả gì cho người dùng?
11. GPU nhà chết lúc demo: tính năng nào tắt, tính năng nào vẫn chạy? Ai quyết định?
12. Chi phí AI tối đa một ngày là bao nhiêu, chặn ở đâu, ai chặn?
13. Migration chạy nửa chừng rồi lỗi trên production — quy trình của em là gì?
14. Người mới clone repo mất bao lâu để chạy được? Chứng minh trên máy sạch.
15. Phần nào là prototype cá nhân, phần nào nhóm viết? Chỉ ranh giới trong repo.
16. Vì sao modular monolith mà không microservices? **Điều kiện nào** khiến em tách?

---

## Phần 6 — Dùng lại cho academy trên cuongthai.com

Schema của bạn đã có sẵn đường đi: `CodeGroup / CodeTrack / CodeModule / CodeExercise /
CodeProgress`, `Roadmap / RoadmapNode`, `MakerProject` (wiring, firmware modules, build
log, enclosure, notebook), và `ContentProject / ProductionDay / Scene / ContentIdea /
ContentScriptVersion`.

Ba việc gần như không tốn thêm giờ:

1. **20 weekly review → 20 module CodeLab** trong track *"Xây LabFlow từ số 0"*. Bạn đã
   bắt buộc phải viết weekly review; thêm ~1 giờ/tuần để biến thành bài học. Lời giải
   mỗi module = khoảng commit thật.
2. **Node cảm biến ESP32 → một `MakerProject`.** Schema đã có chỗ cho wiring, enclosure,
   firmware modules, build log. Không cần code mới.
3. **Video demo milestone → `ContentProject`.** Sáu milestone = sáu tập.

Lợi ích kép thật sự không phải là nội dung: khi bạn phải **dạy** transaction isolation
cho người khác, bạn sẽ phát hiện chỗ mình chưa hiểu — trước khi giám khảo phát hiện.

---

## Phần 7 — Kỳ 8–9 chưa biết đề

Vì chưa biết đề, đừng tối ưu LabFlow cho một đề cụ thể. Tối ưu để **tách ra được**.

Thiết kế v2 sao cho năm khối này rời ra thành một *platform layer* dùng cho bất kỳ đề nào:

1. **Auth / RBAC / audit / multi-tenant**
2. **Ingestion thiết bị** — registry, credential, telemetry, command + ACK
3. **AI** — gateway, fallback, trần chi phí, RAG có citation, eval harness
4. **Vận hành** — CI, migration replay, observability, seed, smoke test, backup/restore
5. **Bằng chứng** — concurrency suite, isolation suite, load harness, `make evidence`

Nếu đề kỳ 8–9 là một hệ thống hoàn toàn khác, bạn vẫn bắt đầu ở **tuần 4** chứ không
phải tuần 0.

Đó mới là giá trị thật của 20 tuần này — không phải LabFlow, mà là cái nền dưới nó.
