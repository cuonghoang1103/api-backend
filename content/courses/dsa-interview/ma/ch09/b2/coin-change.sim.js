// Coin Change: dp[a] = fewest coins that make amount a. Watch every amount look back once per coin.
const COINS = [1, 3, 4], AMOUNT = 6, INF = AMOUNT + 1;
const coins = new Array1DTracer('coins');
const table = new Array1DTracer('dp[a] for a = 0..' + AMOUNT + '   (' + INF + ' = impossible so far)');
const log = new LogTracer('dp[a] = min over coins c <= a of dp[a - c] + 1');
const dp = new Array(AMOUNT + 1).fill(INF);
dp[0] = 0;
coins.set(COINS);
table.set(dp);
log.println('base: dp[0] = 0. Every other cell starts at ' + INF + ' = more coins than any real answer can use.');
Tracer.delay();
for (let a = 1; a <= AMOUNT; a++) {
  table.select(a);
  for (let k = 0; k < COINS.length; k++) {
    const c = COINS[k];
    if (c > a) continue;
    coins.select(k);
    table.patch(a - c);
    const cand = dp[a - c] + 1;
    const better = cand < dp[a];
    log.println('a=' + a + ', last coin ' + c + ': dp[' + (a - c) + '] + 1 = ' + cand + (better ? '  -> new best for dp[' + a + ']' : '  -> not better'));
    if (better) { dp[a] = cand; table.set(dp); table.select(a); table.patch(a - c); }
    Tracer.delay();
    table.depatch(a - c);
    coins.deselect(k);
  }
  table.deselect(a);
}
log.println('dp[' + AMOUNT + '] = ' + dp[AMOUNT] + ' coins (3 + 3). A greedy cashier takes 4 + 1 + 1 = 3 coins: see lesson 9.5.');
Tracer.delay();
