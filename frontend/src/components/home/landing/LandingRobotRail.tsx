/** An articulated SVG mascot. Each joint is animated with compositor-only CSS. */
export default function LandingRobotRail() {
  return (
    <div className="landing-robot-rail" aria-hidden="true">
      <div className="landing-robot-runner">
        <svg
          className="landing-robot-player"
          viewBox="0 0 132 54"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <ellipse className="landing-robot-shadow" cx="56" cy="49" rx="27" ry="3" />

          <g className="landing-robot-character">
            <g className="landing-robot-arm landing-robot-arm-back">
              <path d="M42 31 34 37l-4-3" />
              <rect x="27" y="31" width="5" height="5" rx="1" />
            </g>

            <g className="landing-robot-leg landing-robot-leg-plant">
              <path d="M49 42v6h-8" />
              <rect x="39" y="46" width="10" height="4" rx="1" />
            </g>

            <g className="landing-robot-torso-group">
              <rect className="landing-robot-torso" x="43" y="29" width="25" height="15" rx="3" />
              <rect className="landing-robot-core" x="51" y="33" width="9" height="6" rx="1" />
              <path className="landing-robot-panel-line" d="M47 41h17" />
            </g>

            <g className="landing-robot-head-group">
              <path className="landing-robot-antenna" d="M57 12V7h6V4" />
              <rect className="landing-robot-ear" x="36" y="18" width="6" height="11" rx="1" />
              <rect className="landing-robot-ear" x="69" y="18" width="6" height="11" rx="1" />
              <rect className="landing-robot-head" x="40" y="12" width="33" height="20" rx="4" />
              <path className="landing-robot-highlight" d="M44 15h25v3H47v10h-3V15Z" />
              <rect className="landing-robot-face" x="45" y="18" width="23" height="9" rx="2" />
              <rect className="landing-robot-eye landing-robot-eye-left" x="49" y="20" width="4" height="4" />
              <rect className="landing-robot-eye landing-robot-eye-right" x="60" y="20" width="4" height="4" />
            </g>

            <g className="landing-robot-arm landing-robot-arm-front">
              <path d="M68 32 76 37l4-4" />
              <rect x="78" y="30" width="5" height="5" rx="1" />
            </g>

            <g className="landing-robot-leg landing-robot-leg-kick">
              <path d="M63 42v6h8" />
              <rect x="63" y="46" width="10" height="4" rx="1" />
            </g>
          </g>

          <g className="landing-football">
            <circle className="landing-football-shell" cx="92" cy="43" r="7" />
            <path className="landing-football-seam" d="m92 39 3 2-1 4h-4l-1-4 3-2Zm-3 2-3-1m8 5 3 2m-7-2-2 3m7-7 3-2" />
          </g>

          <g className="landing-football-speed">
            <path d="M103 39h18" />
            <path d="M106 45h12" />
          </g>
        </svg>
      </div>
    </div>
  );
}
