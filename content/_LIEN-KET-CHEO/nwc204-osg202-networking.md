# Liên kết chéo Academy (NWC204 · OSG202) ↔ Networking for Developers

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: NWC204 = `nwc204-computer-networking`, OSG202 = `operating-systems`. Courses: `networking-for-developers`.
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và `ml-vi`, HAI CHIỀU:
- chiều Courses → Academy: `cauNoi()` trong `content/courses/networking-for-developers/_ui.mjs` (đặt trong bài khoá);
- chiều Academy → Courses: NWC204 dùng `sauHon()` trong `content/academy/nwc204/_lien-ket-courses.mjs` (đặt cuối bài Academy). OSG202 ⭐ Chuyên sâu là **file sinh tự động** (`content/academy/osg202/chuyen-sau.mjs`, header "FILE SINH TỰ ĐỘNG") ⇒ thẻ viết thẳng (HTML `link-card lien-ket-cheo`) vào cuối slide cuối của bài trong NGUỒN `flm-nguon/OSG202/gen/src/slides/csN.txt` (khối `@en` và `@vi`), rồi `node OSG202/gen/gen.mjs --only cs` và chép `out/content/academy/osg202/chuyen-sau.mjs` sang repo web. Đừng sửa tay file web (01/11: thẻ CS.6 của Ch2 từng bị sửa tay — đã dời về nguồn, flm-nguon commit 4a8f23a5).

## Mục 0 + Chương 1 (31/10/2026)

| Academy | Courses (networking-for-developers) | Giống | Courses sâu thêm |
|---|---|---|---|
| `nwc204-1-1-mang-la-gi-thanh-phan-to-po` | `netdev-0-8-bat-dau-tai-day` | mạng là gì, thành phần, Internet là mạng của các mạng | các cặp thuật ngữ dễ nhầm, mốc lịch sử có nguồn, lập trình viên dùng mạng vào việc gì |
| `nwc204-3-3-lab-1-2-wireshark` | `netdev-0-1-cai-dat` | bắt gói bằng Wireshark | phòng lab Docker dựng lại được, tcpdump/tshark trong container |
| `nwc204-14-2-web-email-dns-dhcp-chia-se-tep` | `netdev-0-2-go-dia-chi` | DNS, HTTP ở tầng ứng dụng | đo từng chặng của một request bằng curl -w |
| `nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi` | `netdev-1-1-osi-tcpip`, `netdev-1-2-dong-goi` | mô hình tầng, đóng gói | đọc một frame thật từng byte, MTU/MSS và bẫy offload |
| `nwc204-4b-2-he-thap-luc-phan-mac-va-ipv6` | `netdev-1-0-bit-byte` | hex, MAC | UTF-8, thứ tự byte mạng, bit/s và byte/s |
| `nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep`, `nwc204-8-2-arp-va-neighbor-discovery` | `netdev-1-3-ethernet-arp` | switch học MAC, ARP | bảng bridge Linux thật, MAC viết lại qua router, lỗi cache ARP cũ |
| `nwc204-13-1-tang-giao-van-va-so-hieu-cong` | `netdev-1-4-cong-socket` | cổng, socket | ss trên máy thật, 127.0.0.1 với 0.0.0.0 |

## Chương 2 (01/11/2026)

| Academy | Courses (networking-for-developers) | Giống | Courses sâu thêm |
|---|---|---|---|
| `nwc204-10-1-cau-truc-dia-chi-ipv4` | `netdev-2-1-ipv4-cidr` | phần mạng/phần host, mặt nạ, AND, dải riêng | mặt nạ là quyết định của nhân (ip route get), lỗi gõ sai /16 bắt gói thật, /31 và /32, dải đặc biệt, kho địa chỉ Docker |
| `nwc204-10-2-chia-subnet-va-vlsm` | `netdev-2-1-ipv4-cidr` | mượn bit host, VLSM lớn trước | kế hoạch văn phòng LabFlow có script kiểm (chia.py), lỗ hổng căn lề, kế hoạch không vừa |
| `nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen` | `netdev-2-2-dinh-tuyen` | máy trạm chọn giao tại chỗ hay qua gateway, đọc bảng định tuyến | bảng Linux trên bốn router của lab đang chạy, khớp tiền tố dài nhất, vòng lặp do /32 bị quên |
| `nwc204-12-2-ping-traceroute-va-lab-2-3` | `netdev-2-2-dinh-tuyen` | traceroute dùng TTL và ICMP Time exceeded | gói thăm dò bắt bằng tshark, * * * đo bằng mtr, traceroute trong Docker Desktop |
| `nwc204-11-1-cau-truc-dia-chi-ipv6` | `netdev-2-4-ipv6` | 128 bit, luật viết gọn, link-local, EUI-64 | bẫy viết gọn kiểm bằng thư viện, NDP bắt gói, không NAT, Happy Eyeballs đo thật |
| `nwc204-11-2-cau-hinh-va-chia-subnet-ipv6` | `netdev-2-4-ipv6` | SLAAC/DHCPv6, solicited-node multicast, chia /48 → /64 | lab dual-stack, ba lỗi IPv6 của lập trình viên (request đầu chậm, localhost = ::1, ::ffff:) |
| `nwc204-1-1-mang-la-gi-thanh-phan-to-po` | `netdev-2-5-bgp-internet` | Internet là mạng của các mạng do nhà mạng vận hành | AS, BGP với FRR thật, cướp tuyến và rút tuyến dựng lại, RPKI kiểm cho cuongthai.com |
| `osg202-slide-cs6-1` (OSG202 ⭐ CS.6 — Containers 1/2) | `netdev-2-3-nat` | container có network namespace riêng | gói tin của container: bridge, -p là luật DNAT đọc từ nhân, masquerade, IP người gọi ứng dụng thấy, cổng công bố vượt ufw |

Không cặp (Ch2): `netdev-2-6-lab-duong-vao-labflow` (lab chương), `netdev-2-7-quiz`. NAT (2.3) không có bài tương ứng trong NWC204 (môn không dạy NAT) — cặp với OSG202 CS.6 thay thế. SDN302 không có bài về địa chỉ/định tuyến; cặp SDN302 8.2 (production, trust proxy) để dành cho Chương 7 (proxy, X-Forwarded-For).

## Chương 3 (01/11/2026)

| Academy | Courses (networking-for-developers) | Giống | Courses sâu thêm |
|---|---|---|---|
| `nwc204-14-2-web-email-dns-dhcp-chia-se-tep` | `netdev-3-1-phan-giai` | DNS phân cấp, resolver, truy vấn đệ quy/lặp | đường đi của resolver bắt từng gói (9,7 ms rồi 0,1 ms từ cache), tự đi bằng +norecurse, phía stub: /etc/hosts, search/ndots, systemd-resolved |
| `nwc204-14-2-web-email-dns-dhcp-chia-se-tep` | `netdev-3-2-ban-ghi` | các loại bản ghi A/AAAA/MX/NS/CNAME/SOA | vùng thật đủ loại (TXT, CAA, SRV cho mongodb+srv, HTTPS), named-checkzone bắt bốn lỗi, serial bị quên làm hai NS lệch nhau |
| `nwc204-14-2-web-email-dns-dhcp-chia-se-tep` | `netdev-3-3-ttl-cache` | DNS có cache | chuyển máy chủ bấm giờ từng giây (hạ TTL trước hoặc chờ 105 s), cache âm + NSEC, cache trong Java/Node |
| `osg202-slide-cs3-2` (OSG202 ⭐ CS.3 — I/O và đồng thời 2/2) | `netdev-3-3-ttl-cache` | thread pool libuv, dns.lookup vào pool | DNS chậm đo thật: 4 luồng ⇒ 10/10/20/20 s (getaddrinfo tối đa nửa pool, readFile vẫn xong), 8 luồng ⇒ cùng 10 s. Câu cũ của CS.3 ("bốn dns.lookup chiếm cả pool, readFile phải chờ") đã sửa ở nguồn flm-nguon |
| `nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong` | `netdev-3-5-dns-an-toan` | giả mạo, bản ghi DNS không được ký | chuỗi tin cậy DNSSEC thật đọc và tính lại, sự cố chữ ký hết hạn (SERVFAIL, EDE, +cd), DoT/DoH che được gì |

Không cặp (Ch3): `netdev-3-4-anycast-geodns` (NWC204 không dạy anycast/GeoDNS; BGP đã cặp ở Ch2), `netdev-3-6-lab-dns-labflow` (lab chương), `netdev-3-7-quiz`. SDN302 không có bài về DNS.

