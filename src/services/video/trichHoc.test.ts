/**
 * Thẻ học từ video (CT Language, 16/11/2026) — phụ thuộc GIẢ (không AI, không CSDL).
 *   npx tsx --test src/services/video/trichHoc.test.ts
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { chonDoan, coTrongDoan, docTrich, trichHoc, _datLaiTrich, TRAN_FREE, TRAN_KY_TU, type PhuThuocTrich } from './trichHoc.js';

const cues = [
  { t: 1, en: 'すみません、コーヒーを一つください。' },
  { t: 4, en: '店内でお召し上がりですか。' },
  { t: 8, en: 'いいえ、持ち帰りでお願いします。' },
];
const dich = ['Xin lỗi, cho tôi một ly cà phê.', 'Dùng tại quán ạ?', ''];

beforeEach(() => _datLaiTrich());

test('chonDoan: câu · đoạn (≤ 20) · cả video rải đều trong trần', () => {
  assert.deepEqual(chonDoan(cues, 'cau', 2), { khoa: 'cau:2-2', dong: [2] });
  assert.deepEqual(chonDoan(cues, 'cau', 99), { khoa: 'cau:2-2', dong: [2] });
  assert.deepEqual(chonDoan(cues, 'doan', 2, 0), { khoa: 'doan:0-2', dong: [0, 1, 2] });
  const dai = Array.from({ length: 100 }, (_, i) => ({ t: i, en: `câu ${i}` }));
  assert.equal(chonDoan(dai, 'doan', 0, 99).dong.length, 20);
  assert.equal(chonDoan(cues, 'video').dong.length, 3);
  const rat = Array.from({ length: 1000 }, (_, i) => ({ t: i, en: 'x'.repeat(60) + i }));
  const v = chonDoan(rat, 'video');
  assert.ok(v.dong.length > 30 && v.dong.length < 100);
  assert.ok(v.dong[v.dong.length - 1] > 800, 'rải tới cuối video');
  assert.ok(v.dong.reduce((s, i) => s + rat[i].en.length + 8, 0) <= TRAN_KY_TU);
});

test('coTrongDoan: bám chữ của đoạn, cho phép dạng chia', () => {
  assert.equal(coTrongDoan('持ち帰り', cues[2].en, 'ja'), true);
  assert.equal(coTrongDoan('召し上がる', cues[1].en, 'ja'), true);
  assert.equal(coTrongDoan('寿司', cues[1].en, 'ja'), false);
  assert.equal(coTrongDoan('go', 'We went home', 'en'), false);
  assert.equal(coTrongDoan('borrow', 'She borrowed three books', 'en'), true);
  assert.equal(coTrongDoan('elephant', 'She borrowed three books', 'en'), false);
});

test('docTrich: ví dụ lấy từ CHÍNH phụ đề theo số dòng, bỏ từ bịa + số dòng ngoài đoạn', () => {
  const tho = '```json\n' + JSON.stringify({
    tu: [
      { chu: '持ち帰り', goc: null, doc: 'もちかえり', nghia: 'mang về', tuLoai: 'danh từ', cap: 'N3', i: 2 },
      { chu: '寿司', doc: 'すし', nghia: 'sushi', i: 1 },
      { chu: 'お召し上がり', goc: '召し上がる', doc: 'めしあがる', nghia: 'dùng (kính ngữ)', i: 77 },
    ],
    nguPhap: [{ mau: 'お～ください', giai: 'Cách nói lịch sự', cap: 'N4', i: 0 }, { mau: 'x', giai: '' }],
  }) + '\n```';
  const r = docTrich(tho, cues, dich, [0, 1, 2], 'ja', 'doan');
  assert.deepEqual(r.tu.map((x) => x.chu), ['持ち帰り', '召し上がる']);
  assert.equal(r.tu[0].vd, cues[2].en);
  assert.equal(r.tu[0].t, 8);
  assert.equal(r.tu[1].i, 1, 'số dòng sai ⇒ tự tìm dòng chứa từ');
  assert.equal(r.tu[1].vdDich, 'Dùng tại quán ạ?');
  assert.equal(r.nguPhap.length, 1);
  assert.equal(r.nguPhap[0].vd, cues[0].en);
  assert.deepEqual(docTrich('không phải JSON', cues, dich, [0], 'ja', 'cau'), { tu: [], nguPhap: [] });
});

function gia(over: Partial<PhuThuocTrich> = {}) {
  const st = { trich: null as unknown, goi: 0 };
  const pt: PhuThuocTrich = {
    docVideo: async () => ({ id: 5, nguon: 'youtube', videoId: 'abcdefghijk', lang: 'ja', cues, dichVi: dich, trichHoc: st.trich }),
    timBanCho: async () => [],
    luu: async (_id, t) => { st.trich = t; },
    laPro: async () => false,
    goiAi: async () => { st.goi++; return JSON.stringify({ tu: [{ chu: 'ください', nghia: 'xin hãy cho', i: 0 }], nguPhap: [{ mau: '～てください', giai: 'nhờ', i: 0 }] }); },
    bayGio: () => new Date('2026-11-16T03:00:00Z'),
    ...over,
  };
  return { st, pt };
}

test('trichHoc: lưu theo khoá phạm vi ⇒ lần hai không gọi AI', async () => {
  const { st, pt } = gia();
  const a = await trichHoc(1, 5, { phamVi: 'cau', tu: 0 }, pt);
  assert.equal(a.tuBoNho, false);
  assert.equal(a.tu[0].vd, cues[0].en);
  const b = await trichHoc(1, 5, { phamVi: 'cau', tu: 0 }, pt);
  assert.equal(b.tuBoNho, true);
  assert.equal(st.goi, 1);
  await trichHoc(1, 5, { phamVi: 'video' }, pt);
  assert.equal(st.goi, 2);
  assert.deepEqual(Object.keys(st.trich as object).sort(), ['cau:0-0', 'video']);
});

test('trichHoc: dùng lại thẻ của người khác cùng video + cùng phụ đề', async () => {
  const cu = { 'cau:1-1': { tu: [{ chu: 'x' }], nguPhap: [], luc: 1 } };
  const { st, pt } = gia({ timBanCho: async () => [{ cues, trichHoc: cu }] });
  const r = await trichHoc(1, 5, { phamVi: 'cau', tu: 1 }, pt);
  assert.equal(r.tuBoNho, true);
  assert.equal(st.goi, 0);
});

test('trichHoc: trần lượt/ngày bản miễn phí, AI lỗi ⇒ hoàn lượt', async () => {
  const hong = gia({ goiAi: async () => { throw new Error('mạng'); } });
  await assert.rejects(trichHoc(1, 5, { phamVi: 'cau', tu: 0 }, hong.pt), (e: { statusCode?: number }) => e.statusCode === 503);
  const { pt } = gia();
  let ok = 0;
  for (let k = 0; k < TRAN_FREE + 3; k++) {
    try { await trichHoc(1, 5, { phamVi: 'doan', tu: 0, den: k % 3 }, { ...pt, docVideo: async () => ({ id: 5, nguon: 'y', videoId: 'v', lang: 'ja', cues, dichVi: dich, trichHoc: null }) }); ok++; }
    catch (e) { assert.equal((e as { code?: string }).code, 'VIDEO_TRICH_HET_LUOT'); break; }
  }
  assert.equal(ok, TRAN_FREE);
});
