/**
 * Kho cấu hình + trạng thái cửa sổ, ghi ra JSON trong `userData`.
 *
 * Cố ý KHÔNG dùng thư viện ngoài (electron-store): nhu cầu ở đây là đọc/ghi
 * một object phẳng, còn thêm một phụ thuộc là thêm một thứ phải vá khi có CVE.
 *
 * Kho này KHÔNG dành cho bí mật. Refresh token đi đường khác — `safeStorage`,
 * xem ipc/auth.ts. File này là văn bản thường, ai đọc được đĩa thì đọc được nó.
 */
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import type { SettingKey, SettingValue } from '../shared/ipc';

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  maximized: boolean;
}

interface StoreShape {
  settings: Partial<Record<SettingKey, SettingValue>>;
  windowState: WindowState;
}

const DEFAULT_STATE: StoreShape = {
  settings: {},
  windowState: { width: 1280, height: 820, maximized: false },
};

function storePath(): string {
  return path.join(app.getPath('userData'), 'cuongthai-desktop.json');
}

let cache: StoreShape | null = null;

function load(): StoreShape {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(storePath(), 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    cache = {
      settings: parsed.settings ?? {},
      windowState: { ...DEFAULT_STATE.windowState, ...parsed.windowState },
    };
  } catch {
    // Chưa có file (lần chạy đầu) hoặc JSON hỏng. Cả hai đều không phải lý do
    // để app chết — quay về mặc định và chạy tiếp. Ghi đè sẽ xảy ra ở lần
    // `persist()` kế tiếp, nên một file hỏng tự lành.
    cache = structuredClone(DEFAULT_STATE);
  }
  return cache;
}

function persist(): void {
  if (!cache) return;
  try {
    // Ghi qua file tạm rồi đổi tên: nếu app bị tắt giữa chừng, file cũ vẫn
    // nguyên vẹn thay vì thành một mẩu JSON cụt không parse được.
    const target = storePath();
    const temp = `${target}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(cache, null, 2), 'utf-8');
    fs.renameSync(temp, target);
  } catch (error) {
    console.error('[store] không ghi được cấu hình:', error);
  }
}

export function getSettings(): Partial<Record<SettingKey, SettingValue>> {
  return { ...load().settings };
}

export function setSetting(key: SettingKey, value: SettingValue): void {
  load().settings[key] = value;
  persist();
}

export function getWindowState(): WindowState {
  return { ...load().windowState };
}

export function setWindowState(state: WindowState): void {
  load().windowState = state;
  persist();
}
