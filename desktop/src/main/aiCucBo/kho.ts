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
export type LoaiTangToc = 'metal' | 'vulkan' | 'cpu';

export interface GoiBoChay {
  /** Tên file trong release của llama.cpp. */
  ten: string;
  /** Cỡ xấp xỉ để hiện cho người dùng trước khi họ bấm. */
  mb: number;
  tangToc: LoaiTangToc;
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
const BO_CHAY: Record<string, GoiBoChay[]> = {
  'darwin-arm64': [{ ten: `llama-${BAN_LLAMA}-bin-macos-arm64.tar.gz`, mb: 11, tangToc: 'metal' }],
  'darwin-x64': [{ ten: `llama-${BAN_LLAMA}-bin-macos-x64.tar.gz`, mb: 11, tangToc: 'metal' }],
  'win32-x64': [
    { ten: `llama-${BAN_LLAMA}-bin-win-vulkan-x64.zip`, mb: 32, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-win-cpu-x64.zip`, mb: 18, tangToc: 'cpu' },
  ],
  'win32-arm64': [{ ten: `llama-${BAN_LLAMA}-bin-win-cpu-arm64.zip`, mb: 12, tangToc: 'cpu' }],
  'linux-x64': [
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-vulkan-x64.tar.gz`, mb: 30, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-x64.tar.gz`, mb: 17, tangToc: 'cpu' },
  ],
  'linux-arm64': [
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-vulkan-arm64.tar.gz`, mb: 24, tangToc: 'vulkan' },
    { ten: `llama-${BAN_LLAMA}-bin-ubuntu-arm64.tar.gz`, mb: 14, tangToc: 'cpu' },
  ],
};

/** Danh sách gói bộ chạy cho một nền tảng, ưu tiên trước. Rỗng = không hỗ trợ. */
export function goiBoChay(nenTang: string, kienTruc: string): GoiBoChay[] {
  return BO_CHAY[`${nenTang}-${kienTruc}`] ?? [];
}

/** Địa chỉ tải một gói bộ chạy. */
export function duongBoChay(goi: GoiBoChay): string {
  return `https://github.com/ggml-org/llama.cpp/releases/download/${BAN_LLAMA}/${goi.ten}`;
}

export type MaModel = 'nho' | 'vua' | 'anh';

export interface Model {
  ma: MaModel;
  /** Tên người dùng đọc. KHÔNG phải tên file — họ không cần biết "Q4_K_M". */
  ten: string;
  /** Một câu nói model này làm được gì, bằng lời của người dùng. */
  moTa: string;
  kho: string;
  file: string;
  /** Cỡ file, GB. Hiện trước khi người dùng bấm tải. */
  gb: number;
  /** RAM đỉnh ĐO THẬT lúc chạy, GB — không phải cỡ file. Chênh nhau 1 GB. */
  ramGb: number;
  /** File chiếu ảnh. Chỉ model nhìn được ảnh mới có. */
  mmproj?: { file: string; gb: number };
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
    file: 'Qwen3-1.7B-Q4_K_M.gguf',
    gb: 1.1,
    ramGb: 1.8,
  },
  {
    ma: 'vua',
    ten: 'Bản đầy đủ',
    moTa: 'Hiểu bài học dài, viết được mã và giải toán. Cần máy khá.',
    kho: 'unsloth/Qwen3-4B-Instruct-2507-GGUF',
    file: 'Qwen3-4B-Instruct-2507-Q4_K_M.gguf',
    gb: 2.5,
    ramGb: 3.6,
  },
  {
    ma: 'anh',
    ten: 'Bản xem ảnh',
    moTa: 'Đọc được ảnh chụp màn hình: chữ, số và biểu đồ trong ảnh.',
    kho: 'Qwen/Qwen3-VL-4B-Instruct-GGUF',
    file: 'Qwen3VL-4B-Instruct-Q4_K_M.gguf',
    gb: 2.5,
    ramGb: 4.6,
    mmproj: { file: 'mmproj-Qwen3VL-4B-Instruct-F16.gguf', gb: 0.84 },
  },
]);

export function timModel(ma: string): Model | undefined {
  return MODEL.find((m) => m.ma === ma);
}

/** Địa chỉ tải một file của model trên HuggingFace. */
export function duongModel(m: Model, file = m.file): string {
  return `https://huggingface.co/${m.kho}/resolve/main/${file}`;
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
