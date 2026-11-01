// What F2 (Rename Symbol) does, using the same TypeScript language service that powers
// JavaScript IntelliSense in VS Code — compared with a plain text find-and-replace.
import ts from 'typescript';

const file = 'shop.js';
const code = `let total = 0;              // running total
const label = "total";
function addPrice(price) {
  total += price;
  const subtotal = price * 2;
  return subtotal;
}
function report() {
  const total = 99;           // a different variable that happens to share the name
  return total;
}
console.log(label, total);
`;

const host = {
  getScriptFileNames: () => [file],
  getScriptVersion: () => '1',
  getScriptSnapshot: (f) => (f === file ? ts.ScriptSnapshot.fromString(code) : undefined),
  getCurrentDirectory: () => '/',
  getCompilationSettings: () => ({ allowJs: true }),
  getDefaultLibFileName: () => 'lib.d.ts',
  fileExists: (f) => f === file,
  readFile: (f) => (f === file ? code : undefined),
};
const service = ts.createLanguageService(host);

const lineOf = (pos) => code.slice(0, pos).split('\n').length;
const textHits = [...code.matchAll(/total/g)].map((m) => lineOf(m.index));
console.log('Find "total" (text search):', textHits.length, 'hits on lines', textHits.join(', '));

const where = code.indexOf('total');                 // the cursor on the first `total`
const renames = service.findRenameLocations(file, where, false, false, {});
console.log('F2 rename (symbol)        :', renames.length, 'places on lines', renames.map((r) => lineOf(r.textSpan.start)).join(', '));
