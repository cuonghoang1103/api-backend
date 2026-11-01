// src/passwords/pwned.js — lesson 2.4: has this password appeared in a breach? HIBP Pwned Passwords, k-anonymity:
// only the first 5 hex characters of its SHA-1 leave the server. ⇒ a count (0 = not seen), or null when we could not ask.
import { createHash } from 'node:crypto';

export async function pwnedCount(password, { base = 'https://api.pwnedpasswords.com', timeoutMs = 1500 } = {}) {
  const sha1 = createHash('sha1').update(password.normalize('NFC')).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5), suffix = sha1.slice(5);
  try {
    const res = await fetch(`${base}/range/${prefix}`, {
      headers: { 'Add-Padding': 'true', 'User-Agent': 'labflow-id-course' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    for (const line of (await res.text()).split('\n')) {
      const [s, n] = line.trim().split(':');
      if (s === suffix) return Number(n);   // padding lines have count 0
    }
    return 0;
  } catch {
    return null;                            // fail OPEN: the service being down must not block sign-ups (say so in logs)
  }
}
