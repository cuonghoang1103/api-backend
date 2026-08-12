/**
 * ============================================================
 * Hạ tầng — số liệu VPS và máy GPU ở nhà
 * ============================================================
 *
 * Hai máy, hai cách lấy số:
 *
 *   VPS      đọc thẳng `/proc` từ trong container. Docker KHÔNG cách ly
 *            `/proc/stat`, `/proc/meminfo`, `/proc/loadavg` — chúng cho
 *            số của MÁY THẬT, đúng thứ ta cần.
 *   máy nhà  gọi `/may` của dịch vụ TTS qua đường hầm ngược. Không mở
 *            cổng mới: đường hầm chỉ chở cổng ghi trong `permitlisten`,
 *            sửa nó cần người dùng chạy tay.
 *
 * ⚠️ THỨ NÀO KHÔNG ĐO ĐƯỢC THÌ TRẢ `null`, ĐỪNG BỊA.
 *
 * VPS là máy ảo, không có `thermal_zone` nào — kiểm ngày 12/08/2026, chỉ
 * có `cooling_device`. Nên nhiệt độ VPS luôn `null`, và giao diện phải
 * ghi "không có cảm biến" chứ không vẽ một vòng tròn 45 °C cho đẹp. Một ô
 * trống là thông tin đúng; một con số bịa thì người ta sẽ tin, và tin sai
 * về nhiệt độ máy chủ là kiểu tin sai đắt tiền.
 */

import { readFile } from 'fs/promises';
import { statfs } from 'fs/promises';
import { logger } from '../../utils/logger.js';

export interface SoLieuMay {
  ten: string | null;
  heDieuHanh: string | null;
  nhan: string | null;
  uptimeGiay: number | null;
  cpu: {
    ten: string | null;
    soNhan: number;
    phanTram: number | null;
    tai: number[] | null;
  };
  ram: { tong: number | null; daDung: number | null; conDung: number | null };
  dia: { duong: string; tong: number | null; daDung: number | null; conTrong: number | null };
  nhiet: { cpu: number | null; cpuNguong: number | null; cpuToiHan: number | null; dia: number | null };
  gpu: Array<Record<string, unknown>>;
  dien?: Record<string, unknown>;
  dienThang?: Record<string, unknown>;
  lichSu?: Record<string, unknown>;
  dichVu?: Record<string, string>;
  online: boolean;
  loi?: string;
}

async function doc(duong: string): Promise<string | null> {
  try {
    return await readFile(duong, 'utf8');
  } catch {
    return null;
  }
}

/**
 * `%` CPU cần HAI lần đọc cách nhau — một lần chỉ cho trung bình từ lúc
 * khởi động máy, tức gần như đứng yên và vô dụng để theo dõi.
 *
 * Giữ mẫu trước trong module thay vì ngủ 200 ms mỗi lần gọi: trang này
 * tự làm mới vài giây một lần, nên mẫu trước luôn có sẵn và ta không bắt
 * người dùng chờ.
 */
let cpuTruoc: { ban: number; tong: number } | null = null;

async function cpuVps() {
  const info = (await doc('/proc/cpuinfo')) ?? '';
  const ten = info.match(/model name\s*:\s*(.+)/)?.[1]?.trim() ?? null;
  const soNhan = (info.match(/^processor\s*:/gm) ?? []).length;

  let phanTram: number | null = null;
  const st = (await doc('/proc/stat')) ?? '';
  const dong = st.split('\n').find((d) => d.startsWith('cpu '));
  if (dong) {
    const v = dong.split(/\s+/).slice(1).map(Number).filter(Number.isFinite);
    const tong = v.reduce((a, b) => a + b, 0);
    const ban = v.slice(0, 3).reduce((a, b) => a + b, 0) + v.slice(5).reduce((a, b) => a + b, 0);
    if (cpuTruoc) {
      const dB = ban - cpuTruoc.ban;
      const dT = tong - cpuTruoc.tong;
      if (dT > 0) phanTram = Math.round((1000 * dB) / dT) / 10;
    }
    cpuTruoc = { ban, tong };
  }

  const la = (await doc('/proc/loadavg')) ?? '';
  const p = la.split(/\s+/);
  const tai = p.length >= 3 ? [Number(p[0]), Number(p[1]), Number(p[2])] : null;

  return { ten, soNhan, phanTram, tai };
}

async function ramVps() {
  const mi = (await doc('/proc/meminfo')) ?? '';
  const lay = (k: string) => {
    const m = mi.match(new RegExp(`^${k}:\\s+(\\d+) kB`, 'm'));
    return m ? Number(m[1]) * 1024 : null;
  };
  const tong = lay('MemTotal');
  // `MemAvailable`, KHÔNG phải `MemFree`: Linux mượn RAM rảnh làm cache,
  // nên `MemFree` luôn thấp và nhìn vào đó ai cũng tưởng máy sắp hết RAM.
  const conDung = lay('MemAvailable') ?? lay('MemFree');
  return { tong, conDung, daDung: tong && conDung ? tong - conDung : null };
}

async function diaVps() {
  try {
    const s = await statfs('/');
    const tong = s.blocks * s.bsize;
    const conTrong = s.bavail * s.bsize;
    return { duong: '/', tong, conTrong, daDung: tong - conTrong };
  } catch {
    return { duong: '/', tong: null, conTrong: null, daDung: null };
  }
}

export async function soLieuVps(): Promise<SoLieuMay> {
  const [cpu, ram, dia, up, osRel] = await Promise.all([
    cpuVps(),
    ramVps(),
    diaVps(),
    doc('/proc/uptime'),
    doc('/etc/os-release'),
  ]);

  return {
    ten: process.env.VPS_TEN || 'VPS cuongthai.com',
    heDieuHanh: osRel?.match(/PRETTY_NAME="([^"]+)"/)?.[1] ?? null,
    nhan: (await doc('/proc/version'))?.split(' ')[2] ?? null,
    uptimeGiay: up ? Number(up.split(' ')[0]) : null,
    cpu,
    ram,
    dia,
    // Máy ảo: không có cảm biến nhiệt nào. Xem ghi chú đầu file.
    nhiet: { cpu: null, cpuNguong: null, cpuToiHan: null, dia: null },
    gpu: [],
    online: true,
  };
}

/**
 * Số liệu máy GPU ở nhà, lấy qua đường hầm ngược.
 *
 * Máy nhà TẮT hoặc mạng nhà rớt là chuyện bình thường, không phải lỗi —
 * trả `online: false` kèm lý do để trang hiện đúng trạng thái, thay vì
 * ném lỗi làm hỏng cả trang (VPS vẫn cần hiện được).
 */
export async function soLieuMayNha(): Promise<SoLieuMay> {
  const goc = (process.env.TTS_SERVICE_URL || 'http://tts:8080').replace(/\/+$/, '');
  const trong: SoLieuMay = {
    ten: 'Máy GPU ở nhà',
    heDieuHanh: null,
    nhan: null,
    uptimeGiay: null,
    cpu: { ten: null, soNhan: 0, phanTram: null, tai: null },
    ram: { tong: null, daDung: null, conDung: null },
    dia: { duong: '', tong: null, daDung: null, conTrong: null },
    nhiet: { cpu: null, cpuNguong: null, cpuToiHan: null, dia: null },
    gpu: [],
    online: false,
  };

  try {
    const res = await fetch(`${goc}/may`, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return { ...trong, loi: `HTTP ${res.status}` };
    const d = (await res.json()) as Record<string, unknown>;
    return { ...trong, ...(d as object), online: true } as SoLieuMay;
  } catch (e) {
    const li = e instanceof Error ? e.message : String(e);
    logger.debug('Hạ tầng: không lấy được số liệu máy nhà', { error: li });
    return {
      ...trong,
      loi:
        /timeout|abort/i.test(li)
          ? 'Máy nhà không trả lời — có thể đang tắt, mất mạng, hoặc đường hầm đứt.'
          : li,
    };
  }
}

/** Mức nhiệt → nhãn màu. Ngưỡng theo linh kiện, không dùng chung một thang. */
export function mucNhiet(
  doC: number | null,
  loai: 'cpu' | 'gpu' | 'dia',
): 'mat' | 'binh-thuong' | 'am' | 'nong' | 'nguy' | 'khong-co' {
  if (doC == null) return 'khong-co';
  // Ngưỡng khác nhau vì linh kiện khác nhau: GPU chạy 80 °C là bình
  // thường, còn ổ NVMe 80 °C là sắp hỏng. Dùng chung một thang là báo
  // động giả ở chỗ này và im lặng ở chỗ kia.
  const bang = {
    cpu: [45, 65, 80, 95],
    gpu: [50, 70, 83, 90],
    dia: [40, 55, 68, 75],
  }[loai];
  if (doC < bang[0]) return 'mat';
  if (doC < bang[1]) return 'binh-thuong';
  if (doC < bang[2]) return 'am';
  if (doC < bang[3]) return 'nong';
  return 'nguy';
}
