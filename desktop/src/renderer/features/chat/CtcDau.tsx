/**
 * Dấu CuongMini — linh vật GẤU TRÚC của CuongThai (10/11/2026; thay ngôi sao bốn cánh cam của bản 09/11 — ngôi
 * sao đó quá giống dấu của Anthropic, và màu cam lệch hẳn bảng màu indigo của app).
 *
 * Cùng nhân vật với trang /chat của web (`frontend/.../claude/CuongMiniPanda.tsx`): đầu tròn kiểu đất sét 3D,
 * mắt to có đốm sáng, má hồng, lá tre tím trên đầu. Chuyển động trong chatClaude.css (`.ctc-gau`): lắc lư, chớp
 * mắt, vẫy tai, lá đung đưa; `dangChay` ⇒ nhún nhanh + liếc mắt (đang nghĩ). Giảm chuyển động ⇒ đứng yên.
 */
import { useId } from 'react';

export function CtcDau({ co = 22, dangChay = false }: { co?: number; dangChay?: boolean }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (k: string): string => `ctcg${raw}${k}`;
  return (
    <svg className="ctc-dau ctc-gau" data-chay={dangChay} width={co} height={co} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <radialGradient id={id('h')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f3f2f8" />
          <stop offset="85%" stopColor="#d9d6e8" />
          <stop offset="100%" stopColor="#bdb8d4" />
        </radialGradient>
        <radialGradient id={id('d')} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#5b5570" />
          <stop offset="60%" stopColor="#2a2638" />
          <stop offset="100%" stopColor="#15121f" />
        </radialGradient>
        <radialGradient id={id('e')} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#4d4762" />
          <stop offset="100%" stopColor="#17141f" />
        </radialGradient>
        <linearGradient id={id('l')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b9a6ff" />
          <stop offset="55%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#4c2fe0" />
        </linearGradient>
        <radialGradient id={id('c')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8fb8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff8fb8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('s')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1430" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1a1430" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="ctc-gau-bong" cx="60" cy="111" rx="34" ry="6" fill={`url(#${id('s')})`} />
      <g className="ctc-gau-than">
        <g className="ctc-gau-tai ctc-gau-tai-t">
          <circle cx="27" cy="30" r="17" fill={`url(#${id('e')})`} />
          <circle cx="27" cy="31" r="8" style={{ fill: 'var(--gau-tai)' }} opacity="0.7" />
        </g>
        <g className="ctc-gau-tai ctc-gau-tai-p">
          <circle cx="93" cy="30" r="17" fill={`url(#${id('e')})`} />
          <circle cx="93" cy="31" r="8" style={{ fill: 'var(--gau-tai)' }} opacity="0.7" />
        </g>
        <ellipse cx="60" cy="64" rx="46" ry="42" fill={`url(#${id('h')})`} />
        <path d="M30 40 Q45 26 64 25" style={{ stroke: 'var(--gau-trang)' }} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
        <g className="ctc-gau-la">
          <path d="M60 24 C62 14 70 7 82 6 C79 16 71 23 60 24 Z" fill={`url(#${id('l')})`} />
          <path d="M61 23 C67 17 73 12 80 8" style={{ stroke: 'var(--gau-trang)' }} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" fill="none" />
          <path d="M60 25 L59 30" style={{ stroke: 'var(--gau-cuong)' }} strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <ellipse cx="40" cy="64" rx="14" ry="17" transform="rotate(28 40 64)" fill={`url(#${id('d')})`} />
        <ellipse cx="80" cy="64" rx="14" ry="17" transform="rotate(-28 80 64)" fill={`url(#${id('d')})`} />
        <g className="ctc-gau-mat">
          <g className="ctc-gau-mat1">
            <circle cx="42" cy="65" r="7.2" style={{ fill: 'var(--gau-mat)' }} />
            <circle cx="44.6" cy="62.2" r="2.7" style={{ fill: 'var(--gau-trang)' }} />
            <circle cx="40" cy="68" r="1.2" style={{ fill: 'var(--gau-trang)' }} opacity="0.8" />
          </g>
          <g className="ctc-gau-mat1">
            <circle cx="78" cy="65" r="7.2" style={{ fill: 'var(--gau-mat)' }} />
            <circle cx="80.6" cy="62.2" r="2.7" style={{ fill: 'var(--gau-trang)' }} />
            <circle cx="76" cy="68" r="1.2" style={{ fill: 'var(--gau-trang)' }} opacity="0.8" />
          </g>
        </g>
        <ellipse cx="26" cy="82" rx="10" ry="6.5" fill={`url(#${id('c')})`} />
        <ellipse cx="94" cy="82" rx="10" ry="6.5" fill={`url(#${id('c')})`} />
        <ellipse cx="60" cy="78" rx="5.6" ry="3.9" style={{ fill: 'var(--gau-mui)' }} />
        <ellipse cx="58.6" cy="76.9" rx="1.8" ry="1" style={{ fill: 'var(--gau-trang)' }} opacity="0.6" />
        <path d="M52.5 83 Q56.2 87.4 60 83 Q63.8 87.4 67.5 83" style={{ stroke: 'var(--gau-mui)' }} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

/** Chữ "CuongMini": "Cuong" serif đậm + "Mini" nghiêng gradient tím thương hiệu. */
export function CtcWordmark({ co = 18 }: { co?: number }) {
  return (
    <span className="ctc-wm" style={{ fontSize: co }}>
      <span className="ctc-wm-a">Cuong</span><span className="ctc-wm-b">Mini</span>
    </span>
  );
}
