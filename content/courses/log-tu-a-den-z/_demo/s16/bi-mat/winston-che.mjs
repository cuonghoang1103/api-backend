// winston-che.mjs — winston không có redact sẵn: viết một format che theo TÊN KHOÁ (đệ quy) chạy trước json().
import winston from 'winston';
const KHOA = new Set(['password', 'token', 'authorization', 'cookie', 'cardNumber']);
const che = winston.format((info) => {
  const di = (o) => { for (const k of Object.keys(o)) { if (KHOA.has(k)) o[k] = '[ĐÃ CHE]'; else if (o[k] && typeof o[k] === 'object') di(o[k]); } };
  di(info); return info;
});
const log = winston.createLogger({ format: winston.format.combine(che(), winston.format.json()), transports: [new winston.transports.Console()] });
log.info('thanh toán', { userId: 'u_42', card: { cardNumber: '4111111111111111', last4: '1111' }, headers: { authorization: 'Bearer GIA' } });
log.info(`đăng nhập thất bại cho password=MatKhau-GIA-123`);   // ✗ nhét bí mật vào CHUỖI thông điệp: che theo khoá không cứu được
