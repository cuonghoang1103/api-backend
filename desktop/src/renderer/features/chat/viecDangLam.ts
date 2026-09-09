/**
 * ============================================================
 * ODIN ĐANG LÀM GÌ — một câu, luôn có mặt trong suốt lượt chạy
 * ============================================================
 *
 * Người dùng báo 10/09/2026: *"khi nó đang làm phải hiện dòng Odin đang
 * code… chứ nãy nó không hiện làm tôi cứ tưởng nó bị ngắt lang giữa chừng"*.
 *
 * ─── VÌ SAO MÀN HÌNH TỪNG ĐỨNG IM ───
 * `dangNghi` (con quay cũ) bị TẮT ở gần như mọi sự kiện: `chu`, `toolBatDau`,
 * `tool`, và cả năm loại `xinPhep*` — xem `useAgent.ts`. Nó chỉ được bật lại ở
 * `batDau`, tức là khi luồng SSE của VÒNG SAU đã mở. Nên sau MỖI lần tool xong
 * có một khoảng mà:
 *
 *     dangChay = true   ·   dangNghi = false   ·   không dòng tool nào quay
 *
 * Khoảng đó dài đúng bằng một lượt gọi cổng, và bảng đo trong CLAUDE.md nói nó
 * là 2,4–4,7 giây cho tới mẩu chữ đầu — nhân với số vòng của một việc 30 bước.
 * Trong ngần ấy giây không có một điểm ảnh nào đổi. Không phân biệt được với
 * "kết nối đứt giữa chừng", và người dùng đã đọc nó đúng như thế.
 *
 * ─── CÁCH SỬA: MỘT THANH GHIM, KEO THEO `dangChay` ───
 * `dangChay` bật từ lúc `gui()` và chỉ tắt ở `finally` — nó phủ TRỌN lượt chạy,
 * không có kẽ hở nào. Nên thanh trạng thái bám vào `dangChay`, còn hàm này lo
 * phần "nói câu nào cho đúng việc đang xảy ra".
 *
 * ⚠️ KHÔNG BAO GIỜ NÓI "đang chạy" KHI ĐANG CHỜ NGƯỜI DÙNG. Có thẻ duyệt chưa
 * trả lời mà thanh vẫn quay là bảo người ta ngồi đợi một thứ đang đợi chính họ
 * — cùng lý do mà `useAgent` tắt con quay ở mọi nhánh `xinPhep`.
 */
import type { MucHienThi } from './useAgent';

export interface ViecHienTai {
  /** Câu hiện trên thanh. Luôn có chữ — thanh không bao giờ trống. */
  chu: string;
  /**
   * `lam` = Odin đang chạy (quay).
   * `cho` = đang chờ NGƯỜI DÙNG bấm (không quay, không đếm giây).
   */
  kieu: 'lam' | 'cho';
}

const LOAI_XIN_PHEP = new Set(['xinPhep', 'xinPhepLenh', 'xinPhepMcp', 'xinPhepGit', 'xinPhepNote']);

/** Tool có GHI xuống đĩa — sau chúng thì "đang code" là mô tả đúng. */
const TOOL_GHI = new Set([
  'edit_file', 'create_file', 'sua_nhieu_cho', 'xoa_file', 'doi_ten_file', 'ghi_file',
]);

/**
 * Một câu NGẮN nói tool đang làm gì, hiện trong lúc nó chạy.
 *
 * Tên tool (`ghi_file`, `web_tai_nhieu`) là chữ dành cho model, không phải cho
 * người. Trong lúc chờ, người dùng cần biết "đang tạo file" chứ không phải
 * "đang chạy một thứ tên là ghi_file".
 *
 * Tool lạ (MCP của người dùng cắm vào) thì trả câu chung — thà chung chung
 * còn hơn im lặng.
 */
export function viecCuaTool(ten: string): string {
  const bang: Record<string, string> = {
    read_file: 'đang đọc file…',
    list_dir: 'đang xem thư mục…',
    grep: 'đang tìm trong mã…',
    edit_file: 'đang sửa file…',
    create_file: 'đang tạo file…',
    sua_nhieu_cho: 'đang sửa nhiều chỗ…',
    xoa_file: 'đang xoá file…',
    doi_ten_file: 'đang đổi tên file…',
    run_command: 'đang chạy lệnh…',
    git_status: 'đang xem git…',
    git_diff: 'đang xem thay đổi…',
    web_mo: 'đang mở trang…',
    web_doc: 'đang đọc trang…',
    web_lien_ket: 'đang lấy danh sách liên kết…',
    web_tai: 'đang tải file…',
    web_tai_nhieu: 'đang tải cả lô file…',
    web_anh: 'đang chụp màn hình trang…',
    web_console: 'đang đọc lỗi trang…',
    doc_web: 'đang đọc trang web…',
    tim_web: 'đang tìm trên web…',
    giao_viec_phu: 'agent phụ đang làm…',
    cap_nhat_ke_hoach: 'đang cập nhật kế hoạch…',
  };
  return bang[ten] ?? (ten.startsWith('mcp__') ? 'đang gọi công cụ ngoài…' : 'đang chạy…');
}

/**
 * Suy ra câu trạng thái từ bảng ghi.
 *
 * ⚠️ CHỈ SOI LƯỢT NÀY, dừng ở mục `nguoi` gần nhất. Một thẻ duyệt bị bỏ dở
 * (người dùng bấm Dừng lúc nó đang hỏi) nằm lại vĩnh viễn với `xong` rỗng;
 * soi cả bảng thì mọi lượt SAU đó đều bị báo "đang chờ bạn duyệt" trong khi
 * chẳng còn gì để duyệt.
 */
export function viecDangLam(muc: MucHienThi[], dangNghi: boolean): ViecHienTai {
  let toolDangChay: string | null = null;
  let toolCuoi: string | null = null;

  for (let i = muc.length - 1; i >= 0; i--) {
    const m = muc[i]!;
    if (m.kieu === 'nguoi') break;            // hết lượt này

    if (LOAI_XIN_PHEP.has(m.kieu) && (m as { xong?: string }).xong === undefined) {
      return { chu: 'Đang chờ bạn duyệt — Odin dừng ở đây tới khi bạn bấm.', kieu: 'cho' };
    }
    if (m.kieu === 'tool') {
      if (m.dangChay === true) { toolDangChay ??= m.ten; }
      else { toolCuoi ??= m.ten; }
    }
  }

  if (toolDangChay) return { chu: `Odin ${viecCuaTool(toolDangChay)}`, kieu: 'lam' };

  /* Khoảng lặng giữa hai vòng: model đang nghĩ, không tool nào chạy. Nói theo
     việc VỪA XONG — nó là thứ duy nhất ta biết chắc về giai đoạn hiện tại. */
  if (toolCuoi && TOOL_GHI.has(toolCuoi)) return { chu: 'Odin đang code…', kieu: 'lam' };
  if (toolCuoi === 'run_command') return { chu: 'Odin đang xem kết quả lệnh…', kieu: 'lam' };
  if (toolCuoi) return { chu: 'Odin đang đọc mã dự án…', kieu: 'lam' };

  /* Chưa gọi tool nào. Chặng đầu agent thật sự đang ĐỌC dự án chứ không ngồi
     nghĩ suông, nên nói thế đúng hơn "đang suy nghĩ". */
  return { chu: dangNghi ? 'Odin đang đọc dự án…' : 'Odin đang chuẩn bị…', kieu: 'lam' };
}
