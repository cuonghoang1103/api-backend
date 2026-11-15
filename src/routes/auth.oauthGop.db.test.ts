/**
 * OAuth gộp vào tài khoản sẵn có cùng email (15/11/2026) — chặn pre-account hijacking.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/auth.oauthGop.db.test.ts
 * Kẻ xấu đăng ký trước bằng email nạn nhân (chưa xác thực, login bị chặn) ⇒ nạn nhân đăng nhập Google ⇒
 * mật khẩu của kẻ xấu KHÔNG được dùng được. Tài khoản đã xác thực từ trước thì GIỮ mật khẩu (chủ thật tự đặt).
 */
import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';

const RUN = process.env.WORK_DB_TEST === '1';
const duoi = `${Date.now()}`;
const tao: number[] = [];

async function taoUser(email: string, verified: boolean) {
  const u = await prisma.user.create({
    data: {
      username: `oauthgop_${verified ? 'v' : 'u'}_${duoi}`,
      email,
      password: await bcrypt.hash('MatKhauKeXau#123', 4),
      emailVerified: verified,
      emailVerifiedAt: verified ? new Date() : null,
      roles: { create: { role: { connect: { name: 'user' } } } },
    },
  });
  tao.push(u.id);
  return u;
}

describe('OAuth gộp tài khoản cùng email', { skip: !RUN ? 'không có CSDL' : false }, () => {
  after(async () => {
    if (tao.length) await prisma.user.deleteMany({ where: { id: { in: tao } } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('tài khoản CHƯA xác thực ⇒ gộp OAuth xoá mật khẩu, mật khẩu cũ không đăng nhập được', async () => {
    const { authService } = await import('../services/auth.service.js');
    const email = `oauthgop-u-${duoi}@example.org`;
    const u = await taoUser(email, false);
    // trước khi gộp: login bị chặn vì chưa xác thực
    await assert.rejects(() => authService.login(u.username, 'MatKhauKeXau#123'), (e: any) => e.code === 'EMAIL_NOT_VERIFIED');
    await authService.oauthRegister({ email, provider: 'google', providerId: `g-${duoi}` });
    const sau = await prisma.user.findUniqueOrThrow({ where: { id: u.id } });
    assert.equal(sau.emailVerified, true);
    assert.equal(sau.password, null, 'mật khẩu của người lập tài khoản chưa xác thực phải bị xoá');
    await assert.rejects(() => authService.login(u.username, 'MatKhauKeXau#123'));
  });

  it('tài khoản ĐÃ xác thực ⇒ gộp OAuth GIỮ mật khẩu', async () => {
    const { authService } = await import('../services/auth.service.js');
    const email = `oauthgop-v-${duoi}@example.org`;
    const u = await taoUser(email, true);
    await authService.oauthRegister({ email, provider: 'google', providerId: `g2-${duoi}` });
    const sau = await prisma.user.findUniqueOrThrow({ where: { id: u.id } });
    assert.ok(sau.password && (await bcrypt.compare('MatKhauKeXau#123', sau.password)));
  });
});
