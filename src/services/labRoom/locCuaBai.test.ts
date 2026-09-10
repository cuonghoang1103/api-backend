/**
 * ============================================================
 * ĐỌC LOC TỪ BÀI — BỘ KIỂM
 * ============================================================
 *
 * LOC là con số cả tính năng Phòng Lab đứng lên: người học chọn bài cho đủ
 * một mục tiêu, và tiến độ của phòng đo bằng nó. Nó KHÔNG phải một cột trong
 * cơ sở dữ liệu — nó nằm trong tiêu đề bài, dạng `... (37 LOC)`, vì bộ 54 đề
 * LAB211 được nhập vào với tiêu đề như vậy.
 *
 * Chỗ đó chính là lý do phải có bộ kiểm này: một phép đọc chuỗi thì `tsc` không
 * nói được gì, mà đọc trượt thì hậu quả im lặng — tổng LOC ra 0, thanh tiến độ
 * đứng yên, và không có lỗi nào để thấy.
 *
 * Bản sao phía frontend (`locFromTitle` trong `frontend/src/lib/code-lab-api.ts`)
 * dùng CÙNG mẫu này, nhưng bản ở đây mới là bản chốt số ghi vào phòng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { locCuaBai } from './phongLab.service.js';

test('đọc LOC từ tiêu đề đúng dạng LAB211', () => {
  assert.equal(locCuaBai({ title: 'J1.S.P0068_Input, sort and display student information (37 LOC)' }), 37);
  assert.equal(locCuaBai({ title: 'J1.S.P0060_Calculate the total amount spent by a user through the bills (21 LOC)' }), 21);
  assert.equal(locCuaBai({ title: 'J1.L.P0014_Asset management (1356 LOC)' }), 1356);
});

test('không có ngoặc thì lùi về đọc trong đề', () => {
  assert.equal(locCuaBai({ title: 'Bài không ghi LOC', problemHtml: '<p>Short Assignment · J1.S.P0063 · 25 LOC · 1 slot(s)</p>' }), 25);
});

test('không đâu có LOC thì trả 0, không trả NaN', () => {
  // NaN mới là thứ nguy hiểm: nó cộng vào tổng và biến cả thanh tiến độ thành
  // NaN mà không có lỗi nào ném ra.
  const n = locCuaBai({ title: 'Bài của track khác', problemHtml: '<p>Không nhắc gì tới LOC</p>' });
  assert.equal(n, 0);
  assert.ok(!Number.isNaN(n));
  assert.equal(locCuaBai({}), 0);
  assert.equal(locCuaBai({ title: null, problemHtml: null }), 0);
});

test('tiêu đề trước, đề sau — hai chỗ vênh thì tin tiêu đề', () => {
  // Tiêu đề là con số người học NHÌN THẤY lúc tick chọn. Cộng dồn một con số
  // khác với con số hiện trên màn hình là cách chắc chắn để họ mất tin.
  assert.equal(locCuaBai({ title: 'Bài X (40 LOC)', problemHtml: '<p>· 99 LOC ·</p>' }), 40);
});

test('LOC bốn chữ số vẫn đọc được, năm chữ số thì không nuốt bậy', () => {
  assert.equal(locCuaBai({ title: 'Bài lớn (9999 LOC)' }), 9999);
  // 5 chữ số không phải dạng của bộ đề này; đọc trượt còn hơn đọc ra một số
  // sai lệch mười lần rồi cộng vào mục tiêu của người dùng.
  assert.equal(locCuaBai({ title: 'Bài lạ (10000 LOC)' }), 0);
});
