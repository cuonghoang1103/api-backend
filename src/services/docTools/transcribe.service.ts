/**
 * Ảnh trang bài giảng/đề bài → văn bản + công thức (+ hình vẽ lại).
 * ─────────────────────────────────────────────────────────────────────────
 * Mỗi ảnh là MỘT lời gọi model riêng. Không gộp nhiều ảnh vào một lượt, vì:
 *  • một trang hỏng thì chỉ trang đó hỏng, không kéo cả tập đi theo;
 *  • giao diện chạy được thanh tiến độ từng trang — 10 ảnh mất vài phút, im
 *    lặng suốt vài phút là kiểu chờ tệ nhất;
 *  • mỗi lượt ngắn hơn nhiều so với trần 300 giây của nginx.
 *
 * ĐO ĐƯỢC 13/08/2026 (`gpt-5.6-sol`, ảnh chụp lệch + nén JPEG q55):
 *  • trang chữ + công thức: ~19 giây, ~1.000 token vào, chép đúng 7/7 bài;
 *  • trang có hình + vẽ lại hình: ~76 giây, ~4.900 token (phần lớn là suy
 *    nghĩ để dựng hình) — nên chế độ vẽ lại phải là TÙY CHỌN, không mặc định.
 */
import sharp from 'sharp';
import { buildSystemPrompt } from './prompt.js';
import { catCacHinh, timKhungHinh } from './cropFigure.js';
import { visionComplete, type VisionImage } from './vision.js';
import { logger } from '../../utils/logger.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export type CheDoHinh = 'bo-qua' | 'mo-ta' | 've-lai' | 'cat-anh';

export interface AnhVao extends VisionImage {
  ten?: string;
}

export interface TuyChonChep {
  presetIds?: string[];
  note?: string;
  cheDoHinh?: CheDoHinh;
  userId?: number | null;
}

export interface HinhVeLai {
  /** PNG đã dựng sẵn từ SVG của model. KHÔNG trả SVG thô ra trình duyệt. */
  pngBase64: string;
  rong: number;
  cao: number;
}

export interface TrangKetQua {
  chiSo: number;
  ten?: string;
  vanBan: string;
  hinhVeLai: HinhVeLai[];
  /** Số chỗ model tự đánh dấu là không đọc chắc — người dùng phải soi lại. */
  soChoNgo: number;
  loi?: string;
  model?: string;
  tokenVao?: number;
  tokenRa?: number;
  costUsd?: number;
}

export const TOI_DA_ANH = 10;
const TOI_DA_BYTE_MOI_ANH = 12 * 1024 * 1024;

const HUONG_DAN_HINH: Record<CheDoHinh, string> = {
  // Cắt ảnh gốc: chỉ cần ĐÁNH DẤU chỗ có hình, không mô tả gì — phần hình do
  // `cropFigure.ts` cắt thẳng từ ảnh rồi chèn đúng vào dấu này.
  'cat-anh':
    'Trang có thể có hình vẽ. Tại đúng vị trí mỗi hình, viết đúng một dòng "[HÌNH] (giữ hình gốc)" — KHÔNG mô tả hình, và tuyệt đối KHÔNG chép các chữ cái/số nằm rải rác trong hình thành dòng văn bản.',
  'bo-qua':
    'Trang có thể có hình vẽ. BỎ QUA hình: chỉ cần viết đúng một dòng "[HÌNH] (giữ hình gốc)" tại đúng vị trí hình xuất hiện, KHÔNG mô tả, và tuyệt đối KHÔNG chép các chữ cái/số nằm rải rác trong hình thành dòng văn bản.',
  'mo-ta':
    'Trang có hình vẽ. Tại đúng vị trí mỗi hình, viết một dòng bắt đầu bằng "[HÌNH] " rồi mô tả hình: các điểm, cách nối, nét nào là nét đứt (cạnh khuất), ký hiệu góc vuông ở đâu, số đo ghi trên cạnh nào. Chỉ mô tả thứ NHÌN THẤY trong hình; KHÔNG suy ra từ lời đề. KHÔNG chép các nhãn trong hình thành dòng văn bản rời rạc.',
  've-lai': [
    'Trang có hình vẽ. Với MỖI hình, làm hai việc:',
    '1) Tại đúng vị trí của hình, viết một dòng bắt đầu bằng "[HÌNH] " mô tả hình (điểm, cách nối, nét đứt, ký hiệu góc vuông, số đo trên cạnh). Chỉ mô tả thứ NHÌN THẤY.',
    '2) Sau toàn bộ phần chữ, vẽ lại từng hình bằng SVG thuần, mỗi hình đặt trong một khối:',
    '```svg',
    '<svg xmlns="http://www.w3.org/2000/svg" width="..." height="..." viewBox="...">…</svg>',
    '```',
    'Nét đen trên nền trắng, nhãn điểm bằng <text>, cạnh khuất dùng stroke-dasharray. KHÔNG dùng <script>, <foreignObject>, <image>, KHÔNG tải font hay ảnh từ ngoài.',
    'KHÔNG chép các nhãn trong hình thành dòng văn bản rời rạc.',
  ].join('\n'),
};

/** Bề ngang tối đa gửi lên model. Ảnh điện thoại 12MP (4032px) không giúp đọc
 *  chữ tốt hơn trang A4 ở 2200px, nhưng làm token và thời gian đội lên nhiều. */
const RONG_TOI_DA = 2200;

/**
 * Chuẩn hoá ảnh trước khi gửi model. Ba việc, việc nào cũng từng là lỗi thật
 * ở đâu đó:
 *
 *  1. **Xoay theo EXIF.** Ảnh iPhone/Android hay nằm ngang trong file và chỉ
 *     "đứng" nhờ cờ EXIF. Model nhìn pixel thô, nên không xoay là nó đọc một
 *     trang giấy nằm ngang.
 *  2. **HEIC → JPEG.** iPhone mặc định chụp .HEIC; cổng LLM không nhận định
 *     dạng đó. `sharp` trong image production đọc được HEIF (đã kiểm trong
 *     container thật), nên đổi ở đây là xong.
 *  3. **Thu nhỏ.** Tiết kiệm token và thời gian chờ.
 *
 * Hỏng thì trả lại ảnh gốc chứ không chặn: thà để model tự từ chối còn hơn
 * mất luôn một trang vì khâu phụ.
 */
async function chuanHoaAnh(anh: AnhVao): Promise<VisionImage> {
  try {
    const goc = Buffer.from(anh.data, 'base64');
    let img = sharp(goc, { failOn: 'none' }).rotate();
    const meta = await img.metadata();
    if ((meta.width ?? 0) > RONG_TOI_DA) img = img.resize({ width: RONG_TOI_DA, withoutEnlargement: true });
    const ra = await img.jpeg({ quality: 85 }).toBuffer();
    return { data: ra.toString('base64'), mediaType: 'image/jpeg' };
  } catch (e) {
    logger.warn('docTools: không chuẩn hoá được ảnh, gửi nguyên bản', {
      mediaType: anh.mediaType,
      error: (e as Error).message,
    });
    return { data: anh.data, mediaType: anh.mediaType };
  }
}

/** Chép MỘT ảnh. Không ném ra ngoài — lỗi được gói vào kết quả của trang đó. */
export async function chepMotAnh(anh: AnhVao, chiSo: number, tuyChon: TuyChonChep): Promise<TrangKetQua> {
  const cheDo = tuyChon.cheDoHinh ?? 'bo-qua';
  const system = buildSystemPrompt({
    presetIds: tuyChon.presetIds,
    note: tuyChon.note,
    luatHinh: HUONG_DAN_HINH[cheDo],
  });

  try {
    const anhGui = await chuanHoaAnh(anh);
    const kq = await visionComplete({
      system,
      userText: 'Chép lại toàn bộ nội dung trong ảnh.',
      images: [anhGui],
      maxTokens: cheDo === 've-lai' ? 6000 : 4000,
      userId: tuyChon.userId,
    });

    const { vanBan, svgs } = tachSvg(kq.text);
    const hinhVeLai: HinhVeLai[] = [];
    if (cheDo === 've-lai') {
      for (const svg of svgs.slice(0, 4)) {
        const png = await svgSangPng(svg).catch((e) => {
          logger.warn('docTools: không dựng được hình từ SVG', { error: (e as Error).message });
          return null;
        });
        if (png) hinhVeLai.push(png);
      }
    } else if (cheDo === 'cat-anh' && /\[HÌNH\]/i.test(vanBan)) {
      // Lời gọi THỨ HAI, chỉ để định vị hình. Tách riêng chứ không nhồi vào
      // lượt chép: một lời dặn ôm hai việc thì việc nào cũng kém đi, mà lượt
      // chép là thứ không được phép kém.
      const khungs = await timKhungHinh(anhGui, tuyChon.userId);
      hinhVeLai.push(...(await catCacHinh(anhGui, khungs)));
    }

    return {
      chiSo,
      ten: anh.ten,
      vanBan: donDep(vanBan),
      hinhVeLai,
      soChoNgo: (vanBan.match(/\[\?\]/g) ?? []).length,
      model: kq.model,
      tokenVao: kq.inputTokens,
      tokenRa: kq.outputTokens,
      costUsd: kq.costUsd,
    };
  } catch (e) {
    return {
      chiSo,
      ten: anh.ten,
      vanBan: '',
      hinhVeLai: [],
      soChoNgo: 0,
      loi: e instanceof Error ? e.message : String(e),
    };
  }
}

/** Chép nhiều ảnh, tối đa 3 lượt chạy song song. */
export async function chepNhieuAnh(anhs: AnhVao[], tuyChon: TuyChonChep): Promise<TrangKetQua[]> {
  kiemTraAnh(anhs);
  const ketQua: TrangKetQua[] = new Array(anhs.length);
  const SONG_SONG = 3;
  let ke = 0;
  await Promise.all(
    Array.from({ length: Math.min(SONG_SONG, anhs.length) }, async () => {
      for (;;) {
        const i = ke++;
        if (i >= anhs.length) return;
        ketQua[i] = await chepMotAnh(anhs[i], i, tuyChon);
      }
    }),
  );
  return ketQua;
}

export function kiemTraAnh(anhs: AnhVao[]): void {
  if (!anhs.length) throw new BadRequestError('Chưa chọn ảnh nào.');
  if (anhs.length > TOI_DA_ANH) throw new BadRequestError(`Tối đa ${TOI_DA_ANH} ảnh mỗi lần.`);
  for (const a of anhs) {
    // Ảnh .HEIC từ iPhone hay có mimetype RỖNG hoặc `application/octet-stream`
    // khi trình duyệt không nhận ra. Đừng chặn ở đây — `chuanHoaAnh()` để
    // `sharp` tự quyết, nó đọc được thì chạy tiếp, không đọc được thì mới báo.
    const loai = (a.mediaType || '').toLowerCase();
    if (loai && !loai.startsWith('image/') && loai !== 'application/octet-stream') {
      throw new BadRequestError(`Định dạng không phải ảnh: ${a.mediaType}`);
    }
    // base64 phình ~4/3 so với byte thật.
    if ((a.data.length * 3) / 4 > TOI_DA_BYTE_MOI_ANH) throw new BadRequestError('Ảnh quá nặng (giới hạn 12MB mỗi ảnh).');
  }
}

/** Cắt các khối ```svg ... ``` ra khỏi phần văn bản. */
function tachSvg(raw: string): { vanBan: string; svgs: string[] } {
  const svgs: string[] = [];
  const vanBan = raw
    .replace(/```(?:svg|xml|html)?\s*(<svg[\s\S]*?<\/svg>)\s*```/gi, (_, svg: string) => {
      svgs.push(svg);
      return '';
    })
    .replace(/(^|\n)\s*(<svg[\s\S]*?<\/svg>)\s*/gi, (_, dau: string, svg: string) => {
      svgs.push(svg);
      return dau;
    });
  return { vanBan, svgs };
}

function donDep(s: string): string {
  return s
    .replace(/^```[\w]*\s*\n?/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * SVG do model viết → PNG.
 *
 * KHÔNG bao giờ trả SVG thô về trình duyệt và KHÔNG dựng ảnh trước khi lọc:
 * đây là mã do model sinh ra, tức là nội dung không tin được. `<script>` là
 * XSS nếu trang tự vẽ nó; `<image href="http://...">` biến máy chủ thành công
 * cụ đi gọi hộ (librsvg có thể đi tải thật). Lọc trước, rồi mới dựng ảnh, rồi
 * chỉ đưa PNG ra ngoài.
 */
async function svgSangPng(svgRaw: string): Promise<HinhVeLai> {
  const svg = svgRaw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<image\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/(href|xlink:href)\s*=\s*("|')(?!#)[^"']*\2/gi, '');

  if (!/^\s*<svg[\s>]/i.test(svg)) throw new Error('không phải SVG');
  if (svg.length > 200_000) throw new Error('SVG quá lớn');

  const anh = sharp(Buffer.from(svg), { density: 200 }).flatten({ background: '#ffffff' }).png();
  const { data, info } = await anh.toBuffer({ resolveWithObject: true });
  return { pngBase64: data.toString('base64'), rong: info.width, cao: info.height };
}
