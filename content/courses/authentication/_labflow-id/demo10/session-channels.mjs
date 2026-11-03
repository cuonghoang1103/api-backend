// demo10/session-channels.mjs — the four channels a session token is stolen through, and what each reaches (Ch10, 10.3).
// A stolen session cookie IS the session (Chapter 3) — the attacker does not need the password or the second factor.
// We model where a token can live and which channel can read it, then show which cookie flags close each channel.
const channels = [
  { ten: 'XSS (JavaScript in the page)', kw: 'XSS', reads: (store) => store.jsReadable, closedBy: 'HttpOnly (JS cannot read the cookie)' },
  { ten: 'Network sniff (no TLS)', kw: 'Network',        reads: (store) => store.onWire && !store.tls, closedBy: 'Secure + HTTPS everywhere (never sent in clear)' },
  { ten: 'Malware / shared machine', kw: 'Malware',       reads: (store) => store.onDisk, closedBy: 'short TTL + re-auth + device binding (limits the blast radius)' },
  { ten: 'Leaked in a log / URL', kw: 'Log/URL',          reads: (store) => store.inLogsOrUrl, closedBy: 'token in a cookie, never a URL; redact logs (Chapter 1)' },
];

// Three places teams keep a session token, and the properties of each.
const stores = {
  'cookie (JS-readable)':  { jsReadable: true,  onWire: true, tls: true,  onDisk: false, inLogsOrUrl: false },
  'cookie (__Host-, HttpOnly, Secure)': { jsReadable: false, onWire: true, tls: true, onDisk: false, inLogsOrUrl: false },
  'localStorage':          { jsReadable: true,  onWire: true, tls: true,  onDisk: true,  inLogsOrUrl: false },
  'token in the URL':      { jsReadable: true,  onWire: true, tls: true,  onDisk: false, inLogsOrUrl: true },
};

console.log('Which channel can steal the session token, by where you keep it?\n');
const pad = (s, n) => s.padEnd(n);
console.log(pad('store \\ channel', 36) + channels.map((c) => pad(c.kw, 12)).join(''));
for (const [name, store] of Object.entries(stores)) {
  console.log(pad(name, 36) + channels.map((c) => pad(c.reads(store) ? 'STOLEN' : '—', 12)).join(''));
}
console.log('\nWhat closes each channel:');
for (const c of channels) console.log(`  ${pad(c.ten, 34)} ${c.closedBy}`);
console.log('\n⇒ The HttpOnly + Secure + __Host- cookie (Chapter 3) is unreadable by XSS and never sent in clear.');
console.log('  localStorage is the worst place for a session token — any XSS reads it. A token in a URL leaks to logs,');
console.log('  history and the Referer header (Chapter 1). None of these channels needed the password or the 2nd factor.');
