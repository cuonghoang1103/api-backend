// Generator for MongoDB module 415 (query-operators-and-advanced-filtering) — 10 exercises.
// Track language is "javascript"; solutions are mongosh commands (valid JS, modern query API,
// map 1:1 to the Node driver). Verified by piping the exact solution strings to a real mongosh
// (mongo:7) and matching its auto-printed results. Integer _id values keep output deterministic.
// Scope: comparison / logical / element / evaluation operators, array queries, dot notation,
// projection ($slice, $elemMatch), sort-skip-limit vs keyset paging, distinct, counting.
// Deliberately excludes: basic CRUD (module 414), aggregation (417), indexing (418), Mongoose (419).
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'mongodb';
const moduleSlug = 'query-operators-and-advanced-filtering';
const L = 'javascript';

// Shared seeds (kept identical wherever a collection is reused so learners build a mental model).
const PRODUCTS = `db.products.drop(); db.products.insertMany([
  { _id: 1, name: "Keyboard", price: 49.9, stock: 12, category: "input" },
  { _id: 2, name: "Mouse", price: 19, stock: 40, category: "input" },
  { _id: 3, name: "Monitor", price: 150, stock: 5, category: "display" },
  { _id: 4, name: "Cable", price: 12, stock: 0, category: "cable" },
  { _id: 5, name: "Desk Pad", price: 30, stock: 7, category: "desk" },
  { _id: 6, name: "Lamp", price: 25, stock: 3 }
])`;

const USERS = `db.users.drop(); db.users.insertMany([
  { _id: 1, name: "ana", age: 30, email: "ana@example.com" },
  { _id: 2, name: "bo", age: "31" },
  { _id: 3, name: "cy", age: null, email: "cy@example.com" },
  { _id: 4, name: "di", email: null },
  { _id: 5, name: "ed", age: 28.5, email: "ed@example.com" }
])`;

const ARTICLES = `db.articles.drop(); db.articles.insertMany([
  { _id: 1, title: "Alpha", tags: ["mongodb", "database"] },
  { _id: 2, title: "Beta", tags: ["database", "sql", "mongodb"] },
  { _id: 3, title: "Gamma", tags: ["mongodb"] },
  { _id: 4, title: "Delta", tags: ["nosql", "database"] },
  { _id: 5, title: "Epsilon", tags: [] }
])`;

const ORDERS = `db.orders.drop(); db.orders.insertMany([
  { _id: 1, customer: "ana", items: [{ sku: "A", qty: 2, price: 10 }, { sku: "B", qty: 5, price: 3 }] },
  { _id: 2, customer: "bo", items: [{ sku: "A", qty: 9, price: 20 }, { sku: "C", qty: 1, price: 50 }] },
  { _id: 3, customer: "cy", items: [{ sku: "D", qty: 6, price: 45 }] },
  { _id: 4, customer: "di", items: [{ sku: "B", qty: 1, price: 3 }] }
])`;

const STUDENTS = `db.students.drop(); db.students.insertMany([
  { _id: 1, name: "Ana", address: { city: "Hanoi", zip: "10000" }, scores: [{ subject: "math", score: 90 }, { subject: "cs", score: 75 }, { subject: "eng", score: 60 }] },
  { _id: 2, name: "Bo", address: { city: "Hue", zip: "53000" }, scores: [{ subject: "math", score: 55 }, { subject: "cs", score: 95 }] },
  { _id: 3, name: "Cy", address: { city: "Hanoi", zip: "10001" }, scores: [{ subject: "eng", score: 88 }] }
])`;

const LEDGER = `db.ledger.drop(); db.ledger.insertMany([
  { _id: 1, code: "OD-01", amount: 10 },
  { _id: 2, code: "OD-02", amount: 20 },
  { _id: 3, code: "OD-03", amount: 30 },
  { _id: 4, code: "OD-04", amount: 40 },
  { _id: 5, code: "OD-05", amount: 50 },
  { _id: 6, code: "OD-06", amount: 60 },
  { _id: 7, code: "OD-07", amount: 70 },
  { _id: 8, code: "OD-08", amount: 80 },
  { _id: 9, code: "OD-09", amount: 90 }
])`;

const CATALOG = `db.catalog.drop(); db.catalog.insertMany([
  { _id: 1, name: "Alpha Laptop", price: 1200, cost: 900, stock: 4, category: "computer", specs: { brand: "Acme", warrantyMonths: 24 }, tags: ["portable", "work"], reviews: [{ user: "ana", rating: 5 }, { user: "bo", rating: 3 }] },
  { _id: 2, name: "Beta Phone", price: 700, cost: 720, stock: 0, category: "phone", specs: { brand: "Acme", warrantyMonths: 12 }, tags: ["portable"], reviews: [{ user: "cy", rating: 4 }] },
  { _id: 3, name: "Gamma Monitor", price: 300, cost: 200, stock: 11, category: "display", specs: { brand: "Vista", warrantyMonths: 36 }, tags: ["desk", "work"], reviews: [{ user: "ana", rating: 2 }, { user: "di", rating: 5 }] },
  { _id: 4, name: "Delta Mouse", price: 25, cost: 30, stock: 60, category: "input", specs: { brand: "Vista", warrantyMonths: 12 }, tags: ["desk"], reviews: [] },
  { _id: 5, name: "Epsilon Keyboard", price: 80, cost: 45, stock: 7, category: "input", specs: { brand: "Acme", warrantyMonths: 24 }, tags: ["desk", "work", "portable"], reviews: [{ user: "bo", rating: 4 }] },
  { _id: 6, name: "Zeta Dock", price: 150, cost: 150, stock: 2, category: "accessory", specs: { brand: "Nova" }, tags: [], reviews: [{ user: "ed", rating: 1 }] }
])`;

const exercises = [
  {
    title: 'Select Rows with the Comparison Operators $eq, $gt, $gte, $lt, $lte and $ne',
    difficulty: 'EASY',
    estimatedMinutes: 15,
    points: 10,
    concepts: ['comparison operators', 'inclusive vs exclusive bounds', 'range on one field', '$ne and missing fields', 'projection with sort'],
    prerequisites: ['find and toArray', 'query filter documents'],
    tags: ['query', 'operators', 'comparison', 'filter', 'mongodb'],
    problemHtml: `<p>A filter document like <code>{ price: 19 }</code> only expresses equality, and almost no real screen is built from equality alone: a price band, an "at least" threshold, an "everything except" list. MongoDB's <strong>comparison operators</strong> live inside the value position of a filter — <code>{ price: { $gt: 20 } }</code> — and are the vocabulary every later operator builds on.</p>
<p>The <code>products</code> collection is seeded with six documents. Note that the <code>Lamp</code> document has <strong>no</strong> <code>category</code> field at all; that omission is deliberate and it matters for the last query. Produce these five results, each projecting only <code>name</code> (suppress <code>_id</code>) and sorted by <code>name</code> ascending so the output order is stable:</p>
<ul>
<li>Products whose <code>price</code> is at least <code>30</code>, using <code>$gte</code>.</li>
<li>Products whose <code>price</code> is strictly below <code>20</code>, using <code>$lt</code>.</li>
<li>Products in the half-open band above <code>12</code> and up to and including <code>49.9</code> — put <code>$gt</code> and <code>$lte</code> in the <em>same</em> sub-document so both bounds apply to <code>price</code>.</li>
<li>Products whose <code>category</code> is not <code>"input"</code>, using <code>$ne</code>. Look carefully at whether <code>Lamp</code> appears.</li>
<li>The product whose <code>price</code> is exactly <code>150</code>, written with the explicit <code>$eq</code> operator rather than plain equality.</li>
</ul>
<p>The scaffold gives you five commented query slots to fill in. Predict each result set on paper before running it, then check.</p>`,
    inputSpec: 'A products collection seeded with six documents carrying name, price, stock and (for five of the six) category. The Lamp document has price 25, stock 3 and no category field.',
    outputSpec: "Five name-only arrays sorted by name: $gte 30 gives Desk Pad, Keyboard, Monitor; $lt 20 gives Cable, Mouse; the 12-to-49.9 band gives Desk Pad, Keyboard, Lamp, Mouse; category $ne 'input' gives Cable, Desk Pad, Lamp, Monitor (Lamp is included because it has no category); $eq 150 gives Monitor.",
    constraints: 'Use the operator form for every query — no JavaScript filtering after toArray(), no $where. Both bounds of the band must sit in one sub-document on price. Project { name: 1, _id: 0 } and sort by { name: 1 } on every query.',
    examplesJson: [
      {
        input: 'db.products.find({ price: { $gt: 12, $lte: 49.9 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Desk Pad' }, { name: 'Keyboard' }, { name: 'Lamp' }, { name: 'Mouse' } ]",
        explanation: 'Two operators in the same sub-document are ANDed into a range: 30, 49.9, 25 and 19 all sit above 12 and at or below 49.9. Cable (12) is excluded because $gt is exclusive, and Monitor (150) is above the upper bound.',
      },
      {
        input: "db.products.find({ category: { $ne: \"input\" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()",
        output: "[ { name: 'Cable' }, { name: 'Desk Pad' }, { name: 'Lamp' }, { name: 'Monitor' } ]",
        explanation: 'Lamp appears even though it has no category at all — a missing field is "not equal to input" by MongoDB\'s rules.',
      },
      {
        input: 'db.products.find({ price: { $eq: 150 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Monitor' } ]",
        explanation: '$eq is the explicit spelling of the equality that { price: 150 } expresses implicitly; the two are identical to the query planner.',
      },
    ],
    hintsJson: [
      'Each condition is a sub-document in the value position: the field name maps to an object of operators, not to a literal.',
      '$gt and $lt are exclusive, $gte and $lte are inclusive — pick the pair that matches the wording of each requirement.',
      'To express a band, put both operators in one object: { price: { $gt: 12, $lte: 49.9 } }. Two separate keys for price in the same filter would silently keep only the last one.',
      'For the $ne query, remember that documents missing the field also match; the answer has four names including Lamp.',
    ],
    starter: `// 1. price >= 30, names only, sorted by name
// 2. price < 20, names only, sorted by name
// 3. price > 12 AND <= 49.9 in one sub-document
// 4. category != "input" (watch what happens to Lamp)
// 5. price exactly 150, written with $eq`,
    solution: `db.products.find({ price: { $gte: 30 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $lt: 20 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $gt: 12, $lte: 49.9 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $ne: "input" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $eq: 150 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()`,
    solutionExplanationHtml: `<p>Every comparison operator occupies the <em>value</em> position of a field in the filter document, so <code>{ price: { $gte: 30 } }</code> reads as "the price field satisfies: at least 30". Because the operators live inside one object, several of them can constrain the same field simultaneously — <code>{ price: { $gt: 12, $lte: 49.9 } }</code> is a single range predicate, not two competing filters. Writing it the other way, <code>{ price: { $gt: 12 }, price: { $lte: 49.9 } }</code>, is legal JavaScript but the duplicate object key means only the second survives, and you silently query the wrong band. That is the number one bug in hand-written Mongo filters.</p>
<p>Boundary choice is the second trap: <code>$gt</code>/<code>$lt</code> exclude the boundary value while <code>$gte</code>/<code>$lte</code> include it. Cable at exactly 12 drops out of the band because the lower bound is <code>$gt</code>, and Keyboard at exactly 49.9 survives because the upper bound is <code>$lte</code>. Off-by-one reports almost always trace back to this pair.</p>
<p>The most surprising result is <code>$ne</code>. MongoDB evaluates it as "the field does not hold this value", and a field that is <em>absent</em> trivially satisfies that, so <code>Lamp</code> — which has no <code>category</code> at all — is returned alongside the three products with a different category. The same reach applies to <code>$nin</code>. When you mean "has a category, and it is not input", you must say so explicitly: <code>{ category: { $ne: "input", $exists: true } }</code>. Finally, <code>$eq</code> and plain equality compile to exactly the same plan; the explicit form matters when you need to combine equality with another operator on the same field, or when generating filters programmatically.</p>`,
    reset: PRODUCTS,
  },

  {
    title: 'Match Against a Set of Values with $in and $nin',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['$in membership', '$nin exclusion', 'set filters instead of $or chains', 'missing fields and $nin', 'countDocuments with a filter'],
    prerequisites: ['comparison operators', 'projection'],
    tags: ['query', 'operators', 'in', 'nin', 'mongodb'],
    problemHtml: `<p>Filter panels in real applications produce lists, not single values: "show me categories input <em>or</em> display", "hide these three statuses". Writing that as a chain of <code>$or</code> clauses is verbose and slower to plan; <code>$in</code> takes an array of candidate values and matches a document if the field equals any of them, and <code>$nin</code> is its negation.</p>
<p>The <code>products</code> collection is seeded with the same six documents as before — five with a <code>category</code>, plus <code>Lamp</code> which has none. Produce these results, projecting only <code>name</code> (no <code>_id</code>) and sorting by <code>name</code> ascending except where stated:</p>
<ul>
<li>Products whose <code>category</code> is either <code>"input"</code> or <code>"display"</code>, using <code>$in</code>.</li>
<li>Products whose <code>category</code> is neither <code>"input"</code> nor <code>"cable"</code>, using <code>$nin</code>. Check whether <code>Lamp</code> is in the result.</li>
<li>The same <code>$nin</code> query tightened so that only documents that actually <strong>have</strong> a <code>category</code> qualify — add <code>$exists: true</code> to the same sub-document.</li>
<li>Products whose <code>price</code> is one of <code>12</code>, <code>19</code> or <code>150</code>, using <code>$in</code> on a numeric field.</li>
<li>The number of documents matching the first <code>$in</code> filter, using <code>countDocuments</code> rather than reading the array's length.</li>
</ul>
<p>The scaffold provides five commented slots. Note that <code>$in</code> compares each candidate with normal equality semantics, so numbers, strings and even regular expressions can appear in the array.</p>`,
    inputSpec: 'The same six-document products collection: five documents with a category of input, display, cable or desk, and Lamp with price 25 and no category field.',
    outputSpec: "$in on [input, display] gives Keyboard, Monitor, Mouse; $nin on [input, cable] gives Desk Pad, Lamp, Monitor (Lamp because it has no category); adding $exists: true narrows that to Desk Pad, Monitor; $in on prices [12, 19, 150] gives Cable, Monitor, Mouse; countDocuments on the first filter returns 3.",
    constraints: 'Use $in and $nin — do not expand them into $or chains or filter in JavaScript after toArray(). The $exists guard must live in the same sub-document as $nin. Use countDocuments for the count, not .toArray().length.',
    examplesJson: [
      {
        input: 'db.products.find({ category: { $in: ["input", "display"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Keyboard' }, { name: 'Monitor' }, { name: 'Mouse' } ]",
        explanation: 'Keyboard and Mouse are input, Monitor is display; each matches because its category equals one member of the array.',
      },
      {
        input: 'db.products.find({ category: { $nin: ["input", "cable"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Desk Pad' }, { name: 'Lamp' }, { name: 'Monitor' } ]",
        explanation: 'Desk Pad and Monitor have other categories; Lamp is included because a missing field is not in the excluded set.',
      },
      {
        input: 'db.products.find({ category: { $nin: ["input", "cable"], $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Desk Pad' }, { name: 'Monitor' } ]",
        explanation: '$exists: true forces the field to be present, which removes Lamp and gives the "has a category, just not those" semantics people usually intend.',
      },
    ],
    hintsJson: [
      'Both operators take an array as their argument: the field is compared with equality against every element.',
      '{ category: { $in: ["input", "display"] } } replaces an $or of two equality clauses and reads far better.',
      '$nin inherits the same blind spot as $ne — absent fields match. Combine it with $exists in the same object to exclude them.',
      'countDocuments takes the same filter document that find takes: db.products.countDocuments({ category: { $in: ["input", "display"] } }).',
    ],
    starter: `// 1. category in [input, display]
// 2. category not in [input, cable] — does Lamp appear?
// 3. same as 2 but only for documents that HAVE a category
// 4. price in [12, 19, 150]
// 5. countDocuments for filter 1`,
    solution: `db.products.find({ category: { $in: ["input", "display"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $nin: ["input", "cable"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $nin: ["input", "cable"], $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $in: [12, 19, 150] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.countDocuments({ category: { $in: ["input", "display"] } })`,
    solutionExplanationHtml: `<p><code>$in</code> is set membership: the document matches when the field's value equals <em>any</em> element of the supplied array. Semantically it is identical to an <code>$or</code> of equality clauses, but it is one predicate rather than several, so it plans better and it is the form the driver generates when you pass an array of ids. <code>$nin</code> is the complement — the field's value must equal none of the elements.</p>
<p>Two behaviours deserve to be memorised. The first is that <code>$nin</code>, like <code>$ne</code>, treats a <em>missing</em> field as a match: <code>Lamp</code> has no <code>category</code>, so it is trivially "not in [input, cable]" and appears in the second result. Adding <code>$exists: true</code> to the same sub-document — both conditions apply to <code>category</code> and are ANDed — restores the intent most developers actually have and drops Lamp. This asymmetry between the positive and negative operators (<code>$in</code> can never match a missing field, <code>$nin</code> always does) is a frequent source of reports that show more rows than expected.</p>
<p>The second is that <code>$in</code> uses ordinary equality semantics per element, so the array can mix types and can even contain regular expressions (<code>{ name: { $in: [/^M/, "Cable"] } }</code> is valid). It also interacts specially with array fields: if the queried field is itself an array, <code>$in</code> matches when <em>any</em> element of the stored array equals <em>any</em> element of the query array, which is the behaviour the next array exercises build on. Finally, <code>countDocuments(filter)</code> accepts exactly the same filter document as <code>find</code> and counts server-side, so no documents cross the wire — always prefer it over materialising an array and reading <code>.length</code>.</p>`,
    reset: PRODUCTS,
  },

  {
    title: 'Combine Conditions with $and, $or, $nor and $not',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['$or branches', 'explicit $and for nested clauses', '$nor as neither-condition', '$not inverting an operator', 'implicit AND of sibling fields'],
    prerequisites: ['comparison operators', '$in and $nin'],
    tags: ['query', 'logical', 'operators', 'boolean', 'mongodb'],
    problemHtml: `<p>Listing two fields side by side in a filter already means AND — <code>{ category: "input", price: { $lt: 30 } }</code> requires both. The logical operators exist for everything that shape cannot express: alternatives (<code>$or</code>), an AND whose branches are themselves compound (<code>$and</code>), "neither of these" (<code>$nor</code>), and the inversion of a single operator (<code>$not</code>).</p>
<p>Working on the six-document <code>products</code> collection, produce these result sets, each projecting only <code>name</code> and sorted by <code>name</code> ascending:</p>
<ul>
<li>Products that are either very cheap (<code>price</code> below <code>15</code>) or premium (<code>price</code> above <code>100</code>), using <code>$or</code> with two branches.</li>
<li>Products that are in the <code>input</code> or <code>display</code> category <strong>and</strong> cost less than <code>100</code> — write it with an explicit <code>$and</code> whose first branch is an <code>$or</code>.</li>
<li>Products that are neither in the <code>input</code> category nor priced above <code>100</code>, using <code>$nor</code>.</li>
<li>Products whose <code>stock</code> is <strong>not</strong> at least <code>10</code>, written as <code>$not</code> wrapping a <code>$gte</code> expression.</li>
<li>The count of documents matching the <code>$or</code> filter from the first bullet, using <code>countDocuments</code>.</li>
</ul>
<p>The scaffold provides five commented slots. Remember that <code>$and</code>, <code>$or</code> and <code>$nor</code> are top-level keys taking an <strong>array of filter documents</strong>, whereas <code>$not</code> sits inside a field and wraps an operator expression — it cannot wrap a bare value.</p>`,
    inputSpec: 'The six-document products collection with name, price, stock and category (Lamp has price 25, stock 3 and no category).',
    outputSpec: "The $or gives Cable and Monitor; the $and of an $or with a price bound gives Keyboard and Mouse; the $nor gives Cable, Desk Pad and Lamp; $not on stock $gte 10 gives Cable, Desk Pad, Lamp and Monitor; countDocuments on the $or filter returns 2.",
    constraints: 'Use $or, $and, $nor and $not literally — do not rewrite them as equivalent single-field filters. $not must wrap an operator expression such as { $gte: 10 }, never a plain value. Project { name: 1, _id: 0 } and sort by name on every find.',
    examplesJson: [
      {
        input: 'db.products.find({ $or: [{ price: { $lt: 15 } }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Cable' }, { name: 'Monitor' } ]",
        explanation: 'Cable at 12 satisfies the first branch and Monitor at 150 satisfies the second; a document only needs one branch to be true.',
      },
      {
        input: 'db.products.find({ $nor: [{ category: "input" }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Cable' }, { name: 'Desk Pad' }, { name: 'Lamp' } ]",
        explanation: '$nor keeps documents where every branch is false: not input and not above 100. Lamp qualifies because it has no category, so the first branch cannot be true for it.',
      },
      {
        input: 'db.products.find({ stock: { $not: { $gte: 10 } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Cable' }, { name: 'Desk Pad' }, { name: 'Lamp' }, { name: 'Monitor' } ]",
        explanation: 'Stocks 0, 7, 3 and 5 all fail the $gte 10 test, so $not admits them; Keyboard (12) and Mouse (40) are excluded.',
      },
    ],
    hintsJson: [
      'Sibling fields in one filter are already ANDed, so reach for $and only when a branch is itself compound.',
      '$or, $and and $nor are top-level keys whose value is an array of complete filter documents: { $or: [ {...}, {...} ] }.',
      'For the second query, nest: { $and: [ { $or: [ { category: "input" }, { category: "display" } ] }, { price: { $lt: 100 } } ] }.',
      '$not lives inside a field and inverts an operator expression: { stock: { $not: { $gte: 10 } } }. It also matches documents where the field is missing.',
    ],
    starter: `// 1. $or: price < 15 OR price > 100
// 2. $and: (category input OR display) AND price < 100
// 3. $nor: neither category input nor price > 100
// 4. $not: stock NOT >= 10
// 5. countDocuments for filter 1`,
    solution: `db.products.find({ $or: [{ price: { $lt: 15 } }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ $and: [{ $or: [{ category: "input" }, { category: "display" }] }, { price: { $lt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ $nor: [{ category: "input" }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $not: { $gte: 10 } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.countDocuments({ $or: [{ price: { $lt: 15 } }, { price: { $gt: 100 } }] })`,
    solutionExplanationHtml: `<p>The four logical operators split into two families. <code>$and</code>, <code>$or</code> and <code>$nor</code> are <em>top-level</em> keys whose value is an array of complete filter documents; <code>$not</code> is a <em>field-level</em> operator that wraps another operator expression. Confusing the two produces the most common error message in this area: <code>$not</code> cannot take a plain value (<code>{ stock: { $not: 10 } }</code> is rejected) and <code>$or</code> cannot appear inside a field.</p>
<p><code>$or</code> keeps a document when at least one branch matches, which is why Cable (12) and Monitor (150) both survive the cheap-or-premium filter. <code>$nor</code> is its exact negation — keep the document when <em>every</em> branch is false — so "neither input nor above 100" leaves Cable, Desk Pad and Lamp. Lamp is instructive: it has no <code>category</code>, so the branch <code>{ category: "input" }</code> is false for it, and <code>$nor</code> lets it through. All the negating operators (<code>$ne</code>, <code>$nin</code>, <code>$nor</code>, <code>$not</code>) share this property of admitting documents that lack the field.</p>
<p>The explicit <code>$and</code> is needed exactly when sibling-field ANDing cannot express the shape. Here the first branch is itself an <code>$or</code>; you cannot put two <code>$or</code> keys in one object, and you cannot merge an <code>$or</code> with a price bound as siblings without losing the grouping, so <code>$and</code> makes the precedence explicit. The other classic case is applying two clauses that would collide on the same key, for example two separate <code>$or</code> groups. Note the alternative for that specific query — <code>{ category: { $in: ["input", "display"] }, price: { $lt: 100 } }</code> — is shorter and generally plans better, so prefer <code>$in</code> when every branch is an equality on the same field, and keep <code>$or</code> for branches that touch different fields.</p>
<p>One performance note: an <code>$or</code> is planned as a union of its branches, so each branch ideally needs its own index; a single branch without one forces a collection scan for that branch. <code>$not</code> and <code>$nor</code> generally cannot use an index range at all, because "everything except this range" is not a contiguous scan.</p>`,
    diagramMermaid: `flowchart TD
  A[filter document] --> B[sibling fields are implicitly ANDed]
  A --> C[top level array operators]
  C --> D[and every branch must match]
  C --> E[or at least one branch matches]
  C --> F[nor no branch may match]
  A --> G[field level operator]
  G --> H[not inverts one operator expression]`,
    reset: PRODUCTS,
  },

  {
    title: 'Probe Field Presence and BSON Type with $exists and $type',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['$exists', '$type and BSON type names', 'null versus missing', 'type aliases such as number', 'schema drift auditing'],
    prerequisites: ['comparison operators', 'logical operators'],
    tags: ['query', 'element', 'exists', 'type', 'mongodb'],
    problemHtml: `<p>A collection has no enforced schema by default, so documents written by different versions of an application drift: a field is added later, a value arrives as the string <code>"31"</code> instead of the number <code>31</code>, an optional field is stored as explicit <code>null</code> rather than left out. The <strong>element operators</strong> are how you audit that drift. <code>$exists</code> asks whether a field is present at all; <code>$type</code> asks what BSON type its value has.</p>
<p>The <code>users</code> collection is seeded with five documents that deliberately disagree: <code>ana</code> has an integer <code>age</code>, <code>bo</code> stores <code>age</code> as the string <code>"31"</code>, <code>cy</code> has <code>age: null</code>, <code>di</code> has no <code>age</code> field and an <code>email</code> of <code>null</code>, and <code>ed</code> has the double <code>28.5</code>. Produce these results, projecting only <code>name</code> and sorting by <code>name</code>:</p>
<ul>
<li>Users that have an <code>email</code> field, using <code>$exists: true</code>. Note whether <code>di</code>, whose email is <code>null</code>, is included.</li>
<li>Users that have no <code>email</code> field at all, using <code>$exists: false</code>.</li>
<li>Users whose <code>age</code> was stored as a string, using <code>$type: "string"</code> — this is the drift you would want to fix.</li>
<li>Users whose <code>age</code> is numeric of any width, using the alias <code>$type: "number"</code>, then the narrower <code>$type: "int"</code> to show they are not the same set.</li>
<li>The difference between <code>{ age: null }</code> and <code>{ age: { $type: "null" } }</code>: run both and observe that the first also returns the user with no <code>age</code> field.</li>
</ul>
<p>The scaffold provides the query slots. Write down which name you expect in each result before running.</p>`,
    inputSpec: 'A users collection seeded with { _id:1, name:"ana", age:30, email:"ana@example.com" }, { _id:2, name:"bo", age:"31" }, { _id:3, name:"cy", age:null, email:"cy@example.com" }, { _id:4, name:"di", email:null } and { _id:5, name:"ed", age:28.5, email:"ed@example.com" }.',
    outputSpec: "email $exists true gives ana, cy, di, ed; $exists false gives bo; age $type 'string' gives bo; $type 'number' gives ana and ed while $type 'int' gives only ana and $type 'double' only ed; { age: null } gives cy and di whereas { age: { $type: 'null' } } gives only cy.",
    constraints: 'Use $exists and $type only — no JavaScript type checks after toArray(). Use the string type aliases ("string", "number", "int", "double", "null"), not the numeric BSON type codes. Project { name: 1, _id: 0 } and sort by name.',
    examplesJson: [
      {
        input: 'db.users.find({ email: { $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'ana' }, { name: 'cy' }, { name: 'di' }, { name: 'ed' } ]",
        explanation: 'ana, cy, di and ed all carry an email key, and di counts even though its value is null — $exists tests for the presence of the key, not for a useful value.',
      },
      {
        input: 'db.users.find({ age: null }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'cy' }, { name: 'di' } ]",
        explanation: 'Equality against null matches both an explicit null (cy) and an absent field (di) — the single most surprising rule in MongoDB querying.',
      },
      {
        input: 'db.users.find({ age: { $type: "null" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'cy' } ]",
        explanation: '$type "null" is exact: only a value whose BSON type really is null qualifies, so di (no age field) drops out.',
      },
    ],
    hintsJson: [
      'One operator asks "is the key there?" and the other asks "what type is the value?" — they answer different questions.',
      '$exists takes a boolean: { email: { $exists: false } } finds documents missing the key entirely.',
      '$type takes a BSON type alias string, or an array of them to accept several: { age: { $type: ["int", "double"] } }. "number" is a built-in alias covering int, long, double and decimal.',
      'To separate explicit null from absent, use $type "null" for the former and { field: { $exists: false } } for the latter; plain equality to null matches both.',
    ],
    starter: `// 1. documents that HAVE an email field
// 2. documents with NO email field
// 3. age stored as a string (schema drift)
// 4. age of any numeric type, then only int, then only double
// 5. { age: null } vs { age: { $type: "null" } } — run both`,
    solution: `db.users.find({ email: { $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ email: { $exists: false } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "string" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "number" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "int" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "double" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: null }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "null" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()`,
    solutionExplanationHtml: `<p><code>$exists</code> is purely about the presence of the key. <code>di</code> stores <code>email: null</code>, which is a present key holding a null value, so <code>$exists: true</code> returns it; only <code>bo</code>, who has no <code>email</code> key at all, answers to <code>$exists: false</code>. Treating <code>$exists: true</code> as "has a usable value" is a classic bug — pair it with a type or value test when you need more.</p>
<p><code>$type</code> inspects the BSON type of the stored value and accepts human-readable aliases. The seeded data shows why this matters: <code>bo</code>'s age is the string <code>"31"</code>, which compares as a string, so a range query like <code>{ age: { $gte: 30 } }</code> would silently skip it — MongoDB orders values across types rather than coercing them. Auditing with <code>{ age: { $type: "string" } }</code> is how you find those rows before they corrupt a report.</p>
<p>The numeric aliases repay attention. <code>mongosh</code> stores an integer-valued JavaScript number as a 32-bit <code>int</code> and a fractional one as a <code>double</code>, so <code>{ $type: "int" }</code> returns only <code>ana</code> (30) and <code>{ $type: "double" }</code> only <code>ed</code> (28.5). Neither alone is a safe "is it a number" test; the umbrella alias <code>"number"</code> covers int, long, double and decimal in one predicate and returns both. You can also pass an array of aliases to accept any of several types.</p>
<p>The final pair is the rule most worth internalising. <code>{ age: null }</code> is equality against null, and MongoDB defines a missing field as equal to null, so it returns both <code>cy</code> (explicit null) and <code>di</code> (absent). <code>{ age: { $type: "null" } }</code> is exact and returns only <code>cy</code>; <code>{ age: { $exists: false } }</code> returns only <code>di</code>. Choosing the wrong one of these three is a routine cause of migration scripts touching documents they should have left alone.</p>`,
    reset: USERS,
  },

  {
    title: 'Pattern-Match and Compute in the Filter with $regex and $mod',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 20,
    concepts: ['$regex and anchoring', '$options for case-insensitivity', 'regex literal versus $regex form', '$mod arithmetic predicate', 'index-friendly prefix patterns'],
    prerequisites: ['comparison operators', 'projection and sort'],
    tags: ['query', 'evaluation', 'regex', 'mod', 'mongodb'],
    problemHtml: `<p>Search boxes and data-quality sweeps need predicates that comparison operators cannot express: "name starts with M", "contains pad in any case", "id is divisible by 5". MongoDB's <strong>evaluation operators</strong> cover these. <code>$regex</code> applies a PCRE-style regular expression to a string field, and <code>$mod</code> applies a divisibility test to a numeric field, both entirely server-side.</p>
<p>The <code>products</code> collection holds the usual six documents with names Keyboard, Mouse, Monitor, Cable, Desk Pad and Lamp, and stock values 12, 40, 5, 0, 7 and 3 respectively. Produce these results, projecting only <code>name</code> and sorting by <code>name</code> ascending:</p>
<ul>
<li>Products whose <code>name</code> starts with a capital <code>M</code>, using an <strong>anchored</strong> pattern.</li>
<li>Products whose <code>name</code> contains <code>pad</code> ignoring case — use the object form <code>{ $regex: "pad", $options: "i" }</code>.</li>
<li>Products whose <code>name</code> contains the letter <code>o</code> anywhere, written with a bare JavaScript regular-expression literal as the field value rather than the <code>$regex</code> object.</li>
<li>Products whose <code>stock</code> is even, using <code>$mod</code> with divisor <code>2</code> and remainder <code>0</code>.</li>
<li>Products whose <code>stock</code> is an exact multiple of <code>5</code>, again with <code>$mod</code>.</li>
</ul>
<p>The scaffold provides the query slots. Both spellings of a regular expression are accepted by the server; the object form is required when you need <code>$options</code> or when the pattern arrives as a string from user input.</p>`,
    inputSpec: 'The six-document products collection. Names: Keyboard, Mouse, Monitor, Cable, Desk Pad, Lamp. Stock values in the same order: 12, 40, 5, 0, 7, 3.',
    outputSpec: "The anchored ^M pattern gives Monitor and Mouse; the case-insensitive 'pad' gives Desk Pad; the /o/ literal gives Keyboard, Monitor and Mouse; $mod [2, 0] on stock gives Cable, Keyboard and Mouse; $mod [5, 0] gives Cable, Monitor and Mouse.",
    constraints: 'Use $regex or a regex literal for the text queries and $mod for the arithmetic ones — no $where and no filtering in JavaScript. The case-insensitive query must use $options: "i". Project { name: 1, _id: 0 } and sort by name.',
    examplesJson: [
      {
        input: 'db.products.find({ name: { $regex: "^M" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Monitor' }, { name: 'Mouse' } ]",
        explanation: 'The ^ anchor requires the match at position 0, so only the two names beginning with M qualify. Monitor sorts before Mouse because n precedes u.',
      },
      {
        input: 'db.products.find({ name: { $regex: "pad", $options: "i" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Desk Pad' } ]",
        explanation: 'Without $options: "i" the lowercase pattern would not match the stored "Desk Pad"; the flag makes the comparison case-insensitive.',
      },
      {
        input: 'db.products.find({ stock: { $mod: [2, 0] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Cable' }, { name: 'Keyboard' }, { name: 'Mouse' } ]",
        explanation: 'Stocks 0, 12 and 40 leave remainder 0 when divided by 2; note that 0 counts as even.',
      },
    ],
    hintsJson: [
      'Two evaluation operators are enough here: one for text patterns, one for divisibility.',
      'Anchor with ^ to mean "starts with"; leave the pattern unanchored to mean "contains anywhere".',
      'The object form { $regex: "pad", $options: "i" } lets you add flags; the literal form { name: /o/ } is shorter but cannot carry $options as a sibling.',
      '$mod takes a two-element array, [divisor, remainder]: { stock: { $mod: [5, 0] } } keeps values evenly divisible by 5.',
    ],
    starter: `// 1. name starts with capital M (anchored)
// 2. name contains "pad", case-insensitive ($options)
// 3. name contains "o" — use a bare /o/ regex literal
// 4. stock is even ($mod)
// 5. stock is a multiple of 5 ($mod)`,
    solution: `db.products.find({ name: { $regex: "^M" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ name: { $regex: "pad", $options: "i" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ name: /o/ }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $mod: [2, 0] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $mod: [5, 0] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()`,
    solutionExplanationHtml: `<p><code>$regex</code> comes in two interchangeable spellings. The object form <code>{ name: { $regex: "^M" } }</code> takes the pattern as a string and can carry an <code>$options</code> sibling for flags; the literal form <code>{ name: /o/ }</code> is terser and carries its flags in the literal itself (<code>/o/i</code>). Use the object form whenever the pattern is assembled from user input — and remember to escape that input, because an unescaped <code>.</code> or <code>*</code> from a search box changes the meaning of the query and a pathological pattern can burn server CPU.</p>
<p>Anchoring is the difference between a fast query and a slow one. <code>^M</code> is a <em>prefix</em> pattern, and a prefix pattern on an indexed field can be answered by an index range scan because the matching keys are contiguous. An unanchored pattern such as <code>/o/</code> has no such locality and forces the server to test every candidate string, so it degrades linearly with collection size. Case-insensitivity has the same cost: adding <code>$options: "i"</code> defeats an ordinary index even on an anchored pattern, which is why case-insensitive search at scale is usually implemented with a collation-aware index or a text index instead.</p>
<p><code>$mod</code> takes a two-element array <code>[divisor, remainder]</code> and keeps documents where <code>value % divisor === remainder</code>. Stocks 0, 12 and 40 all leave remainder 0 modulo 2 — note that zero is even and is included, a case people often forget when writing test data. Modulo 5, the qualifying values are 0, 5 and 40. Both operators are computed per document rather than looked up, so they never benefit from an index on the field they test; when a <code>$mod</code> or unanchored regex appears alongside other conditions, put a selective indexable condition in the same filter so the server narrows the candidate set first and evaluates the expensive predicate on what remains.</p>`,
    reset: PRODUCTS,
  },

  {
    title: 'Query Arrays: Element Match, Whole-Array Equality, $all and $size',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['implicit element matching', 'whole-array equality and ordering', '$all', '$size exact length', 'empty array queries'],
    prerequisites: ['comparison operators', '$in and $nin'],
    tags: ['query', 'arrays', 'all', 'size', 'mongodb'],
    problemHtml: `<p>An array field behaves differently from a scalar in filters, and the difference catches almost everyone once. <code>{ tags: "mongodb" }</code> does <strong>not</strong> mean "tags equals the string mongodb" — it means "tags contains an element equal to mongodb", because MongoDB implicitly descends into arrays. Supply an array on the right-hand side and the meaning flips to exact whole-array equality, <em>including order</em>.</p>
<p>The <code>articles</code> collection is seeded with five documents whose <code>tags</code> arrays overlap, one of which (<code>Epsilon</code>) has an empty array. Produce these results, projecting only <code>title</code> and sorting by <code>title</code> ascending:</p>
<ul>
<li>Articles tagged <code>"mongodb"</code> — a plain equality against the array field, which matches any element.</li>
<li>Articles whose <code>tags</code> array is exactly <code>["mongodb", "database"]</code> in that order.</li>
<li>The same query with the two values swapped, <code>["database", "mongodb"]</code> — confirm the result is empty, proving order matters for whole-array equality.</li>
<li>Articles tagged with <strong>both</strong> <code>"mongodb"</code> and <code>"database"</code> in any order and regardless of any extra tags, using <code>$all</code>.</li>
<li>Articles whose <code>tags</code> array has exactly one element, using <code>$size</code>, and then articles with an empty array, using <code>$size: 0</code>.</li>
<li>The number of articles tagged <code>"database"</code>, using <code>countDocuments</code>.</li>
</ul>
<p>The scaffold provides the query slots. Predict which titles come back for each before running — the second and third queries in particular.</p>`,
    inputSpec: 'An articles collection seeded with Alpha ["mongodb","database"], Beta ["database","sql","mongodb"], Gamma ["mongodb"], Delta ["nosql","database"] and Epsilon [].',
    outputSpec: "Plain equality on 'mongodb' gives Alpha, Beta, Gamma; exact array [\"mongodb\",\"database\"] gives Alpha only; the swapped order gives an empty array; $all of the two tags gives Alpha and Beta; $size 1 gives Gamma and $size 0 gives Epsilon; countDocuments for tag 'database' returns 3.",
    constraints: 'Use $all and $size where specified — do not emulate them with $and of two equalities or with JavaScript length checks. $size takes an exact integer only; it does not accept a comparison operator. Project { title: 1, _id: 0 } and sort by title.',
    examplesJson: [
      {
        input: 'db.articles.find({ tags: "mongodb" }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()',
        output: "[ { title: 'Alpha' }, { title: 'Beta' }, { title: 'Gamma' } ]",
        explanation: 'The scalar on the right-hand side is matched against every element of the array, so any article carrying the tag qualifies.',
      },
      {
        input: 'db.articles.find({ tags: ["database", "mongodb"] }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()',
        output: '[]',
        explanation: 'An array on the right-hand side means exact equality, and Alpha stores ["mongodb","database"] — the same values in the other order, which is a different array.',
      },
      {
        input: 'db.articles.find({ tags: { $all: ["mongodb", "database"] } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()',
        output: "[ { title: 'Alpha' }, { title: 'Beta' } ]",
        explanation: '$all requires every listed value to be present, ignoring order and tolerating extras — Beta also carries "sql" and still matches.',
      },
    ],
    hintsJson: [
      'The right-hand side decides the semantics: a scalar matches any element, an array demands the whole array.',
      'Order is significant for whole-array equality; that is exactly why the swapped query returns nothing.',
      '$all is the order-insensitive, extras-tolerant "contains all of these" operator: { tags: { $all: ["mongodb", "database"] } }.',
      '$size takes a literal integer, so { tags: { $size: 1 } } works but { tags: { $size: { $gt: 1 } } } is invalid — length ranges need $expr or a stored count field.',
    ],
    starter: `// 1. articles tagged "mongodb" (element match)
// 2. tags exactly ["mongodb", "database"]
// 3. tags exactly ["database", "mongodb"] — expect []
// 4. tags containing BOTH values, any order ($all)
// 5. tags of length exactly 1, then length 0 ($size)
// 6. countDocuments for tag "database"`,
    solution: `db.articles.find({ tags: "mongodb" }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: ["mongodb", "database"] }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: ["database", "mongodb"] }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $all: ["mongodb", "database"] } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $size: 1 } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $size: 0 } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.countDocuments({ tags: "database" })`,
    solutionExplanationHtml: `<p>The governing rule is that MongoDB matches a query value against an array field <em>element-wise</em> whenever the query value is not itself an array. <code>{ tags: "mongodb" }</code> therefore reads as "some element equals mongodb" and returns Alpha, Beta and Gamma. The same descent applies to operators, so <code>{ tags: { $regex: "^mongo" } }</code> or <code>{ scores: { $gt: 90 } }</code> also test each element individually.</p>
<p>Supplying an array flips the semantics to whole-array equality, and BSON arrays are ordered, so <code>["mongodb","database"]</code> and <code>["database","mongodb"]</code> are different values. Alpha matches the first and nothing matches the second. This is why exact-array equality is almost never what an application wants: tag sets, role lists and permission arrays have no meaningful order, and a query written this way breaks the first time a document is written with the elements in a different sequence. <code>$all</code> is the correct tool — it requires every listed value to be present, ignores order, and tolerates extra elements, which is why Beta (three tags) matches alongside Alpha (exactly two).</p>
<p><code>$size</code> tests the array's length for an exact integer. It has two limitations worth knowing before you rely on it: it accepts only a literal number, so there is no way to ask for "more than two elements" with it — you need <code>$expr</code> with <code>$size</code> as an aggregation expression, or better, a maintained counter field — and it cannot use a multikey index, so it always scans. <code>{ tags: { $size: 0 } }</code> is the idiomatic way to find empty arrays; note that it does <em>not</em> match documents where <code>tags</code> is missing entirely, which <code>{ tags: { $exists: false } }</code> would. Finally, <code>countDocuments({ tags: "database" })</code> counts Alpha, Beta and Delta server-side using the same element-wise semantics as the find.</p>`,
    reset: ARTICLES,
  },

  {
    title: 'Constrain a Single Array Element with $elemMatch',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['$elemMatch on subdocument arrays', 'dot notation matching across elements', 'per-element AND semantics', 'false positives from independent conditions', 'array of embedded documents'],
    prerequisites: ['array element matching', 'comparison operators', 'dot notation basics'],
    tags: ['query', 'arrays', 'elemmatch', 'subdocuments', 'mongodb'],
    problemHtml: `<p>When an array holds embedded documents — order line items, review entries, sensor samples — you usually want to ask about <em>one</em> element satisfying several conditions at once. Dot notation cannot express that. A filter such as <code>{ "items.qty": { $gte: 5 }, "items.price": { $gte: 40 } }</code> is satisfied if <strong>some</strong> element has a large quantity and <strong>some</strong> element has a high price — possibly two different elements. <code>$elemMatch</code> forces both conditions onto the same element.</p>
<p>The <code>orders</code> collection is seeded with four orders whose <code>items</code> arrays are designed to expose the difference. Order <code>bo</code> contains <code>{ sku: "A", qty: 9, price: 20 }</code> and <code>{ sku: "C", qty: 1, price: 50 }</code>: a big quantity in one element and a high price in a different one. Produce these results, projecting only <code>customer</code> and sorting by <code>customer</code> ascending:</p>
<ul>
<li>Orders matched by the dot-notation filter <code>{ "items.qty": { $gte: 5 }, "items.price": { $gte: 40 } }</code>. Two customers come back.</li>
<li>The same intent expressed with <code>$elemMatch</code>, so that a single line item must have both <code>qty</code> at least <code>5</code> and <code>price</code> at least <code>40</code>. Only one customer survives — identify which order was a false positive above and why.</li>
<li>Orders containing a line item for <code>sku "A"</code>, using plain dot notation (a single condition, where <code>$elemMatch</code> would be unnecessary).</li>
<li>Orders containing a line item whose <code>sku</code> is <code>"B"</code> <strong>and</strong> whose <code>qty</code> is greater than <code>3</code>, using <code>$elemMatch</code>.</li>
<li>The count of orders that have at least one line item priced above <code>40</code>, using <code>countDocuments</code>.</li>
</ul>
<p>The scaffold provides the query slots. Work out the false positive by hand before you run the second query.</p>`,
    inputSpec: 'An orders collection seeded with ana [{A,qty2,price10},{B,qty5,price3}], bo [{A,qty9,price20},{C,qty1,price50}], cy [{D,qty6,price45}] and di [{B,qty1,price3}], where each line item has sku, qty and price.',
    outputSpec: "The dot-notation filter returns bo and cy; the $elemMatch version returns only cy, because bo satisfied the two conditions with two different line items; the sku 'A' query returns ana and bo; the $elemMatch on sku B with qty > 3 returns ana; countDocuments for an item priced above 40 returns 2.",
    constraints: 'Use $elemMatch where the requirement says a single element must satisfy every condition. Do not restructure the documents, do not filter in JavaScript, and do not use aggregation. Project { customer: 1, _id: 0 } and sort by customer.',
    examplesJson: [
      {
        input: 'db.orders.find({ "items.qty": { $gte: 5 }, "items.price": { $gte: 40 } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()',
        output: "[ { customer: 'bo' }, { customer: 'cy' } ]",
        explanation: 'cy genuinely has one item with qty 6 and price 45. bo is a false positive: qty 9 comes from item A and price 50 from item C, and dot notation is happy to satisfy the two conditions from different elements.',
      },
      {
        input: 'db.orders.find({ items: { $elemMatch: { qty: { $gte: 5 }, price: { $gte: 40 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()',
        output: "[ { customer: 'cy' } ]",
        explanation: '$elemMatch requires one element to satisfy both conditions simultaneously, which eliminates bo and leaves only cy.',
      },
      {
        input: 'db.orders.find({ items: { $elemMatch: { sku: "B", qty: { $gt: 3 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()',
        output: "[ { customer: 'ana' } ]",
        explanation: "ana's second item is sku B with qty 5. di also has a sku B item but its qty is 1, so no single element satisfies both conditions.",
      },
    ],
    hintsJson: [
      'Ask yourself whether the conditions must hold for the same element or merely somewhere in the array — that decides the operator.',
      'Dot notation flattens the array: each condition is tested independently against all elements, so unrelated elements can jointly satisfy a multi-condition filter.',
      '$elemMatch wraps a mini filter document applied to one element: { items: { $elemMatch: { qty: { $gte: 5 }, price: { $gte: 40 } } } }.',
      'For a single condition, dot notation and $elemMatch are equivalent; reach for $elemMatch only when two or more conditions must land on the same element.',
    ],
    starter: `// 1. dot notation: items.qty >= 5 AND items.price >= 40 (two customers)
// 2. same intent with $elemMatch (one customer) — which one was a false positive?
// 3. orders containing an item with sku "A" (dot notation is enough)
// 4. $elemMatch: an item with sku "B" AND qty > 3
// 5. countDocuments: orders with any item priced above 40`,
    solution: `db.orders.find({ "items.qty": { $gte: 5 }, "items.price": { $gte: 40 } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ items: { $elemMatch: { qty: { $gte: 5 }, price: { $gte: 40 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ "items.sku": "A" }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ items: { $elemMatch: { sku: "B", qty: { $gt: 3 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.countDocuments({ "items.price": { $gt: 40 } })`,
    solutionExplanationHtml: `<p>Dot notation into an array does not select an element; it projects the field across <em>all</em> elements and tests the condition against that flattened set. So <code>{ "items.qty": { $gte: 5 } }</code> means "at least one item has qty ≥ 5" and <code>{ "items.price": { $gte: 40 } }</code> means "at least one item has price ≥ 40". Listing them as siblings ANDs the two independent existential claims, and nothing ties them to the same element. Order <code>bo</code> is the textbook false positive: item A supplies the quantity (9) and item C supplies the price (50), so both claims are true while no single line item is both large and expensive.</p>
<p><code>$elemMatch</code> closes that gap. It takes a mini filter document and requires one element of the array to satisfy all of it at once, so <code>{ items: { $elemMatch: { qty: { $gte: 5 }, price: { $gte: 40 } } } }</code> returns only <code>cy</code>, whose single item has qty 6 and price 45. The same reasoning powers the fourth query: both <code>ana</code> and <code>di</code> own an item with sku B, but only <code>ana</code>'s has qty above 3 on that same element.</p>
<p>Knowing when <em>not</em> to use it matters as much. With a single condition — "any item with sku A" — dot notation and <code>$elemMatch</code> return identical results, and the dot form is shorter and more directly index-friendly, so prefer it there. Note also that inside <code>$elemMatch</code> you write field names relative to the element (<code>qty</code>, not <code>items.qty</code>); repeating the parent path is a common mistake that silently matches nothing.</p>
<p>On indexes: an index on <code>items.qty</code> is a multikey index with one key per array element. It can find candidate documents for an <code>$elemMatch</code>, but a compound multikey index cannot fully cover two conditions on the same element by itself, so the server still re-examines matching documents. The take-away is that <code>$elemMatch</code> guarantees correctness, not free performance — and the correctness gap it closes is invisible in small test data, which is exactly why it surfaces in production.</p>`,
    diagramMermaid: `flowchart TD
  A[order bo with two line items] --> B[item A qty 9 price 20]
  A --> C[item C qty 1 price 50]
  B --> D[satisfies the qty condition]
  C --> E[satisfies the price condition]
  D --> F[dot notation matches the order]
  E --> F
  D --> G[elemMatch requires one element for both]
  E --> G
  G --> H[no single element qualifies so bo is rejected]`,
    reset: ORDERS,
  },

  {
    title: 'Reach into Nested Documents and Shape Results with $slice and $elemMatch Projection',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 25,
    concepts: ['dot notation on embedded documents', 'exact subdocument equality', 'projecting a nested path', '$slice projection', '$elemMatch projection'],
    prerequisites: ['projection basics', '$elemMatch in filters', 'array queries'],
    tags: ['query', 'nested', 'projection', 'slice', 'mongodb'],
    problemHtml: `<p>Documents nest, and both halves of a query have to cope with that: the filter needs a way to address <code>address.city</code>, and the projection needs a way to return part of a nested structure instead of the whole thing. Sending an entire 200-element <code>scores</code> array to a client that renders one row is wasted bandwidth, and projection operators exist to prevent exactly that.</p>
<p>The <code>students</code> collection holds three documents, each with an <code>address</code> subdocument (<code>city</code>, <code>zip</code>) and a <code>scores</code> array of <code>{ subject, score }</code> entries. Produce these results:</p>
<ul>
<li>Students living in Hanoi, addressed with the dot path <code>"address.city"</code>, projecting <code>name</code> and <code>address.city</code> and suppressing <code>_id</code>. Observe that the projected <code>address</code> comes back as a nested object holding only <code>city</code>.</li>
<li>The student matched by exact subdocument equality <code>{ address: { city: "Hanoi", zip: "10000" } }</code>, projecting only <code>name</code>.</li>
<li>The same equality with the two keys written in the opposite order, <code>{ address: { zip: "10000", city: "Hanoi" } }</code>. Confirm the result is empty — whole-subdocument equality compares field order too.</li>
<li>Every student with only their first two <code>scores</code> entries, using the <code>$slice</code> projection, plus <code>name</code> and no <code>_id</code>.</li>
<li>Students who have a <code>cs</code> score, returning <code>name</code> and — via the <code>$elemMatch</code> <em>projection</em> — only the matching <code>scores</code> element rather than the whole array.</li>
<li>Students whose <code>math</code> score is above <code>80</code>, using <code>$elemMatch</code> in the <strong>filter</strong>, projecting only <code>name</code>.</li>
</ul>
<p>Sort every result by <code>name</code> ascending. The scaffold provides the query slots.</p>`,
    inputSpec: 'A students collection with Ana (Hanoi/10000, scores math 90, cs 75, eng 60), Bo (Hue/53000, scores math 55, cs 95) and Cy (Hanoi/10001, scores eng 88).',
    outputSpec: "The dot-path filter returns Ana and Cy each as name plus a nested address holding only city; exact subdocument equality returns Ana; the key-order-swapped equality returns an empty array; the $slice projection returns each student with at most two scores entries; the $elemMatch projection returns Ana with only her cs entry and Bo with only his; the $elemMatch filter on math above 80 returns Ana.",
    constraints: 'Use dot notation for nested paths and $slice / $elemMatch in the projection document — do not trim arrays in JavaScript after toArray(). Suppress _id everywhere. Sort by name ascending on every query.',
    examplesJson: [
      {
        input: 'db.students.find({ "address.city": "Hanoi" }, { name: 1, "address.city": 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Ana', address: { city: 'Hanoi' } }, { name: 'Cy', address: { city: 'Hanoi' } } ]",
        explanation: 'A dot path in the projection preserves the nesting: you get an address object containing only the projected city, not a flat address.city key.',
      },
      {
        input: 'db.students.find({ address: { zip: "10000", city: "Hanoi" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: '[]',
        explanation: 'Exact subdocument equality compares the whole embedded document byte for byte, including key order, and Ana stores city before zip.',
      },
      {
        input: 'db.students.find({ "scores.subject": "cs" }, { name: 1, scores: { $elemMatch: { subject: "cs" } }, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Ana', scores: [ { subject: 'cs', score: 75 } ] }, { name: 'Bo', scores: [ { subject: 'cs', score: 95 } ] } ]",
        explanation: 'The $elemMatch projection returns a one-element array holding the first matching entry, so the client receives only the row it needs.',
      },
    ],
    hintsJson: [
      'Nested fields are addressed by a quoted dot path in both the filter and the projection: "address.city".',
      'Passing a whole object as the filter value means exact equality against the entire subdocument, order included — that is why one of the queries returns nothing.',
      '{ scores: { $slice: 2 } } returns the first two elements; a negative number takes from the end and [skip, limit] takes a window.',
      '$elemMatch in the projection position returns only the first matching element of the array; that is a different operator role from $elemMatch in the filter, which selects documents.',
    ],
    starter: `// 1. address.city == "Hanoi", project name + address.city
// 2. exact subdocument equality { city: "Hanoi", zip: "10000" }
// 3. same but keys swapped — expect []
// 4. project name + first two scores entries ($slice)
// 5. students with a cs score, project only that entry ($elemMatch projection)
// 6. $elemMatch FILTER: math score above 80`,
    solution: `db.students.find({ "address.city": "Hanoi" }, { name: 1, "address.city": 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ address: { city: "Hanoi", zip: "10000" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ address: { zip: "10000", city: "Hanoi" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({}, { name: 1, scores: { $slice: 2 }, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ "scores.subject": "cs" }, { name: 1, scores: { $elemMatch: { subject: "cs" } }, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ scores: { $elemMatch: { subject: "math", score: { $gt: 80 } } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()`,
    solutionExplanationHtml: `<p>There are two ways to address an embedded document and they are not equivalent. The dot path <code>{ "address.city": "Hanoi" }</code> tests one nested field and ignores everything else in the subdocument — this is what you almost always want. Passing an object, <code>{ address: { city: "Hanoi", zip: "10000" } }</code>, demands that the stored subdocument equal that object <em>exactly</em>: same fields, same values, and same field order, because BSON documents are ordered. Swapping <code>zip</code> before <code>city</code> therefore returns nothing even though the data is identical. Add one field to the schema and every such query stops matching, which is why exact subdocument equality is a fragile choice outside of composite-key lookups.</p>
<p>Projection understands the same dot paths, and it reconstructs the nesting on the way out: asking for <code>"address.city"</code> yields <code>{ name: 'Ana', address: { city: 'Hanoi' } }</code>, an <code>address</code> object with a single key, not a flattened <code>address.city</code> property. Expecting the flat form is a routine source of undefined values in client code.</p>
<p>The two array projection operators solve different problems. <code>$slice</code> is positional: <code>{ scores: { $slice: 2 } }</code> keeps the first two elements, a negative value takes from the tail (<code>-1</code> for the most recent entry), and the array form <code>[skip, limit]</code> takes a window — enough to paginate an embedded comment list without touching the filter. <code>$elemMatch</code> in the projection is content-based: it returns a one-element array containing the <strong>first</strong> element that matches its condition, which is how Ana and Bo each come back with only their <code>cs</code> entry. Its limitation is that "first" — if several elements match, the rest are dropped silently, so use it when you expect one hit and reach for the aggregation stage <code>$filter</code> when you need every match.</p>
<p>Finally, note the same operator name doing two jobs. In the filter, <code>$elemMatch</code> chooses which <em>documents</em> to return (students with a math score above 80: only Ana, since Bo's math is 55). In the projection, it chooses which <em>array elements</em> to return from documents already selected. A filter <code>$elemMatch</code> does not restrict the array you get back, and a projection <code>$elemMatch</code> does not restrict which documents match — combining both is the way to say "find students with a cs score, and send me only that score".</p>`,
    reset: STUDENTS,
  },

  {
    title: 'Page a Result Set with sort, skip and limit, then Replace it with Keyset Paging',
    difficulty: 'HARD',
    estimatedMinutes: 45,
    points: 30,
    concepts: ['sort skip limit evaluation order', 'deterministic sort keys', 'skip cost growth', 'keyset or seek pagination', 'countDocuments versus estimatedDocumentCount'],
    prerequisites: ['find and cursor modifiers', 'comparison operators', 'projection'],
    tags: ['query', 'pagination', 'sort', 'limit', 'mongodb'],
    problemHtml: `<p>Every list screen paginates, and the first implementation everyone writes is <code>sort().skip(pageSize * n).limit(pageSize)</code>. It is correct and it works fine for the first few pages, but the server must still walk and discard every skipped document, so the cost of page <em>n</em> grows linearly with <em>n</em>. Past a few thousand rows, deep pages get measurably slower while the first page stays instant. The fix is <strong>keyset</strong> (also called seek) pagination: remember the sort key of the last row you showed and ask for rows beyond it.</p>
<p>The <code>ledger</code> collection holds nine documents with <code>_id</code> 1 to 9, codes <code>OD-01</code> to <code>OD-09</code> and <code>amount</code> 10 to 90. Using a page size of three, produce:</p>
<ul>
<li>Page 1 ordered by <code>_id</code> ascending: sort, then <code>limit(3)</code>, projecting only <code>code</code>.</li>
<li>Page 3 by the offset method: the same sort with <code>skip(6).limit(3)</code>.</li>
<li>The same page 3 by the keyset method: filter <code>{ _id: { $gt: 6 } }</code> — 6 being the last <code>_id</code> of page 2 — then sort and <code>limit(3)</code>. The two results must be identical.</li>
<li>A descending page: order by <code>amount</code> descending, <code>skip(3).limit(3)</code>, projecting <code>code</code> and <code>amount</code>.</li>
<li>The total row count with <code>countDocuments()</code> and, for comparison, <code>estimatedDocumentCount()</code>.</li>
<li>The count of documents that would qualify for the keyset filter, <code>countDocuments({ _id: { $gt: 6 } })</code>.</li>
</ul>
<p>The scaffold provides the query slots. Sort on a unique key throughout — that is what makes both methods deterministic.</p>`,
    inputSpec: 'A ledger collection seeded with nine documents: _id 1 to 9, code "OD-01" through "OD-09", and amount 10, 20, 30, 40, 50, 60, 70, 80, 90 respectively.',
    outputSpec: "Page 1 returns codes OD-01, OD-02, OD-03. Both the skip(6) page 3 and the keyset { _id: { $gt: 6 } } page return OD-07, OD-08, OD-09. The descending page returns OD-06/60, OD-05/50, OD-04/40. countDocuments() and estimatedDocumentCount() both return 9, and countDocuments({ _id: { $gt: 6 } }) returns 3.",
    constraints: 'Page size is exactly 3. Always sort on a unique key so the order is deterministic. The keyset query must use a comparison operator on _id, not skip. Use countDocuments for the filtered count; estimatedDocumentCount accepts no filter.',
    examplesJson: [
      {
        input: 'db.ledger.find({}, { code: 1, _id: 0 }).sort({ _id: 1 }).skip(6).limit(3).toArray()',
        output: "[ { code: 'OD-07' }, { code: 'OD-08' }, { code: 'OD-09' } ]",
        explanation: 'The server sorts, discards the first six documents one by one, then returns the next three. The discarded work is invisible in the result but real in the timing.',
      },
      {
        input: 'db.ledger.find({ _id: { $gt: 6 } }, { code: 1, _id: 0 }).sort({ _id: 1 }).limit(3).toArray()',
        output: "[ { code: 'OD-07' }, { code: 'OD-08' }, { code: 'OD-09' } ]",
        explanation: 'Identical output, but the filter jumps straight to the first qualifying key instead of walking past six documents, so the cost is independent of how deep the page is.',
      },
      {
        input: 'db.ledger.find({}, { code: 1, amount: 1, _id: 0 }).sort({ amount: -1 }).skip(3).limit(3).toArray()',
        output: "[ { code: 'OD-06', amount: 60 }, { code: 'OD-05', amount: 50 }, { code: 'OD-04', amount: 40 } ]",
        explanation: 'Descending by amount puts 90, 80, 70 on page 1; skipping those three yields 60, 50, 40. Fields print in stored order, so code precedes amount.',
      },
    ],
    hintsJson: [
      'The server always applies sort first, then skip, then limit — no matter what order you chain the methods in.',
      'For the offset method, page n with size s is skip((n - 1) * s).limit(s); page 3 with size 3 is skip(6).limit(3).',
      'For keyset paging, carry the last sort-key value of the previous page and filter with $gt (or $lt when sorting descending), then limit — never skip.',
      'countDocuments takes a filter and counts accurately; estimatedDocumentCount takes no filter and reads collection metadata, so it is fast but only approximate after an unclean shutdown.',
    ],
    starter: `// 1. page 1: sort _id asc, limit 3, project code
// 2. page 3 by offset: skip 6, limit 3
// 3. page 3 by keyset: filter _id > 6, sort, limit 3 — same output
// 4. descending page: sort amount desc, skip 3, limit 3, project code + amount
// 5. countDocuments() and estimatedDocumentCount()
// 6. countDocuments for the keyset filter _id > 6`,
    solution: `db.ledger.find({}, { code: 1, _id: 0 }).sort({ _id: 1 }).limit(3).toArray()
db.ledger.find({}, { code: 1, _id: 0 }).sort({ _id: 1 }).skip(6).limit(3).toArray()
db.ledger.find({ _id: { $gt: 6 } }, { code: 1, _id: 0 }).sort({ _id: 1 }).limit(3).toArray()
db.ledger.find({}, { code: 1, amount: 1, _id: 0 }).sort({ amount: -1 }).skip(3).limit(3).toArray()
db.ledger.countDocuments()
db.ledger.estimatedDocumentCount()
db.ledger.countDocuments({ _id: { $gt: 6 } })`,
    solutionExplanationHtml: `<p>The three cursor modifiers are applied by the server in a fixed order — <strong>sort, then skip, then limit</strong> — regardless of the order you chain them in JavaScript. That is why <code>sort({ _id: 1 }).skip(6).limit(3)</code> and <code>skip(6).limit(3).sort({ _id: 1 })</code> return the same thing, and why omitting the sort is dangerous: with no sort the server returns documents in whatever order the plan produces, which can change between calls, so a document can appear on two consecutive pages or on none.</p>
<p>Sorting on a <em>unique</em> key is the second half of that guarantee. Sorting only by <code>amount</code> would be fine here because the amounts happen to be distinct, but in real data ties are common and their relative order is unspecified; the standard fix is a compound sort ending in a unique tiebreaker, such as <code>{ createdAt: -1, _id: -1 }</code>.</p>
<p>The offset and keyset queries return byte-identical results, and that is the point: they differ only in cost. <code>skip(6)</code> makes the server produce and discard six documents before emitting anything, so page <em>n</em> costs O(n × pageSize) and a request for page 5000 does five thousand pages of work to return one. The keyset form <code>{ _id: { $gt: 6 } }</code> turns the same request into an index seek to the first key past the boundary followed by a scan of exactly three entries, so every page costs the same. The price is a loss of random access — you can only move to the next or previous page, not jump to page 47 — which is why infinite-scroll and cursor-based APIs favour keyset while numbered page links usually keep offsets and cap the reachable depth. When sorting descending, the boundary operator flips to <code>$lt</code>, and when sorting on a non-unique key the boundary becomes a compound comparison on the key plus the tiebreaker.</p>
<p>The two counters differ in the same "accurate versus cheap" way. <code>countDocuments(filter)</code> genuinely evaluates the filter, which is the only way to count a subset; with an empty filter it still does real work. <code>estimatedDocumentCount()</code> reads the collection's metadata, so it is nearly free but accepts no filter and can be stale after an unclean shutdown. Use the estimate for a dashboard total, and <code>countDocuments</code> whenever the number drives logic or a filter is involved. Note that the deprecated <code>count()</code> straddled both behaviours confusingly, which is precisely why it was split into these two explicit methods.</p>`,
    diagramMermaid: `flowchart LR
  A[client asks for page three] --> B{paging strategy}
  B --> C[offset paging]
  C --> D[sort then walk and discard six documents]
  D --> E[return three documents]
  B --> F[keyset paging]
  F --> G[seek index to first key greater than six]
  G --> H[return three documents]
  E --> I[cost grows with page depth]
  H --> J[cost stays constant]`,
    reset: LEDGER,
  },

  {
    title: 'Build a Catalogue Health Report with $expr and Combined Filters',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 30,
    concepts: ['$expr for field-to-field comparison', 'aggregation expressions inside find', 'combining logical element and array operators', 'distinct', 'projection with $slice for previews'],
    prerequisites: ['logical operators', 'element operators', '$elemMatch', 'projection', 'distinct and counting'],
    tags: ['query', 'expr', 'capstone', 'report', 'mongodb'],
    problemHtml: `<p>Standard query operators compare a field with a <em>constant</em>: <code>{ price: { $gt: 100 } }</code>. They cannot compare two fields of the same document, which is exactly what "selling below cost" requires. <code>$expr</code> lifts an aggregation expression into a normal <code>find</code> filter, where <code>"$price"</code> and <code>"$cost"</code> refer to the current document's own values — closing the last gap in the query language before you reach the aggregation pipeline.</p>
<p>The <code>catalog</code> collection holds six products, each with <code>price</code>, <code>cost</code>, <code>stock</code>, <code>category</code>, a <code>specs</code> subdocument (<code>brand</code>, and <code>warrantyMonths</code> on all but one), a <code>tags</code> array and a <code>reviews</code> array of <code>{ user, rating }</code>. Produce a seven-part health report. Sort every document result by <code>name</code> ascending and project only <code>name</code> unless stated otherwise:</p>
<ul>
<li><strong>Loss-makers.</strong> Products where <code>cost</code> is greater than or equal to <code>price</code>, using <code>$expr</code> with <code>$gte</code> and the two field paths.</li>
<li><strong>Restock shortlist.</strong> Products with <code>stock</code> at most <code>7</code> that are neither in the <code>phone</code> category nor priced below <code>100</code> — combine a comparison with <code>$nor</code>.</li>
<li><strong>Incomplete specs.</strong> Products with no <code>specs.warrantyMonths</code> field, using <code>$exists: false</code> on the dot path.</li>
<li><strong>Long-warranty Acme.</strong> Products whose <code>specs.brand</code> is <code>"Acme"</code> and whose <code>specs.warrantyMonths</code> is at least <code>24</code>.</li>
<li><strong>Desk and work bundle.</strong> Products tagged with both <code>"desk"</code> and <code>"work"</code>, using <code>$all</code>.</li>
<li><strong>Poor reviews.</strong> Products with at least one review whose <code>rating</code> is <code>2</code> or lower, using <code>$elemMatch</code>.</li>
<li><strong>Summary.</strong> The distinct <code>specs.brand</code> values; the number of products with an empty <code>tags</code> array via <code>$size</code>; and the two most expensive products projected as <code>name</code>, <code>price</code> and only their first review using <code>$slice</code>.</li>
</ul>
<p>The scaffold provides one commented slot per part. Every part must be a single query — no post-processing in JavaScript.</p>`,
    inputSpec: 'A catalog collection with six products: Alpha Laptop (price 1200, cost 900, stock 4, computer, Acme/24m, tags portable+work, reviews ana 5 and bo 3), Beta Phone (700/720, stock 0, phone, Acme/12m, tags portable, review cy 4), Gamma Monitor (300/200, stock 11, display, Vista/36m, tags desk+work, reviews ana 2 and di 5), Delta Mouse (25/30, stock 60, input, Vista/12m, tags desk, no reviews), Epsilon Keyboard (80/45, stock 7, input, Acme/24m, tags desk+work+portable, review bo 4) and Zeta Dock (150/150, stock 2, accessory, brand Nova with no warrantyMonths, empty tags, review ed 1).',
    outputSpec: "Loss-makers: Beta Phone, Delta Mouse and Zeta Dock. Restock shortlist: Alpha Laptop and Zeta Dock. Incomplete specs: Zeta Dock. Long-warranty Acme: Alpha Laptop and Epsilon Keyboard. Desk and work bundle: Epsilon Keyboard and Gamma Monitor. Poor reviews: Gamma Monitor and Zeta Dock. Summary: distinct brands are Acme, Nova, Vista; the empty-tags count is 1; the top-two-by-price projection returns Alpha Laptop 1200 with the single review by ana rated 5, then Beta Phone 700 with the review by cy rated 4.",
    constraints: 'Each part is exactly one query against the catalog collection. Use $expr for the field-to-field comparison, $nor for the restock exclusion, $exists for the missing spec, $all for the tag bundle, $elemMatch for the review test, distinct for the brand list and $slice for the review preview. No aggregation pipeline, no $where, no JavaScript post-processing.',
    examplesJson: [
      {
        input: 'db.catalog.find({ $expr: { $gte: ["$cost", "$price"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Beta Phone' }, { name: 'Delta Mouse' }, { name: 'Zeta Dock' } ]",
        explanation: 'Beta Phone costs 720 to sell at 700, Delta Mouse costs 30 to sell at 25, and Zeta Dock breaks even at 150 (which $gte includes); the dollar-prefixed strings are field paths evaluated per document, which no ordinary operator can do.',
      },
      {
        input: 'db.catalog.find({ stock: { $lte: 7 }, $nor: [{ category: "phone" }, { price: { $lt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()',
        output: "[ { name: 'Alpha Laptop' }, { name: 'Zeta Dock' } ]",
        explanation: 'Stock at most 7 selects Alpha Laptop (4), Beta Phone (0), Epsilon Keyboard (7) and Zeta Dock (2); $nor then drops Beta Phone for being a phone and Epsilon Keyboard for costing 80.',
      },
      {
        input: 'db.catalog.find({}, { name: 1, price: 1, reviews: { $slice: 1 }, _id: 0 }).sort({ price: -1 }).limit(2).toArray()',
        output: "[ { name: 'Alpha Laptop', price: 1200, reviews: [ { user: 'ana', rating: 5 } ] }, { name: 'Beta Phone', price: 700, reviews: [ { user: 'cy', rating: 4 } ] } ]",
        explanation: '$slice: 1 keeps only the first review of each product, giving a preview payload instead of the full array; fields print in stored order, so name, price then reviews.',
      },
    ],
    hintsJson: [
      'Only one part needs an operator you have not used yet — the one that compares two fields of the same document.',
      'Inside $expr you write aggregation expressions, so operators take an array of operands and field references are strings prefixed with a dollar sign: { $expr: { $gte: ["$cost", "$price"] } }.',
      'The restock part is a sibling-field AND of a $lte comparison and a $nor array; $nor keeps a document only when every listed branch is false.',
      'For the summary, distinct("specs.brand") returns a sorted array of unique values, countDocuments({ tags: { $size: 0 } }) counts empty arrays, and { reviews: { $slice: 1 } } inside the projection trims the array without touching the filter.',
    ],
    starter: `// 1. loss-makers: cost >= price, using $expr
// 2. restock shortlist: stock <= 7 AND $nor [category phone, price < 100]
// 3. incomplete specs: specs.warrantyMonths missing
// 4. long-warranty Acme: specs.brand Acme AND specs.warrantyMonths >= 24
// 5. desk+work bundle: tags $all
// 6. poor reviews: $elemMatch rating <= 2
// 7a. distinct specs.brand
// 7b. count of products with an empty tags array
// 7c. top 2 by price: name + price + first review only ($slice)`,
    solution: `db.catalog.find({ $expr: { $gte: ["$cost", "$price"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ stock: { $lte: 7 }, $nor: [{ category: "phone" }, { price: { $lt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ "specs.warrantyMonths": { $exists: false } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ "specs.brand": "Acme", "specs.warrantyMonths": { $gte: 24 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ tags: { $all: ["desk", "work"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ reviews: { $elemMatch: { rating: { $lte: 2 } } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.distinct("specs.brand")
db.catalog.countDocuments({ tags: { $size: 0 } })
db.catalog.find({}, { name: 1, price: 1, reviews: { $slice: 1 }, _id: 0 }).sort({ price: -1 }).limit(2).toArray()`,
    solutionExplanationHtml: `<p><code>$expr</code> is the bridge between the query language and the aggregation expression language. Inside it you write aggregation syntax — operators take an array of operands and a string beginning with a dollar sign is a <em>field path</em> into the current document — so <code>{ $expr: { $gte: ["$cost", "$price"] } }</code> asks "is this document's cost at least its own price" — true for Beta Phone (720 against 700), Delta Mouse (30 against 25) and Zeta Dock, which breaks even at 150 and is caught because <code>$gte</code> includes equality. No ordinary query operator can do that, because the right-hand side of <code>$gte</code> in a normal filter is always a constant. The usual workaround before <code>$expr</code> existed was to maintain a derived <code>margin</code> field on every write, which is still worth doing when the comparison is hot, because <code>$expr</code> is evaluated per document and cannot use an index range for the comparison itself.</p>
<p>The other six parts are the module's operators applied to a realistic question. The restock shortlist shows how naturally the families compose: sibling fields are ANDed, so <code>{ stock: { $lte: 7 }, $nor: [...] }</code> is one comparison AND one negated group. Trace it — <code>$lte: 7</code> admits Alpha Laptop (4), Beta Phone (0), Epsilon Keyboard (7) and Zeta Dock (2), then <code>$nor</code> requires both branches false, removing Beta Phone (it is a phone) and Epsilon Keyboard (80 is below 100). The <code>$exists: false</code> on the dot path <code>"specs.warrantyMonths"</code> finds the one product whose subdocument was written without that key, and the Acme query shows that two sibling dot paths into the same subdocument are ANDed just like any other pair of fields — safe here, though for conditions that must hold on the same <em>array</em> element you would still need <code>$elemMatch</code>, as the poor-reviews part does.</p>
<p><code>$all</code> versus a pair of equalities is worth restating: <code>{ tags: { $all: ["desk", "work"] } }</code> requires both tags on the same document in any order and tolerates extras, which is why Epsilon Keyboard with three tags matches alongside Gamma Monitor with two. Writing <code>{ tags: "desk", tags: "work" }</code> instead is the duplicate-key bug from the first exercise: JavaScript keeps only the last key and you silently query for <code>"work"</code> alone.</p>
<p>The summary block covers the read-side utilities. <code>distinct("specs.brand")</code> walks a dot path and returns the unique values sorted, so a missing key simply contributes nothing — the result is <code>['Acme', 'Nova', 'Vista']</code>. <code>countDocuments({ tags: { $size: 0 } })</code> counts server-side without transferring documents. And the top-two query combines everything the module covered about shaping results: a sort on <code>price</code> descending, a <code>limit</code>, an inclusion projection, and a <code>$slice</code> that trims each product's <code>reviews</code> array to a one-item preview. Remember that projected fields print in the order they are <em>stored</em>, not the order you list them in the projection, which is why <code>name</code> precedes <code>price</code> precedes <code>reviews</code> here — a detail that breaks naive string comparisons in tests.</p>`,
    diagramMermaid: `flowchart TD
  A[catalog collection] --> B[expr compares cost against price per document]
  A --> C[stock comparison combined with nor exclusions]
  A --> D[exists false on a dot path finds missing specs]
  A --> E[all requires both tags on one document]
  A --> F[elemMatch finds one low rated review]
  A --> G[distinct and countDocuments summarise]
  A --> H[sort limit and slice build the preview]`,
    reset: CATALOG,
  },
];

// ---- emit payload + verify (mongosh, reset before each) ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });

const clean = exercises.map((ex) => ({
  title: ex.title, difficulty: ex.difficulty, estimatedMinutes: ex.estimatedMinutes, points: ex.points,
  concepts: ex.concepts, prerequisites: ex.prerequisites, tags: ex.tags,
  problemHtml: ex.problemHtml, inputSpec: ex.inputSpec, outputSpec: ex.outputSpec, constraints: ex.constraints,
  examplesJson: ex.examplesJson, hintsJson: ex.hintsJson,
  starterCodeJson: [{ name: 'solution.js', language: L, code: ex.starter }],
  solutionCodeJson: [{ name: 'solution.js', language: L, code: ex.solution }],
  solutionExplanationHtml: ex.solutionExplanationHtml,
  ...(ex.diagramMermaid ? { diagramMermaid: ex.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let js = "db = db.getSiblingDB('cl_mongo415')\n";
exercises.forEach((ex, i) => {
  js += `print("========== EX ${i + 1}: ${ex.title.replace(/"/g, '')} ==========")\n`;
  js += (ex.reset || '') + '\n';
  js += 'print("---- solution output ----")\n';
  js += ex.solution + '\n';
});
fs.writeFileSync(path.join(VERIFY, `mongodb-415.js`), js);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error(`expected 10 exercises, got ${parsed.exercises.length}`);
const titles = new Set();
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (titles.has(ex.title)) throw new Error(`duplicate title ${ex.title}`);
  titles.add(ex.title);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  if (ex.examplesJson.length < 2) throw new Error(`<2 examples ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 205) throw new Error(`solution<205 ${ex.title} (${solLen})`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
