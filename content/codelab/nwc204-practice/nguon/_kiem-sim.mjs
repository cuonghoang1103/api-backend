/** Kiểm bộ mô phỏng với ví dụ sách/RFC: node content/codelab/nwc204-practice/nguon/_kiem-sim.mjs */
import assert from 'node:assert/strict';
import * as S from './_sim.mjs';

// Subnet cổ điển: 192.168.10.77/26 → mạng .64, broadcast .127, 62 host
const a = S.ipInfo('192.168.10.77', 26);
assert.deepEqual([a.network, a.broadcast, a.firstHost, a.lastHost, a.hosts, a.mask, a.wildcard], ['192.168.10.64', '192.168.10.127', '192.168.10.65', '192.168.10.126', 62, '255.255.255.192', '0.0.0.63']);
assert.equal(S.ipInfo('10.1.2.3', 8).broadcast, '10.255.255.255');
assert.equal(S.ipInfo('172.16.5.9', 20).hosts, 4094);
assert.equal(S.ipInfo('10.0.0.1', 30).lastHost, '10.0.0.2');
assert.equal(S.ipInfo('10.0.0.0', 31).hosts, 2);
// chia /24 thành /26: 4 mạng, 62 host
assert.deepEqual(S.splitSubnets('192.168.1.0', 24, 26).map((x) => x.network), ['192.168.1.0', '192.168.1.64', '192.168.1.128', '192.168.1.192']);
assert.deepEqual(S.borrowBits(24, 5), { borrowed: 3, newPrefix: 27, hostsPerSubnet: 30 });
// VLSM giáo trình: 192.168.1.0/24 với 100, 50, 25, 2 host
const v = S.vlsm('192.168.1.0', 24, [{ name: 'A', hosts: 50 }, { name: 'B', hosts: 100 }, { name: 'C', hosts: 2 }, { name: 'D', hosts: 25 }]);
assert.deepEqual(v.map((x) => x.name + ' ' + x.network + '/' + x.prefix), ['B 192.168.1.0/25', 'A 192.168.1.128/26', 'D 192.168.1.192/27', 'C 192.168.1.224/30']);
assert.equal(S.vlsm('192.168.1.0', 24, [{ name: 'a', hosts: 200 }, { name: 'b', hosts: 100 }]), null);
// tóm tắt: 192.168.0.0/24..192.168.3.0/24 → 192.168.0.0/22
assert.equal(S.summarize(['192.168.0.0/24', '192.168.1.0/24', '192.168.2.0/24', '192.168.3.0/24']), '192.168.0.0/22');
assert.equal(S.summarize(['10.1.0.0/16', '10.2.0.0/16']), '10.0.0.0/14');
assert.equal(S.ipClass('172.20.1.1'), 'B'); assert.equal(S.ipKind('172.32.0.1'), 'public'); assert.equal(S.ipKind('172.31.255.1'), 'private');
assert.equal(S.sameNetwork('192.168.1.130', '192.168.1.190', 26), true); assert.equal(S.sameNetwork('192.168.1.130', '192.168.1.200', 26), false);
// LPM
const rt = [{ net: '0.0.0.0/0', nh: 'D' }, { net: '10.0.0.0/8', nh: 'A' }, { net: '10.1.0.0/16', nh: 'B' }, { net: '10.1.2.0/24', nh: 'C' }];
assert.equal(S.lpm(rt, '10.1.2.9').nh, 'C'); assert.equal(S.lpm(rt, '10.1.9.9').nh, 'B'); assert.equal(S.lpm(rt, '10.9.9.9').nh, 'A'); assert.equal(S.lpm(rt, '8.8.8.8').nh, 'D');
assert.equal(S.lpm([{ net: '10.0.0.0/8', nh: 'A' }], '8.8.8.8'), null);
// phân mảnh (sách Kurose): 4000 B, MTU 1500 → 1480,1480,1020; offset 0,185,370
assert.deepEqual(S.fragment(4000, 1500), [{ offset: 0, dataLen: 1480, mf: 1 }, { offset: 185, dataLen: 1480, mf: 1 }, { offset: 370, dataLen: 1020, mf: 0 }]);
// IPv6 (Wikipedia)
assert.equal(S.ipv6Compress('2001:0db8:0000:0000:0000:ff00:0042:8329'), '2001:db8::ff00:42:8329');
assert.equal(S.ipv6Compress('2001:0db8:0000:0001:0000:0000:0000:0001'), '2001:db8:0:1::1');
assert.equal(S.ipv6Compress('0000:0000:0000:0000:0000:0000:0000:0001'), '::1');
assert.equal(S.ipv6Compress('2001:db8:0:0:1:0:0:1'), '2001:db8::1:0:0:1');
assert.equal(S.ipv6Compress('2001:db8:0:1:1:1:1:1'), '2001:db8:0:1:1:1:1:1');
assert.equal(S.ipv6Expand('2001:db8::ff00:42:8329'), '2001:0db8:0000:0000:0000:ff00:0042:8329');
assert.equal(S.ipv6Expand('::1'), '0000:0000:0000:0000:0000:0000:0000:0001');
assert.equal(S.eui64('00:1A:2B:3C:4D:5E'), '21a:2bff:fe3c:4d5e');
assert.equal(S.ipv6Subnet64('2001:db8:acad::', 5), '2001:db8:acad:5::/64');
// CRC (sách Forouzan/Kurose): 1101011011, G=10011 → 1110
assert.equal(S.crcBits('1101011011', '10011'), '1110');
assert.equal(S.evenParity('1011001'), '0'); assert.equal(S.evenParity('1011000'), '1');
// MAC table
const m = S.macSwitch([{ src: 'A', dst: 'B', in: 1 }, { src: 'B', dst: 'A', in: 2 }, { src: 'A', dst: 'B', in: 1 }, { src: 'C', dst: 'ff:ff:ff:ff:ff:ff', in: 3 }, { src: 'D', dst: 'A', in: 1 }]);
assert.deepEqual(m.actions, ['flood', 'port 1', 'port 2', 'flood', 'filter']);
// VLAN
const ports = { 1: { mode: 'access', vlan: 10 }, 2: { mode: 'access', vlan: 10 }, 3: { mode: 'access', vlan: 20 }, 4: { mode: 'trunk', allowed: [10, 20], native: 1 } };
const vs = S.vlanSwitch(ports, [{ src: 'A', dst: 'ff:ff:ff:ff:ff:ff', in: 1 }, { src: 'C', dst: 'ff:ff:ff:ff:ff:ff', in: 3 }, { src: 'B', dst: 'A', in: 2 }]);
assert.deepEqual(vs.out, [['2', '4(tag 10)'], ['4(tag 20)'], ['1']]);
// TCP
const t = S.tcpTrace(1000, 5000, [100, 200]);
assert.deepEqual([t[0].seq, t[1].seq, t[1].ack, t[2].seq, t[2].ack], [1000, 5000, 1001, 1001, 5001]);
assert.deepEqual([t[3].seq, t[3].len, t[4].ack, t[5].seq, t[6].ack], [1001, 100, 1101, 1101, 1301]);
assert.equal(t.length, 3 + 4 + 4);
// cửa sổ trượt
assert.deepEqual(S.windowSim(8, 4, [], 'gbn'), { rounds: 2, transmissions: 8 });
assert.deepEqual(S.windowSim(8, 4, [1], 'gbn'), { rounds: 3, transmissions: 11 });
assert.deepEqual(S.windowSim(8, 4, [1], 'sr'), { rounds: 3, transmissions: 9 });
// hai đoạn mất cùng cửa sổ: đoạn 2 đã dùng hết lần mất của nó ở vòng đầu ⇒ vòng 2 không mất lại
assert.deepEqual(S.windowSim(8, 4, [1, 2], 'gbn'), { rounds: 3, transmissions: 11 });
assert.deepEqual(S.cwndTrace(8, 8, [5]), [1, 2, 4, 8, 9, 1, 2, 4]);
assert.deepEqual(S.traceroute(['10.0.0.1', '10.0.1.1', '8.8.8.8'], [1], 8), ['1 10.0.0.1', '2 *', '3 8.8.8.8']);
// ACL
const r = S.aclRun(['access-list 101 deny tcp 192.168.10.0 0.0.0.255 any eq 23', 'access-list 101 permit ip any any'], [{ proto: 'tcp', src: '192.168.10.5', dst: '8.8.8.8', dport: 23 }, { proto: 'tcp', src: '192.168.10.5', dst: '8.8.8.8', dport: 80 }, { proto: 'tcp', src: '192.168.11.5', dst: '8.8.8.8', dport: 23 }]);
assert.deepEqual(r, [{ action: 'deny', rule: 1 }, { action: 'permit', rule: 2 }, { action: 'permit', rule: 2 }]);
assert.deepEqual(S.aclRun(['access-list 10 permit 192.168.1.0 0.0.0.255'], [{ proto: 'ip', src: '192.168.2.1', dst: '1.1.1.1' }]), [{ action: 'deny', rule: 0 }]);
// NAT
assert.deepEqual(S.patSim('203.0.113.1', 50000, [{ ip: '10.0.0.1', port: 1111, proto: 'tcp' }, { ip: '10.0.0.2', port: 1111, proto: 'tcp' }, { ip: '10.0.0.1', port: 1111, proto: 'tcp' }]), ['203.0.113.1:50000', '203.0.113.1:50001', '203.0.113.1:50000']);
assert.deepEqual(S.poolNat(['P1', 'P2'], [['open', 'a'], ['open', 'b'], ['open', 'c'], ['close', 'a'], ['open', 'c']]), ['P1', 'P2', null, 'P1']);
// bộ định tuyến
const net = { R1: { connected: ['10.0.1.0/24'], routes: [{ net: '0.0.0.0/0', via: 'R2' }] }, R2: { connected: ['10.0.2.0/24'], routes: [{ net: '10.0.1.0/24', via: 'R1' }, { net: '10.0.3.0/24', via: 'R3' }] }, R3: { connected: ['10.0.3.0/24'], routes: [] } };
assert.deepEqual(S.routePacket(net, 'R1', '10.0.3.7', 8), { path: ['R1', 'R2', 'R3'], result: 'delivered', at: 'R3' });
assert.equal(S.routePacket(net, 'R1', '10.0.3.7', 2).result, 'ttl-expired');
assert.equal(S.routePacket(net, 'R3', '10.0.9.9', 8).result, 'unreachable');
// Chương 1 — bảng quyết định của bài 1.3
assert.equal(S.diagnoseHost({ inet: null }), 'no-address');
assert.equal(S.diagnoseHost({ inet: '169.254.20.7/16', gateway: null }), 'dhcp-failed');
assert.equal(S.diagnoseHost({ inet: '192.168.1.10/24', gateway: null }), 'no-gateway');
assert.equal(S.diagnoseHost({ inet: '192.168.1.10/24', gateway: '192.168.2.1' }), 'gateway-not-local');
assert.equal(S.diagnoseHost({ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: false }), 'lan');
assert.equal(S.diagnoseHost({ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: true, pingIp: true, pingName: false }), 'dns');
// Chương 2 — ví dụ mẫu bài 2.1 và bẫy exit (từ config-if, lần exit THỨ BA là đăng xuất)
assert.deepEqual(S.iosSession('Switch', ['enable', 'configure terminal', 'hostname S1', 'line console 0', 'exit', 'end']), { prompt: 'S1#', rejected: [], loggedOut: false });
assert.deepEqual(S.iosSession('S1', ['en', 'conf t', 'interface vlan 1', 'show ip interface brief', 'do show ip interface brief']), { prompt: 'S1(config-if)#', rejected: [3], loggedOut: false });
assert.equal(S.iosSession('S1', ['enable', 'conf t', 'int fa0/1', 'exit', 'exit', 'exit']).loggedOut, true);
assert.deepEqual(S.iosSession('S1', ['show running-config', 'enable', 'hostname X']).rejected, [0, 2]);
// Chương 2 — cấu hình của bài tập 2.2 (a)
assert.deepEqual(S.auditSwitch('hostname SW\nenable password cisco\nline console 0\n password cisco\nline vty 0 4\n password cisco\n login\n transport input all'), ['console-no-login', 'enable-password', 'no-enable-secret', 'telnet-allowed', 'vty-partial', 'no-password-encryption', 'no-banner']);
assert.deepEqual(S.auditSwitch('hostname S1\nenable secret 5 $1$x\nservice password-encryption\nbanner motd ^Authorised only^\nline console 0\n password 7 0822\n login\nline vty 0 15\n login local\n transport input ssh'), []);
// Chương 2 bài tập 2.3 (b) và Lab 2.1 thí nghiệm 3–4
const pc = { ip: '10.10.5.40', prefix: 24, gateway: '10.10.6.1' };
assert.deepEqual(['10.10.5.1', '10.10.6.1', '8.8.8.8'].map((t) => S.hostReach(pc, t)), ['local', 'gateway-not-local', 'gateway-not-local']);
assert.equal(S.hostReach({ ip: '192.168.10.3', prefix: 16, gateway: '192.168.10.1' }, '192.168.10.1'), 'local');
assert.equal(S.hostReach({ ip: '192.168.10.3', prefix: 24, gateway: '192.168.10.1' }, '8.8.8.8'), 'via-gateway');
// Lab 2.1 — sáu thí nghiệm "làm hỏng có chủ đích" của bài 9.3
const lab = () => ({ 'PC-A': { ip: '192.168.10.3', prefix: 24, gw: '192.168.10.1' }, S1: { ip: '192.168.10.2', prefix: 24, gw: '192.168.10.1', up: true }, R1: { ip: '192.168.10.1', prefix: 24, up: true } });
const tat = ['R1', 'S1', 'INTERNET'];
assert.deepEqual(tat.map((t) => S.labPing(lab(), 'PC-A', t)), ['ok', 'ok', 'ok']);
let L2 = lab(); L2.R1.up = false;                     // 1. shut R1 G0/0/0
assert.deepEqual(tat.map((t) => S.labPing(L2, 'PC-A', t)), ['no-reply', 'ok', 'no-reply']);
L2 = lab(); L2.S1.gw = null;                          // 2. bỏ ip default-gateway của S1: trong subnet vẫn chạy
assert.deepEqual([S.labPing(L2, 'S1', 'PC-A'), S.labPing(L2, 'S1', 'R1'), S.labPing(L2, 'S1', 'INTERNET'), S.labPing(L2, 'PC-A', 'S1')], ['ok', 'ok', 'no-gateway', 'ok']);
L2 = lab(); L2['PC-A'].prefix = 16;                   // 3. sai mặt nạ /16: vẫn tới R1
assert.deepEqual(tat.map((t) => S.labPing(L2, 'PC-A', t)), ['ok', 'ok', 'ok']);
L2 = lab(); L2['PC-A'].gw = '192.168.11.1';           // 4. gateway ngoài subnet
assert.deepEqual(tat.map((t) => S.labPing(L2, 'PC-A', t)), ['ok', 'ok', 'gateway-not-local']);
L2 = lab(); L2.S1.up = false;                         // SVI chưa no shutdown
assert.deepEqual([S.labPing(L2, 'PC-A', 'S1'), S.labPing(L2, 'S1', 'R1')], ['no-reply', 'source-down']);
// Chương 2 bài 2.4 — ba dòng, ba chẩn đoán
assert.deepEqual(S.ifaceVerdicts('Interface IP-Address OK? Method Status Protocol\nVlan1 192.168.1.2 YES manual up up\nFa0/2 unassigned YES unset down down\nFa0/3 unassigned YES unset administratively down down\nSe0/0/0 10.0.0.1 YES manual up down'), [{ iface: 'Vlan1', verdict: 'ok' }, { iface: 'Fa0/2', verdict: 'layer1' }, { iface: 'Fa0/3', verdict: 'admin-down' }, { iface: 'Se0/0/0', verdict: 'layer2' }]);
// Chương 9 — năm điều kiện SSH + login local + transport input ssh
assert.deepEqual(S.sshMissing({ hostname: 'Router', domain: null, rsaBits: 0, sshVersion: 1, users: [], vtyLogin: 'line', vtyTransport: 'all' }), ['hostname', 'domain-name', 'rsa-key', 'ssh-version-2', 'username', 'login-local', 'transport-ssh']);
assert.deepEqual(S.sshMissing({ hostname: 'R1', domain: 'lab.local', rsaBits: 2048, sshVersion: 2, users: ['admin'], vtyLogin: 'local', vtyTransport: 'ssh' }), []);
// Chương 16 — đếm cổng và đọc kết quả thăm dò
assert.deepEqual(S.portsNeeded({ users: 25, printers: 1, phones: 3, cameras: 1, aps: 0, uplinks: 1, phonePassThrough: false }), { ports: 31, size: 48 });
assert.deepEqual(S.portsNeeded({ users: 25, printers: 1, phones: 3, cameras: 1, aps: 0, uplinks: 1, phonePassThrough: true }), { ports: 28, size: 48 });
assert.deepEqual(S.portsNeeded({ users: 12, printers: 1, phones: 0, cameras: 0, aps: 1, uplinks: 1, phonePassThrough: false }), { ports: 15, size: 16 });
assert.deepEqual(['200', '401', '404', '502', '000', 'Connection to 127.0.0.1 22 port [tcp/ssh] succeeded!', 'nc: connect to 127.0.0.1 port 9 (tcp) failed: Connection refused', 'nc: connect to 10.0.0.5 port 22 (tcp) failed: Connection timed out'].map(S.probeVerdict), ['reachable', 'reachable', 'not-mounted', 'server-error', 'no-answer', 'listening', 'refused', 'filtered']);
console.log('✓ _sim.mjs: mọi phép kiểm qua');
