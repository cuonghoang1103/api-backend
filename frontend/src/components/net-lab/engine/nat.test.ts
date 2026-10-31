/**
 * nat: MASQUERADE + conntrack tái tạo đúng ba dòng conntrack thật và hai phía tcpdump của homegw (c23-homegw).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/nat.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CGNAT_CONNTRACK, NAT_LAN_SYN, NAT_SEEN, NAT_WAN_SYN } from './capture2';
import { PUB, REAL_ROWS, homeScript, inboundScript, masquerade, parseConntrack, unNat, type CtRow } from './nat';

const tcpq = (l: string) => { const m = l.match(/^IP (\S+)\.(\d+) > (\S+)\.(\d+):/)!; return { src: m[1], sport: Number(m[2]), dst: m[3], dport: Number(m[4]) }; };

describe('masquerade', () => {
  it('rewrites only the phone’s 41000 (→ 4734, the kernel’s choice in the lab) — same rows as the real conntrack', () => {
    const rows: CtRow[] = [];
    for (const [k, l] of NAT_LAN_SYN.entries()) {
      const r = masquerade(rows, tcpq(l), k === 2 ? 'phone' : 'laptop');
      rows.push(r.row);
      assert.equal(r.collided, k === 2);
      const wan = tcpq(NAT_WAN_SYN[k]);
      assert.equal(r.row.reply.dst, PUB); assert.equal(wan.src, PUB);
      assert.equal(r.row.reply.dport, wan.sport, `wan side of SYN ${k}`);
    }
    const key = (x: { orig: object; reply: object }) => JSON.stringify([x.orig, x.reply]);
    assert.deepEqual(rows.map(key).sort(), REAL_ROWS.map(key).sort());
    assert.equal(NAT_SEEN.phone41000, `you came from ${PUB} port 4734`);
  });
  it('answers are reversed by the reply tuple', () => {
    const rows = REAL_ROWS.map((r) => ({ ...r, who: '' }));
    assert.equal(unNat(rows, { src: '203.0.113.10', sport: 80, dst: PUB, dport: 4734 })!.dst, '192.168.50.11');
    assert.equal(unNat(rows, { src: '203.0.113.10', sport: 80, dst: PUB, dport: 41000 })!.dst, '192.168.50.10');
    assert.equal(unNat(rows, { src: '203.0.113.10', sport: 80, dst: PUB, dport: 8080 }), undefined, 'new inbound connection: nothing to reverse');
  });
  it('CGNAT row on isp keeps the port and swaps 100.64.0.10 for 198.51.100.200', () => {
    const r = parseConntrack(CGNAT_CONNTRACK[0]);
    const m = masquerade([], r.orig, 'mobile', 4734, '198.51.100.200');
    assert.deepEqual(m.row.reply, r.reply);
  });
  it('scripts: home ends with 3 rows and the collision; inbound succeeds only with DNAT', () => {
    const h = homeScript();
    assert.equal(h.at(-1)!.rows.length, 3);
    assert.ok(h.some((s) => s.collided));
    assert.equal(inboundScript(false).at(-1)!.phase, 'refused');
    assert.equal(inboundScript(true).at(-1)!.phase, 'ok');
  });
});
