/**
 * Học từ vựng trên web — câu hỏi, hàng đợi phiên, trạng thái (bám app iOS `DeHocTuVungCTL` + `HangPhienHTV`).
 * Chạy: npx tsx --test frontend/src/lib/ctlanguage/hocTuVung.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boDanhDau, cauTrong, chenRai, chonDiemNguPhap, chotDot, chuanCapNguPhap, dangDuoc, daGapTu, datKho, datThuoc, docHien, doiDot,
  donDotRong, dotDangMo, dotDenHan, dotSapToi, ghiDaBiet, ghiDaHocMot, ghiKetQua, goDung, hangHoc, hangOn, khoRong, locTuCuaToi,
  manhCau, manhChu, moiHomNay, nhanTu, taoCau, thuocTu, tienDoBai, xepDung, docKho, type TuHoc,
} from './hocTuVung';
import { theMoi } from './soTu';

/** RNG cố định (LCG) — đề dựng lại được. */
const rng = (s = 7) => () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);

const W = (chu: string, nghia: string, ex?: Partial<TuHoc>): TuHoc => ({ k: chu.toLowerCase(), id: -1, chu, nghia, ...ex });
const EN: TuHoc[] = [
  W('apple', 'quả táo', { viDu: 'I eat an apple every day.', viDuNghia: 'Tôi ăn một quả táo mỗi ngày.' }),
  W('river', 'con sông', { viDu: 'The river is wide.', viDuNghia: 'Con sông rộng.' }),
  W('teacher', 'giáo viên'),
  W('happy', 'vui vẻ; hạnh phúc'),
  W('take off', 'cởi ra; cất cánh'),
  W('window', 'cửa sổ'),
];

test('cách đọc gọn, câu đục lỗ, mảnh xếp chữ / xếp câu', () => {
  assert.equal(docHien({ chu: 'x', doc: '/ 『wɒts』 /' }), '/wɒts/');
  assert.equal(docHien({ chu: '水', doc: '水' }), null);
  assert.equal(cauTrong(EN[0]!, 'en'), 'I eat an _____ every day.');
  assert.deepEqual(manhChu(EN[0]!, 'en'), ['a', 'p', 'p', 'l', 'e']);
  assert.equal(manhChu(EN[4]!, 'en'), null); // có khoảng trắng
  assert.deepEqual(manhCau(EN[0]!, 'en'), ['I', 'eat', 'an', 'apple', 'every', 'day.']);
  const ja: TuHoc = { k: '勉強', id: 1, chu: '勉強', doc: 'べんきょう', nghia: 'học', viDu: '毎日日本語を勉強します。', viDuNghia: 'Ngày nào cũng học tiếng Nhật.' };
  assert.deepEqual(manhChu(ja, 'ja'), ['べ', 'ん', 'き', 'ょ', 'う']);
  const m = manhCau(ja, 'ja')!;
  assert.ok(m.includes('勉強'));
  assert.equal(m.join(''), ja.viDu);
});

test('dạng câu theo từng từ: đủ nhiễu mới có chọn nghĩa; en có gõ/nghe gõ', () => {
  const d = dangDuoc(EN[0]!, 'en', EN);
  for (const x of ['dungSai', 'chonNghia', 'ngheChonTu', 'chonTu', 'goTu', 'ngheGo', 'xepChu', 'dienCau', 'xepCau']) assert.ok(d.includes(x as never), x);
  assert.deepEqual(dangDuoc(EN[0]!, 'en', [EN[0]!]).includes('chonNghia'), false);
});

test('phương án gây nhiễu không "cũng đúng", đáp án nằm đúng chỗ', () => {
  const ds = [...EN, W('glad', 'vui vẻ'), W('joyful', 'hạnh phúc')];
  for (let i = 0; i < 30; i++) {
    const c = taoCau(ds[3]!, 'chonNghia', 'en', ds, i, rng(i + 1));
    assert.equal(c.phuongAn[c.dung], 'vui vẻ; hạnh phúc');
    assert.ok(!c.phuongAn.includes('vui vẻ') && !c.phuongAn.includes('hạnh phúc'));
  }
  const x = taoCau(EN[0]!, 'xepChu', 'en', EN, 0, rng());
  assert.notEqual(x.manh.join(''), 'apple');
  assert.ok(xepDung(['a', 'p', 'p', 'l', 'e'], x, 'en'));
  const s = taoCau(EN[0]!, 'xepCau', 'en', EN, 0, rng());
  assert.ok(xepDung(['i', 'eat', 'an', 'apple', 'every', 'day.'], s, 'en'));
});

test('chấm gõ: bỏ hoa thường, dấu câu, nháy cong', () => {
  assert.ok(goDung('  Take off. ', EN[4]!));
  assert.ok(goDung('don’t', W("don't", 'đừng')));
  assert.ok(!goDung('', EN[0]!));
  assert.ok(!goDung('aple', EN[0]!));
});

test('hàng đợi học: mỗi từ có thẻ + câu nhận biết + câu nhớ lại KHÁC dạng; nhóm 4 + ghép cặp', () => {
  const h = hangHoc(EN, 'en', EN, rng(3));
  const the = h.filter((m) => m.loai === 'the');
  assert.equal(the.length, EN.length);
  assert.ok(h.some((m) => m.loai === 'ghep'));
  for (const w of EN) {
    const dang = h.flatMap((m) => (m.loai === 'cau' && m.cau.tu.k === w.k ? [m.cau.dang] : []));
    assert.equal(dang.length, 2, w.chu);
    assert.notEqual(dang[0], dang[1], `${w.chu}: hai câu cùng dạng`);
  }
  // Thẻ của một nhóm đứng trước câu hỏi của nhóm đó.
  assert.equal(h[0]!.loai, 'the');
  assert.equal(new Set(h.map((m) => m.id)).size, h.length);
});

test('hàng đợi ôn: mỗi từ một câu, ≥ 5 từ có vòng ghép cặp', () => {
  const h = hangOn(EN, 'en', EN, { ghep: true }, rng());
  assert.equal(h.filter((m) => m.loai === 'cau').length, EN.length);
  assert.equal(h.filter((m) => m.loai === 'ghep').length, 1);
  assert.equal(hangOn(EN.slice(0, 3), 'en', EN, { ghep: true }, rng()).some((m) => m.loai === 'ghep'), false);
});

test('trạng thái: học / đã biết / kết quả; dùng chung với thẻ sổ "Học từ vựng" của tài khoản', () => {
  const luc = new Date(2026, 10, 24, 9);
  let kho = khoRong();
  const r1 = ghiDaHocMot(kho, EN[0]!, 'en', 'en-ngay-1', luc);
  assert.ok(r1.moi);
  kho = r1.kho;
  assert.equal(ghiDaHocMot(kho, EN[0]!, 'en', 'en-ngay-1', luc).moi, false);
  assert.equal(moiHomNay(kho, 'en', luc), 1);
  kho = ghiDaBiet(kho, EN[1]!, 'en', null, luc);
  assert.ok(thuocTu(kho, new Map(), 'en', 'river'));
  kho = ghiKetQua(kho, 'en', new Set(['apple']), new Set(), false);
  kho = ghiKetQua(kho, 'en', new Set(['apple']), new Set(), false);
  assert.ok(thuocTu(kho, new Map(), 'en', 'apple'));
  kho = ghiKetQua(kho, 'en', new Set(), new Set(['apple']), false);
  assert.equal(thuocTu(kho, new Map(), 'en', 'apple'), false); // sai ⇒ khó
  // Học trên điện thoại: thẻ trong sổ "Học từ vựng" ⇒ web tính là đã gặp; thẻ nhớ sâu ⇒ đã thuộc.
  const theDt = new Map([['teacher', { ...theMoi({ id: 1, chu: 'teacher' }, 'en', 'S', luc), khoangNgay: 25 }]]);
  assert.ok(daGapTu(kho, theDt, 'en', 'teacher'));
  assert.ok(thuocTu(kho, theDt, 'en', 'teacher'));
  assert.deepEqual(tienDoBai(kho, theDt, 'en', ['apple', 'river', 'teacher', 'happy']), { gap: 3, thuoc: 2, tong: 4 });
});

test('đọc kho hỏng không làm sập trang', () => {
  assert.deepEqual(docKho('{rac'), khoRong());
  assert.equal(docKho(JSON.stringify({ caiDat: { mucTieu: 20 } })).caiDat.mucTieu, 20);
});

// ─── Đợt 4 ngày (app `DotOnHTV`) ─────────────────────────────────────────────────────────────────────────────────

test('đợt 4 ngày: học/đã biết ⇒ vào đợt đang mở; ngày thứ 5 lúc 9:00 tới hạn; từ đã có trong đợt chưa xong giữ chỗ', () => {
  const ngay1 = new Date(2026, 10, 10, 20, 30); // 10/11 20:30 giờ máy
  let k = ghiDaHocMot(khoRong(), EN[0]!, 'en', 'b1', ngay1).kho;
  k = ghiDaBiet(k, EN[1]!, 'en', 'b1', new Date(2026, 10, 12, 8));
  assert.equal(k.dot.length, 1, 'cùng đợt trong 4 ngày');
  const d = k.dot[0]!;
  assert.deepEqual(d.tu, ['apple', 'river']);
  assert.equal(new Date(d.batDau).getTime(), new Date(2026, 10, 10).getTime());
  assert.equal(new Date(d.hanHoi).getTime(), new Date(2026, 10, 14, 9, 0).getTime());
  // Ngày thứ 5 (14/11) ⇒ đợt mới; từ đã nằm trong đợt cũ (chưa xong) ⇒ không vào lại.
  k = ghiDaHocMot(k, EN[2]!, 'en', 'b1', new Date(2026, 10, 14, 10)).kho;
  k = ghiDaBiet(k, EN[0]!, 'en', 'b1', new Date(2026, 10, 14, 10));
  assert.equal(k.dot.length, 2);
  assert.deepEqual(k.dot[1]!.tu, ['teacher']);
  // Ngôn ngữ khác ⇒ đợt riêng.
  const ja: TuHoc = { k: '水', id: 9, chu: '水', nghia: 'nước' };
  k = ghiDaHocMot(k, ja, 'ja', null, new Date(2026, 10, 14, 10)).kho;
  assert.equal(k.dot.filter((x) => x.nn === 'ja').length, 1);

  assert.equal(dotDenHan(k, 'en', new Date(2026, 10, 14, 8, 59)), null, 'chưa tới 9:00');
  assert.equal(dotDenHan(k, 'en', new Date(2026, 10, 14, 9, 0))?.id, d.id);
  assert.equal(dotSapToi(k, 'en', new Date(2026, 10, 13))?.id, d.id);
  assert.equal(dotDangMo(k, 'en', new Date(2026, 10, 15))?.id, k.dot[1]!.id);
});

test('đợt 4 ngày: Chưa/Bỏ qua dời sang 9:00 mai; kiểm tra: đúng ngay ⇒ thuộc, sai ⇒ khó + đang học; đợt đóng', () => {
  let k = khoRong();
  for (const w of EN.slice(0, 3)) k = ghiDaHocMot(k, w, 'en', 'b1', new Date(2026, 10, 1, 9)).kho;
  const id0 = k.dot[0]!.id;
  k = doiDot(k, id0, new Date(2026, 10, 5, 9, 30));
  assert.equal(new Date(k.dot[0]!.hanHoi).getTime(), new Date(2026, 10, 6, 9, 0).getTime());
  assert.equal(k.dot[0]!.soLanDoi, 1);
  assert.equal(dotDenHan(k, 'en', new Date(2026, 10, 5, 23)), null, 'đã dời ⇒ hôm nay không hỏi nữa');

  const r = chotDot(k, id0, new Set(['apple', 'river']), new Set(['river', 'teacher']), new Date(2026, 10, 6, 10));
  assert.deepEqual(r.de, ['apple']);
  assert.deepEqual(r.quen.sort(), ['river', 'teacher']);
  assert.equal(r.kho.tu['en:apple']!.trangThai, 'thuoc');
  assert.ok(r.kho.tu['en:apple']!.thuocLuc);
  assert.equal(r.kho.tu['en:river']!.kho, true);
  assert.equal(r.kho.tu['en:river']!.trangThai, 'dangHoc');
  assert.ok(r.kho.dot[0]!.xongLuc);
  assert.equal(r.kho.dot[0]!.dung, 1);
  assert.equal(r.kho.dot[0]!.sai, 2);
  assert.equal(dotDenHan(r.kho, 'en', new Date(2026, 11, 1)), null, 'đợt đã đóng');
  // Đã thuộc qua kiểm tra ⇒ không vào đợt mới nữa.
  const k2 = ghiDaBiet(r.kho, EN[0]!, 'en', null, new Date(2026, 10, 20));
  assert.equal(k2.dot.length, 1);
  assert.equal(thuocTu(r.kho, new Map(), 'en', 'apple'), true);
});

test('đợt 4 ngày: bỏ đánh dấu ⇒ rời đợt; đợt rỗng hết 4 ngày tự đóng; đợt không còn từ ⇒ không tới hạn', () => {
  let k = ghiDaHocMot(khoRong(), EN[0]!, 'en', null, new Date(2026, 10, 1, 9)).kho;
  k = boDanhDau(k, 'en', 'apple');
  assert.deepEqual(k.dot[0]!.tu, []);
  assert.equal(dotDenHan(k, 'en', new Date(2026, 10, 9)), null);
  assert.equal(donDotRong(k, new Date(2026, 10, 3)), k, 'chưa hết 4 ngày ⇒ giữ nguyên');
  const k2 = donDotRong(k, new Date(2026, 10, 5, 1));
  assert.ok(k2.dot[0]!.xongLuc);
});

test('docKho đọc tệp cũ (chưa có đợt / ngữ pháp) + bỏ đợt hỏng', () => {
  const cu = docKho(JSON.stringify({ tu: {}, moiTheoNgay: {}, caiDat: { mucTieu: 15, tuDoc: false, loTrinh: {} }, ganNhat: {} }));
  assert.deepEqual(cu.dot, []);
  assert.deepEqual(cu.nguPhap, {});
  assert.equal(cu.caiDat.ghepNguPhap, true);
  assert.equal(cu.caiDat.mucTieu, 15);
  const hong = docKho(JSON.stringify({ dot: [{ id: 'x' }, { id: 'en|a', nn: 'en', batDau: '2026-11-01T00:00:00.000Z', hanHoi: '2026-11-05T02:00:00.000Z', tu: ['a'] }] }));
  assert.equal(hong.dot.length, 1);
});

// ─── Từ của tôi ──────────────────────────────────────────────────────────────────────────────────────────────────

test('Từ của tôi: lọc + tìm; đánh dấu khó / đã thuộc; nhận từ chỉ có ở tài khoản', () => {
  const ds = [
    { chu: 'apple', nghia: 'quả táo', doc: '/ˈæp.əl/', thuoc: true, kho: false },
    { chu: 'river', nghia: 'con sông', thuoc: false, kho: true },
    { chu: 'teacher', nghia: 'giáo viên', thuoc: false },
  ];
  assert.equal(locTuCuaToi(ds, 'tatCa', '').length, 3);
  assert.deepEqual(locTuCuaToi(ds, 'dangHoc', '').map((x) => x.chu), ['river', 'teacher']);
  assert.deepEqual(locTuCuaToi(ds, 'thuoc', '').map((x) => x.chu), ['apple']);
  assert.deepEqual(locTuCuaToi(ds, 'kho', '').map((x) => x.chu), ['river']);
  assert.deepEqual(locTuCuaToi(ds, 'tatCa', 'SÔNG').map((x) => x.chu), ['river']);
  assert.deepEqual(locTuCuaToi(ds, 'tatCa', 'æp').map((x) => x.chu), ['apple']);

  let k = ghiDaHocMot(khoRong(), EN[1]!, 'en', null).kho;
  k = datKho(k, 'en', 'river', true);
  assert.equal(k.tu['en:river']!.kho, true);
  k = datThuoc(k, 'en', 'river');
  assert.equal(k.tu['en:river']!.trangThai, 'daBiet');
  assert.equal(k.tu['en:river']!.kho, false);
  // Từ học trên điện thoại: nhận vào trình duyệt KHÔNG tính mục tiêu hôm nay, KHÔNG vào đợt.
  const k2 = nhanTu(k, EN[2]!, 'en', '2026-11-01T03:00:00.000Z');
  assert.equal(k2.tu['en:teacher']!.trangThai, 'dangHoc');
  assert.equal(k2.tu['en:teacher']!.hocLuc, '2026-11-01T03:00:00.000Z');
  assert.equal(Object.values(k2.moiTheoNgay).reduce((a, b) => a + b, 0), 1);
  assert.equal(k2.dot.flatMap((d) => d.tu).includes('teacher'), false);
  assert.equal(nhanTu(k2, EN[2]!, 'en', 'x'), k2, 'có rồi ⇒ giữ nguyên');
  assert.ok(nhanTu(k, EN[3]!, 'en', 'không phải ngày').tu['en:happy']!.hocLuc, 'ngày hỏng ⇒ dùng bây giờ, không ném lỗi');
});

// ─── Ngữ pháp chèn trong phiên ───────────────────────────────────────────────────────────────────────────────────

test('ngữ pháp: chuẩn cấp, chọn điểm chưa luyện cùng cấp, rải câu vào phần hàng đợi còn lại', () => {
  assert.equal(chuanCapNguPhap('HSK 1'), 'HSK1');
  assert.equal(chuanCapNguPhap('a1~'), 'A1');
  const dm = [
    { cap: 'A1', nhom: [{ diem: [{ id: 'en-a1-be' }, { id: 'en-a1-have' }] }] },
    { cap: 'A2', nhom: [{ diem: [{ id: 'en-a2-past' }] }] },
  ];
  assert.equal(chonDiemNguPhap(dm, 'a1', {})?.id, 'en-a1-be');
  assert.equal(chonDiemNguPhap(dm, 'A1', { 'en-a1-be': { dung: 1, tong: 3 } })?.id, 'en-a1-have');
  assert.ok(['en-a1-be', 'en-a1-have'].includes(chonDiemNguPhap(dm, 'A1', { 'en-a1-be': 1, 'en-a1-have': 1 }, rng())!.id), 'hết điểm mới ⇒ ngẫu nhiên cùng cấp');
  assert.equal(chonDiemNguPhap(dm, 'C2', {}), null);

  const h = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ra = chenRai(h, [-1, -2, -3], 0);
  assert.equal(ra.length, 13);
  assert.deepEqual(ra.filter((x) => x > 0), h, 'không làm mất / đảo câu cũ');
  const vt = [-1, -2, -3].map((x) => ra.indexOf(x));
  assert.ok(vt.every((v) => v >= 2), 'không chen vào câu đang làm / câu ngay sau');
  assert.ok(vt[0]! < vt[1]! && vt[1]! < vt[2]!, 'rải theo thứ tự');
  assert.deepEqual(chenRai([1, 2], [-1], 5), [1, 2, -1], 'hàng gần hết ⇒ chèn cuối');
});
