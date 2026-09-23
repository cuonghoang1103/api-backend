// @vitest-environment jsdom
/**
 * ⭐ GẮN THẬT CÂY CT WORK CỦA WEB (`/work/**`) VÀO APP DESKTOP.
 *
 * Cùng lý do với `features/messages/gan.test.tsx`: `npm run build` chứng minh
 * mọi import GIẢI ĐƯỢC, không chứng minh cây DỰNG ĐƯỢC. Ở đây chốt: khung
 * `app/work/layout.tsx` (thanh bên, bảng lệnh, khung AI) và các trang chính
 * dựng được trong môi trường của app mà không ném, và vẽ đúng khung
 * `.work-root` + `#work-portal` cho thanh bên/trang con.
 *
 * KHÔNG kiểm dữ liệu, socket hay bố cục thật — mạng bị chặn, API trả rỗng.
 */
import { render } from '@testing-library/react';
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider';
import type { ComponentType, ReactNode } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
});

/* Chặn mạng: API trả về một lời hứa KHÔNG BAO GIỜ xong — trang đứng ở trạng
   thái đang tải, đúng thứ cần để soi việc DỰNG mà không phụ thuộc hình dạng dữ
   liệu (trả `null` thì trang sẽ đi đọc `null.projects` và lỗi đó không phải
   của app desktop). */
vi.mock('@/lib/api', () => {
  const treo = () => new Promise(() => {});
  const api = {
    get: treo, post: treo, patch: treo, put: treo, delete: treo,
    defaults: { baseURL: '', headers: { common: {} } },
    interceptors: { request: { use: () => 0 }, response: { use: () => 0 } },
  };
  return { default: api, api };
});

vi.mock('@/lib/socket', () => ({
  datNguonSocket: () => {},
  connectSocket: () => Promise.reject(new Error('không có socket trong phép kiểm')),
  getSocket: () => null,
  disconnectSocket: () => {},
}));

/* Shim thật dựa vào `useAppState` (cần IPC của Electron) — giả lập như bộ kiểm
   messenger, với đúng tham số mà `TrangWebTheoTuyen` sẽ bơm cho trang bảng. */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => {}, replace: () => {}, back: () => {}, forward: () => {},
    refresh: () => {}, prefetch: () => {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/work/acme/WEB/board',
  useParams: () => ({ ws: 'acme', key: 'WEB' }),
  notFound: () => { throw new Error('notFound'); },
  redirect: () => { throw new Error('redirect'); },
}));

afterEach(() => { vi.clearAllMocks(); });

/* Đúng provider mà `VoWeb` dựng cho mọi cây web trong app. */
function Boc({ children }: { children: ReactNode }) {
  return <TanStackQueryProvider>{children}</TanStackQueryProvider>;
}

async function dangNhap(): Promise<void> {
  const { useAuthStore } = await import('@/store/authStore');
  (useAuthStore as unknown as { setState: (s: unknown) => void }).setState({
    isAuthenticated: true,
    user: { id: 1, userId: 1, username: 'thu', email: 'thu@example.com', roles: ['USER'], role: 'USER' },
    token: 'tok',
  });
}

describe('⭐ cây CT Work của web dựng được trong app desktop', () => {
  it('khung /work (thanh bên + bảng lệnh + AI) dựng được, có .work-root và #work-portal',
    { timeout: 30_000 }, async () => {
      await dangNhap();
      const { default: Khung } = await import('@/app/work/layout');
      const K = Khung as ComponentType<{ children: ReactNode }>;
      const { container } = render(<Boc><K><div data-testid="trang">trang</div></K></Boc>);
      expect(container.querySelector('.work-root'), 'thiếu .work-root').not.toBeNull();
      expect(container.querySelector('#work-portal'), 'thiếu #work-portal').not.toBeNull();
      expect(container.querySelector('[data-testid="trang"]'), 'khung không vẽ trang con').not.toBeNull();
    });

  it.each([
    ['/work', () => import('@/app/work/page')],
    ['/work/:ws/:key/board', () => import('@/app/work/[ws]/[key]/board/page')],
    ['/work/:ws/:key/backlog', () => import('@/app/work/[ws]/[key]/backlog/page')],
    ['/work/:ws/:key/list', () => import('@/app/work/[ws]/[key]/list/page')],
    ['/work/:ws/:key/issue/:num', () => import('@/app/work/[ws]/[key]/issue/[num]/page')],
    ['/work/developer', () => import('@/app/work/developer/page')],
    ['/work/invite/:token', () => import('@/app/work/invite/[token]/page')],
    ['/work/share/:token', () => import('@/app/work/share/[token]/page')],
    ['/work/:ws', () => import('@/app/work/[ws]/page')],
    ['/work/:ws/settings', () => import('@/app/work/[ws]/settings/page')],
    ['/work/:ws/:key', () => import('@/app/work/[ws]/[key]/page')],
    ['/work/:ws/:key/timeline', () => import('@/app/work/[ws]/[key]/timeline/page')],
    ['/work/:ws/:key/releases', () => import('@/app/work/[ws]/[key]/releases/page')],
    ['/work/:ws/:key/reports', () => import('@/app/work/[ws]/[key]/reports/page')],
    ['/work/:ws/:key/dashboards', () => import('@/app/work/[ws]/[key]/dashboards/page')],
    ['/work/:ws/:key/tests', () => import('@/app/work/[ws]/[key]/tests/page')],
    ['/work/:ws/:key/settings', () => import('@/app/work/[ws]/[key]/settings/page')],
    ['/work/:ws/:key/tests/:num', () => import('@/app/work/[ws]/[key]/tests/[num]/page')],
    ['/work/:ws/:key/tests/cycles/:cycleId', () => import('@/app/work/[ws]/[key]/tests/cycles/[cycleId]/page')],
  ] as const)('trang %s dựng xong mà KHÔNG ném', { timeout: 30_000 }, async (_ten, nap) => {
    await dangNhap();
    const { default: Trang } = await nap();
    /* Truyền đúng hai prop mà `TrangWebTheoTuyen` truyền — `list` đọc tham số
       từ prop `params` chứ không từ `useParams()`. */
    const T = Trang as ComponentType<{ params: Record<string, string>; searchParams: Record<string, string> }>;
    expect(() => render(
      <Boc><T params={{ ws: 'acme', key: 'WEB', num: '1', token: 't', cycleId: '1' }} searchParams={{}} /></Boc>,
    )).not.toThrow();
  });
});
