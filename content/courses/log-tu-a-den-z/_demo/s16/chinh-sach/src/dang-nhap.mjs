import log from '../logger.mjs';
export function dangNhap(req) {
  log.info({ userId: req.body.userId }, 'đăng nhập');
  console.log("DEBUG body", req.body);   // ← ai đó thêm "tạm" lúc gỡ lỗi rồi quên xoá
}
