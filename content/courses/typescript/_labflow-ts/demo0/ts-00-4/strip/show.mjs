// Print what Node 22 actually runs for throw.ts (the same function Node uses internally).
import { stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('./throw.ts', import.meta.url), 'utf8');
const out = stripTypeScriptTypes(src);
out.split('\n').forEach((line, i) => console.log(String(i + 1).padStart(2) + ' | ' + line));
