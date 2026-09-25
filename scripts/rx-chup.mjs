/**
 * rx-chup.mjs — chụp ẢNH THẬT giao diện một dự án Vite (khoá React).
 *   node scripts/rx-chup.mjs <thư mục dự án> <ảnh.png> [--path /duong-dan] [--port 41NN] [--w 1280] [--h 800]
 *                 [--click "chữ trên nút"]… [--type "nhãn=giá trị"]… [--wait "chữ chờ xuất hiện"] [--dev]
 * Đuôi .jpg ⇒ JPEG chất lượng 80 (nhỏ, hợp để nhúng slide qua anh()). Mặc định: `vite build` rồi `vite preview` (giống production); --dev dùng `vite` dev server.
 * Dùng playwright-core của repo api-backend. Ảnh nhúng slide: lưu vào scripts/slides-src/rx-anh/<deck>/<ten>.jpg rồi gọi anh() trong deck.
 */
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
// Trình duyệt: như mọi script Playwright của repo (PLAYWRIGHT_BROWSERS_PATH nếu đặt).
const { chromium } = await import('playwright-core');
const [dir, out] = process.argv.slice(2);
const all = (k) => process.argv.flatMap((a, i) => (a === k ? [process.argv[i + 1]] : []));
const one = (k, d) => all(k)[0] ?? d;
const port = +one('--port', 4173 + Math.floor(Math.random() * 500));
const dev = process.argv.includes('--dev');
if (!dev) execSync('npx vite build', { cwd: dir, stdio: 'ignore' });
const srv = spawn('npx', dev ? ['vite', '--port', port, '--strictPort'] : ['vite', 'preview', '--port', port, '--strictPort'], { cwd: dir, stdio: 'ignore', detached: true });
const url = `http://localhost:${port}${one('--path', '/')}`;
try {
  for (let i = 0; i < 60; i++) { try { await fetch(url); break; } catch { await new Promise((r) => setTimeout(r, 250)); } }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +one('--w', 1280), height: +one('--h', 800) } });
  const logs = []; p.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`)); p.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  for (const t of all('--type')) { const [k, v] = t.split('='); await p.getByLabel(k).fill(v); }
  for (const c of all('--click')) await p.getByRole('button', { name: c }).click();
  const w = one('--wait'); if (w) await p.getByText(w).first().waitFor({ timeout: 10000 });
  await p.screenshot(out.endsWith('.jpg') ? { path: out, type: 'jpeg', quality: 80 } : { path: out });
  await b.close();
  console.log(`✓ ${out} ← ${url}`); if (logs.length) console.log(logs.join('\n'));
} finally { try { process.kill(-srv.pid); } catch {} }
