# Khoá học CuongThai (`/courses`) — bản đồ, kiểm kê & việc còn lại

**Cập nhật:** 22/08/2026 · **Nhánh:** `claude/intelligent-cori-pt8zxp`

Tài liệu này là **một chỗ duy nhất** trả lời ba câu: khoá nào ĐÃ có, khoá nào CÒN THIẾU,
và một khoá "đầy đủ" theo chuẩn CuongThai trông như thế nào. Đọc trước khi soạn tiếp —
nó tồn tại để hai phiên khác nhau không viết trùng một khoá.

---

## 1. Nguồn của danh sách "còn thiếu"

Mục **CuongThai** trong Code Lab là danh sách các track do chính CuongThai chọn (đúng
stack mà cuongthai.com đang chạy). Danh sách đó nằm trong mã tại
`scripts/codelab-link-tracks.mjs` (mỗi khoá vừa ở nhóm CuongThai vừa được gắn thêm vào
nhóm chuẩn của nó). Mỗi track ở đó **xứng đáng có một khoá học đầy đủ** trên `/courses`.

> ⚠️ Không truy cập được API prod từ môi trường sandbox (`CONNECT tunnel failed, 403`),
> nên bảng dưới dựng từ mã nguồn. Đối chiếu lại bằng:
> `curl -s https://cuongthai.com/api/v1/code-lab/tracks | jq '.data[] | select(.slug=="cuongthai")'`

---

## 2. Kiểm kê — 25 track CuongThai ↔ khoá học

| # | Track Code Lab | Khoá `/courses` | Trạng thái |
|---|---|---|---|
| 1 | `nodejs-express` | `nodejs` — Node.js | ✅ ĐỦ (19 mục · 112 bài · 1,93 tr ký tự) |
| 2 | `nextjs` + `react` | `nextjs` — Next.js & React | ✅ có (21 mục · 121 bài · **1.181k**) — đã nâng chuẩn 25/08 |
| 3 | `typescript` | `typescript` — TypeScript | ✅ có (17 mục · 84 bài · **910k**) — đã nâng chuẩn 25/08 |
| 4 | `postgresql` | `postgresql` — PostgreSQL | ✅ có (**17 mục · 84 bài · 1,02M**) — đủ 16 chương như lộ trình công bố, 26/08 |
| 5 | `javascript` + `html-css` | `web-foundations` — Nền tảng Lập trình Web | ✅ có (11 mục · 64 bài · **591k**) — đã nâng chuẩn 25/08 |
| 6 | `git` | `git` — Git & GitHub | ✅ **XONG** (14 mục · 63 bài · 889k · TB 14.109) |
| 7 | `linux-bash` | `linux-bash` — Linux & Bash | ✅ **XONG** (13 mục · 69 bài · 1.660k · TB 24.064) |
| 8 | `docker` | `docker` — Docker | ✅ **XONG** (13 mục · 76 bài · 1.584k · TB 20.842) |
| 9 | `redis` | `redis` — Redis | ✅ **XONG** (13 mục · 76 bài · 1.582k · TB 20.819) |
| 10 | `prisma-orm` | `prisma-orm` — Prisma ORM | ✅ **XONG** (13 mục · 76 bài · 1.744k · TB 22.943) |
| 11 | `authentication` | `authentication` — Authentication | ✅ **XONG** (13 mục · 76 bài · 1.538k · TB 20.236) |
| 12 | `nginx` | `nginx` — Nginx | ✅ **XONG** (12 mục · 70 bài · 1.206k · TB 17.224) |
| 13 | `deploy-vps` | `deploy-vps` — Deploy lên VPS | ✅ **XONG** (12 mục · 70 bài · 1.133k · TB 16.190) |
| 14 | `github-actions` | `github-actions` — GitHub Actions | ✅ **XONG** (11 mục · 66 bài · 1.103k · TB 16.720) |
| 15 | `tailwind-css` | `tailwind-css` — Tailwind CSS | ✅ **XONG** (12/12 mục · 66 bài · 962k) |
| 16 | `socket-io` | `socket-io` — Socket.IO | ✅ **XONG** (12/12 mục · 66 bài · 622k · TB 9.419) — *đã vá 24/08, xem §4* |
| 17 | `object-storage-s3` | `object-storage` — Object Storage (Cloudflare R2) | ✅ **XONG** (11 mục · 39 bài · 353k · TB 9.053) |
| 18 | `media-processing` | `media-processing` — Media Processing (Sharp + FFmpeg) | ✅ **XONG** (11 mục · 37 bài · 576k · TB 15.554) |
| 19 | `observability-monitoring` | `observability-monitoring` — Observability & Monitoring (Node.js trên VPS) | ✅ **XONG** (13 mục · 70 bài · 921k · TB 13.152) |
| 20 | `payment-integration` | — | ❌ **THIẾU** |
| 21 | `vnpay` | — | ❌ **THIẾU** |
| 22 | `payos` | — | ❌ **THIẾU** |
| 23 | `domains-dns-tls` | — | ❌ **THIẾU** |
| 24 | `cuongthai-roadmap` | *(lộ trình, không phải khoá)* | — bỏ qua |

**Tổng (cập nhật 25/08/2026): 19 khoá đã có · 4 khoá còn thiếu.**
Còn lại: `payment-integration` · `vnpay` · `payos` · `domains-dns-tls`.
(`cuongthai-roadmap` là lộ trình, không phải khoá.)

⚠️ **18 "đã có" KHÔNG có nghĩa 18 đạt chuẩn.** Chạy `course-depth-audit.mjs`
trên cả 18 ngày 25/08: **14 đạt mọi sàn §3, 4 KHÔNG** — và cả 4 đều nằm trong
nhóm 5 khoá CŨ ở §4 (chỉ `nodejs` đã được nâng lên chuẩn).

**✅ ĐÃ NÂNG XONG cả 4, ngày 25/08/2026.** Đo lại sau khi vá:

| Khoá | TB trước | TB sau | Sơ đồ | Bẫy | Nguồn |
|---|---|---|---|---|---|
| `postgresql` | 9.039 | **11.694** | 20 → 90 | 10 → 96 | 92 |
| `typescript` | 7.720 | **10.831** | 8 → 136 | 20 → 144 | 122 → 152 |
| `web-foundations` | 5.201 | **9.236** | **0 → 128** | 56 → 164 | 74 → 200 |
| `nextjs` | 5.672 | **9.761** | 56 → 252 | 46 → 246 | 184 → 572 |

Cả 4 đều **kiểm TỪNG BÀI**, không chỉ tin bộ đếm tổng: 44/44 · 68/68 · 54/54 ·
101/101 bài lý thuyết đều có ≥1 sơ đồ, ≥1 bẫy, ≥1 nguồn ở **cả hai** khối
`ml-en` và `ml-vi`. Cả ba bộ kiểm (`content-check`, `depth-audit`,
`lang-check`) đều sạch trên toàn bộ 18 khoá.

### ⚠️ Bộ đếm TỔNG của depth-audit che được lỗ thủng TỪNG BÀI

Đây là lần thứ tư trong dự án một bộ kiểm nói "đạt" trong khi vẫn còn lỗ
(xem §Bài học về bộ kiểm). Sàn §3 đếm **cộng dồn** — `sơ đồ ≥ n − quiz` —
nên một khoá có 20 bài mang 5 sơ đồ và 40 bài mang 0 vẫn qua. Với `typescript`
nó báo "✅ đạt mọi sàn" ở lúc chương 10–16 (28 bài) vẫn còn **0 sơ đồ, 0 bẫy**.

**Đo thật ngày 25/08 sau khi 4 khoá trên đã xong** — quét từng bài trên cả 18
khoá bằng cách *import module* (đừng quét regex trên file: `slug:` ở cấp
section sẽ bị đếm nhầm thành bài, cho ra 168 thay vì 85):

**Đo lần đầu: 1.054 bài lý thuyết · 85 bài dưới chuẩn TỪNG BÀI** ở 13 khoá
khác — tất cả đều đang "đạt sàn tổng" (TB 9,1k–24,1k):

| Khoá | Thiếu | | Khoá | Thiếu |
|---|---|---|---|---|
| `nodejs` | 39 | | `media-processing` | 3 |
| `prisma-orm` | 10 | | `authentication` | 2 |
| `socket-io` | 9 | | `github-actions` | 1 |
| `object-storage` | 7 | | `nginx` | 1 |
| `deploy-vps` | 4 | | `redis` | 1 |
| `linux-bash` | 4 | | `tailwind-css` | 1 |
| `docker` | 3 | | | |

**✅ ĐÃ VÁ HẾT 85 bài, ngày 25/08/2026.** Đo lại: **1.054 bài lý thuyết ·
0 bài dưới chuẩn từng-bài**. Cả 18 khoá đều sạch ở cả ba bộ kiểm.

Việc vá phải khớp đúng quy ước markup của TỪNG khoá, vì chúng không giống
nhau — và đây là thứ dễ làm hỏng nhất nếu sinh mã hàng loạt:

| Quy ước | Khoá dùng |
|---|---|
| `<span class="lz-k">` | prisma-orm, socket-io, object-storage, media-processing, docker, redis, linux-bash (đa số) |
| `<div class="lz-k">` | nodejs |
| `lz-layer`/`lz-lname`/`lz-lnote` | deploy-vps, authentication, tailwind-css, nginx, github-actions |
| `<a class="link-card" href=…>CHỮ</a>` | prisma-orm, authentication, nginx, docker, linux-bash, redis |
| `<div class="link-card">` + `lc-ico`/`lc-body`, URL nằm trong `lc-sub` | socket-io, object-storage, media-processing, tailwind-css, github-actions, deploy-vps |
| `<a class="link-card dl">` + `lc-ico`/`lc-body` | nodejs |
| `<div class="pitfall"><p><strong>Trap — …` | đa số |
| `<div class="pitfall"><strong>Pitfall:</strong> …` (không bọc `<p>`) | docker, redis, linux-bash, deploy-vps, nodejs |


### Thứ tự ưu tiên (đã chốt)

Theo thứ tự một người học thật sự cần, và theo mức độ khoá đó được các khoá khác dẫn tới:

1. ✅ **Git & GitHub** — nền tảng, mọi khoá khác giả định đã biết; roadmap trỏ tới 8 lần
2. ✅ **Linux & Bash** — điều kiện cần của deploy, Docker, Nginx
3. ✅ **Docker** — Node.js Ch17 chỉ chạm bề mặt; xứng đáng khoá riêng
4. ✅ **Redis** · 5. ✅ **Prisma ORM** · 6. ✅ **Authentication** — đào sâu ba chương của Node.js
7. ✅ **Nginx** · 8. ✅ **Deploy VPS** · 9. ✅ **GitHub Actions (CI/CD)** — mảng vận hành
10. ~~**Tailwind CSS**~~ ✅ · 11. ~~**Socket.IO**~~ ✅ · ~~**Object Storage**~~ ✅ — mảng sản phẩm
12. ~~**Object Storage (S3/R2)**~~ ✅ · ~~**Media Processing**~~ ✅ · **Observability ← TIẾP THEO**
15. **Payment Integration** (+ **VNPay**, **PayOS**) · 18. **Domains, DNS & TLS**

---

## 3. Chuẩn "đầy đủ" — đo bằng số, không bằng cảm giác

Khoá **Node.js** là chuẩn vàng. Số đo thật của nó:

| Chỉ số | Node.js (chuẩn) | Sàn tối thiểu cho khoá mới |
|---|---|---|
| Số mục (chương) | 19 | ≥ 11 |
| Số bài | 112 | ≥ 60 |
| Ký tự/bài (trung bình) | **17.225** | ≥ 9.000 |
| Sơ đồ (`lz-map`/`lz-flow`/`lz-stack`) | 170 | ≥ 1 mỗi bài lý thuyết |
| Thẻ nguồn học (`link-card`) | 268 | ≥ 2 mỗi bài |
| Hộp bẫy (`pitfall`) | 214 | ≥ 1 mỗi bài |
| Khối code (`<pre>`) | 690 | ≥ 4 mỗi bài |
| Quiz cuối chương | 18 | 1 mỗi chương, 8 câu |

Kiểm bằng **ba** lệnh (đều chạy được ở local, không cần DB) — phải chạy CẢ BA
trước khi đánh dấu một khoá là xong:

```bash
node scripts/course-content-check.mjs ./content/courses/<khoá>.mjs   # cấu trúc: song ngữ, cân thẻ, quiz
node scripts/course-depth-audit.mjs   ./content/courses/<khoá>.mjs   # độ sâu: ký tự/bài, sơ đồ, nguồn
node scripts/course-lang-check.mjs    ./content/courses/<khoá>.mjs   # NGÔN NGỮ: ml-en có thật sự là tiếng Anh không
```

⚠️ **Vì sao có lệnh thứ ba (thêm 24/08/2026).** `course-content-check.mjs` chỉ
**đếm** số khối `ml-en`/`ml-vi` cho khớp — nó không nhìn vào bên trong. Một bài
có khối `ml-en` viết toàn tiếng Việt vẫn qua sạch, và người học chọn tiếng Anh
nhận về tiếng Việt. Rà toàn bộ ngày 24/08 tìm ra **90 bài** như vậy. Bộ dò mới
đo *tỷ lệ đoạn text có dấu tiếng Việt* trong khối `ml-en`, và cố ý bỏ qua ba
vùng mà tiếng Việt là hợp lệ: khối `<pre>` (trích nguyên văn mã/comment của kho),
khối `.out` (kết quả chạy thật), và `lc-sub` (phụ đề thẻ nguồn).

✅ **Đã vá xong 25/08/2026 — tầng nặng về 0 trên cả 18 khoá.** 2.280 đoạn /
~142k ký tự văn xuôi trong 4 khoá: object-storage 16 bài, socket-io 49,
tailwind-css 10, nodejs 15. Số chạy lại sau khi vá:

| | trước | sau |
|---|---|---|
| Nặng (≥20% đoạn ml-en là tiếng Việt) | 90 bài | **0** |
| Nhẹ (<20%) | 36 bài | 36 bài |
| Tổng | 1.285 bài | 1.285 bài |

✅ **Nhãn `Bẫy` đã đổi sang `Trap` 25/08/2026** — 521 lượt trong khối `ml-en`
trên 109 tệp (`Bẫy —` → `Trap —` 499, `Bẫy thật:` → `A real trap:` 21, một
dạng lẻ 1). Khối `ml-vi` giữ nguyên 760 lượt. Cùng lượt: `Một câu.` →
`One sentence.`, `Bài học:` → `Lesson:`, `Nguồn` → `Sources`.

⚠️⚠️ **Đổi nhãn xong thì bộ kiểm nhảy 36 → 93 bài "nhẹ", và đó là bộ kiểm
tự tố cáo mình.** `course-lang-check.mjs` có luật bỏ qua nhãn:

```js
const LABELS = [/^Bẫy\b/, …]          // ← THIẾU NEO $
.filter(t => … && !LABELS.some(re => re.test(t)))
```

Thân bài của hộp pitfall nằm **cùng một đoạn text** với nhãn, nên `/^Bẫy\b/`
khớp cả `Bẫy — <thân bài>` và vứt TRỌN câu khỏi cả tử số lẫn mẫu số. Nó giấu
**66 dòng tiêu đề pitfall vẫn còn tiếng Việt** trong `ml-en` mà bộ đo vẫn báo
sạch — và chúng chỉ lộ ra vì cái nhãn đổi sang `Trap`. Đã neo `$` cho mọi
nhãn và dịch nốt 66 dòng đó. Trong số ấy có một câu lai *"dùng cây quyết định
**such as** một checklist tuần tự"* — dấu vết của chính lỗi khoá-ngắn-ăn-tiền-tố
ở mục trên, sống sót qua ba lượt kiểm.

Bài học, và nó đúng y [[feedback_verify_the_checker_before_the_content]] đã
ghi trong CLAUDE.md: **một luật "bỏ qua" trong bộ kiểm là một chỗ mù có chủ
đích, và chỗ mù nào cũng phải được đo xem nó đang che mất bao nhiêu.** Cách
đo rẻ nhất hoá ra là đổi cái thứ mà luật ấy đang bỏ qua.

Số sau cùng: **nặng 0, nhẹ 32** (media-processing về sạch hẳn), 18/18 khoá
qua `course-content-check`.

✅ **Định danh + comment trong mã ví dụ, xong 25/08/2026.** Quyết định của
người dùng: **định danh tiếng Anh ở CẢ ml-en lẫn ml-vi** (giữ bất biến "hai
bản cùng một mã"), **comment tách ngôn ngữ**, **chuỗi hướng người dùng cuối
giữ tiếng Việt**.

| | |
|---|---|
| Định danh đổi tên | 4.251 lượt + 90 đường dẫn route |
| Comment ml-en dịch | 821 → 2 (2 cái còn lại là *dữ liệu*) |
| ml-en ↔ ml-vi | 1.028/1.062 khối `<pre>` khớp nhau khi bỏ comment + chuỗi |

⚠️⚠️ **BỐN lỗi công cụ, và cái thứ tư suýt không bị phát hiện.**

1. **Khoá ngắn ăn chữ trong comment.** `so → count` biến câu tiếng Anh
   *"…all nine, so you can read…"* thành *"…all nine, count you can read…"*.
   Vá: đổi tên CHỈ ngoài span `tok-comment`/`tok-string`.
2. **Lược đồ Prisma lệch cột sau khi đổi tên.** Thêm bước căn lại ba cột.
   Rồi bước căn lại tự hỏng vì regex đóng `}` khớp phải `@default("{}")` —
   phải neo dấu `}` vào ĐẦU DÒNG.
3. **Khối `.out` nói dối.** Đổi tên trong mã mà quên khối "kết quả chạy
   thật" ⇒ mã ghi `name`, đầu ra ghi `"ten"`; lược đồ ghi `SampleType`,
   `\d` ghi `KieuMau`. 40 khối. Áp cùng bản đồ vào 599 chỗ trong `.out`.
4. **`[A-Za-z0-9_]` LÀ MỘT GIẢ ĐỊNH VỀ NGÔN NGỮ, và nó sai trong kho song
   ngữ.** Lớp ranh giới từ không có chữ có dấu, nên với JS chữ `á` là ranh
   giới ⇒ `kho → store` cắt nát **khoá · khoản · khoảng · khoẻ** (330 chỗ)
   và `nghi → sleep` cắt nát **nghiệp vụ** (6 chỗ). Trong bài đọc thành
   *"chỉ nói chuyện sleepệp vụ"*, *"tài storeản Pro"*, *"'exec' là từ
   storeá quan trọng nhất"*.

**Cái thứ 4 lộ ra thế nào — đáng ghi lại.** Không bộ kiểm nào thấy: HTML
vẫn cân, thẻ vẫn khớp, quiz vẫn hợp lệ, `course-lang-check` vẫn báo nặng 0.
Nó lộ ra vì MỘT dòng lọt vào danh sách comment-chưa-dịch đọc là
`// service — chỉ nói chuyện sleepệp vụ`. Từ đúng một dòng ấy mới viết
`damage.mjs` soát có hệ thống — đối chiếu HEAD với `git show <base>:<file>`
chứ không đoán — và ra 336 chỗ.

⛔ **Luật rút ra: đổi tên hàng loạt trong kho song ngữ thì lớp ranh giới từ
PHẢI gồm chữ cái tiếng Việt có dấu, và phải có một bước SOÁT NGƯỢC đối
chiếu với bản trước khi đổi.** Không có bước ấy thì hỏng câm.

32 bài "nhẹ" còn lại KHÔNG phải lỗi — chúng là **dữ liệu và nhãn cố ý**: tên
riêng tiếng Việt trong ví dụ (`'Đà Nẵng'` ở nodejs 1.x minh hoạ shallow copy),
chính ký tự đang được đếm byte UTF-8 (`'à'` ở nodejs 3.x), khoá R2 không-ASCII
(`logo tết.png` ở object-storage), và các comment tiếng Việt **bên trong khối
`<pre>`** của những khoá mà mã ví dụ dùng định danh tiếng Việt xuyên suốt
(`nguoiDungId`, `thuHoiLuc`, `hetHan` ở authentication/nginx/prisma-orm) —
dịch riêng comment mà giữ định danh sẽ đọc còn kỳ hơn.

⚠️ **Hai lỗi của bộ công cụ đã trả giá để biết** (công cụ ở `/tmp/langfix/`,
không commit — nhưng bài học thì ghi lại):

1. **Thay theo thứ tự khoá trong JSON là sai.** Một khoá ngắn (`KHÔNG phải`)
   ăn mất tiền tố của khoá dài (`KHÔNG phải MQTT / STOMP`), khoá dài thành
   "không khớp", và chỗ đó còn lại một câu **lai nửa Anh nửa Việt** —
   tệ hơn cả để nguyên. Phải **sắp khoá dài trước**. Bắt được vì `apply.mjs`
   in ra danh sách "KHÔNG khớp"; nếu nó im lặng thì 6 chỗ hỏng đã lọt.
2. **Một `git checkout` rẻ hơn một chuỗi vá tay.** Khi tệp đầu tiên hỏng theo
   kiểu trên, chạy lại từ bản sạch với công cụ đã sửa cho ra 0 sót; đi vá
   từng chỗ một thì không có gì bảo đảm đã hết.

Và một lỗi **nội dung** mà đợt rà này tình cờ tìm ra: khối `ml-en` của bài
Socket.IO 11.1 mang một dòng của khoá Tailwind kèm câu tự sửa giữa bài
("Không, wait, đó là kho Tailwind course…"). Khối `ml-vi` cùng chỗ vẫn đúng.
Không bộ kiểm nào bắt được — nó chỉ lộ ra khi có người ĐỌC từng đoạn.

### Luật soạn nội dung (đã trả giá để biết)

- **Song ngữ bắt buộc**: mỗi bài có `<div class="ml-en">…</div>` và `<div class="ml-vi">…</div>`,
  **số khối phải bằng nhau**. `title` và mọi câu/phương án quiz ngăn bằng `|||`.
- **KHÔNG dùng `<svg>`** — bộ lọc `sanitizeHtml()` (`frontend/src/lib/utils.ts`) chỉ cho
  `p br strong em u s code pre h1-h6 ul ol li blockquote a img table thead tbody tr th td span div hr`.
  Thẻ `<svg>` bị **xoá sạch**, sơ đồ biến mất mà không có lỗi nào. Sơ đồ phải vẽ bằng
  hệ class `lz-*` (xem `frontend/src/app/globals.css` vùng "lesson diagrams").
- Trong `content` (template literal): backtick trần → `&#96;`, `${` → `\${`,
  `<` `>` trong code/output → `&lt;` `&gt;`, `&` → `&amp;`.
- Khối `.out` (kết quả chạy thật) đóng bằng `</div>`, KHÔNG phải `</code></pre>`.
- Bài `QUIZ` vẫn **phải có** field `content` (string) — nếu không seeder ném lỗi.
- `shortDescription` < 500 ký tự, dạng `'EN|||VI'`.

### Ảnh bìa

Sinh bằng script, **không sửa tay**, và phải chạy TRONG container backend (cần `sharp`
+ biến `R2_*`):

```bash
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug git --icon git --color F05032 --title "Git & GitHub" --subtitle "Zero → Production"
```
→ `https://media.cuongthai.com/images/course-covers/<slug>.png`

### Seed lên DB

```bash
node scripts/course-seed.mjs --file ./content/courses/<khoá>.mjs --dry     # xem trước
node scripts/course-seed.mjs --file ./content/courses/<khoá>.mjs --apply   # ghi
```
Seeder **idempotent**: chạy lại chỉ cập nhật, không nhân bản, không mất tiến độ học viên.

---

## 4. Việc bổ sung cho 5 khoá CŨ (đã đo, chưa làm xong)

Kết quả `course-depth-audit.mjs` ngày 22/08/2026:

| Khoá | ký tự/bài | Sơ đồ | Bẫy | Thiếu gì |
|---|---|---|---|---|
| `nodejs` | 17.225 | 170 | 214 | ✅ đạt chuẩn. *(Đã vá 1 lỗi quiz — xem dưới)* |
| `postgresql` | 9.039 | 20 | 10 | thêm hộp `pitfall` (mới 10/54 bài) |
| `typescript` | 7.720 | **8** | 20 | **thiếu sơ đồ trầm trọng** — 8 sơ đồ cho 84 bài |
| `nextjs` | 5.672 | 56 | 46 | mỏng: 59 bài < 6k ký tự |
| `web-foundations` | 5.201 | **0** | 56 | **không có sơ đồ nào**; 40 bài < 6k ký tự |

### Socket.IO — đã phát hiện dưới sàn và đã vá (24/08/2026)

| Mốc | Bài | Ký tự | TB/bài | Trạng thái |
|---|---|---|---|---|
| Trước khi vá | 66 | 554k | **8.394** | ❌ dưới sàn 9.000 |
| Sau khi vá | 66 | **622k** | **9.419** | ✅ đạt |

Khoá này đã bị đánh dấu ✅ XONG ở phiên trước mà không chạy `course-depth-audit.mjs`
lần cuối. Bài học: **chạy CẢ HAI bộ kiểm trước khi đánh dấu xong**, không chỉ
`course-content-check.mjs` — cái đầu kiểm cấu trúc, cái sau mới kiểm độ sâu.

**Đã làm gì để vá** (+68k, không thêm bài nào — thêm bài làm mẫu số tăng theo nên
*hạ* trung bình; phải mở rộng bài sẵn có):

1. Viết lại `io-5-2-adapter-api` 5.637 → 21.457. Bài mỏng nhất khoá, và nội dung cũ
   trộn tiếng Việt trong khối `ml-en`. Bản mới: bảng bốn cặp method local-vs-cluster,
   vì sao `RemoteSocket` không có `.on()` (listener không serialize được qua tiến
   trình), ngữ nghĩa all-or-nothing của `serverSideEmit`, và `disconnectSockets` như
   nửa thứ hai của "đăng xuất mọi nơi" mà thu hồi token không làm được.
2. Viết lại `io-5-5-alt` 7.449 → 20.700. Bốn adapter kèm điều kiện chọn từng cái —
   nổi bật là `cluster-adapter` cho triển khai một máy, thứ hầu hết app nhỏ nên dùng
   và hầu hết bỏ qua để với tới Redis theo phản xạ.
3. Viết lại `io-1-5-state` 7.551 → 19.550. Ba pattern khôi phục trạng thái sau
   reconnect, và pattern nào lấp được *khoảng trống thông điệp* chứ không chỉ trạng thái.
4. Viết lại `content` của **cả 12 bài quiz** (~500 → ~2.800 mỗi bài). Chúng vốn chỉ có
   một dòng tiêu đề, **và khối `ml-en` chứa văn xuôi tiếng Việt** — bộ kiểm cấu trúc
   không bắt được vì nó chỉ đếm số khối. Bản mới là tóm tắt song ngữ thật "chương này
   đã dựng được gì" trước khi vào câu hỏi.

**Đã sửa:** `nodejs-1-6-quiz` phương án `user.name = "Bình"` bị bộ kiểm bắt là thiếu `|||`
(dấu tiếng Việt trong một phương án thuần code). Đổi thành `"Binh"` — cả 5 khoá nay
**qua sạch** `course-content-check.mjs`.

---

## 5. Nhật ký tiến độ

| Ngày | Việc | Kết quả |
|---|---|---|
| 22/08/2026 | Kiểm kê 5 khoá cũ + vá lỗi quiz Node.js | 5/5 khoá qua bộ kiểm cấu trúc |
| 22/08/2026 | Thêm `scripts/course-depth-audit.mjs` | Đo được độ sâu, không còn đoán |
| 22/08/2026 | `course-content-check.mjs` thoát khác 0 khi lỗi | Hết cảnh `check && commit` commit đè lên lỗi |
| 22/08/2026 | **Khoá Git & GitHub — HOÀN THÀNH** | 63 bài · 889k ký tự · TB 14.109 · đạt mọi sàn |
| 22/08/2026 | Khoá Linux & Bash — Mục 0, Chương 1, 2 | 14 bài · 262k ký tự |
| 22/08/2026 | `course-content-check.mjs` bắt gạch chéo ngược đơn | Đọc MÃ NGUỒN; tìm ra 2 lỗi thật, 1 trong khoá Node.js đã ship |
| 22/08/2026 | Khoá Linux & Bash — Chương 3 (văn bản/ống dẫn), Chương 4 (quyền) | 27 bài · 547k ký tự |
| 22/08/2026 | Khoá Linux & Bash — Chương 5 (tiến trình), 6 (biến/nháy), 7 (script) | **44 bài · 933k ký tự · TB 21.197 · đạt mọi sàn** |
| 22/08/2026 | Khoá Linux & Bash — Chương 8 (PATH), 9 (mạng), 10 (đĩa/gói/log) | 59 bài · 1.319k ký tự · TB 22.349 |
| 22/08/2026 | Khoá Linux & Bash — Chương 11 (systemd/cron/gia cố) | **63 bài · 1.478k ký tự · TB 23.464 · 158 sơ đồ · đạt mọi sàn** |
| 22/08/2026 | **Khoá Linux & Bash — HOÀN THÀNH** (Chương 12, chẩn đoán) | **69 bài · 1.660k ký tự · TB 24.064 · 182 sơ đồ · 424 nguồn · 130 bẫy · đạt mọi sàn** |
| 22/08/2026 | Vá 2 lỗi ngầm lọt qua cả hai checker | `\${REF}` bị thoát → 172 thẻ thực hành 404 (Docker + Linux&Bash); quiz sai hình dạng → seeder bỏ qua câm |
| 22/08/2026 | Khoá Docker — Mục 0 → Chương 6 | 40 bài · 895k ký tự · 86 sơ đồ |
| 22/08/2026 | Khoá Docker — Chương 7 (dữ liệu), 8 (mạng), 9 (Compose) | 58 bài · 1.227k ký tự · 124 sơ đồ |
| 22/08/2026 | Khoá Docker — Chương 10 (stack thật), 11 (production) | 70 bài · 1.467k ký tự · 148 sơ đồ |
| 22/08/2026 | **Khoá Docker — HOÀN THÀNH** (Chương 12, chẩn đoán + kết khoá) | **76 bài · 1.584k ký tự · TB 20.842 · 162 sơ đồ · 454 nguồn · 130 bẫy · 13 quiz · đạt mọi sàn** |
| 22/08/2026 | Khoá Redis — Mục 0 → Chương 3 | 28 bài · 563k ký tự · 68 sơ đồ |
| 23/08/2026 | Khoá Redis — Chương 4 (list/set/zset), 5 (hash + HEXPIRE) | 40 bài · 818k ký tự · 100 sơ đồ |
| 23/08/2026 | Khoá Redis — Chương 6 (bộ đệm), 7 (nguyên tử), 8 (Pub/Sub & Stream) | 52 bài · 1.077k ký tự · 132 sơ đồ |
| 23/08/2026 | Khoá Redis — Chương 9 (bộ nhớ/lưu trữ), 10 (vận hành/ACL), 11 (mở rộng) | 70 bài · 1.457k ký tự · 182 sơ đồ |
| 23/08/2026 | **Khoá Redis — HOÀN THÀNH** (Chương 12, chẩn đoán + kết khoá) | **76 bài · 1.582k ký tự · TB 20.819 · 196 sơ đồ · 386 nguồn · 124 bẫy · 13 quiz · đạt mọi sàn** |
| 23/08/2026 | Khoá Prisma ORM — Mục 0 → Chương 8 | 58 bài · 1.196k ký tự · 138 sơ đồ |
| 23/08/2026 | Khoá Prisma ORM — Chương 9 (hiệu năng), 10 (cửa thoát hiểm) | 70 bài · 1.483k ký tự · 186 sơ đồ |
| 23/08/2026 | Khoá Prisma ORM — Chương 11 (production) | 76 bài · 1.621k ký tự · 212 sơ đồ |
| 23/08/2026 | **Khoá Prisma ORM — HOÀN THÀNH** (Chương 12, chẩn đoán + thi cuối) | **76 bài · 1.744k ký tự · TB 22.943 · 234 sơ đồ · 650 nguồn · 114 bẫy · 13 quiz · đạt mọi sàn** |
| 23/08/2026 | Khoá Authentication — Mục 0 → Chương 5 | 34 bài · 696k ký tự · 138 sơ đồ |
| 23/08/2026 | Khoá Authentication — Chương 6 (vòng đời tài khoản), 7 (MFA & passkey) | 46 bài · 966k ký tự · 184 sơ đồ |
| 23/08/2026 | Khoá Authentication — Chương 8 (OAuth/OIDC), 9 (phân quyền) | 58 bài · 1.210k ký tự · 230 sơ đồ |
| 23/08/2026 | Khoá Authentication — Chương 10 (tấn công), 11 (vận hành) | 70 bài · 1.434k ký tự · 278 sơ đồ |
| 23/08/2026 | **Khoá Authentication — HOÀN THÀNH** (Chương 12, chẩn đoán + thi cuối) | **76 bài · 1.538k ký tự · TB 20.236 · 302 sơ đồ · 644 nguồn · 122 bẫy · 13 quiz · đạt mọi sàn** |
| 23/08/2026 | Khoá Nginx — Mục 0 → Chương 9 | 58 bài · 966k ký tự · 184 sơ đồ |
| 23/08/2026 | Khoá Nginx — Chương 10 (log & quan sát) | 64 bài · 1.090k ký tự · 200 sơ đồ |
| 23/08/2026 | **Khoá Nginx — HOÀN THÀNH** (Chương 11, chẩn đoán + thi cuối) | **70 bài · 1.206k ký tự · TB 17.224 · 216 sơ đồ · 562 nguồn · 118 bẫy · 12 quiz · đạt mọi sàn** |


### Khoá Linux & Bash — XONG (22/08/2026)

13 mục (Mục 0 + Chương 1–12), **69 bài · 1.660k ký tự · TB 24.064 ký tự/bài ·
182 sơ đồ `lz-*` · 424 thẻ nguồn học · 130 bẫy · 1.022 khối code ·
568 khối output · 12 quiz**. Qua `course-content-check.mjs` và
`course-depth-audit.mjs`. Còn hai bước phải chạy ở máy nhà — xem §6.

### Khoá Docker — XONG (22/08/2026)

13 mục (Mục 0 + Chương 1–12), **76 bài · 1.584k ký tự · TB 20.842 ký tự/bài ·
162 sơ đồ `lz-*` · 454 thẻ nguồn học · 130 bẫy · 852 khối code ·
618 khối output · 13 quiz · 126 liên kết thực hành Code Lab**.

Đường đi: mô hình tinh thần (namespace/lớp/OCI) → chạy container → ảnh &
registry → Dockerfile → cache → ảnh nhỏ & an toàn → dữ liệu → mạng →
Compose → một stack năm dịch vụ chạy thật → production → chẩn đoán.

Bốn sự cố có thật của chính kho này được dệt vào bài học thay vì kể ngoài lề:
engine Prisma glibc trong ảnh musl (7 phút 502), `dist/` cũ khiến router GIF
404, cache dựng 7,6GB làm đầy đĩa chứa Postgres, và một healthcheck gọi `wget`
trong ảnh không có `wget`. Cả bốn đều **xanh lúc dựng, xanh lúc đẩy, hỏng trên
production** — đó là luận điểm xuyên suốt khoá.

Còn hai bước phải chạy ở máy nhà — xem §6.

### Khoá Redis — XONG (23/08/2026)

13 mục (Mục 0 + Chương 1–12), **76 bài · 1.582k ký tự · TB 20.819 ký tự/bài ·
196 sơ đồ `lz-*` · 386 thẻ nguồn học · 124 bẫy · 574 khối code ·
460 khối output · 13 quiz · 126 liên kết thực hành Code Lab**.

Đường đi: mô hình thực thi (một luồng, RESP, pipeline) → khoá & TTL → chuỗi,
bitmap, HyperLogLog → list/set/sorted set → hash & mô hình hoá đối tượng →
làm bộ đệm cho đúng → tính nguyên tử (MULTI/WATCH/Lua/Function) → Pub/Sub &
Stream → bộ nhớ, đẩy khoá, lưu lâu dài → vận hành & ACL → nhân bản, Sentinel,
Cluster → chẩn đoán.

**KHÔNG trùng Node.js Chương 12** (Redis, 125k ký tự): khoá đó dạy DÙNG Redis
từ phía ứng dụng Node; khoá này dạy CHÍNH Redis. Luận điểm xuyên suốt: gần
như mọi sự cố Redis đều suy ra từ đúng một sự thật — *một luồng, mỗi lúc một
lệnh* — và Redis sẽ làm chính xác điều bạn bảo, kể cả những điều có sức phá
huỷ, vì nó không có ràng buộc, không có quay lui và không có lược đồ.

### Khoá Prisma ORM — XONG (23/08/2026)

13 mục (Mục 0 + Chương 1–12), **76 bài · 1.744k ký tự · TB 22.943 ký tự/bài ·
234 sơ đồ `lz-*` · 650 thẻ nguồn học · 114 bẫy · 992 khối code ·
566 khối output · 13 quiz · 126 liên kết thực hành Code Lab**.

Đường đi: ORM giải bài toán gì → ngôn ngữ lược đồ → quan hệ (hai phía) →
đọc/ghi và ghi lồng nhau → truy vấn sâu → migration → giao dịch & tương tranh
→ hệ kiểu được sinh ra → hiệu năng (đo trước, N+1, chỉ mục, pool, cache) →
cửa thoát hiểm (SQL thô, TypedSQL, `$extends`) → đưa lên production (engine
trong ảnh, Dockerfile, cửa sổ deploy, seed/nạp bù, SIGTERM) → chẩn đoán.

**KHÔNG trùng Node.js Chương 7** (dùng Prisma như phương tiện đưa Notes API
sang PostgreSQL) và **KHÔNG trùng khoá PostgreSQL** (dạy SQL và chính cơ sở
dữ liệu). Luận điểm xuyên suốt: phần lớn "lỗi Prisma" thật ra là lỗi cơ sở
dữ liệu đang mặc bộ đồ TypeScript — và cái tín hiệu **xanh lúc dựng, xanh lúc
đẩy, hỏng trên production** lặp lại ở đủ năm sự cố có thật của kho này được
dệt vào bài học: engine musl/glibc (7 phút 502), migration `add_music_and_profile`
trùng tên ràng buộc làm `migrate dev` hỏng vĩnh viễn (P3006), enum
`CODE` → `CODE_REVIEW` qua sạch checklist rồi vỡ seed trên production, hai
đường ống deploy đua nhau tới lỗi 500 feed 03/07, và cache dựng làm đầy đĩa
chứa Postgres.

Còn hai bước phải chạy ở máy nhà — xem §6.

### Khoá Authentication — XONG (23/08/2026)

13 mục · 76 bài · **1.538k ký tự** · TB 20.236 · 302 sơ đồ · 644 nguồn học ·
122 bẫy · 442 khối code · 220 khối output · 13 quiz · 0 lỗi · đạt mọi sàn §3.

Đường đi: giao thức quen thuộc và ba bài toán → tín vật cùng các nguyên thuỷ
(ngẫu nhiên, so sánh hằng thời gian, băm với chữ ký) → mật khẩu (Argon2id,
danh sách rò rỉ, nâng tham số) → phiên và cookie → JWT nhìn từ bên trong →
refresh, xoay vòng, thu hồi → vòng đời tài khoản (đăng ký, xác minh, đặt lại,
dò tài khoản, đổi email, xoá) → yếu tố thứ hai và passkey → OAuth 2.1 và OIDC
→ mô hình phân quyền (RBAC, ABAC/ReBAC, nhiều tenant) → các cú tấn công xếp
theo tần suất thật → vận hành (bí mật, xoay khoá, trần tần suất, kiểm toán,
giám sát) → chẩn đoán.

**KHÔNG trùng Node.js Chương 8 và 9** (dùng JWT như phương tiện để dựng API
Notes). Toàn bộ output là ĐO THẬT trong sandbox, không bịa: sáu vector kiểm
thử chính thức của RFC 6238 khớp bằng ba mươi dòng TOTP viết tay · ràng buộc
origin của WebAuthn chạy trên ba tình huống (chấp nhận, chuyển tiếp, trang
giả) · rò rỉ thời gian khi dò tài khoản 0,001 ms so với 106 ms · PostgreSQL
16.13 dựng tại chỗ để chứng minh Row-Level Security cùng CẢ HAI đường nó âm
thầm bị bỏ qua · cú đầu độc header Host gửi bằng socket thô · một cuộc đua
TOCTOU đổi được một mã dùng-một-lần tới năm lần · xoay khoá bốn giai đoạn kèm
cả hai kiểu hỏng · và bốn phép đo trên chính kho mã này (939 endpoint và độ
phủ middleware, 273/43/6 hành vi tham chiếu, 2.056 gói phụ thuộc, 155 biến
môi trường trong đó 84 cái không có tài liệu).

Còn hai bước phải chạy ở máy nhà — xem §6.

---

### Khoá Nginx — XONG (23/08/2026)

12 mục (Mục 0 + Chương 1–11), **70 bài · 1.206k ký tự** · TB 17.224 ·
216 sơ đồ `lz-*` · 562 thẻ nguồn học · 118 bẫy · 158 khối code ·
268 khối output · 12 quiz · 0 lỗi · đạt mọi sàn §3.

Đường đi: một bản dựng chạy được → request tìm ra khối `server` thế nào →
`location` nào thắng → reverse proxy → tệp tĩnh → bộ đệm → TLS và HTTP/2 →
giới hạn (tốc độ, kết nối, kích thước) → viết lại và ánh xạ → cân bằng tải →
log và quan sát → chẩn đoán.

**Toàn bộ khối output là ĐO THẬT** trên nginx 1.24.0 (`--with-debug`),
OpenSSL 3.0.13 và các upstream Node dựng trong sandbox — không có khối nào
chép từ tài liệu. Vài phép đo đáng nhớ: thử **cả 158 bộ mã hoá** từng cái một
(khối mặc định nhận 21, trong đó 12 cái KHÔNG có forward secrecy) · hồ sơ
riêng tư của một người dùng bị bộ đệm phục vụ cho khách vãng lai · `strace`
đếm 900 syscall `write()` gom lại còn **1** nhờ `buffer=64k`, trong khi đồng
hồ bấm giờ **không thấy khác biệt nào** giữa bật và tắt log · một request tầm
thường ở mức `debug` tốn 5.913 byte (gấp 52 lần một dòng access log) ·
`accepts 42 / handled 3` cho thấy 39 kết nối bị vứt mà access log **không hề
có dấu vết**.

**Ba lỗi của chính tôi được giữ lại trong bài** thay vì lặng lẽ sửa, vì chúng
là lý lẽ tốt hơn mọi lời khẳng định: một phép đo gzip bắn cùng một request 200
lần nên chỉ đo bộ nén (đo lại bằng lưu lượng đa dạng) · một phép thử trả về
hai tệp log rỗng trông như kết quả sạch, thật ra nginx chưa từng khởi động vì
trùng cổng · và **cấu hình production ở Bài 11.5 dính đúng cái bẫy mà Bài 11.3
vừa cảnh báo** — `location /tinh/` khai `add_header` riêng nên mất HSTS và
X-Frame-Options, chỉ còn 1/3 header bảo mật, và thứ bắt được nó không phải
kiến thức mà là một vòng lặp đi đếm header trên từng tuyến.

Còn hai bước phải chạy ở máy nhà — xem §6.

### 24/08/2026 — Deploy VPS (12 mục · 70 bài · 1.133k · TB 16.190)

Khoá thứ tám, và là khoá mà mọi số đo đến từ **hạ tầng thật dựng trong hộp
cát**, không phải từ tài liệu: hai con sshd (2222 mặc định, 2223 đã siết),
PostgreSQL 16.13 ở cổng 5433 với bảng 400.170 dòng, dockerd, ba con nginx
1.24.0 cho ba bộ đo khác nhau, một cgroup v1 memory có giới hạn thật, một
tệp swap 512 MB bật thật, và bốn hệ tệp ext4 loopback cố tình làm nhỏ.

186 sơ đồ · 510 nguồn · 130 bẫy · 254 khối code · **344 khối output đo thật**
· 11 quiz.

Cái sợi chỉ chạy suốt 12 mục là **phép kiểm nói CÓ trong khi hệ thống SAI**,
và mỗi lần nó xuất hiện đều kèm một phép đo:

- chốt kiểm sức khoẻ trả 200 trong khi MỌI endpoint trả 500, vì mã đã lùi lên
  một lược đồ đã đi tiếp (6.2)
- cú lùi 140 ms chạy hoàn hảo trong khi người dùng nhận bản cũ suốt **5 phút**
  vì một bộ đệm proxy (6.5)
- lời hỏi xác nhận **thoát 0 mà không deploy** khi không có terminal — đúng
  hành vi CLAUDE.md của kho này ghi lại (7.3)
- phép kiểm sẵn sàng đốt **3.022 ms** để báo sai là app chết, trong khi app
  chạy tốt, rồi thoát 0 (7.4)
- bản dựng **thoát 0** trong khi cơ sở dữ liệu bị OOM giết (8.2)
- load average **0,10** trên một cái máy bão hoà 100% từ giây số 0 (9.1)
- `psql` phục hồi một bản dump cắt cụt với **mã thoát 0** và để lại một bảng
  400.170 dòng **RỖNG**; `pg_restore --list` cũng thoát 0 (10.3)
- và một phép kiểm nghiệm thu **ĐẠT vì nó bị chĩa vào một cái 404** (11.5)

Ba con bọ tìm được trong chính công trình của tôi, và cả ba đều được GIỮ LẠI
trong bài vì chúng dạy tốt hơn một lời khẳng định: cái trap dọn dẹp khôi phục
symlink mà **không khởi động lại tiến trình**, để website nằm ở bản HỎNG
(7.5) · nginx lộ `Server: nginx/1.24.0 (Ubuntu)` · và handler lỗi trả
`x-ban: v1` cho bất cứ ai kích được một cú 500 (11.5).

Hai phép đo THẤT BẠI cũng được giữ nguyên kèm lý do phép đo không nhìn thấy:
định đo cạn inode nhưng đo trúng cạn KHỐI (32.394 tệp 1 byte = 127 MB, khuếch
đại ~4.000 lần — 8.4), và đọc `memory.stat` SAU khi tiến trình thoát nên thấy
`swap 0` rồi suýt kết luận swap không được dùng (8.3).

Còn hai bước phải chạy ở máy nhà — xem §6.

### 24/08/2026 — GitHub Actions (11 mục · 66 bài · 1.103k · TB 16.720)

Khoá thứ chín và là **khoá được đo trên chính CI của kho này**. Không có
lời khẳng định nào không có số: 2.343 lượt chạy quan sát, 32 workflow file
trong `.github/workflows/`, sổ sự cố của CLAUDE.md dâng nguyên vẹn 6 ngày
tháng làm bằng chứng cho Chương 10, ba lần giảm cache đo trực tiếp qua log
`ACTIONS_STEP_DEBUG=true`, một tỉ lệ ghim SHA đối lập ghim nhánh được đếm
đúng bằng script mới `scripts/soat-actions.sh`.

228 sơ đồ · 526 nguồn · 122 bẫy · 130 khối code · **254 khối output đo thật**
· 11 quiz.

Cái sợi chỉ chạy suốt 11 mục là **cú tự-vá khớp với thông báo lỗi thường
sai**, và mỗi lần nó xuất hiện đều kèm một số đo:

- lệnh SET -E trong khối `run: |` qua ống dẫn LỌC (`| grep`) trả 0 dù lệnh
  đầu ống HỎNG — mất tín hiệu (2.4)
- `grep -c` trong `scripts/soat-actions.sh` đếm ĐÚNG số dòng, SAI số khớp —
  chín workflow có hai bí mật cùng dòng bị đếm mất chín (6.5)
- V8 heap qua `| tail` trả 0 thay vì 8240 MB thật ở Node 22 (8.1) — được
  đối chiếu với lời tuyên bố dân gian "4GB" và giữ lại như một cú phản bác
- `pkill -f "next start"` trả **exit 0** trong khi cổng 3000 vẫn bận, vì
  Node ghi đè argv thành `next-server` (10.4)
- một smoke test **6 lần chạy 6 lần hỏng** trong ~25s mỗi deploy nhưng bị
  `|| sleep 5` nuốt — trong khi kho không hề biết (10.3)
- cú `docker build .` không có `-f Dockerfile.backend` trong `deploy-nha.sh`
  đi qua alpine (musl) với engine Prisma debian (glibc) → **7 phút 502**
  ở production (9.2)
- một cache path `node_modules/.cache` không bao giờ tồn tại vì `tsc` không
  tạo nó — thao tác cache dâng miễn phí xanh mãi mãi (5.3)

Bốn con bọ tìm được trong chính công trình của tôi được GIỮ LẠI:
undercount ở lệnh `grep -c` khiến bảng bí mật in ra nhầm 32 (thật 41);
cửa sổ 16-dòng ban đầu báo 9 bản SSH khác nhau (đúng: 9 bản trong 2 phiên
bản); tỉ số nén 64× vô lý ở tests 5000 file đồng nhất được đo lại còn
2,3-2,9× ở nội dung thật; và dự đoán V8 4GB bị phủ nhận bởi 8240 MB đo thật.

Còn hai bước phải chạy ở máy nhà — xem §6.

---

### 25/08/2026 — Observability & Monitoring (13 mục · 70 bài · 921k · TB 13.152)

Khoá thứ 19. Luật tự đặt cho khoá này: **không khẳng định gì về chi phí hay
hành vi mà không có một phép đo**. Mười tám phép đo chạy thật trong sandbox
(Node 22.22.2), mọi script đều nằm trong chính bài dùng nó — xem bài 12.1 cho
bảng đầy đủ. Tám kết quả lật ngược một niềm tin phổ biến:

| Đo | Kết quả | Niềm tin bị lật |
|---|---|---|
| dựng một dòng log | 15 / 19 / 571 / **1310** ns | phần đắt nhất là `new Date().toISOString()` (~740 ns), KHÔNG phải JSON |
| ghi một dòng log | file 2866 · **ống 4985** · /dev/null 2303 ns | tổng thật ~6.300 ns/dòng, không phải 1.310 |
| bên đọc ống chậm | RSS 43 → **122 MB**, 47.874.720 byte kẹt trong đệm | trình thu log chậm là RÒ RỈ BỘ NHỚ TRONG APP |
| AsyncLocalStorage | run() **677 ns**/request · getStore() không đo được | "ALS chậm" là lịch sử trước Node 16 |
| ô histogram mặc định | p95 thật 27,6ms → báo **46,6ms (sai 69%)** | mặc định của prom-client sai NGHIÊM TRỌNG và im lặng |
| CPU% với Node bị chặn | chặn 200ms/vòng → **CPU toàn máy 23,8%** | CPU% không phân biệt nổi 50ms với 200ms; p50 độ trễ giữ nguyên 1,1ms |
| heap so với RSS | heapUsed 4→75→**4** MB · rss 43→150→**140** MB | đồ thị RSS chỉ-lên là BÌNH THƯỜNG; chữ ký rò rỉ là ĐÁY răng cưa |
| lấy mẫu đầu 1% | cần **299 lần** xảy ra để có 95% cơ hội bắt được một cái | lấy mẫu đầu vứt đi đúng những cú hỏng hiếm đáng tìm |

**Sáu khiếm khuyết CÓ THẬT tìm được trong kho, bằng cách đọc mã** (mỗi cái
kèm file và số dòng trong bài tương ứng — bài 12.2 xếp chúng thành kế hoạch
sửa "giờ 1–2"):

1. `req.id` ghi một lần ở `src/index.ts:225`, **đọc không lần nào** — không
   lời gọi logger nào kèm nó, kể cả `errorHandler.ts`. Người dùng gửi ảnh
   chụp header `X-Request-ID` và không truy vấn nào tìm ra (bài 3.1)
2. `nginx.conf` chuyển tiếp 4 header nhưng `grep -c X-Request-ID` = **0**, nên
   nhánh "tôn trọng id đến từ ngoài" của middleware là **mã chết** trên
   production. Mà nginx vốn đã có sẵn `$request_id` và `log_format` cũng
   không dùng (bài 3.3)
3. `healthcheck` trong `docker-compose.yml` gọi **`/health`** (có kiểm cơ sở
   dữ liệu) chứ không gọi `/health/live` (tồn tại, không ai dùng) ⇒ một cú
   nấc 20 giây của Postgres khiến Docker giết một tiến trình Node hoàn toàn
   khoẻ mạnh ở giây thứ 30 (bài 8.2)
4. **Không một khối `logging:` nào** trong cả hai file compose (7 dịch vụ,
   0 giới hạn), bù lại bằng một cron hằng tuần `truncate` log quá 200 MB —
   trên đúng cái đĩa chứa Postgres (bài 2.2)
5. `LOG_PIPELINE.md` nâng `msg` lên làm **nhãn Loki**, mà `src/` phát ra
   **325** giá trị msg khác nhau ⇒ 28 luồng thành **9.100** (bài 2.4).
   Cũng lộ ra: danh mục sự kiện trong tài liệu ghi 124 trên tổng 325
6. `connection_limit` **chưa từng được đặt** (Prisma mặc định 9 trên VPS
   4 nhân) còn `max_connections` chỉ xuất hiện trong `docker-compose.yml`
   bên trong một dòng **CHÚ THÍCH** (Postgres mặc định 100). Chín trên một
   trăm (bài 5.4)

**Bài học về bộ kiểm, lần thứ năm.** Hai lớp lỗi tái diễn suốt khoá này mà
`course-content-check` KHÔNG bắt được vì file không import nổi trước khi tới
được bộ kiểm: **backtick trần** bọc định danh trong văn xuôi (`` `waiting` ``,
`` `version` ``, `` `time() - ...` ``) và **`${...}` chưa escape** trong ví dụ
YAML/Grafana (`${GLITCHTIP_SECRET}`, `${__value.raw}`). Đã gia cố script chèn
bài để tự thoát cả hai trước khi ghi. Cùng với `</code></pre>` đóng nhầm khối
`<div class="out">` (2 lần) và `|||` gõ thành `|///` (3 lần), đây là bốn lớp
lỗi mà một khoá 70 bài sinh ra đủ nhiều để đáng tự động hoá.

**Cũng sửa một sai của chính bộ kiểm từng-bài của tôi:** `perlesson.mjs` đòi
**≥2 thẻ nguồn MỖI KHỐI** trong khi §3 chỉ đòi **≥2 mỗi BÀI** (tức ≥1 mỗi
khối). Với cái bar sai đó nó báo 6 khoá "dưới chuẩn" (185 bài) — tất cả đều
đạt chuẩn thật. Đã sửa; chạy lại: **1.111 bài lý thuyết, 19/19 khoá đạt.**

Ba bộ kiểm, cả 19 khoá: content-check ✅ 0 lỗi · depth-audit ✅ đạt mọi sàn ·
lang-check 0 "nặng" trên 1.355 bài. Khoá này góp 1 hit "nhẹ": bài 1.1 trích
cố ý một tên file tiếng Việt (`báo-cáo.pdf`) trong ví dụ về việc KHÔNG được
nội suy dữ liệu vào `msg` — dương tính giả, giữ nguyên.

Còn hai bước phải chạy ở máy nhà — xem §6.

---

### 25/08/2026 — Bản đồ video YouTube (15/15 khoá · 804 bài) — XONG

Khoá `nodejs`, `nextjs`, `typescript`, `postgresql` đã có `content/course-videos/<slug>.mjs`
từ trước. 15 khoá còn lại thì chưa — **804 bài lý thuyết không có video**. Nay **đủ cả
15 khoá · 804 bài**, mỗi bài một video RIÊNG (trong cùng một khoá, không bài nào dùng
lại video của bài khác):

| Khoá | Bài có video | Video khác nhau | Đợt |
|---|---|---|---|
| `observability-monitoring` | 57/57 | 57 | đợt 1 |
| `git` | 50/50 | 50 | đợt 1 |
| `linux-bash` | 57/57 | 57 | đợt 1 |
| `docker` | 63/63 | 63 | đợt 1 |
| `nginx` | 58/58 | 58 | đợt 1 |
| `deploy-vps` | 59/59 | 59 | đợt 1 |
| `github-actions` | 55/55 | 55 | đợt 2 |
| `redis` | 63/63 | 63 | đợt 2 |
| `prisma-orm` | 63/63 | 63 | đợt 2 |
| `authentication` | 63/63 | 63 | đợt 2 |
| `socket-io` | 54/54 | 54 | đợt 2 |
| `tailwind-css` | 54/54 | 54 | đợt 2 |
| `web-foundations` | 54/54 | 54 | đợt 2 |
| `object-storage` | 28/28 | 28 | đợt 2 |
| `media-processing` | 26/26 | 26 | đợt 2 |

⛔ **Đợt 1 dừng ở 6 khoá vì hết hạn mức WebSearch của phiên** (200/200 lượt). Mọi id đều
lấy từ một lượt tìm kiếm SỐNG, không lấy từ trí nhớ — nên hết lượt tìm là hết cách làm
tiếp mà vẫn giữ được độ chính xác.

✅ **Đợt 2 (9 khoá · 460 bài) làm hết trong ~93 lượt tìm**, tức **~6-16 lượt/khoá** thay
vì ~33. Nhịp đã tối ưu: gộp 4 truy vấn CHỦ ĐỀ RỘNG chạy song song một lượt, mỗi lượt trả
~10 kết quả, rồi gán cả một chương từ một rổ kết quả — thay vì tìm riêng cho từng bài.
Khoá 63 bài chỉ cần ~12 lượt. Chép lại nhịp này nếu phải làm thêm khoá mới.

⚠️ **Ghép bài ↔ video không phải lúc nào cũng khít.** Vài bài rất riêng của kho này
(ví dụ `ga-10-4-diet-cong` "diệt tiến trình theo cổng", `mp-2-1-svg` "SVG chạy được
JavaScript", `os-8-2-sipper` "ghi kép trong lúc di trú") **không có video nào trên
YouTube nói đúng chuyện đó** — chỗ ấy gán video gần nghĩa nhất trong cùng chủ đề. Đó là
lựa chọn có ý thức, không phải sót: khung YT chỉ là bài giảng BỔ SUNG, nội dung chính
vẫn nằm trong bài.

⚠️ **`credit` để RỖNG là cố ý, và phải chạy `--fix-credits` trước khi seed.**
Máy dựng khoá bị chặn ra `youtube.com` — đo thật: `curl` trả
`CONNECT tunnel failed, response 403`, `WebFetch` trả `EGRESS_BLOCKED`, và chạy
`verify-youtube-videos.mjs` trên chính `postgresql.mjs` (vốn đã tốt) báo **cả 44 link
chết HTTP 403**. Tức là proxy chặn, không phải link mục. Hệ quả: không gọi được oEmbed
⇒ **không đọc được tên kênh và không biết video có cho nhúng hay không**. Tiêu đề mong
đợi ghi ở chú thích cuối mỗi dòng để đối chiếu; `--fix-credits` điền
`Kênh — Tiêu đề` thật từ YouTube, và tiêu đề thật lệch hẳn chú thích nghĩa là id trỏ
nhầm video.

Hai thứ thêm vào để cái chưa xác minh không lọt lên trang học:

- `scripts/course-video-seed.mjs` — `--apply` bị **TỪ CHỐI** khi còn `credit` rỗng, kiểm
  trước khi mở kết nối Prisma nên lần chạy sai không để lại nửa vời trong DB. Bỏ chốt
  bằng `--cho-phep-thieu-credit`. Đã thử thật với Prisma giả: chặn đúng 57/57 entry của
  observability, và cho `postgresql.mjs` (credit đầy đủ) đi qua.
- `scripts/course-video-audit.mjs` (mới) — bộ kiểm **NGOẠI TUYẾN**, hỏi những câu không
  cần mạng: bài lý thuyết nào chưa có video · entry nào trỏ vào slug không tồn tại ·
  entry nào gắn cho bài QUIZ · id nào dùng lại · id có đúng 11 ký tự · còn bao nhiêu
  credit rỗng. Chạy trên 4 bản đồ CŨ: `nodejs` 94/94, `postgresql` 44/44, `nextjs`
  101/101 sạch; `typescript` 68/68 **nhưng chỉ 57 video khác nhau** — 8 video bị dùng
  lại, một cái tới 5 bài.

## 6. Việc chưa chạy được từ sandbox (áp cho MỌI khoá mới)

### 6.0 — BA VIỆC Ở MÁY NHÀ, LÀM TRƯỚC NỘI DUNG KHOÁ

⚠️ **Việc 1 gấp hơn toàn bộ phần nội dung khoá học bên dưới.** Nhánh
`claude/intelligent-cori-pt8zxp` đang mang bản vá bảo mật `94f3a0a0
fix(security): command injection in video thumbnail extraction`, và bản vá đó
**chưa có trên `main`, chưa lên production**. Nội dung khoá chậm một ngày không
sao; lỗ command-injection còn sống trên production thì có.

⚠️⚠️ **SỐ Ở ĐÂY ĐÃ LỖI THỜI MỘT LẦN — đo lại trước khi tin.** Mục này từng ghi
"đi trước 242 commit, phần đụng `src/` chỉ có **đúng hai file**, bề mặt rủi ro
rất hẹp". Đo lại 25/08/2026: **253 commit** và **9 file `src/`**, trong đó có
**340 dòng bị XOÁ** ở `codeLab`/`makerLab`/`simTicket`/`device.gateway` — tức
là gỡ tính năng, không phải sửa nhỏ. Bề mặt rủi ro KHÔNG hẹp như câu cũ nói.
Chạy lại hai lệnh này rồi mới quyết định kiểm tới đâu:

```bash
git fetch origin main
git diff --stat origin/main..HEAD -- src/ frontend/ prisma/
```

Đo thật 25/08/2026:

```
src/  9 file  (+77 −340)   ← ffmpeg.service, video.service (bản vá bảo mật)
                              + codeLab/makerLab/techTrends/simTicket/device.gateway (gỡ tính năng)
frontend/ 30 file          ⇒ BẮT BUỘC chạy cả tsc LẪN npm run build (§Pre-Push Checklist)
prisma/   0 file           ⇒ KHÔNG có migration, KHÔNG cần seed lại schema
```

```bash
# 1. Kiểm kiểu — CHƯA CHẠY ĐƯỢC LẦN NÀO (sandbox không có node_modules)
npx tsc --noEmit
(cd frontend && npx tsc --noEmit)
(cd frontend && npm run build)      # 30 file frontend ⇒ bắt buộc, tsc không thay được

# 2. Merge nhánh vào main (local)
git checkout main && git pull origin main
git merge claude/intelligent-cori-pt8zxp

# 3. Deploy — ĐÂY mới là cái đưa bản vá lên production, KHÔNG phải git push
bash deploy-nha.sh

# 4. Người dùng thử production, xác nhận chạy được, RỒI mới push (§Docker & Deploy)
git push origin main
```

Thứ tự trên là bắt buộc: `deploy-nha.sh` lấy mã từ **commit**, và một push vào
`main` KHÔNG kích hoạt deploy — đẩy trước rồi quên deploy là kho GitHub xanh
trong khi production vẫn chạy mã cũ.

⚠️ **Deploy KHÔNG làm video hiện lên.** Đo 25/08/2026: 30 file frontend thay đổi
**không có file nào thuộc trang `/courses` hay trang học**. Bản đồ video sống
trong DB, và thứ đưa nó vào DB là `course-video-seed.mjs --apply` ở §6.1 —
không phải deploy. Deploy là để đưa **bản vá bảo mật** (và các thay đổi khác)
lên production. Hai việc rời nhau: muốn học ngay thì chạy seed là đủ; nhưng
đừng vì thế mà hoãn deploy bản vá.

### 6.1 — Ảnh bìa + seed cho các khoá mới

Hai bước cuối của mỗi khoá cần môi trường mà sandbox không có — hãy chạy khi ở máy nhà:

```bash
# 1. Ảnh bìa — cần sharp + biến R2_*, phải chạy TRONG container backend.
#    Chưa chạy thì thumbnailUrl trỏ vào URL chưa tồn tại → thẻ khoá vỡ ảnh trên /courses.
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug git --icon git --color F05032 --title "Git & GitHub" --subtitle "Zero → Production"

# 2. Seed lên DB — cần DATABASE_URL. Idempotent: chạy lại chỉ cập nhật,
#    không nhân bản, không mất tiến độ học viên.
node scripts/course-seed.mjs --file ./content/courses/git.mjs --dry
node scripts/course-seed.mjs --file ./content/courses/git.mjs --apply
```

### ⚡ MỘT LỆNH LÀM NỐT TẤT CẢ (26/08/2026)

`scripts/hoan-tat-khoa-hoc.sh` gộp cả năm bước còn lại. **Chạy trên máy Mac** —
nó cần ba thứ sandbox không có: ra được `youtube.com`, khoá ssh vào VPS, khoá
ssh vào máy nhà.

```bash
cd <repo trên Mac> && git fetch origin \
  && git checkout origin/claude/intelligent-cori-pt8zxp -- scripts/hoan-tat-khoa-hoc.sh \
  && bash scripts/hoan-tat-khoa-hoc.sh
```

Nó KHÔNG tự push — chỉ commit tại chỗ, rồi `deploy-nha.sh` ở bước 5 vẫn hỏi
duyệt qua Telegram như cũ.

⛔ **Chốt ngưỡng 20% ở bước 2 là thứ đắt nhất trong file đó.** Bước 2 gỡ mọi
entry còn `credit: ''` sau khi `--fix-credits` chạy (rỗng == link chết). Thử
thật trên bản sao lúc credit còn rỗng toàn bộ — đúng trạng thái `main` ngày
25/08 — nó gỡ **sạch 804/804 entry**, tức là bước 1 hỏng vì bất cứ lý do gì
(mất mạng, sai thư mục, oEmbed đổi) là cả tính năng video biến mất mà không ai
kịp thấy. Thực tế chỉ ~24/804 chết (3%), nên >20% ⇒ dừng hẳn, **không ghi file
nào**. Đã kiểm cả hai chiều: ca xấu dừng đúng và không đụng file; ca thật gỡ
đúng 2/57 và file vẫn parse được.

### Vì sao đợt deploy 25/08 chưa hiện khoá/ảnh/video — ba nguyên nhân khác nhau

| Thiếu gì | Nguyên nhân |
|---|---|
| **Video** | `--fix-credits` chạy ở `~/cuongthai-build/api-backend-deploy` nhưng **không commit**. `deploy-nha.sh` chỉ đẩy thứ ĐÃ COMMIT, nên production nhận bản credit rỗng ⇒ chốt của `course-video-seed` từ chối `--apply` (rc=1, `✗ 63 entry còn credit rỗng`). Chốt làm đúng việc; cái sai là kết quả nằm ngoài git. |
| **Ảnh bìa** | `deploy.sh` chạy `course-seed.mjs` và `course-video-seed.mjs` nhưng **không** có `course-cover.mjs` — ảnh bìa bắt buộc chạy tay trong container backend (cần `sharp` + `R2_*`). |
| **Khoá học** | `deploy.sh:571-574` CÓ lặp qua mọi `content/courses/*.mjs` và `course-seed.mjs --apply`. Grep log không thấy lỗi nào ở khối này ⇒ khoá nhiều khả năng đã seed; thẻ vỡ ảnh làm tưởng là thiếu khoá. Còn nghi thì xem `grep -iE "course\|khoá" /tmp/seed-nha.log`. |

### Video YouTube — CHẠY `--fix-credits` TRƯỚC KHI SEED

```bash
KHOA_VIDEO="observability-monitoring git linux-bash docker nginx deploy-vps \
github-actions redis prisma-orm authentication socket-io tailwind-css \
web-foundations object-storage media-processing"

# 1. Xác minh + điền credit (bắt buộc; in ra link nào đã chết)
for s in $KHOA_VIDEO; do
  node scripts/verify-youtube-videos.mjs --file ./content/course-videos/$s.mjs --fix-credits
done

# 2. Kiểm ngoại tuyến lại cho chắc
for s in $KHOA_VIDEO; do
  node scripts/course-video-audit.mjs --file ./content/course-videos/$s.mjs
done

# 3. Gắn vào DB (bị TỪ CHỐI nếu bước 1 chưa chạy)
for s in $KHOA_VIDEO; do
  node scripts/course-video-seed.mjs --file ./content/course-videos/$s.mjs --apply
done
```

⚠️ **ĐỪNG dùng `course-video-audit.mjs --all` làm cổng kiểm.** Nó quét cả
`content/course-videos/` — trong đó có ~40 bản đồ CŨ của các khoá không nằm ở
`content/courses/` (chúng seed bằng đường khác), nên `--all` luôn báo ~43 lỗi
`không thấy khoá` dù 15 khoá này sạch. Kiểm từng `--file` như trên; 15 khoá đều
**0 lỗi**. (`typescript.mjs` có cảnh báo dùng lại id — lỗi cũ từ trước, xem §5.)

Link nào báo `✗ ... DEAD` thì báo lại kèm slug bài — đổi id là một dòng.

**Đang chờ chạy — mười khoá:**

```bash
# Git & GitHub
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug git --icon git --color F05032 --title "Git & GitHub" --subtitle "Zero → Production"
node scripts/course-seed.mjs --file ./content/courses/git.mjs --apply

# Linux & Bash
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug linux-bash --icon linux --color FCC624 --title "Linux & Bash" --subtitle "Terminal → Server"
node scripts/course-seed.mjs --file ./content/courses/linux-bash.mjs --apply

# Docker
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug docker --icon docker --color 2496ED --title "Docker" --subtitle "Container → Production"
node scripts/course-seed.mjs --file ./content/courses/docker.mjs --apply

# Redis
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug redis --icon redis --color DC382D --title "Redis" --subtitle "Cache → Production"
node scripts/course-seed.mjs --file ./content/courses/redis.mjs --apply

# Prisma ORM
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug prisma-orm --icon prisma --color 2D3748 --title "Prisma ORM" --subtitle "Schema → Production"
node scripts/course-seed.mjs --file ./content/courses/prisma-orm.mjs --apply

# Authentication
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug authentication --icon openid --color F78C40 --title "Authentication" --subtitle "Login → Production"
# (Nếu slug "openid" trả 404 ở Simple Icons thì lùi về --icon auth0 --color EB5424.)
node scripts/course-seed.mjs --file ./content/courses/authentication.mjs --apply

# Nginx
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug nginx --icon nginx --color 009639 --title "Nginx" --subtitle "Request → Production"
node scripts/course-seed.mjs --file ./content/courses/nginx.mjs --apply

# Deploy VPS
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug deploy-vps --icon ubuntu --color E95420 --title "Deploy lên VPS" --subtitle "Máy bạn → Production"
node scripts/course-seed.mjs --file ./content/courses/deploy-vps.mjs --apply

# GitHub Actions
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug github-actions --icon githubactions --color 2088FF --title "GitHub Actions" --subtitle "Push → Production"
node scripts/course-seed.mjs --file ./content/courses/github-actions.mjs --apply

# Observability & Monitoring
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug observability-monitoring --icon grafana --color F46800 \
  --title "Observability & Monitoring" --subtitle "Log → Metric → Trace"
node scripts/course-seed.mjs --file ./content/courses/observability-monitoring.mjs --apply
```

⚠️ **Linux & Bash**, **Docker**, **Nginx**, **Deploy VPS**, **GitHub Actions** và **Observability & Monitoring** dùng **category `devops`** (`DevOps & Vận hành`),
chưa từng có trong DB — lần seed đầu sẽ thêm một mục lọc mới trên trang `/courses`.
**Redis** và **Prisma ORM** dùng category `databases` đã có sẵn (chung với PostgreSQL).
**Authentication** dùng category `backend` đã có sẵn (chung với Node.js).

---

## 7. Khuôn dựng một khoá mới

```
content/courses/<slug>.mjs          ← file gom: category + course + mảng sections
content/courses/<slug>/s00-*.mjs    ← mỗi mục một file
content/courses/<slug>/s01-*.mjs
```

Thêm một mục = sửa **hai chỗ** trong file gom (dòng `import` và mảng `sections`).
Soạn xong mỗi mục thì chạy ngay hai bộ kiểm — bộ đầu nay **thoát khác 0** khi có lỗi
nên chuỗi `&&` sẽ dừng đúng lúc:

```bash
node scripts/course-content-check.mjs ./content/courses/<slug>.mjs
node scripts/course-depth-audit.mjs   ./content/courses/<slug>.mjs
```

Ba lỗi mà bộ kiểm đã bắt được trong lúc soạn khoá Git, đều là loại đọc bằng mắt sẽ sót:
thiếu hẳn nửa `ml-vi` của một bài 12k ký tự · khối `.out` đóng bằng `</code></pre>`
thay vì `</div>` (hai lần) · quiz có phương án thuần code mang dấu tiếng Việt.

---

## 26/08/2026 — PostgreSQL: viết nốt 6 chương mà khoá đã HỨA nhưng chưa có

**Người dùng phát hiện, không phải audit.** Câu hỏi là *"sao tôi thấy nó thiếu
thiếu như bạn đang làm dở vậy ta, chưa đầy đủ chuyên sâu mới chỉ có 54 bài"* —
và đúng. Khoá tự công bố **"4 giai đoạn, 16 chương"** ở NĂM chỗ trong chính nội
dung của nó (tiêu đề lộ trình EN+VI ở `s00-intro`, ngân sách thời gian EN+VI,
và `description` của khoá), nhưng trên đĩa chỉ có `s00..s10` — tức intro +
chương 1–10. **Chương 11–16 chưa từng được viết ở bất kỳ nhánh nào** (kiểm bằng
`git log --all --diff-filter=A -- 'content/courses/postgresql/s1[1-6]*'`: rỗng).

Lộ trình đã hứa, và giờ đã có: 11 Giao dịch & đồng thời · 12 Hàm, trigger &
view · 13 JSONB & FTS · 14 Kết nối, pool & vận hành · 15 Sao lưu, nhân bản &
mở rộng · 16 Production & capstone. **54 → 84 bài, 631k → 1,02M ký tự.**

### Bài học chung: một khoá học có thể tự MÂU THUẪN mà mọi phép kiểm vẫn xanh

`course-content-check`, `course-depth-audit`, `course-lang-check` đều xanh trên
bản 54 bài, vì cả ba đều kiểm **thứ đang có**, không cái nào đối chiếu nội dung
với **thứ khoá tự hứa**. Đây cùng một họ với bẫy
[[feedback_verify_the_checker_before_the_content]]: bộ kiểm chỉ thấy được thứ
nó được dạy để nhìn. Muốn bắt loại lỗi này thì phải so *lời hứa* với *hiện vật*
— ở đây là đếm số chương trong `s00-intro` rồi so với số file `s*.mjs`.

### Cách dựng: DỰNG POSTGRESQL THẬT TRONG SANDBOX, đừng viết theo trí nhớ

Sandbox này **có sẵn PostgreSQL 16.13** (`/usr/lib/postgresql/16/bin`). Không
cần Docker, không cần mạng:

```bash
SP=<scratchpad>
mkdir -p "$SP/pgdata" && chown postgres:postgres "$SP/pgdata" && chmod 700 "$SP/pgdata"
chmod o+x /tmp/claude-0 …/scratchpad          # postgres phải ĐI QUA được cả chuỗi thư mục
runuser -u postgres -- initdb -D "$SP/pgdata" -U postgres --encoding=UTF8 --locale=C
runuser -u postgres -- pg_ctl -D "$SP/pgdata" -o "-p 5433 -k /tmp" -l /tmp/pg.log start
```

⚠️ `initdb` **từ chối chạy dưới root** — phải `runuser -u postgres`. Và vì đổi
sang user khác nên **mọi thư mục cha phải có bit `o+x`**, nếu không nó báo
`Permission denied` ở đúng thư mục mà `ls` vẫn thấy bình thường.

**Kịch bản ĐỒNG THỜI cần hai kết nối THẬT**, không giả lập được bằng cách chạy
tuần tự. `scripts/` không giữ lại, nhưng mẫu là: hai FIFO + hai `psql -f`, rồi
bơm từng dòng vào FIFO tương ứng và `sleep` giữa các bước; `stdbuf -o0` để
output ra đúng thứ tự. Nhờ nó mà các bản ghi `A│`/`B│` trong Ch11 là **thứ tự
sự kiện có thật**, kể cả những chỗ một phiên TREO và chỉ in ra sau khi phiên
kia commit.

### Những con số chỉ có được vì đã ĐO cả hai chiều

| Đo | Kết quả | Vì sao đáng |
|---|---|---|
| lost update | 100−10−20 = **80.00** (đúng phải 70.00) | không lỗi, không cảnh báo, cả hai giao dịch báo thành công |
| write skew ở REPEATABLE READ | cả hai commit, **không còn ai trực** | SERIALIZABLE thì huỷ một bên kèm `Reason code: Canceled on identification as a pivot` |
| deadlock | `deadlock detected` kèm PID thật | và `COMMIT` của nạn nhân trả về **`ROLLBACK`** |
| bloat | 4.608 kB → **13 MB**, 199.915 dead tuple | `VACUUM` dọn sạch dead tuple mà file **vẫn 13 MB** |
| volatility | VOLATILE gọi **5** lần, IMMUTABLE **1** lần | cùng truy vấn, cùng 5 dòng |
| GIN chọn lọc | 56,8 ms → **1,2 ms** (45×) | |
| GIN *không* chọn lọc | 54,1 → **31,5 ms** (chỉ 42%) | ⭐ **chỉ nói được vì đã đo CẢ HAI** — một mình con số 45× sẽ dạy sai |
| FTS + GIN | 39,5 ms → **0,080 ms** | |
| trigram cho `ILIKE '%…%'` | 46,2 ms → **0,210 ms** | dạng truy vấn ai cũng bảo "không đánh chỉ mục được" |
| kết nối | 4,403 vs **0,186** ms/truy vấn (23,7×); pool 0,205 | cả lý lẽ dùng pool gói trong một phép đo |
| cạn kết nối | đúng **100** rồi `sorry, too many clients already` | |
| `pg_stat_statements` | 2 lượt ăn **51,1 ms** > 5 lượt ăn 12,7 ms | vì sao phải sắp theo `total_exec_time` |
| DROP mảnh vs DELETE | **3,5 ms** vs 67,8 ms (19×) | và DELETE để lại 100.019 dead tuple, DROP thì không |

**Ch15 dựng HAI cụm thật**: `pg_basebackup -R -S <slot> -X stream` chép 188.772 kB
sang cổng 5434, `pg_is_in_recovery()` trả `t`, ghi vào bản sao báo
`cannot execute INSERT in a read-only transaction`, `pg_stat_replication` báo
`state=streaming` và trễ 0 byte.

### Ch16 lấy số liệu từ CHÍNH kho mã này, và kiểm chứng lại tài liệu

Bug P3006 mà `CLAUDE.md` mô tả **đã được kiểm tận file** thay vì chép lại:
`prisma/migrations/20260706130000_add_music_and_profile/migration.sql` dòng 48–49
đặt **trùng tên** một `UNIQUE` constraint và một `CREATE INDEX`. Đúng như tài
liệu nói — nhưng giờ có bằng chứng, không phải niềm tin.

Số liệu lược đồ đếm tại chỗ: **8.164 dòng · 277 model · 56 enum · 117 migration
· 446 `@@index` · 441 `@relation`**, model `User` một mình **47 `@relation` /
172 trường**. Chương 0 ghi *248 bảng / 95 migration / 6.980 dòng* — lệch, vì nó
viết từ trước. Bài 16.2 **nêu thẳng độ lệch đó** và biến nó thành bài học:
lược đồ là thứ LỚN LÊN, nên cơ chế phải là migration chứ không phải `db push`.

### Bẫy đã dính và đã sửa trong chính đợt này

- **Sơ đồ đếm bằng `lz-map|lz-flow|lz-stack`, KHÔNG phải `lz-step`/`lz-layer`.**
  Sáu chương mới viết ra ban đầu có **0 sơ đồ** theo `course-depth-audit`, dù
  đầy `lz-step`. Hoá ra `lz-flow`/`lz-stack` là **thẻ BỌC** quanh một cụm
  `lz-step`/`lz-layer`. Bọc lại + bổ sung 7 sơ đồ còn thiếu ⇒ 68/68 bài lý
  thuyết có sơ đồ, ngang chuẩn Ch1–10. *Bài học: đọc bộ kiểm để biết nó ĐẾM gì,
  đừng đoán từ tên lớp CSS.*
- **Test viết sai làm tính năng trông như hỏng.** `UPDATE note_cua_user1 … WHERE id=1`
  trả `UPDATE 0`, suýt thành câu "view có lọc thì không ghi được". Thật ra note
  `id=1` thuộc `user_id=2` nên nó **không nằm trong view**. Chọn đúng dòng thì
  `UPDATE 1`. *Suýt viết một điều SAI vào giáo trình vì tin cái test.*
- **Dữ liệu mẫu phải TẤT ĐỊNH.** Bản đầu dùng `random()` cho `views`, người học
  chạy lại sẽ ra số khác. Đổi sang `views = (id * 37) % 101`.

### Còn phải làm trên máy có mạng

24 entry video mới để `credit: ""` vì sandbox **không ra được youtube.com**.
Chạy `node scripts/verify-youtube-videos.mjs --file ./content/course-videos/postgresql.mjs --fix-credits`
— nó vừa điền credit vừa **chứng minh** 24 link còn sống và nhúng được. Chốt
credit rỗng trong `course-video-seed.mjs` sẽ chặn seed cho tới khi bước đó chạy.
