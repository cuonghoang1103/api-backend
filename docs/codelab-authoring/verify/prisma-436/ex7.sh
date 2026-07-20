setup_db
write_schema '
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  fullName String
}'
migrate init
psql_x "insert into \"User\"(email,\"fullName\") values ('a@x.io','Ann Lee'),('b@x.io','Bob Ray'),('c@x.io','Cy')"
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
echo "split $(psql_q "select string_agg(\"firstName\" || '|' || \"lastName\", ', ' order by \"firstName\") from \"User\"")"
echo "oldcol $(psql_q "select count(*) from information_schema.columns where table_name='User' and column_name='fullName'")"
echo "nulls $(psql_q 'select count(*) from "User" where "firstName" is null')"
echo "rerun $(psql_q 'select count(*) from "User" where "firstName" is null')"
