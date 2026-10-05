/**
 * Hộp xác minh MFA cho thao tác quản trị trong app (05/10/2026).
 *
 * Bật khi một lời gọi quản trị gặp 403 MFA_REQUIRED (adminApi.ts). Nhập mã 6 số từ app
 * xác thực (hoặc mã khôi phục) → POST /auth/mfa/verify → máy chủ cấp token mới có claim
 * `mfaAt` (hiệu lực ADMIN_MFA_TTL_HOURS, mặc định 12 giờ) → ghi vào phiên app → các lời
 * gọi đang chờ được gọi lại. Đóng hộp = huỷ, lời gọi báo lỗi rõ ràng.
 */
import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, KeyRound, X, Loader2 } from 'lucide-react';
import { useSession } from '../../auth/session';
import { ketThucMfa, ngheYeuCauMfa } from './adminApi';
import './quanTri.css';

export function XacMinhMfa() {
  const { api, user } = useSession();
  const [mo, setMo] = useState<null | 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED'>(null);
  const [so, setSo] = useState<string[]>(Array(6).fill(''));
  const [khoiPhuc, setKhoiPhuc] = useState(false);
  const [maKP, setMaKP] = useState('');
  const [dang, setDang] = useState(false);
  const [loi, setLoi] = useState('');
  const o = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => ngheYeuCauMfa((loai) => { setMo(loai); setSo(Array(6).fill('')); setLoi(''); setMaKP(''); setKhoiPhuc(false); }), []);
  useEffect(() => { if (mo === 'MFA_REQUIRED') setTimeout(() => o.current[0]?.focus(), 60); }, [mo]);

  const dong = () => { setMo(null); ketThucMfa(false); };

  const gui = async (ma: string) => {
    if (!api || dang) return;
    setDang(true); setLoi('');
    try {
      const res = await fetch(`${api.baseUrlForForms()}/api/v1/auth/mfa/verify`, {
        method: 'POST',
        headers: { ...api.authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(khoiPhuc ? { recoveryCode: ma } : { code: ma }),
        credentials: 'omit',
      });
      const j = await res.json().catch(() => null) as { data?: { token?: string }; message?: string } | null;
      if (!res.ok || !j?.data?.token) throw new Error(j?.message ?? 'Mã không đúng.');
      api.setToken(j.data.token);
      if (user) void window.cuongthai?.auth.storeSession({ userId: user.userId, sessionToken: j.data.token });
      setMo(null);
      ketThucMfa(true);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
      setSo(Array(6).fill(''));
      setTimeout(() => o.current[0]?.focus(), 30);
    } finally {
      setDang(false);
    }
  };

  const doiO = (i: number, v: string) => {
    const chu = v.replace(/\D/g, '');
    if (chu.length > 1) { // dán cả mã
      const moi = chu.slice(0, 6).split('');
      const day = [...moi, ...Array(6 - moi.length).fill('')];
      setSo(day);
      if (moi.length === 6) void gui(moi.join(''));
      else o.current[moi.length]?.focus();
      return;
    }
    const moi = [...so]; moi[i] = chu; setSo(moi);
    if (chu && i < 5) o.current[i + 1]?.focus();
    if (moi.every((x) => x)) void gui(moi.join(''));
  };

  if (!mo) return null;
  return (
    <div className="ct-qt-mfa-nen" role="dialog" aria-modal="true" aria-label="Xác minh quản trị">
      <div className="ct-qt-mfa">
        <button type="button" className="ct-qt-mfa-dong" onClick={dong} aria-label="Đóng"><X size={18} /></button>
        <div className="ct-qt-mfa-icon"><ShieldCheck size={30} /></div>
        {mo === 'MFA_SETUP_REQUIRED' ? (
          <>
            <h2>Cần bật xác thực 2 lớp</h2>
            <p>Máy chủ yêu cầu tài khoản quản trị bật MFA trước. Bật ở trang web <code>/admin/bao-mat-tai-khoan</code> rồi quay lại đây.</p>
            <button type="button" className="ct-qt-nut" onClick={dong}>Đã hiểu</button>
          </>
        ) : (
          <>
            <h2>Xác minh quản trị</h2>
            <p>{khoiPhuc ? 'Nhập một mã khôi phục (mỗi mã dùng được một lần).' : 'Nhập mã 6 số trong ứng dụng xác thực (Google Authenticator, 1Password…). Xác minh một lần dùng được 12 giờ.'}</p>
            {khoiPhuc ? (
              <form className="ct-qt-mfa-kp" onSubmit={(e) => { e.preventDefault(); if (maKP.trim()) void gui(maKP.trim()); }}>
                <input value={maKP} onChange={(e) => setMaKP(e.target.value)} placeholder="xxxx-xxxx" autoFocus spellCheck={false} />
                <button type="submit" className="ct-qt-nut" disabled={dang || !maKP.trim()}>{dang ? <Loader2 size={16} className="ct-spin" /> : 'Xác minh'}</button>
              </form>
            ) : (
              <div className="ct-qt-mfa-o" data-loi={!!loi}>
                {so.map((x, i) => (
                  <input
                    key={i}
                    ref={(el) => { o.current[i] = el; }}
                    value={x}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => doiO(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !x && i > 0) o.current[i - 1]?.focus(); }}
                    disabled={dang}
                    aria-label={`Số thứ ${i + 1}`}
                  />
                ))}
              </div>
            )}
            {loi && <p className="ct-qt-mfa-loi">{loi}</p>}
            {dang && !khoiPhuc && <p className="ct-qt-mfa-dang"><Loader2 size={14} className="ct-spin" /> Đang xác minh…</p>}
            <button type="button" className="ct-qt-mfa-doi" onClick={() => { setKhoiPhuc((k) => !k); setLoi(''); }}>
              <KeyRound size={14} /> {khoiPhuc ? 'Dùng mã 6 số' : 'Dùng mã khôi phục'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
