/**
 * eintr + nagle: đối chiếu với lab/out/c115-eintr, c113-strace.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/minitl.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { eintr, nagle } from './minitl';

const st = (m: Parameters<typeof eintr>[0]) => eintr(m).map((e) => e.strace ?? '').join('\n');

describe('eintr (c115)', () => {
  it('no SA_RESTART: ERESTARTSYS → rt_sigreturn -1 EINTR → retry read = 5 at 2.0 s', () => {
    const s = st('norestart');
    assert.match(s, /= \? ERESTARTSYS \(To be restarted if SA_RESTART is set\)/);
    assert.match(s, /rt_sigreturn\(\{mask=\[\]\}\) +=  ?-1 EINTR/);
    assert.match(s, /1\.0s read\(\) = -1 Interrupted system call/); assert.match(s, /2\.0s retry: read\(\) = 5/);
  });
  it('SA_RESTART: rt_sigreturn = 3, the program never sees EINTR', () => {
    const s = st('restart');
    assert.match(s, /rt_sigreturn\(\{mask=\[\]\}\) += 3/); assert.doesNotMatch(s, /EINTR/);
  });
  it('poll: ERESTARTNOHAND ⇒ always EINTR', () => {
    const s = st('poll');
    assert.match(s, /ERESTARTNOHAND/); assert.match(s, /1\.0s poll\(\) = -1 Interrupted system call/);
  });
  it('python retries (PEP 475); Go: 49 SIGURG in 1.475 s', () => {
    assert.match(st('python'), /handler ran/); assert.equal(eintr('python').at(-1)!.text, 'read() = 5');
    assert.match(st('go'), /^49$/m);
  });
});

describe('nagle (c113)', () => {
  it('two writes + Nagle + delayed ACK: ~41 ms per request, 200 requests 8.367 s', () => {
    const r = nagle({ writes: 2, nodelay: false, delayedAck: true });
    assert.equal(r.total200s, 8.367); assert.ok(r.events.some((e) => e.ms === 41.1 && /hello/.test(e.label)));
  });
  it('TCP_NODELAY or one write: 0.028 s', () => {
    assert.equal(nagle({ writes: 2, nodelay: true, delayedAck: true }).total200s, 0.028);
    assert.equal(nagle({ writes: 1, nodelay: false, delayedAck: true }).total200s, 0.028);
  });
});
