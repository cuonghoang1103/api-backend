/**
 * exphub-doc-write.mjs — commit pre-generated Exp Hub category docs.
 * Reads a JSON array of {categoryId, blocks} from stdin and writes each via the
 * SAME validated path the admin UI uses (commitCategoryDoc → normalize + scrub).
 * Used when docs are authored OUT of band (e.g. by a direct Opus session) and
 * just need persisting. Idempotent per category (overwrites its doc).
 *
 *   cat batch.json | docker exec -i cuonghoangdev_backend node scripts/exphub-doc-write.mjs
 */
import { commitCategoryDoc } from '../dist/services/snippets.aiDoc.service.js';

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
    const r = await commitCategoryDoc(1, { categoryId: it.categoryId, blocks: it.blocks, model: 'opus-4.8-session', lang: 'EN' });
    console.log(`ok  cat ${it.categoryId} → ${r.blocks} blocks`);
    ok++;
  } catch (e) {
    console.error(`ERR cat ${it.categoryId}: ${String(e?.message || e).slice(0, 160)}`);
    fail++;
  }
}
console.log(`[write] done: ${ok} ok, ${fail} failed`);
process.exit(0);
