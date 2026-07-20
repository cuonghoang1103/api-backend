setup_db
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
echo "tables $(psql_q "select string_agg(tablename, ', ' order by tablename) from pg_tables where schemaname='public' and tablename not like '\_prisma%'")"
echo "fk $(psql_q "select count(*) from pg_constraint where conrelid='\"Post\"'::regclass and contype='f'")"
echo "applied $(psql_q "select count(*) from _prisma_migrations where finished_at is not null")"
