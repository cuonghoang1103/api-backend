/**
 * Kiểm thử thuật toán chia — `npm run dekiru:chia:test` (node --test, không cần thư viện).
 * Đáp án viết tay theo sách (表 p.282–289), KHÔNG sinh từ chính thuật toán.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — Node chạy thẳng tệp .ts (strip-types) nên phải ghi đuôi .ts; tsc của Next không cho.
import { ADJS, VERBS, bare, conjugate, conjugateAdj, findVerbs, reading, romajiToKana, splitTail, toRomaji } from './chia.ts';

/** [thể từ điển (chữ trần), nhóm, ます, て, た, ない] — bỏ furigana khi so. */
const CASES: [string, 1 | 2 | 3, string, string, string, string][] = [
  ['行く', 1, '行きます', '行って', '行った', '行かない'],
  ['帰る', 1, '帰ります', '帰って', '帰った', '帰らない'],
  ['飲む', 1, '飲みます', '飲んで', '飲んだ', '飲まない'],
  ['買う', 1, '買います', '買って', '買った', '買わない'],
  ['聞く', 1, '聞きます', '聞いて', '聞いた', '聞かない'],
  ['働く', 1, '働きます', '働いて', '働いた', '働かない'],
  ['読む', 1, '読みます', '読んで', '読んだ', '読まない'],
  ['休む', 1, '休みます', '休んで', '休んだ', '休まない'],
  ['ある', 1, 'あります', 'あって', 'あった', 'ない'],
  ['会う', 1, '会います', '会って', '会った', '会わない'],
  ['作る', 1, '作ります', '作って', '作った', '作らない'],
  ['入る', 1, '入ります', '入って', '入った', '入らない'],
  ['遊ぶ', 1, '遊びます', '遊んで', '遊んだ', '遊ばない'],
  ['洗う', 1, '洗います', '洗って', '洗った', '洗わない'],
  ['置く', 1, '置きます', '置いて', '置いた', '置かない'],
  ['貸す', 1, '貸します', '貸して', '貸した', '貸さない'],
  ['切る', 1, '切ります', '切って', '切った', '切らない'],
  ['話す', 1, '話します', '話して', '話した', '話さない'],
  ['持つ', 1, '持ちます', '持って', '持った', '持たない'],
  ['待つ', 1, '待ちます', '待って', '待った', '待たない'],
  ['泳ぐ', 1, '泳ぎます', '泳いで', '泳いだ', '泳がない'],
  ['急ぐ', 1, '急ぎます', '急いで', '急いだ', '急がない'],
  ['脱ぐ', 1, '脱ぎます', '脱いで', '脱いだ', '脱がない'],
  ['死ぬ', 1, '死にます', '死んで', '死んだ', '死なない'],
  ['飛ぶ', 1, '飛びます', '飛んで', '飛んだ', '飛ばない'],
  ['走る', 1, '走ります', '走って', '走った', '走らない'],
  ['知る', 1, '知ります', '知って', '知った', '知らない'],
  ['言う', 1, '言います', '言って', '言った', '言わない'],
  ['立つ', 1, '立ちます', '立って', '立った', '立たない'],
  ['なる', 1, 'なります', 'なって', 'なった', 'ならない'],
  ['食べる', 2, '食べます', '食べて', '食べた', '食べない'],
  ['見る', 2, '見ます', '見て', '見た', '見ない'],
  ['起きる', 2, '起きます', '起きて', '起きた', '起きない'],
  ['寝る', 2, '寝ます', '寝て', '寝た', '寝ない'],
  ['借りる', 2, '借ります', '借りて', '借りた', '借りない'],
  ['いる', 2, 'います', 'いて', 'いた', 'いない'],
  ['教える', 2, '教えます', '教えて', '教えた', '教えない'],
  ['着る', 2, '着ます', '着て', '着た', '着ない'],
  ['できる', 2, 'できます', 'できて', 'できた', 'できない'],
  ['浴びる', 2, '浴びます', '浴びて', '浴びた', '浴びない'],
  ['来る', 3, '来ます', '来て', '来た', '来ない'],
  ['する', 3, 'します', 'して', 'した', 'しない'],
  ['勉強する', 3, '勉強します', '勉強して', '勉強した', '勉強しない'],
  ['結婚する', 3, '結婚します', '結婚して', '結婚した', '結婚しない'],
];

const byBare = new Map(VERBS.map((v) => [bare(v.d), v]));

test('mọi động từ mẫu đều có trong danh sách của sách, đúng nhóm', () => {
  for (const [d, nhom] of CASES) {
    const v = byBare.get(d);
    assert.ok(v, `thiếu ${d}`);
    assert.equal(v!.nhom, nhom, `${d} phải là nhóm ${nhom}`);
  }
});

test('ます / て / た / ない — 44 động từ trong sách', () => {
  for (const [d, nhom, masu, te, ta, nai] of CASES) {
    const f = conjugate(byBare.get(d)!.d, nhom);
    assert.equal(bare(f.masu), masu, `${d} → ます`);
    assert.equal(bare(f.te), te, `${d} → て`);
    assert.equal(bare(f.ta), ta, `${d} → た`);
    assert.equal(bare(f.nai), nai, `${d} → ない`);
    assert.equal(bare(f.nakatta), nai.slice(0, -1) + 'かった', `${d} → なかった`);
  }
});

test('来る đổi cách đọc: きます・こない・きて', () => {
  const f = conjugate('{来|く}る', 3);
  assert.equal(reading(f.masu), 'きます');
  assert.equal(reading(f.nai), 'こない');
  assert.equal(reading(f.te), 'きて');
  assert.equal(reading(f.jisho), 'くる');
  assert.equal(f.masu, '{来|き}ます');
});

test('các thể ghép: ません・ませんでした・ましょう・たい・たら・ても・ないで', () => {
  const f = conjugate('{飲|の}む', 1);
  assert.equal(bare(f.masen), '飲みません');
  assert.equal(bare(f.masendeshita), '飲みませんでした');
  assert.equal(bare(f.mashou), '飲みましょう');
  assert.equal(bare(f.tai), '飲みたい');
  assert.equal(bare(f.tara), '飲んだら');
  assert.equal(bare(f.temo), '飲んでも');
  assert.equal(bare(f.naide), '飲まないで');
  assert.equal(bare(f.kata), '飲み方');
});

test('mọi động từ trong danh sách đều chia được, không ném lỗi', () => {
  for (const v of VERBS) {
    const f = conjugate(v.d, v.nhom);
    assert.ok(f.masu.endsWith('ます'), v.d);
    assert.ok(/[てで]$/.test(f.te), v.d);
  }
});

test('tra nhanh: kana, kanji, romaji, thể ます hay từ điển', () => {
  const one = (x: string) => findVerbs(x).map((f) => bare(f.verb.d));
  assert.deepEqual(one('飲みます'), ['飲む']);
  assert.deepEqual(one('のみます'), ['飲む']);
  assert.deepEqual(one('nomimasu'), ['飲む']);
  assert.deepEqual(one('飲む'), ['飲む']);
  assert.deepEqual(one('たべる'), ['食べる']);
  assert.deepEqual(one('ikimasu'), ['行く']);
  assert.deepEqual(one('benkyou shimasu'), ['勉強する']);
  assert.ok(one('きます').includes('来る') && one('きます').includes('着る'), 'きます = 来ます và 着ます');
  assert.deepEqual(one('帰って'), ['帰る']);
});

test('tra nhanh: từ ngoài sách thì đoán nhóm', () => {
  const g = (x: string) => findVerbs(x)[0];
  assert.equal(g('よびます').verb.nhom, 1); // 呼ぶ
  assert.equal(bare(g('よびます').verb.d), 'よぶ');
  assert.equal(g('しめる').verb.nhom, 2);
  assert.equal(g('へる').verb.nhom, 1); // ngoại lệ
  assert.equal(g('さんぽします').verb.nhom, 3);
  assert.equal(g('ダンスします').verb.nhom, 3);
  assert.deepEqual(findVerbs('xyz'), []);
});

test('romaji → kana', () => {
  assert.equal(romajiToKana('tabemasu'), 'たべます');
  assert.equal(romajiToKana('matte'), 'まって');
  assert.equal(romajiToKana('shinbun'), 'しんぶん');
  assert.equal(romajiToKana('kon\'ya'), 'こんや');
  assert.equal(romajiToKana('chotto'), 'ちょっと');
});

test('kana → romaji', () => {
  assert.equal(toRomaji('{行|い}って'), 'itte');
  assert.equal(toRomaji('{来|き}ます'), 'kimasu');
  assert.equal(toRomaji('{勉強|べんきょう}しません'), 'benkyoushimasen');
  assert.equal(toRomaji('まっちゃ'), 'matcha');
});

test('tính từ い (kể cả いい) và な', () => {
  const t = conjugateAdj('{高|たか}い', 'i');
  assert.equal(bare(t.phu), '高くないです');
  assert.equal(bare(t.qua), '高かったです');
  assert.equal(bare(t.quaPhu), '高くなかったです');
  assert.equal(bare(t.te), '高くて');
  const ii = conjugateAdj('いい', 'i');
  assert.equal(ii.phu, 'よくないです');
  assert.equal(ii.qua, 'よかったです');
  assert.equal(ii.te, 'よくて');
  const na = conjugateAdj('{静|しず}か', 'na');
  assert.equal(bare(na.phu), '静かじゃありません');
  assert.equal(bare(na.qua), '静かでした');
  assert.equal(bare(na.ffHien), '静かだ');
  assert.equal(bare(na.bn), '静かな N');
  assert.equal(ADJS.length > 20, true);
});

test('splitTail không cắt giữa furigana', () => {
  assert.deepEqual(splitTail('{飲|の}みます', '{飲|の}む'), ['{飲|の}', 'みます']);
  assert.deepEqual(splitTail('{来|き}ます', '{来|く}る'), ['', '{来|き}ます']);
  assert.deepEqual(splitTail('{食|た}べて', '{食|た}べる'), ['{食|た}べ', 'て']);
});
