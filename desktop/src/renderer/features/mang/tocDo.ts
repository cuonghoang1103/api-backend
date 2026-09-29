/**
 * Engine đo tốc độ mạng — thuần TypeScript, không phụ thuộc React hay Electron.
 *
 * Nó chỉ cần: `base` (gốc API) + `token` (Bearer) + hàm gọi lại để báo số liệu
 * realtime. Vì tách khỏi khung nên đúng logic này chạy được ở cả app desktop
 * lẫn web (web truyền base = '' vì cùng origin, token qua cookie nên có thể bỏ
 * trống). Cách đo theo kiểu Speedtest/LibreSpeed: nhiều luồng song song, lấy
 * mẫu tốc độ tức thời mỗi ~200 ms, có giai đoạn KHỞI ĐỘNG bỏ đi (TCP còn đang
 * mở cửa sổ tắc nghẽn, đo lúc đó ra số thấp giả).
 */

export interface MauTocDo {
  /** Mbps tức thời tại thời điểm lấy mẫu. */
  mbps: number;
  /** Tổng byte đã truyền tính tới lúc này. */
  byte: number;
}

export interface KetQuaPing {
  /** Độ trễ trung bình (ms). */
  pingMs: number;
  /** Độ rung — trung bình chênh lệch giữa các lần đo liên tiếp (ms). */
  jitterMs: number;
}

export interface TuyChonDo {
  base: string;
  token: string | null;
  signal: AbortSignal;
}

function url(base: string, path: string): string {
  return `${base}${path}`;
}

function headers(token: string | null): HeadersInit {
  // KHÔNG gửi header tuỳ biến (vd X-Client-Platform): app desktop gọi
  // api.cuongthai.com QUA origin app:// — header lạ kích hoạt CORS preflight,
  // mà backend chỉ cho `Authorization`/`Content-Type`/… ⇒ trình duyệt chặn,
  // phép đo hỏng câm. Đo tốc độ cũng chẳng cần nhãn nền tảng.
  const h: Record<string, string> = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

/**
 * Ping: gọi endpoint bé nhất `lanDo` lần, đo round-trip. Jitter = trung bình
 * trị tuyệt đối chênh lệch giữa hai lần liên tiếp (đúng định nghĩa RFC 3550).
 */
export async function doPing(
  { base, token, signal }: TuyChonDo,
  lanDo = 12,
): Promise<KetQuaPing> {
  const rtt: number[] = [];
  for (let i = 0; i < lanDo; i += 1) {
    if (signal.aborted) break;
    const t0 = performance.now();
    try {
      await fetch(url(base, '/api/v1/toc-do-mang/ping'), {
        headers: headers(token),
        cache: 'no-store',
        signal,
      });
      rtt.push(performance.now() - t0);
    } catch {
      // Một lần lỗi không làm hỏng cả phép đo; bỏ qua mẫu đó.
    }
  }
  if (rtt.length === 0) return { pingMs: 0, jitterMs: 0 };
  // Bỏ lần đầu: kết nối/DNS lần đầu luôn chậm bất thường.
  const dung = rtt.length > 1 ? rtt.slice(1) : rtt;
  const trungBinh = dung.reduce((a, b) => a + b, 0) / dung.length;
  let jitter = 0;
  for (let i = 1; i < dung.length; i += 1) jitter += Math.abs((dung[i] ?? 0) - (dung[i - 1] ?? 0));
  jitter = dung.length > 1 ? jitter / (dung.length - 1) : 0;
  return { pingMs: trungBinh, jitterMs: jitter };
}

/**
 * Vòng lấy mẫu chung cho tải lên/xuống. `demByte()` trả tổng byte tích luỹ ở
 * thời điểm gọi. Trả về Mbps trung bình của GIAI ĐOẠN ĐO (sau khởi động).
 */
function layMau(
  demByte: () => number,
  onMau: (m: MauTocDo) => void,
  giayKhoiDong: number,
  giayDo: number,
  signal: AbortSignal,
): Promise<number> {
  return new Promise((resolve) => {
    const batDau = performance.now();
    let byteDauDo = 0;
    let tDauDo = 0;
    let byteTruoc = 0;
    let tTruoc = batDau;
    const dinhKy = setInterval(() => {
      const gio = performance.now();
      const byte = demByte();
      const dt = (gio - tTruoc) / 1000;
      if (dt > 0) {
        const mbps = ((byte - byteTruoc) * 8) / dt / 1e6;
        onMau({ mbps, byte });
      }
      byteTruoc = byte;
      tTruoc = gio;
      const troi = (gio - batDau) / 1000;
      if (troi >= giayKhoiDong && tDauDo === 0) {
        tDauDo = gio;
        byteDauDo = byte;
      }
      if (troi >= giayKhoiDong + giayDo || signal.aborted) {
        clearInterval(dinhKy);
        const dtDo = (performance.now() - tDauDo) / 1000;
        const mbps = tDauDo > 0 && dtDo > 0 ? ((demByte() - byteDauDo) * 8) / dtDo / 1e6 : 0;
        resolve(mbps);
      }
    }, 200);
  });
}

/**
 * Tải xuống: mở `luong` luồng song song, mỗi luồng lặp tải khối `khoiMB` và đọc
 * theo dòng để đếm byte thật khi chúng về. Đọc theo dòng (`getReader`) là điểm
 * mấu chốt — không đọc dòng thì trình duyệt đệm hết rồi mới trả, và ta không có
 * số liệu tức thời để vẽ đồng hồ.
 */
export async function doTaiXuong(
  opts: TuyChonDo,
  onMau: (m: MauTocDo) => void,
  cauHinh: { luong?: number; khoiMB?: number; giayKhoiDong?: number; giayDo?: number } = {},
): Promise<number> {
  const { base, token, signal } = opts;
  const luong = cauHinh.luong ?? 4;
  const khoiMB = cauHinh.khoiMB ?? 20;
  let tong = 0;

  // AbortController RIÊNG cho giai đoạn: hết giờ đo là huỷ MỌI lời gọi đang bay
  // (kể cả cái đang kẹt), nếu không `Promise.allSettled` chờ mãi ⇒ treo.
  const gd = new AbortController();
  const boNgoai = () => gd.abort();
  signal.addEventListener('abort', boNgoai, { once: true });

  const motLuong = async (): Promise<void> => {
    while (!gd.signal.aborted) {
      try {
        const res = await fetch(
          url(base, `/api/v1/toc-do-mang/tai-xuong?bytes=${khoiMB * 1024 * 1024}`),
          { headers: headers(token), cache: 'no-store', signal: gd.signal },
        );
        const reader = res.body?.getReader();
        if (!reader) break;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          tong += value?.byteLength ?? 0;
          if (gd.signal.aborted) { await reader.cancel().catch(() => {}); break; }
        }
      } catch {
        if (gd.signal.aborted) break;
        // lỗi mạng thoáng qua — thử lại vòng sau
      }
    }
  };

  const luongs = Array.from({ length: luong }, () => motLuong());
  const mbps = await layMau(() => tong, onMau, cauHinh.giayKhoiDong ?? 1, cauHinh.giayDo ?? 6, signal);
  gd.abort(); // cắt các lời gọi đang bay ⇒ luồng thoát ngay
  signal.removeEventListener('abort', boNgoai);
  await Promise.allSettled(luongs);
  return mbps;
}

/**
 * Tải lên: mở `luong` luồng, mỗi luồng lặp POST một khối ngẫu nhiên `khoiMB`.
 * Trình duyệt KHÔNG cho đo tiến trình gửi từng phần, nên đếm byte theo TỪNG
 * POST hoàn tất — khối nhỏ (mặc định 2 MB) đủ để đồng hồ nhúc nhích mượt.
 */
export async function doTaiLen(
  opts: TuyChonDo,
  onMau: (m: MauTocDo) => void,
  cauHinh: { luong?: number; khoiMB?: number; giayKhoiDong?: number; giayDo?: number } = {},
): Promise<number> {
  const { base, token, signal } = opts;
  const luong = cauHinh.luong ?? 3;
  const khoiMB = cauHinh.khoiMB ?? 2;
  const khoi = new Uint8Array(khoiMB * 1024 * 1024);
  // Đổ ngẫu nhiên để không bị nén dọc đường (crypto giới hạn 65536 byte/lần).
  for (let i = 0; i < khoi.length; i += 65536) {
    crypto.getRandomValues(khoi.subarray(i, Math.min(i + 65536, khoi.length)));
  }
  // Gửi thân dạng Blob, KHÔNG phải Uint8Array trần: Chromium/Electron gửi POST
  // với TypedArray đôi khi treo không dứt (đo thật: tải xuống chạy, tải lên
  // đứng ở 0.0 mãi). Blob là kiểu thân đáng tin nhất cho fetch.
  const than = new Blob([khoi], { type: 'application/octet-stream' });
  let tong = 0;

  const gd = new AbortController();
  const boNgoai = () => gd.abort();
  signal.addEventListener('abort', boNgoai, { once: true });

  const motLuong = async (): Promise<void> => {
    while (!gd.signal.aborted) {
      try {
        await fetch(url(base, '/api/v1/toc-do-mang/tai-len'), {
          method: 'POST',
          headers: { ...headers(token), 'Content-Type': 'application/octet-stream' },
          body: than,
          signal: gd.signal,
        });
        tong += khoi.byteLength;
      } catch {
        if (gd.signal.aborted) break;
      }
    }
  };

  const luongs = Array.from({ length: luong }, () => motLuong());
  const mbps = await layMau(() => tong, onMau, cauHinh.giayKhoiDong ?? 1, cauHinh.giayDo ?? 6, signal);
  gd.abort();
  signal.removeEventListener('abort', boNgoai);
  await Promise.allSettled(luongs);
  return mbps;
}

export interface KetQuaDayDu extends KetQuaPing {
  taiXuongMbps: number;
  taiLenMbps: number;
}

/**
 * Chạy trọn bộ: ping → tải xuống → tải lên, theo thứ tự (không cùng lúc — đo
 * song song thì hai chiều giành băng thông của nhau, ra số sai cho cả hai).
 */
export async function doTatCa(
  opts: TuyChonDo,
  onGiaiDoan: (gd: 'ping' | 'taiXuong' | 'taiLen', m: MauTocDo | null) => void,
): Promise<KetQuaDayDu> {
  const ping = await doPing(opts);
  const taiXuongMbps = await doTaiXuong(opts, (m) => onGiaiDoan('taiXuong', m));
  const taiLenMbps = await doTaiLen(opts, (m) => onGiaiDoan('taiLen', m));
  return { ...ping, taiXuongMbps, taiLenMbps };
}
