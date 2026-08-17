/**
 * Điều khiển hộp cát Python.
 *
 * ─── MỘT WORKER DÙNG CHUNG, KHÔNG PHẢI MỘT WORKER MỖI KHỐI MÃ ───
 * Nạp Pyodide mất ~10MB và vài giây. Mỗi khối mã một worker nghĩa là trả cái
 * giá đó lại từ đầu ở mọi lần bấm. Dùng chung thì lần đầu chậm, những lần sau
 * gần như tức thì — và biến của lần chạy trước KHÔNG rò sang lần sau vì mỗi
 * lần đều chạy lại đoạn chuẩn bị.
 *
 * ⚠️ Worker chỉ được tạo khi người dùng THẬT SỰ bấm Chạy. Tạo sẵn lúc mở app là
 * bắt mọi người trả 10MB cho một tính năng phần lớn không dùng tới.
 */
import { useCallback, useRef, useState } from 'react';

export interface KetQuaChay {
  ra: string;
  loi: string | null;
  file: Array<{ ten: string; dulieu: Uint8Array }>;
}

/** Trần thời gian một lần chạy. Quá thì GIẾT worker — `while True:` không tự dừng. */
const TRAN_MS = 30_000;

export function useSandbox() {
  const workerRef = useRef<Worker | null>(null);
  const demRef = useRef(0);
  const [dangChay, datDangChay] = useState(false);
  const [tienTrinh, datTienTrinh] = useState<string | null>(null);

  const giet = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    datDangChay(false);
    datTienTrinh(null);
  }, []);

  const chay = useCallback(async (ma: string): Promise<KetQuaChay> => {
    datDangChay(true);
    datTienTrinh(null);

    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('./pythonWorker.ts', import.meta.url),
        { type: 'module' },
      );
    }
    const w = workerRef.current;
    const id = ++demRef.current;

    return new Promise<KetQuaChay>((xong) => {
      /**
       * Hết giờ ⇒ GIẾT worker, không chỉ bỏ qua kết quả.
       *
       * Python trong Pyodide chạy đồng bộ, nên một vòng lặp vô hạn KHÔNG dừng
       * khi ta thôi lắng nghe — nó tiếp tục ăn một nhân CPU tới khi đóng app.
       * `terminate()` là cách duy nhất thật sự cắt được.
       */
      const dongHo = setTimeout(() => {
        giet();
        xong({ ra: '', loi: `Quá ${TRAN_MS / 1000}s — đã dừng. Mã có vòng lặp không kết thúc?`, file: [] });
      }, TRAN_MS);

      const nghe = (e: MessageEvent): void => {
        const d = e.data as { id: number; loai: string; ra?: string; loi?: string; thongDiep?: string; file?: KetQuaChay['file'] };
        if (d.loai === 'nap') { datTienTrinh(d.thongDiep ?? null); return; }
        if (d.id !== id) return; // kết quả của lần chạy trước, đã bỏ

        clearTimeout(dongHo);
        w.removeEventListener('message', nghe);
        datDangChay(false);
        datTienTrinh(null);
        xong(d.loai === 'loi'
          ? { ra: '', loi: d.loi ?? 'Lỗi không rõ', file: [] }
          : { ra: d.ra ?? '', loi: null, file: d.file ?? [] });
      };

      w.addEventListener('message', nghe);
      w.postMessage({ id, ma });
    });
  }, [giet]);

  return { chay, giet, dangChay, tienTrinh };
}
