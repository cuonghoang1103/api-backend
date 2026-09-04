/**
 * ============================================================
 * LỆNH GẠCH CHÉO TỰ TẠO — `.claude/commands/*.md` trong dự án
 * ============================================================
 *
 * Một file markdown = một lệnh. Gõ `/tên` thì nội dung file được đặt vào ô soạn
 * thay cho lệnh đó.
 *
 * Vì sao đáng có: mọi việc lặp lại đều đang được gõ lại nguyên văn mỗi lần —
 * "ra đề thi 50 câu song ngữ theo mẫu…", "rà lại toàn bộ trang X". Gõ lại thì
 * mỗi lần một khác, và câu mô tả đi lạc dần khỏi thứ đã cho kết quả tốt lần
 * trước. Một file trong repo thì đứng yên, đi theo dự án, và sửa được.
 *
 * ─── Chỗ tìm ───
 * `.claude/commands/` là quy ước của Claude Code; `.agent/commands/` để dự án
 * nào không muốn mang tên một công cụ khác trong cây thư mục vẫn dùng được.
 * Cùng lý do `ghiChu.ts` nhận cả `AGENTS.md` lẫn `CLAUDE.md`.
 *
 * ⚠️ KHÔNG tự chạy gì cả. Lệnh tự tạo chỉ ĐẶT CHỮ vào ô soạn — người dùng đọc
 * rồi mới bấm gửi. Cho nó tự gửi nghĩa là một file trong repo (có thể tới từ
 * `git pull` của người khác) tự khởi động một lượt agent tốn tiền, với nội dung
 * người dùng chưa từng nhìn thấy.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
export { ghepThamSo } from '../../shared/lenhDuAn';

const THU_MUC = ['.claude/commands', '.agent/commands'] as const;
/** Trần số lệnh. Bảng gợi ý dài hơn thế là không chọn được bằng mắt nữa. */
const MAX_LENH = 60;
/** Trần cỡ một file lệnh. Lớn hơn thế gần như chắc chắn là file bị đặt nhầm chỗ. */
const MAX_BYTE = 64 * 1024;

export interface LenhDuAn {
  /** Tên gõ vào, đã có dấu `/` đứng đầu. */
  ten: string;
  /** Dòng mô tả ngắn cho bảng gợi ý. */
  mo: string;
  /** Nội dung sẽ được đặt vào ô soạn. */
  than: string;
}

/**
 * Tách phần đầu YAML (`---`) nếu có, và lấy `description:` làm dòng mô tả.
 *
 * Không dùng thư viện YAML: ở đây chỉ cần đúng một trường, mà kéo cả bộ phân
 * tích YAML vào tiến trình main là thêm một bề mặt tấn công cho một file nằm
 * trong repo — thứ có thể tới từ `git pull` của người khác.
 */
export function tachDau(noiDung: string): { mo: string | null; than: string } {
  if (!noiDung.startsWith('---')) return { mo: null, than: noiDung };
  const het = noiDung.indexOf('\n---', 3);
  if (het < 0) return { mo: null, than: noiDung };
  const dau = noiDung.slice(3, het);
  const than = noiDung.slice(noiDung.indexOf('\n', het + 1) + 1);
  const khop = /^\s*description\s*:\s*(.+)$/m.exec(dau);
  return { mo: khop ? khop[1]!.trim().replace(/^["']|["']$/g, '') : null, than };
}

/** Mô tả rút từ nội dung khi không khai `description`: tiêu đề `#`, hoặc dòng chữ đầu. */
function moTuThan(than: string): string {
  for (const dong of than.split('\n')) {
    const d = dong.trim();
    if (d === '') continue;
    if (d.startsWith('#')) return d.replace(/^#+\s*/, '').slice(0, 80);
    return d.slice(0, 80);
  }
  return 'Lệnh của dự án';
}


/** Đọc lệnh tự tạo của một dự án. Không có thư mục nào ⇒ mảng rỗng, không phải lỗi. */
export async function docLenhDuAn(goc: string): Promise<LenhDuAn[]> {
  const ra: LenhDuAn[] = [];
  const daCo = new Set<string>();

  for (const tuongDoi of THU_MUC) {
    const thuMuc = path.join(goc, ...tuongDoi.split('/'));
    let muc: string[];
    try {
      muc = await fs.readdir(thuMuc);
    } catch {
      continue;
    }
    for (const ten of muc.sort()) {
      if (ra.length >= MAX_LENH) return ra;
      if (!ten.endsWith('.md')) continue;
      const goi = ten.slice(0, -3).toLowerCase();
      /* Tên phải gõ được thành một lệnh. File `Ra đề (bản 2).md` sẽ thành một
         lệnh không ai gõ trúng, và nó chen chỗ của lệnh thật trong bảng. */
      if (!/^[a-z0-9][a-z0-9_-]*$/.test(goi)) continue;
      // Thư mục đầu tiên thắng: `.claude/commands` là quy ước chính.
      if (daCo.has(goi)) continue;

      const duong = path.join(thuMuc, ten);
      const st = await fs.stat(duong).catch(() => null);
      if (!st?.isFile() || st.size > MAX_BYTE) continue;
      const noiDung = await fs.readFile(duong, 'utf8').catch(() => null);
      if (noiDung === null) continue;

      const { mo, than } = tachDau(noiDung);
      if (than.trim() === '') continue; // file rỗng là một lệnh không làm gì
      daCo.add(goi);
      ra.push({ ten: `/${goi}`, mo: mo ?? moTuThan(than), than: than.trim() });
    }
  }
  return ra;
}
