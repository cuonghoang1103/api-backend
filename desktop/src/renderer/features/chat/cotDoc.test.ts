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

describe('cột đọc', () => {
  it('bảng ghi có trần bề rộng và căn giữa', () => {
    const t = than('.ct-agent-scroll > *');
    expect(t, 'thiếu luật cột đọc ⇒ chữ trải hết màn hình').toMatch(/max-width:\s*var\(--ct-cot-doc\)/);
    expect(t).toMatch(/margin-inline:\s*auto/);
  });

  it('khung soạn dùng CÙNG bề rộng — lệch là cả trang trông rơi ra ngoài', () => {
    const t = than('.ct-agent-soan');
    expect(t).toMatch(/max-width:\s*46rem/);
    expect(t).toMatch(/margin-inline:\s*auto/);
    /* Cột đọc của bảng ghi phải bằng đúng con số đó. */
    expect(than('.ct-agent-scroll')).toMatch(/--ct-cot-doc:\s*46rem/);
  });

  it('mở khung web bên cạnh thì BỎ trần — không ép chữ vào dải mỏng', () => {
    expect(css).toMatch(/\[data-co-web='true'\][^{]*\.ct-agent-scroll\s*\{[^}]*--ct-cot-doc:\s*100%/);
    expect(css).toMatch(/\[data-co-web='true'\][^{]*\.ct-agent-soan\s*\{[^}]*max-width:\s*none/);
  });

  it('gạch phân cách trải HẾT bề ngang, không cụt giữa màn hình', () => {
    expect(than('.ct-agent-soan::before')).toMatch(/width:\s*100vw/);
  });

  it('cỡ chữ đọc lớn hơn cỡ chữ giao diện', () => {
    const md = than('.ct-md');
    const co = /font-size:\s*([\d.]+)px/.exec(md)?.[1];
    expect(co, 'không thấy cỡ chữ của .ct-md').toBeTruthy();
    /* 13.5px là cỡ NHÃN/NÚT — đúng cho thứ người ta liếc, sai cho thứ người ta
       đọc, nhất là tiếng Việt có dấu. */
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
