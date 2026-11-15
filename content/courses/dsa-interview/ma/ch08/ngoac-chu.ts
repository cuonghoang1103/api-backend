// @java: NgoacChu.java
// LC 22 · Generate Parentheses (prune by counts) and LC 17 · Letter Combinations (a cartesian product).

// #region parens
function generateParenthesis(n: number): string[] {
  const res: string[] = [];
  const path: string[] = [];
  function bt(open: number, close: number): void {
    if (path.length === 2 * n) { res.push(path.join('')); return; }
    if (open < n) { path.push('('); bt(open + 1, close); path.pop(); }         // may open while some are left
    if (close < open) { path.push(')'); bt(open, close + 1); path.pop(); }     // may close only what is open
  }
  bt(0, 0);
  return res;
}
// #endregion

// #region letters
const PHONE = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];                  // LeetCode wants [] here, not [""]
  const res: string[] = [];
  const path: string[] = [];
  function bt(i: number): void {
    if (i === digits.length) { res.push(path.join('')); return; }
    for (const ch of PHONE[digits.charCodeAt(i) - 48]) {   // the choices of THIS level = letters of digit i
      path.push(ch);
      bt(i + 1);
      path.pop();
    }
  }
  bt(0);
  return res;
}
// #endregion

// Count the nodes: generate all 2^(2n) strings then filter, vs prune with the two counters.
function nodesNaive(n: number): number {
  let nodes = 0;
  const bt = (len: number): void => { nodes++; if (len === 2 * n) return; bt(len + 1); bt(len + 1); };
  bt(0);
  return nodes;
}
function nodesPruned(n: number): number {
  let nodes = 0;
  const bt = (open: number, close: number): void => {
    nodes++;
    if (open + close === 2 * n) return;
    if (open < n) bt(open + 1, close);
    if (close < open) bt(open, close + 1);
  };
  bt(0, 0);
  return nodes;
}

console.log('generateParenthesis(3) = ' + JSON.stringify(generateParenthesis(3)));
console.log('letterCombinations("23") = ' + JSON.stringify(letterCombinations('23')));
console.log('letterCombinations("") = ' + JSON.stringify(letterCombinations('')));
console.log('letterCombinations("79") has ' + letterCombinations('79').length + ' strings (4 * 4)');
console.log(' n | answers | nodes, filter at the end | nodes, pruned');
for (let n = 1; n <= 10; n++) {
  console.log(String(n).padStart(2) + ' | ' + String(generateParenthesis(n).length).padStart(7) + ' | ' + String(nodesNaive(n)).padStart(24) + ' | ' + String(nodesPruned(n)).padStart(13));
}
