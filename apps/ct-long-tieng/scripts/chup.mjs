/**
 * Chụp ảnh màn hình tài liệu (trang chủ + thư viện, sáng + tối) ở CHẾ ĐỘ THỬ, vào `docs/`.
 *   npm run chup
 * Dùng thư mục dữ liệu mock riêng, xoá sạch trước ⇒ ảnh luôn từ dữ liệu mẫu mới.
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
fs.rmSync(path.join(appData, 'ct-long-tieng-mock'), { recursive: true, force: true });
fs.rmSync(path.join(os.tmpdir(), 'ctlt-mock-videos'), { recursive: true, force: true });

const r = spawnSync(electronPath, [goc, '--mock'], {
  stdio: 'inherit',
  env: { ...process.env, CTLT_CHUP: path.join(goc, 'docs'), CTLT_MOCK_MA: 'ctlt_anhchupmau01' },
  timeout: 180_000,
});
process.exit(r.status ?? 1);
