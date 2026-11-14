/**
 * Số liệu THẬT cho hai mô phỏng Chương 14 (wifi + block, 14/11/2026) — trích NGUYÊN VĂN từ output của lab "Wi-Fi trường trong một hộp"
 * (content/courses/networking-for-developers/lab/out/c141-*, c142-*; bash lab/code/dung-output-ch14.sh). capture14.test.ts kiểm từng dòng
 * còn nằm trong đúng tệp output (chạy lại lab mà chữ đổi ⇒ test đỏ ⇒ sửa ở đây). Thứ gì mô phỏng tự tính thì ghi nhãn "tính ra".
 */

/** MAC của các máy trong lab (truong.yml) — phần cứng (bit tự quản = 0) và MAC riêng mỗi SSID (bit tự quản = 1). */
export const MAC14 = {
  macHw: 'a4:83:e7:5c:21:0b', macDk: '26:3a:91:c4:5e:10', macSv: '9a:7f:02:b8:41:6d',
  winHw: '8c:8d:28:4e:7a:12', winDk: '5e:c1:20:7d:93:aa', winSv: 'd2:44:6b:0e:18:f5',
  keHw: 'e8:6a:64:90:12:34', gwDk: '02:00:0a:14:01:01', gwSv: '02:00:0a:14:02:01',
} as const;

/** IP DHCP cấp (dnsmasq chọn theo MAC ⇒ lặp lại được giữa các lần chạy). */
export const IP14 = { macDkPriv: '10.20.1.177', macSvPriv: '10.20.2.127', macDkHw: '10.20.1.114', macSvHw: '10.20.2.114', winDk: '10.20.1.159', winSv: '10.20.2.159', keSv: '10.20.2.144' } as const;

/** [tệp output, dòng nguyên văn] */
export type Q = readonly [string, string];
const q = (f: string, t: string): Q => [f, t];

export const DORA: Q[] = [
  q('c141-dk', 'udhcpc: broadcasting discover'),
  q('c141-dk', 'udhcpc: broadcasting select for 10.20.1.177, server 10.20.1.1'),
  q('c141-dk', 'udhcpc: lease of 10.20.1.177 obtained from 10.20.1.1, lease time 7200'),
];
export const PROBE_302: Q = q('c141-dk', 'HTTP/1.0 302 Found');
export const PROBE_API: Q = q('c141-dk', '{"captive": true, "user-portal-url": "http://portal.truong.test/"}');
export const PROBE_TLS: Q = q('c141-dk', "curl: (60) SSL: no alternative certificate subject name matches target hostname 'captive.apple.com'");
export const HOME_SUCCESS: Q = q('c141-mac', '<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>');
export const LOGIN_PRIV: Q = q('c141-dk', 'OK SE12345: da ghi MAC 26:3a:91:c4:5e:10. Gio hay ket noi SSID TRUONG-SV.');
export const LOGIN_HW: Q = q('c141-tat', 'OK SE12345: da ghi MAC a4:83:e7:5c:21:0b (thay MAC cu 26:3a:91:c4:5e:10 — may do mat mang). Gio hay ket noi SSID TRUONG-SV.');
export const LOGIN_WIN: Q = q('c141-win', 'OK SE12345: da ghi MAC 8c:8d:28:4e:7a:12 (thay MAC cu a4:83:e7:5c:21:0b — may do mat mang). Gio hay ket noi SSID TRUONG-SV.');
export const BLOCK_PRIV: Q = q('c141-sv', 'Thiet bi chua dang ky. MAC 9a:7f:02:b8:41:6d khong co trong danh sach. Vao SSID TRUONG-DANGKY de dang nhap.');
export const BLOCK_MAC_KICKED: Q = q('c141-mat', 'Thiet bi chua dang ky. MAC a4:83:e7:5c:21:0b khong co trong danh sach. Vao SSID TRUONG-DANGKY de dang nhap.');
export const PRIV_HTTPS_TIMEOUT: Q = q('c141-sv', 'curl: (28) Connection timed out after 3002 milliseconds');
export const OK_NEWS: Q = q('c141-tat', 'Internet OK: news.test (ban den tu 198.18.0.1)');
export const CLONE_LEASE: Q = q('c141-trung-ke', 'udhcpc: lease of 10.20.2.159 obtained from 10.20.2.1, lease time 7200');
export const CLONE_RESET: Q = q('c141-trung-win', 'curl: (56) Recv failure: Connection reset by peer');
export const CLONE_PING: Q = q('c141-trung-win', '50 packets transmitted, 50 received, 0% packet loss, time 5100ms');

// ── 14.2 ──
export const B_NXDOMAIN: Q = q('c142-dns', 'curl: (6) Could not resolve host: phim.test');
export const B_BLOCKPAGE: Q = q('c142-dns', 'Trang cado.test bi chan theo quy dinh cua truong.');
export const B_ALT_DNS_OK: Q = q('c142-dns', '198.18.0.10');
export const B_DNS53: Q = q('c142-dns53', ';; communications error to 198.18.0.53#53: timed out');
export const B_SNI_RESET: Q = q('c142-sni', 'curl: (35) Recv failure: Connection reset by peer');
export const B_NEWS_OK: Q = q('c142-sni', 'Internet OK: news.test (ban den tu 198.18.0.1)');
export const B_SOCIAL_HTTP_OK: Q = q('c142-sni', 'Internet OK: social.test (ban den tu 198.18.0.1)');
export const B_SOCIAL_BEFORE: Q = q('c142-truoc', 'Internet OK: social.test (ban den tu 198.18.0.1)');
export const B_PHIM_BEFORE: Q = q('c142-truoc', 'Internet OK: phim.test (ban den tu 198.18.0.1)');
export const B_SNI_SEEN: Q[] = [q('c142-sni-doc', '10.20.2.159\t198.18.0.10\tnews.test'), q('c142-sni-doc', '10.20.2.159\t198.18.0.10\tsocial.test')];
export const B_VPN_TIMEOUT: Q = q('c142-cong', 'nc: connect to vpn.test (198.18.0.20) port 443 (tcp) timed out: Operation now in progress');
export const B_SSH22_TIMEOUT: Q = q('c142-cong', 'nc: connect to 198.18.0.10 port 22 (tcp) timed out: Operation now in progress');
export const B_SSH993: Q = q('c142-cong', 'SSH-2.0-OpenSSH_lab (port 993)');
export const B_SSH22_BEFORE: Q = q('c142-truoc', 'SSH-2.0-OpenSSH_lab');
export const B_GAME_BEFORE: Q = q('c142-truoc', 'game-server: pong');
export const B_VPN_BEFORE: Q = q('c142-truoc', 'vpn: handshake ok');
export const B_GAME_AFTER: Q = q('c142-cong', 'exit=0');
export const B_GAME_HTTPS: Q = q('c142-cong', 'Internet OK: game.test (ban den tu 198.18.0.1)');
export const B_PHONE_OK: Q = q('c142-ttl-phone', 'Internet OK: news.test (ban den tu 198.18.0.1)');
export const B_TTL_PHONE_DEAD: Q = q('c142-ttl-sau-phone', 'curl: (28) Resolving timed out after 3005 milliseconds');
export const B_TTL_WIN_OK: Q = q('c142-ttl-sau-win', 'Internet OK: news.test (ban den tu 198.18.0.1)');

/** Mọi trích dẫn ⇒ để test duyệt. */
export const ALL14: Q[] = [
  ...DORA, PROBE_302, PROBE_API, PROBE_TLS, HOME_SUCCESS, LOGIN_PRIV, LOGIN_HW, LOGIN_WIN, BLOCK_PRIV, BLOCK_MAC_KICKED, PRIV_HTTPS_TIMEOUT, OK_NEWS, CLONE_LEASE, CLONE_RESET, CLONE_PING,
  B_NXDOMAIN, B_BLOCKPAGE, B_ALT_DNS_OK, B_DNS53, B_SNI_RESET, B_NEWS_OK, B_SOCIAL_HTTP_OK, B_SOCIAL_BEFORE, B_PHIM_BEFORE, ...B_SNI_SEEN,
  B_VPN_TIMEOUT, B_SSH22_TIMEOUT, B_SSH993, B_SSH22_BEFORE, B_GAME_BEFORE, B_VPN_BEFORE, B_GAME_AFTER, B_GAME_HTTPS, B_PHONE_OK, B_TTL_PHONE_DEAD, B_TTL_WIN_OK,
];
