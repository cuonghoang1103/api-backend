'use client';
/**
 * Mascot + bubble, cast automatically from a context.
 *
 * Callers say what HAPPENED, not who should react — pickMascot() owns the
 * casting, so the tone stays consistent across every screen.
 *
 *   <MascotScene context="streak" />
 *   <MascotScene context="levelUp" size={120} />
 *   <MascotScene context="wrong" text="Sai nét thứ 3 rồi!" />
 *
 * For a specific character or a one-off reaction, drop to the pieces:
 *
 *   <Mascot character="bip" emotion="cheer" size={140} />
 */
import { Mascot } from './mascot';
import { MascotBubble } from './MascotBubble';
import { pickMascot, type Context, type Emotion, type MascotId } from '@/lib/mascotData';

export function MascotScene({
  context,
  size = 96,
  seed,
  text,
  className = '',
}: {
  context: Context;
  size?: number;
  /** Change it to make the mascot say something new. */
  seed?: number;
  /** Overrides the dialogue bank. */
  text?: string;
  className?: string;
}) {
  const { mascot, emotion } = pickMascot(context);
  return (
    <MascotRow character={mascot} emotion={emotion} size={size} seed={seed} text={text} className={className} />
  );
}

/** The same layout with the casting decided by the caller. */
export function MascotRow({
  character,
  emotion = 'happy',
  size = 96,
  seed,
  text,
  className = '',
}: {
  character: MascotId;
  emotion?: Emotion;
  size?: number;
  seed?: number;
  text?: string;
  className?: string;
}) {
  return (
    // Stacks on narrow screens: at 320px a 96px mascot plus a bubble leaves the
    // bubble about 8 words wide, which wraps into a column of fragments.
    <div className={`flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:gap-3 ${className}`}>
      <Mascot character={character} emotion={emotion} size={size} />
      <MascotBubble character={character} emotion={emotion} seed={seed} text={text} className="mb-1" />
    </div>
  );
}
