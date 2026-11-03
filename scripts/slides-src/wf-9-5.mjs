/** Web Foundations · deck bài 9.5 — TypeScript trong dự án thật. Output thật: _demo/_t9/chay.sh (tsc 5.9, Node 22.23, tsx, zod). */
import { deckWf, ts, term, box, two, tbl, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-9-5', code: 'WF 9.5', title: 'TypeScript in a real project', sub: 'Web Foundations · Chapter 9' };

export const slides = deckWf({ chuong: 'Chapter 9 — TypeScript', bai: '9.5' }, [
  { cover: true, t: 'TypeScript in a real project', sub: 'tsconfig, builds, packages and the boundary' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read a <b>tsconfig.json</b></li>
    <li>Explain what <b>strict</b> adds</li>
    <li><b>Build</b> to JavaScript and run it</li>
    <li>Add <b>@types</b> for packages</li>
    <li><b>Validate</b> data at the boundary</li></ul>` },

  { t: 'Strict mode matters', giua: true, body: term('_t9/out/strict', null, { title: 'legacy.ts — strict off vs on' }) + box('0 → 7 errors', 'and user.name (line 9) still passes: findUser returns any', 'bad') },

  { t: 'tsconfig.json', giua: true, body: tbl(['Setting', 'Value', 'Means'], [['target', 'ES2022', 'JS to produce'], ['module', 'NodeNext', "Node's ESM rules"], ['strict', 'true', 'always'], ['rootDir → outDir', 'src → dist', 'source in, JS out'], ['types', '["node"]', 'load @types/node']]) + two(box('Never edit dist/', 'it is regenerated on every build', 'bad'), box('npm scripts', 'dev · typecheck · build · start', 'ok')) },

  { t: 'Build, then run JavaScript', giua: true, body: term(null, OUT_P(), { title: 'tsc -p . → node dist/index.js' }) + box('Fail fast', 'missing DATABASE_URL stops at start-up, not on the first query', 'ok') },

  { t: 'Types for packages', giua: true, body: term('_t9/out/types-node', null, { title: '"types": [] — no @types/node' }) + two(box('Ships types', 'zod, Prisma, Axios', 'ok'), box('Needs @types', 'npm i -D @types/node @types/express', 'info')) + box('Read the message', 'tsc says exactly what to install', 'ok') },

  { t: 'Running TypeScript directly', giua: true, body: term('_t9/out/enum', null, { title: 'Node strip-types vs tsx' }) + tbl(['Tool', 'Checks types?'], [['tsc', '✅'], ['node --experimental-strip-types', '❌ (no enum)'], ['tsx / Vite', '❌']]) },

  { t: 'Validate at the boundary', giua: true, body: ts('_t9/9-5/validate.ts', null, { gon: true, chi: [2, 16] }) + term('_t9/out/validate', null, { title: 'npx tsx validate.ts' }) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>strict: true, always</li>
    <li>tsc -p . → dist → node</li>
    <li>tsc --noEmit in scripts + CI</li>
    <li>zod at the edge, z.infer inside</li></ul>`,
    box('Practice (45 min)', 'A project from scratch: tsconfig, dev/typecheck/build/start scripts, zod config, fix legacy.ts.<br><br><b>Done when</b>: typecheck exits 0 and start fails cleanly without DATABASE_URL.', 'ok')) },
]);

function OUT_P() {
  const s = OUT['_t9/out/project'];
  return s.slice(s.indexOf('$ npx tsc -p .'));
}
