/**
 * Mọi dòng "capture thật" của mô phỏng Chương 14 (wifi + block) phải còn NGUYÊN VĂN trong output của lab — chạy lại lab mà chữ đổi
 * thì test đỏ, sửa capture14.ts cho khớp.   npx tsx --test frontend/src/components/net-lab/engine/capture14.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import { ALL14 } from './capture14';
import { blockEval, REQS, RULES } from './block';
import { wifiScript } from './wifi';

const OUT = new URL('../../../../../content/courses/networking-for-developers/lab/out/', import.meta.url);
const lines = (f: string) => fs.readFileSync(new URL(`${f}.out.txt`, OUT), 'utf8').replace(/\r$/gm, '').split('\n');

describe('capture14 — quoted from the real lab output', () => {
  it('every quoted line exists verbatim in its output file', () => {
    const miss = ALL14.filter(([f, t]) => !lines(f).includes(t)).map(([f, t]) => `${f}: ${t}`);
    assert.deepEqual(miss, []);
  });
});

describe('block engine — matches what the lab measured', () => {
  const on = (...ks: string[]) => Object.fromEntries(RULES.map((r) => [r.id, ks.includes(r.id)]));
  it('nothing blocked: every request passes', () => {
    for (const r of REQS) assert.equal(blockEval(r.id, on()).ok, true, r.id);
  });
  it('DNS filter: phim.test dies at DNS, the other DNS rescues it until outside DNS is dropped', () => {
    assert.equal(blockEval('phim', on('dns')).stop, 'dns');
    assert.equal(blockEval('phimAlt', on('dns')).ok, true);
    assert.equal(blockEval('phimAlt', on('dns', 'dns53')).stop, 'port');
  });
  it('SNI: social.test over HTTPS is reset, news.test on the same IP passes, HTTP passes', () => {
    assert.equal(blockEval('social', on('sni')).stop, 'sni');
    assert.equal(blockEval('news', on('sni')).ok, true);
    assert.equal(blockEval('socialHttp', on('sni')).ok, true);
  });
  it('ports/UDP/IP and TTL', () => {
    const all = on('ip', 'ports', 'udp');
    assert.equal(blockEval('vpn', all).rule, 'ip');
    assert.equal(blockEval('ssh22', all).stop, 'port');
    assert.equal(blockEval('ssh993', all).ok, true);
    assert.equal(blockEval('game', all).stop, 'port');
    assert.equal(blockEval('phone', on('ttl')).stop, 'ttl');
    assert.equal(blockEval('news', on('ttl')).ok, true);
  });
});

describe('wifi engine', () => {
  it('private Fixed ⇒ blocked on SSID 2; Off ⇒ Internet', () => {
    const last = (m: 'off' | 'fixed' | 'rotating') => { const s = wifiScript('private', m); return s[s.length - 1]; };
    assert.equal(last('fixed').net.mac, 'blocked');
    assert.equal(last('off').net.mac, 'ok');
  });
  it('clone: one account keeps one MAC; the copy gets the same IP and both downloads break', () => {
    const s = wifiScript('clone', 'off');
    const end = s[s.length - 1];
    assert.equal(end.reg.length, 1);
    assert.equal(end.net.win, 'reset');
    assert.equal(end.net.ke, 'reset');
  });
});
