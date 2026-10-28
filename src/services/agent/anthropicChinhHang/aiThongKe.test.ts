import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CAU_HOI_SAN, CUA_SO_TU_XU_LY_MS, laLoiTruocLuong, locHanhDong, nhanMaLoi, phanTichLoi, tachJson, tiLeLoiThat } from './aiThongKe.js';

const xepHang = [
  { userId: 7, ten: 'An', goi: 'pro' },
  { userId: 9, ten: 'Admin', goi: 'admin' },
  { userId: null, ten: 'Hệ thống', goi: 'không rõ' },
] as never;

describe('aiThongKe', () => {
  it('tachJson đọc cả khi model bọc ```json', () => {
    assert.deepEqual(tachJson('```json\n{"traLoi":"ok","hanhDong":[]}\n```'), { traLoi: 'ok', hanhDong: [] });
    assert.equal(tachJson('không có json'), null);
  });

  it('locHanhDong chỉ giữ đề xuất hợp lệ: đúng người, không admin, số trong 0–1000', () => {
    const ra = locHanhDong([
      { loai: 'dat_tran', userId: 7, hang: 'free', ngayUsd: 3, thangUsd: 40, lyDo: 'vọt gấp 5' },
      { loai: 'dat_tran', userId: 9, hang: 'free', ngayUsd: 1 },       // admin ⇒ bỏ
      { loai: 'dat_tran', userId: 123, hang: 'free', ngayUsd: 1 },     // không có trong bảng ⇒ bỏ
      { loai: 'dat_tran', userId: 7, hang: 'cao', ngayUsd: 99999 },    // ngoài khoảng, không có số khác ⇒ bỏ
      { loai: 'dat_tran', userId: 7, hang: 'cao' },                    // không có số nào ⇒ bỏ
      { loai: 'xoa_tran', userId: 7, lyDo: 'về theo gói' },
      { loai: 'xoa', userId: 7 },                                      // loại lạ ⇒ bỏ
    ], { xepHang });
    assert.equal(ra.length, 2);
    assert.deepEqual(ra[0], { loai: 'dat_tran', userId: 7, ten: 'An', hang: 'free', ngayUsd: 3, thangUsd: 40, lyDo: 'vọt gấp 5' });
    assert.equal(ra[1]!.loai, 'xoa_tran');
    assert.deepEqual(locHanhDong('x', { xepHang }), []);
  });

  it('câu hỏi có sẵn có id duy nhất', () => {
    const ids = CAU_HOI_SAN.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.includes('xep-hang') && ids.includes('de-xuat'));
  });
  describe('phanTichLoi — lần thử hỏng đã tự xử lý vs lỗi người dùng thấy', () => {
    const T0 = Date.UTC(2026, 9, 28, 3, 0, 0);
    const luc = (giay: number) => new Date(T0 + giay * 1000);
    const hong = (userId: number | null, viec: string, maLoi: string | null, giay: number) => ({ userId, viec, maLoi, createdAt: luc(giay) });
    /** Dòng thành công được ghi khi luồng XONG: bắt đầu = createdAt − thoiGianMs. */
    const ok = (userId: number | null, viec: string, batDauGiay: number, dai = 30) =>
      ({ userId, viec, createdAt: luc(batDauGiay + dai), thoiGianMs: dai * 1000 });

    it('429 rồi key kế thành công ngay ⇒ tự xử lý; luồng dài 3 phút vẫn khớp vì tính từ lúc BẮT ĐẦU', () => {
      const r = phanTichLoi([hong(7, 'agent_code', 'HTTP_429', 0)], [ok(7, 'agent_code', 0.2, 180)]);
      assert.deepEqual([r.chung.tong, r.chung.tuXuLy, r.chung.that], [1, 1, 0]);
      assert.equal(r.theoNguoi.get(7)!.tuXuLy, 1);
    });

    it('400 tham số beta rồi bản tối giản thành công (cùng key) ⇒ tự xử lý; thành công bắt đầu hơi TRƯỚC dòng hỏng vẫn khớp', () => {
      const r = phanTichLoi([hong(7, 'agent_code', 'HTTP_400', 10)], [ok(7, 'agent_code', 9)]);
      assert.equal(r.chung.tuXuLy, 1);
    });

    it('không có thành công / khác việc / khác người / quá cửa sổ / thành công TRƯỚC đó ⇒ lỗi thật', () => {
      const r = phanTichLoi([
        hong(7, 'agent_code', 'HTTP_529', 0),                // không có gì sau
        hong(8, 'agent_code', 'HTTP_529', 0),                // thành công là của việc khác
        hong(9, 'exam_tutor', 'MANG', 0),                    // thành công là của người khác
        hong(10, 'agent_code', 'HTTP_429', 0),               // thành công quá 120 s
        hong(11, 'agent_code', 'HTTP_429', 600),             // thành công từ 10 phút trước
      ], [
        ok(8, 'work_ai', 1), ok(99, 'exam_tutor', 1),
        ok(10, 'agent_code', CUA_SO_TU_XU_LY_MS / 1000 + 5), ok(11, 'agent_code', 0),
      ]);
      assert.deepEqual([r.chung.tong, r.chung.tuXuLy, r.chung.that], [5, 0, 5]);
    });

    it('luồng đứt giữa chừng (LUONG_GAY / không mã) luôn là lỗi thật — cổng không gửi lại', () => {
      const r = phanTichLoi([hong(7, 'agent_code', 'LUONG_GAY', 0), hong(7, 'agent_code', null, 1)], [ok(7, 'agent_code', 2)]);
      assert.deepEqual([r.chung.tuXuLy, r.chung.that], [0, 2]);
      assert.deepEqual(r.chung.theoMa.map((m) => m.ma).sort(), ['KHONG_MA', 'LUONG_GAY']);
      assert.match(r.chung.theoMa[0]!.nhan, /đứt giữa chừng/);
    });

    it('chia theo mã + theo người (kể cả dòng không gắn người) — mô phỏng 14 lần thử hỏng, 2 thật', () => {
      const loi = [
        ...Array.from({ length: 6 }, (_, i) => hong(1, 'agent_code', 'HTTP_429', i * 300)),
        ...Array.from({ length: 4 }, (_, i) => hong(1, 'agent_code', 'HTTP_529', i * 300 + 50)),
        hong(1, 'agent_code', 'HTTP_400', 2000), hong(1, 'agent_code', 'MANG', 2100),
        hong(1, 'agent_code', 'HTTP_529', 5000), hong(null, 'thu_ket_noi', 'HTTP_401', 0),
      ];
      const thanhCong = [
        ...Array.from({ length: 6 }, (_, i) => ok(1, 'agent_code', i * 300 + 1)),
        ...Array.from({ length: 4 }, (_, i) => ok(1, 'agent_code', i * 300 + 51)),
        ok(1, 'agent_code', 2001), ok(1, 'agent_code', 2101),
      ];
      const r = phanTichLoi(loi, thanhCong);
      assert.deepEqual([r.chung.tong, r.chung.tuXuLy, r.chung.that], [14, 12, 2]);
      const m = Object.fromEntries(r.chung.theoMa.map((x) => [x.ma, [x.tong, x.tuXuLy, x.that]]));
      assert.deepEqual(m, { HTTP_429: [6, 6, 0], HTTP_529: [5, 4, 1], HTTP_400: [1, 1, 0], MANG: [1, 1, 0], HTTP_401: [1, 0, 1] });
      assert.equal(r.chung.theoMa[0]!.ma, 'HTTP_429', 'mã nhiều nhất đứng đầu');
      assert.deepEqual([r.theoNguoi.get(1)!.tong, r.theoNguoi.get(1)!.that], [13, 1]);
      assert.deepEqual([r.theoNguoi.get(null)!.tong, r.theoNguoi.get(null)!.that], [1, 1]);
      // 91 dòng sổ, 14 lần thử hỏng ⇒ 77 thành công + 2 thật = 79 yêu cầu ⇒ 2,5 %.
      assert.equal(tiLeLoiThat(91, r.chung), 2.5);
      assert.equal(tiLeLoiThat(0, { tong: 0, that: 0 }), null);
    });

    it('nhãn + loại mã lỗi', () => {
      assert.ok(laLoiTruocLuong('HTTP_429') && laLoiTruocLuong('MANG'));
      assert.ok(!laLoiTruocLuong('LUONG_GAY') && !laLoiTruocLuong(null) && !laLoiTruocLuong('HTTP_X'));
      assert.match(nhanMaLoi('HTTP_429'), /giới hạn tốc độ/);
      assert.match(nhanMaLoi('HTTP_529'), /quá tải/);
      assert.match(nhanMaLoi('HTTP_400'), /beta\/thinking/);
      assert.match(nhanMaLoi('HTTP_503'), /lỗi máy chủ \(503\)/);
      assert.match(nhanMaLoi('MANG'), /mạng/);
    });
  });
});
