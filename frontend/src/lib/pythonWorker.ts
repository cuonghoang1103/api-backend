/**
 * ============================================================
 * HỘP CÁT PYTHON TRÊN WEB — chạy trong WEB WORKER
 * ============================================================
 *
 * Bản song sinh của `desktop/src/main/.../pythonWorker.ts`, khác đúng MỘT chỗ:
 * nguồn nạp Pyodide.
 *
 *  • App desktop bọc sẵn 30MB Pyodide + wheel trong bản cài, vì nó phải chạy
 *    được khi mất mạng và CSP của nó chỉ cho tải từ origin `app://`.
 *  • Web nạp từ CDN. Nhồi 30MB vào `frontend/public/` nghĩa là mỗi ảnh Docker
 *    nặng thêm chừng ấy trên một VPS đã từng đầy đĩa tới mức Postgres chết —
 *    trong khi người mở trang web thì vốn đang online.
 *
 * ─── VÌ SAO KHÔNG CHẠY TRÊN MÁY CHỦ ───
 * Mã do model sinh ra không được chạy cạnh CSDL thật. Trình duyệt ĐÃ LÀ một
 * hộp cát mạnh hơn bất cứ container nào ta tự dựng: WASM không có `fs`, không
 * có tiến trình con, không với ra ngoài được. Và nó miễn phí.
 *
 * ─── VÌ SAO PHẢI LÀ WORKER ───
 * Python trong Pyodide chạy ĐỒNG BỘ. Một `while True:` trên luồng chính đóng
 * băng cả tab — không bấm Dừng được, không đóng được. Trong worker thì
 * `terminate()` cắt tức thì.
 */

/// <reference lib="webworker" />

/** Phải khớp phiên bản `pyodide` mà app desktop dùng, để hai bên cùng hành vi. */
const PYODIDE_VERSION = '314.0.5';
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

interface YeuCau { id: number; ma: string }

interface PhanHoi {
  id: number;
  loai: 'ket-qua' | 'loi' | 'nap';
  ra?: string;
  loi?: string;
  file?: Array<{ ten: string; dulieu: Uint8Array }>;
  thongDiep?: string;
}

declare const self: DedicatedWorkerGlobalScope;

let pyodide: unknown = null;
let dangNap: Promise<unknown> | null = null;

/**
 * Mã chạy TRƯỚC mã của người dùng ở mỗi lượt.
 *
 * `/xuat` là quy ước xuất file: script ghi vào đó, trang đọc ra và mời tải về.
 *
 * MPLBACKEND phải đặt bằng BIẾN MÔI TRƯỜNG, không phải `matplotlib.use()`: lúc
 * này người dùng chưa import matplotlib nên `sys.modules` chưa có nó, và mọi
 * nhánh "if 'matplotlib' in sys.modules" đều sai. matplotlib đọc biến này ngay
 * lúc import. Không đặt thì bộ vẽ mặc định đi tìm một cửa sổ không tồn tại.
 */
const CHUAN_BI = `
import sys, io, os
os.makedirs('/xuat', exist_ok=True)
_out = io.StringIO()
sys.stdout = _out
sys.stderr = _out
os.environ['MPLBACKEND'] = 'AGG'
`;

async function nap(): Promise<unknown> {
  if (pyodide) return pyodide;
  if (dangNap) return dangNap;

  dangNap = (async () => {
    self.postMessage({ id: 0, loai: 'nap', thongDiep: 'Đang nạp Python (lần đầu ~10MB)…' } satisfies PhanHoi);
    // Nạp qua BIẾN: chuỗi hằng khiến bundler cố phân giải một module chỉ tồn
    // tại lúc chạy.
    const duong = `${CDN}pyodide.mjs`;
    const mod = (await import(/* @vite-ignore */ /* webpackIgnore: true */ duong)) as {
      loadPyodide: (o: { indexURL: string }) => Promise<unknown>;
    };
    pyodide = await mod.loadPyodide({ indexURL: CDN });
    return pyodide;
  })();
  return dangNap;
}

self.onmessage = async (e: MessageEvent<YeuCau>) => {
  const { id, ma } = e.data;
  try {
    const py = (await nap()) as {
      runPythonAsync: (s: string) => Promise<unknown>;
      loadPackagesFromImports: (s: string) => Promise<unknown>;
      FS: {
        readdir: (p: string) => string[];
        readFile: (p: string, o: { encoding: 'binary' }) => Uint8Array;
        unlink: (p: string) => void;
      };
    };

    // Nạp gói theo ĐÚNG những gì mã import (numpy, pandas, matplotlib…), kèm
    // toàn bộ phụ thuộc. Nạp sẵn cho mọi lượt là bắt người chỉ in "hello" chờ.
    try {
      await py.loadPackagesFromImports(ma);
    } catch (err) {
      self.postMessage({ id, loai: 'nap', thongDiep: `Không nạp được gói: ${(err as Error).message}` } satisfies PhanHoi);
    }

    await py.runPythonAsync(CHUAN_BI);
    await py.runPythonAsync(ma);

    /**
     * Lưu MỌI biểu đồ còn mở, SAU khi mã người dùng chạy xong.
     *
     * Với bộ vẽ AGG thì `plt.show()` là lệnh RỖNG — chạy êm, không lỗi, không
     * có gì hiện ra, nên người chép đúng mã mẫu trên mạng nhận về khung trống.
     * Quét ở đây bắt được cả trường hợp đó lẫn trường hợp quên gọi `show()`.
     */
    await py.runPythonAsync(`
if 'matplotlib.pyplot' in sys.modules:
    import warnings
    _plt = sys.modules['matplotlib.pyplot']
    # ⚠️ Dập cảnh báo CHỈ QUANH lệnh của MÌNH.
    #
    # matplotlib 3.10 phun MatplotlibDeprecationWarning ("x parameter as float
    # was deprecated") ở MỖI lần savefig. Đây là lệnh do ta gọi, không phải
    # người dùng — nhưng nó in ra SAU đầu ra của họ nên trông y như mã họ vừa
    # viết bị lỗi, và họ không sửa được gì. \`catch_warnings\` giới hạn đúng
    # khối này: cảnh báo từ mã NGƯỜI DÙNG vẫn hiện nguyên.
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        for _i, _n in enumerate(_plt.get_fignums(), 1):
            _plt.figure(_n).savefig('/xuat/bieu-do-%d.png' % _i, dpi=110, bbox_inches='tight')
        _plt.close('all')
`);

    const ra = String(await py.runPythonAsync('_out.getvalue()'));

    const file: Array<{ ten: string; dulieu: Uint8Array }> = [];
    for (const ten of py.FS.readdir('/xuat')) {
      if (ten === '.' || ten === '..') continue;
      try {
        file.push({ ten, dulieu: py.FS.readFile(`/xuat/${ten}`, { encoding: 'binary' }) });
        // Xoá sau khi đọc: lần chạy sau không được thừa hưởng file lần trước,
        // nếu không người dùng tải nhầm kết quả cũ.
        py.FS.unlink(`/xuat/${ten}`);
      } catch { /* thư mục con hoặc file không đọc được */ }
    }

    self.postMessage({ id, loai: 'ket-qua', ra, file } satisfies PhanHoi);
  } catch (err) {
    /**
     * ⚠️ `(err as Error).message` CÓ THỂ RỖNG — đo thật với
     * `import mot_goi_khong_ton_tai`, giao diện hiện đúng chữ "Lỗi:" rồi hết.
     * Phần in ra mới là thứ đáng giá: `CHUAN_BI` chuyển hướng `sys.stderr` vào
     * `_out`, nên traceback của Python nằm ở đó chứ không lên `message`.
     */
    let loi = (err as Error)?.message || String(err ?? '');
    try {
      const daIn = String(await (pyodide as { runPythonAsync: (s: string) => Promise<unknown> })
        .runPythonAsync('_out.getvalue()'));
      if (daIn.trim()) loi = loi.trim() ? `${daIn.trimEnd()}\n${loi}` : daIn;
    } catch { /* hộp cát chết hẳn */ }
    self.postMessage({ id, loai: 'loi', loi: loi.trim() || 'Lỗi không rõ (không có thông báo).' } satisfies PhanHoi);
  }
};

export {};
