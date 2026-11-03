import { test } from 'node:test';
import assert from 'node:assert/strict';
import { label, firstTag } from '../rules.ts';
test('label maps every content type', () => { assert.equal(label('VLOG'), 'Vlog'); assert.equal(label('CODE_REVIEW'), 'Review'); });
test('firstTag upper-cases the first tag', () => { assert.equal(firstTag(['be-201']), 'BE-201'); });
