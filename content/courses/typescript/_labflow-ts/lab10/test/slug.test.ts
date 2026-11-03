import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, truncate, isSlug } from '../labflow-slug.js';
test('slugify', () => assert.equal(slugify('Phong Lab BE 201'), 'phong-lab-be-201'));
test('truncate', () => { assert.equal(truncate('hello', 10), 'hello'); assert.equal(truncate('hello world', 5), 'hello…'); });
test('isSlug', () => { assert.equal(isSlug('be-201'), true); assert.equal(isSlug('BE 201'), false); });
