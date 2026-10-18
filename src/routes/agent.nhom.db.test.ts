/**
 * ĐỢT 6 CuongMini — HẠN MỨC NHÓM qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/agent.nhom.db.test.ts
 *
 * Người KHÔNG có Pro, cuộc gắn dự án CT Work (`ctworkDuAn`):
 *   • là thành viên + trưởng nhóm (ADMIN) có Pro + đang bật ⇒ ĐƯỢC (tuyến tiêu model đi qua cửa `chiProHoacNhom`);
 *   • không gắn dự án ⇒ 403 PRO_REQUIRED · không phải thành viên ⇒ 403 (`data.nhom = NHOM_KHONG_THANH_VIEN`);
 *   • trưởng nhóm TẮT ⇒ 403 NHOM_TAT · trưởng nhóm hết Pro ⇒ 403 NHOM_KHONG_CHU;
 *   • vượt trần người/ngày hoặc nhóm/tháng (sổ mang dấu `nhom:p<pid>:u<chủ>`) ⇒ 429 NHOM_HET_TRAN;
 *   • AI agent của CT Work ⇒ không bao giờ (403);
 *   • Project settings: GET bảng "ai dùng bao nhiêu" (thành viên xem, chỉ ADMIN sửa), token agent ⇒ 403 WORK_AGENT_FORBIDDEN;
 *   • `/agent/tools` của thành viên không Pro ⇒ `pro:false` + `nhom:[dự án]` + chỉ model free.
 * Dùng tuyến `/agent/dat-ten` THIẾU `cauHoi`: qua được cửa ⇒ 400 BAD_INPUT (không gọi model, không tốn tiền).
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `nh${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CuongMini — hạn mức NHÓM (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, mem: U, out: U, pro2: U;
  let wsId = 0, pid = 0;
  let agentTok = '', agentUserId = 0;

  async function mkUser(name: string, pro = false): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', ...(pro ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, message: json.message as string | undefined, raw: json };
  }
  /** Tuyến tiêu model rẻ nhất để thử cửa: thiếu `cauHoi` ⇒ 400 nếu đã qua cửa. */
  const thuCua = (u: U, duAn?: number) => call(u, 'POST', '/agent/dat-ten', duAn ? { ctworkDuAn: duAn } : {});
  const ghiSo = (userId: number, usd: number, luc = new Date()) => prisma.interviewLLMCallLog.create({
    data: { userId, feature: 'agent', step: `nhom:p${pid}:u${lead.id}`, provider: 'gateway', model: 'gpt-6-sol', inputTokens: 100, outputTokens: 10, costUsd: usd, success: true, createdAt: luc },
  });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const { default: agentRoutes } = await import('./agent.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/agent', agentRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    lead = await mkUser('lead', true);
    mem = await mkUser('mem');
    out = await mkUser('out');
    pro2 = await mkUser('pro2', true);
    wsId = (await call(lead, 'POST', '/work/workspaces', { name: `Nhom ${tag}` })).data.id;
    await call(lead, 'POST', `/work/workspaces/${wsId}/invites`, { emails: [mem.email, pro2.email], role: 'MEMBER' });
    const p = await call(lead, 'POST', `/work/workspaces/${wsId}/projects`, { key: 'NT', name: 'Nhà trọ SV', template: 'BLANK', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const u of [mem, pro2]) assert.equal((await call(lead, 'PUT', `/work/projects/${pid}/members/${u.id}`, { role: 'MEMBER' })).status, 200);
    const a = await call(lead, 'POST', `/work/workspaces/${wsId}/agents`, { name: 'Bot nhom', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
  });

  after(async () => {
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('không Pro + là thành viên ⇒ ĐƯỢC; không gắn dự án ⇒ 403 PRO_REQUIRED; người ngoài ⇒ 403', async () => {
    const ok = await thuCua(mem, pid);
    assert.equal(ok.status, 400, `phải QUA cửa (400 thiếu cauHoi): ${JSON.stringify(ok.raw)}`);
    assert.equal(ok.code, 'BAD_INPUT');
    const khongGan = await thuCua(mem);
    assert.equal(khongGan.status, 403);
    assert.equal(khongGan.code, 'PRO_REQUIRED');
    assert.equal(khongGan.data?.nhom, 'NHOM_KHONG_GAN');
    const ngoai = await thuCua(out, pid);
    assert.equal(ngoai.status, 403);
    assert.equal(ngoai.data?.nhom, 'NHOM_KHONG_THANH_VIEN');
    assert.match(ngoai.message ?? '', /không phải thành viên/);
    // Người CÓ Pro đi đường riêng — không cần dự án, và không tiêu hạn mức nhóm.
    assert.equal((await thuCua(pro2)).status, 400);
  });

  it('trưởng nhóm TẮT ⇒ 403 NHOM_TAT; thành viên không sửa được; bật lại ⇒ được', async () => {
    assert.equal((await call(mem, 'PUT', `/work/projects/${pid}/cuongmini-team`, { bat: false })).status, 403, 'thành viên không tắt được');
    const tat = await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { bat: false });
    assert.equal(tat.status, 200, JSON.stringify(tat.raw));
    assert.equal(tat.data.cauHinh.bat, false);
    const r = await thuCua(mem, pid);
    assert.equal(r.status, 403);
    assert.equal(r.data?.nhom, 'NHOM_TAT');
    assert.match(r.message ?? '', /TẮT/);
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { bat: true });
    assert.equal((await thuCua(mem, pid)).status, 400);
  });

  it('vượt trần người/ngày ⇒ 429; nới trần ⇒ được; vượt trần nhóm/tháng ⇒ 429; bảng "ai dùng bao nhiêu"', async () => {
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { tranNgayNguoiUsd: 1, tranThangNhomUsd: 15 });
    await ghiSo(mem.id, 1.2);
    const het = await thuCua(mem, pid);
    assert.equal(het.status, 429, JSON.stringify(het.raw));
    assert.equal(het.code, 'NHOM_HET_TRAN');
    assert.match(het.message ?? '', /hôm nay/);
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { tranNgayNguoiUsd: 5 });
    assert.equal((await thuCua(mem, pid)).status, 400);
    // Sổ của người khác trong tháng (không phải hôm nay) vẫn cộng vào trần NHÓM.
    const dauThang = new Date(); dauThang.setDate(Math.max(1, dauThang.getDate() - 1)); dauThang.setHours(12);
    await ghiSo(pro2.id, 2, dauThang);
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { tranThangNhomUsd: 3 });
    const thang = await thuCua(mem, pid);
    assert.equal(thang.status, 429);
    assert.match(thang.message ?? '', /tháng này/);
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { tranThangNhomUsd: 15 });
    const bang = await call(mem, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(bang.status, 200);
    assert.equal(bang.data.sua, false, 'thành viên chỉ xem');
    assert.equal(bang.data.chu.id, lead.id);
    assert.ok(Math.abs(bang.data.daDungThang - 3.2) < 0.01, JSON.stringify(bang.data));
    assert.deepEqual(bang.data.nguoi.map((n: any) => n.username), [pro2.username, mem.username]);
    assert.ok(Math.abs(bang.data.nguoi.find((n: any) => n.userId === mem.id).homNay - 1.2) < 0.01);
    const bangLead = await call(lead, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(bangLead.data.sua, true);
    assert.ok(bangLead.data.ungVien.some((u: any) => u.id === lead.id && u.pro === true));
  });

  it('AI agent của CT Work ⇒ 403 (cả đường nhóm lẫn trang cài đặt)', async () => {
    const { quyetDinhNhom } = await import('../services/agent/hanMucNhom.js');
    const q = await quyetDinhNhom(agentUserId, pid);
    assert.equal(q.loai, 'tuChoi');
    assert.equal((q as any).ma, 'NHOM_AGENT');
    const tokAgentJwt = { token: jwt.sign({ userId: agentUserId, username: 'bot', email: 'bot@agents.invalid', roles: [], roleVersion: 0 }, config.jwtSecret) };
    const r = await fetch(`${base}/api/v1/agent/dat-ten`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokAgentJwt.token}` }, body: JSON.stringify({ ctworkDuAn: pid }) });
    assert.equal(r.status, 403);
    const put = await call({ token: agentTok }, 'PUT', `/work/projects/${pid}/cuongmini-team`, { bat: false });
    assert.equal(put.status, 403);
    assert.equal(put.code, 'WORK_AGENT_FORBIDDEN');
    const get = await call({ token: agentTok }, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(get.status, 403);
  });

  it('/agent/tools: thành viên không Pro ⇒ nhom:[NT] + chỉ model free; trưởng nhóm hết Pro ⇒ 403 NHOM_KHONG_CHU', async () => {
    const t = await call(mem, 'GET', '/agent/tools');
    assert.equal(t.status, 200);
    assert.equal(t.data.pro, false);
    assert.deepEqual(t.data.nhom, [{ projectId: pid, key: 'NT' }]);
    assert.ok((t.data.models as any[]).every((m) => m.khoa === 'free'), JSON.stringify(t.data.models));
    assert.deepEqual((await call(out, 'GET', '/agent/tools')).data.nhom, []);
    await prisma.user.update({ where: { id: lead.id }, data: { isPro: false } });
    try {
      const r = await thuCua(mem, pid);
      assert.equal(r.status, 403);
      assert.equal(r.data?.nhom, 'NHOM_KHONG_CHU');
      assert.deepEqual((await call(mem, 'GET', '/agent/tools')).data.nhom, []);
    } finally {
      await prisma.user.update({ where: { id: lead.id }, data: { isPro: true } });
    }
  });
});
