/**
 * ============================================================
 * ĐỌC THỜI KHOÁ BIỂU TỪ ẢNH
 * ============================================================
 *
 * Chụp bảng lịch của trường (FAP) → trả về các buổi học đã bóc tách.
 *
 * ⚠️ HÀM NÀY KHÔNG GHI GÌ VÀO DATABASE, VÀ ĐÓ LÀ CHỦ ĐÍCH.
 * Nó chỉ đề nghị. App hiện bản xem trước, người dùng sửa nếu cần, rồi mới
 * gọi `POST /class-schedule/bulk` để lưu. Một bản đọc sai mà tự lưu thẳng
 * thì người dùng đi học nhầm phòng, nhầm giờ — mà lại không biết vì sao,
 * vì họ chưa từng thấy con số nào.
 *
 * Dùng lại `visionComplete()` của docTools: đó là đường DUY NHẤT trong dự án
 * đã đo được là nhìn ảnh thật (`doc_ocr` → model nhìn được). Model rẻ hơn thì
 * NHẬN ảnh, KHÔNG báo lỗi, và BỊA nội dung — xem CLAUDE.md.
 */
import sharp from 'sharp';
import { visionComplete, type VisionImage } from '../docTools/vision.js';
import { logger } from '../../utils/logger.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

/** Khung giờ slot của FAP. Phải khớp `SlotFAP.khung` bên iOS. */
export const KHUNG_SLOT: Record<number, [string, string]> = {
  1: ['07:30', '09:50'],
  2: ['10:00', '12:20'],
  3: ['12:50', '15:10'],
  4: ['15:20', '17:40'],
  5: ['17:50', '20:10'],
};

export interface BuoiDocDuoc {
  /** 2..8 — 2 = thứ Hai, 8 = Chủ nhật. Cùng hệ với `ClassSchedule.weekday`. */
  thu: number;
  slot: number;
  batDau: string;
  ketThuc: string;
  monHoc: string;
  phong: string | null;
  giaoVien: string | null;
}

export interface KetQuaDocLich {
  buoi: BuoiDocDuoc[];
  /** Thứ model KHÔNG chắc. Hiện thẳng cho người dùng, đừng nuốt. */
  canhBao: string[];
  model: string;
  soToken: number;
}

/**
 * ⚠️ KHÔNG ĐƯA VÍ DỤ CÓ MÃ MÔN THẬT VÀO ĐÂY.
 *
 * Bài học cũ trong dự án: ví dụ cụ thể trong prompt bị model CHÉP NGUYÊN vào
 * kết quả. Một prompt mẫu ghi "SWR302 | BE-210" là có ngày người dùng nhận về
 * đúng dòng đó dù ảnh của họ không hề có môn ấy — và nó trông hợp lý tới mức
 * không ai kiểm lại.
 */
const HUONG_DAN = `Bạn đọc ảnh chụp THỜI KHOÁ BIỂU của sinh viên và bóc ra từng buổi học.

Bảng thường có: các CỘT là thứ trong tuần, các HÀNG là slot/ca học. Ô nào có
chữ là một buổi học; ô trống là không học.

Trả về DUY NHẤT một khối JSON, không kèm lời dẫn, không kèm dấu \`\`\`:

{
  "buoi": [
    { "thu": <2-8>, "slot": <1-5>, "monHoc": "<mã hoặc tên môn>",
      "phong": "<phòng hoặc null>", "giaoVien": "<tên hoặc null>" }
  ],
  "canhBao": ["<mô tả chỗ bạn không đọc chắc>"]
}

QUY TẮC — đọc kỹ, sai ở đây là người dùng đi học nhầm giờ:

1. "thu": 2 = thứ Hai, 3 = thứ Ba, ... 7 = thứ Bảy, 8 = Chủ nhật.
   Lấy theo CỘT mà ô nằm trong đó. Cột là thông tin quan trọng nhất của bảng
   này — đọc nhầm cột là sai cả buổi.
2. "slot": lấy theo HÀNG. Nếu bảng ghi giờ thay vì số slot thì quy đổi:
   07:30→1, 10:00→2, 12:50→3, 15:20→4, 17:50→5.
   Không rơi vào khung nào thì ĐỪNG đoán — bỏ buổi đó ra và ghi vào "canhBao".
3. CHỈ ghi những ô THỰC SỰ NHÌN THẤY trong ảnh. Không suy diễn, không điền
   thêm cho "đủ tuần", không lặp lại buổi sang thứ khác.
4. Ô nào chữ mờ hoặc bị che: ĐỪNG đoán. Bỏ ra và ghi vào "canhBao" kèm vị trí
   (thứ mấy, slot mấy).
5. Ảnh không phải thời khoá biểu thì trả "buoi": [] và nói rõ trong "canhBao".
6. Giữ NGUYÊN VĂN mã môn và mã phòng, kể cả chữ hoa và dấu gạch. Không tự
   sửa chính tả, không dịch.`;

const RONG_TOI_DA = 2000;

/** Nắn ảnh điện thoại theo cờ EXIF và ghìm bề rộng. Ảnh 4000px không đọc tốt
 *  hơn, chỉ tốn token và làm chậm. */
async function chuanHoaAnh(anh: Buffer, mediaType: string): Promise<VisionImage> {
  try {
    let img = sharp(anh, { failOn: 'none' }).rotate();
    const meta = await sharp(anh, { failOn: 'none' }).metadata();
    if ((meta.width ?? 0) > RONG_TOI_DA) {
      img = img.resize({ width: RONG_TOI_DA, withoutEnlargement: true });
    }
    const ra = await img.jpeg({ quality: 88 }).toBuffer();
    return { data: ra.toString('base64'), mediaType: 'image/jpeg' };
  } catch (e) {
    logger.warn('docAnhLich: không chuẩn hoá được ảnh, gửi nguyên bản', {
      error: e instanceof Error ? e.message : String(e),
    });
    return { data: anh.toString('base64'), mediaType };
  }
}

/**
 * Bóc khối JSON ra khỏi câu trả lời.
 *
 * Model hay bọc trong ```json dù đã dặn đừng, và đôi khi thêm một câu dẫn.
 * Bắt lấy từ `{` đầu tiên tới `}` cuối cùng thay vì đòi cả chuỗi phải là JSON.
 */
export function bocJson(raw: string): unknown {
  const s = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const dau = s.indexOf('{');
  const cuoi = s.lastIndexOf('}');
  if (dau < 0 || cuoi <= dau) throw new BadRequestError('Không đọc được kết quả từ ảnh. Thử chụp rõ hơn nhé.');
  return JSON.parse(s.slice(dau, cuoi + 1));
}

/**
 * Lọc và chuẩn hoá những gì model trả về.
 *
 * ⚠️ KHÔNG TIN MODEL. Mọi thứ ra khỏi hàm này đều đã qua kiểm: thứ trong
 * 2..8, slot có khung giờ thật, tên môn không rỗng. Dòng nào hỏng thì BỎ và
 * nói ra ở `canhBao` — im lặng bỏ đi thì người dùng đinh ninh đã nhập đủ
 * lịch, tới hôm đó mới biết thiếu một buổi.
 */
export function locBuoi(tho: unknown): { buoi: BuoiDocDuoc[]; canhBao: string[] } {
  const goc = tho as { buoi?: unknown; canhBao?: unknown };
  const canhBao: string[] = Array.isArray(goc?.canhBao)
    ? goc.canhBao.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim()).slice(0, 20)
    : [];

  const vao = Array.isArray(goc?.buoi) ? goc.buoi : [];
  const buoi: BuoiDocDuoc[] = [];
  const daThay = new Set<string>();

  for (const x of vao) {
    const r = x as Record<string, unknown>;
    const thu = Number(r?.thu);
    const slot = Number(r?.slot);
    const monHoc = String(r?.monHoc ?? '').trim();

    if (!Number.isInteger(thu) || thu < 2 || thu > 8) {
      canhBao.push(`Bỏ một buổi vì thứ không hợp lệ: ${JSON.stringify(r?.thu)}`);
      continue;
    }
    if (!Number.isInteger(slot) || !KHUNG_SLOT[slot]) {
      canhBao.push(`Bỏ một buổi (thứ ${thu}) vì slot không hợp lệ: ${JSON.stringify(r?.slot)}`);
      continue;
    }
    if (!monHoc) {
      canhBao.push(`Bỏ một buổi (thứ ${thu}, slot ${slot}) vì không đọc được tên môn`);
      continue;
    }
    // Trùng THỨ + SLOT là không thể học được cả hai. Giữ cái đầu, nói ra cái sau.
    const khoa = `${thu}|${slot}`;
    if (daThay.has(khoa)) {
      canhBao.push(`Thứ ${thu} slot ${slot} có hai buổi chồng nhau — chỉ giữ buổi đầu`);
      continue;
    }
    daThay.add(khoa);

    const [batDau, ketThuc] = KHUNG_SLOT[slot]!;
    const chuOrNull = (v: unknown): string | null => {
      const s = String(v ?? '').trim();
      // Model hay viết chữ "null"/"N/A" thay vì để trống thật.
      return !s || /^(null|n\/?a|none|-|không|khong)$/i.test(s) ? null : s.slice(0, 150);
    };
    buoi.push({
      thu, slot, batDau, ketThuc,
      monHoc: monHoc.slice(0, 200),
      phong: chuOrNull(r?.phong),
      giaoVien: chuOrNull(r?.giaoVien),
    });
  }

  buoi.sort((a, b) => (a.thu - b.thu) || (a.slot - b.slot));
  return { buoi, canhBao };
}

export async function docLichTuAnh(opts: {
  anh: Buffer;
  mediaType: string;
  userId?: number | null;
}): Promise<KetQuaDocLich> {
  const img = await chuanHoaAnh(opts.anh, opts.mediaType);
  const kq = await visionComplete({
    system: HUONG_DAN,
    userText: 'Đọc thời khoá biểu trong ảnh này và trả về JSON theo đúng khuôn đã mô tả.',
    images: [img],
    maxTokens: 3000,
    userId: opts.userId ?? null,
  });

  const { buoi, canhBao } = locBuoi(bocJson(kq.text));
  logger.info('docAnhLich: đọc xong', {
    userId: opts.userId, soBuoi: buoi.length, soCanhBao: canhBao.length, model: kq.model,
  });
  return { buoi, canhBao, model: kq.model, soToken: kq.inputTokens + kq.outputTokens };
}
