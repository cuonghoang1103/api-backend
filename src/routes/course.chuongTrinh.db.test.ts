/**
 * `GET /api/v1/courses/chuong-trinh` trên CSDL thật (HTTP + Postgres cục bộ).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/course.chuongTrinh.db.test.ts
 *
 * CSDL có thể đã có khoá khác ⇒ test chỉ soi các khoá tạm `cct-<ngẫu nhiên>-*` của chính nó, rồi xoá theo id.
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
const tag = `cct-${randomBytes(3).toString('hex')}`;

describe('GET /courses/chuong-trinh (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  const courseIds: number[] = [];
  let userId = 0;
  let semesterId: number | null = null;
  let token = '';

  const mk = async (s: string, data: Record<string, unknown>) => {
    const c = await prisma.course.create({
      data: { slug: `${tag}-${s}`, title: `${tag} ${s}`, isPublished: true, status: 'PUBLISHED', totalLessons: 4, totalDurationSeconds: 1800, ...data },
    });
    courseIds.push(c.id);
    return c;
  };

  before(async () => {
    const { default: courseRoutes } = await import('./course.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/courses', courseRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    await mk('k2-b', { loTrinhKy: 2, loTrinhThuTu: 2 });
    const a = await mk('k2-a', { loTrinhKy: 2, loTrinhThuTu: 1 });
    await mk('moi', {});
    await mk('nhap', { loTrinhKy: 2, loTrinhThuTu: 3, isPublished: false, status: 'DRAFT' });
    const sem = await prisma.semester.create({ data: { name: `${tag} sem`, code: tag.slice(0, 20), ordinal: 99 } });
    semesterId = sem.id;
    await mk('academy', { loTrinhKy: 2, loTrinhThuTu: 4, semesterId: sem.id });

    const u = await prisma.user.create({ data: { username: tag.replace(/-/g, '_'), email: `${tag}@example.com`, password: 'x' } });
    userId = u.id;
    token = jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: 0 }, config.jwtSecret);
    const sec = await prisma.courseSection.create({ data: { courseId: a.id, title: 's' } });
    const e = await prisma.enrollment.create({ data: { userId: u.id, courseId: a.id, source: 'FREE' } });
    for (const i of [1, 2, 3]) {
      const l = await prisma.lesson.create({ data: { sectionId: sec.id, title: `l${i}`, slug: `${tag}-l${i}`, isPublished: true } });
      await prisma.lessonProgress.create({ data: { enrollmentId: e.id, lessonId: l.id, isCompleted: i !== 3 } });
    }
  });

  after(async () => {
    server?.close();
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    if (courseIds.length) {
      await prisma.lesson.deleteMany({ where: { section: { courseId: { in: courseIds } } } }).catch(() => {});
      await prisma.courseSection.deleteMany({ where: { courseId: { in: courseIds } } }).catch(() => {});
      await prisma.course.deleteMany({ where: { id: { in: courseIds } } }).catch(() => {});
    }
    if (semesterId) await prisma.semester.delete({ where: { id: semesterId } }).catch(() => {});
    await prisma.$disconnect();
  });

  const lay = async (auth?: string) => {
    const res = await fetch(`${base}/api/v1/courses/chuong-trinh`, { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });
    return { res, body: (await res.json()) as any };
  };
  const cuaToi = (ds: Array<{ slug: string }>) => ds.filter((m) => m.slug.startsWith(tag)).map((m) => m.slug.slice(tag.length + 1));

  it('không bị /:slug nuốt; 4 năm · 15 kỳ; xếp đúng kỳ + thứ tự; nháp/Academy không lọt', async () => {
    const { res, body } = await lay();
    assert.equal(res.status, 200);
    assert.match(res.headers.get('cache-control') || '', /^public/);
    const d = body.data;
    assert.equal(d.nam.length, 4);
    const ky = d.nam.flatMap((n: any) => n.ky);
    assert.equal(ky.length, 15);
    const ky2 = ky.find((k: any) => k.so === 2);
    assert.ok(ky2.ten && ky2.tenEn && ky2.moTa && ky2.moTaEn);
    assert.deepEqual(cuaToi(ky2.mon), ['k2-a', 'k2-b']);
    assert.deepEqual(cuaToi(d.chuaXep), ['moi'], 'khoá chưa gán kỳ phải hiện ở "Khoá mới"');
    const moi = d.chuaXep.find((m: any) => m.slug === `${tag}-moi`);
    assert.equal(typeof moi.price, 'number');
    assert.equal(moi.progress, null);
    assert.equal(moi.isEnrolled, false);
    assert.ok(d.tong.khoa >= 3 && d.tong.bai >= 12 && typeof d.tong.gio === 'number');
  });

  it('đăng nhập: isEnrolled + progress (2/4 bài = 50%), Cache-Control private', async () => {
    const { res, body } = await lay(token);
    assert.match(res.headers.get('cache-control') || '', /^private/);
    const ky2 = body.data.nam.flatMap((n: any) => n.ky).find((k: any) => k.so === 2);
    const a = ky2.mon.find((m: any) => m.slug === `${tag}-k2-a`);
    assert.equal(a.isEnrolled, true);
    assert.equal(a.progress, 50);
    const b = ky2.mon.find((m: any) => m.slug === `${tag}-k2-b`);
    assert.equal(b.isEnrolled, false);
    assert.equal(b.progress, null);
  });
});
