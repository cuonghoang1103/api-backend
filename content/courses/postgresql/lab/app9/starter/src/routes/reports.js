// GET /reports/revenue?from=2026-01&to=2026-09 — revenue by month, with a running total and month-over-month growth.
// Prisma has no date_trunc and no window functions ⇒ real SQL through $queryRaw (a tagged template: every ${…} is a
// PARAMETER $1, $2 … sent separately — never glued into the SQL text, so no SQL injection).
import { Router } from 'express';
import { LoiApi } from '../loi.js';

const THANG = /^(\d{4})-(0[1-9]|1[0-2])$/;
// '2026-01' ⇒ the instant 2026-01-01 00:00 in Việt Nam (+07:00) — the shop's months are Vietnamese months
const dauThang = (s, cong = 0) => {
  const m = THANG.exec(s);
  if (!m) throw new LoiApi(400, 'BAD_INPUT', 'from / to must look like 2026-01');
  const y = Number(m[1]), t = Number(m[2]) - 1 + cong;
  return new Date(`${String(y + Math.floor(t / 12)).padStart(4, '0')}-${String((t % 12) + 1).padStart(2, '0')}-01T00:00:00+07:00`);
};
const thangNay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 7);   // current month in Việt Nam

export function routerReports(prisma) {
  const r = Router();
  r.get('/reports/revenue', async (req, res) => {
    const to = String(req.query.to ?? thangNay());
    const tu = dauThang(String(req.query.from ?? to), req.query.from ? 0 : -11);   // default: the last 12 months
    const den = dauThang(to, 1);                                                    // [from, to + 1 month)
    if (den <= tu) throw new LoiApi(400, 'BAD_INPUT', 'from must not be after to');
    // TODO C7b · ONE $queryRaw (tagged template — ${tu} and ${den} become parameters, never string concatenation):
    //   per Vietnamese month (paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh') of the payments in [tu, den):
    //   thang 'YYYY-MM' · so_don (a number) · doanh_thu (text) · luy_ke = running total (window) ·
    //   tang_pct = growth vs the previous month in %, 1 decimal (lag) — text, null for the first month.
    //   Then: Prisma's log → EXPLAIN (ANALYZE, BUFFERS) in psql → the index (a migration!) → EXPLAIN again.
    const rows = [];
    res.json({ from: tu, to: den, months: rows });
  });
  return r;
}
