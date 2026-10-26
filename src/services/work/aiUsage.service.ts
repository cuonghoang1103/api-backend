/**
 * CT Work đợt 8B (19/10/2026) — SỔ AI TRONG CT WORK + trang "AI usage" (cấp không gian + tab cài đặt dự án).
 *
 * GHI (bảng `work_ai_calls`, một dòng mỗi lời gọi):
 *   - tool  — mỗi lệnh CT Work một AI chạy: MCP (`src/mcp/server.ts`: CuongMini ⇐ token tên "CuongMini · …", agent ⇐ token
 *             agent, còn lại "mcp" — Claude Code/Cursor…), Ask AI trên web (`runForPerson`, `applyAction`), agent dựng sẵn
 *             (`runForAgent`). Dự án = dự án mà `projectFor` đã mở trong lời gọi (AsyncLocalStorage — không đoán từ tham số).
 *   - llm   — mỗi lời gọi model của trợ lý AI CT Work trên web (`feature: 'work'`), qua người nghe `onLlmCallLogged` của
 *             sổ chung; dự án = `/projects/:pid` của request (middleware work.routes.ts gọi `enterProjectScope`).
 *
 * ĐỌC (`projectAiUsage` / `workspaceAiUsage`): ai đang dùng AI nối CT Work, lần gần nhất, số lượt, token, chi phí theo
 * NGUỒN (chính hãng $ · modelapi $ · rambo đếm lượt, gói trọn · agent tự khai $), model (TÊN CUONGMINI — tên thật không
 * bao giờ ra khỏi đây), và nhật ký thao tác GHI của AI. Lọc theo thành viên / khoảng ngày (/dự án ở cấp không gian).
 *
 * Chi phí CuongMini: sổ lượt (`interview_llm_call_logs`, feature 'agent') chỉ có NGƯỜI, không có dự án ⇒ phân bổ theo
 * LƯỢT — một lượt CuongMini tính cho dự án khi trong lượt đó (giữa lượt trước và lượt này của cùng người, tối đa 60 phút)
 * có lời gọi tool CT Work của dự án; nhiều dự án ⇒ chia theo số lời gọi. Lượt dùng hạn mức NHÓM (`step = nhom:p<pid>:…`)
 * là của đúng dự án đó (chính xác). Vì vậy số tiền CuongMini là ƯỚC LƯỢNG và trang ghi rõ nhãn đó.
 *
 * Quyền xem: ADMIN dự án / OWNER-ADMIN không gian xem tất; thành viên chỉ xem phần của mình (agent mình sở hữu đi kèm);
 * khách cổng (CLIENT) và agent ⇒ 403; người ngoài ⇒ 404.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { onLlmCallLogged, type LlmCallLogged } from '../interview/llm/index.js';
import { bangClassic, bangModel, TEN_CONG } from '../agent/bangModel.js';
import { MODEL_AGENT_RIENG } from '../agent/models.js';
import { PUBLIC_USER, type PublicUser } from './common.js';
import { agentForbidden, effectiveProjectRole, loadProjectAccess, loadWorkspaceAccess } from './permissions.js';
import type { ProjectRole, ProjectVisibility } from './constants.js';
import { vnDay } from './sprints.service.js';

export const AI_CLIENTS = ['cuongmini', 'mcp', 'agent', 'web', 'builtin'] as const;
export type AiClient = (typeof AI_CLIENTS)[number];

// ─── Phạm vi lời gọi (AsyncLocalStorage) ─────────────────────────

interface Hit { id: number; key: string; workspaceId: number }
interface Scope { client?: AiClient; projectId?: number; hits: Hit[] }
const als = new AsyncLocalStorage<Scope>();

/** Middleware `/projects/:pid`: mọi lời gọi model trong request này thuộc dự án `projectId`. */
export function enterProjectScope(projectId: number): void {
  als.enterWith({ projectId, hits: [] });
}

/** `projectFor` (MCP) báo dự án vừa mở — lời gọi tool được ghi vào dự án đầu tiên nó chạm tới. */
export function noteProjectHit(h: Hit): void {
  const s = als.getStore();
  if (s && !s.hits.some((x) => x.id === h.id)) s.hits.push({ id: h.id, key: h.key, workspaceId: h.workspaceId });
}

/**
 * 22/10/2026: lời gọi hiện tại có đến từ AI không (MCP / CuongMini / Ask AI / agent dựng sẵn) — `runInAiScope` đặt `client`.
 * Lệnh xoá đi qua AI ⇒ thành YÊU CẦU chờ trưởng nhóm duyệt (deleteRequests.service.ts), không bao giờ xoá ngay.
 */
export function currentAiClient(): AiClient | undefined {
  return als.getStore()?.client;
}

/** Chạy `fn` trong một phạm vi mới; trả kèm danh sách dự án lời gọi đã mở (kể cả khi lỗi). */
export async function runInAiScope<T>(client: AiClient, fn: () => Promise<T>): Promise<{ hits: Hit[]; result?: T; error?: unknown }> {
  const parent = als.getStore();
  const scope: Scope = { client, projectId: parent?.projectId, hits: [] };
  try {
    const result = await als.run(scope, fn);
    return { hits: scope.hits, result };
  } catch (error) {
    return { hits: scope.hits, error };
  }
}

// ─── Ghi ─────────────────────────────────────────────────────────

const tokenClient = new Map<number, AiClient>();
/** Client của một lời gọi MCP: agent ⇐ token agent; "cuongmini" ⇐ token CuongMini tự cấp (tên "CuongMini · máy"); còn lại mcp. */
export async function clientOfToken(c: { agent: unknown; tokenId: number }): Promise<AiClient> {
  if (c.agent) return 'agent';
  if (!c.tokenId) return 'web';
  const hit = tokenClient.get(c.tokenId);
  if (hit) return hit;
  const t = await prisma.workApiToken.findUnique({ where: { id: c.tokenId }, select: { name: true } }).catch(() => null);
  const v: AiClient = /^cuongmini\b/i.test((t?.name ?? '').trim()) ? 'cuongmini' : 'mcp';
  if (tokenClient.size > 2000) tokenClient.clear();
  tokenClient.set(c.tokenId, v);
  return v;
}

const projectWs = new Map<number, { workspaceId: number; key: string } | null>();
async function projectInfo(projectId: number): Promise<{ workspaceId: number; key: string } | null> {
  if (projectWs.has(projectId)) return projectWs.get(projectId) ?? null;
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true, key: true } }).catch(() => null);
  if (projectWs.size > 5000) projectWs.clear();
  projectWs.set(projectId, p);
  return p;
}

/** Đối tượng của lời gọi, đọc từ tham số: thẻ "FP-12", "page:3", "meeting:2"… (null nếu không có). */
export function targetOf(args: Record<string, unknown> | null | undefined, projectKey: string): string | null {
  if (!args) return null;
  const issue = args.issue;
  if (typeof issue === 'number' && Number.isInteger(issue) && issue > 0) return `${projectKey}-${issue}`;
  if (typeof issue === 'string') {
    const s = issue.trim().toUpperCase();
    if (/^\d{1,9}$/.test(s)) return `${projectKey}-${Number(s)}`;
    if (/^[A-Z][A-Z0-9_]*-\d{1,9}$/.test(s)) return s.slice(0, 40);
  }
  for (const k of ['page', 'meeting', 'form', 'retro', 'session', 'run', 'item', 'number', 'approval'] as const) {
    const v = args[k];
    if ((typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.trim() && v.length <= 30)) return `${k}:${String(v).trim()}`.slice(0, 40);
  }
  return null;
}

const errCode = (e: unknown): string | null => {
  if (!e) return null;
  const x = e as { code?: unknown; statusCode?: unknown };
  return String(typeof x.code === 'string' ? x.code : typeof x.statusCode === 'number' ? `HTTP_${x.statusCode}` : 'ERROR').slice(0, 40);
};

/** Một lời gọi tool CT Work của AI. Không bao giờ ném (sổ hỏng không làm hỏng việc). */
export async function recordToolCall(d: {
  client: AiClient; userId: number; tool: string; write: boolean; projectId?: number | null; hits?: Hit[];
  args?: Record<string, unknown> | null; error?: unknown; durationMs: number;
}): Promise<void> {
  try {
    const first = d.hits?.[0];
    const projectId = d.projectId ?? first?.id ?? null;
    if (!projectId || !d.userId) return;
    const info = first && first.id === projectId ? { workspaceId: first.workspaceId, key: first.key } : await projectInfo(projectId);
    if (!info) return;
    await prisma.workAiCall.create({
      data: {
        workspaceId: info.workspaceId, projectId, userId: d.userId, client: d.client, kind: 'tool', tool: d.tool.slice(0, 64),
        write: d.write, target: targetOf(d.args, info.key), ok: !d.error, errorCode: errCode(d.error),
        durationMs: Math.max(0, Math.min(2_000_000_000, Math.round(d.durationMs))),
      },
    });
  } catch (err) {
    logger.warn('[work] ai-usage: không ghi được sổ tool', { err: (err as Error).message });
  }
}

/** Một lời gọi model của trợ lý AI CT Work trên web (người nghe sổ chung). Bỏ qua khi không ở trong dự án nào. */
export async function recordLlmCall(d: LlmCallLogged, scope: { projectId?: number; client?: AiClient; hits?: Hit[] } | undefined): Promise<void> {
  try {
    if (d.feature !== 'work' || !d.userId || !scope) return;
    // Agent dựng sẵn tự ghi chi phí vào work_agent_usage (source GATEWAY) — không ghi trùng ở đây.
    if (d.purpose === 'work_agent') return;
    const projectId = scope.projectId ?? scope.hits?.[0]?.id;
    if (!projectId) return;
    const info = await projectInfo(projectId);
    if (!info) return;
    await prisma.workAiCall.create({
      data: {
        workspaceId: info.workspaceId, projectId, userId: d.userId, client: scope.client && scope.client !== 'web' ? scope.client : 'web', kind: 'llm',
        tool: (d.purpose ?? 'work').slice(0, 64), write: false, ok: d.success, model: d.model.slice(0, 80),
        inputTokens: Math.max(0, d.inputTokens | 0), outputTokens: Math.max(0, d.outputTokens | 0), costUsd: new Prisma.Decimal((d.costUsd || 0).toFixed(6)),
      },
    });
  } catch (err) {
    logger.warn('[work] ai-usage: không ghi được sổ model', { err: (err as Error).message });
  }
}

onLlmCallLogged((d) => {
  const s = als.getStore();
  if (!s) return;
  void recordLlmCall(d, { projectId: s.projectId, client: s.client, hits: [...s.hits] });
});

// ─── Model: tên CuongMini + nguồn tiền ───────────────────────────

export type AiSource = 'chinh_hang' | 'modelapi' | 'rambo' | 'agent';

/**
 * Tên thật ⇒ (nguồn, tên CuongMini). rambo: model của nhóm Classic/bảng rambo cũ VỚI chi phí 0 (gói trả trọn — cùng luật
 * `KHONG_TINH_RAMBO` của quota.ts). Model lạ ⇒ tên cổng chung "CuongMini Core" — không bao giờ lộ tên thật.
 */
/** Tên hiển thị của model bảng 18/10 (đã bỏ 27/10) — chỉ cho báo cáo sổ cũ. */
const TEN_MODEL_CU: Record<string, string> = {
  'gpt-6-sol': 'CuongMini Solid', 'gpt-6-luna': 'CuongMini Nova', 'gpt-5.6-sol': 'CuongMini Shin', 'gpt-5.6-luna': 'CuongMini Eco',
};
export function phanLoaiModel(model: string, costUsd: number): { source: Exclude<AiSource, 'agent'>; name: string } {
  const classic = bangClassic();
  const rambo = new Set<string>([...MODEL_AGENT_RIENG.map((m) => m.model), ...classic.map((m) => m.model), 'claude-sonnet-5-5']);
  if (!(costUsd > 0) && rambo.has(model)) {
    return { source: 'rambo', name: classic.find((m) => m.model === model)?.ten ?? TEN_CONG.rambo };
  }
  /* 27/10/2026: bảng còn 4 model — sổ CŨ vẫn có lượt Solid/Nova/Shin/Eco/Heshin ⇒ giữ tên cũ cho báo cáo lịch sử. */
  const cu = TEN_MODEL_CU[model];
  if (cu) return { source: /^claude-/i.test(model) ? 'chinh_hang' : 'modelapi', name: cu };
  const m = bangModel().find((x) => x.model === model);
  if (m) return { source: m.cong === 'anthropic' ? 'chinh_hang' : m.cong === 'rambo' ? 'rambo' : 'modelapi', name: m.ten };
  if (/^claude-/i.test(model) && costUsd > 0 && /-5-5|fable/i.test(model)) return { source: 'chinh_hang', name: TEN_CONG.anthropic };
  return { source: 'modelapi', name: TEN_CONG.modelapi };
}

// ─── Đọc: phân bổ lượt CuongMini cho dự án ───────────────────────

export interface CmTurn { id: number; userId: number; at: Date; model: string; inputTokens: number; outputTokens: number; costUsd: number; step: string }
export interface CmCall { userId: number; projectId: number; at: Date }

/** Lượt hạn mức nhóm: `nhom:p<pid>:u<chủ>` ⇒ pid. */
export const nhomProjectOf = (step: string): number | null => {
  const m = /^nhom:p(\d+):/.exec(step);
  return m ? Number(m[1]) : null;
};

const GROUP_GAP_MS = 3_000;
const LOOKBACK_MS = 60 * 60_000;
const AHEAD_MS = 5_000;

/**
 * Hàm THUẦN (test bằng bảng): mỗi lượt ⇒ phần của từng dự án trong `projects`. Lượt viết cùng lúc (< 3 s — một lượt tự
 * chuyển cổng ghi nhiều dòng) thành một nhóm; cửa sổ của nhóm = (nhóm trước của cùng người, cuối nhóm + 5 s], tối đa 60 phút.
 */
export function phanBoLuot(turns: CmTurn[], calls: CmCall[], projects: Set<number>): Array<{ turn: CmTurn; projectId: number; share: number }> {
  const out: Array<{ turn: CmTurn; projectId: number; share: number }> = [];
  const byUser = new Map<number, CmTurn[]>();
  for (const t of turns) {
    const nhom = nhomProjectOf(t.step);
    if (nhom !== null) { if (projects.has(nhom)) out.push({ turn: t, projectId: nhom, share: 1 }); continue; }
    const arr = byUser.get(t.userId) ?? [];
    arr.push(t);
    byUser.set(t.userId, arr);
  }
  const callsBy = new Map<number, CmCall[]>();
  for (const c of calls) {
    const arr = callsBy.get(c.userId) ?? [];
    arr.push(c);
    callsBy.set(c.userId, arr);
  }
  for (const [uid, list] of byUser) {
    list.sort((a, b) => a.at.getTime() - b.at.getTime() || a.id - b.id);
    const cs = (callsBy.get(uid) ?? []).slice().sort((a, b) => a.at.getTime() - b.at.getTime());
    /* QA 19/10/2026: cửa sổ mỗi nhóm tìm bằng NHỊ PHÂN trên mảng thời gian đã xếp — bản cũ quét MỌI lời gọi cho MỖI nhóm
       (O(lượt × lời gọi)): 50k lượt × 66k lời gọi của một người dùng nhiều ⇒ trang AI usage treo cả tiến trình Node 17–33 s. */
    const ts = cs.map((c) => c.at.getTime());
    const sau = (x: number): number => { let a = 0; let b = ts.length; while (a < b) { const m = (a + b) >> 1; if (ts[m]! <= x) a = m + 1; else b = m; } return a; };
    let prevEnd = -Infinity;
    for (let i = 0; i < list.length;) {
      let j = i + 1;
      while (j < list.length && list[j].at.getTime() - list[j - 1].at.getTime() < GROUP_GAP_MS) j++;
      const end = list[j - 1].at.getTime();
      const lo = Math.max(prevEnd, list[i].at.getTime() - LOOKBACK_MS);
      const hi = end + AHEAD_MS;
      const counts = new Map<number, number>();
      let total = 0;
      for (let k = sau(lo), het = sau(hi); k < het; k++) { const c = cs[k]!; counts.set(c.projectId, (counts.get(c.projectId) ?? 0) + 1); total++; }
      if (total) {
        for (const [pid, n] of counts) {
          if (!projects.has(pid)) continue;
          for (let k = i; k < j; k++) out.push({ turn: list[k], projectId: pid, share: n / total });
        }
      }
      prevEnd = end;
      i = j;
    }
  }
  return out;
}

// ─── Đọc: báo cáo ────────────────────────────────────────────────

export interface AiUsageFilter { from?: string; to?: string; userId?: number; projectId?: number }

const YMD = /^\d{4}-\d{2}-\d{2}$/;
function rangeOf(f: AiUsageFilter): { from: string; to: string; gte: Date; lt: Date } {
  const today = vnDay();
  const to = f.to && YMD.test(f.to) ? f.to : today;
  const from = f.from && YMD.test(f.from) ? f.from : vnDay(new Date(new Date(`${to}T00:00:00+07:00`).getTime() - 29 * 86_400_000));
  const gte = new Date(`${from}T00:00:00+07:00`);
  const lt = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + 86_400_000);
  if (Number.isNaN(gte.getTime()) || Number.isNaN(lt.getTime()) || gte >= lt) throw new BadRequestError('from must be on or before to', 'VALIDATION_ERROR');
  if (lt.getTime() - gte.getTime() > 367 * 86_400_000) throw new BadRequestError('The range can be at most one year', 'VALIDATION_ERROR');
  return { from, to, gte, lt };
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

interface PersonRow {
  user: PublicUser | null;
  userId: number;
  clients: Set<AiClient>;
  lastUsedAt: Date | null;
  toolCalls: number;
  writes: number;
  failed: number;
  inputTokens: number;
  outputTokens: number;
  chinhHangUsd: number;
  modelapiUsd: number;
  ramboTurns: number;
  cuongMiniTurns: number;
  agentUsd: number;
  models: Set<string>;
}

interface ModelRow { name: string; source: AiSource; via: 'cuongmini' | 'web' | 'agent'; turns: number; inputTokens: number; outputTokens: number; costUsd: number }

async function buildReport(opts: {
  scope: 'project' | 'workspace'; workspaceId: number; projectIds: number[]; userIds: number[] | null; ownerId: number | null;
  canSeeAll: boolean; range: ReturnType<typeof rangeOf>;
}) {
  const { projectIds, userIds, range } = opts;
  const pset = new Set(projectIds);
  const createdAt = { gte: range.gte, lt: range.lt };
  const whereCalls: Prisma.WorkAiCallWhereInput = { projectId: { in: projectIds }, createdAt, ...(userIds ? { userId: { in: userIds } } : {}) };

  const [grouped, llmModels, writes] = await Promise.all([
    prisma.workAiCall.groupBy({
      by: ['userId', 'client', 'kind', 'write', 'ok'], where: whereCalls,
      _count: { _all: true }, _sum: { inputTokens: true, outputTokens: true, costUsd: true }, _max: { createdAt: true },
    }),
    prisma.workAiCall.groupBy({ by: ['userId', 'model'], where: { ...whereCalls, kind: 'llm' }, _count: { _all: true }, _sum: { inputTokens: true, outputTokens: true, costUsd: true } }),
    prisma.workAiCall.findMany({
      where: { ...whereCalls, kind: 'tool', write: true }, orderBy: { id: 'desc' }, take: 300,
      select: { id: true, userId: true, projectId: true, client: true, tool: true, target: true, ok: true, errorCode: true, createdAt: true },
    }),
  ]);

  const people = new Map<number, PersonRow>();
  const person = (uid: number): PersonRow => {
    let p = people.get(uid);
    if (!p) {
      p = { user: null, userId: uid, clients: new Set(), lastUsedAt: null, toolCalls: 0, writes: 0, failed: 0, inputTokens: 0, outputTokens: 0, chinhHangUsd: 0, modelapiUsd: 0, ramboTurns: 0, cuongMiniTurns: 0, agentUsd: 0, models: new Set() };
      people.set(uid, p);
    }
    return p;
  };
  const touch = (p: PersonRow, at: Date | null | undefined) => { if (at && (!p.lastUsedAt || at > p.lastUsedAt)) p.lastUsedAt = at; };
  const byClient: Record<AiClient, number> = { cuongmini: 0, mcp: 0, agent: 0, web: 0, builtin: 0 };

  for (const g of grouped) {
    const p = person(g.userId);
    const client = (AI_CLIENTS as readonly string[]).includes(g.client) ? (g.client as AiClient) : 'mcp';
    p.clients.add(client);
    touch(p, g._max.createdAt);
    const n = g._count._all;
    if (g.kind === 'tool') {
      p.toolCalls += n;
      byClient[client] += n;
      if (g.write) p.writes += n;
      if (!g.ok) p.failed += n;
    }
  }

  const models = new Map<string, ModelRow>();
  const addModel = (name: string, source: AiSource, via: ModelRow['via'], turns: number, inT: number, outT: number, usd: number) => {
    const k = `${via}|${source}|${name}`;
    const m = models.get(k) ?? { name, source, via, turns: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 };
    m.turns += turns; m.inputTokens += inT; m.outputTokens += outT; m.costUsd += usd;
    models.set(k, m);
  };
  const addCost = (p: PersonRow, source: AiSource, usd: number, turns: number) => {
    if (source === 'chinh_hang') p.chinhHangUsd += usd;
    else if (source === 'modelapi') p.modelapiUsd += usd;
    else if (source === 'rambo') p.ramboTurns += turns;
    else p.agentUsd += usd;
  };

  // Trợ lý AI web: chính xác (ghi theo dự án).
  for (const g of llmModels) {
    const p = person(g.userId);
    const usd = Number(g._sum.costUsd ?? 0);
    const { source, name } = phanLoaiModel(g.model ?? '', usd);
    const inT = g._sum.inputTokens ?? 0;
    const outT = g._sum.outputTokens ?? 0;
    p.inputTokens += inT; p.outputTokens += outT;
    addCost(p, source, usd, g._count._all);
    p.models.add(name);
    addModel(name, source, 'web', g._count._all, inT, outT, usd);
  }

  // CuongMini: phân bổ theo lượt (ước lượng) + lượt hạn mức nhóm (chính xác).
  const cmUsers = new Set<number>(grouped.filter((g) => g.client === 'cuongmini').map((g) => g.userId));
  const nhomWhere = projectIds.slice(0, 300).map((pid) => ({ step: { startsWith: `nhom:p${pid}:` } }));
  const nhomUsers = nhomWhere.length
    ? await prisma.interviewLLMCallLog.findMany({ where: { feature: 'agent', createdAt, OR: nhomWhere, ...(userIds ? { userId: { in: userIds } } : {}) }, distinct: ['userId'], select: { userId: true } })
    : [];
  for (const r of nhomUsers) if (r.userId) cmUsers.add(r.userId);
  let cmEstimated = false;
  if (cmUsers.size) {
    const ids = [...cmUsers];
    const wide = { gte: new Date(range.gte.getTime() - LOOKBACK_MS), lt: new Date(range.lt.getTime() + LOOKBACK_MS) };
    const [turnsRaw, callsRaw] = await Promise.all([
      prisma.interviewLLMCallLog.findMany({
        where: { feature: 'agent', userId: { in: ids }, createdAt }, orderBy: { id: 'asc' }, take: 50_000,
        select: { id: true, userId: true, model: true, inputTokens: true, outputTokens: true, costUsd: true, step: true, createdAt: true },
      }),
      prisma.workAiCall.findMany({ where: { client: 'cuongmini', kind: 'tool', userId: { in: ids }, createdAt: wide }, select: { userId: true, projectId: true, createdAt: true }, take: 200_000 }),
    ]);
    const turns: CmTurn[] = turnsRaw.map((t) => ({ id: t.id, userId: t.userId ?? 0, at: t.createdAt, model: t.model, inputTokens: t.inputTokens, outputTokens: t.outputTokens, costUsd: Number(t.costUsd), step: t.step }));
    const calls: CmCall[] = callsRaw.map((c) => ({ userId: c.userId, projectId: c.projectId, at: c.createdAt }));
    for (const a of phanBoLuot(turns, calls, pset)) {
      if (nhomProjectOf(a.turn.step) === null) cmEstimated = true;
      const p = person(a.turn.userId);
      p.clients.add('cuongmini');
      touch(p, a.turn.at);
      const usd = a.turn.costUsd * a.share;
      const { source, name } = phanLoaiModel(a.turn.model, a.turn.costUsd);
      const inT = Math.round(a.turn.inputTokens * a.share);
      const outT = Math.round(a.turn.outputTokens * a.share);
      p.inputTokens += inT; p.outputTokens += outT;
      p.cuongMiniTurns += a.share;
      addCost(p, source, usd, a.share);
      p.models.add(name);
      addModel(name, source, 'cuongmini', a.share, inT, outT, usd);
    }
  }

  // Agent: chi phí theo thẻ — REPORTED (tự khai) | GATEWAY (agent dựng sẵn, CT Work đo).
  const agentRows = await prisma.workAgentUsage.groupBy({
    by: ['agentId', 'source', 'model'],
    where: { projectId: { in: projectIds }, createdAt, ...(opts.canSeeAll ? {} : { agent: { ownerId: opts.ownerId ?? -1 } }) },
    _count: { _all: true }, _sum: { inputTokens: true, outputTokens: true, costUsd: true }, _max: { createdAt: true },
  });
  let agentSelfReported = false;
  if (agentRows.length) {
    const ags = await prisma.workAgent.findMany({ where: { id: { in: [...new Set(agentRows.map((r) => r.agentId))] } }, select: { id: true, userId: true } });
    const userOf = new Map(ags.map((a) => [a.id, a.userId]));
    for (const r of agentRows) {
      const uid = userOf.get(r.agentId);
      if (!uid) continue;
      const p = person(uid);
      p.clients.add(r.source === 'GATEWAY' ? 'builtin' : 'agent');
      touch(p, r._max.createdAt);
      const usd = Number(r._sum.costUsd ?? 0);
      const inT = r._sum.inputTokens ?? 0;
      const outT = r._sum.outputTokens ?? 0;
      p.inputTokens += inT; p.outputTokens += outT;
      if (r.source === 'GATEWAY') {
        const { source, name } = phanLoaiModel(r.model, usd);
        addCost(p, source, usd, r._count._all);
        p.models.add(name);
        addModel(name, source, 'agent', r._count._all, inT, outT, usd);
      } else {
        agentSelfReported = true;
        p.agentUsd += usd;
        // Model agent ngoài TỰ KHAI (Claude Code, Cursor…) — không phải model của CuongThai; vẫn chỉ hiện tên ngắn gọn.
        const name = r.model.slice(0, 40);
        p.models.add(name);
        addModel(name, 'agent', 'agent', r._count._all, inT, outT, usd);
      }
    }
  }

  // Người: tên công khai.
  const users = await prisma.user.findMany({ where: { id: { in: [...people.keys(), ...writes.map((w) => w.userId)] } }, select: PUBLIC_USER });
  const userById = new Map(users.map((u) => [u.id, u as PublicUser]));
  const projects = await prisma.workProject.findMany({ where: { id: { in: [...new Set(writes.map((w) => w.projectId))] } }, select: { id: true, key: true, name: true } });
  const projectById = new Map(projects.map((p) => [p.id, p]));

  const peopleOut = [...people.values()].map((p) => ({
    user: userById.get(p.userId) ?? null,
    userId: p.userId,
    clients: [...p.clients].sort(),
    lastUsedAt: p.lastUsedAt,
    toolCalls: p.toolCalls, writes: p.writes, failed: p.failed,
    inputTokens: p.inputTokens, outputTokens: p.outputTokens,
    chinhHangUsd: r6(p.chinhHangUsd), modelapiUsd: r6(p.modelapiUsd), ramboTurns: Math.round(p.ramboTurns * 10) / 10,
    cuongMiniTurns: Math.round(p.cuongMiniTurns * 10) / 10, agentUsd: r6(p.agentUsd),
    models: [...p.models].sort(),
  })).sort((a, b) => (b.lastUsedAt?.getTime() ?? 0) - (a.lastUsedAt?.getTime() ?? 0));

  const sum = (k: 'toolCalls' | 'writes' | 'inputTokens' | 'outputTokens' | 'chinhHangUsd' | 'modelapiUsd' | 'ramboTurns' | 'agentUsd' | 'cuongMiniTurns') => peopleOut.reduce((s, p) => s + p[k], 0);
  return {
    scope: opts.scope,
    canSeeAll: opts.canSeeAll,
    range: { from: range.from, to: range.to },
    totals: {
      people: peopleOut.length,
      toolCalls: sum('toolCalls'), writes: sum('writes'), inputTokens: sum('inputTokens'), outputTokens: sum('outputTokens'),
      chinhHangUsd: r6(sum('chinhHangUsd')), modelapiUsd: r6(sum('modelapiUsd')), ramboTurns: Math.round(sum('ramboTurns') * 10) / 10,
      agentUsd: r6(sum('agentUsd')), cuongMiniTurns: Math.round(sum('cuongMiniTurns') * 10) / 10,
      byClient,
    },
    people: peopleOut,
    models: [...models.values()].map((m) => ({ ...m, turns: Math.round(m.turns * 10) / 10, costUsd: r6(m.costUsd) })).sort((a, b) => b.costUsd - a.costUsd || b.turns - a.turns),
    writes: writes.map((w) => ({
      id: w.id, at: w.createdAt, user: userById.get(w.userId) ?? null, client: w.client, tool: w.tool, target: w.target, ok: w.ok, errorCode: w.errorCode,
      project: projectById.get(w.projectId) ? { key: projectById.get(w.projectId)!.key, name: projectById.get(w.projectId)!.name } : null,
    })),
    notes: { cuongMiniEstimated: cmEstimated, agentSelfReported },
  };
}

/** Tab "AI usage" của dự án. */
export async function projectAiUsage(viewerId: number, projectId: number, f: AiUsageFilter) {
  const access = await loadProjectAccess(viewerId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (access.principal === 'AGENT') throw await agentForbidden(viewerId, 'read AI usage');
  if (access.role === 'CLIENT') throw new ForbiddenError('AI usage is not available in the client portal');
  const canSeeAll = access.role === 'ADMIN' || access.workspaceRole === 'OWNER' || access.workspaceRole === 'ADMIN';
  if (!canSeeAll && f.userId && f.userId !== viewerId) throw new ForbiddenError('You can only see your own AI usage');
  const userIds = canSeeAll ? (f.userId ? [f.userId] : null) : [viewerId];
  const range = rangeOf(f);
  const r = await buildReport({ scope: 'project', workspaceId: access.workspaceId, projectIds: [projectId], userIds, ownerId: viewerId, canSeeAll, range });
  const members = canSeeAll
    ? (await prisma.workProjectMember.findMany({ where: { projectId }, select: { user: { select: PUBLIC_USER } }, take: 500 })).map((m) => m.user as PublicUser)
    : [];
  return { ...r, members };
}

/** Trang "AI usage" cấp không gian. */
export async function workspaceAiUsage(viewerId: number, workspaceId: number, f: AiUsageFilter) {
  const wa = await loadWorkspaceAccess(viewerId, workspaceId);
  if (!wa) throw new NotFoundError('Workspace not found');
  if (wa.principal === 'AGENT') throw await agentForbidden(viewerId, 'read AI usage');
  if (wa.role === 'GUEST') throw new ForbiddenError('AI usage is not available to guests');
  const canSeeAll = wa.role === 'OWNER' || wa.role === 'ADMIN';
  if (!canSeeAll && f.userId && f.userId !== viewerId) throw new ForbiddenError('You can only see your own AI usage');
  /* QA 19/10/2026: thành viên thường chỉ thấy dự án mình THẤY ĐƯỢC (như `listProjects`) — trước đây trả MỌI dự án của
     không gian, kể cả dự án PRIVATE họ không ở trong (lộ mã + tên dự án). */
  const all = (await prisma.workProject.findMany({
    where: { workspaceId, deletedAt: null }, orderBy: { key: 'asc' }, take: 500,
    select: { id: true, key: true, name: true, visibility: true, members: { where: { userId: viewerId }, select: { role: true } } },
  }))
    .filter((p) => canSeeAll || effectiveProjectRole({ workspaceRole: wa.role, projectRole: (p.members[0]?.role ?? null) as ProjectRole | null, visibility: p.visibility as ProjectVisibility }))
    .map((p) => ({ id: p.id, key: p.key, name: p.name }));
  if (f.projectId && !all.some((p) => p.id === f.projectId)) throw new AppError('Project not found in this workspace', 404, 'NOT_FOUND');
  const projectIds = f.projectId ? [f.projectId] : all.map((p) => p.id);
  const userIds = canSeeAll ? (f.userId ? [f.userId] : null) : [viewerId];
  const range = rangeOf(f);
  const r = await buildReport({ scope: 'workspace', workspaceId, projectIds: projectIds.length ? projectIds : [-1], userIds, ownerId: viewerId, canSeeAll, range });
  const members = canSeeAll
    ? (await prisma.workMember.findMany({ where: { workspaceId }, select: { user: { select: PUBLIC_USER } }, take: 1000 })).map((m) => m.user as PublicUser)
    : [];
  return { ...r, projects: all, members };
}
