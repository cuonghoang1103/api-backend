setup_db
write_schema '
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  category String
}'
migrate init
psql_x "insert into \"Post\"(title,category) values ('A','Databases'),('B','Databases'),('C','Databases'),('D','Frontend'),('E','Frontend'),('F','databases')"
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
echo "categories $(psql_q "select string_agg(name, ', ' order by name) from \"Category\"")"
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
echo "counts $(psql_q "select string_agg(x.label, ', ' order by x.label) from (select c.name || '=' || count(p.id)::text as label from \"Category\" c join \"Post\" p on p.\"categoryId\"=c.id group by c.name) x")"
