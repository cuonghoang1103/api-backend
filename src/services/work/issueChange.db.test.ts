/**
 * Test CHẠY THẬT trên Postgres cục bộ — không mock. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/services/work/issueChange.db.test.ts
 *
 * Không nằm trong `npm test` vì CI không có DB. Dọn dẹp theo ĐÚNG id đã tạo
 * (xoá user ⇒ cascade không gian, dự án, thẻ), không xoá theo mẫu tên.
 */

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '../../config/database.js';
import { applyIssueChange, createIssue, moveIssue } from './issueChange.js';
import { loadProjectAccess, requireProject } from './permissions.js';
import { seedProjectConfig } from './templates.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wt${Date.now().toString(36)}`;
const userIds: number[] = [];

async function mkUser(name: string) {
  const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email: `${tag}_${name}@test.local` } });
  userIds.push(u.id);
  return u.id;
}

describe('CT Work — issueChange trên DB thật', { skip: !RUN }, () => {
  let owner: number, member: number, viewer: number, teacher: number, outsider: number;
  let projectId: number;
  const type: Record<string, number> = {};
  const status: Record<string, number> = {};
  const bugStatus: Record<string, number> = {};
  const actor = () => ({ kind: 'USER' as const, userId: member });

  before(async () => {
    owner = await mkUser('owner');
    member = await mkUser('member');
    viewer = await mkUser('viewer');
    teacher = await mkUser('teacher');
    outsider = await mkUser('outsider');

    const ws = await prisma.workSpace.create({
      data: {
        name: 'Test space', slug: tag, ownerId: owner,
        members: { create: [
          { userId: owner, role: 'OWNER' }, { userId: member, role: 'MEMBER' },
          { userId: viewer, role: 'MEMBER' }, { userId: teacher, role: 'GUEST' },
        ] },
      },
    });
    const p = await prisma.$transaction(async (tx) => {
      const proj = await tx.workProject.create({ data: { workspaceId: ws.id, key: 'SWP', name: 'Demo', template: 'SWP391' } });
      await tx.workProjectMember.createMany({ data: [
        { projectId: proj.id, userId: viewer, role: 'VIEWER' },
        { projectId: proj.id, userId: teacher, role: 'TEACHER' },
      ] });
      await seedProjectConfig(tx, proj.id, 'SWP391', 'SCRUM');
      return proj;
    });
    projectId = p.id;
    for (const t of await prisma.workIssueType.findMany({ where: { projectId } })) type[t.key] = t.id;
    for (const wf of await prisma.workWorkflow.findMany({ where: { projectId }, include: { statuses: true } })) {
      for (const st of wf.statuses) (wf.isDefault ? status : bugStatus)[st.name] = st.id;
    }
  });

  after(async () => {
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('vai trò hiệu lực đọc từ DB đúng như bảng quyền', async () => {
    assert.equal((await loadProjectAccess(owner, projectId))?.role, 'ADMIN');
    assert.equal((await loadProjectAccess(member, projectId))?.role, 'MEMBER');
    assert.equal((await loadProjectAccess(viewer, projectId))?.role, 'VIEWER');
    assert.equal((await loadProjectAccess(teacher, projectId))?.role, 'TEACHER');
    assert.equal(await loadProjectAccess(outsider, projectId), null);
    await assert.rejects(requireProject(outsider, projectId, 'project.view'), { statusCode: 404 });
    await assert.rejects(requireProject(viewer, projectId, 'issue.edit'), { statusCode: 403 });
  });

  it('20 lệnh tạo thẻ cùng lúc: số 1..20 không trùng, rank không trùng', async () => {
    const made = await Promise.all(
      Array.from({ length: 20 }, (_, i) => createIssue({ projectId, typeId: type.TASK, title: `Task ${i}` }, actor())),
    );
    const numbers = made.map((m) => m.number).sort((a, b) => a - b);
    assert.deepEqual(numbers, Array.from({ length: 20 }, (_, i) => i + 1));
    assert.equal(new Set(made.map((m) => m.rank)).size, 20);
    const proj = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId } });
    assert.equal(proj.issueCounter, 20);
  });

  it('thẻ mới vào cột đầu, người báo tự theo dõi, có dòng lịch sử "created"', async () => {
    const i = await createIssue({ projectId, typeId: type.STORY, title: '  Login with Google  ' }, actor());
    assert.equal(i.title, 'Login with Google');
    assert.equal(i.statusId, status['To Do']);
    assert.equal(i.reporterId, member);
    assert.equal(await prisma.workWatcher.count({ where: { issueId: i.id, userId: member } }), 1);
    assert.equal(await prisma.workHistory.count({ where: { issueId: i.id, field: 'created' } }), 1);
  });

  it('không giao việc được cho giảng viên hay người ngoài', async () => {
    await assert.rejects(createIssue({ projectId, typeId: type.TASK, title: 'x', assigneeId: teacher }, actor()), /cannot be assigned/);
    await assert.rejects(createIssue({ projectId, typeId: type.TASK, title: 'x', assigneeId: outsider }, actor()), /cannot be assigned/);
  });

  it('phân cấp: sub-task cần cha là story/task; epic không có cha', async () => {
    const epic = await createIssue({ projectId, typeId: type.EPIC, title: 'Auth' }, actor());
    const story = await createIssue({ projectId, typeId: type.STORY, title: 'Sign up', parentId: epic.id }, actor());
    await createIssue({ projectId, typeId: type.SUBTASK, title: 'API', parentId: story.id }, actor());
    await assert.rejects(createIssue({ projectId, typeId: type.SUBTASK, title: 'x' }, actor()), /needs a parent/);
    await assert.rejects(createIssue({ projectId, typeId: type.SUBTASK, title: 'x', parentId: epic.id }, actor()), /must belong/);
    await assert.rejects(createIssue({ projectId, typeId: type.EPIC, title: 'x', parentId: epic.id }, actor()), /epic cannot have a parent/);
  });

  it('sửa thẻ ghi lịch sử từng trường, tăng version; version cũ ⇒ 409', async () => {
    const i = await createIssue({ projectId, typeId: type.TASK, title: 'Edit me' }, actor());
    const r = await applyIssueChange(i.id, { title: 'Edited', priority: 1, assigneeId: member }, actor(), { expectedVersion: 0 });
    assert.equal(r.issue.version, 1);
    const fields = (await prisma.workHistory.findMany({ where: { issueId: i.id, field: { not: 'created' } } })).map((h) => h.field).sort();
    assert.deepEqual(fields, ['assigneeId', 'priority', 'title']);
    await assert.rejects(applyIssueChange(i.id, { title: 'Stale' }, actor(), { expectedVersion: 0 }), { statusCode: 409 });
    // Không đổi gì thì không ghi lịch sử, không tăng version.
    const same = await applyIssueChange(i.id, { title: 'Edited' }, actor());
    assert.equal(same.changes.length, 0);
    assert.equal(same.issue.version, 1);
  });

  it('vào cột Done thì có resolvedAt, rời Done thì mất', async () => {
    const i = await createIssue({ projectId, typeId: type.TASK, title: 'Finish' }, actor());
    const done = await applyIssueChange(i.id, { statusId: status.Done }, actor());
    assert.ok(done.issue.resolvedAt);
    const back = await applyIssueChange(i.id, { statusId: status['In Progress'] }, actor());
    assert.equal(back.issue.resolvedAt, null);
  });

  it('vòng đời Bug: không nhảy Fixed → Closed khi chưa Retest', async () => {
    const bug = await createIssue({ projectId, typeId: type.BUG, title: 'Crash on save' }, actor());
    assert.equal(bug.statusId, bugStatus.Open);
    await assert.rejects(applyIssueChange(bug.id, { statusId: status.Done }, actor()), /does not belong/);
    await applyIssueChange(bug.id, { statusId: bugStatus['In Progress'] }, actor());
    await applyIssueChange(bug.id, { statusId: bugStatus.Fixed }, actor());
    await assert.rejects(applyIssueChange(bug.id, { statusId: bugStatus.Closed }, actor()), /not allowed by the workflow/);
    await applyIssueChange(bug.id, { statusId: bugStatus.Retest }, actor());
    const closed = await applyIssueChange(bug.id, { statusId: bugStatus.Closed }, actor());
    assert.ok(closed.issue.resolvedAt);
  });

  it('kéo thả: thả giữa hai thẻ thì rank nằm giữa', async () => {
    const [a, b, c] = await Promise.all(['A', 'B', 'C'].map(async (t, i) => {
      await new Promise((r) => setTimeout(r, i * 20));
      return createIssue({ projectId, typeId: type.TASK, title: `Drag ${t}` }, actor());
    }));
    const sorted = [a, b, c].sort((x, y) => (x.rank < y.rank ? -1 : 1));
    const moved = await moveIssue(sorted[2].id, { beforeIssueId: sorted[0].id, afterIssueId: sorted[1].id }, actor());
    assert.ok(moved.issue.rank > sorted[0].rank && moved.issue.rank < sorted[1].rank);
    // Hàng xóm sai thứ tự = board cũ ⇒ 409.
    await assert.rejects(moveIssue(sorted[0].id, { beforeIssueId: sorted[1].id, afterIssueId: moved.issue.id }, actor()), { statusCode: 409 });
  });

  it('sprint: việc con đi theo sprint của cha; sprint đã đóng không nhận thẻ', async () => {
    const sp = await prisma.workSprint.create({ data: { projectId, name: 'Sprint 1' } });
    const story = await createIssue({ projectId, typeId: type.STORY, title: 'Cart' }, actor());
    const sub = await createIssue({ projectId, typeId: type.SUBTASK, title: 'Cart API', parentId: story.id }, actor());
    await applyIssueChange(story.id, { sprintId: sp.id }, actor());
    assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: sub.id } })).sprintId, sp.id);
    await assert.rejects(applyIssueChange(sub.id, { sprintId: null }, actor()), /Move the parent/);
    const closed = await prisma.workSprint.create({ data: { projectId, name: 'Old', state: 'CLOSED' } });
    await assert.rejects(applyIssueChange(story.id, { sprintId: closed.id }, actor()), /closed sprint/);
  });
});
