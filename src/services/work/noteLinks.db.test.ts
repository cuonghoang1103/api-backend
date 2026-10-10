/**
 * Cầu nối Notes ↔ CT Work — kiểm quyền + ràng buộc duy nhất trên Postgres thật:
 *   WORK_DB_TEST=1 npx tsx --test src/services/work/noteLinks.db.test.ts
 *
 * Kịch bản: owner (thành viên dự án) + stranger (ngoài dự án), mỗi người một ghi
 * chú riêng. Kiểm:
 *   - owner nối ghi chú của mình với thẻ thấy được ⇒ OK; nối lại ⇒ idempotent (ràng buộc duy nhất).
 *   - owner KHÔNG nối được ghi chú của người khác (404) — kiểm quyền đầu GHI CHÚ.
 *   - stranger KHÔNG thấy thẻ ⇒ list/link/resolve đều 404/null — kiểm quyền đầu THẺ.
 *   - "Ghi chú liên kết" trên thẻ CHỈ hiện ghi chú của người gọi (ghi chú riêng tư).
 *   - resolveIssueChip trả màu trạng thái + URL; mất quyền ⇒ null.
 *   - syncNoteIssueLinks (đồng bộ khi lưu) tạo/gỡ theo chip, và KHÔNG tạo liên kết tới thẻ ngoài tầm thấy.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { errorHandler } from '../../middleware/errorHandler.js';
import * as noteLinks from './noteLinks.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `nlk${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('Notes ↔ CT Work — liên kết hai chiều (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, stranger: U;
  let wsId = 0, pid = 0, projectKey = '', wsSlug = '';
  let issueNum = 0, issueId = 0;
  let ownerNoteId = 0, strangerNoteId = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const username = `${tag}_${name}`;
    const u = await prisma.user.create({ data: { username, email, displayName: name } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json: any = await res.json().catch(() => ({}));
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json };
  }
  async function mkNote(u: U, title: string): Promise<number> {
    const subject = await prisma.noteSubject.create({ data: { userId: u.id, name: `${tag}-sub` } });
    const note = await prisma.note.create({ data: { userId: u.id, subjectId: subject.id, title } });
    return note.id;
  }

  before(async () => {
    const { default: workRoutes } = await import('../../routes/work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, stranger] = await Promise.all(['owner', 'stranger'].map(mkUser));

    wsId = (await call(owner, 'POST', '/workspaces', { name: `NLK ${tag}` })).data.id;
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'NL', name: 'Note Link', type: 'SCRUM' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    const cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    projectKey = cfg.key;
    wsSlug = cfg.workspace?.slug ?? (await prisma.workSpace.findUniqueOrThrow({ where: { id: wsId }, select: { slug: true } })).slug;
    const taskType = cfg.issueTypes.find((t: any) => t.key === 'TASK') ?? cfg.issueTypes.find((t: any) => t.level === 0);
    const issue = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: taskType.id, title: 'Thiết kế màn đăng nhập' });
    assert.equal(issue.status, 201, JSON.stringify(issue.raw));
    issueNum = issue.data.number;
    issueId = (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: issueNum } })).id;

    ownerNoteId = await mkNote(owner, 'Ghi chú của owner');
    strangerNoteId = await mkNote(stranger, 'Ghi chú của stranger');
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('owner nối ghi chú CỦA MÌNH với thẻ thấy được ⇒ OK; nối lại idempotent (ràng buộc duy nhất)', async () => {
    const r1 = await call(owner, 'POST', `/projects/${pid}/issues/${issueNum}/notes`, { noteId: ownerNoteId });
    assert.equal(r1.status, 201, JSON.stringify(r1.raw));
    assert.equal(r1.data.notes.length, 1);
    assert.equal(r1.data.notes[0].id, ownerNoteId);
    assert.equal(r1.data.notes[0].url, `/notes?note=${ownerNoteId}`);

    const r2 = await call(owner, 'POST', `/projects/${pid}/issues/${issueNum}/notes`, { noteId: ownerNoteId });
    assert.equal(r2.status, 201, JSON.stringify(r2.raw));
    assert.equal(r2.data.notes.length, 1, 'không tạo bản trùng');
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { workIssueId: issueId } }), 1);
  });

  it('owner KHÔNG nối được ghi chú của người khác (404) — kiểm quyền đầu GHI CHÚ', async () => {
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${issueNum}/notes`, { noteId: strangerNoteId });
    assert.equal(r.status, 404, JSON.stringify(r.raw));
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { noteId: strangerNoteId } }), 0);
  });

  it('stranger KHÔNG thấy thẻ ⇒ list + link + resolve đều chặn — kiểm quyền đầu THẺ', async () => {
    assert.equal((await call(stranger, 'GET', `/projects/${pid}/issues/${issueNum}/notes`)).status, 404);
    const link = await call(stranger, 'POST', `/projects/${pid}/issues/${issueNum}/notes`, { noteId: strangerNoteId });
    assert.equal(link.status, 404, JSON.stringify(link.raw));
    // resolveIssueChip trực tiếp: stranger ⇒ null.
    assert.equal(await noteLinks.resolveIssueChip(stranger.id, issueId), null);
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { noteId: strangerNoteId } }), 0);
  });

  it('"Ghi chú liên kết" trên thẻ CHỈ hiện ghi chú của người gọi (riêng tư)', async () => {
    // stranger không phải thành viên ⇒ 404 ở trên. Thêm stranger vào KHÔNG GIAN (workMember) rồi làm VIEWER dự án
    // — loadProjectAccess đòi CẢ workspaceRole lẫn projectRole; thiếu workMember thì vẫn 404.
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: stranger.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: stranger.id, role: 'VIEWER' } });
    const sLink = await call(stranger, 'POST', `/projects/${pid}/issues/${issueNum}/notes`, { noteId: strangerNoteId });
    assert.equal(sLink.status, 201, JSON.stringify(sLink.raw));
    // owner vẫn chỉ thấy ghi chú của owner; stranger chỉ thấy của stranger.
    const ownerView = await call(owner, 'GET', `/projects/${pid}/issues/${issueNum}/notes`);
    assert.deepEqual(ownerView.data.notes.map((n: any) => n.id), [ownerNoteId]);
    const strangerView = await call(stranger, 'GET', `/projects/${pid}/issues/${issueNum}/notes`);
    assert.deepEqual(strangerView.data.notes.map((n: any) => n.id), [strangerNoteId]);
    // Tổng hai liên kết tới cùng thẻ (mỗi người một).
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { workIssueId: issueId } }), 2);
  });

  it('resolveIssueChip trả màu trạng thái + URL cho người thấy thẻ', async () => {
    const chip = await noteLinks.resolveIssueChip(owner.id, issueId);
    assert.ok(chip, 'owner thấy thẻ');
    assert.equal(chip!.key, `${projectKey}-${issueNum}`);
    assert.equal(chip!.url, `/work/${wsSlug}/${projectKey}/issue/${issueNum}`);
    assert.match(chip!.statusColor, /^#/);
    assert.equal(chip!.title, 'Thiết kế màn đăng nhập');
  });

  it('searchIssuesForNote ra thẻ cho owner (bộ chọn chip)', async () => {
    const hits = await noteLinks.searchIssuesForNote(owner.id, 'đăng nhập', 10);
    assert.ok(hits.some((h) => h.id === issueId && h.key === `${projectKey}-${issueNum}`));
  });

  it('syncNoteIssueLinks: tạo/gỡ theo chip, và KHÔNG tạo liên kết tới thẻ ngoài tầm thấy', async () => {
    // Gỡ hết liên kết của owner để bắt đầu sạch.
    await prisma.noteWorkIssueLink.deleteMany({ where: { noteId: ownerNoteId } });
    const docWith = { type: 'doc', content: [{ type: 'ctworkIssue', attrs: { issueId } }] };
    await noteLinks.syncNoteIssueLinks(owner.id, ownerNoteId, docWith);
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { noteId: ownerNoteId, workIssueId: issueId } }), 1, 'tạo theo chip');

    // Lưu lại không còn chip ⇒ gỡ.
    await noteLinks.syncNoteIssueLinks(owner.id, ownerNoteId, { type: 'doc', content: [{ type: 'paragraph' }] });
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { noteId: ownerNoteId } }), 0, 'gỡ khi chip biến mất');

    // Chip trỏ tới id thẻ KHÔNG tồn tại ⇒ không tạo rác.
    await noteLinks.syncNoteIssueLinks(owner.id, ownerNoteId, { type: 'doc', content: [{ type: 'ctworkIssue', attrs: { issueId: 999_000_111 } }] });
    assert.equal(await prisma.noteWorkIssueLink.count({ where: { noteId: ownerNoteId } }), 0, 'không tạo liên kết tới thẻ không thấy');
  });
});
