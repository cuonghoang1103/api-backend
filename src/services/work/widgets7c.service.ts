/**
 * CT Work đợt 7c (C3) — số liệu cho các widget dashboard mới:
 *   test_pass_rate      — tỉ lệ đạt theo test cycle gần nhất (+ lần nhập CI) và xu hướng
 *   defects_by_severity — bug CÒN MỞ theo mức nghiêm trọng (sổ defect đợt 4)
 *   license_expiring    — tài sản/giấy phép sắp hoặc đã hết hạn (assets.service.ts)
 *   my_timer            — đồng hồ đang chạy của tôi (đợt 7a, /me/timer) + giờ tôi đã ghi hôm nay / tuần này ở dự án này
 *   okr                 — đọc thẳng API OKR của đợt 7a (GET /projects/:pid/okrs) ở phía giao diện, không có số liệu ở đây.
 */

import { prisma } from '../../config/database.js';
import { requireProject } from './permissions.js';
import { expiringAssets } from './assets.service.js';

const EXECUTED = new Set(['PASS', 'FAIL', 'BLOCKED']);

export async function testPassRate(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const cycles = await prisma.workTestCycle.findMany({
    where: { projectId }, orderBy: { createdAt: 'desc' }, take: 10,
    select: { id: true, name: true, state: true, createdAt: true, runs: { select: { status: true } } },
  });
  const points = cycles.reverse().map((c) => {
    const executed = c.runs.filter((r) => EXECUTED.has(r.status)).length;
    const pass = c.runs.filter((r) => r.status === 'PASS').length;
    return { id: c.id, name: c.name, state: c.state, at: c.createdAt, total: c.runs.length, executed, pass, fail: c.runs.filter((r) => r.status === 'FAIL').length, passRate: executed ? Math.round((pass / executed) * 100) : null };
  });
  const last = [...points].reverse().find((p) => p.passRate !== null) ?? null;
  const flaky = await prisma.workAutoTest.count({ where: { projectId, flaky: true } });
  return { points, last, flaky };
}

export async function defectsBySeverity(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const bugs = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, resolvedAt: null, type: { key: 'BUG' } },
    select: { id: true, defectInfo: { select: { severity: true } } },
    take: 5000,
  });
  const order = ['CRITICAL', 'MAJOR', 'MINOR', 'TRIVIAL', 'UNSET'] as const;
  const counts: Record<(typeof order)[number], number> = { CRITICAL: 0, MAJOR: 0, MINOR: 0, TRIVIAL: 0, UNSET: 0 };
  for (const b of bugs) {
    const s = (b.defectInfo?.severity ?? 'UNSET') as (typeof order)[number];
    counts[order.includes(s) ? s : 'UNSET'] += 1;
  }
  return { total: bugs.length, groups: order.map((k) => ({ severity: k, count: counts[k] })) };
}

export async function licenseExpiring(userId: number, projectId: number) {
  return { items: await expiringAssets(userId, projectId, 60) };
}

export async function myTime(userId: number, projectId: number, now = new Date()) {
  await requireProject(userId, projectId, 'project.view');
  // Ngày/tuần theo giờ VN (+07) — như báo cáo thời gian của dự án.
  const vn = new Date(now.getTime() + 7 * 3600_000);
  const dayStart = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - 7 * 3600_000);
  const dow = (vn.getUTCDay() + 6) % 7; // thứ Hai = 0
  const weekStart = new Date(dayStart.getTime() - dow * 86_400_000);
  const logs = await prisma.workWorklog.findMany({
    where: { userId, startedAt: { gte: weekStart }, issue: { projectId, deletedAt: null } },
    select: { minutes: true, startedAt: true },
  });
  const week = logs.reduce((a, l) => a + l.minutes, 0);
  const today = logs.filter((l) => l.startedAt >= dayStart).reduce((a, l) => a + l.minutes, 0);
  return { todayMinutes: today, weekMinutes: week };
}
