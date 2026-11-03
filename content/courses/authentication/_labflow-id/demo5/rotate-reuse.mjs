// demo5/rotate-reuse.mjs — lesson 5.2: rotation, and the reuse that gives the thief away.
// Every /refresh rotates the token: the old one is marked used, a new one is minted in the same family. If a token that
// has ALREADY been rotated is presented again, it is either the legitimate user's lost race (5.5) or a thief using a
// copy — and the safe assumption is theft: revoke the whole family.
import { refreshLayer, memoryStore } from '../src/refresh/index.js';

const store = memoryStore();
let t = Date.UTC(2026, 10, 3, 9, 0, 0);
const refresh = refreshLayer({ store, now: () => t, graceMs: 10e3 });

const dump = () => [...store.rows.values()].filter((r) => r.userId === 'usr_1').map((r, i) =>
  `  #${i + 1} ${r.id.slice(0, 9)}… fam ${r.familyId.slice(0, 7)}… used=${r.usedAt ? 'yes' : 'no '} revoked=${r.revokedAt ? 'YES' : 'no '}`);

const a = await refresh.issue('usr_1', { ua: 'laptop' });
console.log('An signs in → refresh token r0, family', a.row.familyId.slice(0, 11) + '…');
t += 60e3; const r1 = await refresh.rotate(a.token);
t += 60e3; const r2 = await refresh.rotate(r1.token);
console.log('she refreshes twice (r0→r1→r2); the family so far:');
console.log(dump().join('\n'));

console.log('\na thief copied r0 earlier and now replays it (long after it was rotated):');
t += 3600e3;
const reuse = await refresh.rotate(a.token);
console.log('  rotate(r0) →', reuse.error, '· family', reuse.familyId.slice(0, 11) + '… revoked');

console.log('\nthe family after reuse detection — every token revoked, including the live r2:');
console.log(dump().join('\n'));
console.log('\nso An’s next real refresh also fails (she must sign in again):');
console.log('  rotate(r2) →', (await refresh.rotate(r2.token)).error);
console.log('\nThe cost: the real user is signed out too. That is the point — a reuse means one of the two copies is a');
console.log('thief, and you cannot tell which, so you end the family and make everyone re-authenticate.');
