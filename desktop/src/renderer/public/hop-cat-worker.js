/*
 * Worker HỘP CÁT cho mã người dùng viết (Thuật toán — 04/10/2026).
 *
 * Tệp này được phục vụ với CSP RIÊNG (src/main/security.ts): cho `eval`/`new
 * Function` nhưng `connect-src 'none'` — mã lạ chạy được, KHÔNG gọi mạng được,
 * và (là worker) không chạm được DOM, `window.cuongthai` hay bộ nhớ của app.
 * Trang chính vẫn giữ CSP chặt không 'unsafe-eval'.
 *
 * Tin nhắn ĐẦU TIÊN mang mã worker thật (`__napMa`); mã đó tự gắn `onmessage` mới
 * và xử lý mọi tin sau, y như khi nó chạy từ blob trên web.
 */
self.onmessage = function (e) {
  if (e && e.data && typeof e.data.__napMa === 'string') {
    (0, eval)(e.data.__napMa);
  }
};
