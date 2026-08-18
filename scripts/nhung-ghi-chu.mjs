/**
 * nhung-ghi-chu.mjs — dựng vector cho ghi chú đã có (chạy tay, một lần).
 * ─────────────────────────────────────────────────────────────────────────────
 *   docker exec cuonghoangdev_backend node scripts/nhung-ghi-chu.mjs           # xem trước
 *   docker exec cuonghoangdev_backend node scripts/nhung-ghi-chu.mjs --lam     # làm thật
 *   docker exec cuonghoangdev_backend node scripts/nhung-ghi-chu.mjs --lam --user 1
 *
 * Ghi chú viết TỪ TRƯỚC khi có tính năng này thì chưa có vector nào, nên Trợ lý
 * sẽ lùi về tìm theo từ khoá cho tới khi chạy lệnh này. Ghi chú tạo/sửa SAU đó
 * được nhúng tự động lúc lưu.
 *
 * An toàn khi chạy lại: mỗi ghi chú bị xoá vector cũ rồi ghi lại, nên chạy hai
 * lần không đẻ thêm dòng nào.
 */
import { PrismaClient } from '@prisma/client';

const LAM = process.argv.includes('--lam');
const iUser = process.argv.indexOf('--user');
const userLoc = iUser > -1 ? Number(process.argv[iUser + 1]) : null;

const prisma = new PrismaClient();

async function main() {
  const { capNhatNhung } = await import('../dist/services/noteEmbedding.service.js');

  const dsNote = await prisma.note.findMany({
    where: { deletedAt: null, ...(userLoc ? { userId: userLoc } : {}) },
    select: { id: true, userId: true, title: true },
    orderBy: { id: 'asc' },
  });

  const daCo = await prisma.$queryRaw`SELECT DISTINCT note_id FROM note_embeddings`;
  const coRoi = new Set(daCo.map((r) => Number(r.note_id)));
  const canLam = dsNote.filter((n) => !coRoi.has(n.id));

  console.log(`Ghi chú: ${dsNote.length} · đã có vector: ${coRoi.size} · cần nhúng: ${canLam.length}`);
  if (!LAM) {
    console.log('\nChỉ XEM TRƯỚC. Muốn làm thật: thêm --lam');
    return;
  }

  let xong = 0, boQua = 0, hong = 0;
  for (const n of canLam) {
    try {
      const kq = await capNhatNhung(n.id);
      if (kq === 'xong') xong++;
      else if (kq === 'bo-qua') boQua++;
      else {
        // Máy nhúng tắt giữa chừng: DỪNG HẲN thay vì chạy tiếp và ghi log hỏng
        // cho từng ghi chú còn lại — người đọc log sẽ tưởng dữ liệu có vấn đề.
        console.error(`\n❌ Máy nhúng không trả lời (ghi chú #${n.id}). Dừng ở đây.`);
        console.error('   Kiểm: ssh linux-nha "systemctl --user status nhung"');
        break;
      }
      if ((xong + boQua) % 20 === 0) process.stdout.write(`\r  đã xử lý ${xong + boQua}/${canLam.length}…`);
    } catch (e) {
      hong++;
      console.error(`\n  ghi chú #${n.id} hỏng: ${e.message}`);
    }
  }
  console.log(`\n\n✅ nhúng ${xong} · bỏ qua ${boQua} (rỗng) · hỏng ${hong}`);
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
