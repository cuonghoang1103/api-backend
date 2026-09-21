# 📋 BÀN GIAO — phiên 20/09/2026, cập nhật 21/09/2026 (xong Ch.5 → Ch.9, ĐÃ DEPLOY)

> **Đọc file này + `_KHUNG-CHUA-DAY-DU.md` trước khi làm tiếp Academy.**
> Ghi đủ để phiên sau làm tiếp mà không hỏi lại gì.

---

## 0. 🔴 PHIÊN SAU BẮT ĐẦU TỪ ĐÂY (chốt 21/09/2026, sau khi deploy xong)

**Không còn gì treo. Cây sạch, đã push, production đang chạy `17306442`.**

### 📖 ĐỌC ĐÚNG 4 FILE NÀY TRƯỚC KHI GÕ BẤT CỨ THỨ GÌ

1. `content/academy/_BAN-GIAO-NWC204.md` — chính file này
2. `content/academy/_HOP-DONG-NWC204.md` — hợp đồng riêng của môn (10 mục, có
   giới hạn kỹ thuật làm seed CHẾT IM LẶNG nếu vượt)
3. `content/academy/_HOP-DONG-SOAN-BAI.md` — chuẩn trình bày chung, mục ⛔⛔
   **"SƠ ĐỒ và CODE MÀU"**
4. `content/academy/_syllabus-flm/NWC204.json` — dữ liệu gốc, đọc bằng script
   chứ đừng đọc bằng mắt (61 dòng buổi + 52 câu hỏi kiến tạo)

### Làm tiếp: **Chương 10 — IPv4 Addressing (buổi 30–34, Cisco Module 11)** ⭐

Đây là **chương NẶNG NHẤT của cả môn** và là chỗ **bắt buộc phải nối vào chương
bù hệ đếm** (`ch04b`, nhị phân/hex/AND theo bit) — trường KHÔNG xếp buổi nào cho
Module 5 của Cisco, mà buổi 30–34 thì không làm được nếu không đọc được nhị phân.

**Dàn bài đã trích nguyên văn từ `_syllabus-flm/NWC204.json`:**

| Buổi | Topic | LO | ITU | Tài liệu |
|---|---|---|---|---|
| 30 | 10.1 IPv4 Address Structure · 10.2 IPv4 Unicast, Broadcast, and Multicast · 10.3 Types of IPv4 Addresses · 10.4 Network Segmentation | CLO5, CLO9 | T | Module 11 |
| 31 | 10.5 Subnet an IPv4 · 10.6 Subnet a /16 and /8 Prefix · 10.7 Subnet to Meet Requirements · **10.8 Variable Length Subnet Masking** · 10.9 Structured Design · 10.10 Integrate AI Tools (Self Learning) | CLO5, CLO9 | T | Module 11 |
| 32 | **Lab 2.2** (Dialogue-based Assessment & Self Learning) — Calculate IPv4 Subnets · Design and Implement a VLSM Addressing Scheme · Use AI Tools for Calculating IPv4 Subnets | CLO5, CLO9 | U | 11.6.6 + 11.10.2 Lab Manual |
| 33 | Lab 2.2 (continue) | CLO5, CLO9 | U | như trên |
| 34 | **Midterm Progress Test** | CLO1 – CLO9 | — | — |

⇒ Cấu trúc gợi ý: **3 bài + quiz**, giống Ch.7 và Ch.9 —
10.1 (buổi 30) · 10.2 (buổi 31, phần subnet + VLSM) · 10.3 (buổi 32–33, Lab 2.2).

**⚠️ Câu hỏi kiến tạo của chương này — TRÔI DẠT NẶNG, đã trích để khỏi đoán:**

| Buổi | Câu | Nội dung | Thật ra thuộc |
|---|---|---|---|
| **30** | **(BỎ TRỐNG)** | — | — |
| 31 | `CQ11.1` | **"Progress Test 2"** — KHÔNG phải câu hỏi | môn chỉ có MỘT Midterm, ở buổi 34 |
| 32 | `CQ11.2` | unicast / broadcast / multicast | mục **10.2**, tức buổi 30 |
| 33 | `CQ11.3` | mấy loại địa chỉ IPv4, dùng thế nào | mục **10.3**, tức buổi 30 |
| 34 | `CQ12.1` | cấu trúc một địa chỉ IPv4 | mục **10.1**, tức buổi 30 |

Tức là **cả bốn câu đều lệch**, và ba câu cuối đều hỏi về nội dung của buổi 30
trong khi được gán cho buổi 32–34 (vốn là Lab 2.2 và Midterm).
**Nêu trong bài, đừng tự sửa bảng gốc** — đúng như đã làm ở Ch.7/8/9.

⚠️ **Mọi phép tính subnet trong bài PHẢI kiểm lại bằng `python3`** trước khi
commit (hợp đồng môn, mục 9). Chương này đầy số; sai một con là hỏng cả bài.
Dùng `ipaddress` của Python cho nhanh và khỏi tự tính sai:
```python
import ipaddress
n = ipaddress.ip_network('192.168.4.0/26')
print(n.network_address, n.broadcast_address, n.num_addresses - 2)
```

**Sau Ch.10 thì theo thứ tự:** Ch.11 IPv6 (buổi 35–36) · Ch.12 ICMP + Lab 2.3
(37–40) · **Ch.13 Transport Layer — SỐ HIỆU CỔNG (41–42)** ⭐ người dùng cần cho
công việc · Ch.14 Application (45–46) · Ch.15 Security (49–50) · Ch.16 Build a
Small Network (53–55, 58–60) · Đồ án (43–44, 47–48, 51–52, 56–57).

### Quy trình đã chạy trơn cho Ch.5 → Ch.9, cứ lặp lại y hệt

viết deck → `_kiem-tran-slide.mjs` → render → **mở 4–5 ảnh ra NHÌN** → upload →
**so byte với CDN** → viết bài → `node --check` → rà soát riêng cho môn →
commit → `echo y | bash deploy-nha.sh` → **đếm lại bằng DB, đừng tin log**.

**Yêu cầu của người dùng, chốt 21/09, áp dụng cho mọi chương còn lại:**
- Bám **100% giáo trình FLM trước**, rồi **bổ sung thêm cho sâu** để dùng được
  trong công việc — và **mọi phần bổ sung phải đánh dấu ★**.
- Slide **ít chữ**, thiên sơ đồ; phần giảng dài nằm ở dưới ảnh.
- Code trong bài phải **có nhãn `language-`**; sơ đồ phải là
  `<pre><code class="language-mermaid">` và **luôn tô màu**.
- **Tối đa 3 subagent** một lúc. Ch.5 → Ch.9 làm **không dùng agent nào** —
  soạn bài liên tục thì tung agent chỉ tốn thêm token đọc lại file.

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

**11 mục · 48 bài · 240 ảnh slide**, phủ **buổi 1–29 / 60** (21/09/2026).

**Đã ĐO TRÊN DB PRODUCTION sau khi deploy `17306442`**, không đọc log:
- `11 mục · 48 bài · 0 bài rỗng`
- 240 ảnh slide được tham chiếu, chia đúng theo deck:
  `ch01` 18 · `ch02` 26 · `ch03` 23 · `ch04` 23 · `ch04b` 18 · `ch05` 27 ·
  `ch06` 26 · `ch07` 31 · `ch08` 22 · `ch09` 26
- 79 ảnh mới (`ch07`+`ch08`+`ch09`) **đều trả HTTP 200** trên CDN, và đã **so
  byte** với file trên đĩa lúc upload: lệch 0/31, 0/22, 0/26
- 3 quiz mới đều có **12 câu, 12 câu có giải thích, 900 giây** trong
  `lesson_details.quiz_data`

Kiểm trên spec trước khi commit: 48 bài, 0 bài rỗng, **224/224 khối code có nhãn
`language-`**, **32/32 sơ đồ mermaid đúng dạng**, 0 thực thể thô trong `title`,
0 slug trùng, title dài nhất **196/255** ký tự, shortDescription 392/500.

⚠️ **Quiz nằm ở `lesson_details.quiz_data` (JSON)**, KHÔNG có bảng `Quiz`
riêng. Muốn đếm câu hỏi thì đi qua `lesson.details.quizData.questions`.
⚠️ `CourseSection` **không có trường `order`** — tên đúng là **`sortOrder`**.
(Hai chỗ này đã làm tôi chạy hỏng script đếm hai lần.)

### Bản vá toàn site cùng đợt

- **853 tiêu đề bài ở 77 môn** in ra chữ `&amp;` thô → đã vá, giờ 0.
- **Xếp môn theo khung ngành** (`xepTheoKhung`) → `SSG105` về Kỳ 5 kèm `SSG104`
  nhãn *mã cũ*, và 8 môn lệch kỳ khác về đúng chỗ.
- `RAI101` + `APO202` thôi bị mất hẳn (trước đó gắn vào kỳ `isActive=false`).
- **Trang học Academy giờ vẽ được sơ đồ mermaid** (trước nay chưa bao giờ gọi bộ vẽ).

---

## 2. CÒN NỢ — làm tiếp từ đây

### ✅ Chương 5 → 9 XONG và ĐÃ DEPLOY 21/09/2026 (commit `17306442`)

| Chương | Buổi | Bài | Slide | Nguồn |
|---|---|---|---|---|
| Ch.5 Tầng liên kết dữ liệu | 15–16 | 3 + quiz | 27 → `nwc204-ch05/` | `slides-src/nwc204-ch05.mjs` · `nwc204/ch05.mjs` |
| Ch.6 Chuyển mạch Ethernet | 17–20 | 3 + quiz | 26 → `nwc204-ch06/` | `nwc204-ch06.mjs` · `ch06.mjs` |
| Ch.7 Tầng mạng | 21–23 | 3 + quiz | 31 → `nwc204-ch07/` | `nwc204-ch07.mjs` · `ch07.mjs` |
| Ch.8 Phân giải địa chỉ | 24–25 | 2 + quiz | 22 → `nwc204-ch08/` | `nwc204-ch08.mjs` · `ch08.mjs` |
| Ch.9 Cấu hình router cơ bản | 26–29 | 3 + quiz | 26 → `nwc204-ch09/` | `nwc204-ch09.mjs` · `ch09.mjs` |

Sáu commit đã lên `origin/main`: `1f6aba5e` `8170093b` `26b62adb` `39fed066`
`e2ed4300` `17306442`.

**Phần ★ đã thêm ở Ch.7/8/9** (ngoài giáo trình, để dùng được cho việc thật):
- Ch.7 — lỗ đen MTU + cách chứng minh bằng `ping -M do`, cờ DF và MSS clamping,
  `ip route get`, nhiều bảng định tuyến với `ip rule`, tuyến Docker tự cắm vào máy chủ.
- Ch.8 — năm trạng thái bảng láng giềng (**STALE là BÌNH THƯỜNG, FAILED mới là
  lỗi**), ARP tự khai, phát hiện giả mạo ARP và **ba** cách giải thích cho MAC
  trùng, proxy ARP, `ip -6 neigh` trên máy thật.
- Ch.9 — ba lệnh Linux `ip addr`/`ip link`/`ip route` là CÙNG ba ý của IOS, siết
  SSH trên VPS (bẫy thứ tự drop-in `01-`, nghiệm thu bằng `sshd -T`), "chạy được"
  khác "sống qua khởi động lại", dựng lại Lab 2.1 bằng network namespace.

### 📌 Bất thường của bảng gốc FLM — ĐÃ NÊU TRONG BÀI, KHÔNG TỰ SỬA

Từ buổi 19 trở đi, **số hiệu câu hỏi kiến tạo chạy chậm hơn kế hoạch buổi học
khoảng MỘT CHƯƠNG**. Bản đồ đầy đủ cho phần đã làm:

| Buổi | Câu | Nội dung thật thuộc | Đã xử lý ở |
|---|---|---|---|
| 19–20 | CQ7.1, CQ7.2 | Ch.6 (Lab 1.4) | bài 6.3 |
| 21 | CQ7.3 | Ch.6 (Ethernet switching) | 7.1 — trỏ về 6.3 |
| **22** | **(BỎ TRỐNG)** | — | 7.2 — tự soạn 2 câu ★ |
| 23 | CQ8.1 | **tiền đề SAI**: hỏi "vì sao cần IP cho truyền thông TIN CẬY" mà IP cố ý KHÔNG tin cậy | 7.3 — đính chính rồi trả lời 3 phần |
| 24 | CQ8.2 | Ch.7 (bảng định tuyến) | 8.1 — trỏ về 7.2 |
| 25 | CQ9.1 | **khớp đúng** (ARP) | 8.2 |
| 26 | CQ9.2 | Ch.8 (Neighbor Discovery) | 9.1 — trỏ về 8.2 |
| 27 | CQ9.3 | Ch.8 (ARP vs IP) | 9.2 — trỏ về 8.1/8.2 |
| 28–29 | CQ10.1, CQ10.2 | **khớp đúng** (Lab 2.1) | 9.3 |

Thêm một chỗ nữa: **buổi 27 liệt kê `9.2` rồi NHẢY THẲNG sang `9.4`** — không có
mục `9.3` ở đâu trong bảng đã công bố. Đã nói thẳng trong bài 9.2.

Các buổi còn trống câu hỏi kiến tạo: **6, 9, 15, 16, 22, 30, 36, 56** — buổi 30
sẽ gặp ngay ở chương kế tiếp.

### NWC204 buổi 30–60 (7 chương + đồ án) — CÒN LẠI

| Chương | Buổi | Nội dung |
|---|---|---|
| **Ch.10** | **30–34** | **IPv4 Addressing + chia subnet + VLSM + Midterm** ⭐ nặng nhất, nối vào chương bù `ch04b` |
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

## 3b. LỖI ĐÃ GẶP KHI DỰNG SLIDE Ch.7/8/9 — đọc trước khi dựng Ch.10

`_kiem-tran-slide.mjs` bắt được **tràn dọc** và không bắt được gì khác. Đợt này
nó báo "không slide nào tràn" mà **mở ảnh ra vẫn thấy 6 lỗi**, cả sáu đều là
**chữ bị CẮT trong SVG** hoặc **nhãn đè lên hộp**:

| Lỗi | Slide | Vì sao bộ đo không thấy |
|---|---|---|
| Chữ tràn khỏi `viewBox` của SVG bị cắt cụt | ch07 #10, #12, ch09 #13 | viewBox tự cắt, `scrollHeight` không đổi |
| Nhãn `topo()` rộng hơn hình ô van, đè lên đường nối | ch07 #22, ch08 #2 | nằm trong khung, chỉ xấu chứ không tràn |
| Nhãn giữa hai hộp SVG đè lên cả hai hộp | ch09 #10 | như trên |

**Cách tính để khỏi vấp lại** — font chữ đơn cách trong SVG rộng ≈ **0,6 × cỡ chữ**:

```
số ký tự tối đa ≈ (chiều rộng viewBox − x bắt đầu) / (0,6 × font-size)
```

Cụ thể, với `viewBox` rộng **900** và chữ bắt đầu ở `x="4"`:
- `font-size="15"` → tối đa **~99 ký tự** một dòng
- `font-size="14"` → tối đa **~105 ký tự**
- `font-size="13"` → tối đa **~114 ký tự**

Vượt là bị cắt **câm**, không có cảnh báo nào.

**Quy ước đã chốt cho các deck NWC204:** SVG dùng `viewBox="0 0 900 <h>"` với
`width="1150"`. Nhãn trong `topo()` giữ **ngắn** (≤ 10 ký tự cho ô van router) —
địa chỉ IP dài thì đẩy xuống `kv()` bên dưới, đừng nhét vào hình.

**Slide quá dài thì CHIA HAI CỘT, đừng thu nhỏ chữ.** Hai slide cấu hình Lab 2.1
của Ch.9 tràn +27px và +91px; bọc trong `<div class="two">` với hai khối `code()`
là vừa khít và dễ đọc hơn hẳn.

⭐ **Vẫn phải mở ít nhất 4–5 ảnh mỗi deck ra NHÌN.** Bộ đo cho bạn sự tự tin sai
nếu tin nó một mình — xem [[feedback_verify_the_checker_before_the_content]].

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
- **Backtick markdown trong khối `<pre><code>` làm VỠ file bài** (21/09, Ch.6).
  Viết `-> matches \u0060ip -br link\u0060 exactly` bên trong một khối code — quen tay
  theo lối markdown — mà cả bài là một **template literal của JS**, nên dấu
  backtick đó ĐÓNG chuỗi sớm. `node --check` báo `missing ) after argument list`
  ở dòng mở chuỗi, cách chỗ sai gần 20 dòng, nên nhìn dòng báo lỗi không ra.
  ⇒ Trong nội dung bài **chỉ dùng `<code>...</code>` hoặc dấu nháy kép**, tuyệt
  đối không backtick. Hợp đồng đã ghi "KHÔNG backtick lồng" — vẫn vấp.

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

### 4.7 Đợt deploy chiều 21/09/2026 — chạy trơn, ghi lại con số để so sau

Commit `17306442`, 6 commit một lượt. Không có sự cố nào. Mốc thời gian thật:

| Bước | Hết |
|---|---|
| Kiểm đề thi + dựng hai ảnh song song ở máy nhà, đẩy GHCR, VPS tráo | 16:25 → ~16:33 |
| **Seed Academy** (bước nặng nhất, seed CẢ site chứ không riêng NWC204) | 16:33:32 → 16:39:46 (**6 phút 14**) |
| Các seed còn lại (phụ đề, video, Exp Hub, Exam Room, RoadMap, repo, IELTS) | → 16:54:48 |
| Backend khoẻ + smoke-test 65 route | 16:54:57 |
| nginx.conf không đổi, vẫn reload nhẹ để RAM khớp đĩa | 16:54:58 |
| **Bộ kiểm CI** (backend tsc · eval:grader · eval:cv-linter · npm test · frontend tsc) | 16:55:03 → 16:55:34 |
| **`git push origin HEAD:main`** | 16:55:34 |
| Kiểm lại container đang chạy ĐÚNG ảnh (so mã băm) | 16:55:38 |

**Tổng ~30 phút.** Phần lớn là seed nội dung, không phải build. Biết con số này
để lần sau đừng tưởng nó treo — và để so khi nó chậm bất thường.

Script có hai chốt đáng tin mà phiên sau nên biết:
- Nó **kiểm bản sắp deploy có chứa mã production đang chạy không** trước khi làm
  gì (chống lùi production từ nhánh tách rời).
- Sau khi tráo nó **so mã băm ảnh** đang chạy trong container, không tin log.
- Nó **CẢNH BÁO** những file chưa commit sẽ không lên production. Đợt này có 5
  file `firmware/mini-me-robot/**` + `scripts/lab211-gan-link-github.mjs` còn dở
  của việc khác — **cố ý để nguyên**, không phải của NWC204.

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
