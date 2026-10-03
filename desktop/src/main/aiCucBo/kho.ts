/**
 * ============================================================
 * AI NGOẠI TUYẾN — SỔ MODEL VÀ SỔ BỘ CHẠY
 * ============================================================
 *
 * Người dùng: *"app tôi có làm được AI local để all máy tải về khi không có
 * internet vẫn dùng được AI như bình thường không ta?"*
 *
 * Tệp này là phần THUẦN của tính năng đó: nó không tải gì, không chạy gì, chỉ
 * trả lời hai câu hỏi — *máy này hợp bản nào* và *tải ở đâu về*. Tách ra vì
 * đây là chỗ dễ sai nhất mà lại dễ kiểm nhất: một cái tên file sai nghĩa là
 * người dùng bấm "Tải" rồi nhận 404 sau khi chờ ba phút.
 *
 * ⚠️ MỌI CON SỐ NGƯỠNG Ở ĐÂY LÀ ĐO THẬT, không phải ước lượng. Đo 15/09/2026
 * trên M1 Max 32GB, llama.cpp b10964, xem `reference_do_that_ai_local_4b`:
 *
 *     RAM đỉnh thật:  bản 4B chữ 3,56 GB · bản 4B ảnh 4,59 GB (ctx 8192)
 *     Tốc độ có GPU:  nạp đề 610-684 t/s · gõ chữ 58-60 t/s
 *     Tốc độ chỉ CPU: nạp đề  33,8 t/s  · gõ chữ  8,0 t/s
 *
 * Con số quyết định KHÔNG phải tốc độ gõ chữ mà là tốc độ NẠP ĐỀ: 33,8 t/s
 * nghĩa là một bài học 2.400 chữ phải chờ 71 GIÂY trước khi ra ký tự đầu tiên.
 * Người dùng sẽ tưởng app treo và tắt đi. Vì thế máy không có GPU thì KHÔNG
 * được mời bản 4B, dù RAM có dư.
 */

/**
 * Bản dựng llama.cpp được ghim.
 *
 * ⛔ ĐỪNG đổi thành "bản mới nhất". `ggml-org/llama.cpp` phát hành mỗi ngày
 * vài lượt và cờ dòng lệnh CÓ đổi giữa các bản — `-no-cnv` biến mất là ví dụ
 * đã dẫm phải khi đo. Ghim số, và khi nâng thì nâng có chủ đích kèm chạy lại
 * phép kiểm, chứ đừng để app tự trôi theo nightly của người khác.
 */
export const BAN_LLAMA = 'b10976';

/** Loại tăng tốc của gói bộ chạy. Quyết định tốc độ NẠP ĐỀ, tức quyết định tất cả. */
export type LoaiTangToc = 'metal' | 'vulkan' | 'cuda' | 'cpu';

export interface GoiBoChay {
  /** Tên file trong release của llama.cpp. */
  ten: string;
  /** Cỡ xấp xỉ để hiện cho người dùng trước khi họ bấm. */
  mb: number;
  tangToc: LoaiTangToc;
  /**
   * Gói PHẢI giải nén CHUNG thư mục với gói chính. Chỉ gói CUDA của Windows
   * có: `cudart-*.zip` chứa `cudart64_12.dll`, `cublas64_12.dll`… mà
   * `ggml-cuda.dll` cần. Thiếu nó thì `--list-devices` không thấy CUDA0 và
   * bộ cài lùi về Vulkan — đúng, nhưng là tải 254 MB cho không.
   */
  kem?: { ten: string; mb: number };
}

/**
 * Bộ chạy cho từng nền tảng, THEO THỨ TỰ ƯU TIÊN.
 *
 * Phần tử đầu là bản nhanh nhất; nếu nó không chạy được trên máy đó thì lùi
 * xuống phần tử sau. Lùi là chuyện BÌNH THƯỜNG chứ không phải lỗi: bản Vulkan
 * cần trình điều khiển GPU có loader Vulkan, mà máy văn phòng cũ hoặc máy ảo
 * thường không có — và khi thiếu, nó chết lúc khởi động chứ không báo trước.
 *
 * ⚠️ CỐ Ý KHÔNG dùng bản CUDA. Nó nhanh hơn Vulkan trên card NVIDIA, nhưng gói
 * `cudart-*` nặng 391 MB — gấp mười hai lần bản Vulkan (31,7 MB) — và chỉ chạy
 * trên đúng một hãng card. Bắt người dùng tải 391 MB để có thể nhanh hơn một
 * chút, trên một tính năng vốn đã là lưới đỡ lúc mất mạng, là đổi sai chiều.
 */
/* `mb` = CỠ THẬT tới byte (÷1e6), đọc từ API release b10976 ngày 03/10/2026.
   ⛔ Đừng làm tròn: bộ tải chỉ cho lệch 2% (taiVe.ts), mà gói win-cpu-x64 thật
   nặng 18,43 MB — ghi "18" là lệch 2,4% ⇒ file tải ĐÚNG bị vứt như hỏng, và
   máy Windows không có Vulkan (lùi về CPU) KHÔNG BAO GIỜ cài được (bắt bởi
   desktop-ai-ngoai-tuyen.yml trên windows-latest). Đổi BAN_LLAMA thì đọc lại:
   gh api repos/ggml-org/llama.cpp/releases/tags/<bản> --jq '.assets[]|"\(.name) \(.size)"' */
const BO_CHAY: Record<string, GoiBoChay[]> = {
  'darwin-arm64': [{ ten: `llama-${BAN_LLAMA}-bin-macos-arm64.tar.gz`, mb: 11.149629, tangToc: 'metal' }],
  'darwin-x64': [{ ten: `llama-${BAN_LLAMA}-bin-macos-x64.tar.gz`, mb: 11.200001, tangToc: 'metal' }],
  'win32-x64': [
    { ten: `llama-${BAN_LLAMA}-bin-win-vulkan-x64.zip`, mb: 31.675956, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-win-cpu-x64.zip`, mb: 18.428731, tangToc: 'cpu' },
  ],
  'win32-arm64': [{ ten: `llama-${BAN_LLAMA}-bin-win-cpu-arm64.zip`, mb: 11.99712, tangToc: 'cpu' }],
  'linux-x64': [
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-vulkan-x64.tar.gz`, mb: 30.189596, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-x64.tar.gz`, mb: 16.844927, tangToc: 'cpu' },
  ],
  'linux-arm64': [
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-vulkan-arm64.tar.gz`, mb: 24.232037, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-arm64.tar.gz`, mb: 13.469344, tangToc: 'cpu' },
  ],
};

/**
 * Gói CUDA cho Windows x64 — CHỈ mời khi máy có card NVIDIA VÀ người dùng cài
 * bản lập trình 30B (03/10/2026).
 *
 * Quyết định "không CUDA" ở trên vẫn đúng cho bản 1,7B/4B: 645 MB (254 + 391
 * cudart) cho một model 1-2,5 GB là đổi sai chiều. Nhưng bản 30B nặng 18,6 GB
 * và là model MoE — phần lớn tầng nằm ở GPU, phần tràn ra chạy CPU; ở đó CUDA
 * nhanh hơn Vulkan rõ rệt trên card NVIDIA. Thêm 3% dung lượng để mỗi bước
 * agent nhanh hơn là đổi ĐÚNG chiều. Bản 12.4 chứ không 13.x: CUDA 13 đòi
 * driver ≥ 580, máy chưa cập nhật driver sẽ chết lúc khởi động.
 *
 * Tên + cỡ đọc từ API release b10976 ngày 03/10/2026 (byte thật):
 *   llama-b10976-bin-win-cuda-12.4-x64.zip   254.086.292
 *   cudart-llama-bin-win-cuda-12.4-x64.zip   391.443.627  (KHÔNG mang số bản)
 */
const GOI_CUDA_WIN: GoiBoChay = {
  ten: `llama-${BAN_LLAMA}-bin-win-cuda-12.4-x64.zip`,
  mb: 254.086292,
  tangToc: 'cuda',
  kem: { ten: 'cudart-llama-bin-win-cuda-12.4-x64.zip', mb: 391.443627 },
};

/**
 * Danh sách gói bộ chạy cho một nền tảng, ưu tiên trước. Rỗng = không hỗ trợ.
 *
 * `tuyChon.cuda` = máy có NVIDIA và đang cài bản lập trình ⇒ Windows x64 thử
 * CUDA trước, hỏng thì vẫn còn Vulkan → CPU phía sau.
 */
export function goiBoChay(
  nenTang: string, kienTruc: string, tuyChon: { cuda?: boolean } = {},
): GoiBoChay[] {
  const ds = BO_CHAY[`${nenTang}-${kienTruc}`] ?? [];
  if (tuyChon.cuda && nenTang === 'win32' && kienTruc === 'x64') return [GOI_CUDA_WIN, ...ds];
  return ds;
}

/** Địa chỉ tải một gói bộ chạy (hoặc gói kèm của nó). */
export function duongBoChay(goi: GoiBoChay | { ten: string }): string {
  return `https://github.com/ggml-org/llama.cpp/releases/download/${BAN_LLAMA}/${goi.ten}`;
}

export type MaModel = 'nho' | 'vua' | 'anh' | 'code';

export interface Model {
  ma: MaModel;
  /** Tên người dùng đọc. KHÔNG phải tên file — họ không cần biết "Q4_K_M". */
  ten: string;
  /** Một câu nói model này làm được gì, bằng lời của người dùng. */
  moTa: string;
  kho: string;
  /**
   * Commit đã GHIM của kho HuggingFace (03/10/2026) — cùng lý do ghim
   * `BAN_LLAMA`: tải `main` là để nội dung đổi dưới chân bộ tải tiếp, và một
   * file đúng cỡ sai nội dung đã lọt thật (xem `kiemSha256` ở taiVe.ts).
   */
  rev: string;
  file: string;
  /** SHA-256 của `file` ở đúng `rev` (= `x-linked-etag` của HuggingFace). */
  sha256: string;
  /** Cỡ file, GB. Hiện trước khi người dùng bấm tải. */
  gb: number;
  /** RAM đỉnh ĐO THẬT lúc chạy, GB — không phải cỡ file. Chênh nhau 1 GB. */
  ramGb: number;
  /** File chiếu ảnh. Chỉ model nhìn được ảnh mới có. */
  mmproj?: { file: string; gb: number; sha256: string };
  /**
   * Dùng được cho AI Code ngoại tuyến không (model có gọi tool qua chat
   * template). Vắng = không. `nho` gọi được tool nhưng 1,7B đi quá 2-3 bước
   * là lạc — KHÔNG mời cho AI Code (chỉ dùng trong phép kiểm CI).
   */
  code?: {
    /** Cửa sổ ngữ cảnh khi chạy cho AI Code. Agent chở kết quả tool nên cần rộng hơn chat. */
    cuaSo: number;
    /** Trần bước mỗi câu hỏi. Model nhỏ hơn ⇒ trần thấp hơn: lạc thì lạc sớm, đừng đốt 5 phút. */
    tranBuoc: number;
    /** Nhãn hiện cạnh tên model trong AI Code. */
    nhan: string;
  };
}

/**
 * Ba model, không nhiều hơn.
 *
 * Mỗi model thêm vào là một thứ nữa phải đo lại, phải mô tả, và phải giải
 * thích cho người dùng chọn. Danh sách dài không làm họ chọn giỏi hơn, nó làm
 * họ bỏ cuộc. Ba cái này phủ đúng ba tình huống: máy yếu, máy thường, và
 * người muốn hỏi ảnh chụp màn hình.
 */
export const MODEL: readonly Model[] = Object.freeze([
  {
    ma: 'nho',
    ten: 'Bản gọn',
    moTa: 'Trả lời câu hỏi ngắn, giải thích khái niệm. Chạy được trên máy yếu.',
    kho: 'unsloth/Qwen3-1.7B-GGUF',
    rev: 'd7f544eead698dbd1f15126ef60b45a1e1933222',
    file: 'Qwen3-1.7B-Q4_K_M.gguf',
    sha256: 'b139949c5bd74937ad8ed8c8cf3d9ffb1e99c866c823204dc42c0d91fa181897',
    gb: 1.1,
    ramGb: 1.8,
  },
  {
    ma: 'vua',
    ten: 'Bản đầy đủ',
    moTa: 'Hiểu bài học dài, viết được mã và giải toán. Cần máy khá.',
    kho: 'unsloth/Qwen3-4B-Instruct-2507-GGUF',
    rev: 'a06e946bb6b655725eafa393f4a9745d460374c9',
    file: 'Qwen3-4B-Instruct-2507-Q4_K_M.gguf',
    sha256: '3605803b982cb64aead44f6c1b2ae36e3acdb41d8e46c8a94c6533bc4c67e597',
    gb: 2.5,
    ramGb: 3.6,
    code: { cuaSo: 16384, tranBuoc: 12, nhan: 'chỉ việc nhỏ' },
  },
  {
    ma: 'anh',
    ten: 'Bản xem ảnh',
    moTa: 'Đọc được ảnh chụp màn hình: chữ, số và biểu đồ trong ảnh.',
    kho: 'Qwen/Qwen3-VL-4B-Instruct-GGUF',
    rev: '1cd86afb9a95c410a6038ab3b40d8b578c892266',
    file: 'Qwen3VL-4B-Instruct-Q4_K_M.gguf',
    sha256: '66358cb18bb6b3b1b6675aa412c7a88ef01d228f481184d13668e5201c730a0a',
    gb: 2.5,
    ramGb: 4.6,
    mmproj: {
      file: 'mmproj-Qwen3VL-4B-Instruct-F16.gguf',
      gb: 0.84,
      sha256: '256f3a43bd4205ffef48d6b92715e1e70b5b0e9aef06522584967513a9985331',
    },
  },
  /*
   * BẢN LẬP TRÌNH — cho AI Code ngoại tuyến trên máy mạnh (03/10/2026).
   *
   * Qwen3-Coder-30B-A3B: MoE 30B tham số, mỗi token chỉ chạy ~3B ⇒ tốc độ gần
   * bản 4B nhưng hiểu mã và gọi tool nhiều bước tốt hơn hẳn. Kho `unsloth`
   * chứ không `Qwen/`: Qwen KHÔNG phát hành GGUF cho model này (`Qwen/Qwen3-
   * Coder-30B-A3B-Instruct-GGUF` trả 401 — kho không tồn tại, kiểm 03/10/2026),
   * và bản unsloth có chat template đã vá phần gọi tool.
   *
   * Cỡ ĐO bằng `curl -sI` file thật 03/10/2026: x-linked-size 18.556.689.568.
   * `ramGb` = file 18,6 + KV ctx 32k (~3,1 GB f16) + đệm tính toán ~0,8 GB —
   * xem `reference_do_that_ai_local_4b` mục 30B cho số đo thật trên M1 Max.
   */
  {
    ma: 'code',
    ten: 'Bản lập trình (30B)',
    moTa: 'Cho AI Code khi mất mạng: đọc mã, sửa file, chạy lệnh nhiều bước. Cần máy mạnh.',
    kho: 'unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF',
    rev: 'b17cb02dd882d5b6ab62fc777ad2995f19668350',
    file: 'Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf',
    sha256: 'fadc3e5f8d42bf7e894a785b05082e47daee4df26680389817e2093056f088ad',
    gb: 18.56,
    ramGb: 22.5,
    code: { cuaSo: 32768, tranBuoc: 30, nhan: 'chạy trên máy này' },
  },
]);

export function timModel(ma: string): Model | undefined {
  return MODEL.find((m) => m.ma === ma);
}

/** Địa chỉ tải một file của model trên HuggingFace — ở đúng commit đã ghim. */
export function duongModel(m: Model, file = m.file): string {
  return `https://huggingface.co/${m.kho}/resolve/${m.rev}/${file}`;
}

/** SHA-256 mong đợi của một file thuộc model (file chính hoặc mmproj). */
export function shaCua(m: Model, file = m.file): string {
  return file === m.mmproj?.file ? m.mmproj.sha256 : m.sha256;
}

/** Tổng dung lượng phải tải cho một model, kể cả file chiếu ảnh. */
export function tongGb(m: Model): number {
  return Math.round((m.gb + (m.mmproj?.gb ?? 0)) * 100) / 100;
}

export interface CauHinhMay {
  /** RAM tổng của máy, GB. */
  ramGb: number;
  /** Đĩa còn trống, GB. */
  diaGb: number;
  /** Máy có đường tăng tốc GPU dùng được không. */
  coGpu: boolean;
}

/** Thêm những gì cần để quyết bản cho AI Code. Mọi trường đều có thể "chưa biết". */
export interface CauHinhMayCode extends CauHinhMay {
  nenTang: string;
  kienTruc: string;
  /** VRAM lớn nhất của một GPU rời, GB. `-1`/vắng = chưa đo được. Apple Silicon: bỏ qua (bộ nhớ hợp nhất). */
  vramGb?: number;
}

export interface LoiKhuyenCode {
  /** Bản nên dùng cho AI Code ngoại tuyến. `null` = máy này không nên chạy AI Code ngoại tuyến. */
  nen: MaModel | null;
  choPhep: MaModel[];
  /** Mức máy — để giao diện vẽ nhãn. */
  muc: 'manh' | 'vua' | 'yeu';
  vi: string;
}

export interface LoiKhuyen {
  /** Model nên mời. `null` = máy này không nên chạy AI ngoại tuyến. */
  nen: MaModel | null;
  /** Model người dùng vẫn chọn thêm được, dù không phải mặc định. */
  choPhep: MaModel[];
  /** Lý do, viết cho NGƯỜI DÙNG đọc chứ không phải cho lập trình viên. */
  vi: string;
}

/**
 * RAM app tự ăn trước khi model được nạp.
 *
 * Electron + Chromium của chính app này. Đo bằng Activity Monitor chứ không
 * đoán: cửa sổ chính + cửa sổ robot + tiến trình GPU cộng lại quanh 2,5 GB khi
 * đang mở một bài học. Cộng thêm phần hệ điều hành và trình duyệt người dùng
 * đang mở song song, để 3 GB là con số thành thật.
 */
const RAM_APP_TU_AN_GB = 3;

/**
 * RAM phải chừa lại cho HỆ ĐIỀU HÀNH và những thứ người dùng đang mở.
 *
 * ⚠️ Thiếu hằng số này là một lỗi thật, bị phép kiểm bắt 15/09/2026: máy 8 GB
 * được mời bản đầy đủ, vì phép tính chỉ trừ phần app (8 − 3 = 5 ≥ 3,6 ✓). Sai
 * ở chỗ 3,56 GB là RAM của RIÊNG model — Windows/macOS tự nó đã ăn ~2 GB, và
 * người dùng còn mở trình duyệt với Word bên cạnh. Hết RAM thì máy không báo
 * lỗi, nó TRÁO RA ĐĨA: cả máy đứng hình, và người dùng đổ tại app.
 */
const RAM_DE_THO_GB = 2;

/** RAM thật sự còn cho model, sau khi trừ app và phần chừa cho hệ. */
function ramConCho(ramGb: number): number {
  return ramGb - RAM_APP_TU_AN_GB - RAM_DE_THO_GB;
}

/**
 * Máy này hợp bản nào.
 *
 * ⚠️ GPU là điều kiện CẦN cho bản 4B, không phải điều kiện cộng thêm. Máy 32 GB
 * RAM mà không có GPU dùng được vẫn chỉ nạp đề ở 33,8 t/s — tức chờ 71 giây một
 * câu hỏi có kèm bài học. Mời bản 4B cho máy đó là mời người ta tải 2,5 GB về
 * để thất vọng.
 */
export function loiKhuyen(may: CauHinhMay): LoiKhuyen {
  const raMConLai = ramConCho(may.ramGb);
  const vua = timModel('vua')!;
  const nho = timModel('nho')!;
  const anh = timModel('anh')!;

  /*
   * ⚠️ `-1` nghĩa là KHÔNG ĐO ĐƯỢC đĩa, không phải "hết đĩa". Chặn ở đây thì
   * một máy có đĩa dư vẫn bị khoá sạch nút — đúng lỗi đã hỏng 100% người dùng
   * ngày 16/09/2026. Không đo được thì cứ mời; lúc tải thật mà thiếu chỗ, hệ
   * điều hành sẽ báo và bộ tải nói lại bằng tiếng Việt.
   */
  const bietDia = may.diaGb >= 0;
  if (bietDia && may.diaGb < tongGb(anh) + 1) {
    /* Còn đủ cho bản gọn thì vẫn mời bản gọn — chặn hết là quá tay. */
    const duBanGon = may.diaGb >= tongGb(nho) + 1;
    return {
      nen: duBanGon ? 'nho' : null,
      choPhep: duBanGon ? ['nho'] : [],
      vi: `Đĩa còn ${may.diaGb.toFixed(1)} GB. `
        + (duBanGon
          ? `Đủ cho bản gọn (${tongGb(nho)} GB), chưa đủ cho bản lớn hơn.`
          : `Cần ít nhất ${(tongGb(nho) + 1).toFixed(1)} GB để tải và chạy. Dọn bớt đĩa rồi quay lại nhé.`),
    };
  }

  if (raMConLai < nho.ramGb) {
    return {
      nen: null,
      choPhep: [],
      vi: `Máy có ${may.ramGb} GB RAM, mà riêng app cùng hệ điều hành đã dùng khoảng `
        + `${RAM_APP_TU_AN_GB + RAM_DE_THO_GB} GB. Phần còn lại không đủ cho cả bản gọn nhất — `
        + 'chạy sẽ làm cả máy đứng. Bản trên mạng vẫn dùng bình thường.',
    };
  }

  if (!may.coGpu) {
    return {
      nen: 'nho',
      choPhep: ['nho'],
      vi: 'Máy này chưa có đường tăng tốc GPU, nên chỉ nên dùng bản gọn. '
        + 'Bản đầy đủ vẫn tải được nhưng mỗi câu hỏi kèm bài học phải chờ hơn một phút — '
        + 'đo thật, không phải phỏng đoán.',
    };
  }

  if (raMConLai < vua.ramGb) {
    return {
      nen: 'nho',
      choPhep: ['nho'],
      vi: `Máy có GPU nhưng chỉ còn ${raMConLai.toFixed(1)} GB RAM cho AI sau khi chừa phần app và hệ điều hành — `
        + `bản đầy đủ cần ${vua.ramGb} GB. Bản gọn chạy tốt trên máy này.`,
    };
  }

  if (raMConLai < anh.ramGb) {
    return {
      nen: 'vua',
      choPhep: ['nho', 'vua'],
      vi: 'Máy này chạy tốt bản đầy đủ. Bản xem ảnh cần thêm RAM nên chưa mời — '
        + 'phần hỏi bằng ảnh vẫn dùng bản trên mạng.',
    };
  }

  return {
    nen: 'vua',
    choPhep: ['nho', 'vua', 'anh'],
    vi: 'Máy này chạy được cả ba bản. Nên bắt đầu với bản đầy đủ; '
      + 'muốn hỏi bằng ảnh chụp màn hình thì tải thêm bản xem ảnh.',
  };
}


/**
 * Máy này chạy AI Code ngoại tuyến bằng bản nào (03/10/2026).
 *
 * Ba mức, và ngưỡng do chủ app chốt chứ không suy diễn:
 *   • MẠNH — Apple Silicon ≥ 32 GB, hoặc GPU rời ≥ 16 GB VRAM, hoặc RAM ≥ 32 GB
 *     kèm GPU dùng được ⇒ bản lập trình 30B.
 *   • VỪA — có GPU và đủ RAM cho bản 4B ⇒ bản đầy đủ, nhãn "chỉ việc nhỏ".
 *   • YẾU — không GPU hoặc thiếu RAM ⇒ KHÔNG mời (ranh giới 3: nạp đề 33,8
 *     t/s trên CPU, mà agent nạp lại cả hội thoại MỖI bước — một việc 6 bước
 *     là 6-7 phút chờ). Chat vẫn dùng bản gọn như cũ.
 */
export function loiKhuyenCode(may: CauHinhMayCode): LoiKhuyenCode {
  const code = timModel('code')!;
  const vua = timModel('vua')!;
  const conCho = ramConCho(may.ramGb);
  const bietDia = may.diaGb >= 0;
  const appleSilicon = may.nenTang === 'darwin' && may.kienTruc === 'arm64';
  const vram = may.vramGb ?? -1;

  if (!may.coGpu) {
    return {
      nen: null, choPhep: [], muc: 'yeu',
      vi: 'Máy này chưa có GPU dùng được, nên KHÔNG mời AI Code ngoại tuyến: agent đọc lại cả '
        + 'hội thoại ở MỖI bước, chạy bằng CPU thì một việc vài bước phải chờ nhiều phút (đo thật: '
        + 'nạp đề 33,8 chữ/giây). Chat ngoại tuyến vẫn dùng bản gọn được.',
    };
  }

  const manh = (appleSilicon && may.ramGb >= 32) || vram >= 16 || (may.ramGb >= 32 && may.coGpu);
  /* Mạnh nhưng ĐĨA không đủ 18,6 GB (+2 GB đệm) ⇒ lùi xuống bản 4B, nói rõ vì sao. */
  const duDiaCode = !bietDia || may.diaGb >= code.gb + 2;
  /* RAM hệ thống cần: GPU rời ≥ 16 GB gánh phần lớn tầng nên RAM chỉ chở phần
     tràn; còn Apple Silicon / máy RAM lớn thì cả model nằm trong RAM. */
  const ramCanCode = !appleSilicon && vram >= 16 ? Math.max(4, code.ramGb - vram) : code.ramGb;
  if (manh && conCho >= ramCanCode && duDiaCode) {
    return {
      nen: 'code', choPhep: ['code', 'vua'], muc: 'manh',
      vi: appleSilicon
        ? `Máy Apple Silicon ${may.ramGb} GB đủ sức chạy bản lập trình 30B cho AI Code (tải ${code.gb} GB).`
        : vram >= 16
          ? `GPU có ${vram} GB VRAM — đủ chạy bản lập trình 30B cho AI Code (tải ${code.gb} GB).`
          : `Máy ${may.ramGb} GB RAM kèm GPU — chạy được bản lập trình 30B (phần tràn khỏi GPU chạy trên CPU, chậm hơn một chút).`,
    };
  }

  const ramCode4b = vua.ramGb + 1.2; // ctx 16k ⇒ KV gấp đôi bản chat 8k (đo: 3,6 GB ở 8k)
  if (conCho >= ramCode4b) {
    const lyDo = manh && !duDiaCode
      ? `Máy đủ mạnh cho bản 30B nhưng đĩa chỉ còn ${may.diaGb.toFixed(1)} GB (cần ${(code.gb + 2).toFixed(1)} GB). `
      : '';
    return {
      nen: 'vua', choPhep: ['vua'], muc: 'vua',
      vi: `${lyDo}AI Code ngoại tuyến dùng bản 4B — CHỈ hợp việc nhỏ: đọc một hai file, sửa vài dòng, `
        + 'chạy một lệnh kiểm. Việc lớn nên chờ có mạng.',
    };
  }

  return {
    nen: null, choPhep: [], muc: 'yeu',
    vi: `Máy có GPU nhưng chỉ còn ${conCho.toFixed(1)} GB RAM cho AI sau khi chừa phần app và hệ điều hành — `
      + `AI Code ngoại tuyến cần ít nhất ${ramCode4b.toFixed(1)} GB. Chat ngoại tuyến vẫn dùng bản gọn được.`,
  };
}
