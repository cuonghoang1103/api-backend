// demo1/guess-key-length.mjs — practice 1.4: the attacker does NOT know the key length. Try them all.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { sha256, padding } from './sha256.mjs';

const SECRET = randomBytes(16 + Math.floor(Math.random() * 17)); // 16…32 bytes, unknown to the attacker
const tagNaive = (m) => createHash('sha256').update(Buffer.concat([SECRET, m])).digest();
const accepts = (m, t) => timingSafeEqual(tagNaive(m), t); // the server, used as an oracle

const msg = Buffer.from('user=usr_1&role=STUDENT');
const tag = tagNaive(msg);
const extra = Buffer.from('&role=LAB_MANAGER');
for (let len = 1; len <= 64; len++) {
  const pad = padding(len + msg.length);
  const forged = Buffer.concat([msg, pad, extra]);
  if (accepts(forged, sha256(extra, tag, len + msg.length + pad.length))) {
    console.log(`accepted on try ${len}: key length is ${len} bytes (real: ${SECRET.length})`);
    break;
  }
}
