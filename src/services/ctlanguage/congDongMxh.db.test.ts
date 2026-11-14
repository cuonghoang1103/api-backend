/**
 * Cộng đồng CT Language kiểu mạng xã hội (14/11/2026) trên CSDL THẬT (local): tab, tiêu đề/thẻ/sửa, thích, xem, lưu,
 * theo dõi, hay nhất, @nhắc, BTV, thông báo, trang người dùng, xếp hạng, Gấu AI (AI GIẢ — không gọi mạng) và luật chặn
 * ở MỌI chỗ.
 *
 *   npx tsx --test src/services/ctlanguage/congDongMxh.db.test.ts
 *
 * Tạo 5 user tạm, xoá đúng các user đó (FK CASCADE dọn bài/trả lời/thích/lưu/theo dõi/thông báo) + thông báo admin.
 * Không có DATABASE_URL ⇒ bỏ qua. KHÔNG đưa vào `npm test` (CI không có Postgres).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let cd: typeof import('./congDong.js');
let ng: typeof import('./congDongNguoi.js');
let gau: typeof import('./congDongGau.js');
const ids: number[] = [];
let [a, b, c, d, adm] = [0, 0, 0, 0, 0];
let tag = '';

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  cd = await import('./congDong.js');
  ng = await import('./congDongNguoi.js');
  gau = await import('./congDongGau.js');
  tag = `cdx${Date.now().toString(36)}`;
  for (let i = 0; i < 5; i++) {
    const u = await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, displayName: `Người ${i}` } });
    ids.push(u.id);
  }
  [a, b, c, d, adm] = ids;
  const vt = await prisma.role.findFirst({ where: { name: 'ROLE_ADMIN' }, select: { id: true } });
  if (vt) await prisma.userRole.create({ data: { userId: adm, roleId: vt.id } });
});

after(async () => {
  if (!coDb) return;
  await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] } });
  await prisma.userRole.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

const thongBao = async (u: number) => (await ng.dsThongBao(u)).items;

t('tiêu đề + loại + thẻ (danh sách trắng) + sửa; lọc từ xấu ở tiêu đề; tìm kiếm + lọc', async () => {
  const bai = await cd.dangBai(a, 'ja', { tieuDe: `は và が ${tag}`, noiDung: 'Khác nhau thế nào ạ?', loai: 'hoi', the: ['n5', 'ngu-phap', 'hsk1'] });
  assert.equal(bai.tieuDe, `は và が ${tag}`);
  assert.deepEqual(bai.the, ['n5', 'ngu-phap'], 'thẻ HSK không thuộc tiếng Nhật ⇒ bỏ');
  await assert.rejects(cd.dangBai(a, 'ja', { tieuDe: 'kill yourself', noiDung: 'abc def' }), (e: { code?: string }) => e.code === 'CONTENT_BLOCKED');
  await assert.rejects(cd.suaBai(b, bai.id, { noiDung: 'chiếm bài' }), 'không sửa được bài người khác');
  const sua = await cd.suaBai(a, bai.id, { loai: 'thao-luan', the: ['n4'] });
  assert.equal(sua.loai, 'thao-luan');
  assert.deepEqual(sua.the, ['n4']);
  assert.equal(sua.daSua, true);
  assert.equal(sua.noiDung, 'Khác nhau thế nào ạ?', 'trường không gửi giữ nguyên');
  await assert.rejects(cd.suaBai(a, bai.id, { noiDung: 'kill yourself' }), (e: { code?: string }) => e.code === 'CONTENT_BLOCKED');

  const tim = await cd.dsBai('ja', null, undefined, 20, { q: tag.toUpperCase() });
  assert.deepEqual(tim.items.map((x) => x.id), [bai.id], 'tìm theo tiêu đề, không phân biệt hoa thường');
  assert.equal((await cd.dsBai('ja', null, undefined, 20, { q: tag, loai: 'hoi' })).items.length, 0);
  assert.equal((await cd.dsBai('ja', null, undefined, 20, { q: tag, the: 'n4' })).items.length, 1);
  assert.equal((await cd.dsBai('ja', null, undefined, 20, { q: tag, the: 'n5' })).items.length, 0);
});

t('thích bài/trả lời: idempotent, đếm đúng, thông báo một lần; lượt xem một người một lần/ngày', async () => {
  const bai = await cd.dangBai(a, 'en', { noiDung: `Affect vs effect ${tag}?` });
  assert.equal((await cd.thichBai(b, bai.id, true)).soThich, 1);
  assert.equal((await cd.thichBai(b, bai.id, true)).soThich, 1, 'bấm lại không đếm trùng');
  await cd.thichBai(b, bai.id, false);
  const r = await cd.thichBai(b, bai.id, true);
  assert.equal(r.soThich, 1);
  assert.equal((await thongBao(a)).filter((x) => x.loai === 'thich-bai' && x.bai?.id === bai.id).length, 1, 'thích–bỏ–thích lại ⇒ 1 thông báo');

  const ct = await cd.traLoi(c, bai.id, { noiDung: 'Affect là động từ, effect là danh từ.' });
  const tl = ct.traLoi[0];
  assert.equal((await cd.thichTraLoi(a, tl.id, true)).soThich, 1);
  assert.equal((await cd.chiTietBai(bai.id, a)).traLoi[0].daThich, true);
  assert.ok((await thongBao(c)).some((x) => x.loai === 'thich-tra-loi'));
  assert.ok((await thongBao(a)).some((x) => x.loai === 'tra-loi' && x.trich?.startsWith('Affect')));

  const kb = cd.khoaXem(b, null)!;
  await cd.chiTietBai(bai.id, b, { khoaXem: kb });
  await cd.chiTietBai(bai.id, b, { khoaXem: kb });
  await cd.chiTietBai(bai.id, a, { khoaXem: cd.khoaXem(a, null) }); // tác giả tự xem không tính
  const k1 = cd.khoaXem(null, '1.2.3.4')!;
  assert.ok(k1.startsWith('ip:') && !k1.includes('1.2.3.4'), 'IP khách được băm');
  await cd.chiTietBai(bai.id, null, { khoaXem: k1 });
  assert.equal((await cd.chiTietBai(bai.id, null)).soXem, 2);
});

t('lưu ⇒ tab Đã lưu; theo dõi ⇒ tab Đang theo dõi + thông báo; khách ⇒ canDangNhap', async () => {
  const bai = await cd.dangBai(c, 'zh', { noiDung: `了 đặt ở đâu ${tag}?`, the: ['hsk2'] });
  await cd.luuBai(d, bai.id, true);
  assert.ok((await cd.dsBai('zh', d, undefined, 20, { tab: 'da-luu' })).items.some((x) => x.id === bai.id && x.daLuu));
  await cd.luuBai(d, bai.id, false);
  assert.ok(!(await cd.dsBai('zh', d, undefined, 20, { tab: 'da-luu' })).items.some((x) => x.id === bai.id));

  assert.equal((await cd.dsBai('zh', d, undefined, 20, { tab: 'theo-doi' })).items.length, 0);
  const r = await ng.theoDoi(d, c, true);
  assert.equal(r.dangTheoDoi, true);
  await assert.rejects(ng.theoDoi(d, d, true), 'không tự theo dõi mình');
  assert.ok((await cd.dsBai('zh', d, undefined, 20, { tab: 'theo-doi' })).items.some((x) => x.id === bai.id));
  assert.ok((await thongBao(c)).some((x) => x.loai === 'theo-doi' && x.tu?.id === d));
  assert.equal((await cd.chiTietBai(bai.id, d)).dangTheoDoiTacGia, true);
  const ho = await ng.hoSoNguoi(c, d);
  assert.equal(ho.soNguoiTheoDoi, 1);
  assert.equal(ho.dangTheoDoi, true);
  assert.equal(ho.soBai >= 1, true);
  assert.deepEqual((await ng.dsTheoDoi(c, null, 'nguoi-theo-doi')).items.map((u) => u.id), [d]);
  assert.deepEqual(await cd.dsBai('zh', null, undefined, 20, { tab: 'da-luu' }), { items: [], tiep: null, canDangNhap: true });
});

t('câu trả lời hay nhất: chỉ người hỏi, không tự chọn mình, lên đầu, thông báo; @nhắc tên ⇒ thông báo', async () => {
  const bai = await cd.dangBai(a, 'en', { noiDung: `Since vs for ${tag}?` });
  await cd.traLoi(b, bai.id, { noiDung: 'Since + mốc thời gian.' });
  const ct = await cd.traLoi(c, bai.id, { noiDung: `For + khoảng thời gian, cảm ơn @${tag}3 đã gợi ý.` });
  assert.ok((await thongBao(d)).some((x) => x.loai === 'nhac' && x.bai?.id === bai.id), '@nhắc ⇒ thông báo');
  const tlC = ct.traLoi.find((x) => x.tacGia.id === c)!;
  await assert.rejects(cd.chonHayNhat(b, bai.id, tlC.id), 'người khác không chọn được');
  const mine = await cd.traLoi(a, bai.id, { noiDung: 'Mình tự bổ sung.' });
  await assert.rejects(cd.chonHayNhat(a, bai.id, mine.traLoi.find((x) => x.tacGia.id === a)!.id), 'không tự chọn mình');
  const sau = await cd.chonHayNhat(a, bai.id, tlC.id);
  assert.equal(sau.traLoi[0].id, tlC.id, 'câu hay nhất lên đầu');
  assert.equal(sau.traLoi[0].laHayNhat, true);
  assert.equal(sau.coHayNhat, true);
  assert.ok((await thongBao(c)).some((x) => x.loai === 'hay-nhat'));
  const xh = await ng.xepHang('en', 'tuan', null);
  const dongC = xh.items.find((x) => x.tacGia.id === c)!;
  assert.ok(dongC.hayNhat >= 1 && dongC.traLoi >= 1, 'xếp hạng thấy câu hay nhất + trả lời');
  assert.ok(!xh.items.some((x) => x.tacGia.id === a && x.traLoi > 0 && x.hayNhat > 0), 'trả lời bài của chính mình không tính điểm hay nhất');
  assert.equal((await ng.hoSoNguoi(c, null)).soHayNhat >= 1, true);
});

t('BTV chọn: admin đánh dấu ⇒ tab BTV + thông báo; tab Nổi bật phân trang theo vị trí', async () => {
  const bai = await cd.dangBai(b, 'ja', { noiDung: `Kinh nghiệm thi N3 ${tag}` , loai: 'chia-se', the: ['n3', 'kinh-nghiem'] });
  await cd.btvChon(adm, bai.id, true);
  const btv = await cd.dsBai('ja', null, undefined, 50, { tab: 'btv' });
  assert.ok(btv.items.some((x) => x.id === bai.id && x.btv));
  assert.ok((await thongBao(b)).some((x) => x.loai === 'btv-chon' && x.tu === null));
  assert.equal(await cd.laAdmin(adm), (await prisma.userRole.count({ where: { userId: adm } })) > 0);
  const nb1 = await cd.dsBai('ja', null, undefined, 1, { tab: 'noi-bat' });
  assert.equal(nb1.items.length, 1);
  if (nb1.tiep !== null) {
    const nb2 = await cd.dsBai('ja', null, undefined, 1, { tab: 'noi-bat', tu: nb1.tiep });
    assert.notEqual(nb2.items[0]?.id, nb1.items[0].id, 'trang 2 khác trang 1');
  }
  await cd.btvChon(adm, bai.id, false);
  assert.ok(!(await cd.dsBai('ja', null, undefined, 50, { tab: 'btv' })).items.some((x) => x.id === bai.id));
});

t('CHẶN ở mọi chỗ: tab theo dõi, tìm kiếm, trang người dùng, xếp hạng, thông báo; chặn gỡ theo dõi', async () => {
  // d đang theo dõi c (test trước). c chặn d.
  const bai = await cd.dangBai(c, 'zh', { noiDung: `学习 ${tag} chặn` });
  await cd.thichBai(d, bai.id, true);
  assert.ok((await thongBao(c)).some((x) => x.tu?.id === d));
  await cd.chan(c, d);
  assert.equal(await prisma.ctlTheoDoi.count({ where: { nguoiId: d, duocId: c } }), 0, 'chặn ⇒ hết theo dõi');
  assert.ok(!(await cd.dsBai('zh', d, undefined, 50, { q: tag })).items.some((x) => x.tacGia.id === c), 'tìm kiếm');
  assert.equal((await cd.dsBai('zh', d, undefined, 50, { tab: 'theo-doi' })).items.length, 0);
  await assert.rejects(ng.hoSoNguoi(c, d), 'trang người dùng');
  await assert.rejects(ng.theoDoi(d, c, true), 'không theo dõi lại được');
  await assert.rejects(cd.thichBai(d, bai.id, true), 'không thích được');
  assert.ok(!(await thongBao(c)).some((x) => x.tu?.id === d), 'thông báo của người bị chặn biến mất');
  assert.ok(!(await ng.xepHang('en', 'thang', d)).items.some((x) => x.tacGia.id === c), 'xếp hạng');
  assert.ok((await ng.xepHang('en', 'thang', null)).items.some((x) => x.tacGia.id === c), 'người khác vẫn thấy c');
  await cd.boChan(c, d);
});

t('🐻 Nhờ Gấu: chỉ bài Hỏi, một lần/bài, lượt free/ngày, lỗi AI trả chỗ, câu AI báo cáo được, không vào xếp hạng', async () => {
  let goiLan = 0;
  const gia = (hong = false): import('./congDongGau.js').PhuThuocGau => ({
    laPro: async () => false,
    goi: async ({ system, user }) => {
      goiLan++;
      assert.ok(system.includes('tiếng Nhật') && user.includes('Câu hỏi:'));
      if (hong) throw new Error('cổng sập');
      return '**Gợi ý**: は nêu chủ đề • が nhấn chủ ngữ. Ví dụ: 私は学生です (watashi wa gakusei desu).';
    },
  });
  const chiaSe = await cd.dangBai(a, 'ja', { noiDung: 'Chia sẻ tài liệu', loai: 'chia-se' });
  await assert.rejects(gau.nhoGauTraLoi(b, chiaSe.id, gia()), (e: { code?: string }) => e.code === 'CTL_CD_AI_KHONG_HOI');

  const hoi = await cd.dangBai(a, 'ja', { noiDung: `は và が ${tag}?`, loai: 'hoi' });
  await assert.rejects(gau.nhoGauTraLoi(b, hoi.id, gia(true)), (e: { code?: string }) => e.code === 'CTL_CD_AI_LOI');
  assert.equal((await cd.chiTietBai(hoi.id, b)).coTheNhoGau, true, 'AI lỗi ⇒ trả chỗ');
  const r = await gau.nhoGauTraLoi(b, hoi.id, gia());
  const ai = r.traLoi.find((x) => x.laAi)!;
  assert.ok(ai && !ai.noiDung.includes('**'), 'có câu AI, đã bỏ in đậm');
  assert.equal(ai.tacGia.id, 0);
  assert.equal(ai.nhoBoi, 'Người 1');
  assert.equal(r.coTheNhoGau, false);
  assert.equal(r.luotGau.conLai, gau.LUOT_GAU_FREE - 1);
  await assert.rejects(gau.nhoGauTraLoi(c, hoi.id, gia()), (e: { code?: string }) => e.code === 'CTL_CD_AI_DA_CO');
  assert.ok((await thongBao(a)).some((x) => x.loai === 'ai-tra-loi'));

  const hoi2 = await cd.dangBai(c, 'ja', { noiDung: 'Câu hỏi 2?' });
  const hoi3 = await cd.dangBai(c, 'ja', { noiDung: 'Câu hỏi 3?' });
  await gau.nhoGauTraLoi(b, hoi2.id, gia());
  await assert.rejects(gau.nhoGauTraLoi(b, hoi3.id, gia()), (e: { code?: string }) => e.code === 'CTL_CD_AI_HET_LUOT');
  assert.equal((await gau.luotGau(b, gia())).conLai, 0);

  const bc = await cd.baoCao(b, { loai: 'tra-loi', id: ai.id, lyDo: 'sai-su-that' });
  assert.equal(bc.trung, false, 'người bấm Nhờ Gấu vẫn báo cáo được câu AI');
  const tb = await prisma.adminNotification.findFirst({ where: { khoaChongTrung: `ctw-report:ctl_tra_loi:${ai.id}:${b}` }, select: { noiDung: true } });
  assert.ok(tb?.noiDung?.includes('AI viết'));
  assert.ok(!(await ng.xepHang('ja', 'tuan', null)).items.some((x) => x.tacGia.id === b && x.traLoi > 0), 'câu AI không cộng điểm cho người bấm');
  assert.ok(goiLan >= 3);
});

t('thông báo: đếm chưa đọc + đánh dấu đã đọc; báo cáo người dùng vào hộp admin', async () => {
  const truoc = await ng.soChuaDoc(a);
  assert.ok(truoc.chuaDoc > 0);
  const ds = await ng.dsThongBao(a);
  assert.equal(ds.chuaDoc, truoc.chuaDoc);
  assert.equal((await ng.docThongBao(a, [ds.items[0].id])).chuaDoc, truoc.chuaDoc - (ds.items[0].daDoc ? 0 : 1));
  assert.equal((await ng.docThongBao(a)).chuaDoc, 0);

  const r = await cd.baoCao(b, { loai: 'nguoi', id: a, lyDo: 'spam' });
  assert.equal(r.trung, false);
  assert.equal((await cd.baoCao(b, { loai: 'nguoi', id: a })).trung, true);
  await assert.rejects(cd.baoCao(b, { loai: 'nguoi', id: b }));
});
