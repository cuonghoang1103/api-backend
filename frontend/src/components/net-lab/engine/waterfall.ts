/**
 * waterfall — engine thuần cho mô phỏng `waterfall`: "gõ URL rồi Enter thì chuyện gì xảy ra", thành biểu đồ thác.
 *
 *   • phasesFromCurl: số `curl -w` THẬT là CỘNG DỒN từ lúc bắt đầu (time_namelookup, time_connect, time_appconnect,
 *     time_starttransfer, time_total). Thời lượng của MỘT chặng = mốc của nó − mốc trước. Kết nối dùng lại ⇒ curl báo
 *     connect = 0, appconnect = 0 ⇒ chặng đó dài 0 và mốc trước được giữ nguyên.
 *   • model: mô hình TÍNH RA theo RTT — TCP ≈ 1 RTT, TLS 1.3 ≈ 1 RTT (1.2 ≈ 2), request → byte đầu ≈ 1 RTT + thời gian
 *     máy chủ, DNS chưa cache ≈ 1 RTT tới resolver, tải về theo slow start (initcwnd 10 × 1448 B).
 */
import type { CurlW } from './capture';

export type PhaseId = 'dns' | 'tcp' | 'tls' | 'wait' | 'download';
export const PHASES: PhaseId[] = ['dns', 'tcp', 'tls', 'wait', 'download'];
export const PHASE_COLOR: Record<PhaseId, string> = { dns: '#0891b2', tcp: '#d97706', tls: '#7c3aed', wait: '#16a34a', download: '#2563eb' };
export const CURL_VAR: Record<PhaseId, string> = { dns: 'time_namelookup', tcp: 'time_connect', tls: 'time_appconnect', wait: 'time_starttransfer', download: 'time_total' };

export interface Phase { id: PhaseId; start: number; end: number; dur: number; curlSays: number }
/** giây → các chặng (ms). */
export function phasesFromCurl(w: CurlW): Phase[] {
  const marks = [w.dns, w.connect, w.tls, w.ttfb, w.total];
  const out: Phase[] = [];
  let prev = 0;
  PHASES.forEach((id, k) => {
    const m = marks[k] > 0 ? Math.max(marks[k], prev) : prev;
    out.push({ id, start: ms(prev), end: ms(m), dur: ms(m - prev), curlSays: marks[k] });
    prev = m;
  });
  return out;
}
const ms = (s: number) => Math.round(s * 1e5) / 100;

export interface ModelCfg { rtt: number; resolverRtt: number; dnsCached: boolean; reuse: boolean; tls12: boolean; serverMs: number; pageKB: number }
export const INITCWND = 10, MSS_PAYLOAD = 1448;
/** số vòng slow start để gửi hết `bytes` (cửa sổ nhân đôi mỗi RTT) */
export function slowStartRounds(bytes: number): number {
  let sent = 0, cwnd = INITCWND * MSS_PAYLOAD, r = 0;
  while (sent < bytes) { sent += cwnd; cwnd *= 2; r++; }
  return Math.max(1, r);
}
export function model(c: ModelCfg): Phase[] {
  const dur: Record<PhaseId, number> = {
    dns: c.reuse || c.dnsCached ? 0 : c.resolverRtt,
    tcp: c.reuse ? 0 : c.rtt,
    tls: c.reuse ? 0 : c.rtt * (c.tls12 ? 2 : 1),
    wait: c.rtt + c.serverMs,
    download: (slowStartRounds(c.pageKB * 1024) - 1) * c.rtt,
  };
  let t = 0;
  return PHASES.map((id) => { const p = { id, start: t, end: t + dur[id], dur: dur[id], curlSays: (t + dur[id]) / 1000 }; t += dur[id]; return p; });
}
export const total = (P: Phase[]) => P[P.length - 1].end;
/** phần trăm thời gian là "chờ khoảng cách" (mọi chặng trừ thời gian máy chủ) */
export function distanceShare(P: Phase[], serverMs: number) {
  const T = total(P);
  return T ? Math.round((100 * (T - serverMs)) / T) : 0;
}
