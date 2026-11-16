/**
 * Vòng quay may mắn CT Language trên CSDL THẬT (local): lượt/ngày ở máy chủ, đạt mục tiêu + chuỗi 7 ngày cho thêm lượt,
 * hai lượt bấm cùng lúc không thành hai lượt, dòng "vừa nhận" ẩn người chặn nhau / tự ẩn, xoá tài khoản xoá lịch sử.
 *
 *   WORK_DB_TEST=1 npx tsx --test src/services/ctlanguage/vongQuay.db.test.ts
 *
 * Tạo 3 user tạm, lọc kết quả theo id của chính các user đó. Không có DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let vq: typeof import('./vongQuay.js');
let thuan: typeof import('./khamPhaThuan.js');
let quyen: typeof import('../dataRights.service.js');
const ids: number[] = [];
let [a, b, c] = [0, 0, 0];
const tag = `ctlvq${Date.now().toString(36)}`;

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  vq = await import('./vongQuay.js');
  thuan = await import('./khamPhaThuan.js');
  quyen = await import('../dataRights.service.js');
  for (let i = 0; i < 3; i++) {
    ids.push((await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, fullName: `Trần Thị Thử${i}` } })).id);
  }
  [a, b, c] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('khách xem được bánh xe + thể lệ, không có lượt / lịch sử', async () => {
  const r = await vq.trangThaiVongQuay(null);
  assert.equal(r.daDangNhap, false);
  assert.equal(r.qua.length, 8);
  assert.equal(r.luot, null);
  assert.deepEqual(r.lichSu, []);
});

t('1 lượt miễn phí/ngày; quay xong ⇒ 409 hết lượt; lịch sử ghi đúng ô', async () => {
  const s0 = await vq.trangThaiVongQuay(a);
  assert.equal(s0.luot!.con, 1);
  const r = await vq.quayVongQuay(a);
  assert.equal(r.quay.nguon, 'ngay');
  assert.ok(r.quay.viTri >= 0 && r.quay.viTri < 8);
  // Trúng "Thêm 1 lượt" thì còn lượt thưởng — quay tới khi hết (tối đa 1 + 2 lượt thưởng).
  let n = 1;
  while ((await vq.trangThaiVongQuay(a)).luot!.con > 0) { await vq.quayVongQuay(a); n++; assert.ok(n <= 3); }
  await assert.rejects(vq.quayVongQuay(a), (e: { code?: string; statusCode?: number }) => e.code === 'CTL_VQ_HET_LUOT' && e.statusCode === 409);
  const s1 = await vq.trangThaiVongQuay(a);
  assert.equal(s1.lichSu.length, n);
  assert.equal(s1.lichSu.at(-1)!.id, r.quay.id);
});

t('đạt phút mục tiêu ⇒ +1 lượt; chuỗi 7 ngày tới hôm nay ⇒ +1 lượt', async () => {
  const homNay = thuan.ngayVn();
  await prisma.ctLanguageProfile.create({
    data: { userId: b, activeLang: 'ja', langs: { ja: { level: 'n5', goal: 'thi', minutesPerDay: 10, startedAt: homNay } } },
  });
  // 7 ngày liên tiếp (hôm nay đủ 10 phút tiếng Nhật).
  for (let i = 0; i < 7; i++) {
    await prisma.ctlHoatDongNgay.create({ data: { userId: b, nn: 'ja', ngay: thuan.docNgay(thuan.congNgay(homNay, -i))!, giay: i === 0 ? 600 : 120 } });
  }
  const s = await vq.trangThaiVongQuay(b);
  assert.equal(s.luot!.chuoi, 7);
  assert.equal(s.luot!.mucTieu, 10);
  assert.equal(s.luot!.phutHomNay, 10);
  assert.equal(s.luot!.con, 3);
  const nguon = [];
  for (let i = 0; i < 3; i++) nguon.push((await vq.quayVongQuay(b)).quay.nguon);
  assert.deepEqual(nguon.slice(0, 3), ['ngay', 'muc-tieu', 'chuoi-7']);
});

t('bấm quay hai lần cùng lúc với 1 lượt ⇒ chỉ một lượt ăn', async () => {
  const kq = await Promise.allSettled([vq.quayVongQuay(c), vq.quayVongQuay(c)]);
  const thanh = kq.filter((k) => k.status === 'fulfilled') as PromiseFulfilledResult<Awaited<ReturnType<typeof vq.quayVongQuay>>>[];
  // Lượt thứ hai chỉ thành công nếu lượt đầu trúng "Thêm 1 lượt" (khi đó nó dùng lượt thưởng, không dùng lại lượt ngày).
  const ngay = thanh.filter((k) => k.value.quay.nguon === 'ngay');
  assert.equal(ngay.length, 1);
  assert.equal(await prisma.ctlVongQuay.count({ where: { userId: c, nguon: 'ngay' } }), 1);
});

t('"vừa nhận": chỉ quà đáng khoe, tên rút gọn; người tự ẩn khỏi xếp hạng / bị chặn không hiện', async () => {
  const homNay = thuan.docNgay(thuan.ngayVn())!;
  await prisma.ctlVongQuay.create({ data: { userId: a, ngay: homNay, nguon: 'thuong', stt: 9, qua: 'xu-100', xu: 100 } });
  const cuaTa = (ds: { ten: string }[]) => ds.filter((x) => x.ten.startsWith('Thử'));
  let r = await vq.trangThaiVongQuay(null);
  assert.ok(cuaTa(r.vuaNhan).some((x) => x.ten === 'Thử0 T.'));
  await prisma.userBlock.create({ data: { blockerId: c, blockedId: a } });
  r = await vq.trangThaiVongQuay(c);
  assert.ok(!cuaTa(r.vuaNhan).some((x) => x.ten === 'Thử0 T.'), 'người chặn nhau không thấy nhau');
  await prisma.ctlXepHangAn.create({ data: { userId: a } });
  r = await vq.trangThaiVongQuay(null);
  assert.ok(!cuaTa(r.vuaNhan).some((x) => x.ten === 'Thử0 T.'), 'người tự ẩn không hiện');
  await prisma.userBlock.deleteMany({ where: { blockerId: c } });
});

t('xoá tài khoản ⇒ xoá lịch sử vòng quay', async () => {
  assert.ok(await prisma.ctlVongQuay.count({ where: { userId: b } }) > 0);
  await quyen.anonymizeAccount(b);
  assert.equal(await prisma.ctlVongQuay.count({ where: { userId: b } }), 0);
});
