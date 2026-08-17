/**
 * ============================================================
 * BỘ NHỚ DỰ ÁN — `AGENTS.md` / `CLAUDE.md` trong repo
 * ============================================================
 *
 * Thứ làm agent biết quy ước RIÊNG của dự án — deploy bằng script nào, lệnh nào
 * cấm chạy, enum phải import chứ đừng chép tay — thay vì đoán lại từ đầu mỗi
 * phiên và đoán sai theo cùng một kiểu mãi.
 *
 * ─── ĐỌC LẠI Ở MỖI LƯỢT, KHÔNG NHỚ ĐỆM ───
 * File này là thứ người dùng SỬA trong lúc làm việc — thường là sửa ngay sau
 * khi agent làm sai một lần ("thêm dòng: đừng bao giờ chạy migrate reset"). Nhớ
 * đệm nghĩa là bản vá đó không có tác dụng cho tới khi mở lại app, và người
 * dùng kết luận rằng viết ghi chú chẳng thay đổi gì. Đọc một file 25KB tốn
 * chưa tới một mili giây; sai lệch giữa file và điều agent tin thì tốn cả một
 * lượt.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Thứ tự ưu tiên. Dừng ở file ĐẦU TIÊN tìm thấy, không gộp.
 *
 * Gộp cả hai nghe có vẻ chu đáo hơn nhưng thường sai: repo nào có cả hai thì
 * gần như luôn là một file thật + một file symlink/bản sao (repo này là ví dụ —
 * `AGENTS.md` và `CLAUDE.md` lệch nhau đúng 11 byte). Gộp là trả tiền hai lần
 * cho cùng một nội dung.
 *
 * `AGENTS.md` đứng trước vì nó là quy ước chung giữa các công cụ, còn
 * `CLAUDE.md` là tên riêng của một công cụ khác.
 */
const TEN_FILE = ['AGENTS.md', 'CLAUDE.md', '.agentrc.md'] as const;

/** Trần đọc từ đĩa. Máy chủ còn cắt tiếp về 6.000 ký tự trước khi vào prompt. */
const TRAN_BYTE = 256 * 1024;

export interface GhiChuDuAn {
  ten: string;
  noiDung: string;
}

/**
 * Tìm và đọc ghi chú dự án. `null` nếu không có file nào.
 *
 * KHÔNG dùng nhà tù đường dẫn ở đây vì tên file là hằng số do MÌNH viết, không
 * phải chuỗi do model sinh ra — không có gì để traversal. Nhưng vẫn `join` từ
 * gốc chứ không nhận đường dẫn từ đâu khác.
 */
export async function docGhiChuDuAn(goc: string): Promise<GhiChuDuAn | null> {
  for (const ten of TEN_FILE) {
    const p = path.join(goc, ten);
    try {
      const st = await fs.stat(p);
      if (!st.isFile() || st.size === 0) continue;
      // File khổng lồ: đọc phần đầu chứ không bỏ hẳn. Người ta hay để luật quan
      // trọng nhất ở trên đầu, nên nửa file còn hơn không có gì.
      if (st.size > TRAN_BYTE) {
        const fh = await fs.open(p, 'r');
        try {
          const buf = Buffer.alloc(TRAN_BYTE);
          await fh.read(buf, 0, TRAN_BYTE, 0);
          return { ten, noiDung: buf.toString('utf8') };
        } finally {
          await fh.close();
        }
      }
      return { ten, noiDung: await fs.readFile(p, 'utf8') };
    } catch {
      // Không có file, hoặc không đọc được (quyền). Cả hai đều là "không có ghi
      // chú" — không phải lỗi, và tuyệt đối không được làm hỏng lượt agent.
      continue;
    }
  }
  return null;
}
