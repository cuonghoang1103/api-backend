/**
 * Khám phá (Đợt C) + bài học AI + sự kiện tháng (Đợt E) trên CSDL THẬT (local) — AI GIẢ, không gọi mạng.
 *
 *   npx tsx --test src/services/ctlanguage/khamPhaBaiAi.db.test.ts
 *
 * Tạo 4 user tạm, xoá đúng các user đó (FK CASCADE dọn hoạt động/bài AI/thưởng) + dòng lượt tra/sự kiện của test.
 * Không có DATABASE_URL ⇒ bỏ qua. KHÔNG đưa vào `npm test` (CI không có Postgres).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';
import { baiMau } from './baiAiThuan.test.js';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let kp: typeof import('./khamPha.js');
let sk: typeof import('./suKien.js');
let ba: typeof import('./baiAi.js');
let th: typeof import('./khamPhaThuan.js');
const ids: number[] = [];
let [a, b, c, d] = [0, 0, 0, 0];
let tag = '';
const suKienTest: number[] = [];

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  kp = await import('./khamPha.js');
  sk = await import('./suKien.js');
  ba = await import('./baiAi.js');
  th = await import('./khamPhaThuan.js');
  tag = `kpx${Date.now().toString(36)}`;
  for (let i = 0; i < 4; i++) {
    const u = await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, displayName: `Học viên ${i}` } });
    ids.push(u.id);
  }
  [a, b, c, d] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] } });
  await prisma.ctlLuotTra.deleteMany({ where: { chu: { startsWith: tag } } });
  await prisma.ctlSuKien.deleteMany({ where: { id: { in: suKienTest } } });
  await prisma.ctlBaiAi.deleteMany({ where: { goiYMa: { in: ['goi-mon', 'tra-sua'] }, nn: 'zh', createdAt: { gte: new Date(Date.now() - 3600_000) } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});


t('hoạt động: GREATEST từng cột, gửi lại không cộng dồn; đếm cuộc gọi cộng dồn', async () => {
  const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  await kp.ghiHoatDong(a, { muc: [{ nn: 'zh', ngay, giay: 900, theOn: 30 }] });
  await kp.ghiHoatDong(a, { muc: [{ nn: 'zh', ngay, giay: 600, theOn: 50, thi: 1 }] });
  await kp.demCuocGoi(a, 'zh'); await kp.demCuocGoi(a, 'zh');
  const r = await prisma.ctlHoatDongNgay.findUnique({ where: { userId_nn_ngay: { userId: a, nn: 'zh', ngay: new Date(`${ngay}T00:00:00Z`) } } });
  assert.deepEqual([r?.giay, r?.theOn, r?.thi, r?.goi], [900, 50, 1, 2]);
  const toi = await kp.hoatDongCuaToi(a, 'zh');
  assert.equal(toi.ngay.find((x) => x.ngay === ngay)?.giay, 900);
});

t('xếp hạng phút: hai chiều chặn không thấy nhau, người tự ẩn biến mất, hạng của tôi', async () => {
  const ngay = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  await kp.ghiHoatDong(b, { muc: [{ nn: 'zh', ngay, giay: 3000 }] });
  await kp.ghiHoatDong(c, { muc: [{ nn: 'zh', ngay, giay: 1800 }] });
  await kp.ghiHoatDong(d, { muc: [{ nn: 'zh', ngay, giay: 30 }] });        // < 1 phút ⇒ không lên bảng
  await prisma.userBlock.create({ data: { blockerId: c, blockedId: b } });
  const cuaA = await kp.xepHangPhut('zh', 'ngay', a);
  const ta = cuaA.items.filter((x) => ids.includes(x.nguoi.id)).map((x) => x.nguoi.id);
  assert.deepEqual(ta, [b, c, a].filter((id) => ta.includes(id)), 'xếp theo phút giảm dần');
  assert.ok(ta.includes(b) && ta.includes(c) && !ta.includes(d));
  assert.equal(cuaA.cuaToi?.phut, 15);
  const cuaC = await kp.xepHangPhut('zh', 'ngay', c);
  assert.ok(!cuaC.items.some((x) => x.nguoi.id === b), 'c chặn b ⇒ c không thấy b');
  const cuaB = await kp.xepHangPhut('zh', 'tuan', b);
  assert.ok(!cuaB.items.some((x) => x.nguoi.id === c), 'b bị c chặn ⇒ b cũng không thấy c');
  await kp.datAnXepHang(a, true);
  const sauAn = await kp.xepHangPhut('zh', 'ngay', a);
  assert.ok(!sauAn.items.some((x) => x.nguoi.id === a));
  assert.equal(sauAn.cuaToi?.an, true);
  assert.equal(sauAn.cuaToi?.hang, null);
  const khach = await kp.xepHangPhut('zh', 'ngay', null);
  assert.equal(khach.cuaToi, null);
  await kp.datAnXepHang(a, false);
  await prisma.user.update({ where: { id: b }, data: { enabled: false } });
  assert.ok(!(await kp.xepHangPhut('zh', 'ngay', null)).items.some((x) => x.nguoi.id === b), 'tài khoản vô hiệu không lên bảng');
  await prisma.user.update({ where: { id: b }, data: { enabled: true } });
});

t('lượt tra ẩn danh: gom RAM, ghi dồn một câu, top theo tổng 7 ngày', async () => {
  const muc = await prisma.ctlTu.findFirst({ where: { nn: 'zh' }, select: { id: true, chu: true } });
  for (let i = 0; i < 3; i++) kp.ghiLuotTra('zh', `${tag}x`);
  kp.ghiLuotTra('zh', `${tag}y`);
  kp.ghiLuotTra('fr', `${tag}z`);
  assert.equal(await kp.xaLuotTra(), 2, 'hai chữ hợp lệ, ngôn ngữ lạ bị bỏ');
  kp.ghiLuotTra('zh', `${tag}x`);
  await kp.xaLuotTra();
  const r = await prisma.ctlLuotTra.findMany({ where: { chu: { startsWith: tag } }, orderBy: { chu: 'asc' } });
  assert.deepEqual(r.map((x) => [x.chu, x.so]), [[`${tag}x`, 4], [`${tag}y`, 1]]);
  if (muc) {
    for (let i = 0; i < 5; i++) kp.ghiLuotTra('zh', muc.chu);
    await kp.xaLuotTra();
    kp.__datLaiKhamPha();
    const top = await kp.traNhieu('zh') as { items: { muc: { chu: string } }[] };
    assert.ok(top.items.some((x) => x.muc.chu === muc.chu), 'chữ có trong từ điển lên bảng');
    assert.ok(!top.items.some((x) => x.muc.chu.startsWith(tag)), 'chữ không có mục từ điển không lên');
    await prisma.ctlLuotTra.updateMany({ where: { nn: 'zh', chu: muc.chu }, data: { so: { decrement: 5 } } });
  }
});

t('chủ đề: 14 chủ đề, từ gắn id (thật hoặc âm), nghĩa Việt soạn tay', async () => {
  assert.equal(kp.dsChuDe('ja').items.length, 14);
  const cd = await kp.chuDe('zh', 'an-uong') as { tu: { id: number; chu: string; nghiaVi: string; doc: string | null }[] };
  assert.equal(cd.tu.length, 12);
  assert.ok(cd.tu.every((x) => x.id !== 0 && x.nghiaVi && x.doc));
  await assert.rejects(kp.chuDe('zh', 'khong-co'));
});

t('sự kiện: tự tạo sự kiện tháng, tiến độ từ dữ liệu thật, nhận thưởng một lần, chưa đủ ⇒ 409', async () => {
  const bayGio = Date.now();
  const s = await prisma.ctlSuKien.create({ data: {
    ma: `${tag}-sk`, tieuDe: 'Thử nghiệm', moTa: 'test', nn: 'zh', batDau: new Date(bayGio - 86_400_000), ketThuc: new Date(bayGio + 86_400_000),
    tram: th.kiemTram([{ loai: 'on-the', muc: 50 }, { loai: 'goi-ai', muc: 2 }, { loai: 'cong-dong', muc: 3 }]) as unknown as object,
    trangPhuc: 'skLaPhong', thuongProNgay: 7,
  } });
  suKienTest.push(s.id);
  const ds = await sk.suKienHienTai('zh', a) as { items: { id: number; daXong: number; tram: { loai: string; hienTai: number }[] }[] };
  const cua = ds.items.find((x) => x.id === s.id)!;
  assert.ok(cua, 'sự kiện test đang chạy');
  assert.equal(cua.tram.find((x) => x.loai === 'on-the')?.hienTai, 50);
  assert.equal(cua.tram.find((x) => x.loai === 'goi-ai')?.hienTai, 2);
  await assert.rejects(sk.nhanThuong(a, s.id), (e: { code?: string }) => e.code === 'CTL_SK_CHUA_XONG');
  const bai = await prisma.ctlBai.create({ data: { userId: a, nn: 'zh', noiDung: 'Mình hỏi về 了 ạ', loai: 'hoi' } });
  const kq = await sk.nhanThuong(a, s.id);
  assert.deepEqual([kq.trangPhuc, kq.moi, kq.proNgay], ['skLaPhong', true, 0], 'Pro thưởng tắt khi env chưa bật');
  assert.equal((await sk.nhanThuong(a, s.id)).moi, false, 'nhận lại không tạo dòng mới');
  assert.deepEqual((await sk.thuongCuaToi(a)).trangPhuc, ['skLaPhong']);
  const khach = await sk.suKienHienTai('zh', null) as { items: { daDangNhap: boolean; daXong: number }[] };
  assert.ok(khach.items.every((x) => !x.daDangNhap && x.daXong === 0));
  await prisma.ctlBai.delete({ where: { id: bai.id } });
  // Không có sự kiện nào ⇒ tự tạo sự kiện tháng (mã thang-YYYY-MM) — chỉ kiểm khi tháng này chưa có (không đụng dữ liệu thật).
  const ma = th.suKienMacDinh().ma;
  const daCo = await prisma.ctlSuKien.findUnique({ where: { ma } });
  if (!daCo) {
    await prisma.ctlSuKien.update({ where: { id: s.id }, data: { bat: false } });
    const r = await sk.suKienHienTai('en', null) as { items: { ma: string }[] };
    assert.ok(r.items.some((x) => x.ma === ma));
    const tao = await prisma.ctlSuKien.findUnique({ where: { ma } });
    if (tao) suKienTest.push(tao.id);
  }
});

t('admin sự kiện: tạo / sửa / chặn trùng mã', async () => {
  const s = await sk.adminTaoSuKien({ ma: `${tag}-tet`, tieuDe: 'Đón Tết', batDau: '2027-02-01T00:00:00+07:00', ketThuc: '2027-02-15T00:00:00+07:00',
    tram: [{ loai: 'phut-hoc', muc: 100 }], trangPhuc: 'skHuyChuong' });
  suKienTest.push(s.id);
  await assert.rejects(sk.adminTaoSuKien({ ma: `${tag}-tet`, tieuDe: 'Đón Tết 2', batDau: '2027-02-01', ketThuc: '2027-02-03', tram: [{ loai: 'on-the', muc: 1 }], trangPhuc: 'skHuyChuong' }),
    (e: { code?: string }) => e.code === 'CTL_SK_TRUNG_MA');
  const sua = await sk.adminSuaSuKien(s.id, { bat: false, ketThuc: '2027-02-20T00:00:00+07:00' });
  assert.equal(sua.bat, false);
  await assert.rejects(sk.adminSuaSuKien(s.id, { ketThuc: '2027-01-01T00:00:00+07:00' }), /sau bắt đầu/);
});

const aiGia = (tra: string | (() => string), pro = false) => {
  let goi = 0;
  const pt = {
    laPro: async () => pro,
    goi: async () => { goi++; await new Promise((r) => setTimeout(r, 30)); return typeof tra === 'function' ? tra() : tra; },
    baoAdmin: async (tb: { tieuDe: string; noiDung: string; userId: number; khoaChongTrung: string }) => prisma.adminNotification.create({
      data: { loai: 'BAO_CAO', mucDo: 'can_xu_ly', tieuDe: tb.tieuDe, noiDung: tb.noiDung, userId: tb.userId },
    }).catch(() => null),
  };
  return { pt, dem: () => goi };
};

t('bài AI tự tạo: free 1/ngày, JSON hỏng không trừ lượt, xoá không trả lượt, bài riêng tư', async () => {
  ba.__datLaiBaiAi();
  const hong = aiGia('không phải JSON');
  await assert.rejects(ba.taoBai(c, 'zh', { chuDe: 'đi phỏng vấn ở công xưởng', trinhDo: 'hsk3' }, hong.pt), (e: { code?: string }) => e.code === 'CTL_BAI_AI_LOI');
  assert.equal((await ba.luot(c, hong.pt)).conLai, 1, 'hỏng không trừ lượt');
  const tot = aiGia(JSON.stringify(baiMau('zh')));
  const bai = await ba.taoBai(c, 'zh', { chuDe: 'đi phỏng vấn ở công xưởng', trinhDo: 'HSK 3' }, tot.pt);
  assert.equal(bai.trinhDo, 'hsk3');
  assert.equal(bai.noiDung.tuVung.length, 12);
  assert.ok(bai.noiDung.tuVung.every((x) => typeof x.id === 'number' && x.id !== 0));
  assert.match(bai.goiNoi.ten, /词0/);
  assert.equal(bai.luot.conLai, 0);
  await assert.rejects(ba.taoBai(c, 'zh', { chuDe: 'gọi đồ ăn' }, tot.pt), (e: { code?: string }) => e.code === 'CTL_BAI_AI_HET_LUOT');
  await assert.rejects(ba.taoBai(c, 'zh', { chuDe: 'fuck you bitch' }, tot.pt), (e: { code?: string }) => e.code === 'CONTENT_BLOCKED');
  await assert.rejects(ba.chiTiet(bai.id, d), 'người khác không xem được bài tự tạo');
  assert.equal((await ba.chiTiet(bai.id, c)).daLuu, true);
  assert.equal((await ba.cuaToi(c, 'zh')).items[0]?.id, bai.id);
  await ba.xoa(c, bai.id);
  await assert.rejects(ba.chiTiet(bai.id, c), 'đã xoá');
  assert.equal((await ba.luot(c, tot.pt)).conLai, 0, 'xoá không trả lượt (chặn tạo – xoá – tạo)');
  const pro = aiGia(JSON.stringify(baiMau('zh')), true);
  assert.equal((await ba.luot(c, pro.pt)).conLai, 19, 'Pro 20/ngày');
  const tuChoi = aiGia(JSON.stringify({ tuChoi: 'Chủ đề không phù hợp.' }), true);
  await assert.rejects(ba.taoBai(c, 'zh', { chuDe: 'chủ đề lạ' }, tuChoi.pt), (e: { code?: string }) => e.code === 'CTL_BAI_AI_TU_CHOI');
});

t('bài gợi ý: sinh MỘT lần dù hai người mở cùng lúc, dùng chung, đếm người học, quiz xong ⇒ trạm bài-ai', async () => {
  ba.__datLaiBaiAi();
  await prisma.ctlBaiAi.deleteMany({ where: { nn: 'zh', goiYMa: 'tra-sua' } });
  const ai = aiGia(JSON.stringify(baiMau('zh')));
  const [x, y] = await Promise.all([ba.moGoiY(a, 'zh', 'tra-sua', ai.pt), ba.moGoiY(b, 'zh', 'tra-sua', ai.pt)]);
  assert.equal(ai.dem(), 1, 'model chạy đúng một lần');
  assert.equal(x.id, y.id);
  assert.equal(x.laGoiY, true);
  assert.equal((await ba.luot(a, ai.pt)).conLai, 1, 'bài gợi ý không tốn lượt tự tạo');
  await ba.luu(a, x.id, true);
  await ba.xong(b, x.id, { diem: 83 });
  await ba.xong(b, x.id, { diem: 50 });
  const ct = await ba.chiTiet(x.id, b);
  assert.deepEqual([ct.soNguoiHoc, ct.xong, ct.diem], [2, true, 83], 'giữ điểm cao nhất');
  const goiY = await ba.dsGoiY('zh', b);
  const m = goiY.items.find((g) => g.ma === 'tra-sua')!;
  assert.deepEqual([m.daCo, m.soNguoiHoc, m.daHoc, m.xong], [true, 2, true, true]);
  assert.equal(await ba.chiTiet(x.id, null).then((r) => r.id), x.id, 'khách xem được bài gợi ý');
  await ba.baoCao(d, { id: x.id, lyDo: 'sai', chiTiet: 'pinyin sai', phan: '词0' }, ai.pt);
  const tb = await prisma.adminNotification.findFirst({ where: { userId: d }, orderBy: { id: 'desc' } });
  assert.match(tb?.tieuDe ?? '', new RegExp(`#${x.id}`));
  await ba.adminAn(x.id);
  await assert.rejects(ba.chiTiet(x.id, a), 'đã gỡ');
  const lai = await ba.moGoiY(a, 'zh', 'tra-sua', ai.pt);
  assert.notEqual(lai.id, x.id, 'gỡ xong ⇒ lượt mở sau sinh bài mới');
  assert.equal(ai.dem(), 2);
});
