import { describe, expect, it } from 'vitest';

import {
  anhKemLai, lichSuGui, SO_LUOT_NGU_CANH, TAM_NHO_ANH,
  themLuot, TOI_DA_ANH_KEM_LAI, type LuotChat,
} from './nguCanhChat';

const hoi = (chu: string, anh?: string[]): LuotChat => ({ vai: 'user', chu, anh });
const dap = (chu: string): LuotChat => ({ vai: 'assistant', chu });

describe('lịch sử gửi lên', () => {
  it('giữ đúng vai và thứ tự', () => {
    expect(lichSuGui([hoi('A'), dap('B')])).toEqual([
      { role: 'user', content: 'A' },
      { role: 'assistant', content: 'B' },
    ]);
  });

  it(`cắt còn ${SO_LUOT_NGU_CANH} lượt CUỐI, không phải đầu`, () => {
    const ds = Array.from({ length: 30 }, (_, i) => hoi(`câu ${i}`));
    const r = lichSuGui(ds);
    expect(r).toHaveLength(SO_LUOT_NGU_CANH);
    expect(r[r.length - 1]!.content).toBe('câu 29');
  });

  it('bỏ lượt rỗng — chúng chỉ tốn token và làm model bối rối', () => {
    expect(lichSuGui([hoi('A'), dap('   '), hoi('B')])).toHaveLength(2);
  });

  it('⛔ danh sách RỖNG ⇒ mảng rỗng, KHÔNG phải undefined', () => {
    // Máy chủ `sanitizeHistory` nhận mảng; gửi undefined là rơi về [] ở đó
    // nhưng đường đi khác nhau, và chỗ gọi hay quên `?? []`.
    expect(lichSuGui([])).toEqual([]);
  });
});

describe('ảnh kèm lại', () => {
  it('có ảnh mới thì dùng ảnh mới, không đụng lịch sử', () => {
    expect(anhKemLai([hoi('cũ', ['data:a'])], ['data:moi'])).toEqual(['data:moi']);
  });

  it('⛔ hỏi tiếp mà KHÔNG đính gì ⇒ kèm lại ảnh của lượt gần nhất', () => {
    // Đây là cả lý do hàm này tồn tại. Người dùng gửi ảnh đề, rồi hỏi "câu b
    // thì sao" — không kèm lại thì model không còn thấy đề và xin gửi lại ảnh.
    const luot = [hoi('giải giúp', ['data:de']), dap('đây bạn'), hoi('câu b thì sao')];
    expect(anhKemLai(luot.slice(0, 2))).toEqual(['data:de']);
  });

  it(`không kèm ảnh đã trôi quá ${TAM_NHO_ANH} lượt — mỗi lần gửi lại là một lần trả tiền`, () => {
    const luot = [hoi('đề', ['data:de']), ...Array.from({ length: 8 }, (_, i) => dap(`đáp ${i}`))];
    expect(anhKemLai(luot)).toBeUndefined();
  });

  it(`kèm tối đa ${TOI_DA_ANH_KEM_LAI} ảnh`, () => {
    expect(anhKemLai([hoi('đề', ['a', 'b', 'c', 'd'])])).toHaveLength(TOI_DA_ANH_KEM_LAI);
  });

  it('⛔ ảnh của TRỢ LÝ không bao giờ bị kèm lại', () => {
    // Chỉ ảnh NGƯỜI DÙNG đính mới là đề bài. Kèm lại thứ model sinh ra là
    // cho nó đọc lại chính nó.
    const luot: LuotChat[] = [{ vai: 'assistant', chu: 'hình minh hoạ', anh: ['data:cua-may'] }];
    expect(anhKemLai(luot)).toBeUndefined();
  });

  it('chưa từng có ảnh ⇒ undefined, không phải mảng rỗng', () => {
    expect(anhKemLai([hoi('xin chào'), dap('chào bạn')])).toBeUndefined();
  });
});

describe('vòng nhớ', () => {
  it('giữ xa hơn cửa sổ ngữ cảnh để không đánh rơi ảnh vừa trôi ra', () => {
    let luot: LuotChat[] = [];
    for (let i = 0; i < 40; i += 1) luot = themLuot(luot, hoi(`câu ${i}`));
    expect(luot).toHaveLength(SO_LUOT_NGU_CANH * 2);
    expect(luot.length).toBeGreaterThan(SO_LUOT_NGU_CANH);
  });

  it('không sửa mảng gốc', () => {
    const goc = [hoi('A')];
    themLuot(goc, hoi('B'));
    expect(goc).toHaveLength(1);
  });
});
