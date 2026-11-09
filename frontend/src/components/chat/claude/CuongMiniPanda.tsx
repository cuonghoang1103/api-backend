'use client';

/**
 * 🐼 CuongMini — linh vật gấu trúc của trang /chat (09/11/2026).
 *
 * Nhân vật RIÊNG của CuongThai (không phải ngôi sao của Anthropic): gấu trúc tròn kiểu "đất sét 3D" — đổ bóng
 * bằng gradient toả tròn, mắt to có đốm sáng, má hồng, một chiếc lá tre màu tím thương hiệu trên đầu.
 *
 * Chỉ là SVG + CSS (không three.js) ⇒ đặt được ở mọi cỡ, mọi chỗ: logo thanh bên, lời chào, đầu câu trả lời.
 * Chuyển động (claudeChat.css › .cmp-*): lắc lư nhẹ, chớp mắt, vẫy tai, lá tre đung đưa. `state="thinking"` ⇒
 * nhún nhanh + mắt liếc lên (đang nghĩ). `prefers-reduced-motion` ⇒ đứng yên.
 */
import { useId } from 'react';

export function CuongMiniPanda({
  size = 32,
  state = 'idle',
  className = '',
  title,
}: {
  size?: number;
  state?: 'idle' | 'thinking' | 'still';
  className?: string;
  /** Có tiêu đề ⇒ là ảnh có nghĩa (role=img); không ⇒ trang trí (aria-hidden). */
  title?: string;
}) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (k: string) => `cmp${raw}${k}`;
  return (
    <svg
      className={`cmp ${className}`}
      data-state={state}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <radialGradient id={id('head')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f3f2f8" />
          <stop offset="85%" stopColor="#d9d6e8" />
          <stop offset="100%" stopColor="#bdb8d4" />
        </radialGradient>
        <radialGradient id={id('dark')} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#5b5570" />
          <stop offset="60%" stopColor="#2a2638" />
          <stop offset="100%" stopColor="#15121f" />
        </radialGradient>
        <radialGradient id={id('ear')} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#4d4762" />
          <stop offset="100%" stopColor="#17141f" />
        </radialGradient>
        <linearGradient id={id('leaf')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b9a6ff" />
          <stop offset="55%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#4c2fe0" />
        </linearGradient>
        <radialGradient id={id('cheek')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8fb8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff8fb8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('shadow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1430" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1a1430" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bóng dưới chân — co giãn ngược nhịp nhún */}
      <ellipse className="cmp-shadow" cx="60" cy="111" rx="34" ry="6" fill={`url(#${id('shadow')})`} />

      <g className="cmp-body">
        {/* Tai */}
        <g className="cmp-ear cmp-ear-l">
          <circle cx="27" cy="30" r="17" fill={`url(#${id('ear')})`} />
          <circle cx="27" cy="31" r="8" fill="#3a3450" opacity="0.7" />
        </g>
        <g className="cmp-ear cmp-ear-r">
          <circle cx="93" cy="30" r="17" fill={`url(#${id('ear')})`} />
          <circle cx="93" cy="31" r="8" fill="#3a3450" opacity="0.7" />
        </g>

        {/* Đầu */}
        <ellipse cx="60" cy="64" rx="46" ry="42" fill={`url(#${id('head')})`} />
        {/* Viền sáng phía trên (cảm giác bóng loáng 3D) */}
        <path d="M30 40 Q45 26 64 25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />

        {/* Lá tre tím thương hiệu */}
        <g className="cmp-leaf">
          <path d="M60 24 C62 14 70 7 82 6 C79 16 71 23 60 24 Z" fill={`url(#${id('leaf')})`} />
          <path d="M61 23 C67 17 73 12 80 8" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" fill="none" />
          <path d="M60 25 L59 30" stroke="#5a3ee6" strokeWidth="2.4" strokeLinecap="round" />
        </g>

        {/* Mảng đen quanh mắt */}
        <ellipse cx="40" cy="64" rx="14" ry="17" transform="rotate(28 40 64)" fill={`url(#${id('dark')})`} />
        <ellipse cx="80" cy="64" rx="14" ry="17" transform="rotate(-28 80 64)" fill={`url(#${id('dark')})`} />

        {/* Mắt (chớp) */}
        <g className="cmp-eyes">
          <g className="cmp-eye">
            <circle cx="42" cy="65" r="7.2" fill="#0d0a14" />
            <circle cx="44.6" cy="62.2" r="2.7" fill="#ffffff" />
            <circle cx="40" cy="68" r="1.2" fill="#ffffff" opacity="0.8" />
          </g>
          <g className="cmp-eye">
            <circle cx="78" cy="65" r="7.2" fill="#0d0a14" />
            <circle cx="80.6" cy="62.2" r="2.7" fill="#ffffff" />
            <circle cx="76" cy="68" r="1.2" fill="#ffffff" opacity="0.8" />
          </g>
        </g>

        {/* Má hồng */}
        <ellipse cx="26" cy="82" rx="10" ry="6.5" fill={`url(#${id('cheek')})`} />
        <ellipse cx="94" cy="82" rx="10" ry="6.5" fill={`url(#${id('cheek')})`} />

        {/* Mũi + miệng */}
        <ellipse cx="60" cy="78" rx="5.6" ry="3.9" fill="#1d1828" />
        <ellipse cx="58.6" cy="76.9" rx="1.8" ry="1" fill="#ffffff" opacity="0.6" />
        <path className="cmp-mouth" d="M52.5 83 Q56.2 87.4 60 83 Q63.8 87.4 67.5 83" stroke="#1d1828" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

/**
 * Chữ "CuongMini" — wordmark: "Cuong" chữ serif đậm màu chữ, "Mini" chữ gradient tím thương hiệu,
 * kèm nhãn nhỏ tuỳ chọn (vd. "Pro").
 */
export function CuongMiniWordmark({ size = 19, badge }: { size?: number; badge?: string }) {
  return (
    <span className="cmw" style={{ fontSize: size }}>
      <span className="cmw-a">Cuong</span><span className="cmw-b">Mini</span>
      {badge && <span className="cmw-badge">{badge}</span>}
    </span>
  );
}
