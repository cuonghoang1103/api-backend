import { describe, it, expect } from 'vitest';
import { splitIntoShards, pickShard, durationsFromReport, UNKNOWN_MS } from './shard.js';

const MS = { 'a.test.js': 3000, 'b.test.js': 2000, 'c.test.js': 2000, 'd.test.js': 1000, 'e.test.js': 1000, 'f.test.js': 1000 };
const FILES = Object.keys(MS);
const names = (shards) => shards.map((s) => s.files);

describe('splitIntoShards', () => {
  it('longest first, each into the lightest shard → 4 + 3 + 3 seconds', () => {
    const shards = splitIntoShards(FILES, 3, MS);
    expect(names(shards)).toEqual([['a.test.js', 'f.test.js'], ['b.test.js', 'd.test.js'], ['c.test.js', 'e.test.js']]);
    expect(shards.map((s) => s.ms)).toEqual([4000, 3000, 3000]);
  });

  it('every file exactly once, whatever the number of shards', () => {
    for (const n of [1, 2, 3, 6, 8]) {
      expect(names(splitIntoShards(FILES, n, MS)).flat().sort()).toEqual([...FILES].sort());
    }
  });

  it('more shards than files → the extra shards are empty, not an error', () => {
    expect(names(splitIntoShards(['a.test.js', 'b.test.js'], 3, MS))).toEqual([['a.test.js'], ['b.test.js'], []]);
  });

  it('the input order does not matter: every CI machine computes the same split', () => {
    expect(names(splitIntoShards([...FILES].reverse(), 3, MS))).toEqual(names(splitIntoShards(FILES, 3, MS)));
  });

  it('a file without a timing counts as UNKNOWN_MS', () => {
    const shards = splitIntoShards(['new.test.js', 'd.test.js'], 1, MS);
    expect(shards[0].ms).toBe(UNKNOWN_MS + 1000);
  });

  it.each([0, -1, 1.5])('total %s is refused', (n) => {
    expect(() => splitIntoShards(FILES, n, MS)).toThrow(RangeError);
  });
});

describe('pickShard', () => {
  it('"1/3" is the first shard, "3/3" the last (1-based, like --shard)', () => {
    expect(pickShard(FILES, '1/3', MS)).toEqual(['a.test.js', 'f.test.js']);
    expect(pickShard(FILES, '3/3', MS)).toEqual(['c.test.js', 'e.test.js']);
  });
  it.each(['0/3', '4/3'])('%s does not exist', (spec) => {
    expect(() => pickShard(FILES, spec, MS)).toThrow(RangeError);
  });
  it('a malformed spec is a SyntaxError', () => {
    expect(() => pickShard(FILES, '1-3', MS)).toThrow(SyntaxError);
  });
});

describe('durationsFromReport', () => {
  it('relative file → milliseconds, from a Vitest JSON report', () => {
    const report = { testResults: [{ name: '/w/p/src/x.test.js', startTime: 1000, endTime: 1250.4 }, { name: '/w/p/src/y.test.js', startTime: 1000, endTime: 1600.6 }] };
    expect(durationsFromReport(report, '/w/p')).toEqual({ 'src/x.test.js': 250, 'src/y.test.js': 601 });
  });
});
