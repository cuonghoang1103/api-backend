/**
 * Kiểm chấm câu trả lời của "Ôn tập bằng thẻ" + độ phủ dữ liệu sinh (onTheData.ts).
 *   npm run dekiru:onthe:test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — Node chạy thẳng tệp .ts (strip-types) nên phải ghi đuôi .ts; tsc của Next không cho.
import { jpVariants, matchJp, matchVi, viAnswers } from './onThe.ts';
// @ts-expect-error — như trên.
import { CAU, HAN, NP, TU } from '../../../app/language/[code]/dekiru/bai/onTheData.ts';

const ans = (w: string, ipa: string) => jpVariants(w, ipa);

test('gõ tiếng Nhật: kana, romaji, chữ Hán, katakana đều nhận', () => {
  const a = ans('{北|きた}', 'kita');
  for (const x of ['きた', 'kita', 'KITA', '北', 'キタ', ' き た ']) assert.ok(matchJp(x, a), x);
  assert.ok(!matchJp('みなみ', a));
  assert.ok(!matchJp('', a));
});

test('trường âm gõ kiểu nào cũng được', () => {
  const a = ans('{飛行機|ひこうき}', 'hikouki');
  for (const x of ['ひこうき', 'hikouki', 'hikōki', 'hikooki']) assert.ok(matchJp(x, a), x);
  const k = ans('コーヒー', 'koohii');
  for (const x of ['コーヒー', 'こーひー', 'koohii', 'kōhī']) assert.ok(matchJp(x, k), x);
});

test('phần trong ngoặc / thể từ điển / số nhóm không bắt buộc', () => {
  const shiro = ans('（お）{城|しろ}', '(o)shiro');
  for (const x of ['おしろ', 'しろ', 'oshiro', 'shiro', '城']) assert.ok(matchJp(x, shiro), x);
  const aru = ans('あります［ある］1', 'arimasu [aru]');
  for (const x of ['あります', 'arimasu']) assert.ok(matchJp(x, aru), x);
  const kirei = ans('きれい（な）', 'kirei (na)');
  for (const x of ['きれい', 'きれいな', 'kirei']) assert.ok(matchJp(x, kirei), x);
});

test('nghĩa tiếng Việt: không dấu, chỉ cần một nghĩa', () => {
  const a = viAnswers('Thành phố, thị trấn (nơi mình sống)');
  for (const x of ['thành phố', 'thanh pho', 'Thị trấn', 'thi tran']) assert.ok(matchVi(x, a), x);
  assert.ok(!matchVi('nhà ga', a));
  const b = viAnswers('～ tiếng (đồng hồ) — khác ～時 là "～ giờ" (Bài 3)');
  assert.ok(matchVi('tiếng', b));
  assert.ok(!matchVi('giờ', b), 'phần giải thích sau — không tính là nghĩa');
});

test('dữ liệu sinh đủ cho Bài 4 và Bài 5', () => {
  const tu = (n: number) => TU.filter((x) => x[0] === n).length;
  assert.ok(tu(4) >= 60 && tu(5) >= 55, `B4 ${tu(4)} · B5 ${tu(5)}`);
  assert.deepEqual(HAN.filter((x) => x[1] === 5).map((x) => x[0]).join(''), '先週毎午後見食飲買物行休');
  assert.ok(NP.filter((x) => x[0] === 4).length >= 13);
  assert.ok(CAU.filter((x) => x[0] === 5).length >= 30);
  // Không còn câu mẫu trong bộ thẻ từ, và mỗi câu trắc nghiệm có chỉ số đúng hợp lệ.
  assert.ok(TU.every((x) => x[3] !== 'câu mẫu'));
  assert.ok(CAU.every((x) => x[5] >= 0 && x[5] < x[4].length));
});

test('mọi từ vựng đều tự gõ đúng được bằng chính kana và romaji của nó', () => {
  const hong: string[] = [];
  for (const [, , w, , ipa] of TU) {
    const a = ans(w, ipa);
    if (!a.length) hong.push(w);
  }
  assert.deepEqual(hong, []);
});
