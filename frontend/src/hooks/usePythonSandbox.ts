'use client';

/**
 * Điều khiển hộp cát Python trên web.
 *
 * ─── MỘT WORKER DÙNG CHUNG CHO CẢ TRANG ───
 * Nạp Pyodide mất ~10MB và vài giây. Mỗi khối mã một worker nghĩa là trả cái
 * giá đó lại từ đầu ở mọi lần bấm — và một cuộc trò chuyện có thể có chục khối
 * mã. Dùng chung thì lần đầu chậm, những lần sau gần như tức thì, và biến của
 * lần trước KHÔNG rò sang lần sau vì mỗi lượt đều chạy lại đoạn chuẩn bị.
 *
 * ⚠️ Worker chỉ được tạo khi người dùng THẬT SỰ bấm Chạy. Tạo sẵn lúc mở trang
 * là bắt mọi người tải 10MB cho một tính năng phần lớn không dùng tới.
 */
import { useCallback, useRef, useState } from 'react';

export interface KetQuaChay {
  ra: string;
  loi: string | null;
  file: Array<{ ten: string; dulieu: Uint8Array }>;
}

/** Trần một lượt chạy. Quá thì GIẾT worker — `while True:` không tự dừng. */
const TRAN_MS = 60_000;

/** Worker dùng chung toàn trang, ngoài React để mọi khối mã thấy cùng một cái. */
let workerChung: Worker | null = null;

function layWorker(): Worker {
  if (!workerChung) {
    workerChung = new Worker(new URL('../lib/pythonWorker.ts', import.meta.url));
  }
  return workerChung;
}

function huyWorker(): void {
  workerChung?.terminate();
  workerChung = null;
}

export function usePythonSandbox() {
  const demRef = useRef(0);
  const [dangChay, setDangChay] = useState(false);
  const [tienTrinh, setTienTrinh] = useState<string | null>(null);

  const giet = useCallback(() => {
    huyWorker();
    setDangChay(false);
    setTienTrinh(null);
  }, []);

  const chay = useCallback(async (ma: string): Promise<KetQuaChay> => {
    setDangChay(true);
    setTienTrinh(null);
    const w = layWorker();
    const id = ++demRef.current;

    return new Promise<KetQuaChay>((xong) => {
      /**
       * Hết giờ ⇒ GIẾT worker, không chỉ thôi lắng nghe.
       *
       * Python trong Pyodide chạy đồng bộ, nên vòng lặp vô hạn KHÔNG dừng khi
       * ta bỏ đi — nó tiếp tục ăn một nhân CPU tới khi đóng tab.
       */
      const dongHo = setTimeout(() => {
        giet();
        xong({ ra: '', loi: `Quá ${TRAN_MS / 1000}s — đã dừng. Mã có vòng lặp không kết thúc?`, file: [] });
      }, TRAN_MS);

      const nghe = (e: MessageEvent): void => {
        const d = e.data as {
          id: number; loai: string; ra?: string; loi?: string; thongDiep?: string; file?: KetQuaChay['file'];
        };
        if (d.loai === 'nap') { setTienTrinh(d.thongDiep ?? null); return; }
        if (d.id !== id) return; // kết quả của lượt trước, đã bỏ

        clearTimeout(dongHo);
        w.removeEventListener('message', nghe);
        setDangChay(false);
        setTienTrinh(null);
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
