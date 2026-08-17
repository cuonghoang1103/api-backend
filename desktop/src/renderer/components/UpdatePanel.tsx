/**
 * Mục cập nhật trong Cài đặt.
 *
 * Hiển thị ĐÚNG những gì app biết. Không có nhánh nào in ra "đã là bản mới
 * nhất" khi chưa hề kiểm tra — trạng thái đó có tên riêng (`idle`) vì nó khác
 * hẳn với `none` (đã hỏi máy chủ và không có bản mới).
 */
import { useEffect, useState } from 'react';
import { AlertTriangle, Check, RefreshCw, RotateCw } from 'lucide-react';
import type { AppInfo, UpdateStatus } from '../../shared/ipc';
import { useUpdateStatus } from './UpdateBanner';

export function UpdatePanel() {
  // Dùng CHUNG hook với dải ở sidebar. Hai chỗ tự giữ trạng thái riêng sẽ có
  // lúc nói hai điều khác nhau về cùng một sự việc.
  const status = useUpdateStatus();
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    void window.cuongthai?.app.getInfo().then(setInfo);
  }, []);

  const check = () => {
    void window.cuongthai?.update.check();
  };

  return (
    <section className="ct-section">
      <h2>Cập nhật</h2>

      <dl className="ct-rows">
        <div className="ct-row">
          <dt>Phiên bản đang chạy</dt>
          <dd>{info?.version ?? '…'}</dd>
        </div>
        <div className="ct-row">
          <dt>Trạng thái</dt>
          <dd>
            <StatusLine status={status} isDev={info?.isDev === true} />
          </dd>
        </div>
      </dl>

      <div className="ct-actions">
        <button
          type="button"
          className="ct-btn ct-btn-ghost"
          onClick={check}
          disabled={status.state === 'checking' || status.state === 'downloading'}
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={status.state === 'checking' ? 'ct-spin' : undefined}
          />
          Kiểm tra bản mới
        </button>

        {status.state === 'ready' && (
          <button
            type="button"
            className="ct-btn"
            onClick={() => void window.cuongthai?.update.install()}
          >
            <RotateCw size={14} aria-hidden />
            Khởi động lại để cài
          </button>
        )}
      </div>

      {info?.isDev === true && (
        <p className="ct-field-help">
          Đang chạy từ mã nguồn nên không có phiên bản phát hành để đối chiếu.
          Cập nhật chỉ hoạt động ở bản đã cài đặt.
        </p>
      )}
    </section>
  );
}

function StatusLine({ status, isDev }: { status: UpdateStatus; isDev: boolean }) {
  switch (status.state) {
    case 'idle':
      return <span className="ct-muted-inline">Chưa kiểm tra</span>;
    case 'checking':
      return <span className="ct-muted-inline">Đang kiểm tra…</span>;
    case 'none':
      return isDev ? (
        <span className="ct-muted-inline">Không áp dụng ở bản dev</span>
      ) : (
        <span style={{ color: 'var(--ct-ok)' }}>
          <Check size={13} aria-hidden /> Đang dùng bản mới nhất
        </span>
      );
    case 'available':
      return <span>Có bản {status.version} — đang tải…</span>;
    case 'downloading':
      return <span>Đang tải… {status.percent}%</span>;
    case 'ready':
      return (
        <span style={{ color: 'var(--ct-ok)' }}>
          Bản {status.version} đã sẵn sàng
        </span>
      );
    case 'manual':
      // macOS chưa ký số ⇒ Squirrel.Mac từ chối áp bản mới. Nói THẲNG lý do và
      // việc phải làm, thay vì một dòng "đã có bản mới" rồi để họ đi tìm nút
      // cài không tồn tại.
      return (
        <span style={{ color: 'var(--ct-warn)' }}>
          Đã có bản {status.version}. Bản macOS chưa ký số nên phải tải và cài tay
          — mở trang tải ở nút phía trên.
        </span>
      );
    case 'error':
      return (
        <span style={{ color: 'var(--ct-err)' }}>
          <AlertTriangle size={13} aria-hidden /> {status.message}
        </span>
      );
    default:
      // `never` ở đây là phép kiểm lúc BIÊN DỊCH: thêm một trạng thái mới vào
      // `UpdateStatus` mà quên xử lý ở đây thì TypeScript báo lỗi ngay.
      return assertNever(status);
  }
}

function assertNever(value: never): never {
  throw new Error(`Trạng thái cập nhật chưa xử lý: ${JSON.stringify(value)}`);
}
