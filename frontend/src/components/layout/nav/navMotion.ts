/**
 * Motion for the nav surfaces (03/11/2026) — the "iOS feel" the old ☰ drawer
 * had (its PANEL_SPRING was stiffness 380 / damping 36 / mass 0.95), shared by
 * the mega panel, the mobile sheet, the account menu and ⌘K.
 *
 * Rules, learnt on the old NavigationDock:
 *   - only `transform` and `opacity` animate. Backdrops are a plain dim with no
 *     `backdrop-filter`: animating a blur was the jank users reported on
 *     30/07/2026, and even a FIXED blur over the animated hero/season canvas
 *     cost ~70 fps per open when measured on 03/11/2026 (see nav.module.css);
 *   - never scale a surface that itself carries `backdrop-filter` — every panel
 *     scaled here has a solid background;
 *   - exits are short fixed tweens with `pointerEvents: 'none'` applied at once,
 *     so a stalled exit can never leave an invisible sheet that eats clicks;
 *   - `prefers-reduced-motion` ⇒ a plain fade, no movement, no stagger.
 */
import type { Transition } from 'framer-motion';

/** Open: a soft spring with a hint of overshoot, like an iOS popover. */
export const SPRING_OPEN: Transition = { type: 'spring', stiffness: 420, damping: 30, mass: 0.85 };
/** Larger surfaces (the full-height mobile sheet) — a touch heavier. */
export const SPRING_SHEET: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.95 };
/** iOS-like ease for short tweens (fades, exits). */
export const EASE_IOS = [0.32, 0.72, 0, 1] as const;
export const EXIT = { duration: 0.18, ease: EASE_IOS };
export const FADE = { duration: 0.16 };

/** Delay for the i-th item when a surface's content cascades in. */
export const stagger = (i: number, base = 0.05, step = 0.022, max = 0.32): number => Math.min(base + i * step, max);
