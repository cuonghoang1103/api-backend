/**
 * Menu bật ra + hộp xác nhận cho giao diện Trò chuyện kiểu Claude.
 *
 * Vẽ bằng PORTAL ra `<body>`: danh sách thanh bên là khung cuộn
 * (`overflow:auto`), menu nằm bên trong sẽ bị cắt mất nửa dưới. Portal thì ra
 * ngoài vùng `.ctc-root`, nên mang lớp `ctc-pop` để vẫn nhận bảng màu Claude.
 */
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

export type MucCtc =
  | { loai: 'tieuDe'; nhan: string }
  | { loai: 'vach' }
  | {
    loai?: 'muc';
    nhan: string;
    phu?: string;
    icon?: ReactNode;
    onChon: () => void;
    nguyHiem?: boolean;
    khoa?: boolean;
    chon?: boolean;
    /** Chữ nhỏ bên phải (ví dụ "Cần Pro"). */
    duoi?: ReactNode;
  };

/**
 * `neo` = phần tử để bám vị trí. `huong` = ưu tiên mở lên trên (ô soạn ở đáy)
 * hay xuống dưới (thanh bên). Không đủ chỗ thì tự lật.
 */
export function CtcMenu({
  mo, onDong, neo, muc, huong = 'duoi', canh = 'phai', rong = 220, nhan,
}: {
  mo: boolean;
  onDong: () => void;
  neo: React.RefObject<HTMLElement>;
  muc: MucCtc[];
  huong?: 'tren' | 'duoi';
  canh?: 'trai' | 'phai';
  rong?: number;
  nhan?: string;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [viTri, datViTri] = useState<{ trai: number; tren: number } | null>(null);

  useLayoutEffect(() => {
    if (!mo) { datViTri(null); return; }
    const r = neo.current?.getBoundingClientRect();
    const m = menuRef.current;
    if (!r) return;
    const cao = m?.offsetHeight ?? 200;
    const rongThat = m?.offsetWidth ?? rong;
    const duoiDu = r.bottom + 6 + cao <= window.innerHeight - 8;
    const trenDu = r.top - 6 - cao >= 8;
    const lenTren = huong === 'tren' ? (trenDu || !duoiDu) : (!duoiDu && trenDu);
    const tren = lenTren ? Math.max(8, r.top - 6 - cao) : Math.min(r.bottom + 6, window.innerHeight - cao - 8);
    const traiMuon = canh === 'phai' ? r.right - rongThat : r.left;
    const trai = Math.min(Math.max(8, traiMuon), window.innerWidth - rongThat - 8);
    datViTri({ trai, tren });
  }, [mo, neo, huong, canh, rong, muc.length]);

  useEffect(() => {
    if (!mo) return;
    const ngoai = (e: PointerEvent): void => {
      const t = e.target as Node | null;
      if (t && (menuRef.current?.contains(t) || neo.current?.contains(t))) return;
      onDong();
    };
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') { e.stopPropagation(); onDong(); } };
    const cuon = (e: Event): void => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return;
      onDong();
    };
    document.addEventListener('pointerdown', ngoai, true);
    document.addEventListener('keydown', phim, true);
    window.addEventListener('scroll', cuon, true);
    window.addEventListener('resize', onDong);
    return () => {
      document.removeEventListener('pointerdown', ngoai, true);
      document.removeEventListener('keydown', phim, true);
      window.removeEventListener('scroll', cuon, true);
      window.removeEventListener('resize', onDong);
    };
  }, [mo, onDong, neo]);

  if (!mo) return null;
  return createPortal(
    <div
      ref={menuRef}
      className="ctc-pop ctc-menu"
      role="menu"
      aria-label={nhan}
      style={{
        left: viTri?.trai ?? -9999,
        top: viTri?.tren ?? -9999,
        minWidth: rong,
        visibility: viTri ? 'visible' : 'hidden',
      }}
    >
      {muc.map((m, i) => {
        if (m.loai === 'tieuDe') return <div key={`t${i}`} className="ctc-menu-tieude">{m.nhan}</div>;
        if (m.loai === 'vach') return <div key={`v${i}`} className="ctc-menu-vach" role="separator" />;
        return (
          <button
            key={`m${i}`}
            type="button"
            role="menuitem"
            className="ctc-menu-muc"
            data-nguyhiem={m.nguyHiem === true}
            disabled={m.khoa === true}
            onClick={() => { onDong(); m.onChon(); }}
          >
            {m.icon && <span className="ctc-menu-icon">{m.icon}</span>}
            <span className="ctc-menu-chu">
              <span className="ctc-menu-nhan">{m.nhan}</span>
              {m.phu && <span className="ctc-menu-phu">{m.phu}</span>}
            </span>
            {m.duoi}
            {m.chon && <Check size={15} className="ctc-menu-tick" aria-hidden />}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}

/** `useCtcMo()` — trạng thái mở/đóng + ref neo, gọn cho mỗi chỗ dùng menu. */
export function useCtcMo<T extends HTMLElement = HTMLButtonElement>() {
  const [mo, datMo] = useState(false);
  const neo = useRef<T>(null);
  const dong = useCallback(() => datMo(false), []);
  const bat = useCallback(() => datMo((v) => !v), []);
  return { mo, dong, bat, neo };
}

/** Hộp xác nhận (Xoá…) — Enter = đồng ý, Esc = huỷ. */
export function CtcXacNhan({
  tieuDe, noiDung, nhanDongY, nhanHuy, nguyHiem = true, onDongY, onHuy,
}: {
  tieuDe: string;
  noiDung?: ReactNode;
  nhanDongY: string;
  nhanHuy: string;
  nguyHiem?: boolean;
  onDongY: () => void;
  onHuy: () => void;
}) {
  const nutRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    nutRef.current?.focus();
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') { e.stopPropagation(); onHuy(); } };
    document.addEventListener('keydown', phim, true);
    return () => document.removeEventListener('keydown', phim, true);
  }, [onHuy]);
  return createPortal(
    <div className="ctc-pop ctc-hop-nen" onPointerDown={(e) => { if (e.target === e.currentTarget) onHuy(); }}>
      <div className="ctc-hop" role="alertdialog" aria-modal="true" aria-label={tieuDe}>
        <h2>{tieuDe}</h2>
        {noiDung && <div className="ctc-hop-noi">{noiDung}</div>}
        <div className="ctc-hop-nut">
          <button type="button" className="ctc-nut-vien" onClick={onHuy}>{nhanHuy}</button>
          <button
            ref={nutRef}
            type="button"
            className={nguyHiem ? 'ctc-nut-do' : 'ctc-nut-chinh'}
            onClick={onDongY}
          >
            {nhanDongY}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
