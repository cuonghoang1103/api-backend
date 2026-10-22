/**
 * Khoá "Sắp ra mắt" (status = COMING_SOON) trên CSDL thật — hiện được, nhưng KHÔNG học/mua/ghi danh được.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/course.sapRaMat.db.test.ts
 *
 * Hai khoá tạm:
 *   A — đúng quy ước seed: isPublished=false, FREE, 2 chương / 3 bài chưa xuất bản.
 *   B — "lỡ tay": isPublished=TRUE + PAID — chứng minh cửa chặn theo `status`, không chỉ nhờ isPublished.
 * Cuối cùng lật A sang PUBLISHED: mọi thứ phải chạy như khoá thường.
 */
import './work.ctw5b.testenv.js';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { randomBytes } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `srm-${randomBytes(3).toString('hex')}`;

describe('Khoá "Sắp ra mắt" — hiện khung, khoá mọi cửa (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let token = '';
  let userId = 0;
  let A = 0;
  let B = 0;
  const lessonIds: number[] = [];

  const call = async (method: string, p: string, body?: unknown, auth = true) => {
    const res = await fetch(`${base}${p}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as any };
  };

  before(async () => {
    const { default: courseRoutes } = await import('./course.routes.js');
    const { default: paymentRoutes } = await import('./payment.routes.js');
    const { default: academyRoutes } = await import('./academy.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/courses', courseRoutes);
    app.use('/api/v1/payments', paymentRoutes);
    app.use('/api/v1/academy', academyRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const u = await prisma.user.create({ data: { username: tag.replace(/-/g, '_'), email: `${tag}@example.com`, password: 'x' } });
    userId = u.id;
    token = jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: 0 }, config.jwtSecret);

    const a = await prisma.course.create({
      data: {
        slug: `${tag}-a`, title: `Swift ${tag}|||Swift ${tag}`, status: 'COMING_SOON', isPublished: false,
        accessType: 'FREE', isFree: true, shortDescription: 'Khung',
        sections: {
          create: [
            { title: 'Section 0|||Mục 0', sortOrder: 0, lessons: { create: [
              { title: 'Start here (1/2)|||Bắt đầu tại đây (1/2)', sortOrder: 0, isPublished: false, content: 'BI-MAT' },
              { title: 'Start here (2/2)|||Bắt đầu tại đây (2/2)', sortOrder: 1, isPublished: false },
            ] } },
            { title: 'Chapter 1|||Chương 1', sortOrder: 1, lessons: { create: [
              { title: '1.1 — Swift|||1.1 — Swift', sortOrder: 0, isPublished: false },
            ] } },
          ],
        },
      },
      include: { sections: { include: { lessons: true } } },
    });
    A = a.id;
    lessonIds.push(...a.sections.flatMap((s) => s.lessons.map((l) => l.id)));
    const b = await prisma.course.create({
      data: {
        slug: `${tag}-b`, title: `Android ${tag}`, status: 'COMING_SOON', isPublished: true,
        accessType: 'PAID', isFree: false, price: 100000,
      },
    });
    B = b.id;
  });

  after(async () => {
    server?.close();
    await prisma.enrollment.deleteMany({ where: { courseId: { in: [A, B] } } }).catch(() => {});
    await prisma.courseOrder.deleteMany({ where: { courseId: { in: [A, B] } } }).catch(() => {});
    await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } }).catch(() => {});
    await prisma.courseSection.deleteMany({ where: { courseId: { in: [A, B] } } }).catch(() => {});
    await prisma.course.deleteMany({ where: { id: { in: [A, B] } } }).catch(() => {});
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('chuong-trinh: nằm trong sapRaMat (kèm số chương/bài dự kiến), KHÔNG lẫn vào chuaXep/kỳ, không tính vào tong.khoa', async () => {
    const { status, body } = await call('GET', '/api/v1/courses/chuong-trinh', undefined, false);
    assert.equal(status, 200);
    const d = body.data;
    const trongSapRa = d.sapRaMat.flatMap((n: any) => n.mon);
    const a = trongSapRa.find((m: any) => m.id === A);
    assert.ok(a, 'A phải có trong sapRaMat');
    assert.ok(trongSapRa.some((m: any) => m.id === B), 'B (isPublished=true) cũng chỉ ở sapRaMat');
    assert.equal(a.sapRaMat, true);
    assert.equal(a.soChuongDuKien, 2);
    assert.equal(a.soBaiDuKien, 3);
    const thuong = [...d.chuaXep, ...d.nam.flatMap((n: any) => n.ky.flatMap((k: any) => k.mon))];
    assert.ok(!thuong.some((m: any) => m.id === A || m.id === B));
    assert.ok(d.tong.sapRaMat >= 2);
  });

  it('danh sách /courses (web, iOS, desktop) không liệt kê khoá sắp ra mắt', async () => {
    const { body } = await call('GET', `/api/v1/courses?gon=1&size=50&keyword=${tag}`, undefined, false);
    assert.equal(body.data.length, 0);
  });

  it('trang giới thiệu: chỉ KHUNG — tên chương/bài, mọi cờ học/mua tắt, không lộ nội dung', async () => {
    const { status, body } = await call('GET', `/api/v1/courses/${tag}-a?gon=1`);
    assert.equal(status, 200);
    const k = body.data;
    assert.equal(k.comingSoon, true);
    assert.equal(k.isEnrolled, false, 'khoá FREE + đã đăng nhập vẫn KHÔNG được "Học ngay"');
    assert.equal(k.hasPaidAccess, false);
    assert.equal(k.sections.length, 2);
    assert.deepEqual(k.sections[0].lessons.map((l: any) => l.title), ['Start here (1/2)|||Bắt đầu tại đây (1/2)', 'Start here (2/2)|||Bắt đầu tại đây (2/2)']);
    assert.ok(!JSON.stringify(k).includes('BI-MAT'), 'nội dung bài không bao giờ lộ');
  });

  it('ghi danh / tích tiến độ / mở bài ⇒ 409 COURSE_COMING_SOON', async () => {
    const ghiDanh = await call('POST', `/api/v1/courses/${A}/enroll`);
    assert.equal(ghiDanh.status, 409);
    assert.equal(ghiDanh.body.code, 'COURSE_COMING_SOON');
    const tienDo = await call('POST', `/api/v1/courses/${A}/progress`, { lessonId: lessonIds[0], isCompleted: true });
    assert.equal(tienDo.status, 409);
    const bai = await call('GET', `/api/v1/courses/${A}/lessons/${lessonIds[0]}`);
    assert.equal(bai.status, 409);
    assert.ok(!JSON.stringify(bai.body).includes('BI-MAT'));
    assert.equal(await prisma.enrollment.count({ where: { courseId: A } }), 0);
  });

  it('mua / mã kích hoạt ⇒ 409 kể cả khi isPublished lỡ bật (chặn theo status)', async () => {
    const mua = await call('POST', '/api/v1/payments/course', { courseId: B });
    assert.equal(mua.status, 409);
    assert.equal(mua.body.code, 'COURSE_COMING_SOON');
    const ma = await call('POST', '/api/v1/academy/activate-code', { courseId: B, code: 'ABCD1234' });
    assert.equal(ma.status, 409);
    assert.equal(await prisma.courseOrder.count({ where: { courseId: B } }), 0);
  });

  it('lật sang PUBLISHED ⇒ chạy như khoá thường (giới thiệu đầy đủ, ghi danh được)', async () => {
    await prisma.course.update({ where: { id: A }, data: { status: 'PUBLISHED', isPublished: true } });
    await prisma.lesson.updateMany({ where: { id: { in: lessonIds } }, data: { isPublished: true } });
    const { body } = await call('GET', `/api/v1/courses/${tag}-a?gon=1`);
    assert.equal(body.data.comingSoon, undefined);
    const ghiDanh = await call('POST', `/api/v1/courses/${A}/enroll`);
    assert.ok([200, 201].includes(ghiDanh.status), `ghi danh phải được, nhận ${ghiDanh.status}`);
    const ct = await call('GET', '/api/v1/courses/chuong-trinh', undefined, false);
    assert.ok(ct.body.data.chuaXep.some((m: any) => m.id === A), 'giờ là khoá thường chưa xếp kỳ ⇒ "Khoá mới"');
  });
});
