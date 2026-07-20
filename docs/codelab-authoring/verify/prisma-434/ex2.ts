import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

async function main() {
  const payload: Prisma.UserCreateInput = {
    email: "dee@x.io",
    name: "Dee",
    role: "EDITOR",
    profile: { create: { bio: "Data engineer" } },
    posts: { create: [{ title: "Airflow Notes", published: true, views: 40 }] },
  };
  const dee = await prisma.user.create({ data: payload });
  console.log(dee.email, dee.role, dee.age);

  const second: Prisma.PostUncheckedCreateInput = {
    title: "DBT Models",
    authorId: dee.id,
  };
  const post = await prisma.post.create({ data: second });
  console.log(post.title, post.published, post.views);
  console.log("posts", await prisma.post.count({ where: { authorId: dee.id } }));
}

main().finally(() => prisma.$disconnect());