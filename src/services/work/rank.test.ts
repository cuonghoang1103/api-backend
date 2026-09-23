import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isValidRank, rankAfter, rankBefore, rankBetween, rankInitial, rankSequence, RANK_REBALANCE_AT,
} from './rank.js';

/** So sánh kiểu Postgres/JS trên [0-9a-z] — là so byte. */
const sorted = (xs: string[]) => [...xs].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

describe('rank', () => {
  it('thêm vào cuối 5000 lần mà độ dài vẫn ≤ 6', () => {
    let k = rankInitial();
    const all = [k];
    for (let i = 0; i < 5000; i++) {
      const n = rankAfter(k);
      assert.ok(n > k, `${n} phải > ${k}`);
      assert.ok(isValidRank(n), `${n} hợp lệ`);
      k = n;
      all.push(k);
    }
    assert.ok(k.length <= 6, `độ dài ${k.length}`);
    assert.deepEqual(sorted(all), all);
  });

  it('thêm vào đầu 5000 lần vẫn giữ thứ tự', () => {
    let k = rankInitial();
    for (let i = 0; i < 5000; i++) {
      const n = rankBefore(k);
      assert.ok(n < k, `${n} phải < ${k}`);
      assert.ok(isValidRank(n));
      k = n;
    }
  });

  it('chèn ngẫu nhiên 3000 lần: danh sách luôn đúng thứ tự, không trùng', () => {
    const list = [rankInitial()];
    let seed = 42;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    for (let i = 0; i < 3000; i++) {
      const pos = Math.floor(rnd() * (list.length + 1));
      const k = rankBetween(list[pos - 1] ?? null, list[pos] ?? null);
      assert.ok(isValidRank(k), `hợp lệ: ${k}`);
      list.splice(pos, 0, k);
    }
    assert.deepEqual(sorted(list), list);
    assert.equal(new Set(list).size, list.length);
  });

  it('chèn dồn vào cùng một khe: dài dần, và báo cần xếp lại trước khi chạm 64', () => {
    const a = 'i';
    let b = 'j';
    let n = 0;
    while (b.length < RANK_REBALANCE_AT) {
      b = rankBetween(a, b);
      assert.ok(a < b);
      n++;
    }
    assert.ok(n > 100, `chịu được ${n} lần chèn dồn trước khi cần xếp lại`);
  });

  it('không bao giờ sinh khoá đuôi 0', () => {
    for (const k of [...rankSequence(500), rankBetween('a', 'a1'), rankBefore('1'), rankAfter('zzzzzz')]) {
      assert.ok(!k.endsWith('0'), k);
    }
  });

  it('rankSequence tăng dần và cách đều', () => {
    const s = rankSequence(1000);
    assert.equal(s.length, 1000);
    assert.deepEqual(sorted(s), s);
    assert.equal(new Set(s).size, 1000);
  });

  it('từ chối hàng xóm sai thứ tự hoặc khoá hỏng', () => {
    assert.throws(() => rankBetween('b', 'a'));
    assert.throws(() => rankBetween('a', 'a'));
    assert.throws(() => rankBetween('A', null));
    assert.throws(() => rankBetween('a0', null));
  });
});
