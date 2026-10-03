/**
 * Gốc lỗi 413 phía app (03/10/2026): ảnh cũ cõng lên ở mọi vòng. Xem `thanGui.ts`.
 */
import { describe, expect, it } from 'vitest';

import {
  ANH_DA_GO, chuanBiThan, ghepTomTat, goAnhCu, noiDungTomTat, phanTichNguCanh, type TinGui,
} from './thanGui';

const anhTo = (kb: number): string => `data:image/png;base64,${'A'.repeat(kb * 1024)}`;

function luotCoAnh(i: number, kb = 10): TinGui[] {
  return [
    { role: 'user', content: [{ type: 'text', text: `câu ${i}` }, { type: 'image_url', image_url: { url: anhTo(kb) } }] },
    { role: 'assistant', content: null, tool_calls: [{ id: `w${i}`, type: 'function', function: { name: 'web_anh', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: `w${i}`, content: 'đã chụp', anh: [{ media_type: 'image/png', data: 'B'.repeat(kb * 1024) }] },
    { role: 'assistant', content: `trả lời ${i}` },
  ];
}

describe('gỡ ảnh cũ', () => {
  it('chỉ giữ ảnh của N lượt gần nhất; ảnh cũ thành dòng chữ', () => {
    const ds = [0, 1, 2, 3].flatMap((i) => luotCoAnh(i));
    const { messages, soAnhDaGo } = goAnhCu(ds, 2);
    expect(soAnhDaGo).toBe(4); // 2 lượt đầu × (1 ảnh user + 1 ảnh tool)
    expect(JSON.stringify(messages[0])).toContain(ANH_DA_GO);
    expect(JSON.stringify(messages[0])).not.toContain('image_url');
    expect(messages[2]!.anh).toBeUndefined();
    expect(messages[2]!.content).toContain(ANH_DA_GO);
    // Hai lượt cuối còn nguyên ảnh.
    expect(JSON.stringify(messages[8])).toContain('image_url');
    expect(messages[10]!.anh?.length).toBe(1);
  });

  it('KHÔNG bỏ tin nào — mỗi tool_call vẫn có tin tool trả lời', () => {
    const ds = [0, 1, 2].flatMap((i) => luotCoAnh(i));
    const { messages } = goAnhCu(ds, 0);
    expect(messages.length).toBe(ds.length);
    expect(messages.filter((m) => m.role === 'tool').map((m) => m.tool_call_id)).toEqual(['w0', 'w1', 'w2']);
    expect(JSON.stringify(messages)).not.toContain('image_url');
  });

  it('không có ảnh để gỡ ⇒ trả lại CHÍNH mảng (không sao chép mỗi vòng)', () => {
    const ds: TinGui[] = [{ role: 'user', content: 'chào' }, { role: 'assistant', content: 'chào' }];
    expect(goAnhCu(ds).messages).toBe(ds);
  });

  it('không đụng mảng gốc (bản lưu phiên giữ nguyên ảnh)', () => {
    const ds = [0, 1, 2].flatMap((i) => luotCoAnh(i));
    goAnhCu(ds, 0);
    expect(ds[2]!.anh?.length).toBe(1);
  });
});

describe('tự gỡ thêm khi thân vượt trần', () => {
  it('thân > trần ⇒ giảm số lượt giữ ảnh cho tới khi lọt', () => {
    const ds = [0, 1, 2, 3].flatMap((i) => luotCoAnh(i, 100)); // ~200KB/lượt
    const dung = (m: TinGui[]): string => JSON.stringify({ messages: m });
    const kq = chuanBiThan(dung, ds, { giuLuot: 2, tran: 300 * 1024 });
    expect(kq.kichThuoc).toBeLessThanOrEqual(300 * 1024);
    expect(kq.giuLuot).toBe(1);
  });

  it('gỡ sạch vẫn vượt ⇒ vẫn gửi (để máy chủ 413 và chỗ gọi xử lý), không lặp vô hạn', () => {
    const ds: TinGui[] = [{ role: 'user', content: 'x'.repeat(5000) }];
    const kq = chuanBiThan((m) => JSON.stringify(m), ds, { tran: 100 });
    expect(kq.giuLuot).toBe(0);
    expect(kq.kichThuoc).toBeGreaterThan(100);
  });
});

describe('/compact — ghép bản tóm tắt vào hội thoại gửi lên', () => {
  const ds: TinGui[] = [
    { role: 'user', content: 'đề bài' }, { role: 'assistant', content: 'a' },
    { role: 'user', content: 'câu 2' }, { role: 'assistant', content: 'b' },
    { role: 'user', content: 'câu 3' }, { role: 'assistant', content: 'c' },
  ];

  it('thay phần đã gộp bằng cặp user/assistant chở bản tóm tắt', () => {
    const tt = { soTinDaGop: 4, noiDung: noiDungTomTat('đề bài', '- đã làm A', 2), luc: 1 };
    const gui = ghepTomTat(ds, tt);
    expect(gui.length).toBe(4);
    expect(gui[0]!.content).toContain('BẢN TÓM TẮT 2 lượt');
    expect(gui[0]!.content).toContain('đề bài');
    expect(gui[1]!.role).toBe('assistant');
    expect(gui[2]!.content).toBe('câu 3');
  });

  it('hội thoại đã bị quay lui ngắn hơn phần gộp ⇒ bỏ qua bản tóm tắt', () => {
    expect(ghepTomTat(ds.slice(0, 2), { soTinDaGop: 4, noiDung: 'x', luc: 1 })).toEqual(ds.slice(0, 2));
  });

  it('/context đếm đúng từng phần và phần SẼ GỬI sau compact', () => {
    const ct = phanTichNguCanh([...luotCoAnh(0, 1), ...ds], null);
    expect(ct.deBai).toBe('câu 0'.length);
    expect(ct.soAnh).toBe(2);
    expect(ct.ketQuaTool).toBe('web_anh'.length + 2 + 'đã chụp'.length);
    expect(ct.soLuot).toBe(4);
    const sau = phanTichNguCanh(ds, { soTinDaGop: 4, noiDung: 'ngắn', luc: 1 });
    expect(sau.tongGui).toBeLessThan(sau.tong + 200);
    expect(sau.tongGui).not.toBe(sau.tong);
  });
});
