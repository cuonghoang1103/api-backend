/**
 * NWC204 — Computer Networking (nền CCNA ITN). Bám 100% FLM Syllabus 14520,
 * QĐ 968/QĐ-ĐHFPT ngày 07/08/2026 — 60 buổi, 10 CLO, 52 câu hỏi kiến tạo.
 * Dữ liệu gốc: content/academy/_syllabus-flm/NWC204.json
 * Hợp đồng soạn bài: content/academy/_HOP-DONG-NWC204.md
 *
 * ⚠️ File này CHỈ GOM các phần lại. Nội dung nằm ở thư mục con nwc204/ —
 * vòng seed của deploy chỉ quét content/academy/*.mjs (không đệ quy) nên
 * thư mục con không bị hiểu nhầm là một môn riêng.
 *
 * ⚠️ Slide do CHÚNG TA tự thiết kế (FLM không đăng slide nào cho môn này;
 * bộ CCNA gốc là tài liệu bản quyền Cisco trên netacad). 240 ảnh ở
 * images/academy/NWC204/v1/ — sửa slide phải render sang prefix MỚI (v2…)
 * vì Cloudflare giữ cache bytes của key đã ghi đè.
 *
 * ⚠️ pruneSections: true — môn được viết lại hoàn toàn theo syllabus mới.
 * Đã đo trên production 20/09/2026: 9 bài cũ, 0 dòng lesson_progress ⇒
 * không mất tiến độ của ai.
 *
 * Hiện phủ buổi 1–29 + chương bù hệ đếm. Buổi 30–60 còn nợ, xem
 * content/academy/_KHUNG-CHUA-DAY-DU.md
 */
import muc0 from './nwc204/muc0.mjs';
import ch01 from './nwc204/ch01.mjs';
import ch02 from './nwc204/ch02.mjs';
import ch03 from './nwc204/ch03.mjs';
import ch04 from './nwc204/ch04.mjs';
import ch04b from './nwc204/ch04b.mjs';
import ch05 from './nwc204/ch05.mjs';
import ch06 from './nwc204/ch06.mjs';
import ch07 from './nwc204/ch07.mjs';
import ch08 from './nwc204/ch08.mjs';
import ch09 from './nwc204/ch09.mjs';

export default {
  semester: {"code":"KY2","name":"Kỳ 2","ordinal":2},
  course: {
    "courseCode": "NWC204",
    "slug": "nwc204-computer-networking",
    "title": "Computer Networking",
    "level": "INTERMEDIATE",
    "language": "Vietnamese",
    "status": "PUBLISHED",
    "syncOrder": true,
    "thumbnailUrl": "https://media.cuongthai.com/images/academy-covers/v3/NWC204.webp",
    "shortDescription": "Networking on a CCNA foundation — OSI/TCP-IP models, TCP/UDP & protocols, Ethernet/LAN/switching, IPv4 addressing & subnetting, router/switch config, security & troubleshooting. Bilingual, with CLI & exercises.|||Mạng nền CCNA — mô hình OSI/TCP-IP, TCP/UDP & giao thức, Ethernet/LAN/switch, địa chỉ IPv4 & subnetting, cấu hình router/switch, bảo mật & xử lý sự cố. Song ngữ, có CLI & bài tập.",
    "description": "Môn <strong>NWC204 — Computer Networking</strong> (kỳ 2), dựa trên môn CCNA đầu tiên. Từ <strong>mô hình &amp; giao thức</strong> (OSI/TCP-IP, đóng gói, TCP vs UDP, DNS/DHCP/HTTP, cổng) → <strong>Ethernet, LAN &amp; địa chỉ IP</strong> (MAC/switch/VLAN, IPv4, subnet mask, private/public/NAT, IPv6) → <strong>router/switch, bảo mật &amp; xử lý sự cố</strong> (cấu hình IOS, SSH, ping/traceroute/show, gỡ lỗi theo tầng). Bám giáo trình FLM, song ngữ, có ví dụ CLI, bài tập subnetting và quiz. Chuẩn bị cho bài thi thực hành kiểu CCNA.",
    "whatYouLearn": "Mô hình OSI/TCP-IP & phân tầng; đóng gói & PDU; TCP vs UDP, IP, DNS/DHCP/HTTP & số cổng; Ethernet, MAC, switch, VLAN; địa chỉ IPv4, subnet mask, private/public, NAT, IPv6 cơ bản; subnetting (mượn bit, kích thước khối, network/host/broadcast); cấu hình router/switch Cisco IOS; bảo mật thiết bị (enable secret, SSH); kiểm tra & xử lý sự cố theo tầng (ping/traceroute/show).",
    "requirements": "Kiến thức máy tính cơ bản. Nên thực hành trên Cisco Packet Tracer (miễn phí) để cấu hình router/switch.",
    "pruneSections": true
  },
  sections: [...muc0, ...ch01, ...ch02, ...ch03, ...ch04, ...ch04b, ...ch05, ...ch06, ...ch07, ...ch08, ...ch09],
};
