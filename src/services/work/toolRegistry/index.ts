/**
 * CT Work — REGISTRY LỆNH DÙNG CHUNG (đợt 3C, 09/10/2026). Một danh sách, ba đường:
 *
 *   MCP (AI bên ngoài)   src/mcp/server.ts lấy `mcpCommands()` làm tools/list — 21 tool cũ GIỮ NGUYÊN tên + hành vi
 *                        (vẫn khai ở src/mcp/tools/read.ts|write.ts), cộng các lệnh mới ở thư mục này.
 *   Ask AI (web)         ai.service: lệnh ĐỌC chạy ngay qua `runForPerson(…, 'read')` bằng quyền người hỏi; lệnh GHI chỉ
 *                        thành đề xuất `{type:"command"}`, người bấm Apply ⇒ `runForPerson(…, 'apply')` bằng quyền NGƯỜI BẤM.
 *                        comment / update_issue / create_issue không hiện ở Ask AI vì Ask AI đã có hành động tương đương
 *                        có thẻ xem trước riêng (add_comment / update_issue / create_issue) — cùng service bên dưới.
 *   Agent BUILTIN        builtinAgent.service chạy vòng lặp bằng `builtinCommands()` với ctx của agent (rào chắn như MCP).
 *
 * Không lệnh nào tự mở quyền: `run` của từng lệnh tự chạy `projectFor` (chốt tầng tuyến) + service (requireProject).
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import type { McpCtx } from '../../../mcp/context.js';
import { READ_TOOLS } from '../../../mcp/tools/read.js';
import { WRITE_TOOLS } from '../../../mcp/tools/write.js';
import { PLANNING_COMMANDS } from './planning.js';
import { TEST_COMMANDS } from './tests.js';
import { onSurface, type ToolDef, type ToolOutput } from './types.js';

export { onSurface, type ToolDef, type ToolOutput } from './types.js';

/** Thứ tự = thứ tự trong tools/list: 21 tool cũ trước (client cũ thấy y hệt), lệnh mới sau. */
export const COMMANDS: ToolDef[] = [...READ_TOOLS, ...WRITE_TOOLS, ...TEST_COMMANDS, ...PLANNING_COMMANDS];

const BY_NAME = new Map(COMMANDS.map((t) => [t.name, t]));
if (BY_NAME.size !== COMMANDS.length) throw new Error('toolRegistry: trùng tên lệnh');

/** 21 tool của đợt 2 — test giữ chỗ này để không ai vô tình đổi tên/bỏ tool cũ. */
export const LEGACY_MCP_TOOLS = [...READ_TOOLS, ...WRITE_TOOLS].map((t) => t.name);

export function commandByName(name: string): ToolDef | undefined {
  return BY_NAME.get(name);
}

export const mcpCommands = (): ToolDef[] => COMMANDS.filter((t) => onSurface(t, 'mcp'));
export const askCommands = (): ToolDef[] => COMMANDS.filter((t) => onSurface(t, 'ask') && !t.agentOnly && 'project' in t.input.shape);
export const builtinCommands = (): ToolDef[] => COMMANDS.filter((t) => onSurface(t, 'builtin') && 'project' in t.input.shape);

// ─── Mục lục lệnh cho prompt (Ask AI + agent BUILTIN) ─────────────

function typeOf(t: z.ZodTypeAny, depth = 0): string {
  if (t instanceof z.ZodOptional) return typeOf(t.unwrap(), depth);
  if (t instanceof z.ZodNullable) return `${typeOf(t.unwrap(), depth)}|null`;
  if (t instanceof z.ZodDefault) return typeOf(t._def.innerType, depth);
  if (t instanceof z.ZodEffects) return typeOf(t.innerType(), depth);
  if (t instanceof z.ZodString) return 'string';
  if (t instanceof z.ZodNumber) return t.isInt ? 'int' : 'number';
  if (t instanceof z.ZodBoolean) return 'boolean';
  if (t instanceof z.ZodEnum) return (t.options as string[]).map((o) => JSON.stringify(o)).join('|');
  if (t instanceof z.ZodLiteral) return JSON.stringify(t.value);
  if (t instanceof z.ZodArray) return `${depth > 2 ? 'object' : typeOf(t.element, depth + 1)}[]`;
  if (t instanceof z.ZodUnion) return (t.options as z.ZodTypeAny[]).map((o) => typeOf(o, depth + 1)).join('|');
  if (t instanceof z.ZodTuple) return `[${(t.items as z.ZodTypeAny[]).map((o) => typeOf(o, depth + 1)).join(',')}]`;
  if (t instanceof z.ZodRecord) return 'object';
  if (t instanceof z.ZodObject) {
    if (depth > 2) return 'object';
    return `{${Object.entries(t.shape as Record<string, z.ZodTypeAny>).map(([k, v]) => `${k}${v.isOptional() ? '?' : ''}:${typeOf(v, depth + 1)}`).join(',')}}`;
  }
  return 'any';
}

/** `name(a:int, b?:string)` — bỏ `project` (Ask AI/BUILTIN luôn ở MỘT dự án, mã tự điền). */
export function signatureOf(t: ToolDef, omit: string[] = ['project']): string {
  const shape = t.input.shape as Record<string, z.ZodTypeAny>;
  const args = Object.entries(shape).filter(([k]) => !omit.includes(k)).map(([k, v]) => `${k}${v.isOptional() ? '?' : ''}:${typeOf(v)}`);
  return `${t.name}(${args.join(', ')})`;
}

/** Mục lục gọn: một dòng mỗi lệnh — chữ ký + mô tả ngắn (câu đầu). */
export function commandCatalog(list: ToolDef[]): string {
  return list.map((t) => `- ${signatureOf(t)} — ${t.description.split(/(?<=\.)\s/)[0].slice(0, 220)}${t.write ? ' [WRITE]' : ''}`).join('\n');
}

// ─── Chạy một lệnh ───────────────────────────────────────────────

/** Ngữ cảnh "người dùng web" (Ask AI): không token, quyền của chính người đó. */
export function personCtx(userId: number, signal?: AbortSignal): McpCtx {
  return { userId, agent: null, scopes: ['read', 'write'], tokenId: 0, signal: signal ?? new AbortController().signal };
}

/** "slug/KEY" — tham chiếu dự án duy nhất dù người dùng ở nhiều không gian trùng mã. */
export async function projectRefOf(projectId: number): Promise<string> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  if (!p) throw new NotFoundError('Project not found');
  return `${p.workspace.slug}/${p.key}`;
}

const outText = (out: ToolOutput) => (typeof out === 'string' ? out : JSON.stringify(out, null, 2));

/** Kiểm + chuẩn hoá tham số (ép `project` = dự án đang làm — model không được trỏ sang dự án khác). */
export function parseArgs(t: ToolDef, args: unknown, projectRef: string): Record<string, unknown> {
  const raw = (args && typeof args === 'object' && !Array.isArray(args) ? args : {}) as Record<string, unknown>;
  const r = t.input.safeParse({ ...raw, project: projectRef });
  if (!r.success) {
    const first = r.error.issues[0];
    throw new BadRequestError(`${t.name}: ${first?.path.join('.') || 'input'} — ${first?.message ?? 'invalid'}`, 'VALIDATION_ERROR');
  }
  return r.data as Record<string, unknown>;
}

/**
 * Ask AI: chạy lệnh dưới quyền NGƯỜI. `read` — chỉ lệnh đọc (model xin trong lúc trả lời); `apply` — chỉ lệnh ghi
 * (người vừa bấm Apply một đề xuất). Lệnh không có ở đường Ask ⇒ 400, không bao giờ "chạy thử" lệnh khác.
 */
export async function runForPerson(userId: number, projectId: number, name: string, args: unknown, mode: 'read' | 'apply'): Promise<{ text: string; output: ToolOutput }> {
  const t = commandByName(name);
  if (!t || !askCommands().includes(t)) throw new BadRequestError(`Unknown command "${name}"`, 'WORK_AI_BAD_COMMAND');
  if (mode === 'read' && t.write) throw new BadRequestError(`${name} changes data — propose it as an action instead`, 'WORK_AI_BAD_COMMAND');
  if (mode === 'apply' && !t.write) throw new BadRequestError(`${name} only reads data`, 'WORK_AI_BAD_COMMAND');
  const ref = await projectRefOf(projectId);
  const output = await t.run(personCtx(userId), parseArgs(t, args, ref));
  return { text: outText(output), output };
}

/** Agent BUILTIN: chạy lệnh bằng ctx của agent (rào chắn agent áp trong `run`). Lỗi ⇒ chuỗi lỗi cho model đọc, không ném. */
export async function runForAgent(ctx: McpCtx, projectRef: string, name: string, args: unknown, opts: { internal?: boolean } = {}): Promise<{ ok: boolean; text: string; write: boolean; output?: ToolOutput }> {
  const t = commandByName(name);
  // `internal` = runner tự gọi (request_review / ask_lead khi kết thúc) — vẫn qua `run` của lệnh, vẫn rào chắn agent.
  if (!t || (!opts.internal && !builtinCommands().includes(t))) return { ok: false, text: `Unknown command "${name}". Use one from the list.`, write: false };
  try {
    const out = await t.run(ctx, parseArgs(t, args, projectRef));
    return { ok: true, text: outText(out), write: t.write, output: out };
  } catch (err) {
    const e = err as { code?: string; message?: string; statusCode?: number; data?: unknown };
    if (!(err instanceof AppError) && typeof e.statusCode !== 'number') throw err; // lỗi máy chủ thật — để runner ghi FAILED
    return { ok: false, text: `ERROR ${e.code ?? e.statusCode ?? ''}: ${e.message ?? 'failed'}${e.data ? ` ${JSON.stringify(e.data).slice(0, 400)}` : ''}`, write: t.write };
  }
}
