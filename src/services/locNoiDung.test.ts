/**
 * Bộ lọc nội dung (App Store 1.2) — `npx tsx --test src/services/locNoiDung.test.ts`
 * Hai nửa ngang nhau: ca PHẢI chặn và ca KHÔNG ĐƯỢC chặn. Thêm từ vào `TU_GOC` thì thêm ca ở CẢ HAI nửa.
 */
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { chanNoiDungXau, kiemNoiDung, NoiDungBiChanError } from './locNoiDung.js';

const chan = (s: string) => kiemNoiDung(s).chan;

describe('locNoiDung — chặn từ nặng', () => {
  const phaiChan: Array<[string, string]> = [
    // tiếng Anh
    ['you are a nigger', 'slur'], ['NIGGAS everywhere', 'slur'], ['n1gger', 'leetspeak'], ['niiiigger', 'chữ lặp'],
    ['shut up faggot', 'slur'], ['what a f4g', 'leet a→4'], ['retarded idea', 'slur + đuôi'],
    ['fuck this', 'tục'], ['FUCKING bug', 'đuôi -ing'], ['f*ck', 'che bằng *'], ['f**k off', 'che hai *'],
    ['fuuuuuck', 'lặp chữ'], ['f u c k', 'cách quãng'], ['f.u.c.k', 'chấm giữa'], ['fvck you', 'u→v'],
    ['motherfucker', 'ghép'], ['you cunt', 'tình dục'], ['send nudes pls', 'cụm'], ['go to pornhub', 'trang khiêu dâm'],
    ['kill yourself', 'đe doạ'], ['just kys', 'đe doạ viết tắt'], ["I'll kill you", 'nháy thẳng'],
    ['I’ll kill you tomorrow', 'nháy cong'], ['i will kill you', 'đe doạ'], ['im gonna kill you', 'đe doạ'],
    ['heil hitler', 'thù ghét'], [`f${String.fromCharCode(0x200b)}uck`, 'ký tự vô hình chen giữa'],
    // tiếng Việt có dấu
    ['đồ lồn', 'tục'], ['LỒN', 'chữ hoa'], ['cặc', 'tục'], ['mặt buồi', 'tục'], ['địt mẹ mày', 'tục'],
    ['đụ má', 'tục'], ['đéo hiểu', 'tục'], ['con đĩ', 'xúc phạm'], ['đ.c.m', 'viết tắt cách quãng'], ['đcm', 'viết tắt'],
    ['thằng bê đê', 'kỳ thị'], ['bọn khựa', 'kỳ thị'], ['tao sẽ giết mày', 'đe doạ'], ['mày đi chết đi', 'đe doạ'],
    ['tự tử đi', 'đe doạ'], ['lồnnnn', 'lặp chữ có dấu'], [`lo${String.fromCharCode(0x302, 0x300)}n`, 'dạng NFD (dấu tách rời)'],
    // tiếng Việt không dấu — chỉ những cụm không trùng từ thường
    ['dit me may', 'không dấu'], ['djt', 'teencode'], ['dit con me', 'không dấu'],
  ];
  for (const [s, ly] of phaiChan) {
    it(`chặn: ${JSON.stringify(s)} (${ly})`, () => assert.equal(chan(s), true, s));
  }
});

describe('locNoiDung — KHÔNG chặn chữ bình thường (chặn nhầm là lỗi nặng hơn lọt)', () => {
  const khongChan = [
    // tiếng Việt: các từ mà bỏ dấu sẽ trùng từ tục
    'Các bạn nhớ nộp bài trước buổi học', 'Buổi họp lớn nhất năm', 'Cái này lớn quá', 'cac ban oi buoi hop luc may gio',
    'Đeo kính vào rồi đọc', 'Du lịch Đà Lạt', 'Dù mà trời mưa vẫn đi', 'Đi chích ngừa', 'Nung gốm ở Bát Tràng',
    'Lồng đèn trung thu', 'Lon bia', 'Cặp sách mới', 'Còn các bạn thì sao?', 'con cac ban dau roi', 'Ăn các món ngon',
    'an cac mon ngon', 'Phúc ơi mai họp nhé', 'Anh Đức, chị Cúc', 'Giết thời gian bằng cách đọc sách',
    'giet may con muoi di', 'Tôi giết mấy con gián rồi', 'Từ từ đi', 'tu tu di ban', 'Định mức ĐM tháng 10',
    'Đít chai', 'Mọi người ơi', 'Đi đi mà', 'Tôi đi ngủ đây', 'Kỳ sự', 'ky su phan mem', 'Đã đủ người chưa',
    'Bê tông cốt thép', 'Ông Tàu bán hàng', 'Chém gió tí', 'quán này chém mày bao nhiêu', 'Vãi thật', 'vl luôn',
    'Học Spring Boot với PostgreSQL', 'Nứt tường rồi', 'Đứng dậy đi', 'Lỗi ở dòng 33', 'Đội ngũ dev',
    // tiếng Anh: từ chứa chuỗi tục bên trong / nghĩa khác
    'Scunthorpe United', 'assassin', 'class assessment', 'cocktail party', 'Niger and Nigeria', 'snigger',
    'a skilled spicy dish', 'Spice up the UI', 'flame retardant', 'therapist', 'Moby Dick', 'my cat is a pussycat',
    'Fukushima', 'Send me a DM', 'dm me the link', 'Visual Component Library (VCL)', 'CLM module', 'a chink in the armor',
    'skill yourself up', 'This bug will kill your process', 'kill -9 the server', 'kill the process', 'go dies hard',
    'We will ship it ago', 'shit happens', 'damn it', 'Hello world!', 'fig 3', 'f(x) = x * 2', '**bold** text',
    'Sussex', 'Dickens', 'cockpit', 'hancock', 'peacock', 'shuttlecock', 'grape', 'drape', 'rapeseed oil',
    // ký hiệu / số / rỗng
    '', '12345', '!!!', '*****************************************************', 'a b c d e f g',
  ];
  for (const s of khongChan) {
    it(`không chặn: ${JSON.stringify(s)}`, () => assert.equal(chan(s), false, s));
  }
});

describe('locNoiDung — cửa ghi + cấu hình', () => {
  afterEach(() => {
    delete process.env.CONTENT_FILTER; delete process.env.CONTENT_FILTER_EXTRA_TERMS; delete process.env.CONTENT_FILTER_ALLOW_TERMS;
  });

  it('chanNoiDungXau ném 422 CONTENT_BLOCKED, nói tên trường, KHÔNG lộ từ bị khớp', () => {
    let loi: unknown;
    try { chanNoiDungXau({ displayName: 'Cường', bio: 'fuck you all' }); } catch (e) { loi = e; }
    assert.ok(loi instanceof NoiDungBiChanError);
    const e = loi as NoiDungBiChanError;
    assert.equal(e.statusCode, 422);
    assert.equal(e.code, 'CONTENT_BLOCKED');
    assert.deepEqual(e.data, { field: 'bio', category: 'profanity' });
    assert.ok(!e.message.toLowerCase().includes('fuck'));
    assert.match(e.message, /không được phép/);
    assert.match(e.message, /aren't allowed/);
  });

  it('bỏ qua null/undefined/không phải chuỗi', () => {
    chanNoiDungXau({ a: null, b: undefined, c: 42, d: { x: 'fuck' } });
  });

  it('CONTENT_FILTER_EXTRA_TERMS thêm từ (có dấu ⇒ khớp có dấu; không dấu ⇒ khớp mọi kiểu)', () => {
    assert.equal(chan('đồ khốn nạn'), false);
    process.env.CONTENT_FILTER_EXTRA_TERMS = 'khốn nạn, spamword';
    assert.equal(chan('đồ khốn nạn'), true);
    assert.equal(chan('khon nan'), false, 'từ có dấu chỉ khớp khi viết có dấu');
    assert.equal(chan('buy SPAMWORD now'), true);
  });

  it('CONTENT_FILTER_ALLOW_TERMS gỡ một từ có sẵn', () => {
    assert.equal(chan('retarded'), true);
    process.env.CONTENT_FILTER_ALLOW_TERMS = 'retard';
    assert.equal(chan('retarded'), false);
    assert.equal(chan('fuck'), true);
  });

  it('CONTENT_FILTER=off tắt hẳn', () => {
    process.env.CONTENT_FILTER = 'off';
    assert.equal(chan('fuck'), false);
  });

  it('chuỗi dài toàn ký tự che không làm regex chạy chậm', () => {
    const s = `f${'*'.repeat(20000)}x ${'f*'.repeat(5000)}`;
    const t = Date.now();
    kiemNoiDung(s);
    assert.ok(Date.now() - t < 500, `mất ${Date.now() - t} ms`);
  });
});
