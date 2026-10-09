/**
 * UX-D — thư viện ảnh bìa: id backend == danh mục frontend == tệp SVG (+ bản JPEG cho email); mẫu ⇒ bìa mặc định.
 *   npx tsx --test src/services/work/covers.test.ts
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { clampCoverY, COVER_PRESETS, defaultCoverFor, isCoverPreset, presetIdOf } from './covers.js';

const fe = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../frontend');

describe('UX-D ảnh bìa dự án', () => {
  it('danh mục khớp giữa backend, frontend và tệp ảnh; 24–30 ảnh, đủ 4 nhóm, mỗi SVG nhẹ', () => {
    const catalog = JSON.parse(readFileSync(path.join(fe, 'src/lib/work-covers.json'), 'utf8')) as Array<{ id: string; group: string }>;
    assert.deepEqual([...catalog.map((c) => c.id)].sort(), [...COVER_PRESETS].sort());
    assert.ok(COVER_PRESETS.length >= 24 && COVER_PRESETS.length <= 30);
    assert.deepEqual([...new Set(catalog.map((c) => c.group))].sort(), ['cute', 'professional', 'school', 'theme']);
    for (const id of COVER_PRESETS) {
      const svg = path.join(fe, `public/images/work-covers/${id}.svg`);
      assert.ok(existsSync(svg), `thiếu ${id}.svg`);
      assert.ok(statSync(svg).size < 16_000, `${id}.svg quá nặng`);
      assert.ok(!/<script|<image|href="http/i.test(readFileSync(svg, 'utf8')), `${id}.svg không được nhúng script/ảnh ngoài`);
      assert.ok(existsSync(path.join(fe, `public/images/work-covers/email/${id}.jpg`)), `thiếu bản email ${id}.jpg`);
    }
  });
  it('mẫu dự án ⇒ bìa hợp chủ đề; giá trị lạ bị từ chối; điểm lấy nét kẹp 0–100', () => {
    assert.equal(defaultCoverFor('SWT301'), 'preset:school-swt301');
    assert.equal(defaultCoverFor('CAPSTONE'), 'preset:school-capstone');
    assert.equal(defaultCoverFor('BLANK', 'SCHOOL'), 'preset:theme-study');
    assert.equal(defaultCoverFor('BLANK'), 'preset:gradient-indigo');
    for (const v of Object.values({ a: defaultCoverFor('FREELANCE'), b: defaultCoverFor('COMPANY'), c: defaultCoverFor('BLANK', 'CLIENT') })) assert.ok(presetIdOf(v));
    assert.equal(isCoverPreset('../../etc'), false);
    assert.equal(presetIdOf('preset:nope'), null);
    assert.equal(presetIdOf('https://x/y.jpg'), null);
    assert.equal(clampCoverY(-5), 0); assert.equal(clampCoverY(250), 100); assert.equal(clampCoverY('x'), 50); assert.equal(clampCoverY(33.6), 34);
  });
});
