/**
 * ============================================================
 * VÒNG LẶP AGENT — chạy ở MAIN process
 * ============================================================
 *
 *   renderer ──IPC──▶ main ──SSE──▶ backend ──▶ cổng LLM
 *                      │
 *                      └─ chạy tool đọc file, đẩy kết quả vào, gọi lại
 *
 * Renderer KHÔNG tham gia vòng lặp; nó chỉ nhận sự kiện để vẽ. Nếu vòng lặp
 * sống ở renderer thì mỗi kết quả tool phải qua IPC hai lần, và một lần
 * chuyển trang là mất cả phiên đang chạy dở.
 *
 * ─── BỐN GIÁ TRỊ `stop`, PHẢI XỬ LÝ ĐỦ CẢ BỐN ───
 *   'end'        xong → chờ người dùng gõ tiếp
 *   'tool_calls' chạy tool → nối kết quả → gọi lại
 *   'continue'   KHÔNG có tool nào để chạy, cứ gọi lại ngay
 *   'max_steps'  chạm trần bước → dừng hẳn
 *
 * `'continue'` là cái dễ quên nhất, và quên nó thì agent đứng im vĩnh viễn ở
 * đúng chỗ đó. Backend cố ý tách nó khỏi `'tool_calls'` chính vì bộ kiểm thử
 * đầu tiên đã dính (xem ghi chú trong `src/services/agent/turn.ts`).
 */
import { BrowserWindow } from 'electron';
import { API_ORIGIN } from '../config';
import { readStoredSession } from '../ipc/auth';
import type { KetQuaDiff } from './diff';
import { docGhiChuDuAn } from './ghiChu';
import { datTokenChoDatTen, dungLaiHienThi, luuPhien, type MucKhoiPhuc, type TinNhanLuu } from './phien';
import type { PhanLoaiLenh } from './lenh';
import { chayToolAgent, soFileDaSua } from './tools';
import { taoSoCuoc, type SoCuoc } from './so';
import { dungLenhNenCua } from './lenhNen';
import { hanMucMcp, goiToolMcp, laToolMcp, toolMcpHienCo } from './mcp';
import { hoiNguoiDung, huyTatCa, type YeuCauXinPhep } from './xinPhep';

/**
 * Trần vòng lặp phía app — LƯỚI ĐỠ, không phải chốt chặn thật.
 *
 * ⚠️ CON SỐ NÀY TỪNG LÀ 40, VÀ NÓ ĐÃ LẶNG LẼ NUỐT MẤT LỰA CHỌN CỦA NGƯỜI DÙNG.
 * Chú thích cũ ghi "rộng hơn trần bước của máy chủ (30)" — đúng vào lúc máy
 * chủ chỉ có một trần 30. Từ khi thêm sáu mức nỗ lực (18/08/2026), máy chủ đi
 * tới 260 bước ở mức Ultracode, còn app vẫn cắt ở 40 và báo "Quá 40 vòng mà
 * chưa xong". Người dùng chọn "Ultracode — 260 bước", trả tiền cho nó, rồi bị
 * dừng ở bước 40 kèm một câu trách họ hỏi rộng quá.
 *
 * Chốt chặn THẬT là trần bước của máy chủ (`TRAN_BUOC`) và hạn mức 5 giờ. Số
 * này chỉ để một lỗi vòng lặp ở app không quay mãi, nên nó phải RỘNG HƠN mọi
 * trần của máy chủ. `loop.test.ts` đọc thẳng bảng bên máy chủ và đỏ nếu hai
 * bên lệch lại lần nữa.
 */
const MAX_VONG = 320;

/** Sự kiện đẩy lên renderer. Đây là thứ giao diện vẽ. */
export type SuKienAgent =
  | { loai: 'batDau'; model: string; buoc?: number; tranBuoc?: number }
  | { loai: 'chu'; delta: string }
  /** Một tool vừa chạy xong (bất kể vòng 1 hay vòng 2) — để hiện dòng tiến trình. */
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  /** Vòng lặp ĐANG DỪNG chờ người dùng duyệt. Giao diện phải hiện thẻ diff. */
  | { loai: 'xinPhep'; id: string; ten: string; duongDan: string; taoMoi: boolean; diff: KetQuaDiff }
  /** Thẻ duyệt đã được trả lời (hoặc hết giờ) — giao diện gỡ nó đi. */
  | { loai: 'xongXinPhep'; id: string; dongY: boolean }
  | { loai: 'xinPhepLenh'; id: string; lenh: string; phanLoai: PhanLoaiLenh }
  /** Agent muốn gọi một tool MCP của bên thứ ba. LUÔN phải hỏi, không nhớ được. */
  | { loai: 'xinPhepMcp'; id: string; server: string; tool: string; args: string }
  /** Xin phép COMMIT hoặc MỞ PR. `chiTiet` là thứ người dùng phải ĐỌC trước khi bấm. */
  | { loai: 'xinPhepGit'; id: string; viec: 'commit' | 'pr'; chiTiet: string }
  /** Xin phép GHI vào sổ ghi chú. `chiTiet` là nội dung sắp ghi — người dùng phải ĐỌC. */
  | { loai: 'xinPhepNote'; id: string; viec: 'tao' | 'ghi'; chiTiet: string }
  | { loai: 'lenhRa'; mau: string }
  | { loai: 'keHoach'; viec: Array<{ ten: string; trangThai: string }> }
  | {
      loai: 'xong'; hanMuc: HanMucUi | null; tienUsd: number; daLuoc: number; soFileDaSua: number;
      nguCanh?: NguCanhUi;
    }
  | { loai: 'loi'; thongDiep: string; ma?: string }
  | { loai: 'huy' }
  /** Hội thoại ở main vừa bị xoá sạch — giao diện PHẢI dọn bảng ghi theo. */
  | { loai: 'daXoa' };

export interface NguCanhUi { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number }

export interface HanMucUi {
  daDung: number;
  tran: number;
  phanTram: number;
  hoiLucNao: string | null;
}

type KhoiNoiDung =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

interface TinNhan {
  role: 'user' | 'assistant' | 'tool';
  content?: string | KhoiNoiDung[] | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface BoiCanh {
  /** Thư mục dự án, hoặc null nếu chưa chọn. */
  goc: string | null;
  nhanh?: string;
  /** Người dùng đã bật chế độ cho sửa file chưa. Mặc định KHÔNG. */
  choSua?: boolean;
  /** Người dùng đã bật chế độ cho chạy lệnh chưa. Mặc định KHÔNG. */
  choChayLenh?: boolean;
  /** Cho agent LÁI trình duyệt trong app (mở/đọc/console + bấm/gõ có duyệt). */
  choTrinhDuyet?: boolean;
  /** Cho phép GHI vào sổ ghi chú trên cuongthai.com. Độc lập với thư mục dự án. */
  choGhiNote?: boolean;
  /** 'nhanh' | 'canBang' | 'ky'. Quyết định trần bước ở máy chủ. */
  mucNoLuc?: string;
  model?: string;
  /** Ảnh dán kèm câu hỏi này (data URI). */
  anh?: string[];
}

/**
 * Hội thoại sống trong main, không phải renderer.
 *
 * Renderer chỉ giữ bản để HIỂN THỊ. Hai bản này khác nhau: bản dưới đây mang
 * `tool_calls` và `tool_call_id` — thứ giao thức cần nhưng người dùng không
 * bao giờ nhìn thấy.
 */
/**
 * MỘT CUỘC HỘI THOẠI đang mở.
 *
 * Trước khi có nhiều tab, tất cả những thứ dưới đây là biến module. Đúng khi
 * chỉ có một cuộc, và sai CÂM LẶNG ngay khi có hai: lượt đang chạy ở tab A ghi
 * kết quả vào hội thoại mà tab B vừa chuyển sang, nút Hoàn tác lùi nhầm file,
 * quyền cấp ở tab này tự áp cho tab kia.
 */
/**
 * Trần việc phụ cho MỘT câu hỏi của người dùng.
 *
 * 3 là con số cân giữa "đủ để dò song song" và "đủ rẻ". Mỗi việc phụ là một
 * hội thoại riêng phải trả tiền riêng: đo được một việc phụ 10 bước tốn cỡ
 * 60–90k token ≈ 0,1 $. Ba cái là ~0,3 $ cộng thêm vào câu hỏi — bằng cả một
 * việc thường. Cho phép nhiều hơn thì một câu hỏi có thể tốn hơn cả buổi làm.
 */
/**
 * Trần agent phụ THEO MỨC NỖ LỰC — phải khớp `TRAN_VIEC_PHU` ở máy chủ
 * (`src/services/agent/turn.ts`). Trần thật nằm ở đây vì `giao_viec_phu` là
 * tool vòng CLIENT: máy chủ chỉ mô tả nó, còn người đếm là app.
 */
const TRAN_VIEC_PHU: Record<string, number> = {
  thap: 1, vua: 3, cao: 3, ratCao: 5, toiDa: 6, ultracode: 10,
  // tên cũ, phòng khi thiết đặt trên đĩa chưa được đổi
  nhanh: 1, canBang: 3, ky: 3,
};
const MAX_VIEC_PHU_MAC_DINH = 3;

function tranViecPhu(muc: string | undefined): number {
  return (muc && TRAN_VIEC_PHU[muc]) || MAX_VIEC_PHU_MAC_DINH;
}

interface CuocHoiThoai {
  /** Id của TAB. Ổn định suốt đời tab — React key theo nó, đổi là remount. */
  id: string;
  /**
   * Id của PHIÊN trên đĩa. Tách khỏi `id` có chủ ý.
   *
   * Mở một phiên cũ vào tab đang có thì tab KHÔNG được đổi id: `key={id}` ở
   * renderer khiến React remount component và xoá sạch bảng ghi vừa nạp — đúng
   * lỗi đã dính khi thêm nhiều tab. Nên tab giữ id của nó, chỉ đổi chỗ nó ghi
   * xuống đĩa.
   */
  phienId: string;
  hoiThoai: TinNhan[];
  duAn: string | null;
  /**
   * Thư mục dự án CỦA RIÊNG CUỘC NÀY.
   *
   * ⚠️ Trước 17/08 đây là một cài đặt TOÀN APP, nên mọi tab dùng chung một thư
   * mục — "tab A làm project A, tab B làm project B" là chuyện không thể, dù
   * giao diện có nhiều tab. Chuyển vào đây là thứ làm nó thành thật.
   *
   * ⛔ Renderer vẫn KHÔNG truyền được đường dẫn: nó chỉ gửi `cuocId`, còn đường
   * dẫn do main nhận từ hộp thoại hệ thống. Đây là phạm vi đọc của một mô hình
   * ngôn ngữ; nó phải đến từ một cú bấm người dùng NHÌN THẤY.
   */
  goc: string | null;
  /**
   * Người dùng đã TỰ QUYẾT thư mục cho cuộc này chưa (kể cả quyết định là "bỏ").
   *
   * ⚠️ Không có cờ này thì "chưa chọn gì" và "đã cố ý bỏ" trông giống hệt nhau
   * (`goc === null`), nên lần hỏi ngay sau khi bấm ✕ sẽ TỰ ĐIỀN LẠI thư mục mặc
   * định — nút Bỏ trông như không làm gì. Bộ kiểm bắt đúng lỗi này.
   */
  daChonGoc: boolean;
  /** Quyền SỬA của riêng cuộc này. KHÔNG lưu xuống đĩa, KHÔNG kế thừa sang tab mới. */
  choSua: boolean;
  /** Quyền CHẠY LỆNH của riêng cuộc này. Cũng chỉ trong RAM, cũng bật riêng. */
  choChayLenh: boolean;
  /**
   * Cho phép GHI vào sổ ghi chú.
   *
   * Công tắc RIÊNG, không đi ké `choSua`: ghi chú không nằm trong thư mục dự án
   * (người dùng có thể muốn agent ghi chú mà chẳng mở dự án mã nào), và hỏng
   * thì không có `git checkout` nào lấy lại — đó là dữ liệu thật trên máy chủ.
   */
  choGhiNote: boolean;
  choTrinhDuyet: boolean;
  dangChay: AbortController | null;
  so: SoCuoc;
  /** Việc phụ đã giao trong LƯỢT hiện tại. Đặt lại về 0 ở đầu mỗi câu hỏi. */
  soViecPhu: number;
}

const cuoc = new Map<string, CuocHoiThoai>();

function layCuoc(id: string): CuocHoiThoai {
  let c = cuoc.get(id);
  if (!c) {
    c = {
      id, phienId: id, hoiThoai: [], duAn: null, dangChay: null, so: taoSoCuoc(), soViecPhu: 0,
      goc: null, daChonGoc: false, choSua: false, choChayLenh: false, choGhiNote: false,
      choTrinhDuyet: false,
    };
    cuoc.set(id, c);
  }
  return c;
}

/** Sinh id cho một cuộc mới. Cũng chính là id phiên lưu xuống đĩa. */
export function taoCuoc(): string {
  const id = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
  layCuoc(id);
  return id;
}

/**
 * Xoá nội dung MỌI cuộc đang mở.
 *
 * ⚠️ Từ khi mỗi tab có thư mục riêng, đổi thư mục KHÔNG còn được gọi hàm này —
 * nó chỉ làm hỏng bối cảnh của đúng MỘT tab, và xoá luôn việc của các tab khác
 * đang làm dự án khác là mất dữ liệu của người dùng. Giữ lại cho những trường
 * hợp thật sự toàn cục (đăng xuất chẳng hạn).
 */
export function xoaMoiCuoc(): void {
  for (const [id] of cuoc) xoaHoiThoai(id);
}

// ─── Thư mục & quyền: của TỪNG cuộc ────────────────────────────────

export function gocCuaCuoc(id: string): string | null {
  return layCuoc(id).goc;
}

/** Người dùng đã tự quyết thư mục cho cuộc này chưa (kể cả quyết định "bỏ"). */
export function daChonGocCua(id: string): boolean {
  return layCuoc(id).daChonGoc;
}

export function quyenCuaCuoc(id: string): {
  choSua: boolean; choChayLenh: boolean; choGhiNote: boolean; choTrinhDuyet: boolean;
} {
  const c = layCuoc(id);
  return {
    choSua: c.choSua, choChayLenh: c.choChayLenh,
    choGhiNote: c.choGhiNote, choTrinhDuyet: c.choTrinhDuyet,
  };
}

/**
 * Đặt thư mục dự án cho MỘT cuộc.
 *
 * Đổi thư mục ⇒ xoá hội thoại CỦA CUỘC ĐÓ: những gì agent đã đọc ở dự án cũ
 * không còn đúng, và để lại thì nó trả lời về một dự án không còn mở. Nhưng chỉ
 * cuộc đó — các tab khác đang làm dự án khác không liên quan gì.
 *
 * Quyền bị TẮT theo. Quyền được cấp cho một phạm vi cụ thể; đổi phạm vi mà giữ
 * quyền nghĩa là người dùng cấp quyền ghi cho thư mục A rồi bỗng nhiên agent
 * ghi được vào thư mục B mà không ai bấm gì.
 */
export function datGocChoCuoc(id: string, goc: string | null): void {
  const c = layCuoc(id);
  // Đổi thư mục ⇒ lệnh nền cũ đang chạy trong thư mục CŨ. Giữ lại thì agent đọc
  // đầu ra của một dev server thuộc dự án khác và kết luận về dự án này.
  if (c.goc !== goc) dungLenhNenCua(id);
  // Đánh dấu ĐÃ QUYẾT dù giá trị có đổi hay không — bấm ✕ trên một tab chưa
  // chọn gì vẫn là một quyết định ("tab này không đọc dự án nào").
  c.daChonGoc = true;
  if (c.goc === goc) return;
  c.goc = goc;
  c.choSua = false;
  c.choChayLenh = false;
  c.choGhiNote = false;
  xoaHoiThoai(id);
}

/**
 * Gán thư mục cho một cuộc CHƯA CÓ thư mục nào — KHÔNG xoá hội thoại.
 *
 * ⚠️ Tách khỏi `datGocChoCuoc` vì một cái bẫy thật: tab mới lấy thư mục mặc
 * định ở lần hỏi đầu, và nếu đường đó đi qua `datGocChoCuoc` thì nó XOÁ hội
 * thoại. Với tab trống thì vô hại; với một tab vừa MỞ LẠI PHIÊN CŨ thì nó xoá
 * sạch việc vừa nạp — mất dữ liệu vì một lời gọi chỉ định đọc trạng thái.
 *
 * "Điền giá trị mặc định cho chỗ đang trống" không phải là "đổi bối cảnh", nên
 * nó không được mang theo hậu quả của việc đổi bối cảnh.
 */
export function datGocNeuChuaCo(id: string, goc: string): void {
  const c = layCuoc(id);
  if (c.daChonGoc || c.goc) return;
  c.goc = goc;
}

export function datQuyenChoCuoc(id: string, quyen: { choSua?: boolean; choChayLenh?: boolean; choGhiNote?: boolean; choTrinhDuyet?: boolean }): void {
  const c = layCuoc(id);
  if (typeof quyen.choSua === 'boolean') c.choSua = quyen.choSua;
  if (typeof quyen.choChayLenh === 'boolean') c.choChayLenh = quyen.choChayLenh;
  if (typeof quyen.choTrinhDuyet === 'boolean') c.choTrinhDuyet = quyen.choTrinhDuyet;
  if (typeof quyen.choGhiNote === 'boolean') c.choGhiNote = quyen.choGhiNote;
}

export function dongCuoc(id: string): void {
  huyLuotCua(id);
  // Dọn lệnh nền của cuộc này. Không dọn thì đóng tab để lại một `next dev` ăn
  // CPU mãi mãi mà không còn giao diện nào nhắc tới nó.
  dungLenhNenCua(id);
  cuoc.delete(id);
}

/** Nạp một phiên cũ thành một cuộc đang mở. Gõ tiếp là đi tiếp việc đó. */
export function napPhien(
  cuocId: string,
  phienId: string,
  tinNhan: TinNhanLuu[],
  duAn: string | null,
  goc?: string | null,
): void {
  const c = layCuoc(cuocId);
  huyLuotCua(cuocId);
  c.phienId = phienId;
  c.hoiThoai = tinNhan as TinNhan[];
  c.duAn = duAn;
  // Khôi phục cả THƯ MỤC của phiên đó. Từ khi mỗi tab một dự án, mở một việc cũ
  // vào tab đang trỏ dự án khác thì agent đọc nhầm repo và trả lời rất tự tin
  // về những file không liên quan gì.
  // Đổi thư mục ⇒ thu hồi quyền trên FILE và LỆNH (chúng gắn với thư mục cũ).
  // `choGhiNote` KHÔNG bị thu hồi: sổ ghi chú không nằm trong thư mục nào cả,
  // nên tắt nó ở đây chỉ là bắt người dùng bật lại một thứ không hề đổi.
  if (goc !== undefined) { c.goc = goc; c.daChonGoc = true; c.choSua = false; c.choChayLenh = false; }
  // Quyền đã cấp và nhật ký hoàn tác KHÔNG khôi phục theo. Hoàn tác một thay
  // đổi từ hôm qua là ghi đè lên thứ người dùng có thể đã sửa tiếp bằng tay; và
  // quyền "cho phép cả file này" cấp cho phiên trước thì hết hiệu lực cùng
  // phiên đó — mở lại là một lần ngồi xuống mới.
  c.so = taoSoCuoc();
}

export function soCuaCuoc(id: string): SoCuoc {
  return layCuoc(id).so;
}

/**
 * Các cuộc ĐANG MỞ, để renderer dựng lại thanh tab.
 *
 * ⚠️ Đây là thứ vá lỗi mất việc khi rời trang. Renderer bị THÁO HẲN mỗi lần
 * người dùng bấm sang Ghi chú rồi quay lại (`App.tsx` đổi component theo route),
 * nên mọi `useState` của nó biến mất — kể cả danh sách tab. Bản trước thấy 0
 * tab liền TẠO MỘT CUỘC MỚI RỖNG, và người dùng nhìn thấy đúng cảnh việc đang
 * làm dở biến mất không dấu vết.
 *
 * Main mới là nơi hội thoại thật sự sống. Renderer hỏi lại nó lúc gắn, thay vì
 * tự nhớ — nhớ hai nơi thì sẽ có ngày lệch, mà lệch ở đây nghĩa là mất việc.
 */
export interface TomTatCuoc {
  id: string;
  tieuDe: string;
  dangChay: boolean;
}

export function dsCuocDangMo(): TomTatCuoc[] {
  const ra: TomTatCuoc[] = [];
  for (const [, c] of cuoc) {
    const dau = c.hoiThoai.find((m) => m.role === 'user');
    const noi = Array.isArray(dau?.content)
      ? dau.content.filter((k) => k.type === 'text').map((k) => String((k as { text?: unknown }).text ?? '')).join(' ')
      : String(dau?.content ?? '');
    ra.push({
      id: c.id,
      tieuDe: noi.trim().replace(/\s+/g, ' ').slice(0, 40) || 'Việc mới',
      dangChay: c.dangChay !== null,
    });
  }
  return ra;
}

/** Bảng ghi của một cuộc, dựng lại từ bản giao thức. */
export function bangGhiCua(id: string): MucKhoiPhuc[] {
  return dungLaiHienThi(layCuoc(id).hoiThoai as TinNhanLuu[]);
}

export function soFileDaSuaCua(id: string): number {
  return soFileDaSua(layCuoc(id).so);
}

/** Có cuộc nào đang chạy không — dùng để chặn đổi quyền giữa chừng. */
export function coCuocDangChay(): boolean {
  for (const [, c] of cuoc) if (c.dangChay) return true;
  return false;
}

export function cuocDangChay(id: string): boolean {
  return layCuoc(id).dangChay !== null;
}

/** Xoá nội dung một cuộc nhưng giữ nó mở (nút "việc mới" trong cùng tab). */
/**
 * Báo cho MỌI cửa sổ biết một cuộc vừa bị xoá sạch.
 *
 * ⚠️ Không có bước này thì màn hình NÓI DỐI. Hội thoại ở main bị xoá bởi những
 * đường người dùng không nghĩ là "xoá": đổi thư mục dự án, chuyển worktree, bỏ
 * thư mục. Renderer không hay biết nên nó tiếp tục vẽ nguyên bảng ghi cũ — người
 * dùng đọc thấy một cuộc trò chuyện mà agent đã quên hoàn toàn, rồi hỏi tiếp
 * dựa trên nó và nhận về câu trả lời như người mất trí nhớ.
 *
 * Phát hiện 17/08/2026 khi làm Quay lui: màn hình 5 câu hỏi, main 0 câu.
 */
function baoDaXoa(id: string): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send('agent:event', { cuocId: id, loai: 'daXoa' });
  }
}

export function xoaHoiThoai(id: string): void {
  const c = layCuoc(id);
  huyLuotCua(id);
  c.hoiThoai = [];
  c.duAn = null;
  // Việc mới trong cùng tab ⇒ phiên mới. Giữ `phienId` cũ là ghi đè lên việc
  // trước bằng một hội thoại rỗng.
  c.phienId = c.id;
  // Bắt đầu việc mới ⇒ quên quyền đã cấp và quên nhật ký hoàn tác. Quyền
  // "cho phép cả file này" được cấp cho MỘT việc, không phải cấp vĩnh viễn;
  // và giữ nhật ký cũ lại thì nút Hoàn tác sẽ lùi cả những thay đổi thuộc
  // việc trước mà người dùng đã chấp nhận xong xuôi.
  c.so = taoSoCuoc();
  baoDaXoa(id);
}

/**
 * ============================================================
 * QUAY LUI — bỏ hội thoại từ một câu hỏi trở đi
 * ============================================================
 *
 * Dùng khi agent đi sai hướng: thay vì gõ thêm "không, ý tôi là…" (câu đó nằm
 * LẠI trong ngữ cảnh và vẫn kéo model theo hướng cũ), người dùng lùi về đúng
 * chỗ rẽ nhầm rồi hỏi lại cho khác.
 *
 * ─── ĐỊNH VỊ BẰNG THỨ TỰ CÂU HỎI, KHÔNG BẰNG CHỈ SỐ MẢNG ───
 * Bản hiển thị và bản giao thức KHÔNG cùng độ dài: một lượt sinh ra nhiều tin
 * nhắn giao thức (assistant + n tin `tool`) nhưng có thể chỉ vài dòng trên màn
 * hình, và ngược lại có những dòng chỉ tồn tại ở giao diện. Chỉ số mảng vì thế
 * không dịch được giữa hai bên.
 *
 * Thứ CHẮC CHẮN khớp là THỨ TỰ CÂU HỎI CỦA NGƯỜI DÙNG: câu thứ k ở màn hình
 * đúng là câu thứ k trong giao thức. Nên tham số là `k`, không phải chỉ số.
 *
 * ⚠️ KHÔNG đụng tới FILE. Quay lui bỏ phần hội thoại, không hoàn tác những gì
 * agent đã ghi lên đĩa — người dùng đã DUYỆT từng thay đổi đó, và lặng lẽ lùi
 * chúng là xoá việc họ đã đồng ý. Muốn lùi file thì có nút Hoàn tác riêng, và
 * giao diện phải nói rõ hai thứ này khác nhau.
 */
export interface KetQuaQuayLui {
  ok: boolean;
  loi?: string;
  /** Nguyên văn câu hỏi vừa bị bỏ — giao diện đặt lại vào ô soạn để sửa và gửi lại. */
  cauHoi?: string;
  /** Có thay đổi file nào xảy ra trong phần bị bỏ không — để cảnh báo. */
  coSuaFile?: boolean;
}

export function quayLui(cuocId: string, k: number): KetQuaQuayLui {
  const c = layCuoc(cuocId);
  if (c.dangChay) return { ok: false, loi: 'Việc này đang chạy dở — hãy dừng nó trước.' };

  const viTri: number[] = [];
  c.hoiThoai.forEach((m, i) => { if (m.role === 'user') viTri.push(i); });
  if (k < 1 || k > viTri.length) {
    return { ok: false, loi: `Không có câu hỏi thứ ${k} (hội thoại có ${viTri.length} câu).` };
  }

  const cat = viTri[k - 1]!;
  const boDi = c.hoiThoai.slice(cat);

  // Lượt có ảnh mang `content` là MẢNG khối; lấy phần chữ để trả lại ô soạn.
  const dau = c.hoiThoai[cat]!;
  const cauHoi = Array.isArray(dau.content)
    ? dau.content.filter((x) => x.type === 'text').map((x) => x.text).join(' ')
    : String(dau.content ?? '');

  // Có tool ghi nào trong phần sắp bỏ không. Kiểm bằng tên tool trong
  // `tool_calls` — đó là bản ghi trung thực nhất về việc đã thật sự xảy ra.
  const TOOL_GHI = new Set(['edit_file', 'create_file', 'run_command', 'chay_lenh_nen', 'git_commit', 'tao_pr']);
  const coSuaFile = boDi.some((m) => m.role === 'assistant'
    && (m.tool_calls ?? []).some((t) => TOOL_GHI.has(t.function.name)));

  c.hoiThoai = c.hoiThoai.slice(0, cat);
  return { ok: true, cauHoi, coSuaFile };
}

/** Người dùng bấm dừng ở một cuộc cụ thể. */
export function huyLuotCua(id: string): void {
  const c = cuoc.get(id);
  if (!c) return;
  c.dangChay?.abort();
  c.dangChay = null;
  // Thẻ duyệt đang mở phải được giải phóng, nếu không vòng lặp treo mãi ở
  // `await hoiNguoiDung()` dù lượt đã bị huỷ.
  //
  // ⚠️ `huyTatCa()` huỷ MỌI thẻ đang treo, kể cả của cuộc khác. Chấp nhận được
  // vì chỉ MỘT cuộc chạy tại một thời điểm (xem `chayLuot`), nên không bao giờ
  // có hai thẻ của hai cuộc cùng treo.
  huyTatCa();
}

/**
 * Một lượt người dùng: nhận câu hỏi, chạy tới khi agent trả lời xong.
 *
 * `phat` được gọi nhiều lần trong suốt quá trình — đây là hàm chạy lâu (hàng
 * chục giây tới vài phút), không phải một lời gọi request/response.
 */
export async function chayLuot(
  cuocId: string,
  cauHoi: string,
  boiCanh: BoiCanh,
  phat: (e: SuKienAgent) => void,
): Promise<void> {
  const c = layCuoc(cuocId);
  if (c.dangChay) throw new Error('Việc này đang chạy dở. Hãy dừng nó trước.');
  /**
   * Chạy SONG SONG được — nhưng chỉ khi hai việc KHÔNG GHI vào cùng một chỗ.
   *
   * Bản trước chặn cứng "mỗi lúc một việc". Chặn thế là quá tay: hai việc CHỈ
   * ĐỌC thì không đụng gì nhau, và người dùng mở nhiều tab chính là để chạy
   * nhiều việc. Cấm cả những trường hợp an toàn chỉ khiến tính năng nhiều tab
   * thành vô nghĩa.
   *
   * Thứ thật sự nguy hiểm hẹp hơn nhiều: hai agent cùng ĐƯỢC GHI, trên CÙNG
   * một thư mục. Lúc đó cái này sửa file cái kia vừa đọc, và không có thứ tự
   * nào đúng cả. Chỉ chặn đúng trường hợp đó.
   */
  // So ĐƯỜNG DẪN THẬT, không so tên. Hai dự án khác nhau trùng tên thư mục
  // ("frontend", "api") là chuyện rất thường; so tên là chặn nhầm hai việc
  // không liên quan gì tới nhau.
  if ((boiCanh.choSua || boiCanh.choChayLenh) && boiCanh.goc) {
    const dung = [...cuoc.values()].find((k) => k.id !== c.id && k.dangChay && k.goc === boiCanh.goc);
    if (dung) {
      throw new Error(
        'Một việc khác đang chạy trên CÙNG thư mục dự án này, mà việc này lại được phép SỬA/CHẠY LỆNH. '
        + 'Hãy đợi nó xong — hai agent cùng ghi một chỗ sẽ đè lên nhau. '
        + '(Việc chỉ đọc, hoặc việc ở thư mục KHÁC, thì chạy song song thoải mái.)',
      );
    }
  }

  const phien = readStoredSession();
  if (!phien) {
    phat({ loai: 'loi', thongDiep: 'Chưa đăng nhập.', ma: 'NO_SESSION' });
    return;
  }
  // `phien.ts` không tự đọc được phiên đăng nhập — bơm token vào để nó nhờ
  // máy chủ đặt tên việc.
  datTokenChoDatTen(phien.sessionToken);

  const dieuKhien = new AbortController();
  c.dangChay = dieuKhien;
  // Trần việc phụ tính theo TỪNG CÂU HỎI, không theo cả cuộc: người dùng hỏi
  // mười câu trong một tab thì mỗi câu được ba việc phụ, chứ không phải cả tab
  // chỉ có ba.
  c.soViecPhu = 0;
  // Có ảnh ⇒ tin nhắn thành mảng khối. Chữ đi TRƯỚC ảnh: model đọc theo thứ tự,
  // và câu hỏi đặt sau ảnh thì nó đã bắt đầu mô tả tấm ảnh trước khi biết được
  // hỏi gì về nó.
  c.hoiThoai.push(
    boiCanh.anh?.length
      ? {
          role: 'user',
          content: [
            { type: 'text', text: cauHoi },
            ...boiCanh.anh.map((url) => ({ type: 'image_url' as const, image_url: { url } })),
          ],
        }
      : { role: 'user', content: cauHoi },
  );
  if (!c.duAn && boiCanh.goc) c.duAn = tenThuMuc(boiCanh.goc);

  // Chỉ khai báo khả năng khi THẬT SỰ có thư mục. Khai bừa thì máy chủ đưa tool
  // đọc file cho model, model gọi, và app trả lỗi ở mọi lời gọi — agent quay
  // vòng trong một việc nó không bao giờ làm được.
  //
  // `fs_write` thêm vào chỉ khi người dùng đã BẬT chế độ sửa. Không bật thì máy
  // chủ không đưa tool sửa cho model, nên model không thể gọi thứ nó sẽ bị từ
  // chối — im lặng bỏ qua ở phía app thì model cứ thử lại mãi.
  const capabilities: string[] = [];
  if (boiCanh.goc) {
    capabilities.push('fs_read', 'git_read', 'plan', 'subagent');
    if (boiCanh.choSua) capabilities.push('fs_write');
    // Lệnh nền và ghi git đi CÙNG hai quyền đã có, không thêm công tắc thứ ba
    // và thứ tư: người dùng đã phải cân nhắc hai lần rồi, và mỗi lời gọi vẫn
    // phải duyệt riêng. `git_write` theo `choSua` vì commit là ghi vào repo;
    // `shell_nen` theo `choChayLenh` vì nó vẫn là chạy lệnh.
    if (boiCanh.choChayLenh) capabilities.push('shell', 'shell_nen');
    if (boiCanh.choTrinhDuyet) capabilities.push('browser');
    if (boiCanh.choSua) capabilities.push('git_write');
  }
  // NGOÀI khối trên: ghi chú sống trên máy chủ, không cần thư mục dự án nào.
  if (boiCanh.choGhiNote) capabilities.push('notes_write');

  // Đọc LẠI ở mỗi lượt người dùng gõ — xem ghi chú đầu `ghiChu.ts`. Đọc một
  // lần cho cả lượt là đủ: trong cùng một lượt agent không sửa file này, và đọc
  // lại ở từng vòng chỉ thêm I/O không đổi gì.
  const ghiChuDuAn = boiCanh.goc ? await docGhiChuDuAn(boiCanh.goc) : null;
  if (ghiChuDuAn) {
    phat({ loai: 'tool', ten: ghiChuDuAn.ten, tomTat: 'quy ước dự án', vong: 'may' });
  }

  let daThuLai = false;

  try {
    for (let vong = 0; vong < MAX_VONG; vong++) {
      if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }

      const phanHoi = await mgoiMotLuot({
        token: phien.sessionToken,
        messages: c.hoiThoai,
        capabilities,
        ...(boiCanh.goc
          ? {
              workspace: {
                name: tenThuMuc(boiCanh.goc),
                platform: process.platform as string,
                ...(boiCanh.nhanh ? { branch: boiCanh.nhanh } : {}),
              },
            }
          : {}),
        ...(ghiChuDuAn ? { ghiChuDuAn } : {}),
        ...(boiCanh.mucNoLuc ? { mucNoLuc: boiCanh.mucNoLuc } : {}),
        ...(boiCanh.model ? { model: boiCanh.model } : {}),
        // Gửi ở MỌI vòng, không phải chỉ vòng đầu: người dùng có thể nạp lại
        // MCP giữa chừng, và máy chủ chỉ chấp nhận tool có mặt trong lượt NÀY.
        toolMcp: toolMcpHienCo().map((t) => ({
          name: t.ten, description: t.moTa, parameters: t.thamSo,
        })),
        signal: dieuKhien.signal,
        phat,
      });

      if (!phanHoi.ok) {
        if (MA_DANG_THU_LAI.has(phanHoi.ma) && !daThuLai) {
          daThuLai = true;
          phat({ loai: 'tool', ten: 'kết nối', tomTat: 'đứt giữa chừng — đang thử lại', vong: 'may' });
          vong--; // lần thử lại không tính là một vòng
          continue;
        }
        phat({ loai: 'loi', thongDiep: phanHoi.thongDiep, ma: phanHoi.ma });
        return;
      }
      const ketQua = phanHoi.ketQua;
      // Đi được một bước ⇒ nạp lại quyền thử lại. "Một lần" là một lần cho MỖI
      // chỗ kẹt, không phải một lần cho cả việc — việc 20 bước mà đứt ở bước 3
      // rồi lại đứt ở bước 17 là hai sự cố khác nhau.
      daThuLai = false;

      c.hoiThoai.push(...ketQua.append);

      if (ketQua.stop === 'end' || ketQua.stop === 'max_steps') {
        phat({
          loai: 'xong', hanMuc: ketQua.quota, tienUsd: ketQua.costUsd,
          daLuoc: ketQua.daLuoc, soFileDaSua: soFileDaSua(c.so),
          ...(ketQua.nguCanh ? { nguCanh: ketQua.nguCanh } : {}),
        });
        // Việc agent thường chạy nhiều phút; người dùng đi làm việc khác là
        // chuyện bình thường. Robot nổi báo hộ. Nhập động để `loop.ts` không kéo
        // theo cả tầng cửa sổ khi chạy trong vitest.
        void import('../robotTin')
          .then(({ baoAgentXong }) => {
            const n = soFileDaSua(c.so);
            baoAgentXong(n > 0 ? `Xong việc — đã sửa ${n} tệp` : 'Agent đã trả lời xong');
          })
          .catch(() => {});
        return;
      }

      // 'tool_calls' → chạy; 'continue' → không có gì để chạy, vòng lại ngay.
      for (const goi of ketQua.toolCalls) {
        if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }

        // Bối cảnh ghi chỉ dựng khi người dùng đã bật chế độ sửa. Không bật thì
        // `chayToolAgent` nhận `undefined` và tự trả lỗi cho model.
        const boiCanhGhi = boiCanh.choSua
          ? {
              signal: dieuKhien.signal,
              so: c.so,
              xinPhep: (y: YeuCauXinPhep & { diff: KetQuaDiff; taoMoi: boolean }) =>
                phat({ loai: 'xinPhep', id: y.id, ten: y.ten, duongDan: y.duongDan, taoMoi: y.taoMoi, diff: y.diff }),
            }
          : undefined;

        // Bối cảnh LỆNH tách riêng khỏi bối cảnh GHI: hai quyền bật độc lập,
        // nên bật "cho sửa" không được kéo theo "cho chạy lệnh".
        /* Dùng chung cho lệnh shell VÀ cho `web_bam`/`web_go` — cả hai đều
           cần đúng một thứ: một đường xin duyệt có hiện nguyên văn việc sắp làm. */
        const boiCanhLenh = (boiCanh.choChayLenh || boiCanh.choTrinhDuyet)
          ? {
              signal: dieuKhien.signal,
              so: c.so,
              xinPhepLenh: (y: YeuCauXinPhep & { phanLoai: PhanLoaiLenh }) =>
                phat({ loai: 'xinPhepLenh', id: y.id, lenh: y.duongDan, phanLoai: y.phanLoai }),
              onRa: (mau: string) => phat({ loai: 'lenhRa', mau }),
            }
          : undefined;

        const boiCanhNen = boiCanh.choChayLenh
          ? {
              cuocId: c.id,
              so: c.so,
              signal: dieuKhien.signal,
              xinPhepLenh: (y: YeuCauXinPhep & { phanLoai: PhanLoaiLenh }) =>
                phat({ loai: 'xinPhepLenh', id: y.id, lenh: y.duongDan, phanLoai: y.phanLoai }),
            }
          : undefined;

        const boiCanhGit = boiCanh.choSua
          ? {
              so: c.so,
              signal: dieuKhien.signal,
              xinPhepGit: (y: YeuCauXinPhep & { viec: 'commit' | 'pr'; chiTiet: string }) =>
                phat({ loai: 'xinPhepGit', id: y.id, viec: y.viec, chiTiet: y.chiTiet }),
            }
          : undefined;

        // Ghi chú KHÔNG theo `choSua`: nó không phải file trong dự án.
        const boiCanhNote = boiCanh.choGhiNote
          ? {
              so: c.so,
              signal: dieuKhien.signal,
              xinPhepNote: (y: YeuCauXinPhep & { viec: 'tao' | 'ghi'; chiTiet: string }) =>
                phat({ loai: 'xinPhepNote', id: y.id, viec: y.viec, chiTiet: y.chiTiet }),
            }
          : undefined;

        const boiCanhKeHoach = {
          keHoach: (viec: Array<{ ten: string; trangThai: string }>) => phat({ loai: 'keHoach', viec }),
        };

        // `anh?` để `web_anh` gửi được ảnh chụp lên máy chủ — xem `KetQuaTool`.
        let kq: { noiDung: string; tomTat: string; anh?: Array<{ media_type: string; data: string }> };
        if (laToolMcp(goi.name)) {
          // Tool MCP xử lý TRƯỚC cả phép kiểm "đã mở dự án chưa": một server
          // Linear hay Sentry không cần thư mục nào trên máy cả.
          kq = await chayToolMcpCoDuyet(goi.name, goi.args, c, dieuKhien.signal, phat);
        } else if (goi.name === 'notes_tao' || goi.name === 'notes_ghi') {
          // TRƯỚC chốt "chưa mở dự án": sổ ghi chú sống trên máy chủ, chẳng
          // liên quan gì tới thư mục mã. Đặt sau chốt đó thì người dùng chỉ
          // muốn agent ghi chú vẫn bị bắt mở một dự án không tồn tại.
          kq = boiCanhNote
            ? await chayToolAgent('', goi.name, goi.args, undefined, undefined, undefined, undefined, undefined, boiCanhNote)
            : { noiDung: 'LỖI: phiên này không bật quyền ghi ghi chú.', tomTat: 'không có quyền' };
        } else if (!boiCanh.goc) {
          kq = { noiDung: 'LỖI: người dùng chưa chọn thư mục dự án nào.', tomTat: 'chưa mở dự án' };
        } else if (goi.name === 'giao_viec_phu') {
          kq = await chayViecPhu(c, goi.args, boiCanh, phien.sessionToken, dieuKhien.signal, phat);
        } else {
          kq = await chayToolAgent(
            boiCanh.goc, goi.name, goi.args, boiCanhGhi, boiCanhLenh, boiCanhKeHoach, boiCanhNen, boiCanhGit,
          );
        }
        c.hoiThoai.push({
          role: 'tool', tool_call_id: goi.id, content: kq.noiDung,
          ...(kq.anh?.length ? { anh: kq.anh } : {}),
        });
        phat({ loai: 'tool', ten: goi.name, tomTat: kq.tomTat, vong: 'may' });
      }
    }

    phat({
      loai: 'loi',
      thongDiep:
        `Đã đi ${MAX_VONG} vòng mà chưa xong — nhiều hơn mọi trần bước của máy chủ, ` +
        'nên gần như chắc chắn là agent đang lặp. Hãy hỏi lại câu hẹp hơn.',
      ma: 'MAX_ROUNDS',
    });
  } catch (err) {
    if (dieuKhien.signal.aborted) phat({ loai: 'huy' });
    else phat({ loai: 'loi', thongDiep: (err as Error).message || 'Lỗi không rõ.' });
  } finally {
    if (c.dangChay === dieuKhien) c.dangChay = null;
    // Lưu ở `finally`, KHÔNG ở nhánh thành công. Lượt hỏng giữa chừng hay bị
    // người dùng bấm Dừng vẫn chứa những bước agent đã đi và đã trả tiền —
    // mất chúng chỉ vì lượt không kết thúc đẹp là mất đúng thứ đáng giữ nhất.
    {
      void luuPhien(c.phienId, c.hoiThoai as TinNhanLuu[], c.duAn, c.goc).catch(() => {
        /* ghi đĩa hỏng KHÔNG được làm hỏng lượt vừa chạy xong */
      });
    }
  }
}

/**
 * Gọi một tool MCP — nhưng chỉ sau khi người dùng bấm duyệt.
 *
 * ⚠️ `choNho: false`. Đây là điểm khác cốt lõi so với tool sửa file và tool
 * chạy lệnh: KHÔNG có "cho phép cả …" cho tool MCP.
 *
 * Lý do là ranh giới tin cậy. Duyệt `npm test` cả phiên là duyệt một lệnh
 * người dùng đọc được và hiểu được. Duyệt một tool MCP cả phiên là cấp quyền
 * cho mã của NGƯỜI LẠ chạy bao nhiêu lần tuỳ ý với tham số mà model tự chọn —
 * và chính server đó lại là bên viết phần mô tả mà model đọc để quyết định gọi
 * gì. Bên viết mô tả không được là bên hưởng lợi từ việc bỏ qua cửa duyệt.
 *
 * Nên thẻ duyệt hiện cả THAM SỐ, không chỉ tên tool: `mcp__db__query` nghe vô
 * hại cho tới khi nhìn thấy tham số nó định chạy.
 */
async function chayToolMcpCoDuyet(
  ten: string,
  args: Record<string, unknown>,
  c: CuocHoiThoai,
  signal: AbortSignal,
  phat: (e: SuKienAgent) => void,
): Promise<{ noiDung: string; tomTat: string }> {
  const t = toolMcpHienCo().find((x) => x.ten === ten);
  if (!t) {
    return { noiDung: `LỖI: không có tool MCP tên "${ten}".`, tomTat: 'không có tool' };
  }

  let thamSo = '';
  try {
    thamSo = JSON.stringify(args, null, 2).slice(0, 2000);
  } catch {
    thamSo = '(không đọc được tham số)';
  }

  const id = `mcp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const quyet = await hoiNguoiDung(
    { ten: 'mcp', duongDan: `${t.server}: ${t.tenGoc}`, khoa: id, choNho: false },
    (y) => phat({ loai: 'xinPhepMcp', id: y.id, server: t.server, tool: t.tenGoc, args: thamSo }),
    signal,
    // ⚠️ `quyenDaCap`, KHÔNG phải `soNho`. Lỗi này chạy được suốt vì MCP luôn
    // truyền `choNho: false`, nên `hoiNguoiDung` không bao giờ chạm vào sổ —
    // `undefined` đi qua mà không ai dereference. Nó chỉ nổ khi có người sau
    // này cho MCP nhớ quyền.
    c.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') {
    return {
      noiDung: `NGƯỜI DÙNG TỪ CHỐI gọi ${ten}. Đừng thử lại tool này; hãy tìm cách khác hoặc hỏi họ.`,
      tomTat: 'bị từ chối',
    };
  }

  const noiDung = await goiToolMcp(ten, args);
  const h = hanMucMcp();
  return {
    noiDung,
    tomTat: noiDung.startsWith('LỖI') ? 'lỗi' : `${t.server} · ${h.daDung}/${h.tran} lượt hôm nay`,
  };
}

/**
 * Chạy một AGENT PHỤ.
 *
 * Nó là một vòng lặp agent thu nhỏ, dùng lại đúng `mgoiMotLuot` — nên nó đi qua
 * cùng đường xin phép, cùng hạn mức, cùng cầu dao tiền. Khác ở ba chỗ, và cả ba
 * đều là giới hạn CỨNG, không phải mặc định người dùng đổi được:
 *
 *   • `laPhu: true`  → máy chủ dựng prompt gọn và ép trần 10 bước;
 *   • khả năng CHỈ ĐỌC → không `fs_write`, không `shell`, không `subagent`.
 *     Bỏ `subagent` ở đây là thứ chặn đệ quy: agent phụ không giao việc tiếp
 *     được, nên không có cây việc phụ nào mọc ra sau lưng;
 *   • hội thoại RIÊNG, bắt đầu trống → nó không thấy hội thoại của agent chính,
 *     và ngược lại agent chính chỉ nhận về đúng đoạn chữ cuối.
 */
async function chayViecPhu(
  c: CuocHoiThoai,
  args: Record<string, unknown>,
  boiCanh: BoiCanh,
  token: string,
  signal: AbortSignal,
  phat: (e: SuKienAgent) => void,
): Promise<{ noiDung: string; tomTat: string }> {
  const nhiemVu = String(args.nhiem_vu ?? '').trim();
  if (!nhiemVu) return { noiDung: 'LỖI: thiếu "nhiem_vu".', tomTat: 'thiếu nhiệm vụ' };
  const tran = tranViecPhu(boiCanh.mucNoLuc);
  if (c.soViecPhu >= tran) {
    return {
      noiDung:
        `LỖI: đã dùng hết ${tran} việc phụ cho câu hỏi này. ` +
        'Hãy tự làm nốt phần còn lại bằng grep/read_file — rẻ hơn và bạn vẫn còn bước.',
      tomTat: 'hết lượt việc phụ',
    };
  }
  c.soViecPhu++;

  phat({ loai: 'tool', ten: 'giao_viec_phu', tomTat: `${nhiemVu.slice(0, 60)}…`, vong: 'may' });

  const phu: TinNhan[] = [{ role: 'user', content: nhiemVu }];
  let traLoi = '';

  for (let vong = 0; vong < 14; vong++) {
    if (signal.aborted) return { noiDung: 'Việc phụ bị dừng.', tomTat: 'đã dừng' };

    const ph = await mgoiMotLuot({
      token,
      messages: phu,
      capabilities: ['fs_read', 'git_read'],
      ...(boiCanh.goc ? { workspace: { name: tenThuMuc(boiCanh.goc), platform: process.platform as string } } : {}),
      // Việc phụ chạy ĐÚNG model người dùng chọn, không phải model mặc định.
      // Bản tóm tắt của nó đi thẳng vào kết luận của agent chính, nên một model
      // khác ở đây là một mắt xích người dùng không chọn mà vẫn quyết định câu
      // trả lời. Và người chọn GPT để lấy "ý kiến thứ hai" mà việc phụ vẫn chạy
      // Claude thì họ không nhận được thứ họ trả tiền để có.
      //
      // ⚠️ Đổi lại: ở mức Ultracode (10 việc phụ) với Opus thì tiền nhân lên
      // rất nhanh. Trần thật là hạn mức 5 giờ, và bảng chọn đã nói trước điều đó.
      ...(boiCanh.model ? { model: boiCanh.model } : {}),
      laPhu: true,
      signal,
      // Sự kiện của agent phụ KHÔNG đẩy lên màn hình: bảng ghi sẽ thành một mớ
      // hai luồng chữ đan nhau mà người dùng không biết luồng nào của ai. Họ
      // thấy một dòng "giao_viec_phu" lúc bắt đầu và bản tóm tắt lúc xong.
      phat: () => {},
    });

    if (!ph.ok) return { noiDung: `LỖI ở việc phụ: ${ph.thongDiep}`, tomTat: 'lỗi' };
    phu.push(...(ph.ketQua.append as TinNhan[]));

    if (ph.ketQua.stop === 'end' || ph.ketQua.stop === 'max_steps') {
      const cuoi = ph.ketQua.append[ph.ketQua.append.length - 1];
      traLoi = cuoi && cuoi.role === 'assistant' ? String(cuoi.content ?? '') : '';
      break;
    }

    for (const goi of ph.ketQua.toolCalls) {
      // KHÔNG truyền bối cảnh ghi/lệnh ⇒ agent phụ gọi `edit_file` sẽ nhận lỗi
      // "không có quyền" thay vì ghi được. Lớp chặn thứ hai, sau việc máy chủ
      // đã không đưa những tool đó cho nó.
      const kq = await chayToolAgent(boiCanh.goc!, goi.name, goi.args);
      phu.push({ role: 'tool', tool_call_id: goi.id, content: kq.noiDung });
    }
  }

  if (!traLoi.trim()) {
    return { noiDung: 'Việc phụ chạy xong nhưng không trả về tóm tắt nào.', tomTat: 'không có kết quả' };
  }
  return {
    noiDung: `KẾT QUẢ VIỆC PHỤ — "${nhiemVu.slice(0, 80)}"\n\n${traLoi}`,
    tomTat: `xong (${c.soViecPhu}/${tran})`,
  };
}

function tenThuMuc(p: string): string {
  return p.split(/[\\/]/).filter(Boolean).pop() ?? p;
}

// ─── Một lời gọi tới /agent/turn, đọc SSE ──────────────────────────

interface KetQuaLuot {
  append: TinNhan[];
  stop: 'end' | 'tool_calls' | 'continue' | 'max_steps';
  toolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }>;
  quota: HanMucUi | null;
  costUsd: number;
  daLuoc: number;
  nguCanh?: NguCanhUi;
}

/**
 * Lỗi đáng THỬ LẠI: đường truyền đứt, không phải cổng từ chối.
 *
 * Đo thật 17/08/2026: cổng thỉnh thoảng im hẳn quá 90 giây và đồng hồ im lặng ở
 * backend cắt lượt. Hội thoại lúc đó vẫn nguyên vẹn ở main, nên thử lại là gửi
 * đúng thứ vừa gửi — rẻ hơn nhiều so với bắt người dùng gõ lại câu hỏi và mất
 * hết những bước agent đã đi.
 *
 * CHỈ thử lại MỘT lần, và chỉ với nhóm lỗi này. Lỗi "hết hạn mức", "chưa Pro",
 * "cổng trả 400" mà thử lại thì chỉ tốn thêm tiền cho cùng một câu trả lời.
 */
const MA_DANG_THU_LAI = new Set([
  'CONNECTION_LOST', 'LLM_ERROR',
  /*
   * MÁY CHỦ ĐANG KHỞI ĐỘNG LẠI. 19/08/2026 người dùng nhận "Máy chủ trả về
   * 502" giữa một lượt agent 20 bước — vì tôi deploy đúng lúc họ đang chạy.
   * Container tráo mất ~10 giây; lượt chết vĩnh viễn và mọi bước đã đi đều
   * mất, dù chỉ cần đợi một nhịp.
   *
   * Ba mã này KHÔNG phải "cổng AI từ chối" mà là "chỗ nhận đang thay ca" —
   * đúng loại đáng thử lại nhất, và thử lại rẻ hơn nhiều so với bắt người
   * dùng gõ lại câu hỏi.
   */
  '502', '503', '504',
]);

async function mgoiMotLuot(o: {
  token: string;
  messages: TinNhan[];
  capabilities: string[];
  workspace?: { name: string; platform: string; branch?: string };
  ghiChuDuAn?: { ten: string; noiDung: string };
  mucNoLuc?: string;
  model?: string;
  laPhu?: boolean;
  toolMcp?: Array<{ name: string; description: string; parameters: Record<string, unknown> }>;
  signal: AbortSignal;
  phat: (e: SuKienAgent) => void;
}): Promise<{ ok: true; ketQua: KetQuaLuot } | { ok: false; thongDiep: string; ma: string }> {
  const res = await fetch(`${API_ORIGIN}/api/v1/agent/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${o.token}` },
    signal: o.signal,
    body: JSON.stringify({
      messages: o.messages,
      capabilities: o.capabilities,
      workspace: o.workspace,
      ghiChuDuAn: o.ghiChuDuAn,
      mucNoLuc: o.mucNoLuc,
      model: o.model,
      laPhu: o.laPhu,
      toolMcp: o.toolMcp,
    }),
  });

  if (!res.ok) {
    // 403 = chưa Pro. Phải phân biệt với 401 (phiên hết hạn) vì hai cái dẫn tới
    // hai màn hình khác hẳn nhau: một cái mời nâng cấp, một cái bắt đăng nhập.
    const than = await res.json().catch(() => ({})) as { message?: string; code?: string };
    return {
      ok: false,
      thongDiep: than.message ?? `Máy chủ trả về ${res.status}.`,
      ma: than.code ?? String(res.status),
    };
  }
  if (!res.body) {
    return { ok: false, thongDiep: 'Máy chủ không trả về dữ liệu.', ma: 'EMPTY_BODY' };
  }

  const doc = res.body.getReader();
  const giaiMa = new TextDecoder();
  let dem = '';
  const ra: KetQuaLuot = { append: [], stop: 'end', toolCalls: [], quota: null, costUsd: 0, daLuoc: 0 };
  let loi: { thongDiep: string; ma: string } | null = null;

  for (;;) {
    const { done, value } = await doc.read();
    if (done) break;
    dem += giaiMa.decode(value, { stream: true });
    const dong = dem.split('\n');
    dem = dong.pop() ?? '';

    for (const d of dong) {
      if (!d.startsWith('data: ')) continue;
      let e: any;
      try { e = JSON.parse(d.slice(6)); } catch { continue; }

      switch (e.type) {
        case 'start':
          o.phat({ loai: 'batDau', model: e.model, ...(typeof e.buoc === 'number' ? { buoc: e.buoc } : {}), ...(typeof e.tranBuoc === 'number' ? { tranBuoc: e.tranBuoc } : {}) });
          break;
        case 'text':
          o.phat({ loai: 'chu', delta: e.delta });
          break;
        case 'server_tool':
          o.phat({ loai: 'tool', ten: e.name, tomTat: e.summary, vong: 'notes' });
          break;
        case 'tool_call':
          ra.toolCalls.push({ id: e.id, name: e.name, args: e.args ?? {} });
          break;
        case 'done':
          ra.append = e.append ?? [];
          ra.stop = e.stop;
          ra.quota = e.quota ?? null;
          ra.costUsd = e.usage?.costUsd ?? 0;
          ra.daLuoc = e.compact?.soDaLuoc ?? 0;
          if (e.nguCanh) ra.nguCanh = e.nguCanh;
          break;
        case 'error':
          // Ghi lại, KHÔNG phát ngay: chỗ gọi có thể quyết định thử lại, và
          // phát lỗi trước khi thử lại là hiện một thông báo đỏ rồi tự sửa —
          // người dùng đọc được cái đỏ đó và tưởng đã hỏng.
          loi = { thongDiep: e.error, ma: e.code ?? 'LLM_ERROR' };
          break;
      }
    }
  }

  return loi ? { ok: false, ...loi } : { ok: true, ketQua: ra };
}
