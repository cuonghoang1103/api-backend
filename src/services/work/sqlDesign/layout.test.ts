/**
 * Database designer — xếp chỗ ERD.   npx tsx --test src/services/work/sqlDesign/layout.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseSql, relationships } from './index.js';
import { layoutErd, overlaps } from './layout.js';

const model = parseSql(readFileSync(fileURLToPath(new URL('./fixtures/nhatrosv.sql', import.meta.url)), 'utf8')).model;
const nodes = model.tables.map((t) => ({ id: t.name, w: 240, h: 34 + t.columns.length * 22 }));
const edges = relationships(model).map((r) => ({ from: r.child, to: r.parent }));

function noOverlap(pos: ReturnType<typeof layoutErd>) {
  const boxes = nodes.map((n) => ({ ...pos[n.id], w: n.w, h: n.h, id: n.id }));
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) assert.ok(!overlaps(boxes[i], boxes[j]), `${boxes[i].id} chồng ${boxes[j].id}`);
}

describe('layoutErd', () => {
  for (const direction of ['LR', 'TB'] as const) {
    it(`${direction}: mọi bảng có chỗ, không chồng nhau, cha đứng trước con`, () => {
      const pos = layoutErd(nodes, edges, { direction });
      assert.equal(Object.keys(pos).length, 11);
      noOverlap(pos);
      const k = direction === 'LR' ? 'x' : 'y';
      for (const [c, p] of [['Tenant', 'Account'], ['Room', 'RoomType'], ['Invoice', 'Contract'], ['Payment', 'Invoice']]) assert.ok(pos[p][k] < pos[c][k], `${p} trước ${c}`);
    });
  }
  it('ổn định: cùng đầu vào ⇒ cùng kết quả', () => {
    assert.deepEqual(layoutErd(nodes, edges), layoutErd(nodes, edges));
  });
  it('bảng đã kéo tay giữ chỗ; bảng mới xếp bên phải, không chồng', () => {
    const fixed = Object.fromEntries(nodes.slice(0, 10).map((n, i) => [n.id, [i * 300, 0] as [number, number]]));
    const pos = layoutErd(nodes, edges, { fixed });
    assert.deepEqual(pos.Account, { x: 0, y: 0 });
    assert.ok(pos.MaintenanceRequest.x >= 9 * 300 + 240);
  });
  it('vòng tham chiếu và bảng đứng riêng không làm treo', () => {
    const pos = layoutErd([{ id: 'A', w: 100, h: 50 }, { id: 'B', w: 100, h: 50 }, { id: 'C', w: 100, h: 50 }], [{ from: 'A', to: 'B' }, { from: 'B', to: 'A' }]);
    assert.equal(Object.keys(pos).length, 3);
  });
});
