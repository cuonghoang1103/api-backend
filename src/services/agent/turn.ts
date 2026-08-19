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
  chatUrlOf,
  costUsd,
  gatewayConfigured,
  modelFor,
  xinDiemCuoi,
} from '../llm/gateway.js';
import { checkBudget, budgetMessage } from '../llm/budget.js';
import { nenNguCanh } from './compact.js';
import { MAX_VIET_TIEP, gopVietTiep } from './vietTiep.js';
import { modelAgentTu } from './models.js';
import { loiCanVi, loiHetHan, xemHanMuc, xemViAgent, type HanMuc } from './quota.js';
import { runServerTool } from './serverTools.js';
import { buildSystemPrompt, catGhiChu, type WorkspaceHint } from './prompt.js';
import { catLuotCu, loiNhacDaCat, tongKyTu } from './catCu.js';
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
const MAX_TOTAL_CHARS = 600_000;
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
const MAX_ANH = 3;
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
  | { type: 'image_url'; image_url: { url: string } };

export type AgentMessage =
  | { role: 'user'; content: string | KhoiNoiDung[] }
  | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string };

/** Sự kiện đẩy ra SSE cho app. */
export type AgentEvent =
  | { type: 'start'; model: string }
  | { type: 'text'; delta: string }
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
      /** Hạn mức 5 giờ SAU lượt này — app vẽ thẳng lên thanh đo, không phải hỏi lại. */
      quota: { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null };
      /**
       * Ngữ cảnh đã dùng tới đâu — để app vẽ vòng tròn.
       *
       * Con số này là thứ người dùng KHÔNG có cách nào tự biết: họ nhìn thấy
       * hội thoại trên màn hình nhưng không biết bao nhiêu phần trong đó còn
       * thật sự tới được model.
       */
      nguCanh: { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number };
      /** Có nén ngữ cảnh không, và cắt được bao nhiêu. Để hiện "đã lược N kết quả cũ". */
      compact?: { soDaLuoc: number; kyTuDaCat: number };
    }
  | { type: 'error'; error: string; code?: string };

export interface AgentTurnInput {
  messages: unknown;
  capabilities: unknown;
  workspace?: WorkspaceHint;
  /** Cấp độ nỗ lực người dùng chọn. Quyết định trần bước, KHÔNG quyết định model. */
  mucNoLuc?: unknown;
  /** Mã model người dùng chọn — đối chiếu danh sách trắng ở `models.ts`. */
  model?: unknown;
  /** Lượt này thuộc một AGENT PHỤ — prompt gọn hơn, trần bước riêng. */
  laPhu?: unknown;
  /**
   * Ghi chú dự án (`AGENTS.md`/`CLAUDE.md`) app đọc từ máy người dùng.
   *
   * App gửi lên NGUYÊN VĂN; máy chủ mới là bên cắt về trần và bọc rào. Cắt ở
   * app thì mỗi bản app cũ giữ một cái trần khác nhau, và sửa trần phải chờ
   * người dùng cập nhật app.
   */
  ghiChuDuAn?: { ten: string; noiDung: string };
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
function sanitizeIncoming(raw: unknown): AgentMessage[] {
  if (!Array.isArray(raw)) throw new AgentInputError('messages phải là mảng', 'BAD_MESSAGES');
  if (raw.length === 0) throw new AgentInputError('messages rỗng', 'BAD_MESSAGES');
  // ⚠️ KHÔNG ném khi quá dài nữa — xem `catCu.ts`. Ném ở đây nghĩa là người
  // dùng đang làm dở một việc 40 bước bỗng bị chặn hẳn và mất mạch, thứ họ đã
  // trả tiền để dựng lên. Giờ hội thoại quá dài thì tự bỏ lượt CŨ NHẤT.
  // Vẫn giữ một trần tuyệt đối rất cao để chặn payload ác ý.
  if (raw.length > MAX_MESSAGES * 5) {
    throw new AgentInputError(`messages quá lớn (${raw.length}).`, 'BAD_MESSAGES');
  }

  const out: AgentMessage[] = [];
  let tongChu = 0;

  for (const m of raw) {
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
        for (const k of tho) {
          if (!k || typeof k !== 'object') continue;
          const t = (k as { type?: unknown }).type;
          if (t === 'text') {
            const text = String((k as { text?: unknown }).text ?? '');
            tongChu += text.length;
            khoi.push({ type: 'text', text });
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
      out.push({
        role: 'assistant',
        content: typeof content === 'string' ? content : null,
        ...(calls.length ? { tool_calls: calls } : {}),
      });
    } else if (role === 'tool') {
      const id = String((m as { tool_call_id?: unknown }).tool_call_id ?? '');
      if (!id) continue; // không có id thì cổng từ chối cả lượt — bỏ còn hơn
      let content = String((m as { content?: unknown }).content ?? '');
      if (content.length > MAX_TOOL_RESULT_CHARS) {
        content = `${content.slice(0, MAX_TOOL_RESULT_CHARS)}\n[… máy chủ cắt bớt, kết quả gốc ${content.length} ký tự]`;
      }
      tongChu += content.length;
      out.push({ role: 'tool', tool_call_id: id, content });
    }
    // 'system' rơi vào đây và bị bỏ — có chủ ý, xem ghi chú đầu hàm.
  }

  // `tongChu` CỐ Ý không cộng độ dài data URI của ảnh: một ảnh 2MB là ~2,7
  // triệu ký tự base64, tức là một tấm ảnh sẽ tự mình vượt trần 600k và chặn
  // cả hội thoại. Ảnh có trần riêng (`MAX_ANH`, `MAX_ANH_BYTES`) ở trên.
  if (out.length === 0) throw new AgentInputError('Không có tin nhắn hợp lệ nào', 'BAD_MESSAGES');
  return out;
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
  const boLuot = catLuotCu(messagesGoc, MAX_TOTAL_CHARS, MAX_MESSAGES);
  const messages = boLuot.soLuotDaBo > 0
    ? [loiNhacDaCat(boLuot.soLuotDaBo), ...boLuot.messages]
    : boLuot.messages;
  const capabilities: AgentCapability[] = parseCapabilities(input.capabilities);
  const buocDaDi = demBuocViecNay(messages);
  const mucNoLuc = docMucNoLuc(input.mucNoLuc);
  const laPhu = input.laPhu === true;
  // Agent phụ KHÔNG được cắm tool MCP: nó chạy không có người ngồi duyệt từng
  // lời gọi, mà duyệt tay là chốt chặn chính của MCP.
  const toolMcp = laPhu ? [] : parseToolMcp(input.toolMcp);
  const tenMcp = new Set(toolMcp.map((t) => t.name));
  // Agent phụ có trần RIÊNG và cứng: 10 bước, bất kể người dùng chọn mức nào.
  // Để nó theo mức "Kỹ" thì ba việc phụ × 60 bước = 180 bước cho một câu hỏi.
  const MAX_AGENT_STEPS = laPhu ? 10 : TRAN_BUOC[mucNoLuc];

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
          ? `Việc phụ đã chạm trần ${MAX_AGENT_STEPS} bước.`
          : `Đã chạm trần ${MAX_AGENT_STEPS} bước cho việc này (mức "${TEN_MUC[mucNoLuc]}"). `
            + 'Nâng mức nỗ lực ở thanh trên để agent đi được xa hơn, hoặc hỏi lại câu hẹp hơn.',
      }],
      stop: 'max_steps',
      usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 },
      quota: goiHanMuc(await xemHanMuc(input.userId)),
      nguCanh: goiNguCanh(messages, boLuot.soLuotDaBo),
    });
    return;
  }

  // 2. Hạn mức 5 giờ của NGƯỜI DÙNG — bể riêng của agent.
  const hanMuc = await xemHanMuc(input.userId);
  if (hanMuc.hetHan) {
    emit({ type: 'error', error: loiHetHan(hanMuc), code: 'AGENT_QUOTA_EXCEEDED' });
    return;
  }

  // 3. Ví RIÊNG của agent trên cả site. Cạn thì chỉ agent dừng, chat/chấm
  //    bài/CV của những người không đụng tới agent vẫn chạy.
  const vi = await xemViAgent();
  if (vi.canVi) {
    emit({ type: 'error', error: loiCanVi(vi), code: 'AGENT_BUDGET_EXCEEDED' });
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
  const system = buildSystemPrompt({
    capabilities,
    mucNoLuc,
    laPhu,
    soToolMcp: toolMcp.length,
    ...(input.workspace ? { workspace: input.workspace } : {}),
    ...(ghiChu ? { ghiChu } : {}),
  });
  const tools = toolsForGateway(capabilities, toolMcp);

  const { ep, tra } = await xinDiemCuoi('agent_code');
  // Người dùng chọn model ⇒ lấy model đó; không chọn (hoặc app cũ không gửi)
  // ⇒ về đúng `PURPOSE_MODEL.agent_code` như trước.
  //
  // ⚠️ `null` nghĩa là mã HỢP LỆ nhưng nhóm của nó chưa cắm khoá. Phải nói ra
  // bằng chữ chứ không được lặng lẽ đổi sang model khác: người dùng cố ý chọn
  // GPT rồi nhận về câu trả lời của Claude thì họ đang đọc thứ họ không chọn.
  const chon = ep.local ? null : modelAgentTu(input.model);
  if (!ep.local && !chon) {
    tra();
    throw new AgentInputError(
      'Model bạn chọn chưa được cắm khoá trên máy chủ. Hãy chọn lại Claude Sonnet 5, '
      + 'hoặc báo quản trị thêm khoá của nhóm đó vào máy chủ.',
      'MODEL_CHUA_CO_KHOA',
    );
  }
  const model = chon?.model ?? modelFor('agent_code', ep);
  emit({ type: 'start', model });

  const append: AgentMessage[] = [];
  let inTong = 0;
  let outTong = 0;
  let thanhCong = false;
  let daLuoc = 0;
  let daCat = 0;

  /**
   * Dựng khung `done`. Gom về một chỗ vì có BỐN lối ra khỏi vòng lặp, và một
   * lối quên kèm `quota` là thanh đo trên giao diện đứng im ở đúng lối đó —
   * loại lỗi chỉ hiện ra khi người dùng đi đúng nhánh hiếm.
   */
  const khungXong = (stop: 'end' | 'tool_calls' | 'continue'): AgentEvent => ({
    type: 'done',
    append,
    stop,
    usage: { inputTokens: inTong, outputTokens: outTong, costUsd: costUsd(model, inTong, outTong) },
    quota: goiHanMuc({ ...hanMuc, daDung: hanMuc.daDung + inTong + outTong }),
    nguCanh: goiNguCanh([...messages, ...append], boLuot.soLuotDaBo),
    ...(daLuoc > 0 ? { compact: { soDaLuoc: daLuoc, kyTuDaCat: daCat } } : {}),
  });

  /* Trạng thái của việc VIẾT TIẾP khi chạm trần token. `viTriPrefill` là chỗ
     tin nhắn assistant dở nằm trong `append` — giữ lại để THAY nó, không đẩy
     thêm cái mới. */
  let soLanVietTiep = 0;
  let dangViet = '';
  let viTriPrefill = -1;

  try {
    for (let hop = 0; hop <= MAX_SERVER_HOPS + MAX_VIET_TIEP; hop++) {
      // Nén NGAY TRƯỚC mỗi lời gọi, tính lại từ đầu mỗi lần: hop này vừa thêm
      // kết quả mới, nên cái "gần nhất" đã khác so với hop trước.
      const nen = nenNguCanh([...messages, ...append]);
      if (nen.soDaLuoc > daLuoc) { daLuoc = nen.soDaLuoc; daCat = nen.kyTuDaCat; }

      const ketQua = await goiCongCoLuoiDo({
        url: chatUrlOf(ep),
        key: ep.key,
        model,
        system,
        messages: nen.messages,
        tools,
        signal,
        onText: (delta) => emit({ type: 'text', delta }),
      });

      inTong += ketQua.inputTokens;
      outTong += ketQua.outputTokens;

      const noiDung = catRacCong(ketQua.text);
      const calls = ketQua.toolCalls;
      const finishReason = ketQua.finishReason;

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
        else append.push({ role: 'assistant', content: gop });
        thanhCong = true;
        emit(khungXong('end'));
        return;
      }

      append.push({ role: 'assistant', content: noiDung || null, tool_calls: calls });

      // ── Chia hai vòng ──
      const vongServer = calls.filter((c) => toolByName(c.function.name)?.ring === 'server');
      const vongClient = calls.filter((c) => toolByName(c.function.name)?.ring !== 'server');

      for (const c of vongServer) {
        const args = docArgs(c.function.arguments);
        const kq = await runServerTool(c.function.name, args, input.userId);
        append.push({ role: 'tool', tool_call_id: c.id, content: kq.content });
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

    // Kết nối ĐỨT giữa chừng ≠ cổng AI trả về lỗi. Hai chuyện này cần hai câu
    // khác nhau, vì người dùng làm hai việc khác nhau: đứt thì hỏi lại là
    // xong, còn cổng lỗi thì hỏi lại cũng thế.
    //
    // Gặp thật 17/08/2026 khi backend chạy `tsx watch` tự khởi động lại giữa
    // một lượt: SSE chết, và người dùng nhận đúng dòng chữ "Cổng AI lỗi: This
    // operation was aborted" — vừa sai (cổng không lỗi) vừa không nói được
    // phải làm gì. Cùng chuyện đó xảy ra trên production mỗi lần deploy.
    const dutKetNoi = /aborted|ECONNRESET|socket hang up|terminated|fetch failed|ETIMEDOUT/i.test(message);

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
    const congThieuKenh = /unknown provider for model|No available channel/i.test(message);
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
        : dutKetNoi
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
    void ghiSo({ userId: input.userId, model, inTong, outTong, thanhCong });
  }
}

/** Gói hạn mức cho app. `Date` phải thành chuỗi vì nó đi qua JSON. */
function goiNguCanh(
  messages: readonly AgentMessage[],
  soLuotDaBo: number,
): { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number } {
  const kyTu = tongKyTu(messages);
  return {
    kyTu,
    tran: MAX_TOTAL_CHARS,
    phanTram: Math.min(100, Math.round((kyTu / MAX_TOTAL_CHARS) * 100)),
    soLuotDaBo,
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
}): Promise<void> {
  if (d.inTong === 0 && d.outTong === 0) return;
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
        costUsd: costUsd(d.model, d.inTong, d.outTong),
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
  const macDinh = chinh.startsWith('claude') ? 'claude-opus-4-8' : 'claude-sonnet-5';
  return macDinh === chinh ? 'claude-sonnet-4-6' : macDinh;
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

  try {
    const res = await fetch(o.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${o.key ?? ''}` },
      signal: imLang.signal,
      body: JSON.stringify({
        model: o.model,
        messages: [{ role: 'system', content: o.system }, ...o.messages],
        tools: o.tools,
        tool_choice: 'auto',
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
    let inputTokens = 0;
    let outputTokens = 0;

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

        if (j.usage) {
          inputTokens = j.usage.prompt_tokens ?? inputTokens;
          outputTokens = j.usage.completion_tokens ?? outputTokens;
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
    if (inputTokens === 0) {
      inputTokens = Math.ceil((o.system.length + JSON.stringify(o.messages).length) / 4);
    }

    return { text, toolCalls, finishReason, inputTokens, outputTokens };
  } finally {
    clearTimeout(timer);
    o.signal.removeEventListener('abort', huy);
  }
}
