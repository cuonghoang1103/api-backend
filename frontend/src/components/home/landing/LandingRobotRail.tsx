/** A hand-built pixel mascot perched on the frame edge. No canvas or runtime. */
export default function LandingRobotRail() {
  return (
    <div className="landing-robot-rail" aria-hidden="true">
      <div className="landing-robot-runner">
        <svg
          className="landing-robot-player"
          viewBox="0 0 112 44"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <ellipse className="landing-robot-shadow" cx="53" cy="39" rx="39" ry="2.5" />

          <g className="landing-robot-body">
            <path className="landing-robot-antenna" d="M39 7V3h5V1" />
            <rect className="landing-robot-ear" x="18" y="13" width="5" height="10" />
            <rect className="landing-robot-ear" x="55" y="13" width="5" height="10" />
            <rect className="landing-robot-head" x="22" y="7" width="34" height="22" rx="3" />
            <path className="landing-robot-highlight" d="M25 10h27v3H28v11h-3V10Z" />
            <rect className="landing-robot-face" x="27" y="13" width="24" height="10" rx="2" />
            <rect className="landing-robot-eye" x="31" y="16" width="4" height="4" />
            <rect className="landing-robot-eye" x="43" y="16" width="4" height="4" />
            <rect className="landing-robot-torso" x="28" y="28" width="22" height="9" rx="1" />
            <rect className="landing-robot-core" x="36" y="30" width="6" height="4" />
            <path className="landing-robot-limb" d="M28 30h-7v5M50 30h7v4M33 37v3h-7M45 37v3h8" />
          </g>

          <g className="landing-football">
            <circle className="landing-football-shell" cx="79" cy="33" r="7" />
            <path className="landing-football-seam" d="m79 29 3 2-1 4h-4l-1-4 3-2Zm-3 2-3-1m8 5 3 2m-7-2-2 3m7-7 3-2" />
          </g>

          <path className="landing-robot-speed" d="M4 19h10M1 25h13M8 31h8" />
          <path className="landing-football-speed" d="M91 29h15M94 35h12" />
        </svg>
      </div>
    </div>
  );
}
