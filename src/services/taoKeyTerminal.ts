/**
 * Tạo key con ở New API cho luồng "admin bấm Duyệt".
 * ─────────────────────────────────────────────────────────────────────────
 * Trước 14/09/2026, duyệt một đơn xin key là NĂM bước tay: mở SSH tunnel →
 * vào giao diện New API → tạo token → đặt hạn mức → chép key → dán vào form.
 * Quên bước đặt hạn mức thì key chạy bằng mặc định mà không ai thấy.
 *
 * ⚠️ Vì sao đi qua `canh` chứ không gọi thẳng New API:
 *
 *  1. Tài khoản quản trị New API chỉ nên nằm ở MỘT nơi. Chép `NEWAPI_PASS`
 *     sang backend là nhân đôi chỗ có thể lộ, và nhân đôi chỗ phải xoay khoá.
 *  2. New API chặn `POST /api/user/login` rất chặt (20 lượt/20 phút mặc định
 *     — đã nâng lên 60, xem docker-compose của cong-llm). `canh` đã giữ sẵn
 *     một phiên đăng nhập và biết cách xếp hàng; backend tự đăng nhập là hai
 *     bên tranh cùng một ngạch, và cả hai cùng bị khoá.
 *  3. `canh` là nơi duy nhất biết "hạn mức nạp lại mỗi cửa sổ" nằm ở đâu.
 *     Tạo key mà không ghi hạn mức vào đó thì 5 giờ sau key tụt về mặc định.
 *
 * Thiếu cấu hình ⇒ trả `null`, KHÔNG ném. Nơi gọi lùi về đường dán tay, để
 * một cụm cong-llm đang bảo trì không chặn luôn việc duyệt đơn.
 */
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

const CANH_URL = (process.env.CANH_URL || 'http://cuonghoangdev_canh_llm:8080').replace(/\/+$/, '');

export interface KeyVuaTao {
  key: string;
  ten: string;
  quotaUsd: number;
}

export function coTheTuTaoKey(): boolean {
  return Boolean(process.env.CANH_KHOA_NOI_BO?.trim());
}

/**
 * KHOÁ một key ở New API theo giá trị key.
 *
 * Dùng khi người dùng báo key bị lộ, và khi admin hoàn tiền một đơn. Khoá chứ
 * không xoá — xoá thì mất số liệu đã tiêu và mất dấu vết đối chiếu khi có
 * tranh chấp.
 *
 * Thiếu cấu hình ⇒ `false`, KHÔNG ném: nơi gọi vẫn phải làm xong phần của
 * mình (đánh dấu thu hồi trong CSDL) rồi báo admin đi khoá tay. Ném ở đây là
 * bỏ dở giữa chừng — key vừa còn sống vừa không ai biết.
 */
export async function khoaKeyQuaCanh(key: string): Promise<boolean> {
  const khoa = process.env.CANH_KHOA_NOI_BO?.trim();
  if (!khoa) {
    logger.warn('[llm-key] chưa cắm CANH_KHOA_NOI_BO — KHÔNG khoá được key ở New API, phải khoá tay');
    return false;
  }
  try {
    const r = await fetch(`${CANH_URL}/khoa-key`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-khoa-noi-bo': khoa },
      body: JSON.stringify({ key }),
      signal: AbortSignal.timeout(30_000),
    });
    const d = (await r.json().catch(() => null)) as { ten?: string; loi?: string } | null;
    if (!r.ok) {
      logger.error('[llm-key] KHOÁ KEY HỎNG — key vẫn đang sống, phải khoá tay', {
        http: r.status, loi: d?.loi ?? null,
      });
      return false;
    }
    logger.info('[llm-key] đã khoá key ở New API', { ten: d?.ten });
    return true;
  } catch (err) {
    logger.error('[llm-key] KHÔNG gọi được cụm để khoá key — key vẫn đang sống, phải khoá tay', {
      error: (err as Error).message,
    });
    return false;
  }
}

/**
 * @param ten      tên key con trong New API — phải là duy nhất
 * @param quotaUsd hạn mức USD quy đổi cho mỗi cửa sổ 5 giờ
 * @throws lỗi có CHỮ đọc được khi canh từ chối (tên trùng, hạn mức sai…),
 *         để admin biết sửa gì. Chỉ trả `null` khi chưa cắm cấu hình.
 */
export async function taoKeyConQuaCanh(ten: string, quotaUsd: number): Promise<KeyVuaTao | null> {
  const khoa = process.env.CANH_KHOA_NOI_BO?.trim();
  if (!khoa) return null;

  let r: Response;
  try {
    r = await fetch(`${CANH_URL}/tao-key`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-khoa-noi-bo': khoa },
      body: JSON.stringify({ ten, quotaUsd }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    // Không với tới canh là chuyện hạ tầng, không phải lỗi của admin — nói
    // thẳng để họ biết chuyển sang dán tay thay vì bấm lại mười lần.
    // AppError 502 chứ không phải Error trần: Error trần rơi vào nhánh 500
    // của errorHandler và admin chỉ thấy "Internal Server Error" — không biết
    // hỏng ở đâu, không biết nên làm gì. Đã dính thật 14/09/2026.
    throw new AppError(`Không gọi được cụm cấp key: ${(err as Error).message}. Tạm thời dán key thủ công.`, 502);
  }

  const d = (await r.json().catch(() => null)) as { key?: string; ten?: string; quotaUsd?: number; loi?: string } | null;
  if (!r.ok || !d?.key) {
    // Chuyển nguyên văn lý do của canh lên cho admin. Nó là câu tiếng Việt
    // đọc được ("key tên ... đã tồn tại", "đăng nhập New API hỏng: ...
    // (AUTH_SESSION_LIMIT)"), và đó là thứ duy nhất giúp admin biết phải làm gì.
    throw new AppError(d?.loi || `Cụm cấp key trả lỗi HTTP ${r.status}`, 502);
  }
  // ⚠️ KHÔNG log `d.key`. Log đi qua nhiều chỗ và sống lâu hơn ta tưởng.
  logger.info('[llm-key] đã tạo key con tự động', { ten: d.ten, quotaUsd: d.quotaUsd });
  return { key: d.key, ten: d.ten ?? ten, quotaUsd: Number(d.quotaUsd ?? quotaUsd) };
}
