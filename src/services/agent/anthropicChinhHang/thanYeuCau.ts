/**
 * DỰNG THÂN YÊU CẦU `/v1/messages` cho cổng chính hãng — CHẤT LƯỢNG TRƯỚC,
 * không đốt token vô ích (chủ app chốt 17/10/2026):
 *
 *  • thinking `{type:'adaptive'}` (model 5.5 chỉ nhận adaptive) + giữ & GỬI LẠI
 *    khối thinking có chữ ký ở lịch sử có tool_use. `block_binding:
 *    prefix_mismatch_behavior: "drop_block"` (beta binding) để một chỗ lịch sử
 *    bị sửa (lược kết quả cũ, nhắc đuôi…) chỉ làm RƠI khối thinking đó chứ
 *    không 400 cả lượt — tài khoản tạo sau 31/08/2026 bị kiểm chặt.
 *  • `output_config.effort` theo ĐÚNG mức người dùng (`effortTheoMuc`), mặc định `high`.
 *  • `max_tokens` rộng (64K, kẹp theo giới hạn model thật) — không cắt câu trả lời.
 *  • `context_management`: clear_thinking (giữ tất cả) → clear_tool_uses (chỉ
 *    khi ≥ 600K token, giữ 25) → compact_20260112 (300K). Ưu tiên compact.
 *  • `fallbacks: "default"` cho Opus 5.5 / Sonnet 5.5 / Fable 5.1.
 *  • Server tool (web_search / code_execution) nếu admin bật.
 *  • Prompt caching 4 mốc, tool hàm SẮP theo tên (`ganCache`).
 *
 * Mấy tham số beta trên CHƯA đo được bằng key thật (phiên này không có key).
 * Nên có `thanAnToan`: gặp 400 nhắc tới chúng thì gửi lại MỘT lần bản tối giản.
 */
import {
  BETA_COMPACT, BETA_CONTEXT_MANAGEMENT, BETA_FALLBACKS, BETA_THINKING_BINDING, DON_TOOL,
  dungFallbacks, effortTheoMuc, maxTokensAgent, nguongCompact,
} from './cauHinh.js';
import { docServerTool, gioiHanModel, khaiServerTool } from './caiDat.js';
import { ganCache } from './goi.js';

export { loiDoThamSoBeta } from './goi.js';

export interface ThanAnthropic {
  model: string;
  system?: unknown;
  messages: Array<{ role: string; content: unknown }>;
  tools?: Array<Record<string, unknown>>;
  stream: boolean;
  max_tokens: number;
  [k: string]: unknown;
}

/** Tool hàm sắp theo tên ⇒ thứ tự ổn định giữa các vòng (đệm trúng). */
export function sapTool(tools: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return [...tools].sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')));
}

/** Thêm mọi thứ của cổng chính hãng vào `than`. Trả danh sách beta cần gửi. */
export async function dungThanChinhHang(than: ThanAnthropic, o: {
  mucNoLuc?: unknown;
  /** Lượt AGENT (có tool, có dọn ngữ cảnh). `false` = lời gọi văn bản đơn (CuongMini trong thi). */
  laAgent: boolean;
  /** Tiếp một lượt `pause_turn` của server tool ⇒ giữ tin assistant cuối. */
  tiepPause?: boolean;
  maxTokens?: number;
}): Promise<string[]> {
  const beta = new Set<string>();
  const gh = await gioiHanModel(than.model);
  than.max_tokens = Math.min(gh.maxOutput, Math.max(o.maxTokens ?? 0, o.laAgent ? maxTokensAgent() : 16_000));
  than.thinking = { type: 'adaptive', block_binding: { prefix_mismatch_behavior: 'drop_block' } };
  beta.add(BETA_THINKING_BINDING);
  than.output_config = { effort: effortTheoMuc(o.mucNoLuc) };

  if (o.laAgent) {
    const edits: Array<Record<string, unknown>> = [
      { type: 'clear_thinking_20251015', keep: 'all' },
      {
        type: 'clear_tool_uses_20250919',
        trigger: { type: 'input_tokens', value: DON_TOOL.trigger },
        keep: { type: 'tool_uses', value: DON_TOOL.keep },
        clear_at_least: { type: 'input_tokens', value: DON_TOOL.clearAtLeast },
      },
    ];
    beta.add(BETA_CONTEXT_MANAGEMENT);
    const nguong = nguongCompact();
    if (nguong > 0) {
      edits.push({ type: 'compact_20260112', trigger: { type: 'input_tokens', value: nguong } });
      beta.add(BETA_COMPACT);
    }
    than.context_management = { edits };
    const st = khaiServerTool(await docServerTool());
    than.tools = [...st, ...sapTool(than.tools ?? [])];
  }
  if (dungFallbacks(than.model)) {
    than.fallbacks = 'default';
    beta.add(BETA_FALLBACKS);
  }
  ganCache(than, Boolean(o.tiepPause));
  if (Array.isArray(than.tools) && !than.tools.length) delete than.tools;
  return [...beta];
}

/**
 * Bản TỐI GIẢN để gửi lại một lần: bỏ mọi tham số beta, bỏ khối
 * thinking/compaction trong lịch sử (con đường "không beta" tài liệu
 * Anthropic cho phép), giữ thinking adaptive + effort + caching.
 */
export function thanAnToan(than: ThanAnthropic): ThanAnthropic {
  const ra: ThanAnthropic = JSON.parse(JSON.stringify(than));
  ra.thinking = { type: 'adaptive' };
  delete ra.context_management;
  delete ra.fallbacks;
  for (const m of ra.messages) {
    if (m.role !== 'assistant' || !Array.isArray(m.content)) continue;
    m.content = (m.content as Array<Record<string, unknown>>)
      .filter((k) => !['thinking', 'redacted_thinking', 'compaction'].includes(String(k.type)));
    if (!(m.content as unknown[]).length) m.content = [{ type: 'text', text: '…' }];
  }
  return ra;
}
