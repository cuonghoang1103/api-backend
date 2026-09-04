/**
 * ============================================================
 * TÌM FILE NHANH — cho gợi ý `@` trong ô soạn
 * ============================================================
 *
 * Người dùng gõ `@` rồi vài ký tự, danh sách file khớp hiện ra để chọn. Không
 * có nó thì muốn nhắc tới một file phải gõ tay cả đường dẫn, hoặc tả bằng lời
 * rồi để agent tự đi tìm — mà đi tìm là một lời gọi tool, tức một vòng nữa của
 * cả hội thoại, trả tiền cho toàn bộ lịch sử. Chỉ ra đúng file thì rẻ hơn hẳn.
 *
 * ─── Vì sao có nhớ đệm ───
 * Quét cả cây ở MỖI phím gõ là điều duy nhất chắc chắn làm nó giật trên kho
 * lớn. Danh sách file được quét một lần rồi giữ `TTL_MS`; trong khoảng đó mọi
 * phím gõ chỉ lọc trên mảng đã có, không đụng đĩa.
 *
 * Cái giá: file vừa tạo có thể chưa xuất hiện ngay trong vài giây. Đổi lại là
 * gõ không giật — và một danh sách chậm vài giây vẫn dùng được, còn một ô soạn
 * giật thì không.
 */
import { promises as fs, type Dirent } from 'node:fs';
import path from 'node:path';
import { fileBiCam, thuMucBiCam } from './jail';

/** Giữ danh sách bao lâu trước khi quét lại. */
const TTL_MS = 10_000;
/**
 * Trần số file quét. Kho khổng lồ (node_modules đã bị loại, nhưng monorepo vẫn
 * có thể rất lớn) phải trả lời NHANH và không đầy bộ nhớ; thà thiếu vài file ở
 * đuôi còn hơn treo ô soạn.
 */
const MAX_QUET = 20_000;
/** Bao nhiêu gợi ý trả về. Nhiều hơn số này thì người dùng gõ thêm chữ, không cuộn. */
const MAX_TRA = 40;

interface Dem { luc: number; file: Array<{ duong: string; ten: string; moi: number }> }
const dem = new Map<string, Dem>();

async function quet(goc: string): Promise<Dem['file']> {
  const ra: Dem['file'] = [];
  const di = async (thuMuc: string): Promise<void> => {
    if (ra.length >= MAX_QUET) return;
    let muc: Dirent[];
    try {
      muc = await fs.readdir(thuMuc, { withFileTypes: true });
    } catch {
      return; // thư mục không đọc được thì bỏ qua, đừng làm hỏng cả lần quét
    }
    for (const m of muc) {
      if (ra.length >= MAX_QUET) return;
      const p = path.join(thuMuc, m.name);
      if (m.isDirectory()) {
        if (!thuMucBiCam(m.name)) await di(p);
        continue;
      }
      if (fileBiCam(m.name)) continue;
      const st = await fs.stat(p).catch(() => null);
      ra.push({
        duong: path.relative(goc, p).split(path.sep).join('/'),
        ten: m.name,
        moi: st?.mtimeMs ?? 0,
      });
    }
  };
  await di(goc);
  return ra;
}

async function danhSach(goc: string): Promise<Dem['file']> {
  const co = dem.get(goc);
  if (co && Date.now() - co.luc < TTL_MS) return co.file;
  const file = await quet(goc);
  dem.set(goc, { luc: Date.now(), file });
  return file;
}

/** Xoá nhớ đệm của một gốc — gọi khi người dùng đổi thư mục dự án. */
export function quenDemFile(goc?: string): void {
  if (goc === undefined) dem.clear();
  else dem.delete(goc);
}

/**
 * Điểm khớp, càng CAO càng hợp. `-1` = không khớp.
 *
 * Thứ tự ưu tiên có chủ đích, vì nó quyết định thứ người dùng thấy ở dòng đầu:
 * tên file khớp từ đầu > tên file có chứa > cả đường dẫn có chứa. Gõ `agent`
 * mà dòng đầu là `src/x/y/z/agentic-helper-old.ts` trong khi có `agent.ts` thì
 * danh sách coi như vô dụng — người dùng sẽ thôi dùng `@`.
 */
export function diem(f: { duong: string; ten: string }, tim: string): number {
  const t = tim.toLowerCase();
  const ten = f.ten.toLowerCase();
  const duong = f.duong.toLowerCase();
  if (ten === t) return 100;
  if (ten.startsWith(t)) return 80 - Math.min(ten.length - t.length, 20);
  const iTen = ten.indexOf(t);
  if (iTen >= 0) return 55 - Math.min(iTen, 20);
  const iDuong = duong.indexOf(t);
  if (iDuong >= 0) return 30 - Math.min(Math.floor(iDuong / 4), 20);
  return -1;
}

export async function timFileGoiY(goc: string, tim: string): Promise<string[]> {
  const file = await danhSach(goc);
  const t = tim.trim();

  // Chuỗi tìm RỖNG (vừa gõ `@`) ⇒ chưa lọc được gì, đưa file sửa gần nhất. Đó
  // gần như luôn là file đang làm dở — thứ hay được nhắc tới nhất.
  if (t === '') {
    return [...file].sort((a, b) => b.moi - a.moi).slice(0, MAX_TRA).map((f) => f.duong);
  }

  return file
    .map((f) => ({ f, d: diem(f, t) }))
    .filter((x) => x.d >= 0)
    /* Cùng điểm thì file MỚI SỬA đứng trước — hai file trùng tên ở hai module
       thì cái đang làm dở gần như luôn là cái muốn nhắc tới. */
    .sort((a, b) => (b.d - a.d) || (b.f.moi - a.f.moi))
    .slice(0, MAX_TRA)
    .map((x) => x.f.duong);
}
