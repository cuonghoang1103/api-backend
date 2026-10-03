'use client';

/**
 * /admin/bao-mat-tai-khoan — bật/tắt xác thực 2 lớp (TOTP) cho tài khoản admin.
 *
 * Mô hình STEP-UP: đăng nhập không đổi; khi MFA bật, việc quản trị đòi một mã
 * mới mỗi `ttlHours` giờ (hộp nhập mã toàn cục — `MfaStepUpDialog`).
 *
 * Các bước bật: tạo khoá → quét QR (vẽ TẠI CHỖ bằng qrcode.react — secret
 * không bao giờ rời trình duyệt tới dịch vụ QR nào) hoặc gõ tay secret →
 * nhập mã 6 số → nhận 10 mã khôi phục (chỉ hiện MỘT lần, có nút chép/tải).
 */
import { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Copy, Download, KeyRound, ShieldCheck, ShieldOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { PageHeader, Section, Status } from '@/components/admin/ui';
import { useAdminT } from '@/components/admin/i18n';
import { loiMfaTuApi, mfaApi, yeuCauXacMinhMfa, type MfaStatus } from '@/lib/api';

type Buoc = 'xem' | 'quet' | 'maKhoiPhuc';

const oNhapCls =
  'h-10 w-full max-w-[220px] rounded-[10px] border border-[var(--a-border-strong)] bg-[var(--a-raised)] px-3 font-mono text-[15px] tracking-[0.2em] text-[var(--a-text)] outline-none placeholder:text-[var(--a-text-3)] focus:border-[var(--a-accent-border)]';

function nhomSecret(s: string): string {
  return s.replace(/(.{4})/g, '$1 ').trim();
}

export default function BaoMatTaiKhoanPage() {
  const { L, vi } = useAdminT();
  const [st, setSt] = useState<MfaStatus | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [buoc, setBuoc] = useState<Buoc>('xem');
  const [thietLap, setThietLap] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [ma, setMa] = useState('');
  const [maKhoiPhuc, setMaKhoiPhuc] = useState<string[] | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState('');
  // Ô cho tắt MFA / sinh lại mã
  const [hanhDong, setHanhDong] = useState<'tat' | 'sinhLai' | null>(null);
  const [maHanhDong, setMaHanhDong] = useState('');
  const [tatBangKhoiPhuc, setTatBangKhoiPhuc] = useState(false);

  const tai = useCallback(async () => {
    try {
      setSt(await mfaApi.status());
    } catch (e) {
      toast.error(loiMfaTuApi(e, 'Không tải được trạng thái MFA. / Could not load MFA status.'));
    } finally {
      setDangTai(false);
    }
  }, []); // KHÔNG phụ thuộc L: L đổi mỗi lần render ⇒ effect gọi API vô hạn.

  useEffect(() => { void tai(); }, [tai]);

  const batDau = async () => {
    setDangGui(true);
    setLoi('');
    try {
      const r = await mfaApi.setup();
      setThietLap(r);
      setMa('');
      setBuoc('quet');
    } catch (e) {
      toast.error(loiMfaTuApi(e, L('Could not create a key.', 'Không tạo được khoá.')));
    } finally {
      setDangGui(false);
    }
  };

  const bat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(ma)) { setLoi(L('Enter the 6-digit code.', 'Nhập đủ mã 6 số.')); return; }
    setDangGui(true);
    setLoi('');
    try {
      const r = await mfaApi.enable(ma);
      setMaKhoiPhuc(r.recoveryCodes);
      setThietLap(null);
      setBuoc('maKhoiPhuc');
      toast.success(L('Two-factor authentication is on.', 'Đã bật xác thực 2 lớp.'));
    } catch (err) {
      setLoi(loiMfaTuApi(err, L('Wrong code.', 'Mã không đúng.')));
      setMa('');
    } finally {
      setDangGui(false);
    }
  };

  const xongMaKhoiPhuc = async () => {
    setMaKhoiPhuc(null);
    setBuoc('xem');
    await tai();
  };

  const chepMa = async () => {
    if (!maKhoiPhuc) return;
    try {
      await navigator.clipboard.writeText(maKhoiPhuc.join('\n'));
      toast.success(L('Copied.', 'Đã chép.'));
    } catch {
      toast.error(L('Copy failed — select the codes manually.', 'Không chép được — hãy bôi đen và chép tay.'));
    }
  };

  const taiMa = () => {
    if (!maKhoiPhuc) return;
    const noiDung =
      `CuongThai — ${L('MFA recovery codes', 'Mã khôi phục MFA')}\n` +
      `${new Date().toISOString()}\n` +
      `${L('Each code works once. Keep this file offline.', 'Mỗi mã dùng được một lần. Cất file này ngoài máy/ngoại tuyến.')}\n\n` +
      maKhoiPhuc.join('\n') + '\n';
    const url = URL.createObjectURL(new Blob([noiDung], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cuongthai-ma-khoi-phuc-mfa.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const guiHanhDong = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = maHanhDong.trim();
    if (!v) return;
    setDangGui(true);
    setLoi('');
    try {
      if (hanhDong === 'tat') {
        await mfaApi.disable(tatBangKhoiPhuc ? { recoveryCode: v } : { code: v });
        toast.success(L('Two-factor authentication is off.', 'Đã tắt xác thực 2 lớp.'));
        setHanhDong(null);
        await tai();
      } else if (hanhDong === 'sinhLai') {
        const r = await mfaApi.regenerateRecoveryCodes(v);
        setMaKhoiPhuc(r.recoveryCodes);
        setHanhDong(null);
        setBuoc('maKhoiPhuc');
      }
      setMaHanhDong('');
    } catch (err) {
      setLoi(loiMfaTuApi(err, L('Wrong code.', 'Mã không đúng.')));
      setMaHanhDong('');
    } finally {
      setDangGui(false);
    }
  };

  const xacMinhNgay = async () => {
    const ok = await yeuCauXacMinhMfa();
    if (ok) {
      toast.success(L('Verified.', 'Đã xác minh.'));
      await tai();
    }
  };

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(vi ? 'vi-VN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  if (dangTai) {
    return <p className="text-[13px] text-[var(--a-text-3)]">{L('Loading…', 'Đang tải…')}</p>;
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={L('Account security', 'Bảo mật tài khoản')}
        description={L(
          'Two-factor authentication (TOTP) for admin actions. Sign-in is unchanged; admin actions ask for a code.',
          'Xác thực 2 lớp (TOTP) cho việc quản trị. Đăng nhập giữ nguyên; việc quản trị sẽ hỏi mã.',
        )}
      />

      {!st?.isAdmin && (
        <p className="text-[13px] text-[var(--a-text-2)]">
          {L('Only admin accounts can set up two-factor authentication here.', 'Chỉ tài khoản admin mới thiết lập xác thực 2 lớp ở đây.')}
        </p>
      )}

      {st?.isAdmin && st.enforce && !st.enabled && (
        <div className="mb-5 flex items-start gap-2 rounded-[10px] border border-[var(--a-border-strong)] bg-[var(--a-raised)] p-3 text-[13px] text-[var(--a-text-2)]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--a-orange)' }} />
          {L(
            'Two-factor authentication is required for admin accounts. Admin pages stay blocked until you turn it on.',
            'Tài khoản admin bắt buộc bật xác thực 2 lớp. Các trang quản trị sẽ bị chặn cho tới khi bạn bật.',
          )}
        </div>
      )}

      {/* ── Mã khôi phục vừa sinh (chỉ hiện một lần) ── */}
      {buoc === 'maKhoiPhuc' && maKhoiPhuc && (
        <Section title={L('Recovery codes', 'Mã khôi phục')} icon={KeyRound} className="mb-8">
          <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-[var(--a-border-strong)] bg-[var(--a-raised)] p-3 text-[13px] text-[var(--a-text-2)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--a-yellow)' }} />
            <span>
              {L(
                'Shown ONLY ONCE. Save them somewhere safe (password manager, printed copy). Each code works once if you lose your phone.',
                'Chỉ hiện MỘT LẦN. Hãy lưu chỗ an toàn (trình quản lý mật khẩu, bản in). Mất điện thoại thì mỗi mã dùng được một lần.',
              )}
            </span>
          </div>
          <ol className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 font-mono text-[14px] text-[var(--a-text)] sm:grid-cols-2">
            {maKhoiPhuc.map((m, i) => (
              <li key={m} className="flex gap-3 tabular-nums">
                <span className="w-5 text-right text-[var(--a-text-3)]">{i + 1}.</span>
                <span className="select-all">{m}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={chepMa} className="a-btn"><Copy className="h-3.5 w-3.5" />{L('Copy', 'Chép')}</button>
            <button type="button" onClick={taiMa} className="a-btn"><Download className="h-3.5 w-3.5" />{L('Download .txt', 'Tải .txt')}</button>
            <button type="button" onClick={xongMaKhoiPhuc} className="a-btn a-btn-primary">{L("I've saved them", 'Tôi đã lưu')}</button>
          </div>
        </Section>
      )}

      {/* ── Chưa bật ── */}
      {st?.isAdmin && !st.enabled && buoc !== 'maKhoiPhuc' && (
        <Section title={L('Set up', 'Thiết lập')} icon={ShieldCheck} className="mb-8">
          {buoc === 'xem' && (
            <div className="mt-3 space-y-3 text-[13px] text-[var(--a-text-2)]">
              <Status tone="gray">{L('Off', 'Đang tắt')}</Status>
              <p>
                {L(
                  'You need an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden…).',
                  'Bạn cần một app xác thực (Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden…).',
                )}
              </p>
              <button type="button" onClick={batDau} disabled={dangGui} className="a-btn a-btn-primary disabled:opacity-50">
                {dangGui ? L('Creating…', 'Đang tạo…') : L('Create key', 'Tạo khoá')}
              </button>
            </div>
          )}

          {buoc === 'quet' && thietLap && (
            <div className="mt-4 flex flex-col gap-6 md:flex-row">
              <div className="shrink-0 self-start rounded-[12px] bg-white p-3">
                <QRCodeSVG value={thietLap.otpauthUri} size={184} level="M" includeMargin={false} />
              </div>
              <div className="min-w-0 flex-1 space-y-3 text-[13px] text-[var(--a-text-2)]">
                <p>{L('1. Scan the QR code with your authenticator app.', '1. Quét mã QR bằng app xác thực.')}</p>
                <div>
                  <p className="mb-1">{L("Can't scan? Enter this key manually:", 'Không quét được? Nhập tay khoá này:')}</p>
                  <code className="block break-all rounded-[8px] bg-[var(--a-raised-2)] px-2.5 py-1.5 font-mono text-[13.5px] text-[var(--a-text)] select-all">
                    {nhomSecret(thietLap.secret)}
                  </code>
                  <a href={thietLap.otpauthUri} className="mt-1 inline-block text-[12.5px] text-[var(--a-accent-text)] hover:underline">
                    {L('Open in authenticator app (on this device)', 'Mở trong app xác thực (trên máy này)')}
                  </a>
                </div>
                <form onSubmit={bat} className="space-y-2">
                  <label className="block" htmlFor="mfa-ma-bat">{L('2. Enter the 6-digit code it shows:', '2. Nhập mã 6 số app đang hiện:')}</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      id="mfa-ma-bat"
                      value={ma}
                      onChange={(e) => setMa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      className={oNhapCls}
                    />
                    <button type="submit" disabled={dangGui || ma.length !== 6} className="a-btn a-btn-primary disabled:opacity-50">
                      {dangGui ? L('Verifying…', 'Đang xác minh…') : L('Turn on', 'Bật')}
                    </button>
                    <button type="button" onClick={() => { setBuoc('xem'); setThietLap(null); setLoi(''); }} className="a-btn">
                      {L('Cancel', 'Huỷ')}
                    </button>
                  </div>
                  {loi && <p className="text-[12.5px]" role="alert" style={{ color: 'var(--a-red)' }}>{loi}</p>}
                </form>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Đã bật ── */}
      {st?.isAdmin && st.enabled && buoc !== 'maKhoiPhuc' && (
        <Section title={L('Two-factor authentication', 'Xác thực 2 lớp')} icon={ShieldCheck} className="mb-8">
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-[13px] sm:grid-cols-[max-content_1fr]">
            <dt className="text-[var(--a-text-3)]">{L('Status', 'Trạng thái')}</dt>
            <dd><Status tone="green">{L('On', 'Đang bật')} · {fmt(st.enabledAt)}</Status></dd>
            <dt className="text-[var(--a-text-3)]">{L('This session', 'Phiên này')}</dt>
            <dd className="text-[var(--a-text-2)]">
              {st.stepUp.valid ? (
                <Status tone="green">{L('Verified until', 'Đã xác minh tới')} {fmt(st.stepUp.expiresAt)}</Status>
              ) : (
                <span className="inline-flex flex-wrap items-center gap-2">
                  <Status tone="yellow">{L('Not verified', 'Chưa xác minh')}</Status>
                  <button type="button" onClick={xacMinhNgay} className="a-btn">{L('Verify now', 'Xác minh ngay')}</button>
                </span>
              )}
            </dd>
            <dt className="text-[var(--a-text-3)]">{L('Code lifetime', 'Hiệu lực một lần nhập')}</dt>
            <dd className="text-[var(--a-text-2)]">{st.ttlHours} {L('hours', 'giờ')}</dd>
            <dt className="text-[var(--a-text-3)]">{L('Recovery codes left', 'Mã khôi phục còn')}</dt>
            <dd>
              <Status tone={st.recoveryCodesRemaining <= 2 ? 'red' : 'gray'}>{st.recoveryCodesRemaining} / 10</Status>
            </dd>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => { setHanhDong('sinhLai'); setMaHanhDong(''); setLoi(''); }} className="a-btn">
              <RefreshCw className="h-3.5 w-3.5" />{L('New recovery codes', 'Sinh lại mã khôi phục')}
            </button>
            <button type="button" onClick={() => { setHanhDong('tat'); setMaHanhDong(''); setLoi(''); setTatBangKhoiPhuc(false); }} className="a-btn">
              <ShieldOff className="h-3.5 w-3.5" style={{ color: 'var(--a-red)' }} />{L('Turn off', 'Tắt MFA')}
            </button>
          </div>

          {hanhDong && (
            <form onSubmit={guiHanhDong} className="mt-4 space-y-2 rounded-[10px] border border-[var(--a-border)] p-3 text-[13px] text-[var(--a-text-2)]">
              <p>
                {hanhDong === 'tat'
                  ? L('Confirm with a code to turn two-factor authentication off.', 'Xác nhận bằng mã để tắt xác thực 2 lớp.')
                  : L('Confirm with an authenticator code. Old recovery codes stop working.', 'Xác nhận bằng mã từ app xác thực. Mã khôi phục cũ sẽ hết hiệu lực.')}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={maHanhDong}
                  onChange={(e) =>
                    setMaHanhDong(tatBangKhoiPhuc ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  inputMode={tatBangKhoiPhuc ? 'text' : 'numeric'}
                  autoComplete="one-time-code"
                  placeholder={tatBangKhoiPhuc ? 'xxxxx-xxxxx' : '123456'}
                  aria-label={tatBangKhoiPhuc ? L('Recovery code', 'Mã khôi phục') : L('6-digit code', 'Mã 6 số')}
                  className={oNhapCls}
                  autoFocus
                />
                <button type="submit" disabled={dangGui || !maHanhDong.trim()} className="a-btn a-btn-primary disabled:opacity-50">
                  {hanhDong === 'tat' ? L('Turn off', 'Tắt') : L('Generate', 'Sinh mã')}
                </button>
                <button type="button" onClick={() => { setHanhDong(null); setLoi(''); }} className="a-btn">{L('Cancel', 'Huỷ')}</button>
              </div>
              {hanhDong === 'tat' && (
                <button
                  type="button"
                  onClick={() => { setTatBangKhoiPhuc((x) => !x); setMaHanhDong(''); }}
                  className="text-[12.5px] text-[var(--a-accent-text)] hover:underline"
                >
                  {tatBangKhoiPhuc ? L('Use authenticator code', 'Dùng mã từ app') : L('Use a recovery code', 'Dùng mã khôi phục')}
                </button>
              )}
              {loi && <p className="text-[12.5px]" role="alert" style={{ color: 'var(--a-red)' }}>{loi}</p>}
            </form>
          )}
        </Section>
      )}
    </div>
  );
}
