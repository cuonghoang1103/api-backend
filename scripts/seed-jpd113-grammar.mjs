#!/usr/bin/env node
/**
 * Seed the "JPD113" Japanese grammar level in My Language (LangGrammarPoint
 * level='JPD113', sits alongside N5..N1 in /language/ja/grammar). Idempotent:
 * matches a point by (languageId, level, title) — safe to re-run.
 *
 * Usage:
 *   node scripts/seed-jpd113-grammar.mjs           # dry run
 *   node scripts/seed-jpd113-grammar.mjs --apply   # write to DB
 */
import { PrismaClient } from '@prisma/client';
import { GRAMMAR } from '../content/grammar/jpd113-grammar.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// Postgres JSONB does not preserve object key order, so a plain
// JSON.stringify comparison against DB-read examples false-positives on
// every re-run. Stable-stringify (sorted keys) before comparing.
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function main() {
  console.log(`── seed-jpd113-grammar : ${APPLY ? 'APPLY' : 'DRY'} ──`);
  const lang = await prisma.language.findUnique({ where: { code: 'ja' } });
  if (!lang) throw new Error('Japanese language not found (code=ja)');

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const g of GRAMMAR) {
    const existing = await prisma.langGrammarPoint.findFirst({
      where: { languageId: lang.id, level: 'JPD113', title: g.title },
    });

    if (!existing) {
      created++;
      console.log(`  + @${g.order}: ${g.title}`);
      if (APPLY) {
        await prisma.langGrammarPoint.create({
          data: {
            languageId: lang.id,
            level: 'JPD113',
            title: g.title,
            structure: g.structure,
            explanation: g.explanation,
            examples: g.examples,
            commonMistakes: g.commonMistakes || null,
            comparedWith: g.comparedWith || null,
            order: g.order,
          },
        });
      }
      continue;
    }

    // Re-run safe: keep content in sync with the authored file if it changed.
    const changed =
      existing.structure !== g.structure ||
      existing.explanation !== g.explanation ||
      stableStringify(existing.examples) !== stableStringify(g.examples) ||
      existing.commonMistakes !== (g.commonMistakes || null) ||
      existing.comparedWith !== (g.comparedWith || null) ||
      existing.order !== g.order;

    if (!changed) {
      skipped++;
      continue;
    }
    updated++;
    console.log(`  ~ @${g.order}: ${g.title}`);
    if (APPLY) {
      await prisma.langGrammarPoint.update({
        where: { id: existing.id },
        data: {
          structure: g.structure,
          explanation: g.explanation,
          examples: g.examples,
          commonMistakes: g.commonMistakes || null,
          comparedWith: g.comparedWith || null,
          order: g.order,
        },
      });
    }
  }

  console.log(`── done: ${created} new, ${updated} updated, ${skipped} unchanged (${APPLY ? 'APPLIED' : 'DRY RUN — pass --apply to write'}) ──`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
