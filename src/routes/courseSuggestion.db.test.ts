/**
 * Góp ý & bổ sung cho khoá học (14/11/2026) trên CSDL thật — HTTP thật qua đúng các router được mount ở prod.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/courseSuggestion.db.test.ts
 *
 * Phủ: tạo (Zod, AI phải có tenAi, bài phải thuộc khoá, chặn trùng, trần 5/giờ) · lọc (trạng thái/loại/bài, AN ẩn với
 * người thường) · vote bật/tắt · admin PATCH (người thường 403) · đường internal (token sai ⇒ 404, liệt kê, ghi đối
 * chiếu, đăng AI_AGENT).
 */
import './work.ctw5b.testenv.js';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { randomBytes } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

// Không bao giờ bắn Telegram thật từ test, và bật đường internal bằng một khoá giả.
process.env.TELEGRAM_BOT_TOKEN = '';
process.env.TELEGRAM_ADMIN_CHAT_ID = '';
const KHOA_NOI_BO = `test-${randomBytes(8).toString('hex')}`;
process.env.INTERNAL_API_TOKEN = KHOA_NOI_BO;

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `gyk${randomBytes(3).toString('hex')}`;

describe('Góp ý & bổ sung khoá học (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let prisma: any;
  let jwt: any;
  let config: any;
  let courseId = 0;
  let khoaKhacId = 0;
  const slug = `${tag}-khoa`;
  let baiId = 0;
  let baiKhacKhoaId = 0;
  const userIds: number[] = [];
  type U = { id: number; token: string };
  let hv: U, hv2: U, admin: U, spam: U;

  async function mkUser(name: string, laAdmin = false): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@example.com`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', emailVerified: true } });
    if (laAdmin) {
      const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: laAdmin ? ['ROLE_ADMIN'] : [], roleVersion: 0 }, config.jwtSecret) };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as any };
  }
  const noiBo = (method: string, path: string, body?: unknown) =>
    call(null, method, `/internal${path}`, body, { 'x-internal-token': KHOA_NOI_BO });

  before(async () => {
    ({ prisma } = await import('../config/database.js'));
    jwt = (await import('jsonwebtoken')).default;
    ({ config } = await import('../config/env.js'));
    const express = (await import('express')).default;
    const { errorHandler } = await import('../middleware/errorHandler.js');
    const { default: courseRoutes } = await import('./course.routes.js');
    const { default: adminRoutes } = await import('./admin.routes.js');
    const { default: internalRoutes } = await import('./internal.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/courses', courseRoutes);
    app.use('/api/v1/admin', adminRoutes);
    app.use('/api/v1/internal', internalRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const k = await prisma.course.create({
      data: {
        slug, title: `Test ${tag}|||Khoá thử ${tag}`, status: 'PUBLISHED', isPublished: true, accessType: 'FREE', isFree: true,
        sections: { create: [{ title: 'C1|||Chương 1', sortOrder: 0, lessons: { create: [
          { title: '1.1 Intro|||1.1 Mở đầu', slug: `${tag}-1-1-mo-dau`, sortOrder: 0, isPublished: true },
        ] } }] },
      },
      include: { sections: { include: { lessons: true } } },
    });
    courseId = k.id;
    baiId = k.sections[0].lessons[0].id;
    const k2 = await prisma.course.create({
      data: {
        slug: `${tag}-khac`, title: 'Khác', status: 'PUBLISHED', isPublished: true,
        sections: { create: [{ title: 'X', lessons: { create: [{ title: 'Y', slug: `${tag}-y` }] } }] },
      },
      include: { sections: { include: { lessons: true } } },
    });
    khoaKhacId = k2.id;
    baiKhacKhoaId = k2.sections[0].lessons[0].id;

    hv = await mkUser('hv');
    hv2 = await mkUser('hv2');
    spam = await mkUser('spam');
    admin = await mkUser('ad', true);
  });

  after(async () => {
    server?.close();
    if (prisma) {
      const ids = (await prisma.courseSuggestion.findMany({ where: { courseId: { in: [courseId, khoaKhacId] } }, select: { id: true } }))
        .map((r: { id: number }) => r.id);
      await prisma.adminNotification.deleteMany({ where: { khoaChongTrung: { in: ids.map((i: number) => `GOP_Y_KHOA:${i}`) } } }).catch(() => {});
      await prisma.course.deleteMany({ where: { id: { in: [courseId, khoaKhacId] } } }).catch(() => {}); // CASCADE góp ý + phiếu
      await prisma.userRole.deleteMany({ where: { userId: { in: userIds } } }).catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
      await prisma.$disconnect();
    }
  });

  let gyId = 0;

  it('GET công khai: khoá có thật ⇒ 200 rỗng, không cần đăng nhập; khoá không có ⇒ 404', async () => {
    const r = await call(null, 'GET', `/courses/${slug}/suggestions`);
    assert.equal(r.status, 200);
    assert.equal(r.body.data.total, 0);
    assert.equal((await call(null, 'GET', `/courses/${tag}-khong-co/suggestions`)).status, 404);
  });

  it('POST: chưa đăng nhập ⇒ 401; nội dung ngắn ⇒ 400; AI thiếu tenAi ⇒ 400; bài khoá khác ⇒ 400', async () => {
    const hop = { loai: 'THIEU_KIEN_THUC', noiDung: 'Bài thiếu phần giải thích event loop phase.' };
    assert.equal((await call(null, 'POST', `/courses/${slug}/suggestions`, hop)).status, 401);
    assert.equal((await call(hv, 'POST', `/courses/${slug}/suggestions`, { ...hop, noiDung: 'ngắn' })).status, 400);
    const ai = await call(hv, 'POST', `/courses/${slug}/suggestions`, { ...hop, laAi: true });
    assert.equal(ai.status, 400);
    assert.match(ai.body.message, /tenAi/);
    assert.equal((await call(hv, 'POST', `/courses/${slug}/suggestions`, { ...hop, lessonId: baiKhacKhoaId })).status, 400);
    assert.equal((await call(hv, 'POST', `/courses/${slug}/suggestions`, { ...hop, nguon: 'javascript:alert(1)' })).status, 400);
  });

  it('POST hợp lệ (gắn bài theo slug) ⇒ 201, không lộ email; nội dung trùng (khác hoa/thường, dấu câu) ⇒ 409', async () => {
    const r = await call(hv, 'POST', `/courses/${slug}/suggestions`, {
      vaiTro: 'CHUYEN_GIA', loai: 'SAI_SOT', noiDung: 'Mục 1.1 nói setTimeout(0) chạy trước Promise — sai thứ tự microtask.',
      nguon: 'https://nodejs.org/en/learn', lessonSlug: `${tag}-1-1-mo-dau`,
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    gyId = r.body.data.id;
    assert.equal(r.body.data.trangThai, 'MOI');
    assert.equal(r.body.data.vaiTro, 'CHUYEN_GIA');
    assert.equal(r.body.data.lesson.id, baiId);
    assert.ok(!JSON.stringify(r.body).includes('@example.com'), 'không được lộ email');

    const trung = await call(hv2, 'POST', `/courses/${slug}/suggestions`, {
      loai: 'SAI_SOT', noiDung: 'mục 1.1 nói settimeout(0) chạy trước promise   sai thứ tự microtask',
    });
    assert.equal(trung.status, 409);
    assert.equal(trung.body.data?.trungVoiId ?? trung.body.trungVoiId ?? gyId, gyId);
  });

  it('trần 5 góp ý/giờ/người ⇒ lượt thứ 6 trả 429', async () => {
    for (let i = 0; i < 5; i++) {
      const r = await call(spam, 'POST', `/courses/${slug}/suggestions`, { loai: 'KHAC', noiDung: `Góp ý số ${i} — nội dung đủ dài ${i}` });
      assert.equal(r.status, 201, JSON.stringify(r.body));
    }
    const r6 = await call(spam, 'POST', `/courses/${slug}/suggestions`, { loai: 'KHAC', noiDung: 'Góp ý số sáu vượt trần giờ' });
    assert.equal(r6.status, 429);
  });

  it('vote bật/tắt, cập nhật soPhieu và daBau theo người xem', async () => {
    const v1 = await call(hv2, 'POST', `/courses/${slug}/suggestions/${gyId}/vote`);
    assert.equal(v1.status, 200);
    assert.deepEqual(v1.body.data, { daBau: true, soPhieu: 1 });
    await call(hv, 'POST', `/courses/${slug}/suggestions/${gyId}/vote`);
    const ds = await call(hv2, 'GET', `/courses/${slug}/suggestions?loai=SAI_SOT`);
    assert.equal(ds.body.data.items[0].soPhieu, 2);
    assert.equal(ds.body.data.items[0].daBau, true);
    const v2 = await call(hv2, 'POST', `/courses/${slug}/suggestions/${gyId}/vote`);
    assert.deepEqual(v2.body.data, { daBau: false, soPhieu: 1 });
    assert.equal((await call(null, 'POST', `/courses/${slug}/suggestions/${gyId}/vote`)).status, 401);
  });

  it('lọc: loai, lessonId, trangThai; trạng thái lạ ⇒ 400', async () => {
    const theoBai = await call(null, 'GET', `/courses/${slug}/suggestions?lessonId=${baiId}`);
    assert.equal(theoBai.body.data.total, 1);
    const khac = await call(null, 'GET', `/courses/${slug}/suggestions?loai=KHAC&limit=2&page=2`);
    assert.equal(khac.body.data.total, 5);
    assert.equal(khac.body.data.items.length, 2);
    assert.equal((await call(null, 'GET', `/courses/${slug}/suggestions?trangThai=XYZ`)).status, 400);
    const dem = await call(null, 'GET', `/courses/${slug}/suggestions/dem`);
    assert.equal(dem.body.data.tong, 6);
  });

  it('admin PATCH: người thường 403; admin đổi DA_CO + bằng chứng; AN ⇒ ẩn khỏi công khai nhưng admin vẫn thấy', async () => {
    assert.equal((await call(hv, 'PATCH', `/admin/course-suggestions/${gyId}`, { trangThai: 'AN' })).status, 403);
    assert.equal((await call(null, 'GET', '/admin/course-suggestions')).status, 401);

    const p = await call(admin, 'PATCH', `/admin/course-suggestions/${gyId}`, {
      trangThai: 'DA_CO', ketQuaDoiChieu: 'Đã có ở 1.1, đoạn "microtask chạy trước".',
      bangChung: [{ lessonSlug: `${tag}-1-1-mo-dau`, tieuDe: '1.1 Mở đầu', trichDoan: 'microtask chạy trước macrotask' }],
    });
    assert.equal(p.status, 200, JSON.stringify(p.body));
    assert.equal(p.body.data.trangThai, 'DA_CO');
    assert.ok(p.body.data.doiChieuLuc);
    assert.match(p.body.data.nguoiDoiChieu, /^admin:/);
    assert.equal(p.body.data.bangChung[0].trichDoan, 'microtask chạy trước macrotask');
    assert.equal((await call(admin, 'PATCH', `/admin/course-suggestions/${gyId}`, { trangThai: 'LUNG_TUNG' })).status, 400);

    const ds = await call(admin, 'GET', `/admin/course-suggestions?trangThai=DA_CO&courseSlug=${slug}`);
    assert.equal(ds.status, 200);
    assert.equal(ds.body.data.total, 1);

    await call(admin, 'PATCH', `/admin/course-suggestions/${gyId}`, { trangThai: 'AN' });
    const cong = await call(null, 'GET', `/courses/${slug}/suggestions`);
    assert.ok(!cong.body.data.items.some((x: any) => x.id === gyId), 'AN không được lộ ra công khai');
    assert.equal((await call(null, 'GET', `/courses/${slug}/suggestions?trangThai=AN`)).body.data.total, 0);
    assert.equal((await call(null, 'GET', `/courses/${slug}/suggestions/${gyId}`)).status, 404);
    assert.equal((await call(hv2, 'POST', `/courses/${slug}/suggestions/${gyId}/vote`)).status, 404);
    const adThay = await call(admin, 'GET', `/courses/${slug}/suggestions?trangThai=AN`);
    assert.equal(adThay.body.data.total, 1);
    assert.equal(adThay.body.data.laAdmin, true);
  });

  it('internal: thiếu/sai token ⇒ 404; liệt kê kèm course + lesson; ghi đối chiếu (mặc định Claude); đăng AI_AGENT', async () => {
    assert.equal((await call(null, 'GET', '/internal/course-suggestions')).status, 404);
    assert.equal((await call(null, 'GET', '/internal/course-suggestions', undefined, { 'x-internal-token': 'sai' })).status, 404);

    const ds = await noiBo('GET', `/course-suggestions?trangThai=MOI,DANG_DOI_CHIEU&courseSlug=${slug}&limit=100`);
    assert.equal(ds.status, 200);
    assert.equal(ds.body.data.total, 5);
    assert.equal(ds.body.data.items[0].course.slug, slug);

    const motId = ds.body.data.items[0].id;
    const g = await noiBo('PATCH', `/course-suggestions/${motId}`, {
      trangThai: 'NEN_BO_SUNG', ketQuaDoiChieu: 'Chưa có ở đâu trong khoá; nên chèn vào 1.1.',
      bangChung: [{ lessonSlug: `${tag}-1-1-mo-dau`, tieuDe: '1.1 Mở đầu', trichDoan: '(bài nên chèn)' }],
    });
    assert.equal(g.status, 200, JSON.stringify(g.body));
    assert.equal(g.body.data.nguoiDoiChieu, 'Claude');

    const thieuTen = await noiBo('POST', '/course-suggestions', { courseSlug: slug, loai: 'NANG_CAP', noiDung: 'Thêm lab đo event loop lag bằng perf_hooks.' });
    assert.equal(thieuTen.status, 400);
    const dang = await noiBo('POST', '/course-suggestions', {
      courseSlug: slug, tenAi: 'Claude điều phối', loai: 'NANG_CAP', noiDung: 'Thêm lab đo event loop lag bằng perf_hooks.',
      lessonSlug: `${tag}-1-1-mo-dau`,
    });
    assert.equal(dang.status, 201, JSON.stringify(dang.body));
    assert.equal(dang.body.data.vaiTro, 'AI_AGENT');
    assert.equal(dang.body.data.tenAi, 'Claude điều phối');
    assert.equal(dang.body.data.nguoiGui, null);

    // Thông báo admin đã ghi (kênh trong web; Telegram tắt trong test).
    await new Promise((r) => setTimeout(r, 200));
    const tb = await prisma.adminNotification.findFirst({ where: { khoaChongTrung: `GOP_Y_KHOA:${dang.body.data.id}` } });
    assert.ok(tb, 'phải có thông báo admin cho góp ý mới');
    assert.equal(tb.duongDan, `/courses/${slug}/gop-y?id=${dang.body.data.id}`);
  });

  it('xoá bài ⇒ góp ý còn, mất liên kết bài (SET NULL)', async () => {
    await prisma.lesson.delete({ where: { id: baiId } });
    const r = await prisma.courseSuggestion.findUnique({ where: { id: gyId } });
    assert.ok(r);
    assert.equal(r.lessonId, null);
  });
});
