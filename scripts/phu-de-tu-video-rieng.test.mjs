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
  canCanhTheoSrt, cauTuSrt, cauTuThoiGian, chiMucUrl, docSrt, dungMuc, giaySrt, phanTuThoiGian,
  thoiGianKhopVideo, vietJson,
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
  assert.equal(muc.parts.length, 2);
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
  assert.deepEqual(muc.parts, [
    { t: 5.1, den: 19, ten: 'Chào bạn' },
    { t: 19, den: 50, ten: 'Git là gì' },
  ]);
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
