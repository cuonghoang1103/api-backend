/**
 * Chốt rằng bảng giấy phép ở GIAO DIỆN khớp với bảng ở MAIN.
 *
 * Renderer không nạp được mã main, nên bảng bị chép sang. Chép là mầm trôi dạt
 * — đúng bài học `seed.ts` trong CLAUDE.md (08/08/2026): `prisma/seed.ts` tự
 * chép lại union rồi tự kiểm với chính nó, qua sạch checklist, vỡ trên
 * production. Phép kiểm này là thứ duy nhất giữ hai bên khớp nhau.
 *
 * Ở đây nó gác một thứ nặng hơn một cái nhãn: `dienDuoc` là con số app dám
 * trả lời thay người dùng về chuyện đem bài đi diễn. Hai bảng lệch nhau nghĩa
 * là giao diện nói "được" trong khi bên kia nói "không".
 */
import { describe, expect, it } from 'vitest';
import { GIAY_PHEP, NGUON_MAU } from '../../../main/nhac/khoMau';
import { GIAY_PHEP_UI, NGUON_UI, traUI } from './KhoMau';

describe('bảng giấy phép hai bên khớp nhau', () => {
  it('⭐ CÙNG bộ mã, cùng thứ tự', () => {
    expect(GIAY_PHEP_UI.map((g) => g.ma)).toEqual(GIAY_PHEP.map((g) => g.ma));
  });

  it('⭐ `dienDuoc` giống hệt từng dòng', () => {
    for (const g of GIAY_PHEP) {
      expect(traUI(g.ma).dienDuoc, g.ma).toBe(g.dienDuoc);
    }
  });

  it('mã lạ ở giao diện cũng rơi về "chưa rõ", không rơi về dễ dãi', () => {
    expect(traUI('khong-co-that').ma).toBe('khac');
    expect(traUI('khong-co-that').dienDuoc).toBe(false);
  });
});

describe('bảng nguồn hai bên khớp nhau', () => {
  it('⭐ CÙNG mã và CÙNG đường dẫn', () => {
    /* URL lệch nhau thì nút mở một trang, còn phần mô tả nói về trang khác. */
    expect(NGUON_UI.map((n) => n.ma)).toEqual(NGUON_MAU.map((n) => n.ma));
    for (const n of NGUON_MAU) {
      expect(NGUON_UI.find((u) => u.ma === n.ma)?.url, n.ma).toBe(n.url);
    }
  });
});
