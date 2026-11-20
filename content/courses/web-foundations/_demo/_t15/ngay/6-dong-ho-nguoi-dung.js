// A coupon checked ONLY in the browser. It expired at the end of 30/11/2026 (Vietnam time).
const EXPIRES = new Date('2026-11-30T23:59:59+07:00');
const canUseCoupon = () => Date.now() <= EXPIRES.getTime();

console.log('now (browser clock): ' + new Date().toISOString());
console.log('canUseCoupon()     → ' + canUseCoupon());

// One line typed into DevTools by the user:
Date.now = () => new Date('2026-11-01T00:00:00Z').getTime();
console.log('after redefining Date.now → ' + canUseCoupon());
