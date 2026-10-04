/**
 * ============================================================
 * THÂN CON ROBOT — MỘT component cho cả con nổi lẫn con trong app
 * ============================================================
 *
 * Hộp `.rb-hop` đúng cỡ % hiện tại; bên trong `.rb-hop-trong` luôn bố cục ở
 * 150×160 rồi `zoom` theo % (Chromium vẽ lại SVG ở cỡ mới — nét sắc, khác
 * `transform: scale` vốn phóng ảnh đã vẽ).
 *
 * ⚠️ CHỈ thân robot co giãn. Khung chat, bong bóng, bảng chỉnh nằm NGOÀI hộp
 * này (vùng `.rb-nd` của nơi chứa) nên giữ nguyên cỡ ở mọi %. Người dùng
 * 04/10/2026: *"khung chat cố định kích thước khi robot đổi cỡ"* — con trong
 * app cũ `scale()` cả dock nên khung co theo robot.
 *
 * Những thứ phải ĐỌC ĐƯỢC ở mọi cỡ (chữ zzz, số % khi chỉnh, huy hiệu chưa
 * đọc) cũng nằm ngoài vùng zoom.
 */
import type { CSSProperties, ReactNode } from 'react';
import { OdinRobot } from '../features/odin/OdinRobot';
import type { OdinMood } from '../features/odin/useOdin';
import { dich } from '../i18n';

/** Cỡ hộp ở 100% — khớp `CO_GOC` bên `main/robotViTri.ts`. */
export const HOP_GOC = { rong: 150, cao: 160 } as const;

/** Dưới cỡ này nút mic nhỏ quá không bấm trúng ⇒ ẩn (vẫn còn chat gõ). */
export const CO_AN_MIC = 45;

export function coHopPx(phanTram: number): { rong: number; cao: number } {
  return {
    rong: Math.round(HOP_GOC.rong * phanTram / 100),
    cao: Math.round(HOP_GOC.cao * phanTram / 100),
  };
}

export type TrangThaiNoi = 'im' | 'nghe' | 'nghi' | 'doc';

/** Nút giữ-để-nói — cùng hình cho cả hai con. */
export function NutNoi({
  tt, onBatDau, onTha, onDung,
}: {
  tt: TrangThaiNoi;
  onBatDau: () => void;
  onTha: () => void;
  /** Đang đọc thành tiếng ⇒ nút thành nút DỪNG. Bỏ trống thì không có nút dừng. */
  onDung?: () => void;
}) {
  if (tt === 'doc' && onDung) {
    return (
      <button
        type="button"
        className="odin-mic rb-dung"
        onClick={onDung}
        title={dich('Đang đọc — bấm để dừng')}
        aria-label={dich('Dừng đọc')}
      >
        <span className="odin-wave" aria-hidden><i /><i /><i /><i /></span>
      </button>
    );
  }
  return (
    <button
      type="button"
      className="odin-mic"
      data-tt={tt}
      disabled={tt === 'nghi'}
      onPointerDown={onBatDau}
      onPointerUp={onTha}
      onPointerLeave={onTha}
      title={tt === 'nghi' ? dich('Đang nghĩ…') : dich('Giữ để nói')}
      aria-label={dich('Giữ để nói')}
    >
      {tt === 'nghe'
        ? <span className="odin-wave" aria-hidden><i /><i /><i /><i /></span>
        : tt === 'nghi'
          ? <span className="rb-xoay" />
          : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          )}
    </button>
  );
}

/** Dòng gợi ý khi rê chuột — chung cho hai con, nên hai con dạy cùng một luật bấm. */
export function tieuDeThan(keoDuoc: boolean): string {
  return keoDuoc
    ? dich('Kéo để dời robot · bấm 3 lần để xong')
    : dich('Bấm 1 lần: mở khung chat nhanh')
      + '\n' + dich('Bấm 2 lần: mở trang AI Chat')
      + '\n' + dich('Bấm 3 lần: bật/tắt chế độ kéo và đổi cỡ')
      + '\n' + dich('Bấm 4 lần: ẩn robot')
      + '\n' + dich('Chuột phải: menu đầy đủ');
}

export interface ThanRobotProps {
  phanTram: number;
  mood: OdinMood;
  nhay: boolean;
  hover: boolean;
  datHover: (v: boolean) => void;
  keoDuoc: boolean;
  /** Vừa đổi cỡ bằng phím ⇒ hiện số % thoáng qua. */
  hienSo: boolean;
  /** Đang đọc thành tiếng ⇒ bong bóng "…" trên đầu. */
  dangDoc?: boolean;
  /** Chấm báo có tin, màu theo loại. */
  cham?: string | null;
  /** Huy hiệu (số chưa đọc…) — vẽ NGOÀI vùng zoom để đọc được ở mọi cỡ. */
  phuHieu?: ReactNode;
  nutNoi: ReactNode;
  /** Vị trí của hộp — mỗi nơi chứa tự tính. */
  style?: CSSProperties;
  /** Cỡ hộp thật nếu nơi chứa đã có số (con nổi: main tính). */
  coHop?: { width: number; height: number } | undefined;
  nhan?: string;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onBam: (e: { detail: number; screenX: number; screenY: number }) => void;
  onContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
}

export function ThanRobot(p: ThanRobotProps) {
  const co = coHopPx(p.phanTram);
  const rong = p.coHop?.width ?? co.rong;
  const cao = p.coHop?.height ?? co.cao;
  const style = {
    ...p.style,
    width: rong,
    height: cao,
    '--rb-ti': String(p.phanTram / 100),
  } as CSSProperties;

  return (
    <div className="rb-hop" style={style} data-nho={p.phanTram < CO_AN_MIC}>
      <div className="rb-hop-trong" style={{ zoom: p.phanTram / 100 }}>
        <div
          className="rb-than"
          role="button"
          tabIndex={0}
          aria-label={p.nhan ?? 'Odin'}
          onPointerDown={p.onPointerDown}
          onClick={(e) => p.onBam(e)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            p.onBam({ detail: 0, screenX: 0, screenY: 0 });
          }}
          onContextMenu={p.onContextMenu}
          onMouseEnter={() => p.datHover(true)}
          onMouseLeave={() => p.datHover(false)}
          title={tieuDeThan(p.keoDuoc)}
        >
          {p.dangDoc && <span className="rb-nghi-icon" aria-hidden><i /><i /><i /></span>}
          {p.mood === 'boiRoi' && <span className="rb-hoi" aria-hidden>?</span>}
          {p.mood === 'matMang' && (
            <span className="rb-mat-mang" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" opacity="0.45" />
                <path d="M4 4l16 16" />
              </svg>
            </span>
          )}
          {(p.mood === 'vui' || p.mood === 'mung') && <span className="rb-lap-lanh" aria-hidden><i /><i /><i /></span>}
          <OdinRobot mood={p.mood} blinking={p.nhay} hovering={p.hover} size={104} />
          {p.cham && <span className="rb-cham" data-loai={p.cham} />}
        </div>

        {/* Nút nói nằm NGOÀI `.rb-than` — thân đã nhận 1/2/3/4 cú bấm + kéo. */}
        <div className="rb-noi">{p.nutNoi}</div>
      </div>

      {/* Ngáy — ngoài vùng zoom, cỡ chữ theo `--rb-ti` (có sàn). */}
      {p.mood === 'ngu' && (
        <span className="rb-zzz" aria-hidden><i>z</i><i>z</i><i>Z</i></span>
      )}
      {p.phuHieu}
      {p.keoDuoc && p.hienSo && (
        <output className="rb-co-nhanh" aria-live="polite">{p.phanTram}%</output>
      )}
    </div>
  );
}
