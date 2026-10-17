/**
 * Ghi âm cho nút 🎤 trong khung chat — chạy ở TIẾN TRÌNH EXTENSION (Node), không phải webview.
 *
 * Vì sao không ghi ngay trong webview: VS Code không cấp micro cho webview (getUserMedia bị từ
 * chối, không có hộp hỏi quyền nào). Nên extension host mượn công cụ ghi âm sẵn có của hệ điều
 * hành, rồi đẩy file lên `/api/v1/ai/stt` của máy chủ để nghe ra chữ.
 *
 * Cố ý KHÔNG import `vscode` — để thử được bằng Node thuần (`npx tsx --test …/ghiAm.test.ts`).
 *
 * Mọi đường ghi đều ra WAV PCM 16 kHz một kênh (kể cả JXA trên macOS — xem chú thích ở
 * `scriptJxa`): máy chủ ước lượng độ dài đoạn tiếng bằng `số byte / 16000` để chặn "bịa chữ"
 * (quá nhiều âm tiết trong một giây). WAV 16 kHz là 32 kB/giây ⇒ ước lượng DƯ, phép chặn chỉ
 * dễ hơn; còn AAC nén ~4–8 kB/giây ⇒ ước lượng HỤT 2–4 lần ⇒ câu nói thật bị coi là bịa.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

export interface FileGhiAm {
  duong: string;
  mime: string;
  ten: string;
}

export interface PhienGhiAm {
  /** Dừng và trả file đã ghi. */
  dung(): Promise<FileGhiAm>;
  /** Dừng, xoá file, không trả gì. */
  huy(): void;
}

export type CachGhi = 'ffmpeg' | 'sox' | 'jxa' | 'powershell' | 'arecord' | 'parecord';

/** Một cách ghi đã dựng xong — thuần dữ liệu, chưa chạy gì. */
export interface LenhGhi {
  cach: CachGhi;
  /** Tên lệnh hoặc đường dẫn tuyệt đối. */
  lenh: string;
  doiSo: string[];
  /** Script phải ghi ra đĩa trước khi chạy (JXA). */
  fileScript?: { duong: string; noiDung: string };
  /** Script đưa vào stdin (PowerShell `-Command -`). */
  stdin?: string;
  /** Biến môi trường thêm cho tiến trình con. */
  env?: Record<string, string>;
  /** Cách bảo tiến trình dừng GỌN (để file WAV được đóng header đúng). */
  cachDung: 'q' | 'sigint' | 'fileCo';
  fileCo?: string;
  file: FileGhiAm;
}

/** Lỗi không nên thử cách ghi khác — đổi công cụ cũng vấp đúng chỗ đó (quyền micro). */
export class LoiQuyenMicro extends Error {}

const TIEN_TO_THU_MUC = 'cuongmini-ghi-';
const CO_TOI_THIEU_BYTE = 1024;
/** Tiến trình chết trong khoảng này sau khi bật ⇒ coi như cách ghi này hỏng, thử cách kế. */
const CUA_SO_CHET_SOM_MS = 700;

// ─────────────────────────────────────────────────────────────────────────────
// Phần thuần: dò lệnh, dựng lệnh, dựng script
// ─────────────────────────────────────────────────────────────────────────────

/** Những lệnh cần dò theo nền tảng. */
export function lenhCanDo(nenTang: string): string[] {
  if (nenTang === 'darwin') return ['ffmpeg', 'rec'];
  if (nenTang === 'win32') return ['powershell', 'pwsh'];
  return ['arecord', 'parecord', 'ffmpeg', 'pactl'];
}

/**
 * Tìm lệnh trong PATH bằng cách tự quét thư mục — không spawn `which` (nhanh, và `spawn` không
 * ném khi lệnh không tồn tại mà phát 'error' muộn, dễ bắt hụt). Trả tên → đường dẫn tuyệt đối.
 *
 * macOS thêm /opt/homebrew/bin, /usr/local/bin: VS Code mở từ Dock đôi khi mang PATH tối giản,
 * mà ffmpeg/sox gần như luôn cài bằng Homebrew.
 */
export function timLenhCoSan(
  nenTang: string = process.platform,
  env: NodeJS.ProcessEnv = process.env,
  tenCanTim: string[] = lenhCanDo(nenTang),
): Map<string, string> {
  const tachPath = nenTang === 'win32' ? ';' : ':';
  const thuMuc = String(env.PATH ?? env.Path ?? '').split(tachPath).filter(Boolean);
  if (nenTang === 'darwin') thuMuc.push('/opt/homebrew/bin', '/usr/local/bin');
  if (nenTang === 'win32' && env.SystemRoot) {
    thuMuc.push(path.join(env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0'));
  }
  const duoi = nenTang === 'win32'
    ? String(env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean)
    : [''];
  const ketQua = new Map<string, string>();
  for (const ten of tenCanTim) {
    for (const dir of thuMuc) {
      const thay = duoi
        // path.join của MÁY ĐANG CHẠY (trên Windows nó chính là path.win32).
        .map((d) => path.join(dir, nenTang === 'win32' ? ten + d.toLowerCase() : ten))
        .find((p) => laFileChayDuoc(p, nenTang));
      if (thay) { ketQua.set(ten, thay); break; }
    }
  }
  return ketQua;
}

function laFileChayDuoc(p: string, nenTang: string): boolean {
  try {
    const st = fs.statSync(p);
    if (!st.isFile()) return false;
    if (nenTang !== 'win32') fs.accessSync(p, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/** Chuỗi JS hợp lệ, CHỈ ký tự ASCII — đường dẫn tiếng Việt/dấu cách không phụ thuộc bảng mã. */
export function chuoiJs(s: string): string {
  return JSON.stringify(s).replace(/[\u007f-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

/**
 * Script JXA ghi WAV bằng AVAudioRecorder.
 *
 * - Dừng bằng FILE CỜ: osascript không có kênh nào để ta gửi lệnh vào, còn giết tiến trình thì
 *   `recorder.stop` không chạy ⇒ header WAV hỏng. Script tự lặp 0,1 s, thấy cờ thì dừng gọn.
 * - Mã thoát: 3 = macOS chặn micro, 4 = chỉ thu được im lặng tuyệt đối (thường cũng do bị chặn:
 *   macOS cho ghi nhưng đưa toàn số 0), 5 = lỗi khác.
 * - LinearPCM thay vì AAC: xem chú thích đầu file (ước lượng độ dài phía máy chủ).
 * - `chiThu` = true: bỏ qua hoàn toàn phần micro, chỉ chạy vòng chờ cờ — để test chạy thật
 *   osascript mà không bật hộp hỏi quyền micro lên màn hình người dùng.
 */
export function scriptJxa(duong: string, fileCo: string, tranGiay: number, chiThu = false): string {
  return `ObjC.import('Foundation');
ObjC.import('AVFoundation');
ObjC.import('stdlib');
var DUONG = ${chuoiJs(duong)};
var FILE_CO = ${chuoiJs(fileCo)};
var TRAN_GIAY = ${Number(tranGiay) || 120};
var CHI_THU = ${chiThu ? 'true' : 'false'};

function thoat(ma, loi) {
  if (loi) console.log(loi);
  $.exit(ma);
}

var fm = $.NSFileManager.defaultManager;
var rec = null;
var dinhMax = -1000;

if (!CHI_THU) {
  // 2 = denied, 1 = restricted. Reading the status never shows the permission prompt.
  var trangThai = $.AVCaptureDevice.authorizationStatusForMediaType('soun');
  if (trangThai === 1 || trangThai === 2) thoat(3, 'MIC_DENIED');

  var caiDat = $.NSMutableDictionary.dictionary;
  caiDat.setObjectForKey($.NSNumber.numberWithUnsignedInt(1819304813), 'AVFormatIDKey'); // 'lpcm'
  caiDat.setObjectForKey($.NSNumber.numberWithDouble(16000), 'AVSampleRateKey');
  caiDat.setObjectForKey($.NSNumber.numberWithInt(1), 'AVNumberOfChannelsKey');
  caiDat.setObjectForKey($.NSNumber.numberWithInt(16), 'AVLinearPCMBitDepthKey');
  caiDat.setObjectForKey($.NSNumber.numberWithBool(false), 'AVLinearPCMIsFloatKey');
  caiDat.setObjectForKey($.NSNumber.numberWithBool(false), 'AVLinearPCMIsBigEndianKey');

  var url = $.NSURL.fileURLWithPath(DUONG);
  var loi = Ref();
  rec = $.AVAudioRecorder.alloc.initWithURLSettingsError(url, caiDat, loi);
  if (!rec || rec.isNil()) {
    var moTa = (loi[0] && !loi[0].isNil()) ? ObjC.unwrap(loi[0].localizedDescription) : 'khong ro';
    thoat(5, 'Khong tao duoc AVAudioRecorder: ' + moTa);
  }
  rec.setMeteringEnabled(true);
  rec.prepareToRecord;
  if (!rec.record) thoat(3, 'MIC_DENIED');
}

var batDau = Date.now();
while (!fm.fileExistsAtPath(FILE_CO) && (Date.now() - batDau) < TRAN_GIAY * 1000) {
  // Pump the run loop instead of delay(): AVAudioRecorder may need it to deliver buffers.
  $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(0.1));
  if (rec) {
    rec.updateMeters;
    var dinh = rec.peakPowerForChannel(0);
    if (typeof dinh === 'number' && dinh > dinhMax) dinhMax = dinh;
  }
}

if (rec) {
  rec.stop;
  // -160 dB = digital zero; a real mic in a quiet room still shows a -60..-90 dB noise floor.
  if (dinhMax > -1000 && dinhMax <= -120) thoat(4, 'SILENCE');
}
thoat(0);
`;
}

/** Ký tự đơn trích trong PowerShell: `'` nhân đôi. */
export function chuoiPs(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

/**
 * Script PowerShell ghi WAV qua winmm `mciSendString` (có sẵn trên mọi Windows, không cần cài gì).
 *
 * Đường file KHÔNG nằm trong script mà đi qua biến môi trường: `-Command -` đọc stdin theo bảng
 * mã OEM của console ⇒ tên thư mục người dùng có dấu tiếng Việt sẽ bị đọc sai. Biến môi trường
 * thì Windows truyền bằng UTF-16 nguyên vẹn. Script vì thế thuần ASCII.
 *
 * Mỗi câu lệnh nằm trọn MỘT dòng: ở chế độ `-Command -` PowerShell đọc từng dòng như gõ tay,
 * khối nhiều dòng phải có dòng trống mới chạy — dễ treo im lặng.
 */
export function scriptPowerShell(): string {
  const csharp = [
    'using System; using System.Text; using System.Runtime.InteropServices;',
    'public static class CuongMiniMci {',
    '[DllImport("winmm.dll", CharSet = CharSet.Unicode)] public static extern int mciSendString(string cmd, StringBuilder ret, int len, IntPtr cb);',
    '[DllImport("winmm.dll", CharSet = CharSet.Unicode)] public static extern bool mciGetErrorString(int err, StringBuilder buf, int len);',
    '}',
  ].join(' ');
  return [
    "$ErrorActionPreference = 'Stop'",
    '$duong = $env:CUONGMINI_GHI_DUONG',
    '$fileCo = $env:CUONGMINI_GHI_CO',
    '$tran = [int]$env:CUONGMINI_GHI_TRAN',
    "trap { [Console]::Error.WriteLine('LOI: ' + $_.Exception.Message); try { [void][CuongMiniMci]::mciSendString('close cmrec', $null, 0, [IntPtr]::Zero) } catch {}; exit 3 }",
    `Add-Type -TypeDefinition ${chuoiPs(csharp)}`,
    "function Mci([string]$c) { $r = [CuongMiniMci]::mciSendString($c, $null, 0, [IntPtr]::Zero); if ($r -ne 0) { $b = New-Object System.Text.StringBuilder 256; [void][CuongMiniMci]::mciGetErrorString($r, $b, 256); throw ('MCI \"' + $c.Split(' ')[0] + '\" loi ' + $r + ': ' + $b.ToString()) } }",
    // Alias riêng (cmrec) để không đụng phiên MCI khác cùng tên "rec".
    "Mci 'open new Type waveaudio Alias cmrec'",
    "Mci 'set cmrec bitspersample 16 channels 1 samplespersec 16000 bytespersec 32000 alignment 2'",
    "Mci 'record cmrec'",
    '$sw = [Diagnostics.Stopwatch]::StartNew(); while (-not (Test-Path -LiteralPath $fileCo) -and $sw.Elapsed.TotalSeconds -lt $tran) { Start-Sleep -Milliseconds 100 }',
    "Mci 'stop cmrec'",
    "Mci ('save cmrec \"' + $duong + '\"')",
    "Mci 'close cmrec'",
    'exit 0',
    '',
  ].join('\r\n');
}

function fileWav(thuMuc: string, nenTang: string): FileGhiAm {
  const p = nenTang === 'win32' ? path.win32 : path.posix;
  return { duong: p.join(thuMuc, 'ghi-am.wav'), mime: 'audio/wav', ten: 'ghi-am.wav' };
}

/**
 * Mọi cách ghi khả dụng, theo thứ tự ưu tiên. `coSan` là tập tên lệnh có trong PATH; nếu là Map
 * (tên → đường dẫn tuyệt đối, kết quả của `timLenhCoSan`) thì dùng đường dẫn tuyệt đối.
 */
export function dungDanhSachLenhGhi(
  nenTang: string,
  coSan: Set<string> | Map<string, string>,
  thuMuc: string,
  tranGiay = 120,
): LenhGhi[] {
  const co = (ten: string) => coSan.has(ten);
  const lenhCua = (ten: string) => (coSan instanceof Map ? coSan.get(ten) : undefined) ?? ten;
  const giay = String(Math.max(1, Math.round(tranGiay)));
  const ds: LenhGhi[] = [];

  const ffmpeg = (dinhDang: string, nguon: string): LenhGhi => {
    const file = fileWav(thuMuc, nenTang);
    return {
      cach: 'ffmpeg',
      lenh: lenhCua('ffmpeg'),
      // Không -nostdin: ta dừng ffmpeg bằng phím 'q' qua stdin (file đóng gọn, header WAV đúng).
      doiSo: ['-hide_banner', '-loglevel', 'error', '-y', '-f', dinhDang, '-i', nguon,
        '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '-t', giay, file.duong],
      cachDung: 'q',
      file,
    };
  };

  if (nenTang === 'darwin') {
    if (co('ffmpeg')) ds.push(ffmpeg('avfoundation', ':default'));
    if (co('rec')) {
      const file = fileWav(thuMuc, nenTang);
      ds.push({
        cach: 'sox',
        lenh: lenhCua('rec'),
        doiSo: ['-q', '-c', '1', '-r', '16000', '-b', '16', file.duong, 'trim', '0', giay],
        cachDung: 'sigint',
        file,
      });
    }
    // osascript luôn có trên macOS ⇒ đường lùi cuối, không cần cài gì.
    const file = fileWav(thuMuc, nenTang);
    const fileCo = path.posix.join(thuMuc, 'dung.co');
    const duongScript = path.posix.join(thuMuc, 'ghi.js');
    ds.push({
      cach: 'jxa',
      lenh: 'osascript',
      doiSo: ['-l', 'JavaScript', duongScript],
      fileScript: { duong: duongScript, noiDung: scriptJxa(file.duong, fileCo, tranGiay) },
      cachDung: 'fileCo',
      fileCo,
      file,
    });
    return ds;
  }

  if (nenTang === 'win32') {
    const file = fileWav(thuMuc, nenTang);
    const fileCo = path.win32.join(thuMuc, 'dung.co');
    // Windows nào cũng có powershell.exe; pwsh chỉ dùng khi máy lạ không còn bản cũ.
    const lenh = co('powershell') || !co('pwsh') ? lenhCua('powershell') : lenhCua('pwsh');
    ds.push({
      cach: 'powershell',
      lenh: lenh === 'powershell' ? 'powershell.exe' : lenh,
      doiSo: ['-NoProfile', '-NonInteractive', '-Command', '-'],
      stdin: scriptPowerShell(),
      env: { CUONGMINI_GHI_DUONG: file.duong, CUONGMINI_GHI_CO: fileCo, CUONGMINI_GHI_TRAN: giay },
      cachDung: 'fileCo',
      fileCo,
      file,
    });
    return ds;
  }

  // Linux và các Unix khác.
  if (co('arecord')) {
    const file = fileWav(thuMuc, nenTang);
    ds.push({
      cach: 'arecord',
      lenh: lenhCua('arecord'),
      doiSo: ['-q', '-f', 'S16_LE', '-r', '16000', '-c', '1', '-t', 'wav', '-d', giay, file.duong],
      cachDung: 'sigint',
      file,
    });
  }
  if (co('parecord')) {
    const file = fileWav(thuMuc, nenTang);
    ds.push({
      cach: 'parecord',
      lenh: lenhCua('parecord'),
      doiSo: ['--channels=1', '--rate=16000', '--format=s16le', '--file-format=wav', file.duong],
      cachDung: 'sigint',
      file,
    });
  }
  if (co('ffmpeg')) ds.push(ffmpeg(co('pactl') ? 'pulse' : 'alsa', 'default'));
  return ds;
}

/** Cách ghi đầu tiên sẽ được thử, hoặc null nếu máy không có cách nào. */
export function dungLenhGhi(
  nenTang: string,
  coSan: Set<string> | Map<string, string>,
  thuMuc: string,
  tranGiay = 120,
): LenhGhi | null {
  return dungDanhSachLenhGhi(nenTang, coSan, thuMuc, tranGiay)[0] ?? null;
}

/** Lời khuyên khi máy không có cách ghi nào chạy được. */
export function loiKhuyenCaiDat(nenTang: string): string {
  if (nenTang === 'darwin') {
    return 'Hãy cho Visual Studio Code (hoặc Cursor) dùng micro trong System Settings › Privacy & Security › Microphone, hoặc cài ffmpeg: brew install ffmpeg.';
  }
  if (nenTang === 'win32') {
    return 'Hãy bật Settings › Privacy & security › Microphone › "Let desktop apps access your microphone", và kiểm tra Windows PowerShell còn trên máy.';
  }
  return 'Hãy cài công cụ ghi âm: sudo apt install alsa-utils (hoặc pulseaudio-utils / ffmpeg; Fedora: sudo dnf install alsa-utils).';
}

export const LOI_MIC_MACOS =
  'macOS chưa cho VS Code dùng micro — mở System Settings › Privacy & Security › Microphone và bật cho Visual Studio Code (hoặc Cursor), rồi khởi động lại VS Code.';
const LOI_IM_LANG_MACOS =
  'Micro chỉ thu được im lặng tuyệt đối — thường là macOS đang chặn micro: mở System Settings › Privacy & Security › Microphone và bật cho Visual Studio Code (hoặc Cursor).';
const LOI_KHONG_CO_TIENG = 'Không thu được tiếng — kiểm tra micro';

// ─────────────────────────────────────────────────────────────────────────────
// Phần chạy thật
// ─────────────────────────────────────────────────────────────────────────────

function xoaThuMuc(thuMuc: string): Promise<void> {
  // Chỉ xoá thư mục do chính module này tạo — chặn lỡ tay xoá nhầm khi được truyền đường lạ.
  if (!path.basename(thuMuc).startsWith(TIEN_TO_THU_MUC)) return Promise.resolve();
  return fsp.rm(thuMuc, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => {});
}

function cho(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function duoiLoi(stderr: string): string {
  const s = stderr.trim().split(/\r?\n/).filter(Boolean).slice(-3).join(' | ');
  return s ? ` (${s.slice(0, 300)})` : '';
}

function loiTheoMaThoat(lenh: LenhGhi, ma: number | null, stderr: string): Error | null {
  if (lenh.cachDung !== 'fileCo' || ma === 0) return null;
  if (lenh.cach === 'jxa' && ma === 3) return new LoiQuyenMicro(LOI_MIC_MACOS);
  if (lenh.cach === 'jxa' && ma === 4) return new LoiQuyenMicro(LOI_IM_LANG_MACOS);
  return new Error(`Ghi âm bằng ${lenh.cach} thất bại (mã ${ma})${duoiLoi(stderr)}`);
}

/**
 * Bật một cách ghi đã dựng. Ném nếu tiến trình không bật được hoặc chết ngay
 * (để `batDauGhiAm` thử cách kế). Export để test bằng "máy ghi giả" — không đụng micro.
 */
export async function chayLenhGhi(lenh: LenhGhi, thuMuc: string, tranGiay = 120): Promise<PhienGhiAm> {
  if (lenh.fileScript) await fsp.writeFile(lenh.fileScript.duong, lenh.fileScript.noiDung, 'utf8');

  const con: ChildProcess = spawn(lenh.lenh, lenh.doiSo, {
    cwd: thuMuc,
    env: { ...process.env, ...lenh.env },
    stdio: ['pipe', 'ignore', 'pipe'],
    windowsHide: true,
  });
  let stderr = '';
  con.stderr?.setEncoding('utf8');
  con.stderr?.on('data', (d: string) => { stderr = (stderr + d).slice(-4000); });
  con.stdin?.on('error', () => {}); // tiến trình chết trước khi đọc stdin ⇒ EPIPE, không phải lỗi của ta

  let maThoat: number | null | undefined; // undefined = còn chạy
  const daThoat = new Promise<void>((r) => {
    con.once('close', (ma, tinHieu) => { maThoat = ma ?? (tinHieu ? -1 : null); r(); });
  });
  // `spawn` KHÔNG ném khi lệnh không tồn tại — nó phát 'error' (ENOENT) sau đó.
  const loiBat = new Promise<Error>((r) => con.once('error', r));

  if (lenh.stdin !== undefined) con.stdin?.write(lenh.stdin);

  const dauTien = await Promise.race([
    loiBat.then((e) => ({ loai: 'loi' as const, e })),
    daThoat.then(() => ({ loai: 'thoat' as const })),
    cho(CUA_SO_CHET_SOM_MS).then(() => ({ loai: 'song' as const })),
  ]);
  if (dauTien.loai === 'loi') {
    const ma = (dauTien.e as NodeJS.ErrnoException).code;
    throw new Error(ma === 'ENOENT' ? `không có lệnh ${lenh.lenh}` : `${lenh.cach}: ${dauTien.e.message}`);
  }
  if (dauTien.loai === 'thoat') {
    throw loiTheoMaThoat(lenh, maThoat ?? null, stderr)
      ?? new Error(`${lenh.cach} dừng ngay khi vừa bật (mã ${maThoat})${duoiLoi(stderr)}`);
  }

  let daYeuCauDung = false;
  const yeuCauDung = () => {
    if (daYeuCauDung || maThoat !== undefined) return;
    daYeuCauDung = true;
    try {
      if (lenh.cachDung === 'q') {
        con.stdin?.write('q');
        con.stdin?.end();
      } else if (lenh.cachDung === 'sigint') {
        con.kill('SIGINT');
      } else if (lenh.fileCo) {
        fs.writeFileSync(lenh.fileCo, '');
      }
    } catch {
      /* tiến trình vừa thoát cùng lúc — bỏ qua */
    }
  };

  // Trần thời gian phía Node — lưới đỡ cho công cụ không có cờ thời lượng (parecord).
  const hen = setTimeout(yeuCauDung, Math.max(1, tranGiay) * 1000);
  hen.unref?.();

  const choThoat = async () => {
    const xong = await Promise.race([daThoat.then(() => true), cho(8000).then(() => false)]);
    if (xong) return;
    con.kill('SIGTERM');
    if (await Promise.race([daThoat.then(() => true), cho(2000).then(() => false)])) return;
    con.kill('SIGKILL');
    await Promise.race([daThoat, cho(2000)]);
  };

  let daKetThuc = false;
  return {
    async dung() {
      if (daKetThuc) throw new Error('Phiên ghi âm đã kết thúc');
      daKetThuc = true;
      clearTimeout(hen);
      try {
        yeuCauDung();
        await choThoat();
        const loi = loiTheoMaThoat(lenh, maThoat ?? null, stderr);
        if (loi) throw loi;
        let kichThuoc = 0;
        try { kichThuoc = (await fsp.stat(lenh.file.duong)).size; } catch { /* không có file */ }
        if (kichThuoc < CO_TOI_THIEU_BYTE) throw new Error(LOI_KHONG_CO_TIENG + duoiLoi(stderr));
        return { ...lenh.file };
      } catch (e) {
        await xoaThuMuc(thuMuc);
        throw e;
      }
    },
    huy() {
      if (daKetThuc) return;
      daKetThuc = true;
      clearTimeout(hen);
      // Cờ trước để JXA/PowerShell kịp đóng thiết bị; rồi giết luôn, không chờ file.
      if (lenh.fileCo) { try { fs.writeFileSync(lenh.fileCo, ''); } catch { /* bỏ qua */ } }
      if (maThoat === undefined) {
        try { con.kill(lenh.cachDung === 'fileCo' ? 'SIGTERM' : 'SIGINT'); } catch { /* bỏ qua */ }
      }
      void daThoat.then(() => xoaThuMuc(thuMuc));
      // Tiến trình lì không chịu thoát ⇒ vẫn dọn sau 3 giây.
      setTimeout(() => {
        if (maThoat === undefined) { try { con.kill('SIGKILL'); } catch { /* bỏ qua */ } }
        void xoaThuMuc(thuMuc);
      }, 3000).unref?.();
    },
  };
}

/** Bắt đầu ghi âm từ micro mặc định. `tranGiay` (mặc định 120) quá thì tự dừng. */
export async function batDauGhiAm(o: { tranGiay?: number } = {}): Promise<PhienGhiAm> {
  const tranGiay = o.tranGiay && o.tranGiay > 0 ? o.tranGiay : 120;
  const nenTang = process.platform;
  const thuMuc = await fsp.mkdtemp(path.join(os.tmpdir(), TIEN_TO_THU_MUC));
  const ds = dungDanhSachLenhGhi(nenTang, timLenhCoSan(nenTang), thuMuc, tranGiay);
  if (!ds.length) {
    await xoaThuMuc(thuMuc);
    throw new Error(`Máy này chưa có công cụ ghi âm nào. ${loiKhuyenCaiDat(nenTang)}`);
  }
  const hong: string[] = [];
  for (const lenh of ds) {
    try {
      return await chayLenhGhi(lenh, thuMuc, tranGiay);
    } catch (e) {
      if (e instanceof LoiQuyenMicro) {
        await xoaThuMuc(thuMuc);
        throw e;
      }
      hong.push(e instanceof Error ? e.message : String(e));
      // Cách trước có thể đã để lại file dở — xoá để cách sau không bị nhầm là đã có tiếng.
      await fsp.rm(lenh.file.duong, { force: true }).catch(() => {});
    }
  }
  await xoaThuMuc(thuMuc);
  throw new Error(`Không bật được ghi âm: ${hong.join('; ')}. ${loiKhuyenCaiDat(nenTang)}`);
}

interface PhanHoiStt {
  success?: boolean;
  message?: string;
  code?: string;
  data?: { text?: string; heard?: boolean; reason?: string };
}

/**
 * Gửi file lên `/api/v1/ai/stt` (multer `single('audio')`) và trả chữ nghe được.
 * Máy chủ bảo không nghe thấy tiếng nói (`heard === false`) ⇒ chuỗi rỗng.
 * Xong việc (kể cả khi lỗi) thì xoá thư mục tạm chứa file — tiếng nói là dữ liệu cá nhân.
 */
export async function nhanDang(
  file: FileGhiAm,
  o: { apiOrigin: string; token?: string | null; ngonNgu?: string },
): Promise<string> {
  try {
    const noiDung = await fsp.readFile(file.duong);
    const fd = new FormData();
    fd.append('audio', new Blob([new Uint8Array(noiDung)], { type: file.mime }), file.ten);
    fd.append('language', o.ngonNgu ?? 'vi');
    const headers: Record<string, string> = {};
    if (o.token) headers.authorization = `Bearer ${o.token}`;
    const url = `${o.apiOrigin.replace(/\/+$/, '')}/api/v1/ai/stt`;

    let res: Response;
    try {
      res = await fetch(url, { method: 'POST', body: fd, headers, signal: AbortSignal.timeout(60_000) });
    } catch (e) {
      const ten = (e as { name?: string })?.name;
      if (ten === 'TimeoutError' || ten === 'AbortError') {
        throw new Error('Máy chủ nhận dạng giọng nói không trả lời sau 60 giây');
      }
      throw new Error(`Không gửi được ghi âm lên máy chủ: ${e instanceof Error ? e.message : String(e)}`);
    }

    const than = (await res.json().catch(() => null)) as PhanHoiStt | null;
    if (!res.ok || !than?.success) {
      const loi = than?.message ? `: ${than.message}` : '';
      throw new Error(`Không nhận dạng được giọng nói (HTTP ${res.status})${loi}`);
    }
    if (than.data?.heard === false) return '';
    return String(than.data?.text ?? '').trim();
  } finally {
    await xoaThuMuc(path.dirname(file.duong));
  }
}
