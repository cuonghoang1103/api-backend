/**
 * 🐻 Gấu trợ lý theo màn (15/11/2026) — luật lượt free/Pro, lọc chữ người dùng + câu AI, ngữ cảnh + bạn đồng hành trong
 * lời nhắc, cắt lịch sử, báo cáo câu trả lời AI (4.7). Không gọi AI, không CSDL — phụ thuộc giả.
 *   npx tsx --test src/services/ctlanguage/hoiGau.test.ts
 */
import { strict as assert } from 'node:assert';
import { beforeEach, test } from 'node:test';
import {
  __datLaiHoiGau, baoCaoHoiGau, docLichSu, docNguCanh, GOI_Y_MAC_DINH, hoiGau, lamSachTraLoiGiau, LICH_SU_TOI_DA, LUOT_HOI_FREE,
  LUOT_HOI_PRO, luotHoiGau, nhacHoiGau, nhacHoiGauGiau, NGU_CANH_TOI_DA, phanLoaiCau, TRAN_RA, TRA_LOI_TOI_DA, type PhuThuocHoi,
} from './hoiGau.js';

type Goi = Parameters<PhuThuocHoi['goi']>[0];
function gia(o: { laPro?: boolean; tra?: string | (() => string); loi?: boolean; biCat?: boolean } = {}) {
  const goi: Goi[] = [];
  const bao: { tieuDe: string; noiDung: string; khoaChongTrung: string }[] = [];
  const pt: PhuThuocHoi = {
    laPro: async () => o.laPro ?? false,
    goi: async (x) => {
      goi.push(x);
      if (o.loi) throw new Error('cổng sập');
      const t = typeof o.tra === 'function' ? o.tra() : o.tra ?? '**Được** dùng khi…\n# Tiêu đề\n• ví dụ';
      return o.biCat ? { text: t, biCat: true } : t;
    },
    baoAdmin: async (tb) => { bao.push(tb); return {}; },
    bayGio: () => new Date('2026-11-15T03:00:00Z'),
  };
  return { pt, goi, bao };
}
const nguCanhTu = { loai: 'tu', tieuDe: '学习 (xuéxí)', noiDung: 'Nghĩa: học tập. Ví dụ: 我在学习中文。' };
// Dữ liệu GIẢ (không chép giáo trình) — chỉ để kiểm đường đi của ngữ cảnh bài.
const nguCanhBai = { loai: 'bai-hoc', tieuDe: 'Bài thử', noiDung: `Mục tiêu: chào hỏi\nTừ vựng: {水|みず} = nước\n${'x'.repeat(4500)}\nĐUÔI-BÀI` };

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
  assert.match(nhacHoiGau('en', 'rong', docNguCanh({ loai: 'xx', noiDung: 'a'.repeat(7000) })), /Gấu CuongMini/);
  const nc = docNguCanh({ loai: 'xx', noiDung: 'a'.repeat(7000) });
  assert.equal(nc.loai, 'khac');
  assert.equal(nc.noiDung.length, NGU_CANH_TOI_DA);
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

// ─── Đợt 2: định dạng giàu ─────────────────────────────────────────────────────────────────────────────────────────

test('phân loại câu hỏi: chip gợi ý + câu tự gõ + loại màn', () => {
  assert.equal(phanLoaiCau('Tóm tắt bài này', 'bai-hoc'), 'tom-tat');
  assert.equal(phanLoaiCau('Đố mình 3 câu', 'bai-hoc'), 'do-vui');
  assert.equal(phanLoaiCau('Kiểm tra mình 3 câu', 'tu'), 'do-vui');
  assert.equal(phanLoaiCau('Cho thêm ví dụ', 'ngu-phap'), 'vi-du');
  assert.equal(phanLoaiCau('Vì sao đáp án đúng?', 'cau-thi'), 'cau-thi');
  assert.equal(phanLoaiCau('Câu 水を飲みます viết vậy đúng không?', 'bai-hoc'), 'chua-cau');
  assert.equal(phanLoaiCau('Sửa giúp mình câu này', 'khac'), 'chua-cau');
  assert.equal(phanLoaiCau('Giải thích điểm ngữ pháp này', 'ngu-phap'), 'ngu-phap');
  assert.equal(phanLoaiCau('Lỗi hay gặp', 'ngu-phap'), 'ngu-phap', 'màn ngữ pháp ⇒ khung ngữ pháp');
  assert.equal(phanLoaiCau('Phân biệt với từ gần nghĩa', 'tu'), 'tu');
  assert.equal(phanLoaiCau('Mẹo nhớ mặt chữ', 'chu-han'), 'tu');
  assert.equal(phanLoaiCau('Nên ôn gì tiếp?', 'ket-qua-thi'), 'tu-do');
});

test('lời nhắc giàu: cú pháp hiển thị + khung đúng loại + cách viết theo ngôn ngữ + ngữ cảnh đủ', () => {
  const nc = docNguCanh(nguCanhBai);
  const ja = nhacHoiGauGiau('ja', 'cao', nc, 'tom-tat');
  assert.match(ja, /Cáo Lửa/);
  assert.match(ja, /TÓM TẮT BÀI/);
  assert.match(ja, /\{漢字\|かな\}/, 'dạy furigana đúng cú pháp khoá kiểu sách');
  assert.match(ja, /> ✅ Tự kiểm tra/);
  assert.match(ja, /\[\[goi-y\]\]/);
  assert.match(ja, /ĐUÔI-BÀI/, 'ngữ cảnh 6000 ký tự không bị cắt mất phần cuối bài');
  assert.doesNotMatch(ja, /KHÔNG dùng bảng, tiêu đề #, hay \*\*in đậm\*\*/, 'luật cấm định dạng cũ đã bỏ');
  assert.match(nhacHoiGauGiau('zh', undefined, nc, 'tu'), /pinyin CÓ DẤU THANH/);
  assert.match(nhacHoiGauGiau('en', undefined, nc, 'chua-cau'), /CHỮA CÂU/);
  assert.ok(TRAN_RA['tom-tat'] > 900 && Object.values(TRAN_RA).every((n) => n >= 1500 && n <= 3000), 'trần ra nâng nhưng có giới hạn');
});

test('làm sạch giàu: giữ Markdown app vẽ được, bỏ thứ app không vẽ, tách gợi ý', () => {
  const r = lamSachTraLoiGiau([
    '# Tiêu đề lớn', '#### Nhỏ', '**Đậm** và `語` (ご)', '* gạch sao', '• gạch chấm', '```js', 'x = 1', '```', '<b>html</b>',
    '', '', '', '> 💡 Mẹo: nhớ nhé', '[[goi-y]]', '- Cho thêm ví dụ', '- "Kiểm tra mình 3 câu"', '- Cho thêm ví dụ', '- 4', '- 5',
  ].join('\n'));
  assert.equal(r.than, '## Tiêu đề lớn\n### Nhỏ\n**Đậm** và `語` (ご)\n- gạch sao\n- gạch chấm\n\nx = 1\n\nhtml\n\n> 💡 Mẹo: nhớ nhé');
  assert.deepEqual(r.goiY, ['Cho thêm ví dụ', 'Kiểm tra mình 3 câu'], 'bỏ trùng + bỏ câu quá ngắn');
  assert.deepEqual(lamSachTraLoiGiau('Trả lời\n\nGợi ý hỏi tiếp:\n1. Giải thích kỹ hơn').goiY, ['Giải thích kỹ hơn']);
  const dai = lamSachTraLoiGiau(`${'dòng dài\n'.repeat(2000)}`);
  assert.ok(dai.than.length <= TRA_LOI_TOI_DA + 3 && dai.than.endsWith('…'));
});

test('dinhDang 2: trả goiY + kieu, trần ra theo loại, ngữ cảnh 6000; app cũ giữ nguyên đường cũ', async () => {
  const g = gia({ tra: '## 🎯 Bài này học gì\nChào hỏi.\n[[goi-y]]\n- Đố mình 3 câu\n- Cho thêm ví dụ' });
  const r = await hoiGau(10, { nn: 'ja', nguCanh: nguCanhBai, cau: 'Tóm tắt bài này', dinhDang: 2 }, g.pt);
  assert.equal(r.traLoi, '## 🎯 Bài này học gì\nChào hỏi.', 'giữ ## (bản cũ xoá mất)');
  assert.deepEqual(r.goiY, ['Đố mình 3 câu', 'Cho thêm ví dụ']);
  assert.equal(r.kieu, 'tom-tat');
  assert.equal(g.goi[0].maxTokens, TRAN_RA['tom-tat']);
  assert.match(g.goi[0].system, /ĐUÔI-BÀI/);

  const cu = gia({ tra: '## Tiêu đề\n**đậm**' });
  const rc = await hoiGau(11, { nn: 'ja', nguCanh: nguCanhBai, cau: 'Tóm tắt bài này' }, cu.pt);
  assert.equal(rc.traLoi, 'Tiêu đề\nđậm', 'app cũ vẽ Text trơn ⇒ vẫn bỏ markup');
  assert.equal(rc.goiY, undefined);
  assert.equal(cu.goi[0].maxTokens, 900);
  assert.doesNotMatch(cu.goi[0].system, /ĐUÔI-BÀI/, 'app cũ: ngữ cảnh vẫn cắt 3000');
  assert.match(cu.goi[0].system, /KHÔNG dùng bảng/);
});

test('dinhDang 2: model quên [[goi-y]] ⇒ gợi ý mặc định; chạm trần ⇒ báo + chip viết tiếp', async () => {
  const g = gia({ tra: 'Từ này nghĩa là nước.' });
  const r = await hoiGau(12, { nn: 'ja', nguCanh: nguCanhTu, cau: 'Giải thích từ này', dinhDang: 2 }, g.pt);
  assert.deepEqual(r.goiY, GOI_Y_MAC_DINH.tu);
  const c = gia({ tra: '## Ý nghĩa\nCâu bị cắt giữa', biCat: true });
  const rc = await hoiGau(13, { nn: 'en', nguCanh: nguCanhTu, cau: 'Giải thích kỹ', dinhDang: 2 }, c.pt);
  assert.match(rc.traLoi, /bị ngắt/);
  assert.equal(rc.goiY?.[0], 'Viết tiếp phần còn lại');
});

test('dinhDang 2: gợi ý lọt từ xấu ⇒ chặn cả câu trả lời + hoàn lượt', async () => {
  const g = gia({ tra: 'Ổn.\n[[goi-y]]\n- kill yourself' });
  await assert.rejects(hoiGau(14, { nn: 'en', nguCanh: nguCanhTu, cau: 'Giải thích', dinhDang: 2 }, g.pt),
    (e: { code?: string }) => e.code === 'CTL_HOI_NOI_DUNG');
  assert.equal((await luotHoiGau(14, g.pt)).conLai, LUOT_HOI_FREE);
});
