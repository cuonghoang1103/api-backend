// prisma-orm module 433 (relations-and-nested-operations) — 10 client exercises.
// Verified by tsx + tsc against a real Postgres + Prisma client.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'prisma-orm';
const moduleSlug = 'relations-and-nested-operations';
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
  id       Int       @id @default(autoincrement())
  email    String    @unique
  name     String
  profile  Profile?
  posts    Post[]
  comments Comment[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id         Int        @id @default(autoincrement())
  title      String     @unique
  published  Boolean    @default(false)
  views      Int        @default(0)
  authorId   Int
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments   Comment[]
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Comment {
  id       Int    @id @default(autoincrement())
  body     String
  postId   Int
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
`;
const imp = `import { PrismaClient } from './generated';\nconst prisma = new PrismaClient();\n`;
const wrap = (body) => `${imp}\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;

const WIPE = `await prisma.comment.deleteMany(); await prisma.post.deleteMany();
await prisma.profile.deleteMany(); await prisma.category.deleteMany(); await prisma.user.deleteMany();`;

// Reference dataset: 3 users (Cy has neither profile nor posts), 5 posts, 3 categories, 4 comments.
const SEED = `${WIPE}
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", profile: { create: { bio: "Backend engineer" } } } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", profile: { create: { bio: "Frontend developer" } } } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
const db = await prisma.category.create({ data: { name: "Databases" } });
const orm = await prisma.category.create({ data: { name: "ORM" } });
const fe = await prisma.category.create({ data: { name: "Frontend" } });
const intro = await prisma.post.create({ data: { title: "Intro to SQL", published: true, views: 100, authorId: ann.id, categories: { connect: [{ id: db.id }] } } });
const basics = await prisma.post.create({ data: { title: "Prisma Basics", published: true, views: 250, authorId: ann.id, categories: { connect: [{ id: db.id }, { id: orm.id }] } } });
await prisma.post.create({ data: { title: "Draft on Prisma", published: false, views: 0, authorId: ann.id } });
await prisma.post.create({ data: { title: "Redis Notes", published: true, views: 80, authorId: bob.id, categories: { connect: [{ id: db.id }] } } });
const hooks = await prisma.post.create({ data: { title: "React Hooks", published: true, views: 150, authorId: bob.id, categories: { connect: [{ id: fe.id }] } } });
await prisma.comment.createMany({ data: [
  { body: "Great intro", postId: intro.id, authorId: bob.id },
  { body: "Thanks", postId: intro.id, authorId: cy.id },
  { body: "Helpful", postId: basics.id, authorId: bob.id },
  { body: "Nice", postId: hooks.id, authorId: ann.id },
]});`;

const ex = [
  {
    title: 'Read Related Records with include and a Nested include',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['include', 'nested include', 'to-one vs to-many relations', 'select inside include', 'orderBy on a nested read'],
    prerequisites: ['findMany', 'select'],
    tags: ['prisma', 'relations', 'include', 'query', 'nested'],
    problemHtml: `<p>By default a Prisma query returns <strong>scalar fields only</strong> — ask for a user and you get <code>id</code>, <code>email</code>, and <code>name</code>, never the posts. Relations are opt-in through <code>include</code>, which keeps every query's cost visible in its own text instead of hiding lazy round-trips behind property access the way many ORMs do. A to-one relation such as <code>profile</code> comes back as an object or <code>null</code>; a to-many relation such as <code>posts</code> comes back as an array, empty when there is nothing to load. Inside an <code>include</code> you can nest another <code>include</code>, or switch to <code>select</code> to narrow the nested payload and add <code>orderBy</code>.</p>
<p>Against the reference dataset (three users, five posts):</p>
<ul>
<li>Fetch all users ordered by <code>email</code> ascending, including <code>profile</code> and <code>posts</code> (posts selected down to <code>title</code> only, ordered by <code>title</code> ascending). For each user log <code>email bio postCount</code>, printing <code>none</code> when the user has no profile.</li>
<li>Then fetch the single post titled <code>Prisma Basics</code>, including its <code>author</code> and — nested one level deeper — that author's <code>profile</code>. Log <code>title authorName bio</code>.</li>
</ul>
<p>The scaffold gives the client import and the async skeleton.</p>`,
    inputSpec: 'The reference dataset is seeded: Ann (profile, 3 posts), Bob (profile, 2 posts), Cy (no profile, no posts).',
    outputSpec: 'Three lines, one per user ordered by email — Ann with her bio and 3 posts, Bob with his bio and 2 posts, Cy with "none" and 0 — then one line for the post with its author name and the author profile bio.',
    constraints: 'Use include for the relations, select inside the posts include, and orderBy on both the outer query and the nested posts. Do not issue a separate query per user.',
    examplesJson: [
      { input: 'findMany({ include: { profile: true, posts: { select: { title: true } } } })', output: 'ann@x.io Backend engineer 3', explanation: 'profile is an object because the relation is to-one; posts is an array of three rows.' },
      { input: 'the same query for cy@x.io', output: 'cy@x.io none 0', explanation: 'A to-one relation with no row is null, and an empty to-many relation is [] — never undefined.' },
      { input: 'post.findUnique({ where: { title: "Prisma Basics" }, include: { author: { include: { profile: true } } } })', output: 'Prisma Basics Ann Backend engineer', explanation: 'An include nested inside an include walks two relation hops in one query.' },
    ],
    hintsJson: [
      'Relations are never returned unless you ask for them — start from include.',
      'A to-one relation is an object or null; a to-many relation is an array.',
      'Inside include you may pass an object with select and orderBy instead of true.',
      'Nest include within include to reach author then profile in one call.',
    ],
    solution: wrap(`  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: { profile: true, posts: { select: { title: true }, orderBy: { title: "asc" } } },
  });
  for (const u of users) console.log(u.email, u.profile ? u.profile.bio : "none", u.posts.length);
  const post = await prisma.post.findUnique({
    where: { title: "Prisma Basics" },
    include: { author: { include: { profile: true } } },
  });
  if (post) console.log(post.title, post.author.name, post.author.profile ? post.author.profile.bio : "none");`),
    solutionExplanationHtml: `<p>Prisma returns scalars by default and relations only on request, so <code>include</code> is the whole story here. The shape of what comes back follows the shape of the relation: <code>profile</code> is declared <code>Profile?</code> on <code>User</code>, so it arrives as an object or <code>null</code>, which is why Cy needs the <code>null</code> guard; <code>posts</code> is declared <code>Post[]</code>, so it always arrives as an array and Cy's is simply empty. That difference is the trap — reaching for <code>u.profile.bio</code> without a check compiles only because you asserted it, and blows up on the first user without a profile.</p>
<p>Passing an object instead of <code>true</code> inside <code>include</code> unlocks the same options the top-level query has: <code>select</code> narrows the nested rows to <code>title</code> (smaller payload, and TypeScript then rejects <code>p.views</code>), and <code>orderBy</code> sorts the nested array — nested rows are otherwise returned in no guaranteed order, a common source of flaky assertions. Note that <code>select</code> and <code>include</code> are mutually exclusive at the same level; you pick one per level.</p>
<p>Under the hood Prisma resolves this in a small fixed number of queries — one per relation level, not one per parent row — so the N+1 problem that plagues lazy-loading ORMs cannot appear by accident. The nested <code>author.profile</code> read shows the same idea across two hops; each extra level costs one more query, which is exactly why making it explicit in the query text matters.</p>`,
    diagramMermaid: `flowchart TD
  A[user findMany] --> B[include profile to-one gives object or null]
  A --> C[include posts to-many gives array possibly empty]
  C --> D[select title and orderBy title]
  E[post findUnique] --> F[include author]
  F --> G[include profile nested one level deeper]`,
    seed: SEED,
    expect: `ann@x.io Backend engineer 3\nbob@x.io Frontend developer 2\ncy@x.io none 0\nPrisma Basics Ann Backend engineer`,
  },
  {
    title: 'Create a User, a Profile, and Posts in One Nested Write',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['nested create', 'to-one nested write', 'to-many nested write', 'implicit transaction', 'include on the result'],
    prerequisites: ['create', 'include'],
    tags: ['prisma', 'relations', 'create', 'nested', 'write'],
    problemHtml: `<p>Creating a parent and its children usually means three inserts, a transaction, and manual foreign-key plumbing. A nested write collapses all of that: inside <code>data</code>, a relation field takes an operation object such as <code>{ create: ... }</code>, Prisma orders the inserts, fills the foreign keys from the generated parent id, and runs the whole thing as <strong>one implicit transaction</strong> — if any row fails, none is written.</p>
<p>Starting from an empty database (the scaffold wipes it), create one user in a single <code>create</code> call:</p>
<ul>
<li>Scalars: <code>email</code> <code>dee@x.io</code>, <code>name</code> <code>Dee</code>.</li>
<li>A nested <code>profile</code> with bio <code>Data engineer</code> — a to-one relation, so <code>create</code> takes a single object.</li>
<li>Nested <code>posts</code> — a to-many relation, so <code>create</code> takes an array: <code>Airflow Notes</code> (published, 40 views) and <code>DBT Models</code> (unpublished, default views).</li>
<li>Ask the same call to return the profile and the posts with <code>include</code>, ordering posts by <code>title</code> ascending.</li>
</ul>
<p>Log <code>email bio postCount</code>, then one line per post as <code>title published views</code>. Do not issue a second query to read the data back.</p>`,
    inputSpec: 'An empty database — the scaffold deletes every row before your code runs.',
    outputSpec: 'One summary line for the created user with the bio and a post count of 2, then two post lines ordered by title: DBT Models unpublished with 0 views, then Airflow Notes published with 40 views — wait, ordered by title ascending Airflow Notes comes first.',
    constraints: 'Exactly one prisma.user.create call. Do not set userId or authorId by hand, and do not follow up with a findMany to read the result.',
    examplesJson: [
      { input: 'data: { email: "dee@x.io", name: "Dee", profile: { create: { bio: "Data engineer" } } }', output: 'dee@x.io Data engineer', explanation: 'A to-one relation takes a single object under create; the foreign key userId is filled by Prisma.' },
      { input: 'posts: { create: [{ title: "Airflow Notes", published: true, views: 40 }, { title: "DBT Models" }] }', output: 'postCount 2', explanation: 'A to-many relation takes an array; omitted fields fall back to schema defaults, so DBT Models is unpublished with 0 views.' },
    ],
    hintsJson: [
      'Relation fields inside data accept operations, not raw ids — start with { create: ... }.',
      'To-one takes an object, to-many takes an array of objects.',
      'Never write userId or authorId yourself; the nested write fills them from the new parent id.',
      'Add include to the same create call so the response already carries profile and posts.',
    ],
    solution: wrap(`  const dee = await prisma.user.create({
    data: {
      email: "dee@x.io",
      name: "Dee",
      profile: { create: { bio: "Data engineer" } },
      posts: { create: [
        { title: "Airflow Notes", published: true, views: 40 },
        { title: "DBT Models" },
      ]},
    },
    include: { profile: true, posts: { orderBy: { title: "asc" } } },
  });
  console.log(dee.email, dee.profile ? dee.profile.bio : "none", dee.posts.length);
  for (const p of dee.posts) console.log(p.title, p.published, p.views);`),
    solutionExplanationHtml: `<p>The relation fields inside <code>data</code> do not take ids — they take <em>operations</em>. <code>{ create: {...} }</code> on the to-one <code>profile</code> inserts one row; <code>{ create: [...] }</code> on the to-many <code>posts</code> inserts several. Prisma inserts the parent first, reads back its generated <code>id</code>, and writes that id into <code>Profile.userId</code> and <code>Post.authorId</code> for you. Setting those foreign keys by hand is not just redundant, it is impossible here: the id does not exist until the statement runs.</p>
<p>Everything in one nested write shares an <strong>implicit transaction</strong>. If the second post violated the unique constraint on <code>title</code>, the user and the profile would be rolled back too — you never end up with a half-created aggregate. That atomicity is the main reason to prefer a nested write over three sequential calls, and it is why signup-style flows are a natural fit.</p>
<p>Two details are worth keeping. Omitted fields fall back to the schema defaults rather than <code>null</code>, so <code>DBT Models</code> comes back <code>false</code> and <code>0</code> — defaults live in the database, not in your call site. And attaching <code>include</code> to the <code>create</code> makes the write return the full aggregate, so the follow-up read most people write is unnecessary; ordering the nested posts keeps that output deterministic.</p>`,
    seed: WIPE,
    expect: `dee@x.io Data engineer 2\nAirflow Notes true 40\nDBT Models false 0`,
  },
  {
    title: 'Attach Existing Rows with connect and connectOrCreate',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['connect', 'connectOrCreate', 'unique-field lookup', 'implicit many-to-many', 'idempotent writes'],
    prerequisites: ['nested create', 'unique constraints'],
    tags: ['prisma', 'relations', 'connect', 'upsert', 'nested'],
    problemHtml: `<p><code>create</code> is the wrong nested operation when the related row already exists — it would insert a duplicate user or a second <code>Databases</code> category. <code>connect</code> links to an existing row by any unique field, and <code>connectOrCreate</code> links if the row exists and inserts it otherwise, in one round trip and without a read-then-branch race between two concurrent callers.</p>
<p>Against the reference dataset (categories <code>Databases</code>, <code>ORM</code>, <code>Frontend</code> already exist), create one post in a single call:</p>
<ul>
<li>Title <code>Indexing Deep Dive</code>, published, 60 views.</li>
<li>Link its author to the <strong>existing</strong> user <code>ann@x.io</code> with <code>connect</code> on the unique <code>email</code> — not on the id, which you should not have to know.</li>
<li>Link its categories with <code>connectOrCreate</code> for <code>Databases</code> (exists — must be reused) and <code>Performance</code> (missing — must be created), both matched on the unique <code>name</code>.</li>
<li>Return author and categories with <code>include</code>, ordering categories by <code>name</code> ascending.</li>
</ul>
<p>Log <code>title authorName</code>, then the category names joined by a comma and a space, then <code>categories N</code> where <code>N</code> is the total number of category rows in the database afterwards.</p>`,
    inputSpec: 'The reference dataset is seeded, including exactly three categories: Databases, ORM, Frontend.',
    outputSpec: 'The post with author Ann, its two categories in alphabetical order, and a total category count of 4 — three seeded plus the one Performance row that connectOrCreate had to insert.',
    constraints: 'One post.create call. Use connect on email for the author and connectOrCreate on name for both categories. Do not query for the user id first, and do not create the Databases category a second time.',
    examplesJson: [
      { input: 'author: { connect: { email: "ann@x.io" } }', output: 'Indexing Deep Dive Ann', explanation: 'connect accepts any unique field, so the id never has to be fetched.' },
      { input: 'categories: { connectOrCreate: [{ where: { name: "Databases" }, create: { name: "Databases" } }, { where: { name: "Performance" }, create: { name: "Performance" } }] }', output: 'Databases, Performance', explanation: 'Databases is reused because a row with that name exists; Performance is inserted.' },
      { input: 'category.count() afterwards', output: 'categories 4', explanation: 'Only one new row was created — connectOrCreate did not duplicate Databases.' },
    ],
    hintsJson: [
      'Use create only for rows that do not exist yet; use connect for rows that do.',
      'connect matches on any unique field — email and name are both @unique here.',
      'connectOrCreate takes { where, create }: the lookup, then the fallback insert.',
      'Count categories at the end with prisma.category.count() to prove nothing was duplicated.',
    ],
    solution: wrap(`  const post = await prisma.post.create({
    data: {
      title: "Indexing Deep Dive",
      published: true,
      views: 60,
      author: { connect: { email: "ann@x.io" } },
      categories: { connectOrCreate: [
        { where: { name: "Databases" }, create: { name: "Databases" } },
        { where: { name: "Performance" }, create: { name: "Performance" } },
      ]},
    },
    include: { author: true, categories: { orderBy: { name: "asc" } } },
  });
  console.log(post.title, post.author.name);
  console.log(post.categories.map((c) => c.name).join(", "));
  console.log("categories", await prisma.category.count());`),
    solutionExplanationHtml: `<p>The three nested write operations divide cleanly by what you know about the target row. <code>create</code> inserts a row that does not exist. <code>connect</code> links a row that does, matched by <strong>any unique field</strong> — here <code>email</code> for the user and <code>name</code> for the category — which is why the id never has to be looked up first. <code>connectOrCreate</code> handles the case you cannot know in advance: it takes <code>{ where, create }</code>, tries the lookup, and inserts only on a miss.</p>
<p>The count proves the point: three categories were seeded, the write touched two of them, and the total lands at four rather than five, because <code>Databases</code> was reused instead of duplicated. Reaching for <code>create</code> there would have thrown on the unique constraint on <code>name</code>; dropping the constraint to make it pass would leave two categories that mean the same thing — the classic way tag tables rot.</p>
<p>Doing the check inside the database also removes a race. The hand-rolled alternative — <code>findUnique</code>, then branch to <code>create</code> or link — has a window where a concurrent request inserts the same name between your read and your write, and one of the two requests fails. <code>connectOrCreate</code> collapses that into a single statement inside the write's implicit transaction. It is not magic, though: it still depends on the unique constraint being there, so <code>@unique</code> on <code>Category.name</code> is what makes the operation safe.</p>`,
    seed: SEED,
    expect: `Indexing Deep Dive Ann\nDatabases, Performance\ncategories 4`,
  },
  {
    title: 'Update a Parent and Its Children in a Single Call',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['nested update', 'nested updateMany', 'to-one update', 'filtered child update', 'atomic multi-row write'],
    prerequisites: ['update', 'nested create', 'where filters'],
    tags: ['prisma', 'relations', 'update', 'nested', 'write'],
    problemHtml: `<p>Nested writes are not limited to <code>create</code>. Inside <code>update</code> a relation field accepts <code>update</code> (edit the single related row of a to-one relation), <code>updateMany</code> (edit the subset of a to-many relation that matches a filter), and their delete counterparts. The whole call is one transaction, so a parent edit and its child edits either all land or none do.</p>
<p>In one <code>prisma.user.update</code> call targeting <code>ann@x.io</code>:</p>
<ul>
<li>Set the user's <code>name</code> to <code>Ann R.</code>.</li>
<li>Through the to-one <code>profile</code> relation, <code>update</code> the bio to <code>Staff engineer</code>. A to-one <code>update</code> takes the new <code>data</code> directly — no <code>where</code>, because there is only one row.</li>
<li>Through the to-many <code>posts</code> relation, <code>updateMany</code> every post of hers that is still <code>published: false</code>, setting <code>published: true</code> and <code>views: 5</code>. A to-many <code>updateMany</code> requires <code>{ where, data }</code>.</li>
<li>Return <code>profile</code> and <code>posts</code> ordered by <code>title</code> ascending with <code>include</code>.</li>
</ul>
<p>Log <code>name bio</code>, then one line per post as <code>title published views</code>. Bob's unpublished posts must not be touched — verify by logging <code>otherDrafts N</code>, the number of unpublished posts left in the whole table.</p>`,
    inputSpec: 'The reference dataset is seeded. Ann has three posts, one of them the unpublished "Draft on Prisma" with 0 views. Bob has two, both published.',
    outputSpec: 'The renamed user with her new bio, her three posts in alphabetical order all published — the former draft now showing 5 views — and a remaining unpublished count of 0 across the table.',
    constraints: 'Exactly one prisma.user.update call for the writes. Do not update the profile or the posts through their own top-level models.',
    examplesJson: [
      { input: 'profile: { update: { bio: "Staff engineer" } }', output: 'Ann R. Staff engineer', explanation: 'A to-one nested update needs no where clause — the relation already identifies the row.' },
      { input: 'posts: { updateMany: { where: { published: false }, data: { published: true, views: 5 } } }', output: 'Draft on Prisma true 5', explanation: 'The filter is scoped to Ann’s posts, so only her draft is published.' },
      { input: 'post.count({ where: { published: false } })', output: 'otherDrafts 0', explanation: 'Ann had the only unpublished post in the seed, and it has just been published.' },
    ],
    hintsJson: [
      'Inside update, a relation field takes update, updateMany, delete, deleteMany, connect, or disconnect.',
      'To-one update takes data directly; to-many updateMany takes { where, data }.',
      'The nested where is already scoped to this parent’s children — do not re-filter by authorId.',
      'Add include to the same call to read the new state back without a second query.',
    ],
    solution: wrap(`  const ann = await prisma.user.update({
    where: { email: "ann@x.io" },
    data: {
      name: "Ann R.",
      profile: { update: { bio: "Staff engineer" } },
      posts: { updateMany: { where: { published: false }, data: { published: true, views: 5 } } },
    },
    include: { profile: true, posts: { orderBy: { title: "asc" } } },
  });
  console.log(ann.name, ann.profile ? ann.profile.bio : "none");
  for (const p of ann.posts) console.log(p.title, p.published, p.views);
  console.log("otherDrafts", await prisma.post.count({ where: { published: false } }));`),
    solutionExplanationHtml: `<p>The two nested operations differ because the relations differ. <code>profile</code> is to-one, so <code>update</code> takes <code>data</code> directly — the relation itself identifies the row and a <code>where</code> would be meaningless. <code>posts</code> is to-many, so <code>updateMany</code> takes <code>{ where, data }</code>: the <code>where</code> chooses which children to touch. Swapping the two shapes is the most common error, and the generated types reject it immediately.</p>
<p>The important guarantee is the implicit scoping. The nested <code>where: { published: false }</code> is evaluated <em>within Ann's posts</em>, not across the table, so writing <code>authorId</code> into it is redundant — and doing the same thing through <code>prisma.post.updateMany</code> at the top level would have silently published every draft in the database. Scoping by relation instead of by foreign key is what makes the operation safe when more data arrives later.</p>
<p>Atomicity matters here too: the rename, the bio edit, and the multi-row publish share one transaction, so a failure in any of them leaves the user exactly as before. The final count confirms the blast radius — zero unpublished posts remain only because Ann's draft was the sole one seeded; if Bob had drafts they would still be there, which is precisely the check that catches an accidentally unscoped write.</p>`,
    diagramMermaid: `flowchart TD
  A[user update where email] --> B[scalar name]
  A --> C[profile update to-one takes data only]
  A --> D[posts updateMany to-many takes where and data]
  D --> E[filter applies only within this user posts]
  A --> F[one implicit transaction]`,
    seed: SEED,
    expect: `Ann R. Staff engineer\nDraft on Prisma true 5\nIntro to SQL true 100\nPrisma Basics true 250\notherDrafts 0`,
  },
  {
    title: 'Filter Parents by Their Relations with some, every, none, and is',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['relation filters', 'some', 'every', 'none', 'is and isNot', 'vacuous truth'],
    prerequisites: ['where filters', 'include'],
    tags: ['prisma', 'relations', 'filter', 'query', 'where'],
    problemHtml: `<p>Relation filters answer questions about a parent using its children without a join written by hand or a second query. On a to-many relation, <code>some</code> means at least one child matches, <code>every</code> means all children match, and <code>none</code> means no child matches. On a to-one relation the operators are <code>is</code> and <code>isNot</code>, which also accept <code>null</code> to test for absence.</p>
<p>Against the reference dataset, run four queries and log each result, names ordered by <code>name</code> ascending and joined by a comma and a space:</p>
<ul>
<li><code>some</code>: users with at least one post that is published with <code>views</code> of at least 150. Print <code>some: ...</code>.</li>
<li><code>every</code>: users whose posts are <strong>all</strong> published. Print <code>every: ...</code>. Read the result carefully before assuming it is wrong.</li>
<li><code>none</code>: users with no posts at all. Print <code>none: ...</code>.</li>
<li><code>is</code>: users whose <code>profile</code> bio contains <code>engineer</code> case-insensitively. Print <code>is: ...</code>. Then count users with no profile row using <code>profile: { is: null }</code> and print <code>noProfile N</code>.</li>
</ul>
<p>The scaffold gives the async skeleton. Each query must be a single <code>findMany</code> or <code>count</code>; do not fetch users and filter in JavaScript.</p>`,
    inputSpec: 'The reference dataset: Ann (3 posts, one unpublished, bio "Backend engineer"), Bob (2 posts, both published, bio "Frontend developer"), Cy (no posts, no profile).',
    outputSpec: 'some returns Ann and Bob; every returns Bob and Cy because a user with no posts satisfies every vacuously; none returns Cy; is returns Ann only, and the count of users without a profile is 1.',
    constraints: 'Use relation filters inside where. No JavaScript-side filtering, and no manual joins through authorId.',
    examplesJson: [
      { input: 'where: { posts: { some: { published: true, views: { gte: 150 } } } }', output: 'some: Ann, Bob', explanation: 'Ann has Prisma Basics at 250 and Bob has React Hooks at 150 — gte includes the boundary.' },
      { input: 'where: { posts: { every: { published: true } } }', output: 'every: Bob, Cy', explanation: 'Cy has no posts, and "all zero posts are published" is vacuously true — the classic every trap.' },
      { input: 'where: { profile: { is: { bio: { contains: "engineer", mode: "insensitive" } } } }', output: 'is: Ann', explanation: 'Only Ann’s bio contains engineer; Bob is a "developer" and Cy has no profile row to match.' },
    ],
    hintsJson: [
      'To-many relations take some, every, and none inside where; to-one relations take is and isNot.',
      'every is vacuously true for a parent with zero children — that is standard set semantics, not a bug.',
      'Combine every with some when you want "all published AND has at least one post".',
      'profile: { is: null } finds parents whose to-one relation row is missing.',
    ],
    solution: wrap(`  const names = (rows: { name: string }[]) => rows.map((r) => r.name).join(", ");
  const some = await prisma.user.findMany({
    where: { posts: { some: { published: true, views: { gte: 150 } } } },
    orderBy: { name: "asc" },
  });
  console.log("some:", names(some));
  const every = await prisma.user.findMany({
    where: { posts: { every: { published: true } } },
    orderBy: { name: "asc" },
  });
  console.log("every:", names(every));
  const none = await prisma.user.findMany({
    where: { posts: { none: {} } },
    orderBy: { name: "asc" },
  });
  console.log("none:", names(none));
  const withBio = await prisma.user.findMany({
    where: { profile: { is: { bio: { contains: "engineer", mode: "insensitive" } } } },
    orderBy: { name: "asc" },
  });
  console.log("is:", names(withBio));
  console.log("noProfile", await prisma.user.count({ where: { profile: { is: null } } }));`),
    solutionExplanationHtml: `<p>Each operator translates to a correlated subquery, so the filtering happens in the database and the parent rows never leave it unless they match. <code>some</code> is an <code>EXISTS</code>; <code>none</code> is a <code>NOT EXISTS</code>, and an empty filter object <code>none: {}</code> means "no children at all". <code>every</code> is the one that surprises people: it compiles to "there is no child that fails the condition", which is <strong>vacuously true</strong> for a parent with zero children. That is why Cy — who has no posts — appears in the <code>every</code> result alongside Bob. It is correct set semantics, and it is a real bug source in production filters like "show me users whose invoices are all paid", which will happily include users who have never been invoiced.</p>
<p>The fix when you meant "all published and at least one post" is to combine the operators: <code>posts: { every: { published: true }, some: {} }</code>. Both live in the same relation object and are ANDed.</p>
<p>To-one relations use a different pair, <code>is</code> and <code>isNot</code>, because there is nothing to quantify over. They accept a nested filter — the <code>contains</code> with <code>mode: "insensitive"</code> here is a PostgreSQL-supported case-insensitive match — or <code>null</code> to test for the absence of the row, which is how the final count finds Cy. Writing any of this by hand as a join would also risk duplicate parent rows when several children match; relation filters never duplicate the parent.</p>`,
    seed: SEED,
    expect: `some: Ann, Bob\nevery: Bob, Cy\nnone: Cy\nis: Ann\nnoProfile 1`,
  },
  {
    title: 'Manage an Implicit Many-to-Many with connect, disconnect, and set',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['implicit many-to-many', 'join table managed by Prisma', 'disconnect', 'set', 'relation filter on m-n'],
    prerequisites: ['connect', 'relation filters'],
    tags: ['prisma', 'relations', 'many-to-many', 'update', 'nested'],
    problemHtml: `<p>Declaring <code>Post.categories Category[]</code> and <code>Category.posts Post[]</code> with no explicit foreign keys gives an <strong>implicit many-to-many</strong>: Prisma creates and maintains the join table itself, and you never insert into it directly. You manipulate the link set with <code>connect</code> (add a link), <code>disconnect</code> (remove one link, leaving both rows intact), and <code>set</code> (replace the entire link set with exactly the listed rows).</p>
<p>Against the reference dataset, in this order:</p>
<ul>
<li>List the titles of posts in category <code>Databases</code>, ordered by <code>title</code> ascending, using a relation filter on <code>categories</code>. Print <code>before: ...</code> comma-separated.</li>
<li>Update <code>Prisma Basics</code> to <code>disconnect</code> the category <code>ORM</code>.</li>
<li>Update <code>Redis Notes</code> to <code>set</code> its categories to exactly <code>[Frontend]</code>, replacing whatever was linked before.</li>
<li>List the <code>Databases</code> posts again the same way. Print <code>after: ...</code>.</li>
<li>Print <code>orm N</code> — the number of posts still linked to <code>ORM</code> — and <code>categories M</code>, the total category row count.</li>
</ul>
<p>Both updates must go through the relation, never through a join-table model, which the client does not expose for an implicit relation.</p>`,
    inputSpec: 'The reference dataset: Databases links Intro to SQL, Prisma Basics and Redis Notes; ORM links Prisma Basics; Frontend links React Hooks.',
    outputSpec: 'Three Databases posts before the changes and two after — Redis Notes left the set because set replaced its links — with zero posts still on ORM and the category count unchanged at 3.',
    constraints: 'Use disconnect for the single unlink and set for the replacement. Do not delete any Category or Post row, and do not query a join-table model.',
    examplesJson: [
      { input: 'where: { categories: { some: { name: "Databases" } } }', output: 'before: Intro to SQL, Prisma Basics, Redis Notes', explanation: 'A many-to-many is filtered with the same some operator as any other to-many relation.' },
      { input: 'update Prisma Basics with categories: { disconnect: [{ name: "ORM" }] }', output: 'orm 0', explanation: 'disconnect removes only the join row; the ORM category itself still exists.' },
      { input: 'update Redis Notes with categories: { set: [{ name: "Frontend" }] }', output: 'after: Intro to SQL, Prisma Basics', explanation: 'set replaces the whole link set, so the Databases link is dropped without naming it.' },
    ],
    hintsJson: [
      'An implicit many-to-many has no model of its own — go through the relation field on either side.',
      'disconnect names the links to remove; set names the links that should remain.',
      'set with an empty array clears every link, which is a fast way to reset a tag set.',
      'Removing a link never deletes the row on the other side — count categories at the end to confirm.',
    ],
    solution: wrap(`  const dbPosts = async () => (await prisma.post.findMany({
    where: { categories: { some: { name: "Databases" } } },
    orderBy: { title: "asc" },
    select: { title: true },
  })).map((p) => p.title).join(", ");
  console.log("before:", await dbPosts());
  await prisma.post.update({
    where: { title: "Prisma Basics" },
    data: { categories: { disconnect: [{ name: "ORM" }] } },
  });
  await prisma.post.update({
    where: { title: "Redis Notes" },
    data: { categories: { set: [{ name: "Frontend" }] } },
  });
  console.log("after:", await dbPosts());
  console.log("orm", await prisma.post.count({ where: { categories: { some: { name: "ORM" } } } }));
  console.log("categories", await prisma.category.count());`),
    solutionExplanationHtml: `<p>With an implicit many-to-many the join table exists in the database — Prisma names it <code>_CategoryToPost</code> — but it is deliberately absent from the generated client. There is nothing to insert into and no composite key to manage; the link set is edited only through the relation field, from whichever side is more convenient. That is the trade for the convenience: if the link ever needs its own columns, such as who added the tag and when, you must migrate to an explicit join model with two relations and a compound id.</p>
<p>The three operations differ in scope. <code>connect</code> and <code>disconnect</code> are incremental and name individual rows, so <code>disconnect: [{ name: "ORM" }]</code> removes exactly one join row and leaves both the post and the category untouched — the final count of three categories proves the ORM row survived with zero posts attached. <code>set</code> is declarative and absolute: it makes the link set equal to the array you pass, dropping every link you did not list. That is why <code>Redis Notes</code> silently leaves <code>Databases</code> without <code>Databases</code> appearing anywhere in the call, and why <code>set: []</code> clears all links at once.</p>
<p>The choice matters under concurrency. <code>set</code> is last-writer-wins over the whole set, so two requests each adding one tag with <code>set</code> will lose one of the additions, while two <code>connect</code> calls both survive. Reach for <code>set</code> when the client sends the complete desired list — a tag editor saving its state — and for <code>connect</code>/<code>disconnect</code> when it sends a delta.</p>`,
    diagramMermaid: `flowchart LR
  P[Post Prisma Basics] --- J[join table managed by Prisma]
  J --- D[Category Databases]
  J --- O[Category ORM]
  O -. disconnect removes only this link .-> J
  R[Post Redis Notes] --- S[set replaces the whole link set with Frontend]`,
    seed: SEED,
    expect: `before: Intro to SQL, Prisma Basics, Redis Notes\nafter: Intro to SQL, Prisma Basics\norm 0\ncategories 3`,
  },
  {
    title: 'Remove Children Two Ways: nested deleteMany and onDelete Cascade',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['nested deleteMany', 'referential actions', 'onDelete Cascade', 'delete order', 'foreign key violation'],
    prerequisites: ['nested update', 'relation filters'],
    tags: ['prisma', 'relations', 'delete', 'cascade', 'schema'],
    problemHtml: `<p>Deleting a parent that still has children is a foreign-key violation unless something removes the children first. Prisma offers two answers, and knowing which is in play is the difference between a clean delete and a runtime error. A <strong>nested <code>deleteMany</code></strong> deletes a filtered subset of children explicitly, in the same transaction as the parent update. A <strong>referential action</strong> declared in the schema — <code>onDelete: Cascade</code> on the child's relation — makes the database remove the children automatically when the parent goes.</p>
<p>In the reference schema every child relation is declared <code>onDelete: Cascade</code>. Against the seeded data:</p>
<ul>
<li>Print <code>start C P</code> — the total comment count and post count.</li>
<li>Through a single <code>prisma.post.update</code> on <code>Intro to SQL</code>, nested-<code>deleteMany</code> only the comments whose <code>body</code> equals <code>Thanks</code>. Print <code>afterNested C</code>, the new comment total.</li>
<li>Delete the post <code>Intro to SQL</code> itself with <code>prisma.post.delete</code> and print <code>afterCascade C P</code>. Its remaining comment must disappear without you naming it.</li>
<li>Delete the user <code>bob@x.io</code> and print <code>afterUser C P U</code> — comments, posts, users. Bob's own posts cascade away, and so do the comments he wrote on other people's posts.</li>
</ul>
<p>The scaffold gives the async skeleton; do not delete comments through the top-level comment model.</p>`,
    inputSpec: 'The reference dataset: 4 comments, 5 posts, 3 users. Intro to SQL has 2 comments; Bob wrote 2 of the 4 comments and owns 2 posts, one of which (React Hooks) carries Ann’s comment.',
    outputSpec: 'Counts drop step by step: 4 comments and 5 posts at the start, 3 comments after the nested deleteMany, 2 comments and 4 posts after the cascading post delete, and finally 0 comments, 2 posts and 2 users once Bob is removed.',
    constraints: 'Use a nested deleteMany inside post.update for the first removal. Do not call prisma.comment.deleteMany at the top level, and do not delete posts one by one before deleting Bob.',
    examplesJson: [
      { input: 'post.update({ where: { title: "Intro to SQL" }, data: { comments: { deleteMany: { body: "Thanks" } } } })', output: 'afterNested 3', explanation: 'The nested filter is scoped to this post’s comments, so only its "Thanks" comment goes.' },
      { input: 'post.delete({ where: { title: "Intro to SQL" } })', output: 'afterCascade 2 4', explanation: 'The post’s last comment is removed by onDelete: Cascade, not by your code.' },
      { input: 'user.delete({ where: { email: "bob@x.io" } })', output: 'afterUser 0 2 2', explanation: 'Bob’s two posts cascade, React Hooks takes Ann’s comment with it, and Bob’s own comment on Prisma Basics cascades through the author relation.' },
    ],
    hintsJson: [
      'Inside update, a to-many relation accepts deleteMany with a plain filter object.',
      'The nested filter is already scoped to the parent — no postId is needed.',
      'Cascade is declared in the schema, so a plain delete of the parent is enough.',
      'Comments hang off two cascading parents, post and author — deleting either removes them.',
    ],
    solution: wrap(`  const counts = async () => [await prisma.comment.count(), await prisma.post.count(), await prisma.user.count()];
  let [c, p] = await counts();
  console.log("start", c, p);
  await prisma.post.update({
    where: { title: "Intro to SQL" },
    data: { comments: { deleteMany: { body: "Thanks" } } },
  });
  [c] = await counts();
  console.log("afterNested", c);
  await prisma.post.delete({ where: { title: "Intro to SQL" } });
  [c, p] = await counts();
  console.log("afterCascade", c, p);
  await prisma.user.delete({ where: { email: "bob@x.io" } });
  const [c2, p2, u2] = await counts();
  console.log("afterUser", c2, p2, u2);`),
    solutionExplanationHtml: `<p>The two mechanisms sit at different layers. A nested <code>deleteMany</code> is <em>your</em> instruction, expressed in the query and scoped to the parent: <code>comments: { deleteMany: { body: "Thanks" } }</code> deletes only that post's matching comments, in the same transaction as the update, and no <code>postId</code> appears because the relation already supplies it. Running the equivalent through the top-level <code>prisma.comment.deleteMany</code> would have deleted every comment with that body across the whole table.</p>
<p><code>onDelete: Cascade</code> is a <strong>schema-level referential action</strong>, emitted into the foreign key by the migration, so the database enforces it whether the delete comes from Prisma, psql, or a script. That is why <code>post.delete</code> succeeds even though a comment still points at the post. Without the action the default for a required relation is <code>Restrict</code>, and the same call would fail with a foreign key violation — the error most people hit first and then work around by deleting children by hand.</p>
<p>Deleting Bob shows cascades composing, and it is where the counts get interesting. His two posts cascade away; <code>React Hooks</code> takes Ann's comment with it through the <em>post</em> relation; and his own comment on Ann's <code>Prisma Basics</code> cascades through the <em>author</em> relation, even though that post survives. A comment hangs off two cascading parents, so losing either one removes it. That reach is exactly why cascades deserve deliberate thought per relation: convenient for owned data such as comments, dangerous for shared or audit data, where <code>SetNull</code> or <code>Restrict</code> is the honest choice.</p>`,
    diagramMermaid: `erDiagram
  USER ||--o{ POST : authors
  USER ||--o| PROFILE : has
  USER ||--o{ COMMENT : writes
  POST ||--o{ COMMENT : receives`,
    seed: SEED,
    expect: `start 4 5\nafterNested 3\nafterCascade 2 4\nafterUser 0 2 2`,
  },
  {
    title: 'Report Relation Counts with _count and Shape Nested Reads',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['_count select', 'filtered relation count', 'nested take and orderBy', 'avoiding overfetching', 'aggregate in one query'],
    prerequisites: ['include', 'relation filters'],
    tags: ['prisma', 'relations', 'count', 'aggregate', 'query'],
    problemHtml: `<p>"How many posts does each user have?" does not require loading the posts. <code>_count</code> is a virtual field available inside <code>select</code> or <code>include</code>: <code>_count: { select: { posts: true, comments: true } }</code> returns the numbers as part of the same query, with none of the rows. It also accepts a <code>where</code> per relation, so a filtered count such as "published posts only" stays in the database instead of turning into a <code>.filter().length</code> over data you had to fetch.</p>
<p>Against the reference dataset, produce two reports:</p>
<ul>
<li>For every user ordered by <code>name</code> ascending, log <code>name posts comments topPost</code>, where <code>posts</code> counts <strong>published</strong> posts only, <code>comments</code> counts every comment the user wrote, and <code>topPost</code> is the title of that user's highest-<code>views</code> post — loaded by including <code>posts</code> with <code>orderBy views desc</code> and <code>take 1</code>. Print <code>none</code> when the user has no posts.</li>
<li>For every post ordered by <code>title</code> ascending that has at least one comment, log <code>title commentCount</code> using a <code>_count</code> select on <code>comments</code>.</li>
</ul>
<p>Both reports must be one query each. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: Ann has 3 posts (2 published, top by views is Prisma Basics at 250) and wrote 1 comment; Bob has 2 published posts (top React Hooks at 150) and wrote 2; Cy has none and wrote 1.',
    outputSpec: 'Three user lines with published-post counts of 2, 2 and 0, comment counts of 1, 2 and 1, and top posts Prisma Basics, React Hooks and none — then three post lines with comment counts of 2, 1 and 1.',
    constraints: 'Exactly two queries. Do not load posts to count them in JavaScript, and do not run a separate count query per user.',
    examplesJson: [
      { input: '_count: { select: { posts: { where: { published: true } }, comments: true } }', output: 'Ann 2 1', explanation: 'Ann has three posts but only two published; the filter lives inside the count, not outside it.' },
      { input: 'include: { posts: { orderBy: { views: "desc" }, take: 1 } }', output: 'topPost Prisma Basics', explanation: 'A nested take with an orderBy returns the single best child per parent in the same query.' },
      { input: 'post.findMany({ where: { comments: { some: {} } }, select: { title: true, _count: { select: { comments: true } } } })', output: 'Intro to SQL 2', explanation: 'The relation filter keeps commentless posts out, and _count reports the rest without loading a comment.' },
    ],
    hintsJson: [
      '_count goes inside select or include and is itself an object with its own select.',
      'Each relation inside _count may take a where for a filtered count.',
      'Nested orderBy plus take: 1 gives the top child per parent without a second query.',
      'A user with no posts still returns an empty array — guard before reading [0].',
    ],
    solution: wrap(`  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: { where: { published: true } }, comments: true } },
      posts: { orderBy: { views: "desc" }, take: 1, select: { title: true } },
    },
  });
  for (const u of users) {
    console.log(u.name, u._count.posts, u._count.comments, u.posts.length > 0 ? u.posts[0].title : "none");
  }
  const posts = await prisma.post.findMany({
    where: { comments: { some: {} } },
    orderBy: { title: "asc" },
    select: { title: true, _count: { select: { comments: true } } },
  });
  for (const p of posts) console.log(p.title, p._count.comments);`),
    solutionExplanationHtml: `<p><code>_count</code> is a virtual field the client generates from your relations, so it is fully typed: <code>u._count.posts</code> exists only because <code>posts</code> was listed in its <code>select</code>. Prisma resolves it as an aggregate in the database, which means the rows are never transferred. The alternative most people write — <code>include: { posts: true }</code> then <code>u.posts.length</code> — pulls every post over the wire to compute one integer, and that cost scales with the data rather than with the answer.</p>
<p>The filtered count is the part worth remembering. Putting <code>where</code> <em>inside</em> the counted relation gives "published posts only" while leaving the rest of the query untouched. Putting the same filter at the top level would instead have dropped users, changing which rows appear rather than what is counted — a subtle difference that quietly turns a report into a different report. Cy shows the safe edge case: no posts means a count of <code>0</code>, never <code>null</code> and never a missing key.</p>
<p>The nested <code>orderBy</code> with <code>take: 1</code> is the second idiom: it returns each parent's top child in the same round trip, which is how "latest order per customer" or "best-performing post per author" is normally expressed. The result is still an array — <code>take</code> limits it, it does not unwrap it — so <code>u.posts[0]</code> needs the length guard that Cy would otherwise break, and the guard is what makes the code total rather than merely lucky on this dataset.</p>`,
    seed: SEED,
    expect: `Ann 2 1 Prisma Basics\nBob 2 2 React Hooks\nCy 0 1 none\nIntro to SQL 2\nPrisma Basics 1\nReact Hooks 1`,
  },
  {
    title: 'Traverse Relations with the Fluent API Instead of include',
    difficulty: 'HARD', estimatedMinutes: 45, points: 25,
    concepts: ['fluent API traversal', 'chained relation accessor', 'query count trade-off', 'null propagation', 'filtering a traversal'],
    prerequisites: ['include', 'findUnique', 'relation filters'],
    tags: ['prisma', 'relations', 'fluent-api', 'query', 'traversal'],
    problemHtml: `<p><code>findUnique</code> returns a thenable that also exposes the record's relations as methods: <code>prisma.user.findUnique({ where }).posts()</code> resolves to the posts alone, without the user wrapped around them. This <strong>fluent API</strong> is the right tool when you only want the children — the parent's columns never cross the wire and no unwrapping code is needed. The trade is that each traversal is a separate database query, whereas <code>include</code> fetches parent and children together.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Use the fluent API from <code>ann@x.io</code> to fetch her <strong>published</strong> posts ordered by <code>views</code> descending, and log <code>fluent:</code> followed by the titles comma-separated. Pass the filter and the ordering as arguments to the traversal method.</li>
<li>Fetch the same user with <code>include</code> using the identical nested filter and ordering, and log <code>include:</code> followed by the titles. The two lines must match exactly.</li>
<li>Traverse from the post <code>React Hooks</code> to its author and then log <code>author Bob</code> style output as <code>author name</code>.</li>
<li>Show the null behaviour: traverse to <code>.profile()</code> from <code>cy@x.io</code>, who has none, and log <code>cyProfile null</code>. Then traverse from a user that does not exist, <code>ghost@x.io</code>, to <code>.posts()</code> and log <code>ghostPosts</code> followed by the raw result.</li>
</ul>
<p>The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset. Ann has two published posts (Prisma Basics 250, Intro to SQL 100) and one draft; Cy exists but has no profile; ghost@x.io does not exist.',
    outputSpec: 'The fluent and include lines both read "Prisma Basics, Intro to SQL"; the author traversal prints Bob; the missing profile prints null; and traversing from a non-existent user prints null rather than an empty array or an error.',
    constraints: 'The first query must use the fluent traversal, not include. Do not use findFirst for the traversal roots — findUnique is what exposes the relation methods.',
    examplesJson: [
      { input: 'prisma.user.findUnique({ where: { email: "ann@x.io" } }).posts({ where: { published: true }, orderBy: { views: "desc" } })', output: 'fluent: Prisma Basics, Intro to SQL', explanation: 'The traversal returns the posts only; the filter and ordering are arguments to the relation method.' },
      { input: 'prisma.post.findUnique({ where: { title: "React Hooks" } }).author()', output: 'author Bob', explanation: 'Traversing a to-one relation yields the single related record.' },
      { input: 'prisma.user.findUnique({ where: { email: "ghost@x.io" } }).posts()', output: 'ghostPosts null', explanation: 'When the root record is missing the traversal short-circuits to null — not to an empty array.' },
    ],
    hintsJson: [
      'The relation methods hang off the findUnique call itself — do not await it first.',
      'Relation methods accept the same options object as a normal query: where, orderBy, take.',
      'A missing root makes the whole chain resolve to null, so the result type is nullable.',
      'Count your queries: a fluent traversal is one query per hop, include is one per relation level.',
    ],
    solution: wrap(`  const fluent = await prisma.user
    .findUnique({ where: { email: "ann@x.io" } })
    .posts({ where: { published: true }, orderBy: { views: "desc" } });
  console.log("fluent:", (fluent ?? []).map((p) => p.title).join(", "));
  const withInclude = await prisma.user.findUnique({
    where: { email: "ann@x.io" },
    include: { posts: { where: { published: true }, orderBy: { views: "desc" } } },
  });
  console.log("include:", (withInclude ? withInclude.posts : []).map((p) => p.title).join(", "));
  const author = await prisma.post.findUnique({ where: { title: "React Hooks" } }).author();
  console.log("author", author ? author.name : "none");
  const cyProfile = await prisma.user.findUnique({ where: { email: "cy@x.io" } }).profile();
  console.log("cyProfile", cyProfile);
  const ghostPosts = await prisma.user.findUnique({ where: { email: "ghost@x.io" } }).posts();
  console.log("ghostPosts", ghostPosts);`),
    solutionExplanationHtml: `<p>The fluent API works because <code>findUnique</code> returns a custom thenable rather than a plain promise. Awaiting it gives the record; calling <code>.posts()</code> on it instead builds a <em>new</em> query for the children and never sends the parent's columns back. The consequence people miss is that the chain must stay unawaited — <code>const u = await prisma.user.findUnique(...)</code> followed by <code>u.posts()</code> does not exist, because <code>u</code> is by then an ordinary object with no relation methods.</p>
<p>Relation methods accept the same options as any query, so <code>{ where, orderBy, take }</code> works exactly as in the <code>include</code> version — which is why the two lines print identically here. Choose between them by what you need: <code>include</code> is one query for parent and children together, so it wins when you want both; the traversal costs one query per hop but transfers only the children, which wins for "just give me this user's orders". Chaining several hops multiplies the queries, and that is when <code>include</code> nesting is the better tool.</p>
<p>The null behaviour is the sharpest edge. When the root record does not exist the whole chain resolves to <code>null</code>, <strong>not</strong> to an empty array — so <code>ghostPosts</code> prints <code>null</code> and calling <code>.map</code> on it would throw. TypeScript models this honestly by typing the traversal as <code>Post[] | null</code>, which is why the solution coalesces with <code>?? []</code>. Cy's <code>.profile()</code> is the ordinary to-one miss and also yields <code>null</code>, so both a missing root and a missing target collapse to the same value and one guard covers both.</p>`,
    diagramMermaid: `flowchart TD
  A[findUnique returns a thenable] -->|await it| B[the user record]
  A -->|call posts on it| C[second query for children only]
  C --> D[options where orderBy take apply here]
  A -->|root missing| E[chain resolves to null not empty array]`,
    seed: SEED,
    expect: `fluent: Prisma Basics, Intro to SQL\ninclude: Prisma Basics, Intro to SQL\nauthor Bob\ncyProfile null\nghostPosts null`,
  },
  {
    title: 'Capstone: Publish a Post with Nested Writes Inside a Transaction',
    difficulty: 'HARD', estimatedMinutes: 60, points: 30,
    concepts: ['interactive transaction', 'nested create with connectOrCreate', 'upsert', 'rollback on failure', 'reporting with _count'],
    prerequisites: ['nested writes', 'connectOrCreate', 'relation filters', '_count'],
    tags: ['prisma', 'relations', 'transaction', 'capstone', 'nested'],
    problemHtml: `<p>A real publishing endpoint does several dependent writes and must not leave the data half-updated. <code>prisma.$transaction(async (tx) => { ... })</code> opens an <strong>interactive transaction</strong>: every call made on <code>tx</code> shares one transaction, so a throw anywhere rolls all of it back. Inside it you can still use nested writes, which keeps the number of round trips low.</p>
<p>Write a function <code>publish</code> that takes an author email, a title, a list of category names, and a bio, and inside a single interactive transaction:</p>
<ul>
<li><code>upsert</code> the author's profile by <code>userId</code> — update the bio if a profile exists, create it with that bio if not.</li>
<li>Create the post with <code>author: { connect: { email } }</code>, <code>published: true</code>, <code>views: 0</code>, and <code>categories: { connectOrCreate: [...] }</code> for every supplied name.</li>
<li>Create one comment on the new post authored by <code>cy@x.io</code>, using a nested write from the post creation or a follow-up <code>tx.comment.create</code>.</li>
<li>Return the created post id.</li>
</ul>
<p>Call <code>publish</code> once for <code>bob@x.io</code> with title <code>Sharding 101</code>, categories <code>["Databases", "Scaling"]</code>, bio <code>Platform engineer</code>, and log <code>ok</code> followed by the post title, the author's bio, and its category names ordered ascending. Then call it again with the <strong>same title</strong>, catch the error, and log <code>rolledback</code> followed by the total post count and category count — the failed attempt must add nothing, not even the new category it tried to create.</p>`,
    inputSpec: 'The reference dataset. Bob has a profile with bio "Frontend developer"; categories Databases, ORM and Frontend exist; the title Sharding 101 is free on the first call and taken on the second.',
    outputSpec: 'The first call publishes the post, rewrites Bob’s bio, reuses Databases and creates Scaling; the second call violates the unique title, is caught, and leaves the post count at 6 and the category count at 4 — the second Duplicates category is never committed.',
    constraints: 'One interactive $transaction per publish call, and every write inside it must go through tx. Catch only the second call’s error; do not pre-check whether the title exists.',
    examplesJson: [
      { input: 'publish("bob@x.io", "Sharding 101", ["Databases", "Scaling"], "Platform engineer")', output: 'ok Sharding 101 Platform engineer Databases, Scaling', explanation: 'The upsert rewrites the existing profile, connectOrCreate reuses Databases and inserts Scaling.' },
      { input: 'publish("bob@x.io", "Sharding 101", ["Duplicates"], "Ignored bio")', output: 'rolledback 6 4', explanation: 'The unique title throws inside the transaction, so the profile edit, the post and the Duplicates category are all rolled back.' },
    ],
    hintsJson: [
      'Interactive transactions take an async callback and give you a tx client — use tx for every write.',
      'upsert needs a unique where: Profile.userId is @unique, so { userId } identifies the row.',
      'Map the category names into the connectOrCreate array with { where: { name }, create: { name } }.',
      'Let the unique constraint on title do the failing; wrap only the second call in try/catch and count afterwards.',
    ],
    solution: wrap(`  async function publish(email: string, title: string, categories: string[], bio: string) {
    return prisma.$transaction(async (tx) => {
      const author = await tx.user.findUniqueOrThrow({ where: { email } });
      await tx.profile.upsert({
        where: { userId: author.id },
        update: { bio },
        create: { bio, userId: author.id },
      });
      const post = await tx.post.create({
        data: {
          title,
          published: true,
          views: 0,
          author: { connect: { email } },
          categories: { connectOrCreate: categories.map((name) => ({ where: { name }, create: { name } })) },
        },
      });
      await tx.comment.create({ data: { body: "Congrats", postId: post.id, authorId: (await tx.user.findUniqueOrThrow({ where: { email: "cy@x.io" } })).id } });
      return post.id;
    });
  }

  const id = await publish("bob@x.io", "Sharding 101", ["Databases", "Scaling"], "Platform engineer");
  const created = await prisma.post.findUniqueOrThrow({
    where: { id },
    include: { author: { include: { profile: true } }, categories: { orderBy: { name: "asc" } } },
  });
  console.log("ok", created.title, created.author.profile ? created.author.profile.bio : "none", created.categories.map((c) => c.name).join(", "));

  try {
    await publish("bob@x.io", "Sharding 101", ["Duplicates"], "Ignored bio");
    console.log("unexpected success");
  } catch {
    console.log("rolledback", await prisma.post.count(), await prisma.category.count());
  }`),
    solutionExplanationHtml: `<p>An interactive transaction hands your callback a scoped client, and the rule is absolute: every write must go through <code>tx</code>. A stray <code>prisma.post.create</code> inside the callback runs on a different connection, outside the transaction, and survives the rollback — which is the single most common way this pattern is broken, and it fails silently rather than loudly.</p>
<p>The three writes are dependent, which is why they belong together. <code>upsert</code> needs a unique <code>where</code>, and <code>Profile.userId</code> is <code>@unique</code>, so it identifies the row while also expressing "one profile per user"; the operation collapses the read-then-branch that would otherwise race two concurrent publishes. <code>connectOrCreate</code> mapped over the supplied names reuses <code>Databases</code> and inserts <code>Scaling</code>, giving four categories after the first call. The comment is a plain create against the id the post creation just returned — available because the calls are sequential inside the callback.</p>
<p>The second call is the real assertion. The unique constraint on <code>title</code> throws from inside the transaction, and the rollback undoes everything: no post, Bob's bio unchanged, and — the detail that proves it — no <code>Duplicates</code> category, even though <code>connectOrCreate</code> had already inserted it before the failing statement. Counts of 6 and 4 confirm it. Note also that pre-checking with a <code>findUnique</code> would not have made this safer, only slower: between the check and the insert another request can take the title, so letting the constraint fail and handling the error is the correct pattern. Two practical caveats: interactive transactions hold a connection and default to a five-second timeout, so keep non-database work such as HTTP calls outside the callback, and prefer the array form <code>$transaction([...])</code> when the writes are independent.</p>`,
    diagramMermaid: `sequenceDiagram
  participant App
  participant Tx as Interactive transaction
  participant DB as Postgres
  App->>Tx: begin
  Tx->>DB: upsert profile bio
  Tx->>DB: create post with connectOrCreate categories
  Tx->>DB: create comment
  DB-->>Tx: unique title violation on second call
  Tx-->>App: throw and roll back every statement`,
    seed: SEED,
    expect: `ok Sharding 101 Platform engineer Databases, Scaling\nrolledback 6 4`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VDIR = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/prisma-433';
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
  fs.writeFileSync(path.join(VDIR, `ex${n}.ts`), e.solution);
  if (e.seed) fs.writeFileSync(path.join(VDIR, `ex${n}.seed.ts`), `${imp}\nasync function main(){\n${e.seed}\n}\nmain().finally(()=>prisma.$disconnect());`);
  if (e.expect) fs.writeFileSync(path.join(VDIR, `ex${n}.expect.txt`), `${e.expect}\n`);
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
