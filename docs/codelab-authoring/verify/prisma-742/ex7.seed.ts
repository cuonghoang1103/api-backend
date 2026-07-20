import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.auditLog.deleteMany(); await prisma.note.deleteMany(); await prisma.user.deleteMany();
await prisma.user.createMany({ data: [
  { email: "ann@x.io", name: "Ann", passwordHash: "$2b$10$annhash", tenantId: 1 },
  { email: "bob@x.io", name: "Bob", passwordHash: "$2b$10$bobhash", tenantId: 1 },
  { email: "cy@x.io",  name: "Cy",  passwordHash: "$2b$10$cyhash",  tenantId: 2 },
]});
await prisma.note.createMany({ data: [
  { title: "N1", body: "tenant one alpha", tenantId: 1 },
  { title: "N2", body: "tenant one beta",  tenantId: 1 },
  { title: "N3", body: "tenant two gamma", tenantId: 2 },
]});
// RLS is OFF in the base seed: it is a per-exercise concern, and leaving it on
// would make the privilege exercise read zero rows for the wrong reason.
await prisma.$executeRawUnsafe(`ALTER TABLE "Note" DISABLE ROW LEVEL SECURITY`).catch(() => {});
await prisma.$executeRawUnsafe(`DROP OWNED BY app_user`).catch(() => {});
await prisma.$executeRawUnsafe(`DROP ROLE IF EXISTS app_user`).catch(() => {});
await prisma.$executeRawUnsafe(`CREATE ROLE app_user LOGIN PASSWORD 'app'`);
await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO app_user`);
await prisma.$executeRawUnsafe(`GRANT SELECT, INSERT, UPDATE ON "Note" TO app_user`);
await prisma.$executeRawUnsafe(`GRANT SELECT ON "User" TO app_user`);
await prisma.$executeRawUnsafe(`DROP OWNED BY readonly_user`).catch(() => {});
await prisma.$executeRawUnsafe(`DROP ROLE IF EXISTS readonly_user`).catch(() => {});
await prisma.$executeRawUnsafe(`CREATE ROLE readonly_user LOGIN PASSWORD 'ro'`);
await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO readonly_user`);
await prisma.$executeRawUnsafe(`GRANT SELECT ON "Note" TO readonly_user`);
// An INSERT into a table with a SERIAL id also needs the sequence.
await prisma.$executeRawUnsafe(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user`);
}
main().finally(()=>prisma.$disconnect());