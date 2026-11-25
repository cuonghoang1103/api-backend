// logger.mjs — logger DUY NHẤT của dự án (chính sách: mọi module import từ đây, không dùng console.log cho log nghiệp vụ)
import pino from 'pino';
export const CHE = ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.matKhau', '*.token', '*.otp', '*.cccd', '*.soThe'];
export const taoLogger = (dich) => pino({ level: process.env.LOG_LEVEL || 'info', redact: { paths: CHE, censor: '[ĐÃ CHE]' }, base: { service: 'shop-api' } }, dich);
export default taoLogger();
