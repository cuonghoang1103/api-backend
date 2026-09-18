// @vitest-environment jsdom
/**
 * ============================================================
 * ⭐ BẢNG KẾ HOẠCH — hai chốt mà đọc mã KHÔNG chứng minh được
 * ============================================================
 *
 * 1. **Bắt buộc chọn khó + quan trọng.** Mức trừ uy tín = khó × quan
 *    trọng. Cho thêm việc khi chưa chọn thì máy chủ đoán thay người
 *    dùng, và điểm bị trừ dựa trên con số họ chưa từng nhìn thấy.
 * 2. **Lịch bắt đầu từ Thứ Hai và đủ 42 ô.** Sai một ô là sai cả tháng,
 *    và nó chỉ lộ ra ở những tháng bắt đầu vào Chủ Nhật.
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/* ⚠️ Dọn DOM sau MỖI phép kiểm. Kho này không cấu hình `globals` cho
   testing-library nên tự-dọn KHÔNG chạy, và cây render của phép trước ở lại
   trong `document.body`. Hậu quả không phải lỗi rõ ràng mà là phép kiểm ĐẠT
   VÌ LÝ DO SAI: `queryByText` tìm thấy chữ của phép TRƯỚC rồi kết luận về
   phép này. Đúng một cái bẫy trong [[feedback_phep_kiem_dat_vi_ly_do_sai]]. */
afterEach(cleanup);

const goi = vi.fn();

/**
 * ⚠️ `api` phải là MỘT object ổn định qua mọi lần render.
 *
 * Bản đầu viết `useSession: () => ({ api: { request: goi } })` — tạo object
 * MỚI mỗi lần render. `napNgay`/`napThang` là `useCallback([api])`, nên danh
 * tính chúng đổi theo ⇒ hai `useEffect` chạy lại ⇒ `setState` ⇒ render ⇒ lặp
 * vô tận. Vitest treo 2 phút không in ra một dòng nào.
 *
 * Bản THẬT không dính: `useSession` trả về `useMemo` và `api: apiRef.current`
 * (ref, ổn định). Nhưng một mô phỏng lỏng hơn bản thật thì nó kiểm cái khác
 * với thứ người dùng chạy — giữ nó ổn định để hai bên khớp nhau.
 */
const API_GIA = { request: goi };

vi.mock('../../auth/session', () => ({
  useSession: () => ({ api: API_GIA }),
}));
vi.mock('../../i18n', () => ({
  useDich: () => ({
    dich: (c: string) => c,
    dichP: (c: string, t: Record<string, string | number>) =>
      c.replace(/\{(\w+)\}/g, (_, k: string) => String(t[k] ?? `{${k}}`)),
  }),
}));

import { KeHoachNgay } from './KeHoachNgay';

function datApi(viec: unknown[] = []) {
  goi.mockReset();
  goi.mockImplementation((duong: string) => {
    if (duong.startsWith('/api/v1/dashboard/thang')) return Promise.resolve({ ngay: {} });
    if (duong.startsWith('/api/v1/dashboard/ngay')) return Promise.resolve({ tasks: viec });
    if (duong.startsWith('/api/v1/dashboard/uy-tin')) {
      return Promise.resolve({
        diem: 100, moc: 100, so: [],
        bac: { ma: 'tot', ten: 'Tốt', mau: '#4ade80', mo: 'Đúng hẹn là thói quen.' },
      });
    }
    return Promise.resolve({});
  });
}

describe('⭐ bắt buộc chọn mức khó và mức quan trọng', () => {
  it('⛔ gõ tên việc THÔI thì nút Thêm vẫn KHOÁ', async () => {
    datApi();
    render(<KeHoachNgay />);
    await screen.findByPlaceholderText('Việc cần làm ngày này…');

    fireEvent.change(screen.getByPlaceholderText('Việc cần làm ngày này…'), { target: { value: 'Ôn SWR302' } });
    expect((screen.getByRole('button', { name: 'Thêm việc' }) as HTMLButtonElement).disabled).toBe(true);

    // …và nó nói RÕ còn thiếu gì, chứ không để nút chết câm.
    expect(screen.getByText('Chọn mức khó và mức quan trọng để thêm việc.')).toBeTruthy();
  });

  it('chọn ĐỦ cả hai thì mở khoá, và hiện trước mức trừ', async () => {
    datApi();
    render(<KeHoachNgay />);
    await screen.findByPlaceholderText('Việc cần làm ngày này…');

    fireEvent.change(screen.getByPlaceholderText('Việc cần làm ngày này…'), { target: { value: 'Ôn SWR302' } });
    fireEvent.click(screen.getByRole('button', { name: 'Khó' }));
    expect((screen.getByRole('button', { name: 'Thêm việc' }) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Rất quan trọng' }));
    expect((screen.getByRole('button', { name: 'Thêm việc' }) as HTMLButtonElement).disabled).toBe(false);

    // 3 × 3 = 9. Người dùng thấy cái giá TRƯỚC khi cam kết, không phải sau.
    expect(screen.getByText('Trượt việc này sẽ trừ 9 uy tín.')).toBeTruthy();
  });

  it('gửi lên máy chủ ĐÚNG doKho và priority đã chọn', async () => {
    datApi();
    render(<KeHoachNgay />);
    await screen.findByPlaceholderText('Việc cần làm ngày này…');

    fireEvent.change(screen.getByPlaceholderText('Việc cần làm ngày này…'), { target: { value: 'Ôn SWR302' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vừa' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quan trọng' }));
    fireEvent.click(screen.getByRole('button', { name: 'Thêm việc' }));

    await waitFor(() => {
      const tao = goi.mock.calls.find(([d, o]) => d === '/api/v1/dashboard/tasks' && o?.method === 'POST');
      expect(tao).toBeTruthy();
      expect(tao![1].body).toMatchObject({ title: 'Ôn SWR302', doKho: 2, priority: 2 });
    });
  });
});

describe('⭐ lưới lịch', () => {
  it('đủ 42 ô và hàng đầu bắt đầu từ T2', async () => {
    datApi();
    render(<KeHoachNgay />);
    await screen.findByPlaceholderText('Việc cần làm ngày này…');

    const o = document.querySelectorAll('.ct-kh-ngay');
    expect(o).toHaveLength(42);
    const thu = [...document.querySelectorAll('.ct-kh-thu span')].map((x) => x.textContent);
    expect(thu).toEqual(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']);
  });
});

describe('⭐ thẻ việc', () => {
  const viec = {
    id: 7, title: 'Ôn SWR302', date: '2026-09-18', done: false, note: 'chương 3-4',
    priority: 3, doKho: 3, batDauAt: new Date(2026, 8, 18, 14, 0).toISOString(),
    phutLam: 90, truotLuc: null, lyDoTruot: null, daTruUyTin: null,
    soLanHoan: 0, truNeuTruot: 9,
  };

  it('hiện giờ, thời lượng, ghi chú và mức trừ', async () => {
    datApi([viec]);
    render(<KeHoachNgay />);
    expect(await screen.findByText('Ôn SWR302')).toBeTruthy();
    expect(screen.getByText('14:00')).toBeTruthy();
    expect(screen.getByText('1 giờ 30 phút')).toBeTruthy();
    expect(screen.getByText('chương 3-4')).toBeTruthy();
    expect(screen.getByText('Trượt sẽ −9')).toBeTruthy();
  });

  it('⛔ mức khó hiện bằng CHỮ, không chỉ bằng màu', async () => {
    // ~8% nam giới mù màu đỏ-lục. Với họ, một bảng phân biệt bằng riêng
    // màu là một bảng trắng.
    datApi([viec]);
    render(<KeHoachNgay />);
    await screen.findByText('Ôn SWR302');
    /* Tìm TRONG thẻ việc, không tìm cả trang: "Khó" cũng là nhãn một nút ở
       ô nhập phía trên, nên `getByText` toàn trang tìm thấy hai cái và ném.
       Hẹp phạm vi lại cũng là để phép kiểm nói đúng điều nó định nói. */
    const nhan = [...document.querySelectorAll('.ct-kh-nhan .ct-kh-the')].map((x) => x.textContent);
    expect(nhan).toContain('Khó');
    expect(nhan).toContain('Rất quan trọng');
  });

  it('việc ĐÃ TRƯỢT hiện số điểm ĐÃ MẤT, không phải số dự kiến', async () => {
    datApi([{ ...viec, truotLuc: new Date().toISOString(), daTruUyTin: 9 }]);
    render(<KeHoachNgay />);
    await screen.findByText('Ôn SWR302');
    expect(screen.getByText('Trượt −9')).toBeTruthy();
    expect(screen.queryByText('Trượt sẽ −9')).toBeNull();
  });

  it('⛔ việc làm nốt SAU khi trượt hiện là XONG, không còn đỏ', async () => {
    // `truotLuc` được giữ làm lịch sử; nó KHÔNG được thắng `done`, nếu
    // không thì người dùng làm rồi mà bảng vẫn tố họ.
    datApi([{ ...viec, done: true, truotLuc: new Date().toISOString(), daTruUyTin: 9 }]);
    render(<KeHoachNgay />);
    await screen.findByText('Ôn SWR302');
    expect(document.querySelector('.ct-kh-viec')?.getAttribute('data-tt')).toBe('xong');
  });
});

describe('⭐ cảnh báo kế hoạch xa thực tế', () => {
  const v = (id: number, gio: number, phut: number) => ({
    id, title: `Việc ${id}`, date: '2026-09-18', done: false, note: null,
    priority: 2, doKho: 2, batDauAt: new Date(2026, 8, 18, gio, 0).toISOString(),
    phutLam: phut, truotLuc: null, lyDoTruot: null, daTruUyTin: null,
    soLanHoan: 0, truNeuTruot: 4,
  });

  it('báo khi hai việc CHỒNG GIỜ nhau', async () => {
    datApi([v(1, 14, 60), v(2, 14, 60)]);
    render(<KeHoachNgay />);
    expect(await screen.findByText(/cặp việc trùng giờ nhau/)).toBeTruthy();
  });

  it('kề sát nhau thì KHÔNG báo — báo nhầm là cách nhanh nhất để bị bỏ qua', async () => {
    datApi([v(1, 14, 60), v(2, 15, 60)]);
    render(<KeHoachNgay />);
    await screen.findByText('Việc 1');
    expect(screen.queryByText(/cặp việc trùng giờ nhau/)).toBeNull();
  });

  it('báo khi xếp quá 10 tiếng trong một ngày', async () => {
    datApi([v(1, 6, 360), v(2, 13, 300)]);
    render(<KeHoachNgay />);
    expect(await screen.findByText(/nhiều hơn một ngày làm việc/)).toBeTruthy();
  });
});
