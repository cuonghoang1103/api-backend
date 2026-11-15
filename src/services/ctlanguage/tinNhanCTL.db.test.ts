/**
 * Tin nhắn app CT Language (15/11/2026) trên CSDL THẬT (local): lời mời nhắn tin (người lạ ⇒ tab Lời mời, trả lời /
 * chấp nhận / quen ⇒ hộp chính), số chưa đọc tách hộp chính / lời mời, từ chối ⇒ ẩn + không đẩy, tìm người trong cộng
 * đồng (không lộ người ngoài cộng đồng, người chặn nhau, người bị khoá), dải đang trực tuyến (theo dõi NHAU mới thấy,
 * công tắc ẩn trạng thái, đối ứng, chặn).
 *
 *   npx tsx --test src/services/ctlanguage/tinNhanCTL.db.test.ts
 *
 * Tạo 6 user tạm, xoá đúng các user đó (FK CASCADE dọn hội thoại/tin/theo dõi/bài). Không có DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let ms: typeof import('../messages.service.js').messagesService;
let tn: typeof import('./tinNhanCTL.js');
const ids: number[] = [];
let [toi, la, ban, theoMotChieu, khoa, ngoai] = [0, 0, 0, 0, 0, 0];
let tag = '';

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  ms = (await import('../messages.service.js')).messagesService;
  tn = await import('./tinNhanCTL.js');
  tag = `tnx${Date.now().toString(36)}`;
  const ten = ['Tôi', 'Người Lạ', 'Bạn Học', 'Người Theo', 'Bị Khoá', 'Ngoài Cộng Đồng'];
  for (let i = 0; i < ten.length; i++) {
    const u = await prisma.user.create({
      data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, displayName: `${ten[i]} ${tag}`, lastActiveAt: new Date() },
    });
    ids.push(u.id);
  }
  [toi, la, ban, theoMotChieu, khoa, ngoai] = ids;
  await prisma.user.update({ where: { id: khoa }, data: { accountNonLocked: false } });
  // Hoạt động trong cộng đồng: người lạ, bạn học, người bị khoá có bài; "ngoài cộng đồng" không có gì.
  for (const u of [la, ban, khoa]) await prisma.ctlBai.create({ data: { nn: 'ja', userId: u, noiDung: `Bài của ${u} ${tag}` } });
  // Bạn học ↔ tôi theo dõi NHAU; "người theo" chỉ theo dõi tôi (một chiều).
  await prisma.ctlTheoDoi.createMany({ data: [
    { nguoiId: toi, duocId: ban }, { nguoiId: ban, duocId: toi }, { nguoiId: theoMotChieu, duocId: toi },
  ] });
});

after(async () => {
  if (!coDb) return;
  await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] } });
  await prisma.messageThread.deleteMany({ where: { OR: [{ userAId: { in: ids } }, { userBId: { in: ids } }] } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

const hop = async (u: number) => ms.listThreadsForUser(u) as Promise<Array<{ id: number; laLoiMoi: boolean; peer: { id: number; lastActiveAt: Date | null } | null }>>;

t('người lạ nhắn ⇒ lời mời; trả lời ⇒ hộp chính; người quen (theo dõi) không bao giờ là lời mời', async () => {
  const th = await ms.getOrCreateUserThread(la, toi);
  await ms.sendMessage(th.id, la, { content: 'Chào bạn, mình học N5 cùng nhé?' });
  let ds = await hop(toi);
  assert.equal(ds.find((x) => x.id === th.id)?.laLoiMoi, true, 'người lạ ⇒ lời mời');
  assert.equal((await hop(la)).find((x) => x.id === th.id)?.laLoiMoi, false, 'người GỬI không thấy hội thoại là lời mời');

  const so = await ms.getUnreadSplit(toi);
  assert.equal(so.loiMoi >= 1, true);
  assert.equal(so.count, so.hopChinh + so.loiMoi);
  const truoc = so.hopChinh;

  // Bạn học (tôi theo dõi) nhắn ⇒ hộp chính, dù tôi chưa trả lời.
  const th2 = await ms.getOrCreateUserThread(ban, toi);
  await ms.sendMessage(th2.id, ban, { content: 'Mai ôn kanji không?' });
  ds = await hop(toi);
  assert.equal(ds.find((x) => x.id === th2.id)?.laLoiMoi, false);
  assert.equal((await ms.getUnreadSplit(toi)).hopChinh, truoc + 1);

  // Trả lời người lạ ⇒ hết là lời mời.
  await ms.sendMessage(th.id, toi, { content: 'Ok bạn!' });
  assert.equal((await hop(toi)).find((x) => x.id === th.id)?.laLoiMoi, false);
});

t('chấp nhận lời mời ⇒ hộp chính; từ chối (xoá cho riêng mình) ⇒ ẩn, chấp nhận sau vẫn khôi phục', async () => {
  const th = await ms.getOrCreateUserThread(theoMotChieu, toi);
  await ms.sendMessage(th.id, theoMotChieu, { content: 'Theo dõi một chiều KHÔNG đủ để vào hộp chính' });
  assert.equal((await hop(toi)).find((x) => x.id === th.id)?.laLoiMoi, true, 'họ theo dõi tôi một chiều ⇒ vẫn là lời mời');

  await ms.deleteThreadForViewer(th.id, toi);
  assert.equal((await hop(toi)).some((x) => x.id === th.id), false, 'từ chối ⇒ biến khỏi hộp thư');
  await ms.sendMessage(th.id, theoMotChieu, { content: 'nhắn tiếp' });
  assert.equal((await hop(toi)).some((x) => x.id === th.id), false, 'tin mới không kéo hội thoại đã từ chối về');

  const pref = await ms.acceptRequest(th.id, toi);
  assert.ok(pref?.acceptedAt);
  const lai = (await hop(toi)).find((x) => x.id === th.id);
  assert.equal(lai?.laLoiMoi, false, 'chấp nhận ⇒ hộp chính');
  await assert.rejects(ms.acceptRequest(th.id, ngoai), 'người ngoài hội thoại không chấp nhận hộ được');
});

t('tìm người: chỉ người trong cộng đồng; bỏ chính mình, người chặn nhau, người bị khoá; q rỗng ⇒ người mình theo dõi', async () => {
  const kq = await tn.timNguoi(toi, tag);
  const thay = new Set(kq.map((x) => x.id));
  assert.ok(thay.has(la) && thay.has(ban) && thay.has(theoMotChieu), 'có bài hoặc có quan hệ theo dõi với tôi');
  assert.ok(!thay.has(toi), 'không hiện chính mình');
  assert.ok(!thay.has(khoa), 'tài khoản bị khoá không hiện');
  assert.ok(!thay.has(ngoai), 'người ngoài cộng đồng CT Language không hiện (không phải danh bạ toàn web)');
  assert.equal(kq.find((x) => x.id === ban)?.daTheoDoi, true);
  assert.equal(kq.find((x) => x.id === la)?.nhanTinDuoc, true, 'mặc định nhận tin người lạ');

  await prisma.user.update({ where: { id: la }, data: { allowMessagesFromStrangers: false } });
  await prisma.user.update({ where: { id: theoMotChieu }, data: { allowMessagesFromStrangers: false } });
  const kq2 = await tn.timNguoi(toi, tag);
  assert.equal(kq2.find((x) => x.id === la)?.nhanTinDuoc, true, 'tắt nhận tin người lạ nhưng đã có hội thoại ⇒ vẫn nhắn được');

  await prisma.userBlock.create({ data: { blockerId: la, blockedId: toi } });
  assert.equal((await tn.timNguoi(toi, tag)).some((x) => x.id === la), false, 'họ chặn tôi ⇒ tôi không tìm thấy họ');
  await prisma.userBlock.deleteMany({ where: { blockerId: la, blockedId: toi } });
  await prisma.user.update({ where: { id: la }, data: { allowMessagesFromStrangers: true } });

  const goiY = await tn.timNguoi(toi, '  ');
  assert.deepEqual(goiY.map((x) => x.id), [ban], 'q rỗng ⇒ đúng người tôi đang theo dõi');
});

t('đang trực tuyến: người đã nhắn ∪ theo dõi NHAU; theo dõi một chiều / tắt trạng thái / chặn / đối ứng ⇒ không thấy', async () => {
  // Tôi đã có hội thoại với: người lạ (đã trả lời), bạn học, người theo (đã chấp nhận). "Ngoài" chưa có gì.
  const dangNoi = [la, ban, theoMotChieu, ngoai, khoa];
  let ds = await tn.trucTuyen(toi, dangNoi);
  let thay = new Set(ds.map((x) => x.id));
  assert.ok(thay.has(la) && thay.has(ban) && thay.has(theoMotChieu));
  assert.ok(!thay.has(ngoai), 'không quan hệ ⇒ không thấy');
  assert.ok(!thay.has(khoa));
  assert.ok(ds.find((x) => x.id === ban)?.threadId, 'kèm id hội thoại để mở thẳng');

  // Bạn học theo dõi nhau nhưng CHƯA từng nhắn ⇒ vẫn thấy (vòng = theo dõi nhau). Xoá hội thoại để thử.
  await prisma.messageThread.deleteMany({ where: { type: 'USER', OR: [{ userAId: ban, userBId: toi }, { userAId: toi, userBId: ban }] } });
  ds = await tn.trucTuyen(toi, dangNoi);
  assert.equal(ds.find((x) => x.id === ban)?.threadId, null, 'theo dõi nhau, chưa nhắn ⇒ thấy, threadId null');

  await prisma.user.update({ where: { id: ban }, data: { showActiveStatus: false } });
  assert.equal((await tn.trucTuyen(toi, dangNoi)).some((x) => x.id === ban), false, 'họ tắt trạng thái ⇒ ẩn');
  await prisma.user.update({ where: { id: ban }, data: { showActiveStatus: true } });

  await prisma.user.update({ where: { id: toi }, data: { showActiveStatus: false } });
  assert.deepEqual(await tn.trucTuyen(toi, dangNoi), [], 'mình tắt ⇒ không thấy ai (đối ứng)');
  await prisma.user.update({ where: { id: toi }, data: { showActiveStatus: true } });

  await prisma.userBlock.create({ data: { blockerId: toi, blockedId: la } });
  thay = new Set((await tn.trucTuyen(toi, dangNoi)).map((x) => x.id));
  assert.ok(!thay.has(la), 'chặn ⇒ không thấy');
  await prisma.userBlock.deleteMany({ where: { blockerId: toi, blockedId: la } });

  // Theo dõi một chiều KHÔNG mở trạng thái: người theo (một chiều) chỉ thấy vì đã có hội thoại.
  await prisma.messageThread.deleteMany({ where: { type: 'USER', OR: [{ userAId: theoMotChieu, userBId: toi }, { userAId: toi, userBId: theoMotChieu }] } });
  assert.equal((await tn.trucTuyen(toi, dangNoi)).some((x) => x.id === theoMotChieu), false, 'một chiều, không hội thoại ⇒ không thấy');
});
