/**
 * /hoc-lieu trên DB thật (không gọi AI, khoá sách dùng nguồn JSON giả):
 *   HOC_LIEU_DB_TEST=1 npx tsx --test src/routes/hocLieu.routes.db.test.ts
 * Trọng tâm: quyền xem bài ĐÚNG luật trang học (chưa mua ⇒ không có nội dung; admin ⇒ đọc trọn), lời giảng video đi kèm,
 * đề Code Lab không lộ lời giải, Dekiru đọc được, tiến độ chỉ đếm dữ liệu của chính người hỏi.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { createToken } from '../services/work/apiTokens.service.js';
import { _datNguonLay } from '../services/hocLieu/sachHoc.js';

const RUN = process.env.HOC_LIEU_DB_TEST === '1';
const tag = `hl${Date.now().toString(36)}`;

describe('/hoc-lieu', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  const ids = { hoc: 0, admin: 0, course: 0, role: 0, group: 0 };
  let tokHoc = '';
  let tokAdmin = '';
  let ctwHoc = '';

  const sign = (u: { id: number; username: string; email: string | null }, roles: string[]) =>
    jwt.sign({ userId: u.id, username: u.username, email: u.email, roles, roleVersion: 0 }, config.jwtSecret);
  async function call(tok: string, q: string) {
    const res = await fetch(`${base}/api/v1/hoc-lieu${q}`, { headers: { Authorization: `Bearer ${tok}` } });
    const json = (await res.json().catch(() => ({}))) as { data?: any; message?: string };
    return { status: res.status, data: json.data, message: json.message };
  }

  before(async () => {
    _datNguonLay(async (url) => {
      if (url.endsWith('/sach-hoc/dekiru/index.json')) return { khoa: 'dekiru', tieuDe: 'Dekiru', donVi: 'Bài', phienBan: 't', buoi: [{ n: 2, so: 1, ten: 'Bài 1', phut: 30, tep: 'bai-2.json', bai: [{ id: 'b1-tu-vung', kind: 'vocab', title: 'Từ vựng Bài 1', minutes: 30 }] }] };
      if (url.endsWith('/sach-hoc/dekiru/bai-2.json')) return { bai: [{ id: 'b1-tu-vung', kind: 'vocab', title: 'Từ vựng Bài 1', minutes: 30, blocks: [{ t: 'vocab', items: [{ w: '{学生|がくせい}', pos: 'n', ipa: 'gakusei', vi: 'học sinh', ex: '', exVi: '' }] }] }] };
      throw new Error('404');
    });
    const { default: routes } = await import('./hocLieu.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/hoc-lieu', routes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const hoc = await prisma.user.create({ data: { username: `${tag}h`, email: `${tag}h@test.local` } });
    const admin = await prisma.user.create({ data: { username: `${tag}a`, email: `${tag}a@test.local` } });
    ids.hoc = hoc.id; ids.admin = admin.id;
    const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
    ids.role = role.id;
    await prisma.userRole.create({ data: { userId: admin.id, roleId: role.id } });
    tokHoc = sign(hoc, []);
    tokAdmin = sign(admin, ['ROLE_ADMIN']);
    ctwHoc = (await createToken(hoc.id, { name: 'cuongmini', scopes: ['read'] })).token;

    const c = await prisma.course.create({
      data: {
        title: 'Linux test|||Linux thử', slug: `${tag}-linux`, isPublished: true, status: 'PUBLISHED', accessType: 'PAID', isFree: false, price: 100000,
        sections: { create: [{ title: 'Ch1|||Chương 1', sortOrder: 1, lessons: { create: [
          { title: 'Intro|||Giới thiệu', slug: `${tag}-l0`, sortOrder: 1, isFreePreview: true, content: '<div class="ml-vi"><p>Bài xem thử</p></div><div class="ml-en"><p>Preview</p></div>' },
          { title: 'ls|||Lệnh ls', slug: `${tag}-l1`, sortOrder: 2, content: '<div class="ml-vi"><h2>Lệnh ls</h2><pre><code class="language-bash">ls -la</code></pre></div><div class="ml-en"><p>EN</p></div>', videoUrl: 'https://www.youtube.com/watch?v=abcdefghijk' },
        ] } }] },
      },
      include: { sections: { include: { lessons: true } } },
    });
    ids.course = c.id;
    const l1 = c.sections[0]!.lessons.find((l) => l.slug === `${tag}-l1`)!;
    await prisma.lessonTranscript.create({ data: { lessonId: l1.id, videoId: 'abcdefghijk', cues: [{ t: 3, en: 'list files with ls' }], soCau: 1, soTu: 4 } });

    const g = await prisma.codeGroup.create({ data: { name: `${tag} group`, slug: `${tag}-g` } });
    ids.group = g.id;
    const tr = await prisma.codeTrack.create({ data: { groupId: g.id, name: `${tag} track`, slug: `${tag}-t`, language: 'bash', status: 'PUBLISHED' } });
    const mo = await prisma.codeModule.create({ data: { trackId: tr.id, name: 'M1', slug: `${tag}-m` } });
    await prisma.codeExercise.create({ data: { moduleId: mo.id, trackId: tr.id, title: 'Đếm tệp', slug: `${tag}-ex`, language: 'bash', status: 'PUBLISHED', problemHtmlVi: '<p>Đếm số tệp trong thư mục.</p>', solutionCodeJson: { bash: 'ls | wc -l # LOI-GIAI-BI-MAT' } } });
  });

  after(async () => {
    _datNguonLay(null);
    await prisma.codeGroup.deleteMany({ where: { id: ids.group } }).catch(() => {});
    await prisma.course.deleteMany({ where: { id: ids.course } });
    await prisma.user.deleteMany({ where: { id: { in: [ids.hoc, ids.admin] } } });
    server?.close();
    await prisma.$disconnect();
  });

  it('chưa mua: mục lục có, bài trả phí KHÔNG có nội dung; bài xem thử đọc được (tiếng Việt)', async () => {
    const ml = await call(tokHoc, `?action=outline&course=${tag}-linux`);
    assert.equal(ml.status, 200);
    assert.equal(ml.data.chuong[0].bai.length, 2);
    assert.deepEqual(ml.data.chuong[0].bai.map((b: any) => b.mo), [true, false]);
    const tra = await call(tokHoc, `?action=lesson&course=${tag}-linux&lesson=${tag}-l1`);
    assert.equal(tra.status, 200);
    assert.equal(tra.data.khoa_noi_dung, true);
    assert.equal(tra.data.noiDung, undefined);
    const thu = await call(ctwHoc, `?action=lesson&course=${tag}-linux&lesson=${tag}-l0`);
    assert.match(thu.data.noiDung, /Bài xem thử/);
    assert.doesNotMatch(thu.data.noiDung, /Preview/);
  });

  it('admin đọc trọn bài trả phí: nội dung + code + lời giảng video (phụ đề)', async () => {
    const r = await call(tokAdmin, `?action=lesson&course=${tag}-linux&lesson=${tag}-l1`);
    assert.equal(r.status, 200);
    assert.match(r.data.noiDung, /### Lệnh ls/);
    assert.match(r.data.noiDung, /```bash\nls -la\n```/);
    assert.match(r.data.noiDung, /\[00:03\] list files with ls/);
    assert.match(r.data.link, /\/learn\?lessonSlug=/);
  });

  it('đề Code Lab: có đề, KHÔNG có lời giải', async () => {
    const r = await call(tokHoc, `?action=exercises&exercise=${tag}-ex`);
    assert.equal(r.status, 200);
    assert.match(r.data.noiDung, /Đếm số tệp trong thư mục/);
    assert.doesNotMatch(r.data.noiDung, /LOI-GIAI-BI-MAT/);
  });

  it('Dekiru Bài 1: mục lục nhóm + đọc mục từ vựng', async () => {
    const o = await call(ctwHoc, '?action=outline&book=dekiru&bai=1');
    assert.equal(o.data.nhom[0].muc[0].id, 'b1-tu-vung');
    const m = await call(ctwHoc, '?action=lesson&book=dekiru&bai=1&item=b1-tu-vung');
    assert.match(m.data.noiDung, /\*\*学生\(がくせい\)\*\* · gakusei · học sinh/);
  });

  it('tiến độ: chạy được cho người mới (không có dữ liệu) và có lời khuyên', async () => {
    const r = await call(tokHoc, '/tien-do');
    assert.equal(r.status, 200);
    assert.ok(Array.isArray(r.data.mon));
    assert.ok(r.data.deXuat.length >= 1);
    assert.match(r.data.baoCao, /Tiến độ & đánh giá/);
  });

  it('không đăng nhập ⇒ 401', async () => {
    const res = await fetch(`${base}/api/v1/hoc-lieu?action=outline&book=dekiru`);
    assert.equal(res.status, 401);
  });
});
