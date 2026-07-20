import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

const cardArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    role: true,
    posts: { select: { title: true, views: true }, orderBy: { views: "desc" }, take: 1 },
  },
});
type Card = Prisma.UserGetPayload<typeof cardArgs>;
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function createAuthor(input: Prisma.UserCreateInput): Promise<Result<Card>> {
  try {
    const created = await prisma.user.create({ data: input });
    const card = await prisma.user.findUniqueOrThrow({ ...cardArgs, where: { id: created.id } });
    return { ok: true, value: card };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: e.code === "P2002" ? "duplicate" : `db:${e.code}` };
    }
    throw e;
  }
}

async function topPost(email: string): Promise<Result<string>> {
  const card = await prisma.user.findUnique({ ...cardArgs, where: { email } });
  if (card === null) return { ok: false, error: "not-found" };
  if (card.posts.length === 0) return { ok: false, error: "no-posts" };
  return { ok: true, value: card.posts[0].title };
}

async function main() {
  const input: Prisma.UserCreateInput = {
    email: "dee@x.io",
    name: "Dee",
    role: "EDITOR",
    posts: { create: [{ title: "Airflow Notes", published: true, views: 40 }] },
  };
  const first = await createAuthor(input);
  if (first.ok) console.log("created", first.value.name, first.value.role, first.value.posts[0].title);
  else console.log("created failed", first.error);

  const second = await createAuthor(input);
  if (second.ok) console.log("again unexpected success");
  else console.log("again", second.error);

  for (const email of ["ann@x.io", "cy@x.io", "ghost@x.io"]) {
    const r = await topPost(email);
    console.log("top", r.ok ? r.value : r.error);
  }
}

main().finally(() => prisma.$disconnect());