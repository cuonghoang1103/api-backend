// Lesson 10.1 — the edge cases, written down BEFORE fixing them (node --test runs this file)
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { topWords } = await import(process.env.IMPL ?? './top-words.mjs');

test('simple case', () => {
  assert.deepEqual(topWords('cache cache fast'), [{ word: 'cache', count: 2 }, { word: 'fast', count: 1 }]);
});
test('capital letters and punctuation do not create new words', () => {
  assert.deepEqual(topWords('Cache. cache, CACHE!', 1), [{ word: 'cache', count: 3 }]);
});
test('stop words are ignored', () => {
  assert.deepEqual(topWords('the the the sql', 1), [{ word: 'sql', count: 1 }]);
});
test('empty text gives no words', () => {
  assert.deepEqual(topWords(''), []);
});
test('ties are alphabetical', () => {
  assert.deepEqual(topWords('pear apple', 2), [{ word: 'apple', count: 1 }, { word: 'pear', count: 1 }]);
});
