// demo2/hibp.mjs — lesson 2.4: ask Have I Been Pwned whether a password has leaked — sending 5 hex characters only.
import { createHash } from 'node:crypto';
import { pwnedCount } from '../src/passwords/index.js';

const pw = process.argv[2];
const sha1 = createHash('sha1').update(pw).digest('hex').toUpperCase();
const res = await fetch(`https://api.pwnedpasswords.com/range/${sha1.slice(0, 5)}`, { headers: { 'Add-Padding': 'true' } });
const lines = (await res.text()).trim().split('\n');
console.log(`SHA-1 ${sha1.slice(0, 5)}|${sha1.slice(5, 12)}… → sent "${sha1.slice(0, 5)}", got ${lines.length} suffixes (${lines.filter((l) => l.endsWith(':0')).length} padding)`);
console.log(`pwnedCount("${pw}") =`, await pwnedCount(pw));
