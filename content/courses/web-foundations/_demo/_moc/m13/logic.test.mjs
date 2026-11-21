import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecipe, filterRecipes, slugify, loadRecipes } from './logic.mjs';

const recipes = [
  { name: 'Pho bo', category: 'main' },
  { name: 'Banh flan', category: 'dessert' },
  { name: 'Pho ga', category: 'main' },
];

describe('validateRecipe', () => {
  test('accepts a valid recipe', () => assert.deepEqual(validateRecipe({ name: 'Pho', minutes: 30 }), {}));
  test('rejects a 1-letter name', () => assert.ok(validateRecipe({ name: 'P', minutes: 30 }).name));
  test('rejects a name of only spaces', () => assert.ok(validateRecipe({ name: '   ', minutes: 30 }).name));
  test('rejects 0, negative and decimal minutes', () => {
    for (const minutes of [0, -5, 2.5, '30']) assert.ok(validateRecipe({ name: 'Pho', minutes }).minutes, String(minutes));
  });
});

describe('filterRecipes', () => {
  test('empty query returns everything', () => assert.equal(filterRecipes(recipes).length, 3));
  test('search ignores case and spaces', () => assert.equal(filterRecipes(recipes, { q: '  PHO ' }).length, 2));
  test('category and query combine', () => assert.deepEqual(filterRecipes(recipes, { q: 'pho', category: 'dessert' }), []));
  test('does not change the original array', () => { filterRecipes(recipes, { q: 'ga' }); assert.equal(recipes.length, 3); });
});

describe('slugify', () => {
  test('Vietnamese text becomes a URL slug', () => assert.equal(slugify('Phở bò Hà Nội'), 'pho-bo-ha-noi'));
  test('đ becomes d, symbols collapse', () => assert.equal(slugify('  Đậu hũ -- sốt cà! '), 'dau-hu-sot-ca'));
});

describe('loadRecipes with a fake fetch', () => {
  test('returns the items on 200', async () => {
    const fakeFetch = async () => ({ ok: true, status: 200, json: async () => ({ items: recipes }) });
    assert.equal((await loadRecipes(fakeFetch)).length, 3);
  });
  test('throws a readable error on 500', async () => {
    const fakeFetch = async () => ({ ok: false, status: 500 });
    await assert.rejects(loadRecipes(fakeFetch), /HTTP 500/);
  });
});
