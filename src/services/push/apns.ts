/**
 * Gửi thông báo đẩy tới iOS qua APNs, nói thẳng HTTP/2 với Apple.
 *
 * Cố ý KHÔNG dùng thư viện (`node-apn` & co.): Node 22 đã có sẵn `http2`, và
 * `jsonwebtoken` thì kho này vốn dùng cho auth. Thêm một gói nữa nghĩa là thêm
 * một thứ có thể vỡ trong lúc `npm ci` của Docker build — thứ đã làm hỏng
 * deploy ở đây trước đây.
 *
 * Cần ba biến môi trường (đặt ở `/opt/cuonghoangdev/.env` trên VPS):
 *   APNS_KEY_ID    — 10 ký tự, hiện trên trang tạo khoá
 *   APNS_TEAM_ID   — mã đội, `UR32PFUQ38`
 *   APNS_KEY_PATH  — đường dẫn tới file .p8  (hoặc APNS_KEY_P8 = nội dung file)
 * Thiếu bất kỳ cái nào thì `guiThongBao()` trả về ngay và ghi một dòng WARN —
 * KHÔNG ném. Thông báo đẩy là thứ phụ; nó không được làm hỏng việc gửi tin
 * nhắn, vốn là việc chính.
 */
import http2 from 'node:http2';
import fs from 'node:fs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const BUNDLE_ID = process.env.APNS_BUNDLE_ID ?? 'com.cuongthai.app';
const MAY_CHU_THAT = 'https://api.push.apple.com';
const MAY_CHU_THU = 'https://api.sandbox.push.apple.com';

/** Apple chấp nhận token JWT tối đa 1 giờ, và CHẶN nếu xin mới quá thường
 *  xuyên (`TooManyProviderTokenUpdates`). Giữ lại và dùng chung 50 phút. */
let tokenCache: { giaTri: string; hetHan: number } | null = null;

function khoaRieng(): string | null {
  if (process.env.APNS_KEY_P8) return process.env.APNS_KEY_P8.replace(/\\n/g, '\n');
  const duong = process.env.APNS_KEY_PATH;
  if (!duong) return null;
  try {
    return fs.readFileSync(duong, 'utf8');
  } catch (e) {
    logger.warn(`[apns] không đọc được khoá tại ${duong}: ${(e as Error).message}`);
    return null;
  }
}

function tokenNhaCungCap(): string | null {
  const now = Date.now();
  if (tokenCache && tokenCache.hetHan > now) return tokenCache.giaTri;

  const key = khoaRieng();
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  if (!key || !keyId || !teamId) return null;

  const t = jwt.sign({ iss: teamId, iat: Math.floor(now / 1000) }, key, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: keyId },
  });
  tokenCache = { giaTri: t, hetHan: now + 50 * 60 * 1000 };
  return t;
}

export function apnsSanSang(): boolean {
  return Boolean(khoaRieng() && process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID);
}

export interface NoiDungDay {
  tieuDe: string;
  than: string;
  /** Huy hiệu trên biểu tượng app. Bỏ trống thì Apple giữ nguyên số cũ. */
  huyHieu?: number;
  /** Đi kèm để app biết mở màn nào khi người dùng chạm vào. */
  duLieu?: Record<string, unknown>;
  /** Gộp các thông báo cùng một hội thoại lại. */
  nhom?: string;
}

/** Gửi tới MỘT thẻ. Trả `true` nếu Apple nhận; `false` kèm dọn thẻ chết. */
async function guiMotThe(the: string, sandbox: boolean, noi: NoiDungDay): Promise<boolean> {
  const provider = tokenNhaCungCap();
  if (!provider) return false;

  const client = http2.connect(sandbox ? MAY_CHU_THU : MAY_CHU_THAT);
  try {
    return await new Promise<boolean>((resolve) => {
      const than = JSON.stringify({
        aps: {
          alert: { title: noi.tieuDe, body: noi.than },
          sound: 'default',
          ...(noi.huyHieu !== undefined ? { badge: noi.huyHieu } : {}),
          ...(noi.nhom ? { 'thread-id': noi.nhom } : {}),
        },
        ...(noi.duLieu ?? {}),
      });

      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${the}`,
        'authorization': `bearer ${provider}`,
        'apns-topic': BUNDLE_ID,
        'apns-push-type': 'alert',
        // 10 = gửi ngay. 5 = gom lại tiết kiệm pin; tin nhắn thì phải ngay.
        'apns-priority': '10',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(than),
      });

      let ma = 0;
      let traVe = '';
      req.on('response', (h) => { ma = Number(h[':status'] ?? 0); });
      req.on('data', (c) => { traVe += c; });
      req.on('end', () => {
        if (ma === 200) return resolve(true);
        // 410 = thiết bị đã gỡ app. 400 + BadDeviceToken = thẻ sai môi trường
        // hoặc rác. Cả hai đều nên xoá, không thì mỗi lượt gửi lại tốn một
        // vòng mạng cho một cái thẻ vĩnh viễn không dùng được.
        const lyDo = (() => { try { return JSON.parse(traVe).reason; } catch { return traVe; } })();
        if (ma === 410 || lyDo === 'BadDeviceToken' || lyDo === 'Unregistered') {
          void prisma.deviceToken.deleteMany({ where: { token: the } })
            .catch(() => undefined);
          logger.info(`[apns] xoá thẻ chết (${ma} ${lyDo})`);
        } else {
          logger.warn(`[apns] gửi hỏng ${ma}: ${lyDo}`);
        }
        resolve(false);
      });
      req.on('error', (e) => {
        logger.warn(`[apns] lỗi mạng: ${e.message}`);
        resolve(false);
      });
      req.end(than);
    });
  } finally {
    client.close();
  }
}

/**
 * Gửi cho MỘT NGƯỜI, trên mọi thiết bị họ đã đăng ký.
 *
 * Không bao giờ ném: mọi nơi gọi hàm này đều đang làm việc chính (gửi tin
 * nhắn, tạo thông báo) và không được hỏng vì Apple bận.
 */
export async function guiThongBao(userId: number, noi: NoiDungDay): Promise<number> {
  if (!apnsSanSang()) {
    logger.warn('[apns] chưa cấu hình khoá — bỏ qua lượt gửi');
    return 0;
  }
  try {
    const the = await prisma.deviceToken.findMany({
      where: { userId, platform: 'ios' },
      select: { token: true, sandbox: true },
    });
    if (the.length === 0) return 0;
    const kq = await Promise.all(the.map((t) => guiMotThe(t.token, t.sandbox, noi)));
    return kq.filter(Boolean).length;
  } catch (e) {
    logger.warn(`[apns] guiThongBao hỏng: ${(e as Error).message}`);
    return 0;
  }
}
