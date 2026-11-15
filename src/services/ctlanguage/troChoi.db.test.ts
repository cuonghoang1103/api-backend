/**
 * Trò chơi CT Language trên CSDL THẬT (local): gửi điểm (chặn trùng ván, kỷ lục), bảng xếp hạng (điểm cao nhất mỗi
 * người, tuần này / mọi lúc, chặn nhau, tự ẩn, tên tục), thách đấu (tạo, xem, gửi điểm vào, hết hạn), xoá tài khoản.
 *
 *   WORK_DB_TEST=1 npx tsx --test src/services/ctlanguage/troChoi.db.test.ts
 *
 * Tạo 3 user tạm, dùng game/ngôn ngữ thật nhưng lọc kết quả theo id của chính các user đó. Không có DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let tc: typeof import('./troChoi.js');
let quyen: typeof import('../dataRights.service.js');
const ids: number[] = [];
let [a, b, c] = [0, 0, 0];
const tag = `ctltc${Date.now().toString(36)}`;
let soVan = 0;
const van = (them: Record<string, unknown> = {}) => ({
  game: 'canh-troi', cheDo: '60-giay', nn: 'en', diem: 100, dung: 10, sai: 1, chang: 0, thoiGianMs: 60_000,
  maVan: `${tag}-${++soVan}`, ...them,
});
const cuaTa = <T extends { nguoi: { id: number } }>(ds: T[]) => ds.filter((x) => ids.includes(x.nguoi.id));

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  tc = await import('./troChoi.js');
  quyen = await import('../dataRights.service.js');
  for (let i = 0; i < 3; i++) {
    ids.push((await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, displayName: i === 2 ? 'đụ má' : `Người ${i}` } })).id);
  }
  [a, b, c] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('gửi điểm: lần đầu là kỷ lục, gửi lại cùng mã ván không thành hai dòng, điểm thấp hơn không phải kỷ lục', async () => {
  const v = van({ diem: 200, dung: 10 });
  const r1 = await tc.guiDiem(a, v);
  assert.equal(r1.kyLuc, true);
  const r2 = await tc.guiDiem(a, v);
  assert.equal(r2.trung, true);
  assert.equal(await prisma.ctlTroChoiDiem.count({ where: { userId: a } }), 1);
  const r3 = await tc.guiDiem(a, van({ diem: 150 }));
  assert.equal(r3.kyLuc, false);
  await assert.rejects(tc.guiDiem(a, van({ diem: 9999, dung: 10 })), /tối đa/);
});

t('bảng xếp hạng: điểm cao nhất mỗi người, mọi lúc gồm ván cũ, tuần này thì không; tên tục bị thay', async () => {
  await tc.guiDiem(b, van({ diem: 300, dung: 10 }));
  await tc.guiDiem(c, van({ diem: 250, dung: 10 }));
  // Ván cũ 20 ngày trước của b — chỉ "mọi lúc" thấy.
  await prisma.ctlTroChoiDiem.create({ data: { userId: b, game: 'canh-troi', cheDo: '60-giay', nn: 'en', diem: 340, maVan: `${tag}-cu`, createdAt: new Date(Date.now() - 20 * 86_400_000) } });

  const tuan = cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay', ky: 'tuan' }, a)).items);
  assert.deepEqual(tuan.map((x) => [x.nguoi.id, x.diem]), [[b, 300], [c, 250], [a, 200]]);
  assert.equal(tuan.find((x) => x.nguoi.id === c)!.nguoi.ten, `Người học #${c}`);
  const moi = cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay', ky: 'moi' }, null)).items);
  assert.equal(moi[0].diem, 340);

  const r = await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay', ky: 'tuan' }, a);
  assert.equal(r.cuaToi!.diem, 200);
  assert.ok(r.cuaToi!.hang! >= 3);
  // Chế độ khác ⇒ trống với ta.
  assert.equal(cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: 'vuot-chang' }, null)).items).length, 0);
});

t('bảng xếp hạng: chặn nhau ⇒ không thấy nhau; tự ẩn ⇒ biến khỏi bảng', async () => {
  await prisma.userBlock.create({ data: { blockerId: a, blockedId: b } });
  const voiA = cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay' }, a)).items);
  assert.ok(!voiA.some((x) => x.nguoi.id === b));
  const voiB = cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay' }, b)).items);
  assert.ok(!voiB.some((x) => x.nguoi.id === a));
  await prisma.userBlock.deleteMany({ where: { blockerId: a } });

  await prisma.ctlXepHangAn.create({ data: { userId: c } });
  assert.ok(!cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay' }, null)).items).some((x) => x.nguoi.id === c));
  await prisma.ctlXepHangAn.deleteMany({ where: { userId: c } });
});

t('thách đấu: tạo ⇒ mã; bạn xem được bộ đề + seed; gửi điểm vào bảng riêng; sai trò ⇒ chặn; hết hạn ⇒ 404', async () => {
  const de = ['apple', 'river', 'cloud', 'stone', 'light'].map((chu, i) => ({ id: i + 1, chu, doc: null, nghia: `nghĩa ${i}` }));
  const { ma, soTu } = await tc.taoThachDau(a, { game: 'canh-troi', nn: 'en', cachHien: 'nghia', seed: 777, tenBo: 'Bộ của A', de });
  assert.equal(soTu, 5);
  const xem = await tc.xemThachDau(ma.toLowerCase(), b);
  assert.equal(xem.seed, 777);
  assert.equal(xem.de.length, 5);
  assert.equal(xem.laCuaToi, false);

  await tc.guiDiem(b, van({ cheDo: 'thach-dau', maThachDau: ma, diem: 120 }));
  await tc.guiDiem(a, van({ cheDo: 'thach-dau', maThachDau: ma, diem: 90 }));
  const bangTD = await tc.xemThachDau(ma, a);
  assert.deepEqual(bangTD.items.map((x) => [x.nguoi.id, x.diem]), [[b, 120], [a, 90]]);
  assert.deepEqual(bangTD.cuaToi, { hang: 2, diem: 90 });
  // Điểm thách đấu không lẫn vào bảng 60 giây.
  const bang60 = cuaTa((await tc.xepHang('canh-troi', { nn: 'en', cheDo: '60-giay' }, null)).items);
  assert.equal(bang60.find((x) => x.nguoi.id === b)!.diem, 300);

  await assert.rejects(tc.guiDiem(b, van({ cheDo: 'thach-dau', maThachDau: ma, nn: 'ja' })), /không khớp/);
  // Chặn người tạo ⇒ không mở được thách đấu của họ.
  await prisma.userBlock.create({ data: { blockerId: c, blockedId: a } });
  await assert.rejects(tc.xemThachDau(ma, c), /không còn/);
  await prisma.userBlock.deleteMany({ where: { blockerId: c } });
  await prisma.ctlThachDau.update({ where: { ma }, data: { hetHan: new Date(Date.now() - 1000) } });
  await assert.rejects(tc.xemThachDau(ma, null), /không còn/);
});

t('thách đấu: bộ từ có chữ tục ⇒ 422', async () => {
  const de = ['đụ má', 'river', 'cloud', 'stone'].map((chu, i) => ({ id: i + 1, chu, nghia: `nghĩa ${i}` }));
  await assert.rejects(tc.taoThachDau(a, { game: 'canh-troi', nn: 'en', seed: 5, de }), /không được phép/);
});

t('xoá tài khoản: điểm + thách đấu của người đó biến mất', async () => {
  assert.ok(await prisma.ctlTroChoiDiem.count({ where: { userId: a } }) > 0);
  await quyen.anonymizeAccount(a);
  assert.equal(await prisma.ctlTroChoiDiem.count({ where: { userId: a } }), 0);
  assert.equal(await prisma.ctlThachDau.count({ where: { userId: a } }), 0);
});
