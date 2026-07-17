/**
 * language-dedupe-grammar.mjs — one grammar concept, one card.
 * ─────────────────────────────────────────────────────────────────────────────
 * Grammar was generated in several passes that merged, so the SAME point can sit
 * under two different titles the exact-title dedup never caught — e.g. JA N5 has
 * both "Trợ từ は (wa)" and "Trợ từ は — nêu chủ đề", both "Vị ngữ です" and
 * "〜です／だ — là". This finds those conceptual duplicates with the LLM (same
 * gateway the content was generated with) and keeps the RICHEST card of each set.
 *
 *   docker exec cuonghoangdev_backend node scripts/language-dedupe-grammar.mjs [--langs ja,en,zh]
 *   docker exec cuonghoangdev_backend node scripts/language-dedupe-grammar.mjs --apply
 *
 * DRY-RUN BY DEFAULT — prints every proposed merge and changes nothing.
 * Only `--apply` deletes.
 *
 * Scope: duplicates are judged WITHIN one (language, level) only. A point that
 * reappears at a higher level is deliberate review, not a duplicate.
 *
 * Which card survives: the RICHEST — longest explanation + most examples + has a
 * "lỗi thường gặp" / "so sánh" note. Tie → the earliest (lowest id). The kept
 * card's `order` is left as-is so it stays where the learner already expects it.
 *
 * Safety: if the model proposes deleting more than MAX_DROP_FRAC of a level, that
 * level is SKIPPED and flagged — a sane dedup never nukes half a syllabus, so a
 * response that does is treated as a bad answer, not obeyed.
 *
 * Runs INSIDE the backend container (dist/ + runtime env). Shares the 5h gateway
 * token window with interview + bulk-gen — run it when those are idle. Best run
 * AFTER a grammar fill so it sees the final set (old + newly generated).
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const { looseJson } = await import('../dist/services/myLanguage.ai.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const LANGS = String(val('--langs', 'ja,en,zh')).split(',').map((s) => s.trim()).filter(Boolean);
const MAX_DROP_FRAC = Number(val('--max-drop', '0.4')); // reject a group set that would delete >40% of a level

const LANG_NAME = { en: 'English', ja: 'Japanese', zh: 'Chinese (Mandarin)' };

// How "complete" a card is — the survivor of a duplicate set is the richest one.
function richness(g) {
  const explLen = g.explanation == null ? 0 : String(typeof g.explanation === 'string' ? g.explanation : JSON.stringify(g.explanation)).length;
  const nEx = Array.isArray(g.examples) ? g.examples.length : 0;
  const mistakes = g.commonMistakes && String(g.commonMistakes).trim() ? 1 : 0;
  const compared = g.comparedWith && String(g.comparedWith).trim() ? 1 : 0;
  return explLen + nEx * 120 + mistakes * 200 + compared * 200;
}

async function findDuplicateGroups(langName, level, rows) {
  // One compact call per level: the model only needs title + structure to judge
  // whether two cards teach the same grammar point.
  const list = rows.map((r) => `${r.id}\t${r.title}\t${(r.structure || '').replace(/\s+/g, ' ').slice(0, 80)}`).join('\n');
  const system =
    `You are a ${langName} language curriculum editor. You are given grammar cards at level ${level}, ` +
    `one per line as "id<TAB>title<TAB>structure". Some cards are DUPLICATES: they teach the exact same ` +
    `grammar point (same particle / pattern / rule) under different wording. Group ONLY true duplicates. ` +
    `Do NOT group cards that are merely related, contrastive, or a more advanced use — those are distinct. ` +
    `Return STRICT JSON: {"groups": [[id,id,...], ...]}. Each group has 2+ ids that are duplicates of each ` +
    `other. Omit ids that have no duplicate. If there are no duplicates, return {"groups": []}.`;
  const user = `Level ${level} cards:\n${list}`;
  let raw = '';
  try {
    const res = await llmComplete({ step: 'generation', feature: 'bulk_gen', system, messages: [{ role: 'user', content: user }], maxTokens: 1500, maxRetries: 2, timeoutMs: 90_000, userId: 1 });
    raw = res.text;
  } catch (e) {
    console.log(`    [!] ${level}: LLM lỗi (${e?.message || e}) — bỏ qua cấp này`);
    return [];
  }
  const parsed = looseJson(raw);
  const groupsRaw = Array.isArray(parsed?.groups) ? parsed.groups : [];
  const validIds = new Set(rows.map((r) => r.id));
  const used = new Set();
  const groups = [];
  for (const g of groupsRaw) {
    if (!Array.isArray(g)) continue;
    // keep only ids that exist at this level and aren't already claimed by another group
    const ids = [...new Set(g.map((x) => Number(x)).filter((n) => validIds.has(n) && !used.has(n)))];
    if (ids.length < 2) continue;
    ids.forEach((n) => used.add(n));
    groups.push(ids);
  }
  return groups;
}

let totalDel = 0;
let totalGroups = 0;
for (const code of LANGS) {
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) { console.log(`[dedupe] bỏ qua ${code}`); continue; }
  const langName = LANG_NAME[code] || code;

  const all = await prisma.langGrammarPoint.findMany({
    where: { languageId: lang.id },
    select: { id: true, level: true, order: true, title: true, structure: true, explanation: true, examples: true, commonMistakes: true, comparedWith: true },
    orderBy: [{ level: 'asc' }, { order: 'asc' }, { id: 'asc' }],
  });

  // Group by level; null/'' level is its own bucket so cards are only compared to peers.
  const byLevel = new Map();
  for (const r of all) {
    const k = r.level || '(null)';
    if (!byLevel.has(k)) byLevel.set(k, []);
    byLevel.get(k).push(r);
  }

  console.log(`\n=== ${code} (${langName}) — ${all.length} điểm, ${byLevel.size} cấp ===`);
  const delIds = [];
  for (const [level, rows] of byLevel) {
    if (rows.length < 2) continue;
    const groups = await findDuplicateGroups(langName, level, rows);
    if (!groups.length) { console.log(`  ${level}: không thấy trùng (${rows.length} điểm)`); continue; }

    // Safety valve: a healthy level never loses ~half its cards. Reject the answer.
    const wouldDrop = groups.reduce((s, g) => s + g.length - 1, 0);
    if (wouldDrop > Math.ceil(rows.length * MAX_DROP_FRAC)) {
      console.log(`  ${level}: ⚠ AI đề xuất xoá ${wouldDrop}/${rows.length} (> ${Math.round(MAX_DROP_FRAC * 100)}%) — nghi trả lời hỏng, BỎ QUA cấp này`);
      continue;
    }

    const byId = new Map(rows.map((r) => [r.id, r]));
    for (const ids of groups) {
      const cards = ids.map((id) => byId.get(id));
      const sorted = [...cards].sort((a, b) => richness(b) - richness(a) || a.id - b.id);
      const keep = sorted[0];
      const drop = sorted.slice(1);
      delIds.push(...drop.map((d) => d.id));
      totalGroups++;
      console.log(
        `  ${level}: GIỮ [#${keep.id}] "${keep.title}" (điểm giàu=${richness(keep)})` +
        `  ✗ xoá: ${drop.map((d) => `[#${d.id}] "${d.title}"`).join(', ')}`,
      );
    }
  }

  if (APPLY && delIds.length) {
    const res = await prisma.langGrammarPoint.deleteMany({ where: { id: { in: delIds } } });
    console.log(`  → ĐÃ XOÁ ${res.count} điểm trùng khỏi ${code}`);
    totalDel += res.count;
  } else {
    totalDel += delIds.length;
  }
}

console.log(
  `\n[dedupe-grammar] ${totalGroups} nhóm trùng. ` +
  (APPLY ? `ĐÃ XOÁ ${totalDel} điểm.` : `THỬ NGHIỆM: sẽ xoá ${totalDel} điểm. Chạy lại với --apply để xoá thật.`),
);
await prisma.$disconnect();
