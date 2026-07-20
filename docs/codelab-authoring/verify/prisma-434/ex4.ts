import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

const authorCard = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    name: true,
    role: true,
    posts: { select: { title: true }, orderBy: { views: "desc" } },
  },
});
type AuthorCard = Prisma.UserGetPayload<typeof authorCard>;

const staffOnly = Prisma.validator<Prisma.UserWhereInput>()({
  role: { in: ["ADMIN", "EDITOR"] },
});

function render(a: AuthorCard): string {
  return `${a.name} ${a.role} ${a.posts.length > 0 ? a.posts[0].title : "none"}`;
}

async function main() {
  const cards = await prisma.user.findMany({ ...authorCard, orderBy: { name: "asc" } });
  for (const c of cards) console.log(render(c));
  const bob = await prisma.user.findUnique({ ...authorCard, where: { email: "bob@x.io" } });
  if (bob) console.log("one", render(bob));
  console.log("staff", await prisma.user.count({ where: staffOnly }));
}

main().finally(() => prisma.$disconnect());