// A first attempt that looks fine on a laptop in Viet Nam.
export function daysAheadNaive(dateText, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateText) - today) / 86400000);
}
