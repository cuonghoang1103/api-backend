setup_db
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
}'
migrate init
psql_x "insert into \"Post\"(title,\"authorId\") values ('Alpha',1),('Beta',1),('Gamma',1)"
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
psql_x "insert into \"Post\"(title,headline,\"authorId\") values ('Delta','Delta',1)"
echo "dual $(psql_q "select case when count(*)=1 then 'ok' else 'bad' end from \"Post\" where title='Delta' and headline='Delta'")"
# 4. contract
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  headline String
  authorId Int
}'
migrate drop_post_title
echo "contract $(psql_q "select count(*) from information_schema.columns where table_name='Post' and column_name='title'")"
echo "rows $(psql_q 'select count(*) from "Post"')"
