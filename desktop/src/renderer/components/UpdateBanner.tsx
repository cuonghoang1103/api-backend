/**
 * Thông báo có bản mới, đặt ngay cạnh tài khoản ở chân sidebar.
 *
 * ─── Vì sao phải có ───
 * Trước đây trạng thái cập nhật chỉ nằm trong Cài đặt. Không ai vào Cài đặt mỗi
 * ngày để hỏi xem có bản mới không, nên phần lớn người dùng sẽ mắc kẹt ở bản cũ
 * vĩnh viễn — và họ không hề biết là mình đang mắc kẹt. Thông tin quan trọng
 * phải tự tìm đến người dùng, không bắt người dùng đi tìm nó.
 *
 * ─── Vì sao KHÔNG dùng hộp thoại chặn ───
 * Một hộp thoại bật lên giữa lúc đang gõ là cắt ngang công việc để báo một tin
 * không khẩn cấp. Dải này nằm im ở góc, người dùng bấm khi nào rảnh.
 *
 * Chỉ hiện khi có việc để làm — `idle`, `checking`, `none` thì không hiện gì.
 * Một dải báo "đang kiểm tra…" mỗi 6 tiếng là nhiễu, không phải thông tin.
 */
import { useEffect, useState } from 'react';
import { AlertTriangle, Download, FolderOpen, RotateCw } from 'lucide-react';
import type { UpdateStatus } from '../../shared/ipc';

/**
 * Trạng thái cập nhật dùng chung.
 *
 * Đọc `getStatus()` một lần lúc gắn, RỒI mới nghe sự kiện. Chỉ nghe sự kiện là
 * bỏ lỡ mọi lần kiểm đã xảy ra trước đó — main tự kiểm sau 15 giây từ lúc mở
 * app, còn component này có thể gắn muộn hơn, và khi đó bản mới đã tải xong mà
 * giao diện vẫn im lặng.
 */
export function useUpdateStatus(): UpdateStatus {
  const [status, setStatus] = useState<UpdateStatus>({ state: 'idle' });

  useEffect(() => {
    const bridge = window.cuongthai;
    if (!bridge) return;
    void bridge.update.getStatus().then(setStatus);
    return bridge.on('update:status', (payload) => setStatus(payload as UpdateStatus));
  }, []);

  return status;
}

export function UpdateBanner({ collapsed }: { collapsed: boolean }) {
  const status = useUpdateStatus();

  // Không có gì để người dùng làm → không chiếm chỗ.
  if (status.state === 'idle' || status.state === 'checking' || status.state === 'none') {
    return null;
  }

  if (status.state === 'error') {
    // Lỗi cập nhật là chuyện nhỏ và thường tự khỏi (mạng chập chờn). Hiện nhỏ,
    // không màu đỏ báo động — app vẫn dùng bình thường.
    return (
      <div className="ct-update-banner" data-tone="muted" title={status.message}>
        <AlertTriangle size={13} aria-hidden />
        {!collapsed && <span>Không kiểm tra được bản mới</span>}
      </div>
    );
  }

  /**
   * macOS: có bản mới nhưng phải TẢI TAY.
   *
   * Không có nút "cài" ở đây vì không cài được — Squirrel.Mac từ chối bản chưa
   * ký. Nút này mở trang tải bằng trình duyệt hệ thống, và câu chữ nói THẲNG là
   * phải tải tay, thay vì để người dùng bấm một nút "cập nhật" rồi không thấy
   * gì xảy ra.
   */
  if (status.state === 'manual') {
    return (
      <button
        type="button"
        className="ct-update-banner"
        data-tone="ready"
        onClick={() => void window.cuongthai?.update.tuCapNhat()}
        title={`Bấm để cập nhật lên ${status.version} ngay: app tự tải và tự thay chính nó rồi mở lại.`}
      >
        <RotateCw size={13} aria-hidden />
        {!collapsed && (
          <span>
            Cập nhật <strong>{status.version}</strong>
          </span>
        )}
      </button>
    );
  }

  if (status.state === 'dangCai' || status.state === 'caiXong') {
    return (
      <div className="ct-update-banner" data-tone="busy"
        title={status.state === 'dangCai' ? 'Đang thay app…' : 'Xong — đang mở lại app'}>
        <RotateCw size={13} aria-hidden />
        {!collapsed && <span>{status.state === 'dangCai' ? 'Đang cài…' : 'Đang mở lại…'}</span>}
      </div>
    );
  }

  if (status.state === 'taiTay') {
    return (
      <div className="ct-update-banner" data-tone="busy" title={`Đang tải bản cài ${status.version}… ${status.percent}%`}>
        <Download size={13} aria-hidden />
        {!collapsed && <span>Đang tải… {status.percent}%</span>}
      </div>
    );
  }

  if (status.state === 'taiXong') {
    return (
      <button
        type="button"
        className="ct-update-banner"
        data-tone="ready"
        onClick={() => void window.cuongthai?.update.moThuMuc()}
        title={`Đã tải xong bản ${status.version}. Bấm để mở thư mục, rồi mở file .dmg và kéo CuongThai vào Applications.`}
      >
        <FolderOpen size={13} aria-hidden />
        {!collapsed && (
          <span>
            Mở bản <strong>{status.version}</strong>
          </span>
        )}
      </button>
    );
  }

  if (status.state === 'ready') {
    return (
      <button
        type="button"
        className="ct-update-banner"
        data-tone="ready"
        onClick={() => void window.cuongthai?.update.install()}
        title={`Bản ${status.version} đã sẵn sàng — bấm để khởi động lại và cài`}
      >
        <RotateCw size={13} aria-hidden />
        {!collapsed && (
          <span>
            Cài bản <strong>{status.version}</strong>
          </span>
        )}
      </button>
    );
  }

  // available / downloading — đang tải, chưa có gì để bấm.
  return (
    <div
      className="ct-update-banner"
      data-tone="busy"
      title={
        status.state === 'downloading'
          ? `Đang tải bản mới… ${status.percent}%`
          : `Có bản ${status.version} — đang tải`
      }
    >
      <Download size={13} aria-hidden />
      {!collapsed && (
        <span>
          {status.state === 'downloading'
            ? `Đang tải… ${status.percent}%`
            : `Có bản ${status.version}`}
        </span>
      )}
    </div>
  );
}
