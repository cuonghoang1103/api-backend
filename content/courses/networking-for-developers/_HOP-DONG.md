# Hợp đồng soạn — khoá "Networking for Developers" (/courses/networking-for-developers)

> Đọc HẾT trước khi sửa một dòng. Bài MẪU đã soạn trọn (31/10/2026): **Mục 0** (`s00-gioi-thieu.mjs` + `bai/00a…003`) và
> **Chương 1** (`s01-tang-goi-tin.mjs` + `bai/010…016`). Chỗ nào file này không nói, làm như Chương 1.
> **Chương 2 soạn trọn 01/11/2026** (`s02-dia-chi-dinh-tuyen.mjs` + `bai/020…026`, deck `nfd-02-1…5` + `nfd-lab-2` ở NFD/v1,
> 5 mô phỏng mới subnet/route/nat/ipv6/bgp, Code Lab `netdev-2-*`). Bài MỞ CHƯƠNG (2.1) có khối "🎯 Chương N trong một khung —
> học xong làm được gì + vì sao lập trình viên cần" ở đầu bài đọc và slide 2 của deck — chương sau làm y như vậy.

## 0. Khoá này là gì

- Người học: SV CNTT FPTU học từ **con số 0**, yếu tiếng Anh, muốn làm backend/DevOps. **Khoá TỰ ĐỦ**: Ch1–Ch2 và nền TCP dạy
  trọn từ đầu theo góc nhìn lập trình viên (luật chủ kênh 31/10). Academy NWC204 chỉ là "đọc thêm theo giáo trình trường".
- **Liên kết chéo Academy ↔ Courses** (luật 31/10): bài trùng/liên quan NWC204 (hoặc NWC203c, OSG202 phần socket, CSI106…)
  có khối `cauNoi()` (`_ui.mjs`) mở THẲNG bài Academy; chiều ngược lại thêm `sauHon()` (`content/academy/nwc204/_lien-ket-courses.mjs`)
  vào đúng bài NWC204. Kiểu khối duy nhất: `<a class="link-card lien-ket-cheo" …>` (giống khoá authentication).
  Deep link: `/courses/<slug khoá>/learn?lessonSlug=<slug bài>` (Academy dùng chung trang học).
- "THẤY được + LÀM được": mỗi khái niệm trừu tượng ⇒ mô phỏng `/net-lab` có tour + "Ở đâu trong máy"; mỗi bài có output
  chạy thật trong phòng lab Docker; Code Lab theo TỪNG bài + lab chương; dự án xuyên khoá (mỗi lab chương thêm một phần).

⛔ LUẬT CỨNG
1. KHÔNG đổi `slug` bài đã seed, KHÔNG đổi `title` CHƯƠNG (seeder neo chương bằng slug bài ĐẦU rồi lùi về title). Thêm bài mới
   được (slug `netdev-N-M-ten`, số không cần khớp số hiển thị — vd `netdev-1-0-bit-byte` hiển thị 1.1).
2. Mọi output là CHẠY THẬT (`lab/chay.sh`), bài cắt bằng `run()`, slide cắt bằng `ra()` — KHÔNG chép tay. Số đo mạng thật
   (thời gian, tốc độ) mà lời bài TRÍCH ⇒ đăng ký `giu_do` trong `lab/code/dung-output.sh` (không bị chạy lại ghi đè).
3. Kiểm nguồn: mọi mốc/sự cố/khẳng định về phần mềm có link GET 200 và đã đọc nội dung (ví dụ: nginx đổi mặc định
   `proxy_http_version` sang 1.1 từ 1.29.7 — lab chạy 1.28.3 ⇒ ghi rõ theo phiên bản).
4. KHÔNG commit/push/seed/upload trừ khi người điều phối bảo; nhiều phiên dùng chung repo ⇒ commit bằng `GIT_INDEX_FILE` riêng.

## 1. Cấu trúc thư mục

```
networking-for-developers.mjs        manifest: khung() + ghiDe() thay section đã soạn
networking-for-developers/
  _HOP-DONG.md  _ui.mjs (run/src/kv/card/cauNoi)  _slides.mjs (walk, CDN NFD/vN)  _lab.mjs (net() = labEmbed('net-lab', …))
  sNN-*.mjs                           một section = import các bài trong bai/
  bai/NNx-*.mjs                       MỖI BÀI MỘT TỆP (lesson object)
  giang/nfd-NN-X.mjs                  lời giảng EN/VI từng slide (walk)
  lab/moi-truong/{Dockerfile,compose.yml,nginx.conf,api.js,phien.sh}
  lab/code/chNN/*.sh                  kịch bản phien · lab/code/dung-output.sh chạy lại tất cả theo thứ tự
  lab/out/*.out.txt                   output thật
scripts/slides-src/_nfd-chung.mjs     khuôn slide (= _pg-chung + envelope/bytebar/hexdump/seq/topo/stack4/bang/ra)
scripts/slides-src/nfd-NN-X.mjs       deck: NN chương có đệm, X = số HIỂN THỊ (nfd-01-2 = bài 1.2), nfd-00-a/b, nfd-lab-N
```

## 2. Phòng lab

Ảnh `net-lab` (Ubuntu 26.04, dig/curl/tcpdump/tshark/mtr/arping/openssl/socat/nginx/iperf3/Node 22/xxd). Compose `nfd`:
client 10.10.1.10 · client2 .11 · router .1.254/.2.254 (ip_forward) · web nginx 10.10.2.10:80 (`/`, `/big`, `/api/`→api,
`/hong/`→:4999 cho 502, `/cham/`→api chậm cho 504) · api Node 10.10.2.20:3000 (`/api/slow` 3 s). MAC cố định
`02:00:0a:0a:<mạng>:<máy>`. Chạy kịch bản: `lab/chay.sh <máy|internet> chNN/x.sh [tên]`; lệnh trên máy Mac: `lab/chay-host.py`.
Bẫy đã gặp: tcpdump cần `sleep 2` sau khi chạy ngầm và dừng bằng `kill -INT`; offload TSO/GSO làm bản bắt hiện "gói" > MTU;
bridge Docker Desktop phản hồi broadcast của chính mình (ARP hiện 2 lần — `-Q in`); header HTTP có `\r` (đã lọc ở run/ra).
⛔ Chỉ bắt gói/quét trên lab của mình hoặc cuongthai.com. Dọn: `docker compose -f moi-truong/compose.yml -p nfd down`.

**"Internet trong một hộp" (từ Ch2):** `moi-truong/internet.yml`, project `nfi`, ảnh `net-lab-inet` (`Dockerfile.inet` = net-lab + FRR +
dnsmasq; ảnh gốc giữ nguyên ⇒ output Mục 0–Ch1 không đổi). Nhà 192.168.50.0/24 (laptop .10, phone .11, homegw .1 NAT) → ISP AS64500
(198.51.100.1, CGNAT 100.64.0.0/24 ⇒ 198.51.100.200, resolver dnsmasq) → IX 192.0.2.0/24 (BGP thật bằng FRR) → DC AS64510 203.0.113.0/24
(server .10 nginx trả "you came from IP port", ns .53 dnsmasq cho labflow.test) + rogue AS64511 .66. IPv6 không NAT: 2001:db8:a:50::/64,
2001:db8:d::/64. Mọi địa chỉ "công cộng" là dải tài liệu (RFC 5737/3849/5398). Kịch bản chạy bằng `./chay.sh nfi-<máy> ch02/x.sh`.
Bẫy đã gặp: FRR cần thêm `SYS_ADMIN` (chỉ router); cầu Docker Desktop tự masquerade địa chỉ lạ ⇒ mọi mạng nfi đặt
`com.docker.network.bridge.enable_ip_masquerade: "false"`; `interface_name` đặt tên card (lan0/wan0/ix0…); traceroute từ container
Docker Desktop ra Internet thật chỉ thấy hop 1 (proxy không gian người dùng) — là nội dung bài, không phải lỗi; `curl --local-port` dính
TIME_WAIT 60 s nếu chạy lại ngay; câu hỏi DNS treo từ lúc bị cướp tuyến làm dnsmasq trả lệch ID ⇒ rút tuyến chạy TRƯỚC cướp tuyến.
Chạy lại cả chương: `bash code/dung-output-ch2.sh` (≈2 phút; output GIỮ: c24-happy, c25-that, bộ ba c23-laptop/phone/homegw, c23-docker —
bài trích số đo/số cổng/IP của chúng; `DO_LAI=1` để bắt lại rồi SỬA lời bài). Lời giải Lab 2: `code/ch02/lab2/chay-loi-giai.sh`.

## 3. Mỗi bài (cả EN lẫn VI đầy đủ ý)

`${G}` (walk slide) ở đầu → `<div class="ml-en">` eyebrow · h2 · lead (câu hỏi bài trả lời) · các h3 giảng + `run()` output thật
+ ≥1 mô phỏng `net()` (có `tour` khi có) + ≥1 `.pitfall co-tieu-de` (sai lầm thật) + `cauNoi()` khi trùng Academy → `🧪 Practice`
(`.callout ok`: Situation thật, 3–5 bước, **Done when**, `<details>` lời giải) → `🗂 Key terms` (kv, 5–8 mục, `term (nghĩa Việt)`) →
`📌 Summary` (4–6 ý) → link-card nguồn GET 200. Rồi `<div class="ml-vi">` song song đủ ý, tiếng Việt có dấu, thuật ngữ Anh giải nghĩa.
Mẫu: `bai/013-ethernet-arp.mjs`. Thoát ký tự: không backtick trong thân bài, `<` `>` `&` trong code ⇒ `&lt;` `&gt;` `&amp;`,
`\n` trong template ⇒ `\\n`.

## 4. Slide

`import { lamDeck, … , ra } from './_nfd-chung.mjs'` · `lamDeck({ chuong: 'Chapter N — …', bai: 'N.M' }, [...])` · slide EN, 12–15
slide/bài, một ý một slide, lấp đều khung (`to`, `giua`), mã ≤ ~14 dòng, hình/sơ đồ ở chỗ khó, bảng chữ dùng `bang()` (to), bảng
dữ liệu `tbl()`. Quy trình: `_kiem-tran-slide` → render → MỞ TỪNG ẢNH (ghép 2×2) sửa tới sạch → `upload-academy-slides.mjs --prefix NFD/v1`
→ `giang/nfd-NN-X.mjs` (mỗi slide 1–2 đoạn EN + VI).
**Bắt buộc trước khi đẩy:** `node scripts/_kiem-lap-day-slide.mjs --decks 'scripts/slides-src/nfd-*.mjs'` = 0 lỗi (tràn ngang
khối mã/bảng/hình, tràn dọc, nội dung < 70 % chiều cao). `lamDeck` của `_nfd-chung.mjs` tự gắn TU_LAP (thu/phóng `zoom` 0.8–1.5
cho vừa khung) — slide vẫn trống thì THÊM nội dung có ích (bảng, bước, hình), đừng hạ ngưỡng. Output dài: `ra(…, { gay, cut,
boLenh })` (lệnh dài tự gãy dòng ở dấu cách bằng ` \`; `boLenh` = chỉ output). Rồi ghép ảnh 3×3 và MỞ xem từng tấm. Deck đã đẩy mà sửa ⇒ prefix kế tiếp (đang là NFD/v2 cho cả 10 deck Mục 0–Ch1) + ghi `VER` trong `_slides.mjs`. KHÔNG GET ảnh
media.cuongthai.com trước khi đẩy.
Bộ kiểm còn bắt **chân slide đè nhau** (01/11/2026): `meta.chuong` dài thì tên chương ở giữa đè lên đường dẫn bên trái — giữ ≤ ~31 ký tự
(Ch2 dùng "Chapter 2 — IP, routing and NAT"). Sơ đồ "Internet trong một hộp" dùng chung: `scripts/slides-src/_nfd-inet.mjs › inetTopo()`.

## 5. Mô phỏng `/net-lab`

`frontend/src/components/net-lab/` (registry, *Sim.tsx, engine + test), tour `labs/tour/tours-net.ts`, danh sách nội dung
`content/_labs.mjs` (NET_SIMS/NET_TOURS — PHẢI khớp `labs/registry.test.ts`). Có sẵn: encap (http/hop/mtu), arp (lan/gateway/stale),
socket (demux/bind/ephemeral), waterfall (cold/warm/far); Ch2: subnet (mask/same/vlsm), route (lookup/trace/loop), nat (home/inbound/cgnat),
ipv6 (addr/happy/localhost), bgp (announce/hijack/withdraw) — dữ liệu thật ở `engine/capture2.ts` (có test đối chiếu từng dòng với .out.txt),
tour `labs/tour/tours-net2.ts`. Chương sau cần mô phỏng mới (vd dns-trace, tcp-window, tls13, h2-hol,
nat-table, lb) ⇒ dựng theo cùng khuôn + tour + WhereBox, số tính ra phải ghi nhãn "tính ra".

## 6. Quiz, lab chương, Code Lab

- Quiz cuối chương: `netdev-N-K-quiz`, 10 câu tình huống, đáp án rải đều (mỗi vị trí 2–3 lần), explanation `EN: …|||VI: …`
  nói vì sao đúng và vì sao phương án hấp dẫn nhất sai. Mẫu `bai/016-quiz-ch1.mjs`.
- Lab chương: `netdev-N-K-lab-…`, tình huống thật + yêu cầu đánh số + mẫu báo cáo + rubric 10 điểm + gợi ý theo bậc (details) +
  lời giải bằng output thật + thử thách thêm + phần dự án xuyên khoá. Mẫu `bai/015-lab1.mjs`.
- Code Lab: track `networking-practice` (`content/codelab/networking-practice/`), module slug = slug bài; README Code Lab.

## 7. Kiểm trước khi báo

`node scripts/course-content-check.mjs ./content/courses/networking-for-developers.mjs` (0 lỗi) · `_kiem-lap-day-slide` 0 lỗi · nạp được mọi tệp ·
seed thử local 5434 (0 bài cũ mất) · `npx tsx --test frontend/src/components/labs/registry.test.ts` khi đụng mô phỏng ·
`docker ps -a --filter label=netlab=1` sạch khi xong.
