/**
 * Tải nhạc lên site — chọn file trên máy, đẩy thẳng lên R2 qua backend.
 *
 * Vì sao cần: thêm bài từ YouTube đã CHẾT — máy chủ nằm ở trung tâm dữ liệu và
 * YouTube trả 403 khi nó tải media (đo 18/08/2026: lấy metadata thì được, tải
 * dữ liệu thì không, thử cả năm kiểu player client đều hỏng, yt-dlp đã là bản
 * mới nhất). Đường tự tải file lên không phụ thuộc YouTube nên không bao giờ
 * dính lại chuyện đó, và bài nằm sẵn trên R2 nên bàn DJ nạp tức thì.
 *
 * ⚠️ Dùng `XMLHttpRequest` chứ không `fetch`. Chỉ XHR mới có `upload.onprogress`
 * — mà file nhạc tới 200MB thì một thanh tiến độ không phải trang trí: thiếu nó
 * người dùng nhìn màn hình đứng im vài phút và sẽ bấm lại lần nữa.
 *
 * ⚠️ KHÔNG tự đặt `Content-Type`. Trình duyệt phải tự sinh nó kèm `boundary`
 * của multipart; đặt tay là máy chủ không tách nổi các phần và nhận về rỗng.
 */
import { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useSession } from '../../auth/session';

interface Props {
  /** 'NORMAL' = thư viện thường · 'REMIX' = kho remix cho bàn DJ. */
  category: 'NORMAL' | 'REMIX';
  onXong: () => void;
}

/** `Nghệ sĩ - Tên bài.mp3` → tách đôi. Không khớp thì cả tên file là tên bài. */
export function tachTen(tenFile: string): { title: string; artist: string } {
  const khongDuoi = tenFile.replace(/\.[^.]+$/, '').trim();
  const vach = khongDuoi.split(/\s+-\s+/);
  if (vach.length >= 2 && vach[0] && vach.slice(1).join(' - ').trim()) {
    return { artist: vach[0].trim(), title: vach.slice(1).join(' - ').trim() };
  }
  return { title: khongDuoi || tenFile, artist: 'Không rõ nghệ sĩ' };
}

/** Đọc thời lượng ngay ở máy — máy chủ không đoán được, và cột thời gian trống
 *  nhìn như dữ liệu hỏng. Không đọc được thì bỏ qua, không chặn việc tải lên. */
function doThoiLuong(file: File): Promise<number | undefined> {
  return new Promise((xong) => {
    const url = URL.createObjectURL(file);
    const am = new Audio();
    const dong = (giay?: number) => { URL.revokeObjectURL(url); xong(giay); };
    am.addEventListener('loadedmetadata', () => {
      dong(Number.isFinite(am.duration) ? Math.round(am.duration) : undefined);
    });
    am.addEventListener('error', () => dong(undefined));
    // Trần 8 giây: file lạ có thể không bao giờ phát sự kiện nào.
    setTimeout(() => dong(undefined), 8000);
    am.src = url;
  });
}

export function TaiNhacLen({ category, onXong }: Props) {
  const { api } = useSession();
  const oFile = useRef<HTMLInputElement | null>(null);
  const [dangTai, setDangTai] = useState<string | null>(null);
  const [phanTram, setPhanTram] = useState(0);
  const [loi, setLoi] = useState<string | null>(null);

  const day = (file: File): Promise<void> =>
    new Promise((xong, hong) => {
      if (!api) { hong(new Error('Chưa đăng nhập.')); return; }
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${api.baseUrlForForms()}/api/v1/music/tracks`);
      for (const [k, v] of Object.entries(api.authHeaders())) xhr.setRequestHeader(k, v);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setPhanTram(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) { xong(); return; }
        let thongDiep = `Máy chủ trả về ${xhr.status}`;
        try {
          const than = JSON.parse(xhr.responseText) as { message?: string };
          if (than.message) thongDiep = than.message;
        } catch { /* thân không phải JSON — giữ thông báo theo mã lỗi */ }
        hong(new Error(thongDiep));
      };
      xhr.onerror = () => hong(new Error('Mất kết nối khi đang tải lên.'));
      void (async () => {
        const { title, artist } = tachTen(file.name);
        const giay = await doThoiLuong(file);
        const form = new FormData();
        form.append('audio', file);
        form.append('title', title);
        form.append('artist', artist);
        form.append('category', category);
        if (giay !== undefined) form.append('durationSeconds', String(giay));
        xhr.send(form);
      })();
    });

  const chon = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoi(null);
    // Đọc ra MẢNG ngay. `FileList` là danh sách SỐNG: reset ô input ở cuối là
    // nó rỗng ngay giữa chừng vòng lặp.
    const danhSach = Array.from(files);
    try {
      for (const file of danhSach) {
        setDangTai(file.name);
        setPhanTram(0);
        await day(file);
      }
      onXong();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangTai(null);
      setPhanTram(0);
      if (oFile.current) oFile.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={oFile}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={(e) => void chon(e.target.files)}
      />
      <button
        type="button"
        className="ct-btn ct-btn-ghost"
        onClick={() => oFile.current?.click()}
        disabled={dangTai !== null}
        title={category === 'REMIX'
          ? 'Tải file nhạc lên kho Remix — bàn DJ nạp được ngay'
          : 'Tải file nhạc từ máy lên thư viện'}
      >
        {dangTai ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Upload size={14} aria-hidden />}
        {dangTai ? `Đang tải… ${phanTram}%` : 'Tải nhạc lên'}
      </button>
      {dangTai && (
        <span className="ct-muted" style={{ fontSize: 12 }}>
          {dangTai}
        </span>
      )}
      {loi && (
        <div className="ct-notice" data-tone="err" role="alert" style={{ width: '100%' }}>
          <span>{loi}</span>
          <button type="button" className="ct-linklike" onClick={() => setLoi(null)}>Đóng</button>
        </div>
      )}
    </>
  );
}
