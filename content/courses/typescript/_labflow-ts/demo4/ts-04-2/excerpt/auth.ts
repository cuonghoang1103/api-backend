// cuongthai.com backend, src/middleware/auth.ts (excerpt, commit 88ec543b0) — adds fields to Express's own Request.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: number;
      /** Per-request correlation id (set by the request-id middleware). */
      id?: string;
    }
  }
}
