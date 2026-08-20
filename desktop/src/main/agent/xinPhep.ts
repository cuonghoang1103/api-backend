/**
 * ============================================================
 * MÔI GIỚI XIN PHÉP — chỗ vòng lặp agent ĐỨNG LẠI chờ người dùng
 * ============================================================
 *
 * Agent muốn ghi file hoặc chạy lệnh → main dựng thẻ (diff, hoặc chuỗi lệnh) →
 * đẩy lên giao diện → **dừng** → người dùng bấm → main mới làm thật.
 *
 * ─── VÌ SAO PHẢI DỪNG THẬT, KHÔNG PHẢI LÀM RỒI CHO HOÀN TÁC ───
 * Cách dễ viết hơn là làm trước rồi cho hoàn tác. Nhưng "hoàn tác được" và
 * "chưa xảy ra" là hai chuyện khác nhau: giữa lúc ghi và lúc bấm hoàn tác, một
 * tiến trình theo dõi (`tsc --watch`, `next dev`) đã đọc bản mới và chạy theo
 * nó. Với LỆNH thì còn tuyệt đối hơn — `npm publish` không có nút hoàn tác nào.
 *
 * ─── BA CÁCH THOÁT, TẤT CẢ ĐỀU PHẢI GIẢI PHÓNG LỜI HỨA ───
 * Người dùng trả lời · người dùng bấm Dừng · hết giờ. Thiếu bất kỳ đường nào
 * thì vòng lặp treo vĩnh viễn và app trông như chết — mà nó vẫn đang giữ một
 * lượt gọi cổng đã trả tiền.
 */

export type QuyetDinh = 'choPhep' | 'choPhepCaFile' | 'tuChoi';

export interface YeuCauXinPhep {
  id: string;
  /** 'edit_file' | 'create_file' | 'run_command' — để giao diện nói đúng việc sắp xảy ra. */
  ten: string;
  /** Đường dẫn tương đối, hoặc chuỗi lệnh — thứ hiện lên cho người dùng đọc. */
  duongDan: string;
}

interface DangCho {
  giaiPhong: (q: QuyetDinh) => void;
  dongHo: ReturnType<typeof setTimeout>;
  /** Sổ nhớ của CUỘC HỘI THOẠI đã hỏi. Xem ghi chú ở `daNhoKhoa` bên dưới. */
  soNho: Set<string>;
  /**
   * Khoá để NHỚ nếu người dùng chọn "cho phép cả …". Với file là đường dẫn,
   * với lệnh là nguyên văn chuỗi lệnh.
   *
   * ⚠️ Khoá nằm Ở ĐÂY chứ không phải do chỗ trả lời truyền vào. Bản đầu (P2)
   * nhận `duongDan` làm tham số của `traLoi()`, và `ipc/agent.ts` gọi thiếu nó
   * — nên "Cho phép cả file này" hoạt động ĐÚNG NHƯ "Cho phép": lần sửa sau
   * vẫn hỏi lại. Không có gì báo lỗi, không có gì đỏ; chỉ là một nút không làm
   * điều nó hứa. Giữ khoá trong sổ thì chỗ trả lời không thể quên nó được nữa.
   */
  khoa: string;
  /** Có được phép nhớ không. Lệnh nguy hiểm ⇒ false, dù người dùng bấm nút nhớ. */
  choNho: boolean;
}

/**
 * Hết giờ chờ. 5 phút: đủ để người dùng đọc một diff dài hoặc đi pha cà phê,
 * và ngắn hơn nhiều so với việc để một lượt treo qua đêm.
 */
const HET_GIO_MS = 5 * 60_000;

const dangCho = new Map<string, DangCho>();

/**
 * Sổ "cho phép cả …" là của TỪNG CUỘC HỘI THOẠI, không phải của cả app.
 *
 * Từ khi mở được nhiều cuộc cùng lúc, một `Set` chung nghĩa là: duyệt
 * `npm test` ở tab A thì tab B cũng tự chạy `npm test` mà người dùng chưa hề
 * nhìn thấy nó. Quyền được cấp cho MỘT việc, trong MỘT lần ngồi xuống — nó
 * không được rò sang việc khác chỉ vì hai việc tình cờ mở cùng lúc.
 *
 * Sổ do `loop.ts` giữ theo cuộc và truyền vào đây; module này không giữ trạng
 * thái chung nào nữa.
 */
export function taoSoNho(): Set<string> {
  return new Set<string>();
}

let demId = 0;

export function daChoPhepCaFile(soNho: Set<string>, khoa: string): boolean {
  return soNho.has(khoa);
}

/**
 * Hỏi người dùng. Trả về quyết định, hoặc `'tuChoi'` khi hết giờ / bị huỷ.
 *
 * `phat` là hàm đẩy sự kiện lên giao diện — truyền vào thay vì import để module
 * này không biết gì về IPC, và nhờ thế test được mà không cần dựng Electron.
 */
export function hoiNguoiDung(
  yeuCau: Omit<YeuCauXinPhep, 'id'> & { khoa?: string; choNho?: boolean; tuDuyet?: boolean },
  phat: (y: YeuCauXinPhep) => void,
  signal: AbortSignal,
  soNho: Set<string>,
): Promise<QuyetDinh> {
  const khoa = yeuCau.khoa ?? yeuCau.duongDan;
  const choNho = yeuCau.choNho !== false;

  /*
   * ─── CỬA TỰ DUYỆT — CHỈ MỘT, VÀ NẰM Ở ĐÂY ───
   *
   * Chế độ quyền của người dùng (`tuSua` / `tuSuaVaLenh`) đi vào đúng chỗ này,
   * không rải if ở từng tool. Rải ra thì thêm một tool mới là thêm một chỗ có
   * thể QUÊN hỏi — và quên ở đây nghĩa là agent sửa file mà người dùng không
   * hề thấy.
   *
   * Bên gọi chịu trách nhiệm tính `tuDuyet`. Với lệnh, nó đã loại sẵn mức
   * 'cankiem'/'nguyhiem' (xem `tuDuyetLenh` trong loop.ts) — ranh giới đó
   * không chế độ nào vượt được.
   *
   * KHÔNG ghi vào `soNho`: tự duyệt là hệ quả của chế độ ĐANG bật, và người
   * dùng hạ chế độ xuống thì lần sau phải hỏi lại. Ghi vào sổ nhớ sẽ biến một
   * lựa chọn tạm thời thành quyền vĩnh viễn của cả phiên.
   */
  if (yeuCau.tuDuyet === true) return Promise.resolve('choPhep');

  // Đã cấp quyền cho khoá này rồi ⇒ đi thẳng, không hỏi lại. Đây là thứ giữ cho
  // việc sửa mười chỗ trong cùng một file (hay chạy `npm test` mười lần trong
  // vòng lặp sửa→chạy→sửa) không thành mười lần bấm.
  if (choNho && soNho.has(khoa)) return Promise.resolve('choPhepCaFile');

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
    dangCho.set(id, { giaiPhong: ketThuc, dongHo, khoa, choNho, soNho });

    // Người dùng bấm Dừng giữa lúc thẻ duyệt đang mở ⇒ coi như từ chối. KHÔNG
    // được để treo: lượt đã bị huỷ thì không còn ai đọc kết quả nữa.
    signal.addEventListener('abort', huy, { once: true });

    phat({ id, ten: yeuCau.ten, duongDan: yeuCau.duongDan });
  });
}

/** Giao diện trả lời. `false` = không có yêu cầu nào mang id đó (đã hết giờ hoặc đã trả lời). */
export function traLoi(id: string, quyetDinh: QuyetDinh): boolean {
  const muc = dangCho.get(id);
  if (!muc) return false;
  // `choNho === false` ⇒ nút "cho phép cả …" vẫn cho lệnh/thay đổi NÀY đi, chỉ
  // là không ghi nhớ. Giao diện đã ẩn nút đó với lệnh nguy hiểm; đây là lớp
  // chặn thứ hai, phòng khi một app bị sửa vẫn gửi lên quyết định ấy.
  if (quyetDinh === 'choPhepCaFile' && muc.choNho) muc.soNho.add(muc.khoa);
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

/** Số yêu cầu đang treo — cho test và cho phép kiểm "không rò lời hứa". */
export function soDangCho(): number {
  return dangCho.size;
}
