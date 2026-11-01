// Explicit any: you told tsc to stop checking — it obeys.
export function minutesLabel2(minutes: any) {
  return minutes + ' min';
}
minutesLabel2({ start: '08:00' });   // nonsense, and no error
