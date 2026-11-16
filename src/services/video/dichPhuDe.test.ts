/**
 * Dịch phụ đề video tự thêm theo lô (CT Language, 16/11/2026) — bằng phụ thuộc GIẢ (không AI, không CSDL).
 *   npx tsx --test src/services/video/dichPhuDe.test.ts
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { chonLo, chuanMangDich, dichTiep, docKetQua, loiGui, _datLaiDich, LO, TRAN_FREE, type PhuThuocDich } from './dichPhuDe.js';

const cues = Array.from({ length: 100 }, (_, i) => ({ t: i * 2, en: `文${i}。` }));

function gia(over: Partial<PhuThuocDich> & { dichVi?: unknown; banCho?: Array<{ cues: unknown; dichVi: unknown }> } = {}) {
  const st = { dichVi: over.dichVi ?? null as unknown, luu: 0, goi: 0, cau: [] as string[] };
  const pt: PhuThuocDich = {
    docVideo: async () => ({ id: 7, userId: 1, nguon: 'youtube', videoId: 'abcdefghijk', lang: 'zh', cues, dichVi: st.dichVi }),
    timBanCho: async () => over.banCho ?? [],
    luu: async (_id, d) => { st.dichVi = d; st.luu++; },
    laPro: async () => false,
    goiAi: async ({ user }) => {
      st.goi++; st.cau.push(user);
      const so = [...user.matchAll(/^(\d+): /gm)].map((m) => Number(m[1]));
      return JSON.stringify({ d: so.map((i) => ({ i, v: `Câu ${i}` })) });
    },
    bayGio: () => new Date('2026-11-16T03:00:00Z'),
    ...over,
  };
  return { st, pt };
}

beforeEach(() => _datLaiDich());

test('chuanMangDich + chonLo: bắt đầu từ chỗ đang xem rồi vòng về đầu', () => {
  assert.deepEqual(chuanMangDich(['a', 3, null], 4), ['a', '', '', '']);
  const d = chuanMangDich(null, 10);
  d[8] = 'x';
  assert.deepEqual(chonLo(d, 7, 4), [0, 1, 7, 9]);
});

test('docKetQua: chỉ nhận chỉ số đã giao, bỏ rác', () => {
  const m = docKetQua('```json\n{"d":[{"i":3,"v":" Xin chào "},{"i":99,"v":"lạ"},{"i":4,"v":""},{"i":"5","v":"năm"}]}\n```', [3, 4, 5]);
  assert.deepEqual([...m], [[3, 'Xin chào'], [5, 'năm']]);
  assert.equal(docKetQua('không phải JSON', [1]).size, 0);
});

test('loiGui: có ngữ cảnh trước, đánh số dòng', () => {
  const s = loiGui(cues, [5, 6]);
  assert.match(s, /Ngữ cảnh ngay trước \(KHÔNG dịch\): 文3。 文4。/);
  assert.match(s, /^5: 文5。$/m);
});

test('dichTiep: dịch một lô quanh chỗ đang xem, lưu lại, lần sau không dịch lại câu đã có', async () => {
  const { st, pt } = gia();
  const r1 = await dichTiep(1, 7, 50, pt);
  assert.equal(r1.moi.length, LO);
  assert.equal(r1.moi[0][0], 50);
  assert.equal(r1.daDich, LO);
  assert.equal(r1.xong, false);
  assert.equal(st.luu, 1);
  const r2 = await dichTiep(1, 7, 50, pt);
  assert.ok(r2.moi.every(([i]) => i >= 90 || i < 50), 'không dịch lại 50–89');
  assert.equal(st.goi, 2);
  await dichTiep(1, 7, 0, pt);
  const r4 = await dichTiep(1, 7, 0, pt);
  assert.equal(r4.xong, true);
  assert.equal(st.goi, 3, 'đủ 100 câu sau 3 lô — lượt thứ tư không gọi AI');
});

test('dichTiep: lấy lại bản dịch của người khác khi phụ đề y hệt (không gọi AI)', async () => {
  const banCho = [{ cues, dichVi: cues.map((_, i) => `Có sẵn ${i}`) }];
  const { st, pt } = gia({ banCho });
  const r = await dichTiep(1, 7, 0, pt);
  assert.equal(r.xong, true);
  assert.equal(st.goi, 0);
  // Phụ đề KHÁC (YouTube đã sửa) ⇒ không lấy.
  const { st: st2, pt: pt2 } = gia({ banCho: [{ cues: cues.slice(1), dichVi: ['x'] }] });
  await dichTiep(1, 7, 0, pt2);
  assert.equal(st2.goi, 1);
});

test('dichTiep: trần câu/ngày của bản miễn phí ⇒ 429, AI lỗi ⇒ hoàn lượt', async () => {
  const hong = gia({ goiAi: async () => { throw new Error('mạng'); } });
  await assert.rejects(dichTiep(1, 7, 0, hong.pt), (e: { statusCode?: number }) => e.statusCode === 503);
  // Lượt bị hoàn: dịch đủ TRAN_FREE câu trên nhiều video vẫn được.
  const lon = Array.from({ length: TRAN_FREE + 50 }, (_, i) => ({ t: i, en: `s${i}` }));
  const st = { dichVi: null as unknown };
  const { pt } = gia({ docVideo: async () => ({ id: 8, userId: 1, nguon: 'youtube', videoId: 'abcdefghijk', lang: 'en', cues: lon, dichVi: st.dichVi }) });
  pt.luu = async (_id, d) => { st.dichVi = d; };
  let tong = 0;
  for (let k = 0; k < 40; k++) {
    try { tong += (await dichTiep(1, 8, 0, pt)).moi.length; } catch (e) {
      assert.equal((e as { code?: string }).code, 'VIDEO_DICH_HET_LUOT');
      break;
    }
  }
  assert.equal(tong, TRAN_FREE);
});
