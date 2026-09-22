# 📋 BÀN GIAO — phiên 20/09/2026, cập nhật 22/09/2026 (xong Ch.5 → Ch.15, Ch.16 đang soạn)

> **Đọc file này + `_KHUNG-CHUA-DAY-DU.md` trước khi làm tiếp Academy.**
> Ghi đủ để phiên sau làm tiếp mà không hỏi lại gì.

---

## 0. 🔴 PHIÊN SAU BẮT ĐẦU TỪ ĐÂY (chốt 22/09/2026, sau khi deploy xong)

**Production đang chạy `f86d8b74` (= hết Ch.12). Ch.13/14/15 + 44 video ĐÃ COMMIT
nhưng CHƯA PUSH, CHƯA DEPLOY.** Xem `git log --oneline origin/main..HEAD`.

> ⚠️ Cây làm việc CÒN 7 file chưa commit của VIỆC KHÁC (firmware/mini-me-robot/**,
> scripts/lab211-*, scripts/codelab-*, scripts/_gen-img.mjs, scratchpad/). **Cố ý
> để nguyên** — không phải của NWC204, và chúng KHÔNG lên production.

### 📖 ĐỌC ĐÚNG 4 FILE NÀY TRƯỚC KHI GÕ BẤT CỨ THỨ GÌ

1. `content/academy/_BAN-GIAO-NWC204.md` — chính file này
2. `content/academy/_HOP-DONG-NWC204.md` — hợp đồng riêng của môn (10 mục, có
   giới hạn kỹ thuật làm seed CHẾT IM LẶNG nếu vượt)
3. `content/academy/_HOP-DONG-SOAN-BAI.md` — chuẩn trình bày chung, mục ⛔⛔
   **"SƠ ĐỒ và CODE MÀU"**
4. `content/academy/_syllabus-flm/NWC204.json` — dữ liệu gốc, đọc bằng script
   chứ đừng đọc bằng mắt (61 dòng buổi + 52 câu hỏi kiến tạo)

### Làm tiếp: **Chương 16 — Build a Small Network (buổi 54–55, Cisco Module 17)** — CHƯƠNG CUỐI

Ch.13, Ch.14, Ch.15 **ĐÃ XONG và đã commit** (xem mục 2). Còn đúng Ch.16 là hết môn.

| Buổi | Topic | LO | Tài liệu |
|---|---|---|---|
| 53 | `Review Modules 8-15` | CLO5-CLO10 | — |
| 54 | `16. Build a Small Network` · `16.1 Devices in a Small Network` · `16.2 Small Network Applications and Protocols` · `16.3 Scale to Larger Networks` | CLO8, CLO9 | Module 17 |
| 55 | `16.4 Verify Connectivity` · `16.5 Host and IOS Commands` · `16.6 Troubleshooting Methodologies` · `16.7 Troubleshooting Scenarios` · `16.8 Integrate AI Tools` | CLO8, CLO9 | Module 17 |
| 58, 59, 60 | `Review` | ⚠️ buổi 60 ghi **CLO1-CLO11** dù môn chỉ có **10 CLO** | Textbook, slides |

**⚠️ Câu hỏi kiến tạo — độ trôi vẫn đảo chiều như Ch.13:**

| Buổi | Câu | Thật ra thuộc |
|---|---|---|
| 54 | `CQ18.3` tường lửa | **Ch.15**, đã trả lời ở bài 15.2 |
| 55 | `CQ19.1` DoS | **Ch.15** |
| 57 (đồ án) | `CQ19.2` tô-pô vật lý/luận lý khi mở rộng | ✅ **đúng Ch.16**, mục 16.3 |
| 58 | `CQ20.1` dự phòng khi router ra ISP hỏng | ✅ **đúng Ch.16**, mục 16.3 |
| 59 | `CQ20.2` QoS giảm độ trễ cho luồng thời gian thực | ✅ **đúng Ch.16**, mục 16.2 |

**Sau Ch.16 là HẾT MÔN.** Chỉ còn 8 buổi đồ án (43–44, 47–48, 51–52, 56–57) —
người dùng chưa yêu cầu soạn phần đó.

### Quy trình đã chạy trơn cho Ch.5 → Ch.12, cứ lặp lại y hệt

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

**14 mục · 58 bài · 326 ảnh slide**, phủ **buổi 1–40 / 60** (22/09/2026).

**Đã ĐO TRÊN DB PRODUCTION sau khi deploy `f86d8b74`**, không đọc log:
- `14 mục · 58 bài · 0 bài rỗng` (script đếm báo 13 "bài rỗng" — đó là 13 bài
  QUIZ, nội dung của chúng nằm ở `lesson_details.quiz_data`, KHÔNG phải lỗi)
- 326 ảnh slide được tham chiếu, chia đúng theo deck:
  `ch01` 18 · `ch02` 26 · `ch03` 23 · `ch04` 23 · `ch04b` 18 · `ch05` 27 ·
  `ch06` 26 · `ch07` 31 · `ch08` 22 · `ch09` 26 · `ch10` 36 · **`ch11` 27** ·
  **`ch12` 23**
- 50 ảnh mới (`ch11`+`ch12`) **đều trả HTTP 200** trên CDN, và đã **so byte** với
  file trên đĩa lúc upload: **khớp 27/27 và 23/23, lệch 0**
- `lesson_details.quiz_data`: **13 bộ · 146 câu** (Ch.10, Ch.11, Ch.12 mỗi chương
  thêm 12 câu, 900 giây, mỗi câu có giải thích song ngữ)
- `lesson_progress` = **0 dòng** ⇒ chưa ai học, không có tiến độ nào để mất

Kiểm trên spec trước khi commit: 58 bài, 0 bài rỗng, **326/326 khối code có nhãn
`language-`**, **46/46 sơ đồ mermaid đúng dạng**, 0 thực thể thô trong `title`,
0 slug trùng, title dài nhất **196/255** ký tự, shortDescription 392/500,
dry-run seed sạch.

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

### ✅ Chương 5 → 15 XONG (Ch.5–12 ĐÃ DEPLOY `f86d8b74` · Ch.13–15 mới COMMIT, CHƯA deploy)

| Chương | Buổi | Bài | Slide | Nguồn |
|---|---|---|---|---|
| Ch.5 Tầng liên kết dữ liệu | 15–16 | 3 + quiz | 27 → `nwc204-ch05/` | `slides-src/nwc204-ch05.mjs` · `nwc204/ch05.mjs` |
| Ch.6 Chuyển mạch Ethernet | 17–20 | 3 + quiz | 26 → `nwc204-ch06/` | `nwc204-ch06.mjs` · `ch06.mjs` |
| Ch.7 Tầng mạng | 21–23 | 3 + quiz | 31 → `nwc204-ch07/` | `nwc204-ch07.mjs` · `ch07.mjs` |
| Ch.8 Phân giải địa chỉ | 24–25 | 2 + quiz | 22 → `nwc204-ch08/` | `nwc204-ch08.mjs` · `ch08.mjs` |
| Ch.9 Cấu hình router cơ bản | 26–29 | 3 + quiz | 26 → `nwc204-ch09/` | `nwc204-ch09.mjs` · `ch09.mjs` |
| **Ch.10 Địa chỉ IPv4** ⭐ | **30–34** | **3 + quiz** | **36 → `nwc204-ch10/`** | `nwc204-ch10.mjs` · `ch10.mjs` |
| **Ch.11 Địa chỉ IPv6** | **35–36** | **2 + quiz** | **27 → `nwc204-ch11/`** | `nwc204-ch11.mjs` · `ch11.mjs` |
| **Ch.12 ICMP + Lab 2.3** | **37–40** | **2 + quiz** | **23 → `nwc204-ch12/`** | `nwc204-ch12.mjs` · `ch12.mjs` |
| **Ch.13 Tầng giao vận** ⭐ | **41–42** | **2 + quiz** | **22 → `nwc204-ch13/`** | `e2877548` |
| **Ch.14 Tầng ứng dụng** | **45–46** | **2 + quiz** | **26 → `nwc204-ch14/`** | `96d0e1ba` |
| **Ch.15 An ninh mạng** | **49–50** | **2 + quiz** | **26 → `nwc204-ch15/`** | `e2877548` |

Sáu commit của Ch.5–9 đã lên `origin/main`: `1f6aba5e` `8170093b` `26b62adb`
`39fed066` `e2ed4300` `17306442`. Ch.10 là **`af3f87b1`**, Ch.11 là
**`f087483e`**, Ch.12 là **`f86d8b74`** (tất cả 22/09/2026).

**Phần ★ đã thêm ở Ch.7/8/9** (ngoài giáo trình, để dùng được cho việc thật):
- Ch.7 — lỗ đen MTU + cách chứng minh bằng `ping -M do`, cờ DF và MSS clamping,
  `ip route get`, nhiều bảng định tuyến với `ip rule`, tuyến Docker tự cắm vào máy chủ.
- Ch.8 — năm trạng thái bảng láng giềng (**STALE là BÌNH THƯỜNG, FAILED mới là
  lỗi**), ARP tự khai, phát hiện giả mạo ARP và **ba** cách giải thích cho MAC
  trùng, proxy ARP, `ip -6 neigh` trên máy thật.
- Ch.9 — ba lệnh Linux `ip addr`/`ip link`/`ip route` là CÙNG ba ý của IOS, siết
  SSH trên VPS (bẫy thứ tự drop-in `01-`, nghiệm thu bằng `sshd -T`), "chạy được"
  khác "sống qua khởi động lại", dựng lại Lab 2.1 bằng network namespace.
- **Ch.10** — đọc BA mạng IPv4 trên một máy chủ thật (`eth0` công cộng /24,
  `docker0` 172.17.0.0/16, `br-*` compose 172.18.0.0/16) bằng `ip -br addr` và
  `ip route`; `ip_forward=1` nghĩa là VPS CHÍNH LÀ router; CIDR là đơn vị của
  luật `ufw` và `allow/deny` của nginx (lệch một bit = gấp đôi số máy được vào,
  **không có cảnh báo nào**); ba kiểu đụng dải trông y như lỗi phần mềm
  (VPN↔Docker cùng 172.18/16 · site-to-site cùng 192.168.1.0/24 · CGNAT
  100.64/10 không port-forward được); 169.254.169.254 là metadata của máy ảo;
  Tailscale dùng 100.x; `/31` (RFC 3021) và `/32`.
  ⚠️ **Địa chỉ công cộng thật của VPS đã ĐƯỢC THAY bằng 198.51.100.208/24
  (TEST-NET-2)** trong slide và bài — đừng đăng IP thật lên trang công khai.
- **Ch.11** — 13 địa chỉ `fe80::` có sẵn trên VPS mà KHÔNG ai cấu hình, và 0 địa
  chỉ toàn cục (nhà cung cấp chỉ cấp IPv4); **EUI-64 kiểm NGƯỢC từ MAC thật của
  router thượng nguồn**: `96:3d:fa:00:04:e9` → `fe80::943d:faff:fe00:4e9`, khớp
  từng byte với `ip -6 neigh`; nginx đã `listen [::]:80/443` sẵn;
  `net.ipv6.conf.all.forwarding = 0` (ngược với IPv4); **bẫy `::1` so với
  `127.0.0.1`** (dịch vụ gắn 127.0.0.1, `localhost` phân giải `::1` trước ⇒
  `curl 127.0.0.1` được mà `curl localhost` bị từ chối; chứng minh bằng
  `curl -4` so `curl -6`); và `%eth0` bắt buộc khi ping link-local.
- **Ch.12** — ping tới địa chỉ TRỐNG trong chính subnet của mình → **IM LẶNG**,
  100% mất gói, KHÔNG có "host unreachable" (⇒ hỏng im lặng mới là thường, và
  im lặng gần như không mang thông tin); **TTL đếm ra số chặng** (1.1.1.1
  ttl=55 → 9 chặng; 8.8.8.8 ttl=118 → 10 chặng); `tracepath` thật có hop 1
  **"no reply"** mà hop 2–10 vẫn đáp, kèm nhãn **`asymm`** ⇒ đường đi ≠ đường
  về; **path MTU**: `-M do -s 1472` (=1500) lọt, `-s 1473` trả nguyên văn
  `ping: local error: message too long, mtu=1500`; **hố đen PMTU** khi ICMP bị
  chặn (bắt tay xong, trang nhỏ chạy, gói trả lời lớn treo vĩnh viễn);
  `ping6 ff02::1%eth0` chỉ CHÍNH MÁY đó đáp (0,055 ms); exit code 0/1 dùng được
  trong script.

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
| **30** | **(BỎ TRỐNG)** | — | 10.1 — nêu rõ, tự soạn 2 câu ★ |
| 31 | CQ11.1 | **"Progress Test 2"** — không phải câu hỏi | 10.2 — trích nguyên văn, nêu rõ |
| 32 | CQ11.2 | Ch.10 mục **10.2** (buổi 30) | 10.3 — trả lời đầy đủ, trỏ về 10.1 |
| 33 | CQ11.3 | Ch.10 mục **10.3** (buổi 30) | 10.3 — trả lời đầy đủ, trỏ về 10.1 |
| 34 | CQ12.1 | Ch.10 mục **10.1** (buổi 30) | 10.3 — nêu, đáp án ở 10.1 |
| 35 | CQ12.2 | **Ch.10** — tính địa chỉ IPv4 tối ưu = VLSM, mục 10.8 | 11.1 — trỏ về 10.2, tự soạn 2 câu ★ |
| **36** | **(BỎ TRỐNG)** | — | 11.2 — nêu rõ, tự soạn 2 câu ★ |
| 37 | CQ13.1 | **Ch.11** mục 11.2 (IPv4 Issues) | 12.1 — trỏ về 11.1 |
| 38 | CQ13.2 | **Ch.11** mục 11.4 (các loại địa chỉ IPv6) | 12.2 — trỏ về 11.1 |
| 39 | CQ13.3 | **Ch.11** mục 11.5 (cấu hình IPv6 trên Cisco) | 12.2 — trỏ về 11.2 |
| 40 | CQ14.1 | **khớp đúng** (ICMP là gì) — nhưng rơi vào buổi Lab 2.3 | 12.2 — trả lời đầy đủ |
| 41 | CQ14.2 | **Ch.12** mục 12.2 (kiểm kết nối bằng ICMP) | → sẽ trỏ về 12.2 ở Ch.13 |
| 42 | CQ14.3 | **Ch.12** mục 12.2; **"Do lab 7" KHÔNG TỒN TẠI** trong 60 buổi | → nêu ở Ch.13, đừng đoán lab nào |

Thêm một chỗ nữa: **buổi 27 liệt kê `9.2` rồi NHẢY THẲNG sang `9.4`** — không có
mục `9.3` ở đâu trong bảng đã công bố. Đã nói thẳng trong bài 9.2.

Các buổi còn trống câu hỏi kiến tạo: **6, 9, 15, 16, 22, 30, 36, 56** — buổi 30
xử ở Ch.10 và buổi 36 xử ở Ch.11, cả hai đều nêu rõ là bảng bỏ trống rồi tự soạn
2 câu ★. **Còn lại buổi 56.**

⭐ **Ở Ch.13 thì độ trôi ĐẢO CHIỀU:** `CQ15.1/15.2/15.3` (buổi 43–45) khớp ĐÚNG
nội dung Ch.13, nhưng buổi 43–45 lại là các buổi ĐỒ ÁN, còn buổi 41–42 nơi dạy
Ch.13 thì mang `CQ14.2/14.3` của Ch.12. Nêu cả hai chiều.

### NWC204 buổi 41–60 (4 chương + đồ án) — CÒN LẠI

| Chương | Buổi | Nội dung |
|---|---|---|
| **Ch.13** | **41–42** | **Transport Layer + SỐ HIỆU CỔNG (Module 14)** ⭐ LÀM TIẾP TỪ ĐÂY — người dùng cần cho công việc |
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

### Ch.10 (22/09) — ĐÚNG BÀI HỌC ĐÓ LẶP LẠI, ba lỗi nữa

`_kiem-tran-slide.mjs` lại báo **"✓ không slide nào tràn"** cho cả 36 slide, và
mở ảnh ra vẫn thấy **ba lỗi**, cả ba đều nằm trong SVG:

| Lỗi | Slide | Vì sao bộ đo không thấy |
|---|---|---|
| Nhãn `AND` chạm vào `255.255.255.192` ở cột bên trái | ch10 #7 | hai `<text>` cạnh nhau, không tràn khung |
| **Khung đỏ đánh dấu đặt LỆCH** sang vùng trống bên phải | ch10 #7 | `<rect>` không phải chữ, tràn hay không cũng không ai đo |
| Chữ trong hộp màu **bị CẮT ở mép** (`6 host bits = 62 hosts` trong hộp 172px) | ch10 #17 | chữ dài hơn `<rect>` nhưng vẫn trong viewBox |
| Hai nhãn `/30` **đè lên nhau** (hộp chỉ rộng 14px) | ch10 #22 | nằm trong khung, chỉ xấu |

**Số đo THẬT của bề rộng chữ đơn cách** (đo lại trên ảnh đã render, không đoán):
**0,602 × font-size** mỗi ký tự. Với `viewBox` rộng 900 và chữ bắt đầu ở `x="4"`:

| font-size | px/ký tự | tối đa 1 dòng |
|---|---|---|
| 15 | 9,03 | **99 ký tự** |
| 14 | 8,43 | **106 ký tự** |
| 13 | 7,83 | **114 ký tự** |
| 11 | 6,62 | **135 ký tự** |

⚠️ **Dùng đúng con số đó để đặt `<rect>` đánh dấu.** Muốn khoanh 8 ký tự cuối
của một chuỗi 35 ký tự bắt đầu ở `x=320`, font 15: ký tự thứ 27 nằm ở
`320 + 27 × 9,03 = 564`, bề rộng `8 × 9,03 = 72`. Đặt bằng mắt là lệch.

⚠️ **Chữ trong một `<rect>` màu phải NGẮN HƠN cái rect.** Kiểm:
`số ký tự × 0,602 × font-size < bề rộng rect`. Vượt là chữ lòi ra hoặc trông
như bị cắt — bộ đo KHÔNG bắt, vì nó chỉ đo chiều CAO của `.slide`.

⚠️ **Khối tỉ lệ quá nhỏ thì ĐỪNG nhét chữ vào trong.** Hai khối `/30` trong dải
VLSM chỉ chiếm 4/256 = 14px — giữ tỉ lệ THẬT (đó là cả ý nghĩa của hình) rồi
kéo một cái **ngoặc dẫn xuống dưới** và ghi nhãn ở chỗ rộng.

### Ch.13–15 (22/09) — hai lỗi mới, KHÔNG phải lỗi hình học

Công thức 0,602 giờ đã vào hợp đồng giao cho agent, và **cả ba deck đều 0 lỗi
tràn/cắt**. Nhưng xuất hiện hai lớp lỗi khác:

1. ⛔ **Slide Ch.14 in ĐỊA CHỈ IP CÔNG KHAI THẬT của VPS** lên trang học công
   khai. Agent soạn bài đo bằng IP thật rồi để nguyên, dù đã tự báo là "đã che
   danh". Tôi bắt được **nhờ MỞ ẢNH RA NHÌN sau khi render** — bộ đo không bao
   giờ thấy loại lỗi này. Đã thay 33 chỗ bằng `198.51.100.208` (TEST-NET-2,
   RFC 5737) rồi render lại.
   ⇒ **Luật mới: mọi bài/slide chỉ dùng dải tài liệu `198.51.100.x` /
   `203.0.113.x` / `2001:db8::/32`. Không bao giờ in IP thật của hạ tầng.**
   Đã đưa vào hợp đồng giao agent.
2. ⛔ **Bộ SO BYTE của chính tôi báo sai.** Cờ `-m 10` của curl **cắt ngang lượt
   tải** — HTTP 200 mà chỉ về 32768/46188 byte ⇒ báo lệch 22/22 trong khi upload
   hoàn toàn đúng. Suýt render lại cả deck vô ích.
   ⇒ **Dùng HEAD đọc `content-length`, đừng tải cả file:**
   ```bash
   curl -sI -m 15 "<url>" | awk -F': ' 'tolower($1)=="content-length"{gsub(/\r/,"");print $2}'
   ```
   Cùng bài học với [[feedback_verify_the_checker_before_the_content]] — lần này
   bộ kiểm sai chứ không phải nội dung sai.

### Ch.11 và Ch.12 (22/09) — công thức 0,602 ĐÃ CHỨNG MINH GIÁ TRỊ

Dùng công thức thay vì mắt, và mỗi deck chỉ còn **một** lỗi thay vì ba–sáu:

| Deck | Lỗi bộ đo KHÔNG thấy | Cách vá |
|---|---|---|
| ch11 #6 | `<rect>` đánh dấu đặt lệch sang chỗ trống | tính `x = 24 + 16×9,03 = 168`, `width = 5×9,03 = 45` |
| ch11 #6 | chú thích vừa thêm lại ĐÈ đuôi địa chỉ | địa chỉ 25 ký tự kết thúc ở x=250 ⇒ dời chú thích sang x=290 |
| ch12 #15 | chú thích "sender retries at 1400" đè hộp `server` | hộp ở x=760, chữ 33 ký tự font 11 = 218px ⇒ dời xuống **hàng khác** (y=116) |

**Quy trình đã chốt, cứ lặp lại:** trước khi đặt bất kỳ `<rect>` hay nhãn nào,
chạy một dòng `python3` tính `x` và `width` từ vị trí ký tự và `0,602 × font-size`.
Mất 5 giây, và nó thay hẳn vòng lặp render–nhìn–đoán–render lại.

⚠️ **Vẫn phải MỞ ẢNH RA NHÌN.** Công thức bắt được chuyện *lệch*, nhưng lỗi ở
ch11 #6 lần hai — chú thích mới đè lên chữ cũ — chỉ mắt mới thấy, vì về mặt số
thì cả hai đều nằm trong viewBox.

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

### 4.2b Lỗi tự gây ra 22/09 (Ch.10) — `lesson.content` PHẢI là String

Viết `content: [ bi(...), walk(...), ... ]` rồi **quên `.join('\n')`** ở cuối.
Hậu quả:
- `node --check` XANH · `import()` XANH · file nạp được bình thường.
- `academy-ra-soat.mjs` **đổ ngay** với `TypeError: t.trim is not a function`,
  và nó đổ ở dòng 52 nên **không rà được môn nào cả** — nhìn tưởng bộ rà hỏng.
- Nếu bộ rà không chạy thì chỗ này lọt tới lúc seed.

⇒ Mọi khối `content: [...]` trong `nwc204/*.mjs` đều kết thúc bằng
**`].join('\n'),`**. Kiểm nhanh trước khi commit:
```bash
node -e "import('./content/academy/nwc204/chNN.mjs').then(m=>m.default[0].lessons.forEach(l=>console.log(l.slug, typeof l.content)))"
```
Phải in ra `string` cho bài DOCUMENT, `undefined` cho bài QUIZ.
Cùng một bài học với [[feedback_seeder_lesson_content_phai_la_string]].

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

## 4b. 🎬 VIDEO YOUTUBE — 44 link, ĐÃ GẮN (22/09/2026)

Bản đồ: `content/course-videos/nwc204-computer-networking.mjs`. Seed bằng
`course-video-seed.mjs`, **chạy tự động trong deploy** — không có bước tay nào.
Hạ tầng này đã chạy thật cho môn Academy khác (CSI106 có 33/46 bài).

**Xương sống là Jeremy's IT Lab** (bộ CCNA 200-301 miễn phí, tiếng Anh rõ, CÓ
Packet Tracer): 19/44 bài. Còn lại Practical Networking, Neso Academy,
NetworkChuck, David Bombal, Kevin Wallace (CCIE), PowerCert, Sunny Classroom.
Các bài **Lab** dùng video quay ĐÚNG số hiệu lab mà syllabus ghi: `2.9.1`,
`4.6.6`, `10.4.4`, `11.10.1`.

⛔ **MỤC 0 (7 bài) CỐ Ý ĐỂ TRỐNG** — hồ sơ môn, cách tính điểm, CLO, giáo trình,
kế hoạch 60 buổi, nhiệm vụ SV, câu hỏi kiến tạo. Nội dung hành chính riêng của
FPTU; không video nào nói đúng về nó. **Bỏ trống tốt hơn nhét sai.**

⚠️ **KHÔNG BAO GIỜ để model đoán ID YouTube.** 27% link model sinh ra là 404, và
ảnh xám "video không còn" **vẫn trả HTTP 200** nên kiểm bằng mã trạng thái là vô
dụng. Quy trình đã dùng, cho 0 ID chết:
1. `curl 'youtube.com/results?search_query=…'` → bóc `videoId` từ `ytInitialData`
   (chuỗi do CHÍNH YouTube trả về, không phải chuỗi model đoán)
2. nghiệm thu từng ID bằng oEmbed — nó trả **400/404 thật** khi video chết
3. `credit` chép ĐÚNG `author_name — title` mà oEmbed in ra
Công cụ tìm nằm ở scratchpad `yt-tim.mjs` (có thử lại, giãn nhịp 900ms, và
`--da-xong` để chạy tiếp khi đứt giữa chừng — YouTube chặn tốc độ sau ~10 truy vấn).

**Năm phép kiểm trước khi tin bản đồ** (đều sạch): ID dùng cho hai bài trong cùng
môn 0 · credit đúng dạng "Kênh — Tiêu đề" 44/44 · ID đúng 11 ký tự 44/44 · slug
mồ côi 0 và **đối chiếu thẳng DB production khớp 38/38** · `verify-youtube-videos.mjs`
ra **44 link · 0 chết · 0 lệch nguồn**.

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
