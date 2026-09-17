import { io, type Socket } from 'socket.io-client';
import type { ApiClient } from '../api/client';

// ════════════════════════════════════════════════════════════════
// KẾT NỐI THỜI GIAN THỰC
//
// ⚠️ VÌ SAO GIỜ MỚI CÓ: `MessagesPage` cố ý KHÔNG dùng socket, hỏi lại mỗi 8
// giây thay thế — ghi rõ trong đầu file đó, và lý do vẫn đúng: thêm một kết
// nối thường trực là thêm một đường có thể hỏng.
//
// Gọi thoại buộc phải có. Báo hiệu cuộc gọi cần trao đổi hai chiều DƯỚI MỘT
// GIÂY: lời chào, lời đáp, rồi hàng chục ứng viên đường mạng. Với nhịp 8 giây
// thì cuộc gọi mất cả phút mới nối được, mà ứng viên ICE đã hết hạn trước đó.
//
// Có rồi thì tin nhắn cũng dùng luôn — hết cảnh trễ 8 giây.
// ════════════════════════════════════════════════════════════════

let socket: Socket | null = null;
let apiRef: ApiClient | null = null;

export function noiSocket(api: ApiClient, apiOrigin: string): Socket | null {
  if (socket?.connected) return socket;
  const token = api.layToken();
  if (!token) return null;

  apiRef = api;
  socket?.removeAllListeners();
  socket?.disconnect();

  // Dùng THẲNG gốc API — đã đo cả hai gốc đều phục vụ socket.io (cùng trả
  // 200 cho `/socket.io/?EIO=4`), nên không cần biến đổi tên miền. Bản nháp
  // trước của tôi tự đổi `api.x` → `x`; thừa, và là một chỗ có thể sai.
  socket = io(apiOrigin, {
    /* ⛔⛔ ĐỪNG ĐỔI HAI DÒNG DƯỚI MÀ KHÔNG ĐỌC HẾT KHỐI NÀY ⛔⛔
     *
     * Token đi trong `auth`, KHÔNG phải `extraHeaders`. Và KHÔNG ép
     * `transports: ['websocket']`.
     *
     * Bản trước làm ngược cả hai, và hậu quả là socket của app **chưa bao giờ
     * nối được một lần nào** kể từ khi cắm messenger vào (16/09/2026):
     * `extraHeaders` chỉ đi được bằng polling, vì websocket trong Chromium
     * dựng bằng `new WebSocket(uri)` mà WebSocket API không cho đặt header —
     * engine.io lặng lẽ vứt opts (`transports/websocket.js`: chỉ React Native
     * nhận). Ép websocket-only ⇒ token bay mất ⇒ máy chủ từ chối bắt tay ⇒
     * `reconnection` quay vô tận ⇒ huy hiệu "Ngoại tuyến" nằm lì, không tin
     * nhắn thời gian thực, không "đang nhập", và gọi thoại/video chết câm.
     * App KHÔNG giữ cookie nào nên không có đường lùi nào cứu được.
     *
     * Đo thật 17/09/2026 (máy chủ socket.io con, nối từ Chromium):
     *     transports:['websocket'] → handshake KHÔNG có `authorization`
     *     mặc định (polling→ws)    → handshake CÓ `authorization`
     *
     * `auth` đi trong THÂN gói mở màn nên qua được MỌI transport, và không
     * lọt vào URL như `?token=` (URL nằm trong access log của nginx).
     * Máy chủ đọc nó ở `tokenBatTay()` trong `src/socket/messaging.socket.ts`.
     * Phép kiểm chặn tái diễn: `realtime/socket.test.ts`.
     */
    path: '/socket.io',
    auth: { token },
    // Để mặc định polling→nâng cấp websocket. Chặng hỏi-đáp tốn thêm một
    // vòng bắt tay, nhưng nó là đường lùi cho người ngồi sau proxy nuốt
    // header Upgrade — và máy chủ cũng mở cả hai (`messaging.socket.ts`).
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 30000,
  });

  socket.on('connect_error', (e) => {
    console.warn('[socket] không nối được:', e.message);
  });

  return socket;
}

export function laySocket(): Socket | null {
  return socket;
}

/** Nối lại bằng token MỚI. Gọi sau khi `ApiClient` làm mới token — socket
 *  đang giữ token cũ trong header bắt tay, và lần nối lại kế tiếp sẽ dùng nó
 *  rồi bị từ chối im lặng. */
export function noiLaiVoiTokenMoi(apiOrigin: string): void {
  if (!apiRef) return;
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
  noiSocket(apiRef, apiOrigin);
}

export function ngatSocket(): void {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
  apiRef = null;
}
