/**
 * Vở — `/vo/sync` gặp trang ĐÃ XOÁ MỀM + `/vo/trang/khoi-phuc`, chạy thật trên CSDL.
 *
 * Lỗi thật 23/10/2026 (iPad, trang 11760): upsert theo `uk_note_client` UPDATE hàng đã
 * xoá rồi trả id về máy; `xinDuongDayNet` (lọc `deletedAt: null`) trả 404 ⇒ cả lượt đồng
 * bộ dừng, huy hiệu đỏ mãi. Điều phải đúng:
 *   1. sync KHÔNG ghi vào hàng đã xoá (tên/thứ tự/cuốn/deletedAt/updatedAt giữ nguyên),
 *      trả `daXoa: true` + id + `xungDot: false`; trang sống trả `daXoa: false`.
 *   2. khoi-phuc chỉ bỏ `deletedAt` của CHÍNH người gọi; người khác cùng clientId không đụng.
 *   3. Cuốn đã xoá hẳn (chapterId NULL) ⇒ `thieuCuon: true`; sync sau đó gắn lại vào cuốn.
 *   4. clientId không có ⇒ `khongCo`; trang đang sống ⇒ `conSong`.
 *
 * Chỉ Postgres cục bộ; không có ⇒ TỰ BỎ QUA. Dựng user tạm `vo_test_<ngẫu nhiên>` rồi xoá
 * (cascade môn/cuốn/trang). Không chạm R2 (không gửi nền; `buildPublicUrl` thuần chuỗi).
 *   DATABASE_URL=postgresql://…@localhost:…/<csdl test> npx tsx --test src/services/voInk.db.test.ts
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '../config/database.js';
import { dongBoCay, khoiPhucTrangVo, xinDuongDayNet, type MonVao } from './voInk.service.js';

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
    data: { username: `vo_test_${tag}_${hau}`, email: `vo_test_${tag}_${hau}@example.invalid`, password: null },
  });
  userIds.push(u.id);
  return u.id;
}

function cay(mon: string, cuon: string, trangs: Array<{ clientId: string; thuTu: number; tieuDe?: string | null }>): MonVao[] {
  return [{
    clientId: mon, ten: 'Môn thử', cuons: [{
      clientId: cuon, ten: 'Cuốn thử',
      trangs: trangs.map((t) => ({ clientId: t.clientId, thuTu: t.thuTu, tieuDe: t.tieuDe ?? null, phienBanNet: 0 })),
    }],
  }];
}

test('sync gặp trang đã xoá mềm: không ghi, trả daXoa; khoi-phuc + sync gắn lại', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('a');
  const mon = randomUUID(), cuon = randomUUID(), tSong = randomUUID(), tXoa = randomUUID();

  // Lượt 1: hai trang lên máy chủ.
  const r1 = await dongBoCay(uid, cay(mon, cuon, [{ clientId: tSong, thuTu: 0 }, { clientId: tXoa, thuTu: 1, tieuDe: 'Trang gốc' }]));
  const ds1 = r1.mons[0].cuons[0].trangs;
  assert.equal(ds1.length, 2);
  assert.ok(ds1.every((x) => x.daXoa === false), 'trang sống phải có daXoa:false (khoá luôn có mặt)');
  const idXoa = ds1.find((x) => x.clientId === tXoa)!.id;

  // Máy khác / thùng rác web xoá mềm trang thứ hai; giả lập mốc cũ để soi updatedAt.
  const mocXoa = new Date('2026-09-27T03:00:00Z');
  await prisma.note.update({ where: { id: idXoa }, data: { deletedAt: mocXoa, inkVersion: 3, inkStrokeCount: 12 } });
  const truoc = await prisma.note.findUniqueOrThrow({ where: { id: idXoa } });

  // Lượt 2: máy (chưa biết trang bị xoá) gửi lại — đổi tên + thứ tự.
  const r2 = await dongBoCay(uid, cay(mon, cuon, [{ clientId: tXoa, thuTu: 0, tieuDe: 'Tên mới từ iPad' }, { clientId: tSong, thuTu: 1 }]));
  const ds2 = r2.mons[0].cuons[0].trangs;
  const raXoa = ds2.find((x) => x.clientId === tXoa)!;
  assert.equal(raXoa.daXoa, true);
  assert.equal(raXoa.id, idXoa);
  assert.equal(raXoa.xungDot, false, 'trang đã xoá không được mời máy hợp nhất');
  assert.equal(raXoa.inkVersion, 3);
  assert.equal(ds2.find((x) => x.clientId === tSong)!.daXoa, false);

  const sau = await prisma.note.findUniqueOrThrow({ where: { id: idXoa } });
  assert.equal(sau.deletedAt?.toISOString(), mocXoa.toISOString(), 'deletedAt giữ nguyên');
  assert.equal(sau.title, truoc.title, 'không đổi tên hàng đã xoá');
  assert.equal(sau.inkTitle, 'Trang gốc');
  assert.equal(sau.sortOrder, truoc.sortOrder);
  assert.equal(sau.updatedAt.toISOString(), truoc.updatedAt.toISOString(), 'không UPDATE hàng đã xoá');
  // Trang sống vẫn được cập nhật bình thường.
  const song = await prisma.note.findFirstOrThrow({ where: { userId: uid, clientId: tSong } });
  assert.equal(song.sortOrder, 1);

  // Bước đẩy nét vẫn từ chối trang đã xoá (app mới dựa vào 404 này với máy chủ cũ).
  await assert.rejects(() => xinDuongDayNet(uid, idXoa, true), (e: { statusCode?: number; code?: string }) =>
    e.statusCode === 404 || e.code === 'NOTE_NOT_FOUND' || e.code === 'STORAGE_UNAVAILABLE');

  // Người KHÁC không khôi phục được trang của người này.
  const uidKhac = await taoNguoi('b');
  const rKhac = await khoiPhucTrangVo(uidKhac, [tXoa]);
  assert.equal(rKhac.daKhoiPhuc, 0);
  assert.equal(rKhac.trangs[0].trangThai, 'khongCo');
  assert.ok((await prisma.note.findUniqueOrThrow({ where: { id: idXoa } })).deletedAt, 'vẫn còn trong thùng rác');

  // Khôi phục: chỉ bỏ deletedAt, nét giữ nguyên.
  const la = randomUUID();
  const rk = await khoiPhucTrangVo(uid, [tXoa, tSong, la]);
  assert.equal(rk.daKhoiPhuc, 1);
  const theo = Object.fromEntries(rk.trangs.map((x) => [x.clientId, x]));
  assert.equal(theo[tXoa].trangThai, 'khoiPhuc');
  assert.equal(theo[tXoa].id, idXoa);
  assert.equal(theo[tXoa].thieuCuon, false);
  assert.equal(theo[tSong].trangThai, 'conSong');
  assert.equal(theo[la].trangThai, 'khongCo');
  const kp = await prisma.note.findUniqueOrThrow({ where: { id: idXoa } });
  assert.equal(kp.deletedAt, null);
  assert.equal(kp.inkVersion, 3);
  assert.equal(kp.inkStrokeCount, 12);

  // Sync sau khôi phục: trang sống lại, nhận tên mới.
  const r3 = await dongBoCay(uid, cay(mon, cuon, [{ clientId: tXoa, thuTu: 0, tieuDe: 'Tên mới từ iPad' }, { clientId: tSong, thuTu: 1 }]));
  assert.ok(r3.mons[0].cuons[0].trangs.every((x) => x.daXoa === false));
  assert.equal((await prisma.note.findUniqueOrThrow({ where: { id: idXoa } })).inkTitle, 'Tên mới từ iPad');
});

test('khoi-phuc khi cuốn cha đã xoá hẳn: báo thieuCuon, sync sau gắn lại vào cuốn dựng lại', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('c');
  const mon = randomUUID(), cuon = randomUUID(), tr = randomUUID(), tr2 = randomUUID();
  const r1 = await dongBoCay(uid, cay(mon, cuon, [{ clientId: tr, thuTu: 0 }, { clientId: tr2, thuTu: 1 }]));
  const idTr = r1.mons[0].cuons[0].trangs.find((x) => x.clientId === tr)!.id;
  const cuonId = r1.mons[0].cuons[0].id;

  // Giống `xoaCuonVo`: xoá mềm các trang rồi xoá HẲN cuốn (FK SetNull ⇒ chapterId NULL).
  await prisma.note.updateMany({ where: { userId: uid, chapterId: cuonId }, data: { deletedAt: new Date() } });
  await prisma.noteChapter.delete({ where: { id: cuonId } });

  const rk = await khoiPhucTrangVo(uid, [tr]);
  assert.equal(rk.daKhoiPhuc, 1);
  assert.equal(rk.trangs[0].thieuCuon, true);

  const r2 = await dongBoCay(uid, cay(mon, cuon, [{ clientId: tr, thuTu: 0 }, { clientId: tr2, thuTu: 1 }]));
  const cuonMoi = r2.mons[0].cuons[0];
  assert.notEqual(cuonMoi.id, cuonId, 'cuốn dựng lại theo clientId');
  assert.equal(cuonMoi.trangs.find((x) => x.clientId === tr)!.daXoa, false);
  assert.equal(cuonMoi.trangs.find((x) => x.clientId === tr2)!.daXoa, true, 'trang chưa khôi phục vẫn báo daXoa');
  assert.equal((await prisma.note.findUniqueOrThrow({ where: { id: idTr } })).chapterId, cuonMoi.id);
});

test('khoi-phuc: đầu vào rác bị chặn, rỗng thì không làm gì', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ'); return; }
  const uid = await taoNguoi('d');
  assert.deepEqual(await khoiPhucTrangVo(uid, []), { daKhoiPhuc: 0, trangs: [] });
  assert.deepEqual(await khoiPhucTrangVo(uid, undefined), { daKhoiPhuc: 0, trangs: [] });
  await assert.rejects(() => khoiPhucTrangVo(uid, ['../../x']), (e: { code?: string }) => e.code === 'INVALID_CLIENT_ID');
});
