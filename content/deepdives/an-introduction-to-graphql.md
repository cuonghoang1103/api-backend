GraphQL gets introduced badly. Half the articles sell it as the successor to REST, the other half as a way to "query your database from the frontend", and both leave you with the wrong model in your head — which shows up months later as an API nobody can cache and a server that falls over when someone nests a query five levels deep.

Here's a more useful framing. GraphQL is two things bolted together: **a typed contract** for your API, and a rule that **the client states the shape of the response it wants**. Everything else — resolvers, DataLoader, connections, complexity limits — exists to make those two things survive contact with a real database.

Every query in this guide was executed against a real schema with `graphql` 16.14, and the outputs are what came back. Where a number appears, I measured it.

---

## The problem it was built for

A post detail screen needs: the post's title, its author's name, and the bodies of three comments. With a conventional REST API that's three round trips, and each endpoint hands you the whole resource because it has no idea what your screen wanted.

![The same screen, fetched two ways](/deepdives/graphql/one-request-many-shapes.svg)

I measured both shapes with the same data:

```
REST    : 3 round trips · 3062 bytes
GraphQL : 1 round trip  · 478 bytes
→ 6.4× fewer bytes, 3 trips → 1
```

Two distinct problems there, and they have names worth knowing because they're the whole pitch:

- **Over-fetching** — `/users/1` returned a 400-character bio, an email and two timestamps so we could display a name.
- **Under-fetching** — no single endpoint answers the screen's question, so the client makes three requests and stitches. On a phone on 4G, three sequential round trips is most of your latency budget.

The REST answer to this is a purpose-built endpoint: `GET /posts/10/detail-screen`, returning exactly what that screen needs. That works — and it's what most teams should do first. It stops working when you have eight clients (web, iOS, Android, an admin panel, a partner integration) each wanting a different shape, because now you're maintaining eight endpoints that all query the same tables and drift apart.

GraphQL's bet is: instead of the server guessing shapes, publish a typed graph of what exists and let each client ask for its own shape. That bet has a price, and the second half of this guide is mostly about paying it.

---

## The schema is the contract

A GraphQL API starts with a schema written in SDL (Schema Definition Language). This is not documentation that rots — it's the executable definition of what your API can do:

```graphql
type Author {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  body: String
  author: Author!
}

type Query {
  post(id: ID!): Post
  posts: [Post!]!
}
```

Read the punctuation, because it carries most of the meaning:

- `!` means **non-null** — this field will never be null. `String` may be null; `String!` may not.
- `[Post!]!` is a **non-null list of non-null posts**: the list itself is always there, and no element inside is ever null. `[Post]` would allow both `null` and `[null, post]`.
- `ID` is a built-in scalar (serialised as a string) alongside `String`, `Int`, `Float`, `Boolean`. Everything else you define.
- `Query` is the entry point. There are exactly three roots: `Query`, `Mutation`, `Subscription`.

The types are what make the tooling work. Ask for a field that doesn't exist and you never reach a resolver — validation rejects the document before execution:

```
{ post(id: "10") { title, subtitle } }
```
```
Cannot query field "subtitle" on type "Post". Did you mean "title"?
```

Same for arguments, which is the class of bug that costs an afternoon in an untyped API:

```
{ post { title } }
```
```
Field "post" argument "id" of type "ID!" is required, but it was not provided.
```

That check happens server-side on every request, and — because the schema is introspectable — the same information powers editor autocomplete, generated TypeScript types, and the API explorer. This is the honest advantage of GraphQL that survives every argument about REST: **the contract is machine-readable, and it cannot silently disagree with the implementation.**

Four more schema constructs you'll meet immediately:

```graphql
enum Role { ADMIN  EDITOR  READER }        # a closed set, validated for you

interface Node { id: ID! }                  # shared fields, many types
type Post implements Node { id: ID!  title: String! }

union SearchResult = Post | Author          # "one of these", no shared fields

input CreatePostInput {                     # arguments have their own types
  title: String!
  body: String
  tags: [String!] = []                      # …with defaults
}
```

`input` types matter more than they look: GraphQL keeps input and output types separate on purpose, so you can't accidentally accept a whole `Post` (with its `id` and `author`) as the payload for creating one.

---

## Resolvers: every field is a function

The schema says what exists. **Resolvers** say where the data comes from. There is conceptually one per field, and the server executes them as a tree, level by level.

![How a query is executed as a tree of resolvers](/deepdives/graphql/resolver-tree.svg)

A resolver takes four arguments, and knowing them is 80% of writing a GraphQL server:

```js
const resolvers = {
  Query: {
    // (parent, args, context, info)
    post: (_, { id }, ctx) => ctx.db.post.findUnique({ where: { id } }),
  },
  Post: {
    // parent is the Post returned above; this runs once per post
    author: (post, _, ctx) =>
      ctx.db.author.findUnique({ where: { id: post.authorId } }),
  },
};
```

- **`parent`** — whatever the field's parent resolver returned. `Post.author` receives the post.
- **`args`** — the arguments from the query, already validated against the schema.
- **`context`** — per-request state you build in the server setup: the authenticated user, database handles, loaders. This is where auth lives.
- **`info`** — the parsed query and execution state. Powerful, and a smell if you reach for it often.

You don't write resolvers for most fields: if the parent object already has a property with the right name, the **default resolver** returns it. `Post.title` needs no code because `post.title` exists. You write resolvers where the shape of your storage differs from the shape of your graph — which, notice, is exactly where the expensive work is.

Executed for real, that schema and those resolvers give you:

```
{ post(id: "10") { title author { name } } }
```
```json
{
  "data": {
    "post": {
      "title": "Indexing basics",
      "author": { "name": "Mai" }
    }
  }
}
```

The response mirrors the query, key for key. That property is why GraphQL clients can cache and normalise automatically, and it's a consequence of the client having named the shape.

---

## A whole server, in one file

Before the theory goes any further, here is the smallest thing that deserves the name. No framework — `node:http` and the reference `graphql` package, because a GraphQL server is genuinely just "parse, validate, execute, serialise" and it's worth seeing that once before Apollo hides it:

```js
import http from 'node:http';
import { buildSchema, graphql } from 'graphql';
import DataLoader from 'dataloader';

const schema = buildSchema(`
  type Author { id: ID!  name: String! }
  type Post { id: ID!  title: String!  author: Author! }
  type Query { posts: [Post!]!  post(id: ID!): Post }
`);

function makeContext() {                   // ONE context per request
  return { loaders: { authors: new DataLoader(ids => DB.findAuthors(ids)) } };
}
const withAuthor = (p, ctx) =>
  ({ ...p, author: () => ctx.loaders.authors.load(p.authorId) });

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || !req.url.startsWith('/graphql')) {
    res.writeHead(404).end('not found'); return;
  }
  const { query, variables, operationName } = JSON.parse(await readBody(req));
  const result = await graphql({
    schema, source: query, variableValues: variables, operationName,
    contextValue: makeContext(),
    rootValue: {
      posts: (_a, ctx) => DB.posts.map(p => withAuthor(p, ctx)),
      post: ({ id }, ctx) => withAuthor(DB.posts.find(x => x.id === id), ctx),
    },
  });
  res.writeHead(200, { 'content-type': 'application/json' })
     .end(JSON.stringify(result));
});
```

Running, and hit over real HTTP:

```
query   → {"data":{"posts":[{"title":"post 0","author":{"name":"Mai"}}, … ]}}
           (1 author query for 3 posts)
vars    → {"data":{"post":{"title":"post 1"}}}
bad     → "Cannot query field \"nope\" on type \"Post\"."
GET /other → 404
```

Four things in that file are the actual shape of every GraphQL server you'll meet, framework or not:

1. **One endpoint, POST, JSON body of `{ query, variables, operationName }`.** That's the whole transport convention.
2. **The context is built per request** — that's the line that makes DataLoader safe, and the one people get wrong by hoisting it to module scope.
3. **Errors come back inside a `200`.** The bad query returned HTTP 200 with an `errors` array; only transport-level failures use status codes.
4. **Nothing about auth yet.** There's no route to protect, so authorisation has to live somewhere else — see below.

In production you'd reach for Apollo Server, GraphQL Yoga or Mercurius, which add persisted queries, subscriptions over WebSocket, tracing, file uploads and a playground. None of them change the four points above.

---

## Errors: partial data, and the `!` that decides how much you lose

GraphQL responses can carry **both** data and errors, which surprises people coming from REST where a request is a success or a failure. There's no 404 for a missing post and no 500 for a failing resolver — the HTTP status is `200` and the truth is in the body.

What happens when a resolver throws depends entirely on nullability, and this is the most consequential schema decision you'll make.

![How a resolver error propagates](/deepdives/graphql/null-bubbling.svg)

Same failing resolver, twice. First with `profile: Profile!` — non-null:

```json
{"data":{"user":null},"errors":["profile service down @ user.profile"]}
```

The whole `user` is gone. `id` and `name` resolved perfectly well, and you got none of them, because a non-null field cannot hold null — so the error climbs to the parent, and if that parent is also non-null it climbs again, all the way to `data: null` if nothing along the path can absorb it.

Now the identical failure with `profile: Profile` — nullable:

```json
{"data":{"user":{"id":"1","name":"Mai","profile":null}},"errors":["profile service down"]}
```

The failure stops at the field that can hold it. The screen still renders a name.

So `!` is not "I'd prefer this to be filled in" — it's a **blast radius** declaration. My rule: mark a field non-null when the parent is genuinely meaningless without it (a `Post` with no `id`), and leave it nullable when a partial answer is still useful (anything from a separate service, anything computed, anything that can time out). Schemas that are non-null everywhere look rigorous and then blank an entire page because one flaky downstream call failed.

Two related habits worth adopting early:

- **`errors[].path`** tells you exactly which field blew up. Log it. A GraphQL error without a path is nearly useless in an incident.
- **Don't leak internals.** By default a thrown error's message goes to the client. Wrap unexpected failures (`new GraphQLError('Internal error', { extensions: { code: 'INTERNAL' } })`) and log the original, or your stack traces end up in someone's browser console.

---

## N+1: the failure mode you will absolutely hit

Look again at the resolver tree. `Query.posts` runs once and returns five posts; then `Post.author` runs **once per post**. Each call knows about exactly one post, so each one goes to the database on its own.

I counted the lookups for a five-post query:

```
naive      : 5 author lookups for 5 posts
DataLoader : 1 author lookup(s) — batch was [0,1]
```

Five became one. With fifty posts it's fifty versus one, and this is how a GraphQL endpoint that tests fine locally melts a production database — the query didn't change, the row count did.

The fix is **batching**: collect all the ids requested during one tick of the event loop, fetch them in a single query, hand each resolver back its own row. That's what `DataLoader` does, in about the amount of code you'd hope:

```js
import DataLoader from 'dataloader';

// One loader per REQUEST, created in the context factory
const authorLoader = new DataLoader(async (ids) => {
  const rows = await db.author.findMany({ where: { id: { in: ids } } });
  const byId = new Map(rows.map(r => [r.id, r]));
  return ids.map(id => byId.get(id) ?? null);   // MUST match input order & length
});

// resolver
Post: { author: (post, _, ctx) => ctx.loaders.author.load(post.authorId) }
```

Three rules that turn DataLoader from a footgun into a tool:

1. **Return results in the same order and length as the keys.** The loader maps positionally; a `findMany` that drops missing rows silently misaligns every result. That `Map` lookup is the standard shape for a reason.
2. **One loader per request, never a module-level singleton.** A loader caches by key for its lifetime — which is what makes it fast, and what makes a global one serve user A's data to user B and keep stale rows alive for as long as the process runs.
3. **Batching is not the same as caching.** The per-request cache means asking for the same author twice in one query is free. It says nothing about the *next* request; that's a separate decision (Redis, a response cache) with separate invalidation.

Batching is why GraphQL's flexibility is affordable at all. Get this wrong and every other optimisation is noise.

---

## Mutations: writes, and the two kinds of failure

Mutations look like queries with a different root. The convention that matters is the shape: **one input object in, one payload object out.**

```graphql
input CreatePostInput { title: String!  body: String  tags: [String!] = [] }

type CreatePostPayload {
  post: Post
  problems: [String!]!
}

type Mutation { createPost(input: CreatePostInput!): CreatePostPayload! }
```

Executed, the happy path and the rejected path look like this:

```
ok   → {"createPost":{"post":{"id":"101","title":"Indexing","tags":["db"]},"problems":[]}}
bad  → {"createPost":{"post":null,"problems":["title must be at least 3 characters"]}}
```

Notice what the failure is *not*: it isn't in the top-level `errors` array. That's deliberate, and it's the single most useful convention in GraphQL API design.

**Expected failures are data.** "Title too short", "email already taken", "coupon expired" — these are outcomes your UI must render, so they belong in the typed payload where the client can't forget to handle them, and where they arrive with the same type safety as everything else. (A production schema usually types them properly — `problems: [UserError!]!` with `field` and `message` — rather than plain strings.)

**Unexpected failures are errors.** The database is down, a bug threw a `TypeError`. Those go in `errors[]`, get logged, and the client shows "something went wrong".

Two more things about mutations that trip people:

- The `input` wrapper (rather than loose arguments) means adding a field later is a non-breaking change, and clients can pass one variable instead of six.
- Multiple mutations in one document run **in series**, top to bottom, unlike query fields which may run in parallel. That's specified, and it's what makes `createUser` then `sendInvite` in one request safe.

---

## What the client can do with the contract

Everything so far has been server-side. The query language itself has four features that stop clients from re-implementing the same plumbing.

**Variables** — never string-interpolate user input into a query:

```graphql
query Post($id: ID!, $withBody: Boolean!) {
  post(id: $id) { title  body @include(if: $withBody) }
}
```

**Aliases** let you ask for the same field twice with different arguments — impossible in REST without two requests:

```graphql
query Two {
  first:  post(id: "10") { ...card }
  second: post(id: "11") { ...card }
}
fragment card on Post { id title body @include(if: $withBody) }
```

**Fragments** name a reusable selection. In component-based UIs this is the whole game: each component declares the fields it needs as a fragment, the page composes them, and nobody over-fetches or breaks when a component changes.

**Directives** — `@include(if:)` and `@skip(if:)` — let one document serve two shapes. Same query, run twice with different variables:

```
@include(false) → {"first":{"id":"10","title":"Indexing"},"second":{"id":"11","title":"Plans"}}
@include(true)  → {"first":{"id":"10","title":"Indexing","body":"body 10"}, …}
```

And **introspection**, the feature that all the tooling is built on:

```
{ __schema { types { name } } }
```
```
["Post","ID","String","Query","Boolean"]
```

Any GraphQL server can describe itself. That's how GraphiQL builds an explorer, how codegen produces TypeScript types from your schema, and how a client library knows your field names without you writing a spec document. It's also, as we'll see, a thing you have to think about before going to production.

---

## Authorisation lives in the graph, not on the route

This is the part that catches teams migrating from REST hardest, and it follows from the one-endpoint design: **there is no route to protect.** `POST /graphql` is either open or closed; every finer-grained decision has to happen inside the schema.

Which is not a downside once you see the shape of it. Authorisation becomes a property of a *field*, checked with the viewer from `context`:

```js
const withAuth = (viewer) => USERS.map(u => ({
  ...u,
  email: () => {
    if (!viewer) throw new GraphQLError('Not authenticated',
      { extensions: { code: 'UNAUTHENTICATED' } });
    if (viewer.role === 'ADMIN' || viewer.id === u.id) return u.email;
    return null;              // nullable ⇒ hide the field, keep the response
  },
}));
```

The same query, `{ users { name email } }`, run as three different viewers:

```
anonymous        → {"users":[{"name":"Mai","email":null},{"name":"Tuan","email":null}]}  errors: 2
READER id=1      → {"users":[{"name":"Mai","email":"mai@x.dev"},{"name":"Tuan","email":null}]}
ADMIN id=9       → {"users":[{"name":"Mai","email":"mai@x.dev"},{"name":"Tuan","email":"tuan@x.dev"}]}
```

Look at the middle row: the reader sees their own email and `null` for the other person's, in one response, with no error. That's field-level authorisation doing something a REST endpoint can't do without two shapes — and it's why `email` being **nullable** matters. If it were `email: String!`, hiding it would null the whole `User`, and hiding one field would delete a row from the list.

Three rules I'd hold to:

- **The viewer comes from `context`, always.** Resolve the token once, in the context factory, and never read headers inside a resolver. It's the only place that scales past twenty resolvers.
- **Deny in the resolver, not in the query.** A client-side "don't ask for `email` unless admin" is not authorisation, it's a suggestion.
- **Decide per field, not per type.** "Can this viewer see *this* user's email" is the real question, and it needs the parent object, which is exactly what a field resolver has.

For anything beyond a handful of rules, push the check down into your data layer (a `can(viewer, action, resource)` function, or row-level security in Postgres) and call it from the resolver. Scattering `if (viewer.role === …)` across fifty resolvers is how authorisation bugs get shipped — and it's a strictly worse version of the middleware you left behind in REST.

---

## Interfaces, unions and `__typename`

When a field can return more than one kind of thing — a search result, a feed item, a notification — you need a polymorphic type and a way for the server to say which one each object is:

```js
const Node = new GraphQLInterfaceType({
  name: 'Node',
  fields: { id: { type: new GraphQLNonNull(GraphQLID) } },
  resolveType: (v) => (v.title ? 'Post' : 'Author'),     // the important line
});
```

The client then asks for shared fields directly and specific fields behind **inline fragments**:

```graphql
{ search { id __typename ... on Post { title } ... on Author { name } } }
```
```json
{"search":[{"id":"1","__typename":"Post","title":"Indexing"},
           {"id":"2","__typename":"Author","name":"Mai"}]}
```

`resolveType` is the piece nobody warns you about: without it, execution fails at runtime on a valid query, because the server literally cannot tell which type it's holding. Interfaces and unions are the one place a GraphQL schema needs an explicit escape hatch back into your own data model.

`__typename` deserves a note of its own — every client cache uses it. Apollo's normalised store keys entries on `__typename` plus `id`, which is why it can update a post in one screen after a mutation in another. Two consequences: expose a stable `id` on anything cacheable, and never mutate the meaning of a type's `id` between releases.

And **use an interface rather than a union when the types share fields.** A union forces the client to spell out every branch, so adding a fifth member to `SearchResult` silently drops it from every existing query.

---

## Subscriptions, briefly

The third root type pushes data instead of answering a request. A subscription resolver returns an **async iterator**, and the runtime forwards each yielded value through the normal execution machinery:

```js
async function* ticker() {
  for (let i = 1; i <= 3; i++) {
    await new Promise(r => setTimeout(r, 40));
    yield { ticks: { seq: i, at: `t+${i * 40}ms` } };
  }
}
const it = await subscribe({
  schema, document: parse(`subscription { ticks { seq at } }`),
  rootValue: { ticks: ticker },
});
for await (const ev of it) console.log('event →', JSON.stringify(ev.data));
```
```
event → {"ticks":{"seq":1,"at":"t+40ms"}}
event → {"ticks":{"seq":2,"at":"t+80ms"}}
event → {"ticks":{"seq":3,"at":"t+120ms"}}
```

That's the mechanism. The hard part is everything around it: subscriptions need a WebSocket (or SSE) transport, a pub/sub broker if you run more than one server process — an in-memory `PubSub` is a single-instance toy — plus authorisation on connect *and* on each event, and a plan for what happens to state a client missed while disconnected.

My advice after watching several teams do this: reach for subscriptions when you genuinely need server-pushed events, and use polling or SSE for "keep this list fresh". A `setInterval` refetch is unglamorous, stateless, and survives a deploy.

---

## Five schema mistakes that are hard to undo

Schemas are public API. Getting these wrong is a migration, not a refactor.

**1. Mirroring your database tables.** The schema is the *client's* model, not your storage layout. If `Post` has `authorId` in the graph instead of `author: Author!`, you've published a join key and made every client do the join. Junction tables should never appear at all.

**2. Booleans where an enum belongs.** `isDraft: Boolean!` becomes `isDraft`, `isArchived`, `isPending` — three booleans with four illegal combinations. `status: PostStatus!` was one field from the start, and adding a state later is additive.

**3. Non-null by default.** Covered above, and it's the most common one: `!` everywhere reads as rigour and behaves as a blast radius. Non-null the things that are structurally required; leave the rest nullable.

**4. Mutations returning the bare entity.** `createPost: Post!` leaves nowhere for expected failures, nowhere for side-effect data ("post created, invite email queued"), and no room to grow. A payload type costs one line and never needs breaking.

**5. Fields that lie about cost.** `Post.viewCount` looks free next to `Post.title` and might be a `COUNT(*)` over a million rows. The client has no way to know. Either make it cheap (materialise it), or make it obviously not-free in the schema — behind a `stats: PostStats` object, with a cost weight attached — because a field's shape is the only signal the client gets.

Deprecate rather than delete: `field: String @deprecated(reason: "use otherField")` keeps clients working while tooling nags them. Removing a field is only safe once your operation logs show nobody asks for it — which is another argument for insisting every client names its operations.

---

## Pagination, and why everyone uses that weird `edges` shape

Nothing forces a pagination style, but the ecosystem converged on one, and it's worth understanding rather than copying.

The obvious approach is offsets:

```graphql
posts(limit: 20, offset: 40): [Post!]!
```

It works until the list changes underneath you. Someone publishes a post while a reader is on page 2; every row shifts by one, and page 3 re-shows an item they already saw. Delete a row and an item is skipped entirely. Worse, `OFFSET 100000` makes the database count and discard a hundred thousand rows on every request.

Cursor pagination asks "what comes after *this specific row*" instead of "what comes after position N":

```graphql
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int          # nullable on purpose — COUNT(*) is often the slow part
}
type PostEdge { node: Post!  cursor: String! }
type PageInfo { hasNextPage: Boolean!  endCursor: String }

type Query { posts(first: Int!, after: String): PostConnection! }
```

The `edges`/`node` layer looks like ceremony, and there is a reason for it: the edge is where **relationship** data goes. `PostEdge` can carry `addedAt` or `role` — facts about *this post's membership in this list*, which belong neither to the post nor to the page. If you never need that, a simpler `{ nodes, pageInfo }` shape is perfectly legitimate; the reason to follow the Relay convention anyway is that client caches and codegen already understand it.

The cursor itself should be opaque to the client (base64 of the sort key plus id is typical) precisely so you can change the sort implementation later without breaking anyone.

---

## Caching: the bill for the flexibility

This is where GraphQL asks for something back, and where teams get surprised six months in.

REST caching is mostly free because a resource has a URL. `GET /posts/10` can be cached by the browser, by a CDN, by nginx, by an ETag — none of which you wrote. GraphQL sends a **POST to a single endpoint** with a different body every time, and every layer of that stack shrugs.

What you get instead:

**Client-side normalised cache.** Apollo Client and urql store the response by type and id (`Post:10`) rather than by request, so a post fetched inside one screen is already there for another. This is genuinely better than REST caching *within* a session, and it's the reason people say GraphQL feels fast. It also means your schema must expose stable `id`s, or the cache can't identify anything.

**Persisted queries** buy back the HTTP layer. The client sends a hash instead of a query body; the server looks it up in an allowlist. Now the request can be a `GET` with the hash in the URL — cacheable by CDN — and, as a bonus, a client can't send a query you never approved.

**Server-side response caching** is per-field and needs thought: `@cacheControl(maxAge: 60)` on a public field, `scope: PRIVATE` on anything user-specific. The whole-response TTL you'd use for a REST endpoint doesn't apply, because one document mixes public and private fields.

The honest summary: if your API is public, high-traffic and read-mostly, REST plus a CDN is hard to beat and GraphQL will cost you real engineering to approach. If your API is authenticated and per-user — where CDN caching was never going to help — you're giving up much less than the comparison suggests.

---

## Before you put it in production

A REST endpoint can only do what you wrote. A GraphQL endpoint can do whatever a client asks, and that is a security posture, not a feature. Five things to have in place.

**Depth limiting.** Circular relations mean a client can nest forever: `posts { author { posts { author { … } } } }`. A validation rule that rejects it is about fifteen lines, and rules run *before* execution, so nothing touches the database:

```js
const maxDepth = (limit) => (ctx) => ({
  Field: {
    enter(node, key, parent, path, ancestors) {
      const depth = ancestors.filter(a => a && a.kind === 'SelectionSet').length;
      if (depth > limit) ctx.reportError(new GraphQLError(
        `Query is too deep: ${depth} > ${limit}`, { nodes: [node] }));
    },
  },
});
validate(schema, parse(query), [...specifiedRules, maxDepth(4)]);
```
```
shallow  → passed validation
deep     → Query is too deep: 5 > 4
```

**Cost/complexity analysis.** Depth isn't enough: `posts(first: 10000) { comments(first: 1000) { … } }` is shallow and ruinous. Assign each field a cost, multiply by list sizes, reject above a budget (`graphql-cost-analysis`, or the built-in limits in Apollo Server and Yoga). Then rate-limit by *cost*, not by request count — one request is not one unit of work here.

**A cap on list arguments.** Every paginated field needs a maximum `first`. Without it your complexity budget is theatre.

**Timeouts and cancellation.** One slow resolver shouldn't hold a connection open forever. Pass an `AbortSignal` through context into your data layer.

**Introspection and error detail in production.** Turning introspection off is weak security — the schema leaks through error messages and client bundles anyway — but combined with a persisted-query allowlist it's meaningful: unknown queries are simply rejected. Do turn off "did you mean" suggestions and stack traces in error responses.

Add to that the operational habits that make a GraphQL server debuggable at 3am: log the **operation name** (insist clients name their queries), log resolver-level timings, and alert on the p99 of the slowest resolver rather than of the endpoint — the endpoint's average tells you nothing when one field is the problem.

---

## Testing, and how a schema evolves without breaking clients

Two things make a GraphQL API pleasant to maintain, and both are cheap to set up on day one — and expensive to retrofit after twenty clients depend on you.

**Test through `graphql()`, not over HTTP.** The reference implementation is a function, so a resolver test needs no server, no port and no supertest:

```js
import { graphql } from 'graphql';
import { schema, makeContext } from '../src/graphql/index.js';

test('a reader cannot see another user’s email', async () => {
  const res = await graphql({
    schema,
    source: `{ users { name email } }`,
    contextValue: makeContext({ viewer: { id: '1', role: 'READER' } }),
  });
  expect(res.errors).toBeUndefined();
  expect(res.data.users[1].email).toBeNull();
});
```

That runs in milliseconds and covers the thing most likely to be wrong: authorisation per field, per viewer. Write one per sensitive field and you have a permissions test suite that actually gets run.

**Snapshot the schema in CI.** The schema is your public contract, so treat a change to it like a change to a lockfile — visible in the diff:

```bash
node scripts/print-schema.mjs > schema.graphql   # printSchema(schema)
git diff --exit-code schema.graphql              # CI fails if it moved silently
```

Then upgrade that to a real breaking-change check (`graphql-inspector diff schema.graphql origin/main:schema.graphql`), which knows the rules: adding a field or an optional argument is safe; removing a field, renaming it, making a nullable field non-null, adding a required argument, or removing an enum value are all breaking. That last one surprises people — a client with a `switch` over your enum breaks when a value disappears, so enums grow but never shrink.

The evolution playbook that follows from this is short:

1. **Add, don't change.** New field alongside the old one.
2. **Deprecate with a reason** — `@deprecated(reason: "use publishedAt")`. Tooling surfaces it in editors and playgrounds.
3. **Watch your operation logs** until the old field's usage is zero. (This only works if clients name their operations — one more reason to require it.)
4. **Then remove.** Usually a release or two later, never in the same deploy as the addition.

There's no versioning in GraphQL, no `/v2/graphql`, and that's on purpose: a versioned API means maintaining both forever. One evolving schema plus deprecation is the trade, and it only works if you can see what's being asked for. Log the operation name, the fields, and the client id from day one — retrofitting that after you need it is the single most annoying task on this list.

---

## When not to use it

I'll be direct, because most introductions won't be: the site you're reading this on serves about forty feature modules over a plain REST API, and that was the right call.

GraphQL earns its complexity when **many different clients need many different shapes of the same graph**. If you have one web client and one team, the schema layer, the loader layer, the complexity limits and the caching workarounds are all cost with little return — a purpose-built REST endpoint per screen is less code, cacheable for free, and debuggable with `curl`.

Signals you actually want it:

- Three or more clients with genuinely different needs (web + iOS + Android + partners).
- A deeply connected domain where every screen wants a different slice — social graphs, catalogues, project management.
- Independent client teams who would otherwise queue behind your backlog for every new field.
- You're building a gateway over several services, and clients shouldn't have to know how many.

Signals you don't:

- Mostly file uploads, streaming, or binary — GraphQL is a poor fit and multipart uploads are an unhappy add-on.
- A public read-heavy API that lives or dies on CDN caching.
- CRUD over a handful of tables for one frontend. This is the common case, and REST is fine.
- Nobody on the team has run it in production and the deadline is Friday. The failure modes above are all learnable, and none of them are learnable in three days.

A middle path most teams underrate: keep REST for the boring 80% and add a single GraphQL endpoint for the two screens with genuinely hairy data requirements. Nothing forces one style per company.

| | REST | GraphQL |
|---|---|---|
| Response shape | server decides | client decides |
| Round trips for a composite screen | several | one |
| Contract | OpenAPI, if maintained | the schema, always |
| HTTP/CDN caching | free, by URL | needs persisted queries + `GET` |
| Client cache | you write it | normalised, by type+id |
| Over-fetching | usual | you asked for it |
| Cost of a hostile client | bounded by the endpoint | bounded by *your* limits |
| N+1 risk | in one handler you control | at every nested field |
| Errors | HTTP status | `200` + `errors[]` + partial data |
| Learning curve for the team | low | real |

---

## Cheat sheet

| Thing | Shape |
|---|---|
| Non-null field | `name: String!` |
| List of non-null, always present | `posts: [Post!]!` |
| Entry points | `type Query` · `type Mutation` · `type Subscription` |
| Resolver signature | `(parent, args, context, info)` |
| Per-request state | build it in `context` — user, db, loaders |
| Batch a nested field | one `DataLoader` per request, per entity |
| Loader contract | return same length and order as keys |
| Expected failure | typed field in the mutation payload |
| Unexpected failure | throw → `errors[]`, log `error.path` |
| Same field twice | aliases: `a: post(id:"1")` |
| Reusable selection | `fragment card on Post { … }` |
| Conditional field | `body @include(if: $flag)` |
| Pagination | `first`/`after` + `PageInfo` + opaque cursors |
| Hard limits before prod | depth · cost · max `first` · timeout |
| Cacheable over HTTP | persisted queries sent as `GET` |

---

## Where to go next

- **[Code Lab](/code-lab)** — graded GraphQL exercises against a real schema: write the resolvers, then fix the N+1 you just created. Doing it once beats reading it three times.
- **[Node.js from Zero to Production](/courses)** — the layer underneath: HTTP, PostgreSQL, auth and the query patterns a resolver ends up calling.
- **[RoadMap](/roadmap)** — where GraphQL sits in a backend path, and what's worth learning before it (SQL and indexing, mostly — a GraphQL server is a database access pattern wearing a nice contract).

And a closing suggestion: before adopting it anywhere real, build the five-post `posts { author { name } }` example yourself with a query counter in the resolver, exactly as I did above. Watching `5` become `1` is what makes every later decision about loaders, caching and limits feel obvious instead of arbitrary.

