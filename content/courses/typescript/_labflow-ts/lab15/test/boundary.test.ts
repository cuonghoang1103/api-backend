import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describe, demo } from '../boundary.ts';

test('the boundary module runs after types are erased', () => {
  assert.equal(demo.lab, 'BE-201');
  assert.equal(describe({ id: 2, lab: 'CS-101' }), 'CS-101 v1');
});
