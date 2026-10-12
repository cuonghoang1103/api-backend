/**
 * Test CHẠY THẬT trên Postgres cục bộ — không mock. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/services/work/submitGate.db.test.ts
 *
 * Cổng NỘP BÀI: mặc định tắt (không chặn); hard + thiếu đính kèm ⇒ chặn Done;
 * có đính kèm ⇒ qua; trang gom submissions trả đúng người/đếm/đúng giờ.
 * Dọn theo đúng id đã tạo (xoá user ⇒ cascade không gian/dự án/thẻ).
 */

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '../../config/database.js';
import { createIssue, applyIssueChange } from './issueChange.js';
import { seedProjectConfig } from './templates.js';
import { updateProject } from './projects.service.js';
import { listSubmissions, submitGateOf, cleanSubmitGate, DEFAULT_SUBMIT_GATE } from './submitGate.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `sg${Date.now().toString(36)}`;
const userIds: number[] = [];

async function mkUser(name: string) {
  const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email: `${tag}_${name}@test.local` } });
  userIds.push(u.id);
  return u.id;
}

async function attach(issueId: number, uploaderId: number, fileName: string) {
  return prisma.workAttachment.create({
    data: { issueId, uploaderId, r2Key: `work/test/${tag}/${fileName}`, fileName, mime: 'image/png', size: 123 },
  });
}

describe('CT Work — cổng nộp bài (submitGate) trên DB thật', { skip: !RUN }, () => {
  let owner: number, member: number;
  let projectId: number;
  const type: Record<string, number> = {};
  const status: Record<string, number> = {};
  const actor = () => ({ kind: 'USER' as const, userId: member });

  before(async () => {
    owner = await mkUser('owner');
    member = await mkUser('member');
    const ws = await prisma.workSpace.create({
      data: { name: 'SG space', slug: tag, ownerId: owner, members: { create: [{ userId: owner, role: 'OWNER' }, { userId: member, role: 'MEMBER' }] } },
    });
    const p = await prisma.$transaction(async (tx) => {
      const proj = await tx.workProject.create({ data: { workspaceId: ws.id, key: 'SG', name: 'Submit demo', template: 'SWP391' } });
      await seedProjectConfig(tx, proj.id, 'SWP391', 'SCRUM');
      return proj;
    });
    projectId = p.id;
    for (const t of await prisma.workIssueType.findMany({ where: { projectId } })) type[t.key] = t.id;
    for (const wf of await prisma.workWorkflow.findMany({ where: { projectId, isDefault: true }, include: { statuses: true } })) {
      for (const st of wf.statuses) status[st.name] = st.id;
    }
  });

  after(async () => {
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('đọc cấu hình: mặc định TẮT; chuẩn hoá min 1–20 và mode', () => {
    assert.deepEqual(submitGateOf(null), DEFAULT_SUBMIT_GATE);
    assert.deepEqual(submitGateOf({ submitGate: { enabled: true, mode: 'hard', minAttachments: 99 } }), { enabled: true, mode: 'hard', minAttachments: 20, typeKeys: null });
    assert.deepEqual(cleanSubmitGate({ enabled: 'yes', mode: 'xxx', minAttachments: 0 }), { enabled: false, mode: 'soft', minAttachments: 1, typeKeys: null });
    assert.deepEqual(cleanSubmitGate({ enabled: true, typeKeys: ['TASK', 'STORY'] }).typeKeys, ['TASK', 'STORY']);
  });

  it('tắt cổng ⇒ Done tự do (không chặn)', async () => {
    const i = await createIssue({ projectId, typeId: type.TASK, title: 'No gate', assigneeId: member }, actor());
    const done = await applyIssueChange(i.id, { statusId: status.Done }, actor());
    assert.equal(done.issue.statusId, status.Done);
  });

  it('cổng HARD + thiếu đính kèm ⇒ chặn Done; có đính kèm ⇒ qua', async () => {
    await updateProject(owner, projectId, { settings: { submitGate: { enabled: true, mode: 'hard', minAttachments: 1 } } });
    const i = await createIssue({ projectId, typeId: type.TASK, title: 'Need file', assigneeId: member }, actor());
    await assert.rejects(applyIssueChange(i.id, { statusId: status.Done }, actor()), /Chưa nộp bài|cổng nộp bài/i);
    await attach(i.id, member, 'proof.png');
    const done = await applyIssueChange(i.id, { statusId: status.Done }, actor());
    assert.equal(done.issue.statusId, status.Done);
  });

  it('cổng SOFT ⇒ backend KHÔNG chặn (frontend lo)', async () => {
    await updateProject(owner, projectId, { settings: { submitGate: { enabled: true, mode: 'soft', minAttachments: 1 } } });
    const i = await createIssue({ projectId, typeId: type.TASK, title: 'Soft', assigneeId: member }, actor());
    const done = await applyIssueChange(i.id, { statusId: status.Done }, actor());
    assert.equal(done.issue.statusId, status.Done);
  });

  it('trang gom: theo người, đếm tệp, cờ submitted/đúng giờ', async () => {
    const res = await listSubmissions(owner, projectId);
    const me = res.members.find((m) => m.username === `${tag}_member`);
    assert.ok(me, 'phải có người nhận trong danh sách');
    assert.ok(me!.total >= 3);
    const withFile = me!.items.find((x) => x.title === 'Need file');
    assert.ok(withFile && withFile.submitted && withFile.attachmentCount === 1);
    assert.equal(res.canConfig, true); // owner = ADMIN
  });
});
