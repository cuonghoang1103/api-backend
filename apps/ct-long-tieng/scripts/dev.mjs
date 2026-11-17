/**
 * Chạy dev: Vite dev server cho giao diện + Electron cho main/preload (dựng lại & khởi động lại khi sửa main).
 *   npm run dev          # nói chuyện với máy chủ thật (mặc định https://cuongthai.com)
 *   npm run dev:mock     # máy chủ GIẢ trên máy này — không cần API thật
 *
 * Electron chỉ khởi động SAU khi Vite đã nghe cổng (không thì nạp trang trống).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer } from 'vite';
import electronPath from 'electron';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mock = process.argv.includes('--mock');

const server = await createServer({ configFile: path.join(goc, 'vite.config.ts') });
await server.listen();
const url = server.resolvedUrls?.local[0] ?? 'http://127.0.0.1:5287/';
console.log(`[dev] giao diện: ${url}`);

let electron = null;
let khoiDongLai = false;
const chay = () => {
  electron = spawn(electronPath, [goc, ...(mock ? ['--mock'] : [])], {
    stdio: 'inherit',
    env: { ...process.env, CTLT_DEV_URL: url, NODE_ENV: 'development' },
  });
  electron.on('exit', (ma) => { if (!khoiDongLai) { void server.close(); process.exit(ma ?? 0); } });
};

let lanDau = 2;
for (const mode of ['main', 'preload']) {
  await build({
    configFile: path.join(goc, 'vite.main.config.ts'),
    mode,
    build: { watch: {} },
    logLevel: 'warn',
    plugins: [{
      name: 'khoi-dong-lai-electron',
      closeBundle() {
        if (lanDau > 0) { lanDau -= 1; if (lanDau === 0) chay(); return; }
        khoiDongLai = true;
        electron?.kill();
        khoiDongLai = false;
        chay();
      },
    }],
  });
}

process.on('SIGINT', () => { electron?.kill(); void server.close().then(() => process.exit(0)); });
