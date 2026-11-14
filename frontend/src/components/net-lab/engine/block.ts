/**
 * "Mạng trường chặn gì" (14.2): một request đi qua năm trạm kiểm soát — MAC · DNS · SNI · IP/cổng/UDP · TTL — với các luật bật/tắt.
 * Luật và kết quả khớp đúng lab "Wi-Fi trường trong một hộp" (capture14.ts; test capture14.test.ts). Dòng output thật lấy từ capture14;
 * trường hợp lab không đo ⇒ real = false (nhãn "tính ra").
 */
import * as K from './capture14';

export type RuleId = 'dns' | 'dns53' | 'sni' | 'ip' | 'ports' | 'udp' | 'ttl';
export type Stage = 'mac' | 'dns' | 'sni' | 'port' | 'ttl';
export type ReqId = 'phim' | 'phimAlt' | 'news' | 'social' | 'socialHttp' | 'vpn' | 'ssh22' | 'ssh993' | 'game' | 'phone';

export const RULES: Array<{ id: RuleId; en: string; vi: string; cmd: string }> = [
  { id: 'dns', en: 'DNS filter (phim.test ⇒ NXDOMAIN)', vi: 'Lọc DNS (phim.test ⇒ NXDOMAIN)', cmd: 'address=/phim.test/' },
  { id: 'dns53', en: 'Drop DNS to outside servers', vi: 'Chặn DNS ra máy chủ ngoài', cmd: '-p udp --dport 53 -j DROP' },
  { id: 'sni', en: 'SNI filter "social.test"', vi: 'Lọc SNI "social.test"', cmd: '--dport 443 -m string --string "social.test" -j REJECT --reject-with tcp-reset' },
  { id: 'ip', en: 'Blacklist the VPN IP', vi: 'Danh sách đen IP VPN', cmd: '-d 198.18.0.20 -j DROP' },
  { id: 'ports', en: 'Only TCP 80/443/587/993', vi: 'Chỉ mở TCP 80/443/587/993', cmd: '-p tcp -m multiport ! --dports 80,443,587,993 -j DROP' },
  { id: 'udp', en: 'Drop all UDP', vi: 'Bỏ mọi UDP', cmd: '-p udp -j DROP' },
  { id: 'ttl', en: 'Drop TTL 63/127 (hotspot)', vi: 'Bỏ TTL 63/127 (điểm phát)', cmd: '-t mangle PREROUTING -m ttl --ttl-eq 63 -j DROP' },
];

export interface Req { id: ReqId; cmd: string; en: string; vi: string; from: 'laptop' | 'phone'; proto: 'tcp' | 'udp'; port: number; ip: string; name?: string }
export const REQS: Req[] = [
  { id: 'phim', cmd: 'curl http://phim.test/', en: 'a film site', vi: 'trang phim', from: 'laptop', proto: 'tcp', port: 80, ip: '198.18.0.10', name: 'phim.test' },
  { id: 'phimAlt', cmd: 'dig @198.18.0.53 phim.test', en: 'the same name, asked to another DNS', vi: 'cùng tên, hỏi DNS khác', from: 'laptop', proto: 'udp', port: 53, ip: '198.18.0.53' },
  { id: 'news', cmd: 'curl https://news.test/', en: 'a news site over HTTPS', vi: 'trang tin qua HTTPS', from: 'laptop', proto: 'tcp', port: 443, ip: '198.18.0.10', name: 'news.test' },
  { id: 'social', cmd: 'curl https://social.test/', en: 'a social site over HTTPS (same IP)', vi: 'mạng xã hội qua HTTPS (cùng IP)', from: 'laptop', proto: 'tcp', port: 443, ip: '198.18.0.10', name: 'social.test' },
  { id: 'socialHttp', cmd: 'curl http://social.test/', en: 'the social site over plain HTTP', vi: 'mạng xã hội qua HTTP thường', from: 'laptop', proto: 'tcp', port: 80, ip: '198.18.0.10', name: 'social.test' },
  { id: 'vpn', cmd: 'nc -vz -w 3 vpn.test 443', en: 'a VPN server', vi: 'máy chủ VPN', from: 'laptop', proto: 'tcp', port: 443, ip: '198.18.0.20', name: 'vpn.test' },
  { id: 'ssh22', cmd: 'nc -w 3 198.18.0.10 22', en: 'SSH on port 22', vi: 'SSH ở cổng 22', from: 'laptop', proto: 'tcp', port: 22, ip: '198.18.0.10' },
  { id: 'ssh993', cmd: 'nc -w 3 198.18.0.10 993', en: 'SSH on port 993', vi: 'SSH ở cổng 993', from: 'laptop', proto: 'tcp', port: 993, ip: '198.18.0.10' },
  { id: 'game', cmd: 'echo ping | nc -u -w 2 game.test 27015', en: 'a phone game (UDP 27015)', vi: 'game điện thoại (UDP 27015)', from: 'laptop', proto: 'udp', port: 27015, ip: '198.18.0.10', name: 'game.test' },
  { id: 'phone', cmd: 'curl http://news.test/   # on the phone, via the laptop hotspot', en: 'the phone through the laptop hotspot', vi: 'điện thoại qua điểm phát của laptop', from: 'phone', proto: 'tcp', port: 80, ip: '198.18.0.10', name: 'news.test' },
];

export const STAGES: Array<{ id: Stage; icon: string; en: string; vi: string }> = [
  { id: 'mac', icon: '🛂', en: 'MAC registered?', vi: 'MAC đã đăng ký?' },
  { id: 'dns', icon: '📒', en: 'DNS', vi: 'DNS' },
  { id: 'sni', icon: '✉️', en: 'SNI', vi: 'SNI' },
  { id: 'port', icon: '🚪', en: 'IP / port / UDP', vi: 'IP / cổng / UDP' },
  { id: 'ttl', icon: '🔢', en: 'TTL', vi: 'TTL' },
];

export interface Verdict { ok: boolean; stop?: Stage; rule?: RuleId; line: string; real: boolean; feel: 'ok' | 'nxdomain' | 'reset' | 'timeout' | 'silence'; en: string; vi: string; ttl: number }

/** Kết quả của một request với một bộ luật. */
export function blockEval(id: ReqId, rules: Partial<Record<RuleId, boolean>>): Verdict {
  const r = REQS.find((x) => x.id === id)!;
  const ttl = r.from === 'phone' ? 63 : 64;
  const stop = (stage: Stage, rule: RuleId, q: K.Q, feel: Verdict['feel'], en: string, vi: string): Verdict => ({ ok: false, stop: stage, rule, line: q[1], real: true, feel, en, vi, ttl });
  // TTL được xét lúc gói VỪA TỚI (PREROUTING) — trước mọi luật khác; DNS của chính điện thoại cũng chết
  if (rules.ttl && ttl === 63) return stop('ttl', 'ttl', K.B_TTL_PHONE_DEAD, 'timeout', 'Every packet with TTL 63 is dropped on arrival — even the phone\'s DNS question. The laptop (TTL 64) is untouched.', 'Mọi gói TTL 63 bị bỏ ngay lúc tới — kể cả câu hỏi DNS của điện thoại. Laptop (TTL 64) không sao.');
  if (r.id === 'phim' && rules.dns) return stop('dns', 'dns', K.B_NXDOMAIN, 'nxdomain', 'The school DNS says the name does not exist (NXDOMAIN). Nothing was ever sent to the site.', 'DNS của trường nói tên này không tồn tại (NXDOMAIN). Chưa có gói nào tới trang.');
  if (r.proto === 'udp' && r.port === 53 && (rules.dns53 || rules.udp)) return stop('port', rules.dns53 ? 'dns53' : 'udp', K.B_DNS53, 'timeout', 'DNS to an outside server is dropped: the question just times out.', 'DNS ra máy chủ ngoài bị bỏ: câu hỏi chỉ treo tới hết giờ.');
  if (r.id === 'social' && rules.sni) return stop('sni', 'sni', K.B_SNI_RESET, 'reset', 'The firewall read "social.test" in the TLS ClientHello and cut the connection with a TCP reset — instantly. news.test on the same IP still works.', 'Tường lửa đọc thấy "social.test" trong ClientHello của TLS và cắt kết nối bằng TCP reset — ngay lập tức. news.test cùng IP vẫn chạy.');
  if (r.ip === '198.18.0.20' && rules.ip) return stop('port', 'ip', K.B_VPN_TIMEOUT, 'timeout', 'The VPN server\'s IP is blacklisted: packets vanish, the client waits until its timeout (3 s here).', 'IP máy chủ VPN nằm trong danh sách đen: gói biến mất, máy khách chờ tới hết giờ (ở đây 3 giây).');
  if (r.proto === 'tcp' && rules.ports && ![80, 443, 587, 993].includes(r.port)) return stop('port', 'ports', K.B_SSH22_TIMEOUT, 'timeout', 'Only TCP 80/443/587/993 are open: port 22 is dropped, the connection times out.', 'Chỉ mở TCP 80/443/587/993: cổng 22 bị bỏ, kết nối treo tới hết giờ.');
  if (r.proto === 'udp' && rules.udp) return stop('port', 'udp', K.B_GAME_AFTER, 'silence', 'All UDP is dropped. UDP has no handshake, so nothing says "blocked" — just silence (nc exits 0 with no answer).', 'Mọi UDP bị bỏ. UDP không bắt tay nên chẳng gì báo "bị chặn" — chỉ có im lặng (nc thoát 0, không có trả lời).');
  const okLine: Record<ReqId, K.Q | string> = {
    phim: K.B_PHIM_BEFORE, phimAlt: K.B_ALT_DNS_OK, news: K.B_NEWS_OK, social: K.B_SOCIAL_BEFORE, socialHttp: K.B_SOCIAL_HTTP_OK,
    vpn: 'Connection to vpn.test (198.18.0.20) 443 port [tcp/https] succeeded!', ssh22: K.B_SSH22_BEFORE, ssh993: K.B_SSH993, game: K.B_GAME_BEFORE, phone: K.B_PHONE_OK,
  };
  const L = okLine[id];
  return { ok: true, line: typeof L === 'string' ? L : L[1], real: typeof L !== 'string', feel: 'ok', ttl, en: 'Passed every checkpoint.', vi: 'Qua hết mọi trạm.' };
}

/** Các trạm request đi qua cho tới khi bị chặn (hoặc tới đích). */
export function stagesOf(v: Verdict): Stage[] {
  const all = STAGES.map((s) => s.id);
  return v.stop ? all.slice(0, all.indexOf(v.stop) + 1) : all;
}

export const PRESET_RULES: Record<'web' | 'hotspot' | 'game', { rules: RuleId[]; req: ReqId }> = {
  web: { rules: ['dns', 'sni'], req: 'phim' },
  hotspot: { rules: [], req: 'phone' },
  game: { rules: ['ip', 'ports', 'udp'], req: 'game' },
};
