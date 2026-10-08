import type { z } from 'zod';
import type { McpCtx } from '../context.js';

/** Kết quả tool: chuỗi (markdown/chữ) hoặc object (trả dạng JSON). */
export type ToolOutput = string | Record<string, unknown> | unknown[];

export interface ToolDef {
  name: string;
  title: string;
  description: string;
  /** Tool ghi: cần scope 'write', agent PAUSED ⇒ 423, bị trần hoạt động. */
  write: boolean;
  /** Chỉ token agent (claim/heartbeat/release/report_usage/wait_events). Người không thấy trong tools/list. */
  agentOnly?: boolean;
  input: z.AnyZodObject;
  run: (ctx: McpCtx, args: Record<string, unknown>) => Promise<ToolOutput>;
}

export function defineTool<S extends z.AnyZodObject>(t: {
  name: string; title: string; description: string; write: boolean; agentOnly?: boolean; input: S;
  run: (ctx: McpCtx, args: z.infer<S>) => Promise<ToolOutput>;
}): ToolDef {
  return t as unknown as ToolDef;
}
