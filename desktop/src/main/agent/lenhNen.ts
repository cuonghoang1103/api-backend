/**
 * ============================================================
 * LỆNH CHẠY NỀN — `npm run dev` rồi vẫn làm việc tiếp
 * ============================================================
 *
 * `chayLenh` (trong `lenh.ts`) CHỜ lệnh xong rồi mới trả về. Đúng cho `npm test`
 * hay `tsc`, nhưng sai hẳn cho một tiến trình vốn không bao giờ tự dừng: dev
 * server, `tsc --watch`, `tail -f`. Với chúng, "chờ xong" nghĩa là treo tới khi
 * hết giờ rồi bị giết — tức là agent KHÔNG khởi động được server để tự kiểm
 * việc mình vừa sửa.
 *
 * ─── BA THỨ PHẢI CÓ, THIẾU CÁI NÀO CŨNG THÀNH VÔ DỤNG ───
 *  1. KHỞI ĐỘNG rồi trả về ngay, kèm một mã để gọi lại.
 *  2. ĐỌC ĐẦU RA đã tích được — không có bước này thì agent bật server xong mù
 *     hoàn toàn, không biết nó chạy hay chết ngay lúc khởi động.
 *  3. DỪNG. Và dừng phải giết CẢ NHÓM tiến trình, cùng lý do như `lenh.ts`.
 *
 * ─── ⚠️ CHỖ NGUY HIỂM RIÊNG CỦA CHẠY NỀN: TIẾN TRÌNH MỒ CÔI ───
 * Lệnh đồng bộ luôn kết thúc trong một lượt. Lệnh nền thì SỐNG LÂU HƠN cuộc hội
 * thoại sinh ra nó. Quên dọn thì đóng tab, đóng app, hay chỉ đổi thư mục dự án
 * cũng để lại một `next dev` ăn CPU mãi mãi mà không có giao diện nào nhắc tới
 * nó nữa. Vì thế: trần số tiến trình, dọn theo CUỘC, và dọn lúc thoát app.
 */
import { spawn, type ChildProcess } from 'node:child_process';

/** Tối đa mấy lệnh nền cùng lúc, tính cho CẢ APP. */
const MAX_NEN = 4;
/** Giữ bấy nhiêu ký tự đầu ra gần nhất cho mỗi lệnh. */
const TRAN_DEM = 200_000;
/** Trả tối đa bấy nhiêu ký tự cho mỗi lần agent đọc. */
const TRAN_DOC = 20_000;

interface LenhNen {
  id: string;
  lenh: string;
  cuocId: string;
  con: ChildProcess;
  dem: string;
  /** Đã đọc tới đâu — lần đọc sau chỉ trả phần MỚI. */
  daDoc: number;
  ma: number | null;
  dangChay: boolean;
  batDau: number;
}

const bang = new Map<string, LenhNen>();
let dem = 0;

function catDem(s: string): string {
  return s.length > TRAN_DEM ? s.slice(-TRAN_DEM) : s;
}

export interface KetQuaBat {
  ok: boolean;
  id?: string;
  loi?: string;
}

/**
 * Khởi động một lệnh ở nền và trả về NGAY.
 *
 * Không có `AbortSignal` ở đây, và đó là điểm khác cốt lõi: lệnh nền cố ý SỐNG
 * LÂU HƠN lượt sinh ra nó. Người dùng bấm Dừng là dừng lượt agent, không phải
 * tắt dev server họ vừa bảo nó bật.
 */
export function batLenhNen(opts: { lenh: string; cwd: string; cuocId: string }): KetQuaBat {
  const dangSong = [...bang.values()].filter((l) => l.dangChay);
  if (dangSong.length >= MAX_NEN) {
    return {
      ok: false,
      loi: `Đã có ${MAX_NEN} lệnh chạy nền. Hãy dừng bớt bằng dung_lenh_nen trước khi bật thêm.`,
    };
  }

  const id = `n${++dem}`;
  let con: ChildProcess;
  try {
    con = spawn(opts.lenh, {
      cwd: opts.cwd,
      shell: true,
      detached: process.platform !== 'win32',
      windowsHide: true,
      env: { ...process.env, CI: '1', NO_COLOR: '1', FORCE_COLOR: '0', TERM: 'dumb' },
    });
  } catch (err) {
    return { ok: false, loi: (err as Error).message };
  }

  const muc: LenhNen = {
    id, lenh: opts.lenh, cuocId: opts.cuocId, con,
    dem: '', daDoc: 0, ma: null, dangChay: true, batDau: Date.now(),
  };
  bang.set(id, muc);

  con.stdout?.on('data', (b: Buffer) => { muc.dem = catDem(muc.dem + b.toString('utf8')); });
  // stderr GỘP CHUNG vào một dòng thời gian, không để riêng: phần lớn công cụ
  // in tiến trình ra stderr và lỗi ra stdout hoặc ngược lại, nên tách ra chỉ
  // làm mất thứ tự thật của sự việc.
  con.stderr?.on('data', (b: Buffer) => { muc.dem = catDem(muc.dem + b.toString('utf8')); });

  // `spawn` KHÔNG ném khi lệnh không tồn tại — nó báo qua sự kiện `error`. Ghi
  // vào đệm để agent ĐỌC ĐƯỢC lý do, thay vì thấy một tiến trình chết câm.
  con.on('error', (e) => {
    muc.dem = catDem(`${muc.dem}\n[không chạy được: ${e.message}]`);
    muc.dangChay = false;
  });
  con.on('exit', (ma) => { muc.ma = ma; muc.dangChay = false; });

  return { ok: true, id };
}

export interface DauRa {
  ok: boolean;
  loi?: string;
  lenh?: string;
  dangChay?: boolean;
  ma?: number | null;
  giay?: number;
  moi?: string;
  /** Có phần mới nào không — để nói rõ "chưa in gì thêm" thay vì trả chuỗi rỗng. */
  coGiMoi?: boolean;
}

/**
 * Đọc phần đầu ra MỚI kể từ lần đọc trước.
 *
 * Trả phần mới chứ không trả cả đệm: agent hỏi lại sau mỗi vài giây, và trả cả
 * đệm mỗi lần nghĩa là cùng một nghìn dòng log được tính tiền lại từ đầu ở mọi
 * lượt.
 */
export function docDauRaNen(id: string): DauRa {
  const muc = bang.get(id);
  if (!muc) return { ok: false, loi: `Không có lệnh nền nào mang mã "${id}".` };

  const moi = muc.dem.slice(muc.daDoc);
  muc.daDoc = muc.dem.length;
  const catBot = moi.length > TRAN_DOC;
  return {
    ok: true,
    lenh: muc.lenh,
    dangChay: muc.dangChay,
    ma: muc.ma,
    giay: Math.round((Date.now() - muc.batDau) / 1000),
    moi: catBot ? `[… cắt bớt phần đầu …]\n${moi.slice(-TRAN_DOC)}` : moi,
    coGiMoi: moi.length > 0,
  };
}

export function dungLenhNen(id: string): { ok: boolean; loi?: string } {
  const muc = bang.get(id);
  if (!muc) return { ok: false, loi: `Không có lệnh nền nào mang mã "${id}".` };
  giet(muc);
  return { ok: true };
}

function giet(muc: LenhNen): void {
  const pid = muc.con.pid;
  if (!pid || !muc.dangChay) { muc.dangChay = false; return; }
  try {
    // Giết cả NHÓM. `npm run dev` sinh ra node, node sinh ra bundler, bundler
    // sinh ra worker — giết mỗi `npm` thì cây con vẫn giữ cổng 3000 và lần bật
    // sau báo EADDRINUSE, trông như lệnh hỏng.
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(pid), '/T', '/F']);
    else process.kill(-pid, 'SIGKILL');
  } catch {
    try { muc.con.kill('SIGKILL'); } catch { /* đã chết */ }
  }
  muc.dangChay = false;
}

export interface TomTatNen { id: string; lenh: string; dangChay: boolean; ma: number | null; giay: number }

export function dsLenhNen(cuocId?: string): TomTatNen[] {
  return [...bang.values()]
    .filter((l) => !cuocId || l.cuocId === cuocId)
    .map((l) => ({
      id: l.id, lenh: l.lenh, dangChay: l.dangChay, ma: l.ma,
      giay: Math.round((Date.now() - l.batDau) / 1000),
    }));
}

/** Dọn mọi lệnh nền của một cuộc — gọi khi đóng tab hoặc đổi thư mục dự án. */
export function dungLenhNenCua(cuocId: string): number {
  let n = 0;
  for (const [id, muc] of bang) {
    if (muc.cuocId !== cuocId) continue;
    if (muc.dangChay) { giet(muc); n++; }
    bang.delete(id);
  }
  return n;
}

/** Dọn TẤT CẢ — gọi khi thoát app. Thiếu bước này là để lại tiến trình mồ côi. */
export function dungMoiLenhNen(): void {
  for (const [, muc] of bang) giet(muc);
  bang.clear();
}
