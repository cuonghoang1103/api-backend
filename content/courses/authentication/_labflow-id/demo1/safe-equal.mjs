// demo1/safe-equal.mjs — lesson 1.3: safeEqual (src/crypto/compare.js) never throws and never compares secret bytes directly.
import { safeEqual } from '../src/crypto/index.js';
const t = 'lfid_ses_' + 'x'.repeat(43);
console.log('same token          →', safeEqual(t, 'lfid_ses_' + 'x'.repeat(43)));
console.log('last char different →', safeEqual(t, 'lfid_ses_' + 'x'.repeat(42) + 'y'));
console.log('shorter             →', safeEqual(t, 'lfid_ses_x'));
console.log('empty / not a string →', safeEqual(t, ''), safeEqual(t, undefined));
