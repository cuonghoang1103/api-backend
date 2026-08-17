/**
 * ============================================================
 * HỘP CÁT PYTHON — chạy trong WEB WORKER
 * ============================================================
 *
 * ─── VÌ SAO KHÔNG CHẠY TRÊN VPS ───
 * Câu hỏi tự nhiên là "dựng container trên máy chủ". Ba lý do bỏ hướng đó:
 *
 *  1. VPS đang 83% đĩa (còn 8G) và chạy CHUNG máy với Postgres chứa toàn bộ dữ
 *     liệu người dùng. Chạy mã do model sinh ra ở đó là đặt mã lạ cạnh CSDL thật.
 *  2. Mỗi lần chạy phải dựng container, giới hạn CPU/RAM, cắt mạng, dọn rác —
 *     cả một hệ thống, và mỗi lỗ hổng thoát container là toàn bộ máy chủ.
 *  3. Trình duyệt ĐÃ LÀ một hộp cát mạnh hơn, đã được kiểm chứng bởi hàng tỉ
 *     máy, và nó miễn phí. WASM không có `fs`, không có tiến trình con, không
 *     với ra ngoài được.
 *
 * ─── VÌ SAO PHẢI LÀ WORKER, KHÔNG PHẢI LUỒNG CHÍNH ───
 * Python trong Pyodide chạy ĐỒNG BỘ. Một `while True:` trên luồng chính đóng
 * băng cả app — không bấm Dừng được, không đóng cửa sổ được, chỉ còn cách giết
 * tiến trình. Trong worker thì `terminate()` cắt nó tức thì, và giao diện không
 * hề khựng một khung hình nào.
 *
 * ─── FILE TĨNH, KHÔNG LẤY TỪ CDN ───
 * `indexURL` trỏ vào chính bundle của app. Lấy từ CDN nghĩa là phải nới
 * `connect-src` cho một tên miền bên ngoài, và mỗi lần chạy mã lại phụ thuộc
 * vào mạng — trong khi cả điểm của hộp cát là KHÔNG cần mạng.
 */

/// <reference lib="webworker" />

interface YeuCau {
  id: number;
  ma: string;
}

interface PhanHoi {
  id: number;
  loai: 'san-sang' | 'ket-qua' | 'loi' | 'nap';
  ra?: string;
  loi?: string;
  /** File script đã ghi ra `/xuat` — trả về để người dùng lưu. */
  file?: Array<{ ten: string; dulieu: Uint8Array }>;
  thongDiep?: string;
}

declare const self: DedicatedWorkerGlobalScope;

let pyodide: unknown = null;
let dangNap: Promise<unknown> | null = null;

/**
 * Mã Python chạy TRƯỚC mỗi lần chạy của người dùng.
 *
 * `/xuat` là quy ước xuất file: script ghi vào đó, app đọc ra và mời lưu. Có
 * một thư mục quy ước rõ ràng tốt hơn nhiều so với đoán xem script vừa tạo file
 * ở đâu trong hệ thống file ảo.
 */
const CHUAN_BI = `
import sys, io, os
os.makedirs('/xuat', exist_ok=True)
_out = io.StringIO()
sys.stdout = _out
sys.stderr = _out
`;

async function nap(): Promise<unknown> {
  if (pyodide) return pyodide;
  if (dangNap) return dangNap;

  dangNap = (async () => {
    self.postMessage({ id: 0, loai: 'nap', thongDiep: 'Đang nạp Python (lần đầu ~10MB)…' } satisfies PhanHoi);
    /**
     * ⚠️ Nạp bằng biến, KHÔNG bằng chuỗi hằng.
     *
     * `import('/pyodide/pyodide.mjs')` với chuỗi hằng khiến TypeScript đi tìm
     * khai báo kiểu cho một module không tồn tại lúc biên dịch (nó là file tĩnh
     * trong bundle, không phải gói npm), và bundler thì cố phân giải nó. Qua
     * một biến thì cả hai đều để yên và đường dẫn được giải lúc CHẠY — đúng thứ
     * ta muốn, vì file chỉ tồn tại trong bản dựng.
     */
    const duong = '/pyodide/pyodide.mjs';
    const mod = await import(/* @vite-ignore */ duong) as {
      loadPyodide: (o: { indexURL: string }) => Promise<unknown>;
    };
    pyodide = await mod.loadPyodide({ indexURL: '/pyodide/' });
    return pyodide;
  })();
  return dangNap;
}

self.onmessage = async (e: MessageEvent<YeuCau>) => {
  const { id, ma } = e.data;
  try {
    const py = (await nap()) as {
      runPythonAsync: (s: string) => Promise<unknown>;
      globals: { get: (k: string) => unknown };
      FS: {
        readdir: (p: string) => string[];
        readFile: (p: string, o: { encoding: 'binary' }) => Uint8Array;
        unlink: (p: string) => void;
      };
    };

    await py.runPythonAsync(CHUAN_BI);
    await py.runPythonAsync(ma);
    const ra = String(await py.runPythonAsync('_out.getvalue()'));

    // Gom file script vừa ghi ra `/xuat`.
    const file: Array<{ ten: string; dulieu: Uint8Array }> = [];
    for (const ten of py.FS.readdir('/xuat')) {
      if (ten === '.' || ten === '..') continue;
      try {
        file.push({ ten, dulieu: py.FS.readFile(`/xuat/${ten}`, { encoding: 'binary' }) });
        // Xoá sau khi đọc: lần chạy sau không được thừa hưởng file của lần
        // trước, nếu không người dùng lưu nhầm kết quả cũ.
        py.FS.unlink(`/xuat/${ten}`);
      } catch { /* thư mục con hoặc file không đọc được — bỏ qua */ }
    }

    self.postMessage({ id, loai: 'ket-qua', ra, file } satisfies PhanHoi);
  } catch (err) {
    // Traceback của Python nằm trong `message`. Giữ NGUYÊN VĂN: dòng cuối của
    // nó chính là thứ người dùng cần đọc, cắt gọn đi là lấy mất câu trả lời.
    self.postMessage({ id, loai: 'loi', loi: (err as Error).message } satisfies PhanHoi);
  }
};

export {};
