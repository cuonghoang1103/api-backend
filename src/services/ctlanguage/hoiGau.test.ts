/**
 * 🐻 Gấu trợ lý theo màn (15/11/2026) — luật lượt free/Pro, lọc chữ người dùng + câu AI, ngữ cảnh + bạn đồng hành trong
 * lời nhắc, cắt lịch sử, báo cáo câu trả lời AI (4.7). Không gọi AI, không CSDL — phụ thuộc giả.
 *   npx tsx --test src/services/ctlanguage/hoiGau.test.ts
 */
import { strict as assert } from 'node:assert';
import { beforeEach, test } from 'node:test';
import {
  __datLaiHoiGau, baoCaoHoiGau, docLichSu, docNguCanh, hoiGau, LICH_SU_TOI_DA, LUOT_HOI_FREE, LUOT_HOI_PRO, luotHoiGau, nhacHoiGau,
  type PhuThuocHoi,
} from './hoiGau.js';

type Goi = Parameters<PhuThuocHoi['goi']>[0];
function gia(o: { laPro?: boolean; tra?: string | (() => string); loi?: boolean } = {}) {
  const goi: Goi[] = [];
  const bao: { tieuDe: string; noiDung: string; khoaChongTrung: string }[] = [];
  const pt: PhuThuocHoi = {
    laPro: async () => o.laPro ?? false,
    goi: async (x) => {
      goi.push(x);
      if (o.loi) throw new Error('cổng sập');
      return typeof o.tra === 'function' ? o.tra() : o.tra ?? '**Được** dùng khi…\n# Tiêu đề\n• ví dụ';
    },
    baoAdmin: async (tb) => { bao.push(tb); return {}; },
    bayGio: () => new Date('2026-11-15T03:00:00Z'),
  };
  return { pt, goi, bao };
}
const nguCanhTu = { loai: 'tu', tieuDe: '学习 (xuéxí)', noiDung: 'Nghĩa: học tập. Ví dụ: 我在学习中文。' };

beforeEach(() => __datLaiHoiGau());

test('trả lời sạch Markdown nặng + ngữ cảnh và bạn đồng hành nằm trong lời nhắc', async () => {
  const g = gia();
  const r = await hoiGau(1, { nn: 'zh', banDongHanh: 'meo', nguCanh: nguCanhTu, cau: 'Giải thích từ này' }, g.pt);
  assert.equal(r.traLoi, 'Được dùng khi…\nTiêu đề\n• ví dụ');
  assert.equal(r.luot.conLai, LUOT_HOI_FREE - 1);
  assert.match(g.goi[0].system, /Mèo Miu/);
  assert.match(g.goi[0].system, /学习 \(xuéxí\)/);
  assert.match(g.goi[0].system, /mục từ trong từ điển/);
  assert.match(g.goi[0].system, /pinyin/);
  assert.deepEqual(g.goi[0].messages.at(-1), { role: 'user', content: 'Giải thích từ này' });
});

test('bạn đồng hành lạ ⇒ Gấu CuongMini; loại ngữ cảnh lạ ⇒ khac; ngữ cảnh dài bị cắt', () => {
  assert.match(nhacHoiGau('en', 'rong', docNguCanh({ loai: 'xx', noiDung: 'a'.repeat(5000) })), /Gấu CuongMini/);
  const nc = docNguCanh({ loai: 'xx', noiDung: 'a'.repeat(5000) });
  assert.equal(nc.loai, 'khac');
  assert.equal(nc.noiDung.length, 3000);
});

test('lịch sử: chỉ giữ lượt cuối, lượt đầu luôn là người dùng, bỏ vai lạ', () => {
  const ds = Array.from({ length: 15 }, (_, i) => ({ vai: i % 2 ? 'gau' : 'nguoi', noiDung: `c${i}` }));
  const r = docLichSu([...ds, { vai: 'admin', noiDung: 'x' }, { vai: 'nguoi', noiDung: '' }]);
  assert.ok(r.length <= LICH_SU_TOI_DA);
  assert.equal(r[0].vai, 'nguoi');
  assert.equal(r.at(-1)!.noiDung, 'c14');
});

test('free hết lượt ⇒ 429 CTL_HOI_HET_LUOT, không gọi AI; Pro trần cao hơn', async () => {
  const g = gia();
  for (let i = 0; i < LUOT_HOI_FREE; i++) await hoiGau(2, { nn: 'en', nguCanh: nguCanhTu, cau: `Câu ${i}` }, g.pt);
  await assert.rejects(hoiGau(2, { nn: 'en', nguCanh: nguCanhTu, cau: 'Nữa' }, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_HET_LUOT');
  assert.equal(g.goi.length, LUOT_HOI_FREE);
  const p = gia({ laPro: true });
  assert.equal((await luotHoiGau(3, p.pt)).tran, LUOT_HOI_PRO);
});

test('AI lỗi ⇒ 503 và HOÀN lượt', async () => {
  const g = gia({ loi: true });
  await assert.rejects(hoiGau(4, { nn: 'ja', nguCanh: nguCanhTu, cau: 'Cho thêm ví dụ' }, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_AI_LOI');
  assert.equal((await luotHoiGau(4, g.pt)).conLai, LUOT_HOI_FREE);
});

test('lọc: câu hỏi / lượt cũ của người dùng có từ xấu ⇒ 422, không gọi AI; câu AI lọt từ xấu ⇒ chặn + hoàn lượt', async () => {
  const g = gia();
  await assert.rejects(hoiGau(5, { nn: 'en', nguCanh: nguCanhTu, cau: 'kill yourself' }, g.pt), (e: { code?: string }) => e.code === 'CONTENT_BLOCKED');
  await assert.rejects(hoiGau(5, { nn: 'en', nguCanh: nguCanhTu, cau: 'ok nhé', lichSu: [{ vai: 'nguoi', noiDung: 'kill yourself' }] }, g.pt),
    (e: { code?: string }) => e.code === 'CONTENT_BLOCKED');
  assert.equal(g.goi.length, 0);
  const x = gia({ tra: 'kill yourself' });
  await assert.rejects(hoiGau(6, { nn: 'en', nguCanh: nguCanhTu, cau: 'Giải thích' }, x.pt), (e: { code?: string }) => e.code === 'CTL_HOI_NOI_DUNG');
  assert.equal((await luotHoiGau(6, x.pt)).conLai, LUOT_HOI_FREE);
});

test('câu rỗng / quá dài / ngôn ngữ sai ⇒ 400', async () => {
  const g = gia();
  await assert.rejects(hoiGau(7, { nn: 'en', cau: ' ' }, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_NGAN');
  await assert.rejects(hoiGau(7, { nn: 'en', cau: 'a'.repeat(501) }, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_DAI');
  await assert.rejects(hoiGau(7, { nn: 'fr', cau: 'hello' }, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_NN');
});

test('báo cáo câu trả lời AI ⇒ hộp thư admin kèm câu hỏi + câu trả lời; quá hạn dùng đoạn trích', async () => {
  const g = gia({ tra: 'Từ này nghĩa là học.' });
  const r = await hoiGau(8, { nn: 'zh', nguCanh: nguCanhTu, cau: 'Nghĩa là gì?' }, g.pt);
  await baoCaoHoiGau(9, { id: r.id, lyDo: 'sai', chiTiet: 'sai nghĩa' }, g.pt);
  assert.match(g.bao[0].noiDung, /Nghĩa là gì\?/);
  assert.match(g.bao[0].noiDung, /Từ này nghĩa là học\./);
  assert.equal(g.bao[0].khoaChongTrung, `ctl-hoi-gau:${r.id}:9`);
  await baoCaoHoiGau(9, { id: 'khong-co', trich: 'đoạn app gửi' }, g.pt);
  assert.match(g.bao[1].noiDung, /đoạn app gửi/);
  await assert.rejects(baoCaoHoiGau(9, {}, g.pt), (e: { code?: string }) => e.code === 'CTL_HOI_BAO_CAO');
});
