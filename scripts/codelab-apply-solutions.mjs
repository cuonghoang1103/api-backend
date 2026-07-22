/**
 * codelab-apply-solutions.mjs — write verified solutions back to their exercises.
 * ─────────────────────────────────────────────────────────────────────────────
 * Companion to codelab-regen-py-candidates.mjs. Takes a file of solutions that
 * have ALREADY been verified by running them, and updates each exercise's
 * solutionCodeJson (and starterCodeJson when present). The row is UPDATED by id,
 * so slug and any CodeProgress survive. Nothing here is generated — this step
 * only persists what a run has already proven.
 *
 *   node scripts/codelab-apply-solutions.mjs --in /tmp/py-verified.json           # dry
 *   node scripts/codelab-apply-solutions.mjs --in /tmp/py-verified.json --apply
 *
 * --in = [{ "id": 327, "solution": [...], "starter": [...]|null }, ...]
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const IN = val('--in');
if (!IN) { console.error('cần --in <file>'); process.exit(1); }

const items = JSON.parse(readFileSync(IN, 'utf8'));
let ok = 0;
for (const it of items) {
  if (!it || !Number.isInteger(it.id) || !Array.isArray(it.solution) || !it.solution.length) {
    console.log(`   ⊘ bỏ qua mục không hợp lệ: ${JSON.stringify(it).slice(0, 60)}`); continue;
  }
  const data = { solutionCodeJson: it.solution };
  if (Array.isArray(it.starter) && it.starter.length) data.starterCodeJson = it.starter;
  if (APPLY) await prisma.codeExercise.update({ where: { id: it.id }, data });
  console.log(`   ${APPLY ? '✓' : '~'} ${it.id} → ${it.solution.length} file${data.starterCodeJson ? ' (+starter)' : ''} — ${(it.title || '').slice(0, 44)}`);
  ok++;
}
console.log(`[apply] ${APPLY ? 'ghi' : 'sẽ ghi'} ${ok}/${items.length}`);
if (!APPLY) console.log('[apply] CHẠY KHÔ — thêm --apply để ghi thật');
await prisma.$disconnect();
