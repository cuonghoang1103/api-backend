/**
 * codelab-lesson-write.mjs — commit pre-authored Code Lab module lessons.
 * Reads a JSON array of {moduleId, blocks} from stdin and persists each via the
 * validated commitLesson path (same DocBlock normalization as Exp Hub). Used
 * when lessons are authored out of band (e.g. by a direct Opus session).
 *
 *   cat batch.json | docker exec -i cuonghoangdev_backend node scripts/codelab-lesson-write.mjs
 */
import { commitLesson } from '../dist/services/codeLab.lesson.service.js';

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
let items;
try { items = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
catch (e) { console.error('bad JSON on stdin:', String(e?.message || e)); process.exit(1); }
if (!Array.isArray(items)) { console.error('stdin must be a JSON array'); process.exit(1); }

let ok = 0, fail = 0;
for (const it of items) {
  try {
    const r = await commitLesson(1, { moduleId: it.moduleId, blocks: it.blocks, model: 'opus-4.8-session' });
    console.log(`ok  module ${it.moduleId} → ${r.blocks} blocks`);
    ok++;
  } catch (e) {
    console.error(`ERR module ${it.moduleId}: ${String(e?.message || e).slice(0, 160)}`);
    fail++;
  }
}
console.log(`[lesson-write] done: ${ok} ok, ${fail} failed`);
process.exit(0);
