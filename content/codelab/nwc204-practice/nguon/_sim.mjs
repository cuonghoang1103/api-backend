/**
 * NWC204 practice — BỘ MÔ PHỎNG dùng để TÍNH số trong đề (không tính nhẩm). Mỗi hàm TỰ CHỨA (không gọi hàm khác của tệp)
 * để dùng luôn làm "lời giải" cho bài viết hàm (dat(fn,'tên')). Kiểm với ví dụ sách/RFC: node _kiem-sim.mjs
 */

/* ─────────── hệ đếm ─────────── */
/** Số nguyên không âm ⇒ nhị phân đủ `bits` bit. */
export function toBin(n, bits) { var s = n.toString(2); while (s.length < bits) s = '0' + s; return s; }
/** Địa chỉ IPv4 ⇒ 32 bit nhị phân, chia 4 nhóm bởi dấu chấm. */
export function ipToBin(ip) { return ip.split('.').map(function (o) { var s = (+o).toString(2); while (s.length < 8) s = '0' + s; return s; }).join('.'); }

/* ─────────── IPv4 ─────────── */
/** Thông tin mạng của ip/prefix. */
export function ipInfo(ip, prefix) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  var a = toInt(ip), net = (a & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = Math.pow(2, 32 - prefix);
  var hosts = prefix <= 30 ? size - 2 : (prefix === 31 ? 2 : 1);
  var first = prefix <= 30 ? net + 1 : net, last = prefix <= 30 ? bc - 1 : bc;
  if (prefix === 32) { first = a; last = a; }
  return { network: toStr(net), broadcast: toStr(bc), mask: toStr(mask), wildcard: toStr(~mask >>> 0), firstHost: toStr(first), lastHost: toStr(last), hosts: hosts, prefix: prefix };
}
/** Chia mạng net/prefix thành các mạng con /newPrefix: trả danh sách { network, broadcast, firstHost, lastHost } (tối đa `max`). */
export function splitSubnets(net, prefix, newPrefix, max) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0, base = (toInt(net) & mask) >>> 0;
  var step = Math.pow(2, 32 - newPrefix), count = Math.pow(2, newPrefix - prefix), out = [];
  for (var i = 0; i < count && i < (max || count); i++) {
    var n = base + i * step;
    out.push({ network: toStr(n), broadcast: toStr(n + step - 1), firstHost: toStr(n + 1), lastHost: toStr(n + step - 2) });
  }
  return out;
}
/** Số bit mượn nhỏ nhất để có ít nhất `n` mạng con, và số host mỗi mạng con. */
export function borrowBits(prefix, n) { var b = 0; while (Math.pow(2, b) < n) b++; return { borrowed: b, newPrefix: prefix + b, hostsPerSubnet: Math.pow(2, 32 - prefix - b) - 2 }; }
/** VLSM: cấp mạng con cho các nhu cầu [{name, hosts}] từ base/prefix, lớn trước. Hết chỗ ⇒ null. */
export function vlsm(base, prefix, needs) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var mask0 = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0, cur = (toInt(base) & mask0) >>> 0, end = cur + Math.pow(2, 32 - prefix);
  var list = needs.map(function (x, i) { return { name: x.name, hosts: x.hosts, i: i }; });
  list.sort(function (a, b) { return b.hosts - a.hosts || a.i - b.i; });
  var out = [];
  for (var k = 0; k < list.length; k++) {
    var p = 30; while (p > 0 && Math.pow(2, 32 - p) - 2 < list[k].hosts) p--;
    var size = Math.pow(2, 32 - p);
    if (cur + size > end) return null;
    out.push({ name: list[k].name, hosts: list[k].hosts, prefix: p, network: toStr(cur), firstHost: toStr(cur + 1), lastHost: toStr(cur + size - 2), broadcast: toStr(cur + size - 1) });
    cur += size;
  }
  return out;
}
/** Tóm tắt tuyến: danh sách 'a.b.c.d/p' ⇒ CIDR ngắn nhất bao trùm tất cả. */
export function summarize(nets) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var addrs = nets.map(function (s) { return toInt(s.split('/')[0]); }), minP = Math.min.apply(null, nets.map(function (s) { return +s.split('/')[1]; }));
  var p = minP;
  while (p > 0) {
    var m = (0xFFFFFFFF << (32 - p)) >>> 0, first = (addrs[0] & m) >>> 0, ok = true;
    for (var i = 1; i < addrs.length; i++) if (((addrs[i] & m) >>> 0) !== first) ok = false;
    if (ok) break;
    p--;
  }
  var mm = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
  return toStr((addrs[0] & mm) >>> 0) + '/' + p;
}
/** Lớp địa chỉ IPv4 cũ: 'A' | 'B' | 'C' | 'D' | 'E'. */
export function ipClass(ip) { var o = +ip.split('.')[0]; return o < 128 ? 'A' : o < 192 ? 'B' : o < 224 ? 'C' : o < 240 ? 'D' : 'E'; }
/** Loại địa chỉ: 'private' | 'loopback' | 'link-local' | 'multicast' | 'public'. */
export function ipKind(ip) {
  var p = ip.split('.').map(Number);
  if (p[0] === 10) return 'private';
  if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return 'private';
  if (p[0] === 192 && p[1] === 168) return 'private';
  if (p[0] === 127) return 'loopback';
  if (p[0] === 169 && p[1] === 254) return 'link-local';
  if (p[0] >= 224 && p[0] <= 239) return 'multicast';
  return 'public';
}
/** Hai host có cùng mạng không (qua phép AND với mặt nạ /prefix)? */
export function sameNetwork(a, b, prefix) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var m = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  return ((toInt(a) & m) >>> 0) === ((toInt(b) & m) >>> 0);
}
/** Bảng định tuyến: routes = [{ net:'10.0.0.0/8', nh:'192.0.2.1' }]; trả tuyến khớp dài nhất (hoà ⇒ tuyến đứng trước) hoặc null. */
export function lpm(routes, dst) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var d = toInt(dst), best = null, bestLen = -1;
  for (var i = 0; i < routes.length; i++) {
    var parts = routes[i].net.split('/'), len = +parts[1], m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0;
    if (((d & m) >>> 0) === ((toInt(parts[0]) & m) >>> 0) && len > bestLen) { best = routes[i]; bestLen = len; }
  }
  return best;
}
/** Phân mảnh IPv4: tổng độ dài gói totalLen (gồm header 20 B), MTU ⇒ [{ offset (đơn vị 8 B), dataLen, mf }]. */
export function fragment(totalLen, mtu) {
  var data = totalLen - 20, per = Math.floor((mtu - 20) / 8) * 8, off = 0, out = [];
  while (data > 0) {
    var n = Math.min(per, data);
    out.push({ offset: off / 8, dataLen: n, mf: data - n > 0 ? 1 : 0 });
    off += n; data -= n;
  }
  return out;
}

/* ─────────── IPv6 ─────────── */
/** Mở rộng đầy đủ về 8 nhóm 4 chữ số hex. */
export function ipv6Expand(addr) {
  var halves = addr.toLowerCase().split('::'), left = halves[0] ? halves[0].split(':') : [], right = halves.length > 1 && halves[1] ? halves[1].split(':') : [];
  var groups = left.slice();
  if (halves.length > 1) { for (var i = left.length + right.length; i < 8; i++) groups.push('0'); groups = groups.concat(right); }
  return groups.map(function (g) { while (g.length < 4) g = '0' + g; return g; }).join(':');
}
/** Rút gọn theo RFC 5952: bỏ số 0 đầu nhóm, thay dãy dài nhất (≥ 2 nhóm 0, hoà ⇒ dãy đầu) bằng '::'. */
export function ipv6Compress(addr) {
  var halves = addr.toLowerCase().split('::'), left = halves[0] ? halves[0].split(':') : [], right = halves.length > 1 && halves[1] ? halves[1].split(':') : [];
  var g = left.slice();
  if (halves.length > 1) { for (var i = left.length + right.length; i < 8; i++) g.push('0'); g = g.concat(right); }
  g = g.map(function (x) { return String(parseInt(x, 16).toString(16)); });
  var bs = -1, bl = 0, s = -1;
  for (var k = 0; k <= 8; k++) {
    if (k < 8 && g[k] === '0') { if (s < 0) s = k; }
    else { if (s >= 0 && k - s > bl) { bl = k - s; bs = s; } s = -1; }
  }
  if (bl < 2) return g.join(':');
  return g.slice(0, bs).join(':') + '::' + g.slice(bs + bl).join(':');
}
/** EUI-64 từ MAC (aa:bb:cc:dd:ee:ff): đảo bit thứ 7 và chèn fffe, trả 4 nhóm hex rút gọn số 0 đầu. */
export function eui64(mac) {
  var b = mac.split(/[:-]/).map(function (x) { return parseInt(x, 16); });
  b[0] = b[0] ^ 2;
  var r = [b[0], b[1], b[2], 0xff, 0xfe, b[3], b[4], b[5]], g = [];
  for (var i = 0; i < 8; i += 2) g.push((r[i] * 256 + r[i + 1]).toString(16));
  return g.join(':');
}
/** Mạng con thứ n (/64) của một tiền tố /48: ví dụ ('2001:db8:acad::', 5) ⇒ '2001:db8:acad:5::/64'. */
export function ipv6Subnet64(prefix48, n) {
  var halves = prefix48.toLowerCase().split('::'), left = halves[0] ? halves[0].split(':') : [];
  var g = left.slice(0, 3); while (g.length < 3) g.push('0');
  g = g.map(function (x) { return parseInt(x, 16).toString(16); });
  return g.join(':') + ':' + n.toString(16) + '::/64';
}

/* ─────────── tầng liên kết ─────────── */
/** CRC theo chia đa thức mod 2: dữ liệu bit-string, đa thức bit-string (vd '10011') ⇒ phần dư r bit (r = độ dài đa thức − 1). */
export function crcBits(data, poly) {
  var r = poly.length - 1, a = (data + new Array(r + 1).join('0')).split('');
  for (var i = 0; i + poly.length <= a.length; i++) {
    if (a[i] === '1') for (var j = 0; j < poly.length; j++) a[i + j] = a[i + j] === poly[j] ? '0' : '1';
  }
  return a.slice(a.length - r).join('');
}
/** Bit chẵn lẻ (parity chẵn): bit cần thêm để tổng số bit 1 chẵn. */
export function evenParity(bits) { var c = 0; for (var i = 0; i < bits.length; i++) if (bits[i] === '1') c++; return c % 2 === 0 ? '0' : '1'; }
/** Công tắc chuyển mạch học MAC: frames = [{src,dst,in}] ⇒ { actions:['flood'|'filter'|'port N'…], table:{mac: port} }. */
export function macSwitch(frames) {
  var table = {}, actions = [];
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i];
    table[f.src] = f.in;
    if (f.dst === 'ff:ff:ff:ff:ff:ff' || table[f.dst] === undefined) actions.push('flood');
    else if (table[f.dst] === f.in) actions.push('filter');
    else actions.push('port ' + table[f.dst]);
  }
  return { actions: actions, table: table };
}
/** Switch có VLAN: ports = { '1': {mode:'access', vlan:10}, '5': {mode:'trunk', allowed:[10,20], native:1} }; frames = [{src,dst,in,vlan?}].
 *  Trả { out:[danh sách cổng ra cho từng frame, vd '2' hoặc '5(tag 10)'], table:{'10/mac': port} }. Frame bị loại ⇒ out []. */
export function vlanSwitch(ports, frames) {
  var table = {}, out = [];
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i], pin = ports[String(f.in)], v;
    if (pin.mode === 'access') v = pin.vlan; else v = (f.vlan === undefined || f.vlan === null) ? pin.native : f.vlan;
    if (pin.mode === 'trunk' && pin.allowed.indexOf(v) < 0) { out.push([]); continue; }
    table[v + '/' + f.src] = f.in;
    var known = table[v + '/' + f.dst], targets = [];
    var names = Object.keys(ports).sort(function (a, b) { return a - b; });
    for (var k = 0; k < names.length; k++) {
      var p = names[k], c = ports[p], member = c.mode === 'access' ? c.vlan === v : c.allowed.indexOf(v) >= 0;
      if (!member || Number(p) === Number(f.in)) continue;
      if (f.dst !== 'ff:ff:ff:ff:ff:ff' && known !== undefined && Number(p) !== Number(known)) continue;
      targets.push(c.mode === 'trunk' && v !== c.native ? p + '(tag ' + v + ')' : p);
    }
    if (known !== undefined && f.dst !== 'ff:ff:ff:ff:ff:ff' && Number(known) === Number(f.in)) targets = [];
    out.push(targets);
  }
  return { out: out, table: table };
}

/* ─────────── tầng giao vận ─────────── */
/** Số seq/ack của kết nối TCP: bắt tay 3 bước, client gửi các đoạn dữ liệu (byte) mỗi đoạn được ACK, rồi đóng 4 bước.
 *  Trả danh sách { from:'C'|'S', flags, seq, ack, len }. */
export function tcpTrace(isnC, isnS, sizes) {
  var out = [], c = isnC, s = isnS;
  out.push({ from: 'C', flags: 'SYN', seq: c, ack: 0, len: 0 }); c++;
  out.push({ from: 'S', flags: 'SYN,ACK', seq: s, ack: c, len: 0 }); s++;
  out.push({ from: 'C', flags: 'ACK', seq: c, ack: s, len: 0 });
  for (var i = 0; i < sizes.length; i++) {
    out.push({ from: 'C', flags: 'PSH,ACK', seq: c, ack: s, len: sizes[i] }); c += sizes[i];
    out.push({ from: 'S', flags: 'ACK', seq: s, ack: c, len: 0 });
  }
  out.push({ from: 'C', flags: 'FIN,ACK', seq: c, ack: s, len: 0 }); c++;
  out.push({ from: 'S', flags: 'ACK', seq: s, ack: c, len: 0 });
  out.push({ from: 'S', flags: 'FIN,ACK', seq: s, ack: c, len: 0 }); s++;
  out.push({ from: 'C', flags: 'ACK', seq: c, ack: s, len: 0 });
  return out;
}
/** Cửa sổ trượt theo vòng (mỗi vòng = một RTT). total đoạn, cửa sổ w, lost = số hiệu đoạn mất ở LẦN GỬI ĐẦU (0..total-1).
 *  mode 'gbn' (Go-Back-N: gửi lại từ đoạn mất đầu tiên) hoặc 'sr' (Selective Repeat: chỉ gửi lại đoạn mất). Trả { rounds, transmissions }. */
export function windowSim(total, w, lost, mode) {
  var lostSet = {}, i, base = 0, rounds = 0, tx = 0, acked = {};
  for (i = 0; i < lost.length; i++) lostSet[lost[i]] = true;
  while (base < total) {
    rounds++;
    var sent = [];
    for (i = base; i < Math.min(base + w, total); i++) if (mode === 'gbn' || !acked[i]) sent.push(i);
    tx += sent.length;
    if (mode === 'gbn') {
      var firstLost = -1;
      // đoạn "mất" chỉ mất ở LẦN GỬI ĐẦU: mọi đoạn trong danh sách đã gửi ở vòng này đều hết bị mất, kể cả đoạn đứng sau đoạn mất đầu tiên
      for (i = 0; i < sent.length; i++) if (lostSet[sent[i]]) { if (firstLost < 0) firstLost = sent[i]; delete lostSet[sent[i]]; }
      base = firstLost < 0 ? sent[sent.length - 1] + 1 : firstLost;
    } else {
      for (i = 0; i < sent.length; i++) { if (lostSet[sent[i]]) delete lostSet[sent[i]]; else acked[sent[i]] = true; }
      while (base < total && acked[base]) base++;
    }
  }
  return { rounds: rounds, transmissions: tx };
}
/** Cửa sổ tắc nghẽn (đơn vị MSS) theo từng vòng: slow start gấp đôi tới ssthresh rồi tăng 1 mỗi vòng; vòng nào có timeout ⇒ ssthresh = max(2, ⌊cwnd/2⌋), cwnd = 1. Trả mảng cwnd ở ĐẦU mỗi vòng. */
export function cwndTrace(ssthresh, rounds, timeouts) {
  var cwnd = 1, st = ssthresh, out = [];
  for (var r = 1; r <= rounds; r++) {
    out.push(cwnd);
    if (timeouts.indexOf(r) >= 0) { st = Math.max(2, Math.floor(cwnd / 2)); cwnd = 1; }
    else if (cwnd < st) cwnd = Math.min(cwnd * 2, st);
    else cwnd = cwnd + 1;
  }
  return out;
}
/** traceroute: path = địa chỉ các chặng, chặng cuối là đích; silent = chỉ số chặng KHÔNG trả lời ICMP. Trả dòng cho mỗi TTL cho tới khi tới đích (hoặc maxTtl). */
export function traceroute(path, silent, maxTtl) {
  var out = [];
  for (var ttl = 1; ttl <= maxTtl; ttl++) {
    var i = ttl - 1;
    if (i >= path.length) { out.push(ttl + ' *'); continue; }
    out.push(ttl + ' ' + (silent.indexOf(i) >= 0 ? '*' : path[i]));
    if (i === path.length - 1) break;
  }
  return out;
}

/* ─────────── ACL & NAT ─────────── */
/** ACL kiểu Cisco: lines = ['access-list 101 permit tcp 192.168.10.0 0.0.0.255 any eq 80', 'deny ip any any', 'access-list 10 permit host 10.1.1.1'…];
 *  packets = [{ proto:'tcp', src, dst, sport?, dport? }]. Trả [{ action:'permit'|'deny', rule: số thứ tự dòng hoặc 0 (deny ngầm) }]. */
export function aclRun(lines, packets) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var named = { www: 80, http: 80, https: 443, ftp: 21, telnet: 23, smtp: 25, domain: 53, ssh: 22 };
  function port(t) { return named[t] !== undefined ? named[t] : Number(t); }
  function addr(t, i) {
    if (t[i] === 'any') return [{ any: true }, i + 1];
    if (t[i] === 'host') return [{ ip: toInt(t[i + 1]), wild: 0 }, i + 2];
    if (i + 1 < t.length && /^\d+\.\d+\.\d+\.\d+$/.test(t[i + 1])) return [{ ip: toInt(t[i]), wild: toInt(t[i + 1]) }, i + 2];
    return [{ ip: toInt(t[i]), wild: 0 }, i + 1];
  }
  var rules = [];
  for (var n = 0; n < lines.length; n++) {
    var t = lines[n].trim().split(/\s+/), i = 0;
    if (t[0] === 'access-list') i = 2;
    var r = { action: t[i], proto: 'ip', sport: null, dport: null };
    i++;
    var ext = ['ip', 'tcp', 'udp', 'icmp'].indexOf(t[i]) >= 0;
    if (ext) { r.proto = t[i]; i++; }
    var a = addr(t, i); r.src = a[0]; i = a[1];
    if (ext) {
      if (t[i] === 'eq' && (r.proto === 'tcp' || r.proto === 'udp') && !/^\d+\.\d+/.test(t[i + 1])) { r.sport = port(t[i + 1]); i += 2; }
      a = addr(t, i); r.dst = a[0]; i = a[1];
      if (t[i] === 'eq') r.dport = port(t[i + 1]);
    } else r.dst = { any: true };
    rules.push(r);
  }
  function ok(m, ip) { return m.any || (((toInt(ip) ^ m.ip) & ~m.wild) >>> 0) === 0; }
  return packets.map(function (p) {
    for (var k = 0; k < rules.length; k++) {
      var r = rules[k];
      if (r.proto !== 'ip' && r.proto !== p.proto) continue;
      if (!ok(r.src, p.src) || !ok(r.dst, p.dst)) continue;
      if (r.sport !== null && r.sport !== p.sport) continue;
      if (r.dport !== null && r.dport !== p.dport) continue;
      return { action: r.action, rule: k + 1 };
    }
    return { action: 'deny', rule: 0 };
  });
}
/** PAT (NAT overload): conns = [{ ip, port, proto }]; mỗi bộ ba mới nhận cổng công cộng kế tiếp từ startPort; bộ ba cũ dùng lại. Trả mảng 'pubIp:cổng' theo từng kết nối. */
export function patSim(pubIp, startPort, conns) {
  var map = {}, next = startPort, out = [];
  for (var i = 0; i < conns.length; i++) {
    var k = conns[i].proto + '|' + conns[i].ip + ':' + conns[i].port;
    if (map[k] === undefined) map[k] = next++;
    out.push(pubIp + ':' + map[k]);
  }
  return out;
}
/** NAT động với dải địa chỉ: events = [['open','h1'],['close','h1']…]; open cấp địa chỉ rảnh đầu tiên của pool (host đã có ⇒ giữ nguyên), hết ⇒ null; close trả địa chỉ về. Trả kết quả cho từng 'open'. */
export function poolNat(pool, events) {
  var used = {}, byHost = {}, out = [];
  for (var i = 0; i < events.length; i++) {
    var op = events[i][0], h = events[i][1];
    if (op === 'open') {
      if (byHost[h] !== undefined) { out.push(byHost[h]); continue; }
      var got = null;
      for (var k = 0; k < pool.length; k++) if (!used[pool[k]]) { got = pool[k]; break; }
      if (got) { used[got] = true; byHost[h] = got; }
      out.push(got);
    } else if (byHost[h] !== undefined) { delete used[byHost[h]]; delete byHost[h]; }
  }
  return out;
}
/** Mô phỏng chuyển tiếp qua nhiều router: routers = { R1: { connected:['10.0.1.0/24'], routes:[{ net:'10.0.2.0/24', via:'R2' }] } };
 *  gói bắt đầu ở start với ttl cho trước. Mỗi router giảm TTL (về 0 ⇒ 'ttl-expired'), tra tuyến khớp dài nhất (mạng nối trực tiếp tính như tuyến). Trả { path, result, at }. */
export function routePacket(routers, start, dst, ttl) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var d = toInt(dst), cur = start, path = [];
  for (;;) {
    path.push(cur);
    ttl--;
    if (ttl <= 0) return { path: path, result: 'ttl-expired', at: cur };
    var r = routers[cur], best = null, bestLen = -1, i, c;
    var all = r.connected.map(function (n) { return { net: n, via: null }; }).concat(r.routes);
    for (i = 0; i < all.length; i++) {
      c = all[i].net.split('/');
      var len = +c[1], m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0;
      if (((d & m) >>> 0) === ((toInt(c[0]) & m) >>> 0) && len > bestLen) { best = all[i]; bestLen = len; }
    }
    if (!best) return { path: path, result: 'unreachable', at: cur };
    if (best.via === null) return { path: path, result: 'delivered', at: cur };
    cur = best.via;
  }
}

/* ─────────── Chương 1 · 2 · 9 · 16 (thêm 28/11/2026): chẩn đoán máy trạm, phiên IOS, soát cấu hình, mạng nhỏ ─────────── */
/** Chẩn đoán theo thứ tự lệnh của bài 1.3: h = { inet:'192.168.1.10/24'|null, gateway:'192.168.1.1'|null, pingGateway, pingIp, pingName }.
 *  Trả 'no-address' · 'dhcp-failed' · 'no-gateway' · 'gateway-not-local' · 'lan' · 'upstream' · 'dns' · 'application'. */
export function diagnoseHost(h) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  // Step 1 — ip addr show: is there an address at all, and is it a self-assigned 169.254.x.x (DHCP never answered)?
  if (!h.inet) return 'no-address';
  var parts = h.inet.split('/'), ip = parts[0], len = +parts[1];
  if (ip.indexOf('169.254.') === 0) return 'dhcp-failed';
  // Step 2 — ip route show: is there a "default via", and is that gateway INSIDE my own network (the AND test)?
  if (!h.gateway) return 'no-gateway';
  var m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0;
  if (((toInt(ip) & m) >>> 0) !== ((toInt(h.gateway) & m) >>> 0)) return 'gateway-not-local';
  // Steps 3, 4, 5 — ping the gateway, ping an ADDRESS on the Internet, and only then ping a NAME.
  if (!h.pingGateway) return 'lan';
  if (!h.pingIp) return 'upstream';
  if (!h.pingName) return 'dns';
  return 'application';
}
/** Mô phỏng một phiên CLI Cisco IOS (tập lệnh rút gọn của Chương 2): trả { prompt, rejected:[chỉ số lệnh bị từ chối], loggedOut }. */
export function iosSession(hostname, cmds) {
  var name = hostname, mode = 'user', rejected = [], i;
  var GLOBAL = /^(enable secret|enable password|service password-encryption|banner motd|no ip domain-lookup|ip domain-name|ip default-gateway|username|crypto key generate rsa)\b/;
  var LINE = /^(password|login|login local|transport input|logging synchronous|exec-timeout)\b/;
  var IFACE = /^(ip address|no shutdown|shutdown|description)\b/;
  var PRIV_ONLY = /^(show (running-config|run|startup-config|start)\b|copy |erase |reload\b)/;
  for (i = 0; i < cmds.length; i++) {
    var c = String(cmds[i]).trim().replace(/\s+/g, ' '), low = c.toLowerCase(), ok = true;
    var exec = mode === 'user' || mode === 'priv';
    if (low === 'enable' || low === 'en') { if (mode === 'user') mode = 'priv'; else if (!exec) ok = false; }
    else if (low === 'disable') { if (mode === 'priv') mode = 'user'; else if (!exec) ok = false; }
    else if (low === 'configure terminal' || low === 'conf t') { if (mode === 'priv') mode = 'config'; else ok = false; }
    else if (low === 'exit') {
      if (exec) return { prompt: null, rejected: rejected, loggedOut: true }; // exit from an EXEC mode ends the session
      mode = mode === 'config' ? 'priv' : 'config';
    }
    else if (low === 'end') { if (exec) ok = false; else mode = 'priv'; }
    else if (/^(line (console|con) 0|line vty \d+ \d+)$/.test(low)) { if (exec) ok = false; else mode = 'config-line'; }
    else if (/^(interface|int) \S+/.test(low)) { if (exec) ok = false; else mode = 'config-if'; }
    else if (/^hostname \S+$/.test(low)) { if (mode === 'config') name = c.split(' ')[1]; else ok = false; }
    else if (/^do (show|ping|copy)\b/.test(low)) { if (exec) ok = false; }
    else if (/^(show|ping)\b/.test(low) || /^(copy|erase|reload)\b/.test(low)) {
      if (!exec) ok = false;                                       // an EXEC command in a configuration mode
      else if (mode === 'user' && PRIV_ONLY.test(low)) ok = false; // show run, copy, erase, reload need privileged EXEC
    }
    else if (GLOBAL.test(low)) { if (mode !== 'config') ok = false; }
    else if (LINE.test(low)) { if (mode !== 'config-line') ok = false; }
    else if (IFACE.test(low)) { if (mode !== 'config-if') ok = false; }
    else ok = false;
    if (!ok) rejected.push(i);
  }
  var suffix = { user: '>', priv: '#', config: '(config)#', 'config-line': '(config-line)#', 'config-if': '(config-if)#' }[mode];
  return { prompt: name + suffix, rejected: rejected, loggedOut: false };
}
/** Soát bảo mật một đoạn running-config của switch có 16 dòng vty (0–15). Trả các mã phát hiện theo thứ tự nghiêm trọng cố định. */
export function auditSwitch(text) {
  var lines = String(text).split('\n'), sec = null, con = null, vtys = [], top = [], i;
  for (i = 0; i < lines.length; i++) {
    var raw = lines[i].replace(/\s+$/, '');
    if (!raw || raw.charAt(0) === '!') { sec = null; continue; }
    if (/^\s/.test(raw)) { if (sec) sec.sub.push(raw.trim().toLowerCase()); continue; }
    var t = raw.trim().toLowerCase(), mv = /^line vty (\d+) (\d+)$/.exec(t);
    top.push(t); sec = null;
    if (/^line (console|con) 0$/.test(t)) { con = { sub: [] }; sec = con; }
    else if (mv) { sec = { from: +mv[1], to: +mv[2], sub: [] }; vtys.push(sec); }
  }
  function has(arr, re) { for (var k = 0; k < arr.length; k++) if (re.test(arr[k])) return true; return false; }
  var out = [];
  if (!con || !has(con.sub, /^login( local)?$/)) out.push('console-no-login');
  if (vtys.some(function (v) { return !has(v.sub, /^login( local)?$/); })) out.push('vty-no-login');
  if (has(top, /^enable password /)) out.push('enable-password');
  if (!has(top, /^enable secret /)) out.push('no-enable-secret');
  if (!vtys.length || vtys.some(function (v) { return !has(v.sub, /^transport input ssh$/); })) out.push('telnet-allowed');
  var covered = {};
  vtys.forEach(function (v) { for (var n = v.from; n <= v.to; n++) covered[n] = true; });
  for (i = 0; i <= 15; i++) if (!covered[i]) { out.push('vty-partial'); break; }
  if (!has(top, /^service password-encryption$/)) out.push('no-password-encryption');
  if (!has(top, /^banner motd /)) out.push('no-banner');
  return out;
}
/** Máy trạm gửi tới `target` thế nào: host = { ip, prefix, gateway|null }. Trả 'local' · 'via-gateway' · 'no-gateway' · 'gateway-not-local'. */
export function hostReach(host, target) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var m = host.prefix === 0 ? 0 : (0xFFFFFFFF << (32 - host.prefix)) >>> 0;
  var mine = (toInt(host.ip) & m) >>> 0;
  if (((toInt(target) & m) >>> 0) === mine) return 'local';                    // same network by MY OWN mask: ARP for the target itself
  if (!host.gateway) return 'no-gateway';
  if (((toInt(host.gateway) & m) >>> 0) !== mine) return 'gateway-not-local'; // it would need a gateway to reach its gateway: no frame is built
  return 'via-gateway';
}
/** Lab 2.1 (một subnet: PC-A, S1, R1; R1 ra Internet): net = { 'PC-A':{ip,prefix,gw}, S1:{ip,prefix,gw,up}, R1:{ip,prefix,up} }.
 *  labPing(net, from, to) với from ∈ {PC-A,S1}, to ∈ {PC-A,S1,R1,INTERNET} ⇒ 'ok' · 'source-down' · 'no-gateway' · 'gateway-not-local' · 'no-reply'. */
export function labPing(net, from, to) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function same(a, b, len) { var m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0; return ((toInt(a) & m) >>> 0) === ((toInt(b) & m) >>> 0); }
  function isUp(name) { return !!net[name] && net[name].up !== false; }
  function byIp(ip) { for (var k in net) if (net[k].ip === ip) return k; return null; }
  var R = net.R1, src = net[from];
  if (!isUp(from)) return 'source-down';                       // a shut SVI: the switch has no IP presence at all
  var dstIp = to === 'INTERNET' ? '8.8.8.8' : net[to].ip;
  // Forward path, decided by the SENDER with its OWN mask.
  if (same(src.ip, dstIp, src.prefix)) {
    var nb = byIp(dstIp);
    if (!nb || !isUp(nb)) return 'no-reply';                    // ARP for the target gets no answer
  } else {
    if (!src.gw) return 'no-gateway';
    if (!same(src.ip, src.gw, src.prefix)) return 'gateway-not-local';
    if (byIp(src.gw) !== 'R1' || !isUp('R1')) return 'no-reply'; // ARP for the gateway gets no answer
    if (to !== 'INTERNET' && (!same(R.ip, dstIp, R.prefix) || !isUp(to))) return 'no-reply';
  }
  // Return path: the replier decides with ITS own mask; the Internet's reply comes back through R1.
  if (to === 'INTERNET' || to === 'R1') return same(R.ip, src.ip, R.prefix) ? 'ok' : 'no-reply';
  var back = net[to];
  if (same(back.ip, src.ip, back.prefix)) return 'ok';
  if (!back.gw || !same(back.ip, back.gw, back.prefix) || byIp(back.gw) !== 'R1' || !isUp('R1')) return 'no-reply';
  return same(R.ip, src.ip, R.prefix) ? 'ok' : 'no-reply';
}
/** Đọc kết xuất `show ip interface brief` ⇒ [{ iface, verdict }] với verdict 'ok' · 'admin-down' · 'layer1' · 'layer2'. */
export function ifaceVerdicts(text) {
  var out = [], lines = String(text).split('\n');
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    if (!l || /^Interface\s/.test(l)) continue;
    var tk = l.split(/\s+/), v;
    if (/administratively down/.test(l)) v = 'admin-down';                 // somebody typed shutdown: a decision, not a fault
    else {
      var st = tk[tk.length - 2], pr = tk[tk.length - 1];                   // Status = layer 1, Protocol = layer 2
      v = st === 'up' && pr === 'up' ? 'ok' : st === 'up' ? 'layer2' : 'layer1';
    }
    out.push({ iface: tk[0], verdict: v });
  }
  return out;
}
/** SSH trên IOS còn thiếu gì: dev = { hostname, domain, rsaBits, sshVersion, users:[…], vtyLogin:'local'|'line'|null, vtyTransport:'ssh'|'all'|'telnet'|null }. */
export function sshMissing(dev) {
  var out = [];
  if (!dev.hostname || dev.hostname === 'Router' || dev.hostname === 'Switch') out.push('hostname');
  if (!dev.domain) out.push('domain-name');
  if (!dev.rsaBits) out.push('rsa-key'); else if (dev.rsaBits < 2048) out.push('rsa-key-weak');
  if (dev.sshVersion !== 2) out.push('ssh-version-2');
  if (!dev.users || !dev.users.length) out.push('username');
  if (dev.vtyLogin !== 'local') out.push('login-local');
  if (dev.vtyTransport !== 'ssh') out.push('transport-ssh');
  return out;
}
/** Đếm cổng switch cho văn phòng nhỏ: s = { users, printers, phones, cameras, aps, uplinks, phonePassThrough }.
 *  Điện thoại IP có cổng PC đi xuyên ⇒ PC cắm sau điện thoại, cặp đó tốn MỘT cổng; điện thoại dư (không có PC đi kèm) vẫn tốn cổng riêng.
 *  Trả { ports, size } (size: 8/16/24/48, hoặc null nếu > 48 — phải nhiều switch). */
export function portsNeeded(s) {
  var phonePorts = s.phonePassThrough ? Math.max(0, s.phones - s.users) : s.phones;
  var ports = s.users + phonePorts + s.printers + s.cameras + s.aps + s.uplinks;
  var sizes = [8, 16, 24, 48], size = null;
  for (var i = 0; i < sizes.length; i++) if (sizes[i] >= ports) { size = sizes[i]; break; }
  return { ports: ports, size: size };
}
/** Đọc một dòng kết quả thăm dò (Chương 16): mã của `curl -s -o /dev/null -w "%{http_code}"` hoặc một dòng của `nc -vz`.
 *  Trả 'reachable' · 'not-mounted' · 'server-error' · 'client-error' · 'no-answer' · 'listening' · 'refused' · 'filtered'. */
export function probeVerdict(line) {
  var l = String(line).trim();
  if (/^\d{3}$/.test(l)) {
    var n = +l;
    if (n === 0) return 'no-answer';                          // curl prints 000 when no HTTP response came back at all
    if (n === 404) return 'not-mounted';                      // the server answered: nothing is mounted at that path
    if (n >= 500) return 'server-error';                      // the server answered and then failed
    if (n < 400 || n === 401 || n === 403) return 'reachable'; // 2xx/3xx, and 401/403: the path works, auth is a separate question
    return 'client-error';
  }
  if (/succeeded|open$/i.test(l)) return 'listening';
  if (/refused/i.test(l)) return 'refused';                   // the machine answered at once: nothing listens on that port
  if (/timed out|timeout/i.test(l)) return 'filtered';        // nobody answered: something swallowed the packet
  return 'no-answer';
}
