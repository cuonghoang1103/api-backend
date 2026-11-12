/**
 * Cộng đồng CT Language trên CSDL THẬT (local) — kiểm đủ bốn thứ Apple 1.2 đòi: lọc, báo cáo, chặn, gỡ.
 *
 *   npx tsx --test src/services/ctlanguage/congDong.db.test.ts
 *
 * Tạo 4 user tạm, chạy, xoá đúng các user đó (FK CASCADE dọn bài/trả lời) + các thông báo báo cáo đã tạo.
 * Không có DATABASE_URL ⇒ bỏ qua. KHÔNG đưa vào `npm test` (CI không có Postgres).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let cd: typeof import('./congDong.js');
let kd: typeof import('../kiemDuyetAdmin.service.js');
const ids: number[] = [];
let [a, b, c, d] = [0, 0, 0, 0];

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  cd = await import('./congDong.js');
  kd = await import('../kiemDuyetAdmin.service.js');
  const tag = `ctlcd${Date.now().toString(36)}`;
  for (let i = 0; i < 4; i++) {
    const u = await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid` } });
    ids.push(u.id);
  }
  [a, b, c, d] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('đăng + trả lời + đếm trả lời; lọc từ xấu ⇒ 422', async () => {
  const bai = await cd.dangBai(a, 'ja', { noiDung: '「は」と「が」khác nhau thế nào ạ?', loai: 'hoi' });
  assert.equal(bai.cuaToi, true);
  const sau = await cd.traLoi(b, bai.id, { noiDung: '「は」nêu chủ đề, 「が」nhấn chủ ngữ nhé.' });
  assert.equal(sau.soTraLoi, 1);
  assert.equal(sau.traLoi.length, 1);
  await assert.rejects(cd.dangBai(a, 'ja', { noiDung: 'kill yourself' }), (e: { statusCode?: number; code?: string }) => e.code === 'CONTENT_BLOCKED');
  const ds = await cd.dsBai('ja', null);
  assert.ok(ds.items.some((x) => x.id === bai.id));
});

t('chặn ⇒ HAI CHIỀU không thấy bài nhau, không trả lời được; bỏ chặn thì thấy lại', async () => {
  const bai = await cd.dangBai(c, 'zh', { noiDung: '学习 và 研究 dùng khác nhau ra sao?' });
  await cd.chan(d, c);
  assert.ok(!(await cd.dsBai('zh', d)).items.some((x) => x.id === bai.id), 'người chặn không thấy');
  const baiD = await cd.dangBai(d, 'zh', { noiDung: 'Cho mình hỏi về thanh nhẹ.' });
  assert.ok(!(await cd.dsBai('zh', c)).items.some((x) => x.id === baiD.id), 'người bị chặn cũng không thấy');
  await assert.rejects(cd.traLoi(d, bai.id, { noiDung: 'xin chào' }));
  assert.equal((await cd.dsDaChan(d)).items[0].id, c);
  await cd.boChan(d, c);
  assert.ok((await cd.dsBai('zh', d)).items.some((x) => x.id === bai.id));
});

t('báo cáo: một người một lần; đủ 3 người ⇒ tự ẩn; admin gỡ được qua thông báo BAO_CAO', async () => {
  const bai = await cd.dangBai(a, 'en', { noiDung: 'Spam spam buy followers here' });
  await assert.rejects(cd.baoCao(a, { loai: 'bai', id: bai.id }), 'không tự báo cáo mình');
  const r1 = await cd.baoCao(b, { loai: 'bai', id: bai.id, lyDo: 'spam' });
  assert.deepEqual([r1.trung, r1.daAn], [false, false]);
  assert.equal((await cd.baoCao(b, { loai: 'bai', id: bai.id })).trung, true, 'báo lại ⇒ trùng');
  await cd.baoCao(c, { loai: 'bai', id: bai.id });
  const r3 = await cd.baoCao(d, { loai: 'bai', id: bai.id });
  assert.equal(r3.daAn, true);
  assert.ok(!(await cd.dsBai('en', null)).items.some((x) => x.id === bai.id), 'đã ẩn khỏi bảng tin');

  // Trả lời bị báo cáo ⇒ admin bấm "Gỡ nội dung" trên thông báo.
  const bai2 = await cd.dangBai(b, 'en', { noiDung: 'What is the difference between affect and effect?' });
  const ct = await cd.traLoi(c, bai2.id, { noiDung: 'Nội dung xấu cần gỡ' });
  const tl = ct.traLoi[0];
  await cd.baoCao(a, { loai: 'tra-loi', id: tl.id, lyDo: 'xuc-pham' });
  const tb = await prisma.adminNotification.findFirst({ where: { khoaChongTrung: `ctw-report:ctl_tra_loi:${tl.id}:${a}` } });
  assert.ok(tb, 'đã vào hộp BAO_CAO');
  assert.deepEqual(await kd.mucTieuCuaKhoa(tb!.khoaChongTrung), { kind: 'ctl_tra_loi', id: tl.id });
  assert.equal(await kd.tacGiaCua({ kind: 'ctl_tra_loi', id: tl.id }, a), c);
  const g = await kd.goNoiDungTuThongBao(tb!.id, a);
  assert.equal(g.removed, true);
  assert.equal((await cd.chiTietBai(bai2.id, null)).traLoi.length, 0);
});

t('xoá của mình: chỉ tác giả; trả lời xoá thì trừ đếm', async () => {
  const bai = await cd.dangBai(a, 'ja', { noiDung: 'Mẹo nhớ kanji 休?' });
  const ct = await cd.traLoi(b, bai.id, { noiDung: 'Người 亻 dựa gốc cây 木 ⇒ nghỉ.' });
  await assert.rejects(cd.xoaCuaToi(a, 'tra-loi', ct.traLoi[0].id), 'không xoá được của người khác');
  await cd.xoaCuaToi(b, 'tra-loi', ct.traLoi[0].id);
  assert.equal((await cd.chiTietBai(bai.id, null)).soTraLoi, 0);
  await cd.xoaCuaToi(a, 'bai', bai.id);
  await assert.rejects(cd.chiTietBai(bai.id, null));
});

t('người viết bị khoá ⇒ bài ẩn', async () => {
  const bai = await cd.dangBai(d, 'en', { noiDung: 'Is "data" singular or plural?' });
  await prisma.user.update({ where: { id: d }, data: { accountNonLocked: false } });
  assert.ok(!(await cd.dsBai('en', null)).items.some((x) => x.id === bai.id));
  await prisma.user.update({ where: { id: d }, data: { accountNonLocked: true } });
});
