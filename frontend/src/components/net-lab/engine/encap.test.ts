/**
 * encap: giải mã lại frame thật và so với tshark (capture v2, MAC cố định).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/encap.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HELLO_BYTES, HOP_FIELDS, BIG, BIG_FRAMES_OFF, BIG_FRAME_TSO } from './capture';
import { LAYER_RANGE, WEB_BYTES, cutResponse, decode, encapSteps, hopFields, ipChecksum, superFrame, tcpPseudoSum, u16, u32 } from './encap';

const f = (id: string) => decode().find((x) => x.id === id)!.value;

describe('the real 149-byte frame', () => {
  it('is 14 + 20 + 32 + 83 bytes', () => {
    assert.equal(HELLO_BYTES.length, 149);
    const sizes = Object.values(LAYER_RANGE).map(([a, b]) => b - a);
    assert.deepEqual(sizes, [14, 20, 32, 83]);
    assert.equal(u16(HELLO_BYTES, 16), 135);
  });
  it('decodes to the tshark fields', () => {
    const C = HOP_FIELDS.client;
    assert.equal(f('eth.src'), C.ethSrc); assert.equal(f('eth.dst'), C.ethDst);
    assert.equal(f('ip.ttl'), String(C.ttl)); assert.equal(f('ip.sum'), '0x3c52');
    assert.equal(f('ip.src'), C.ipSrc); assert.equal(f('ip.dst'), C.ipDst);
    assert.equal(f('tcp.sport'), String(C.srcPort)); assert.equal(f('tcp.dport'), '80');
    assert.equal(u32(HELLO_BYTES, 38), C.seqRaw); assert.equal(u32(HELLO_BYTES, 42), C.ackRaw);
    assert.match(f('tcp.flags'), /^32 B · ACK,PSH$/);
    assert.equal(f('http'), '"GET /api/hello HTTP/1.1"');
  });
  it('the captured IP checksum is correct; the TCP one is only the pseudo-header sum (checksum offload)', () => {
    assert.equal(ipChecksum(HELLO_BYTES), 0x3c52);
    assert.equal(u16(HELLO_BYTES, 50), 0x17a1);
    assert.equal(tcpPseudoSum(HELLO_BYTES), 0x17a1);
  });
});

describe('hop: rebuilding the far side from the near side', () => {
  it('gives exactly what tshark measured behind the router (0x3d52, TTL 63)', () => {
    assert.equal(ipChecksum(WEB_BYTES), 0x3d52);
    assert.equal(u16(WEB_BYTES, 24), HOP_FIELDS.web.ipChecksum);
    assert.equal(WEB_BYTES[22], 63);
    const H = hopFields();
    assert.deepEqual(H.filter((x) => x.changes).map((x) => x.id), ['eth.dst', 'eth.src', 'ip.ttl', 'ip.sum']);
    assert.equal(H.find((x) => x.id === 'eth.dst')!.web, HOP_FIELDS.web.ethDst);
    assert.equal(H.find((x) => x.id === 'eth.src')!.web, HOP_FIELDS.web.ethSrc);
  });
});

describe('steps', () => {
  it('go down the client stack, through the router and up to nginx', () => {
    const S = encapSteps();
    assert.deepEqual(S.slice(0, 5).map((s) => s.have.length), [0, 1, 2, 3, 4]);
    assert.equal(S.at(-1)!.side, 'web'); assert.deepEqual(S.at(-1)!.have, ['http']);
  });
});

describe('mtu', () => {
  it('MTU 1500 (measured): 1448 + 1448 + 1095 in frames 1514, 1514, 1161', () => {
    const c = cutResponse(BIG.response, 1500);
    assert.equal(c.mss, 1460); assert.equal(c.perSeg, 1448);
    assert.deepEqual(c.segs, [1448, 1448, 1095]);
    assert.deepEqual(c.frames, [...BIG_FRAMES_OFF]);
  });
  it('TSO on: one 4057-byte super-frame, as captured', () => assert.equal(superFrame(BIG.response), BIG_FRAME_TSO));
  it('computed: 1420 (WireGuard) and 9000 (jumbo)', () => {
    assert.deepEqual(cutResponse(BIG.response, 1420).segs, [1368, 1368, 1255]);
    assert.deepEqual(cutResponse(BIG.response, 9000).segs, [3991]);
  });
});
