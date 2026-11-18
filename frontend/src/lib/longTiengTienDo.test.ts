/** npx tsx --test frontend/src/lib/longTiengTienDo.test.ts */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CHANG, cauNoi, changTheoChu, changTheoPhanTram, chuDaChay, chuThoiGian, lamMuotEta, moTaBanRa, themMau, tinhTienDo, uocLuongConLai,
  type Mau,
} from './longTiengTienDo';

describe('chặng theo chữ của trạm (tram.mts › baoTienDo)', () => {
  const bang: Array<[string, string]> = [
    ['Trạm đã nhận việc', 'tai'],
    ['Tải video từ link', 'tai'],
    ['Tải video từ link (qua máy GPU thuê)', 'tai'],
    ['Tải video lên trạm', 'tai'],
    ['Tải nhạc nền', 'tai'],
    ['Tách giọng gốc khỏi nhạc nền', 'tach'],
    ['Nghe & chép lời gốc', 'nghe'],
    ['Dịch 40/103 câu', 'dich'],
    ['Lập từ điển thuật ngữ', 'dich'],
    ['Giọng bạn đang đọc 117 mẩu', 'long'],
    ['Đọc lại 6 mẩu chưa đạt (lượt 2)', 'long'],
    ['Canh giọng theo hình', 'ghep'],
    ['Kéo dài hình 11/40 đoạn', 'ghep'],
    ['Ghép tiếng + xuất video', 'ghep'],
    ['Đẩy kết quả lên kho', 'ghep'],
  ];
  for (const [chu, ma] of bang) it(`"${chu}" ⇒ ${ma}`, () => assert.equal(changTheoChu(chu), ma));
  it('chữ lạ / rỗng ⇒ null', () => {
    assert.equal(changTheoChu('Chờ trạm nhận việc'), null);
    assert.equal(changTheoChu(null), null);
    assert.equal(changTheoChu(''), null);
  });
  it('theo %: biên chặng đúng mốc trạm', () => {
    assert.equal(changTheoPhanTram(0), 'tai');
    assert.equal(changTheoPhanTram(11), 'tai');
    assert.equal(changTheoPhanTram(12), 'tach');
    assert.equal(changTheoPhanTram(34), 'nghe');
    assert.equal(changTheoPhanTram(35), 'dich');
    assert.equal(changTheoPhanTram(58), 'long');
    assert.equal(changTheoPhanTram(82), 'ghep');
    assert.equal(changTheoPhanTram(100), 'ghep');
    assert.equal(changTheoPhanTram(-5), 'tai');
  });
});

describe('tinhTienDo', () => {
  it('đang dịch 42%: 3 chặng trước xong, dịch đang chạy (47% của chặng), sau chờ', () => {
    const t = tinhTienDo({ trangThai: 'lam', buoc: 'Dịch 50/103 câu', phanTram: 42 });
    assert.equal(t.pha, 'chay');
    assert.equal(CHANG[t.hienTai]!.ma, 'dich');
    assert.deepEqual(t.chang.map((c) => c.trangThai), ['xong', 'xong', 'xong', 'dang', 'cho', 'cho']);
    assert.equal(t.chang[3]!.phanTram, 47);
    assert.equal(t.tong, 42);
  });
  it('chữ thắng %: "Tách giọng" báo 12% vẫn là chặng tách (0% trong chặng)', () => {
    const t = tinhTienDo({ trangThai: 'lam', buoc: 'Tách giọng gốc khỏi nhạc nền', phanTram: 12 });
    assert.equal(CHANG[t.hienTai]!.ma, 'tach');
    assert.equal(t.chang[1]!.phanTram, 0);
  });
  it('chữ lạ ⇒ theo %', () => {
    const t = tinhTienDo({ trangThai: 'lam', buoc: 'Bước mới chưa biết', phanTram: 60 });
    assert.equal(CHANG[t.hienTai]!.ma, 'long');
  });
  it('xếp hàng / chờ tải lên / xong / huỷ', () => {
    const h = tinhTienDo({ trangThai: 'cho', buoc: 'Chờ trạm nhận việc', phanTram: 0 });
    assert.equal(h.pha, 'xep-hang');
    assert.ok(h.chang.every((c) => c.trangThai === 'cho'));
    const u = tinhTienDo({ trangThai: 'cho_tai_len', buoc: 'Chờ tải tệp lên', phanTram: 0 });
    assert.equal(u.pha, 'tai-len');
    assert.equal(u.chang[0]!.trangThai, 'dang');
    const x = tinhTienDo({ trangThai: 'xong', buoc: '103 câu · 0 câu dưới ngưỡng', phanTram: 100 });
    assert.ok(x.chang.every((c) => c.trangThai === 'xong'));
    assert.equal(x.tong, 100);
    assert.equal(tinhTienDo({ trangThai: 'huy', buoc: 'Đã huỷ', phanTram: 30 }).pha, 'huy');
  });
  it('lỗi giữa chặng lồng tiếng ⇒ chặng đó đỏ, trước đó xong', () => {
    const t = tinhTienDo({ trangThai: 'loi', buoc: 'Giọng bạn đang đọc 80 mẩu', phanTram: 50 });
    assert.equal(t.pha, 'loi');
    assert.deepEqual(t.chang.map((c) => c.trangThai), ['xong', 'xong', 'xong', 'xong', 'loi', 'cho']);
  });
});

describe('ước lượng thời gian còn lại', () => {
  const PHUT = 60_000;
  it('chưa đủ dữ liệu ⇒ null (dưới 60 s hoặc tiến < 3%)', () => {
    assert.equal(uocLuongConLai([], 10, 0), null);
    assert.equal(uocLuongConLai([{ t: 0, p: 10 }], 20, 30_000), null);
    assert.equal(uocLuongConLai([{ t: 0, p: 10 }], 12, 5 * PHUT), null);
  });
  it('tiến đều 5%/phút từ 10% ⇒ còn ~ (100−40)/5 = 12 phút', () => {
    const ds: Mau[] = [0, 1, 2, 3, 4, 5, 6].map((k) => ({ t: k * PHUT, p: 10 + 5 * k }));
    const g = uocLuongConLai(ds, 40, 6 * PHUT)!;
    assert.ok(Math.abs(g - 12 * 60) < 5, String(g));
  });
  it('% đứng yên lâu ⇒ ETA tự dài ra (tính tới now, không tới mẫu cuối)', () => {
    const ds: Mau[] = [{ t: 0, p: 10 }, { t: 5 * PHUT, p: 50 }];
    const ngay = uocLuongConLai(ds, 50, 5 * PHUT)!;
    const sau = uocLuongConLai(ds, 50, 25 * PHUT)!;
    assert.ok(sau > ngay * 2, `${ngay} → ${sau}`);
  });
  it('sàn 60 s, 100% ⇒ 0', () => {
    assert.equal(uocLuongConLai([{ t: 0, p: 0 }], 99, 60 * PHUT), 60);
    assert.equal(uocLuongConLai([{ t: 0, p: 0 }], 100, PHUT), 0);
  });
  it('themMau: bỏ mẫu trùng % trong 30 s, % lùi ⇒ bắt đầu lại, giữ mẫu đầu khi cắt', () => {
    let ds: Mau[] = [];
    ds = themMau(ds, { t: 0, p: 5 });
    ds = themMau(ds, { t: 10_000, p: 5 });
    assert.equal(ds.length, 1);
    ds = themMau(ds, { t: 40_000, p: 5 });
    assert.equal(ds.length, 2);
    assert.deepEqual(themMau(ds, { t: 50_000, p: 0 }), [{ t: 50_000, p: 0 }]);
    let dai: Mau[] = [];
    for (let k = 0; k < 100; k++) dai = themMau(dai, { t: k * 1000, p: k }, 10);
    assert.equal(dai.length, 10);
    assert.deepEqual(dai[0], { t: 0, p: 0 });
    assert.deepEqual(dai[9], { t: 99_000, p: 99 });
  });
  it('lamMuotEta: pha 65/35 sau khi trừ thời gian đã trôi; không có số mới ⇒ đếm lùi, sàn 60', () => {
    const a = lamMuotEta(null, 600, 0)!;
    assert.equal(a.giay, 600);
    const b = lamMuotEta(a, 300, 60_000)!;
    assert.equal(b.giay, Math.round(0.65 * 540 + 0.35 * 300));
    const c = lamMuotEta(b, null, 60_000 + 3_600_000)!;
    assert.equal(c.giay, 60);
    assert.equal(lamMuotEta(null, null, 0), null);
  });
});

describe('chữ hiển thị', () => {
  it('chuThoiGian', () => {
    assert.equal(chuThoiGian(null), null);
    assert.equal(chuThoiGian(20), 'khoảng 1 phút');
    assert.equal(chuThoiGian(6 * 60 + 10), 'khoảng 6 phút');
    assert.equal(chuThoiGian(75 * 60), 'khoảng 1 giờ 15 phút');
    assert.equal(chuThoiGian(119 * 60), 'khoảng 2 giờ');
    assert.equal(chuThoiGian(120 * 60), 'khoảng 2 giờ');
  });
  it('chuDaChay', () => {
    assert.equal(chuDaChay(42), '42 giây');
    assert.equal(chuDaChay(12 * 60 + 5), '12 phút');
    assert.equal(chuDaChay(65 * 60), '1 giờ 05 phút');
  });
  it('cauNoi: đúng câu chủ kênh muốn + xoay vòng + chưa ước lượng', () => {
    const t = tinhTienDo({ trangThai: 'lam', buoc: 'Tách giọng gốc khỏi nhạc nền', phanTram: 15 });
    assert.equal(cauNoi(t, 0, 6 * 60), 'Mình đang tách giọng gốc khỏi nhạc nền, bạn đợi xíu nhé — khoảng 6 phút nữa xong.');
    assert.notEqual(cauNoi(t, 1, 6 * 60), cauNoi(t, 0, 6 * 60));
    assert.equal(cauNoi(t, 2, 6 * 60), cauNoi(t, 0, 6 * 60));
    assert.match(cauNoi(t, 0, null), /đang ước lượng thời gian/);
    assert.match(cauNoi(tinhTienDo({ trangThai: 'cho_tai_len', buoc: null, phanTram: 0 }), 0, null, 42), /42%/);
    assert.match(cauNoi(tinhTienDo({ trangThai: 'loi', buoc: 'Dịch 3/9 câu', phanTram: 40 }), 0, null), /"Dịch"/);
  });
  it('moTaBanRa', () => {
    assert.equal(moTaBanRa('ca-hai', 0.15), 'Kết quả: 2 video — chỉ giọng Việt · song ngữ (giọng gốc nhỏ 15%)');
    assert.equal(moTaBanRa('vi', 0.15), 'Kết quả: 1 video — chỉ giọng Việt');
    assert.match(moTaBanRa('vi-goc', 0.2), /20%/);
  });
});
