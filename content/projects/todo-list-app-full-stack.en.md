# Todo List App (Full-Stack)

This is the first project on the roadmap, and it is underestimated more than any other. "Todo list" sounds like a week-one React exercise. But the honest version of it — with user accounts, per-user data isolation, validation on both ends, and a real deployment — contains exactly the pieces that **every** web application afterwards reuses: a users table, a table of rows owned by those users, a mechanism for proving "who I am", and an API layer that rejects anything that cannot prove it.

If you finish this project and still cannot answer "why can't user A read user B's todos", the rest of the roadmap collapses. This article exists so you can answer that question — and about twenty more like it.

> **How to read this.** Every section follows the same shape: design decision → reason → real code → the trap that comes with it. You can type out all the code here and end up with a working app. But the valuable part is the "why" — that is what interviewers ask about, not syntax.

---

## What you are going to build

A personal task manager where each user sees exactly their own data:

- Register with email + password, sign in, sign out
- Create / edit / delete tasks, mark them done
- Priority (low / medium / high) and a due date
- Filter by status, search by title, sort by due date or priority
- Dark / light theme, usable on a phone
- Actually running on the internet, not on `localhost`

Sounds simple. But there are six places where beginners almost always get it wrong, and this article stops at each one:

1. Storing passwords (hashing, not encryption — two different things)
2. Checking permissions on the **server**, not in the UI
3. Validating on both client and server, and understanding why it must be both
4. Telling Server Components apart from Client Components
5. Handling loading and error states instead of assuming success
6. Getting environment variables into production without committing them to Git

---

## Overall architecture

What is distinctive here: **there is no separate backend server**. The Next.js App Router lets you write the UI and the API in one codebase, running in one process. This is the right architecture for a small app, and it is also the fastest way to understand the client/server boundary — because that boundary sits inside the same folder.

```mermaid
flowchart TB
    subgraph browser["Browser"]
        RC["Client Component<br/>TodoItem, TodoForm, FilterBar<br/>has useState, onClick"]
    end

    subgraph vercel["Next.js on Vercel"]
        SC["Server Component<br/>dashboard/page.tsx<br/>queries the DB directly"]
        RH["Route Handler<br/>/api/todos<br/>GET POST PATCH DELETE"]
        MW["Middleware<br/>blocks unauthenticated routes"]
        NA["NextAuth v5<br/>signs and reads the JWT cookie"]
    end

    subgraph data["Data"]
        PG[("PostgreSQL<br/>Neon / Supabase")]
    end

    RC -->|"fetch with cookie"| RH
    RC -.->|"first render"| SC
    MW --> NA
    RH --> NA
    RH -->|"Prisma Client"| PG
    SC -->|"Prisma Client"| PG
    NA -->|"user lookup at sign-in"| PG
```

Three paths reach the database, and they differ in one important way:

- **Server Components** query the DB directly while building the first HTML. No network round trip from the browser. Fastest, but it only runs once, at render time.
- **Route Handlers** serve everything that happens *after* the page appears: pressing "add task", ticking a checkbox. The browser calls them with `fetch`.
- **NextAuth** reads the DB exactly once at sign-in; every request afterwards relies on the JWT in the cookie rather than hitting the database again.

The first trap is right here: **many people write the whole app out of Client Components** because that is what plain React feels like, then wonder why the page loads slowly and has no SEO. The practical rule: *default to Server Components; add `'use client'` only when a component needs `useState`, `useEffect`, or has to catch mouse/keyboard events.*

---

## Setting up from zero

This section is written for someone with nothing installed. If you already have Node and Postgres, skip ahead.

### Node.js

Install **Node 20 or newer** (Next.js 15 needs 18.18 minimum, but 20 is the LTS with the longer support window). Use `nvm` rather than a direct install — sooner or later you will need a different Node per project:

```bash
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 20
nvm use 20
node -v    # must print v20.x
```

### PostgreSQL

Three options, easiest first:

| Approach | Upside | Downside |
|---|---|---|
| **Neon** (neon.tech) | Free, gives you a URL, nothing to install | Needs network, higher latency |
| **Docker** | Matches production, starts and stops fast | Docker must be installed |
| **Native install** | Fastest at runtime | Painful to remove, version conflicts |

For a beginner, Docker is the best balance:

```bash
docker run --name todo-pg \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=todoapp \
  -p 5432:5432 \
  -d postgres:16
```

Check that it is alive:

```bash
docker exec -it todo-pg psql -U postgres -d todoapp -c "SELECT version();"
```

If that prints a Postgres version, you have a database. The connection string is:

```
postgresql://postgres:devpassword@localhost:5432/todoapp
```

### Bootstrapping the project

```bash
npx create-next-app@latest todo-app --typescript --tailwind --app --eslint
cd todo-app
npm install prisma @prisma/client next-auth@beta bcryptjs zod
npm install -D @types/bcryptjs
npx prisma init
```

Why `next-auth@beta`? NextAuth v5 is the rewrite for the App Router; v4 is stable but was designed for the Pages Router and fits awkwardly with Server Components. This article uses v5 throughout.

Why **Zod**? It is a validation library. It answers the "why validate twice" question later on.

---

## Database design

Two tables, one relation. Look at the diagram first, then the code:

```mermaid
erDiagram
    USER ||--o{ TODO : "owns"
    USER {
        string id PK "cuid, unguessable"
        string email UK "unique"
        string name "nullable"
        string password "bcrypt HASH"
        datetime createdAt
    }
    TODO {
        string id PK
        string title "required, max 200"
        string description "nullable"
        boolean completed "default false"
        enum priority "LOW MEDIUM HIGH"
        datetime dueDate "null = no deadline"
        string userId FK "onDelete Cascade"
        datetime createdAt
        datetime updatedAt
    }
```

Read `||--o{` as: one `USER` has **zero or more** `TODO`s, and each `TODO` belongs to **exactly one** `USER`. That "exactly one" is what makes `where: { userId }` sufficient for data isolation — if a todo could belong to several people, the entire authorisation chapter would need rewriting.

Here is the full schema. Read the comments — every line is a decision, not required syntax.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  // cuid() instead of autoincrement(): ids are not guessable.
  // With incrementing ids, user #5 knows for a fact that user #4
  // exists, and knows how many accounts the system has — free
  // business intelligence for a competitor.
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // This is a HASH, not a password. See the "Authentication"
  // section for why that distinction matters.
  password  String
  todos     Todo[]
  createdAt DateTime @default(now())

  @@map("users")
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?

  // Foreign key + onDelete: Cascade.
  // Cascade means deleting a user makes their todos disappear too.
  // Without it, deleting a user either fails on a foreign-key
  // constraint, or worse: leaves "orphan todos" pointing at a
  // user that no longer exists.
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Composite index. EVERY query in this app has the shape
  // "get this user's todos, newest first" — this index lets
  // Postgres read exactly the slice it needs instead of scanning
  // the table and then sorting it.
  @@index([userId, createdAt])
  @@map("todos")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### Why `enum` and not `String`

If `priority` were a `String`, nothing stops a bug from writing `"high"`, `"HIGH "` (trailing space), or `"cao"`. Six months later you have one column holding five variants of the same concept, and every filter query is wrong. An `enum` pushes the check all the way down into Postgres: a bad value is an immediate error, not dirty data discovered later.

### Why `dueDate` is nullable and `completed` is not

`completed` always has an answer — done or not done. `dueDate` does not: plenty of tasks have no deadline. Using `null` for "none" beats a sentinel date like `9999-12-31`, because `null` is naturally excluded by comparisons, whereas a sentinel date slips into every "due soon" filter.

Run the first migration:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

`migrate dev` writes a SQL file into `prisma/migrations/`. **Never edit a migration that has already run** — it is history, not a draft. To change something, create a new migration.

---

## Authentication: the easiest thing to get wrong

### Hash passwords, do not encrypt them

Encryption is two-way — with the key, you get the original back. Hashing is one-way: from the hash you cannot recover the input. Passwords **must** be hashed, because not even you — the system owner — should be able to read a user's password.

`bcrypt` adds two things a plain hash (like SHA-256) does not have:

- **Salt**: a random string mixed in before hashing. So two users who both pick `123456` still end up with different hashes. Without salt, an attacker who steals the database just looks up a precomputed table and gets every common password at once.
- **Cost factor**: the number of rounds, 10 by default (2¹⁰ iterations). Slow hashing is a *feature*, not a flaw: it makes trying billions of passwords expensive.

```ts
// src/app/api/auth/register/route.ts
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  // 8 characters is the practical minimum. Do not require
  // "must contain a special character" — NIST research shows that
  // rule pushes users toward predictable patterns like "Password1!".
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // The message is deliberately vague. Returning "this email is
    // already taken" lets anyone probe whether an address has an
    // account here — a privacy leak, and step one of account
    // enumeration.
    return NextResponse.json(
      { error: 'Could not register with those details' },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, name: name ?? null },
    // Explicit select: NEVER let the password column reach the
    // response, not even the hashed form.
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json(user, { status: 201 });
}
```

### The sign-in flow, step by step

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant N as NextAuth
    participant DB as PostgreSQL

    U->>B: enters email + password
    B->>N: POST /api/auth/callback/credentials
    N->>DB: findUnique(email)
    DB-->>N: user (with the hash)
    N->>N: bcrypt.compare(password, hash)
    alt Match
        N->>N: sign a JWT holding userId
        N-->>B: Set-Cookie httpOnly, carrying the JWT
        B-->>U: redirect to /dashboard
    else No match
        N-->>B: 401
        B-->>U: show "wrong email or password"
    end
```

Note the **httpOnly** flag on that cookie. It means JavaScript on the page **cannot read** it. If a malicious script ever gets injected into the page (an XSS attack), it still cannot steal the token. This is why you never store tokens in `localStorage`: `localStorage` is readable in a single line of JavaScript.

```ts
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        // Return null for EVERY failure — never distinguish
        // "no such user" from "wrong password". Distinguishing
        // them is how you leak the list of registered emails.
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    // These two callbacks exist for a very specific reason: by
    // default a NextAuth JWT does NOT carry `id`. Without them,
    // `session.user.id` is undefined, and every per-user query
    // returns nothing — a silent bug with no error message.
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
```

You also need a type declaration, or TypeScript reports `Property 'id' does not exist`:

```ts
// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    };
  }
}
```

---

## The API layer: where "who sees what" is decided

This is the most important part of the whole project. Read it carefully.

```ts
// src/app/api/todos/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    // THIS is the line that stops user A from reading user B's
    // data. The userId comes from the SIGNED SESSION, not from a
    // query string. If it came from `?userId=...`, anyone could
    // edit the URL and read someone else's rows.
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(todos);
}

const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const parsed = CreateTodoSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.create({
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      // userId does NOT come from the body. Even if the client
      // deliberately sends someone else's userId, it is ignored.
      userId: session.user.id,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
```

### Why validate twice

You already validated in the form. Why validate again on the server?

Because client-side validation is **user experience** — it reports mistakes instantly, without waiting for the network. It is **not security**, because anyone can bypass it: open DevTools, call `fetch('/api/todos', { method: 'POST', body: '...' })` directly, done. No browser form was involved.

The rule: **the client validates to be polite, the server validates to survive.**

### Update and delete: the IDOR trap

```ts
// src/app/api/todos/[id]/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { id } = await params;   // Next.js 15: params is a Promise
  const body = await req.json().catch(() => ({}));

  // updateMany rather than update — and the where clause carries
  // userId as well.
  //
  // This is the defence against IDOR (Insecure Direct Object
  // Reference). Written as `update({ where: { id } })`, any signed-in
  // user could edit anyone's todo just by guessing an id. Adding
  // userId makes the query match zero rows when the id does not
  // belong to the current user.
  const result = await prisma.todo.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.completed !== undefined ? { completed: Boolean(body.completed) } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
    },
  });

  if (result.count === 0) {
    // 404, not 403. Returning 403 ("you lack permission") quietly
    // confirms that the todo EXISTS — information someone who does
    // not own it has no business learning.
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.todo.findUnique({ where: { id } });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { id } = await params;
  const result = await prisma.todo.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
```

IDOR is the most common vulnerability in hand-written CRUD apps, and it *does not* show up when you test it yourself — because you only have one account. How to find it: create two accounts, take the id of a todo belonging to account A, then send `DELETE` using account B's cookie. If it deletes, you just found the hole.

---

## Prisma Client: the hot-reload trap

```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// In dev, Next.js re-imports modules every time you save a file. If
// each reload created a new PrismaClient, after a few dozen edits
// you would have a few dozen connection pools, and Postgres would
// start refusing new connections with "too many clients already".
// Attaching the instance to globalThis lets it survive hot reloads.
// Production deliberately skips this: each process initialises once.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Almost every Next.js + Prisma project carries this snippet, and almost nobody explains why. Now you know.

---

## The UI: the Server / Client boundary

### Dashboard page — a Server Component

```tsx
// src/app/dashboard/page.tsx
// No 'use client' here — this is a Server Component.
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TodoList from '@/components/TodoList';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // This query runs ON THE SERVER, before the HTML is sent. The user
  // receives a page that already has data in it — no "loading..."
  // flash on first paint.
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{session.user.name ?? 'Your'} tasks</h1>
      {/* Data crosses from server to client as props. Everything
          passed over this boundary must be serialisable: strings,
          numbers, booleans, arrays, plain objects, Dates.
          NOT allowed: functions, class instances, Map, Set. */}
      <TodoList initialTodos={todos} />
    </main>
  );
}
```

### The list — a Client Component

```tsx
// src/components/TodoList.tsx
'use client';

import { useState, useMemo } from 'react';
import type { Todo } from '@prisma/client';

type Filter = 'all' | 'active' | 'completed';

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) =>
        query.trim()
          ? t.title.toLowerCase().includes(query.trim().toLowerCase())
          : true,
      );
  }, [todos, filter, query]);

  async function toggle(todo: Todo) {
    // Optimistic update: change the UI NOW, do not wait for the
    // server. The user gets instant feedback instead of a 200ms stare.
    const previous = todos;
    setTodos((ts) =>
      ts.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
    );
    setPendingIds((s) => new Set(s).add(todo.id));

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch {
      // Roll back when the server refuses. Skip this step and the UI
      // and the database will tell two different stories, which the
      // user only discovers after a page refresh.
      setTodos(previous);
      alert('Could not save that change. Please try again.');
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(todo.id);
        return next;
      });
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 rounded-lg border px-3 py-2 dark:bg-slate-800"
        />
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-2 text-sm ${
              filter === f ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          {query ? 'No tasks match that search.' : 'No tasks yet. Add one!'}
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                pendingIds.has(todo.id) ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo)}
                disabled={pendingIds.has(todo.id)}
                className="h-5 w-5"
              />
              <span className={todo.completed ? 'line-through text-slate-500' : ''}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Three details in that component separate beginner code from code written by someone who has shipped, and all three are easy to miss:

1. **The optimistic update has a rollback.** Plenty of tutorials teach the "update immediately" half and forget the "put it back on failure" half.
2. **`pendingIds` is a `Set`, not a `boolean`.** A user ticks three checkboxes in a row — with one shared `loading` flag, all three dim. With a `Set`, only the row actually in flight is disabled.
3. **The empty state distinguishes two cases.** "Nothing here yet" and "nothing matched" are different situations and deserve different sentences.

---

## Middleware: blocking at the door

```ts
// src/middleware.ts
export { auth as middleware } from '@/lib/auth';

export const config = {
  // The matcher runs BEFORE the page renders, at the edge. It does
  // not replace the check inside each Route Handler — it just avoids
  // rendering a whole page before discovering the user is not
  // signed in.
  matcher: ['/dashboard/:path*'],
};
```

Worth remembering: **middleware is a UX optimisation, not your only security layer.** Route Handlers must still check the session themselves. Rely on middleware alone and one mistyped matcher pattern is enough to expose the entire API.

---

## Testing

Writing tests for the first project sounds excessive. But these three catch exactly the bugs you cannot find by clicking around.

```ts
// tests/todos.api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('data isolation between users', () => {
  let userA: { id: string }, userB: { id: string }, todoOfA: { id: string };

  beforeEach(async () => {
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();
    userA = await prisma.user.create({
      data: { email: 'a@test.dev', password: 'x' },
      select: { id: true },
    });
    userB = await prisma.user.create({
      data: { email: 'b@test.dev', password: 'x' },
      select: { id: true },
    });
    todoOfA = await prisma.todo.create({
      data: { title: "A's task", userId: userA.id },
      select: { id: true },
    });
  });

  it("B cannot edit A's todo", async () => {
    const result = await prisma.todo.updateMany({
      where: { id: todoOfA.id, userId: userB.id },
      data: { title: 'hijacked' },
    });
    expect(result.count).toBe(0);
  });

  it("B cannot delete A's todo", async () => {
    const result = await prisma.todo.deleteMany({
      where: { id: todoOfA.id, userId: userB.id },
    });
    expect(result.count).toBe(0);
    expect(await prisma.todo.count()).toBe(1);
  });

  it('deleting a user removes their todos', async () => {
    await prisma.user.delete({ where: { id: userA.id } });
    expect(await prisma.todo.count({ where: { userId: userA.id } })).toBe(0);
  });
});
```

The third test exercises `onDelete: Cascade` — something you declared in the schema but have never watched run. It is also how you find out when somebody (possibly you, six months later) accidentally drops the `Cascade` during a schema edit.

---

## Going to production

### Environment variables

Three of them, and none get committed:

```bash
# .env.local — this file MUST be in .gitignore
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."          # generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

`AUTH_SECRET` is the key used to **sign** JWTs. Whoever holds it can mint a valid token for any account — meaning they can take over every account in the system. Leaking this key is worse than leaking the whole database of hashed passwords.

Check `.gitignore` **before** the first commit:

```bash
git check-ignore -v .env.local
# Output = correctly ignored. No output = DANGER.
```

If you already committed it: rotate the key immediately. Deleting the file in a later commit is not enough — it stays in Git history and anyone who clones the repo can read it.

### Deploying to Vercel

```bash
npm i -g vercel
vercel link
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel --prod
```

Production migrations run with `migrate deploy`, **not** `migrate dev`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

The distinction matters: `migrate dev` can *create* migrations and, in some situations, will offer to reset the database. On production, resetting the database means losing all user data. `migrate deploy` only applies migrations already committed to the repo — it never generates and never resets.

---

## Traps, written down

| Symptom | Actual cause | Fix |
|---|---|---|
| `session.user.id` is `undefined` | The default JWT carries no `id` | Add the `jwt` and `session` callbacks |
| `too many clients already` | Every hot reload made a new PrismaClient | Attach the instance to `globalThis` |
| Users see other people's data | `where` is missing `userId` | Always include `userId` from the session |
| Todos editable via Postman | Used `update` instead of `updateMany` with `userId` | Switch to `updateMany` / `deleteMany` |
| Build error: `PrismaClient is unable to run in browser` | Imported `prisma` into a Client Component | Import only in Server Components / Route Handlers |
| Blank page after deploy | Missing env vars on Vercel | Compare with `vercel env ls` |
| `Type error: params.id` | Next.js 15 made `params` a Promise | `const { id } = await params` |

---

## When it counts as finished

Not when the code runs. When all seven of these are true:

- [ ] Two accounts created, and account A provably cannot see — or modify — account B's data, verified with `curl` rather than through the UI
- [ ] Calling the API with no cookie returns a proper 401, not a 500
- [ ] An empty `title` and a 10,000-character `title` are both rejected with 400
- [ ] Killing the network mid-checkbox leaves the UI in the old state rather than a wrong one
- [ ] `git log -p | grep -i "AUTH_SECRET"` returns nothing
- [ ] The app runs on a real domain and opens on a phone
- [ ] The README has screenshots and instructions that work on a clean machine

That last one is worth more than it looks: a recruiter opens the repo, reads the README, and decides in thirty seconds. A README with screenshots and three working commands beats a better project that nobody can run.

---

## Where to go next

Once this runs reliably, two extensions are worth doing — and both lead straight into the next project on the roadmap:

1. **Share a list with other people.** Add a `TodoListMember` table, and suddenly "who is allowed to read what" is no longer answerable with a single `userId` column. That is the first step into real authorisation.
2. **Real-time sync.** Two devices open the same list; ticking on one updates the other. That is the problem [Real-Time Chat App](/projects/real-time-chat-app-1-1) solves properly, with WebSockets.
