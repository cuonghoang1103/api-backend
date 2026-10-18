/**
 * CT Work — trợ lý AI kiểu mentor (18/10/2026), qua HTTP thật trên Postgres cục bộ, model GIẢ (`_setAskForTests`):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.aiMentor.db.test.ts
 *
 *   1. "Việc của tôi tuần này?" ⇒ prompt có MỌI thẻ mở của người hỏi (kể cả ngoài sprint) kèm đường dẫn /work/<ws>/<KEY>/
 *      issue/<n>; thẻ của người khác không nằm trong danh sách đó; thẻ được ĐỌC SẴN đủ: mô tả Markdown giữ link + checklist,
 *      bình luận, web link, trang Docs gắn thẻ, CHỮ của tệp đính kèm. Câu hỏi để hiểu ⇒ không nhét mục lục lệnh GHI.
 *   2. Hồi quy 500 ngày 18/10: model trả JSON KHÔNG có `actions` ⇒ 200, actions rỗng.
 *   3. Vòng đọc khoan dung: lệnh mới (read_issue / read_attachment / list_resources / member_work) chạy bằng quyền người
 *      hỏi; mục đọc lệch dạng được sửa, mục hỏng bị bỏ; câu trả lời rỗng ⇒ hỏi lại một lần; vẫn rỗng ⇒ 502 + câu hỏi
 *      đánh dấu lỗi (bấm Hỏi lại được), không lưu tin nhắn trống.
 *   4. Quyền: GUEST (vai MEMBER) không thấy trang INTERNAL / link Resources TEAM ở bất kỳ đường nào (mục lục, mục khớp câu
 *      hỏi, read_issue, list_resources); khách cổng: /ai/* bị chặn, và các lệnh đọc mới gọi thẳng cũng không lộ thẻ/tệp/
 *      link chưa chia sẻ, không hỏi được việc của người khác.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { markdownToTiptap } from '../services/work/docMarkdown.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `mtr${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CT Work — trợ lý AI kiểu mentor (HTTP + DB thật, model giả)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, khoa: U, tu: U, guest: U, client: U;
  let wsId = 0, pid = 0, slug = '';
  let guidePage = 0, clientPage = 0, nLogin = 0, nUsers = 0, nTest = 0, nTu = 0, nBacklog = 0, attId = 0;
  const prompts: Array<{ system: string; user: string }> = [];
  let fakeReplies: string[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, fullName: name } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const doc = (md: string) => markdownToTiptap(md).doc;
  const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
  const ask = async (u: U, message: string, extra: Record<string, unknown> = {}) => {
    prompts.length = 0;
    return call(u, 'POST', `/projects/${pid}/ai/chat`, { message, ...extra });
  };

  before(async () => {
    (await import('../services/work/ai.service.js'))._setAskForTests(async (system, user) => {
      prompts.push({ system, user });
      return fakeReplies.shift() ?? '{"reply":"ok"}';
    });
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, khoa, tu, guest, client] = await Promise.all(['lead', 'khoa', 'tu', 'guest', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/ai.service.js'))._setAskForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án có Docs (INTERNAL + CLIENT), Resources (TEAM + CLIENT), sprint, thẻ có link/checklist/bình luận/tệp', async () => {
    const ws = await call(lead, 'POST', '/workspaces', { name: `Mentor ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsId = ws.data.id;
    wsIds.push(wsId);
    slug = (await prisma.workSpace.findUniqueOrThrow({ where: { id: wsId } })).slug;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [khoa.email, tu.email], role: 'MEMBER' });
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST' });
    const p = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'NT', name: 'Nha tro', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true, resources: true, clientPortal: true } });
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/members/${guest.id}`, { role: 'MEMBER' })).status, 200);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);

    guidePage = (await call(lead, 'POST', `/projects/${pid}/pages`, { title: 'Huong dan noi bo', contentJson: doc('## 3. Dang nhap\nDung PreparedStatement.\n\n## 4. Quy uoc Git\nNhanh `feature/NT-<so>`; commit `NT-<so>: ...`. SECRET-INTERNAL-77') })).data.number;
    clientPage = (await call(lead, 'POST', `/projects/${pid}/pages`, { title: 'Client guide', visibility: 'CLIENT', contentJson: doc('## Setup\nInstall the app') })).data.number;
    assert.ok(guidePage && clientPage);
    const figma = await call(lead, 'POST', `/projects/${pid}/resources`, { url: 'https://www.figma.com/design/TEAMONLY/NT', title: 'Figma noi bo', description: 'chi doi lam' });
    assert.equal(figma.status, 201, JSON.stringify(figma.raw));
    assert.equal((await call(lead, 'POST', `/projects/${pid}/resources`, { url: 'https://example.org/client-manual', title: 'Client manual', visibility: 'CLIENT' })).status, 201);

    const sp = await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 2', goal: 'Login chay duoc' });
    await call(lead, 'POST', `/projects/${pid}/sprints/${sp.data.id}/start`, { startAt: new Date(Date.now() - 86_400_000).toISOString(), endAt: new Date(Date.now() + 6 * 86_400_000).toISOString() });
    const mk = async (b: Record<string, unknown>) => {
      const r = await call(lead, 'POST', `/projects/${pid}/issues`, b);
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      return r.data.number as number;
    };
    nLogin = await mk({
      typeKey: 'STORY', title: 'Man hinh Dang nhap', assigneeId: khoa.id, sprintId: sp.data.id, dueDate: day(3),
      descriptionJson: doc(`Doc truoc [huong dan muc 3](/work/${slug}/NT/docs/${guidePage}).\n\n### Tu kiem\n- [ ] Dung PreparedStatement\n- [ ] Hash SHA-256`),
    });
    nUsers = await mk({ typeKey: 'TASK', title: 'Tao bang Users', assigneeId: khoa.id, sprintId: sp.data.id, dueDate: day(2), descriptionJson: doc('Theo tep users-schema.md dinh kem.') });
    nTest = await mk({ typeKey: 'TASK', title: 'Viet test case login', assigneeId: khoa.id });
    nTu = await mk({ typeKey: 'STORY', title: 'Danh sach phong', assigneeId: tu.id, sprintId: sp.data.id, descriptionJson: doc('Viec cua Tu.') });
    nBacklog = await mk({ typeKey: 'TASK', title: 'Viec da xong cua Khoa', assigneeId: khoa.id });
    // Thẻ đã xong không nằm trong "việc đang mở".
    const done = await prisma.workStatus.findFirstOrThrow({ where: { workflow: { projectId: pid }, category: 'DONE' } });
    await prisma.workIssue.updateMany({ where: { projectId: pid, number: nBacklog }, data: { statusId: done.id } });

    const key = `work/${pid}/att/${tag}-users-schema.md`;
    const text = '| Cot | Kieu |\n|---|---|\n| so_cccd | CHAR(12) |\n| locked_until | DATETIME2 |\n';
    await putObject(key, Buffer.from(text, 'utf8'), 'text/markdown');
    const iUsers = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: nUsers } });
    attId = (await prisma.workAttachment.create({ data: { issueId: iUsers.id, uploaderId: lead.id, r2Key: key, fileName: 'users-schema.md', mime: 'text/markdown', size: text.length } })).id;
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${nLogin}/web-links`, { resourceId: figma.data.id })).status, 201);
    const iLogin = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: nLogin } });
    const pg = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: guidePage } });
    await prisma.workPageIssueLink.create({ data: { pageId: pg.id, issueId: iLogin.id, createdById: lead.id } });
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${nLogin}/comments`, { bodyJson: doc('Luu bang RememberTokens, cookie HttpOnly.') })).status, 201);
  });

  it('1. "Việc của tôi tuần này?" ⇒ đủ việc + link; thẻ đọc sẵn đủ mô tả/link/checklist/bình luận/web link/Docs/tệp; không mục lục lệnh GHI', async () => {
    fakeReplies = ['{"reply":"Viec cua ban: NT-1, NT-2, NT-3"}'];
    const r = await ask(khoa, 'Việc của tôi tuần này là gì?');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(prompts.length, 1, 'đã đọc sẵn ⇒ một lượt gọi model');
    const { system, user } = prompts[0];
    const mineBlock = user.slice(user.indexOf('Open issues assigned to'), user.indexOf('finished in the last 14 days'));
    for (const n of [nLogin, nUsers, nTest]) assert.match(mineBlock, new RegExp(`NT-${n} .*link /work/${slug}/NT/issue/${n}`), `NT-${n} trong danh sách việc`);
    assert.ok(!mineBlock.includes(`NT-${nTu} `), 'thẻ của Tú không phải việc của Khoa');
    assert.ok(!mineBlock.includes(`NT-${nBacklog} `), 'thẻ đã xong không nằm trong việc đang mở');
    assert.match(mineBlock, /backlog \(no sprint\)/, 'thẻ ngoài sprint vẫn được liệt kê');
    assert.match(user, /Team lead\(s\) to ask[^\n]*@mtr\w+_lead/);
    assert.match(user, /Current sprint: "Sprint 2" \[ACTIVE\]/);
    // Đọc sẵn: mô tả GIỮ link Docs + checklist; bình luận; web link; trang gắn thẻ; chữ của tệp.
    assert.match(user, new RegExp(`\\]\\(/work/${slug}/NT/docs/${guidePage}\\)`), 'link trong mô tả còn nguyên đường dẫn');
    assert.match(user, /- \[ \] Dung PreparedStatement/, 'checklist "Tự kiểm"');
    assert.match(user, /RememberTokens/, 'bình luận');
    assert.match(user, /figma\.com\/design\/TEAMONLY/, 'web link');
    assert.match(user, new RegExp(`Docs pages linked to this issue: #${guidePage} `));
    assert.match(user, /so_cccd/, 'chữ của tệp đính kèm');
    assert.match(user, new RegExp(`/work/${slug}/NT/docs/${guidePage} · sections: .*Quy uoc Git`), 'mục lục Docs có link + tiêu đề mục');
    assert.match(user, /Client manual/, 'Resources');
    assert.match(system, /Never invent issues, pages, files, links/);
    assert.match(system, /read_issue\(issue:/, 'lệnh đọc mới có trong mục lục');
    assert.ok(!/get_issue\(/.test(system), 'get_issue nhường chỗ cho read_issue ở đường Ask');
    assert.ok(!/WRITE commands — you can NOT run them/.test(system), 'câu hỏi để hiểu ⇒ không mục lục lệnh GHI');

    // Câu đòi thay đổi ⇒ mục lục lệnh GHI quay lại.
    fakeReplies = ['{"reply":"ok","actions":[]}'];
    await ask(khoa, `Tạo 2 subtask cho NT-${nLogin}`);
    assert.match(prompts[0].system, /WRITE commands — you can NOT run them/);
  });

  it('2. hồi quy 18/10: JSON không có `actions` ⇒ 200, không đề xuất (từng 500 vì .some trên undefined)', async () => {
    fakeReplies = ['{"reply":"Chi la cau tra loi, khong de xuat gi."}'];
    const r = await ask(khoa, 'Sprint của nhóm có đúng tiến độ không?');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual(r.data.actions, []);
    assert.match(r.data.reply, /khong de xuat/);
  });

  it('3. vòng đọc khoan dung + lệnh đọc mới; trả lời rỗng ⇒ hỏi lại một lần; vẫn rỗng ⇒ 502 + câu hỏi đánh dấu lỗi', async () => {
    fakeReplies = [
      JSON.stringify({ reads: [
        { tool: 'read_issue', issue: nTu },                                   // tên lệnh làm "tool"
        { name: 'read_attachment', args: JSON.stringify({ attachment: attId }) }, // thiếu tool, args là chuỗi
        { tool: 'command', name: 'member_work', user: tu.username },          // tham số ngoài args
        { tool: 'command', name: 'list_resources', args: { query: 'figma' } },
        { tool: 'read_page', number: String(guidePage) },                      // số dạng chuỗi
        'rác',
      ] }),
      '{"reply":"Da doc xong."}',
    ];
    const r = await ask(khoa, `Bạn Tú đang làm gì?`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(prompts.length, 2);
    const u2 = prompts[1].user;
    assert.match(u2, /Command results/);
    assert.match(u2, new RegExp(`### NT-${nTu} — in-app link /work/${slug}/NT/issue/${nTu}`), 'read_issue');
    assert.match(u2, /Viec cua Tu/);
    assert.match(u2, /Attachment #\d+ "users-schema.md"[\s\S]*so_cccd/, 'read_attachment');
    assert.match(u2, new RegExp(`Open issues assigned to @${tu.username}[\\s\\S]*NT-${nTu} `), 'member_work');
    assert.match(u2, /Figma noi bo/, 'list_resources lọc theo chữ');
    assert.match(u2, /Quy uoc Git[\s\S]*SECRET-INTERNAL-77/, 'read_page (MEMBER đọc trang INTERNAL)');

    // Trả lời rỗng ⇒ hỏi lại MỘT lần "trả lời ngay".
    fakeReplies = ['{"reply":""}', '{"reply":"Bay gio moi tra loi."}'];
    const e1 = await ask(khoa, 'Giải thích giúp tôi');
    assert.equal(e1.status, 200, JSON.stringify(e1.raw));
    assert.equal(prompts.length, 2);
    assert.match(prompts[1].user, /Answer the user NOW/);
    // Vẫn rỗng ⇒ 502, không lưu tin nhắn trống; câu hỏi giữ lại với lỗi ⇒ Hỏi lại được.
    fakeReplies = ['{"reply":null,"actions":[]}', '{"reply":"   "}'];
    const e2 = await ask(khoa, 'Câu hỏi bị trả lời rỗng');
    assert.equal(e2.status, 502, JSON.stringify(e2.raw));
    assert.equal(e2.code, 'WORK_AI_BAD_OUTPUT');
    const q = await prisma.workAiMessage.findFirstOrThrow({ where: { content: 'Câu hỏi bị trả lời rỗng' }, orderBy: { id: 'desc' } });
    assert.ok(q.error, 'câu hỏi được đánh dấu lỗi');
    assert.equal(await prisma.workAiMessage.count({ where: { threadId: q.threadId, role: 'assistant' } }), 0, 'không lưu câu trả lời trống');
    fakeReplies = ['{"reply":"Lan nay tra loi duoc."}'];
    const again = await call(khoa, 'POST', `/projects/${pid}/ai/chat`, { message: 'x', retryMessageId: q.id });
    assert.equal(again.status, 200, JSON.stringify(again.raw));
  });

  it('4a. GUEST (vai MEMBER): không thấy trang INTERNAL / link TEAM ở bất kỳ đường đọc nào', async () => {
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/issues/${nUsers}`, { assigneeId: guest.id })).status, 200);
    fakeReplies = [
      JSON.stringify({ reply: '', reads: [{ tool: 'command', name: 'read_issue', args: { issue: nLogin } }, { tool: 'command', name: 'list_resources', args: {} }, { tool: 'read_page', number: guidePage }] }),
      '{"reply":"ok"}',
    ];
    const r = await ask(guest, 'Quy ước Git của nhóm là gì?');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const all = prompts.map((p) => `${p.system}\n${p.user}`).join('\n');
    assert.ok(!all.includes('Huong dan noi bo'), 'mục lục/mục khớp/đường link không lộ trang INTERNAL');
    assert.ok(!all.includes('SECRET-INTERNAL-77'), 'nội dung trang INTERNAL không vào prompt');
    assert.ok(!all.includes('TEAMONLY') && !all.includes('Figma noi bo'), 'link Resources TEAM không lộ (mục lục, read_issue, list_resources)');
    assert.match(all, /Client manual/);
    assert.match(all, /Client guide/);
    assert.match(prompts[1].user, new RegExp(`read_page #${guidePage}: not found or not visible to you`));
    assert.match(prompts[0].user, new RegExp(`Open issues assigned to @${guest.username}[\\s\\S]*NT-${nUsers} `));
  });

  it('4b. khách cổng: /ai/* bị chặn; lệnh đọc mới gọi thẳng không lộ thẻ/tệp/link chưa chia sẻ', async () => {
    assert.equal((await call(client, 'POST', `/projects/${pid}/ai/chat`, { message: 'Việc của tôi?' })).code, 'CLIENT_PORTAL_ONLY');
    const reg = await import('../services/work/toolRegistry/index.js');
    await assert.rejects(reg.runForPerson(client.id, pid, 'read_issue', { issue: nLogin }, 'read'), 'thẻ chưa chia sẻ');
    await assert.rejects(reg.runForPerson(client.id, pid, 'read_attachment', { attachment: attId }, 'read'), 'tệp chưa chia sẻ');
    await assert.rejects(reg.runForPerson(client.id, pid, 'member_work', { user: khoa.username }, 'read'), 'việc của người khác');
    const res = await reg.runForPerson(client.id, pid, 'list_resources', {}, 'read').catch((e: Error) => ({ text: `ERR ${e.message}` }));
    assert.ok(!res.text.includes('TEAMONLY'), 'link TEAM không lộ cho khách');
    // Lệnh đọc mới KHÔNG có trên MCP: token agent / MCP không gọi được qua đường này.
    assert.ok(!reg.mcpCommands().some((t) => t.name === 'read_issue'));
  });
});
