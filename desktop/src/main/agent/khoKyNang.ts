/**
 * ============================================================
 * KHO KỸ NĂNG — cài skill/agent/command từ /ai-templates vào dự án
 * ============================================================
 *
 * Trang `/ai-templates` trên web là 1.877 component Claude Code, và AI Code
 * đọc ĐÚNG những định dạng đó — không phải trùng hợp, cả hai theo cùng một quy
 * ước. Nên "học" một kỹ năng chỉ là chép đúng tệp vào đúng thư mục:
 *
 *   skill   → `.claude/skills/<tên>/SKILL.md`   (`kyNang.ts` đọc)
 *   agent   → `.claude/agents/<tên>.md`         (`agentPhu.ts` đọc)
 *   command → `.claude/commands/<tên>.md`       (`lenhTuTao.ts` đọc)
 *
 * ─── HAI NGUỒN, HAI LÝ DO ───
 *  • CHỈ MỤC lấy từ chính web của người dùng (`/api/ai-templates/search`).
 *    Chép một bản vào app là hai bản phải giữ cho khớp mãi mãi, và bản trong
 *    app sẽ cũ dần sau mỗi lần kho trên web cập nhật.
 *  • NỘI DUNG lấy thẳng từ GitHub. 1.877 tệp là hơn 40 MB nên web cũng không
 *    đóng gói chúng; nó cũng lấy lúc cần. Gọi từ TIẾN TRÌNH CHÍNH, không phải
 *    renderer: CSP của app chặn `connect-src` ra ngoài, và lỗi hiện ra chỉ là
 *    "Failed to fetch" không nhắc gì tới CSP.
 *
 * ─── ⚠️ ĐÂY LÀ NỘI DUNG CỦA NGƯỜI LẠ ───
 * Ba loại này là CHỮ đi vào ngữ cảnh của model, không phải lệnh chạy — nên rủi
 * ro là chèn lệnh qua prompt, không phải chiếm máy. Prompt hệ thống ở máy chủ
 * đã rào: kết quả tool không gỡ được luật nào. Nhưng vẫn:
 *   • KHÔNG ghi đè tệp đang có (phải nói rõ `--de`) — người dùng có thể đã sửa.
 *   • Ghi vào trong dự án nên `git diff` xem được toàn bộ trước khi commit.
 *   • Hook và MCP CỐ Ý không cài được từ đây: chúng là dòng lệnh SẼ CHẠY, và
 *     chúng có cửa duyệt vân tay riêng (`duyetDuAn.ts`).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { moTrongNguc } from './jail';

/** Repo gốc của kho — khớp `SOURCE_RAW` bên `frontend/src/lib/ai-templates/catalog.ts`. */
const GOC_RAW = 'https://raw.githubusercontent.com/davila7/claude-code-templates/main';
const THU_MUC_COMPONENT = 'cli-tool/components';

/** Trần nội dung. Vài SKILL.md kèm tài liệu tham chiếu rất dài. */
const MAX_BYTE = 400_000;
const HET_GIO_MS = 8_000;
/** Nhớ đệm chỉ mục — nó chỉ đổi khi web dựng lại. */
const TTL_CHI_MUC_MS = 30 * 60_000;

export type LoaiKho = 'skill' | 'agent' | 'command';

/** Một mục trong chỉ mục. Tên trường viết tắt vì web lặp nó 1.877 lần. */
interface MucTho { n: string; p: string; c: string; t: string }

export interface MucKho {
  ten: string;
  duong: string;
  danhMuc: string;
  loai: LoaiKho;
}

const LOAI: Record<LoaiKho, { thuMuc: string; kieu: 'folder' | 'file'; dich: (t: string) => string }> = {
  skill: { thuMuc: 'skills', kieu: 'folder', dich: (t) => `.claude/skills/${t}/SKILL.md` },
  agent: { thuMuc: 'agents', kieu: 'file', dich: (t) => `.claude/agents/${t}.md` },
  command: { thuMuc: 'commands', kieu: 'file', dich: (t) => `.claude/commands/${t}.md` },
};

let dem: { luc: number; ds: MucKho[] } | null = null;

/**
 * Tải chỉ mục từ web của người dùng.
 *
 * `webOrigin` truyền vào chứ không đoán: app chạy được ở cả dev (localhost) lẫn
 * bản phát hành, và đoán sai thì lỗi là "không có kỹ năng nào" — im lặng và
 * trông y hệt kho rỗng.
 */
export async function napChiMuc(webOrigin: string): Promise<MucKho[]> {
  if (dem && Date.now() - dem.luc < TTL_CHI_MUC_MS) return dem.ds;
  const goc = webOrigin.replace(/\/+$/, '');
  const dieuKhien = new AbortController();
  const dongHo = setTimeout(() => dieuKhien.abort(), HET_GIO_MS);
  try {
    const r = await fetch(`${goc}/api/ai-templates/search`, { signal: dieuKhien.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const tho = (await r.json()) as MucTho[];
    const ds = tho
      .filter((x) => x.t === 'skill' || x.t === 'agent' || x.t === 'command')
      .map((x) => ({ ten: x.n, duong: x.p, danhMuc: x.c, loai: x.t as LoaiKho }));
    dem = { luc: Date.now(), ds };
    return ds;
  } finally {
    clearTimeout(dongHo);
  }
}

/**
 * Chuẩn hoá để tìm: bỏ DẤU và bỏ luôn mọi ký tự ngăn cách.
 *
 * Hai chuyện, cả hai đều cần:
 *  • Người Việt gõ không dấu là chuyện thường — "bao mat" phải ra "bảo mật".
 *  • Tên component dùng gạch nối (`bao-mat-web`) còn người ta gõ dấu cách. Bỏ
 *    hết ngăn cách thì "bao mat" khớp "bao-mat-web"; giữ lại thì không, và
 *    tính năng tìm coi như hỏng một nửa mà vẫn trông như đang chạy.
 *
 * ⚠️ Dải dấu phải viết bằng `\u0300-\u036f`, đừng dán ký tự tổ hợp thô vào
 * regex — chúng vô hình trong trình soạn thảo và rất dễ bị rụng khi mã đi qua
 * một lần sao chép.
 */
function boDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function tim(ds: MucKho[], tuKhoa: string, tran = 15): MucKho[] {
  const q = boDau(tuKhoa.trim());
  if (!q) return [];
  const diem = (m: MucKho): number => {
    const ten = boDau(m.ten);
    if (ten === q) return 0;
    if (ten.startsWith(q)) return 1;
    if (ten.includes(q)) return 2;
    if (boDau(m.danhMuc).includes(q)) return 3;
    return 99;
  };
  return ds
    .map((m) => ({ m, d: diem(m) }))
    .filter((x) => x.d < 99)
    .sort((a, b) => a.d - b.d || a.m.ten.localeCompare(b.m.ten))
    .slice(0, tran)
    .map((x) => x.m);
}

/** Tải nội dung thật của một component từ GitHub. */
async function taiNoiDung(m: MucKho): Promise<string> {
  const meta = LOAI[m.loai];
  const duong = meta.kieu === 'folder'
    ? `${THU_MUC_COMPONENT}/${meta.thuMuc}/${m.duong}/SKILL.md`
    : `${THU_MUC_COMPONENT}/${meta.thuMuc}/${m.duong}`;
  const dieuKhien = new AbortController();
  const dongHo = setTimeout(() => dieuKhien.abort(), HET_GIO_MS);
  try {
    const r = await fetch(`${GOC_RAW}/${duong}`, { signal: dieuKhien.signal });
    if (!r.ok) throw new Error(`GitHub trả HTTP ${r.status} cho ${duong}`);
    const chu = await r.text();
    if (chu.length > MAX_BYTE) throw new Error(`Nội dung ${(chu.length / 1024).toFixed(0)}KB, quá lớn.`);
    if (!chu.trim()) throw new Error('Tệp rỗng.');
    return chu;
  } finally {
    clearTimeout(dongHo);
  }
}

export interface KetQuaCai {
  ok: boolean;
  duongDan?: string;
  loi?: string;
  /** Vài dòng đầu để người dùng thấy mình vừa nhận cái gì. */
  xemTruoc?: string;
}

/**
 * Cài một component vào dự án đang mở.
 *
 * Đi qua `moTrongNguc` như mọi đường ghi khác — đường dẫn dựng từ tên component
 * do người dùng gõ, nên nó là dữ liệu ngoài, không phải hằng.
 */
export async function cai(
  goc: string | null,
  m: MucKho,
  opts: { ghiDe?: boolean } = {},
): Promise<KetQuaCai> {
  if (!goc) return { ok: false, loi: 'Chưa mở dự án nào — cài vào đâu thì phải có thư mục trước.' };
  let chu: string;
  try {
    chu = await taiNoiDung(m);
  } catch (e) {
    return { ok: false, loi: `Không tải được: ${(e as Error).message}` };
  }

  const tuongDoi = LOAI[m.loai].dich(m.ten);
  let dich: string;
  try {
    dich = await moTrongNguc(goc, tuongDoi);
  } catch (e) {
    return { ok: false, loi: (e as Error).message };
  }

  /* KHÔNG ghi đè trừ khi nói rõ: người dùng có thể đã sửa tệp này, và ghi đè
     im lặng là xoá công của họ bằng một lệnh trông như "tải về". */
  if (!opts.ghiDe) {
    const daCo = await fs.stat(dich).then(() => true, () => false);
    if (daCo) {
      return { ok: false, loi: `Đã có \`${tuongDoi}\`. Thêm \`--de\` nếu muốn ghi đè.` };
    }
  }

  await fs.mkdir(path.dirname(dich), { recursive: true });
  await fs.writeFile(dich, chu, 'utf8');
  return {
    ok: true,
    duongDan: tuongDoi,
    xemTruoc: chu.split('\n').slice(0, 12).join('\n'),
  };
}

/** Quên nhớ đệm — cho bộ kiểm. */
export function quenDem(): void { dem = null; }
