// LabFlow v0 (2019) — monthly usage report for the faculty office.
// DO NOT CHANGE THE OUTPUT: the office pastes this text into its Excel sheet every month.
// No tests. The person who wrote it has left.
// Lesson 10.2, step 5: three seams added (deps), nothing else changed. Production callers pass no deps.
import { db } from './db.js';

export async function monthlyReport(lab, deps = {}) {
  var d = deps.now ? deps.now() : new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var mm = m < 10 ? '0' + m : '' + m;
  var rows = await (deps.database || db).all('SELECT * FROM bookings');
  var hol = [];
  try {
    var r = await (deps.fetch || fetch)('https://holidays.labflow.example/api/vn/' + y);
    hol = await r.json();
  } catch (e) {
    // no network: no holidays
  }
  var txt = 'LAB ' + lab + ' - ' + y + '/' + mm + '\n';
  var n = 0, mins = 0, big = 0, wk = 0;
  for (var i = 0; i < rows.length; i++) {
    var b = rows[i];
    if (b.lab == lab && b.date.substr(0, 7) == y + '-' + mm && b.status != 'CANCELLED') {
      n++;
      var t = (parseInt(b.end.substr(0, 2)) * 60 + parseInt(b.end.substr(3, 2))) - (parseInt(b.start.substr(0, 2)) * 60 + parseInt(b.start.substr(3, 2)));
      mins = mins + t;
      if (b.seats > 30) big++;
      var day = new Date(b.date).getDay();
      if (day == 0 || day == 6 || hol.indexOf(b.date) != -1) wk++;
      txt += b.date + ' ' + b.start + '-' + b.end + ' ' + b.seats + ' seats' + (b.status == 'PENDING' ? ' (pending)' : '') + '\n';
    }
  }
  if (n == 0) {
    txt += 'No bookings.\n';
  } else {
    txt += 'Bookings: ' + n + '\n';
    txt += 'Hours: ' + Math.round(mins / 60 * 10) / 10 + '\n';
    txt += 'Large (>30 seats): ' + big + '\n';
    txt += 'Weekend/holiday: ' + wk + '\n';
  }
  return txt;
}
