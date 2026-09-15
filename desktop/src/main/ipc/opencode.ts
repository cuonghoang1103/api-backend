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

/**
 * Chạy `npm i -g opencode-ai`, gom đầu ra.
 *
 * ⚠️ `shell: true` trên Windows là BẮT BUỘC: `npm` ở đó là `npm.cmd`, và
 * `spawn('npm')` không kèm shell sẽ ném ENOENT dù npm có thật.
 *
 * Hạn giờ 5 phút: cài một gói qua mạng chậm có thể lâu, nhưng treo vĩnh viễn
 * thì người dùng ngồi nhìn vòng quay không biết bao giờ hết.
 */
function chayCai(): Promise<{ ok: boolean; chu: string; loi?: string }> {
  return new Promise((xong) => {
    let chu = '';
    let da = false;
    const ket = (kq: { ok: boolean; chu: string; loi?: string }) => { if (!da) { da = true; xong(kq); } };

    const con = spawn('npm', ['install', '-g', 'opencode-ai'], {
      shell: process.platform === 'win32',
      windowsHide: true,
      env: { ...process.env, npm_config_yes: 'true', NO_COLOR: '1' },
    });
    /* Gom CẢ stdout lẫn stderr: npm in tiến trình ra stderr, nên chỉ đọc
       stdout là log rỗng và lúc hỏng không có gì để xem. */
    const gom = (d: Buffer) => { chu = (chu + d.toString()).slice(-8000); };
    con.stdout?.on('data', gom);
    con.stderr?.on('data', gom);

    const dongHo = setTimeout(() => {
      try { con.kill(); } catch { /* đã thoát */ }
      ket({ ok: false, chu, loi: 'Quá 5 phút chưa xong — mạng chậm hoặc npm đang chờ nhập gì đó.' });
    }, 5 * 60_000);
    dongHo.unref?.();

    con.on('error', (e) => { clearTimeout(dongHo); ket({ ok: false, chu, loi: e.message }); });
    con.on('close', (ma) => {
      clearTimeout(dongHo);
      ket(ma === 0 ? { ok: true, chu } : { ok: false, chu, loi: `npm thoát với mã ${ma}.` });
    });
  });
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
   * ============================================================
   * CÀI `opencode-ai` — CHẠY Ở ĐÂY, KHÔNG NHỜ AGENT
   * ============================================================
   *
   * Người dùng 15/09/2026: *"mấy trường dùng AI code chỉ để cài đặt opencode
   * với API key thì sao?"*.
   *
   * Bản trước nhờ agent chạy `npm i -g opencode-ai`. Nhưng agent CHỈ có quyền
   * chạy lệnh khi cuộc đó đã có thư mục dự án (`loop.ts`: mọi khả năng nằm
   * trong `if (boiCanh.goc)`). Người dùng mới chưa từng chọn thư mục nào thì
   * bấm nút cài KHÔNG cài được gì — và đó đúng là nhóm nút này sinh ra để
   * phục vụ: họ chỉ muốn lấy key rồi dùng OpenCode ở terminal.
   *
   * ⚠️ KHÔNG TỰ CÀI NODE.JS. Cài Node cần quyền quản trị hoặc một trình quản
   * lý gói mà ta không biết máy này có gì; đoán sai thì để lại một máy nửa
   * chừng. Thiếu Node thì NÓI RÕ một câu lệnh đúng hệ điều hành và để người
   * dùng làm đúng bước đó — một bước tay còn hơn một bước hỏng.
   */
  handle('opencode:cai', async () => {
    const npm = await doLenh('npm', ['--version']);
    if (!npm) {
      return {
        ok: false,
        canNode: true,
        huongDan: process.platform === 'win32'
          ? 'winget install OpenJS.NodeJS.LTS   (rồi MỞ LẠI app — biến PATH chỉ có hiệu lực ở tiến trình mới)'
          : process.platform === 'darwin'
            ? 'brew install node   (hoặc tải từ nodejs.org)'
            : 'sudo apt install nodejs npm   (hoặc dnf/pacman tuỳ bản Linux)',
      };
    }

    const log = await chayCai();
    if (!log.ok) return { ok: false, loi: log.loi, log: log.chu };

    /* Xác minh bằng cách GỌI THẬT, không tin mã thoát của npm: `npm i -g`
       thoát 0 cả khi gói vào một chỗ ngoài PATH, và lúc đó người dùng gõ
       `opencode` vẫn báo "command not found". */
    const pb = await doLenh('opencode', ['--version']);
    if (!pb) {
      return {
        ok: false,
        loi: 'Cài xong nhưng chưa gọi được lệnh `opencode` — nhiều khả năng thư mục gói toàn cục '
          + 'của npm chưa nằm trong PATH. Mở terminal và chạy `npm bin -g` để biết nó ở đâu.',
        log: log.chu,
      };
    }
    return { ok: true, phienBan: pb, log: log.chu };
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
