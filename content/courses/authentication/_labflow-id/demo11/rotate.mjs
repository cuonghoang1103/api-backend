// demo11/rotate.mjs — rotate a signing key without logging everyone out (Chapter 11, 11.2).
import { rotate, canVerify, signingKid } from '../src/ops/rotation.js';

// A token already in the wild, minted under the OLD key k1 (its header says kid: k1).
const tokenInTheWild = { kid: 'k1' };
let ring = { active: 'k1', live: ['k1'] };
const show = (label) => console.log(`  ${label.padEnd(34)} sign with ${signingKid(ring)} · old k1 still verifies? ${canVerify(ring, 'k1')}`);

console.log("Rotating the signing key k1 → k2, with an overlap:\n");
show('start (only k1)');
ring = rotate(ring, 'introduce', 'k2'); show('introduce k2 (JWKS now lists both)');
ring = rotate(ring, 'activate', 'k2');  show('activate k2 (new tokens use k2)');
console.log(`    ↳ the in-the-wild token (kid ${tokenInTheWild.kid}) still verifies: ${canVerify(ring, tokenInTheWild.kid)}  ← nobody logged out`);
ring = rotate(ring, 'retire');          show('retire k1 (after its tokens expired)');
console.log(`    ↳ the in-the-wild token (kid ${tokenInTheWild.kid}) now verifies: ${canVerify(ring, tokenInTheWild.kid)}  ← only expired ones remain`);

console.log('\n⇒ Keep BOTH keys live during the overlap: sign with the new one, still VERIFY the old one, and retire the');
console.log('  old key only after every token it signed has expired. Rotate without a mass logout, and without a gap.');
