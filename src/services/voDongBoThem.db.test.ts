/**
 * Vở — đợt 5a "không mất dữ liệu" (16/11/2026), chạy thật trên CSDL cục bộ + kho R2 GIẢ (storage sandbox, tự bật
 * khi chạy `--test` — không chạm bucket thật).
 *   1. Xoá MÔN ⇒ trang vào thùng rác, môn KHÔNG sống lại ở `/vo`; máy khác còn bản cũ đẩy lên ⇒ `daXoa`, không tạo lại.
 *   2. Xoá CUỐN ⇒ bia mộ; khôi phục trang kèm `cuonIds` ⇒ gỡ bia mộ, sync dựng lại được.
 *   3. `xacNhanNet` hai lượt CÙNG dựa trên một phiên bản ⇒ đúng MỘT lượt thắng, lượt kia 409 (trước đây cả hai qua).
 *   4. Media (ảnh dán + ghi âm): tệp thiếu ⇒ 409 MEDIA_MISSING; đủ ⇒ lưu, `/vo` báo `mediaLuc`, đọc lại đúng.
 *   5. Ghi chú: `baseUpdatedAt` cũ ⇒ 409 NOTE_CONFLICT, KHÔNG ghi; đúng ⇒ ghi + bản chụp MANUAL.
 *   6. `xoaTrangVo` > 500 ⇒ ném (trước đây cắt lặng lẽ).
 *
 *   npx tsx --test src/services/voDongBoThem.db.test.ts      (không có Postgres cục bộ ⇒ TỰ BỎ QUA)
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import {
  dongBoCay, khoiPhucTrangVo, xoaCuonVo, xoaMonVo, xoaTrangVo, layCayVo, xinDuongDayNet, xacNhanNet, type MonVao,
} from './voInk.service.js';
import { xinDuongMedia, luuDsMedia, layDsMedia, chuanDsMedia, thuMucMedia } from './voDongBoThem.service.js';
import { updateNote } from './notes.service.js';

async function coCsdl(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(new URL(url).hostname)) return false;
    await Promise.race([
      prisma.$queryRaw`SELECT "client_id", "ink_version" FROM "notes" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

const tag = randomBytes(4).toString('hex');
const userIds: number[] = [];
after(async () => {
  if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
  await prisma.$disconnect().catch(() => {});
});
async function taoNguoi(hau: string): Promise<number> {
  const u = await prisma.user.create({
    data: { username: `vo5a_${tag}_${hau}`, email: `vo5a_${tag}_${hau}@example.invalid`, password: null },
  });
  userIds.push(u.id);
  return u.id;
}
const U = () => randomUUID().toUpperCase();   // iOS gửi clientId chữ HOA
function cay(mon: string, cuon: string, trangs: string[]): MonVao[] {
  return [{ clientId: mon, ten: 'Môn 5a', cuons: [{ clientId: cuon, ten: 'Cuốn 5a',
    trangs: trangs.map((c, i) => ({ clientId: c, thuTu: i, tieuDe: null, phienBanNet: 0 })) }] }];
}

test('xoá MÔN: trang vào thùng rác, môn không sống lại, máy khác đẩy bản cũ ⇒ daXoa', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('mon');
  const mon = U(), cuon = U(), t1 = U(), t2 = U();
  await dongBoCay(uid, cay(mon, cuon, [t1, t2]));

  const r = await xoaMonVo(uid, mon);
  assert.equal(r.daXoa, 2);
  const trangs = await prisma.note.findMany({ where: { userId: uid, clientId: { in: [t1, t2] } } });
  assert.ok(trangs.every((x) => x.deletedAt), 'trang vào thùng rác (xoá mềm)');
  assert.equal(await prisma.noteChapter.count({ where: { userId: uid, clientId: cuon } }), 0);
  assert.equal(await prisma.noteSubject.count({ where: { userId: uid, clientId: mon } }), 0, 'môn rời khỏi Vở');
  assert.equal(await prisma.noteSubject.count({ where: { userId: uid } }), 1, 'môn còn (giữ trang trong thùng rác web)');

  const keo = await layCayVo(uid);
  assert.equal(keo.mons.length, 0, '/vo không trả môn đã xoá');
  assert.ok(keo.biaMo.mons.includes(mon.toLowerCase()));

  // Máy thứ hai (chưa biết) đẩy cây cũ ⇒ KHÔNG tạo lại.
  const r2 = await dongBoCay(uid, cay(mon, cuon, [t1, t2]));
  assert.equal(r2.mons[0].daXoa, true);
  assert.equal(await prisma.noteSubject.count({ where: { userId: uid, clientId: mon } }), 0);
  assert.equal((await layCayVo(uid)).mons.length, 0);

  // Khôi phục kèm môn + cuốn cha ⇒ gỡ bia mộ, sync dựng lại, trang về đúng chỗ.
  await khoiPhucTrangVo(uid, [t1], { cuonIds: [cuon], monIds: [mon] });
  const r3 = await dongBoCay(uid, cay(mon, cuon, [t1]));
  assert.notEqual(r3.mons[0].daXoa, true);
  assert.equal(r3.mons[0].cuons[0].trangs[0].daXoa, false);
  assert.equal((await layCayVo(uid)).mons.length, 1);
});

test('xoá MÔN rỗng (chưa có trang) ⇒ xoá hẳn hàng môn', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('monrong');
  const mon = U();
  await dongBoCay(uid, [{ clientId: mon, ten: 'Rỗng', cuons: [] }]);
  await xoaMonVo(uid, mon);
  assert.equal(await prisma.noteSubject.count({ where: { userId: uid } }), 0);
});

test('xoá CUỐN ⇒ bia mộ chặn máy khác tạo lại', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('cuon');
  const mon = U(), cuon = U(), t1 = U();
  await dongBoCay(uid, cay(mon, cuon, [t1]));
  await xoaCuonVo(uid, cuon);
  const r = await dongBoCay(uid, cay(mon, cuon, [t1]));
  assert.equal(r.mons[0].cuons[0].daXoa, true);
  assert.equal(await prisma.noteChapter.count({ where: { userId: uid, clientId: cuon } }), 0, 'cuốn không sống lại');
  assert.equal((await layCayVo(uid)).mons[0].cuons.length, 0);
});

test('xacNhanNet: hai lượt cùng dựa trên v0 chạy chồng ⇒ đúng một lượt thắng', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('race');
  const mon = U(), cuon = U(), t1 = U();
  const id = (await dongBoCay(uid, cay(mon, cuon, [t1]))).mons[0].cuons[0].trangs[0].id;
  const [a, b] = await Promise.all([xinDuongDayNet(uid, id, false), xinDuongDayNet(uid, id, false)]);
  await putObject(a.inkKey, Buffer.from('A'), 'application/octet-stream');
  await putObject(b.inkKey, Buffer.from('B'), 'application/octet-stream');
  const kq = await Promise.allSettled([
    xacNhanNet(uid, id, { inkKey: a.inkKey, phienBanDuaTren: 0, soNet: 1 }),
    xacNhanNet(uid, id, { inkKey: b.inkKey, phienBanDuaTren: 0, soNet: 2 }),
  ]);
  const thang = kq.filter((x) => x.status === 'fulfilled');
  const thua = kq.filter((x) => x.status === 'rejected') as PromiseRejectedResult[];
  assert.equal(thang.length, 1, 'chỉ một lượt được ghi');
  assert.equal(thua[0].reason.code, 'INK_CONFLICT');
  const row = await prisma.note.findUniqueOrThrow({ where: { id } });
  assert.equal(row.inkVersion, 1);
});

test('media: thiếu tệp ⇒ MEDIA_MISSING; đủ ⇒ lưu, /vo báo mediaLuc, đọc lại đúng', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('media');
  const mon = U(), cuon = U(), t1 = U();
  const id = (await dongBoCay(uid, cay(mon, cuon, [t1]))).mons[0].cuons[0].trangs[0].id;

  const anh = Buffer.from('png-gia'), tieng = Buffer.from('m4a-gia');
  const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
  const dA = await xinDuongMedia(uid, id, sha(anh), 'png', anh.length);
  assert.equal(dA.daCo, false);
  assert.ok(dA.khoa.startsWith(thuMucMedia(uid, id)));
  const dT = await xinDuongMedia(uid, id, sha(tieng), 'm4a', tieng.length);
  const than = {
    anh: [{ id: randomUUID(), khoa: dA.khoa, x: 10, y: 20, rong: 300, cao: 200, nguon: 'Bài 3', luc: 1700000000 }],
    ghiAm: { khoa: dT.khoa, dai: 61.5, mocNet: [-1, 3.2, 4.8] },
    phien: 'p1',
  };
  await assert.rejects(() => luuDsMedia(uid, id, than), (e: { code?: string }) => e.code === 'MEDIA_MISSING');

  await putObject(dA.khoa, anh, 'image/png');
  await putObject(dT.khoa, tieng, 'audio/mp4');
  assert.equal((await xinDuongMedia(uid, id, sha(anh), 'png', anh.length)).daCo, true, 'khoá theo nội dung ⇒ đã có');
  const luu = await luuDsMedia(uid, id, than);
  assert.equal(luu.phien, 'p1');

  const doc = await layDsMedia(uid, id);
  assert.equal(doc.ds?.anh[0].nguon, 'Bài 3');
  assert.deepEqual(doc.ds?.ghiAm?.mocNet, [-1, 3.2, 4.8]);
  assert.ok(doc.urls[dA.khoa] && doc.urls[dT.khoa]);
  const trang = (await layCayVo(uid)).mons[0].cuons[0].trangs[0];
  assert.ok(trang.mediaLuc, '/vo phải báo mediaLuc cho trang có media');

  // Khoá của trang KHÁC / người khác bị chặn.
  assert.throws(() => chuanDsMedia(uid, id + 1, than), (e: { code?: string }) => e.code === 'INVALID_KEY');
  const uid2 = await taoNguoi('media2');
  await assert.rejects(() => layDsMedia(uid2, id), (e: { code?: string }) => e.code === 'NOTE_NOT_FOUND');
});

test('xoaTrangVo > 500 ⇒ ném, không cắt lặng lẽ', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('tran');
  await assert.rejects(() => xoaTrangVo(uid, Array.from({ length: 501 }, () => randomUUID())),
    (e: { code?: string }) => e.code === 'TOO_MANY');
});

test('ghi chú: baseUpdatedAt cũ ⇒ NOTE_CONFLICT, không ghi đè bản web', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('note');
  const mon = await prisma.noteSubject.create({ data: { userId: uid, name: 'Ghi chú 5a' } });
  const note = await prisma.note.create({ data: { userId: uid, subjectId: mon.id, title: 'Gốc', contentJson: { type: 'doc', content: [] } } });
  const baseCu = note.updatedAt.toISOString();

  // Web sửa (không khoá).
  const web = await updateNote(uid, note.id, { contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'bản web' }] }] } });
  // iOS lưu bản dựa trên mốc cũ ⇒ bị chặn.
  await assert.rejects(() => updateNote(uid, note.id, { title: 'iOS', contentJson: { type: 'doc', content: [] }, baseUpdatedAt: baseCu }),
    (e: { code?: string }) => e.code === 'NOTE_CONFLICT');
  const sau = await prisma.note.findUniqueOrThrow({ where: { id: note.id } });
  assert.equal(sau.title, 'Gốc');
  assert.match(JSON.stringify(sau.contentJson), /bản web/);

  // Dựa trên mốc mới ⇒ ghi được, bản chụp lịch sử là MANUAL (không gộp đè bản tự lưu của web).
  const ok = await updateNote(uid, note.id, { title: 'iOS', contentJson: { type: 'doc', content: [] }, baseUpdatedAt: web.updatedAt.toISOString() });
  assert.equal(ok.title, 'iOS');
  const vs = await prisma.noteVersion.findMany({ where: { noteId: note.id }, orderBy: { version: 'asc' } });
  assert.ok(vs.some((v) => v.origin === 'MANUAL'));
  assert.ok(vs.some((v) => JSON.stringify(v.contentJson).includes('bản web')), 'bản chụp của web còn nguyên');
});
