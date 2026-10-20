/**
 * Trình xem tệp CT Work (20/10/2026) — `/attachments/:aid/content` + `/preview` qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.xemTep.db.test.ts
 *
 * Kho tệp = storage sandbox trong RAM (tự bật khi test — không chạm R2 thật). Kiểm:
 *   Q  quyền: người ngoài 404, khách cổng chỉ tệp đã chia sẻ trên thẻ đã chia sẻ (cùng luật /url);
 *   S  an toàn: luôn text/plain + nosniff, .html/.svg trả dạng CHỮ, nhị phân 415, trần 2 MB (cắt + báo cắt);
 *   O  xem trước Office: docx ⇒ HTML, xlsx ⇒ bảng; loại khác 415; tệp mất trên kho ⇒ 404.
 */

import './work.ctw5b.testenv.js'; // cấu hình R2 giả trước khi nạp env (ký URL cục bộ) — dùng chung với ctw5b
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { TEXT_PREVIEW_MAX } from '../services/work/xemTep.js';
import { writeXlsx, XSheet } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `xt${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string };

function docxMau(paras: string[]): Buffer {
  const z = new AdmZip();
  z.addFile('[Content_Types].xml', Buffer.from('<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'));
  z.addFile('_rels/.rels', Buffer.from('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'));
  const body = paras.map((p) => `<w:p><w:r><w:t xml:space="preserve">${p}</w:t></w:r></w:p>`).join('');
  z.addFile('word/document.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`));
  return z.toBuffer();
}

describe('CT Work — trình xem tệp: /content + /preview (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, client: U, outsider: U;
  let wsId = 0, pid = 0;
  const att: Record<string, number> = {};

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  /** GET thô (để soi header + byte). */
  async function raw(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    const buf = Buffer.from(await res.arrayBuffer());
    let code: string | undefined;
    try { code = JSON.parse(buf.toString('utf8')).code; } catch { /* không phải JSON */ }
    return { status: res.status, h: res.headers, buf, text: buf.toString('utf8'), code };
  }
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_EMAIL_NOTIFICATIONS = 'false';
    process.env.WORK_PREVIEW_RPM = '1000';
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, client, outsider] = await Promise.all(['owner', 'member', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT (cổng khách), thẻ chia sẻ + thẻ nội bộ, tệp đủ loại trong kho sandbox', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Xem ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'XT', name: 'Viewer', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${member.id}`, { role: 'MEMBER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    const cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    const shared = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Shared' })).data.number;
    const internal = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Internal' })).data.number;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${shared}/client-visible`, { visible: true })).status, 200);
    const issueId = async (n: number) => (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).id;
    const sId = await issueId(shared), iId = await issueId(internal);

    const xs = new XSheet('Điểm'); xs.set(1, 1, 'Tên').set(1, 2, 'Điểm').set(2, 1, 'An').set(2, 2, 9);
    const files: Array<[string, number, string, string, Buffer, boolean?]> = [
      ['md', sId, 'Ghi chú.md', 'text/markdown', Buffer.from('# Tiêu đề\n\nXin chào **CT Work**'), true],
      ['html', sId, 'trang.html', 'text/html', Buffer.from('<script>alert(document.cookie)</script><h1>x</h1>')],
      ['svg', sId, 'icon.svg', 'image/svg+xml', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>')],
      ['big', sId, 'server.log', 'text/plain', Buffer.alloc(TEXT_PREVIEW_MAX + 500, 0x61)],
      ['png', sId, 'shot.png', 'image/png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])],
      ['docx', sId, 'Báo cáo.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', docxMau(['Đoạn một', 'Đoạn hai'])],
      ['xlsx', sId, 'Điểm.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', writeXlsx([xs])],
      ['internalOnShared', sId, 'noi-bo.txt', 'text/plain', Buffer.from('SECRET-MARGIN')],
      ['onInternal', iId, 'secret.csv', 'text/csv', Buffer.from('a,b\n1,2'), true],
      ['missing', sId, 'mat.txt', 'text/plain', Buffer.alloc(0)],
    ];
    for (const [k, issue, name, mime, body, shareIt] of files) {
      const key = `work/${pid}/${issue}/${tag}-${k}/${name}`;
      if (k !== 'missing') await putObject(key, body, mime, 'private, max-age=0, no-store');
      const row = await prisma.workAttachment.create({ data: { issueId: issue, uploaderId: owner.id, r2Key: key, fileName: name, mime, size: k === 'missing' ? 10 : body.length, clientVisible: !!shareIt } });
      att[k] = row.id;
    }
  });

  it('S1 tệp markdown ⇒ 200 text/plain; charset=utf-8, nosniff, inline, CSP sandbox; đúng byte UTF-8', async () => {
    const r = await raw(member, `/projects/${pid}/attachments/${att.md}/content`);
    assert.equal(r.status, 200);
    assert.equal(r.h.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(r.h.get('x-content-type-options'), 'nosniff');
    assert.match(r.h.get('content-disposition') ?? '', /^inline;/);
    assert.match(r.h.get('content-security-policy') ?? '', /sandbox/);
    assert.equal(r.h.get('x-preview-truncated'), '0');
    assert.equal(r.text, '# Tiêu đề\n\nXin chào **CT Work**');
  });

  it('S2 .html / .svg KHÔNG BAO GIỜ trả với kiểu gốc — luôn text/plain', async () => {
    for (const k of ['html', 'svg']) {
      const r = await raw(member, `/projects/${pid}/attachments/${att[k]}/content`);
      assert.equal(r.status, 200, k);
      assert.equal(r.h.get('content-type'), 'text/plain; charset=utf-8', k);
      assert.ok(r.text.includes('alert('), `${k}: trả nguyên văn để hiện dạng chữ`);
    }
  });

  it('S3 trần 2 MB: tệp lớn hơn ⇒ cắt đúng 2 MB + X-Preview-Truncated: 1', async () => {
    const r = await raw(member, `/projects/${pid}/attachments/${att.big}/content`);
    assert.equal(r.status, 200);
    assert.equal(r.buf.length, TEXT_PREVIEW_MAX);
    assert.equal(r.h.get('x-preview-truncated'), '1');
    assert.equal(r.h.get('x-file-size'), String(TEXT_PREVIEW_MAX + 500));
  });

  it('S4 nhị phân (png) ⇒ 415 WORK_PREVIEW_UNSUPPORTED (ảnh dùng URL inline, không qua đây)', async () => {
    const r = await raw(member, `/projects/${pid}/attachments/${att.png}/content`);
    assert.equal(r.status, 415);
    assert.equal(r.code, 'WORK_PREVIEW_UNSUPPORTED');
  });

  it('O1 docx ⇒ HTML; xlsx ⇒ bảng giá trị; loại khác ⇒ 415', async () => {
    const d = await call(member, 'GET', `/projects/${pid}/attachments/${att.docx}/preview`);
    assert.equal(d.status, 200, JSON.stringify(d.raw));
    assert.equal(d.data.kind, 'docx');
    assert.match(d.data.html, /<p>Đoạn một<\/p><p>Đoạn hai<\/p>/);
    const x = await call(member, 'GET', `/projects/${pid}/attachments/${att.xlsx}/preview`);
    assert.equal(x.status, 200);
    assert.equal(x.data.kind, 'xlsx');
    assert.deepEqual(x.data.sheets[0].rows, [['Tên', 'Điểm'], ['An', '9']]);
    assert.equal((await call(member, 'GET', `/projects/${pid}/attachments/${att.md}/preview`)).code, 'WORK_PREVIEW_UNSUPPORTED');
  });

  it('O2 tệp có dòng DB nhưng mất trên kho ⇒ 404 (không 500)', async () => {
    assert.equal((await raw(member, `/projects/${pid}/attachments/${att.missing}/content`)).status, 404);
  });

  it('Q1 người ngoài dự án không đọc được (403/404), không có token ⇒ 401', async () => {
    const r = await raw(outsider, `/projects/${pid}/attachments/${att.md}/content`);
    assert.ok([403, 404].includes(r.status), String(r.status));
    assert.ok(!r.text.includes('Tiêu đề'));
    assert.ok([403, 404].includes((await call(outsider, 'GET', `/projects/${pid}/attachments/${att.docx}/preview`)).status));
    const anon = await fetch(`${base}/api/v1/work/projects/${pid}/attachments/${att.md}/content`);
    assert.equal(anon.status, 401);
  });

  it('Q2 khách cổng: tệp đã chia sẻ trên thẻ đã chia sẻ ⇒ đọc được; tệp nội bộ / thẻ nội bộ ⇒ 404 (cả /preview)', async () => {
    const ok = await raw(client, `/projects/${pid}/attachments/${att.md}/content`);
    assert.equal(ok.status, 200, ok.text);
    assert.match(ok.text, /Xin chào/);
    const hid = await raw(client, `/projects/${pid}/attachments/${att.internalOnShared}/content`);
    assert.equal(hid.status, 404);
    assert.ok(!hid.text.includes('SECRET-MARGIN'));
    assert.equal((await raw(client, `/projects/${pid}/attachments/${att.onInternal}/content`)).status, 404, 'tệp chia sẻ nhưng thẻ chưa chia sẻ');
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${att.docx}/preview`)).status, 404, 'docx chưa chia sẻ');
    // Cùng luật với /url — đối chiếu để hai đường không lệch nhau.
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${att.internalOnShared}/url`)).status, 404);
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${att.md}/url?inline=1`)).status, 200);
  });

  it('Q3 tệp của dự án khác qua pid này ⇒ 404 (không dò chéo)', async () => {
    const other = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'XO', name: 'Other', template: 'BLANK', kind: 'SOFTWARE' });
    assert.equal((await raw(owner, `/projects/${other.data.id}/attachments/${att.md}/content`)).status, 404);
  });
});
