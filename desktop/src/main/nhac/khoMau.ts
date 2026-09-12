/**
 * ============================================================
 * KHO MẪU — nhạc lấy từ ngoài, CÓ GHI GIẤY PHÉP
 * ============================================================
 *
 * ─── Vấn đề nó giải ───
 * Sáu tháng sau khi tải một bản a cappella về, câu hỏi duy nhất còn lại là:
 * cái này có được đem đi diễn không? Tệp thì không mang câu trả lời — tên tệp
 * là `vocal_loop_final2.wav`, và trang web đã tải nó thì không nhớ nữa. Kho
 * này giữ giấy phép NẰM CẠNH tệp, trong một tệp `.giay-phep.json` cùng tên.
 *
 * ─── Vì sao là tệp KÈM chứ không phải một cơ sở dữ liệu ───
 * Chép thư mục sang máy khác thì giấy phép đi theo. Một bảng SQLite ở
 * `userData` thì không: tệp còn đó mà nguồn gốc mất sạch, và người dùng lại
 * quay về đúng chỗ cũ. Đây là dữ liệu THUỘC VỀ tệp, nên nó phải ở cạnh tệp.
 *
 * ─── ⚠️ KHÔNG có bộ tìm kiếm trong app ───
 * ccMixter, Freesound và Archive.org đều có API, và một ô tìm kiếm ngay trong
 * app sẽ tiện hơn nhiều. Nhưng cả ba tên miền đó đều KHÔNG gọi được từ máy
 * dựng bản này, nên hình dạng API của chúng không kiểm chứng được — mà viết
 * một bộ tìm kiếm dựa trên API đoán mò thì đúng bằng cách đã đẻ ra nút "Tải
 * model" trả HTTP 404 trên máy người dùng (xem `taiModel.ts`). Nên ở đây chỉ
 * MỞ TRANG của họ trong trình duyệt; người dùng tải về rồi thêm vào kho, và
 * họ đọc được giấy phép bằng chính mắt mình trên trang đó — vốn là thứ nên
 * xảy ra dù có API hay không.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

/** Đuôi tệp nhận vào kho. Renderer giải mã được hết chỗ này. */
const DUOI = ['.wav', '.mp3', '.flac', '.m4a', '.aac', '.ogg', '.opus', '.aif', '.aiff'];

/** Trần một tệp mẫu. Trên mức này gần như chắc chắn là chọn nhầm cả album. */
const TRAN_BYTE = 300 * 1024 * 1024;

const DUOI_KEM = '.giay-phep.json';

/**
 * Những giấy phép hay gặp, kèm CÂU TRẢ LỜI cho câu hỏi người dùng thật sự hỏi.
 *
 * `dienDuoc` là "đem ra sân khấu / đăng lên mạng có bị gỡ không". Đây là chỗ
 * duy nhất trong cả app dám trả lời thay người dùng, nên nó chỉ trả lời những
 * gì rõ ràng; mọi thứ khác là `khac` và nó nói thẳng là không biết.
 */
export const GIAY_PHEP = [
  { ma: 'cc0', ten: 'CC0 · miễn trừ hoàn toàn', dienDuoc: true, ghiCong: false,
    moTa: 'Làm gì cũng được, không cần ghi công.' },
  { ma: 'cc-by', ten: 'CC BY · ghi công', dienDuoc: true, ghiCong: true,
    moTa: 'Được dùng cả cho mục đích thương mại, miễn là GHI TÊN tác giả.' },
  { ma: 'cc-by-sa', ten: 'CC BY-SA · ghi công, chia sẻ tương tự', dienDuoc: true, ghiCong: true,
    moTa: 'Như CC BY, nhưng bản của bạn cũng phải mang cùng giấy phép.' },
  { ma: 'cc-by-nc', ten: 'CC BY-NC · phi thương mại', dienDuoc: false, ghiCong: true,
    moTa: 'KHÔNG dùng cho việc có thu tiền — kể cả đánh nhạc ở quán.' },
  { ma: 'cong-cong', ten: 'Phạm vi công cộng', dienDuoc: true, ghiCong: false,
    moTa: 'Hết hạn bản quyền hoặc tác giả đã từ bỏ.' },
  { ma: 'tu-thu', ten: 'Tự thu / của tôi', dienDuoc: true, ghiCong: false,
    moTa: 'Bạn tự làm ra nó.' },
  { ma: 'khac', ten: 'Chưa rõ', dienDuoc: false, ghiCong: true,
    moTa: 'Chưa xác định. Đừng đem đi diễn cho tới khi tra lại nguồn.' },
] as const;

export type MaGiayPhep = (typeof GIAY_PHEP)[number]['ma'];

export function traGiayPhep(ma: string): (typeof GIAY_PHEP)[number] {
  return GIAY_PHEP.find((g) => g.ma === ma) ?? GIAY_PHEP[GIAY_PHEP.length - 1]!;
}

/**
 * Nguồn mẫu CÓ giấy phép cho remix.
 *
 * ⚠️ Chỉ để `url` là GỐC TRANG, không phải đường tìm kiếm có tham số. Tham số
 * tìm kiếm của cả ba trang này đều không kiểm chứng được từ máy dựng (tên miền
 * bị chặn), và một đường dẫn đoán mò thì hỏng im lặng — người dùng bấm nút rồi
 * nhìn trang 404 và kết luận app hỏng. Gốc trang thì chắc chắn còn đó.
 */
export const NGUON_MAU = [
  {
    ma: 'ccmixter',
    ten: 'ccMixter',
    url: 'https://ccmixter.org/',
    moTa: 'A cappella và stem người ta ĐĂNG LÊN ĐỂ người khác remix. Đúng thứ '
        + 'cần nhất cho một bản mashup, và giấy phép ghi rõ trên từng bài.',
  },
  {
    ma: 'freesound',
    ten: 'Freesound',
    url: 'https://freesound.org/',
    moTa: 'Vài trăm nghìn sample, loop, one-shot và tiếng động. Phần lớn CC0 '
        + 'hoặc CC BY — đọc nhãn trên từng tệp.',
  },
  {
    ma: 'archive',
    ten: 'Internet Archive',
    url: 'https://archive.org/details/audio',
    moTa: 'Nhạc trọn bài, phần lớn thuộc phạm vi công cộng hoặc CC. Kho lớn '
        + 'nhất trong ba nguồn, và cũng lộn xộn nhất.',
  },
] as const;

export interface MauNhac {
  id: string;
  /** Tên tệp trong kho, kèm đuôi. */
  tep: string;
  duong: string;
  byte: number;
  /** Tên người dùng đọc. Mặc định là tên tệp gốc. */
  ten: string;
  giayPhep: MaGiayPhep;
  tacGia: string;
  nguon: string;
  url: string;
  themLuc: number;
  /**
   * Tệp kèm giấy phép có đọc được không.
   *
   * `false` KHÔNG đồng nghĩa "được dùng thoải mái" — nó nghĩa là KHÔNG BIẾT,
   * và giao diện phải nói đúng như thế. Coi thiếu giấy phép là mặc định an
   * toàn thì cái kho này mất hết tác dụng của nó.
   */
  coGiayPhep: boolean;
}

export function thuMucKho(userData: string): string {
  return path.join(userData, 'nhac', 'kho-mau');
}

/** Tên tệp an toàn, giữ dấu tiếng Việt. Cùng luật với `tenAnToan` của xưởng. */
export function tenTepAnToan(ten: string): string {
  const duoi = path.extname(ten).toLowerCase();
  const goc = path.basename(ten, path.extname(ten))
    .replace(/[/\\:*?"<>|]/g, ' ')
    .replace(/\.+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return `${goc || 'mau'}${DUOI.includes(duoi) ? duoi : '.wav'}`;
}

export function laTepNhac(ten: string): boolean {
  return DUOI.includes(path.extname(ten).toLowerCase());
}

interface TepKem {
  id: string;
  ten: string;
  giayPhep: string;
  tacGia: string;
  nguon: string;
  url: string;
  themLuc: number;
}

/**
 * Đọc tệp kèm. Hỏng hay thiếu thì trả `null` chứ KHÔNG ném.
 *
 * Một tệp kèm hỏng không được làm cả kho biến mất — cùng bài học với
 * `dsBaiTrongKho`. Mẫu vẫn hiện, chỉ là hiện dưới dạng "chưa rõ giấy phép".
 */
async function docKem(duong: string): Promise<TepKem | null> {
  try {
    const tho = JSON.parse(await fs.readFile(duong, 'utf8')) as unknown;
    if (typeof tho !== 'object' || tho === null) return null;
    const o = tho as Record<string, unknown>;
    /* Kiểm từng trường: tệp này người dùng sửa tay được (nó là JSON nằm trong
       thư mục của họ), và một trường sai kiểu lọt vào giao diện thì React
       dựng `undefined` ra giữa màn hình. */
    return {
      id: typeof o.id === 'string' ? o.id : randomUUID(),
      ten: typeof o.ten === 'string' ? o.ten : '',
      giayPhep: typeof o.giayPhep === 'string' ? o.giayPhep : 'khac',
      tacGia: typeof o.tacGia === 'string' ? o.tacGia : '',
      nguon: typeof o.nguon === 'string' ? o.nguon : '',
      url: typeof o.url === 'string' ? o.url : '',
      themLuc: typeof o.themLuc === 'number' ? o.themLuc : 0,
    };
  } catch {
    return null;
  }
}

function duongKem(duongTep: string): string {
  return `${duongTep}${DUOI_KEM}`;
}

/** Mọi mẫu trong kho, mới nhất trước. */
export async function dsMau(userData: string): Promise<MauNhac[]> {
  const goc = thuMucKho(userData);
  let muc: string[];
  try {
    muc = await fs.readdir(goc);
  } catch {
    return [];       // chưa có kho là chuyện thường, không phải lỗi
  }

  const ra: MauNhac[] = [];
  for (const m of muc) {
    if (!laTepNhac(m)) continue;              // bỏ qua chính các tệp kèm
    const duong = path.join(goc, m);
    let byte = 0;
    try {
      byte = (await fs.stat(duong)).size;
    } catch {
      continue;
    }
    const kem = await docKem(duongKem(duong));
    ra.push({
      id: kem?.id ?? m,
      tep: m,
      duong,
      byte,
      ten: kem?.ten || path.basename(m, path.extname(m)),
      giayPhep: (kem ? traGiayPhep(kem.giayPhep).ma : 'khac'),
      tacGia: kem?.tacGia ?? '',
      nguon: kem?.nguon ?? '',
      url: kem?.url ?? '',
      themLuc: kem?.themLuc ?? 0,
      coGiayPhep: kem !== null,
    });
  }
  ra.sort((a, b) => b.themLuc - a.themLuc);
  return ra;
}

/**
 * ⚠️ `| undefined` tường minh: dự án bật `exactOptionalPropertyTypes`, mà zod
 * suy ra `ten?: string | undefined` cho một `.optional()`. Thiếu hai chữ này
 * thì mọi lời gọi từ tầng IPC đều đỏ. Cùng lý do với `CaiXuat`.
 */
export interface MetaMau {
  ten?: string | undefined;
  giayPhep: MaGiayPhep;
  tacGia?: string | undefined;
  nguon?: string | undefined;
  url?: string | undefined;
}

/**
 * Chép một tệp vào kho và ghi giấy phép cạnh nó.
 *
 * CHÉP chứ không trỏ tới chỗ cũ: người dùng dọn thư mục Downloads là mọi mẫu
 * biến mất, và cái kho chỉ còn là một danh sách đường dẫn chết.
 */
export async function themMau(
  userData: string, tepNguon: string, meta: MetaMau,
): Promise<MauNhac> {
  if (!laTepNhac(tepNguon)) {
    throw new Error(`Chỉ nhận tệp nhạc (${DUOI.join(', ')})`);
  }
  const tt = await fs.stat(tepNguon);
  if (tt.size > TRAN_BYTE) {
    throw new Error(`Tệp ${(tt.size / 1e6).toFixed(0)} MB — quá lớn cho một mẫu`);
  }

  const goc = thuMucKho(userData);
  await fs.mkdir(goc, { recursive: true });

  /* Trùng tên thì thêm số, không đè. Đè lên một mẫu đã có là xoá luôn giấy
     phép của nó — mà hai tệp cùng tên từ hai nguồn khác nhau là chuyện rất
     hay xảy ra (`vocal.wav`, `loop.wav`). */
  const an = tenTepAnToan(path.basename(tepNguon));
  const nen = path.basename(an, path.extname(an));
  const duoi = path.extname(an);
  let tep = an;
  for (let i = 2; i < 500; i++) {
    try {
      await fs.access(path.join(goc, tep));
      tep = `${nen} (${i})${duoi}`;
    } catch {
      break;
    }
  }

  const duong = path.join(goc, tep);
  await fs.copyFile(tepNguon, duong);

  const kem: TepKem = {
    id: randomUUID(),
    ten: meta.ten?.trim() || path.basename(tepNguon, path.extname(tepNguon)),
    giayPhep: traGiayPhep(meta.giayPhep).ma,
    tacGia: meta.tacGia?.trim() ?? '',
    nguon: meta.nguon?.trim() ?? '',
    url: meta.url?.trim() ?? '',
    themLuc: Date.now(),
  };
  await fs.writeFile(duongKem(duong), JSON.stringify(kem, null, 2), 'utf8');

  return {
    id: kem.id,
    tep,
    duong,
    byte: tt.size,
    ten: kem.ten,
    giayPhep: kem.giayPhep as MaGiayPhep,
    tacGia: kem.tacGia,
    nguon: kem.nguon,
    url: kem.url,
    themLuc: kem.themLuc,
    coGiayPhep: true,
  };
}

/** Xoá một mẫu và tệp kèm của nó. */
export async function xoaMau(userData: string, tep: string): Promise<void> {
  /* `basename` là chốt chặn: chuỗi này đến từ renderer, và không có nó thì
     `../../` đi ra khỏi kho và xoá được tệp bất kỳ trên máy. */
  const an = path.basename(tep);
  if (!laTepNhac(an)) throw new Error('Chỉ xoá được tệp nhạc trong kho');
  const duong = path.join(thuMucKho(userData), an);
  await fs.rm(duong, { force: true });
  await fs.rm(duongKem(duong), { force: true });
}

/**
 * Dòng ghi công cho cả kho — dán vào phần mô tả khi đăng bản remix.
 *
 * Chỉ liệt kê mẫu ĐÒI ghi công. Liệt kê cả CC0 vào thì danh sách dài ra và
 * người ta thôi không đọc nữa, tức là đúng những dòng BẮT BUỘC lại bị bỏ qua.
 */
export function dongGhiCong(ds: readonly MauNhac[]): string[] {
  const ra: string[] = [];
  for (const m of ds) {
    const gp = traGiayPhep(m.giayPhep);
    if (!gp.ghiCong) continue;
    const phan = [m.ten];
    if (m.tacGia) phan.push(`của ${m.tacGia}`);
    phan.push(`(${gp.ten.split(' · ')[0]})`);
    if (m.url) phan.push(m.url);
    ra.push(phan.join(' '));
  }
  return ra;
}
