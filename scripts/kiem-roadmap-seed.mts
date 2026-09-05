/**
 * Kiểm THẬT rằng seed lại lộ trình KHÔNG xoá dấu "đã xong" của người dùng.
 *
 * Vì sao cần: `RoadmapDone.node` khai `onDelete: Cascade`, nên bản seeder cũ
 * (`deleteMany` rồi tạo lại) xoá sạch tiến độ của MỌI người dùng mỗi lần thêm
 * nội dung. Đọc mã thì không thấy — cascade nằm ở schema, không ở service.
 *
 *   npx tsx scripts/kiem-roadmap-seed.mts
 */
import { PrismaClient } from '@prisma/client';
import { seedRoadmaps } from '../src/services/roadmap.service.js';

const p = new PrismaClient();

async function main() {
  const cs = await p.roadmap.findUnique({ where: { slug: 'cyber-security' }, select: { id: true } });

  let moc: { userId: number; title: string } | null = null;
  if (cs) {
    const u = await p.user.findFirst({ select: { id: true } });
    const n = await p.roadmapNode.findFirst({ where: { roadmapId: cs.id }, select: { id: true, title: true } });
    if (u && n) {
      await p.roadmapDone.upsert({
        where: { userId_nodeId: { userId: u.id, nodeId: n.id } },
        create: { userId: u.id, nodeId: n.id }, update: {},
      });
      moc = { userId: u.id, title: n.title };
      console.log(`mốc: user ${u.id} đã xong "${n.title}" (node ${n.id})`);
    }
  }

  const kq = await seedRoadmaps({ force: true });
  console.log(`\nseed xong · tạo mới ${kq.reduce((a, b) => a + b.created, 0)} node`);
  for (const r of kq.filter((x) => x.created > 0).sort((a, b) => b.created - a.created).slice(0, 10))
    console.log(`  +${String(r.created).padStart(4)}  ${r.slug}`);

  const dem = await p.roadmap.findMany({ select: { slug: true, _count: { select: { nodes: true } } }, orderBy: { sortOrder: 'asc' } });
  console.log(`\nTỔNG node trong DB: ${dem.reduce((a, b) => a + b._count.nodes, 0)}`);

  if (moc) {
    const n = await p.roadmapNode.findFirst({ where: { roadmap: { slug: 'cyber-security' }, title: moc.title }, select: { id: true } });
    const con = n ? await p.roadmapDone.findUnique({ where: { userId_nodeId: { userId: moc.userId, nodeId: n.id } } }) : null;
    console.log(`\nDẤU "ĐÃ XONG" SAU KHI SEED LẠI: ${con ? '✓ CÒN' : '✗ MẤT'}`);
    if (!con) process.exitCode = 1;
  } else {
    console.log('\n(chưa có dữ liệu để đặt mốc — chạy lại lần nữa để kiểm)');
  }
}

main().finally(() => p.$disconnect());
