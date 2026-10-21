/**
 * CuongMini trong CT Work (22/10/2026) — HTTP thật + Postgres cục bộ + chuỗi cổng GIẢ (không gọi model thật):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.aiTaiTro.db.test.ts
 *
 *   • thành viên KHÔNG Pro, dự án có trưởng nhóm (ADMIN dự án) Pro ⇒ được tài trợ: hỏi được dù trần token/ngày chung đã cạn;
 *     /ai/quota?projectId= nói rõ "tài trợ bởi @lead";
 *   • cùng người đó ở dự án KHÔNG có trưởng nhóm Pro ⇒ vẫn bị trần (429 WORK_AI_TOKEN_CAP, câu tiếng Việt chỉ cách tài trợ);
 *   • chống spam lượt tài trợ: trần câu/phút do admin đặt chặn đúng câu thứ N+1 (đếm CÂU HỎI, không đếm vòng đọc);
 *   • ảnh + tệp: tải qua /ai/files (kho giả), câu hỏi gửi kèm ⇒ model nhận khối ảnh + chữ rút từ tệp; câu đã lưu mang dấu tệp;
 *   • link sâu: mã thẻ trong câu trả lời ⇒ link thật; thẻ không tồn tại ⇒ không link;
 *   • lệnh XOÁ đề xuất từ trợ lý ⇒ bị loại (chưa có cơ chế yêu cầu xoá) — không bao giờ thành thẻ Apply.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type http from 'node:http';
import { after, before, describe, it } from 'node:test';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `ai22${Date.now().toString(36)}`;

describe('CuongMini CT Work — tài trợ Pro, chống spam, tệp, link (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: http.Server;
  type U = { id: number; token: string; email: string; username: string };
  let owner: U, lead: U, mem: U, owner2: U;
  let ws1 = 0, ws2 = 0, p1 = 0, p2 = 0;
  const userIds: number[] = [];
  let prisma: any, jwt: any, config: any;
  /** Lời gọi model giả: ghi lại opts, trả câu kế tiếp trong hàng (mặc định một câu trả lời JSON). */
  const daGoi: any[] = [];
  let traLoi: string[] = [];
  const kho = new Map<string, Buffer>();

  async function mkUser(name: string, o: { pro?: boolean } = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', emailVerified: true, ...(o.pro ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json: any = await res.json().catch(() => ({}));
    return { status: res.status, data: json.data, code: json.code as string | undefined, message: json.message as string | undefined, raw: json };
  }
  async function upload(u: U, pid: number, name: string, type: string, buf: Buffer) {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(buf)], { type }), name);
    const res = await fetch(`${base}/api/v1/work/projects/${pid}/ai/files`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: form });
    const json: any = await res.json();
    return { status: res.status, data: json.data, code: json.code };
  }

  before(async () => {
    Object.assign(process.env, { LLM_GATEWAY_API_KEY: 'sk-gia', INTERVIEW_DAILY_TOKEN_CAP: '1000' });
    ({ prisma } = await import('../config/database.js'));
    jwt = (await import('jsonwebtoken')).default;
    ({ config } = await import('../config/env.js'));
    const { emailService } = await import('../services/email.service.js');
    (emailService as any).send = async () => ({ success: true });
    const files = await import('../services/work/commentFiles.service.js');
    files._setCommentStoreForTests({
      put: async (k, b) => { kho.set(k, b); },
      read: async (k) => { const b = kho.get(k); if (!b) throw new Error('NoSuchKey'); return b; },
      head: async (k) => (kho.has(k) ? { size: kho.get(k)!.length, contentType: 'application/octet-stream' } : null),
      del: async (k) => { kho.delete(k); },
    });
    const cong = await import('../services/work/aiCong.js');
    cong._datCongChoTest({
      rambo: () => null,
      chinhHangSanSang: async () => false,
      goiModelapi: async (o, model) => {
        daGoi.push(o);
        const text = traLoi.shift() ?? '{"reply":"Ổn rồi.","actions":[]}';
        return { text, model, inputTokens: 10, outputTokens: 5, cong: 'modelapi' as const };
      },
    });
    const express = (await import('express')).default;
    const { errorHandler } = await import('../middleware/errorHandler.js');
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    await prisma.appSetting.deleteMany({ where: { key: 'ctwork_ai_tai_tro_gioi_han' } });
    owner = await mkUser('owner');
    lead = await mkUser('lead', { pro: true });
    mem = await mkUser('mem');
    owner2 = await mkUser('owner2');
    // Dự án 1: chủ không gian không Pro, `lead` (Pro) là ADMIN dự án ⇒ cả nhóm được tài trợ.
    ws1 = (await call(owner, 'POST', '/workspaces', { name: `AI22 A ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${ws1}/invites`, { emails: [lead.email, mem.email], role: 'MEMBER' });
    const a = await call(owner, 'POST', `/workspaces/${ws1}/projects`, { key: 'TT', name: 'Tài trợ', template: 'BLANK', kind: 'SCHOOL' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    p1 = a.data.id;
    assert.equal((await call(owner, 'PUT', `/projects/${p1}/members/${lead.id}`, { role: 'ADMIN' })).status, 200);
    assert.equal((await call(owner, 'PUT', `/projects/${p1}/members/${mem.id}`, { role: 'MEMBER' })).status, 200);
    // Dự án 2: không ai Pro.
    ws2 = (await call(owner2, 'POST', '/workspaces', { name: `AI22 B ${tag}` })).data.id;
    await call(owner2, 'POST', `/workspaces/${ws2}/invites`, { emails: [mem.email], role: 'MEMBER' });
    const b = await call(owner2, 'POST', `/workspaces/${ws2}/projects`, { key: 'KT', name: 'Không tài trợ', template: 'BLANK', kind: 'SCHOOL' });
    p2 = b.data.id;
    assert.equal((await call(owner2, 'PUT', `/projects/${p2}/members/${mem.id}`, { role: 'MEMBER' })).status, 200);
    // `mem` đã tiêu quá trần token/ngày CHUNG (1000) hôm nay.
    await prisma.interviewLLMCallLog.create({ data: { userId: mem.id, feature: 'chat', step: 'interview', provider: 'gateway', model: 'gpt-6-sol', inputTokens: 4000, outputTokens: 1000, costUsd: 0.01, success: true } });
  });

  after(async () => {
    server?.close();
    (await import('../services/work/aiCong.js'))._datCongChoTest(null);
    (await import('../services/work/commentFiles.service.js'))._setCommentStoreForTests(null);
    if (!prisma) return;
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.appSetting.deleteMany({ where: { key: 'ctwork_ai_tai_tro_gioi_han' } });
    await prisma.workSpace.deleteMany({ where: { id: { in: [ws1, ws2].filter(Boolean) } } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('/ai/quota?projectId= — trưởng nhóm Pro ⇒ thành viên được tài trợ; dự án khác ⇒ không', async () => {
    const q1 = await call(mem, 'GET', `/ai/quota?projectId=${p1}`);
    assert.equal(q1.status, 200);
    assert.equal(q1.data.sponsorship.sponsored, true);
    assert.equal(q1.data.sponsorship.by, 'lead');
    assert.equal(q1.data.sponsorship.sponsor.username, lead.username);
    assert.equal(q1.data.sponsorship.sponsor.role, 'project_admin');
    const q2 = await call(mem, 'GET', `/ai/quota?projectId=${p2}`);
    assert.equal(q2.data.sponsorship.sponsored, false);
    const qs = await call(lead, 'GET', `/ai/quota?projectId=${p2}`);
    assert.equal(qs.status, 404, 'không phải thành viên ⇒ không lộ dự án');
    assert.equal((await call(lead, 'GET', `/ai/quota?projectId=${p1}`)).data.sponsorship.by, 'self');
  });

  it('được tài trợ ⇒ hỏi được dù trần token/ngày chung đã cạn; KHÔNG tài trợ ⇒ 429 tiếng Việt chỉ cách được tài trợ', async () => {
    (await import('../services/work/aiTaiTro.js'))._xoaBoDemChoTest();
    const ok = await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Việc của tôi là gì?' });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    assert.equal(ok.data.quota.sponsorship.by, 'lead');
    const cap = await call(mem, 'POST', `/projects/${p2}/ai/chat`, { message: 'Việc của tôi là gì?' });
    assert.equal(cap.status, 429);
    assert.equal(cap.code, 'WORK_AI_TOKEN_CAP');
    assert.match(cap.message ?? '', /Pro/);
    assert.match(cap.message ?? '', /trưởng nhóm/);
    assert.equal(cap.raw.data?.sponsored, false);
  });

  it('chống spam: trần 3 câu/phút ⇒ câu thứ 4 bị chặn (vòng đọc trong một câu KHÔNG bị đếm thêm)', async () => {
    const tt = await import('../services/work/aiTaiTro.js');
    tt._xoaBoDemChoTest();
    await tt.datGioiHanTaiTro({ phutNguoi: 3, ngayNguoi: 0, ngayIp: 0 });
    // Câu 1: model xin đọc một vòng rồi mới trả lời ⇒ 2 lời gọi model nhưng 1 câu hỏi.
    traLoi = ['{"reply":"","reads":[{"tool":"search_pages","query":"login"}]}', '{"reply":"Đã đọc xong.","actions":[]}'];
    const truoc = daGoi.length;
    assert.equal((await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Câu 1' })).status, 200);
    assert.equal(daGoi.length - truoc, 2);
    assert.equal((await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Câu 2' })).status, 200);
    assert.equal((await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Câu 3' })).status, 200);
    const r4 = await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Câu 4' });
    assert.equal(r4.status, 429);
    assert.equal(r4.code, 'WORK_AI_TOO_FAST');
    assert.match(r4.message ?? '', /câu\/phút/);
    // Admin tắt (0) ⇒ chạy lại được.
    await tt.datGioiHanTaiTro({ phutNguoi: 0 });
    assert.equal((await call(mem, 'POST', `/projects/${p1}/ai/chat`, { message: 'Câu 5' })).status, 200);
    tt._xoaBoDemChoTest();
  });

  it('ảnh + tệp: tải lên, gửi kèm ⇒ model nhận khối ảnh + chữ của tệp; câu đã lưu mang dấu tệp; link sâu do mã dựng', async () => {
    const cfg = (await call(lead, 'GET', `/projects/${p1}`)).data;
    const typeId = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    const iss = await call(lead, 'POST', `/projects/${p1}/issues`, { typeId, title: 'Làm trang đăng nhập' });
    assert.equal(iss.status, 201, JSON.stringify(iss.raw));
    const sharp = (await import('sharp')).default;
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
    const anh = await upload(lead, p1, 'màn hình lỗi.png', 'image/png', png);
    assert.equal(anh.status, 201, JSON.stringify(anh));
    assert.equal(anh.data.kind, 'image');
    const tep = await upload(lead, p1, 'yeu-cau.md', 'text/markdown', Buffer.from('# Yêu cầu\nMật khẩu tối thiểu 12 ký tự.'));
    assert.equal(tep.data.kind, 'document');
    assert.equal((await upload(lead, p1, 'virus.exe', 'application/octet-stream', Buffer.from('MZ'))).code, 'WORK_AI_FILE_UNSUPPORTED');

    traLoi = [`{"reply":"Xem TT-${iss.data.number} và TT-9999. ${'```mermaid\\nflowchart LR\\n A-->B\\n```'}","actions":[]}`];
    const truoc = daGoi.length;
    const r = await call(lead, 'POST', `/projects/${p1}/ai/chat`, { message: 'Ảnh này lỗi gì?', attachments: [anh.data, tep.data] });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const o = daGoi[truoc];
    const content = o.messages[0].content;
    assert.ok(Array.isArray(content), 'có ảnh ⇒ nội dung dạng khối');
    assert.ok(content.some((b: any) => b.type === 'image' && b.source.type === 'base64' && b.source.data.length > 10));
    const chu = content.find((b: any) => b.type === 'text').text as string;
    assert.match(chu, /Mật khẩu tối thiểu 12 ký tự/);
    assert.match(chu, /màn hình lỗi\.png/);
    // Link: thẻ có thật ⇒ link; thẻ bịa ⇒ chữ trơn; khối mermaid giữ nguyên.
    assert.match(r.data.reply, new RegExp(`\\[TT-${iss.data.number}\\]\\(/work/[^)]+/TT/issue/${iss.data.number}\\)`));
    assert.ok(r.data.reply.includes('TT-9999') && !r.data.reply.includes('/issue/9999'));
    assert.ok(r.data.reply.includes('```mermaid'));
    // Câu hỏi đã lưu mang dấu tệp (giao diện vẽ chip; Hỏi lại dùng lại tệp).
    assert.match(r.data.question.content, /<ctw-tep>\[.*màn hình lỗi\.png.*\]<\/ctw-tep>$/s);
    // Xem lại tệp: URL ký sẵn (sandbox) — khoá dự án khác bị từ chối.
    const u = await call(mem, 'GET', `/projects/${p1}/ai/files/url?key=${encodeURIComponent(anh.data.key)}`);
    assert.equal(u.status, 200);
    assert.ok(typeof u.data.url === 'string');
    assert.equal((await call(mem, 'GET', `/projects/${p2}/ai/files/url?key=${encodeURIComponent(anh.data.key)}`)).status, 404);
  });

  it('lệnh XOÁ đề xuất từ trợ lý ⇒ bị loại, không thành thẻ Apply (chưa có cơ chế yêu cầu xoá)', async () => {
    const reg = await import('../services/work/toolRegistry/index.js');
    const xoa = reg.COMMANDS.find((t) => t.destructive && 'project' in t.input.shape);
    assert.ok(xoa, 'registry phải có ít nhất một lệnh destructive');
    traLoi = [JSON.stringify({ reply: 'Đã đề xuất xoá.', actions: [{ type: 'command', command: xoa!.name, args: {} }] }), JSON.stringify({ reply: 'Đã đề xuất xoá.', actions: [{ type: 'command', command: xoa!.name, args: {} }] })];
    const r = await call(lead, 'POST', `/projects/${p1}/ai/chat`, { message: 'Xoá giúp tôi cái đó' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.actions.length, 0);
    assert.match(r.data.reply, /dropped/);
  });
});
