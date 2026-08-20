/**
 * Sổ "mỗi lúc một tấm".
 *
 * Kiểm phần LOGIC chứ không kiểm React: quy tắc thật nằm ở module-level store,
 * và đó cũng là chỗ lỗi cũ sinh ra (mỗi nút một `useState` riêng ⇒ không chỗ
 * nào biết chỗ kia đang mở).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { dongHet, __soTest } from './moRieng';

/* Truy cập phần trong của store qua cùng một cửa mà hook dùng, để phép kiểm
   không tự dựng một bản sao logic rồi kiểm chính bản sao ấy. */
const { dat, doc, dangKy } = __soTest;

describe('moRieng — mỗi lúc chỉ một tấm mở', () => {
  beforeEach(() => dongHet());

  it('mở tấm B thì tấm A tự đóng', () => {
    dat('a');
    expect(doc()).toBe('a');
    dat('b');
    expect(doc()).toBe('b'); // không phải 'a' — đây chính là lỗi cũ
  });

  it('không có tấm nào mở lúc khởi đầu', () => {
    expect(doc()).toBeNull();
  });

  it('đóng tấm đang mở thì về rỗng', () => {
    dat('a');
    dat(null);
    expect(doc()).toBeNull();
  });

  it('báo cho MỌI người nghe khi đổi', () => {
    let a = 0;
    let b = 0;
    const goA = dangKy(() => { a += 1; });
    const goB = dangKy(() => { b += 1; });

    dat('x');
    expect([a, b]).toEqual([1, 1]);

    dat('y');
    expect([a, b]).toEqual([2, 2]);

    goA();
    dat('z');
    expect([a, b]).toEqual([2, 3]); // đã gỡ thì không nhận nữa

    goB();
  });

  it('đặt lại ĐÚNG giá trị đang có thì KHÔNG báo — tránh vòng render vô ích', () => {
    let n = 0;
    const go = dangKy(() => { n += 1; });
    dat('a');
    expect(n).toBe(1);
    dat('a');
    expect(n).toBe(1);
    go();
  });

  it('dongHet() dập mọi tấm', () => {
    dat('a');
    dongHet();
    expect(doc()).toBeNull();
  });
});
