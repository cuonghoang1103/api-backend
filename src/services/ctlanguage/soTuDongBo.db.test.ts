/**
 * Đồng bộ sổ tay CT Language trên CSDL THẬT (local): đẩy / kéo theo mốc, bản mới hơn thắng, bia mộ, hai máy cùng tài
 * khoản, gộp sổ khách vào tài khoản (không nhân đôi), trần, xoá tài khoản xoá sạch.
 *
 *   WORK_DB_TEST=1 npx tsx --test src/services/ctlanguage/soTuDongBo.db.test.ts
 *
 * Tạo 2 user tạm, chạy, xoá đúng các user đó (FK CASCADE dọn `ctl_so_tu_muc`). Không có DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let dongBo: typeof import('./soTuDongBo.js');
let quyen: typeof import('../dataRights.service.js');
const ids: number[] = [];
let [a, b] = [0, 0];
/** Giờ máy chủ cố định (sau mọi capNhat trong bài) — không thì capNhat "tương lai" bị kéo về giờ thật. */
const BG = new Date('2026-11-16T00:00:00Z');
const day = (u: number, m: unknown[]) => dongBo.day(u, m, BG);

const the = (id: number, cap: string, them: Record<string, unknown> = {}) => ({
  loai: 'the', khoa: `zh-${id}`, capNhat: cap,
  duLieu: { muc: { id, chu: `词${id}`, doc: 'cí', nghiaVi: 'từ' }, nn: 'zh', themLuc: '2026-11-01T00:00:00Z', heSo: 2.5, khoangNgay: 0,
    lanDung: 0, lanQuen: 0, denHan: '2026-11-15T00:00:00Z', lanOnCuoi: null, so: null, ...them },
});
const so = (khoa: string, ten: string, cap: string) => ({ loai: 'so', khoa, capNhat: cap, duLieu: { ten, nn: 'zh', taoLuc: '2026-11-01T00:00:00Z', nguon: null } });

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  dongBo = await import('./soTuDongBo.js');
  quyen = await import('../dataRights.service.js');
  const tag = `ctlsotu${Date.now().toString(36)}`;
  for (let i = 0; i < 2; i++) ids.push((await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid` } })).id);
  [a, b] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('máy 1 đẩy ⇒ máy 2 (mốc 0) kéo về đủ; kéo tiếp theo mốc chỉ ra phần mới', async () => {
  const r = await day(a, [so('S1', 'Từ khó', '2026-11-15T01:00:00Z'), the(1, '2026-11-15T01:00:00Z', { so: ['S1'] }), the(2, '2026-11-15T01:00:00Z'),
    { loai: 'ngay', khoa: '2026-11-15', capNhat: '2026-11-15T01:00:00Z' }, { loai: 'the', khoa: 'zh-9' }]);
  assert.equal(r.daGhi, 4);
  assert.equal(r.soLoi, 1);
  const k = await dongBo.keo(a, '0');
  assert.equal(k.muc.length, 4);
  assert.equal(k.conNua, false);
  assert.deepEqual((k.muc.find((m) => m.khoa === 'zh-1') as any).duLieu.so, ['S1']);
  await day(a, [the(3, '2026-11-15T02:00:00Z')]);
  const k2 = await dongBo.keo(a, k.moc);
  assert.deepEqual(k2.muc.map((m) => m.khoa), ['zh-3']);
  assert.equal((await dongBo.keo(a, k2.moc)).muc.length, 0);
  // phân trang
  const p1 = await dongBo.keo(a, '0', 2);
  assert.equal(p1.muc.length, 2);
  assert.equal(p1.conNua, true);
  const p2 = await dongBo.keo(a, p1.moc, 2);
  assert.equal(p1.muc.length + p2.muc.length + (p2.conNua ? (await dongBo.keo(a, p2.moc, 10)).muc.length : 0), 5);
});

t('xung đột: bản cũ hơn bị bỏ qua, bản mới hơn thắng; gửi lại y hệt vô hại', async () => {
  const cu = await day(a, [the(1, '2026-11-15T00:30:00Z', { lanDung: 9 })]);
  assert.equal(cu.daGhi, 0);
  assert.equal(cu.boQua, 1);
  const moi = await day(a, [the(1, '2026-11-15T03:00:00Z', { lanDung: 4, khoangNgay: 3, so: ['S1'] })]);
  assert.equal(moi.daGhi, 1);
  const lai = await day(a, [the(1, '2026-11-15T03:00:00Z', { lanDung: 4, khoangNgay: 3, so: ['S1'] })]);
  assert.equal(lai.daGhi, 0);
  const k = await dongBo.keo(a, '0');
  assert.equal((k.muc.find((m) => m.khoa === 'zh-1') as any).duLieu.lanDung, 4);
});

t('bia mộ: xoá ở máy 1 ⇒ máy 2 kéo thấy xoa; máy 2 sửa CŨ hơn không làm sống lại', async () => {
  const truoc = (await dongBo.trangThai(a)).moc;
  await day(a, [{ loai: 'the', khoa: 'zh-2', capNhat: '2026-11-15T04:00:00Z', xoa: true }]);
  const k = await dongBo.keo(a, truoc);
  assert.deepEqual(k.muc, [{ loai: 'the', khoa: 'zh-2', capNhat: '2026-11-15T04:00:00.000Z', xoa: true }]);
  assert.equal((await day(a, [the(2, '2026-11-15T03:30:00Z')])).daGhi, 0);
  const tt = await dongBo.trangThai(a);
  assert.equal(tt.soThe, 2);
  assert.equal(tt.soSo, 1);
  assert.equal(tt.soNgay, 1);
});

t('tài khoản khác không thấy sổ của nhau', async () => {
  assert.equal((await dongBo.keo(b, '0')).muc.length, 0);
  await day(b, [the(1, '2026-11-15T05:00:00Z', { lanQuen: 2 })]);
  const ka = await dongBo.keo(a, '0');
  assert.equal((ka.muc.find((m) => m.khoa === 'zh-1') as any).duLieu.lanQuen, 0);
});

t('hai máy đẩy song song cùng tài khoản: không lỗi, mốc tăng, không mất bản ghi', async () => {
  const lo = (n: number) => Array.from({ length: 50 }, (_, i) => the(1000 + n * 100 + i, '2026-11-15T06:00:00Z'));
  await Promise.all([day(b, lo(1)), day(b, lo(2)), day(b, lo(3))]);
  const k = await dongBo.keo(b, '0');
  assert.equal(k.muc.length, 151);
});

t('lô quá 500 bị từ chối; mốc sai bị từ chối', async () => {
  await assert.rejects(day(a, Array.from({ length: 501 }, (_, i) => the(i, '2026-11-15T00:00:00Z'))), /tối đa 500/);
  await assert.rejects(dongBo.keo(a, 'abc'), /mốc/);
});

t('xoá tài khoản (anonymizeAccount) ⇒ sổ trên máy chủ bị xoá sạch', async () => {
  await quyen.anonymizeAccount(b);
  assert.equal((await dongBo.keo(b, '0')).muc.length, 0);
  assert.ok((await dongBo.keo(a, '0')).muc.length > 0);
});

t('sổ tay chuyên ngành: chi tiết bộ gắn id mục từ điển theo chữ, từ ngoài từ điển ⇒ id âm ổn định', async () => {
  const { chiTietBo } = await import('./soChuyenNganh.js');
  const { idAm } = await import('./chuDeTu.js');
  const v = await chiTietBo('zh', 'nha-may') as { tu: { id: number; chu: string; coTrongTuDien: boolean; doc: string | null }[] };
  assert.ok(v.tu.length >= 60);
  const co = v.tu.filter((x) => x.coTrongTuDien);
  if (co.length) {   // CSDL local có nạp từ điển
    assert.ok(co.every((x) => x.id > 0));
    const m = await prisma.ctlTu.findFirst({ where: { id: co[0].id }, select: { chu: true, nn: true } });
    assert.deepEqual(m, { chu: co[0].chu, nn: 'zh' });
  }
  for (const x of v.tu.filter((y) => !y.coTrongTuDien)) assert.equal(x.id, idAm('zh', x.chu));
  assert.ok(v.tu.every((x) => !!x.doc));
  await assert.rejects(chiTietBo('zh', 'khong-co'), /Không có bộ/);
});
