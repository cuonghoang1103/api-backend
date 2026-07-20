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
psql_x "insert into \"User\"(email,name) values ('ann@x.io','Ann'),('bob@x.io','Bob')"
psql_x "insert into \"Post\"(title,\"authorId\") select 'P'||g, (select id from \"User\" order by id limit 1) from generate_series(1,3) g"
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
echo "tag $(psql_q "select count(*) from pg_tables where schemaname='public' and tablename='Tag'")"
