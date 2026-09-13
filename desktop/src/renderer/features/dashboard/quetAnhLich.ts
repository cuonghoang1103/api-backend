/**
 * ============================================================
 * QUÉT THỜI KHOÁ BIỂU TỪ ẢNH
 * ============================================================
 *
 * Chụp/chộp màn hình bảng lịch của trường → gửi lên → nhận các buổi đã bóc
 * tách. Backend: `POST /api/v1/class-schedule/doc-anh`, trường tệp tên `anh`.
 *
 * ⚠️ KẾT QUẢ KHÔNG TỰ LƯU, và đó là chủ đích — giống hệt bên iOS. Nó đổ vào
 * ĐÚNG ô chữ mà người dùng vẫn tự gõ, nên bản xem trước, phần bắt lỗi từng
 * dòng và đường lưu an toàn của `SoanLich` vẫn y nguyên. AI chỉ đỡ cho họ
 * việc gõ — nó không được quyền quyết định lịch học thay họ. Một dòng đọc
 * nhầm mà tự lưu là sáng hôm sau người ta tới nhầm phòng, và họ chưa từng
 * nhìn thấy con số nào để mà ngờ.
 */
import type { ApiClient } from '../../api/client';
import type { BuoiQuet } from './nhapNhanhLich';

export interface KetQuaQuet {
  buoi: BuoiQuet[];
  /** Thứ model KHÔNG chắc. Hiện thẳng cho người dùng, đừng nuốt. */
  canhBao: string[];
}

/**
 * Hệ số thu nhỏ để cạnh dài nhất không vượt `canhToiDa`.
 *
 * Tách ra thành hàm thuần vì đây là chỗ duy nhất có phép tính — phần còn lại
 * của việc nén là gọi canvas, không kiểm được ngoài trình duyệt.
 *
 * Ảnh nhỏ hơn trần thì trả 1: phóng TO một ảnh chụp không làm model đọc tốt
 * hơn, chỉ làm tệp nặng thêm.
 */
export function tiLeThuNho(rong: number, cao: number, canhToiDa = 2000): number {
  const canh = Math.max(rong, cao);
  if (!(canh > 0)) return 1;
  return canh > canhToiDa ? canhToiDa / canh : 1;
}

/**
 * Nén ảnh trước khi gửi.
 *
 * Ảnh chụp màn hình trên màn Retina là 6–12 MB PNG. Gửi nguyên thì người dùng
 * ngồi đợi thanh tải chạy, mà model KHÔNG đọc tốt hơn — nó hạ kích thước
 * xuống trước khi nhìn. Backend chặn ở 12 MB, nên ảnh chưa nén còn có thể bị
 * từ chối thẳng.
 */
export async function nenAnh(tep: File, canhToiDa = 2000): Promise<Blob> {
  const anh = await taiAnh(tep);
  const ti = tiLeThuNho(anh.width, anh.height, canhToiDa);
  const rong = Math.max(1, Math.round(anh.width * ti));
  const cao = Math.max(1, Math.round(anh.height * ti));

  const khung = document.createElement('canvas');
  khung.width = rong;
  khung.height = cao;
  const ve = khung.getContext('2d');
  if (!ve) throw new Error('Không dựng được vùng vẽ để nén ảnh.');
  /* Nền TRẮNG trước khi vẽ. Ảnh PNG chụp màn hình hay có nền trong suốt, mà
     JPEG không có kênh alpha — không tô nền thì phần trong suốt ra ĐEN, và
     chữ đen trên nền đen là model không đọc được gì. */
  ve.fillStyle = '#ffffff';
  ve.fillRect(0, 0, rong, cao);
  ve.drawImage(anh, 0, 0, rong, cao);

  const ra = await new Promise<Blob | null>((xong) => {
    khung.toBlob(xong, 'image/jpeg', 0.88);
  });
  if (!ra) throw new Error('Không nén được ảnh vừa chọn.');
  return ra;
}

function taiAnh(tep: File): Promise<HTMLImageElement> {
  return new Promise((xong, hong) => {
    const url = URL.createObjectURL(tep);
    const anh = new Image();
    anh.onload = () => { URL.revokeObjectURL(url); xong(anh); };
    anh.onerror = () => { URL.revokeObjectURL(url); hong(new Error('Không mở được ảnh vừa chọn.')); };
    anh.src = url;
  });
}

/** Trần chờ. Model nhìn ảnh mất hàng chục giây — mặc định của `fetch` là quá ngắn. */
const TRAN_CHO_MS = 180_000;

export async function quetAnhLich(api: ApiClient, tep: File): Promise<KetQuaQuet> {
  const nho = await nenAnh(tep);
  const bieu = new FormData();
  // Tên trường PHẢI là `anh` — backend khai `nhanAnh.single('anh')`.
  bieu.append('anh', nho, 'lich.jpg');

  const dung = new AbortController();
  const hen = setTimeout(() => dung.abort(), TRAN_CHO_MS);
  try {
    const res = await fetch(`${api.baseUrlForForms()}/api/v1/class-schedule/doc-anh`, {
      method: 'POST',
      headers: api.authHeaders(),
      body: bieu,
      signal: dung.signal,
    });
    const than = await res.json().catch(() => null) as
      { data?: KetQuaQuet; message?: string } | null;
    if (!res.ok) {
      throw new Error(than?.message ?? `Đọc ảnh không thành công (${res.status}).`);
    }
    return {
      buoi: than?.data?.buoi ?? [],
      canhBao: than?.data?.canhBao ?? [],
    };
  } catch (e) {
    /* `AbortError` ra thành "Đọc ảnh không thành công" thì người dùng đi kiểm
       ảnh của mình, trong khi thứ cần làm là thử lại. Nói đúng chuyện đã xảy
       ra. */
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('Đọc ảnh quá lâu (hơn 3 phút) nên đã dừng. Thử lại, hoặc cắt ảnh nhỏ lại.');
    }
    throw e;
  } finally {
    clearTimeout(hen);
  }
}
