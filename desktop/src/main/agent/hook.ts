/**
 * ============================================================
 * HOOK — chạy lệnh của bạn quanh mỗi lời gọi tool
 * ============================================================
 *
 * Ba mốc:
 *   • `truocTool` — chạy TRƯỚC một tool. Thoát khác 0 (và có `chan: true`) thì
 *     tool bị CHẶN, và đầu ra của hook được trả cho model làm lý do.
 *   • `sauTool`   — chạy SAU. Đầu ra được nối vào kết quả tool, nên model ĐỌC
 *     ĐƯỢC. Đây là mốc đáng giá nhất: `npx tsc --noEmit` sau mỗi lần sửa file
 *     nghĩa là agent tự thấy lỗi kiểu nó vừa gây ra, ngay trong lượt đó, thay
 *     vì bạn phát hiện sau ba bước nữa.
 *   • `xongLuot`  — chạy khi cả lượt kết thúc.
 *
 * ─── ⚠️ VÌ SAO CẤU HÌNH KHÔNG NẰM TRONG REPO ───
 * Hook chạy lệnh shell TUỲ Ý. Đặt cấu hình vào `.claude/hooks.json` trong repo
 * nghĩa là `git clone` một dự án lạ — hoặc `git pull` một nhánh của người khác —
 * là đủ để chạy mã tuỳ ý trên máy bạn, không cần bạn bấm gì. Claude Code giải
 * bằng một lớp duyệt; ở đây đi theo tiền lệ đã có của `mcp.ts`: **cấu hình sống
 * ở `userData`, do chính bạn viết**. Repo không chèn được gì vào đó.
 *
 * Cái giá: hook không đi theo repo, nên đồng đội không tự có. Đổi lại là không
 * có đường nào để một file trong repo tự chạy lệnh trên máy bạn — với một app
 * mà việc chính là mở mã của người khác ra đọc, đó là đổi đáng.
 *
 * Lọc theo dự án bằng trường `duAn`, nên một file cấu hình vẫn phục vụ được
 * nhiều dự án khác nhau.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import { chayLenh } from './lenh';

export type MocHook = 'truocTool' | 'sauTool' | 'xongLuot';

export interface Hook {
  khi: MocHook;
  /** Regex khớp TÊN TOOL. Bỏ trống = mọi tool. Không dùng cho `xongLuot`. */
  khop?: string;
  /** Chỉ chạy khi đường dẫn dự án CHỨA chuỗi này. Bỏ trống = mọi dự án. */
  duAn?: string;
  lenh: string;
  /** Chỉ có nghĩa với `truocTool`: thoát khác 0 thì CHẶN tool. */
  chan?: boolean;
  /** Trần thời gian, giây. Mặc định 60. */
  giay?: number;
}

/** Trần số hook. Nhiều hơn thế thì mỗi lời gọi tool tốn hàng phút chờ. */
const MAX_HOOK = 20;
/** Cắt đầu ra hook. Model phải đọc được nó, mà một `npm test` dài là 200KB. */
const MAX_RA = 4000;
const GIAY_MAC_DINH = 60;

export function duongDanCauHinh(): string {
  return path.join(app.getPath('userData'), 'hooks.json');
}

const MAU = `{
  "_doc": "Hook chạy quanh mỗi lời gọi tool của agent. Sửa file này rồi bấm 'Nạp lại hook' trong app.",
  "_mocs": "truocTool | sauTool | xongLuot",
  "_vidu": [
    {
      "khi": "sauTool",
      "khop": "edit_file|create_file|sua_nhieu_cho",
      "duAn": "/Users/ban/du-an-cua-ban",
      "lenh": "npx tsc --noEmit",
      "giay": 120
    },
    {
      "khi": "truocTool",
      "khop": "run_command",
      "lenh": "test -f .khong-cho-chay-lenh && exit 1 || exit 0",
      "chan": true
    }
  ],
  "hooks": []
}
`;

function hopLe(x: unknown): x is Hook {
  if (typeof x !== 'object' || x === null) return false;
  const h = x as Record<string, unknown>;
  if (h.khi !== 'truocTool' && h.khi !== 'sauTool' && h.khi !== 'xongLuot') return false;
  if (typeof h.lenh !== 'string' || h.lenh.trim() === '' || h.lenh.length > 2000) return false;
  if (h.khop !== undefined && typeof h.khop !== 'string') return false;
  if (h.duAn !== undefined && typeof h.duAn !== 'string') return false;
  /* Mẫu regex hỏng phải bị loại NGAY LÚC ĐỌC, không phải lúc khớp: ném giữa
     vòng lặp tool sẽ giết cả lượt vì một dấu ngoặc thừa trong file cấu hình. */
  if (typeof h.khop === 'string') {
    try { new RegExp(h.khop); } catch { return false; }
  }
  return true;
}

let demHook: { luc: number; ds: Hook[] } | null = null;
/** Nhớ đệm 5 giây: một lượt gọi hàng chục tool, đọc lại file mỗi lần là vô ích. */
const TTL_MS = 5000;

export async function docHook(): Promise<Hook[]> {
  if (demHook && Date.now() - demHook.luc < TTL_MS) return demHook.ds;
  const p = duongDanCauHinh();
  let ds: Hook[] = [];
  try {
    const j = JSON.parse(await fs.readFile(p, 'utf8')) as { hooks?: unknown };
    if (Array.isArray(j.hooks)) ds = j.hooks.filter(hopLe).slice(0, MAX_HOOK);
  } catch {
    // Chưa có file ⇒ ghi mẫu. Không cấu hình hook là trạng thái BÌNH THƯỜNG.
    await fs.writeFile(p, MAU, 'utf8').catch(() => {});
  }
  demHook = { luc: Date.now(), ds };
  return ds;
}

/** Quên nhớ đệm — gọi khi người dùng bấm "Nạp lại hook". */
export function quenDemHook(): void { demHook = null; }

function khopHook(h: Hook, goc: string, tenTool: string | null): boolean {
  if (h.duAn !== undefined && h.duAn !== '' && !goc.includes(h.duAn)) return false;
  if (h.khi === 'xongLuot') return true;
  if (h.khop === undefined || h.khop === '') return true;
  if (tenTool === null) return false;
  try { return new RegExp(h.khop).test(tenTool); } catch { return false; }
}

/**
 * NHẬT KÝ hook — vòng đệm trong bộ nhớ.
 *
 * Vì sao cần: hook ĐẠT mà không in gì thì cố ý im lặng (xem `chayHook`), nên
 * lúc mới cấu hình người dùng không phân biệt được "hook chạy và ổn" với "hook
 * không hề chạy". Hai trạng thái đó trông y hệt nhau, và không có gì để nhìn.
 *
 * Chỉ trong bộ nhớ, không ghi đĩa: đây là thứ để soi ngay lúc đang cấu hình,
 * không phải hồ sơ kiểm toán. Ghi xuống đĩa thì phải lo dọn, lo cỡ file, và lo
 * việc đầu ra lệnh của người dùng nằm lại trên máy sau khi họ đóng app.
 */
export interface MucNhatKy {
  luc: number;
  moc: MocHook;
  lenh: string;
  tenTool: string | null;
  /** `null` = bị giết (hết giờ hoặc người dùng dừng). */
  ma: number | null;
  giay: number;
  /** Có bị coi là CHẶN không. */
  chan: boolean;
  /** Dòng đầu của đầu ra, để nhìn lướt. Rỗng = không in gì. */
  dong1: string;
}

const MAX_NHAT_KY = 40;
const nhatKy: MucNhatKy[] = [];

/** Mới nhất TRƯỚC — bảng đọc từ trên xuống, và cái vừa xảy ra là cái đáng xem. */
export function docNhatKy(): MucNhatKy[] {
  return [...nhatKy].reverse();
}

export function xoaNhatKy(): void { nhatKy.length = 0; }

function ghiNhatKy(m: MucNhatKy): void {
  nhatKy.push(m);
  if (nhatKy.length > MAX_NHAT_KY) nhatKy.shift();
}

export interface KetQuaHook {
  /** Có hook nào bảo CHẶN không (chỉ `truocTool`). */
  chan: boolean;
  /** Đầu ra gộp, đã cắt. Rỗng = không hook nào chạy hoặc không hook nào nói gì. */
  ra: string;
  /**
   * Bao nhiêu hook KHỚP mốc + tên tool này.
   *
   * Cần vì `ra` rỗng có HAI nghĩa hoàn toàn khác nhau — "không hook nào khớp"
   * (cấu hình sai `khop`) và "hook chạy xong, đạt, không in gì" (bình thường).
   * Gộp hai thứ đó vào một chuỗi rỗng là để người đang dò cấu hình mắc kẹt ở
   * đúng chỗ khó nhất.
   */
  soKhop: number;
}

/**
 * Chạy mọi hook khớp một mốc.
 *
 * Chạy TUẦN TỰ, không song song: hook hay là những lệnh đụng cùng một cây mã
 * (`tsc`, `lint`, `test`) và chạy chồng nhau thì chúng tranh nhau file tạm và
 * bộ nhớ đệm của chính bộ dịch — kết quả sai theo kiểu khó tin nhất là "đôi khi
 * đỏ".
 */
export async function chayHook(opts: {
  moc: MocHook;
  goc: string;
  tenTool?: string;
  args?: unknown;
  signal: AbortSignal;
}): Promise<KetQuaHook> {
  const ds = (await docHook()).filter((h) => h.khi === opts.moc
    && khopHook(h, opts.goc, opts.tenTool ?? null));
  if (ds.length === 0) return { chan: false, ra: '', soKhop: 0 };

  const manh: string[] = [];
  let chan = false;
  for (const h of ds) {
    if (opts.signal.aborted) break;
    const kq = await chayLenh({
      lenh: h.lenh,
      cwd: opts.goc,
      giay: h.giay ?? GIAY_MAC_DINH,
      signal: opts.signal,
    });
    const dat = kq.ma === 0;
    const seChan = !dat && h.chan === true && opts.moc === 'truocTool';
    ghiNhatKy({
      luc: Date.now(),
      moc: opts.moc,
      lenh: h.lenh,
      tenTool: opts.tenTool ?? null,
      ma: kq.ma,
      giay: kq.giay,
      chan: seChan,
      dong1: kq.ra.trim().split('\n')[0]?.slice(0, 160) ?? '',
    });
    /* Hook ĐẠT và không in gì ⇒ im lặng. Nhồi "hook xong, mã 0" vào kết quả
       tool là bắt model đọc (và trả tiền cho) một dòng không mang tin gì, ở
       MỌI lời gọi tool. */
    if (dat && kq.ra.trim() === '') continue;
    manh.push(
      `[hook ${opts.moc}: \`${h.lenh}\`${dat ? '' : ` — thoát ${kq.ma ?? 'bị giết'}`}`
      + `${kq.hetGio ? ', HẾT GIỜ' : ''}]\n${kq.ra.trim() || '(không in gì)'}`,
    );
    if (seChan) { chan = true; break; }
  }

  let ra = manh.join('\n\n');
  if (ra.length > MAX_RA) ra = `${ra.slice(0, MAX_RA)}\n[… cắt bớt]`;
  return { chan, ra, soKhop: ds.length };
}
