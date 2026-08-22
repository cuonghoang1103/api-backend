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
| 2 | `nextjs` + `react` | `nextjs` — Next.js & React | ✅ có (21 mục · 121 bài · 686k) — *mỏng, xem §4* |
| 3 | `typescript` | `typescript` — TypeScript | ✅ có (17 mục · 84 bài · 649k) — *thiếu sơ đồ* |
| 4 | `postgresql` | `postgresql` — PostgreSQL | ✅ có (11 mục · 54 bài · 488k) |
| 5 | `javascript` + `html-css` | `web-foundations` — Nền tảng Lập trình Web | ✅ có (11 mục · 64 bài · 333k) — *0 sơ đồ* |
| 6 | `git` | `git` — Git & GitHub | ✅ **XONG** (14 mục · 63 bài · 889k · TB 14.109) |
| 7 | `linux-bash` | — | ❌ **THIẾU** |
| 8 | `docker` | — | ❌ **THIẾU** |
| 9 | `redis` | — | ❌ **THIẾU** |
| 10 | `prisma-orm` | — | ❌ **THIẾU** |
| 11 | `authentication` | — | ❌ **THIẾU** |
| 12 | `nginx` | — | ❌ **THIẾU** |
| 13 | `deploy-vps` | — | ❌ **THIẾU** |
| 14 | `github-actions` | — | ❌ **THIẾU** |
| 15 | `tailwind-css` | — | ❌ **THIẾU** |
| 16 | `socket-io` | — | ❌ **THIẾU** |
| 17 | `object-storage-s3` | — | ❌ **THIẾU** |
| 18 | `media-processing` | — | ❌ **THIẾU** |
| 19 | `observability-monitoring` | — | ❌ **THIẾU** |
| 20 | `payment-integration` | — | ❌ **THIẾU** |
| 21 | `vnpay` | — | ❌ **THIẾU** |
| 22 | `payos` | — | ❌ **THIẾU** |
| 23 | `domains-dns-tls` | — | ❌ **THIẾU** |
| 24 | `cuongthai-roadmap` | *(lộ trình, không phải khoá)* | — bỏ qua |

**Tổng: 6 khoá đã có · 17 khoá còn thiếu.**

### Thứ tự ưu tiên (đã chốt)

Theo thứ tự một người học thật sự cần, và theo mức độ khoá đó được các khoá khác dẫn tới:

1. **Git & GitHub** — nền tảng, mọi khoá khác giả định đã biết; roadmap trỏ tới 8 lần
2. **Linux & Bash** — điều kiện cần của deploy, Docker, Nginx
3. **Docker** — Node.js Ch17 chỉ chạm bề mặt; xứng đáng khoá riêng
4. **Redis** · 5. **Prisma ORM** · 6. **Authentication** — đào sâu ba chương của Node.js
7. **Nginx** · 8. **Deploy VPS** · 9. **GitHub Actions (CI/CD)** — mảng vận hành
10. **Tailwind CSS** · 11. **Socket.IO** — mảng sản phẩm
12. **Object Storage (S3/R2)** · 13. **Media Processing** · 14. **Observability**
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

Kiểm bằng hai lệnh (đều chạy được ở local, không cần DB):

```bash
node scripts/course-content-check.mjs ./content/courses/<khoá>.mjs   # cấu trúc: song ngữ, cân thẻ, quiz
node scripts/course-depth-audit.mjs   ./content/courses/<khoá>.mjs   # độ sâu: ký tự/bài, sơ đồ, nguồn
```

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


### Khoá Linux & Bash — XONG (22/08/2026)

13 mục (Mục 0 + Chương 1–12), **69 bài · 1.660k ký tự · TB 24.064 ký tự/bài ·
182 sơ đồ `lz-*` · 424 thẻ nguồn học · 130 bẫy · 1.022 khối code ·
568 khối output · 12 quiz**. Qua `course-content-check.mjs` và
`course-depth-audit.mjs`. Còn hai bước phải chạy ở máy nhà — xem §6.

---

## 6. Việc chưa chạy được từ sandbox (áp cho MỌI khoá mới)

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

**Đang chờ chạy — hai khoá:**

```bash
# Git & GitHub
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug git --icon git --color F05032 --title "Git & GitHub" --subtitle "Zero → Production"
node scripts/course-seed.mjs --file ./content/courses/git.mjs --apply

# Linux & Bash
docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
  --slug linux-bash --icon linux --color FCC624 --title "Linux & Bash" --subtitle "Terminal → Server"
node scripts/course-seed.mjs --file ./content/courses/linux-bash.mjs --apply
```

⚠️ Cả hai khoá dùng **category mới `devops`** (`DevOps & Vận hành`), chưa từng có trong
DB — lần seed đầu sẽ thêm một mục lọc mới trên trang `/courses`.

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
