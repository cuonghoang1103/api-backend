import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { apGain, chonLoaiDem, layCauDem } from './cauDem.js';

test('chonLoaiDem: hệ thống > tra web > câu khó; câu thường thì không đệm', () => {
  assert.equal(chonLoaiDem({ heThong: true, tra: true, kho: true }), 'heThong');
  assert.equal(chonLoaiDem({ heThong: false, tra: true, kho: true }), 'tra');
  assert.equal(chonLoaiDem({ heThong: false, tra: false, kho: true }), 'nghi');
  assert.equal(chonLoaiDem({ heThong: false, tra: false, kho: false }), null);
});

test('apGain: nhân đúng, kẹp ở 0,95 — không vỡ tiếng', () => {
  const b = Buffer.alloc(6);
  b.writeInt16LE(1000, 0); b.writeInt16LE(30000, 2); b.writeInt16LE(-30000, 4);
  const r = apGain(b, 6.0206); // ×2
  assert.equal(r.readInt16LE(0), 2000);
  assert.equal(r.readInt16LE(2), Math.round(0.95 * 32767));
  assert.equal(r.readInt16LE(4), -Math.round(0.95 * 32767));
  assert.equal(apGain(b, 0), b);
});

test('bộ câu đệm trong repo đủ file cho mọi giọng khai báo, và không lặp câu vừa nói', () => {
  const dir = path.join(process.cwd(), 'data', 'makerlab', 'cau-dem');
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'cau.json'), 'utf8'));
  for (const g of cfg.giong) for (const c of cfg.cau) {
    const f = path.join(dir, g, `${c.id}.pcm`);
    assert.ok(fs.existsSync(f) && fs.statSync(f).size > 16_000, `thiếu ${g}/${c.id}.pcm`);
  }
  const a = layCauDem('f5-cuong-nghe', 'tra');
  const b = layCauDem('f5-cuong-nghe', 'tra');
  assert.ok(a && b && a.id !== b.id, 'hai lần liền phải khác câu');
  assert.equal(layCauDem('giong-khong-co', 'tra'), null);
});
