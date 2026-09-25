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
import { createWriteStream, existsSync } from 'node:fs';
import { appendFile, chmod, copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { app, net, type WebContents } from 'electron';
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

/* ============================================================
 * CÀI BẢN CHẠY SẴN — KHÔNG CẦN NODE.JS (25/09/2026)
 * ============================================================
 *
 * Người dùng: *"những máy mới mua về chưa cài gì, ấn Cài OpenCode Terminal nó
 * lại báo lỗi đỏ bắt cài thủ công rất phiền"*.
 *
 * Bản trước chỉ biết `npm i -g opencode-ai`, nên máy chưa có Node là đứng.
 * Nhưng gói npm đó thực ra chỉ là cái vỏ tải về một FILE CHẠY SẴN (OpenCode
 * dựng bằng Bun, tự chứa runtime). Script cài chính thức
 * (`curl https://opencode.ai/install | bash`) cũng làm đúng thế: tải
 * `opencode-<hệ>-<kiến trúc>.zip` từ GitHub Releases, giải nén vào
 * `~/.opencode/bin`, rồi thêm thư mục đó vào PATH. Ta làm y hệt, bằng Node của
 * chính Electron — nên không cần Node, npm, quyền quản trị hay Homebrew.
 *
 * Đo thật 25/09/2026: `opencode-darwin-arm64.zip` chứa đúng một file
 * `opencode`, chạy `--version` ra `1.18.32` trên máy không đụng tới Node.
 * Bản Windows chứa `opencode.exe` ở gốc zip.
 *
 * ⚠️ PATH của app GUI KHÔNG phải PATH của terminal. Trên macOS app mở từ
 * Finder chỉ có `/usr/bin:/bin:/usr/sbin:/sbin` — `doLenh('npm')` báo "chưa
 * có" kể cả khi Node cài bằng Homebrew. Nên mọi phép xác minh ở đây gọi file
 * bằng ĐƯỜNG DẪN TUYỆT ĐỐI, không nhờ PATH.
 */
const KHO_PHAT_HANH = 'https://github.com/anomalyco/opencode/releases/latest/download';

function thuMucCai(): string {
  return join(homedir(), '.opencode', 'bin');
}

function fileChay(): string {
  return join(thuMucCai(), process.platform === 'win32' ? 'opencode.exe' : 'opencode');
}

/** Tên gói đúng máy này, theo đúng luật của script cài chính thức. */
async function tenGoi(): Promise<string | null> {
  const he = process.platform === 'darwin' ? 'darwin'
    : process.platform === 'win32' ? 'windows'
      : process.platform === 'linux' ? 'linux' : null;
  if (!he) return null;
  /* App x64 chạy qua Rosetta trên máy Apple Silicon vẫn báo `x64` — lấy bản
     arm64 cho máy, không phải cho app. */
  const kt = process.arch === 'arm64' || app.runningUnderARM64Translation ? 'arm64'
    : process.arch === 'x64' ? 'x64' : null;
  if (!kt) return null;
  let goi = `${he}-${kt}`;
  /* `-baseline` cho mọi máy x64: bản thường cần AVX2, máy cũ không có thì
     file chạy chết ngay với "illegal instruction" — một lỗi người dùng không
     thể tự hiểu. Bản baseline chạy được mọi nơi, chậm hơn không đáng kể với
     một công cụ dòng lệnh. */
  if (kt === 'x64') goi += '-baseline';
  if (he === 'linux' && (existsSync('/etc/alpine-release')
    || /musl/i.test((await doLenh('ldd', ['--version'], true)) ?? ''))) goi += '-musl';
  return `opencode-${goi}${he === 'linux' ? '.tar.gz' : '.zip'}`;
}

type BaoTienDo = (t: { buoc: string; phanTram?: number }) => void;

/** Tải về file, báo phần trăm. `net.fetch` đi theo proxy hệ thống và tự theo chuyển hướng. */
async function taiVe(url: string, dich: string, bao: BaoTienDo): Promise<void> {
  const r = await net.fetch(url);
  if (!r.ok || !r.body) throw new Error(`Tải thất bại: HTTP ${r.status}`);
  const tong = Number(r.headers.get('content-length')) || 0;
  const ghi = createWriteStream(dich);
  const doc = r.body.getReader();
  let da = 0;
  let lanCuoi = -1;
  try {
    for (;;) {
      const { done, value } = await doc.read();
      if (done) break;
      da += value.byteLength;
      if (!ghi.write(value)) await new Promise<void>((x) => { ghi.once('drain', () => x()); });
      const pt = tong ? Math.floor((da / tong) * 100) : undefined;
      if (pt !== undefined && pt !== lanCuoi) { lanCuoi = pt; bao({ buoc: 'tai', phanTram: pt }); }
    }
  } finally {
    await new Promise<void>((x, loi) => ghi.end((e?: Error | null) => (e ? loi(e) : x())));
  }
  if (tong && da !== tong) throw new Error('Tải bị ngắt giữa chừng — thử lại khi mạng ổn định hơn.');
}

/** Chạy một lệnh, chỉ quan tâm thành/bại. */
function chay(lenh: string, thamSo: string[], env?: NodeJS.ProcessEnv): Promise<{ ok: boolean; ra: string }> {
  return new Promise((xong) => {
    let ra = '';
    try {
      const p = spawn(lenh, thamSo, { windowsHide: true, env: env ?? process.env });
      p.stdout?.on('data', (d) => { ra += String(d); });
      p.stderr?.on('data', (d) => { ra += String(d); });
      p.on('error', (e) => xong({ ok: false, ra: e.message }));
      p.on('close', (ma) => xong({ ok: ma === 0, ra: ra.slice(-2000) }));
    } catch (e) { xong({ ok: false, ra: (e as Error).message }); }
  });
}

/**
 * Giải nén bằng công cụ CÓ SẴN của hệ điều hành — không thêm thư viện nào:
 * macOS `ditto` (luôn có), Windows 10+ `tar.exe` (bsdtar, đọc được zip; có
 * từ bản 1803), máy Windows cũ hơn thì lùi về `Expand-Archive`, Linux `tar`.
 */
async function giaiNen(goi: string, vao: string): Promise<void> {
  let kq: { ok: boolean; ra: string };
  if (process.platform === 'darwin') {
    kq = await chay('/usr/bin/ditto', ['-xk', goi, vao]);
  } else if (process.platform === 'win32') {
    const tar = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe');
    kq = existsSync(tar) ? await chay(tar, ['-xf', goi, '-C', vao]) : { ok: false, ra: '' };
    if (!kq.ok) {
      kq = await chay('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-Command',
        'Expand-Archive -LiteralPath $env:CT_GOI -DestinationPath $env:CT_VAO -Force',
      ], { ...process.env, CT_GOI: goi, CT_VAO: vao });
    }
  } else {
    kq = await chay('tar', ['-xzf', goi, '-C', vao]);
  }
  if (!kq.ok) throw new Error(`Không giải nén được: ${kq.ra.trim() || 'lỗi không rõ'}`);
}

/**
 * Thêm `~/.opencode/bin` vào PATH để gõ `opencode` ở terminal MỚI là chạy.
 *
 * macOS/Linux: nối một dòng `export PATH=…` vào file khởi động của shell —
 * đúng việc script chính thức làm. Chỉ ghi file ĐÃ CÓ, trừ `.zshrc` trên
 * macOS (zsh là shell mặc định; máy mới có thể chưa có file này). Đã có
 * `.opencode/bin` trong file thì thôi, bấm cài lại mười lần cũng chỉ một dòng.
 *
 * Windows: ghi PATH của NGƯỜI DÙNG (không phải của máy ⇒ không cần quyền quản
 * trị) qua .NET. `SetEnvironmentVariable` tự phát `WM_SETTINGCHANGE`, nên
 * terminal mở sau đó thấy ngay. KHÔNG dùng `setx`: nó cắt PATH ở 1024 ký tự
 * và âm thầm xoá phần đuôi — hỏng cả những công cụ khác của người dùng.
 */
async function themVaoPath(): Promise<string[]> {
  const bin = thuMucCai();
  if (process.platform === 'win32') {
    const kq = await chay('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-Command',
      "$p=[Environment]::GetEnvironmentVariable('Path','User'); if(-not $p){$p=''}; "
        + "if(($p -split ';') -notcontains $env:CT_BIN){ "
        + "[Environment]::SetEnvironmentVariable('Path', ($(if($p){$p.TrimEnd(';')+';'}else{''}) + $env:CT_BIN), 'User') }",
    ], { ...process.env, CT_BIN: bin });
    if (!kq.ok) throw new Error(`Không thêm được vào PATH: ${kq.ra.trim()}`);
    return ['PATH người dùng (Windows)'];
  }

  const nha = homedir();
  const ungVien = [
    join(nha, '.zshrc'), join(nha, '.bashrc'), join(nha, '.bash_profile'), join(nha, '.profile'),
  ];
  const daGhi: string[] = [];
  for (const f of ungVien) {
    const coSan = existsSync(f);
    if (!coSan && !(process.platform === 'darwin' && f.endsWith('.zshrc'))) continue;
    const cu = coSan ? await readFile(f, 'utf8').catch(() => '') : '';
    if (cu.includes('.opencode/bin')) { daGhi.push(f); continue; }
    await appendFile(f, `${cu && !cu.endsWith('\n') ? '\n' : ''}\n# opencode (cài bởi CuongThai)\nexport PATH="$HOME/.opencode/bin:$PATH"\n`);
    daGhi.push(f);
  }
  /* Linux không có file nào (hiếm) ⇒ tạo `.profile`, thứ mọi shell đăng nhập đều đọc. */
  if (daGhi.length === 0) {
    const f = join(nha, '.profile');
    await appendFile(f, '\n# opencode (cài bởi CuongThai)\nexport PATH="$HOME/.opencode/bin:$PATH"\n');
    daGhi.push(f);
  }
  const fish = join(nha, '.config', 'fish', 'config.fish');
  if (existsSync(fish)) {
    const cu = await readFile(fish, 'utf8').catch(() => '');
    if (!cu.includes('.opencode/bin')) await appendFile(fish, '\n# opencode (cài bởi CuongThai)\nfish_add_path $HOME/.opencode/bin\n');
    daGhi.push(fish);
  }
  return daGhi;
}

async function caiBanChaySan(bao: BaoTienDo): Promise<{ phienBan: string; path: string[] }> {
  const ten = await tenGoi();
  if (!ten) throw new Error(`OpenCode chưa có bản cho ${process.platform}/${process.arch}.`);
  const bin = thuMucCai();
  await mkdir(bin, { recursive: true });
  /* Thư mục tạm NẰM CẠNH thư mục cài (cùng ổ đĩa) để `rename` cuối cùng là
     một phép đổi tên nguyên tử, không phải chép chéo ổ. */
  const tam = await mkdtemp(join(dirname(bin), 'tai-'));
  try {
    bao({ buoc: 'tai', phanTram: 0 });
    const goi = join(tam, ten);
    await taiVe(`${KHO_PHAT_HANH}/${ten}`, goi, bao);

    bao({ buoc: 'giai-nen' });
    await giaiNen(goi, tam);
    const moi = join(tam, process.platform === 'win32' ? 'opencode.exe' : 'opencode');
    if (!existsSync(moi)) throw new Error('Gói tải về không có file opencode bên trong.');
    if (process.platform !== 'win32') await chmod(moi, 0o755);

    const dich = fileChay();
    try {
      await rm(dich, { force: true });
      await rename(moi, dich);
    } catch {
      /* Windows khoá file .exe đang chạy — thường là người dùng đang mở
         OpenCode ở một terminal khác. Nói đúng tên chuyện đó. */
      if (process.platform === 'win32') {
        throw new Error('Không thay được opencode.exe — hãy đóng mọi cửa sổ OpenCode đang mở rồi bấm lại.');
      }
      await copyFile(moi, dich);
      await chmod(dich, 0o755);
    }
    /* Ta tự tải bằng `net.fetch` nên macOS không gắn cờ quarantine; gỡ phòng
       xa, vì có cờ đó thì Gatekeeper chặn file chạy trong im lặng. */
    if (process.platform === 'darwin') await chay('/usr/bin/xattr', ['-d', 'com.apple.quarantine', dich]);

    bao({ buoc: 'kiem' });
    const pb = await doLenh(dich, ['--version'], true);
    if (!pb) throw new Error('Đã tải về nhưng file opencode không chạy được trên máy này.');

    bao({ buoc: 'path' });
    const path = await themVaoPath();
    return { phienBan: pb, path };
  } finally {
    await rm(tam, { recursive: true, force: true }).catch(() => {});
  }
}

/** Chạy một lệnh chỉ để XEM CÓ hay không. Không có ⇒ null, không ném. */
function doLenh(lenh: string, thamSo: string[], khongShell = false): Promise<string | null> {
  return new Promise((xong) => {
    let ra = '';
    let da = false;
    const ket = (gt: string | null) => { if (!da) { da = true; xong(gt); } };
    try {
      // `shell: true` trên Windows vì `npm`/`node` là file .cmd — spawn trần
      // không tìm ra chúng và ném ENOENT, trông y như "chưa cài".
      /* Đường dẫn tuyệt đối thì KHÔNG qua shell: `C:\\Users\\Tên Có Dấu Cách\\…`
         qua cmd.exe sẽ bị tách đôi ở dấu cách. */
      const p = spawn(lenh, thamSo, { shell: !khongShell && process.platform === 'win32', windowsHide: true });
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
    const [node, npm, trongPath, banRieng] = await Promise.all([
      doLenh('node', ['--version']),
      doLenh('npm', ['--version']),
      doLenh('opencode', ['--version']),
      existsSync(fileChay()) ? doLenh(fileChay(), ['--version'], true) : Promise.resolve(null),
    ]);
    const opencode = banRieng ?? trongPath;
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
   * ⚠️ 25/09/2026: KHÔNG CÒN CẦN NODE.JS. Bản trước thiếu Node thì dừng và bắt
   * người dùng tự cài bằng tay — máy mới mua về là vấp ngay. Nay đường chính là
   * tải bản chạy sẵn (xem `caiBanChaySan`); npm chỉ còn là đường lùi.
   */
  handle('opencode:cai', async (_input, event) => {
    const gui: WebContents = event.sender;
    const bao: BaoTienDo = (t) => { if (!gui.isDestroyed()) gui.send('opencode:tienDo', t); };

    /* ĐƯỜNG CHÍNH: bản chạy sẵn — không cần Node, không cần quyền quản trị.
       Chạy được trên máy mới tinh, đúng nhóm người dùng báo lỗi 25/09/2026. */
    let loiBanRieng = '';
    try {
      const kq = await caiBanChaySan(bao);
      return { ok: true, phienBan: kq.phienBan, duongDan: fileChay(), path: kq.path };
    } catch (e) {
      loiBanRieng = (e as Error).message;
    }

    /* ĐƯỜNG LÙI: npm, chỉ khi máy đã có sẵn. Tải GitHub hỏng (mạng trường chặn
       github.com chẳng hạn) mà npm registry vẫn vào được thì còn cứu được. */
    const npm = await doLenh('npm', ['--version']);
    if (!npm) return { ok: false, loi: loiBanRieng };

    bao({ buoc: 'npm' });
    const log = await chayCai();
    if (!log.ok) return { ok: false, loi: `${loiBanRieng}\nThử qua npm cũng hỏng: ${log.loi ?? ''}`, log: log.chu };

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
