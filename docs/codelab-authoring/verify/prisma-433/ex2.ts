import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const dee = await prisma.user.create({
    data: {
      email: "dee@x.io",
      name: "Dee",
      profile: { create: { bio: "Data engineer" } },
      posts: { create: [
        { title: "Airflow Notes", published: true, views: 40 },
        { title: "DBT Models" },
      ]},
    },
    include: { profile: true, posts: { orderBy: { title: "asc" } } },
  });
  console.log(dee.email, dee.profile ? dee.profile.bio : "none", dee.posts.length);
  for (const p of dee.posts) console.log(p.title, p.published, p.views);
}

main().finally(() => prisma.$disconnect());