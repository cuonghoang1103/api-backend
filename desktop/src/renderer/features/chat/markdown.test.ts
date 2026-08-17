/**
 * Kiểm bộ dựng markdown — nhất là TOÁN.
 *
 * Toán là chỗ hỏng CÂM: model trả về `$$T = m g r$$`, màn hình hiện đúng chuỗi
 * đó, và người dùng báo "lỗi font". Không có gì đỏ, không có ngoại lệ nào.
 * Người dùng đã báo đúng như vậy 17/08/2026.
 */
import { describe, expect, it } from 'vitest';
import { tachKhoi } from './markdown';

/** Gom HTML của mọi khối chữ. Khối mã trả về nguyên văn nên bỏ qua ở đây. */
function html(tho: string): string {
  return tachKhoi(tho).filter((k) => k.loai === 'chu').map((k) => k.html).join('');
}

describe('toán', () => {
  it('dựng công thức KHỐI `$$…$$`', () => {
    const h = html('Công thức là:\n\n$$T = m g r$$');
    expect(h).toContain('katex');
    expect(h).toContain('ct-toan-khoi');
    // Dấu đô-la nguyên văn KHÔNG được còn lại — đó chính là triệu chứng user báo.
    expect(h).not.toContain('$$');
  });

  it('dựng công thức TRONG DÒNG `$…$`', () => {
    const h = html('Trong đó $m$ là khối lượng.');
    expect(h).toContain('katex');
    expect(h).toContain('khối lượng');
    expect(h).not.toMatch(/\$m\$/);
  });

  it('dựng được lệnh LaTeX có dấu gạch chéo và ngoặc nhọn', () => {
    // Đây là chuỗi thật trong ảnh chụp người dùng gửi. Nó đi qua `thoat()` thì
    // `\,` và `{}` hỏng, nên nó phải được tách RA TRƯỚC khi thoát HTML.
    const h = html('$g \\approx 9.81\\,\\text{m/s}^2$');
    expect(h).toContain('katex');
    expect(h).not.toContain('\\approx');
  });

  it('KHÔNG bắt nhầm dấu đô-la trong câu tiếng Việt', () => {
    // "giá 5 $ và 10 $" là câu bình thường. Bắt nhầm thì cả câu thành ký hiệu
    // toán và người đọc mất nguyên một dòng.
    const h = html('Cái này giá 5 $ và cái kia 10 $ thôi.');
    expect(h).not.toContain('katex');
    expect(h).toContain('giá 5');
  });

  it('công thức HỎNG không làm chết cả câu trả lời', () => {
    const h = html('Trước. $$\\frac{{{$$ Sau.');
    expect(h).toContain('Trước');
    expect(h).toContain('Sau');
  });

  it('toán nằm trong danh sách vẫn dựng được', () => {
    const h = html('- $m$ là khối lượng\n- $r$ là bán kính');
    expect(h).toContain('<li>');
    expect(h.match(/katex/g)?.length).toBeGreaterThanOrEqual(2);
  });
});

describe('khối mã và sơ đồ', () => {
  it('tách được khối ```mermaid để vẽ riêng', () => {
    const k = tachKhoi('Sơ đồ:\n\n```mermaid\ngraph TD;A-->B;\n```');
    const ma = k.find((x) => x.loai === 'ma');
    expect(ma?.loai === 'ma' && ma.ngonNgu).toBe('mermaid');
    expect(ma?.loai === 'ma' && ma.noiDung).toContain('graph TD');
  });

  it('KHÔNG dựng toán bên trong khối mã', () => {
    // `$x$` trong một đoạn shell là cú pháp biến, không phải công thức.
    const k = tachKhoi('```bash\necho $HOME và $x$\n```');
    const ma = k.find((x) => x.loai === 'ma');
    expect(ma?.loai === 'ma' && ma.noiDung).toContain('$HOME');
  });
});

describe('an toàn', () => {
  it('thoát HTML trong chữ thường', () => {
    const h = html('Thẻ <script>alert(1)</script> phải hiện dạng chữ.');
    expect(h).not.toContain('<script>');
    expect(h).toContain('&lt;script&gt;');
  });

  it('liên kết KHÔNG có href, chỉ data-url', () => {
    const h = html('Xem [tài liệu](https://example.com/a).');
    expect(h).toContain('data-url="https://example.com/a"');
    expect(h).not.toContain('href=');
  });
});
