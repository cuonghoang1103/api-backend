// @java: RoRi.java
// The attacker's view: pruning needs EARLY feedback. A checker that stops at the first wrong character
// leaks "how many leading characters were right" (through its running time). Model that leak as a number
// and watch backtracking-with-pruning crack a 6-digit code in a few dozen tries.

// #region ro-ri
// Constant-time style checker: the only answer is yes / no for the WHOLE code.
function makeSafe(secret: string) {
  let tries = 0;
  return { check: (g: string) => { tries++; return g === secret; }, tries: () => tries };
}
// Leaky checker: compares left to right and stops at the first mismatch; we model the timing leak
// by returning the number of characters it compared before stopping.
function makeLeaky(secret: string) {
  let tries = 0;
  return {
    check: (g: string) => { tries++; let k = 0; while (k < secret.length && g[k] === secret[k]) k++; return k; },
    tries: () => tries,
  };
}
// With the leak, fix one position at a time: a wrong digit is pruned as soon as it is tried.
function crackLeaky(len: number, o: ReturnType<typeof makeLeaky>): string {
  let prefix = '';
  for (let pos = 0; pos < len; pos++) {
    for (let d = 0; d <= 9; d++) {
      const guess = (prefix + d).padEnd(len, '0');
      if (o.check(guess) > pos) { prefix += d; break; }   // the leak says: position pos is right
    }
  }
  return prefix;
}
// #endregion

function crackSafe(len: number, o: ReturnType<typeof makeSafe>): string | null {
  for (let x = 0; x < 10 ** len; x++) {
    const g = String(x).padStart(len, '0');
    if (o.check(g)) return g;
  }
  return null;
}

for (const secret of ['000000', '481516', '999999']) {
  const safe = makeSafe(secret), leaky = makeLeaky(secret);
  const a = crackSafe(6, safe), b = crackLeaky(6, leaky);
  console.log('secret ' + secret + ' | yes/no checker: found ' + a + ' after ' + safe.tries() + ' tries | leaky checker: found ' + b + ' after ' + leaky.tries() + ' tries');
}
