/**
 * NWC204 — Mục 0: khung chương trình theo syllabus FLM 14520.
 * (QĐ 968/QĐ-ĐHFPT ngày 07/08/2026, thu 20/09/2026 từ
 *  flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14520)
 *
 * 7 bài: 0.1 hồ sơ môn · 0.2 cách tính điểm · 0.3 mười CLO · 0.4 giáo trình &
 * công cụ · 0.5 kế hoạch đủ 60 buổi · 0.6 nhiệm vụ sinh viên · 0.7 bảng 52 câu
 * hỏi kiến tạo.
 *
 * LUẬT (xem _HOP-DONG-NWC204.md): mọi thứ của trường có <p class="nhan">Nguồn:
 * FLM…</p>; mọi thứ web tự thêm nằm trong <div class="note-ct">. Ô trống của
 * syllabus ghi "trường không công bố" — KHÔNG đoán. title ≤255 ký tự tính CẢ
 * hai vế EN|||VI, không thực thể HTML thô trong title. Mọi <pre><code> có
 * class language-*. Không backtick lồng, không ${ } trong chuỗi → file này
 * dựng HTML bằng phép cộng chuỗi, cố ý.
 *
 * Người điều phối gom file này vào NWC204.mjs. ĐỪNG sửa NWC204.mjs từ đây.
 */
import { bi, SACH } from './_slides.mjs';

const NGUON = 'Nguồn: FLM · Syllabus 14520 · QĐ 968/QĐ-ĐHFPT ngày 07/08/2026';
const FLM = 'https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14520';
const doc = (slug, title, description, pairs) => ({
  title, slug, type: 'DOCUMENT', description,
  content: pairs.map((p) => bi(p[0], p[1])).join('\n'),
});

/* ══════════════════════════════════════════════════════════════════════════
 * DỮ LIỆU — 60 buổi. [số, Topic NGUYÊN VĂN, dịch, cột LO của FLM, bài trên web,
 * cờ bất thường (HTML, rỗng nếu không có)].
 * Cột Topic giữ ĐÚNG TỪNG KÝ TỰ của FLM: ô gốc dồn các mục vào một dòng, không
 * có dấu phân cách — không thêm, không bớt, không chèn dấu cách.
 * ══════════════════════════════════════════════════════════════════════════ */
const W = ' <span class="badge">⚠</span> ';
const BUOI = [
  ['1', 'Course overview1. Networking Today1.1 Networks Affect Our Lives1.2 Network Components1.3 Network Representations and Topologies1.4 Common Types of Networks', 'Giới thiệu môn học · 1. Mạng ngày nay · 1.1 Mạng ảnh hưởng tới đời sống · 1.2 Các thành phần của mạng · 1.3 Cách biểu diễn mạng và các sơ đồ mạng · 1.4 Các loại mạng thường gặp', 'CLO1, CLO9', 'Ch.1', ''],
  ['2', '1.5 Internet Connections1.6 Reliable Networks1.7 Network Trends1.8 Network Security1.9 The IT Professional1.10 Integrate AI Tools for Explaining Concepts', '1.5 Các kiểu kết nối Internet · 1.6 Mạng tin cậy · 1.7 Xu hướng mạng · 1.8 An ninh mạng · 1.9 Người làm nghề IT · 1.10 Dùng công cụ AI để giải thích khái niệm', 'CLO1, CLO9', 'Ch.1', ''],
  ['3', '2. Basic Switch and End Device Configuration2.1 Cisco IOS Access2.2 IOS Navigation2.3 The Command Structure2.4 Basic Device Configuration', '2. Cấu hình cơ bản switch và thiết bị đầu cuối · 2.1 Truy cập Cisco IOS · 2.2 Di chuyển giữa các chế độ IOS · 2.3 Cấu trúc câu lệnh · 2.4 Cấu hình thiết bị cơ bản', 'CLO2, CLO3, CLO9', 'Ch.2', ''],
  ['4', '2.5 Save Configurations2.6 Ports and Addresses2.7 Configure IP Addressing2.8 Verify Connectivity2.9 Integrate AI Tools for Explaining Concepts (Self Learning)', '2.5 Lưu cấu hình · 2.6 Cổng và địa chỉ · 2.7 Cấu hình địa chỉ IP · 2.8 Kiểm tra kết nối · 2.9 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO2, CLO3, CLO9', 'Ch.2', ''],
  ['5', 'Lab 1.1: Basic Switch and End Device Configuration- Navigate the IOS by Using Tera Term for Console Connectivity- Basic Switch and End Device Configuration- Use AI Tools for Configuration and Troubleshooting', 'Lab 1.1: Cấu hình cơ bản switch và thiết bị đầu cuối — Dùng Tera Term qua cổng console để di chuyển trong IOS — Cấu hình cơ bản switch và thiết bị đầu cuối — Dùng công cụ AI để cấu hình và xử lý sự cố', 'CLO2, CLO3, CLO9', 'Ch.2', ''],
  ['6', 'Lab 1.1 (continue)', 'Lab 1.1 (tiếp)', 'CLO2, CLO3, CLO9', 'Ch.2', ''],
  ['7', '3. Protocols and Models3.1 The Rules3.2 Protocols3.3 Protocol Suites3.4 Standards Organizations', '3. Giao thức và mô hình · 3.1 Các quy tắc · 3.2 Giao thức · 3.3 Bộ giao thức · 3.4 Các tổ chức chuẩn hoá', 'CLO1, CLO9', 'Ch.3', ''],
  ['8', '3.5 Reference Models3.6 Data Encapsulation3.7 Data Access3.8 Integrate AI Tools for Explaining Concepts (Self Learning)', '3.5 Các mô hình tham chiếu · 3.6 Đóng gói dữ liệu · 3.7 Truy nhập dữ liệu · 3.8 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO1, CLO9', 'Ch.3', ''],
  ['9', 'Lab 1.2 (Dialogue-based Assessment &amp; Self Learning)- Design a Communications System- Research Networking Standards- Install Wireshark- Integrate AI Tools for Explaining Concepts', 'Lab 1.2 (đánh giá qua đối thoại &amp; tự học) — Thiết kế một hệ thống truyền thông — Tìm hiểu các chuẩn mạng — Cài Wireshark — Dùng công cụ AI để giải thích khái niệm', 'CLO1, CLO9', 'Ch.3', ''],
  ['10', 'Lab 1.2 (continue)', 'Lab 1.2 (tiếp)', 'CLO1, CLO9', 'Ch.3', ''],
  ['11', '4. Physical Layer4.1 Purpose of the Physical Layer4.2 Physical Layer Characteristics4.3 Copper Cabling', '4. Tầng vật lý · 4.1 Mục đích của tầng vật lý · 4.2 Đặc tính tầng vật lý · 4.3 Cáp đồng', 'CLO4, CLO9', 'Ch.4', ''],
  ['12', '4.4 UTP Cabling4.5 Fiber-Optic Cabling4.6 Wireless Media4.7 Integrate AI Tools for Explaining Concepts (Self Learning)', '4.4 Cáp UTP · 4.5 Cáp quang · 4.6 Môi trường không dây · 4.7 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO4, CLO9', 'Ch.4', ''],
  ['13', 'Lab 1.3 (Dialogue-based Assessment &amp; Self Learning)- View Wired and Wireless NIC Information- Integrate AI Tools for Explaining Concepts', 'Lab 1.3 (đánh giá qua đối thoại &amp; tự học) — Xem thông tin card mạng có dây và không dây — Dùng công cụ AI để giải thích khái niệm', 'CLO4, CLO9', 'Ch.4', ''],
  ['14', 'Lab 1.3 (continue)', 'Lab 1.3 (tiếp)', 'CLO4, CLO9', 'Ch.4 + <strong>Ch.4B</strong>', W + 'sau buổi này là chỗ web chèn <strong>chương bù 4B</strong> (nhị phân/hex) — trường không xếp buổi nào'],
  ['15', '5. Data Link Layer5.1 Purpose of the Data Link Layer', '5. Tầng liên kết dữ liệu · 5.1 Mục đích của tầng liên kết dữ liệu', 'CLO2, CLO4, CLO9', 'Ch.5', W + 'tài liệu buổi này là Cisco <strong>Module 6</strong>, không phải Module 5 — lệch số bắt đầu từ đây'],
  ['16', '5.2 Topologies5.3 Data Link Frame5.4 Integrate AI Tools for Explaining Concepts (Self Learning)', '5.2 Các sơ đồ mạng · 5.3 Khung của tầng liên kết dữ liệu · 5.4 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO2, CLO4, CLO9', 'Ch.5', ''],
  ['17', '6. Ethernet Switching6.1 Ethernet Frame6.2 Ethernet MAC Address', '6. Chuyển mạch Ethernet · 6.1 Khung Ethernet · 6.2 Địa chỉ MAC của Ethernet', 'CLO2, CLO4, CLO9', 'Ch.6', ''],
  ['18', '6.3 The MAC Address Table6.4 Switch Speeds and Forwarding Methods6.5 Integrate AI Tools for Explaining Concepts (Self Learning)', '6.3 Bảng địa chỉ MAC · 6.4 Tốc độ switch và các phương pháp chuyển tiếp · 6.5 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO2, CLO4, CLO9', 'Ch.6', ''],
  ['19', 'Lab 1.4 (Dialogue-based Assessment &amp; Self Learning)- Use Wireshark to Examine Ethernet Frames- View Network Device MAC Addresses- View the Switch MAC Address Table - Use AI Tools for Analyzing Captured Packets', 'Lab 1.4 (đánh giá qua đối thoại &amp; tự học) — Dùng Wireshark xem khung Ethernet — Xem địa chỉ MAC của thiết bị mạng — Xem bảng địa chỉ MAC của switch — Dùng công cụ AI phân tích gói đã bắt', 'CLO2, CLO4, CLO9', 'Ch.6', ''],
  ['20', 'Lab 1.4 (continue)', 'Lab 1.4 (tiếp)', 'CLO2, CLO4, CLO9', 'Ch.6', ''],
  ['21', '7. Network Layer7.1 Network Layer Characteristics7.2 IPv4 Packet', '7. Tầng mạng · 7.1 Đặc tính tầng mạng · 7.2 Gói IPv4', 'CLO4, CLO9', 'Ch.7', ''],
  ['22', '7.3 IPv6 Packet7.4 How a Host Routes7.5 Router Routing Tables7.6 Integrate AI Tools for Explaining Concepts (Self Learning)', '7.3 Gói IPv6 · 7.4 Một host định tuyến thế nào · 7.5 Bảng định tuyến của router · 7.6 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO4, CLO9', 'Ch.7', ''],
  ['23', 'Review Modules 1-7', 'Ôn tập Module 1–7', 'CLO1-4', 'Ch.7', W + 'ô ITU TRỐNG; và đây là buổi duy nhất của nửa đầu môn <strong>không</strong> có CLO9'],
  ['24', '8. Address Resolution8.1 MAC and IP', '8. Phân giải địa chỉ · 8.1 MAC và IP', 'CLO4, CLO9', 'Ch.8', ''],
  ['25', '8.2 ARP8.3 Neighbor Discovery8.4 Integrate AI Tools for Explaining Concepts (Self Learning)', '8.2 ARP · 8.3 Neighbor Discovery (phát hiện lân cận) · 8.4 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO4, CLO9', 'Ch.8', ''],
  ['26', '9. Basic Router Configuration9.1 Configure Initial Router Settings', '9. Cấu hình router cơ bản · 9.1 Cấu hình khởi tạo cho router', 'CLO3, CLO8, CLO9', 'Ch.9', ''],
  ['27', '9.2 Configure Interfaces9.4 Configure the Default Gateway9.5 Integrate AI Tools for Explaining Concepts (Self Learning)', '9.2 Cấu hình cổng (interface) · 9.4 Cấu hình cổng mặc định (default gateway) · 9.5 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO3, CLO8, CLO9', 'Ch.9', W + 'nhảy từ <strong>9.2 sang 9.4</strong> — <strong>thiếu 9.3</strong>'],
  ['28', 'Lab 2.1: Build a Switch and Router Network- Build a Switch and Router Network- Use AI Tools for Configuration and Troubleshooting', 'Lab 2.1: Dựng một mạng có switch và router — Dựng mạng switch và router — Dùng công cụ AI để cấu hình và xử lý sự cố', 'CLO3, CLO8, CLO9', 'Ch.9', ''],
  ['29', 'Lab 2.1 (continue)', 'Lab 2.1 (tiếp)', 'CLO3, CLO8, CLO9', 'Ch.9', ''],
  ['30', '10. IPv4 Addressing10.1 IPv4 Address Structure10.2 IPv4 Unicast, Broadcast, and Multicast10.3 Types of IPv4 Addresses10.4 Network Segmentation', '10. Địa chỉ IPv4 · 10.1 Cấu trúc địa chỉ IPv4 · 10.2 Unicast, broadcast và multicast của IPv4 · 10.3 Các loại địa chỉ IPv4 · 10.4 Phân đoạn mạng', 'CLO5, CLO9', 'Ch.10', W + '<strong>cần nhị phân</strong> — xem chương bù 4B'],
  ['31', '10.5 Subnet an IPv410.6 Subnet a /16 and /8 Prefix10.7 Subnet to Meet Requirements10.8 Variable Length Subnet Masking10.9 Structured Design10.10 Integrate AI Tools for Explaining Concepts (Self Learning)', '10.5 Chia subnet cho IPv4 · 10.6 Chia subnet với tiền tố /16 và /8 · 10.7 Chia subnet theo yêu cầu · 10.8 Mặt nạ độ dài thay đổi (VLSM) · 10.9 Thiết kế có cấu trúc · 10.10 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO5, CLO9', 'Ch.10', W + '<strong>cần nhị phân + phép AND theo bit</strong> — xem chương bù 4B'],
  ['32', 'Lab 2.2 (Dialogue-based Assessment &amp; Self Learning)- Calculate IPv4 Subnets- Design and Implement a VLSM Addressing Scheme- Use AI Tools for Calculating IPv4 Subnets', 'Lab 2.2 (đánh giá qua đối thoại &amp; tự học) — Tính subnet IPv4 — Thiết kế và triển khai sơ đồ địa chỉ VLSM — Dùng công cụ AI để tính subnet IPv4', 'CLO5, CLO9', 'Ch.10', W + '<strong>cần nhị phân</strong> — xem chương bù 4B'],
  ['33', 'Lab 2.2 (continue)', 'Lab 2.2 (tiếp)', 'CLO5, CLO9', 'Ch.10', W + '<strong>cần nhị phân</strong> — xem chương bù 4B'],
  ['34', 'Midterm Progress Test', 'Bài kiểm tra tiến độ giữa kỳ', 'CLO1 - CLO9', 'Ch.10', W + 'ô ITU TRỐNG. Đây là <strong>bài Progress Test duy nhất</strong> của môn — 10% điểm, 60 phút, 50 câu'],
  ['35', '11. IPv6 Addressing11.1 IPv6 Addressing11.2 IPv4 Issues11.3 IPv6 Addressing11.4 IPv6 Address Types', '11. Địa chỉ IPv6 · 11.1 Địa chỉ IPv6 · 11.2 Các vấn đề của IPv4 · 11.3 Địa chỉ IPv6 · 11.4 Các loại địa chỉ IPv6', 'CLO5, CLO9', 'Ch.11', W + '<strong>11.1 và 11.3 trùng tên</strong> "IPv6 Addressing"'],
  ['36', '11.5 GUA and LLA Static Configuration11.6 Dynamic Addressing for IPv6 GUAs11.7 Dynamic Addressing for IPv6 LLAs11.8 IPv6 Multicast Addresses11.9 Subnet an IPv6 Network11.10 Integrate AI Tools for Explaining Concepts (Self Learning)', '11.5 Cấu hình tĩnh GUA và LLA · 11.6 Cấp địa chỉ động cho GUA của IPv6 · 11.7 Cấp địa chỉ động cho LLA của IPv6 · 11.8 Địa chỉ multicast IPv6 · 11.9 Chia subnet mạng IPv6 · 11.10 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO5, CLO9', 'Ch.11', W + '<strong>cần hệ thập lục phân</strong> — xem chương bù 4B'],
  ['37', '12. ICMP12.1 ICMP Messages', '12. ICMP · 12.1 Các thông điệp ICMP', 'CLO6, CLO9', 'Ch.12', ''],
  ['38', '12.2 Ping and Traceroute Testing12.3 Integrate AI Tools for Explaining Concepts (Self Learning)', '12.2 Kiểm tra bằng ping và traceroute · 12.3 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO6, CLO9', 'Ch.12', ''],
  ['39', 'Lab 2.3:  Use Ping and Traceroute to Test Network Connectivity- Use Ping and Traceroute to Test Network Connectivity- Use AI Tools for Configuration and Troubleshooting', 'Lab 2.3: Dùng ping và traceroute để kiểm tra kết nối mạng — Dùng ping và traceroute kiểm tra kết nối mạng — Dùng công cụ AI để cấu hình và xử lý sự cố', 'CLO6, CLO9', 'Ch.12', W + '<strong>hai dấu cách</strong> sau "Lab 2.3:"'],
  ['40', 'Lab 2.3 (continue)', 'Lab 2.3 (tiếp)', 'CLO6, CLO9', 'Ch.12', ''],
  ['41', '13.Transport Layer13.1 Transportation of Data13.2 TCP Overview13.3 UDP Overview', '13. Tầng giao vận · 13.1 Việc vận chuyển dữ liệu · 13.2 Tổng quan TCP · 13.3 Tổng quan UDP', 'CLO1, CLO4, CLO9', 'Ch.13', W + '"13.Transport" — <strong>thiếu dấu cách</strong> sau dấu chấm (59 buổi kia đều có)'],
  ['42', '13.4 Port Numbers13.5 TCP Communication Process13.6 Reliability and Flow Control .13.7 UDP Communication13.8 Integrate AI Tools for Explaining Concepts (Self Learning)', '13.4 Số hiệu cổng · 13.5 Quá trình truyền tin của TCP · 13.6 Độ tin cậy và điều khiển luồng · 13.7 Truyền tin bằng UDP · 13.8 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO1, CLO4, CLO9', 'Ch.13', W + '<strong>dấu chấm lạc</strong>: "Flow Control ." trước 13.7'],
  ['43', 'Project: Design and Implement a Basic Small Network with AI Assistance- Divide student groups', 'Đồ án: Thiết kế và triển khai một mạng nhỏ cơ bản có AI hỗ trợ — Chia nhóm sinh viên', 'CLO7-10', 'Đồ án', W + 'ghi <strong>CLO7-10</strong>; buổi 51/52/56/57 cùng đồ án lại ghi tập CLO khác'],
  ['44', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO7-10', 'Đồ án', ''],
  ['45', '14. Application Layer14.1 Application, Presentation, and Session14.2 Peer-to-Peer', '14. Tầng ứng dụng · 14.1 Tầng ứng dụng, trình diễn và phiên · 14.2 Ngang hàng (peer-to-peer)', 'CLO1, CLO4, CLO9', 'Ch.14', ''],
  ['46', '14.3 Web and Email Protocols14.4 IP Addressing Services14.5 File Sharing Services14.6 Integrate AI Tools for Explaining Concepts (Self Learning)', '14.3 Giao thức web và email · 14.4 Các dịch vụ cấp địa chỉ IP · 14.5 Dịch vụ chia sẻ tệp · 14.6 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO1, CLO4, CLO9', 'Ch.14', ''],
  ['47', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO7-10', 'Đồ án', ''],
  ['48', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO7-10', 'Đồ án', ''],
  ['49', '15. Network Security Fundamentals15.1 Security Threats and Vulnerabilities15.2 Network Attacks', '15. Nền tảng an ninh mạng · 15.1 Nguy cơ và lỗ hổng bảo mật · 15.2 Các kiểu tấn công mạng', 'CLO7, CLO9', 'Ch.15', ''],
  ['50', '15.3 Network Attack Mitigation15.4 Device Security15.5 Integrate AI Tools for Explaining Concepts (Self Learning)', '15.3 Giảm thiểu tấn công mạng · 15.4 Bảo mật thiết bị · 15.5 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO7, CLO10', 'Ch.15', W + 'ghi <strong>CLO10</strong> còn buổi 49 cùng chương ghi <strong>CLO9</strong>'],
  ['51', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10', 'Đồ án', W + 'cùng đồ án, <strong>khác cách ghi CLO</strong> so với buổi 43/44/47/48'],
  ['52', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10', 'Đồ án', ''],
  ['53', 'Review Modules 8-15', 'Ôn tập Module 8–15', 'CLO5-CLO10', 'Ch.16', W + 'ô ITU TRỐNG'],
  ['54', '16. Build a Small Network16.1 Devices in a Small Network16.2 Small Network Applications and Protocols16.3 Scale to Larger Networks', '16. Dựng một mạng nhỏ · 16.1 Thiết bị trong mạng nhỏ · 16.2 Ứng dụng và giao thức trong mạng nhỏ · 16.3 Mở rộng lên mạng lớn hơn', 'CLO8, CLO9', 'Ch.16', ''],
  ['55', '16.4 Verify Connectivity16.5 Host and IOS Commands16.6 Troubleshooting Methodologies16.7 Troubleshooting Scenarios16.8 Integrate AI Tools for Explaining Concepts (Self Learning)', '16.4 Kiểm tra kết nối · 16.5 Lệnh trên máy trạm và trên IOS · 16.6 Phương pháp xử lý sự cố · 16.7 Các tình huống xử lý sự cố · 16.8 Dùng công cụ AI để giải thích khái niệm (tự học)', 'CLO8, CLO9', 'Ch.16', ''],
  ['56', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10', 'Đồ án', ''],
  ['57', 'Project: Design and Implement a Basic Small Network with AI Assistance (continue)- Work on group and report project progress- Dialogue-based Assessment &amp; Self Learning', 'Đồ án (tiếp) — Làm theo nhóm và báo cáo tiến độ — Đánh giá qua đối thoại &amp; tự học', 'CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10', 'Đồ án', ''],
  ['58', 'Review', 'Ôn tập', 'CLO1-CLO10', 'Ch.16', ''],
  ['59', 'Review', 'Ôn tập', 'CLO1-CLO10', 'Ch.16', ''],
  ['60', 'Review', 'Ôn tập', 'CLO1-CLO11', 'Ch.16', W + 'ghi <strong>CLO1-CLO11</strong> nhưng môn chỉ có <strong>10 CLO</strong>'],
];

/** Thân bảng 60 buổi: Session · Topic nguyên văn · dịch · LO · bài trên web. */
const hangBuoi = () => BUOI.map((r) => '    <tr><td><strong>' + r[0] + '</strong></td>'
  + '<td>' + r[1] + r[5] + '</td>'
  + '<td>' + r[2] + '</td>'
  + '<td>' + r[3] + '</td>'
  + '<td><strong>' + r[4] + '</strong></td></tr>').join('\n');

/* ══════════════════════════════════════════════════════════════════════════
 * DỮ LIỆU — 10 CLO. [mã, nguyên văn, dịch, buổi xuất hiện, đầu điểm nào đo]
 * Cột "buổi" do web ĐẾM từ cột LO của bảng 60 buổi, không phải câu của FLM.
 * ══════════════════════════════════════════════════════════════════════════ */
const CLO = [
  ['CLO1', 'Describe the evolution of network technologies and explain how layered protocols enable communication and support end-user applications.',
    'Mô tả sự phát triển của công nghệ mạng và giải thích cách các giao thức phân tầng cho phép truyền thông và hỗ trợ ứng dụng của người dùng cuối.',
    '1, 2, 7–10, 23, 34, 41, 42, 45, 46, 58–60 <strong>· 15</strong>', 'Lab · PT · TE'],
  ['CLO2', 'Apply Ethernet and switching concepts to explain and configure technologies that support efficient and reliable data transfer.',
    'Vận dụng các khái niệm Ethernet và chuyển mạch để giải thích và cấu hình những công nghệ hỗ trợ truyền dữ liệu hiệu quả và tin cậy.',
    '3–6, 15–20, 23, 34, 58–60 <strong>· 15</strong>', 'Lab · PT · <strong>PE</strong> · TE'],
  ['CLO3', 'Configure switches, routers, and end devices with IP addressing and security settings to establish basic network connectivity.',
    'Cấu hình switch, router và thiết bị đầu cuối với địa chỉ IP và các thiết lập bảo mật để tạo kết nối mạng cơ bản.',
    '3–6, 23, 26–29, 34, 51, 52, 56–60 <strong>· 17</strong>', 'Lab · PT · <strong>Project</strong> · <strong>PE</strong> · TE'],
  ['CLO4', 'Explain how physical, data link, network, and transport layers interact to enable reliable and structured data communication.',
    'Giải thích cách các tầng vật lý, liên kết dữ liệu, mạng và giao vận tương tác với nhau để việc truyền dữ liệu diễn ra tin cậy và có cấu trúc.',
    '11–25, 34, 41, 42, 45, 46, 58–60 <strong>· 23 (max)</strong>', 'Lab · PT · TE'],
  ['CLO5', 'Design and implement IPv4 and IPv6 addressing schemes by calculating subnets and applying efficient address configurations in networks.',
    'Thiết kế và triển khai sơ đồ địa chỉ IPv4 và IPv6 bằng cách tính subnet và áp dụng cấu hình địa chỉ hiệu quả trong mạng.',
    '30–36, 51–53, 56–60 <strong>· 15</strong>', 'Lab · PT · <strong>Project</strong> · <strong>PE</strong> · TE'],
  ['CLO6', 'Use diagnostic tools and techniques to test and troubleshoot network connectivity, including ICMP utilities and AI-assisted methods.',
    'Dùng các công cụ và kỹ thuật chẩn đoán để kiểm tra và xử lý sự cố kết nối mạng, gồm cả tiện ích ICMP và phương pháp có AI hỗ trợ.',
    '34, 37–40, 51–53, 56–60 <strong>· 13</strong>', 'Lab · PT · <strong>Project</strong> · <strong>PE</strong> · TE'],
  ['CLO7', 'Implement basic security measures by applying device hardening and configuration techniques to protect network devices and communications.',
    'Triển khai các biện pháp bảo mật cơ bản bằng cách làm cứng thiết bị và áp dụng kỹ thuật cấu hình để bảo vệ thiết bị mạng và việc truyền tin.',
    '34, 43, 44, 47–53, 56–60 <strong>· 15</strong>', 'Lab · PT · <strong>Project</strong> · <strong>PE</strong> · TE'],
  ['CLO8', 'Design and implement a small network topology with routers, switches, and end devices, considering performance and scalability.',
    'Thiết kế và triển khai một sơ đồ mạng nhỏ gồm router, switch và thiết bị đầu cuối, có xét tới hiệu năng và khả năng mở rộng.',
    '26–29, 34, 43, 44, 47, 48, 51–60 <strong>· 19</strong>', 'Lab · PT · <strong>Project</strong> · <strong>PE</strong> · TE'],
  ['CLO9', 'Utilize AI tools to analyze, configure, monitor, and troubleshoot networks, enhancing learning, efficiency, and network management capabilities.',
    'Dùng công cụ AI để phân tích, cấu hình, theo dõi và xử lý sự cố mạng, nhằm nâng cao việc học, hiệu suất và năng lực quản trị mạng.',
    '<strong>58 / 60</strong> — 23 &amp; 50 ✗', 'Lab · PT · <strong>Project</strong> · <em>✗ PE · ✗ TE</em>'],
  ['CLO10', 'Students use AI and digital tools to collaborate, design, and present small network projects. The approach blends dialogue-based assessment with self-directed learning.',
    'Sinh viên dùng AI và công cụ số để cộng tác, thiết kế và trình bày các đồ án mạng nhỏ. Cách tiếp cận này kết hợp đánh giá qua đối thoại với việc tự học có định hướng.',
    '43, 44, 47, 48, 50–53, 56–60 <strong>· 13</strong>', '<strong>Project</strong> ONLY — ✗ Lab · ✗ PT · ✗ PE · ✗ TE'],
];

/* ══════════════════════════════════════════════════════════════════════════
 * DỮ LIỆU — 52 câu hỏi kiến tạo. [buổi, mã, nguyên văn, dịch, cờ]
 * ══════════════════════════════════════════════════════════════════════════ */
const CQ = [
  ['1', 'CQ1.1', 'What is the Internet?', 'Internet là gì?', ''],
  ['1', 'CQ1.2', 'How can computers in network talk together?', 'Các máy tính trong một mạng nói chuyện với nhau bằng cách nào?', ''],
  ['2', 'CQ1.3', 'Why do we need a reliable networks?', 'Vì sao chúng ta cần một mạng tin cậy?', W + 'lỗi gõ: "a reliable <strong>networks</strong>" — số ít đi với số nhiều'],
  ['3', 'CQ1.4', 'What is the Cisco IOS?', 'Cisco IOS là gì?', ''],
  ['4', 'CQ2.1', 'How to write the correct command in Cisco IOS?', 'Viết một câu lệnh đúng trong Cisco IOS như thế nào?', ''],
  ['5', 'CQ2.2', 'What should we do when implement basic network with switches and end devices?', 'Khi triển khai một mạng cơ bản với switch và thiết bị đầu cuối thì cần làm những gì?', ''],
  ['7', 'CQ3.1', 'Explain why protocols are necessary in network communication.', 'Giải thích vì sao giao thức là cần thiết trong truyền thông mạng.', ''],
  ['8', 'CQ3.2', 'Explain how the TCP/IP model and the OSI model are used to facilitate standardization in the communication process.', 'Giải thích mô hình TCP/IP và mô hình OSI được dùng thế nào để thúc đẩy việc chuẩn hoá trong quá trình truyền thông.', ''],
  ['10', 'CQ4.1', 'What are the purpose and functions of the physical layer in the network?', 'Mục đích và các chức năng của tầng vật lý trong mạng là gì?', ''],
  ['11', 'CQ4.2', 'Constrast and compare between copper and fiber optic capling', 'So sánh và đối chiếu cáp đồng với cáp quang', W + 'hai lỗi gõ trong một dòng: <strong>Constrast</strong> (Contrast) và <strong>capling</strong> (cabling)'],
  ['12', 'CQ4.3', 'While trying to solve a network issue, a technician made multiple changes to the current router configuration file. The changes did not solve the problem and were not saved. What action can the technician take to discard the changes and work with the file in NVRAM?', 'Trong lúc xử lý một sự cố mạng, kỹ thuật viên đã sửa nhiều chỗ trong file cấu hình đang chạy của router. Các thay đổi đó không giải quyết được vấn đề và cũng chưa được lưu. Kỹ thuật viên có thể làm gì để bỏ hết thay đổi và quay lại làm việc với file nằm trong NVRAM?', ''],
  ['13', 'CQ5.1', 'How does UTP cable used in Ethernet networks?', 'Cáp UTP được dùng trong mạng Ethernet như thế nào?', ''],
  ['14', 'CQ5.2', 'How to connect devices using wired and wireless media', 'Nối các thiết bị bằng môi trường có dây và không dây như thế nào?', ''],
  ['17', 'CQ6.1', 'How does MAC protocol in the data link layer supports communication across networks?', 'Giao thức MAC ở tầng liên kết dữ liệu hỗ trợ việc truyền thông qua các mạng như thế nào?', ''],
  ['18', 'CQ6.2', 'Compare and constrast the characteristics of media access control methods on WAN and LAN technologies', 'So sánh và đối chiếu đặc tính của các phương pháp điều khiển truy nhập môi trường trên công nghệ WAN và LAN', W + 'lỗi gõ <strong>constrast</strong> (lần thứ hai trong bảng)'],
  ['19', 'CQ7.1', 'What is the Frame?', 'Khung (frame) là gì?', ''],
  ['20', 'CQ7.2', 'How to detect and fix when receive an error frame on transmission?', 'Phát hiện và xử lý thế nào khi nhận được một khung lỗi trong lúc truyền?', ''],
  ['21', 'CQ7.3', 'How does Ethernet works in a switched network?', 'Ethernet hoạt động thế nào trong một mạng có chuyển mạch?', ''],
  ['23', 'CQ8.1', 'Why do we need use IP protocol for reliable communications?', 'Vì sao cần dùng giao thức IP cho việc truyền thông tin cậy?', ''],
  ['24', 'CQ8.2', 'How does the network devices use routing tables to direct packets to a destination networks?', 'Các thiết bị mạng dùng bảng định tuyến thế nào để đưa gói tin tới mạng đích?', ''],
  ['25', 'CQ9.1', 'How can ARP enable communication on a network?', 'ARP giúp việc truyền thông trong một mạng diễn ra được bằng cách nào?', ''],
  ['26', 'CQ9.2', 'How does Neighbor Discovery operate on a network?', 'Neighbor Discovery hoạt động thế nào trong một mạng?', ''],
  ['27', 'CQ9.3', 'Compare the roles of the ARP address and the IP address', 'So sánh vai trò của địa chỉ ARP và địa chỉ IP', ''],
  ['28', 'CQ10.1', 'How do two computers connect over the outside network?', 'Hai máy tính nối được với nhau qua mạng bên ngoài bằng cách nào?', ''],
  ['29', 'CQ10.2', 'How does the way of the router device forward packets?', 'Router chuyển tiếp gói tin theo cách nào?', ''],
  ['31', 'CQ11.1', 'Progress Test 2', 'Progress Test 2', W + '<strong>KHÔNG phải câu hỏi</strong>, và môn chỉ có MỘT Midterm Progress Test — ở buổi 34, không phải buổi 31'],
  ['32', 'CQ11.2', 'Compare and constrast the characteristics and uses of the unicast, broadcast and multicast IPv4 address', 'So sánh và đối chiếu đặc tính cùng cách dùng của địa chỉ IPv4 unicast, broadcast và multicast', ''],
  ['33', 'CQ11.3', 'how many are there type of the IPv4 address? How to use it?', 'Có bao nhiêu loại địa chỉ IPv4? Dùng chúng thế nào?', ''],
  ['34', 'CQ12.1', 'What is the structure of an IPv4 address?', 'Cấu trúc của một địa chỉ IPv4 gồm những gì?', ''],
  ['35', 'CQ12.2', 'A company has plan to deploy a network with more departments. How can we calculate IPv4 address to optimize in this case?', 'Một công ty dự định triển khai mạng cho nhiều phòng ban hơn. Trong trường hợp này tính địa chỉ IPv4 thế nào cho tối ưu?', ''],
  ['37', 'CQ13.1', 'What happens do we use IPv4 in nowadays?', 'Ngày nay dùng IPv4 thì gặp vấn đề gì?', ''],
  ['38', 'CQ13.2', 'Compare types of IPv6 network addresses', 'So sánh các loại địa chỉ mạng của IPv6', ''],
  ['39', 'CQ13.3', 'How to configure IPv6 address on Cisco devices?', 'Cấu hình địa chỉ IPv6 trên thiết bị Cisco thế nào?', ''],
  ['40', 'CQ14.1', 'What is ICMP?', 'ICMP là gì?', ''],
  ['41', 'CQ14.2', 'How to test network connectivity using ICMP?', 'Kiểm tra kết nối mạng bằng ICMP thế nào?', ''],
  ['42', 'CQ14.3', 'Which other tools can we use to test network connectivity? How does it works(Do lab 7)?', 'Còn công cụ nào khác để kiểm tra kết nối mạng? Nó hoạt động thế nào (làm lab 7)?', ''],
  ['43', 'CQ15.1', 'What characteristics are there in the Transport Layer?', 'Tầng giao vận có những đặc tính nào?', ''],
  ['44', 'CQ15.2', 'Compare between TCP and UDP? Which protocol do you like to implement?', 'So sánh TCP và UDP? Bạn muốn triển khai giao thức nào?', ''],
  ['45', 'CQ15.3', 'How does TCP session establishment and termination processes facilitate reliable communication?', 'Quá trình thiết lập và kết thúc phiên TCP giúp cho việc truyền tin tin cậy như thế nào?', ''],
  ['46', 'CQ16.1', 'What is the functions of the Application Layer to provide network services to end users?', 'Tầng ứng dụng có những chức năng gì để cung cấp dịch vụ mạng cho người dùng cuối?', ''],
  ['47', 'CQ16.2', 'How does end-user application operate in a peer-to-peer network?', 'Ứng dụng của người dùng cuối hoạt động thế nào trong một mạng ngang hàng?', ''],
  ['48', 'CQ16.3', 'List of services operate in Application Layer? How does it works? Do lab 8', 'Liệt kê các dịch vụ hoạt động ở tầng ứng dụng? Chúng hoạt động thế nào? Làm lab 8', ''],
  ['49', 'CQ17.1', 'Why basic security measure are necessary on network devices?', 'Vì sao các biện pháp bảo mật cơ bản là cần thiết trên thiết bị mạng?', ''],
  ['50', 'CQ17.2', 'How to detect vulnerabilities on the network and technical mitigation?', 'Phát hiện lỗ hổng trên mạng và các biện pháp kỹ thuật để giảm thiểu — làm thế nào?', ''],
  ['51', 'CQ17.3', 'Why do we need to mitigate security threats on a network devices?', 'Vì sao cần giảm thiểu các nguy cơ bảo mật trên thiết bị mạng?', ''],
  ['52', 'CQ18.1', 'What is one of the most effective security tools available for protecting users from external threats?', 'Một trong những công cụ bảo mật hiệu quả nhất để bảo vệ người dùng khỏi nguy cơ từ bên ngoài là gì?', ''],
  ['53', 'CQ18.2', 'What type of attack may involve the use of tools such as nslookup and fping?', 'Kiểu tấn công nào có thể dùng tới những công cụ như nslookup và fping?', ''],
  ['54', 'CQ18.3', 'Which component is designed to protect against unauthorized communications to and from a computer?', 'Thành phần nào được thiết kế để chặn các kết nối không được phép đi vào và đi ra khỏi một máy tính?', ''],
  ['55', 'CQ19.1', 'Which type of network threat is intended to prevent authorized users from accessing resources?', 'Kiểu nguy cơ mạng nào nhằm ngăn người dùng hợp lệ truy cập tài nguyên?', ''],
  ['57', 'CQ19.2', 'Which element of scaling a network involves identifying the physical and logical topologies?', 'Yếu tố nào trong việc mở rộng mạng liên quan tới việc xác định sơ đồ vật lý và sơ đồ logic?', ''],
  ['58', 'CQ20.1', 'A small company has only one router as the exit point to its ISP. Which solution could be adopted to maintain connectivity if the router itself, or its connection to the ISP, fails?', 'Một công ty nhỏ chỉ có một router làm điểm ra tới ISP. Có thể áp dụng giải pháp nào để giữ được kết nối nếu chính router đó, hoặc đường nối tới ISP, bị hỏng?', ''],
  ['59', 'CQ20.2', 'What mechanism can be implemented in a small network to help minimize network latency for real-time streaming applications?', 'Cơ chế nào có thể triển khai trong một mạng nhỏ để giảm độ trễ cho các ứng dụng phát trực tuyến thời gian thực?', ''],
];

const hangCQ = () => CQ.map((r) => '    <tr><td><strong>' + r[0] + '</strong></td><td><span class="badge">' + r[1] + '</span></td>'
  + '<td>' + r[2] + r[4] + '</td><td>' + r[3] + '</td></tr>').join('\n');

/* ══════════════════════════════════════════════════════════════════════════
 * THẺ SÁCH — 5 tài liệu FLM, tất cả của Cisco, KHÔNG ISBN, KHÔNG link.
 * Dùng hằng SACH của _slides.mjs. Luật: .the-sach.khong-link, không .sach-nut,
 * và TUYỆT ĐỐI không gắn link đoán.
 * ══════════════════════════════════════════════════════════════════════════ */
const NHAN = {
  chinh: ['Main material', 'Giáo trình chính'],
  'tham-khao': ['Reference', 'Tham khảo'],
};
const GHI_EN = {
  slides: 'Marked "main material" by the university. Opens only inside netacad.com after your class is provisioned — FLM publishes no link.',
  elearn: 'The 17-module self-study course; it is the backbone of all 60 sessions.',
  video: 'Marked "main material" by the university.',
  labs: '⚠️ Marked NOT a main material, although Lab is worth 20% of the course grade — an inconsistency in the syllabus itself.',
  pt: '⚠️ Also marked NOT a main material. Packet Tracer itself is FREE software from netacad — it is the one thing you need most to practise configuration on your own.',
};
const PHU = ['Cisco · Cisco · no author name, no year, no edition, no ISBN, no URL on FLM',
  'Cisco · Cisco · không tên tác giả, không năm, không số bản, không ISBN, không URL trên FLM'];

/** Một thẻ .the-sach.khong-link từ hằng SACH. i = 0 (EN) hoặc 1 (VI). */
const theSach = (key, i) => '  <div class="the-sach khong-link">'
  + '<span class="sach-ico">📘</span><span class="sach-than">'
  + '<span class="sach-ten">' + SACH[key].ten + '</span>'
  + '<span class="sach-phu">' + PHU[i] + '</span>'
  + '<span class="sach-nhan-nhom">'
  + SACH[key].nhan.map((n) => '<span class="sach-nhan ' + n + '">' + NHAN[n][i] + '</span>').join('')
  + '<span class="sach-nhan">' + (i ? 'Chỉ trong netacad · không link' : 'netacad only · no link') + '</span>'
  + '</span>'
  + '<span class="sach-phu">' + (i ? SACH[key].ghi : GHI_EN[key]) + '</span>'
  + '</span></div>';

const KHOI_SACH = (i) => '<div class="khoi-sach">\n'
  + [ 'slides', 'elearn', 'video', 'labs', 'pt' ].map((k) => theSach(k, i)).join('\n')
  + '\n</div>';

/** Thẻ nổi bật riêng cho phần mềm Packet Tracer (phần web bổ sung). */
const THE_PT = (i) => '<div class="khoi-sach">\n  <div class="the-sach khong-link">'
  + '<span class="sach-ico">🧰</span><span class="sach-than">'
  + '<span class="sach-ten">' + (i ? 'Cisco Packet Tracer — phần mềm mô phỏng mạng (MIỄN PHÍ)' : 'Cisco Packet Tracer — network simulator (FREE)') + '</span>'
  + '<span class="sach-phu">' + (i
    ? 'Cisco · tải trong netacad.com sau khi đăng nhập · bản Windows, macOS và Linux · FLM không cho link nên web KHÔNG đoán link'
    : 'Cisco · downloaded from inside netacad.com after you sign in · Windows, macOS and Linux · FLM gives no link, so this site does not invent one') + '</span>'
  + '<span class="sach-nhan-nhom">'
  + '<span class="sach-nhan mien-phi">' + (i ? 'Miễn phí' : 'Free') + '</span>'
  + '<span class="sach-nhan chinh">' + (i ? 'Cần nhất để tự luyện' : 'What you need most') + '</span>'
  + '</span>'
  + '<span class="sach-phu">' + (i
    ? 'Nó dựng được router ISR, switch Catalyst, PC, server và cả dây nối — tức là làm được 31 bài Packet Tracer và phần lớn 24 Lab mà KHÔNG cần một thiết bị thật nào. Ô Tools của syllabus có tên nó; đây là dòng duy nhất trong ô đó bạn tự có được ở nhà.'
    : 'It builds ISR routers, Catalyst switches, PCs, servers and the cabling between them — so the 31 Packet Tracer activities and most of the 24 labs run with no real hardware at all. The syllabus names it in the Tools cell; it is the only line in that cell you can have at home for free.') + '</span>'
  + '</span></div>\n</div>';

/* ── 0.1 Hồ sơ môn ───────────────────────────────────────────────────────── */
const l01 = doc('nwc204-0-1-ho-so-mon',
  '0.1 — Course profile: 3 credits, 60 sessions, built on CCNA ITN|||0.1 — Hồ sơ môn: 3 tín chỉ, 60 buổi, dựng trên CCNA ITN',
  'Hồ sơ NWC204 đối chiếu từng dòng với syllabus FLM 14520: 3 tín chỉ, 150h với 45h trên lớp chia 60 buổi, sylID 14520, QĐ 968/QĐ-ĐHFPT 07/08/2026, môn dựa trên khoá đầu của CCNA (Introduction to Networks); ô Pre-Requisite trống và ô Description bị cắt giữa câu; so sánh bằng số liệu với NWC203c (sylID 12553).',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.1</span>\n'
+ '<h2>What this course is, line by line from FLM</h2>\n'
+ '<p class="lead">Every number below is copied from FLM syllabus 14520. Nothing here is inferred. Where the syllabus leaves a field empty, this page says so instead of filling it in.</p>\n'
+ '<p class="nhan">' + NGUON + '</p>\n'
+ '<div class="callout ok"><strong>Read this first: NWC204 is the first CCNA course.</strong> The Description field says it verbatim — <em>"This course is based on the first course in the CCNA curriculum."</em> That course is <strong>Introduction to Networks (ITN)</strong>, and you can see it in the materials: 17 e-learning modules, 24 labs, 31 Packet Tracer activities, 36 videos. So the syllabus you are reading is a university wrapper around a Cisco curriculum, and every session in the plan maps to a Cisco ITN module. That single fact tells you what to study when a session is unclear: look up the Cisco module number in the Student Materials column.</div>\n'
+ '<div class="kv-grid">\n'
+ '  <div class="kv"><span class="k">Subject code</span><span class="v">NWC204</span></div>\n'
+ '  <div class="kv"><span class="k">Syllabus name</span><span class="v">Computer Networking_Mạng máy tính</span></div>\n'
+ '  <div class="kv"><span class="k">English name</span><span class="v">Computer Networking</span></div>\n'
+ '  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>\n'
+ '  <div class="kv"><span class="k">Degree level</span><span class="v">Bachelor</span></div>\n'
+ '  <div class="kv"><span class="k">Teaching method</span><span class="v">Lecture, Active learning, Offline</span></div>\n'
+ '  <div class="kv"><span class="k">Sessions</span><span class="v">60</span></div>\n'
+ '  <div class="kv"><span class="k">Scoring scale</span><span class="v">10 · pass from 5</span></div>\n'
+ '  <div class="kv"><span class="k">Pre-requisite</span><span class="v">the field is EMPTY on FLM — the university publishes none</span></div>\n'
+ '  <div class="kv"><span class="k">Decision no.</span><span class="v">968/QĐ-ĐHFPT dated 08/07/2026 (7 Aug 2026)</span></div>\n'
+ '  <div class="kv"><span class="k">Approved</span><span class="v">7 Aug 2026 · IsApproved True · IsActive True · Is Scored True</span></div>\n'
+ '  <div class="kv"><span class="k">Syllabus ID</span><span class="v">14520</span></div>\n'
+ '  <div class="kv"><span class="k">Check it yourself</span><span class="v"><a href="' + FLM + '" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=14520</a></span></div>\n'
+ '</div>\n'
+ '<h3>Where the 150 hours go</h3>\n'
+ '<p>Time Allocation, verbatim: <em>45 hours of contact learning (60 sessions) + 1.4 hours of Practical Examination (PE) + 1 hour of Final Examination (FE) + 102.6 hours of self-study.</em></p>\n'
+ '<table>\n'
+ '  <thead><tr><th>Block</th><th>Hours</th><th>Share of 150h</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Contact learning (60 sessions)</td><td>45</td><td>30.0%</td></tr>\n'
+ '    <tr><td>Self-study</td><td>102.6</td><td>68.4%</td></tr>\n'
+ '    <tr><td>Practical Examination (PE)</td><td>1.4</td><td>0.9%</td></tr>\n'
+ '    <tr><td>Final Examination (FE)</td><td>1</td><td>0.7%</td></tr>\n'
+ '    <tr><td><strong>Total</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="note-ct">Three arithmetic checks <strong>this site</strong> did on those figures (they are not FLM statements). One: the four blocks add to exactly 150.0, so the reading above is the right one. Two: 45 contact hours over 60 sessions is <strong>45 minutes of class per session</strong>. Three: 102.6 self-study hours against 45 contact hours means the syllabus expects <strong>2.28 hours at home for every hour in class</strong> — and it has to, because 24 labs and 31 Packet Tracer activities do not fit into 45 minutes a day. One mismatch worth knowing: the Assessment table gives the PE as <strong>85 minutes</strong> (1.417h) while Time Allocation says <strong>1.4h</strong> (84 minutes). The numbers are close but not identical; neither is wrong enough to matter, and neither is a typo we can resolve for you.</div>\n'
+ '<h3>The Description field is cut off — and we will not finish it for you</h3>\n'
+ '<p>The last sentence of the Description stops mid-word on the FLM page. Here it is exactly as published, including the break:</p>\n'
+ '<pre><code class="language-plaintext">... During the examination, students are required to design or complete a\nsmall network, calculate and configure IP addresses, perform basic router\nand switch configurations, secure network devices, verify c\n                                                          ^\n                                                          the web page ends here\n</code></pre>\n'
+ '<div class="callout warn"><strong>Do not guess the rest.</strong> "verify c" is almost certainly the start of "verify connectivity" — and that is exactly why we will not write it down as fact. What the sentence goes on to require after that (troubleshooting? documentation? a report?) is <strong>not readable</strong>, and a PE requirement you invented is worse than a PE requirement you know you are missing. Ask your lecturer to read you the full field in session 1.</div>\n'
+ '<p>What IS readable, and worth reading twice: the PE is <strong>individual</strong>, and it asks you to <em>design or complete a small network, calculate and configure IP addresses, perform basic router and switch configurations, secure network devices</em>. Those are hands-on verbs, not recall verbs.</p>\n'
+ '<h3>Pre-requisite: empty, not "none"</h3>\n'
+ '<div class="callout"><strong>The Pre-Requisite field contains nothing at all.</strong> FLM does not write "None" there — it writes nothing. So this site does not claim NWC204 has no pre-requisite; it says the university <strong>does not publish one</strong>. Practical consequence: nobody has told you which earlier subject was supposed to teach you binary arithmetic, and (see lesson 0.5) the session plan does not teach it either.</div>\n'
+ '<h3>NWC204 versus the course it replaces, NWC203c</h3>\n'
+ '<p>Until this decision, Computer Networking at FPTU was <strong>NWC203c</strong> (syllabus 12553, decision 359/QĐ-ĐHFPT dated 04/09/2025) — a Coursera self-study subject. The two syllabus pages are measurably different:</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>What</th><th>NWC203c (syllabus 12553)</th><th>NWC204 (syllabus 14520)</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Sessions in the plan</td><td><strong>12</strong>, self-study on Coursera</td><td><strong>60</strong>, in class</td></tr>\n'
+ '    <tr><td>Method</td><td>Blended, Online, Active learning, Inquiry-based</td><td>Lecture, Active learning, <strong>Offline</strong></td></tr>\n'
+ '    <tr><td>Time</td><td>50h online + 3h offline + 1h TE + 2h PE + 94h self-study</td><td>45h contact (60 sessions) + 1.4h PE + 1h FE + 102.6h self-study</td></tr>\n'
+ '    <tr><td>Materials</td><td>6 rows, <strong>all Coursera URLs</strong> — no book, no slides</td><td>Slides + 17 e-learning modules + <strong>36 videos</strong> + <strong>24 labs</strong> + <strong>31 Packet Tracer activities</strong></td></tr>\n'
+ '    <tr><td>Tools cell</td><td><em>"- Internet"</em></td><td>2 × ISR4221/K9 routers, 2 × Catalyst WS-C2960+24TC-L switches, wireless router, Cisco IOS 15+, Packet Tracer, Tera Term, VirtualBox, Wireshark</td></tr>\n'
+ '    <tr><td>Marks</td><td><strong>2</strong>: PE 50% + TE 50%</td><td><strong>4</strong>: Lab 20% + Midterm 10% + Project 20% + Final 50%</td></tr>\n'
+ '    <tr><td>CLOs</td><td>8</td><td><strong>10</strong>, two of them about using AI</td></tr>\n'
+ '    <tr><td>Exam gate</td><td>Coursera specialization <strong>certificate</strong> required</td><td>80% attendance <strong>and</strong> ≥75% on netacad.com</td></tr>\n'
+ '    <tr><td>Nature</td><td>Protocol theory (its Description asks for prior C and probability)</td><td>Hands-on device configuration</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">This comparison is read off the <strong>numbers on the two syllabus pages</strong> — nothing more. It is not a quality judgement on either course, and it is not a claim about what any particular lecturer does in the room.</p>\n'
+ '<div class="note-ct">Why it matters to you and not just to the registrar: NWC203c could be passed by reading. NWC204 cannot. 20% of the grade is labs, another 20% is a project, and the 85-minute PE puts you in front of devices. If you are studying alone, the practical consequence is the next lesson but one: get <strong>Packet Tracer</strong> installed early (lesson 0.4) — it is free and it replaces the router and the switch.</div>\n'
+ '<h3>What to read next</h3>\n'
+ '<ul>\n'
+ '<li><strong>0.2</strong> — the four marks, and why the published table appears to add up to 150%.</li>\n'
+ '<li><strong>0.3</strong> — the ten CLOs verbatim, and which session each is taught in.</li>\n'
+ '<li><strong>0.4</strong> — five Cisco materials and the whole Tools cell; all five have no ISBN and no link.</li>\n'
+ '<li><strong>0.5</strong> — all 60 sessions, plus the Cisco module the plan skips entirely.</li>\n'
+ '<li><strong>0.6</strong> — the five student tasks, including the two gates on sitting the final exam.</li>\n'
+ '<li><strong>0.7</strong> — the 52 constructive questions FPT lists, session by session.</li>\n'
+ '</ul>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.1</span>\n'
+ '<h2>Môn này là gì, đối chiếu từng dòng với FLM</h2>\n'
+ '<p class="lead">Mọi con số dưới đây chép từ syllabus FLM 14520. Không chỗ nào là suy diễn. Chỗ nào trường để trống thì trang này nói là trống, không tự điền.</p>\n'
+ '<p class="nhan">' + NGUON + '</p>\n'
+ '<div class="callout ok"><strong>Đọc dòng này trước: NWC204 là khoá ĐẦU TIÊN của CCNA.</strong> Ô Description nói thẳng — <em>"This course is based on the first course in the CCNA curriculum."</em> Khoá đó tên là <strong>Introduction to Networks (ITN)</strong>, và nhìn vào tài liệu là thấy ngay: 17 module e-learning, 24 Lab, 31 bài Packet Tracer, 36 video. Nghĩa là syllabus bạn đang đọc là một lớp vỏ của trường bọc quanh chương trình của Cisco, và mọi buổi trong kế hoạch đều ứng với một module ITN. Một sự thật đó giải quyết được rất nhiều lúc bí: buổi nào không hiểu thì tra <strong>số module Cisco</strong> ở cột Student Materials rồi đọc đúng module đó.</div>\n'
+ '<div class="kv-grid">\n'
+ '  <div class="kv"><span class="k">Mã môn</span><span class="v">NWC204</span></div>\n'
+ '  <div class="kv"><span class="k">Tên syllabus</span><span class="v">Computer Networking_Mạng máy tính</span></div>\n'
+ '  <div class="kv"><span class="k">Tên tiếng Anh</span><span class="v">Computer Networking</span></div>\n'
+ '  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>\n'
+ '  <div class="kv"><span class="k">Bậc</span><span class="v">Bachelor (đại học)</span></div>\n'
+ '  <div class="kv"><span class="k">Phương pháp dạy-học</span><span class="v">Lecture, Active learning, Offline</span></div>\n'
+ '  <div class="kv"><span class="k">Số buổi</span><span class="v">60</span></div>\n'
+ '  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 · qua môn từ 5</span></div>\n'
+ '  <div class="kv"><span class="k">Môn tiên quyết</span><span class="v">ô này TRỐNG trên FLM — trường không công bố</span></div>\n'
+ '  <div class="kv"><span class="k">Số quyết định</span><span class="v">968/QĐ-ĐHFPT ngày 07/08/2026</span></div>\n'
+ '  <div class="kv"><span class="k">Phê duyệt</span><span class="v">07/08/2026 · IsApproved True · IsActive True · Is Scored True</span></div>\n'
+ '  <div class="kv"><span class="k">Syllabus ID</span><span class="v">14520</span></div>\n'
+ '  <div class="kv"><span class="k">Tự kiểm chứng</span><span class="v"><a href="' + FLM + '" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=14520</a></span></div>\n'
+ '</div>\n'
+ '<h3>150 giờ đi đâu</h3>\n'
+ '<p>Ô Time Allocation, nguyên văn: <em>45 hours of contact learning (60 sessions) + 1.4 hours of Practical Examination (PE) + 1 hour of Final Examination (FE) + 102.6 hours of self-study.</em></p>\n'
+ '<table>\n'
+ '  <thead><tr><th>Khối thời gian</th><th>Số giờ</th><th>Tỷ lệ trong 150h</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Giờ học trên lớp (60 buổi)</td><td>45</td><td>30,0%</td></tr>\n'
+ '    <tr><td>Tự học</td><td>102,6</td><td>68,4%</td></tr>\n'
+ '    <tr><td>Thi thực hành (PE)</td><td>1,4</td><td>0,9%</td></tr>\n'
+ '    <tr><td>Thi cuối kỳ (FE)</td><td>1</td><td>0,7%</td></tr>\n'
+ '    <tr><td><strong>Tổng</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="note-ct">Ba phép kiểm số học <strong>web tự làm</strong> (không phải câu của FLM). Một: bốn khối cộng lại đúng 150,0 — nên cách đọc trên là đúng. Hai: 45 giờ lên lớp chia 60 buổi ra <strong>45 phút lớp mỗi buổi</strong>. Ba: 102,6 giờ tự học so với 45 giờ lên lớp nghĩa là syllabus trông đợi <strong>2,28 giờ ở nhà cho mỗi giờ ở lớp</strong> — và buộc phải như vậy, vì 24 Lab cộng 31 bài Packet Tracer không nhồi được vào 45 phút một ngày. Một chỗ lệch nhỏ nên biết: bảng điểm ghi PE <strong>85 phút</strong> (1,417h) còn Time Allocation ghi <strong>1,4h</strong> (84 phút). Hai số xấp xỉ nhau nhưng không trùng khít; không cái nào sai đủ để ảnh hưởng, và web không tự chọn cái nào đúng thay bạn.</div>\n'
+ '<h3>Ô Description bị CẮT giữa câu — và web không viết nốt hộ</h3>\n'
+ '<p>Câu cuối của ô Description dừng giữa một từ trên trang FLM. Đây là nguyên văn, giữ cả chỗ đứt:</p>\n'
+ '<pre><code class="language-plaintext">... During the examination, students are required to design or complete a\nsmall network, calculate and configure IP addresses, perform basic router\nand switch configurations, secure network devices, verify c\n                                                          ^\n                                                          trang web hết ở đây\n</code></pre>\n'
+ '<div class="callout warn"><strong>Đừng đoán phần còn lại.</strong> "verify c" gần như chắc chắn là đầu của "verify connectivity" — và chính vì "gần như chắc chắn" nên web KHÔNG ghi nó thành sự thật. Sau đó câu này còn đòi gì nữa (xử lý sự cố? lập tài liệu? viết báo cáo?) thì <strong>không đọc được</strong>, mà một yêu cầu thi bạn tự bịa còn tệ hơn một yêu cầu thi bạn biết là mình đang thiếu. Hãy nhờ giảng viên đọc nguyên ô đó ở buổi 1.</div>\n'
+ '<p>Phần ĐỌC ĐƯỢC, và nên đọc hai lần: PE là bài thi <strong>cá nhân</strong>, và nó đòi bạn <em>thiết kế hoặc hoàn thiện một mạng nhỏ, tính và cấu hình địa chỉ IP, cấu hình cơ bản router và switch, làm cứng bảo mật thiết bị mạng</em>. Toàn động từ làm tay, không có động từ nhớ thuộc.</p>\n'
+ '<h3>Môn tiên quyết: TRỐNG, không phải "không có"</h3>\n'
+ '<div class="callout"><strong>Ô Pre-Requisite không có một chữ nào.</strong> FLM không ghi "None" — FLM không ghi gì. Nên web không kết luận "NWC204 không có môn tiên quyết"; web nói đúng điều quan sát được là trường <strong>không công bố</strong>. Hệ quả thực tế: không ai nói cho bạn biết môn nào trước đó lẽ ra phải dạy bạn tính toán nhị phân — mà (xem bài 0.5) kế hoạch 60 buổi cũng không dạy.</div>\n'
+ '<h3>NWC204 so với môn nó thay thế, NWC203c</h3>\n'
+ '<p>Trước quyết định này, môn Mạng máy tính ở FPTU là <strong>NWC203c</strong> (syllabus 12553, QĐ 359/QĐ-ĐHFPT ngày 09/04/2025) — một môn tự học qua Coursera. Hai trang syllabus khác nhau ở những chỗ đo được sau:</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>Hạng mục</th><th>NWC203c (syllabus 12553)</th><th>NWC204 (syllabus 14520)</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Số buổi trong kế hoạch</td><td><strong>12</strong>, tự học trên Coursera</td><td><strong>60</strong>, học trên lớp</td></tr>\n'
+ '    <tr><td>Phương pháp</td><td>Blended, Online, Active learning, Inquiry-based</td><td>Lecture, Active learning, <strong>Offline</strong></td></tr>\n'
+ '    <tr><td>Thời lượng</td><td>50h online + 3h offline + 1h TE + 2h PE + 94h tự học</td><td>45h trên lớp (60 buổi) + 1,4h PE + 1h FE + 102,6h tự học</td></tr>\n'
+ '    <tr><td>Giáo trình</td><td>6 dòng, <strong>toàn là link Coursera</strong> — không sách, không slide</td><td>Slide + 17 module e-learning + <strong>36 video</strong> + <strong>24 Lab</strong> + <strong>31 bài Packet Tracer</strong></td></tr>\n'
+ '    <tr><td>Ô Tools</td><td><em>"- Internet"</em></td><td>2 router ISR4221/K9, 2 switch Catalyst WS-C2960+24TC-L, router không dây, Cisco IOS 15+, Packet Tracer, Tera Term, VirtualBox, Wireshark</td></tr>\n'
+ '    <tr><td>Đầu điểm</td><td><strong>2</strong>: PE 50% + TE 50%</td><td><strong>4</strong>: Lab 20% + Giữa kỳ 10% + Đồ án 20% + Thi cuối 50%</td></tr>\n'
+ '    <tr><td>Số CLO</td><td>8</td><td><strong>10</strong>, trong đó hai CLO về dùng AI</td></tr>\n'
+ '    <tr><td>Điều kiện dự thi</td><td>Phải có <strong>chứng chỉ</strong> specialization của Coursera</td><td>Dự 80% buổi <strong>và</strong> đạt ≥75% trên netacad.com</td></tr>\n'
+ '    <tr><td>Bản chất</td><td>Lý thuyết giao thức (ô Description đòi biết trước C và xác suất)</td><td>Thực hành cấu hình thiết bị</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">Bảng so sánh này đọc ra từ <strong>số liệu trên hai trang syllabus</strong>, không hơn. Nó không phải lời phán xét chất lượng môn nào, và cũng không phải kết luận về việc một giảng viên cụ thể dạy thế nào trong lớp.</p>\n'
+ '<div class="note-ct">Vì sao chỗ này quan trọng với bạn chứ không chỉ với phòng đào tạo: NWC203c có thể qua bằng cách đọc. NWC204 thì không. 20% điểm là Lab, thêm 20% là đồ án, và 85 phút PE đặt bạn ngồi trước thiết bị. Nếu bạn tự học, hệ quả thực tế nằm ở bài 0.4: hãy cài <strong>Packet Tracer</strong> sớm — nó miễn phí và nó thay được cả router lẫn switch.</div>\n'
+ '<h3>Đọc tiếp gì</h3>\n'
+ '<ul>\n'
+ '<li><strong>0.2</strong> — bốn đầu điểm, và vì sao bảng trường công bố đọc thẳng ra 150%.</li>\n'
+ '<li><strong>0.3</strong> — mười CLO nguyên văn, và mỗi CLO học ở buổi nào.</li>\n'
+ '<li><strong>0.4</strong> — năm tài liệu Cisco và toàn bộ ô Tools; cả năm đều không ISBN, không link.</li>\n'
+ '<li><strong>0.5</strong> — đủ 60 buổi, cộng với module Cisco mà kế hoạch bỏ hẳn.</li>\n'
+ '<li><strong>0.6</strong> — năm nhiệm vụ sinh viên, gồm hai cửa ải để được dự thi cuối kỳ.</li>\n'
+ '<li><strong>0.7</strong> — 52 câu hỏi kiến tạo của trường, theo từng buổi.</li>\n'
+ '</ul>',
  ]]);

/* ── 0.2 Cách tính điểm ──────────────────────────────────────────────────── */
const l02 = doc('nwc204-0-2-cach-tinh-diem',
  '0.2 — Grading: Lab 20 + Midterm 10 + Project 20 + Final 50 = 100%|||0.2 — Cách tính điểm: Lab 20 + Giữa kỳ 10 + Đồ án 20 + Thi cuối 50 = 100%',
  'Bốn đầu điểm của NWC204 và cái bẫy đọc bảng: bảng gốc có 6 dòng cộng thẳng ra 150% vì dòng Final exam 50% là DÒNG CHA của Practical Exam 20% + Theoretical Exam 30%. Kèm thời lượng từng đầu điểm, dạng đề, CLO được đo, và hai điều kiện dự thi cuối kỳ.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.2</span>\n'
+ '<h2>Your grade — and the table that seems to add up to 150%</h2>\n'
+ '<p class="lead">NWC204 has <strong>four</strong> marks, not six. The published table has six rows because two of them are sub-rows of a third. Read this once and the arithmetic stops being confusing forever.</p>\n'
+ '<p class="nhan">' + NGUON + ' — Assessments table, verbatim</p>\n'
+ '<h3>What the FLM page literally shows</h3>\n'
+ '<pre><code class="language-plaintext">No. Category                 Type        Part  Weight   Duration\n1   Lab                     on-going    2     20.0%    120-180 minutes/lab\n2   Midterm Progress Test   on-going    1     10.0%    60 minutes/each\n3   Project                 on-going    1     20.0%    assigned sessions\n4   Final exam              Final exam  2     50.0%    145 minutes\n5   Practical Exam          Final exam  1     20.0%    85 minutes/each\n6   Theoretical Exam        Final exam  1     30.0%    60 minutes/each\n                                        -------------\n                       naive sum of all six rows:  150.0%\n</code></pre>\n'
+ '<div class="callout danger"><strong>150% is the wrong reading, and it is the single easiest mistake to make on this page.</strong> Row 4 <code>Final exam 50%</code> is not a fourth exam sitting beside rows 5 and 6 — it is the <strong>parent</strong> of them. Its <code>Part = 2</code> says so: the final exam has two parts, and those two parts are rows 5 and 6. Check it by addition: <strong>20% + 30% = 50%</strong>, and its duration <strong>85 + 60 = 145 minutes</strong>, exactly the 145 minutes row 4 declares. Both the weight and the clock match. So you add rows 1, 2, 3 and 4 — or rows 1, 2, 3, 5 and 6 — but never all six.</div>\n'
+ '<h3>The same table, drawn as the two levels it really has</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>Mark</th><th>Type</th><th>Parts</th><th>Weight</th><th>Duration</th><th>CLOs measured</th><th>Questions</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>Lab</strong></td><td>on-going</td><td><strong>2</strong></td><td><strong>20%</strong></td><td>120–180 minutes/lab</td><td>CLO1 - CLO9</td><td>not published</td></tr>\n'
+ '    <tr><td><strong>Midterm Progress Test</strong></td><td>on-going</td><td>1</td><td><strong>10%</strong></td><td>60 minutes/each</td><td>CLO1 - CLO9</td><td><strong>50</strong></td></tr>\n'
+ '    <tr><td><strong>Project</strong></td><td>on-going</td><td>1</td><td><strong>20%</strong></td><td>Conducted during assigned sessions</td><td>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</td><td>not published</td></tr>\n'
+ '    <tr><td><strong>Final exam</strong> — parent row</td><td><strong>Final exam</strong></td><td><strong>2</strong></td><td><strong>50%</strong></td><td><strong>145 minutes</strong></td><td>All CLOs</td><td>—</td></tr>\n'
+ '    <tr><td>↳ <strong>Practical Exam (PE)</strong></td><td>Final exam</td><td>1</td><td>20%</td><td>85 minutes/each</td><td>CLO2, CLO3, CLO5, CLO6, CLO7 and CLO8</td><td>One integrated scenario consisting of several task groups</td></tr>\n'
+ '    <tr><td>↳ <strong>Theoretical Exam (TE)</strong></td><td>Final exam</td><td>1</td><td>30%</td><td>60 minutes/each</td><td>CLO1-CLO8</td><td><strong>50</strong></td></tr>\n'
+ '    <tr><td colspan="3"><strong>Total that counts</strong></td><td><strong>100%</strong></td><td colspan="3">20 + 10 + 20 + (20 + 30) = 100</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<pre><code class="language-mermaid">\nflowchart TD\n  T["Course grade 100%"] --> L["Lab 20% - 2 parts"]\n  T --> M["Midterm Progress Test 10% - 60 min, 50 questions"]\n  T --> P["Project 20% - during assigned sessions"]\n  T --> F["Final exam 50% - 145 min - PARENT ROW"]\n  F --> PE["Practical Exam 20% - 85 min - one integrated scenario"]\n  F --> TE["Theoretical Exam 30% - 60 min - 50 questions"]\n</code></pre>\n'
+ '<h3>What each mark actually asks of you</h3>\n'
+ '<ul>\n'
+ '<li><strong>Lab — 20%, Part = 2, 120–180 minutes per lab.</strong> "Part = 2" means the 20% is split over <strong>two groups of labs</strong>, worth <strong>10% each</strong>. The session plan matches: labs numbered <strong>1.1 to 1.4</strong> (sessions 5–6, 9–10, 13–14, 19–20) and labs numbered <strong>2.1 to 2.3</strong> (sessions 28–29, 32–33, 39–40). How many labs go into each group and how each is scored is <strong>not published</strong>.</li>\n'
+ '<li><strong>Midterm Progress Test — 10%, one part, 60 minutes, 50 questions.</strong> Session 34 in the plan. 60 minutes for 50 questions is <strong>72 seconds per question</strong>.</li>\n'
+ '<li><strong>Project — 20%, one part.</strong> Duration reads <em>"Conducted during assigned sessions"</em> — the plan assigns eight of them: <strong>43, 44, 47, 48, 51, 52, 56, 57</strong>. Title: <em>Design and Implement a Basic Small Network with AI Assistance</em>. It is group work: session 43 is literally <em>"Divide student groups"</em>.</li>\n'
+ '<li><strong>Practical Exam — 20%, 85 minutes.</strong> The Questions column is a sentence, not a number: <em>"One integrated scenario consisting of several task groups"</em>. That wording matters — it is <strong>one connected network</strong> broken into task groups, so a mistake in an early task can follow you into later ones. It does not measure CLO1, CLO4, CLO9 or CLO10.</li>\n'
+ '<li><strong>Theoretical Exam — 30%, 60 minutes, 50 questions, CLO1-CLO8.</strong> Again 72 seconds per question. Note what is <strong>absent</strong>: CLO9 and CLO10 — the two AI outcomes — are not in the TE list at all.</li>\n'
+ '</ul>\n'
+ '<div class="note-ct"><strong>Our arithmetic on the weights, not an FLM statement.</strong> <strong>50% of the grade is earned before the final exam</strong> (Lab 20 + Midterm 10 + Project 20), and <strong>40% of the grade is hands-on</strong> (Lab 20 + PE 20) versus <strong>40% multiple-choice</strong> (Midterm 10 + TE 30). Those two blocks are the same size, which is a useful thing to know about how to spend the 102.6 self-study hours: half on configuring, half on reading. Scoring scale is <strong>10</strong> and the minimum average to pass is <strong>5</strong>.</div>\n'
+ '<h3>Two gates before you are allowed to sit the final exam</h3>\n'
+ '<div class="callout warn"><strong>Both conditions, not either one.</strong> From StudentTasks, verbatim: <em>"Students must attend at least 80% of contact sessions in order to be accepted to the final examination."</em> <strong>AND</strong> <em>"Students must complete all assignments on the Cisco Networking Academy (https://www.netacad.com/) with a result of at least 75%."</em> With 60 sessions, 80% means you may miss <strong>at most 12</strong>. The netacad gate says <em>all</em> assignments at <em>at least 75%</em> — so a module you left at 40% blocks the exam even with perfect attendance. Check your netacad progress page every week; it is the only place that number lives.</div>\n'
+ '<div class="out">Worked example (our arithmetic, not a university rule):<br>Lab 8.0 × 20% = 1.60<br>Midterm 6.0 × 10% = 0.60<br>Project 8.0 × 20% = 1.60<br>Practical Exam 5.0 × 20% = 1.00<br>Theoretical Exam 6.0 × 30% = 1.80<br><b>Average = 6.60 → above 5, passed</b></div>\n'
+ '<div class="note-ct"><strong>What the syllabus does NOT say</strong>, so this page will not invent it: the completion criteria per mark (the column exists for other subjects; here it is not filled), how many labs belong to each of the two Lab parts, how the Project is split between group mark and individual mark, whether the PE is marked by a person or a script, and what happens if you miss the Midterm. Ask in session 1 and write the answers down.</div>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.2</span>\n'
+ '<h2>Điểm môn của bạn — và cái bảng đọc thẳng ra 150%</h2>\n'
+ '<p class="lead">NWC204 có <strong>bốn</strong> đầu điểm, không phải sáu. Bảng trường công bố có sáu dòng vì hai trong số đó là dòng con của một dòng thứ ba. Đọc một lần là hết lẫn mãi mãi.</p>\n'
+ '<p class="nhan">' + NGUON + ' — bảng Assessments, nguyên văn</p>\n'
+ '<h3>Trang FLM hiện ra đúng như thế này</h3>\n'
+ '<pre><code class="language-plaintext">No. Category                 Type        Part  Weight   Duration\n1   Lab                     on-going    2     20.0%    120-180 minutes/lab\n2   Midterm Progress Test   on-going    1     10.0%    60 minutes/each\n3   Project                 on-going    1     20.0%    assigned sessions\n4   Final exam              Final exam  2     50.0%    145 minutes\n5   Practical Exam          Final exam  1     20.0%    85 minutes/each\n6   Theoretical Exam        Final exam  1     30.0%    60 minutes/each\n                                        -------------\n           cong thang ca sau dong ra:   150.0%\n</code></pre>\n'
+ '<div class="callout danger"><strong>150% là cách đọc SAI, và đây là lỗi dễ mắc nhất trên trang này.</strong> Dòng 4 <code>Final exam 50%</code> không phải một kỳ thi thứ tư nằm cạnh dòng 5 và 6 — nó là <strong>DÒNG CHA</strong> của hai dòng đó. Chính ô <code>Part = 2</code> nói vậy: thi cuối có hai phần, và hai phần đó là dòng 5 và dòng 6. Kiểm bằng phép cộng: <strong>20% + 30% = 50%</strong>, và thời lượng <strong>85 + 60 = 145 phút</strong>, đúng bằng 145 phút mà dòng 4 khai. Cả trọng số lẫn đồng hồ đều khớp. Vậy bạn cộng dòng 1, 2, 3 và 4 — hoặc cộng dòng 1, 2, 3, 5 và 6 — nhưng KHÔNG BAO GIỜ cộng cả sáu.</div>\n'
+ '<h3>Cũng bảng đó, vẽ đúng hai tầng mà nó thật sự có</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>Đầu điểm</th><th>Loại</th><th>Số phần</th><th>Trọng số</th><th>Thời lượng</th><th>CLO được đo</th><th>Số câu</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>Lab</strong> (thực hành)</td><td>on-going</td><td><strong>2</strong></td><td><strong>20%</strong></td><td>120–180 phút/bài</td><td>CLO1 - CLO9</td><td>trường không công bố</td></tr>\n'
+ '    <tr><td><strong>Midterm Progress Test</strong> (kiểm tra giữa kỳ)</td><td>on-going</td><td>1</td><td><strong>10%</strong></td><td>60 phút/lượt</td><td>CLO1 - CLO9</td><td><strong>50</strong></td></tr>\n'
+ '    <tr><td><strong>Project</strong> (đồ án)</td><td>on-going</td><td>1</td><td><strong>20%</strong></td><td>Làm trong các buổi được xếp</td><td>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</td><td>trường không công bố</td></tr>\n'
+ '    <tr><td><strong>Final exam</strong> — DÒNG CHA</td><td><strong>Final exam</strong></td><td><strong>2</strong></td><td><strong>50%</strong></td><td><strong>145 phút</strong></td><td>All CLOs</td><td>—</td></tr>\n'
+ '    <tr><td>↳ <strong>Practical Exam (PE)</strong> — thi thực hành</td><td>Final exam</td><td>1</td><td>20%</td><td>85 phút/lượt</td><td>CLO2, CLO3, CLO5, CLO6, CLO7 and CLO8</td><td>One integrated scenario consisting of several task groups</td></tr>\n'
+ '    <tr><td>↳ <strong>Theoretical Exam (TE)</strong> — thi lý thuyết</td><td>Final exam</td><td>1</td><td>30%</td><td>60 phút/lượt</td><td>CLO1-CLO8</td><td><strong>50</strong></td></tr>\n'
+ '    <tr><td colspan="3"><strong>Tổng thật sự tính điểm</strong></td><td><strong>100%</strong></td><td colspan="3">20 + 10 + 20 + (20 + 30) = 100</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<pre><code class="language-mermaid">\nflowchart TD\n  T["Diem mon 100%"] --> L["Lab 20% - 2 phan"]\n  T --> M["Midterm Progress Test 10% - 60 phut, 50 cau"]\n  T --> P["Project 20% - trong cac buoi duoc xep"]\n  T --> F["Final exam 50% - 145 phut - DONG CHA"]\n  F --> PE["Practical Exam 20% - 85 phut - mot tinh huong lien hoan"]\n  F --> TE["Theoretical Exam 30% - 60 phut - 50 cau"]\n</code></pre>\n'
+ '<h3>Từng đầu điểm thật sự đòi bạn làm gì</h3>\n'
+ '<ul>\n'
+ '<li><strong>Lab — 20%, Part = 2, mỗi bài 120–180 phút.</strong> "Part = 2" nghĩa là 20% chia cho <strong>hai NHÓM Lab</strong>, mỗi nhóm <strong>10%</strong>. Kế hoạch buổi khớp đúng: nhóm Lab mang số <strong>1.1 đến 1.4</strong> (buổi 5–6, 9–10, 13–14, 19–20) và nhóm Lab mang số <strong>2.1 đến 2.3</strong> (buổi 28–29, 32–33, 39–40). Mỗi nhóm gồm mấy bài và chấm ra sao thì <strong>trường không công bố</strong>.</li>\n'
+ '<li><strong>Midterm Progress Test — 10%, một phần, 60 phút, 50 câu.</strong> Buổi 34 trong kế hoạch. 60 phút cho 50 câu là <strong>72 giây một câu</strong>.</li>\n'
+ '<li><strong>Đồ án — 20%, một phần.</strong> Ô Duration ghi <em>"Conducted during assigned sessions"</em> — kế hoạch xếp tám buổi: <strong>43, 44, 47, 48, 51, 52, 56, 57</strong>. Tên đồ án: <em>Design and Implement a Basic Small Network with AI Assistance</em>. Đây là việc làm nhóm: buổi 43 ghi thẳng <em>"Divide student groups"</em> (chia nhóm sinh viên).</li>\n'
+ '<li><strong>Thi thực hành PE — 20%, 85 phút.</strong> Cột số câu của nó là một CÂU, không phải một số: <em>"One integrated scenario consisting of several task groups"</em> — một tình huống liên hoàn gồm nhiều nhóm việc. Cách ghi đó quan trọng: đó là <strong>MỘT mạng liền mạch</strong> chia thành các nhóm việc, nên một chỗ sai ở việc đầu có thể đi theo bạn sang các việc sau. Nó KHÔNG đo CLO1, CLO4, CLO9, CLO10.</li>\n'
+ '<li><strong>Thi lý thuyết TE — 30%, 60 phút, 50 câu, CLO1-CLO8.</strong> Cũng 72 giây một câu. Chú ý chỗ <strong>VẮNG</strong>: CLO9 và CLO10 — hai chuẩn đầu ra về dùng AI — không có trong danh sách của TE.</li>\n'
+ '</ul>\n'
+ '<div class="note-ct"><strong>Phép cộng của web trên các trọng số, không phải câu của FLM.</strong> <strong>50% điểm môn đã chốt trước kỳ thi cuối</strong> (Lab 20 + Giữa kỳ 10 + Đồ án 20), và <strong>40% điểm là làm tay</strong> (Lab 20 + PE 20) so với <strong>40% là trắc nghiệm</strong> (Giữa kỳ 10 + TE 30). Hai khối bằng nhau, và đó là thông tin dùng được để chia 102,6 giờ tự học: một nửa để gõ cấu hình, một nửa để đọc. Thang điểm <strong>10</strong>, điểm trung bình tối thiểu để qua môn là <strong>5</strong>.</div>\n'
+ '<h3>Hai cửa ải trước khi được dự thi cuối kỳ</h3>\n'
+ '<div class="callout warn"><strong>Phải đủ CẢ HAI, không phải một trong hai.</strong> Nguyên văn ô StudentTasks: <em>"Students must attend at least 80% of contact sessions in order to be accepted to the final examination."</em> <strong>VÀ</strong> <em>"Students must complete all assignments on the Cisco Networking Academy (https://www.netacad.com/) with a result of at least 75%."</em> Với 60 buổi, 80% nghĩa là vắng <strong>tối đa 12 buổi</strong>. Cửa netacad nói <em>mọi</em> bài phải đạt <em>ít nhất 75%</em> — nên một module bạn để ở 40% là chặn thi dù điểm danh đủ 100%. Hãy xem trang tiến độ netacad mỗi tuần; đó là chỗ duy nhất con số đó nằm.</div>\n'
+ '<div class="out">Ví dụ tính điểm (số học của web, không phải quy định của trường):<br>Lab 8,0 × 20% = 1,60<br>Giữa kỳ 6,0 × 10% = 0,60<br>Đồ án 8,0 × 20% = 1,60<br>Thi thực hành 5,0 × 20% = 1,00<br>Thi lý thuyết 6,0 × 30% = 1,80<br><b>Điểm trung bình = 6,60 → trên 5, qua môn</b></div>\n'
+ '<div class="note-ct"><strong>Những chỗ syllabus KHÔNG nói</strong> nên trang này không bịa: tiêu chí đạt của từng đầu điểm (cột đó có ở môn khác, ở đây để trống), mỗi nhóm Lab gồm bao nhiêu bài, đồ án chia thế nào giữa điểm nhóm và điểm cá nhân, PE do người chấm hay máy chấm, và vắng bài Giữa kỳ thì xử lý ra sao. Hỏi ngay buổi 1 và ghi lại câu trả lời.</div>',
  ]]);

/* ── 0.3 Mười CLO ────────────────────────────────────────────────────────── */
const hangCLO = () => CLO.map((r) => '    <tr><td><span class="badge">' + r[0] + '</span></td>'
  + '<td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>').join('\n');

const l03 = doc('nwc204-0-3-clo',
  '0.3 — The ten CLOs, verbatim, and the session each is taught in|||0.3 — Mười chuẩn đầu ra (CLO) nguyên văn, và mỗi CLO học ở buổi nào',
  'Mười CLO nguyên văn kèm dịch, bảng ánh xạ CLO ↔ buổi ↔ đầu điểm đo nó; điểm mới của bản 2026 là CLO9 và CLO10 đều về dùng AI; và bốn chỗ bất thường: CLO xếp theo thứ tự chữ cái, buổi 60 ghi CLO1-CLO11, đồ án ghi hai tập CLO khác nhau, buổi 49/50 lệch CLO9 với CLO10.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.3</span>\n'
+ '<h2>The ten course learning outcomes</h2>\n'
+ '<p class="lead">Exams are written against these ten sentences, not against a lecture. Two of them — CLO9 and CLO10 — are about <strong>using AI</strong>, and that is the biggest change in the 2026 version of this subject.</p>\n'
+ '<p class="nhan">' + NGUON + ' — CLO table, verbatim</p>\n'
+ '<div class="callout warn"><strong>The FLM page lists the CLOs in ALPHABETICAL order</strong>, so on the real web page <strong>CLO10 appears second — right after CLO1</strong> ("CLO10" sorts before "CLO2" as text). The table below is re-ordered <strong>1 → 10 by number</strong>, with not one word of the text changed. If your printed copy looks shuffled compared to this, that is why, and nothing is missing.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>CLO</th><th>Verbatim (FLM)</th><th>Translation</th><th>Sessions listing it · count</th><th>Marks that measure it</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangCLO() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">Columns 1–3 are FLM. The "Sessions listing it" column is <strong>counted by this site</strong> from the LO column of the 60-session plan (lesson 0.5) — FLM does not publish that summary. The "Marks" column is read off the Assessments table (lesson 0.2).</p>\n'
+ '<h3>The new thing in the 2026 syllabus: two CLOs about AI</h3>\n'
+ '<p><strong>CLO9</strong> ("Utilize AI tools to analyze, configure, monitor, and troubleshoot networks…") and <strong>CLO10</strong> ("Students use AI and digital tools to collaborate, design, and present small network projects…") did not exist in the NWC203c era. And they are not decoration: <strong>almost every chapter of the plan ends with a section called "Integrate AI Tools for Explaining Concepts (Self Learning)"</strong> — sessions 2, 4, 8, 12, 16, 18, 22, 25, 27, 31, 36, 38, 42, 46, 50, 55. Several labs are marked <em>"Dialogue-based Assessment &amp; Self Learning"</em>, and the project title itself is <em>"…with AI Assistance"</em>.</p>\n'
+ '<div class="note-ct">Two counts this site made, which change how you should read the CLO list. First: <strong>CLO9 is listed in 58 of the 60 sessions</strong> — every session except 23 and 50. It is effectively a standing instruction, not a topic. Second, and more useful at exam time: <strong>CLO9 and CLO10 are not measured by either final exam.</strong> The PE measures CLO2, 3, 5, 6, 7, 8; the TE measures CLO1–CLO8. So the AI outcomes live in the <strong>Lab</strong> (CLO1–CLO9) and the <strong>Project</strong> (CLO3, 5, 6, 7, 8, 9, 10) — and CLO10 appears in <strong>no other mark at all</strong>. If you skip the project you are not skipping 20%, you are skipping the only place one whole outcome is assessed.</div>\n'
+ '<h3>Three inconsistencies in how the plan tags CLOs</h3>\n'
+ '<div class="callout danger"><strong>1. Session 60 is tagged <code>CLO1-CLO11</code> — but the course has only 10 CLOs.</strong> There is no CLO11 anywhere in the syllabus. Sessions 58 and 59, which are the same activity ("Review"), are tagged <code>CLO1-CLO10</code>. Read session 60 as CLO1–CLO10; it is a typo, and this page does not pretend an eleventh outcome exists.</div>\n'
+ '<div class="callout danger"><strong>2. The same project is tagged with two different CLO sets.</strong> Sessions <strong>43, 44, 47, 48</strong> say <code>CLO7-10</code>, i.e. CLO7, 8, 9, 10. Sessions <strong>51, 52, 56, 57</strong> say <code>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</code>. Those are <strong>not the same set</strong>: the second adds CLO3, CLO5 and CLO6. The Assessments table sides with the longer list (the Project row reads <code>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</code>), so the longer list is the one to prepare against — but the syllabus contradicts itself and we are not hiding that.</div>\n'
+ '<div class="callout warn"><strong>3. Sessions 49 and 50 are the same chapter but disagree by one CLO.</strong> Both are chapter 15, Network Security Fundamentals. Session 49 is tagged <code>CLO7, CLO9</code>; session 50 is tagged <code>CLO7, CLO10</code>. Session 50 is the only teaching session in the whole plan that lists CLO10 rather than CLO9 — and its content is <em>"15.5 Integrate AI Tools for Explaining Concepts (Self Learning)"</em>, which reads like CLO9 work. Whether the 9/10 swap is deliberate is <strong>not stated</strong>.</div>\n'
+ '<h3>How to use this list while studying alone</h3>\n'
+ '<p>Read a CLO as a sentence you must be able to <em>perform</em>, not recognise. CLO3 says "Configure switches, routers, and end devices…" — so the test of CLO3 is not whether you can pick the right answer about <code>ip address</code>, it is whether you can sit at a blank switch and bring it up. Three of the ten outcomes start with <strong>Design and implement</strong> or <strong>Configure</strong> (CLO3, CLO5, CLO8), and those three are exactly the ones the 85-minute PE measures.</p>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.3</span>\n'
+ '<h2>Mười chuẩn đầu ra của môn</h2>\n'
+ '<p class="lead">Đề thi viết theo mười câu này, không viết theo bài giảng. Hai trong số đó — CLO9 và CLO10 — là về <strong>dùng AI</strong>, và đó là thay đổi lớn nhất của bản 2026.</p>\n'
+ '<p class="nhan">' + NGUON + ' — bảng CLO, nguyên văn</p>\n'
+ '<div class="callout warn"><strong>Trang FLM liệt kê CLO theo THỨ TỰ CHỮ CÁI</strong>, nên trên trang web thật <strong>CLO10 nằm ở dòng thứ hai — ngay sau CLO1</strong> (chuỗi "CLO10" xếp trước "CLO2"). Bảng dưới đây đã xếp lại <strong>1 → 10 theo số</strong>, và KHÔNG sửa một chữ nào trong phần chữ. Nếu bản in bạn có trông lộn xộn so với đây thì đó là lý do, và không thiếu CLO nào.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>CLO</th><th>Nguyên văn (FLM)</th><th>Dịch</th><th>Buổi có ghi CLO này · số buổi</th><th>Đầu điểm đo nó (PT = Progress Test)</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangCLO() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">Ba cột đầu là của FLM. Cột "Buổi có ghi CLO này" do <strong>web tự ĐẾM</strong> từ cột LO của bảng 60 buổi (bài 0.5) — FLM không công bố bảng tổng hợp đó. Cột "Đầu điểm" đọc từ bảng Assessments (bài 0.2).</p>\n'
+ '<h3>Điểm mới của bản 2026: hai CLO về AI</h3>\n'
+ '<p><strong>CLO9</strong> ("Utilize AI tools to analyze, configure, monitor, and troubleshoot networks…") và <strong>CLO10</strong> ("Students use AI and digital tools to collaborate, design, and present small network projects…") chưa từng có thời NWC203c. Và chúng không phải để trang trí: <strong>gần như mọi chương trong kế hoạch đều kết thúc bằng một mục tên "Integrate AI Tools for Explaining Concepts (Self Learning)"</strong> — các buổi 2, 4, 8, 12, 16, 18, 22, 25, 27, 31, 36, 38, 42, 46, 50, 55. Nhiều Lab được ghi <em>"Dialogue-based Assessment &amp; Self Learning"</em> (đánh giá qua đối thoại &amp; tự học), và chính tên đồ án cũng là <em>"…with AI Assistance"</em>.</p>\n'
+ '<div class="note-ct">Hai phép đếm web tự làm, và chúng đổi cách bạn nên đọc danh sách CLO. Thứ nhất: <strong>CLO9 có mặt ở 58 trong 60 buổi</strong> — mọi buổi trừ 23 và 50. Nó thực chất là một yêu cầu thường trực, không phải một chủ đề. Thứ hai, và hữu dụng hơn khi ôn thi: <strong>CLO9 và CLO10 KHÔNG được đo ở bất kỳ kỳ thi cuối nào.</strong> PE đo CLO2, 3, 5, 6, 7, 8; TE đo CLO1–CLO8. Vậy hai CLO về AI sống trong <strong>Lab</strong> (CLO1–CLO9) và <strong>Đồ án</strong> (CLO3, 5, 6, 7, 8, 9, 10) — còn CLO10 thì <strong>không xuất hiện ở đầu điểm nào khác</strong>. Bỏ đồ án không phải là bỏ 20%, mà là bỏ luôn chỗ duy nhất một chuẩn đầu ra được đánh giá.</div>\n'
+ '<h3>Ba chỗ bất nhất trong cách kế hoạch gán CLO</h3>\n'
+ '<div class="callout danger"><strong>1. Buổi 60 ghi <code>CLO1-CLO11</code> — nhưng môn chỉ có 10 CLO.</strong> Không có CLO11 ở bất cứ đâu trong syllabus. Buổi 58 và 59 cùng một hoạt động ("Review") thì ghi <code>CLO1-CLO10</code>. Hãy đọc buổi 60 là CLO1–CLO10; đó là lỗi gõ, và trang này không giả vờ có một CLO thứ mười một.</div>\n'
+ '<div class="callout danger"><strong>2. Cùng MỘT đồ án mà ghi hai tập CLO khác nhau.</strong> Buổi <strong>43, 44, 47, 48</strong> ghi <code>CLO7-10</code>, tức CLO7, 8, 9, 10. Buổi <strong>51, 52, 56, 57</strong> ghi <code>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</code>. Hai cái đó <strong>không cùng một tập</strong>: cái sau thêm CLO3, CLO5, CLO6. Bảng Assessments đứng về phía danh sách dài (dòng Project ghi <code>CLO3, CLO5, CLO6, CLO7, CLO8, CLO9 and CLO10</code>), nên hãy ôn theo danh sách dài — nhưng syllabus tự mâu thuẫn với chính nó và web không che chỗ đó.</div>\n'
+ '<div class="callout warn"><strong>3. Buổi 49 và 50 cùng một chương mà lệch nhau một CLO.</strong> Cả hai đều là chương 15, An ninh mạng. Buổi 49 ghi <code>CLO7, CLO9</code>; buổi 50 ghi <code>CLO7, CLO10</code>. Buổi 50 là buổi dạy DUY NHẤT trong cả kế hoạch ghi CLO10 thay vì CLO9 — mà nội dung của nó là <em>"15.5 Integrate AI Tools for Explaining Concepts (Self Learning)"</em>, tức nghe như việc của CLO9. Chuyện đổi 9 thành 10 có chủ ý hay không thì <strong>trường không nói</strong>.</div>\n'
+ '<h3>Dùng danh sách này thế nào khi tự học</h3>\n'
+ '<p>Hãy đọc một CLO như một câu bạn phải <em>làm được</em>, không phải câu bạn nhận ra. CLO3 nói "Configure switches, routers, and end devices…" — nên phép thử của CLO3 không phải bạn chọn đúng đáp án về <code>ip address</code>, mà là bạn ngồi trước một con switch trắng và dựng nó lên được. Ba trong mười CLO bắt đầu bằng <strong>Design and implement</strong> hoặc <strong>Configure</strong> (CLO3, CLO5, CLO8), và đúng ba cái đó là những gì 85 phút PE đo.</p>',
  ]]);

/* ── 0.4 Giáo trình & công cụ ────────────────────────────────────────────── */
const l04 = doc('nwc204-0-4-giao-trinh-cong-cu',
  '0.4 — Materials and tools: five Cisco items, no ISBN, no link|||0.4 — Giáo trình và công cụ: năm tài liệu Cisco, không ISBN, không link',
  'Năm tài liệu FLM dạng thẻ sách (đều của Cisco, đều không ISBN và không link, chỉ mở được trong netacad), chỗ chưa khớp khi 24 Lab và 31 bài Packet Tracer bị đánh KHÔNG phải giáo trình chính dù Lab chiếm 20% điểm, toàn bộ ô Tools nguyên văn, và cách học môn này khi không có phòng lab.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.4</span>\n'
+ '<h2>The five materials, and the whole Tools cell</h2>\n'
+ '<p class="lead">All five materials are Cisco\'s, and <strong>not one of them has an author, a year, an edition, an ISBN or a URL</strong> on FLM. That is not an omission on this page — it is what the syllabus contains.</p>\n'
+ '<p class="nhan">' + NGUON + ' — Materials table, all five rows, verbatim</p>\n'
+ KHOI_SACH(0) + '\n'
+ '<div class="callout warn"><strong>Why none of these cards is clickable.</strong> The Materials table gives Author = "Cisco", Publisher = "Cisco", and leaves Published Date, Edition and ISBN <strong>empty for all five rows</strong>. There is no URL column value either. These are Cisco Networking Academy assets: you reach them by signing in to <strong>netacad.com</strong> after your lecturer enrols you in the class. This site therefore shows them as cards with <strong>no link at all</strong> rather than guessing a URL — a guessed link to course material is worse than no link, because you cannot tell a wrong page from the right one until the exam.</div>\n'
+ '<h3>An inconsistency worth knowing before you plan your time</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>#</th><th>Material</th><th>Is Main Material</th><th>Is Online</th><th>Weight it carries in your grade</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>2</td><td>CCNA: Introduction to Networks Slides</td><td><strong>True</strong></td><td>True</td><td>— (reading material)</td></tr>\n'
+ '    <tr><td>3</td><td>E-Learning Content: 17 modules</td><td><strong>True</strong></td><td>True</td><td>gates the exam via the ≥75% netacad rule</td></tr>\n'
+ '    <tr><td>5</td><td>Videos: 36 videos</td><td><strong>True</strong></td><td>True</td><td>— (reading material)</td></tr>\n'
+ '    <tr><td>4</td><td>Labs: 24 hands-on and paper-based labs.</td><td><strong>False</strong> ⚠️</td><td>True</td><td><strong>20% of the course grade</strong></td></tr>\n'
+ '    <tr><td>1</td><td>31 Packet Tracer activities</td><td><strong>False</strong> ⚠️</td><td>False</td><td>the practice the 20% PE is built on</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="callout danger"><strong>The two materials marked "not a main material" are the two that carry marks.</strong> Slides, the 17 e-learning modules and the 36 videos are flagged <code>Is Main Material = True</code>. The <strong>24 labs</strong> and the <strong>31 Packet Tracer activities</strong> are flagged <code>False</code> — and yet Lab is <strong>20%</strong> of your grade and the Practical Exam is another 20% of hands-on work. Row 1 is also flagged <code>Is Online = False</code>, which fits: Packet Tracer files are opened in a program on your own machine, not in a browser. This page reports the flags as published and labels those two rows "Reference" to match them, but <strong>do not treat them as optional</strong>. The flag is inconsistent with the Assessments table; the Assessments table is the one that decides your grade.</div>\n'
+ '<h3>The one piece of software you should install this week</h3>\n'
+ THE_PT(0) + '\n'
+ '<h3>The Tools cell, verbatim</h3>\n'
+ '<pre><code class="language-plaintext">Baseline Equipment Bundle:\n- 2 x ISR4221/K9 Routers\n- 2 x WS-C2960+24TC-L Catalyst switches\n- 1 wireless router (generic brand) with WPA2 support\n- Ethernet patch cables\n- PCs\n- Internet connection for lab and study PCs\n- Optional equipment for connecting to a WLAN\n   + 1 printer or integrated printer/scanner/copier for the class to share\n   + Smartphones and tablets are desirable for use with the labs\nSoftware:\n- Cisco IOS versions:\n   + Routers: Version 15.0 or higher, IP Base feature set\n   + Switches: Version 15.0 or higher, lanbaseK9 feature set\n- Packet Tracer, the most recent version.\n- Open-source server software:\n   + For various services and protocols, such as Telnet, SSH, HTTP, DHCP, FTP, TFTP, etc.\n- Tera Term source SSH client software for lab PCs.\n- Oracle VirtualBox, most recent version.\n- Wireshark, the most recent version.\n</code></pre>\n'
+ '<p>Reading it as a shopping list of jobs rather than a list of boxes:</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>Tool</th><th>What it is for in this course</th><th>Where it appears in the plan</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>2 × ISR4221/K9</strong> routers</td><td>the router you configure by hand — interfaces, default gateway, hardening</td><td>sessions 26–29, and the project</td></tr>\n'
+ '    <tr><td><strong>2 × WS-C2960+24TC-L</strong> Catalyst switches</td><td>the switch you configure, and whose MAC address table you read</td><td>sessions 3–6, 17–20</td></tr>\n'
+ '    <tr><td>1 wireless router with <strong>WPA2</strong></td><td>the wireless media half of the physical layer</td><td>sessions 11–14</td></tr>\n'
+ '    <tr><td>Ethernet patch cables, PCs, internet</td><td>UTP cabling, end devices, connectivity tests</td><td>sessions 11–14, 37–40</td></tr>\n'
+ '    <tr><td><strong>Cisco IOS ≥ 15.0</strong> (IP Base on routers, lanbaseK9 on switches)</td><td>the operating system every command in this course is typed into</td><td>everywhere from session 3 on</td></tr>\n'
+ '    <tr><td><strong>Packet Tracer</strong> (latest)</td><td>simulates all of the above on one laptop</td><td>31 activities across the plan</td></tr>\n'
+ '    <tr><td>Open-source server software (Telnet, SSH, HTTP, DHCP, FTP, TFTP…)</td><td>the services the application layer chapter talks about</td><td>sessions 45–46</td></tr>\n'
+ '    <tr><td><strong>Tera Term</strong></td><td>the terminal program named as the SSH/console client for lab PCs</td><td>named explicitly in Lab 1.1, session 5</td></tr>\n'
+ '    <tr><td><strong>Oracle VirtualBox</strong> (latest)</td><td>virtual machines to act as hosts/servers without extra PCs</td><td>not tied to one session in the plan</td></tr>\n'
+ '    <tr><td><strong>Wireshark</strong> (latest)</td><td>reads real frames off the wire — this is how encapsulation stops being abstract</td><td>installed in Lab 1.2 (session 9), used in Lab 1.4 (session 19)</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">The "Where it appears" column is mapped by this site from the 60-session plan; FLM lists the tools without tying them to sessions.</p>\n'
+ '<h3>Studying this course with no lab room — what actually substitutes for what</h3>\n'
+ '<div class="note-ct"><strong>This whole section is added by CuongThai and is not part of the FLM syllabus.</strong> The Baseline Equipment Bundle costs more than a laptop, and if you are learning at home you will not have it. The good news is that three of the four things you need run on the machine you already own.\n'
+ '<table>\n'
+ '  <thead><tr><th>Syllabus item</th><th>What you can use instead</th><th>What you lose</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>ISR4221 routers, Catalyst 2960 switches, patch cables</td><td><strong>Packet Tracer</strong> — free, and it runs real IOS command syntax</td><td>physical cabling mistakes, console cable handling, and IOS features Packet Tracer only partly emulates</td></tr>\n'
+ '    <tr><td>Wireshark on lab PCs</td><td><strong>Wireshark on your own machine</strong> — same program, free, capture your own Wi-Fi interface</td><td>nothing; this one is identical</td></tr>\n'
+ '    <tr><td>Extra PCs / servers</td><td><strong>VirtualBox</strong> — the syllabus already names it; one VM is one more host</td><td>nothing meaningful for this course</td></tr>\n'
+ '    <tr><td>Tera Term as SSH client</td><td><strong>the <code>ssh</code> command</strong> built into macOS and Linux, or Windows Terminal</td><td>nothing; Tera Term is named because it is the standard on Windows lab images</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ 'Check what you already have — if a command prints a version, that tool is installed:\n'
+ '<pre><code class="language-bash">wireshark --version        # Wireshark, the GUI build\ntshark -v                  # the command-line capture tool, same package\nVBoxManage --version       # Oracle VirtualBox\nssh -V                     # SSH client (built in on macOS and Linux)\n</code></pre>\n'
+ 'Packet Tracer has no version flag worth scripting — open it and read the About box. Reminder from the card above: it is downloaded from <strong>inside netacad.com after you sign in</strong>, and this page does not link it because FLM does not.</div>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.4</span>\n'
+ '<h2>Năm tài liệu, và toàn bộ ô Tools</h2>\n'
+ '<p class="lead">Cả năm tài liệu đều của Cisco, và <strong>không một dòng nào có tác giả cụ thể, năm, số bản, ISBN hay URL</strong> trên FLM. Đó không phải chỗ trang này bỏ sót — đó là đúng những gì syllabus có.</p>\n'
+ '<p class="nhan">' + NGUON + ' — bảng Materials, đủ năm dòng, nguyên văn</p>\n'
+ KHOI_SACH(1) + '\n'
+ '<div class="callout warn"><strong>Vì sao không thẻ nào bấm được.</strong> Bảng Materials ghi Author = "Cisco", Publisher = "Cisco", còn Published Date, Edition và ISBN thì <strong>để trống cho cả năm dòng</strong>. Cột URL cũng không có giá trị nào. Đây là tài sản của Cisco Networking Academy: bạn vào được bằng cách đăng nhập <strong>netacad.com</strong> sau khi giảng viên xếp bạn vào lớp. Vì vậy web hiện chúng thành thẻ <strong>KHÔNG có link</strong> chứ không đoán một URL — một link đoán tới tài liệu học còn tệ hơn không có link, vì bạn không phân biệt được trang sai với trang đúng cho tới lúc thi.</div>\n'
+ '<h3>Một chỗ chưa khớp nên biết trước khi bạn chia thời gian</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>#</th><th>Tài liệu</th><th>Is Main Material</th><th>Is Online</th><th>Nó gánh bao nhiêu điểm của bạn</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>2</td><td>CCNA: Introduction to Networks Slides</td><td><strong>True</strong></td><td>True</td><td>— (tài liệu đọc)</td></tr>\n'
+ '    <tr><td>3</td><td>E-Learning Content: 17 modules</td><td><strong>True</strong></td><td>True</td><td>là cửa ải dự thi qua luật ≥75% trên netacad</td></tr>\n'
+ '    <tr><td>5</td><td>Videos: 36 videos</td><td><strong>True</strong></td><td>True</td><td>— (tài liệu đọc)</td></tr>\n'
+ '    <tr><td>4</td><td>Labs: 24 hands-on and paper-based labs.</td><td><strong>False</strong> ⚠️</td><td>True</td><td><strong>20% điểm môn</strong></td></tr>\n'
+ '    <tr><td>1</td><td>31 Packet Tracer activities</td><td><strong>False</strong> ⚠️</td><td>False</td><td>là phần luyện tay mà 20% PE dựng trên đó</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="callout danger"><strong>Hai tài liệu bị đánh "không phải giáo trình chính" lại đúng là hai tài liệu mang điểm.</strong> Slide, 17 module e-learning và 36 video được đánh <code>Is Main Material = True</code>. Còn <strong>24 Lab</strong> và <strong>31 bài Packet Tracer</strong> bị đánh <code>False</code> — trong khi Lab chiếm <strong>20%</strong> điểm môn và thi thực hành chiếm thêm 20% nữa toàn là việc làm tay. Dòng 1 cũng bị đánh <code>Is Online = False</code>, và điều đó hợp lý: file Packet Tracer mở bằng một chương trình trên máy bạn, không mở trong trình duyệt. Trang này báo cờ đúng như trường công bố và dán nhãn "Tham khảo" cho khớp, nhưng <strong>đừng coi chúng là tuỳ chọn</strong>. Cái cờ đó bất nhất với bảng Assessments; và bảng Assessments mới là cái quyết định điểm của bạn.</div>\n'
+ '<h3>Phần mềm duy nhất bạn nên cài ngay tuần này</h3>\n'
+ THE_PT(1) + '\n'
+ '<h3>Ô Tools, nguyên văn</h3>\n'
+ '<pre><code class="language-plaintext">Baseline Equipment Bundle:\n- 2 x ISR4221/K9 Routers\n- 2 x WS-C2960+24TC-L Catalyst switches\n- 1 wireless router (generic brand) with WPA2 support\n- Ethernet patch cables\n- PCs\n- Internet connection for lab and study PCs\n- Optional equipment for connecting to a WLAN\n   + 1 printer or integrated printer/scanner/copier for the class to share\n   + Smartphones and tablets are desirable for use with the labs\nSoftware:\n- Cisco IOS versions:\n   + Routers: Version 15.0 or higher, IP Base feature set\n   + Switches: Version 15.0 or higher, lanbaseK9 feature set\n- Packet Tracer, the most recent version.\n- Open-source server software:\n   + For various services and protocols, such as Telnet, SSH, HTTP, DHCP, FTP, TFTP, etc.\n- Tera Term source SSH client software for lab PCs.\n- Oracle VirtualBox, most recent version.\n- Wireshark, the most recent version.\n</code></pre>\n'
+ '<p>Đọc nó như một danh sách VIỆC thay vì danh sách hộp thiết bị:</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>Công cụ</th><th>Dùng để làm gì trong môn này</th><th>Xuất hiện ở đâu trong kế hoạch</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>2 router ISR4221/K9</strong></td><td>con router bạn cấu hình bằng tay — cổng, default gateway, làm cứng bảo mật</td><td>buổi 26–29, và đồ án</td></tr>\n'
+ '    <tr><td><strong>2 switch Catalyst WS-C2960+24TC-L</strong></td><td>con switch bạn cấu hình, và là chỗ bạn đọc bảng địa chỉ MAC</td><td>buổi 3–6, 17–20</td></tr>\n'
+ '    <tr><td>1 router không dây có <strong>WPA2</strong></td><td>nửa "không dây" của tầng vật lý</td><td>buổi 11–14</td></tr>\n'
+ '    <tr><td>Cáp Ethernet, PC, đường Internet</td><td>cáp UTP, thiết bị đầu cuối, các phép kiểm kết nối</td><td>buổi 11–14, 37–40</td></tr>\n'
+ '    <tr><td><strong>Cisco IOS ≥ 15.0</strong> (IP Base cho router, lanbaseK9 cho switch)</td><td>hệ điều hành mà mọi câu lệnh của môn này gõ vào</td><td>từ buổi 3 trở đi, khắp môn</td></tr>\n'
+ '    <tr><td><strong>Packet Tracer</strong> (bản mới nhất)</td><td>mô phỏng toàn bộ những thứ trên, trong một chiếc laptop</td><td>31 bài rải khắp kế hoạch</td></tr>\n'
+ '    <tr><td>Server nguồn mở (Telnet, SSH, HTTP, DHCP, FTP, TFTP…)</td><td>chính các dịch vụ mà chương tầng ứng dụng nói tới</td><td>buổi 45–46</td></tr>\n'
+ '    <tr><td><strong>Tera Term</strong></td><td>chương trình terminal được chỉ định làm client SSH/console cho máy phòng lab</td><td>ghi tên thẳng trong Lab 1.1, buổi 5</td></tr>\n'
+ '    <tr><td><strong>Oracle VirtualBox</strong> (bản mới nhất)</td><td>máy ảo để làm host/server mà không cần thêm PC</td><td>kế hoạch không gắn nó vào buổi cụ thể nào</td></tr>\n'
+ '    <tr><td><strong>Wireshark</strong> (bản mới nhất)</td><td>đọc khung thật trên dây — đây là chỗ "đóng gói dữ liệu" thôi trừu tượng</td><td>cài ở Lab 1.2 (buổi 9), dùng ở Lab 1.4 (buổi 19)</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">Cột "Xuất hiện ở đâu" do web đối chiếu từ bảng 60 buổi; FLM liệt kê công cụ mà không gắn chúng vào buổi nào.</p>\n'
+ '<h3>Học môn này mà không có phòng lab thì làm sao</h3>\n'
+ '<div class="note-ct"><strong>Toàn bộ mục này là phần web bổ sung, không phải nội dung syllabus FLM.</strong> Bộ Baseline Equipment Bundle đắt hơn một chiếc laptop, và nếu bạn học ở nhà thì sẽ không có nó. Tin tốt: ba trong bốn thứ bạn cần chạy được ngay trên chính máy bạn đang có.\n'
+ '<table>\n'
+ '  <thead><tr><th>Thứ syllabus đòi</th><th>Thay bằng gì được</th><th>Mất gì</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Router ISR4221, switch Catalyst 2960, cáp mạng</td><td><strong>Packet Tracer</strong> — miễn phí, và nó chạy đúng cú pháp lệnh IOS thật</td><td>mất phần cắm cáp sai, phần cầm cáp console, và một số tính năng IOS mà Packet Tracer chỉ mô phỏng một phần</td></tr>\n'
+ '    <tr><td>Wireshark trên máy phòng lab</td><td><strong>Wireshark trên máy bạn</strong> — cùng một chương trình, miễn phí, bắt gói ngay trên card Wi-Fi của bạn</td><td>không mất gì; chỗ này giống y nguyên</td></tr>\n'
+ '    <tr><td>Thêm PC / server</td><td><strong>VirtualBox</strong> — chính syllabus đã ghi tên nó; một máy ảo là thêm một host</td><td>không mất gì đáng kể cho môn này</td></tr>\n'
+ '    <tr><td>Tera Term làm client SSH</td><td><strong>lệnh <code>ssh</code></strong> có sẵn trên macOS và Linux, hoặc Windows Terminal</td><td>không mất gì; Tera Term được ghi tên vì nó là chuẩn trên ảnh máy Windows của phòng lab</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ 'Kiểm xem bạn đã có sẵn cái gì — lệnh nào in ra được số phiên bản thì công cụ đó đã cài:\n'
+ '<pre><code class="language-bash">wireshark --version        # Wireshark, bản có giao diện\ntshark -v                  # bản bắt gói dòng lệnh, cùng một gói cài\nVBoxManage --version       # Oracle VirtualBox\nssh -V                     # client SSH (macOS và Linux có sẵn)\n</code></pre>\n'
+ 'Packet Tracer không có cờ phiên bản nào đáng viết script — mở nó lên rồi đọc hộp About. Nhắc lại từ thẻ ở trên: nó tải <strong>trong netacad.com sau khi đăng nhập</strong>, và trang này không gắn link vì FLM không có link.</div>',
  ]]);

/* ── 0.5 Kế hoạch đủ 60 buổi ─────────────────────────────────────────────── */
const CANH_BAO_M5_EN = '<div class="callout danger"><h3>⛔ Read this before the table: the plan renumbers the Cisco modules and drops one of them entirely</h3>\n'
+ '<p>The chapter numbers in the Topic column are <strong>the university\'s own numbering</strong>. They do not match the Cisco module numbers in the Student Materials column, and the mismatch is not random — it starts at one exact place. Session 15 is titled <strong>"5. Data Link Layer"</strong> but its material is <strong>"Module 6: Data Link Layer"</strong>. Session 17 is <strong>"6. Ethernet Switching"</strong> with <strong>"Module 7"</strong>. From there the offset of one holds for the rest of the course.</p>\n'
+ '<p>The reason is that <strong>Cisco Module 5 — Number Systems (binary and hexadecimal) — is given no session at all.</strong> It is not renamed, not merged, not moved: it is absent. Compare the two columns yourself in the table below; chapter N of the subject reads Cisco module N+1 from session 15 onward.</p>\n'
+ '<p><strong>Why that is a problem and not just bookkeeping:</strong> sessions <strong>30–33</strong> are IPv4 addressing, subnetting, subnetting to requirements and VLSM, and session <strong>36</strong> is subnetting IPv6. <strong>None of that can be done without reading binary</strong> — a subnet mask <em>is</em> a count of binary ones, and the router compares an address to a mask with a <strong>bitwise AND</strong>. Session 36 additionally needs hexadecimal, because IPv6 is written in hex and a MAC address is hex. The syllabus asks you to do the arithmetic without ever scheduling the arithmetic.</p>\n'
+ '<p><strong>What this site does about it:</strong> there is a make-up chapter, <strong>Chapter 4B</strong>, inserted after Chapter 4 (Physical Layer, sessions 11–14) and before Chapter 5, covering binary, 8-bit ↔ decimal both ways with the 128-64-32-16-8-4-2-1 table, hexadecimal and why MAC and IPv6 use it, and bitwise AND as the router actually performs it. <strong>FPT schedules no session for this; it is a chapter added by this site</strong>, because sessions 30–33 are not learnable without it. In the "Lesson on this site" column it appears as <strong>Ch.4B</strong> with no session number, and that blank is deliberate and honest.</p>\n'
+ '<pre><code class="language-mermaid">\nflowchart LR\n  M4["Cisco Module 4 - Physical Layer"] --> C4["Subject chapter 4 - sessions 11-14"]\n  M5["Cisco Module 5 - Number Systems"] -.-> X["NO SESSION AT ALL - this site adds Chapter 4B"]\n  M6["Cisco Module 6 - Data Link Layer"] --> C5["Subject chapter 5 - sessions 15-16"]\n  M7["Cisco Module 7 - Ethernet Switching"] --> C6["Subject chapter 6 - sessions 17-20"]\n  M8["Cisco Module 8 - Network Layer"] --> C7["Subject chapter 7 - sessions 21-23"]\n  M11["Cisco Module 11 - IPv4 Addressing"] --> C10["Subject chapter 10 - sessions 30-34"]\n  X -.-> C10\n</code></pre>\n'
+ '<p class="ghi-chu">The dotted arrows are this site\'s reading, not FLM\'s: Module 5 leads nowhere in the plan, and Chapter 4B exists only because sessions 30–34 depend on it.</p></div>';

const CANH_BAO_M5_VI = '<div class="callout danger"><h3>⛔ Đọc chỗ này trước khi xem bảng: kế hoạch đánh số chương LỆCH so với module Cisco và BỎ HẲN một module</h3>\n'
+ '<p>Số chương trong cột Topic là <strong>cách đánh số riêng của trường</strong>. Nó không khớp với số module Cisco ở cột Student Materials, và chỗ lệch không ngẫu nhiên — nó bắt đầu ở đúng một điểm. Buổi 15 tên là <strong>"5. Data Link Layer"</strong> nhưng tài liệu là <strong>"Module 6: Data Link Layer"</strong>. Buổi 17 là <strong>"6. Ethernet Switching"</strong> với <strong>"Module 7"</strong>. Từ đó độ lệch một đơn vị giữ nguyên suốt phần còn lại của môn.</p>\n'
+ '<p>Lý do là <strong>Cisco Module 5 — Number Systems (hệ nhị phân và thập lục phân) — KHÔNG được xếp buổi nào cả.</strong> Nó không bị đổi tên, không bị gộp, không bị dời: nó vắng mặt. Bạn tự đối chiếu hai cột trong bảng dưới đây; chương N của môn đọc Cisco module N+1 kể từ buổi 15 trở đi.</p>\n'
+ '<p><strong>Vì sao đây là vấn đề thật chứ không chỉ là chuyện sổ sách:</strong> buổi <strong>30–33</strong> là địa chỉ IPv4, chia subnet, chia subnet theo yêu cầu và VLSM, còn buổi <strong>36</strong> là chia subnet cho IPv6. <strong>Không làm được một phần nào trong đó nếu không đọc được nhị phân</strong> — một mặt nạ mạng (subnet mask) <em>chính là</em> số bit 1 liên tiếp, và router so địa chỉ với mặt nạ bằng <strong>phép AND theo bit</strong>. Buổi 36 còn cần thêm hệ thập lục phân, vì IPv6 viết bằng hex và địa chỉ MAC cũng là hex. Syllabus bắt bạn làm phép tính mà không xếp buổi nào dạy phép tính đó.</p>\n'
+ '<p><strong>Web làm gì với chỗ hụt này:</strong> có một chương bù, <strong>Chương 4B</strong>, chèn sau Chương 4 (Tầng vật lý, buổi 11–14) và trước Chương 5, dạy: hệ nhị phân · chuyển đổi 8 bit ↔ thập phân cả hai chiều với mẹo bảng 128-64-32-16-8-4-2-1 · hệ thập lục phân và vì sao MAC/IPv6 dùng hex · phép AND theo bit đúng như router thực hiện. <strong>Trường không xếp buổi nào cho phần này; đây là chương web bổ sung</strong>, vì không có nó thì không học được buổi 30–33. Ở cột "Bài trên web" nó hiện là <strong>Ch.4B</strong> mà không có số buổi, và chỗ trống đó là có chủ ý, để bạn biết đâu là của trường đâu là của web.</p>\n'
+ '<pre><code class="language-mermaid">\nflowchart LR\n  M4["Cisco Module 4 - Physical Layer"] --> C4["Chuong 4 cua mon - buoi 11-14"]\n  M5["Cisco Module 5 - Number Systems"] -.-> X["KHONG CO BUOI NAO - web bu bang Chuong 4B"]\n  M6["Cisco Module 6 - Data Link Layer"] --> C5["Chuong 5 cua mon - buoi 15-16"]\n  M7["Cisco Module 7 - Ethernet Switching"] --> C6["Chuong 6 cua mon - buoi 17-20"]\n  M8["Cisco Module 8 - Network Layer"] --> C7["Chuong 7 cua mon - buoi 21-23"]\n  M11["Cisco Module 11 - IPv4 Addressing"] --> C10["Chuong 10 cua mon - buoi 30-34"]\n  X -.-> C10\n</code></pre>\n'
+ '<p class="ghi-chu">Hai mũi tên nét đứt là cách đọc của web, không phải của FLM: Module 5 không dẫn tới đâu trong kế hoạch, và Chương 4B tồn tại chỉ vì buổi 30–34 phụ thuộc vào nó.</p></div>';

const l05 = doc('nwc204-0-5-ke-hoach-60-buoi',
  '0.5 — All 60 sessions, and the Cisco module the plan skips|||0.5 — Kế hoạch đủ 60 buổi, và module Cisco mà kế hoạch bỏ qua',
  'Bảng đủ 60 buổi: Session, Topic nguyên văn tiếng Anh, bản dịch, cột LO và bài tương ứng trên web; kèm callout về việc trường đánh số chương lệch và bỏ hẳn Cisco Module 5 (nhị phân/hex) dù buổi 30-33 bắt buộc phải đọc được nhị phân; đánh dấu tại đúng dòng các chỗ syllabus gõ sai.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.5</span>\n'
+ '<h2>The 60-session plan, complete</h2>\n'
+ '<p class="lead">This is the whole plan, in the university\'s own order, with the Topic column quoted exactly. Use it to check any printed copy you are given — and read the warning below the first paragraph before you use the chapter numbers for anything.</p>\n'
+ '<p class="nhan">' + NGUON + ' — the 60-row session plan, Topic column verbatim</p>\n'
+ CANH_BAO_M5_EN + '\n'
+ '<div class="callout"><strong>How to read the Topic column.</strong> On FLM this cell has no separators — the chapter title and every sub-section run together as one string, e.g. <code>1.5 Internet Connections1.6 Reliable Networks</code>. The table below preserves it <strong>character for character</strong>; nothing was added, removed or re-spaced. The Vietnamese column is a translation, where <code>·</code> marks the section boundaries. Rows carrying <span class="badge">⚠</span> have something wrong or missing in the source; each one says what.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>Session</th><th>Topic — verbatim (FLM)</th><th>Vietnamese</th><th>LO</th><th>Lesson on this site</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangBuoi() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<h3>Chapter mapping used on this site</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>Chapter here</th><th>FLM sessions</th><th>Cisco module</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Ch.1 Networking Today</td><td>1–2</td><td>Module 1</td></tr>\n'
+ '    <tr><td>Ch.2 Basic Switch and End Device Configuration</td><td>3–6</td><td>Module 2</td></tr>\n'
+ '    <tr><td>Ch.3 Protocols and Models</td><td>7–10</td><td>Module 3</td></tr>\n'
+ '    <tr><td>Ch.4 Physical Layer</td><td>11–14</td><td>Module 4</td></tr>\n'
+ '    <tr><td><strong>Ch.4B Number systems (make-up)</strong></td><td><strong>none — not scheduled by FPT</strong></td><td><strong>Module 5, which the plan omits</strong></td></tr>\n'
+ '    <tr><td>Ch.5 Data Link Layer</td><td>15–16</td><td>Module <strong>6</strong></td></tr>\n'
+ '    <tr><td>Ch.6 Ethernet Switching</td><td>17–20</td><td>Module <strong>7</strong></td></tr>\n'
+ '    <tr><td>Ch.7 Network Layer</td><td>21–23</td><td>Module <strong>8</strong></td></tr>\n'
+ '    <tr><td>Ch.8 Address Resolution</td><td>24–25</td><td>Module <strong>9</strong></td></tr>\n'
+ '    <tr><td>Ch.9 Basic Router Configuration</td><td>26–29</td><td>Module <strong>10</strong></td></tr>\n'
+ '    <tr><td>Ch.10 IPv4 Addressing</td><td>30–34</td><td>Module <strong>11</strong></td></tr>\n'
+ '    <tr><td>Ch.11 IPv6 Addressing</td><td>35–36</td><td>Module <strong>12</strong></td></tr>\n'
+ '    <tr><td>Ch.12 ICMP</td><td>37–40</td><td>Module <strong>13</strong></td></tr>\n'
+ '    <tr><td>Ch.13 Transport Layer</td><td>41–42</td><td>Module <strong>14</strong></td></tr>\n'
+ '    <tr><td>Ch.14 Application Layer</td><td>45–46</td><td>Module <strong>15</strong></td></tr>\n'
+ '    <tr><td>Ch.15 Network Security Fundamentals</td><td>49–50</td><td>Module <strong>16</strong></td></tr>\n'
+ '    <tr><td>Ch.16 Build a Small Network</td><td>53–55, 58–60</td><td>Module <strong>17</strong></td></tr>\n'
+ '    <tr><td>Project — Design and Implement a Basic Small Network with AI Assistance</td><td>43–44, 47–48, 51–52, 56–57</td><td>uses labs 15.4.8, 16.2.6, 16.4.7, 16.5.2, 17.4.6, 17.7.6, 17.8.1</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">The Cisco module column is read off the Student Materials cell of each session. The project material list is FLM\'s: the eight project sessions all share the same seven lab/Packet Tracer items.</p>\n'
+ '<h3>Everything the source gets wrong, in one place</h3>\n'
+ '<ul>\n'
+ '<li><strong>Cisco Module 5 has no session</strong> (see the red box above) — the most consequential one.</li>\n'
+ '<li><strong>Session 27</strong> lists <code>9.2 Configure Interfaces</code> then jumps to <code>9.4 Configure the Default Gateway</code> — <strong>9.3 is missing</strong>. In the Cisco module, the section between them is the one about configuring a loopback/verifying interfaces; the syllabus simply does not name it.</li>\n'
+ '<li><strong>Session 35</strong> lists <code>11.1 IPv6 Addressing</code> and then <code>11.3 IPv6 Addressing</code> — <strong>two sections with the same title</strong>.</li>\n'
+ '<li><strong>Session 42</strong> has a stray full stop: <code>13.6 Reliability and Flow Control .</code></li>\n'
+ '<li><strong>Session 39</strong> has a double space: <code>Lab 2.3:&nbsp;&nbsp;Use Ping…</code></li>\n'
+ '<li><strong>Session 41</strong> has no space after the chapter number: <code>13.Transport Layer</code>, unlike the other 59 rows.</li>\n'
+ '<li><strong>Sessions 23, 34 and 53</strong> leave the <strong>ITU column empty</strong> (the other 57 rows say T or U). Those three are Review, Midterm Progress Test and Review — activities rather than new material, which is probably the reason, but the syllabus does not say so.</li>\n'
+ '<li><strong>Session 60</strong> is tagged <code>CLO1-CLO11</code>; there are only 10 CLOs (lesson 0.3).</li>\n'
+ '<li><strong>The same project</strong> carries two different CLO sets (lesson 0.3).</li>\n'
+ '<li>The <strong>S-Download and URLs columns are empty for all 60 rows</strong> — there is no downloadable file and no link anywhere in this plan.</li>\n'
+ '</ul>\n'
+ '<div class="note-ct"><strong>Three structural facts this site counted, which the plan does not state.</strong> One: there are <strong>7 lab blocks</strong> (1.1–1.4 and 2.1–2.3), each spread over <strong>two consecutive sessions</strong>, and the second session is always titled "(continue)" — so a lab is a 2-session job, which matches the 120–180 minutes per lab in the Assessments table. Two: the <strong>project takes 8 sessions</strong>, more than any single chapter, and they are interleaved with teaching (43–44, then 47–48, then 51–52, then 56–57) rather than grouped at the end — so it cannot be left to the last week. Three: <strong>only one Progress Test exists</strong>, at session 34, exactly at the halfway point, and it covers CLO1–CLO9 with 50 questions in 60 minutes.</div>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.5</span>\n'
+ '<h2>Kế hoạch 60 buổi, đầy đủ</h2>\n'
+ '<p class="lead">Đây là toàn bộ kế hoạch, theo đúng thứ tự của trường, cột Topic trích nguyên văn. Dùng nó để đối chiếu với bản in bạn được phát — và đọc khối cảnh báo ngay dưới đoạn này trước khi dùng số chương cho bất cứ việc gì.</p>\n'
+ '<p class="nhan">' + NGUON + ' — bảng kế hoạch 60 buổi, cột Topic nguyên văn</p>\n'
+ CANH_BAO_M5_VI + '\n'
+ '<div class="callout"><strong>Cách đọc cột Topic.</strong> Trên FLM ô này không có dấu phân cách — tên chương và mọi mục con dồn thành một chuỗi liền, ví dụ <code>1.5 Internet Connections1.6 Reliable Networks</code>. Bảng dưới đây giữ nguyên <strong>từng ký tự</strong>; không thêm, không bớt, không chèn dấu cách. Cột tiếng Việt là bản dịch, trong đó dấu <code>·</code> đánh chỗ ngắt giữa các mục. Dòng nào có <span class="badge">⚠</span> là chỗ bản gốc sai hoặc thiếu; mỗi dòng nói rõ sai gì.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>Buổi</th><th>Topic — nguyên văn (FLM)</th><th>Dịch tiếng Việt</th><th>LO</th><th>Bài trên web</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangBuoi() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<h3>Ánh xạ chương mà web dùng</h3>\n'
+ '<table>\n'
+ '  <thead><tr><th>Chương trên web</th><th>Buổi FLM</th><th>Module Cisco</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td>Ch.1 Mạng ngày nay</td><td>1–2</td><td>Module 1</td></tr>\n'
+ '    <tr><td>Ch.2 Cấu hình cơ bản switch và thiết bị đầu cuối</td><td>3–6</td><td>Module 2</td></tr>\n'
+ '    <tr><td>Ch.3 Giao thức và mô hình</td><td>7–10</td><td>Module 3</td></tr>\n'
+ '    <tr><td>Ch.4 Tầng vật lý</td><td>11–14</td><td>Module 4</td></tr>\n'
+ '    <tr><td><strong>Ch.4B Hệ đếm (chương BÙ)</strong></td><td><strong>không có — trường không xếp buổi nào</strong></td><td><strong>Module 5, cái mà kế hoạch bỏ qua</strong></td></tr>\n'
+ '    <tr><td>Ch.5 Tầng liên kết dữ liệu</td><td>15–16</td><td>Module <strong>6</strong></td></tr>\n'
+ '    <tr><td>Ch.6 Chuyển mạch Ethernet</td><td>17–20</td><td>Module <strong>7</strong></td></tr>\n'
+ '    <tr><td>Ch.7 Tầng mạng</td><td>21–23</td><td>Module <strong>8</strong></td></tr>\n'
+ '    <tr><td>Ch.8 Phân giải địa chỉ</td><td>24–25</td><td>Module <strong>9</strong></td></tr>\n'
+ '    <tr><td>Ch.9 Cấu hình router cơ bản</td><td>26–29</td><td>Module <strong>10</strong></td></tr>\n'
+ '    <tr><td>Ch.10 Địa chỉ IPv4</td><td>30–34</td><td>Module <strong>11</strong></td></tr>\n'
+ '    <tr><td>Ch.11 Địa chỉ IPv6</td><td>35–36</td><td>Module <strong>12</strong></td></tr>\n'
+ '    <tr><td>Ch.12 ICMP</td><td>37–40</td><td>Module <strong>13</strong></td></tr>\n'
+ '    <tr><td>Ch.13 Tầng giao vận</td><td>41–42</td><td>Module <strong>14</strong></td></tr>\n'
+ '    <tr><td>Ch.14 Tầng ứng dụng</td><td>45–46</td><td>Module <strong>15</strong></td></tr>\n'
+ '    <tr><td>Ch.15 Nền tảng an ninh mạng</td><td>49–50</td><td>Module <strong>16</strong></td></tr>\n'
+ '    <tr><td>Ch.16 Dựng một mạng nhỏ</td><td>53–55, 58–60</td><td>Module <strong>17</strong></td></tr>\n'
+ '    <tr><td>Đồ án — Design and Implement a Basic Small Network with AI Assistance</td><td>43–44, 47–48, 51–52, 56–57</td><td>dùng các lab 15.4.8, 16.2.6, 16.4.7, 16.5.2, 17.4.6, 17.7.6, 17.8.1</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<p class="ghi-chu">Cột module Cisco đọc từ ô Student Materials của từng buổi. Danh sách tài liệu đồ án là của FLM: cả tám buổi đồ án dùng chung đúng bảy mục lab/Packet Tracer đó.</p>\n'
+ '<h3>Mọi chỗ bản gốc sai, gom về một chỗ</h3>\n'
+ '<ul>\n'
+ '<li><strong>Cisco Module 5 không có buổi nào</strong> (xem khối đỏ ở trên) — chỗ gây hậu quả nặng nhất.</li>\n'
+ '<li><strong>Buổi 27</strong> ghi <code>9.2 Configure Interfaces</code> rồi nhảy sang <code>9.4 Configure the Default Gateway</code> — <strong>thiếu 9.3</strong>. Trong module Cisco, mục nằm giữa hai mục đó là phần cấu hình loopback / kiểm tra interface; syllabus đơn giản là không gọi tên nó.</li>\n'
+ '<li><strong>Buổi 35</strong> ghi <code>11.1 IPv6 Addressing</code> rồi lại <code>11.3 IPv6 Addressing</code> — <strong>hai mục trùng tên</strong>.</li>\n'
+ '<li><strong>Buổi 42</strong> có một dấu chấm lạc: <code>13.6 Reliability and Flow Control .</code></li>\n'
+ '<li><strong>Buổi 39</strong> có hai dấu cách: <code>Lab 2.3:&nbsp;&nbsp;Use Ping…</code></li>\n'
+ '<li><strong>Buổi 41</strong> thiếu dấu cách sau số chương: <code>13.Transport Layer</code>, khác 59 dòng còn lại.</li>\n'
+ '<li><strong>Buổi 23, 34 và 53</strong> để <strong>ô ITU TRỐNG</strong> (57 dòng kia đều ghi T hoặc U). Ba buổi đó là Ôn tập, Kiểm tra giữa kỳ và Ôn tập — là hoạt động chứ không phải nội dung mới, có lẽ đó là lý do, nhưng syllabus không nói vậy.</li>\n'
+ '<li><strong>Buổi 60</strong> ghi <code>CLO1-CLO11</code>; môn chỉ có 10 CLO (bài 0.3).</li>\n'
+ '<li><strong>Cùng một đồ án</strong> mang hai tập CLO khác nhau (bài 0.3).</li>\n'
+ '<li><strong>Cột S-Download và URLs trống cho cả 60 dòng</strong> — không có file tải về và không có link nào trong toàn bộ kế hoạch này.</li>\n'
+ '</ul>\n'
+ '<div class="note-ct"><strong>Ba sự thật về cấu trúc do web ĐẾM, kế hoạch không nói.</strong> Một: có <strong>7 khối Lab</strong> (1.1–1.4 và 2.1–2.3), mỗi khối trải <strong>hai buổi liền nhau</strong>, buổi thứ hai luôn mang tên "(continue)" — nên một bài Lab là việc của hai buổi, khớp đúng với "120–180 phút mỗi bài" trong bảng điểm. Hai: <strong>đồ án chiếm 8 buổi</strong>, nhiều hơn bất kỳ chương nào, và tám buổi đó CÀI XEN vào giữa các buổi dạy (43–44, rồi 47–48, rồi 51–52, rồi 56–57) chứ không dồn về cuối — nên không để tới tuần cuối được. Ba: <strong>chỉ có MỘT Progress Test</strong>, ở buổi 34, đúng giữa môn, phủ CLO1–CLO9 với 50 câu trong 60 phút.</div>',
  ]]);

/* ── 0.6 Nhiệm vụ sinh viên ──────────────────────────────────────────────── */
const l06 = doc('nwc204-0-6-nhiem-vu-sinh-vien',
  '0.6 — Student tasks: 80% attendance AND 75% on netacad|||0.6 — Nhiệm vụ sinh viên: dự 80% buổi VÀ đạt 75% trên netacad',
  'Năm nhiệm vụ sinh viên nguyên văn kèm dịch: dự ít nhất 80% buổi, làm và nộp đúng hạn mọi bài tập/lab, dùng laptop trong lớp chỉ để học, thường xuyên vào flm.fpt.edu.vn, và hoàn thành mọi bài trên netacad.com đạt tối thiểu 75% — hai điều kiện sau là hai cửa ải để được dự thi cuối kỳ.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.6</span>\n'
+ '<h2>The five student tasks, verbatim</h2>\n'
+ '<p class="lead">Five bullets, and two of them are gates: fail either one and you are not admitted to the final exam, whatever your marks say.</p>\n'
+ '<p class="nhan">' + NGUON + ' — StudentTasks field, all five bullets verbatim</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>#</th><th>Verbatim (FLM)</th><th>Translation</th><th>Consequence</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>1</strong></td><td>Students must attend at least 80% of contact sessions in order to be accepted to the final examination.</td><td>Sinh viên phải dự ít nhất 80% số buổi học trên lớp mới được vào thi cuối kỳ.</td><td><strong>Gate.</strong> 60 sessions → you may miss at most <strong>12</strong>.</td></tr>\n'
+ '    <tr><td><strong>2</strong></td><td>Students are responsible to do all exercises, assignments and labs given by instructor in class or at home and submit on time</td><td>Sinh viên có trách nhiệm làm mọi bài tập, bài assignment và bài lab mà giảng viên giao trên lớp hoặc ở nhà, và nộp đúng hạn.</td><td>Feeds the Lab mark (20%) and the Project mark (20%).</td></tr>\n'
+ '    <tr><td><strong>3</strong></td><td>Use laptop in class only for learning purpose</td><td>Chỉ dùng laptop trong lớp cho việc học.</td><td>Classroom rule.</td></tr>\n'
+ '    <tr><td><strong>4</strong></td><td>Promptly access to the https://flm.fpt.edu.vn/ for up-to-date course information</td><td>Thường xuyên vào https://flm.fpt.edu.vn/ để lấy thông tin môn học mới nhất.</td><td>The syllabus can be replaced mid-term; FLM is the source of truth, not this site.</td></tr>\n'
+ '    <tr><td><strong>5</strong></td><td>Students must complete all assignments on the Cisco Networking Academy (https://www.netacad.com/) with a result of at least 75%.</td><td>Sinh viên phải hoàn thành mọi bài trên Cisco Networking Academy (https://www.netacad.com/) với kết quả ít nhất 75%.</td><td><strong>Gate.</strong> "All", at "at least 75%".</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="callout danger"><strong>Tasks 1 and 5 are joined by AND, not OR.</strong> Perfect attendance with one netacad module left at 60% still means no final exam; a flawless netacad record with 13 absences means the same. These are the only two sentences in the whole syllabus that can stop you sitting an exam you have already paid for, so they deserve a calendar reminder, not a mental note.</div>\n'
+ '<div class="callout warn"><strong>Task 4 is the one students dismiss, and it is the reason this page exists in the form it does.</strong> The syllabus tells you to check FLM for <em>up-to-date</em> information — which is an admission that the document can change. This site is a transcription of syllabus <strong>14520</strong> as read on <strong>20 September 2026</strong>. If FLM shows a different decision number than <strong>968/QĐ-ĐHFPT dated 07/08/2026</strong>, believe FLM and not this page.</div>\n'
+ '<div class="note-ct"><strong>Added by CuongThai, not an FLM rule.</strong> Three practical readings of the five bullets. (a) Task 5 is the only <em>measurable</em> self-study requirement in the course: the 17 e-learning modules each end with a score, and 75% is the bar. Do them <em>before</em> the matching session, not after — the session plan says "Read Module N" for exactly that reason. (b) Task 2 says "in class <strong>or at home</strong>", which matches the 102.6 self-study hours: the labs are not all lab-room work. (c) Nothing in the five bullets mentions Packet Tracer, and yet 31 of the activities are Packet Tracer files. Installing it is not one of your five duties — it is simply how you get the other four done.</div>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.6</span>\n'
+ '<h2>Năm nhiệm vụ của sinh viên, nguyên văn</h2>\n'
+ '<p class="lead">Năm gạch đầu dòng, và hai trong số đó là cửa ải: thiếu một trong hai là không được vào thi cuối kỳ, bất kể điểm của bạn ra sao.</p>\n'
+ '<p class="nhan">' + NGUON + ' — ô StudentTasks, đủ năm gạch đầu dòng, nguyên văn</p>\n'
+ '<table>\n'
+ '  <thead><tr><th>#</th><th>Nguyên văn (FLM)</th><th>Dịch</th><th>Hệ quả</th></tr></thead>\n'
+ '  <tbody>\n'
+ '    <tr><td><strong>1</strong></td><td>Students must attend at least 80% of contact sessions in order to be accepted to the final examination.</td><td>Sinh viên phải dự ít nhất 80% số buổi học trên lớp mới được vào thi cuối kỳ.</td><td><strong>Cửa ải.</strong> 60 buổi → vắng <strong>tối đa 12</strong>.</td></tr>\n'
+ '    <tr><td><strong>2</strong></td><td>Students are responsible to do all exercises, assignments and labs given by instructor in class or at home and submit on time</td><td>Sinh viên có trách nhiệm làm mọi bài tập, bài assignment và bài lab mà giảng viên giao trên lớp hoặc ở nhà, và nộp đúng hạn.</td><td>Nuôi điểm Lab (20%) và điểm Đồ án (20%).</td></tr>\n'
+ '    <tr><td><strong>3</strong></td><td>Use laptop in class only for learning purpose</td><td>Chỉ dùng laptop trong lớp cho mục đích học tập.</td><td>Quy định lớp học.</td></tr>\n'
+ '    <tr><td><strong>4</strong></td><td>Promptly access to the https://flm.fpt.edu.vn/ for up-to-date course information</td><td>Thường xuyên vào https://flm.fpt.edu.vn/ để lấy thông tin môn học mới nhất.</td><td>Syllabus có thể bị thay giữa kỳ; FLM là nguồn sự thật, không phải trang này.</td></tr>\n'
+ '    <tr><td><strong>5</strong></td><td>Students must complete all assignments on the Cisco Networking Academy (https://www.netacad.com/) with a result of at least 75%.</td><td>Sinh viên phải hoàn thành mọi bài trên Cisco Networking Academy (https://www.netacad.com/) với kết quả ít nhất 75%.</td><td><strong>Cửa ải.</strong> "Mọi" bài, ở mức "ít nhất 75%".</td></tr>\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<div class="callout danger"><strong>Nhiệm vụ 1 và 5 nối với nhau bằng VÀ, không phải HOẶC.</strong> Điểm danh đủ 100% mà còn một module netacad để ở 60% thì vẫn không được thi; hồ sơ netacad sạch bong mà vắng 13 buổi thì cũng vậy. Đây là hai câu duy nhất trong cả syllabus có thể chặn bạn dự một kỳ thi bạn đã đóng tiền, nên chúng đáng được đặt lịch nhắc, không phải chỉ ghi nhớ trong đầu.</div>\n'
+ '<div class="callout warn"><strong>Nhiệm vụ 4 là cái sinh viên hay bỏ qua nhất, và nó là lý do trang này viết theo cách nó đang viết.</strong> Syllabus bảo bạn vào FLM để lấy thông tin <em>mới nhất</em> — tức là chính trường thừa nhận văn bản có thể đổi. Trang này là bản chép lại syllabus <strong>14520</strong> đọc ngày <strong>20/09/2026</strong>. Nếu FLM hiện một số quyết định khác <strong>968/QĐ-ĐHFPT ngày 07/08/2026</strong> thì hãy tin FLM, đừng tin trang này.</div>\n'
+ '<div class="note-ct"><strong>Phần web bổ sung, không phải quy định của FLM.</strong> Ba cách đọc thực dụng cho năm gạch đầu dòng trên. (a) Nhiệm vụ 5 là yêu cầu tự học DUY NHẤT trong môn có thể ĐO được: 17 module e-learning mỗi module kết thúc bằng một điểm số, và 75% là ngưỡng. Hãy làm chúng <em>trước</em> buổi tương ứng, đừng làm sau — kế hoạch ghi "Read Module N" chính vì lý do đó. (b) Nhiệm vụ 2 ghi "in class <strong>or at home</strong>", khớp với 102,6 giờ tự học: không phải bài Lab nào cũng là việc làm trong phòng lab. (c) Không gạch đầu dòng nào trong năm cái nhắc tới Packet Tracer, mà 31 bài trong giáo trình lại là file Packet Tracer. Cài nó không phải là nhiệm vụ thứ sáu — nó chỉ là cách bạn hoàn thành bốn nhiệm vụ kia.</div>',
  ]]);

/* ── 0.7 Bảng 52 câu hỏi kiến tạo ────────────────────────────────────────── */
const l07 = doc('nwc204-0-7-cau-hoi-kien-tao',
  '0.7 — The 52 constructive questions FPT lists, session by session|||0.7 — Bảng 52 câu hỏi kiến tạo của trường, theo từng buổi',
  'Đủ 52 câu hỏi kiến tạo (Constructive Questions) của syllabus 14520, nguyên văn kèm dịch và cột buổi; nêu ba chỗ bất thường: CQ11.1 ở buổi 31 có nội dung là "Progress Test 2" chứ không phải câu hỏi, bảng đánh số tới CQ20.2 nhưng bỏ trống 8 buổi, và bốn lỗi gõ trong phần chữ.',
  [[
    '<span class="eyebrow">NWC204 · Section 0 · Lesson 0.7</span>\n'
+ '<h2>All 52 constructive questions</h2>\n'
+ '<p class="lead">FPT lists a question (sometimes two) for most sessions. They are the closest thing the syllabus gives you to a spoken exam script — and on this site each one is repeated at the end of the lesson for its own session.</p>\n'
+ '<p class="nhan">' + NGUON + ' — Constructive Questions table, all 52 rows, question text verbatim</p>\n'
+ '<div class="callout"><strong>What these are for.</strong> The teaching method is <em>"Lecture, Active learning, Offline"</em>, several labs are marked <em>"Dialogue-based Assessment"</em>, and CLO10 says the approach <em>"blends dialogue-based assessment with self-directed learning"</em>. Put together, that means you may be asked to <strong>answer out loud</strong>. So the useful way to use this table is not to read it — it is to answer each question in full sentences, from memory, before the session it belongs to.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>Session</th><th>Code</th><th>Question — verbatim (FLM)</th><th>Vietnamese</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangCQ() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<h3>Three things wrong with this table in the source</h3>\n'
+ '<div class="callout danger"><strong>1. <code>CQ11.1</code>, at session 31, is not a question — its text is "Progress Test 2".</strong> Two separate problems follow from that. First, a row in the questions table is being used to schedule an exam. Second, and worse: the Assessments table lists exactly <strong>one</strong> "Midterm Progress Test", and the session plan puts it at <strong>session 34</strong>, not 31. There is no "Progress Test 1" anywhere in this syllabus and therefore nothing for a "Progress Test 2" to be the second of. Treat session 31 as what the plan says it is — <em>10.5 Subnet an IPv4 … 10.10</em>, a teaching session — and your one progress test as session 34.</div>\n'
+ '<div class="callout warn"><strong>2. The codes run up to <code>CQ20.2</code> but eight sessions get no question at all: 6, 9, 15, 16, 22, 30, 36, 56.</strong> So the <code>CQ&lt;n&gt;.&lt;m&gt;</code> numbering does <strong>not</strong> track the chapter number or the session number — CQ11.x lands on sessions 31–33 while chapter 11 is sessions 35–36, for instance. Do not try to derive a session from a CQ code; read the Session column.</div>\n'
+ '<div class="callout warn"><strong>3. Four typos in the question text</strong>, quoted above exactly as published: <code>Constrast</code> for "Contrast" in <strong>CQ4.2</strong> and again as <code>constrast</code> in <strong>CQ6.2</strong> (two occurrences); <code>capling</code> for "cabling" in <strong>CQ4.2</strong>; and <code>Why do we need a reliable networks?</code> in <strong>CQ1.3</strong>, where the singular "a" collides with the plural "networks". Several other rows have loose grammar (<em>"How does UTP cable used…"</em>, <em>"How does Ethernet works…"</em>, <em>"how many are there type of the IPv4 address?"</em>, <em>"How does the way of the router device forward packets?"</em>) — the meaning is clear in every case, and this page does not silently correct any of them.</div>\n'
+ '<div class="note-ct"><strong>Counts by this site, not FLM statements.</strong> 52 rows spread over <strong>51 distinct sessions</strong> — session 1 is the only one with two questions (CQ1.1 and CQ1.2). 60 − 51 = <strong>9 sessions with no question</strong>: the eight the checklist above names, <em>plus session 60</em>, which the syllabus note does not mention. Of those nine: sessions <strong>6</strong> and <strong>56</strong> are "(continue)" halves, <strong>9</strong> is the <em>start</em> of Lab 1.2, <strong>60</strong> is a Review, and <strong>15, 16, 22, 30, 36</strong> are ordinary teaching sessions. So the gaps are not explained by "nothing new happens there" — sessions 30 and 36 are two of the heaviest in the course (IPv4 addressing and IPv6 subnetting). One more count: <strong>10</strong> of the 52 open with <strong>Compare</strong>, <strong>Constrast</strong> or <strong>Why</strong>, and <strong>2</strong> more with <strong>Explain</strong> — twelve questions whose expected answer is an argument, not a definition.</div>',
    '<span class="eyebrow">NWC204 · Mục 0 · Bài 0.7</span>\n'
+ '<h2>Đủ 52 câu hỏi kiến tạo</h2>\n'
+ '<p class="lead">Trường ghi một câu hỏi (có buổi hai câu) cho gần như mọi buổi. Đó là thứ gần nhất với một kịch bản hỏi-đáp mà syllabus cho bạn — và trên web này mỗi câu được nhắc lại ở cuối bài của đúng buổi nó thuộc về.</p>\n'
+ '<p class="nhan">' + NGUON + ' — bảng Constructive Questions, đủ 52 dòng, phần chữ nguyên văn</p>\n'
+ '<div class="callout"><strong>Bảng này để làm gì.</strong> Phương pháp dạy là <em>"Lecture, Active learning, Offline"</em>, nhiều Lab được ghi <em>"Dialogue-based Assessment"</em> (đánh giá qua đối thoại), còn CLO10 nói cách tiếp cận <em>"kết hợp đánh giá qua đối thoại với việc tự học có định hướng"</em>. Ghép lại: bạn có thể bị hỏi để <strong>trả lời thành lời</strong>. Nên cách dùng bảng này có ích không phải là đọc nó — mà là trả lời từng câu thành câu trọn vẹn, không nhìn tài liệu, trước buổi tương ứng.</div>\n'
+ '<table>\n'
+ '  <thead><tr><th>Buổi</th><th>Mã</th><th>Câu hỏi — nguyên văn (FLM)</th><th>Dịch tiếng Việt</th></tr></thead>\n'
+ '  <tbody>\n'
+ hangCQ() + '\n'
+ '  </tbody>\n'
+ '</table>\n'
+ '<h3>Ba chỗ bảng này sai trong bản gốc</h3>\n'
+ '<div class="callout danger"><strong>1. <code>CQ11.1</code> ở buổi 31 KHÔNG phải câu hỏi — nội dung của nó là "Progress Test 2".</strong> Từ đó ra hai vấn đề riêng biệt. Một: một dòng trong bảng câu hỏi lại đang được dùng để xếp lịch thi. Hai, và nặng hơn: bảng Assessments chỉ có đúng <strong>MỘT</strong> "Midterm Progress Test", và kế hoạch đặt nó ở <strong>buổi 34</strong>, không phải buổi 31. Trong cả syllabus không có chỗ nào gọi là "Progress Test 1", nên cũng không có gì để một "Progress Test 2" làm cái thứ hai của. Hãy coi buổi 31 đúng như kế hoạch ghi — <em>10.5 Subnet an IPv4 … 10.10</em>, một buổi dạy — và bài progress test duy nhất của bạn là buổi 34.</div>\n'
+ '<div class="callout warn"><strong>2. Mã đánh tới <code>CQ20.2</code> nhưng tám buổi không có câu nào: 6, 9, 15, 16, 22, 30, 36, 56.</strong> Nghĩa là cách đánh số <code>CQ&lt;n&gt;.&lt;m&gt;</code> <strong>KHÔNG</strong> đi theo số chương cũng không theo số buổi — ví dụ CQ11.x rơi vào buổi 31–33 trong khi chương 11 là buổi 35–36. Đừng suy buổi từ mã CQ; hãy đọc cột Buổi.</div>\n'
+ '<div class="callout warn"><strong>3. Bốn lỗi gõ trong phần chữ</strong>, ở trên đã trích đúng như trường công bố: <code>Constrast</code> thay cho "Contrast" ở <strong>CQ4.2</strong> và lần nữa dạng <code>constrast</code> ở <strong>CQ6.2</strong> (hai chỗ); <code>capling</code> thay cho "cabling" ở <strong>CQ4.2</strong>; và <code>Why do we need a reliable networks?</code> ở <strong>CQ1.3</strong>, chỗ mạo từ số ít "a" đụng với số nhiều "networks". Vài dòng khác ngữ pháp cũng lỏng (<em>"How does UTP cable used…"</em>, <em>"How does Ethernet works…"</em>, <em>"how many are there type of the IPv4 address?"</em>, <em>"How does the way of the router device forward packets?"</em>) — mọi chỗ đều hiểu được ý, và trang này không âm thầm sửa chỗ nào.</div>\n'
+ '<div class="note-ct"><strong>Các phép đếm do web làm, không phải câu của FLM.</strong> 52 dòng trải trên <strong>51 buổi khác nhau</strong> — buổi 1 là buổi duy nhất có hai câu (CQ1.1 và CQ1.2). 60 − 51 = <strong>9 buổi không có câu hỏi nào</strong>: tám buổi mà ghi chú của trường nêu, <em>cộng thêm buổi 60</em> mà ghi chú đó không nhắc. Trong chín buổi ấy, buổi <strong>6</strong> và <strong>56</strong> là buổi "(tiếp)", buổi <strong>15, 16, 22, 30, 36</strong> là buổi dạy bình thường, buổi <strong>9</strong> là buổi mở đầu Lab 1.2, và buổi <strong>60</strong> là Ôn tập. Nói cách khác, các chỗ trống KHÔNG giải thích được bằng câu "buổi đó không có gì mới" — buổi 30 và 36 là hai trong những buổi nặng nhất cả môn (địa chỉ IPv4 và chia subnet IPv6). Một phép đếm nữa: <strong>10</strong> trong 52 câu mở đầu bằng <strong>Compare</strong>, <strong>Constrast</strong> hoặc <strong>Why</strong>, và <strong>2</strong> câu nữa bằng <strong>Explain</strong> — mười hai câu mà đáp án được trông đợi là một lập luận, không phải một định nghĩa.</div>',
  ]]);

/* ══════════════════════════════════════════════════════════════════════════
 * XUẤT — MỘT section duy nhất. Người điều phối gom vào NWC204.mjs.
 * ══════════════════════════════════════════════════════════════════════════ */
export default [
  {
    title: 'Section 0 — Course framework from FLM syllabus 14520|||Mục 0 — Khung chương trình theo syllabus FLM 14520',
    slug: 'nwc204-muc-0',
    description: 'Khung chuẩn 100% theo syllabus FLM 14520 (QĐ 968/QĐ-ĐHFPT ngày 07/08/2026): hồ sơ môn (3 tín chỉ, 150h, 60 buổi, dựa trên khoá đầu của CCNA), bốn đầu điểm 20+10+20+50 = 100% và cái bẫy đọc bảng ra 150%, mười CLO nguyên văn (hai CLO về dùng AI), năm tài liệu Cisco không ISBN không link, kế hoạch đủ 60 buổi cùng chỗ hụt Cisco Module 5, năm nhiệm vụ sinh viên, và đủ 52 câu hỏi kiến tạo.',
    lessons: [l01, l02, l03, l04, l05, l06, l07],
  },
];
