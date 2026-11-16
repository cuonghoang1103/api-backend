/**
 * Từ vựng theo chủ đề (15/11/2026): luật kiểm + lọc/phân trang (thuần) và NỘI DUNG THẬT trong content/ctlanguage/chu-de-tu.
 *   npx tsx --test src/services/ctlanguage/chuDeTu.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { THU_MUC_CDT, chuDeCua, idAm, napChuDeTu, _datKhoChuDe } from './chuDeTu.js';
import {
  CAP_CUA, MA_CU, NN_CDT, SO_TU_TOI_DA, SO_TU_TOI_THIEU, TI_LE_VI_DU, docBoLoc, hienThi, khoaTrung, kiemDanhMuc, kiemTep, kiemTu,
  locVaCatTrang, tomTatChuDe, type DanhMucChuDe, type TepChuDe, type TuChuDe,
} from './chuDeTuThuan.js';

const DM: DanhMucChuDe = {
  nhomLon: [{ ma: 'doi-song', ten: 'Đời sống', bieuTuong: 'house.fill' }],
  chuDe: MA_CU.map((ma) => ({ ma, ten: ma, nhomLon: 'doi-song', bieuTuong: 'tag.fill', anh: 'dog', moTa: 'mô tả', nhom: ['A', 'B', 'C'] })),
};
const nhom = new Set(['A', 'B', 'C']);

test('kiemTu: kana / pinyin có dấu / IPA, nghĩa không lẫn chữ Hán, cấp đúng ngôn ngữ, mục con thuộc chủ đề', () => {
  assert.deepEqual(kiemTu({ chu: '犬', doc: 'いぬ', nghia: 'chó', nhom: 'A', cap: 'N5', loai: 'n' }, 'ja', nhom), []);
  assert.deepEqual(kiemTu({ chu: '苹果', doc: 'píngguǒ', nghia: 'quả táo', nhom: 'B', cap: 'HSK3' }, 'zh', nhom), []);
  assert.deepEqual(kiemTu({ chu: 'dog', doc: '/dɒɡ/', nghia: 'con chó', nhom: 'C', cap: 'A1' }, 'en', nhom), []);
  assert.match(kiemTu({ chu: '犬', doc: '犬', nghia: 'chó', nhom: 'A' }, 'ja', nhom).join(), /toàn kana/);
  assert.match(kiemTu({ chu: '苹果', doc: 'ping2guo3', nghia: 'táo', nhom: 'A' }, 'zh', nhom).join(), /pinyin/);
  assert.match(kiemTu({ chu: '女', doc: 'nv', nghia: 'nữ', nhom: 'A' }, 'zh', nhom).join(), /pinyin|ü/);
  assert.match(kiemTu({ chu: 'dog', doc: 'dɒɡ', nghia: 'chó', nhom: 'A' }, 'en', nhom).join(), /IPA/);
  assert.match(kiemTu({ chu: '偶に', doc: 'たまに', nghia: 'dù sao thì,无论如何', nhom: 'A' }, 'ja', nhom).join(), /lẫn chữ Hán/);
  assert.match(kiemTu({ chu: '犬', doc: 'いぬ', nghia: 'chó', nhom: 'Z' }, 'ja', nhom).join(), /không thuộc chủ đề/);
  assert.match(kiemTu({ chu: '犬', doc: 'いぬ', nghia: 'chó', nhom: 'A', cap: 'HSK1' }, 'ja', nhom).join(), /không phải cấp ja/);
  assert.match(kiemTu({ chu: '犬', doc: 'いぬ', nghia: 'chó', nhom: 'A', viDu: '犬がいる。' }, 'ja', nhom).join(), /thiếu viDuNghia/);
  assert.match(kiemTu({ chu: 'cat', nghia: 'mèo', nhom: 'A', anh: 'cat' }, 'en', nhom, 'tu', new Set(['dog'])).join(), /chưa có trên R2/);
  assert.match(kiemTu({ chu: 'cat', nghia: 'mèo', nhom: 'A', id: 3 }, 'en', nhom).join(), /trường lạ/);
});

test('kiemTep: 60–150 từ, không trùng (katakana = hiragana), ≥ 30% có ví dụ, mã phải có trong danh mục', () => {
  const tu = (n: number, viDu: number): TuChuDe[] => Array.from({ length: n }, (_, i) => ({
    chu: `w${i}`, nghia: `nghĩa ${i}`, nhom: 'A', ...(i < viDu ? { viDu: `Ex ${i}.`, viDuNghia: `Câu ${i}.` } : {}),
  }));
  assert.deepEqual(kiemTep({ ma: 'gia-dinh', nn: 'en', tu: tu(60, 18) }, DM), []);
  assert.match(kiemTep({ ma: 'gia-dinh', nn: 'en', tu: tu(59, 30) }, DM).join(), /số từ 59/);
  assert.match(kiemTep({ ma: 'gia-dinh', nn: 'en', tu: tu(60, 10) }, DM).join(), /câu ví dụ/);
  assert.match(kiemTep({ ma: 'khong-co', nn: 'en', tu: tu(60, 30) }, DM).join(), /không có trong danh mục/);
  const trung = tu(60, 30); trung[5] = { ...trung[5], chu: 'W0 ' };
  assert.match(kiemTep({ ma: 'gia-dinh', nn: 'en', tu: trung }, DM).join(), /trùng/);
  assert.equal(khoaTrung('ペンギン'), khoaTrung('ぺんぎん'));
});

test('kiemDanhMuc: bắt thiếu mã cũ, nhóm lớn lạ, ảnh chưa có trên R2', () => {
  assert.deepEqual(kiemDanhMuc(DM, new Set(['dog'])), []);
  const thieu = { ...DM, chuDe: DM.chuDe.filter((c) => c.ma !== 'gia-dinh') };
  assert.match(kiemDanhMuc(thieu).join(), /thiếu mã cũ "gia-dinh"/);
  const la = { ...DM, chuDe: [...DM.chuDe, { ...DM.chuDe[0], ma: 'moi', nhomLon: 'khong-co' }] };
  assert.match(kiemDanhMuc(la).join(), /nhomLon "khong-co"/);
  assert.match(kiemDanhMuc(DM, new Set(['cat'])).join(), /chưa có trên R2/);
});

test('lọc cấp + mục con + phân trang; không trang ⇒ trả hết (app cũ)', () => {
  const tu = Array.from({ length: 25 }, (_, i) => ({ chu: `w${i}`, cap: i % 2 ? 'HSK1' : 'HSK2', nhom: i < 10 ? 'A' : 'B' }));
  const het = locVaCatTrang(tu, docBoLoc({}, 'zh'));
  assert.equal(het.tu.length, 25);
  const b = docBoLoc({ cap: 'hsk1,N5,HSK9', trang: '2', kichThuoc: '5' }, 'zh');
  assert.deepEqual(b.cap, ['HSK1']);
  const r = locVaCatTrang(tu, b);
  assert.equal(r.tong, 12); assert.equal(r.soTrang, 3); assert.equal(r.tu.length, 5); assert.equal(r.tu[0].chu, 'w11');
  assert.equal(locVaCatTrang(tu, docBoLoc({ nhom: 'A' }, 'zh')).tong, 10);
  assert.equal(docBoLoc({ cap: 'N5' }, 'zh').cap, null, 'cấp của ngôn ngữ khác bị bỏ');
  assert.equal(docBoLoc({ kichThuoc: '9999', trang: '1' }, 'en').kichThuoc, 150);
});

test('nạp: tệp hỏng bị bỏ (không sập cả mục), danh mục hỏng ⇒ không có chủ đề', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ctl-cdt-'));
  fs.writeFileSync(path.join(d, '_chu-de.json'), JSON.stringify(DM));
  fs.mkdirSync(path.join(d, 'en'));
  const tu = Array.from({ length: 60 }, (_, i) => ({ chu: `w${i}`, nghia: 'n', nhom: 'A', viDu: 'E.', viDuNghia: 'C.' }));
  fs.writeFileSync(path.join(d, 'en', 'gia-dinh.json'), JSON.stringify({ ma: 'gia-dinh', nn: 'en', tu }));
  fs.writeFileSync(path.join(d, 'en', 'an-uong.json'), '{hỏng');
  fs.writeFileSync(path.join(d, 'en', 'mua-sam.json'), JSON.stringify({ ma: 'mua-sam', nn: 'en', tu: tu.slice(0, 10) }));
  const k = napChuDeTu(d);
  assert.deepEqual([...k.tep.en.keys()], ['gia-dinh']);
  fs.writeFileSync(path.join(d, '_chu-de.json'), JSON.stringify({ nhomLon: [], chuDe: [] }));
  assert.equal(napChuDeTu(d).danhMuc.chuDe.length, 0);
  fs.rmSync(d, { recursive: true, force: true });
  assert.equal(idAm('zh', '你好'), idAm('zh', '你好'));
});

// ─── Nội dung thật ────────────────────────────────────────────────────────────────────────────────────────────────
test('NỘI DUNG: danh mục hợp lệ, mỗi ngôn ngữ ≥ 40 chủ đề hợp lệ, đủ 14 mã cũ, ≥ 3.000 từ, tỉ lệ ví dụ/cấp/ảnh', () => {
  _datKhoChuDe(null);
  const k = napChuDeTu(THU_MUC_CDT);
  assert.deepEqual(kiemDanhMuc(k.danhMuc), []);
  assert.ok(k.danhMuc.chuDe.length >= 40 && k.danhMuc.chuDe.length <= 50, `${k.danhMuc.chuDe.length} chủ đề`);
  for (const nn of NN_CDT) {
    const tepDia = fs.readdirSync(path.join(THU_MUC_CDT, nn)).filter((f) => f.endsWith('.json'));
    assert.equal(k.tep[nn].size, tepDia.length, `${nn}: có tệp bị bỏ vì sai khuôn`);
    const ds = [...k.tep[nn].values()];
    assert.ok(ds.length >= 40, `${nn}: ${ds.length} chủ đề`);
    for (const m of MA_CU) assert.ok(k.tep[nn].has(m), `${nn}: thiếu mã cũ ${m}`);
    const tu = ds.flatMap((t) => t.tu);
    assert.ok(tu.length >= 3000, `${nn}: ${tu.length} từ`);
    for (const t of ds) {
      assert.ok(t.tu.length >= SO_TU_TOI_THIEU && t.tu.length <= SO_TU_TOI_DA);
      assert.ok(t.tu.filter((x) => x.viDu).length / t.tu.length >= TI_LE_VI_DU);
    }
    assert.ok(tu.filter((x) => x.cap && CAP_CUA[nn].includes(x.cap)).length / tu.length > 0.9, `${nn}: thiếu cấp`);
    // Mỗi chủ đề có ≥ 2 mục con không rỗng; tóm tắt đếm đúng.
    for (const { c, tep } of chuDeCua(nn)) {
      const tom = tomTatChuDe(c, tep, k.danhMuc);
      assert.ok(tom.nhom.length >= 2, `${nn}/${c.ma}: ${tom.nhom.length} mục con`);
      assert.equal(tom.nhom.reduce((s, x) => s + x.soTu, 0), tep.tu.length);
      assert.ok(hienThi(c, nn).ten);
    }
  }
  // Chủ đề văn hoá đổi tên theo nước.
  const lh = k.danhMuc.chuDe.find((c) => c.ma === 'le-hoi')!;
  assert.notEqual(hienThi(lh, 'ja').ten, hienThi(lh, 'zh').ten);
});

test('NỘI DUNG: ảnh trong tệp đều có trong danh mục Fluent', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'hinh', 'fluent-catalog.json'), 'utf8')).hinh as Record<string, string>;
  const k = napChuDeTu(THU_MUC_CDT);
  const ten = new Set(Object.keys(cat));
  assert.deepEqual(kiemDanhMuc(k.danhMuc, ten), []);
  for (const nn of NN_CDT) for (const t of k.tep[nn].values() as Iterable<TepChuDe>) for (const x of t.tu) if (x.anh) assert.ok(ten.has(x.anh), `${nn}/${t.ma}: ${x.anh}`);
});

test('tuDeChoi: từ cho trò chơi chỉ tới cấp trung cao, không có từ C1/C2 · N1 · HSK5–6', async () => {
  const { tuDeChoi, chuDeCua } = await import('./chuDeTu.js');
  for (const nn of ['en', 'ja', 'zh'] as const) {
    const ds = new Set(tuDeChoi(nn));
    assert.ok(ds.size > 1500, `${nn}: ${ds.size}`);
    const kho = chuDeCua(nn).flatMap(({ tep }) => tep.tu);
    const cao = kho.filter((t) => ['C1', 'C2', 'N1', 'HSK5', 'HSK6'].includes(t.cap ?? '') && !kho.some((u) => u !== t && u.chu === t.chu && !['C1', 'C2', 'N1', 'HSK5', 'HSK6'].includes(u.cap ?? '')));
    for (const t of cao.slice(0, 50)) assert.ok(!ds.has(nn === 'en' ? t.chu.toLowerCase() : t.chu), `${nn}: ${t.chu} (${t.cap})`);
  }
});
