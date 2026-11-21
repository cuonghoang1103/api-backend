/**
 * "Dự án xuyên suốt khoá" (21/11/2026) trên CSDL thật — HTTP thật qua đúng router mount ở prod, AI là HÀM GIẢ
 * (`_ai.goi` bị thay ⇒ không bao giờ gọi model thật).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/courseProject.db.test.ts
 *
 * Phủ: GET công khai / của tôi · chọn đề tài · nộp mốc (nháp, thiếu repo, chưa tick đủ, XONG, tiến độ) · đề tài tự
 * chọn + AI duyệt (CAN_SUA giữ đề tài cũ, DUYET không tự thay đề tài đang có, chuyển sang bản đã duyệt, lịch sử, trần
 * lượt/ngày, JSON hỏng vẫn tính lượt) · phòng bảo vệ (chưa đủ mốc, mở phiên, tiếp phiên dở, trả lời JSON + SSE, chấm
 * theo rubric do MÃ cộng, trần phiên/ngày, người khác không đọc được phiên) · khoá không có dự án.
 */
import './work.ctw5b.testenv.js';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { randomBytes } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

process.env.TELEGRAM_BOT_TOKEN = '';
process.env.TELEGRAM_ADMIN_CHAT_ID = '';
// isAiAvailable() cần "có khoá" — khoá giả, vì mọi lời gọi model đều đi qua hàm giả bên dưới.
if (!process.env.LLM_GATEWAY_API_KEY && !process.env.OPENAI_COMPAT_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  process.env.LLM_GATEWAY_API_KEY = 'khoa-gia-cho-test';
}
process.env.DU_AN_DUYET_LUOT_NGAY = '3';
process.env.DU_AN_BAO_VE_PHIEN_NGAY = '1';
process.env.DU_AN_BAO_VE_SO_CAU = '2';
process.env.DU_AN_BAO_VE_MOC_TOI_THIEU = '1';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `dua${randomBytes(3).toString('hex')}`;

describe('Dự án xuyên suốt khoá (HTTP + DB thật, AI giả)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let prisma: any;
  let jwt: any;
  let config: any;
  let svc: any;
  const slug = `${tag}-khoa`;
  const slugTrong = `${tag}-trong`;
  const courseIds: number[] = [];
  const userIds: number[] = [];
  type U = { id: number; token: string };
  let hv: U, hv2: U, la: U, hv3: U;

  /** Kịch bản trả lời của model giả: lấy lần lượt; ghi lại purpose + có onToken không. */
  const kichBan: string[] = [];
  const daGoi: Array<{ purpose: string; stream: boolean; system: string }> = [];

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@example.com`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', emailVerified: true } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret) };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/courses${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as any };
  }

  /** Gọi SSE, gom sự kiện. */
  async function sse(u: U, path: string, body: unknown) {
    const res = await fetch(`${base}/api/v1/courses${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: JSON.stringify(body),
    });
    const text = await res.text();
    return text.split('\n\n').map((f) => f.trim()).filter((f) => f.startsWith('data:')).map((f) => JSON.parse(f.slice(5)));
  }

  before(async () => {
    ({ prisma } = await import('../config/database.js'));
    jwt = (await import('jsonwebtoken')).default;
    ({ config } = await import('../config/env.js'));
    svc = await import('../services/duAn/duAn.service.js');
    svc._ai.goi = async (o: any) => {
      daGoi.push({ purpose: o.purpose, stream: typeof o.onToken === 'function', system: o.system });
      const text = kichBan.shift();
      if (text === undefined) throw new Error('kịch bản AI giả đã hết — test gọi model nhiều hơn dự tính');
      if (text === '__NEM__') throw Object.assign(new Error('cổng giả sập'), { statusCode: 503 });
      if (o.onToken) for (const phan of text.match(/.{1,12}/gs) ?? []) o.onToken(phan);
      return { text, inputTokens: 10, outputTokens: 10, model: 'gia' };
    };
    const express = (await import('express')).default;
    const { errorHandler } = await import('../middleware/errorHandler.js');
    const { default: courseRoutes } = await import('./course.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/courses', courseRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const mkCourse = async (s: string) => {
      const c = await prisma.course.create({ data: { slug: s, title: `Khoá ${s}`, status: 'PUBLISHED', isPublished: true, academyType: 'GENERAL' } });
      courseIds.push(c.id);
      return c;
    };
    const c = await mkCourse(slug);
    await mkCourse(slugTrong);
    const sec = await prisma.courseSection.create({ data: { courseId: c.id, title: 'Ch1', sortOrder: 0 } });
    for (const [i, s] of ['bat-dau', 'k-moc-1', 'k-moc-2', 'k-bao-ve-du-an'].entries()) {
      await prisma.lesson.create({ data: { sectionId: sec.id, slug: s, title: s, sortOrder: i, isPublished: true, lessonType: 'EXERCISE' } });
    }
    const deTai = ['shop', 'thu-vien', 'phong-kham', 'khoa-hoc', 'cafe'].map((s) => ({
      slug: s, ten: `${s}|||${s}`, moTa: 'm|||m', doKho: 2, tinhNang: ['a', 'b', 'c'], banDoChuong: [], thamKhaoThat: [], anh: null,
    }));
    await prisma.courseProjectSpec.create({
      data: {
        courseId: c.id, vanTay: 'test',
        noiDung: {
          version: 1, gioiThieu: 'EN|||VI', deTai,
          tuChon: { yeuCauToiThieu: ['≥ 3 trang'], goiYQuyMo: null },
          moc: [
            { so: 1, slug: 'k-moc-1', ten: 'M1|||Mốc 1', sauChuong: null, yeuCau: ['r'], nangCao: [], datKhi: ['d1', 'd2'], goiY: [], nop: ['repo'] },
            { so: 2, slug: 'k-moc-2', ten: 'M2|||Mốc 2', sauChuong: null, yeuCau: ['r'], nangCao: [], datKhi: ['d1'], goiY: [], nop: ['repo'] },
          ],
          baoVe: { rubric: [{ tieuChi: 'A', diem: 4, moTa: null }, { tieuChi: 'B', diem: 6, moTa: null }], cauHoiMau: ['q1'], chuanBi: ['README'] },
          bai: { dangKy: ['bat-dau'], baoVe: ['k-bao-ve-du-an'] },
        },
      },
    });
    hv = await mkUser('hv');
    hv2 = await mkUser('hv2');
    la = await mkUser('la');
    hv3 = await mkUser('hv3');
  });

  after(async () => {
    await prisma?.course.deleteMany({ where: { id: { in: courseIds } } });
    await prisma?.user.deleteMany({ where: { id: { in: userIds } } });
    server?.close();
    await prisma?.$disconnect();
  });

  it('GET công khai: có dự án, không có "của tôi"; khoá không có dự án ⇒ coDuAn=false', async () => {
    const r = await call(null, 'GET', `/${slug}/du-an`);
    assert.equal(r.status, 200);
    assert.equal(r.body.data.coDuAn, true);
    assert.equal(r.body.data.cuaToi, null);
    assert.equal(r.body.data.duAn.deTai.length, 5);
    const t = await call(hv, 'GET', `/${slugTrong}/du-an`);
    assert.equal(t.body.data.coDuAn, false);
    assert.equal((await call(null, 'GET', `/${tag}-khong-co/du-an`)).status, 404);
  });

  it('ghi cần đăng nhập; nộp mốc trước khi chọn đề tài ⇒ 409', async () => {
    assert.equal((await call(null, 'POST', `/${slug}/du-an/chon`, { deTaiSlug: 'shop' })).status, 401);
    const r = await call(hv, 'POST', `/${slug}/du-an/moc/k-moc-1`, { xong: false });
    assert.equal(r.status, 409);
    assert.equal(r.body.code, 'DU_AN_CHUA_CHON_DE_TAI');
  });

  it('chọn đề tài gợi ý: sai slug 400, đúng ⇒ luaChon GOI_Y', async () => {
    assert.equal((await call(hv, 'POST', `/${slug}/du-an/chon`, { deTaiSlug: 'khong-co' })).status, 400);
    const r = await call(hv, 'POST', `/${slug}/du-an/chon`, { deTaiSlug: 'shop' });
    assert.equal(r.status, 200);
    assert.equal(r.body.data.cuaToi.luaChon.loai, 'GOI_Y');
    assert.equal(r.body.data.cuaToi.luaChon.deTaiSlug, 'shop');
    assert.equal(r.body.data.cuaToi.gioiHan.duyetConLai, 3);
  });

  it('nộp mốc: nháp ⇒ DANG_LAM; XONG thiếu repo / chưa tick đủ ⇒ 400; đủ ⇒ XONG + tiến độ 50%', async () => {
    let r = await call(hv, 'POST', `/${slug}/du-an/moc/k-moc-1`, { xong: false, ghiChu: 'đang làm', repoUrl: '' });
    assert.equal(r.status, 200);
    assert.equal(r.body.data.cuaToi.moc['k-moc-1'].trangThai, 'DANG_LAM');
    r = await call(hv, 'POST', `/${slug}/du-an/moc/k-moc-1`, { xong: true, tuKiem: [0, 1] });
    assert.equal(r.body.code, 'DU_AN_THIEU_REPO');
    r = await call(hv, 'POST', `/${slug}/du-an/moc/k-moc-1`, { xong: true, tuKiem: [0], repoUrl: 'https://github.com/a/b' });
    assert.equal(r.body.code, 'DU_AN_CHUA_TU_KIEM');
    r = await call(hv, 'POST', `/${slug}/du-an/moc/k-moc-1`, { xong: true, tuKiem: [1, 0, 0, 9], repoUrl: 'https://github.com/a/b', ghiChu: 'xong' });
    assert.equal(r.status, 200);
    const m = r.body.data.cuaToi.moc['k-moc-1'];
    assert.equal(m.trangThai, 'XONG');
    assert.deepEqual(m.tuKiem, [0, 1]);
    assert.ok(m.xongLuc);
    assert.equal(m.deTaiTen, 'shop|||shop');
    assert.equal(r.body.data.cuaToi.tienDo.phanTram, 50);
    assert.equal((await call(hv, 'POST', `/${slug}/du-an/moc/khong-co`, { xong: false })).status, 404);
  });

  it('đề tài tự chọn: CAN_SUA giữ đề tài cũ; DUYET không tự thay; chuyển sang bản đã duyệt ⇒ lịch sử', async () => {
    const ban = { ten: 'Web bán hoa', moTa: 'Web bán hoa cho tiệm nhỏ, đặt giao trong ngày.', tinhNang: ['danh sách hoa', 'giỏ hàng', 'đặt hàng'] };
    kichBan.push('```json\n{"ketQua":"CAN_SUA","quyMo":"QUA_NHO","nhanXet":"Thiếu trang quản trị.","goiYSua":["thêm trang admin"]}\n```');
    let r = await call(hv, 'POST', `/${slug}/du-an/tu-chon`, ban);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.data.vuaDuyet.ketQua, 'CAN_SUA');
    assert.equal(r.body.data.cuaToi.luaChon.deTaiSlug, 'shop');
    assert.equal(r.body.data.cuaToi.aiDuyet.goiYSua[0], 'thêm trang admin');
    assert.equal(daGoi.at(-1)!.purpose, 'du_an_duyet');
    assert.match(daGoi.at(-1)!.system, /≥ 3 trang/);

    // chưa duyệt ⇒ không chuyển được
    assert.equal((await call(hv, 'POST', `/${slug}/du-an/chon`, { tuChonDaDuyet: true })).body.code, 'DU_AN_CHUA_DUYET');

    kichBan.push('{"ketQua":"DUYET","quyMo":"VUA","nhanXet":"Ổn.","diemManh":["rõ"],"goiYSua":[]}');
    r = await call(hv, 'POST', `/${slug}/du-an/tu-chon`, { ...ban, tinhNang: [...ban.tinhNang, 'trang admin'] });
    assert.equal(r.body.data.vuaDuyet.ketQua, 'DUYET');
    assert.equal(r.body.data.vuaDuyet.daChot, false, 'đang có đề tài ⇒ không tự thay');
    assert.equal(r.body.data.cuaToi.luaChon.deTaiSlug, 'shop');

    r = await call(hv, 'POST', `/${slug}/du-an/chon`, { tuChonDaDuyet: true });
    assert.equal(r.body.data.cuaToi.luaChon.loai, 'TU_CHON');
    assert.equal(r.body.data.cuaToi.luaChon.ten, 'Web bán hoa');
    assert.equal(r.body.data.cuaToi.lichSu.length, 1);
    assert.equal(r.body.data.cuaToi.lichSu[0].deTaiSlug, 'shop');
    assert.equal(r.body.data.cuaToi.gioiHan.duyetConLai, 1);
    // mốc đã nộp vẫn còn sau khi đổi đề tài
    assert.equal(r.body.data.cuaToi.moc['k-moc-1'].trangThai, 'XONG');
  });

  it('AI trả JSON hỏng ⇒ 502 nhưng vẫn tính lượt; hết lượt ⇒ 429 (không gọi model)', async () => {
    kichBan.push('xin lỗi tôi không trả JSON');
    const ban = { ten: 'Quản lý ký túc xá', moTa: 'Quản lý phòng, sinh viên, hoá đơn điện nước.', tinhNang: ['phòng', 'sinh viên', 'hoá đơn'] };
    let r = await call(hv, 'POST', `/${slug}/du-an/tu-chon`, ban);
    assert.equal(r.status, 502);
    const truoc = daGoi.length;
    r = await call(hv, 'POST', `/${slug}/du-an/tu-chon`, ban);
    assert.equal(r.status, 429);
    assert.equal(r.body.code, 'DU_AN_HET_LUOT_DUYET');
    assert.equal(daGoi.length, truoc, 'hết lượt thì không được gọi model');
  });

  it('người chưa có đề tài + DUYET ⇒ chốt luôn đề tài tự chọn', async () => {
    kichBan.push('{"ketQua":"DUYET","quyMo":"VUA","nhanXet":"Tốt."}');
    const r = await call(hv2, 'POST', `/${slug}/du-an/tu-chon`, { ten: 'Đặt sân bóng', moTa: 'Đặt sân mini theo giờ, thanh toán tại sân.', tinhNang: ['lịch sân', 'đặt', 'huỷ'] });
    assert.equal(r.body.data.vuaDuyet.daChot, true);
    assert.equal(r.body.data.cuaToi.luaChon.loai, 'TU_CHON');
  });

  it('bảo vệ: chưa đủ mốc ⇒ 409; mở phiên (SSE) ⇒ câu 1; mở lại ⇒ tiếp phiên dở không gọi AI', async () => {
    let r = await call(hv2, 'POST', `/${slug}/du-an/bao-ve`, {});
    assert.equal(r.body.code, 'DU_AN_CHUA_DU_MOC');

    kichBan.push('Chào em. **Câu 1/2**: Vì sao em chọn useState cho giỏ hàng?');
    const ev = await sse(hv, `/${slug}/du-an/bao-ve-stream`, { ngonNgu: 'vi' });
    assert.ok(ev.filter((e) => e.type === 'delta').length >= 2, 'phải chảy chữ');
    const done = ev.find((e) => e.type === 'done');
    assert.ok(done, JSON.stringify(ev));
    assert.equal(done.data.phien.length, 1);
    assert.equal(done.data.tiepTuc, false);
    assert.equal(daGoi.at(-1)!.purpose, 'du_an_bao_ve');
    assert.match(daGoi.at(-1)!.system, /Web bán hoa/);
    const id = done.data.id;

    const truoc = daGoi.length;
    r = await call(hv, 'POST', `/${slug}/du-an/bao-ve`, {});
    assert.equal(r.body.data.id, id);
    assert.equal(r.body.data.tiepTuc, true);
    assert.equal(daGoi.length, truoc);

    // người khác không đọc được phiên
    assert.equal((await call(hv2, 'GET', `/${slug}/du-an/bao-ve/${id}`)).status, 404);

    // câu 1 → hội đồng hỏi câu 2 (JSON)
    kichBan.push('Đúng một phần. **Câu 2/2**: Đổi yêu cầu lọc theo giá thì sửa file nào?');
    r = await call(hv, 'POST', `/${slug}/du-an/bao-ve/${id}/tra-loi`, { traLoi: 'Vì state cục bộ đủ dùng.' });
    assert.equal(r.status, 200);
    assert.equal(r.body.data.phien.length, 3);

    // câu cuối (SSE) → chấm: model nói tổng 10 nhưng mã tự cộng
    kichBan.push('{"tieuChi":[{"i":0,"diem":3.5,"nhanXet":"chạy"},{"i":1,"diem":7,"nhanXet":"hiểu"}],"chung":"Khá.","diemManh":["rõ"],"canCaiThien":["test"],"tong":10}');
    const ev2 = await sse(hv, `/${slug}/du-an/bao-ve/${id}/tra-loi-stream`, { traLoi: 'Sửa ProductFilter.jsx và hàm lọc trong store.' });
    assert.ok(ev2.some((e) => e.type === 'grading'));
    const d2 = ev2.find((e) => e.type === 'done');
    assert.equal(d2.data.trangThai, 'DA_CHAM');
    assert.equal(d2.data.diem, 9.5, '3,5 + 6 (kẹp từ 7)');
    assert.equal(d2.data.diemChiTiet[1].diem, 6);

    // phiên đã đóng ⇒ trả lời nữa là 409
    assert.equal((await call(hv, 'POST', `/${slug}/du-an/bao-ve/${id}/tra-loi`, { traLoi: 'x' })).body.code, 'DU_AN_PHIEN_DA_DONG');

    // GET tổng hợp: điểm cao nhất + hết phiên hôm nay
    const g = await call(hv, 'GET', `/${slug}/du-an`);
    assert.equal(g.body.data.cuaToi.baoVe.diemCaoNhat, 9.5);
    assert.equal(g.body.data.cuaToi.baoVe.baoVeConLai ?? g.body.data.cuaToi.gioiHan.baoVeConLai, 0);
    r = await call(hv, 'POST', `/${slug}/du-an/bao-ve`, {});
    assert.equal(r.status, 429);
    assert.equal(r.body.code, 'DU_AN_HET_PHIEN');
  });

  it('AI sập giữa lượt hỏi ⇒ câu trả lời vẫn được lưu; /hoi-lai hỏi tiếp đúng chỗ', async () => {
    await call(hv3, 'POST', `/${slug}/du-an/chon`, { deTaiSlug: 'thu-vien' });
    await call(hv3, 'POST', `/${slug}/du-an/moc/k-moc-2`, { xong: true, tuKiem: [0], repoUrl: 'https://github.com/x/z' });
    kichBan.push('**Câu 1/2**: Sách mượn quá hạn tính thế nào?');
    const mo = await call(hv3, 'POST', `/${slug}/du-an/bao-ve`, {});
    const id = mo.body.data.id;
    kichBan.push('__NEM__');
    const r = await call(hv3, 'POST', `/${slug}/du-an/bao-ve/${id}/tra-loi`, { traLoi: 'So hạn trả với ngày hôm nay.' });
    assert.ok(r.status >= 500);
    const g = await call(hv3, 'GET', `/${slug}/du-an/bao-ve/${id}`);
    assert.equal(g.body.data.phien.at(-1).role, 'user', 'câu trả lời không mất');
    assert.equal(g.body.data.phien.at(-1).content, 'So hạn trả với ngày hôm nay.');
    kichBan.push('Đúng. **Câu 2/2**: Lưu ngày trả ở đâu?');
    const h = await call(hv3, 'POST', `/${slug}/du-an/bao-ve/${id}/hoi-lai`, {});
    assert.equal(h.body.data.phien.length, 3);
    assert.equal(h.body.data.phien.at(-1).role, 'assistant');
  });

  it('kết thúc sớm khi < 2 câu ⇒ BO_DO không gọi AI', async () => {
    await call(la, 'POST', `/${slug}/du-an/chon`, { deTaiSlug: 'cafe' });
    await call(la, 'POST', `/${slug}/du-an/moc/k-moc-2`, { xong: true, tuKiem: [0], repoUrl: 'https://github.com/x/y' });
    kichBan.push('**Câu 1/2**: Giới thiệu dự án?');
    const r = await call(la, 'POST', `/${slug}/du-an/bao-ve`, { ngonNgu: 'en' });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const truoc = daGoi.length;
    const k = await call(la, 'POST', `/${slug}/du-an/bao-ve/${r.body.data.id}/ket-thuc`, {});
    assert.equal(k.body.data.trangThai, 'BO_DO');
    assert.equal(daGoi.length, truoc);
    assert.equal(kichBan.length, 0, 'mọi kịch bản AI đã dùng đúng số lần');
  });
});
