/**
 * Mã khôi phục dùng ĐÚNG MỘT LẦN và mã TOTP không dùng lại được — chạy thật
 * trên CSDL (array_remove + updateMany có điều kiện là chỗ đảm bảo, đọc mã
 * không chứng minh được). Không có CSDL (vd CI) thì TỰ BỎ QUA.
 *
 * Tạo một user tạm `mfa_test_<ngẫu nhiên>` rồi xoá sạch ở cuối.
 */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { prisma } from '../../config/database.js';
import { closeRedis, getRedis } from '../../config/redis.js';
import { base32Encode, hotp, buocHienTai, sinhKhoaTotp } from './totp.js';
import { bamMaKhoiPhuc, maHoaSecret, sinhMaKhoiPhuc } from './maHoa.js';
import { xacMinh } from './mfa.service.js';

async function coCsdl(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT "mfa_enabled" FROM "users" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

let userId: number | null = null;

after(async () => {
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await getRedis().then((r) => r.del(`mfa:sai:${userId}`)).catch(() => {});
  }
  await prisma.$disconnect().catch(() => {});
  await closeRedis().catch(() => {});
});

test('mã khôi phục một lần + TOTP chống dùng lại (CSDL thật)', async (t) => {
  if (!(await coCsdl())) { t.skip('không có CSDL'); return; }
  const tag = randomBytes(4).toString('hex');
  const u = await prisma.user.create({
    data: { username: `mfa_test_${tag}`, email: `mfa_test_${tag}@example.invalid`, password: null },
  });
  userId = u.id;
  const khoa = sinhKhoaTotp();
  const ma = sinhMaKhoiPhuc();
  await prisma.user.update({
    where: { id: u.id },
    data: {
      mfaEnabled: true,
      mfaEnabledAt: new Date(Math.floor(Date.now() / 1000) * 1000),
      mfaSecret: maHoaSecret(base32Encode(khoa), u.id),
      mfaRecoveryCodes: ma.map(bamMaKhoiPhuc),
    },
  });

  // Mã khôi phục: lần 1 được, lần 2 bị từ chối, mã khác vẫn còn.
  const r1 = await xacMinh(u.id, { recoveryCode: ma[0]!.toUpperCase() });
  assert.equal(r1.usedRecoveryCode, true);
  await assert.rejects(() => xacMinh(u.id, { recoveryCode: ma[0]! }), { code: 'MFA_INVALID_CODE' });
  const sau = await prisma.user.findUniqueOrThrow({ where: { id: u.id }, select: { mfaRecoveryCodes: true } });
  assert.equal(sau.mfaRecoveryCodes.length, 9);

  // TOTP: cùng mã lần 2 bị từ chối.
  const code = hotp(khoa, buocHienTai());
  await xacMinh(u.id, { code });
  await assert.rejects(() => xacMinh(u.id, { code }), { code: 'MFA_INVALID_CODE' });
});
