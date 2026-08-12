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
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

/**
 * Giọng mẫu để nhân bản.
 *
 * 20 MB là quá đủ: mẫu tốt nhất chỉ dài 5–15 giây. Trần cao hơn không
 * cho giọng giống hơn — thư viện tự cắt và khử nhiễu — mà chỉ tốn thời
 * gian tải lên và RAM của tiến trình Python.
 *
 * Giữ trong BỘ NHỚ chứ không ghi ra đĩa: file đi thẳng sang dịch vụ
 * tts rồi bỏ, không có lý do gì để nó chạm vào đĩa VPS (vốn đang là
 * thứ eo hẹp nhất ở đây).
 */
const refUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
    const okExt = ['.wav', '.mp3', '.m4a', '.ogg', '.flac', '.aac', '.webm'].includes(ext);
    const okMime = file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream';
    if (okExt || okMime) cb(null, true);
    else cb(new Error(`Chỉ nhận file âm thanh, không nhận ${ext || file.mimetype}`));
  },
});

// Cùng một địa chỉ với nhà cung cấp `cuongmini` của robot — xem ghi chú
// ở `cuongMiniRoot()` trong makerlab/tts.ts. Giọng nhân bản phải nằm ở
// ĐÚNG MỘT chỗ, nếu không web và robot sẽ nhìn thấy hai danh sách khác nhau.
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

/**
 * Nhân bản một giọng từ đoạn mẫu.
 *
 * Không có `authenticate` ở đây là không được: giọng nhân bản dùng
 * CHUNG cho mọi người vào trang (thư viện giọng nằm trong một file duy
 * nhất bên dịch vụ), nên ai thêm được cũng là ai cũng nghe thấy. Bắt
 * đăng nhập để ít nhất còn biết ai thêm cái gì.
 */
/**
 * Đổi file mẫu bất kỳ sang WAV trước khi chuyển tiếp cho dịch vụ TTS.
 *
 * Dịch vụ đọc file bằng `libsndfile`, mà thư viện đó chỉ biết wav, flac,
 * ogg, aiff — KHÔNG biết m4a/AAC. Người dùng ghi âm bằng iPhone hay
 * Voice Memo thì ra đúng `.m4a`, tức đường phổ biến nhất lại là đường
 * chết. Lỗi trả về cũng không nói gì về nguyên nhân:
 *
 *   Error opening '/tmp/ref-….m4a': Format not recognised.
 *
 * Đổi ở ĐÂY chứ không phải trong dịch vụ TTS: container backend có sẵn
 * ffmpeg (nó vốn dùng để đổi tiếng cho robot), còn container TTS là ảnh
 * Python gọn, cài thêm ffmpeg vào đó là phình thêm mấy trăm MB cho một
 * việc mà chỗ này làm được.
 *
 * Trộn về MỘT kênh vì bộ rút đặc trưng người nói chỉ nhận đơn kênh; giữ
 * nguyên tần số lấy mẫu gốc, đừng ép xuống 16 kHz — mẫu càng đủ chi tiết
 * thì giọng nhân bản càng giống, và dịch vụ tự lấy mẫu lại theo ý nó.
 */
async function doiSangWav(buf: Buffer): Promise<Buffer> {
  const { spawn } = await import('child_process');
  return new Promise((resolve, reject) => {
    const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
      '-hide_banner', '-loglevel', 'error',
      '-i', 'pipe:0',
      '-ac', '1',
      '-c:a', 'pcm_s16le',
      '-f', 'wav',
      'pipe:1',
    ]);
    const ra: Buffer[] = [];
    const loi: Buffer[] = [];
    ff.stdout.on('data', (c: Buffer) => ra.push(c));
    ff.stderr.on('data', (c: Buffer) => loi.push(c));
    ff.on('error', reject);
    ff.on('close', () => {
      const out = Buffer.concat(ra);
      if (out.length > 44) resolve(out);
      else reject(new Error(`không đọc được file âm thanh: ${Buffer.concat(loi).toString().slice(0, 200)}`));
    });
    ff.stdin.on('error', () => undefined);   // ffmpeg đóng sớm thì kệ
    ff.stdin.end(buf);
  });
}

router.post(
  '/voices',
  authenticate,
  refUpload.single('file'),
  async (req: Request, res: Response<ApiResponse>) => {
    const userId = (req as Request & { user?: { id: number } }).user?.id ?? 0;
    const file = (req as unknown as { file?: { buffer: Buffer; originalname?: string } }).file;
    const name = String(req.body?.name ?? '').trim().slice(0, 60);

    if (!file?.buffer?.length) {
      res.status(400).json({ success: false, message: 'Chưa chọn file giọng mẫu' });
      return;
    }
    if (!name) {
      res.status(400).json({ success: false, message: 'Chưa đặt tên cho giọng' });
      return;
    }

    try {
      // Dựng lại multipart để chuyển tiếp. Buffer → Blob vì FormData
      // của Node chỉ nhận Blob/File, không nhận Buffer thô.
      const wav = await doiSangWav(file.buffer);

      const form = new FormData();
      form.append('name', name);
      form.append('description', String(req.body?.description ?? '').slice(0, 120));
      form.append('gender', String(req.body?.gender ?? '').slice(0, 20));
      // Luôn gửi đi dưới tên .wav — dịch vụ đoán định dạng theo đuôi file.
      form.append('file', new Blob([new Uint8Array(wav)]), 'ref.wav');

      const r = await fetch(`${TTS_BASE}/voices`, {
        method: 'POST',
        body: form,
        // Nhân bản phải khử nhiễu + rút đặc trưng người nói, nặng hơn
        // một lượt đọc thường nhiều. 3 phút chứ không phải 30 giây như
        // các đường khác.
        signal: AbortSignal.timeout(180_000),
      });

      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; detail?: string };
      if (!r.ok || !body.ok) {
        res.status(400).json({
          success: false,
          message: body.detail || `Không nhân bản được (HTTP ${r.status})`,
        });
        return;
      }

      logger.info('VoiceMini nhân bản giọng', { userId, name, kb: Math.round(file.buffer.length / 1024) });
      res.json({ success: true, data: { voice: name } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn('VoiceMini: nhân bản hỏng', { error: msg });
      res.status(503).json({
        success: false,
        message: msg.includes('timeout')
          ? 'Nhân bản quá lâu — thử lại với đoạn mẫu ngắn hơn (5–15 giây là đủ).'
          : 'Máy đọc chưa sẵn sàng, thử lại sau một lát.',
      });
    }
  },
);

router.delete('/voices/:name', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const r = await upstream(`/voices/${encodeURIComponent(String(req.params.name))}`, {
      method: 'DELETE',
    });
    if (!r.ok) throw new Error(`tts HTTP ${r.status}`);
    res.json({ success: true, data: await r.json() });
  } catch (e) {
    logger.warn('VoiceMini: xoá giọng hỏng', { error: e instanceof Error ? e.message : String(e) });
    res.status(503).json({ success: false, message: 'Không xoá được giọng' });
  }
});

export default router;
