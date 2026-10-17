/**
 * Script cài CuongMini CLI: `irm https://cuongthai.com/cli/install.ps1 | iex`.
 *
 * Phục vụ qua route (không để trong public/) vì Next trả `.ps1` dạng nhị phân,
 * mà `irm … | iex` của PowerShell 5.1 cần CHỮ. Nội dung đọc lúc BUILD từ
 * `frontend/cli-cai/` (do `packages/cuongmini-cli/dong-goi.mjs` chép vào).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-static';

const NOI_DUNG = readFileSync(path.join(process.cwd(), 'cli-cai', 'install.ps1'), 'utf8');

export function GET(): Response {
  return new Response(NOI_DUNG, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-cache' },
  });
}
