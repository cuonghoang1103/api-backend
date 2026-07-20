import { PrismaClient, Prisma } from './generated';

const APP_URL = "postgresql://app_user:app@localhost:55432/prisma_codelab";
const RO_URL = "postgresql://readonly_user:ro@localhost:55432/prisma_codelab";

// Runtime roles. The owner credentials stay in the migration job, not here.
const app = new PrismaClient({ datasources: { db: { url: APP_URL } } });
const ro = new PrismaClient({ datasources: { db: { url: RO_URL } } });
const owner = new PrismaClient();

async function denied(fn: () => Promise<unknown>): Promise<{ denied: boolean; cls: string }> {
  try {
    await fn();
    return { denied: false, cls: "none" };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { denied: /permission denied/i.test(message), cls: (e as object).constructor.name };
  }
}

async function main() {
  console.log("appReads", await app.note.count());
  await app.note.create({ data: { title: "N4", body: "written by app_user", tenantId: 1 } });
  console.log("appWrites ok");

  const del = await denied(() => app.note.delete({ where: { title: "N4" } }));
  console.log("appDelete", del.denied ? "denied" : "allowed");

  console.log("roReads", await ro.note.count());
  const ins = await denied(() => ro.note.create({ data: { title: "N5", body: "should fail", tenantId: 1 } }));
  console.log("roInsert", ins.denied ? "denied" : "allowed");
  console.log("errClass", ins.cls);

  console.log("notes", await owner.note.count());

  await Promise.all([app.$disconnect(), ro.$disconnect(), owner.$disconnect()]);
}

main();