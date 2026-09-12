/**
 * Giới hạn tốc độ cho các lối TẠO ĐƠN / TIÊU TIỀN.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao cần riêng, không dựa vào `generalLimiter` trong index.ts:
 *
 *  - `generalLimiter` là 2000 request/15 phút THEO IP. Với việc đọc trang
 *    thì rộng rãi như vậy là đúng; với việc tạo đơn thì nó gần như vô hiệu —
 *    một script vẫn đẻ được ~2000 đơn rác trước khi bị chặn.
 *  - Đúng phạm vi của việc trả tiền là THEO NGƯỜI, không theo IP. Cả một
 *    quán net sau NAT dùng chung một IP; ngược lại, một người đổi mạng là
 *    đổi IP. Khoá theo `userId` cho cả hai trường hợp đúng.
 *
 * Bộ đếm nằm ở Redis (sống sót qua deploy, dùng chung giữa nhiều tiến
 * trình) và FAIL-OPEN: Redis chết thì cho request đi qua chứ không 500 cả
 * API — sự cố ở bộ đếm không bao giờ được phép làm sập việc bán hàng.
 */
import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { Request, RequestHandler } from 'express';
import { getRedis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

const sendCommand = async (...args: string[]): Promise<unknown> => {
  const client = await getRedis();
  return client.sendCommand(args);
};

/**
 * Khoá theo userId khi đã đăng nhập, ngược lại theo IP đuôi phải của
 * X-Forwarded-For (mục bên trái do client gửi nên giả mạo được — xem chú
 * thích `clientIpKey` trong index.ts).
 */
function khoaTheoNguoi(req: Request): string {
  const userId = (req as unknown as { userId?: number }).userId;
  if (userId) return `u:${userId}`;
  const xff = (req.headers['x-forwarded-for'] as string | undefined)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return `ip:${xff?.[xff.length - 1] || req.ip || 'unknown'}`;
}

/** Nuốt lỗi của store thay vì để nó 500 cả request. */
function failOpen(limiter: RateLimitRequestHandler): RequestHandler {
  return (req, res, next) =>
    limiter(req, res, (err?: unknown) => {
      if (err) {
        logger.warn('[rate-limit] store lỗi — cho qua', {
          error: err instanceof Error ? err.message : String(err),
        });
        return next();
      }
      next();
    });
}

interface Opts {
  prefix: string;
  windowMs: number;
  max: number;
  message: string;
}

function taoLimiter({ prefix, windowMs, max, message }: Opts): RequestHandler {
  return failOpen(
    rateLimit({
      windowMs,
      max,
      store: new RedisStore({ sendCommand: sendCommand as never, prefix }),
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: khoaTheoNguoi,
      message: { success: false, message, code: 'ORDER_RATE_LIMIT_EXCEEDED' },
    }),
  );
}

/**
 * Tạo đơn hàng shop. 10 đơn/phút là rộng rãi cho người thật (kể cả khi họ
 * bấm lại vì mạng chậm) nhưng chặn đứng script bơm đơn.
 *
 * ⚠️ Đây KHÔNG phải chốt chặn double-click — bấm hai lần trong một giây
 * vẫn lọt qua bộ đếm. Chốt đó là `idempotencyKey` + UNIQUE ở DB. Hai thứ
 * giải quyết hai vấn đề khác nhau và đều cần.
 */
export const shopOrderLimiter = taoLimiter({
  prefix: 'rl:shoporder:',
  windowMs: 60_000,
  max: parseInt(process.env.SHOP_ORDER_LIMIT_PER_MIN || '10', 10),
  message: 'Bạn đang tạo quá nhiều đơn hàng. Vui lòng chờ một lát rồi thử lại.',
});

/** Nạp ví — chặt hơn shop vì mỗi lượt đều sinh một link thanh toán thật. */
export const topupLimiter = taoLimiter({
  prefix: 'rl:topup:',
  windowMs: 60_000,
  max: parseInt(process.env.TOPUP_LIMIT_PER_MIN || '5', 10),
  message: 'Bạn đang tạo quá nhiều lượt nạp. Vui lòng chờ một lát rồi thử lại.',
});

/** Mua gói Pro. */
export const proOrderLimiter = taoLimiter({
  prefix: 'rl:proorder:',
  windowMs: 60_000,
  max: parseInt(process.env.PRO_ORDER_LIMIT_PER_MIN || '5', 10),
  message: 'Bạn đang thao tác quá nhanh. Vui lòng chờ một lát rồi thử lại.',
});

/**
 * Yêu cầu đổi key hỏng — theo GIỜ, không theo phút. Đây là việc người thật
 * làm vài lần một đời, spam nó là cách moi thêm key miễn phí.
 */
export const keyReplacementLimiter = taoLimiter({
  prefix: 'rl:keyrepl:',
  windowMs: 60 * 60_000,
  max: parseInt(process.env.KEY_REPLACEMENT_LIMIT_PER_HOUR || '5', 10),
  message: 'Bạn đã gửi quá nhiều yêu cầu đổi key. Vui lòng chờ và liên hệ hỗ trợ nếu cần gấp.',
});
