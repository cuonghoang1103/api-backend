// prisma-orm module 434 (typescript-integration-and-type-safety) — 10 client exercises.
// Verified by running with tsx AND type-checking with tsc --strict against a real Postgres.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'prisma-orm';
const moduleSlug = 'typescript-integration-and-type-safety';
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
enum Role {
  USER
  EDITOR
  ADMIN
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String
  age     Int?
  role    Role     @default(USER)
  profile Profile?
  posts   Post[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String   @unique
  published Boolean  @default(false)
  views     Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
`;
const imp = `import { PrismaClient, Prisma, Role } from './generated';\nconst prisma = new PrismaClient();\n`;
const wrap = (body) => `${imp}\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;
// Exercises that declare types or extensions at module scope need the code
// outside main(); this variant lets the exercise supply that preamble.
const wrapPre = (pre, body) => `${imp}\n${pre}\n\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;

const WIPE = `await prisma.post.deleteMany(); await prisma.profile.deleteMany(); await prisma.user.deleteMany();`;

// Reference dataset: 3 users across the three roles, 5 posts, 2 profiles.
const SEED = `${WIPE}
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", age: 30, role: "ADMIN", profile: { create: { bio: "Backend engineer" } } } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", age: 25, role: "EDITOR", profile: { create: { bio: "Frontend developer" } } } });
await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
await prisma.post.createMany({ data: [
  { title: "Intro to SQL",    published: true,  views: 100, authorId: ann.id },
  { title: "Prisma Basics",   published: true,  views: 250, authorId: ann.id },
  { title: "Draft on Prisma", published: false, views: 0,   authorId: ann.id },
  { title: "Redis Notes",     published: true,  views: 80,  authorId: bob.id },
  { title: "React Hooks",     published: true,  views: 150, authorId: bob.id },
]});`;

const ex = [
  {
    title: 'Use the Generated Model and Enum Types in Your Own Functions',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['generated model types', 'enum as value and type', 'nullable scalar fields', 'typing a helper function', 'import from the generated client'],
    prerequisites: ['findMany', 'TypeScript basics'],
    tags: ['prisma', 'typescript', 'types', 'enum', 'client'],
    problemHtml: `<p><code>prisma generate</code> writes a client that is specific to your schema, and that client exports a TypeScript type per model plus a value-and-type pair per enum. Importing <code>User</code> gives you the exact row shape — <code>age</code> is <code>number | null</code> because the schema says <code>Int?</code>, and <code>role</code> is the union <code>"USER" | "EDITOR" | "ADMIN"</code>. Hand-written interfaces duplicating those fields drift the moment the schema changes; the generated ones cannot.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Write a standalone function <code>describe(u: User): string</code> — annotated with the <strong>imported</strong> <code>User</code> type, not an inline shape — returning <code>name role age</code>, printing <code>?</code> when <code>age</code> is <code>null</code>.</li>
<li>Fetch all users ordered by <code>name</code> ascending and log <code>describe(u)</code> for each.</li>
<li>Use the enum as a <strong>value</strong>, not a string literal: count users with <code>role: Role.ADMIN</code> and log <code>admins N</code>.</li>
<li>Write <code>isPrivileged(role: Role): boolean</code> returning true for <code>ADMIN</code> and <code>EDITOR</code>, and log <code>privileged N</code> — the number of fetched users it accepts.</li>
</ul>
<p>The scaffold imports <code>PrismaClient</code>, <code>Prisma</code> and <code>Role</code> for you.</p>`,
    inputSpec: 'The reference dataset: Ann (ADMIN, 30), Bob (EDITOR, 25), Cy (USER, age null).',
    outputSpec: 'Three describe lines ordered by name, then the admin count of 1 and the privileged count of 2.',
    constraints: 'Annotate the helpers with the imported User and Role types. Do not redeclare the row shape by hand and do not compare role against a bare string.',
    examplesJson: [
      { input: 'describe(ann)', output: 'Ann ADMIN 30', explanation: 'The generated User type carries name, role and age with their schema-accurate types.' },
      { input: 'describe(cy)', output: 'Cy USER ?', explanation: 'age is Int? in the schema, so its TypeScript type is number | null and the null branch must be handled.' },
      { input: 'count({ where: { role: Role.ADMIN } })', output: 'admins 1', explanation: 'The enum is exported as a value too, so Role.ADMIN replaces the magic string "ADMIN".' },
    ],
    hintsJson: [
      'Import the model type by name from the generated client, exactly like PrismaClient.',
      'An optional scalar becomes number | null — not undefined — so use a null check.',
      'Enums come out as both a runtime object and a union type, so Role.ADMIN is valid in a where.',
      'Type the helper parameter as Role so a typo like "ADMIM" fails to compile.',
    ],
    solution: wrapPre(`import type { User } from './generated';

function describe(u: User): string {
  return \`\${u.name} \${u.role} \${u.age === null ? "?" : u.age}\`;
}

function isPrivileged(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}`, `  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  for (const u of users) console.log(describe(u));
  console.log("admins", await prisma.user.count({ where: { role: Role.ADMIN } }));
  console.log("privileged", users.filter((u) => isPrivileged(u.role)).length);`),
    solutionExplanationHtml: `<p>The generated client is not a generic library type — it is written from your schema, so <code>User</code> is exactly the row your database returns. Two details come straight from the schema and are the reason to import rather than redeclare. <code>age Int?</code> becomes <code>number | null</code>, so the <code>null</code> branch in <code>describe</code> is not defensive coding, it is the type demanding to be handled; note it is <code>null</code>, never <code>undefined</code>, because a missing column value is SQL <code>NULL</code>. And <code>role Role</code> becomes the union <code>"USER" | "EDITOR" | "ADMIN"</code>, so <code>isPrivileged</code> rejects any other string at compile time.</p>
<p>Enums are emitted twice over: as a runtime object (<code>Role.ADMIN</code> evaluates to the string <code>"ADMIN"</code>) and as a type of the same name. That is why <code>Role</code> works both in the <code>where</code> and in the parameter annotation. Using the constant instead of the literal means renaming a value in the schema turns every stale usage into a compile error rather than a query that silently matches nothing.</p>
<p>The type-import detail matters in a real project: <code>import type { User }</code> is erased at build time, so it never pulls the client into a bundle that only needs the shape. Keep in mind that <code>User</code> describes a <em>full</em> row — the moment a query uses <code>select</code> or <code>include</code>, its result no longer matches this type, which is what the rest of this module is about.</p>`,
    seed: SEED,
    expect: `Ann ADMIN 30\nBob EDITOR 25\nCy USER ?\nadmins 1\nprivileged 2`,
  },
  {
    title: 'Type Write Payloads with UserCreateInput and Its Unchecked Variant',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['CreateInput types', 'unchecked variants', 'relation vs foreign key', 'typed data objects', 'defaults and optional fields'],
    prerequisites: ['create', 'generated model types'],
    tags: ['prisma', 'typescript', 'types', 'create', 'input'],
    problemHtml: `<p>Every operation has a generated input type, so a write payload can be built and validated <strong>before</strong> it reaches the query. <code>Prisma.UserCreateInput</code> is the checked form: it exposes the relation field <code>posts</code> and refuses a raw <code>authorId</code>. <code>Prisma.PostUncheckedCreateInput</code> is the unchecked form: it exposes the foreign key <code>authorId</code> directly and hides the relation. Both exist because both styles are legitimate — the first when you are creating an aggregate, the second when you already hold the id.</p>
<p>Starting from an empty database (the scaffold wipes it):</p>
<ul>
<li>Declare <code>const payload: Prisma.UserCreateInput = { ... }</code> for a user with email <code>dee@x.io</code>, name <code>Dee</code>, role <code>EDITOR</code>, a nested <code>profile</code> create with bio <code>Data engineer</code>, and one nested post <code>Airflow Notes</code> published with 40 views. Leave <code>age</code> out entirely — it is optional.</li>
<li>Create the user from that variable and log <code>email role age</code>, printing <code>null</code> for the missing age.</li>
<li>Declare <code>const second: Prisma.PostUncheckedCreateInput = { ... }</code> for the post <code>DBT Models</code> using the new user's <code>authorId</code>, then create it and log <code>title published views</code>.</li>
<li>Log <code>posts N</code>, the number of posts belonging to that user.</li>
</ul>
<p>The scaffold imports the <code>Prisma</code> namespace for you.</p>`,
    inputSpec: 'An empty database — the scaffold deletes every row before your code runs.',
    outputSpec: 'The created user with role EDITOR and a null age, then the unchecked post unpublished with 0 views, then a post count of 2.',
    constraints: 'Both payloads must be declared as separate annotated variables, not inlined into the call. Do not put authorId in the checked input and do not put a relation in the unchecked one.',
    examplesJson: [
      { input: 'const payload: Prisma.UserCreateInput = { email: "dee@x.io", name: "Dee", role: "EDITOR", profile: { create: { bio: "Data engineer" } } }', output: 'dee@x.io EDITOR null', explanation: 'age is optional in the input type, and the column is nullable, so the row comes back with null.' },
      { input: 'const second: Prisma.PostUncheckedCreateInput = { title: "DBT Models", authorId: dee.id }', output: 'DBT Models false 0', explanation: 'The unchecked variant takes the foreign key directly; the omitted fields fall back to schema defaults.' },
    ],
    hintsJson: [
      'The input types live on the Prisma namespace: Prisma.UserCreateInput, Prisma.PostUncheckedCreateInput.',
      'Checked inputs expose relations; unchecked inputs expose the raw foreign key. Never both.',
      'Fields with a default or a ? in the schema are optional in the input type.',
      'Annotating the variable is what moves the error from the query call to the declaration.',
    ],
    solution: wrap(`  const payload: Prisma.UserCreateInput = {
    email: "dee@x.io",
    name: "Dee",
    role: "EDITOR",
    profile: { create: { bio: "Data engineer" } },
    posts: { create: [{ title: "Airflow Notes", published: true, views: 40 }] },
  };
  const dee = await prisma.user.create({ data: payload });
  console.log(dee.email, dee.role, dee.age);

  const second: Prisma.PostUncheckedCreateInput = {
    title: "DBT Models",
    authorId: dee.id,
  };
  const post = await prisma.post.create({ data: second });
  console.log(post.title, post.published, post.views);
  console.log("posts", await prisma.post.count({ where: { authorId: dee.id } }));`),
    solutionExplanationHtml: `<p>Annotating the variable rather than inlining the object changes where mistakes surface. An inline <code>data</code> object is checked at the call, and the resulting error points at the query with a long union in the message; an annotated <code>const</code> fails on the offending property itself, which is far easier to read. It also makes the payload reusable and testable on its own.</p>
<p>The checked and unchecked split reflects the two ways to express the same link. <code>Prisma.UserCreateInput</code> offers <code>posts</code> and <code>profile</code> as nested operations and has no <code>id</code>-bearing foreign keys; <code>Prisma.PostUncheckedCreateInput</code> offers <code>authorId: number</code> and no <code>author</code> relation. Mixing them — a relation and its own foreign key in one payload — is rejected precisely because the two could disagree. The generated <code>Prisma.PostCreateInput</code> that <code>data</code> normally accepts is a union of both, which is why passing either annotated variable compiles.</p>
<p>Optionality in the input types is derived from the schema, not guessed: a field is optional when it is nullable (<code>age Int?</code>) or has a <code>@default</code> (<code>published</code>, <code>views</code>). So omitting <code>age</code> yields <code>null</code> while omitting <code>published</code> yields <code>false</code> — same syntax at the call site, different origin for the value, and the reason the unchecked post prints <code>false 0</code> without either field being written.</p>`,
    seed: WIPE,
    expect: `dee@x.io EDITOR null\nDBT Models false 0\nposts 2`,
  },
  {
    title: 'Type a Query Result with UserGetPayload',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['GetPayload utility types', 'result type depends on include', 'typing a function return', 'partial results with select', 'no manual interfaces'],
    prerequisites: ['include', 'select', 'generated model types'],
    tags: ['prisma', 'typescript', 'types', 'payload', 'include'],
    problemHtml: `<p>The result type of a query is not the model type — it depends on the <code>select</code> and <code>include</code> you passed. A <code>findMany</code> with <code>include: { posts: true }</code> returns <code>User &amp; { posts: Post[] }</code>, and one with <code>select: { email: true }</code> returns <code>{ email: string }</code> and nothing else. To name those types — for a function signature, a helper, or an exported API contract — use <code>Prisma.UserGetPayload&lt;...&gt;</code>, which computes the exact result type from the same arguments object.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Define <code>type UserWithPosts = Prisma.UserGetPayload&lt;{ include: { posts: true } }&gt;</code>.</li>
<li>Write <code>summarise(u: UserWithPosts): string</code> returning <code>name postCount totalViews</code>, where <code>totalViews</code> sums <code>views</code> across the user's posts.</li>
<li>Fetch users ordered by <code>name</code> ascending with <code>include: { posts: true }</code> and log <code>summarise(u)</code> for each.</li>
<li>Define <code>type Slim = Prisma.UserGetPayload&lt;{ select: { email: true; role: true } }&gt;</code>, fetch the same users with that exact <code>select</code>, and log <code>email role</code> per user. The variable holding them must be annotated <code>Slim[]</code>.</li>
</ul>
<p>The scaffold imports the <code>Prisma</code> namespace. Do not write an interface describing the rows by hand.</p>`,
    inputSpec: 'The reference dataset: Ann has 3 posts totalling 350 views, Bob has 2 totalling 230, Cy has none.',
    outputSpec: 'Three summary lines with post counts 3, 2, 0 and view totals 350, 230, 0 — then three slim lines with just the email and role.',
    constraints: 'Types must be derived with GetPayload. No hand-written interfaces, and no any. The Slim query and the Slim type must use the identical select.',
    examplesJson: [
      { input: 'summarise(ann) where ann came from include: { posts: true }', output: 'Ann 3 350', explanation: '100 + 250 + 0 = 350; the posts array is on the type because the include is part of the payload argument.' },
      { input: 'summarise(cy)', output: 'Cy 0 0', explanation: 'A user with no posts still has an array, so the reduce starts and ends at 0.' },
      { input: 'const slim: Slim[] = await prisma.user.findMany({ select: { email: true, role: true } })', output: 'ann@x.io ADMIN', explanation: 'With select the result carries only the selected keys — u.name would not compile.' },
    ],
    hintsJson: [
      'GetPayload takes the same arguments object you would pass to the query.',
      'The include or select inside GetPayload must match the query exactly or the annotation will not fit.',
      'Sum the views with reduce over the typed posts array.',
      'With select, keys you did not select simply do not exist on the type — that is the point.',
    ],
    solution: wrapPre(`type UserWithPosts = Prisma.UserGetPayload<{ include: { posts: true } }>;
type Slim = Prisma.UserGetPayload<{ select: { email: true; role: true } }>;

function summarise(u: UserWithPosts): string {
  const totalViews = u.posts.reduce((sum, p) => sum + p.views, 0);
  return \`\${u.name} \${u.posts.length} \${totalViews}\`;
}`, `  const users = await prisma.user.findMany({ orderBy: { name: "asc" }, include: { posts: true } });
  for (const u of users) console.log(summarise(u));
  const slim: Slim[] = await prisma.user.findMany({ orderBy: { name: "asc" }, select: { email: true, role: true } });
  for (const s of slim) console.log(s.email, s.role);`),
    solutionExplanationHtml: `<p>Prisma's query methods are generic over their arguments, so the inferred result already reflects the <code>include</code> or <code>select</code> at every call site — inference alone is enough while the value stays local. What inference cannot do is give that type a <em>name</em>, and the moment a row is passed to a function, returned from a service, or exported as an API contract, a name is required. <code>Prisma.UserGetPayload&lt;A&gt;</code> is that name: it applies the same computation to an arguments object <code>A</code> that the query would.</p>
<p>The two directions show the whole idea. With <code>include</code> the payload is the full model plus the relation, so <code>u.posts</code> exists and <code>u.email</code> still does. With <code>select</code> the payload is <em>only</em> what was listed, so <code>Slim</code> has <code>email</code> and <code>role</code> and reading <code>s.name</code> is a compile error rather than an <code>undefined</code> at runtime — the type follows the wire format honestly.</p>
<p>The failure mode to watch for is drift between the type argument and the query. Annotating a variable <code>Slim[]</code> while querying a different <code>select</code> gives an error that reads like a puzzle, and the durable fix is exercise 4's approach: define the arguments object once with <code>Prisma.validator</code> and derive both the query and the type from it, so they cannot disagree. Also note the naming convention — <code>ModelGetPayload</code> exists for every model, and the equivalent for arguments themselves is <code>Prisma.UserFindManyArgs</code>.</p>`,
    seed: SEED,
    expect: `Ann 3 350\nBob 2 230\nCy 0 0\nann@x.io ADMIN\nbob@x.io EDITOR\ncy@x.io USER`,
  },
  {
    title: 'Define Query Arguments Once with Prisma.validator',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['Prisma.validator', 'single source of truth for args', 'typeof for the payload', 'reusable select objects', 'compile-time validation of args'],
    prerequisites: ['GetPayload', 'select', 'include'],
    tags: ['prisma', 'typescript', 'validator', 'types', 'reuse'],
    problemHtml: `<p>Writing the same <code>select</code> in three places and its <code>GetPayload</code> type in a fourth is how result types drift out of sync. <code>Prisma.validator</code> fixes the direction of truth: it type-checks an arguments object <strong>at its declaration</strong> and returns it unchanged, so you can define the arguments once, pass them to every query, and derive the result type from the same constant with <code>typeof</code>.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Declare <code>const authorCard = Prisma.validator&lt;Prisma.UserDefaultArgs&gt;()({ select: { name: true, role: true, posts: { select: { title: true }, orderBy: { views: "desc" } } } })</code>.</li>
<li>Derive <code>type AuthorCard = Prisma.UserGetPayload&lt;typeof authorCard&gt;</code>.</li>
<li>Write <code>render(a: AuthorCard): string</code> returning <code>name role topTitle</code>, where <code>topTitle</code> is the first post's title or <code>none</code>.</li>
<li>Use the same constant twice, spreading it into each query: a <code>findMany</code> ordered by <code>name</code> ascending, logging <code>render(a)</code> per user; and a <code>findUnique</code> for <code>bob@x.io</code>, logging <code>one</code> followed by <code>render</code> of the result.</li>
<li>Declare a second validated constant for a <strong>where</strong> clause — <code>Prisma.validator&lt;Prisma.UserWhereInput&gt;()({ role: { in: ["ADMIN", "EDITOR"] } })</code> — and log <code>staff N</code>, the count of users matching it.</li>
</ul>
<p>The scaffold imports the <code>Prisma</code> namespace.</p>`,
    inputSpec: 'The reference dataset. Bob’s highest-view post is React Hooks at 150; Ann’s is Prisma Basics at 250; Cy has no posts.',
    outputSpec: 'Three rendered cards ordered by name with top titles Prisma Basics, React Hooks and none, then the single lookup for Bob, then a staff count of 2.',
    constraints: 'The select must be written exactly once. Both queries must spread the validated constant, and the type must come from typeof — not from a repeated inline object.',
    examplesJson: [
      { input: 'prisma.user.findMany({ ...authorCard, orderBy: { name: "asc" } })', output: 'Ann ADMIN Prisma Basics', explanation: 'Spreading the constant applies the same select, and the nested orderBy puts the highest-view post first.' },
      { input: 'render on a user with no posts', output: 'Cy USER none', explanation: 'The nested select still returns an array, empty for Cy, so the fallback branch runs.' },
      { input: 'count({ where: staffOnly })', output: 'staff 2', explanation: 'A validated WhereInput constant is reusable across count, findMany and delete alike.' },
    ],
    hintsJson: [
      'Prisma.validator is called in two steps: the type argument first, then the object.',
      'Use Prisma.UserDefaultArgs for a select/include bundle and Prisma.UserWhereInput for a filter.',
      'Derive the payload with typeof so the type can never drift from the object.',
      'Spread the constant into the query and add orderBy alongside it.',
    ],
    solution: wrapPre(`const authorCard = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    name: true,
    role: true,
    posts: { select: { title: true }, orderBy: { views: "desc" } },
  },
});
type AuthorCard = Prisma.UserGetPayload<typeof authorCard>;

const staffOnly = Prisma.validator<Prisma.UserWhereInput>()({
  role: { in: ["ADMIN", "EDITOR"] },
});

function render(a: AuthorCard): string {
  return \`\${a.name} \${a.role} \${a.posts.length > 0 ? a.posts[0].title : "none"}\`;
}`, `  const cards = await prisma.user.findMany({ ...authorCard, orderBy: { name: "asc" } });
  for (const c of cards) console.log(render(c));
  const bob = await prisma.user.findUnique({ ...authorCard, where: { email: "bob@x.io" } });
  if (bob) console.log("one", render(bob));
  console.log("staff", await prisma.user.count({ where: staffOnly }));`),
    solutionExplanationHtml: `<p><code>Prisma.validator</code> is an identity function with a type argument: at runtime it returns the object untouched, and at compile time it checks the object against <code>Prisma.UserDefaultArgs</code> right where it is written. The curried call shape — the type parameter first, then the value — exists so TypeScript can infer the object's <em>literal</em> type instead of widening it. That literal type is what makes <code>Prisma.UserGetPayload&lt;typeof authorCard&gt;</code> resolve to the precise result rather than a generic user.</p>
<p>Compare it with a plain annotated constant. Writing <code>const authorCard: Prisma.UserDefaultArgs = {...}</code> also type-checks the object, but the annotation widens it, and <code>typeof authorCard</code> is then the broad argument type — <code>GetPayload</code> can no longer tell which fields you selected. Validator gives you both halves at once: validation at the declaration and a literal type to derive from.</p>
<p>The reuse is the real payoff. One constant feeds <code>findMany</code>, <code>findUnique</code> and the render function, so adding a field to the select updates every consumer and any function that assumed the old shape fails to compile immediately. The same trick works for filters through <code>Prisma.UserWhereInput</code>, which is how shared conditions such as "staff only" or "not soft-deleted" stay defined in one place. One caveat worth knowing: spreading a validated bundle alongside a conflicting key — a <code>select</code> in the constant and an <code>include</code> at the call — is still an error, because the two are mutually exclusive at the same level.</p>`,
    seed: SEED,
    expect: `Ann ADMIN Prisma Basics\nBob EDITOR React Hooks\nCy USER none\none Bob EDITOR React Hooks\nstaff 2`,
  },
  {
    title: 'Handle Prisma Errors by Narrowing on Their Error Codes',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['PrismaClientKnownRequestError', 'error codes P2002 and P2025', 'instanceof narrowing', 'meta target field', 'unknown in catch'],
    prerequisites: ['create', 'update', 'try catch'],
    tags: ['prisma', 'typescript', 'errors', 'narrowing', 'validation'],
    problemHtml: `<p>A caught error is <code>unknown</code> under <code>strict</code>, so reading <code>e.code</code> does not compile until you narrow. Prisma's answer is a class hierarchy: <code>Prisma.PrismaClientKnownRequestError</code> carries a stable <code>code</code> such as <code>P2002</code> (unique constraint failed) or <code>P2025</code> (record not found), plus a <code>meta</code> object naming the fields involved. Narrowing with <code>instanceof</code> turns a stringly-typed guess into a typed branch — and lets an API return <code>409</code> instead of <code>500</code>.</p>
<p>Against the reference dataset, write a helper <code>classify(e: unknown): string</code> that returns <code>P2002 on &lt;fields&gt;</code> for a unique violation (fields joined by a comma from <code>meta.target</code>), <code>P2025</code> for a missing record, <code>known &lt;code&gt;</code> for any other known request error, and <code>other</code> for everything else. Then:</p>
<ul>
<li>Try to create a user with the already-taken email <code>ann@x.io</code>, catch, and log <code>dup</code> followed by <code>classify</code>.</li>
<li>Try to update the user <code>ghost@x.io</code>, who does not exist, catch, and log <code>missing</code> followed by <code>classify</code>.</li>
<li>Show the safe alternative to catching: log <code>safe</code> followed by the result of <code>findUnique</code> for <code>ghost@x.io</code>, which returns <code>null</code> rather than throwing.</li>
<li>Log <code>users N</code> to prove the failed create wrote nothing.</li>
</ul>
<p>Do not pre-check whether the email exists — let the constraint fail.</p>`,
    inputSpec: 'The reference dataset with three users; ann@x.io is taken and ghost@x.io does not exist.',
    outputSpec: 'The duplicate email reports P2002 naming the email field, the missing update reports P2025, findUnique returns null instead of throwing, and the user count is still 3.',
    constraints: 'Narrow with instanceof Prisma.PrismaClientKnownRequestError before reading code. Do not cast the caught value with as any, and do not use findUniqueOrThrow for the safe branch.',
    examplesJson: [
      { input: 'create a user with email "ann@x.io"', output: 'dup P2002 on email', explanation: 'The unique constraint on email fails, and meta.target names the offending field.' },
      { input: 'update where email "ghost@x.io"', output: 'missing P2025', explanation: 'update requires an existing row; a miss throws P2025 rather than returning null.' },
      { input: 'findUnique where email "ghost@x.io"', output: 'safe null', explanation: 'The find family returns null for a miss, which is why it needs no try/catch at all.' },
    ],
    hintsJson: [
      'A caught value is unknown under strict — narrow before touching any property.',
      'The error classes live on the Prisma namespace, so instanceof Prisma.PrismaClientKnownRequestError works.',
      'meta is loosely typed; treat meta.target as a string array after checking it.',
      'update throws on a miss while findUnique returns null — choose the one whose failure mode you want.',
    ],
    solution: wrapPre(`function classify(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = e.meta && e.meta.target;
      const fields = Array.isArray(target) ? target.join(", ") : String(target);
      return \`P2002 on \${fields}\`;
    }
    if (e.code === "P2025") return "P2025";
    return \`known \${e.code}\`;
  }
  return "other";
}`, `  try {
    await prisma.user.create({ data: { email: "ann@x.io", name: "Clone" } });
  } catch (e) {
    console.log("dup", classify(e));
  }
  try {
    await prisma.user.update({ where: { email: "ghost@x.io" }, data: { name: "Ghost" } });
  } catch (e) {
    console.log("missing", classify(e));
  }
  console.log("safe", await prisma.user.findUnique({ where: { email: "ghost@x.io" } }));
  console.log("users", await prisma.user.count());`),
    solutionExplanationHtml: `<p>Under <code>strict</code>, TypeScript types a caught value as <code>unknown</code>, which is honest: anything can be thrown. <code>instanceof Prisma.PrismaClientKnownRequestError</code> is the narrowing that makes <code>e.code</code> and <code>e.meta</code> legal, and it also separates <em>expected</em> database outcomes from genuine bugs. The alternative people reach for — <code>catch (e: any)</code> — compiles but silently swallows a <code>TypeError</code> from your own code and reports it as a database problem.</p>
<p>The codes are a stable contract. <code>P2002</code> is a unique constraint violation and its <code>meta.target</code> names the columns, which is exactly what a form needs to attach the message to the right field; a compound unique makes <code>target</code> an array of several names, so the code handles the array shape rather than assuming a string. <code>P2025</code> is "record required but not found", raised by <code>update</code> and <code>delete</code> against a missing row. <code>meta</code> is typed loosely as <code>unknown</code>-ish on purpose, since its shape varies by code — checking <code>Array.isArray</code> before joining is the honest way to read it.</p>
<p>The last two lines make a design point. Catching is only necessary for operations that throw: the <code>find</code> family returns <code>null</code> for a miss, so <code>findUnique</code> needs no handler while <code>findUniqueOrThrow</code> raises <code>P2025</code>. Pick the variant whose failure mode matches the caller. And the unchanged user count confirms why letting the constraint fail beats pre-checking with a read: no row was written, no race window existed, and the database stayed the single arbiter of uniqueness.</p>`,
    diagramMermaid: `flowchart TD
  A[caught value is unknown] --> B{instanceof PrismaClientKnownRequestError}
  B -->|no| C[other error rethrow or 500]
  B -->|yes| D{code}
  D -->|P2002| E[unique violation read meta target and return 409]
  D -->|P2025| F[record not found return 404]
  D -->|else| G[known error log the code]`,
    seed: SEED,
    expect: `dup P2002 on email\nmissing P2025\nsafe null\nusers 3`,
  },
  {
    title: 'Write Type-Safe Raw SQL with $queryRaw and Prisma.sql',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['$queryRaw tagged template', 'result generics', 'parameterised interpolation', 'Prisma.sql composition', 'injection safety'],
    prerequisites: ['generated types', 'SQL basics'],
    tags: ['prisma', 'typescript', 'raw-sql', 'security', 'query'],
    problemHtml: `<p>Some queries have no client equivalent, and dropping to SQL should not mean dropping type safety or opening an injection hole. <code>$queryRaw</code> is a <strong>tagged template</strong>: every <code>${'${}'}</code> becomes a bound parameter, never string concatenation. Its generic argument names the row shape you expect — Prisma cannot infer it, so this is a promise you make and must keep. <code>Prisma.sql</code> builds composable fragments with the same protection, and <code>Prisma.join</code> expands a list into a parameterised <code>IN</code>.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Run a <code>$queryRaw&lt;{ name: string; posts: number }[]&gt;</code> that joins users to posts, counts each user's posts, orders by <code>name</code> ascending, and logs <code>name posts</code> per row. Cast the count with <code>::int</code> so it does not arrive as a bigint.</li>
<li>Interpolate a minimum-views parameter as <code>${'${minViews}'}</code> with <code>minViews = 100</code>, returning titles of published posts at or above it ordered by <code>views</code> descending, and log them one per line.</li>
<li>Build a fragment with <code>Prisma.sql</code> for a role filter using <code>Prisma.join</code> over <code>["ADMIN", "EDITOR"]</code>, embed it in a larger query, and log <code>staff</code> followed by the matching emails ordered ascending.</li>
<li>Show the escape working: run the same title query with the hostile term <code>'; DROP TABLE users; --</code> and log <code>injected</code> followed by the row count and the surviving user count.</li>
</ul>
<p>Do not build any SQL string by concatenation.</p>`,
    inputSpec: 'The reference dataset: Ann has 3 posts, Bob 2, Cy 0; published posts with at least 100 views are Prisma Basics (250), React Hooks (150) and Intro to SQL (100).',
    outputSpec: 'Three count rows, three titles ordered by views descending, the two staff emails, and finally 0 matched rows for the injection attempt with all 3 users still present.',
    constraints: 'Use the tagged-template form only — never $queryRawUnsafe and never string concatenation. Cast counts to int in SQL. The role list must go through Prisma.join.',
    examplesJson: [
      { input: 'SELECT u.name, COUNT(p.id)::int AS posts FROM "User" u LEFT JOIN "Post" p ON p."authorId" = u.id GROUP BY u.name', output: 'Ann 3', explanation: 'The ::int cast avoids a bigint, which would otherwise arrive as a JavaScript BigInt and break JSON serialisation.' },
      { input: 'WHERE published = true AND views >= ${minViews} with minViews = 100', output: 'Prisma Basics, React Hooks, Intro to SQL', explanation: 'The interpolation becomes a bound parameter $1, not inlined text.' },
      { input: 'the same query with term = "\'; DROP TABLE users; --"', output: 'injected 0 3', explanation: 'The hostile string is compared as a literal value, matches nothing, and the table is untouched.' },
    ],
    hintsJson: [
      'The generic goes on the call: $queryRaw<{ name: string; posts: number }[]>`...`.',
      'Quote PascalCase table and column names in Postgres, as in "User" and "authorId".',
      'COUNT returns bigint in Postgres — cast with ::int before it reaches JavaScript.',
      'Prisma.sql makes a fragment and Prisma.join turns an array into a parameterised list.',
    ],
    solution: wrap(`  const counts = await prisma.$queryRaw<{ name: string; posts: number }[]>\`
    SELECT u.name, COUNT(p.id)::int AS posts
    FROM "User" u LEFT JOIN "Post" p ON p."authorId" = u.id
    GROUP BY u.name ORDER BY u.name ASC\`;
  for (const c of counts) console.log(c.name, c.posts);

  const minViews = 100;
  const hot = await prisma.$queryRaw<{ title: string }[]>\`
    SELECT title FROM "Post"
    WHERE published = true AND views >= \${minViews}
    ORDER BY views DESC\`;
  for (const h of hot) console.log(h.title);

  const roles: Role[] = [Role.ADMIN, Role.EDITOR];
  const roleFilter = Prisma.sql\`u.role::text IN (\${Prisma.join(roles)})\`;
  const staff = await prisma.$queryRaw<{ email: string }[]>\`
    SELECT u.email FROM "User" u WHERE \${roleFilter} ORDER BY u.email ASC\`;
  console.log("staff", staff.map((s) => s.email).join(", "));

  const term = "'; DROP TABLE users; --";
  const injected = await prisma.$queryRaw<{ title: string }[]>\`
    SELECT title FROM "Post" WHERE title = \${term}\`;
  console.log("injected", injected.length, await prisma.user.count());`),
    solutionExplanationHtml: `<p>The tagged-template form is what makes this safe. Prisma receives the static string pieces and the interpolated values <em>separately</em>, sends the pieces as the SQL text with <code>$1</code>, <code>$2</code> placeholders, and passes the values as bound parameters. The hostile term therefore travels as a single string compared against <code>title</code>: it matches nothing, and the users table is still there. The dangerous sibling is <code>$queryRawUnsafe</code>, which takes an ordinary string and concatenates whatever you built — reserve it for cases where the SQL <em>structure</em> is dynamic, and never let user input reach it.</p>
<p>Type safety here is a contract, not an inference. The generic <code>&lt;{ name: string; posts: number }[]&gt;</code> tells TypeScript what the rows look like; Prisma cannot verify it against the SQL, so a mismatch compiles happily and fails at runtime. Two Postgres details bite in practice: identifiers created from PascalCase models need double quotes (<code>"User"</code>, <code>"authorId"</code>), and <code>COUNT</code> returns <code>bigint</code>, which arrives as a JavaScript <code>BigInt</code> that <code>JSON.stringify</code> refuses to serialise — hence the <code>::int</code> cast, one of the most common surprises in raw Prisma queries.</p>
<p><code>Prisma.sql</code> keeps composition safe: a fragment carries its own parameters, so embedding <code>roleFilter</code> in the outer query renumbers the placeholders correctly. <code>Prisma.join</code> expands an array into <code>$1, $2</code> rather than a comma-joined string, which is the only correct way to build an <code>IN</code> list from user input. The <code>::text</code> cast on the enum column is needed because the parameters bind as text while the column is a Postgres enum type.</p>`,
    seed: SEED,
    expect: `Ann 3\nBob 2\nCy 0\nPrisma Basics\nReact Hooks\nIntro to SQL\nstaff ann@x.io, bob@x.io\ninjected 0 3`,
  },
  {
    title: 'Add Typed Computed Fields with a Client Extension',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['$extends result component', 'needs dependency declaration', 'computed field typing', 'extended client is a new instance', 'model methods'],
    prerequisites: ['generated types', 'GetPayload'],
    tags: ['prisma', 'typescript', 'extensions', 'types', 'client'],
    problemHtml: `<p>A derived value such as a display name or a slug does not belong in the database, and recomputing it at every call site is how two of them drift apart. <code>$extends</code> returns a <strong>new</strong> client with extra behaviour, fully typed. The <code>result</code> component adds computed fields — each declares <code>needs</code>, the real columns it depends on, so Prisma fetches them even when your <code>select</code> did not — and the <code>model</code> component adds methods to a model namespace.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Build <code>const xprisma = prisma.$extends({ ... })</code> adding to <code>user</code>: a computed <code>displayName</code> needing <code>name</code> and <code>role</code>, returning <code>name [ROLE]</code>; and a computed <code>isAdult</code> needing <code>age</code>, true when <code>age</code> is at least 18 and false when it is <code>null</code>.</li>
<li>Add a model method <code>user.findStaff()</code> returning users whose role is <code>ADMIN</code> or <code>EDITOR</code>, ordered by <code>name</code> ascending.</li>
<li>Fetch all users through <code>xprisma</code> ordered by <code>name</code> and log <code>displayName isAdult</code> per user.</li>
<li>Call <code>xprisma.user.findStaff()</code> and log <code>staff</code> followed by their <code>displayName</code> values joined by a comma.</li>
<li>Prove <code>needs</code> works: query with <code>select: { displayName: true }</code> only — no <code>name</code>, no <code>role</code> — and log <code>selected</code> followed by the values.</li>
</ul>
<p>The original <code>prisma</code> must stay unextended.</p>`,
    inputSpec: 'The reference dataset: Ann (ADMIN, 30), Bob (EDITOR, 25), Cy (USER, age null).',
    outputSpec: 'Three lines pairing the bracketed display name with the adult flag — false for Cy whose age is null — then the two staff display names, then the same display names fetched through a select that never mentioned name or role.',
    constraints: 'Use a single $extends call. Computed fields must declare needs. Do not add the derived values by mapping the rows after the query.',
    examplesJson: [
      { input: 'xprisma.user.findMany() then u.displayName', output: 'Ann [ADMIN] true', explanation: 'displayName is computed from the needed columns, and isAdult reads the nullable age.' },
      { input: 'a user whose age is null', output: 'Cy [USER] false', explanation: 'needs gives the compute function a typed age of number | null, so the null case must be decided explicitly.' },
      { input: 'findMany({ select: { displayName: true } })', output: 'selected Ann [ADMIN], Bob [EDITOR], Cy [USER]', explanation: 'Prisma silently adds the needed columns to the query and strips them from the result.' },
    ],
    hintsJson: [
      'The result component is keyed by model, then by the new field name.',
      'Each computed field is { needs: { col: true }, compute(row) { ... } }.',
      'compute receives only the needed columns, correctly typed — nothing else is available.',
      '$extends returns a new client; assign it and use that one.',
    ],
    solution: wrapPre(`const xprisma = prisma.$extends({
  result: {
    user: {
      displayName: {
        needs: { name: true, role: true },
        compute(u) {
          return \`\${u.name} [\${u.role}]\`;
        },
      },
      isAdult: {
        needs: { age: true },
        compute(u) {
          return u.age !== null && u.age >= 18;
        },
      },
    },
  },
  model: {
    user: {
      async findStaff() {
        return xprisma.user.findMany({
          where: { role: { in: [Role.ADMIN, Role.EDITOR] } },
          orderBy: { name: "asc" },
        });
      },
    },
  },
});`, `  const users = await xprisma.user.findMany({ orderBy: { name: "asc" } });
  for (const u of users) console.log(u.displayName, u.isAdult);
  const staff = await xprisma.user.findStaff();
  console.log("staff", staff.map((s) => s.displayName).join(", "));
  const selected = await xprisma.user.findMany({ orderBy: { name: "asc" }, select: { displayName: true } });
  console.log("selected", selected.map((s) => s.displayName).join(", "));`),
    solutionExplanationHtml: `<p><code>$extends</code> does not mutate the client — it returns a new one, and the original stays exactly as it was. That immutability is deliberate: it lets a request-scoped extension (a tenant filter, an audit logger) exist without leaking into the rest of the process. It also means forgetting to use the returned instance is a silent no-op, and the type system catches it, since <code>displayName</code> exists only on the extended client's results.</p>
<p><code>needs</code> is the part that makes computed fields honest. It declares the real columns the computation depends on, so Prisma adds them to the underlying <code>SELECT</code> even when your <code>select</code> asked only for the computed field — then strips them from what you get back. That is why the last query returns display names without ever mentioning <code>name</code> or <code>role</code>. Inside <code>compute</code>, the parameter is typed to exactly the needed columns, so <code>u.age</code> is <code>number | null</code> and the null case must be decided rather than assumed. Computed fields live in JavaScript, though — they cannot appear in a <code>where</code> or an <code>orderBy</code>, because the database has never heard of them.</p>
<p>The <code>model</code> component is the other half: <code>findStaff</code> becomes a first-class method on <code>xprisma.user</code>, which is how a shared query stops being copy-pasted across services. Note the mutual reference — the method calls <code>xprisma</code> so its results carry the computed fields too; referring to the extended client from inside its own definition works because the body runs only when the method is called. Alongside <code>result</code> and <code>model</code> there are <code>query</code> (intercept and wrap operations, the basis of soft delete) and <code>client</code> (add top-level helpers).</p>`,
    diagramMermaid: `flowchart TD
  A[select displayName only] --> B[extension reads needs name and role]
  B --> C[Prisma adds those columns to the SQL select]
  C --> D[rows come back with name role]
  D --> E[compute builds displayName]
  E --> F[needed columns stripped from the result]`,
    seed: SEED,
    expect: `Ann [ADMIN] true\nBob [EDITOR] true\nCy [USER] false\nstaff Ann [ADMIN], Bob [EDITOR]\nselected Ann [ADMIN], Bob [EDITOR], Cy [USER]`,
  },
  {
    title: 'Keep Types Honest Across a Service Boundary',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['explicit return types', 'satisfies operator', 'DTO derived from payload', 'null vs undefined at the boundary', 'no any'],
    prerequisites: ['GetPayload', 'validator', 'generated types'],
    tags: ['prisma', 'typescript', 'types', 'service', 'api'],
    problemHtml: `<p>Inference is excellent inside a function and dangerous across a module boundary. A service that returns an inferred Prisma row silently exports every column — including the ones an API must never send — and a later <code>select</code> change alters the public contract without a single error. The discipline is to name the boundary type, derive it from the query, and let the compiler check the mapping.</p>
<p>Against the reference dataset, build a small service:</p>
<ul>
<li>Define the arguments with <code>Prisma.validator&lt;Prisma.UserDefaultArgs&gt;()</code> selecting <code>id</code>, <code>name</code>, <code>role</code>, <code>age</code> and <code>profile: { select: { bio: true } }</code>, and derive <code>type Row = Prisma.UserGetPayload&lt;typeof args&gt;</code>.</li>
<li>Declare the public shape yourself: <code>type UserDto = { id: number; name: string; role: Role; bio?: string; adult: boolean }</code>. Note it uses <code>?</code> where the row uses <code>null</code>.</li>
<li>Write <code>toDto(row: Row): UserDto</code> converting <code>null</code> to <code>undefined</code> for <code>bio</code> and computing <code>adult</code> from the nullable <code>age</code>. Use <code>satisfies UserDto</code> on the returned object literal.</li>
<li>Write <code>listUsers(): Promise&lt;UserDto[]&gt;</code> — with the return type <strong>written out</strong>, not inferred — fetching with the validated args ordered by <code>name</code> ascending and mapping through <code>toDto</code>.</li>
<li>Log <code>name role bio adult</code> per DTO, printing <code>-</code> for a missing bio, then <code>keys</code> followed by the DTO keys of the first entry joined by a comma. Do not print the <code>id</code> — it comes from a sequence and is not stable across runs.</li>
</ul>
<p>No <code>any</code>, and the email must never appear in the DTO.</p>`,
    inputSpec: 'The reference dataset: Ann (ADMIN, 30, bio "Backend engineer"), Bob (EDITOR, 25, bio "Frontend developer"), Cy (USER, no age, no profile).',
    outputSpec: 'Three DTO lines with Cy showing a dash for the bio and false for adult, then the key list id, name, role, bio, adult confirming email never crossed the boundary.',
    constraints: 'listUsers must have an explicit Promise<UserDto[]> return type. Use satisfies rather than a cast, and do not spread the whole row into the DTO.',
    examplesJson: [
      { input: 'toDto on Ann’s row', output: 'Ann ADMIN Backend engineer true', explanation: 'bio comes from the nested profile select and age 30 makes adult true.' },
      { input: 'toDto on Cy’s row', output: 'Cy USER - false', explanation: 'A missing profile is null on the row and becomes undefined on the DTO, printed as a dash.' },
      { input: 'Object.keys(dtos[0])', output: 'keys id, name, role, bio, adult', explanation: 'Only the declared fields exist — email was selected out of the query and never mapped.' },
    ],
    hintsJson: [
      'Derive Row from the validated args so the mapping function tracks the query.',
      'The row uses null for absent values while an optional DTO field uses undefined — convert deliberately.',
      'satisfies checks the literal against the type without widening it, unlike a cast.',
      'Writing the return type of listUsers is what makes a future select change fail loudly.',
    ],
    solution: wrapPre(`const args = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, name: true, role: true, age: true, profile: { select: { bio: true } } },
});
type Row = Prisma.UserGetPayload<typeof args>;

type UserDto = { id: number; name: string; role: Role; bio?: string; adult: boolean };

function toDto(row: Row): UserDto {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.profile === null ? undefined : row.profile.bio,
    adult: row.age !== null && row.age >= 18,
  } satisfies UserDto;
}

async function listUsers(): Promise<UserDto[]> {
  const rows = await prisma.user.findMany({ ...args, orderBy: { name: "asc" } });
  return rows.map(toDto);
}`, `  const dtos = await listUsers();
  for (const d of dtos) console.log(d.name, d.role, d.bio === undefined ? "-" : d.bio, d.adult);
  console.log("keys", Object.keys(dtos[0]).join(", "));`),
    solutionExplanationHtml: `<p>The three annotations each stop a different failure. Deriving <code>Row</code> from the validated args means the mapping function is checked against the actual query, so removing <code>age</code> from the select breaks <code>toDto</code> immediately instead of producing <code>undefined</code> at runtime. Declaring <code>UserDto</code> by hand fixes the public contract, so it changes only when someone edits it on purpose. And writing <code>Promise&lt;UserDto[]&gt;</code> on <code>listUsers</code> is what forces the two to meet — without it the return type is inferred from the body, and a leaked field would quietly become part of the API.</p>
<p><code>satisfies</code> is the right tool for the returned literal because it checks without widening: the object must be assignable to <code>UserDto</code>, yet the literal keeps its precise type, and an extra property such as <code>email</code> is rejected as excess. A cast (<code>as UserDto</code>) would have accepted the same mistake by asserting the shape rather than verifying it — the distinction between telling the compiler and asking it.</p>
<p>The <code>null</code>-versus-<code>undefined</code> conversion is the boundary detail people skip. Prisma returns <code>null</code> for an absent nullable column or relation, because that is what SQL stores; an optional property in JSON is usually expressed by the key being absent, which is <code>undefined</code>. Converting deliberately keeps <code>JSON.stringify</code> from emitting <code>"bio": null</code> when the intent was "no bio at all". The key list at the end is the proof the boundary held: five fields, and the email that was never selected could not have leaked even by accident.</p>`,
    seed: SEED,
    expect: `Ann ADMIN Backend engineer true\nBob EDITOR Frontend developer true\nCy USER - false\nkeys id, name, role, bio, adult`,
  },
  {
    title: 'Write a Generic Paginate Helper That Works for Any Model',
    difficulty: 'HARD', estimatedMinutes: 55, points: 25,
    concepts: ['generic constraints over delegates', 'preserving the caller result type', 'typed args pass-through', 'reusable infrastructure', 'inference at the call site'],
    prerequisites: ['GetPayload', 'validator', 'generics'],
    tags: ['prisma', 'typescript', 'generics', 'pagination', 'advanced'],
    problemHtml: `<p>Every list endpoint repeats the same four lines: <code>take</code>, <code>skip</code>, a matching <code>count</code>, and page arithmetic. Extracting them is easy in JavaScript and subtle in TypeScript. The tempting design — pass <code>prisma.post</code> and an <code>args</code> object to a helper generic over the delegate — does not typecheck against the real client, because <code>findMany</code> is itself generic (<code>SelectSubset</code>) and a plain function type cannot stand in for it; the rows collapse to the full model and the widened <code>orderBy</code> is rejected. The design that does work passes <strong>callbacks</strong>, so the queries stay at the call site where inference is exact and the helper only owns the paging arithmetic.</p>
<p>Write <code>paginate</code> and use it for two different models:</p>
<ul>
<li>Its first parameter is an object with <code>findMany(skip, take)</code> returning the page rows and <code>count()</code> returning the total; then a page number and a page size. Infer the row type from what <code>findMany</code> returns — the helper must name no model.</li>
<li>It returns <code>{ rows, total, page, pages }</code> with <code>pages = Math.ceil(total / pageSize)</code>, running the two callbacks concurrently.</li>
<li>Call it for posts, page 1 of size 2, filtered to <code>published: true</code>, ordered by <code>views</code> descending, selecting only <code>title</code>. Define the <code>where</code> once and use it in both callbacks. Log each <code>row.title</code>, then <code>total N pages M</code>.</li>
<li>Call it again for users, page 2 of size 2, ordered by <code>name</code> ascending, including <code>profile</code>. Log <code>name</code> and the bio (or <code>-</code>), then <code>total N pages M</code>.</li>
</ul>
<p>No <code>any</code> and no casts. The post rows must not expose <code>views</code> to the caller, since it was not selected.</p>`,
    inputSpec: 'The reference dataset: 4 published posts (250, 150, 100, 80 views) and 3 users ordered Ann, Bob, Cy.',
    outputSpec: 'Page 1 of the published posts by views gives the two highest with a total of 4 and 2 pages; page 2 of the users gives Cy alone with a total of 3 and 2 pages.',
    constraints: 'One generic helper used for both models, naming no model type. The same where must reach findMany and count. No any, no as casts.',
    examplesJson: [
      { input: 'paginate({ findMany: (skip, take) => prisma.post.findMany({ where, orderBy: { views: "desc" }, select: { title: true }, skip, take }), count: () => prisma.post.count({ where }) }, 1, 2)', output: 'Prisma Basics, React Hooks then total 4 pages 2', explanation: 'The query stays at the call site, so the rows keep the caller’s select: row.title exists and row.views does not.' },
      { input: 'the same helper with prisma.user and include: { profile: true }, page 2', output: 'Cy - then total 3 pages 2', explanation: 'Page 2 of size 2 skips the first two users, and the include survives because R is inferred from the callback.' },
    ],
    hintsJson: [
      'Make the helper generic in one variable only: R, the row type.',
      'Let findMany be a callback taking skip and take — inference then comes from the real query.',
      'skip is (page - 1) * pageSize, and the same where object must be captured by both callbacks.',
      'Run the two callbacks with Promise.all and compute pages with Math.ceil.',
    ],
    solution: wrapPre(`type Page<R> = { rows: R[]; total: number; page: number; pages: number };

async function paginate<R>(
  source: { findMany: (skip: number, take: number) => Promise<R[]>; count: () => Promise<number> },
  page: number,
  pageSize: number,
): Promise<Page<R>> {
  const [rows, total] = await Promise.all([
    source.findMany((page - 1) * pageSize, pageSize),
    source.count(),
  ]);
  return { rows, total, page, pages: Math.ceil(total / pageSize) };
}`, `  const postWhere = { published: true };
  const posts = await paginate(
    {
      findMany: (skip, take) => prisma.post.findMany({
        where: postWhere, orderBy: { views: "desc" }, select: { title: true }, skip, take,
      }),
      count: () => prisma.post.count({ where: postWhere }),
    },
    1,
    2,
  );
  for (const row of posts.rows) console.log(row.title);
  console.log("total", posts.total, "pages", posts.pages);

  const users = await paginate(
    {
      findMany: (skip, take) => prisma.user.findMany({
        orderBy: { name: "asc" }, include: { profile: true }, skip, take,
      }),
      count: () => prisma.user.count(),
    },
    2,
    2,
  );
  for (const row of users.rows) console.log(row.name, row.profile === null ? "-" : row.profile.bio);
  console.log("total", users.total, "pages", users.pages);`),
    solutionExplanationHtml: `<p>The helper is generic in exactly one variable, <code>R</code>, and it is inferred from what the <code>findMany</code> callback returns. That is why <code>posts.rows[0].title</code> exists while <code>views</code> does not, and why the user rows carry a typed <code>profile</code> — the queries never left the call site, so Prisma's own inference did all the work and the helper merely carried the type through.</p>
<p>The design people try first is worth understanding, because it fails for an instructive reason. Passing <code>prisma.post</code> itself and typing the parameter as <code>{ findMany: (args: A) =&gt; Promise&lt;R[]&gt; }</code> looks reasonable, but the real <code>findMany</code> is generic over its arguments (<code>SelectSubset&lt;T, PostFindManyArgs&gt;</code>) and computes the row type from them. A non-generic function type cannot represent that, so <code>R</code> collapses to the full model and the caller's object literal widens — <code>orderBy: { views: "desc" }</code> becomes <code>{ views: string }</code>, which no longer fits <code>SortOrder</code>. It compiles only if you reach for <code>any</code>, and then every guarantee is gone. Higher-order inference is the practical escape: hand back the query, not the arguments.</p>
<p>Two behavioural details matter as much as the types. The same <code>where</code> must be captured by both callbacks — a helper that counts the whole table while listing a filtered page reports page numbers for a different query, exactly the bug this abstraction exists to prevent, and defining <code>postWhere</code> once is what enforces it. <code>Promise.all</code> issues the two round trips concurrently; if an insert landing between them would be intolerable, swap it for <code>prisma.$transaction([...])</code> so both read one snapshot. In production, also clamp <code>pageSize</code> — a caller asking for a hundred thousand rows is a denial-of-service vector — and prefer cursor pagination for deep pages, since a large <code>skip</code> still makes the database walk every skipped row.</p>`,
    seed: SEED,
    expect: `Prisma Basics\nReact Hooks\ntotal 4 pages 2\nCy -\ntotal 3 pages 2`,
  },
  {
    title: 'Capstone: A Fully Typed Repository with No any in Sight',
    difficulty: 'HARD', estimatedMinutes: 70, points: 30,
    concepts: ['validator plus GetPayload', 'discriminated result union', 'typed error mapping', 'extension for computed fields', 'transaction client typing'],
    prerequisites: ['validator', 'GetPayload', 'error narrowing', 'extensions', 'transactions'],
    tags: ['prisma', 'typescript', 'capstone', 'repository', 'types'],
    problemHtml: `<p>Combine the module: a repository whose queries, results, errors and computed fields are all typed, with no <code>any</code> and no cast anywhere.</p>
<ul>
<li>Define <code>const cardArgs = Prisma.validator&lt;Prisma.UserDefaultArgs&gt;()({ select: { id: true, name: true, role: true, posts: { select: { title: true, views: true }, orderBy: { views: "desc" }, take: 1 } } })</code> and <code>type Card = Prisma.UserGetPayload&lt;typeof cardArgs&gt;</code>.</li>
<li>Declare a discriminated union <code>type Result&lt;T&gt; = { ok: true; value: T } | { ok: false; error: string }</code> — the repository must never throw for an expected failure.</li>
<li>Write <code>createAuthor(input: Prisma.UserCreateInput): Promise&lt;Result&lt;Card&gt;&gt;</code>: create the user, re-read it with <code>cardArgs</code>, and return <code>{ ok: true, value }</code>. Catch <code>PrismaClientKnownRequestError</code> and map <code>P2002</code> to <code>duplicate</code> and any other code to <code>db:&lt;code&gt;</code>.</li>
<li>Write <code>topPost(email: string): Promise&lt;Result&lt;string&gt;&gt;</code> returning the user's highest-view post title, <code>{ ok: false, error: "not-found" }</code> when the user does not exist, and <code>no-posts</code> when they have none.</li>
<li>Call <code>createAuthor</code> once for <code>dee@x.io</code> named <code>Dee</code> with role <code>EDITOR</code> and one nested post <code>Airflow Notes</code> at 40 views, and log <code>created</code> plus the name, role and top post title. Call it again with the same email and log <code>again</code> plus the error.</li>
<li>Call <code>topPost</code> for <code>ann@x.io</code>, <code>cy@x.io</code> and <code>ghost@x.io</code>, logging <code>top</code> and either the title or the error for each.</li>
</ul>
<p>Every branch must be reached through the union's <code>ok</code> discriminant, never by checking for <code>undefined</code>.</p>`,
    inputSpec: 'The reference dataset plus one new author created by the first call. Ann’s top post is Prisma Basics at 250; Cy has no posts; ghost@x.io does not exist.',
    outputSpec: 'The first create succeeds and reports the new author with her single post; the second fails with duplicate; the three lookups return a title, no-posts, and not-found respectively.',
    constraints: 'No any, no as casts, no non-null assertions. Expected failures return the union instead of throwing, and the card query must use the validated args.',
    examplesJson: [
      { input: 'createAuthor with email dee@x.io and one nested post', output: 'created Dee EDITOR Airflow Notes', explanation: 'The re-read uses cardArgs, so posts is a one-element array from the take: 1.' },
      { input: 'createAuthor with the same email again', output: 'again duplicate', explanation: 'P2002 is mapped to a domain error rather than propagating a database exception.' },
      { input: 'topPost("cy@x.io") and topPost("ghost@x.io")', output: 'top no-posts and top not-found', explanation: 'Two distinct expected failures, distinguished by the union rather than by a null return.' },
    ],
    hintsJson: [
      'Let the caller branch on result.ok — inside each branch TypeScript knows which shape it has.',
      'Re-read with the validated args so the returned Card matches the declared type exactly.',
      'Narrow the caught error with instanceof before touching code.',
      'take: 1 still returns an array — check its length before reading index 0.',
    ],
    solution: wrapPre(`const cardArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    role: true,
    posts: { select: { title: true, views: true }, orderBy: { views: "desc" }, take: 1 },
  },
});
type Card = Prisma.UserGetPayload<typeof cardArgs>;
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function createAuthor(input: Prisma.UserCreateInput): Promise<Result<Card>> {
  try {
    const created = await prisma.user.create({ data: input });
    const card = await prisma.user.findUniqueOrThrow({ ...cardArgs, where: { id: created.id } });
    return { ok: true, value: card };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: e.code === "P2002" ? "duplicate" : \`db:\${e.code}\` };
    }
    throw e;
  }
}

async function topPost(email: string): Promise<Result<string>> {
  const card = await prisma.user.findUnique({ ...cardArgs, where: { email } });
  if (card === null) return { ok: false, error: "not-found" };
  if (card.posts.length === 0) return { ok: false, error: "no-posts" };
  return { ok: true, value: card.posts[0].title };
}`, `  const input: Prisma.UserCreateInput = {
    email: "dee@x.io",
    name: "Dee",
    role: "EDITOR",
    posts: { create: [{ title: "Airflow Notes", published: true, views: 40 }] },
  };
  const first = await createAuthor(input);
  if (first.ok) console.log("created", first.value.name, first.value.role, first.value.posts[0].title);
  else console.log("created failed", first.error);

  const second = await createAuthor(input);
  if (second.ok) console.log("again unexpected success");
  else console.log("again", second.error);

  for (const email of ["ann@x.io", "cy@x.io", "ghost@x.io"]) {
    const r = await topPost(email);
    console.log("top", r.ok ? r.value : r.error);
  }`),
    solutionExplanationHtml: `<p>The discriminated union is the backbone. Because <code>ok</code> is a literal type on both members, checking <code>result.ok</code> narrows the value in each branch: <code>first.value</code> exists only where <code>ok</code> is true, and <code>second.error</code> only where it is false. Compare that with returning <code>Card | null</code>, which collapses every failure into one indistinguishable value — here <code>not-found</code> and <code>no-posts</code> stay separate all the way to the caller, which is what lets an HTTP layer answer 404 versus 200-with-empty honestly.</p>
<p>Errors are split by whether they are expected. A duplicate email is a normal outcome of a signup form, so <code>P2002</code> is mapped into the union; anything that is not a known request error is rethrown, because an unexpected failure must not be flattened into a domain string that hides a real bug. Note the choice of <code>findUniqueOrThrow</code> for the re-read but <code>findUnique</code> in <code>topPost</code>: the first cannot legitimately miss — the row was just created inside the same call — while the second misses whenever the caller passes an unknown email.</p>
<p>The typing discipline ties it together. <code>cardArgs</code> is written once and feeds the create's re-read, the lookup and the <code>Card</code> type, so a change to the select updates all three and breaks any consumer that assumed the old shape. <code>take: 1</code> still yields an array, so the length check is what keeps <code>posts[0]</code> from being a non-null assertion — under <code>noUncheckedIndexedAccess</code> that check is mandatory rather than merely polite. The result is a boundary where the only way to get at a value is to have handled the failure first, which is the whole point of typing a repository rather than documenting it.</p>`,
    diagramMermaid: `sequenceDiagram
  participant Caller
  participant Repo
  participant DB as Postgres
  Caller->>Repo: createAuthor input
  Repo->>DB: create user with nested post
  DB-->>Repo: unique violation P2002
  Repo-->>Caller: ok false error duplicate
  Caller->>Repo: topPost email
  Repo->>DB: findUnique with validated card args
  DB-->>Repo: null
  Repo-->>Caller: ok false error not-found`,
    seed: SEED,
    expect: `created Dee EDITOR Airflow Notes\nagain duplicate\ntop Prisma Basics\ntop no-posts\ntop not-found`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VDIR = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/prisma-434';
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
