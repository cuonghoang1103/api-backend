/**
 * Đợt 6 — DÂY BẪY R2 cho mọi lượt test (`node --import ./scripts/r2-tripwire.mjs …`).
 *
 * Chặn ở tầng thấp nhất — `net.Socket.prototype.connect` (mọi HTTP/HTTPS/fetch/undici/AWS SDK đều đi qua) —
 * mọi kết nối tới endpoint R2 THẬT (`*.r2.cloudflarestorage.com` + host của R2_ENDPOINT_URL trong .env):
 *   1. ghi một dòng JSON vào tệp `R2_TRIPWIRE_LOG` (nếu đặt) — `scripts/test-work-db.mjs` đọc lại sau cả bộ;
 *   2. huỷ kết nối bằng lỗi rõ ràng (request không bao giờ rời máy).
 * Kho giả (config/storageSandbox.ts) không mở socket nào nên bình thường tệp log trống.
 */
import net from 'node:net';
import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';

const hosts = new Set();
const re = /(^|\.)r2\.cloudflarestorage\.com$/i;
function addHost(url) {
  try { if (url) hosts.add(new URL(url).hostname.toLowerCase()); } catch { /* bỏ qua */ }
}
addHost(process.env.R2_ENDPOINT_URL);
try {
  const env = readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  addHost(/^R2_ENDPOINT_URL\s*=\s*"?([^"\n]+)"?/m.exec(env)?.[1]);
} catch { /* không có .env (CI) */ }

export function isRealR2Host(h) {
  const host = String(h || '').toLowerCase().replace(/^\[|\]$/g, '');
  return !!host && (re.test(host) || hosts.has(host));
}

const orig = net.Socket.prototype.connect;
net.Socket.prototype.connect = function patchedConnect(...args) {
  let opts = args[0];
  if (Array.isArray(opts)) opts = opts[0];
  const host = typeof opts === 'object' && opts ? (opts.servername || opts.host) : typeof args[1] === 'string' ? args[1] : null;
  if (isRealR2Host(host)) {
    const hit = { at: new Date().toISOString(), host, pid: process.pid, argv: process.argv.slice(1).join(' ').slice(0, 300) };
    if (process.env.R2_TRIPWIRE_LOG) {
      try { appendFileSync(process.env.R2_TRIPWIRE_LOG, `${JSON.stringify(hit)}\n`); } catch { /* vẫn chặn */ }
    }
    process.stderr.write(`\n[r2-tripwire] CHẶN kết nối tới R2 thật: ${host}\n`);
    const err = new Error(`[r2-tripwire] Blocked a connection to the real R2 endpoint ${host} during tests`);
    process.nextTick(() => this.destroy(err));
    return this;
  }
  return orig.apply(this, args);
};
