/**
 * exphub-seed-guide.mjs — upsert ONE Exp Hub guide (SnippetCategory + Snippet)
 * from a spec file. Idempotent by slug. Used for per-subject setup guides that
 * Academy courses link to (e.g. PRF192 → /exp-hub/prf192-cai-dat-moi-truong-c).
 *
 *   node scripts/exphub-seed-guide.mjs --file ./content/exphub/PRF192.mjs --apply
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const FILE = val('--file');
if (!FILE) { console.error('cần --file <spec.mjs>'); process.exit(1); }

const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const { category: cat, snippet: sn } = spec;
console.log(`── exphub-seed ${sn.slug} : ${APPLY ? 'APPLY' : 'DRY'} ──`);

/* Category (by slug) */
let category = await prisma.snippetCategory.findUnique({ where: { slug: cat.slug } });
if (!category) {
  console.log(`  + category ${cat.slug} "${cat.name}"`);
  if (APPLY) category = await prisma.snippetCategory.create({
    data: { slug: cat.slug, name: cat.name, icon: cat.icon ?? null, description: cat.description ?? null },
  });
} else console.log(`  = category ${cat.slug} (id ${category.id})`);

/* Snippet (by slug) — create or fully update */
const blocks = sn.codeBlocks || [];
const firstCode = blocks[0]?.code ?? '';
const data = {
  title: sn.title,
  description: sn.description ?? null,
  kind: sn.kind ?? 'NOTE',
  language: sn.language ?? '',
  code: firstCode,
  codeBlocks: blocks.length ? blocks : undefined,
  noteContent: sn.noteContent ?? null,
  explanation: sn.explanation ?? null,
  referenceUrl: sn.referenceUrl ?? null,
  repoUrl: sn.repoUrl ?? null,
  youtubeUrl: sn.youtubeUrl ?? null,
  status: sn.status ?? 'PUBLISHED',
  categoryId: category?.id ?? null,
};

const existing = await prisma.snippet.findUnique({ where: { slug: sn.slug } });
if (!existing) {
  console.log(`  + snippet ${sn.slug} [${data.kind}/${data.status}] "${sn.title}"`);
  if (APPLY) await prisma.snippet.create({ data: { slug: sn.slug, ...data } });
} else {
  console.log(`  ~ snippet ${sn.slug} exists (id ${existing.id}) → update`);
  if (APPLY) await prisma.snippet.update({ where: { id: existing.id }, data });
}

console.log(`\n${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
await prisma.$disconnect();
