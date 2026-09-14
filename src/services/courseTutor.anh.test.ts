/**
 * Ảnh dán vào câu hỏi gia sư — hai quyết định dễ hỏng nhất.
 *
 * 1. CACHE PHẢI ĐỨNG NGOÀI khi có ảnh. Cache của gia sư xếp theo `cacheKey`
 *    của chip gợi ý, mà chip giống nhau cho MỌI người học trên cùng một bài.
 *    Ghi vào đó một câu trả lời nói về ảnh RIÊNG của một người là mọi người
 *    sau bấm chip đều nhận lời giảng về tấm ảnh họ chưa từng thấy — và nó nằm
 *    lại đó cho tới khi có ai bấm "Hỏi lại mới".
 *
 * 2. LỌC Ở TẦNG ROUTE, không tin client. Mỗi thứ lọt qua đây đều thành một
 *    lỗi ở phía cổng, và là loại lỗi không nói vì sao.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { khongDungCache } from './courseTutor.service.js';
import { docAnhDan } from '../routes/course.routes.js';

const anh = (loai: string, dai = 20) => `data:${loai};base64,${'A'.repeat(dai)}`;

test('có ảnh ⇒ KHÔNG đụng cache', () => {
  assert.equal(
    khongDungCache({
      userId: 1, question: 'chỗ này là gì?', cacheKey: 'start',
      images: [{ media_type: 'image/png', data: 'AAAA' }],
    }),
    true,
  );
});

test('không ảnh ⇒ cache chạy như cũ', () => {
  assert.equal(khongDungCache({ userId: 1, question: 'bài này học gì?', cacheKey: 'start' }), false);
  assert.equal(khongDungCache({ userId: 1, question: 'x', images: [] }), false);
});

test('nhận png/jpeg/webp/gif', () => {
  const r = docAnhDan([anh('image/png'), anh('image/webp')]);
  assert.equal(r?.length, 2);
  assert.equal(r?.[0]?.media_type, 'image/png');
});

test('image/jpg được nắn thành image/jpeg', () => {
  // `image/jpg` KHÔNG phải media type thật — cổng trả 400 cho nó. Trình duyệt
  // thì vẫn sinh ra chuỗi này ở vài đường dán.
  assert.equal(docAnhDan([anh('image/jpg')])?.[0]?.media_type, 'image/jpeg');
});

test('bỏ loại không phải ảnh thật', () => {
  // SVG là XML: model nhận vào sẽ nói về một tấm ảnh nó không đọc được.
  assert.equal(docAnhDan([anh('image/svg+xml'), anh('application/pdf'), anh('text/html')]), undefined);
});

test('bỏ tấm quá to, GIỮ những tấm còn lại', () => {
  // Từ chối cả lượt thì người học dán 2 tấm, một tấm quá cỡ, là mất luôn câu hỏi.
  const r = docAnhDan([anh('image/png', 6 * 1024 * 1024), anh('image/png')]);
  assert.equal(r?.length, 1);
});

test('trần 3 tấm — hội thoại được gửi lại TOÀN BỘ ở mỗi lượt', () => {
  assert.equal(docAnhDan(Array.from({ length: 7 }, () => anh('image/png')))?.length, 3);
});

test('rác thì trả undefined, không ném', () => {
  assert.equal(docAnhDan(undefined), undefined);
  assert.equal(docAnhDan([]), undefined);
  assert.equal(docAnhDan(['không phải data url', 42, null]), undefined);
});
