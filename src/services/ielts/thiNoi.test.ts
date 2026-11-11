/**
 * Phòng thi Speaking — phần thuần: làm tròn band tổng, quy band Azure, ghép P, cắt WAV, chuẩn JSON model.
 * `npx tsx --test src/services/ielts/thiNoi.test.ts`
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lamTronXuongNua, bandTuAzure, diemAzureTong, catWav, giayWav, chuanKetQuaNoi, ketQuaImLang, type BanGhiVao } from './thiNoi.service.js';

test('band tổng Speaking làm tròn XUỐNG .5 (mục 4.3)', () => {
  assert.equal(lamTronXuongNua(6.75), 6.5);
  assert.equal(lamTronXuongNua(6.25), 6);
  assert.equal(lamTronXuongNua(6.5), 6.5);
  assert.equal(lamTronXuongNua(9.4), 9);
});

test('điểm Azure → band P', () => {
  assert.equal(bandTuAzure(95), 8);
  assert.equal(bandTuAzure(84), 7);
  assert.equal(bandTuAzure(70), 5.5);
  assert.equal(bandTuAzure(10), 3.5);
});

test('điểm Azure tổng: nặng theo số từ, 70 % chính xác + 30 % trôi chảy; không Azure ⇒ null', () => {
  const bg: BanGhiVao[] = [
    { part: 1, cau: 'a', transcript: 'x', phatAm: { chinhXac: 80, troiChay: 60, tong: 75, soTu: 10 } },
    { part: 2, cau: 'b', transcript: 'y', phatAm: { chinhXac: 90, troiChay: 90, tong: 90, soTu: 30 } },
    { part: 3, cau: 'c', transcript: '', phatAm: null },
  ];
  // câu 1: 74 × 10 = 740; câu 2: 90 × 30 = 2700 ⇒ 3440 / 40 = 86
  assert.equal(diemAzureTong(bg), 86);
  assert.equal(diemAzureTong([{ part: 1, cau: 'a', transcript: 'x', phatAm: null }]), null);
});

test('cắt WAV lấy N giây đầu, sửa header; WAV ngắn hơn thì giữ nguyên', () => {
  const rate = 16000, byteRate = rate * 2;
  const giay = 3;
  const data = Buffer.alloc(byteRate * giay);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(byteRate, 28);
  h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  const wav = Buffer.concat([h, data]);
  assert.equal(giayWav(wav), 3);
  const cat = catWav(wav, 1);
  assert.equal(giayWav(cat), 1);
  assert.equal(cat.readUInt32LE(40), byteRate);
  assert.equal(cat.readUInt32LE(4), 36 + byteRate);
  assert.equal(catWav(wav, 10), wav);
  assert.equal(giayWav(Buffer.from('not a wav at all, definitely not, no way jose 1234567')), null);
});

test('chuẩn hoá JSON model: kẹp band, P ghép Azure, band tổng floor .5, lọc lỗi rỗng', () => {
  const bg: BanGhiVao[] = [
    { part: 1, cau: 'Where do you live?', transcript: 'I live in Hanoi with my family', giay: 12, phatAm: { chinhXac: 84, troiChay: 84, tong: 84, soTu: 7 } },
    { part: 2, cau: 'Describe a person', transcript: 'My teacher is very kind and she teach me a lot', giay: 90, phatAm: { chinhXac: 84, troiChay: 84, tong: 84, soTu: 10 } },
  ];
  const raw = {
    fc: { band: 6, nhanXet: 'Nói đủ dài.' }, lr: { band: 5.5, nhanXet: 'Từ quen.' }, gra: { band: 5, nhanXet: "'she teach' sai chia động từ." },
    p: { band: 6, nhanXet: 'ước lượng' }, nhanXet: 'Tổng.',
    loi: [{ part: 2, goc: 'she teach me', sua: 'she teaches me', vi: 'ngôi thứ ba' }, { part: 1, goc: '', sua: 'x', vi: '' }],
    noiLai: [{ part: 2, cau: 'Describe a person', goc: 'My teacher is very kind', tot: 'My teacher is incredibly patient…' }],
  };
  const kq = chuanKetQuaNoi(raw, bg);
  // Azure 84 ⇒ band 7; P = (6 + 7) / 2 = 6.5
  assert.equal(kq.tieuChi.p, 6.5);
  assert.equal(kq.pNguon, 'azure+ai');
  // (6 + 5.5 + 5 + 6.5) / 4 = 5.75 ⇒ floor .5 = 5.5
  assert.equal(kq.band, 5.5);
  assert.equal(kq.loi.length, 1);
  assert.equal(kq.noiLai.length, 1);
  // Không Azure: P của model giữ nguyên.
  const kq2 = chuanKetQuaNoi(raw, bg.map((b) => ({ ...b, phatAm: null })));
  assert.equal(kq2.tieuChi.p, 6);
  assert.equal(kq2.pNguon, 'ai');
  // Model không cho P ⇒ TB(FC,LR,GRA) − 0.5 làm tròn xuống.
  const kq3 = chuanKetQuaNoi({ ...raw, p: undefined }, bg.map((b) => ({ ...b, phatAm: null })));
  assert.equal(kq3.tieuChi.p, 5);
  assert.throws(() => chuanKetQuaNoi({ fc: { band: 6 } }, bg), /thiếu tiêu chí/);
});

test('bài im lặng ⇒ band 3.0 mọi tiêu chí', () => {
  const kq = ketQuaImLang([{ part: 1, cau: 'a', transcript: '' }, { part: 1, cau: 'b', transcript: 'yes' }]);
  assert.equal(kq.band, 3);
  assert.deepEqual(kq.tieuChi, { fc: 3, lr: 3, gra: 3, p: 3 });
  assert.match(kq.nhanXet, /1\/2 câu/);
});
