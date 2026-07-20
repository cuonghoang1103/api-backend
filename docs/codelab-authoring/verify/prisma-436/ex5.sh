setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \"User\"(email,name) values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray'),('c@x.io','Ann Lee')"
# the migration that will fail on real data
raw_migration 20260720100000_unique_name 'CREATE UNIQUE INDEX "User_name_key" ON "User"("name");'
deploy_expect_failure
echo "failed $(psql_q 'select count(*) from _prisma_migrations where finished_at is null')"
# fix the DATA, then the history
psql_x "update \"User\" set name='Ann Lee 2' where email='c@x.io'"
npx prisma migrate resolve --rolled-back 20260720100000_unique_name >/dev/null 2>&1
npx prisma migrate deploy >/dev/null 2>&1
echo "applied $(psql_q 'select count(*) from _prisma_migrations where finished_at is not null')"
echo "unique $(psql_q "select count(*) from pg_indexes where tablename='User' and indexname='User_name_key'")"
echo "rows $(psql_q 'select count(*) from "User"')"
