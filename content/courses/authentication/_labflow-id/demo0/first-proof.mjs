// demo0/first-proof.mjs — Start here: your first "proof" in a dozen lines.
// The server stamps a value with a key only it knows. Change one character and the stamp no longer fits.
import { createHmac, timingSafeEqual } from 'node:crypto';

const KEY = 'demo-key-only-the-server-knows'; // a real server keeps this out of the code (lesson 1.5)
const stamp = (value) => createHmac('sha256', KEY).update(value).digest('base64url');
const issue = (value) => `${value}.${stamp(value)}`;

function check(card) {
  const i = card.lastIndexOf('.');
  const value = card.slice(0, i);
  const expected = Buffer.from(stamp(value));
  const got = Buffer.from(card.slice(i + 1));
  return expected.length === got.length && timingSafeEqual(expected, got) ? value : null;
}

const card = issue('user=An;role=STUDENT');
console.log('card issued to An  :', card);
console.log('An shows it back   :', check(card));
console.log('An edits the role  :', check(card.replace('STUDENT', 'MANAGER')));
console.log('Binh invents a card:', check('user=Binh;role=MANAGER.' + 'x'.repeat(43)));
