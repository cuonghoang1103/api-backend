import { describe, expect, it } from 'vitest';

import {
  cauSapHetGio, cauSapToi, cauVuaTruot, moTaKhoang,
  viecGanNhat, XA_NHAT_PHUT, type ViecNhac,
} from './nhacKeHoach';

const NEO = new Date(2026, 8, 18, 14, 0, 0).getTime();

function v(p: Partial<ViecNhac> & { title: string }): ViecNhac {
  return {
    id: 1, done: false, truotLuc: null, batDauAt: null, phutLam: null,
    doKho: 2, priority: 2, truNeuTruot: 4, ...p,
  };
}
const luc = (h: number, m = 0) => new Date(2026, 8, 18, h, m).toISOString();

describe('việc sắp tới gần nhất', () => {
  it('chọn việc gần nhất về phía TRƯỚC', () => {
    const r = viecGanNhat([
      v({ title: 'Xa', batDauAt: luc(16) }),
      v({ title: 'Gần', batDauAt: luc(14, 30) }),
    ], NEO);
    expect(r?.viec.title).toBe('Gần');
    expect(r?.phut).toBe(30);
  });

  it('⛔ bỏ qua việc ĐÃ XONG và việc ĐÃ TRƯỢT', () => {
    // Nhắc "sắp tới giờ" cho một việc đã trượt là thông tin SAI, và nó
    // làm người dùng ngừng tin mọi câu robot nói sau đó.
    const r = viecGanNhat([
      v({ title: 'Xong rồi', batDauAt: luc(14, 10), done: true }),
      v({ title: 'Trượt rồi', batDauAt: luc(14, 20), truotLuc: luc(13) }),
      v({ title: 'Còn phải làm', batDauAt: luc(15) }),
    ], NEO);
    expect(r?.viec.title).toBe('Còn phải làm');
  });

  it('bỏ qua việc đã QUA giờ bắt đầu', () => {
    expect(viecGanNhat([v({ title: 'Qua rồi', batDauAt: luc(13) })], NEO)).toBeNull();
  });

  it(`bỏ qua việc xa hơn ${XA_NHAT_PHUT} phút`, () => {
    // Nhắc việc của 4 tiếng nữa là làm phiền, không phải giúp đỡ.
    expect(viecGanNhat([v({ title: 'Tối mai', batDauAt: luc(23) })], NEO)).toBeNull();
  });

  it('việc KHÔNG hẹn giờ thì không bao giờ được nhắc', () => {
    expect(viecGanNhat([v({ title: 'Không giờ', batDauAt: null })], NEO)).toBeNull();
  });

  it('danh sách rỗng trả null, không ném', () => {
    expect(viecGanNhat([], NEO)).toBeNull();
  });
});

describe('mô tả khoảng thời gian', () => {
  it('viết như người nói', () => {
    expect(moTaKhoang(0)).toBe('ngay bây giờ');
    expect(moTaKhoang(1)).toBe('ngay bây giờ');
    expect(moTaKhoang(45)).toBe('45 phút nữa');
    expect(moTaKhoang(60)).toBe('1 tiếng nữa');
    expect(moTaKhoang(90)).toBe('1 tiếng rưỡi nữa');
    expect(moTaKhoang(100)).toBe('1 tiếng 40 phút nữa');
  });
});

describe('câu robot nói', () => {
  it('nói tên việc và thời lượng dự kiến', () => {
    const c = cauSapToi(v({ title: 'Ôn SWR302', phutLam: 90 }), 15);
    expect(c).toContain('Ôn SWR302');
    expect(c).toContain('15 phút nữa');
    expect(c).toContain('90 phút');
  });

  it('không có thời lượng thì không bịa ra', () => {
    expect(cauSapToi(v({ title: 'Họp' }), 30)).toBe('30 phút nữa: Họp.');
  });

  it('⛔ câu "sắp hết giờ" giữ NGUYÊN VĂN người dùng đặt hàng', () => {
    // Đây là câu họ sẽ nghe hàng chục lần một tuần, và họ đã nói ra chính
    // xác cái họ muốn nghe. "Viết lại cho mượt" là tự ý đổi đơn hàng.
    const c = cauSapHetGio('Ôn SWR302');
    expect(c).toContain('Ôn SWR302');
    expect(c).toContain('bạn làm việc xong chưa');
    expect(c).toContain('còn chấm điểm danh');
  });
});

describe('câu báo vừa trượt', () => {
  it('nói rõ MẤT bao nhiêu và CÒN bao nhiêu', () => {
    const c = cauVuaTruot([{ title: 'Ôn thi', tru: 9 }], 91);
    expect(c).toContain('Ôn thi');
    expect(c).toContain('9');
    expect(c).toContain('91');
    expect(c).toContain('hoàn lại một nửa');  // luôn chỉ ra đường về
  });

  it('nhiều việc thì gộp lại, không đọc tên từng cái', () => {
    const c = cauVuaTruot([{ title: 'A', tru: 3 }, { title: 'B', tru: 4 }], 80);
    expect(c).toContain('2 việc');
    expect(c).toContain('7');
    expect(c).not.toContain('"A"');
  });

  it('không có việc nào trượt thì KHÔNG nói gì', () => {
    // Robot lên tiếng để báo "không có gì xảy ra" là loại nhiễu khiến
    // người ta tắt nó đi.
    expect(cauVuaTruot([], 100)).toBe('');
  });

  it('chưa biết điểm thì không bịa con số', () => {
    expect(cauVuaTruot([{ title: 'A', tru: 3 }], null)).not.toContain('Uy tín còn');
  });
});
