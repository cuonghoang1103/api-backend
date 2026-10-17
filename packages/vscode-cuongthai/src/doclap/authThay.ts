/**
 * Thay `desktop/src/main/ipc/auth.ts` trong chế độ độc lập.
 *
 * App cất token trong file mã hoá bằng `safeStorage` (Keychain/DPAPI). Extension
 * cất trong `SecretStorage` của VS Code (cũng Keychain/DPAPI/libsecret) và bơm
 * vào đây lúc khởi động/đăng nhập — lõi AI Code chỉ cần `readStoredSession()`.
 */
export interface PhienDangNhap { userId: number; sessionToken: string }

let phien: PhienDangNhap | null = null;

export function datPhien(p: PhienDangNhap | null): void { phien = p; }

export function readStoredSession(): PhienDangNhap | null { return phien; }

export function registerAuthHandlers(): void { /* đăng nhập do extension lo */ }
