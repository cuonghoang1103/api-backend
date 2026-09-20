# 📋 BÀN GIAO — phiên 20/09/2026, cập nhật 21/09/2026

> **Đọc file này + `_KHUNG-CHUA-DAY-DU.md` trước khi làm tiếp Academy.**
> Viết lúc người dùng tắt máy nghỉ (máy bật liên tục 10 ngày, quá nóng) và sắp
> hết quota. Ghi đủ để phiên sau làm tiếp mà không hỏi lại gì.

---

## 1. ĐANG CÓ GÌ TRÊN PRODUCTION (đã kiểm bằng DB thật, không tin log deploy)

### Kỳ 1 — xong 9/9 môn khung, **419 bài**

| Môn | Mục/bài | Ghi chú |
|---|---|---|
| `SSA101` Kỹ năng học thuật | 11 / 30 | |
| `PFP191` Python | 12 / 70 | 50 khối code chạy thật |
| `DTG102` Thiết kế đồ hoạ số | 10 / 40 | |
| `VCM202` Truyền thông thị giác | 11 / 30 | |
| `EEI101` Kỹ thuật điện–điện tử | 15 / 67 | mọi phép tính kiểm bằng `python3` |
| `SDI101m` Thiết bị bán dẫn | 13 / 67 | 160 giá trị kiểm bằng `python3` |
| `ASI101` Nhập môn ô tô | 16 / 51 | |
| `DRS102` Vẽ khối, tĩnh vật | 12 / 30 | |
| `DRP101` Vẽ đầu tượng, chân dung | 7 / 34 | |

⛔ Hai môn Kỳ 1 **chưa làm**: `MAC103` và `RAI101` — FLM **không công bố syllabus**,
phải tự soạn và đánh dấu rõ. Xem `_mon-flm-chua-co-syllabus.md`.

### NWC204 — môn ưu tiên số 1 của người dùng

**7 mục · 33 bài · 135 ảnh slide**, phủ **buổi 1–16 / 60** (21/09/2026).
Kiểm trên spec: 33 bài, 0 bài rỗng, 168/168 khối code có nhãn `language-`,
**20/20 sơ đồ mermaid đúng dạng**, 0 thực thể thô trong `title`.
Buổi 1–14 đã kiểm trên DB production 20/09; **Chương 5 (buổi 15–16) viết
21/09 và CHƯA deploy** — xem mục 2.

### Bản vá toàn site cùng đợt

- **853 tiêu đề bài ở 77 môn** in ra chữ `&amp;` thô → đã vá, giờ 0.
- **Xếp môn theo khung ngành** (`xepTheoKhung`) → `SSG105` về Kỳ 5 kèm `SSG104`
  nhãn *mã cũ*, và 8 môn lệch kỳ khác về đúng chỗ.
- `RAI101` + `APO202` thôi bị mất hẳn (trước đó gắn vào kỳ `isActive=false`).
- **Trang học Academy giờ vẽ được sơ đồ mermaid** (trước nay chưa bao giờ gọi bộ vẽ).

---

## 2. CÒN NỢ — làm tiếp từ đây

### ✅ Chương 5 xong 21/09/2026 (CHƯA DEPLOY)

3 bài + 1 quiz 12 câu, 27 slide đã lên `NWC204/v1/nwc204-ch05/` (đã so byte
với CDN, lệch 0/27). Nguồn: `scripts/slides-src/nwc204-ch05.mjs`,
`content/academy/nwc204/ch05.mjs`.

Hai điều mới của chương này, áp dụng cho MỌI chương sau:
- **Dấu ★** đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 6 (user yêu
  cầu 21/09): lệch duplex đọc bằng `ethtool`, 802.1Q, MTU/MSS, lệnh tầng 2 trên
  Linux, cầu nối Docker. Giáo trình trường phủ đủ trước, ★ thêm vào sau.
- **Buổi 15 và 16 KHÔNG có câu hỏi kiến tạo** trong bảng gốc (nhảy từ CQ5.2 ở
  buổi 14 sang CQ6.1 ở buổi 17). Đã nêu trong bài và tự soạn câu thảo luận ★
  thay thế. Các buổi trống khác: 6, 9, 22, 30, 36, 56 — sẽ gặp lại.

### NWC204 buổi 17–60 (11 chương)

| Chương | Buổi | Nội dung |
|---|---|---|
| Ch.6 | 17–20 | Ethernet Switching + Lab 1.4 (Module 7) |
| Ch.7 | 21–23 | Network Layer + Review (Module 8) |
| Ch.8 | 24–25 | Address Resolution / ARP (Module 9) |
| Ch.9 | 26–29 | Basic Router Configuration + Lab 2.1 (Module 10) |
| **Ch.10** | **30–34** | **IPv4 Addressing + chia subnet + VLSM + Midterm** ⭐ nặng nhất, và là chỗ cần chương bù 4B |
| Ch.11 | 35–36 | IPv6 Addressing (Module 12) |
| Ch.12 | 37–40 | ICMP + Lab 2.3 (Module 13) |
| **Ch.13** | **41–42** | **Transport Layer — SỐ HIỆU CỔNG** ⭐ người dùng cần cho công việc |
| Ch.14 | 45–46 | Application Layer (Module 15) |
| Ch.15 | 49–50 | Network Security Fundamentals (Module 16) |
| Ch.16 | 53–55, 58–60 | Build a Small Network + Review (Module 17) |
| Đồ án | 43–44, 47–48, 51–52, 56–57 | Project với AI |

### Pha 2 — lớp "Trên máy chủ thật của bạn"

Người dùng chốt thứ tự **"1 rồi 3"**: xong giáo trình trước, rồi mỗi chương thêm
một bài thực chiến. Nội dung Pha 2 (không môn nào của FPTU dạy):
`sshd_config` + xác thực bằng khoá · `ssh.socket` của systemd · đường hầm /
ProxyJump · `ufw` / `iptables` · NAT và port-forward trên Linux · nginx + TLS ·
mạng Docker · DNS bản ghi thực tế · Let's Encrypt.

### Bốn môn full tiếp theo (người dùng đã chọn, theo thứ tự)

2. `DBI202` (syl 12039) — ⚠️ trường **nhảy từ Chapter 4 sang Chapter 6** của Ullman
3. `CSD201` (syl 10368) — có **120 câu hỏi kiến tạo**, 2 câu/buổi, kèm bộ riêng campus HCM
4. `SDN302` (syl 12175) — ⚠️ CLO8 ghi "EJB" nhưng môn dạy **EJS**; buổi 35–36 bảo
   dùng Multer để TẢI XUỐNG (sai, Multer chỉ upload); buổi 48 dạy Heroku (đã bỏ
   gói miễn phí 11/2022)
5. `WED201c` (syl 13172) — ⚠️ cũng là môn **tự học Coursera 12 buổi**; cách tính
   điểm thật nằm ở ô **Note**: `FR = min(10, (TE+PE)/2 + Bonus)`

Syllabus cả 5 môn đã thu xong ở `_syllabus-flm/`.

### 🔴 Việc người dùng cần làm (chưa xong)

**Tải 7 file zip tài liệu từ FLM** — tôi tải không được, trình duyệt tự động bị
chặn tải file. Đã kiểm cả 7 đều trả HTTP 200:

| Môn | Link | MB |
|---|---|---|
| CSD201 | `flm.fpt.edu.vn/download/863/S/1_CSD201.zip` | 8,4 |
| CSD201 | `flm.fpt.edu.vn/download/863/S/2_CSD201.zip` | 7,7 |
| DBI202 | `flm.fpt.edu.vn/download/6453/S/1_DBI202.zip` | 2,7 |
| DBI202 | `flm.fpt.edu.vn/download/6453/S/2_DBI202.zip` | 3,7 |
| SDN302 | `flm.fpt.edu.vn/download/12175/S/1_SDN302_Slides_1.zip` | 20,1 |
| SDN302 | `flm.fpt.edu.vn/download/12175/S/2_SDN302_Slides_2.zip` | 6,5 |
| SDN302 | `flm.fpt.edu.vn/download/12175/S/3_SDN302_Slides_3.zip` | 5,1 |

⛔ **NWC204 thì KHÔNG có gì tải** — trang syllabus 0 link; tài liệu là của Cisco
trên netacad, bản quyền, không phát hành lại. Vì thế slide môn này ta **tự dựng**.

---

## 3. CÁCH DỰNG SLIDE CHUYÊN NGHIỆP — quy trình đã chạy được

### Yêu cầu nguyên văn của người dùng

> "Slide full hoàn toàn bằng tiếng anh chuyên nghiệp luôn nhé + CÓ Slide sơ đồ
> mô tả cổng luồng hay gì đó cho dễ hiểu nữa chứ hoặc hình ảnh để mô tả, cho dễ
> học chứ **chữ nhiều quá học rất chán** + không hiểu lắm vì bài giảng bên dưới
> của bạn cũng là chữ rồi."

⇒ **Tối thiểu 60% slide phải là SƠ ĐỒ hoặc BẢNG**, mỗi slide tối đa ~6 dòng chữ.
Đợt NWC204 đạt 87–96%.

### Năm bước

```bash
# 1. Viết deck
#    scripts/slides-src/nwc204-chNN.mjs
#    export const deck = { key, code, title, sub }
#    export const slides = [{ kind:'cover'|undefined, t, sub?, body }]

# 2. ĐO TRÀN KHUNG TRƯỚC KHI RENDER (thêm 21/09, ~4 giây, khỏi render lại)
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/nwc204-chNN.mjs

# 3. Render (playwright 1280×720, deviceScaleFactor 2, sharp→webp q92)
node scripts/_render-slides.mjs --deck scripts/slides-src/nwc204-chNN.mjs --out <scratchpad>/slides

# 4. ⭐ MỞ ẢNH RA NHÌN — bắt buộc, exit code 0 KHÔNG có nghĩa là ảnh đúng
#    Bước 2 bắt tràn khung, nhưng KHÔNG bắt được chữ bị cắt trong SVG và nhãn
#    topo() đè lên hộp — hai lỗi đó chỉ mắt thấy (Ch.5 dính cả hai, 21/09).
#    Dùng công cụ Read mở ít nhất 4 ảnh mỗi deck, gồm slide phức tạp nhất.
#    Đợt này nhờ vậy bắt được: khối terminal mất hết xuống dòng, 6 slide tràn
#    khỏi khung 720px, nhãn topology đè lên hộp, SVG tràn viewBox.

# 5. Upload rồi SO BYTE
node --env-file=.env scripts/upload-academy-slides.mjs \
  --dir <scratchpad>/slides --prefix NWC204/v1 --decks nwc204-chNN
#    Kiểm: so content-length trên CDN với kích thước file trên đĩa.
#    HTTP 200 KHÔNG phân biệt được bản cũ với bản mới (cache-control immutable
#    max-age=31536000). Agent hay render lại nhiều lần ⇒ phải so byte.
```

### Bộ helper vẽ sơ đồ — `scripts/slides-src/_nwc-chung.mjs`

| Hàm | Vẽ ra |
|---|---|
| `stack(rows)` | chồng tầng OSI / TCP-IP, có `.on` tô đậm tầng đang nói |
| `pkt(fields)` | cấu trúc gói tin theo từng trường + số byte |
| `encap(layers, payload)` | đóng gói lồng nhau (Ethernet ⊃ IP ⊃ TCP ⊃ HTTP) |
| `flow(left, right, hops)` | luồng hai đầu có mũi tên — bắt tay TCP, hỏi đáp |
| `topo(items)` | sơ đồ mạng có nhãn cổng, router hình bầu dục |
| `term(html)` | màn hình terminal, có `.p .c .k .g .r` tô màu |
| `code(src, lang)` | khối mã tô màu VS Code Dark+ |
| `bits('11000000')` | bảng 8 bit tự cộng ra thập phân |
| `kv(rows)` | danh sách khoá–giá trị |

⚠️ **ĐỪNG sửa `scripts/_render-slides.mjs`** — dùng chung cho MAE101 / SWR302 /
SWT301 / Web Foundations. Tôi đã thử thêm CSS vào đó rồi **hoàn tác**: selector
`code` trơn tôi thêm sẽ phá khối mã tối màu của bộ Web Foundations. CSS riêng
của môn nhúng thẳng vào `body` từng slide, mọi class có tiền tố `.nw-`.

⚠️ `body` của slide được chèn **thô** vào trang Chromium (dòng 103) ⇒ **nhúng SVG
trực tiếp được**, nét căng ở 2×, không cần thư viện. Đợt này dùng cho NRZ vs
Manchester, triệt nhiễu cáp xoắn, mặt cắt sợi quang.

⚠️ Khối dạng terminal phải có `white-space: pre-wrap` — thiếu là HTML nuốt hết
xuống dòng mà lệnh render vẫn exit 0.

⚠️ KaTeX: **KHÔNG dùng `\;` `\,` `\quad`** — chúng hiện thành dấu `;` `,` trên ảnh.

### Nhúng slide vào bài — `content/academy/nwc204/_slides.mjs`

```js
registerDeck('nwc204-ch05', { code: 'NWC204 Ch.5', en: '…', vi: '…', total: <đúng số ảnh đã render> });
walkHead(deck, from, to)                       // mở đầu, nói rõ slide do ta dựng
walk(deck, [[n, title, en, vi], …])            // mỗi slide 6–9 dòng giảng mỗi ngôn ngữ
cq(buoi, rows)                                 // câu hỏi kiến tạo của trường, nguyên văn + dịch
```

`total` sai là `slide()` **ném lỗi** — chốt chặn cố ý để bài không trỏ vào ảnh
không tồn tại.

⚠️ Phần chú thích dưới ảnh phải ghi **"slide do cuongthai.com dựng"**, KHÔNG ghi
"slide của thầy" — vì đây không phải slide của trường.

---

## 4. MỌI LỖI ĐÃ GẶP TRONG PHIÊN NÀY

### 4.1 Lỗi người dùng phát hiện

| Lỗi | Gốc rễ | Trạng thái |
|---|---|---|
| Sơ đồ flowchart hiện **mã nguồn thô** | (a) trang học **chưa bao giờ gọi** bộ vẽ mermaid; (b) bộ vẽ chỉ nhận `code.language-mermaid`, không nhận `<pre class="mermaid">`. **Lỗi gốc ở HỢP ĐỒNG của tôi** — tôi viết sai là "web render sẵn" | ✅ đã vá cả hai tầng |
| Ảnh slide 1 vỡ | 404 bị Cloudflare nhớ tạm, do **tôi lỡ `curl` đúng URL đó TRƯỚC khi upload** | ✅ tự hết, tải lại trang là được |
| `SSG104`/`SSG105` không hiện ở kỳ nào | ô tìm kiếm không lọc theo ngành, danh sách kỳ thì có; SSG104 không nằm trong khung ngành nào | ✅ đã vá gốc |
| Tiêu đề in ra chữ `&amp;` | `title` là văn bản thuần, entity in ra nguyên chữ | ✅ 853 tiêu đề ở 77 môn |

### 4.2 Lỗi tôi tự gây ra rồi tự bắt

- **Giải mã `&#39;` thành `'` ngay giữa chuỗi nháy đơn** → vỡ cú pháp `NWC203c.mjs`.
  Bộ vá của tôi `import` module trước khi sửa nên file vỡ bị **bỏ qua lặng lẽ** ở
  lần quét sau — suýt kết luận "đã sạch". ⇒ luôn `node --check` TOÀN BỘ file.
- **`_syllabus-flm/NWC204.json` đóng mảng bằng `}` thay vì `]`** → `JSON.parse`
  chết. Agent bắt được vì nó chạy bộ đối chiếu thật. Đã rà cả 15 file, giờ parse hết.
- **Chèn nhầm một khối vào giữa bảng markdown** của `_HOP-DONG-SOAN-BAI.md` → vỡ bảng.
- **Đoán slug `drawing-plaster-stature-portrait`** (đúng là `drp101-drawing-plaster-statue-portrait`)
  → API trả 404. Lặp lại đúng cái bẫy đã ghi trong bộ nhớ: **đọc slug từ dữ liệu, đừng đoán**.
- **Suýt đi vá 61 slug vô ích**: bắt agent gắn lại slug cũ rồi mới nghĩ ra là phải
  ĐO trước. Đếm trên DB: **0 dòng `lesson_progress` trên cả 9 môn** ⇒ không mất gì.

### 4.3 Báo động giả — đọc ngữ cảnh trước khi sửa

- **75 bài chứa chữ "undefined"** → tiếng Anh bình thường: *"f(a) is undefined"*,
  *"gate's output is undefined"*, *"an algorithm with an undefined input"*.
- **1 bài chứa `[object Object]`** (MMA301) → nội dung dạy thật: cảnh báo quên
  `JSON.stringify` thì AsyncStorage lưu ra `[object Object]`.
- **9.063 khối code thiếu `language-`** → **KHÔNG phải lỗi**: `toMauTrong()` vẫn
  `highlightAuto` (nhận khi relevance ≥ 5) và **luôn gắn nút Sao chép**. Chỉ mất
  nhãn tên ngôn ngữ. **Đừng đi vá 9 nghìn chỗ đó.**
- **5/5539 ảnh báo `ERR`** khi chạy 24 luồng song song → thử lại từng cái đều 200.

### 4.4 ✅ ĐÃ VÁ 21/09/2026 — log deploy trùng đường dẫn

Commit `506ba729`. Log build và log đẩy GHCR giờ mang theo `${SHA}`:
`/tmp/nha-{be,fe,day-ghcr}-<sha>.log`, và dòng báo lỗi in kèm mã commit + đúng
đường dẫn đang đọc. Mô tả lỗi cũ giữ lại bên dưới để hiểu vì sao có bản vá.

**Lỗi cũ — `deploy-nha.sh` ghi log build vào đường dẫn CỐ ĐỊNH**:

```sh
# dòng ~386, ~388
docker build … > /tmp/nha-be.log 2>&1 &
docker build … > /tmp/nha-fe.log 2>&1 &
```

Hai phiên deploy song song thì **ghi đè log của nhau**, rồi dòng ~397–398 đọc
nhầm log của phiên kia và kết luận "build hỏng". Đã mất **gần một giờ** vì nó:
script báo FAIL trong khi **cả hai ảnh của tôi đều đã dựng xong**.

**Cách vá**: thêm `${SHA}` (hoặc `$$`) vào tên file log, và in kèm mã commit khi
báo lỗi để biết log đang đọc là của ai.

### 4.5 Điều kiện môi trường làm chậm việc

- **Máy nhà**: `llama-server` chiếm **96,8% CPU + 8,7 GB RAM**, swap 7,1/8 GB →
  build kéo **54 phút** thay vì 6. Cộng thêm hai phiên cùng build.
- **VPS → GHCR**: có lúc chỉ **35–49 KB/s**, `docker pull` chạy 18 phút chưa xong.
  Không phải lỗi của ta, không sửa được. Lúc đó **đừng chờ**, để lúc khác deploy.
- **Khoá chống tráo đè** `/run/lock/cuongthai-deploy.lock` **hoạt động đúng** —
  nó đã chặn tôi tráo chồng lên phiên kia. Kiểm ai giữ khoá:
  `fuser /run/lock/cuongthai-deploy.lock` rồi `ps -o pid=,etime=,args= -p <PID>`.

### 4.6 Mẹo vận hành đã dùng được

- **Container backend KHÔNG có `psql`.** Đếm dữ liệu production bằng Prisma:
  `/app/package.json` là `"type":"module"` nên script phải đuôi **`.cjs`**.
  ```bash
  B64=$(base64 < dem.cjs | tr -d '\n')
  ssh vps "echo $B64 | base64 -d > /tmp/d.cjs && docker cp /tmp/d.cjs cuonghoangdev_backend:/app/d.cjs && docker exec -w /app cuonghoangdev_backend node d.cjs"
  ```
- **`Lesson` không có trường `type`** — tên đúng là **`lessonType`**.
- **Endpoint danh sách KHÔNG trả `content`.** Bài chi tiết ở
  `/api/v1/courses/<courseId>/lessons/<lessonId>` và **cần đăng nhập (401)**.
  Muốn kiểm nội dung thì hỏi thẳng DB.
- **Seed lại RIÊNG một môn** mà không cần deploy (dùng khi mạng chậm, ảnh đang
  chạy đã chứa file mới):
  ```bash
  ssh vps "docker exec -w /app cuonghoangdev_backend node scripts/academy-seed-course.mjs --file content/academy/NWC204.mjs --apply"
  ```

---

## 5. BỘ KIỂM ĐÃ LƯU LẠI (cứu từ /tmp trước khi khởi động lại máy)

| Script | Việc |
|---|---|
| `scripts/academy-ra-soat.mjs` | rà soát toàn bộ: entity trong title, code thiếu nhãn, mermaid sai dạng, bài rỗng, slug trùng, quá giới hạn cột |
| `scripts/academy-doi-chieu-ky.mjs` | tìm môn gắn sai kỳ so với khung ngành |
| `scripts/academy-so-slug-prod.mjs` | slug nào sắp bị `pruneSections` xoá khỏi production |
| `scripts/academy-doi-chieu-syllabus.mjs` | (có sẵn) chấm file môn với syllabus FLM gốc |
| **`scripts/_kiem-tran-slide.mjs`** | ⭐ MỚI 21/09 — đo slide nào TRÀN khỏi khung 1280×720, **chạy TRƯỚC khi render** |

⭐ **`_kiem-tran-slide.mjs` thay cho việc mở từng ảnh đoán bằng mắt.** Nó đọc
khối CSS ra từ `_render-slides.mjs` (không sửa file dùng chung đó), dựng lại
từng slide trong Chromium và so `slide.scrollHeight` với 720.

Hai cái bẫy đã gặp ngay khi viết nó, ghi lại để đừng vấp lại:
- **Đo ở `.bd` thì luôn ra 0.** `.bd` là flex item nên `min-height:auto` khiến
  nó TỰ CAO BẰNG nội dung ⇒ `scrollHeight === clientHeight` kể cả khi tràn.
  Phần thừa lòi ra ở `.slide`, phải đo ở đó.
- Vì vậy script **tự dựng một slide giả nhồi 60 dòng và bắt buộc phải bắt
  được** trước khi tin kết quả; bắt hụt thì thoát mã 2. Nếu không có bước đó,
  bản đầu tiên đã in "✓ không slide nào tràn" cho cả 27 slide bằng một phép đo
  hỏng — tức là báo xanh giả.
- **Nó KHÔNG thấy chữ bị cắt trong SVG** (viewBox tự cắt, không tính là tràn).
  Slide 19 của Ch.5 mất đuôi một dòng chữ và chỉ mở ảnh ra nhìn mới thấy.
  ⇒ vẫn phải mở vài ảnh bằng mắt, nhất là slide có SVG và có `topo()`.

⚠️ `/tmp/nwc204-slides` (7,4 MB, 108 ảnh) **mất cũng được** — đã lên R2 rồi, và
render lại được từ `scripts/slides-src/`.

---

## 6. LẤY SYLLABUS TỪ FLM

Phiên FLM hay hết hạn, phải nhờ người dùng đăng nhập lại rồi thao tác qua tab đó.

```js
// tìm sylID theo mã môn
fetch('/gui/role/student/SyllabusManagement?searchOn=Code&keyword=NWC204')
// đọc chi tiết
fetch('/gui/role/student/SyllabusDetails?sylID=14520')
```

⚠️ Bảng trong trang **đổi vị trí theo môn** (môn có bảng Constructive Questions
thì các bảng sau dịch chỗ) ⇒ **nhận diện bảng theo HEADER**, đừng theo chỉ số.

⚠️ Route `/gui/role/guest/*` và mọi trang `.aspx` quản trị đều **không vào được**.

---

## 7. LIÊN QUAN

- `content/academy/_KHUNG-CHUA-DAY-DU.md` — danh sách môn mới có khung + việc kế tiếp
- `content/academy/_HOP-DONG-SOAN-BAI.md` — chuẩn trình bày chung, có mục ⛔⛔
  **"SƠ ĐỒ và CODE MÀU"** mà mọi agent phải đọc
- `content/academy/_HOP-DONG-NWC204.md` — hợp đồng riêng của môn mạng
- `content/academy/_syllabus-flm/` — syllabus gốc 15 môn
- `content/academy/_mon-flm-chua-co-syllabus.md` — 20 môn FLM chưa công bố
