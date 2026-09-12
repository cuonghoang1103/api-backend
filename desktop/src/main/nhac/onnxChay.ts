/**
 * ============================================================
 * LỚP BỌC ONNX RUNTIME
 * ============================================================
 *
 * Đây là ranh giới duy nhất của app chạm vào `onnxruntime-node`. Mọi thứ khác
 * trong `nhac/` chỉ biết tới kiểu `ChayModel` — một hàm.
 *
 * ─── Vì sao nạp LƯỜI bằng createRequire ───
 * `onnxruntime-node` là module GỐC. Nó CÓ trong `dependencies`, nhưng "có
 * trong dependencies" không đồng nghĩa với "chạy được trên máy này": một bản
 * cài hỏng, hay một nền mà gói không có nhị phân, đều dẫn tới cùng chỗ. Nếu
 * `import` thẳng ở đầu tệp thì main process nạp lúc khởi động, và thiếu nhị
 * phân sẽ làm CẢ APP không mở được — người dùng chưa từng bấm vào Xưởng Remix
 * cũng chết theo. Nạp lười thì hỏng chỉ giới hạn trong đúng tính năng cần nó.
 *
 * ─── ⚠️ GHIM 1.23.2, VÀ ĐỪNG NÂNG NẾU CHƯA ĐỌC HẾT ĐOẠN NÀY ───
 * 1.23.2 là bản CUỐI CÙNG còn nhị phân `darwin/x64`. Từ 1.24.1 trở đi
 * onnxruntime bỏ hẳn macOS Intel (đo thật: số tệp trong gói tụt 44 → 42, mất
 * 38 MB, đúng một cặp `.node` + thư viện). App này dựng cả bản mac Intel, nên
 * nâng lên là lặng lẽ tắt tính năng tách stem cho toàn bộ người dùng nền đó —
 * bản cài vẫn dựng, vẫn cài, chỉ có nút Tách là báo lỗi.
 *
 * Ghim CHÍNH XÁC, không dấu ngã: đây là nhị phân gốc cộng một hợp đồng tensor
 * chưa đo được, và bộ nền mà gói hỗ trợ đổi giữa các bản. Một dải phiên bản
 * nghĩa là `npm ci` vài tháng sau kéo về một gói khác mà không ai chọn — và
 * thứ mất đi sẽ là một nền, không phải một dòng log.
 *
 * ─── ⚠️ HỢP ĐỒNG TENSOR CHƯA ĐƯỢC ĐO, NÊN PHẢI KIỂM LÚC CHẠY ───
 * Tên đầu vào `mix`, dạng `[1, 2, mẫu]`, bốn đầu ra theo thứ tự
 * drums/bass/other/vocals — đọc từ tài liệu của bản xuất, KHÔNG phải đo được
 * trên máy viết mã (kho model bị chính sách mạng chặn). Đã kiểm được tới đây
 * và không xa hơn: `require` chạy, `InferenceSession.create` và `Tensor` có
 * thật, dựng được tensor `float32` dạng `[1, 2, n]`. Cái CHƯA kiểm là một lượt
 * `run()` với model thật. Tài liệu có thể cũ, và bản xuất có thể đổi.
 *
 * Nên tệp này **không gõ cứng gì cả**: nó đọc chữ ký thật của model rồi tự
 * khớp, và nếu không khớp được thì ném lỗi NÓI RÕ nó thấy gì. Một model sai
 * hợp đồng mà chạy im lặng sẽ cho ra bốn tệp âm thanh nghe như nhiễu, và
 * triệu chứng đó trông y hệt "model kém" chứ không như "gọi sai".
 */
import { createRequire } from 'node:module';

import type { ChayModel } from './tachStem';
import { TEN_STEM } from './tachStem';

/* ── Kiểu tối thiểu của onnxruntime-node ─────────────────────
   Tự khai thay vì `import type` để tệp này biên dịch được cả khi gói chưa
   được cài — đúng tình huống của máy dựng và của bản cài chưa tải runtime. */

interface OrtTensor {
  readonly data: Float32Array;
  readonly dims: readonly number[];
}

interface OrtSession {
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
  release?(): Promise<void>;
}

interface OrtModule {
  InferenceSession: {
    create(duongDan: string, tuyChon?: Record<string, unknown>): Promise<OrtSession>;
  };
  Tensor: new (kieu: 'float32', duLieu: Float32Array, dims: number[]) => OrtTensor;
}

/**
 * Nạp `onnxruntime-node` bằng require động. Ném lỗi đọc được nếu chưa có.
 *
 * Dùng `createRequire` chứ KHÔNG dùng `eval('require')`: bản nháp đầu ở đây
 * viết theo cách thứ hai, và đưa `eval` vào main process của một app có
 * `security.ts` và CSP chặt là tự mở một cửa không cần thiết — dù chuỗi truyền
 * vào là hằng số.
 *
 * `__filename` có thật trong bản dựng (main process xuất ra CJS, xem
 * `vite.main.config.ts`). Lời gọi nằm TRONG hàm chứ không ở tầm mô-đun, nên
 * vitest nạp tệp này để kiểm `bocKetQua`/`docHopDong` cũng không chạm tới nó.
 */
function napOrt(): OrtModule {
  try {
    const nap = createRequire(__filename);
    return nap('onnxruntime-node') as OrtModule;
  } catch (loi) {
    throw new Error(
      'Không nạp được onnxruntime-node, nên phần tách stem tạm nghỉ — mọi thứ '
      + 'còn lại của app vẫn chạy bình thường.\n\n'
      + 'Bản cài đáng ra đã kèm sẵn nhị phân cho nền này, nên đây nhiều khả '
      + 'năng là một bản cài thiếu tệp: tải lại bản mới nhất thường là xong.\n\n'
      + `Chi tiết: ${(loi as Error).message}`,
    );
  }
}

/** Chữ ký thật mà model khai báo — hiện ra khi cần soi, và khi báo lỗi. */
export interface HopDongModel {
  tenVao: string;
  tenRa: readonly string[];
  /** true = một đầu ra gộp cả 4 stem; false = mỗi stem một đầu ra. */
  raGop: boolean;
}

/**
 * Suy ra cách gọi model từ chữ ký của chính nó.
 *
 * Hai dạng bản xuất đều gặp ngoài thực tế, và cả hai đều hợp lệ:
 *   • bốn đầu ra, mỗi stem một cái  ⇒ `raGop = false`
 *   • một đầu ra dạng [1, 4, 2, N]  ⇒ `raGop = true`
 * Đoán sai dạng nào cũng ra âm thanh rác chứ không ra lỗi, nên phải suy từ số
 * lượng đầu ra thay vì chọn sẵn một dạng.
 */
export function docHopDong(phien: OrtSession): HopDongModel {
  const vao = phien.inputNames;
  if (vao.length !== 1) {
    throw new Error(
      `Model có ${vao.length} đầu vào (${vao.join(', ')}), cần đúng 1. `
      + 'Đây không phải bản xuất htdemucs mà Xưởng Remix biết gọi.',
    );
  }
  const ra = phien.outputNames;
  if (ra.length !== 1 && ra.length !== TEN_STEM.length) {
    throw new Error(
      `Model có ${ra.length} đầu ra (${ra.join(', ')}), cần 1 hoặc ${TEN_STEM.length}.`,
    );
  }
  return { tenVao: vao[0]!, tenRa: ra, raGop: ra.length === 1 };
}

/**
 * Bóc kết quả một khúc thành `[stem][kênh][mẫu]`.
 *
 * Tách khỏi phần gọi ONNX để kiểm được bằng dữ liệu dựng tay — đây là chỗ dễ
 * lệch chỉ số nhất, và lệch chỉ số ở đây nghĩa là tiếng trống chui vào tệp
 * giọng hát.
 */
export function bocKetQua(
  lay: (ten: string) => { data: Float32Array; dims: readonly number[] } | undefined,
  hopDong: HopDongModel,
  mauMoiKhuc: number,
): Float32Array[][] {
  const ra: Float32Array[][] = [];

  if (hopDong.raGop) {
    const t = lay(hopDong.tenRa[0]!);
    if (!t) throw new Error(`Model không trả đầu ra "${hopDong.tenRa[0]}"`);
    const can = TEN_STEM.length * 2 * mauMoiKhuc;
    if (t.data.length !== can) {
      throw new Error(
        `Đầu ra gộp có ${t.data.length} số, cần ${can} `
        + `(${TEN_STEM.length} stem × 2 kênh × ${mauMoiKhuc} mẫu). dims=[${t.dims.join(',')}]`,
      );
    }
    for (let s = 0; s < TEN_STEM.length; s++) {
      const goc = s * 2 * mauMoiKhuc;
      ra.push([
        t.data.slice(goc, goc + mauMoiKhuc),
        t.data.slice(goc + mauMoiKhuc, goc + 2 * mauMoiKhuc),
      ]);
    }
    return ra;
  }

  for (const ten of hopDong.tenRa) {
    const t = lay(ten);
    if (!t) throw new Error(`Model không trả đầu ra "${ten}"`);
    const can = 2 * mauMoiKhuc;
    if (t.data.length !== can) {
      throw new Error(
        `Đầu ra "${ten}" có ${t.data.length} số, cần ${can}. dims=[${t.dims.join(',')}]`,
      );
    }
    ra.push([t.data.slice(0, mauMoiKhuc), t.data.slice(mauMoiKhuc)]);
  }
  return ra;
}

export interface PhienTach {
  chay: ChayModel;
  hopDong: HopDongModel;
  dong: () => Promise<void>;
}

/**
 * Mở một phiên suy luận trên tệp model đã tải về.
 *
 * `soLuong` là số luồng CPU. Mặc định để onnxruntime tự quyết — nhưng máy nhà
 * còn phải chạy bốn dịch vụ GPU khác, nên giao diện nên cho hạ xuống.
 */
export async function moPhienTach(
  duongModel: string,
  opts: { soLuong?: number } = {},
): Promise<PhienTach> {
  const ort = napOrt();
  const phien = await ort.InferenceSession.create(duongModel, {
    executionProviders: ['cpu'],
    graphOptimizationLevel: 'all',
    ...(opts.soLuong ? { intraOpNumThreads: opts.soLuong } : {}),
  });

  const hopDong = docHopDong(phien);

  const chay: ChayModel = async (mix) => {
    if (mix.length !== 2) throw new Error(`cần 2 kênh, nhận ${mix.length}`);
    const mauMoiKhuc = mix[0]!.length;

    // Xếp phẳng theo thứ tự kênh: [kênh0 toàn bộ, kênh1 toàn bộ] — đúng bố cục
    // của tensor [1, 2, mẫu] mà ONNX đọc theo hàng.
    const phang = new Float32Array(2 * mauMoiKhuc);
    phang.set(mix[0]!, 0);
    phang.set(mix[1]!, mauMoiKhuc);

    const vao = new ort.Tensor('float32', phang, [1, 2, mauMoiKhuc]);
    const kq = await phien.run({ [hopDong.tenVao]: vao });
    return bocKetQua((ten) => kq[ten], hopDong, mauMoiKhuc);
  };

  return {
    chay,
    hopDong,
    dong: async () => { await phien.release?.(); },
  };
}
