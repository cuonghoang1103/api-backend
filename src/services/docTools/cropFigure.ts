/**
 * Cắt HÌNH VẼ ra khỏi chính ảnh gốc.
 * ─────────────────────────────────────────────────────────────────────────
 * Đây là đường DUY NHẤT cho ra hình "giống 100%". Vẽ lại thì dù đẹp vẫn là
 * hình MỚI: đo 13/08/2026 trên một tờ Toán 7, model đọc `124°` thành `120°`
 * và `141°` thành `140°` rồi vẽ lại theo số sai — nhìn rất gọn gàng và sai
 * hoàn toàn. Cắt ảnh thì pixel là của tờ đề, không có chỗ cho việc đọc nhầm.
 *
 * Model chỉ làm MỘT việc: chỉ ra khung (toạ độ chuẩn hoá 0..1). Đo thật trên
 * ảnh hình chóp S.ABCD: khung trả về bao trọn hình + mọi nhãn (S, A, B, C, D,
 * H, M, a, 2a). Vẫn phải chừa lề vì nó hay cắt sát mép.
 */
import sharp from 'sharp';
import { logger } from '../../utils/logger.js';
import { visionComplete, type VisionImage } from './vision.js';

export interface KhungHinh {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface AnhCat {
  pngBase64: string;
  rong: number;
  cao: number;
}

const SYSTEM = `Bạn định vị HÌNH VẼ trong ảnh trang tài liệu.

Trả về DUY NHẤT một JSON, không kèm lời nào khác:
{"hinh":[{"top":0.0,"left":0.0,"width":0.0,"height":0.0}]}

- Toạ độ CHUẨN HOÁ theo tỉ lệ 0..1 so với kích thước ảnh (0,0 = góc trên bên trái).
- Khung phải bao TRỌN hình vẽ cùng mọi nhãn điểm và số đo của nó.
- KHÔNG bao gồm phần chữ của đề bài.
- Liệt kê theo thứ tự từ TRÊN xuống DƯỚI.
- Không có hình vẽ nào thì trả {"hinh":[]}.`;

/** Chừa thêm quanh khung — model hay cắt sát, mất nhãn ở mép. */
const LE = 0.015;

/** Hỏi model khung của từng hình. Hỏng thì trả mảng rỗng, KHÔNG ném. */
export async function timKhungHinh(anh: VisionImage, userId?: number | null): Promise<KhungHinh[]> {
  try {
    const kq = await visionComplete({
      system: SYSTEM,
      userText: 'Chỉ ra khung của từng hình vẽ trong ảnh.',
      images: [anh],
      maxTokens: 1200,
      userId,
      maxRetries: 1,
    });
    const khop = kq.text.match(/\{[\s\S]*\}/);
    if (!khop) return [];
    const doc = JSON.parse(khop[0]) as { hinh?: unknown };
    if (!Array.isArray(doc.hinh)) return [];
    return doc.hinh
      .map((h) => h as Record<string, unknown>)
      .map((h) => ({
        top: Number(h.top),
        left: Number(h.left),
        width: Number(h.width),
        height: Number(h.height),
      }))
      // Khung vô lý (âm, quá 1, bé tí) thì bỏ — thà không có hình còn hơn dán
      // vào file một mẩu ảnh cắt trúng giữa dòng chữ.
      .filter(
        (k) =>
          [k.top, k.left, k.width, k.height].every(Number.isFinite) &&
          k.width > 0.05 && k.height > 0.03 &&
          k.left >= 0 && k.top >= 0 &&
          k.left + k.width <= 1.05 && k.top + k.height <= 1.05,
      );
  } catch (e) {
    logger.warn('docTools: không định vị được hình để cắt', { error: (e as Error).message });
    return [];
  }
}

/** Cắt các khung ra khỏi ảnh (ảnh ĐÃ chuẩn hoá — cùng hệ toạ độ với lúc hỏi). */
export async function catCacHinh(anh: VisionImage, khungs: KhungHinh[]): Promise<AnhCat[]> {
  if (!khungs.length) return [];
  const goc = Buffer.from(anh.data, 'base64');
  const meta = await sharp(goc).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) return [];

  const ra: AnhCat[] = [];
  for (const k of khungs) {
    try {
      const left = Math.max(0, Math.round((k.left - LE) * W));
      const top = Math.max(0, Math.round((k.top - LE) * H));
      const width = Math.min(W - left, Math.round((k.width + LE * 2) * W));
      const height = Math.min(H - top, Math.round((k.height + LE * 2) * H));
      if (width < 20 || height < 20) continue;
      const png = await sharp(goc).extract({ left, top, width, height }).png().toBuffer();
      ra.push({ pngBase64: png.toString('base64'), rong: width, cao: height });
    } catch (e) {
      logger.warn('docTools: cắt hình thất bại', { error: (e as Error).message });
    }
  }
  return ra;
}
