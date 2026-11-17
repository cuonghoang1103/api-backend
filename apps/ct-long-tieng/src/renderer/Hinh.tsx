/**
 * Hình vẽ dùng chung: con robot CuongMini (chép bản vẽ từ `frontend/src/components/cuongmini/CuongMiniRobot.tsx`,
 * bản tĩnh + tai nghe — "đang nghe để lồng tiếng") và bộ biểu tượng nét mảnh.
 */
import type { ReactNode } from 'react';

export function Robot({ size = 64, vui = false }: { size?: number; vui?: boolean }) {
  return (
    <svg className="robot" width={size} height={Math.round(size * 0.98)} viewBox="0 0 168 165" aria-hidden>
      <g>
        <rect x="62" y="130" width="19" height="20" rx="9.5" fill="#8b9bf5" />
        <rect x="87" y="130" width="19" height="20" rx="9.5" fill="#8b9bf5" />
      </g>
      <g>
        <rect x="52" y="103" width="64" height="36" rx="17" fill="#6b7cf0" />
        <rect x="62" y="111" width="44" height="21" rx="8" fill="#1b2142" />
        <path d="M70 117 l5 4 l-5 4" stroke="#7fe6c9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="80" y="123" width="14" height="3" rx="1.5" fill="#7fe6c9" />
      </g>
      <g className="robot-dau">
        <path d="M30 62 a26 26 0 0 1 20 -32 a30 30 0 0 1 30 -18 a30 30 0 0 1 30 16 a26 26 0 0 1 26 30 a24 24 0 0 1 -12 34 h-84 a24 24 0 0 1 -10 -30 z" fill="#8b9bf5" />
        <path d="M42 46 a20 20 0 0 1 17 -18 a22 22 0 0 1 15 4" stroke="#b9c4ff" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.55" />
        {/* Tai nghe */}
        <path d="M30 70 a54 54 0 0 1 108 0" stroke="#3d4aa8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="22" y="62" width="16" height="30" rx="8" fill="#3d4aa8" />
        <rect x="130" y="62" width="16" height="30" rx="8" fill="#3d4aa8" />
        <rect x="40" y="50" width="88" height="54" rx="20" fill="#1b2142" />
        <rect x="40" y="50" width="88" height="54" rx="20" fill="none" stroke="#3d4aa8" strokeWidth="3" />
        {vui ? (
          <>
            <path d="M54 82 Q65 66 76 82" stroke="#7fe6c9" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M92 82 Q103 66 114 82" stroke="#7fe6c9" strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path className="robot-mat" d="M54 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="#7fe6c9" />
            <path className="robot-mat" d="M92 74 h22 a2.5 2.5 0 0 1 2.5 2.5 v4 a13.5 13.5 0 0 1 -27 0 v-4 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="#7fe6c9" />
          </>
        )}
      </g>
      <g>
        <rect x="36" y="104" width="18" height="31" rx="9" fill="#8b9bf5" />
        <rect x="114" y="104" width="18" height="31" rx="9" fill="#8b9bf5" />
      </g>
    </svg>
  );
}

const nen = (con: ReactNode, size = 18) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {con}
  </svg>
);

export const Icon = {
  micro: (s?: number) => nen(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>, s),
  thuVien: (s?: number) => nen(<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="m10 9 5 2.5-5 2.5z" /><path d="M7 21h10" /></>, s),
  caiDat: (s?: number) => nen(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>, s),
  link: (s?: number) => nen(<><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>, s),
  tep: (s?: number) => nen(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>, s),
  taiLen: (s?: number) => nen(<><path d="M12 15V3M7 8l5-5 5 5" /><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></>, s),
  taiVe: (s?: number) => nen(<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></>, s),
  thuMuc: (s?: number) => nen(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, s),
  phat: (s?: number) => nen(<path d="m7 4 13 8-13 8z" />, s),
  dung: (s?: number) => nen(<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>, s),
  thuLai: (s?: number) => nen(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>, s),
  xoa: (s?: number) => nen(<><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></>, s),
  huy: (s?: number) => nen(<><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>, s),
  dong: (s?: number) => nen(<path d="M6 6l12 12M18 6 6 18" />, s),
  tim: (s?: number) => nen(<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, s),
  lui10: (s?: number) => nen(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><text x="12" y="15.5" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">10</text></>, s),
  toi10: (s?: number) => nen(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /><text x="12" y="15.5" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">10</text></>, s),
  toanManHinh: (s?: number) => nen(<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />, s),
  ngoai: (s?: number) => nen(<><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>, s),
  mayTinh: (s?: number) => nen(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>, s),
};
