import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { layCauNen } from './cauNen.js';

describe('câu nền (content/ctlanguage/cau-nen)', () => {
  it('ja: gói không kèm câu; bài lẻ kèm câu, id duy nhất, manh ghép lại = câu bỏ ruby', () => {
    const goi = layCauNen('ja');
    assert.equal(goi.nn, 'ja');
    assert.ok(goi.donVi.length >= 10);
    assert.ok(goi.donVi.every((d) => d.cau === null));
    const b1 = layCauNen('ja', 1);
    assert.equal(b1.donVi.length, 1);
    const cau = b1.donVi[0]!.cau as { id: string; cau: string; vi: string; manh?: string[] }[];
    assert.ok(cau.length >= 4);
    assert.equal(new Set(cau.map((c) => c.id)).size, cau.length);
    for (const c of cau) if (c.manh) assert.equal(c.manh.join(''), c.cau.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').replace(/\s/g, ''));
  });
  it('nn lạ ⇒ 400; số bài không có ⇒ 404', () => {
    assert.throws(() => layCauNen('zh'), /nn phải là/);
    assert.throws(() => layCauNen('ja', 99), /Không có/);
  });
});
