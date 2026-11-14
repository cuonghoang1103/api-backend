/**
 * "Wi-Fi trường" (14.1): hai SSID (TRUONG-DANGKY không Internet · TRUONG-SV có Internet), bộ điều khiển ghi "tài khoản ↔ MAC".
 *   register — vào SSID đăng ký: DORA → câu hỏi dò bị chuyển hướng → HTTPS sai chứng chỉ → đăng nhập ghi MAC
 *   private  — sang SSID có Internet với "Địa chỉ Wi-Fi riêng" Tắt / Cố định / Luân phiên của MacBook
 *   clone    — một tài khoản một MAC (Windows đá Mac ra) · máy thứ ba chép MAC ⇒ cùng IP · bảng MAC lật ⇒ cả hai bị RST
 * Mọi MAC/IP/dòng output là của lab thật (capture14.ts). Riêng địa chỉ "2 tuần sau" của chế độ Luân phiên là TÍNH RA.
 */
import * as K from './capture14';

export type Mode = 'off' | 'fixed' | 'rotating';
export type Who = 'mac' | 'win' | 'ke';
export type Net = 'none' | 'portal' | 'ok' | 'blocked' | 'kicked' | 'reset';
export type Kind = 'dhcp' | 'http' | 'https' | 'login' | 'data' | 'rst';
export interface Frame { from: Who | 'gw' | 'net'; to: Who | 'gw' | 'net'; kind: Kind; label: string; vi?: string; bad?: boolean }
export interface WStep {
  focus: Who | 'gw' | 'sw';
  ssid: Partial<Record<Who, 'dk' | 'sv' | null>>;
  mac: Partial<Record<Who, string>>;
  ip: Partial<Record<Who, string>>;
  frame?: Frame;
  reg: Array<{ acct: string; mac: string; hl?: boolean }>;
  /** switch: MAC 8c:8d:28… đang ở cổng của ai (preset clone) */
  port?: Who;
  flips?: number;
  net: Partial<Record<Who, Net>>;
  term: Array<{ t: string; real: boolean }>;
  en: string; vi: string; tone?: 'ok' | 'bad' | 'warn';
  where: string;
}

/** Địa chỉ "2 tuần sau" của chế độ Luân phiên — TÍNH RA (một MAC riêng mới: bit tự quản = 1). */
export const ROTATED = 'b6:21:4f:0c:9e:73';
const R = (q: K.Q) => ({ t: q[1], real: true });
const C = (t: string) => ({ t, real: false });

/** MAC MacBook dùng trên mỗi SSID theo chế độ. */
export function macOf(mode: Mode, ssid: 'dk' | 'sv', later = false): string {
  if (mode === 'off') return K.MAC14.macHw;
  if (mode === 'rotating' && later) return ROTATED;
  return ssid === 'dk' ? K.MAC14.macDk : K.MAC14.macSv;
}

export function wifiScript(preset: 'register' | 'private' | 'clone', mode: Mode): WStep[] {
  const S: WStep[] = [];
  const dk = macOf(mode, 'dk'), sv = macOf(mode, 'sv');
  const ipDk = mode === 'off' ? K.IP14.macDkHw : K.IP14.macDkPriv;
  const ipSv = mode === 'off' ? K.IP14.macSvHw : K.IP14.macSvPriv;
  const regMac = [{ acct: 'SE12345', mac: dk }];
  const loginLine = dk === K.MAC14.macDk ? R(K.LOGIN_PRIV) : C(`OK SE12345: da ghi MAC ${dk}. Gio hay ket noi SSID TRUONG-SV.`);

  if (preset === 'register') {
    const base = { ssid: { mac: 'dk' as const }, mac: { mac: dk }, reg: [] as WStep['reg'], net: { mac: 'portal' as Net } };
    S.push({ ...base, focus: 'mac', ip: {}, frame: { from: 'mac', to: 'gw', kind: 'dhcp', label: `DHCP Discover · from 0.0.0.0 · MAC ${dk}`, vi: `DHCP Discover · từ 0.0.0.0 · MAC ${dk}` }, term: [R(K.DORA[0])], where: 'nic-frame',
      en: `The MacBook joins TRUONG-DANGKY. It has no IP yet, so it broadcasts a DHCP Discover carrying its MAC — ${dk}${mode === 'off' ? ' (hardware, private address Off)' : ' (the private address macOS made for THIS network)'}.`,
      vi: `MacBook vào TRUONG-DANGKY. Nó chưa có IP nên phát DHCP Discover cho tất cả, mang MAC của nó — ${dk}${mode === 'off' ? ' (phần cứng, đã Tắt địa chỉ riêng)' : ' (địa chỉ riêng macOS tạo cho RIÊNG mạng này)'}.` });
    S.push({ ...base, focus: 'gw', ip: {}, frame: { from: 'gw', to: 'mac', kind: 'dhcp', label: `DHCP Offer · ${ipDk}` }, term: [R(K.DORA[0])], where: 'ip-config',
      en: `The controller offers ${ipDk}. It chose the address from the MAC — the same MAC always gets the same lease.`, vi: `Bộ điều khiển mời ${ipDk}. Nó chọn địa chỉ theo MAC — cùng MAC thì luôn được cùng lease.` });
    S.push({ ...base, focus: 'mac', ip: {}, frame: { from: 'mac', to: 'gw', kind: 'dhcp', label: `DHCP Request · ${ipDk}` }, term: [R(K.DORA[0]), dk === K.MAC14.macDk ? R(K.DORA[1]) : C(`udhcpc: broadcasting select for ${ipDk}, server 10.20.1.1`)], where: 'ip-config',
      en: 'Request: "I take it". Still a broadcast — the laptop still has no address of its own.', vi: 'Request: "tôi lấy nhé". Vẫn gửi cho tất cả — laptop vẫn chưa có địa chỉ riêng.' });
    S.push({ ...base, focus: 'gw', ip: { mac: ipDk }, frame: { from: 'gw', to: 'mac', kind: 'dhcp', label: 'DHCP Ack · lease 7200 s · gw + DNS 10.20.1.1', vi: 'DHCP Ack · thuê 7200 giây · cổng ra + DNS 10.20.1.1' }, term: [R(K.DORA[0]), dk === K.MAC14.macDk ? R(K.DORA[1]) : C(`udhcpc: broadcasting select for ${ipDk}, server 10.20.1.1`), dk === K.MAC14.macDk ? R(K.DORA[2]) : C(`udhcpc: lease of ${ipDk} obtained from 10.20.1.1, lease time 7200`)], where: 'ip-config', tone: 'ok',
      en: `Ack: ${ipDk} for 7200 s (2 hours). Gateway and DNS are the controller. The IP is only borrowed — it is NOT what the school registers.`, vi: `Ack: ${ipDk} trong 7200 giây (2 giờ). Cổng ra và DNS là bộ điều khiển. IP chỉ là đi mượn — KHÔNG phải thứ trường đăng ký.` });
    S.push({ ...base, focus: 'gw', ip: { mac: ipDk }, frame: { from: 'mac', to: 'gw', kind: 'http', label: 'GET http://captive.apple.com ⇒ 302 to the login page', vi: 'GET http://captive.apple.com ⇒ 302 về trang đăng nhập', bad: true }, term: [C('$ curl -sI http://captive.apple.com/hotspot-detect.html'), R(K.PROBE_302), C('(at home the same probe returns:)'), R(K.HOME_SUCCESS)], where: 'packet', tone: 'warn',
      en: 'macOS checks "do I really have Internet?" by fetching captive.apple.com over plain HTTP. The controller intercepts it and answers 302 → the login page. Not "Success" ⇒ the login window pops up.', vi: 'macOS kiểm "mình có Internet thật không?" bằng cách tải captive.apple.com qua HTTP thường. Bộ điều khiển chặn giữa đường và trả 302 → trang đăng nhập. Không phải "Success" ⇒ cửa sổ đăng nhập bật lên.' });
    S.push({ ...base, focus: 'gw', ip: { mac: ipDk }, frame: { from: 'mac', to: 'gw', kind: 'https', label: 'HTTPS captive.apple.com ⇒ wrong certificate', vi: 'HTTPS captive.apple.com ⇒ sai chứng chỉ', bad: true }, term: [C('$ curl -sS https://captive.apple.com/'), R(K.PROBE_TLS)], where: 'tls', tone: 'bad',
      en: 'HTTPS cannot be redirected silently: the controller has no certificate for captive.apple.com, so you get a certificate error — the "connection is not private" page on hotel/school Wi-Fi.', vi: 'HTTPS không chuyển hướng lặng lẽ được: bộ điều khiển không có chứng chỉ của captive.apple.com, nên bạn nhận lỗi chứng chỉ — trang "kết nối không riêng tư" ở Wi-Fi khách sạn/trường.' });
    S.push({ ...base, focus: 'gw', ip: { mac: ipDk }, reg: regMac.map((r) => ({ ...r, hl: true })), frame: { from: 'mac', to: 'gw', kind: 'login', label: 'POST /login user=SE12345' }, term: [C('$ curl -s -d "user=SE12345&pass=…" http://portal.truong.test/login'), loginLine], where: 'arp-cache', tone: 'ok',
      en: `Logged in. The controller cannot see "your laptop" — it reads the SOURCE MAC of the frame and writes SE12345 ↔ ${dk}. Only that MAC will be let through on TRUONG-SV.`, vi: `Đã đăng nhập. Bộ điều khiển không thấy "laptop của bạn" — nó đọc MAC NGUỒN của frame và ghi SE12345 ↔ ${dk}. Chỉ MAC đó được cho qua ở TRUONG-SV.` });
    return S;
  }

  if (preset === 'private') {
    const svIp = mode === 'off' ? K.IP14.macSvHw : K.IP14.macSvPriv;
    S.push({ focus: 'gw', ssid: { mac: 'dk' }, mac: { mac: dk }, ip: { mac: ipDk }, reg: regMac.map((r) => ({ ...r, hl: true })), net: { mac: 'portal' }, term: [loginLine], where: 'arp-cache', frame: { from: 'mac', to: 'gw', kind: 'login', label: `registered on SSID 1 with MAC ${dk}`, vi: `đã đăng ký ở SSID 1 với MAC ${dk}` },
      en: `Step 1 (as in the previous run): on TRUONG-DANGKY the MacBook registered ${dk}.`, vi: `Bước 1 (như lượt trước): ở TRUONG-DANGKY, MacBook đã đăng ký ${dk}.` });
    S.push({ focus: 'mac', ssid: { mac: 'sv' }, mac: { mac: sv }, ip: { mac: svIp }, reg: regMac, net: { mac: 'none' }, term: [sv === K.MAC14.macSv ? C(`$ ip -br link show sv   ⇒   ${sv}`) : C(`$ ip -br link show sv   ⇒   ${sv}`), C(`udhcpc: lease of ${svIp} obtained from 10.20.2.1, lease time 7200`)], where: 'nic-frame', frame: { from: 'mac', to: 'gw', kind: 'dhcp', label: `join TRUONG-SV · MAC ${sv}`, vi: `vào TRUONG-SV · MAC ${sv}` }, tone: sv === dk ? 'ok' : 'warn',
      en: mode === 'off' ? `Private address Off: on TRUONG-SV the card uses the SAME hardware MAC ${sv}. DHCP gives ${svIp}.` : `Private address ${mode === 'fixed' ? 'Fixed' : 'Rotating'}: on TRUONG-SV the card uses ANOTHER private MAC, ${sv} — one address per network. DHCP does not care and gives ${svIp}.`,
      vi: mode === 'off' ? `Đã Tắt địa chỉ riêng: ở TRUONG-SV card dùng CÙNG MAC phần cứng ${sv}. DHCP cấp ${svIp}.` : `Địa chỉ riêng ${mode === 'fixed' ? 'Cố định' : 'Luân phiên'}: ở TRUONG-SV card dùng MỘT MAC RIÊNG KHÁC, ${sv} — mỗi mạng một địa chỉ. DHCP không quan tâm và cấp ${svIp}.` });
    const pass = sv === dk;
    S.push({ focus: 'gw', ssid: { mac: 'sv' }, mac: { mac: sv }, ip: { mac: svIp }, reg: regMac.map((r) => ({ ...r, hl: true })), net: { mac: pass ? 'ok' : 'blocked' }, term: pass ? [C('$ curl -s http://news.test/'), R(K.OK_NEWS)] : [C('$ curl -sL http://news.test/'), R(K.BLOCK_PRIV)], where: 'arp-cache',
      frame: pass ? { from: 'mac', to: 'net', kind: 'http', label: 'GET http://news.test ⇒ allowed', vi: 'GET http://news.test ⇒ được qua' } : { from: 'mac', to: 'gw', kind: 'http', label: `GET http://news.test ⇒ ${sv} not registered`, vi: `GET http://news.test ⇒ ${sv} chưa đăng ký`, bad: true }, tone: pass ? 'ok' : 'bad',
      en: pass ? `The controller finds ${sv} in its list ⇒ the request goes out to the Internet.` : `The controller looks for ${sv} in its list — it only has ${dk}. Blocked: "device not registered". This is the whole bug.`,
      vi: pass ? `Bộ điều khiển tìm thấy ${sv} trong danh sách ⇒ request đi ra Internet.` : `Bộ điều khiển tìm ${sv} trong danh sách — nó chỉ có ${dk}. Bị chặn: "thiết bị chưa đăng ký". Toàn bộ lỗi nằm ở đây.` });
    if (mode === 'rotating') {   // Rotating thêm cảnh "2 tuần sau" để thấy MAC lại đổi
      S.push({ focus: 'mac', ssid: { mac: 'sv' }, mac: { mac: ROTATED }, ip: { mac: svIp }, reg: regMac, net: { mac: 'blocked' }, term: [C(`(two weeks later) MAC on TRUONG-SV ⇒ ${ROTATED} — computed`)], where: 'nic-frame', tone: 'bad', frame: { from: 'mac', to: 'gw', kind: 'http', label: `2 weeks later · new MAC ${ROTATED}`, vi: `2 tuần sau · MAC mới ${ROTATED}`, bad: true },
        en: 'Rotating: even if you registered the right MAC, macOS picks a new private address every 2 weeks (Windows "Change daily": every day). It works, then one day it does not.', vi: 'Luân phiên: kể cả khi đã đăng ký đúng MAC, macOS chọn địa chỉ riêng mới sau mỗi 2 tuần (Windows "Change daily": mỗi ngày). Đang chạy, rồi một ngày nọ thì không.' });
    }
    S.push({ focus: 'mac', ssid: { mac: 'sv' }, mac: { mac: mode === 'rotating' ? ROTATED : sv }, ip: { mac: svIp }, reg: regMac, net: { mac: pass ? 'ok' : 'blocked' }, term: pass ? [C('$ curl -sS https://news.test/'), R(K.OK_NEWS)] : [C('$ curl -sS https://news.test/'), R(K.PRIV_HTTPS_TIMEOUT)], where: 'packet', tone: pass ? 'ok' : 'bad',
      frame: pass ? { from: 'mac', to: 'net', kind: 'https', label: 'HTTPS news.test ⇒ OK', vi: 'HTTPS news.test ⇒ OK' } : { from: 'mac', to: 'gw', kind: 'https', label: 'HTTPS ⇒ dropped, timeout', vi: 'HTTPS ⇒ bị bỏ, hết giờ', bad: true },
      en: pass ? 'HTTPS works too. The fix: private address OFF for BOTH school SSIDs, register once.' : 'HTTPS just hangs until timeout — nothing on screen says why. Fix: set "Private Wi-Fi address" to Off (top of this lab) and run it again.',
      vi: pass ? 'HTTPS cũng chạy. Cách sửa: TẮT địa chỉ riêng cho CẢ HAI SSID của trường, đăng ký một lần.' : 'HTTPS chỉ treo tới hết giờ — màn hình không nói lý do. Sửa: đặt "Địa chỉ Wi-Fi riêng" = Tắt (đầu phòng lab này) rồi chạy lại.' });
    return S;
  }

  // ── clone ──
  const hw = K.MAC14.macHw, win = K.MAC14.winHw;
  S.push({ focus: 'mac', ssid: { mac: 'sv', win: null }, mac: { mac: hw, win }, ip: { mac: K.IP14.macSvHw }, reg: [{ acct: 'SE12345', mac: hw, hl: true }], net: { mac: 'ok' }, term: [R(K.LOGIN_HW), R(K.OK_NEWS)], where: 'arp-cache', frame: { from: 'mac', to: 'net', kind: 'http', label: 'MacBook (private Off) ⇒ Internet OK', vi: 'MacBook (đã Tắt địa chỉ riêng) ⇒ có Internet' }, tone: 'ok',
    en: 'The MacBook did it right (private address Off, registered once): Internet works.', vi: 'MacBook làm đúng (đã Tắt địa chỉ riêng, đăng ký một lần): có Internet.' });
  S.push({ focus: 'gw', ssid: { mac: 'sv', win: 'dk' }, mac: { mac: hw, win }, ip: { mac: K.IP14.macSvHw, win: K.IP14.winDk }, reg: [{ acct: 'SE12345', mac: win, hl: true }], net: { mac: 'kicked', win: 'portal' }, term: [R(K.LOGIN_WIN)], where: 'arp-cache', frame: { from: 'win', to: 'gw', kind: 'login', label: 'Windows: POST /login user=SE12345 (same account)', vi: 'Windows: POST /login user=SE12345 (cùng tài khoản)' }, tone: 'warn',
    en: 'The Windows laptop logs in with the SAME account. One account = one MAC: the controller replaces the Mac\'s MAC with the Windows one.', vi: 'Laptop Windows đăng nhập CÙNG tài khoản. Một tài khoản = một MAC: bộ điều khiển thay MAC của Mac bằng MAC của Windows.' });
  S.push({ focus: 'mac', ssid: { mac: 'sv', win: 'sv' }, mac: { mac: hw, win }, ip: { mac: K.IP14.macSvHw, win: K.IP14.winSv }, reg: [{ acct: 'SE12345', mac: win }], net: { mac: 'kicked', win: 'ok' }, term: [R(K.BLOCK_MAC_KICKED)], where: 'arp-cache', frame: { from: 'mac', to: 'gw', kind: 'http', label: 'MacBook ⇒ "device not registered"', vi: 'MacBook ⇒ "thiết bị chưa đăng ký"', bad: true }, tone: 'bad',
    en: 'Now the Mac is blocked and Windows works — exactly the story. The honest fix: ask IT to register a second device.', vi: 'Giờ Mac bị chặn còn Windows chạy — đúng câu chuyện. Cách sửa đàng hoàng: xin IT đăng ký thêm thiết bị thứ hai.' });
  S.push({ focus: 'ke', ssid: { win: 'sv', ke: 'sv' }, mac: { win, ke: win }, ip: { win: K.IP14.winSv, ke: K.IP14.winSv }, reg: [{ acct: 'SE12345', mac: win, hl: true }], net: { win: 'ok', ke: 'ok' }, port: 'ke', flips: 0, term: [C('$ ip link set sv address 8c:8d:28:4e:7a:12'), R(K.CLONE_LEASE), R(K.OK_NEWS)], where: 'nic-frame', frame: { from: 'ke', to: 'net', kind: 'http', label: 'a third machine copies the MAC ⇒ same IP, no login needed', vi: 'máy thứ ba chép MAC ⇒ cùng IP, khỏi đăng nhập' }, tone: 'warn',
    en: 'A third machine copies the Windows MAC: DHCP gives it the SAME IP (10.20.2.159) and it walks past the login page. Registration by MAC is weak security.', vi: 'Một máy thứ ba chép MAC của Windows: DHCP cấp CÙNG IP (10.20.2.159) và nó đi thẳng qua trang đăng nhập. Đăng ký theo MAC là lớp bảo mật yếu.' });
  const order: Who[] = ['win', 'ke', 'win', 'ke', 'win'];
  order.forEach((who, k) => {
    const other: Who = who === 'win' ? 'ke' : 'win';
    S.push({ focus: 'sw', ssid: { win: 'sv', ke: 'sv' }, mac: { win, ke: win }, ip: { win: K.IP14.winSv, ke: K.IP14.winSv }, reg: [{ acct: 'SE12345', mac: win }], net: { win: k >= 3 ? 'reset' : 'ok', ke: k >= 4 ? 'reset' : 'ok' }, port: who, flips: k + 1, where: 'wire',
      term: [C(`switch: 8c:8d:28:4e:7a:12 dev port-${who}   (flip ${k + 1})`), ...(k >= 3 ? [R(K.CLONE_RESET)] : [])],
      frame: k % 2 === 0 ? { from: who, to: 'net', kind: 'data', label: `${who} sends an ACK ⇒ switch moves the MAC to ${who}'s port`, vi: `${who === 'win' ? 'Windows' : 'máy chép'} gửi ACK ⇒ switch dời MAC sang cổng của nó` } : { from: 'net', to: who, kind: 'rst', label: `data for ${other} lands on ${who} ⇒ RST`, vi: `gói của ${other === 'win' ? 'Windows' : 'máy chép'} tới nhầm ${who === 'win' ? 'Windows' : 'máy chép'} ⇒ RST`, bad: true }, tone: k % 2 === 0 ? 'warn' : 'bad',
      en: k % 2 === 0 ? `${who === 'win' ? 'Windows' : 'The copy'} sends a frame: the switch learns "8c:8d:28:4e:7a:12 is behind THIS port" and sends the next packets there.` : `Packets of ${other === 'win' ? 'Windows\'' : 'the copy\'s'} download now arrive at ${who === 'win' ? 'Windows' : 'the copy'}, which has no such connection ⇒ it answers TCP RST and kills it.`,
      vi: k % 2 === 0 ? `${who === 'win' ? 'Windows' : 'Máy chép'} gửi một frame: switch học "8c:8d:28:4e:7a:12 ở sau cổng NÀY" và gửi các gói tiếp theo sang đó.` : `Gói của lượt tải ${other === 'win' ? 'Windows' : 'máy chép'} giờ tới ${who === 'win' ? 'Windows' : 'máy chép'}, máy không có kết nối đó ⇒ trả TCP RST và giết nó.` });
  });
  S.push({ focus: 'sw', ssid: { win: 'sv', ke: 'sv' }, mac: { win, ke: win }, ip: { win: K.IP14.winSv, ke: K.IP14.winSv }, reg: [{ acct: 'SE12345', mac: win }], net: { win: 'reset', ke: 'reset' }, port: 'win', flips: 84, where: 'wire', tone: 'bad',
    term: [R(K.CLONE_RESET), R(K.CLONE_PING), C('switch table changed its mind 84 times in 5 s (lab: bridge monitor fdb)')],
    en: 'In the lab: the switch changed its mind 84 times in 5 seconds, both downloads died with "Connection reset by peer" — while ping still said 0% loss. Never trust ping alone.', vi: 'Trong lab: switch đổi ý 84 lần trong 5 giây, cả hai lượt tải chết với "Connection reset by peer" — trong khi ping vẫn báo mất 0%. Đừng tin mỗi ping.' });
  return S;
}
