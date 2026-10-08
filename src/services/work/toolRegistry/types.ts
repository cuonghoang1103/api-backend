/**
 * CT Work — REGISTRY LỆNH DÙNG CHUNG (đợt 3C, 09/10/2026): kiểu của một lệnh.
 *
 * Mỗi lệnh khai MỘT lần (tên, mô tả, schema zod, đọc/ghi, hàm chạy) và ba đường cùng dùng:
 *   - `mcp`     — AI bên ngoài (Claude Code, Cursor, Gemini CLI, Codex CLI…) qua /api/v1/work/mcp, quyền của token;
 *   - `ask`     — "Ask AI" trên web: lệnh ĐỌC chạy ngay (quyền người hỏi), lệnh GHI chỉ thành ĐỀ XUẤT, người bấm Apply
 *                 thì mới chạy — vẫn qua đúng hàm này, dưới quyền người bấm;
 *   - `builtin` — agent dựng sẵn (runtime BUILTIN) chạy trên máy chủ, quyền + rào chắn của agent như agent ngoài.
 *
 * Quyền KHÔNG nằm ở đây mà ở hàm `run`: mọi lệnh gọi `projectFor` (chốt tầng tuyến REST tương đương: phạm vi token,
 * AGENT_DENIED_ROUTES, cổng khách) rồi gọi THẲNG service (requireProject, luật agent trong cửa ghi chung). Registry
 * chỉ quyết định LỆNH NÀO HIỆN ở đường nào — không mở thêm quyền nào.
 */

import type { z } from 'zod';
import type { McpCtx } from '../../../mcp/context.js';

export type CmdCtx = McpCtx;

/** Kết quả lệnh: chuỗi (markdown/chữ) hoặc object (trả dạng JSON). */
export type ToolOutput = string | Record<string, unknown> | unknown[];

export interface CommandSurfaces {
  /** Hiện trong tools/list của MCP. Mặc định true. */
  mcp?: boolean;
  /** Ask AI trên web dùng được (đọc ngay / ghi thành đề xuất). Mặc định true. */
  ask?: boolean;
  /** Agent dựng sẵn (BUILTIN) dùng được trong vòng lặp. Mặc định true. */
  builtin?: boolean;
}

export interface ToolDef {
  name: string;
  title: string;
  description: string;
  /** Lệnh ghi: cần scope 'write', agent PAUSED ⇒ 423, Ask AI chỉ ĐỀ XUẤT. */
  write: boolean;
  /** Chỉ token agent (claim/heartbeat/release/report_usage/wait_events). Người không thấy trong tools/list. */
  agentOnly?: boolean;
  surfaces?: CommandSurfaces;
  /** Nhóm để xếp mục lục: issues | docs | tests | export | planning | agent. */
  group?: string;
  input: z.AnyZodObject;
  run: (ctx: CmdCtx, args: Record<string, unknown>) => Promise<ToolOutput>;
}

export function defineTool<S extends z.AnyZodObject>(t: {
  name: string; title: string; description: string; write: boolean; agentOnly?: boolean; surfaces?: CommandSurfaces; group?: string; input: S;
  run: (ctx: CmdCtx, args: z.infer<S>) => Promise<ToolOutput>;
}): ToolDef {
  return t as unknown as ToolDef;
}

export const onSurface = (t: ToolDef, s: keyof CommandSurfaces): boolean => t.surfaces?.[s] !== false;
