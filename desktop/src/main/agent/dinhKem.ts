/**
 * ============================================================
 * ĐÍNH KÈM CỦA AI CODE — file từ máy, đặt vào ĐĨA cho agent tự đọc
 * ============================================================
 *
 * ─── VÌ SAO QUA ĐĨA CHỨ KHÔNG GỬI THẲNG LÊN CỔNG ───
 *
 * Đường gửi của agent (`agent:send`) chỉ nhận `anh`: tối đa 3 ảnh, mỗi ảnh
 * 4MB. Một file log 20MB, một cái zip, một bản PDF đặc tả — không thứ nào lọt
 * qua cái cửa đó, và nới nó ra nghĩa là nhồi cả file vào MỖI lượt gọi cổng
 * (hội thoại được gửi lại trọn vẹn mỗi bước) — trả tiền cho cùng một file
 * hàng chục lần.
 *
 * Agent thì đã có `read_file`, `list_dir`, `grep` chạy ngay trên máy người
 * dùng. Nên cách rẻ hơn và mạnh hơn: **đặt file vào trong dự án, đưa agent
 * đường dẫn**. Nó tự đọc phần nó cần, đọc bao nhiêu lần cũng được, và không
 * byte nào rời khỏi máy trừ phần nó thật sự trích ra.
 *
 * ⚠️ Ảnh NHỎ vẫn gửi thẳng (renderer lo), vì bắt agent gọi thêm một lượt tool
 * chỉ để nhìn cái ảnh vừa dán là chậm hơn và đắt hơn.
 *
 * ─── NƠI ĐẶT, VÀ VÌ SAO NÓ PHẢI NẰM TRONG DỰ ÁN ───
 *
 * `<gốc dự án>/.cuongthai/dinh-kem/`. Phải nằm TRONG gốc vì `moTrongNguc()`
 * từ chối mọi đường dẫn ngoài đó — đấy là cả điểm của cái ngục, và nới nó ra
 * cho một thư mục tạm là mở đúng lớp đang bảo vệ `.env` của người dùng.
 *
 * Đổi lại, file lạ xuất hiện trong kho của họ. Nên ghi thêm một dòng vào
 * `.git/info/exclude` — chỗ bỏ qua RIÊNG của bản sao này, không phải
 * `.gitignore` được commit. Người dùng không thấy nó trong `git status`, và
 * kho chung của nhóm không bị thêm một dòng họ chẳng liên quan.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Trần một file. Lớn hơn nữa thì gần như chắc chắn là gửi nhầm (một thư mục
 * nén, một bản dựng), và ghi 200MB vào kho của người dùng vì một cú kéo-thả
 * nhỡ tay là thứ không nên làm được.
 */
export const TRAN_BYTE_DINH_KEM = 25 * 1024 * 1024;

const THU_MUC = path.join('.cuongthai', 'dinh-kem');

/**
 * Tên file an toàn.
 *
 * ⚠️ `path.basename` TRƯỚC, lọc ký tự SAU. Làm ngược lại thì `..%2f..` sau khi
 * lọc dấu gạch vẫn còn `....` và vẫn trèo lên được. Và tên do người dùng chọn
 * từ hộp thoại hệ thống thì lành, nhưng hàm này cũng nhận tên từ CLIPBOARD và
 * từ kéo-thả — hai chỗ mà nội dung đến từ nơi khác.
 */
export function tenAnToan(tho: string): string {
  const goc = path.basename(String(tho ?? '').trim());
  const sach = goc
    // Ký tự điều khiển + mọi thứ ngoài bộ an toàn → '-'. Giữ chữ có dấu tiếng
    // Việt (người dùng đặt tên file bằng tiếng Việt), nhưng bỏ nháy, `$`, `;`,
    // khoảng trắng… — đường dẫn này có thể đi vào một chuỗi lệnh shell.
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/^[.-]+/, '')        // không cho file ẩn, và chặn luôn '..'
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
    .replace(/[.-]+$/, '');
  return sach || 'tep-dinh-kem';
}

/**
 * Ghi một dòng vào `.git/info/exclude` nếu chưa có.
 *
 * Hỏng thì IM LẶNG: không phải kho git, không quyền ghi, `.git` là file (kho
 * dạng worktree) — không lý do nào trong số đó đáng để hỏng việc đính kèm.
 */
async function boQuaTrongGit(goc: string): Promise<void> {
  try {
    const f = path.join(goc, '.git', 'info', 'exclude');
    const cu = await fs.readFile(f, 'utf8').catch(() => '');
    if (cu.includes('.cuongthai/')) return;
    const them = `${cu.endsWith('\n') || cu === '' ? '' : '\n'}\n# đính kèm của AI Code trong app CuongThai\n.cuongthai/\n`;
    await fs.appendFile(f, them, 'utf8');
  } catch {
    /* không phải kho git, hoặc không ghi được — kệ */
  }
}

export interface KetQuaDinhKem {
  /** Đường dẫn TƯƠNG ĐỐI so với gốc dự án — thứ đưa cho agent. */
  tuongDoi: string;
  byte: number;
}

/**
 * Đặt một file vào thư mục đính kèm của dự án.
 *
 * `duLieuBase64` là nội dung thô đã mã hoá base64 (renderer đọc bằng
 * `FileReader`). Không nhận `File` hay `Uint8Array`: kênh IPC kiểm bằng zod và
 * một mảng byte đi qua `structuredClone` là chỗ hai phía dễ lệch nhau — cùng
 * lý do `robot:noi` cũng gửi chuỗi base64.
 */
export async function datDinhKem(
  goc: string,
  ten: string,
  duLieuBase64: string,
): Promise<KetQuaDinhKem> {
  const byte = Buffer.from(duLieuBase64, 'base64');
  if (byte.byteLength === 0) throw new Error('File rỗng.');
  if (byte.byteLength > TRAN_BYTE_DINH_KEM) {
    throw new Error(`File ${(byte.byteLength / 1048576).toFixed(1)}MB, quá trần ${TRAN_BYTE_DINH_KEM / 1048576}MB.`);
  }

  const thuMuc = path.join(goc, THU_MUC);
  await fs.mkdir(thuMuc, { recursive: true });

  /*
   * Trùng tên thì thêm hậu tố, KHÔNG ghi đè. Người dùng gửi `log.txt` hai lần
   * cách nhau mười phút là hai file khác nhau, và ghi đè cái trước nghĩa là
   * câu hỏi cũ trong hội thoại bỗng trỏ vào nội dung mới — agent đọc lại sẽ
   * trả lời về thứ khác hẳn với thứ nó đã trả lời lúc đầu.
   */
  const sach = tenAnToan(ten);
  const duoi = path.extname(sach);
  const than = sach.slice(0, sach.length - duoi.length) || 'tep';
  let cuoi = sach;
  for (let i = 1; i < 200; i += 1) {
    try {
      await fs.access(path.join(thuMuc, cuoi));
      cuoi = `${than}-${i}${duoi}`;
    } catch {
      break;                      // chưa tồn tại — dùng tên này
    }
  }

  await fs.writeFile(path.join(thuMuc, cuoi), byte);
  void boQuaTrongGit(goc);

  return { tuongDoi: path.join(THU_MUC, cuoi), byte: byte.byteLength };
}

/**
 * Đính kèm từ ĐƯỜNG DẪN THẬT trên đĩa (kéo-thả từ Finder / Explorer).
 *
 * ─── Vì sao có hàm này bên cạnh `datDinhKem` ───
 * `datDinhKem` nhận base64: renderer phải đọc trọn file bằng `FileReader`,
 * mã hoá base64 (phình 33%), rồi đẩy qua IPC. Một file 20MB thành ~27MB chuỗi
 * đi qua ranh giới tiến trình — và trong lúc đó luồng giao diện đứng hình.
 * Kéo-thả thì Electron cho biết ĐƯỜNG DẪN THẬT (`webUtils.getPathForFile`),
 * nên main đọc thẳng từ đĩa: không đọc lại, không mã hoá, không truyền.
 *
 * ─── Và nó làm được hai việc mà đường base64 không làm được ───
 *
 * 1. **File đã nằm SẴN trong dự án thì KHÔNG chép.** Kéo `src/index.ts` từ
 *    Finder vào khung chat, bản cũ tạo một bản sao trong `.cuongthai/dinh-kem/`
 *    rồi đưa agent đường dẫn tới BẢN SAO. Agent sửa bản sao đó, người dùng
 *    không thấy gì đổi trong dự án, và không ai hiểu tại sao. Ở đây: thấy nó
 *    đã trong ngục thì trả về đúng đường tương đối của chính nó.
 *
 * 2. **Thư mục.** `FileReader` ném lỗi khi gặp thư mục, nên kéo một thư mục
 *    vào là thất bại CÂM — đúng thứ người dùng báo 20/08/2026. Mà thư mục lại
 *    là thứ hữu ích nhất để đưa cho agent: nó có `list_dir` và `grep`.
 */
export interface KetQuaDuongDan {
  /** Đường tương đối tính từ gốc dự án — thứ chèn vào câu hỏi cho agent. */
  tuongDoi: string;
  byte: number;
  laThuMuc: boolean;
  /** `true` khi file vốn đã nằm trong dự án, không phải bản chép. */
  coSan: boolean;
}

export async function datDinhKemTuDuong(goc: string, duong: string): Promise<KetQuaDuongDan> {
  const that = path.resolve(duong);
  const gocThat = path.resolve(goc);

  const tt = await fs.stat(that);

  /* Đã ở trong dự án ⇒ chỉ trỏ vào, không chép.
     So bằng `relative` chứ không `startsWith`: `/a/duan-cu` cũng `startsWith`
     `/a/duan`, và một cú so chuỗi cẩu thả ở đây nghĩa là file NGOÀI dự án bị
     coi là trong, rồi đưa cho agent một đường dẫn mà cái ngục sẽ từ chối. */
  const rel = path.relative(gocThat, that);
  const trongDuAn = rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
  if (trongDuAn) {
    return { tuongDoi: rel, byte: tt.isDirectory() ? 0 : tt.size, laThuMuc: tt.isDirectory(), coSan: true };
  }

  /* Thư mục NGOÀI dự án: không chép (một cú kéo nhỡ tay có thể là 2GB
     node_modules). Nói thẳng ra để người dùng tự chọn cách khác. */
  if (tt.isDirectory()) {
    throw new Error(
      'Thư mục này nằm ngoài dự án. Agent chỉ đọc được trong thư mục dự án — '
      + 'hãy mở nó bằng nút chọn thư mục, hoặc kéo một thư mục nằm trong dự án.',
    );
  }

  if (tt.size === 0) throw new Error('File rỗng.');
  if (tt.size > TRAN_BYTE_DINH_KEM) {
    throw new Error(`File ${(tt.size / 1048576).toFixed(1)}MB, quá trần ${TRAN_BYTE_DINH_KEM / 1048576}MB.`);
  }

  const thuMuc = path.join(gocThat, THU_MUC);
  await fs.mkdir(thuMuc, { recursive: true });

  const sach = tenAnToan(path.basename(that));
  const duoi = path.extname(sach);
  const than = sach.slice(0, sach.length - duoi.length) || 'tep';
  let cuoi = sach;
  for (let i = 1; i < 200; i += 1) {
    try {
      await fs.access(path.join(thuMuc, cuoi));
      cuoi = `${than}-${i}${duoi}`;
    } catch {
      break;
    }
  }

  await fs.copyFile(that, path.join(thuMuc, cuoi));
  void boQuaTrongGit(gocThat);

  return { tuongDoi: path.join(THU_MUC, cuoi), byte: tt.size, laThuMuc: false, coSan: false };
}
