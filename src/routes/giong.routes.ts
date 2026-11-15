/**
 * /api/v1/giong — đọc giọng ElevenLabs cho web (15/11/2026). Luật + sổ: `services/giong/elevenlabs.ts`.
 *
 *   GET  /quyen?viec=                      ⇒ { duoc, lyDo } — web hỏi trước (nhớ vài phút) để Free khỏi gọi thử.
 *   GET  /doc?text=&viec=&lang=            ⇒ audio/mpeg CHẢY DẦN (thẻ <audio> phát ngay khi có byte đầu),
 *                                             hoặc 302 sang bản đã lưu trên R2 (câu lặp lại ⇒ 0 credit).
 *                                             403 `GIONG_EL_KHONG` ⇒ web lùi về giọng trình duyệt.
 *   GET  /admin/thong-ke                    ⇒ số dư thật + dùng theo việc/ngày/người (ADMIN).
 *   PUT  /admin/cai-dat                     ⇒ công tắc, trần Pro, quỹ giữ cho robot, giọng/model (ADMIN).
 *
 * GET (không phải POST) cho `/doc` vì thẻ <audio src> tự gửi cookie `backend_token` và phát được luồng đang
 * về — POST + blob phải chờ tải XONG mới phát. Chữ ≤ 400 ký tự/lượt (URL tiếng Việt mã hoá dài ~9×, nginx
 * `large_client_header_buffers` mặc định 8 KB); web tự chia câu.
 */
import { createHash } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import {
  VIEC_EL, NHAN_VIEC_EL, type ViecEl, quyenEl, moLuongEl, ghiDungEl, soDuEl, caiDatGiong, luuCaiDatGiong,
  daDungHomNay, daDungGiong,
} from '../services/giong/elevenlabs.js';

const router = Router();
const TRAN_KY_TU = 400;
/** Câu ≤ ngần này ký tự thì lưu R2 để lần sau phát lại miễn phí (từ vựng, câu mẫu, câu chào…). */
const TRAN_LUU = 400;

function docViec(x: unknown): Exclude<ViecEl, 'robot'> {
  const v = String(x ?? '');
  return (VIEC_EL as readonly string[]).includes(v) && v !== 'robot' ? (v as Exclude<ViecEl, 'robot'>) : 'khac';
}

const _daCo = new Set<string>();
async function daCoTrenR2(key: string): Promise<boolean> {
  if (_daCo.has(key)) return true;
  try {
    const { objectExists } = await import('../config/r2.js');
    if (await objectExists(key)) {
      if (_daCo.size > 50_000) _daCo.clear();
      _daCo.add(key);
      return true;
    }
  } catch { /* R2 hỏng ⇒ coi như chưa có, đọc mới */ }
  return false;
}

router.get('/quyen', authenticate, async (req: Request, res: Response) => {
  const viec = docViec(req.query.viec);
  const q = await quyenEl({ viec, userId: req.userId, kyTu: 1 });
  const cd = await caiDatGiong();
  let conLaiHomNay: number | null = null;
  if (q.duoc && !q.laAdmin && req.userId) conLaiHomNay = Math.max(0, cd.tranProNgay - (await daDungHomNay(req.userId)));
  res.json({ success: true, data: { duoc: q.duoc, lyDo: q.lyDo, conLaiHomNay } });
});

router.get('/doc', authenticate, async (req: Request, res: Response) => {
  const text = String(req.query.text ?? '').replace(/\s+/g, ' ').trim().slice(0, TRAN_KY_TU);
  if (!text) { res.status(400).json({ success: false, message: 'Thiếu chữ' }); return; }
  const viec = docViec(req.query.viec);
  const lang = String(req.query.lang ?? '').slice(0, 5);
  const q = await quyenEl({ viec, userId: req.userId, kyTu: text.length, ngonNgu: lang });
  if (!q.duoc) {
    res.status(403).json({ success: false, code: 'GIONG_EL_KHONG', lyDo: q.lyDo });
    return;
  }

  const key = `giong-el/${q.model}/${q.giong}/${createHash('sha256').update(text).digest('hex').slice(0, 40)}.mp3`;
  if (text.length <= TRAN_LUU && (await daCoTrenR2(key))) {
    const { buildPublicUrl } = await import('../config/r2.js');
    void ghiDungEl({ viec, userId: req.userId, kyTu: text.length, model: q.model, ms: 0, ok: true, cache: true });
    res.redirect(302, buildPublicUrl(key));
    return;
  }

  const t = Date.now();
  const ctl = new AbortController();
  req.on('close', () => { if (!res.writableEnded) ctl.abort(); });
  try {
    const up = await moLuongEl({ text, giong: q.giong, model: q.model, dinhDang: 'mp3_44100_64', signal: ctl.signal });
    daDungGiong(q.giong);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-Accel-Buffering', 'no');
    const phan: Buffer[] = [];
    for await (const m of up.body as unknown as AsyncIterable<Uint8Array>) {
      const b = Buffer.from(m);
      phan.push(b);
      res.write(b);
    }
    res.end();
    void ghiDungEl({ viec, userId: req.userId, kyTu: text.length, model: q.model, ms: Date.now() - t, ok: true });
    if (text.length <= TRAN_LUU) {
      const { putObject } = await import('../config/r2.js');
      putObject(key, Buffer.concat(phan), 'audio/mpeg')
        .then(() => _daCo.add(key))
        .catch((e) => logger.warn('[giong-el] không lưu được R2', { error: (e as Error).message }));
    }
  } catch (err) {
    const loi = err instanceof Error ? err.message : String(err);
    void ghiDungEl({ viec, userId: req.userId, kyTu: text.length, model: q.model, ms: Date.now() - t, ok: false, loi });
    if (ctl.signal.aborted) return; // người nghe đã bỏ đi
    logger.warn('[giong-el] đọc hỏng', { viec, error: loi });
    if (!res.headersSent) res.status(502).json({ success: false, code: 'GIONG_EL_HONG', message: 'Không đọc được bằng ElevenLabs' });
    else res.end();
  }
});

// ─── Admin ─────────────────────────────────────────────────────────────

const admin = Router();
admin.use(authenticate, requireRole('ADMIN'));

admin.get('/thong-ke', async (_req: Request, res: Response) => {
  const { dauNgayVn } = await import('../services/agent/anthropicChinhHang/hanMuc.js');
  const homNay = dauNgayVn();
  const truoc = (ngay: number) => new Date(homNay.getTime() - ngay * 86_400_000);
  const theoViec = async (tu: Date) => {
    const g = await prisma.giongElDung.groupBy({
      by: ['viec', 'cache', 'ok'],
      where: { createdAt: { gte: tu } },
      _sum: { kyTu: true, credit: true },
      _count: { _all: true },
    });
    const ra: Record<string, { luot: number; kyTu: number; credit: number; cache: number; loi: number }> = {};
    for (const v of VIEC_EL) ra[v] = { luot: 0, kyTu: 0, credit: 0, cache: 0, loi: 0 };
    for (const r of g) {
      const o = (ra[r.viec] ??= { luot: 0, kyTu: 0, credit: 0, cache: 0, loi: 0 });
      o.luot += r._count._all;
      if (r.cache) o.cache += r._count._all;
      else if (!r.ok) o.loi += r._count._all;
      else o.kyTu += r._sum.kyTu ?? 0;
      o.credit += r._sum.credit ?? 0;
    }
    return ra;
  };
  const [soDu, cd, homNayV, bayNgay, baMuoiNgay, theoNgay, topNguoi, loiGanDay] = await Promise.all([
    soDuEl({ moi: true }),
    caiDatGiong(),
    theoViec(homNay),
    theoViec(truoc(6)),
    theoViec(truoc(29)),
    prisma.$queryRaw<Array<{ ngay: string; viec: string; credit: bigint; luot: bigint }>>`
      SELECT to_char((created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM-DD') AS ngay,
             viec, COALESCE(SUM(credit), 0)::bigint AS credit, COUNT(*)::bigint AS luot
      FROM giong_el_dung WHERE created_at >= ${truoc(13)}
      GROUP BY 1, 2 ORDER BY 1`,
    prisma.giongElDung.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: truoc(6) }, userId: { not: null } },
      _sum: { credit: true, kyTu: true },
      _count: { _all: true },
      orderBy: { _sum: { credit: 'desc' } },
      take: 10,
    }),
    prisma.giongElDung.findMany({ where: { ok: false }, orderBy: { createdAt: 'desc' }, take: 8, select: { createdAt: true, viec: true, loi: true } }),
  ]);
  const ids = topNguoi.map((t) => t.userId!).filter(Boolean);
  const users = ids.length
    ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, email: true } })
    : [];
  res.json({
    success: true,
    data: {
      soDu,
      caiDat: cd,
      nhanViec: NHAN_VIEC_EL,
      homNay: homNayV,
      bayNgay,
      baMuoiNgay,
      theoNgay: theoNgay.map((r) => ({ ngay: r.ngay, viec: r.viec, credit: Number(r.credit), luot: Number(r.luot) })),
      topNguoi: topNguoi.map((t) => {
        const u = users.find((x) => x.id === t.userId);
        return { userId: t.userId, ten: u?.username ?? u?.email ?? `#${t.userId}`, credit: t._sum.credit ?? 0, kyTu: t._sum.kyTu ?? 0, luot: t._count._all };
      }),
      loiGanDay,
    },
  });
});

admin.put('/cai-dat', async (req: Request, res: Response) => {
  const cd = await luuCaiDatGiong(req.body);
  logger.info('[giong-el] admin đổi cài đặt', { userId: req.userId, cd });
  res.json({ success: true, data: cd });
});

router.use('/admin', admin);

export default router;
