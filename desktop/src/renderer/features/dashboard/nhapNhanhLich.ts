/**
 * ============================================================
 * NHẬP NHANH CẢ TUẦN — một khối chữ thay vì mở biểu mẫu mười lần
 * ============================================================
 *
 *     thứ | slot | mã môn | phòng
 *     2 | 2 | SWR302 | BE-210
 *
 * ─── Vì sao KHÔNG dán thẳng bảng FAP ở đây ───
 * Đã có đường riêng cho việc đó (`docLichFAP`). Chép bảng HTML ra chữ thì
 * **mất cột**, mà cột chính là THỨ; `docLichFAP` phải đoán lại thứ từ bố cục,
 * và nó chỉ đoán được khi người dùng chép đúng cả bảng. Dạng trên bắt ghi rõ
 * thứ ngay đầu dòng — gõ nhanh hơn mà không chỗ nào phải đoán.
 *
 * Đây cũng là dạng mà phần QUÉT ẢNH đổ ra, nên hai đường vào gặp nhau ở đúng
 * một bộ luật đọc — sửa luật một lần là cả hai cùng đúng.
 */

/**
 * Khung giờ slot của FAP.
 *
 * ⚠️ BẢN SAO THỨ BA. Hai bản kia:
 *   • `src/services/lichHoc/docAnhLich.ts` → `KHUNG_SLOT` (backend, để chấm
 *     giờ cho kết quả quét ảnh)
 *   • `ios-app/.../MoHinhTongQuan.swift` → `SlotFAP.khung`
 * Ba nơi vì ba ngôn ngữ, không nơi nào import được nơi nào. Phép kiểm ở
 * `nhapNhanhLich.test.ts` ghim đúng từng con số, nên lệch là đỏ chứ không
 * trôi âm thầm sang một học kỳ lệch giờ.
 */
export const KHUNG_SLOT: Record<number, [string, string]> = {
  1: ['07:30', '09:50'],
  2: ['10:00', '12:20'],
  3: ['12:50', '15:10'],
  4: ['15:20', '17:40'],
  5: ['17:50', '20:10'],
};

export interface DongNhanh {
  /** Số dòng trong ô chữ, đếm từ 1. Để câu lỗi chỉ đúng dòng người dùng gõ. */
  so: number;
  thu: number;
  slot: number;
  mon: string;
  phong: string;
  batDau: string;
  ketThuc: string;
  /** `null` = dòng dùng được. Khác `null` thì KHÔNG cho lưu. */
  loi: string | null;
}

/**
 * Đọc khối chữ thành từng dòng, kèm câu lỗi của riêng dòng đó.
 *
 * ⚠️ Dòng hỏng vẫn được TRẢ VỀ, không bị lọc đi. Lọc thì người dùng gõ sai
 * một dòng sẽ thấy nó im lặng biến mất khỏi bản xem trước và tưởng mình gõ
 * thiếu — rồi gõ lại, rồi lại mất. Giữ lại và nói sai ở đâu.
 */
export function docNhapNhanh(chu: string): DongNhanh[] {
  const ra: DongNhanh[] = [];
  const dongs = chu.split('\n');
  for (let i = 0; i < dongs.length; i += 1) {
    const d = dongs[i]!.trim();
    // Dòng trống và dòng chú thích `#` bỏ qua hẳn — người ta hay ghi chú
    // "# kỳ hè" giữa khối, đó không phải lỗi.
    if (d === '' || d.startsWith('#')) continue;

    const r: DongNhanh = {
      so: i + 1, thu: 0, slot: 0, mon: '', phong: '', batDau: '', ketThuc: '', loi: null,
    };
    const phan = d.split('|').map((x) => x.trim());
    if (phan.length < 3) {
      r.loi = 'cần ít nhất: thứ | slot | môn';
      ra.push(r);
      continue;
    }
    /* `Number('')` là 0 và `Number('2x')` là NaN — cả hai đều phải trượt, nên
       kiểm bằng regex chứ không bằng `Number.isFinite` sau khi ép. */
    const thu = /^\d+$/.test(phan[0]!) ? Number(phan[0]) : NaN;
    if (!(thu >= 2 && thu <= 8)) {
      r.loi = 'thứ phải từ 2 đến 8';
      ra.push(r);
      continue;
    }
    const slot = /^\d+$/.test(phan[1]!) ? Number(phan[1]) : NaN;
    const khung = KHUNG_SLOT[slot];
    if (!khung) {
      r.loi = 'slot phải là 1–5';
      ra.push(r);
      continue;
    }
    r.thu = thu;
    r.slot = slot;
    [r.batDau, r.ketThuc] = khung;
    r.mon = phan[2]!;
    r.phong = phan.length > 3 ? phan[3]! : '';
    if (r.mon === '') r.loi = 'thiếu tên môn';
    ra.push(r);
  }
  return ra;
}

/** Buổi quét được từ ảnh, đúng hình dạng backend trả về. */
export interface BuoiQuet {
  thu: number;
  slot: number;
  batDau: string;
  ketThuc: string;
  monHoc: string;
  phong: string | null;
  giaoVien: string | null;
}

/**
 * Đổi kết quả quét ảnh sang đúng khuôn của ô nhập nhanh.
 *
 * Vì sao đi vòng qua CHỮ thay vì đổ thẳng vào bảng: người dùng thấy được thứ
 * AI đọc ra dưới dạng họ sửa được bằng bàn phím, và có thể quét ảnh thứ hai
 * (lịch in làm hai trang) rồi nối thêm vào. Đổ thẳng vào bảng thì hai lần
 * quét là hai lần phải dò xem dòng nào vừa mới xuất hiện.
 */
export function quetThanhChu(buoi: BuoiQuet[]): string {
  return buoi
    .map((b) => {
      const p = (b.phong ?? '').trim();
      return p === ''
        ? `${b.thu} | ${b.slot} | ${b.monHoc}`
        : `${b.thu} | ${b.slot} | ${b.monHoc} | ${p}`;
    })
    .join('\n');
}
