/**
 * Thay thế `next/navigation` cho app desktop.
 *
 * Cây Ngoại ngữ của web (45 tệp, 12.616 dòng) điều hướng bằng ba hook này —
 * đo thật 20/08/2026: `useParams` 34 chỗ, `useRouter` 19, `useSearchParams` 8.
 * KHÔNG có `usePathname`, KHÔNG có `redirect` (những chữ "redirect" tìm thấy
 * đều nằm trong chú thích). Shim này phủ đúng ba hook đó và không hơn — một
 * shim giả vờ làm được nhiều hơn thực tế sẽ hỏng ở chỗ khác, xa chỗ gây ra.
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
