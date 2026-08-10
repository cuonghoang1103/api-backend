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

/**
 * Chữ đệm trong câu nói, bỏ khi dò từng chữ.
 *
 * Người ta nói "bật cho tôi bài nhạc nào đó của Sơn Tùng" — chữ mang
 * thông tin chỉ là "Sơn Tùng". Không lọc thì "nhac" khớp vào nửa thư
 * viện và robot bật bừa một bài.
 */
const FILLER = new Set([
  'nhac', 'nhạc', 'bai', 'bài', 'hat', 'hát', 'mo', 'mở', 'bat', 'bật',
  'cho', 'toi', 'tôi', 'minh', 'mình', 'giup', 'giúp', 'nghe', 'len', 'lên',
  'nao', 'nào', 'khac', 'khác', 'gi', 'gì', 'day', 'đây', 'voi', 'với',
  'cua', 'của', 'mot', 'một', 'ten', 'tên', 'thich', 'thích', 'muon', 'muốn',
  'song', 'play', 'music', 'nay', 'này', 'kia', 'do', 'đó', 'duoc', 'được',
]);

export interface FoundTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  durationSeconds: number | null;
}

/**
 * Dò bài theo lời người nói.
 *
 * Người ta không đọc đúng tên bài trong cơ sở dữ liệu — họ nói "bật
 * bài Chưa Bao Giờ của Trung Quân" hoặc chỉ "mở nhạc Sơn Tùng". Nên
 * dò theo cả tên bài lẫn tên ca sĩ, không phân biệt hoa thường, và
 * chấp nhận khớp một phần.
 */
/**
 * Người ta nói "bật một bài bất kỳ" thì LLM gửi xuống `query: "random"`
 * — và đi tìm bài TÊN LÀ "random" thì tất nhiên không có. Đây là lỗi
 * thật đã gặp: robot bảo "bật rồi" mà loa im.
 *
 * Những chữ này nghĩa là "chọn giùm tôi", không phải tên bài.
 */
const ANY_SONG = new Set([
  'random', 'any', 'anything', 'bất kỳ', 'bat ky', 'bất cứ', 'gì cũng được',
  'gi cung duoc', 'tuỳ', 'tùy', 'tuy', 'gì đó', 'gi do', 'nhạc', 'nhac',
  'một bài bất kỳ', 'mot bai bat ky', 'ngẫu nhiên', 'ngau nhien',
]);

/** Bốc một bài bất kỳ trong thư viện. */
async function anyTrack(): Promise<FoundTrack | null> {
  const rows = await prisma.$queryRaw<
    Array<{ id: number; title: string; artist: string; audio_url: string; duration_seconds: number | null }>
  >`SELECT id, title, artist, audio_url, duration_seconds
      FROM music_tracks
     WHERE active = true AND category = 'NORMAL' AND audio_url IS NOT NULL
     ORDER BY random() LIMIT 1`;
  const t = rows[0];
  if (!t) return null;
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    url: absolute(t.audio_url),
    durationSeconds: t.duration_seconds,
  };
}

export async function findTrack(query: string): Promise<FoundTrack | null> {
  const q = query.trim();
  if (!q) return anyTrack();
  if (ANY_SONG.has(q.toLowerCase())) return anyTrack();

  const rows = await prisma.musicTrack.findMany({
    where: {
      active: true,
      category: 'NORMAL',
      audioUrl: { not: null },
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { artist: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, title: true, artist: true, audioUrl: true, durationSeconds: true },
    take: 5,
  });

  if (!rows.length) {
    // Không khớp cả cụm thì thử từng chữ — "nhạc Sơn Tùng buồn" vẫn
    // nên ra được bài của Sơn Tùng.
    //
    // ⚠️ Chữ phải ĐỦ DÀI và không phải chữ đệm. Thử lần đầu để lọt
    // chữ 2 ký tự, và câu vô nghĩa "zzz khong co bai nao ten nay" ra
    // được bài "NCS Best of 2020" — vì "co" nằm trong
    // "NoCopyrightSounds". Dò lỏng còn tệ hơn không dò: robot tự tin
    // bật nhầm một bài rồi bảo "mở bài này đây".
    const words = q
      .split(/\s+/)
      .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
      .filter((w) => w.length >= 4 && !FILLER.has(w.toLowerCase()));
    for (const w of words) {
      const hit = await prisma.musicTrack.findFirst({
        where: {
          active: true,
          category: 'NORMAL',
          audioUrl: { not: null },
          OR: [
            { title: { contains: w, mode: 'insensitive' } },
            { artist: { contains: w, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, artist: true, audioUrl: true, durationSeconds: true },
      });
      if (hit?.audioUrl)
        return {
          id: hit.id,
          title: hit.title,
          artist: hit.artist,
          url: absolute(hit.audioUrl),
          durationSeconds: hit.durationSeconds,
        };
    }
    // Không dò ra gì cả — nhưng người ta ĐANG muốn nghe nhạc. Bốc đại
    // một bài còn hơn im lặng rồi bảo "không tìm thấy": họ nói "bật
    // nhạc đi" chứ có phải đang tra cứu thư viện đâu.
    return anyTrack();
  }

  const t = rows[0];
  if (!t.audioUrl) return null;
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    url: absolute(t.audioUrl),
    durationSeconds: t.durationSeconds,
  };
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
export async function streamTrackAsPcm(
  url: string,
  onChunk: (pcm: Buffer) => boolean | Promise<boolean>,
  opts: { sampleRate?: number } = {},
): Promise<{ bytes: number; stopped: boolean }> {
  const rate = opts.sampleRate ?? PCM_SAMPLE_RATE;

  // ffmpeg đọc thẳng từ URL — không tải về đĩa VPS. Một bài 4 phút là
  // 7,7 MB PCM; ghi ra rồi đọc lại chỉ để xoá là ba lần chạm đĩa thừa.
  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner',
    '-loglevel', 'error',
    '-i', url,
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
const sessions = new Map<number, { stop: boolean; title: string }>();

export function isPlayingMusic(deviceId: number): boolean {
  return sessions.has(deviceId);
}

export function stopMusicOn(deviceId: number): boolean {
  const s = sessions.get(deviceId);
  if (!s) return false;
  s.stop = true;
  return true;
}

/**
 * Tìm bài rồi phát ra loa robot.
 *
 * Trả về câu ngắn để robot nói trước khi nhạc nổi lên — người dùng cần
 * biết nó tìm thấy bài gì, nhất là khi tên nghe nhầm.
 */
export async function playMusicOn(
  deviceId: number,
  query: string,
  opts: { allowFetch?: boolean; ownerId?: number } = {},
): Promise<string> {
  let track = await findTrack(query);

  // Không có trong thư viện → đi tìm ngoài YouTube, tải về, thêm vào
  // thư viện rồi phát. Lần sau gọi lại là có sẵn.
  if (!track && opts.allowFetch !== false && query.trim()) {
    try {
      track = await fetchFromYoutube(query, opts.ownerId);
    } catch (err) {
      logger.warn('MakerLab tải nhạc ngoài hỏng', {
        query,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (!track) return 'Thư viện nhạc đang trống, chưa có bài nào để bật.';

  // Đang phát bài khác thì dừng bài cũ trước, đợi nó nhả ra.
  if (sessions.has(deviceId)) {
    stopMusicOn(deviceId);
    await new Promise((r) => setTimeout(r, 250));
  }

  const gw = await import('../../socket/device.gateway.js');
  const session = { stop: false, title: track.title };
  sessions.set(deviceId, session);

  void (async () => {
    try {
      const seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
      if (seq === null) return;

      await streamTrackAsPcm(track.url, async (pcm) => {
        if (session.stop) return false;
        return await gw.speakStreamPushPcm(deviceId, pcm, seq);
      });

      gw.speakStreamEnd(deviceId, seq);
    } catch (err) {
      logger.warn('MakerLab phát nhạc hỏng', {
        deviceId,
        title: track.title,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      sessions.delete(deviceId);
    }
  })();

  return `Mở "${track.title}" của ${track.artist} đây.`;
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
