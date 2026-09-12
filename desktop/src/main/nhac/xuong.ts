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
import { chamBai, doTatCa, type KetQuaDo } from './amLuong';
import { ghepDuoc, maCamelot, tenTong, type Tong } from './camelot';
import { chinhBai, tiLeTuBpm } from './keoGian';
import { doDacTinh, hanBien, master, type DacTinh } from './master';
import { dangSong, phangHoa } from './dangSong';
import { CAI_MAC_DINH, tron, type CaiDatMotPhan, type CaiDatStem } from './tron';
import type { TuyChonNen } from './nen';
import { caoDoTuTen, mauVinahouse, vietMidi } from './midi';
import { doNhip, doTong } from './nhipVaTong';
import { moPhienTach } from './onnxChay';
import { TAN_SO_MODEL, TEN_STEM, tachStem, type TenStem } from './tachStem';
import { docWav, ghiWav, gopMono, type AmThanh } from './wav';
import { duoiTep, maHoa, mimeCua, moTaDinhDang } from './maHoa';
import type { CaiXuat } from '../../shared/dinhDangXuat';

export interface BaiDaNap {
  id: string;
  ten: string;
  giay: number;
  soKenh: number;
  /**
   * Đường WAV bản gốc. Bàn làm việc cần nó để nút Phát có tiếng NGAY, trước
   * khi tách — tách một bài 5 phút mất vài phút, mà trong lúc đó người ta vẫn
   * muốn nghe và nhìn dạng sóng.
   */
  duongWav: string;
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
  /** Kết quả phân tích, nhớ lại sau lần đo đầu. */
  pt: KetQuaPhanTich | null;
  /** Thư mục stem đã tách, `null` khi chưa tách. */
  daTach: string | null;
  /**
   * Bản mẫu để master theo, nếu người dùng đã nạp.
   *
   * Chỉ giữ ĐẶC TÍNH (phổ trung bình + bốn con số), không giữ âm thanh. Một
   * bản mẫu 5 phút là 106 MB mà thứ ta cần từ nó chỉ là vài KB — và người dùng
   * có thể mở nhiều bài cùng lúc.
   */
  banMau: { ten: string; dt: DacTinh; do: KetQuaDo } | null;
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

  const { kenh } = bocPcm(mau, soKenh, tanSoMau);
  const soMau = kenh[0]!.length;
  const id = randomUUID();
  const thuMuc = thuMucRa(userData, id);
  await fs.mkdir(thuMuc, { recursive: true });
  const duongWav = path.join(thuMuc, 'goc.wav');
  await fs.writeFile(duongWav, Buffer.from(ghiWav({ kenh, tanSoMau })));

  const p: Phien = {
    id, ten, duongWav, giay: soMau / tanSoMau, soKenh,
    huy: null, pt: null, daTach: null, banMau: null,
  };
  phien.set(id, p);
  return { id, ten, giay: p.giay, soKenh, duongWav };
}

/**
 * Bóc PCM xen kẽ từ renderer thành các kênh rời.
 *
 * ⚠️ `mau.buffer` có thể là bộ đệm LỚN HƠN khung nhìn — Node hay tái dùng bộ
 * đệm cho payload IPC. Bỏ qua `byteOffset`/`byteLength` là đọc nhầm sang dữ
 * liệu của người khác, và triệu chứng là nhiễu ở đầu bài chứ không phải lỗi.
 */
function bocPcm(mau: Uint8Array, soKenh: number, tanSoMau: number): AmThanh {
  const so = new Float32Array(mau.buffer, mau.byteOffset, mau.byteLength / 4);
  const soMau = Math.floor(so.length / soKenh);
  if (soMau === 0) throw new Error('Bài rỗng');

  const kenh: Float32Array[] = [];
  for (let c = 0; c < soKenh; c++) {
    const k = new Float32Array(soMau);
    for (let i = 0; i < soMau; i++) k[i] = so[i * soKenh + c]!;
    kenh.push(k);
  }
  return { kenh, tanSoMau };
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
  const p = layPhien(id);
  /* Nhớ lại: đo một bài 5 phút mất ~2 giây (FFT trên cả bài, hai lượt), và
     bước xuất ở dưới cần lại đúng con số này. Đo lại mỗi lần chỉ để ra cùng
     một đáp án là bắt người dùng chờ hai lần cho một việc. */
  if (p.pt) return p.pt;
  const am = await docBai(p);
  const mono = gopMono(am);

  const nhip = doNhip(mono, am.tanSoMau);
  const t = doTong(mono, am.tanSoMau);
  const tong: Tong = { chuAm: t.chuAm, the: t.the };

  const kq: KetQuaPhanTich = {
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
  p.pt = kq;
  return kq;
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
    p.daTach = thuMuc;
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

/* ══════════════════════════════════════════════════════════
   Chỉnh nhịp / tông rồi xuất bộ tệp sẵn sàng kéo vào FL Studio
   ══════════════════════════════════════════════════════════ */

export interface KetQuaXuat {
  thuMuc: string;
  /** Tên tệp trong thư mục, không kèm đường dẫn — để hiện lên giao diện. */
  tep: string[];
  bpmDich: number;
  nuaCung: number;
  giay: number;
}

/**
 * Tên thư mục an toàn dựng từ tên bài người dùng đặt.
 *
 * ⚠️ Chuỗi này ĐẾN TỪ RENDERER (tên tệp người dùng thả vào). Ghép thẳng vào
 * đường dẫn là mở cửa cho `..`, và đây là chỗ DUY NHẤT trong Xưởng Remix mà
 * chuỗi của renderer chạm tới tên tệp — mọi chỗ khác dùng UUID do main sinh.
 *
 * Giữ lại chữ có dấu tiếng Việt: tên bài là thứ người dùng đọc để tìm lại thư
 * mục, bỏ dấu đi chỉ làm họ khó tìm hơn.
 */
export function tenAnToan(ten: string): string {
  const sach = ten
    .replace(/\.[a-z0-9]{1,5}$/i, '')   // bỏ đuôi tệp
    .replace(/[/\\:*?"<>|]/g, ' ')      // ký tự cấm trên Windows lẫn POSIX
    .replace(/\.+/g, ' ')               // chặn mọi dạng ".."
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return sach || 'bai-khong-ten';
}

/**
 * Kéo nhịp và/hoặc đổi tông cho mọi stem, rồi xuất ra một thư mục.
 *
 * Chưa tách stem thì chỉnh thẳng bản gốc — người dùng có thể chỉ muốn kéo cả
 * bài về 140 BPM để đánh nối, không cần tách gì cả.
 */
export async function chinhVaXuat(
  userData: string,
  id: string,
  opts: { bpmDich?: number; nuaCung?: number } = {},
): Promise<KetQuaXuat> {
  const p = layPhien(id);
  const batDau = Date.now();
  const pt = await phanTich(id);

  const nuaCung = Math.round(opts.nuaCung ?? 0);
  if (nuaCung < -12 || nuaCung > 12) throw new Error('Chỉ đổi tông trong khoảng 12 nửa cung');

  const bpmDich = opts.bpmDich ?? pt.bpm;
  if (!(bpmDich > 0)) throw new Error('BPM đích phải dương');

  /* Nhịp gốc dò được có thể sai (tin cậy thấp). Sai thì tỉ lệ kéo sai theo,
     nên chặn những tỉ lệ mà WSOLA không còn nghe được — thà báo lỗi nói rõ
     nguyên nhân còn hơn trả về một tệp nghe như băng cối hỏng. */
  const tiLeNhip = pt.bpm > 0 ? tiLeTuBpm(pt.bpm, bpmDich) : 1;
  if (tiLeNhip < 0.5 || tiLeNhip > 2) {
    throw new Error(
      `Tỉ lệ kéo ${tiLeNhip.toFixed(2)} lần nằm ngoài khoảng nghe được. `
      + `Nhịp gốc dò ra ${pt.bpm} BPM — nếu con số đó sai thì sửa nó trước.`,
    );
  }

  const nguon: Array<{ ten: string; duong: string }> = p.daTach
    ? TEN_STEM.map((t) => ({ ten: t, duong: path.join(p.daTach as string, `${t}.wav`) }))
    : [{ ten: 'goc', duong: p.duongWav }];

  const nhan = `${tenAnToan(p.ten)} ${Math.round(bpmDich)}BPM ${pt.tong}`;
  const thuMuc = path.join(thuMucRa(userData, id), 'xuat', nhan);
  await fs.mkdir(thuMuc, { recursive: true });

  const tep: string[] = [];
  for (const n of nguon) {
    let am: AmThanh;
    try {
      am = docWav((await fs.readFile(n.duong)).buffer as ArrayBuffer);
    } catch {
      continue; // stem này chưa có thì bỏ qua, đừng làm hỏng cả lượt xuất
    }
    const kenh = chinhBai(am.kenh, { tiLeNhip, nuaCung });
    const tenTep = `${n.ten}.wav`;
    await fs.writeFile(
      path.join(thuMuc, tenTep),
      Buffer.from(ghiWav({ kenh, tanSoMau: am.tanSoMau })),
    );
    tep.push(tenTep);
  }

  /* Mẫu MIDI theo đúng tông của bài. `caoDoTuTen` đọc chữ cái đầu của tên tông
     ("Am" thành La), nên bass ra đúng nốt chứ không mặc định Đô. */
  const chuAm = caoDoTuTen(pt.tong) ?? 60;
  const tenMidi = 'mau-vinahouse.mid';
  await fs.writeFile(
    path.join(thuMuc, tenMidi),
    vietMidi(mauVinahouse(chuAm + nuaCung), bpmDich, nhan),
  );
  tep.push(tenMidi);

  const tenDoc = 'doc-truoc-khi-keo.txt';
  await fs.writeFile(path.join(thuMuc, tenDoc), ghiChuXuat(p.ten, pt, bpmDich, nuaCung), 'utf8');
  tep.push(tenDoc);

  return { thuMuc, tep, bpmDich, nuaCung, giay: (Date.now() - batDau) / 1000 };
}

/* ══════════════════════════════════════════════════════════
   Trộn stem — chắn trầm, cân mức, duck theo kick
   ══════════════════════════════════════════════════════════ */

export interface KetQuaTronRa {
  duong: string;
  /** Số cú kick cú duck bám vào, và chúng đến từ đâu. */
  soKick: number;
  nguonKick: 'trong' | 'nhip' | 'khong';
  hoiPhuc: number;
  daTron: TenStem[];
  lufs: number;
  dinhThat: number;
  giay: number;
}

/**
 * Trộn các stem đã tách thành một bản stereo rồi ghi ra đĩa.
 *
 * ─── ⚠️ PHẢI HẠN BIÊN SAU KHI CỘNG ───
 * Bốn stem cộng lại gần như CHẮC CHẮN vượt 0 dBFS: mỗi stem giữ nguyên mức nó
 * có trong bản gốc, mà bản gốc vốn đã được master sát trần. Ghi thẳng ra WAV
 * 32-bit float thì không nghe thấy gì (float chứa được quá 1,0), nhưng lúc
 * người dùng kéo vào DAW hay nén sang MP3 thì nó vỡ tiếng — và lỗi hiện ra ở
 * một chỗ cách đây ba bước, nên rất khó đổ đúng chỗ.
 *
 * Dùng lại đúng bộ hạn biên của `master.ts`: nó có chứng minh không bao giờ
 * vượt trần, thay vì làm mượt bằng trung bình trượt rồi hy vọng.
 */
export async function tronStem(
  userData: string,
  id: string,
  opts: {
    stem?: Partial<Record<TenStem, CaiDatMotPhan>>;
    nenTong?: TuyChonNen | null;
    tranDbtp?: number;
  } = {},
): Promise<KetQuaTronRa> {
  const p = layPhien(id);
  if (!p.daTach) throw new Error('Chưa tách stem. Tách xong mới trộn lại được.');

  const batDau = Date.now();
  const pt = await phanTich(id);

  const nguon: Partial<Record<TenStem, AmThanh>> = {};
  for (const ten of TEN_STEM) {
    try {
      nguon[ten] = docWav((await fs.readFile(path.join(p.daTach, `${ten}.wav`))).buffer as ArrayBuffer);
    } catch {
      // Model chỉ-giọng-hát không sinh đủ bốn stem; trộn những gì có.
    }
  }
  if (Object.keys(nguon).length === 0) throw new Error('Không đọc được stem nào trong thư mục đã tách');

  const kq = tron(nguon, {
    ...(opts.stem ? { stem: opts.stem } : {}),
    ...(pt.bpm > 0 ? { bpm: pt.bpm } : {}),
    ...(opts.nenTong === undefined ? {} : { nenTong: opts.nenTong }),
  });

  const tran = opts.tranDbtp ?? -1;
  const am: AmThanh = { kenh: hanBien(kq.kenh, tran, kq.tanSoMau), tanSoMau: kq.tanSoMau };
  const do_ = doTatCa(am);

  const thuMuc = path.join(thuMucRa(userData, id), 'xuat');
  await fs.mkdir(thuMuc, { recursive: true });
  const duong = path.join(thuMuc, `${tenAnToan(p.ten)} (tron).wav`);
  await fs.writeFile(duong, Buffer.from(ghiWav(am)));

  return {
    duong,
    soKick: kq.soKick,
    nguonKick: kq.nguonKick,
    hoiPhuc: kq.hoiPhuc,
    daTron: kq.daTron,
    lufs: do_.lufs,
    dinhThat: do_.dinhThat,
    giay: (Date.now() - batDau) / 1000,
  };
}

export interface SongRa {
  /** Khoá là `goc` hoặc tên stem. Mỗi giá trị là hai mảng cùng độ dài. */
  min: Record<string, Float32Array>;
  max: Record<string, Float32Array>;
  giay: number;
}

/**
 * Dạng sóng của bài gốc và của từng stem đã tách, đã tóm tắt về `soCot` cột.
 *
 * Đọc lại từ đĩa mỗi lần thay vì nhớ sẵn: bàn làm việc chỉ xin lại khi đổi bề
 * rộng cửa sổ, và nhớ 5 mảng envelope cho mỗi phiên đang mở thì lại là một
 * chỗ rò bộ nhớ nữa. Đọc một tệp WAV mất ~0,2 giây.
 */
export async function songBai(id: string, soCot: number): Promise<SongRa> {
  const p = layPhien(id);
  const min: Record<string, Float32Array> = {};
  const max: Record<string, Float32Array> = {};

  const them = async (ten: string, duong: string) => {
    try {
      const am = docWav((await fs.readFile(duong)).buffer as ArrayBuffer);
      const ph = phangHoa(dangSong(am.kenh, soCot));
      min[ten] = ph.min;
      max[ten] = ph.max;
    } catch {
      /* Stem chưa tách, hay tệp hỏng: bỏ qua đúng dải đó. Ném ở đây thì cả
         bàn làm việc không vẽ được gì chỉ vì một stem thiếu. */
    }
  };

  await them('goc', p.duongWav);
  if (p.daTach) {
    for (const ten of TEN_STEM) await them(ten, path.join(p.daTach, `${ten}.wav`));
  }
  return { min, max, giay: p.giay };
}

export interface BanGiao {
  /** Tên tệp KÈM đuôi của định dạng đã chọn — giao diện đặt tên bài từ nó. */
  ten: string;
  /** Nội dung đã mã hoá theo `cai`. */
  byte: Uint8Array;
  giay: number;
  /** Kiểu MIME khớp với `byte`, để renderer dựng `File` cho đúng. */
  mime: string;
}

/** Trần đọc: tệp lớn hơn thế này gần như chắc chắn là chọn nhầm, không phải bài nhạc. */
const TRAN_DOC = 400 * 1024 * 1024;

/**
 * Đọc một tệp kết quả rồi trả về BẢN GIAO 16-bit cho renderer.
 *
 * ─── Vì sao main đọc mà renderer mới là bên nghe và bên đẩy lên ───
 * Đúng cách phân vai `ipc/music.ts` đã ghi: "renderer tải, main chỉ ghi". Máy
 * chủ nhận tệp qua HTTP kèm token, mà token thì nằm ở renderer; đẩy việc gọi
 * mạng xuống main nghĩa là chuyển token xuống theo, và mọi thứ đó chỉ để làm
 * lại một đường tải lên đã chạy tốt sẵn (`TaiNhacLen`, có cả thanh tiến độ).
 *
 * ─── Vì sao KHÔNG giao nguyên tệp float 32-bit ───
 * Tệp trên đĩa là float 32-bit vì nó còn phải đi qua các bước xử lý. Bản này
 * thì đi thẳng tới tai người và tới máy chủ, nên nó được mã hoá lại theo đúng
 * thứ người dùng chọn ở khối "chất lượng". Mặc định WAV 16-bit: đã qua bộ hạn
 * biên nên chắc chắn nằm trong ±1, và nhỏ đúng một nửa (53 MB thay vì 106 MB
 * cho bài 5 phút) — chênh lệch thật cả khi đẩy lên lẫn khi đi qua cầu IPC.
 * Chọn MP3 320 thì con số đó xuống 12 MB.
 */
export async function banGiao(
  duong: string,
  cai: CaiXuat = { dinhDang: 'wav16' },
): Promise<BanGiao> {
  const tt = await fs.stat(duong);
  if (tt.size > TRAN_DOC) throw new Error('Tệp quá lớn, không đọc nổi vào bộ nhớ');

  const am = docWav((await fs.readFile(duong)).buffer as ArrayBuffer);
  const soMau = am.kenh[0]?.length ?? 0;
  /* Tên phải mang đuôi của định dạng THẬT. Giao một khối MP3 tên `.wav` thì
     máy chủ lưu sai đuôi, và bàn DJ tải về một tệp không mở nổi. */
  const goc = path.basename(duong).replace(/\.[^.]+$/, '');
  return {
    ten: `${goc}.${duoiTep(cai)}`,
    byte: new Uint8Array(await maHoa(am, cai)),
    giay: soMau / am.tanSoMau,
    mime: mimeCua(cai),
  };
}

export interface KetQuaXuatTep {
  duong: string;
  ten: string;
  /** Cỡ tệp THẬT trên đĩa. Bảng `CHON_XUAT` chỉ ước tính; đây là con số đo được. */
  byte: number;
  moTa: string;
  giay: number;
}

/**
 * Mã hoá một tệp kết quả ra định dạng người dùng chọn, ghi cạnh bản gốc.
 *
 * Ghi CẠNH chứ không đè: bản WAV float là thứ mọi bước sau (master, xuất stem,
 * trộn lại) đọc vào. Đè nó bằng một bản MP3 là cắt cụt đường làm việc, và
 * người dùng chỉ phát hiện ở bước sau khi thứ họ nhận về nghe tệ hơn.
 */
export async function xuatTep(duongNguon: string, cai: CaiXuat): Promise<KetQuaXuatTep> {
  const batDau = Date.now();
  const tt = await fs.stat(duongNguon);
  if (tt.size > TRAN_DOC) throw new Error('Tệp quá lớn, không đọc nổi vào bộ nhớ');

  const am = docWav((await fs.readFile(duongNguon)).buffer as ArrayBuffer);
  const byte = await maHoa(am, cai);

  const thuMuc = path.dirname(duongNguon);
  const goc = path.basename(duongNguon).replace(/\.[^.]+$/, '');
  let ten = `${goc}.${duoiTep(cai)}`;
  /* Xuất WAV từ một nguồn WAV thì tên trùng, và ta sẽ đè lên chính bản gốc.
     Gắn thêm mô tả vào tên để hai tệp cùng tồn tại. */
  if (path.join(thuMuc, ten) === duongNguon) {
    ten = `${goc} (${moTaDinhDang(cai).replace(/[^\p{L}\p{N} .-]/gu, '')}).${duoiTep(cai)}`;
  }
  const duong = path.join(thuMuc, ten);
  await fs.writeFile(duong, Buffer.from(byte));

  return {
    duong, ten,
    byte: byte.byteLength,
    moTa: moTaDinhDang(cai),
    giay: (Date.now() - batDau) / 1000,
  };
}

/** Thiết lập trộn mặc định — giao diện lấy nó làm điểm xuất phát. */
export function caiTronMacDinh(): Record<TenStem, CaiDatStem> {
  return { ...CAI_MAC_DINH };
}

/* ══════════════════════════════════════════════════════════
   Master theo bản mẫu — và chấm bài
   ══════════════════════════════════════════════════════════ */

export interface TomTatBanMau {
  ten: string;
  lufs: number;
  dinhThat: number;
  daiDong: number;
  rongStereo: number;
  /** Mức mỗi dải quãng tám, dB. Trợ lý AI cần nó để so phổ với bài của bạn. */
  dai: Record<number, number>;
}

/**
 * Nạp một bản mẫu để master theo. Thường là một bài của DJ bạn muốn giống.
 *
 * Chỉ ĐO rồi vứt âm thanh đi — thứ cần từ bản mẫu là đường phổ trung bình và
 * bốn con số, tổng cộng vài KB. Giữ cả 106 MB âm thanh chỉ để dùng lại mấy con
 * số đó là tốn bộ nhớ cho không.
 */
export function napBanMau(
  id: string,
  ten: string,
  mau: Uint8Array,
  soKenh: number,
  tanSoMau: number,
): TomTatBanMau {
  const p = layPhien(id);
  if (tanSoMau !== TAN_SO_MODEL) {
    throw new Error(`Bản mẫu phải ở ${TAN_SO_MODEL} Hz, nhận ${tanSoMau} Hz.`);
  }
  const am = bocPcm(mau, soKenh, tanSoMau);
  const dt = doDacTinh(am);
  const kq = doTatCa(am);
  p.banMau = { ten, dt, do: kq };
  return {
    ten,
    lufs: kq.lufs,
    dinhThat: kq.dinhThat,
    daiDong: kq.daiDong,
    rongStereo: kq.rongStereo,
    dai: kq.dai,
  };
}

export interface KetQuaMasterRa {
  duong: string;
  tenBanMau: string;
  /** Đã nâng/hạ bao nhiêu dB trước bước hạn biên. */
  chinhDb: number;
  lufsTruoc: number;
  lufsSau: number;
  dinhThatSau: number;
  /** Chênh lệch so với bản mẫu TRƯỚC khi master — đây là phần "chấm bài". */
  chamTruoc: string[];
  /** Và SAU khi master, để thấy nó đã kéo gần được tới đâu. */
  chamSau: string[];
  giay: number;
}

/**
 * Master bài đang mở theo bản mẫu đã nạp, rồi ghi ra đĩa.
 *
 * ⚠️ Master là việc làm trên một bản mix ĐÃ XONG, không phải trên stem. Luồng
 * đúng: dựng xong bản remix trong FL Studio, xuất ra, nạp bản ĐÓ vào đây làm
 * bài chính, nạp một bài của DJ bạn thích làm bản mẫu, rồi bấm master.
 *
 * Trả kèm chênh lệch TRƯỚC và SAU để người dùng thấy nó đã làm gì — một con số
 * "đã master xong" không dạy được ai điều gì.
 */
export async function masterTheoMau(
  userData: string,
  id: string,
  opts: { tranDbtp?: number; khongKhopPho?: boolean } = {},
): Promise<KetQuaMasterRa> {
  const p = layPhien(id);
  if (!p.banMau) throw new Error('Chưa nạp bản mẫu. Chọn một bài để master theo trước đã.');

  const batDau = Date.now();
  const am = await docBai(p);
  const truoc = doTatCa(am);

  const kq = master(am, p.banMau.dt, {
    ...(opts.tranDbtp === undefined ? {} : { tranDbtp: opts.tranDbtp }),
    ...(opts.khongKhopPho === undefined ? {} : { khongKhopPho: opts.khongKhopPho }),
  });
  const sau = doTatCa(kq.am);

  const thuMuc = path.join(thuMucRa(userData, id), 'xuat');
  await fs.mkdir(thuMuc, { recursive: true });
  const duong = path.join(thuMuc, `${tenAnToan(p.ten)} (master).wav`);
  await fs.writeFile(duong, Buffer.from(ghiWav(kq.am)));

  return {
    duong,
    tenBanMau: p.banMau.ten,
    chinhDb: kq.chinhDb,
    lufsTruoc: truoc.lufs,
    lufsSau: sau.lufs,
    dinhThatSau: kq.dinhThatSau,
    chamTruoc: chamBai(truoc, p.banMau.do).nhanXet,
    chamSau: chamBai(sau, p.banMau.do).nhanXet,
    giay: (Date.now() - batDau) / 1000,
  };
}

/** Tệp ghi chú đi kèm. Người dùng mở nó trước khi kéo vào DAW. */
function ghiChuXuat(
  tenBai: string,
  pt: KetQuaPhanTich,
  bpmDich: number,
  nuaCung: number,
): string {
  const d = (v: number) => (Number.isFinite(v) ? v.toFixed(1) : '-');
  const pc = (v: number) => `${(v * 100).toFixed(0)}%`;
  return [
    tenBai,
    '='.repeat(Math.min(60, Math.max(3, tenBai.length))),
    '',
    `Nhịp gốc       ${pt.bpm} BPM   (tin cậy ${pc(pt.bpmTinCay)})`,
    `Nhịp đã chỉnh  ${bpmDich} BPM`,
    `Tông           ${pt.tong}   Camelot ${pt.tongCamelot}   (tin cậy ${pc(pt.tongTinCay)})`,
    nuaCung === 0 ? 'Không đổi tông' : `Đã dịch ${nuaCung > 0 ? '+' : ''}${nuaCung} nửa cung`,
    pt.tongTinCay < 0.3 && pt.tongNhi
      ? `  CẢNH BÁO: máy KHÔNG chắc về tông. Đáp án xếp nhì: ${pt.tongNhi}. Nghe lại trước khi tin.`
      : '',
    '',
    `Ghép hoà âm được với: ${pt.ghep.map((g) => g.ma).join('  ')}`,
    '',
    'Số đo bản gốc',
    `  Độ to        ${d(pt.do.lufs)} LUFS`,
    `  Đỉnh thật    ${d(pt.do.dinhThat)} dBTP`,
    `  Dải động     ${d(pt.do.daiDong)} LU`,
    `  Rộng stereo  ${pc(pt.do.rongStereo)}`,
    '',
    'Tệp trong thư mục này',
    '  *.wav              stem đã chỉnh nhịp/tông, 32-bit float',
    '  mau-vinahouse.mid  khung trống + bass ĐÚNG TÔNG — điểm bắt đầu, không phải bài',
    '',
    'Kéo thẳng cả thư mục vào FL Studio. Tệp .mid mở ra là bốn ô nhịp mẫu: kick',
    'mọi phách, clap phách 2 và 4, hat lệch phách, và bass nằm ở khe GIỮA các kick',
    '(cố ý — bass trùng kick thì cả hai đều mất lực).',
    '',
    'Sinh bởi Xưởng Remix — app desktop CuongThai.',
  ].filter((dong) => dong !== '').join('\n');
}
