// appVersion.js — bài 4.4: app di động KHÔNG cập nhật ngay. Mỗi request khai "LabFlow-Client: android/1.4.0".
import { HttpError } from './http.js';

// Cấu hình đọc ở MỖI lần mở app — đổi ở server là có hiệu lực, không cần phát hành app mới
export const APP_CONFIG = {
  minVersion: { android: '1.3.0', ios: '1.3.0' },        // thấp hơn ⇒ buộc cập nhật
  latestVersion: { android: '1.5.0', ios: '1.5.0' },     // thấp hơn ⇒ chỉ gợi ý cập nhật
  updateUrl: {
    android: 'https://play.google.com/store/apps/details?id=example.labflow',
    ios: 'https://apps.apple.com/app/id6740000000',
  },
  features: { checkIn: true },                           // bật/tắt tính năng mà không cần bản app mới
};

// "android/1.4.0" ⇒ { platform: 'android', version: [1, 4, 0] }; sai dạng ⇒ null
export function parseClient(h) {
  const m = /^(android|ios|web)\/(\d+)\.(\d+)\.(\d+)$/.exec(h ?? '');
  return m ? { platform: m[1], version: [Number(m[2]), Number(m[3]), Number(m[4])] } : null;
}
export const compareVersions = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

// Chặn CHỈ những bản đã biết là hỏng (dưới minVersion). Không khai / web ⇒ cho qua.
export function appVersionGuard(req, res, next) {
  const c = parseClient(req.get('LabFlow-Client'));
  if (!c || c.platform === 'web') return next();
  const min = APP_CONFIG.minVersion[c.platform];
  if (compareVersions(c.version, min.split('.').map(Number)) < 0) {
    throw new HttpError(400, 'APP_VERSION_UNSUPPORTED',
      { version: c.version.join('.'), min },
      { minVersion: min, updateUrl: APP_CONFIG.updateUrl[c.platform] });
  }
  next();
}
