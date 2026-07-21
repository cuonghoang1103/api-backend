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

/**
 * Which entities are the lesson, decided per LINE and from the code itself.
 *
 * The title was the wrong thing to ask. /injection/ matched "Dependency
 * Injection Container" and "Generate Dependency Injection Module with KSP" —
 * two exercises with nothing to do with escaping, whose `Map&lt;Token&gt;`
 * stayed broken because the regex liked their names. It also skipped a Room
 * database exercise for saying "SQL Injection Prevention" in the title while
 * the only entities in it were `List&lt;Note&gt;` generics.
 *
 * What actually marks a demonstration is the line showing BOTH forms at once:
 *
 *   assert sanitize_html('<script>alert(1)</script>') == '&lt;script&gt;...'
 *
 * A raw angle bracket on the same line as an entity means the contrast is the
 * point. Generics never look like that — `List&lt;Note&gt;` has no raw `<`.
 */
const DEMONSTRATES_ESCAPING = (line) => /[<>]/.test(line);

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

/** Un-escape line by line, leaving the demonstration lines exactly as they are. */
function unescapeCode(code) {
  let kept = 0;
  const out = code.split('\n').map((line) => {
    ENTITY.lastIndex = 0;
    if (!ENTITY.test(line)) return line;
    ENTITY.lastIndex = 0;
    if (DEMONSTRATES_ESCAPING(line)) { kept++; return line; }
    return unescapeAll(line);
  }).join('\n');
  return { code: out, kept };
}

function fixBlocks(json) {
  if (!Array.isArray(json)) return { changed: 0, kept: 0, blocks: json };
  let changed = 0, kept = 0;
  const blocks = json.map((b) => {
    if (!b || typeof b !== 'object' || typeof b.code !== 'string') return b;
    const r = unescapeCode(b.code);
    kept += r.kept;
    if (r.code === b.code) return b;
    changed++;
    return { ...b, code: r.code };
  });
  return { changed, kept, blocks };
}

const rows = await prisma.codeExercise.findMany({
  select: { id: true, title: true, solutionCodeJson: true, starterCodeJson: true, track: { select: { slug: true } } },
});

const targets = [];

for (const r of rows) {
  const sol = Array.isArray(r.solutionCodeJson) ? r.solutionCodeJson : [];
  const st = Array.isArray(r.starterCodeJson) ? r.starterCodeJson : [];
  const text = [...sol, ...st].map((b) => String(b?.code ?? '')).join('\n');
  if (!ENTITY.test(text)) { ENTITY.lastIndex = 0; continue; }
  ENTITY.lastIndex = 0;
  targets.push(r);
}

console.log(`Sẽ sửa ${targets.length} bài (dòng minh hoạ escaping được giữ nguyên):`);
let blocksChanged = 0, linesKept = 0;
for (const r of targets) {
  const sol = fixBlocks(r.solutionCodeJson);
  const st = fixBlocks(r.starterCodeJson);
  blocksChanged += sol.changed + st.changed;
  linesKept += sol.kept + st.kept;
  const keep = sol.kept + st.kept ? `, giữ ${sol.kept + st.kept} dòng` : '';
  console.log(`   ${APPLY ? '✓' : '~'} ${r.id} [${r.track.slug}] ${sol.changed}+${st.changed} khối${keep} — ${r.title.slice(0, 46)}`);
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

console.log(`\n${APPLY ? 'ĐÃ SỬA' : 'CHẠY KHÔ'}: ${targets.length} bài, ${blocksChanged} khối mã, giữ nguyên ${linesKept} dòng minh hoạ escaping.`);
if (!APPLY) console.log('Thêm --apply để ghi thật.');
await prisma.$disconnect();
