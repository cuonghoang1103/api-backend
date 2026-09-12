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
  /**
   * Nơi tải về. `null` = KHÔNG có nguồn nào đã kiểm chứng — giao diện chỉ mời
   * người dùng tự chọn tệp `.onnx` trên máy.
   *
   * ⚠️ Để `null` còn hơn đoán một URL. Ngày 12/09/2026 tệp này chứa hai URL
   * dựng theo trí nhớ; một cái trả 404 ngay trên máy người dùng, cái kia tải
   * về được nhưng kích thước lệch hẳn con số khai ở đây. Một URL sai không
   * hỏng lúc dựng, không hỏng lúc kiểm — nó hỏng đúng lúc người dùng bấm.
   */
  url: string | null;
  /**
   * ƯỚC TÍNH kích thước, byte. CHỈ dùng để vẽ thanh tiến độ khi máy chủ không
   * khai `content-length`, và để hiện một con số gần đúng trước khi tải.
   *
   * KHÔNG được dùng làm điều kiện đúng/sai: nó là con số người viết mã gõ vào,
   * không phải thứ đo được. Đúng cái nhầm đó đã làm bản 4 stem hiện "1,26 GB"
   * trong khi tệp thật là 316 MB.
   */
  byteUocTinh: number;
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
    /* 316 MB là con số ĐO ĐƯỢC trên máy người dùng 12/09/2026 (trước đó ghi
       1,26 GB — sai). Khớp với htdemucs ~83,6 triệu tham số ở fp32. */
    byteUocTinh: 316_000_000,
    vanTay: null,
    moTa: 'Trống, bass, nhạc nền, giọng hát. Bản đầy đủ — chọn cái này để remix sâu.',
  },
  {
    ma: 'htdemucs-vocals',
    ten: 'HT-Demucs · chỉ giọng hát',
    /* URL cũ trả 404 trên máy người dùng: tên tệp là do người viết mã đoán,
       không tra được (máy dựng bị chặn khỏi kho model). Để `null` cho tới khi
       có ai đó DÁN VÀO một đường đã mở thử bằng trình duyệt. */
    url: null,
    byteUocTinh: 166_000_000,
    vanTay: null,
    moTa: 'Chỉ tách giọng, nhẹ hơn. Chưa có đường tải đã kiểm — tự tải về rồi chọn tệp.',
  },
];

/**
 * Nội dung nhận về có phải một model không.
 *
 * Bắt ba thứ hay bị nhầm là model: trang HTML báo lỗi, con trỏ Git LFS (một
 * tệp CHỮ vài trăm byte trông y như đã tải xong), và tệp rỗng. Không có chốt
 * này thì cả ba đi thẳng xuống onnxruntime và nó báo lỗi protobuf — cách xa
 * nguyên nhân thật, và người dùng sẽ đi ngờ bộ tách stem.
 *
 * KHÔNG kiểm sâu hơn: ONNX là protobuf, không có chữ ký đầu tệp để đối chiếu.
 * Phép kiểm thật là lượt mở phiên đầu tiên, và `docHopDong` ở đó đã nói rõ nó
 * thấy gì.
 */
export function laModel(dau: Buffer): string | null {
  if (dau.length === 0) return 'tệp rỗng';
  const chu = dau.subarray(0, 200).toString('latin1');
  if (/^\s*<(!doctype|html|\?xml)/i.test(chu)) return 'máy chủ trả về một trang HTML, không phải model';
  if (chu.startsWith('version https://git-lfs')) return 'đây là con trỏ Git LFS, không phải model — cần đường tải bản thật';
  return null;
}

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
      /* ⚠️ "khác rỗng" KHÔNG phải là "tải xong".
         Bản đầu chỉ kiểm `st.size > 0`, nên một trang HTML báo lỗi hay một con
         trỏ Git LFS vài trăm byte cũng hiện là "đã tải · 0 MB" và nút Tách
         sáng lên. Người dùng bấm, onnxruntime báo lỗi protobuf, và chỗ hỏng
         nằm cách nguyên nhân ba bước. Đọc thật 200 byte đầu để loại chúng. */
      const tep = await fs.open(duongDan, 'r');
      const dem = Buffer.allocUnsafe(Math.min(200, st.size));
      try { await tep.read(dem, 0, dem.length, 0); } finally { await tep.close(); }
      return { ma: m.ma, coRoi: laModel(dem) === null, byte: st.size, duongDan };
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

  if (!nguon.url) {
    throw new Error(
      `Model "${nguon.ten}" chưa có đường tải nào đã kiểm chứng. `
      + 'Tải tệp .onnx về bằng trình duyệt rồi bấm "Chọn tệp .onnx" để trỏ app vào nó.',
    );
  }

  const res = await fetch(nguon.url, opts.huy ? { signal: opts.huy } : {});
  if (!res.ok) {
    throw new Error(`Tải model hỏng: HTTP ${res.status} ${res.statusText} — ${nguon.url}`);
  }
  if (!res.body) throw new Error('Máy chủ không trả nội dung');

  const khai = Number(res.headers.get('content-length') ?? 0);
  const tong = khai > 0 ? khai : nguon.byteUocTinh;
  /* Gom cho ĐỦ 200 byte đầu, không lấy mỗi mẩu đầu tiên: mẩu mạng có thể chỉ
     vài byte, và `<!DOCTYP` cụt thì không mẫu nào khớp. Phép kiểm bắt được
     đúng lỗi này ngay lần chạy đầu. */
  const dauMau: Buffer[] = [];
  let dauSo = 0;

  const bam = createHash('sha256');
  const tep = await fs.open(tam, 'w');
  let daNhan = 0;
  try {
    for await (const buf of res.body) {
      if (dauSo < 200) {
        const lay = Buffer.from(buf.subarray(0, 200 - dauSo));
        dauMau.push(lay);
        dauSo += lay.length;
      }
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

  /* Mã HTTP 200 không có nghĩa là nhận được model: nhiều kho trả một trang
     HTML kèm 200, và Git LFS trả một con trỏ dạng chữ. */
  const sai = laModel(Buffer.concat(dauMau));
  if (sai) {
    await fs.rm(tam, { force: true });
    throw new Error(`Tải về không phải model: ${sai} — ${nguon.url}`);
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

/**
 * Nhận một tệp `.onnx` NGƯỜI DÙNG TỰ TẢI và đặt nó vào đúng chỗ.
 *
 * ─── Vì sao đường này phải tồn tại ───
 * Đường tải sẵn phụ thuộc một URL do người viết mã gõ vào, và người viết mã ở
 * đây không mở được kho model để đối chiếu. Ngày 12/09/2026 điều đó đã thành
 * một cái 404 ngay trên máy người dùng. Có đường này thì một URL sai chỉ còn
 * là bất tiện, không phải là tính năng chết: người dùng tự tải bằng trình
 * duyệt — nơi họ NHÌN THẤY tệp có thật hay không — rồi trỏ app vào.
 *
 * Chép chứ không tạo liên kết: tệp nguồn có thể nằm trong Downloads và bị dọn.
 */
export async function napModelTuTep(
  userData: string, ma: string, tepNguon: string,
): Promise<{ duongDan: string; byte: number }> {
  if (!KHO_MODEL.some((m) => m.ma === ma)) throw new Error(`Không biết model "${ma}"`);

  const st = await fs.stat(tepNguon);
  if (!st.isFile()) throw new Error('Đó không phải một tệp');

  const f = await fs.open(tepNguon, 'r');
  const dem = Buffer.allocUnsafe(Math.min(200, st.size));
  try { await f.read(dem, 0, dem.length, 0); } finally { await f.close(); }
  const sai = laModel(dem);
  if (sai) throw new Error(`Tệp này không phải model: ${sai}`);

  await fs.mkdir(thuMucModel(userData), { recursive: true });
  const dich = duongModel(userData, ma);
  const tam = `${dich}.part`;
  await fs.copyFile(tepNguon, tam);

  /* Ghi vân tay của chính bản vừa chép, y như đường tải: những lần mở sau
     `kiemVanTay` bắt được đĩa hỏng hay đồng bộ đám mây cắt xén. */
  const bam = createHash('sha256');
  const doc = await fs.open(tam, 'r');
  try {
    const buf = Buffer.allocUnsafe(1 << 20);
    for (;;) {
      const { bytesRead } = await doc.read(buf, 0, buf.length, null);
      if (bytesRead === 0) break;
      bam.update(buf.subarray(0, bytesRead));
    }
  } finally {
    await doc.close();
  }
  await fs.writeFile(duongVanTay(userData, ma), bam.digest('hex'), 'utf8');
  await fs.rename(tam, dich);
  return { duongDan: dich, byte: st.size };
}

/** Xoá một model để lấy lại đĩa. */
export async function xoaModel(userData: string, ma: string): Promise<void> {
  await fs.rm(duongModel(userData, ma), { force: true });
  await fs.rm(duongVanTay(userData, ma), { force: true });
  await fs.rm(`${duongModel(userData, ma)}.part`, { force: true });
}
