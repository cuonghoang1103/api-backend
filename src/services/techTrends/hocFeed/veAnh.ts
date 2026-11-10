/**
 * Vẽ ảnh bài học: chọn mẫu theo `AnhSpec`, rasterise bằng sharp, tải lên R2.
 * Ảnh THẬT (Wikimedia Commons…) được tải về MỘT lần lúc đăng, thu về khung
 * 1080 rộng rồi phủ dải chú thích + dòng giấy phép — không hotlink.
 */
import sharp from 'sharp';
import { logger } from '../../../utils/logger.js';
import {
  lopPhuAnh, mauCode, mauConSo, mauEli5, mauLoi, mauQuiz, mauSach, mauSlide, mauSoDo, mauTrichDan, mauTruocSau,
  type CodeCardInput, type ConSoInput, type Eli5Input, type KichThuoc, type LoiCardInput, type MauAnh, type QuizInput,
  type SachInput, type SlideInput, type SoDoInput, type TrichDanInput, type TruocSauInput,
} from './mauAnh.js';

export type AnhSpec =
  | ({ mau: 'code' } & CodeCardInput)
  | ({ mau: 'loi' } & LoiCardInput)
  | ({ mau: 'truocSau' } & TruocSauInput)
  | ({ mau: 'quiz' } & QuizInput)
  | ({ mau: 'eli5' } & Eli5Input)
  | ({ mau: 'soDo' } & SoDoInput)
  | ({ mau: 'conSo' } & ConSoInput)
  | ({ mau: 'trichDan' } & TrichDanInput)
  | ({ mau: 'sach' } & SachInput)
  | { mau: 'slide'; slides: Array<Omit<SlideInput, 'so' | 'tong'>>; mauNen?: string }
  | { mau: 'anh'; url: string; chuThich: string; giayPhep: string; trang: string };

export interface AnhDaVe { png: Buffer; w: number; h: number; alt: string }

/** Dựng SVG cho một spec (không chạm mạng). Slide trả nhiều tấm. */
export function dungSvg(spec: AnhSpec): Array<{ svg: string; size: KichThuoc; alt: string }> {
  switch (spec.mau) {
    case 'code': return [{ ...mauCode(spec), alt: spec.tieuDe }];
    case 'loi': return [{ ...mauLoi(spec), alt: `${spec.tieuDe} — ${spec.loi}` }];
    case 'truocSau': return [{ ...mauTruocSau(spec), alt: spec.tieuDe }];
    case 'quiz': return [{ ...mauQuiz(spec), alt: spec.cauHoi }];
    case 'eli5': return [{ ...mauEli5(spec), alt: `${spec.khaiNiem}: ${spec.viDu}` }];
    case 'soDo': return [{ ...mauSoDo(spec), alt: `${spec.tieuDe}: ${spec.nut.map((n) => n.ten).join(' → ')}` }];
    case 'conSo': return [{ ...mauConSo(spec), alt: `${spec.so} ${spec.donVi ?? ''} — ${spec.yNghia}` }];
    case 'trichDan': return [{ ...mauTrichDan(spec), alt: `“${spec.cau}” — ${spec.tacGia}` }];
    case 'sach': return [{ ...mauSach(spec), alt: `${spec.ten} — ${spec.tacGia}` }];
    case 'slide': {
      const tong = spec.slides.length;
      return spec.slides.map((s, k) => ({ ...mauSlide({ ...s, so: k + 1, tong, mau: s.mau ?? spec.mauNen }), alt: `${k + 1}/${tong} ${s.tieuDe}` }));
    }
    case 'anh': return [];
  }
}

const UA = 'cuongthai-feed-bot/1.0 (+https://cuongthai.com)';

async function veAnhThat(spec: Extract<AnhSpec, { mau: 'anh' }>): Promise<AnhDaVe | null> {
  const res = await fetch(spec.url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`tải ảnh ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const W = 1080;
  const base = sharp(buf).rotate().resize({ width: W, height: 1350, fit: 'inside', withoutEnlargement: false }).flatten({ background: '#111' });
  const meta = await base.clone().png().toBuffer({ resolveWithObject: true });
  const w = meta.info.width, h = meta.info.height;
  const overlay = Buffer.from(lopPhuAnh({ chuThich: spec.chuThich, giayPhep: spec.giayPhep, w, h }));
  const png = await sharp(meta.data).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 86 }).toBuffer();
  return { png, w, h, alt: spec.chuThich };
}

/** Vẽ mọi ảnh của một spec ra bộ đệm (chưa tải lên). */
export async function veAnh(spec: AnhSpec): Promise<AnhDaVe[]> {
  if (spec.mau === 'anh') {
    const a = await veAnhThat(spec);
    return a ? [a] : [];
  }
  const out: AnhDaVe[] = [];
  for (const s of dungSvg(spec)) {
    const png = await sharp(Buffer.from(s.svg)).png({ compressionLevel: 9 }).toBuffer();
    out.push({ png, w: s.size.w, h: s.size.h, alt: s.alt });
  }
  return out;
}

/** Vẽ + tải lên R2 (đi qua storage sandbox khi chạy local/test). Lỗi ⇒ [] (bài vẫn đăng). */
export async function veVaTaiLen(spec: AnhSpec, userId: number): Promise<Array<{ url: string; w: number; h: number; alt: string }>> {
  try {
    const { uploadImage } = await import('../../../storage/uploadService.js');
    const anh = await veAnh(spec);
    const out: Array<{ url: string; w: number; h: number; alt: string }> = [];
    for (const [k, a] of anh.entries()) {
      const jpg = spec.mau === 'anh';
      const r = await uploadImage(
        { buffer: a.png, size: a.png.length, mimetype: jpg ? 'image/jpeg' : 'image/png', originalName: `hoc-${spec.mau}-${k + 1}.${jpg ? 'jpg' : 'png'}` },
        'images/cover',
        { userId, subPrefix: 'hoc' },
      );
      out.push({ url: r.url, w: a.w, h: a.h, alt: a.alt.slice(0, 480) });
    }
    return out;
  } catch (err) {
    logger.warn('[hoc-feed] vẽ/tải ảnh lỗi (bài vẫn đăng không ảnh)', { mau: spec.mau, error: (err as Error).message });
    return [];
  }
}

export const MAU_CUA_SPEC = (s: AnhSpec): MauAnh => s.mau;
