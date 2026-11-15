// @java: PvMinRemove.java
// LC 1249 · Minimum Remove to Make Valid Parentheses.
// (1) a stack of indices of unmatched '(' + a mark for every unmatched ')'  — O(n) time, O(n) extra.
// (2) two passes with a counter — O(n) time, no stack (only the output buffer). Both remove the MINIMUM number of
//     characters, but they may remove DIFFERENT ones: any valid answer is accepted, which is a clarifying question.

// #region ngan-xep
function minRemoveStack(s: string): string {
  const remove = new Array<boolean>(s.length).fill(false);
  const open: number[] = [];                    // indices of '(' still waiting for a partner
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') open.push(i);
    else if (s[i] === ')') {
      if (open.length > 0) open.pop();          // matches the most recent unmatched '('
      else remove[i] = true;                    // nothing to match: this ')' must go
    }
  }
  for (const i of open) remove[i] = true;       // leftover '(' never got closed
  let out = '';
  for (let i = 0; i < s.length; i++) if (!remove[i]) out += s[i];
  return out;
}
// #endregion

// #region hai-luot
function minRemoveTwoPass(s: string): string {
  const kept: string[] = [];
  let open = 0;
  for (const ch of s) {                         // pass 1 (left → right): drop ')' that has no '(' before it
    if (ch === '(') open++;
    else if (ch === ')') {
      if (open === 0) continue;
      open--;
    }
    kept.push(ch);
  }
  const out: string[] = [];
  for (let i = kept.length - 1; i >= 0; i--) {  // pass 2 (right → left): drop the `open` rightmost '('
    if (kept[i] === '(' && open > 0) { open--; continue; }
    out.push(kept[i]);
  }
  return out.reverse().join('');
}
// #endregion

function isValid(s: string): boolean {
  let bal = 0;
  for (const ch of s) {
    if (ch === '(') bal++;
    else if (ch === ')' && --bal < 0) return false;
  }
  return bal === 0;
}

const cases = ['lab(o(r)a)tory)', 'a)b(c)d', '))((', '(a(b(c)d)', '', 'xyz', '())()(((', '((x)'];
for (const s of cases) {
  const a = minRemoveStack(s);
  const b = minRemoveTwoPass(s);
  console.log(`"${s}" -> stack="${a}" twoPass="${b}" valid=${isValid(a) && isValid(b)} removed=${s.length - a.length}/${s.length - b.length}`);
}
const big = '('.repeat(50000) + 'x' + ')'.repeat(49999);
console.log(`big input n=${big.length}: removed=${big.length - minRemoveStack(big).length}`);
