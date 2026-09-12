/**
 * Kiểm SỔ CÁI ĐIỂM — chạy thật, không đọc mã rồi đoán.
 * ─────────────────────────────────────────────────────────────────────────
 * Chạy:
 *   docker run -d --name pg-kiem -e POSTGRES_PASSWORD=123456 \
 *     -e POSTGRES_DB=kiem -p 55432:5432 pgvector/pgvector:pg16
 *   # dựng schema vào đó, rồi:
 *   DATABASE_URL="postgresql://postgres:123456@localhost:55432/kiem" \
 *     npx tsx scripts/kiem-so-cai-diem.ts
 *
 * ⚠️ CHỈ chạy trên DB vứt đi. Script tạo/xoá user id 990001 và mọi giao
 * dịch của người đó.
 *
 * Phép kiểm số 5 là quan trọng nhất: 10 lượt trừ SONG SONG trên một ví chỉ
 * đủ 3 lượt. Đọc-rồi-ghi sẽ cho số dư ÂM ở đây; `updateMany` có điều kiện
 * `balance >= amount` thì không. Đây là thứ không thể kiểm bằng cách đọc mã.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// points.service dùng `prisma` từ config/database — nạp module sau khi đã
// trỏ DATABASE_URL sang DB kiểm tra (đã làm qua env lúc chạy).
const P = await import('../src/services/points.service.js').catch(
  () => { throw new Error('khong nap duoc points.service'); },
);

let pass = 0, fail = 0;
const ok = (ten: string, dieu: boolean, them = '') => {
  if (dieu) { pass++; console.log(`  ✅ ${ten}`); }
  else { fail++; console.log(`  ❌ ${ten} ${them}`); }
};

const uid = 990001;
await prisma.$executeRawUnsafe(`
  INSERT INTO users (id, username, email, password, full_name, enabled, created_at, updated_at, is_pro)
  VALUES (${uid}, 'kiemdiem', 'kiemdiem@test.local', 'x', 'Kiem Diem', true, NOW(), NOW(), false)
  ON CONFLICT (id) DO NOTHING;`);
await prisma.pointTransaction.deleteMany({ where: { userId: uid } });
await prisma.pointAccount.deleteMany({ where: { userId: uid } });

console.log('\n1. Cộng điểm');
const a = await P.congDiem({ userId: uid, points: 50000, kind: 'TOPUP', description: 'nap thu', idempotencyKey: 'k1' });
ok('cộng 50.000 → số dư 50.000', a.balance === 50000, `(thực tế ${a.balance})`);
ok('applied = true', a.applied === true);

console.log('\n2. Idempotency — CÙNG khoá gửi lại');
const b = await P.congDiem({ userId: uid, points: 50000, kind: 'TOPUP', description: 'nap thu', idempotencyKey: 'k1' });
ok('KHÔNG cộng lần hai', b.balance === 50000, `(thực tế ${b.balance})`);
ok('applied = false', b.applied === false);

console.log('\n3. Trừ điểm');
const c = await P.truDiem({ userId: uid, points: 20000, kind: 'SPEND', description: 'mua', idempotencyKey: 'k2' });
ok('trừ 20.000 → còn 30.000', c.balance === 30000, `(thực tế ${c.balance})`);

console.log('\n4. Trừ QUÁ số dư → phải BỊ TỪ CHỐI');
let bitChan = false;
try { await P.truDiem({ userId: uid, points: 999999, kind: 'SPEND', description: 'qua tay', idempotencyKey: 'k3' }); }
catch { bitChan = true; }
ok('ném lỗi', bitChan);
ok('số dư KHÔNG đổi', (await P.laySoDu(uid)) === 30000, `(thực tế ${await P.laySoDu(uid)})`);

console.log('\n5. Đua 10 lượt trừ SONG SONG, ví chỉ đủ 3 lượt');
await P.congDiem({ userId: uid, points: 0 + 1, kind: 'BONUS', description: 'lam tron', idempotencyKey: 'k-round' });
// đặt số dư về đúng 30.000
const duHienTai = await P.laySoDu(uid);
if (duHienTai !== 30000) {
  await P.ghiSo({ userId: uid, amount: 30000 - duHienTai, kind: 'ADMIN_ADJUST', description: 'set 30k', idempotencyKey: 'k-set' });
}
const ketQua = await Promise.allSettled(
  Array.from({ length: 10 }, (_, i) =>
    P.truDiem({ userId: uid, points: 10000, kind: 'SPEND', description: `dua ${i}`, idempotencyKey: `dua-${i}` }),
  ),
);
const thanhCong = ketQua.filter((r) => r.status === 'fulfilled').length;
const duCuoi = await P.laySoDu(uid);
ok('đúng 3 lượt thành công', thanhCong === 3, `(thực tế ${thanhCong})`);
ok('số dư = 0, KHÔNG âm', duCuoi === 0, `(thực tế ${duCuoi})`);

console.log('\n6. Bất biến: số dư == tổng sổ cái');
const kiem = await P.kiemTraSoDu(uid);
ok('khớp', kiem.khop, `(balance=${kiem.balance}, sổ=${kiem.tongSoCai})`);

console.log('\n7. Hoàn điểm idempotent');
const h1 = await P.hoanDiem(uid, 5000, 'SHOP_ORDER', 777, 'hoan lan 1');
const h2 = await P.hoanDiem(uid, 5000, 'SHOP_ORDER', 777, 'hoan lan 2');
ok('hoàn lần 1 cộng 5.000', h1.balance === 5000, `(${h1.balance})`);
ok('hoàn lần 2 KHÔNG cộng thêm', h2.balance === 5000 && h2.applied === false, `(${h2.balance})`);

await prisma.pointTransaction.deleteMany({ where: { userId: uid } });
await prisma.pointAccount.deleteMany({ where: { userId: uid } });
await prisma.$executeRawUnsafe(`DELETE FROM users WHERE id = ${uid};`);
await prisma.$disconnect();

console.log(`\n${'═'.repeat(46)}\nĐẠT ${pass} · HỎNG ${fail}\n`);
process.exit(fail === 0 ? 0 : 1);
