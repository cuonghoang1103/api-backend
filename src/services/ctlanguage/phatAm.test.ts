/**
 * 🎙 Luyện phát âm CT Language (15/11/2026) — luật lượt free/Pro, thiếu khoá Azure, gắn thanh tiếng Trung, gợi ý tiếng
 * Việt, đọc JSON Azure (phẳng + bọc), lõi `chamAzure` với fetch giả (không gọi mạng thật).
 *   npx tsx --test src/services/ctlanguage/phatAm.test.ts
 */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, test } from 'node:test';
import { __datLaiPhatAm, luotPhatAm, luyenPhatAm, LUOT_FREE, LUOT_PRO, type PhuThuocPhatAm } from './phatAm.js';
import { ganThanh, goiYPhatAm, tachAmTietPinyin, thanhAmTiet, type KetQuaCham } from './phatAmThuan.js';
import { chamAzure, chamPhatAm, docKetQuaAzure } from '../ielts/phatAm.service.js';

/** WAV PCM 16 kHz mono 16-bit, `giay` giây im lặng. */
function wav(giay: number): Buffer {
  const du = Math.round(16_000 * giay) * 2;
  const b = Buffer.alloc(44 + du);
  b.write('RIFF', 0); b.writeUInt32LE(36 + du, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(16_000, 24);
  b.writeUInt32LE(32_000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(du, 40);
  return b;
}

const KQ_EN: KetQuaCham = {
  diem: { chinhXac: 70, troiChay: 90, dayDu: 100, tong: 76, ngonDieu: 50 },
  ngheRa: 'I think so.',
  tu: [
    { tu: 'I', diem: 95, loi: 'None', am: [{ am: 'aɪ', diem: 95 }], amTiet: [] },
    { tu: 'think', diem: 40, loi: 'Mispronunciation', am: [{ am: 'θ', diem: 20 }, { am: 'ɪ', diem: 80 }, { am: 'ŋ', diem: 70 }, { am: 'k', diem: 60 }], amTiet: [] },
    { tu: 'so', diem: 88, loi: 'None', am: [{ am: 's', diem: 90 }, { am: 'oʊ', diem: 86 }], amTiet: [] },
  ],
};

function gia(o: { laPro?: boolean; coKhoa?: boolean; kq?: Awaited<ReturnType<PhuThuocPhatAm['cham']>> } = {}) {
  const goi: Parameters<PhuThuocPhatAm['cham']>[0][] = [];
  const pt: PhuThuocPhatAm = {
    laPro: async () => o.laPro ?? false,
    coKhoa: () => o.coKhoa ?? true,
    cham: async (x) => { goi.push(x); return o.kq ?? { ketQua: KQ_EN }; },
    bayGio: () => new Date('2026-11-15T03:00:00Z'),
  };
  return { pt, goi };
}

beforeEach(() => __datLaiPhatAm());

test('chấm được ⇒ trừ 1 lượt, en mặc định en-US + xin ngữ điệu, có gợi ý /θ/', async () => {
  const g = gia();
  const r = await luyenPhatAm(1, { audio: wav(2), cau: 'I think so.', nn: 'en' }, g.pt);
  assert.equal(r.luot.conLai, LUOT_FREE - 1);
  assert.equal(g.goi[0].lang, 'en-US');
  assert.equal(g.goi[0].ngonDieu, true);
  assert.equal(r.ketQua?.ngonNgu, 'en-US');
  assert.ok(r.goiY.some((x) => x.includes('/θ/')), r.goiY.join('\n'));
  assert.ok(r.goiY.some((x) => x.includes('Ngữ điệu')));
  assert.equal((await luotPhatAm(1, g.pt)).conLai, LUOT_FREE - 1);
  // giọng Anh ⇒ en-GB, không xin ngữ điệu
  await luyenPhatAm(1, { audio: wav(1), cau: 'hello', nn: 'en', giong: 'uk' }, g.pt);
  assert.equal(g.goi[1].lang, 'en-GB');
  assert.equal(g.goi[1].ngonDieu, false);
});

test('thiếu khoá Azure ⇒ chua_co_khoa + câu rõ ràng, KHÔNG gọi chấm, KHÔNG trừ lượt', async () => {
  const g = gia({ coKhoa: false });
  const r = await luyenPhatAm(2, { audio: wav(2), cau: 'hello', nn: 'en' }, g.pt);
  assert.equal(r.ketQua, null);
  assert.equal(r.lyDo, 'chua_co_khoa');
  assert.match(r.thongBao!, /Chấm phát âm đang tạm nghỉ/);
  assert.equal(g.goi.length, 0);
  assert.equal(r.luot.batChua, false);
  assert.equal(r.luot.conLai, LUOT_FREE);
});

test('Azure không nghe thấy / lỗi ⇒ không trừ lượt', async () => {
  const g = gia({ kq: { ketQua: null, lyDo: 'khong_nghe_thay' } });
  const r = await luyenPhatAm(3, { audio: wav(2), cau: 'hello', nn: 'en' }, g.pt);
  assert.equal(r.lyDo, 'khong_nghe_thay');
  assert.equal((await luotPhatAm(3, g.pt)).conLai, LUOT_FREE);
});

test('free hết lượt ⇒ 429 CTL_PHAT_AM_HET_LUOT, không gọi Azure; Pro trần cao hơn', async () => {
  const g = gia();
  for (let i = 0; i < LUOT_FREE; i++) await luyenPhatAm(4, { audio: wav(1), cau: 'hi', nn: 'en' }, g.pt);
  await assert.rejects(luyenPhatAm(4, { audio: wav(1), cau: 'hi', nn: 'en' }, g.pt),
    (e: { statusCode?: number; code?: string }) => e.statusCode === 429 && e.code === 'CTL_PHAT_AM_HET_LUOT');
  assert.equal(g.goi.length, LUOT_FREE);
  const p = gia({ laPro: true });
  assert.equal((await luotPhatAm(5, p.pt)).tran, LUOT_PRO);
});

test('đầu vào sai ⇒ 400: nn lạ, thiếu câu, câu dài, không phải WAV, quá 15 giây', async () => {
  const g = gia();
  const sai = async (b: Parameters<typeof luyenPhatAm>[1]) => assert.rejects(luyenPhatAm(6, b, g.pt), (e: { statusCode?: number }) => e.statusCode === 400);
  await sai({ audio: wav(1), cau: 'x', nn: 'fr' });
  await sai({ audio: wav(1), cau: '  ', nn: 'en' });
  await sai({ audio: wav(1), cau: 'a'.repeat(121), nn: 'en' });
  await sai({ audio: Buffer.from('khong phai wav'.repeat(10)), cau: 'hi', nn: 'en' });
  await sai({ audio: wav(16), cau: 'hi', nn: 'en' });
  assert.equal(g.goi.length, 0);
});

test('pinyin: thanh từ dấu / số, tách âm tiết viết liền', () => {
  assert.equal(thanhAmTiet('xué'), 2);
  assert.equal(thanhAmTiet('xue2'), 2);
  assert.equal(thanhAmTiet('ma'), 5);
  assert.equal(thanhAmTiet('学'), null);
  assert.deepEqual(tachAmTietPinyin('Wǒ xuéxí zhōngwén.'), ['wǒ', 'xué', 'xí', 'zhōng', 'wén']);
  assert.deepEqual(tachAmTietPinyin('dàngāo'), ['dàn', 'gāo']);
  assert.deepEqual(tachAmTietPinyin('xiànzài péngyou'), ['xiàn', 'zài', 'péng', 'you']);
  assert.deepEqual(tachAmTietPinyin("Xī'ān nǚ'ér"), ['xī', 'ān', 'nǚ', 'ér']);
  assert.deepEqual(tachAmTietPinyin('ni3 hao3'), ['ni3', 'hao3']);
});

test('tiếng Trung: gắn thanh theo pinyin app gửi (Azure tách TỪ nhiều chữ), chữ thấp điểm ⇒ gợi ý thanh', async () => {
  const kq: KetQuaCham = {
    diem: { chinhXac: 60, troiChay: 80, dayDu: 100, tong: 65, ngonDieu: null },
    ngheRa: '我学习中文',
    tu: [
      { tu: '我', diem: 90, loi: 'None', am: [], amTiet: [] },
      { tu: '学习', diem: 50, loi: 'Mispronunciation', am: [], amTiet: [{ amTiet: 'xue', diem: 35 }, { amTiet: 'xi', diem: 85 }] },
      { tu: '中文', diem: 88, loi: 'None', am: [], amTiet: [] },
    ],
  };
  const ct = ganThanh(kq.tu, 'wǒ xuéxí zhōngwén');
  assert.deepEqual(ct.map((c) => [c.chu, c.thanh, c.diem, c.nghiNgoThanh]),
    [['我', 3, 90, false], ['学', 2, 35, true], ['习', 2, 85, false], ['中', 1, 88, false], ['文', 2, 88, false]]);
  const gy = goiYPhatAm('zh', kq, ct);
  assert.match(gy[0], /“学” \(xué\) chỉ đạt 35 điểm — có thể sai thanh điệu.*thanh 2/);
  // Azure trả số thanh trong âm tiết ⇒ ưu tiên số đó; pinyin lệch số chữ ⇒ không gán từ pinyin.
  const az = ganThanh([{ tu: '好', diem: 40, loi: 'None', am: [], amTiet: [{ amTiet: 'hao3', diem: 40 }] }], 'a b c');
  assert.equal(az[0].thanh, 3);
  const g = gia({ kq: { ketQua: kq } });
  const r = await luyenPhatAm(7, { audio: wav(2), cau: '我学习中文', nn: 'zh', doc: 'wǒ xuéxí zhōngwén' }, g.pt);
  assert.equal(g.goi[0].lang, 'zh-CN');
  assert.equal(g.goi[0].ngonDieu, false);
  assert.equal(r.ketQua?.chuThanh.length, 5);
});

test('tiếng Nhật: mẹo trường âm / っ cho từ thấp điểm; đọc thiếu được nhắc', () => {
  const gy = goiYPhatAm('ja', {
    diem: { chinhXac: 55, troiChay: 80, dayDu: 70, tong: 60, ngonDieu: null }, ngheRa: '',
    tu: [{ tu: 'がっこう', diem: 40, loi: 'Mispronunciation', am: [], amTiet: [] }, { tu: 'です', diem: 0, loi: 'Omission', am: [], amTiet: [] }],
  });
  assert.match(gy.join('\n'), /đọc thiếu: “です”/);
  assert.match(gy.join('\n'), /trường âm.*っ là một nhịp/);
});

test('đọc JSON Azure: dạng phẳng (REST) và dạng bọc PronunciationAssessment, có âm tiết + ngữ điệu', () => {
  const phang = docKetQuaAzure({
    RecognitionStatus: 'Success', DisplayText: 'Hi.',
    NBest: [{ AccuracyScore: 81.4, FluencyScore: 90, CompletenessScore: 100, PronScore: 85.6, ProsodyScore: 70.2,
      Words: [{ Word: 'hi', AccuracyScore: 81, ErrorType: 'None', Syllables: [{ Syllable: 'haɪ', AccuracyScore: 80 }], Phonemes: [{ Phoneme: 'h', AccuracyScore: 90 }] }] }],
  })!;
  assert.deepEqual(phang.diem, { chinhXac: 81, troiChay: 90, dayDu: 100, tong: 86, ngonDieu: 70 });
  assert.deepEqual(phang.tu[0].amTiet, [{ amTiet: 'haɪ', diem: 80 }]);
  const boc = docKetQuaAzure({
    RecognitionStatus: 'Success',
    NBest: [{ Display: '好', PronunciationAssessment: { AccuracyScore: 50, FluencyScore: 60, CompletenessScore: 100, PronScore: 58 },
      Words: [{ Word: '好', PronunciationAssessment: { AccuracyScore: 50, ErrorType: 'Mispronunciation' }, Phonemes: [{ Phoneme: 'h', PronunciationAssessment: { AccuracyScore: 90 } }, { Phoneme: 'ao 3', PronunciationAssessment: { AccuracyScore: 30 } }] }] }],
  })!;
  assert.equal(boc.diem.ngonDieu, null);
  assert.equal(boc.ngheRa, '好');
  assert.equal(boc.tu[0].loi, 'Mispronunciation');
  assert.equal(ganThanh(boc.tu)[0].thanh, 3);
  assert.equal(docKetQuaAzure({ RecognitionStatus: 'NoMatch' }), null);
});

// ─── Lõi chamAzure với fetch giả ───────────────────────────────────────────────────────────────────────────────────
const fetchGoc = globalThis.fetch;
const khoaGoc = process.env.AZURE_SPEECH_KEY;
afterEach(() => { globalThis.fetch = fetchGoc; if (khoaGoc == null) delete process.env.AZURE_SPEECH_KEY; else process.env.AZURE_SPEECH_KEY = khoaGoc; });

test('chamAzure: xin ngữ điệu bị 400 ⇒ gọi lại không có ngữ điệu; header đúng ngôn ngữ; 429 ⇒ het_luot_thang', async () => {
  process.env.AZURE_SPEECH_KEY = 'khoa-gia';
  const da: { url: string; pa: Record<string, unknown> }[] = [];
  let lan = 0;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    const pa = JSON.parse(Buffer.from(String((init.headers as Record<string, string>)['Pronunciation-Assessment']), 'base64').toString());
    da.push({ url, pa });
    lan++;
    if (lan === 1) return new Response('bad', { status: 400 });
    return new Response(JSON.stringify({ RecognitionStatus: 'Success', NBest: [{ PronScore: 90, Words: [] }] }), { status: 200 });
  }) as typeof fetch;
  const r = await chamAzure({ audio: wav(1), cau: 'hello', lang: 'en-US', ngonDieu: true });
  assert.equal(r.ketQua?.diem.tong, 90);
  assert.equal(da.length, 2);
  assert.equal(da[0].pa.EnableProsodyAssessment, true);
  assert.equal(da[1].pa.EnableProsodyAssessment, undefined);
  assert.match(da[0].url, /language=en-US/);
  assert.equal(da[0].pa.PhonemeAlphabet, 'IPA');

  globalThis.fetch = (async () => new Response('', { status: 429 })) as unknown as typeof fetch;
  assert.equal((await chamAzure({ audio: wav(1), cau: 'x', lang: 'zh-CN' })).lyDo, 'het_luot_thang');
  delete process.env.AZURE_SPEECH_KEY;
  assert.equal((await chamAzure({ audio: wav(1), cau: 'x', lang: 'zh-CN' })).lyDo, 'chua_co_khoa');
});

test('chamPhatAm cũ của web: đầu ra GIỮ NGUYÊN dạng (không lộ amTiet / ngonDieu)', async () => {
  process.env.AZURE_SPEECH_KEY = 'khoa-gia';
  globalThis.fetch = (async () => new Response(JSON.stringify({
    RecognitionStatus: 'Success', DisplayText: 'Hi.',
    NBest: [{ AccuracyScore: 80, FluencyScore: 90, CompletenessScore: 100, PronScore: 85, Words: [{ Word: 'hi', AccuracyScore: 80, Phonemes: [{ Phoneme: '', AccuracyScore: 70 }] }] }],
  }), { status: 200 })) as unknown as typeof fetch;
  const r = await chamPhatAm(99, { audio: wav(1), cau: 'Hi', giong: 'uk' });
  assert.deepEqual(r, { ketQua: { diem: { chinhXac: 80, troiChay: 90, dayDu: 100, tong: 85 }, ngheRa: 'Hi.', tu: [{ tu: 'hi', diem: 80, loi: 'None', am: [{ am: '', diem: 70 }] }] } });
});

test('bản ghi không đúng WAV 16 kHz (vd từ màn Học qua video) ⇒ ffmpeg đổi về chuẩn rồi chấm, rỗng/hỏng ⇒ câu dễ hiểu', async () => {
  const { laWav16kChuan, doiWav16k } = await import('./phatAm.js');
  // WAV 44,1 kHz stereo 16-bit, 0,5 s im lặng
  const sr = 44_100, ch = 2, n = Math.floor(sr * 0.5);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + n * ch * 2, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(ch, 22); h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * ch * 2, 28); h.writeUInt16LE(ch * 2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(n * ch * 2, 40);
  const lech = Buffer.concat([h, Buffer.alloc(n * ch * 2)]);
  assert.equal(laWav16kChuan(lech), false);
  const doi = await doiWav16k(lech);
  if (doi) {   // máy có ffmpeg (ảnh backend luôn có)
    assert.equal(laWav16kChuan(doi), true);
  }
  assert.equal(await doiWav16k(Buffer.from('khong phai am thanh')), null);
  assert.equal(await doiWav16k(Buffer.alloc(0)), null);
});
