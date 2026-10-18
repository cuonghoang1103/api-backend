/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — phần THUẦN (không CSDL):
 *   npx tsx --test src/services/agent/maGiaHanTien.test.ts
 * Phần chạy thật với Postgres: `src/routes/agent.giaHanTien.db.test.ts` (WORK_DB_TEST=1).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

process.env.JWT_SECRET ||= 'bi-mat-chi-de-test-gia-han-tien';

const { tranChamModel, tranChamVi, tranChamChinhHangFree, tranChamNhom, docJsonMa } = await import('./maGiaHanTien.js');
const { tongTheoKy, dauKy, dauNgayVnSo, dauThangVnSo } = await import('./giaHanTienSo.js');
const { MAC_DINH_NHOM, chamTranNhom } = await import('./hanMucNhom.js');
const { kyDangCham } = await import('./tranModel.js');

test('mặc định hạn mức nhóm = 5 $/người/ngày · 20 $/nhóm/tháng (19/10/2026)', () => {
  assert.equal(MAC_DINH_NHOM.tranNgayNguoiUsd, 5);
  assert.equal(MAC_DINH_NHOM.tranThangNhomUsd, 20);
});

test('trần model: kỳ đang chặn (tháng ưu tiên), mức = trần GỐC, chỉ gói có trần thật', () => {
  const h = { goi: 'pro', daDungThang: 2, daDungNgay: 3.1, tranThang: 15, tranNgay: 3, tranThangGoc: 15, tranNgayGoc: 3 };
  const tc = tranChamModel(h, { id: 'cm-solid', ten: 'CuongMini Solid' });
  assert.ok(tc);
  assert.equal(tc!.tran, 'model:cm-solid');
  assert.equal(tc!.ky, 'ngay');
  assert.equal(tc!.mucUsd, 3);
  assert.match(tc!.ten, /hôm nay/);
  assert.match(tc!.tenEn, /today/);
  /* Đã được cộng 3 $ hôm nay ⇒ trần hiệu lực 6, nhưng một mức vẫn = gốc 3. */
  const sauCap = tranChamModel({ ...h, daDungNgay: 6.2, tranNgay: 6 }, { id: 'cm-solid', ten: 'CuongMini Solid' });
  assert.equal(sauCap!.mucUsd, 3);
  assert.equal(sauCap!.tranUsd, 6);
  const thang = tranChamModel({ ...h, daDungThang: 15 }, { id: 'cm-solid', ten: 'S' });
  assert.equal(thang!.ky, 'thang');
  assert.equal(thang!.mucUsd, 15);
  assert.equal(kyDangCham({ ...h, daDungThang: 15 }), 'thang');
  assert.equal(tranChamModel({ ...h, goi: 'khac', tranThang: 0, tranNgay: 0 }, { id: 'cm-solid', ten: 'S' }), null, 'trần 0 của gói thường không bao giờ gia hạn ra tiền');
  assert.equal(tranChamModel({ ...h, goi: 'admin' }, { id: 'cm-solid', ten: 'S' }), null);
  assert.equal(tranChamModel({ ...h, daDungNgay: 1 }, { id: 'cm-solid', ten: 'S' }), null, 'chưa chạm ⇒ không có gì để gia hạn');
  assert.equal(tranChamModel({ ...h, tranNgay: null, tranNgayGoc: null, tranThang: null, tranThangGoc: null }, { id: 'cm-solid', ten: 'S' }), null, 'không giới hạn ⇒ không chạm');
});

test('ví AI Code (cửa sổ trượt) + nhóm free chính hãng (chỉ hạng free, chỉ gói có trần)', () => {
  const vi = tranChamVi({ mang: 'code', canVi: true, daTieu: 101, tran: 100, tranGoc: 100, soGio: 5 });
  assert.equal(vi!.tran, 'vi');
  assert.equal(vi!.ky, 'cuaSo');
  assert.equal(vi!.mucUsd, 100);
  assert.equal(tranChamVi({ mang: 'chat', canVi: true, daTieu: 101, tran: 100, soGio: 5 }), null, 'ví AI Chat không thuộc mã này');
  assert.equal(tranChamVi({ mang: 'code', canVi: false, daTieu: 1, tran: 100, soGio: 5 }), null);
  const base = { hang: 'free', goi: 'pro', het: true, daDungThang: 50, daDungNgay: 40, tranThang: 180, tranNgay: 40, tranThangGoc: 180, tranNgayGoc: 40 };
  const ch = tranChamChinhHangFree(base);
  assert.equal(ch!.tran, 'chinhHang:free');
  assert.equal(ch!.ky, 'ngay');
  assert.equal(ch!.mucUsd, 40);
  assert.equal(tranChamChinhHangFree({ ...base, hang: 'cao' }), null, 'nhóm cao (model trả phí) không nới bằng mã');
  assert.equal(tranChamChinhHangFree({ ...base, goi: 'khac' }), null);
});

test('hạn mức nhóm: chỉ trần NGƯỜI/NGÀY gia hạn được; mức = trần người/ngày; trần tháng của nhóm thì không', () => {
  const n = { projectId: 7, key: 'LF', tranNgayNguoiUsd: 5, daDungNgay: 5.3, giaHanNgay: 0, daDungThang: 9, tranThangNhomUsd: 20 };
  const tc = tranChamNhom(n);
  assert.equal(tc!.tran, 'nhom:7');
  assert.equal(tc!.mucUsd, 5);
  assert.equal(tc!.projectId, 7);
  assert.equal(tranChamNhom({ ...n, giaHanNgay: 5 }), null, 'đã cấp thêm 5 $ ⇒ trần 10 > 5,3 ⇒ chưa chạm');
  assert.equal(tranChamNhom({ ...n, daDungThang: 20 }), null, 'chạm trần THÁNG của nhóm ⇒ không gia hạn bằng mã');
  /* chamTranNhom cộng phần gia hạn vào trần người/ngày và nói trần nào chạm. */
  const het = chamTranNhom({ key: 'LF', tranNgayNguoiUsd: 5, tranThangNhomUsd: 20, daDungNgay: 5.3, daDungThang: 9 });
  assert.ok(het && het.loai === 'tuChoi' && het.tranCham === 'nguoiNgay');
  assert.equal(chamTranNhom({ key: 'LF', tranNgayNguoiUsd: 5, tranThangNhomUsd: 20, daDungNgay: 5.3, daDungThang: 9, giaHanNgay: 5 }), null);
  const thang = chamTranNhom({ key: 'LF', tranNgayNguoiUsd: 5, tranThangNhomUsd: 20, daDungNgay: 6, daDungThang: 20 });
  assert.ok(thang && thang.loai === 'tuChoi' && thang.tranCham === 'nhomThang', 'trần tháng xét TRƯỚC — nới ngày không gỡ được tháng');
});

test('sổ: lượt cấp chỉ tính trong kỳ của nó (ngày / tháng giờ VN / cửa sổ trượt)', () => {
  const luc = new Date('2026-10-19T10:00:00+07:00');
  assert.equal(dauNgayVnSo(luc).toISOString(), '2026-10-18T17:00:00.000Z');
  assert.equal(dauThangVnSo(luc).toISOString(), '2026-09-30T17:00:00.000Z');
  assert.equal(dauKy('cuaSo', luc, 5).getTime(), luc.getTime() - 5 * 3_600_000);
  const ds = [
    { ky: 'ngay', soUsd: 3, capLuc: new Date('2026-10-19T08:00:00+07:00') },
    { ky: 'ngay', soUsd: 3, capLuc: new Date('2026-10-18T23:00:00+07:00') }, // hôm qua ⇒ không tính
    { ky: 'thang', soUsd: 15, capLuc: new Date('2026-10-02T08:00:00+07:00') },
    { ky: 'thang', soUsd: 15, capLuc: new Date('2026-09-30T08:00:00+07:00') }, // tháng trước
    { ky: 'cuaSo', soUsd: 100, capLuc: new Date('2026-10-19T06:00:00+07:00') },
    { ky: 'cuaSo', soUsd: 100, capLuc: new Date('2026-10-19T04:00:00+07:00') }, // ngoài cửa sổ 5 giờ
    { ky: 'ngay', soUsd: 9, capLuc: null }, // chờ duyệt ⇒ không tính
    { ky: 'lạ', soUsd: 9, capLuc: luc },
  ];
  assert.deepEqual(tongTheoKy(ds, luc, 5), { ngay: 3, thang: 15, cuaSo: 100 });
});

test('cấu hình mã: chỉ băm, JSON hỏng ⇒ coi như TẮT', () => {
  assert.deepEqual(docJsonMa(null), { bam: null, phienBan: 0 });
  assert.deepEqual(docJsonMa('{hỏng'), { bam: null, phienBan: 0 });
  assert.deepEqual(docJsonMa(JSON.stringify({ bam: '$2a$10$x', phienBan: 3 })), { bam: '$2a$10$x', phienBan: 3 });
});

test('⛔ mã không bao giờ vào log / URL: service + route + lõi app', () => {
  const sv = readFileSync(new URL('./maGiaHanTien.ts', import.meta.url), 'utf8');
  for (const m of sv.matchAll(/logger\.(info|warn|error)\(([^;]*?)\);/gs)) assert.ok(!/\bma\b[,:} ]/.test(m[2]!.replace(/'[^']*'/g, '')), `log có thể chứa mã: ${m[0].slice(0, 120)}`);
  const route = readFileSync(new URL('../../routes/agent.routes.ts', import.meta.url), 'utf8');
  assert.ok(!/gia-han-tien\?[^`'"]*ma=/.test(route), 'mã không đi qua query string');
  const lõi = readFileSync(new URL('../../../desktop/src/main/ipc/agent.ts', import.meta.url), 'utf8');
  const i = lõi.indexOf("handle('agent:giaHanTien'");
  assert.ok(i > 0);
  const than = lõi.slice(i, lõi.indexOf("handle('agent:giaHanTienKiem'"));
  assert.ok(!/setSetting|logger|console\./.test(than), 'lõi app không lưu / không log mã');
});

test('turn.ts: mọi lỗi chạm trần tiền gắn thông tin gia hạn (ví, trần model, nhóm free chính hãng)', () => {
  const turn = readFileSync(new URL('./turn.ts', import.meta.url), 'utf8');
  assert.match(turn, /giaHanChoLoi\(input\.userId, tranChamVi\(vi\)\)/);
  assert.match(turn, /giaHanChoLoi\(input\.userId, tranChamModel\(ht, m\)\)/);
  assert.match(turn, /giaHanChoLoi\(input\.userId, tranChamChinhHangFree\(hg\)\)/);
  assert.match(turn, /giaHanTien: chan\.giaHanTien/);
});
