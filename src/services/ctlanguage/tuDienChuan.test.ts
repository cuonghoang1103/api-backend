/** Chuẩn hoá từ điển — khoá lưu và khoá tra phải trùng khít; pinyin/romaji sai là cả từ điển tra lệch. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amTietCoDau, khoaTra, pinyinCoDau, romaji } from './tuDienChuan.js';

test('khoaTra: bỏ dấu tiếng Việt + pinyin, đ→d, katakana→hiragana, bỏ khoảng trắng', () => {
  assert.equal(khoaTra('Học tập'), 'hoctap');
  assert.equal(khoaTra('đường'), 'duong');
  assert.equal(khoaTra('xuéxí'), 'xuexi');
  assert.equal(khoaTra('ガッコウ'), 'がっこう');
  assert.equal(khoaTra('学校'), '学校');
  assert.equal(khoaTra('lǜ'), 'lv');
  assert.equal(khoaTra("don't"), 'dont');
  assert.equal(khoaTra('が'), 'が');
});

test('pinyin số → có dấu: a/e trước, ou dấu trên o, còn lại nguyên âm cuối, thanh 5 không dấu', () => {
  assert.equal(amTietCoDau('xue2'), 'xué');
  assert.equal(amTietCoDau('hao3'), 'hǎo');
  assert.equal(amTietCoDau('dou1'), 'dōu');
  assert.equal(amTietCoDau('gui4'), 'guì');
  assert.equal(amTietCoDau('lu:4'), 'lǜ');
  assert.equal(amTietCoDau('ma5'), 'ma');
  assert.equal(amTietCoDau('Zhong1'), 'Zhōng');
  assert.equal(pinyinCoDau('xue2 xi2'), 'xuéxí');
  assert.equal(pinyinCoDau('Zhong1 guo2'), 'Zhōngguó');
});

test('romaji Hepburn: âm ghép, っ gấp đôi, ん trước nguyên âm, trường âm ー, katakana', () => {
  assert.equal(romaji('がっこう'), 'gakkou');
  assert.equal(romaji('べんきょう'), 'benkyou');
  assert.equal(romaji('ちゃ'), 'cha');
  assert.equal(romaji('まっちゃ'), 'matcha');
  assert.equal(romaji('きんえん'), "kin'en");
  assert.equal(romaji('コーヒー'), 'koohii');
  assert.equal(romaji('しんぶん'), 'shinbun');
});

import { sapHanViet } from './tuDienChuan.js';

test('Hán Việt: chọn âm theo tương ứng thanh điệu + giao Unihan/KANJIDIC (không lấy âm Nôm đứng đầu)', () => {
  assert.equal(sapHanViet(['Giáo', 'Hiệu', 'Hào'], ['chò', 'giâu', 'hiệu'], 'xiào')[0], 'hiệu');
  assert.equal(sapHanViet(['Cường', 'Cưỡng', 'Càng'], ['càng'], 'qiáng')[0], 'cường');
  assert.equal(sapHanViet(['Ế', 'Y', 'Ỷ'], ['y'], 'yī')[0], 'y');
  assert.equal(sapHanViet(['Đậu', 'Độc'], [], 'dú')[0], 'độc');
  assert.equal(sapHanViet(['Ấm', 'Ẩm', 'Hẩm'], [], 'yǐn')[0], 'ẩm');
  assert.equal(sapHanViet(['Thực', 'Tự'], [], 'shí')[0], 'thực');
  assert.equal(sapHanViet(['Học'], [], 'xué')[0], 'học');
  assert.equal(sapHanViet(['Văn', 'Vấn', 'Vặn'], [], 'wén')[0], 'văn');
  assert.equal(sapHanViet([], ['nhân'], 'rén')[0], 'nhân');
  // 期: Unihan "kì" ≡ KANJIDIC2 "Kỳ" (i/y); đọc qī lẫn qí ⇒ kỳ (huyền hợp thanh 2), hiển thị theo KANJIDIC2.
  assert.equal(sapHanViet(['Kỳ', 'Ky'], ['kì'], ['qī', 'qí'])[0], 'kỳ');
  assert.equal(sapHanViet(['Hành', 'Hạnh', 'Hàng', 'Hạng'], ['hành'], ['xíng', 'háng'])[0], 'hành');
});
