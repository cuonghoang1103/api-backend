/**
 * Ảnh Cộng đồng CT Language (15/11/2026) trên CSDL THẬT (local) với KHO GIẢ (không chạm R2 / sandbox): tải lên ⇒ gắn
 * khi đăng / sửa / trả lời, chỉ ảnh của mình, ≤ 4 / ≤ 2, ảnh theo bài ra bảng tin + chi tiết, báo cáo ảnh đủ ngưỡng ⇒ ẩn,
 * admin gỡ ⇒ xoá tệp, xoá bài ⇒ xoá ảnh, dọn ảnh mồ côi.
 *
 *   npx tsx --test src/services/ctlanguage/congDongAnh.db.test.ts
 *
 * Tạo 5 user tạm, xoá đúng các user đó (FK CASCADE dọn bài/trả lời/ảnh) + thông báo admin. Không DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';
import sharp from 'sharp';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let cd: typeof import('./congDong.js');
let ca: typeof import('./congDongAnh.js');
let kd: typeof import('../kiemDuyetAdmin.service.js');
const ids: number[] = [];
let [a, b, c, d, adm] = [0, 0, 0, 0, 0];
const kho = new Map<string, number>();
const daXoa: string[] = [];
let png: Buffer;

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  cd = await import('./congDong.js');
  ca = await import('./congDongAnh.js');
  kd = await import('../kiemDuyetAdmin.service.js');
  ca.__datKhoAnh({
    put: async (key, body) => { kho.set(key, body.length); return { url: `https://media.test.invalid/${key}` }; },
    delMany: async (keys) => { for (const k of keys) { kho.delete(k); daXoa.push(k); } },
  });
  png = await sharp({ create: { width: 800, height: 600, channels: 3, background: { r: 10, g: 120, b: 200 } } }).png().toBuffer();
  const tag = `cda${Date.now().toString(36)}`;
  for (let i = 0; i < 5; i++) {
    const u = await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, displayName: `Người ${i}` } });
    ids.push(u.id);
  }
  [a, b, c, d, adm] = ids;
});

after(async () => {
  if (!coDb) return;
  ca.__datKhoAnh(null);
  await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('tải ⇒ gắn khi đăng (đúng thứ tự) ⇒ có trong bảng tin + chi tiết; ảnh người khác / quá 4 ⇒ từ chối, không tạo bài', async () => {
  const [x1, x2, x3, x4, x5] = await Promise.all([1, 2, 3, 4, 5].map(() => ca.taiAnh(a, png)));
  assert.equal(x1.rong, 800);
  assert.ok(kho.has(`ctlanguage/cong-dong/u${a}/${x1.url.split('/').pop()}`));
  const cuaB = await ca.taiAnh(b, png);
  const truoc = await prisma.ctlBai.count({ where: { userId: a } });
  await assert.rejects(cd.dangBai(a, 'en', { noiDung: 'Ảnh của người khác', anh: [cuaB.id] }), (e: { code?: string }) => e.code === 'CTL_CD_ANH_KHONG_CO');
  await assert.rejects(cd.dangBai(a, 'en', { noiDung: 'Năm ảnh', anh: [x1.id, x2.id, x3.id, x4.id, x5.id] }), (e: { code?: string }) => e.code === 'CTL_CD_ANH_QUA');
  assert.equal(await prisma.ctlBai.count({ where: { userId: a } }), truoc, 'ảnh sai ⇒ không để lại bài');

  const bai = await cd.dangBai(a, 'en', { noiDung: 'Câu này dịch sao ạ?', anh: [x3.id, x1.id] });
  assert.deepEqual(bai.anh.map((x) => x.id), [x3.id, x1.id]);
  const tin = await cd.dsBai('en', null, undefined, 50);
  assert.deepEqual(tin.items.find((x) => x.id === bai.id)?.anh.map((x) => x.id), [x3.id, x1.id]);
  await assert.rejects(cd.dangBai(a, 'en', { noiDung: 'Dùng lại ảnh đã gắn', anh: [x1.id] }), (e: { code?: string }) => e.code === 'CTL_CD_ANH_KHONG_CO');

  // Sửa: bỏ x3, thêm x2 ⇒ x3 bị xoá khỏi kho + CSDL.
  const sua = await cd.suaBai(a, bai.id, { anh: [x1.id, x2.id] });
  assert.deepEqual(sua.anh.map((x) => x.id), [x1.id, x2.id]);
  assert.equal(await prisma.ctlAnh.count({ where: { id: x3.id } }), 0);
  assert.ok(daXoa.some((k) => k.endsWith(x3.url.split('/').pop()!)));
  const giu = await cd.suaBai(a, bai.id, { noiDung: 'Câu này dịch sao ạ? (sửa)' });
  assert.equal(giu.anh.length, 2, 'không gửi `anh` ⇒ giữ nguyên');

  // Trả lời kèm ảnh (≤ 2).
  const y1 = await ca.taiAnh(b, png);
  const sauTl = await cd.traLoi(b, bai.id, { noiDung: 'Xem ảnh mình chụp nhé', anh: [y1.id] });
  assert.deepEqual(sauTl.traLoi.at(-1)!.anh.map((x) => x.id), [y1.id]);
  await assert.rejects(cd.traLoi(b, bai.id, { noiDung: 'Ba ảnh', anh: [1, 2, 3] }), (e: { code?: string }) => e.code === 'CTL_CD_ANH_QUA');

  // Báo cáo ảnh: không báo ảnh của mình; 3 người khác ⇒ tự ẩn; admin gỡ ⇒ xoá tệp.
  await assert.rejects(cd.baoCao(a, { loai: 'anh', id: x2.id }), (e: { code?: string }) => e.code === 'CTL_CD_BAO_CAO_MINH');
  for (const u of [b, c, d]) assert.equal((await cd.baoCao(u, { loai: 'anh', id: x2.id, lyDo: 'tinh-duc' })).trung, false);
  assert.equal((await cd.baoCao(b, { loai: 'anh', id: x2.id })).trung, true, 'một người một lần');
  assert.deepEqual((await cd.chiTietBai(bai.id, c)).anh.map((x) => x.id), [x1.id], 'ảnh đủ báo cáo ⇒ ẩn');
  const tb = await prisma.adminNotification.findFirst({ where: { khoaChongTrung: `ctw-report:ctl_anh:${x2.id}:${b}` }, select: { id: true } });
  assert.ok(tb, 'báo cáo ảnh vào hộp thư admin với khoá máy đọc được');
  assert.deepEqual(await kd.mucTieuCuaKhoa(`ctw-report:ctl_anh:${x2.id}:${b}`), { kind: 'ctl_anh', id: x2.id });
  assert.equal(await kd.tacGiaCua({ kind: 'ctl_anh', id: x2.id }, b), a);
  assert.equal(await kd.goNoiDung({ kind: 'ctl_anh', id: x2.id }, adm), true);
  assert.ok(daXoa.some((k) => k.endsWith(x2.url.split('/').pop()!)), 'admin gỡ ⇒ tệp bị xoá');
  assert.equal(await kd.goNoiDung({ kind: 'ctl_anh', id: x2.id }, adm), false, 'gỡ lần hai ⇒ false');

  // Xoá bài ⇒ xoá mọi ảnh của bài và của các câu trả lời.
  await cd.xoaCuaToi(a, 'bai', bai.id);
  assert.equal(await prisma.ctlAnh.count({ where: { id: { in: [x1.id, y1.id] } } }), 0);
  assert.ok(!kho.has(`ctlanguage/cong-dong/u${b}/${y1.url.split('/').pop()}`));

  // Mồ côi: x4, x5, cuaB chưa gắn ⇒ dọn khi quá hạn.
  const n = await ca.donAnhMoCoi(new Date(Date.now() + 60_000));
  assert.ok(n >= 3);
  assert.equal(await prisma.ctlAnh.count({ where: { id: { in: [x4.id, x5.id, cuaB.id] } } }), 0);
});

t('admin gỡ BÀI ⇒ ảnh của bài bị xoá theo', async () => {
  const z = await ca.taiAnh(c, png);
  const bai = await cd.dangBai(c, 'ja', { noiDung: 'Bài có ảnh', anh: [z.id] });
  assert.equal(await kd.goNoiDung({ kind: 'ctl_bai', id: bai.id }, adm), true);
  assert.equal(await prisma.ctlAnh.count({ where: { id: z.id } }), 0);
});
