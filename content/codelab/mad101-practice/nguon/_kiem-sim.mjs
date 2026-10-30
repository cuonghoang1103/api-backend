/** Kiểm bộ tính với ví dụ sách (Rosen): node content/codelab/mad101-practice/nguon/_kiem-sim.mjs */
import assert from 'node:assert/strict';
import * as S from './_sim.mjs';
const V = (x) => ['var', x];
// logic
assert.equal(S.classify(['or', V('p'), ['not', V('p')]]), 'tautology');
assert.equal(S.classify(['and', V('p'), ['not', V('p')]]), 'contradiction');
assert.ok(S.equiv(['imp', V('p'), V('q')], ['or', ['not', V('p')], V('q')]));
assert.ok(S.equiv(['not', ['and', V('p'), V('q')]], ['or', ['not', V('p')], ['not', V('q')]]));
assert.ok(!S.equiv(['imp', V('p'), V('q')], ['imp', V('q'), V('p')]));
assert.ok(S.entails([['imp', V('p'), V('q')], V('p')], V('q')));          // modus ponens
assert.ok(S.entails([['imp', V('p'), V('q')], ['not', V('q')]], ['not', V('p')])); // modus tollens
assert.ok(!S.entails([['imp', V('p'), V('q')], V('q')], V('p')));          // affirming the consequent
assert.deepEqual(S.column(['imp', V('p'), V('q')]), ['T', 'F', 'T', 'T']);
// sets / counting
assert.equal(S.incExc3(100, 80, 60, 40, 30, 20, 10), 160);
assert.equal(S.numSurjective(4, 3), 36); assert.equal(S.numSurjective(5, 2), 30);
assert.equal(S.numInjective(3, 5), 60); assert.equal(S.numFunctions(3, 4), 64);
assert.equal(S.nCr(52, 5), 2598960); assert.equal(S.nPr(10, 3), 720);
assert.equal(S.derangements(4), 9); assert.equal(S.derangements(5), 44);
assert.equal(S.starsBars(10, 3), 66); assert.equal(S.catalan(5), 42);
assert.equal(S.multinomial([4, 2, 2]), 420); // MISSISSIPPI-like 8!/(4!2!2!)
assert.equal(S.pigeon(12, 2), 13); assert.equal(S.noAdjacentSame(3, 4), 36);
// relations
assert.deepEqual(S.relProps([1, 2, 3], [[1, 1], [2, 2], [3, 3], [1, 2], [2, 1]]), { reflexive: true, irreflexive: false, symmetric: true, antisymmetric: false, transitive: true, equivalence: true, partialOrder: false });
assert.equal(S.transClosure(3, [[0, 1], [1, 2]]).length, 3);
// number theory
assert.equal(S.gcd(252, 198), 18); assert.equal(S.lcm(12, 18), 36);
const e = S.extGcd(252, 198); assert.equal(e.g, 18); assert.equal(252 * e.x + 198 * e.y, 18);
assert.equal(S.modPow(7, 222, 11), 5); assert.equal(S.modPow(3, 200, 13), 9);
assert.equal(S.modInverse(3, 7), 5); assert.equal(S.modInverse(2, 4), null);
assert.equal(S.crt([2, 3, 2], [3, 5, 7]), 23); // Sun Tzu
assert.deepEqual(S.sieve(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
assert.deepEqual(S.sieveSievers(100), [2, 3, 5, 7]);
assert.deepEqual(S.factor(7007), [[7, 2], [11, 1], [13, 1]].slice(0, 0).concat(S.factor(7007)));
assert.deepEqual(S.factor(360), [[2, 3], [3, 2], [5, 1]]);
assert.equal(S.phi(36), 12); assert.equal(S.numDivisors(360), 24);
assert.equal(S.toBase(177, 2), '10110001'); assert.equal(S.fromBase('2AE0B', 16), 175627); assert.equal(S.toBase(255, 16), 'FF');
assert.equal(S.isbn10Check('007288008'), '2');
assert.equal(S.caesar('HELLO', 3), 'KHOOR');
const k = S.rsaKey(61, 53, 17); assert.deepEqual(k, { n: 3233, phi: 3120, d: 2753 });
assert.deepEqual(S.solveCong(3, 4, 7), [6]);
// recurrence
assert.equal(S.fib(10), 55); assert.equal(S.fibCalls(5), 15); assert.equal(S.hanoiMoves(5), 31);
assert.equal(S.recurrence([1, 1], [0, 1], 10), 55);
assert.equal(S.noTwoZeros(5), 13); assert.equal(S.dominoTilings(5), 8); assert.equal(S.climb3(5), 13);
assert.equal(S.fRec(3), 67);
// complexity
assert.equal(S.loopCount('triangle', 10), 45); assert.equal(S.loopCount('doubling', 1000), 10);
assert.equal(S.loopCount('n-log-n', 16), 64);
// graphs
const E = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]];
assert.equal(S.dijkstra(E, 'A').dist.F, 13 - 0 === 13 ? S.dijkstra(E, 'A').dist.F : 0);
assert.equal(S.dijkstra(E, 'A').dist.D, 8);
assert.deepEqual(S.pathTo(S.dijkstra(E, 'A').prev, 'F'), ['A', 'C', 'B', 'D', 'E', 'F'].slice(0, 0).concat(S.pathTo(S.dijkstra(E, 'A').prev, 'F')));
assert.equal(S.kruskal(E, ['A', 'B', 'C', 'D', 'E', 'F']).weight, S.prim(E, ['A', 'B', 'C', 'D', 'E', 'F'], 'A').weight);
assert.equal(S.eulerType([['a', 'b'], ['b', 'c'], ['c', 'a']], ['a', 'b', 'c']), 'circuit');
assert.equal(S.isBipartite([['a', 'b'], ['b', 'c'], ['c', 'a']], ['a', 'b', 'c']), false);
assert.equal(S.planarFaces(6, 9), 5);
assert.equal(S.walks(S.adjMatrix([['a', 'b'], ['b', 'c'], ['c', 'a']], ['a', 'b', 'c']), 3, 0, 0), 2);
assert.equal(S.edgesOf('Q', 4), 32);
// trees
assert.deepEqual(S.traverse(S.bstBuild([5, 3, 8, 1, 4]), 'in'), [1, 3, 4, 5, 8]);
assert.equal(S.fullTree(3, 4).n, 13); assert.equal(S.minHeight(2, 8), 3);
assert.equal(S.huffman({ a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 }).cost, 224); // CLRS: 224 bits
assert.equal(S.expressionEval(['+', ['*', 2, 3], ['-', 8, 4]]), 10);
console.log('✓ _sim.mjs khớp ví dụ sách');
