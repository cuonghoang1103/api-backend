/**
 * Build main + preload.
 *
 * Cả hai ra định dạng CJS với đuôi `.cjs`. Lý do: `package.json` của thư mục
 * này không đặt `"type": "module"`, nhưng để rõ ràng và tránh phụ thuộc vào
 * mặc định đó, đuôi `.cjs` nói thẳng với Node đây là CommonJS. Preload chạy
 * trong ngữ cảnh sandbox — ở đó ESM không được hỗ trợ, nên preload BẮT BUỘC
 * phải là CJS; xuất ESM sẽ lỗi lúc chạy chứ không lỗi lúc build.
 *
 * `electron` và toàn bộ built-in của Node để `external`: chúng do runtime cung
 * cấp, gói kèm vào bundle sẽ khiến Electron nạp một bản sao khác với bản đang
 * chạy.
 */
import { defineConfig } from 'vite';
import path from 'node:path';
import { builtinModules } from 'node:module';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: false,
    sourcemap: true,
    target: 'node20',
    minify: false,
    lib: {
      entry: {
        'main/index': path.resolve(__dirname, 'src/main/index.ts'),
        'preload/index': path.resolve(__dirname, 'src/preload/index.ts'),
      },
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        /**
         * `electron-updater` phải để NGOÀI bundle.
         *
         * Nó là `dependencies` thật, nên electron-builder đã chép nó vào bản
         * cài rồi. Nhồi thêm một bản vào bundle vừa thừa (~500KB) vừa rủi ro:
         * thư viện này đọc `app-update.yml` và tự dò đường theo vị trí module
         * của chính nó — một bản sao nằm sai chỗ có thể dò trượt.
         */
        'electron-updater',
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
      output: {
        entryFileNames: '[name].cjs',
        // Mã dùng chung giữa main và preload (shared/ipc.ts) bị tách thành
        // chunk. Ép đuôi .cjs cho chunk luôn, nếu không Node sẽ gặp `.js`
        // trong thư mục không có "type" và diễn giải theo mặc định — chạy
        // được ở máy này, hỏng ở máy khác tuỳ phiên bản Node.
        chunkFileNames: 'shared/[name].cjs',
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
});
