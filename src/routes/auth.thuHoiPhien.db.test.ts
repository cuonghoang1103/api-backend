/**
 * Thu hồi phiên (15/11/2026): đổi mật khẩu / "đăng xuất mọi thiết bị" ⇒ JWT cũ chết ở authenticate + /auth/refresh.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/auth.thuHoiPhien.db.test.ts
 */
import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database.js';

const RUN = process.env.WORK_DB_TEST === '1';
const duoi = `${Date.now()}`;
const tao: number[] = [];
const MK = 'MatKhauCu#12345';

async function taoUser(ten: string) {
  const u = await prisma.user.create({
    data: {
      username: `thuhoi_${ten}_${duoi}`,
      email: `thuhoi-${ten}-${duoi}@example.org`,
      password: await bcrypt.hash(MK, 4),
      emailVerified: true,
      emailVerifiedAt: new Date(),
      roles: { create: { role: { connect: { name: 'user' } } } },
    },
  });
  tao.push(u.id);
  return u;
}

/** Chạy `authenticate` với một Bearer token ⇒ null (qua) hoặc mã lỗi. */
async function quaAuth(token: string): Promise<string | null> {
  const { authenticate } = await import('../middleware/auth.js');
  const req = { headers: { authorization: `Bearer ${token}` }, cookies: {}, query: {} } as unknown as Request;
  return new Promise((resolve) => {
    void authenticate(req, {} as Response, ((err?: unknown) => resolve(err ? ((err as { code?: string }).code ?? 'LOI') : null)) as NextFunction);
  });
}

describe('Thu hồi phiên theo roleVersion', { skip: !RUN ? 'không có CSDL' : false }, () => {
  after(async () => {
    if (tao.length) await prisma.user.deleteMany({ where: { id: { in: tao } } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('đổi mật khẩu ⇒ token cũ (máy khác) bị chặn, refresh cũng không gia hạn được', async () => {
    const { authService } = await import('../services/auth.service.js');
    const u = await taoUser('doimk');
    const mayKhac = await authService.login(u.username, MK);
    assert.equal(await quaAuth(mayKhac.token), null, 'trước khi đổi: token chạy');
    await authService.changePassword(u.id, MK, 'MatKhauMoi#67890');
    assert.equal(await quaAuth(mayKhac.token), 'SESSION_REVOKED');
    await assert.rejects(() => authService.refreshToken(mayKhac.token), (e: { code?: string }) => e.code === 'SESSION_REVOKED');
    const moi = await authService.login(u.username, 'MatKhauMoi#67890');
    assert.equal(await quaAuth(moi.token), null, 'đăng nhập lại bằng mật khẩu mới thì chạy');
  });

  it('đăng xuất mọi thiết bị ⇒ máy khác chết, máy đang bấm nhận token mới vẫn chạy', async () => {
    const { authService } = await import('../services/auth.service.js');
    const u = await taoUser('moimay');
    const mayA = await authService.login(u.username, MK);
    const mayB = await authService.login(u.username, MK);
    const moiA = await authService.dangXuatMoiThietBi(u.id);
    assert.equal(await quaAuth(mayB.token), 'SESSION_REVOKED');
    assert.equal(await quaAuth(mayA.token), 'SESSION_REVOKED', 'token CŨ của máy A cũng chết — máy A phải dùng token mới');
    assert.equal(await quaAuth(moiA.token), null);
    const lamMoi = await authService.refreshToken(moiA.token);
    assert.equal(await quaAuth(lamMoi.token), null, 'token mới làm mới bình thường');
  });
});
