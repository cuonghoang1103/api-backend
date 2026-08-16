/**
 * Nhạc tải về nghe ngoại tuyến.
 *
 * File nằm trong `userData/music/<trackId>.<ext>`. Đây là bộ nhớ đệm của ứng
 * dụng chứ không phải tài liệu của người dùng, nên KHÔNG hỏi họ chọn thư mục —
 * hỏi một câu mà câu trả lời không đổi được gì chỉ làm rối.
 *
 * ─── Vì sao renderer tải, main chỉ ghi ───
 * Endpoint `/music/stream/:id` cần `Authorization: Bearer`, và token sống ở
 * renderer. Đưa token xuống main để main tự tải sẽ nhân đôi chỗ giữ bí mật mà
 * không được lợi gì. Renderer tải xong đưa bytes qua IPC; main chỉ làm đúng
 * việc mà renderer không được phép làm: chạm vào đĩa.
 *
 * ─── Vì sao tên file là số ───
 * `trackId` là `z.number()`. Renderer không truyền được chuỗi nào vào tên file,
 * nên không có đường nào dựng ra `../../` — path traversal không tồn tại ở đây
 * chứ không phải bị chặn.
 */
import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { DownloadedTrack, MusicUsage } from '../../shared/ipc';
import { handle } from './index';

export function musicDir(): string {
  return path.join(app.getPath('userData'), 'music');
}

/** Tên file cho một bài. Chỉ ghép từ số và đuôi đã nằm trong danh sách đóng. */
function fileNameFor(trackId: number, ext: string): string {
  return `${trackId}.${ext}`;
}

/** Tìm file của một bài, không cần biết trước đuôi. */
async function findFile(trackId: number): Promise<string | null> {
  try {
    const entries = await fs.readdir(musicDir());
    const match = entries.find((name) => name.startsWith(`${trackId}.`));
    return match ? path.join(musicDir(), match) : null;
  } catch {
    return null;
  }
}

async function listAll(): Promise<DownloadedTrack[]> {
  const dir = musicDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return []; // chưa tải bài nào — thư mục chưa tồn tại
  }

  const tracks = await Promise.all(
    entries.map(async (name) => {
      const dot = name.lastIndexOf('.');
      const trackId = Number(name.slice(0, dot));
      // Bỏ qua file lạ lọt vào thư mục: tên không phải số thì không phải của ta.
      if (!Number.isInteger(trackId) || trackId <= 0) return null;
      const stat = await fs.stat(path.join(dir, name));
      return {
        trackId,
        ext: name.slice(dot + 1),
        size: stat.size,
        downloadedAt: stat.mtimeMs,
      } satisfies DownloadedTrack;
    }),
  );

  return tracks
    .filter((t): t is DownloadedTrack => t !== null)
    .sort((a, b) => b.downloadedAt - a.downloadedAt);
}

export function registerMusicHandlers(): void {
  handle('music:listDownloaded', () => listAll());

  handle('music:saveAudio', async ({ trackId, bytes, ext }) => {
    const dir = musicDir();
    await fs.mkdir(dir, { recursive: true });

    // Xoá bản cũ trước: nếu lần trước tải ở đuôi khác (mp3 → m4a) thì hai file
    // cùng một bài sẽ cùng tồn tại, và `findFile` chọn ngẫu nhiên cái nào tuỳ
    // thứ tự đọc thư mục.
    const existing = await findFile(trackId);
    if (existing) await fs.rm(existing, { force: true });

    // Ghi file tạm rồi đổi tên. Mất điện hay đóng app giữa chừng sẽ để lại một
    // file nhạc CỤT — trình phát mở được nhưng phát tới giữa bài thì đứng, và
    // triệu chứng đó trông như lỗi bộ giải mã chứ không như tải hụt.
    const target = path.join(dir, fileNameFor(trackId, ext));
    const temp = `${target}.part`;
    await fs.writeFile(temp, bytes);
    await fs.rename(temp, target);
  });

  handle('music:deleteAudio', async ({ trackId }) => {
    const file = await findFile(trackId);
    if (file) await fs.rm(file, { force: true });
  });

  handle('music:usage', async (): Promise<MusicUsage> => {
    const tracks = await listAll();
    return {
      count: tracks.length,
      totalBytes: tracks.reduce((sum, track) => sum + track.size, 0),
    };
  });

  handle('music:clearAll', async () => {
    // Xoá thẳng, KHÔNG đưa vào Thùng rác — khác ghi chú ở chỗ đây là bản sao
    // của thứ vẫn còn nguyên trên máy chủ. Tải lại được, nên giữ trong Thùng
    // rác chỉ tốn đĩa đúng lúc người dùng đang cố giải phóng đĩa.
    await fs.rm(musicDir(), { recursive: true, force: true });
  });
}
