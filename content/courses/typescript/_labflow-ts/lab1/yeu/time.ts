// Lab 1 — a WEAK first attempt: every red line silenced with "any". It compiles and the tests pass. Graded in the lab lesson.
// Convert between "HH:MM" and minutes since 00:00.
export function parseTime(text: any): any {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes: any): any {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
