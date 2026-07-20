import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

const args = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, name: true, role: true, age: true, profile: { select: { bio: true } } },
});
type Row = Prisma.UserGetPayload<typeof args>;

type UserDto = { id: number; name: string; role: Role; bio?: string; adult: boolean };

function toDto(row: Row): UserDto {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.profile === null ? undefined : row.profile.bio,
    adult: row.age !== null && row.age >= 18,
  } satisfies UserDto;
}

async function listUsers(): Promise<UserDto[]> {
  const rows = await prisma.user.findMany({ ...args, orderBy: { name: "asc" } });
  return rows.map(toDto);
}

async function main() {
  const dtos = await listUsers();
  for (const d of dtos) console.log(d.name, d.role, d.bio === undefined ? "-" : d.bio, d.adult);
  console.log("keys", Object.keys(dtos[0]).join(", "));
}

main().finally(() => prisma.$disconnect());