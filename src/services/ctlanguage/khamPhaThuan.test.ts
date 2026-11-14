/**
 * Phần thuần của "khám phá" + sự kiện tháng — `npx tsx --test src/services/ctlanguage/khamPhaThuan.test.ts`.
 * Không CSDL, không mạng.
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CHU_DE_TU, idAm } from './chuDeTu.js';
import {
  chuoiDaiNhat, congNgay, docNgay, kiemHoatDong, kiemSuKienAdmin, kiemTram, ngayVn, suKienMacDinh, tinhTram, TRAN_NGAY,
} from './khamPhaThuan.js';

test('ngày VN: 23:30 UTC = sáng hôm sau ở VN; docNgay chặn ngày giả', () => {
  assert.equal(ngayVn(new Date('2026-11-14T16:59:00Z')), '2026-11-14');
  assert.equal(ngayVn(new Date('2026-11-14T17:00:00Z')), '2026-11-15');
  assert.equal(docNgay('2026-02-30'), null);
  assert.equal(docNgay('14/11/2026'), null);
  assert.equal(congNgay('2026-11-30', 1), '2026-12-01');
});

test('kiemHoatDong: cắt trần, bỏ ngày ngoài khoảng, gộp mục trùng bằng max', () => {
  const ds = kiemHoatDong({
    muc: [
      { nn: 'zh', ngay: '2026-11-14', giay: 999999, theOn: 12 },
      { nn: 'zh', ngay: '2026-11-14', giay: 100, theOn: 40 },
      { nn: 'ja', ngay: '2026-11-01', giay: 600 },          // quá 7 ngày ⇒ bỏ
      { nn: 'en', ngay: '2026-11-16', giay: 600 },          // quá ngày mai ⇒ bỏ
      { nn: 'fr', ngay: '2026-11-14', giay: 600 },          // ngôn ngữ lạ ⇒ bỏ
      { nn: 'en', ngay: '2026-11-15', giay: 0, theOn: 0 },  // rỗng ⇒ bỏ
      { nn: 'en', ngay: '2026-11-07', giay: 61.9, thi: -3 },
    ],
  }, '2026-11-14');
  assert.deepEqual(ds, [
    { nn: 'zh', ngay: '2026-11-14', giay: TRAN_NGAY.giay, theOn: 40, thi: 0 },
    { nn: 'en', ngay: '2026-11-07', giay: 61, theOn: 0, thi: 0 },
  ]);
  assert.throws(() => kiemHoatDong({}), /Thiếu/);
  assert.throws(() => kiemHoatDong({ muc: Array(25).fill({}) }), /24/);
});

test('chuỗi dài nhất: chỉ ngày ≥ 5 phút, đứt ngày là đếm lại', () => {
  const g = { '2026-11-01': 400, '2026-11-02': 300, '2026-11-03': 299, '2026-11-04': 900, '2026-11-05': 900, '2026-11-06': 900, '2026-11-08': 900 };
  assert.equal(chuoiDaiNhat(g), 3);
  assert.equal(chuoiDaiNhat({}), 0);
  assert.equal(chuoiDaiNhat({ '2026-11-30': 300, '2026-12-01': 300 }), 2, 'qua tháng vẫn liên tiếp');
});

test('kiemTram: loại lạ / mức sai ⇒ 400; mã trùng được đổi; tên tự sinh', () => {
  assert.throws(() => kiemTram([]), /1–10/);
  assert.throws(() => kiemTram([{ loai: 'nap-tien', muc: 1 }]), /không hỗ trợ/);
  assert.throws(() => kiemTram([{ loai: 'chuoi-hoc', muc: 99 }]), /mức/);
  const t = kiemTram([{ ma: 'a', loai: 'on-the', muc: 200 }, { ma: 'a', loai: 'goi-ai', muc: 3 }, { loai: 'cong-dong', muc: 3 }]);
  assert.equal(t[0]!.ten, 'Ôn 200 thẻ từ');
  assert.notEqual(t[1]!.ma, 'a');
  assert.equal(t[2]!.ten, 'Đăng 1 bài hoặc trả lời 3 câu ở Cộng đồng');
});

test('tinhTram: tiến độ từng trạm, đủ trạm mới xong; soTramCan', () => {
  const tram = kiemTram([
    { loai: 'chuoi-hoc', muc: 2 }, { loai: 'phut-hoc', muc: 20 }, { loai: 'on-the', muc: 10 },
    { loai: 'goi-ai', muc: 1 }, { loai: 'cong-dong', muc: 3 }, { loai: 'bai-ai', muc: 1 },
  ]);
  const s = { giayTheoNgay: { '2026-11-10': 600, '2026-11-11': 700 }, theOn: 4, goi: 1, thi: 0, soBai: 0, soTraLoi: 2, baiAiXong: 1 };
  const r = tinhTram(tram, s, null);
  assert.deepEqual(r.tram.map((x) => [x.loai, x.hienTai, x.xong]), [
    ['chuoi-hoc', 2, true], ['phut-hoc', 20, true], ['on-the', 4, false], ['goi-ai', 1, true], ['cong-dong', 2, false], ['bai-ai', 1, true],
  ]);
  assert.equal(r.daXong, 4);
  assert.equal(r.xong, false);
  assert.ok(r.phanTram > 70 && r.phanTram < 90, String(r.phanTram));
  assert.equal(tinhTram(tram, s, 4).xong, true, 'chỉ cần 4 trạm');
  assert.equal(tinhTram(tram, { ...s, soBai: 1 }, null).tram[4]!.xong, true, 'một bài đăng = 3 điểm');
});

test('sự kiện mặc định: trọn tháng theo giờ VN, thưởng theo mùa, trạm hợp lệ', () => {
  const sk = suKienMacDinh(new Date('2026-11-14T03:00:00Z'));
  assert.equal(sk.ma, 'thang-2026-11');
  assert.equal(sk.tieuDe, 'Thử thách 30 ngày tháng 11');
  assert.equal(sk.batDau.toISOString(), '2026-10-31T17:00:00.000Z');
  assert.equal(sk.ketThuc.toISOString(), '2026-11-30T17:00:00.000Z');
  assert.equal(sk.trangPhuc, 'skLaPhong');
  assert.equal(sk.thuongProNgay, 0, 'mặc định KHÔNG thưởng Pro');
  assert.equal(suKienMacDinh(new Date('2026-12-31T16:59:00Z')).trangPhuc, 'skMuNoel');
  assert.equal(suKienMacDinh(new Date('2026-12-31T17:00:00Z')).ma, 'thang-2027-01', '0h VN ngày 1/1 đã sang tháng mới');
  assert.equal(sk.tram.length, 6);
  assert.ok(!sk.tram.some((t) => t.loai === 'thi-thu'), 'chưa đặt trạm thi thử khi màn thi chưa gửi số');
});

test('kiemSuKienAdmin: đủ trường khi tạo, sửa một phần, chặn trang phục lạ / Pro quá 31 ngày', () => {
  const tao = kiemSuKienAdmin({ ma: 'tet-2027', tieuDe: 'Đón Tết', batDau: '2027-02-01T00:00:00+07:00', ketThuc: '2027-02-15T00:00:00+07:00',
    tram: [{ loai: 'on-the', muc: 50 }], trangPhuc: 'skHuyChuong' });
  assert.equal(tao.ma, 'tet-2027');
  assert.throws(() => kiemSuKienAdmin({ tieuDe: 'x' }), /Thiếu/);
  assert.throws(() => kiemSuKienAdmin({ trangPhuc: 'vuongMien' }, true), /Trang phục/);
  assert.throws(() => kiemSuKienAdmin({ thuongProNgay: 90 }, true), /0–31/);
  assert.deepEqual(kiemSuKienAdmin({ bat: false }, true), { bat: false });
});

test('bộ chủ đề: 14 chủ đề, mỗi ngôn ngữ ≥ 12 từ, không trùng chữ, đủ nghĩa; id âm ổn định', () => {
  assert.equal(CHU_DE_TU.length, 14);
  for (const c of CHU_DE_TU) {
    for (const nn of ['en', 'ja', 'zh'] as const) {
      const ds = c.tu[nn];
      assert.ok(ds.length >= 12, `${c.ma}/${nn}`);
      assert.equal(new Set(ds.map((t) => t[0])).size, ds.length, `${c.ma}/${nn} trùng chữ`);
      for (const [chu, doc, nghia] of ds) {
        assert.ok(chu && nghia, `${c.ma}/${nn} thiếu`);
        if (nn !== 'en') assert.ok(doc, `${c.ma}/${nn}/${chu} thiếu cách đọc`);
        if (nn === 'ja') assert.ok(/^[぀-ヿ ー]+$/.test(doc), `${chu}: cách đọc phải là kana (${doc})`);
        if (nn === 'zh') assert.ok(!/[一-鿿]/.test(doc), `${chu}: pinyin lẫn chữ Hán`);
      }
    }
  }
  assert.equal(idAm('zh', '你好'), idAm('zh', '你好'));
  assert.ok(idAm('zh', '你好') < -99_999_999);
  assert.notEqual(idAm('zh', '你好'), idAm('ja', '你好'));
});
