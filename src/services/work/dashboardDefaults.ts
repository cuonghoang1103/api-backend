/**
 * CT Work — dashboard "Project overview" mặc định (UX-B, 10/10/2026). Tách riêng (chỉ phụ thuộc Prisma) để
 * projects.service gọi được lúc tạo dự án mà không import vòng với search.service.
 */

import { randomUUID } from 'node:crypto';
import { Prisma, type PrismaClient } from '@prisma/client';

interface DefaultWidget {
  id: string;
  kind: string;
  title: string;
  size: 'half' | 'full';
  days?: number;
}

export const OVERVIEW_DASHBOARD_NAME = 'Project overview';

/**
 * UX-B: bộ widget của dashboard "Project overview" mặc định. Tiêu đề để TRỐNG ⇒ giao diện hiện tiêu đề mặc định
 * theo ngôn ngữ người xem (WIDGET_META), không chốt cứng tiếng Anh vào DB.
 */
export function overviewWidgets(opts: { scrum: boolean; raid: boolean }): DefaultWidget[] {
  const w = (kind: string, size: 'half' | 'full', extra: Partial<DefaultWidget> = {}): DefaultWidget => ({ id: randomUUID().slice(0, 8), kind, title: '', size, ...extra });
  return [
    w('kpis', 'full'),
    ...(opts.scrum ? [w('burndown', 'half')] : [w('throughput', 'half')]),
    w('cfd', 'half', { days: 30 }),
    ...(opts.scrum ? [w('throughput', 'half')] : [w('aging_wip', 'half')]),
    w('workload', 'half'),
    w('overdue', 'half'),
    ...(opts.raid ? [w('top_risks', 'half')] : [w('created_resolved', 'half', { days: 30 })]),
  ];
}

/** Tạo dashboard "Project overview" (dùng khi tạo dự án và cho nút "Create project overview" ở dự án cũ). */
export async function createOverviewDashboard(
  db: Pick<PrismaClient, 'workDashboard' | 'workProject'> | Prisma.TransactionClient,
  projectId: number, ownerId: number,
) {
  const p = await db.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { type: true, settings: true } });
  const modules = ((p.settings as { modules?: Record<string, boolean> } | null)?.modules) ?? {};
  return db.workDashboard.create({
    data: {
      projectId, ownerId, name: OVERVIEW_DASHBOARD_NAME, shared: true,
      widgets: overviewWidgets({ scrum: p.type === 'SCRUM', raid: !!modules.raid }) as unknown as Prisma.InputJsonValue,
    },
    select: { id: true, name: true, shared: true, ownerId: true, widgets: true, updatedAt: true },
  });
}

