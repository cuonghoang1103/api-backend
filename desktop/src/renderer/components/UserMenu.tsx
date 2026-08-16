/**
 * Menu người dùng + đăng xuất.
 *
 * Phần quan trọng nhất không phải cái menu — mà là ĐẾM VIỆC CHƯA GỬI trước khi
 * đăng xuất. Đăng xuất khi còn nháp chưa đồng bộ là lúc dễ mất dữ liệu nhất:
 * người dùng nghĩ mọi thứ đã lưu, đăng xuất, rồi không bao giờ thấy lại phần đã
 * gõ. Vì thế ở đây hỏi trước, nói rõ số lượng, và mặc định GIỮ dữ liệu lại.
 */
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, LogOut, User } from 'lucide-react';
import { useSession } from '../auth/session';

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { user, phase, logout, unsyncedCount } = useSession();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài hoặc bấm Escape. Thiếu một trong hai thì menu kẹt lại
  // và che mất nội dung bên dưới.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  const label = user.fullName?.trim() || user.username || 'Tài khoản';
  const unverified = phase === 'chua-xac-minh-duoc';

  const startLogout = async () => {
    const pending = await unsyncedCount();
    if (pending > 0) {
      setConfirming(pending);
      return;
    }
    await doLogout(false);
  };

  const doLogout = async (discard: boolean) => {
    setBusy(true);
    try {
      await logout({ discardUnsynced: discard });
      setOpen(false);
      setConfirming(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ct-usermenu" ref={ref}>
      <button
        type="button"
        className="ct-nav-item"
        aria-haspopup="menu"
        aria-expanded={open}
        title={collapsed ? label : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ct-avatar" aria-hidden>
          {label.charAt(0).toUpperCase()}
        </span>
        <span className="ct-nav-label">{label}</span>
      </button>

      {open && (
        <div className="ct-usermenu-pop" role="menu">
          <div className="ct-usermenu-head">
            <div className="ct-usermenu-name">{label}</div>
            {user.email && <div className="ct-usermenu-mail">{user.email}</div>}
            {unverified && (
              <div className="ct-usermenu-warn">
                <AlertTriangle size={12} aria-hidden />
                Chưa xác minh được phiên (đang ngoại tuyến)
              </div>
            )}
          </div>

          {confirming === null ? (
            <button
              type="button"
              role="menuitem"
              className="ct-usermenu-item"
              onClick={() => void startLogout()}
              disabled={busy}
            >
              <LogOut size={14} aria-hidden />
              Đăng xuất
            </button>
          ) : (
            <div className="ct-usermenu-confirm">
              <div className="ct-usermenu-warn">
                <AlertTriangle size={13} aria-hidden />
                Còn <strong>{confirming}</strong> thay đổi chưa gửi lên máy chủ.
              </div>
              <p>
                Đăng xuất bây giờ vẫn <strong>giữ nguyên</strong> chúng trên máy.
                Chúng sẽ được gửi khi bạn đăng nhập lại.
              </p>
              <div className="ct-actions" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="ct-btn"
                  onClick={() => void doLogout(false)}
                  disabled={busy}
                >
                  Đăng xuất, giữ dữ liệu
                </button>
                <button
                  type="button"
                  className="ct-btn ct-btn-ghost"
                  onClick={() => setConfirming(null)}
                  disabled={busy}
                >
                  Huỷ
                </button>
              </div>
              {/* Xoá dữ liệu là hành động KHÔNG lùi được nên nó nằm riêng, chữ
                  nhỏ, và không phải nút chính. Không bao giờ đặt cạnh nút
                  "Đăng xuất" như một lựa chọn ngang hàng. */}
              <button
                type="button"
                className="ct-usermenu-danger"
                onClick={() => void doLogout(true)}
                disabled={busy}
              >
                Đăng xuất và xoá {confirming} thay đổi chưa gửi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Dùng khi chưa có phiên — giữ chỗ cho bố cục sidebar. */
export function UserMenuPlaceholder() {
  return (
    <div className="ct-nav-item" aria-hidden>
      <User className="ct-nav-icon" size={17} />
      <span className="ct-nav-label">…</span>
    </div>
  );
}
