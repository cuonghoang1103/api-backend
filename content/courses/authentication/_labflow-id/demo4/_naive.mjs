// demo4/_naive.mjs — the WRONG verifier, kept as a teaching foil (lesson 4.2). It does what tutorials and early
// JWT libraries did: it reads the ALGORITHM FROM THE TOKEN and uses one blob of "key material" for whatever the
// token asks for. Every attack in lesson 4.2 is an attack on exactly this habit.
import { createHmac, createPublicKey, verify as nodeVerify, timingSafeEqual } from 'node:crypto';

export function verifyNaive(token, keyMaterial) {
  const [h, p, s] = token.split('.');
  const header = JSON.parse(Buffer.from(h, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
  const input = `${h}.${p}`;
  if (header.alg === 'none') return payload;                       // "unsecured JWT" (RFC 7519 §6) — accepted blindly
  if (header.alg === 'HS256') {                                    // symmetric: the key both signs and verifies
    const want = createHmac('sha256', keyMaterial).update(input).digest();
    const got = Buffer.from(s, 'base64url');
    if (got.length !== want.length || !timingSafeEqual(got, want)) throw new Error('bad signature');
    return payload;
  }
  if (header.alg === 'EdDSA') {                                    // asymmetric: verify with the public key
    const pub = typeof keyMaterial === 'string' ? createPublicKey(keyMaterial) : keyMaterial;
    if (!nodeVerify(null, Buffer.from(input), pub, Buffer.from(s, 'base64url'))) throw new Error('bad signature');
    return payload;
  }
  throw new Error(`unsupported alg ${header.alg}`);
}
