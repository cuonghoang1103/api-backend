/**
 * Chốt chặn cho MỘT lỗi đã xảy ra thật, và nó câm hoàn toàn: socket của app
 * **chưa từng nối được một lần nào** suốt từ 16/09/2026 tới 17/09/2026.
 *
 * Nguyên nhân: token gửi bằng `extraHeaders` trong khi ép
 * `transports: ['websocket']`. WebSocket API của trình duyệt không cho đặt
 * header, nên engine.io lặng lẽ vứt `extraHeaders` (`transports/websocket.js`
 * — chỉ React Native mới nhận `opts`). Máy chủ không nhận được token nào, từ
 * chối bắt tay, `reconnection` quay vô tận. Người dùng thấy huy hiệu "Ngoại
 * tuyến" nằm lì, không tin nhắn thời gian thực, không cuộc gọi — và không có
 * một lỗi nào nổi lên màn hình.
 *
 * Không phép kiểm nào cũ bắt được: `tsc` xanh, app dựng được, màn hình vẽ đủ.
 * Chỉ có nhìn vào THAM SỐ THẬT truyền cho `io()` mới thấy.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const luotGoi: Array<{ url: string; tuy: Record<string, unknown> }> = [];

vi.mock('socket.io-client', () => ({
  io: (url: string, tuy: Record<string, unknown>) => {
    luotGoi.push({ url, tuy });
    return {
      connected: false,
      on: () => {},
      removeAllListeners: () => {},
      disconnect: () => {},
    };
  },
}));

import { noiSocket, ngatSocket } from './socket';

const apiGia = { layToken: () => 'tok-abc' } as never;

beforeEach(() => {
  luotGoi.length = 0;
  ngatSocket();
});

describe('noiSocket', () => {
  it('gửi token trong `auth` — đường DUY NHẤT qua được mọi transport', () => {
    noiSocket(apiGia, 'https://cuongthai.com');
    const tuy = luotGoi[0]?.tuy as { auth?: { token?: string } };
    expect(tuy?.auth?.token, 'thiếu auth.token ⇒ máy chủ từ chối bắt tay').toBe('tok-abc');
  });

  it('KHÔNG ép transports websocket-only — nó làm rụng mọi header', () => {
    noiSocket(apiGia, 'https://cuongthai.com');
    const tuy = luotGoi[0]?.tuy as { transports?: string[] };
    // Không khai là đúng (mặc định polling→nâng cấp). Nếu có ai khai lại thì
    // bắt buộc phải kèm 'polling', nếu không token đi bằng header sẽ bay mất.
    if (tuy?.transports) {
      expect(
        tuy.transports,
        "ép ['websocket'] làm engine.io vứt extraHeaders — xem chú thích trong socket.ts",
      ).toContain('polling');
    } else {
      expect(tuy?.transports).toBeUndefined();
    }
  });

  it('không có token thì KHÔNG mở socket', () => {
    const khongToken = { layToken: () => null } as never;
    expect(noiSocket(khongToken, 'https://cuongthai.com')).toBeNull();
    expect(luotGoi.length).toBe(0);
  });
});
