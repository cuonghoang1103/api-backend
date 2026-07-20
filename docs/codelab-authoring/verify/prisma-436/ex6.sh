setup_db
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
psql_x "insert into \"User\"(email,role) values ('a@x.io','USER'),('b@x.io','USER'),('c@x.io','ADMIN')"
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
custom_migration promote_one_editor "UPDATE \"User\" SET \"role\" = 'EDITOR' WHERE email = 'a@x.io';"
echo "editors $(psql_q "select count(*) from \"User\" where role='EDITOR'")"
# move remaining rows off USER, then drop the value
custom_migration move_users_to_editor "UPDATE \"User\" SET \"role\" = 'EDITOR' WHERE \"role\" = 'USER';"
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
echo "usersLeft $(psql_q "select count(*) from \"User\" where role::text='USER'")"
