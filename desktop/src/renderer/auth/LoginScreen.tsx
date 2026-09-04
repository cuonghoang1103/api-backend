/**
 * Màn hình đăng nhập.
 *
 * Đăng nhập BẮT BUỘC có mạng — backend không có cơ chế xác thực ngoại tuyến, và
 * bịa ra một cơ chế như vậy ở phía client là tự dựng một cánh cửa không ai canh.
 * Khi mất mạng, màn hình này nói thẳng ra điều đó thay vì để người dùng gõ mật
 * khẩu rồi nhận một lỗi khó hiểu.
 */
import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LogIn, WifiOff } from 'lucide-react';
import { ApiError } from '../api/client';
import { useSession } from './session';

export function LoginScreen({ online }: { online: boolean }) {
  const { login } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
