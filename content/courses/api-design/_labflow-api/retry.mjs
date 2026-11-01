// retry.mjs — bài 5.2: fetch có timeout, thử lại lùi dần + jitter, tôn trọng Retry-After
const RETRYABLE = [408, 429, 500, 502, 503, 504];
const SAFE = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];          // idempotent theo định nghĩa (bài 1.2)

export async function fetchWithRetry(url, init = {}, opt = {}) {
  const { retries = 5, baseMs = 200, capMs = 5000, timeoutMs = 2000, jitter = true, log = () => {} } = opt;
  const method = (init.method ?? 'GET').toUpperCase();
  // POST chỉ được thử lại khi có Idempotency-Key (bài 5.1) — không thì có thể làm hai lần
  const mayRetry = SAFE.includes(method) || new Headers(init.headers).has('Idempotency-Key');
  for (let attempt = 1; ; attempt++) {
    const t0 = Date.now();
    let res, err;
    try { res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) }); } catch (e) { err = e; }
    const ra = res?.headers.get('retry-after');
    const again = err || RETRYABLE.includes(res.status) || (res.status === 409 && ra);   // 409 + Retry-After: "đang làm, quay lại sau"
    log(`#${attempt} ${err ? err.name : res.status} sau ${Date.now() - t0} ms${ra ? ` (Retry-After: ${ra})` : ''}`);
    if (!again || !mayRetry || attempt > retries) { if (err) throw err; return res; }
    const exp = Math.min(capMs, baseMs * 2 ** (attempt - 1));    // 200, 400, 800, 1600 … tối đa capMs
    let wait = jitter ? Math.round(Math.random() * exp) : exp;    // "full jitter": ngẫu nhiên trong [0, exp]
    if (ra) wait = Math.max(wait, /^\d+$/.test(ra) ? Number(ra) * 1000 : Date.parse(ra) - Date.now());
    log(`   chờ ${wait} ms`);
    await new Promise((r) => setTimeout(r, wait));
  }
}
