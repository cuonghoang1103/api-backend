setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \"User\"(email,name) values ('ann@x.io','Ann'),('bob@x.io','Bob')"
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
custom_migration backfill_country "UPDATE \"User\" SET \"country\" = 'VN' WHERE \"country\" IS NULL;"
echo "filled $(psql_q "select count(*) from \"User\" where country = 'VN'")"
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
echo "users $(psql_q 'select count(*) from "User"')"
