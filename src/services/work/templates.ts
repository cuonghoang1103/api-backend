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
}

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
      return { statuses, types: ['EPIC', 'REQUIREMENT', 'STORY', 'TASK', 'SUBTASK'], settings: { ...base, prioritization: 'MOSCOW' } };
    case 'SWT301':
      return { statuses, types: [...BASE_TYPES, 'TEST'], bugWorkflow: BUG_LIFECYCLE, settings: { ...base, estimation: 'HOURS' } };
    case 'SWP391':
      return { statuses, types: BASE_TYPES, bugWorkflow: BUG_LIFECYCLE, settings: base };
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

  await tx.workProject.update({ where: { id: projectId }, data: { settings: spec.settings as Prisma.InputJsonValue } });
}
