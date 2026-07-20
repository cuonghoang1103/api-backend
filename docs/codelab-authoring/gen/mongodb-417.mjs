// Generator for MongoDB module 417 (aggregation-framework-and-pipeline-building) — 10 exercises.
// Track language is "javascript"; solutions are mongosh aggregation pipelines (valid JS, identical
// shape in the Node driver). Every printed result in outputSpec / examplesJson was produced by
// piping the exact solution strings below to a real mongosh (mongo:7) against the shared SEED.
// Integer _id values and explicit $sort stages keep the output deterministic.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'mongodb';
const moduleSlug = 'aggregation-framework-and-pipeline-building';
const L = 'javascript';

// Shared seed: 20 orders across 4 regions / 4 statuses / 7 months, plus 5 customers.
// Order 16 has an empty items array and order 18 has no items field at all — those two
// documents are what make $unwind and $ifNull behaviour visible.
const SEED = `db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);`;

const DATASET =
  'An orders collection of 20 documents with fields _id (1..20), customerId, region (north/south/east/west), ' +
  'status (shipped/pending/delivered/cancelled), total, placedAt (dates through 2024), an items array of ' +
  '{ sku, qty, price } sub-documents, and an optional coupon field. Order 16 has an empty items array and ' +
  'order 18 has no items field. A customers collection holds c1..c5 with name, tier and city.';

const exercises = [
  {
    title: 'Shape Orders with a Two-Stage Match and Project Pipeline',
    difficulty: 'EASY',
    estimatedMinutes: 15,
    points: 10,
    concepts: ['aggregation pipeline', '$match', '$project', 'computed fields', '$count'],
    prerequisites: ['find with query operators', 'documents and fields'],
    tags: ['aggregation', 'pipeline', 'match', 'project', 'mongodb'],
    problemHtml: `<p>An aggregation pipeline is an array of stages, and documents flow through it one stage at a time: the output of stage <em>n</em> is the input of stage <em>n+1</em>. Nothing else is magic. <code>$match</code> is the filter stage — it takes the same query syntax you already use with <code>find</code> — and <code>$project</code> reshapes each surviving document, choosing which fields to keep and letting you build new ones from expressions.</p>
<p>The <code>orders</code> collection is seeded with 20 documents. Build two pipelines:</p>
<ul>
<li>A pipeline that keeps only orders whose <code>status</code> is <code>"shipped"</code>, then projects <code>region</code>, <code>total</code>, and a new computed field <code>totalWithVat</code> equal to <code>total</code> multiplied by <code>1.1</code>, rounded to 2 decimal places with <code>$round</code>. Keep <code>_id</code> and finish with <code>$sort</code> on <code>_id</code> ascending so the order is deterministic.</li>
<li>A second pipeline that matches the same shipped orders and ends in <code>{ $count: "shippedOrders" }</code>, which collapses the whole stream into a single document holding the count.</li>
</ul>
<p>Note two things while you work. A computed field in <code>$project</code> is written as <code>fieldName: expression</code>, where an expression references document fields with a dollar-prefixed string such as <code>"$total"</code>. And <code>$count</code> is a terminal stage — nothing survives it except the one count document. The scaffold provides both pipeline skeletons.</p>`,
    inputSpec: DATASET,
    outputSpec: 'The first pipeline returns 8 documents (_id 1, 4, 7, 10, 12, 14, 17, 18) each with _id, region, total and totalWithVat = total * 1.1. The second returns exactly [ { shippedOrders: 8 } ].',
    constraints: 'Use the aggregation pipeline, not find(). $match must be the first stage. Round totalWithVat with $round to 2 decimals. Do not compute the count in application code — use the $count stage.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $match: { status: "shipped" } }, { $project: { region: 1, total: 1, totalWithVat: { $round: [{ $multiply: ["$total", 1.1] }, 2] } } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: 1, region: 'north', total: 90, totalWithVat: 99 }, { _id: 4, region: 'east', total: 130, totalWithVat: 143 }, { _id: 7, region: 'north', total: 110, totalWithVat: 121 }, { _id: 10, region: 'west', total: 60, totalWithVat: 66 }, { _id: 12, region: 'south', total: 120, totalWithVat: 132 }, { _id: 14, region: 'north', total: 320, totalWithVat: 352 }, { _id: 17, region: 'south', total: 150, totalWithVat: 165 }, { _id: 18, region: 'east', total: 0, totalWithVat: 0 } ]",
        explanation: 'Eight of the twenty orders are shipped. $project keeps region and total, drops every other field except _id, and adds totalWithVat from the expression.',
      },
      {
        input: 'db.orders.aggregate([{ $match: { status: "shipped" } }, { $count: "shippedOrders" }])',
        output: '[ { shippedOrders: 8 } ]',
        explanation: '$count consumes the 8 documents that reached it and emits one document whose single field is named by the string you passed.',
      },
    ],
    hintsJson: [
      'A pipeline is an array; each element is one stage object, and documents flow left to right.',
      '$match takes exactly the filter document you would pass to find, so { status: "shipped" } is the whole stage.',
      'In $project, 1 keeps a field and fieldName: expression creates one; reference a field inside an expression as "$total".',
      '$round takes an array: { $round: [{ $multiply: ["$total", 1.1] }, 2] }. Finish the counting pipeline with { $count: "shippedOrders" }.',
    ],
    starter: `// Pipeline 1: shipped orders, projected with a computed VAT-inclusive total
db.orders.aggregate([
  // TODO: $match status "shipped"
  // TODO: $project region, total, and totalWithVat = round(total * 1.1, 2)
  // TODO: $sort by _id ascending
])

// Pipeline 2: how many shipped orders are there?
db.orders.aggregate([
  // TODO: $match status "shipped"
  // TODO: $count into a field named shippedOrders
])`,
    solution: `db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $project: { region: 1, total: 1, totalWithVat: { $round: [{ $multiply: ["$total", 1.1] }, 2] } } },
  { $sort: { _id: 1 } }
])

db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $count: "shippedOrders" }
])`,
    solutionExplanationHtml: `<p>The pipeline is a conveyor belt. Twenty documents enter <code>$match</code>, eight survive it, and those eight are what <code>$project</code> sees — the later stages never know the other twelve existed. That mental model is the whole framework: every stage transforms a stream of documents into another stream, and stages can add, remove, reorder, split or collapse documents.</p>
<p><code>$project</code> does two jobs at once here. Listing <code>region: 1</code> and <code>total: 1</code> is inclusion, exactly like a <code>find</code> projection, and everything not listed is dropped — except <code>_id</code>, which is included by default and would need <code>_id: 0</code> to remove. The third entry, <code>totalWithVat</code>, is an <em>expression</em>: <code>{ $multiply: ["$total", 1.1] }</code> reads the current document's <code>total</code> (the dollar prefix means "value of this field") and multiplies it, then <code>$round</code> trims the floating-point tail. Without <code>$round</code>, <code>110 * 1.1</code> prints as <code>121.00000000000001</code> — binary floating point, not a MongoDB quirk — which is why money calculations round explicitly.</p>
<p>The final <code>$sort</code> matters more than it looks. Aggregation makes no ordering promise unless you ask for one, so a result that "happens" to come back in <code>_id</code> order today can come back differently once the collection grows or the plan changes. The second pipeline shows the other kind of stage: <code>$count</code> is a collapsing terminal stage that turns the entire remaining stream into one document, so nothing can follow it usefully.</p>`,
    diagramMermaid: `flowchart TD
  A[orders collection 20 docs] --> B[stage 1 match status shipped]
  B --> C[8 docs]
  C --> D[stage 2 project region total totalWithVat]
  D --> E[8 reshaped docs]
  E --> F[stage 3 sort by id ascending]
  F --> G[final result]`,
    reset: SEED,
  },

  {
    title: 'Aggregate Revenue per Region with $group Accumulators',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['$group', '$sum', '$avg', '$max', 'group key _id'],
    prerequisites: ['$match', '$project'],
    tags: ['aggregation', 'group', 'accumulators', 'reporting', 'mongodb'],
    problemHtml: `<p><code>$group</code> is where aggregation stops looking like a fancy <code>find</code>. It partitions the incoming stream by a <strong>group key</strong> you place in <code>_id</code>, then folds every document in each partition into one output document using <strong>accumulators</strong>. The output <code>_id</code> is the key itself; every other output field must be produced by an accumulator such as <code>$sum</code>, <code>$avg</code>, <code>$min</code> or <code>$max</code>.</p>
<p>Produce a per-region sales summary from the <code>orders</code> collection:</p>
<ul>
<li>First drop cancelled orders with <code>$match</code> — they are not revenue.</li>
<li><code>$group</code> by <code>"$region"</code>, producing <code>orders</code> as a document count with <code>{ $sum: 1 }</code>, <code>revenue</code> as <code>{ $sum: "$total" }</code>, <code>avgTotal</code> as <code>{ $avg: "$total" }</code>, and <code>maxTotal</code> as <code>{ $max: "$total" }</code>.</li>
<li>Follow with a <code>$project</code> that rounds <code>avgTotal</code> to 2 decimals and keeps the other three fields.</li>
<li><code>$sort</code> by <code>revenue</code> descending so the strongest region is first.</li>
</ul>
<p>The idiom <code>{ $sum: 1 }</code> is worth memorising: it adds the literal 1 for every document in the group, which is how you count rows. Rounding has to happen <em>after</em> the group because <code>$round</code> is an expression, not an accumulator, and cannot be nested directly around <code>$avg</code> inside <code>$group</code>. The scaffold provides the stage skeleton.</p>`,
    inputSpec: DATASET,
    outputSpec: "Four documents ordered by revenue descending: north (orders 8, revenue 980, maxTotal 320, avgTotal 122.5), south (4, 450, 150, 112.5), east (3, 290, 160, 96.67), west (3, 230, 100, 76.67).",
    constraints: 'Exclude cancelled orders before grouping. Count with { $sum: 1 }, not by pushing documents and taking a size. Round avgTotal in a stage after $group. Sort by revenue descending.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: "$region", orders: { $sum: 1 }, revenue: { $sum: "$total" }, avgTotal: { $avg: "$total" }, maxTotal: { $max: "$total" } } }, { $project: { orders: 1, revenue: 1, avgTotal: { $round: ["$avgTotal", 2] }, maxTotal: 1 } }, { $sort: { revenue: -1 } }])',
        output: "[ { _id: 'north', orders: 8, revenue: 980, maxTotal: 320, avgTotal: 122.5 }, { _id: 'south', orders: 4, revenue: 450, maxTotal: 150, avgTotal: 112.5 }, { _id: 'east', orders: 3, revenue: 290, maxTotal: 160, avgTotal: 96.67 }, { _id: 'west', orders: 3, revenue: 230, maxTotal: 100, avgTotal: 76.67 } ]",
        explanation: 'North has 8 non-cancelled orders totalling 980. East and west each lose one cancelled order, so they group only 3 documents each. avgTotal for east is 290/3 = 96.666..., rounded to 96.67.',
      },
      {
        input: 'db.orders.aggregate([{ $group: { _id: "$region", orders: { $sum: 1 } } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: 'east', orders: 4 }, { _id: 'north', orders: 8 }, { _id: 'south', orders: 4 }, { _id: 'west', orders: 4 } ]",
        explanation: 'Without the $match, the cancelled orders 5 (west) and 13 (east) are included, so east and west report 4 instead of 3 — proof that the filter stage changes what $group sees.',
      },
    ],
    hintsJson: [
      'Grouping needs two things: what to group by, and what to compute for each group.',
      'The group key goes in _id: { $group: { _id: "$region", ... } }; every other field needs an accumulator.',
      'Counting documents is { $sum: 1 }; summing a field is { $sum: "$total" }. $avg and $max work the same way.',
      '$round is an expression, so apply it in a $project after the $group: avgTotal: { $round: ["$avgTotal", 2] }.',
    ],
    starter: `db.orders.aggregate([
  // TODO: $match to exclude status "cancelled"
  // TODO: $group by "$region" with orders, revenue, avgTotal and maxTotal
  // TODO: $project rounding avgTotal to 2 decimals
  // TODO: $sort by revenue descending
])`,
    solution: `db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: { _id: "$region", orders: { $sum: 1 }, revenue: { $sum: "$total" }, avgTotal: { $avg: "$total" }, maxTotal: { $max: "$total" } } },
  { $project: { orders: 1, revenue: 1, avgTotal: { $round: ["$avgTotal", 2] }, maxTotal: 1 } },
  { $sort: { revenue: -1 } }
])`,
    solutionExplanationHtml: `<p><code>$group</code> reads every incoming document, evaluates the <code>_id</code> expression to decide which bucket it belongs to, and feeds it to each accumulator for that bucket. With <code>_id: "$region"</code> the eighteen non-cancelled orders land in four buckets, and each bucket emits exactly one document. The accumulators run in a single pass: <code>$sum: 1</code> adds one per document (the counting idiom), <code>$sum: "$total"</code> adds the field's value, and <code>$avg</code> and <code>$max</code> track a running mean and maximum. Because it is one pass over the stream, computing five statistics costs no more reads than computing one.</p>
<p>Two ordering decisions carry all the meaning here. Putting <code>$match</code> first removes the cancelled orders <em>before</em> they can pollute the sums — grouping first and filtering afterwards would be both wrong (cancelled money already added) and slower. Putting <code>$round</code> after <code>$group</code> is forced by the type system: accumulators like <code>$avg</code> are only legal directly inside <code>$group</code>, while <code>$round</code> is an ordinary expression that operates on a field that already exists, so it belongs in a later <code>$project</code> or <code>$addFields</code>.</p>
<p>The trap most learners hit is assuming the groups come back in a useful order. They do not — <code>$group</code> emits buckets in an unspecified order (hash order in practice), so the trailing <code>$sort</code> is what makes "north first" a guarantee rather than a coincidence. Note also that the output document keeps the field order MongoDB chooses, which is why <code>maxTotal</code> prints before <code>avgTotal</code>: field order in the printed result is cosmetic and never something to assert on.</p>`,
    reset: SEED,
  },

  {
    title: 'Page a Ranked Report with $sort, $limit, $skip and Read the Explain Plan',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['$sort inside a pipeline', '$limit', '$skip', 'stage order and performance', 'explain queryPlanner'],
    prerequisites: ['$match', '$project', 'cursor sort and limit'],
    tags: ['aggregation', 'sort', 'pagination', 'explain', 'mongodb'],
    problemHtml: `<p>Ranked lists — top sellers, biggest orders, slowest endpoints — are <code>$sort</code> followed by <code>$limit</code>, and the page after that is <code>$skip</code> before the <code>$limit</code>. Inside a pipeline these are real stages, so their <em>position</em> is a performance decision, not a cosmetic one: a <code>$match</code> placed before a <code>$sort</code> shrinks the set that has to be sorted, and a <code>$limit</code> right after a <code>$sort</code> lets the server keep only the top N in memory instead of ordering everything.</p>
<p>Working with delivered orders:</p>
<ul>
<li>Build a pipeline that matches <code>status: "delivered"</code>, sorts by <code>total</code> descending with <code>_id</code> ascending as a tie-breaker, limits to 3, and projects <code>region</code> and <code>total</code>.</li>
<li>Build the second page: the same pipeline with <code>$skip: 3</code> before the <code>$limit: 3</code>.</li>
<li>Explain the first pipeline with <code>db.orders.explain("queryPlanner").aggregate([...])</code>, capture the result in a variable, and print <code>plan.queryPlanner.winningPlan</code> with <code>printjson</code>.</li>
</ul>
<p>Read the plan carefully: the <code>$match</code> does not appear as a pipeline stage at all — it was pushed down into the query layer and shows up as a <code>filter</code> on the <code>COLLSCAN</code>, and the <code>$limit</code> was absorbed into the <code>SORT</code> stage as <code>limitAmount</code>. That fusion is exactly the optimisation you are trying to enable. The scaffold provides all three skeletons.</p>`,
    inputSpec: DATASET + ' There are 7 delivered orders. No index exists on total, so the plan is a collection scan.',
    outputSpec: "Page 1 returns [ { _id: 20, region: 'north', total: 220 }, { _id: 11, region: 'north', total: 170 }, { _id: 8, region: 'east', total: 160 } ]; page 2 returns _id 19 (west, 100), 15 (west, 70), 6 (south, 30). The printed winningPlan is a SORT stage with sortPattern { total: -1, _id: 1 }, limitAmount 3, over an inputStage COLLSCAN whose filter is { status: { $eq: 'delivered' } }.",
    constraints: 'Sort with an explicit tie-breaker so paging is stable. $skip must come before $limit. Use explain("queryPlanner") — do not use executionStats, whose timings vary between runs.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $match: { status: "delivered" } }, { $sort: { total: -1, _id: 1 } }, { $limit: 3 }, { $project: { region: 1, total: 1 } }])',
        output: "[ { _id: 20, region: 'north', total: 220 }, { _id: 11, region: 'north', total: 170 }, { _id: 8, region: 'east', total: 160 } ]",
        explanation: 'The three largest delivered orders, highest first. $limit keeps only the first 3 documents the sort produces.',
      },
      {
        input: 'db.orders.aggregate([{ $match: { status: "delivered" } }, { $sort: { total: -1, _id: 1 } }, { $skip: 3 }, { $limit: 3 }, { $project: { region: 1, total: 1 } }])',
        output: "[ { _id: 19, region: 'west', total: 100 }, { _id: 15, region: 'west', total: 70 }, { _id: 6, region: 'south', total: 30 } ]",
        explanation: 'Page 2: the same ordering, with the first three discarded by $skip. Orders 20, 11 and 8 are gone and the next three appear.',
      },
      {
        input: 'const plan = db.orders.explain("queryPlanner").aggregate([{ $match: { status: "delivered" } }, { $sort: { total: -1, _id: 1 } }, { $limit: 3 }]); printjson(plan.queryPlanner.winningPlan)',
        output: "{ stage: 'SORT', sortPattern: { total: -1, _id: 1 }, memLimit: 104857600, limitAmount: 3, type: 'simple', inputStage: { stage: 'COLLSCAN', filter: { status: { '$eq': 'delivered' } }, direction: 'forward' } }",
        explanation: 'The $match became the COLLSCAN filter and the $limit became limitAmount on the SORT — the optimiser fused three pipeline stages into one plan tree.',
      },
    ],
    hintsJson: [
      'Ordering, paging and inspection are three separate pipelines over the same data.',
      '$sort takes { field: 1 } for ascending and { field: -1 } for descending; list a second field to break ties.',
      'For page N the stages are $sort, then $skip of (N-1)*pageSize, then $limit of pageSize — skip always before limit.',
      'db.orders.explain("queryPlanner").aggregate([...]) returns an object; the plan tree lives at .queryPlanner.winningPlan.',
    ],
    starter: `// Page 1: three biggest delivered orders
db.orders.aggregate([
  // TODO: $match delivered
  // TODO: $sort total desc with _id asc as tie-breaker
  // TODO: $limit 3
  // TODO: $project region and total
])

// Page 2: the next three
db.orders.aggregate([
  // TODO: same stages, with $skip 3 before $limit 3
])

// Inspect the plan for page 1
// TODO: const plan = db.orders.explain("queryPlanner").aggregate([...])
// TODO: printjson(plan.queryPlanner.winningPlan)`,
    solution: `db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $limit: 3 },
  { $project: { region: 1, total: 1 } }
])

db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $skip: 3 },
  { $limit: 3 },
  { $project: { region: 1, total: 1 } }
])

const plan = db.orders.explain("queryPlanner").aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $limit: 3 }
])
printjson(plan.queryPlanner.winningPlan)`,
    solutionExplanationHtml: `<p>The three stages compose in a fixed logical order: sort establishes a total ordering, skip discards a prefix of it, limit takes the next slice. Writing <code>$limit</code> before <code>$skip</code> would mean "take 3, then throw 3 away" and return nothing, which is the classic paging bug. The tie-breaker matters just as much: orders 2 and 17 both total 150 elsewhere in this dataset, and without a second sort key such ties can be ordered differently between runs, so a document can appear on both page 1 and page 2 or on neither. Sorting on a unique field last — here <code>_id</code> — makes the ordering total and paging stable.</p>
<p>The explain output is the payoff. What you wrote as four stages does not survive as four stages: the optimiser pushed <code>$match</code> down into the query layer, where it appears as <code>filter: { status: { $eq: 'delivered' } }</code> on the <code>COLLSCAN</code>, and folded <code>$limit: 3</code> into the <code>SORT</code> as <code>limitAmount: 3</code>. That fold is a genuine algorithmic change — a top-3 sort keeps a 3-element heap instead of materialising and ordering all seven documents, and the same trick is what saves a server when the input is a million documents rather than twenty. <code>memLimit: 104857600</code> is the 100 MB in-memory sort budget; exceed it without a supporting index and the pipeline errors unless you pass <code>allowDiskUse: true</code>.</p>
<p>The rule this exercise is really teaching is: put <code>$match</code> as early as possible so fewer documents reach the expensive stages, and put <code>$limit</code> immediately after <code>$sort</code> so the sort itself can be bounded. The optimiser will move a <code>$match</code> earlier on its own when it provably can, but it cannot do so past stages that invent fields — once you <code>$group</code> or <code>$project</code> a computed value, a later filter on that value has to run after it. Note also that <code>explain("queryPlanner")</code> plans without running; <code>executionStats</code> would execute the pipeline and report timings that differ on every run.</p>`,
    reset: SEED,
  },

  {
    title: 'Explode Order Line Items with $unwind and preserveNullAndEmptyArrays',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['$unwind', 'document multiplication', 'preserveNullAndEmptyArrays', 'includeArrayIndex', '$count'],
    prerequisites: ['$match', 'embedded arrays', '$count'],
    tags: ['aggregation', 'unwind', 'arrays', 'embedded', 'mongodb'],
    problemHtml: `<p><code>$unwind</code> takes a document containing an array and emits one output document per array element, each carrying a single element in place of the array. A collection of 20 orders becomes a stream of individual line items — the shape you need before you can group, sum or rank by anything inside the array. The cost is that your document count changes, and understanding exactly how it changes is what separates a correct report from a plausible-looking wrong one.</p>
<p>Measure the multiplication effect on the <code>orders</code> collection, where order 16 has an empty <code>items</code> array and order 18 has no <code>items</code> field at all:</p>
<ul>
<li>Count the raw documents with <code>db.orders.countDocuments()</code>.</li>
<li>Pipeline: <code>$unwind: "$items"</code> then <code>{ $count: "itemRows" }</code> — how many line items exist.</li>
<li>Pipeline: <code>$unwind</code> in its object form with <code>preserveNullAndEmptyArrays: true</code>, then <code>$count</code> into <code>rowsWithEmpties</code>. Compare the two counts and explain the difference.</li>
<li>Pipeline: match order 1 only, unwind with <code>includeArrayIndex: "idx"</code>, and project <code>idx</code> plus <code>sku</code> and <code>qty</code> lifted out of the unwound element with <code>"$items.sku"</code> and <code>"$items.qty"</code>.</li>
</ul>
<p>Predict all three counts before running anything, then check yourself. The scaffold provides the four skeletons.</p>`,
    inputSpec: DATASET + ' The 20 orders hold 27 line items in total; order 16 has items: [] and order 18 has no items field.',
    outputSpec: 'countDocuments() returns 20; the plain $unwind pipeline returns [ { itemRows: 27 } ]; the preserveNullAndEmptyArrays pipeline returns [ { rowsWithEmpties: 29 } ]; the order-1 pipeline returns two documents with idx Long(0) sku KB qty 1 and idx Long(1) sku MS qty 2.',
    constraints: 'Use the $unwind stage — do not flatten arrays in application code. Use the object form { path, preserveNullAndEmptyArrays } and { path, includeArrayIndex } rather than the shorthand where options are needed.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $unwind: "$items" }, { $count: "itemRows" }])',
        output: '[ { itemRows: 27 } ]',
        explanation: '27 line items across the collection. Orders 16 (empty array) and 18 (no items field) produce zero output documents and vanish from the stream.',
      },
      {
        input: 'db.orders.aggregate([{ $unwind: { path: "$items", preserveNullAndEmptyArrays: true } }, { $count: "rowsWithEmpties" }])',
        output: '[ { rowsWithEmpties: 29 } ]',
        explanation: 'Two more rows than before: orders 16 and 18 now survive, each as one document with no items field set.',
      },
      {
        input: 'db.orders.aggregate([{ $match: { _id: 1 } }, { $unwind: { path: "$items", includeArrayIndex: "idx" } }, { $project: { idx: 1, sku: "$items.sku", qty: "$items.qty" } }])',
        output: "[ { _id: 1, idx: Long('0'), sku: 'KB', qty: 1 }, { _id: 1, idx: Long('1'), sku: 'MS', qty: 2 } ]",
        explanation: 'One order with two items becomes two documents sharing _id 1; includeArrayIndex records the original position as a 64-bit integer.',
      },
    ],
    hintsJson: [
      'One document with an array of n elements becomes n documents — so the total count changes.',
      'The shorthand { $unwind: "$items" } silently drops documents whose array is empty or missing.',
      'The object form { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } } keeps those documents instead.',
      'After unwinding, the element sits at "$items", so project sub-fields as sku: "$items.sku". includeArrayIndex: "idx" adds the position.',
    ],
    starter: `db.orders.countDocuments()

// How many line items are there in total?
db.orders.aggregate([
  // TODO: $unwind the items array
  // TODO: $count into itemRows
])

// Same, but keep orders that have no line items
db.orders.aggregate([
  // TODO: $unwind with preserveNullAndEmptyArrays: true
  // TODO: $count into rowsWithEmpties
])

// Inspect one order's items with their original positions
db.orders.aggregate([
  // TODO: $match _id 1
  // TODO: $unwind with includeArrayIndex: "idx"
  // TODO: $project idx, sku and qty out of the unwound element
])`,
    solution: `db.orders.countDocuments()

db.orders.aggregate([
  { $unwind: "$items" },
  { $count: "itemRows" }
])

db.orders.aggregate([
  { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
  { $count: "rowsWithEmpties" }
])

db.orders.aggregate([
  { $match: { _id: 1 } },
  { $unwind: { path: "$items", includeArrayIndex: "idx" } },
  { $project: { idx: 1, sku: "$items.sku", qty: "$items.qty" } }
])`,
    solutionExplanationHtml: `<p><code>$unwind</code> multiplies documents. An order with three line items leaves the stage as three documents, identical except that <code>items</code> now holds a single sub-document rather than the array. Summing the array lengths across the collection gives 27, which is exactly the <code>itemRows</code> count — every remaining field, including <code>_id</code>, is duplicated onto each row, so <code>_id</code> is no longer unique in the stream.</p>
<p>The 27-versus-29 gap is the point of the exercise. By default <code>$unwind</code> emits <em>nothing</em> for a document whose array is empty, whose field is <code>null</code>, or whose field is missing entirely — from a set-theoretic view it is an inner join against the array, and zero elements means zero rows. Order 16 (<code>items: []</code>) and order 18 (no <code>items</code> field) therefore disappear silently. Setting <code>preserveNullAndEmptyArrays: true</code> turns it into a left outer join: those two orders survive as one document each, with <code>items</code> simply absent, taking the count to 29.</p>
<p>This is the single most common source of quietly wrong aggregation reports. Unwind order line items to compute revenue per customer and every customer whose orders contained no items vanishes from the report — not with a zero, but with no row at all. The fix is either <code>preserveNullAndEmptyArrays: true</code> plus an <code>$ifNull</code> when you read the element, or an explicit acknowledgement that empty orders are out of scope. The other habit worth forming is remembering that after unwinding you address the element as <code>"$items.sku"</code>, not <code>"$items.0.sku"</code>, and that <code>includeArrayIndex</code> gives you the original position as a 64-bit integer (printed as <code>Long('0')</code> in mongosh) when order within the array carries meaning.</p>`,
    diagramMermaid: `flowchart TD
  A[order 1 with items KB and MS] --> B[unwind items]
  B --> C[doc id 1 items KB]
  B --> D[doc id 1 items MS]
  E[order 16 with empty items array] --> F[unwind items]
  F --> G[no output document by default]
  F --> H[one document when preserveNullAndEmptyArrays is true]`,
    reset: SEED,
  },

  {
    title: 'Group by a Compound Key with $push, $addToSet, $first and $last',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['compound group key', '$push', '$addToSet', '$first and $last', '$min and $max', '$sortArray'],
    prerequisites: ['$group', '$sort', 'accumulators'],
    tags: ['aggregation', 'group', 'accumulators', 'arrays', 'mongodb'],
    problemHtml: `<p>A group key does not have to be a single field. Set <code>_id</code> to a document and you group by the combination — the equivalent of SQL's <code>GROUP BY a, b</code> — and the resulting <code>_id</code> is that whole sub-document. Alongside the numeric accumulators, MongoDB gives you collection accumulators: <code>$push</code> keeps every value, <code>$addToSet</code> keeps the distinct ones, and <code>$first</code> and <code>$last</code> take the value from the first and last document to reach the group.</p>
<p>Build a per-region, per-status breakdown of <code>orders</code>:</p>
<ul>
<li><code>$sort</code> by <code>placedAt</code> ascending <strong>first</strong> — <code>$first</code> and <code>$last</code> mean "first and last document that arrived", so they are only meaningful if you impose the order yourself.</li>
<li><code>$group</code> with <code>_id: { region: "$region", status: "$status" }</code> and these fields: <code>orders</code> counting documents, <code>firstOrderId</code> via <code>$first</code> of <code>"$_id"</code>, <code>lastOrderId</code> via <code>$last</code>, <code>ids</code> via <code>$push</code> of <code>"$_id"</code>, <code>buyers</code> via <code>$addToSet</code> of <code>"$customerId"</code>, plus <code>minTotal</code> and <code>maxTotal</code>.</li>
<li><code>$addFields</code> replacing <code>buyers</code> with <code>{ $sortArray: { input: "$buyers", sortBy: 1 } }</code>, because <code>$addToSet</code> makes no ordering promise.</li>
<li><code>$sort</code> by <code>"_id.region"</code> then <code>"_id.status"</code> — note the dotted path into the compound key.</li>
</ul>
<p>Twelve region-and-status combinations exist in the data. The scaffold provides the stage skeleton.</p>`,
    inputSpec: DATASET,
    outputSpec: "Twelve documents ordered by region then status. For example { _id: { region: 'north', status: 'shipped' }, orders: 3, firstOrderId: 1, lastOrderId: 14, ids: [ 1, 7, 14 ], buyers: [ 'c1', 'c5' ], minTotal: 90, maxTotal: 320 } and { _id: { region: 'east', status: 'shipped' }, orders: 2, firstOrderId: 4, lastOrderId: 18, ids: [ 4, 18 ], buyers: [ 'c3' ], minTotal: 0, maxTotal: 130 }.",
    constraints: 'The group key must be a compound document, not a concatenated string. Sort by placedAt before grouping so $first and $last are deterministic. Sort the $addToSet result with $sortArray — do not rely on its natural order.',
    examplesJson: [
      {
        input: 'The full pipeline, looking at the north/shipped group',
        output: "{ _id: { region: 'north', status: 'shipped' }, orders: 3, firstOrderId: 1, lastOrderId: 14, ids: [ 1, 7, 14 ], buyers: [ 'c1', 'c5' ], minTotal: 90, maxTotal: 320 }",
        explanation: 'Orders 1, 7 and 14 are north and shipped. Sorted by placedAt they arrive in that order, so $first is 1 and $last is 14. $push keeps all three ids; $addToSet collapses customers c1, c5, c1 to two distinct values.',
      },
      {
        input: 'The same pipeline, looking at the north/delivered group',
        output: "{ _id: { region: 'north', status: 'delivered' }, orders: 3, firstOrderId: 3, lastOrderId: 20, ids: [ 3, 11, 20 ], buyers: [ 'c1', 'c5' ], minTotal: 20, maxTotal: 220 }",
        explanation: 'A different status in the same region is a different group entirely, because the key is the pair. minTotal and maxTotal span orders 3 (20) and 20 (220).',
      },
      {
        input: 'The same pipeline, looking at the west/cancelled group',
        output: "{ _id: { region: 'west', status: 'cancelled' }, orders: 1, firstOrderId: 5, lastOrderId: 5, ids: [ 5 ], buyers: [ 'c4' ], minTotal: 300, maxTotal: 300 }",
        explanation: 'A single-document group: $first and $last are the same order, $push yields a one-element array, and min equals max.',
      },
    ],
    hintsJson: [
      'Grouping by two fields at once means the key itself is a document.',
      'Write _id: { region: "$region", status: "$status" }; the output _id is that whole sub-document.',
      '$push: "$_id" collects every value including duplicates; $addToSet: "$customerId" keeps only distinct ones.',
      '$first and $last depend on arrival order, so $sort by placedAt before $group; and sort the compound key with dotted paths like { "_id.region": 1 }.',
    ],
    starter: `db.orders.aggregate([
  // TODO: $sort by placedAt ascending so $first and $last are deterministic
  // TODO: $group by { region, status } with orders, firstOrderId, lastOrderId,
  //       ids ($push), buyers ($addToSet), minTotal and maxTotal
  // TODO: $addFields sorting buyers with $sortArray
  // TODO: $sort by "_id.region" then "_id.status"
])`,
    solution: `db.orders.aggregate([
  { $sort: { placedAt: 1 } },
  { $group: {
      _id: { region: "$region", status: "$status" },
      orders: { $sum: 1 },
      firstOrderId: { $first: "$_id" },
      lastOrderId: { $last: "$_id" },
      ids: { $push: "$_id" },
      buyers: { $addToSet: "$customerId" },
      minTotal: { $min: "$total" },
      maxTotal: { $max: "$total" }
  } },
  { $addFields: { buyers: { $sortArray: { input: "$buyers", sortBy: 1 } } } },
  { $sort: { "_id.region": 1, "_id.status": 1 } }
])`,
    solutionExplanationHtml: `<p>Setting <code>_id</code> to <code>{ region: "$region", status: "$status" }</code> makes the group key a pair, so <code>north/shipped</code> and <code>north/delivered</code> are distinct buckets and the twenty orders fall into twelve groups. The key is echoed back as a nested document, which is why the final sort uses dotted paths: <code>{ "_id.region": 1, "_id.status": 1 }</code>. Sorting on <code>_id</code> alone would compare whole documents field by field, which happens to work here but breaks as soon as the key's field order changes.</p>
<p>The collection accumulators differ in exactly one way that matters. <code>$push</code> appends every value it sees, so <code>ids</code> is a faithful list of the group's members and its length equals the count. <code>$addToSet</code> deduplicates, so the north/shipped group's customers c1, c5 and c1 collapse to <code>[ 'c1', 'c5' ]</code> — use it for "which distinct entities appear", use <code>$push</code> for "list every row". Both build arrays in memory, and a single group is capped at 100 MB, so pushing whole documents across a large collection is the classic way to blow up a pipeline; push only the fields you need.</p>
<p><code>$first</code> and <code>$last</code> are the subtle pair. They are not "smallest" and "largest" — they take the value from the first and last document that <em>reached</em> the group, so their meaning is defined entirely by the preceding <code>$sort</code>. With <code>$sort: { placedAt: 1 }</code> they become "earliest order" and "latest order", which is genuinely useful; without it they return whatever the storage engine happened to hand over. For extremes of a value, <code>$min</code> and <code>$max</code> are the correct tools and need no sort at all. The same caution applies to <code>$addToSet</code>, whose output order is unspecified: the <code>$sortArray</code> in the following <code>$addFields</code> is what makes <code>buyers</code> reproducible rather than merely usually-the-same.</p>`,
    reset: SEED,
  },

  {
    title: 'Derive Order Flags with $addFields, $set, $cond, $switch and $ifNull',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['$addFields', '$set', '$cond', '$switch', '$ifNull', '$size'],
    prerequisites: ['$project', 'aggregation expressions', '$match'],
    tags: ['aggregation', 'addfields', 'conditional', 'expressions', 'mongodb'],
    problemHtml: `<p><code>$project</code> is destructive: anything you do not list is dropped. When you only want to <em>add</em> a derived field, <code>$addFields</code> (and its identical alias <code>$set</code>) is the right stage — it keeps the whole document and layers new fields on top, or overwrites existing ones with the same name. Combined with the conditional expressions, this is how raw documents grow the flags and bands that a report needs.</p>
<p>Enrich the <code>orders</code> collection, remembering that <code>coupon</code> is missing on most orders, order 16 has an empty <code>items</code> array, and order 18 has no <code>items</code> field at all:</p>
<ul>
<li><code>$addFields</code> that overwrites <code>coupon</code> with <code>{ $ifNull: ["$coupon", "NONE"] }</code> and adds <code>itemCount</code> as <code>{ $size: { $ifNull: ["$items", []] } }</code>.</li>
<li><code>$set</code> that adds <code>sizeBand</code> using <code>$switch</code>: <code>"large"</code> when <code>total</code> is at least 200, <code>"medium"</code> when it is at least 100, otherwise <code>"small"</code>; and <code>isCancelled</code> using the array form of <code>$cond</code> comparing <code>status</code> to <code>"cancelled"</code>.</li>
<li><code>$match</code> down to <code>_id</code> in <code>[5, 14, 16, 18]</code> — one cancelled order, one couponed order, one with an empty array and one with no array.</li>
<li><code>$project</code> <code>total</code>, <code>coupon</code>, <code>itemCount</code>, <code>sizeBand</code> and <code>isCancelled</code>, then <code>$sort</code> by <code>_id</code>.</li>
</ul>
<p>Note that the <code>$match</code> deliberately comes <em>after</em> the computed fields — it filters on <code>_id</code>, which existed all along, but filtering on <code>sizeBand</code> would only be legal here. The scaffold provides the stage skeleton.</p>`,
    inputSpec: DATASET,
    outputSpec: "Four documents: _id 5 (total 300, coupon 'NONE', itemCount 1, sizeBand 'large', isCancelled true), _id 14 (320, 'SAVE10', 2, 'large', false), _id 16 (0, 'NONE', 0, 'small', false) and _id 18 (0, 'NONE', 0, 'small', false).",
    constraints: 'Use $addFields/$set to keep the original fields — do not rebuild documents with $project. $size errors on a missing field, so guard it with $ifNull. Use $switch for the three-way band, not nested $cond.',
    examplesJson: [
      {
        input: 'The full pipeline, row for order 14 (total 320, coupon SAVE10, two line items)',
        output: "{ _id: 14, total: 320, coupon: 'SAVE10', itemCount: 2, sizeBand: 'large', isCancelled: false }",
        explanation: 'coupon exists so $ifNull returns it unchanged; $size counts the two line items; 320 is at least 200 so the first $switch branch wins; the status is shipped so $cond yields false.',
      },
      {
        input: 'The full pipeline, row for order 18 (no items field, no coupon, total 0)',
        output: "{ _id: 18, total: 0, coupon: 'NONE', itemCount: 0, sizeBand: 'small', isCancelled: false }",
        explanation: '$ifNull supplies "NONE" for the missing coupon and an empty array for the missing items, so $size returns 0 instead of raising an error. No $switch branch matches 0, so the default applies.',
      },
      {
        input: 'The full pipeline, row for order 5 (cancelled, total 300)',
        output: "{ _id: 5, total: 300, coupon: 'NONE', itemCount: 1, sizeBand: 'large', isCancelled: true }",
        explanation: 'The $cond comparison is true for the cancelled status. Note $switch evaluates branches top to bottom, so 300 matches the 200 branch and never reaches the 100 branch.',
      },
    ],
    hintsJson: [
      'You want the original document plus extra fields, so reach for the additive stage rather than the reshaping one.',
      '$addFields and $set are the same stage under two names; both keep every existing field.',
      '$ifNull: ["$coupon", "NONE"] substitutes a default when the field is missing or null — wrap $size the same way with an empty array.',
      '$switch takes { branches: [ { case, then }, ... ], default }, and branches are tested in order; $cond in array form is [ condition, thenValue, elseValue ].',
    ],
    starter: `db.orders.aggregate([
  // TODO: $addFields — coupon defaulted with $ifNull, itemCount from $size of a null-guarded items
  // TODO: $set — sizeBand via $switch (200 -> large, 100 -> medium, else small)
  //       and isCancelled via $cond on status
  // TODO: $match _id in [5, 14, 16, 18]
  // TODO: $project total, coupon, itemCount, sizeBand, isCancelled
  // TODO: $sort by _id ascending
])`,
    solution: `db.orders.aggregate([
  { $addFields: {
      coupon: { $ifNull: ["$coupon", "NONE"] },
      itemCount: { $size: { $ifNull: ["$items", []] } }
  } },
  { $set: {
      sizeBand: { $switch: { branches: [
        { case: { $gte: ["$total", 200] }, then: "large" },
        { case: { $gte: ["$total", 100] }, then: "medium" }
      ], default: "small" } },
      isCancelled: { $cond: [{ $eq: ["$status", "cancelled"] }, true, false] }
  } },
  { $match: { _id: { $in: [5, 14, 16, 18] } } },
  { $project: { total: 1, coupon: 1, itemCount: 1, sizeBand: 1, isCancelled: 1 } },
  { $sort: { _id: 1 } }
])`,
    solutionExplanationHtml: `<p><code>$addFields</code> and <code>$set</code> are literally the same stage — <code>$set</code> was added in MongoDB 4.2 as an alias that reads better when you are overwriting rather than adding. Both merge their result into the incoming document, so writing <code>coupon: { $ifNull: ["$coupon", "NONE"] }</code> replaces the field in place while every other field survives untouched. That is the difference from <code>$project</code>, which starts from nothing and keeps only what you list.</p>
<p><code>$ifNull</code> does the defensive work, and it is doing two different jobs here. On <code>coupon</code> it substitutes a display value so downstream grouping does not need a special case for absent fields. On <code>items</code> it prevents an error: <code>$size</code> throws if its argument is not an array, so order 18, which has no <code>items</code> field at all, would abort the entire pipeline with "The argument to $size must be an array" — one bad document out of twenty kills the whole report. Wrapping it as <code>{ $size: { $ifNull: ["$items", []] } }</code> yields 0 for both the missing field and the empty array of order 16. Schema-flexible collections make this pattern routine rather than paranoid.</p>
<p>The two conditionals cover the common shapes. <code>$cond</code> is the ternary: in array form <code>[ condition, thenValue, elseValue ]</code>, or in object form with <code>if</code>, <code>then</code>, <code>else</code> keys. <code>$switch</code> is the multi-way version, and its branches are evaluated <strong>top to bottom with the first match winning</strong> — which is why the 200 branch must be listed before the 100 branch. Reverse them and every order over 200 would be labelled medium, a bug that produces perfectly plausible output. If no branch matches and you omitted <code>default</code>, <code>$switch</code> raises an error rather than returning null, so always supply one. Finally, note that a computed field only exists <em>after</em> the stage that creates it: a <code>$match</code> on <code>sizeBand</code> must sit after this <code>$set</code>, and the optimiser cannot hoist it earlier the way it hoists a match on a stored field.</p>`,
    reset: SEED,
  },

  {
    title: 'Bucket Revenue by Month and Quarter with Date Expressions',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['$dateToString', '$dateTrunc', 'time bucketing', '$group by expression', 'time series reporting'],
    prerequisites: ['$group', '$sum', '$sort'],
    tags: ['aggregation', 'dates', 'grouping', 'reporting', 'mongodb'],
    problemHtml: `<p>Almost every business report is "something per time period", and the way you express the period is by grouping on a <em>date expression</em> rather than a stored field. Two operators dominate: <code>$dateToString</code> formats a date into a string key such as <code>"2024-03"</code>, which sorts lexicographically in chronological order and is ready to display; <code>$dateTrunc</code> rounds a date down to the start of a unit — hour, day, week, month, quarter, year — keeping it a real date so it can still be compared and formatted later.</p>
<p>Report on non-cancelled orders in the <code>orders</code> collection, whose <code>placedAt</code> values span January to July 2024:</p>
<ul>
<li>A monthly pipeline: <code>$match</code> out cancelled orders, then <code>$group</code> with <code>_id: { $dateToString: { format: "%Y-%m", date: "$placedAt" } }</code> computing <code>orders</code> and <code>revenue</code>, then <code>$sort</code> by <code>_id</code> ascending.</li>
<li>A quarterly pipeline over the same filtered set, grouping on <code>{ $dateTrunc: { date: "$placedAt", unit: "quarter" } }</code> and summing <code>revenue</code>, sorted by <code>_id</code> ascending.</li>
</ul>
<p>Check the two results against each other: the three quarterly figures must add up to the sum of the seven monthly figures, because they partition the same documents. If they disagree, one of the two pipelines is filtering differently. The scaffold provides both skeletons.</p>`,
    inputSpec: DATASET + ' placedAt values run from 2024-01-05 to 2024-07-18; two orders are cancelled and excluded.',
    outputSpec: "The monthly pipeline returns seven documents: 2024-01 (2 orders, 240), 2024-02 (2, 150), 2024-03 (3, 300), 2024-04 (3, 280), 2024-05 (2, 440), 2024-06 (3, 220), 2024-07 (3, 320). The quarterly pipeline returns three: ISODate('2024-01-01T00:00:00.000Z') 690, ISODate('2024-04-01T00:00:00.000Z') 940, ISODate('2024-07-01T00:00:00.000Z') 320.",
    constraints: 'Exclude cancelled orders in both pipelines. Group on the date expression itself — do not add a month field with $addFields first. Use %Y-%m (zero-padded) so the string keys sort chronologically.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$placedAt" } }, orders: { $sum: 1 }, revenue: { $sum: "$total" } } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: '2024-01', orders: 2, revenue: 240 }, { _id: '2024-02', orders: 2, revenue: 150 }, { _id: '2024-03', orders: 3, revenue: 300 }, { _id: '2024-04', orders: 3, revenue: 280 }, { _id: '2024-05', orders: 2, revenue: 440 }, { _id: '2024-06', orders: 3, revenue: 220 }, { _id: '2024-07', orders: 3, revenue: 320 } ]",
        explanation: 'February shows 2 orders and 150 because the 300 cancelled order 5 was filtered out; May shows 440 for the same reason (order 13 removed).',
      },
      {
        input: 'db.orders.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: { $dateTrunc: { date: "$placedAt", unit: "quarter" } }, revenue: { $sum: "$total" } } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: ISODate('2024-01-01T00:00:00.000Z'), revenue: 690 }, { _id: ISODate('2024-04-01T00:00:00.000Z'), revenue: 940 }, { _id: ISODate('2024-07-01T00:00:00.000Z'), revenue: 320 } ]",
        explanation: 'Q1 is 240 + 150 + 300 = 690 and Q2 is 280 + 440 + 220 = 940, matching the monthly numbers. $dateTrunc keeps the key a Date pinned to the first instant of the quarter.',
      },
    ],
    hintsJson: [
      'The period is not stored anywhere — you have to compute it from placedAt inside the group key.',
      'A $group _id can be any expression, so put the date operator directly in it.',
      '$dateToString: { format: "%Y-%m", date: "$placedAt" } gives a sortable string; %m is zero padded.',
      '$dateTrunc: { date: "$placedAt", unit: "quarter" } rounds down to 2024-01-01, 2024-04-01 or 2024-07-01 and stays a Date.',
    ],
    starter: `// Monthly revenue, excluding cancelled orders
db.orders.aggregate([
  // TODO: $match out cancelled
  // TODO: $group on a "%Y-%m" $dateToString key with orders and revenue
  // TODO: $sort by _id ascending
])

// Quarterly revenue over the same filtered set
db.orders.aggregate([
  // TODO: $match out cancelled
  // TODO: $group on a $dateTrunc quarter key with revenue
  // TODO: $sort by _id ascending
])`,
    solution: `db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$placedAt" } },
      orders: { $sum: 1 },
      revenue: { $sum: "$total" }
  } },
  { $sort: { _id: 1 } }
])

db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: {
      _id: { $dateTrunc: { date: "$placedAt", unit: "quarter" } },
      revenue: { $sum: "$total" }
  } },
  { $sort: { _id: 1 } }
])`,
    solutionExplanationHtml: `<p>The group key is an expression, so the time bucket is computed on the fly and never has to be stored. <code>$dateToString</code> with <code>format: "%Y-%m"</code> turns every <code>placedAt</code> into a four-digit year, a hyphen and a zero-padded month, so January 2024 becomes <code>"2024-01"</code>. Zero padding is what makes the trailing <code>$sort: { _id: 1 }</code> chronological: string comparison puts <code>"2024-10"</code> after <code>"2024-09"</code>, whereas an unpadded <code>"2024-9"</code> would sort after <code>"2024-10"</code> and silently scramble a year-long report.</p>
<p><code>$dateTrunc</code> takes the other approach: it rounds the date down to the start of the requested unit and returns a <code>Date</code>. Every Q2 order collapses to <code>2024-04-01T00:00:00Z</code>, which sorts correctly by nature, can be compared with range operators, and can be formatted for display later. Prefer it when the bucket key will be used in further date arithmetic, and prefer <code>$dateToString</code> when the key is a label you are about to render. The cross-check built into this exercise — 690 + 940 + 320 equals the seven monthly figures summed — is the habit worth keeping: two aggregations over the same filtered set at different granularities must reconcile, and a mismatch always means the filters diverged.</p>
<p>The production trap is time zones. Both operators default to UTC, so an order placed at 23:30 local time in Hanoi lands in the previous UTC day and can be counted in the wrong month at a boundary. Both accept a <code>timezone</code> option — <code>{ format: "%Y-%m", date: "$placedAt", timezone: "Asia/Ho_Chi_Minh" }</code> or the same key on <code>$dateTrunc</code> — and stating it explicitly is the only way a daily or monthly report agrees with what the business sees. A second, quieter gap: months with no orders produce no group at all, because aggregation can only summarise documents that exist. Dense time series with zero-filled gaps require joining against a generated calendar, not a bigger pipeline.</p>`,
    reset: SEED,
  },

  {
    title: 'Join Orders to Customers with $lookup in Both Forms',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['$lookup', 'localField and foreignField', 'lookup with let and pipeline', '$expr', '$unwind after lookup'],
    prerequisites: ['$match', '$project', '$unwind'],
    tags: ['aggregation', 'lookup', 'join', 'expr', 'mongodb'],
    problemHtml: `<p><code>$lookup</code> is MongoDB's left outer join. It runs against another collection in the same database and attaches the matching documents as an <strong>array field</strong> on each input document — always an array, even when exactly one document matches, and an empty array when none do. Two forms exist: the equality form with <code>localField</code>/<code>foreignField</code>, which is the fast path for a simple foreign-key match, and the pipeline form with <code>let</code> and an inner <code>pipeline</code>, which lets you add conditions, project, sort or limit the joined side.</p>
<p>The <code>customers</code> collection holds c1 to c5 with a <code>name</code> and <code>tier</code>. Write two pipelines:</p>
<ul>
<li>Equality form: match orders 1 and 2, <code>$lookup</code> from <code>customers</code> on <code>localField: "customerId"</code> and <code>foreignField: "_id"</code> into <code>as: "customer"</code>, <code>$unwind</code> that array to flatten the single match, then <code>$project</code> <code>total</code> plus <code>name</code> and <code>tier</code> lifted from <code>"$customer.name"</code> and <code>"$customer.tier"</code>, sorted by <code>_id</code>.</li>
<li>Pipeline form, starting from <code>customers</code>: for each customer, join their <code>bigOrders</code> — orders where <code>customerId</code> equals the outer <code>_id</code>, <code>total</code> is at least 150, and <code>status</code> is not cancelled. Bind the outer id with <code>let: { cid: "$_id" }</code>, compare it inside the inner <code>$match</code> using <code>$expr</code>, project only <code>total</code> on the joined side and sort it by <code>_id</code>. Then <code>$project</code> <code>name</code> and <code>bigOrders</code> and sort by <code>_id</code>.</li>
</ul>
<p>Watch what happens to the customer with no qualifying orders — the join keeps the row and gives it an empty array. The scaffold provides both skeletons.</p>`,
    inputSpec: DATASET,
    outputSpec: "The equality-form pipeline returns [ { _id: 1, total: 90, name: 'Ana Vu', tier: 'gold' }, { _id: 2, total: 150, name: 'Bao Le', tier: 'silver' } ]. The pipeline form returns five customers: c1 with orders 14 and 20, c2 with orders 2 and 17, c3 with order 8, c4 with an empty bigOrders array, and c5 with order 11.",
    constraints: 'Both collections live in the same database — $lookup cannot cross databases. Inside the pipeline form you must use $expr to compare a field against a let variable; a plain equality match on "$$cid" will not work. Do not simulate the join with two round trips.',
    examplesJson: [
      {
        input: 'db.orders.aggregate([{ $match: { _id: { $in: [1, 2] } } }, { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } }, { $unwind: "$customer" }, { $project: { total: 1, name: "$customer.name", tier: "$customer.tier" } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: 1, total: 90, name: 'Ana Vu', tier: 'gold' }, { _id: 2, total: 150, name: 'Bao Le', tier: 'silver' } ]",
        explanation: 'Each order matches exactly one customer, so the joined array has one element; $unwind flattens it and the projection lifts the two fields to the top level.',
      },
      {
        input: 'db.customers.aggregate([{ $lookup: { from: "orders", let: { cid: "$_id" }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$customerId", "$$cid"] }, { $gte: ["$total", 150] }, { $ne: ["$status", "cancelled"] }] } } }, { $project: { total: 1 } }, { $sort: { _id: 1 } }], as: "bigOrders" } }, { $project: { name: 1, bigOrders: 1 } }, { $sort: { _id: 1 } }])',
        output: "[ { _id: 'c1', name: 'Ana Vu', bigOrders: [ { _id: 14, total: 320 }, { _id: 20, total: 220 } ] }, { _id: 'c2', name: 'Bao Le', bigOrders: [ { _id: 2, total: 150 }, { _id: 17, total: 150 } ] }, { _id: 'c3', name: 'Chi Tran', bigOrders: [ { _id: 8, total: 160 } ] }, { _id: 'c4', name: 'Dat Pham', bigOrders: [] }, { _id: 'c5', name: 'En Ngo', bigOrders: [ { _id: 11, total: 170 } ] } ]",
        explanation: "Dat Pham's only order of 150 or more is the cancelled order 5, so the inner pipeline rejects it and the join returns an empty array rather than dropping the customer.",
      },
    ],
    hintsJson: [
      'A join here means attaching documents from another collection as an array field.',
      'The simple form needs four keys: from, localField, foreignField and as.',
      'When exactly one document can match, $unwind the joined array immediately so later stages see a plain sub-document.',
      'The pipeline form binds outer values with let: { cid: "$_id" } and reads them as "$$cid" inside an $expr comparison such as { $eq: ["$customerId", "$$cid"] }.',
    ],
    starter: `// Equality form: attach the customer to two orders
db.orders.aggregate([
  // TODO: $match _id in [1, 2]
  // TODO: $lookup from customers on customerId -> _id, as "customer"
  // TODO: $unwind "$customer"
  // TODO: $project total, name and tier
  // TODO: $sort by _id
])

// Pipeline form: each customer with their non-cancelled orders of 150 or more
db.customers.aggregate([
  // TODO: $lookup from orders with let: { cid: "$_id" } and an inner pipeline
  //       matching with $expr, projecting total and sorting by _id, as "bigOrders"
  // TODO: $project name and bigOrders
  // TODO: $sort by _id
])`,
    solution: `db.orders.aggregate([
  { $match: { _id: { $in: [1, 2] } } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { total: 1, name: "$customer.name", tier: "$customer.tier" } },
  { $sort: { _id: 1 } }
])

db.customers.aggregate([
  { $lookup: {
      from: "orders",
      let: { cid: "$_id" },
      pipeline: [
        { $match: { $expr: { $and: [
          { $eq: ["$customerId", "$$cid"] },
          { $gte: ["$total", 150] },
          { $ne: ["$status", "cancelled"] }
        ] } } },
        { $project: { total: 1 } },
        { $sort: { _id: 1 } }
      ],
      as: "bigOrders"
  } },
  { $project: { name: 1, bigOrders: 1 } },
  { $sort: { _id: 1 } }
])`,
    solutionExplanationHtml: `<p>The equality form is a foreign-key join and nothing more: for each incoming order, find every <code>customers</code> document whose <code>_id</code> equals this order's <code>customerId</code>, and put the results in <code>customer</code>. The result is always an array — that is the part people forget, and it is why <code>"$customer.name"</code> on the un-unwound array would give you <code>[ 'Ana Vu' ]</code> rather than a string. Since the relationship is many-to-one, <code>$unwind</code> immediately after the lookup flattens the one-element array into a sub-document and the projection can then lift fields out of it. If a match were ever missing, that <code>$unwind</code> would silently drop the order, so add <code>preserveNullAndEmptyArrays: true</code> whenever the foreign document is not guaranteed to exist.</p>
<p>The pipeline form exists because the equality form can only test equality. Here the join must also require <code>total</code> of at least 150 and a non-cancelled status, so the outer document's <code>_id</code> is bound to a variable with <code>let: { cid: "$_id" }</code> and read inside the inner pipeline as <code>"$$cid"</code>. The double dollar is significant: <code>$field</code> means "a field of the document currently being examined" (a document from <code>orders</code>, the joined collection) while <code>$$variable</code> means "a variable from the enclosing scope". Because the comparison mixes a field with a variable, it must live inside <code>$expr</code>, which lets aggregation expressions run in a query context; writing <code>{ customerId: "$$cid" }</code> without <code>$expr</code> would search for the literal string.</p>
<p>Note that <code>$lookup</code> is a left outer join in both forms: Dat Pham's only order of 150 or more is cancelled, so his <code>bigOrders</code> is <code>[]</code> and his row survives — you would filter those out yourself with a following <code>$match</code> on the array size if you wanted an inner join. Performance-wise, the join executes the inner lookup once per input document, so an index on the joined field (<code>orders.customerId</code> here) is what keeps it from degrading into a collection scan per row; that is why joining <em>after</em> a <code>$match</code> that shrinks the driving side, as the first pipeline does, is usually much faster than joining everything and filtering later. Also remember the joined collection must be in the same database and, before MongoDB 5.1, could not be sharded.</p>`,
    reset: SEED,
  },

  {
    title: 'Build a Multi-Branch Dashboard with $facet, $bucket and $count',
    difficulty: 'HARD',
    estimatedMinutes: 45,
    points: 25,
    concepts: ['$facet', '$bucket', 'boundaries and default', 'sub-pipelines', '$count'],
    prerequisites: ['$group', '$sort', '$match', 'accumulators'],
    tags: ['aggregation', 'facet', 'bucket', 'analytics', 'mongodb'],
    problemHtml: `<p>A dashboard usually needs several different summaries of the <em>same</em> documents: a histogram, a breakdown by status, and a headline total. Running three pipelines means reading the collection three times. <code>$facet</code> solves this by taking a set of named sub-pipelines, feeding each one the identical input stream, and emitting a single document whose fields are the sub-pipelines' results as arrays. <code>$bucket</code> complements it by producing a histogram: you supply sorted <code>boundaries</code> and it assigns each document to the bucket whose lower bound it falls in, half-open — a value equal to a boundary goes into the bucket that starts there.</p>
<p>Produce a one-document dashboard over all 20 orders in <code>orders</code>, with three facets:</p>
<ul>
<li><code>byTotalBucket</code>: a <code>$bucket</code> on <code>groupBy: "$total"</code> with <code>boundaries: [0, 50, 100, 200, 400]</code>, <code>default: "other"</code>, and an <code>output</code> of <code>count</code> as <code>{ $sum: 1 }</code> and <code>revenue</code> as <code>{ $sum: "$total" }</code>.</li>
<li><code>byStatus</code>: a <code>$group</code> on <code>"$status"</code> counting into <code>n</code>, sorted by <code>_id</code> ascending.</li>
<li><code>total</code>: a single <code>{ $count: "orders" }</code>.</li>
</ul>
<p>Two details to get right. The bucket <code>_id</code> in the output is the lower boundary of the bucket, not a range object, and every document must fall inside <code>boundaries</code> or into the <code>default</code> bucket — without a <code>default</code>, an out-of-range value aborts the pipeline. And because <code>$facet</code> results are arrays inside one document, each facet needs its own <code>$sort</code>; sorting outside the facet is meaningless. The scaffold provides the stage skeleton.</p>`,
    inputSpec: DATASET + ' All 20 orders are included, including the two cancelled ones. Totals range from 0 to 320.',
    outputSpec: "One document. byTotalBucket is [ { _id: 0, count: 4, revenue: 50 }, { _id: 50, count: 5, revenue: 320 }, { _id: 100, count: 8, revenue: 1090 }, { _id: 200, count: 3, revenue: 840 } ]; byStatus is [ { _id: 'cancelled', n: 2 }, { _id: 'delivered', n: 7 }, { _id: 'pending', n: 3 }, { _id: 'shipped', n: 8 } ]; total is [ { orders: 20 } ].",
    constraints: 'One aggregate call only — do not run three separate pipelines. boundaries must be sorted ascending and of a single type. Supply a default bucket. Sort inside each facet, never after $facet.',
    examplesJson: [
      {
        input: 'The byTotalBucket facet',
        output: '[ { _id: 0, count: 4, revenue: 50 }, { _id: 50, count: 5, revenue: 320 }, { _id: 100, count: 8, revenue: 1090 }, { _id: 200, count: 3, revenue: 840 } ]',
        explanation: 'Bucket 0 holds totals in [0, 50): the two zero-total orders plus 20 and 30, so revenue 50. Bucket 100 holds [100, 200) — eight orders summing to 1090. The counts add to 20 and the revenues to 2300, the collection total.',
      },
      {
        input: 'The byStatus and total facets',
        output: "byStatus: [ { _id: 'cancelled', n: 2 }, { _id: 'delivered', n: 7 }, { _id: 'pending', n: 3 }, { _id: 'shipped', n: 8 } ]; total: [ { orders: 20 } ]",
        explanation: 'Both facets see the same 20 input documents as the bucket facet. 2 + 7 + 3 + 8 = 20, which is the cross-check that the facets partition one stream.',
      },
      {
        input: 'db.orders.aggregate([{ $facet: { total: [{ $count: "orders" }] } }])',
        output: '[ { total: [ { orders: 20 } ] } ]',
        explanation: 'Even a single-document facet result is wrapped in an array, so reading it in application code means result[0].total[0].orders.',
      },
    ],
    hintsJson: [
      'Three summaries of one stream in one pass means one stage that fans the stream out.',
      '$facet takes an object of name -> sub-pipeline array; each sub-pipeline receives the identical input documents.',
      '$bucket needs groupBy, boundaries, default and output; boundaries are half-open so [0, 50) excludes 50.',
      'The bucket output _id is the lower boundary; put each facet’s $sort inside that facet, and remember every facet value comes back as an array.',
    ],
    starter: `db.orders.aggregate([
  { $facet: {
      // TODO: byTotalBucket — $bucket on "$total" with boundaries [0, 50, 100, 200, 400],
      //       default "other", output count and revenue
      // TODO: byStatus — $group on "$status" counting into n, then $sort by _id
      // TODO: total — $count into "orders"
  } }
])`,
    solution: `db.orders.aggregate([
  { $facet: {
      byTotalBucket: [
        { $bucket: {
            groupBy: "$total",
            boundaries: [0, 50, 100, 200, 400],
            default: "other",
            output: { count: { $sum: 1 }, revenue: { $sum: "$total" } }
        } }
      ],
      byStatus: [
        { $group: { _id: "$status", n: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ],
      total: [
        { $count: "orders" }
      ]
  } }
])`,
    solutionExplanationHtml: `<p><code>$facet</code> is a fan-out: the documents that reach it are handed, unchanged, to every named sub-pipeline, and the stage emits exactly one document whose fields are those sub-pipelines' outputs. Three summaries therefore cost one pass over the collection instead of three, and — more importantly for correctness — all three are guaranteed to describe the same snapshot of data. That is why the numbers reconcile: the bucket counts sum to 20, the status counts sum to 20, and the <code>total</code> facet reports 20.</p>
<p><code>$bucket</code> is a histogram with boundaries you choose. Each document is placed in the bucket whose range contains its <code>groupBy</code> value, and the ranges are <strong>half-open</strong>: <code>[0, 50)</code> includes 0 and excludes 50, so the order totalling exactly 50 lands in the <code>_id: 50</code> bucket rather than the <code>_id: 0</code> one. The bucket's <code>_id</code> in the output is its lower boundary — a naked number, not a range object — so a readable report usually adds an <code>$addFields</code> with a label. The <code>default</code> key is not optional in practice: any document whose value falls outside the outermost boundaries, or is of a different type, raises an error unless <code>default</code> catches it. Here no total exceeds 400, so the <code>"other"</code> bucket emits no document at all, which is itself a useful signal that the boundaries cover the data. When you do not know the distribution in advance, <code>$bucketAuto</code> picks boundaries for you to produce roughly equal-sized buckets.</p>
<p>Two practical traps. First, every facet value is an array even when it holds one document, so application code reads <code>result[0].total[0].orders</code> — nesting that surprises people who expected a scalar. Second, sorting must happen inside a facet; once <code>$facet</code> has emitted its single document there is nothing left to sort, so a <code>$sort</code> after it does nothing. Be aware too that each sub-pipeline's output is subject to the 16 MB document limit because everything lands in one document, which is why facets should end in aggregates or bounded <code>$limit</code> lists rather than dumping whole collections, and that <code>$facet</code> cannot contain <code>$out</code>, <code>$merge</code> or another <code>$facet</code>.</p>`,
    reset: SEED,
  },

  {
    title: 'Materialise a Product Sales Report with $unwind, $group and $merge',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 30,
    concepts: ['end-to-end pipeline', '$unwind with $group', '$merge', '$out', 'materialised views'],
    prerequisites: ['$match', '$unwind', '$group', '$addFields', '$sort'],
    tags: ['aggregation', 'merge', 'out', 'capstone', 'mongodb'],
    problemHtml: `<p>Expensive reports should not be recomputed on every page load. The aggregation framework can write its own output back into a collection, turning a pipeline into a materialised view that a plain <code>find</code> can serve in milliseconds. <code>$out</code> replaces a target collection wholesale; <code>$merge</code> upserts document by document on a key, so it can update an existing report incrementally and leave unrelated rows in place. Both must be the last stage of the pipeline.</p>
<p>Build a per-SKU sales report from the <code>orders</code> collection. The <code>sku_summary</code> collection has been pre-seeded with one stale row <code>{ _id: "XX", unitsSold: 0, revenue: 0, orderCount: 0 }</code> for a SKU that no longer sells:</p>
<ul>
<li><code>$match</code> out cancelled orders, then <code>$unwind</code> the <code>items</code> array so each line item is its own document.</li>
<li><code>$group</code> by <code>"$items.sku"</code>, computing <code>unitsSold</code> as <code>{ $sum: "$items.qty" }</code>, <code>revenue</code> as <code>{ $sum: { $multiply: ["$items.qty", "$items.price"] } }</code>, and <code>orderIds</code> as <code>{ $addToSet: "$_id" }</code>.</li>
<li><code>$addFields</code> an <code>orderCount</code> of <code>{ $size: "$orderIds" }</code>, then <code>$project</code> with <code>orderIds: 0</code> to drop the helper array.</li>
<li>End with <code>{ $merge: { into: "sku_summary", whenMatched: "replace", whenNotMatched: "insert" } }</code>, then read the report back with <code>db.sku_summary.find().sort({ revenue: -1 }).toArray()</code>.</li>
<li>Run the same pipeline again but ending in <code>{ $out: "sku_snapshot" }</code>, and read that collection back sorted the same way. Compare the two collections' document counts and explain the difference.</li>
</ul>
<p>Note that the <code>$group</code> key becomes the <code>_id</code> of every written document, which is what gives <code>$merge</code> something to match on. The scaffold provides the pipeline skeleton.</p>`,
    inputSpec: DATASET + ' The sku_summary collection already contains one stale document { _id: "XX", unitsSold: 0, revenue: 0, orderCount: 0 }. sku_snapshot does not exist yet.',
    outputSpec: "After the $merge, sku_summary holds 6 documents: the 5 computed rows MN (unitsSold 6, revenue 900, orderCount 5), KB (8, 400, 5), PD (8, 240, 4), CB (21, 210, 5), MS (10, 200, 6), plus the untouched stale row XX with revenue 0. After the $out, sku_snapshot holds exactly those 5 computed rows and no XX row.",
    constraints: '$merge and $out must be the final stage. Group on "$items.sku" so the SKU becomes the written _id. Do not write the report with a client-side loop of insert calls. Read the results back with find().sort(), since neither $out nor $merge returns documents.',
    examplesJson: [
      {
        input: 'db.sku_summary.find().sort({ revenue: -1 }).toArray()  (after the $merge)',
        output: "[ { _id: 'MN', unitsSold: 6, revenue: 900, orderCount: 5 }, { _id: 'KB', unitsSold: 8, revenue: 400, orderCount: 5 }, { _id: 'PD', unitsSold: 8, revenue: 240, orderCount: 4 }, { _id: 'CB', unitsSold: 21, revenue: 210, orderCount: 5 }, { _id: 'MS', unitsSold: 10, revenue: 200, orderCount: 6 }, { _id: 'XX', unitsSold: 0, revenue: 0, orderCount: 0 } ]",
        explanation: 'Five SKUs were upserted by _id and the pre-existing XX row survived, because $merge only touches documents whose _id the pipeline produced. Revenues sum to 1950, the value of all non-cancelled orders.',
      },
      {
        input: 'db.sku_snapshot.find().sort({ revenue: -1 }).toArray()  (after the same pipeline ending in $out)',
        output: "[ { _id: 'MN', unitsSold: 6, revenue: 900, orderCount: 5 }, { _id: 'KB', unitsSold: 8, revenue: 400, orderCount: 5 }, { _id: 'PD', unitsSold: 8, revenue: 240, orderCount: 4 }, { _id: 'CB', unitsSold: 21, revenue: 210, orderCount: 5 }, { _id: 'MS', unitsSold: 10, revenue: 200, orderCount: 6 } ]",
        explanation: '$out replaced the whole target collection, so only the 5 computed rows exist — no stale XX row. That is the difference between replace-everything and upsert-by-key.',
      },
      {
        input: 'The CB row, traced by hand',
        output: "{ _id: 'CB', unitsSold: 21, revenue: 210, orderCount: 5 }",
        explanation: 'CB appears in orders 4 (qty 3), 8 (1), 9 (5), 14 (2) and 19 (10) — 21 units at 10 each is 210, across 5 distinct orders. Cancelled order 13 contributes nothing because $match removed it before the $unwind.',
      },
    ],
    hintsJson: [
      'Per-SKU numbers need the line items as separate documents first, then a regrouping on the SKU.',
      'After $unwind, each document has one element at "$items", so group with _id: "$items.sku" and sum "$items.qty".',
      'Line revenue is qty times price: { $sum: { $multiply: ["$items.qty", "$items.price"] } }. Count distinct orders with $addToSet then $size.',
      '{ $merge: { into: "sku_summary", whenMatched: "replace", whenNotMatched: "insert" } } must be last; $out: "sku_snapshot" replaces its target entirely.',
    ],
    starter: `// Per-SKU sales report, upserted into sku_summary
db.orders.aggregate([
  // TODO: $match out cancelled orders
  // TODO: $unwind the items array
  // TODO: $group by "$items.sku" with unitsSold, revenue and orderIds
  // TODO: $addFields orderCount from the size of orderIds
  // TODO: $project away orderIds
  // TODO: $merge into sku_summary, whenMatched replace, whenNotMatched insert
])
db.sku_summary.find().sort({ revenue: -1 }).toArray()

// The same report, written with $out instead
db.orders.aggregate([
  // TODO: the same stages, ending in $out: "sku_snapshot"
])
db.sku_snapshot.find().sort({ revenue: -1 }).toArray()`,
    solution: `db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.sku",
      unitsSold: { $sum: "$items.qty" },
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      orderIds: { $addToSet: "$_id" }
  } },
  { $addFields: { orderCount: { $size: "$orderIds" } } },
  { $project: { orderIds: 0 } },
  { $merge: { into: "sku_summary", whenMatched: "replace", whenNotMatched: "insert" } }
])
db.sku_summary.find().sort({ revenue: -1 }).toArray()

db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.sku",
      unitsSold: { $sum: "$items.qty" },
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      orderIds: { $addToSet: "$_id" }
  } },
  { $addFields: { orderCount: { $size: "$orderIds" } } },
  { $project: { orderIds: 0 } },
  { $out: "sku_snapshot" }
])
db.sku_snapshot.find().sort({ revenue: -1 }).toArray()`,
    solutionExplanationHtml: `<p>This is the whole module in one pipeline. <code>$match</code> comes first so the two cancelled orders never reach the expensive stages — filtering after the <code>$unwind</code> would produce the same answer but multiply documents that are about to be thrown away. <code>$unwind</code> then converts 18 order documents into 25 line-item documents, each carrying the parent order's <code>_id</code> alongside a single <code>items</code> sub-document. That duplication is what makes the regrouping possible: <code>$group</code> on <code>"$items.sku"</code> re-partitions the stream by product instead of by order, and <code>{ $multiply: ["$items.qty", "$items.price"] }</code> computes each line's revenue before <code>$sum</code> folds it in. The totals reconcile exactly — 900 + 400 + 240 + 210 + 200 = 1950, the sum of all non-cancelled order totals.</p>
<p>Counting distinct orders per SKU needs care after an unwind, because <code>{ $sum: 1 }</code> would count line items, not orders. Collecting <code>{ $addToSet: "$_id" }</code> and taking its <code>$size</code> gives the distinct-order count instead: MS appears on 6 different orders while CB, despite selling 21 units, appears on only 5. The helper array is then dropped with <code>{ $project: { orderIds: 0 } }</code> — an exclusion projection, the one case where you name what to remove rather than what to keep.</p>
<p>The two write stages differ in exactly the way the results show. <code>$out</code> is replace-the-collection: it writes to a temporary collection and atomically swaps it in, so <code>sku_snapshot</code> ends up holding precisely the five computed documents and nothing else, and any index or stale row that was there before is gone. <code>$merge</code> is upsert-by-key: for each output document it looks for a target document matching <code>_id</code> (the default <code>on</code> field, which is why grouping by SKU matters) and applies <code>whenMatched</code>, inserting when nothing matches. The stale <code>XX</code> row therefore survives untouched — <code>$merge</code> never deletes. That property is what makes it the tool for incremental rollups: re-run the pipeline over just the last hour's orders with <code>whenMatched: "merge"</code> and you update only the affected SKUs instead of rebuilding the whole report. It also means a shrinking dataset can leave phantom rows behind, so a periodic full rebuild with <code>$out</code>, or an explicit cleanup, is part of the design. Both stages must be last, neither returns documents to the caller, and <code>$out</code> cannot target the collection being read while <code>$merge</code> can.</p>`,
    diagramMermaid: `flowchart TD
  A[orders 20 docs] --> B[match not cancelled]
  B --> C[18 docs]
  C --> D[unwind items]
  D --> E[25 line item docs]
  E --> F[group by sku sum qty and revenue]
  F --> G[5 sku docs]
  G --> H[addFields orderCount then project away helper]
  H --> I[merge into sku summary upsert by id]
  H --> J[out to sku snapshot replaces collection]`,
    reset: SEED + `
db.sku_summary.drop(); db.sku_summary.insertOne({ _id: "XX", unitsSold: 0, revenue: 0, orderCount: 0 });
db.sku_snapshot.drop();`,
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
  starterCodeJson: [{ name: 'pipeline.js', language: L, code: ex.starter }],
  solutionCodeJson: [{ name: 'pipeline.js', language: L, code: ex.solution }],
  solutionExplanationHtml: ex.solutionExplanationHtml,
  ...(ex.diagramMermaid ? { diagramMermaid: ex.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let js = '';
exercises.forEach((ex, i) => {
  js += `print("========== EX ${i + 1}: ${ex.title.replace(/"/g, '')} ==========")\n`;
  js += (ex.reset || '') + '\n';
  js += ex.solution + '\n';
});
fs.writeFileSync(path.join(VERIFY, `mongodb-417.js`), js);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  if (ex.examplesJson.length < 2) throw new Error(`<2 examples ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 205) throw new Error(`solution<205 ${ex.title} (${solLen})`);
  if (/TODO|\.\.\./.test(ex.solutionCodeJson.map((f) => f.code).join(''))) throw new Error(`incomplete solution ${ex.title}`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
