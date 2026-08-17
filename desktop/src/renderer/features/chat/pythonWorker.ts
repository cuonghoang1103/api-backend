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

# ─── matplotlib ───────────────────────────────────────────────
# Đặt bộ vẽ bằng BIẾN MÔI TRƯỜNG, không phải matplotlib.use().
#
# Bộ vẽ mặc định cố mở một cửa sổ; trong worker không có DOM nên nó ném lỗi khó
# hiểu. Nhưng gọi matplotlib.use('AGG') ở đây thì VÔ TÁC DỤNG: lúc này người
# dùng chưa import matplotlib, sys.modules chưa có nó, nên mọi nhánh
# "if 'matplotlib' in sys.modules" đều sai. matplotlib đọc MPLBACKEND ngay lúc
# import, nên đặt trước là chắc chắn đúng — và vô hại khi không ai dùng nó.
os.environ['MPLBACKEND'] = 'AGG'
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
      loadPackagesFromImports: (s: string) => Promise<unknown>;
      globals: { get: (k: string) => unknown };
      FS: {
        readdir: (p: string) => string[];
        readFile: (p: string, o: { encoding: 'binary' }) => Uint8Array;
        unlink: (p: string) => void;
      };
    };

    /**
     * Nạp gói theo ĐÚNG những gì mã import.
     *
     * `loadPackagesFromImports` đọc mã, tìm các `import`, và nạp gói tương ứng
     * cùng toàn bộ phụ thuộc. Nạp sẵn numpy+pandas+matplotlib cho mọi lần chạy
     * là bắt người chỉ in "hello" phải chờ vài giây và tốn bộ nhớ vô ích.
     *
     * Wheel nằm trong bản dựng (`public/pyodide/*.whl`), nên bước này KHÔNG
     * cần mạng — xem `scripts/tai-goi-python.mjs`.
     */
    try {
      await py.loadPackagesFromImports(ma);
    } catch (e) {
      // Import một gói không có trong bộ ⇒ báo rõ, đừng để mã chạy tiếp rồi
      // chết bằng ModuleNotFoundError khó hiểu hơn.
      self.postMessage({
        id, loai: 'nap',
        thongDiep: `Không nạp được gói: ${(e as Error).message}`,
      } satisfies PhanHoi);
    }

    await py.runPythonAsync(CHUAN_BI);
    await py.runPythonAsync(ma);
    /**
     * Lưu MỌI biểu đồ còn mở, SAU khi mã người dùng chạy xong.
     *
     * Không vá `plt.show()` mà quét ở đây, vì hai lý do gộp lại thành một cách
     * làm đơn giản hơn: với bộ vẽ AGG thì `show()` là lệnh RỖNG (chạy êm,
     * không lỗi, không có gì hiện ra — người dùng viết đúng mã mẫu trên mạng
     * rồi nhận khung trống), và rất nhiều người quên gọi `show()` hẳn. Quét
     * cuối lượt bắt được cả hai trường hợp.
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
    /**
     * ⚠️ `(err as Error).message` CÓ THỂ RỖNG.
     *
     * Đo thật: `import mot_goi_khong_ton_tai` làm worker gửi về `loi: ""`, và
     * giao diện hiện đúng chữ "Lỗi:" rồi hết — người dùng không biết gì hơn
     * lúc chưa bấm. Nên lấy theo thứ tự: `message` → `String(err)` → và quan
     * trọng nhất là NHỮNG GÌ ĐÃ IN RA trước khi chết.
     *
     * Phần in ra đặc biệt cần vì `CHUAN_BI` chuyển hướng `sys.stderr` vào
     * `_out`: traceback của Python chảy vào đó chứ không lên `message`.
     */
    let loi = (err as Error)?.message || String(err ?? '');
    try {
      const daIn = String(await (pyodide as { runPythonAsync: (s: string) => Promise<unknown> })
        .runPythonAsync('_out.getvalue()'));
      if (daIn.trim()) loi = loi.trim() ? `${daIn.trimEnd()}\n${loi}` : daIn;
    } catch { /* hộp cát chết hẳn — dùng những gì đang có */ }
    self.postMessage({ id, loai: 'loi', loi: loi.trim() || 'Lỗi không rõ (không có thông báo).' } satisfies PhanHoi);
  }
};

export {};
