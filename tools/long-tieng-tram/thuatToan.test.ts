/** npx tsx --test tools/long-tieng-tram/thuatToan.test.ts */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  banDo, chiaDoan, chuan, datChuan, demTu, diemKhop, doDaiKhaNghi, dongSrt, gopCau, kheCau, lapKeHoach, lcsTiLe, mocSrt,
  NGHI_CAU, NGHI_PHAY, tachCauViet, tachDoanDai, tenKetQua, totHon, banCanDung, type Cau, type Tu,
} from './thuatToan.ts';

test('tachDoanDai: đoạn 23,5 s có mốc từ ⇒ các mẩu ≤ 8 s, cắt ở dấu câu, không mất chữ (lỗi lượt chạy thử 18/11)', () => {
  // 47 "từ" mỗi từ 0,5 s, dấu phẩy/chấm rải rác — giống đoạn Whisper trả về ở 0:20 của video chạy thử.
  const w: Tu[] = Array.from({ length: 47 }, (_, k) => ({ a: k * 0.5, b: k * 0.5 + 0.45, t: `字${k}${k % 9 === 8 ? '，' : k % 15 === 14 ? '。' : ''}` }));
  const ra = tachDoanDai({ a: 0, b: 23.5, t: w.map((x) => x.t).join(''), w }, 'zh');
  assert.ok(ra.length >= 3);
  for (const d of ra) assert.ok(d.b - d.a <= 8.0001, `mẩu ${d.a}–${d.b} dài quá`);
  assert.equal(ra.map((d) => d.t).join(''), w.map((x) => x.t).join(''), 'không mất / lặp chữ');
  assert.ok(ra.slice(0, -1).every((d) => /[，。]$/.test(d.t)), 'cắt ngay sau dấu câu khi có');
});

test('tachDoanDai: không có dấu câu ⇒ cắt ở khoảng lặng dài nhất; không mốc từ ⇒ chia theo ký tự', () => {
  const w: Tu[] = Array.from({ length: 20 }, (_, k) => ({ a: k * 0.6 + (k >= 12 ? 1 : 0), b: k * 0.6 + 0.5 + (k >= 12 ? 1 : 0), t: 'word' }));
  const ra = tachDoanDai({ a: 0, b: 13, t: '', w }, 'en');
  assert.ok(ra.every((d) => d.b - d.a <= 8.0001));
  assert.ok(ra.some((d) => Math.abs(d.b - (11 * 0.6 + 0.5)) < 1e-9), 'cắt ở khe lặng 1 s');
  const kw = tachDoanDai({ a: 10, b: 30, t: 'Một câu dài. Hai câu dài hơn nữa! Ba câu? Bốn câu cuối cùng.' }, 'en');
  assert.ok(kw.length >= 3 && kw.every((d) => d.b - d.a <= 8.0001));
  assert.equal(kw[0]!.a, 10);
  assert.equal(kw.at(-1)!.b, 30);
  assert.deepEqual(tachDoanDai({ a: 0, b: 5, t: 'ngắn' }, 'en'), [{ a: 0, b: 5, t: 'ngắn' }]);
});

test('gopCau: gộp đoạn sát nhau chưa hết câu, trần 8 s; khe tối thiểu 0,8 s', () => {
  const caus = gopCau([
    { a: 0, b: 1, t: 'hello' }, { a: 1.2, b: 2, t: 'world.' }, { a: 2.1, b: 3, t: 'next' }, { a: 5, b: 6, t: 'far' },
  ], 'en');
  assert.deepEqual(caus.map((c) => c.src), ['hello world.', 'next', 'far']);
  assert.equal(kheCau(caus, 1, 10), 5 - 2.1 - 0.15);
  assert.equal(kheCau([{ i: 0, a: 9.5, b: 9.9, src: 'x' }], 0, 9.9), 0.8);
});

test('tachCauViet: ≤ 130 ký tự giữ nguyên; dài ⇒ tách ở . ? ! ; : trước, rồi dấu phẩy; lặng 0,4 / 0,18 s', () => {
  assert.deepEqual(tachCauViet('Câu ngắn thôi.'), [{ t: 'Câu ngắn thôi.', nghi: 0 }]);
  const dai = 'Bo mạch chủ này dùng chipset B650, hỗ trợ PCIe 5.0 cho khe M.2 chính, và có tám pha VRM cho CPU. ' +
    'Nhưng điểm đáng chú ý nhất là phần tản nhiệt; nó phủ kín cả vùng cấp điện, giúp máy chạy mát hơn khi ép xung lâu dài.';
  const m = tachCauViet(dai);
  assert.ok(m.length >= 2);
  assert.ok(m.every((x) => x.t.length <= 130), m.map((x) => x.t.length).join(','));
  assert.equal(m.map((x) => x.t).join(' '), dai.trim(), 'ghép lại đúng nguyên câu');
  assert.equal(m[0]!.t.endsWith('CPU.'), true);
  assert.equal(m[0]!.nghi, NGHI_CAU);
  assert.equal(m.at(-1)!.nghi, 0);
  // Câu 314 ký tự kiểu lỗi thật: chỉ có dấu phẩy ⇒ tách ở phẩy, lặng 0,18 s
  const phay = Array.from({ length: 12 }, (_, k) => `vế thứ ${k + 1} nói về linh kiện`).join(', ') + '.';
  const mp = tachCauViet(phay);
  assert.ok(phay.length > 300 && mp.length >= 3);
  assert.ok(mp.every((x) => x.t.length <= 130));
  assert.ok(mp.slice(0, -1).every((x) => x.nghi === NGHI_PHAY));
  // Không dấu nào ⇒ cắt ở dấu cách, không cắt giữa từ
  const tron = Array.from({ length: 40 }, () => 'chữ').join(' ');
  const mt = tachCauViet(tron, 50);
  assert.ok(mt.every((x) => x.t.length <= 50 && !x.t.startsWith(' ')));
  assert.equal(mt.map((x) => x.t).join(' '), tron);
});

test('chấm điểm: chuẩn hoá, khoan dung số + từ tiếng Anh, câu sai rõ thì điểm thấp', () => {
  assert.equal(chuan('  Xin CHÀO, thế giới!! '), 'xin chào thế giới');
  assert.equal(lcsTiLe('abc', 'abc'), 1);
  assert.equal(lcsTiLe('', 'abc'), 0);
  assert.equal(diemKhop('Xin chào thế giới', ['xin chào, thế giới.']), 1);
  assert.ok(diemKhop('dùng use state để lưu', ['dùng useState để lưu']) >= 0.99, 'useState ≈ use state');
  assert.ok(diemKhop('khe m 2 chính', ['khe M.2 chính']) >= 0.99);
  const docSo = (s: string) => s.replace(/\b5\b/g, 'năm');
  assert.ok(diemKhop('pci e năm chấm không', ['PCIe 5 chấm không'], docSo) >= 0.95, 'số viết khác dạng vẫn khớp');
  assert.ok(diemKhop('hôm nay trời mưa to quá', ['bo mạch chủ dùng chipset B650']) < 0.6);
  assert.ok(diemKhop('', ['abc']) === 0);
});

test('độ dài khả nghi + chọn bản đọc tốt nhất', () => {
  assert.equal(demTu('Bo mạch chủ, B650!'), 4);
  assert.match(doDaiKhaNghi(0.5, 'một hai ba bốn năm sáu bảy tám')!, /ngắn/);
  assert.match(doDaiKhaNghi(30, 'một hai ba bốn')!, /dài/);
  assert.equal(doDaiKhaNghi(3, 'một hai ba bốn năm sáu bảy tám'), null);
  const a = { seed: 42, diem: 0.95, giay: 3, khaNghi: null };
  const b = { seed: 7, diem: 0.99, giay: 30, khaNghi: 'dài' };
  assert.ok(totHon(a, b), 'độ dài hợp lý thắng điểm cao');
  assert.ok(!totHon(b, a));
  assert.ok(totHon({ ...a, diem: 0.97 }, a));
  assert.ok(datChuan(a) && !datChuan(b) && !datChuan({ ...a, diem: 0.8 }));
});

const caus: Cau[] = [
  { i: 0, a: 1, b: 3, src: 'a' },
  { i: 1, a: 4, b: 6, src: 'b' },
  { i: 2, a: 7, b: 9, src: 'c' },
];

test('kế hoạch tang-toc = bản mẫu: nhanh tới 1,3×, video giữ nguyên', () => {
  const k = lapKeHoach(caus, [2, 5, 1], 10, 'tang-toc');
  assert.equal(k.cuaSo.length, 0);
  assert.equal(k.tongRa >= 10, true);
  assert.ok(Math.abs(k.dat[1]!.tempo - 1.3) < 1e-9);
  assert.equal(k.soDocNhanh, 1);
});

test('kế hoạch cho-giong: nhanh tối đa 1,08×, còn thiếu ⇒ kéo dài hình đúng chỗ, câu sau vẫn khớp hình', () => {
  const k = lapKeHoach(caus, [2, 5, 1], 10, 'cho-giong', 25);
  assert.ok(k.dat.every((d) => d.tempo <= 1.08 + 1e-9));
  assert.equal(k.cuaSo.length, 1);
  const w = k.cuaSo[0]!;
  assert.equal(w.a, 4);
  assert.equal(w.b, 7);
  assert.ok(w.f <= 2);
  // câu 2 bắt đầu ĐÚNG lúc hình của nó bắt đầu (sau phần kéo dài) và sau khi câu 1 đọc xong
  const c1 = k.dat[1]!, c2 = k.dat[2]!;
  assert.ok(c2.batDau >= c1.batDau + c1.giay + 0.1);
  assert.ok(Math.abs(c2.batDau - banDo(k.cuaSo, 7)) < 1e-9);
  // độ dài ra của cửa sổ là bội số khung hình (ghép đoạn không trôi)
  const raCua = (w.b - w.a) * w.f + w.g;
  assert.ok(Math.abs(raCua * 25 - Math.round(raCua * 25)) < 1e-6);
  assert.ok(Math.abs(k.giayKeoDai - (raCua - 3)) < 1e-9);
  assert.ok(Math.abs(k.tongRa - (10 + k.giayKeoDai)) < 1e-9);
  assert.equal(k.soTre, 0);
  // câu quá dài so với khe ngắn ⇒ chậm tối đa 2× rồi giữ khung
  const k2 = lapKeHoach([{ i: 0, a: 0, b: 1, src: 'x' }, { i: 1, a: 1, b: 2, src: 'y' }], [6, 0.5], 3, 'cho-giong', 25);
  assert.equal(k2.cuaSo[0]!.f, 2);
  assert.ok(k2.cuaSo[0]!.g > 3);
});

test('banDo + chiaDoan: đoạn liền nhau phủ kín, ánh xạ tăng dần', () => {
  const cs = [{ a: 2, b: 4, f: 1.5, g: 0.5 }];
  assert.equal(banDo(cs, 1), 1);
  assert.equal(banDo(cs, 3), 3.5);
  assert.equal(banDo(cs, 4), 5.5);
  assert.equal(banDo(cs, 6), 7.5);
  assert.deepEqual(chiaDoan(cs, 6), [{ a: 0, b: 2, f: 1, g: 0 }, cs[0], { a: 4, b: 6, f: 1, g: 0 }]);
});

test('phụ đề + tên kết quả đúng hợp đồng', () => {
  assert.equal(mocSrt(3725.5), '01:02:05,500');
  assert.equal(dongSrt([{ a: 0, b: 1.2, t: 'Xin chào' }]), '1\n00:00:00,000 --> 00:00:01,200\nXin chào\n');
  const t = tenKetQua('Bo mạch chủ: B650/X670?', 'zh', 0.15);
  assert.equal(t.vi, 'Bo mạch chủ B650 X670 [VI].mp4');
  assert.equal(t['vi-goc'], 'Bo mạch chủ B650 X670 [VI + giọng gốc 15%].mp4');
  assert.equal(t['srt-vi'], 'Bo mạch chủ B650 X670.vi.srt');
  assert.equal(t['srt-goc'], 'Bo mạch chủ B650 X670.zh.srt');
});

test('banCanDung: Xuất ra cả hai / chỉ giọng Việt / chỉ song ngữ; thiếu hoặc lạ ⇒ cả hai', () => {
  assert.deepEqual(banCanDung('ca-hai'), [['vi', false], ['vi-goc', true]]);
  assert.deepEqual(banCanDung(undefined), [['vi', false], ['vi-goc', true]], 'web cũ không gửi trường ⇒ như trước');
  assert.deepEqual(banCanDung('la'), [['vi', false], ['vi-goc', true]]);
  assert.deepEqual(banCanDung('vi'), [['vi', false]]);
  assert.deepEqual(banCanDung('vi-goc'), [['vi-goc', true]]);
});
