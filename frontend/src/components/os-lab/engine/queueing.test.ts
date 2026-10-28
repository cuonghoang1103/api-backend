/**
 * Kiểm mô phỏng thread pool bằng lý thuyết hàng đợi: Little, M/M/1, Erlang C (M/M/c), điểm bão hoà.
 *   npx tsx --test frontend/src/components/os-lab/engine/queueing.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { capacity, erlangC, simulate, sweep, type QCfg } from './queueing';

const base: QCfg = { lambda: 80, cpuMs: 10, dbMs: 0, workers: 1, cores: 1, dbPool: 1, queueCap: Infinity, timeoutMs: Infinity, dropExpired: false, virtual: false, dist: 'exp', duration: 3000, seed: 11 };
const near = (a: number, b: number, tol: number) => Math.abs(a - b) / b <= tol;

describe('queueing theory', () => {
  it('Erlang C textbook values: c = 2, a = 1 → P(wait) = 1/3', () => {
    const e = erlangC(2, 1, 1);
    assert.ok(Math.abs(e.pWait - 1 / 3) < 1e-12 && Math.abs(e.Wq - 1 / 3) < 1e-12);
    assert.ok(Math.abs(erlangC(1, 0.8, 1).Wq - 4) < 1e-12, 'M/M/1: Wq = ρ/(μ−λ)');
  });
  it('M/M/1 (λ = 80/s, S = 10 ms): W = 1/(μ − λ) = 50 ms, L = 4, ρ = 0.8', () => {
    const r = simulate(base, 1000, 0);
    assert.ok(near(r.W, 50, 0.08), `W=${r.W}`);
    assert.ok(near(r.L, 4, 0.1), `L=${r.L}`);
    assert.ok(near(r.util.workers, 0.8, 0.03));
  });
  it("Little's law L = λW holds (measured independently: time-average vs per-request)", () => {
    for (const cfg of [base, { ...base, workers: 3, cores: 3, lambda: 250 }, { ...base, workers: 8, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 10, lambda: 200, duration: 600 }]) {
      const r = simulate(cfg, 1000, 0);
      assert.ok(near(r.L, (r.X / 1000) * r.W, 0.03), `L=${r.L} XW=${(r.X / 1000) * r.W}`);
    }
  });
  it('M/M/2 matches Erlang C: λ = 100/s, S = 10 ms → W = 13.3 ms', () => {
    const r = simulate({ ...base, workers: 2, cores: 2, lambda: 100, duration: 2000 }, 1000, 0);
    const e = erlangC(2, 100, 100);
    assert.ok(near(r.W / 1000, e.W, 0.08), `${r.W} vs ${e.W * 1000}`);
  });
  it('overload: throughput saturates at the bottleneck; latency grows without bound', () => {
    const cfg: QCfg = { ...base, workers: 8, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 10, lambda: 500, duration: 60 };
    assert.equal(Math.round(capacity(cfg).rps), 320);
    const r = simulate(cfg, 1000, 0);
    assert.ok(near(r.X, 320, 0.05), `X=${r.X}`);
    assert.ok(r.secs.at(-1)!.p50! > r.secs[5].p50! * 5, 'later requests wait much longer');
  });
  it('more threads than DB connections: 50 workers but 5 connections → capped at 250/s, workers pile up waiting', () => {
    const cfg: QCfg = { ...base, workers: 50, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 5, lambda: 300, duration: 60 };
    assert.equal(capacity(cfg).by, 'db');
    const r = simulate(cfg, 1000, 0);
    assert.ok(near(r.X, 250, 0.05));
    assert.ok(r.util.db > 0.97);
  });
  it('virtual threads remove the worker limit but not the DB limit', () => {
    const thr: QCfg = { ...base, workers: 8, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 10, lambda: 380, duration: 60 };
    const a = simulate(thr, 1000, 0), b = simulate({ ...thr, virtual: true }, 1000, 0);
    assert.ok(a.X < 335 && near(b.X, 380, 0.05));
    assert.ok(b.p99 < 200 && a.p99 > 1000);
  });
  it('timeouts: a naive server works on abandoned requests (goodput collapses); a bounded queue sheds load and keeps it', () => {
    const cfg: QCfg = { ...base, workers: 8, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 10, lambda: 360, timeoutMs: 500, duration: 120 };
    const naive = simulate(cfg, 1000, 0), drop = simulate({ ...cfg, dropExpired: true }, 1000, 0), shed = simulate({ ...cfg, queueCap: 64 }, 1000, 0);
    for (const r of [naive, drop, shed]) assert.ok(near(r.X, 320, 0.05), 'the server is always 100% busy…');
    assert.ok(naive.goodput < 40, `…but naive goodput is ${naive.goodput}/s`);
    assert.ok(drop.goodput > naive.goodput * 3 && drop.goodput < 250);
    assert.ok(shed.goodput > 300 && shed.rejected > 0 && shed.p99 < 500, `shed goodput ${shed.goodput}`);
  });
  it('sweep produces a knee at capacity', () => {
    const pts = sweep({ ...base, workers: 8, cores: 4, cpuMs: 5, dbMs: 20, dbPool: 10, lambda: 200, duration: 20 });
    const lo = pts[2], hi = pts.at(-1)!;
    assert.ok(near(lo.X, lo.lambda, 0.1));
    assert.ok(hi.X < hi.lambda * 0.75);
  });
});
