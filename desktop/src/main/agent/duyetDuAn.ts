/**
 * ============================================================
 * DUYỆT THEO VÂN TAY — dùng chung cho mọi thứ dự án khai mà SẼ CHẠY
 * ============================================================
 *
 * Hai chỗ dùng: `.mcp.json` (server MCP) và `.claude/settings.json` (hook). Cả
 * hai đều nằm trong kho mã và cả hai đều là DÒNG LỆNH SẼ CHẠY trên máy người
 * dùng — `git clone` một repo lạ rồi mở nó là repo đó chọn giúp bạn một tiến
 * trình con, với env của bạn.
 *
 * ─── VÌ SAO KHOÁ THEO VÂN TAY, KHÔNG PHẢI MỘT CỜ true/false ───
 * "Đã duyệt dự án này" là câu trả lời sai: người dùng duyệt một NỘI DUNG cụ
 * thể mà họ vừa đọc, không phải duyệt mọi nội dung tương lai của thư mục đó.
 * Một `git pull` đổi `command` thành `curl … | sh` mà không hỏi lại thì cửa
 * duyệt chỉ là trang trí.
 *
 * ─── VÀ VÌ SAO NÓ CHUẨN HOÁ TRƯỚC KHI BĂM ───
 * Định dạng lại file (prettier, một lần `git merge`) đảo thứ tự khoá mà không
 * đổi ý nghĩa. Hỏi lại vì chuyện đó là hỏi vô cớ, và hỏi vô cớ là cách nhanh
 * nhất khiến người ta bấm "duyệt" theo phản xạ — kể cả lần file đổi thật.
 *
 * Kho duyệt nằm ở `userData`, KHÔNG ở repo: agent có quyền ghi trong repo, nên
 * để danh sách duyệt ở đó là để nó tự duyệt cho chính nó.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { app } from 'electron';

/** Trần số dự án nhớ, cắt theo lần dùng gần nhất. */
const MAX_DU_AN = 100;

function duong(tenKho: string): string {
  return path.join(app.getPath('userData'), tenKho);
}

/**
 * Vân tay của một cấu hình.
 *
 * Chuẩn hoá bằng cách SẮP KHOÁ rồi mới `JSON.stringify` — cả ở cấp ngoài lẫn
 * trong từng mục. Băm thẳng chuỗi thô thì mỗi lần định dạng lại file là một
 * lần hỏi duyệt.
 */
export function vanTay(gt: unknown): string {
  const chuan = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(chuan);
    if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().map((k) => [k, chuan(o[k])]);
    }
    return x;
  };
  return createHash('sha256').update(JSON.stringify(chuan(gt))).digest('hex').slice(0, 32);
}

async function doc(tenKho: string): Promise<Record<string, { vt: string; luc: number }>> {
  try {
    const j = JSON.parse(await fs.readFile(duong(tenKho), 'utf8')) as Record<string, { vt: string; luc: number }>;
    return j && typeof j === 'object' && !Array.isArray(j) ? j : {};
  } catch {
    return {};   // chưa có file là trạng thái BÌNH THƯỜNG, không phải lỗi
  }
}

/** Nội dung HIỆN TẠI của dự án này đã được duyệt chưa. */
export async function daDuyet(tenKho: string, goc: string | null, gt: unknown): Promise<boolean> {
  if (!goc) return false;
  // Cấu hình RỖNG thì không có gì để duyệt — và trả `true` ở đây sẽ biến "chưa
  // có file" thành "đã duyệt sẵn" ngay khi file xuất hiện.
  if (!gt || (typeof gt === 'object' && Object.keys(gt as object).length === 0)) return false;
  return (await doc(tenKho))[goc]?.vt === vanTay(gt);
}

/** Ghi nhận đã duyệt nội dung hiện tại. `false` = không ghi được. */
export async function ghiDuyet(tenKho: string, goc: string | null, gt: unknown): Promise<boolean> {
  if (!goc) return false;
  if (!gt || (typeof gt === 'object' && Object.keys(gt as object).length === 0)) return false;
  try {
    const kho = await doc(tenKho);
    kho[goc] = { vt: vanTay(gt), luc: Date.now() };
    const ten = Object.keys(kho);
    if (ten.length > MAX_DU_AN) {
      const giu = ten.sort((a, b) => (kho[b]!.luc ?? 0) - (kho[a]!.luc ?? 0)).slice(0, MAX_DU_AN);
      for (const t of ten) if (!giu.includes(t)) delete kho[t];
    }
    /* Ghi file tạm rồi `rename`: mất điện giữa `writeFile` để lại JSON cụt, và
       lần mở sau `JSON.parse` ném ⇒ mọi dự án mất trạng thái duyệt cùng lúc. */
    const p = duong(tenKho);
    await fs.writeFile(`${p}.tam`, JSON.stringify(kho, null, 2), 'utf8');
    await fs.rename(`${p}.tam`, p);
    return true;
  } catch {
    return false;
  }
}

/** Thu hồi duyệt của một dự án. */
export async function boDuyet(tenKho: string, goc: string | null): Promise<boolean> {
  if (!goc) return false;
  try {
    const kho = await doc(tenKho);
    if (!(goc in kho)) return false;
    delete kho[goc];
    const p = duong(tenKho);
    await fs.writeFile(`${p}.tam`, JSON.stringify(kho, null, 2), 'utf8');
    await fs.rename(`${p}.tam`, p);
    return true;
  } catch {
    return false;
  }
}
