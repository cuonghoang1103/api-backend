/**
 * ============================================================
 * MÔI GIỚI XIN PHÉP — chỗ vòng lặp agent ĐỨNG LẠI chờ người dùng
 * ============================================================
 *
 * Agent gọi `edit_file` → main dựng diff → đẩy lên giao diện → **dừng** →
 * người dùng bấm → main mới ghi đĩa (hoặc không).
 *
 * ─── VÌ SAO PHẢI DỪNG THẬT, KHÔNG PHẢI HỎI RỒI GHI LUÔN ───
 * Cách dễ viết hơn là ghi trước rồi cho phép hoàn tác. Nhưng "hoàn tác được"
 * và "chưa xảy ra" là hai chuyện khác nhau: giữa lúc ghi và lúc bấm hoàn tác,
 * file đã đổi thật — một tiến trình theo dõi (`tsc --watch`, `next dev`,
 * hot reload) đã đọc bản mới và đã chạy theo nó. Với người dùng thì đó là
 * "agent tự ý sửa mã của tôi", đúng nghĩa đen.
 *
 * ─── BA CÁCH THOÁT, TẤT CẢ ĐỀU PHẢI GIẢI PHÓNG LỜI HỨA ───
 * Người dùng trả lời · người dùng bấm Dừng · hết giờ. Thiếu bất kỳ đường nào
 * thì vòng lặp treo vĩnh viễn và app trông như chết — mà nó vẫn đang giữ một
 * lượt gọi cổng đã trả tiền.
 */

export type QuyetDinh = 'choPhep' | 'choPhepCaFile' | 'tuChoi';

export interface YeuCauXinPhep {
  id: string;
  /** 'edit_file' | 'create_file' — để giao diện nói đúng việc sắp xảy ra. */
  ten: string;
  /** Đường dẫn TƯƠNG ĐỐI, để hiện lên mà không phơi cả cây thư mục. */
  duongDan: string;
}

interface DangCho {
  giaiPhong: (q: QuyetDinh) => void;
  dongHo: ReturnType<typeof setTimeout>;
}

/**
 * Hết giờ chờ. 5 phút: đủ để người dùng đọc một diff dài hoặc đi pha cà phê,
 * và ngắn hơn nhiều so với việc để một lượt treo qua đêm.
 */
const HET_GIO_MS = 5 * 60_000;

const dangCho = new Map<string, DangCho>();

/** File đã được "cho phép cả file" trong PHIÊN này. Không bao giờ ghi xuống đĩa. */
const choPhepCaFile = new Set<string>();

let demId = 0;

/** Bắt đầu một việc mới ⇒ quên hết quyền đã cấp. Quyền không được sống lâu hơn việc nó phục vụ. */
export function xoaQuyenDaCap(): void {
  choPhepCaFile.clear();
}

export function daChoPhepCaFile(duongDan: string): boolean {
  return choPhepCaFile.has(duongDan);
}

/**
 * Hỏi người dùng. Trả về quyết định, hoặc `'tuChoi'` khi hết giờ / bị huỷ.
 *
 * `phat` là hàm đẩy sự kiện lên giao diện — truyền vào thay vì import để module
 * này không biết gì về IPC, và nhờ thế test được mà không cần dựng Electron.
 */
export function hoiNguoiDung(
  yeuCau: Omit<YeuCauXinPhep, 'id'>,
  phat: (y: YeuCauXinPhep) => void,
  signal: AbortSignal,
): Promise<QuyetDinh> {
  // Đã cấp quyền cho cả file này rồi ⇒ đi thẳng, không hỏi lại. Đây là thứ giữ
  // cho việc sửa mười chỗ trong cùng một file không thành mười lần bấm.
  if (choPhepCaFile.has(yeuCau.duongDan)) return Promise.resolve('choPhepCaFile');

  const id = `xp_${++demId}`;
  return new Promise<QuyetDinh>((resolve) => {
    let xong = false;
    const ketThuc = (q: QuyetDinh): void => {
      if (xong) return;
      xong = true;
      const muc = dangCho.get(id);
      if (muc) clearTimeout(muc.dongHo);
      dangCho.delete(id);
      signal.removeEventListener('abort', huy);
      resolve(q);
    };
    function huy(): void { ketThuc('tuChoi'); }

    const dongHo = setTimeout(() => ketThuc('tuChoi'), HET_GIO_MS);
    dangCho.set(id, { giaiPhong: ketThuc, dongHo });

    // Người dùng bấm Dừng giữa lúc thẻ duyệt đang mở ⇒ coi như từ chối. KHÔNG
    // được để treo: lượt đã bị huỷ thì không còn ai đọc kết quả nữa.
    signal.addEventListener('abort', huy, { once: true });

    phat({ ...yeuCau, id });
  });
}

/** Giao diện trả lời. `false` = không có yêu cầu nào mang id đó (đã hết giờ hoặc đã trả lời). */
export function traLoi(id: string, quyetDinh: QuyetDinh, duongDan?: string): boolean {
  const muc = dangCho.get(id);
  if (!muc) return false;
  if (quyetDinh === 'choPhepCaFile' && duongDan) choPhepCaFile.add(duongDan);
  muc.giaiPhong(quyetDinh);
  return true;
}

/** Huỷ mọi yêu cầu đang treo — gọi khi bắt đầu việc mới hoặc khi app đóng. */
export function huyTatCa(): void {
  for (const [, muc] of dangCho) {
    clearTimeout(muc.dongHo);
    muc.giaiPhong('tuChoi');
  }
  dangCho.clear();
}
