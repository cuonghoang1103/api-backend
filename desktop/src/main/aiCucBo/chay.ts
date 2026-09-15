/**
 * ============================================================
 * BẬT / TẮT MÁY CHỦ AI CHẠY NGAY TRÊN MÁY NGƯỜI DÙNG
 * ============================================================
 *
 * `llama-server` mở đúng tuyến OpenAI `/v1/chat/completions` — cùng giao thức
 * app đã nói với cổng từ trước — nên cắm vào không cần lớp chuyển đổi nào. Đo
 * thật 15/09/2026: `GET /health` trả `{"status":"ok"}` khi nạp xong model, và
 * lượt chat đầu tiên trả lời đúng bằng tiếng Việt.
 *
 * ⚠️⚠️ BA CÁI BẪY ĐÃ ĐO ĐƯỢC, KHÔNG PHẢI ĐỌC TÀI LIỆU MÀ RA:
 *
 * 1. **Cấu trúc gói KHÔNG giống nhau giữa các hệ.** Gói macOS/Linux có một
 *    thư mục gốc `llama-b10976/` bọc ngoài; gói Windows thì PHẲNG, đổ thẳng
 *    `llama-server.exe` ra cùng mức. Đoán một kiểu là hỏng đúng một nửa số
 *    máy. Nên ở đây KHÔNG đoán: tìm đệ quy cái tên cần tìm.
 *
 * 2. **Thư viện nằm CẠNH tệp chạy.** `libggml-metal.dylib`, `ggml-base.dll`…
 *    đều ở cùng thư mục với `llama-server`. Chạy nó từ thư mục khác thì trên
 *    Windows là "không tìm thấy DLL", trên macOS/Linux là lỗi loader. Nên
 *    luôn đặt `cwd` vào đúng thư mục chứa nó.
 *
 * 3. **Nạp model là việc LÂU.** File 2,5 GB đọc từ đĩa cơ có thể mất hàng
 *    chục giây, và trong lúc đó `/health` chưa trả lời. "Không kết nối được"
 *    ở giây thứ hai KHÔNG có nghĩa là hỏng — phải chờ, và phải phân biệt
 *    "đang nạp" với "đã chết".
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { exec } from 'node:child_process';
import { chmod, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { promisify } from 'node:util';

const chay = promisify(exec);

/** Số lớp đẩy lên GPU. 99 = "tất cả" — llama.cpp tự cắt theo số lớp model có. */
const MOI_LOP_LEN_GPU = 99;

/**
 * Cửa sổ ngữ cảnh.
 *
 * 8192 là chỗ cân: bài học dài nhất của Học viện đo được ~2.400 token, cộng
 * câu hỏi và lịch sử vẫn dư. Lớn hơn thì tốn RAM thêm mà không dùng tới —
 * và RAM là thứ đang chật trên chính những máy cần tính năng này.
 */
const CUA_SO = 8192;

export interface DangChay {
  cong: number;
  /** Địa chỉ gốc để gọi, dạng `http://127.0.0.1:18xxx`. */
  goc: string;
  maModel: string;
}

let tienTrinh: ChildProcess | null = null;
let dangChay: DangChay | null = null;

/**
 * ── TỰ TẮT KHI ĐỂ KHÔNG ────────────────────────────────────────
 *
 * Người dùng: *"để tránh lãng phí ram, cpu chẳng hạn"*. Đúng lo: model 4B giữ
 * **3,6 GB RAM** thường trực (đo thật), và trên máy 16 GB đó là gần một phần
 * tư bộ nhớ nằm không.
 *
 * Nên máy chủ tự tắt sau một khoảng không ai hỏi. Bật lại tốn vài giây nạp
 * model — rẻ hơn nhiều so với giữ 3,6 GB suốt buổi cho một tính năng có thể cả
 * ngày không dùng tới.
 *
 * 15 phút: đủ dài để một phiên hỏi đáp có quãng nghỉ không bị cắt ngang, đủ
 * ngắn để người quên mất mình từng bật không mất RAM cả ngày.
 */
const HAN_DE_KHONG_MS = 15 * 60_000;
let henTuTat: ReturnType<typeof setTimeout> | null = null;
/** Người dùng tự bấm Bật thì KHÔNG tự tắt — đó là một quyết định có chủ đích. */
let nguoiDungTuBat = false;

function hoanTuTat(): void {
  if (henTuTat) clearTimeout(henTuTat);
  henTuTat = null;
  if (nguoiDungTuBat || !dangChay) return;
  henTuTat = setTimeout(() => { void tat(); }, HAN_DE_KHONG_MS);
}

/** Báo "vừa có người hỏi" — dời hạn tự tắt ra sau. */
export function vuaDung(): void {
  hoanTuTat();
}

/** Đánh dấu lượt bật này là do NGƯỜI DÙNG bấm, nên đừng tự tắt. */
export function danhDauNguoiDungBat(co: boolean): void {
  nguoiDungTuBat = co;
  hoanTuTat();
}
/** Vài dòng cuối của đầu ra — để nói cho người dùng biết nó chết vì sao. */
let nhatKy: string[] = [];

export function trangThai(): DangChay | null {
  return dangChay;
}

/** Vài dòng cuối llama-server in ra. Rỗng khi chưa chạy lần nào. */
export function dauRaGanDay(): string {
  return nhatKy.join('\n');
}

/**
 * Tìm đệ quy một tệp chạy trong cây thư mục.
 *
 * Có vì cấu trúc gói khác nhau giữa các hệ (xem đầu tệp). Trả về đường dẫn
 * đầy đủ, hoặc `null`.
 */
export async function timTep(goc: string, ten: string, sau = 4): Promise<string | null> {
  if (sau < 0) return null;
  let muc;
  try {
    muc = await readdir(goc, { withFileTypes: true });
  } catch {
    return null;
  }
  /* Quét tệp TRƯỚC rồi mới xuống thư mục con: gói Windows để tệp chạy ngay ở
     mức trên cùng, nên lối này tìm thấy sau một lần đọc thư mục. */
  for (const m of muc) {
    if (m.isFile() && m.name === ten) return join(goc, m.name);
  }
  for (const m of muc) {
    if (m.isDirectory()) {
      const thay = await timTep(join(goc, m.name), ten, sau - 1);
      if (thay) return thay;
    }
  }
  return null;
}

/** Tên tệp chạy theo hệ. */
export function tenLlamaServer(nenTang: string): string {
  return nenTang === 'win32' ? 'llama-server.exe' : 'llama-server';
}

/**
 * Giải nén gói bộ chạy.
 *
 * `tar` có sẵn trên cả ba hệ — Windows 10 1803 trở đi kèm bsdtar, đọc được cả
 * `.zip`. Máy Windows cũ hơn thì lùi về `Expand-Archive` của PowerShell.
 */
export async function giaiNen(goiFile: string, dich: string, nenTang: string): Promise<void> {
  await mkdir(dich, { recursive: true });
  const cd = { cwd: dich, timeout: 180_000, windowsHide: true } as const;
  try {
    await chay(`tar -xf "${goiFile}"`, cd);
  } catch (e) {
    if (nenTang !== 'win32') throw e;
    await chay(
      'powershell -NoProfile -Command "Expand-Archive -LiteralPath '
      + `'${goiFile}' -DestinationPath '${dich}' -Force"`,
      cd,
    );
  }
}

/**
 * Xin hệ điều hành một cổng còn trống.
 *
 * ⚠️ Mở rồi đóng ngay rồi mới đưa cho llama-server là có một khe hở lý thuyết
 * (ai đó chiếm mất giữa chừng). Chấp nhận, vì đường còn lại — đoán một cổng cố
 * định — hỏng thường xuyên hơn NHIỀU: người dùng chạy sẵn một `llama-server`
 * của họ, hoặc mở hai app cùng lúc, là đụng ngay. Cổng chiếm mất thì bật lại
 * một lần là qua.
 */
export function xinCong(): Promise<number> {
  return new Promise((ok, fail) => {
    const s = createServer();
    s.once('error', fail);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address() as { port: number };
      s.close(() => ok(port));
    });
  });
}

/** Máy chủ đã nạp xong model chưa. */
async function khoeChua(goc: string): Promise<boolean> {
  try {
    const r = await fetch(`${goc}/health`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) return false;
    const j = await r.json() as { status?: string };
    return j?.status === 'ok';
  } catch {
    return false;
  }
}

export interface YeuCauBat {
  duongLlamaServer: string;
  duongModel: string;
  duongMmproj?: string;
  maModel: string;
  /** `false` khi máy không có GPU dùng được — ép chạy hoàn toàn trên CPU. */
  coGpu: boolean;
  /** Báo tiến trình nạp cho giao diện, để người dùng không tưởng app treo. */
  onTin?: (chu: string) => void;
}

export class LoiChay extends Error {}

/**
 * Bật máy chủ và CHỜ tới khi nó thật sự trả lời được.
 *
 * Trả về khi `/health` nói `ok` — chứ không phải khi `spawn()` trả về. Hai
 * việc đó cách nhau hàng chục giây, và trả về sớm nghĩa là lượt chat đầu tiên
 * của người dùng ăn lỗi kết nối.
 */
export async function bat(yc: YeuCauBat): Promise<DangChay> {
  if (dangChay) {
    if (dangChay.maModel === yc.maModel) return dangChay;
    await tat();
  }

  const cong = await xinCong();
  const goc = `http://127.0.0.1:${cong}`;
  const thuMuc = join(yc.duongLlamaServer, '..');

  /* Gói tải về từ GitHub không giữ cờ chạy trên macOS/Linux sau khi giải nén
     bằng một số công cụ. Đặt lại cho chắc; lỗi thì bỏ qua (Windows không có
     khái niệm này). */
  await chmod(yc.duongLlamaServer, 0o755).catch(() => {});

  const cove = [
    '--model', yc.duongModel,
    '--host', '127.0.0.1',
    '--port', String(cong),
    '-c', String(CUA_SO),
    '-ngl', String(yc.coGpu ? MOI_LOP_LEN_GPU : 0),
    /* Không cần trang web của chính llama.cpp — app tự có giao diện, và tắt
       nó đi thì bớt một mặt phơi ra trên máy người dùng. */
    '--no-webui',
  ];
  if (yc.duongMmproj) cove.push('--mmproj', yc.duongMmproj);

  nhatKy = [];
  const con = spawn(yc.duongLlamaServer, cove, {
    cwd: thuMuc, // thư viện nằm cạnh tệp chạy — xem đầu tệp
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  tienTrinh = con;

  let daChet: string | null = null;
  const ghi = (d: Buffer) => {
    for (const dong of d.toString().split(/\r?\n/)) {
      if (!dong.trim()) continue;
      nhatKy.push(dong);
      if (nhatKy.length > 40) nhatKy.shift();
    }
  };
  con.stdout?.on('data', ghi);
  con.stderr?.on('data', ghi);
  /* `spawn` KHÔNG ném khi tệp không tồn tại — nó phát sự kiện `error` sau đó.
     [[feedback_spawn_khong_nem_khi_lenh_khong_ton_tai]] */
  con.on('error', (e) => { daChet = e.message; });
  con.on('exit', (ma) => {
    if (tienTrinh === con) { tienTrinh = null; dangChay = null; }
    if (daChet === null) daChet = `Tiến trình thoát với mã ${ma}.`;
  });

  /* Trần 4 phút: đo thật trên M1 Max thì nạp bản 4B mất ~2 giây, nhưng đó là
     ổ SSD nhanh và file đã nằm trong bộ nhớ đệm của hệ. Máy có ổ cơ, lần đầu,
     file 2,5 GB — hàng chục giây tới vài phút là bình thường. */
  const han = Date.now() + 240_000;
  let lanBao = 0;
  while (Date.now() < han) {
    if (daChet) {
      const viSao = nhatKy.slice(-6).join('\n');
      throw new LoiChay(`AI trên máy không bật được. ${daChet}${viSao ? `\n\n${viSao}` : ''}`);
    }
    if (await khoeChua(goc)) {
      dangChay = { cong, goc, maModel: yc.maModel };
      hoanTuTat();
      yc.onTin?.('Đã sẵn sàng.');
      return dangChay;
    }
    lanBao += 1;
    if (lanBao === 4) yc.onTin?.('Đang nạp model vào bộ nhớ…');
    if (lanBao === 20) yc.onTin?.('Vẫn đang nạp — lần đầu trên máy này thường lâu hơn.');
    await new Promise((r) => { setTimeout(r, 1000); });
  }

  await tat();
  throw new LoiChay('AI trên máy nạp quá lâu (hơn 4 phút) nên đã dừng. '
    + 'Thường là do máy thiếu RAM, hoặc ổ đĩa quá chậm cho bản này.');
}

/** Tắt máy chủ. Gọi được cả khi chưa chạy. */
export async function tat(): Promise<void> {
  if (henTuTat) { clearTimeout(henTuTat); henTuTat = null; }
  const con = tienTrinh;
  tienTrinh = null;
  dangChay = null;
  if (!con || con.killed || con.exitCode !== null) return;

  con.kill('SIGTERM');
  /* Chờ tối đa 5 giây rồi mới ra tay. Một tiến trình đang ghi bộ nhớ đệm mà
     bị SIGKILL ngay có thể để lại file dở trên đĩa. */
  const xong = await Promise.race([
    new Promise<boolean>((ok) => { con.once('exit', () => ok(true)); }),
    new Promise<boolean>((ok) => { setTimeout(() => ok(false), 5000); }),
  ]);
  if (!xong) con.kill('SIGKILL');
}

/**
 * Xoá model đã tải.
 *
 * ⚠️ Phải TẮT trước khi xoá. Trên Windows không xoá được tệp đang mở, nên xoá
 * lúc máy chủ còn chạy sẽ thất bại — và thất bại im lặng, để lại 2,5 GB nằm
 * mãi trên đĩa của người dùng sau khi họ đã bấm "Xoá".
 */
export async function xoaModel(duong: string): Promise<void> {
  await tat();
  await rm(duong, { force: true });
  await rm(`${duong}.dangtai`, { force: true });
}

/** Tệp đã tải trọn chưa (theo cỡ mong đợi). */
export async function daCoTron(duong: string, coMongByte: number): Promise<boolean> {
  try {
    const s = await stat(duong);
    if (!s.isFile()) return false;
    return coMongByte <= 0 || Math.abs(s.size - coMongByte) / coMongByte < 0.02;
  } catch {
    return false;
  }
}
