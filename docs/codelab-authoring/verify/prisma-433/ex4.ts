import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const ann = await prisma.user.update({
    where: { email: "ann@x.io" },
    data: {
      name: "Ann R.",
      profile: { update: { bio: "Staff engineer" } },
      posts: { updateMany: { where: { published: false }, data: { published: true, views: 5 } } },
    },
    include: { profile: true, posts: { orderBy: { title: "asc" } } },
  });
  console.log(ann.name, ann.profile ? ann.profile.bio : "none");
  for (const p of ann.posts) console.log(p.title, p.published, p.views);
  console.log("otherDrafts", await prisma.post.count({ where: { published: false } }));
}

main().finally(() => prisma.$disconnect());