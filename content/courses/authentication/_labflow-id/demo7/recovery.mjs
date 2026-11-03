// demo7/recovery.mjs — recovery codes: shown once, stored as digests, single-use (lesson 7.3).
import { generateRecoveryCodes, consumeRecoveryCode } from '../src/totp/recovery.js';

const { codes, digests } = generateRecoveryCodes(10);
console.log('Ten codes shown ONCE at enrollment (only their SHA-256 digests are stored):');
console.log('  ' + codes.slice(0, 4).join('  ') + '  …');
console.log(`  stored: ${digests.length} digests, e.g. ${digests[0].slice(0, 24)}… (not the codes themselves)`);

let store = digests;
const used = codes[3];
console.log(`\nUser lost their phone and types one code: ${used}`);
let r = consumeRecoveryCode(used, store); store = r.remaining;
console.log(`  consume → ok=${r.ok}, index=${r.index}; remaining ${store.length}`);
r = consumeRecoveryCode(used, store);
console.log(`  same code again → ok=${r.ok} (single-use: a spent code is gone); remaining ${store.length}`);
r = consumeRecoveryCode('zzzz-zzzz', store);
console.log(`  a wrong code → ok=${r.ok}`);
