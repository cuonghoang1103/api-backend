// @java: L1RemoveAdjacent.java
// LC 1047 · Remove All Adjacent Duplicates In String — the answer itself is the stack.

// #region giai
function removeDuplicates(s: string): string {
  const st: string[] = [];
  for (const c of s) {
    if (st.length && st[st.length - 1] === c) st.pop();   // c cancels the letter just before it
    else st.push(c);
  }
  return st.join('');
}
// #endregion

for (const s of ['abbaca', 'azxxzy', 'aaaa', 'aaa', 'abc']) console.log(`${s} -> ${JSON.stringify(removeDuplicates(s))}`);
