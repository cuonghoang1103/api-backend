// @java: L8AddOperators.java
// LC 282 · Expression Add Operators — choose the next number AND the operator; remember the last term for '*'.

// #region giai
function addOperators(num: string, target: number): string[] {
  const res: string[] = [];
  // value = value of the expression so far; last = the last term (signed), needed to undo it when '*' comes
  function bt(i: number, expr: string, value: number, last: number): void {
    if (i === num.length) { if (value === target) res.push(expr); return; }
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === '0') break;                 // "05" is not a number: a leading zero stands alone
      const s = num.slice(i, j + 1);
      const x = Number(s);
      if (i === 0) { bt(j + 1, s, x, x); continue; }       // the first number has no operator before it
      bt(j + 1, expr + '+' + s, value + x, x);
      bt(j + 1, expr + '-' + s, value - x, -x);
      bt(j + 1, expr + '*' + s, value - last + last * x, last * x); // take back `last`, put back last * x
    }
  }
  bt(0, '', 0, 0);
  return res;
}
// #endregion

console.log(JSON.stringify(addOperators('123', 6)));
console.log(JSON.stringify(addOperators('232', 8)));
console.log(JSON.stringify(addOperators('105', 5)));
console.log(JSON.stringify(addOperators('00', 0)));
console.log(JSON.stringify(addOperators('3456237490', 9191)));
console.log(JSON.stringify(addOperators('2147483648', -2147483648)));
