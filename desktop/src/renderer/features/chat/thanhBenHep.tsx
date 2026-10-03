/**
 * THANH BÊN KHI CỘT HẸP — dùng chung cho AI Code (`ThanhBen`) và Trò chuyện
 * (`ThanhBenChat`), 03/10/2026.
 *
 * Người dùng chụp: kéo hẹp cửa sổ thì thanh bên cố định (190–460px) ăn gần hết
 * chỗ, khung chat còn chưa tới 200px; ẩn thanh bên thì nút mở lại là "mẩu nhỏ
 * trôi giữa mép trái". Hai cách sửa, cùng một chỗ:
 *   • cột ≤620px (`@container aithan`, CSS) ⇒ thanh bên ẨN, thay bằng một dải
 *     mỏng; bấm dải thì thanh bên trượt ra thành LỚP PHỦ, chọn xong tự cất;
 *   • ẩn hẳn (người dùng bấm «) ⇒ cũng là dải đó, chạy suốt chiều cao, có nhãn.
 */
import { useEffect, useRef, useState } from 'react';
import { PanelLeftOpen } from 'lucide-react';

/** Trạng thái lớp phủ: bấm ra ngoài hoặc Esc là cất. */
export function useThanhBenPhu() {
  const [phuMo, datPhuMo] = useState(false);
  const thanRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!phuMo) return;
    const ngoai = (e: PointerEvent): void => {
      const t = e.target as Element | null;
      if (t && thanRef.current?.contains(t)) return;
      if (t?.closest?.('.ct-tb-mo')) return;
      /* Menu ⋮ của một mục vẽ bằng portal NGOÀI thanh bên — bấm vào nó không
         được tính là bấm ra ngoài. */
      if (t?.closest?.('.ct-cham-menu, [role="menu"]')) return;
      datPhuMo(false);
    };
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') datPhuMo(false); };
    document.addEventListener('pointerdown', ngoai);
    document.addEventListener('keydown', phim);
    return () => {
      document.removeEventListener('pointerdown', ngoai);
      document.removeEventListener('keydown', phim);
    };
  }, [phuMo]);
  return { phuMo, datPhuMo, thanRef };
}

/**
 * Dải mở thanh bên. `chiHep` = dải của chế độ cột hẹp (CSS chỉ cho hiện khi
 * cột ≤620px); không có = dải khi người dùng đã ẩn hẳn thanh bên.
 */
export function DaiMoThanhBen({
  nhan, dem, chiHep, dangMo, onBam,
}: { nhan: string; dem?: number; chiHep?: boolean; dangMo?: boolean; onBam: () => void }) {
  return (
    <button
      type="button"
      className="ct-tb-mo"
      {...(chiHep ? { 'data-chi-hep': true, 'aria-expanded': dangMo === true } : {})}
      onClick={onBam}
      title={nhan}
      aria-label={nhan}
    >
      <PanelLeftOpen size={15} aria-hidden />
      <span className="ct-tb-mo-chu">{nhan}</span>
      {dem !== undefined && dem > 0 && <span className="ct-tb-mo-dem">{dem}</span>}
    </button>
  );
}
