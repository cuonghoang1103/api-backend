/**
 * Bài học AI — phần thuần (danh mục gợi ý, lời nhắc, kiểm JSON model). `npx tsx --test src/services/ctlanguage/baiAiThuan.test.ts`
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { GOI_Y, TRINH_DO, docTrinhDo, kiemBaiAi, nhacBaiAi, romajiCau, tenGoiCuongMini, toanBoChu, type NoiDungBaiAi } from './baiAiThuan.js';

export function baiMau(nn: 'zh' | 'ja' | 'en', soTu = 12) {
  const tu = Array.from({ length: soTu }, (_, i) => ({
    chu: nn === 'zh' ? `词${i}` : nn === 'ja' ? `語${i}` : `word${i}`, doc: nn === 'ja' ? 'ご' : nn === 'zh' ? 'cí' : '/wɜːd/',
    nghia: `nghĩa ${i}`, loai: 'danh từ', viDu: 'ví dụ', viDuDoc: nn === 'ja' ? 'わたし は がくせい です' : 'wǒ shì xuésheng', viDuNghia: 'dịch',
  }));
  return {
    tieuDe: 'Phỏng vấn ở công xưởng', tieuDeGoc: nn === 'zh' ? '工厂面试' : 'Factory interview', moTa: 'Học xong trả lời được phỏng vấn.',
    tuVung: tu,
    hoiThoai: { boiCanh: 'Phòng nhân sự', vai: [{ ma: 'A', ten: 'Người phỏng vấn' }, { ma: 'B', ten: 'Bạn' }],
      cau: Array.from({ length: 8 }, (_, i) => ({ vai: i % 2 ? 'B' : 'A', chu: `câu ${i}`, doc: 'わたし は', nghia: `dịch ${i}` })) },
    mauCau: Array.from({ length: 4 }, (_, i) => ({ mau: `mẫu ${i}`, giaiThich: 'giải thích', viDu: 'ví dụ', viDuDoc: 'わたし へ', viDuNghia: 'dịch' })),
    quiz: Array.from({ length: 6 }, (_, i) => ({ hoi: `câu hỏi ${i}`, luaChon: ['a', 'b', 'c', 'd'], dapAn: i % 4, giaiThich: 'vì' })),
    goiYNoi: 'Luyện tự giới thiệu kinh nghiệm.',
  };
}

test('danh mục: ≥ 30 bài gợi ý mỗi ngôn ngữ, mã không trùng, trình độ hợp lệ', () => {
  for (const nn of ['en', 'ja', 'zh'] as const) {
    const ds = GOI_Y[nn];
    assert.ok(ds.length >= 30, `${nn}: ${ds.length}`);
    assert.equal(new Set(ds.map((g) => g.ma)).size, ds.length, `${nn} trùng mã`);
    for (const g of ds) {
      assert.ok(TRINH_DO[nn].some((t) => t.ma === g.trinhDo), `${nn}/${g.ma}: ${g.trinhDo}`);
      assert.ok(/^[a-z0-9-]+$/.test(g.ma));
    }
  }
  assert.equal(docTrinhDo('zh', 'HSK 3'), 'hsk3');
  assert.equal(docTrinhDo('ja', 'N9'), null);
});

test('lời nhắc ép JSON, nói đúng trình độ và cách đọc theo ngôn ngữ', () => {
  const zh = nhacBaiAi('zh', 'hsk3');
  assert.match(zh, /HSK 3/);
  assert.match(zh, /pinyin CÓ DẤU THANH/);
  assert.match(zh, /DUY NHẤT MỘT ĐỐI TƯỢNG JSON/);
  assert.match(nhacBaiAi('ja', 'n4'), /hiragana/);
  assert.match(nhacBaiAi('en', 'b1'), /IPA/);
});

test('kiemBaiAi: bài đủ phần ⇒ sạch; ja có romaji; trợ từ は/へ đọc wa/e', () => {
  const r = kiemBaiAi(baiMau('ja'), 'ja') as NoiDungBaiAi;
  assert.ok(r && 'tuVung' in r);
  assert.equal(r.tuVung.length, 12);
  assert.equal(r.tuVung[0]!.viDuRomaji, 'watashi wa gakusei desu');
  assert.equal(r.mauCau[0]!.viDuRomaji, 'watashi e');
  assert.equal(romajiCau('とうきょう へ いきます'), 'toukyou e ikimasu');
  const en = kiemBaiAi(baiMau('en'), 'en') as NoiDungBaiAi;
  assert.equal(en.tuVung[0]!.viDuDoc, '', 'tiếng Anh không phiên âm câu');
});

test('kiemBaiAi: thiếu phần cốt lõi ⇒ null; quiz sai đáp án bị bỏ; từ trùng bị gộp; từ chối ⇒ lý do', () => {
  assert.equal(kiemBaiAi(baiMau('zh', 9), 'zh'), null, '< 10 từ');
  const b = baiMau('zh');
  b.quiz = b.quiz.map((q, i) => (i < 2 ? { ...q, dapAn: 7 } : q));
  assert.equal(kiemBaiAi(b, 'zh'), null, 'còn 4 câu quiz hợp lệ < 5');
  const c = baiMau('zh', 14);
  c.tuVung[13]!.chu = c.tuVung[0]!.chu;
  c.quiz[0]!.luaChon = ['a', 'a', 'b', 'c'];
  const r = kiemBaiAi(c, 'zh') as NoiDungBaiAi;
  assert.equal(r.tuVung.length, 13);
  assert.equal(r.quiz.length, 5);
  const d = baiMau('zh');
  d.hoiThoai.vai = [{ ma: 'A', ten: 'Một mình' }];
  assert.equal(kiemBaiAi(d, 'zh'), null, 'hội thoại cần 2 vai');
  assert.deepEqual(kiemBaiAi({ tuChoi: 'Chủ đề không phù hợp.' }, 'zh'), { tuChoi: 'Chủ đề không phù hợp.' });
  assert.equal(kiemBaiAi('chuỗi', 'zh'), null);
  assert.equal(kiemBaiAi([1, 2], 'zh'), null);
});

test('tên chủ đề gọi CuongMini ≤ 160 ký tự, có từ của bài; toàn bộ chữ gom đủ để lọc', () => {
  const r = kiemBaiAi(baiMau('zh'), 'zh') as NoiDungBaiAi;
  const t = tenGoiCuongMini('đi phỏng vấn', r);
  assert.ok(t.length <= 160);
  assert.match(t, /词0/);
  const all = toanBoChu(r);
  assert.match(all, /câu hỏi 5/);
  assert.match(all, /Phòng nhân sự/);
});
