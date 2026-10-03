'use client';

/**
 * Hộp nhập mã xác thực 2 lớp (step-up) — MỘT bản cho cả site, mount ở layout
 * gốc. Không tự mở: interceptor trong `lib/api.ts` gặp 403 `MFA_REQUIRED` thì
 * gọi `yeuCauXacMinhMfa()` ⇒ hộp này hiện, xác minh xong trả `true` để
 * interceptor THỬ LẠI request gốc. Nhiều request cùng 403 ⇒ vẫn một hộp.
 *
 * Mount ở gốc (không chỉ /admin) vì quyền admin còn dùng ở ngoài khung admin:
 * xoá bài/bình luận người khác trên feed, hàng đợi hỗ trợ ở /messages…
 *
 * Màu theo biến của site (`--bg-card`, `--text-primary`…) nên tự đúng ở cả
 * `html.light` lẫn `html.theme-dark` — KHÔNG dùng `dark:` (dành riêng Notes).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck } from 'lucide-react';
import { dangKyHopMfa, loiMfaTuApi, mfaApi } from '@/lib/api';
import { useAdminT } from '@/components/admin/i18n';

export default function MfaStepUpDialog() {
  const { L } = useAdminT();
  const [open, setOpen] = useState(false);
  const [dungKhoiPhuc, setDungKhoiPhuc] = useState(false);
  const [ma, setMa] = useState('');
  const [loi, setLoi] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const traLoi = useRef<((ok: boolean) => void) | null>(null);
  const oNhap = useRef<HTMLInputElement>(null);

  useEffect(
    () =>
      dangKyHopMfa(
        () =>
          new Promise<boolean>((resolve) => {
            traLoi.current = resolve;
            setMa('');
            setLoi('');
            setDungKhoiPhuc(false);
            setOpen(true);
          }),
      ),
    [],
  );

  const dong = useCallback((ok: boolean) => {
    traLoi.current?.(ok);
    traLoi.current = null;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => oNhap.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dong(false); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [open, dungKhoiPhuc, dong]);

  const gui = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = ma.trim();
    if (!v || dangGui) return;
    if (!dungKhoiPhuc && !/^\d{6}$/.test(v.replace(/\s/g, ''))) {
      setLoi(L('Enter the 6-digit code from your authenticator app.', 'Nhập mã 6 số trong app xác thực.'));
      return;
    }
    setDangGui(true);
    setLoi('');
    try {
      await mfaApi.verify(dungKhoiPhuc ? { recoveryCode: v } : { code: v.replace(/\s/g, '') });
      dong(true);
    } catch (err) {
      setLoi(loiMfaTuApi(err, L('Verification failed.', 'Xác minh không thành công.')));
      setMa('');
      oNhap.current?.focus();
    } finally {
      setDangGui(false);
    }
  };

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="mfa-stepup-title">
      <div className="absolute inset-0 bg-black/55" onClick={() => dong(false)} aria-hidden />
      <form
        onSubmit={gui}
        className="relative w-full max-w-[380px] rounded-[14px] border p-5 shadow-2xl"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: 'var(--accent-color)' }} strokeWidth={2} />
          <h2 id="mfa-stepup-title" className="text-[15px] font-semibold">
            {L('Two-factor verification', 'Xác minh 2 lớp')}
          </h2>
        </div>
        <p className="mb-4 text-[13px] leading-5" style={{ color: 'var(--text-secondary)' }}>
          {dungKhoiPhuc
            ? L('Enter one of your recovery codes. Each code works only once.', 'Nhập một mã khôi phục. Mỗi mã chỉ dùng được một lần.')
            : L('This admin action needs a fresh code from your authenticator app.', 'Việc quản trị này cần mã mới từ app xác thực của bạn.')}
        </p>

        <input
          ref={oNhap}
          value={ma}
          onChange={(e) => setMa(dungKhoiPhuc ? e.target.value : e.target.value.replace(/[^\d\s]/g, '').slice(0, 7))}
          inputMode={dungKhoiPhuc ? 'text' : 'numeric'}
          autoComplete="one-time-code"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={dungKhoiPhuc ? 'xxxxx-xxxxx' : '123456'}
          aria-label={dungKhoiPhuc ? L('Recovery code', 'Mã khôi phục') : L('6-digit code', 'Mã 6 số')}
          className="h-11 w-full rounded-[10px] border px-3 text-center font-mono text-[18px] tracking-[0.25em] outline-none focus:ring-2"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        />

        {loi && (
          <p className="mt-2 text-[12.5px]" role="alert" style={{ color: '#e5484d' }}>
            {loi}
          </p>
        )}

        <button
          type="button"
          onClick={() => { setDungKhoiPhuc((x) => !x); setMa(''); setLoi(''); }}
          className="mt-3 text-[12.5px] underline-offset-2 hover:underline"
          style={{ color: 'var(--accent-color)' }}
        >
          {dungKhoiPhuc
            ? L('Use authenticator code instead', 'Dùng mã từ app xác thực')
            : L('Lost your phone? Use a recovery code', 'Mất điện thoại? Dùng mã khôi phục')}
        </button>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => dong(false)}
            className="h-9 rounded-[10px] border px-4 text-[13px] font-medium"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            {L('Cancel', 'Huỷ')}
          </button>
          <button
            type="submit"
            disabled={dangGui || !ma.trim()}
            className="h-9 rounded-[10px] px-4 text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-color)' }}
          >
            {dangGui ? L('Verifying…', 'Đang xác minh…') : L('Verify', 'Xác minh')}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
