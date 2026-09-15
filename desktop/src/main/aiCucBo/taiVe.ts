/**
 * ============================================================
 * TẢI MODEL VÀ BỘ CHẠY VỀ MÁY NGƯỜI DÙNG
 * ============================================================
 *
 * 2,5 GB qua mạng Việt Nam là một việc kéo dài nhiều phút và ĐỨT GIỮA CHỪNG là
 * chuyện bình thường, không phải ngoại lệ. Nên tệp này viết quanh giả định đó:
 *
 *   • Ghi vào `<tên>.dangtai` rồi mới đổi tên khi xong. File ở tên thật LUÔN
 *     LUÔN là file đã tải trọn — không bao giờ có chuyện app nạp phải một model
 *     cụt và chết với một lỗi không ai hiểu.
 *   • Đứt thì TẢI TIẾP từ chỗ dở bằng `Range:`, không tải lại từ đầu.
 *   • Kiểm cỡ file sau khi xong. Máy chủ trả trang lỗi HTML 200 thay vì file
 *     là chuyện có thật — [[feedback_http_200_khong_nghia_la_viec_da_lam]].
 *
 * ⚠️⚠️ KHÔNG dùng hai tiến trình `curl -C -` song song trên cùng một file —
 * [[feedback_two_curl_resume_corrupts_file]]. Ở đây chốt bằng `dangTai`: một
 * file chỉ có đúng một lượt tải tại một thời điểm.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export interface TienDo {
  /** Số byte đã có trên đĩa, kể cả phần của lần tải trước. */
  daCo: number;
  /** Tổng số byte, `0` nếu máy chủ không nói. */
  tong: number;
  /** Byte mỗi giây, tính trên cửa sổ gần đây chứ không phải trung bình cả lượt. */
  bps: number;
}

export interface YeuCauTai {
  url: string;
  /** Đường dẫn ĐÍCH cuối cùng. Phần đang tải nằm ở `<dich>.dangtai`. */
  dich: string;
  /** Cỡ mong đợi, byte. `0` = không kiểm. Lệch quá 2% là hỏng. */
  coMong?: number;
  onTienDo?: (t: TienDo) => void;
  signal?: AbortSignal | undefined;
}

/** Những file đang được tải, khoá theo đường dẫn đích. */
const dangTai = new Set<string>();

export class LoiTai extends Error {
  constructor(message: string, readonly maLoi: 'mang' | 'huy' | 'cocHong' | 'dangTai') {
    super(message);
    this.name = 'LoiTai';
  }
}

async function coFile(p: string): Promise<number> {
  try {
    const s = await stat(p);
    return s.isFile() ? s.size : 0;
  } catch {
    return 0;
  }
}

/**
 * Tải một file, tiếp tục được nếu lần trước đứt dở.
 *
 * Trả về đường dẫn đích. File đã có sẵn và đúng cỡ thì trả về ngay, không tải
 * lại — người dùng tải bản ảnh sau khi đã có bản chữ không phải tải lại gì.
 */
export async function taiFile(yc: YeuCauTai): Promise<string> {
  const { url, dich, coMong = 0, onTienDo, signal } = yc;

  /* ⚠️⚠️ GIÀNH KHOÁ TRƯỚC MỌI `await`, KHÔNG có ngoại lệ.
     Bản đầu đặt `dangTai.add()` SAU `await coFile(dich)` và phép kiểm bắt
     được ngay: hai lượt gọi cùng lúc đều dừng ở chỗ `await` đó trước khi ai
     kịp cắm cờ, nên cả hai đi tiếp và cùng ghi vào một file `.dangtai` — đúng
     kiểu hỏng của `two curl -C -`, và nó KHÔNG báo lỗi, chỉ ra một file rác.
     Trong JS, "kiểm rồi mới đặt" chỉ là loại trừ lẫn nhau khi giữa hai việc
     đó không có điểm nhường lượt nào. */
  if (dangTai.has(dich)) {
    throw new LoiTai('File này đang được tải rồi.', 'dangTai');
  }
  dangTai.add(dich);

  const tam = `${dich}.dangtai`;
  try {
    /* Đã xong từ trước? Chỉ tin khi cỡ khớp — file đúng tên mà cụt còn tệ hơn
       không có, vì nó trông như đã xong. */
    const daXong = await coFile(dich);
    if (daXong > 0 && (coMong === 0 || Math.abs(daXong - coMong) / coMong < 0.02)) {
      onTienDo?.({ daCo: daXong, tong: daXong, bps: 0 });
      return dich;
    }

    await mkdir(dirname(dich), { recursive: true });
    let daCo = await coFile(tam);

    /* Phần dở lớn hơn cả file thật ⇒ lần trước hỏng, bỏ đi làm lại. Giữ lại
       chỉ để "tiết kiệm" là cách chắc chắn nhất để tải về một file rác. */
    if (coMong > 0 && daCo > coMong) {
      await rm(tam, { force: true });
      daCo = 0;
    }

    const dau: Record<string, string> = { 'User-Agent': 'CuongThai-Desktop' };
    if (daCo > 0) dau.Range = `bytes=${daCo}-`;

    /* `signal` để `undefined` không qua được `exactOptionalPropertyTypes` —
       `RequestInit` nhận `AbortSignal | null`, không nhận `undefined`. */
    const r = await fetch(url, { headers: dau, redirect: 'follow', signal: signal ?? null });

    /* 416 = xin tiếp từ quá cuối file. Nghĩa là phần dở đã đủ; đóng lại là
       xong. Coi nó là lỗi sẽ làm người dùng kẹt vĩnh viễn ở 100%. */
    if (r.status === 416 && daCo > 0) {
      await rename(tam, dich);
      return dich;
    }
    if (!r.ok) throw new LoiTai(`Máy chủ trả ${r.status}.`, 'mang');
    if (!r.body) throw new LoiTai('Máy chủ không trả nội dung.', 'mang');

    /* Xin tiếp mà máy chủ trả 200 thay vì 206 ⇒ nó KHÔNG hỗ trợ tải tiếp và
       đang gửi lại từ đầu. Ghi đè thay vì nối vào, nếu không file sẽ là phần
       dở cũ cộng nguyên file mới — dài hơn thật, và hỏng câm. */
    const noiTiep = daCo > 0 && r.status === 206;
    if (daCo > 0 && !noiTiep) daCo = 0;

    const conLai = Number(r.headers.get('content-length') ?? 0);
    const tong = conLai > 0 ? daCo + conLai : coMong;

    let daNhan = daCo;
    let mocByte = daCo;
    let mocLuc = Date.now();
    let bps = 0;

    const dong = createWriteStream(tam, noiTiep ? { flags: 'a' } : { flags: 'w' });
    const nguon = Readable.fromWeb(r.body as Parameters<typeof Readable.fromWeb>[0]);
    nguon.on('data', (mau: Buffer) => {
      daNhan += mau.length;
      const nay = Date.now();
      /* Đo tốc độ trên cửa sổ ~1 giây. Trung bình cả lượt sẽ nói dối khi mạng
         đổi tốc độ giữa chừng, và "còn 2 phút" tính từ đó luôn sai. */
      if (nay - mocLuc >= 1000) {
        bps = ((daNhan - mocByte) * 1000) / (nay - mocLuc);
        mocByte = daNhan;
        mocLuc = nay;
        onTienDo?.({ daCo: daNhan, tong, bps });
      }
    });

    await pipeline(nguon, dong, { signal });

    const co = await coFile(tam);
    if (coMong > 0 && Math.abs(co - coMong) / coMong > 0.02) {
      await rm(tam, { force: true });
      throw new LoiTai(
        `Tải xong nhưng file sai cỡ (${(co / 1e9).toFixed(2)} GB, đáng lẽ `
        + `${(coMong / 1e9).toFixed(2)} GB). Có thể mạng chèn trang đăng nhập.`,
        'cocHong',
      );
    }
    if (co === 0) {
      await rm(tam, { force: true });
      throw new LoiTai('Tải về file rỗng.', 'cocHong');
    }

    await rename(tam, dich);
    onTienDo?.({ daCo: co, tong: co, bps });
    return dich;
  } catch (e) {
    if (e instanceof LoiTai) throw e;
    const huy = (e as { name?: string })?.name === 'AbortError';
    /* Bị huỷ thì GIỮ phần dở lại — người dùng bấm tiếp là chạy tiếp. */
    throw new LoiTai(
      huy ? 'Đã dừng tải.' : `Không tải được: ${(e as Error)?.message ?? 'lỗi mạng'}`,
      huy ? 'huy' : 'mang',
    );
  } finally {
    dangTai.delete(dich);
  }
}

/** Còn bao nhiêu giây nữa xong. `null` khi chưa đủ dữ kiện để nói. */
export function conLaiGiay(t: TienDo): number | null {
  if (t.bps <= 0 || t.tong <= 0 || t.daCo >= t.tong) return null;
  return Math.ceil((t.tong - t.daCo) / t.bps);
}

/** "2,5 GB" / "840 MB" — cho người dùng đọc, không phải cho log. */
export function coChu(byte: number): string {
  if (byte >= 1e9) return `${(byte / 1e9).toFixed(1).replace('.', ',')} GB`;
  if (byte >= 1e6) return `${Math.round(byte / 1e6)} MB`;
  return `${Math.round(byte / 1e3)} KB`;
}
