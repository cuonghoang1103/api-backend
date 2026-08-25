/**
 * Mục cập nhật trong Cài đặt.
 *
 * Hiển thị ĐÚNG những gì app biết. Không có nhánh nào in ra "đã là bản mới
 * nhất" khi chưa hề kiểm tra — trạng thái đó có tên riêng (`idle`) vì nó khác
 * hẳn với `none` (đã hỏi máy chủ và không có bản mới).
 */
import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Download, FolderOpen, RefreshCw, RotateCw } from 'lucide-react';
import type { AppInfo, UpdateStatus } from '../../shared/ipc';
import { useUpdateStatus } from './UpdateBanner';

export function UpdatePanel() {
  // Dùng CHUNG hook với dải ở sidebar. Hai chỗ tự giữ trạng thái riêng sẽ có
  // lúc nói hai điều khác nhau về cùng một sự việc.
  const status = useUpdateStatus();
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [noi, setNoi] = useState<{ duong: string; daCaiDung: boolean; ghiDuoc: boolean } | null>(null);

  useEffect(() => {
    void window.cuongthai?.app.getInfo().then(setInfo);
    void window.cuongthai?.update.noiDangChay?.().then(setNoi).catch(() => {});
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

        {/* macOS, bản đã TẢI SẴN ở nền: bấm là tráo ngay, vài giây. */}
        {status.state === 'sanSang' && noi?.ghiDuoc !== false && (
          <button
            type="button"
            className="ct-btn"
            onClick={() => void window.cuongthai?.update.tuCapNhat()}
          >
            <RotateCw size={14} aria-hidden />
            Khởi động lại để dùng {status.version}
          </button>
        )}

        {/* macOS: KHÔNG có nút "khởi động lại để cài" theo đường Squirrel vì nó
            sẽ không cài được gì (Squirrel.Mac từ chối bản chưa ký). Nút ở đây
            tải đúng file cài cho kiến trúc máy này — trang phát hành có 15 tệp
            và chọn nhầm là tải 140MB rồi không mở được. */}
        {status.state === 'manual' && (
          <>
            {/* Cập nhật THẬT: tải .zip rồi tráo bó ứng dụng, không qua Squirrel.
                Chỉ hiện khi chỗ đang chạy ghi đè được — nếu không thì nút này
                là một lời hứa suông. */}
            {noi?.ghiDuoc !== false && (
              <button
                type="button"
                className="ct-btn"
                onClick={() => void window.cuongthai?.update.tuCapNhat()}
              >
                <RotateCw size={14} aria-hidden />
                Cập nhật lên {status.version} ngay
              </button>
            )}
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() => void window.cuongthai?.update.taiThuCong()}
              title="Tải file .dmg về để cài tay"
            >
              <Download size={14} aria-hidden />
              Tải bản cài
            </button>
          </>
        )}

        {status.state === 'taiXong' && (
          <button
            type="button"
            className="ct-btn"
            onClick={() => void window.cuongthai?.update.moThuMuc()}
          >
            <FolderOpen size={14} aria-hidden />
            Mở thư mục chứa file cài
          </button>
        )}
      </div>

      {/* ⚠️ Cảnh báo mở NHẦM BẢN DỰNG THỬ.
          Đây là thứ đã làm người dùng bấm cập nhật ba lần mà không hiểu vì sao
          không lên bản mới: họ mở app từ `desktop/release/…` trong thư mục mã
          nguồn (bản 0.4.0 cũ), trong khi bản thật trong Applications đã mới.
          Không có dòng này thì không có gì trên màn hình nói ra điều đó.

          ⚠️ CHỈ hiện trên macOS. `daCaiDung` luôn `true` ở Linux/Windows (xem
          `noiDangChay` trong `main/ipc/update.ts`) vì hai nền tảng đó tự cập
          nhật được thật, và ta không có cách phân biệt đáng tin "đã cài đúng
          chỗ" với "giải nén ra đâu đó".

          Trước 24/08/2026 điều kiện là `!trongApplications`, mà đường dẫn lại
          tính theo hình dạng bó ứng dụng của macOS — nên MỌI người dùng Linux
          và Windows đều thấy dải đỏ này, với nội dung SAI SỰ THẬT ("sẽ không
          bao giờ nhận được bản mới") và hướng dẫn vô nghĩa với họ (thư mục
          Applications, Spotlight). Vì thế chữ dưới đây được phép nói giọng
          macOS: nó không thể xuất hiện ở nơi khác. */}
      {noi && !noi.daCaiDung && (
        <div className="ct-notice" data-tone="err" style={{ marginTop: 10 }}>
          <AlertTriangle size={15} aria-hidden />
          <span>
            <strong>Bạn đang mở một bản dựng thử, không phải app đã cài.</strong>{' '}
            Nó chạy từ <code>{noi.duong}</code> nên sẽ không bao giờ nhận được bản mới.
            Hãy thoát rồi mở CuongThai từ thư mục <strong>Applications</strong> (hoặc Spotlight).
          </span>
        </div>
      )}

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
          Đã có bản {status.version}. Bản macOS chưa ký số nên không tự cài đè được
          — bấm “Tải bản {status.version}” rồi mở file .dmg và kéo app vào Applications.
        </span>
      );
    case 'sanSang':
      return (
        <span style={{ color: 'var(--ct-ok)' }}>
          <Check size={13} aria-hidden /> Bản {status.version} đã tải xong — bấm “Khởi động lại”
          là app tự thay chính nó rồi mở lại, không phải kéo thả gì.
        </span>
      );
    case 'taiTay':
      return <span>Đang tải bản {status.version}… {status.percent}%</span>;
    case 'dangCai':
      return <span>Đang thay app sang bản {status.version}…</span>;
    case 'caiXong':
      return (
        <span style={{ color: 'var(--ct-ok)' }}>
          <Check size={13} aria-hidden /> Đã cài bản {status.version} — app đang khởi động lại…
        </span>
      );
    case 'taiXong':
      return (
        <span style={{ color: 'var(--ct-ok)' }}>
          <Check size={13} aria-hidden /> Đã tải xong bản {status.version}. Mở file
          .dmg rồi kéo CuongThai vào Applications (ghi đè bản cũ).
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
