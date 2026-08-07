'use client';

/**
 * Maker Lab — hand-drawn part illustrations.
 *
 * Every component in the BOM gets a real drawing rather than a stock
 * photo, for four reasons that all turned out to matter:
 *   1. No licensing question. Supplier photos are not ours to ship.
 *   2. They follow the site theme — a white-background JPEG looks
 *      broken in dark mode, and half this site's readers use it.
 *   3. ~1 KB of inline SVG each instead of ~80 KB of JPEG, times 27
 *      parts, on a page people open on mobile data.
 *   4. Nothing to 404 later. A hotlinked shop image dies when the
 *      listing does.
 *
 * `MakerComponent.imageUrl` still wins when set: once you photograph
 * your own parts and upload them to R2, the real thing takes over.
 */

import type { MakerComponentCategory } from '@/types/maker-lab';

// Shared palette. Fixed hues (a PCB is green in both themes) with
// theme-aware strokes so outlines stay visible either way.
const PCB = '#1f6b45';
const PCB_DARK = '#14472e';
const METAL = '#9aa3ad';
const METAL_DARK = '#6b7480';
const CHIP = '#232936';
const GOLD = '#d9a441';
const COPPER = '#b87333';
const RED = '#e05252';
const BLACK_PLASTIC = '#2b2f36';

/** Two rows of header pins along the bottom of a board. */
function Pins({ y, x0, count, gap = 5 }: { y: number; x0: number; count: number; gap?: number }) {
  return (
    <g fill={GOLD}>
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={x0 + i * gap} y={y} width="2" height="5" rx="0.6" />
      ))}
    </g>
  );
}

type IconProps = { className?: string };

const ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  // ─── Brain ───────────────────────────────────────────────
  esp32s3: () => (
    <g>
      <rect x="10" y="8" width="44" height="48" rx="2" fill={PCB} />
      <rect x="10" y="8" width="44" height="48" rx="2" fill="none" stroke={PCB_DARK} strokeWidth="1" />
      {/* shield can */}
      <rect x="18" y="14" width="28" height="22" rx="1.5" fill={METAL} />
      <rect x="18" y="14" width="28" height="22" rx="1.5" fill="none" stroke={METAL_DARK} strokeWidth="0.8" />
      <text x="32" y="27" textAnchor="middle" fontSize="6" fill={METAL_DARK} fontFamily="monospace">
        S3
      </text>
      {/* PCB antenna */}
      <path d="M20 11h24M22 11v-2h4v2M30 11v-2h4v2M38 11v-2h4v2" stroke={COPPER} strokeWidth="1.2" fill="none" />
      {/* USB-C ports */}
      <rect x="14" y="44" width="9" height="4" rx="2" fill={METAL_DARK} />
      <rect x="41" y="44" width="9" height="4" rx="2" fill={METAL_DARK} />
      {/* header rows, top and bottom */}
      <Pins y={56} x0={12} count={9} gap={4.6} />
      <Pins y={3} x0={12} count={9} gap={4.6} />
      <circle cx="50" cy="40" r="1.6" fill={RED} />
    </g>
  ),

  // ─── Hearing ─────────────────────────────────────────────
  inmp441: () => (
    <g>
      <rect x="16" y="14" width="32" height="36" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="24" y="20" width="16" height="12" rx="1" fill={CHIP} />
      <circle cx="32" cy="26" r="3.2" fill="#0b0d10" />
      <circle cx="32" cy="26" r="1.4" fill={METAL_DARK} />
      <text x="32" y="40" textAnchor="middle" fontSize="5" fill="#cfe8d8" fontFamily="monospace">
        I2S
      </text>
      <Pins y={50} x0={19} count={6} />
    </g>
  ),

  // ─── Speaking ────────────────────────────────────────────
  max98357a: () => (
    <g>
      <rect x="14" y="16" width="36" height="32" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="20" y="22" width="14" height="11" rx="1" fill={CHIP} />
      <path d="M22 25h10M22 28h10M22 31h7" stroke="#5b6472" strokeWidth="0.8" />
      {/* screw terminal for the speaker */}
      <rect x="38" y="22" width="9" height="11" rx="1" fill="#3a7bd5" />
      <circle cx="42.5" cy="25.5" r="1.4" fill={METAL} />
      <circle cx="42.5" cy="29.5" r="1.4" fill={METAL} />
      <text x="32" y="41" textAnchor="middle" fontSize="4.5" fill="#cfe8d8" fontFamily="monospace">
        3W AMP
      </text>
      <Pins y={48} x0={17} count={7} />
    </g>
  ),

  speaker: () => (
    <g>
      <circle cx="32" cy="32" r="22" fill={BLACK_PLASTIC} />
      <circle cx="32" cy="32" r="22" fill="none" stroke={METAL_DARK} strokeWidth="1" />
      <circle cx="32" cy="32" r="16" fill="#3a3f47" />
      <circle cx="32" cy="32" r="9" fill="#22262c" />
      <circle cx="32" cy="32" r="4" fill="#4a5058" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={32 + 19 * Math.cos((a * Math.PI) / 180)}
          cy={32 + 19 * Math.sin((a * Math.PI) / 180)}
          r="1.3"
          fill={METAL_DARK}
        />
      ))}
      <path d="M50 40l7 3M50 44l7 3" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),

  // ─── Face ────────────────────────────────────────────────
  gc9a01: () => (
    <g>
      <circle cx="32" cy="32" r="23" fill="#12151a" stroke={METAL_DARK} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="19" fill="#0a0c0f" />
      {/* an eye, because that's what it's for */}
      <circle cx="32" cy="32" r="13" fill="#1e88e5" />
      <circle cx="32" cy="32" r="8" fill="#0d47a1" />
      <circle cx="32" cy="32" r="5" fill="#05070a" />
      <circle cx="28.5" cy="28" r="2.4" fill="#ffffff" opacity="0.85" />
      <path d="M20 52h24" stroke={COPPER} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),

  ws2812ring: () => (
    <g>
      <circle cx="32" cy="32" r="22" fill="none" stroke="#e8e8e8" strokeWidth="7" />
      <circle cx="32" cy="32" r="22" fill="none" stroke={METAL_DARK} strokeWidth="0.6" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const hue = (i * 22) % 360;
        return (
          <rect
            key={i}
            x={32 + 22 * Math.cos(a) - 2.2}
            y={32 + 22 * Math.sin(a) - 2.2}
            width="4.4"
            height="4.4"
            rx="0.8"
            fill={`hsl(${hue} 85% 58%)`}
          />
        );
      })}
    </g>
  ),

  // ─── Motion ──────────────────────────────────────────────
  motor: () => (
    <g>
      {/* gearbox */}
      <rect x="8" y="20" width="18" height="24" rx="2" fill={METAL} stroke={METAL_DARK} />
      <path d="M12 24h10M12 28h10M12 32h10M12 36h10M12 40h10" stroke={METAL_DARK} strokeWidth="0.6" />
      {/* can */}
      <rect x="26" y="22" width="24" height="20" rx="9" fill="#b9c1c9" stroke={METAL_DARK} />
      <ellipse cx="50" cy="32" rx="3" ry="10" fill="#a2abb4" stroke={METAL_DARK} strokeWidth="0.6" />
      {/* shaft */}
      <rect x="2" y="30" width="7" height="4" rx="1" fill={METAL_DARK} />
      {/* encoder board on the tail */}
      <rect x="52" y="25" width="7" height="14" rx="1" fill={PCB} stroke={PCB_DARK} />
      <circle cx="55.5" cy="29" r="1" fill={GOLD} />
      <circle cx="55.5" cy="35" r="1" fill={GOLD} />
      <path d="M59 28h4M59 32h4M59 36h4" stroke={RED} strokeWidth="1" strokeLinecap="round" />
    </g>
  ),

  wheel: () => (
    <g>
      <circle cx="32" cy="32" r="25" fill="#2c3036" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#1a1d21" strokeWidth="1" />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={32 + 21 * Math.cos(a)}
            y1={32 + 21 * Math.sin(a)}
            x2={32 + 25 * Math.cos(a)}
            y2={32 + 25 * Math.sin(a)}
            stroke="#4a5058"
            strokeWidth="2"
          />
        );
      })}
      <circle cx="32" cy="32" r="16" fill="#f0c020" />
      <circle cx="32" cy="32" r="6" fill="#2c3036" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={32 + 11 * Math.cos((a * Math.PI) / 180)}
          cy={32 + 11 * Math.sin((a * Math.PI) / 180)}
          r="2.4"
          fill="#d4a418"
        />
      ))}
    </g>
  ),

  track: () => (
    <g>
      {/* the rounded track loop that makes it read as WALL-E */}
      <path
        d="M18 20h28a12 12 0 0 1 0 24H18a12 12 0 0 1 0-24z"
        fill="#2c3036"
        stroke="#1a1d21"
        strokeWidth="1.2"
      />
      <path
        d="M18 24h28a8 8 0 0 1 0 16H18a8 8 0 0 1 0-16z"
        fill="none"
        stroke="#4a5058"
        strokeWidth="1"
      />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={20 + i * 3.6} y1="20" x2={20 + i * 3.6} y2="24" stroke="#5a626c" strokeWidth="1.6" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`b${i}`} x1={20 + i * 3.6} y1="40" x2={20 + i * 3.6} y2="44" stroke="#5a626c" strokeWidth="1.6" />
      ))}
      <circle cx="18" cy="32" r="7" fill="#f0c020" stroke="#c99e12" />
      <circle cx="46" cy="32" r="7" fill="#9aa3ad" stroke={METAL_DARK} />
      <circle cx="18" cy="32" r="2.4" fill="#2c3036" />
      <circle cx="46" cy="32" r="2.4" fill="#2c3036" />
    </g>
  ),

  pca9685: () => (
    <g>
      <rect x="8" y="20" width="48" height="24" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="14" y="26" width="14" height="10" rx="1" fill={CHIP} />
      <text x="21" y="33" textAnchor="middle" fontSize="4" fill="#8a93a3" fontFamily="monospace">
        9685
      </text>
      {/* three-pin servo headers, the recognisable bit */}
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <rect x={32 + i * 4.6} y="24" width="3.4" height="14" rx="0.6" fill={BLACK_PLASTIC} />
          <rect x={33.2 + i * 4.6} y="25" width="1" height="3" fill={GOLD} />
          <rect x={33.2 + i * 4.6} y="29.5" width="1" height="3" fill={GOLD} />
          <rect x={33.2 + i * 4.6} y="34" width="1" height="3" fill={GOLD} />
        </g>
      ))}
      <Pins y={44} x0={11} count={6} gap={3.4} />
    </g>
  ),

  paint: () => (
    <g>
      <rect x="18" y="18" width="16" height="34" rx="3" fill="#f0b429" stroke="#c99e12" />
      <rect x="20" y="10" width="12" height="8" rx="2" fill={METAL} stroke={METAL_DARK} />
      <rect x="23" y="5" width="6" height="6" rx="1.5" fill={METAL_DARK} />
      <text x="26" y="38" textAnchor="middle" fontSize="5" fill="#6b4e08" fontFamily="monospace">
        1023
      </text>
      {/* spray */}
      <g fill="#f0b429" opacity="0.55">
        {[[40, 12], [46, 16], [43, 20], [50, 13], [48, 22], [54, 18]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={1.6 - (i % 3) * 0.35} />
        ))}
      </g>
      <rect x="40" y="30" width="14" height="24" rx="2.5" fill="#78838f" stroke={METAL_DARK} />
      <text x="47" y="44" textAnchor="middle" fontSize="4.5" fill="#e5e9ec" fontFamily="monospace">
        7016
      </text>
    </g>
  ),

  caster: () => (
    <g>
      <rect x="18" y="10" width="28" height="6" rx="1" fill={METAL} stroke={METAL_DARK} />
      <circle cx="22" cy="13" r="1.5" fill={CHIP} />
      <circle cx="42" cy="13" r="1.5" fill={CHIP} />
      <path d="M24 16h16v10a8 8 0 0 1-16 0z" fill="#c3cad2" stroke={METAL_DARK} />
      <circle cx="32" cy="38" r="14" fill="#e8ecef" stroke={METAL_DARK} strokeWidth="1" />
      <circle cx="27" cy="33" r="4" fill="#ffffff" opacity="0.7" />
    </g>
  ),

  servo: () => (
    <g>
      <rect x="16" y="20" width="26" height="28" rx="2" fill="#1f6fd0" stroke="#144a8c" />
      <rect x="10" y="24" width="6" height="8" rx="1" fill="#1f6fd0" />
      <rect x="42" y="24" width="6" height="8" rx="1" fill="#1f6fd0" />
      <circle cx="10" cy="28" r="1.6" fill={CHIP} />
      <circle cx="48" cy="28" r="1.6" fill={CHIP} />
      <circle cx="29" cy="18" r="6" fill="#e8ecef" stroke={METAL_DARK} />
      <circle cx="29" cy="18" r="2" fill={METAL_DARK} />
      <rect x="27" y="6" width="4" height="12" rx="1" fill="#ffffff" stroke={METAL_DARK} strokeWidth="0.6" />
      <path d="M20 48v8M26 48v8M32 48v8" stroke={CHIP} strokeWidth="1.6" />
      <path d="M20 56h12" stroke={BLACK_PLASTIC} strokeWidth="3" />
    </g>
  ),

  // ─── Driver ──────────────────────────────────────────────
  drv8833: () => (
    <g>
      <rect x="17" y="16" width="30" height="32" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="24" y="24" width="16" height="12" rx="1" fill={CHIP} />
      <text x="32" y="32" textAnchor="middle" fontSize="4.5" fill="#8a93a3" fontFamily="monospace">
        8833
      </text>
      <rect x="19" y="19" width="4" height="3" rx="0.5" fill={COPPER} />
      <rect x="41" y="19" width="4" height="3" rx="0.5" fill={COPPER} />
      <rect x="20" y="39" width="24" height="4" rx="1" fill="#3a7bd5" />
      <Pins y={48} x0={20} count={6} />
    </g>
  ),

  // ─── Sensors ─────────────────────────────────────────────
  mpu6050: () => (
    <g>
      <rect x="18" y="18" width="28" height="28" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="26" y="26" width="12" height="12" rx="1" fill={CHIP} />
      <circle cx="28.5" cy="28.5" r="0.9" fill="#7d8698" />
      {/* the three axes are the whole point of this part */}
      <path d="M32 32l7-5M32 32l7 5M32 32v-8" stroke="#4fc3f7" strokeWidth="1" strokeLinecap="round" />
      <Pins y={46} x0={21} count={5} />
    </g>
  ),

  vl53l0x: () => (
    <g>
      <rect x="18" y="20" width="28" height="24" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="24" y="26" width="7" height="9" rx="1" fill="#12151a" />
      <rect x="33" y="26" width="7" height="9" rx="1" fill="#12151a" />
      <circle cx="27.5" cy="30.5" r="2" fill="#ef5350" opacity="0.9" />
      <circle cx="36.5" cy="30.5" r="2" fill="#37474f" />
      {/* laser going out */}
      <path d="M46 30h14" stroke="#ef5350" strokeWidth="1.4" strokeDasharray="3 2" strokeLinecap="round" />
      <Pins y={44} x0={21} count={5} />
    </g>
  ),

  touch: () => (
    <g>
      <rect x="16" y="20" width="32" height="24" rx="2" fill={PCB} stroke={PCB_DARK} />
      <circle cx="32" cy="31" r="8" fill="none" stroke={COPPER} strokeWidth="2" />
      <circle cx="32" cy="31" r="4.5" fill="none" stroke={COPPER} strokeWidth="1.4" />
      <circle cx="32" cy="31" r="1.6" fill={COPPER} />
      <path d="M32 12v6M27 15l3 4M37 15l-3 4" stroke="#4fc3f7" strokeWidth="1.2" strokeLinecap="round" />
      <Pins y={44} x0={24} count={3} />
    </g>
  ),

  irsensor: () => (
    <g>
      <rect x="18" y="24" width="28" height="18" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="23" y="16" width="8" height="10" rx="2" fill="#1565c0" />
      <rect x="33" y="16" width="8" height="10" rx="2" fill="#1b1e23" />
      <path d="M27 10v-4M37 10v-4" stroke="#4fc3f7" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M27 8l-3-3M37 8l3-3" stroke="#4fc3f7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <Pins y={42} x0={24} count={4} />
    </g>
  ),

  // ─── Power ───────────────────────────────────────────────
  cell18650: () => (
    <g>
      <rect x="14" y="22" width="38" height="20" rx="3" fill="#2e7d32" stroke="#1b5e20" />
      <rect x="14" y="22" width="38" height="7" rx="3" fill="#43a047" opacity="0.6" />
      <rect x="52" y="27" width="4" height="10" rx="1" fill={METAL} />
      <rect x="10" y="26" width="4" height="12" rx="1" fill={METAL_DARK} />
      <text x="32" y="35" textAnchor="middle" fontSize="6" fill="#e8f5e9" fontFamily="monospace">
        18650
      </text>
      <text x="57" y="27" textAnchor="middle" fontSize="7" fill={METAL_DARK}>
        +
      </text>
    </g>
  ),

  bms: () => (
    <g>
      <rect x="8" y="26" width="48" height="14" rx="1.5" fill={PCB} stroke={PCB_DARK} />
      <rect x="13" y="30" width="8" height="6" rx="0.8" fill={CHIP} />
      <rect x="24" y="30" width="8" height="6" rx="0.8" fill={CHIP} />
      <rect x="35" y="30" width="6" height="6" rx="0.8" fill={CHIP} />
      <circle cx="47" cy="33" r="2.4" fill={COPPER} />
      <path d="M6 30h2M6 36h2M56 33h3" stroke={RED} strokeWidth="1.4" strokeLinecap="round" />
      <text x="32" y="24" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7" fontFamily="monospace">
        2S BMS
      </text>
    </g>
  ),

  charger: () => (
    <g>
      <rect x="12" y="20" width="40" height="24" rx="2" fill={PCB} stroke={PCB_DARK} />
      <rect x="10" y="26" width="8" height="8" rx="1.5" fill={METAL_DARK} />
      <rect x="24" y="26" width="12" height="10" rx="1" fill={CHIP} />
      <rect x="39" y="26" width="8" height="5" rx="1" fill="#3a7bd5" />
      <circle cx="43" cy="38" r="1.8" fill="#66bb6a" />
      <circle cx="48" cy="38" r="1.8" fill={RED} />
      <path d="M32 12l-3 6h5l-3 6" stroke="#ffca28" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    </g>
  ),

  buck: () => (
    <g>
      <rect x="14" y="22" width="36" height="20" rx="2" fill={PCB} stroke={PCB_DARK} />
      {/* inductor */}
      <rect x="18" y="26" width="11" height="11" rx="2.5" fill="#3e2a12" stroke="#2a1c0c" />
      <path d="M20 31h7" stroke={COPPER} strokeWidth="1.4" />
      {/* trimmer */}
      <circle cx="37" cy="31" r="4.5" fill="#1565c0" />
      <path d="M34.5 31h5" stroke="#e3f2fd" strokeWidth="1.2" />
      <rect x="44" y="27" width="4" height="9" rx="1" fill={CHIP} />
      <path d="M11 27h3M11 37h3M50 27h3M50 37h3" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),

  capacitor: () => (
    <g>
      <rect x="20" y="10" width="24" height="34" rx="4" fill="#1e3a5f" stroke="#122642" />
      <rect x="20" y="10" width="24" height="34" rx="4" fill="none" stroke="#4a7bb5" strokeWidth="0.6" />
      <path d="M24 12v30" stroke="#c8d8ea" strokeWidth="3" opacity="0.5" />
      <text x="34" y="26" textAnchor="middle" fontSize="6" fill="#c8d8ea" fontFamily="monospace">
        1000
      </text>
      <text x="34" y="34" textAnchor="middle" fontSize="5" fill="#c8d8ea" fontFamily="monospace">
        µF
      </text>
      <path d="M27 44v12M37 44v12" stroke={METAL} strokeWidth="2" strokeLinecap="round" />
      <text x="24" y="20" textAnchor="middle" fontSize="6" fill="#c8d8ea">
        −
      </text>
    </g>
  ),

  switch: () => (
    <g>
      <rect x="18" y="24" width="28" height="20" rx="2" fill={BLACK_PLASTIC} stroke="#1a1d21" />
      <rect x="26" y="14" width="12" height="12" rx="2" fill={METAL} stroke={METAL_DARK} />
      <rect x="29" y="10" width="6" height="8" rx="2" fill="#c3cad2" />
      <path d="M22 44v8M32 44v8M42 44v8" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="34" r="6" fill="none" stroke={RED} strokeWidth="1.6" />
      <path d="M52 30v5" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),

  // ─── Mechanical ──────────────────────────────────────────
  chassis: () => (
    <g>
      <ellipse cx="32" cy="48" rx="24" ry="6" fill="#455a64" stroke="#2c3a41" />
      <rect x="10" y="30" width="44" height="16" rx="3" fill="#546e7a" stroke="#2c3a41" />
      <rect x="16" y="14" width="32" height="18" rx="4" fill="#607d8b" stroke="#2c3a41" />
      <circle cx="25" cy="23" r="4" fill="#0a0c0f" />
      <circle cx="39" cy="23" r="4" fill="#0a0c0f" />
      <circle cx="25" cy="23" r="1.8" fill="#1e88e5" />
      <circle cx="39" cy="23" r="1.8" fill="#1e88e5" />
      <circle cx="12" cy="46" r="7" fill="#2c3036" />
      <circle cx="52" cy="46" r="7" fill="#2c3036" />
      <circle cx="12" cy="46" r="3" fill="#f0c020" />
      <circle cx="52" cy="46" r="3" fill="#f0c020" />
    </g>
  ),

  standoff: () => (
    <g>
      <rect x="20" y="18" width="8" height="28" fill={COPPER} />
      <path d="M20 18h8v28h-8z" fill="none" stroke="#8a5522" strokeWidth="0.6" />
      <path d="M21 22h6M21 26h6M21 30h6M21 34h6M21 38h6M21 42h6" stroke="#8a5522" strokeWidth="0.5" />
      <rect x="18" y="14" width="12" height="4" rx="1" fill={METAL} />
      <rect x="18" y="46" width="12" height="4" rx="1" fill={METAL} />
      <circle cx="44" cy="24" r="6" fill={METAL} stroke={METAL_DARK} />
      <path d="M41 24h6M44 21v6" stroke={METAL_DARK} strokeWidth="1.4" />
      <rect x="42" y="30" width="4" height="16" rx="1" fill={METAL} />
    </g>
  ),

  // ─── Tools ───────────────────────────────────────────────
  breadboard: () => (
    <g>
      <rect x="8" y="14" width="48" height="36" rx="2" fill="#e8e8e4" stroke="#b8b8b2" />
      <rect x="8" y="30" width="48" height="4" fill="#d8d8d2" />
      <path d="M11 18h42M11 46h42" stroke={RED} strokeWidth="0.8" />
      <path d="M11 21h42M11 43h42" stroke="#3a7bd5" strokeWidth="0.8" />
      <g fill="#a8a8a2">
        {Array.from({ length: 13 }, (_, c) =>
          Array.from({ length: 6 }, (_, r) => (
            <rect key={`${c}-${r}`} x={11 + c * 3.4} y={25 + (r > 2 ? 11 : 0) + (r % 3) * 3.2} width="1.6" height="1.6" />
          )),
        )}
      </g>
    </g>
  ),

  solder: () => (
    <g>
      <path d="M14 46l16-16" stroke={BLACK_PLASTIC} strokeWidth="7" strokeLinecap="round" />
      <path d="M28 32l8-8" stroke={METAL_DARK} strokeWidth="4" strokeLinecap="round" />
      <path d="M35 25l7-7" stroke={COPPER} strokeWidth="3" strokeLinecap="round" />
      <path d="M41 19l4-4" stroke="#ffb74d" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="46" cy="14" r="2" fill="#ffca28" opacity="0.9" />
      <path d="M48 10c2-2 4-1 4 1" stroke="#cfd8dc" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M10 50l4 4" stroke={BLACK_PLASTIC} strokeWidth="4" strokeLinecap="round" />
    </g>
  ),

  multimeter: () => (
    <g>
      <rect x="16" y="10" width="32" height="44" rx="3" fill="#e0812a" stroke="#a85e18" />
      <rect x="20" y="15" width="24" height="12" rx="1.5" fill="#1c2b1c" />
      <text x="32" y="24" textAnchor="middle" fontSize="7" fill="#7dff7d" fontFamily="monospace">
        7.42
      </text>
      <circle cx="32" cy="38" r="8" fill="#2b2f36" stroke="#1a1d21" />
      <path d="M32 38v-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="50" r="2.2" fill={RED} />
      <circle cx="40" cy="50" r="2.2" fill={CHIP} />
    </g>
  ),

  tools: () => (
    <g>
      <path d="M14 14l18 18" stroke={METAL_DARK} strokeWidth="4" strokeLinecap="round" />
      <path d="M32 14L14 32" stroke={METAL_DARK} strokeWidth="4" strokeLinecap="round" />
      <path d="M30 32l12 12" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <path d="M16 32l12 12" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <circle cx="23" cy="23" r="2.4" fill={CHIP} />
      <rect x="44" y="16" width="12" height="30" rx="2" fill="#5c6bc0" opacity="0.85" />
      <path d="M46 20h8M46 26h8M46 32h8" stroke="#e8eaf6" strokeWidth="1" />
    </g>
  ),
};

/** Generic per-category fallback so an unknown svgKey still renders. */
const CATEGORY_FALLBACK: Record<MakerComponentCategory, string> = {
  MCU: 'esp32s3',
  AUDIO_IN: 'inmp441',
  AUDIO_OUT: 'speaker',
  DISPLAY: 'gc9a01',
  MOTION: 'motor',
  DRIVER: 'drv8833',
  SENSOR: 'mpu6050',
  POWER: 'cell18650',
  MECHANICAL: 'standoff',
  CONNECTIVITY: 'esp32s3',
  TOOL: 'tools',
  MISC: 'breadboard',
};

export interface PartIconProps {
  svgKey?: string | null;
  category?: MakerComponentCategory;
  /** A real photo, once you have one. Wins over the drawing. */
  imageUrl?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export function PartIcon({
  svgKey,
  category = 'MISC',
  imageUrl,
  alt = '',
  size = 64,
  className = '',
}: PartIconProps) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        loading="lazy"
      />
    );
  }

  const key = (svgKey && ICONS[svgKey] ? svgKey : CATEGORY_FALLBACK[category]) || 'breadboard';
  const Draw = ICONS[key];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={alt || key}
      style={{ color: 'var(--text-secondary)' }}
    >
      <Draw />
    </svg>
  );
}

export const AVAILABLE_PART_ICONS = Object.keys(ICONS);
