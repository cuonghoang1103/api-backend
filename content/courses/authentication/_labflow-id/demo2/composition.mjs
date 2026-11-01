// demo2/composition.mjs — lesson 2.4: do the classic rules ("8+, upper, lower, digit, symbol") keep common passwords out?
import { WORDS } from './population.mjs';

const classic = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
const pass = WORDS.filter(classic);
console.log(`top-10k passwords that pass the classic rules: ${pass.length} → ${pass.slice(0, 6).join(', ')}`);
console.log(`top-10k passwords with 15+ characters: ${WORDS.filter((w) => [...w].length >= 15).length}`);
// What people do when forced: capitalise the first letter, add "1!" at the end.
const forced = WORDS.slice(0, 1000).map((w) => w[0].toUpperCase() + w.slice(1) + '1!').filter(classic);
console.log(`top-1000 "Capitalised + 1!": ${forced.length} now pass, e.g. ${forced.slice(0, 4).join(', ')}`);
