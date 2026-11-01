// demo2/unicode.mjs — lesson 2.3: the same password, typed with two Vietnamese keyboard settings, is two byte strings.
// Unikey/EVKey "Unicode dựng sẵn" = precomposed (NFC); "Unicode tổ hợp" = base letter + combining mark (NFD).
import argon2 from 'argon2';
import { PARAMS, normalize } from '../src/passwords/index.js';

const precomposed = 'Bình-thích-hoa-sen-2026'.normalize('NFC');   // "ì" = U+00EC
const decomposed = 'Bình-thích-hoa-sen-2026'.normalize('NFD');    // "ì" = "i" + U+0300
console.log('look the same:', precomposed, '|', decomposed);
console.log('equal strings:', precomposed === decomposed, '· bytes', Buffer.byteLength(precomposed), 'vs', Buffer.byteLength(decomposed));
const raw = await argon2.hash(precomposed, PARAMS);
console.log('no normalisation  → verify the "tổ hợp" typing:', await argon2.verify(raw, decomposed));
const good = await argon2.hash(normalize(precomposed), PARAMS);
console.log('NFC on both sides → verify the "tổ hợp" typing:', await argon2.verify(good, normalize(decomposed)));
