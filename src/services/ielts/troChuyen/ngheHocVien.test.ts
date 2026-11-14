import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canEpNgonNgu, laCauBia, maNgonNgu, ngheHocVien } from './ngheHocVien.js';
import { ssmlGiongViet } from '../goiGiaSu.service.js';

test('câu phụ đề Whisper bịa ra bị loại, câu thật giữ lại', () => {
  for (const t of ['Thank you for watching.', 'Thanks for watching!', 'ご視聴ありがとうございました', 'チャンネル登録よろしくお願いします',
    '请不吝点赞 订阅 转发 打赏支持明镜与点点栏目', '谢谢观看', 'Cảm ơn các bạn đã xem video', 'Продолжение следует...', '[音楽]', '。。。', ''])
    assert.equal(laCauBia(t), true, t);
  for (const t of ['わたしはリンです。', 'はい', '我叫林。', 'Thank you.', 'I like play football', 'Mình chưa hiểu câu này'])
    assert.equal(laCauBia(t), false, t);
  assert.equal(laCauBia('わたしはリンです。', { noSpeechProb: 0.9 }), true, 'Whisper tự nhận không có tiếng người');
});

test('ép ngôn ngữ chỉ khi dò ra thứ tiếng khác ngoại ngữ đang học và tiếng Việt', () => {
  assert.equal(maNgonNgu('Japanese'), 'ja');
  assert.equal(canEpNgonNgu('english', 'ja'), true);
  assert.equal(canEpNgonNgu('japanese', 'ja'), false);
  assert.equal(canEpNgonNgu('vietnamese', 'ja'), false);
  assert.equal(canEpNgonNgu(undefined, 'zh'), false);
  assert.equal(canEpNgonNgu('chinese', 'en'), true);
});

test('dò lệch ⇒ nghe lại với language ép; câu bịa ⇒ chuỗi rỗng', async () => {
  const goi: string[] = [];
  const gia = async (_a: Buffer, _t: string, _m: string, o: { language: string }) => {
    goi.push(o.language);
    return o.language === 'ja'
      ? { text: 'わたしは リンです', provider: 'groq' as const, language: 'japanese', noSpeechProb: 0.05 }
      : { text: 'Watashi wa rin desu', provider: 'groq' as const, language: 'english', noSpeechProb: 0.05 };
  };
  assert.equal(await ngheHocVien(Buffer.from('x'), 'noi.mp4', 'audio/mp4', 'お名前は？', 'ja', gia), 'わたしは リンです');
  assert.deepEqual(goi, ['', 'ja']);

  const imLang = async () => ({ text: 'Thank you for watching.', provider: 'groq' as const, language: 'english', noSpeechProb: 0.2 });
  assert.equal(await ngheHocVien(Buffer.from('x'), 'noi.mp4', 'audio/mp4', '', 'ja', imLang), '');

  const tiengViet = async () => ({ text: 'Câu này nghĩa là gì vậy', provider: 'groq' as const, language: 'vietnamese', noSpeechProb: 0.1 });
  assert.equal(await ngheHocVien(Buffer.from('x'), 'noi.mp4', 'audio/mp4', '', 'zh', tiengViet), 'Câu này nghĩa là gì vậy');
});

test('SSML giọng Việt bản xứ: phần Việt = Hoài My, phần ngoại ngữ = giọng bản xứ, thoát ký tự XML', () => {
  const s = ssmlGiongViet('Bạn nói tên mình nhé: [en]わたしは〇〇です。[/en] Thử nào <3', 'hoai-my', 'ja');
  assert.match(s, /<voice name="vi-VN-HoaiMyNeural">.*Bạn nói tên mình nhé/);
  assert.match(s, /<voice name="ja-JP-NanamiNeural">.*わたしは〇〇です。/);
  assert.match(s, /Thử nào &lt;3/);
  assert.equal((s.match(/<voice /g) ?? []).length, 3);
  assert.match(ssmlGiongViet('Chào bạn', 'nam-minh', 'zh'), /vi-VN-NamMinhNeural/);
});
