/**
 * Chạy dev: Vite dev server cho renderer + Electron cho main/preload.
 *
 * Vì sao cần script riêng thay vì `concurrently`: Electron phải khởi động SAU
 * khi Vite đã nghe cổng. Chạy song song mù thì Electron nạp
 * http://localhost:5273 trước khi có gì ở đó và hiện trang lỗi trắng — người
 * viết mã phải tự tải lại tay mỗi lần, và triệu chứng trông y hệt lỗi cấu hình.
 */
import { spawn } from 'node:child_process';
import { createServer, build } from 'vite';
import electronPath from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

let electron = null;
let restarting = false;

function startElectron() {
  electron = spawn(electronPath, [path.join(root, 'dist/main/index.cjs')], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  });

  electron.on('exit', (code) => {
    // Khởi động lại do sửa mã main thì không thoát; người dùng đóng cửa sổ mới thoát.
    if (restarting) return;
    process.exit(code ?? 0);
  });
}

function stopElectron() {
  if (!electron) return;
  restarting = true;
  electron.kill();
  electron = null;
}

const server = await createServer({ configFile: path.join(root, 'vite.config.ts') });
await server.listen();
server.printUrls();

// Build main+preload một lần, rồi theo dõi thay đổi. Sửa file trong src/main
// hay src/preload sẽ build lại và khởi động lại Electron — renderer giữ nguyên
// HMR của Vite nên vòng lặp sửa/chạy vẫn nhanh.
await build({
  configFile: path.join(root, 'vite.main.config.ts'),
  build: {
    watch: {},
  },
  plugins: [
    {
      name: 'restart-electron',
      closeBundle() {
        stopElectron();
        restarting = false;
        startElectron();
      },
    },
  ],
});

process.on('SIGINT', () => {
  stopElectron();
  void server.close().then(() => process.exit(0));
});
