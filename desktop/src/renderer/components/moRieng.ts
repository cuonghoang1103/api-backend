/**
 * MỖI LÚC CHỈ MỘT TẤM MỞ, và bấm ra ngoài là đóng.
 *
 * ─── Vì sao phải là sổ CHUNG, không phải `useState` từng chỗ ───
 * Trước đây mỗi nút tự giữ một `useState(false)` riêng. Hệ quả người dùng gặp
 * thật (20/08/2026): mở "Việc đã lưu", bấm tiếp nút MCP → **cả ba tấm cùng
 * nằm chồng lên nhau**, và muốn tắt tấm nào thì phải quay lại bấm đúng cái
 * nút đã mở nó. Không có chỗ nào biết "đang có tấm khác mở" vì không có chỗ
 * nào NHÌN THẤY cả hai — mỗi cái chỉ biết chính nó.
 *
 * Sổ ở cấp module chứ không phải React context, vì ràng buộc ở đây là ràng
 * buộc của cả CỬA SỔ: một tấm trong thanh công cụ và một menu trong thanh bên
 * cũng không được cùng mở, mà hai chỗ đó không chung cây provider nào.
 *
 * ─── Vì sao `pointerdown` chứ không `click`, và KHÔNG dùng lớp phủ ───
 * Lớp phủ toàn màn hình nuốt mất cú bấm đầu tiên: bấm từ tấm đang mở sang một
 * nút khác phải bấm hai lần, và lần đầu trông y như app lag.
 * `pointerdown` bắn TRƯỚC `click`, nên bấm sang nút B sẽ: đóng A (pointerdown)
 * → mở B (click). Nếu nghe `click` thì thứ tự đảo lại và B mở rồi bị chính
 * mình đóng ngay.
 */
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

let dangMo: string | null = null;
const nguoiNghe = new Set<() => void>();

function dat(id: string | null): void {
  if (dangMo === id) return;
  dangMo = id;
  for (const f of nguoiNghe) f();
}

function dangKy(f: () => void): () => void {
  nguoiNghe.add(f);
  return () => nguoiNghe.delete(f);
}

const doc = (): string | null => dangMo;

/**
 * Cửa cho phép kiểm nhìn vào chính cái store mà hook dùng.
 *
 * Không xuất `dat`/`doc` ra như API bình thường: chúng là ruột, và mọi chỗ
 * dùng thật đều phải đi qua `useMoRieng` để còn được gắn listener ra-ngoài.
 * Nhưng phép kiểm mà tự dựng lại logic thì nó đang kiểm bản sao của mình chứ
 * không kiểm thứ đang chạy.
 */
export const __soTest = { dat, doc, dangKy };

/** Đóng mọi tấm. Dùng khi điều hướng sang trang khác. */
export function dongHet(): void {
  dat(null);
}

export interface TamMo {
  mo: boolean;
  /** Bật/tắt chính tấm này. Đang mở tấm khác thì tấm kia tự đóng. */
  bat: () => void;
  dong: () => void;
  /**
   * Gắn vào phần tử BỌC CẢ nút lẫn tấm.
   *
   * Bọc cả hai là chủ ý: nút nằm trong vùng "bên trong" nên cú bấm lên chính
   * nó không bị coi là bấm ra ngoài — nếu không thì `pointerdown` đóng tấm rồi
   * `click` mở lại, và tấm không bao giờ đóng được bằng nút của nó.
   */
  boc: React.RefObject<HTMLDivElement>;
}

/**
 * @param id     Định danh tấm. PHẢI duy nhất trong cả cửa sổ — component nào
 *               dựng nhiều lần (menu ⋮ trên từng dòng) thì trộn `useId()` vào.
 * @param tuDong `false` khi component TỰ lo việc đóng-khi-bấm-ra-ngoài (ví dụ
 *               menu vẽ bằng portal ở toạ độ cố định: nó nằm NGOÀI `boc` nên
 *               phép kiểm `contains` ở đây sẽ đóng nhầm chính nó). Lúc đó hook
 *               chỉ còn giữ vai trò "mỗi lúc một tấm".
 */
export function useMoRieng(id: string, tuDong = true): TamMo {
  const dangMoId = useSyncExternalStore(dangKy, doc, doc);
  const mo = dangMoId === id;
  /* `useRef<HTMLDivElement>(null)` chứ KHÔNG `useRef<HTMLDivElement | null>`:
     chỉ dạng đầu mới gán được vào thuộc tính `ref` của JSX. */
  const boc = useRef<HTMLDivElement>(null);

  const dong = useCallback(() => { if (dangMo === id) dat(null); }, [id]);
  const bat = useCallback(() => { dat(dangMo === id ? null : id); }, [id]);

  useEffect(() => {
    if (!mo || !tuDong) return;

    const ngoai = (e: PointerEvent): void => {
      if (!boc.current) return;
      if (!boc.current.contains(e.target as Node)) dong();
    };
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') dong(); };

    document.addEventListener('pointerdown', ngoai);
    document.addEventListener('keydown', phim);
    return () => {
      document.removeEventListener('pointerdown', ngoai);
      document.removeEventListener('keydown', phim);
    };
  }, [mo, tuDong, dong]);

  /* Tấm bị đóng vì tấm khác mở ⇒ không cần dọn gì thêm; effect trên tự gỡ
     listener khi `mo` thành false. */

  return { mo, bat, dong, boc };
}
