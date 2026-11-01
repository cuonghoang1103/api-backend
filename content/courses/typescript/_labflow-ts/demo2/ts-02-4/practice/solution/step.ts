// The booking form sends ?step=… (minutes per grid cell). LabFlow supports 15, 30 and 60.
export const STEPS = [15, 30, 60] as const;   // the ONE list: data and type
export type Step = (typeof STEPS)[number];      // 15 | 30 | 60

const KNOWN: readonly number[] = STEPS;
export function isStep(n: number): n is Step {
  return KNOWN.includes(n);
}

export function parseStep(text: string): Step {
  const n = Number(text);
  if (isStep(n)) return n;
  throw new RangeError('unsupported step: ' + text);
}
