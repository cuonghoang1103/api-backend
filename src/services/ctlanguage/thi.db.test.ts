/**
 * Thi thử CT Language trên CSDL THẬT (local): lượt free 1 đề/cấp/tuần, máy chủ chấm lại, nộp trùng, vinh danh tuần.
 *
 *   WORK_DB_TEST=1 npx tsx --test src/services/ctlanguage/thi.db.test.ts
 *
 * Tạo 3 user tạm, chạy, xoá đúng các user đó (FK CASCADE dọn `ctl_luot_thi`). Không có DATABASE_URL ⇒ bỏ qua.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test, after, before } from 'node:test';
import type { CauThi } from './thiThuan.js';

const coDb = Boolean(process.env.DATABASE_URL);
const t = coDb ? test : test.skip;

let prisma: typeof import('../../config/database.js').prisma;
let thi: typeof import('./thi.js');
let thuan: typeof import('./thiThuan.js');
const ids: number[] = [];
let [free, pro, kem] = [0, 0, 0];
const T0 = new Date('2026-11-11T03:00:00Z'); // thứ Tư

/** Bài làm đúng `soDung` câu trắc nghiệm đầu, còn lại sai. */
function baiLam(deId: string, soDung: number) {
  const de = thi.napDe().get(deId)!;
  const tl: Record<string, number | string> = {};
  let n = 0;
  for (const { cau } of thuan.tatCaCau(de)) {
    const c = cau as CauThi;
    if (c.kieu === 'chon') tl[c.id] = n++ < soDung ? (c.dapAn as number) : ((c.dapAn as number) + 1) % c.luaChon!.length;
    else if (Array.isArray(c.dapAn)) tl[c.id] = n++ < soDung ? c.dapAn[0] : 'x';
  }
  return tl;
}
const sau = (phut: number) => new Date(T0.getTime() + phut * 60_000);

before(async () => {
  if (!coDb) return;
  prisma = (await import('../../config/database.js')).prisma;
  thi = await import('./thi.js');
  thuan = await import('./thiThuan.js');
  const tag = `ctlthi${Date.now().toString(36)}`;
  for (let i = 0; i < 3; i++) {
    const u = await prisma.user.create({ data: { username: `${tag}${i}`, email: `${tag}${i}@test.invalid`, ...(i === 1 ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    ids.push(u.id);
  }
  [free, pro, kem] = ids;
});

after(async () => {
  if (!coDb) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

t('danh mục: khách xem được; đủ cấp + bài xếp lớp', async () => {
  const dm = await thi.danhMuc('zh', null, T0);
  assert.deepEqual(dm.cap.map((c) => c.cap), ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSKK-SO']);
  assert.equal(dm.laPro, false);
  assert.equal(dm.xepLop?.id, 'xep-lop-zh');
  assert.ok(dm.cap[0].de.length >= 2 && dm.cap[0].de.every((d) => d.duocThi && d.soCau === 40));
  await assert.rejects(thi.danhMuc('vi', null), /nn phải là/);
});

t('đề: free không có giải thích chi tiết, Pro có đủ', async () => {
  const f = await thi.deCho('hsk1-de-1', free);
  const p = await thi.deCho('hsk1-de-1', pro);
  assert.equal(f.coGiaiThich, false);
  assert.equal(p.coGiaiThich, true);
  assert.ok(thuan.tatCaCau(f).filter((x) => x.cau.giaiThich === '').length >= 30);
  assert.ok(thuan.tatCaCau(p).every((x) => x.cau.giaiThich.length >= 20));
  await assert.rejects(thi.deCho('khong-co', null), (e: { statusCode?: number }) => e.statusCode === 404);
});

t('free: 1 đề/cấp/tuần — đề thứ hai cùng cấp bị chặn, làm lại đúng đề + cấp khác + xếp lớp + tuần sau thì được', async () => {
  const l1 = await thi.batDau(free, 'hsk1-de-1', T0);
  assert.ok(l1.luotId > 0);
  await assert.rejects(thi.batDau(free, 'hsk1-de-2', sau(1)), (e: { code?: string; statusCode?: number }) => e.code === 'CTL_THI_HET_LUOT' && e.statusCode === 403);
  await thi.batDau(free, 'hsk1-de-1', sau(2));
  await thi.batDau(free, 'hsk2-de-1', sau(3));
  await thi.batDau(free, 'xep-lop-zh', sau(4));
  await thi.batDau(free, 'xep-lop-zh', sau(5));
  await thi.batDau(free, 'hsk1-de-2', new Date('2026-11-16T03:00:00Z')); // thứ Hai tuần sau
  const dm = await thi.danhMuc('zh', free, sau(6));
  const hsk1 = dm.cap.find((c) => c.cap === 'HSK1')!;
  assert.deepEqual(hsk1.de.map((d) => d.duocThi), [true, false]);
  // Pro: thi mấy đề cũng được.
  await thi.batDau(pro, 'hsk1-de-1', T0);
  await thi.batDau(pro, 'hsk1-de-2', sau(1));
});

t('nộp: máy chủ chấm lại, đo giờ từ lúc bắt đầu, nộp trùng trả phiếu cũ, không nộp hộ người khác', async () => {
  const l = await thi.batDau(kem, 'hsk1-de-1', T0);
  await assert.rejects(thi.nop(free, l.luotId, { traLoi: {} }, sau(10)), (e: { statusCode?: number }) => e.statusCode === 404);
  await assert.rejects(thi.nop(kem, l.luotId, { traLoi: 'x' }, sau(10)), /traLoi/);
  const p = await thi.nop(kem, l.luotId, { traLoi: baiLam('hsk1-de-1', 30) }, sau(20));
  assert.equal(p.dung, 30);
  assert.equal(p.tong, 40);
  assert.deepEqual(p.phan.map((x) => [x.dung, x.diem]), [[20, 100], [10, 50]]);
  assert.equal(p.diem, 150);
  assert.equal(p.dat, true);
  assert.equal(p.giay, 20 * 60);
  assert.equal(p.sai.length, 10);
  assert.equal(p.xepHang, true);
  assert.equal(p.hangTuan, 1);
  const lai = await thi.nop(kem, l.luotId, { traLoi: baiLam('hsk1-de-1', 40) }, sau(25));
  assert.equal(lai.diem, 150, 'nộp lần hai không đổi điểm');
  // Quá giờ ⇒ kẹp về tổng thời gian của đề (32 phút).
  const l2 = await thi.batDau(pro, 'hsk1-de-2', sau(30));
  const p2 = await thi.nop(pro, l2.luotId, { traLoi: baiLam('hsk1-de-2', 40) }, sau(30 + 500));
  assert.equal(p2.giay, 32 * 60);
  assert.equal(p2.diem, 200);
});

t('vinh danh tuần: mỗi người một dòng, thi LẠI đề đã nộp không lên bảng, nộp quá nhanh không lên bảng', async () => {
  // kem thi lại đề 1 được điểm tuyệt đối — không được thay dòng 150 trên bảng.
  const l = await thi.batDau(kem, 'hsk1-de-1', sau(40));
  const p = await thi.nop(kem, l.luotId, { traLoi: baiLam('hsk1-de-1', 40) }, sau(55));
  assert.equal(p.diem, 200);
  assert.equal(p.xepHang, false);
  // free nộp sau 10 giây (40 câu ⇒ dưới 2 giây/câu) ⇒ không lên bảng.
  const lf = await thi.batDau(free, 'hsk1-de-1', sau(60));
  const pf = await thi.nop(free, lf.luotId, { traLoi: baiLam('hsk1-de-1', 40) }, new Date(sau(60).getTime() + 10_000));
  assert.equal(pf.xepHang, false);
  const b = await thi.vinhDanh('zh', 'HSK1', kem, sau(70));
  const cua = b.items.filter((d) => ids.includes(d.nguoi.id));
  assert.deepEqual(cua.map((d) => [d.nguoi.id, d.diem]), [[pro, 200], [kem, 150]]);
  assert.equal(b.cuaToi?.diem, 150);
  assert.equal(b.cuaToi?.laToi, true);
  // Quá 7 ngày ⇒ rơi khỏi bảng.
  const sau8 = await thi.vinhDanh('zh', 'HSK1', null, new Date(T0.getTime() + 9 * 86_400_000));
  assert.equal(sau8.items.filter((d) => ids.includes(d.nguoi.id)).length, 0);
  await assert.rejects(thi.vinhDanh('zh', 'N5', null), /Cấp độ/);
});

t('xếp lớp: lưu gợi ý cấp, không lên bảng; lịch sử trả đủ các lượt đã nộp', async () => {
  const l = await thi.batDau(kem, 'xep-lop-zh', sau(80));
  const de = thi.napDe().get('xep-lop-zh')!;
  const tl: Record<string, number> = {};
  for (const g of de.phan[0].nhom) for (const c of g.cau) tl[c.id] = c.dapAn as number;
  const p = await thi.nop(kem, l.luotId, { traLoi: tl }, sau(90));
  assert.equal(p.xepLop?.cap, de.xepLop!.muc[1].cap);
  assert.equal(p.xepHang, false);
  const ls = await thi.lichSu(kem, 'zh');
  assert.deepEqual(ls.items.map((x) => x.deId), ['xep-lop-zh', 'hsk1-de-1', 'hsk1-de-1']);
  assert.equal(ls.items[0].xepLop !== null, true);
  assert.equal((ls.items[2].phan as unknown[]).length, 2);
});

t('thi nói giám khảo AI: danh mục, mở lượt (free 1 đề/cấp/tuần, đếm RIÊNG với thi viết), lời theo kịch bản, chặn lượt lạ', async () => {
  const noi = await import('./thiNoi.js');
  const dm = await noi.danhMucNoi('en', null, T0);
  assert.deepEqual(dm.items.map((d) => d.id), ['ielts-noi-de-1', 'ielts-noi-de-2', 'ielts-noi-de-3', 'ielts-noi-de-4', 'ielts-noi-de-5']);
  assert.ok(dm.items.every((d) => d.cap === 'IELTS-NOI' && d.duocThi && d.phan.length === 3));
  const zh = await noi.danhMucNoi('zh', free, T0);
  const hskk = zh.items.find((d) => d.kyThi === 'HSKK')!;
  assert.equal(hskk.soCau, 27);

  // free đã thi viết HSKK? Chưa — nhưng dù có, lượt thi NÓI không ăn lượt thi VIẾT cùng cấp và ngược lại.
  const l = await noi.batDauNoi(free, hskk.id, sau(100));
  await thi.batDau(free, 'hskk-so-de-1', sau(101));
  const l1 = await noi.batDauNoi(free, 'ielts-noi-de-1', sau(102));
  await assert.rejects(noi.batDauNoi(free, 'ielts-noi-de-2', sau(103)), (e: { code?: string }) => e.code === 'CTL_THI_HET_LUOT');
  await noi.batDauNoi(free, 'ielts-noi-de-1', sau(104));
  await noi.batDauNoi(pro, 'ielts-noi-de-1', sau(100));
  await noi.batDauNoi(pro, 'ielts-noi-de-2', sau(101));
  const dm2 = await noi.danhMucNoi('en', free, sau(105));
  assert.deepEqual(dm2.items.map((d) => d.duocThi), [true, false, false, false, false]);

  // Lời giám khảo: đúng câu của kịch bản; người khác / bước lạ / lượt quá hạn bị từ chối.
  const de = noi.deNoiCho('ielts-noi-de-1');
  assert.deepEqual(await noi.loiGiamKhao(free, l1.luotId, 0, sau(103)), { loi: de.buoc[0].loi, nn: 'en' });
  assert.equal((await noi.loiGiamKhao(free, l.luotId, 2, sau(103))).nn, 'zh');
  await assert.rejects(noi.loiGiamKhao(pro, l1.luotId, 0, sau(103)), (e: { statusCode?: number }) => e.statusCode === 404);
  await assert.rejects(noi.loiGiamKhao(free, l1.luotId, 999, sau(103)), /Bước thi/);
  await assert.rejects(noi.loiGiamKhao(free, l1.luotId, 0, sau(102 + 91)), /quá hạn/);

  // Chấm: chưa nói câu nào ⇒ không gọi AI, không ghi điểm. Lịch sử thi dùng tên đề nói.
  assert.deepEqual(await noi.chamThiNoi(free, l1.luotId, { banGhi: [{ buoc: 1, text: '', giay: 3 }] }, sau(110)), { ketQua: null, lyDo: 'it_luot' });
  assert.equal((await prisma.ctlLuotThi.findUniqueOrThrow({ where: { id: l1.luotId } })).nopLuc, null);
  await prisma.ctlLuotThi.update({ where: { id: l1.luotId }, data: { nopLuc: sau(111), diem: 65, diemToiDa: 90, dat: true, chiTiet: { noi: { thang: 'band', tong: 6.5 } } } });
  const ls = await thi.lichSu(free, 'en');
  assert.deepEqual(ls.items.map((x) => [x.tenDe, x.diem, x.diemToiDa]), [['IELTS Speaking · Đề 1', 65, 90]]);
  assert.deepEqual(await noi.chamThiNoi(free, l1.luotId, { banGhi: [] }, sau(112)), { ketQua: { thang: 'band', tong: 6.5 } });
});
