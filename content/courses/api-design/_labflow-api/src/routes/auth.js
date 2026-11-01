// routes/auth.js — bài 6.1: đăng nhập bằng email + mật khẩu ⇒ JWT 15 phút
import { Router } from 'express';
import { z } from 'zod';
import { users } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { signJwt, ACCESS_TTL_SEC } from '../auth.js';
import { verifyPassword, hashPassword } from '../passwords.js';
import { rateLimit } from '../rateLimit.js';
import { VULN } from '../vuln.js';
import { limitInflight } from '../resilience.js';

// Bài 8.4: đăng nhập tốn CPU (scrypt) ⇒ tối đa N lượt cùng lúc, dư ⇒ 503 + Retry-After (LABFLOW_LOGIN_MAX_INFLIGHT, mặc định không giới hạn)
const MAX = Number(process.env.LABFLOW_LOGIN_MAX_INFLIGHT ?? Infinity);
const shed = Number.isFinite(MAX) ? [limitInflight(MAX)] : [];

const Login = z.strictObject({ email: z.string().trim().toLowerCase().max(200), password: z.string().min(1).max(200) });
// Dò mật khẩu: tối đa 5 lần mỗi 15 phút cho MỘT cặp (IP, email)
const loginLimit = rateLimit({ name: 'login', capacity: 5, windowSec: 900,
  key: (req) => `${req.ip}|${String(req.body?.email ?? '').toLowerCase()}` });
const DUMMY = hashPassword('không-ai-có-mật-khẩu-này');            // để email lạ cũng tốn đúng một lần scrypt

export const authRouter = Router();
authRouter.route('/login')
  .post(...shed, ...(VULN ? [] : [loginLimit]), validate('body', Login), async (req, res) => {   // bài 8.2: async — Express 5 tự chuyển lỗi
    const { email, password } = req.valid.body;
    const user = users.find((u) => u.email === email);
    const t0 = performance.now();
    const ok = (await verifyPassword(password, user?.passwordHash ?? DUMMY)) && user;
    req.timing.add('scrypt', performance.now() - t0);                 // thời gian CHỜ, event loop vẫn rảnh
    if (!ok) throw new HttpError(401, 'INVALID_CREDENTIALS');     // CÙNG một câu cho email sai và mật khẩu sai
    res.set('Cache-Control', 'no-store')
      .json({ accessToken: signJwt(user), tokenType: 'Bearer', expiresIn: ACCESS_TTL_SEC });
  })
  .all(onlyAllow('POST'));
