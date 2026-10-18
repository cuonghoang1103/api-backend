/**
 * Chọn phụ đề cho gia sư phòng video — chỗ hỏng nguy hiểm nhất là LÙI CHÉO:
 * người học đang xem video tiếng Việt (R2) mà gia sư đọc phụ đề YouTube của
 * cùng bài, nên mọi nút `[mm:ss]` tua tới chỗ chẳng liên quan — và trông vẫn
 * như đúng. Cùng loại: phụ đề sinh cho video CŨ (URL đã đổi) phải bị bỏ.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  chonNguonPhuDe, chuanTrack, chuCau, docPhan, dungKhoiPhuDe, khoaCacheTheoTrack, laTrackRieng,
} from './phuDeRieng.js';
import { themPhongVideoRieng } from '../courseTutor.service.js';

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
