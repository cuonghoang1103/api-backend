/**
 * Thay thế `next/navigation` cho app desktop.
 *
 * Cây Ngoại ngữ của web (45 tệp, 12.616 dòng) điều hướng bằng ba hook này —
 * đo thật 20/08/2026: `useParams` 34 chỗ, `useRouter` 19, `useSearchParams` 8.
 * Lúc đó KHÔNG có `usePathname`, KHÔNG có `redirect`.
 *
 * ⚠️ Mười cây port ngày 24/08/2026 thì có: đo lại trên `app/{maker-lab,creator,
 * projects,repos,exp-hub,games,finance,forum,saved,profile}` ra `useRouter` 13 ·
 * `useSearchParams` 6 · `useParams` 6 · **`notFound` 4** · **`usePathname` 2** ·
 * **`redirect` 1**. Ba cái sau chưa có, nên `vite build` ĐỎ — và đó là điều tốt:
 * nó chặn ngay chứ không để trang vỡ lúc người dùng mở.
 *
 * Bài học của chính lần này: đo "có bao nhiêu import từ `next/navigation`" là
 * KHÔNG ĐỦ. Phải đo **nhập những TÊN NÀO**. Tôi đã đếm số dòng import rồi kết
 * luận "shim phủ hết", và bản dựng bác bỏ.
 *
 * ─── Tham số động tới từ đâu ───
 * App desktop định tuyến bằng MỘT chuỗi đường dẫn (`route` trong app-state),
 * không có khái niệm `[code]` như Next. `TrangWeb` khớp đường dẫn hiện tại với
 * bảng mẫu (xem `dinhTuyenWeb.ts`) rồi bơm tham số xuống qua context này.
 *
 * ─── Chuỗi truy vấn ───
 * `navigate(path, thamSo)` của app có mang chuỗi truy vấn, nhưng `layThamSo`
 * ĐỌC MỘT LẦN RỒI XOÁ — hợp với một tác vụ chạy trong effect, không hợp với
 * một hook gọi lại ở mỗi lần vẽ. Nên shim tự giữ chuỗi truy vấn theo từng
 * đường dẫn trong một kho nhỏ ở cấp module, và `useSearchParams` đọc từ đó.
 */
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { useAppState } from '../app-state';

/* ── Tham số động của đường dẫn hiện tại ─────────────────────────────── */

export const ThamSoTuyen = createContext<Readonly<Record<string, string>>>({});

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useContext(ThamSoTuyen) as T;
}

/* ── Kho chuỗi truy vấn theo đường dẫn ────────────────────────────────── */

const truyVan = new Map<string, string>();
const nguoiNghe = new Set<() => void>();
/** `useSyncExternalStore` so sánh bằng `Object.is`, nên phải trả về CÙNG một
 *  chuỗi khi không có gì đổi — sinh chuỗi mới mỗi lần đọc là vòng vẽ vô tận. */
export function chupTruyVan(duong: string): string { return truyVan.get(duong) ?? ''; }
const chup = chupTruyVan;
function dat(duong: string, q: string): void {
  if (chup(duong) === q) return;
  if (q) truyVan.set(duong, q); else truyVan.delete(duong);
  for (const f of nguoiNghe) f();
}
export function theoDoiTruyVan(f: () => void): () => void {
  nguoiNghe.add(f);
  return () => { nguoiNghe.delete(f); };
}
const theoDoi = theoDoiTruyVan;

/**
 * Đặt chuỗi truy vấn cho một đường dẫn TỪ BÊN NGOÀI cây web.
 *
 * Dùng khi app điều hướng vào một trang web bằng `navigate(path, thamSo)` —
 * ví dụ deep link từ tiến trình main. Không có hàm này thì tham số ấy chỉ
 * `layThamSo` đọc được, và cây web không bao giờ thấy.
 */
export function datTruyVanCho(duong: string, q: string): void { dat(duong, q); }

export function useSearchParams(): URLSearchParams {
  const { route } = useAppState();
  const q = useSyncExternalStore(theoDoi, () => chup(route), () => chup(route));
  return useMemo(() => new URLSearchParams(q), [q]);
}

/* ── Bộ điều hướng ────────────────────────────────────────────────────── */

/**
 * Ngăn xếp lùi RIÊNG của shim.
 *
 * App không dùng History API của trình duyệt, nên `window.history` chỉ có một
 * mục và `history.back()` sẽ không làm gì cả — im lặng, không lỗi. Giữ ngăn
 * xếp riêng thì nút "Quay lại" trong cây web hoạt động thật.
 */
const nganXep: string[] = [];

interface BoDieuHuong {
  push(href: string): void;
  replace(href: string): void;
  back(): void;
  /** Có trong API của Next; ở đây không có gì để nạp trước. */
  prefetch(): void;
  refresh(): void;
}

export function useRouter(): BoDieuHuong {
  const { route, navigate } = useAppState();

  const di = useCallback((href: string, ghiDe: boolean) => {
    const [duong = '/', q = ''] = href.split('?');
    dat(duong, q);
    if (!ghiDe && route !== duong) nganXep.push(route);
    navigate(duong, q || undefined);
  }, [route, navigate]);

  return useMemo<BoDieuHuong>(() => ({
    push: (href) => di(href, false),
    replace: (href) => di(href, true),
    back: () => {
      const truoc = nganXep.pop();
      if (truoc) { navigate(truoc); return; }
      /* Ngăn xếp rỗng — trang mở thẳng từ thanh bên. Lùi về đường dẫn CHA thay
         vì đứng im: đứng im trông y như nút hỏng. */
      const cha = route.replace(/\/[^/]+$/, '') || '/dashboard';
      navigate(cha);
    },
    prefetch: () => {},
    refresh: () => {},
  }), [di, navigate, route]);
}


/* ── Đường dẫn hiện tại ────────────────────────────────────────── */

/**
 * `usePathname` của Next trả về đường dẫn KHÔNG kèm chuỗi truy vấn — `route`
 * của app-state cũng vậy, nên ánh xạ là một-một.
 *
 * Dùng ở `app/creator/layout.tsx` và `app/projects/search/page.tsx` để tô đậm
 * mục đang mở.
 */
export function usePathname(): string {
  return useAppState().route;
}

/* ── `notFound()` và `redirect()` ──────────────────────────────────
 *
 * Trên Next, hai hàm này KHÔNG trả về — chúng NÉM một lỗi đặc biệt để khung
 * bắt lại. Mã web gọi chúng ngay giữa lượt vẽ:
 *
 *     if (!game) notFound();
 *     redirect('/games/love-me-game/love-me.html');
 *
 * Nên shim cũng phải NÉM. Trả `undefined` là mã đi tiếp và đọc `game.ten` của
 * một giá trị rỗng — nổ ở chỗ khác, xa nguyên nhân.
 *
 * ⚠️ KHÔNG được gọi `navigate()` thẳng ở đây: đó là đặt state của component
 * KHÁC ngay giữa lượt vẽ, React cảnh báo và hành vi không xác định. Ném ra rồi
 * để `RanhGioiTuyen` (trong `TrangWeb.tsx`) xử lý sau khi lượt vẽ kết thúc.
 */

/** Lỗi do `notFound()` ném ra. */
export class LoiKhongTimThay extends Error {
  constructor() { super('next/navigation: notFound()'); this.name = 'LoiKhongTimThay'; }
}

/** Lỗi do `redirect()` ném ra, mang theo nơi cần tới. */
export class LoiChuyenHuong extends Error {
  constructor(public readonly den: string) {
    super(`next/navigation: redirect(${den})`);
    this.name = 'LoiChuyenHuong';
  }
}

export function notFound(): never { throw new LoiKhongTimThay(); }

export function redirect(href: string): never { throw new LoiChuyenHuong(href); }
