/**
 * Danh mục mô phỏng phía web (registry.ts) và phía nội dung (content/_labs.mjs) PHẢI khớp nhau: nội dung nhúng một tên
 * mà web không biết thì khối im lặng không gắn gì; web có preset mà nội dung không cho dùng thì không sao, nhưng ta
 * giữ hai bên bằng nhau cho dễ đọc.
 *   npx tsx --test frontend/src/components/labs/registry.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LABS } from './registry';
import { LAB_NAMESPACES, LAB_SELECTOR } from './selector';
import { LAB_NS, labEmbed, thuNgay } from '../../../../content/_labs.mjs';
import { tourIdsBySim } from './tour';

describe('lab registries', () => {
  it('every namespace is known on both sides', () => {
    assert.deepEqual([...LAB_NAMESPACES].sort(), Object.keys(LAB_NS).sort());
    assert.deepEqual(Object.keys(LABS).sort(), Object.keys(LAB_NS).sort());
    assert.equal(LAB_SELECTOR, 'div.os-lab, div.cpu-lab');
  });
  for (const ns of LAB_NAMESPACES) {
    it(`${ns}: same sims and presets as content`, () => {
      const web = Object.fromEntries(Object.entries(LABS[ns].labs).map(([k, d]) => [k, d.presets]));
      assert.deepEqual(web, LAB_NS[ns].sims);
      assert.equal(LABS[ns].gallery, LAB_NS[ns].gallery);
    });
  }
  it('tour ids: content lists = web registry', () => {
    const web = tourIdsBySim();
    for (const ns of LAB_NAMESPACES) assert.deepEqual(LAB_NS[ns].tours, web[ns], ns);
  });
  it('tour param becomes a class and a full-screen link; unknown tours are rejected', () => {
    const html: string = labEmbed('cpu-lab', 'cpu', 'sum', 'vi', 'Tổng 1..N', { tour: 'fetch-decode' });
    assert.match(html, /^<div class="cpu-lab cpu-lab-sim-cpu cpu-lab-p-sum cpu-lab-t-fetch-decode">/);
    assert.match(html, /tour=fetch-decode/);
    assert.throws(() => labEmbed('cpu-lab', 'cpu', 'sum', 'vi', 'x', { tour: 'bits-basics' }));
    const t: string = thuNgay('vi', 'bits', 'intro', 'Dẫn.', ['Một'], { tour: 'bits-basics' });
    assert.match(t, /cpu-lab-t-bits-basics/);
  });
  it('content helper produces only class-based markup and rejects unknown names', () => {
    const html: string = labEmbed('cpu-lab', 'cpu', 'sum', 'vi', 'Tổng 1..N');
    assert.match(html, /^<div class="cpu-lab cpu-lab-sim-cpu cpu-lab-p-sum"><p class="cpu-lab-cap">/);
    assert.ok(!/script|on\w+=/i.test(html));
    assert.throws(() => labEmbed('cpu-lab', 'nope', 'x', 'vi', 'x'));
    assert.throws(() => labEmbed('cpu-lab', 'cpu', 'nope', 'vi', 'x'));
    const t: string = thuNgay('en', 'bits', 'convert', 'Lead.', ['One', 'Two']);
    assert.match(t, /<h3>🔬 Try it now<\/h3>/);
    assert.equal((t.match(/<div/g) || []).length, (t.match(/<\/div>/g) || []).length);
  });
});
