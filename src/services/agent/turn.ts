/**
 * ============================================================
 * ĐỘNG CƠ MỘT LƯỢT AGENT
 * ============================================================
 *
 * MÁY CHỦ KHÔNG GIỮ TRẠNG THÁI. App gửi lên TOÀN BỘ hội thoại mỗi lượt, máy
 * chủ trả về những tin nhắn cần NỐI THÊM, app tự nối rồi gọi lại. Không có
 * bảng phiên, không có bộ nhớ trong RAM.
 *
 * Vì sao chọn kiểu đó, dù nó tốn băng thông hơn:
 *   • Backend chạy trong container và được thay mới mỗi lần deploy. Giữ phiên
 *     trong RAM nghĩa là mỗi lần deploy giết sạch mọi phiên agent đang chạy dở.
 *   • Người dùng có thể đóng app giữa chừng rồi mở lại. Hội thoại nằm ở app
 *     thì nó sống sót; nằm ở máy chủ thì phải thêm bảng, thêm dọn rác, thêm
 *     hạn dùng — cả một hệ thống chỉ để lưu thứ app đã có sẵn.
 *
 * ─── LUỒNG MỘT LƯỢT ───
 *
 *   app ──▶ runAgentTurn(messages)
 *              │
 *              ├─ gọi cổng (stream) ──▶ phát 'text' ra màn hình ngay
 *              │
 *              ├─ model đòi tool VÒNG 2 (notes_*)?
 *              │     → máy chủ TỰ CHẠY, nối kết quả, gọi cổng LẠI (hop)
 *              │       app không phải làm gì, chỉ thấy một dòng tiến trình
 *              │
 *              └─ model đòi tool VÒNG 1 (đọc file)?
 *                    → kết thúc lượt, trả 'tool_call' về cho app chạy
 *
 *   Một tin nhắn của model có thể đòi CẢ HAI vòng cùng lúc. Khi đó máy chủ
 *   chạy phần của mình, đưa phần còn lại cho app, và cả hai kết quả cùng nối
 *   vào một danh sách — giao thức chỉ đòi MỌI tool_call phải có tin nhắn trả
 *   lời trước lượt sau, không đòi thứ tự.
 */
import {
  baoRamboHong,
  chatUrlOf,
  costUsd,
  gatewayConfigured,
  modelFor,
  ramboDangNghi,
  xinDiemCuoi,
} from '../llm/gateway.js';
import { checkBudget, budgetMessage } from '../llm/budget.js';
import { nenNguCanh, tinhMoc } from './compact.js';
import { MAX_VIET_TIEP, gopVietTiep } from './vietTiep.js';
import { chuPdfKhongDoc, sangAnthropic, stopSangFinish, toolSangAnthropic } from './anthropic.js';
import { modelAgentTu } from './models.js';
import { congDuPhong, modelDuPhongAgent, veDuPhongHopLe } from './congDuPhong.js';
import { TRAN_KY_TU_CHINH_HANG, modelChinhHangTu, type HangChinhHang, type ModelChinhHang } from './anthropicChinhHang/cauHinh.js';
import { dungThanChinhHang, thanAnToan, type ThanAnthropic } from './anthropicChinhHang/thanYeuCau.js';
import { chonModelPhu } from './anthropicChinhHang/modelPhu.js';
import { coKeyKhaDung } from './anthropicChinhHang/khoKey.js';
import { CongAnthropicLoi, ghiDung, guiChinhHang, type KetQuaGui } from './anthropicChinhHang/goi.js';
import { loiHetHanMucChinhHang, xemHanMucChinhHang } from './anthropicChinhHang/hanMuc.js';
import { veAnthropicHopLe } from './anthropicChinhHang/ve.js';
import {
  CAU_DOI_CONG_FREE, NHAN_CONG_ANTHROPIC, cacCongNangCap, diemCuoiChinhHang, modelFreeChoApp,
  type CongNangCap,
} from './anthropicChinhHang/dinhTuyen.js';
import { LOI_LAM_VIEC } from './prompt.js';
import { loiHetHan, xemHanMuc, type HanMuc } from './quota.js';
import { coKeyGiaHan } from './keyGiaHan.js';
import { HE_SO_FABLE, MODEL_FABLE, loiHetFable, xemHanMucFable } from './fable.js';
import { loiCanViTien, xemViTien } from './viTien.js';
import { runServerTool } from './serverTools.js';
import { buildSystemPrompt, catGhiChu, type WorkspaceHint } from './prompt.js';
import { catLuotCu, loiNhacDaCat, tongKyTu } from './catCu.js';
import { ghiNhoLuotDaBo } from './tomTatLuotCu.js';
import { parseCapabilities, parseToolMcp, toolByName, toolsForGateway, type AgentCapability } from './tools.js';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// ─── Trần ──────────────────────────────────────────────────────────
//
// Ba con số này là chốt chặn ví tiền, không phải tinh chỉnh hiệu năng. Lịch sử
// của repo này có một ngày 1.840 lời gọi nền thất bại mà thứ duy nhất phát
// hiện ra là biểu đồ chi phí (xem `llm/budget.ts`) — một vòng lặp agent hỏng
// còn nhanh hơn thế, vì mỗi vòng tự sinh ra vòng sau.

/**
 * CẤP ĐỘ NỖ LỰC — trần bước theo mức người dùng chọn.
 *
 * ⚠️ CỐ Ý KHÔNG đổi MODEL theo mức. Trực giác là "nhanh thì dùng model nhẹ",
 * nhưng đo thật 17/08 cho kết quả NGƯỢC: với việc gọi tool, `gpt-5.5` chậm gấp
 * 4 và tốn token gấp 9 so với `gpt-5.6-sol` (cổng bọc nó trong một prompt ẩn
 * ~4,5k token mỗi lượt). Một thanh trượt "Nhanh ↔ Kỹ" mà đầu "Nhanh" lại chậm
 * hơn là một thanh trượt nói dối.
 *
 * Thứ ĐỔI THẬT theo mức là SỐ BƯỚC agent được đi. Đó cũng là thứ quyết định
 * giá: đo được ~18k token mỗi bước sau khi nén, nên 10 bước ≈ 0,2 $ còn 40
 * bước ≈ 0,9 $. Người dùng chọn mức là đang chọn "đào sâu tới đâu", và đó đúng
 * là điều họ muốn nói.
 */
export type MucNoLuc = 'thap' | 'vua' | 'cao' | 'ratCao' | 'toiDa' | 'ultracode';

/** Tên hiển thị của từng mức. Một chỗ duy nhất — bảng chọn và câu báo lỗi
 *  phải gọi cùng một tên, không thì người dùng đọc "Kỹ" trong lỗi rồi đi tìm
 *  "Kỹ" trong bảng chọn và không thấy. */
const TEN_MUC: Record<MucNoLuc, string> = {
  thap: 'Thấp', vua: 'Vừa', cao: 'Cao', ratCao: 'Rất cao', toiDa: 'Tối đa', ultracode: 'Ultracode',
};

const TRAN_BUOC: Record<MucNoLuc, number> = {
  thap: 8,
  vua: 30,
  cao: 60,
  ratCao: 100,
  toiDa: 160,
  ultracode: 260,
};

/**
 * Số agent PHỤ được giao việc trong một câu hỏi, theo mức.
 *
 * ⚠️ Agent phụ NHÂN token lên chứ không chia ra — mỗi việc phụ là một hội thoại
 * riêng phải trả tiền song song. Nên con số này tăng chậm hơn số bước rất
 * nhiều, và chỉ ở `ultracode` mới thật sự mở ra.
 */
const TRAN_VIEC_PHU: Record<MucNoLuc, number> = {
  thap: 1,
  vua: 3,
  cao: 3,
  ratCao: 5,
  toiDa: 6,
  ultracode: 10,
};

/**
 * Bảng mức cho app vẽ giao diện.
 *
 * Ở MÁY CHỦ chứ không phải trong app, vì con số bước là thứ máy chủ áp đặt —
 * app cũ hiện "60 bước" trong khi máy chủ đã đổi thành 100 là một lời nói dối
 * mà không ai phát hiện được.
 */
export const DS_MUC_NO_LUC: ReadonlyArray<{ id: MucNoLuc; ten: string; buoc: number; viecPhu: number }> =
  Object.freeze(
    (Object.keys(TRAN_BUOC) as MucNoLuc[]).map((id) => ({
      id,
      ten: TEN_MUC[id],
      buoc: TRAN_BUOC[id],
      viecPhu: TRAN_VIEC_PHU[id],
    })),
  );

export function tranViecPhu(muc: MucNoLuc): number {
  return TRAN_VIEC_PHU[muc];
}

/**
 * ⚠️ TÊN CŨ PHẢI CÒN SỐNG. Máy chủ deploy trước, app desktop thì người dùng
 * cập nhật lúc nào tuỳ họ — và có người còn đang chạy bản 0.5.x cũ. App cũ gửi
 * `canBang`; bỏ nhánh này là mức của họ âm thầm tụt về mặc định, không lỗi nào
 * hiện ra, chỉ là agent bỗng "lười đi".
 */
const TEN_CU: Record<string, MucNoLuc> = { nhanh: 'thap', canBang: 'vua', ky: 'cao' };

function docMucNoLuc(raw: unknown): MucNoLuc {
  if (typeof raw !== 'string') return 'vua';
  if (raw in TRAN_BUOC) return raw as MucNoLuc;
  return TEN_CU[raw] ?? 'vua';
}
/** Số lần máy chủ tự gọi lại cổng trong MỘT lượt (khi model chỉ đòi tool vòng 2). */
const MAX_SERVER_HOPS = 4;
/** Trần độ dài hội thoại. Vượt là app hỏng hoặc bị sửa — không phải người dùng gõ dài. */
const MAX_MESSAGES = 200;

/**
 * Trần tuyệt đối cho số phần tử `messages` nhận vào.
 *
 * Không phải để chặn payload ác ý (việc đó thuộc giới hạn kích thước thân yêu
 * cầu) mà để một mảng khổng lồ không làm vòng lọc bên dưới chạy vô ích — mọi
 * thứ ngoài `MAX_MESSAGES` lượt gần nhất đằng nào cũng bị `catLuotCu` bỏ.
 */
const TRAN_TUYET_DOI = MAX_MESSAGES * 5;

/**
 * Cắt thô mảng thô xuống trần, GIỮ phần MỚI NHẤT, và bắt đầu ở một tin nhắn
 * `user`.
 *
 * ⛔ Bắt đầu ở đâu cũng được là SAI. Giao thức đòi mỗi `tool_calls` có đúng
 * một tin nhắn `tool` mang đúng `tool_call_id`; cắt trúng giữa một lượt là để
 * lại một tin nhắn `tool` MỒ CÔI ở đầu mảng, và cổng từ chối cả lượt bằng một
 * lỗi không nói rõ thiếu ở đâu. Nên sau khi cắt còn phải bỏ tiếp cho tới tin
 * nhắn `user` đầu tiên.
 */
function catThoChoAnToan(raw: unknown[], tran: number): unknown[] {
  const duoi = raw.slice(-tran);
  const dau = duoi.findIndex(
    (m) => !!m && typeof m === 'object' && (m as { role?: unknown }).role === 'user',
  );
  // Không còn tin nhắn `user` nào trong phần giữ lại ⇒ trả nguyên phần đó và
  // để `catLuotCu` + cổng xử lý; cắt sạch thành mảng rỗng còn tệ hơn.
  return dau > 0 ? duoi.slice(dau) : duoi;
}
const MAX_TOTAL_CHARS = 600_000;
/** Chỗ chừa dưới trần cho phần ghi nhớ (đề bài ghim ≤ 6k + tóm tắt ~900 từ). */
const CHO_GHI_NHO = 16_000;
/** Trần cho MỘT kết quả tool do app gửi lên. App đã tự cắt; đây là lớp phòng khi app cũ chưa cắt. */
const MAX_TOOL_RESULT_CHARS = 60_000;
/**
 * HAI đồng hồ, vì đây là HAI loại hỏng khác nhau — gộp làm một là đo sai.
 *
 * `CHO_BYTE_DAU_MS` — từ lúc gửi tới lúc cổng nhả byte đầu tiên. Chờ ở đây là
 * chuyện BÌNH THƯỜNG: yêu cầu đang xếp hàng bên trong cổng. Đo thật
 * 17/08/2026 lúc cổng quá tải: một lời gọi 10 token mất **129 giây** — trong
 * khi buổi sáng cùng ngày chỉ mất 2–5 giây. Đặt trần 90s như cũ thì mỗi lúc
 * cổng đông là người dùng mất trắng lượt, dù cổng vẫn đang làm việc.
 *
 * `IM_LANG_MS` — im lặng SAU khi chữ đã bắt đầu chảy. Cái này thì khác hẳn:
 * stream đã mở rồi mà tắt tiếng nghĩa là kết nối chết, và chờ thêm chẳng để
 * làm gì. Nên nó CHẶT hơn, không lỏng hơn.
 */
const CHO_BYTE_DAU_MS = 180_000;
const IM_LANG_MS = 60_000;
/**
 * Trần token RA cho một lời gọi.
 *
 * ⚠️ 4.000 là con số cũ, và nó chính là lỗi người dùng báo 19/08/2026: quét
 * xong một dự án rồi bản tổng quan bị cắt ngang giữa câu. `max_tokens` là
 * TRẦN chứ không phải chỉ tiêu — model chỉ viết đúng thứ nó cần, nên nâng
 * lên KHÔNG làm tăng tiền cho những câu trả lời vốn đã ngắn. Cái nó đổi là
 * những câu trả lời dài không còn bị chặt cụt.
 */
const MAX_OUTPUT_TOKENS = 16_000;
/** Ảnh mỗi lượt, và trần cho một data URI (~5,5MB chuỗi ≈ 4MB ảnh). */
/**
 * Trần số ảnh MỖI LƯỢT.
 *
 * 3 → 8 (09/09/2026). App chuẩn hoá mọi ảnh về cạnh dài 1568px trước khi gửi
 * (`DinhKemCode.tsx`), nên 8 ảnh ≈ 6MB chứ không phải 8 × 5,6MB.
 *
 * ⚠️ BA CON SỐ PHẢI ĐI CÙNG NHAU: `MAX_ANH_THANG` (app) · `anhSchema.max()`
 * (IPC) · `MAX_ANH` (đây). Lệch một cái thì ảnh thứ n bị bỏ IM LẶNG ở tầng có
 * số nhỏ nhất — không lỗi, không cảnh báo, model chỉ đơn giản không thấy nó.
 */
const MAX_ANH = 8;
const MAX_ANH_BYTES = 5_600_000;

// ─── Kiểu tin nhắn (theo giao thức OpenAI) ─────────────────────────

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

/**
 * Khối nội dung cho lượt CÓ ẢNH.
 *
 * Tuyến OpenAI của cổng nhận ảnh dạng `image_url` với data URI. Đo 11/08 (ghi
 * trong CLAUDE.md): trong tám model của khoá này, CHỈ `gpt-5.6-sol` thật sự
 * nhìn được ảnh — mấy model kia nhận ảnh, không báo lỗi, và BỊA ra nội dung.
 * Agent vốn đã chạy trên sol nên không cần ép model; nhưng nếu có ngày đổi
 * model cho `agent_code` thì phải kiểm lại chỗ này TRƯỚC.
 */
export type KhoiNoiDung =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }
  /**
   * PDF đính kèm (hình dạng OpenAI `file`, data URI). Cổng Claude chính hãng
   * nhận NGUYÊN BẢN (khối `document`); cổng khác nhận một dòng báo không đọc được.
   */
  | { type: 'file'; file: { filename: string; file_data: string } };

export type AgentMessage =
  | { role: 'user'; content: string | KhoiNoiDung[] }
  | {
      role: 'assistant';
      content: string | null;
      tool_calls?: ToolCall[];
      /**
       * Khối Anthropic GỐC của lượt này (thinking + chữ ký, compaction, server
       * tool) — CHỈ cổng Claude chính hãng sinh ra và đọc. App phải giữ NGUYÊN
       * VĂN và gửi lại ở lượt sau (API đòi thinking không bị sửa; khối
       * compaction đi lại thì máy chủ bỏ phần cũ). Đường khác bỏ qua trường này.
       */
      khoiAnthropic?: Array<Record<string, unknown>>;
    }
  | {
      role: 'tool';
      tool_call_id: string;
      content: string;
      /**
       * Ảnh kèm kết quả tool — hiện chỉ `web_anh` dùng.
       *
       * ⚠️ CHỈ đi được qua tuyến ANTHROPIC. Giao thức OpenAI không có chỗ cho
       * ảnh trong `role:'tool'`; ở tuyến đó ảnh bị BỎ và thay bằng một dòng
       * chữ nói rõ là đã bỏ — thà model biết mình không được xem còn hơn nó
       * tưởng đã xem rồi bịa ra bố cục.
       */
      anh?: Array<{ media_type: string; data: string }>;
    };

/** Sự kiện đẩy ra SSE cho app. */
export type AgentEvent =
  /**
   * `buoc`/`tranBuoc` — bước THỨ MẤY trên tổng bao nhiêu, cho việc đang làm.
   *
   * Người dùng báo 19/08/2026 rằng agent "đứng luôn". Một phần là lỗi thật
   * (trần bước đếm cả cuộc), nhưng phần còn lại là KHÔNG NHÌN THẤY GÌ: cổng
   * này không chảy chữ thật (đo 121 mẩu về cùng một mili giây), nên giữa hai
   * lần gọi là một khoảng lặng dài không phân biệt được với treo. Biết mình
   * đang ở "bước 7/8" vừa giải thích được sự chờ, vừa báo trước sắp chạm trần.
   */
  | { type: 'start'; model: string; buoc: number; tranBuoc: number; cong?: 'chinh' | 'du-phong' | 'anthropic' }
  /**
   * Đổi cổng: rambo hỏng ⇒ cổng phụ. `du-phong` = modelapi (vé dự phòng),
   * `anthropic` = Claude chính hãng. Khi tự chuyển sang CuongMini Free thì kèm
   * `ma: 'CONG_CHINH_HONG_FREE'`, `thongDiep`, `moiNangCap` và `cacCong` để app
   * hiện lời mời nâng cấp (xem docs/cong-anthropic-chinh-hang.md).
   */
  | {
      type: 'cong';
      cong: 'du-phong' | 'anthropic';
      model: string;
      ten?: string;
      ma?: 'CONG_CHINH_HONG_FREE' | 'DOI_CONG';
      thongDiep?: string;
      moiNangCap?: boolean;
      cacCong?: CongNangCap[];
    }
  | { type: 'text'; delta: string }
  /** Model đang suy nghĩ (khối thinking, chữ ẩn) — app có thể hiện "Đang suy nghĩ…". Chỉ cổng chính hãng. */
  | { type: 'nghi' }
  /** Máy chủ ĐÃ chạy xong một tool vòng 2 — chỉ để hiện tiến trình. */
  | { type: 'server_tool'; name: string; summary: string }
  /** App phải chạy cái này rồi gọi lại. */
  | { type: 'tool_call'; id: string; name: string; args: Record<string, unknown> }
  | {
      type: 'done';
      /** Nối NGUYÊN VĂN vào cuối hội thoại phía app. */
      append: AgentMessage[];
      /**
       * App phải làm gì tiếp:
       *   'end'        — xong, hiện câu trả lời, chờ người dùng gõ tiếp.
       *   'tool_calls' — chạy các khung `tool_call` vừa nhận, nối kết quả, gọi lại.
       *   'continue'   — KHÔNG có việc gì để chạy, cứ gọi lại ngay với hội thoại
       *                  đã nối. Xảy ra khi máy chủ dùng hết lượt tự đi tiếp của
       *                  mình. Tách riêng khỏi 'tool_calls' là có chủ ý: gộp
       *                  chung thì app phải suy ra bằng cách đếm số khung
       *                  `tool_call` nhận được, và một app quên đếm sẽ đứng im
       *                  vĩnh viễn ở đúng chỗ này — nó đã xảy ra ngay trong bộ
       *                  kiểm thử đầu tiên của chính tính năng này (17/08).
       *   'max_steps'  — chạm trần bước, dừng hẳn, mời người dùng hỏi lại.
       */
      stop: 'end' | 'tool_calls' | 'continue' | 'max_steps';
      usage: { inputTokens: number; outputTokens: number; costUsd: number };
      /** USD của lượt (cổng chính hãng: bảng giá chính thức gồm đọc/ghi đệm + compact + tìm web). */
      tienUsd?: number;
      /** Token đọc/ghi đệm của lượt (cổng Anthropic) — app hiện tỉ lệ trúng đệm nếu muốn. */
      dem?: { doc: number; ghi: number };
      /** Hạn mức 5 giờ SAU lượt này — app vẽ thẳng lên thanh đo, không phải hỏi lại. */
      quota: { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null };
      /**
       * Ngữ cảnh đã dùng tới đâu — để app vẽ vòng tròn.
       *
       * Con số này là thứ người dùng KHÔNG có cách nào tự biết: họ nhìn thấy
       * hội thoại trên màn hình nhưng không biết bao nhiêu phần trong đó còn
       * thật sự tới được model.
       */
      nguCanh: { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number; token?: number; cuaSo?: number };
      /** Có nén ngữ cảnh không, và cắt được bao nhiêu. Để hiện "đã lược N kết quả cũ". */
      compact?: { soDaLuoc: number; kyTuDaCat: number };
    }
  /**
   * `coKeyGiaHan` CHỈ đi kèm `AGENT_QUOTA_EXCEEDED` (02/10/2026): admin đã đặt
   * key gia hạn ⇒ app hiện ô "Nhập key để làm tiếp". Không có ⇒ app im ô đó.
   */
  | { type: 'error'; error: string; code?: string; coKeyGiaHan?: boolean };

export interface AgentTurnInput {
  messages: unknown;
  capabilities: unknown;
  workspace?: WorkspaceHint;
  /** Cấp độ nỗ lực người dùng chọn. Quyết định trần bước, KHÔNG quyết định model. */
  mucNoLuc?: unknown;
  /** Mã model người dùng chọn — đối chiếu danh sách trắng ở `models.ts`. */
  model?: unknown;
  /**
   * Vé cổng dự phòng (modelapi) — app nhận khi người dùng nhập đúng mật khẩu.
   * Chỉ có tác dụng lúc rambo HỎNG; rambo khoẻ thì bị bỏ qua. Xem `congDuPhong.ts`.
   */
  duPhongVe?: unknown;
  /** Model người dùng chọn cho cổng dự phòng (`gpt-6-sol` | `gpt-6-astra`). */
  duPhongModel?: unknown;
  /**
   * Vé cổng Claude chính hãng (mật khẩu RIÊNG, `POST /agent/cong-anthropic/mo-khoa`).
   * Mở các model cao `cl-*`. CuongMini Free (`cl-free`) không cần vé. Admin không cần vé.
   */
  congAnthropicVe?: unknown;
  /**
   * Cổng phụ người dùng MUỐN khi rambo hỏng/đang giữ: `'modelapi'` ⇒ đi vé dự
   * phòng (GPT) thay vì CuongMini Free. Bỏ trống ⇒ Free (app cũ: `duPhongGiu`
   * + vé dự phòng thật vẫn đi modelapi như trước).
   */
  congPhu?: unknown;
  /**
   * Lượt PHỤ (`laPhu: true`): mức model của việc phụ — `nhanh` | `can_bang` |
   * `manh` | `ke_thua` (mặc định). App lấy từ tham số `model` của tool
   * `giao_viec_phu`, không có thì từ khoá `model:` của `.claude/agents/<loai>.md`
   * (haiku→nhanh, sonnet→can_bang, opus→manh, inherit→ke_thua). Máy chủ
   * KHÔNG BAO GIỜ chọn model đắt hơn model chính; vẫn tính trần như lượt chính.
   */
  mucModelPhu?: unknown;
  /**
   * Tab này đang BÁM cổng dự phòng (app giữ tới khi người dùng bấm quay về) ⇒
   * đi thẳng dự phòng, không gõ cửa rambo giữa một việc — tránh đổi model giữa
   * chừng và tránh thông báo đổi cổng nhấp nháy mỗi phút.
   */
  duPhongGiu?: unknown;
  /** Lượt này thuộc một AGENT PHỤ — prompt gọn hơn, trần bước riêng. */
  laPhu?: unknown;
  /**
   * Đợt 3: `'ghi'` = agent phụ GHI (`giao_viec_ghi`) — giữ tool đọc/sửa/chạy lệnh trong KHU RIÊNG của
   * app, trần 25 bước. Mọi khả năng khác (giao việc tiếp, git ghi, GitHub, trình duyệt, MCP…) bị LỌC BỎ ở đây
   * dù app có gửi — agent phụ không được lồng, không đẩy gì ra ngoài.
   */
  quyenPhu?: unknown;
  /**
   * Ghi chú dự án (`AGENTS.md`/`CLAUDE.md`) app đọc từ máy người dùng.
   *
   * App gửi lên NGUYÊN VĂN; máy chủ mới là bên cắt về trần và bọc rào. Cắt ở
   * app thì mỗi bản app cũ giữ một cái trần khác nhau, và sửa trần phải chờ
   * người dùng cập nhật app.
   */
  ghiChuDuAn?: { ten: string; noiDung: string };
  /** Mục lục bộ nhớ app gửi lên (chuỗi đã cắt trần phía app). */
  boNho?: string;
  kyNang?: Array<{ ten: string; moTa: string }>;
  /** Loại agent phụ dự án khai — tên + mô tả, để model biết gọi `loai` nào. */
  agentPhu?: Array<{ ten: string; moTa: string }>;
  /** Prompt riêng cho lượt phụ, lấy từ `.claude/agents/<loại>.md` của dự án. */
  promptPhu?: string;
  /**
   * Tool MCP app phát hiện được trên máy người dùng.
   *
   * Bộ tool DUY NHẤT không do máy chủ sở hữu — xem `parseToolMcp` trong
   * `tools.ts` để biết vì sao, và vì sao mô tả của chúng bị rào lại.
   */
  toolMcp?: unknown;
  userId: number;
}

/** Lỗi có thể trả thẳng cho app dưới dạng HTTP, trước khi mở SSE. */
export class AgentInputError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AgentInputError';
  }
}

// ─── Làm sạch đầu vào ──────────────────────────────────────────────

/**
 * App KHÔNG được đặt prompt hệ thống.
 *
 * Hàm này lọc bỏ mọi tin nhắn `role: 'system'` app gửi lên và tự dựng lại
 * prompt từ `prompt.ts`. Đây không phải chuyện gọn gàng — app chạy trên máy
 * người dùng, tệp `.asar` mở bằng một lệnh, nên "app gửi gì cũng tin" nghĩa là
 * bất kỳ ai cũng đặt lại được luật bảo mật ở mục 5 của prompt. Luật đó chỉ có
 * nghĩa khi máy chủ là nơi duy nhất viết ra nó.
 */
export function sanitizeIncoming(raw: unknown): AgentMessage[] {
  if (!Array.isArray(raw)) throw new AgentInputError('messages phải là mảng', 'BAD_MESSAGES');
  if (raw.length === 0) throw new AgentInputError('messages rỗng', 'BAD_MESSAGES');
  /*
   * ⚠️ KHÔNG NÉM KHI QUÁ DÀI — kể cả ở trần tuyệt đối.
   *
   * Bản trước vẫn ném khi vượt `MAX_MESSAGES * 5`, với lý do "chặn payload ác
   * ý". Người dùng gặp thật 15/09/2026: agent đang làm dở một việc còn ~26
   * bước thì dừng hẳn với `messages quá lớn (1001)` — đúng cái mà `catCu.ts`
   * được viết ra để tránh, chỉ khác là nó không bao giờ chạy tới vì cú ném này
   * đứng chặn ở trước.
   *
   * Mà trần đó cũng không chặn được payload ác ý: kẻ xấu gửi 999 tin nhắn mỗi
   * cái 1MB thì vẫn lọt. Thứ chặn payload là giới hạn kích thước THÂN yêu cầu
   * ở tầng Express, không phải số phần tử mảng.
   *
   * Nay: cắt bớt rồi đi tiếp. `catLuotCu` ở dưới sẽ cắt tiếp cho đúng trần
   * thật và chèn lời nhắc để model BIẾT nó vừa mất ngữ cảnh gì.
   */
  /* Biến MỚI chứ không gán đè `raw`: gán đè làm TypeScript mất kết quả thu
     hẹp kiểu của `Array.isArray` ở trên, và vòng lặp dưới quay về `unknown`. */
  const vao: unknown[] = raw.length > TRAN_TUYET_DOI
    ? catThoChoAnToan(raw, TRAN_TUYET_DOI)
    : raw;

  const out: AgentMessage[] = [];
  let tongChu = 0;

  for (const m of vao) {
    if (!m || typeof m !== 'object') continue;
    const role = (m as { role?: unknown }).role;

    if (role === 'user') {
      const tho = (m as { content?: unknown }).content;
      if (Array.isArray(tho)) {
        // Lượt có ảnh. Lọc CHẶT: chỉ nhận `text` và `image_url` với data URI
        // ảnh — một `image_url` trỏ ra Internet là biến agent thành công cụ
        // gọi ra ngoài thay mặt người dùng, mà chẳng ai duyệt lời gọi đó.
        const khoi: KhoiNoiDung[] = [];
        let soAnh = 0;
        let soPdf = 0;
        for (const k of tho) {
          if (!k || typeof k !== 'object') continue;
          const t = (k as { type?: unknown }).type;
          if (t === 'text') {
            const text = String((k as { text?: unknown }).text ?? '');
            tongChu += text.length;
            khoi.push({ type: 'text', text });
          } else if (t === 'file' && soPdf < MAX_PDF) {
            const f = (k as { file?: { filename?: unknown; file_data?: unknown } }).file;
            const data = String(f?.file_data ?? '');
            if (!data.startsWith('data:application/pdf;base64,') || data.length > MAX_PDF_BYTES) continue;
            soPdf++;
            khoi.push({ type: 'file', file: { filename: String(f?.filename ?? 'tai-lieu.pdf').slice(0, 200), file_data: data } });
          } else if (t === 'image_url' && soAnh < MAX_ANH) {
            const url = String((k as { image_url?: { url?: unknown } }).image_url?.url ?? '');
            if (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(url)) continue;
            if (url.length > MAX_ANH_BYTES) continue;
            soAnh++;
            khoi.push({ type: 'image_url', image_url: { url } });
          }
        }
        if (khoi.length) out.push({ role: 'user', content: khoi });
        continue;
      }
      const content = String(tho ?? '');
      tongChu += content.length;
      out.push({ role: 'user', content });
    } else if (role === 'assistant') {
      const content = (m as { content?: unknown }).content;
      const calls = parseToolCalls((m as { tool_calls?: unknown }).tool_calls);
      tongChu += typeof content === 'string' ? content.length : 0;
      const khoiAnthropic = docKhoiAnthropic((m as { khoiAnthropic?: unknown }).khoiAnthropic, calls);
      out.push({
        role: 'assistant',
        content: typeof content === 'string' ? content : null,
        ...(calls.length ? { tool_calls: calls } : {}),
        ...(khoiAnthropic ? { khoiAnthropic } : {}),
      });
    } else if (role === 'tool') {
      const id = String((m as { tool_call_id?: unknown }).tool_call_id ?? '');
      if (!id) continue; // không có id thì cổng từ chối cả lượt — bỏ còn hơn
      let content = String((m as { content?: unknown }).content ?? '');
      if (content.length > MAX_TOOL_RESULT_CHARS) {
        content = `${content.slice(0, MAX_TOOL_RESULT_CHARS)}\n[… máy chủ cắt bớt, kết quả gốc ${content.length} ký tự]`;
      }
      tongChu += content.length;

      /* Ảnh kèm kết quả tool (`web_anh`). Lọc cùng luật như ảnh người dùng
         gửi: đúng kiểu, đúng trần dung lượng, đúng số lượng. App là phía
         KHÔNG TIN được — nó chạy trên máy người dùng và ai sửa được gói tin
         cũng gửi được vào đây. */
      const anhTho = (m as { anh?: unknown }).anh;
      const anh: Array<{ media_type: string; data: string }> = [];
      if (Array.isArray(anhTho)) {
        for (const a of anhTho.slice(0, MAX_ANH)) {
          const kieu = String((a as { media_type?: unknown })?.media_type ?? '');
          const data = String((a as { data?: unknown })?.data ?? '');
          if (!/^image\/(png|jpeg|webp|gif)$/.test(kieu)) continue;
          if (!data || data.length > MAX_ANH_BYTES) continue;
          anh.push({ media_type: kieu, data });
        }
      }
      out.push({ role: 'tool', tool_call_id: id, content, ...(anh.length ? { anh } : {}) });
    }
    // 'system' rơi vào đây và bị bỏ — có chủ ý, xem ghi chú đầu hàm.
  }

  // `tongChu` CỐ Ý không cộng độ dài data URI của ảnh: một ảnh 2MB là ~2,7
  // triệu ký tự base64, tức là một tấm ảnh sẽ tự mình vượt trần 600k và chặn
  // cả hội thoại. Ảnh có trần riêng (`MAX_ANH`, `MAX_ANH_BYTES`) ở trên.
  if (out.length === 0) throw new AgentInputError('Không có tin nhắn hợp lệ nào', 'BAD_MESSAGES');
  return out;
}

/** Số PDF mỗi tin, và trần một data URI PDF (~6MB tệp). */
const MAX_PDF = 4;
const MAX_PDF_BYTES = 8_000_000;

/** Kiểu khối Anthropic gốc được nhận lại từ app — danh sách TRẮNG. */
const KHOI_ANTHROPIC_HOP_LE = new Set([
  'thinking', 'redacted_thinking', 'text', 'tool_use', 'compaction',
  'server_tool_use', 'web_search_tool_result', 'web_fetch_tool_result',
  'code_execution_tool_result', 'bash_code_execution_tool_result', 'text_editor_code_execution_tool_result',
]);

/**
 * `khoiAnthropic` app gửi lại: chỉ nhận khi đúng danh sách trắng, không quá to,
 * và các `tool_use` khớp ĐÚNG `tool_calls` của tin đó (không cho app chèn một
 * lời gọi tool khác vào lịch sử). Sai ⇒ bỏ cả mảng, tin vẫn dựng lại từ
 * `content`/`tool_calls` như cũ.
 */
function docKhoiAnthropic(raw: unknown, calls: ToolCall[]): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(raw) || !raw.length || raw.length > 400) return undefined;
  if (JSON.stringify(raw).length > 4_000_000) return undefined;
  const ra: Array<Record<string, unknown>> = [];
  for (const k of raw) {
    if (!k || typeof k !== 'object' || !KHOI_ANTHROPIC_HOP_LE.has(String((k as { type?: unknown }).type))) return undefined;
    ra.push(k as Record<string, unknown>);
  }
  const idTool = ra.filter((k) => k.type === 'tool_use').map((k) => String(k.id));
  const idCall = calls.map((c) => c.id);
  if (idTool.length !== idCall.length || idTool.some((id, i) => id !== idCall[i])) return undefined;
  return ra;
}

function parseToolCalls(raw: unknown): ToolCall[] {
  if (!Array.isArray(raw)) return [];
  const out: ToolCall[] = [];
  for (const c of raw) {
    if (!c || typeof c !== 'object') continue;
    const id = String((c as { id?: unknown }).id ?? '');
    const fn = (c as { function?: { name?: unknown; arguments?: unknown } }).function;
    if (!id || !fn || typeof fn.name !== 'string') continue;
    out.push({ id, type: 'function', function: { name: fn.name, arguments: String(fn.arguments ?? '{}') } });
  }
  return out;
}

/**
 * Đã đi bao nhiêu bước. Đếm từ chính hội thoại app gửi lên chứ không tin một
 * con số app tự khai — số app khai thì một app hỏng sẽ khai lại từ 0 mỗi lần,
 * và cái trần trở thành trang trí.
 */
/**
 * Số bước ĐÃ ĐI TRONG VIỆC ĐANG LÀM.
 *
 * ⚠️ TRƯỚC 19/08/2026 HÀM NÀY ĐẾM CẢ CUỘC TRÒ CHUYỆN, và đó là một lỗi nặng
 * núp sau một câu thông báo nghe rất hợp lý.
 *
 * Người dùng gặp: "Đã chạm trần 8 bước trong một việc. Hãy hỏi lại câu hỏi
 * hẹp hơn, hoặc bắt đầu việc mới." — hiện ra NGAY, trước khi agent làm gì.
 * Vì bộ đếm gộp cả những câu hỏi TRƯỚC trong cùng cuộc: ở mức Thấp (8 bước),
 * sau khoảng tám lời gọi tool cộng dồn thì MỌI câu hỏi sau đều bị từ chối
 * tức khắc. Cuộc trò chuyện chết hẳn.
 *
 * Chỗ độc của nó: câu thông báo tự đề nghị "bắt đầu việc mới", nên lỗi trông
 * y hệt một giới hạn có chủ ý. Người dùng mở cuộc mới, thấy hết, và không ai
 * báo là hỏng.
 *
 * "Một việc" = từ tin nhắn `user` GẦN NHẤT trở đi. Người dùng gõ câu mới là
 * họ giao việc mới, và trần phải tính lại từ đầu — đúng như chữ "trong một
 * việc" vẫn nói.
 */
export function demBuocViecNay(messages: AgentMessage[]): number {
  let dau = -1;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === 'user') { dau = i; break; }
  }
  return messages
    .slice(dau + 1)
    .filter((m) => m.role === 'assistant' && m.tool_calls?.length)
    .length;
}

// ─── Chống lặp (26/09/2026) ────────────────────────────────────────
//
// Đo thật: agent hay đọc lại đúng file vừa đọc, hoặc quay vòng "sửa → chạy →
// hỏng → sửa y hệt". Mỗi vòng như thế chở theo 17k–57k token vào. Máy chủ KHÔNG
// giữ trạng thái, nên mọi phát hiện ở đây tính lại từ chính hội thoại app gửi
// lên — cùng nguyên tắc với `demBuocViecNay`.

/**
 * Tool CHỈ ĐỌC: gọi lại cùng tham số mà giữa hai lần không có thao tác ghi
 * nào thì kết quả KHÔNG đổi.
 *
 * ⚠️ `doc_dau_ra_nen` và `terminal_doc` CỐ Ý không nằm đây dù chúng chỉ đọc:
 * chúng trả phần đầu ra MỚI kể từ lần đọc trước, nên gọi lại cùng tham số là
 * cách CHÍNH ĐÁNG để theo dõi một lệnh build đang chạy. Chặn chúng là giết
 * đúng vòng chờ build.
 */
const TOOL_CHI_DOC = new Set([
  'read_file', 'grep', 'glob', 'list_dir', 'git_status', 'git_diff', 'web_doc',
  'notes_read', 'notes_search', 'notes_tree', 'doc_web', 'tim_web',
]);

/** Đọc trạng thái TRÔI — lặp lại là bình thường (theo dõi lệnh nền/terminal). */
const TOOL_DOC_TROI = new Set(['doc_dau_ra_nen', 'terminal_doc']);

/** Không đọc cũng không đổi thứ gì agent đọc lại được. */
const TOOL_TRUNG_TINH = new Set(['cap_nhat_ke_hoach', 'dung_ky_nang', 'giao_viec_phu']);

/**
 * Có coi là thao tác GHI không. Ngoài danh sách tường minh (edit_file,
 * create_file, sua_nhieu_cho, xoa_file, doi_ten_file, run_command,
 * chay_lenh_nen, terminal_mo, terminal_gui, sua_anh, git_commit,
 * ghi_file_ngoai), mọi tool LẠ cũng tính là ghi: `web_bam` đổi trang mà
 * `web_doc` đọc, tool MCP làm gì thì máy chủ không biết. Coi nhầm là ghi chỉ
 * làm mất một lần tiết kiệm; coi nhầm là đọc thì trả kết quả CŨ cho một trạng
 * thái đã đổi — sai hẳn.
 */
function laGhi(ten: string): boolean {
  return !TOOL_CHI_DOC.has(ten) && !TOOL_DOC_TROI.has(ten) && !TOOL_TRUNG_TINH.has(ten);
}

/** Câu trả thay cho lời gọi đọc trùng. Cũng dùng để nhận ra kết quả tổng hợp. */
export const CAU_TRUNG_DOC =
  'Trùng lời gọi ở bước trước; chưa có thao tác ghi nào nên kết quả không đổi — dùng lại kết quả đó (đang còn trong hội thoại).';

/** JSON với khoá SẮP XẾP — `{"a":1,"b":2}` và `{"b":2,"a":1}` là cùng một lời gọi. */
function jsonSapKhoa(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(jsonSapKhoa).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v as Record<string, unknown>).sort()
      .map((k) => `${JSON.stringify(k)}:${jsonSapKhoa((v as Record<string, unknown>)[k])}`).join(',')}}`;
  }
  return JSON.stringify(v) ?? 'null';
}

function chuKy(c: ToolCall): string {
  let args: string;
  try { args = jsonSapKhoa(JSON.parse(c.function.arguments || '{}')); } catch { args = c.function.arguments; }
  return `${c.function.name} ${args}`;
}

const rutMoTa = (ck: string): string => (ck.length > 140 ? `${ck.slice(0, 140)}…` : ck);

export interface KetQuaLap {
  /** Lời gọi CHỈ ĐỌC trong tin assistant CUỐI trùng một lời gọi trước — máy chủ tự trả. */
  trungDoc: Array<{ id: string; idCu: string; ten: string }>;
  /** Lặp đáng nhắc: cùng chữ ký ≥ 3 lần, hoặc một chuỗi k lời gọi lặp lại. */
  lap: { moTa: string; soLan: number } | null;
}

/**
 * Phát hiện lặp trong VIỆC ĐANG LÀM (từ tin `user` gần nhất). Hàm thuần.
 *
 * (a) `trungDoc` — chỉ xét tin cuối nếu nó là tin assistant đang đòi tool
 *     (chưa có kết quả). Một lời gọi chỉ đọc được trả thay khi: có lời gọi cùng
 *     chữ ký TRƯỚC ĐÓ đã có kết quả thật; giữa hai lần không có lời gọi ghi
 *     nào (kể cả trong chính tin cuối); và kết quả cũ SẼ còn nguyên văn ở lượt
 *     gửi kế tiếp (chưa rơi vào vùng lược của `compact.ts`) — nói "dùng lại kết
 *     quả trong hội thoại" khi nó đã bị lược là nói dối model.
 *
 * (b) `lap` — tính trên chuỗi mọi lời gọi của việc này (trừ đọc trạng thái
 *     trôi). Chuỗi k lời gọi cuối (k = 2..4) lặp lại đúng chuỗi k trước đó;
 *     với k = 1 đòi 3 lần liền (2 lần liền còn có thể là "chạy lại cho chắc").
 *     Không có chuỗi thì xét lời gọi CUỐI đã xuất hiện ≥ 3 lần kể cả khi có
 *     ghi xen giữa. Chỉ nhìn lời gọi cuối để lời nhắc không bám mãi cả việc
 *     sau khi agent đã đổi hướng.
 */
export function phatHienLap(messages: readonly AgentMessage[]): KetQuaLap {
  let dau = -1;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === 'user') { dau = i; break; }
  }

  const ketQua = new Map<string, string>();
  const doDaiTool: number[] = [];
  const thuTuTool = new Map<string, number>();
  for (const m of messages) {
    if (m.role !== 'tool') continue;
    thuTuTool.set(m.tool_call_id, doDaiTool.length);
    doDaiTool.push(m.content.length);
    ketQua.set(m.tool_call_id, m.content);
  }

  const goi: Array<{ c: ToolCall; ck: string; iTin: number }> = [];
  for (let i = dau + 1; i < messages.length; i += 1) {
    const m = messages[i]!;
    if (m.role === 'assistant' && m.tool_calls) {
      for (const c of m.tool_calls) goi.push({ c, ck: chuKy(c), iTin: i });
    }
  }

  // ── (a) đọc trùng ──
  const trungDoc: KetQuaLap['trungDoc'] = [];
  const cuoi = messages[messages.length - 1];
  if (cuoi && cuoi.role === 'assistant' && cuoi.tool_calls?.length && messages.length - 1 > dau) {
    const ungVien = cuoi.tool_calls;
    const coGhi = ungVien.some((c) => laGhi(c.function.name));
    // Mốc lược của lượt gửi KẾ TIẾP: mỗi lời gọi đang chờ sẽ thêm một kết quả.
    const mocSau = tinhMoc([...doDaiTool, ...ungVien.map(() => 0)]);
    const truoc = goi.filter((g) => g.iTin < messages.length - 1);
    if (!coGhi) {
      for (const c of ungVien) {
        if (!TOOL_CHI_DOC.has(c.function.name)) continue;
        const ck = chuKy(c);
        for (let k = truoc.length - 1; k >= 0; k -= 1) {
          const p = truoc[k]!;
          if (laGhi(p.c.function.name)) break;
          if (p.ck !== ck) continue;
          const kq = ketQua.get(p.c.id);
          if (kq === undefined || kq.startsWith(CAU_TRUNG_DOC)) continue; // tìm tiếp lần đọc THẬT
          if ((thuTuTool.get(p.c.id) ?? -1) >= mocSau) {
            trungDoc.push({ id: c.id, idCu: p.c.id, ten: c.function.name });
          }
          break;
        }
      }
    }
  }

  // ── (b) lặp ──
  const chuoi = goi.filter((g) => !TOOL_DOC_TROI.has(g.c.function.name)).map((g) => g.ck);
  let lap: KetQuaLap['lap'] = null;
  for (let k = 1; k <= 4 && !lap; k += 1) {
    const canKhoi = k === 1 ? 3 : 2;
    if (chuoi.length < k * canKhoi) continue;
    const mau = chuoi.slice(-k);
    let soKhoi = 1;
    while (chuoi.length >= k * (soKhoi + 1)) {
      const khoi = chuoi.slice(chuoi.length - k * (soKhoi + 1), chuoi.length - k * soKhoi);
      if (khoi.every((x, j) => x === mau[j])) soKhoi += 1; else break;
    }
    if (soKhoi >= canKhoi) {
      lap = {
        moTa: k === 1 ? rutMoTa(mau[0]!) : `chuỗi ${k} lời gọi ${mau.map((x) => x.split(' ')[0]).join(' → ')}`,
        soLan: soKhoi,
      };
    }
  }
  if (!lap && chuoi.length) {
    const ckCuoi = chuoi[chuoi.length - 1]!;
    const soLan = chuoi.filter((x) => x === ckCuoi).length;
    if (soLan >= 3) lap = { moTa: rutMoTa(ckCuoi), soLan };
  }

  return { trungDoc, lap };
}

/** Câu nhắc khi phát hiện lặp. */
export function loiNhacLap(l: { moTa: string; soLan: number }): string {
  return `⚠️ Bạn đang lặp: ${l.moTa} (${l.soLan} lần). `
    + "Theo luật 'KHI MỘT CÁCH KHÔNG ĂN': đổi hướng hoặc dừng lại hỏi người dùng.";
}

export const NHAC_BUOC_CUOI = 'Đây là bước CUỐI: KHÔNG gọi tool nữa, viết tóm tắt đầy đủ các phát hiện.';

/**
 * Gắn lời nhắc vào ĐUÔI bản gửi cổng — tin `user`/`tool` cuối cùng.
 *
 * Trả BẢN SAO, không sửa mảng gốc: lời nhắc không được lưu vào hội thoại. Lưu
 * vào thì nó nằm lại giữa tiền tố ở mọi lượt sau (làm bẩn đệm) và nhắc mãi một
 * chuyện đã qua. Ở đuôi thì nó chỉ đổi đúng phần vốn đã đổi mỗi bước.
 */
export function ganNhacDuoi(messages: readonly AgentMessage[], nhac: string): AgentMessage[] {
  const ra = [...messages];
  for (let i = ra.length - 1; i >= 0; i -= 1) {
    const m = ra[i]!;
    if (m.role === 'tool') { ra[i] = { ...m, content: `${m.content}\n\n[Hệ thống] ${nhac}` }; return ra; }
    if (m.role === 'user') {
      ra[i] = typeof m.content === 'string'
        ? { role: 'user', content: `${m.content}\n\n[Hệ thống] ${nhac}` }
        : { role: 'user', content: [...m.content, { type: 'text', text: `[Hệ thống] ${nhac}` }] };
      return ra;
    }
  }
  return ra;
}

/**
 * Nội dung trả về khi VIỆC PHỤ chạm trần bước: gom mọi đoạn chữ nó đã viết.
 *
 * Trước 26/09/2026 chỉ là câu cố định "Việc phụ đã chạm trần N bước." — app
 * lấy đúng câu đó làm "kết quả việc phụ", nên agent chính mất sạch những gì
 * việc phụ đã tìm ra trong 10 bước (mà người dùng đã trả tiền cho cả 10).
 */
export function gomPhatHienViecPhu(messages: readonly AgentMessage[], tran: number): string {
  let dau = -1;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === 'user') { dau = i; break; }
  }
  const viec = messages.slice(dau + 1);
  const doan = viec
    .filter((m): m is Extract<AgentMessage, { role: 'assistant' }> => m.role === 'assistant')
    .map((m) => (m.content ?? '').trim())
    .filter(Boolean);
  const daGoi: string[] = [];
  for (const m of viec) {
    if (m.role !== 'assistant' || !m.tool_calls) continue;
    for (const c of m.tool_calls) {
      let a: Record<string, unknown> = {};
      try { a = JSON.parse(c.function.arguments || '{}') ?? {}; } catch { /* bỏ */ }
      const chu = [a.path, a.pattern, a.command, a.lenh, a.url, a.query].find((x) => typeof x === 'string') as string | undefined;
      const dong = chu ? `${c.function.name} ${chu.slice(0, 100)}` : c.function.name;
      if (!daGoi.includes(dong)) daGoi.push(dong);
    }
  }
  let than = doan.join('\n\n');
  // Trần 12k: giữ phần CUỐI — kết luận thường nằm ở những đoạn sau.
  if (than.length > 12_000) than = `…\n${than.slice(-12_000)}`;
  return `Việc phụ đã chạm trần ${tran} bước trước khi kịp tự tóm tắt. `
    + 'Dưới đây là MỌI điều nó đã ghi nhận được — dùng làm phát hiện, phần còn thiếu thì tự kiểm lại.\n\n'
    + (than || '(việc phụ không viết đoạn chữ nào)')
    + (daGoi.length ? `\n\nĐã gọi: ${daGoi.slice(0, 20).join(' · ')}` : '');
}

/**
 * Phân loại lỗi cổng thành mã cho app (26/09/2026).
 *
 * Trước đây mọi lỗi cổng là `LLM_ERROR`, và app THỬ LẠI `LLM_ERROR` tới 4 lần
 * — kể cả `HTTP 400 prompt is too long` hay `401` sai khoá, những lỗi mà gửi
 * lại y hệt thì trả về y hệt. Mỗi lần thử lại chở 17k–94k token vào.
 *
 *   LLM_NO_PROVIDER — cổng không có kênh cho model (xem ghi chú ở chỗ phát).
 *   LLM_ERROR_4XX   — lỗi TẤT ĐỊNH (400/401/403/404/413/422, hoặc lỗi luồng
 *                     kiểu invalid_request/authentication/permission…).
 *                     App KHÔNG được thử lại.
 *   CONNECTION_LOST — kết nối đứt giữa chừng.
 *   LLM_ERROR       — còn lại: 429/5xx/mạng — lỗi TẠM, thử lại là đúng.
 */
export function maLoiCong(message: string): 'LLM_NO_PROVIDER' | 'LLM_ERROR_4XX' | 'CONNECTION_LOST' | 'LLM_ERROR' {
  if (/unknown provider for model|No available channel/i.test(message)) return 'LLM_NO_PROVIDER';
  const ma = /HTTP (\d{3})/.exec(message)?.[1];
  if (ma && ['400', '401', '403', '404', '413', '422'].includes(ma)) return 'LLM_ERROR_4XX';
  if (/invalid_request_error|authentication_error|permission_error|not_found_error|request_too_large/.test(message)) {
    return 'LLM_ERROR_4XX';
  }
  if (/aborted|ECONNRESET|socket hang up|terminated|fetch failed|ETIMEDOUT/i.test(message)) return 'CONNECTION_LOST';
  return 'LLM_ERROR';
}

/** Cổng đôi khi rò token dừng nội bộ ra câu trả lời — xem ghi chú `agent_code` trong gateway.ts. */
function catRacCong(s: string): string {
  return s.replace(/<CPA_DONE>/g, '').replace(/<\|[a-z_]+\|>/gi, '');
}

// ─── Động cơ ───────────────────────────────────────────────────────

export async function runAgentTurn(
  input: AgentTurnInput,
  emit: (e: AgentEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  if (!gatewayConfigured()) {
    emit({ type: 'error', error: 'Máy chủ chưa cấu hình khoá AI.', code: 'LLM_UNCONFIGURED' });
    return;
  }

  const messagesGoc = sanitizeIncoming(input.messages);
  /**
   * Tự bỏ lượt cũ khi chạm trần, thay vì từ chối cả lượt.
   *
   * Thứ tự quan trọng: CẮT trước, NÉN sau. Nén rút gọn kết quả tool trong phần
   * còn lại; cắt bỏ hẳn những lượt cũ nhất. Làm ngược thì công nén bỏ ra cho
   * những lượt sắp bị vứt là công vô ích.
   */
  // Chừa CHO_GHI_NHO ký tự dưới trần cho đề bài ghim + bản tóm tắt chèn vào đầu.
  /* Chọn TAY model cao của cổng chính hãng (cửa sổ 1M) ⇒ trần ký tự rộng hơn —
     chất lượng trước; compact phía máy chủ lo phần quá dài. Mọi đường khác giữ trần cũ. */
  const tranKyTu = modelChinhHangTu(input.model)?.hang === 'cao' ? TRAN_KY_TU_CHINH_HANG : MAX_TOTAL_CHARS;
  /** Cửa sổ ngữ cảnh (token) để tính "context %" từ usage thật. */
  const cuaSoToken = modelChinhHangTu(input.model)?.hang === 'cao' ? 1_000_000 : 200_000;
  const boLuot = catLuotCu(messagesGoc, tranKyTu - CHO_GHI_NHO, MAX_MESSAGES);
  let messages = boLuot.messages;
  if (boLuot.soLuotDaBo > 0) {
    /* Không quên sạch: ghim đề bài + tóm tắt các lượt bị bỏ (đệm theo băm nên chỉ
       tốn một lời gọi model rẻ khi phần bị bỏ thay đổi). Hỏng ⇒ lời nhắc cũ. */
    const ghiNho = await ghiNhoLuotDaBo(messagesGoc, boLuot.messages.length);
    if (ghiNho.daGoiModel) {
      emit({ type: 'server_tool', name: 'tóm tắt ngữ cảnh', summary: `ghi nhớ ${boLuot.soLuotDaBo} lượt cũ` });
    }
    messages = [loiNhacDaCat(boLuot.soLuotDaBo, ghiNho), ...boLuot.messages];
  }
  const laPhu = input.laPhu === true;
  const phuGhi = laPhu && input.quyenPhu === 'ghi';
  /* Agent phụ: chỉ những khả năng được phép — ĐỌC (mặc định) hoặc thêm SỬA + LỆNH (`phuGhi`). Lọc ở
     MÁY CHỦ: app gửi gì thừa cũng không mời được tool lồng / git ghi / GitHub / trình duyệt. */
  const CHO_PHU = new Set<AgentCapability>(phuGhi ? ['fs_read', 'git_read', 'fs_write', 'shell'] : ['fs_read', 'git_read']);
  const capabilities: AgentCapability[] = parseCapabilities(input.capabilities).filter((c) => !laPhu || CHO_PHU.has(c));
  const buocDaDi = demBuocViecNay(messages);
  const mucNoLuc = docMucNoLuc(input.mucNoLuc);
  // Agent phụ KHÔNG được cắm tool MCP: nó chạy không có người ngồi duyệt từng
  // lời gọi, mà duyệt tay là chốt chặn chính của MCP.
  const toolMcp = laPhu ? [] : parseToolMcp(input.toolMcp);
  const tenMcp = new Set(toolMcp.map((t) => t.name));
  // Agent phụ có trần RIÊNG và cứng: 10 bước, bất kể người dùng chọn mức nào.
  // Để nó theo mức "Kỹ" thì ba việc phụ × 60 bước = 180 bước cho một câu hỏi.
  const MAX_AGENT_STEPS = laPhu ? (phuGhi ? 25 : 10) : TRAN_BUOC[mucNoLuc];

  // ─── BỐN chốt chặn, theo thứ tự RẺ TRƯỚC ───────────────────────
  // Ba cái đầu chỉ đọc bộ nhớ / một truy vấn đã đánh chỉ mục. Cái đắt nhất
  // (gọi cổng) chỉ chạy khi cả bốn đã qua.

  // 1. Trần bước — chống vòng lặp hỏng trong CÙNG một hội thoại.
  if (buocDaDi >= MAX_AGENT_STEPS) {
    emit({
      type: 'done',
      append: [{
        role: 'assistant',
        /* Nói rõ ĐANG Ở MỨC NÀO và nâng lên được — câu cũ chỉ khuyên "hỏi
           hẹp hơn / bắt đầu việc mới", tức là đổ lỗi cho câu hỏi trong khi
           thứ chặn thật là một lựa chọn người dùng đổi được trong hai giây.
           Ở mức Thấp (8 bước) lời khuyên đó còn dẫn sai hẳn hướng. */
        content: laPhu
          /* Việc phụ: gom các phát hiện nó đã viết (26/09/2026) — xem
             `gomPhatHienViecPhu`. App lấy tin assistant cuối làm kết quả. */
          ? gomPhatHienViecPhu(messages, MAX_AGENT_STEPS)
          : `Đã chạm trần ${MAX_AGENT_STEPS} bước cho việc này (mức "${TEN_MUC[mucNoLuc]}"). `
            + 'Nâng mức nỗ lực ở thanh trên để agent đi được xa hơn, hoặc hỏi lại câu hẹp hơn.',
      }],
      stop: 'max_steps',
      usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 },
      quota: goiHanMuc(await xemHanMuc(input.userId)),
      nguCanh: goiNguCanh(messages, boLuot.soLuotDaBo, tranKyTu),
    });
    return;
  }

  // 2. Hạn mức 5 giờ của NGƯỜI DÙNG — bể riêng của agent.
  const hanMuc = await xemHanMuc(input.userId);
  if (hanMuc.hetHan) {
    emit({
      type: 'error', error: loiHetHan(hanMuc), code: 'AGENT_QUOTA_EXCEEDED',
      coKeyGiaHan: await coKeyGiaHan(),
    });
    return;
  }

  /*
   * 3. VÍ TIỀN RIÊNG của người dùng này, mảng AI Code, cửa sổ 5 giờ trượt.
   *
   * Trước 11/09/2026 đây là ví của CẢ WEB tính theo NGÀY: một người tiêu hết
   * là mọi tài khoản bị chặn, kể cả tài khoản vừa tạo — người dùng báo đúng
   * hiện tượng đó. Nay mỗi người một ví, và AI Chat có ví riêng của nó.
   */
  const vi = await xemViTien(input.userId, 'code');
  if (vi.canVi) {
    emit({ type: 'error', error: loiCanViTien(vi), code: 'AGENT_BUDGET_EXCEEDED' });
    return;
  }

  // 4. Cầu dao tiền CHUNG của cả site — lưới cuối cùng. 'interactive' vì có
  //    người đang ngồi nhìn màn hình, nên nó chỉ chặn ở trần CỨNG.
  const budget = await checkBudget('interactive');
  if (!budget.allowed) {
    emit({ type: 'error', error: budgetMessage(budget), code: 'BUDGET_EXCEEDED' });
    return;
  }

  const ghiChu = input.ghiChuDuAn?.noiDung
    ? catGhiChu(input.ghiChuDuAn.ten, input.ghiChuDuAn.noiDung)
    : undefined;
  /* `LOI_LAM_VIEC` nối cho MỌI model (27/09/2026) — Opus và GPT nhận cùng một
     bộ luật làm việc. Đặt ở cuối để phần đầu prompt giữ nguyên, đệm tiền tố
     của cổng vẫn trúng. */
  const system = buildSystemPrompt({
    capabilities,
    mucNoLuc,
    /* Con số ĐI THEO prompt, không chép tay vào đó. Chính file này đã cảnh báo
       "app cũ hiện 60 bước trong khi máy chủ đã đổi thành 100 là một lời nói
       dối mà không ai phát hiện được" — prompt cũng là một cái app cũ như thế
       nếu nó tự gõ lại số. */
    tranBuoc: MAX_AGENT_STEPS,
    tranViecPhu: TRAN_VIEC_PHU[mucNoLuc],
    laPhu,
    ...(phuGhi ? { phuGhi: true } : {}),
    soToolMcp: toolMcp.length,
    ...(input.workspace ? { workspace: input.workspace } : {}),
    ...(ghiChu ? { ghiChu } : {}),
    ...(input.boNho ? { boNho: input.boNho } : {}),
    ...(input.kyNang?.length ? { kyNang: input.kyNang } : {}),
    ...(input.agentPhu?.length ? { agentPhu: input.agentPhu } : {}),
    ...(input.promptPhu ? { promptPhu: input.promptPhu } : {}),
  }) + `\n\n${LOI_LAM_VIEC}`;
  const tools = toolsForGateway(capabilities, toolMcp);

  const xin = await xinDiemCuoi('agent_code');
  const tra = xin.tra;
  let ep = xin.ep;
  // Người dùng chọn model ⇒ lấy model đó; không chọn (hoặc app cũ không gửi)
  // ⇒ về đúng `PURPOSE_MODEL.agent_code` như trước.
  //
  // ⚠️ `null` nghĩa là mã HỢP LỆ nhưng nhóm của nó chưa cắm khoá. Phải nói ra
  // bằng chữ chứ không được lặng lẽ đổi sang model khác: người dùng cố ý chọn
  // GPT rồi nhận về câu trả lời của Claude thì họ đang đọc thứ họ không chọn.
  /* CỔNG CLAUDE CHÍNH HÃNG (17/10/2026) — xem `anthropicChinhHang/`. Mã `cl-*`
     là chọn TAY một model của cổng này; nó không nằm trong bảng rambo/modelapi. */
  const chonCH = ep.local ? null : modelChinhHangTu(input.model);
  const laAdminNguoi = input.userId ? await laAdminCua(input.userId) : false;
  const modelCaoDuoc = laAdminNguoi
    || (input.congAnthropicVe && input.userId ? await veAnthropicHopLe(input.userId, input.congAnthropicVe).catch(() => false) : false);

  const chon = ep.local || chonCH ? null : modelAgentTu(input.model);
  if (!ep.local && !chonCH && !chon) {
    tra();
    throw new AgentInputError(
      'Model bạn chọn chưa được cắm khoá trên máy chủ. Hãy chọn lại Claude Sonnet 5, '
      + 'hoặc báo quản trị thêm khoá của nhóm đó vào máy chủ.',
      'MODEL_CHUA_CO_KHOA',
    );
  }
  let model = chon?.model ?? modelFor('agent_code', ep);

  /* CỔNG DỰ PHÒNG (27/09/2026). Chỉ đổi đường khi CẢ HAI: đang đi rambo mà
     rambo đang hỏng, VÀ app cầm vé hợp lệ (người dùng đã nhập mật khẩu).
     Rambo khoẻ ⇒ đi rambo như cũ, vé nằm im — tự quay về, không ai chỉnh tay.
     17/10/2026: admin không cần vé. */
  const veDuPhongThat = input.duPhongVe && input.userId
    ? await veDuPhongHopLe(input.userId, input.duPhongVe)
    : false;
  const coVeDuPhong = laAdminNguoi || veDuPhongThat;
  let dangDuPhong = false;
  /** Đang đi cổng Claude chính hãng ở hạng nào (`null` = không). */
  let hangCH: HangChinhHang | null = null;
  const chuyenDuPhong = (): boolean => {
    if (dangDuPhong || !coVeDuPhong) return false;
    const m = modelDuPhongAgent(input.duPhongModel);
    const e = congDuPhong(m);
    if (!e) return false;
    ep = e;
    model = m;
    dangDuPhong = true;
    hangCH = null;
    /* Prompt, kỹ năng, bộ nhớ, tool, mục cách-làm-việc: DÙNG CHUNG y nguyên
       với rambo — không còn phần nào riêng cho một nhà cung cấp. */
    return true;
  };
  /** Sang cổng chính hãng với model `m`. Trả lý do CHẶN, hoặc `null` khi đã chuyển. */
  const chuyenChinhHang = async (m: ModelChinhHang): Promise<{ code: string; error: string } | null> => {
    if (!(await coKeyKhaDung())) {
      return {
        code: 'CONG_ANTHROPIC_HET_KEY',
        error: 'Cổng Claude chính hãng tạm thời không có key dùng được (hết credit hoặc hết ngân sách tháng). Báo quản trị kiểm tra.',
      };
    }
    const h = await xemHanMucChinhHang(input.userId, m.hang);
    if (h.het) return { code: 'CONG_ANTHROPIC_HET_HAN_MUC', error: loiHetHanMucChinhHang(h) };
    ep = diemCuoiChinhHang();
    model = m.model;
    hangCH = m.hang;
    dangDuPhong = false;
    return null;
  };
  /* Người dùng MUỐN modelapi khi rambo hỏng: nói rõ bằng `congPhu`, hoặc (app
     cũ) đang giữ dự phòng VÀ cầm vé dự phòng thật — họ đã từng nhập mật khẩu. */
  const muonModelapi = input.congPhu === 'modelapi'
    || (input.congPhu === undefined && input.duPhongGiu === true && veDuPhongThat);
  /** Rambo hỏng/đang giữ cổng phụ ⇒ modelapi (nếu muốn) ⇒ CuongMini Free ⇒ modelapi. */
  const chuyenCongPhu = async (): Promise<'anthropic' | 'du-phong' | null> => {
    if (muonModelapi && chuyenDuPhong()) return 'du-phong';
    if (!(await chuyenChinhHang(modelFreeChoApp()))) return 'anthropic';
    if (chuyenDuPhong()) return 'du-phong';
    return null;
  };
  const khungDoiCong = async (c: 'anthropic' | 'du-phong'): Promise<AgentEvent> => (c === 'anthropic'
    ? {
        type: 'cong', cong: 'anthropic', model, ten: modelFreeChoApp().ten,
        ma: 'CONG_CHINH_HONG_FREE', thongDiep: CAU_DOI_CONG_FREE, moiNangCap: true,
        cacCong: await cacCongNangCap(input.userId, { veAnthropic: input.congAnthropicVe, veDuPhong: input.duPhongVe })
          .catch(() => []),
      }
    : { type: 'cong', cong: 'du-phong', model });

  /** Khung `cong` cần phát ngay sau `start` (đổi cổng xảy ra TRƯỚC lời gọi đầu). */
  let khungCongDau: AgentEvent | null = null;
  if (chonCH) {
    /* CHỌN TAY model chính hãng. Route đã chặn 403 trước khi mở SSE; chặn lại
       ở đây cho mọi đường gọi khác (test, agent phụ). */
    if (chonCH.hang === 'cao' && !modelCaoDuoc) {
      tra();
      throw new AgentInputError(
        `${chonCH.ten} cần mật khẩu cổng Claude chính hãng. Nhập mật khẩu do quản trị cấp để mở khoá.`,
        'CONG_ANTHROPIC_KHOA',
      );
    }
    const chan = await chuyenChinhHang(chonCH);
    if (chan) {
      /* Hết trần / hết key ⇒ lùi sang modelapi nếu người này có vé. */
      if (chuyenDuPhong()) {
        khungCongDau = { type: 'cong', cong: 'du-phong', model, ma: 'DOI_CONG', thongDiep: `${chan.error} Lượt này chạy tạm qua cổng dự phòng modelapi.` };
      } else {
        tra();
        emit({ type: 'error', code: chan.code, error: chan.error });
        return;
      }
    }
  } else if (ep.label === 'cong-agent' && (input.duPhongGiu === true || ramboDangNghi())) {
    const c = await chuyenCongPhu();
    if (!c && ramboDangNghi()) {
      /* Rambo đang được đánh dấu hỏng (mũi dò gõ cửa mỗi 30s, sống lại là đóng
         cầu dao ngay), CuongMini Free cũng không chạy được và người dùng chưa
         có vé dự phòng ⇒ hỏi luôn, đừng bắt họ chờ thêm một lần hỏng nữa. */
      tra();
      emit({
        type: 'error',
        code: 'RAMBO_BAO_TRI',
        error: 'AI CuongMini đang bảo trì (cổng chính không phản hồi). Bạn có thể dùng cổng dự phòng — cần mật khẩu do quản trị cấp.',
      });
      return;
    }
    /* Báo + mời nâng cấp chỉ khi VỪA chuyển vì rambo hỏng — tab đang "giữ"
       cổng phụ thì đã được báo ở lượt trước. */
    if (c === 'anthropic' && input.duPhongGiu !== true) khungCongDau = await khungDoiCong(c);
  }

  /* 5. HẠN MỨC RIÊNG của Cuong Fable 5 — model tốn gấp 3,5 lần (26/09/2026).
     Kiểm SAU khi biết model thật, và kiểm ở MỌI lượt kể cả lượt của việc phụ:
     một việc dài chạy hàng chục lượt, chặn ở lượt đầu thôi là thủng. Admin
     không bị chặn (xem `fable.ts`). */
  /* AGENT PHỤ chọn model theo việc (17/10/2026) — `anthropicChinhHang/modelPhu.ts`.
     Không bao giờ đắt hơn model chính; hạng trần (free/cao) giữ theo lượt chính. */
  if (laPhu && !ep.local && input.mucModelPhu !== undefined) {
    const cong = hangCH ? 'anthropic' : ep.label === 'cong-agent' ? 'rambo' : 'modelapi';
    model = chonModelPhu({ cong, modelChinh: model, muc: input.mucModelPhu });
  }

  if (model === MODEL_FABLE && !dangDuPhong) {
    const hf = await xemHanMucFable(input.userId);
    if (hf.hetHan) {
      tra();
      emit({ type: 'error', error: loiHetFable(hf), code: 'FABLE_QUOTA_EXCEEDED' });
      return;
    }
  }

  emit({
    type: 'start', model, buoc: buocDaDi + 1, tranBuoc: MAX_AGENT_STEPS,
    cong: dangDuPhong ? 'du-phong' : hangCH ? 'anthropic' : 'chinh',
  });
  if (khungCongDau) emit(khungCongDau);

  const append: AgentMessage[] = [];
  let inTong = 0;
  /* Token VÀO của lời gọi GẦN NHẤT (đã gồm phần đọc/ghi đệm) = cỡ ngữ cảnh THẬT
     đang gửi. Đợt 3: "context %" tính từ đây thay vì chỉ đếm ký tự — với cổng
     chính hãng cửa sổ 1M, đếm ký tự trên trần 2,4M luôn ra 0%. */
  let inCuoi = 0;
  let outTong = 0;
  let thanhCong = false;
  let daLuoc = 0;
  let daCat = 0;
  /** Token đọc từ đệm tiền tố cổng trả về, cộng dồn cả lượt — chỉ để ghi log. */
  let cacheDocTong = 0;
  /**
   * Ước lượng token VÀO của lời gọi ĐANG bay. Lời gọi hỏng giữa chừng không
   * trả `usage`, nên trước 26/09/2026 nó được ghi sổ bằng 0 — mà một lượt hỏng
   * ở bước 30 đã chở ~60k token lên cổng. Về 0 sau mỗi lời gọi thành công.
   */
  let uocLuongDangBay = 0;
  /* Phần đi cổng chính hãng: USD tính đúng theo bảng giá chính thức (gồm đệm),
     token tách riêng để phần còn lại vẫn tính theo `costUsd` như cũ. */
  let usdCH = 0;
  let inCH = 0;
  let outCH = 0;
  let demDoc = 0;
  let demGhi = 0;
  /** Lượt trước kết thúc bằng `pause_turn` (server tool) ⇒ gọi tiếp, giữ tin assistant cuối. */
  let tiepPause = false;
  const chiPhi = (): number => costUsd(model, Math.max(0, inTong - inCH), Math.max(0, outTong - outCH)) + usdCH;

  /**
   * Dựng khung `done`. Gom về một chỗ vì có BỐN lối ra khỏi vòng lặp, và một
   * lối quên kèm `quota` là thanh đo trên giao diện đứng im ở đúng lối đó —
   * loại lỗi chỉ hiện ra khi người dùng đi đúng nhánh hiếm.
   */
  const khungXong = (stop: 'end' | 'tool_calls' | 'continue'): AgentEvent => ({
    type: 'done',
    append,
    stop,
    usage: { inputTokens: inTong, outputTokens: outTong, costUsd: chiPhi() },
    tienUsd: Math.round(chiPhi() * 1e6) / 1e6,
    ...(demDoc || demGhi ? { dem: { doc: demDoc, ghi: demGhi } } : {}),
    quota: goiHanMuc({
      ...hanMuc,
      daDung: hanMuc.daDung + Math.round((inTong + outTong) * (model === MODEL_FABLE ? HE_SO_FABLE : 1)),
    }),
    nguCanh: goiNguCanh([...messages, ...append], boLuot.soLuotDaBo, tranKyTu, inCuoi, cuaSoToken),
    ...(daLuoc > 0 ? { compact: { soDaLuoc: daLuoc, kyTuDaCat: daCat } } : {}),
  });

  /* Trạng thái của việc VIẾT TIẾP khi chạm trần token. `viTriPrefill` là chỗ
     tin nhắn assistant dở nằm trong `append` — giữ lại để THAY nó, không đẩy
     thêm cái mới. */
  let soLanVietTiep = 0;
  /** Số lần đã gọi lại vì cổng trả rỗng — xem chốt "CỔNG TRẢ RỖNG" trong vòng lặp. */
  let soLanRong = 0;
  let dangViet = '';
  let viTriPrefill = -1;

  try {
    for (let hop = 0; hop <= MAX_SERVER_HOPS + MAX_VIET_TIEP; hop++) {
      // Nén NGAY TRƯỚC mỗi lời gọi, tính lại từ đầu mỗi lần: hop này vừa thêm
      // kết quả mới, nên cái "gần nhất" đã khác so với hop trước.
      const tatCa = [...messages, ...append];
      /* Cổng chính hãng, model cao: KHÔNG lược kết quả tool cũ ở phía mình —
         chất lượng trước; context_management/compact phía Anthropic lo khi thật
         sự quá lớn, và tiền tố đứng yên nên đệm trúng. */
      const nen = ep.label === NHAN_CONG_ANTHROPIC && hangCH === 'cao'
        ? { messages: tatCa, soDaLuoc: 0, kyTuDaCat: 0 }
        : nenNguCanh(tatCa);
      if (nen.soDaLuoc > daLuoc) { daLuoc = nen.soDaLuoc; daCat = nen.kyTuDaCat; }

      /* Lời nhắc ĐUÔI — chỉ gắn vào bản gửi cổng, không lưu vào hội thoại
         (26/09/2026). Hai loại: agent đang lặp, và việc phụ ở bước cuối. */
      const nhac: string[] = [];
      const lap = phatHienLap(tatCa).lap;
      if (lap) nhac.push(loiNhacLap(lap));
      /* Việc phụ ở bước CUỐI được phép: bảo nó viết tóm tắt NGAY. Không có câu
         này thì nó gọi tool ở bước 10 như mọi bước khác, rồi lượt sau chạm
         trần và phát hiện của nó chỉ còn là những mẩu chữ rời rạc. */
      if (laPhu && demBuocViecNay(tatCa) >= MAX_AGENT_STEPS - 1) nhac.push(NHAC_BUOC_CUOI);
      const khongLap = boKetQuaLap(nen.messages);
      const guiDi = nhac.length ? ganNhacDuoi(khongLap, nhac.join('\n')) : khongLap;
      uocLuongDangBay = uocLuongVao(system, guiDi);

      const goiMotLan = () => goiCongCoLuoiDo({
        url: chatUrlOf(ep),
        key: ep.key,
        ...(ep.giaoThuc ? { giaoThuc: ep.giaoThuc } : {}),
        ...(ep.label === NHAN_CONG_ANTHROPIC && hangCH
          ? {
              chinhHang: {
                userId: input.userId, viec: 'agent_code' as const, hang: hangCH,
                mucNoLuc: input.mucNoLuc, tiepPause, onNghi: () => emit({ type: 'nghi' }),
              },
            }
          : {}),
        model,
        system,
        messages: guiDi,
        tools,
        signal,
        onText: (delta) => emit({ type: 'text', delta }),
      });
      let ketQua: Awaited<ReturnType<typeof goiMotLan>>;
      try {
        ketQua = await goiMotLan();
      } catch (err) {
        /* RAMBO HỎNG GIỮA LƯỢT. Mở cầu dao (để lượt sau khỏi đâm đầu vào tường
           và mũi dò tự gõ cửa lại), rồi: có vé ⇒ chuyển sang dự phòng và gọi
           lại ĐÚNG bước này; không vé ⇒ báo mã riêng để app hỏi người dùng.
           Lỗi 4xx (tất định) và người dùng bấm dừng thì không đụng tới. */
        const thong = (err as Error).message || '';
        if (signal.aborted) throw err;
        if (ep.label === 'cong-agent') {
          if (maLoiCong(thong) === 'LLM_ERROR_4XX') throw err;
          baoRamboHong();
          const c = await chuyenCongPhu();
          if (!c) throw new RamboBaoTri(thong);
          logger.warn('agent: rambo hỏng giữa lượt — chuyển cổng phụ', { cong: c, model, loi: thong.slice(0, 120) });
          emit(await khungDoiCong(c));
        } else if (ep.label === NHAN_CONG_ANTHROPIC
          && (err instanceof CongAnthropicLoi || maLoiCong(thong) !== 'LLM_ERROR_4XX')) {
          /* Cổng chính hãng hết key / mọi key lỗi ⇒ lùi tiếp sang modelapi nếu có vé. */
          if (!chuyenDuPhong()) throw err;
          logger.warn('agent: cổng chính hãng hỏng — chuyển sang cổng dự phòng modelapi', { model, loi: thong.slice(0, 120) });
          emit({ type: 'cong', cong: 'du-phong', model, ma: 'DOI_CONG', thongDiep: 'Cổng Claude chính hãng đang lỗi — chuyển sang cổng dự phòng modelapi.' });
        } else {
          throw err;
        }
        ketQua = await goiMotLan();
      }

      uocLuongDangBay = 0;
      inTong += ketQua.inputTokens;
      outTong += ketQua.outputTokens;
      if (ketQua.inputTokens > 0) inCuoi = ketQua.inputTokens;
      if (ketQua.usdChinhHang !== undefined) {
        usdCH += ketQua.usdChinhHang;
        inCH += ketQua.inputTokens;
        outCH += ketQua.outputTokens;
      }
      demDoc += ketQua.cacheDocTokens;
      demGhi += ketQua.cacheGhiTokens ?? 0;
      tiepPause = false;
      /* Khối Anthropic GỐC (thinking + chữ ký, compaction…) đi kèm tin assistant
         để app gửi lại nguyên văn. Không kèm khi tin bị gộp viết-tiếp (đã sửa). */
      const goc = ketQua.khoiAnthropic?.length && soLanVietTiep === 0 && viTriPrefill < 0
        ? { khoiAnthropic: ketQua.khoiAnthropic }
        : {};
      cacheDocTong += ketQua.cacheDocTokens;

      const noiDung = catRacCong(ketQua.text);
      const calls = ketQua.toolCalls;
      const finishReason = ketQua.finishReason;

      /* SERVER TOOL của Anthropic dừng giữa chừng (`pause_turn`) ⇒ gửi lại
         NGUYÊN tin assistant đó làm tin cuối để model làm tiếp. */
      if (finishReason === 'pause_turn' && calls.length === 0 && !signal.aborted) {
        append.push({ role: 'assistant', content: noiDung || null, ...goc });
        tiepPause = true;
        continue;
      }

      /* CỔNG TRẢ RỖNG ⇒ gọi lại ĐÚNG bước này một lần (27/09/2026). Đo thật trên
         modelapi lúc quá tải: `finish_reason: stop`, không chữ, không tool — và
         agent kết thúc với câu trả lời trống, không báo gì. Cùng lúc đó API gốc
         còn trả thẳng "servers are currently overloaded". Rỗng hoàn toàn không
         bao giờ là câu trả lời thật. */
      if (calls.length === 0 && !noiDung.trim() && !dangViet && soLanRong < 1 && !signal.aborted) {
        soLanRong++;
        logger.warn('agent: cổng trả về RỖNG — gọi lại bước này một lần', { model, cong: ep.label });
        hop--;
        continue;
      }

      // ── Model không đòi tool nữa ⇒ xong lượt, TRỪ KHI nó bị cắt ──
      if (calls.length === 0) {
        const gop = gopVietTiep(dangViet, noiDung);

        /*
         * CHẠM TRẦN TOKEN ⇒ VIẾT TIẾP, ĐỪNG DỪNG.
         *
         * Đây là lỗi người dùng báo 19/08/2026: quét xong một dự án rồi bản
         * tổng quan đứt ngang giữa câu, không lỗi, không cảnh báo. Cổng vẫn
         * gửi `finish_reason: "length"` — chỉ là không ai đọc.
         *
         * Cách viết tiếp: đặt phần đang dở làm tin nhắn `assistant` CUỐI rồi
         * gọi lại (prefill). Đo thật cho thấy cổng nhận và model viết tiếp
         * đúng chỗ — nhưng nó VIẾT LẠI mục đang dở, nên phải gộp bằng
         * `gopVietTiep` chứ không cộng chuỗi.
         *
         * ⚠️ THAY tin nhắn prefill chứ không đẩy thêm: hai tin `assistant`
         * liền nhau là một hội thoại méo, và mỗi lần gọi lại sẽ chở thêm một
         * bản sao của phần đã viết.
         */
        if (finishReason === 'length' && soLanVietTiep < MAX_VIET_TIEP) {
          soLanVietTiep += 1;
          dangViet = gop;
          if (viTriPrefill >= 0) append[viTriPrefill] = { role: 'assistant', content: gop };
          else { viTriPrefill = append.length; append.push({ role: 'assistant', content: gop }); }
          emit({ type: 'server_tool', name: 'viet_tiep', summary: `câu trả lời dài — đang viết tiếp (${soLanVietTiep}/${MAX_VIET_TIEP})` });
          continue;
        }

        if (viTriPrefill >= 0) append[viTriPrefill] = { role: 'assistant', content: gop };
        else append.push({ role: 'assistant', content: gop, ...goc });
        thanhCong = true;
        emit(khungXong('end'));
        return;
      }

      append.push({ role: 'assistant', content: noiDung || null, tool_calls: calls, ...goc });

      /* ── Đọc TRÙNG ⇒ máy chủ tự trả, không phát xuống app (26/09/2026) ──
         Cùng cách với tool vòng 2: nối tin `role:'tool'` ngay tại đây, nên
         mỗi tool_call vẫn có đúng một tin trả lời. Hết lời gọi cho app thì
         vòng lặp tự đi tiếp như chỉ có tool vòng 2. */
      const trung = new Set<string>();
      for (const t of phatHienLap([...messages, ...append]).trungDoc) {
        trung.add(t.id);
        append.push({ role: 'tool', tool_call_id: t.id, content: CAU_TRUNG_DOC });
        emit({ type: 'server_tool', name: t.ten, summary: 'trùng lời gọi trước — dùng lại kết quả cũ' });
      }

      // ── Chia hai vòng ──
      const conLai = calls.filter((c) => !trung.has(c.id));
      const vongServer = conLai.filter((c) => toolByName(c.function.name)?.ring === 'server');
      const vongClient = conLai.filter((c) => toolByName(c.function.name)?.ring !== 'server');

      for (const c of vongServer) {
        const args = docArgs(c.function.arguments);
        const kq = await runServerTool(c.function.name, args, input.userId);
        append.push({ role: 'tool', tool_call_id: c.id, content: kq.content, ...(kq.anh?.length ? { anh: kq.anh } : {}) });
        emit({ type: 'server_tool', name: c.function.name, summary: kq.summary });
      }

      // ── Có tool của app ⇒ dừng lượt, giao lại cho app ──
      if (vongClient.length > 0) {
        for (const c of vongClient) {
          // Tool MCP không nằm trong danh mục của máy chủ — hợp lệ khi và chỉ
          // khi app vừa khai báo nó ở lượt NÀY. Model nhớ một tool MCP từ lượt
          // trước rồi gọi lại sau khi người dùng đã rút server ra thì phải bị
          // chặn ở đây, không phải ở app.
          const t = toolByName(c.function.name) ?? (tenMcp.has(c.function.name) ? true : undefined);
          if (!t) {
            // Model bịa ra tên tool. Trả lỗi vào hội thoại để nó tự sửa ở lượt
            // sau, thay vì để app nhận một tool nó không biết chạy.
            append.push({ role: 'tool', tool_call_id: c.id, content: `LỖI: không có tool tên "${c.function.name}".` });
            continue;
          }
          emit({ type: 'tool_call', id: c.id, name: c.function.name, args: docArgs(c.function.arguments) });
        }
        thanhCong = true;
        emit(khungXong('tool_calls'));
        return;
      }

      // ── Chỉ có tool vòng 2 ⇒ máy chủ tự đi tiếp, app không phải làm gì ──
    }

    // Hết số lần tự đi tiếp. Không phải lỗi — chỉ là máy chủ không tự lo nốt
    // được, nên giao lại cho app để nó gọi lượt mới (bước tiếp vẫn còn trong
    // trần MAX_AGENT_STEPS). App không có gì phải chạy, nên KHÔNG dùng
    // 'tool_calls' ở đây — xem ghi chú ở kiểu AgentEvent.
    thanhCong = true;
    emit(khungXong('continue'));
  } catch (err) {
    const message = (err as Error).message || 'lỗi không rõ';
    if (signal.aborted) return; // người dùng bấm dừng — không phải lỗi
    logger.warn('agent: lượt hỏng', { message, model });

    /* Rambo sập và người dùng chưa có vé dự phòng ⇒ mã RIÊNG để app hiện hộp
       "CuongMini đang bảo trì — dùng cổng dự phòng?" thay vì một dòng lỗi đỏ. */
    if (err instanceof CongAnthropicLoi) {
      emit({ type: 'error', code: err.code, error: err.message });
      return;
    }
    if (err instanceof RamboBaoTri) {
      emit({
        type: 'error',
        code: 'RAMBO_BAO_TRI',
        error: 'AI CuongMini đang bảo trì (cổng chính không phản hồi). Bạn có thể dùng cổng dự phòng — cần mật khẩu do quản trị cấp.',
      });
      return;
    }

    // Kết nối ĐỨT giữa chừng ≠ cổng AI trả về lỗi. Hai chuyện này cần hai câu
    // khác nhau, vì người dùng làm hai việc khác nhau: đứt thì hỏi lại là
    // xong, còn cổng lỗi thì hỏi lại cũng thế.
    //
    // Gặp thật 17/08/2026 khi backend chạy `tsx watch` tự khởi động lại giữa
    // một lượt: SSE chết, và người dùng nhận đúng dòng chữ "Cổng AI lỗi: This
    // operation was aborted" — vừa sai (cổng không lỗi) vừa không nói được
    // phải làm gì. Cùng chuyện đó xảy ra trên production mỗi lần deploy.
    const ma = maLoiCong(message);

    /**
     * Cổng KHÔNG CÓ nhà cung cấp cho model — sự cố phía cổng, không phải phía
     * người dùng.
     *
     * Gặp thật 18/08/2026: cả 6 model chat của khoá này đều trả
     * `HTTP 400 unknown provider for model …`, trong khi `GET /v1/models` vẫn
     * liệt kê đủ 8 model. Người dùng ở máy khác nhìn thấy nguyên khối JSON đó
     * và tưởng máy mình hoặc bản app mình lỗi — trong khi mọi người đều đang
     * gặp và không ai sửa được gì từ phía app.
     *
     * `No available channel` là cùng một chuyện, chỉ khác mã lỗi (503) —
     * kênh có tồn tại nhưng không cái nào đang bật cho nhóm của khoá.
     */
    const congThieuKenh = ma === 'LLM_NO_PROVIDER';
    const tenModel = /unknown provider for model ([\w.-]+)/i.exec(message)?.[1] ?? model;

    emit(
      congThieuKenh
        ? {
            type: 'error',
            code: 'LLM_NO_PROVIDER',
            error: `Cổng AI hiện không phục vụ model "${tenModel}". Đây là sự cố ở phía cổng `
              + '(nhà cung cấp chưa gắn kênh cho model này) — KHÔNG phải do máy bạn hay bản app bạn đang dùng, '
              + 'và mọi người đều đang gặp. Hỏi lại cũng không khác; hãy báo cho chủ web để bật lại kênh model ở Console của cổng.',
          }
        : ma === 'LLM_ERROR_4XX'
        ? {
            /* Lỗi TẤT ĐỊNH — mã riêng để app KHÔNG thử lại (26/09/2026). */
            type: 'error',
            code: 'LLM_ERROR_4XX',
            error: `Cổng AI từ chối yêu cầu: ${message}. Đây là lỗi cố định chứ không phải cổng đang bận — `
              + 'gửi lại y hệt sẽ nhận lại y hệt. Nếu hội thoại đã rất dài, hãy bắt đầu phiên mới.',
          }
        : ma === 'CONNECTION_LOST'
        ? {
            type: 'error',
            code: 'CONNECTION_LOST',
            error: 'Kết nối tới máy chủ đứt giữa chừng (thường là máy chủ vừa khởi động lại). Hãy hỏi lại — phần đã làm vẫn còn trong hội thoại.',
          }
        : { type: 'error', error: `Cổng AI lỗi: ${message}`, code: 'LLM_ERROR' },
    );
  } finally {
    tra();
    // Ghi sổ dù thành công hay không: một lượt hỏng GIỮA CHỪNG vẫn đã tiêu
    // token vào rồi, và đó chính là loại chi phí mà biểu đồ cần nhìn thấy.
    void ghiSo({
      userId: input.userId,
      model,
      // Lời gọi hỏng giữa chừng: cộng ước lượng token vào của nó (26/09/2026).
      inTong: inTong + (thanhCong ? 0 : uocLuongDangBay),
      outTong,
      thanhCong,
      cacheDoc: cacheDocTong,
      ...(usdCH > 0 ? { costUsd: chiPhi() } : {}),
    });
  }
}

/**
 * Model GPT nào NHÌN được ảnh thật (đo 27/09/2026: gpt-6-sol, gpt-5.6-sol chép
 * đúng đề toán từ ảnh; các model rẻ hơn nhận ảnh rồi BỊA). Đổi bằng env
 * `AGENT_MODEL_NHIN_ANH` (danh sách phẩy) nếu đo thêm được model khác.
 */
function nhinDuocAnh(model: string): boolean {
  const ds = (process.env.AGENT_MODEL_NHIN_ANH || 'gpt-6-sol,gpt-6-astra,gpt-5.6-sol')
    .split(',').map((x) => x.trim()).filter(Boolean);
  return ds.includes(model);
}

/**
 * Hội thoại agent → khung OpenAI, KÈM ẢNH khi model nhìn được (27/09/2026).
 *
 * Giao thức OpenAI KHÔNG có chỗ cho ảnh trong `role:'tool'` (gửi kèm thì cổng bỏ
 * im lặng hoặc từ chối cả lượt). Trước đây ta bỏ ảnh và dặn "bạn chưa nhìn thấy
 * trang" ⇒ GPT làm giao diện mà KHÔNG BAO GIỜ nhìn được kết quả: bài thử
 * 27/09 để lọt nhãn vỡ dòng và thanh tiến độ giả mà nó không thể thấy.
 *
 * Nay: ảnh của MỘT DÃY tool liền nhau được gom vào một tin `role:'user'` đặt
 * NGAY SAU dãy đó — không chen giữa các tin tool của cùng một lượt gọi (OpenAI
 * đòi mọi `tool_call_id` phải được trả lời liền sau tin assistant, chen tin
 * khác vào là 400). Model không nhìn được ảnh thì giữ cách cũ.
 */
function tinNhanOpenAi(messages: AgentMessage[], coAnh: boolean): unknown[] {
  const ra: unknown[] = [];
  let anhCho: Array<{ media_type: string; data: string }> = [];
  const xaAnh = () => {
    if (!anhCho.length) return;
    ra.push({
      role: 'user',
      content: [
        { type: 'text', text: `[Ảnh chụp từ kết quả tool ở trên — ${anhCho.length} ảnh. Hãy NHÌN kỹ để kiểm giao diện.]` },
        ...anhCho.map((a) => ({ type: 'image_url', image_url: { url: `data:${a.media_type};base64,${a.data}` } })),
      ],
    });
    anhCho = [];
  };
  for (const m of messages) {
    if (m.role !== 'tool') xaAnh();
    if (m.role === 'tool' && m.anh?.length) {
      if (coAnh) {
        ra.push({ role: 'tool', tool_call_id: m.tool_call_id, content: `${m.content}\n[Ảnh chụp đính kèm ngay sau các kết quả tool.]` });
        anhCho.push(...m.anh);
      } else {
        ra.push({
          role: 'tool',
          tool_call_id: m.tool_call_id,
          content: `${m.content}\n[Ảnh chụp KHÔNG gửi được với model này — bạn chưa nhìn thấy trang. Dùng web_doc để đọc chữ.]`,
        });
      }
      continue;
    }
    if (m.role === 'assistant') {
      /* `khoiAnthropic` chỉ dành cho cổng chính hãng — không gửi trường lạ sang modelapi. */
      ra.push({ role: 'assistant', content: m.content, ...(m.tool_calls?.length ? { tool_calls: m.tool_calls } : {}) });
      continue;
    }
    if (m.role === 'user' && Array.isArray(m.content) && m.content.some((k) => k.type === 'file')) {
      ra.push({
        role: 'user',
        content: m.content.map((k) => (k.type === 'file' ? { type: 'text', text: chuPdfKhongDoc(k.file.filename) } : k)),
      });
      continue;
    }
    ra.push(m.role === 'tool' ? { role: 'tool', tool_call_id: m.tool_call_id, content: m.content } : m);
  }
  xaAnh();
  return ra;
}

/**
 * KẾT QUẢ TOOL GIỐNG HỆT MỘT KẾT QUẢ TRƯỚC ĐÓ ⇒ không gửi lại lần hai (27/09/2026).
 *
 * Bài thử GPT 6 Sol đọc lại cùng một file ba lần; mỗi lần vài nghìn token đi
 * lên cổng, rồi cả ba bản cùng được gửi lại ở MỌI bước sau. Nội dung giống hệt
 * TỪNG KÝ TỰ ⇒ file chưa đổi (hoặc lệnh ra đúng như cũ) ⇒ bản cũ vẫn nằm ngay
 * trên trong ngữ cảnh, thay bản mới bằng một dòng trỏ về nó là không mất gì.
 *
 * Chạy SAU `nenNguCanh`: bản cũ đã bị lược thì không còn giống hệt ⇒ bản mới
 * giữ nguyên, và đó là bản đầy đủ duy nhất còn lại — đúng như phải thế. Chỉ
 * áp cho kết quả dài (≥ 800 ký tự) và không kèm ảnh. Tất định (cùng vào ⇒ cùng
 * ra) nên không phá đệm tiền tố của cổng.
 */
export function boKetQuaLap(messages: AgentMessage[]): AgentMessage[] {
  const daThay = new Map<string, number>();
  let soTool = 0;
  return messages.map((m) => {
    if (m.role !== 'tool') return m;
    soTool++;
    if (m.anh?.length || m.content.length < 800) return m;
    const truoc = daThay.get(m.content);
    if (truoc === undefined) {
      daThay.set(m.content, soTool);
      return m;
    }
    return {
      ...m,
      content: `[Kết quả này GIỐNG HỆT kết quả tool thứ ${truoc} ở trên (${m.content.length.toLocaleString('vi-VN')} ký tự) — `
        + 'nội dung chưa đổi nên không gửi lại. Dùng bản ở trên; đừng đọc lại lần nữa.]',
    };
  });
}

/** Rambo hỏng và không có vé dự phòng — xem nhánh bắt lỗi của `runAgentTurn`. */
class RamboBaoTri extends Error {}

/** Admin? Không tra được (CSDL hỏng) ⇒ coi như người thường. */
async function laAdminCua(userId: number): Promise<boolean> {
  try {
    const { laAdmin } = await import('../pro.service.js');
    return await laAdmin(userId);
  } catch {
    return false;
  }
}

/** Gói hạn mức cho app. `Date` phải thành chuỗi vì nó đi qua JSON. */
function goiNguCanh(
  messages: readonly AgentMessage[],
  soLuotDaBo: number,
  tran = MAX_TOTAL_CHARS,
  /** Token vào thật của lời gọi gần nhất (0 = chưa gọi) + cửa sổ của model. */
  tokenVao = 0,
  cuaSo = 200_000,
): { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number; token?: number; cuaSo?: number } {
  const kyTu = tongKyTu(messages);
  const theoKyTu = Math.round((kyTu / tran) * 100);
  const theoToken = tokenVao > 0 && cuaSo > 0 ? Math.round((tokenVao / cuaSo) * 100) : 0;
  return {
    kyTu,
    tran,
    phanTram: Math.min(100, Math.max(theoKyTu, theoToken)),
    soLuotDaBo,
    ...(tokenVao > 0 ? { token: tokenVao, cuaSo } : {}),
  };
}

function goiHanMuc(h: HanMuc): { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null } {
  return {
    daDung: h.daDung,
    tran: h.tran,
    phanTram: h.tran > 0 ? Math.min(100, Math.round((h.daDung / h.tran) * 100)) : 0,
    hoiLucNao: h.hoiLucNao ? h.hoiLucNao.toISOString() : null,
  };
}

function docArgs(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Ghi vào cùng cuốn sổ mà `budget.ts` cộng tiền.
 *
 * Ghi chỗ khác thì cầu dao ngân sách sẽ KHÔNG nhìn thấy tiền agent tiêu — và
 * agent là thứ tiêu nhanh nhất trên web này. Đó đúng là bài học "bộ đếm lỗi
 * phải tới đúng cái log mình đọc".
 */
async function ghiSo(d: {
  userId: number;
  model: string;
  inTong: number;
  outTong: number;
  thanhCong: boolean;
  /** Token đọc từ đệm tiền tố (`cache_read_input_tokens`). */
  cacheDoc: number;
  /** USD đã tính sẵn (cổng chính hãng: giá chính thức gồm đệm). Bỏ trống ⇒ `costUsd(model, …)`. */
  costUsd?: number;
}): Promise<void> {
  if (d.inTong === 0 && d.outTong === 0) return;
  /* Sổ `interview_llm_call_logs` KHÔNG có cột cho phần đọc đệm, và thêm cột là
     một migration cho một con số chỉ để quan sát — nên ghi log (26/09/2026).
     ⚠️ `input_tokens` của rambo ĐÃ GỒM phần đọc đệm, nên tỉ lệ = đọc / vào. */
  logger.info('agent: đệm tiền tố', {
    model: d.model,
    inTong: d.inTong,
    cacheDoc: d.cacheDoc,
    tiLeTrungDem: d.inTong > 0 ? Math.round((d.cacheDoc / d.inTong) * 1000) / 1000 : 0,
    thanhCong: d.thanhCong,
  });
  try {
    await prisma.interviewLLMCallLog.create({
      data: {
        userId: d.userId,
        feature: 'agent',
        step: 'interview', // cột này chỉ để suy ra bậc model khi caller cũ không khai `purpose`
        provider: 'gateway',
        model: d.model,
        inputTokens: d.inTong,
        outputTokens: d.outTong,
        costUsd: d.costUsd ?? costUsd(d.model, d.inTong, d.outTong),
        success: d.thanhCong,
      },
    });
  } catch (err) {
    logger.warn('agent: không ghi được sổ chi phí', { error: (err as Error).message });
  }
}

// ─── Gọi cổng + đọc stream ─────────────────────────────────────────

interface KetQuaCong {
  text: string;
  toolCalls: ToolCall[];
  /**
   * Lý do model dừng, do CỔNG gửi. `'length'` = chạm trần token, câu trả lời
   * bị cắt ngang. Trước 19/08/2026 trường này không được đọc, nên một câu bị
   * cắt trông y hệt một câu đã viết xong.
   */
  finishReason: string | null;
  inputTokens: number;
  outputTokens: number;
  /**
   * Token đọc từ đệm tiền tố (Anthropic `cache_read_input_tokens`, OpenAI
   * `prompt_tokens_details.cached_tokens`). 0 nếu cổng không báo.
   */
  cacheDocTokens: number;
  /** Token GHI đệm (`cache_creation_input_tokens`, chỉ tuyến Anthropic). */
  cacheGhiTokens?: number;
  /** Có ⇒ lời gọi đi cổng Claude chính hãng; USD tự tính theo bảng giá chính thức (gồm cả đệm). */
  usdChinhHang?: number;
  /** Khối assistant GỐC của Anthropic (cổng chính hãng) — xem `AgentMessage.khoiAnthropic`. */
  khoiAnthropic?: Array<Record<string, unknown>>;
}

/** Ước lượng thô token vào của một lời gọi, BỎ dữ liệu ảnh base64. */
function uocLuongVao(system: string, msgs: readonly AgentMessage[]): number {
  const chu = JSON.stringify(msgs, (k, v) =>
    (typeof v === 'string' && v.length > 20_000 && (k === 'data' || k === 'url') ? '' : v));
  return Math.ceil((system.length + chu.length) / 4);
}

/**
 * Một lời gọi cổng, đọc stream tới hết.
 *
 * `tool_calls` trong stream về theo MẢNH: mỗi gói mang một phần chuỗi
 * `arguments` và một chỉ số `index` cho biết nó thuộc lời gọi thứ mấy. Ghép
 * theo `index` chứ đừng ghép theo thứ tự đến — model gọi song song hai tool
 * thì các mảnh của chúng xen kẽ nhau, ghép nhầm sẽ cho ra một chuỗi JSON hỏng
 * và lượt sau đổ vỡ ở chỗ không liên quan.
 */
/**
 * Model dự phòng cho agent khi model chính KHÔNG DÙNG ĐƯỢC.
 *
 * Cố ý khác HỌ với model chính. 18/08/2026 cả họ `gpt-5.x` chết cùng lúc (nhóm
 * khoá mất sạch kênh), nên một model dự phòng cùng họ sẽ chết y hệt và lưới đỡ
 * thành vô dụng. Đổi được bằng `LLM_MODEL_AGENT_BACKUP`.
 */
function modelDuPhong(chinh: string): string | null {
  const dat = process.env.LLM_MODEL_AGENT_BACKUP?.trim();
  if (dat) return dat === chinh ? null : dat;
  /* Họ claude ⇒ `claude-sonnet-4-6` (26/09/2026, trước là `claude-opus-5`):
     dự phòng chỉ chạy khi model chính CHẾT, và lúc đó thứ cần là "vẫn làm
     được việc" chứ không phải model đắt nhất — opus đốt gấp nhiều lần tiền
     cho đúng những lượt người dùng đang gặp sự cố. */
  const macDinh = chinh.startsWith('claude') ? 'claude-sonnet-4-6' : 'claude-sonnet-5';
  return macDinh === chinh ? 'claude-sonnet-5' : macDinh;
}

/**
 * Model KHÔNG DÙNG ĐƯỢC ≠ lời gọi hỏng.
 *
 * Chỉ ba lỗi này mới đáng thử model khác, và cả ba đều nói cùng một chuyện:
 * cái tên model ấy hiện không có ai phục vụ.
 *   400 unknown provider for model X      — nhà cung cấp bị gỡ khỏi nhóm
 *   503 No available channel … under group — nhóm của khoá không có kênh
 *   404 not supported by any configured channel
 * Hết giờ, mất mạng, hết hạn mức, người dùng bấm dừng thì thử lại model khác
 * chỉ tốn thêm tiền và thời gian mà không sửa được gì.
 */
function modelChet(thongDiep: string): boolean {
  return /unknown provider for model|No available channel|not supported by any configured channel/i.test(thongDiep);
}

/**
 * Gọi cổng, và nếu MODEL CHẾT thì thử đúng MỘT lần với model dự phòng.
 *
 * Vì sao agent cần cái này: 18/08/2026 cổng chết, AI Chat vẫn trả lời được nhờ
 * dây chuyền dự phòng của `aiProviders.ts`, còn AI Code gọi thẳng cổng nên
 * chết hẳn — người dùng ở máy khác nhìn thấy lỗi đỏ và tưởng máy mình hỏng.
 *
 * Chỉ đổi MODEL, vẫn cùng cổng và cùng giao thức, nên phần gọi tool giữ nguyên
 * hành vi. Rơi sang một nhà cung cấp khác không gọi được tool thì agent không
 * "sống sót" mà chỉ hỏng theo kiểu khó hiểu hơn.
 */
async function goiCongCoLuoiDo(o: Parameters<typeof goiCong>[0]): Promise<KetQuaCong> {
  try {
    return await goiCong(o);
  } catch (err) {
    const thong = (err as Error).message || '';
    const duPhong = modelChet(thong) ? modelDuPhong(o.model) : null;
    if (!duPhong) throw err;
    logger.warn('agent: model chính không dùng được, thử model dự phòng', {
      chinh: o.model, duPhong, loi: thong.slice(0, 120),
    });
    return goiCong({ ...o, model: duPhong });
  }
}

async function goiCong(o: {
  url: string;
  key: string | undefined;
  model: string;
  system: string;
  messages: AgentMessage[];
  tools: ReturnType<typeof toolsForGateway>;
  signal: AbortSignal;
  onText: (delta: string) => void;
  /** Mặc định `'openai'`. Xem `LlmEndpoint.giaoThuc`. */
  giaoThuc?: 'openai' | 'anthropic';
  /** Có ⇒ đi api.anthropic.com qua kho key (tự chuyển key, prompt caching, ghi sổ). */
  chinhHang?: {
    userId: number;
    viec: 'agent_code';
    hang: HangChinhHang;
    mucNoLuc?: unknown;
    tiepPause?: boolean;
    /** Gọi một lần khi khối thinking đầu tiên bắt đầu. */
    onNghi?: () => void;
  };
}): Promise<KetQuaCong> {
  // Đồng hồ IM LẶNG, không phải đồng hồ tổng: một lượt agent đọc file to có
  // thể chạy lâu một cách chính đáng.
  //
  // Trần khởi đầu là `CHO_BYTE_DAU_MS` (rộng — cổng đang xếp hàng), và `lui()`
  // siết xuống `IM_LANG_MS` ngay khi gói đầu tiên về (chặt — stream đã mở mà
  // tắt tiếng là kết nối chết).
  const imLang = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let daCoByte = false;
  const lui = (): void => {
    clearTimeout(timer);
    timer = setTimeout(() => imLang.abort(), daCoByte ? IM_LANG_MS : CHO_BYTE_DAU_MS);
  };
  const huy = (): void => imLang.abort();
  o.signal.addEventListener('abort', huy, { once: true });
  lui();

  /* Cổng chính hãng: giữ `gui` để GHI SỔ cả khi luồng gãy giữa chừng. */
  let gui: KetQuaGui | null = null;
  let daGhiSo = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheDocTokens = 0;
  let cacheGhiTokens = 0;
  let nenVao = 0;
  let nenRa = 0;
  let timWeb = 0;

  /*
   * CỔNG CHÍNH HÃNG: dựng lại TỪNG KHỐI assistant theo `index` (thinking + chữ
   * ký, text, tool_use, compaction, server tool…) để gửi lại NGUYÊN VĂN ở lượt
   * sau — API đòi khối thinking không bị sửa, và khối compaction phải đi lại
   * thì máy chủ mới bỏ phần đã tóm tắt.
   */
  const khoiGoc = new Map<number, Record<string, unknown>>();
  const jsonDo = new Map<number, string>();
  let daNghi = false;
  const ghiKhoi = (j: any): void => {
    const idx = typeof j.index === 'number' ? j.index : -1;
    if (j.type === 'content_block_start' && j.content_block && idx >= 0) {
      const kb = { ...j.content_block } as Record<string, unknown>;
      if (kb.type === 'fallback') {
        /* Lùi khi model từ chối: bỏ thinking/tool_use/server_tool_use TRƯỚC khối fallback; chữ giữ. */
        for (const [i, k] of [...khoiGoc]) {
          if (i < idx && ['thinking', 'redacted_thinking', 'tool_use', 'server_tool_use'].includes(String(k.type))) khoiGoc.delete(i);
        }
        return;
      }
      if (kb.type === 'thinking' || kb.type === 'redacted_thinking') {
        if (kb.type === 'thinking') { kb.thinking = String(kb.thinking ?? ''); kb.signature = String(kb.signature ?? ''); }
        if (!daNghi) { daNghi = true; o.chinhHang?.onNghi?.(); }
      }
      if (kb.type === 'text') kb.text = String(kb.text ?? '');
      if (kb.type === 'compaction') kb.content = String(kb.content ?? '');
      if (kb.type === 'tool_use' || kb.type === 'server_tool_use') jsonDo.set(idx, '');
      delete kb.citations;
      khoiGoc.set(idx, kb);
    } else if (j.type === 'content_block_delta' && idx >= 0) {
      const kb = khoiGoc.get(idx);
      if (!kb) return;
      const d = j.delta ?? {};
      if (d.type === 'text_delta') kb.text = String(kb.text ?? '') + String(d.text ?? '');
      else if (d.type === 'thinking_delta') kb.thinking = String(kb.thinking ?? '') + String(d.thinking ?? '');
      else if (d.type === 'signature_delta') kb.signature = String(kb.signature ?? '') + String(d.signature ?? '');
      else if (d.type === 'input_json_delta') jsonDo.set(idx, (jsonDo.get(idx) ?? '') + String(d.partial_json ?? ''));
      else if (d.type === 'compaction_delta') kb.content = String(kb.content ?? '') + String(d.content ?? d.text ?? '');
    }
  };
  const dsKhoiGoc = (): Array<Record<string, unknown>> => [...khoiGoc.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([i, k]) => {
      if (!jsonDo.has(i)) return k;
      let input: unknown = {};
      try { input = JSON.parse(jsonDo.get(i) || '{}'); } catch { input = {}; }
      return { ...k, input };
    })
    /* Khối chữ rỗng thì API từ chối khi gửi lại. */
    .filter((k) => !(k.type === 'text' && !k.text));

  try {
    const laAnthropic = o.giaoThuc === 'anthropic';

    /* Anthropic: `system` là THAM SỐ RIÊNG và vai phải luân phiên — xem
       `anthropic.ts`. Gửi sai một trong hai là 400 với một câu chẳng nói rõ
       vì sao ("please try again later or create a new conversation"). */
    const dich = laAnthropic
      ? sangAnthropic([{ role: 'system', content: o.system }, ...o.messages] as never, { chinhHang: Boolean(o.chinhHang) })
      : null;

    const thanGui: Record<string, unknown> = laAnthropic
      ? {
          model: o.model,
          system: dich!.system,
          messages: dich!.messages,
          tools: toolSangAnthropic(o.tools as never),
          stream: true,
          max_tokens: MAX_OUTPUT_TOKENS,
        }
      : {};
    if (o.chinhHang) {
      if (!laAnthropic) throw new Error('Cổng chính hãng chỉ nói giao thức Anthropic');
      const than = thanGui as ThanAnthropic;
      const beta = await dungThanChinhHang(than, { laAgent: true, mucNoLuc: o.chinhHang.mucNoLuc, tiepPause: o.chinhHang.tiepPause });
      gui = await guiChinhHang({
        body: than,
        signal: imLang.signal,
        nguCanh: { userId: o.chinhHang.userId, viec: o.chinhHang.viec, hang: o.chinhHang.hang, model: o.model },
        beta,
        banAnToan: () => thanAnToan(than),
      });
    }
    const res = gui ? gui.res : await fetch(o.url, {
      method: 'POST',
      headers: laAnthropic
        ? {
            'Content-Type': 'application/json',
            'x-api-key': o.key ?? '',
            'anthropic-version': '2023-06-01',
          }
        : { 'Content-Type': 'application/json', Authorization: `Bearer ${o.key ?? ''}` },
      signal: imLang.signal,
      body: JSON.stringify(laAnthropic
        ? thanGui
        : {
            model: o.model,
            /* ⚠️ Giao thức OpenAI KHÔNG có chỗ cho ảnh trong `role:'tool'`.
               Gửi kèm thì cổng hoặc bỏ im lặng, hoặc từ chối cả lượt. Nên ta
               tự bỏ và NÓI RÕ trong chữ — model tưởng mình đã xem ảnh rồi bịa
               ra bố cục thì tệ hơn hẳn việc nó biết mình chưa xem. */
            messages: [
              { role: 'system', content: o.system },
              ...tinNhanOpenAi(o.messages, nhinDuocAnh(o.model)),
            ],
            tools: o.tools,
            tool_choice: 'auto',
            /* Cho GPT gọi NHIỀU tool trong một lượt — thiếu nó, nó đọc từng file
               một và số bước (= số lần gửi lại cả ngữ cảnh) nhân lên. */
            parallel_tool_calls: true,
            stream: true,
            // Không có dòng này thì gói cuối KHÔNG mang `usage`, và cả cầu dao
            // ngân sách lẫn đồng hồ chi phí trên giao diện đều đếm bằng 0.
            stream_options: { include_usage: true },
            max_tokens: MAX_OUTPUT_TOKENS,
          }),
    });

    if (!res.ok || !res.body) {
      const thong = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${thong.slice(0, 200)}`);
    }

    let text = '';
    let finishReason: string | null = null;
    const mangTool = new Map<number, { id: string; name: string; args: string }>();

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      daCoByte = true;
      lui();
      buf += dec.decode(value, { stream: true });
      const dong = buf.split('\n');
      buf = dong.pop() ?? '';

      for (const d of dong) {
        if (!d.startsWith('data: ')) continue;
        const p = d.slice(6).trim();
        if (!p || p === '[DONE]') continue;
        let j: any;
        try { j = JSON.parse(p); } catch { continue; }

        /*
         * ─── TUYẾN ANTHROPIC ───
         * Khung hoàn toàn khác OpenAI: chữ đi trong `content_block_delta`
         * kiểu `text_delta`; tham số tool đi trong `input_json_delta` và phải
         * NỐI DẦN (model gửi JSON từng mẩu, mỗi mẩu vô nghĩa nếu đứng riêng);
         * lý do dừng nằm ở `message_delta.delta.stop_reason`.
         */
        if (laAnthropic) {
          if (o.chinhHang) ghiKhoi(j);
          if (j.type === 'message_start') {
            inputTokens = j.message?.usage?.input_tokens ?? inputTokens;
            cacheDocTokens = j.message?.usage?.cache_read_input_tokens ?? cacheDocTokens;
            cacheGhiTokens = j.message?.usage?.cache_creation_input_tokens ?? cacheGhiTokens;
          } else if (j.type === 'content_block_start' && j.content_block?.type === 'fallback') {
            /* Lùi phía máy chủ khi model từ chối (`fallbacks: "default"`): mọi
               `tool_use` TRƯỚC khối fallback phải bỏ — model sau làm lại từ đầu. */
            mangTool.clear();
          } else if (j.type === 'content_block_start' && j.content_block?.type === 'tool_use') {
            mangTool.set(j.index ?? mangTool.size, {
              id: String(j.content_block.id ?? ''),
              name: String(j.content_block.name ?? ''),
              args: '',
            });
          } else if (j.type === 'content_block_delta') {
            if (j.delta?.type === 'text_delta' && typeof j.delta.text === 'string') {
              text += j.delta.text;
              const sach = catRacCong(j.delta.text);
              if (sach) o.onText(sach);
            } else if (j.delta?.type === 'input_json_delta') {
              const cuTool = mangTool.get(j.index ?? 0);
              if (cuTool) cuTool.args += String(j.delta.partial_json ?? '');
            }
          } else if (j.type === 'message_delta') {
            if (j.delta?.stop_reason) finishReason = stopSangFinish(j.delta.stop_reason);
            if (j.usage?.output_tokens) outputTokens = j.usage.output_tokens;
            if (j.usage?.cache_read_input_tokens) cacheDocTokens = j.usage.cache_read_input_tokens;
            if (j.usage?.cache_creation_input_tokens) cacheGhiTokens = j.usage.cache_creation_input_tokens;
            if (j.usage?.input_tokens) inputTokens = j.usage.input_tokens;
            /* Compact phía máy chủ: top-level KHÔNG gồm lượt tóm tắt ⇒ cộng riêng từ `iterations`. */
            if (Array.isArray(j.usage?.iterations)) {
              nenVao = 0; nenRa = 0;
              for (const it of j.usage.iterations) {
                if (it?.type !== 'compaction') continue;
                nenVao += Number(it.input_tokens ?? 0) + Number(it.cache_read_input_tokens ?? 0) + Number(it.cache_creation_input_tokens ?? 0);
                nenRa += Number(it.output_tokens ?? 0);
              }
            }
            if (j.usage?.server_tool_use) timWeb = Number(j.usage.server_tool_use.web_search_requests ?? 0) || 0;
          } else if (j.type === 'error') {
            throw new Error(`Cổng trả lỗi: ${JSON.stringify(j.error ?? j).slice(0, 200)}`);
          }
          continue;
        }

        if (j.usage) {
          inputTokens = j.usage.prompt_tokens ?? inputTokens;
          outputTokens = j.usage.completion_tokens ?? outputTokens;
          cacheDocTokens = j.usage.prompt_tokens_details?.cached_tokens ?? cacheDocTokens;
        }

        // ⚠️ `finish_reason` nằm ở CHÍNH gói cuối, KHÔNG nằm trong `delta` —
        // nên vòng lặp cũ (chỉ đọc `delta` rồi `continue`) bỏ qua nó hoàn
        // toàn. Đo thật 19/08/2026: cổng gửi `finish_reason: "length"` khi
        // chạm trần, và mã không hề đọc.
        if (j.choices?.[0]?.finish_reason) finishReason = j.choices[0].finish_reason;

        const delta = j.choices?.[0]?.delta;
        if (!delta) continue;

        if (typeof delta.content === 'string' && delta.content) {
          text += delta.content;
          const sach = catRacCong(delta.content);
          if (sach) o.onText(sach);
        }

        if (Array.isArray(delta.tool_calls)) {
          for (const tc of delta.tool_calls) {
            const idx = typeof tc.index === 'number' ? tc.index : 0;
            const cu = mangTool.get(idx) ?? { id: '', name: '', args: '' };
            if (tc.id) cu.id = tc.id;
            if (tc.function?.name) cu.name += tc.function.name;
            if (typeof tc.function?.arguments === 'string') cu.args += tc.function.arguments;
            mangTool.set(idx, cu);
          }
        }
      }
    }

    const toolCalls: ToolCall[] = Array.from(mangTool.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([idx, t]) => ({
        // Cổng thường có gửi `id`, nhưng không phải lúc nào cũng có. Thiếu id
        // thì tin nhắn `role:'tool'` không móc lại được và cả lượt sau hỏng,
        // nên tự đặt một id ổn định thay vì để rỗng.
        id: t.id || `call_${idx}`,
        type: 'function' as const,
        function: { name: t.name, arguments: t.args || '{}' },
      }))
      .filter((t) => t.function.name);

    // Cổng không trả usage (hoặc trả 0) ⇒ ước lượng thô để cầu dao ngân sách
    // vẫn có số mà cộng. Thà ước lượng còn hơn ghi 0 — ghi 0 thì tiêu bao
    // nhiêu cũng không bao giờ chạm trần.
    if (outputTokens === 0) {
      outputTokens = Math.ceil((text.length + toolCalls.reduce((s, t) => s + t.function.arguments.length, 0)) / 4);
    }
    if (gui && o.chinhHang) {
      /* Anthropic chính hãng TÁCH `input_tokens` (phần không qua đệm) khỏi hai
         phần đệm. Tiền tính đúng từng phần; còn số token trả về cho hạn mức 5
         giờ thì GỘP lại — cùng nghĩa với rambo (input của rambo đã gồm đệm). */
      daGhiSo = true;
      const usd = await ghiDung({
        userId: o.chinhHang.userId, viec: o.chinhHang.viec, hang: o.chinhHang.hang, model: o.model,
        keyId: gui.key.id,
        dung: { input: inputTokens, output: outputTokens, cacheDoc: cacheDocTokens, cacheGhi: cacheGhiTokens, nenVao, nenRa, timWeb },
        thanhCong: true, thoiGianMs: Date.now() - gui.batDau, ttfbMs: gui.ttfbMs,
      });
      const khoi = dsKhoiGoc();
      return {
        text, toolCalls, finishReason,
        inputTokens: inputTokens + cacheDocTokens + cacheGhiTokens + nenVao,
        outputTokens: outputTokens + nenRa, cacheDocTokens, cacheGhiTokens, usdChinhHang: usd,
        ...(khoi.length ? { khoiAnthropic: khoi } : {}),
      };
    }

    if (inputTokens === 0) {
      inputTokens = Math.ceil((o.system.length + JSON.stringify(o.messages).length) / 4);
    }

    return { text, toolCalls, finishReason, inputTokens, outputTokens, cacheDocTokens, cacheGhiTokens };
  } finally {
    clearTimeout(timer);
    o.signal.removeEventListener('abort', huy);
    if (gui && o.chinhHang && !daGhiSo) {
      /* Luồng gãy giữa chừng — vẫn ghi phần Anthropic đã báo (token vào đã bị tính). */
      void ghiDung({
        userId: o.chinhHang.userId, viec: o.chinhHang.viec, hang: o.chinhHang.hang, model: o.model,
        keyId: gui.key.id,
        dung: { input: inputTokens, output: outputTokens, cacheDoc: cacheDocTokens, cacheGhi: cacheGhiTokens, nenVao, nenRa, timWeb },
        thanhCong: false, maLoi: 'LUONG_GAY', thoiGianMs: Date.now() - gui.batDau, ttfbMs: gui.ttfbMs,
      });
    }
  }
}
