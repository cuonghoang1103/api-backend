// The booking form sends ?step=… (minutes per grid cell). LabFlow supports 15, 30 and 60.
type Step = 15 | 30 | 60;
const STEPS = [15, 30, 60];                 // copied by hand: a plain number[]

export function parseStep(text: string): Step {
  const n = Number(text);
  if (STEPS.includes(n)) return n;
  throw new RangeError('unsupported step: ' + text);
}
