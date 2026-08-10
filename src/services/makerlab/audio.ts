/**
 * ============================================================
 * Maker Lab — chuyển đổi âm thanh cho thiết bị
 * ============================================================
 *
 * TTS trả về MP3. Vi điều khiển thì thích PCM thô hơn nhiều:
 *
 *   MP3  — 6 KB một câu, nhưng ESP32 phải giải mã. Thêm một thư viện,
 *          thêm một bộ đệm vòng trong PSRAM, thêm một chỗ để sai.
 *   PCM  — 120 KB một câu, nhưng firmware chỉ việc đẩy thẳng byte vào
 *          I2S. Không giải mã, không thư viện, không có gì để hỏng.
 *
 * Bản đầu tiên chọn PCM: 120 KB qua WiFi mất khoảng 0,1 giây, trong
 * khi một lỗi giải mã MP3 có thể mất cả buổi tối. Khi chuỗi đã chạy
 * ổn định thì đổi sang MP3 chỉ là thêm một lớp — hạ tầng hai bên đều
 * đã hỗ trợ sẵn qua trường `audio` trong gói `hello`.
 */

import { spawn } from 'child_process';
import { logger } from '../../utils/logger.js';

/** Định dạng thiết bị khai báo nó nhận được. */
export type DeviceAudioFormat = 'mp3' | 'pcm';

/** Whisper muốn 16 kHz; loa robot cũng phát ở đó luôn cho khỏi đổi. */
export const PCM_SAMPLE_RATE = 16_000;

/**
 * Bộ giải mã, xếp theo thứ tự ưu tiên.
 *
 * mpg123 đứng trước vì image production chỉ cài nó (xem Dockerfile):
 * ~1,5 MB cho đúng một việc, thay vì ~80 MB của ffmpeg. ffmpeg đứng
 * sau để máy lập trình — vốn gần như luôn có sẵn ffmpeg mà hiếm khi
 * có mpg123 — vẫn chạy thử được ở local mà không phải cài thêm gì.
 *
 * Cả hai đều xuất PCM 16 bit có dấu, thứ tự byte theo máy (x86 và ARM
 * đều little-endian, đúng thứ ESP32 chờ).
 */
interface Decoder {
  bin: string;
  args: (rate: number) => string[];
}

const DECODERS: Decoder[] = [
  { bin: 'mpg123', args: (r) => ['-q', '--mono', '-r', String(r), '-s', '-'] },
  {
    bin: 'ffmpeg',
    args: (r) => [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',
      '-f', 's16le',
      '-acodec', 'pcm_s16le',
      '-ac', '1',
      '-ar', String(r),
      'pipe:1',
    ],
  },
];

/** Bộ giải mã đã dùng được — dò một lần rồi nhớ luôn. */
let chosen: Decoder | null = null;

function candidates(): Decoder[] {
  if (chosen) return [chosen];
  const forced = process.env.MAKERLAB_MP3_DECODER;
  if (forced) {
    const hit = DECODERS.find((d) => d.bin === forced);
    if (hit) return [hit, ...DECODERS.filter((d) => d !== hit)];
    return [{ bin: forced, args: DECODERS[0].args }, ...DECODERS];
  }
  // FFMPEG_PATH được đặt sẵn nghĩa là máy này có ffmpeg ở chỗ riêng.
  const custom = process.env.FFMPEG_PATH;
  if (custom) return [{ bin: custom, args: DECODERS[1].args }, ...DECODERS];
  return DECODERS;
}

function decodeWith(dec: Decoder, mp3: Buffer, sampleRate: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ff = spawn(dec.bin, dec.args(sampleRate));

    const out: Buffer[] = [];
    const err: Buffer[] = [];
    let settled = false;

    const done = (e: Error | null, buf?: Buffer) => {
      if (settled) return;
      settled = true;
      if (e) reject(e);
      else resolve(buf ?? Buffer.alloc(0));
    };

    ff.stdout.on('data', (c: Buffer) => out.push(c));
    ff.stderr.on('data', (c: Buffer) => err.push(c));

    ff.on('error', (e) => {
      const notFound = (e as NodeJS.ErrnoException).code === 'ENOENT';
      const wrapped = new Error(`${dec.bin} không chạy được: ${e.message}`);
      // Đánh dấu để hàm gọi biết là "máy không có công cụ này" chứ
      // không phải "file MP3 hỏng" — chỉ trường hợp đầu mới đáng thử
      // công cụ tiếp theo.
      (wrapped as Error & { missing?: boolean }).missing = notFound;
      done(wrapped);
    });

    ff.on('close', (code) => {
      if (code !== 0) {
        const msg = Buffer.concat(err).toString().slice(0, 200);
        done(new Error(`${dec.bin} thoát ${code}: ${msg}`));
        return;
      }
      done(null, Buffer.concat(out));
    });

    // Đừng để một câu nói treo mãi nếu bộ giải mã kẹt.
    const timer = setTimeout(() => {
      ff.kill('SIGKILL');
      done(new Error(`${dec.bin} quá hạn 15s`));
    }, 15_000);
    ff.on('close', () => clearTimeout(timer));

    ff.stdin.on('error', () => {
      /* tiến trình đóng sớm — lỗi thật sẽ xuất hiện ở sự kiện close */
    });
    ff.stdin.end(mp3);
  });
}

/**
 * MP3 → PCM 16-bit little-endian, mono, 16 kHz — không header, thuần
 * mẫu, đúng thứ đẩy thẳng vào I2S được.
 *
 * Chạy qua stdin/stdout chứ không qua file tạm: một câu nói chỉ vài
 * trăm KB, và ghi đĩa cho mỗi lượt nói là cách chắc chắn để làm mòn
 * SSD của VPS.
 */
export async function mp3ToPcm(mp3: Buffer, sampleRate = PCM_SAMPLE_RATE): Promise<Buffer> {
  const list = candidates();
  let lastErr: Error | null = null;

  for (const dec of list) {
    try {
      const pcm = await decodeWith(dec, mp3, sampleRate);
      if (chosen !== dec) {
        chosen = dec;
        logger.info('MakerLab dùng bộ giải mã MP3', { decoder: dec.bin });
      }
      return pcm;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      // Công cụ có thật mà vẫn hỏng → lỗi ở dữ liệu, thử công cụ khác
      // cũng hỏng y hệt. Dừng luôn cho đỡ tốn thời gian.
      if (!(lastErr as Error & { missing?: boolean }).missing) throw lastErr;
    }
  }

  throw new Error(
    `Không có bộ giải mã MP3 nào chạy được (đã thử: ${list.map((d) => d.bin).join(', ')}). ` +
      `Cài mpg123 vào image — xem Dockerfile. Lỗi cuối: ${lastErr?.message ?? '?'}`,
  );
}

/**
 * Chuẩn bị audio đúng định dạng thiết bị nhận được.
 * Trả về nguyên MP3 nếu thiết bị tự giải mã được.
 */
export async function encodeForDevice(
  mp3: Buffer,
  format: DeviceAudioFormat,
): Promise<{ audio: Buffer; mime: string; sampleRate?: number }> {
  if (format === 'mp3') {
    return { audio: mp3, mime: 'audio/mpeg' };
  }

  const t0 = Date.now();
  const pcm = await mp3ToPcm(mp3);
  logger.info('MakerLab đổi MP3 → PCM', {
    mp3Kb: Math.round(mp3.length / 1024),
    pcmKb: Math.round(pcm.length / 1024),
    ms: Date.now() - t0,
    seconds: +(pcm.length / 2 / PCM_SAMPLE_RATE).toFixed(1),
  });

  return { audio: pcm, mime: 'audio/L16', sampleRate: PCM_SAMPLE_RATE };
}
