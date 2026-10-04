// @vitest-environment jsdom
/**
 * ============================================================
 * ⭐ BỐN CỬ CHỈ + BONG BÓNG TỰ TẮT — DỰNG THẬT CỬA SỔ ROBOT
 * ============================================================
 *
 * Bốn lỗi người dùng báo 16/09/2026 đều nằm ở đây, và cả bốn đều là chuyện
 * "bấm vào thì phải xảy ra gì" — thứ chỉ chứng minh được bằng cách DỰNG cây
 * component rồi bấm thật, không phải bằng cách đọc mã.
 *
 * `robot.tsx` tự gọi `createRoot(...)` ngay lúc nạp mô-đun (nó là entry của
 * `robot.html`), nên phép kiểm phải chuẩn bị sẵn `#robot` và `window.cuongthai`
 * TRƯỚC khi import. Đó cũng là lý do cả tệp này dùng một lần import động.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { act } from 'react';

const goi = {
  batTat: vi.fn(async () => false),
  moChinh: vi.fn(async () => {}),
  doiKichThuoc: vi.fn(async () => {}),
  doiCo: vi.fn(async () => {}),
  datCo: vi.fn(async () => {}),
  keoBatDau: vi.fn(async () => {}),
  keoToi: vi.fn(async () => {}),
  keoXong: vi.fn(async () => {}),
  menu: vi.fn(async () => {}),
  hutMep: vi.fn(async () => {}),
  phimTat: vi.fn(async () => null),
  datPhanTram: vi.fn(async (pt: number) => pt),
  boCuc: vi.fn(async () => null),
  veMacDinh: vi.fn(async () => {}),
  nenTang: vi.fn(async () => ({ heDieuHanh: 'darwin', waylandThuan: false, xWayland: false })),
};

/** Người nghe của từng kênh sự kiện, để phép kiểm tự bắn tin như main. */
const nghe = new Map<string, (p: unknown) => void>();

beforeAll(async () => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  document.body.innerHTML = '<div id="robot"></div>';
  (window as unknown as { cuongthai: unknown }).cuongthai = {
    robot: goi,
    settings: { getAll: async () => ({}), set: async () => {} },
    on: (kenh: string, cb: (p: unknown) => void) => { nghe.set(kenh, cb); return () => nghe.delete(kenh); },
  };
  /* `getBoundingClientRect` của jsdom trả toàn số 0 ⇒ ô đo báo rộng 0 ⇒ nhánh
     `doiCo('noi', undefined)`. Không ảnh hưởng thứ đang kiểm ở đây. */
  await import('./robot');
  await act(async () => {});
});

afterEach(() => { vi.clearAllMocks(); });

function than(): HTMLElement {
  const el = document.querySelector('.rb-than');
  if (!el) throw new Error('không dựng được thân robot');
  return el as HTMLElement;
}

/**
 * Bấm `lan` cái LIÊN TIẾP vào thân robot.
 *
 * `detail` mô phỏng trình duyệt: truyền `detailKet` để giả cảnh Windows, nơi
 * `detail` kẹt ở 1 vì cửa sổ trượt dưới con trỏ.
 */
async function bamNhieu(lan: number, opt: { detailKet?: boolean } = {}): Promise<void> {
  for (let i = 1; i <= lan; i++) {
    await act(async () => {
      than().dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        detail: opt.detailKet ? 1 : i,
        screenX: 100,
        screenY: 100,
      }));
    });
  }
}

/** Đợi hết nhịp hoãn 260ms của cử chỉ. */
async function quaNhipHoan(): Promise<void> {
  await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
}

describe('⭐ LỖI 1 — bốn cú bấm ẩn robot', () => {
  it('bấm 4 lần ⇒ gọi batTat(false), và KHÔNG bật nhầm chế độ kéo', async () => {
    await bamNhieu(4);
    expect(goi.batTat).toHaveBeenCalledWith(false);
    await quaNhipHoan();
    // Cú thứ ba đã bị cú thứ tư huỷ. Nếu không, người dùng bật lại robot và
    // thấy nó đang ở chế độ kéo mà họ chưa hề chọn.
    expect(document.querySelector('.rb')?.getAttribute('data-keo')).toBe('false');
    expect(goi.moChinh).not.toHaveBeenCalled();
  });
});

describe('⭐ LỖI 2 — ba cú bấm lật được CẢ HAI chiều', () => {
  it('bật rồi tắt được chế độ kéo, kể cả khi `detail` kẹt ở 1 (Windows)', async () => {
    const vo = () => document.querySelector('.rb')!;

    await bamNhieu(3);
    await quaNhipHoan();
    expect(vo().getAttribute('data-keo')).toBe('true');

    // Chiều TẮT: chế độ kéo đang bật nên cửa sổ trượt theo chuột và Chromium
    // trả `detail` về 1 mỗi cú. Đây đúng là chỗ bản cũ đứng lại.
    await bamNhieu(3, { detailKet: true });
    await quaNhipHoan();
    expect(vo().getAttribute('data-keo')).toBe('false');
  });
});

describe('⭐ LỖI 3 — bong bóng trả lời tự tắt và có nút ×', () => {
  /**
   * ⚠️ Cả tệp này dùng CHUNG một cây React (mô-đun tự `createRoot` lúc nạp),
   * nên trạng thái rò từ khối kiểm trước sang khối sau. Khung chat mini đang
   * mở thì bong bóng KHÔNG được vẽ (`{tin && !rong && …}`) — và phép kiểm sẽ
   * đổ với lý do chẳng liên quan gì tới thứ nó định kiểm.
   */
  beforeEach(async () => {
    if (document.querySelector('.rb')?.getAttribute('data-rong') === 'true') {
      await bamNhieu(1);
      await quaNhipHoan();
    }
    await act(async () => { nghe.get('robot:tin')?.({ loai: 'agent', chu: '' }); });
  });

  async function banTin(chu: string): Promise<void> {
    await act(async () => { nghe.get('robot:tin')?.({ loai: 'agent', chu }); });
  }

  it('hiện rồi tự biến mất sau 3 giây', async () => {
    await banTin('câu trả lời');
    expect(document.body.textContent).toContain('câu trả lời');

    await act(async () => { await new Promise((r) => setTimeout(r, 1500)); });
    expect(document.body.textContent).toContain('câu trả lời');   // chưa tới hạn

    await act(async () => { await new Promise((r) => setTimeout(r, 2000)); });
    expect(document.body.textContent).not.toContain('câu trả lời');
  });

  it('bấm × ⇒ tắt NGAY, không phải đợi hết 3 giây', async () => {
    await banTin('phiền quá');
    const x = document.querySelector('.rb-bong-x') as HTMLElement | null;
    expect(x, 'phải có nút × để tắt bong bóng').not.toBeNull();
    await act(async () => { x!.click(); });
    expect(document.body.textContent).not.toContain('phiền quá');
  });

  it('bấm × KHÔNG tính là một cú bấm vào robot', async () => {
    // Thân robot đang đếm cú bấm ở ngay dưới. Thiếu `stopPropagation` thì tắt
    // bong bóng cũng mở luôn khung chat.
    await banTin('thử nổi bọt');
    await act(async () => { (document.querySelector('.rb-bong-x') as HTMLElement).click(); });
    await quaNhipHoan();
    expect(document.querySelector('.rb')?.getAttribute('data-rong')).toBe('false');
  });

  it('⭐ ô ĐO vô hình mang cùng `data-co-x` với bong bóng thật', async () => {
    // Ô đo quyết định bề rộng cửa sổ. Lệch một thuộc tính ảnh hưởng bố cục là
    // dòng cuối bị xén — đã xảy ra đúng ở chỗ này ngày 20/08/2026 với
    // `data-loai`, nên chốt luôn cả `data-co-x`.
    await banTin('đo thử');
    const o = document.querySelector('.rb-do');
    const that = document.querySelector('.rb-bong-boc .rb-bong');
    expect(o?.getAttribute('data-co-x')).toBe(that?.getAttribute('data-co-x'));
    expect(o?.getAttribute('data-loai')).toBe(that?.getAttribute('data-loai'));
    await act(async () => { (document.querySelector('.rb-bong-x') as HTMLElement).click(); });
  });
});

describe('⭐ 03/10/2026 — bảng chỉnh 20–100% và kéo "thả đâu đứng đó"', () => {
  async function moBang(): Promise<void> {
    if (document.querySelector('.rb')?.getAttribute('data-keo') !== 'true') {
      await bamNhieu(3);
      await quaNhipHoan();
    }
  }

  it('ba cú bấm mở bảng chỉnh: thanh trượt 20–100, bước 5, có số %', async () => {
    await moBang();
    const r = document.querySelector('.rb-bang input[type="range"]') as HTMLInputElement | null;
    expect(r).not.toBeNull();
    expect([r!.min, r!.max, r!.step]).toEqual(['20', '100', '5']);
    expect(document.querySelector('.rb-bang-so')?.textContent).toMatch(/^\d+%$/);
  });

  it('kéo thanh trượt ⇒ gửi đúng % (đã làm tròn bước 5) xuống main', async () => {
    await moBang();
    const r = document.querySelector('.rb-bang input[type="range"]') as HTMLInputElement;
    await act(async () => {
      const dat = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      dat.call(r, '35');
      r.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(goi.datPhanTram).toHaveBeenCalledWith(35);
  });

  it('⛔ "tự dính mép" MẶC ĐỊNH TẮT (thủ phạm chính của "tự chạy chỗ khác")', async () => {
    await moBang();
    const o = document.querySelector('.rb-bang-hang input') as HTMLInputElement;
    expect(o.checked).toBe(false);
  });

  it('kéo: một lần keoBatDau, thả là keoXong — và cú thả KHÔNG tính là một cú bấm', async () => {
    await moBang();
    const t = than();
    await act(async () => {
      t.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, screenX: 100, screenY: 100 }));
      for (let i = 1; i <= 5; i++) {
        window.dispatchEvent(new MouseEvent('pointermove', { screenX: 100 + i * 10, screenY: 100 + i * 4 }));
      }
      window.dispatchEvent(new MouseEvent('pointerup', { screenX: 150, screenY: 120 }));
      t.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, screenX: 150, screenY: 120 }));
    });
    await quaNhipHoan();
    expect(goi.keoBatDau).toHaveBeenCalledTimes(1);
    expect(goi.keoBatDau).toHaveBeenCalledWith('hop');
    expect(goi.keoToi).toHaveBeenLastCalledWith(50, 20);
    expect(goi.keoXong).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.rb')?.getAttribute('data-rong')).toBe('false');
  });

  it('bấm rồi rung tay 2px KHÔNG thành kéo', async () => {
    await moBang();
    await act(async () => {
      than().dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, screenX: 300, screenY: 300 }));
      window.dispatchEvent(new MouseEvent('pointermove', { screenX: 302, screenY: 301 }));
      window.dispatchEvent(new MouseEvent('pointerup', { screenX: 302, screenY: 301 }));
    });
    expect(goi.keoBatDau).not.toHaveBeenCalled();
  });
});

describe('⭐ 04/10/2026 — ↑/↓ đổi cỡ 5%, Esc thoát, zzz khi ngủ', () => {
  const vo = () => document.querySelector('.rb')!;
  async function phim(key: string): Promise<void> {
    await act(async () => {
      (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    });
  }

  it('trong chế độ chỉnh: ↓ −5%, ↑ +5%, kẹp ở 20%; Esc thoát', async () => {
    if (vo().getAttribute('data-keo') !== 'true') { await bamNhieu(3); await quaNhipHoan(); }
    expect(vo().getAttribute('data-keo')).toBe('true');
    const so = () => Number(document.querySelector('.rb-bang-so')?.textContent?.replace('%', ''));
    const dau = so();
    await phim('ArrowDown');
    expect(so()).toBe(Math.max(20, dau - 5));
    expect(document.querySelector('.rb-co-nhanh')?.textContent).toBe(`${so()}%`);
    await phim('ArrowUp');
    expect(so()).toBe(dau);
    for (let i = 0; i < 20; i++) await phim('ArrowDown');
    expect(so()).toBe(20);
    expect(goi.datPhanTram).toHaveBeenLastCalledWith(20);
    await phim('Escape');
    expect(vo().getAttribute('data-keo')).toBe('false');
  });

  it('NGOÀI chế độ chỉnh, mũi tên không đụng tới cỡ', async () => {
    await phim('ArrowUp');
    expect(goi.datPhanTram).not.toHaveBeenCalled();
  });
});
