/**
 * ============================================================
 * Maker Lab — robot bật nhạc
 * ============================================================
 *
 * Nối vào thư viện nhạc CÓ SẴN của web (`MusicTrack`, file nằm trên
 * R2) chứ không dựng kho riêng. Bạn nói "bật bài Chưa Bao Giờ", server
 * dò trong đúng thư viện bạn vẫn nghe ở trang /music, rồi đẩy xuống
 * loa robot qua chính đường tiếng đang dùng để nói.
 *
 * Ba điều đáng biết trước khi nghe:
 *
 * 1. **Nhạc sẽ nghe tệ hơn ở trang web.** Đường tiếng xuống robot là
 *    PCM 16 kHz MỘT kênh — đủ cho giọng nói, nhưng cắt sạch âm trên
 *    8 kHz. Chũm choẹ và tiếng "s" sẽ mất. Đây là giới hạn của việc
 *    dùng chung một đường với giọng nói, đổi lại là không phải viết
 *    thêm đường thứ hai cho firmware.
 *
 * 2. **Phát theo dòng, không gom trước.** Một câu nói 5 giây là 160 KB,
 *    gọn trong đệm PSRAM. Một bài hát 4 phút là 7,7 MB — gấp 15 lần cả
 *    vùng đệm. Nên nhạc phải chảy liên tục và bo phát tới đâu nhận tới
 *    đó.
 *
 * 3. **Đang phát mà bạn nói thì phải hạ nhạc xuống**, không thì mic chỉ
 *    nghe thấy nhạc. Firmware tự làm việc đó khi VAD mở lượt.
 */

import { spawn } from 'child_process';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { PCM_SAMPLE_RATE } from './audio.js';
import { dungHangDoi, hieuYeuCau, type BaiTrongKho } from './musicTim.js';

export interface FoundTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  durationSeconds: number | null;
}

/** Bản ghi cũ lưu key R2 trần, bản mới lưu URL đầy đủ — chịu cả hai. */
function absolute(u: string): string {
  if (/^https?:\/\//i.test(u)) return u;
  const base = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
  return base ? `${base}/${u.replace(/^\/+/, '')}` : u;
}

/**
 * Tải bài rồi đổi sang PCM 16 kHz, phát ra theo từng mẩu.
 *
 * `onChunk` trả về false thì dừng ngay — đó là cách người dùng bảo
 * "thôi tắt đi" hoặc bo rớt mạng, và một bài bốn phút vẫn chảy tiếp
 * sau khi không ai nghe nữa là vừa tốn băng thông vừa tốn CPU của VPS.
 */
/**
 * Đổi link TRANG YouTube thành link LUỒNG TIẾNG thật.
 *
 * ffmpeg đọc được luồng âm thanh, không đọc được trang web. Đưa cho nó
 * `https://www.youtube.com/watch?v=...` thì nó tải về một mớ HTML rồi
 * báo "Invalid data found when processing input" — đúng lỗi đo được
 * ngày 11/08 khi robot bảo "mở bài này đây" rồi im bặt.
 *
 * Vì sao thư viện lại có link trang: 54 dòng trong `music_tracks` có
 * `audio_url` trỏ vào youtube.com — chúng vào bằng đường "thêm bài theo
 * URL" của module Music, nơi link trang là hợp lệ (trình duyệt nhúng
 * được player YouTube). Chỉ robot mới cần luồng thô.
 *
 * `yt-dlp -g` trả về URL googlevideo dùng được ngay, không phải tải bài
 * về đĩa. Mất 1-2 giây, và chỉ tốn khi bài đó thật sự là link YouTube.
 */
async function giaiLinkYoutube(url: string): Promise<string> {
  if (!/(?:youtube\.com|youtu\.be)/i.test(url)) return url;

  return new Promise((resolve) => {
    const yt = spawn(process.env.YTDLP_PATH || 'yt-dlp', [
      '-f', 'bestaudio[ext=m4a]/bestaudio/best',
      '--no-playlist',
      '-g',
      url,
    ]);
    let out = '';
    let err = '';
    yt.stdout.on('data', (c: Buffer) => (out += c.toString()));
    yt.stderr.on('data', (c: Buffer) => (err += c.toString()));
    const hen = setTimeout(() => yt.kill('SIGKILL'), 20_000);
    yt.on('close', () => {
      clearTimeout(hen);
      const truc = out.trim().split('\n')[0]?.trim();
      if (truc?.startsWith('http')) {
        resolve(truc);
      } else {
        // Trả lại link gốc: để ffmpeg thất bại và báo lỗi thật, còn hơn
        // ở đây ném ra một lỗi khác che mất nguyên nhân.
        logger.warn('MakerLab yt-dlp không giải được link', {
          url,
          err: err.slice(0, 200),
        });
        resolve(url);
      }
    });
  });
}

export async function streamTrackAsPcm(
  url: string,
  onChunk: (pcm: Buffer) => boolean | Promise<boolean>,
  opts: { sampleRate?: number } = {},
): Promise<{ bytes: number; stopped: boolean }> {
  const rate = opts.sampleRate ?? PCM_SAMPLE_RATE;
  const nguon = await giaiLinkYoutube(url);

  // ffmpeg đọc thẳng từ URL — không tải về đĩa VPS. Một bài 4 phút là
  // 7,7 MB PCM; ghi ra rồi đọc lại chỉ để xoá là ba lần chạm đĩa thừa.
  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner',
    '-loglevel', 'error',
    '-i', nguon,
    '-f', 's16le',
    '-acodec', 'pcm_s16le',
    '-ac', '1',
    '-ar', String(rate),
    // Nhạc thu ở mức to hơn giọng nói nhiều; hạ 6 dB cho khỏi vỡ tiếng
    // trên loa 3 W.
    '-af', 'volume=0.5',
    'pipe:1',
  ]);

  let bytes = 0;
  let stopped = false;
  const errBuf: Buffer[] = [];
  ff.stderr.on('data', (c: Buffer) => errBuf.push(c));

  try {
    for await (const chunk of ff.stdout as AsyncIterable<Buffer>) {
      bytes += chunk.length;
      const keep = await onChunk(chunk);
      if (!keep) {
        stopped = true;
        break;
      }
    }
  } finally {
    ff.kill('SIGKILL');
  }

  if (!bytes) {
    const msg = Buffer.concat(errBuf).toString().slice(0, 200);
    throw new Error(`không đọc được nhạc: ${msg || 'ffmpeg trả về rỗng'}`);
  }
  logger.info('MakerLab phát nhạc xong', {
    kb: Math.round(bytes / 1024),
    giay: +(bytes / 2 / rate).toFixed(1),
    stopped,
  });
  return { bytes, stopped };
}

// ─── Điều phối: tìm bài → đẩy xuống loa robot ──────────────

/**
 * Bài đang phát trên từng thiết bị.
 *
 * Cần sổ này vì "tắt nhạc" đến qua một lượt nói KHÁC, sau lượt đã bật
 * nhạc — mà lượt kia còn đang chạy trong một hàm async chưa kết thúc.
 * Không có chỗ chung để đặt cờ thì lệnh tắt không với tới được vòng
 * lặp đang chảy.
 */
const sessions = new Map<number, { stop: boolean; boQua: boolean; title: string }>();

/** Hàng đợi vừa phát của từng thiết bị — để "bài tiếp" / "phát tiếp nhạc" chạy được cả SAU khi nhạc đã dừng. */
const _hangCuoi = new Map<number, { hang: BaiTrongKho[]; i: number }>();

export function isPlayingMusic(deviceId: number): boolean {
  return sessions.has(deviceId);
}

export function stopMusicOn(deviceId: number): boolean {
  const s = sessions.get(deviceId);
  if (!s) return false;
  s.stop = true;
  return true;
}

// ─── Kho nhạc nạp sẵn (15/11/2026) ─────────────────────────
// Cả thư viện /music (cả mục REMIX), nhớ 5 phút — dò không dấu trong bộ nhớ thay vì `contains` phân biệt dấu.
let _kho: { den: number; ds: BaiTrongKho[] } | null = null;
async function khoNhac(): Promise<BaiTrongKho[]> {
  if (_kho && _kho.den > Date.now()) return _kho.ds;
  const rows = await prisma.musicTrack.findMany({
    where: { active: true, audioUrl: { not: null } },
    select: { id: true, title: true, artist: true, audioUrl: true, durationSeconds: true, category: true, language: true },
  });
  const ds = rows.map((r) => ({
    id: r.id, title: r.title, artist: r.artist, url: absolute(r.audioUrl!), durationSeconds: r.durationSeconds,
    category: r.category, language: r.language,
  }));
  _kho = { den: Date.now() + 5 * 60_000, ds };
  return ds;
}

/** Phát hàng đợi từ vị trí `tu`, nối bài liền nhau. Người dùng mở miệng (đổi lượt) ⇒ dừng cả hàng. */
function chayHang(deviceId: number, hang: BaiTrongKho[], tu: number): void {
  const session = { stop: false, boQua: false, title: hang[tu]?.title ?? '' };
  sessions.set(deviceId, session);
  _hangCuoi.set(deviceId, { hang, i: tu });
  void (async () => {
    const gw = await import('../../socket/device.gateway.js');
    try {
      for (let i = tu; i < hang.length && !session.stop; i++) {
        const bai = hang[i];
        session.title = bai.title;
        session.boQua = false;
        _hangCuoi.set(deviceId, { hang, i });
        const seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
        if (seq === null) return;
        let ok = true;
        try {
          await streamTrackAsPcm(bai.url, async (pcm) => {
            if (session.stop || session.boQua) return false;
            ok = await gw.speakStreamPushPcm(deviceId, pcm, seq);
            return ok;
          });
        } catch (err) {
          logger.warn('MakerLab phát nhạc hỏng một bài — sang bài sau', {
            deviceId, title: bai.title, error: err instanceof Error ? err.message : String(err),
          });
        }
        gw.speakStreamEnd(deviceId, seq);
        // Bo từ chối khung tiếng mà không phải do "bài tiếp" ⇒ người dùng vừa nói / lượt khác chen ⇒ dừng hàng.
        if (!ok && !session.boQua) session.stop = true;
        if (!session.stop) await new Promise((r) => setTimeout(r, 400));
      }
    } finally {
      if (sessions.get(deviceId) === session) sessions.delete(deviceId);
    }
  })();
}

/**
 * Tìm bài rồi phát ra loa robot — cả HÀNG ĐỢI, không chỉ một bài.
 * `query` đặc biệt: `__tiep__` (bài tiếp), `__lai__` (phát tiếp từ bài vừa dừng).
 * Trả câu ngắn để robot nói trước khi nhạc nổi lên.
 */
export async function playMusicOn(
  deviceId: number,
  query: string,
  opts: { allowFetch?: boolean; ownerId?: number; truocKhiPhat?: (cau: string) => Promise<unknown> } = {},
): Promise<string> {
  if (query === '__tiep__' || query === '__lai__') {
    const dang = sessions.get(deviceId);
    const cuoi = _hangCuoi.get(deviceId);
    if (dang && query === '__tiep__') { dang.boQua = true; return 'Chuyển bài nhé.'; }
    if (!cuoi) return 'Mình chưa phát bài nào để tiếp tục.';
    const tu = query === '__tiep__' ? cuoi.i + 1 : cuoi.i;
    if (tu >= cuoi.hang.length) return 'Hết danh sách rồi, bạn muốn nghe gì nữa?';
    if (dang) { stopMusicOn(deviceId); await new Promise((r) => setTimeout(r, 250)); }
    chayHang(deviceId, cuoi.hang, tu);
    const b = cuoi.hang[tu];
    return `Mở "${b.title}" của ${b.artist}.`;
  }

  const yc = hieuYeuCau(query);
  const kho = await khoNhac();
  let { hang, theo } = dungHangDoi(kho, yc);

  // Không có trong thư viện ⇒ đi tìm ngoài YouTube, tải về R2, thêm vào thư viện rồi phát.
  if (!hang.length && yc.kieu === 'tim' && opts.allowFetch !== false) {
    try {
      const t = await fetchFromYoutube(query, opts.ownerId);
      if (t) {
        _kho = null;
        hang = [{ id: t.id, title: t.title, artist: t.artist, url: t.url, durationSeconds: t.durationSeconds, category: 'NORMAL', language: null }];
        theo = 'ten';
      }
    } catch (err) {
      logger.warn('MakerLab tải nhạc ngoài hỏng', { query, error: err instanceof Error ? err.message : String(err) });
    }
  }
  if (!hang.length) {
    return yc.kieu === 'tim'
      ? `Mình không tìm thấy bài "${yc.tuKhoa}" trong thư viện, trên mạng cũng chưa tải được.`
      : 'Thư viện nhạc đang trống, chưa có bài nào để bật.';
  }

  if (sessions.has(deviceId)) {
    stopMusicOn(deviceId);
    await new Promise((r) => setTimeout(r, 250));
  }
  const b = hang[0];
  const loai = yc.remix ? 'remix ' : yc.ngonNgu === 'en' ? 'tiếng Anh ' : yc.ngonNgu === 'zh' ? 'tiếng Trung ' : yc.ngonNgu === 'vi' ? 'Việt ' : '';
  const note = theo === 'ca-si'
    ? `Mở nhạc của ${b.artist}, ${hang.length} bài, bắt đầu với "${b.title}".`
    : theo === 'ten'
      ? `Mở "${b.title}" của ${b.artist} đây.`
      : `Mở nhạc ${loai}ngẫu nhiên, bài đầu là "${b.title}" của ${b.artist}.`;
  // Nói tên bài TRƯỚC rồi mới phát — robot chỉ báo "bật rồi" khi đã chắc có bài (15/11/2026).
  if (opts.truocKhiPhat) await opts.truocKhiPhat(note).catch(() => undefined);
  chayHang(deviceId, hang, 0);
  logger.info('MakerLab hàng đợi nhạc', { deviceId, query, theo, soBai: hang.length, dau: b.title });
  return note;
}

// ─── Tìm nhạc ngoài thư viện (YouTube → R2 → thư viện) ─────

/**
 * Không có trong thư viện thì đi tìm ngoài YouTube, tải về R2, thêm
 * vào thư viện, rồi phát.
 *
 * Lần sau gọi lại bài đó là có sẵn ngay — nên mỗi lần bạn nhờ robot
 * tìm một bài mới, thư viện trang /music cũng dày thêm một bài. Hai
 * việc bạn yêu cầu (thêm nhạc vào thư viện, và tìm nhạc ngoài) hoá ra
 * là cùng một đường.
 *
 * ⚠️ Việc này CHẬM — tải và chuyển mã một bài mất 30 giây tới hai
 * phút, và `extractYoutubeAudioToR2` có khoá toàn cục nên chỉ một bài
 * được tải tại một thời điểm. Vì thế robot phải nói trước một câu
 * "đang tải, đợi chút" rồi mới phát; im lặng hai phút thì người ta
 * tưởng hỏng.
 */
export async function fetchFromYoutube(
  query: string,
  ownerId?: number,
): Promise<FoundTrack | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    logger.warn('MakerLab thiếu YOUTUBE_API_KEY, không tìm nhạc ngoài được');
    return null;
  }

  // ── Tìm ──
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoCategoryId', '10'); // chuyên mục Âm nhạc
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    logger.warn('MakerLab tìm YouTube hỏng', { status: res.status });
    return null;
  }
  const json = (await res.json()) as {
    items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string } }>;
  };
  const hit = json.items?.[0];
  const videoId = hit?.id?.videoId;
  if (!videoId) return null;

  const title = decodeEntities(hit?.snippet?.title ?? query).slice(0, 200);
  const artist = decodeEntities(hit?.snippet?.channelTitle ?? 'YouTube').slice(0, 200);

  // ── Tải về R2 ──
  const { extractYoutubeAudioToR2 } = await import('../youtubeAudio.service.js');
  const t0 = Date.now();
  const { key, size } = await extractYoutubeAudioToR2(
    `https://www.youtube.com/watch?v=${videoId}`,
    { userId: ownerId },
  );
  logger.info('MakerLab tải nhạc từ YouTube', {
    title,
    kb: Math.round(Number(size) / 1024),
    ms: Date.now() - t0,
  });

  // ── Thêm vào thư viện, để lần sau khỏi tải lại ──
  const row = await prisma.musicTrack.create({
    data: { title, artist, audioUrl: absolute(key), category: 'NORMAL', active: true },
    select: { id: true, title: true, artist: true, audioUrl: true, durationSeconds: true },
  });

  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    url: absolute(row.audioUrl ?? key),
    durationSeconds: row.durationSeconds,
  };
}

/** Tiêu đề YouTube trả về có &amp; &#39; … — đọc lên nghe rất buồn cười. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
