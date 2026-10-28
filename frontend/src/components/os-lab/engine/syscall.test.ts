/**
 * Đối chiếu engine "hành trình một lời gọi" với output thật của lab Chương 11 (lab/out/c111-*, c113, c114, c117).
 *   cd frontend && npx tsx --test src/components/os-lab/engine/syscall.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BATCH, COST, DEFAULT_CFG, NR, STRACE_DD, cfgOf, journey, type SysCfg } from './syscall';

const J = (p: Partial<SysCfg>) => journey({ ...DEFAULT_CFG, ...p });
const close = (a: number, b: number, eps = 0.05) => assert.ok(Math.abs(a - b) <= eps, `${a} ≉ ${b}`);

describe('syscall journey — costs match c114-chi-phi', () => {
  it('write(/dev/null) inside the call = 195.7 ns', () => close(J({ kind: 'write', target: 'null' }).callNs, COST.writeNull));
  it('forced clock_gettime = 202.1 ns, vDSO = 18.5 ns (11× faster), and the vDSO path never traps', () => {
    const f = J({ kind: 'clock', force: true }), v = J({ kind: 'clock', force: false });
    close(f.callNs, 202.1); close(v.callNs, 18.5);
    assert.ok(f.callNs / v.callNs > 10);
    assert.ok(!v.steps.some((s) => s.mode === 'kernel'), 'vDSO must stay in user mode');
    assert.equal(v.result.calls, 0);
  });
  it('a buffered ext4 write ≈ 1.8 µs (c93), writev of 64 lines ≈ 1.56 ms / 1 564 calls', () => {
    close(J({ kind: 'write', target: 'file' }).callNs, 1800);
    close(J({ kind: 'writev', target: 'file' }).callNs, (1.56e6) / 1564, 0.5);
  });
  it('a function call is ~2 ns, a syscall ~0.18–0.2 µs — two orders of magnitude', () => {
    assert.equal(COST.fn, 2.1);
    for (const v of [COST.getppid, COST.svcAsm, COST.writeNull, COST.readZero, COST.forcedClock]) assert.ok(v >= 175 && v <= 202.1);
  });
});

describe('syscall journey — registers and return values match gdb (c111-hanh-trinh)', () => {
  it('arm64 write: x8 = 64, x0 = 1, x2 = 10, returns 10 and prints "hi from C"', () => {
    const j = J({ kind: 'write' });
    const libc = j.steps.find((s) => s.layer === 'libc')!;
    assert.deepEqual(libc.regs.slice(0, 4), [['x8', '64'], ['x0', '1'], ['x1', '0x11c4a420'], ['x2', '10']]);
    assert.equal(j.result.raw, 10); assert.equal(j.result.ret, 10);
    assert.deepEqual(j.result.output, ['hi from C']);
    assert.equal(j.result.strace, 'write(1, "hi from C\\n", 10) = 10');
    assert.ok(j.steps.some((s) => s.fn.includes('exit(0)')), 'pipe ⇒ stdio flushes at exit');
    assert.ok(!J({ kind: 'write', tty: true }).steps.some((s) => s.fn.includes('exit(0)')), 'tty ⇒ flushes at the newline');
  });
  it('x86-64 uses syscall, rax = 1 and clobbers rcx/r11', () => {
    const j = J({ kind: 'write', arch: 'x86' });
    assert.ok(j.steps.some((s) => s.fn.startsWith('syscall')));
    assert.equal(j.steps.find((s) => s.layer === 'libc')!.regs[0][1], '1');
    assert.ok(j.steps.find((s) => s.layer === 'entry')!.regs.some(([k]) => k === 'rcx'));
    assert.equal(NR.x86.openat, 257); assert.equal(NR.arm64.openat, 56);
  });
  it('openat("/nope/config.json"): kernel returns −2 (0xfffffffffffffffe), libc returns −1 and errno = 2', () => {
    const j = J({ kind: 'open' });
    assert.equal(j.result.raw, -2); assert.equal(j.result.ret, -1); assert.equal(j.result.errno, 2); assert.equal(j.result.errName, 'ENOENT');
    assert.ok(j.steps.some((s) => s.regs.some(([, v]) => v.includes('0xfffffffffffffffe'))));
    assert.deepEqual(j.result.output, ['open returned -1, errno = 2 (No such file or directory)']);
    assert.equal(j.result.strace, 'openat(AT_FDCWD, "/nope/config.json", O_RDONLY) = -1 ENOENT (No such file or directory)');
  });
  it('the kernel chain follows the ftrace of c111-kernel', () => {
    const fns = J({ kind: 'write' }).steps.map((s) => s.fn).join(' | ');
    for (const f of ['el0_svc', 'do_el0_svc', 'invoke_syscall', '__arm64_sys_write', 'ksys_write', 'vfs_write', 'security_file_permission', 'write_null']) assert.ok(fns.includes(f), f);
  });
  it('an LSM denial returns −EACCES before the driver runs', () => {
    const j = J({ kind: 'write', lsmDeny: true });
    assert.equal(j.result.errno, 13); assert.ok(!j.steps.some((s) => s.fn === 'write_null'));
  });
});

describe('strace and seccomp (c113, c117)', () => {
  it('ptrace adds two stops (~41 µs) per call: dd bs=1 0.053 s → 8.261 s; --seccomp-bpf 0.051 s', () => {
    const j = J({ kind: 'write', trace: 'ptrace' });
    assert.equal(j.steps.filter((s) => s.layer === 'tracer').length, 2);
    close((200000 * 2 * COST.ptraceStop) / 1e9 + 0.053, 8.261, 0.001);
    assert.equal(STRACE_DD.find((x) => x.mode === 'bpf')!.s, 0.051);
    assert.equal(J({ kind: 'write', trace: 'bpf' }).steps.filter((s) => s.layer === 'tracer').length, 0);
  });
  it('seccomp EPERM on mkdirat: "Operation not permitted", exit 1, handler never runs', () => {
    const j = J({ kind: 'mkdir', filter: 'eperm' });
    assert.equal(j.result.errno, 1); assert.equal(j.result.exit, 1);
    assert.match(j.result.output[0], /cannot create directory ‘\/tmp\/uploads’: Operation not permitted/);
    assert.ok(!j.steps.some((s) => s.layer === 'table'));
    assert.equal(j.result.strace, 'mkdirat(AT_FDCWD, "/tmp/uploads", 0777) = -1 EPERM (Operation not permitted)');
  });
  it('seccomp KILL: never returns, exit 159 = 128 + SIGSYS(31)', () => {
    const j = J({ kind: 'mkdir', filter: 'kill' });
    assert.equal(j.result.raw, null); assert.equal(j.result.exit, 159);
    assert.ok(!j.steps.some((s) => s.layer === 'cpu' && s.dir === 'up'));
  });
  it('socket EPERM ⇒ curl exit 6 "Could not resolve host"; clone3 ENOSYS ⇒ glibc falls back to clone, "thread ok"', () => {
    const c = J({ kind: 'socket', filter: 'eperm' });
    assert.equal(c.result.exit, 6); assert.match(c.result.output[0], /Could not resolve host/);
    const t = J({ kind: 'clone3', filter: 'enosys' });
    assert.equal(t.result.raw, -38); assert.deepEqual(t.result.output.slice(-1), ['thread ok']);
    assert.match(J({ kind: 'clone3', filter: 'eperm' }).result.output[0], /can't start new thread/);
  });
});

describe('batching (c114: 100 000 lines)', () => {
  it('syscall counts and times', () => {
    assert.deepEqual(BATCH.map((b) => b.calls), [100001, 1564, 783, 2]);
    assert.deepEqual(BATCH.map((b) => b.ms), [31.69, 1.56, 1.6, 2.16]);
    // ~317 ns per line when every line is a write(): one syscall + a little user work
    assert.ok(BATCH[0].nsPerLine > COST.writeNull);
  });
  it('every preset produces a journey that ends back in user mode or with a kill', () => {
    for (const p of ['write', 'fail', 'vdso', 'batch', 'strace', 'seccomp']) {
      const j = journey(cfgOf(p));
      assert.ok(j.steps.length >= 4, p);
      assert.equal(j.steps[j.steps.length - 1].mode, 'user', p);
    }
  });
});
