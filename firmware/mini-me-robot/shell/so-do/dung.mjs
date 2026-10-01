#!/usr/bin/env node
/**
 * Dựng mọi sơ đồ `*.svg` trong thư mục này ra PDF (khổ A4, để nhập vào
 * Vở trên iPad làm trang nền) và PNG (×2, để xem nhanh / AirDrop).
 *
 *     node shell/so-do/dung.mjs
 *
 * Dùng Chrome không giao diện vì nó vẽ đúng chữ tiếng Việt và emoji; máy
 * này không có rsvg-convert / ImageMagick / cairosvg.
 */
import { spawn } from 'node:child_process';
import {
  existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const THU_MUC = dirname(fileURLToPath(import.meta.url));
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Chạy Chrome tới khi tệp ra xuất hiện và thôi lớn lên, rồi tự tắt nó.
 *
 * ⚠️ Chrome 153 không giao diện GHI XONG tệp rồi KHÔNG THOÁT — đo 01/10/2026:
 * PDF ra sau ~1 giây, tiến trình vẫn treo sau 3 phút. Chờ nó tự thoát là
 * treo cả lệnh dựng, nên canh TỆP chứ không canh tiến trình.
 */
async function chayToiKhiCo(args, ra) {
  rmSync(ra, { force: true });
  const p = spawn(CHROME, args, { stdio: 'ignore' });
  const han = Date.now() + 60_000;
  let coTruoc = -1;
  while (Date.now() < han) {
    await ngu(500);
    if (!existsSync(ra)) continue;
    const co = statSync(ra).size;
    if (co > 0 && co === coTruoc) break;
    coTruoc = co;
  }
  p.kill('SIGTERM');
  await ngu(500);
  if (!existsSync(ra)) throw new Error(`Chrome không ra được ${ra}`);
}

for (const ten of readdirSync(THU_MUC).filter((f) => f.endsWith('.svg'))) {
  const goc = ten.replace(/\.svg$/, '');
  const svg = readFileSync(join(THU_MUC, ten), 'utf8');
  const [, rong, cao] = svg.match(/viewBox="0 0 (\d+) (\d+)"/);

  // Hồ sơ Chrome riêng: Chrome của người dùng đang mở thì hồ sơ mặc định
  // bị khoá, và chế độ không giao diện thoát im lặng không ra tệp nào.
  const tam = mkdtempSync(join(tmpdir(), 'so-do-'));
  const html = join(tam, `${goc}.html`);
  writeFileSync(
    html,
    `<!doctype html><meta charset="utf-8"><style>
      @page { size: 210mm 297mm; margin: 0 }
      html, body { margin: 0; background: #fff }
      svg { display: block; width: ${rong}px; height: ${cao}px }
      @media print { svg { width: 210mm; height: 297mm } }
    </style>${svg}`,
  );
  const chung = ['--headless=new', '--disable-gpu', `--user-data-dir=${join(tam, 'ho-so')}`];
  await chayToiKhiCo([
    ...chung, '--no-pdf-header-footer',
    `--print-to-pdf=${join(THU_MUC, `${goc}.pdf`)}`, `file://${html}`,
  ], join(THU_MUC, `${goc}.pdf`));
  await chayToiKhiCo([
    ...chung, '--hide-scrollbars', '--force-device-scale-factor=2',
    `--window-size=${rong},${cao}`,
    `--screenshot=${join(THU_MUC, `${goc}.png`)}`, `file://${html}`,
  ], join(THU_MUC, `${goc}.png`));
  rmSync(tam, { recursive: true, force: true });
  console.log(`✓ ${goc}.pdf + ${goc}.png`);
}
