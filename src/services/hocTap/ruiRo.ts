/**
 * TỶ LỆ TRƯỢT — hàm thuần, không gọi DB, không gọi AI.
 *
 * Người dùng chốt 02/10/2026: con số do MÃ tính theo công thức cố định, AI chỉ
 * diễn đạt lời cảnh báo. Lý do: một con số nhảy lung tung giữa hai lần mở trang
 * thì không ai sợ nó nữa — và nỗi sợ đó chính là thứ họ muốn mục này tạo ra.
 *
 * Mốc so sánh là LỊCH, không phải danh sách việc. Nếu so với "các việc đã tới
 * hạn" thì vừa bấm "AI soạn kế hoạch" (việc bù đều có hạn ở tương lai) là tỷ lệ
 * tụt về 5% dù người học chưa làm gì — đúng ngược với sự thật. Nên:
 *   kỳ vọng = tuần đã qua ÷ tuần thi      (đến tuần thi phải xong 100% kế hoạch)
 *   thực tế = trọng số việc ĐẠT ÷ tổng trọng số kế hoạch
 *
 * Kiểm bằng `ruiRo.test.ts`, gồm cả ví dụ người dùng đưa: tuần 4 chưa học gì ⇒ ~40%.
 */

export type TrangThaiViec = 'CHUA_LAM' | 'DANG_LAM' | 'CHO_CHAM' | 'DAT' | 'CHUA_DAT';
export type MucDo = 'xanh' | 'vang' | 'cam' | 'do';

export interface ViecTinh {
  trongSo: number;
  hanChot: Date;
  trangThai: string;
  loai: string;
  diem: number | null;
  /** Số lần nộp sau khi hết thời lượng bấm giờ. */
  soLanTre: number;
  /** Đã từng bỏ lỡ giờ học đã xếp (quá 15' chưa bấm Bắt đầu). Tuỳ chọn để mã cũ khỏi vỡ. */
  boLo?: boolean;
}

export interface KetQuaRuiRo {
  tyLe: number;        // 1..99
  mucDo: MucDo;
  tienDo: number;      // % kế hoạch đã ĐẠT
  kyVong: number;      // % đáng lẽ phải xong theo lịch
  quaHan: number;      // số việc quá hạn chưa đạt
  nopTre: number;      // tổng lần nộp trễ giờ
  boLo: number;        // số việc từng bị bỏ lỡ giờ học
  diemLuyenTB: number | null; // điểm TB các bài luyện QUIZ/PE/FE đã chấm
  lyDo: string[];      // từng thành phần cộng vào, để giao diện giải thích
}

const LOAI_LUYEN_DE = new Set(['QUIZ', 'PE', 'FE']);

export function mucDoCua(tyLe: number): MucDo {
  if (tyLe < 15) return 'xanh';
  if (tyLe < 30) return 'vang';
  if (tyLe < 50) return 'cam';
  return 'do';
}

/** Số tuần (thập phân) đã trôi qua kể từ thứ Hai tuần 1, kẹp trong [0, soTuan]. */
export function tuanDaQua(batDau: Date, soTuan: number, now: Date): number {
  const t = (now.getTime() - batDau.getTime()) / (7 * 86_400_000);
  return Math.min(Math.max(t, 0), soTuan);
}

/** Tuần hiện tại kiểu người nói: "tuần 4" (1-based). */
export function tuanHienTai(batDau: Date, soTuan: number, now: Date): number {
  return Math.min(Math.floor(tuanDaQua(batDau, soTuan, now)) + 1, soTuan);
}

export function tinhRuiRoMon(viec: ViecTinh[], tuanQua: number, tuanThi: number, now: Date): KetQuaRuiRo {
  const lyDo: string[] = [];
  const tong = viec.reduce((s, v) => s + Math.max(1, v.trongSo), 0);
  const dat = viec.filter((v) => v.trangThai === 'DAT').reduce((s, v) => s + Math.max(1, v.trongSo), 0);
  const thucTe = tong > 0 ? dat / tong : 0;
  const kyVong = Math.min(1, tuanThi > 0 ? tuanQua / tuanThi : 1);
  const tre = Math.max(0, kyVong - thucTe);
  // Càng gần tuần thi, cùng một khoảng chậm càng nguy hiểm: còn ít thời gian bù.
  const gap = 1 + Math.min(1, tuanThi > 0 ? tuanQua / tuanThi : 1);

  let tyLe = 5;
  const phanCham = 70 * tre * gap;
  if (phanCham >= 0.5) lyDo.push(`Chậm ${Math.round(tre * 100)}% so với lịch (đáng lẽ xong ${Math.round(kyVong * 100)}%, mới đạt ${Math.round(thucTe * 100)}%): +${Math.round(phanCham)}`);
  tyLe += phanCham;

  const quaHan = viec.filter((v) => v.trangThai !== 'DAT' && v.hanChot.getTime() < now.getTime()).length;
  if (quaHan > 0) {
    const c = 3 * Math.min(quaHan, 8);
    lyDo.push(`${quaHan} việc quá hạn: +${c}`);
    tyLe += c;
  }

  const nopTre = viec.reduce((s, v) => s + v.soLanTre, 0);
  if (nopTre > 0) {
    const c = 2 * Math.min(nopTre, 5);
    lyDo.push(`${nopTre} lần nộp trễ giờ đã hẹn: +${c}`);
    tyLe += c;
  }

  // Không học đúng giờ đã hẹn — người dùng yêu cầu 02/10: "lười, không làm đúng giờ" phải đẩy % lên.
  const boLo = viec.filter((v) => v.boLo).length;
  if (boLo > 0) {
    const c = 2 * Math.min(boLo, 10);
    lyDo.push(`${boLo} lần bỏ lỡ giờ học đã hẹn: +${c}`);
    tyLe += c;
  }

  const luyen = viec.filter((v) => LOAI_LUYEN_DE.has(v.loai) && v.diem !== null);
  const diemLuyenTB = luyen.length ? luyen.reduce((s, v) => s + (v.diem ?? 0), 0) / luyen.length : null;
  if (diemLuyenTB !== null && diemLuyenTB < 5) {
    const c = Math.round(Math.min(20, (5 - diemLuyenTB) * 4));
    lyDo.push(`Điểm luyện đề TB ${diemLuyenTB.toFixed(1)}/10 (dưới 5): +${c}`);
    tyLe += c;
  }

  if (viec.length === 0 && tuanQua > 0) lyDo.push('Chưa có kế hoạch học nào cho môn này');

  const kq = Math.round(Math.min(99, Math.max(1, tyLe)));
  return {
    tyLe: kq,
    mucDo: mucDoCua(kq),
    tienDo: Math.round(thucTe * 100),
    kyVong: Math.round(kyVong * 100),
    quaHan,
    nopTre,
    boLo,
    diemLuyenTB: diemLuyenTB === null ? null : Math.round(diemLuyenTB * 10) / 10,
    lyDo,
  };
}

/** Cả kỳ: trung bình các môn, nhưng không thấp hơn (môn tệ nhất − 10) —
 *  trượt MỘT môn vẫn là trượt, trung bình không được che nó đi. */
export function tinhRuiRoKy(cacMon: number[]): { tyLe: number; mucDo: MucDo } {
  if (!cacMon.length) return { tyLe: 0, mucDo: 'xanh' };
  const tb = cacMon.reduce((s, x) => s + x, 0) / cacMon.length;
  const kq = Math.round(Math.max(tb, Math.max(...cacMon) - 10));
  return { tyLe: kq, mucDo: mucDoCua(kq) };
}
