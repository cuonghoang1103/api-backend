/**
 * ============================================================
 * LỊCH HÔM NAY — xếp buổi hôm nay theo trạng thái
 * ============================================================
 *
 * Bảng tuần trả lời "tuần này tôi học gì". Câu người ta hỏi mười lần một ngày
 * lại là câu khác: **"giờ tới tôi phải đi đâu?"** — và để trả lời nó bằng bảng
 * tuần thì phải tìm cột hôm nay, dò xuống, tự so giờ trong đầu.
 *
 * Khối này trả lời thẳng: buổi nào đã xong, buổi nào đang học, buổi nào sắp
 * tới, và cái nào là KẾ TIẾP.
 */
import { conMayPhut, type Buoi } from '@/lib/lich/chung';

export type TrangThaiBuoi = 'xong' | 'dang' | 'toi';

export interface BuoiXep {
  buoi: Buoi;
  trangThai: TrangThaiBuoi;
  /** Phút tới giờ BẮT ĐẦU. Âm nghĩa là đã bắt đầu rồi. */
  conPhut: number;
  /** Đúng MỘT buổi mang cờ này: buổi sắp tới gần nhất. */
  keTiep: boolean;
}

/**
 * Xếp danh sách buổi HÔM NAY theo giờ, kèm trạng thái.
 *
 * ⚠️ Nhận vào danh sách đã lọc theo thứ hôm nay (`LichHoc` lọc sẵn rồi truyền
 * lên). Không lọc lại ở đây: lọc hai lần bằng hai đồng hồ khác nhau là cách
 * tạo ra một khối nói "hôm nay trống" trong khi bảng tuần đang tô một buổi.
 *
 * `dang` tính theo cả giờ kết thúc, không chỉ giờ bắt đầu — buổi 07:30–09:50
 * lúc 09:00 vẫn đang diễn ra, gọi nó là "xong" thì người ngồi trong lớp nhìn
 * màn hình thấy sai.
 */
export function xepHomNay(ds: Buoi[], bayGio = new Date()): BuoiXep[] {
  const xep = [...ds].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const ra: BuoiXep[] = xep.map((buoi) => {
    const conPhut = conMayPhut(buoi.startTime, bayGio);
    const toiHet = conMayPhut(buoi.endTime, bayGio);
    let trangThai: TrangThaiBuoi = 'toi';
    if (toiHet <= 0) trangThai = 'xong';
    else if (conPhut <= 0) trangThai = 'dang';
    return { buoi, trangThai, conPhut, keTiep: false };
  });
  /* Buổi kế tiếp là buổi SẮP TỚI đầu tiên — không phải buổi đang học. Người
     đang ngồi trong lớp hỏi "kế tiếp" là hỏi cái sau cái này. */
  const i = ra.findIndex((x) => x.trangThai === 'toi');
  if (i >= 0) ra[i]!.keTiep = true;
  return ra;
}

/** Số buổi CHƯA xong — con số đứng cạnh tiêu đề. */
export function soConLai(ds: BuoiXep[]): number {
  return ds.filter((x) => x.trangThai !== 'xong').length;
}
