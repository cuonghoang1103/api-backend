/**
 * Sáu cư dân robot/sinh vật của làng agent — vẽ tay bằng SVG, cùng "chất đất sét" với gấu trúc CuongMini
 * (vỏ trắng ngà đổ bóng tròn, kính mặt tối, mắt phát sáng màu vai, má hồng). Thiết kế RIÊNG, không mô phỏng
 * linh vật/logo của hãng nào.
 *
 * Gradient dùng chung khai một lần trong <WorldDefs/> (id cố định `aw-*`, cả trang chỉ có một làng).
 * Các bộ phận có class `aw-*` để agentWorld.css cho chớp mắt, vẫy tay, xoay cánh quạt… — mọi chuyển động
 * chỉ là transform/opacity.
 */
import type { AgentKind } from './agents';
import { CuongMiniPandaClay as CuongMiniPanda } from '@/components/chat/claude/CuongMiniPandaClay';
import { BUDDY } from './pixel';

const SHELL = 'url(#aw-shell)';
const VISOR = 'url(#aw-visor)';
const BLUSH = 'url(#aw-blush)';
const INK = '#2a2640';

export function WorldDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <defs>
        <radialGradient id="aw-shell" cx="36%" cy="28%" r="82%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f2f0f9" />
          <stop offset="82%" stopColor="#d8d4ea" />
          <stop offset="100%" stopColor="#b6afd2" />
        </radialGradient>
        <radialGradient id="aw-visor" cx="38%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#433c5e" />
          <stop offset="65%" stopColor="#1d1929" />
          <stop offset="100%" stopColor="#100d18" />
        </radialGradient>
        <radialGradient id="aw-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8fb8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff8fb8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aw-slime" cx="36%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#d7fbe9" />
          <stop offset="45%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#139a73" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Highlight({ d }: { d: string }) {
  return <path d={d} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />;
}

function Feet({ y = 68, gap = 7 }: { y?: number; gap?: number }) {
  return (
    <g className="aw-feet">
      <ellipse className="aw-foot aw-foot-l" cx={32 - gap} cy={y} rx="6" ry="3.4" fill={INK} />
      <ellipse className="aw-foot aw-foot-r" cx={32 + gap} cy={y} rx="6" ry="3.4" fill={INK} />
    </g>
  );
}

/** Coder — đầu màn hình, mắt chữ nhật, "miệng" là con trỏ nhấp nháy, ôm laptop. */
function Coder({ a }: { a: string }) {
  return (
    <>
      <Feet />
      <rect x="20" y="44" width="24" height="21" rx="9" fill={SHELL} />
      <circle className="aw-glow" cx="32" cy="54.5" r="3" fill={a} />
      <g className="aw-arm aw-arm-wave" style={{ transformOrigin: '21px 49px' }}>
        <rect x="11" y="46" width="11" height="6.5" rx="3.2" fill={SHELL} />
      </g>
      <g className="aw-arm-hold">
        <rect x="42" y="47" width="9" height="6.5" rx="3.2" fill={SHELL} />
        <rect x="45" y="49.5" width="14" height="10" rx="1.8" fill={INK} />
        <rect className="aw-screen" x="46.6" y="51" width="10.8" height="6.4" rx="0.8" fill={a} opacity="0.85" />
        <rect x="43.5" y="59.5" width="17" height="2" rx="1" fill="#6b6585" />
      </g>
      <g className="aw-antenna" style={{ transformOrigin: '32px 11px' }}>
        <line x1="32" y1="11" x2="32" y2="3.5" stroke="#b6afd2" strokeWidth="2.2" strokeLinecap="round" />
        <circle className="aw-glow" cx="32" cy="3.5" r="3.2" fill={a} />
      </g>
      <rect x="8" y="10" width="48" height="36" rx="13" fill={SHELL} />
      <Highlight d="M15 17 Q18.5 12.5 27 12.2" />
      <circle cx="8" cy="28" r="3.2" fill={a} />
      <circle cx="56" cy="28" r="3.2" fill={a} />
      <rect x="13" y="16" width="38" height="24" rx="9" fill={VISOR} />
      <g className="aw-eyes">
        <rect x="20.5" y="22.5" width="6.5" height="9.5" rx="3.2" fill={a} />
        <rect x="37" y="22.5" width="6.5" height="9.5" rx="3.2" fill={a} />
        <circle cx="25" cy="24.6" r="1.2" fill="#ffffff" opacity="0.8" />
        <circle cx="41.5" cy="24.6" r="1.2" fill="#ffffff" opacity="0.8" />
      </g>
      <rect className="aw-cursor" x="29" y="34.5" width="6" height="2" rx="1" fill={a} />
      <ellipse cx="17" cy="42.5" rx="4" ry="2.2" fill={BLUSH} />
      <ellipse cx="47" cy="42.5" rx="4" ry="2.2" fill={BLUSH} />
    </>
  );
}

/** Tutor — đầu tròn đội mũ tốt nghiệp có tua rua, kẹp một cuốn sách. */
function Tutor({ a }: { a: string }) {
  return (
    <>
      <Feet />
      <ellipse cx="32" cy="56" rx="13" ry="11" fill={SHELL} />
      <g className="aw-arm aw-arm-wave" style={{ transformOrigin: '22px 53px' }}>
        <ellipse cx="17.5" cy="52.5" rx="5" ry="3.8" fill={SHELL} />
      </g>
      <g className="aw-arm-hold">
        <rect x="39.5" y="49" width="14" height="11" rx="1.6" fill="#e76f51" />
        <rect x="41" y="50.4" width="11" height="8.2" rx="0.6" fill="#fff4dc" />
        <line x1="46.5" y1="50.4" x2="46.5" y2="58.6" stroke="#e76f51" strokeWidth="1" />
        <ellipse cx="44" cy="55" rx="4.6" ry="3.6" fill={SHELL} />
      </g>
      <circle cx="32" cy="31" r="19.5" fill={SHELL} />
      <Highlight d="M19 21 Q24 14.5 32 14" />
      <ellipse cx="32" cy="33" rx="14.5" ry="10.5" fill={VISOR} />
      <g className="aw-eyes">
        <circle cx="26" cy="32" r="3.4" fill={a} />
        <circle cx="38" cy="32" r="3.4" fill={a} />
        <circle cx="27.2" cy="30.8" r="1.1" fill="#ffffff" />
        <circle cx="39.2" cy="30.8" r="1.1" fill="#ffffff" />
      </g>
      <path d="M29 38 Q32 40.4 35 38" stroke={a} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="17" cy="40" rx="4" ry="2.3" fill={BLUSH} />
      <ellipse cx="47" cy="40" rx="4" ry="2.3" fill={BLUSH} />
      {/* Mũ tốt nghiệp */}
      <path d="M21 15.5 Q32 11.5 43 15.5 L43 19 Q32 15.5 21 19 Z" fill={INK} />
      <polygon points="32,5 55,11.5 32,18 9,11.5" fill="#35304d" />
      <polygon points="32,5 55,11.5 32,12.6 9,11.5" fill="#463f63" />
      <g className="aw-tassel" style={{ transformOrigin: '32px 11.5px' }}>
        <path d="M32 11.5 L49 13.6 L49 21" stroke={a} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="47.4" y="20" width="3.2" height="5" rx="1.4" fill={a} />
      </g>
      <circle cx="32" cy="11.5" r="1.6" fill={a} />
    </>
  );
}

/** Researcher — cú-máy bay lơ lửng: một mắt ống kính lớn, hai cánh quạt trên đầu, tai nhọn. */
function Researcher({ a }: { a: string }) {
  return (
    <>
      <g className="aw-prop">
        <rect x="29" y="5" width="6" height="7" rx="2" fill="#b6afd2" />
        <ellipse className="aw-blade" cx="32" cy="4.6" rx="15" ry="2.1" fill="#d6defa" opacity="0.85" />
      </g>
      <path d="M15 22 L11.5 9.5 L23.5 16 Z" fill={SHELL} />
      <path d="M49 22 L52.5 9.5 L40.5 16 Z" fill={SHELL} />
      <path d="M15.6 18.5 L13.8 12.4 L19.6 15.4 Z" fill={a} opacity="0.55" />
      <path d="M48.4 18.5 L50.2 12.4 L44.4 15.4 Z" fill={a} opacity="0.55" />
      <g className="aw-wing aw-wing-l" style={{ transformOrigin: '13px 36px' }}>
        <ellipse cx="10.5" cy="42" rx="4.6" ry="9" fill={SHELL} />
      </g>
      <g className="aw-wing aw-wing-r" style={{ transformOrigin: '51px 36px' }}>
        <ellipse cx="53.5" cy="42" rx="4.6" ry="9" fill={SHELL} />
      </g>
      <ellipse cx="32" cy="38" rx="22" ry="24" fill={SHELL} />
      <Highlight d="M17 27 Q21 18 30 15.5" />
      <circle cx="32" cy="33" r="13.5" fill={VISOR} />
      <circle cx="32" cy="33" r="13.5" fill="none" stroke={a} strokeWidth="2.6" />
      <g className="aw-eyes">
        <circle className="aw-iris" cx="32" cy="33" r="6.2" fill={a} />
        <circle cx="32" cy="33" r="2.6" fill="#0d0a14" />
        <circle cx="35.2" cy="29.8" r="2.3" fill="#ffffff" />
      </g>
      <rect x="25.5" y="51" width="13" height="4.6" rx="2.3" fill={a} opacity="0.55" />
      <ellipse cx="17.5" cy="47" rx="4" ry="2.3" fill={BLUSH} />
      <ellipse cx="46.5" cy="47" rx="4" ry="2.3" fill={BLUSH} />
    </>
  );
}

/** Reviewer — thân viên nhộng, đeo kính tròn, nơ cổ, cầm bảng kẹp có dấu tích. */
function Reviewer({ a }: { a: string }) {
  return (
    <>
      <Feet gap={6.5} />
      <g className="aw-antenna" style={{ transformOrigin: '32px 9px' }}>
        <line x1="32" y1="9" x2="32" y2="3.5" stroke="#b6afd2" strokeWidth="2.2" strokeLinecap="round" />
        <circle className="aw-glow" cx="32" cy="3.4" r="2.8" fill={a} />
      </g>
      <g className="aw-arm aw-arm-wave" style={{ transformOrigin: '16px 48px' }}>
        <ellipse cx="11.5" cy="49" rx="5" ry="3.6" fill={SHELL} />
      </g>
      <rect x="14" y="8" width="36" height="58" rx="18" fill={SHELL} />
      <Highlight d="M20 20 Q22 13 30 11.2" />
      <rect x="18" y="17" width="28" height="18" rx="9" fill={VISOR} />
      <g className="aw-eyes">
        <circle cx="26" cy="26" r="3" fill={a} />
        <circle cx="38" cy="26" r="3" fill={a} />
      </g>
      <circle cx="26" cy="26" r="5.6" fill="none" stroke="#e9e6f5" strokeWidth="1.4" opacity="0.9" />
      <circle cx="38" cy="26" r="5.6" fill="none" stroke="#e9e6f5" strokeWidth="1.4" opacity="0.9" />
      <line x1="31.6" y1="26" x2="32.4" y2="26" stroke="#e9e6f5" strokeWidth="1.4" />
      <path d="M28.5 40 Q32 43 35.5 40" stroke={INK} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <ellipse cx="20" cy="40" rx="3.6" ry="2.2" fill={BLUSH} />
      <ellipse cx="44" cy="40" rx="3.6" ry="2.2" fill={BLUSH} />
      <path d="M25 46 L31 49 L25 52 Z" fill={a} />
      <path d="M39 46 L33 49 L39 52 Z" fill={a} />
      <circle cx="32" cy="49" r="2.2" fill={a} />
      <g className="aw-arm-hold aw-clip">
        <rect x="42" y="45" width="15" height="18" rx="2" fill="#c08457" />
        <rect x="44" y="48" width="11" height="13" rx="0.6" fill="#ffffff" />
        <rect x="46.5" y="43.6" width="6" height="3" rx="1" fill="#6b6585" />
        <path className="aw-check" d="M46.5 54.6 l2.6 2.6 l4.6 -5.2" stroke={a} strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="45" cy="57" rx="4.4" ry="3.4" fill={SHELL} />
      </g>
    </>
  );
}

/** Translator — bé "thạch" xanh bạc hà trong veo, mầm lá trên đầu; chữ A/あ/文 bay quanh (lớp HTML). */
function Translator() {
  return (
    <>
      <path d="M33 15 Q33 9 38 6.5 Q38 12 33 15 Z" fill="#34d399" />
      <path d="M32 15 Q31 10 26.5 8.6 Q27.5 13 32 15 Z" fill="#6ee7b7" />
      <path d="M8 66 C6 42 16 16 32 16 C48 16 58 42 56 66 Q32 71 8 66 Z" fill="url(#aw-slime)" opacity="0.96" />
      <ellipse cx="21" cy="30" rx="4.5" ry="7" fill="#ffffff" opacity="0.55" transform="rotate(24 21 30)" />
      <circle cx="18" cy="42" r="1.8" fill="#ffffff" opacity="0.6" />
      <g className="aw-eyes">
        <ellipse cx="25.5" cy="44" rx="4.2" ry="5.2" fill="#0d2a22" />
        <ellipse cx="38.5" cy="44" rx="4.2" ry="5.2" fill="#0d2a22" />
        <circle cx="27" cy="42" r="1.6" fill="#ffffff" />
        <circle cx="40" cy="42" r="1.6" fill="#ffffff" />
      </g>
      <path d="M28.5 52 Q30.2 54 32 52 Q33.8 54 35.5 52" stroke="#0d2a22" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <ellipse cx="17.5" cy="51" rx="4.2" ry="2.4" fill={BLUSH} />
      <ellipse cx="46.5" cy="51" rx="4.2" ry="2.4" fill={BLUSH} />
    </>
  );
}

/** Builder — robot bánh xích, đội mũ bảo hộ, giơ một thẻ việc (sticky note) như bảng Kanban. */
function Builder({ a }: { a: string }) {
  return (
    <>
      <rect x="11" y="57" width="42" height="12" rx="6" fill={INK} />
      <rect className="aw-tread" x="12.5" y="58.5" width="39" height="9" rx="4.5" fill="none" stroke="#6b6585" strokeWidth="1.4" strokeDasharray="2.4 2.6" />
      {[19, 27, 37, 45].map((cx) => (
        <circle key={cx} cx={cx} cy="63" r="2.6" fill="#8a84a6" />
      ))}
      <rect x="16" y="40" width="32" height="19" rx="6" fill={SHELL} />
      <rect x="21" y="45" width="5" height="5" rx="1.2" fill="#fbbf24" />
      <rect x="29.5" y="45" width="5" height="5" rx="1.2" fill="#60a5fa" />
      <rect x="38" y="45" width="5" height="5" rx="1.2" fill="#34d399" />
      <g className="aw-arm aw-arm-wave" style={{ transformOrigin: '17px 46px' }}>
        <rect x="8" y="43" width="10" height="6.5" rx="3.2" fill={SHELL} />
      </g>
      <g className="aw-card" style={{ transformOrigin: '50px 44px' }}>
        <rect x="47.5" y="27" width="6" height="18" rx="3" fill={SHELL} />
        <rect x="45" y="14" width="16" height="14" rx="1.6" fill="#fde68a" />
        <rect x="47.5" y="17.5" width="10" height="1.6" rx="0.8" fill="#b45309" opacity="0.6" />
        <rect x="47.5" y="21" width="7" height="1.6" rx="0.8" fill="#b45309" opacity="0.6" />
        <circle cx="53" cy="15.2" r="1.3" fill={a} />
      </g>
      <rect x="13" y="15" width="36" height="27" rx="10" fill={SHELL} />
      <rect x="17" y="21" width="28" height="15" rx="7" fill={VISOR} />
      <g className="aw-eyes">
        <rect x="22.5" y="25" width="5" height="7" rx="2.5" fill={a} />
        <rect x="34.5" y="25" width="5" height="7" rx="2.5" fill={a} />
      </g>
      <ellipse cx="17.5" cy="38.5" rx="3.4" ry="2" fill={BLUSH} />
      <ellipse cx="44.5" cy="38.5" rx="3.4" ry="2" fill={BLUSH} />
      {/* Mũ bảo hộ */}
      <path d="M13.5 19 Q13.5 6.5 31 6.5 Q48.5 6.5 48.5 19 Z" fill="#fbbf24" />
      <path d="M17 13 Q19 8.5 27 8" stroke="#fff3c4" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="29.5" y="6.5" width="3" height="12.5" fill="#f59e0b" />
      <rect x="9.5" y="17.5" width="43" height="4" rx="2" fill="#f59e0b" />
    </>
  );
}

/* Dòng code trên màn hình laptop của Code Buddy: [thụt lề, độ dài, màu] — lặp hai lần để cuộn liền mạch. */
const CODE_LINES: [number, number, string][] = [
  [0, 5, '#c4b5fd'],
  [1, 4, '#5eead4'],
  [1, 6, '#fde68a'],
  [2, 3, '#f9a8d4'],
  [1, 5, '#5eead4'],
  [0, 2, '#c4b5fd'],
  [0, 6, '#fde68a'],
  [1, 3, '#f9a8d4'],
];

/**
 * Code Buddy — pixel-art thật (khác các robot "đất sét"), ngồi một chỗ bên đống lửa. Hai khung tay gõ phím
 * đổi nhau bằng steps(); code cuộn trong màn hình (clipPath); con trỏ nhấp nháy. Bong bóng "✓ pass" do
 * AgentScene bật định kỳ qua lớp lời chào.
 */
function BuddySprite() {
  return (
    <svg className="aw-sprite aw-buddy" viewBox="0 -1 26 18" shapeRendering="crispEdges" preserveAspectRatio="xMidYMax meet" aria-hidden focusable="false">
      <defs>
        <clipPath id="aw-bud-screen">
          <rect x="17" y="7" width="8" height="6" />
        </clipPath>
      </defs>
      <rect className="aw-bud-shine" x="15" y="5" width="11" height="9" fill="#9ae6ff" opacity="0.12" />
      {BUDDY.layers.map(({ layer, d }) => (
        <path key={layer} d={d} className={`aw-c-${layer}${layer === 'bud-eye' || layer === 'bud-glint' ? ' aw-bud-blink' : ''}`} />
      ))}
      <g clipPath="url(#aw-bud-screen)">
        <g className="aw-bud-code">
          {[...CODE_LINES, ...CODE_LINES].map(([indent, len, c], i) => (
            <rect key={i} x={17.5 + indent} y={7.25 + i * 0.75} width={len * 0.75} height="0.5" fill={c} />
          ))}
        </g>
      </g>
      <rect className="aw-cursor" x="23.4" y="12" width="0.8" height="0.6" fill="#ffffff" />
      {/* Hai khung tay: một tay chạm phím trong khi tay kia nhấc lên */}
      <g className="aw-bud-hand aw-bud-hand-a">
        <path d="M12 12h3v1h-3z M15 13h1v1h-1z" className="aw-c-bud-a" />
      </g>
      <g className="aw-bud-hand aw-bud-hand-b">
        <path d="M12 12h2v1h-2z M14 13h2v1h-2z" className="aw-c-bud-a" />
      </g>
    </svg>
  );
}

export function AgentSprite({ kind, accent }: { kind: AgentKind; accent: string }) {
  if (kind === 'panda') {
    return (
      <span className="aw-panda">
        <CuongMiniPanda size={120} state="still" className="aw-panda-svg" />
        {/* Đèn lồng tím CuongMini cầm — điểm sáng ấm giữa làng */}
        <svg className="aw-lantern" viewBox="0 0 20 28" aria-hidden>
          <line x1="10" y1="0" x2="10" y2="5" stroke="#b6afd2" strokeWidth="1.4" />
          <rect x="5" y="4.5" width="10" height="2.6" rx="1.2" fill="#463f63" />
          <rect x="3.5" y="7" width="13" height="15" rx="5" fill="#8b6cff" />
          <rect className="aw-lantern-core" x="6" y="9.5" width="8" height="10" rx="3.4" fill="#ffe8a8" />
          <rect x="5" y="21.5" width="10" height="2.6" rx="1.2" fill="#463f63" />
          <line x1="10" y1="24" x2="10" y2="27.5" stroke="#8b6cff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (kind === 'buddy') return <BuddySprite />;
  const body =
    kind === 'coder' ? <Coder a={accent} />
    : kind === 'tutor' ? <Tutor a={accent} />
    : kind === 'researcher' ? <Researcher a={accent} />
    : kind === 'reviewer' ? <Reviewer a={accent} />
    : kind === 'translator' ? <Translator />
    : <Builder a={accent} />;
  return (
    <svg className={`aw-sprite aw-sprite-${kind}`} viewBox="0 0 64 72" aria-hidden focusable="false">
      {body}
    </svg>
  );
}
