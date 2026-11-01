// demo1/sha256.mjs — lesson 1.4: SHA-256 written out, with ONE extra ability: start from a given digest.
// That ability is exactly what a length-extension attacker has, because a SHA-256 digest IS its internal state.
const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
  0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70,
  0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
const IV = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const rotr = (x, n) => (x >>> n) | (x << (32 - n));

function compress(h, block) { // one 64-byte block
  const w = new Array(64);
  for (let i = 0; i < 16; i++) w[i] = block.readUInt32BE(i * 4);
  for (let i = 16; i < 64; i++) {
    const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
    const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
    w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
  }
  let [a, b, c, d, e, f, g, hh] = h;
  for (let i = 0; i < 64; i++) {
    const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
    const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
    [hh, g, f, e, d, c, b, a] = [g, f, e, (d + t1) | 0, c, b, a, (t1 + t2) | 0];
  }
  return h.map((x, i) => (x + [a, b, c, d, e, f, g, hh][i]) | 0);
}

/** The padding SHA-256 appends to a message of `len` bytes: 0x80, zeros, then the length in bits (64-bit big-endian). */
export function padding(len) {
  const zeros = (55 - len) % 64 < 0 ? (55 - len) % 64 + 64 : (55 - len) % 64;
  const p = Buffer.alloc(1 + zeros + 8);
  p[0] = 0x80;
  p.writeBigUInt64BE(BigInt(len) * 8n, 1 + zeros);
  return p;
}

/** SHA-256 of `data`, optionally continuing from a previous digest that already covered `doneLen` bytes. */
export function sha256(data, from = null, doneLen = 0) {
  let h = from ? Array.from({ length: 8 }, (_, i) => from.readUInt32BE(i * 4) | 0) : IV;
  const msg = Buffer.concat([data, padding(doneLen + data.length)]);
  for (let i = 0; i < msg.length; i += 64) h = compress(h, msg.subarray(i, i + 64));
  const out = Buffer.alloc(32);
  h.forEach((x, i) => out.writeUInt32BE(x >>> 0, i * 4));
  return out;
}
