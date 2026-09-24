/**
 * App iOS KHÔNG được dẫn người dùng đi mua ở ngoài (App Store 3.1.1 / 3.1.3(b)).
 *
 * Bản 1.0 của app lên App Store không bán Pro qua In-App Purchase (quyết định
 * 24/09/2026): Pro mua trên web, app chỉ đọc `isPro`. Apple cho phép dùng thứ
 * đã mua ở nơi khác, nhưng cấm mọi "call to action" dẫn tới kênh mua ngoài.
 * Mà nhiều câu chặn Pro của backend kèm lời mời ("Nâng cấp tại /pro …") —
 * app hiện nguyên văn ⇒ người duyệt đọc thấy là đủ lý do trả về.
 *
 * App gửi header `X-Client-Platform: ios` ở mọi yêu cầu (`APIClient.swift`).
 * Web và app desktop không gửi ⇒ hành vi của chúng KHÔNG đổi.
 */
import type { Request, Response, NextFunction } from 'express';

export function laAppIos(req: Request): boolean {
  if (String(req.headers['x-client-platform'] || '').toLowerCase() === 'ios') return true;
  // Lưới đỡ cho những chỗ trong app tự dựng `URLRequest` mà chưa gắn header:
  // URLSession mặc định gửi User-Agent `CuongThaiApp/<build> CFNetwork/… Darwin/…`.
  return /^CuongThaiApp\/\S+ CFNetwork\//.test(String(req.headers['user-agent'] || ''));
}

/**
 * Bỏ phần mời mua khỏi một câu thông báo, giữ phần nói tính năng thuộc Pro.
 * Chỉ cắt đúng những mẫu backend đang dùng — không đoán rộng, để không cắt
 * nhầm nội dung thường.
 */
export function boLoiMoiMua(cau: string): string {
  return cau
    // "… Pro. Nâng cấp tại /pro để dùng X."  |  "… Pro. Nâng cấp để X."
    .replace(/\s*Nâng cấp(?: tại \/pro)?(?: để [^.—]*)?\.\s*/g, ' ')
    // "… Pro. Nâng cấp tại /pro — phần còn lại"
    .replace(/\s*Nâng cấp tại \/pro\s*—\s*/g, ' — ')
    // "Gói Pro … đã hết hạn ngày X. Vui lòng gia hạn hoặc nhắn tin cho admin …"
    .replace(/\s*Vui lòng gia hạn[^.]*\./g, '')
    // Ghi danh khoá trả phí (course.routes.ts, 402): "… Vui long mua hoac nhap ma kich hoat."
    .replace(/\s*Vui long mua hoac nhap ma kich hoat\./g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const KHOA_THONG_BAO = new Set(['message', 'error', 'reason']);

function lamSach(v: unknown, sau: number): unknown {
  if (sau > 3 || v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map((x) => lamSach(x, sau + 1));
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    const x = o[k];
    if (KHOA_THONG_BAO.has(k) && typeof x === 'string') o[k] = boLoiMoiMua(x);
    else if (x && typeof x === 'object') o[k] = lamSach(x, sau + 1);
  }
  return o;
}

/**
 * Middleware: với yêu cầu từ app iOS, lọc các trường `message` / `error` /
 * `reason` (tới 3 tầng) của mọi JSON trả về. Không đụng nội dung khác.
 */
export function locLoiMoiMuaChoIos(req: Request, res: Response, next: NextFunction): void {
  if (!laAppIos(req)) return next();
  const json = res.json.bind(res);
  res.json = ((body: unknown) => json(lamSach(body, 0))) as Response['json'];
  next();
}
