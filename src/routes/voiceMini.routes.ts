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

import { Router, type Response, type Request, type NextFunction } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
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
    // Nhận cả VIDEO. Người ta quay một đoạn rồi lấy tiếng trong đó làm
    // mẫu là chuyện rất thường — iPhone quay ra `.mov`, Android ra
    // `.mp4`. Bản trước chỉ nhận âm thanh thuần, mà `video/mp4` thì
    // không bắt đầu bằng `audio/` nên trượt cả hai phép xét.
    //
    // Không sợ nhận nhầm: `doiSangWav()` ngay sau đây bắt ffmpeg rút
    // tiếng ra, và file nào không có tiếng thì chính nó báo lỗi rõ ràng.
    // Chặn ở đây chỉ để khỏi tải lên một file 20MB rồi mới biết là ảnh.
    const okExt = [
      '.wav', '.mp3', '.m4a', '.ogg', '.flac', '.aac', '.webm', '.opus', '.aiff', '.aif', '.wma',
      '.mp4', '.mov', '.m4v', '.3gp', '.mkv', '.avi',
    ].includes(ext);
    const okMime =
      file.mimetype.startsWith('audio/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/octet-stream';
    if (okExt || okMime) cb(null, true);
    else cb(new Error(`Chỉ nhận file âm thanh hoặc video, không nhận ${ext || file.mimetype}`));
  },
});

// Cùng một địa chỉ với nhà cung cấp `cuongmini` của robot — xem ghi chú
// ở `cuongMiniRoot()` trong makerlab/tts.ts. Giọng nhân bản phải nằm ở
// ĐÚNG MỘT chỗ, nếu không web và robot sẽ nhìn thấy hai danh sách khác nhau.
const TTS_BASE = (process.env.TTS_SERVICE_URL || 'http://tts:8080').replace(/\/+$/, '');
const MAX_CHARS = Number(process.env.VOICE_MINI_MAX_CHARS) || 5000;

/**
 * Máy đọc THỨ HAI: F5-TTS chạy trên máy nhà (giọng nhân bản của chủ dự án),
 * với tới qua đường hầm ngược `172.18.0.1:18092`.
 *
 * Khác `TTS_BASE` ở ba điểm, và cả ba đều phải xử lý riêng:
 *
 *  1. **Đồng bộ**: `POST /noi` trả thẳng tiếng, không có khái niệm mã việc.
 *     Nhưng giao diện đã quen luồng "đặt việc → hỏi kết quả", nên ở đây giữ
 *     nguyên hợp đồng đó và cất tiếng vào bộ nhớ tạm — đổi hợp đồng thì phải
 *     sửa cả app lẫn web cho một nguồn giọng.
 *  2. **PCM THÔ, không có header WAV** (`application/octet-stream`). Đưa thẳng
 *     cho thẻ <audio> là im lặng. Phải tự bọc header — xem `bocWav()`.
 *  3. **Máy nhà có thể TẮT**. Nên mọi lời gọi tới nó đều phải chịu được hỏng:
 *     danh sách giọng thiếu 8 mục còn hơn cả trang danh sách chết theo.
 */
const F5_BASE = (process.env.F5_TTS_URL || 'http://172.18.0.1:18092').replace(/\/+$/, '');
/** Giọng có id bắt đầu bằng đây thì đi đường F5. */
const F5_TIEN_TO = 'f5-';

/**
 * Bọc PCM 16-bit mono thành WAV.
 *
 * Không có 44 byte header này thì trình duyệt không biết tần số lấy mẫu, số
 * kênh hay độ sâu bit — nó từ chối phát, và không có lỗi nào ngoài sự im lặng.
 * F5 gửi tần số thật ở header `X-Sample-Rate` (đo được: 24000).
 */
function bocWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);          // độ dài khối fmt
  header.writeUInt16LE(1, 20);           // 1 = PCM không nén
  header.writeUInt16LE(1, 22);           // 1 kênh
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);  // byte mỗi giây = sr × kênh × 2
  header.writeUInt16LE(2, 32);           // byte mỗi khung
  header.writeUInt16LE(16, 34);          // 16 bit
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/**
 * Tiếng do F5 đọc xong, chờ giao diện tới lấy.
 *
 * Có TTL và trần số lượng: không có thì mỗi câu đọc là vài trăm KB nằm lại
 * trong RAM của backend vĩnh viễn, và một người bấm cả ngày là đủ làm sập.
 */
const F5_TTL_MS = 5 * 60 * 1000;
const F5_TRAN_VIEC = 40;
const khoTiengF5 = new Map<string, { wav: Buffer; luc: number }>();

function donKhoF5(): void {
  const nay = Date.now();
  for (const [k, v] of khoTiengF5) {
    if (nay - v.luc > F5_TTL_MS) khoTiengF5.delete(k);
  }
  // Vẫn quá nhiều thì bỏ cái CŨ NHẤT — người dùng gần như luôn lấy cái vừa đặt.
  while (khoTiengF5.size > F5_TRAN_VIEC) {
    const cuNhat = [...khoTiengF5.entries()].sort((a, b) => a[1].luc - b[1].luc)[0];
    if (!cuNhat) break;
    khoTiengF5.delete(cuNhat[0]);
  }
}

async function f5Fetch(path: string, init?: RequestInit): Promise<Response_> {
  return fetch(`${F5_BASE}${path}`, {
    ...init,
    // Rộng hơn đường thường: F5 nạp model ở lần gọi đầu mất hơn 10 giây (đo
    // 18/08/2026: lần đầu 11,7s — lần sau 1,2s).
    signal: AbortSignal.timeout(Number(process.env.F5_TIMEOUT_MS) || 60_000),
  });
}

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

/**
 * Nói ĐÚNG vì sao máy đọc máy nhà hỏng.
 *
 * ⚠️ BẢN CŨ ĐOÁN, VÀ ĐOÁN SAI. Mọi lỗi đều ra một câu: "Máy đó có thể đang
 * tắt — chọn tạm một giọng khác." Ngày 18/08/2026 người dùng gặp câu đó trong
 * khi máy nhà đang BẬT, dịch vụ F5 đang CHẠY, đường hầm đang MỞ. Sự thật nằm
 * trong log của máy nhà:
 *
 *     torch.OutOfMemoryError: CUDA out of memory. Tried to allocate 20.00 MiB.
 *     GPU 0 has a total capacity of 11.62 GiB of which 56.88 MiB is free.
 *
 * Bốn dịch vụ GPU cùng ở trên một card 12GB, và F5 xin thêm 20MiB thì không
 * còn. Một câu đoán sai khiến người ta đi kiểm nguồn điện và đường mạng thay
 * vì nhìn vào VRAM — đó là cái giá thật của việc đoán.
 *
 * Nên: phân biệt "KHÔNG trả lời" với "TRẢ LỜI nhưng lỗi". Chỉ trường hợp đầu
 * mới được nói tới chuyện máy tắt.
 */
export async function vinaoF5Hong(e: unknown): Promise<string> {
  const loi = e instanceof Error ? e.message : String(e);
  // Có phản hồi HTTP (kể cả 500) ⇒ máy nhà SỐNG. Hỏi `/health` để nói cụ thể.
  const coPhanHoi = /HTTP \d{3}/.test(loi) || loi.includes('f5 HTTP');
  if (coPhanHoi) {
    const song = await f5Fetch('/health')
      .then((r) => (r.ok ? r.json() as Promise<{ ok?: boolean; daNap?: boolean }> : null))
      .catch(() => null);
    if (song) {
      return song.daNap === false
        ? 'Máy đọc giọng riêng đang chạy nhưng KHÔNG NẠP ĐƯỢC giọng — nhiều khả năng GPU máy nhà hết VRAM. '
          + 'Tắt bớt một dịch vụ GPU rồi thử lại, hoặc chọn tạm một giọng khác.'
        : 'Máy đọc giọng riêng đang chạy nhưng trả về lỗi khi đọc. Thử lại, hoặc chọn tạm một giọng khác.';
    }
    return 'Máy đọc giọng riêng trả về lỗi. Thử lại, hoặc chọn tạm một giọng khác.';
  }
  // Không có phản hồi nào ⇒ mới thật sự là "không trả lời".
  return 'Máy đọc giọng riêng (ở máy nhà) không trả lời — máy có thể đang tắt hoặc đường hầm đứt. '
    + 'Chọn tạm một giọng khác.';
}

router.get('/voices', authenticate, async (_req, res: Response<ApiResponse>) => {
  try {
    const r = await upstream('/voices');
    if (!r.ok) throw new Error(`tts HTTP ${r.status}`);
    const chinh = await r.json() as { voices?: unknown[] };

    /* Gộp thêm giọng của máy nhà — nhưng KHÔNG để nó làm hỏng cả danh sách.
     * Máy nhà tắt là chuyện bình thường (mất điện, người dùng tắt máy), và khi
     * đó thiếu 8 giọng còn hơn cả trang chọn giọng chết theo. */
    let themF5: unknown[] = [];
    try {
      const rf = await f5Fetch('/voices');
      if (rf.ok) {
        const o = await rf.json() as { voices?: unknown[] };
        themF5 = Array.isArray(o.voices) ? o.voices : [];
      }
    } catch {
      logger.info('VoiceMini: máy nhà (F5) không trả lời — bỏ qua nhóm giọng đó');
    }

    res.json({
      success: true,
      data: { ...chinh, voices: [...(chinh.voices ?? []), ...themF5] },
    });
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

  /* Giọng của máy nhà đi ĐƯỜNG KHÁC: F5 đọc xong ngay trong một lời gọi, không
   * có mã việc. Vẫn trả `{jobId}` như đường kia để giao diện không phải biết có
   * hai loại máy đọc — tiếng cất tạm trong bộ nhớ, `GET /tts/:jobId` lấy ra. */
  if (voice?.startsWith(F5_TIEN_TO)) {
    try {
      const rf = await f5Fetch('/noi', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      if (!rf.ok) {
        const chiTiet = await rf.text().catch(() => '');
        throw new Error(chiTiet.slice(0, 200) || `f5 HTTP ${rf.status}`);
      }
      const pcm = Buffer.from(await rf.arrayBuffer());
      const sr = Number(rf.headers.get('x-sample-rate')) || 24000;
      donKhoF5();
      const jobId = `f5-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      khoTiengF5.set(jobId, { wav: bocWav(pcm, sr), luc: Date.now() });
      logger.info('VoiceMini F5 đọc xong', { userId, jobId, kyTu: text.length, voice, sr });
      res.json({ success: true, data: { jobId } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.warn('VoiceMini: F5 hỏng', { error: msg });
      res.status(503).json({ success: false, message: await vinaoF5Hong(e) });
    }
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

  // Việc của F5 đã xong từ lúc đặt — lấy thẳng trong kho tạm, không hỏi ai.
  const sanF5 = khoTiengF5.get(jobId);
  if (sanF5) {
    khoTiengF5.delete(jobId);   // lấy một lần rồi thôi, đừng giữ RAM
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', String(sanF5.wav.length));
    res.send(sanF5.wav);
    return;
  }
  if (jobId.startsWith('f5-')) {
    // Mã việc F5 mà không còn trong kho = đã lấy rồi, hoặc quá 5 phút.
    res.status(404).json({ success: false, message: 'Bản đọc đã hết hạn, bấm đọc lại giúp mình.' });
    return;
  }

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
  const { writeFile, readFile, unlink } = await import('fs/promises');
  const { randomUUID } = await import('crypto');

  // ⚠️ Ghi ra FILE TẠM, KHÔNG ghi ra ống (pipe).
  //
  // Khuôn WAV để kích thước RIFF ở byte thứ 4, tức ngay đầu file — mà
  // ffmpeg chỉ biết kích thước đó sau khi ghi xong. Ghi ra file thì nó
  // quay lại điền; ghi ra ống thì không quay lại được nên nó điền
  // 0xFFFFFFFF nghĩa là "chưa biết".
  //
  // Đo thật 12/08/2026, cùng một nguồn:
  //   ghi ra ống   RIFF size = 4294967295
  //   ghi ra file  RIFF size = 530502
  //
  // `libsndfile` bỏ qua được cờ đó — nên bản trước chạy tốt trên VPS.
  // `torchcodec` (torchaudio 2.11 trở lên, đang chạy ở máy nhà) thì
  // không: nó giải mã ra ĐÚNG 0 khung và báo "No audio frames were
  // decoded", một câu không hề nhắc tới header.
  //
  // Bài học nằm ở chỗ khác: phép kiểm trước đó của tôi cho ffmpeg ghi
  // ra FILE, trong khi mã thật ghi ra ỐNG. Kiểm một đường, chạy một
  // đường — nên nó báo xanh trong khi người dùng vẫn hỏng.
  const tmp = `/tmp/ref-in-${randomUUID()}`;
  const ra = `/tmp/ref-out-${randomUUID()}.wav`;

  try {
    await writeFile(tmp, buf);
    await new Promise<void>((resolve, reject) => {
      const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
        '-hide_banner', '-loglevel', 'error',
        '-i', tmp,
        // -vn: VỨT luồng hình. Khuôn WAV không chứa nổi video, và nếu
        // không bỏ thì ffmpeg dừng với "Could not find tag for codec"
        // — một câu lỗi không hề gợi ý rằng vấn đề là cái file có hình.
        '-vn',
        '-ac', '1',
        '-c:a', 'pcm_s16le',
        '-y', ra,
      ]);
      const loi: Buffer[] = [];
      ff.stderr.on('data', (c: Buffer) => loi.push(c));
      ff.on('error', reject);
      ff.on('close', (ma) => {
        if (ma === 0) resolve();
        else reject(new Error(`không đọc được file âm thanh: ${Buffer.concat(loi).toString().slice(0, 200)}`));
      });
    });
    const wav = await readFile(ra);
    if (wav.length <= 44) throw new Error('file âm thanh rỗng sau khi đổi định dạng');
    return wav;
  } finally {
    await unlink(tmp).catch(() => undefined);
    await unlink(ra).catch(() => undefined);
  }
}

/**
 * Bọc multer để lỗi của nó thành 400 CÓ CHỮ, không phải 500 trống trơn.
 *
 * Multer gọi `cb(new Error(...))` khi bộ lọc từ chối file, hoặc ném
 * `MulterError` khi quá cỡ. Không có ai bắt thì Express trả "Internal
 * Server Error" — người dùng đọc câu đó không thể biết là do đuôi file
 * không được nhận hay do máy chủ hỏng thật. Đúng là chuyện đã xảy ra
 * với một file .mp4 ngày 12/08/2026.
 */
const nhanFile = (req: Request, res: Response, next: NextFunction): void => {
  refUpload.single('file')(req, res, (err: unknown) => {
    if (!err) return next();
    const m = err as { code?: string; message?: string };
    const msg =
      m.code === 'LIMIT_FILE_SIZE'
        ? 'File quá 20MB — cắt ngắn đoạn mẫu lại, 30-60 giây là đủ'
        : m.message || 'Không đọc được file tải lên';
    res.status(400).json({ success: false, message: msg });
  });
};

router.post(
  '/voices',
  authenticate,
  nhanFile,
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
    const ten = String(req.params.name);

    // ⚠️ CHẶN XOÁ GIỌNG MÀ ROBOT ĐANG DÙNG.
    //
    // 12/08/2026: người dùng dọn bớt giọng nhân bản, xoá trúng cái mà
    // persona của robot đang trỏ tới. Không gì báo cả — robot cứ thế
    // tụt xuống giọng Google miễn phí (cắt mẩu ~200 ký tự rồi dán lại,
    // nghe vấp liên tục). Người dùng tưởng robot hỏng, tôi đi đo đệm và
    // DMA suốt ba vòng, trong khi nguyên nhân chỉ là một con trỏ trỏ vào
    // chỗ trống.
    //
    // Chặn ở đây thay vì chỉ cảnh báo trên giao diện: giao diện là MỘT
    // lối vào, còn cái hỏng thì hỏng ở mọi lối.
    const dungBoi = await prisma.makerPersona.findFirst({
      where: { voiceProvider: 'cuongmini', voiceId: ten },
      select: { id: true, name: true },
    });
    if (dungBoi) {
      res.status(409).json({
        success: false,
        message:
          `Không xoá được: robot "${dungBoi.name ?? 'Odin'}" đang dùng giọng này. ` +
          `Vào Maker Lab → Tính cách đổi sang giọng khác trước, rồi quay lại xoá.`,
      });
      return;
    }

    const r = await upstream(`/voices/${encodeURIComponent(ten)}`, {
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
