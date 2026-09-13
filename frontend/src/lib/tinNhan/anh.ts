/**
 * Đặt tên tệp khi lưu ảnh trong tin nhắn về máy.
 *
 * ⚠️ Bên main khai `luuFileSchema` CẤM dấu phân cách đường dẫn, ký tự điều
 * khiển và `..`. Lấy bừa phần cuối URL là có ngày gặp một tên bị từ chối, mà
 * lỗi hiện ra lại là "lưu thất bại" chung chung — người dùng không có cách nào
 * đoán vì sao. Nên làm sạch ở đây, và có phép kiểm ghim đúng mấy hình dạng URL
 * thật.
 */

const DUOI_ANH = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp'];

/** Đuôi tệp suy từ đường dẫn, mặc định `jpg`. */
function duoi(duong: string): string {
  const m = /\.([a-z0-9]{2,5})$/i.exec(duong);
  const d = m?.[1]?.toLowerCase();
  return d && DUOI_ANH.includes(d) ? d : 'jpg';
}

/** Tên đã kết thúc bằng một đuôi ảnh thật chưa. */
function coDuoiAnh(ten: string): boolean {
  const m = /\.([a-z0-9]{2,5})$/i.exec(ten);
  return !!m && DUOI_ANH.includes(m[1]!.toLowerCase());
}

/** Ký tự mà `luuFileSchema` chặn: dấu phân cách và mọi ký tự điều khiển. */
// eslint-disable-next-line no-control-regex
const CHAN = /[/\\\u0000-\u001f]/g;

/**
 * `https://cdn/x/abc%20def.png?w=1` → `abc def.png`.
 *
 * Không đoán được tên thì lấy `anh-<giờ>.jpg` — thà một tên buồn tẻ còn hơn
 * một hộp thoại lưu mở ra với ô tên trống.
 */
export function tenAnhTuUrl(url: string, bayGio = new Date()): string {
  let duong = url;
  try {
    duong = new URL(url, 'https://x.invalid').pathname;
  } catch { /* không phải URL — dùng nguyên chuỗi */ }

  let ten = duong.split('/').filter(Boolean).pop() ?? '';
  try { ten = decodeURIComponent(ten); } catch { /* giữ nguyên nếu %% hỏng */ }

  // Bỏ mọi thứ schema chặn TRƯỚC, rồi mới xét còn lại gì.
  ten = ten.replace(CHAN, '').replace(/\.\./g, '.').trim();

  if (ten === '' || ten.startsWith('.')) {
    const h = (n: number) => String(n).padStart(2, '0');
    ten = `anh-${bayGio.getFullYear()}${h(bayGio.getMonth() + 1)}${h(bayGio.getDate())}`
      + `-${h(bayGio.getHours())}${h(bayGio.getMinutes())}${h(bayGio.getSeconds())}.${duoi(duong)}`;
  } else if (!coDuoiAnh(ten)) {
    /* Hỏi "có phải đuôi ẢNH không", KHÔNG phải "có đuôi nào không". Vài CDN
       trả ảnh qua `lay-anh.php`; giữ nguyên tên đó thì người dùng lưu về một
       tệp `.php` mà máy không biết mở bằng gì. */
    ten = `${ten}.${duoi(duong)}`;
  }
  return ten.slice(0, 200);
}


/**
 * Chép ảnh vào clipboard.
 *
 * ⚠️ Trình duyệt CHỈ nhận `image/png` trong `ClipboardItem` — đưa JPEG vào là
 * ném lỗi ngay. Nên phải vẽ qua canvas rồi xuất PNG, kể cả khi ảnh gốc đã là
 * ảnh hợp lệ.
 *
 * ⚠️ `crossOrigin = 'anonymous'` là BẮT BUỘC: ảnh nằm ở CDN khác gốc trang,
 * không đặt thì canvas bị "nhuốm bẩn" và `toBlob` ném `SecurityError` — mà câu
 * lỗi hiện ra lại là "chép ảnh hỏng", không nói gì về nguyên nhân thật.
 */
export async function chepAnhVaoClipboard(url: string): Promise<void> {
  const anh = await taiAnh(url);
  const khung = document.createElement('canvas');
  khung.width = anh.naturalWidth;
  khung.height = anh.naturalHeight;
  const ve = khung.getContext('2d');
  if (!ve) throw new Error('Không dựng được vùng vẽ.');
  ve.drawImage(anh, 0, 0);
  const png = await new Promise<Blob | null>((xong) => khung.toBlob(xong, 'image/png'));
  if (!png) throw new Error('Không đổi được ảnh sang PNG.');
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
}

function taiAnh(url: string): Promise<HTMLImageElement> {
  return new Promise((xong, hong) => {
    const a = new Image();
    a.crossOrigin = 'anonymous';
    a.onload = () => xong(a);
    a.onerror = () => hong(new Error('Không tải được ảnh.'));
    a.src = url;
  });
}
