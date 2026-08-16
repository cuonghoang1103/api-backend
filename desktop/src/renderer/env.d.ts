/// <reference types="vite/client" />

import type { DesktopBridge } from '../shared/ipc';

declare global {
  interface Window {
    /**
     * Cầu nối do preload gắn vào. Là `undefined` nếu renderer chạy ngoài
     * Electron (ví dụ mở bundle bằng trình duyệt để gỡ lỗi) — mã dùng nó phải
     * kiểm tra trước, đừng giả định lúc nào cũng có.
     */
    cuongthai?: DesktopBridge;
  }
}

export {};
