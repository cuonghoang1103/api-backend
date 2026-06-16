/**
 * Tiny CIDR matcher (IPv4). No dependencies, accepts "x.x.x.x/n"
 * strings. Returns false for IPv6 or malformed input (VNPay IPN
 * always comes from IPv4 in their docs).
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
  const parsed = parseCidr(cidr);
  if (!parsed) return false;
  const ipNum = ipv4ToNumber(ip);
  if (ipNum === null) return false;
  // Cast both sides to unsigned 32-bit: in JavaScript, bitwise `&`
  // returns a signed int, so for any IP in the upper half of the
  // range (e.g. 203.x.x.x) a direct `===` would compare
  // -877980672 === 3416986624 = false. We coerce both to unsigned
  // before comparing.
  return (ipNum & parsed.mask) >>> 0 === parsed.network;
}

export function isIpInAnyCidr(ip: string, cidrs: string[]): boolean {
  return cidrs.some(c => isIpInCidr(ip, c));
}

function parseCidr(cidr: string): { network: number; mask: number } | null {
  const [base, bitsStr] = cidr.split('/');
  if (!base || !bitsStr) return null;
  const bits = parseInt(bitsStr, 10);
  if (isNaN(bits) || bits < 0 || bits > 32) return null;
  const baseNum = ipv4ToNumber(base);
  if (baseNum === null) return null;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return { network: (baseNum & mask) >>> 0, mask: mask >>> 0 };
}

function ipv4ToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (const p of parts) {
    const v = parseInt(p, 10);
    if (isNaN(v) || v < 0 || v > 255) return null;
    num = (num * 256) + v;
  }
  return num >>> 0;
}
