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
import { dungHinh, kiemMoTa } from './geometry.js';
import { lamSachAnh } from './lamSachAnh.js';
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
  // ⚠️ KHÔNG bảo model tự vẽ SVG. Đo 13-14/08/2026: nó đặt toạ độ bằng mắt
  // nên chấm điểm lệch khỏi giao điểm, cung góc treo lơ lửng, nhãn đè lên
  // nét — và dặn kỹ tới đâu cũng vẫn sai, vì mỗi ảnh là một lần đoán mới.
  // Nó chỉ mô tả CẤU TRÚC; toạ độ do `geometry.ts` TÍNH.
  've-lai': [
    'Trang có hình vẽ. Với MỖI hình:',
    '1) Tại đúng vị trí của hình, viết đúng một dòng "[HÌNH] (giữ hình gốc)".',
    '2) Sau toàn bộ phần chữ, mô tả CẤU TRÚC của từng hình trong một khối, đúng thứ tự các hình:',
    '```hinh',
    '{"rong":620,"cao":420,',
    ' "diem":[{"ten":"A","x":0.34,"y":0.30},{"ten":"B","x":0.72,"y":0.70}],',
    ' "duong":[{"qua":["A","B"],"nhanDau":"r","nhanCuoi":"y"},',
    '          {"qua":["A"],"huongDo":22,"nhanDau":"z","nhanCuoi":"t"},',
    '          {"qua":["B"],"huongDo":6,"nhanDau":"m","nhanCuoi":"n"}],',
    ' "goc":[{"dinh":"A","tia":["z","y"],"do":124}]}',
    '```',
    'Luật:',
    '- "x","y" là vị trí ĐO TỪ ẢNH của điểm đó, tính theo tỉ lệ 0..1 trong KHUNG HÌNH VẼ (0,0 = góc trên bên trái của hình, KHÔNG phải của cả trang). Hãy ước lượng cẩn thận — hình dựng ra sẽ bám theo đúng những con số này, nên đặt sai chỗ là hình lệch so với bản gốc.',
    '- "huongDo" là độ nghiêng THẬT của đường, ĐO TỪ ẢNH (0 = nằm ngang sang phải, 90 = thẳng đứng lên, tăng ngược chiều kim đồng hồ; đường chếch lên phải khoảng 1/3 thì ~20°, chếch xuống phải thì số ÂM).',
    '- "rong"/"cao" đặt theo đúng TỈ LỆ khung hình vẽ trong ảnh (hình bè ngang thì rong > cao).',
    '- "qua" ghi tên các điểm mà đường đi qua. Đường đi qua HAI điểm đã khai thì không cần "huongDo" — độ nghiêng tự suy ra từ hai điểm đó. Đường chỉ qua MỘT điểm thì BẮT BUỘC có "huongDo".',
    '- "nhanDau"/"nhanCuoi" là chữ ghi ở hai đầu đường (x, y, m, n…).',
    '- "goc": "dinh" là tên điểm, "tia" là HAI nhãn đầu tia tạo nên góc, "do" là số đo ghi trên hình. Chép đúng con số nhìn thấy.',
    '- CHỈ mô tả hình phẳng gồm đường thẳng/tia/góc/điểm. Hình KHÔNG GIAN (chóp, lăng trụ, hộp), đường tròn, đồ thị hàm số thì ĐỪNG mô tả — bỏ khối đó đi, hệ thống sẽ tự cắt ảnh gốc.',
    '- KHÔNG chép các nhãn trong hình thành dòng văn bản rời rạc.',
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
    // `.rotate()` không tham số = áp cờ xoay EXIF (ảnh điện thoại).
    const theoExif = await sharp(goc, { failOn: 'none' }).rotate().toBuffer();

    // NẮN THẲNG cả trang, trước khi cắt hình. Làm ở đây chứ không làm trên
    // mẩu hình: đo độ nghiêng cần các DÒNG CHỮ, mà mẩu hình thì không có.
    // Nắn ở đây được cả hai: model đọc chữ dễ hơn, và hình cắt ra cũng thẳng.
    const daNan = await lamSachAnh(theoExif, { nanThang: true, langNen: false });

    let img = sharp(daNan, { failOn: 'none' });
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

    const { vanBan, svgs, moTaHinh } = tachSvg(kq.text);
    const hinhVeLai: HinhVeLai[] = [];
    if (cheDo === 've-lai') {
      // Dựng từ MÔ TẢ CẤU TRÚC — toạ độ do `geometry.ts` tính, không lấy của
      // model. Xem đầu file đó để biết vì sao.
      for (const mo of moTaHinh.slice(0, 4)) {
        try {
          if (!kiemMoTa(mo)) throw new Error('mô tả thiếu điểm hoặc đường');
          const png = await svgSangPng(dungHinh(mo));
          hinhVeLai.push(png);
        } catch (e) {
          logger.warn('docTools: mô tả hình không dựng được', { error: (e as Error).message });
        }
      }
      // Model tự vẽ SVG (không nghe lời dặn) thì vẫn nhận, nhưng chỉ khi
      // KHÔNG có mô tả cấu trúc nào dựng được — đây là đường lùi, không phải
      // đường chính.
      if (!hinhVeLai.length) {
        for (const svg of svgs.slice(0, 4)) {
          const png = await svgSangPng(svg).catch(() => null);
          if (png) hinhVeLai.push(png);
        }
      }
      // Vẫn không có gì (hình không gian, đường tròn, đồ thị…) → cắt ảnh gốc.
      if (!hinhVeLai.length && /\[HÌNH\]/i.test(vanBan)) {
        const khungs = await timKhungHinh(anhGui, tuyChon.userId);
        hinhVeLai.push(...(await catCacHinh(anhGui, khungs)));
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

/** Cắt các khối ```hinh (mô tả cấu trúc) và ```svg ra khỏi phần văn bản. */
function tachSvg(raw: string): { vanBan: string; svgs: string[]; moTaHinh: unknown[] } {
  const svgs: string[] = [];
  const moTaHinh: unknown[] = [];

  raw = raw.replace(/```(?:hinh|hình|json)\s*([\s\S]*?)```/gi, (_, than: string) => {
    try {
      moTaHinh.push(JSON.parse(than.trim()));
    } catch (e) {
      logger.warn('docTools: khối mô tả hình không phải JSON hợp lệ', { error: (e as Error).message });
    }
    return '';
  });

  const vanBan = raw
    .replace(/```(?:svg|xml|html)?\s*(<svg[\s\S]*?<\/svg>)\s*```/gi, (_, svg: string) => {
      svgs.push(svg);
      return '';
    })
    .replace(/(^|\n)\s*(<svg[\s\S]*?<\/svg>)\s*/gi, (_, dau: string, svg: string) => {
      svgs.push(svg);
      return dau;
    });
  return { vanBan, svgs, moTaHinh };
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
