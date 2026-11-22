// check-layers.mjs — the architecture rules, as a test that CI runs
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const RULES = [
  { file: /[.]routes[.]js$/, forbid: /lib[/]db[.]js|[.]repo[.]js/, why: 'routes call services, never the database or a repo' },
  { file: /features[/]([^/]+)[/]/, forbidOtherFeatureRepo: true, why: 'a feature reads another feature only through its service' },
];
const files = (await readdir('src', { recursive: true })).filter((f) => f.endsWith('.js')).map((f) => path.join('src', f));
let bad = 0;
for (const f of files) {
  const imports = [...(await readFile(f, 'utf8')).matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  for (const imp of imports) {
    if (RULES[0].file.test(f) && RULES[0].forbid.test(imp)) { bad++; console.log('✗', f, 'imports', imp, '-', RULES[0].why); }
    const mine = f.match(RULES[1].file)?.[1];
    const other = imp.match(/[.][.][/]([^/]+)[/][^/]+[.]repo[.]js$/)?.[1];
    if (mine && other && other !== mine) { bad++; console.log('✗', f, 'imports', imp, '-', RULES[1].why); }
  }
}
console.log(bad ? bad + ' violation(s)' : '✓ layers clean', '(' + files.length + ' files)');
process.exitCode = bad ? 1 : 0;
