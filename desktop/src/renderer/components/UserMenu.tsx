/**
 * Menu người dùng + đăng xuất.
 *
 * Phần quan trọng nhất không phải cái menu — mà là ĐẾM VIỆC CHƯA GỬI trước khi
 * đăng xuất. Đăng xuất khi còn nháp chưa đồng bộ là lúc dễ mất dữ liệu nhất:
 * người dùng nghĩ mọi thứ đã lưu, đăng xuất, rồi không bao giờ thấy lại phần đã
 * gõ. Vì thế ở đây hỏi trước, nói rõ số lượng, và mặc định GIỮ dữ liệu lại.
 */
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, LogOut, User, UserPen } from 'lucide-react';
import { useSession } from '../auth/session';
import { useAppState } from '../app-state';
import { useDich } from '../i18n';

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { dich } = useDich();
  const { user, phase, logout, unsyncedCount, api } = useSession();
  const { route, navigate } = useAppState();
  /* Vào/ra trang hồ sơ ⇒ hỏi lại hồ sơ: đổi ảnh, tên ở đó xong thì góc này đổi theo ngay. */
  const oTrangHoSo = route.startsWith('/ho-so');
  /* Ảnh đại diện + tên hiển thị THẬT như trên web (04/10/2026). Phiên đăng nhập
     chỉ chụp lúc đăng nhập — đổi ảnh trên web xong thì app vẫn hiện ảnh cũ —
     nên hỏi lại hồ sơ một lần khi mở app. Ảnh hỏng thì về chữ cái đầu. */
  const [hoSo, datHoSo] = useState<{ anh?: string | undefined; ten?: string | undefined }>({});
  const [anhHong, datAnhHong] = useState(false);
  useEffect(() => {
    if (!api || !user) return;
    let huy = false;
    void (api.request('/api/v1/profile') as Promise<{ avatarUrl?: string | null; displayName?: string | null; fullName?: string | null }>)
      .then((p) => { if (!huy && p) datHoSo({ anh: p.avatarUrl ?? undefined, ten: p.displayName || p.fullName || undefined }); })
      .catch(() => { /* ngoại tuyến — giữ ảnh của phiên */ });
    return () => { huy = true; };
  }, [api, user, oTrangHoSo]);
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

  const label = hoSo.ten?.trim() || user.fullName?.trim() || user.username || dich('Tài khoản');
  const anh = hoSo.anh || user.avatarUrl;
  const coAnh = !!anh && /^(https?:|data:|blob:)/.test(anh) && !anhHong;
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
        <span className="ct-avatar" data-anh={coAnh} aria-hidden>
          {coAnh
            ? <img src={anh} alt="" onError={() => datAnhHong(true)} referrerPolicy="no-referrer" />
            : label.charAt(0).toUpperCase()}
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

          {confirming === null && (
            <button
              type="button"
              role="menuitem"
              className="ct-usermenu-item"
              onClick={() => { setOpen(false); navigate('/ho-so'); }}
            >
              <UserPen size={14} aria-hidden />
              Hồ sơ & tên đăng nhập
            </button>
          )}
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
