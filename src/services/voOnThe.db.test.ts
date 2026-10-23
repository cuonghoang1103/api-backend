/**
 * Vở (23/10/2026) — chữ nhận dạng, thẻ ôn, link chỉ-xem, PDF cả cuốn: chạy thật trên CSDL.
 *
 * Chỉ Postgres cục bộ ĐÃ có migration `20261023160000_vo_the_on_chu_link`; không có ⇒ TỰ BỎ QUA.
 * R2 đi kho giả trong RAM (storage sandbox tự bật khi `node --test`).
 *   DATABASE_URL=postgresql://…@localhost:…/<csdl test> npx tsx --test src/services/voOnThe.db.test.ts
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import { dongBoCay, type MonVao } from './voInk.service.js';
import { luuTheOn, theCuaTrang, theHomNay, chamTheOn, suaTheOn, xoaTheOn } from './voOnThe.service.js';
import { luuChuNhanDang, taoLinkChiXem, thuHoiLinkChiXem, xemCongKhai, anhCongKhai, pdfCuonVo } from './voChiaSe.service.js';
import { listVocab, listFlashcards, searchPalette, searchNotes } from './notes.service.js';

async function coCsdl(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(new URL(url).hostname)) return false;
    await Promise.race([
      prisma.$queryRaw`SELECT "ink_text", "ink_share_token" FROM "notes" LIMIT 1`,
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
    data: { username: `vo2_test_${tag}_${hau}`, email: `vo2_test_${tag}_${hau}@example.invalid`, password: null },
  });
  userIds.push(u.id);
  return u.id;
}
function cay(mon: string, cuon: string, trangs: string[]): MonVao[] {
  return [{ clientId: mon, ten: 'SWT301 · Software Testing', cuons: [{
    clientId: cuon, ten: 'Fall 2026',
    trangs: trangs.map((c, i) => ({ clientId: c, thuTu: i, tieuDe: `Slot ${i + 1} · 0${i + 1}/10`, phienBanNet: 0, giay: 'tuVung3Cot' })),
  }] }];
}
const loiMa = (ma: string) => (e: { code?: string }) => e.code === ma;

test('chữ nhận dạng: chỉ ghi trang SỐNG của chính mình, không đổi updatedAt; tìm thấy trong Notes', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ đã migrate'); return; }
  const a = await taoNguoi('a'), b = await taoNguoi('b');
  const mon = randomUUID(), cuon = randomUUID(), t1 = randomUUID(), t2 = randomUUID();
  const r = await dongBoCay(a, cay(mon, cuon, [t1, t2]));
  const id1 = r.mons[0].cuons[0].trangs[0].id;
  assert.equal((await prisma.note.findUniqueOrThrow({ where: { id: id1 } })).paperKind, 'tuVung3Cot', 'mẫu mới được nhận');
  const truoc = await prisma.note.findUniqueOrThrow({ where: { id: id1 } });
  await new Promise((r2) => setTimeout(r2, 15));

  const kq = await luuChuNhanDang(a, [{ clientId: t1, chu: '  equivalence partitioning phân vùng tương đương  ' }, { clientId: t2, chu: '' }, { clientId: randomUUID(), chu: 'x' }]);
  assert.equal(kq.daLuu, 2);
  assert.equal(kq.khongThay.length, 1);
  const sau = await prisma.note.findUniqueOrThrow({ where: { id: id1 } });
  assert.equal(sau.inkText, 'equivalence partitioning phân vùng tương đương');
  assert.ok(sau.inkTextAt);
  assert.equal(sau.updatedAt.toISOString(), truoc.updatedAt.toISOString(), 'đọc chữ không phải sửa trang');
  assert.equal((await prisma.note.findFirstOrThrow({ where: { clientId: t2 } })).inkText, null, "'' ⇒ null");

  // Người khác gửi cùng clientId ⇒ không đụng.
  const kqB = await luuChuNhanDang(b, [{ clientId: t1, chu: 'đè' }]);
  assert.equal(kqB.daLuu, 0);
  assert.equal((await prisma.note.findUniqueOrThrow({ where: { id: id1 } })).inkText, sau.inkText);
  await assert.rejects(() => luuChuNhanDang(a, [{ clientId: '../x', chu: 'a' }]), loiMa('INVALID_CLIENT_ID'));

  const p = await searchPalette(a, 'phân vùng');
  const hit = p.notes.find((n) => n.id === id1);
  assert.ok(hit, 'palette thấy chữ viết tay');
  assert.equal(hit!.matchIn, 'ink');
  assert.match(hit!.snippet, /phân vùng/);
  assert.ok((await searchNotes(a, { q: 'partitioning' })).some((n) => n.id === id1));
  assert.equal((await searchPalette(b, 'phân vùng')).notes.length, 0);
});

test('thẻ ôn: lưu idempotent, ý chính thay, hôm nay lọc đến hạn, chấm đổi lịch, bảng từ vựng không lẫn', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ đã migrate'); return; }
  const a = await taoNguoi('c'), b = await taoNguoi('d');
  const mon = randomUUID(), cuon = randomUUID(), t1 = randomUUID();
  const r = await dongBoCay(a, cay(mon, cuon, [t1]));
  const noteId = r.mons[0].cuons[0].trangs[0].id;
  const c1 = randomUUID(), c2 = randomUUID();

  await assert.rejects(() => luuTheOn(a, { trangClientId: randomUUID(), the: [] }), loiMa('NOTE_NOT_FOUND'));
  await assert.rejects(() => luuTheOn(b, { trangClientId: t1, the: [] }), loiMa('NOTE_NOT_FOUND'));

  const l1 = await luuTheOn(a, {
    trangClientId: t1, yChinh: ['Ý 1', 'Ý 2'],
    the: [{ clientId: c1, truoc: 'EP là gì?', sau: 'Chia miền đầu vào', loai: 'THE' },
      { clientId: c2, truoc: 'Vì sao dùng BVA?', sau: 'Lỗi hay ở biên', loai: 'CAU_HOI' }],
  });
  assert.equal(l1.noteId, noteId);
  assert.deepEqual(l1.yChinh.map((y) => y.noiDung), ['Ý 1', 'Ý 2']);
  assert.equal(l1.the.length, 2);
  assert.ok(l1.the.every((x) => x.dueAt), 'thẻ mới đến hạn ngay');

  // Gửi lại đúng payload (mạng cắt, thử lại) + ý chính mới ⇒ không nhân đôi thẻ, ý chính bị THAY.
  const l2 = await luuTheOn(a, {
    trangClientId: t1, yChinh: ['Ý mới'],
    the: [{ clientId: c1, truoc: 'EP là gì? (sửa)', sau: 'Chia miền đầu vào', loai: 'THE' }],
  });
  assert.equal(l2.the.length, 2);
  assert.deepEqual(l2.yChinh.map((y) => y.noiDung), ['Ý mới']);
  assert.equal(l2.the.find((x) => x.clientId === c1)!.truoc, 'EP là gì? (sửa)');
  // Không gửi yChinh ⇒ giữ nguyên.
  const l3 = await luuTheOn(a, { trangClientId: t1, the: [] });
  assert.equal(l3.yChinh.length, 1);
  assert.deepEqual((await theCuaTrang(a, { noteId })).the.map((x) => x.id).sort(), l2.the.map((x) => x.id).sort());

  // Bảng từ vựng KHÔNG lẫn thẻ Vở; bộ flashcard có thẻ nhưng không có ý chính.
  await prisma.noteVocabEntry.create({ data: { userId: a, noteId, term: '分', meaning: 'phút' } });
  assert.deepEqual((await listVocab(a, noteId)).map((v) => v.term), ['分']);
  const fc = await listFlashcards(a, noteId);
  assert.equal(fc.cards.length, 3);
  assert.ok(!fc.cards.some((c) => c.term === 'Ý mới'));

  // Hôm nay: 2 thẻ đến hạn (từ vựng thường không tính).
  const hn = await theHomNay(a, {});
  assert.equal(hn.conLai, 2);
  assert.equal(hn.tong, 2);
  assert.equal(hn.the[0].trang.clientId, t1);
  assert.equal(hn.the[0].trang.monTen, 'SWT301 · Software Testing');
  assert.equal((await theHomNay(b, {})).conLai, 0);

  // Chấm "tốt" ⇒ hẹn 1 ngày ⇒ không còn đến hạn hôm nay; "lại" ⇒ lapses + 1.
  const idThe = l2.the.find((x) => x.clientId === c1)!.id;
  const ch = await chamTheOn(a, idThe, { muc: 'tot' });
  assert.equal(ch.lanOn, 1);
  assert.equal(ch.intervalDays, 1);
  assert.equal(ch.repetitions, 1);
  assert.ok(new Date(ch.dueAt!).getTime() > Date.now() + 20 * 3600_000);
  const hn2 = await theHomNay(a, {});
  assert.equal(hn2.conLai, 1);
  assert.equal(hn2.daOnHomNay, 1);
  const idHoi = l2.the.find((x) => x.clientId === c2)!.id;
  assert.equal((await chamTheOn(a, idHoi, { muc: 'lai' })).lapses, 1);
  await assert.rejects(() => chamTheOn(a, idThe, { muc: 'xx' }), loiMa('INVALID_INPUT'));
  await assert.rejects(() => chamTheOn(b, idThe, { muc: 'de' }), loiMa('NOT_FOUND'));

  // Sửa/xoá: chỉ chủ, chỉ thẻ Vở (dòng từ vựng thường không xoá được qua đường này).
  assert.equal((await suaTheOn(a, idThe, { sau: 'Đáp mới' })).sau, 'Đáp mới');
  const vocab = await prisma.noteVocabEntry.findFirstOrThrow({ where: { userId: a, noteId, kind: 'VOCAB' } });
  await assert.rejects(() => xoaTheOn(a, vocab.id), loiMa('NOT_FOUND'));
  await assert.rejects(() => xoaTheOn(b, idThe), loiMa('NOT_FOUND'));
  assert.deepEqual(await xoaTheOn(a, idThe), { ok: true });

  // Trang bị xoá mềm ⇒ thẻ không còn đến hạn.
  await prisma.note.update({ where: { id: noteId }, data: { deletedAt: new Date() } });
  assert.equal((await theHomNay(a, { den: new Date(Date.now() + 30 * 86400_000).toISOString() })).conLai, 0);
});

test('link chỉ-xem: tạo idempotent, công khai đọc được ảnh, thu hồi ⇒ 404; PDF cả cuốn', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL cục bộ đã migrate'); return; }
  const a = await taoNguoi('e'), b = await taoNguoi('f');
  const mon = randomUUID(), cuon = randomUUID(), t1 = randomUUID(), t2 = randomUUID();
  const r = await dongBoCay(a, cay(mon, cuon, [t1, t2]));
  const [id1] = r.mons[0].cuons[0].trangs.map((x) => x.id);
  const chapterId = r.mons[0].cuons[0].id;

  const png = await sharp({ create: { width: 200, height: 280, channels: 3, background: '#fffdf6' } }).png().toBuffer();
  const key = `notes/u${a}/ink/${id1}/v1.png`;
  await putObject(key, png, 'image/png');
  await prisma.note.update({ where: { id: id1 }, data: { inkPreviewKey: key, inkVersion: 1 } });

  await assert.rejects(() => taoLinkChiXem(b, id1), loiMa('NOTE_NOT_FOUND'));
  const l1 = await taoLinkChiXem(a, id1);
  const l2 = await taoLinkChiXem(a, id1);
  assert.equal(l1.token, l2.token, 'bấm lại không đổi link');
  assert.equal(l1.duongDan, `/vo/xem/${l1.token}`);
  assert.ok(l1.token.length >= 30);

  const xem = await xemCongKhai(l1.token);
  assert.equal(xem.tieuDe, 'Slot 1 · 01/10');
  assert.equal(xem.monTen, 'SWT301 · Software Testing');
  assert.equal(xem.cuonTen, 'Fall 2026');
  assert.equal(xem.coAnh, true);
  assert.ok(!JSON.stringify(xem).includes('notes/u'), 'không lộ khoá R2');
  assert.equal((await anhCongKhai(l1.token)).length, png.length);

  const pdf = await pdfCuonVo(a, chapterId);
  assert.equal(pdf.soTrang, 2);
  assert.equal(pdf.pdf.subarray(0, 5).toString(), '%PDF-');
  assert.match(pdf.tenTep, /^SWT301-Software-Testing-Fall-2026\.pdf$/);
  await assert.rejects(() => pdfCuonVo(b, chapterId), loiMa('NOT_FOUND'));

  assert.deepEqual(await thuHoiLinkChiXem(a, id1), { ok: true });
  await assert.rejects(() => xemCongKhai(l1.token), loiMa('SHARE_NOT_FOUND'));
  await assert.rejects(() => anhCongKhai(l1.token), loiMa('SHARE_NOT_FOUND'));
  const l3 = await taoLinkChiXem(a, id1);
  assert.notEqual(l3.token, l1.token, 'link mới sau thu hồi');
  await prisma.note.update({ where: { id: id1 }, data: { deletedAt: new Date() } });
  await assert.rejects(() => xemCongKhai(l3.token), loiMa('SHARE_NOT_FOUND'));
  await assert.rejects(() => xemCongKhai('ngắn'), loiMa('SHARE_NOT_FOUND'));
});
