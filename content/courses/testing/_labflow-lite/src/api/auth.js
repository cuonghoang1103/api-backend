// Sign and verify access tokens (JWT, HS256) with jose. The clock is a parameter, so tests can expire a token.
import { SignJWT, jwtVerify } from 'jose';

export function createAuth({ secret, now = () => new Date() }) {
  const key = new TextEncoder().encode(secret);
  return {
    async sign({ id, role }, ttlSeconds = 3600) {
      const iat = Math.floor(now().getTime() / 1000);
      return new SignJWT({ role })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(id))
        .setIssuedAt(iat)
        .setExpirationTime(iat + ttlSeconds)
        .sign(key);
    },
    async verify(token) {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'], currentDate: now() });
      return { id: payload.sub, role: payload.role };
    },
  };
}
