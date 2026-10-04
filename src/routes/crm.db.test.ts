/**
 * CRM nhẹ (CT Work đợt S5b) — qua HTTP thật trên Postgres cục bộ. Không có CSDL ⇒ TỰ BỎ QUA
 * (cùng khuôn src/services/mfa/mfa.db.test.ts).
 *   npx tsx --test src/routes/crm.db.test.ts
 *
 * Trọng tâm: phiếu ⇒ contact/org/deal (ghép email), cổng go/no-go, đồng bộ phiếu ↔ deal hai chiều,
 * đề xuất từ mẫu ⇒ gửi ⇒ khách Accept (hash + IP + thời điểm, không trả lời lần hai, hash sai bị chặn),
 * bản mới thu hồi link cũ, WON ⇒ dự án CT Work CLIENT (có phiếu / phiếu nội bộ), khoá deal sau khi có dự án,
 * nhắc việc tới hạn đúng một lần, xuất + ẩn danh contact (giữ số liệu deal), chỉ ADMIN.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { closeRedis } from '../config/redis.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { createProjectRequest } from '../services/projectRequest.service.js';
import * as crm from '../services/crm/crm.service.js';

async function coCsdl(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1 FROM "crm_deals" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

const RUN = await coCsdl();
const tag = `crm${Date.now().toString(36)}`;
const userIds: number[] = [];
const requestIds: number[] = [];
const dealIds: number[] = [];
const contactIds: number[] = [];
const orgIds: number[] = [];
const activityIds: number[] = [];
const workspaceIds = new Set<number>();

type U = { id: number; token: string; email: string };

describe('CRM S5b (HTTP + DB thật)', { skip: !RUN ? 'không có CSDL' : false }, () => {
  let base = '';
  let server: import('node:http').Server;
  let admin: U;
  let user: U;

  async function mkUser(name: string, isAdmin: boolean): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    if (isAdmin) {
      const role = await prisma.role.findFirstOrThrow({ where: { name: 'ROLE_ADMIN' } });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: isAdmin ? ['ADMIN'] : [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, headers: res.headers };
  }

  async function newRequest(over: Record<string, unknown> = {}) {
    const r = await createProjectRequest({
      name: 'Nguyễn Thử', email: `${tag}_khach@Test.Local`, phone: '0900000000', organization: `Công ty ${tag}`,
      senderRole: 'CTO', productTypes: ['WEB'], needs: 'Cần một hệ thống học trực tuyến cho nhân viên nội bộ.',
      source: 'about/nhan-du-an#goi=lms', consentVersion: '2026-10-01b', ...over,
    } as never, { ip: '127.0.0.9', userAgent: 'test', isRoleplay: true });
    requestIds.push(r.id);
    return r;
  }
  const all2 = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), 2]));

  before(async () => {
    const { adminCrmRouter, publicProposalRouter } = await import('./crm.routes.js');
    const { adminProjectRequestRouter } = await import('./projectRequest.routes.js');
    const app = express();
    app.set('trust proxy', true);
    app.use(express.json());
    app.use('/api/v1/admin/crm', adminCrmRouter);
    app.use('/api/v1/admin/project-requests', adminProjectRequestRouter);
    app.use('/api/v1/proposals', publicProposalRouter);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    admin = await mkUser('admin', true);
    user = await mkUser('user', false);
  });

  after(async () => {
    server?.close();
    const deals = await prisma.crmDeal.findMany({
      where: { OR: [{ id: { in: dealIds } }, { projectRequestId: { in: requestIds } }, { contactId: { in: contactIds } }] },
      select: { id: true, projectRequestId: true, contactId: true, orgId: true },
    });
    for (const d of deals) {
      if (d.projectRequestId) requestIds.push(d.projectRequestId);
      if (d.contactId) contactIds.push(d.contactId);
      if (d.orgId) orgIds.push(d.orgId);
    }
    const reqs = await prisma.projectRequest.findMany({ where: { id: { in: requestIds } }, select: { workProject: { select: { workspaceId: true } } } });
    for (const r of reqs) if (r.workProject) workspaceIds.add(r.workProject.workspaceId);
    const allDealIds = [...new Set([...dealIds, ...deals.map((d) => d.id)])];
    await prisma.adminNotification.deleteMany({ where: { OR: [{ entityId: { in: [...allDealIds, ...activityIds] }, khoaChongTrung: { startsWith: 'CRM_' } }] } });
    await prisma.crmActivity.deleteMany({ where: { OR: [{ dealId: { in: allDealIds } }, { contactId: { in: contactIds } }, { id: { in: activityIds } }] } });
    await prisma.crmDeal.deleteMany({ where: { id: { in: allDealIds } } });
    await prisma.crmContact.deleteMany({ where: { id: { in: contactIds } } });
    await prisma.crmOrganization.deleteMany({ where: { OR: [{ id: { in: orgIds } }, { name: { contains: tag } }] } });
    await prisma.projectRequest.deleteMany({ where: { id: { in: requestIds } } });
    if (workspaceIds.size) await prisma.workSpace.deleteMany({ where: { id: { in: [...workspaceIds] } } });
    const ownWs = await prisma.workSpace.findMany({ where: { members: { some: { userId: { in: userIds }, role: 'OWNER' } } }, select: { id: true } });
    if (ownWs.length) await prisma.workSpace.deleteMany({ where: { id: { in: ownWs.map((w) => w.id) } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect().catch(() => {});
    await closeRedis().catch(() => {});
  });

  let dealA = 0;
  let dealB = 0;

  it('chỉ ADMIN; phiếu mới ⇒ contact + org + deal LEAD (ghép email không phân biệt hoa thường)', async () => {
    assert.equal((await call(user, 'GET', '/admin/crm/pipeline')).status, 403);
    assert.equal((await call(null, 'GET', '/admin/crm/pipeline')).status, 401);

    const r1 = await newRequest();
    dealA = (await crm.ensureDealForRequest(r1.id))!;
    assert.ok(dealA);
    assert.equal(await crm.ensureDealForRequest(r1.id), dealA, 'idempotent');
    const d = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA }, include: { contact: true, org: true } });
    assert.equal(d.stage, 'LEAD');
    assert.equal(d.packageId, 'lms');
    assert.equal(d.isRoleplay, true);
    assert.equal(d.contact!.email, `${tag}_khach@test.local`);
    assert.equal(d.contact!.consent, true);
    assert.match(d.contact!.consentSource!, /project-request:YC-/);

    const r2 = await newRequest({ email: `${tag}_KHACH@test.local`, organization: `CÔNG TY ${tag}`.toLowerCase(), source: 'about/nhan-du-an' });
    dealB = (await crm.ensureDealForRequest(r2.id))!;
    const d2 = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealB } });
    assert.equal(d2.contactId, d.contactId, 'cùng người liên hệ');
    assert.equal(d2.orgId, d.orgId, 'cùng tổ chức');

    const p = await call(admin, 'GET', '/admin/crm/pipeline?roleplay=only');
    assert.equal(p.status, 200, JSON.stringify(p.raw));
    assert.ok(p.data.deals.some((x: any) => x.id === dealA && x.stage === 'LEAD'));
    assert.equal(p.headers.get('cache-control'), 'no-store');
  });

  it('cổng go/no-go + đồng bộ deal ⇒ phiếu', async () => {
    const bad = await call(admin, 'POST', `/admin/crm/deals/${dealA}/stage`, { stage: 'DISCOVERY' });
    assert.equal(bad.code, 'CRM_QUALIFICATION_REQUIRED');
    const q = await call(admin, 'POST', `/admin/crm/deals/${dealA}/stage`, { stage: 'QUALIFIED' });
    assert.equal(q.status, 200);
    const d = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA }, include: { projectRequest: true } });
    assert.equal(d.projectRequest!.status, 'QUALIFYING');

    const hard = await call(admin, 'PUT', `/admin/crm/deals/${dealA}/qualification`, { scores: { ...all2, 9: 0 }, decision: 'GO' });
    assert.equal(hard.code, 'CRM_HARD_FAIL');
    const go = await call(admin, 'PUT', `/admin/crm/deals/${dealA}/qualification`, { scores: all2, decision: 'GO', reason: 'Phù hợp', risks: 'R1 dữ liệu' });
    assert.equal(go.status, 200, JSON.stringify(go.raw));
    assert.equal(go.data.qualification.decision, 'GO');
    assert.equal(go.data.qualificationScore.total, 20);
    assert.ok(go.data.activities.some((a: any) => /Go\/no-go: GO/.test(a.subject)));

    const lost = await call(admin, 'POST', `/admin/crm/deals/${dealB}/stage`, { stage: 'LOST' });
    assert.equal(lost.code, 'CRM_LOST_REASON_REQUIRED');
  });

  it('phiếu ⇒ deal: admin từ chối phiếu ở /admin/project-requests ⇒ deal LOST', async () => {
    const d = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealB } });
    const res = await call(admin, 'PATCH', `/admin/project-requests/${d.projectRequestId}`, { status: 'DECLINED' });
    assert.equal(res.status, 200, JSON.stringify(res.raw));
    const after = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealB } });
    assert.equal(after.stage, 'LOST');
    assert.match(after.lostReason!, /bị từ chối/);
    // Chi tiết phiếu trỏ ngược về deal.
    const det = await call(admin, 'GET', `/admin/project-requests/${d.projectRequestId}`);
    assert.equal(det.data.crmDeal.id, dealB);
  });

  let token1 = '';
  let hash1 = '';
  it('đề xuất từ mẫu ⇒ gửi ⇒ khách xem ⇒ Accept có hash + IP; đóng băng; không trả lời hai lần', async () => {
    const p = await call(admin, 'POST', `/admin/crm/deals/${dealA}/proposals`, {});
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.equal(p.data.version, 1);
    assert.match(p.data.content, /## 3\. Các phương án/);
    assert.match(p.data.content, /# Báo giá/);
    const ed = await call(admin, 'PATCH', `/admin/crm/proposals/${p.data.id}`, { content: `${p.data.content}\n\nPhạm vi MVP: 3 mô-đun.` });
    assert.equal(ed.status, 200);
    const sent = await call(admin, 'POST', `/admin/crm/proposals/${p.data.id}/send`, { expiresInDays: 14 });
    assert.equal(sent.status, 200, JSON.stringify(sent.raw));
    assert.equal(sent.data.status, 'SENT');
    assert.match(sent.data.url, /\/proposal\/[A-Za-z0-9_-]{20,}$/);
    token1 = sent.data.url.split('/proposal/')[1];
    hash1 = sent.data.contentHash;
    const deal = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA }, include: { projectRequest: true } });
    assert.equal(deal.stage, 'PROPOSAL');
    assert.equal(deal.projectRequest!.status, 'ACCEPTED');

    assert.equal((await call(admin, 'PATCH', `/admin/crm/proposals/${p.data.id}`, { content: 'đổi' })).code, 'CRM_PROPOSAL_FROZEN');

    const pub = await call(null, 'GET', `/proposals/${token1}`);
    assert.equal(pub.status, 200);
    assert.equal(pub.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(pub.data.contentHash, hash1);
    assert.equal(pub.data.integrity, true);
    assert.equal(pub.data.value, undefined, 'không lộ giá trị deal');
    assert.equal((await call(null, 'GET', '/proposals/khong-ton-tai-khong-ton-tai')).status, 404);

    const wrong = await call(null, 'POST', `/proposals/${token1}/respond`, { decision: 'ACCEPT', name: 'Nguyễn Thử', contentHash: '0'.repeat(64) });
    assert.equal(wrong.code, 'PROPOSAL_CHANGED');
    const acc = await call(null, 'POST', `/proposals/${token1}/respond`, { decision: 'ACCEPT', name: 'Nguyễn Thử', note: 'Đồng ý', contentHash: hash1 }, { 'X-Forwarded-For': '203.0.113.7' });
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.equal(acc.data.status, 'ACCEPTED');
    const again = await call(null, 'POST', `/proposals/${token1}/respond`, { decision: 'DECLINE', name: 'Nguyễn Thử', contentHash: hash1 });
    assert.equal(again.code, 'PROPOSAL_ALREADY_RESPONDED');
    const row = await prisma.crmProposal.findUniqueOrThrow({ where: { id: p.data.id } });
    assert.equal(row.responseIp, '203.0.113.7');
    assert.ok(row.respondedAt);
    assert.equal(row.contentHash, hash1);
    assert.equal((await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA } })).stage, 'NEGOTIATION');
    assert.ok(await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `CRM_PROPOSAL:${p.data.id}` } }));

    // Bản 2 (chép từ v1) gửi đi ⇒ link v1 bị thu hồi.
    const v2 = await call(admin, 'POST', `/admin/crm/deals/${dealA}/proposals`, { fromVersion: 1 });
    assert.equal(v2.data.version, 2);
    assert.match(v2.data.content, /\| v2 \|/);
    await call(admin, 'POST', `/admin/crm/proposals/${v2.data.id}/send`, {});
    // v1 đã ACCEPTED nên không bị thu hồi (chỉ thu hồi bản đang SENT); vẫn xem lại được.
    assert.equal((await call(null, 'GET', `/proposals/${token1}`)).status, 200);
    const v3 = await call(admin, 'POST', `/admin/crm/deals/${dealA}/proposals`, { fromVersion: 2 });
    const v2row = await prisma.crmProposal.findUniqueOrThrow({ where: { id: v2.data.id } });
    await call(admin, 'POST', `/admin/crm/proposals/${v3.data.id}/send`, {});
    assert.equal((await call(null, 'GET', `/proposals/${v2row.token}`)).status, 404, 'v2 bị thu hồi khi gửi v3');
  });

  it('WON ⇒ tạo dự án CT Work CLIENT (tái dùng createWorkProjectFromRequest); deal khoá ở WON', async () => {
    assert.equal((await call(admin, 'POST', `/admin/crm/deals/${dealA}/create-work-project`)).code, 'CRM_NOT_WON');
    assert.equal((await call(admin, 'POST', `/admin/crm/deals/${dealA}/stage`, { stage: 'WON' })).status, 200);
    const cw = await call(admin, 'POST', `/admin/crm/deals/${dealA}/create-work-project`);
    assert.equal(cw.status, 201, JSON.stringify(cw.raw));
    const proj = await prisma.workProject.findUniqueOrThrow({ where: { id: cw.data.projectId } });
    workspaceIds.add(proj.workspaceId);
    assert.equal(proj.kind, 'CLIENT');
    const det = await call(admin, 'GET', `/admin/crm/deals/${dealA}`);
    assert.equal(det.data.request.status, 'PROJECT_CREATED');
    assert.equal(det.data.workProject.projectId, proj.id);
    const again = await call(admin, 'POST', `/admin/crm/deals/${dealA}/create-work-project`);
    assert.equal(again.data.alreadyExisted, true);
    assert.equal((await call(admin, 'POST', `/admin/crm/deals/${dealA}/stage`, { stage: 'NEGOTIATION' })).code, 'CRM_DEAL_LOCKED');
  });

  it('deal tạo tay (không phiếu) ⇒ WON ⇒ phiếu NỘI BỘ rồi dự án', async () => {
    const org = await call(admin, 'POST', '/admin/crm/orgs', { name: `Org tay ${tag}`, taxCode: '0101234567' });
    orgIds.push(org.data.id);
    const c = await call(admin, 'POST', '/admin/crm/contacts', { name: 'Trần Tay', email: `${tag}_tay@test.local`, orgId: org.data.id, consent: true, preferredChannel: 'ZALO' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    contactIds.push(c.data.id);
    assert.ok(c.data.consentAt, 'thời điểm đồng ý do hệ thống ghi');
    assert.equal((await call(admin, 'POST', '/admin/crm/deals', { title: 'x', stage: 'PROPOSAL' })).status, 400);
    const d = await call(admin, 'POST', '/admin/crm/deals', { title: `Deal tay ${tag}`, orgId: org.data.id, contactId: c.data.id, packageId: 'app-di-dong', valueAmount: 250_000_000, probability: 30, expectedCloseAt: '2026-12-15' });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    dealIds.push(d.data.id);
    assert.equal(d.data.weighted, 75_000_000);
    await call(admin, 'PUT', `/admin/crm/deals/${d.data.id}/qualification`, { scores: all2, decision: 'GO' });
    await call(admin, 'POST', `/admin/crm/deals/${d.data.id}/stage`, { stage: 'WON' });
    const cw = await call(admin, 'POST', `/admin/crm/deals/${d.data.id}/create-work-project`);
    assert.equal(cw.status, 201, JSON.stringify(cw.raw));
    workspaceIds.add((await prisma.workProject.findUniqueOrThrow({ where: { id: cw.data.projectId } })).workspaceId);
    const req = await prisma.projectRequest.findUniqueOrThrow({ where: { id: cw.data.requestId } });
    requestIds.push(req.id);
    assert.equal(req.source, `crm:deal-${d.data.id}`);
    assert.equal(req.status, 'PROJECT_CREATED');
    assert.deepEqual(req.productTypes, ['APP']);

    const rep = await call(admin, 'GET', '/admin/crm/reports?roleplay=1');
    assert.equal(rep.status, 200);
    assert.equal(rep.data.funnel.length, 6);
    assert.ok(rep.data.won >= 2);
  });

  it('TASK tới hạn ⇒ báo admin đúng một lần; đổi hạn ⇒ báo lại', async () => {
    const t = await call(admin, 'POST', '/admin/crm/activities', { dealId: dealB, type: 'TASK', subject: `Gọi lại ${tag}`, dueAt: new Date(Date.now() - 60_000).toISOString() });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    activityIds.push(t.data.id);
    assert.equal(t.data.done, false);
    await crm.notifyDueTasks();
    const row = await prisma.crmActivity.findUniqueOrThrow({ where: { id: t.data.id } });
    assert.ok(row.notifiedAt);
    const n1 = await prisma.adminNotification.count({ where: { khoaChongTrung: { startsWith: `CRM_TASK:${t.data.id}:` } } });
    await crm.notifyDueTasks();
    assert.equal(await prisma.adminNotification.count({ where: { khoaChongTrung: { startsWith: `CRM_TASK:${t.data.id}:` } } }), n1);
    assert.equal(n1, 1);
    await call(admin, 'PATCH', `/admin/crm/activities/${t.data.id}`, { dueAt: new Date(Date.now() - 1000).toISOString() });
    await crm.notifyDueTasks();
    assert.equal(await prisma.adminNotification.count({ where: { khoaChongTrung: { startsWith: `CRM_TASK:${t.data.id}:` } } }), 2);
    const due = await call(admin, 'GET', '/admin/crm/activities/due');
    assert.ok(due.data.some((a: any) => a.id === t.data.id));
  });

  it('stale: deal mở > 14 ngày không hoạt động', async () => {
    const r = await newRequest({ email: `${tag}_stale@test.local`, organization: null });
    const id = (await crm.ensureDealForRequest(r.id))!;
    await prisma.crmDeal.update({ where: { id }, data: { lastActivityAt: new Date(Date.now() - 20 * 86_400_000) } });
    const l = await call(admin, 'GET', '/admin/crm/deals?stale=1&roleplay=only');
    assert.ok(l.data.items.some((x: any) => x.id === id && x.stale === true));
  });

  it('dữ liệu cá nhân: xuất JSON + ẩn danh (giữ số liệu deal, xoá phiếu chưa thành dự án, giữ phiếu đã thành dự án)', async () => {
    const d = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA } });
    const cid = d.contactId!;
    contactIds.push(cid);
    const ex = await fetch(`${base}/api/v1/admin/crm/contacts/${cid}/export`, { headers: { Authorization: `Bearer ${admin.token}` } });
    assert.equal(ex.status, 200);
    assert.match(ex.headers.get('content-disposition') ?? '', /attachment/);
    const exp = ((await ex.json()) as any).data;
    assert.equal(exp.contact.email, `${tag}_khach@test.local`);
    assert.ok(exp.deals.length >= 2);
    assert.ok(exp.projectRequests.length >= 2);

    assert.equal((await call(admin, 'POST', `/admin/crm/contacts/${cid}/erase`, { mode: 'anonymize' })).status, 400, 'phải xác nhận');
    const er = await call(admin, 'POST', `/admin/crm/contacts/${cid}/erase`, { mode: 'anonymize', confirm: true });
    assert.equal(er.status, 200, JSON.stringify(er.raw));
    assert.equal(er.data.keptRequests.length, 1, 'phiếu đã thành dự án được giữ');
    assert.equal(er.data.keptAcceptedProposals, 1);
    assert.ok(er.data.deletedRequests >= 1);
    const c = await prisma.crmContact.findUniqueOrThrow({ where: { id: cid } });
    assert.equal(c.email, null);
    assert.equal(c.phone, null);
    assert.equal(c.consent, false);
    assert.ok(c.anonymizedAt);
    const dAfter = await prisma.crmDeal.findUniqueOrThrow({ where: { id: dealA } });
    assert.equal(dAfter.stage, 'WON', 'số liệu deal giữ nguyên');
    assert.equal((await prisma.crmDeal.findUnique({ where: { id: dealB } }))?.projectRequestId ?? null, null, 'phiếu của deal B (DECLINED) đã xoá');
    assert.ok(await prisma.crmDeal.findUnique({ where: { id: dealB } }), 'deal B vẫn còn');
    const acts = await prisma.crmActivity.findMany({ where: { contactId: cid } });
    assert.ok(acts.every((a) => a.body === null && a.subject === '[Đã ẩn danh]'));
    assert.equal((await call(admin, 'PATCH', `/admin/crm/contacts/${cid}`, { name: 'x' })).code, 'CRM_CONTACT_ANONYMIZED');
    // Danh sách mặc định ẩn người đã ẩn danh.
    const list = await call(admin, 'GET', `/admin/crm/contacts?q=${encodeURIComponent(R_NAME)}`);
    assert.ok(!list.data.items.some((x: any) => x.id === cid));
  });
});

const R_NAME = '[Đã ẩn danh]';
