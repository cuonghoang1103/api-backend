/**
 * ============================================================
 * BẢNG CHỈNH VỊ TRÍ & CỠ (ấn 3 lần vào robot, hoặc menu chuột phải)
 * ============================================================
 *
 * Thay hai nút −/+ bốn nấc (100/82/66/52) bằng thanh trượt 20–100% bước 5 +
 * số % + nút −/+ từng bước 5. Bảng mở về phía còn chỗ quanh robot (`tinhBoCuc`)
 * nên robot không xê dịch khi bảng hiện ra hay tắt đi.
 *
 * "Tự dính mép khi thả" MẶC ĐỊNH TẮT: trước 03/10/2026 nó mặc định bật và là
 * thủ phạm chính của "kéo vào đúng chỗ mà nó tự chạy qua chỗ khác".
 */
import { useEffect, useRef, useState } from 'react';
import { dich } from '../i18n';
import { BUOC_CO, CO_TOI_DA, CO_TOI_THIEU, chuanPhanTram } from '../../shared/coRobot';

export interface NenTangRobot { heDieuHanh: string; waylandThuan: boolean; xWayland: boolean }

/** Cỡ bảng (px CSS) — main cần biết trước để chừa chỗ quanh robot. */
export const CO_BANG = { rong: 256, cao: 196, caoThemGhiChu: 46 } as const;

export function BangChinh({
  phanTram, onDoiCo, tuDinhMep, onDoiTuDinhMep, onVeMacDinh, onXong, nenTang,
}: {
  phanTram: number;
  onDoiCo: (pt: number) => void;
  /** Chỉ con NỔI: con trong app dính mép CỬA SỔ, không có tuỳ chọn này. */
  tuDinhMep?: boolean;
  onDoiTuDinhMep?: (v: boolean) => void;
  onVeMacDinh: () => void;
  onXong: () => void;
  nenTang: NenTangRobot | null;
}) {
  /* Giá trị thanh trượt giữ CỤC BỘ trong lúc kéo: main làm tròn về bước 5 và
     trả lại, nhưng đợi vòng IPC mới vẽ thì núm trượt giật lùi theo nhịp mạng. */
  const [tam, datTam] = useState(phanTram);
  useEffect(() => { datTam(phanTram); }, [phanTram]);

  /* Mở bảng ⇒ đưa tiêu điểm vào bảng, để ↑/↓/Esc tới đúng con robot ngay
     (xem `usePhimChinh`). `preventScroll`: con trong app nằm trên trang đang
     cuộn, focus mặc định sẽ cuộn trang tới nó. */
  const gocRef = useRef<HTMLDivElement>(null);
  useEffect(() => { gocRef.current?.focus({ preventScroll: true }); }, []);

  const doi = (v: number): void => {
    const pt = chuanPhanTram(v);
    datTam(pt);
    if (pt !== phanTram) onDoiCo(pt);
  };

  return (
    <div ref={gocRef} tabIndex={-1} className="rb-bang" role="group" aria-label={dich('Chỉnh vị trí & cỡ')}>
      <div className="rb-bang-dau">
        <strong>{dich('Chỉnh robot')}</strong>
        <button type="button" className="rb-bang-xong" onClick={onXong}>{dich('Xong')}</button>
      </div>
      <p className="rb-bang-meo">{dich('Kéo robot tới đâu, nó đứng yên ở đó.')}</p>

      <div className="rb-bang-co">
        <button
          type="button"
          onClick={() => doi(tam - BUOC_CO)}
          disabled={tam <= CO_TOI_THIEU}
          aria-label={dich('Nhỏ hơn')}
          title={dich('Nhỏ hơn')}
        >−</button>
        <input
          type="range"
          min={CO_TOI_THIEU}
          max={CO_TOI_DA}
          step={BUOC_CO}
          value={tam}
          onChange={(e) => doi(Number(e.target.value))}
          aria-label={dich('Cỡ robot')}
          aria-valuetext={`${tam}%`}
        />
        <button
          type="button"
          onClick={() => doi(tam + BUOC_CO)}
          disabled={tam >= CO_TOI_DA}
          aria-label={dich('To hơn')}
          title={dich('To hơn')}
        >+</button>
        <output className="rb-bang-so">{tam}%</output>
      </div>

      <p className="rb-bang-phim">{dich('Phím ↑/↓: đổi cỡ 5% · Esc: xong')}</p>

      {onDoiTuDinhMep && (
        <label className="rb-bang-hang">
          <input type="checkbox" checked={!!tuDinhMep} onChange={(e) => onDoiTuDinhMep(e.target.checked)} />
          <span>{dich('Tự dính mép màn hình khi thả')}</span>
        </label>
      )}

      <button type="button" className="rb-bang-phu" onClick={onVeMacDinh}>{dich('Về góc mặc định')}</button>

      {nenTang?.waylandThuan && (
        <p className="rb-bang-ghi">
          {dich('Wayland không cho app tự đặt vị trí cửa sổ. Giữ Super (phím Windows) rồi kéo robot, hoặc mở app với --ozone-platform=x11 để kéo như thường.')}
        </p>
      )}
      {nenTang?.xWayland && (
        <p className="rb-bang-ghi">
          {dich('Đang chạy qua XWayland: kéo và đổi cỡ bình thường; vài compositor không cho cửa sổ nổi trên app toàn màn hình.')}
        </p>
      )}
    </div>
  );
}
