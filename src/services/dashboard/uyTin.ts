/**
 * ============================================================
 * ĐIỂM UY TÍN — phần TÍNH TOÁN thuần
 * ============================================================
 *
 * Tách khỏi tầng chạm DB có chủ ý: công thức tính điểm là thứ sẽ bị
 * tranh cãi và chỉnh đi chỉnh lại, nên nó phải kiểm được bằng một
 * phép kiểm chạy trong 5ms, không cần Postgres.
 *
 * ─── Vì sao là "khó × quan trọng" ───
 * Người dùng đặt yêu cầu: trượt thì trừ **1–9**. Tích của hai thang
 * 1–3 cho ra đúng 1..9, và nó có tính chất đúng: một việc KHÓ nhưng
 * không quan trọng (3×1=3) bị phạt nhẹ hơn một việc dễ mà tối quan
 * trọng (1×3=3 — ngang nhau) và nhẹ hơn hẳn việc vừa khó vừa quan
 * trọng (3×3=9). Cộng hai thang lại (3+3=6) thì không tách được các
 * ca này ra.
 */

/** Điểm khởi đầu. Người dùng bắt đầu ở mức được tin tưởng ĐẦY ĐỦ. */
export const UY_TIN_DAU = 100;

/**
 * Trần điểm CỘNG mỗi ngày.
 *
 * Thiếu trần này thì cách tối ưu để có uy tín cao là tạo 50 việc vặt
 * lúc 23h rồi tích hết — và con số thành thước đo khả năng bấm chuột.
 */
export const TRAN_CONG_NGAY = 10;

/** Việc cũ chưa ai chọn khó/quan trọng thì coi như "vừa". */
const MAC_DINH = 2;

/** Kẹp về 1..3. `0` (chưa chọn) thành 2, không thành 0. */
function thang(n: number | null | undefined): number {
  if (!n || n <= 0) return MAC_DINH;
  return Math.min(3, Math.round(n));
}

/**
 * TRỪ khi trượt hẳn: 1..9.
 *
 * ⚠️ Không bao giờ trả 0. Trượt mà không mất gì thì cả hệ thống này
 * chỉ là trang trí — và đó chính là ca "việc cũ chưa chọn mức khó",
 * ca đông nhất ngay sau khi tính năng lên.
 */
export function mucTru(doKho: number | null | undefined, quanTrong: number | null | undefined): number {
  return thang(doKho) * thang(quanTrong);
}

/**
 * TRỪ khi xong TRỄ: một nửa mức trượt, làm tròn XUỐNG → 0..4.
 *
 * Vì sao không phạt bằng nhau: nhị phân đạt/trượt dạy người dùng rằng
 * việc đã quá giờ thì bỏ luôn cũng thế — mà đó là hành vi tệ nhất
 * trong tất cả. Làm trễ vẫn hơn không làm, và điểm phải nói ra điều đó.
 *
 * ⚠️ Làm tròn XUỐNG, không phải lên — và phép kiểm bắt được đúng chỗ
 * này. Làm tròn lên thì `mucTru(1,1) = 1` và `ceil(1/2) = 1`: việc DỄ
 * NHẤT mà trễ bị phạt NGANG trượt hẳn, tức là đúng cái động cơ lệch
 * mà hàm này sinh ra để chặn. Làm tròn xuống thì trễ luôn nhẹ hơn
 * trượt ở MỌI mức.
 *
 * Hệ quả: việc dễ + không quan trọng mà trễ thì KHÔNG mất điểm. Đó là
 * đúng, không phải lỗ hổng — nó vẫn mất 1 điểm nếu bỏ hẳn không làm.
 * Quy tắc "không bao giờ miễn phí" áp cho TRƯỢT, không áp cho TRỄ.
 */
export function mucTruTre(doKho: number | null | undefined, quanTrong: number | null | undefined): number {
  return Math.floor(mucTru(doKho, quanTrong) / 2);
}

/**
 * CỘNG khi xong đúng hạn: 1..3.
 *
 * Bất đối xứng với mức trừ (tối đa 9) là CÓ CHỦ Ý: uy tín xây thì
 * chậm, mất thì nhanh. Cho cộng ngang trừ thì một tuần chăm chỉ xoá
 * sạch một tuần bê trễ, và con số không còn trí nhớ.
 */
export function mucCong(doKho: number | null | undefined, quanTrong: number | null | undefined): number {
  return Math.max(1, Math.round(mucTru(doKho, quanTrong) / 3));
}

export interface Bac {
  ma: 'xuatSac' | 'tot' | 'kha' | 'canCoGang' | 'baoDong' | 'no';
  ten: string;
  mau: string;
  mo: string;
}

/**
 * Bậc uy tín. Một con số trần trụi ("83") không nói lên điều gì —
 * 83 là tốt hay tệ? Bậc trả lời câu đó mà không bắt người dùng học
 * thang điểm.
 */
export function bacUyTin(diem: number): Bac {
  if (diem >= 120) return { ma: 'xuatSac', ten: 'Xuất sắc', mau: '#22c55e', mo: 'Giữ lời gần như tuyệt đối.' };
  if (diem >= 100) return { ma: 'tot', ten: 'Tốt', mau: '#4ade80', mo: 'Đúng hẹn là thói quen.' };
  if (diem >= 80) return { ma: 'kha', ten: 'Khá', mau: '#facc15', mo: 'Vài việc trôi, chưa thành vấn đề.' };
  if (diem >= 50) return { ma: 'canCoGang', ten: 'Cần cố gắng', mau: '#fb923c', mo: 'Đang hụt hơi — bớt việc lại.' };
  if (diem >= 0) return { ma: 'baoDong', ten: 'Báo động', mau: '#ef4444', mo: 'Kế hoạch đang xa thực tế.' };
  return { ma: 'no', ten: 'Nợ uy tín', mau: '#b91c1c', mo: 'Dựng lại từ vài việc nhỏ, làm cho xong.' };
}

/**
 * Áp trần cộng trong ngày.
 *
 * Trả về phần điểm THẬT SỰ được cộng sau khi trừ đi phần đã cộng hôm
 * nay. `ngay` đổi ⇒ bộ đếm về 0.
 */
export function congCoTran(
  muon: number,
  daCongHomNay: number,
  tran: number = TRAN_CONG_NGAY,
): number {
  if (muon <= 0) return 0;
  const con = Math.max(0, tran - Math.max(0, daCongHomNay));
  return Math.min(muon, con);
}

/**
 * Số điểm THẬT SỰ được áp, sau khi cân nhắc trần ngày.
 *
 * ⚠️ `hoanTac` (trả lại điểm đã trừ) KHÔNG chịu trần — lỗi này tìm ra
 * bằng cách CHẠY chứ không phải đọc. Trần sinh ra để chặn cày điểm
 * MỚI; trả lại thứ đã lấy đi không phải cày. Để trần ăn cả phần hoàn
 * thì dời một việc đã trượt sinh ra trạng thái mâu thuẫn hẳn hoi: hồ
 * sơ việc nói "chưa từng bị trừ" mà điểm thì đã mất, không lấy lại được.
 *
 * Không có đường lạm dụng: muốn hoàn thì trước đó phải bị TRỪ đúng
 * ngần ấy, nên cộng dồn không bao giờ dương.
 */
export function thucCong(
  delta: number,
  hoanTac: boolean,
  daCong: number,
  tran: number = TRAN_CONG_NGAY,
): number {
  if (delta <= 0) return delta;
  if (hoanTac) return delta;
  return congCoTran(delta, daCong, tran);
}

/**
 * Mốc thời gian một việc HẾT GIỜ.
 *
 * Ưu tiên `dueAt` (hạn chót người dùng đặt). Không có hạn thì suy ra
 * từ `batDauAt + phutLam` — người đặt "14:00, làm 90 phút" đã ngầm
 * nói hạn là 15:30, bắt họ gõ lại lần nữa là thừa.
 *
 * `null` = việc KHÔNG có mốc hết giờ ⇒ không bao giờ tự đánh trượt.
 * Đây là lối thoát quan trọng: việc không hẹn giờ thì không thể trễ.
 */
export function mocHetGio(t: {
  dueAt?: Date | string | null;
  batDauAt?: Date | string | null;
  phutLam?: number | null;
}): Date | null {
  if (t.dueAt) {
    const d = new Date(t.dueAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (t.batDauAt && t.phutLam && t.phutLam > 0) {
    const d = new Date(t.batDauAt);
    if (!Number.isNaN(d.getTime())) return new Date(d.getTime() + t.phutLam * 60_000);
  }
  return null;
}

/** Cảnh báo "sắp hết giờ" bắn trước mốc hết giờ ngần này. */
export const TRUOC_HET_GIO_PHUT = 15;

export function cauSapHetGio(ten: string): string {
  return `Bạn sắp hết giờ cho "${ten}" — bạn làm việc xong chưa, còn chấm điểm danh.`;
}

export function cauTruot(ten: string, tru: number): string {
  return `Hết giờ mà "${ten}" chưa được tích xong nên bị tính là trượt (−${tru} uy tín). `
    + 'Tích xong muộn vẫn được hoàn lại một nửa.';
}
