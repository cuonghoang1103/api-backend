/**
 * Số liệu THẬT cho mô phỏng Chương 14.4 (vpn, 14/11/2026) — trích NGUYÊN VĂN từ lab/out/c144-* (bash lab/code/dung-output-ch14b.sh, CHI=144).
 * capture144.test.ts kiểm từng dòng (chạy lại lab mà chữ đổi — số ms, số byte — thì test đỏ, sửa ở đây). Dòng `ip route get` có khoảng trắng
 * CUỐI dòng như output thật (mô phỏng hiện đã cắt).
 */
import type { Q } from './capture14';
const q = (f: string, t: string): Q => [f, t];

export const V_SPLIT_ROUTE = q('c144-tach', '198.18.0.10 via 192.168.1.1 dev eth0 src 192.168.1.20 uid 0 ');
export const V_FULL_ROUTE = q('c144-tach', '198.18.0.10 dev wg0 table 51820 src 10.66.0.2 uid 0 ');
export const V_SEES_ISP = q('c144-tach', 'Internet OK: news.test (ban den tu 198.18.0.40)');
export const V_SEES_VPS = q('c144-tach', 'Internet OK: news.test (ban den tu 198.18.0.30)');
export const V_FW_RULE = q('c144-tach', '[#] ip -4 rule add not fwmark 51820 table 51820');
export const V_HANDSHAKE = q('c144-nha', '  latest handshake: 2 seconds ago');
export const V_WG_SCHOOL = q('c144-truong', '  transfer: 0 B received, 148 B sent');
export const V_UDP_COUNT = q('c144-truong-gw', '2 DROP udp');
export const V_OVPN_TCP = q('c144-ovpn', 'TCP connection established with [AF_INET]198.18.0.30:443');
export const V_OVPN_SOCIAL = q('c144-ovpn', 'Internet OK: social.test (ban den tu 198.18.0.30)');
export const V_RESOLV_SCHOOL = q('c144-ovpn', 'nameserver 10.20.2.1');
export const V_LEAK = q('c144-ovpn-gw', '10.20.2.159\t10.20.2.1\tphim.test');
export const V_GW_ONE = q('c144-ovpn-gw', '      1 dst=198.18.0.30 dport=443');
export const V_DNS_FIX = q('c144-ovpn-dns', '198.18.0.10');
export const V_OVPN_ROUTE = q('c144-ovpn', '0.0.0.0/1 via 10.67.0.1 dev tun0 ');
export const V_KILL_ROUTE = q('c144-kill-win', 'default via 10.20.2.1 dev sv ');
export const V_KILL_LEAK = q('c144-kill-win', 'Internet OK: 198.18.0.10 (ban den tu 198.18.0.1)');
export const V_HOLD_ROUTE = q('c144-kill-lap', '198.18.0.10 dev wg0 table 51820 src 10.66.0.2 uid 0 ');
export const V_HOLD_CURL = q('c144-kill-lap', 'curl: (28) Connection timed out after 5003 milliseconds');

export const ALL144: Q[] = [V_SPLIT_ROUTE, V_FULL_ROUTE, V_SEES_ISP, V_SEES_VPS, V_FW_RULE, V_HANDSHAKE, V_WG_SCHOOL, V_UDP_COUNT, V_OVPN_TCP, V_OVPN_SOCIAL,
  V_RESOLV_SCHOOL, V_LEAK, V_GW_ONE, V_DNS_FIX, V_OVPN_ROUTE, V_KILL_ROUTE, V_KILL_LEAK, V_HOLD_ROUTE, V_HOLD_CURL];
