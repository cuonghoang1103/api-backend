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
console.log('✓ _sim.mjs: mọi phép kiểm qua');
