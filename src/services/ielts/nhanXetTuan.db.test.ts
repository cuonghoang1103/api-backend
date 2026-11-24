/**
 * Nhận xét học tập tuần trên CSDL THẬT (local): gom dữ liệu từ các bảng thật, tạo báo cáo (không gọi model —
 * FORCE_STATIC_MODE ⇒ chữ dự phòng do mã viết), lần mở sau không tạo lại, "Tạo lại" có trần, báo cáo tuần dở được làm
 * lại khi tuần đã khép, email tóm tắt chỉ khi bật + đúng một lần, xoá user dọn sạch (FK CASCADE).
 *
 *   WORK_DB_TEST=1 npx tsx --test src/services/ielts/nhanXetTuan.db.test.ts
 *
 * Không có DATABASE_URL / WORK_DB_TEST ⇒ bỏ qua. Chỉ chạy trên host cục bộ.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

process.env.FORCE_STATIC_MODE = 'true';
process.env.EMAIL_SANDBOX = '1';
const coDb = Boolean(process.env.DATABASE_URL) && process.env.WORK_DB_TEST === '1'
  && /@(localhost|127\.0\.0\.1|postgres)[:/]/.test(String(process.env.DATABASE_URL));
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let nx: typeof import('./nhanXetTuan.service.js');
let uid = 0;
const TUAN = '2026-11-16';
const BG = new Date('2026-11-24T03:00:00Z'); // thứ Ba tuần sau ⇒ tuần 16/11 đã khép
const luc = (ngay: string, gio = 3) => new Date(`${ngay}T${String(gio).padStart(2, '0')}:00:00Z`);

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  nx = await import('./nhanXetTuan.service.js');
  const tag = `nxt${Date.now().toString(36)}`;
  uid = (await prisma.user.create({ data: { username: tag, email: `${tag}@test.invalid`, emailVerified: true } })).id;
  await prisma.ieltsProgress.createMany({
    data: [
      { userId: uid, stage: 'sach2', kind: 'bai', muc: 't2d1-doc', xong: true, createdAt: luc('2026-11-16') },
      { userId: uid, stage: 'sach2', kind: 'bai', muc: 't2d1-nghe', xong: true, createdAt: luc('2026-11-17') },
      { userId: uid, stage: 'sach2', kind: 'baitap', muc: 't2d1-cau-hoi-doc', xong: true, diem: 50, createdAt: luc('2026-11-17') },
    ],
  });
  // updatedAt là @updatedAt ⇒ đặt lại bằng SQL cho đúng ngày trong tuần mẫu.
  await prisma.$executeRaw`UPDATE ielts_progress SET updated_at = created_at WHERE user_id = ${uid}`;
  await prisma.hocNgay.createMany({ data: ['2026-11-16', '2026-11-17', '2026-11-19'].map((day) => ({ userId: uid, stage: 'sach2', day })) });
  await prisma.ieltsCdtAttempt.create({
    data: { userId: uid, deId: 'de-1', kyNang: 'viet', cheDo: 'full', band: 6, giay: 2400, createdAt: luc('2026-11-19'),
      chiTiet: { ai: { 2: { tieuChi: [{ ma: 'TR', band: 6.5 }, { ma: 'CC', band: 6.5 }, { ma: 'LR', band: 6 }, { ma: 'GRA', band: 5 }] } } } },
  });
  for (let i = 0; i < 3; i++) {
    await prisma.ieltsMistake.create({
      data: { userId: uid, nguon: `cdt:de-1:${i}`, kyNang: 'doc', dang: 'Matching headings', cauHoi: 'q', daChon: 'a', dapAn: 'b', hanOn: luc('2026-11-20'), createdAt: luc('2026-11-19') },
    });
  }
  await prisma.$executeRaw`UPDATE ielts_mistakes SET updated_at = created_at WHERE user_id = ${uid}`;
});

after(async () => {
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: uid } });
  assert.equal(await prisma.ieltsNhanXetTuan.count({ where: { userId: uid } }), 0, 'FK CASCADE phải dọn báo cáo');
  await prisma.$disconnect();
});

t('tạo báo cáo từ dữ liệu thật; số liệu + điểm yếu + kế hoạch đúng; nguồn chữ = mã (không gọi model)', async () => {
  const r = (await nx.taoBaoCao(uid, TUAN, { bayGio: BG }))!;
  assert.equal(r.moiTao, true);
  assert.equal(r.nguon, 'ma');
  assert.equal(r.dangDo, false);
  const s = r.soLieu as { ngayHoc: { so: number }; khoa: { stage: string; baiXong: number; tongBai: number }[]; thi: { tieuChiViet: Record<string, number> }; nguonDuLieu: { ma: string; co: boolean }[] };
  assert.equal(s.ngayHoc.so, 3);
  const k2 = s.khoa.find((k) => k.stage === 'sach2')!;
  assert.equal(k2.baiXong, 2);
  assert.ok(k2.tongBai > 50, 'đọc được mục lục thật của Tập 2');
  assert.deepEqual(s.thi.tieuChiViet, { TR: 6.5, CC: 6.5, LR: 6, GRA: 5 });
  assert.ok(s.nguonDuLieu.find((n) => n.ma === 'thi-may')!.co);
  assert.ok(!s.nguonDuLieu.find((n) => n.ma === 'podcast')!.co);
  const yeu = r.diemYeu as { ma: string }[];
  assert.ok(yeu.some((y) => y.ma === 'tieu-chi-viet'));
  assert.ok(yeu.some((y) => y.ma === 'dang-cau'));
  const kh = r.keHoach as { viec: { href: string }[] }[];
  assert.equal(kh.length, 7);
  assert.ok(kh.flatMap((d) => d.viec.map((v) => v.href)).some((h) => h.startsWith('/language/en/ielts/tap-2?buoi=')));
});

t('mở lại không tạo lại; "Tạo lại" có trần 3 lần/tuần', async () => {
  const lan2 = (await nx.taoBaoCao(uid, TUAN, { bayGio: BG }))!;
  assert.equal(lan2.moiTao, false);
  assert.equal(lan2.lanTao, 1);
  for (let i = 0; i < nx.TRAN_TAO_LAI; i++) {
    const r = (await nx.taoBaoCao(uid, TUAN, { lamLai: true, bayGio: BG }))!;
    assert.equal(r.lanTao, 2 + i);
  }
  await assert.rejects(nx.taoBaoCao(uid, TUAN, { lamLai: true, bayGio: BG }), /tối đa 3 lần/);
  const ds = await nx.danhSach(uid, BG);
  assert.equal(ds.tuanGoiY, TUAN);
  assert.equal(ds.coTuanGoiY, true);
  assert.equal(ds.ds[0]!.baiXong, 2);
});

t('tuần dở được làm lại một lần khi tuần đã khép; tuần chưa tới / không phải thứ Hai ⇒ 400', async () => {
  const tuan = '2026-11-23';
  const dangDo = (await nx.taoBaoCao(uid, tuan, { bayGio: new Date('2026-11-24T05:00:00Z') }))!;
  assert.equal(dangDo.dangDo, true);
  const sau = (await nx.taoBaoCao(uid, tuan, { bayGio: new Date('2026-12-01T05:00:00Z') }))!;
  assert.equal(sau.moiTao, true);
  assert.equal(sau.dangDo, false);
  assert.equal(sau.lanTao, 1, 'làm lại vì tuần dở không tính vào trần');
  await assert.rejects(nx.taoBaoCao(uid, '2026-12-07', { bayGio: BG }), /chưa tới/);
  await assert.rejects(nx.taoBaoCao(uid, '2026-11-18', { bayGio: BG }), /thứ Hai/);
});

t('email tóm tắt: mặc định tắt; bật ⇒ gửi đúng một lần cho tuần đã khép', async () => {
  assert.deepEqual(await nx.layCaiDat(uid), { guiEmail: false });
  const r = await prisma.ieltsNhanXetTuan.findUniqueOrThrow({ where: { uk_ielts_nhan_xet_tuan: { userId: uid, tuan: TUAN } } });
  assert.equal(await nx.guiEmailNeuCan(uid, r.id), false);
  assert.deepEqual(await nx.datCaiDat(uid, { guiEmail: true }), { guiEmail: true });
  assert.equal(await nx.guiEmailNeuCan(uid, r.id), true);
  assert.equal(await nx.guiEmailNeuCan(uid, r.id), false, 'không gửi lần hai');
  await assert.rejects(nx.datCaiDat(uid, { guiEmail: 'co' }), /true\/false/);
});
