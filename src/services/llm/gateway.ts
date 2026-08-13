/**
 * CỔNG LLM DUY NHẤT CỦA CẢ WEB — modelapi.vn (phần mềm New API).
 * ─────────────────────────────────────────────────────────────────────
 * Trước file này mỗi module tự tìm đường ra Internet: Interview và AI
 * Chat gọi `LLM_BASE_URL` (cổng Rambo — ĐÃ HẾT HẠN), CV Builder gọi
 * `OPENAI_COMPAT_*`, robot Maker Lab gọi một biến thứ ba. Đổi nhà cung
 * cấp có nghĩa là đi sửa sáu chỗ và bỏ sót ba.
 *
 * Từ đây: MỘT khoá, MỘT base URL, MỘT bảng model, MỘT bảng giá.
 *
 * Cổng chạy New API nên nó mở đồng thời nhiều tuyến (đã dò 11/08/2026,
 * không khoá → 401 chứ không 404, tức tuyến có thật):
 *   POST /v1/chat/completions   tuyến OpenAI      → dùng cho hầu hết
 *   POST /v1/messages           tuyến Anthropic   → dùng cho AI Chat
 *                                                   (ảnh + PDF + stream)
 *   POST /v1/responses          tuyến OpenAI mới  → chưa dùng
 *
 * Khoá lấy từ `LLM_GATEWAY_API_KEY`, và nếu trống thì `OPENAI_COMPAT_API_KEY`
 * — biến mà CV Builder / Jobs AI / robot đã cấu hình sẵn trên VPS. Nghĩa là
 * KHÔNG cần thêm secret nào để phần còn lại của web đi qua cổng mới.
 *
 * ⚠️ `ANTHROPIC_API_KEY` + `LLM_BASE_URL` là dấu vết cổng Rambo đã chết. Còn
 * đọc chúng ở đây chỉ để một VPS chưa kịp đổi biến vẫn chạy, KHÔNG phải vì
 * chúng còn đúng. Thấy model tên `rb-*` là biết đang nhìn vào đường đã chết.
 */

import { xinSlot, type MucUuTien } from './hangDoi.js';

// ─── Địa chỉ + khoá ────────────────────────────────────────────────

/**
 * Gốc của cổng, KHÔNG kèm `/v1` (các hàm bên dưới tự ghép).
 *
 * Chấp nhận cả hai cách viết trong env vì hai module cũ ghi khác nhau:
 * `https://modelapi.vn` và `https://modelapi.vn/v1` đều ra cùng một gốc.
 */
export function gatewayRoot(): string {
  const raw =
    process.env.LLM_GATEWAY_BASE_URL ||
    process.env.OPENAI_COMPAT_BASE_URL ||
    process.env.LLM_BASE_URL ||
    'https://modelapi.vn';
  return raw.replace(/\/+$/, '').replace(/\/v1$/, '');
}

/** Khoá của cổng. Một khoá cho mọi tính năng. */
export function gatewayKey(): string | undefined {
  return (
    process.env.LLM_GATEWAY_API_KEY ||
    process.env.OPENAI_COMPAT_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    undefined
  );
}

/** Có đủ khoá để gọi không. Thiếu khoá ⇒ mọi module tự hạ xuống chế độ tĩnh. */
export function gatewayConfigured(): boolean {
  return !!gatewayKey();
}

/** `POST` tuyến OpenAI — dùng cho gần như mọi lời gọi. */
export function chatCompletionsUrl(): string {
  return `${gatewayRoot()}/v1/chat/completions`;
}

/** `POST` tuyến Anthropic — giữ nguyên khối ảnh/PDF mà tuyến OpenAI không có. */
export function messagesUrl(): string {
  return `${gatewayRoot()}/v1/messages`;
}

// ─── Danh mục model ────────────────────────────────────────────────

export type ModelVendor = 'openai' | 'anthropic' | 'deepseek' | 'xai' | 'other';

export interface ModelInfo {
  vendor: ModelVendor;
  /** $ / 1 triệu token vào. */
  in: number;
  /** $ / 1 triệu token ra. */
  out: number;
  /** Đọc được ảnh trong lượt hỏi. */
  vision: boolean;
  /** Một dòng mô tả để người sau biết chọn gì. */
  note: string;
}

/**
 * Model trên cổng.
 *
 * ⚠️⚠️ TRANG RANKINGS NÓI DỐI VỀ CÁI BẠN MUA ĐƯỢC. Nó liệt kê model của
 * TOÀN cổng — gồm cả những model thuộc nhóm (group) khác. Khoá của web này,
 * đo thật ngày 11/08/2026 bằng `GET /v1/models`, chỉ có TÁM:
 *
 *     gpt-5.6-sol · gpt-5.6-terra · gpt-5.5 · gpt-5.4 · gpt-5.4-mini
 *     codex-auto-review · gpt-image-2 · gpt-image-1.5
 *
 * KHÔNG có model Claude nào. Gọi `claude-sonnet-5` trả về
 * `HTTP 503 "No available channel for model … under group default"` — một
 * lỗi 503 nghe như cổng đang bận, nhưng nó vĩnh viễn cho tới khi có người
 * mở kênh Anthropic trong Console. Đừng đọc Rankings rồi tin; chạy
 * `npm run llm:check` — nó đối chiếu bảng này với `/v1/models` và kêu ngay.
 *
 * Các mục `claude-*` / `deepseek` / `grok` giữ lại CHỈ để tính giá cho đúng
 * nếu sau này mở kênh; chúng không được dùng trong `PURPOSE_MODEL`.
 *
 * ⚠️ GIÁ Ở ĐÂY LÀ ƯỚC LƯỢNG theo bảng giá gốc của từng nhà. Cổng gộp bán
 * theo bảng riêng của nó và trang giá thì khoá sau đăng nhập
 * (`/api/pricing` trả "pricing is disabled"), nên `costUsd` chỉ để so sánh
 * tương đối giữa các tính năng — đừng đọc nó như hoá đơn. Muốn số đúng thì
 * đặt `LLM_PRICE_OVERRIDES` (JSON: {"model":{"in":1,"out":5}}) lấy từ
 * Console của cổng.
 */
export const MODEL_CATALOG: Record<string, ModelInfo> = {
  // ── OpenAI — TÁM model khoá này thật sự mua được (đo 11/08/2026) ──
  // Độ trễ trong ghi chú là thời gian thật cho một lượt 10 token vào / 5 ra.
  'gpt-5.6-sol': { vendor: 'openai', in: 1.25, out: 10, vision: true, note: 'Mạnh nhất; ĐỌC ẢNH ĐÚNG (~4,7s). Việc quan trọng + mọi lượt có ảnh' },
  'gpt-5.5': { vendor: 'openai', in: 1.25, out: 10, vision: true, note: 'Mạnh, nhanh hơn sol (~2,4s). Ngựa thồ cho việc tương tác' },
  'gpt-5.6-terra': { vendor: 'openai', in: 0.6, out: 4, vision: true, note: 'Rẻ hơn, chậm (~4,2s). Việc chạy nền' },
  'gpt-5.4': { vendor: 'openai', in: 1, out: 8, vision: true, note: 'Thế hệ trước (~1,4s)' },
  'gpt-5.4-mini': { vendor: 'openai', in: 0.15, out: 0.6, vision: true, note: 'Rẻ + nhanh nhất (~1,3s). Việc máy đọc' },
  'codex-auto-review': { vendor: 'openai', in: 1.25, out: 10, vision: false, note: 'Chuyên rà code; chậm nhất (~6,7s). Chưa dùng ở đâu' },
  'gpt-image-2': { vendor: 'openai', in: 0, out: 0, vision: true, note: 'Sinh ảnh — không phải model chat' },
  'gpt-image-1.5': { vendor: 'openai', in: 0, out: 0, vision: true, note: 'Sinh ảnh — không phải model chat' },
  // ── Dưới đây KHÔNG có trong nhóm của khoá hiện tại (503). Giữ để tính giá
  //    đúng nếu sau này mở kênh, và để `llm:check` so sánh. ──
  'gpt-5.6-luna': { vendor: 'openai', in: 0.25, out: 2, vision: true, note: '⚠ chưa mua được' },
  // ── Anthropic — ⚠ CHƯA MUA ĐƯỢC (kênh chưa mở trong nhóm của khoá) ──
  'claude-opus-5': { vendor: 'anthropic', in: 5, out: 25, vision: true, note: '⚠ chưa mua được — suy luận sâu nhất + đọc PDF gốc' },
  'claude-sonnet-5': { vendor: 'anthropic', in: 3, out: 15, vision: true, note: '⚠ chưa mua được — giỏi code, giá vừa' },
  'claude-sonnet-4-6': { vendor: 'anthropic', in: 3, out: 15, vision: true, note: '⚠ chưa mua được' },
  'claude-fable-5': { vendor: 'anthropic', in: 10, out: 50, vision: true, note: '⚠ chưa mua được — đắt nhất, gấp đôi opus-5' },
  'claude-opus-4-8': { vendor: 'anthropic', in: 5, out: 25, vision: true, note: '⚠ chưa mua được' },
  'claude-opus-4-7': { vendor: 'anthropic', in: 5, out: 25, vision: true, note: '⚠ chưa mua được' },
  'claude-opus-4-6': { vendor: 'anthropic', in: 5, out: 25, vision: true, note: '⚠ chưa mua được' },
  // ── Khác — cũng chưa mua được ──
  'deepseek-v4-flash': { vendor: 'deepseek', in: 0.27, out: 1.1, vision: false, note: '⚠ chưa mua được' },
  'grok-4.5': { vendor: 'xai', in: 3, out: 15, vision: true, note: '⚠ chưa mua được' },
};

/** Giá thật (env đè lên bảng ước lượng). Model lạ → mức giữa, không bao giờ $0. */
export function priceOf(model: string): { in: number; out: number } {
  const raw = process.env.LLM_PRICE_OVERRIDES;
  if (raw) {
    try {
      const map = JSON.parse(raw) as Record<string, { in?: number; out?: number }>;
      const hit = map[model];
      if (hit && Number.isFinite(hit.in) && Number.isFinite(hit.out)) {
        return { in: Number(hit.in), out: Number(hit.out) };
      }
    } catch {
      // JSON hỏng thì im lặng dùng bảng mặc định — một biến env sai chính tả
      // không đáng để làm chết lời gọi AI.
    }
  }
  const hit = MODEL_CATALOG[model];
  if (hit) return { in: hit.in, out: hit.out };
  // ⚠️ MÁY NHÀ LÀ MIỄN PHÍ — điện của chính mình, không có hoá đơn nào.
  //
  // Không có nhánh này thì `qwen3.5-9b-local` rơi vào mức mặc định $3/$15 bên
  // dưới, và mọi lượt chạy cục bộ lại cộng tiền ẢO vào sổ chi tiêu ngày. Đủ
  // nhiều thì nó chạm trần cứng 40 $ và cắt SẠCH cả web — vì một việc không
  // tốn xu nào. Đúng loại lỗi không bao giờ báo, chỉ làm mọi thứ tắt dần.
  if (isLocalModel(model)) return { in: 0, out: 0 };
  // Model cũ của cổng Rambo hoặc model mới chưa kịp vào bảng.
  return { in: 3, out: 15 };
}

/** Tên model mà máy nhà đang phục vụ. Dùng để biết một lượt gọi có tốn tiền không. */
export function isLocalModel(model: string): boolean {
  return model === (process.env.LLM_LOCAL_MODEL?.trim() || 'qwen3.5-9b-local');
}

export function costUsd(model: string, inTok: number, outTok: number): number {
  const p = priceOf(model);
  return (inTok * p.in + outTok * p.out) / 1_000_000;
}

export function vendorOf(model: string): ModelVendor {
  const hit = MODEL_CATALOG[model];
  if (hit) return hit.vendor;
  if (model.startsWith('claude') || model.startsWith('rb-')) return 'anthropic';
  if (model.startsWith('gpt')) return 'openai';
  if (model.startsWith('deepseek')) return 'deepseek';
  if (model.startsWith('grok')) return 'xai';
  return 'other';
}

/** Model này có nên đi tuyến `/v1/messages` không (chỉ họ Claude mới hiểu). */
export function isAnthropicModel(model: string): boolean {
  return vendorOf(model) === 'anthropic';
}

// ─── Phân model theo công việc ─────────────────────────────────────

/**
 * Mỗi công việc trên web có một cái tên ở đây, và tên đó quyết định model.
 *
 * Nguyên tắc chia:
 *  • Việc NGƯỜI DÙNG ĐỌC TỪNG CHỮ và sẽ dựa vào để ra quyết định — báo cáo
 *    phỏng vấn, mổ CV, chấm bài thi, kèm code — dùng model mạnh nhất. Đây là
 *    chỗ chất lượng đáng tiền.
 *  • Việc MÁY ĐỌC (tách JSON, phân loại, dịch mẩu ngắn) dùng model rẻ. Không
 *    ai cảm nhận được sự khác biệt, nhưng hoá đơn thì có.
 *  • Việc CHẠY NỀN, số lượng lớn (sinh bài hàng loạt, bản tin sáng) dùng model
 *    tầm giữa: nó chạy khi không ai ngồi xem, và một vòng lặp hỏng ở đây tốn
 *    tiền nhanh hơn mọi thứ khác.
 *
 * Đổi model KHÔNG cần sửa mã: đặt biến `LLM_MODEL_<TÊN VIẾT HOA>`, ví dụ
 * `LLM_MODEL_INTERVIEW_REPORT=gpt-5.6-sol`.
 */
export type LlmPurpose =
  | 'chat_pro'            // CuongMini Pro — hội thoại
  | 'chat_max'            // CuongMini Max — hội thoại khó nhất
  | 'chat_vision'         // bất kỳ lượt nào có ẢNH, bất kể bậc nào
  | 'chat_free_fallback'  // bản miễn phí khi Groq chết
  | 'interview_grade'     // chấm từng câu trả lời
  | 'interview_report'    // báo cáo tổng kết cuối buổi
  | 'interview_generate'  // sinh ngân hàng câu hỏi
  | 'language_tutor'      // gia sư ngoại ngữ, chấm câu người học viết
  | 'language_bulk'       // sinh từ vựng/bài đọc hàng loạt
  | 'codelab_coach'       // kèm code, giải thích lỗi
  | 'codelab_bulk'        // sinh bài tập hàng loạt
  | 'cv_critique'         // mổ CV — tính năng CV Builder được đánh giá qua đây
  | 'cv_writing'          // thư xin việc, viết lại gạch đầu dòng, dịch CV
  | 'cv_parse'            // tách JSON từ CV/JD — máy đọc
  | 'exam_grade'          // chấm bài tự luận phòng thi
  | 'exphub_doc'          // sinh tài liệu cho Exp Hub
  | 'news_bulletin'       // bản tin công nghệ chạy nền mỗi sáng
  | 'doc_ocr'             // chép đề/bài giảng từ ẢNH ra chữ + công thức
  | 'robot_voice';        // robot Maker Lab — độ trễ quan trọng ngang độ thông minh

const PURPOSE_MODEL: Record<LlmPurpose, string> = {
  // Bậc Max lấy model mạnh nhất mua được; Pro lấy gpt-5.5 vì nó nhanh gần gấp
  // đôi (2,4s so với 4,7s) mà vẫn thuộc nhóm mạnh — trong hội thoại, độ trễ là
  // thứ người dùng cảm thấy trước cả chất lượng.
  chat_pro: 'gpt-5.5',
  chat_max: 'gpt-5.6-sol',
  // Lượt có ảnh LUÔN dùng sol, kể cả bậc Pro. Đo 11/08 với một ảnh 1×1 px:
  // sol trả lời đúng "1×1", còn 5.5 / terra / mini đều tự tin nói "16×16".
  // Chúng nhận được ảnh nhưng không thật sự nhìn — và một câu trả lời sai mà
  // trôi chảy thì tệ hơn hẳn một lỗi.
  chat_vision: 'gpt-5.6-sol',
  chat_free_fallback: 'gpt-5.4-mini',

  interview_grade: 'gpt-5.5',
  interview_report: 'gpt-5.6-sol',
  interview_generate: 'gpt-5.6-sol',

  language_tutor: 'gpt-5.5',
  language_bulk: 'gpt-5.6-terra',

  codelab_coach: 'gpt-5.5',
  codelab_bulk: 'gpt-5.6-terra',

  cv_critique: 'gpt-5.6-sol',
  cv_writing: 'gpt-5.5',
  cv_parse: 'gpt-5.4-mini',

  exam_grade: 'gpt-5.5',
  exphub_doc: 'gpt-5.6-terra',
  news_bulletin: 'gpt-5.6-terra',
  // Chép đề toán từ ảnh. Đo 13/08 trên một ảnh chụp lệch, nén JPEG q55, đủ
  // phân số lồng / căn bậc ba / cận tích phân / vector: `sol` đúng 7/7 bài,
  // `gpt-5.4-mini` (rẻ hơn 8 lần) rụng mũi tên vector `AB` → `|AB|`. Ở đây
  // một ký hiệu sai là hỏng cả bài, nên KHÔNG hạ model để tiết kiệm.
  doc_ocr: 'gpt-5.6-sol',
  // Robot đang chạy tốt với model này sau bốn lần vá lỗi âm thanh — đổi model
  // là đổi cả nhịp nói lẫn cách nó chọn lệnh, nên giữ nguyên. Thấy chậm thì
  // `gpt-5.4-mini` nhanh hơn rõ (1,3s so với 4,2s).
  robot_voice: 'gpt-5.6-terra',
};

// ─── Định tuyến lai: việc nào đi máy nhà, việc nào đi cổng ─────────

/**
 * Máy nhà (RTX 3060) chạy Qwen3.5-9B qua llama.cpp, mở đúng tuyến OpenAI
 * `/v1/chat/completions` nên cắm vào đây không cần lớp chuyển đổi nào.
 *
 * Đo 13/08/2026, cùng một đề bài production của robot:
 *     cổng `gpt-5.6-terra`  chữ đầu 2.119–4.575 ms
 *     máy nhà  9B           chữ đầu    96–  333 ms
 * Đổi lại: tiếng Việt 87% so với 93%, và tục ngữ yếu hơn (đã bù bằng tra web).
 *
 * BA biến, không phải bảy — một địa chỉ, một khoá, một danh sách việc:
 *     LLM_LOCAL_BASE_URL=http://127.0.0.1:18100   (KHÔNG kèm /v1)
 *     LLM_LOCAL_API_KEY=...
 *     LLM_LOCAL_PURPOSES=robot_voice,cv_parse,language_bulk,...
 *
 * Thiếu bất kỳ biến nào ⇒ mọi việc đi cổng như cũ. Đây là mặc định, và nó
 * phải là mặc định: máy nhà mất điện hay mất mạng KHÔNG được làm chết web.
 */
function localRoot(): string | undefined {
  const raw = process.env.LLM_LOCAL_BASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/+$/, '').replace(/\/v1$/, '');
}

/** Việc nào được phép đi máy nhà. Tên sai chính tả ⇒ việc đó đi cổng, im lặng. */
function localPurposes(): Set<string> {
  const raw = process.env.LLM_LOCAL_PURPOSES ?? '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export interface LlmEndpoint {
  /** Gốc, KHÔNG kèm `/v1`. */
  root: string;
  key: string | undefined;
  /** `true` = đang đi máy nhà. Dùng để biết có được tụt về cổng khi hỏng không. */
  local: boolean;
  label: string;
}

/**
 * Địa chỉ + khoá cho một công việc.
 *
 * ⚠️ Gọi hàm này chứ đừng gọi thẳng `chatCompletionsUrl()` + `gatewayKey()`
 * nữa — cặp đó luôn trả về CỔNG, nên chỗ nào còn dùng nó là chỗ đó không bao
 * giờ đi máy nhà dù đã bật env.
 */
/**
 * Việc PHẢI NHÌN ĐƯỢC ẢNH. Máy nhà đang chạy Qwen3.5-9B — model CHỮ, không có
 * mắt. Cho việc này đi máy nhà thì nó KHÔNG báo lỗi: nó trả lời trôi chảy như
 * chưa từng thấy tấm ảnh nào, và người dùng nhận về một bản chép bịa. Nên chặn
 * ở đây, chứ không trông vào việc nhớ đừng ghi tên nó vào `LLM_LOCAL_PURPOSES`.
 */
const VISION_PURPOSES = new Set<LlmPurpose>(['chat_vision', 'doc_ocr']);

export function endpointFor(purpose: LlmPurpose): LlmEndpoint {
  const root = localRoot();
  if (root && !VISION_PURPOSES.has(purpose) && localPurposes().has(purpose) && process.env.LLM_LOCAL_API_KEY) {
    return { root, key: process.env.LLM_LOCAL_API_KEY, local: true, label: 'may-nha' };
  }
  return { root: gatewayRoot(), key: gatewayKey(), local: false, label: 'cong' };
}

/** Cổng dự phòng khi máy nhà không trả lời. Luôn là cổng, không bao giờ ngược lại. */
export function fallbackEndpoint(): LlmEndpoint {
  return { root: gatewayRoot(), key: gatewayKey(), local: false, label: 'cong' };
}

// ─── Xếp hàng trên máy nhà ─────────────────────────────────────────

/**
 * Việc nào được chen trước việc nào khi máy nhà bận.
 *
 * Máy nhà có ĐÚNG MỘT luồng (`--parallel 1`, đo 14/08/2026). Bốn lượt cùng
 * lúc xếp thành 3,36 · 6,72 · 10,11 · 13,48 giây — nên thứ tự ở đây không
 * phải chuyện thẩm mỹ, nó là chênh lệch 10 giây giữa robot đáp ngay và robot
 * đứng câm. Chi tiết trong `hangDoi.ts`.
 */
const UU_TIEN: Partial<Record<LlmPurpose, MucUuTien>> = {
  // Có người đang đứng trước mặt con robot và chờ nó trả lời.
  robot_voice: 'robot',
  // Chạy nền, không ai ngồi xem ⇒ nhường mọi thứ khác.
  language_bulk: 'nen',
  codelab_bulk: 'nen',
  exphub_doc: 'nen',
  news_bulletin: 'nen',
};

export function uuTienCua(purpose: LlmPurpose): MucUuTien {
  return UU_TIEN[purpose] ?? 'nguoi';
}

export interface DiemCuoiDaXep {
  ep: LlmEndpoint;
  /** BẮT BUỘC gọi khi xong, luôn đặt trong `finally`. An toàn khi gọi lại. */
  tra: () => void;
  choMs: number;
  /** Có giá trị khi bị đẩy sang cổng thay vì chờ — cho log và trang quản trị. */
  lyDo?: string;
}

/**
 * ⭐ ĐÂY LÀ HÀM MỌI CHỖ NÊN GỌI, thay cho `endpointFor()` trần.
 *
 * Nó làm đúng hai việc mà `endpointFor()` không làm:
 *   1. Xếp hàng theo ưu tiên khi đích đến là máy nhà (robot chen đầu).
 *   2. Khi hàng đầy hoặc robot đang giữ máy, nó **đổi luôn đích sang cổng**
 *      thay vì bắt người dùng chờ. Người gọi không cần biết chuyện đó xảy ra.
 *
 * Đích đến là cổng thì hàm trả về ngay lập tức, không đụng gì tới hàng đợi —
 * cổng lo phần chịu tải của nó, không phải việc của ta.
 *
 * ```ts
 * const { ep, tra } = await xinDiemCuoi('cv_parse');
 * try {
 *   await fetch(chatUrlOf(ep), { ... });
 * } finally {
 *   tra();               // ⚠️ quên dòng này là mất một slot vĩnh viễn
 * }
 * ```
 */
export async function xinDiemCuoi(purpose: LlmPurpose): Promise<DiemCuoiDaXep> {
  const ep = endpointFor(purpose);
  if (!ep.local) return { ep, tra: () => {}, choMs: 0 };

  const ve = await xinSlot(uuTienCua(purpose));
  if (ve.duoc) return { ep, tra: ve.tra, choMs: ve.choMs };

  // Bị đẩy ra cổng. KHÔNG phải lỗi — đây chính là việc lớp 2 sinh ra để làm.
  return { ep: fallbackEndpoint(), tra: () => {}, choMs: ve.choMs, lyDo: ve.lyDo };
}

/** `POST` cho một điểm cuối bất kỳ. */
export function chatUrlOf(ep: LlmEndpoint): string {
  return `${ep.root}/v1/chat/completions`;
}

/**
 * Model cho một công việc.
 *
 * Máy nhà chỉ phục vụ MỘT model, và tên của nó không nằm trong bảng của cổng —
 * nên khi việc đi máy nhà thì tên model cũng phải đổi theo, nếu không
 * llama-server nhận một cái tên nó không biết. `LLM_MODEL_<PURPOSE>` vẫn đè
 * lên tất cả, để còn ghim từng việc một khi cần.
 */
export function modelFor(purpose: LlmPurpose, ep?: LlmEndpoint): string {
  const env = process.env[`LLM_MODEL_${purpose.toUpperCase()}`];
  if (env && env.trim()) return env.trim();
  const diem = ep ?? endpointFor(purpose);
  if (diem.local) return process.env.LLM_LOCAL_MODEL?.trim() || 'qwen3.5-9b-local';
  return PURPOSE_MODEL[purpose];
}

/** Toàn bộ bản đồ — cho trang quản trị và cho lệnh kiểm tra cấu hình. */
export function allPurposeModels(): Array<{
  purpose: LlmPurpose;
  model: string;
  price: { in: number; out: number };
  vendor: ModelVendor;
  /** 'may-nha' hay 'cong' — không có cột này thì không ai biết định tuyến đã bật hay chưa. */
  noi: string;
}> {
  return (Object.keys(PURPOSE_MODEL) as LlmPurpose[]).map((p) => {
    const ep = endpointFor(p);
    const model = modelFor(p, ep);
    // Việc chạy ở máy nhà thì KHÔNG tính tiền — đó là điểm chính của nó.
    const price = ep.local ? { in: 0, out: 0 } : priceOf(model);
    return { purpose: p, model, price, vendor: vendorOf(model), noi: ep.label };
  });
}
