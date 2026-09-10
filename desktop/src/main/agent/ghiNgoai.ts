/**
 * ============================================================
 * GHI FILE NGOÀI THƯ MỤC DỰ ÁN — ranh giới, tách riêng để kiểm
 * ============================================================
 *
 * ─── VÌ SAO TOOL NÀY PHẢI TỒN TẠI ───
 * Trước 10/09/2026 agent có đúng hai đường ghi file, và cả hai đều đóng với
 * một tệp nằm ngoài dự án:
 *
 *  • `create_file`/`edit_file` bị nhốt trong gốc dự án (`moTrongNguc`). Đúng,
 *    và không được nới.
 *  • `run_command` thì BỊ CẤM ghi file, cũng đúng: đo 19/08/2026 — PowerShell
 *    ghi mặc định UTF-16 nên đọc lại ra byte rác xen giữa mọi ký tự, và lớp
 *    thoát của shell biến `"` thành `'` làm sai cú pháp. Hai kiểu hỏng ấy nút
 *    Hoàn tác không cứu được, vì nó chỉ theo dõi thay đổi của `edit_file`.
 *
 * Kết quả là một LỖ HỔNG NĂNG LỰC, không phải một chốt an toàn: người dùng
 * nhờ sửa một tệp cấu hình ngoài dự án thì agent không có đường nào và đẩy họ
 * đi mở Notepad gõ tay. Đúng chuyện người dùng báo ngày 10/09/2026.
 *
 * ─── RANH GIỚI, VÀ VÌ SAO NÓ VẪN CHẶT ───
 *  1. Đường dẫn phải TUYỆT ĐỐI — không có `..` mơ hồ, người duyệt đọc được
 *     đúng chỗ sẽ bị ghi.
 *  2. Luôn hiện thẻ duyệt kèm ĐƯỜNG DẪN ĐẦY ĐỦ. Đây là điểm khác `create_file`:
 *     ở trong dự án, thấy `src/a.ts` là đủ; ở ngoài, cái quan trọng nhất chính
 *     là *nó nằm ở đâu*.
 *  3. Danh sách cấm vẫn áp: `.env`, khoá riêng, file mật khẩu. Chúng bị cấm vì
 *     nội dung, và ra khỏi dự án thì lý do ấy KHÔNG yếu đi — nó mạnh lên.
 *  4. Chặn thêm những thư mục mà ghi vào là chiếm máy chứ không còn là sửa cấu
 *     hình: `~/.ssh`, khởi động cùng hệ thống, thư mục hệ điều hành.
 *  5. Ghi bằng Node với UTF-8, không qua shell — nên không dính hai kiểu hỏng
 *     đã đo ở trên.
 */
import path from 'node:path';
import os from 'node:os';

import { fileBiCam } from './jail';

export class LoiGhiNgoai extends Error {}

/**
 * Thư mục mà ghi vào là ĐỔI CÁCH MÁY KHỞI ĐỘNG hoặc lấy được quyền, chứ không
 * còn là sửa một tệp cấu hình.
 *
 * Danh sách này cố ý NGẮN và chỉ nhắm vào thứ chạy tự động. Cấm rộng hơn thì
 * tool thành vô dụng và người dùng quay lại gõ tay — tức là mất cả cái an toàn
 * mà tool này mang lại (nội dung đúng, có thẻ duyệt, có ghi vết).
 */
const CAM_TUYET_DOI: readonly RegExp[] = [
  /* Khoá SSH, khoá GPG: ghi vào đây là cấy quyền đăng nhập. */
  /(^|[\\/])\.ssh([\\/]|$)/i,
  /(^|[\\/])\.gnupg([\\/]|$)/i,
  /* Tự chạy khi đăng nhập — macOS, Windows, Linux. */
  /(^|[\\/])LaunchAgents([\\/]|$)/i,
  /(^|[\\/])LaunchDaemons([\\/]|$)/i,
  /(^|[\\/])Start ?Menu([\\/]|$)/i,
  /(^|[\\/])Startup([\\/]|$)/i,
  /(^|[\\/])systemd([\\/])(system|user)([\\/]|$)/i,
  /* Thư mục của hệ điều hành. */
  /^[\\/](System|usr|bin|sbin|etc|boot|dev|proc|sys)([\\/]|$)/,
  /^[A-Za-z]:[\\/]Windows([\\/]|$)/i,
  /^[A-Za-z]:[\\/]Program Files/i,
];

export interface KetQuaKiem {
  /** Đường dẫn đã chuẩn hoá — dùng cái này để ghi, không dùng chuỗi gốc. */
  duongDan: string;
  /** Rút gọn cho thẻ duyệt: `~/…` thay cho thư mục HOME. */
  hienThi: string;
}

/**
 * Kiểm một đường dẫn tuyệt đối trước khi ghi.
 *
 * Ném `LoiGhiNgoai` với câu nói được LÝ DO — câu này đi thẳng vào hội thoại
 * cho model đọc, nên nó phải đủ để model biết bước tiếp theo là gì thay vì
 * thử lại y hệt.
 */
export function kiemDuongDanNgoai(tho: string): KetQuaKiem {
  const s = String(tho ?? '').trim();
  if (!s) throw new LoiGhiNgoai('Thiếu "path".');

  if (!path.isAbsolute(s)) {
    throw new LoiGhiNgoai(
      'Đường dẫn phải TUYỆT ĐỐI. Đây là tool ghi NGOÀI dự án — trong dự án thì '
      + 'dùng create_file/edit_file với đường dẫn tương đối.',
    );
  }

  /* `normalize` gộp `..` và `.` lại. Kiểm danh sách cấm trên chuỗi CHƯA gộp
     là tự lừa mình: `~/Documents/../.ssh/config` không khớp mẫu `.ssh` nào
     cho tới khi gộp xong. */
  const dich = path.normalize(s);

  const ten = path.basename(dich);
  if (fileBiCam(ten)) {
    throw new LoiGhiNgoai(
      `Không ghi file "${ten}" — đây là loại file chứa khoá hoặc mật khẩu. `
      + 'Ra khỏi thư mục dự án thì lý do cấm mạnh lên chứ không yếu đi. '
      + 'Hãy nói cho người dùng biết bạn không đụng tới nó.',
    );
  }

  for (const re of CAM_TUYET_DOI) {
    if (re.test(dich)) {
      throw new LoiGhiNgoai(
        `Không ghi vào "${dich}" — đây là chỗ chạy tự động hoặc thuộc hệ điều hành, `
        + 'ghi vào đó là đổi cách máy khởi động chứ không còn là sửa cấu hình. '
        + 'Nếu người dùng thật sự cần, hãy đưa họ ĐÚNG MỘT dòng lệnh để tự chạy.',
      );
    }
  }

  const nha = os.homedir();
  const hienThi = nha && dich.startsWith(nha + path.sep)
    ? `~${path.sep}${path.relative(nha, dich)}`
    : dich;

  return { duongDan: dich, hienThi };
}
