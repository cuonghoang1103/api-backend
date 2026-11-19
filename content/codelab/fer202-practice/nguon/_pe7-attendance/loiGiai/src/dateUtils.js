// Today's date as "YYYY-MM-DD" in the LOCAL time zone (the value format of <input type="date">).
// Do NOT use new Date().toISOString().slice(0, 10): that is UTC, so in Vietnam (UTC+7)
// it still returns YESTERDAY between 00:00 and 06:59.
export function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
