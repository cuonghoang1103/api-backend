/**
 * ============================================================
 * GẬP / MỞ TỪNG NHÓM DỰ ÁN Ở THANH BÊN AI CODE — phần logic THUẦN
 * ============================================================
 *
 * Người dùng 26/09/2026: *"ẩn mấy cái task đi cho gọn được không? … nó show
 * all ra trông rất nhiều và rối khó phân biệt. Tôi làm project nào tôi sẽ ấn
 * nút show all task trong project đó để làm."*
 *
 * Trước bản này thanh bên xổ TOÀN BỘ việc của MỌI dự án cùng lúc. Với năm dự
 * án và vài chục việc thì cái nhãn dự án — thứ duy nhất giúp định hướng — bị
 * chìm giữa một bức tường tiêu đề na ná nhau.
 *
 * Tách ra file riêng, không có React, để kiểm được bằng vitest: luật "nhóm nào
 * mở" có bốn nguồn chồng lên nhau (đang tìm · người dùng đã bấm · nhóm ghim ·
 * nhóm chứa việc đang xem) và thứ tự ưu tiên giữa chúng chính là chỗ dễ sai.
 *
 * ─── LUẬT MẶC ĐỊNH ───
 *   - Nhóm dự án: GẬP. Mục đích cả tính năng là cho gọn.
 *   - Nhóm "Đã ghim": MỞ. Người ta ghim chính là để luôn thấy nó.
 *   - Nhóm chứa việc ĐANG XEM: MỞ — gập nó đi là người dùng mất dấu việc đang
 *     làm, đúng cảm giác "việc của tôi đâu rồi" mà app đã phải chữa mấy lần.
 * Người dùng bấm vào tiêu đề nhóm thì lựa chọn của họ THẮNG mặc định, và được
 * nhớ qua lần mở app sau.
 */

/**
 * Khoá của nhóm "Đã ghim" trong bảng nhớ.
 *
 * Bắt đầu bằng `#` vì tên dự án là TÊN THƯ MỤC — không thể rỗng, và một thư
 * mục tên đúng `#ghim` thì hiếm tới mức chấp nhận được. Dùng thẳng chữ
 * "Đã ghim" thì một dự án tên "Đã ghim" sẽ dính chung trạng thái.
 */
export const KHOA_GHIM = '#ghim';

/**
 * Trần độ dài chuỗi lưu — khớp `z.string().max(512)` của `settingValueSchema`
 * ở `shared/ipc.ts`. Vượt là main từ chối cả lệnh ghi, và người dùng thấy nhóm
 * vừa gập lại tự bung ra ở lần mở app sau mà không có lỗi nào để thấy.
 */
export const TRAN_KY_TU = 512;

/** Nhóm nào người dùng đã TỰ TAY gập/mở: `true` = mở, `false` = gập. */
export type BangNho = Record<string, boolean>;

/**
 * Đọc bảng nhớ từ setting. Mọi thứ không đúng hình dạng ⇒ bảng rỗng (tức là
 * về mặc định) — setting là file JSON trên đĩa người dùng, sửa tay được, và
 * một giá trị hỏng không được làm sập cả thanh bên.
 */
export function giaiMaBangNho(tho: unknown): BangNho {
  if (typeof tho !== 'string' || tho === '') return {};
  try {
    const v: unknown = JSON.parse(tho);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
    const ra: BangNho = {};
    for (const [k, gt] of Object.entries(v as Record<string, unknown>)) {
      if (typeof gt === 'boolean') ra[k] = gt;
    }
    return ra;
  } catch {
    return {};
  }
}

/**
 * Ghi bảng nhớ thành chuỗi vừa trần 512 ký tự.
 *
 * ⚠️ Setting chỉ nhận chuỗi/số/boolean (không nhận object), và chuỗi tối đa
 * 512 ký tự. Người có vài chục dự án sẽ vượt trần — khi đó BỎ các mục CŨ NHẤT
 * trước. Thứ tự khoá trong object chính là thứ tự bấm (xem `datMo`, nó dời
 * khoá vừa bấm xuống cuối), nên "cũ nhất" = đầu object. Mất một lựa chọn cũ
 * thì nhóm đó chỉ quay về mặc định — rẻ hơn hẳn việc mất cả bảng.
 */
export function maHoaBangNho(bang: BangNho): string {
  const muc = Object.entries(bang);
  while (muc.length > 0) {
    const s = JSON.stringify(Object.fromEntries(muc));
    if (s.length <= TRAN_KY_TU) return s;
    muc.shift();
  }
  return '{}';
}

/** Ghi lựa chọn của một nhóm, dời khoá xuống CUỐI để nó là mục "mới nhất". */
export function datMo(bang: BangNho, khoa: string, mo: boolean): BangNho {
  const ra: BangNho = { ...bang };
  delete ra[khoa];
  ra[khoa] = mo;
  return ra;
}

/** Bỏ lựa chọn đã nhớ của một nhóm ⇒ nhóm đó quay về luật mặc định. */
export function boNho(bang: BangNho, khoa: string): BangNho {
  if (!(khoa in bang)) return bang;
  const ra: BangNho = { ...bang };
  delete ra[khoa];
  return ra;
}

/** Luật mặc định, CHƯA tính lựa chọn của người dùng. */
export function moMacDinh(khoa: string, khoaDangXem: string | null): boolean {
  return khoa === KHOA_GHIM || khoa === khoaDangXem;
}

/**
 * Một nhóm có đang MỞ không — gộp cả bốn nguồn, theo đúng thứ tự ưu tiên:
 *
 *   1. ĐANG TÌM ⇒ mở, trừ khi người dùng vừa gập nó TRONG lúc tìm. Tìm ra mà
 *      kết quả nằm trong nhóm gập thì chẳng khác gì không tìm ra. Lựa chọn gập
 *      trong lúc tìm KHÔNG ghi vào bảng nhớ: xoá ô tìm là trở về đúng như cũ.
 *   2. Người dùng đã tự bấm ⇒ theo đó.
 *   3. Mặc định (`moMacDinh`).
 */
export function nhomDangMo(p: {
  khoa: string;
  khoaDangXem: string | null;
  dangTim: boolean;
  bangNho: BangNho;
  /** Nhóm bị gập/mở tay TRONG lúc tìm — sống tạm, không lưu. */
  bangKhiTim: BangNho;
}): boolean {
  if (p.dangTim) return p.bangKhiTim[p.khoa] ?? true;
  return p.bangNho[p.khoa] ?? moMacDinh(p.khoa, p.khoaDangXem);
}
