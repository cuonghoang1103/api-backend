// @java: ValidParentheses.java
// LC 20 · Valid Parentheses — a stack remembers the brackets that are still open.

// #region giai
function isValid(s: string): boolean {
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' }; // closer -> its opener
  const stack: string[] = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c);                              // open: remember it
    } else {
      if (stack.length === 0) return false;       // a closer with nothing open
      if (stack.pop() !== pair[c]) return false;  // must close the MOST RECENT opener
    }
  }
  return stack.length === 0;                      // something still open => invalid
}
// #endregion

// #region thieu
function isValidBug(s: string): boolean {
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c);
    else if (stack.pop() !== pair[c]) return false;
  }
  return true;                                    // BUG: forgot to check that nothing is left open
}
// #endregion

for (const s of ['()[]{}', '{[()]}', '([)]', '(]', ']', '((', '']) {
  console.log(`isValid(${JSON.stringify(s)}) = ${isValid(s)}   buggy = ${isValidBug(s)}`);
}
