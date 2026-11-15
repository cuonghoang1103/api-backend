// What the dirty version does with an EMPTY array — the case its duplicated "close the last range" block forgot.
function f(a: number[]): string[] {
  let r: string[] = [];
  let x1 = a[0];
  let x2 = a[0];
  for (let i = 1; i < a.length; i++) {
    if (a[i] != x2 + 1) {
      if (x1 == x2) r.push('' + x1); else r.push(x1 + '->' + x2);
      x1 = a[i];
      x2 = a[i];
    } else {
      x2 = a[i];
    }
  }
  if (x1 == x2) r.push('' + x1); else r.push(x1 + '->' + x2);
  return r;
}
// #region chay
console.log('dirty f([]) =', JSON.stringify(f([])));
// #endregion
