// demo6/email-normalize.mjs — lesson 6.1: normalising an email, and the confusable NFKC cannot fold.
import { normalizeEmail, mixesScripts } from '../src/email/normalize.js';

console.log('normalizeEmail — trim, NFKC, lowercase (store ONE normalised column, UNIQUE):');
for (const raw of ['Nguyen.Van.A@Gmail.COM', '  cuong@cuongthai.com  ', 'cuong+github@cuongthai.com', 'ＣＵＯＮＧ@cuongthai.com', 'a@b@gmail.com']) {
  console.log(`  ${JSON.stringify(raw).padEnd(34)} -> ${JSON.stringify(normalizeEmail(raw))}`);
}
console.log('  (ＣＵＯＮＧ is fullwidth U+FF23… — NFKC folds it to ASCII "cuong"; "a@b@gmail.com" keeps the last @)');

console.log('\nThe confusable NFKC does NOT fold — two "identical"-looking addresses, two different rows:');
const latin = 'admin@cuongthai.com';
const cyr = 'аdmin@cuongthai.com';               // first letter is Cyrillic а (U+0430), not Latin a (U+0061)
console.log(`  latin    "${latin}"  -> ${normalizeEmail(latin)}`);
console.log(`  cyrillic "${cyr}"  -> ${normalizeEmail(cyr)}`);
console.log(`  same normalised string? ${normalizeEmail(latin) === normalizeEmail(cyr)}   first code points: U+${latin.codePointAt(0).toString(16)} vs U+${cyr.codePointAt(0).toString(16)}`);
console.log(`  mixesScripts(latin) = ${JSON.stringify(mixesScripts(latin))}   mixesScripts(cyrillic) = ${JSON.stringify(mixesScripts(cyr))}`);
console.log('  ⇒ the UNIQUE index treats them as different; a mixed-script flag is a separate control (restrict to ASCII, or review).');
