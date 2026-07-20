import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

// Client input is a KEY into this map, never a fragment of SQL. Anything
// unrecognised is rejected — sanitising attacker input is a losing game.
const SORT_COLUMNS: Record<string, string> = { title: '"title"', body: '"body"' };
const SORT_DIRS: Record<string, string> = { asc: "ASC", desc: "DESC" };

async function sortedNotes(prisma: PrismaClient, sortKey: string, dir: string) {
  const column = SORT_COLUMNS[sortKey];
  const direction = SORT_DIRS[dir];
  if (column === undefined || direction === undefined) {
    throw new Error(`unsupported sort: ${sortKey} ${dir}`);
  }
  return prisma.$queryRaw<{ title: string }[]>`
    SELECT title FROM "Note" ORDER BY ${Prisma.raw(column)} ${Prisma.raw(direction)}`;
}

async function main() {
  const byTitle = await sortedNotes(prisma, "title", "asc");
  console.log("byTitle", byTitle.map((n) => n.title).join(", "));

  const byBodyDesc = await sortedNotes(prisma, "body", "desc");
  console.log("byBodyDesc", byBodyDesc.map((n) => n.title).join(", "));

  try {
    await sortedNotes(prisma, 'title; DROP TABLE "Note"; --', "asc");
    console.log("rejected false");
  } catch {
    console.log("rejected true");
  }
  console.log("tableAlive", await prisma.note.count());

  // Same allowlist, no raw SQL: the client API takes the key directly.
  const CLIENT_SORTS = { title: "title", body: "body" } as const;
  const key = CLIENT_SORTS["title"];
  const clientSide = await prisma.note.findMany({ orderBy: { [key]: "asc" }, select: { title: true } });
  console.log("clientSide", clientSide.map((n) => n.title).join(", "));
}

main().finally(() => prisma.$disconnect());