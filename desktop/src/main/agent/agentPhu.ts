/**
 * ============================================================
 * AGENT PHỤ TỰ ĐỊNH NGHĨA — `.claude/agents/<tên>.md`
 * ============================================================
 *
 * Quy ước của Claude Code. Một file = một loại agent phụ: phần đầu YAML khai
 * `name` + `description`, thân file là PROMPT HỆ THỐNG của nó.
 *
 * ```
 * ---
 * name: ra-bao-mat
 * description: Rà một vùng mã tìm lỗ bảo mật, trả về danh sách có mức độ
 * ---
 * Bạn là người rà bảo mật. Với mỗi phát hiện hãy nêu: đường dẫn:dòng, …
 * ```
 *
 * ─── Khác kỹ năng ở chỗ nào ───
 * Kỹ năng (`kyNang.ts`) là chữ nhét vào hội thoại của agent CHÍNH — nó đọc rồi
 * tự làm. Agent phụ là một LƯỢT RIÊNG, ngữ cảnh riêng, và chỉ bản tóm tắt cuối
 * quay về. Nên agent phụ hợp với việc "đi dò một hướng độc lập rồi kể lại",
 * còn kỹ năng hợp với "làm việc này theo đúng quy trình của dự án".
 *
 * ⚠️ THÂN FILE ĐẾN TỪ REPO, và nó đi vào chỗ PROMPT HỆ THỐNG của agent phụ —
 * gần hơn hẳn so với kỹ năng (chỉ là kết quả tool). Vì thế:
 *
 *   • Agent phụ vẫn CHỈ ĐỌC. Prompt của dự án KHÔNG mở thêm được quyền nào:
 *     `laPhu: true` ở máy chủ ép trần 10 bước và bỏ mọi tool ghi, và nó không
 *     đọc gì từ chuỗi này. Một file `.md` không cấp được quyền cho chính nó.
 *   • Máy chủ bọc nó trong một khối có mốc rõ ràng và giữ nguyên luật gốc —
 *     xem `promptViecPhu` trong `src/services/agent/prompt.ts`.
 *
 * Đây là ranh giới đáng giữ: người dùng thêm được VIỆC cho agent phụ, không
 * thêm được QUYỀN.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { docDauKyNang } from './kyNang';

const THU_MUC = ['.claude/agents', '.agent/agents'] as const;
/** Trần số loại. Dài hơn thì model chọn bừa, và mỗi dòng là token mỗi lượt. */
const MAX_LOAI = 20;
/** Trần một file. Prompt hệ thống dài hơn thế là đang lấn hết ngữ cảnh của việc. */
const MAX_BYTE = 32 * 1024;

export interface TomTatAgentPhu { ten: string; moTa: string }

/** Tên phải gõ được và khớp lại được — cùng luật với kỹ năng. */
function tenHopLe(t: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(t);
}

async function duyet(goc: string): Promise<Array<{ ten: string; moTa: string; duong: string }>> {
  const ra: Array<{ ten: string; moTa: string; duong: string }> = [];
  const daCo = new Set<string>();
  for (const tuongDoi of THU_MUC) {
    const thuMuc = path.join(goc, ...tuongDoi.split('/'));
    let muc: string[];
    try {
      muc = await fs.readdir(thuMuc);
    } catch {
      continue;   // không có thư mục là chuyện BÌNH THƯỜNG
    }
    for (const f of muc.sort()) {
      if (ra.length >= MAX_LOAI) return ra;
      if (!f.endsWith('.md')) continue;
      const duong = path.join(thuMuc, f);
      try {
        const st = await fs.stat(duong);
        if (!st.isFile() || st.size > MAX_BYTE) continue;
        const { ten, moTa } = docDauKyNang(await fs.readFile(duong, 'utf8'));
        /* Tên lấy từ phần đầu YAML, KHÔNG từ tên file: hai chỗ có thể lệch
           nhau, và `name` là thứ người viết chủ động khai. Thiếu `name` thì
           lùi về tên file — chép một file mẫu về mà quên sửa vẫn dùng được. */
        const t = (ten ?? f.slice(0, -3)).trim().toLowerCase();
        if (!tenHopLe(t) || daCo.has(t)) continue;
        // Thiếu `description` thì model không biết khi nào gọi ⇒ bỏ hẳn, thay
        // vì đưa vào danh sách một dòng trống nó phải đoán.
        if (!moTa?.trim()) continue;
        daCo.add(t);
        ra.push({ ten: t, moTa: moTa.trim().slice(0, 200), duong });
      } catch {
        continue;
      }
    }
  }
  return ra;
}

/** Tên + mô tả các loại agent phụ dự án khai. KHÔNG kèm thân — cùng lý do như kỹ năng. */
export async function dsAgentPhu(goc: string | null): Promise<TomTatAgentPhu[]> {
  if (!goc) return [];
  return (await duyet(goc)).map(({ ten, moTa }) => ({ ten, moTa }));
}

/** Thân file (phần sau YAML) của một loại — dùng làm prompt cho lượt phụ. */
export async function docThanAgentPhu(goc: string | null, ten: string): Promise<string | null> {
  if (!goc) return null;
  const m = (await duyet(goc)).find((x) => x.ten === ten.trim().toLowerCase());
  if (!m) return null;
  try {
    const { than } = docDauKyNang(await fs.readFile(m.duong, 'utf8'));
    const t = than.trim();
    return t.length > 0 ? t : null;
  } catch {
    return null;
  }
}
