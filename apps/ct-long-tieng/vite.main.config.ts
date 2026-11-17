/**
 * Dựng main và preload — HAI lượt riêng (`--mode main` / `--mode preload`), mỗi lượt MỘT tệp `.cjs` không tách
 * chunk. Lý do: preload chạy trong sandbox, ở đó `require()` chỉ nạp được vài module dựng sẵn của Electron — một
 * chunk dùng chung `shared/x.cjs` mà preload `require` sẽ chết lúc chạy (cửa sổ trắng, `window.ctlt` undefined),
 * build vẫn xanh.
 */
import { defineConfig } from 'vite';
import path from 'node:path';
import { builtinModules } from 'node:module';

export default defineConfig(({ mode }) => {
  const laPreload = mode === 'preload';
  return {
    build: {
      outDir: path.resolve(__dirname, 'dist', laPreload ? 'preload' : 'main'),
      emptyOutDir: true,
      sourcemap: false,
      target: 'node20',
      minify: false,
      lib: {
        entry: path.resolve(__dirname, laPreload ? 'src/preload/index.ts' : 'src/main/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.cjs',
      },
      rollupOptions: {
        external: ['electron', ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        output: { inlineDynamicImports: true },
      },
    },
  };
});
