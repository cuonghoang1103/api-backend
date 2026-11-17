/**
 * Kiểm luồng đầu-cuối ở chế độ thử: `npm run kiem-luong` (xem src/main/kiemLuong.ts).
 * Dữ liệu mock + thư mục video thử được xoá sạch trước (giữ `bin/yt-dlp` đã tải cho đỡ tải lại).
 * `CTLT_KIEM_YTDLP=0` ⇒ bỏ bước tải yt-dlp thật (bước đó cần mạng).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import electronPath from 'electron';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appData = process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Application Support')
  : process.platform === 'win32' ? process.env.APPDATA : path.join(os.homedir(), '.config');
const duLieu = path.join(appData, 'ct-long-tieng-mock');
for (const ten of fs.existsSync(duLieu) ? fs.readdirSync(duLieu) : []) {
  if (ten !== 'bin') fs.rmSync(path.join(duLieu, ten), { recursive: true, force: true });
}
fs.rmSync(path.join(os.tmpdir(), 'ctlt-mock-videos'), { recursive: true, force: true });

const r = spawnSync(electronPath, [goc, '--mock'], {
  stdio: 'inherit',
  env: { ...process.env, CTLT_KIEM_LUONG: '1', CTLT_MOCK_GIAY: '1' },
  timeout: 600_000,
});
process.exit(r.status ?? 1);
