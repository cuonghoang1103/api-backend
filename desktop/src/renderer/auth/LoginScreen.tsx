/**
 * Màn hình đăng nhập.
 *
 * Đăng nhập BẮT BUỘC có mạng — backend không có cơ chế xác thực ngoại tuyến, và
 * bịa ra một cơ chế như vậy ở phía client là tự dựng một cánh cửa không ai canh.
 * Khi mất mạng, màn hình này nói thẳng ra điều đó thay vì để người dùng gõ mật
 * khẩu rồi nhận một lỗi khó hiểu.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LogIn, WifiOff } from 'lucide-react';
import { ApiError } from '../api/client';
import { useSession } from './session';

export function LoginScreen({ online }: { online: boolean }) {
  const { login, dangNhapBangToken } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Nhà cung cấp đang chờ trình duyệt trả lời, hoặc `null`. */
  const [dangCho, setDangCho] = useState<'google' | 'github' | 'apple' | null>(null);

  /*
   * Nhà cung cấp nào ĐANG BẬT trên máy chủ.
   *
   * Apple cần khoá `.p8` mà chủ web phải tự tạo; chưa có thì `/api/auth/providers`
   * không liệt kê `apple`. Vẽ sẵn nút Apple lúc đó nghĩa là người dùng bấm, trình
   * duyệt mở ra một trang đăng nhập thường, và app thì ngồi chờ một token không
   * bao giờ tới — hỏng hoàn toàn im lặng.
   *
   * Mặc định coi như CÓ google+github (hai cái đã chạy từ lâu) để nút không nhấp
   * nháy lúc mạng chậm; `apple` thì phải hỏi được mới hiện.
   */
  const [nhaBat, setNhaBat] = useState<Set<string>>(new Set(['google', 'github']));
  useEffect(() => {
    let con = true;
    void (async () => {
      try {
        const tin = await window.cuongthai?.app.getInfo();
        if (!tin?.webOrigin) return;
        const r = await fetch(`${tin.webOrigin}/api/auth/providers`);
        if (!r.ok) return;
        const d: unknown = await r.json();
        if (con && d && typeof d === 'object') setNhaBat(new Set(Object.keys(d)));
      } catch { /* không hỏi được thì giữ mặc định */ }
    })();
    return () => { con = false; };
  }, []);

  /*
   * Token quay về từ cổng vòng `127.0.0.1` (xem `main/ipc/oauthVong.ts`).
   *
   * ⚠️ Gắn MỘT LẦN cho cả vòng đời màn hình. Gắn/gỡ theo `dangCho` thì có một
   * khe giữa lúc đặt state và lúc effect chạy lại — mà token có thể về đúng
   * trong khe đó nếu người dùng đã đăng nhập sẵn trên trình duyệt.
   */
  useEffect(() => {
    const bo = window.cuongthai?.on('oauth:xong', (payload) => {
      const token = (payload as { token?: string } | null)?.token;
      if (!token) return;
      setError(null);
      void dangNhapBangToken(token)
        .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Đăng nhập không thành công.'))
        .finally(() => setDangCho(null));
    });
    return () => { bo?.(); };
  }, [dangNhapBangToken]);

  // Rời màn hình mà còn lượt đang chờ ⇒ đóng cổng. Không đóng là để lại một
  // cổng đang nghe cho tới khi hết giờ.
  useEffect(() => () => { void window.cuongthai?.oauth.huy(); }, []);

  const dangNhapNgoai = (nha: 'google' | 'github' | 'apple'): void => {
    setError(null);
    setDangCho(nha);
    void window.cuongthai?.oauth.batDau(nha).catch(() => {
      setDangCho(null);
      setError('Không mở được trình duyệt để đăng nhập.');
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await login(username, password);
    } catch (caught) {
      // Hiển thị thông báo của máy chủ khi có (nó phân biệt được "sai mật khẩu"
      // với "tài khoản bị khoá"), còn lỗi mạng thì nói rõ là lỗi mạng — hai
      // chuyện này cần hai hành động khác nhau từ người dùng.
      if (caught instanceof ApiError) {
        setError(caught.failure.message);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setBusy(false);
    }
  };

  const openWeb = (path: string) => {
    void window.cuongthai?.app
      .getInfo()
      .then((info) => window.cuongthai?.app.openExternal(`${info.webOrigin}${path}`));
  };

  return (
    /* Dựng theo ĐÚNG màn đăng nhập của app iOS (ảnh người dùng gửi 24/08/2026):
       icon panda trong thẻ bo tròn · chữ "CuongThai" tô chuyển sắc · "Chào mừng
       trở lại" · ô nhập bo tròn có icon · nút chuyển sắc · liên kết điều khoản.

       Bản cũ dùng lại `.ct-boot` + `.ct-card` chung — một thẻ xám trống giữa
       nền đen. Đây là thứ ĐẦU TIÊN người dùng thấy khi mở app, nó đặt kỳ vọng
       cho toàn bộ phần còn lại.

       ⚠️ Icon lấy từ `public/icon.png` — CHÍNH tệp `build/icon.png` dùng làm
       icon app, chép sang để Vite gói vào bundle. Một bản sao khác là hai thứ
       sẽ lệch nhau vào ngày ai đó đổi icon app. */
    <div className="ct-dangnhap">
      <div className="ct-dangnhap-nen" aria-hidden />

      <section className="ct-dangnhap-the">
        <div className="ct-dangnhap-hieu">
          {/* `alt=""` + `aria-hidden`: tên app nằm ngay dưới dạng chữ, đọc lại
              lần nữa qua ảnh là thừa với trình đọc màn hình. */}
          <img className="ct-dangnhap-icon" src="/icon.png" alt="" aria-hidden />
          <h1>CuongThai</h1>
          <p>Chào mừng trở lại</p>
        </div>

        {/* Hai tab như iOS. "Đăng ký" mở trên web: luồng đó cần email + captcha,
            làm lại trong app chỉ để trùng lặp một thứ đã chạy tốt. */}
        <div className="ct-dangnhap-tab" role="tablist">
          <button type="button" role="tab" aria-selected="true" data-chon="1">
            Đăng nhập
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            onClick={() => openWeb('/register')}
            title="Mở trang đăng ký trên cuongthai.com"
          >
            Đăng ký
          </button>
        </div>

        {!online && (
          <div className="ct-notice" data-tone="warn" style={{ marginBottom: 12 }}>
            <WifiOff size={15} aria-hidden />
            <span>Đang ngoại tuyến. Đăng nhập cần mạng — máy chủ phải xác thực tài khoản.</span>
          </div>
        )}

        <form onSubmit={(event) => void onSubmit(event)}>
          <label className="ct-input-group">
            <span>Tên đăng nhập</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              required
              disabled={busy}
            />
          </label>

          <label className="ct-input-group">
            <span>Mật khẩu</span>
            {/* Nút hiện/ẩn mật khẩu. Không phải tiện nghi thừa: gõ mù một chuỗi
                dài rồi nhận "sai mật khẩu" mà không biết mình gõ nhầm ở đâu là
                cách nhanh nhất để người dùng nghĩ app hỏng. */}
            <div className="ct-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={busy}
              />
              <button
                type="button"
                className="ct-input-affix"
                onClick={() => setShowPassword((value) => !value)}
                // `aria-pressed` để trình đọc màn hình biết đây là công tắc hai
                // trạng thái, không phải nút bấm một lần.
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
              </button>
            </div>
          </label>

          {error && (
            <div className="ct-notice" data-tone="err" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ct-btn"
            style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
            disabled={busy || !online}
          >
            <LogIn size={15} aria-hidden />
            {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>

        <div className="ct-dangnhap-hoac"><span>hoặc</span></div>

        {/* Ba nút mở TRÌNH DUYỆT HỆ THỐNG. Token quay về qua cổng vòng
            `127.0.0.1` — không đi qua deep link của hệ điều hành, nơi nó lọt
            vào log và bất kỳ app nào cũng đăng ký cướp được scheme. */}
        <div className="ct-dangnhap-ngoai">
          {nhaBat.has('apple') && (
          <button type="button" disabled={!online || dangCho !== null}
            onClick={() => dangNhapNgoai('apple')}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
              <path d="M16.36 12.76c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.31 1.15-.05 1.58-.74 2.97-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.43-3.7zM14.1 5.6c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.77-.96 2.81 1.01.08 2.05-.51 2.69-1.28z"/>
            </svg>
            {dangCho === 'apple' ? 'Đang chờ trình duyệt…' : 'Tiếp tục với Apple'}
          </button>
          )}

          <button type="button" disabled={!online || dangCho !== null}
            onClick={() => dangNhapNgoai('google')}>
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {dangCho === 'google' ? 'Đang chờ trình duyệt…' : 'Tiếp tục với Google'}
          </button>

          <button type="button" disabled={!online || dangCho !== null}
            onClick={() => dangNhapNgoai('github')}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {dangCho === 'github' ? 'Đang chờ trình duyệt…' : 'Tiếp tục với GitHub'}
          </button>
        </div>

        {dangCho !== null && (
          <p className="ct-dangnhap-nhac">
            Đã mở trình duyệt. Đăng nhập ở đó rồi quay lại — app sẽ tự nhận.
          </p>
        )}

        <div className="ct-dangnhap-lien">
          {/* Quên mật khẩu và đăng ký mở trên web: cả hai luồng cần email và
              captcha, làm lại trong app chỉ để trùng lặp một thứ đã chạy tốt. */}
          <button type="button" onClick={() => openWeb('/forgot-password')}>
            Quên mật khẩu?
          </button>
          <button type="button" onClick={() => openWeb('/register')}>
            Tạo tài khoản
          </button>
        </div>
      </section>
    </div>
  );
}
