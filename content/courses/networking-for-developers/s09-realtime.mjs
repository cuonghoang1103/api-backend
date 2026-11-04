/**
 * Networking for Developers — Chương 9: Kết nối thời gian thực (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-9-1 … netdev-9-4); thêm lab chương netdev-9-5 và quiz netdev-9-6. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: máy chủ thời gian thực tí hon (ch09/rt-srv.mjs :5100 poll/longpoll/sse) + WebSocket thô RFC 6455 (ch09/ws-srv.mjs :5200)
 * + STUN thật (ch09/stun.py, chạy máy "internet", IP che; TURN mô tả). Output thật: bash lab/code/dung-output-ch9.sh.
 */
import b91 from './bai/090-polling-sse.mjs';
import b92 from './bai/091-websocket.mjs';
import b93 from './bai/092-mo-rong-ws.mjs';
import b94 from './bai/093-webrtc.mjs';
import lab9 from './bai/094-lab9.mjs';
import q9 from './bai/095-quiz-ch9.mjs';

export default {
  title: 'Chapter 9 — Real-time connections|||Chương 9 — Kết nối thời gian thực',
  description: 'Học xong chương: chọn giữa polling, long-polling, SSE và WebSocket theo chi phí (đo thật trên một máy chủ thời gian thực tí hon — poll trùng, long-poll bị giữ time_total, dòng SSE một kết nối, và bẫy đệm-proxy X-Accel-Buffering: no); đọc một WebSocket trên dây (cú nâng 101, bắt tay Sec-WebSocket-Accept = base64(SHA-1(key+GUID)), frame opcode text/ping/pong, mặt nạ, nhịp tim chống idle timeout) bằng một máy chủ WebSocket thô viết tay; mở rộng kết nối sống lâu (trần file descriptor, sticky session + chia sẻ trạng thái Redis, nối lại lùi dần + nhiễu chống bầy đàn, deploy drain/cuốn); và lướt qua WebRTC xuyên NAT (STUN tìm ánh xạ công cộng — đo thật, IP che; ICE thử ứng viên; TURN chuyển tiếp; signalling là việc của bạn qua WebSocket) — kèm lab chương dựng tầng thời gian thực của LabFlow.',
  lessons: [b91, b92, b93, b94, lab9, q9],
};
