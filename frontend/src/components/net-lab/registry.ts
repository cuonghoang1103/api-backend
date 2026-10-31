/**
 * Danh mục mô phỏng của phòng lab mạng — khoá "Networking for Developers" (/courses/networking-for-developers, 31/10/2026).
 * Bài học nhúng bằng <div class="net-lab net-lab-sim-<tên> net-lab-p-<preset> [net-lab-t-<tour>]"> (dựng bằng
 * content/_labs.mjs — hai danh sách PHẢI khớp nhau; labs/registry.test.ts kiểm). Chỉ tên trong danh mục này mới được gắn.
 *
 * Số liệu: capture THẬT từ lab Docker của khoá (client 10.10.1.10 → router → nginx 10.10.2.10:80 → api 10.10.2.20:3000)
 * và curl -w thật tới cuongthai.com — engine/capture.ts. Thứ gì mô phỏng tự tính đều ghi nhãn "tính ra".
 */
import type { LabDef } from '../labs/registry';

export const NET_LABS: Record<string, LabDef> = {
  encap: {
    en: 'Encapsulation: one request, four envelopes', vi: 'Đóng gói: một request, bốn lớp phong bì', chapterEn: 'Packets & layers', chapterVi: 'Gói tin & các tầng',
    descEn: 'A real 149-byte GET goes down the stack (HTTP → TCP → IP → Ethernet), across the router and up to nginx — with the real hex dump, every field explained, what a router changes, and MTU/MSS/segmentation offload.',
    descVi: 'Một GET thật 149 byte đi xuống ngăn xếp (HTTP → TCP → IP → Ethernet), qua router rồi lên tới nginx — kèm hex dump thật, giải nghĩa từng trường, router đổi gì, và MTU/MSS/segmentation offload.',
    presets: ['http', 'hop', 'mtu'],
    load: () => import('./EncapSim'),
  },
  arp: {
    en: 'ARP: from an IP to a MAC', vi: 'ARP: từ IP ra MAC', chapterEn: 'The local network', chapterVi: 'Mạng cục bộ',
    descEn: 'Broadcast question, unicast answer, the switch learning ports, the cache filling in — real tcpdump lines; why you ARP for the ROUTER to reach another network; stale entries and gratuitous ARP.',
    descVi: 'Hỏi phát rộng, trả lời gửi thẳng, công tắc học cổng, bộ đệm được điền — dòng tcpdump thật; vì sao muốn tới mạng khác thì ARP hỏi ROUTER; mục cũ (stale) và gratuitous ARP.',
    presets: ['lan', 'gateway', 'stale'],
    load: () => import('./ArpSim'),
  },
  socket: {
    en: 'Sockets & ports: who gets the packet?', vi: 'Socket & cổng: gói này của ai?', chapterEn: 'Transport', chapterVi: 'Tầng vận chuyển',
    descEn: 'One listening socket and many connections all on port 80, matched by the 4-tuple with a live ss table; bind 127.0.0.1 vs 0.0.0.0 in Docker; running out of ephemeral ports.',
    descVi: 'Một socket nghe và nhiều kết nối cùng ở cổng 80, ghép theo bộ 4 với bảng ss sống; bind 127.0.0.1 hay 0.0.0.0 trong Docker; cạn cổng tạm.',
    presets: ['demux', 'bind', 'ephemeral'],
    load: () => import('./SocketSim'),
  },
  waterfall: {
    en: 'Type a URL, press Enter: the timing waterfall', vi: 'Gõ URL, bấm Enter: biểu đồ thác thời gian', chapterEn: 'The whole journey', chapterVi: 'Cả hành trình',
    descEn: 'DNS → TCP → TLS → request → first byte → download from real curl -w numbers (cold, reused connection, far away), the cumulative-timing trap, and an RTT slider showing why distance dominates.',
    descVi: 'DNS → TCP → TLS → request → byte đầu → tải về từ số curl -w thật (lần đầu, dùng lại kết nối, máy ở xa), cái bẫy số cộng dồn, và thanh RTT cho thấy vì sao khoảng cách quyết định.',
    presets: ['cold', 'warm', 'far'],
    load: () => import('./WaterfallSim'),
  },
};
