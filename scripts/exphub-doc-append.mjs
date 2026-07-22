/**
 * exphub-doc-append.mjs — APPEND new blocks to an Exp Hub category doc.
 * Unlike exphub-doc-write.mjs (which REPLACES the doc), this LOADS the existing
 * doc_blocks, concatenates the new blocks after them, and re-commits the merged
 * array via the same validated path (commitCategoryDoc → normalize + scrub).
 * Used to DEEPEN hand-authored docs without losing or duplicating what's there.
 *
 * stdin: JSON array of { categoryId, blocks }  (blocks = the NEW blocks to add)
 *   cat batch.json | docker exec -i cuonghoangdev_backend node scripts/exphub-doc-append.mjs
 */
import { commitCategoryDoc } from '../dist/services/snippets.aiDoc.service.js';
import { prisma } from '../dist/config/database.js';

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
let items;
try {
  items = JSON.parse(Buffer.concat(chunks).toString('utf8'));
} catch (e) {
  console.error('bad JSON on stdin:', String(e?.message || e));
  process.exit(1);
}
if (!Array.isArray(items)) { console.error('stdin must be a JSON array'); process.exit(1); }

let ok = 0, fail = 0;
for (const it of items) {
  try {
    const cat = await prisma.snippetCategory.findUnique({
      where: { id: it.categoryId },
      select: { docBlocks: true, name: true },
    });
    if (!cat) { console.error(`ERR cat ${it.categoryId}: not found`); fail++; continue; }
    const existing = Array.isArray(cat.docBlocks) ? cat.docBlocks : [];
    const newBlocks = Array.isArray(it.blocks) ? it.blocks : [];
    const merged = [...existing, ...newBlocks];
    const r = await commitCategoryDoc(1, { categoryId: it.categoryId, blocks: merged, model: 'opus-4.8-session', lang: 'EN' });
    console.log(`ok  cat ${it.categoryId} (${cat.name}): ${existing.length} + ${newBlocks.length} → ${r.blocks} blocks`);
    ok++;
  } catch (e) {
    console.error(`ERR cat ${it.categoryId}: ${String(e?.message || e).slice(0, 160)}`);
    fail++;
  }
}
console.log(`[append] done: ${ok} ok, ${fail} failed`);
process.exit(0);
