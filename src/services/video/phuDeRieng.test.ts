/**
 * Chọn phụ đề cho gia sư phòng video — chỗ hỏng nguy hiểm nhất là LÙI CHÉO:
 * người học đang xem video tiếng Việt (R2) mà gia sư đọc phụ đề YouTube của
 * cùng bài, nên mọi nút `[mm:ss]` tua tới chỗ chẳng liên quan — và trông vẫn
 * như đúng. Cùng loại: phụ đề sinh cho video CŨ (URL đã đổi) phải bị bỏ.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  chonNguonPhuDe, chuanTrack, chuCau, docDoanHoi, docPhan, dungKhoiPhuDe, khoaCacheDoan, khoaCacheTheoTrack, laTrackRieng,
  rutGonPhuDe,
} from './phuDeRieng.js';
import { cacheKeyHopLe, themPhongVideoRieng } from '../courseTutor.service.js';

const rieng = { videoUrl: 'https://media/x-1.mp4', cues: [] as unknown[] };
const yt = { cues: [] as unknown[] };

test('chuanTrack: VI/VN/vi ⇒ VI; rác ⇒ undefined (hành vi cũ)', () => {
  assert.equal(chuanTrack('vi'), 'VI');
  assert.equal(chuanTrack('VN'), 'VI');
  assert.equal(chuanTrack('EN'), 'EN');
  assert.equal(chuanTrack('yt'), 'YT');
  assert.equal(chuanTrack(undefined), undefined);
  assert.equal(chuanTrack('auto'), undefined);
  assert.equal(laTrackRieng('YT'), false);
  assert.equal(laTrackRieng(undefined), false);
});

test('track VI + phụ đề riêng khớp URL ⇒ dùng phụ đề riêng', () => {
  const c = chonNguonPhuDe('VI', rieng, 'https://media/x-1.mp4', yt);
  assert.equal(c?.loai, 'rieng');
});

test('track VI mà KHÔNG có phụ đề riêng ⇒ null, KHÔNG lùi về phụ đề YouTube', () => {
  assert.equal(chonNguonPhuDe('VI', null, 'https://media/x-1.mp4', yt), null);
});

test('track VI, phụ đề riêng sinh cho video CŨ (URL lệch) ⇒ null', () => {
  assert.equal(chonNguonPhuDe('VI', rieng, 'https://media/x-2.mp4', yt), null);
  assert.equal(chonNguonPhuDe('VI', rieng, null, yt), null);
});

test('YT / không truyền track ⇒ phụ đề YouTube như cũ, bỏ qua phụ đề riêng', () => {
  assert.equal(chonNguonPhuDe('YT', rieng, 'https://media/x-1.mp4', yt)?.loai, 'youtube');
  assert.equal(chonNguonPhuDe(undefined, rieng, 'https://media/x-1.mp4', yt)?.loai, 'youtube');
  assert.equal(chonNguonPhuDe(undefined, rieng, 'x', null), null);
});

test('khoá cache chip tách theo track video riêng, YouTube giữ nguyên', () => {
  assert.equal(khoaCacheTheoTrack('video_tomtat', 'VI', true), 'video_tomtat@vi');
  assert.equal(khoaCacheTheoTrack('video_tomtat', 'YT', true), 'video_tomtat');
  assert.equal(khoaCacheTheoTrack('video_tomtat', undefined, true), 'video_tomtat');
  assert.equal(khoaCacheTheoTrack('start', 'VI', false), 'start', 'ngoài phòng video không đổi khoá');
});

test('chuCau đọc cả {t,en} lẫn {t,vi}', () => {
  assert.equal(chuCau({ t: 1, en: 'hello' }), 'hello');
  assert.equal(chuCau({ t: 1, vi: 'xin chào' }), 'xin chào');
  assert.equal(chuCau(null), '');
});

test('docPhan: bỏ phần tử hỏng, sắp theo mốc', () => {
  assert.deepEqual(docPhan([{ t: 20, ten: 'B' }, { t: 'x', ten: 'hỏng' }, null, { t: 0, den: 20, ten: ' A ' }]), [
    { t: 0, den: 20, ten: 'A' }, { t: 20, ten: 'B' },
  ]);
  assert.deepEqual(docPhan('rác'), []);
});

test('khối phụ đề VIDEO RIÊNG: có CÁC PHẦN đúng mốc, đoạn đang xem, chữ tiếng Việt', () => {
  const s = dungKhoiPhuDe({
    cues: [{ t: 5.1, vi: 'Chào bạn.' }, { t: 200, vi: 'Git là nút lưu game.' }, { t: 330, vi: 'Tóm tắt.' }],
    parts: [{ t: 4.6, den: 199.9, ten: 'Chào bạn' }, { t: 199.9, den: 330, ten: 'Git là gì' }, { t: 330, ten: 'Tóm tắt' }],
    giay: 210, banKinhGiay: 100, tran: 14_000, tiengViet: true,
  });
  assert.match(s, /CÁC PHẦN CỦA VIDEO \(3 phần/);
  assert.match(s, /- \[0:04 - 3:19\] Chào bạn/);
  assert.match(s, /- \[5:30\] Tóm tắt/);
  assert.match(s, /ĐOẠN NGƯỜI HỌC ĐANG XEM \(quanh mốc 3:30\):\n\[3:20\] Git là nút lưu game\./);
  assert.ok(!/ĐOẠN NGƯỜI HỌC ĐANG XEM[^]*\[0:05\]/.test(s.split('PHỤ ĐỀ TOÀN VIDEO')[0]), '5s nằm ngoài ±100s');
  assert.match(s, /PHỤ ĐỀ TOÀN VIDEO \(lời giảng tiếng Việt\) \(3 câu\):/);
});

test('khối phụ đề YouTube giữ đúng khuôn cũ (không có CÁC PHẦN)', () => {
  const s = dungKhoiPhuDe({ cues: [{ t: 61, en: 'Hello there.' }], soCau: 1, banKinhGiay: 100, tran: 14_000 });
  assert.equal(s, '\n\nPHỤ ĐỀ TOÀN VIDEO (1 câu):\n[1:01] Hello there.');
  assert.equal(dungKhoiPhuDe({ cues: [], banKinhGiay: 100, tran: 1 }), '');
});

test('lời dặn video riêng: có phần ⇒ bắt dùng y nguyên danh sách phần', () => {
  assert.match(themPhongVideoRieng(true), /Use EXACTLY the parts listed under "CÁC PHẦN CỦA VIDEO"/);
  assert.match(themPhongVideoRieng(true), /VIETNAMESE/);
  assert.doesNotMatch(themPhongVideoRieng(false), /CÁC PHẦN CỦA VIDEO"/);
  assert.doesNotMatch(themPhongVideoRieng(false), /learning BOTH the subject knowledge AND English/);
});

test('docDoanHoi: không tin client — số hữu hạn, den > tu, tối đa 10 phút, tên gọn', () => {
  assert.deepEqual(docDoanHoi({ tu: 200, den: 310.04, ten: '  Git   là gì ' }), { tu: 200, den: 310, ten: 'Git là gì' });
  assert.deepEqual(docDoanHoi({ tu: 0, den: 5000 }), { tu: 0, den: 600 }, 'cắt ở 10 phút');
  assert.equal(docDoanHoi({ tu: 50, den: 40 }), undefined);
  assert.equal(docDoanHoi({ tu: -1, den: 40 }), undefined);
  assert.equal(docDoanHoi({ tu: 'x', den: 40 }), undefined);
  assert.equal(docDoanHoi(null), undefined);
});

test('khối phụ đề: ĐOẠN NGƯỜI HỌC ĐANG HỎI đủ từng câu trong đoạn (kèm câu đang nói dở), thắng cửa sổ quanh giây', () => {
  const s = dungKhoiPhuDe({
    cues: [{ t: 5, vi: 'Mở đầu.' }, { t: 190, vi: 'Câu nói dở trước mốc.' }, { t: 205, vi: 'Git là nút lưu game.' },
      { t: 300, vi: 'Commit là một lần lưu.' }, { t: 400, vi: 'Ngoài đoạn.' }],
    doan: { tu: 200, den: 320, ten: 'Git là gì' }, giay: 10, banKinhGiay: 100, tran: 14_000, tiengViet: true,
  });
  assert.match(s, /ĐOẠN NGƯỜI HỌC ĐANG HỎI \("Git là gì", \[3:20 - 5:20\] — đủ từng câu\):\n\[3:10\] Câu nói dở trước mốc\.\n\[3:25\] Git là nút lưu game\.\n\[5:00\] Commit là một lần lưu\./);
  assert.doesNotMatch(s.split('PHỤ ĐỀ TOÀN VIDEO')[0], /Ngoài đoạn/);
  assert.doesNotMatch(s, /ĐOẠN NGƯỜI HỌC ĐANG XEM/, 'đã có đoạn hỏi thì không thêm cửa sổ quanh giây');
});

test('rutGonPhuDe: video dài vẫn PHỦ TỚI CUỐI (giữ 1/k câu), không cắt cụt nửa sau', () => {
  const dong = Array.from({ length: 900 }, (_, i) => `[${i}:00] câu số ${i} của bài giảng khá dài một chút`);
  const { text, buoc } = rutGonPhuDe(dong, 14_000);
  assert.ok(text.length <= 14_000);
  assert.ok(buoc > 1);
  assert.match(text, new RegExp(`\\[${Math.floor(899 / buoc) * buoc}:00\\]`), 'còn câu gần cuối video');
  assert.deepEqual(rutGonPhuDe(['a', 'b'], 100), { text: 'a\nb', buoc: 1 });
});

test('cacheKeyHopLe: khoá theo đoạn phải KHỚP mốc của đoạn — lệch thì bỏ cache', () => {
  const doan = { tu: 200, den: 320 };
  assert.equal(cacheKeyHopLe({ cacheKey: khoaCacheDoan('pgt', doan), doan }), 'pgt@200-320');
  assert.equal(cacheKeyHopLe({ cacheKey: 'pgt@0-60', doan }), undefined);
  assert.equal(cacheKeyHopLe({ cacheKey: 'start', doan }), undefined, 'chip của bài không dùng cho câu hỏi theo đoạn');
  assert.equal(cacheKeyHopLe({ cacheKey: 'start' }), 'start');
  assert.equal(cacheKeyHopLe({ cacheKey: 'pgt@200-320' }), undefined, 'khoá đoạn mà không có đoạn ⇒ bỏ');
});
