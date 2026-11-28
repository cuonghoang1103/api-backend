/**
 * Kiểm chấm câu của "Luyện câu 2 chiều" (chamCau.ts) + dữ liệu câu Bài 1–10.
 *   npm run dekiru:chamcau:test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — Node chạy thẳng tệp .ts (strip-types) nên phải ghi đuôi .ts; tsc của Next không cho.
import { chamCau, tuDien, CHU_QUEN, chuoiNgay, ghiLuot, KHO_RONG, khoaCau, ngaySo } from './chamCau.ts';

const JA = '{私|わたし}は{学生|がくせい}です。';
const td = tuDien([JA, '{日本|にほん}の{学校|がっこう}へ{行|い}きます。'], CHU_QUEN);
const ok = (x: string, ja = JA, alt: string[] = []) => chamCau(x, ja, alt, td).kq;

test('kana, chữ Hán, trộn, romaji đều đúng', () => {
  for (const x of ['わたしはがくせいです', '私は学生です。', '私はがくせいです', 'わたしは学生です', 'watashi wa gakusei desu', 'Watashi ha gakusei desu.', ' わたし は がくせい です 。'])
    assert.equal(ok(x), 'dung', x);
});

test('sai trợ từ, sai từ ⇒ không đúng', () => {
  assert.equal(ok('わたしもがくせいです'), 'gan'); // sai 1 chữ (trợ từ)
  assert.equal(ok('わたしはせんせいです'), 'sai');
  assert.equal(ok(''), 'sai');
});

test('trường âm, katakana ⇒ gần đúng; romaji thì bỏ qua', () => {
  const ja = '{学校|がっこう}へ{行|い}きます。';
  assert.equal(ok('がっこへいきます', ja), 'gan');
  assert.equal(ok('gakko e ikimasu', ja), 'dung');
  assert.equal(ok('てにすがすきです', 'テニスが すきです。'), 'gan');
  assert.equal(ok('テニスがすきです', 'テニスが すきです。'), 'dung');
});

test('câu hỏi–đáp có —— và cách viết khác (alt)', () => {
  const ja = 'おしごとは？——{学生|がくせい}です。';
  assert.equal(ok('おしごとは。学生です', ja), 'dung');
  assert.equal(ok('がくせいです', 'わたしは{学生|がくせい}です。', ['{学生|がくせい}です。']), 'dung');
});

test('số giữ nguyên (3時 ≠ 4時)', () => {
  const ja = '{3時|さんじ}です。';
  const t2 = tuDien([ja]);
  assert.equal(chamCau('3時です', ja, [], t2).kq, 'dung');
  assert.equal(chamCau('さんじです', ja, [], t2).kq, 'dung');
  assert.notEqual(chamCau('4時です', ja, [], t2).kq, 'dung');
});

test('konnichiwa (nn + nguyên âm)', () => {
  assert.equal(chamCau('konnichiwa', 'こんにちは。').kq, 'dung');
});

test('tiến độ: chuỗi đúng, chuỗi ngày', () => {
  let k = KHO_RONG();
  const key = khoaCau(JA);
  assert.equal(key, khoaCau('私は学生です'));
  k = ghiLuot(k, key, true, 10, 20261128);
  k = ghiLuot(k, key, true, 10, 20261128);
  assert.equal(k.c[key][0], 2);
  assert.equal(k.xp, 20);
  k = ghiLuot(k, key, false, 10, 20261128);
  assert.deepEqual(k.c[key].slice(0, 2), [0, 1]);
  const hom = new Date(2026, 10, 28);
  assert.equal(chuoiNgay([20261126, 20261127, 20261128], hom), 3);
  assert.equal(chuoiNgay([20261126, 20261127], hom), 2);
  assert.equal(chuoiNgay([20261125], hom), 0);
  assert.equal(ngaySo(hom), 20261128);
});

test('giá tiền chữ Hán: gõ số Ả Rập cũng đúng', () => {
  const ja = 'これは {三千五百|さんぜんごひゃく}{円|えん} です。';
  const t = tuDien([ja]);
  for (const x of ['これは3500円です', 'これはさんぜんごひゃくえんです', 'これは三千五百円です']) assert.equal(chamCau(x, ja, [], t).kq, 'dung', x);
  assert.notEqual(chamCau('これは3000円です', ja, [], t).kq, 'dung');
});

test('số + đơn vị viết tách {19|じゅうきゅう}{才|さい}', () => {
  const ja = '{19|じゅうきゅう}{才|さい}です。';
  const t = tuDien([ja]);
  for (const x of ['19才です', '19さいです', 'じゅうきゅうさいです', 'juukyuusai desu']) assert.equal(chamCau(x, ja, [], t).kq, 'dung', x);
  assert.notEqual(chamCau('18さいです', ja, [], t).kq, 'dung');
});
