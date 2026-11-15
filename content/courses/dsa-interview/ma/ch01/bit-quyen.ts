// Bits in real systems: Unix permissions, umask, feature flags, and the CIDR check of src/utils/cidr.ts.

// #region quyen
const R = 0b100, W = 0b010, X = 0b001;                       // read 4, write 2, execute 1
const mode = (u: number, g: number, o: number) => (u << 6) | (g << 3) | o; // owner | group | others
const rwx = (m: number) => [6, 3, 0].map((s) => {
  const t = (m >> s) & 0b111;
  return (t & R ? 'r' : '-') + (t & W ? 'w' : '-') + (t & X ? 'x' : '-');
}).join('');

const m755 = mode(R | W | X, R | X, R | X);
console.log('mode(rwx, r-x, r-x) = 0o' + m755.toString(8), '=', m755.toString(2), '=', rwx(m755));
const umask = 0o022;                                          // the usual default: take write away from group and others
const created = 0o777 & ~umask;                               // what mkdir({ mode: 0o777 }) really gets
console.log('0o777 & ~0o022 = 0o' + created.toString(8), '=', rwx(created));
console.log('group may write?', (m755 & (W << 3)) !== 0, '| owner may execute?', (m755 & (X << 6)) !== 0);
console.log('chmod g+w  ->', rwx(m755 | (W << 3)), '| chmod o-rx ->', rwx(m755 & ~((R | X) << 0)));
// #endregion

// #region co
const DARK_MODE = 1 << 0, BETA_EDITOR = 1 << 1, NEW_CHECKOUT = 1 << 2;
let flags = 0;
flags |= DARK_MODE | NEW_CHECKOUT;          // turn on
const has = (f: number) => (flags & f) !== 0;
console.log('flags =', flags.toString(2).padStart(3, '0'), '| beta?', has(BETA_EDITOR), '| checkout?', has(NEW_CHECKOUT));
flags &= ~NEW_CHECKOUT;                     // turn off
flags ^= BETA_EDITOR;                       // toggle
console.log('flags =', flags.toString(2).padStart(3, '0'), '| beta?', has(BETA_EDITOR), '| checkout?', has(NEW_CHECKOUT));
// #endregion

// #region cidr
function ipv4ToNumber(ip: string): number {                   // same idea as src/utils/cidr.ts
  return ip.split('.').reduce((num, p) => num * 256 + Number(p), 0) >>> 0;
}
const ip = ipv4ToNumber('203.113.10.5');
const bits = 16;
const mask = (~0 << (32 - bits)) >>> 0;                       // 16 ones then 16 zeros
const network = (ipv4ToNumber('203.113.0.0') & mask) >>> 0;
console.log('mask    =', mask.toString(2), '=', mask);
console.log('ip & mask          =', ip & mask, ' === network', network, '?', (ip & mask) === network);
console.log('(ip & mask) >>> 0  =', (ip & mask) >>> 0, ' === network', network, '?', ((ip & mask) >>> 0) === network);
// #endregion
