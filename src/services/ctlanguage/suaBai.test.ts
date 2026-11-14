/**
 * ✍️ AI sửa bài viết của CT Language — luật kiểm JSON model + lượt/ngày + báo cáo (model GIẢ, không CSDL, không mạng).
 *   npx tsx --test src/services/ctlanguage/suaBai.test.ts
 */
import { strict as assert } from 'node:assert';
import { beforeEach, test } from 'node:test';
import {
  __datLaiSuaBai, baoCaoSuaBai, chuanKetQuaSua, LUOT_SUA_FREE, LUOT_SUA_PRO, luotSuaBai, nhacSuaBai, suaBai, timViTri,
  TRAN_KY_TU, type PhuThuocSua,
} from './suaBai.js';

const BAI_ZH = '我昨天去学校了，我很高心。老师说我们明天考试。';
const JSON_TOT = JSON.stringify({
  loi: [
    { goc: '高心', sua: '高兴', giaiThich: 'Viết sai chữ: "vui" là 高兴 (xìng), không phải 心.', mucDo: 'vua', loai: 'chinh-ta' },
    { goc: '我昨天去学校了，我', sua: '我昨天去了学校，', giaiThich: 'Bỏ chủ ngữ lặp.', mucDo: 'nhe', loai: 'van-phong' },
  ],
  vietLai: '我昨天去了学校，很高兴。老师说我们明天考试。',
  nhanXet: 'Câu ngắn, rõ ý. Chú ý chữ 兴.',
  trinhDo: { he: 'HSK', muc: 'hsk 2', ielts: null, lyDo: 'Câu đơn, từ vựng cơ bản.' },
});

let goiLan = 0;
let baoCaoDaGui: { tieuDe: string; noiDung: string; khoaChongTrung: string }[] = [];
const gia = (o: Partial<PhuThuocSua> & { tra?: string | (() => string) } = {}): PhuThuocSua => ({
  laPro: async () => false,
  coAI: () => true,
  goi: async () => { goiLan++; const t = o.tra ?? JSON_TOT; return typeof t === 'function' ? t() : t; },
  baoAdmin: async (tb) => { baoCaoDaGui.push(tb); return { id: 1 }; },
  bayGio: () => new Date('2026-11-14T03:00:00Z'),
  ...o,
});

beforeEach(() => { __datLaiSuaBai(); goiLan = 0; baoCaoDaGui = []; });

test('JSON tốt ⇒ chuẩn hoá: vị trí lỗi, xếp theo vị trí, mức HSK hợp lệ', async () => {
  const kq = await suaBai(1, { nn: 'zh', chu: BAI_ZH }, gia());
  assert.equal(kq.loi.length, 2);
  assert.equal(kq.loi[0].goc, '我昨天去学校了，我');       // vị trí 0 đứng trước
  assert.equal(kq.loi[0].viTri, 0);
  assert.equal(kq.loi[1].viTri, BAI_ZH.indexOf('高心'));
  assert.equal(kq.trinhDo.he, 'HSK');
  assert.equal(kq.trinhDo.muc, 'HSK 2');                     // "hsk 2" ⇒ "HSK 2"
  assert.equal(kq.trinhDo.ielts, null);
  assert.ok(kq.id.length > 10);
  assert.deepEqual(kq.luot, { laPro: false, tran: LUOT_SUA_FREE, conLai: LUOT_SUA_FREE - 1 });
});

test('model bọc ```json + chữ thừa + nháy kép trần trong giải thích ⇒ vẫn đọc được', async () => {
  const ban = '```json\n{"loi":[{"goc":"I has","sua":"I have","giaiThich":"Chủ ngữ "I" đi với have.","mucDo":"nang","loai":"ngu-phap"}],'
    + '"vietLai":"I have a cat.","nhanXet":"Tốt.","trinhDo":{"he":"CEFR","muc":"a2","ielts":"4,3","lyDo":"Câu đơn."}}\n```';
  const kq = await suaBai(2, { nn: 'en', chu: 'I has a cat.' }, gia({ tra: ban }));
  assert.equal(kq.loi[0].mucDo, 'nang');
  assert.equal(kq.loi[0].viTri, 0);
  assert.equal(kq.trinhDo.muc, 'A2');
  assert.equal(kq.trinhDo.ielts, '4.5');                     // 4,3 ⇒ làm tròn bước 0.5
});

test('trường sai kiểu / thiếu ⇒ lọc bỏ, không ném', () => {
  const r = chuanKetQuaSua({
    loi: [null, 'x', { goc: 'a', sua: 'a' }, { goc: 'すし', sua: '寿司', mucDo: 'cuc-nang', loai: 'la' }, { sua: 'thiếu gốc' }],
    vietLai: 42, trinhDo: { muc: 'N9', ielts: 7 },
  }, 'すしがすきです', 'ja');
  assert.equal(r.loi.length, 1);                             // goc === sua bị bỏ, thiếu goc bị bỏ
  assert.equal(r.loi[0].mucDo, 'vua');                       // mức lạ ⇒ vừa
  assert.equal(r.loi[0].loai, 'khac');                       // loại lạ ⇒ khác
  assert.equal(r.vietLai, '42');
  assert.equal(r.trinhDo.he, 'JLPT');
  assert.equal(r.trinhDo.muc, null);                         // N9 không hợp lệ
  assert.equal(r.trinhDo.ielts, null);                       // ielts chỉ cho tiếng Anh
  assert.throws(() => chuanKetQuaSua([1, 2], 'x', 'en'));
});

test('timViTri: khớp đúng / bỏ dấu câu cuối / không thấy', () => {
  assert.equal(timViTri('Hello world. Bye', 'world'), 6);
  assert.equal(timViTri('我很高心呢', '高心。'), 2);
  assert.equal(timViTri('abc', 'xyz'), -1);
});

test('free: hết lượt ⇒ 429 CTL_SUA_HET_LUOT, không gọi model', async () => {
  for (let i = 0; i < LUOT_SUA_FREE; i++) await suaBai(3, { nn: 'zh', chu: BAI_ZH }, gia());
  assert.equal(goiLan, LUOT_SUA_FREE);
  await assert.rejects(suaBai(3, { nn: 'zh', chu: BAI_ZH }, gia()), (e: { statusCode: number; code: string }) => e.statusCode === 429 && e.code === 'CTL_SUA_HET_LUOT');
  assert.equal(goiLan, LUOT_SUA_FREE);
  assert.equal((await luotSuaBai(3, gia())).conLai, 0);
});

test('Pro: trần riêng lớn hơn', async () => {
  const pro = gia({ laPro: async () => true });
  const l = await luotSuaBai(4, pro);
  assert.deepEqual(l, { laPro: true, tran: LUOT_SUA_PRO, conLai: LUOT_SUA_PRO });
  for (let i = 0; i < LUOT_SUA_FREE + 2; i++) await suaBai(4, { nn: 'zh', chu: BAI_ZH }, pro);
  assert.equal((await luotSuaBai(4, pro)).conLai, LUOT_SUA_PRO - LUOT_SUA_FREE - 2);
});

test('AI lỗi / JSON hỏng / trả rỗng ⇒ 503 và HOÀN lượt', async () => {
  await assert.rejects(suaBai(5, { nn: 'zh', chu: BAI_ZH }, gia({ goi: async () => { throw new Error('timeout'); } })), { code: 'CTL_SUA_AI_LOI' });
  await assert.rejects(suaBai(5, { nn: 'zh', chu: BAI_ZH }, gia({ tra: 'xin lỗi tôi không làm được' })), { code: 'CTL_SUA_AI_LOI' });
  await assert.rejects(suaBai(5, { nn: 'zh', chu: BAI_ZH }, gia({ tra: '{"loi":[],"vietLai":"","nhanXet":""}' })), { code: 'CTL_SUA_AI_LOI' });
  assert.equal((await luotSuaBai(5, gia())).conLai, LUOT_SUA_FREE);
});

test('đầu vào sai ⇒ 400, không trừ lượt, không gọi model', async () => {
  await assert.rejects(suaBai(6, { nn: 'fr', chu: BAI_ZH }, gia()), { code: 'CTL_SUA_NN' });
  await assert.rejects(suaBai(6, { nn: 'en', chu: 'hi' }, gia()), { code: 'CTL_SUA_NGAN' });
  await assert.rejects(suaBai(6, { nn: 'en', chu: 'a'.repeat(TRAN_KY_TU + 1) }, gia()), { code: 'CTL_SUA_DAI' });
  await assert.rejects(suaBai(6, { nn: 'en', chu: 'I has a cat.' }, gia({ coAI: () => false })), { code: 'CTL_SUA_AI_NGHI' });
  assert.equal(goiLan, 0);
  assert.equal((await luotSuaBai(6, gia())).conLai, LUOT_SUA_FREE);
});

test('lời nhắc: đúng hệ trình độ theo ngôn ngữ + kiểu viết', () => {
  assert.match(nhacSuaBai('en', 'bai-thi'), /"he":"CEFR"/);
  assert.match(nhacSuaBai('en', 'bai-thi'), /IELTS/);
  assert.match(nhacSuaBai('ja', 'trang-trong'), /N5\|N4\|N3\|N2\|N1/);
  assert.match(nhacSuaBai('zh', 'tu-nhien'), /HSK 1\|HSK 2/);
});

test('báo cáo: kèm đúng bài + câu AI đã trả; id lạ ⇒ dùng đoạn trích; thiếu id ⇒ 400', async () => {
  const kq = await suaBai(7, { nn: 'zh', chu: BAI_ZH }, gia());
  await baoCaoSuaBai(7, { id: kq.id, lyDo: 'bia', chiTiet: 'lỗi 2 không có' }, gia());
  assert.equal(baoCaoDaGui.length, 1);
  assert.match(baoCaoDaGui[0].noiDung, /AI bịa/);
  assert.match(baoCaoDaGui[0].noiDung, /高心/);
  assert.match(baoCaoDaGui[0].noiDung, /lỗi 2 không có/);
  assert.equal(baoCaoDaGui[0].khoaChongTrung, `ctl-sua-bai:${kq.id}:7`);
  await baoCaoSuaBai(7, { id: 'het-han-123', lyDo: 'xyz', trich: 'đoạn app gửi' }, gia());
  assert.match(baoCaoDaGui[1].noiDung, /Lý do: Khác/);
  assert.match(baoCaoDaGui[1].noiDung, /đoạn app gửi/);
  await assert.rejects(baoCaoSuaBai(7, {}, gia()), { code: 'CTL_SUA_BAO_CAO' });
});
