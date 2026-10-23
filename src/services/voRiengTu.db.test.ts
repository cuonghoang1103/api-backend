/**
 * Vở riêng tư (23/10/2026): URL đọc là URL KÝ SẴN (không phải CDN công khai), khoá nét mới có chuỗi
 * ngẫu nhiên, dọn bản cũ đúng khoá (giữ bản liền trước), chuyển khoá cũ sang khoá riêng tư.
 * Postgres cục bộ đã migrate; không có ⇒ TỰ BỎ QUA. R2 = kho giả trong RAM (sandbox tự bật khi test).
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '../config/database.js';
import { buildPublicUrl, listObjects, putObject } from '../config/r2.js';
import {
  dongBoCay, layCayVo, xinDuongDayNet, xacNhanNet, chuyenKhoaRieng, khoaCanDonChoTrang, _chiDeKiemThu as K,
} from './voInk.service.js';
import { getNote } from './notes.service.js';

async function coCsdl(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(new URL(url).hostname)) return false;
    await prisma.$queryRaw`SELECT "ink_text" FROM "notes" LIMIT 1`;
    return true;
  } catch { return false; }
}
const tag = randomBytes(4).toString('hex');
const userIds: number[] = [];
after(async () => {
  if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
  await prisma.$disconnect().catch(() => {});
});
const ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));
const khoaTrong = async (thuMuc: string) => (await listObjects(thuMuc)).map((o) => o.key).sort();

test('khoá mới có chuỗi ngẫu nhiên; URL trả về là URL ký; dọn bản cũ giữ bản liền trước', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ đã migrate'); return; }
  const u = await prisma.user.create({ data: { username: `vo3_${tag}`, email: `vo3_${tag}@example.invalid`, password: null } });
  userIds.push(u.id);
  const tr = randomUUID();
  const r = await dongBoCay(u.id, [{ clientId: randomUUID(), ten: 'M', cuons: [{ clientId: randomUUID(), ten: 'C', trangs: [{ clientId: tr, thuTu: 0, phienBanNet: 0 }] }] }]);
  const id = r.mons[0].cuons[0].trangs[0].id;
  const thuMuc = K.thuMucNet(u.id, id);

  // Tệp kiểu cũ còn sót trong thư mục (v0 — khoá đoán được).
  await putObject(K.khoaNet(u.id, id, 0, 'png'), Buffer.from('cu'), 'image/png');

  const day = async () => {
    const d = await xinDuongDayNet(u.id, id, true);
    assert.match(d.inkKey, new RegExp(`^${thuMuc}v${d.phienBanMoi}-[0-9a-f]{24}\\.drawing$`));
    assert.equal(d.previewKey, d.inkKey.replace(/\.drawing$/, '.png'), 'nét + ảnh chung chuỗi ngẫu nhiên');
    await putObject(d.inkKey, Buffer.from(`net${d.phienBanMoi}`), 'application/octet-stream');
    await putObject(d.previewKey!, Buffer.from(`anh${d.phienBanMoi}`), 'image/png');
    const kq = await xacNhanNet(u.id, id, { inkKey: d.inkKey, previewKey: d.previewKey, phienBanDuaTren: d.phienBanMoi - 1, soNet: 1 });
    assert.ok(kq.inkUrl.includes('X-Amz-Signature='), 'URL đọc phải có chữ ký');
    assert.notEqual(kq.inkUrl, buildPublicUrl(d.inkKey));
    return d;
  };
  const d1 = await day();
  const d2 = await day();
  await ngu(150);
  // Sau v2: giữ v1 (lưới an toàn) + v2, xoá tệp kiểu cũ v0.
  assert.deepEqual(await khoaTrong(thuMuc), [d1.inkKey, d1.previewKey!, d2.inkKey, d2.previewKey!].sort());
  const d3 = await day();
  await ngu(150);
  assert.deepEqual(await khoaTrong(thuMuc), [d2.inkKey, d2.previewKey!, d3.inkKey, d3.previewKey!].sort(), 'v1 bị dọn');

  // Hai khoá khác nhau ở hai lượt — không đoán được từ số phiên bản.
  assert.notEqual(d2.inkKey.split('-')[1], d3.inkKey.split('-')[1]);

  // Mọi đường trả URL đều ký: cây kéo về, sync, note web.
  const cay = await layCayVo(u.id);
  const tt = cay.mons[0].cuons[0].trangs[0];
  assert.ok(tt.inkUrl?.includes('X-Amz-Signature=') && tt.previewUrl?.includes('X-Amz-Signature='));
  const sync = await dongBoCay(u.id, [{ clientId: cay.mons[0].clientId, ten: 'M', cuons: [{ clientId: cay.mons[0].cuons[0].clientId, ten: 'C', trangs: [{ clientId: tr, thuTu: 0, phienBanNet: 3 }] }] }]);
  assert.ok(sync.mons[0].cuons[0].trangs[0].inkUrl?.includes('X-Amz-Signature='));
  const note = await getNote(u.id, id);
  assert.ok(note.inkPreviewUrl?.includes('X-Amz-Signature='));
  // (Sandbox ánh URL ký về cùng gốc với CDN giả, nên so cả chuỗi chứ không so tiền tố.)
  assert.notEqual(note.inkPreviewUrl, buildPublicUrl(note.inkPreviewKey!), 'không còn URL CDN công khai');

  // Purge: gom hết tệp trong thư mục trang (kể cả bản liền trước có khoá ngẫu nhiên).
  const gom = await khoaCanDonChoTrang([id]);
  for (const k of [d2.inkKey, d2.previewKey!, d3.inkKey, d3.previewKey!]) assert.ok(gom.includes(k), `purge thiếu ${k}`);
});

test('chuyển khoá cũ: chạy thử không ghi; chạy thật chép sang khoá ngẫu nhiên, đổi con trỏ, xoá tệp cũ; chen ngang thì thôi', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ đã migrate'); return; }
  const u = await prisma.user.create({ data: { username: `vo4_${tag}`, email: `vo4_${tag}@example.invalid`, password: null } });
  userIds.push(u.id);
  const r = await dongBoCay(u.id, [{ clientId: randomUUID(), ten: 'M', cuons: [{ clientId: randomUUID(), ten: 'C', trangs: [
    { clientId: randomUUID(), thuTu: 0, phienBanNet: 0 }, { clientId: randomUUID(), thuTu: 1, phienBanNet: 0 }] }] }]);
  const [id, id2] = r.mons[0].cuons[0].trangs.map((x) => x.id);
  const cu = { ink: K.khoaNet(u.id, id, 2, 'drawing'), anh: K.khoaNet(u.id, id, 2, 'png'), truoc: K.khoaNet(u.id, id, 1, 'drawing') };
  for (const k of Object.values(cu)) await putObject(k, Buffer.from(k), 'application/octet-stream');
  await prisma.note.update({ where: { id }, data: { inkKey: cu.ink, inkPreviewKey: cu.anh, inkVersion: 2 } });
  const hang = () => prisma.note.findUniqueOrThrow({ where: { id }, select: { id: true, userId: true, inkKey: true, inkPreviewKey: true, inkVersion: true } });

  assert.ok(K.laKhoaNetCu(cu.ink) && !K.laKhoaNetCu(`${K.thuMucNet(1, 2)}v3-${'a'.repeat(24)}.png`));
  assert.equal((await chuyenKhoaRieng(await hang(), false)).trangThai, 'chayThu');
  assert.equal((await hang()).inkKey, cu.ink, 'chạy thử không đổi gì');

  const kq = await chuyenKhoaRieng(await hang(), true);
  assert.equal(kq.trangThai, 'daChuyen');
  const sau = await hang();
  assert.match(sau.inkKey!, /\/v2-[0-9a-f]{24}\.drawing$/);
  assert.match(sau.inkPreviewKey!, /\/v2-[0-9a-f]{24}\.png$/);
  assert.equal(sau.inkVersion, 2, 'nội dung y hệt ⇒ không tăng phiên bản');
  assert.deepEqual(await khoaTrong(K.thuMucNet(u.id, id)), [sau.inkKey!, sau.inkPreviewKey!].sort(), 'mọi khoá cũ bị xoá');
  assert.equal((await chuyenKhoaRieng(sau, true)).trangThai, 'boQua', 'chạy lại là bỏ qua');

  // Chen ngang: con trỏ đổi giữa lúc chép ⇒ không ghi, xoá bản chép.
  const k2 = K.khoaNet(u.id, id2, 1, 'drawing');
  await putObject(k2, Buffer.from('x'), 'application/octet-stream');
  await prisma.note.update({ where: { id: id2 }, data: { inkKey: k2, inkVersion: 1 } });
  const cuHang = await prisma.note.findUniqueOrThrow({ where: { id: id2 }, select: { id: true, userId: true, inkKey: true, inkPreviewKey: true, inkVersion: true } });
  await prisma.note.update({ where: { id: id2 }, data: { inkKey: `${K.thuMucNet(u.id, id2)}v2-${'b'.repeat(24)}.drawing` } });
  assert.equal((await chuyenKhoaRieng(cuHang, true)).trangThai, 'chenNgang');
  assert.deepEqual(await khoaTrong(K.thuMucNet(u.id, id2)), [k2], 'bản chép bị xoá, không đụng gì khác');
});
