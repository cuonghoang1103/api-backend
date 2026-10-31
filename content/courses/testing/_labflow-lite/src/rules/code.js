// Short booking codes students can read aloud: no 0/O and no 1/I to confuse.
export const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeBookingCode(random = Math.random, length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return 'LF-' + code;
}

// A tiny seeded random generator (mulberry32): same seed → same sequence, every run.
export function seededRandom(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds the stored booking; id and clock are parameters so tests can control them.
export function newBookingRecord(input, { newId = () => crypto.randomUUID(), now = () => new Date() } = {}) {
  return { id: newId(), code: makeBookingCode(), createdAt: now().toISOString(), ...input };
}
