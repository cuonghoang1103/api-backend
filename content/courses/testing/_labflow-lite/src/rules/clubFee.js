// Price quote for a student club renting a lab — refactored from LabFlow v0 in Lab 10, under characterization tests.
// Same results as v0, its bug included: the weekend rate depends on the day the quote is MADE, not on the event
// (issue LF-212 — to be fixed in its own pull request, agreed with the finance office, not hidden in a refactor).
import { PRICES } from '../legacy/club-prices.js';

export const WEEKEND_RATE = 1.5;
export const MEMBER_RATE = 0.8;
export const BIG_EVENT_SEATS = 40;
export const BIG_EVENT_FEE = 100000;
export const LONG_EVENT_HOURS = 4;
export const LONG_EVENT_DISCOUNT = 50000;

const minutesOf = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const isWeekend = (day) => day.getDay() === 0 || day.getDay() === 6;

export function quoteClubFee({ member, lab, start, end, seats, today }) {
  const hours = (minutesOf(end) - minutesOf(start)) / 60;
  let price = hours * PRICES[lab.slice(0, 2)];
  if (isWeekend(today)) price *= WEEKEND_RATE;
  if (member) price *= MEMBER_RATE;
  if (seats > BIG_EVENT_SEATS) price += BIG_EVENT_FEE;
  if (hours >= LONG_EVENT_HOURS) price -= LONG_EVENT_DISCOUNT;
  return Math.round(Math.max(price, 0) / 1000) * 1000;
}
