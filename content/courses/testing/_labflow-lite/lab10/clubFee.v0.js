// LabFlow v0 (2020) — price quote for a student club renting a lab for an event.
// No tests. The finance office trusts these numbers; they must not change by accident.
import { PRICES } from './club-prices.js';

export function clubFee(club, lab, date, start, end, seats) {
  var hrs = (parseInt(end.substr(0, 2)) * 60 + parseInt(end.substr(3, 2)) - parseInt(start.substr(0, 2)) * 60 - parseInt(start.substr(3, 2))) / 60;
  var price = hrs * PRICES[lab.substr(0, 2)];
  var today = new Date();
  if (today.getDay() == 0 || today.getDay() == 6) price = price * 1.5; // weekend rate
  if (club.member == true) price = price * 0.8;
  if (seats > 40) price = price + 100000;
  if (hrs >= 4) price = price - 50000;
  if (price < 0) price = 0;
  return Math.round(price / 1000) * 1000;
}
