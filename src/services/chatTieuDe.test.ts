import { test } from 'node:test';
import assert from 'node:assert/strict';
import { laTieuDeTam, lamSachTieuDe, sinhTieuDe, tieuDeLui } from './chatTieuDe.js';
import { docDoKy, docTenKho, luatDoKy } from './chatKhoMa.js';

test('laTieuDeTam: nhận tên máy đặt, giữ tên thật', () => {
  assert.equal(laTieuDeTam('Chat 02:07:19 10/11/2026'), true);
  assert.equal(laTieuDeTam('Trò chuyện bằng giọng nói'), true);
  assert.equal(laTieuDeTam(''), true);
  assert.equal(laTieuDeTam(null), true);
  assert.equal(laTieuDeTam('New chat'), true);
  assert.equal(laTieuDeTam('Ôn thi PRJ301'), false);
  assert.equal(laTieuDeTam('Chat với thầy về đồ án'), false);
});

test('tieuDeLui: mấy chữ đầu, bỏ markdown, viết hoa chữ đầu, NFC', () => {
  assert.equal(tieuDeLui('giải thích **useEffect** trong React giúp mình với nhé bạn ơi cảm ơn'), 'Giải thích useEffect trong React giúp mình với nhé');
  assert.equal(tieuDeLui('```js\nconsole.log(1)\n```\nlỗi gì vậy'), 'Lỗi gì vậy');
  assert.equal(tieuDeLui('   '), 'Cuộc trò chuyện mới');
  const nfd = 'quốc gia'.normalize('NFD');
  assert.equal(tieuDeLui(nfd), 'Quốc gia');
  assert.ok(tieuDeLui('a'.repeat(200)).length <= 60);
});

test('lamSachTieuDe: bỏ nhãn, ngoặc, dấu chấm; quá dài ⇒ null', () => {
  assert.equal(lamSachTieuDe('Tiêu đề: "Ôn thi SQL JOIN".'), 'Ôn thi SQL JOIN');
  assert.equal(lamSachTieuDe('**Kế hoạch học React**\nthêm dòng'), 'Kế hoạch học React');
  assert.equal(lamSachTieuDe(''), null);
  assert.equal(lamSachTieuDe('x'.repeat(120)), null);
});

test('sinhTieuDe: dùng câu model; model hỏng ⇒ tiêu đề lùi', async () => {
  const tot = await sinhTieuDe('so sánh tcp udp', 'TCP là…', async () => ({ text: 'So sánh TCP và UDP', provider: 'x', model: 'm', durationMs: 1, attempts: 1 }));
  assert.equal(tot, 'So sánh TCP và UDP');
  const hong = await sinhTieuDe('so sánh tcp udp', 'TCP là…', async () => { throw new Error('down'); });
  assert.equal(hong, 'So sánh tcp udp');
  const rong = await sinhTieuDe('so sánh tcp udp', '…', async () => ({ text: '   ', provider: 'x', model: 'm', durationMs: 1, attempts: 1 }));
  assert.equal(rong, 'So sánh tcp udp');
});

test('docTenKho: chỉ nhận owner/name hoặc link github.com', () => {
  assert.equal(docTenKho('vercel/next.js'), 'vercel/next.js');
  assert.equal(docTenKho('https://github.com/facebook/react'), 'facebook/react');
  assert.equal(docTenKho('https://github.com/facebook/react.git'), 'facebook/react');
  assert.equal(docTenKho('github.com/a-b/c_d/tree/main/src'), 'a-b/c_d');
  assert.equal(docTenKho('../../etc/passwd'), null);
  assert.equal(docTenKho('owner/name; rm -rf'), null);
  assert.equal(docTenKho(42), null);
});

test('doKy: danh sách trắng + luật', () => {
  assert.equal(docDoKy('ky'), 'ky');
  assert.equal(docDoKy('max'), undefined);
  assert.match(luatDoKy('nhanh'), /NHANH/);
  assert.equal(luatDoKy('vua'), '');
  assert.equal(luatDoKy(undefined), '');
});
