/**
 * ============================================================
 * XIN QUYỀN THƯ MỤC NGOÀI DỰ ÁN — tool `xin_quyen_thu_muc` (28/10/2026)
 * ============================================================
 *
 * Chủ app 28/10/2026: mở thư mục SportShop gốc trong VS Code, nhưng repo thật (test + báo cáo) nằm ở
 * ~/Documents/SWT301-SportShop. CuongMini từ chối đọc qua shell (đúng) rồi bắt người dùng KÉO thư mục vào khung chat
 * bằng tay (sai chỗ — extension "không làm được à?"). Nay model GỌI TOOL này; người dùng thấy một thẻ quyền ngay tại chỗ:
 *
 *   "CuongMini muốn ĐỌC thư mục ~/Documents/SWT301-SportShop — lý do: …  [Cho phép đọc] [Cho phép đọc + sửa] [Không]"
 *
 * Luật:
 *   • Cấp qua ĐÚNG đường của kéo-thả / `/add-dir` (`capQuyenDocNgoai`) ⇒ cùng danh sách chặn (.env, khoá, .ssh), cùng
 *     chốt symlink (thư mục được cấp = `realpath`), cùng luật "không cấp /, $HOME hay tổ tiên của nó". Chỉ sống trong
 *     lần chạy này (bộ nhớ tiến trình), theo dự án.
 *   • MẶC ĐỊNH CHỈ ĐỌC. "Đọc + sửa" chỉ khi người dùng bấm đúng nút đó (`choPhepCaFile`), và mỗi lần sửa vẫn có thẻ
 *     duyệt riêng (luôn hỏi). Phiên không bật quyền sửa ⇒ thẻ chỉ có "Cho phép đọc".
 *   • KHÔNG BAO GIỜ tự duyệt: `luonHoi` ⇒ bỏ qua chế độ tự sửa / "Bỏ qua hết" / sổ nhớ / quyền lâu dài.
 */
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { kiemDuongDanNgoai } from './ghiNgoai';
import { capQuyenDocNgoai, capQuyenGhiNgoai, dsThuMucDocNgoai, dsThuMucGhiNgoai, lyDoKhongCapNgoai } from './jail';
import { hoiNguoiDung, type YeuCauXinPhep } from './xinPhep';
import type { SoCuoc } from './so';

export interface BoiCanhThuMuc {
  so: SoCuoc;
  signal: AbortSignal;
  /** Phiên có bật quyền sửa file không — không bật thì thẻ chỉ có "Cho phép đọc". */
  choGhi: boolean;
  /** Đẩy thẻ quyền lên giao diện (sự kiện `xinPhepGit`, viec `thuMuc` | `thuMucDoc`). */
  phat: (y: YeuCauXinPhep & { viec: 'thuMuc' | 'thuMucDoc'; chiTiet: string }) => void;
}

const rutGon = (p: string): string => {
  const nha = os.homedir();
  return p === nha ? '~' : p.startsWith(nha + path.sep) ? `~${p.slice(nha.length)}` : p;
};

/** `~/x` ⇒ tuyệt đối; tương đối ⇒ `null` (bắt model đưa đường rõ ràng, người duyệt đọc được đúng chỗ). */
export function moRongDuong(tho: string): string | null {
  const s = String(tho ?? '').trim().replace(/^["']|["']$/g, '');
  if (!s) return null;
  if (s === '~') return os.homedir();
  if (s.startsWith('~/') || s.startsWith('~\\')) return path.join(os.homedir(), s.slice(2));
  return path.isAbsolute(s) ? path.resolve(s) : null;
}

export async function xinQuyenThuMuc(goc: string, args: Record<string, unknown>, b: BoiCanhThuMuc): Promise<{ noiDung: string; tomTat: string }> {
  const tho = typeof args.path === 'string' ? args.path : '';
  const lyDo = (typeof args.ly_do === 'string' ? args.ly_do : '').trim().replace(/\s+/g, ' ').slice(0, 240);
  const muonGhi = args.quyen === 'ghi';
  const duong = moRongDuong(tho);
  if (!duong) return { noiDung: 'LỖI: "path" phải là đường dẫn TUYỆT ĐỐI (hoặc bắt đầu bằng ~/) tới THƯ MỤC cần đọc.', tomTat: 'đường dẫn sai' };
  if (!lyDo) return { noiDung: 'LỖI: thiếu "ly_do" — một câu nói vì sao cần thư mục này (người dùng đọc nó trên thẻ).', tomTat: 'thiếu lý do' };

  // Symlink: cấp cho ĐÍCH THẬT, và kiểm luật trên cả đường gõ lẫn đích (một liên kết vô hại trỏ vào ~ vẫn bị chặn).
  const that = await fs.realpath(duong).catch(() => null);
  if (!that) return { noiDung: `LỖI: không có thư mục "${duong}". Kiểm lại đường (đúng hoa/thường, đúng ổ đĩa).`, tomTat: 'không có' };
  const st = await fs.stat(that).catch(() => null);
  if (!st?.isDirectory()) return { noiDung: `LỖI: "${duong}" không phải thư mục — xin quyền cho THƯ MỤC chứa nó.`, tomTat: 'không phải thư mục' };
  const ly = lyDoKhongCapNgoai(duong) ?? lyDoKhongCapNgoai(that);
  if (ly) return { noiDung: `KHÔNG xin được: ${ly} Hãy xin đúng thư mục con cần đọc.`, tomTat: 'quá rộng / bị chặn' };
  const relDuAn = path.relative(path.resolve(goc), that);
  if (!relDuAn.startsWith('..') && !path.isAbsolute(relDuAn)) {
    return { noiDung: `"${duong}" nằm TRONG dự án đang mở — đọc bằng đường TƯƠNG ĐỐI "${relDuAn || '.'}", không cần xin quyền.`, tomTat: 'đã trong dự án' };
  }

  const daDoc = dsThuMucDocNgoai(goc).includes(that);
  const daGhi = dsThuMucGhiNgoai(goc).includes(that);
  if (daGhi || (daDoc && !muonGhi)) {
    return { noiDung: `Thư mục ${that} ĐÃ được cấp ${daGhi ? 'đọc + sửa' : 'đọc'} trong phiên này — dùng đường tuyệt đối với list_dir / read_file / grep / glob${daGhi ? ' (và edit_file / create_file)' : ''}.`, tomTat: 'đã có quyền' };
  }
  // Cho sửa được không: phiên bật quyền sửa + thư mục không thuộc vùng "ghi vào là chiếm máy" (`ghiNgoai.ts`).
  let choGhi = b.choGhi;
  if (choGhi) { try { kiemDuongDanNgoai(path.join(that, 'x')); } catch { choGhi = false; } }

  const hien = rutGon(that);
  const chiTiet = [
    /* Tên thư mục ở dòng ĐẦU, đường đầy đủ dòng riêng: thẻ hẹp (CLI) cắt đuôi dòng dài ⇒ không bao giờ mất đúng cái tên cần thấy. */
    `CuongMini muốn ${muonGhi && choGhi ? 'ĐỌC + SỬA' : 'ĐỌC'} thư mục "${path.basename(that)}"`,
    `Đường dẫn: ${hien}`,
    `Lý do: ${lyDo}`,
    '',
    choGhi
      ? '• Cho phép đọc — xem, tìm, đọc file (không sửa).\n• Cho phép đọc + sửa — thêm sửa/tạo file ở đó; MỖI lần sửa vẫn hỏi bạn.'
      : '• Cho phép đọc — xem, tìm, đọc file (không sửa).',
    'File bí mật (.env, khoá, .ssh…) vẫn bị chặn. Quyền chỉ sống trong phiên này.',
  ].join('\n');
  const q = await hoiNguoiDung(
    { ten: 'xin_quyen_thu_muc', duongDan: hien, khoa: `thu-muc:${that}:${Date.now()}`, choNho: false, luonHoi: true },
    (y) => b.phat({ ...y, viec: choGhi ? 'thuMuc' : 'thuMucDoc', chiTiet }),
    b.signal,
    b.so,
  );
  if (q === 'tuChoi') {
    return {
      noiDung: `NGƯỜI DÙNG KHÔNG CHO truy cập ${hien}. Đừng đọc nó bằng cách khác (shell, run_command, đường vòng). `
        + 'Hỏi người dùng muốn làm thế nào (mở đúng thư mục làm dự án, hoặc dán nội dung cần xem).',
      tomTat: '✗ không cho',
    };
  }
  const ghi = choGhi && q === 'choPhepCaFile';
  try {
    if (ghi) capQuyenGhiNgoai(goc, that); else capQuyenDocNgoai(goc, that);
  } catch (e) {
    return { noiDung: `KHÔNG cấp được: ${(e as Error).message}`, tomTat: 'không cấp được' };
  }
  return {
    noiDung: `Người dùng đã cho phép ${ghi ? 'ĐỌC + SỬA' : 'ĐỌC'} thư mục ${that} (chỉ trong phiên này). `
      + `Dùng ĐƯỜNG TUYỆT ĐỐI trong thư mục đó với list_dir / read_file / grep / glob${ghi ? '; sửa/tạo bằng edit_file / create_file với đường tuyệt đối — mỗi lần sửa người dùng vẫn duyệt' : ' (CHỈ ĐỌC — cần sửa thì xin lại với quyen="ghi")'}. `
      + 'File bí mật (.env, khoá…) vẫn bị chặn.',
    tomTat: ghi ? `✓ đọc + sửa ${hien}` : `✓ đọc ${hien}`,
  };
}
