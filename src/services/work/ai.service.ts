/**
 * CT Work — trợ lý AI.
 *
 * Luật (kế hoạch mục 6):
 *   1. AI KHÔNG tự ghi gì. Mọi thay đổi AI muốn làm trả về dạng ĐỀ XUẤT
 *      (`actions`); người dùng bấm Apply thì `applyAction` chạy thao tác qua
 *      đúng service thường ngày, dưới quyền CHÍNH người bấm ⇒ AI không thể
 *      vượt quyền người hỏi. Lịch sử ghi actorKind AI ⇒ không cộng công.
 *   2. Con số do MÃ tính (insights, tải việc, rủi ro sprint); model chỉ diễn
 *      đạt. Tìm thẻ trùng dùng pg_trgm, không tốn lượt AI.
 *   3. Hạn mức: Pro (hoặc admin) dùng theo trần token chung; tài khoản thường
 *      được WORK_AI_FREE_DAILY lượt/ngày, hết thì lỗi 402
 *      WORK_AI_QUOTA_EXCEEDED ⇒ giao diện hiện "Upgrade to Pro".
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { checkTokenQuota, extractJson, isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { isProEffective } from '../pro.service.js';
import { displayName } from './common.js';
import { PRIORITY_MAX, PRIORITY_MIN } from './constants.js';
import { addComment, createIssueAs, updateIssueAs } from './issues.service.js';
import { requireProject, type ProjectAccess } from './permissions.js';
import { activeSprintPace, type SprintPace } from './sprintPace.js';
import { projectMembers } from './projects.service.js';
import { bulkUpdate, computeSprintReport, estimateOf, estimationOf } from './sprints.service.js';
import { createTest } from './tests.service.js';
import * as threads from './aiThreads.service.js';

// ─── Hạn mức ─────────────────────────────────────────────────────

export const FREE_DAILY = () => Math.max(0, Number(process.env.WORK_AI_FREE_DAILY ?? 5) || 0);

async function usedToday(userId: number): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return prisma.interviewLLMCallLog.count({ where: { userId, feature: 'work', success: true, createdAt: { gte: start } } });
}

export async function aiQuota(userId: number) {
  const pro = await isProEffective(userId).catch(() => false);
  const used = await usedToday(userId);
  return { pro, used, limit: pro ? null : FREE_DAILY(), remaining: pro ? null : Math.max(0, FREE_DAILY() - used), available: isAiAvailable('work') };
}

async function assertQuota(userId: number) {
  if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
  const q = await aiQuota(userId);
  if (q.pro) {
    if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
    return;
  }
  if ((q.remaining ?? 0) <= 0) {
    throw new AppError(
      `You have used all ${q.limit} free AI requests for today. Upgrade to Pro to keep using the AI assistant.`,
      402, 'WORK_AI_QUOTA_EXCEEDED', { limit: q.limit, used: q.used, upgradeUrl: '/pro' },
    );
  }
}

async function ask(userId: number, system: string, user: string, maxTokens = 1800, purpose: 'work_assistant' | 'work_digest' = 'work_assistant'): Promise<string> {
  await assertQuota(userId);
  const r = await llmComplete({
    step: 'report', system, messages: [{ role: 'user', content: user }], maxTokens,
    userId, feature: 'work', purpose, timeoutMs: 90_000, maxRetries: 2,
  });
  return r.text;
}

function parseJson<T>(text: string, schema: z.ZodType<T>): T {
  try {
    return schema.parse(extractJson(text));
  } catch {
    throw new AppError('The AI returned an answer we could not read. Please try again.', 502, 'WORK_AI_BAD_OUTPUT');
  }
}

const LANG_RULE = 'Reply in the same language the user writes in (Vietnamese or English). Keep issue titles in that language too.';

// ─── Ngữ cảnh dự án cho model ────────────────────────────────────

const clip = (s: string | null | undefined, n: number) => (s ? (s.length > n ? `${s.slice(0, n)}…` : s) : '');

async function projectContext(access: ProjectAccess, focusText: string) {
  const [project, members, statuses, sprints, pace] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({
      where: { id: access.projectId },
      select: { key: true, name: true, description: true, type: true, template: true, issueTypes: { where: { archived: false }, select: { key: true, name: true, level: true } } },
    }),
    projectMembers(access.projectId),
    prisma.workStatus.findMany({ where: { workflow: { projectId: access.projectId } }, select: { id: true, name: true, category: true } }),
    prisma.workSprint.findMany({ where: { projectId: access.projectId, state: { not: 'CLOSED' } }, select: { id: true, name: true, state: true, goal: true, endAt: true } }),
    activeSprintPace(access.projectId),
  ]);
  const statusName = new Map(statuses.map((s) => [s.id, `${s.name}${s.category === 'DONE' ? ' (done)' : ''}`]));
  const memberName = new Map(members.map((m) => [m.id, m.username]));
  const words = focusText.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3).slice(0, 12);
  const active = sprints.find((s) => s.state === 'ACTIVE');
  const issues = await prisma.workIssue.findMany({
    where: {
      projectId: access.projectId, deletedAt: null,
      OR: [
        ...(words.length ? words.map((w) => ({ title: { contains: w, mode: 'insensitive' as const } })) : []),
        ...(active ? [{ sprintId: active.id }] : []),
        { type: { level: 1 } },
      ],
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: 60,
    select: {
      number: true, title: true, statusId: true, priority: true, assigneeId: true, storyPoints: true, dueDate: true, sprintId: true,
      type: { select: { key: true } }, parent: { select: { number: true } },
    },
  });
  const lines = issues.map((i) =>
    `${project.key}-${i.number} [${i.type.key}] "${clip(i.title, 120)}" status=${statusName.get(i.statusId)} priority=${i.priority}`
    + `${i.assigneeId ? ` assignee=@${memberName.get(i.assigneeId) ?? '?'}` : ''}${i.storyPoints !== null ? ` points=${i.storyPoints}` : ''}`
    + `${i.parent ? ` parent=${project.key}-${i.parent.number}` : ''}${i.dueDate ? ` due=${i.dueDate.toISOString().slice(0, 10)}` : ''}`
    + `${i.sprintId ? ` sprint=${sprints.find((s) => s.id === i.sprintId)?.name ?? 'closed'}` : ''}`);
  return {
    project,
    text: [
      `Project ${project.key} "${project.name}" (${project.type}, template ${project.template}). ${clip(project.description, 400)}`,
      `Issue types: ${project.issueTypes.map((t) => `${t.key} (${t.level === 1 ? 'epic' : t.level === -1 ? 'sub-task' : 'standard'})`).join(', ')}.`,
      `Statuses: ${[...new Set(statuses.map((s) => s.name))].join(', ')}.`,
      `Members who can be assigned: ${members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => `@${m.username} (${displayName(m)})`).join(', ') || 'none'}.`,
      `Open sprints: ${sprints.map((s) => `${s.name} [${s.state}]${s.goal ? ` goal: ${clip(s.goal, 120)}` : ''}${s.endAt ? ` ends ${s.endAt.toISOString().slice(0, 10)}` : ''}`).join('; ') || 'none'}.`,
      ...(pace ? [`Sprint pace (computed): ${pace.summary}`] : []),
      `Relevant issues (most recently updated first):`,
      ...lines,
    ].join('\n'),
  };
}

async function issueContext(projectId: number, key: string, number: number) {
  const i = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      id: true, number: true, title: true, descriptionText: true, priority: true, storyPoints: true,
      type: { select: { key: true, level: true } }, status: { select: { name: true } },
      children: { where: { deletedAt: null }, select: { number: true, title: true } },
      comments: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' }, take: 40, select: { bodyText: true, isAi: true, author: { select: { username: true } } } },
      testCase: { select: { preconditions: true, steps: { orderBy: { position: 'asc' }, select: { action: true, expected: true } } } },
    },
  });
  if (!i) throw new BadRequestError('Issue not found', 'WORK_NOT_FOUND');
  const text = [
    `${key}-${i.number} [${i.type.key}] "${i.title}" status=${i.status.name} priority=${i.priority}${i.storyPoints !== null ? ` points=${i.storyPoints}` : ''}`,
    `Description:\n${clip(i.descriptionText, 6000) || '(empty)'}`,
    i.children.length ? `Children: ${i.children.map((c) => `${key}-${c.number} ${c.title}`).join('; ')}` : '',
    i.testCase?.steps.length ? `Test steps:\n${i.testCase.steps.map((s, n) => `${n + 1}. ${s.action} → ${s.expected ?? ''}`).join('\n')}` : '',
    i.comments.length ? `Comments:\n${i.comments.map((c) => `- ${c.isAi ? 'AI' : `@${c.author?.username ?? '?'}`}: ${clip(c.bodyText, 600)}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n');
  return { issue: i, text };
}

// ─── Đề xuất thao tác ────────────────────────────────────────────

const stepSchema = z.object({ action: z.string().min(1).max(2000), data: z.string().max(2000).nullish(), expected: z.string().max(2000).nullish() });

export const actionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create_issue'),
    issueType: z.string().max(20),
    title: z.string().min(1).max(255),
    description: z.string().max(20000).nullish(),
    acceptanceCriteria: z.array(z.string().max(1000)).max(30).nullish(),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).nullish(),
    assignee: z.string().max(60).nullish(),
    storyPoints: z.number().min(0).max(1000).nullish(),
    parent: z.number().int().positive().nullish(),
    sprint: z.string().max(100).nullish(),
  }),
  z.object({
    type: z.literal('update_issue'),
    number: z.number().int().positive(),
    title: z.string().min(1).max(255).nullish(),
    description: z.string().max(20000).nullish(),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).nullish(),
    assignee: z.string().max(60).nullish(),
    storyPoints: z.number().min(0).max(1000).nullish(),
    status: z.string().max(60).nullish(),
    sprint: z.string().max(100).nullish(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  }),
  z.object({ type: z.literal('add_comment'), number: z.number().int().positive(), text: z.string().min(1).max(10000) }),
  z.object({ type: z.literal('move_to_sprint'), numbers: z.array(z.number().int().positive()).min(1).max(200), sprint: z.string().max(100) }),
  z.object({
    type: z.literal('create_test'),
    title: z.string().min(1).max(255),
    preconditions: z.string().max(5000).nullish(),
    steps: z.array(stepSchema).max(50),
    requirement: z.number().int().positive().nullish(),
  }),
]);
export type AiAction = z.infer<typeof actionSchema>;

/** Làm sạch danh sách hành động model trả: bỏ cái sai định dạng thay vì hỏng cả câu trả lời. */
function saneActions(raw: unknown): AiAction[] {
  if (!Array.isArray(raw)) return [];
  const out: AiAction[] = [];
  for (const a of raw.slice(0, 30)) {
    const r = actionSchema.safeParse(a);
    if (r.success) out.push(r.data);
  }
  return out;
}

const ACTIONS_DOC = `Actions you may PROPOSE (the user reviews and applies them; never claim you already did anything):
- {"type":"create_issue","issueType":"STORY|TASK|BUG|EPIC|SUBTASK|REQUIREMENT|TEST","title":"…","description":"plain text","acceptanceCriteria":["…"],"priority":1-5,"assignee":"username","storyPoints":3,"parent":<issue number of the epic, or of the story for a SUBTASK>,"sprint":"active|backlog|<sprint name>"}
- {"type":"update_issue","number":12,"title":"…","description":"…","priority":2,"assignee":"username|none","storyPoints":5,"status":"<status name>","sprint":"active|backlog|<sprint name>","dueDate":"YYYY-MM-DD"}
- {"type":"add_comment","number":12,"text":"…"}
- {"type":"move_to_sprint","numbers":[3,4],"sprint":"active|backlog|<sprint name>"}
- {"type":"create_test","title":"…","preconditions":"…","steps":[{"action":"…","data":"…","expected":"…"}],"requirement":<number of the story/requirement it verifies>}
Priority: 1=Highest 2=High 3=Medium 4=Low 5=Lowest. Use issue NUMBERS (12), not keys (ABC-12). Only use usernames from the member list.`;

// ─── Trợ lý hội thoại ────────────────────────────────────────────

export async function chat(
  userId: number,
  projectId: number,
  input: {
    message: string; history?: Array<{ role: 'user' | 'assistant'; content: string }>; issueNumber?: number | null;
    /** Hỏi tiếp hội thoại đã lưu (của mình hoặc của người khác trong nhóm); bỏ trống = hội thoại mới. */
    threadId?: number | null;
    /** Hỏi lại câu đã lưu nhưng chưa được trả lời (không tạo câu hỏi mới). */
    retryMessageId?: number | null;
  },
) {
  const access = await requireProject(userId, projectId, 'ai.use');
  // Lượt "hỏi lại": lấy lại đúng câu hỏi đã lưu, kiểm nó thuộc hội thoại người này xem được.
  let retry: Awaited<ReturnType<typeof threads.visibleMessage>> | null = null;
  if (input.retryMessageId) {
    retry = await threads.visibleMessage(userId, projectId, input.retryMessageId);
    if (retry.role !== 'user' || !retry.error) throw new BadRequestError('This question already has an answer', 'WORK_AI_NOTHING_TO_RETRY');
    input = { ...input, message: retry.content, threadId: retry.threadId, issueNumber: retry.issueNumber };
  }
  const thread = await threads.openThread(userId, access, { threadId: input.threadId, seed: input.message, issueNumber: input.issueNumber });
  const ctx = await projectContext(access, input.message);
  const focus = input.issueNumber ? await issueContext(projectId, access.key, input.issueNumber) : null;
  const me = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { username: true } });
  // Lịch sử lấy từ SERVER (đúng thứ cả nhóm thấy), không tin mảng client gửi lên.
  const history = await threads.historyText(thread.id, retry?.id);
  // Lưu câu hỏi TRƯỚC khi gọi AI: cổng hỏng hay người dùng đóng khung khi chờ thì câu hỏi vẫn còn.
  const userMsg = retry ? null : await threads.addMessage(thread.id, { role: 'user', authorId: userId, content: input.message, issueNumber: input.issueNumber ?? null });
  const questionId = retry?.id ?? userMsg!.id;
  if (retry) await threads.clearFailed(retry.id);
  const system = `You are the CT Work project assistant — a senior Scrum master, business analyst and QA lead in one.
You help a team manage their project (software school projects like SWP391/SWR302/SWT301, freelance and company work).
You can read the project context below. Be concrete, short and practical. Use Markdown in "reply" (short lists, bold key facts). ${LANG_RULE}
The user is @${me.username}. Today is ${new Date().toISOString().slice(0, 10)}.
${ACTIONS_DOC}
Only propose actions when the user asks for changes or clearly benefits from them; otherwise return an empty list.
Never invent issue numbers that are not in the context (except for issues you propose to create).
Return ONLY JSON: {"reply":"markdown","actions":[…]}`;
  const user = `${ctx.text}${focus ? `\n\nFocused issue:\n${focus.text}` : ''}${history ? `\n\nConversation so far (several team members may have asked):\n${history}` : ''}\n\nUser @${me.username}: ${input.message}`;
  let out: { reply: string; actions?: unknown };
  try {
    out = parseJson(await ask(userId, system, user, 2200), z.object({ reply: z.string(), actions: z.unknown().optional() }));
  } catch (err) {
    await threads.markFailed(questionId, err);
    throw err;
  }
  const actions = saneActions(out.actions);
  const answer = await threads.addMessage(thread.id, {
    role: 'assistant', content: out.reply, issueNumber: input.issueNumber ?? null,
    actions: actions.map((action) => ({ action, status: 'pending' as const })),
  });
  return { reply: out.reply, actions, quota: await aiQuota(userId), threadId: thread.id, question: userMsg, answer };
}

// ─── Việc một chạm ───────────────────────────────────────────────

export type QuickTask = 'write_story' | 'split' | 'generate_tests' | 'improve_bug' | 'summarize' | 'review_story' | 'meeting_notes';

const QUICK_PROMPTS: Record<QuickTask, string> = {
  write_story: 'Turn the user\'s idea into ONE well-formed user story: title "As a <role>, I want <goal> so that <benefit>" (or a short imperative title if that reads better), a description, 3–7 testable acceptance criteria (Given/When/Then or checklist) and a Fibonacci story point estimate. Propose it as a create_issue action.',
  split: 'Split the focused issue into smaller pieces. For an EPIC propose 3–8 STORY create_issue actions with parent = the epic number. For a story/task/bug propose 2–8 SUBTASK create_issue actions with parent = that issue number. Each piece should be independently completable.',
  generate_tests: 'Write test cases that verify the focused issue\'s acceptance criteria: positive, negative and boundary cases (3–8 tests). Propose each as a create_test action with concrete steps (action, test data, expected result) and requirement = the focused issue number.',
  improve_bug: 'Rewrite the focused bug report so a developer can reproduce it: clear title, environment, preconditions, numbered steps to reproduce, expected result, actual result, severity and priority. Propose ONE update_issue action with the new title, description and priority. Mark anything unknown as "Unknown — please fill in" instead of inventing facts.',
  summarize: 'Summarise the focused issue and its discussion in at most 6 bullet points: current state, decisions, open questions, blockers, next step. No actions.',
  review_story: 'Review the focused story against INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) and check whether each acceptance criterion is testable. Give a score out of 10 per letter in a small table, list concrete problems, and propose ONE update_issue action with an improved description only if it clearly helps.',
  meeting_notes: 'The user pasted meeting notes. Extract every concrete task/decision into create_issue actions (assign owners only if a member username is clearly mentioned, set due dates only if stated). In "reply" give a short summary of the meeting: decisions, action items, open questions.',
};

const QUICK_LABELS: Record<QuickTask, string> = {
  write_story: 'Write a user story', split: 'Split into sub-tasks', generate_tests: 'Generate test cases',
  improve_bug: 'Improve bug report', summarize: 'Summarize', review_story: 'Review story quality', meeting_notes: 'Meeting notes to tasks',
};

export async function quick(userId: number, projectId: number, input: { task: QuickTask; issueNumber?: number | null; text?: string | null; threadId?: number | null; label?: string | null }) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const needsIssue = ['split', 'generate_tests', 'improve_bug', 'summarize', 'review_story'].includes(input.task);
  if (needsIssue && !input.issueNumber) throw new BadRequestError('Choose an issue first', 'WORK_AI_NEEDS_ISSUE');
  if (!needsIssue && !input.text?.trim()) throw new BadRequestError('Write something for the AI to work with', 'WORK_AI_NEEDS_TEXT');
  const focus = input.issueNumber ? await issueContext(projectId, access.key, input.issueNumber) : null;
  const ctx = await projectContext(access, `${input.text ?? ''} ${focus?.issue.title ?? ''}`);
  const system = `You are the CT Work project assistant (senior BA, Scrum master and QA lead). ${LANG_RULE}
${QUICK_PROMPTS[input.task]}
${ACTIONS_DOC}
Return ONLY JSON: {"reply":"short markdown explanation","actions":[…]}`;
  const user = `${ctx.text}${focus ? `\n\nFocused issue:\n${focus.text}` : ''}${input.text ? `\n\nUser input:\n${clip(input.text, 12000)}` : ''}`;
  // Việc một chạm cũng vào hội thoại: một dòng "câu hỏi" mô tả việc đã bấm + câu trả lời có tiêu đề.
  const label = (input.label?.trim() || QUICK_LABELS[input.task]).slice(0, 120);
  const asked = `${label}${input.issueNumber ? ` · ${access.key}-${input.issueNumber}` : ''}${input.text ? `\n\n${clip(input.text, 4000)}` : ''}`;
  const thread = await threads.openThread(userId, access, { threadId: input.threadId, seed: asked, issueNumber: input.issueNumber });
  const userMsg = await threads.addMessage(thread.id, { role: 'user', authorId: userId, content: asked, issueNumber: input.issueNumber ?? null });
  let out: { reply: string; actions?: unknown };
  try {
    out = parseJson(await ask(userId, system, user, 3000), z.object({ reply: z.string(), actions: z.unknown().optional() }));
  } catch (err) {
    await threads.markFailed(userMsg.id, err);
    throw err;
  }
  const actions = saneActions(out.actions);
  const answer = await threads.addMessage(thread.id, {
    role: 'assistant', title: label, content: out.reply, issueNumber: input.issueNumber ?? null,
    actions: actions.map((action) => ({ action, status: 'pending' as const })),
  });
  return { reply: out.reply, actions, quota: await aiQuota(userId), threadId: thread.id, question: userMsg, answer };
}

// ─── Đề xuất đã lưu trong hội thoại ──────────────────────────────

/**
 * Áp dụng đề xuất THỨ `index` của tin nhắn AI đã lưu. Chạy đúng đề xuất lưu ở
 * server (client không gửi nội dung đề xuất ⇒ không sửa được nó trước khi áp),
 * bằng quyền của CHÍNH người bấm, và giành khoá trước ⇒ hai người trong nhóm
 * không thể áp dụng cùng một đề xuất hai lần.
 */
export async function applyStoredAction(userId: number, projectId: number, messageId: number, index: number, edited?: AiAction) {
  await requireProject(userId, projectId, 'project.view');
  const msg = await threads.visibleMessage(userId, projectId, messageId);
  if (msg.role !== 'assistant') throw new BadRequestError('Only AI answers have suggestions');
  const me = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { username: true } });
  const item = await threads.claimAction(userId, me.username, messageId, index);
  // Người dùng sửa đề xuất trước khi áp (ô sửa trong ActionCard): lưu bản đã sửa để cả nhóm thấy đúng thứ đã áp.
  if (edited) await threads.patchAction(messageId, index, { action: edited });
  const parsed = actionSchema.safeParse(edited ?? item.action);
  if (!parsed.success) {
    await threads.patchAction(messageId, index, { status: 'error', error: 'This suggestion is no longer valid' });
    throw new BadRequestError('This suggestion is no longer valid');
  }
  try {
    const r = await applyAction(userId, projectId, parsed.data);
    return threads.patchAction(messageId, index, { status: 'done', summary: r.summary, number: r.number, error: undefined, at: new Date().toISOString() });
  } catch (err) {
    const text = err instanceof Error ? err.message : 'Could not apply this change';
    await threads.patchAction(messageId, index, { status: 'error', error: text.slice(0, 300) });
    throw err;
  }
}

/** Bỏ qua / khôi phục một đề xuất đã lưu (ai trong nhóm cũng thấy trạng thái này). */
export async function setStoredActionStatus(userId: number, projectId: number, messageId: number, index: number, status: 'dismissed' | 'pending') {
  await requireProject(userId, projectId, 'ai.use');
  await threads.visibleMessage(userId, projectId, messageId);
  const from: threads.StoredActionStatus[] = status === 'dismissed' ? ['pending', 'error'] : ['dismissed'];
  return threads.patchAction(messageId, index, { status, error: undefined }, from);
}

/** Câu hỏi bằng lời ⇒ bộ lọc danh sách thẻ (client áp vào trang Issues). */
export async function naturalFilter(userId: number, projectId: number, question: string) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const [members, statuses, types, labels, sprints] = await Promise.all([
    projectMembers(projectId),
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true } }),
    prisma.workIssueType.findMany({ where: { projectId, archived: false }, select: { id: true, key: true, name: true } }),
    prisma.workLabel.findMany({ where: { projectId }, select: { id: true, name: true } }),
    prisma.workSprint.findMany({ where: { projectId, state: { not: 'CLOSED' } }, select: { id: true, name: true, state: true } }),
  ]);
  const me = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { username: true } });
  const system = `Convert a question about issues in project ${access.key} into a JSON filter. ${LANG_RULE}
Allowed values — statuses: ${[...new Set(statuses.map((s) => s.name))].join(', ')}; types: ${types.map((t) => t.key).join(', ')}; labels: ${labels.map((l) => l.name).join(', ') || 'none'}; members: ${members.map((m) => m.username).join(', ')}; the asking user is ${me.username}; sprints: ${sprints.map((s) => `${s.name}${s.state === 'ACTIVE' ? ' (active)' : ''}`).join(', ') || 'none'}.
Return ONLY JSON: {"statuses":[names],"types":[keys],"assignees":[usernames or "unassigned"],"labels":[names],"sprint":"active|backlog|<name>|null","text":"free-text search or null","includeDone":true|false,"explanation":"one sentence describing the filter"}`;
  const out = parseJson(await ask(userId, system, question, 600), z.object({
    statuses: z.array(z.string()).nullish(), types: z.array(z.string()).nullish(), assignees: z.array(z.string()).nullish(),
    labels: z.array(z.string()).nullish(), sprint: z.string().nullish(), text: z.string().nullish(), includeDone: z.boolean().nullish(),
    explanation: z.string().nullish(),
  }));
  const lower = (s: string) => s.toLowerCase();
  const sprintId = out.sprint === 'active' ? sprints.find((s) => s.state === 'ACTIVE')?.id
    : out.sprint ? sprints.find((s) => lower(s.name) === lower(out.sprint!))?.id : undefined;
  return {
    filter: {
      status: statuses.filter((s) => out.statuses?.some((n) => lower(n) === lower(s.name))).map((s) => s.id),
      type: types.filter((t) => out.types?.some((k) => lower(k) === lower(t.key) || lower(k) === lower(t.name))).map((t) => t.id),
      assignee: [
        ...(out.assignees?.some((a) => lower(a) === 'unassigned') ? [0] : []),
        ...members.filter((m) => out.assignees?.some((a) => lower(a.replace(/^@/, '')) === lower(m.username))).map((m) => m.id),
      ],
      label: labels.filter((l) => out.labels?.some((n) => lower(n) === lower(l.name))).map((l) => l.id),
      sprint: out.sprint === 'backlog' ? 'backlog' as const : sprintId,
      q: out.text || undefined,
      includeDone: out.includeDone ?? undefined,
    },
    explanation: out.explanation ?? null,
    quota: await aiQuota(userId),
  };
}

// ─── Áp dụng một đề xuất ─────────────────────────────────────────

function textDoc(text: string, criteria?: string[] | null): Prisma.InputJsonValue {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] }));
  const content: unknown[] = [...paras];
  if (criteria?.length) {
    content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Acceptance criteria' }] });
    content.push({
      type: 'taskList',
      content: criteria.map((c) => ({ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: c }] }] })),
    });
  }
  return { type: 'doc', content } as Prisma.InputJsonValue;
}

async function resolveSprint(projectId: number, name: string | null | undefined): Promise<number | null | undefined> {
  if (name === undefined || name === null || name === '') return undefined;
  if (name.toLowerCase() === 'backlog') return null;
  const sprints = await prisma.workSprint.findMany({ where: { projectId, state: { not: 'CLOSED' } }, select: { id: true, name: true, state: true } });
  if (name.toLowerCase() === 'active') {
    const a = sprints.find((s) => s.state === 'ACTIVE');
    if (!a) throw new BadRequestError('There is no active sprint', 'WORK_AI_NO_SPRINT');
    return a.id;
  }
  const s = sprints.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!s) throw new BadRequestError(`Sprint "${name}" not found`, 'WORK_AI_NO_SPRINT');
  return s.id;
}

async function resolveAssignee(projectId: number, username: string | null | undefined): Promise<number | null | undefined> {
  if (username === undefined || username === null || username === '') return undefined;
  if (['none', 'unassigned'].includes(username.toLowerCase())) return null;
  const members = await projectMembers(projectId);
  const m = members.find((x) => x.username.toLowerCase() === username.replace(/^@/, '').toLowerCase());
  if (!m) throw new BadRequestError(`@${username} is not a member of this project`, 'WORK_AI_BAD_ASSIGNEE');
  return m.id;
}

/**
 * Thực thi MỘT đề xuất dưới quyền người bấm. Mỗi nhánh gọi đúng service
 * người dùng vẫn gọi (có kiểm quyền) — không có đường tắt nào cho AI.
 */
export async function applyAction(userId: number, projectId: number, action: AiAction): Promise<{ summary: string; number?: number }> {
  const access = await requireProject(userId, projectId, 'project.view');
  const key = (n: number) => `${access.key}-${n}`;
  switch (action.type) {
    case 'create_issue': {
      const type = await prisma.workIssueType.findFirst({
        where: { projectId, archived: false, OR: [{ key: action.issueType.toUpperCase() }, { name: { equals: action.issueType, mode: 'insensitive' } }] },
        select: { id: true },
      });
      if (!type) throw new BadRequestError(`This project has no "${action.issueType}" issue type`, 'WORK_AI_BAD_TYPE');
      let parentId: number | undefined;
      if (action.parent) {
        const p = await prisma.workIssue.findFirst({ where: { projectId, number: action.parent, deletedAt: null }, select: { id: true } });
        if (!p) throw new BadRequestError(`${key(action.parent)} not found`, 'WORK_AI_BAD_PARENT');
        parentId = p.id;
      }
      const sprintId = await resolveSprint(projectId, action.sprint);
      const assigneeId = await resolveAssignee(projectId, action.assignee);
      const issue = await createIssueAs(userId, projectId, {
        typeId: type.id, title: action.title,
        descriptionJson: action.description || action.acceptanceCriteria?.length ? textDoc(action.description ?? '', action.acceptanceCriteria) : undefined,
        priority: action.priority ?? undefined, storyPoints: action.storyPoints ?? undefined, parentId,
        sprintId: sprintId ?? undefined, assigneeId: assigneeId ?? undefined,
      }, 'AI');
      return { summary: `Created ${key(issue.number)}`, number: issue.number };
    }
    case 'update_issue': {
      const status = action.status
        ? await prisma.workStatus.findFirst({
          where: { name: { equals: action.status, mode: 'insensitive' }, workflow: { projectId, issueTypes: { some: { issues: { some: { projectId, number: action.number } } } } } },
          select: { id: true },
        }) ?? await prisma.workStatus.findFirst({ where: { name: { equals: action.status, mode: 'insensitive' }, workflow: { projectId, isDefault: true } }, select: { id: true } })
        : null;
      if (action.status && !status) throw new BadRequestError(`Status "${action.status}" not found`, 'WORK_AI_BAD_STATUS');
      await updateIssueAs(userId, projectId, action.number, {
        ...(action.title ? { title: action.title } : {}),
        ...(action.description ? { descriptionJson: textDoc(action.description) } : {}),
        ...(action.priority ? { priority: action.priority } : {}),
        ...(action.storyPoints !== undefined && action.storyPoints !== null ? { storyPoints: action.storyPoints } : {}),
        ...(status ? { statusId: status.id } : {}),
        ...(action.assignee ? { assigneeId: await resolveAssignee(projectId, action.assignee) } : {}),
        ...(action.sprint ? { sprintId: await resolveSprint(projectId, action.sprint) } : {}),
        ...(action.dueDate ? { dueDate: new Date(`${action.dueDate}T00:00:00Z`) } : {}),
      }, undefined, 'AI');
      return { summary: `Updated ${key(action.number)}`, number: action.number };
    }
    case 'add_comment': {
      await addComment(userId, projectId, action.number, textDoc(action.text), 'AI');
      return { summary: `Commented on ${key(action.number)}`, number: action.number };
    }
    case 'move_to_sprint': {
      const sprintId = await resolveSprint(projectId, action.sprint);
      const r = await bulkUpdate(userId, projectId, action.numbers, { sprintId: sprintId ?? null });
      if (r.failed.length && !r.updated.length) throw new BadRequestError(r.failed[0].error, 'WORK_AI_MOVE_FAILED');
      return { summary: `Moved ${r.updated.length} issue${r.updated.length === 1 ? '' : 's'}${r.failed.length ? ` (${r.failed.length} failed)` : ''}` };
    }
    case 'create_test': {
      const t = await createTest(userId, projectId, {
        title: action.title, preconditions: action.preconditions ?? null,
        steps: action.steps.map((s) => ({ action: s.action, data: s.data ?? null, expected: s.expected ?? null })),
        requirementKeys: action.requirement ? [key(action.requirement)] : [],
      });
      return { summary: `Created test ${key(t.number)}`, number: t.number };
    }
  }
}

// ─── Không cần AI: trùng lặp, gợi ý người nhận, rủi ro ───────────

/** Thẻ có tiêu đề giống (pg_trgm) — gợi ý khi đang tạo thẻ để tránh báo trùng. */
export async function similarIssues(userId: number, projectId: number, title: string) {
  await requireProject(userId, projectId, 'project.view');
  const t = title.trim();
  if (t.length < 4) return [];
  try {
    return await prisma.$queryRaw<Array<{ number: number; title: string; score: number; resolved: boolean }>>`
      SELECT number, title, similarity(title, ${t})::float AS score, resolved_at IS NOT NULL AS resolved
      FROM work_issues
      WHERE project_id = ${projectId} AND deleted_at IS NULL AND similarity(title, ${t}) > 0.3
      ORDER BY score DESC LIMIT 5`;
  } catch {
    // pg_trgm chưa bật (máy dev lạ): lùi về so chuỗi con.
    const rows = await prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, title: { contains: t.slice(0, 40), mode: 'insensitive' } },
      take: 5, select: { number: true, title: true, resolvedAt: true },
    });
    return rows.map((r) => ({ number: r.number, title: r.title, score: 0.5, resolved: !!r.resolvedAt }));
  }
}

/** Gợi ý người nhận: ai đang ít việc mở nhất, ưu tiên người từng làm cùng epic/nhãn. */
export async function suggestAssignee(userId: number, projectId: number, input: { parentId?: number | null; labelIds?: number[] }) {
  await requireProject(userId, projectId, 'project.view');
  const mode = await estimationOf(projectId);
  const members = (await projectMembers(projectId)).filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const open = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, resolvedAt: null, assigneeId: { in: members.map((m) => m.id) }, type: { level: { not: 1 } } },
    select: { assigneeId: true, storyPoints: true, originalEstimateMin: true },
  });
  const related = input.parentId || input.labelIds?.length
    ? await prisma.workIssue.findMany({
      where: {
        projectId, deletedAt: null, assigneeId: { not: null },
        OR: [...(input.parentId ? [{ parentId: input.parentId }] : []), ...(input.labelIds?.length ? [{ labels: { some: { labelId: { in: input.labelIds } } } }] : [])],
      },
      select: { assigneeId: true },
    })
    : [];
  return members.map((m) => {
    const mine = open.filter((o) => o.assigneeId === m.id);
    const load = Math.round(mine.reduce((s, o) => s + estimateOf(o, mode), 0) * 10) / 10;
    const familiarity = related.filter((r) => r.assigneeId === m.id).length;
    return { userId: m.id, username: m.username, name: displayName(m), openIssues: mine.length, load, familiarity, score: familiarity * 3 - mine.length - load / 5 };
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Rủi ro dự án — TÍNH BẰNG MÃ, không tốn lượt AI:
 * thẻ quá hạn, sắp tới hạn, đứng yên lâu, người quá tải, việc ưu tiên cao chưa ai nhận,
 * sprint không kịp (điểm còn lại so với tốc độ những ngày đã qua).
 */
export async function insights(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const mode = await estimationOf(projectId);
  const now = Date.now();
  const staleDays = 5;
  const open = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } } },
    select: {
      number: true, title: true, priority: true, dueDate: true, updatedAt: true, assigneeId: true, storyPoints: true, originalEstimateMin: true,
      status: { select: { category: true, name: true } },
    },
  });
  const members = await projectMembers(projectId);
  const name = (id: number | null) => (id ? members.find((m) => m.id === id)?.username ?? null : null);
  const day = 86_400_000;
  const overdue = open.filter((i) => i.dueDate && i.dueDate.getTime() + day < now);
  const dueSoon = open.filter((i) => i.dueDate && i.dueDate.getTime() + day >= now && i.dueDate.getTime() < now + 3 * day);
  const stale = open.filter((i) => i.status.category === 'IN_PROGRESS' && now - i.updatedAt.getTime() > staleDays * day);
  const unassignedUrgent = open.filter((i) => !i.assigneeId && i.priority <= 2);
  const loads = members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => ({
    username: m.username,
    points: Math.round(open.filter((i) => i.assigneeId === m.id).reduce((s, i) => s + estimateOf(i, mode), 0) * 10) / 10,
    issues: open.filter((i) => i.assigneeId === m.id).length,
  }));
  const avg = loads.length ? loads.reduce((s, l) => s + l.points, 0) / loads.length : 0;
  const overloaded = loads.filter((l) => avg > 0 && l.points > avg * 1.6 && l.points - avg >= 3);

  // Tốc độ sprint: dùng chung mốc cam kết với Burndown (sprintPace.ts) — không
  // phụ thuộc cron snapshot nên ngày đầu không còn báo "0 pts/day, AT RISK".
  const sprintRisk: SprintPace | null = await activeSprintPace(projectId, new Date(now));
  const brief = (i: (typeof open)[number]) => ({ key: `${access.key}-${i.number}`, number: i.number, title: i.title, assignee: name(i.assigneeId), status: i.status.name, dueDate: i.dueDate });
  return {
    overdue: overdue.map(brief),
    dueSoon: dueSoon.map(brief),
    stale: stale.map((i) => ({ ...brief(i), idleDays: Math.floor((now - i.updatedAt.getTime()) / day) })),
    unassignedUrgent: unassignedUrgent.map(brief),
    overloaded,
    loads,
    sprintRisk,
    unit: mode,
  };
}

/**
 * Báo cáo tuần (cho giảng viên / khách hàng): MÃ gom số liệu, AI chỉ viết
 * thành văn. Trả cả số liệu thô để người dùng tự kiểm.
 */
export async function weeklyReport(userId: number, projectId: number, input: { audience: 'teacher' | 'client' | 'team'; language?: 'en' | 'vi' }) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const since = new Date(Date.now() - 7 * 86_400_000);
  const [done, created, risks, project] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: { gte: since }, type: { level: { not: -1 } } },
      select: { number: true, title: true, assignee: { select: { username: true } }, type: { select: { key: true } } },
      take: 80,
    }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null, createdAt: { gte: since } } }),
    insights(userId, projectId),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } }),
  ]);
  const facts = [
    `Project ${project.key} "${project.name}". Period: ${since.toISOString().slice(0, 10)} → ${new Date().toISOString().slice(0, 10)}.`,
    `Completed (${done.length}): ${done.map((d) => `${access.key}-${d.number} [${d.type.key}] ${d.title}${d.assignee ? ` (@${d.assignee.username})` : ''}`).join('; ') || 'none'}.`,
    `New issues created: ${created}.`,
    `Overdue: ${risks.overdue.map((i) => `${i.key} ${i.title}`).join('; ') || 'none'}.`,
    `Stuck in progress > 5 days: ${risks.stale.map((i) => `${i.key} (${i.idleDays}d)`).join('; ') || 'none'}.`,
    risks.sprintRisk ? risks.sprintRisk.summary : 'No active sprint.',
    `Workload: ${risks.loads.map((l) => `@${l.username} ${l.issues} open`).join(', ')}.`,
  ].join('\n');
  const who = input.audience === 'teacher' ? 'the course lecturer (formal, highlight each member\'s work)' : input.audience === 'client' ? 'the client (non-technical, outcomes and risks)' : 'the team (direct, action-oriented)';
  const system = `Write a weekly status report for ${who}. Use ONLY the facts given — do not invent numbers, names or work. Markdown with sections: Summary, Completed this week, Risks & blockers, Next steps. ${input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"report":"markdown"}`;
  // Chỉ diễn đạt lại số liệu đã tính ⇒ model rẻ (work_digest).
  const out = parseJson(await ask(userId, system, facts, 1800, 'work_digest'), z.object({ report: z.string() }));
  return { report: out.report, facts, quota: await aiQuota(userId) };
}


/**
 * Release notes cho một version (đợt 6.3). Dữ liệu là danh sách thẻ đã xong
 * của version — model chỉ nhóm lại và diễn đạt, không được thêm tính năng.
 * Không tự lưu: người dùng sửa rồi bấm Save (PATCH version.releaseNotes).
 */
export async function releaseNotes(userId: number, projectId: number, versionId: number, input: { audience: 'users' | 'team'; language?: 'en' | 'vi' }) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const version = await prisma.workVersion.findFirst({ where: { id: versionId, projectId }, select: { name: true, releaseDate: true, description: true } });
  if (!version) throw new NotFoundError('Version not found');
  const issues = await prisma.workIssue.findMany({
    where: { projectId, fixVersionId: versionId, deletedAt: null, type: { level: { gte: 0 } } },
    orderBy: [{ type: { key: 'asc' } }, { number: 'asc' }],
    take: 150,
    select: { number: true, title: true, resolvedAt: true, descriptionText: true, type: { select: { key: true, name: true } } },
  });
  const done = issues.filter((i) => i.resolvedAt);
  if (!done.length) throw new BadRequestError('No finished issues in this version yet', 'WORK_NOTHING_TO_SUMMARIZE');
  const facts = [
    `Version ${version.name}${version.releaseDate ? ` (release date ${version.releaseDate.toISOString().slice(0, 10)})` : ''}.${version.description ? ` Description: ${version.description}` : ''}`,
    `Finished issues (${done.length}):`,
    ...done.map((i) => `- ${access.key}-${i.number} [${i.type.name}] ${i.title}${i.descriptionText ? ` — ${i.descriptionText.replace(/\s+/g, ' ').slice(0, 200)}` : ''}`),
    `Not finished (${issues.length - done.length}) — do NOT mention these as shipped.`,
  ].join('\n');
  const tone = input.audience === 'users' ? 'end users (plain language, benefits, no issue keys)' : 'the team (keep issue keys, group by type)';
  const system = `Write release notes for ${tone}. Use ONLY the finished issues listed — never invent features. Markdown with sections such as "New", "Improvements", "Bug fixes" (omit empty sections). ${input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"notes":"markdown"}`;
  const out = parseJson(await ask(userId, system, facts, 1800, 'work_digest'), z.object({ notes: z.string() }));
  return { notes: out.notes, quota: await aiQuota(userId) };
}

// ─── Lập kế hoạch sprint theo velocity (4.7) ─────────────────────

/**
 * Đề xuất thẻ cho một sprint: MÃ tính velocity trung bình 3 sprint gần nhất
 * rồi xếp thẻ backlog theo thứ tự ưu tiên (rank) tới khi đầy. AI (tuỳ chọn)
 * chỉ viết lời giải thích — con số và danh sách luôn do mã quyết.
 * Không tự ghi: giao diện dùng bulkUpdate để chuyển thẻ khi người dùng đồng ý.
 */
export async function planSprint(userId: number, projectId: number, input: { sprintId: number; explain?: boolean; language?: 'en' | 'vi' }) {
  const access = await requireProject(userId, projectId, 'sprint.manage');
  const mode = await estimationOf(projectId);
  const sprint = await prisma.workSprint.findFirst({ where: { id: input.sprintId, projectId }, select: { id: true, name: true, state: true, startAt: true, endAt: true } });
  if (!sprint) throw new NotFoundError('Sprint not found');
  if (sprint.state === 'CLOSED') throw new BadRequestError('This sprint is already closed', 'WORK_SPRINT_CLOSED');
  const history = await prisma.workSprint.findMany({
    where: { projectId, state: 'CLOSED', completedPoints: { not: null } },
    orderBy: { completedAt: 'desc' }, take: 3,
    select: { name: true, committedPoints: true, completedPoints: true },
  });
  const velocity = history.length ? Math.round((history.reduce((s, h) => s + (h.completedPoints ?? 0), 0) / history.length) * 10) / 10 : null;
  const [inSprint, backlog] = await Promise.all([
    prisma.workIssue.findMany({ where: { sprintId: sprint.id, deletedAt: null, resolvedAt: null, type: { level: 0 } }, select: { number: true, title: true, storyPoints: true, originalEstimateMin: true } }),
    prisma.workIssue.findMany({
      where: { projectId, sprintId: null, deletedAt: null, resolvedAt: null, type: { level: 0 } },
      orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 300,
      select: { number: true, title: true, priority: true, storyPoints: true, originalEstimateMin: true, assigneeId: true,
        linksIn: { where: { type: 'BLOCKS', fromIssue: { resolvedAt: null, deletedAt: null } }, select: { fromIssue: { select: { number: true, sprintId: true } } } } },
    }),
  ]);
  const already = Math.round(inSprint.reduce((s, i) => s + estimateOf(i, mode), 0) * 10) / 10;
  // Chưa có lịch sử: không đoán bừa — dùng 20 điểm / 60 giờ và nói rõ.
  const target = velocity ?? (mode === 'HOURS' ? 60 : 20);
  let total = already;
  const selected: Array<{ number: number; title: string; points: number }> = [];
  const warnings: string[] = [];
  const unestimated: number[] = [];
  for (const i of backlog) {
    const pts = estimateOf(i, mode);
    if (!pts) { unestimated.push(i.number); continue; }
    if (total + pts > target) continue;
    const blocker = i.linksIn.find((l) => l.fromIssue.sprintId !== sprint.id);
    if (blocker) { warnings.push(`${access.key}-${i.number} is blocked by ${access.key}-${blocker.fromIssue.number}, which is not in this sprint — skipped`); continue; }
    selected.push({ number: i.number, title: i.title, points: pts });
    total = Math.round((total + pts) * 10) / 10;
  }
  if (!velocity) warnings.unshift(`No completed sprints yet — using a default capacity of ${target} ${mode === 'HOURS' ? 'hours' : 'points'}. Adjust after your first sprint.`);
  if (unestimated.length) warnings.push(`${unestimated.length} backlog issue(s) have no estimate and were not planned: ${unestimated.slice(0, 10).map((n) => `${access.key}-${n}`).join(', ')}${unestimated.length > 10 ? '…' : ''}`);
  const result = {
    sprint: { id: sprint.id, name: sprint.name }, unit: mode, velocity, history, target, alreadyPlanned: already,
    selected, plannedTotal: total, warnings, rationale: null as string | null,
  };
  if (input.explain) {
    const facts = [
      `Sprint "${sprint.name}". Unit: ${mode === 'HOURS' ? 'hours' : 'story points'}.`,
      `Velocity (last ${history.length} sprints): ${history.map((h) => `${h.name}: committed ${h.committedPoints ?? '?'}, completed ${h.completedPoints}`).join('; ') || 'none'} → average ${velocity ?? 'n/a'}.`,
      `Already in sprint: ${already}. Proposed additions (${selected.length}): ${selected.map((s) => `${access.key}-${s.number} "${s.title}" (${s.points})`).join('; ') || 'none'}. Planned total ${total} of target ${target}.`,
      `Warnings: ${warnings.join(' | ') || 'none'}.`,
    ].join('\n');
    const system = `You are a Scrum coach. Explain this sprint plan to the team in 4-7 short bullet points: whether the load is realistic versus velocity, notable risks, and what to clarify before starting. Use ONLY the facts. ${input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"rationale":"markdown"}`;
    result.rationale = parseJson(await ask(userId, system, facts, 900, 'work_digest'), z.object({ rationale: z.string() })).rationale;
  }
  return result;
}

// ─── Retro (4.10) ────────────────────────────────────────────────

/**
 * Tóm tắt retrospective: số liệu sprint (mã tính) + ghi chú nhóm dán vào ⇒
 * Went well / Didn't go well / Action items. Action item thành ĐỀ XUẤT
 * create_issue để người dùng duyệt (không tự tạo).
 */
export async function retro(userId: number, projectId: number, input: { sprintId: number; notes?: string | null; language?: 'en' | 'vi' }) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const s = await prisma.workSprint.findFirst({ where: { id: input.sprintId, projectId }, select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true, report: true } });
  if (!s) throw new NotFoundError('Sprint not found');
  const stored = s.report as (Partial<Awaited<ReturnType<typeof computeSprintReport>>> & { committedIssueIds?: number[] }) | null;
  const rep = stored?.completed ? (stored as Awaited<ReturnType<typeof computeSprintReport>>) : await computeSprintReport(projectId, s.id);
  const members = await projectMembers(projectId);
  const facts = [
    `Sprint "${s.name}" (${s.state})${s.goal ? `, goal: ${s.goal}` : ''}. ${s.startAt ? `From ${s.startAt.toISOString().slice(0, 10)}` : ''}${s.endAt ? ` to ${s.endAt.toISOString().slice(0, 10)}` : ''}.`,
    `Committed ${rep.committedPoints} ${rep.unit === 'HOURS' ? 'hours' : 'points'}, completed ${rep.completedPoints}.`,
    `Completed (${rep.completed.length}): ${rep.completed.map((i) => `${access.key}-${i.number} ${i.title}`).join('; ') || 'none'}.`,
    `Not completed (${rep.incomplete.length}): ${rep.incomplete.map((i) => `${access.key}-${i.number} ${i.title}`).join('; ') || 'none'}.`,
    `Scope change: ${rep.added.length} added after start, ${rep.removed.length} removed.`,
    `Members: ${members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => m.username).join(', ')}.`,
    input.notes ? `Team notes:\n${clip(input.notes, 12_000)}` : 'No team notes provided.',
  ].join('\n');
  const system = `You facilitate a sprint retrospective. Using ONLY the facts and team notes, write markdown with sections "What went well", "What didn't go well", "Action items" (each action item concrete, with an owner only if the notes name one). Then propose each action item as {"type":"create_issue","issueType":"TASK","title":"…","description":"…","assignee":"username"} (only usernames from the member list). ${input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"summary":"markdown","actions":[...]}`;
  const out = parseJson(await ask(userId, system, facts, 1800, 'work_assistant'), z.object({ summary: z.string(), actions: z.unknown().optional() }));
  return { summary: out.summary, actions: saneActions(out.actions), facts, quota: await aiQuota(userId) };
}

// ─── Bản tin hằng ngày (4.8) ─────────────────────────────────────

/**
 * Bản tin ngắn cho dự án: MÃ tính rủi ro (insights), AI viết 3–6 gạch đầu
 * dòng. Lưu vào settings.dailyBrief để cả nhóm đọc trên tab Health — gọi
 * một lần cho cả nhóm, không phải mỗi người một lần.
 */
export async function dailyBrief(userId: number, projectId: number, input: { language?: 'en' | 'vi' } = {}) {
  const access = await requireProject(userId, projectId, 'ai.use');
  const risks = await insights(userId, projectId);
  const since = new Date(Date.now() - 86_400_000);
  const [doneYesterday, createdYesterday, project] = await Promise.all([
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, resolvedAt: { gte: since } }, select: { number: true, title: true }, take: 30 }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null, createdAt: { gte: since } } }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, settings: true } }),
  ]);
  const facts = [
    `Project ${access.key} "${project.name}". Last 24h: ${doneYesterday.length} finished (${doneYesterday.map((d) => `${access.key}-${d.number} ${d.title}`).join('; ') || 'none'}), ${createdYesterday} created.`,
    `Overdue: ${risks.overdue.map((i) => `${i.key} ${i.title} (@${i.assignee ?? 'unassigned'})`).join('; ') || 'none'}.`,
    `Due in 3 days: ${risks.dueSoon.map((i) => `${i.key} (@${i.assignee ?? 'unassigned'})`).join('; ') || 'none'}.`,
    `Stuck in progress: ${risks.stale.map((i) => `${i.key} ${i.idleDays}d`).join('; ') || 'none'}.`,
    `Urgent but unassigned: ${risks.unassignedUrgent.map((i) => i.key).join('; ') || 'none'}.`,
    `Overloaded: ${risks.overloaded.map((l) => `@${l.username} ${l.points}`).join(', ') || 'none'}.`,
    risks.sprintRisk ? risks.sprintRisk.summary : 'No active sprint.',
  ].join('\n');
  const system = `Write today's stand-up brief for the team: 3-6 short markdown bullets, most important first (risks, overdue work, who should look at what). Use ONLY the facts; do not invent. ${input.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"brief":"markdown"}`;
  const out = parseJson(await ask(userId, system, facts, 700, 'work_digest'), z.object({ brief: z.string() }));
  const brief = { text: out.brief.slice(0, 5000), at: new Date().toISOString(), by: userId };
  const settings = (project.settings ?? {}) as Record<string, unknown>;
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: { ...settings, dailyBrief: brief } as Prisma.InputJsonValue } });
  return { ...brief, facts, quota: await aiQuota(userId) };
}

/**
 * Cron 08:00: bản tin cho các dự án có hoạt động hôm qua. Mặc định TẮT
 * (WORK_DIGEST_ENABLED=true mới chạy — việc AI chạy nền phải bật tay, xem
 * CLAUDE.md "Việc chạy nền mặc định TẮT"). Tính lượt AI vào người dẫn dự án.
 */
export async function runDailyBriefs(): Promise<number> {
  if (process.env.WORK_DIGEST_ENABLED !== 'true') return 0;
  const since = new Date(Date.now() - 86_400_000);
  const projects = await prisma.workProject.findMany({
    where: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null }, issues: { some: { updatedAt: { gte: since } } } },
    select: { id: true, leadId: true, workspace: { select: { ownerId: true } } },
    take: 200,
  });
  let n = 0;
  for (const p of projects) {
    try {
      await dailyBrief(p.leadId ?? p.workspace.ownerId, p.id);
      n += 1;
    } catch {
      // hết hạn mức / AI lỗi: bỏ qua dự án này, ngày mai thử lại
    }
  }
  return n;
}
