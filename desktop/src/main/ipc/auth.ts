/**
 * Lưu trữ phiên đăng nhập.
 *
 * ⚠️ Thứ được cất ở đây là ACCESS TOKEN, không phải refresh token.
 *
 * Backend có trả `refreshToken` trong `AuthResponse`, nhưng nó là token CHẾT:
 * ký bằng `jwtRefreshSecret`, mà biến đó chỉ xuất hiện hai chỗ trong toàn bộ mã
 * backend — khai báo config và dòng ký. Không endpoint nào verify nó. Cất nó
 * rồi gửi lên `/auth/refresh` sẽ nhận 401 mãi mãi.
 *
 * `POST /api/v1/auth/refresh` nhận ACCESS token qua header `Authorization:
 * Bearer`, verify bằng `jwtSecret` với `ignoreExpiration: true`, rồi trả về
 * `AuthResponse` mới. Nên access token cũ vẫn đổi được token mới.
 *
 * Hệ quả: token cất ở đây là giấy thông hành gần như vĩnh viễn — nó đổi được
 * token mới bất kể hết hạn bao lâu, chừng nào tài khoản còn `enabled`. Vì thế
 * nó bắt buộc phải được mã hoá khi nằm trên đĩa, và vì thế nó nằm ở MAIN chứ
 * không phải localStorage của renderer.
 *
 * `safeStorage` dùng Keychain (macOS), DPAPI (Windows), libsecret/kwallet
 * (Linux). Trên Linux tối giản có thể không có keyring nào — lúc đó
 * `isEncryptionAvailable()` trả false và ta TỪ CHỐI ghi, thay vì ghi token
 * dạng chữ thường rồi vờ như đã an toàn.
 */
import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import type { StoredSession } from '../../shared/ipc';
import { handle } from './index';

function sessionFilePath(): string {
  return path.join(app.getPath('userData'), 'session.bin');
}

/** Đường dẫn kèm userId để đọc lại còn biết token thuộc về ai. */
interface SessionEnvelope {
  userId: number;
  sessionToken: string;
}

export function registerAuthHandlers(): void {
  handle('auth:storeSession', (session) => {
    if (!safeStorage.isEncryptionAvailable()) {
      // Không có keyring. Ghi chữ thường sẽ tệ hơn là không ghi: người dùng
      // tưởng mình được "ghi nhớ đăng nhập" trong khi token nằm trần trên đĩa.
      throw new Error(
        'Hệ thống không có kho khoá an toàn (Keychain/DPAPI/libsecret). ' +
          'Phiên đăng nhập sẽ không được ghi nhớ sau khi đóng app.',
      );
    }

    const envelope: SessionEnvelope = {
      userId: session.userId,
      sessionToken: session.sessionToken,
    };
    const encrypted = safeStorage.encryptString(JSON.stringify(envelope));

    const target = sessionFilePath();
    const temp = `${target}.tmp`;
    fs.writeFileSync(temp, encrypted);
    // `mode 0600` — chỉ chủ sở hữu đọc được. Trên Windows tham số này bị bỏ
    // qua, ở đó DPAPI đã buộc theo tài khoản người dùng nên vẫn kín.
    fs.chmodSync(temp, 0o600);
    fs.renameSync(temp, target);
  });

  handle('auth:loadSession', (): StoredSession | null => {
    if (!safeStorage.isEncryptionAvailable()) return null;

    let encrypted: Buffer;
    try {
      encrypted = fs.readFileSync(sessionFilePath());
    } catch {
      return null; // Chưa từng đăng nhập.
    }

    try {
      const decrypted = safeStorage.decryptString(encrypted);
      const parsed = JSON.parse(decrypted) as Partial<SessionEnvelope>;
      if (typeof parsed.userId !== 'number' || typeof parsed.sessionToken !== 'string') {
        return null;
      }
      return { userId: parsed.userId, sessionToken: parsed.sessionToken };
    } catch {
      // Giải mã hỏng — thường là do người dùng đổi tài khoản HĐH, hoặc keyring
      // bị tạo lại. Không cứu được; xoá để lần sau đăng nhập sạch, và KHÔNG
      // làm app chết vì chuyện này.
      try {
        fs.unlinkSync(sessionFilePath());
      } catch {
        /* file có thể đã biến mất — không sao */
      }
      return null;
    }
  });

  handle('auth:clearSession', () => {
    try {
      fs.unlinkSync(sessionFilePath());
    } catch {
      /* chưa từng có phiên nào — đăng xuất vẫn coi như thành công */
    }
  });
}
