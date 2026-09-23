/**
 * CT Work — dựng dự án mới từ mẫu: quy trình mặc định, trạng thái, loại thẻ.
 *
 * Mẫu chỉ là dữ liệu khởi tạo. Sau khi tạo, cấu hình được CHÉP vào các bảng
 * của dự án nên sửa mẫu ở đây không đổi dự án cũ (giống Jira).
 * Mọi chữ hiển thị bằng tiếng Anh (quyết định 23/09/2026).
 */

import type { Prisma } from '@prisma/client';
import type { IssueTypeKey, ProjectTemplate, ProjectType, StatusCategory } from './constants.js';

interface StatusSeed { name: string; category: StatusCategory; color: string }
interface TypeSeed { key: IssueTypeKey; name: string; icon: string; color: string; level: number }

const STATUS_COLORS: Record<StatusCategory, string> = {
  TODO: '#64748b',
  IN_PROGRESS: '#2563eb',
  DONE: '#16a34a',
};

const s = (name: string, category: StatusCategory): StatusSeed => ({ name, category, color: STATUS_COLORS[category] });

const TYPES: Record<IssueTypeKey, TypeSeed> = {
  EPIC:        { key: 'EPIC',        name: 'Epic',        icon: 'epic',        color: '#7c3aed', level: 1 },
  STORY:       { key: 'STORY',       name: 'Story',       icon: 'story',       color: '#16a34a', level: 0 },
  TASK:        { key: 'TASK',        name: 'Task',        icon: 'task',        color: '#2563eb', level: 0 },
  BUG:         { key: 'BUG',         name: 'Bug',         icon: 'bug',         color: '#dc2626', level: 0 },
  REQUIREMENT: { key: 'REQUIREMENT', name: 'Requirement', icon: 'requirement', color: '#0891b2', level: 0 },
  TEST:        { key: 'TEST',        name: 'Test',        icon: 'test',        color: '#ca8a04', level: 0 },
  SUBTASK:     { key: 'SUBTASK',     name: 'Sub-task',    icon: 'subtask',     color: '#475569', level: -1 },
};

interface TemplateSpec {
  statuses: StatusSeed[];
  types: IssueTypeKey[];
  /** Quy trình riêng cho Bug (vòng Retest của SWT301). */
  bugWorkflow?: StatusSeed[];
  settings: Record<string, unknown>;
  /** Tạo sẵn "Sprint 1" (chưa bắt đầu) — mẫu Scrum của môn học hứa điều này. */
  firstSprint?: boolean;
  /** Trường tuỳ chỉnh dựng sẵn (vd MoSCoW của SWR302). */
  customFields?: Array<{ name: string; kind: 'SELECT'; options: Array<{ id: string; label: string; color: string }>; typeKeys: IssueTypeKey[] | null }>;
}

/** MoSCoW — id cố định để dữ liệu mẫu / JQL / AI gọi đúng lựa chọn. */
export const MOSCOW_FIELD = {
  name: 'MoSCoW',
  kind: 'SELECT' as const,
  options: [
    { id: 'must', label: 'Must', color: '#dc2626' },
    { id: 'should', label: 'Should', color: '#ea580c' },
    { id: 'could', label: 'Could', color: '#2563eb' },
    { id: 'wont', label: "Won't", color: '#64748b' },
  ],
  typeKeys: ['REQUIREMENT', 'STORY', 'EPIC'] as IssueTypeKey[],
};

const SCRUM_STATUSES = [s('To Do', 'TODO'), s('In Progress', 'IN_PROGRESS'), s('In Review', 'IN_PROGRESS'), s('Done', 'DONE')];
const KANBAN_STATUSES = [s('Backlog', 'TODO'), s('Selected', 'TODO'), s('In Progress', 'IN_PROGRESS'), s('Done', 'DONE')];
const BUG_LIFECYCLE = [
  s('Open', 'TODO'), s('In Progress', 'IN_PROGRESS'), s('Fixed', 'IN_PROGRESS'),
  s('Retest', 'IN_PROGRESS'), s('Reopened', 'TODO'), s('Closed', 'DONE'),
];
const BASE_TYPES: IssueTypeKey[] = ['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK'];

const DEFAULT_DOD = [
  'Code reviewed and merged',
  'Acceptance criteria verified',
  'No open blocker bugs',
];

export function templateSpec(template: ProjectTemplate, type: ProjectType): TemplateSpec {
  const statuses = type === 'KANBAN' ? KANBAN_STATUSES : SCRUM_STATUSES;
  const base = { estimation: 'POINTS', sprintLengthDays: 14, definitionOfDone: DEFAULT_DOD };
  switch (template) {
    case 'SWR302':
      return {
        statuses, types: ['EPIC', 'REQUIREMENT', 'STORY', 'TASK', 'SUBTASK'], settings: { ...base, prioritization: 'MOSCOW' },
        firstSprint: type === 'SCRUM', customFields: [MOSCOW_FIELD],
      };
    case 'SWT301':
      return { statuses, types: [...BASE_TYPES, 'TEST'], bugWorkflow: BUG_LIFECYCLE, settings: { ...base, estimation: 'HOURS' } };
    case 'SWP391':
      return { statuses, types: BASE_TYPES, bugWorkflow: BUG_LIFECYCLE, settings: base, firstSprint: type === 'SCRUM' };
    case 'FREELANCE':
      return { statuses, types: BASE_TYPES, settings: { ...base, estimation: 'HOURS', sprintLengthDays: 7 } };
    case 'COMPANY':
      return {
        statuses: [s('To Do', 'TODO'), s('In Progress', 'IN_PROGRESS'), s('Code Review', 'IN_PROGRESS'), s('QA', 'IN_PROGRESS'), s('Done', 'DONE')],
        types: [...BASE_TYPES, 'TEST'],
        bugWorkflow: BUG_LIFECYCLE,
        settings: base,
      };
    case 'BLANK':
    default:
      return { statuses, types: type === 'TESTING' ? [...BASE_TYPES, 'TEST'] : BASE_TYPES, settings: base };
  }
}

/**
 * Tạo quy trình + trạng thái + loại thẻ cho một dự án vừa tạo. Chạy TRONG
 * transaction tạo dự án — dự án không bao giờ tồn tại mà thiếu trạng thái.
 */
export async function seedProjectConfig(
  tx: Prisma.TransactionClient,
  projectId: number,
  template: ProjectTemplate,
  type: ProjectType,
  opts: { firstSprint?: boolean } = {},
): Promise<void> {
  const spec = templateSpec(template, type);

  const main = await tx.workWorkflow.create({
    data: {
      projectId,
      name: 'Default workflow',
      isDefault: true,
      statuses: { create: spec.statuses.map((st, i) => ({ ...st, position: i })) },
    },
  });

  let bugWorkflowId: number | null = null;
  if (spec.bugWorkflow) {
    const bug = await tx.workWorkflow.create({
      data: {
        projectId,
        name: 'Bug lifecycle',
        statuses: { create: spec.bugWorkflow.map((st, i) => ({ ...st, position: i })) },
      },
      include: { statuses: true },
    });
    bugWorkflowId = bug.id;
    // Vòng đời bug có luồng chuyển CỐ ĐỊNH: không được nhảy từ Open sang Closed
    // mà bỏ qua Retest — đó chính là điều môn kiểm thử muốn dạy.
    const id = (name: string) => bug.statuses.find((x) => x.name === name)!.id;
    const flow: Array<[string, string]> = [
      ['Open', 'In Progress'], ['In Progress', 'Fixed'], ['Fixed', 'Retest'],
      ['Retest', 'Closed'], ['Retest', 'Reopened'], ['Reopened', 'In Progress'],
      ['Open', 'Closed'], // đóng thẳng khi bug không hợp lệ / trùng
      ['Closed', 'Reopened'],
    ];
    await tx.workTransition.createMany({
      data: flow.map(([from, to]) => ({ workflowId: bug.id, fromStatusId: id(from), toStatusId: id(to), name: to })),
    });
  }

  await tx.workIssueType.createMany({
    data: spec.types.map((key, i) => ({
      projectId,
      ...TYPES[key],
      position: i,
      workflowId: key === 'BUG' && bugWorkflowId ? bugWorkflowId : main.id,
    })),
  });

  for (const [i, f] of (spec.customFields ?? []).entries()) {
    await tx.workCustomField.create({
      data: { projectId, name: f.name, kind: f.kind, options: f.options as Prisma.InputJsonValue, typeKeys: (f.typeKeys ?? undefined) as Prisma.InputJsonValue | undefined, position: i },
    });
  }

  // "Sprint 1" chưa bắt đầu: người mới vào Backlog thấy ngay chỗ kéo thẻ vào.
  if (opts.firstSprint ?? spec.firstSprint) {
    await tx.workSprint.create({ data: { projectId, name: 'Sprint 1', position: 1 } });
  }

  await tx.workProject.update({ where: { id: projectId }, data: { settings: spec.settings as Prisma.InputJsonValue } });
}

// ─── Mẫu mô tả theo loại thẻ (24/09/2026) ────────────────────────
// KHÔNG chép vào settings lúc tạo dự án: dự án chưa tự đặt mẫu thì luôn nhận
// bản mặc định mới nhất ở đây (dự án cũ cũng có ngay). Tự đặt rồi thì lưu ở
// settings.issueTemplates[typeKey]. Chỉ dùng node mà RichEditor có bật:
// heading 1–3, list thường/đánh số, taskList/taskItem, blockquote, codeBlock.

type TNode = Record<string, unknown>;
const txt = (text: string, bold = false): TNode => (bold ? { type: 'text', text, marks: [{ type: 'bold' }] } : { type: 'text', text });
const para = (...parts: Array<string | TNode>): TNode =>
  parts.length ? { type: 'paragraph', content: parts.map((x) => (typeof x === 'string' ? txt(x) : x)) } : { type: 'paragraph' };
const h3 = (text: string): TNode => ({ type: 'heading', attrs: { level: 3 }, content: [txt(text)] });
const li = (p: TNode = para()): TNode => ({ type: 'listItem', content: [p] });
const ul = (...items: TNode[]): TNode => ({ type: 'bulletList', content: items.map((p) => li(p)) });
const ol = (count: number): TNode => ({ type: 'orderedList', attrs: { start: 1 }, content: Array.from({ length: count }, () => li()) });
const tasks = (...items: TNode[]): TNode => ({
  type: 'taskList', content: items.map((p) => ({ type: 'taskItem', attrs: { checked: false }, content: [p] })),
});
const labelled = (label: string) => para(txt(`${label}: `, true));

export interface IssueTemplateDoc { type: 'doc'; content: TNode[] }

/** Tên hiển thị của mẫu mặc định ("Template: Bug report"). */
export const DEFAULT_TEMPLATE_NAMES: Partial<Record<IssueTypeKey, string>> = {
  BUG: 'Bug report',
  STORY: 'User story',
  TASK: 'Task',
  EPIC: 'Epic brief',
  REQUIREMENT: 'Requirement',
};

/**
 * Mẫu mặc định của một loại thẻ; null = loại này không có mẫu (Test do trình
 * soạn test case lo, Sub-task quá nhỏ). `dod` = Definition of Done của dự án.
 */
export function defaultIssueTemplate(typeKey: string, dod: string[] = DEFAULT_DOD): IssueTemplateDoc | null {
  switch (typeKey) {
    case 'BUG':
      return {
        type: 'doc',
        content: [
          h3('Summary'), para(),
          h3('Steps to reproduce'), ol(3),
          h3('Expected result'), para(),
          h3('Actual result'), para(),
          h3('Environment'), ul(labelled('Browser'), labelled('OS / device'), labelled('Build / version')),
          h3('Evidence'), para('Screenshots, logs or a screen recording.'),
        ],
      };
    case 'STORY':
      return {
        type: 'doc',
        content: [
          para(txt('As a', true), ' <type of user>, ', txt('I want', true), ' <goal> ', txt('so that', true), ' <benefit>.'),
          h3('Acceptance criteria'), tasks(para('Given <context>, when <action>, then <outcome>'), para(), para()),
          h3('Notes / Design'), para(),
        ],
      };
    case 'TASK':
      return {
        type: 'doc',
        content: [
          h3('Goal'), para(),
          h3('Checklist'), tasks(para(), para(), para()),
          h3('Definition of done'), tasks(...(dod.length ? dod : DEFAULT_DOD).slice(0, 12).map((d) => para(d))),
        ],
      };
    case 'EPIC':
      return {
        type: 'doc',
        content: [
          h3('Goal'), para(),
          h3('Scope'), ul(para(), para()),
          h3('Out of scope'), ul(para()),
          h3('Success metrics'), ul(para()),
        ],
      };
    case 'REQUIREMENT':
      return {
        type: 'doc',
        content: [
          ul(labelled('ID'), labelled('Source / stakeholder')),
          h3('Description'), para('The system shall …'),
          h3('Rationale'), para(),
          h3('Priority (MoSCoW)'), para('Must / Should / Could / Won’t'),
          h3('Acceptance criteria'), tasks(para(), para()),
        ],
      };
    default:
      return null;
  }
}
