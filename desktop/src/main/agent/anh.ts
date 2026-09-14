/**
 * ============================================================
 * SỬA ẢNH — cắt, co, dựng ảnh bìa
 * ============================================================
 *
 * Người dùng 15/09/2026: "cắt ảnh tạo ảnh bìa,... như claude code".
 *
 * Trước bản này agent CHỈ NHÌN được ảnh (`read_file` trả về tấm ảnh) chứ không
 * ĐỘNG được vào nó. Muốn cắt một góc ảnh hay dựng tấm bìa 1200×630 thì đường
 * duy nhất là `run_command` gọi ImageMagick/ffmpeg — mà cả hai đều KHÔNG có
 * sẵn trên máy người dùng phổ thông, và chế độ mặc định (`keHoach`) lại không
 * bật `run_command`. Ngõ cụt hoàn toàn.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG `sharp`: nó là mô-đun native, mỗi nền tảng một bản nhị
 * phân, và trong kho này nó nằm ở `devDependencies` — tức là KHÔNG đi vào bản
 * cài. Kéo nó vào `dependencies` là thêm ba bản nhị phân và một bước
 * `asarUnpack` vào cả ba đường dựng, đổi lấy đúng mấy phép biến đổi mà
 * `nativeImage` của chính Electron đã làm được.
 *
 * `nativeImage` làm được: cắt, co (giữ tỉ lệ), đọc/ghi PNG và JPEG, và đọc ra
 * bitmap thô để tự ghép. Nó KHÔNG làm được: vẽ chữ, xoay. Cần chữ trên ảnh bìa
 * thì đó là việc của `run_command` hoặc của trang web, không phải của tool này.
 *
 * ⚠️ BITMAP CỦA ELECTRON LÀ **BGRA**, KHÔNG PHẢI RGBA. Đây là chỗ sai câm:
 * ghép nền màu đỏ #ff0000 mà xếp byte theo RGBA thì ra màu XANH LAM, ảnh vẫn
 * dựng được, không lỗi nào, và chỉ lộ ra khi có người nhìn tấm ảnh.
 */
import { nativeImage } from 'electron';

/** Cạnh lớn nhất chấp nhận được. Trên mức này thì đó là lỗi gõ số, không phải ý đồ. */
export const CANH_TOI_DA = 12_000;

export interface KhungCat { x: number; y: number; rong: number; cao: number }
export interface CoAnh { rong: number; cao: number }

/**
 * Ép khung cắt nằm gọn trong ảnh.
 *
 * Model hay đưa khung tràn mép (nó ước lượng toạ độ bằng mắt trên tấm ảnh đã
 * bị co về 1568px). `nativeImage.crop` với khung tràn trả về ảnh RỖNG — im
 * lặng, không ném. Kẹp lại ở đây thì nó ra tấm ảnh gần đúng thay vì con số 0.
 */
export function kepKhung(k: KhungCat, anh: CoAnh): KhungCat | null {
  const x = Math.max(0, Math.min(Math.round(k.x), anh.rong - 1));
  const y = Math.max(0, Math.min(Math.round(k.y), anh.cao - 1));
  const rong = Math.min(Math.round(k.rong), anh.rong - x);
  const cao = Math.min(Math.round(k.cao), anh.cao - y);
  if (rong < 1 || cao < 1) return null;
  return { x, y, rong, cao };
}

/**
 * Ảnh bìa = phủ kín khung đích rồi cắt phần thừa ở GIỮA.
 *
 * Đây đúng là `object-fit: cover` của CSS, và là thứ mọi khung ảnh bìa cần:
 * không viền trống, không méo tỉ lệ. Cái giá là mất phần rìa — nên hàm trả về
 * cả bước co lẫn bước cắt để chỗ gọi nói được cho người dùng biết đã cắt gì.
 */
export function tinhBia(nguon: CoAnh, dich: CoAnh): { co: CoAnh; cat: KhungCat } {
  const ti = Math.max(dich.rong / nguon.rong, dich.cao / nguon.cao);
  // `ceil` chứ không `round`: làm tròn xuống một điểm ảnh là ảnh co ra HẸP hơn
  // khung đích, và bước cắt sau đó trả về ảnh rỗng.
  const co = { rong: Math.ceil(nguon.rong * ti), cao: Math.ceil(nguon.cao * ti) };
  return {
    co,
    cat: {
      x: Math.round((co.rong - dich.rong) / 2),
      y: Math.round((co.cao - dich.cao) / 2),
      rong: dich.rong,
      cao: dich.cao,
    },
  };
}

/** Vừa khung, giữ trọn ảnh, chừa viền — `object-fit: contain`. */
export function tinhVua(nguon: CoAnh, dich: CoAnh): { co: CoAnh; le: { x: number; y: number } } {
  const ti = Math.min(dich.rong / nguon.rong, dich.cao / nguon.cao);
  const co = { rong: Math.max(1, Math.round(nguon.rong * ti)), cao: Math.max(1, Math.round(nguon.cao * ti)) };
  return { co, le: { x: Math.round((dich.rong - co.rong) / 2), y: Math.round((dich.cao - co.cao) / 2) } };
}

/** `#rgb` / `#rrggbb` → [đỏ, lục, lam]. Sai cú pháp thì trả null, đừng đoán. */
export function docMau(chu: string): [number, number, number] | null {
  const s = chu.trim().replace(/^#/, '');
  const ba = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  if (!/^[0-9a-fA-F]{6}$/.test(ba)) return null;
  return [
    parseInt(ba.slice(0, 2), 16),
    parseInt(ba.slice(2, 4), 16),
    parseInt(ba.slice(4, 6), 16),
  ];
}

/**
 * Ghép tấm ảnh đã co vào giữa một nền đặc.
 *
 * ⚠️ Thứ tự byte là **BGRA**. Xem cảnh báo ở đầu file.
 */
export function ghepLenNen(
  than: Buffer,
  co: CoAnh,
  dich: CoAnh,
  le: { x: number; y: number },
  mau: [number, number, number],
): Buffer {
  const ra = Buffer.alloc(dich.rong * dich.cao * 4);
  for (let i = 0; i < ra.length; i += 4) {
    ra[i] = mau[2];      // B
    ra[i + 1] = mau[1];  // G
    ra[i + 2] = mau[0];  // R
    ra[i + 3] = 255;     // A
  }
  for (let hang = 0; hang < co.cao; hang += 1) {
    const yDich = hang + le.y;
    if (yDich < 0 || yDich >= dich.cao) continue;
    than.copy(
      ra,
      (yDich * dich.rong + le.x) * 4,
      hang * co.rong * 4,
      (hang + 1) * co.rong * 4,
    );
  }
  return ra;
}

/** Đuôi file quyết định định dạng ghi ra. Chỉ hai thứ `nativeImage` ghi được. */
export function dinhDangTheoTen(ten: string): 'png' | 'jpeg' | null {
  const d = ten.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (d === 'png') return 'png';
  if (d === 'jpg' || d === 'jpeg') return 'jpeg';
  return null;
}

export interface KetQuaSuaAnh {
  than: Buffer;
  rong: number;
  cao: number;
  /** Mô tả việc đã làm, để ghép vào câu trả lời cho model. */
  keLai: string;
}

/**
 * Làm thật, trên một file đã được ngục duyệt.
 *
 * Tách khỏi `tools.ts` để phần hình học ở trên kiểm được mà không cần dựng
 * Electron, và để chỗ này chỉ còn đúng những lời gọi `nativeImage`.
 */
export function suaAnh(
  duongNguon: string,
  viec: 'cat' | 'co' | 'bia' | 'vua',
  thamSo: { x?: number; y?: number; rong?: number; cao?: number; nen?: string; chatLuong?: number },
  dinhDang: 'png' | 'jpeg',
): KetQuaSuaAnh {
  let img = nativeImage.createFromPath(duongNguon);
  if (img.isEmpty()) throw new Error('không đọc được ảnh (định dạng lạ, hoặc file hỏng)');
  const goc = img.getSize();
  let keLai = '';

  if (viec === 'cat') {
    const k = kepKhung(
      { x: thamSo.x ?? 0, y: thamSo.y ?? 0, rong: thamSo.rong ?? goc.width, cao: thamSo.cao ?? goc.height },
      { rong: goc.width, cao: goc.height },
    );
    if (!k) throw new Error(`khung cắt nằm ngoài ảnh ${goc.width}×${goc.height}`);
    img = img.crop({ x: k.x, y: k.y, width: k.rong, height: k.cao });
    keLai = `cắt vùng ${k.rong}×${k.cao} tại (${k.x}, ${k.y})`;
  } else if (viec === 'co') {
    if (!thamSo.rong && !thamSo.cao) throw new Error('cần "rong" hoặc "cao" (có một cái thì cái kia tự theo tỉ lệ)');
    // Chỉ truyền chiều nào được nêu: đưa cả hai với số tự đoán là ép méo ảnh.
    img = img.resize({
      ...(thamSo.rong ? { width: Math.round(thamSo.rong) } : {}),
      ...(thamSo.cao ? { height: Math.round(thamSo.cao) } : {}),
      quality: 'best',
    });
    const m = img.getSize();
    keLai = `co từ ${goc.width}×${goc.height} còn ${m.width}×${m.height}`;
  } else {
    const dich = { rong: Math.round(thamSo.rong ?? 0), cao: Math.round(thamSo.cao ?? 0) };
    if (dich.rong < 1 || dich.cao < 1) throw new Error('cần cả "rong" và "cao" cho ảnh bìa');
    if (dich.rong > CANH_TOI_DA || dich.cao > CANH_TOI_DA) throw new Error(`cạnh tối đa ${CANH_TOI_DA}px`);

    if (viec === 'bia') {
      const { co, cat } = tinhBia({ rong: goc.width, cao: goc.height }, dich);
      img = img.resize({ width: co.rong, height: co.cao, quality: 'best' })
        .crop({ x: cat.x, y: cat.y, width: cat.rong, height: cat.cao });
      keLai = `bìa ${dich.rong}×${dich.cao} (phủ kín, cắt bớt rìa của ảnh ${goc.width}×${goc.height})`;
    } else {
      const mau = docMau(thamSo.nen ?? '#ffffff');
      if (!mau) throw new Error('"nen" phải dạng #rrggbb');
      const { co, le } = tinhVua({ rong: goc.width, cao: goc.height }, dich);
      const nho = img.resize({ width: co.rong, height: co.cao, quality: 'best' });
      img = nativeImage.createFromBitmap(
        ghepLenNen(nho.toBitmap(), co, dich, le, mau),
        { width: dich.rong, height: dich.cao },
      );
      keLai = `vừa khung ${dich.rong}×${dich.cao}, chừa viền ${thamSo.nen ?? '#ffffff'}`;
    }
  }

  const ra = img.getSize();
  const than = dinhDang === 'png'
    ? img.toPNG()
    : img.toJPEG(Math.max(1, Math.min(100, Math.round(thamSo.chatLuong ?? 88))));
  if (!than.length) throw new Error('mã hoá ảnh ra rỗng');
  return { than, rong: ra.width, cao: ra.height, keLai };
}
