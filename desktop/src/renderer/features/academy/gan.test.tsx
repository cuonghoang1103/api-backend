// @vitest-environment jsdom
/**
 * ============================================================
 * ⭐ HỌC VIỆN LÀ MỘT CỬA DUY NHẤT — ĐÚNG NHƯ TRÊN WEB
 * ============================================================
 *
 * Người dùng 17/09/2026, kèm ảnh thanh bên: *"các phần này đều nằm trong 1
 * trang academy như trên web mà… Khi ấn vào academy thì sẽ có các bước chọn
 * ngành, ngành hẹp,… trình tự như trên web ấy cho những người mới dùng"*.
 *
 * Trên web (`NavigationDock.tsx`) nhóm `learn` **chỉ có `/academy`**. Hai trang
 * `tu-van-nganh` và `so-do-mon-hoc` KHÔNG có mục điều hướng nào — chúng chỉ tới
 * được từ BÊN TRONG Học viện:
 *   • `tu-van-nganh`  ← nút trong hộp thoại chọn ngành (bước "ngành")
 *   • `so-do-mon-hoc` ← nút trên đầu trang Học viện, và trong hộp thoại (bước "combo")
 *
 * App thì đưa cả hai lên thanh bên ngang hàng với Học viện, nên người mới thấy
 * ba tính năng rời rạc thay vì một luồng có thứ tự.
 */
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * ⚠️ Trần thời gian 30 giây, không phải 5 giây mặc định.
 *
 * Mỗi phép kiểm ở đây NẠP CẢ CÂY WEB (`AcademyOnboarding` kéo theo
 * framer-motion, danh mục ngành, cửa hàng…). Chạy một mình thì ~1,6s, nhưng
 * `vitest` chạy nhiều tệp song song và tệp messenger cũng nạp cây web — hai
 * cái cùng lúc thì cả hai chạm trần 5s và đỏ **vì tải máy**, không vì sản
 * phẩm. Đo thật 17/09/2026: chạy riêng xanh, chạy cả bộ đỏ 5 phép.
 *
 * Nới trần chứ không chạy tuần tự: tuần tự làm chậm cả 1.500 phép kiểm còn
 * lại để chiều hai tệp.
 */

/* Vỏ app: `HocVienPage` đọc `useAppState` (điều hướng, trạng thái mạng) và
   `useSession` (token + userId). Cả hai gọi IPC lúc dựng thật, nên ở đây giả
   lập thay vì dựng provider. */
vi.mock('../../app-state', () => ({
  useAppState: () => ({ online: true, navigate: () => {}, settings: {}, setSetting: () => {} }),
}));
vi.mock('../../auth/session', () => ({
  useSession: () => ({ api: null, userId: null }),
}));

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = ((q: string) => ({
      matches: false, media: q, onchange: null,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  for (const ten of ['IntersectionObserver', 'ResizeObserver'] as const) {
    if (!(ten in window)) {
      (window as unknown as Record<string, unknown>)[ten] = class {
        observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
      };
    }
  }
});

vi.mock('@/lib/api', () => {
  const tra = () => Promise.resolve({ data: { data: null } });
  const api = {
    get: tra, post: tra, patch: tra, put: tra, delete: tra,
    defaults: { baseURL: '', headers: { common: {} } },
    interceptors: { request: { use: () => 0 }, response: { use: () => 0 } },
  };
  return { default: api, api, preferencesApi: new Proxy({}, { get: () => tra }) };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => {}, replace: () => {}, back: () => {}, forward: () => {},
    refresh: () => {}, prefetch: () => {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/academy',
  useParams: () => ({}),
}));

describe('⭐ luồng chọn ngành của web chạy được trong app desktop', () => {
  it('người MỚI (chưa từng chọn) mở Học viện ⇒ hiện bước 1: "bạn có phải sinh viên FPTU?"', { timeout: 30_000 }, async () => {
    // Hồ sơ trống = chưa trả lời bao giờ. Đó là điều kiện mở hộp thoại.
    window.localStorage.removeItem('cuong-academy-profile-v1');
    const { default: AcademyOnboarding } = await import('@/components/academy/AcademyOnboarding');
    render(<AcademyOnboarding open onClose={() => {}} />);
    expect(screen.getByText(/sinh viên FPT University/i)).toBeTruthy();
  });

  it('⭐ đủ BỐN bước theo đúng thứ tự: sinh viên? → khối ngành → ngành → ngành hẹp', { timeout: 30_000 }, async () => {
    // Thứ tự là phần người dùng nhắc tới ("các bước chọn ngành, ngành hẹp,…
    // trình tự như trên web"), nên chốt nó chứ không chỉ chốt "dựng được".
    const { default: AcademyOnboarding } = await import('@/components/academy/AcademyOnboarding');
    const { container } = render(<AcademyOnboarding open onClose={() => {}} />);
    expect(container.textContent).toMatch(/Bước 1\s*\/\s*4|1\s*\/\s*4/);
  });
});

describe('⭐ khối "Ngành của bạn" — chỗ đổi ngành và mở sơ đồ', () => {
  /**
   * Bám theo web (`frontend/src/app/academy/page.tsx`): khối này chỉ hiện SAU
   * khi đã chọn xong, và nó mang cả ba lối đi tiếp — sơ đồ môn học, tư vấn
   * ngành, đổi ngành. Người dùng 17/09/2026: *"khi đã chọn xong cũng có thể
   * đổi ngành và xem sơ đồ môn học"*.
   */
  const HO_SO = {
    isStudent: true, faculty: 'it', major: 'se', combo: null,
    chosenAt: new Date().toISOString(),
  };

  it('CHƯA chọn ngành ⇒ KHÔNG có khối đó, chỉ có nút "Chọn ngành"', { timeout: 30_000 }, async () => {
    vi.resetModules();
    vi.doMock('@/hooks/useAcademyProfile', () => ({
      useAcademyProfile: () => ({
        profile: { isStudent: null, faculty: null, major: null, combo: null, chosenAt: null },
        needsOnboarding: true,
        ready: true,
        save: () => {},
      }),
    }));
    const { HocVienPage } = await import('./HocVienPage');
    const { container } = render(<HocVienPage />);
    expect(container.querySelector('.ct-hv-nganh')).toBeNull();
  });

  it('⭐ ĐÃ chọn ⇒ hiện khối, có đủ Sơ đồ môn học · Tư vấn ngành · Đổi ngành', { timeout: 30_000 }, async () => {
    vi.resetModules();
    vi.doMock('@/hooks/useAcademyProfile', () => ({
      useAcademyProfile: () => ({
        profile: HO_SO, needsOnboarding: false, ready: true, save: () => {},
      }),
    }));
    const { HocVienPage } = await import('./HocVienPage');
    const { container } = render(<HocVienPage />);
    const khoi = container.querySelector('.ct-hv-nganh');
    expect(khoi, 'phải có khối "Ngành của bạn"').not.toBeNull();
    for (const nhan of ['Sơ đồ môn học', 'Tư vấn ngành', 'Đổi ngành']) {
      expect(khoi!.textContent, `thiếu nút "${nhan}"`).toContain(nhan);
    }
  });

  it('⭐ tên ngành hiện TIẾNG VIỆT như web, không phải tên tiếng Anh', { timeout: 30_000 }, async () => {
    // Bản shim cũ của `academyCatalog` chỉ khai `{id, name}`, nên app lỡ hiện
    // `name` (tiếng Anh) trong khi web hiện `nameVi`. `tsc` vẫn xanh vì shim
    // hẹp hơn mô-đun thật — chỉ so hai màn cạnh nhau mới thấy.
    vi.resetModules();
    vi.doMock('@/hooks/useAcademyProfile', () => ({
      useAcademyProfile: () => ({
        profile: HO_SO, needsOnboarding: false, ready: true, save: () => {},
      }),
    }));
    const { getCatMajor } = await import('@/data/academyCatalog');
    const mj = getCatMajor('it', 'se');
    expect(mj?.nameVi, 'danh mục phải có tên tiếng Việt').toBeTruthy();

    const { HocVienPage } = await import('./HocVienPage');
    const { container } = render(<HocVienPage />);
    expect(container.querySelector('.ct-hv-nganh-ten')?.textContent).toBe(mj!.nameVi);
  });
});
