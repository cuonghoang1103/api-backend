/**
 * Curated YouTube track for NWC204 — Computer Networking (nền CCNA ITN).
 *
 * MỌI id ở đây đều do CHÍNH YouTube trả về (`videoId` trong `ytInitialData` của
 * trang kết quả tìm kiếm), rồi nghiệm thu từng cái bằng oEmbed — KHÔNG có id nào
 * do model đoán. Lý do: 27% link model sinh ra là 404, và ảnh xám "video không
 * còn" của YouTube VẪN trả HTTP 200 nên kiểm bằng mã trạng thái là vô dụng.
 * `credit` chép ĐÚNG `author_name — title` mà oEmbed in ra, không tự đặt lại.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/nwc204-computer-networking.mjs
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nwc204-computer-networking.mjs --apply
 *
 * ⛔ MỤC 0 (7 bài: hồ sơ môn, cách tính điểm, CLO, giáo trình, kế hoạch 60 buổi,
 *    nhiệm vụ sinh viên, cách dùng trang) CỐ Ý ĐỂ TRỐNG. Đó là nội dung hành
 *    chính của riêng FPTU — không có video YouTube nào nói đúng về nó, và nhét
 *    một video "giới thiệu ngành mạng" vào đấy là gắn sai chứ không phải gắn
 *    thiếu. Bỏ trống tốt hơn nhét sai.
 *
 * Tiêu chí chọn, theo thứ tự: (1) khớp ĐÚNG chủ đề của bài · (2) kênh chuyên
 * nghiệp đã có tiếng · (3) tiếng Anh rõ, dễ nghe · (4) có mô phỏng / Packet
 * Tracer khi bài là Lab.
 *
 * Kênh dùng: Jeremy's IT Lab (bộ CCNA 200-301 miễn phí, có Packet Tracer — đây
 * là xương sống), Practical Networking, NetworkChuck, Neso Academy, David
 * Bombal, Kevin Wallace (CCIE), PowerCert, Sunny Classroom, và mấy kênh chuyên
 * quay đúng bài Lab của Cisco Netacad cho các bài Lab.
 */
export default {
  courseSlug: 'nwc204-computer-networking',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Chương 1 — Networking Today (buổi 1–2) ─────────────────────────── */
    "nwc204-1-1-mang-la-gi-thanh-phan-to-po": { yt: "H8W9oMNSuwo", credit: "Jeremy's IT Lab — Free CCNA | Network Devices | Day 1 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/01-mang-may-tinh-hom-nay/01-01-mang-la-gi-thanh-phan-to-po-95adebc2.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-1-2-ket-noi-do-tin-cay-de-doa": { yt: "YJGGYKAV4pA", credit: "Practical Networking — How Data moves through the Internet - Networking Fundamentals", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/01-mang-may-tinh-hom-nay/01-02-ket-noi-do-tin-cay-de-doa-2e0a039e.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-1-3-nghe-it-cong-cu-ai-va-tu-kiem": { yt: "S7MNX_UD7vY", credit: "NetworkChuck — FREE CCNA // What is a Network? // Day 0", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/01-mang-may-tinh-hom-nay/01-03-nghe-it-cong-cu-ai-va-tu-kiem-502c9751.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 2 — Cấu hình switch và thiết bị đầu cuối (buổi 3–6) ─────── */
    "nwc204-2-1-vao-thiet-bi-console-ssh-va-che-do-ios": { yt: "IYbtai7Nu2g", credit: "Jeremy's IT Lab — Free CCNA | Intro to the CLI | Day 4 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/02-cau-hinh-switch-va-thiet-bi-dau-cuoi/02-01-vao-thiet-bi-console-ssh-va-che-do-ios-29ce8f0a.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-2-2-cau-truc-lenh-tro-giup-va-lam-cung": { yt: "SDocmq1c05s", credit: "Jeremy's IT Lab — Free CCNA | Basic Device Security | Day 4 Lab | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/02-cau-hinh-switch-va-thiet-bi-dau-cuoi/02-02-cau-truc-lenh-tro-giup-va-lam-cung-e7ddc7ed.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-2-3-luu-cau-hinh-va-cong-dia-chi": { yt: "dIXJJRxbIAc", credit: "IT Boost by Formip — Cisco Config Files Explained: Running vs Startup", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/02-cau-hinh-switch-va-thiet-bi-dau-cuoi/02-03-luu-cau-hinh-va-cong-dia-chi-f19675d0.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-2-4-cau-hinh-ip-va-kiem-tra-ket-noi": { yt: "e1jbvyMeS5I", credit: "Jeremy's IT Lab — Free CCNA | Configuring IP Addresses | Day 8 Lab | CCNA 200-301 Complete Course" },
    "nwc204-2-5-lab-1-1-tera-term-va-cau-hinh-co-ban": { yt: "yQdOyK0n6NY", credit: "Tech Acad — 2.9.1 Packet Tracer - Basic Switch and End Device Configuration" },

    /* ── Chương 3 — Giao thức và các mô hình (buổi 7–10) ────────────────── */
    "nwc204-3-1-luat-giao-thuc-va-bo-giao-thuc": { yt: "CRdL1PcherM", credit: "NetworkChuck — what is TCP/IP and OSI? // FREE CCNA // EP 3", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/03-giao-thuc-va-mo-hinh/03-01-luat-giao-thuc-va-bo-giao-thuc-c08f6403.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi": { yt: "0aGqGKrRE0g", credit: "Practical Networking — OSI Model: A Practical Perspective - Part 2 - Networking Fundamentals - Lesson 2b", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/03-giao-thuc-va-mo-hinh/03-02-mo-hinh-tham-chieu-va-dong-goi-f575116e.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-3-3-lab-1-2-wireshark": { yt: "qTaOZrDnMzQ", credit: "Anson Alexander — Wireshark Tutorial for Beginners | Network Scanning Made Easy", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/03-giao-thuc-va-mo-hinh/03-03-lab-1-2-wireshark-84e1ba43.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 4 — Tầng vật lý (buổi 11–14) ────────────────────────────── */
    "nwc204-4-1-tang-vat-ly-va-cap-dong": { yt: "ieTH5lVhNaY", credit: "Jeremy's IT Lab — Free CCNA | Interfaces and Cables | Day 2 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/04-tang-vat-ly/04-01-tang-vat-ly-va-cap-dong-ed37ad72.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-4-2-utp-cap-quang-va-khong-day": { yt: "Hoe48glXbjk", credit: "trueCABLE — Fiber Optic vs Ethernet Cable: When and Where to Use", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/04-tang-vat-ly/04-02-utp-cap-quang-va-khong-day-7d095911.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-4-3-lab-1-3-thong-tin-nic": { yt: "DzvQxrz9ar8", credit: "Christian Augusto Romero Goyzueta — 4.6.6 Lab - View Wired and Wireless NIC Information" },

    /* ── Chương 4B — Hệ đếm (chương BÙ, trường không xếp buổi) ──────────── */
    "nwc204-4b-1-he-nhi-phan-va-chuyen-doi-8-bit": { yt: "Toa5-1i4wRE", credit: "David Bombal — Binary? How does that work?  | Free CCNA 200-301 Course | Video #13", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/05-he-dem/05-01-he-nhi-phan-va-chuyen-doi-8-bit-4c56caaf.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-4b-2-he-thap-luc-phan-mac-va-ipv6": { yt: "WI6Uvci2p7E", credit: "Neso Academy — Hexadecimal to Binary & Binary to Hexadecimal Conversion", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/05-he-dem/05-02-he-thap-luc-phan-mac-va-ipv6-0c220b95.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-4b-3-phep-and-theo-bit-va-mat-na-mang": { yt: "JIzMBuJF9Ps", credit: "Robert Mayer — IP Subnetting - Part 3 | Reverse Engineering a Subnet Mask | Bitwise AND Operation", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/05-he-dem/05-03-phep-and-theo-bit-va-mat-na-mang-8df5d695.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 5 — Tầng liên kết dữ liệu (buổi 15–16) ──────────────────── */
    "nwc204-5-1-muc-dich-tang-lien-ket-du-lieu": { yt: "VBAuzvVzOQU", credit: "Neso Academy — Link Layer Services", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/06-tang-lien-ket-du-lieu/06-01-muc-dich-tang-lien-ket-du-lieu-416d9fac.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-5-2-topo-mang-va-dieu-khien-truy-cap": { yt: "YAjfUc7Tt24", credit: "Neso Academy — Multiple Access Protocols", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/06-tang-lien-ket-du-lieu/06-02-topo-mang-va-dieu-khien-truy-cap-a4b1c32a.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-5-3-khung-du-lieu-va-tang-2-tren-may-that": { yt: "clHBnmUckzg", credit: "Kevin Wallace Training, LLC — The Ethernet Frame Format - In Less than 60 Seconds", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/06-tang-lien-ket-du-lieu/06-03-khung-du-lieu-va-tang-2-tren-may-that-5616df9e.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 6 — Chuyển mạch Ethernet (buổi 17–20) ───────────────────── */
    "nwc204-6-1-khung-ethernet-va-dia-chi-mac": { yt: "u2n762WG0Vo", credit: "Jeremy's IT Lab — Free CCNA | Ethernet LAN Switching (Part 1) | Day 5 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/07-chuyen-mach-ethernet/07-01-khung-ethernet-va-dia-chi-mac-3363e031.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep": { yt: "5q1pqdmdPjo", credit: "Jeremy's IT Lab — Free CCNA | Ethernet LAN Switching (Part 2) | Day 6 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/07-chuyen-mach-ethernet/07-02-bang-mac-va-cach-switch-chuyen-tiep-82ddcb7f.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-6-3-lab-1-4-wireshark-va-bang-mac": { yt: "bvBfOpOYDOc", credit: "The Technology Firm — Wireshark MAC FILTERS" },

    /* ── Chương 7 — Tầng mạng (buổi 21–23) ──────────────────────────────── */
    "nwc204-7-1-dac-tinh-tang-mang-va-goi-ipv4": { yt: "aQB22y4liXA", credit: "Jeremy's IT Lab — Free CCNA | IPv4 Header | Day 10 | CCNA 200-301 Complete Course" },
    "nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen": { yt: "aHwAm8GYbn8", credit: "Jeremy's IT Lab — Free CCNA | Routing Fundamentals | Day 11 (part 1) | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/08-tang-mang/08-02-goi-ipv6-va-bang-dinh-tuyen-24017263.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-7-3-on-tap-module-1-den-7": { yt: "4YrYV2io3as", credit: "Jeremy's IT Lab — Free CCNA | The Life of a Packet | Day 12 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/08-tang-mang/08-03-on-tap-module-1-den-7-30a3439e.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 8 — Phân giải địa chỉ (buổi 24–25) ──────────────────────── */
    "nwc204-8-1-mac-va-ip-hai-dia-chi": { yt: "oGoWqdlaOMI", credit: "Sunny Classroom — Why do we need both IP and MAC address?", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/09-phan-giai-dia-chi/09-01-mac-va-ip-hai-dia-chi-fa345323.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-8-2-arp-va-neighbor-discovery": { yt: "QPi5Nvxaosw", credit: "Practical Networking — Address Resolution Protocol (ARP) in less than 5 minutes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/09-phan-giai-dia-chi/09-02-arp-va-neighbor-discovery-a4c76d90.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 9 — Cấu hình router cơ bản (buổi 26–29) ─────────────────── */
    "nwc204-9-1-cau-hinh-khoi-dau-router": { yt: "AvgYqI2qSD4", credit: "Jeremy's IT Lab — Free CCNA | SSH | Day 42 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/10-cau-hinh-router-co-ban/10-01-cau-hinh-khoi-dau-router-ae7de060.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-9-2-cau-hinh-cong-va-default-gateway": { yt: "rzDb5DoBKRk", credit: "Jeremy's IT Lab — Free CCNA | Configuring Interfaces | Day 9 Lab | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/10-cau-hinh-router-co-ban/10-02-cau-hinh-cong-va-default-gateway-20fb3f86.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-9-3-lab-2-1-dung-mang-switch-router": { yt: "5vT41nPz-IA", credit: "Christian Augusto Romero Goyzueta — 10.4.4 Lab - Build a Switch and Router Network", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/10-cau-hinh-router-co-ban/10-03-lab-2-1-dung-mang-switch-router-1bd7ab1a.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 10 — Địa chỉ IPv4 (buổi 30–34) ──────────────────────────── */
    "nwc204-10-1-cau-truc-dia-chi-ipv4": { yt: "3ROdsfEUuhs", credit: "Jeremy's IT Lab — Free CCNA | IPv4 Addressing (Part 1) | Day 7 | CCNA 200-301 Complete Course" },
    "nwc204-10-2-chia-subnet-va-vlsm": { yt: "z-JqCedc9EI", credit: "Jeremy's IT Lab — Free CCNA | Subnetting (Part 3 - VLSM) | Day 15 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/11-dia-chi-ipv4/11-02-chia-subnet-va-vlsm-718e142e.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-10-3-lab-2-2-va-thi-giua-ky": { yt: "GITl4IScWQA", credit: "Tech Acad — 11.10.1 Packet Tracer - Design and Implement a VLSM Addressing Scheme", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/11-dia-chi-ipv4/11-03-lab-2-2-va-thi-giua-ky-f9c9d010.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 11 — Địa chỉ IPv6 (buổi 35–36) ──────────────────────────── */
    "nwc204-11-1-cau-truc-dia-chi-ipv6": { yt: "ZNuXyOXae5U", credit: "Jeremy's IT Lab — Free CCNA | IPv6 Part 1 | Day 31 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/12-dia-chi-ipv6/12-01-cau-truc-dia-chi-ipv6-a4c8607a.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-11-2-cau-hinh-va-chia-subnet-ipv6": { yt: "BdsIahtrWIA", credit: "Jeremy's IT Lab — Free CCNA | Configuring IPv6 (Part 1) | Day 31 Lab | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/12-dia-chi-ipv6/12-02-cau-hinh-va-chia-subnet-ipv6-553acb9b.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 16 — Dựng mạng nhỏ (buổi 54–55) ─────────────────────────── */
    "nwc204-16-1-thiet-bi-giao-thuc-va-mo-rong-mang-nho": { yt: "lPFmQAkahxM", credit: "NetITGeeks — CCNA Module 17: Build a Small Network - Introduction to Networks (ITN)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/17-dung-mang-nho/17-01-thiet-bi-giao-thuc-va-mo-rong-mang-nho-412a84bf.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-16-2-kiem-chung-ra-lenh-va-go-loi-mang-nho": { yt: "1i3XdhC2ZAs", credit: "CBT Nuggets — Steps for Network Troubleshooting" },

    /* ── Chương 14 — Tầng ứng dụng (buổi 45–46) ─────────────────────────── */
    "nwc204-14-1-tang-ung-dung-va-ngang-hang": { yt: "t-ai8JzhHuY", credit: "Jeremy's IT Lab — Free CCNA | OSI Model & TCP/IP Suite | Day 3 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/15-tang-ung-dung/15-01-tang-ung-dung-va-ngang-hang-4b02420d.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-14-2-web-email-dns-dhcp-chia-se-tep": { yt: "mpQZVYPuDGU", credit: "PowerCert Animated Videos — How a DNS Server (Domain Name System) works." },

    /* ── Chương 15 — An ninh mạng (buổi 49–50) ──────────────────────────── */
    "nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong": { yt: "VvFuieyTTSw", credit: "Jeremy's IT Lab — Free CCNA | Security Fundamentals | Day 48 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/16-an-ninh-mang/16-01-moi-de-doa-va-cac-kieu-tan-cong-6bb5c307.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-15-2-giam-thieu-va-lam-cung-thiet-bi": { yt: "sHN3jOJIido", credit: "Jeremy's IT Lab — Free CCNA | Port Security | Day 49 | CCNA 200-301 Complete Course" },

    /* ── Chương 13 — Tầng giao vận (buổi 41–42) ─────────────────────────── */
    "nwc204-13-1-tang-giao-van-va-so-hieu-cong": { yt: "LIEACBqlntY", credit: "Jeremy's IT Lab — Free CCNA | TCP & UDP | Day 30 | CCNA 200-301 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/14-tang-giao-van/14-01-tang-giao-van-va-so-hieu-cong-8dca980d.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that": { yt: "JFch3ctY6nE", credit: "Practical Networking — TCP - 12 simple ideas to explain the Transmission Control Protocol" },

    /* ── Chương 12 — ICMP (buổi 37–40) ──────────────────────────────────── */
    "nwc204-12-1-thong-diep-icmp": { yt: "zesTvBZCESk", credit: "Jeremy's IT Lab — CCNP ENCOR // Internet Control Message Protocol (ICMP) // ENCOR 350-401 Complete Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/13-icmp/13-01-thong-diep-icmp-260dba8e.mp4' }, defaultVideoTrack: 'VI'},
    "nwc204-12-2-ping-traceroute-va-lab-2-3": { yt: "vJV-GBZ6PeM", credit: "PowerCert Animated Videos — PING and TRACERT (traceroute) networking commands", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/13-icmp/13-02-ping-traceroute-va-lab-2-3-748a477f.mp4' }, defaultVideoTrack: 'VI'},
    'nwc204-0-1-ho-so-mon': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nwc204-computer-networking/00-khung-chuong-trinh/00-01-bat-dau-tai-day-nwc204-4717fb91.mp4' }, defaultVideoTrack: 'VI'},
  },
};
