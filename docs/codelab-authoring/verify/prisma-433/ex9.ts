import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const fluent = await prisma.user
    .findUnique({ where: { email: "ann@x.io" } })
    .posts({ where: { published: true }, orderBy: { views: "desc" } });
  console.log("fluent:", (fluent ?? []).map((p) => p.title).join(", "));
  const withInclude = await prisma.user.findUnique({
    where: { email: "ann@x.io" },
    include: { posts: { where: { published: true }, orderBy: { views: "desc" } } },
  });
  console.log("include:", (withInclude ? withInclude.posts : []).map((p) => p.title).join(", "));
  const author = await prisma.post.findUnique({ where: { title: "React Hooks" } }).author();
  console.log("author", author ? author.name : "none");
  const cyProfile = await prisma.user.findUnique({ where: { email: "cy@x.io" } }).profile();
  console.log("cyProfile", cyProfile);
  const ghostPosts = await prisma.user.findUnique({ where: { email: "ghost@x.io" } }).posts();
  console.log("ghostPosts", ghostPosts);
}

main().finally(() => prisma.$disconnect());