// @java: RpnDecode.java
// LC 150 · Evaluate Reverse Polish Notation · LC 394 · Decode String — stacks that hold "unfinished work".

// #region rpn
function evalRPN(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = st.pop()!, a = st.pop()!;          // ORDER: b is the top, a is under it
      if (t === '+') st.push(a + b);
      else if (t === '-') st.push(a - b);
      else if (t === '*') st.push(a * b);
      else st.push(Math.trunc(a / b));             // truncate toward zero, like Java/C
    } else st.push(Number(t));
  }
  return st.pop()!;
}
// #endregion

// #region decode
function decodeString(s: string): string {
  const counts: number[] = [];                     // repeat count waiting for its ']'
  const prefix: string[] = [];                     // text built before the '[' we are inside
  let cur = '', k = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') k = k * 10 + (c.charCodeAt(0) - 48);   // numbers can have several digits
    else if (c === '[') { counts.push(k); prefix.push(cur); k = 0; cur = ''; }
    else if (c === ']') { cur = prefix.pop()! + cur.repeat(counts.pop()!); }
    else cur += c;
  }
  return cur;
}
// #endregion

console.log('evalRPN([2,1,+,3,*]) =', evalRPN(['2', '1', '+', '3', '*']));
console.log('evalRPN([4,13,5,/,+]) =', evalRPN(['4', '13', '5', '/', '+']));
console.log('evalRPN([7,-2,/]) =', evalRPN(['7', '-2', '/']));
console.log('floor(-7/2) =', Math.floor(-7 / 2), ' trunc(-7/2) =', Math.trunc(-7 / 2));
console.log('decodeString(3[a]2[bc]) =', decodeString('3[a]2[bc]'));
console.log('decodeString(3[a2[c]]) =', decodeString('3[a2[c]]'));
console.log('decodeString(2[ab]10[x]) =', decodeString('2[ab]10[x]'));
