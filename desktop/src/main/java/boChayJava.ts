/**
 * ============================================================
 * BỘ CHẠY JAVA — biên dịch và CHẠY THẬT bài LAB211 ngay trên máy người học
 * ============================================================
 *
 * ─── VÌ SAO NẰM Ở ĐÂY, KHÔNG NẰM TRÊN MÁY CHỦ ───
 * Trên VPS, bài nộp là MÃ LẠ: phải nhốt container, cắt mạng, đặt trần RAM,
 * và cõng thêm ~200MB JDK lên cái đĩa đã một lần chết vì hết chỗ. Trên máy
 * người học, nó là mã CỦA CHÍNH HỌ, chạy đúng chỗ nó vốn chạy — trong
 * NetBeans. Cả lớp rủi ro đó biến mất, chứ không phải được xử lý. Và JDK thì
 * họ bắt buộc phải có sẵn: môn này học bằng NetBeans.
 *
 * ─── VÌ SAO KHÔNG DÙNG LẠI `chayLenh` CỦA AGENT ───
 * `chayLenh` sinh ra cho agent: chạy qua shell, gom output rồi CẮT KHÚC GIỮA
 * để khỏi phình hội thoại, và không có đường nạp stdin. Chấm bài cần đúng ba
 * thứ ngược lại — argv thẳng (đường dẫn macOS có dấu cách là chỗ shell
 * quoting hỏng câm), stdin nạp sẵn theo kịch bản người chấm, và console
 * NGUYÊN VẸN từng ký tự vì LAB211 chấm bằng cách diff màn hình.
 * Thứ mượn lại là bài học đắt nhất của nó: giết CẢ NHÓM tiến trình.
 *
 * ─── ĐÂY LÀ CÔNG THỨC ĐÃ ĐƯỢC CHỨNG MINH ───
 * Cùng cách `solkit.py` đã kiểm 54 lời giải mẫu: javac cả cây → chạy lớp main
 * với stdin cố định → so console. Nên có sẵn phép kiểm ngược: cho nó chạy
 * chính lời giải mẫu, phải ra đúng transcript đã verify. Không ra thì lỗi ở
 * bộ chạy, không phải ở bài.
 */
import { spawn, execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

/** Trần thời gian một lượt chạy. Bài LAB211 nào cũng xong trong vài giây. */
export const TRAN_GIAY_CHAY = 20;
/** Trần console một lượt. Vòng lặp vô tận in ra hàng trăm MB nếu không chặn. */
const TRAN_KY_TU_RA = 200_000;

export interface Jdk {
  javac: string;
  java: string;
  /** Ví dụ "21.0.2". Rỗng khi không đọc được. */
  phienBan: string;
  /** Nơi tìm ra, để nói cho người dùng biết app đang dùng JDK nào. */
  nguon: string;
}

export interface LoiBienDich {
  file: string;
  dong: number | null;
  cot: number | null;
  loi: string;
}

export interface KetQuaBienDich {
  ok: boolean;
  /** Thư mục .class, dùng làm classpath khi chạy. */
  thuMucRa: string;
  loi: LoiBienDich[];
  /** Nguyên văn javac, giữ lại vì thông báo của nó là thứ người học phải học đọc. */
  raThô: string;
  soTep: number;
}

export interface KetQuaChay {
  /** Mã thoát; null khi bị giết (hết giờ hoặc người dùng dừng). */
  ma: number | null;
  /** stdout + stderr trộn theo đúng thứ tự xuất hiện — đây là "màn hình". */
  console: string;
  loiRieng: string;
  hetGio: boolean;
  catBot: boolean;
  giay: number;
}

// ─── 1. tìm JDK ────────────────────────────────────────────────

function themDuoi(p: string): string {
  return process.platform === 'win32' ? `${p}.exe` : p;
}

async function coFile(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

/** Thử một thư mục bin: phải có CẢ javac lẫn java mới tính. */
async function thuBin(binDir: string, nguon: string): Promise<Jdk | null> {
  const javac = path.join(binDir, themDuoi('javac'));
  const java = path.join(binDir, themDuoi('java'));
  if (!(await coFile(javac)) || !(await coFile(java))) return null;
  let phienBan = '';
  try {
    // javac in phiên bản ra stderr ở JDK cũ, stdout ở JDK mới — đọc cả hai.
    const { stdout, stderr } = await execFileP(javac, ['-version'], { timeout: 8_000 });
    phienBan = (`${stdout}${stderr}`.match(/\d+(\.\d+)*/) || [''])[0];
  } catch { /* vẫn dùng được, chỉ là không đọc được số */ }
  return { javac, java, phienBan, nguon };
}

async function gomThuMucCon(goc: string): Promise<string[]> {
  try {
    const ds = await fs.readdir(goc, { withFileTypes: true });
    return ds.filter((d) => d.isDirectory()).map((d) => path.join(goc, d.name));
  } catch { return []; }
}

/**
 * Dò JDK theo thứ tự đáng tin dần xuống.
 *
 * `JAVA_HOME` trước vì đó là thứ người dùng CỐ Ý đặt. Trên macOS
 * `/usr/libexec/java_home` là đường chính thống và biết cả JDK cài qua
 * Homebrew lẫn Oracle. PATH đứng sau vì `java` trong PATH có thể là JRE —
 * chạy được mà không biên dịch được, và đó là kiểu hỏng khó hiểu nhất với
 * người mới: "máy tôi có Java mà".
 */
export async function timJdk(): Promise<Jdk | null> {
  const ung: Array<() => Promise<Jdk | null>> = [];

  if (process.env.JAVA_HOME) {
    ung.push(() => thuBin(path.join(process.env.JAVA_HOME as string, 'bin'), 'JAVA_HOME'));
  }

  if (process.platform === 'darwin') {
    ung.push(async () => {
      try {
        const { stdout } = await execFileP('/usr/libexec/java_home', [], { timeout: 8_000 });
        const home = stdout.trim();
        return home ? await thuBin(path.join(home, 'bin'), '/usr/libexec/java_home') : null;
      } catch { return null; }
    });
  }

  // PATH
  ung.push(async () => {
    const tach = process.platform === 'win32' ? ';' : ':';
    for (const d of (process.env.PATH || '').split(tach).filter(Boolean)) {
      const j = await thuBin(d, 'PATH');
      if (j) return j;
    }
    return null;
  });

  // Những chỗ cài quen thuộc, kể cả JDK đi kèm NetBeans.
  ung.push(async () => {
    const goc: string[] = process.platform === 'win32'
      ? [
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Java'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Eclipse Adoptium'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Microsoft', 'jdk'),
      ]
      : process.platform === 'darwin'
        ? ['/Library/Java/JavaVirtualMachines', path.join(os.homedir(), 'Library/Java/JavaVirtualMachines')]
        : ['/usr/lib/jvm', '/opt/java'];
    for (const g of goc) {
      for (const con of await gomThuMucCon(g)) {
        // macOS bọc thêm một tầng Contents/Home.
        for (const bin of [path.join(con, 'bin'), path.join(con, 'Contents', 'Home', 'bin')]) {
          const j = await thuBin(bin, con);
          if (j) return j;
        }
      }
    }
    return null;
  });

  for (const thu of ung) {
    const j = await thu();
    if (j) return j;
  }
  return null;
}

// ─── 2. biên dịch ──────────────────────────────────────────────

/** Gom mọi .java dưới một thư mục. */
export async function gomJava(goc: string): Promise<string[]> {
  const ra: string[] = [];
  async function di(d: string): Promise<void> {
    let ds;
    try { ds = await fs.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of ds) {
      const p = path.join(d, e.name);
      // build/ và dist/ là .class cũ và jar — javac lại chúng là vô nghĩa, và
      // đó cũng là hai thư mục đề bài dặn xoá trước khi nộp.
      if (e.isDirectory()) {
        if (e.name === 'build' || e.name === 'dist' || e.name === 'nbproject' || e.name === '.git') continue;
        await di(p);
      } else if (e.name.endsWith('.java')) ra.push(p);
    }
  }
  await di(goc);
  return ra.sort();
}

/** Bóc "src/ui/Main.java:12: error: ';' expected" thành thứ gắn được vào gutter. */
export function bocLoiJavac(raThô: string, goc: string): LoiBienDich[] {
  const loi: LoiBienDich[] = [];
  for (const dong of raThô.split('\n')) {
    const m = /^(.+?\.java):(\d+):\s*(?:error|lỗi):\s*(.*)$/.exec(dong.trim());
    if (!m) continue;
    loi.push({
      file: path.relative(goc, m[1]!) || m[1]!,
      dong: Number(m[2]),
      cot: null,
      loi: m[3]!.trim(),
    });
  }
  return loi;
}

/**
 * Biên dịch cả cây nguồn vào một thư mục tạm.
 *
 * `-encoding UTF-8` KHÔNG phải tuỳ chọn cho vui: thiếu nó thì javac đọc file
 * theo bảng mã mặc định của hệ, và trên Windows tiếng Việt trong chuỗi thành
 * dấu hỏi — biên dịch vẫn xanh, chương trình vẫn chạy, chỉ có màn hình là
 * sai. Đúng kiểu hỏng mà người học không tài nào đoán ra.
 */
export async function bienDich(opts: {
  jdk: Jdk;
  /** Thư mục gốc project (chỗ có src/). */
  duAn: string;
}): Promise<KetQuaBienDich> {
  const src = path.join(opts.duAn, 'src');
  const goc = (await coFile(src)) ? src : opts.duAn;
  const tep = await gomJava(goc);
  const thuMucRa = await fs.mkdtemp(path.join(os.tmpdir(), 'lab211-build-'));

  if (!tep.length) {
    return { ok: false, thuMucRa, soTep: 0, raThô: '', loi: [{ file: '', dong: null, cot: null, loi: 'Không tìm thấy file .java nào trong project.' }] };
  }

  try {
    const { stdout, stderr } = await execFileP(
      opts.jdk.javac,
      ['-encoding', 'UTF-8', '-d', thuMucRa, ...tep],
      { timeout: TRAN_GIAY_CHAY * 3_000, maxBuffer: 8 * 1024 * 1024, cwd: opts.duAn, env: moiTruongSach() },
    );
    const raThô = `${stdout}${stderr}`.trim();
    return { ok: true, thuMucRa, soTep: tep.length, raThô, loi: bocLoiJavac(raThô, goc) };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    const raThô = `${err.stdout || ''}${err.stderr || ''}`.trim() || String(err.message || e);
    return { ok: false, thuMucRa, soTep: tep.length, raThô, loi: bocLoiJavac(raThô, goc) };
  }
}

// ─── 3. chạy ───────────────────────────────────────────────────

/**
 * Môi trường cho lượt chạy chấm bài.
 *
 * ⚠️ ĐO THẬT, và bản vá đầu tiên của tôi SAI. Máy nào đặt `JAVA_TOOL_OPTIONS`
 * (proxy doanh nghiệp, CI, container) thì JVM in ra STDERR dòng
 * "Picked up JAVA_TOOL_OPTIONS: …" TRƯỚC khi chương trình chạy. Console là
 * thứ đem đi diff từng ký tự, nên một dòng rác ở đầu là hỏng cả phép chấm —
 * mà người dùng không đời nào đoán ra, vì trong NetBeans họ không thấy nó.
 *
 * Đặt biến thành CHUỖI RỖNG không cứu được: JVM vẫn thấy biến ĐƯỢC ĐẶT và vẫn
 * in banner, chỉ là in với giá trị rỗng. Phải XOÁ HẲN KHOÁ. Phép kiểm bắt
 * đúng chỗ này — bản vá sai đã đi qua `tsc` sạch sẽ.
 */
function moiTruongSach(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', TERM: 'dumb' };
  delete env.JAVA_TOOL_OPTIONS;
  delete env._JAVA_OPTIONS;
  delete env.JDK_JAVA_OPTIONS;
  return env;
}


/**
 * Chạy lớp main với bàn phím đã soạn sẵn.
 *
 * `stdin` là đúng chuỗi phím người chấm gõ, kể cả xuống dòng. Đóng stdin sau
 * khi ghi xong là CỐ Ý: chương trình nào đọc quá số dòng đã cho sẽ gặp hết
 * input thay vì treo mãi — và "treo khi hết input" chính là một lỗi đáng bị
 * bắt, không phải một lượt chạy đáng chờ.
 */
export function chay(opts: {
  jdk: Jdk;
  classpath: string;
  lopMain: string;
  stdin?: string;
  /** Thư mục làm việc — đường dẫn tương đối trong bài tính từ đây, phải là gốc project. */
  cwd: string;
  giay?: number;
  /** Ép locale để tái hiện máy chấm (vi_VN). Bỏ trống = theo máy người dùng. */
  locale?: string;
  signal?: AbortSignal;
  onRa?: (mau: string) => void;
}): Promise<KetQuaChay> {
  const tran = Math.max(1, Math.floor(opts.giay || TRAN_GIAY_CHAY));
  const batDau = Date.now();

  const tuyChon = ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8'];
  if (opts.locale) {
    const [ngonNgu, quocGia] = opts.locale.split(/[-_]/);
    if (ngonNgu) tuyChon.push(`-Duser.language=${ngonNgu}`);
    if (quocGia) tuyChon.push(`-Duser.country=${quocGia}`);
  }

  return new Promise<KetQuaChay>((resolve) => {
    let man = '';
    let loiRieng = '';
    let hetGio = false;
    let catBot = false;
    let xong = false;

    const con = spawn(opts.jdk.java, [...tuyChon, '-cp', opts.classpath, opts.lopMain], {
      cwd: opts.cwd,
      // KHÔNG shell: đường dẫn có dấu cách ("Application Support") là chỗ
      // quoting của shell hỏng câm trên đúng máy của người dùng macOS.
      shell: false,
      detached: process.platform !== 'win32',
      windowsHide: true,
      env: moiTruongSach(),
    });

    const giet = (): void => {
      if (!con.pid) return;
      try {
        if (process.platform === 'win32') spawn('taskkill', ['/pid', String(con.pid), '/T', '/F']);
        else process.kill(-con.pid, 'SIGKILL');
      } catch { /* đã tự thoát */ }
    };

    const dongHoChet = setTimeout(() => { hetGio = true; giet(); }, tran * 1_000);
    const huy = (): void => { giet(); };
    opts.signal?.addEventListener('abort', huy, { once: true });

    const nhan = (mau: string, laLoi: boolean): void => {
      if (man.length >= TRAN_KY_TU_RA) { catBot = true; giet(); return; }
      man += mau;
      if (laLoi) loiRieng += mau;
      opts.onRa?.(mau);
    };

    con.stdout?.setEncoding('utf8');
    con.stderr?.setEncoding('utf8');
    con.stdout?.on('data', (m: string) => nhan(m, false));
    con.stderr?.on('data', (m: string) => nhan(m, true));

    if (opts.stdin != null) {
      con.stdin?.write(opts.stdin, 'utf8');
      con.stdin?.end();
    }
    con.stdin?.on('error', () => { /* chương trình thoát sớm, không đọc hết — bình thường */ });

    const ketThuc = (ma: number | null): void => {
      if (xong) return;
      xong = true;
      clearTimeout(dongHoChet);
      opts.signal?.removeEventListener('abort', huy);
      resolve({
        ma: hetGio ? null : ma,
        console: man,
        loiRieng,
        hetGio,
        catBot,
        giay: Math.round((Date.now() - batDau) / 100) / 10,
      });
    };

    con.on('close', (ma) => ketThuc(ma));
    con.on('error', (e) => { nhan(`\n[không chạy được: ${e.message}]\n`, true); ketThuc(null); });
  });
}

/**
 * Đoán lớp main: tìm file có `public static void main`, ưu tiên gói `ui`.
 *
 * Ưu tiên `ui` vì khuôn LAB211 đặt màn hình ở đó. Bài ba tệp không có `ui`
 * thì rơi về file duy nhất có main — cũng đúng.
 */
export async function doanLopMain(goc: string): Promise<string[]> {
  const tep = await gomJava(goc);
  const ra: string[] = [];
  for (const p of tep) {
    let noi = '';
    try { noi = await fs.readFile(p, 'utf8'); } catch { continue; }
    if (!/public\s+static\s+void\s+main\s*\(/.test(noi)) continue;
    const goiM = /^\s*package\s+([\w.]+)\s*;/m.exec(noi);
    const ten = path.basename(p, '.java');
    ra.push(goiM ? `${goiM[1]}.${ten}` : ten);
  }
  return ra.sort((a, b) => {
    const ua = a.startsWith('ui.') ? 0 : 1;
    const ub = b.startsWith('ui.') ? 0 : 1;
    return ua - ub || a.localeCompare(b);
  });
}
