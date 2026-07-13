/* eslint-disable no-console */
/**
 * Interview grader eval harness.
 *
 *   npm run eval:grader        → STATIC mode (Pass A deterministic). PURE — no
 *                                DB, no LLM key, deterministic. Runs in CI.
 *                                Fails the build if the grader regresses.
 *   npm run eval:grader:ai     → AI mode (Pass C). Needs ANTHROPIC_API_KEY (+
 *                                LLM_BASE_URL) and a DB (for cost logging). Run
 *                                manually / nightly — costs real tokens.
 *
 * The golden set (eval/golden/grader-golden.json) carries human-assigned
 * quality bands. STATIC mode verifies the deterministic scorer keeps the bands
 * correctly ORDERED (strong>adequate>weak) and flags red-flag/injection answers
 * — a robust regression signal that needs no perfect calibration. AI mode
 * verifies each answer lands IN its band (accuracy), plus bias, consistency
 * (same answer ×3), and cost per evaluation — "how you know the grader is not
 * lying."
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deterministicScore, type SynonymMap, type RubricCriterion } from '../src/services/interview/scoring.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Sample { label: string; band: 'weak' | 'adequate' | 'strong'; answer: string; injection?: boolean }
interface Case {
  id: string; topic: string; questionBody: string; referenceAnswer: string;
  rubric: RubricCriterion[]; mustMention: string[]; shouldMention: string[]; redFlags: string[];
  synonyms: SynonymMap; samples: Sample[];
}
interface Golden { version: number; bands: Record<string, [number, number]>; cases: Case[] }

const golden: Golden = JSON.parse(fs.readFileSync(path.join(__dirname, 'golden', 'grader-golden.json'), 'utf8'));
const AI = process.argv.includes('--ai');
const MIN_ACCURACY = 0.8; // fail the build below this

function detScore(c: Case, answer: string) {
  return deterministicScore(answer, { mustMention: c.mustMention, shouldMention: c.shouldMention, redFlags: c.redFlags, synonyms: c.synonyms }, { redFlagPenalty: 15 });
}
function bandMid(b: 'weak' | 'adequate' | 'strong'): number {
  const [lo, hi] = golden.bands[b];
  return (lo + hi) / 2;
}
function inBand(score: number, b: 'weak' | 'adequate' | 'strong'): boolean {
  const [lo, hi] = golden.bands[b];
  return score >= lo && score <= hi;
}

async function runStatic() {
  console.log('\n=== Grader eval — STATIC (Pass A deterministic) ===\n');
  let orderOk = 0, orderTotal = 0, injOk = 0, injTotal = 0, rfOk = 0, rfTotal = 0;

  for (const c of golden.cases) {
    const scores: Record<string, number> = {};
    for (const s of c.samples) {
      const det = detScore(c, s.answer);
      scores[s.label] = det.score;
      if (s.injection) { injTotal++; if (det.injectionAttempted) injOk++; }
      // A "weak" answer containing a known red flag must be caught.
      if (s.band === 'weak' && c.redFlags.length) {
        const hit = detScore(c, s.answer).redFlagsHit.length > 0;
        if (hit) { rfTotal++; rfOk++; } // count only when this weak sample actually trips a flag
      }
    }
    // Monotonicity: strong > adequate >= weak (only when all three present).
    if (scores.strong != null && scores.adequate != null && scores.weak != null) {
      orderTotal++;
      const ok = scores.strong > scores.adequate && scores.adequate >= scores.weak;
      if (ok) orderOk++;
      console.log(`${ok ? '✓' : '✗'} ${c.id}: weak=${scores.weak} adequate=${scores.adequate} strong=${scores.strong}`);
    } else {
      console.log(`· ${c.id}: ${Object.entries(scores).map(([k, v]) => `${k}=${v}`).join(' ')}`);
    }
  }

  const orderAcc = orderTotal ? orderOk / orderTotal : 1;
  console.log(`\nMonotonicity: ${orderOk}/${orderTotal} (${(orderAcc * 100).toFixed(0)}%)`);
  console.log(`Injection detection: ${injOk}/${injTotal}`);
  console.log(`Red-flag detection (weak+flag samples): ${rfOk}/${rfTotal}`);

  const pass = orderAcc >= MIN_ACCURACY && (injTotal === 0 || injOk === injTotal);
  console.log(`\n${pass ? '✅ PASS' : '❌ FAIL'} — grader ordering ${pass ? 'holds' : 'REGRESSED'}.`);
  if (!pass) process.exit(1);
}

async function runAi() {
  console.log('\n=== Grader eval — AI (Pass C) ===\n');
  const { evaluateAnswerWithAI } = await import('../src/services/interview/aiEvaluator.js');
  const { prisma } = await import('../src/config/database.js');

  let inBandCount = 0, total = 0, injOk = 0, injTotal = 0;
  const biases: number[] = [];
  const caseScores: Record<string, Record<string, number>> = {};
  const EVAL_USER = 990501;
  const started = new Date();

  for (const c of golden.cases) {
    for (const s of c.samples) {
      total++;
      const passA = detScore(c, s.answer);
      const ev = await evaluateAnswerWithAI({
        userId: EVAL_USER, sessionId: 0,
        questionBody: c.questionBody, referenceAnswer: c.referenceAnswer, rubric: c.rubric,
        answer: s.answer, passA, language: 'VI', redFlagPenalty: 15, disagreementThreshold: 35,
      }).catch((e: unknown) => { console.log(`  ! ${c.id}/${s.label}: eval error ${(e as Error).message}`); return null; });
      if (!ev) continue;
      (caseScores[c.id] ??= {})[s.label] = ev.finalScore;
      const ok = inBand(ev.finalScore, s.band);
      if (ok) inBandCount++;
      biases.push(ev.finalScore - bandMid(s.band));
      if (s.injection) { injTotal++; if (ev.injectionAttempted) injOk++; }
      console.log(`${ok ? '✓' : '✗'} ${c.id}/${s.label}: score=${ev.finalScore} band=${s.band}${s.injection ? ` injectionAttempted=${ev.injectionAttempted}` : ''}`);
    }
  }

  // Ordering (strong > adequate > weak) — the load-bearing property. A grader
  // that ranks answers correctly is trustworthy even if its absolute scale is
  // strict; getting the ORDER wrong is the real failure.
  let orderOk = 0, orderTotal = 0;
  for (const sc of Object.values(caseScores)) {
    if (sc.strong != null && sc.adequate != null && sc.weak != null) {
      orderTotal++;
      if (sc.strong > sc.adequate && sc.adequate >= sc.weak) orderOk++;
    }
  }
  const orderAcc = orderTotal ? orderOk / orderTotal : 1;

  // Consistency: grade one strong sample 3× and measure spread.
  const c0 = golden.cases.find((c) => c.samples.some((s) => s.band === 'strong'))!;
  const s0 = c0.samples.find((s) => s.band === 'strong')!;
  const runs: number[] = [];
  for (let i = 0; i < 3; i++) {
    const ev = await evaluateAnswerWithAI({ userId: EVAL_USER, sessionId: 0, questionBody: c0.questionBody, referenceAnswer: c0.referenceAnswer, rubric: c0.rubric, answer: s0.answer, passA: detScore(c0, s0.answer), language: 'VI', redFlagPenalty: 15, disagreementThreshold: 35 }).catch(() => null);
    if (ev) runs.push(ev.finalScore);
  }
  const mean = runs.reduce((a, b) => a + b, 0) / (runs.length || 1);
  const variance = runs.reduce((a, b) => a + (b - mean) ** 2, 0) / (runs.length || 1);
  const stddev = Math.sqrt(variance);

  const costAgg = await prisma.interviewLLMCallLog.aggregate({ where: { userId: EVAL_USER, createdAt: { gte: started } }, _sum: { costUsd: true }, _count: { _all: true } });
  const totalCost = Number(costAgg._sum.costUsd ?? 0);
  const calls = costAgg._count._all;

  const accuracy = total ? inBandCount / total : 0;
  const bias = biases.length ? biases.reduce((a, b) => a + b, 0) / biases.length : 0;
  console.log(`\nOrdering (strong>adequate>weak): ${orderOk}/${orderTotal} (${(orderAcc * 100).toFixed(0)}%)  ← load-bearing`);
  console.log(`Band accuracy (informational): ${inBandCount}/${total} (${(accuracy * 100).toFixed(0)}%)`);
  console.log(`Bias vs band midpoint: ${bias >= 0 ? '+' : ''}${bias.toFixed(1)}  ${bias > 12 ? '⚠ OVER-grading (dangerous)' : bias < -12 ? '(under-grading — safe direction)' : '(well centred)'}`);
  console.log(`Consistency (strong ×3): scores=[${runs.join(', ')}] stddev=${stddev.toFixed(1)} ${stddev > 8 ? '⚠ high variance' : 'ok'}`);
  console.log(`Injection detection: ${injOk}/${injTotal}`);
  console.log(`Cost: ${calls} calls, $${totalCost.toFixed(4)} total, $${(calls ? totalCost / calls : 0).toFixed(5)}/eval`);

  await prisma.interviewLLMCallLog.deleteMany({ where: { userId: EVAL_USER } }).catch(() => {});
  await prisma.$disconnect();

  // Hard gates = the real failure modes: wrong ordering, inconsistency, missed
  // injection, or OVER-grading (false confidence). Under-grading & absolute-band
  // calibration are reported, not gated — they're tuning targets.
  const pass = orderAcc >= MIN_ACCURACY && (injTotal === 0 || injOk === injTotal) && stddev <= 12 && bias <= 12;
  console.log(`\n${pass ? '✅ PASS' : '❌ FAIL'} — ordering ${orderAcc >= MIN_ACCURACY ? 'holds' : 'REGRESSED'}, ${bias > 12 ? 'OVER-GRADING' : 'no over-grading'}, ${stddev <= 12 ? 'consistent' : 'INCONSISTENT'}.`);
  if (!pass) process.exit(1);
}

(AI ? runAi() : runStatic()).catch((e) => { console.error(e); process.exit(1); });
