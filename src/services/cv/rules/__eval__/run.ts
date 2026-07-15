/**
 * CV linter eval harness — `npm run eval:cv-linter`.
 * ─────────────────────────────────────────────────────────────────────────
 * Runs the bullet linter over the golden set and reports precision, recall, and
 * the metric that matters most: the false-positive rate on STRONG bullets (a
 * strong bullet wrongly marked WEAK). ANY such misfire fails the build — a
 * linter that calls a good bullet weak is worse than no linter.
 *
 * Runs in CI. Exit code 0 = pass, 1 = fail.
 */
import { lintBullet } from '../bulletLinter.js';
import { GOLDEN } from './golden.js';

interface Row { text: string; expected: string; actual: string; ok: boolean }

const rows: Row[] = GOLDEN.map((g) => {
  const actual = lintBullet(g.text).strength;
  return { text: g.text, expected: g.expected, actual, ok: actual === g.expected };
});

const total = rows.length;
const correct = rows.filter((r) => r.ok).length;

// The gate: strong bullets must never be called WEAK.
const strong = rows.filter((r) => r.expected === 'STRONG');
const strongFalseWeak = strong.filter((r) => r.actual === 'WEAK');

// Precision/recall on the WEAK class (the "flag" action).
const predictedWeak = rows.filter((r) => r.actual === 'WEAK');
const expectedWeak = rows.filter((r) => r.expected === 'WEAK');
const truePosWeak = predictedWeak.filter((r) => r.expected === 'WEAK').length;
const precision = predictedWeak.length ? truePosWeak / predictedWeak.length : 1;
const recall = expectedWeak.length ? truePosWeak / expectedWeak.length : 1;

// Also treat "expected STRONG but predicted OK" as a soft miss (not fatal).
const strongDowngraded = strong.filter((r) => r.actual !== 'STRONG');

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

console.log('\n=== CV Bullet Linter — Eval ===');
console.log(`Golden set: ${total} bullets`);
console.log(`Accuracy:   ${correct}/${total} (${pct(correct / total)})`);
console.log(`WEAK precision: ${pct(precision)}  |  WEAK recall: ${pct(recall)}`);
console.log(`STRONG→WEAK false positives: ${strongFalseWeak.length}/${strong.length}  (must be 0)`);
console.log(`STRONG downgraded to OK: ${strongDowngraded.length}/${strong.length}  (soft)`);

if (rows.some((r) => !r.ok)) {
  console.log('\nMismatches:');
  for (const r of rows.filter((x) => !x.ok)) {
    console.log(`  [exp ${r.expected} / got ${r.actual}]  ${r.text.slice(0, 72)}`);
  }
}

// ── Gates ──
const failures: string[] = [];
if (strongFalseWeak.length > 0) failures.push(`${strongFalseWeak.length} strong bullet(s) marked WEAK — this is the fatal error`);
if (precision < 0.8) failures.push(`WEAK precision ${pct(precision)} < 80% (too many false alarms)`);
if (correct / total < 0.8) failures.push(`accuracy ${pct(correct / total)} < 80%`);

if (failures.length) {
  console.error('\n❌ EVAL FAILED:');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('\n✅ Eval passed.\n');
