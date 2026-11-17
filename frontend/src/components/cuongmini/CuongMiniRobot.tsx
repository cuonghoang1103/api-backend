'use client';

/**
 * ============================================================
 * CUONGMINI — con robot của app desktop, nay có trên web (17/11/2026)
 * ============================================================
 *
 * Người dùng: "thay icon AI đó bằng icon CuongMini dễ thương bên app desktop, nhiều biểu cảm, và ỔN ĐỊNH — không
 * hiện rồi biến như icon trên web bây giờ".
 *
 * Bản vẽ chép NGUYÊN từ `desktop/src/renderer/features/odin/OdinRobot.tsx` (đầu mây, mặt màn hình tối, mắt xanh
 * lam-lục, thân mang dấu `>_`, tỉ lệ chibi) + biểu cảm của `odin.css`/`robotChung.css`. KHÔNG import chéo gói lúc
 * dựng: web không phụ thuộc cây `desktop/`, nên sửa hình ở desktop thì soi lại tệp này (và ngược lại).
 *
 * ⚠️ VÌ SAO SVG NỘI TUYẾN, KHÔNG PHẢI ẢNH/LOTTIE: nút trợ lý cũ đổi từ `robot-avatar.png` sang Lottie khi người dùng
 * rê chuột — Lottie nạp chunk 300 KB bằng `next/dynamic` mà KHÔNG có khung chờ, nên con robot BIẾN MẤT một nhịp rồi
 * hiện lại thành một hình khác (xem docs/so-loi.md 17/11). SVG có sẵn trong gói JS ⇒ không có khoảnh khắc nào trống.
 *
 * Nháy mắt do CHÍNH component này tự hẹn giờ (không đẩy state lên cha): cha re-render mỗi 4 s chỉ để chớp mắt là
 * kéo theo cả khung chat vẽ lại.
 */
import { useEffect, useState } from 'react';
import './cuongMiniRobot.css';

export type CamXucCuongMini =
  /** Bình thường, trôi lên xuống. */
  | 'thuong'
  /** Vừa trả lời xong / vừa được bấm — nhảy tưng một cái. */
  | 'vui'
  /** Đang chờ câu trả lời — lắc đầu, bong bóng "…". */
  | 'nghi'
  /** Đang chú ý nghe. */
  | 'nghe'
  /** Lo lắng (lỗi nghiêm trọng). */
  | 'lo'
  /** Không ai động vào một lúc lâu. */
  | 'ngu'
  /** Vẫy tay chào — mở khung gia sư. */
  | 'vay'
  /** Ăn mừng. */
  | 'mung'
  /** Đang "nói" (chữ đang chảy về) — miệng mấp máy. */
  | 'noi'
  /** Hỏi lỗi — nghiêng đầu, mắt lệch, dấu hỏi. */
  | 'boiRoi'
  /** Mất mạng — nhạt màu, mắt cụp. */
  | 'matMang';

/** Bộ mắt — mắt mang toàn bộ biểu cảm. Toạ độ y hệt bản desktop. */
function Mat({ mood, nhay, cuoi }: { mood: CamXucCuongMini; nhay: boolean; cuoi: boolean }) {
  if (nhay || mood === 'ngu') {
    return (
      <>
        <rect x="54" y="76" width="22" height="5" rx="2.5" fill="var(--cmr-eye)" />
        <rect x="92" y="76" width="22" height="5" rx="2.5" fill="var(--cmr-eye)" />
      </>
    );
  }
  if (cuoi || mood === 'vui' || mood === 'vay' || mood === 'mung') {
    return (
      <>
        <path d="M54 82 Q65 66 76 82" stroke="var(--cmr-eye)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M92 82 Q103 66 114 82" stroke="var(--cmr-eye)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <ellipse cx="47" cy="88" rx="7" ry="4.5" fill="var(--cmr-eye)" opacity="0.32" />
        <ellipse cx="121" cy="88" rx="7" ry="4.5" fill="var(--cmr-eye)" opacity="0.32" />
      </>
    );
  }
  if (mood === 'lo') {
    return (
      <>
        <rect x="56" y="76" width="18" height="13" rx="6.5" fill="var(--cmr-eye)" />
        <rect x="94" y="76" width="18" height="13" rx="6.5" fill="var(--cmr-eye)" />
        <path d="M52 66 L76 72" stroke="var(--cmr-eye)" strokeWidth="4" strokeLinecap="round" />
        <path d="M116 66 L92 72" stroke="var(--cmr-eye)" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }
  if (mood === 'nghe') {
    return (
      <>
        <rect x="54" y="68" width="22" height="26" rx="11" fill="var(--cmr-eye)" />
        <rect x="92" y="68" width="22" height="26" rx="11" fill="var(--cmr-eye)" />
        <circle cx="65" cy="76" r="4" fill="var(--cmr-screen)" opacity="0.5" />
        <circle cx="103" cy="76" r="4" fill="var(--cmr-screen)" opacity="0.5" />
      </>
    );
  }
  if (mood === 'boiRoi') {
    return (
      <>
        <rect x="55" y="72" width="22" height="22" rx="11" fill="var(--cmr-eye)" />
        <rect x="95" y="78" width="15" height="11" rx="5.5" fill="var(--cmr-eye)" />
        <path d="M92 70 L114 66" stroke="var(--cmr-eye)" strokeWidth="4" strokeLinecap="round" />
        <path d="M74 96 q6 -4 12 0 q6 4 12 0" stroke="var(--cmr-eye)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (mood === 'matMang') {
    return (
      <>
        <path d="M54 78 Q65 90 76 78" stroke="var(--cmr-eye)" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M92 78 Q103 90 114 78" stroke="var(--cmr-eye)" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.8" />
      </>
    );
  }
  if (mood === 'noi') {
    return (
      <>
        <rect x="56" y="70" width="18" height="18" rx="9" fill="var(--cmr-eye)" />
        <rect x="94" y="70" width="18" height="18" rx="9" fill="var(--cmr-eye)" />
        <ellipse className="cmr-mieng" cx="84" cy="95" rx="7" ry="4" fill="var(--cmr-eye)" />
      </>
    );
  }
  if (mood === 'nghi') {
    // Liếc sang một bên — dáng đang nghĩ.
    return (
      <>
        <rect x="59" y="72" width="19" height="19" rx="9.5" fill="var(--cmr-eye)" />
        <rect x="97" y="72" width="19" height="19" rx="9.5" fill="var(--cmr-eye)" />
      </>
    );
  }
  // Bình thường: mắt bo tròn kiểu ngái ngủ, đúng bản thiết kế gốc.
  return (
    <>
      <path d="M54 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="var(--cmr-eye)" />
      <path d="M92 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="var(--cmr-eye)" />
    </>
  );
}

/** Tự chớp mắt: mỗi 3,2–5,2 s nhắm 140 ms. Tắt khi người dùng xin bớt chuyển động. */
function useChopMat(bat: boolean): boolean {
  const [nhay, datNhay] = useState(false);
  useEffect(() => {
    if (!bat) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let hen: number | undefined;
    let tat: number | undefined;
    const lap = () => {
      hen = window.setTimeout(() => {
        datNhay(true);
        tat = window.setTimeout(() => { datNhay(false); lap(); }, 140);
      }, 3200 + Math.random() * 2000);
    };
    lap();
    return () => { window.clearTimeout(hen); window.clearTimeout(tat); };
  }, [bat]);
  return nhay;
}

export function CuongMiniRobot({
  mood = 'thuong',
  size = 64,
  hover = false,
  chopMat = true,
  className = '',
  title,
  tinh = false,
}: {
  mood?: CamXucCuongMini;
  /** Đứng yên (avatar của các lượt cũ trong danh sách — hàng chục con cùng nhún nhảy là rối mắt). */
  tinh?: boolean;
  /** Bề ngang (px). Cao ≈ 0,98 × ngang. */
  size?: number;
  /** Con trỏ đang ở trên robot ⇒ mặt cười, bay lên, giơ tay. */
  hover?: boolean;
  chopMat?: boolean;
  className?: string;
  /** Có ⇒ ảnh có nghĩa (role=img); không ⇒ trang trí (aria-hidden). */
  title?: string;
}) {
  const nhay = useChopMat(chopMat && !tinh && mood !== 'ngu');
  return (
    <span
      className={`cmr ${className}`}
      data-mood={mood}
      data-hover={hover ? 'true' : undefined}
      data-nho={size < 30 ? 'true' : undefined}
      data-tinh={tinh ? 'true' : undefined}
      style={{ width: size, height: Math.round(size * 0.98), ['--cmr-co' as string]: `${size}px` }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {mood === 'nghi' && <span className="cmr-phu cmr-nghi-bong"><i /><i /><i /></span>}
      {mood === 'boiRoi' && <span className="cmr-phu cmr-hoi">?</span>}
      {(mood === 'vui' || mood === 'mung') && <span className="cmr-phu cmr-lap-lanh"><i /><i /><i /></span>}
      {mood === 'ngu' && <span className="cmr-phu cmr-zzz"><i>z</i><i>z</i><i>Z</i></span>}
      <svg className="cmr-svg" width={size} height={Math.round(size * 0.98)} viewBox="0 0 168 165" focusable="false" aria-hidden>
        {/* Chân: ngắn, mập, sát nhau — vẽ trước thân để thân đè lên chỗ nối. */}
        <g className="cmr-legs">
          <rect x="62" y="130" width="19" height="20" rx="9.5" fill="var(--cmr-body-light)" />
          <rect x="87" y="130" width="19" height="20" rx="9.5" fill="var(--cmr-body-light)" />
        </g>
        {/* Thân: nhỏ hơn đầu nhiều, mang ô nhắc lệnh `>_`. */}
        <g className="cmr-body">
          <rect x="52" y="103" width="64" height="36" rx="17" fill="var(--cmr-body)" />
          <rect x="62" y="111" width="44" height="21" rx="8" fill="var(--cmr-screen)" />
          <path d="M70 117 l5 4 l-5 4" stroke="var(--cmr-eye)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="80" y="123" width="14" height="3" rx="1.5" fill="var(--cmr-eye)" />
        </g>
        {/* Đầu: to, rộng, dạng mây. */}
        <g className="cmr-head">
          <path
            d="M30 62 a26 26 0 0 1 20 -32 a30 30 0 0 1 30 -18 a30 30 0 0 1 30 16 a26 26 0 0 1 26 30 a24 24 0 0 1 -12 34 h-84 a24 24 0 0 1 -10 -30 z"
            fill="var(--cmr-body-light)"
          />
          <path d="M42 46 a20 20 0 0 1 17 -18 a22 22 0 0 1 15 4" stroke="var(--cmr-highlight)" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.55" />
          <rect x="40" y="50" width="88" height="54" rx="20" fill="var(--cmr-screen)" />
          <rect x="40" y="50" width="88" height="54" rx="20" fill="none" stroke="var(--cmr-outline)" strokeWidth="3" />
          <Mat mood={mood} nhay={nhay} cuoi={hover} />
        </g>
        {/* Tay: vẽ SAU đầu — giơ lên thì tay ngang tầm đầu, vẽ trước sẽ chui ra sau và biến mất. */}
        <g className="cmr-arms">
          <rect className="cmr-arm cmr-arm-left" x="36" y="104" width="18" height="31" rx="9" fill="var(--cmr-body-light)" />
          <rect className="cmr-arm cmr-arm-right" x="114" y="104" width="18" height="31" rx="9" fill="var(--cmr-body-light)" />
        </g>
        <ellipse className="cmr-shadow" cx="84" cy="157" rx="30" ry="5.5" fill="var(--cmr-outline)" opacity="0.22" />
      </svg>
    </span>
  );
}

export default CuongMiniRobot;
