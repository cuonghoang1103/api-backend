/**
 * Un-escape HTML entities that leaked into Code Lab source blocks.
 *
 * WHY THIS EXISTS
 * ---------------
 * The exercise generators write their code into JSON. When a generator copies a
 * signature or a URL pattern out of an HTML brief, the entities come with it —
 * so the "solution" contains `List&lt;T&gt;` where the language needs `List<T>`,
 * and `path('api/events/&lt;int:event_id&gt;/')` where Django needs a real route.
 *
 * In a comment that merely reads wrong. In code it does not run. Either way the
 * learner cannot tell whether the fault is theirs or ours, which is the worst
 * way for teaching material to fail.
 *
 * WHAT IT WILL NOT TOUCH
 * ----------------------
 * Exercises that are ABOUT escaping. In "Sanitize User Input for Safe Display",
 * the line `('<', '&lt;')` is the correct answer, and rewriting it would break a
 * working exercise to fix a false positive. Those are matched by title and
 * skipped; the list is printed so the decision stays visible.
 *
 * Only `code` fields inside solutionCodeJson / starterCodeJson are rewritten.
 * problemHtml is HTML — entities belong there.
 *
 *   node scripts/codelab-fix-escaped-code.mjs            # dry run, changes nothing
 *   node scripts/codelab-fix-escaped-code.mjs --apply    # write
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

/** An exercise whose SUBJECT is escaping — its entities are the lesson. */
const TEACHES_ESCAPING = /sanitiz|escap|\bxss\b|html entit|encode|injection/i;

const ENTITY = /&(lt|gt|amp|quot|apos|#39|#x27);/g;
const CHAR = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'", '#39': "'", '#x27': "'" };

/** `&amp;lt;` is a double escape — decode until it stops changing. */
function unescapeAll(text) {
  let out = text;
  for (let i = 0; i < 5; i++) {
    const next = out.replace(ENTITY, (_, name) => CHAR[name]);
    if (next === out) break;
    out = next;
  }
  return out;
}

function fixBlocks(json) {
  if (!Array.isArray(json)) return { changed: 0, blocks: json };
  let changed = 0;
  const blocks = json.map((b) => {
    if (!b || typeof b !== 'object' || typeof b.code !== 'string') return b;
    const fixed = unescapeAll(b.code);
    if (fixed === b.code) return b;
    changed++;
    return { ...b, code: fixed };
  });
  return { changed, blocks };
}

const rows = await prisma.codeExercise.findMany({
  select: { id: true, title: true, solutionCodeJson: true, starterCodeJson: true, track: { select: { slug: true } } },
});

const skipped = [];
const targets = [];

for (const r of rows) {
  const sol = Array.isArray(r.solutionCodeJson) ? r.solutionCodeJson : [];
  const st = Array.isArray(r.starterCodeJson) ? r.starterCodeJson : [];
  const text = [...sol, ...st].map((b) => String(b?.code ?? '')).join('\n');
  if (!ENTITY.test(text)) { ENTITY.lastIndex = 0; continue; }
  ENTITY.lastIndex = 0;

  if (TEACHES_ESCAPING.test(r.title)) { skipped.push(r); continue; }
  targets.push(r);
}

console.log(`Bỏ qua ${skipped.length} bài DẠY về escaping (thực thể ở đó là nội dung bài):`);
for (const s of skipped) console.log(`   ~ ${s.id} [${s.track.slug}] ${s.title.slice(0, 60)}`);

console.log(`\nSẽ sửa ${targets.length} bài:`);
let blocksChanged = 0;
for (const r of targets) {
  const sol = fixBlocks(r.solutionCodeJson);
  const st = fixBlocks(r.starterCodeJson);
  blocksChanged += sol.changed + st.changed;
  console.log(`   ${APPLY ? '✓' : '~'} ${r.id} [${r.track.slug}] ${sol.changed}+${st.changed} khối — ${r.title.slice(0, 52)}`);
  if (APPLY) {
    await prisma.codeExercise.update({
      where: { id: r.id },
      data: {
        ...(sol.changed ? { solutionCodeJson: sol.blocks } : {}),
        ...(st.changed ? { starterCodeJson: st.blocks } : {}),
      },
    });
  }
}

console.log(`\n${APPLY ? 'ĐÃ SỬA' : 'CHẠY KHÔ'}: ${targets.length} bài, ${blocksChanged} khối mã.`);
if (!APPLY) console.log('Thêm --apply để ghi thật.');
await prisma.$disconnect();
