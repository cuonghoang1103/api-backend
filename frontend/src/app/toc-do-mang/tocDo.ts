/**
 * Engine đo tốc độ mạng cho WEB.
 *
 * Bản song sinh của `desktop/src/renderer/features/mang/tocDo.ts`. Khác một
 * điểm cốt yếu: web gọi cùng origin qua proxy `/api/v1`, xác thực bằng COOKIE
 * (`credentials: 'include'`) — không có Bearer token như app desktop. Vì hai
 * kho tách nhau nên logic được chép lại thay vì import chung; giữ hai bản khớp
 * nhau khi sửa.
 *
 * Cách đo (kiểu Speedtest/LibreSpeed): nhiều luồng song song, lấy mẫu tốc độ
 * tức thời mỗi ~200 ms, bỏ giai đoạn KHỞI ĐỘNG (TCP còn mở cửa sổ tắc nghẽn).
 */

const GOC = '/api/v1/toc-do-mang';

export interface MauTocDo {
  mbps: number;
  byte: number;
}

export interface KetQuaPing {
  pingMs: number;
  jitterMs: number;
}

function fetchApi(path: string, init: RequestInit, signal: AbortSignal): Promise<Response> {
  return fetch(`${GOC}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    signal,
  });
}

export async function doPing(signal: AbortSignal, lanDo = 12): Promise<KetQuaPing> {
  const rtt: number[] = [];
  for (let i = 0; i < lanDo; i += 1) {
    if (signal.aborted) break;
    const t0 = performance.now();
    try {
      await fetchApi('/ping', {}, signal);
      rtt.push(performance.now() - t0);
    } catch {
      /* bỏ mẫu lỗi */
    }
  }
  if (rtt.length === 0) return { pingMs: 0, jitterMs: 0 };
  const dung = rtt.length > 1 ? rtt.slice(1) : rtt;
  const trungBinh = dung.reduce((a, b) => a + b, 0) / dung.length;
  let jitter = 0;
  for (let i = 1; i < dung.length; i += 1) jitter += Math.abs((dung[i] ?? 0) - (dung[i - 1] ?? 0));
  jitter = dung.length > 1 ? jitter / (dung.length - 1) : 0;
  return { pingMs: trungBinh, jitterMs: jitter };
}

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
      if (dt > 0) onMau({ mbps: ((byte - byteTruoc) * 8) / dt / 1e6, byte });
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
        resolve(tDauDo > 0 && dtDo > 0 ? ((demByte() - byteDauDo) * 8) / dtDo / 1e6 : 0);
      }
    }, 200);
  });
}

export async function doTaiXuong(
  signal: AbortSignal,
  onMau: (m: MauTocDo) => void,
  cauHinh: { luong?: number; khoiMB?: number; giayKhoiDong?: number; giayDo?: number } = {},
): Promise<number> {
  const luong = cauHinh.luong ?? 4;
  const khoiMB = cauHinh.khoiMB ?? 20;
  let tong = 0;
  let dung = false;

  const motLuong = async (): Promise<void> => {
    while (!dung && !signal.aborted) {
      try {
        const res = await fetchApi(`/tai-xuong?bytes=${khoiMB * 1024 * 1024}`, {}, signal);
        const reader = res.body?.getReader();
        if (!reader) break;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          tong += value?.byteLength ?? 0;
          if (dung || signal.aborted) { await reader.cancel().catch(() => {}); break; }
        }
      } catch {
        if (signal.aborted) break;
      }
    }
  };

  const luongs = Array.from({ length: luong }, () => motLuong());
  const mbps = await layMau(() => tong, onMau, cauHinh.giayKhoiDong ?? 1, cauHinh.giayDo ?? 6, signal);
  dung = true;
  await Promise.allSettled(luongs);
  return mbps;
}

export async function doTaiLen(
  signal: AbortSignal,
  onMau: (m: MauTocDo) => void,
  cauHinh: { luong?: number; khoiMB?: number; giayKhoiDong?: number; giayDo?: number } = {},
): Promise<number> {
  const luong = cauHinh.luong ?? 3;
  const khoiMB = cauHinh.khoiMB ?? 2;
  const khoi = new Uint8Array(khoiMB * 1024 * 1024);
  for (let i = 0; i < khoi.length; i += 65536) {
    crypto.getRandomValues(khoi.subarray(i, Math.min(i + 65536, khoi.length)));
  }
  let tong = 0;
  let dung = false;

  const motLuong = async (): Promise<void> => {
    while (!dung && !signal.aborted) {
      try {
        await fetchApi('/tai-len', {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: khoi,
        }, signal);
        tong += khoi.byteLength;
      } catch {
        if (signal.aborted) break;
      }
    }
  };

  const luongs = Array.from({ length: luong }, () => motLuong());
  const mbps = await layMau(() => tong, onMau, cauHinh.giayKhoiDong ?? 1, cauHinh.giayDo ?? 6, signal);
  dung = true;
  await Promise.allSettled(luongs);
  return mbps;
}
