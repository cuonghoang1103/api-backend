// LabFlow v0 entry point, kept for its callers (Lab 10). The logic now lives in src/rules/clubFee.js.
import { quoteClubFee } from '../rules/clubFee.js';

export function clubFee(club, lab, date, start, end, seats) {
  // v0 compared with == true: only true (or 1) is a member — keep that, do not "simplify" to !!club.member
  return quoteClubFee({ member: club.member == true, lab, start, end, seats, today: new Date() });
}
