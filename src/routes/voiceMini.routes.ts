/**
 * ============================================================
 * Voice CuongMini — cổng ra cho dịch vụ tổng hợp giọng nói
 * ============================================================
 *
 * Endpoints:
 *   GET    /api/v1/voice-mini/voices        — danh sách giọng
 *   POST   /api/v1/voice-mini/tts           — đặt việc, trả jobId
 *   GET    /api/v1/voice-mini/tts/:jobId    — 202 khi đang chạy, WAV khi xong
 *   POST   /api/v1/voice-mini/voices        — nhân bản giọng từ file mẫu
 *   DELETE /api/v1/voice-mini/voices/:name  — xoá giọng đã nhân bản
 *
 * Vì sao là PROXY chứ không cho trình duyệt gọi thẳng: container `tts`
 * cố ý không mở cổng nào ra ngoài. Một lượt sinh chiếm gần trọn ba nhân
 * CPU trong vài giây, nên để lộ ra Internet là tặng người lạ cái nút
 * tắt VPS. Qua đây thì mọi lượt đều phải đăng nhập và bị đếm.
 *
 * Vì sao KHÔNG nhét vào chuỗi provider của robot: dịch vụ này chạy ở
 * RTF ~0,97 (đo thật). Robot cần dưới 0,4 — chậm hơn là bo phát nhanh
 * hơn server sinh, vòng đệm cạn, tiếng lặp từ. Đây là hai việc khác
 * nhau dùng hai máy khác nhau, cố ý.
 *
 * ⚠️ Không đặt ở `/api/v1/voice` — chỗ đó đã là Voice Hub.
 */

import { Router, type Response, type Request } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const TTS_BASE = (process.env.TTS_SERVICE_URL || 'http://tts:8080').replace(/\/+$/, '');
const MAX_CHARS = Number(process.env.VOICE_MINI_MAX_CHARS) || 5000;

/**
 * Trần số việc ĐANG CHẠY của mỗi người.
 *
 * Không có nó thì một người bấm nút hai chục lần là hai chục luồng cùng
 * tranh CPU, và mọi lượt — kể cả của người khác — đều chậm gấp bội.
 * Model bên kia vốn đã tự khoá một lượt tại một thời điểm, nên xếp hàng
 * thêm ở đây chỉ tổ dài thêm chứ không nhanh hơn.
 */
const MAX_RUNNING_PER_USER = 2;
const running = new Map<number, Set<string>>();

function userJobs(userId: number): Set<string> {
  let s = running.get(userId);
  if (!s) running.set(userId, (s = new Set()));
  return s;
}

async function upstream(path: string, init?: RequestInit): Promise<Response_> {
  return fetch(`${TTS_BASE}${path}`, {
    ...init,
    signal: AbortSignal.timeout(Number(process.env.VOICE_MINI_TIMEOUT_MS) || 30_000),
  });
}
type Response_ = Awaited<ReturnType<typeof fetch>>;

router.get('/voices', authenticate, async (_req, res: Response<ApiResponse>) => {
  try {
    const r = await upstream('/voices');
    if (!r.ok) throw new Error(`tts HTTP ${r.status}`);
    res.json({ success: true, data: await r.json() });
  } catch (e) {
    // Lần gọi đầu sau khi container khởi động phải nạp model ~45 giây,
    // nên hết giờ ở đây KHÔNG có nghĩa là hỏng — nói đúng như thế thay
    // vì để người dùng đoán.
    logger.warn('VoiceMini: không lấy được danh sách giọng', {
      error: e instanceof Error ? e.message : String(e),
    });
    res.status(503).json({
      success: false,
      message: 'Máy đọc đang khởi động (lần đầu mất khoảng 45 giây). Thử lại sau một lát.',
    });
  }
});

router.post('/tts', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  const userId = (req as Request & { user?: { id: number } }).user?.id ?? 0;
  const text = String(req.body?.text ?? '').trim();
  const voice = req.body?.voice ? String(req.body.voice) : undefined;

  if (!text) {
    res.status(400).json({ success: false, message: 'Chưa nhập văn bản' });
    return;
  }
  if (text.length > MAX_CHARS) {
    res.status(400).json({
      success: false,
      message: `Tối đa ${MAX_CHARS.toLocaleString('vi-VN')} ký tự, đang là ${text.length.toLocaleString('vi-VN')}`,
    });
    return;
  }
  if (userJobs(userId).size >= MAX_RUNNING_PER_USER) {
    res.status(429).json({
      success: false,
      message: 'Bạn đang có 2 bản đọc chạy dở. Chờ xong một cái rồi tạo tiếp.',
    });
    return;
  }

  try {
    const r = await upstream('/tts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    const data = (await r.json()) as { jobId?: string; detail?: string };
    if (!r.ok || !data.jobId) throw new Error(data.detail || `tts HTTP ${r.status}`);

    userJobs(userId).add(data.jobId);
    logger.info('VoiceMini đặt việc', { userId, jobId: data.jobId, kyTu: text.length, voice });
    res.json({ success: true, data });
  } catch (e) {
    logger.warn('VoiceMini: đặt việc hỏng', { error: e instanceof Error ? e.message : String(e) });
    res.status(503).json({ success: false, message: 'Máy đọc chưa sẵn sàng, thử lại sau một lát.' });
  }
});

router.get('/tts/:jobId', authenticate, async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: { id: number } }).user?.id ?? 0;
  const jobId = String(req.params.jobId);
  try {
    const r = await upstream(`/tts/${encodeURIComponent(jobId)}`);

    if (r.status === 202) {
      res.status(202).json({ success: true, data: await r.json() });
      return;
    }
    if (!r.ok) {
      userJobs(userId).delete(jobId);
      const body = await r.text();
      res.status(r.status === 404 ? 404 : 500).json({
        success: false,
        message: r.status === 404 ? 'Bản đọc đã quá hạn (giữ 30 phút)' : body.slice(0, 200),
      });
      return;
    }

    userJobs(userId).delete(jobId);
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', String(buf.length));
    res.setHeader('Content-Disposition', `attachment; filename="voice-cuongmini-${jobId.slice(0, 8)}.wav"`);
    // Chuyển tiếp số đo của máy đọc để giao diện hiện được "sinh trong
    // bao lâu" — không có nó thì không ai biết nhanh chậm ra sao.
    for (const h of ['x-audio-seconds', 'x-gen-ms', 'x-rtf']) {
      const v = r.headers.get(h);
      if (v) res.setHeader(h, v);
    }
    res.send(buf);
  } catch (e) {
    logger.warn('VoiceMini: lấy kết quả hỏng', { error: e instanceof Error ? e.message : String(e) });
    res.status(503).json({ success: false, message: 'Mất kết nối tới máy đọc' });
  }
});

export default router;
