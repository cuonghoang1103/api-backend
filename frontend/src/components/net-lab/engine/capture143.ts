/**
 * Số liệu THẬT cho mô phỏng Chương 14.3 (tunnel, 14/11/2026) — trích NGUYÊN VĂN từ output lab "Wi-Fi trường trong một hộp" mở rộng
 * (content/courses/networking-for-developers/lab/out/c143-*; bash lab/code/dung-output-ch14b.sh). capture143.test.ts kiểm từng dòng còn
 * nằm trong đúng tệp (chạy lại lab mà chữ đổi — vd "after 0 ms", số luồng — thì test đỏ, sửa ở đây). Thứ mô phỏng tự tính ⇒ nhãn "tính ra".
 */
import type { Q } from './capture14';
const q = (f: string, t: string): Q => [f, t];

export const T_SSH22_TIMEOUT = q('c143-cong', 'ssh: connect to host vps.example port 22: Connection timed out');
export const T_AUTH993 = q('c143-cong', 'Authenticated to vps.example ([198.18.0.30]:993) using "publickey".');
export const T_CFG_PORT22 = q('c143-config', 'port 22');
export const T_CFG_PORT993 = q('c143-config', 'port 993');
export const T_IN993 = q('c143-config', 'vao duoc vps qua cong 993');
export const T_IN22_HOME = q('c143-config-nha', 'vao duoc vps qua cong 22');
export const T_HOME_PORT22 = q('c143-config-nha', 'port 22');
export const T_L_DIRECT = q('c143-L', 'nc: connect to vps.example (198.18.0.30) port 6379 (tcp) timed out: Operation now in progress');
export const T_L_PONG = q('c143-L', 'PONG');
export const T_L_GET = q('c143-L', '8.5 (du lieu tren VPS, chi nghe 127.0.0.1)');
export const T_R_REFUSED = q('c143-R-ban1', 'curl: (7) Failed to connect to vps.example port 8080 after 0 ms: Could not connect to server');
export const T_R_GW = q('c143-R-vps', '$ echo "GatewayPorts clientspecified" > /etc/ssh/sshd_config.d/10-gateway.conf');
export const T_R_DEMO = q('c143-R-ban2', 'Do an nhom 3 - ban demo chay tren laptop o truong');
export const T_D_RESET = q('c143-D', 'curl: (35) Recv failure: Connection reset by peer');
export const T_D_SOCIAL = q('c143-D', 'Internet OK: social.test (ban den tu 198.18.0.30)');
export const T_D_LEAK = q('c143-D', 'curl: (97) Could not resolve proxy: 127.0.0.1');
export const T_D_PHIM = q('c143-D', 'Internet OK: phim.test (ban den tu 198.18.0.30)');
export const T_GW_SNI = q('c143-D-gw', '1 REJECT dpt:443 "social.test"');
export const T_GW_FLOWS = q('c143-D-gw', '      8 dst=198.18.0.30 dport=993');
export const T_KE_REFUSED = q('c143-D-ke', 'curl: (7) Failed to connect to news.test port 80 via 10.20.2.159 after 0 ms: Could not connect to server');
export const T_KE_OK = q('c143-D-ke', 'Internet OK: news.test (ban den tu 198.18.0.30)');

export const ALL143: Q[] = [T_SSH22_TIMEOUT, T_AUTH993, T_CFG_PORT22, T_CFG_PORT993, T_IN993, T_IN22_HOME, T_HOME_PORT22, T_L_DIRECT, T_L_PONG, T_L_GET,
  T_R_REFUSED, T_R_GW, T_R_DEMO, T_D_RESET, T_D_SOCIAL, T_D_LEAK, T_D_PHIM, T_GW_SNI, T_GW_FLOWS, T_KE_REFUSED, T_KE_OK];
