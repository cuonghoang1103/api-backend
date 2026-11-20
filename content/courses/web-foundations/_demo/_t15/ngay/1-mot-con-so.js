// A Date is ONE number: milliseconds since 1970-01-01 00:00:00 UTC.
const d = new Date(Date.UTC(2026, 10, 20, 1, 30));   // 20 Nov 2026, 01:30 UTC
console.log('getTime():     ' + d.getTime());
console.log('toISOString(): ' + d.toISOString());
console.log('toString():    ' + d.toString());
console.log('back from the number: ' + new Date(d.getTime()).toISOString());
