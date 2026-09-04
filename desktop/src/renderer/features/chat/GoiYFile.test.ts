/**
 * Đọc đoạn `@…` quanh con trỏ — phần dễ sai nhất của gợi ý file.
 *
 * Cái đáng kiểm không phải "tìm được `@`", mà là những lúc KHÔNG được bật bảng
 * gợi ý. Bật nhầm thì bảng nổi nuốt phím Enter ở nơi người dùng chỉ đang gõ một
 * địa chỉ email — và họ không hiểu vì sao câu không gửi đi được.
 */
import { describe, expect, it } from 'vitest';
import { docTokenFile } from './GoiYFile';

describe('đọc đoạn @ quanh con trỏ', () => {
  it('bắt được @ đầu dòng và giữa câu', () => {
    expect(docTokenFile('@src', 4)).toEqual({ tim: 'src', dau: 0, cuoi: 4 });
    expect(docTokenFile('sửa giúp @loop', 14)).toEqual({ tim: 'loop', dau: 9, cuoi: 14 });
  });

  it('vừa gõ @ mà chưa gõ chữ ⇒ vẫn mở, với chuỗi tìm rỗng', () => {
    expect(docTokenFile('xem @', 5)).toEqual({ tim: '', dau: 4, cuoi: 5 });
  });

  it('KHÔNG bật trên email — @ dính liền chữ phía trước', () => {
    expect(docTokenFile('gửi cho user@example.com', 24)).toBeNull();
    expect(docTokenFile('a@b', 3)).toBeNull();
  });

  it('KHÔNG bật khi đã gõ xong và có khoảng trắng sau đường dẫn', () => {
    expect(docTokenFile('@src/a.ts rồi sao nữa', 21)).toBeNull();
  });

  it('theo CON TRỎ, không theo cuối chuỗi', () => {
    const chu = '@loop và thêm gì đó';
    // con trỏ ngay sau `@loop` ⇒ đang gõ đoạn đó
    expect(docTokenFile(chu, 5)).toEqual({ tim: 'loop', dau: 0, cuoi: 5 });
    // con trỏ ở cuối câu ⇒ đã đi qua khoảng trắng, không còn gõ `@` nữa
    expect(docTokenFile(chu, chu.length)).toBeNull();
  });

  it('không có @ nào ⇒ null', () => {
    expect(docTokenFile('câu hỏi bình thường', 19)).toBeNull();
  });
});
