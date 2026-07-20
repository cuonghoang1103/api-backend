// prisma-orm module 437 (advanced-patterns-and-production-deployment) — 10 exercises.
// Every number in the expected output was measured against a real Postgres:
// query counts come from $on("query") events, P2034/P2028 from real conflicts
// and real timeouts, and the pool figure from pg_stat_activity while busy.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'prisma-orm';
const moduleSlug = 'advanced-patterns-and-production-deployment';
const URL_ = 'postgresql://postgres:x@localhost:55432/prisma_codelab';
const HEADER = `generator client {
  provider = "prisma-client-js"
  output   = "./generated"
}

datasource db {
  provider = "postgresql"
  url      = "${URL_}"
}
`;
const REFERENCE = `${HEADER}
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  tenantId  Int
  deletedAt DateTime?
  posts     Post[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String    @unique
  views     Int       @default(0)
  tenantId  Int
  deletedAt DateTime?
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

model Account {
  id      Int    @id @default(autoincrement())
  owner   String @unique
  balance Int
}
`;
const imp = `import { PrismaClient, Prisma } from './generated';\nconst prisma = new PrismaClient();\n`;
const wrap = (body) => `${imp}\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;
const wrapPre = (pre, body) => `${imp}\n${pre}\n\nasync function main() {\n${body}\n}\n\nmain().finally(() => prisma.$disconnect());`;
// Some exercises build their own client (logging, pooling), so they must not
// import the shared one.
const bare = (code) => `import { PrismaClient, Prisma } from './generated';\n\n${code}`;

const WIPE = `await prisma.post.deleteMany(); await prisma.user.deleteMany(); await prisma.account.deleteMany();`;

const SEED = `${WIPE}
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", tenantId: 1 } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", tenantId: 1 } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy", tenantId: 2 } });
await prisma.post.createMany({ data: [
  { title: "P1", views: 10, tenantId: 1, authorId: ann.id },
  { title: "P2", views: 20, tenantId: 1, authorId: ann.id },
  { title: "P3", views: 30, tenantId: 1, authorId: bob.id },
  { title: "P4", views: 40, tenantId: 2, authorId: cy.id },
]});
await prisma.account.create({ data: { owner: "main", balance: 100 } });`;

const ex = [
  {
    title: 'Share One PrismaClient and Shut It Down Cleanly',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['client is a connection pool', 'singleton across hot reloads', 'lazy connect', 'disconnect on shutdown', 'why new PrismaClient per request is wrong'],
    prerequisites: ['PrismaClient basics'],
    tags: ['prisma', 'production', 'singleton', 'connections', 'lifecycle'],
    problemHtml: `<p>A <code>PrismaClient</code> is not a cheap handle — it owns a <strong>connection pool</strong>. Constructing one per request, or letting a dev-server hot reload construct a fresh one on every file save, exhausts the database's connection limit and produces the classic <code>too many connections</code> outage that only appears under load or after an hour of editing.</p>
<p>Build the standard pattern and prove its properties:</p>
<ul>
<li>Write <code>getClient()</code> returning a single shared instance, cached on <code>globalThis</code> so a module reload reuses it rather than creating another. Call it twice and log <code>same true</code> if both calls return the identical object.</li>
<li>Show the connection is <strong>lazy</strong>: log <code>connections N</code> before any query has run, counting rows in <code>pg_stat_activity</code> for this client's <code>application_name</code>. It must be <code>0</code>.</li>
<li>Run a query, then log <code>users N</code>.</li>
<li>Call <code>$disconnect()</code>, then run another query and log <code>afterDisconnect N</code> — the client reconnects on demand rather than breaking.</li>
<li>Register the shutdown hook you would ship (<code>process.on("SIGTERM", ...)</code> calling <code>$disconnect</code>) and log <code>hook 1</code> for the number of listeners registered.</li>
</ul>
<p>Give the client its own <code>application_name</code> in the connection string so the counting query can find it.</p>`,
    inputSpec: 'The reference dataset with three users, and a connection string carrying a distinct application_name.',
    outputSpec: 'Both calls return the same instance, no connection exists before the first query, the query sees three users, a query after disconnecting reconnects and still sees three, and exactly one SIGTERM listener is registered.',
    constraints: 'Exactly one PrismaClient instance. Do not construct a client inside a function that runs per request, and do not call $connect() eagerly.',
    examplesJson: [
      { input: 'getClient() === getClient()', output: 'same true', explanation: 'The instance is cached on globalThis, so a hot reload reuses it instead of opening a second pool.' },
      { input: 'counting connections before the first query', output: 'connections 0', explanation: 'Prisma connects lazily — constructing the client opens nothing.' },
      { input: 'a query issued after $disconnect()', output: 'afterDisconnect 3', explanation: 'Disconnecting closes the pool; the next query transparently opens it again.' },
    ],
    hintsJson: [
      'Cache the instance on globalThis so module reloads in dev do not create a second pool.',
      'Prisma connects on the first query, not in the constructor.',
      'Add ?application_name=... to the connection string so pg_stat_activity can identify this client.',
      'Register the SIGTERM handler once, at startup — not inside a request handler.',
    ],
    solution: bare(`const APP = "codelab_singleton";
const URL = "${URL_}?application_name=" + APP;

// One client per process. The globalThis cache survives dev hot reloads,
// which would otherwise leak a new connection pool on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: URL } } });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

async function connectionCount(client: PrismaClient): Promise<number> {
  const rows = await client.$queryRaw<{ n: bigint }[]>\`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = \${APP}\`;
  return Number(rows[0].n);
}

async function main() {
  const first = getClient();
  const second = getClient();
  console.log("same", first === second);

  // Nothing is connected yet — but ask through a SECOND client, because
  // querying through this one would itself open the connection.
  const probe = new PrismaClient();
  const before = await probe.$queryRaw<{ n: bigint }[]>\`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = \${APP}\`;
  console.log("connections", Number(before[0].n));

  console.log("users", await first.user.count());
  await first.$disconnect();
  console.log("afterDisconnect", await first.user.count());

  process.on("SIGTERM", () => { void first.$disconnect(); });
  console.log("hook", process.listenerCount("SIGTERM"));

  await probe.$disconnect();
  await first.$disconnect();
}

main();`),
    solutionExplanationHtml: `<p>The client is a pool, and that single fact drives the whole pattern. Each instance keeps its own set of connections open, so two instances mean two pools; on a serverless platform where every invocation is a fresh module, or in a dev server that reloads on save, the count climbs until PostgreSQL refuses new connections. The <code>globalThis</code> cache is the conventional fix because module-level state is discarded by a hot reload while <code>globalThis</code> is not — and it is deliberately skipped in production, where modules load once and a global would only obscure the lifecycle.</p>
<p>Laziness is what makes the pattern safe to apply everywhere: constructing a client opens nothing, so importing it in a module that never queries costs a few bytes rather than a connection. The count of zero before the first query proves it, and the probe client is needed for that measurement precisely because asking through the client under test would create the very connection you are trying to count.</p>
<p>Disconnecting is not destruction. <code>$disconnect()</code> drains the pool, and the next query opens it again — which is why a stray disconnect in a request handler causes a puzzling latency spike rather than an error. The right place for it is process shutdown, so an orderly <code>SIGTERM</code> closes connections instead of leaving the database to time them out; in a container that is the difference between a clean rolling deploy and a minute of half-open sockets.</p>
<p>Two production knobs live in the same connection string. <code>connection_limit</code> caps the pool per instance — exercise 8 measures it — and matters enormously when N replicas each hold a pool. Under a serverless model where instances vastly outnumber sensible connections, the real answer is an external pooler such as PgBouncer with <code>pgbouncer=true</code>, because no per-instance setting can fix an unbounded number of instances.</p>`,
    diagramMermaid: `flowchart TD
  A[module loads] --> B{globalThis has a client}
  B -->|yes| C[reuse the same pool]
  B -->|no| D[construct one client]
  D --> E[no connection opened yet]
  E --> F[first query connects lazily]
  F --> G[SIGTERM triggers disconnect]`,
    seed: SEED,
    expect: `same true\nconnections 0\nusers 3\nafterDisconnect 3\nhook 1`,
  },
  {
    title: 'See Every Query Your Code Issues with Event Logging',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['log event emitters', '$on query events', 'measuring query counts', 'duration and params', 'observability before optimisation'],
    prerequisites: ['PrismaClient options'],
    tags: ['prisma', 'observability', 'logging', 'performance', 'production'],
    problemHtml: `<p>You cannot optimise what you cannot count. Constructing the client with <code>log: [{ emit: "event", level: "query" }]</code> turns every statement into an event carrying the SQL, the parameters and the duration — the raw material for slow-query logs, per-request query budgets, and the N+1 detection of exercise 5.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Create a client with query events enabled and subscribe with <code>$on("query", ...)</code>, keeping a counter and the last event.</li>
<li>Reset the counter, run a plain <code>findMany</code> on users, and log <code>plain N</code>.</li>
<li>Reset, run <code>findMany</code> with <code>include: { posts: true }</code>, and log <code>include N</code>.</li>
<li>Log <code>hasDuration true</code> when the last event exposes a numeric <code>duration</code>, and <code>hasParams true</code> when a parameterised query reports its <code>params</code> separately from the SQL text.</li>
<li>Log <code>slow 0</code> — the number of queries over 5000 ms — the shape a real slow-query threshold takes.</li>
</ul>
<p>Events arrive asynchronously, so allow them to flush before reading the counter. The scaffold gives the async skeleton.</p>`,
    inputSpec: 'The reference dataset: three users and four posts.',
    outputSpec: 'A plain findMany costs one query, the same read with an include costs two, events carry a numeric duration and separated parameters, and nothing exceeds the slow threshold.',
    constraints: 'Counts must come from query events, not from guessing. Do not use log: ["query"] with stdout — the exercise needs the event emitter form.',
    examplesJson: [
      { input: 'prisma.user.findMany()', output: 'plain 1', explanation: 'One statement, one event.' },
      { input: 'prisma.user.findMany({ include: { posts: true } })', output: 'include 2', explanation: 'Prisma issues one query per relation level — two round trips, not one per user.' },
      { input: 'reading e.params on a filtered query', output: 'hasParams true', explanation: 'Values arrive separately from the SQL text, which is what makes the query parameterised rather than concatenated.' },
    ],
    hintsJson: [
      'The emit: "event" form is what makes $on("query") fire; the default logs to stdout instead.',
      'Reset your counter immediately before the operation you want to measure.',
      'Query events are emitted asynchronously — await a short delay before reading the count.',
      'Each event carries query, params, duration and target.',
    ],
    solution: bare(`const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

type QueryEvent = { query: string; params: string; duration: number };
let count = 0;
let last: QueryEvent | null = null;
prisma.$on("query" as never, (e: QueryEvent) => {
  count += 1;
  last = e;
});

const flush = () => new Promise((r) => setTimeout(r, 150));

async function main() {
  await flush();

  count = 0;
  await prisma.user.findMany();
  await flush();
  console.log("plain", count);

  count = 0;
  await prisma.user.findMany({ include: { posts: true } });
  await flush();
  console.log("include", count);

  count = 0;
  await prisma.post.findMany({ where: { views: { gt: 15 } } });
  await flush();
  const seen: QueryEvent | null = last;
  console.log("hasDuration", seen !== null && typeof seen.duration === "number");
  console.log("hasParams", seen !== null && seen.params.length > 0 && !seen.query.includes("15"));
  console.log("slow", seen !== null && seen.duration > 5000 ? 1 : 0);

  await prisma.$disconnect();
}

main();`),
    solutionExplanationHtml: `<p>The two logging modes are easy to confuse and behave very differently. <code>log: ["query"]</code> prints to stdout and is a debugging convenience; <code>log: [{ emit: "event", level: "query" }]</code> emits structured events you can count, aggregate and ship to a metrics backend. Only the second lets you enforce a rule like "no request may issue more than twenty queries", which is how N+1 regressions get caught in CI rather than in production.</p>
<p>The counts themselves are the lesson. A plain <code>findMany</code> is one statement. Adding <code>include: { posts: true }</code> makes it two — <strong>one per relation level, not one per parent row</strong> — because Prisma fetches all the children of all the parents in a single follow-up query. That is why <code>include</code> is not itself an N+1 problem, and why the loop in exercise 5 is.</p>
<p>Two details in the event payload matter operationally. <code>duration</code> is the engine-side time in milliseconds, which is what a slow-query threshold should trigger on — application-side timing includes pool waiting and would blame the wrong thing. And <code>params</code> arriving separately from <code>query</code> is direct evidence that the statement is parameterised: the literal <code>15</code> appears in the parameter list, not in the SQL text, so it cannot be an injection. That separation is also why query text makes a good aggregation key — a thousand executions of the same shape group together instead of appearing as a thousand distinct statements.</p>
<p>The asynchronous emission is a real trap: reading the counter immediately after <code>await</code>ing the query often reports zero, because the event has not been delivered yet. The flush here is what makes the measurement honest, and in production the equivalent is aggregating over a window rather than reading a counter at an arbitrary instant.</p>`,
    seed: SEED,
    expect: `plain 1\ninclude 2\nhasDuration true\nhasParams true\nslow 0`,
  },
  {
    title: 'Implement Soft Delete with a Client Extension',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['query component of $extends', 'intercepting delete', 'default filtering on read', 'cross-cutting concern in one place', 'escape hatch for admin reads'],
    prerequisites: ['client extensions', 'update and delete'],
    tags: ['prisma', 'extensions', 'soft-delete', 'production', 'patterns'],
    problemHtml: `<p>"Deleted" rows that must remain recoverable — for undo, audit, or a regulator — are usually marked rather than removed. The trouble is that the rule has to hold <em>everywhere</em>: one forgotten <code>where</code> in one service and deleted records reappear in a list. The <code>query</code> component of <code>$extends</code> intercepts operations so the rule lives in one place instead of in every call site.</p>
<p>Against the reference dataset, build an extended client that:</p>
<ul>
<li>Turns <code>user.delete</code> into an update setting <code>deletedAt</code> to the current time.</li>
<li>Filters <code>deletedAt: null</code> into every <code>findMany</code> and <code>findFirst</code> on <code>$allModels</code>, without discarding the caller's own <code>where</code>.</li>
</ul>
<p>Then prove it works:</p>
<ul>
<li>Delete <code>bob@x.io</code> through the extended client and log <code>rowsInTable N</code> using the <strong>base</strong> client — the row must still be there.</li>
<li>Log <code>visible N</code> — users returned by the extended client's <code>findMany</code>.</li>
<li>Log <code>marked N</code> — rows whose <code>deletedAt</code> is not null, read through the base client.</li>
<li>Show the caller's filter survives: <code>findMany({ where: { tenantId: 1 } })</code> through the extended client, logged as <code>tenant1 N</code>.</li>
<li>Show the escape hatch: read every user including deleted ones through the base client, logged as <code>admin N</code>.</li>
</ul>`,
    inputSpec: 'The reference dataset: three users, two in tenant 1 (Ann, Bob) and one in tenant 2 (Cy), none deleted.',
    outputSpec: 'After the soft delete the row count is unchanged at three, only two users are visible, exactly one carries a deletion timestamp, the tenant filter still narrows to one visible user, and the base client can still see all three.',
    constraints: 'One $extends call. Do not add deletedAt filters at the call sites, and do not overwrite the caller’s where — merge with it.',
    examplesJson: [
      { input: 'xprisma.user.delete({ where: { email: "bob@x.io" } })', output: 'rowsInTable 3', explanation: 'The interception turns the DELETE into an UPDATE, so nothing leaves the table.' },
      { input: 'xprisma.user.findMany()', output: 'visible 2', explanation: 'The injected deletedAt: null filter hides the marked row from every read that goes through the extension.' },
      { input: 'xprisma.user.findMany({ where: { tenantId: 1 } })', output: 'tenant1 1', explanation: 'Ann and Bob are both tenant 1, but Bob is deleted — the injected filter is merged with the caller’s, not substituted for it.' },
    ],
    hintsJson: [
      'The query component is keyed by model (or $allModels) then by operation.',
      'Each handler receives { args, query } — mutate args, then return query(args).',
      'Merge with the existing where by spreading it, or a caller filter is silently dropped.',
      'Keep the base client around: some code legitimately needs to see deleted rows.',
    ],
    solution: wrapPre(`const xprisma = prisma.$extends({
  query: {
    user: {
      // A delete becomes a timestamped update. The row never leaves the table.
      async delete({ args }) {
        return prisma.user.update({ where: args.where, data: { deletedAt: new Date() } });
      },
    },
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
    },
  },
});`, `  await xprisma.user.delete({ where: { email: "bob@x.io" } });

  console.log("rowsInTable", await prisma.user.count());
  console.log("visible", (await xprisma.user.findMany()).length);
  console.log("marked", await prisma.user.count({ where: { deletedAt: { not: null } } }));
  console.log("tenant1", (await xprisma.user.findMany({ where: { tenantId: 1 } })).length);
  console.log("admin", (await prisma.user.findMany()).length);`),
    solutionExplanationHtml: `<p>The <code>query</code> component wraps operations before they reach the engine. Each handler receives the caller's <code>args</code> and a <code>query</code> function that continues the pipeline, so you can rewrite arguments, replace the operation entirely, or inspect the result on the way back. Redefining <code>delete</code> as an <code>update</code> is the clearest case of replacement: the caller's code still reads <code>delete</code>, which keeps the intent legible, while the storage layer keeps the row.</p>
<p>Merging rather than overwriting the <code>where</code> is the detail that separates a working extension from a subtle disaster. Writing <code>args.where = { deletedAt: null }</code> would discard the caller's <code>tenantId</code> filter and quietly return other tenants' rows — a data leak introduced by a helper meant to add safety. The spread keeps both conditions, which is why the tenant read returns one row rather than two.</p>
<p>Coverage is the honest limitation to state. This extension handles <code>findMany</code> and <code>findFirst</code>; <code>findUnique</code>, <code>count</code>, <code>aggregate</code> and relation loads inside an <code>include</code> still see the marked rows unless they are handled too, and <code>findUnique</code> cannot simply take an extra filter because its <code>where</code> accepts only unique fields — the usual workaround is to redirect it to <code>findFirst</code>. Being explicit about which operations are covered beats assuming the extension is total.</p>
<p>Keep the base client reachable for the cases that must bypass the rule: an admin restore screen, a compliance export, a purge job that really deletes after the retention window. And remember the database still enforces its own constraints — a soft-deleted user keeps occupying its unique email, so signing up again with the same address fails unless the uniqueness is scoped, which is the standard second bug of this pattern.</p>`,
    diagramMermaid: `flowchart TD
  A[caller writes user delete] --> B[query extension intercepts]
  B --> C[update sets deletedAt]
  D[caller writes findMany with own where] --> E[extension merges deletedAt null]
  E --> F[engine sees both conditions]
  G[base client] --> H[still sees every row for admin work]`,
    seed: SEED,
    expect: `rowsInTable 3\nvisible 2\nmarked 1\ntenant1 1\nadmin 3`,
  },
  {
    title: 'Scope Every Query to a Tenant Automatically',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['request-scoped extension', 'injecting a filter on reads', 'injecting a value on writes', 'preventing cross-tenant leaks', 'extension per request not per process'],
    prerequisites: ['client extensions', 'soft delete extension'],
    tags: ['prisma', 'extensions', 'multi-tenancy', 'security', 'production'],
    problemHtml: `<p>In a shared-table multi-tenant system, every query must carry the tenant. Relying on developers to remember <code>where: { tenantId }</code> guarantees that one endpoint eventually forgets — and forgetting leaks another customer's data rather than throwing an error. A <strong>request-scoped extension</strong> makes the tenant part of the client instead of part of every call.</p>
<p>Against the reference dataset (posts in tenant 1 and tenant 2):</p>
<ul>
<li>Write <code>forTenant(tenantId: number)</code> returning <code>prisma.$extends({...})</code> that, for <code>post</code>, merges <code>tenantId</code> into the <code>where</code> of <code>findMany</code>, <code>findFirst</code> and <code>count</code>.</li>
<li>Log <code>t1 N</code> and <code>t2 N</code> — posts visible to each tenant's client.</li>
<li>For writes, add a <code>model</code> component method <code>post.createScoped(data)</code> whose parameter type is <code>Omit&lt;Prisma.PostUncheckedCreateInput, "tenantId"&gt;</code>. This matters: a <code>query</code> handler changes <strong>behaviour but not types</strong>, so injecting into <code>args.data</code> alone still leaves <code>tenantId</code> required at the call site and the code will not compile. Create a post through tenant 2's client <strong>without</strong> passing a tenant, then log <code>createdTenant N</code> reading the stored value through the base client.</li>
<li>Show the leak is closed: from tenant 1's client, ask for the post titled <code>P4</code>, which belongs to tenant 2, and log <code>leak</code> followed by <code>none</code> when nothing comes back.</li>
<li>Log <code>total N</code> from the base client to confirm the rows all exist and only visibility was scoped.</li>
</ul>`,
    inputSpec: 'The reference dataset: three posts in tenant 1 (P1, P2, P3) and one in tenant 2 (P4).',
    outputSpec: 'Tenant 1 sees three posts and tenant 2 sees one; a create through tenant 2 stores tenant 2 without being told; tenant 1 cannot reach tenant 2’s post by title; and the base client counts every row.',
    constraints: 'The tenant must be injected by the extension, not passed at the call sites. Merge with the caller’s where and data rather than replacing them.',
    examplesJson: [
      { input: 'forTenant(1).post.findMany()', output: 't1 3', explanation: 'The injected filter narrows the read without the caller mentioning the tenant.' },
      { input: 'forTenant(2).post.createScoped({ title: "P5", views: 0, authorId })', output: 'createdTenant 2', explanation: 'Writes are scoped too — otherwise a row is created that its own tenant cannot see — and the model method is what lets the caller omit tenantId and still compile.' },
      { input: 'forTenant(1).post.findFirst({ where: { title: "P4" } })', output: 'leak none', explanation: 'The title matches but the tenant does not, so the row is invisible rather than merely unlisted.' },
    ],
    hintsJson: [
      'Return the extended client from a function that takes the tenant, so it is bound per request.',
      'Reads merge tenantId into args.where; for writes add a model method, because a query handler cannot narrow the caller’s type.',
      'Never build the extension once at module scope with a mutable current tenant — concurrent requests would race.',
      'Verify with a query that would succeed without the scoping, such as looking up another tenant’s row by title.',
    ],
    solution: wrapPre(`function forTenant(tenantId: number) {
  return prisma.$extends({
    query: {
      post: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
    model: {
      post: {
        // A query handler injects the value but cannot NARROW the caller's
        // type, so writes get a model method whose signature omits tenantId.
        async createScoped(data: Omit<Prisma.PostUncheckedCreateInput, "tenantId">) {
          return prisma.post.create({ data: { ...data, tenantId } });
        },
      },
    },
  });
}`, `  const t1 = forTenant(1);
  const t2 = forTenant(2);

  console.log("t1", await t1.post.count());
  console.log("t2", await t2.post.count());

  const cy = await prisma.user.findUniqueOrThrow({ where: { email: "cy@x.io" } });
  const created = await t2.post.createScoped({ title: "P5", views: 0, authorId: cy.id });
  const stored = await prisma.post.findUniqueOrThrow({ where: { id: created.id } });
  console.log("createdTenant", stored.tenantId);

  const leaked = await t1.post.findFirst({ where: { title: "P4" } });
  console.log("leak", leaked === null ? "none" : leaked.title);

  console.log("total", await prisma.post.count());`),
    solutionExplanationHtml: `<p>Binding the tenant to a <em>client</em> rather than to each query changes the failure mode from silent to impossible. Forgetting a <code>where</code> at a call site no longer leaks: the extension adds it. The shape that makes this safe is the factory — <code>forTenant(id)</code> returns a new extended client per request, capturing the id in a closure. The tempting alternative, one module-level extension reading a mutable "current tenant" variable, breaks the moment two requests interleave on the event loop, and the resulting cross-tenant read is both intermittent and catastrophic.</p>
<p>Writes need the same treatment as reads, for a reason that is easy to miss: a <code>create</code> without a tenant either fails the <code>NOT NULL</code> constraint or, worse, stores a default that makes the row invisible to the tenant who just created it. But writes also expose the sharpest limitation of the <code>query</code> component: <strong>it changes behaviour, not types</strong>. A handler that injects <code>args.data.tenantId</code> works perfectly at runtime and still fails to compile at the call site, because the generated <code>PostUncheckedCreateInput</code> continues to require <code>tenantId</code> — the extension is invisible to the type. The fix is a <code>model</code> method whose signature says what the caller may omit: <code>Omit&lt;Prisma.PostUncheckedCreateInput, "tenantId"&gt;</code>. Runtime enforcement and compile-time ergonomics come from two different components, and knowing which one to reach for saves an afternoon of fighting the type checker.</p>
<p>The leak test is the part worth copying into a real test suite. Looking up another tenant's row <em>by a field that matches</em> is exactly the query that would succeed without scoping, so it fails loudly the day someone adds an operation the extension does not cover. And coverage is again the caveat: <code>update</code>, <code>delete</code>, <code>updateMany</code>, <code>aggregate</code>, <code>groupBy</code> and relation loads all need handling before this is complete — an extension that covers reads only gives a false sense of safety.</p>
<p>For stakes higher than this, application-level scoping is not the strongest tool available. PostgreSQL row-level security enforces the boundary in the database, so even a raw query or a psql session obeys it; the usual production design combines both, with RLS as the backstop and the extension as the ergonomic layer.</p>`,
    seed: SEED,
    expect: `t1 3\nt2 1\ncreatedTenant 2\nleak none\ntotal 5`,
  },
  {
    title: 'Measure and Eliminate an N+1 Query Pattern',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['N+1 detection by counting', 'include as one query per level', 'batching with in', 'query budget', 'measure before optimising'],
    prerequisites: ['query event logging', 'relations'],
    tags: ['prisma', 'performance', 'n-plus-one', 'observability', 'production'],
    problemHtml: `<p>The N+1 pattern is the most common performance bug in data access code, and it is invisible in a code review: a loop over parents that queries children looks perfectly reasonable. It is only obvious when the queries are counted. With three users the loop costs four queries instead of two; with three thousand it costs three thousand and one, and the endpoint that was fine in staging times out in production.</p>
<p>Using a client with query events enabled, measure three ways of loading users and their posts, resetting the counter before each:</p>
<ul>
<li><strong>Loop</strong> — fetch users, then <code>findMany</code> posts once per user. Log <code>loop N</code>.</li>
<li><strong>Include</strong> — one <code>findMany</code> with <code>include: { posts: true }</code>. Log <code>include N</code>.</li>
<li><strong>Batched</strong> — fetch users, then one <code>findMany</code> with <code>authorId: { in: ids }</code>, grouped in memory. Log <code>batched N</code>.</li>
</ul>
<p>Then log <code>sameData true</code> when all three produce the same total post count, and <code>budget ok</code> when the best approach stays within a budget of two queries. The loop must not be optimised away — its cost is the point.</p>`,
    inputSpec: 'The reference dataset: three users owning four posts between them.',
    outputSpec: 'The loop costs four queries — one for the users plus one per user — while both the include and the batched approach cost two, all three returning the same four posts.',
    constraints: 'Counts must come from query events. Do not change the dataset between measurements, and do not collapse the loop version.',
    examplesJson: [
      { input: 'users = findMany(); for (u of users) findMany({ where: { authorId: u.id } })', output: 'loop 4', explanation: 'One query for the users and one per user — the N+1 shape, growing with the data.' },
      { input: 'findMany({ include: { posts: true } })', output: 'include 2', explanation: 'One query per relation level regardless of how many parents came back.' },
      { input: 'findMany({ where: { authorId: { in: ids } } })', output: 'batched 2', explanation: 'The manual equivalent of what include does, useful when the join is across services or needs custom grouping.' },
    ],
    hintsJson: [
      'Reset the event counter immediately before each approach and flush after it.',
      'The loop’s cost is 1 + N — compare it against the row count to recognise the shape.',
      'include is not N+1: it issues one query per relation level, not per parent.',
      'When include does not fit, collect the ids and use a single in query, then group in memory.',
    ],
    solution: bare(`const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
let count = 0;
prisma.$on("query" as never, () => { count += 1; });
const flush = () => new Promise((r) => setTimeout(r, 150));

async function main() {
  await flush();

  // 1. the N+1 shape: one query for parents, then one per parent
  count = 0;
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  let loopPosts = 0;
  for (const u of users) {
    const posts = await prisma.post.findMany({ where: { authorId: u.id } });
    loopPosts += posts.length;
  }
  await flush();
  console.log("loop", count);

  // 2. include: one query per relation level
  count = 0;
  const withPosts = await prisma.user.findMany({ include: { posts: true } });
  const includePosts = withPosts.reduce((n, u) => n + u.posts.length, 0);
  await flush();
  console.log("include", count);

  // 3. manual batching: collect ids, one in query, group in memory
  count = 0;
  const ids = (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);
  const posts = await prisma.post.findMany({ where: { authorId: { in: ids } } });
  const byAuthor = new Map<number, number>();
  for (const p of posts) byAuthor.set(p.authorId, (byAuthor.get(p.authorId) ?? 0) + 1);
  await flush();
  const batchedCount = count;
  console.log("batched", batchedCount);

  console.log("sameData", loopPosts === includePosts && includePosts === posts.length);
  console.log("budget", batchedCount <= 2 ? "ok" : "over");

  await prisma.$disconnect();
}

main();`),
    solutionExplanationHtml: `<p>The numbers say it plainly: four queries for three users, and the relationship is <code>1 + N</code>. That is the signature to recognise — a query count that tracks the row count rather than the code path. Latency compounds it, because the N queries are sequential round trips: at 2 ms each, a thousand users is two seconds of pure waiting, all of it invisible in a profiler that only shows total time in the data layer.</p>
<p><code>include</code> costs two queries and stays at two regardless of how many users come back, because Prisma fetches all children of all parents at once. That is worth stating explicitly, since "include causes N+1" is a common misconception carried over from lazy-loading ORMs where touching <code>user.posts</code> silently issued a query. Prisma has no lazy relation access at all — a relation is either requested in the query or absent from the result — which is precisely the design that makes the cost visible in the code.</p>
<p>Manual batching costs the same two queries and exists for the cases <code>include</code> cannot cover: the parents came from a different service, the children need a custom grouping or a limit per parent, or you are stitching data across a cache. The pattern is always the same — collect the ids, issue one <code>in</code> query, group in memory with a <code>Map</code>. Watch the two limits: a very large <code>in</code> list can exceed parameter limits and should be chunked, and grouping with <code>find</code> inside a loop reintroduces quadratic work in JavaScript instead of the database.</p>
<p>The habit that matters more than any of these fixes is the measurement itself. A query counter attached to the request — logged, or asserted against a budget in tests — turns N+1 from something discovered during an incident into a failing build. That is why the budget check is part of the exercise rather than an afterthought.</p>`,
    diagramMermaid: `flowchart TD
  A[findMany users] --> B[loop issues one query per user]
  B --> C[cost grows as 1 plus N]
  A2[findMany with include posts] --> D[one extra query for all children]
  D --> E[cost stays at 2]
  A3[collect ids then one in query] --> F[cost stays at 2 and grouping happens in memory]`,
    seed: SEED,
    expect: `loop 4\ninclude 2\nbatched 2\nsameData true\nbudget ok`,
  },
  {
    title: 'Bound Interactive Transactions with timeout and maxWait',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['interactive transaction options', 'P2028 timeout', 'holding a connection', 'keeping IO out of transactions', 'maxWait versus timeout'],
    prerequisites: ['interactive transactions', 'error narrowing'],
    tags: ['prisma', 'transactions', 'timeout', 'production', 'reliability'],
    problemHtml: `<p>An interactive transaction holds a connection from the pool for its entire body. Put an HTTP call inside one and a slow third party stops being their problem and becomes your outage: connections pile up, the pool empties, and unrelated endpoints start failing. Prisma defaults to a 5000 ms <code>timeout</code> and a 2000 ms <code>maxWait</code> for exactly this reason, and both are tunable per call.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Run a transaction with <code>{ timeout: 300 }</code> whose body sleeps for 600 ms, catch the failure, and log <code>timedOut</code> followed by the Prisma error code.</li>
<li>Log <code>rolledBack N</code> — the number of accounts named <code>slow</code> that exist afterwards, proving the write inside the timed-out transaction did not survive.</li>
<li>Run the same work correctly: do the slow part <strong>outside</strong> the transaction, then open a short transaction that only writes. Log <code>fast ok</code> and <code>balance N</code>.</li>
<li>Explain the other knob in code: run a transaction with <code>{ maxWait: 50, timeout: 2000 }</code> that succeeds immediately, and log <code>maxWait ok</code>.</li>
</ul>
<p>Do not raise the timeout to make the first case pass — the point is that the shape is wrong, not the limit.</p>`,
    inputSpec: 'The reference dataset with one account named "main" holding a balance of 100.',
    outputSpec: 'The slow transaction fails with the transaction-timeout code and leaves nothing behind, while the restructured version commits quickly and updates the balance.',
    constraints: 'Keep the sleep inside the first transaction and outside the second. Narrow the error rather than matching on its message text.',
    examplesJson: [
      { input: '$transaction(async tx => { await sleep(600); ... }, { timeout: 300 })', output: 'timedOut P2028', explanation: 'The engine aborts the transaction once it exceeds the limit and reports the transaction API error code.' },
      { input: 'counting the row the aborted transaction tried to create', output: 'rolledBack 0', explanation: 'A timed-out transaction is rolled back like any other failure — partial work never lands.' },
      { input: 'doing the slow work first, then a short write transaction', output: 'fast ok and balance 150', explanation: 'The connection is held only for the writes, which is the shape that survives a slow dependency.' },
    ],
    hintsJson: [
      'timeout limits how long the transaction body may run; maxWait limits how long the call waits for a free connection.',
      'Narrow with instanceof Prisma.PrismaClientKnownRequestError and read e.code.',
      'Anything that is not a database operation — HTTP, file IO, waiting — belongs outside the transaction.',
      'Check afterwards that the aborted transaction left nothing behind.',
    ],
    solution: wrapPre(`const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));`, `  try {
    await prisma.$transaction(async (tx) => {
      await tx.account.create({ data: { owner: "slow", balance: 1 } });
      await sleep(600); // a third-party call, in the worst possible place
      await tx.account.update({ where: { owner: "main" }, data: { balance: 999 } });
    }, { timeout: 300 });
    console.log("timedOut none");
  } catch (e) {
    console.log("timedOut", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : "other");
  }
  console.log("rolledBack", await prisma.account.count({ where: { owner: "slow" } }));

  // The same work, restructured: slow part first, transaction only for writes.
  await sleep(600);
  const amount = 50;
  await prisma.$transaction(async (tx) => {
    const acc = await tx.account.findUniqueOrThrow({ where: { owner: "main" } });
    await tx.account.update({ where: { id: acc.id }, data: { balance: acc.balance + amount } });
  }, { timeout: 2000 });
  console.log("fast ok");
  console.log("balance", (await prisma.account.findUniqueOrThrow({ where: { owner: "main" } })).balance);

  await prisma.$transaction(async (tx) => { await tx.account.count(); }, { maxWait: 50, timeout: 2000 });
  console.log("maxWait ok");`),
    solutionExplanationHtml: `<p>The two options bound different waits and are routinely confused. <code>maxWait</code> is how long the call will wait to <em>acquire</em> a connection from the pool before giving up; <code>timeout</code> is how long the transaction may run once it has one. A saturated pool surfaces as <code>maxWait</code> failures, a slow transaction body as <code>timeout</code> failures, and knowing which one you are seeing points at completely different fixes — more connections versus less work inside the transaction.</p>
<p>The timeout here is not a tuning problem, it is a design signal. The sleep represents an HTTP call, and while it runs the transaction holds both a connection and its locks. Under load, N such requests hold N connections doing nothing, the pool empties, and every other query in the process queues behind them — a self-inflicted outage triggered by someone else's latency. Raising the timeout makes the window longer, not safer.</p>
<p>The restructured version follows the rule worth memorising: <strong>a transaction should contain only database work, and as little of it as possible</strong>. Fetch what you need, call the third party, then open a short transaction to write the result. If the outcome depends on data that might change in between, guard the write with a conditional <code>updateMany</code> or an optimistic version check rather than by keeping the transaction open — the concurrency techniques of exercises 7 and 9.</p>
<p>The rollback check matters as much as the error code. A timed-out transaction is aborted, so the account it created never existed as far as any other session is concerned — the same all-or-nothing guarantee as an explicit failure, which is what makes retrying safe. Note also that <code>P2028</code> covers transaction API errors generally, so log the message alongside the code when diagnosing; and for batched work, the array form of <code>$transaction</code> has no interactive body at all and therefore no timeout to blow.</p>`,
    seed: SEED,
    expect: `timedOut P2028\nrolledBack 0\nfast ok\nbalance 150\nmaxWait ok`,
  },
  {
    title: 'Make Concurrency Safe with a Serializable Transaction',
    difficulty: 'MEDIUM', estimatedMinutes: 45, points: 20,
    concepts: ['isolation levels', 'write skew', 'P2034 write conflict', 'read-modify-write races', 'atomic operations as the cheaper fix'],
    prerequisites: ['interactive transactions', 'error narrowing'],
    tags: ['prisma', 'transactions', 'isolation', 'concurrency', 'production'],
    problemHtml: `<p>Two requests that read the same rows, compute from them, and write back can both be individually correct and jointly wrong. PostgreSQL's default <code>Read Committed</code> isolation does not prevent it: each transaction sees a consistent snapshot for its own statements, yet neither notices the other's write. Raising the level to <code>Serializable</code> makes the database detect the conflict and abort one of them with Prisma's <code>P2034</code>.</p>
<p>Against the reference dataset:</p>
<ul>
<li>Write a transaction that reads every account, sums the balances, waits briefly so the two overlap, then inserts a new account holding that sum. Run <strong>two</strong> of them concurrently with <code>{ isolationLevel: "Serializable" }</code> and <code>Promise.allSettled</code>.</li>
<li>Log <code>conflicts N</code> — how many were rejected with <code>P2034</code> — and <code>committed N</code> — how many succeeded. Exactly one of each is the correct outcome.</li>
<li>Log <code>accounts N</code> afterwards to show only one insert landed.</li>
<li>Contrast with the cheaper fix where it applies: increment the <code>main</code> balance by 10 twice concurrently using an <strong>atomic</strong> <code>{ increment: 10 }</code> with no transaction at all, and log <code>atomic N</code> — the resulting balance, which must reflect both writes.</li>
</ul>
<p>Do not serialise the two transactions by awaiting them one after another — the overlap is the experiment.</p>`,
    inputSpec: 'The reference dataset with a single account "main" holding 100, and two concurrent transactions computing a total from it.',
    outputSpec: 'One transaction commits and the other is aborted with the write-conflict code, leaving two accounts in total, while the atomic increments both land and take the balance to 120.',
    constraints: 'Run the two transactions concurrently. Detect the conflict by its Prisma error code, not by its message. Do not add sleeps to make them not overlap.',
    examplesJson: [
      { input: 'two overlapping Serializable transactions reading then writing the same set', output: 'conflicts 1 and committed 1', explanation: 'PostgreSQL detects that the outcome could not have arisen from any serial order and aborts one.' },
      { input: 'the same code at the default isolation level', output: 'both commit and the second sum ignores the first insert', explanation: 'Read Committed permits this write skew, which is why the stronger level is needed for read-then-write invariants.' },
      { input: 'two concurrent update({ data: { balance: { increment: 10 } } })', output: 'atomic 120', explanation: 'An atomic increment is computed by the database per statement, so neither write is lost and no transaction is required.' },
    ],
    hintsJson: [
      'Pass isolationLevel in the second argument of $transaction.',
      'Use Promise.allSettled so both outcomes can be inspected rather than the first rejection winning.',
      'P2034 means "write conflict or deadlock — retry the transaction".',
      'If the new value depends only on the old value of one row, an atomic operator is simpler and never conflicts.',
    ],
    solution: wrapPre(`const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Read a set, derive a value from it, write a row back — the shape that is
// unsafe at Read Committed because neither transaction sees the other's insert.
function sumThenInsert(tag: string) {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.account.findMany();
    const total = rows.reduce((n, r) => n + r.balance, 0);
    await sleep(120);
    await tx.account.create({ data: { owner: tag, balance: total } });
  }, { isolationLevel: "Serializable" });
}`, `  const results = await Promise.allSettled([sumThenInsert("snapshot-a"), sumThenInsert("snapshot-b")]);
  let conflicts = 0;
  let committed = 0;
  for (const r of results) {
    if (r.status === "fulfilled") committed += 1;
    else if (r.reason instanceof Prisma.PrismaClientKnownRequestError && r.reason.code === "P2034") conflicts += 1;
  }
  console.log("conflicts", conflicts);
  console.log("committed", committed);
  console.log("accounts", await prisma.account.count());

  // Where the new value depends only on the old value of ONE row, no
  // transaction is needed: the database does the arithmetic atomically.
  await Promise.all([
    prisma.account.update({ where: { owner: "main" }, data: { balance: { increment: 10 } } }),
    prisma.account.update({ where: { owner: "main" }, data: { balance: { increment: 10 } } }),
  ]);
  console.log("atomic", (await prisma.account.findUniqueOrThrow({ where: { owner: "main" } })).balance);`),
    solutionExplanationHtml: `<p>The bug this prevents is <strong>write skew</strong>: each transaction reads a consistent snapshot, decides something from it, and writes — and the combined result corresponds to no serial order of the two. Real examples are everywhere: two bookings that each check "is the room free", two withdrawals that each check "is the balance sufficient", two schedulers that each check "is someone still on call". Nothing is corrupted at the row level; the <em>invariant</em> is what breaks.</p>
<p><code>Serializable</code> makes PostgreSQL track the read-write dependencies between concurrent transactions and abort one when their outcome could not have arisen serially. Prisma surfaces that as <code>P2034</code>, and the essential consequence is that <strong>the application must be prepared to retry</strong> — a serialisation failure is not a bug report, it is the database asking you to run the transaction again, which is exactly what exercise 9 builds. Aborts also mean the level costs throughput under contention, so apply it to the transactions that carry an invariant rather than globally.</p>
<p>The atomic increment is the contrast worth internalising, because reaching for a heavier isolation level when a simpler tool exists is the more common mistake. <code>{ increment: 10 }</code> compiles to <code>SET balance = balance + 10</code>, computed by the database inside a single statement, so two concurrent updates both land and the total is 120. The read-modify-write version — read 100, add 10 in JavaScript, write 110, twice — loses one of the updates and ends at 110, with no error anywhere. Use an atomic operator whenever the new value depends only on the old value of a single row; escalate to <code>Serializable</code> only when the decision depends on <em>other</em> rows.</p>
<p>Between the two sits a third option worth knowing: <code>SELECT ... FOR UPDATE</code> through <code>$queryRaw</code>, which takes explicit row locks and forces the second transaction to wait rather than fail. It trades retries for blocking — better under heavy contention on a small set of hot rows, worse when it becomes a queue.</p>`,
    diagramMermaid: `sequenceDiagram
  participant A as Transaction A
  participant B as Transaction B
  participant DB as Postgres Serializable
  A->>DB: read all accounts
  B->>DB: read all accounts
  A->>DB: insert derived row
  B->>DB: insert derived row
  DB-->>B: abort with P2034 write conflict
  DB-->>A: commit`,
    seed: SEED,
    expect: `conflicts 1\ncommitted 1\naccounts 2\natomic 120`,
  },
  {
    title: 'Cap the Connection Pool and Prove the Cap Holds',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['connection_limit', 'pool sizing across replicas', 'queueing versus failing', 'pg_stat_activity', 'raw query type pitfalls'],
    prerequisites: ['singleton client', 'raw queries'],
    tags: ['prisma', 'production', 'connections', 'pool', 'scaling'],
    problemHtml: `<p>PostgreSQL's <code>max_connections</code> is a hard, global limit, and every application instance holding a pool consumes part of it. Ten replicas with a default pool are often already over budget, and the failure is abrupt: <code>too many connections for role</code>, affecting every service on the database rather than the one that overshot. The pool size is set per client with <code>connection_limit</code> in the connection string.</p>
<p>Build the measurement:</p>
<ul>
<li>Create a client whose URL carries <code>?connection_limit=2&amp;application_name=codelab_pool</code>.</li>
<li>Issue <strong>six</strong> concurrent queries that each sleep for 400 ms in the database. Cast the sleep — <code>SELECT pg_sleep(0.4)::text AS s</code> — because <code>pg_sleep</code> returns <code>void</code>, which the client cannot deserialise.</li>
<li>While they run, from a <strong>separate</strong> client, count rows in <code>pg_stat_activity</code> matching that <code>application_name</code> and log <code>busy N</code>.</li>
<li>Wait for all six to finish and log <code>completed N</code> — none may be dropped.</li>
<li>After disconnecting, log <code>idle N</code>, the connections remaining.</li>
</ul>
<p>The point is what the numbers show together: the cap is respected, and the excess work waits rather than failing.</p>`,
    inputSpec: 'An idle database and a client configured with a pool of two, issuing six concurrent sleeping queries.',
    outputSpec: 'Exactly two connections exist while six queries are in flight, all six still complete, and nothing is left connected after disconnecting.',
    constraints: 'Measure from a second client — querying through the pooled one would occupy the pool you are measuring. Do not raise the limit to make all six run at once.',
    examplesJson: [
      { input: '?connection_limit=2 with six concurrent queries', output: 'busy 2', explanation: 'The pool caps concurrency; the other four queries wait in the client-side queue.' },
      { input: 'awaiting all six', output: 'completed 6', explanation: 'Exceeding the pool queues work rather than dropping it — until maxWait or the query timeout is reached.' },
      { input: 'SELECT pg_sleep(0.4) without a cast', output: "Failed to deserialize column of type 'void'", explanation: 'The client cannot map void; casting to text gives it something to decode.' },
    ],
    hintsJson: [
      'connection_limit is a query parameter on the connection string, not a client constructor option.',
      'Use a second, separate client to observe, or your measurement changes what it measures.',
      'pg_stat_activity rows are filtered by application_name, which you also set in the URL.',
      'pg_sleep returns void — cast it to text so the result can be decoded.',
      'A PrismaPromise is lazy: start the six queries before sampling, or you will measure an idle pool.',
    ],
    solution: bare(`const APP = "codelab_pool";
const pooled = new PrismaClient({
  datasources: { db: { url: "${URL_}?connection_limit=2&application_name=" + APP } },
});
const observer = new PrismaClient();

async function connections(): Promise<number> {
  const rows = await observer.$queryRaw<{ n: bigint }[]>\`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = \${APP}\`;
  return Number(rows[0].n);
}

async function main() {
  // pg_sleep returns void, which the client cannot deserialise — cast it.
  const work = Array.from({ length: 6 }, () =>
    pooled.$queryRaw<{ s: string }[]>\`SELECT pg_sleep(0.4)::text AS s\`);

  // A PrismaPromise is LAZY: nothing is sent until it is awaited or chained.
  // Kick them all off first, otherwise the sample below measures an idle pool.
  const running = Promise.all(work);

  const sample = new Promise<number>((resolve) => {
    setTimeout(() => { void connections().then(resolve); }, 250);
  });

  const busy = await sample;
  const done = await running;
  console.log("busy", busy);
  console.log("completed", done.length);

  await pooled.$disconnect();
  await new Promise((r) => setTimeout(r, 200));
  console.log("idle", await connections());
  await observer.$disconnect();
}

main();`),
    solutionExplanationHtml: `<p>The measurement makes an abstract setting concrete: six queries are in flight, two connections exist, and all six still complete. That is the behaviour to internalise — exceeding the pool <strong>queues</strong> rather than fails. Work waits client-side for a free connection, which is why an undersized pool shows up as latency and as <code>maxWait</code> timeouts under load, not as immediate errors. An oversized pool fails differently and worse: the database refuses connections for everyone.</p>
<p>Sizing is arithmetic across the fleet, not a per-service preference. Total connections are roughly <code>replicas × connection_limit</code> (plus migrations, cron jobs, and the psql session someone left open), and that total must stay under <code>max_connections</code> with headroom. Prisma's default of <code>num_cpus × 2 + 1</code> is reasonable for one long-lived server and disastrous for a serverless platform where instances scale with traffic — there the only real answer is an external pooler such as PgBouncer in transaction mode, with <code>pgbouncer=true</code> on the URL so Prisma avoids prepared statements the pooler cannot keep.</p>
<p>Three mechanics of the exercise generalise. Observing with a separate client is not fastidiousness: querying through the pooled client would occupy the very pool being measured and report a number caused by the measurement. The laziness of <code>PrismaPromise</code> is the second and it bites here: building the array of queries sends nothing, because a Prisma promise only executes when it is awaited or chained — sampling before starting them measures an idle pool and reports zero, which looks exactly like a pool that is not working. And the <code>::text</code> cast on <code>pg_sleep</code> is a genuine Prisma limitation worth remembering — a raw query returning <code>void</code>, or another type the client has no mapping for, fails with a deserialisation error rather than a SQL error, which sends people looking in the wrong place.</p>
<p>Finally, <code>pg_stat_activity</code> is the tool to reach for in production too. Grouping it by <code>application_name</code> and <code>state</code> shows which service holds connections and whether they are active or idle-in-transaction — the latter being the signature of the long transactions exercise 6 warns about.</p>`,
    seed: SEED,
    expect: `busy 2\ncompleted 6\nidle 0`,
  },
  {
    title: 'Retry Transient Failures with Bounded Exponential Backoff',
    difficulty: 'HARD', estimatedMinutes: 50, points: 25,
    concepts: ['which errors are retryable', 'exponential backoff with jitter', 'bounded attempts', 'idempotence requirement', 'never retry logic errors'],
    prerequisites: ['serializable transactions', 'error narrowing'],
    tags: ['prisma', 'reliability', 'retry', 'production', 'transactions'],
    problemHtml: `<p><code>Serializable</code> only works if the application retries. So does a connection blip, a failover, or a deadlock — all transient, all reported with distinct Prisma codes. What must <em>not</em> be retried is just as important: a unique-constraint violation will fail identically every time, and retrying it turns one error into four plus a delay.</p>
<p>Build the wrapper and prove it on a real conflict:</p>
<ul>
<li>Write <code>withRetry(fn, attempts)</code> that runs <code>fn</code>, and on a <strong>retryable</strong> error (<code>P2034</code> write conflict, <code>P1001</code> unreachable, <code>P1017</code> connection closed) waits <code>50ms × 2^attempt</code> plus a small jitter and tries again, up to the limit. Any other error rethrows immediately.</li>
<li>Run the two conflicting Serializable transactions from exercise 7 concurrently, each wrapped in <code>withRetry</code>. Log <code>completed N</code> — both must eventually succeed — and <code>retried true</code> when at least one attempt was retried.</li>
<li>Log <code>accounts N</code>: both inserts land this time.</li>
<li>Show the non-retryable case: attempt to create a duplicate email inside the wrapper, catch it, and log <code>duplicate P2002</code> and <code>attemptsUsed 1</code> — it must fail on the first try without sleeping.</li>
</ul>
<p>The retried operation must be safe to run twice — say why in your own words before writing the code.</p>`,
    inputSpec: 'The reference dataset, two concurrent Serializable transactions that conflict, and one create that violates a unique constraint.',
    outputSpec: 'Both conflicting transactions eventually commit after at least one retry, leaving three accounts, while the duplicate email fails immediately on its first attempt without being retried.',
    constraints: 'Only the listed codes may be retried. Attempts must be bounded and the delay must grow. Do not retry a unique-constraint violation.',
    examplesJson: [
      { input: 'two conflicting Serializable transactions, each wrapped', output: 'completed 2 and retried true', explanation: 'The aborted one runs again after a short delay, when the other has already committed, and succeeds.' },
      { input: 'a create violating the unique email constraint', output: 'duplicate P2002 and attemptsUsed 1', explanation: 'A deterministic failure is rethrown at once — retrying it wastes time and hides the bug.' },
      { input: 'the delay sequence for three attempts', output: '50 ms, then 100 ms, then 200 ms plus jitter', explanation: 'Doubling spreads retries out, and jitter stops many clients from retrying in lockstep.' },
    ],
    hintsJson: [
      'Keep an explicit set of retryable codes — anything not in it rethrows immediately.',
      'Sleep 50 * 2 ** attempt milliseconds, plus a small random jitter.',
      'Count the attempts so you can assert a non-retryable error used only one.',
      'The whole transaction is retried, so it must be idempotent — which a transaction that rolled back cleanly is.',
    ],
    solution: wrapPre(`const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = new Set(["P2034", "P1001", "P1017"]);

let attemptsUsed = 0;
let retriedAtLeastOnce = false;

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    attemptsUsed += 1;
    try {
      return await fn();
    } catch (e) {
      const retryable = e instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE.has(e.code);
      if (!retryable || attempt >= attempts - 1) throw e;
      retriedAtLeastOnce = true;
      // Exponential backoff with jitter: 50, 100, 200 ms plus a little noise so
      // many clients recovering from the same blip do not resynchronise.
      await sleep(50 * 2 ** attempt + Math.floor(Math.random() * 25));
    }
  }
}

function sumThenInsert(tag: string) {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.account.findMany();
    const total = rows.reduce((n, r) => n + r.balance, 0);
    await sleep(120);
    await tx.account.create({ data: { owner: tag, balance: total } });
  }, { isolationLevel: "Serializable" });
}`, `  const results = await Promise.allSettled([
    withRetry(() => sumThenInsert("retry-a")),
    withRetry(() => sumThenInsert("retry-b")),
  ]);
  console.log("completed", results.filter((r) => r.status === "fulfilled").length);
  console.log("retried", retriedAtLeastOnce);
  console.log("accounts", await prisma.account.count());

  attemptsUsed = 0;
  try {
    await withRetry(() => prisma.user.create({ data: { email: "ann@x.io", name: "Clone", tenantId: 1 } }));
    console.log("duplicate none");
  } catch (e) {
    console.log("duplicate", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : "other");
  }
  console.log("attemptsUsed", attemptsUsed);`),
    solutionExplanationHtml: `<p>The allowlist is the design decision that makes this wrapper safe. Retrying is only correct for failures whose cause may have passed — a write conflict where the competing transaction has now committed, a connection dropped during a failover, a deadlock the database broke by picking a victim. A unique-constraint violation is deterministic: the second attempt hits the same row and fails identically, so retrying it adds latency, multiplies the load, and buries the real error behind a delay. Defaulting to "retry unless known-fatal" inverts the risk; the correct default is "rethrow unless known-transient".</p>
<p>Backoff shape matters under real load. A fixed delay makes every client that failed together retry together, producing a thundering herd that recreates the very contention they are recovering from. Doubling spreads them out, and the jitter breaks the remaining synchronisation — without it, clients that started in lockstep stay in lockstep for every attempt. Bounding the attempts is what turns a retry loop into a failure that eventually surfaces, instead of a request that hangs forever while its connection stays checked out.</p>
<p>Idempotence is the precondition people skip. Retrying re-executes the whole function, so it must be safe to run twice. A transaction is a good unit for this because a rolled-back transaction left nothing behind — which is exactly why the retried unit here is <code>$transaction(...)</code> rather than the individual statements inside it. Retrying a bare sequence of writes where the first succeeded and the second failed would duplicate the first, and that is how retry logic creates the corruption it was meant to prevent.</p>
<p>The result is worth reading carefully: both transactions commit, so three accounts exist, and at least one of them got there on a second attempt. That is <code>Serializable</code> working as designed — the database guarantees correctness by aborting, and the application supplies the liveness by retrying. Two more considerations for production: retries add latency, so a caller with a deadline needs the total budget bounded rather than each attempt; and every retry should be logged and counted, because a rising retry rate is an early signal of contention long before it becomes an error rate.</p>`,
    diagramMermaid: `flowchart TD
  A[run the transaction] --> B{failed}
  B -->|no| C[return the result]
  B -->|yes| D{code is retryable}
  D -->|no| E[rethrow immediately]
  D -->|yes| F{attempts left}
  F -->|no| E
  F -->|yes| G[sleep 50 times 2 to the attempt plus jitter]
  G --> A`,
    seed: SEED,
    expect: `completed 2\nretried true\naccounts 3\nduplicate P2002\nattemptsUsed 1`,
  },
  {
    title: 'Capstone: Compose a Production Data Layer',
    difficulty: 'HARD', estimatedMinutes: 70, points: 30,
    concepts: ['composing extensions', 'extension order', 'retry around a scoped client', 'query budget assertions', 'health check and shutdown'],
    prerequisites: ['extensions', 'retry', 'query logging', 'transactions'],
    tags: ['prisma', 'production', 'capstone', 'extensions', 'observability'],
    problemHtml: `<p>Assemble the module into the data layer you would actually ship: one shared client, cross-cutting rules in extensions, transient failures retried, and every query counted so a regression is visible.</p>
<ul>
<li>Build a base client with query events enabled and a counter, then extend it once with <strong>soft delete</strong> (a <code>post.delete</code> that sets <code>deletedAt</code>, and <code>deletedAt: null</code> merged into <code>findMany</code>) and once more, per request, with <strong>tenant scoping</strong>: a <code>query</code> handler for reads plus a <code>model</code> method <code>createScoped</code> for writes, since a query handler cannot narrow the caller type. Compose them so both rules apply.</li>
<li>Add a computed <code>label</code> field on <code>post</code> via the <code>result</code> component, returning <code>title (views)</code>.</li>
<li>Expose <code>health()</code> running <code>SELECT 1</code> and returning a boolean.</li>
<li>For tenant 1: log <code>visible N</code>, then soft-delete <code>P1</code> and log <code>afterDelete N</code> and <code>stillStored N</code> (base client count of that title).</li>
<li>Log <code>label ...</code> for the first visible post of tenant 1 ordered by title.</li>
<li>Wrap a Serializable transaction that appends a post for tenant 1 in the retry helper, and log <code>created ok</code> then <code>budgetOk true</code> when the whole run stayed under 40 queries.</li>
<li>Log <code>health true</code>, then disconnect.</li>
</ul>
<p>No rule may be enforced at a call site — every one of them lives in the client.</p>`,
    inputSpec: 'The reference dataset: three posts in tenant 1 (P1, P2, P3) and one in tenant 2 (P4), none deleted.',
    outputSpec: 'Tenant 1 sees three posts, two after the soft delete while the row is still stored, the computed label reads "P2 (20)", the retried transaction adds a post, the run stays inside its query budget, and the health check passes.',
    constraints: 'One base client. Extensions compose rather than replace each other. The tenant client must be created per request. No call site may add deletedAt or tenantId itself.',
    examplesJson: [
      { input: 'tenant 1 client after soft-deleting P1', output: 'afterDelete 2 and stillStored 1', explanation: 'Both rules apply at once: the row is hidden by the soft-delete filter and still present in the table.' },
      { input: 'the computed field on the first visible post', output: 'label P2 (20)', explanation: 'The result component derives the label from the columns it declares in needs.' },
      { input: 'the whole run measured by query events', output: 'budgetOk true', explanation: 'A budget assertion turns an accidental N+1 into a failing test rather than a production incident.' },
    ],
    hintsJson: [
      'Chain $extends calls — each returns a new client that keeps the previous extensions.',
      'Apply the process-wide rules first, then the per-request tenant scope on top.',
      'The computed field needs title and views declared in needs.',
      'Assert the query count at the end rather than eyeballing the log.',
    ],
    solution: bare(`const base = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
let queries = 0;
base.$on("query" as never, () => { queries += 1; });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = new Set(["P2034", "P1001", "P1017"]);

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn();
    } catch (e) {
      const retryable = e instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE.has(e.code);
      if (!retryable || attempt >= attempts - 1) throw e;
      await sleep(50 * 2 ** attempt + Math.floor(Math.random() * 25));
    }
  }
}

// Process-wide rules: soft delete plus a computed field.
const core = base
  .$extends({
    query: {
      post: {
        async delete({ args }) {
          return base.post.update({ where: args.where, data: { deletedAt: new Date() } });
        },
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  })
  .$extends({
    result: {
      post: {
        label: {
          needs: { title: true, views: true },
          compute(p) {
            return \`\${p.title} (\${p.views})\`;
          },
        },
      },
    },
  });

// Per-request rule, layered on top of the process-wide ones.
function forTenant(tenantId: number) {
  return core.$extends({
    query: {
      post: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
    model: {
      post: {
        // Behaviour comes from the query component; the narrowed signature
        // that lets callers omit tenantId has to come from a model method.
        async createScoped(data: Omit<Prisma.PostUncheckedCreateInput, "tenantId">) {
          return core.post.create({ data: { ...data, tenantId } });
        },
      },
    },
  });
}

async function health(): Promise<boolean> {
  const rows = await base.$queryRaw<{ ok: number }[]>\`SELECT 1 AS ok\`;
  return rows[0].ok === 1;
}

async function main() {
  const db = forTenant(1);

  console.log("visible", (await db.post.findMany()).length);

  await db.post.delete({ where: { title: "P1" } });
  console.log("afterDelete", (await db.post.findMany()).length);
  console.log("stillStored", await base.post.count({ where: { title: "P1" } }));

  const first = (await db.post.findMany({ orderBy: { title: "asc" } }))[0];
  console.log("label", first.label);

  const ann = await base.user.findUniqueOrThrow({ where: { email: "ann@x.io" } });
  await withRetry(() => base.$transaction(async () => {
    await db.post.createScoped({ title: "P6", views: 60, authorId: ann.id });
  }, { isolationLevel: "Serializable" }));
  console.log("created ok");

  await sleep(200);
  console.log("budgetOk", queries < 40);
  console.log("health", await health());

  await base.$disconnect();
}

main();`),
    solutionExplanationHtml: `<p>Extensions compose by chaining, and each <code>$extends</code> returns a new client that keeps everything applied before it. The layering is deliberate: soft delete and the computed field are process-wide invariants, so they are applied once at startup; the tenant scope depends on the request, so it is applied per request on top of the shared core. Building the tenant layer underneath would mean rebuilding the invariants for every request, and putting the tenant in a mutable variable shared by one client would race between concurrent requests.</p>
<p>Because both <code>findMany</code> handlers run, a single read carries both conditions — <code>deletedAt: null</code> and <code>tenantId</code> — which is why the post count drops after the soft delete while the row is still in the table. That is the payoff of the whole design: two independent rules, neither written at any call site, both impossible to forget. The computed <code>label</code> shows the other extension component travelling through the same chain, its <code>needs</code> ensuring the underlying columns are fetched even when a caller selects only the derived field.</p>
<p>The retry wraps the transaction rather than living inside it, which is the correct nesting: retrying re-runs the whole unit, and a rolled-back transaction leaves nothing behind, so re-running is safe. Note the write still goes through the tenant-scoped client, so the retried statement carries the tenant too — mixing a scoped read with an unscoped write is the standard way tenant leaks reappear after the extension was thought to have solved them.</p>
<p>Two operational touches make this shippable rather than merely elegant. The query budget turns observability into a guarantee: an accidental N+1 added six months from now trips the assertion in CI instead of the pager in production, and the threshold is chosen from a measured baseline rather than a guess. The <code>health()</code> probe is what a readiness endpoint calls — a real round trip to the database, not a boolean the process sets at startup — so an orchestrator stops routing traffic to an instance whose database is gone. Add the <code>SIGTERM</code> disconnect of exercise 1 and the pool cap of exercise 8, and the layer has the four properties that matter in production: correct by construction, observable, resilient to transient failure, and bounded in what it consumes.</p>`,
    diagramMermaid: `flowchart TD
  A[base client with query events] --> B[extend soft delete]
  B --> C[extend computed label]
  C --> D[core client shared by the process]
  D --> E[extend tenant scope per request]
  E --> F[every read carries deletedAt null and tenantId]
  F --> G[retry wraps the transaction not the statements]`,
    seed: SEED,
    expect: `visible 3\nafterDelete 2\nstillStored 1\nlabel P2 (20)\ncreated ok\nbudgetOk true\nhealth true`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VDIR = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/prisma-437';
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
