setup_db
write_schema '
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}'
migrate init
psql_x "insert into \"User\"(email,name) values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray')"
# rename, done properly: hand-written migration instead of the generated drop+add
custom_migration rename_name_to_fullname 'ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";'
write_schema '
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  fullName String
}'
echo "rows $(psql_q 'select count(*) from "User"')"
echo "names $(psql_q "select string_agg(\"fullName\", ', ' order by \"fullName\") from \"User\"")"
echo "oldcol $(psql_q "select count(*) from information_schema.columns where table_name='User' and column_name='name'")"
echo "drift $(migrate_drift_empty)"
