/**
 * ============================================================
 * Nói chuyện với robot về kế hoạch trong ngày
 * ============================================================
 *
 * "Hôm nay có gì" · "xong rồi" · "hoãn 10 phút" · "bỏ qua" ·
 * "hướng dẫn đi".
 *
 * ⚠️ LUẬT SỐNG CÒN CỦA FILE NÀY: **KHÔNG CƯỚP LƯỢT KHI KHÔNG CÓ VIỆC.**
 *
 * "Xong rồi" là câu người Việt nói suốt ngày — "ăn cơm xong rồi", "phim
 * xong rồi", "ừ xong rồi đấy". Bắt cứng từ khoá thì mọi câu như thế đều
 * bị nuốt và robot đáp "đã tích xanh", nghe rất ngu và còn chấm nhầm
 * một việc thật.
 *
 * Nên khớp từ khoá CHỈ LÀ ĐIỀU KIỆN CẦN. Điều kiện đủ là **đang có việc
 * treo thật**. Không có thì `xuLy()` trả `null`, lượt nói rơi xuống LLM
 * như chưa có gì xảy ra.
 */

import { MakerRunState } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import {
  chamXong, boQua, hoanLai, doanViec, danhSachTreo, homNay, tomTat, docGio,
  quenVuaNhac,
} from './keHoach.js';

export type LoaiLenh = 'hom-nay' | 'xong' | 'hoan' | 'bo-qua' | 'huong-dan';

export interface LenhKeHoach {
  loai: LoaiLenh;
  /** Số phút cho lệnh hoãn. */
  phut?: number;
}

function boDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Câu hỏi về lịch hôm nay. */
const HOI_LICH = [
  'hom nay co gi', 'hom nay co viec gi', 'lich hom nay', 'ke hoach hom nay',
  'hom nay phai lam gi', 'hom nay lam gi', 'con viec gi', 'con gi phai lam',
  'xong may viec', 'duoc may viec', 'tien do hom nay', 'con bao nhieu viec',
  'viec hom nay', 'nhac lai lich',
];

const BAO_XONG = [
  'xong roi', 'da xong', 'lam xong', 'xong viec', 'hoan thanh', 'xong nhe',
  'tich xanh', 'danh dau xong', 'check roi', 'lam roi', 'da lam roi', 'xong',
];

const BAO_BO = [
  'bo qua', 'khoi lam', 'hom nay khoi', 'thoi khong lam', 'bo hom nay', 'skip',
];

const HOI_CACH = [
  'lam the nao', 'huong dan', 'chi toi', 'lam sao', 'cach lam', 'noi lai cach',
  'huong dan di', 'chi cach',
];

/** "hoãn 10 phút", "nhắc lại sau 5 phút", "lát nữa". */
function khopHoan(s: string): number | null {
  if (/(hoan|nhac lai|nhac sau|de sau|lat nua|chut nua|tí nua|ti nua)/.test(s)) {
    const m = /(\d{1,3})\s*(phut|tieng|gio|p|h)\b/.exec(s);
    if (m) {
      const n = Number(m[1]);
      // ⚠️ SO BẰNG, KHÔNG PHẢI SO CHỨA. Bản đầu viết
      // `/tieng|gio|h/.test(donVi)` và "phut" CÓ chữ `h` trong đó
      // (p-h-u-t) ⇒ "hoãn 15 phút" thành 15 GIỜ. Bộ thử bắt được, đọc
      // mã thì không — mắt tự đọc `h` thành "đơn vị giờ" chứ không đọc
      // thành "một ký tự bất kỳ nằm đâu đó trong chuỗi".
      return ['tieng', 'gio', 'h'].includes(m[2]) ? n * 60 : n;
    }
    return 10; // "lát nữa" mặc định 10 phút
  }
  return null;
}

/**
 * Đọc câu nói ra lệnh kế hoạch. `null` = không phải lệnh kế hoạch.
 *
 * Đây MỚI CHỈ là khớp chữ. Có được thi hành hay không thì `xuLy()`
 * quyết, sau khi tra xem có việc nào đang treo thật.
 */
/**
 * Cụm này có nằm ở ĐẦU hay CUỐI câu không — chứ không phải "có xuất
 * hiện đâu đó" không.
 *
 * ⚠️ ĐÂY LÀ CHỐT CHỐNG CƯỚP LƯỢT, và bản đầu thiếu nó nên bộ thử bắt
 * được ngay: *"hôm nay tôi đi làm về mệt quá nên ăn cơm xong rồi đi ngủ
 * luôn…"* bị hiểu thành lệnh báo xong việc. Câu đó có "xong rồi" thật,
 * nhưng nằm GIỮA — đó là kể chuyện, không phải ra lệnh.
 *
 * Người ta ra lệnh thì nói "xong rồi", "tôi xong rồi", "xong rồi nhé".
 * Cụm lệnh luôn bám một trong hai đầu câu. Chôn giữa một câu dài thì
 * gần như chắc chắn là đang thuật lại chuyện gì đó.
 */
function oHaiDau(s: string, cum: string): boolean {
  return s === cum || s.startsWith(`${cum} `) || s.endsWith(` ${cum}`);
}

export function khopLenhKeHoach(heard: string): LenhKeHoach | null {
  const s = boDau(heard);
  if (!s || s.length > 120) return null; // câu dài là đang kể chuyện, không phải ra lệnh

  if (HOI_LICH.some((t) => s.includes(t))) return { loai: 'hom-nay' };

  const hoan = khopHoan(s);
  if (hoan != null) return { loai: 'hoan', phut: hoan };

  // Báo xong / bỏ qua đòi cụm nằm ở đầu hoặc cuối câu — xem `oHaiDau`.
  if (BAO_BO.some((t) => oHaiDau(s, t))) return { loai: 'bo-qua' };
  if (HOI_CACH.some((t) => s.includes(t))) return { loai: 'huong-dan' };

  // Để "xong" CUỐI CÙNG: nó là từ ngắn nhất và dễ đụng nhất, nên mọi
  // lệnh rõ ràng hơn phải được xét trước. "làm xong rồi thì bỏ qua" mà
  // xét "xong" trước thì thành báo xong, ngược hẳn ý người nói.
  if (BAO_XONG.some((t) => oHaiDau(s, t))) return { loai: 'xong' };

  return null;
}

export interface KetQuaLenh {
  /** Câu robot nói ra. */
  cau: string;
  /** Đã đụng vào một lượt nào chưa — để bên gọi biết mà xoá `vuaNhac`. */
  runId?: number;
}

/**
 * Thi hành. Trả `null` nghĩa là "câu này không dành cho tôi" — bên gọi
 * phải để nó rơi tiếp xuống LLM, ĐỪNG nuốt.
 */
export async function xuLyLenhKeHoach(
  lenh: LenhKeHoach,
  ownerId: number,
  deviceId: number | null,
  cauNoi: string,
): Promise<KetQuaLenh | null> {
  switch (lenh.loai) {
    case 'hom-nay': {
      const muc = await homNay(ownerId);
      if (!muc.length) return { cau: 'Hôm nay bạn không đặt việc nào cả. Rảnh.' };
      const t = tomTat(muc);
      const con = muc.filter((m) => m.state !== MakerRunState.DONE);
      if (!con.length) {
        return { cau: `Xong sạch rồi. Cả ${t.tong} việc hôm nay, không sót cái nào.` };
      }
      // Đọc tối đa 5 việc. Dài hơn thì nó thành bản tin thời sự, mà
      // người ta đang đứng nghe chứ không ngồi đọc.
      const doc = con.slice(0, 5).map((m) => `${docGio(m.gio)} ${m.title}`).join('. ');
      const them = con.length > 5 ? ` Còn ${con.length - 5} việc nữa.` : '';
      return {
        cau: `Hôm nay ${t.tong} việc, xong ${t.xong}. Còn lại: ${doc}.${them}`,
      };
    }

    case 'xong': {
      const d = await doanViec(ownerId, deviceId, cauNoi);
      if (!d) {
        const treo = await danhSachTreo(ownerId);
        // KHÔNG có việc treo ⇒ đây là câu nói chuyện bình thường, trả
        // `null` để LLM nhận. Đây là chốt chống cướp lượt.
        if (!treo.length) return null;
        // Có nhiều việc treo mà không biết cái nào ⇒ HỎI LẠI. Chấm bừa
        // là làm hỏng đúng thứ người dùng nhờ mình giữ.
        const ten = treo.slice(0, 4).map((r) => r.plan.title).join(', ');
        return { cau: `Xong việc nào? Đang treo ${treo.length} việc: ${ten}.` };
      }
      await chamXong(d.run.id, cauNoi);
      if (deviceId != null) quenVuaNhac(deviceId);
      const con = (await danhSachTreo(ownerId)).length;
      logger.info('MakerLab chấm xong việc bằng giọng nói', {
        runId: d.run.id, plan: d.run.plan.title, vi: d.vi,
      });
      return {
        cau: con
          ? `Rồi, "${d.run.plan.title}" tích xanh. Còn ${con} việc nữa.`
          : `Rồi, "${d.run.plan.title}" tích xanh. Hết việc hôm nay.`,
        runId: d.run.id,
      };
    }

    case 'bo-qua': {
      const d = await doanViec(ownerId, deviceId, cauNoi);
      if (!d) return null;
      await boQua(d.run.id, cauNoi);
      if (deviceId != null) quenVuaNhac(deviceId);
      return { cau: `Ừ, bỏ "${d.run.plan.title}" hôm nay. Mai nhắc lại.`, runId: d.run.id };
    }

    case 'hoan': {
      const d = await doanViec(ownerId, deviceId, cauNoi);
      if (!d) return null;
      const phut = lenh.phut ?? 10;
      await hoanLai(d.run.id, phut);
      if (deviceId != null) quenVuaNhac(deviceId);
      return { cau: `Được, ${phut} phút nữa tôi nhắc lại "${d.run.plan.title}".`, runId: d.run.id };
    }

    case 'huong-dan': {
      const d = await doanViec(ownerId, deviceId, cauNoi);
      if (!d) return null;
      const h = d.run.plan.huongDan?.trim();
      if (!h) return { cau: `Việc "${d.run.plan.title}" bạn chưa ghi hướng dẫn gì cả.` };
      return { cau: h, runId: d.run.id };
    }

    default:
      return null;
  }
}
