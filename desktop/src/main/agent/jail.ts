/**
 * ============================================================
 * NHÀ TÙ ĐƯỜNG DẪN CỦA AGENT
 * ============================================================
 *
 * Mọi tool đọc file đều phải đi qua `moTrongNguc()`. Không có đường vòng.
 *
 * ─── "CHỈ ĐỌC" KHÔNG CÓ NGHĨA LÀ VÔ HẠI ───
 * Bản này không ghi file và không chạy lệnh, nên rất dễ nghĩ nó an toàn. Không
 * phải. Agent đọc `.env` rồi gửi nội dung lên cổng LLM là **bí mật đã rời khỏi
 * máy người dùng** — không sửa một byte nào mà khoá vẫn ra ngoài, và không có
 * cách nào lấy lại. Nguy cơ thật của P1 nằm đúng ở đây, chứ không ở chỗ ghi đè
 * mất file.
 *
 * Nên có HAI lớp, độc lập nhau:
 *
 *   1. NGỤC — đường dẫn phải nằm trong thư mục người dùng tự chọn. Kiểm bằng
 *      `path.resolve` + đối chiếu tiền tố + `realpath` (bắt symlink). Cùng
 *      cách làm đã dùng cho kho ghi chú (`ipc/notes.ts`), vì nó đã đúng.
 *
 *   2. DANH SÁCH CHẶN — kể cả nằm trong ngục, một số file vẫn KHÔNG được đọc.
 *      `.env`, khoá riêng tư, thư mục `.git`. Đây là lớp mà ngục không thay
 *      được: `.env` nằm ngay giữa dự án, hoàn toàn "hợp lệ" theo lớp 1.
 *
 * Prompt hệ thống ở backend cũng dặn model đừng đọc mấy file đó, nhưng prompt
 * là lời khuyên, còn file này là cái khoá. Một câu chữ khéo nhét trong README
 * thuyết phục được model; nó không thuyết phục được `if`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Thư mục KHÔNG BAO GIỜ đi vào.
 *
 * `.git` nằm đây không phải vì bí mật mà vì vô dụng và tốn kém: nó chứa toàn
 * đối tượng nén, đọc ra là rác nhị phân, và nó to hơn cả mã nguồn. Muốn biết
 * trạng thái git thì đã có tool `git_status` / `git_diff` chạy lệnh git thật.
 */
const THU_MUC_CAM = new Set([
  'node_modules', '.git', '.svn', '.hg',
  'dist', 'build', 'out', 'coverage', '.turbo', '.cache', '.parcel-cache',
  'vendor', '__pycache__', '.venv', 'venv', '.tox',
  'Pods', 'DerivedData', '.gradle', 'target',
]);

/** `.next`, `.next-dev-abc`… — dự án này có hàng chục biến thể. */
const TIEN_TO_THU_MUC_CAM = ['.next'];

/**
 * File KHÔNG BAO GIỜ đọc. Đây là danh sách chống RÒ RỈ, không phải chống ồn.
 *
 * Cố ý rộng tay: một file `.pem` bị bỏ sót là một khoá riêng tư bay lên cổng
 * LLM, còn một file bị chặn oan chỉ khiến agent nói "tôi không đọc loại file
 * này". Hai cái giá đó không cùng hạng.
 */
const MAU_FILE_CAM: readonly RegExp[] = [
  /(^|\.)env($|\.)/i,          // .env, .env.local, env.production, .env.bak
  /\.(pem|key|p12|pfx|jks|keystore)$/i,
  /^id_(rsa|dsa|ecdsa|ed25519)/i,
  /\.(ppk|asc|gpg|kdbx)$/i,
  /^\.?(npmrc|netrc|pgpass|htpasswd)$/i,
  /^\.git-credentials$/i,
  /credentials?\.json$/i,       // credentials.json của Google/AWS
  /^service[-_]?account.*\.json$/i,
  /\.(sqlite3?|db)$/i,          // CSDL cục bộ hay chứa dữ liệu thật của người dùng
];

/** Trần kích thước file agent được đọc. To hơn gần như chắc chắn là dữ liệu sinh ra. */
export const TRAN_BYTE_FILE = 2 * 1024 * 1024;

export class LoiNguc extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoiNguc';
  }
}

/** Tên thư mục này có bị cấm đi vào không. */
export function thuMucBiCam(ten: string): boolean {
  return THU_MUC_CAM.has(ten) || TIEN_TO_THU_MUC_CAM.some((p) => ten.startsWith(p));
}

/** Tên file này có bị cấm đọc không. Nhận TÊN FILE, không phải cả đường dẫn. */
export function fileBiCam(ten: string): boolean {
  return MAU_FILE_CAM.some((re) => re.test(ten));
}

/**
 * Đường dẫn tương đối do model sinh ra → đường dẫn tuyệt đối đã chứng minh là
 * nằm trong ngục và không chạm vào thứ bị cấm.
 *
 * `phaiCoThat: true` thì kiểm thêm `realpath` — chỉ làm được khi file đã tồn
 * tại, và đó chính là lúc symlink có thể lừa được hai phép kiểm chuỗi phía
 * trên.
 */
export async function moTrongNguc(
  goc: string,
  duongDanTuongDoi: string,
  opts: { phaiCoThat?: boolean } = {},
): Promise<string> {
  const tho = String(duongDanTuongDoi ?? '').trim();

  // Đường dẫn TUYỆT ĐỐI từ model bị từ chối thẳng. `path.resolve(goc, '/etc')`
  // trả về '/etc' — tham số gốc bị vứt im lặng. Đây là cái bẫy kinh điển, và
  // nó không phát ra tiếng động nào.
  if (path.isAbsolute(tho)) {
    throw new LoiNguc('Đường dẫn phải TƯƠNG ĐỐI so với gốc dự án, không được tuyệt đối.');
  }

  const dich = path.resolve(goc, tho);
  const gocCoSep = goc.endsWith(path.sep) ? goc : goc + path.sep;
  if (dich !== goc && !dich.startsWith(gocCoSep)) {
    throw new LoiNguc('Đường dẫn nằm ngoài thư mục dự án đang mở.');
  }

  // Mọi đoạn trên đường đi đều phải sạch — không chỉ đoạn cuối. `src/.git/x`
  // có tên file cuối là "x", trông vô hại.
  const cacDoan = path.relative(goc, dich).split(path.sep).filter(Boolean);
  for (const doan of cacDoan.slice(0, -1)) {
    if (thuMucBiCam(doan)) throw new LoiNguc(`Không đọc thư mục "${doan}".`);
  }
  const cuoi = cacDoan[cacDoan.length - 1];
  if (cuoi && thuMucBiCam(cuoi)) throw new LoiNguc(`Không đọc thư mục "${cuoi}".`);
  if (cuoi && fileBiCam(cuoi)) {
    throw new LoiNguc(
      `Không đọc file "${cuoi}" — đây là loại file có thể chứa khoá hoặc mật khẩu. ` +
        'Hãy trả lời mà không cần tới nó, và nói cho người dùng biết bạn đã bỏ qua nó.',
    );
  }

  if (opts.phaiCoThat) {
    const that = await fs.realpath(dich).catch((err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw err;
    });
    if (that === null) throw new LoiNguc(`Không có file hay thư mục "${tho}".`);

    const gocThat = await fs.realpath(goc);
    const gocThatSep = gocThat.endsWith(path.sep) ? gocThat : gocThat + path.sep;
    if (that !== gocThat && !that.startsWith(gocThatSep)) {
      throw new LoiNguc(`"${tho}" là liên kết trỏ ra ngoài thư mục dự án.`);
    }
  }

  return dich;
}
