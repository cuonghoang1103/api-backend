/**
 * Coordinated omission — vòng kín vs vòng mở (bài 15.6, đợt mô phỏng #4). Mô hình máy chủ của lab/code/ch15/stall.js:
 * trả lời mất `serviceMs`, nhưng cứ mỗi `periodMs` lại "đứng hình" `stallMs` (vòng lặp bận chặn event loop). Một luồng
 * xử lý (Node), hàng FIFO.
 *   • vòng KÍN (hey, wrk, tai.js --closed): mỗi kết nối gửi → chờ trả lời → gửi tiếp. Lúc máy chủ đứng hình, khách cũng
 *     NGỪNG GỬI ⇒ chỉ đúng một yêu cầu/kết nối "thấy" cú đứng 200 ms, hàng chục nghìn yêu cầu nhanh che lấp nó;
 *   • vòng MỞ (tai.js --rate, k6 constant-arrival-rate): yêu cầu rời đúng lịch k/rate; thiếu kết nối rảnh thì phải chờ.
 *     Đo "từ lúc DỰ ĐỊNH" mới thấy thật; đo "từ lúc gửi thật" với 1 kết nối lại giấu mất;
 *   • "sửa kiểu wrk" (HdrHistogram recordValueWithExpectedInterval): mẫu L > khoảng kỳ vọng I ⇒ chèn L−I, L−2I, …
 * Mô hình chạy THẬT từng yêu cầu (tất định, không ngẫu nhiên) — số đo thật của lab (c156) hiển thị riêng để đối chiếu.
 */
export interface CoCfg { mode: 'closed' | 'open'; rate: number; conns: number; stallMs: number; periodMs: number; serviceMs: number; durationMs: number }
export interface CoReq { intended: number; sent: number; done: number; conn: number }
export interface Pcts { n: number; p50: number; p95: number; p99: number; max: number }
export interface CoRun { reqs: CoReq[]; stalls: Array<[number, number]>; fromIntended: Pcts; fromSent: Pcts; corrected: Pcts | null; rps: number }

/** Máy chủ stall.js: setInterval(stall, period) ⇒ đứng hình [k·period, k·period + stall) với k = 1, 2, … */
// serviceMs: tai.js --closed 1 xong 59 031 yêu cầu trong 8 s, trong đó 7 × 200 ms đứng hình ⇒ 6 600 ms / 59 031 ≈ 0,112 ms
export const LAB_SERVER = { stallMs: 200, periodMs: 1000, serviceMs: 0.112 };

function stallsUpTo(end: number, period: number, stall: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  if (stall <= 0) return out;
  for (let t = period; t < end + period; t += period) out.push([t, t + stall]);
  return out;
}

/** Máy chủ một luồng: bắt đầu xử lý lúc max(tới, rảnh); rơi vào cú đứng hình thì đợi hết cú đó. */
function serverFinish(arrive: number, freeAt: number, svc: number, stalls: Array<[number, number]>) {
  let start = Math.max(arrive, freeAt);
  for (const [a, b] of stalls) { if (start >= a && start < b) start = b; if (start < a) break; }
  return start + svc;
}

export function pct(xs: number[]): Pcts {
  if (!xs.length) return { n: 0, p50: 0, p95: 0, p99: 0, max: 0 };
  const s = [...xs].sort((a, b) => a - b);
  const at = (p: number) => s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
  return { n: s.length, p50: at(50), p95: at(95), p99: at(99), max: s[s.length - 1] };
}

/** wrk / HdrHistogram: mỗi mẫu L > I kéo theo các mẫu L − I, L − 2I, … > 0 (các yêu cầu lẽ ra đã được gửi). */
export function correct(lat: number[], interval: number): number[] {
  const out: number[] = [];
  for (const L of lat) { out.push(L); if (interval > 0) for (let x = L - interval; x > interval; x -= interval) out.push(x); }
  return out;
}

export function runCo(c: CoCfg): CoRun {
  const stalls = stallsUpTo(c.durationMs + 400, c.periodMs, c.stallMs);
  const reqs: CoReq[] = [];
  let free = 0; // máy chủ rảnh lúc
  if (c.mode === 'closed') {
    // C kết nối, mỗi cái luôn có đúng một yêu cầu đang bay; xử lý theo thứ tự tới (sự kiện rời rạc)
    const next = Array.from({ length: Math.max(1, c.conns) }, (_, k) => k * 1e-6);
    for (let guard = 0; guard < 3_000_000; guard++) {
      let k = 0;
      for (let j = 1; j < next.length; j++) if (next[j] < next[k]) k = j;
      const sent = next[k];
      if (sent >= c.durationMs) break;
      const done = serverFinish(sent, free, c.serviceMs, stalls);
      free = done;
      reqs.push({ intended: sent, sent, done, conn: k });
      next[k] = done;
    }
  } else {
    const n = Math.floor((c.durationMs * c.rate) / 1000);
    const connFree = Array.from({ length: Math.max(1, c.conns) }, () => 0);
    for (let i = 0; i < n; i++) {
      const intended = (i * 1000) / c.rate;
      let k = 0;
      for (let j = 1; j < connFree.length; j++) if (connFree[j] < connFree[k]) k = j;
      const sent = Math.max(intended, connFree[k]);
      const done = serverFinish(sent, free, c.serviceMs, stalls);
      free = done;
      connFree[k] = done;
      reqs.push({ intended, sent, done, conn: k });
    }
  }
  const li = reqs.map((r) => r.done - r.intended), ls = reqs.map((r) => r.done - r.sent);
  const meanGap = c.mode === 'closed' ? (c.durationMs * Math.max(1, c.conns)) / Math.max(1, reqs.length) : 1000 / c.rate;
  return {
    reqs, stalls, fromIntended: pct(li), fromSent: pct(ls),
    corrected: c.mode === 'closed' ? pct(correct(ls, meanGap)) : null,
    rps: (reqs.length * 1000) / c.durationMs,
  };
}

/** Phần trăm vị trên các yêu cầu đã XONG tới thời điểm t (bảng "sống" khi tua). */
export function pctUntil(run: CoRun, t: number) {
  const done = run.reqs.filter((r) => r.done <= t);
  return { fromIntended: pct(done.map((r) => r.done - r.intended)), fromSent: pct(done.map((r) => r.done - r.sent)) };
}

/** Số đo thật c156 (ms). */
export const C156 = {
  hey: { label: 'hey -z 8s -c 1 (closed)', rps: 8389, p50: 0.1, p95: 0.1, p99: 0.1, max: null as number | null },
  closed: { label: 'tai.js --closed 1', rps: 7379, p50: 0.1, p95: 0.1, p99: 0.2, max: 200.2 },
  open1Intended: { label: 'tai.js --rate 100 --conns 1 (from intended)', p50: 1.3, p95: 150.0, p99: 189.3, max: 199.1 },
  open1Sent: { label: 'tai.js --rate 100 --conns 1 (from actual send)', p50: 0.2, p95: 0.9, p99: 6.4, max: 198.6 },
  openIntended: { label: 'tai.js --rate 100 (from intended)', p50: 1.3, p95: 150.9, p99: 190.8, max: 200.8 },
  openSent: { label: 'tai.js --rate 100 (from actual send)', p50: 0.3, p95: 150.1, p99: 190.0, max: 199.8 },
  wrk: { label: 'wrk -c1 (corrected)', rps: 15355, p50: 0.056, p99: 187.31 },
  k6: { label: 'k6 constant-arrival-rate 100/s', p50: 0.43275, p95: 149.95, p99: 189.15, max: 199.67 },
};
