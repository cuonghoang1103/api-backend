/**
 * ============================================================
 * CÀI OPENCODE CHO NGƯỜI DÙNG — phần KHÔNG được để AI đụng vào
 * ============================================================
 *
 * Người dùng: *"tạo 1 nút Install Opencode Terminal trong AI Code, bấm vào là
 * AI tự cài đặt, tự lấy key được cấp để setup cho user"*.
 *
 * ⚠️⚠️ VÌ SAO KEY KHÔNG ĐI QUA AGENT.
 * Cách hiển nhiên là nhét key vào prompt rồi để agent tự ghi file. Nhưng prompt
 * được gửi lên CỔNG LLM — tức key của khách hàng đi qua rambo và Anthropic
 * dưới dạng văn bản thuần, nằm lại trong log của bên thứ ba, và không có cách
 * nào lấy lại. Đó là làm lộ đúng thứ mình vừa bán cho họ.
 *
 * Nên tách đôi:
 *   · TIẾN TRÌNH CHÍNH (tệp này) ghi key vào file cấu hình — key không rời máy;
 *   · AGENT lo phần còn lại (cài Node/opencode, xác minh) — không bao giờ thấy key.
 * Người dùng vẫn chỉ bấm một nút.
 *
 * ⚠️ `apiKey` ghi THẲNG vào JSON, không dùng `{env:...}`. Biến môi trường bền
 * trên cả ba hệ là ba cách khác nhau (`.zshrc` / `.bashrc` /
 * `[Environment]::SetEnvironmentVariable`), đều cần mở lại terminal mới có
 * hiệu lực, và đó chính là bẫy làm người dùng tưởng key hỏng. File thì đọc
 * được ngay, và đặt quyền 0600 nên chỉ chủ máy đọc được.
 */
import { spawn } from 'node:child_process';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { handle } from './index';

/**
 * Đường dẫn cấu hình TOÀN CỤC của OpenCode.
 *
 * Giống nhau trên cả ba hệ: `~/.config/opencode/opencode.json`. Trên Windows
 * `~` là `%USERPROFILE%`, nên `homedir()` cho đúng chỗ mà không phải rẽ nhánh.
 */
function duongDanCauHinh(): string {
  return join(homedir(), '.config', 'opencode', 'opencode.json');
}

/** Chạy một lệnh chỉ để XEM CÓ hay không. Không có ⇒ null, không ném. */
function doLenh(lenh: string, thamSo: string[]): Promise<string | null> {
  return new Promise((xong) => {
    let ra = '';
    let da = false;
    const ket = (gt: string | null) => { if (!da) { da = true; xong(gt); } };
    try {
      // `shell: true` trên Windows vì `npm`/`node` là file .cmd — spawn trần
      // không tìm ra chúng và ném ENOENT, trông y như "chưa cài".
      const p = spawn(lenh, thamSo, { shell: process.platform === 'win32' });
      p.stdout?.on('data', (d) => { ra += String(d); });
      p.on('error', () => ket(null));
      p.on('close', (ma) => ket(ma === 0 ? ra.trim() : null));
      setTimeout(() => { try { p.kill(); } catch { /* đã chết */ } ket(null); }, 8_000);
    } catch { ket(null); }
  });
}

export function registerOpenCodeHandlers(): void {
  /**
   * Máy này đang có gì. Dùng để nút biết nên nói gì, và để prompt gửi cho
   * agent CHỈ chứa việc còn thiếu — bảo agent cài lại thứ đã có là tốn lượt
   * và làm người dùng chờ vô ích.
   */
  handle('opencode:doMayNay', async () => {
    const [node, npm, opencode] = await Promise.all([
      doLenh('node', ['--version']),
      doLenh('npm', ['--version']),
      doLenh('opencode', ['--version']),
    ]);
    let daCoCauHinh = false;
    try {
      await readFile(duongDanCauHinh(), 'utf8');
      daCoCauHinh = true;
    } catch { /* chưa có */ }
    return {
      heDieuHanh: process.platform,
      node,
      npm,
      opencode,
      daCoCauHinh,
      duongDanCauHinh: duongDanCauHinh(),
    };
  });

  /**
   * Ghi `opencode.json`. Trả về đường dẫn để nút hiện cho người dùng biết
   * file nằm ở đâu — sửa tay được, và biết chỗ mà xoá khi muốn gỡ.
   */
  handle('opencode:vietCauHinh', async ({ key, baseUrl, models, contextToken, outputToken }) => {
    const duong = duongDanCauHinh();
    const cauHinh = {
      $schema: 'https://opencode.ai/config.json',
      provider: {
        cuongmini: {
          npm: '@ai-sdk/anthropic',
          name: 'CuongMini',
          options: { baseURL: baseUrl, apiKey: key },
          models: Object.fromEntries(
            models.map((m) => [m, { limit: { context: contextToken, output: outputToken } }]),
          ),
        },
      },
      model: `cuongmini/${models[0]}`,
    };

    await mkdir(dirname(duong), { recursive: true });
    await writeFile(duong, `${JSON.stringify(cauHinh, null, 2)}\n`, 'utf8');
    // 0600: file này chứa key thật. Mặc định của Windows không có khái niệm
    // này nên `chmod` ở đó là no-op — chấp nhận được, thư mục người dùng trên
    // Windows vốn đã riêng tư.
    try { await chmod(duong, 0o600); } catch { /* Windows */ }

    return { ok: true as const, duongDan: duong, soModel: models.length };
  });
}
