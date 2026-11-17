/**
 * Bộ dựng phụ đề video riêng — những chỗ đã thấy hỏng thật khi chạy trên dữ liệu 18/10/2026:
 *   • thoigian.json của 18 video React là bản SOẠN LẠI sau khi render (dài hơn video thật ~50 s) ⇒ phải nhận ra
 *     và lùi về SRT, nhưng vẫn căn được các phần theo câu mở cảnh;
 *   • bản GHÉP nối các tệp video.mp4 dài hơn `thoiLuongGiay` ~5 s (khung kết) ⇒ dời mốc phải theo thời lượng tệp;
 *   • ánh xạ video → bài PHẢI theo URL (slugWeb của video ≠ slug bài ở SWT301/JPD123).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canCanhTheoSrt, cauTuSrt, cauTuThoiGian, chiaChuong, chiaTheoCau, chiMucUrl, docSrt, dungMuc, giaySrt, gopCanh,
  phanTuThoiGian, tenTuCau, thoiGianKhopVideo, vietJson,
} from './phu-de-tu-video-rieng.lib.mjs';

const tg = (tong, canh) => ({ bai: 'x', fps: 30, moDau: 4.6, tong, canh });
const TG = tg(60, [
  { id: 'on', ten: 'Chào bạn', tu: 4.6, den: 20, cau: [
    { hien: 'Chào bạn, đến với bài 0.5: Bắt đầu tại đây.', a: 5.1, b: 9 },
    { hien: '  Khoá này   đưa bạn đi xa. ', a: 10.123, b: 15 },
  ] },
  { id: 'git', ten: 'Git là gì', tu: 20, den: 60, cau: [{ hien: 'Git là nút lưu game.', a: 21, b: 25 }] },
]);
const SRT = `1
00:00:05,100 --> 00:00:07,000
Chào bạn, đến với bài 0.5:

2
00:00:07,020 --> 00:00:09,000
Bắt đầu tại đây.

3
00:00:10,123 --> 00:00:15,000
Khoá này đưa bạn đi xa.

4
00:00:21,000 --> 00:00:25,000
Git là nút lưu game.
`;

test('giaySrt / docSrt', () => {
  assert.equal(giaySrt('00:01:02,345'), 62.345);
  assert.ok(Number.isNaN(giaySrt('rác')));
  const c = docSrt(SRT + '\n\nkhối hỏng không có mốc\n');
  assert.equal(c.length, 4);
  assert.deepEqual(c[0], { a: 5.1, b: 7, chu: 'Chào bạn, đến với bài 0.5:' });
});

test('câu từ thoigian.json: chữ gọn, mốc làm tròn, dời được', () => {
  assert.deepEqual(cauTuThoiGian(TG), [
    { t: 5.1, vi: 'Chào bạn, đến với bài 0.5: Bắt đầu tại đây.' },
    { t: 10.12, vi: 'Khoá này đưa bạn đi xa.' },
    { t: 21, vi: 'Git là nút lưu game.' },
  ]);
  assert.equal(cauTuThoiGian(TG, 100)[0].t, 105.1);
});

test('các phần = các cảnh (tên, từ, đến)', () => {
  assert.deepEqual(phanTuThoiGian(TG), [
    { t: 4.6, den: 20, ten: 'Chào bạn' },
    { t: 20, den: 60, ten: 'Git là gì' },
  ]);
  assert.equal(phanTuThoiGian(TG, 10, 'Phần 2 · ')[1].ten, 'Phần 2 · Git là gì');
});

test('SRT dự phòng: ghép mẩu thành câu theo dấu chấm câu', () => {
  assert.deepEqual(cauTuSrt(SRT), [
    { t: 5.1, vi: 'Chào bạn, đến với bài 0.5: Bắt đầu tại đây.' },
    { t: 10.12, vi: 'Khoá này đưa bạn đi xa.' },
    { t: 21, vi: 'Git là nút lưu game.' },
  ]);
});

test('nhận ra thoigian.json KHÔNG phải của video đã render', () => {
  const srt = docSrt(SRT);
  assert.equal(thoiGianKhopVideo(TG, 60, srt).khop, true);
  assert.equal(thoiGianKhopVideo(TG, 52, srt).khop, false, 'thời lượng lệch 8 s');
  assert.equal(thoiGianKhopVideo(TG, 60, srt.map((c) => ({ ...c, a: c.a + 3 }))).khop, false, 'câu đầu lệch SRT');
  assert.equal(thoiGianKhopVideo(null, 60, srt).khop, false);
});

test('dungMuc: video thường dùng mốc chính xác + các phần', () => {
  const { muc, canhBao } = dungMuc({
    thongTin: { r2Url: 'https://cdn/x.mp4', thoiLuongGiay: 60, ngonNgu: 'vi' },
    srt: SRT, phan: [{ thoiGian: TG, thoiLuongGiay: 60 }],
  });
  assert.deepEqual(canhBao, []);
  assert.equal(muc.nguonCau, 'thoigian');
  assert.equal(muc.videoUrl, 'https://cdn/x.mp4');
  assert.equal(muc.cues.length, 3);
  // Video 60 s, hai cảnh 15 s + 40 s ⇒ GỘP thành một chương (ngưỡng 25 s), bắt đầu từ 0:00.
  assert.deepEqual(muc.parts, [{ t: 0, den: 60, ten: 'Chào bạn · Git là gì' }]);
  assert.equal(muc.nguonPhan, 'canh');
  assert.equal(muc.lang, 'vi');
});

test('dungMuc: thoigian lệch ⇒ câu từ SRT, các phần CĂN THEO SRT (mốc của video thật)', () => {
  // Video thật ngắn hơn (lời soạn lại sau khi render): mọi mốc dời sớm 2 s.
  const srtLech = SRT.replace('00:00:21,000', '00:00:19,000');
  const { muc, canhBao } = dungMuc({
    thongTin: { r2Url: 'u', thoiLuongGiay: 50 }, srt: srtLech, phan: [{ thoiGian: TG, thoiLuongGiay: 50 }],
  });
  assert.equal(muc.nguonCau, 'srt');
  assert.match(canhBao.join(' '), /thời lượng lệch/);
  assert.deepEqual(canCanhTheoSrt([{ tg: TG, tienTo: '' }], docSrt(srtLech), 50), [
    { t: 5.1, den: 19, ten: 'Chào bạn' },
    { t: 19, den: 50, ten: 'Git là gì' },
  ]);
  assert.deepEqual(muc.parts, [{ t: 0, den: 50, ten: 'Chào bạn · Git là gì' }]);
});

test('dungMuc: chỉ có KỊCH BẢN (thoigian.json ở máy dựng khác) ⇒ câu từ SRT, cảnh căn theo SRT', () => {
  const kb = { chiKichBan: true, canh: TG.canh.map((c) => ({ id: c.id, ten: c.ten, cau: c.cau.map((k) => ({ hien: k.hien })) })) };
  const { muc, canhBao } = dungMuc({ thongTin: { r2Url: 'u', thoiLuongGiay: 60 }, srt: SRT, phan: [{ thoiGian: kb, thoiLuongGiay: 60 }] });
  assert.equal(muc.nguonCau, 'srt');
  assert.match(canhBao.join(' '), /chỉ có kịch bản/);
  assert.equal(muc.nguonPhan, 'canh');
  assert.equal(muc.parts[0].ten, 'Chào bạn · Git là gì');
});

test('tenTuCau: bỏ lời đệm, cắt ở dấu ngắt ý, ≤ 8 từ, viết hoa chữ đầu', () => {
  assert.equal(tenTuCau('Rồi, giờ ta xem SLO là gì: một con số mà team cam kết.'), 'Giờ ta xem SLO là gì');
  assert.equal(tenTuCau('Tiếp theo, URL có năm phần. Scheme là giao thức nào.'), 'URL có năm phần');
  assert.equal(tenTuCau('Mười cờ là đủ cho cả khoá dùng suốt từ đầu tới cuối không cần thêm'), 'Mười cờ là đủ cho cả khoá dùng…');
});

test('chiaTheoCau: cắt ở câu CHUYỂN Ý sau ngưỡng, có Mở đầu + Tóm tắt, đoạn cuối ngắn thì gộp', () => {
  const cues = [];
  for (let t = 5; t < 600; t += 10) cues.push({ t, vi: `Câu số ${t} nói về một ý trong bài.` });
  cues[0].vi = 'Chào bạn, đến với bài 1.1 của khoá.';
  cues.find((c) => c.t === 125).vi = 'Tiếp theo, ta dựng máy chủ tấm gương.';
  cues.find((c) => c.t === 275).vi = 'Bây giờ đọc response từng dòng.';
  cues.find((c) => c.t === 545).vi = 'Tóm lại, HTTP chỉ là một định dạng thư.';
  const ra = chiaTheoCau(cues, 600);
  assert.equal(ra[0].ten, 'Mở đầu · bài này học gì');
  assert.equal(ra[1].t, 125);
  assert.equal(ra[1].ten, 'Ta dựng máy chủ tấm gương');
  assert.equal(ra[2].t, 275);
  assert.ok(ra.every((p, i) => i === 0 || p.t === ra[i - 1].den), 'các chương nối liền');
  assert.equal(ra.at(-1).den, 600);
  assert.ok(ra.every((p) => p.den - p.t <= 240), 'không chương nào quá 4 phút');
});

test('gopCanh: cảnh 20–50 s gộp thành chương ≥ 75 s, tên bỏ cảnh vô nghĩa ("Bìa", "s01")', () => {
  const canh = [
    { t: 4.6, den: 30, ten: 'Ôn nhanh · hôm nay' }, { t: 30, den: 40, ten: 'Bìa' }, { t: 40, den: 90, ten: 'Bài này mang về gì' },
    { t: 90, den: 140, ten: 'Chạy thật: curl -i' }, { t: 140, den: 200, ten: 's01' }, { t: 200, den: 400, ten: 'Tóm tắt' },
  ];
  const ra = gopCanh(canh, [], 400);
  assert.deepEqual(ra.map((p) => [p.t, p.den]), [[4.6, 90], [90, 200], [200, 400]]);
  assert.equal(ra[0].ten, 'Ôn nhanh · hôm nay · Bài này mang về gì');
  assert.equal(ra[1].ten, 'Chạy thật: curl -i');
  assert.equal(chiaChuong({ parts: canh, cues: [], thoiLuong: 400 })[0].t, 0, 'chương đầu bắt đầu từ 0:00');
});

test('canCanhTheoSrt: khớp quá ít cảnh ⇒ không đoán, trả []', () => {
  const srt = docSrt('1\n00:00:01,000 --> 00:00:02,000\nCâu khác hẳn.\n');
  assert.deepEqual(canCanhTheoSrt([{ tg: TG, tienTo: '' }], srt, 60), []);
});

test('dungMuc: bản GHÉP dời mốc theo thời lượng TỆP video (có khung kết), không theo thoiLuongGiay', () => {
  const p2 = tg(30, [{ id: 'b', ten: 'Render', tu: 4.6, den: 30, cau: [{ hien: 'Phần hai đây.', a: 5, b: 8 }] }]);
  // Tệp phần 1 dài 65,27 s (60 s + khung kết) ⇒ phần 2 bắt đầu ở 65,27 trong video ghép.
  const srt = SRT + '\n5\n00:01:10,270 --> 00:01:13,000\nPhần hai đây.\n';
  const { muc, canhBao } = dungMuc({
    thongTin: { r2Url: 'u', thoiLuongGiay: 95.27, tron: true },
    srt,
    phan: [
      { thoiGian: TG, thoiLuongGiay: 60, thoiLuongVideo: 65.27 },
      { thoiGian: p2, thoiLuongGiay: 30, thoiLuongVideo: 30 },
    ],
  });
  assert.deepEqual(canhBao, []);
  assert.equal(muc.nguonCau, 'thoigian');
  assert.equal(muc.cues.at(-1).t, 70.27);
  assert.equal(muc.parts.at(-1).ten, 'Phần 2 · Render');
  assert.equal(muc.parts.at(-1).t, 69.87);
});

test('chiMucUrl: theo URL track, một URL nhiều bài, cả VI lẫn EN', () => {
  const m = chiMucUrl([
    { courseSlug: 'software-testing', lessons: {
      'swt301-lab2-labflow-nghiep-vu': { vi: { url: 'https://r2/a.mp4' } },
      'swt301-ci': { yt: 'abc' },
    } },
    { courseSlug: 'jp', lessons: { 'jp-1': { vi: { url: 'https://r2/b.mp4' } }, 'jp-2': { vi: { url: 'https://r2/b.mp4' }, en: { url: 'https://r2/e.mp4' } } } },
  ]);
  assert.deepEqual(m.get('https://r2/a.mp4'), [{ courseSlug: 'software-testing', lessonSlug: 'swt301-lab2-labflow-nghiep-vu', track: 'VI' }]);
  assert.equal(m.get('https://r2/b.mp4').length, 2);
  assert.deepEqual(m.get('https://r2/e.mp4'), [{ courseSlug: 'jp', lessonSlug: 'jp-2', track: 'EN' }]);
  assert.equal(m.size, 3);
});

test('vietJson: đọc lại được, sắp theo slug, chạy lại ra đúng từng byte', () => {
  const lessons = {
    b: { lang: 'vi', source: 'r2', track: 'VI', videoUrl: 'u2', nguonCau: 'srt', cues: [{ t: 1, vi: 'x "y"' }], parts: [] },
    a: { lang: 'vi', source: 'r2', track: 'VI', videoUrl: 'u1', nguonCau: 'thoigian', cues: [{ t: 0, vi: 'z' }], parts: [{ t: 0, den: 3, ten: 'P' }] },
  };
  const s = vietJson({ courseSlug: 'git', sinhBoi: 'x', lessons });
  const doc = JSON.parse(s);
  assert.deepEqual(Object.keys(doc.lessons), ['a', 'b']);
  assert.deepEqual(doc.lessons.b, lessons.b);
  assert.equal(vietJson({ courseSlug: 'git', sinhBoi: 'x', lessons: JSON.parse(s).lessons }), s);
});
