// @java: WordLadder.java
// LC 127 · Word Ladder — an implicit graph: words are nodes, "differ by one letter" is an edge. BFS by levels.

// #region giai
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;
  let level = [beginWord];
  dict.delete(beginWord);
  let steps = 1;                                   // the answer counts WORDS, so the start is 1
  while (level.length > 0) {
    const next: string[] = [];
    for (const w of level) {
      for (let i = 0; i < w.length; i++) {
        for (let ch = 97; ch <= 122; ch++) {       // 'a'..'z': generate neighbours, do not compare all pairs
          const cand = w.slice(0, i) + String.fromCharCode(ch) + w.slice(i + 1);
          if (!dict.has(cand)) continue;
          if (cand === endWord) return steps + 1;
          dict.delete(cand);                       // deleting from the dictionary = marking visited
          next.push(cand);
        }
      }
    }
    level = next;
    steps++;
  }
  return 0;
}
// #endregion

console.log(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']));
console.log(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']));
console.log(ladderLength('a', 'c', ['a', 'b', 'c']));
console.log(ladderLength('code', 'data', ['cade', 'cate', 'date', 'data', 'gate', 'code']));
