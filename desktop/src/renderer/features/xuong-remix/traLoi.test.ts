/**
 * Kiểm lớp đọc câu trả lời của AI kèm cặp.
 *
 * Vì sao đáng viết: ngày 12/09/2026 một lời gọi trả về sai hình dạng đã làm
 * `traLoiAi.soLa.length` ném GIỮA LÚC VẼ. React 18 gỡ cả cây khi không có
 * error boundary, nên triệu chứng là màn hình TRẮNG, không lỗi nào hiện lên —
 * và mất nửa buổi mới lần ra, vì chỗ vỡ chẳng liên quan gì tới chỗ sai.
 *
 * Kiểu TypeScript không cứu được: `api.request<TraLoiAi>()` chỉ là một lời
 * hứa lúc dịch. Những phép kiểm dưới đây là chỗ duy nhất lời hứa ấy được đối
 * chiếu với thực tế.
 */
import { describe, it, expect } from 'vitest';
import { docTraLoi } from './traLoi';

const DAY = { traLoi: 'Hạ trần xuống -1 dBTP.', model: 'claude-sonnet-5', soLa: ['200'], biCat: true };

describe('docTraLoi', () => {
  it('giữ nguyên câu trả lời đầy đủ', () => {
    expect(docTraLoi(DAY)).toEqual(DAY);
  });

  it('⭐ thiếu soLa thì thành mảng rỗng, KHÔNG phải undefined', () => {
    // Đây đúng là hình dạng đã làm trang trắng: `.length` của undefined.
    const r = docTraLoi({ traLoi: 'x', model: 'm' });
    expect(r?.soLa).toEqual([]);
    expect(r?.biCat).toBe(false);
  });

  it('lọc phần tử không phải chuỗi trong soLa', () => {
    // `soLa.join(', ')` sẽ in "null" nếu để lọt — một cảnh báo bịa số mà chính
    // nó lại bịa ra một con số.
    expect(docTraLoi({ traLoi: 'x', soLa: ['200', 3500, null] })?.soLa).toEqual(['200']);
  });

  it('câu trả lời rỗng hay chỉ có khoảng trắng thì trả null', () => {
    expect(docTraLoi({ traLoi: '   ', model: 'm' })).toBeNull();
    expect(docTraLoi({ model: 'm' })).toBeNull();
  });

  it('null, undefined và giá trị không phải object đều trả null', () => {
    // Cầu nối giả của bộ đo bố cục trả `{data:[],items:[],results:[]}` khi lời
    // gọi hỏng — một object KHÔNG rỗng nhưng sai hẳn hình dạng.
    for (const x of [null, undefined, 42, 'chuỗi', [], { data: [], items: [] }]) {
      expect(docTraLoi(x)).toBeNull();
    }
  });

  it('biCat chỉ đúng khi đúng bằng true', () => {
    // Cờ này bật một dòng cảnh báo. Nhận "true" dạng chuỗi hay 1 là bật nhầm.
    expect(docTraLoi({ traLoi: 'x', biCat: 'true' })?.biCat).toBe(false);
    expect(docTraLoi({ traLoi: 'x', biCat: 1 })?.biCat).toBe(false);
  });
});
