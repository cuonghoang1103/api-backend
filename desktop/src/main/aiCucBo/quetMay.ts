/**
 * ============================================================
 * QUÉT MÁY NGƯỜI DÙNG — máy này chạy nổi bản nào
 * ============================================================
 *
 * Người dùng: *"chỗ tải AI ngoại tuyến có chỗ quét máy của user để xem máy
 * user có thể tải bản nào phù hợp và chất lượng được không?"*
 *
 * ⚠️⚠️ CÓ GPU HAY KHÔNG LÀ THỨ KHÔNG ĐOÁN ĐƯỢC TỪ XA, và đây là chỗ cả tính
 * năng dễ nói dối người dùng nhất. Thấy tên "NVIDIA GeForce" trong danh sách
 * thiết bị KHÔNG suy ra được là llama.cpp dùng được nó: bản Vulkan cần
 * *Vulkan loader* của trình điều khiển, mà máy dùng trình điều khiển cơ bản
 * của Windows, máy ảo, hay máy công ty khoá driver thì có card mà không có
 * loader. Khi thiếu, llama.cpp không báo "không có GPU" — nó chết lúc khởi
 * động, và trông y hệt như app hỏng.
 *
 * Nên tệp này trả về HAI mức tin cậy, và chỗ gọi phải phân biệt:
 *
 *   • `coGpu` + `chacChan: false` — mới chỉ NHÌN tên thiết bị. Đủ để quyết
 *     định có mời tải hay không, KHÔNG đủ để hứa với người dùng.
 *   • `coGpu` + `chacChan: true`  — đã CHẠY thật `llama-server --list-devices`
 *     và thấy thiết bị. Chỉ sau bước này mới được nói "máy bạn chạy nhanh".
 *
 * Xem [[feedback_verify_by_running_not_reading]] — đúng cái bẫy này.
 */
import { exec } from 'node:child_process';
import { statfs } from 'node:fs/promises';
import { dirname } from 'node:path';
import { arch, platform, totalmem } from 'node:os';
import { promisify } from 'node:util';

const chay = promisify(exec);

export interface KetQuaQuet {
  nenTang: string;
  kienTruc: string;
  ramGb: number;
  diaGb: number;
  coGpu: boolean;
  /** `false` = mới nhìn tên thiết bị, chưa chạy thử. Đừng hứa gì với người dùng. */
  chacChan: boolean;
  /** Tên GPU để hiện cho người dùng thấy máy mình được nhận ra. Có thể rỗng. */
  tenGpu: string;
}

/** Làm tròn một chữ số thập phân — người dùng không cần 15,996094 GB. */
function lamTron(x: number): number {
  return Math.round(x * 10) / 10;
}

/**
 * Đĩa còn trống ở thư mục sẽ chứa model.
 *
 * ⚠️ Hỏi ĐÚNG thư mục đích chứ không hỏi `/`. Trên máy có nhiều phân vùng —
 * và trên macOS, nơi `/` là phân vùng hệ thống CHỈ ĐỌC — con số ở `/` không
 * liên quan gì tới chỗ thật sự sẽ ghi file 2,5 GB.
 */
export async function diaConTrong(thuMuc: string): Promise<number> {
  /*
   * ⚠️⚠️ LEO NGƯỢC LÊN THƯ MỤC CHA CHO TỚI KHI GẶP CÁI CÓ THẬT.
   *
   * Bản đầu hỏi thẳng `statfs(thuMuc)` và trả 0 khi ném. Nghe thì vô hại, thực
   * tế là hỏng 100%: lần đầu chạy thì `…/ai-ngoai-tuyen/model` CHƯA TỒN TẠI,
   * `statfs` ném ENOENT, hàm trả 0 — và `loiKhuyen()` đọc 0 GB thành "đĩa gần
   * đầy" rồi KHOÁ MỌI NÚT TẢI. Người dùng gửi ảnh 16/09/2026: máy còn 370 GB,
   * màn hình ghi "Đĩa chỉ còn 0.0 GB. Cần ít nhất 4.3 GB", cả ba nút xám.
   *
   * Không ai từng tải được model, và lỗi trông y như một quyết định có chủ ý.
   *
   * Phân vùng là thuộc tính của CÂY THƯ MỤC, nên thư mục cha bất kỳ cũng cho
   * đúng con số — chỉ cần nó có thật.
   */
  let d = thuMuc;
  for (let i = 0; i < 12; i += 1) {
    try {
      const s = await statfs(d);
      return lamTron((Number(s.bavail) * Number(s.bsize)) / 1e9);
    } catch {
      const cha = dirname(d);
      if (cha === d) break;   // đã tới gốc
      d = cha;
    }
  }
  /* Tới gốc mà vẫn không hỏi được: hệ thống thật sự không cho. Trả -1 chứ
     KHÔNG trả 0 — "không biết" và "hết đĩa" là hai chuyện khác nhau, và gộp
     chúng chính là lỗi vừa vá. */
  return -1;
}

/** Lệnh liệt kê card màn hình cho từng hệ. `null` = hệ này không cần hỏi. */
function lenhHoiGpu(): { lenh: string; dung: (ra: string) => string } | null {
  if (platform() === 'win32') {
    return {
      /* PowerShell chứ không phải `wmic`: `wmic` đã bị Microsoft gỡ khỏi
         Windows 11 24H2 trở đi, nên lệnh cũ trả "không tìm thấy" trên đúng
         những máy mới nhất — hỏng câm ở đúng nơi ít ai thử. */
      lenh: 'powershell -NoProfile -Command "Get-CimInstance Win32_VideoController '
        + '| Select-Object -ExpandProperty Name"',
      dung: (ra) => ra.split(/\r?\n/).map((s) => s.trim()).filter(Boolean).join(' · '),
    };
  }
  if (platform() === 'linux') {
    return {
      lenh: 'lspci 2>/dev/null | grep -iE "VGA|3D controller|Display controller"',
      dung: (ra) => ra.split('\n').map((d) => d.split(':').slice(2).join(':').trim())
        .filter(Boolean).join(' · '),
    };
  }
  return null;
}

/** Card tích hợp yếu — có tên trong danh sách nhưng chạy model 4B thì không hơn CPU bao nhiêu. */
const GPU_YEU = /\b(microsoft basic|standard vga|llvmpipe|swiftshader|virtio|vmware svga|qxl|gd 5446)\b/i;

/**
 * Quét máy. Không bao giờ ném — máy nào cũng phải ra được một câu trả lời.
 *
 * `thuMucModel` là chỗ sẽ chứa file tải về, dùng để hỏi đúng phân vùng.
 */
export async function quetMay(thuMucModel: string): Promise<KetQuaQuet> {
  const nenTang = platform();
  const kienTruc = arch();
  const ramGb = lamTron(totalmem() / 1e9);
  const diaGb = await diaConTrong(thuMucModel);

  /* macOS: Metal có sẵn trên mọi máy chạy nổi Electron, không phải hỏi ai.
     Đây là hệ DUY NHẤT trả lời chắc chắn được mà không cần chạy thử. */
  if (nenTang === 'darwin') {
    return {
      nenTang,
      kienTruc,
      ramGb,
      diaGb,
      coGpu: true,
      chacChan: true,
      tenGpu: kienTruc === 'arm64' ? 'Apple Silicon (Metal)' : 'Metal',
    };
  }

  const hoi = lenhHoiGpu();
  if (!hoi) return { nenTang, kienTruc, ramGb, diaGb, coGpu: false, chacChan: false, tenGpu: '' };

  try {
    /* Trần 6 giây: trên máy có card đang ngủ, lệnh hỏi thiết bị đánh thức nó
       dậy và có thể treo vài giây. Quá hạn thì coi như không có — thà mời bản
       gọn cho máy mạnh còn hơn để màn hình cài đặt đứng im. */
    const { stdout } = await chay(hoi.lenh, { timeout: 6000, windowsHide: true });
    const ten = hoi.dung(stdout);
    const coThat = ten.length > 0 && !GPU_YEU.test(ten);
    return { nenTang, kienTruc, ramGb, diaGb, coGpu: coThat, chacChan: false, tenGpu: ten };
  } catch {
    return { nenTang, kienTruc, ramGb, diaGb, coGpu: false, chacChan: false, tenGpu: '' };
  }
}

export interface ThietBiThat {
  coGpu: boolean;
  ten: string;
  /** Lệnh có chạy tới nơi không. `false` = chưa biết gì cả, KHÁC với "không có GPU". */
  chayDuoc: boolean;
  /** Quá hạn (thường là macOS quét tệp mới ở lần chạy đầu) chứ không phải chết. */
  quaHan?: boolean;
}

/**
 * Trần cho phép đo thiết bị.
 *
 * 120 giây, không phải 20. Đo thật: lần chạy đầu của tệp vừa giải nén trên
 * macOS mất 22 giây vì hệ quét mã độc; máy chậm hơn hoặc gói lớn hơn (bản
 * Vulkan 32 MB) sẽ lâu hơn nữa. Trần rộng ở đây không tốn gì — nó chỉ chạm
 * tới khi có chuyện thật sự hỏng.
 */
const HAN_DO_THIET_BI_MS = 120_000;

/**
 * Hỏi CHÍNH llama.cpp xem nó thấy thiết bị nào — phép đo thật, sau khi đã cài.
 *
 * Đây là thứ biến `chacChan: false` thành `true`. Chỉ gọi được sau khi bộ chạy
 * đã tải về, nên nó KHÔNG thay thế `quetMay()` mà đi sau nó.
 *
 * Đầu ra THẬT, đo trên M1 Max 15/09/2026 — không phải đọc tài liệu mà ra:
 *
 *     Available devices:
 *       BLAS: Accelerate (0 MiB, 0 MiB free)
 *       MTL0: Apple M1 Max (25559 MiB, 25558 MiB free)
 *
 * ⚠️ Thiết bị Metal tên là `MTL0`, KHÔNG phải `Metal0`. Bản đầu của hàm này
 * dò theo danh sách tên đẹp (`Metal|Vulkan|CUDA…`) và vì thế trượt sạch trên
 * MỌI máy Mac — báo "không có GPU" cho đúng cái máy chạy nhanh nhất. Nên nay
 * làm ngược lại: nhận MỌI dòng thiết bị và chỉ LOẠI những backend chạy bằng
 * CPU. Danh sách loại trừ ngắn và biết rõ; danh sách cho phép thì không bao
 * giờ đủ, vì mỗi bản llama.cpp lại thêm một backend mới.
 */
export async function hoiThietBiThat(duongLlamaServer: string): Promise<ThietBiThat> {
  try {
    const { stdout, stderr } = await chay(`"${duongLlamaServer}" --list-devices`, {
      timeout: HAN_DO_THIET_BI_MS,
      windowsHide: true,
    });
    const ra = `${stdout}\n${stderr}`;
    const sau = ra.split(/Available devices:/i)[1];
    if (!sau) return { coGpu: false, ten: '', chayDuoc: true };
    const dong = sau.split(/\r?\n/).map((s) => s.trim())
      /* Một dòng thiết bị có dạng `TÊN[số]: mô tả (… MiB free)`. */
      .filter((s) => /^[A-Za-z][A-Za-z0-9_]*\d*:\s+\S/.test(s))
      /* BLAS/Accelerate chạy trên CPU — có mặt trên mọi máy, kể cả máy không
         có card nào. Nhận nhầm nó là "có GPU" thì phép đo vô nghĩa. */
      .filter((s) => !/^(BLAS|CPU|RPC)\d*:/i.test(s));
    if (!dong.length) return { coGpu: false, ten: '', chayDuoc: true };
    return {
      coGpu: true,
      ten: dong.map((d) => d.replace(/\s*\(.*$/, '')).join(' · '),
      chayDuoc: true,
    };
  } catch (e) {
    /*
     * ⚠️⚠️ PHÂN BIỆT "CHẠY RỒI, KHÔNG THẤY GPU" VỚI "KHÔNG CHẠY NỔI".
     *
     * Gộp hai thứ này lại là lỗi đã đo được ngày 15/09/2026 và nó hỏng 100% máy
     * macOS ở lần cài đầu: trần cũ 20 giây, mà lần chạy ĐẦU của một tệp vừa
     * giải nén mất 22,09 GIÂY (lần thứ hai: 0,078 giây — nhanh hơn 283 lần).
     * Quá hạn ⇒ báo "không có GPU" ⇒ chỗ gọi tưởng gói hỏng ⇒ XOÁ bộ chạy ⇒
     * macOS không có gói lùi nên cài hỏng hẳn. Và gần như không tái hiện được,
     * vì lần chạy thứ hai trở đi thì nhanh.
     *
     * Nguyên nhân không phải quarantine (tệp tải bằng `fetch` không mang
     * `com.apple.quarantine`) mà là tệp ký kiểu `adhoc, linker-signed`: macOS
     * quét mã độc ở lần chạy đầu. Không gỡ được, chỉ chịu được.
     */
    const quaHan = (e as { killed?: boolean; signal?: string })?.killed === true
      || (e as { code?: string })?.code === 'ETIMEDOUT';
    return { coGpu: false, ten: '', chayDuoc: false, quaHan };
  }
}
