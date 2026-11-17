/**
 * Sổ tay chuyên ngành: luật kiểm + NỘI DUNG THẬT trong repo (≥ 8 bộ/ngôn ngữ, 60–150 từ, mã giống nhau giữa 3 ngôn ngữ).
 *   npx tsx --test src/services/ctlanguage/soChuyenNganh.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { kiemBo, kiemTu, laBoDeThi } from './soChuyenNganhThuan.js';
import { danhSach, napSoChuyenNganh } from './soChuyenNganh.js';

test('kiểm từ: kana / pinyin có dấu / IPA', () => {
  assert.deepEqual(kiemTu({ chu: '仕様書', doc: 'しようしょ', nghia: 'đặc tả' }, 'ja'), []);
  assert.ok(kiemTu({ chu: '仕様書', doc: 'shiyousho', nghia: 'đặc tả' }, 'ja').some((l) => /kana/.test(l)));
  assert.deepEqual(kiemTu({ chu: '产量', doc: 'chǎnliàng', nghia: 'sản lượng' }, 'zh'), []);
  assert.ok(kiemTu({ chu: '产量', doc: 'chan3liang4', nghia: 'sản lượng' }, 'zh').length > 0);
  assert.ok(kiemTu({ chu: '女', doc: 'nv', nghia: 'nữ' }, 'zh').some((l) => /dấu thanh|ü/.test(l)));
  assert.deepEqual(kiemTu({ chu: 'invoice', doc: '/ˈɪnvɔɪs/', nghia: 'hoá đơn', viDu: 'Send the invoice.', viDuNghia: 'Gửi hoá đơn.' }, 'en'), []);
  assert.ok(kiemTu({ chu: 'invoice', nghia: 'hoá đơn', viDu: 'Send it.' }, 'en').some((l) => /viDuNghia/.test(l)));
});

test('kiểm bộ: trùng chữ (kể cả katakana/hiragana) + quá ít từ', () => {
  const tu = Array.from({ length: 60 }, (_, i) => ({ chu: `word${i}`, nghia: 'x', viDu: 'An example.', viDuNghia: 'Ví dụ.' }));
  const b = { ma: 'thu', nn: 'en', ten: 'Thử', moTa: 'Thử.', bieuTuong: 'star.fill', thuTu: 1, tu };
  assert.deepEqual(kiemBo(b), []);
  assert.ok(kiemBo({ ...b, tu: [...tu.slice(0, 59), { chu: 'Word0', nghia: 'y' }] }).some((l) => /trùng/.test(l)));
  assert.ok(kiemBo({ ...b, tu: tu.slice(0, 10) }).some((l) => /số từ/.test(l)));
});

test('nội dung trong repo: ≥ 8 bộ mỗi ngôn ngữ, cùng bộ mã, tất cả hợp lệ', () => {
  const ds = napSoChuyenNganh();
  // Bộ NGHỀ: cùng bộ mã giữa 3 ngôn ngữ. Bộ ĐỀ THI (laBoDeThi): chỉ tiếng Anh.
  const theoNn = (nn: string) => ds.filter((b) => b.nn === nn && !laBoDeThi(b.ma)).map((b) => b.ma).sort();
  for (const nn of ['en', 'ja', 'zh']) assert.ok(theoNn(nn).length >= 8, `${nn}: ${theoNn(nn).length} bộ`);
  assert.deepEqual(theoNn('ja'), theoNn('zh'));
  assert.deepEqual(theoNn('en'), theoNn('zh'));
  const deThi = ds.filter((b) => laBoDeThi(b.ma));
  assert.ok(deThi.every((b) => b.nn === 'en'), 'bộ đề thi chỉ ở en/');
  // Mỗi từ chỉ ở MỘT bộ đề thi (so không phân biệt hoa thường, nháy cong = nháy thẳng).
  const khoa = (c: string) => c.normalize('NFKC').replace(/[’‘]/g, "'").toLowerCase().replace(/\s+/g, ' ').trim();
  const daCo = new Map<string, string>();
  for (const b of deThi) for (const t of b.tu) {
    const k = khoa(t.chu);
    assert.ok(!daCo.has(k), `"${t.chu}" trùng giữa ${daCo.get(k)} và ${b.ma}`);
    daCo.set(k, b.ma);
  }
  for (const b of ds) assert.deepEqual(kiemBo(b), [], `${b.nn}/${b.ma}`);
  const tq = danhSach();
  assert.equal(tq.tong, ds.length);
  assert.ok(tq.bo.every((b) => b.soTu >= 60 && b.soTu <= 150 && b.nhom.length >= 1));
  assert.throws(() => danhSach('vi'), /không hỗ trợ/);
});
