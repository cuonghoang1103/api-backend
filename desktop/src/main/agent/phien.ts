/**
 * ============================================================
 * LƯU PHIÊN — mở app lại vẫn còn việc đang làm dở
 * ============================================================
 *
 * Trước file này, đóng app là mất sạch hội thoại. Với một việc 20 bước đã tốn
 * tiền thật (đo được: ~262k token ≈ 0,34 $) thì mất như thế không phải bất
 * tiện — là mất tiền.
 *
 * ─── LƯU BẢN GIAO THỨC, DỰNG LẠI BẢN HIỂN THỊ ───
 *
 * Hội thoại có HAI hình dạng: bản giao thức (`tool_calls`, `tool_call_id` —
 * thứ cổng cần) sống ở main, và bản hiển thị (bong bóng chữ, dòng công cụ,
 * thẻ duyệt) sống ở renderer. Lưu cả hai nghĩa là hai kho phải giữ đồng bộ, và
 * hai kho thì sẽ có ngày lệch nhau — mà lệch ở đây nghĩa là màn hình kể một
 * câu chuyện khác với thứ agent thật sự nhớ.
 *
 * Nên chỉ lưu bản GIAO THỨC (nó là bản đầy đủ hơn: kết quả tool nằm nguyên
 * trong đó), rồi dựng lại bản hiển thị khi mở. Bản dựng lại không giống hệt
 * bản gốc — mất diff của thẻ duyệt, mất mấy chữ tóm tắt — nhưng nó ĐÚNG, và nó
 * không thể lệch với thứ agent nhớ vì cả hai được sinh ra từ cùng một nguồn.
 *
 * ─── NƠI LƯU ───
 * `userData/agent-phien/*.json`. KHÔNG mã hoá: nội dung là mã nguồn của chính
 * người dùng, cùng hạng tin cậy với thư mục ghi chú của họ. Nhưng nó KHÔNG
 * phải chỗ chứa bí mật — agent không đọc `.env` (xem `jail.ts`), và người dùng
 * cần biết là hội thoại có nằm trên đĩa.
 */
import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface TinNhanLuu {
  role: 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface TomTatPhien {
  id: string;
  /** Câu hỏi đầu tiên, cắt ngắn — nhãn duy nhất người dùng nhận ra phiên bằng. */
  tieuDe: string;
  /** Tên thư mục dự án lúc đó. */
  duAn: string | null;
  luucLuc: number;
  soTinNhan: number;
}

interface FilePhien extends TomTatPhien {
  hoiThoai: TinNhanLuu[];
}

/** Giữ tối đa ngần này phiên. Cũ nhất bị xoá trước. */
const MAX_PHIEN = 50;
const MAX_TIEU_DE = 90;

function thuMuc(): string {
  return path.join(app.getPath('userData'), 'agent-phien');
}

function duongDan(id: string): string {
  // `id` do chính main sinh ra, nhưng vẫn lọc: một file `../../x.json` ghi ra
  // ngoài userData là chuyện không được phép xảy ra dù đường đi tới đó là gì.
  return path.join(thuMuc(), `${id.replace(/[^a-zA-Z0-9_-]/g, '')}.json`);
}

/** Tiêu đề lấy từ câu hỏi ĐẦU TIÊN — thứ người dùng nhớ về việc đó. */
function datTieuDe(hoiThoai: TinNhanLuu[]): string {
  const dau = hoiThoai.find((m) => m.role === 'user' && typeof m.content === 'string');
  const tho = (dau?.content ?? '').trim().replace(/\s+/g, ' ');
  if (!tho) return 'Việc chưa đặt tên';
  return tho.length > MAX_TIEU_DE ? `${tho.slice(0, MAX_TIEU_DE)}…` : tho;
}

/**
 * Ghi phiên xuống đĩa. Trả về tóm tắt vừa ghi.
 *
 * Ghi qua file tạm rồi đổi tên: app bị tắt giữa chừng thì file cũ vẫn nguyên
 * vẹn, thay vì thành một mẩu JSON cụt không đọc lại được. Cùng cách mà
 * `main/store.ts` đang dùng cho file cấu hình.
 */
export async function luuPhien(
  id: string,
  hoiThoai: TinNhanLuu[],
  duAn: string | null,
): Promise<TomTatPhien | null> {
  // Hội thoại chưa có câu hỏi nào của người dùng thì không có gì để lưu — và
  // một danh sách đầy phiên rỗng làm cái danh sách thành vô dụng.
  if (!hoiThoai.some((m) => m.role === 'user')) return null;

  const tom: TomTatPhien = {
    id,
    tieuDe: datTieuDe(hoiThoai),
    duAn,
    luucLuc: Date.now(),
    soTinNhan: hoiThoai.length,
  };
  const noi: FilePhien = { ...tom, hoiThoai };

  await fs.mkdir(thuMuc(), { recursive: true });
  const dich = duongDan(id);
  const tam = `${dich}.tmp`;
  await fs.writeFile(tam, JSON.stringify(noi), 'utf8');
  await fs.rename(tam, dich);

  void donBot();
  return tom;
}

/** Danh sách phiên, mới nhất trước. Hỏng một file không làm hỏng cả danh sách. */
export async function danhSachPhien(): Promise<TomTatPhien[]> {
  let ten: string[];
  try {
    ten = await fs.readdir(thuMuc());
  } catch {
    return []; // chưa có phiên nào — không phải lỗi
  }

  const ra: TomTatPhien[] = [];
  for (const t of ten) {
    if (!t.endsWith('.json')) continue;
    try {
      const j = JSON.parse(await fs.readFile(path.join(thuMuc(), t), 'utf8')) as Partial<FilePhien>;
      if (typeof j.id === 'string' && typeof j.tieuDe === 'string') {
        ra.push({
          id: j.id,
          tieuDe: j.tieuDe,
          duAn: j.duAn ?? null,
          luucLuc: j.luucLuc ?? 0,
          soTinNhan: j.soTinNhan ?? 0,
        });
      }
    } catch {
      // Một file hỏng (đĩa đầy lúc ghi, app bị kill) KHÔNG được làm mất cả danh
      // sách. Bỏ qua nó; người dùng vẫn mở được 49 phiên còn lại.
      continue;
    }
  }
  return ra.sort((a, b) => b.luucLuc - a.luucLuc);
}

export async function docPhien(id: string): Promise<FilePhien | null> {
  try {
    const j = JSON.parse(await fs.readFile(duongDan(id), 'utf8')) as Partial<FilePhien>;
    if (!Array.isArray(j.hoiThoai)) return null;
    return {
      id: String(j.id ?? id),
      tieuDe: String(j.tieuDe ?? ''),
      duAn: j.duAn ?? null,
      luucLuc: j.luucLuc ?? 0,
      soTinNhan: j.soTinNhan ?? j.hoiThoai.length,
      hoiThoai: j.hoiThoai as TinNhanLuu[],
    };
  } catch {
    return null;
  }
}

export async function xoaPhien(id: string): Promise<void> {
  await fs.rm(duongDan(id), { force: true });
}

/** Xoá phiên cũ nhất khi vượt trần. Lỗi ở đây KHÔNG được làm hỏng việc lưu. */
async function donBot(): Promise<void> {
  try {
    const ds = await danhSachPhien();
    for (const p of ds.slice(MAX_PHIEN)) await xoaPhien(p.id);
  } catch {
    /* dọn dẹp hỏng thì thôi — không đáng để mất một phiên vừa lưu */
  }
}

// ─── Dựng lại bản hiển thị từ bản giao thức ────────────────────────

export type MucKhoiPhuc =
  | { kieu: 'nguoi'; text: string }
  | { kieu: 'may'; text: string }
  | { kieu: 'tool'; ten: string; tomTat: string };

/**
 * Bản giao thức → bản hiển thị.
 *
 * Không dựng lại được thẻ duyệt kèm diff (diff không nằm trong bản giao thức,
 * và dựng lại nó nghĩa là đọc lại file — mà file có thể đã đổi từ lâu). Thay
 * vào đó hiện một dòng công cụ nói rõ đã làm gì. Đó là sự thật; một cái thẻ
 * duyệt dựng lại với diff tính theo nội dung HÔM NAY thì không.
 */
export function dungLaiHienThi(hoiThoai: TinNhanLuu[]): MucKhoiPhuc[] {
  const ra: MucKhoiPhuc[] = [];
  // Tra kết quả theo `tool_call_id` để dòng công cụ nói được nó ra sao, thay vì
  // chỉ nói nó đã được gọi.
  const ketQua = new Map<string, string>();
  for (const m of hoiThoai) {
    if (m.role === 'tool' && m.tool_call_id) ketQua.set(m.tool_call_id, String(m.content ?? ''));
  }

  for (const m of hoiThoai) {
    if (m.role === 'user') {
      ra.push({ kieu: 'nguoi', text: String(m.content ?? '') });
    } else if (m.role === 'assistant') {
      const chu = String(m.content ?? '').trim();
      if (chu) ra.push({ kieu: 'may', text: chu });
      for (const c of m.tool_calls ?? []) {
        ra.push({ kieu: 'tool', ten: c.function.name, tomTat: tomTatKetQua(ketQua.get(c.id) ?? '') });
      }
    }
    // `role:'tool'` đã được gộp vào dòng công cụ ở trên — hiện riêng thì bảng
    // ghi đầy những khối chữ thô mà người dùng chưa từng nhìn thấy lúc chạy.
  }
  return ra;
}

/** Một dòng tóm tắt kết quả tool, cho bảng ghi khôi phục. */
function tomTatKetQua(noi: string): string {
  if (!noi) return '';
  if (noi.startsWith('LỖI')) return 'lỗi';
  if (/NGƯỜI DÙNG TỪ CHỐI/.test(noi)) return 'bị từ chối';
  const soDong = noi.split('\n').length;
  const dauTien = noi.split('\n')[0]?.trim() ?? '';
  // Kết quả một dòng thì chính nó là tóm tắt tốt nhất.
  return soDong <= 2 && dauTien.length <= 60 ? dauTien : `${soDong} dòng`;
}
