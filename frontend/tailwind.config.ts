import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  // Support multiple theme classes: 'dark', 'light'
  // Use :is() to apply theme styles conditionally
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        darkbg: "#18191a",
        darkcard: "#242526",
        darksurface: "#303031",
        darkborder: "#3e4042",
        // Light theme colors (Facebook-like)
        lightbg: "#f0f2f5",
        lightcard: "#ffffff",
        lightsurface: "#f0f2f5",
        lightborder: "#dddfe2",
  neon: {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  cyan: "#22d3ee",
  green: "#4ade80",
  emerald: "#10b981",
  blue: "#3b82f6",
  orange: "#fb923c",
  red: "#f43f5e",
  pink: "#ec4899",
  },
  // Accent colors
  accent: {
    DEFAULT: "#1877f2",
    hover: "#166fe5",
    light: "#4599ff",
  },
  // Studio palette (Content Creator area) — warm amber
  // distinct from the violet used by /projects. Each step
  // mirrors Tailwind's amber scale so `bg-studio-500/30`
  // etc. Just Work. The 50/950 extremes are slightly
  // nudged for legibility on a dark surface.
  studio: {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
  950: "#451a03",
  },
  text: {
           primary: "#050505",
           secondary: "#65676b",
           muted: "#8a8d91",
         },
       },
  backgroundImage: {
 "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
 "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
 "neon-gradient": "linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)",
 "neon-gradient-hover": "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
 // Studio = warm amber. Used on the studio topbar and
 // status pills so the editor feels visually distinct
 // from the violet /projects editor.
 "studio-gradient": "linear-gradient(135deg, #f59e0b, #fbbf24, #fde68a)",
 "studio-gradient-soft": "linear-gradient(135deg, rgba(245,158,11,0.85), rgba(251,191,36,0.65))",
 },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
 animation: {
 "fade-in": "fadeIn 0.3s ease-out",
 "slide-up": "slideUp 0.4s ease-out",
 "slide-down": "slideDown 0.3s ease-out",
 float: "float 3s ease-in-out infinite",
 glow: "glow 2s ease-in-out infinite alternate",
 "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
 "aurora-drift-slow": "auroraDrift1 44s ease-in-out infinite",
 "aurora-drift-slower": "auroraDrift2 56s ease-in-out infinite",
 "shimmer-sweep": "shimmerSweep 1.6s linear infinite",
 "caret-blink": "caretBlink 1.1s steps(2, jump-none) infinite",
 "scroll-cue-pulse": "scrollCuePulse 2.4s ease-in-out infinite",
 // Studio-only motion (Content Creator area). Reel-spin
 // runs on the loading/empty-state reel icon; projector
 // fades amber in/out for a slow ambient pulse.
 "reel-spin": "reelSpin 6s linear infinite",
 "projector-pulse": "projectorPulse 4s ease-in-out infinite",
 },
 keyframes: {
 fadeIn: {
 "0%": { opacity: "0" },
 "100%": { opacity: "1" },
 },
 slideUp: {
 "0%": { transform: "translateY(20px)", opacity: "0" },
 "100%": { transform: "translateY(0)", opacity: "1" },
 },
 slideDown: {
 "0%": { transform: "translateY(-10px)", opacity: "0" },
 "100%": { transform: "translateY(0)", opacity: "1" },
 },
 float: {
 "0%, 100%": { transform: "translateY(0)" },
 "50%": { transform: "translateY(-10px)" },
 },
 glow: {
 "0%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
 "100%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
 },
 // Two large aurora blobs drifting on slow loops. Pure
 // transform-only animation so it stays GPU-friendly and
 // never causes layout thrash. The blobs are positioned
 // by the wrapper div; the keyframes only move them.
 auroraDrift1: {
 "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
 "33%": { transform: "translate3d(8%, -4%, 0) scale(1.08)" },
 "66%": { transform: "translate3d(-6%, 6%, 0) scale(0.95)" },
 },
 auroraDrift2: {
 "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
 "40%": { transform: "translate3d(-10%, 5%, 0) scale(1.05)" },
 "75%": { transform: "translate3d(7%, -3%, 0) scale(0.92)" },
 },
 // Skeleton shimmer: a 1.6s left→right linear sweep.
 // Wrapped over a card with overflow:hidden, the gradient
 // travels across and the card looks like it's loading.
 shimmerSweep: {
 "0%": { transform: "translateX(-100%)" },
 "100%": { transform: "translateX(100%)" },
 },
 // Terminal-style caret blink for the hero rotating tagline.
 caretBlink: {
 "0%, 100%": { opacity: "1" },
 "50%": { opacity: "0" },
  },
 // Vertical scroll cue at the bottom of the hero.
 scrollCuePulse: {
 "0%, 100%": { opacity: "0.35", transform: "scaleY(0.7)" },
 "50%": { opacity: "1", transform: "scaleY(1)" },
 },
 // Reel-spin: a 6s linear rotation used for the
 // loading/empty-state reel-of-film icon on the studio.
 reelSpin: {
 "0%": { transform: "rotate(0deg)" },
 "100%": { transform: "rotate(360deg)" },
 },
 // Projector pulse: a slow opacity + scale lift on amber
 // glow backgrounds. Pairs with the .projector class to
 // give the page a "lights on in the studio" feel.
 projectorPulse: {
 "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
 "50%": { opacity: "1", transform: "scale(1.04)" },
 },
 },
 // 3D-tilt card primitives — the card surface gets
 // perspective so the rotateX/Y actually feels like a
 // 3D surface, not a flat 2D skew.
 perspective: {
 '1000': '1000px',
 '1200': '1200px',
 '1500': '1500px',
 },
 boxShadow: {
 neon: "0 0 20px rgba(139, 92, 246, 0.3)",
 "neon-lg": "0 0 40px rgba(139, 92, 246, 0.4)",
 "neon-cyan": "0 0 20px rgba(34, 211, 238, 0.3)",
 // Premium card — base resting state. Soft layered shadow
 // so the card looks like it's floating just above the
 // surface even when not hovered.
 "premium-card":
 "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
 // Premium card — hover. Bigger lift + violet glow ring.
 "premium-card-hover":
 "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px rgba(0,0,0,0.55), 0 0 50px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.25)",
 // Studio card resting state — amber glow instead of
 // violet. Same shadow shape so cards line up under
 // both editors.
 "studio-card":
 "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
 "studio-card-hover":
 "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px rgba(0,0,0,0.55), 0 0 50px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.28)",
 },
 },
 },
 plugins: [],
};
export default config;
