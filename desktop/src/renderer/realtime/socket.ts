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
    path: '/socket.io',
    // Header thay vì cookie: app không giữ cookie, và máy chủ đọc header
    // TRƯỚC cookie nên đường này chắc.
    extraHeaders: { Authorization: `Bearer ${token}` },
    // Bỏ chặng hỏi-đáp, đi thẳng websocket: chặng đó gửi token trong MỌI lượt
    // hỏi và tốn thêm một vòng bắt tay.
    transports: ['websocket'],
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
