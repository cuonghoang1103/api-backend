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
import { loiCanVi, loiHetHan, xemHanMuc, xemViAgent, type HanMuc } from './quota.js';
import { runServerTool } from './serverTools.js';
import { buildSystemPrompt, catGhiChu, type WorkspaceHint } from './prompt.js';
import { parseCapabilities, toolByName, toolsForGateway, type AgentCapability } from './tools.js';
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
export type MucNoLuc = 'nhanh' | 'canBang' | 'ky';

const TRAN_BUOC: Record<MucNoLuc, number> = {
  nhanh: 8,
  canBang: 30,
  ky: 60,
};

function docMucNoLuc(raw: unknown): MucNoLuc {
  return raw === 'nhanh' || raw === 'ky' ? raw : 'canBang';
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
const MAX_OUTPUT_TOKENS = 4_000;
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
  if (raw.length > MAX_MESSAGES) {
    throw new AgentInputError(`Hội thoại quá dài (${raw.length} tin nhắn, trần ${MAX_MESSAGES}). Hãy bắt đầu phiên mới.`, 'TOO_MANY_MESSAGES');
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
  if (tongChu > MAX_TOTAL_CHARS) {
    throw new AgentInputError(
      `Hội thoại quá nặng (${Math.round(tongChu / 1000)}k ký tự, trần ${MAX_TOTAL_CHARS / 1000}k). Hãy bắt đầu phiên mới.`,
      'CONVERSATION_TOO_LARGE',
    );
  }
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
function demBuoc(messages: AgentMessage[]): number {
  return messages.filter((m) => m.role === 'assistant' && m.tool_calls?.length).length;
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

  const messages = sanitizeIncoming(input.messages);
  const capabilities: AgentCapability[] = parseCapabilities(input.capabilities);
  const buocDaDi = demBuoc(messages);
  const mucNoLuc = docMucNoLuc(input.mucNoLuc);
  const laPhu = input.laPhu === true;
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
        content: `Đã chạm trần ${MAX_AGENT_STEPS} bước trong một việc. Hãy hỏi lại câu hỏi hẹp hơn, hoặc bắt đầu việc mới.`,
      }],
      stop: 'max_steps',
      usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 },
      quota: goiHanMuc(await xemHanMuc(input.userId)),
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
    ...(input.workspace ? { workspace: input.workspace } : {}),
    ...(ghiChu ? { ghiChu } : {}),
  });
  const tools = toolsForGateway(capabilities);

  const { ep, tra } = await xinDiemCuoi('agent_code');
  const model = modelFor('agent_code', ep);
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
    ...(daLuoc > 0 ? { compact: { soDaLuoc: daLuoc, kyTuDaCat: daCat } } : {}),
  });

  try {
    for (let hop = 0; hop <= MAX_SERVER_HOPS; hop++) {
      // Nén NGAY TRƯỚC mỗi lời gọi, tính lại từ đầu mỗi lần: hop này vừa thêm
      // kết quả mới, nên cái "gần nhất" đã khác so với hop trước.
      const nen = nenNguCanh([...messages, ...append]);
      if (nen.soDaLuoc > daLuoc) { daLuoc = nen.soDaLuoc; daCat = nen.kyTuDaCat; }

      const ketQua = await goiCong({
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

      // ── Model không đòi tool nữa ⇒ xong lượt ──
      if (calls.length === 0) {
        append.push({ role: 'assistant', content: noiDung });
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
          const t = toolByName(c.function.name);
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
    emit(
      dutKetNoi
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

    return { text, toolCalls, inputTokens, outputTokens };
  } finally {
    clearTimeout(timer);
    o.signal.removeEventListener('abort', huy);
  }
}
