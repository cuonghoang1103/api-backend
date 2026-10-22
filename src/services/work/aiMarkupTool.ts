/**
 * ============================================================
 * CT WORK — MODEL VIẾT "GỌI TOOL" THÀNH CHỮ (22/10/2026)
 * ============================================================
 *
 * Lỗi thật trên production 22/10 05:24: rambo trả "claude-sonnet-5" mà (ít nhất đôi lúc) là model DeepSeek. Vòng 0–2 nó gọi
 * tool gốc bình thường; vòng 3 (đã gỡ tool) nó VIẾT lời gọi tool thành chữ theo khuôn DSML của DeepSeek:
 *
 *   <｜DSML｜function_calls>
 *   <｜DSML｜invoke name="read_command">
 *   <｜DSML｜parameter name="name" string="true">get_page</｜DSML｜parameter>
 *   <｜DSML｜parameter name="args" string="false">{"page":1}</｜DSML｜parameter>
 *   </｜DSML｜invoke>
 *   </｜DSML｜function_calls>
 *
 * ⇒ người dùng iPad nhận nguyên khối đó làm câu trả lời. File này nhận diện các khuôn "gọi tool bằng chữ" hay gặp của mọi
 * họ model (DSML, token đặc biệt DeepSeek V3 `<｜tool▁calls▁begin｜>`, Hermes/Qwen `<tool_call>`, Anthropic-XML
 * `<function_calls>`/`<invoke name=…>`, Mistral `[TOOL_CALLS]`, cả câu là `{"name":…,"arguments":…}`) và đọc chúng thành
 * tool call thật khi được. Nơi dùng: `TraLoiStreamer`/`phanHien` (không bao giờ phát khối đó ra client) và
 * `motLuotTraLoi` (vòng có tool ⇒ đọc thành tool call; vòng không có tool / không đọc được ⇒ chuyển cổng sau).
 */

import type { LLMToolCall } from '../interview/llm/index.js';

/** Thanh dọc của token DeepSeek: chữ thường `|` hoặc toàn khổ `｜` (U+FF5C). */
const BAR = '[|｜]';
/** Dấu cách của token DeepSeek V3: `▁` (U+2581) hoặc `_`. */
const SP = '[▁_]';

/** Mở đầu của MỘT khối gọi tool viết bằng chữ (không phân biệt hoa thường). */
const MO_DAU: RegExp[] = [
  new RegExp(`<\\s*\\/?\\s*${BAR}\\s*DSML\\s*${BAR}`, 'i'),
  new RegExp(`${BAR}\\s*DSML\\s*${BAR}`, 'i'),
  new RegExp(`<\\s*${BAR}\\s*tool${SP}calls?${SP}begin\\s*${BAR}\\s*>`, 'i'),
  new RegExp(`<\\s*${BAR}\\s*tool${SP}(?:call${SP})?sep\\s*${BAR}\\s*>`, 'i'),
  /<\s*tool_call\s*>/i,
  /<\s*\/?\s*(?:antml:)?function_calls\s*>/i,
  /<\s*(?:antml:)?invoke(?:\s+name\s*=|\s*>)/i,
  /\[TOOL_CALLS\]/,
  /<\s*\|\s*python_tag\s*\|\s*>/i,
];

/** Chuỗi mở đầu để GIỮ LẠI khi một mẩu luồng dừng giữa chừng (vd `<｜DS`, `<inv`, `[TOOL_`). */
export const TIEN_TO_MARKUP = ['<｜DSML｜', '<|DSML|', '｜DSML｜', '<｜tool▁calls▁begin｜>', '<|tool_calls_begin|>', '<tool_call>', '<function_calls>', '<invoke ', '[TOOL_CALLS]', '<|python_tag|>'];

/** Cả câu trả lời chỉ là một (mảng) object `{"name": "...", "arguments"|"parameters"|"input": …}`. */
function laJsonGoiTool(t: string): boolean {
  const s = t.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  if (!/^[[{]/.test(s)) return false;
  try {
    const v = JSON.parse(s) as unknown;
    const ds = Array.isArray(v) ? v : [v];
    return ds.length > 0 && ds.every((x) => {
      if (!x || typeof x !== 'object') return false;
      const o = x as Record<string, unknown>;
      const fn = (o.function && typeof o.function === 'object' ? o.function : o) as Record<string, unknown>;
      return typeof fn.name === 'string' && ['arguments', 'parameters', 'input', 'args'].some((k) => k in fn);
    });
  } catch {
    return false;
  }
}

/** Vị trí bắt đầu khối gọi-tool-bằng-chữ đầu tiên trong `text`, hoặc -1. `caCau` ⇒ xét cả dạng JSON trọn câu. */
export function viTriMarkupTool(text: string, caCau = true): number {
  if (!text) return -1;
  let p = -1;
  for (const re of MO_DAU) {
    const m = re.exec(text);
    if (m && (p < 0 || m.index < p)) p = m.index;
  }
  if (p < 0 && caCau && laJsonGoiTool(text)) p = text.search(/\S/);
  return p;
}

/** Có khối gọi-tool-bằng-chữ không. */
export const coMarkupTool = (text: string): boolean => viTriMarkupTool(text) >= 0;

/** Giá trị tham số dạng chữ ⇒ JSON nếu đọc được (object/mảng/số/bool), không thì chuỗi. */
function giaTri(raw: string, laChuoi: boolean | null): unknown {
  const t = raw.trim();
  if (laChuoi === true) return t;
  if (/^[[{"]|^-?\d|^(true|false|null)$/.test(t)) {
    try { return JSON.parse(t); } catch { /* chuỗi */ }
  }
  return t;
}

/** Object tham số từ JSON (chuỗi JSON lồng — "arguments":"{…}" — cũng mở ra). */
function thamSo(v: unknown): Record<string, unknown> {
  if (typeof v === 'string') { try { v = JSON.parse(v); } catch { return {}; } }
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

const tuJson = (o: Record<string, unknown>): LLMToolCall | null => {
  const fn = (o.function && typeof o.function === 'object' ? o.function : o) as Record<string, unknown>;
  const name = typeof fn.name === 'string' ? fn.name : null;
  if (!name) return null;
  return { name, input: thamSo(fn.arguments ?? fn.parameters ?? fn.input ?? fn.args ?? {}) };
};

/**
 * Đọc khối gọi-tool-bằng-chữ thành tool call. Đọc được gì trả nấy (bỏ lời gọi hỏng); không đọc được gì ⇒ [].
 * THUẦN — test đọc.
 */
export function docMarkupTool(text: string): LLMToolCall[] {
  const out: LLMToolCall[] = [];
  if (!text) return out;
  // 1. DSML / XML kiểu Anthropic: bỏ tiền tố `｜DSML｜` rồi đọc <invoke name=…><parameter name=… [string=…]>…</parameter>.
  const xml = text.replace(new RegExp(`${BAR}\\s*DSML\\s*${BAR}\\s*`, 'gi'), '').replace(/antml:/g, '');
  const reInvoke = /<\s*invoke\s+name\s*=\s*"([^"]+)"\s*>([\s\S]*?)(?:<\s*\/\s*invoke\s*>|$)/gi;
  for (let m = reInvoke.exec(xml); m; m = reInvoke.exec(xml)) {
    const input: Record<string, unknown> = {};
    const reP = /<\s*parameter\s+name\s*=\s*"([^"]+)"(?:\s+string\s*=\s*"(true|false)")?\s*>([\s\S]*?)<\s*\/\s*parameter\s*>/gi;
    for (let q = reP.exec(m[2]); q; q = reP.exec(m[2])) input[q[1]] = giaTri(q[3], q[2] === undefined ? null : q[2] === 'true');
    out.push({ name: m[1], input });
  }
  if (out.length) return out;

  // 2. Hermes/Qwen: <tool_call>{"name":…,"arguments":…}</tool_call>
  const reHermes = /<\s*tool_call\s*>([\s\S]*?)(?:<\s*\/\s*tool_call\s*>|$)/gi;
  for (let m = reHermes.exec(text); m; m = reHermes.exec(text)) {
    try { const c = tuJson(JSON.parse(m[1].trim())); if (c) out.push(c); } catch { /* bỏ */ }
  }
  if (out.length) return out;

  // 3. DeepSeek V3: <｜tool▁call▁begin｜>function<｜tool▁sep｜>NAME\n```json\n{…}\n```<｜tool▁call▁end｜>
  const reDs = new RegExp(`<\\s*${BAR}\\s*tool${SP}sep\\s*${BAR}\\s*>\\s*([\\w.-]+)\\s*(?:\`\`\`(?:json)?)?\\s*(\\{[\\s\\S]*?\\})\\s*(?:\`\`\`)?\\s*<\\s*${BAR}\\s*tool${SP}call${SP}end`, 'gi');
  for (let m = reDs.exec(text); m; m = reDs.exec(text)) out.push({ name: m[1], input: thamSo(m[2]) });
  if (out.length) return out;

  // 4. Mistral: [TOOL_CALLS] [{"name":…,"arguments":…}]   ·   5. cả câu là JSON gọi tool.
  const sauMistral = /\[TOOL_CALLS\]\s*([\s\S]*)$/.exec(text)?.[1];
  const json = (sauMistral ?? text).trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  if (sauMistral !== undefined || laJsonGoiTool(text)) {
    try {
      const v = JSON.parse(json) as unknown;
      for (const x of Array.isArray(v) ? v : [v]) {
        const c = x && typeof x === 'object' ? tuJson(x as Record<string, unknown>) : null;
        if (c) out.push(c);
      }
    } catch { /* bỏ */ }
  }
  return out;
}

// ─── Đếm (admin xem rambo hay làm vậy tới mức nào) ───────────────

const DEM = new Map<string, { lan: number; cuoi: string }>();

/** Ghi một lần model trả markup gọi tool dạng chữ. Trả số lần (của cổng+model này) từ khi tiến trình chạy. */
export function ghiMarkupTool(cong: string | null | undefined, model: string | null | undefined): number {
  const k = `${cong ?? '?'}:${model ?? '?'}`;
  const v = DEM.get(k) ?? { lan: 0, cuoi: '' };
  v.lan++;
  v.cuoi = new Date().toISOString();
  DEM.set(k, v);
  return v.lan;
}

/** Bảng đếm cho trang admin (`GET /admin/cong-anthropic/ctwork-ai`). */
export function thongKeMarkupTool(): Array<{ cong: string; model: string; lan: number; cuoi: string }> {
  return [...DEM.entries()].map(([k, v]) => {
    const i = k.indexOf(':');
    return { cong: k.slice(0, i), model: k.slice(i + 1), lan: v.lan, cuoi: v.cuoi };
  }).sort((a, b) => b.lan - a.lan);
}

/** CHỈ cho test. */
export function _xoaDemMarkupTool(): void {
  DEM.clear();
}
