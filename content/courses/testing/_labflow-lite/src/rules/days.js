// BR-05 needs "days ahead" counted in Viet Nam's calendar (UTC+7), whatever the server's time zone.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAheadVN(dateText, now = new Date()) {
  const todayVN = new Date(now.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
  return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
}
