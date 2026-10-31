/**
 * socket: tra socket theo bộ 4, bind, cổng tạm (tính từ mặc định của nhân).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/socket.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EPH_MAX_RATE, EPH_PORTS, TAB1, TAB2, WEB80, bindResult, demuxScript, ephemeralAt, lookup, ssLines } from './socket';

describe('demux', () => {
  const S = demuxScript();
  it('ends with one LISTEN and three ESTAB sockets, all on local port 80', () => {
    const end = S.at(-1)!.socks;
    assert.equal(end.filter((k) => k.state === 'LISTEN').length, 1);
    assert.equal(end.filter((k) => k.state === 'ESTAB').length, 3);
    assert.ok(end.every((k) => k.local.endsWith(':80')));
  });
  it('a SYN goes to the listener, data goes to the exact 4-tuple, a stray segment gets RST', () => {
    assert.equal(S.find((s) => s.seg?.flags === 'SYN')!.look!.via, 'listener');
    const d2 = S.find((s) => s.seg?.src === TAB2 && s.seg.flags === 'DATA')!;
    const sock = d2.socks.find((k) => k.id === d2.look!.hit)!;
    assert.equal(sock.peer, TAB2);
    assert.equal(S.at(-1)!.look!.via, 'rst');
  });
  it('accept queue shows in Recv-Q of LISTEN', () => {
    assert.ok(S.some((s) => s.socks[0].recvQ === 1));
    assert.match(ssLines(S[0].socks)[1], /^LISTEN\s+0\s+511\s+0\.0\.0\.0:80/);
  });
  it('lookup is exact', () => {
    const socks = demuxScript().at(-1)!.socks;
    assert.equal(lookup(socks, { src: TAB1, dst: WEB80, flags: 'DATA' }).via, 'established');
    assert.equal(lookup(socks, { src: TAB1, dst: '10.10.2.10:81', flags: 'SYN' }).via, 'rst');
  });
});

describe('bind', () => {
  it('127.0.0.1 only reaches loopback; 0.0.0.0 everyone; 10.10.2.20 everyone except 127.0.0.1', () => {
    const row = (b: '127.0.0.1' | '0.0.0.0' | '10.10.2.20') => (['lo', 'selfip', 'web', 'host'] as const).map((c) => bindResult(b, c).ok);
    assert.deepEqual(row('127.0.0.1'), [true, false, false, false]);
    assert.deepEqual(row('0.0.0.0'), [true, true, true, true]);
    assert.deepEqual(row('10.10.2.20'), [false, true, true, true]);
  });
});

describe('ephemeral (computed from kernel defaults)', () => {
  it('28 232 ports, ~470 new connections per second to one ip:port', () => {
    assert.equal(EPH_PORTS, 28232);
    assert.equal(Math.floor(EPH_MAX_RATE), 470);
  });
  it('1000 req/s exhausts after 28.2 s; 400 req/s never does; a pool of 10 uses 10 ports', () => {
    assert.equal(Math.round(ephemeralAt(1000, 0).exhaustAt! * 10) / 10, 28.2);
    assert.equal(ephemeralAt(1000, 30).failing, true);
    assert.equal(ephemeralAt(400, 120).failing, false);
    assert.equal(ephemeralAt(400, 120).inUse, 24000);
    assert.equal(ephemeralAt(1000, 30, 10).inUse, 10);
  });
});
