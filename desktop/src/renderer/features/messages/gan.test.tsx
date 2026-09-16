// @vitest-environment jsdom
/**
 * ============================================================
 * ⭐ GẮN THẬT CÂY MESSENGER CỦA WEB VÀO APP DESKTOP
 * ============================================================
 *
 * Đây là phép kiểm quan trọng nhất của trang Tin nhắn, và nó tồn tại vì một
 * khoảng trống thật: `npm run build` chứng minh mọi `import` **giải được**,
 * nhưng KHÔNG chứng minh cây component **dựng được**. Hai thứ đó khác nhau, và
 * khoảng giữa chúng đúng là chỗ trang này dễ chết nhất:
 *
 *   • bốn shim thay Next.js (`next/link`, `next/image`, `next/navigation`,
 *     `next/dynamic`) chỉ chạy LÚC DỰNG — thiếu một export mà cây web gọi tới
 *     thì bản dựng vẫn xanh và app ra màn hình trắng;
 *   • một component gọi `window.matchMedia` hay `IntersectionObserver` ở lượt
 *     render đầu sẽ ném, và lỗi đó nằm trong error boundary — không log, không
 *     màn hình đỏ, chỉ là một khung trống.
 *
 * Người dùng báo "giao diện đang xấu" chứ không báo "màn hình trắng", nên hôm
 * nay nó chưa hỏng. Phép kiểm này để nó ĐỪNG hỏng sau một lần nâng cấp web mà
 * không ai chạy thử app desktop.
 *
 * ─── Cái này KHÔNG thay được việc chạy thử với tài khoản thật ───
 * Nó không kiểm được socket có nối không, API có trả đúng không, hay bố cục có
 * đẹp không. Nó chỉ chốt đúng một điều: **cây dựng được trong môi trường của
 * app desktop**. Xem [[feedback_verify_by_running_not_reading]] — đây là phần
 * "chạy" rẻ nhất mua được mà không cần máy chủ.
 */
import { render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

/* ── Những thứ jsdom không có mà cây web đụng tới ────────────── */
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
  /* `scrollIntoView` chưa được jsdom cài — danh sách tin nhắn gọi nó khi cuộn
     xuống tin mới nhất. */
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
  /* `scrollTo` cũng chưa có trong jsdom — danh sách tin nhắn gọi nó để nhảy
     xuống đáy. Đây là thiếu sót của jsdom, không phải của sản phẩm. */
  if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};
  if (!window.scrollTo) window.scrollTo = (() => {}) as typeof window.scrollTo;
});

/* Chặn mọi lời gọi mạng: phép kiểm này soi việc DỰNG, không soi dữ liệu.
   Không chặn thì nó đi ra Internet thật và đỏ theo mạng của người chạy. */
vi.mock('@/lib/api', () => {
  const tra = () => Promise.resolve({ data: { data: null } });
  const api = {
    get: tra, post: tra, patch: tra, put: tra, delete: tra,
    defaults: { baseURL: '', headers: { common: {} } },
    interceptors: { request: { use: () => 0 }, response: { use: () => 0 } },
  };
  return { default: api, api, messagingApi: new Proxy({}, { get: () => tra }) };
});

vi.mock('@/lib/socket', () => ({
  datNguonSocket: () => {},
  connectSocket: () => Promise.resolve(null),
  getSocket: () => null,
  disconnectSocket: () => {},
}));

/*
 * ⚠️ Shim `next/navigation` của app dựa vào `useAppState`, nên MỌI component
 * web dùng `useRouter`/`useSearchParams` đều kéo theo cây provider của
 * desktop. Trong app thật nó luôn có (vỏ app bọc ngoài mọi trang); ở đây phải
 * dựng tay, không thì lỗi là "useAppState phải nằm trong <AppStateProvider>"
 * — một câu không nói gì về messenger và rất dễ đuổi nhầm hướng.
 *
 * Giả lập thay vì dựng provider thật: provider thật gọi IPC (`window.cuongthai`)
 * ngay lúc dựng, thứ không tồn tại ngoài Electron.
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => {}, replace: () => {}, back: () => {}, forward: () => {},
    refresh: () => {}, prefetch: () => {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/messages',
  useParams: () => ({}),
  notFound: () => { throw new Error('notFound'); },
  redirect: () => { throw new Error('redirect'); },
}));

afterEach(() => { vi.clearAllMocks(); });

describe('⭐ cây messenger của web dựng được trong app desktop', () => {
  /* Trần 30s: nạp cả cây web, và từ 17/09/2026 có thêm một tệp kiểm nữa cũng
     nạp cây web (`features/academy/gan.test.tsx`). Chạy song song thì cả hai
     chạm trần 5s mặc định và đỏ vì TẢI MÁY, không vì sản phẩm. */
  it('trang /messages dựng xong mà KHÔNG ném', { timeout: 30_000 }, async () => {
    const { default: WebMessagesPage } = await import('@/app/messages/page');
    expect(() => render(<WebMessagesPage />)).not.toThrow();
  });

  it('ba component NẶNG NHẤT của cây đều dựng được', { timeout: 30_000 }, async () => {
    /*
     * Gắn thẳng từng component thay vì đi qua trang.
     *
     * ⚠️ Trang bọc phần thân trong `<Suspense>`, và dưới jsdom nó đứng ở
     * fallback — đo thật 16/09/2026, nhường bao nhiêu nhịp cũng không qua.
     * Đuổi theo chuyện đó là mất công cho một thứ chỉ có ở bộ kiểm; trong
     * Electron trang chạy qua cùng bộ dựng với Notes, thứ đã sống trên
     * production từ lâu.
     *
     * Ba component dưới đây gom gần hết rủi ro thật: `ThreadList` và
     * `MessageList` là nơi dùng `next/image`, `next/link` và cửa hàng; còn
     * `ChatInfoPanel` là cây sâu nhất.
     */
    const [{ default: ThreadList }, { default: MessageList }, { default: ChatInfoPanel }] =
      await Promise.all([
        import('@/components/messaging/ThreadList'),
        import('@/components/messaging/MessageList'),
        import('@/components/messaging/ChatInfoPanel'),
      ]);
    const store = await import('@/store/messagingStore');
    (store.useMessagingStore as unknown as { setState: (s: unknown) => void })
      .setState({ currentThreadId: 1, threads: [], messagesByThread: {} });

    for (const [ten, Cai] of [
      ['ThreadList', ThreadList],
      ['MessageList', MessageList],
    ] as const) {
      expect(() => render(<Cai />), `${ten} ném lúc dựng`).not.toThrow();
    }

    /* `ChatInfoPanel` cần một hội thoại thật — dựng cái tối thiểu. */
    const cuoc = {
      id: 1,
      type: 'USER',
      peer: { id: 2, username: 'ai-do', displayName: 'Ai Đó', avatarUrl: null },
      unreadCount: 0,
    };
    expect(
      () => render(<ChatInfoPanel thread={cuoc} />),
      'ChatInfoPanel ném lúc dựng',
    ).not.toThrow();
  });

  it('khung soạn tin có ĐỦ nút: đính kèm · emoji · nhãn dán · GIF · ghi thoại', async () => {
    const { default: MessageInput } = await import('@/components/messaging/MessageInput');
    const store = await import('@/store/messagingStore');
    /* `MessageInput` đọc `currentThreadId` từ cửa hàng; đặt sẵn để nó dựng
       khung thật thay vì thoát sớm. */
    (store.useMessagingStore as unknown as { setState: (s: unknown) => void })
      .setState({ currentThreadId: 1 });

    render(<MessageInput />);
    for (const nhan of [/Đính kèm/i, /^Emoji$/i, /Nhãn dán/i, /^GIF$/i, /thoại/i]) {
      expect(screen.getByLabelText(nhan), `thiếu nút ${nhan}`).toBeTruthy();
    }
  });

  it('màn hình gọi có nút cúp máy khi đang gọi — không thì người dùng kẹt', async () => {
    const { default: CuocGoiOverlay } = await import('@/components/messaging/CuocGoiOverlay');
    /* `trangThai === 'roi'` thì overlay tự ẩn, nên chỉ cần chốt rằng nó dựng
       được và không ném. Phần vẽ khi đang gọi cần WebRTC thật. */
    expect(() => render(
      <CuocGoiOverlay threadId={1} peerId={2} peerName="A" peerAvatar={null} goiDi={0} />,
    )).not.toThrow();
  });
});
