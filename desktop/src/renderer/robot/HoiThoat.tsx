/**
 * "Bạn không cần tôi nữa ư?" — câu robot hỏi khi người dùng thoát app.
 *
 * Main (`main/hoiThoat.ts`) chặn lệnh thoát và gửi `robot:hoiThoat` sang ĐÚNG
 * con robot đang hiện (trong app hoặc nổi). Cùng hook + cùng thẻ cho cả hai.
 * Báo "đã nhận" NGAY khi hiện — main không nghe thấy gì trong 3 giây là coi
 * như robot treo và thoát luôn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { dich } from '../i18n';

/** Cỡ thẻ (px CSS) — con nổi cần biết trước để chừa chỗ quanh robot. */
export const CO_HOI_THOAT = { rong: 256, cao: 118 } as const;

export function useHoiThoat(): { id: number | null; tra: (giuLai: boolean) => void } {
  const [id, datId] = useState<number | null>(null);
  const idRef = useRef<number | null>(null);
  useEffect(() => window.cuongthai?.on('robot:hoiThoat', (p) => {
    const so = (p as { id?: unknown }).id;
    if (typeof so !== 'number') return;
    idRef.current = so;
    datId(so);
    void window.cuongthai?.robot.traLoiThoat?.({ id: so, daNhan: true }).catch(() => {});
  }), []);
  const tra = useCallback((giuLai: boolean) => {
    const cu = idRef.current;
    idRef.current = null;
    datId(null);
    if (cu !== null) void window.cuongthai?.robot.traLoiThoat?.({ id: cu, giuLai }).catch(() => {});
  }, []);
  return { id, tra };
}

export function TheHoiThoat({ onTra }: { onTra: (giuLai: boolean) => void }) {
  const coRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { coRef.current?.focus({ preventScroll: true }); }, []);
  return (
    <div className="rb-hoi-thoat" role="alertdialog" aria-label={dich('Bạn không cần tôi nữa ư?')}>
      <p>{dich('Bạn không cần tôi nữa ư?')}</p>
      <div className="rb-hoi-thoat-nut">
        <button ref={coRef} type="button" className="rb-hoi-thoat-co" onClick={() => onTra(true)}>
          {dich('thoat|Có')}
        </button>
        <button type="button" className="rb-hoi-thoat-khong" onClick={() => onTra(false)}>
          {dich('thoat|Không')}
        </button>
      </div>
    </div>
  );
}
