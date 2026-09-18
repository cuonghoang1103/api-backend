import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  bacUyTin, cauSapHetGio, congCoTran, mocHetGio,
  mucCong, mucTru, mucTruTre, thucCong, TRAN_CONG_NGAY, UY_TIN_DAU,
} from './uyTin.js';

describe('mức trừ khi trượt', () => {
  it('đúng khoảng 1–9 mà người dùng yêu cầu', () => {
    assert.equal(mucTru(1, 1), 1);   // dễ + không quan trọng
    assert.equal(mucTru(3, 3), 9);   // khó + tối quan trọng
    assert.equal(mucTru(2, 2), 4);
  });

  it('⛔ KHÔNG BAO GIỜ trả 0, kể cả việc cũ chưa chọn mức', () => {
    // Đây là ca ĐÔNG NHẤT ngay sau khi tính năng lên: mọi việc đã có
    // trong DB đều mang do_kho = 0. Trả 0 nghĩa là trượt không mất gì,
    // và cả hệ thống uy tín thành trang trí đúng vào ngày đầu tiên.
    for (const [k, q] of [[0, 0], [0, 3], [3, 0], [null, null], [undefined, undefined]] as const) {
      assert.ok(mucTru(k, q) >= 1, `mucTru(${k}, ${q}) phải ≥ 1`);
    }
    assert.equal(mucTru(0, 0), 4, 'chưa chọn thì coi như vừa × vừa');
  });

  it('không vượt 9 dù truyền số lớn', () => {
    assert.equal(mucTru(99, 99), 9);
  });

  it('phân biệt được "khó mà không gấp" với "vừa khó vừa gấp"', () => {
    // Cộng hai thang (3+1 = 4 và 3+3 = 6) cũng phân biệt được, nhưng
    // nhân cho khoảng cách đúng hơn: 3 so với 9, không phải 4 so với 6.
    assert.ok(mucTru(3, 3) - mucTru(3, 1) === 6);
  });
});

describe('mức trừ khi xong TRỄ', () => {
  it('bằng một nửa mức trượt, làm tròn XUỐNG', () => {
    assert.equal(mucTruTre(3, 3), 4);  // floor(9/2)
    assert.equal(mucTruTre(2, 2), 2);  // floor(4/2)
    // Việc dễ nhất + không quan trọng mà trễ thì KHÔNG mất điểm. Đúng,
    // không phải lỗ hổng: bỏ hẳn không làm vẫn mất 1.
    assert.equal(mucTruTre(1, 1), 0);
    assert.equal(mucTru(1, 1), 1);
  });

  it('LUÔN nhẹ hơn trượt hẳn', () => {
    // Nếu trễ bị phạt ngang trượt, người dùng học được rằng việc đã
    // quá giờ thì bỏ luôn cũng thế — hành vi tệ nhất trong tất cả.
    for (let k = 1; k <= 3; k += 1) {
      for (let q = 1; q <= 3; q += 1) {
        assert.ok(mucTruTre(k, q) < mucTru(k, q), `${k}×${q}: trễ phải nhẹ hơn trượt`);
      }
    }
  });
});

describe('mức cộng khi xong đúng hạn', () => {
  it('nằm trong 1–3', () => {
    assert.equal(mucCong(1, 1), 1);
    assert.equal(mucCong(3, 3), 3);
    assert.ok(mucCong(2, 2) >= 1 && mucCong(2, 2) <= 3);
  });

  it('BẤT ĐỐI XỨNG với mức trừ — xây chậm, mất nhanh', () => {
    // Cho cộng ngang trừ thì một tuần chăm chỉ xoá sạch một tuần bê
    // trễ, và con số không còn trí nhớ về độ tin cậy.
    assert.ok(mucCong(3, 3) * 3 === mucTru(3, 3));
  });
});

describe('trần cộng mỗi ngày', () => {
  it('cắt phần vượt trần', () => {
    assert.equal(congCoTran(3, 9, 10), 1);
    assert.equal(congCoTran(3, 10, 10), 0);
  });

  it('⛔ chặn cày điểm bằng 50 việc vặt', () => {
    // Không có trần thì cách tối ưu để có uy tín cao là tạo thật nhiều
    // việc dễ lúc 23h rồi tích hết.
    let cong = 0;
    for (let i = 0; i < 50; i += 1) cong += congCoTran(mucCong(1, 1), cong);
    assert.equal(cong, TRAN_CONG_NGAY);
  });

  it('không cộng âm', () => {
    assert.equal(congCoTran(-5, 0), 0);
    assert.equal(congCoTran(2, -99, 10), 2, 'bộ đếm âm không được biến thành trần rộng hơn');
  });
});

describe('mốc hết giờ', () => {
  it('ưu tiên hạn chót người dùng đặt', () => {
    const d = mocHetGio({ dueAt: '2026-09-18T18:00:00.000Z', batDauAt: '2026-09-18T14:00:00.000Z', phutLam: 30 });
    assert.equal(d?.toISOString(), '2026-09-18T18:00:00.000Z');
  });

  it('không có hạn thì SUY RA từ giờ bắt đầu + thời lượng', () => {
    // "14:00, làm 90 phút" đã ngầm nói hạn là 15:30 — bắt gõ lại là thừa.
    const d = mocHetGio({ batDauAt: '2026-09-18T14:00:00.000Z', phutLam: 90 });
    assert.equal(d?.toISOString(), '2026-09-18T15:30:00.000Z');
  });

  it('⛔ việc KHÔNG hẹn giờ thì không có mốc ⇒ không bao giờ tự đánh trượt', () => {
    // Lối thoát bắt buộc: phần lớn việc trong DB hiện tại không có giờ,
    // và tự đánh trượt hết là trừ sạch uy tín của mọi người trong đêm
    // deploy đầu tiên.
    assert.equal(mocHetGio({}), null);
    assert.equal(mocHetGio({ batDauAt: '2026-09-18T14:00:00.000Z' }), null, 'có giờ bắt đầu mà không có thời lượng thì vẫn là không hạn');
    assert.equal(mocHetGio({ phutLam: 30 }), null);
  });

  it('ngày giờ rác không làm sập, trả null', () => {
    assert.equal(mocHetGio({ dueAt: 'không phải ngày' }), null);
  });
});

describe('bậc uy tín', () => {
  it('điểm khởi đầu 100 nằm ở bậc "Tốt"', () => {
    assert.equal(UY_TIN_DAU, 100);
    assert.equal(bacUyTin(UY_TIN_DAU).ma, 'tot');
  });

  it('ÂM là bậc riêng, không gộp vào "báo động"', () => {
    // Kẹp sàn 0 thì người trượt 30 việc và người trượt 3 việc nhìn
    // giống hệt nhau, và con số mất hết khả năng nói thật.
    assert.equal(bacUyTin(0).ma, 'baoDong');
    assert.equal(bacUyTin(-1).ma, 'no');
    assert.equal(bacUyTin(-80).ma, 'no');
  });

  it('mọi bậc đều có màu và một câu nói người dùng hiểu được', () => {
    for (const d of [200, 110, 90, 60, 10, -10]) {
      const b = bacUyTin(d);
      assert.match(b.mau, /^#[0-9a-f]{6}$/i, `${d}: thiếu màu`);
      assert.ok(b.mo.length > 10, `${d}: câu mô tả quá cụt`);
    }
  });
});

describe('câu thông báo', () => {
  it('câu "sắp hết giờ" nói ĐÚNG lời người dùng đặt hàng', () => {
    const c = cauSapHetGio('Ôn SWR302');
    assert.ok(c.includes('Ôn SWR302'), 'phải gọi tên việc, không nói trống không');
    assert.ok(c.includes('xong chưa'));
    assert.ok(c.includes('điểm danh'));
  });
});

describe('hoàn tác KHÔNG chịu trần ngày', () => {
  it('cộng thường thì bị trần cắt', () => {
    assert.equal(thucCong(3, false, 9, 10), 1);
    assert.equal(thucCong(3, false, 10, 10), 0);
  });

  it('⛔ hoàn tác đi qua trần NGUYÊN VẸN', () => {
    // Lỗi này tìm ra bằng cách CHẠY, không phải đọc. Để trần ăn phần
    // hoàn thì `POST /tasks/:id/hoan` sinh ra trạng thái mâu thuẫn: hồ
    // sơ việc nói "chưa từng bị trừ" (truotLuc = null, daTruUyTin = null)
    // mà điểm thì đã mất và không đường nào lấy lại.
    assert.equal(thucCong(9, true, 10, 10), 9, 'đã chạm trần vẫn phải hoàn đủ');
    assert.equal(thucCong(9, true, 999, 10), 9);
  });

  it('trừ điểm không bao giờ bị trần đụng vào', () => {
    assert.equal(thucCong(-9, false, 10, 10), -9);
  });
});
