// The API sends one instant (UTC). Each screen shows it in a time zone.
const fromApi = new Date('2026-11-20T01:30:00Z');
console.log('vi-VN, Asia/Ho_Chi_Minh  → ' + fromApi.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }));
console.log('en-US, America/New_York  → ' + fromApi.toLocaleString('en-US', { timeZone: 'America/New_York' }));

const ddMMyyyy = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh',
});
console.log('dd/MM/yyyy with Intl     → ' + ddMMyyyy.format(fromApi));

const pad = (n) => String(n).padStart(2, '0');
const byHand = (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
console.log('dd/MM/yyyy by hand       → ' + byHand(fromApi) + '  (uses THIS computer\'s zone)');

// <input type="date"> wants yyyy-MM-dd in LOCAL time. 06:00 in Hanoi is still "yesterday" in UTC.
const morning = new Date('2026-11-20T06:00:00+07:00');
console.log('toISOString().slice(0,10) → ' + morning.toISOString().slice(0, 10) + '  ← trap');
const localYmd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
console.log('local yyyy-MM-dd         → ' + localYmd(morning));
