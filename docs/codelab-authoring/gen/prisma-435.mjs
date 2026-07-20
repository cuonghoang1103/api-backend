// prisma-orm module 435 (aggregations-grouping-and-raw-queries) — 10 client exercises.
// Verified by tsx + tsc --strict against a real Postgres + Prisma client.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'prisma-orm';
const moduleSlug = 'aggregations-grouping-and-raw-queries';
const HEADER = `generator client {
  provider = "prisma-client-js"
  output   = "./generated"
}

datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:x@localhost:55432/prisma_codelab"
}
`;
const REFERENCE = `${HEADER}
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String   @unique
  published Boolean  @default(false)
  views     Int      @default(0)
  rating    Float?
  createdAt DateTime
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
`;
const imp = `import { PrismaClient, Prisma } from './generated';\nconst prisma = new PrismaClient();\n`;
const wrap = (body) => `${imp}\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;
const wrapPre = (pre, body) => `${imp}\n${pre}\n\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;

const WIPE = `await prisma.post.deleteMany(); await prisma.user.deleteMany();`;

// Reference dataset: 3 authors, 8 posts. Two posts have a null rating, and Cy
// has exactly one unpublished post — both facts are load-bearing in the tasks.
const SEED = `${WIPE}
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann" } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob" } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
await prisma.post.createMany({ data: [
  { title: "Intro to SQL",    published: true,  views: 100, rating: 4.0,  createdAt: new Date("2026-01-10T00:00:00Z"), authorId: ann.id },
  { title: "Prisma Basics",   published: true,  views: 250, rating: 5.0,  createdAt: new Date("2026-01-20T00:00:00Z"), authorId: ann.id },
  { title: "Draft on Prisma", published: false, views: 0,   rating: null, createdAt: new Date("2026-02-05T00:00:00Z"), authorId: ann.id },
  { title: "Indexing Tips",   published: true,  views: 130, rating: 3.0,  createdAt: new Date("2026-02-14T00:00:00Z"), authorId: ann.id },
  { title: "Redis Notes",     published: true,  views: 80,  rating: 4.0,  createdAt: new Date("2026-01-25T00:00:00Z"), authorId: bob.id },
  { title: "React Hooks",     published: true,  views: 150, rating: 2.0,  createdAt: new Date("2026-02-02T00:00:00Z"), authorId: bob.id },
  { title: "CSS Grid",        published: true,  views: 70,  rating: null, createdAt: new Date("2026-02-20T00:00:00Z"), authorId: bob.id },
  { title: "Cy Draft",        published: false, views: 20,  rating: 1.0,  createdAt: new Date("2026-02-25T00:00:00Z"), authorId: cy.id },
]});`;

const ex = [
  {
    title: 'Summarise a Table with aggregate: count, sum, avg, min, and max',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['aggregate operation', '_count and _sum', '_avg _min _max', 'filtering before aggregating', 'work stays in the database'],
    prerequisites: ['findMany', 'where filters'],
    tags: ['prisma', 'aggregate', 'sum', 'avg', 'query'],
    problemHtml: `<p>Totals do not require rows. <code>aggregate</code> asks the database for the summary and transfers only the numbers, so a table with a million posts costs the same as one with ten. The operation takes the aggregate keys you want — <code>_count</code>, <code>_sum</code>, <code>_avg</code>, <code>_min</code>, <code>_max</code> — each listing the fields it applies to, and an optional <code>where</code> that narrows the rows <strong>before</strong> the aggregation runs.</p>
<p>Against the reference dataset (eight posts, six of them published):</p>
<ul>
<li>Aggregate over <strong>published</strong> posts only, asking for <code>_count</code> of all rows, <code>_sum</code> of <code>views</code>, <code>_avg</code> of <code>views</code>, and <code>_min</code>/<code>_max</code> of <code>views</code>.</li>
<li>Log <code>count N</code>, <code>sum N</code>, <code>avg X</code> (fixed to two decimals), <code>min N</code> and <code>max N</code>, one per line.</li>
<li>Then aggregate over <strong>all</strong> posts without a filter and log <code>allSum N</code> to show how much the filter changed.</li>
</ul>
<p>Do not fetch the posts and reduce them in JavaScript — every number must come from the database. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: eight posts, six published with views 100, 250, 130, 80, 150 and 70; the two unpublished ones have 0 and 20 views.',
    outputSpec: 'Six published posts totalling 780 views, averaging 130, ranging from 70 to 250 — and 800 views across all eight posts.',
    constraints: 'One aggregate call per report. No findMany, no reduce, no manual arithmetic beyond formatting the average.',
    examplesJson: [
      { input: 'aggregate({ where: { published: true }, _sum: { views: true }, _avg: { views: true } })', output: 'sum 780, avg 130.00', explanation: '100 + 250 + 130 + 80 + 150 + 70 = 780 across six posts, so the mean is exactly 130.' },
      { input: '_min and _max of views on the same call', output: 'min 70, max 250', explanation: 'CSS Grid is the lowest published post at 70 and Prisma Basics the highest at 250.' },
      { input: 'aggregate({ _sum: { views: true } }) with no where', output: 'allSum 800', explanation: 'Dropping the filter adds the two drafts, worth 0 and 20 views.' },
    ],
    hintsJson: [
      'Each aggregate key is an object naming the fields, as in _sum: { views: true }.',
      '_count: true counts rows; _count: { field: true } counts non-null values of that field.',
      'The where filters rows before aggregation, exactly like SQL WHERE.',
      'The average is a float — format it with toFixed(2) so the output is stable.',
    ],
    solution: wrap(`  const stats = await prisma.post.aggregate({
    where: { published: true },
    _count: true,
    _sum: { views: true },
    _avg: { views: true },
    _min: { views: true },
    _max: { views: true },
  });
  console.log("count", stats._count);
  console.log("sum", stats._sum.views);
  console.log("avg", (stats._avg.views ?? 0).toFixed(2));
  console.log("min", stats._min.views);
  console.log("max", stats._max.views);
  const all = await prisma.post.aggregate({ _sum: { views: true } });
  console.log("allSum", all._sum.views);`),
    solutionExplanationHtml: `<p>Every number here is computed by Postgres and arrives as a single row, which is the entire point: the alternative — <code>findMany</code> followed by <code>reduce</code> — transfers every post to compute five integers, and its cost grows with the table while <code>aggregate</code>'s does not. It is also the difference between a query the database can answer from an index and one that must read every row into your process memory.</p>
<p>The shape of the response mirrors the request. Because the call asked for <code>_sum: { views: true }</code>, the result is <code>stats._sum.views</code> — an object per aggregate key, not a flat number — and TypeScript knows only the fields you asked for exist. Note the two forms of <code>_count</code>: <code>_count: true</code> returns a plain row count, while <code>_count: { rating: true }</code> would count rows where <code>rating</code> is <strong>not null</strong>, which is SQL's <code>COUNT(column)</code> semantics and a distinction exercise 3 depends on.</p>
<p>The nullability is the trap. <code>_avg.views</code> is typed <code>number | null</code> because an aggregate over zero matching rows has no average to report — <code>null</code>, not <code>0</code>. Here rows exist so the coalesce never fires, but writing it is what keeps the code correct the day the filter matches nothing. Finally, <code>where</code> runs before the aggregation, so the published-only sum of 780 and the unfiltered 800 differ by exactly the two drafts; filtering after the fact would have required fetching them.</p>`,
    seed: SEED,
    expect: `count 6\nsum 780\navg 130.00\nmin 70\nmax 250\nallSum 800`,
  },
  {
    title: 'Count Rows, Non-Null Values, and Distinct Combinations',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['count row vs column', 'null handling in COUNT', 'count with select', 'distinct counting', 'filtered counts'],
    prerequisites: ['count', 'aggregate'],
    tags: ['prisma', 'count', 'null', 'distinct', 'aggregate'],
    problemHtml: `<p>"How many?" has more than one answer, and picking the wrong one is a classic reporting bug. <code>COUNT(*)</code> counts rows; <code>COUNT(column)</code> counts rows where that column is <strong>not null</strong>. Prisma exposes both: <code>count()</code> with no arguments and <code>count({ select: { _all: true, field: true } })</code>, which returns each variant as a separate key in one round trip.</p>
<p>Against the reference dataset, where two of the eight posts have a <code>null</code> rating:</p>
<ul>
<li>Log <code>rows N</code> — the total post count.</li>
<li>With a single <code>count({ select: { _all: true, rating: true } })</code>, log <code>all N</code> and <code>rated N</code>, then <code>unrated N</code> computed as their difference.</li>
<li>Log <code>published N</code> — the count of published posts, using a <code>where</code>.</li>
<li>Log <code>authors N</code> — the number of <em>distinct</em> authors who have at least one post. Use <code>groupBy</code> on <code>authorId</code> and take the length of the result, since <code>count</code> has no distinct option.</li>
<li>Log <code>nullRating N</code> — the count of posts whose <code>rating</code> <code>is null</code>, filtered in the database with <code>rating: null</code>.</li>
</ul>
<p>The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: 8 posts by 3 authors; "Draft on Prisma" and "CSS Grid" have a null rating; 6 posts are published.',
    outputSpec: 'Eight rows in total, six of them rated and two unrated, six published, three distinct authors, and two posts with a null rating.',
    constraints: 'Use the select form of count for the all-versus-rated comparison. Do not fetch rows to count them, and do not compute distinct authors in JavaScript from a findMany.',
    examplesJson: [
      { input: 'count({ select: { _all: true, rating: true } })', output: 'all 8, rated 6', explanation: '_all is COUNT(*) while rating is COUNT(rating), which skips the two nulls.' },
      { input: 'count({ where: { rating: null } })', output: 'nullRating 2', explanation: 'Filtering on null is done with rating: null, which compiles to IS NULL.' },
      { input: 'groupBy({ by: ["authorId"] }).length', output: 'authors 3', explanation: 'Grouping collapses the posts to one row per author, so the length is the distinct author count.' },
    ],
    hintsJson: [
      'count() with no argument is COUNT(*); count({ select: { field: true } }) is COUNT(field).',
      'A null column value is never counted by COUNT(column) — that is the whole difference.',
      'Filter for nulls with field: null, not with a JavaScript check after the fact.',
      'There is no countDistinct — group by the field and read the result length.',
    ],
    solution: wrap(`  console.log("rows", await prisma.post.count());
  const c = await prisma.post.count({ select: { _all: true, rating: true } });
  console.log("all", c._all);
  console.log("rated", c.rating);
  console.log("unrated", c._all - c.rating);
  console.log("published", await prisma.post.count({ where: { published: true } }));
  const authors = await prisma.post.groupBy({ by: ["authorId"] });
  console.log("authors", authors.length);
  console.log("nullRating", await prisma.post.count({ where: { rating: null } }));`),
    solutionExplanationHtml: `<p>The gap between <code>_all</code> and <code>rating</code> is SQL's, not Prisma's: <code>COUNT(*)</code> counts rows while <code>COUNT(rating)</code> counts non-null values of that column. Eight and six here, and the difference is exactly the two posts with no rating. This is why "average rating" reports so often disagree with "number of posts" — the average also ignores nulls, so its denominator is 6, and dividing a sum by the row count instead would silently understate it.</p>
<p>The <code>select</code> form of <code>count</code> is what lets both numbers come back from one query, keyed by what you asked for. It is also the only way to get <code>COUNT(column)</code> from the client; <code>count({ where: { rating: { not: null } } })</code> reaches the same answer by a different route, and either is fine as long as you know which one you wrote.</p>
<p>Distinct counting is a genuine gap in the client: there is no <code>countDistinct</code>. Grouping by the field and reading <code>result.length</code> is the idiomatic workaround, and it stays honest because the grouping happens in the database — only one small row per author crosses the wire. For a table with millions of distinct values that array would itself get large, and the escape hatch is a raw <code>SELECT COUNT(DISTINCT "authorId")</code>, which exercises 7 and 8 explore. Note finally that <code>rating: null</code> compiles to <code>IS NULL</code> rather than <code>= NULL</code>, which in SQL would match nothing at all.</p>`,
    seed: SEED,
    expect: `rows 8\nall 8\nrated 6\nunrated 2\npublished 6\nauthors 3\nnullRating 2`,
  },
  {
    title: 'Group Rows per Author with groupBy and Aggregates',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['groupBy operation', 'by clause', 'aggregates per group', 'ordering groups', 'group keys are the only scalars'],
    prerequisites: ['aggregate', 'orderBy'],
    tags: ['prisma', 'groupby', 'aggregate', 'report', 'query'],
    problemHtml: `<p><code>aggregate</code> collapses a table to one row; <code>groupBy</code> collapses it to one row <em>per group</em>. The <code>by</code> array names the grouping columns, and the same aggregate keys as before compute per group. The rule that surprises people: the result contains only the <code>by</code> columns and the aggregates — nothing else. There is no <code>title</code> on a row grouped by <code>authorId</code>, because a group of four posts has four different titles.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Group posts <code>by: ["authorId"]</code> with <code>_count: true</code>, <code>_sum: { views: true }</code> and <code>_max: { views: true }</code>, ordered by <code>authorId</code> ascending.</li>
<li>Log <code>authorId posts sumViews maxViews</code> per group.</li>
<li>Group again <code>by: ["published"]</code> with <code>_count</code> and <code>_avg: { views: true }</code>, ordered by <code>published</code> ascending, and log <code>published N avg X</code> with the average fixed to two decimals.</li>
<li>Order the groups by an <strong>aggregate</strong> rather than a key: repeat the author grouping ordered by <code>_sum: { views: "desc" }</code> and log <code>top</code> followed by the first group's <code>authorId</code> and its summed views.</li>
</ul>
<p>Author ids come from a sequence — print them as returned, and read them relative to each other rather than assuming they start at 1.</p>`,
    inputSpec: 'The reference dataset: Ann has 4 posts (100+250+0+130 views), Bob 3 (80+150+70), Cy 1 (20). Six posts are published and two are not.',
    outputSpec: 'Three author groups in id order with 4, 3 and 1 posts and view sums of 480, 300 and 20 — then two published groups, false averaging 10 and true averaging 130 — and finally the author with the largest sum.',
    constraints: 'Every number must come from groupBy. Do not fetch posts and group them in JavaScript, and do not try to select a non-grouped scalar such as title.',
    examplesJson: [
      { input: 'groupBy({ by: ["authorId"], _count: true, _sum: { views: true } })', output: 'first group: 4 posts, 480 views', explanation: 'Ann’s four posts sum to 100 + 250 + 0 + 130 = 480.' },
      { input: 'groupBy({ by: ["published"], _avg: { views: true } })', output: 'false 2 avg 10.00 then true 6 avg 130.00', explanation: 'The two drafts average (0 + 20) / 2 = 10; the six published posts average 130.' },
      { input: 'orderBy: { _sum: { views: "desc" } }', output: 'top is the author with 480', explanation: 'Groups can be ordered by an aggregate, not just by a grouping key.' },
    ],
    hintsJson: [
      'by takes an array of column names, even when there is only one.',
      'The result rows carry the by columns plus the aggregate objects, and nothing else.',
      '_count: true counts rows in each group.',
      'orderBy accepts the same aggregate shape, as in { _sum: { views: "desc" } }.',
    ],
    solution: wrap(`  const byAuthor = await prisma.post.groupBy({
    by: ["authorId"],
    _count: true,
    _sum: { views: true },
    _max: { views: true },
    orderBy: { authorId: "asc" },
  });
  for (const g of byAuthor) console.log(g.authorId, g._count, g._sum.views, g._max.views);

  const byStatus = await prisma.post.groupBy({
    by: ["published"],
    _count: true,
    _avg: { views: true },
    orderBy: { published: "asc" },
  });
  for (const g of byStatus) console.log(g.published, g._count, "avg", (g._avg.views ?? 0).toFixed(2));

  const ranked = await prisma.post.groupBy({
    by: ["authorId"],
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
  });
  console.log("top", ranked[0].authorId, ranked[0]._sum.views);`),
    solutionExplanationHtml: `<p><code>groupBy</code> compiles to SQL's <code>GROUP BY</code>, and its central rule follows directly: a result row can only contain the grouping columns and aggregates computed over the group. Asking for <code>title</code> alongside <code>by: ["authorId"]</code> is rejected at compile time, because four posts in a group have four titles and the query has no way to choose. That constraint is what makes the operation cheap — the database emits one row per group and never materialises the members.</p>
<p>Reading the shape of a result row takes a moment of care: <code>g.authorId</code> is a grouping key so it is a plain value, while <code>g._sum.views</code> is nested under the aggregate that produced it. Grouping by a boolean shows the same idea with two groups, and the averages make the drafts visible — <code>(0 + 20) / 2 = 10</code> against 130 for the published posts, a spread that would have been invisible in a single overall average of 100.</p>
<p>Ordering by an aggregate is the feature that turns grouping into ranking: <code>orderBy: { _sum: { views: "desc" } }</code> sorts the groups by their computed totals, which is how leaderboards and top-N reports are written. The obvious missing piece is the author's <em>name</em> — the grouped row has only the id, since <code>groupBy</code> cannot join. Exercise 9 covers the two standard ways to fill that gap, and exercise 4 adds <code>having</code>, the filter that applies after the aggregation rather than before it.</p>`,
    diagramMermaid: `flowchart TD
  A[8 post rows] --> B[GROUP BY authorId]
  B --> C[group Ann 4 rows]
  B --> D[group Bob 3 rows]
  B --> E[group Cy 1 row]
  C --> F[row with authorId count sum max only]
  D --> F
  E --> F`,
    seed: SEED,
    expect: null, // ids come from a sequence — verified by shape, see verify note
    dynamic: `  const byAuthor = await prisma.post.groupBy({ by: ["authorId"], _count: true, _sum: { views: true }, _max: { views: true }, orderBy: { authorId: "asc" } });
  console.log(byAuthor.map((g) => \`\${g._count} \${g._sum.views} \${g._max.views}\`).join(" | "));
  const byStatus = await prisma.post.groupBy({ by: ["published"], _count: true, _avg: { views: true }, orderBy: { published: "asc" } });
  console.log(byStatus.map((g) => \`\${g.published} \${g._count} \${(g._avg.views ?? 0).toFixed(2)}\`).join(" | "));
  const ranked = await prisma.post.groupBy({ by: ["authorId"], _sum: { views: true }, orderBy: { _sum: { views: "desc" } } });
  console.log("top", ranked[0]._sum.views);`,
    dynamicExpect: `4 480 250 | 3 300 150 | 1 20 20\nfalse 2 10.00 | true 6 130.00\ntop 480`,
  },
  {
    title: 'Filter Groups with having, and Know Why It Is Not where',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['having clause', 'where before vs having after', 'aggregate predicates', 'combining both filters', 'result differences'],
    prerequisites: ['groupBy', 'aggregate', 'where filters'],
    tags: ['prisma', 'groupby', 'having', 'filter', 'report'],
    problemHtml: `<p><code>where</code> and <code>having</code> filter at different moments, and swapping them changes the answer rather than causing an error. <code>where</code> removes <strong>rows before grouping</strong>, so it changes what each group contains. <code>having</code> removes <strong>groups after aggregating</strong>, so it can test the aggregates themselves — something <code>where</code> can never do, because at that point no aggregate exists yet.</p>
<p>Against the reference dataset, produce three reports, each ordered by <code>authorId</code> ascending and printed as <code>count sumViews</code> per group joined by <code>&nbsp;|&nbsp;</code>:</p>
<ul>
<li><code>a:</code> group all posts by <code>authorId</code> with <code>_count</code> and <code>_sum: { views: true }</code>, no filtering.</li>
<li><code>b:</code> the same grouping with <code>where: { published: true }</code> — the drafts never reach a group, so both the counts and the sums change.</li>
<li><code>c:</code> the same grouping as <code>a</code> but with <code>having: { views: { _sum: { gt: 100 } } }</code> — every post still counts, and only whole groups are dropped.</li>
</ul>
<p>Then combine both on one query: published posts only, keeping groups with more than one post (<code>having: { authorId: { _count: { gt: 1 } } }</code>), and log <code>d:</code> in the same format. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: Ann 4 posts / 480 views (one draft worth 0), Bob 3 / 300, Cy 1 draft / 20.',
    outputSpec: 'Report a keeps all three authors; b drops Cy entirely because her only post is a draft and shrinks Ann to three posts; c drops Cy because her group sums to 20; d keeps only the two authors with more than one published post.',
    constraints: 'Use having for the aggregate predicates and where for the row predicate. Do not filter the returned groups in JavaScript.',
    examplesJson: [
      { input: 'groupBy by authorId with no filter', output: 'a: 4 480 | 3 300 | 1 20', explanation: 'Every post lands in a group, drafts included.' },
      { input: 'the same with where: { published: true }', output: 'b: 3 480 | 3 300', explanation: 'Ann’s draft is removed before grouping so her count drops to 3 while her sum stays 480 — that draft had 0 views. Cy’s only post is a draft, so her group disappears entirely.' },
      { input: 'the same with having: { views: { _sum: { gt: 100 } } }', output: 'c: 4 480 | 3 300', explanation: 'Cy’s group is formed and then rejected because 20 is not above 100; Ann keeps all four posts.' },
    ],
    hintsJson: [
      'having is keyed by field, then by the aggregate, then by the comparison: { views: { _sum: { gt: 100 } } }.',
      'A group can only vanish through having — its member rows are still counted.',
      'where changes what is inside each group; having only decides which groups survive.',
      'Both can appear on the same groupBy, and where is applied first.',
    ],
    solution: wrapPre(`function render(groups: { _count: number; _sum: { views: number | null } }[]): string {
  return groups.map((g) => \`\${g._count} \${g._sum.views}\`).join(" | ");
}`, `  const a = await prisma.post.groupBy({
    by: ["authorId"], _count: true, _sum: { views: true }, orderBy: { authorId: "asc" },
  });
  console.log("a:", render(a));

  const b = await prisma.post.groupBy({
    by: ["authorId"], where: { published: true }, _count: true, _sum: { views: true }, orderBy: { authorId: "asc" },
  });
  console.log("b:", render(b));

  const c = await prisma.post.groupBy({
    by: ["authorId"], _count: true, _sum: { views: true },
    having: { views: { _sum: { gt: 100 } } }, orderBy: { authorId: "asc" },
  });
  console.log("c:", render(c));

  const d = await prisma.post.groupBy({
    by: ["authorId"], where: { published: true }, _count: true, _sum: { views: true },
    having: { authorId: { _count: { gt: 1 } } }, orderBy: { authorId: "asc" },
  });
  console.log("d:", render(d));`),
    solutionExplanationHtml: `<p>The pipeline is <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code>, and each report shows one step of it. In <code>b</code> the draft is discarded before grouping, so Ann's count falls from four to three while her sum stays 480 — that draft was worth zero views — and Cy vanishes completely, because a group with no surviving rows is never formed. In <code>c</code> nothing is discarded up front: Cy's group <em>is</em> built, its sum of 20 is compared against 100, and only then is the whole group dropped. Same author missing from both reports, two entirely different reasons.</p>
<p>That difference is what makes the swap dangerous. "Authors with more than 100 views" and "authors with more than 100 views among their published posts" are different questions, and only <code>having</code> can express a condition about an aggregate at all — a <code>where</code> testing a sum is impossible, since sums do not exist until after grouping.</p>
<p>Prisma's <code>having</code> syntax reads inside out: field, then aggregate, then comparison, as in <code>{ views: { _sum: { gt: 100 } } }</code>. Counting a group uses any grouped column — <code>{ authorId: { _count: { gt: 1 } } }</code> — which is how report <code>d</code> keeps only authors with more than one published post. Note that a plain scalar predicate is also legal inside <code>having</code> for a grouping key, but for anything else the aggregate wrapper is required, because a non-grouped column has no single value to compare. Performance-wise, filtering rows early with <code>where</code> is cheaper than building groups and throwing them away, so use <code>having</code> only for what genuinely depends on the aggregate.</p>`,
    diagramMermaid: `flowchart LR
  A[all post rows] --> B[where removes rows first]
  B --> C[GROUP BY authorId]
  C --> D[aggregates computed per group]
  D --> E[having removes whole groups]
  E --> F[orderBy then results]`,
    seed: SEED,
    expect: `a: 4 480 | 3 300 | 1 20\nb: 3 480 | 3 300\nc: 4 480 | 3 300\nd: 3 480 | 3 300`,
  },
  {
    title: 'Group by Several Columns and Handle Nulls in Averages',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['multi-column grouping', 'null excluded from AVG', 'count column vs count all', 'group cardinality', 'deterministic ordering'],
    prerequisites: ['groupBy', 'count semantics'],
    tags: ['prisma', 'groupby', 'null', 'avg', 'report'],
    problemHtml: `<p>Adding a column to <code>by</code> multiplies the groups: grouping posts by author <em>and</em> published status produces one row per combination that actually occurs — never a row for a combination with no posts. Averages add a second subtlety, because SQL's <code>AVG</code> ignores <code>null</code>s entirely: its denominator is the number of non-null values, not the number of rows in the group.</p>
<p>Against the reference dataset, where two posts have a <code>null</code> rating:</p>
<ul>
<li>Group posts <code>by: ["authorId", "published"]</code> with <code>_count: { _all: true, rating: true }</code> and <code>_avg: { rating: true }</code>, ordered by <code>authorId</code> ascending then <code>published</code> ascending.</li>
<li>Log one line per group: <code>published rows rated avgRating</code>, where <code>avgRating</code> is fixed to two decimals or <code>-</code> when it is <code>null</code>. Do not print the author id, which comes from a sequence.</li>
<li>Log <code>groups N</code> — the number of groups returned — and work out why it is not <code>authors × 2</code>. Remember that <code>false</code> sorts before <code>true</code>.</li>
<li>Log <code>naive X</code>: the average rating over <strong>all</strong> posts computed as <code>_sum.rating / _count._all</code>, and <code>correct X</code>: the same data through <code>_avg.rating</code>. The two differ, and that difference is the lesson.</li>
</ul>
<p>The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: Ann has 3 published (ratings 4, 5, 3) and 1 draft (rating null); Bob has 3 published (4, 2 and null); Cy has 1 draft (rating 1).',
    outputSpec: 'Four groups, not six: Bob has no drafts and Cy has no published posts, so those two combinations never occur. Ann’s draft group sorts first and shows one row with zero rated and a dash for the average. Dividing the rating sum by the row count gives 2.38 while the true average of the six rated posts is 3.17.',
    constraints: 'One groupBy for the report. Use the _count object form to get both counts. Do not filter out the null ratings before aggregating.',
    examplesJson: [
      { input: 'group Ann + published = true', output: 'true 3 3 4.00', explanation: 'Three published posts, all rated, averaging (4 + 5 + 3) / 3 = 4.' },
      { input: 'group Ann + published = false, which sorts first because false < true', output: 'false 1 0 -', explanation: 'One draft with a null rating: the row is counted, the rating is not, and AVG over no values is null.' },
      { input: 'sum(rating) / count(*) versus _avg.rating', output: 'naive 2.38 correct 3.17', explanation: '19 / 8 assumes eight ratings; AVG divides by the six that exist, giving 19 / 6.' },
    ],
    hintsJson: [
      '_count accepts an object: { _all: true, rating: true } returns both counts per group.',
      'Only combinations that occur in the data become groups — there is no zero-row group.',
      '_avg over a group where every value is null comes back as null, so guard before formatting.',
      'The naive average divides by rows; AVG divides by non-null values. Compute both and compare.',
    ],
    solution: wrap(`  const groups = await prisma.post.groupBy({
    by: ["authorId", "published"],
    _count: { _all: true, rating: true },
    _avg: { rating: true },
    orderBy: [{ authorId: "asc" }, { published: "asc" }],
  });
  for (const g of groups) {
    const avg = g._avg.rating === null ? "-" : g._avg.rating.toFixed(2);
    console.log(g.published, g._count._all, g._count.rating, avg);
  }
  console.log("groups", groups.length);

  const overall = await prisma.post.aggregate({
    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const naive = (overall._sum.rating ?? 0) / overall._count._all;
  console.log("naive", naive.toFixed(2));
  console.log("correct", (overall._avg.rating ?? 0).toFixed(2));`),
    solutionExplanationHtml: `<p>Grouping by two columns produces one row per combination <strong>present in the data</strong>. Three authors and two boolean values suggest six groups, but only four come back: Bob wrote no drafts and Cy wrote nothing published, and SQL never invents an empty group. Note the ordering too — <code>false</code> sorts before <code>true</code>, so Ann's single draft group is printed first, which is the kind of detail worth checking against real output rather than assuming. Reports that assume a full grid need to fill the gaps themselves — usually by generating the expected combinations in code and left-joining the results — because "no row" and "a row with zero" look identical to a naive consumer and only one of them is what happened.</p>
<p>The null handling is the sharper lesson. <code>AVG</code> ignores nulls, so Ann's draft group has one row, zero rated values, and an average of <code>null</code> rather than <code>0</code> — averaging nothing has no answer, and Prisma types <code>_avg.rating</code> as <code>number | null</code> to say so. Printing it directly would emit <code>null</code> into a report; formatting it as <code>0.00</code> would claim a rating of zero that nobody gave. The dash is the honest third option.</p>
<p>The final comparison is the bug this exercise exists to prevent. Dividing <code>_sum.rating</code> (19) by the row count (8) yields 2.38, while <code>_avg.rating</code> yields 19 / 6 = 3.17, because the sum and the average disagree about the denominator. Hand-rolled averages built from a sum and a count are wrong on every table with a nullable metric, which is most of them — use <code>_avg</code> and let the database decide what counts. The <code>_count</code> object form is what makes the discrepancy visible in the first place, since it reports rows and non-null values side by side.</p>`,
    seed: SEED,
    expect: `false 1 0 -\ntrue 3 3 4.00\ntrue 3 2 3.00\nfalse 1 1 1.00\ngroups 4\nnaive 2.38\ncorrect 3.17`,
  },
  {
    title: 'Bucket Rows by Month with a Raw Query groupBy Cannot Express',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['grouping by an expression', 'date_trunc', 'raw query with a typed result', 'bigint cast', 'when the client is not enough'],
    prerequisites: ['groupBy', '$queryRaw'],
    tags: ['prisma', 'raw-sql', 'groupby', 'dates', 'report'],
    problemHtml: `<p><code>groupBy</code> groups by <strong>columns</strong>, never by expressions. "Posts per month" needs <code>GROUP BY date_trunc('month', "createdAt")</code>, and there is no client syntax for it — this is the boundary where dropping to SQL is the right call rather than a shortcut. <code>$queryRaw</code> keeps the interpolation parameterised, and its generic names the rows you expect.</p>
<p>Against the reference dataset (posts created in January and February 2026):</p>
<ul>
<li>Run a <code>$queryRaw</code> grouping posts by month with <code>date_trunc</code>, returning the month, the row count and the summed views, ordered by month ascending. Cast the count with <code>::int</code>.</li>
<li>Log <code>YYYY-MM count sum</code> per bucket, formatting the month by slicing the ISO string.</li>
<li>Add a parameterised floor: repeat the query with <code>WHERE views >= ${'${minViews}'}</code> for <code>minViews = 100</code> and log <code>hot:</code> followed by the same per-bucket format joined by <code>&nbsp;|&nbsp;</code>.</li>
<li>Cross-check the total against the client: log <code>check N M</code> where <code>N</code> is the summed count across buckets and <code>M</code> is <code>prisma.post.count()</code>. They must match — a raw query that disagrees with the client is how silent reporting bugs start.</li>
</ul>
<p>Use the tagged-template form only. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: four posts created in January 2026 (100, 250, 80 and 0 views — the January drafts are Intro to SQL, Prisma Basics, Redis Notes) and four in February (0, 130, 150, 70, 20 across Draft on Prisma, Indexing Tips, React Hooks, CSS Grid and Cy Draft).',
    outputSpec: 'Two monthly buckets — January with 3 posts and 430 views, February with 5 posts and 370 — then the buckets restricted to posts of at least 100 views, then a cross-check where both totals equal 8.',
    constraints: 'The month bucketing must happen in SQL. Cast counts to int. No $queryRawUnsafe and no string concatenation.',
    examplesJson: [
      { input: "SELECT date_trunc('month', \"createdAt\") AS month, COUNT(*)::int AS count, SUM(views)::int AS sum FROM \"Post\" GROUP BY 1 ORDER BY 1", output: '2026-01 3 430', explanation: 'Three posts were created in January totalling 100 + 250 + 80 = 430 views.' },
      { input: 'the same query with WHERE views >= ${minViews} and minViews = 100', output: 'hot: 2026-01 2 350 | 2026-02 2 280', explanation: 'January keeps Intro to SQL and Prisma Basics; February keeps Indexing Tips and React Hooks.' },
      { input: 'summing the bucket counts against prisma.post.count()', output: 'check 8 8', explanation: 'The raw grouping and the client agree, which is the check that catches a wrong join or a lost row.' },
    ],
    hintsJson: [
      "date_trunc('month', column) rounds a timestamp down to the first of its month.",
      'COUNT and SUM return bigint in Postgres — cast both with ::int before they reach JavaScript.',
      'The returned month is a Date; take toISOString().slice(0, 7) for YYYY-MM.',
      'Interpolate the threshold with ${} so it becomes a bound parameter.',
    ],
    solution: wrapPre(`type Bucket = { month: Date; count: number; sum: number };
const fmt = (b: Bucket) => \`\${b.month.toISOString().slice(0, 7)} \${b.count} \${b.sum}\`;`, `  const buckets = await prisma.$queryRaw<Bucket[]>\`
    SELECT date_trunc('month', "createdAt") AS month,
           COUNT(*)::int AS count,
           COALESCE(SUM(views), 0)::int AS sum
    FROM "Post"
    GROUP BY 1 ORDER BY 1 ASC\`;
  for (const b of buckets) console.log(fmt(b));

  const minViews = 100;
  const hot = await prisma.$queryRaw<Bucket[]>\`
    SELECT date_trunc('month', "createdAt") AS month,
           COUNT(*)::int AS count,
           COALESCE(SUM(views), 0)::int AS sum
    FROM "Post"
    WHERE views >= \${minViews}
    GROUP BY 1 ORDER BY 1 ASC\`;
  console.log("hot:", hot.map(fmt).join(" | "));

  const totalFromBuckets = buckets.reduce((n, b) => n + b.count, 0);
  console.log("check", totalFromBuckets, await prisma.post.count());`),
    solutionExplanationHtml: `<p>The client's <code>groupBy</code> takes column names, so any grouping that needs a <em>computed</em> key — a month, a rounded price, the first letter of a name — is outside it. That is a real boundary rather than a missing feature: the whole client API is built on column identity. Recognising it early saves the usual detour of fetching every row and bucketing in JavaScript, which is both slower and wrong the moment the table stops fitting in memory.</p>
<p><code>date_trunc('month', "createdAt")</code> rounds each timestamp down to the first instant of its month, so equal keys group together, and <code>GROUP BY 1</code> refers to the first select item so the expression is not repeated. The returned value is a full timestamp, which arrives in JavaScript as a <code>Date</code> — slicing its ISO string to <code>YYYY-MM</code> is the display step, not the grouping step. Beware that <code>date_trunc</code> works in the session time zone unless the column is <code>timestamptz</code>, so a report near a month boundary can shift; pinning it with <code>AT TIME ZONE 'UTC'</code> is the honest fix when that matters.</p>
<p>Two mechanical details bite in every raw aggregate. <code>COUNT</code> and <code>SUM</code> return <code>bigint</code>, which becomes a JavaScript <code>BigInt</code> that <code>JSON.stringify</code> refuses to serialise — hence the <code>::int</code> casts. And <code>SUM</code> over an empty set is <code>null</code>, so <code>COALESCE</code> keeps the declared type honest; the generic you write is a promise TypeScript cannot verify against the SQL, which makes such mismatches runtime bugs rather than compile errors. The final cross-check exists for the same reason: comparing the raw total against <code>prisma.post.count()</code> is a cheap invariant that catches a dropped row or a mistaken join before the number reaches a dashboard.</p>`,
    seed: SEED,
    expect: `2026-01 3 430\n2026-02 5 370\nhot: 2026-01 2 350 | 2026-02 2 280\ncheck 8 8`,
  },
  {
    title: 'Rank Rows Within Each Group Using a Window Function',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['window functions', 'ROW_NUMBER over partition', 'ranking without collapsing rows', 'top-N per group', 'raw result typing'],
    prerequisites: ['$queryRaw', 'groupBy'],
    tags: ['prisma', 'raw-sql', 'window-functions', 'ranking', 'report'],
    problemHtml: `<p>Aggregation collapses rows; a <strong>window function</strong> computes across a set of rows while keeping every one of them. That is the difference between "how many posts per author" and "each post with its position among that author's posts" — the second is impossible with <code>groupBy</code>, and it is the standard way to answer top-N-per-group questions.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Run a <code>$queryRaw</code> selecting each post's <code>title</code>, its author's <code>name</code>, its <code>views</code>, and <code>ROW_NUMBER() OVER (PARTITION BY p."authorId" ORDER BY p.views DESC)::int AS rank</code>, joined to the user table and ordered by name then rank. Log <code>name rank title views</code> per row.</li>
<li>Wrap the same query as a subquery and keep only <code>rank &lt;= 2</code>, logging <code>top2:</code> followed by <code>name title</code> per surviving row, joined by <code>&nbsp;|&nbsp;</code>. A window function cannot be used in <code>WHERE</code> directly — that restriction is the reason for the subquery.</li>
<li>Add a running total: select each post's <code>views</code> and <code>SUM(views) OVER (ORDER BY p.id)::int</code>, logging <code>running:</code> followed by the values joined by a comma.</li>
</ul>
<p>Every window computation must happen in SQL. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: Ann’s posts are 250, 130, 100 and 0 views; Bob’s are 150, 80 and 70; Cy has a single post at 20.',
    outputSpec: 'Every post listed with its per-author rank, then the two best posts of each author (Cy contributing only one), then a running total that ends at 800 — the sum of all views.',
    constraints: 'Ranking must use a window function, not a per-author query in a loop. Filter on the rank through a subquery. Cast the window results to int.',
    examplesJson: [
      { input: 'ROW_NUMBER() OVER (PARTITION BY "authorId" ORDER BY views DESC)', output: 'Ann 1 Prisma Basics 250', explanation: 'Within Ann’s partition the 250-view post is first; the numbering restarts for each author.' },
      { input: 'SELECT ... FROM (the ranked query) t WHERE rank <= 2', output: 'top2: Ann Prisma Basics | Ann Indexing Tips | Bob React Hooks | Bob Redis Notes | Cy Cy Draft', explanation: 'A window function is computed after WHERE, so filtering on it needs the extra query level.' },
      { input: 'SUM(views) OVER (ORDER BY id)', output: 'running: 100, 350, 350, 480, 560, 710, 780, 800', explanation: 'Each row carries the total of every row up to and including itself in id order.' },
    ],
    hintsJson: [
      'PARTITION BY restarts the numbering per group; ORDER BY inside OVER decides the order within it.',
      'A window function may not appear in WHERE — nest the query and filter outside.',
      'ROW_NUMBER and SUM OVER return bigint, so cast them with ::int.',
      'Join to "User" to get the author name, which groupBy could never have given you.',
    ],
    solution: wrapPre(`type Ranked = { title: string; name: string; views: number; rank: number };`, `  const ranked = await prisma.$queryRaw<Ranked[]>\`
    SELECT p.title, u.name, p.views,
           ROW_NUMBER() OVER (PARTITION BY p."authorId" ORDER BY p.views DESC)::int AS rank
    FROM "Post" p JOIN "User" u ON u.id = p."authorId"
    ORDER BY u.name ASC, rank ASC\`;
  for (const r of ranked) console.log(r.name, r.rank, r.title, r.views);

  const top2 = await prisma.$queryRaw<Ranked[]>\`
    SELECT * FROM (
      SELECT p.title, u.name, p.views,
             ROW_NUMBER() OVER (PARTITION BY p."authorId" ORDER BY p.views DESC)::int AS rank
      FROM "Post" p JOIN "User" u ON u.id = p."authorId"
    ) t
    WHERE t.rank <= 2
    ORDER BY t.name ASC, t.rank ASC\`;
  console.log("top2:", top2.map((r) => \`\${r.name} \${r.title}\`).join(" | "));

  const running = await prisma.$queryRaw<{ total: number }[]>\`
    SELECT SUM(p.views) OVER (ORDER BY p.id)::int AS total
    FROM "Post" p ORDER BY p.id\`;
  console.log("running:", running.map((r) => r.total).join(", "));`),
    solutionExplanationHtml: `<p>A window function runs over a set of rows without collapsing them, so each post keeps its identity and gains a computed column. <code>PARTITION BY p."authorId"</code> restarts the numbering for every author, and the <code>ORDER BY</code> <em>inside</em> <code>OVER</code> decides the order used for the ranking — which is entirely independent of the query's own <code>ORDER BY</code> at the end. Confusing the two is the most common beginner error: sorting the output does not change the ranks, and changing the window's order changes every rank.</p>
<p>Filtering on the rank requires the extra query level because of evaluation order. SQL applies <code>WHERE</code> before window functions are computed, so <code>WHERE rank &lt;= 2</code> refers to something that does not exist yet; nesting the ranked query and filtering outside is the standard fix, and a CTE (<code>WITH ranked AS (...)</code>) is the same trick with a nicer name. This top-N-per-group shape has no client equivalent: <code>groupBy</code> returns one row per group, and fetching each author's posts in a loop is N+1 queries for the same answer.</p>
<p>The join is worth noticing too. Because the rows are not collapsed, the author's <code>name</code> comes along for free — the very column <code>groupBy</code> cannot give you. <code>SUM(views) OVER (ORDER BY p.id)</code> shows the other common shape, a running total, where the default frame covers everything from the start of the partition up to the current row. Choosing <code>ROW_NUMBER</code> over its siblings matters as data grows: <code>RANK</code> leaves gaps after ties and <code>DENSE_RANK</code> does not, while <code>ROW_NUMBER</code> forces a strict order even between equal values. And as always with raw queries, the <code>::int</code> casts keep <code>bigint</code> from arriving as a <code>BigInt</code>, and the generic type is a promise the compiler cannot check for you.</p>`,
    diagramMermaid: `flowchart TD
  A[FROM and JOIN] --> B[WHERE filters rows]
  B --> C[window functions computed here]
  C --> D[outer query can filter on rank]
  D --> E[ORDER BY of the output]`,
    seed: SEED,
    expect: `Ann 1 Prisma Basics 250\nAnn 2 Indexing Tips 130\nAnn 3 Intro to SQL 100\nAnn 4 Draft on Prisma 0\nBob 1 React Hooks 150\nBob 2 Redis Notes 80\nBob 3 CSS Grid 70\nCy 1 Cy Draft 20\ntop2: Ann Prisma Basics | Ann Indexing Tips | Bob React Hooks | Bob Redis Notes | Cy Cy Draft\nrunning: 100, 350, 350, 480, 560, 710, 780, 800`,
  },
  {
    title: 'Change Many Rows at Once with $executeRaw and updateMany',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['$executeRaw returns affected rows', 'updateMany count', 'expression-based updates', 'atomic number operations', 'choosing between client and raw'],
    prerequisites: ['updateMany', '$queryRaw'],
    tags: ['prisma', 'raw-sql', 'update', 'bulk', 'write'],
    problemHtml: `<p><code>$queryRaw</code> is for statements that return rows; <code>$executeRaw</code> is for statements that do not, and it returns the <strong>number of affected rows</strong> instead. The client's <code>updateMany</code> returns the same number in <code>{ count }</code>, so the two overlap — the dividing line is whether the new value is a constant your code computed or an <em>expression</em> the database must evaluate per row.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Use <code>updateMany</code> to set <code>rating</code> to <code>3</code> for every post whose rating is <code>null</code>, and log <code>filled N</code> from the returned count.</li>
<li>Use <code>$executeRaw</code> to give every published post a 10 percent view bump — <code>views = ROUND(views * 1.1)</code>, an expression the client cannot express — and log <code>bumped N</code> from the returned number.</li>
<li>Log <code>sum N</code>, the total views afterwards, with a client aggregate.</li>
<li>Show the client's atomic alternative for the constant case: <code>updateMany</code> with <code>views: { increment: 5 }</code> on unpublished posts, logging <code>incremented N</code> and then <code>drafts</code> followed by their view values ordered by <code>title</code>, joined by a comma.</li>
</ul>
<p>Use the tagged-template form of <code>$executeRaw</code>. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: two posts have a null rating; six posts are published with views 100, 250, 130, 80, 150 and 70; the two drafts have 0 and 20 views.',
    outputSpec: 'Two ratings filled, six posts bumped by ten percent, a new total of 878 views, then two drafts incremented to 5 and 25.',
    constraints: 'The percentage bump must be one SQL statement — do not read the rows and write them back. Use increment rather than a read-modify-write for the constant case.',
    examplesJson: [
      { input: 'updateMany({ where: { rating: null }, data: { rating: 3 } })', output: 'filled 2', explanation: 'updateMany returns { count } — the number of rows the statement touched.' },
      { input: 'UPDATE "Post" SET views = ROUND(views * 1.1) WHERE published = true', output: 'bumped 6', explanation: '$executeRaw returns the affected row count directly, and the new value is computed per row by the database.' },
      { input: 'updateMany({ where: { published: false }, data: { views: { increment: 5 } } })', output: 'incremented 2, drafts 5, 25', explanation: 'increment is an atomic SET views = views + 5, so two concurrent callers cannot lose an update.' },
    ],
    hintsJson: [
      '$executeRaw returns a number, not rows — it is for UPDATE, DELETE and DDL.',
      'An update whose new value depends on the old one needs an expression, so it is either increment or raw SQL.',
      'ROUND on a double needs no cast here; Postgres assigns the result back to the integer column.',
      'Read the affected counts from the return values rather than counting rows afterwards.',
    ],
    solution: wrap(`  const filled = await prisma.post.updateMany({ where: { rating: null }, data: { rating: 3 } });
  console.log("filled", filled.count);

  const bumped = await prisma.$executeRaw\`
    UPDATE "Post" SET views = ROUND(views * 1.1) WHERE published = true\`;
  console.log("bumped", bumped);

  const total = await prisma.post.aggregate({ _sum: { views: true } });
  console.log("sum", total._sum.views);

  const incremented = await prisma.post.updateMany({
    where: { published: false },
    data: { views: { increment: 5 } },
  });
  console.log("incremented", incremented.count);
  const drafts = await prisma.post.findMany({
    where: { published: false }, orderBy: { title: "asc" }, select: { views: true },
  });
  console.log("drafts", drafts.map((d) => d.views).join(", "));`),
    solutionExplanationHtml: `<p>The two APIs differ in what they return, and that is the clue to what they are for. <code>$queryRaw</code> hands back rows; <code>$executeRaw</code> hands back an affected-row count, which makes it the right tool for <code>UPDATE</code>, <code>DELETE</code> and DDL. The client's <code>updateMany</code> reports the same number in <code>{ count }</code>, so both styles let you assert how much you changed — and asserting it matters, because a <code>where</code> that matches nothing succeeds silently.</p>
<p>The dividing line is whether the new value depends on the old one. <code>rating: 3</code> is a constant the client can send, so <code>updateMany</code> is the natural choice. <code>views = ROUND(views * 1.1)</code> is an expression evaluated per row, and the client's <code>data</code> object has no syntax for arbitrary expressions — the alternative would be reading six rows, computing in JavaScript, and issuing six updates, which is slower and racy. Note the rounding is the database's: 100 becomes 110, 250 becomes 275, 130 becomes 143, 80 becomes 88, 150 becomes 165 and 70 becomes 77, totalling 858 for the published posts plus 20 from the untouched drafts.</p>
<p>For the common numeric cases the client does provide atomic operations — <code>increment</code>, <code>decrement</code>, <code>multiply</code>, <code>divide</code> — which compile to <code>SET views = views + 5</code> rather than a read-modify-write. That distinction is not cosmetic: two concurrent read-modify-write callers each read 0, each write 5, and one update is lost, whereas two atomic increments always land at 10. Reach for raw SQL only when the expression genuinely exceeds those operators, and remember that <code>$executeRawUnsafe</code>, which takes a plain string, gives up the parameterisation that makes any of this safe with user input.</p>`,
    seed: SEED,
    expect: `filled 2\nbumped 6\nsum 878\nincremented 2\ndrafts 25, 5`,
  },
  {
    title: 'Build a Leaderboard That groupBy Alone Cannot Produce',
    difficulty: 'HARD', estimatedMinutes: 50, points: 25,
    concepts: ['groupBy returns no relations', 'hydrating group keys', 'two-query pattern versus one join', 'ordering by an aggregate', 'preserving rank order'],
    prerequisites: ['groupBy', '$queryRaw', 'relation basics'],
    tags: ['prisma', 'groupby', 'leaderboard', 'raw-sql', 'report'],
    problemHtml: `<p>A grouped result carries the grouping key and the aggregates — never a related row. A leaderboard therefore needs the author's <em>name</em>, which <code>groupBy</code> cannot supply, and there are two correct answers: group first and hydrate the names in a second query, or write one raw query with a join. Both appear in real code; the point is to know why each is chosen.</p>
<p>Against the reference dataset, produce the same leaderboard twice:</p>
<ul>
<li><strong>Client route.</strong> Group published posts by <code>authorId</code> with <code>_count</code> and <code>_sum: { views: true }</code>, ordered by the summed views descending. Fetch the matching users in <strong>one</strong> follow-up query with <code>id: { in: [...] }</code>, index them by id in a <code>Map</code>, and log <code>a: name posts sum</code> per entry in the ranked order — not the order the users came back in.</li>
<li><strong>Raw route.</strong> One <code>$queryRaw</code> joining users to their published posts, grouping by <code>u.id, u.name</code>, ordering by the sum descending, and returning name, count and sum. Log <code>b: name posts sum</code> per row.</li>
<li>Assert the two agree: log <code>match true</code> when the rendered lines are identical, comparing the joined strings.</li>
</ul>
<p>The client route must issue exactly two queries — no query inside a loop. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset restricted to published posts: Ann has 3 totalling 480 views, Bob has 3 totalling 300, and Cy has none.',
    outputSpec: 'Both routes list Ann with 3 posts and 480 views ahead of Bob with 3 and 300, Cy is absent from both because she has no published post, and the equality check reports true.',
    constraints: 'Exactly two queries for the client route and one for the raw route. Do not query users inside a loop, and do not reorder the leaderboard by name.',
    examplesJson: [
      { input: 'groupBy published posts by authorId ordered by _sum.views desc', output: 'two groups: 480 then 300', explanation: 'Cy has no published post, so she never forms a group — an absent row, not a zero.' },
      { input: 'user.findMany({ where: { id: { in: ids } } }) then a Map lookup', output: 'a: Ann 3 480', explanation: 'One query fetches every needed name; the Map restores the ranked order the IN query does not preserve.' },
      { input: 'the raw joined query', output: 'b: Ann 3 480', explanation: 'A single statement does the join, the grouping and the ordering, at the cost of hand-written SQL and manual result typing.' },
    ],
    hintsJson: [
      'Collect the ids from the grouped rows with map, then pass them to a single findMany with in.',
      'An IN query returns rows in the database’s order — rebuild the ranking from the grouped array.',
      'A Map from id to name turns the lookup into O(1) instead of a find per entry.',
      'In the raw query, group by both u.id and u.name so the name is a legal select item.',
    ],
    solution: wrapPre(`type Row = { name: string; posts: number; sum: number };
const render = (rows: Row[]) => rows.map((r) => \`\${r.name} \${r.posts} \${r.sum}\`).join(" | ");`, `  const groups = await prisma.post.groupBy({
    by: ["authorId"],
    where: { published: true },
    _count: true,
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
  });
  const users = await prisma.user.findMany({
    where: { id: { in: groups.map((g) => g.authorId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.name]));
  const clientRows: Row[] = groups.map((g) => ({
    name: nameById.get(g.authorId) ?? "unknown",
    posts: g._count,
    sum: g._sum.views ?? 0,
  }));
  console.log("a:", render(clientRows));

  const rawRows = await prisma.$queryRaw<Row[]>\`
    SELECT u.name, COUNT(p.id)::int AS posts, COALESCE(SUM(p.views), 0)::int AS sum
    FROM "User" u JOIN "Post" p ON p."authorId" = u.id
    WHERE p.published = true
    GROUP BY u.id, u.name
    ORDER BY SUM(p.views) DESC\`;
  console.log("b:", render(rawRows));

  console.log("match", render(clientRows) === render(rawRows));`),
    solutionExplanationHtml: `<p>The limitation is structural: <code>groupBy</code> compiles to a single-table <code>GROUP BY</code>, so its rows contain the grouping keys and aggregates only. Hydrating the keys afterwards is the standard fix, and the shape of the fix matters more than it looks. Collecting the ids and issuing <strong>one</strong> <code>findMany</code> with <code>id: { in: ids }</code> keeps it at two queries; looking each name up inside the loop is the N+1 pattern that turns a leaderboard of a hundred authors into a hundred and one round trips.</p>
<p>Two ordering details are easy to get wrong. The <code>IN</code> query returns users in whatever order the database finds convenient, so the ranking must come from the grouped array — iterating the users instead would silently sort the leaderboard by id. And the <code>Map</code> is not just tidiness: <code>users.find(...)</code> inside the map is quadratic, which is invisible at three authors and painful at ten thousand.</p>
<p>The raw route trades hand-written SQL for a single statement. Grouping by <code>u.id, u.name</code> is what makes selecting the name legal — every non-aggregated select item must be in the <code>GROUP BY</code>, and grouping by the id alone would leave the name ambiguous to the standard even where Postgres tolerates it via the primary key. The <code>JOIN</code> is inner, so Cy drops out exactly as she does from the grouped version; a <code>LEFT JOIN</code> would include her with a count of zero, which is a different report and often the one a product manager actually wanted. Prefer the client route for maintainability and type safety, the raw route when one round trip matters or when the ranking needs window functions the client cannot express — and keep an equality check like this one in the test suite when both exist.</p>`,
    diagramMermaid: `flowchart TD
  A[groupBy authorId with sums] --> B[ids from the grouped rows]
  B --> C[one findMany with id in ids]
  C --> D[Map id to name]
  D --> E[render in the grouped order]
  F[single raw query joining User and Post] --> G[same rows in one round trip]`,
    seed: SEED,
    expect: `a: Ann 3 480 | Bob 3 300\nb: Ann 3 480 | Bob 3 300\nmatch true`,
  },
  {
    title: 'Capstone: An Analytics Report in One Consistent Snapshot',
    difficulty: 'HARD', estimatedMinutes: 65, points: 30,
    concepts: ['transaction for consistent reads', 'combining aggregate groupBy and raw', 'percentile and median in SQL', 'null-safe formatting', 'report composition'],
    prerequisites: ['aggregate', 'groupBy', 'having', '$queryRaw', 'transactions'],
    tags: ['prisma', 'analytics', 'capstone', 'raw-sql', 'transaction'],
    problemHtml: `<p>A dashboard that issues five independent queries can render five different moments in time — the totals and the breakdown disagree, and the bug is invisible until someone adds them up. Wrapping the reads in <code>prisma.$transaction([...])</code> makes them share one snapshot. This capstone builds such a report from every tool in the module.</p>
<p>Against the reference dataset, run these four reads in a <strong>single</strong> <code>$transaction</code> array and then print the report:</p>
<ul>
<li>An <code>aggregate</code> over published posts: <code>_count</code>, <code>_sum</code> and <code>_avg</code> of <code>views</code>.</li>
<li>A <code>groupBy</code> on <code>authorId</code> over published posts with <code>_sum: { views: true }</code>, keeping only groups with <code>having: { views: { _sum: { gte: 300 } } }</code>, ordered by the sum descending.</li>
<li>A <code>$queryRaw</code> returning the median of <code>views</code> across published posts via <code>PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views)</code>, aliased and cast to a float.</li>
<li>A <code>$queryRaw</code> bucketing published posts into <code>low</code> (under 100 views) and <code>high</code> (100 or more) with a <code>CASE</code> expression, counting each bucket, ordered by the bucket name.</li>
</ul>
<p>Then log, one per line: <code>posts N</code>, <code>views N</code>, <code>avg X</code> to two decimals, <code>median X</code> to two decimals, <code>leaders N</code> (the number of surviving groups) and their summed views joined by a comma as <code>leaderSums ...</code>, and <code>buckets</code> followed by <code>name=count</code> pairs joined by a comma.</p>`,
    inputSpec: 'The reference dataset restricted to published posts: views 100, 250, 130, 80, 150 and 70 across Ann (3) and Bob (3).',
    outputSpec: 'Six published posts totalling 780 views averaging 130 with a median of 115, two author groups clearing the 300-view threshold with sums 480 and 300, and buckets of two low and four high posts.',
    constraints: 'All four reads must go in one $transaction array — no interactive callback and no separate awaits. The median and the bucketing must be computed in SQL.',
    examplesJson: [
      { input: 'aggregate over published posts', output: 'posts 6, views 780, avg 130.00', explanation: 'The same six posts as exercise 1, unchanged by the later reads because they share one snapshot.' },
      { input: 'PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views)', output: 'median 115.00', explanation: 'Sorted views are 70, 80, 100, 130, 150, 250; with an even count the continuous percentile interpolates (100 + 130) / 2.' },
      { input: "CASE WHEN views < 100 THEN 'low' ELSE 'high' END", output: 'buckets high=4, low=2', explanation: 'Only 70 and 80 fall below 100, and ordering by the bucket name puts high first.' },
    ],
    hintsJson: [
      'The array form of $transaction takes unawaited query promises and resolves them together.',
      'Destructure the results in the same order you listed the queries — the tuple is positional.',
      'PERCENTILE_CONT is an ordered-set aggregate: the ORDER BY goes inside WITHIN GROUP.',
      'Cast raw numeric results so a numeric or bigint does not arrive as a string or a BigInt.',
    ],
    solution: wrapPre(`type Median = { median: number };
type Bucket = { bucket: string; count: number };`, `  const [totals, leaders, medianRows, buckets] = await prisma.$transaction([
    prisma.post.aggregate({
      where: { published: true },
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
    }),
    prisma.post.groupBy({
      by: ["authorId"],
      where: { published: true },
      _sum: { views: true },
      having: { views: { _sum: { gte: 300 } } },
      orderBy: { _sum: { views: "desc" } },
    }),
    prisma.$queryRaw<Median[]>\`
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views)::float AS median
      FROM "Post" WHERE published = true\`,
    prisma.$queryRaw<Bucket[]>\`
      SELECT CASE WHEN views < 100 THEN 'low' ELSE 'high' END AS bucket,
             COUNT(*)::int AS count
      FROM "Post" WHERE published = true
      GROUP BY 1 ORDER BY 1\`,
  ]);

  console.log("posts", totals._count);
  console.log("views", totals._sum.views);
  console.log("avg", (totals._avg.views ?? 0).toFixed(2));
  console.log("median", (medianRows[0].median ?? 0).toFixed(2));
  console.log("leaders", leaders.length);
  // With having, Prisma types the aggregate keys as optional — read them defensively.
  console.log("leaderSums", leaders.map((l) => l._sum?.views ?? 0).join(", "));
  console.log("buckets", buckets.map((b) => \`\${b.bucket}=\${b.count}\`).join(", "));`),
    solutionExplanationHtml: `<p>The array form of <code>$transaction</code> takes unawaited query promises and runs them in one transaction, so every read sees the same snapshot. That is the difference between a report whose parts agree and one where the total was measured before an insert and the breakdown after it — a discrepancy that appears only under load and is nearly impossible to reproduce afterwards. The results come back as a positional tuple, correctly typed per element, which is why destructuring in the declared order is mandatory: swap two lines and the types stop fitting, which is the compiler doing you a favour. One typing quirk to expect: on a <code>groupBy</code> carrying a <code>having</code>, Prisma widens the aggregate keys to optional, so <code>l._sum?.views ?? 0</code> is what compiles under <code>strict</code> — a case where the honest fix is the optional chain rather than an assertion.</p>
<p>Each read is the right tool for its question. <code>aggregate</code> answers the single-row totals. <code>groupBy</code> with <code>having</code> answers "which authors clear 300 views", filtering after aggregation because the predicate is about the sum. The median needs raw SQL for a structural reason: it is not an aggregate the client exposes, and it cannot be derived from a sum and a count — <code>PERCENTILE_CONT(0.5)</code> is an ordered-set aggregate whose <code>ORDER BY</code> lives inside <code>WITHIN GROUP</code>. With six values it interpolates between the third and fourth, giving 115 against a mean of 130; the gap between the two is exactly why dashboards that report only the mean mislead on skewed data. Its sibling <code>PERCENTILE_DISC</code> would have returned an actual observed value instead.</p>
<p>The bucketing shows the other reason to drop to SQL: <code>CASE</code> creates a grouping key that no column holds, which <code>groupBy</code> cannot express. Two mechanical habits keep raw results honest here — casting (<code>::float</code>, <code>::int</code>) so <code>numeric</code> does not arrive as a string and <code>bigint</code> does not arrive as a <code>BigInt</code> — and one semantic habit: every aggregate that can see zero rows is nullable, so <code>_avg.views</code> and the median are coalesced before formatting. Finally, keep transactions like this read-only and short; they hold a connection, and a long analytical transaction on a busy database delays the vacuuming of rows it might still need to see.</p>`,
    diagramMermaid: `sequenceDiagram
  participant App
  participant Tx as One transaction
  participant DB as Postgres
  App->>Tx: transaction array of four reads
  Tx->>DB: aggregate totals
  Tx->>DB: groupBy with having
  Tx->>DB: raw median percentile
  Tx->>DB: raw case bucketing
  DB-->>Tx: four results from one snapshot
  Tx-->>App: positional tuple`,
    seed: SEED,
    expect: `posts 6\nviews 780\navg 130.00\nmedian 115.00\nleaders 2\nleaderSums 480, 300\nbuckets high=4, low=2`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VDIR = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/prisma-435';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VDIR, { recursive: true });
const scaffold = `${imp}\nasync function main() {\n  // TODO: implement the steps described above\n}\n\nmain().finally(() => prisma.$disconnect());`;
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [{ name: 'solution.ts', language: 'typescript', code: scaffold }],
  solutionCodeJson: [{ name: 'solution.ts', language: 'typescript', code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));
fs.writeFileSync(path.join(VDIR, 'reference.prisma'), REFERENCE);
ex.forEach((e, i) => {
  const n = i + 1;
  // Exercises whose printed output includes sequence-generated ids get a
  // separate deterministic runner so the verification stays reproducible.
  fs.writeFileSync(path.join(VDIR, `ex${n}.ts`), e.dynamic ? wrap(e.dynamic) : e.solution);
  fs.writeFileSync(path.join(VDIR, `ex${n}.shipped.ts`), e.solution);
  if (e.seed) fs.writeFileSync(path.join(VDIR, `ex${n}.seed.ts`), `${imp}\nasync function main(){\n${e.seed}\n}\nmain().finally(()=>prisma.$disconnect());`);
  const expected = e.dynamicExpect ?? e.expect;
  if (expected) fs.writeFileSync(path.join(VDIR, `ex${n}.expect.txt`), `${expected}\n`);
});
const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error(`need 10`);
parsed.exercises.forEach((e, i) => {
  if (e.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} ${e.difficulty}`);
  if (e.problemHtml.length < 900) throw new Error(`problemHtml<900 ${e.title} (${e.problemHtml.length})`);
  if (e.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${e.title}`);
  if (e.hintsJson.length < 4) throw new Error(`<4 hints ${e.title}`);
  if (e.examplesJson.length < 2) throw new Error(`<2 ex ${e.title}`);
  const sl = e.solutionCodeJson.map((f) => f.code).join('').length;
  if (sl < 205) throw new Error(`sol<205 ${e.title} (${sl})`);
});
console.log(`OK ${parsed.exercises.length} -> ${trackSlug}__${moduleSlug}.json`);
