/**
 * Bố cục đọc của AI Chat và AI Code.
 *
 * Người dùng so thẳng với Claude cho máy tính và hỏi *"đã giống chưa?"*. Khác
 * biệt lớn nhất KHÔNG phải màu hay phông — mà là bảng ghi không có cột đọc:
 * chữ trải hết bề ngang, và trên màn 1920px một dòng dài hơn 200 ký tự. Mắt
 * đọc hết dòng rồi phải quét ngược cả một khoảng rộng để tìm đầu dòng sau.
 *
 * Đo thật 16/09/2026 trên bản dựng: trước 1904px, sau 736px ở mọi bề ngang;
 * mép trái của chữ và của ô nhập lệch 0px.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(import.meta.dirname, '../../styles.css'), 'utf8');

/** Lấy thân của một luật CSS theo bộ chọn (khớp chính xác dòng mở). */
function than(boChon: string): string {
  const i = css.indexOf(`\n${boChon} {`);
  if (i < 0) return '';
  return css.slice(i, css.indexOf('}', i));
}

describe('cột đọc là ĐỆM của khung chứa, không phải lề của từng con', () => {
  it('khai cột và lề ở `.ct-agent` để cả bốn vùng cùng thấy', () => {
    expect(css).toMatch(/\.ct-agent \{[^}]*--ct-cot-doc:\s*46rem/);
    expect(css).toMatch(/--ct-le-doc:\s*max\(16px,\s*calc\(\(100% - var\(--ct-cot-doc\)\) \/ 2\)\)/);
  });

  it('⛔ KHÔNG căn giữa từng con — đó là cách đã hỏng', () => {
    /*
     * Bản đầu dùng `.ct-agent-scroll > * { max-width; margin-inline: auto }`.
     * Bong bóng người dùng vốn có `max-width: 78%` và câu trả lời có `92%`,
     * khai SAU với cùng độ đặc hiệu — nên chúng thắng và mọi thứ quay lại dính
     * mép, trong khi khung soạn (không có luật riêng) thì vào giữa. Nửa trên
     * dính mép, nửa dưới ở giữa: hỏng hơn lúc chưa sửa.
     */
    expect(css, 'quay lại lối căn từng con là quay lại cuộc tranh đặc hiệu')
      .not.toMatch(/\.ct-agent-scroll > \*\s*\{[^}]*margin-inline:\s*auto/);
  });

  it('⛔ khối "Bề rộng đọc" ở CUỐI tệp cũng phải dùng biến lề', () => {
    /*
     * Nó khai LẠI `.ct-agent-scroll` và THẮNG (cùng độ đặc hiệu, đứng sau).
     * Sửa đệm ở khối trên mà quên khối này thì không có gì đổi cả — đã dẫm
     * phải 16/09/2026 và mất một vòng dựng mới phát hiện.
     */
    const moiLuat = [...css.matchAll(/\n\.ct-agent-scroll \{([^}]*)\}/g)].map((m) => m[1] ?? '');
    expect(moiLuat.length, 'phải có đúng hai luật .ct-agent-scroll').toBe(2);
    for (const t of moiLuat) {
      expect(t, `một luật .ct-agent-scroll không dùng --ct-le-doc: ${t.slice(0, 80)}`)
        .toMatch(/padding:[^;]*var\(--ct-le-doc/);
    }
  });

  it('⛔ robot bật thì NỚI CẢ CỘT, không ép riêng mép phải', () => {
    /* Ép một mép thì mép trái ở giữa màn hình còn mép phải cách 90px, và ba
       vùng không còn thẳng hàng — đúng thứ người dùng chụp lại. */
    expect(css).toMatch(/\[data-chua-robot='true'\] \.ct-agent \{[^}]*--ct-le-doc:\s*max\(90px/);
    expect(css, 'còn ép riêng padding-right cho khung soạn/dòng chân')
      .not.toMatch(/\[data-chua-robot='true'\] \.ct-agent-soan[^{]*\{[^}]*padding-right:\s*90px/);
  });

  it('CẢ BỐN vùng dùng chung một biến lề — lệch một chỗ là thấy ngay', () => {
    for (const bo of ['.ct-agent-scroll', '.ct-agent-soan', '.ct-agent-chan']) {
      expect(than(bo), `${bo} không dùng --ct-le-doc`).toMatch(/var\(--ct-le-doc/);
    }
  });

  it('khung web mở bên cạnh ⇒ bỏ cột, dùng cả bề ngang', () => {
    expect(css).toMatch(/\[data-co-web='true'\][^{]*\.ct-agent\s*\{[^}]*--ct-cot-doc:\s*100%/);
  });

  it('câu trả lời dùng TRỌN cột, không bó thêm lần nữa', () => {
    /* `92%` của cột làm câu trả lời lệch trái so với ô nhập ngay dưới nó. */
    expect(than('.ct-agent-may')).toMatch(/max-width:\s*100%/);
  });

  it('bong bóng người dùng vẫn nép PHẢI — trong cột, như Claude', () => {
    const t = than('.ct-agent-nguoi');
    expect(t).toMatch(/align-self:\s*flex-end/);
    expect(t).toMatch(/max-width:\s*78%/);
  });

  it('cỡ chữ đọc lớn hơn cỡ chữ giao diện', () => {
    const co = /font-size:\s*([\d.]+)px/.exec(than('.ct-md'))?.[1];
    expect(co, 'không thấy cỡ chữ của .ct-md').toBeTruthy();
    expect(Number(co)).toBeGreaterThanOrEqual(14);
  });
});

describe('⭐ danh sách phải có dấu đầu dòng', () => {
  it('đặt LẠI list-style — Tailwind preflight gỡ mất', () => {
    /* Không có hai dòng này thì mọi danh sách trong câu trả lời AI hiện ra
       thành mấy dòng thụt lề trần: không chấm, không số. Model trả lời bằng
       danh sách gần như mọi lượt, nên đây là lỗi gặp hằng ngày. Bắt được bằng
       cách đo `getComputedStyle(ul).listStyleType` trên bản dựng thật — nhìn
       ảnh chụp chỉ thấy "hơi lạ", không chỉ ra được nguyên nhân. */
    expect(css).toMatch(/\.ct-md ul\s*\{\s*list-style:\s*disc/);
    expect(css).toMatch(/\.ct-md ol\s*\{\s*list-style:\s*decimal/);
  });
});
