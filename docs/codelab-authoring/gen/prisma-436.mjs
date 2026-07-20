// prisma-orm module 436 (migrations-and-schema-changes) — 10 exercises.
// Every migration in here was applied against a real Postgres (cl_pg) and every
// quoted error message is copied from actual CLI output, not paraphrased.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'prisma-orm';
const moduleSlug = 'migrations-and-schema-changes';

const DS = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
`;

const ex = [
  {
    title: 'Create the First Migration and Read What Prisma Wrote',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['migrate dev', 'migration history folder', '_prisma_migrations table', 'generated SQL', 'migrate status'],
    prerequisites: ['schema basics', 'DATABASE_URL'],
    tags: ['prisma', 'migrations', 'schema', 'cli', 'setup'],
    problemHtml: `<p>A migration is a plain <code>.sql</code> file that Prisma writes for you and then remembers having run. <code>prisma migrate dev --name init</code> compares your schema with the migration history, generates the SQL that closes the gap, applies it, and records the fact in a table called <code>_prisma_migrations</code>. Everything after this exercise depends on understanding those three artefacts: the schema you edit, the SQL file that is committed to git, and the row in the database that says it already ran.</p>
<p>Starting from an empty database:</p>
<ul>
<li>Write a schema with a <code>User</code> model (auto-increment <code>id</code>, unique <code>email</code>, <code>name</code>) and a <code>Post</code> model (auto-increment <code>id</code>, <code>title</code>, <code>published</code> defaulting to false, and an <code>authorId</code> relation to <code>User</code>).</li>
<li>Run <code>npx prisma migrate dev --name init</code>.</li>
<li>Report what it produced: the number of files under <code>prisma/migrations</code> holding SQL, whether the generated SQL contains <code>CREATE TABLE "User"</code> and the foreign key, and the number of rows in <code>_prisma_migrations</code>.</li>
<li>Run <code>npx prisma migrate status</code> and confirm it reports the database as up to date.</li>
</ul>
<p>Print <code>migrations 1</code>, <code>tables Post, User</code> (from the database catalogue, alphabetical), <code>fk 1</code> for the number of foreign keys on <code>Post</code>, and <code>applied 1</code> for the recorded migration count.</p>`,
    inputSpec: 'An empty PostgreSQL database and a project with DATABASE_URL set. No migrations exist yet.',
    outputSpec: 'One migration directory, the two tables created with one foreign key from Post to User, and exactly one row recorded in _prisma_migrations.',
    constraints: 'Do not create tables with raw SQL or prisma db push — the history must own the schema. Do not edit the generated migration in this exercise.',
    examplesJson: [
      { input: 'npx prisma migrate dev --name init', output: 'migrations 1', explanation: 'One directory named <timestamp>_init containing a single migration.sql.' },
      { input: 'the generated migration.sql', output: 'CREATE TABLE "User" ... ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey"', explanation: 'Tables first, then indexes, then the foreign keys — Prisma orders the statements so they can run top to bottom.' },
      { input: 'SELECT count(*) FROM _prisma_migrations', output: 'applied 1', explanation: 'The history table is how Prisma knows this migration must never run again.' },
    ],
    hintsJson: [
      'The migration name becomes part of the folder name, prefixed by a UTC timestamp.',
      'Look inside prisma/migrations/<timestamp>_init/migration.sql — it is ordinary SQL you can read.',
      '_prisma_migrations lives in the same database and is created by the first migration.',
      'migrate status compares the folders on disk against the rows in that table.',
    ],
    files: [
      { name: 'schema.prisma', language: 'prisma', code: `${DS}
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}` },
      { name: 'commands.sh', language: 'bash', code: `# 1. create and apply the first migration
npx prisma migrate dev --name init

# 2. inspect what it wrote
ls prisma/migrations                       # <timestamp>_init  migration_lock.toml
cat prisma/migrations/*_init/migration.sql # CREATE TABLE "User" ... ADD CONSTRAINT ... FOREIGN KEY

# 3. confirm the history agrees with the database
npx prisma migrate status                  # Database schema is up to date!` },
    ],
    solutionExplanationHtml: `<p>Three artefacts come out of one command, and keeping them straight is the whole mental model. The <strong>schema</strong> is the desired state you edit. The <strong>migration file</strong> is the imperative SQL that moves a database from the previous state to that one; it is committed to git and must never be edited once it has run anywhere real. The <strong>_prisma_migrations table</strong> lives inside the database and records which migrations already ran, which is what makes <code>migrate deploy</code> idempotent on every environment.</p>
<p>Reading the generated SQL is a habit worth forming immediately. Prisma orders the statements so they apply top to bottom — tables, then unique indexes, then foreign keys — because a constraint cannot reference a table that does not exist yet. The naming is mechanical and predictable: <code>User_email_key</code> for the unique index, <code>Post_authorId_fkey</code> for the foreign key. When a later migration fails, this file is the first place to look, and being able to read it is what separates fixing a migration from guessing at it.</p>
<p>The timestamp prefix defines the order, so migrations from two branches interleave by when they were created rather than when they were merged — a real source of surprises on a busy team, and the reason to rebase and re-create rather than hand-edit timestamps. Finally, note what <em>not</em> to do: <code>prisma db push</code> also makes the database match the schema, but it writes no history, so the next <code>migrate dev</code> sees a database it cannot explain. Use <code>db push</code> for a throwaway prototype database only; anything another person or environment will see needs migrations.</p>`,
    diagramMermaid: `flowchart LR
  A[schema.prisma desired state] --> B[migrate dev generates SQL]
  B --> C[migration.sql committed to git]
  C --> D[applied to the database]
  D --> E[row written in _prisma_migrations]
  E --> F[migrate status compares folders with rows]`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}'
migrate init
echo "migrations $(ls -d prisma/migrations/*/ | wc -l | tr -d ' ')"
echo "tables $(psql_q "select string_agg(tablename, ', ' order by tablename) from pg_tables where schemaname='public' and tablename not like '\\_prisma%'")"
echo "fk $(psql_q "select count(*) from pg_constraint where conrelid='\\"Post\\"'::regclass and contype='f'")"
echo "applied $(psql_q "select count(*) from _prisma_migrations where finished_at is not null")"`,
    expect: `migrations 1\ntables Post, User\nfk 1\napplied 1`,
  },
  {
    title: 'Evolve the Schema with an Additive Migration',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['additive change', 'nullable column', 'new model', 'existing rows survive', 'incremental history'],
    prerequisites: ['migrate dev', 'schema models'],
    tags: ['prisma', 'migrations', 'additive', 'schema', 'alter'],
    problemHtml: `<p>An <strong>additive</strong> change — a new nullable column, a new table, a new index — is the safest kind, because nothing that already exists stops being valid. Old rows get <code>NULL</code> in the new column, old application code keeps working because it never mentions it, and the migration needs no data handling at all. Recognising which changes are additive is the difference between a deploy nobody notices and an outage.</p>
<p>Starting from the schema and migration of exercise 1, with two users and three posts already stored:</p>
<ul>
<li>Add a nullable <code>bio String?</code> to <code>User</code> and a nullable <code>views Int?</code> to <code>Post</code>.</li>
<li>Add a whole new model <code>Tag</code> with an auto-increment <code>id</code> and a unique <code>name</code>.</li>
<li>Create and apply the migration with <code>npx prisma migrate dev --name add_bio_views_tag</code>.</li>
</ul>
<p>Then report: <code>migrations N</code> (directories on disk), <code>users N</code> and <code>posts N</code> to prove no data was lost, <code>nullbios N</code> for the users whose new column is <code>NULL</code>, and <code>tag N</code> for the number of tables named <code>Tag</code> that now exist.</p>`,
    inputSpec: 'The database from exercise 1 containing two users (ann@x.io, bob@x.io) and three posts.',
    outputSpec: 'A second migration directory, both existing users and all three posts intact, both users holding NULL in the new bio column, and the Tag table created.',
    constraints: 'The new columns must be nullable — do not add a default to dodge the question. Do not reset the database or edit the first migration.',
    examplesJson: [
      { input: 'the generated migration.sql', output: 'ALTER TABLE "User" ADD COLUMN "bio" TEXT;', explanation: 'A nullable column is a single ALTER with no rewrite and no default, which is why it is instant even on a large table.' },
      { input: 'SELECT count(*) FROM "User" WHERE bio IS NULL', output: 'nullbios 2', explanation: 'Existing rows receive NULL — the column is added, never backfilled.' },
      { input: 'SELECT count(*) FROM "User"', output: 'users 2', explanation: 'An additive migration touches structure only; both rows survive untouched.' },
    ],
    hintsJson: [
      'A trailing ? in the schema type makes the column nullable.',
      'Adding a model generates a CREATE TABLE in the same migration as the ALTERs.',
      'Check the row counts before and after — an additive migration must not change them.',
      'One migration can carry several unrelated additive changes.',
    ],
    files: [
      { name: 'schema.prisma', language: 'prisma', code: `${DS}
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  bio   String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  views     Int?
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}

model Tag {
  id   Int    @id @default(autoincrement())
  name String @unique
}` },
      { name: 'commands.sh', language: 'bash', code: `npx prisma migrate dev --name add_bio_views_tag

# the generated SQL, in full:
#   ALTER TABLE "User" ADD COLUMN "bio" TEXT;
#   ALTER TABLE "Post" ADD COLUMN "views" INTEGER;
#   CREATE TABLE "Tag" ("id" SERIAL NOT NULL, "name" TEXT NOT NULL, CONSTRAINT "Tag_pkey" PRIMARY KEY ("id"));
#   CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

npx prisma migrate status   # 2 migrations found, database schema is up to date` },
    ],
    solutionExplanationHtml: `<p>Every statement in this migration is additive, and that is why it is boring in the best sense: <code>ADD COLUMN</code> with no default and no <code>NOT NULL</code> is a metadata-only change in modern PostgreSQL, so it does not rewrite the table and does not hold a long lock even on millions of rows. Existing rows get <code>NULL</code>, which is exactly the honest answer for "we did not know this about them".</p>
<p>The compatibility story matters as much as the SQL. Old application code does not select or write the new columns, so it keeps working after the migration and before the new deploy — which means the migration can ship <em>first</em>, separately, and be verified on its own. That ordering (migrate, then deploy code) is only safe for additive changes; the moment a change removes or narrows something, the two must be sequenced the other way or split into several steps, which is what exercises 3, 4 and 9 are about.</p>
<p>Two habits are worth keeping from here. First, verify counts before and after — a structural migration that changes a row count is a bug, and noticing it immediately is far cheaper than discovering it in a report next week. Second, resist adding a default just to make a column non-nullable: <code>bio String @default("")</code> would compile and apply, but it fabricates data, and later you cannot distinguish "no bio" from "deliberately empty bio". Nullability is information.</p>`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}'
migrate init
psql_x "insert into \\"User\\"(email,name) values ('ann@x.io','Ann'),('bob@x.io','Bob')"
psql_x "insert into \\"Post\\"(title,\\"authorId\\") select 'P'||g, (select id from \\"User\\" order by id limit 1) from generate_series(1,3) g"
write_schema '
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  bio   String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  views     Int?
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}

model Tag {
  id   Int    @id @default(autoincrement())
  name String @unique
}'
migrate add_bio_views_tag
echo "migrations $(ls -d prisma/migrations/*/ | wc -l | tr -d ' ')"
echo "users $(psql_q 'select count(*) from "User"')"
echo "posts $(psql_q 'select count(*) from "Post"')"
echo "nullbios $(psql_q 'select count(*) from "User" where bio is null')"
echo "tag $(psql_q "select count(*) from pg_tables where schemaname='public' and tablename='Tag'")"`,
    expect: `migrations 2\nusers 2\nposts 3\nnullbios 2\ntag 1`,
  },
  {
    title: 'Add a Required Column to a Table That Already Has Rows',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['the required-column error', 'three-step expand pattern', 'backfill', 'create-only migrations', 'NOT NULL without a default'],
    prerequisites: ['additive migrations', 'migrate dev'],
    tags: ['prisma', 'migrations', 'backfill', 'not-null', 'schema'],
    problemHtml: `<p>Adding <code>country String</code> to a populated table is the first migration that refuses to run, and the message says exactly why:</p>
<pre>⚠️ We found changes that cannot be executed:

  • Step 0 Added the required column \`country\` to the \`User\` table without a default value. There are 2 rows in this table, it is not possible to execute this step.</pre>
<p>There is no value the existing rows could hold, and Prisma will not invent one. The fix is the <strong>three-step pattern</strong>, and it is the same shape every time: widen, fill, tighten.</p>
<ul>
<li><strong>Step 1</strong> — add the column as nullable (<code>country String?</code>) and migrate. Existing rows get <code>NULL</code>; nothing breaks.</li>
<li><strong>Step 2</strong> — backfill. Create an empty migration with <code>npx prisma migrate dev --create-only --name backfill_country</code> and write the <code>UPDATE</code> yourself, so the data change is versioned alongside the structural one.</li>
<li><strong>Step 3</strong> — tighten to <code>country String</code> and migrate again. Now every row has a value, so the <code>SET NOT NULL</code> succeeds.</li>
</ul>
<p>Apply this to a <code>User</code> table holding <code>ann@x.io</code> and <code>bob@x.io</code>, backfilling <code>VN</code>. Report <code>step1nulls N</code> after step 1, <code>filled N</code> after step 2, <code>nullable YES/NO</code> after step 3, and <code>users N</code> to prove nothing was lost.</p>`,
    inputSpec: 'A User table with two rows and no country column, under an existing migration history.',
    outputSpec: 'Both rows hold NULL after the widening step, both hold VN after the backfill, the column reports NOT NULL after the tightening step, and both users survive all three.',
    constraints: 'Three separate migrations. Do not delete rows, do not reset the database, and do not paper over the problem with a schema-level @default.',
    examplesJson: [
      { input: 'country String added directly to a table with 2 rows', output: 'Step 0 Added the required column `country` to the `User` table without a default value. There are 2 rows in this table, it is not possible to execute this step.', explanation: 'Prisma refuses rather than fabricating values — the error names the table and the row count.' },
      { input: "migrate dev --create-only --name backfill_country, then UPDATE \"User\" SET country = 'VN' WHERE country IS NULL", output: 'filled 2', explanation: 'An empty migration is the supported place to put a data change so it runs exactly once, in order, on every environment.' },
      { input: 'changing the field to country String and migrating again', output: 'nullable NO', explanation: 'ALTER COLUMN SET NOT NULL succeeds now that no row holds NULL.' },
    ],
    hintsJson: [
      'The blocker is not the column, it is the existing rows — widen first so they stay valid.',
      '--create-only writes the migration without applying it, which is how you add custom SQL.',
      'Guard the backfill with WHERE country IS NULL so re-running it is harmless.',
      'Only after every row has a value can the third migration set NOT NULL.',
    ],
    files: [
      { name: 'step1.prisma', language: 'prisma', code: `// Step 1 — widen: nullable, applied with: npx prisma migrate dev --name add_country_nullable
model User {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  name    String
  country String?
}` },
      { name: 'step2_backfill.sql', language: 'sql', code: `-- Step 2 — fill: npx prisma migrate dev --create-only --name backfill_country
-- then write this by hand into the generated migration.sql and apply with: npx prisma migrate dev
UPDATE "User" SET "country" = 'VN' WHERE "country" IS NULL;` },
      { name: 'step3.prisma', language: 'prisma', code: `// Step 3 — tighten: required, applied with: npx prisma migrate dev --name require_country
// generated SQL: ALTER TABLE "User" ALTER COLUMN "country" SET NOT NULL;
model User {
  id      Int    @id @default(autoincrement())
  email   String @unique
  name    String
  country String
}` },
    ],
    solutionExplanationHtml: `<p>The error is a refusal to guess, and it is the right one. A <code>NOT NULL</code> column must hold a value in every row, including the two that already exist, and only you know what that value should be. The three-step pattern encodes the answer: <strong>widen</strong> so old rows stay legal, <strong>fill</strong> them with a value you chose deliberately, then <strong>tighten</strong> so the invariant holds from now on.</p>
<p>Putting the backfill in a migration rather than a one-off script is what makes it reproducible. Every environment — a teammate's laptop, staging, production — runs the same <code>UPDATE</code> exactly once, in the same position in the sequence, and the migration history records that it happened. A script someone runs by hand on production is a step that will be forgotten on the next environment, and its absence surfaces as the third migration failing there and nowhere else. Writing the <code>UPDATE</code> with <code>WHERE country IS NULL</code> also makes it idempotent, which matters when a migration is retried after a partial failure.</p>
<p>The alternative shortcut — <code>country String @default("VN")</code> — does apply in one step, and it is occasionally right. But it fabricates a value for rows nobody looked at, and it leaves a default in the schema that silently applies to future inserts too, hiding bugs where the application forgot to set the field. If a default genuinely belongs in the domain, keep it; if it exists only to get past this error, take the three steps. Note that the tightening step is a brief exclusive lock while PostgreSQL verifies the column, which on a very large table is worth scheduling — the modern trick is to add a <code>NOT VALID</code> check constraint, validate it without blocking, then set <code>NOT NULL</code>.</p>`,
    diagramMermaid: `flowchart LR
  A[required column on populated table] --> B[migration refuses]
  B --> C[step 1 add nullable column]
  C --> D[step 2 backfill with an UPDATE migration]
  D --> E[step 3 set NOT NULL]
  E --> F[invariant holds for old and new rows]`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \\"User\\"(email,name) values ('ann@x.io','Ann'),('bob@x.io','Bob')"
# step 1 — widen
write_schema '
model User {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  name    String
  country String?
}'
migrate add_country_nullable
echo "step1nulls $(psql_q 'select count(*) from "User" where country is null')"
# step 2 — backfill as its own migration
custom_migration backfill_country "UPDATE \\"User\\" SET \\"country\\" = 'VN' WHERE \\"country\\" IS NULL;"
echo "filled $(psql_q "select count(*) from \\"User\\" where country = 'VN'")"
# step 3 — tighten
write_schema '
model User {
  id      Int    @id @default(autoincrement())
  email   String @unique
  name    String
  country String
}'
migrate require_country
echo "nullable $(psql_q "select case when is_nullable='NO' then 'NO' else 'YES' end from information_schema.columns where table_name='User' and column_name='country'")"
echo "users $(psql_q 'select count(*) from "User"')"`,
    expect: `step1nulls 2\nfilled 2\nnullable NO\nusers 2`,
  },
  {
    title: 'Rename a Column Without Throwing the Data Away',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['rename is not detected', 'drop plus add data loss', 'create-only', 'editing generated SQL', 'RENAME COLUMN'],
    prerequisites: ['migrate dev', 'create-only migrations'],
    tags: ['prisma', 'migrations', 'rename', 'data-loss', 'sql'],
    problemHtml: `<p>Prisma diffs <strong>states</strong>, not intentions. Renaming <code>name</code> to <code>fullName</code> in the schema looks to the differ exactly like deleting one column and adding another, so the generated migration is:</p>
<pre>ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;</pre>
<p>That applies cleanly and destroys every name in the table. The generated SQL is a draft, not a verdict — the fix is to intercept it before it runs and say what you actually meant.</p>
<ul>
<li>Rename the field in the schema, then generate the migration <strong>without applying it</strong>: <code>npx prisma migrate dev --create-only --name rename_name_to_fullname</code>.</li>
<li>Open the generated <code>migration.sql</code>, delete the drop-and-add, and replace it with <code>ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";</code>.</li>
<li>Apply it with <code>npx prisma migrate dev</code>.</li>
</ul>
<p>Do this on a table holding <code>Ann Lee</code> and <code>Bob Ray</code>. Report <code>rows N</code>, <code>names ...</code> (the values of <code>fullName</code> ordered ascending, comma-separated) and <code>oldcol N</code> — the number of columns still called <code>name</code>, which must be zero.</p>`,
    inputSpec: 'A User table with two rows whose name column holds "Ann Lee" and "Bob Ray".',
    outputSpec: 'Both rows survive with their original names now under fullName, and the old column no longer exists.',
    constraints: 'The data must be preserved by the SQL itself — no export, no re-insert, no application-level copy. Use --create-only and hand-edit the migration.',
    examplesJson: [
      { input: 'the SQL Prisma generates for a rename', output: 'ALTER TABLE "User" DROP COLUMN "name", ADD COLUMN "fullName" TEXT NOT NULL;', explanation: 'The differ sees a removed column and a new one; it has no way to know they are the same thing.' },
      { input: 'the hand-edited replacement', output: 'ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";', explanation: 'One statement, no rewrite, and every value keeps its row.' },
      { input: 'SELECT "fullName" FROM "User" ORDER BY 1', output: 'names Ann Lee, Bob Ray', explanation: 'The data is intact, which the drop-and-add version would not have managed.' },
    ],
    hintsJson: [
      'A rename is invisible to a state-based differ — it only sees the before and after shapes.',
      '--create-only is the checkpoint that lets you review SQL before it touches data.',
      'Replace the whole generated statement; do not add the rename alongside it.',
      'After applying, confirm no column named name remains and the row values survived.',
    ],
    files: [
      { name: 'schema.prisma', language: 'prisma', code: `${DS}
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  fullName String
}` },
      { name: 'migration.sql', language: 'sql', code: `-- Generated by --create-only, then REPLACED by hand.
-- What Prisma wrote (data loss — do not ship this):
--   ALTER TABLE "User" DROP COLUMN "name",
--   ADD COLUMN     "fullName" TEXT NOT NULL;

-- What we mean:
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";` },
      { name: 'commands.sh', language: 'bash', code: `# 1. edit schema.prisma: name -> fullName
# 2. generate WITHOUT applying, so the SQL can be reviewed
npx prisma migrate dev --create-only --name rename_name_to_fullname

# 3. edit prisma/migrations/*_rename_name_to_fullname/migration.sql by hand (see above)

# 4. apply the edited migration
npx prisma migrate dev

# 5. verify the data survived
npx prisma studio   # or: SELECT "fullName" FROM "User";` },
    ],
    solutionExplanationHtml: `<p>This is the sharpest lesson in schema tooling: a state-based differ compares two shapes and cannot recover intent. "Rename" and "drop one column, add another" describe the same before-and-after, so Prisma emits the destructive version — and it applies without error, which is what makes it dangerous. A migration that fails is a nuisance; a migration that succeeds and silently empties a column is an incident.</p>
<p><code>--create-only</code> exists precisely for this. It writes the migration and stops, giving you a review checkpoint between generation and execution. Once edited, the file is just SQL, and <code>ALTER TABLE ... RENAME COLUMN</code> is a metadata-only operation: instant, no table rewrite, every value still attached to its row. Note that the edited file is what gets recorded as applied, so its checksum is what other environments will verify — which is fine, because you edit it <em>before</em> it has run anywhere.</p>
<p>Two boundaries are worth stating. First, this only works while the migration is unapplied; editing a migration that has already run somewhere real breaks the checksum and produces a history nobody can trust. Second, a rename is still a breaking change for the <em>application</em>: any deployed code selecting <code>name</code> fails the moment the column disappears, so a single-step rename means downtime unless code and schema deploy together. When they cannot, use the expand–contract sequence of exercise 9 — add the new column, write to both, migrate readers, then drop the old one. The habit that prevents all of this is simply reading every generated migration before applying it, especially any containing <code>DROP</code>.</p>`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \\"User\\"(email,name) values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray')"
# rename, done properly: hand-written migration instead of the generated drop+add
custom_migration rename_name_to_fullname 'ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";'
write_schema '
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  fullName String
}'
echo "rows $(psql_q 'select count(*) from "User"')"
echo "names $(psql_q "select string_agg(\\"fullName\\", ', ' order by \\"fullName\\") from \\"User\\"")"
echo "oldcol $(psql_q "select count(*) from information_schema.columns where table_name='User' and column_name='name'")"
echo "drift $(migrate_drift_empty)"`,
    expect: `rows 2\nnames Ann Lee, Bob Ray\noldcol 0\ndrift none`,
  },
  {
    title: 'Recover From a Migration That Failed on Real Data',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['P3018 failed migration', 'unique violation 23505', 'blocked history', 'migrate resolve rolled-back', 'fix data then re-apply'],
    prerequisites: ['migrate deploy', 'unique constraints'],
    tags: ['prisma', 'migrations', 'failure', 'recovery', 'production'],
    problemHtml: `<p>Some migrations pass every check on an empty developer database and fail on production data. Adding <code>@unique</code> to a column that already holds duplicates is the classic case, and the failure is loud:</p>
<pre>Error: P3018 A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Database error code: 23505
ERROR: could not create unique index "User_name_key"
DETAIL: Key (name)=(Ann Lee) is duplicated.</pre>
<p>The important part is the second sentence. The failed migration is recorded as failed, and <strong>every later migration is blocked</strong> until the history is repaired — a stuck deploy pipeline, not just one bad statement.</p>
<p>Reproduce and repair, on a <code>User</code> table where two rows share the name <code>Ann Lee</code>:</p>
<ul>
<li>Add <code>@unique</code> to <code>name</code>, apply, and observe the failure. Print <code>failed 1</code> — the number of migrations <code>_prisma_migrations</code> records as started but not finished.</li>
<li>Fix the <em>data</em>: make the duplicate unique (rename the second to <code>Ann Lee 2</code>).</li>
<li>Mark the failed migration as rolled back: <code>npx prisma migrate resolve --rolled-back &lt;name&gt;</code>.</li>
<li>Re-apply with <code>npx prisma migrate deploy</code> and print <code>applied N</code> (finished migrations) and <code>unique 1</code> confirming the index now exists.</li>
</ul>
<p>Do not delete rows and do not drop the migration folder.</p>`,
    inputSpec: 'A User table with three rows, two of which share the name "Ann Lee", and a pending migration that adds a unique index on name.',
    outputSpec: 'One failed migration recorded, then after fixing the data and resolving the history the migration applies and the unique index exists — with all three rows still present.',
    constraints: 'Recover by fixing the data and resolving the history. Do not use migrate reset, do not delete the migration directory, and do not mark the migration as applied when it did not run.',
    examplesJson: [
      { input: 'CREATE UNIQUE INDEX "User_name_key" ON "User"("name") against duplicate data', output: 'Database error code: 23505 — Key (name)=(Ann Lee) is duplicated.', explanation: 'Postgres names the exact duplicated value, which is the fastest way to find the offending rows.' },
      { input: 'npx prisma migrate status after the failure', output: 'Following migration have failed: 20260720100000_unique_name', explanation: 'The history is blocked until this entry is resolved, so no later migration can run.' },
      { input: 'migrate resolve --rolled-back <name> then migrate deploy', output: 'applied 2, unique 1', explanation: 'Rolled-back tells Prisma the migration left nothing behind, so it is safe to run again.' },
    ],
    hintsJson: [
      'Read the DETAIL line — it names the duplicated value, so a GROUP BY ... HAVING count(*) > 1 finds the rows.',
      'A failed migration has started_at but no finished_at in _prisma_migrations.',
      'Use --rolled-back when the statement did not take effect; --applied only when you performed the change manually.',
      'Fix the data first: resolving the history before the duplicates are gone just fails again.',
    ],
    files: [
      { name: 'commands.sh', language: 'bash', code: `# 1. the migration fails on real data
npx prisma migrate deploy
#   Error: P3018 ... 23505 ... Key (name)=(Ann Lee) is duplicated.

# 2. find the offending rows
#   SELECT name, count(*) FROM "User" GROUP BY name HAVING count(*) > 1;

# 3. fix the DATA, not the migration
#   UPDATE "User" SET name = 'Ann Lee 2' WHERE email = 'c@x.io';

# 4. tell the history the failed migration left nothing behind
npx prisma migrate resolve --rolled-back 20260720100000_unique_name

# 5. run it again — now it succeeds
npx prisma migrate deploy
npx prisma migrate status   # Database schema is up to date!` },
      { name: 'find_duplicates.sql', language: 'sql', code: `-- Which values block the unique index, and how many rows each affects
SELECT "name", count(*) AS copies
FROM "User"
GROUP BY "name"
HAVING count(*) > 1
ORDER BY copies DESC;` },
    ],
    solutionExplanationHtml: `<p>The failure itself is ordinary — a unique index cannot be built over duplicate values — but the state it leaves behind is what matters. Prisma writes a row into <code>_prisma_migrations</code> when a migration starts and stamps <code>finished_at</code> when it completes; a crash in between leaves a started-but-unfinished row, and <code>migrate deploy</code> refuses to run anything else until that row is resolved. That is a deliberate safety property: continuing past a half-applied migration is how schemas end up in states no environment can reproduce.</p>
<p>Recovery has two halves, and doing them in the wrong order just repeats the failure. First fix the <strong>data</strong>, because the migration was correct and the data violated it — dropping the constraint to make the error go away would discard the invariant the migration existed to create. Then repair the <strong>history</strong> with <code>migrate resolve</code>, choosing the flag by what actually happened in the database: <code>--rolled-back</code> means the statement left nothing behind, so it is safe to run again; <code>--applied</code> means you performed the change by hand and Prisma should skip it. Choosing <code>--applied</code> for a migration that never ran is how a schema silently diverges from its history, and it is the mistake this exercise exists to prevent.</p>
<p>Note what is <em>not</em> in the recovery: <code>migrate reset</code>, which drops and recreates the database. It is fine on a laptop and catastrophic on production data. Note also that a single-statement migration is easier to recover than a ten-statement one, because "did anything land?" has an obvious answer — PostgreSQL runs each migration in a transaction where it can, but not every statement is transactional, so keeping risky migrations small is real insurance. Finally, the durable fix is earlier than any of this: run the migration against a copy of production data, or add the deduplication as its own migration first, so the constraint meets data that already satisfies it.</p>`,
    diagramMermaid: `flowchart TD
  A[migrate deploy] --> B[unique index fails 23505]
  B --> C[row in _prisma_migrations has no finished_at]
  C --> D[P3009 blocks every later migration]
  D --> E[fix the duplicate rows first]
  E --> F[migrate resolve --rolled-back]
  F --> G[migrate deploy runs it again and succeeds]`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \\"User\\"(email,name) values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray'),('c@x.io','Ann Lee')"
# the migration that will fail on real data
raw_migration 20260720100000_unique_name 'CREATE UNIQUE INDEX "User_name_key" ON "User"("name");'
deploy_expect_failure
echo "failed $(psql_q 'select count(*) from _prisma_migrations where finished_at is null')"
# fix the DATA, then the history
psql_x "update \\"User\\" set name='Ann Lee 2' where email='c@x.io'"
npx prisma migrate resolve --rolled-back 20260720100000_unique_name >/dev/null 2>&1
npx prisma migrate deploy >/dev/null 2>&1
echo "applied $(psql_q 'select count(*) from _prisma_migrations where finished_at is not null')"
echo "unique $(psql_q "select count(*) from pg_indexes where tablename='User' and indexname='User_name_key'")"
echo "rows $(psql_q 'select count(*) from "User"')"`,
    expect: `failed 1\napplied 2\nunique 1\nrows 3`,
  },
  {
    title: 'Evolve an Enum Without Breaking Stored Rows',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['enum type in Postgres', 'adding a value is additive', 'removing a value in use fails', 'migrating rows before removal', 'default values on enums'],
    prerequisites: ['additive migrations', 'backfill migrations'],
    tags: ['prisma', 'migrations', 'enum', 'postgres', 'schema'],
    problemHtml: `<p>A Prisma <code>enum</code> becomes a real PostgreSQL type, so changing it is a schema migration with the same asymmetry as everything else: <strong>adding</strong> a value is additive and safe, while <strong>removing</strong> one is destructive and fails whenever a row still uses it. Postgres cannot drop a value that is referenced, and it cannot rewrite your rows for you.</p>
<p>Starting from <code>enum Role { USER ADMIN }</code> with three users — two <code>USER</code> and one <code>ADMIN</code>:</p>
<ul>
<li>Add a third value <code>EDITOR</code> and migrate. Print <code>values ...</code> — the enum labels in sort order, comma-separated — and <code>rows N</code> to confirm nothing moved.</li>
<li>Promote one <code>USER</code> row to <code>EDITOR</code> in a backfill migration, then print <code>editors N</code>.</li>
<li>Now retire <code>USER</code>: first migrate the remaining rows off it (make them <code>EDITOR</code>), then remove the value from the schema and migrate. Print <code>afterValues ...</code> and <code>usersLeft N</code>, the number of rows still holding the retired value, which must be zero.</li>
</ul>
<p>The removal must be its own migration, ordered <strong>after</strong> the data has moved. Print the four lines in that order.</p>`,
    inputSpec: 'A User table with a Role enum of USER and ADMIN, holding two USER rows and one ADMIN row.',
    outputSpec: 'The enum gains EDITOR without touching any row, one user is promoted, and after the remaining rows move off USER the value can be dropped — leaving ADMIN and EDITOR and no orphaned rows.',
    constraints: 'Do not delete user rows to make the removal possible. The data migration and the enum change must be separate migrations, in that order.',
    examplesJson: [
      { input: 'adding EDITOR to the enum', output: 'values ADMIN, EDITOR, USER', explanation: 'ALTER TYPE "Role" ADD VALUE is additive — existing rows keep their labels and no rewrite happens.' },
      { input: 'removing USER while rows still hold it', output: 'the migration fails — the type cannot be recreated while rows reference the value', explanation: 'Postgres has no DROP VALUE; Prisma recreates the type, which fails on the rows still using it.' },
      { input: 'moving the rows first, then removing the value', output: 'afterValues ADMIN, EDITOR and usersLeft 0', explanation: 'Once nothing references the label, the type can be recreated without it.' },
    ],
    hintsJson: [
      'Adding a value is one ALTER TYPE ... ADD VALUE and touches no rows.',
      'There is no DROP VALUE in Postgres — removal means recreating the type, which is why rows must move first.',
      'Write the row migration as its own migration so it is ordered before the enum change.',
      'Check pg_enum to list the labels a type currently has.',
    ],
    files: [
      { name: 'step1.prisma', language: 'prisma', code: `// Step 1 — additive: npx prisma migrate dev --name add_editor_role
// generated: ALTER TYPE "Role" ADD VALUE 'EDITOR';
enum Role {
  USER
  ADMIN
  EDITOR
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(USER)
}` },
      { name: 'step2_move_rows.sql', language: 'sql', code: `-- Step 2 — move every row off the value being retired.
-- npx prisma migrate dev --create-only --name move_users_to_editor
UPDATE "User" SET "role" = 'EDITOR' WHERE "role" = 'USER';` },
      { name: 'step3.prisma', language: 'prisma', code: `// Step 3 — destructive, safe only because no row holds USER any more.
// npx prisma migrate dev --name drop_user_role
// Prisma recreates the type: CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'EDITOR'); ... DROP TYPE "Role";
enum Role {
  ADMIN
  EDITOR
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(EDITOR)
}` },
    ],
    solutionExplanationHtml: `<p>A Prisma enum is a PostgreSQL <code>TYPE</code>, and the asymmetry between adding and removing comes straight from the database. <code>ALTER TYPE "Role" ADD VALUE 'EDITOR'</code> appends a label; every stored row is still valid, nothing is rewritten, and old application code that never mentions <code>EDITOR</code> keeps working. That makes adding a value one of the safest migrations there is — though note it cannot run inside a transaction block in older PostgreSQL versions, which occasionally surprises people whose migration contains several statements.</p>
<p>Removal has no equivalent: PostgreSQL offers no <code>DROP VALUE</code>. Prisma therefore emits the standard workaround — create a new type with the reduced set, cast the column to it, drop the old type, rename the new one — and the cast fails on any row still holding the retired label. The order is not negotiable: rows first, type second, as two migrations, so the data change is recorded and runs on every environment before the structural one.</p>
<p>The <code>@default</code> deserves attention. Retiring <code>USER</code> while it is still the column default leaves a default referencing a label that no longer exists, so the default must move in the same step — which is why step 3 changes it to <code>EDITOR</code>. The same trap catches enum <em>renames</em>, which the differ sees as a removal plus an addition, exactly like the column rename in exercise 4. And the compatibility rule mirrors the additive one: deployed code containing a <code>switch</code> over roles will hit an unhandled case the first time it reads a value added after it shipped, so add the value, deploy the code that understands it, and only then start writing it.</p>`,
    verify: `setup_db
write_schema '
enum Role {
  USER
  ADMIN
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(USER)
}'
migrate init
psql_x "insert into \\"User\\"(email,role) values ('a@x.io','USER'),('b@x.io','USER'),('c@x.io','ADMIN')"
write_schema '
enum Role {
  USER
  ADMIN
  EDITOR
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(USER)
}'
migrate add_editor_role
echo "values $(psql_q "select string_agg(e.enumlabel, ', ' order by e.enumlabel) from pg_enum e join pg_type t on t.oid=e.enumtypid where t.typname='Role'")"
echo "rows $(psql_q 'select count(*) from "User"')"
custom_migration promote_one_editor "UPDATE \\"User\\" SET \\"role\\" = 'EDITOR' WHERE email = 'a@x.io';"
echo "editors $(psql_q "select count(*) from \\"User\\" where role='EDITOR'")"
# move remaining rows off USER, then drop the value
custom_migration move_users_to_editor "UPDATE \\"User\\" SET \\"role\\" = 'EDITOR' WHERE \\"role\\" = 'USER';"
write_schema '
enum Role {
  ADMIN
  EDITOR
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(EDITOR)
}'
migrate drop_user_role
echo "afterValues $(psql_q "select string_agg(e.enumlabel, ', ' order by e.enumlabel) from pg_enum e join pg_type t on t.oid=e.enumtypid where t.typname='Role'")"
echo "usersLeft $(psql_q "select count(*) from \\"User\\" where role::text='USER'")"`,
    expect: `values ADMIN, EDITOR, USER\nrows 3\neditors 1\nafterValues ADMIN, EDITOR\nusersLeft 0`,
  },
  {
    title: 'Ship a Data Migration Alongside the Schema Change',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['data migration as a migration', 'create-only workflow', 'idempotent UPDATE', 'split a column', 'ordering with structural changes'],
    prerequisites: ['create-only migrations', 'backfill'],
    tags: ['prisma', 'migrations', 'data-migration', 'sql', 'backfill'],
    problemHtml: `<p>Not every migration changes structure. Splitting a single <code>fullName</code> into <code>firstName</code> and <code>lastName</code> needs three things in order: the new columns, the data moved into them, and the old column removed. Putting the middle step in a script somebody runs by hand is how staging and production drift apart — the supported home for it is an empty migration created with <code>--create-only</code>.</p>
<p>Against a <code>User</code> table holding <code>Ann Lee</code>, <code>Bob Ray</code> and the single-word name <code>Cy</code>:</p>
<ul>
<li><strong>Migration 1</strong> — add nullable <code>firstName</code> and <code>lastName</code>.</li>
<li><strong>Migration 2</strong> — <code>--create-only</code>, then write the split by hand with <code>split_part</code>: everything before the first space is the first name, everything after it is the last name, and a name with no space keeps an empty last name. Guard it with <code>WHERE "firstName" IS NULL</code> so re-running changes nothing.</li>
<li><strong>Migration 3</strong> — drop <code>fullName</code>.</li>
</ul>
<p>Print <code>split ...</code> — each row as <code>first|last</code>, ordered by first name and joined by a comma — then <code>oldcol N</code> for the remaining <code>fullName</code> columns, <code>nulls N</code> for rows where <code>firstName</code> is still null, and <code>rerun N</code>: the number of rows the backfill would touch if it ran a second time, which must be zero.</p>`,
    inputSpec: 'A User table with three rows whose fullName values are "Ann Lee", "Bob Ray" and "Cy".',
    outputSpec: 'All three names split correctly with Cy keeping an empty last name, the old column gone, no unconverted rows, and a second run of the backfill affecting nothing.',
    constraints: 'The split must happen in SQL inside a migration — not in application code and not in a manual script. The backfill must be idempotent.',
    examplesJson: [
      { input: "split_part('Ann Lee', ' ', 1) and substring after the first space", output: 'Ann|Lee', explanation: 'split_part takes the nth field; the remainder becomes the last name.' },
      { input: "the single-word name 'Cy'", output: 'Cy|', explanation: 'With no space there is no second part, so the last name is empty rather than a duplicate of the first.' },
      { input: 'running the backfill a second time', output: 'rerun 0', explanation: 'The WHERE "firstName" IS NULL guard means already-converted rows are skipped.' },
    ],
    hintsJson: [
      'Create the empty migration with --create-only, then write the UPDATE into its migration.sql.',
      "split_part(text, delimiter, n) returns the nth field, and it returns '' when there is no nth field.",
      'Guard the UPDATE so a retry after a partial failure is harmless.',
      'Drop the old column only in a later migration, once the data has moved.',
    ],
    files: [
      { name: 'step1.prisma', language: 'prisma', code: `// Migration 1 — npx prisma migrate dev --name add_name_parts
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  fullName  String
  firstName String?
  lastName  String?
}` },
      { name: 'step2_split.sql', language: 'sql', code: `-- Migration 2 — npx prisma migrate dev --create-only --name split_full_name
-- Idempotent: only rows that have not been converted are touched.
UPDATE "User"
SET "firstName" = split_part("fullName", ' ', 1),
    "lastName"  = CASE
                    WHEN position(' ' IN "fullName") = 0 THEN ''
                    ELSE substring("fullName" FROM position(' ' IN "fullName") + 1)
                  END
WHERE "firstName" IS NULL;` },
      { name: 'step3.prisma', language: 'prisma', code: `// Migration 3 — npx prisma migrate dev --name drop_full_name
// generated: ALTER TABLE "User" DROP COLUMN "fullName";
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  firstName String?
  lastName  String?
}` },
    ],
    solutionExplanationHtml: `<p>A data migration is a migration. Putting the <code>UPDATE</code> inside the versioned sequence means it runs exactly once per environment, in a known position relative to the structural changes, and its execution is recorded — none of which is true of a script in a wiki page. <code>--create-only</code> is what makes this possible: it generates the migration file and stops, so you can replace or extend the SQL before anything runs.</p>
<p>Ordering is the load-bearing part. The columns must exist before the data can move, and the data must have moved before the old column is dropped, so this is three migrations rather than one clever statement. Splitting them also means each can be deployed and verified separately, and if the backfill turns out to be wrong you still have <code>fullName</code> to redo it from — the destructive step comes last for exactly that reason.</p>
<p>Idempotence is the second discipline. Migrations get retried: a deploy times out, a connection drops, a pod restarts mid-run. <code>WHERE "firstName" IS NULL</code> makes a second run a no-op, which is why the <code>rerun</code> check reports zero. Note the edge case the naive version gets wrong — <code>split_part('Cy', ' ', 2)</code> returns an empty string, but a lazy implementation using the same <code>split_part</code> for both parts would give <code>Cy|Cy</code> with a different delimiter choice, and one that used the last word would break on "Ann van der Berg". Real names do not split reliably, which is itself an argument for keeping a single name field; the technique here is what matters, not the linguistics. On a large table, add the batching too — <code>WHERE id BETWEEN ... </code> in a loop — since one <code>UPDATE</code> over millions of rows holds locks and bloats the transaction.</p>`,
    diagramMermaid: `flowchart LR
  A[migration 1 add nullable columns] --> B[migration 2 backfill with SQL]
  B --> C[migration 3 drop the old column]
  C --> D[each step deployable and verifiable alone]`,
    verify: `setup_db
write_schema '
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  fullName String
}'
migrate init
psql_x "insert into \\"User\\"(email,\\"fullName\\") values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray'),('c@x.io','Cy')"
write_schema '
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  fullName  String
  firstName String?
  lastName  String?
}'
migrate add_name_parts
custom_migration split_full_name 'UPDATE "User" SET "firstName" = split_part("fullName", '"'"' '"'"', 1), "lastName" = CASE WHEN position('"'"' '"'"' IN "fullName") = 0 THEN '"'"''"'"' ELSE substring("fullName" FROM position('"'"' '"'"' IN "fullName") + 1) END WHERE "firstName" IS NULL;'
write_schema '
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  firstName String?
  lastName  String?
}'
migrate drop_full_name
echo "split $(psql_q "select string_agg(\\"firstName\\" || '|' || \\"lastName\\", ', ' order by \\"firstName\\") from \\"User\\"")"
echo "oldcol $(psql_q "select count(*) from information_schema.columns where table_name='User' and column_name='fullName'")"
echo "nulls $(psql_q 'select count(*) from "User" where "firstName" is null')"
echo "rerun $(psql_q 'select count(*) from "User" where "firstName" is null')"`,
    expect: `split Ann|Lee, Bob|Ray, Cy|\noldcol 0\nnulls 0\nrerun 0`,
  },
  {
    title: 'Detect and Repair Schema Drift',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['drift definition', 'migrate diff', 'shadow database', 'reconciling by migration', 'why db push causes drift'],
    prerequisites: ['migrate status', 'migration history'],
    tags: ['prisma', 'migrations', 'drift', 'diff', 'operations'],
    problemHtml: `<p><strong>Drift</strong> is when the database no longer matches what the migration history says it should be — someone ran an <code>ALTER TABLE</code> by hand, or used <code>prisma db push</code> against an environment that has migrations. The danger is silence: everything works until the next migration is generated against a state Prisma does not expect, and then the SQL is wrong in a way nobody reviews carefully.</p>
<p><code>prisma migrate diff</code> is the instrument. It replays the migration folder into a scratch <em>shadow database</em>, compares that with a target, and prints the difference as SQL — an empty result means no drift.</p>
<p>Starting from a clean, fully migrated database:</p>
<ul>
<li>Confirm the baseline: run <code>migrate diff</code> from the migrations to the database and print <code>clean yes</code> when the script is empty.</li>
<li>Introduce drift the way it happens in real life — a hand-run statement adding a <code>legacyFlag</code> column straight to the database.</li>
<li>Detect it: run the same diff and print <code>drift ...</code> with the offending column name extracted from the generated SQL.</li>
<li>Repair it properly by bringing the <em>schema</em> up to date with reality and recording a migration that matches, so the history explains the column. Print <code>after clean</code> when the diff is empty again and <code>migrations N</code>.</li>
</ul>
<p>Do not fix drift by deleting the column if the data matters, and never by editing an applied migration.</p>`,
    inputSpec: 'A migrated database, into which an out-of-band ALTER TABLE adds a column that no migration created.',
    outputSpec: 'The diff is empty at the baseline, reports the hand-added column once drift exists, and is empty again after a migration is recorded that accounts for it.',
    constraints: 'Detect with migrate diff, not by eyeballing. Do not use migrate reset and do not edit an already-applied migration file.',
    examplesJson: [
      { input: 'migrate diff --from-migrations ./prisma/migrations --to-schema-datasource (the live DB) --script', output: 'clean yes', explanation: 'An empty script means the database is exactly what the history describes.' },
      { input: 'after ALTER TABLE "User" ADD COLUMN "legacyFlag" BOOLEAN', output: 'drift legacyFlag', explanation: 'The diff reports the column that exists in the database but in no migration.' },
      { input: 'recording a migration that matches reality', output: 'after clean', explanation: 'The history now explains the column, so the diff is empty and future migrations are generated from a correct baseline.' },
    ],
    hintsJson: [
      'migrate diff needs a shadow database URL so it can replay the migration folder somewhere disposable.',
      'The direction matters: from-migrations to-database answers "what is in the DB that history does not know about".',
      'Fix drift by making the history and the schema describe reality, not by hiding the difference.',
      'db push writes no history, which is exactly why it must never touch an environment that uses migrations.',
    ],
    files: [
      { name: 'commands.sh', language: 'bash', code: `# 1. baseline — is the database what the history says?
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-schema-datasource ./prisma/schema.prisma \\
  --shadow-database-url "$SHADOW_DATABASE_URL" \\
  --script                      # empty output = no drift

# 2. drift happens (someone runs this by hand, or uses db push)
#    ALTER TABLE "User" ADD COLUMN "legacyFlag" BOOLEAN;

# 3. the same diff now prints the missing history:
#    ALTER TABLE "User" ADD COLUMN "legacyFlag" BOOLEAN;

# 4. repair: add the field to schema.prisma, then record a migration that matches
npx prisma migrate dev --create-only --name record_legacy_flag
#    edit the generated SQL to match what already exists, or mark it applied:
npx prisma migrate resolve --applied 20260720120000_record_legacy_flag

npx prisma migrate status       # up to date, and the diff is empty again` },
    ],
    solutionExplanationHtml: `<p>Drift is a mismatch between three things that are supposed to agree: the schema file, the migration history, and the live database. Prisma only guarantees the relationship it controls — history to database — so anything applied out of band is invisible to it until a diff is run. The failure mode is delayed and confusing: the next <code>migrate dev</code> generates SQL against an assumed state, and the difference between assumed and actual is where destructive statements come from.</p>
<p>The <strong>shadow database</strong> is what makes detection reliable. To know what the history <em>means</em>, Prisma replays every migration into a scratch database and inspects the result, rather than trusting the schema file — which may itself have been edited. That is also why <code>migrate dev</code> needs a database it may create and drop, and why it cannot be used against production.</p>
<p>Repairing has two legitimate shapes and one illegitimate one. If the out-of-band change should stay, make the schema describe it and record a migration for it — either by writing SQL equivalent to what already happened and marking it <code>--applied</code>, or by generating it and applying it on the environments that lack it. If the change should not have happened, write a migration that reverses it. What is never acceptable is editing an already-applied migration file: its checksum is recorded, other environments have run the old text, and rewriting history means two databases that claim the same version are not the same schema.</p>
<p>The prevention is a rule rather than a tool: <code>prisma db push</code> belongs only to a throwaway prototype database, never to anything with a migrations folder, and direct <code>ALTER</code> statements on shared environments should be as unusual as direct edits to production code. Adding a <code>migrate diff</code> check to CI turns drift from a mystery discovered during an incident into a failing build.</p>`,
    diagramMermaid: `flowchart TD
  A[schema.prisma] --> B[migration history]
  B --> C[live database]
  D[hand-run ALTER or db push] --> C
  C --> E[migrate diff replays history into a shadow DB]
  E --> F[non-empty script means drift]
  F --> G[record a matching migration so all three agree]`,
    verify: `setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
echo "clean $([ -z "$(drift_script)" ] && echo yes || echo no)"
# drift: a hand-run statement no migration knows about
psql_x 'ALTER TABLE "User" ADD COLUMN "legacyFlag" BOOLEAN'
echo "drift $(drift_script | grep -o 'legacyFlag' | head -1)"
# repair: schema now describes reality, and a migration records it
write_schema '
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  name       String
  legacyFlag Boolean?
}'
raw_migration 20260720120000_record_legacy_flag 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "legacyFlag" BOOLEAN;'
npx prisma migrate resolve --applied 20260720120000_record_legacy_flag >/dev/null 2>&1
echo "after $([ -z "$(drift_script)" ] && echo clean || echo dirty)"
echo "migrations $(ls -d prisma/migrations/*/ | wc -l | tr -d ' ')"`,
    expect: `clean yes\ndrift legacyFlag\nafter clean\nmigrations 2`,
  },
  {
    title: 'Rename a Column With Zero Downtime Using Expand and Contract',
    difficulty: 'HARD', estimatedMinutes: 55, points: 25,
    concepts: ['expand and contract', 'backward-compatible deploys', 'dual writes', 'sequencing migrations with releases', 'contract only when safe'],
    prerequisites: ['rename migrations', 'backfill', 'deployment basics'],
    tags: ['prisma', 'migrations', 'zero-downtime', 'deployment', 'production'],
    problemHtml: `<p>The single-statement rename of exercise 4 preserves data but not <em>availability</em>: between the migration and the new code reaching every instance, running processes still select a column that no longer exists. With rolling deploys, blue-green, or a queue worker that restarts late, that window always exists. <strong>Expand and contract</strong> removes it by never letting old and new be incompatible at the same moment.</p>
<p>Rename <code>Post.title</code> to <code>Post.headline</code> across four steps, keeping the table readable by both old and new code throughout:</p>
<ul>
<li><strong>Expand</strong> — add nullable <code>headline</code>; old code is unaffected because it does not know the column. Print <code>expand ...</code>: the number of rows where <code>headline</code> is null.</li>
<li><strong>Backfill</strong> — copy <code>title</code> into <code>headline</code> for existing rows, in its own migration. Print <code>backfill N</code>, the rows where the two now agree.</li>
<li><strong>Dual write</strong> — the release that writes both columns. Simulate one insert that sets both and print <code>dual ok</code> when the new row has them equal.</li>
<li><strong>Contract</strong> — once every instance runs code that only uses <code>headline</code>, drop <code>title</code>. Print <code>contract N</code> for the remaining <code>title</code> columns and <code>rows N</code> for the surviving rows.</li>
</ul>
<p>Each step must be independently deployable: at no point may the database be incompatible with the code currently running.</p>`,
    inputSpec: 'A Post table with three rows whose title values are "Alpha", "Beta" and "Gamma", read by application code currently deployed.',
    outputSpec: 'The new column appears empty, is backfilled to match, accepts a dual-written row, and finally the old column is dropped with every row intact.',
    constraints: 'Four separate migrations in order. The old column may only be dropped after the backfill and the dual-write release. No downtime window where deployed code references a missing column.',
    examplesJson: [
      { input: 'step 1: ALTER TABLE "Post" ADD COLUMN "headline" TEXT', output: 'expand 3', explanation: 'All three rows have a null headline, and old code neither reads nor writes it — deployable on its own.' },
      { input: 'step 2: UPDATE "Post" SET "headline" = "title" WHERE "headline" IS NULL', output: 'backfill 3', explanation: 'Every row now carries the same value in both columns, so readers of either see the same data.' },
      { input: 'step 4: ALTER TABLE "Post" DROP COLUMN "title"', output: 'contract 0 and rows 4', explanation: 'Safe only because no running code reads title any more; the rows themselves are untouched.' },
    ],
    hintsJson: [
      'The invariant is that every deployed version must work against the current schema — check each step against the previous release.',
      'The backfill and the dual-write release together guarantee both columns agree for old and new rows.',
      'Contract is the only destructive step, and it waits until the old code is fully gone.',
      'A trigger can replace the dual write when you cannot change the writer, but it must be dropped at contract time.',
    ],
    files: [
      { name: 'step1_expand.prisma', language: 'prisma', code: `// Release N — schema only, no code change. Old code keeps working.
model Post {
  id       Int     @id @default(autoincrement())
  title    String
  headline String?
  authorId Int
}` },
      { name: 'step2_backfill.sql', language: 'sql', code: `-- Release N, second migration — idempotent copy.
UPDATE "Post" SET "headline" = "title" WHERE "headline" IS NULL;` },
      { name: 'step3_dual_write.ts', language: 'typescript', code: `// Release N+1 — write both, read the new one. Deployable while some
// instances still run release N, because both columns stay in sync.
await prisma.post.create({
  data: { title: "Delta", headline: "Delta", authorId },
});

// Reads move to the new column in this same release:
const posts = await prisma.post.findMany({ select: { headline: true } });` },
      { name: 'step4_contract.prisma', language: 'prisma', code: `// Release N+2 — every instance now runs code that ignores title.
// npx prisma migrate dev --name drop_post_title
// generated: ALTER TABLE "Post" DROP COLUMN "title";
model Post {
  id       Int    @id @default(autoincrement())
  headline String
  authorId Int
}` },
    ],
    solutionExplanationHtml: `<p>The rule that makes this work is simple to state and easy to violate: <strong>every schema state must be compatible with every code version that can be running against it</strong>. During a rolling deploy that means the previous release and the new one simultaneously. Expand–contract satisfies the rule by making the schema temporarily hold both shapes, so no single step is ever breaking.</p>
<p>Each step earns its place. <em>Expand</em> is additive, so release N keeps working unchanged — the column is invisible to it. The <em>backfill</em> makes existing rows valid for readers of the new column, and it must be idempotent because deploys get retried. The <em>dual write</em> release is the crux: while both old and new instances are live, an insert from an old instance sets only <code>title</code>, so the new column would be null for that row unless the new code writes both — which is why the switch of readers and the dual write ship together, and why the contract step must wait for the old instances to be gone. When the writer cannot be changed in time — a legacy service, an external ETL — a database trigger copying <code>title</code> into <code>headline</code> is the standard substitute, dropped at contract time.</p>
<p><em>Contract</em> is the only destructive step, and its safety is entirely operational rather than technical: nothing in the database can tell you whether an old instance still exists. That is what the wait is for, and why teams gate it on a deploy having fully rolled out rather than on a timer. The cost of the whole pattern is real — four migrations and two releases instead of one — so reserve it for tables where downtime is unacceptable; for a rarely used admin table, exercise 4's single rename with a brief maintenance window is the honest trade. The same shape generalises to changing a column's type, splitting a table, or moving a foreign key, and it is the backbone of schema evolution in systems that cannot stop.</p>`,
    diagramMermaid: `sequenceDiagram
  participant Old as Release N
  participant DB as Database
  participant New as Release N+1
  Old->>DB: reads and writes title
  DB->>DB: expand adds nullable headline
  DB->>DB: backfill copies title into headline
  New->>DB: writes both title and headline reads headline
  Old->>DB: still writing title only until rollout completes
  DB->>DB: contract drops title after Release N is gone`,
    verify: `setup_db
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
}'
migrate init
psql_x "insert into \\"Post\\"(title,\\"authorId\\") values ('Alpha',1),('Beta',1),('Gamma',1)"
# 1. expand
write_schema '
model Post {
  id       Int     @id @default(autoincrement())
  title    String
  headline String?
  authorId Int
}'
migrate expand_headline
echo "expand $(psql_q 'select count(*) from "Post" where headline is null')"
# 2. backfill
custom_migration backfill_headline 'UPDATE "Post" SET "headline" = "title" WHERE "headline" IS NULL;'
echo "backfill $(psql_q 'select count(*) from "Post" where headline = title')"
# 3. dual write (what release N+1 does)
psql_x "insert into \\"Post\\"(title,headline,\\"authorId\\") values ('Delta','Delta',1)"
echo "dual $(psql_q "select case when count(*)=1 then 'ok' else 'bad' end from \\"Post\\" where title='Delta' and headline='Delta'")"
# 4. contract
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  headline String
  authorId Int
}'
migrate drop_post_title
echo "contract $(psql_q "select count(*) from information_schema.columns where table_name='Post' and column_name='title'")"
echo "rows $(psql_q 'select count(*) from "Post"')"`,
    expect: `expand 3\nbackfill 3\ndual ok\ncontract 0\nrows 4`,
  },
  {
    title: 'Capstone: Normalise a Text Column Into a Related Table',
    difficulty: 'HARD', estimatedMinutes: 70, points: 30,
    concepts: ['normalisation migration', 'derive rows from existing data', 'foreign key backfill', 'ordering structural and data steps', 'verifying nothing was lost'],
    prerequisites: ['backfill migrations', 'expand and contract', 'relations'],
    tags: ['prisma', 'migrations', 'normalisation', 'capstone', 'data-migration'],
    problemHtml: `<p>A free-text <code>category</code> column on <code>Post</code> has done what free-text columns do: the same concept is spelled several ways, nothing can be renamed in one place, and there is nowhere to hang a description. Normalising it into a <code>Category</code> table is the standard repair, and it is a five-migration sequence where every step is reversible until the last one.</p>
<p>Against six posts whose <code>category</code> values are <code>Databases</code> (three of them), <code>Frontend</code> (two) and <code>databases</code> — the same concept with different casing:</p>
<ul>
<li><strong>1. Create</strong> the <code>Category</code> table with a unique <code>name</code>, and add a nullable <code>categoryId</code> to <code>Post</code> with a foreign key.</li>
<li><strong>2. Derive</strong> the categories from the data itself: insert one row per distinct <code>initcap(lower(category))</code>, so the casing variants collapse into one. Print <code>categories ...</code>, the names ordered ascending and comma-separated.</li>
<li><strong>3. Link</strong> every post to its category by matching on the same normalised expression. Print <code>linked N</code> and <code>orphans N</code> — posts still without a <code>categoryId</code>, which must be zero.</li>
<li><strong>4. Tighten</strong> <code>categoryId</code> to required, now that every row has one.</li>
<li><strong>5. Contract</strong> — drop the old <code>category</code> column. Print <code>oldcol N</code>, then <code>counts ...</code>: each category name with its post count as <code>name=N</code>, ordered by name.</li>
</ul>
<p>Nothing may be lost: six posts before, six posts after, and the mis-cased row must land in the same category as its correctly cased twins.</p>`,
    inputSpec: 'A Post table with six rows whose category column holds "Databases" three times, "Frontend" twice and "databases" once.',
    outputSpec: 'Two categories are derived rather than hard-coded, every post is linked with no orphans, the column becomes required, the old text column is dropped, and the mis-cased row is counted with its twins — four posts under Databases and two under Frontend.',
    constraints: 'The category rows must be derived from the existing data, not written by hand. Five migrations in the given order. Do not delete or re-insert posts.',
    examplesJson: [
      { input: "INSERT INTO \"Category\"(name) SELECT DISTINCT initcap(lower(category)) FROM \"Post\"", output: 'categories Databases, Frontend', explanation: 'Deriving from the data means no category is missed and the casing variants collapse to one row.' },
      { input: 'UPDATE "Post" p SET "categoryId" = c.id FROM "Category" c WHERE c.name = initcap(lower(p.category))', output: 'linked 6, orphans 0', explanation: 'Matching on the same normalising expression is what makes the mis-cased row find its category.' },
      { input: 'the final per-category counts', output: 'counts Databases=4, Frontend=2', explanation: 'Three exact matches plus the mis-cased row land together, which is the whole point of normalising.' },
    ],
    hintsJson: [
      'Derive the category rows with SELECT DISTINCT over a normalising expression, so the data decides the list.',
      'Use the identical expression when linking, or the mis-cased row becomes an orphan.',
      'Check orphans before making categoryId required — a single null blocks the NOT NULL step.',
      'Drop the old column last, so every earlier step can still be re-derived from it.',
    ],
    files: [
      { name: 'step1.prisma', language: 'prisma', code: `// Migration 1 — structure only, nullable FK so existing rows stay valid.
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Post {
  id         Int       @id @default(autoincrement())
  title      String
  category   String
  categoryId Int?
  categoryRel Category? @relation(fields: [categoryId], references: [id])
}` },
      { name: 'step2_3_data.sql', language: 'sql', code: `-- Migration 2 — derive the categories FROM THE DATA, collapsing casing variants.
INSERT INTO "Category" ("name")
SELECT DISTINCT initcap(lower("category"))
FROM "Post"
WHERE "category" IS NOT NULL
ON CONFLICT ("name") DO NOTHING;

-- Migration 3 — link each post using the same normalising expression.
UPDATE "Post" p
SET "categoryId" = c.id
FROM "Category" c
WHERE c."name" = initcap(lower(p."category"))
  AND p."categoryId" IS NULL;` },
      { name: 'step4_5.prisma', language: 'prisma', code: `// Migration 4 — tighten: ALTER TABLE "Post" ALTER COLUMN "categoryId" SET NOT NULL;
// Migration 5 — contract: ALTER TABLE "Post" DROP COLUMN "category";
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String
  categoryId  Int
  categoryRel Category @relation(fields: [categoryId], references: [id])
}` },
    ],
    solutionExplanationHtml: `<p>The sequence is the same widen–fill–tighten shape as exercise 3, extended across two tables: create the new structure loosely, derive and link the data, then tighten and drop. Every step before the last is reversible, because the original <code>category</code> text is still there to re-derive from — which is why the destructive step comes last rather than being folded into an earlier one for tidiness.</p>
<p>Deriving the category list with <code>SELECT DISTINCT</code> instead of writing it by hand is the decision that makes this correct. A hand-written list reflects what you believe is in the table; the query reflects what is actually there, including the value someone typed in 2023 that nobody remembers. The normalising expression <code>initcap(lower(category))</code> does double duty — it collapses <code>databases</code> and <code>Databases</code> into one row on insert, and, crucially, the <em>same</em> expression is used when linking. Using a different one (matching on the raw text, say) would leave the mis-cased post an orphan, and the orphan check exists precisely to catch that class of mistake before the <code>NOT NULL</code> step turns it into a failed migration.</p>
<p>Ordering the <code>NOT NULL</code> step after the link is not a stylistic choice: a single unlinked row makes it fail, and the failure would land mid-sequence with the history blocked, as in exercise 5. Doing the check yourself first — <code>orphans 0</code> — is how you learn about the problem while it is still cheap. The <code>ON CONFLICT DO NOTHING</code> and the <code>WHERE "categoryId" IS NULL</code> guard make both data migrations idempotent, so a retried deploy is harmless.</p>
<p>What the normalisation buys is visible in the final counts: renaming a category is now one <code>UPDATE</code> on one row rather than a search-and-replace across the posts table, the unique constraint makes duplicates impossible rather than merely discouraged, and a category can carry a description, a slug, or an ordering. The cost is a join on read and one more table to reason about — worth it whenever the same string appears in more than a handful of rows, which is the situation this table was already in.</p>`,
    diagramMermaid: `erDiagram
  CATEGORY ||--o{ POST : classifies
  CATEGORY {
    int id
    string name
  }
  POST {
    int id
    string title
    int categoryId
  }`,
    verify: `setup_db
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  category String
}'
migrate init
psql_x "insert into \\"Post\\"(title,category) values ('A','Databases'),('B','Databases'),('C','Databases'),('D','Frontend'),('E','Frontend'),('F','databases')"
# 1. structure
write_schema '
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String
  category    String
  categoryId  Int?
  categoryRel Category? @relation(fields: [categoryId], references: [id])
}'
migrate add_category_table
# 2. derive categories from the data
custom_migration derive_categories 'INSERT INTO "Category" ("name") SELECT DISTINCT initcap(lower("category")) FROM "Post" WHERE "category" IS NOT NULL ON CONFLICT ("name") DO NOTHING;'
echo "categories $(psql_q "select string_agg(name, ', ' order by name) from \\"Category\\"")"
# 3. link
custom_migration link_posts 'UPDATE "Post" p SET "categoryId" = c.id FROM "Category" c WHERE c."name" = initcap(lower(p."category")) AND p."categoryId" IS NULL;'
echo "linked $(psql_q 'select count(*) from "Post" where "categoryId" is not null')"
echo "orphans $(psql_q 'select count(*) from "Post" where "categoryId" is null')"
# 4 + 5. tighten then contract
write_schema '
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String
  categoryId  Int
  categoryRel Category @relation(fields: [categoryId], references: [id])
}'
migrate require_and_drop_category
echo "oldcol $(psql_q "select count(*) from information_schema.columns where table_name='Post' and column_name='category'")"
echo "counts $(psql_q "select string_agg(x.label, ', ' order by x.label) from (select c.name || '=' || count(p.id)::text as label from \\"Category\\" c join \\"Post\\" p on p.\\"categoryId\\"=c.id group by c.name) x")"`,
    expect: `categories Databases, Frontend\nlinked 6\norphans 0\noldcol 0\ncounts Databases=4, Frontend=2`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VDIR = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/prisma-436';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VDIR, { recursive: true });
const starter = [{
  name: 'schema.prisma', language: 'prisma',
  code: `${DS}
// TODO: model the change described above, then run the migration commands.
`,
}];
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: starter,
  solutionCodeJson: e.files,
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));
ex.forEach((e, i) => {
  const n = i + 1;
  fs.writeFileSync(path.join(VDIR, `ex${n}.sh`), `${e.verify}\n`);
  fs.writeFileSync(path.join(VDIR, `ex${n}.expect.txt`), `${e.expect}\n`);
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
