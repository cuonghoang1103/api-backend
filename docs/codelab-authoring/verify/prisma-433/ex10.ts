import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  async function publish(email: string, title: string, categories: string[], bio: string) {
    return prisma.$transaction(async (tx) => {
      const author = await tx.user.findUniqueOrThrow({ where: { email } });
      await tx.profile.upsert({
        where: { userId: author.id },
        update: { bio },
        create: { bio, userId: author.id },
      });
      const post = await tx.post.create({
        data: {
          title,
          published: true,
          views: 0,
          author: { connect: { email } },
          categories: { connectOrCreate: categories.map((name) => ({ where: { name }, create: { name } })) },
        },
      });
      await tx.comment.create({ data: { body: "Congrats", postId: post.id, authorId: (await tx.user.findUniqueOrThrow({ where: { email: "cy@x.io" } })).id } });
      return post.id;
    });
  }

  const id = await publish("bob@x.io", "Sharding 101", ["Databases", "Scaling"], "Platform engineer");
  const created = await prisma.post.findUniqueOrThrow({
    where: { id },
    include: { author: { include: { profile: true } }, categories: { orderBy: { name: "asc" } } },
  });
  console.log("ok", created.title, created.author.profile ? created.author.profile.bio : "none", created.categories.map((c) => c.name).join(", "));

  try {
    await publish("bob@x.io", "Sharding 101", ["Duplicates"], "Ignored bio");
    console.log("unexpected success");
  } catch {
    console.log("rolledback", await prisma.post.count(), await prisma.category.count());
  }
}

main().finally(() => prisma.$disconnect());