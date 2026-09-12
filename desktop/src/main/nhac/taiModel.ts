/**
 * ============================================================
 * TẢI MODEL VỀ MÁY
 * ============================================================
 *
 * Model htdemucs bốn stem nặng ~1,26 GB. Nó KHÔNG nằm trong bản cài:
 *
 *  • bản cài desktop đang ~120 MB, cộng thêm 1,26 GB là gấp mười một lần, và
 *    GitHub Releases — nơi `electron-updater` kéo bản mới về — có trần 2 GB
 *    mỗi tệp;
 *  • phần lớn người dùng app này không làm nhạc. Bắt họ tải 1,26 GB cho một
 *    trang họ chưa từng mở là lấy băng thông của người khác đi trả cho tính
 *    năng của một người.
 *
 * Nên: tải lần đầu người dùng bấm Tách, vào `userData/nhac/model/`, có thanh
 * tiến độ và huỷ được.
 *
 * ─── Ghi tệp tạm rồi mới đổi tên ───
 * Cùng bài học đã ghi trong `ipc/music.ts`: mất điện hay đóng app giữa chừng
 * sẽ để lại một tệp CỤT. Với nhạc thì triệu chứng là bài đứng giữa chừng; với
 * model 1,26 GB thì onnxruntime báo một lỗi phân tích protobuf khó hiểu, và
 * người dùng sẽ đi ngờ máy họ chứ không ngờ lần tải hôm trước. Ghi vào `.part`
 * rồi `rename` thì tệp đích chỉ tồn tại khi đã đủ.
 *
 * ⚠️ `vanTay` của các mục trong `KHO_MODEL` để `null` — CHƯA ghim được. Máy
 * viết mã này bị chính sách mạng chặn khỏi kho model, nên không đo được digest
 * thật. `taiModel()` vì thế TỰ GHI digest của lần tải đầu ra tệp bên cạnh và
 * đối chiếu ở những lần mở sau: đủ để bắt hỏng hóc về sau, KHÔNG đủ để bắt một
 * bản tải về đã sai ngay từ đầu. Ghim được digest thật thì điền vào đây.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface NguonModel {
  ma: string;
  ten: string;
  url: string;
  /** Kích thước công bố, byte. Dùng để ước tiến độ và chặn tệp cụt. */
  byte: number;
  /** SHA-256 của nhà phát hành. `null` = chưa ghim được, xem ghi chú đầu tệp. */
  vanTay: string | null;
  moTa: string;
}

/**
 * Kho model biết tới.
 *
 * ⚠️ Tên tệp và kích thước lấy từ tài liệu của bản xuất, chưa đối chiếu được
 * với kho thật. Lần chạy đầu trên máy có mạng tới kho sẽ lộ ra ngay nếu sai —
 * `taiModel` kiểm cả mã HTTP lẫn số byte nhận được.
 */
export const KHO_MODEL: readonly NguonModel[] = [
  {
    ma: 'htdemucs-4stem',
    ten: 'HT-Demucs · 4 stem',
    url: 'https://huggingface.co/StemSplitio/htdemucs-onnx/resolve/main/htdemucs.onnx',
    byte: 1_260_000_000,
    vanTay: null,
    moTa: 'Trống, bass, nhạc nền, giọng hát. Bản đầy đủ — chọn cái này để remix sâu.',
  },
  {
    ma: 'htdemucs-vocals',
    ten: 'HT-Demucs · chỉ giọng hát',
    url: 'https://huggingface.co/StemSplitio/htdemucs-onnx/resolve/main/htdemucs_vocals_fp16.onnx',
    byte: 166_000_000,
    vanTay: null,
    moTa: 'Chỉ tách giọng, nhẹ hơn 7,6 lần. Đủ cho phần lớn bản remix vinahouse.',
  },
];

export function thuMucModel(userData: string): string {
  return path.join(userData, 'nhac', 'model');
}

function duongModel(userData: string, ma: string): string {
  return path.join(thuMucModel(userData), `${ma}.onnx`);
}

function duongVanTay(userData: string, ma: string): string {
  return path.join(thuMucModel(userData), `${ma}.sha256`);
}

export interface TinhTrang {
  ma: string;
  coRoi: boolean;
  byte: number;
  duongDan: string;
}

/** Model nào đã có sẵn trên máy. */
export async function tinhTrangKho(userData: string): Promise<TinhTrang[]> {
  return Promise.all(KHO_MODEL.map(async (m) => {
    const duongDan = duongModel(userData, m.ma);
    try {
      const st = await fs.stat(duongDan);
      return { ma: m.ma, coRoi: st.size > 0, byte: st.size, duongDan };
    } catch {
      return { ma: m.ma, coRoi: false, byte: 0, duongDan };
    }
  }));
}

export interface TienDoTai {
  daNhan: number;
  tong: number;
  /** 0..1. Bằng `null` khi máy chủ không khai độ dài. */
  phanTram: number | null;
}

export interface TuyChonTai {
  tienDo?: (t: TienDoTai) => void;
  huy?: AbortSignal;
}

/** Chặn hai lần tải cùng một model giẫm lên nhau — cùng ghi một tệp `.part`. */
const dangTai = new Map<string, Promise<string>>();

export async function taiModel(
  userData: string,
  ma: string,
  opts: TuyChonTai = {},
): Promise<string> {
  const dangCo = dangTai.get(ma);
  if (dangCo) return dangCo;
  const viec = taiThat(userData, ma, opts).finally(() => dangTai.delete(ma));
  dangTai.set(ma, viec);
  return viec;
}

async function taiThat(userData: string, ma: string, opts: TuyChonTai): Promise<string> {
  const nguon = KHO_MODEL.find((m) => m.ma === ma);
  if (!nguon) throw new Error(`Không biết model "${ma}"`);

  const dich = duongModel(userData, ma);
  try {
    const st = await fs.stat(dich);
    if (st.size > 0) return dich; // đã có rồi
  } catch { /* chưa có, tải tiếp */ }

  await fs.mkdir(thuMucModel(userData), { recursive: true });
  const tam = `${dich}.part`;

  const res = await fetch(nguon.url, opts.huy ? { signal: opts.huy } : {});
  if (!res.ok) {
    throw new Error(`Tải model hỏng: HTTP ${res.status} ${res.statusText} — ${nguon.url}`);
  }
  if (!res.body) throw new Error('Máy chủ không trả nội dung');

  const khai = Number(res.headers.get('content-length') ?? 0);
  const tong = khai > 0 ? khai : nguon.byte;

  const bam = createHash('sha256');
  const tep = await fs.open(tam, 'w');
  let daNhan = 0;
  try {
    for await (const buf of res.body) {
      bam.update(buf);
      await tep.write(buf);
      daNhan += buf.byteLength;
      opts.tienDo?.({ daNhan, tong, phanTram: tong > 0 ? Math.min(1, daNhan / tong) : null });
    }
  } finally {
    await tep.close();
  }

  if (opts.huy?.aborted) {
    await fs.rm(tam, { force: true });
    throw new Error('Đã huỷ tải model');
  }

  /* Máy chủ khai bao nhiêu thì phải nhận đủ bấy nhiêu. Thiếu byte mà vẫn đổi
     tên là để lại một tệp trông như đã tải xong — lần mở sau onnxruntime sẽ
     báo lỗi protobuf, cách xa nguyên nhân thật. */
  if (khai > 0 && daNhan !== khai) {
    await fs.rm(tam, { force: true });
    throw new Error(`Tải thiếu: nhận ${daNhan} byte, máy chủ khai ${khai} byte`);
  }

  const vanTay = bam.digest('hex');
  if (nguon.vanTay && vanTay !== nguon.vanTay) {
    await fs.rm(tam, { force: true });
    throw new Error(`Vân tay không khớp. Chờ ${nguon.vanTay}, nhận ${vanTay}`);
  }

  await fs.writeFile(duongVanTay(userData, ma), vanTay, 'utf8');
  await fs.rename(tam, dich);
  return dich;
}

/**
 * Đối chiếu tệp trên đĩa với vân tay đã ghi lúc tải.
 *
 * Bắt được đĩa hỏng, đồng bộ đám mây cắt xén, hay một lần tải bị ngắt để lại
 * tệp sai. KHÔNG bắt được bản tải về đã sai ngay từ đầu — muốn thế thì phải
 * ghim `vanTay` của nhà phát hành trong `KHO_MODEL`.
 */
export async function kiemVanTay(userData: string, ma: string): Promise<boolean> {
  let mong: string;
  try {
    mong = (await fs.readFile(duongVanTay(userData, ma), 'utf8')).trim();
  } catch {
    return true; // chưa ghi vân tay thì không có gì để đối chiếu
  }

  const bam = createHash('sha256');
  const tep = await fs.open(duongModel(userData, ma), 'r');
  try {
    const dem = Buffer.allocUnsafe(1 << 20);
    for (;;) {
      const { bytesRead } = await tep.read(dem, 0, dem.length, null);
      if (bytesRead === 0) break;
      bam.update(dem.subarray(0, bytesRead));
    }
  } finally {
    await tep.close();
  }
  return bam.digest('hex') === mong;
}

/** Xoá một model để lấy lại đĩa. */
export async function xoaModel(userData: string, ma: string): Promise<void> {
  await fs.rm(duongModel(userData, ma), { force: true });
  await fs.rm(duongVanTay(userData, ma), { force: true });
  await fs.rm(`${duongModel(userData, ma)}.part`, { force: true });
}
