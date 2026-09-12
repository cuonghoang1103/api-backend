/**
 * ============================================================
 * XƯỞNG REMIX — quản phiên làm việc
 * ============================================================
 *
 * Nối `phanTich`/`tachStem` với thế giới thật: tệp trên đĩa, tiến độ, huỷ.
 *
 * ─── Vì sao âm thanh đi qua ĐĨA chứ không giữ trong bộ nhớ ───
 * Một bài 5 phút ở 44,1 kHz stereo là ~106 MB số thực. Giữ nó trong RAM của
 * main process suốt phiên làm việc, cộng thêm 4 stem đầu ra (424 MB nữa), là
 * đủ để một máy 8 GB bắt đầu tráo trang giữa lúc đang tách — và người dùng
 * thấy "app đơ" chứ không thấy "hết RAM".
 *
 * Nên: nạp xong ghi ngay ra WAV tạm, rồi mỗi việc tự đọc lại phần nó cần.
 * Đọc lại một tệp 106 MB mất ~0,2 giây; tách stem mất vài phút. Đổi 0,2 giây
 * lấy 500 MB RAM là món hời.
 *
 * ─── Vì sao renderer phải lấy mẫu lại, không phải main ───
 * htdemucs đòi đúng 44,1 kHz. Renderer là Chromium: `OfflineAudioContext` của
 * nó lấy mẫu lại đúng chuẩn, không tốn dòng mã nào của ta. Viết một bộ lấy mẫu
 * lại ở main chỉ để làm lại việc đó, kém hơn, và thêm một chỗ để sai.
 */
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { doTatCa, type KetQuaDo } from './amLuong';
import { ghepDuoc, maCamelot, tenTong, type Tong } from './camelot';
import { doNhip, doTong } from './nhipVaTong';
import { moPhienTach } from './onnxChay';
import { TAN_SO_MODEL, TEN_STEM, tachStem, type TenStem } from './tachStem';
import { docWav, ghiWav, gopMono, type AmThanh } from './wav';

export interface BaiDaNap {
  id: string;
  ten: string;
  giay: number;
  soKenh: number;
}

export interface KetQuaPhanTich {
  bpm: number;
  bpmTinCay: number;
  /** Tên tông đọc được, ví dụ `Am`. */
  tong: string;
  tongCamelot: string;
  tongTinCay: number;
  /** Đáp án xếp nhì — hiện ra khi tin cậy thấp. */
  tongNhi: string | null;
  /** Các mã Camelot ghép được, kèm lời giải thích. */
  ghep: Array<{ ma: string; vi: string }>;
  do: KetQuaDo;
}

export interface TienDoXuong {
  id: string;
  viec: 'tach' | 'taiModel';
  xong: number;
  tong: number;
  ghiChu?: string;
}

interface Phien {
  id: string;
  ten: string;
  duongWav: string;
  giay: number;
  soKenh: number;
  huy: AbortController | null;
}

const phien = new Map<string, Phien>();

export function thuMucPhien(userData: string): string {
  return path.join(userData, 'nhac', 'phien');
}

function thuMucRa(userData: string, id: string): string {
  return path.join(thuMucPhien(userData), id);
}

/**
 * Nhận PCM đã giải mã từ renderer và ghi ra WAV tạm.
 *
 * `mau` là float32 little-endian XEN KẼ theo mẫu (L,R,L,R…) — đúng bố cục mà
 * `getChannelData` ghép lại và `Float32Array` của renderer gửi sang.
 */
export async function napBai(
  userData: string,
  ten: string,
  mau: Uint8Array,
  soKenh: number,
  tanSoMau: number,
): Promise<BaiDaNap> {
  if (tanSoMau !== TAN_SO_MODEL) {
    throw new Error(
      `Xưởng Remix cần ${TAN_SO_MODEL} Hz, nhận ${tanSoMau} Hz. `
      + 'Renderer phải lấy mẫu lại bằng OfflineAudioContext trước khi gửi.',
    );
  }
  if (soKenh < 1 || soKenh > 8) throw new Error(`Số kênh lạ: ${soKenh}`);

  /* `mau.buffer` có thể là bộ đệm LỚN HƠN khung nhìn (Node hay tái dùng bộ
     đệm cho payload IPC). Bỏ qua `byteOffset`/`byteLength` là đọc nhầm sang dữ
     liệu của người khác — ra nhiễu ở đầu bài, không ra lỗi. */
  const so = new Float32Array(mau.buffer, mau.byteOffset, mau.byteLength / 4);
  const soMau = Math.floor(so.length / soKenh);
  if (soMau === 0) throw new Error('Bài rỗng');

  const kenh: Float32Array[] = [];
  for (let c = 0; c < soKenh; c++) {
    const k = new Float32Array(soMau);
    for (let i = 0; i < soMau; i++) k[i] = so[i * soKenh + c]!;
    kenh.push(k);
  }

  const id = randomUUID();
  const thuMuc = thuMucRa(userData, id);
  await fs.mkdir(thuMuc, { recursive: true });
  const duongWav = path.join(thuMuc, 'goc.wav');
  await fs.writeFile(duongWav, Buffer.from(ghiWav({ kenh, tanSoMau })));

  const p: Phien = { id, ten, duongWav, giay: soMau / tanSoMau, soKenh, huy: null };
  phien.set(id, p);
  return { id, ten, giay: p.giay, soKenh };
}

function layPhien(id: string): Phien {
  const p = phien.get(id);
  if (!p) throw new Error(`Phiên "${id}" không còn — có thể app đã khởi động lại.`);
  return p;
}

async function docBai(p: Phien): Promise<AmThanh> {
  return docWav(
    (await fs.readFile(p.duongWav)).buffer as ArrayBuffer,
  );
}

/** Phân tích: nhịp, tông, và toàn bộ phép đo để chấm bài. */
export async function phanTich(id: string): Promise<KetQuaPhanTich> {
  const am = await docBai(layPhien(id));
  const mono = gopMono(am);

  const nhip = doNhip(mono, am.tanSoMau);
  const t = doTong(mono, am.tanSoMau);
  const tong: Tong = { chuAm: t.chuAm, the: t.the };

  return {
    bpm: Math.round(nhip.bpm * 10) / 10,
    bpmTinCay: nhip.tinCay,
    tong: tenTong(tong),
    tongCamelot: maCamelot(tong),
    tongTinCay: t.tinCay,
    tongNhi: t.nhi ? tenTong({ chuAm: t.nhi.chuAm, the: t.nhi.the }) : null,
    // Bỏ mục đầu (chính nó) — gợi ý "ghép với chính nó" không nói lên gì.
    ghep: ghepDuoc(tong).slice(1).map((g) => ({ ma: g.ma, vi: g.vi })),
    do: doTatCa(am),
  };
}

export interface KetQuaTachRa {
  thuMuc: string;
  tep: Record<TenStem, string>;
  giay: number;
}

/**
 * Tách bài thành bốn stem và ghi ra đĩa.
 *
 * Mở phiên ONNX MỚI cho mỗi bài rồi đóng ngay. Giữ phiên sống giữa các bài
 * tiết kiệm được ~2 giây nạp model, nhưng giữ luôn ~2 GB RAM của đồ thị đã nạp
 * — mà người dùng thường tách một bài rồi đi làm việc khác hàng chục phút.
 */
export async function tach(
  userData: string,
  id: string,
  duongModel: string,
  onTienDo: (t: TienDoXuong) => void,
  soLuong?: number,
): Promise<KetQuaTachRa> {
  const p = layPhien(id);
  if (p.huy) throw new Error('Bài này đang được tách rồi');

  const batDau = Date.now();
  p.huy = new AbortController();
  const phienOnnx = await moPhienTach(duongModel, soLuong ? { soLuong } : {});

  try {
    const am = await docBai(p);
    const kq = await tachStem(am, phienOnnx.chay, {
      tienDo: (xong, tong) => onTienDo({ id, viec: 'tach', xong, tong }),
      huy: p.huy.signal,
    });

    const thuMuc = thuMucRa(userData, id);
    const tep = {} as Record<TenStem, string>;
    for (const ten of TEN_STEM) {
      const duong = path.join(thuMuc, `${ten}.wav`);
      await fs.writeFile(duong, Buffer.from(ghiWav(kq.stem[ten])));
      tep[ten] = duong;
    }
    return { thuMuc, tep, giay: (Date.now() - batDau) / 1000 };
  } finally {
    p.huy = null;
    await phienOnnx.dong();
  }
}

export function huyTach(id: string): boolean {
  const p = phien.get(id);
  if (!p?.huy) return false;
  p.huy.abort();
  return true;
}

/** Xoá tệp tạm của một phiên. Gọi khi người dùng đóng bài. */
export async function donDep(userData: string, id: string): Promise<void> {
  huyTach(id);
  phien.delete(id);
  await fs.rm(thuMucRa(userData, id), { recursive: true, force: true });
}

/**
 * Xoá mọi tệp tạm còn sót.
 *
 * Gọi lúc app khởi động: `phien` là bảng trong BỘ NHỚ, nên đóng app giữa chừng
 * là mất hết đường tìm lại các thư mục cũ — chúng nằm im trên đĩa và mỗi bài
 * chiếm hàng trăm MB. Không có bước này thì sau một tháng dùng, thư mục
 * `userData` phình lên vài chục GB mà không có gì trỏ tới chúng.
 */
export async function donDepTatCa(userData: string): Promise<number> {
  const goc = thuMucPhien(userData);
  let da = 0;
  let muc: string[];
  try {
    muc = await fs.readdir(goc);
  } catch {
    return 0; // chưa dùng lần nào
  }
  for (const m of muc) {
    if (phien.has(m)) continue; // phiên đang mở thì để yên
    await fs.rm(path.join(goc, m), { recursive: true, force: true });
    da++;
  }
  return da;
}

/** Số phiên đang mở — dùng trong phép kiểm và khi cần soi trạng thái. */
export function soPhienDangMo(): number {
  return phien.size;
}
