/** Web Foundations · deck bài 9.3 — interface và type. Output thật: _demo/_t9/chay.sh (tsc 5.9, Node 22.23). */
import { deckWf, ts, term, box, two, tbl } from './_wf-bai.mjs';

export const deck = { key: 'wf-9-3', code: 'WF 9.3', title: 'Interfaces and types', sub: 'Web Foundations · Chapter 9' };

export const slides = deckWf({ chuong: 'Chapter 9 — TypeScript', bai: '9.3' }, [
  { cover: true, t: 'Interfaces and types', sub: 'Name the shape of your data once' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Write <b>interfaces</b>: required, ?, readonly</li>
    <li><b>Extend</b> and combine shapes</li>
    <li>Derive types: <b>Omit · Partial · Record</b></li>
    <li>Model states with a <b>kind</b> field</li>
    <li>Choose <b>interface</b> or <b>type</b></li></ul>` },

  { t: 'Describing a shape', giua: true, body: ts('_t9/9-3/shapes.ts', null, { gon: true, chi: [1, 10] }) + tbl(['Syntax', 'Means'], [['name: string', 'required'], ['category?: string', 'string | undefined'], ['readonly id', 'set once']]) },

  { t: 'Five mistakes shapes catch', giua: true, body: term('_t9/out/shapes', null, { title: 'npx tsc --noEmit --strict shapes.ts' }) + box('colour', 'misspelled extra field — silently ignored in JS, an error here', 'bad') },

  { t: 'extends and intersections', to: true, giua: true, body: two(box('interface', '<code class="i">interface Digital extends Product { url: string }</code>', 'info'), box('type', '<code class="i">type Digital = Product &amp; { url: string }</code>', 'info')) + box('Structural typing', 'right fields = right type · extra fields slip in via variables · types never strip fields', 'bad') + tbl(['Want', 'Write'], [['B = A + more', 'extends / &amp;'], ['only some fields', "Pick&lt;A, 'id' | 'name'&gt;"], ['all optional', 'Partial&lt;A&gt;']]) },

  { t: 'Typing the Chapter 6 API', giua: true, body: ts('_t9/9-3/api-types.ts', null, { gon: true, chi: [8, 22] }) + tbl(['Utility', 'For'], [["Omit&lt;Product, 'id'&gt;", 'POST body'], ['Partial&lt;…&gt;', 'PATCH body'], ['Record&lt;string, number&gt;', 'dictionary']]) },

  { t: 'One of several shapes', giua: true, body: term('_t9/out/kinds', null, { title: 'kind + switch + never' }) + box('never', 'a new kind added → every switch that forgot it fails to compile', 'ok') },

  { t: 'interface or type?', to: true, giua: true, body: tbl(['', 'interface', 'type'], [['object shapes', '✅', '✅'], ['unions, literals', '❌', '✅'], ['function types', 'awkward', '✅'], ['extend', 'extends', '&'], ['declaration merging', '✅', '❌']]) + box('Team rule', 'interface for objects, type for the rest — be consistent', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>?, readonly, extends</li>
    <li>Structural: fields, not names</li>
    <li>Derive with Omit / Partial / Record</li>
    <li>kind + never for states</li></ul>`,
    box('Practice (35 min)', 'Type a library API (Book, Genre), derive create/update inputs, model LoanResult with kind.<br><br><b>Done when</b>: clean compile; a new kind gives a never error.', 'ok')) },
]);
