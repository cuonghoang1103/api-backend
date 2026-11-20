// Months count from 0. Days of the month count from 1.
console.log('new Date(2026, 11, 20) → ' + new Date(2026, 11, 20).toDateString());
console.log('new Date(2026, 10, 20) → ' + new Date(2026, 10, 20).toDateString());
console.log('getMonth() of 20 Nov   → ' + new Date(2026, 10, 20).getMonth());
console.log('getDay() of 20 Nov     → ' + new Date(2026, 10, 20).getDay() + '  (day of the WEEK, 0 = Sunday)');
console.log('31 Feb 2026 rolls to   → ' + new Date(2026, 1, 31).toDateString());

// So "does this date exist?" = build it, then check nothing rolled over.
function isRealDate(y, m, d) {            // m is 1–12, like a human writes it
  const x = new Date(y, m - 1, d);
  return x.getFullYear() === y && x.getMonth() === m - 1 && x.getDate() === d;
}
console.log('isRealDate(2026, 2, 31) → ' + isRealDate(2026, 2, 31));
console.log('isRealDate(2028, 2, 29) → ' + isRealDate(2028, 2, 29) + '  (2028 is a leap year)');
